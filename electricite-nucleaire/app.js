/* Coquille de l'application : sommaire, navigation par #ancre, progression, quiz. */
"use strict";

const TRACKS = {
  elec: { name: "Électricité", color: "var(--volt)", soft: "var(--volt-soft)" },
  nuc: { name: "Nucléaire", color: "var(--core)", soft: "var(--core-soft)" },
  cen: { name: "Centrales nucléaires", color: "var(--plant)", soft: "var(--plant-soft)" }
};
const TRACK_INTRO = {
  elec: "Des électrons libres au réseau européen, en passant par la guerre des courants entre Edison et Tesla.",
  nuc: "Du noyau atomique à la fission : radioactivité, demi-vie, E = mc², déchets, sûreté et fusion.",
  cen: "Comment fonctionne une centrale, de l'uranium à ta prise. Pilote un réacteur et découvre le parc français."
};
let done = new Set(store.get("done", []));
const savedTheme = store.get("theme", null);
if (savedTheme) { document.documentElement.dataset.theme = savedTheme; readTheme(); }
let cleanup = null;

const byTrack = k => LESSONS.filter(l => l.track === k);

function renderNav(active) {
  const nav = $("#sidebar");
  const item = (l, i) => `<li><a class="nav-link ${l.id === active ? "active" : ""} ${done.has(l.id) ? "done" : ""}" href="#${l.id}">
      <span class="n">${String(i + 1).padStart(2, "0")}</span><span>${l.title}</span><span class="tick" aria-label="${done.has(l.id) ? "terminée" : ""}"></span></a></li>`;
  nav.innerHTML = `
    <a class="nav-link ${!active ? "active" : ""}" href="#accueil"><span class="n">⌂</span><span>Accueil</span><span></span></a>
    ${Object.entries(TRACKS).map(([k, t]) => `
      <div class="track-title"><span class="dot" style="background:${t.color}"></span><span class="eyebrow">${t.name}</span></div>
      <ul class="nav-list">${byTrack(k).map(item).join("")}</ul>`).join("")}
    <div class="track-title"><span class="dot" style="background:var(--ok)"></span><span class="eyebrow">S'entraîner</span></div>
    <ul class="nav-list">
      <li><a class="nav-link ${active === "quiz" ? "active" : ""}" href="#quiz"><span class="n">?</span><span>Quiz final</span><span></span></a></li>
      <li><a class="nav-link ${active === "glossaire" ? "active" : ""}" href="#glossaire"><span class="n">Aa</span><span>Glossaire</span><span></span></a></li>
    </ul>`;
  $("#progress").textContent = `${done.size} / ${LESSONS.length} leçons validées`;
}

