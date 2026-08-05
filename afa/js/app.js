/* =============================================================
   AFA — application (routeur, quiz, examen, flashcards, stats)
   Aucune dépendance externe.
   ============================================================= */
(function () {
  'use strict';

  const MODULES = window.AFA_MODULES || [];
  const GLOSSAIRE = window.AFA_GLOSSAIRE || [];
  const app = document.getElementById('app');

  /* ---------- Réglages de l'examen blanc ---------- */
  const EXAM = { count: 40, minutes: 45, pass: 70 };

  /* Longueur des séries de quiz. La banque compte plusieurs centaines de
     questions : par défaut on tire une série courte plutôt que tout le module. */
  const LENGTHS = [10, 20, 40, 0]; // 0 = toutes les questions
  let quizLen = 20;

  /* Niveau : 'tous' ou 'hard' (questions marquées lvl:'hard'). */
  const LEVELS = [['tous', 'Tous niveaux'], ['hard', 'Difficiles'], ['src', 'Avec source officielle']];
  let quizLvl = 'tous';
  const byLevel = (list) => quizLvl === 'tous' ? list : list.filter(q => q.lvl === quizLvl);

  /* =========================================================
     Utilitaires
     ========================================================= */
  const esc = (s) => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const sameSet = (a, b) =>
    a.length === b.length && a.slice().sort().every((v, i) => v === b.slice().sort()[i]);

  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
  const moduleById = (id) => MODULES.find(m => m.id === id);
  const chapterById = (mod, cid) => mod && mod.chapters.find(c => c.id === cid);
  const allQuestions = () => MODULES.flatMap(m => m.questions.map(q => ({ ...q, mod: m.id })));
  const letters = 'ABCDE';

  /* Ligne « source » affichée sous la correction, pour les questions
     dont le fait a été contrôlé contre une publication officielle. */
  function srcLine(q) {
    if (!q.src) return '';
    return `<p class="srcline">Source&nbsp;: <a href="${esc(q.src.u)}" target="_blank" rel="noopener noreferrer">${esc(q.src.t)}</a></p>`;
  }

  function mmss(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  /* =========================================================
     Stockage de la progression
     ========================================================= */
  const KEY = 'afa_progress_v1';
  const Store = {
    data: { q: {}, exams: [], read: {}, flash: {} },

    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.data = Object.assign({ q: {}, exams: [], read: {}, flash: {} }, parsed);
        }
      } catch (e) { /* stockage indisponible : on continue en mémoire */ }
      return this;
    },
    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) { /* quota / mode privé */ }
    },
    recordAnswer(qid, ok) {
      const s = this.data.q[qid] || { seen: 0, ok: 0, ko: 0, last: null };
      s.seen++;
      ok ? s.ok++ : s.ko++;
      s.last = ok;
      this.data.q[qid] = s;
      this.save();
    },
    recordExam(res) {
      this.data.exams.unshift(res);
      this.data.exams = this.data.exams.slice(0, 20);
      this.save();
    },
    markRead(mid, cid) {
      this.data.read[mid + '/' + cid] = Date.now();
      this.save();
    },
    isRead(mid, cid) { return !!this.data.read[mid + '/' + cid]; },
    stat(qid) { return this.data.q[qid] || { seen: 0, ok: 0, ko: 0, last: null }; },
    reset() {
      this.data = { q: {}, exams: [], read: {}, flash: {} };
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  }.load();

  /* Sélectionne n questions dans un lot, en donnant la priorité à celles
     qui ont été ratées, puis à celles jamais vues. n <= 0 = tout le lot. */
  function pickQuestions(pool, n) {
    if (!n || n >= pool.length) return shuffle(pool);
    const weak = [], unseen = [], known = [];
    pool.forEach(q => {
      const s = Store.stat(q.id);
      if (s.last === false) weak.push(q);
      else if (s.seen === 0) unseen.push(q);
      else known.push(q);
    });
    const out = shuffle(weak).concat(shuffle(unseen), shuffle(known)).slice(0, n);
    return shuffle(out);
  }

  /* Questions ratées ou jamais réussies au dernier essai */
  function weakQuestions() {
    return allQuestions().filter(q => {
      const s = Store.stat(q.id);
      return s.seen > 0 && s.last === false;
    });
  }

  function moduleProgress(mod) {
    const total = mod.questions.length;
    let mastered = 0, seen = 0;
    mod.questions.forEach(q => {
      const s = Store.stat(q.id);
      if (s.seen > 0) seen++;
      if (s.last === true) mastered++;
    });
    return { total, seen, mastered, pct: pct(mastered, total) };
  }

  /* =========================================================
     Session de quiz
     ========================================================= */
  let session = null;
  let tick = null;

  function startSession(opts) {
    stopTimer();
    session = {
      title: opts.title,
      subtitle: opts.subtitle || '',
      questions: opts.questions,
      idx: 0,
      selected: [],
      revealed: false,
      results: [],
      isExam: !!opts.isExam,
      backHash: opts.backHash || '#/quiz',
      remaining: opts.minutes ? opts.minutes * 60 : null,
      startedAt: Date.now()
    };
    // On remplace l'entrée d'historique plutôt que d'en empiler une : le bouton
    // « retour » ramène ainsi à la liste des quiz au lieu de relancer la série.
    // L'opération est cosmétique et peut échouer en contexte embarqué.
    currentRoute = '#/session';
    try { history.replaceState(null, '', '#/session'); } catch (e) { /* contexte embarqué */ }
    render();
  }

  function stopTimer() {
    if (tick) { clearInterval(tick); tick = null; }
  }

  function startTimer() {
    stopTimer();
    if (!session || session.remaining === null) return;
    tick = setInterval(() => {
      if (!session) { stopTimer(); return; }
      session.remaining--;
      const el = document.getElementById('timer');
      if (el) {
        el.textContent = mmss(Math.max(0, session.remaining));
        el.classList.toggle('warn', session.remaining <= 300);
      }
      if (session.remaining <= 0) {
        stopTimer();
        finishSession(true);
      }
    }, 1000);
  }

  function finishSession(timeout) {
    stopTimer();
    if (!session) return;
    // Les questions non traitées comptent comme fausses
    while (session.results.length < session.questions.length) {
      const q = session.questions[session.results.length];
      session.results.push({ q, given: [], ok: false, skipped: true });
      Store.recordAnswer(q.id, false);
    }
    session.done = true;
    session.timeout = !!timeout;
    if (session.isExam) {
      const ok = session.results.filter(r => r.ok).length;
      Store.recordExam({
        date: Date.now(),
        score: ok,
        total: session.questions.length,
        pct: pct(ok, session.questions.length),
        passed: pct(ok, session.questions.length) >= EXAM.pass
      });
    }
    render();
  }

  /* =========================================================
     Vues
     ========================================================= */

  function viewHome() {
    const totalQ = allQuestions().length;
    const answered = Object.keys(Store.data.q).length;
    const mastered = allQuestions().filter(q => Store.stat(q.id).last === true).length;
    const weak = weakQuestions().length;

    return `
      <section class="hero">
        <span class="tag red">Brevet AFA · Suisse</span>
        <h1>Préparez les deux premiers modules de l'AFA</h1>
        <p class="lead">
          Fiches de cours, questions à choix multiples commentées, examen blanc chronométré et
          flashcards pour <b>Industrie de l'assurance</b> et <b>Droit de l'assurance</b> — les deux premiers
          modules de la formation d'intermédiaire en assurance AFA.
        </p>
        <div class="row">
          <a class="btn primary" href="#/quiz">Commencer un quiz</a>
          <a class="btn" href="#/cours">Réviser le cours</a>
          <a class="btn ghost" href="#/examen">Examen blanc (${EXAM.count} questions)</a>
        </div>
      </section>

      <div class="grid three" style="margin-bottom:1.6rem">
        <div class="card stat"><span class="n">${totalQ}</span><span class="l">questions</span></div>
        <div class="card stat"><span class="n">${mastered}</span><span class="l">acquises</span></div>
        <div class="card stat"><span class="n">${answered}</span><span class="l">travaillées</span></div>
        <div class="card stat"><span class="n">${weak}</span><span class="l">à revoir</span></div>
      </div>

      <h2>Les modules</h2>
      <div class="grid two">
        ${MODULES.map(m => {
          const p = moduleProgress(m);
          return `
          <div class="card modcard">
            <div class="mhead">
              <div class="micon">${m.icon}</div>
              <div>
                <span class="tag ${m.color}">${esc(m.code)}</span>
                <h3 style="margin:.25rem 0 0">${esc(m.title)}</h3>
              </div>
            </div>
            <p class="muted small" style="margin:0">${esc(m.subtitle)}</p>
            <div>
              <div class="row small muted" style="justify-content:space-between;margin-bottom:.3rem">
                <span>${m.chapters.length} chapitres · ${m.questions.length} questions</span>
                <span>${p.pct}%</span>
              </div>
              <div class="bar"><i style="width:${p.pct}%"></i></div>
            </div>
            <div class="row">
              <a class="btn sm" href="#/cours/${m.id}">Cours</a>
              <a class="btn sm primary" href="#/quiz/${m.id}">Quiz du module</a>
            </div>
          </div>`;
        }).join('')}
      </div>

      ${weak ? `
      <div class="card" style="margin-top:1.6rem">
        <h3>Reprendre vos erreurs</h3>
        <p class="muted small">Vous avez ${weak} question${weak > 1 ? 's' : ''} manquée${weak > 1 ? 's' : ''} au dernier passage. C'est le meilleur entraînement disponible.</p>
        <a class="btn primary" href="#/quiz/erreurs">Réviser mes erreurs</a>
      </div>` : ''}
    `;
  }

  function viewCoursIndex() {
    return `
      <h1>Cours</h1>
      <p class="muted">Fiches synthétiques par chapitre, avec les points à retenir et les renvois aux articles de loi.</p>
      ${MODULES.map(m => `
        <h2 style="margin-top:2rem">${m.icon} ${esc(m.title)}</h2>
        <div class="chaplist">
          ${m.chapters.map((c, i) => `
            <a class="chapitem" href="#/cours/${m.id}/${c.id}">
              <span class="num">${i + 1}</span>
              <span>
                <span class="t">${esc(c.title)} ${Store.isRead(m.id, c.id) ? '<span class="tag green">lu</span>' : ''}</span><br>
                <span class="d">${esc(c.resume)}</span>
              </span>
            </a>`).join('')}
        </div>
      `).join('')}
    `;
  }

  function viewCoursModule(mid) {
    const m = moduleById(mid);
    if (!m) return viewCoursIndex();
    const p = moduleProgress(m);
    return `
      <div class="breadcrumb"><a href="#/cours">Cours</a> › ${esc(m.title)}</div>
      <h1>${m.icon} ${esc(m.title)}</h1>
      <p class="muted">${esc(m.subtitle)}</p>
      <div class="card" style="margin:1.2rem 0">
        <div class="row small muted" style="justify-content:space-between;margin-bottom:.35rem">
          <span>Progression du module</span><span>${p.mastered}/${p.total} questions acquises</span>
        </div>
        <div class="bar"><i style="width:${p.pct}%"></i></div>
        <div class="row" style="margin-top:1rem">
          <a class="btn primary sm" href="#/quiz/${m.id}">Quiz complet du module</a>
        </div>
      </div>
      <div class="chaplist">
        ${m.chapters.map((c, i) => `
          <a class="chapitem" href="#/cours/${m.id}/${c.id}">
            <span class="num">${i + 1}</span>
            <span>
              <span class="t">${esc(c.title)} ${Store.isRead(m.id, c.id) ? '<span class="tag green">lu</span>' : ''}</span><br>
              <span class="d">${esc(c.resume)}</span>
            </span>
          </a>`).join('')}
      </div>
    `;
  }

  function viewLesson(mid, cid) {
    const m = moduleById(mid);
    const c = chapterById(m, cid);
    if (!m || !c) return viewCoursIndex();
    Store.markRead(mid, cid);
    const i = m.chapters.indexOf(c);
    const prev = m.chapters[i - 1], next = m.chapters[i + 1];
    const nq = m.questions.filter(q => q.chap === cid).length;

    // Les tableaux sont enveloppés pour rester lisibles sur mobile
    const body = c.sections.map(s => `
      <h3>${esc(s.h)}</h3>
      ${s.html.replace(/<table class="tbl">/g, '<div class="tbl-wrap"><table class="tbl">')
              .replace(/<\/table>/g, '</table></div>')}
    `).join('');

    return `
      <div class="breadcrumb">
        <a href="#/cours">Cours</a> › <a href="#/cours/${m.id}">${esc(m.title)}</a> › chapitre ${i + 1}
      </div>
      <h1>${esc(c.title)}</h1>
      <div class="card lesson">
        ${body}
        <div class="keybox">
          <h4>À retenir</h4>
          <ul>${c.keypoints.map(k => `<li>${esc(k)}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="row" style="margin-top:1.4rem">
        ${prev ? `<a class="btn" href="#/cours/${m.id}/${prev.id}">← ${esc(prev.title)}</a>` : ''}
        <span class="spacer"></span>
        ${nq ? `<a class="btn primary" href="#/quiz/${m.id}/${c.id}">S'entraîner (${nq} questions)</a>` : ''}
        ${next ? `<a class="btn" href="#/cours/${m.id}/${next.id}">${esc(next.title)} →</a>` : ''}
      </div>
    `;
  }

  function viewQuizIndex() {
    const weak = weakQuestions();
    return `
      <h1>Quiz</h1>
      <p class="muted">Chaque réponse est commentée. Choisissez un module entier ou un chapitre précis.</p>

      <div class="card" style="margin-bottom:1.6rem">
        <div class="row" style="justify-content:space-between">
          <div>
            <b>Longueur de la série</b>
            <div class="muted small">Les questions ratées puis les questions jamais vues sont tirées en priorité.</div>
          </div>
          <div class="chips" id="lenChips">
            ${LENGTHS.map(n => `<button class="chip ${n === quizLen ? 'on' : ''}" data-len="${n}">${n || 'Tout'}</button>`).join('')}
          </div>
        </div>
        <div class="row" style="justify-content:space-between;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--line)">
          <div>
            <b>Niveau</b>
            <div class="muted small">${allQuestions().filter(q => q.lvl === 'hard').length} questions difficiles (calculs, cas pratiques, pièges) et ${allQuestions().filter(q => q.lvl === 'src').length} questions adossées à une source officielle citée.</div>
          </div>
          <div class="chips" id="lvlChips">
            ${LEVELS.map(([v, lab]) => `<button class="chip ${v === quizLvl ? 'on' : ''}" data-lvl="${v}">${lab}</button>`).join('')}
          </div>
        </div>
      </div>

      ${weak.length ? `
      <div class="card" style="margin-bottom:1.6rem">
        <span class="tag red">Priorité</span>
        <h3 style="margin-top:.5rem">Mes erreurs (${weak.length})</h3>
        <p class="muted small">Les questions ratées lors de votre dernier passage.</p>
        <a class="btn primary" href="#/quiz/erreurs">Réviser</a>
      </div>` : ''}

      ${MODULES.map(m => `
        <h2 style="margin-top:1.8rem">${m.icon} ${esc(m.title)}</h2>
        <div class="row" style="margin-bottom:.8rem">
          <a class="btn primary sm" href="#/quiz/${m.id}">Tout le module (${byLevel(m.questions).length} questions)</a>
        </div>
        <div class="chaplist">
          ${m.chapters.map((c, i) => {
            const qs = byLevel(m.questions.filter(q => q.chap === c.id));
            const done = qs.filter(q => Store.stat(q.id).last === true).length;
            return `
            <a class="chapitem" href="#/quiz/${m.id}/${c.id}">
              <span class="num">${i + 1}</span>
              <span style="flex:1">
                <span class="t">${esc(c.title)}</span><br>
                <span class="d">${qs.length} questions · ${done} acquises</span>
                <span class="bar thin" style="margin-top:.4rem"><i style="width:${pct(done, qs.length)}%"></i></span>
              </span>
            </a>`;
          }).join('')}
        </div>
      `).join('')}
    `;
  }

  function viewExamIntro() {
    const hist = Store.data.exams;
    return `
      <h1>Examen blanc</h1>
      <div class="card">
        <p><b>${EXAM.count} questions</b> tirées au hasard dans les deux modules, <b>${EXAM.minutes} minutes</b>,
           seuil de réussite fixé à <b>${EXAM.pass}%</b>.</p>
        <ul class="muted small">
          <li>Les commentaires ne s'affichent qu'à la fin, comme lors d'un vrai examen.</li>
          <li>Les questions sans réponse à l'échéance du temps comptent comme fausses.</li>
          <li>Certaines questions attendent <b>plusieurs</b> réponses : elles sont signalées.</li>
        </ul>
        <button class="btn primary" id="startExam">Démarrer l'examen</button>
      </div>

      ${hist.length ? `
        <h2 style="margin-top:2rem">Historique</h2>
        <div class="card">
          ${hist.map(e => `
            <div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:.6rem 0">
              <span class="small muted">${new Date(e.date).toLocaleString('fr-CH')}</span>
              <span><b>${e.score}/${e.total}</b> — ${e.pct}%
                <span class="tag ${e.passed ? 'green' : 'red'}">${e.passed ? 'réussi' : 'échoué'}</span>
              </span>
            </div>`).join('')}
        </div>` : ''}
    `;
  }

  function viewSession() {
    if (!session) return viewQuizIndex();
    if (session.done) return viewResults();

    const q = session.questions[session.idx];
    const isMulti = q.type === 'multi';
    const n = session.questions.length;

    const dots = session.questions.map((_, i) => {
      if (i < session.results.length) return `<i class="${session.results[i].ok ? 'ok' : 'ko'}"></i>`;
      if (i === session.idx) return '<i class="cur"></i>';
      return '<i></i>';
    }).join('');

    const choices = q.choices.map((c, i) => {
      const sel = session.selected.includes(i);
      let cls = 'choice';
      if (session.revealed) {
        if (q.answer.includes(i)) cls += ' ok';
        else if (sel) cls += ' ko';
      } else if (sel) cls += ' sel';
      return `<button class="${cls}" data-i="${i}" data-multi="${isMulti ? 1 : 0}" ${session.revealed ? 'disabled' : ''}>
                <span class="box">${sel || (session.revealed && q.answer.includes(i)) ? '✓' : ''}</span>
                <span><b>${letters[i]}.</b> ${esc(c)}</span>
              </button>`;
    }).join('');

    let feedback = '';
    if (session.revealed && !session.isExam) {
      const ok = sameSet(session.selected, q.answer);
      const good = q.answer.map(i => letters[i]).join(', ');
      feedback = `
        <div class="feedback ${ok ? 'good' : 'bad'}">
          <div class="verdict">${ok ? '✅ Correct' : '❌ Incorrect'} <span class="muted small">— réponse${q.answer.length > 1 ? 's' : ''} : ${good}</span></div>
          <p>${esc(q.explain)}</p>
          ${srcLine(q)}
        </div>`;
    }

    const last = session.idx === n - 1;
    return `
      <div class="qhead">
        <div>
          <div class="qcount">${esc(session.title)}</div>
          <h2 style="margin:0">Question ${session.idx + 1} <span class="muted" style="font-weight:400">/ ${n}</span></h2>
        </div>
        <span class="spacer"></span>
        ${session.remaining !== null ? `<span class="timer" id="timer">${mmss(session.remaining)}</span>` : ''}
        <button class="btn sm ghost" id="quitBtn">Quitter</button>
      </div>

      <div class="progress-dots">${dots}</div>

      <div class="card">
        ${q.lvl === 'hard' ? '<span class="tag amber" style="margin-bottom:.5rem;display:inline-block">Difficile</span>' : ''}
        ${q.lvl === 'src' ? '<span class="tag blue" style="margin-bottom:.5rem;display:inline-block">Source officielle</span>' : ''}
        <div class="question">${esc(q.q)}</div>
        ${isMulti ? '<p class="small muted" style="margin-top:-.6rem">Plusieurs réponses possibles.</p>' : ''}
        <div class="choices" id="choices">${choices}</div>
        ${feedback}
        <div class="row" style="margin-top:1.3rem">
          <span class="spacer"></span>
          ${session.revealed
            ? `<button class="btn primary" id="nextBtn">${last ? 'Voir le résultat' : 'Question suivante →'}</button>`
            : `<button class="btn primary" id="validateBtn" ${session.selected.length ? '' : 'disabled'}>Valider</button>`}
        </div>
      </div>
    `;
  }

  function viewResults() {
    const n = session.questions.length;
    const ok = session.results.filter(r => r.ok).length;
    const p = pct(ok, n);
    const passed = p >= EXAM.pass;
    const color = p >= 80 ? 'var(--green)' : p >= EXAM.pass ? 'var(--amber)' : 'var(--red)';
    const mins = Math.round((Date.now() - session.startedAt) / 60000);

    let verdict;
    if (session.isExam) {
      verdict = passed
        ? `<span class="tag green">Réussi</span> Seuil de ${EXAM.pass}% atteint.`
        : `<span class="tag red">Échoué</span> Il vous manque ${Math.ceil(n * EXAM.pass / 100) - ok} bonne${(Math.ceil(n * EXAM.pass / 100) - ok) > 1 ? 's' : ''} réponse${(Math.ceil(n * EXAM.pass / 100) - ok) > 1 ? 's' : ''} pour atteindre ${EXAM.pass}%.`;
    } else {
      verdict = p >= 80 ? 'Très bon niveau sur cette série.'
        : p >= 60 ? 'Base correcte, quelques points à consolider.'
        : 'Reprenez la fiche de cours avant de refaire la série.';
    }

    const wrong = session.results.filter(r => !r.ok);

    return `
      <h1 class="center">Résultat</h1>
      <div class="card">
        <div class="scorecircle" style="--p:${p};--c:${color}"><span>${p}%</span></div>
        <p class="center"><b>${ok} / ${n}</b> bonnes réponses ${session.timeout ? '· temps écoulé' : ''} · ${mins} min</p>
        <p class="center muted">${verdict}</p>
        <div class="row center" style="justify-content:center;margin-top:1.2rem">
          <button class="btn primary" id="againBtn">Refaire cette série</button>
          ${wrong.length ? '<button class="btn" id="redoWrongBtn">Reprendre les ' + wrong.length + ' erreurs</button>' : ''}
          <a class="btn ghost" href="${session.backHash}">Retour</a>
        </div>
      </div>

      <h2 style="margin-top:2rem">Correction détaillée</h2>
      <div class="reviewlist">
        ${session.results.map((r, i) => `
          <div class="reviewitem ${r.ok ? 'ok' : 'ko'}">
            <div class="q">${i + 1}. ${esc(r.q.q)}</div>
            <div class="a">
              Votre réponse : <b>${r.given.length ? r.given.map(x => letters[x]).join(', ') : '—'}</b>
              · Correct : <b>${r.q.answer.map(x => letters[x]).join(', ')}</b>
              <br>${r.q.answer.map(x => '<b>' + letters[x] + '.</b> ' + esc(r.q.choices[x])).join('<br>')}
              <br><span class="muted">${esc(r.q.explain)}</span>
              ${srcLine(r.q)}
            </div>
          </div>`).join('')}
      </div>
    `;
  }

  function viewFlash() {
    const cats = [...new Set(GLOSSAIRE.map(g => g.cat))];
    return `
      <h1>Flashcards &amp; glossaire</h1>
      <p class="muted">${GLOSSAIRE.length} notions. Cliquez sur la carte pour la retourner.</p>
      <div class="chips" id="flashCats">
        <button class="chip on" data-cat="*">Toutes</button>
        ${cats.map(c => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}
      </div>

      <div class="flashwrap">
        <div class="flash" id="flashcard">
          <div class="face front">
            <span class="tag" id="fcat"></span>
            <div class="term" id="fterm" style="margin-top:.6rem"></div>
            <span class="hint">Cliquer pour retourner</span>
          </div>
          <div class="face back">
            <div class="def" id="fdef"></div>
            <span class="hint">Cliquer pour revenir</span>
          </div>
        </div>
      </div>
      <div class="row" style="justify-content:center">
        <button class="btn" id="fprev">← Précédente</button>
        <span class="muted small" id="fpos"></span>
        <button class="btn" id="fnext">Suivante →</button>
        <button class="btn ghost" id="fshuffle">🔀 Mélanger</button>
      </div>

      <h2 style="margin-top:2.4rem">Glossaire</h2>
      <input type="search" id="glossSearch" placeholder="Rechercher une notion (réticence, subrogation, SST…)">
      <div class="card" style="margin-top:1rem" id="glossList"></div>
    `;
  }

  function viewStats() {
    const qs = allQuestions();
    const seen = qs.filter(q => Store.stat(q.id).seen > 0);
    const mastered = qs.filter(q => Store.stat(q.id).last === true);
    const totalAnswers = Object.values(Store.data.q).reduce((a, s) => a + s.seen, 0);
    const totalOk = Object.values(Store.data.q).reduce((a, s) => a + s.ok, 0);
    const weak = weakQuestions();

    return `
      <h1>Progression</h1>
      <div class="grid three" style="margin-bottom:1.6rem">
        <div class="card stat"><span class="n">${pct(mastered.length, qs.length)}%</span><span class="l">acquis</span></div>
        <div class="card stat"><span class="n">${seen.length}/${qs.length}</span><span class="l">questions vues</span></div>
        <div class="card stat"><span class="n">${pct(totalOk, totalAnswers)}%</span><span class="l">réussite globale</span></div>
        <div class="card stat"><span class="n">${Store.data.exams.length}</span><span class="l">examens blancs</span></div>
      </div>

      ${MODULES.map(m => `
        <h2>${m.icon} ${esc(m.title)}</h2>
        <div class="card" style="margin-bottom:1.4rem">
          ${m.chapters.map((c, i) => {
            const cq = m.questions.filter(q => q.chap === c.id);
            const done = cq.filter(q => Store.stat(q.id).last === true).length;
            const p = pct(done, cq.length);
            return `
              <div style="padding:.55rem 0">
                <div class="row small" style="justify-content:space-between">
                  <a href="#/quiz/${m.id}/${c.id}" style="text-decoration:none">${i + 1}. ${esc(c.title)}</a>
                  <span class="muted">${done}/${cq.length}</span>
                </div>
                <div class="bar thin" style="margin-top:.3rem"><i style="width:${p}%"></i></div>
              </div>`;
          }).join('')}
        </div>
      `).join('')}

      ${weak.length ? `
        <h2>Questions à retravailler (${weak.length})</h2>
        <div class="card">
          ${weak.slice(0, 25).map(q => {
            const m = moduleById(q.mod);
            const c = chapterById(m, q.chap);
            return `<div class="glossitem">
              <div class="t small">${esc(q.q)}</div>
              <div class="d small">${esc(m.code)} · ${esc(c ? c.title : '')}</div>
            </div>`;
          }).join('')}
          <div class="row" style="margin-top:1rem">
            <a class="btn primary" href="#/quiz/erreurs">Réviser ces questions</a>
          </div>
        </div>` : '<p class="muted">Aucune erreur en attente. 👌</p>'}

      <div class="card" style="margin-top:2rem">
        <h3>Données locales</h3>
        <p class="muted small">Votre progression est enregistrée dans ce navigateur uniquement (localStorage). Rien n'est envoyé sur un serveur.</p>
        <button class="btn" id="resetBtn">Réinitialiser ma progression</button>
      </div>
    `;
  }

  /* =========================================================
     Comportements après rendu
     ========================================================= */
  function wire(route) {
    if (route[0] === 'session' && session && !session.done) wireSession();
    else if (route[0] === 'session' && session && session.done) wireResults();
    else if (route[0] === 'examen') {
      const b = document.getElementById('startExam');
      if (b) b.onclick = () => startSession({
        title: 'Examen blanc',
        questions: shuffle(allQuestions()).slice(0, EXAM.count),
        isExam: true,
        minutes: EXAM.minutes,
        backHash: '#/examen'
      });
    }
    else if (route[0] === 'quiz') {
      document.querySelectorAll('#lenChips .chip').forEach(ch => {
        ch.onclick = () => {
          quizLen = +ch.dataset.len;
          try { localStorage.setItem('afa_len', quizLen); } catch (e) {}
          document.querySelectorAll('#lenChips .chip').forEach(x => x.classList.toggle('on', x === ch));
        };
      });
      document.querySelectorAll('#lvlChips .chip').forEach(ch => {
        ch.onclick = () => {
          quizLvl = ch.dataset.lvl;
          try { localStorage.setItem('afa_lvl', quizLvl); } catch (e) {}
          render();   // les effectifs par chapitre changent avec le niveau
        };
      });
    }
    else if (route[0] === 'flash') wireFlash();
    else if (route[0] === 'stats') {
      const b = document.getElementById('resetBtn');
      if (b) b.onclick = () => {
        if (confirm('Effacer toute votre progression ? Cette action est irréversible.')) {
          Store.reset();
          render();
        }
      };
    }
  }

  function wireSession() {
    const q = session.questions[session.idx];
    const box = document.getElementById('choices');
    if (box) {
      box.querySelectorAll('.choice').forEach(btn => {
        btn.onclick = () => {
          if (session.revealed) return;
          const i = +btn.dataset.i;
          if (q.type === 'multi') {
            const k = session.selected.indexOf(i);
            k === -1 ? session.selected.push(i) : session.selected.splice(k, 1);
          } else {
            session.selected = [i];
          }
          render();
        };
      });
    }

    const v = document.getElementById('validateBtn');
    if (v) v.onclick = () => {
      const ok = sameSet(session.selected, q.answer);
      session.results.push({ q, given: session.selected.slice(), ok });
      Store.recordAnswer(q.id, ok);
      if (session.isExam) nextQuestion();
      else { session.revealed = true; render(); }
    };

    const nx = document.getElementById('nextBtn');
    if (nx) nx.onclick = nextQuestion;

    const qb = document.getElementById('quitBtn');
    if (qb) qb.onclick = () => {
      if (session.results.length === 0 || confirm('Quitter la série ? Les réponses déjà validées sont enregistrées.')) {
        const back = session.backHash;
        stopTimer();
        session = null;
        go(back);
      }
    };

    if (session.remaining !== null && !tick) startTimer();
  }

  function nextQuestion() {
    if (session.idx >= session.questions.length - 1) { finishSession(false); return; }
    session.idx++;
    session.selected = [];
    session.revealed = false;
    render();
  }

  function wireResults() {
    const a = document.getElementById('againBtn');
    if (a) a.onclick = () => startSession({
      title: session.title,
      questions: shuffle(session.questions),
      isExam: session.isExam,
      minutes: session.isExam ? EXAM.minutes : null,
      backHash: session.backHash
    });

    const w = document.getElementById('redoWrongBtn');
    if (w) w.onclick = () => startSession({
      title: 'Reprise des erreurs',
      questions: shuffle(session.results.filter(r => !r.ok).map(r => r.q)),
      backHash: session.backHash
    });
  }

  /* --- Flashcards --- */
  let fcards = [], fidx = 0, fcat = '*';

  function refreshFlash() {
    const c = fcards[fidx];
    if (!c) return;
    const card = document.getElementById('flashcard');
    card.classList.remove('flip');
    document.getElementById('fcat').textContent = c.cat;
    document.getElementById('fterm').textContent = c.t;
    document.getElementById('fdef').textContent = c.d;
    document.getElementById('fpos').textContent = (fidx + 1) + ' / ' + fcards.length;
  }

  function renderGloss(filter) {
    const f = (filter || '').toLowerCase().trim();
    const list = GLOSSAIRE.filter(g =>
      !f || g.t.toLowerCase().includes(f) || g.d.toLowerCase().includes(f));
    const el = document.getElementById('glossList');
    if (!el) return;
    el.innerHTML = list.length
      ? list.map(g => `<div class="glossitem">
          <div class="t">${esc(g.t)} <span class="tag">${esc(g.cat)}</span></div>
          <div class="d">${esc(g.d)}</div>
        </div>`).join('')
      : '<div class="empty">Aucune notion ne correspond à cette recherche.</div>';
  }

  function wireFlash() {
    fcards = shuffle(fcat === '*' ? GLOSSAIRE : GLOSSAIRE.filter(g => g.cat === fcat));
    fidx = 0;
    refreshFlash();

    document.getElementById('flashcard').onclick = function () { this.classList.toggle('flip'); };
    document.getElementById('fnext').onclick = () => { fidx = (fidx + 1) % fcards.length; refreshFlash(); };
    document.getElementById('fprev').onclick = () => { fidx = (fidx - 1 + fcards.length) % fcards.length; refreshFlash(); };
    document.getElementById('fshuffle').onclick = () => { fcards = shuffle(fcards); fidx = 0; refreshFlash(); };

    document.querySelectorAll('#flashCats .chip').forEach(ch => {
      ch.onclick = () => {
        fcat = ch.dataset.cat;
        document.querySelectorAll('#flashCats .chip').forEach(x => x.classList.toggle('on', x === ch));
        fcards = shuffle(fcat === '*' ? GLOSSAIRE : GLOSSAIRE.filter(g => g.cat === fcat));
        fidx = 0;
        refreshFlash();
      };
    });

    const s = document.getElementById('glossSearch');
    s.oninput = () => renderGloss(s.value);
    renderGloss('');
  }

  /* =========================================================
     Routeur
     ========================================================= */
  /* Route courante, tenue en interne plutôt que lue dans l'URL.
     Dans un document embarqué (about:srcdoc, blob:), les liens « #/quiz » se
     résolvent contre l'adresse de la page hôte : les suivre ferait quitter
     l'application. On intercepte donc les clics et on navigue nous-mêmes. */
  let currentRoute = location.hash || '#/';

  function parseHash() {
    const h = currentRoute.replace(/^#\/?/, '');
    return h ? h.split('/').filter(Boolean) : [];
  }

  function go(hash) {
    currentRoute = hash;
    // Mise à jour de l'URL au mieux : purement cosmétique, jamais bloquante.
    try { if (location.hash !== hash) location.hash = hash; } catch (e) { /* contexte embarqué */ }
    render();
  }

  function launchQuiz(route) {
    // #/quiz/erreurs | #/quiz/:mid | #/quiz/:mid/:cid
    if (route[1] === 'erreurs') {
      const qs = weakQuestions();
      if (!qs.length) { go('#/quiz'); return true; }
      startSession({ title: 'Reprise des erreurs', questions: pickQuestions(qs, quizLen), backHash: '#/quiz' });
      return true;
    }
    const m = moduleById(route[1]);
    if (!m) return false;
    if (route[2]) {
      const c = chapterById(m, route[2]);
      if (!c) return false;
      const qs = byLevel(m.questions.filter(q => q.chap === c.id)).map(q => ({ ...q, mod: m.id }));
      if (!qs.length) { go('#/quiz'); return true; }
      startSession({ title: m.code + ' · ' + c.title, questions: pickQuestions(qs, quizLen), backHash: '#/quiz' });
    } else {
      const qs = byLevel(m.questions).map(q => ({ ...q, mod: m.id }));
      if (!qs.length) { go('#/quiz'); return true; }
      startSession({
        title: m.code + ' · ' + m.title,
        questions: pickQuestions(qs, quizLen),
        backHash: '#/quiz'
      });
    }
    return true;
  }

  function render() {
    const route = parseHash();
    const head = route[0] || 'home';
    let html;

    switch (head) {
      case 'cours':
        html = route[2] ? viewLesson(route[1], route[2])
             : route[1] ? viewCoursModule(route[1])
             : viewCoursIndex();
        break;
      case 'quiz':
        if (route.length > 1) { if (launchQuiz(route)) return; }
        html = viewQuizIndex();
        break;
      case 'examen': html = viewExamIntro(); break;
      case 'session': html = viewSession(); break;
      case 'flash':   html = viewFlash(); break;
      case 'stats':   html = viewStats(); break;
      default:        html = viewHome();
    }

    app.innerHTML = html;
    if (head !== 'session') { stopTimer(); }

    // état actif de la navigation
    document.querySelectorAll('.nav a').forEach(a => {
      const r = a.dataset.route;
      a.classList.toggle('active',
        r === head || (head === 'session' && r === 'quiz') || (head === 'home' && r === 'home'));
    });
    document.getElementById('nav').classList.remove('open');
    if (head !== 'session' || !session || session.done) window.scrollTo(0, 0);

    wire([head, route[1], route[2]]);
  }

  /* =========================================================
     Démarrage
     ========================================================= */
  try {
    const savedLen = localStorage.getItem('afa_len');
    if (savedLen !== null && LENGTHS.includes(+savedLen)) quizLen = +savedLen;
    const savedLvl = localStorage.getItem('afa_lvl');
    if (savedLvl && LEVELS.some(l => l[0] === savedLvl)) quizLvl = savedLvl;
  } catch (e) { /* stockage indisponible */ }

  const themeBtn = document.getElementById('themeBtn');
  const savedTheme = (() => { try { return localStorage.getItem('afa_theme'); } catch (e) { return null; } })();
  // Un thème déjà posé sur <html> par la page hôte est prioritaire : on ne l'écrase pas.
  if (!document.documentElement.dataset.theme) {
    if (savedTheme) document.documentElement.dataset.theme = savedTheme;
    else if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.dataset.theme = 'dark';
  }

  themeBtn.onclick = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('afa_theme', next); } catch (e) {}
  };
  document.getElementById('burger').onclick = () =>
    document.getElementById('nav').classList.toggle('open');

  // Raccourcis clavier pendant un quiz : 1-5 pour choisir, Entrée pour valider/suivant
  document.addEventListener('keydown', (e) => {
    if (!session || session.done || parseHash()[0] !== 'session') return;
    if (e.target.matches('input, textarea')) return;
    if (e.key >= '1' && e.key <= '5') {
      const b = document.querySelector('.choice[data-i="' + (+e.key - 1) + '"]');
      if (b && !b.disabled) b.click();
    } else if (e.key === 'Enter') {
      const b = document.getElementById('nextBtn') || document.getElementById('validateBtn');
      if (b && !b.disabled) b.click();
    }
  });

  // Tous les liens internes passent par le routeur : on ne laisse jamais le
  // navigateur suivre un href « #/… », qui ferait sortir d'un document embarqué.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    go(href);
  });

  // Boutons précédent/suivant du navigateur, lorsque l'URL est utilisable.
  window.addEventListener('hashchange', () => {
    if (location.hash && location.hash !== currentRoute) {
      currentRoute = location.hash;
      render();
    }
  });

  render();
})();