/* ---------- Accueil ---------- */
function renderHome(main) {
  const card = k => {
    const ls = byTrack(k), n = ls.filter(l => done.has(l.id)).length, t = TRACKS[k];
    return `<div class="track-card" style="--track:${t.color}">
      <div class="eyebrow" style="color:${t.color}">Parcours · ${ls.length} leçons</div>
      <h2>${t.name}</h2>
      <p class="hint">${TRACK_INTRO[k]}</p>
      <div class="bar" style="color:${t.color}"><i style="width:${n / ls.length * 100}%"></i></div>
      <span class="hint mono">${n} / ${ls.length} validées</span>
      <ol>${ls.map(l => `<li><a href="#${l.id}">${l.title}</a>${done.has(l.id) ? " ✓" : ""}</li>`).join("")}</ol>
      <a class="btn primary" style="background:${t.color};border-color:${t.color};justify-self:start" href="#${(ls.find(l => !done.has(l.id)) || ls[0]).id}">${n ? "Continuer" : "Commencer"}</a>
    </div>`;
  };
  main.innerHTML = `<div class="page">
    <section class="hero">
      <span class="eyebrow">Cours interactif · ${LESSONS.length} leçons · ${LESSONS.reduce((n, l) => n + (l.body.match(/class="lab"/g) || []).length, 0)} labos</span>
      <h1>Comprendre l'<em>électricité</em> et le <strong>nucléaire</strong></h1>
      <p>Chaque leçon explique un phénomène avec des mots simples, puis te laisse le manipuler : fais circuler des électrons, équilibre le réseau à 50 Hz, pilote une réaction en chaîne, démarre une centrale depuis sa salle de commande. Deux questions valident chaque leçon.</p>
      <canvas class="hero-canvas" id="hero-cv" aria-hidden="true"></canvas>
    </section>
    <div class="tracks">${card("elec")}${card("nuc")}${card("cen")}</div>
    <div class="extras">
      <a class="extra-card" href="#quiz"><b>Quiz final</b><span>15 questions tirées de tout le cours. Meilleur score : <span class="mono">${store.get("best", "–")}${store.get("best", null) != null ? " / 15" : ""}</span></span></a>
      <a class="extra-card" href="#glossaire"><b>Glossaire</b><span>${GLOSSARY.length} mots clés, du volt au tokamak.</span></a>
    </div>
  </div>`;
  // Bandeau animé : une sinusoïde de 50 Hz qui alimente… un noyau qui se scinde.
  const cv = $("#hero-cv");
  const kit = { ctx: cv.getContext("2d"), w: 0, h: 0 };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    kit.w = cv.clientWidth; kit.h = 170;
    cv.width = kit.w * dpr; cv.height = kit.h * dpr; kit.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(cv);
  const stop = animate((dt, t) => {
    const { ctx, w, h: H } = kit;
    ctx.clearRect(0, 0, w, H);
    const mid = w * 0.58;
    ctx.strokeStyle = T.line; ctx.lineWidth = 1;
    for (let x = 0; x < mid; x += 24) { ctx.beginPath(); ctx.moveTo(x, 12); ctx.lineTo(x, H - 12); ctx.stroke(); }
    ctx.strokeStyle = T.volt; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = 0; x <= mid; x += 3) { const y = H / 2 + Math.sin(x / 34 - t * 3) * H * 0.28 * Math.min(1, x / 60); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    text(ctx, "230 V · 50 Hz", 14, 22, T.muted, 11);
    // noyau qui se scinde toutes les 4 s
    const cyc = (t % 4) / 4, cx = mid + (w - mid) / 2, cy = H / 2;
    const split = cyc > 0.5 ? (cyc - 0.5) * 2 : 0;
    const draw = (ox, n, r0) => { for (let i = 0; i < n; i++) { const rr = 4.2 * Math.sqrt(i), a = i * 2.39996; circle(ctx, ox + Math.cos(a) * rr, cy + Math.sin(a) * rr, r0, i % 3 ? T.muted : T.hot); } };
    if (!split) {
      const jig = cyc > 0.35 ? Math.sin(t * 60) * 2 : 0;
      draw(cx + jig, 60, 4);
      const nx = mid + 10 + (cx - mid - 40) * Math.min(1, cyc / 0.45);
      if (cyc < 0.45) circle(ctx, nx, cy, 3.5, T.core);
    } else {
      circle(ctx, cx, cy, 10 + split * 90, alpha(T.glow, 0.45 * (1 - split)));
      draw(cx - split * 70, 32, 4); draw(cx + split * 70, 26, 4);
      for (let k = 0; k < 3; k++) { const a = -1 + k; circle(ctx, cx + Math.cos(a) * split * 160 * (k % 2 ? 1 : 0.8), cy + Math.sin(a) * split * 70, 3.5, T.core); }
    }
    text(ctx, "²³⁵U + n", w - 14, 22, T.muted, 11, "right");
  });
  return () => { stop(); ro.disconnect(); };
}

/* ---------- Questions de validation ---------- */
function renderQuestions(container, qs, onAllRight) {
  let right = 0;
  qs.forEach((q, qi) => {
    const el = h(`<div class="q"><p>${qi + 1}. ${q.q}</p><div class="answers">${q.a.map((a, i) => `<button class="answer" data-i="${i}">${a}</button>`).join("")}</div><p class="why" hidden></p></div>`);
    $$(".answer", el).forEach(b => b.onclick = () => {
      const i = +b.dataset.i, ok = i === q.c;
      b.classList.add(ok ? "right" : "wrong");
      const why = $(".why", el); why.hidden = false;
      why.textContent = (ok ? "Exact. " : "Pas tout à fait. ") + q.why;
      if (ok) {
        $$(".answer", el).forEach(x => x.disabled = true);
        if (!el.dataset.ok) { el.dataset.ok = 1; right++; if (right === qs.length) onAllRight(); }
      } else b.disabled = true;
    });
    container.appendChild(el);
  });
}

/* ---------- Page de leçon ---------- */
function renderLesson(main, l) {
  const ls = byTrack(l.track), idx = ls.indexOf(l), t = TRACKS[l.track];
  const all = LESSONS, gi = all.indexOf(l);
  const prev = all[gi - 1], next = all[gi + 1];
  main.innerHTML = `<article class="page" style="--track:${t.color};--track-soft:${t.soft}">
    <header class="lesson-head">
      <span class="eyebrow"><b>${t.name}</b> · Leçon ${idx + 1} sur ${ls.length}</span>
      <h1>${l.title}</h1>
      <p class="lead">${l.lead}</p>
    </header>
    ${l.body}
    <section class="check">
      <div class="check-head"><h3>Valide la leçon</h3><span class="eyebrow" id="chk-state">${done.has(l.id) ? "Déjà validée ✓" : "Réponds juste aux deux questions"}</span></div>
      <div id="chk"></div>
    </section>
    <nav class="lesson-nav">
      ${prev ? `<a class="btn" href="#${prev.id}">← ${prev.title}</a>` : `<a class="btn" href="#accueil">← Accueil</a>`}
      ${next ? `<a class="btn primary" href="#${next.id}">${next.title} →</a>` : `<a class="btn primary" href="#quiz">Quiz final →</a>`}
    </nav>
  </article>`;
  renderQuestions($("#chk", main), l.quiz, () => {
    done.add(l.id); store.set("done", [...done]);
    $("#chk-state").textContent = "Leçon validée ✓";
    renderNav(l.id);
  });
  return l.mount(main);
}

/* ---------- Quiz final ---------- */
function renderQuiz(main) {
  const pool = LESSONS.flatMap(l => l.quiz.map(q => ({ ...q, from: l.title }))).concat(EXTRA_QUIZ);
  const qs = pool.map(q => [Math.random(), q]).sort((a, b) => a[0] - b[0]).slice(0, 15).map(x => x[1]);
  let i = 0, score = 0;
  main.innerHTML = `<div class="page" style="--track:var(--ok);--track-soft:var(--surface-2)">
    <header class="lesson-head"><span class="eyebrow">S'entraîner</span><h1>Quiz final</h1><p class="lead">15 questions tirées au hasard dans tout le cours. Une seule tentative par question.</p></header>
    <section class="check" id="qz"></section></div>`;
  const box = $("#qz", main);
  function show() {
    if (i >= qs.length) {
      const best = Math.max(score, store.get("best", 0)); store.set("best", best);
      const msg = score >= 13 ? "Excellent, tu maîtrises le sujet." : score >= 9 ? "Bien joué. Revois les leçons où tu as hésité." : "Reprends les leçons et leurs labos, puis retente ta chance.";
      box.innerHTML = `<div class="check-head"><h3>Score : ${score} / ${qs.length}</h3><span class="eyebrow">Meilleur : ${best} / 15</span></div><p>${msg}</p><div class="row"><button class="btn primary" id="qz-again">Nouveau quiz</button><a class="btn" href="#accueil">Accueil</a></div>`;
      $("#qz-again", main).onclick = () => { cleanup = renderQuiz(main); };
      return;
    }
    const q = qs[i];
    box.innerHTML = `<div class="check-head"><h3>Question ${i + 1} / ${qs.length}</h3><span class="eyebrow">Score : ${score}</span></div>
      <div class="bar" style="color:var(--ok)"><i style="width:${i / qs.length * 100}%"></i></div>
      <div class="q"><p>${q.q}</p><div class="answers">${q.a.map((a, k) => `<button class="answer" data-k="${k}">${a}</button>`).join("")}</div><p class="why" hidden></p></div>
      <div class="row"><button class="btn primary" id="qz-next" hidden>Question suivante →</button></div>`;
    $$(".answer", box).forEach(b => b.onclick = () => {
      const k = +b.dataset.k, ok = k === q.c;
      if (ok) score++;
      $$(".answer", box).forEach((x, j) => { x.disabled = true; if (j === q.c) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      const why = $(".why", box); why.hidden = false; why.textContent = (ok ? "Exact. " : "Raté. ") + q.why + (q.from ? ` (Leçon : ${q.from})` : "");
      const nx = $("#qz-next", box); nx.hidden = false; nx.focus();
      nx.onclick = () => { i++; show(); };
    });
  }
  show();
}

/* ---------- Glossaire ---------- */
function renderGlossary(main) {
  main.innerHTML = `<div class="page" style="--track:var(--ok)">
    <header class="lesson-head"><span class="eyebrow">Référence</span><h1>Glossaire</h1><p class="lead">Les mots clés du cours. Tape pour filtrer.</p></header>
    <input type="search" id="gl-q" placeholder="Rechercher un terme (ex. : demi-vie, watt…)" aria-label="Rechercher dans le glossaire">
    <div class="gloss" id="gl"></div></div>`;
  const draw = () => {
    const q = $("#gl-q").value.trim().toLowerCase();
    const items = GLOSSARY.filter(g => !q || (g[1] + " " + g[2]).toLowerCase().includes(q));
    $("#gl").innerHTML = items.length ? items.map(g => `<div class="term"><span class="tag" style="color:${TRACKS[g[0]].color}">${TRACKS[g[0]].name}</span><b>${g[1]}</b><span>${g[2]}</span></div>`).join("") : `<p class="hint">Aucun terme ne correspond à « ${q.replace(/</g, "&lt;")} ».</p>`;
  };
  $("#gl-q").addEventListener("input", draw);
  draw();
}

/* ---------- Routeur ---------- */
function route() {
  if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
  const id = location.hash.slice(1);
  const main = $("#main");
  const l = LESSONS.find(x => x.id === id);
  renderNav(l ? l.id : (id === "quiz" || id === "glossaire") ? id : null);
  if (l) { cleanup = renderLesson(main, l); store.set("last", l.id); }
  else if (id === "quiz") cleanup = renderQuiz(main);
  else if (id === "glossaire") cleanup = renderGlossary(main);
  else cleanup = renderHome(main);
  document.title = l ? l.title + " · Électricité & Nucléaire" : "Électricité & Nucléaire";
  $("#sidebar").classList.remove("open");
  $("#menu").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}

$("#menu").addEventListener("click", () => {
  const o = $("#sidebar").classList.toggle("open");
  $("#menu").setAttribute("aria-expanded", String(o));
});
$("#theme").addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  store.set("theme", root.dataset.theme);
});
window.addEventListener("hashchange", route);
route();
