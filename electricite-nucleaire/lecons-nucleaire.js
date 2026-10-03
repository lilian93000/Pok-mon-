/* Parcours NUCLÉAIRE — 9 leçons, chacune avec un labo interactif. */
"use strict";

const ELEMENTS = ("H Hydrogène|He Hélium|Li Lithium|Be Béryllium|B Bore|C Carbone|N Azote|O Oxygène|F Fluor|Ne Néon|Na Sodium|Mg Magnésium|Al Aluminium|Si Silicium|P Phosphore|S Soufre|Cl Chlore|Ar Argon|K Potassium|Ca Calcium|Sc Scandium|Ti Titane|V Vanadium|Cr Chrome|Mn Manganèse|Fe Fer|Co Cobalt|Ni Nickel|Cu Cuivre|Zn Zinc|Ga Gallium|Ge Germanium|As Arsenic|Se Sélénium|Br Brome|Kr Krypton|Rb Rubidium|Sr Strontium|Y Yttrium|Zr Zirconium|Nb Niobium|Mo Molybdène|Tc Technétium|Ru Ruthénium|Rh Rhodium|Pd Palladium|Ag Argent|Cd Cadmium|In Indium|Sn Étain|Sb Antimoine|Te Tellure|I Iode|Xe Xénon|Cs Césium|Ba Baryum|La Lanthane|Ce Cérium|Pr Praséodyme|Nd Néodyme|Pm Prométhium|Sm Samarium|Eu Europium|Gd Gadolinium|Tb Terbium|Dy Dysprosium|Ho Holmium|Er Erbium|Tm Thulium|Yb Ytterbium|Lu Lutécium|Hf Hafnium|Ta Tantale|W Tungstène|Re Rhénium|Os Osmium|Ir Iridium|Pt Platine|Au Or|Hg Mercure|Tl Thallium|Pb Plomb|Bi Bismuth|Po Polonium|At Astate|Rn Radon|Fr Francium|Ra Radium|Ac Actinium|Th Thorium|Pa Protactinium|U Uranium|Np Neptunium|Pu Plutonium")
  .split("|").map(s => { const i = s.indexOf(" "); return { sym: s.slice(0, i), name: s.slice(i + 1) }; });

/* ===================================================================== */
lesson({
  id: "noyau", track: "nuc",
  title: "L'atome et son noyau",
  lead: "Le noyau est 100 000 fois plus petit que l'atome, mais il contient 99,97 % de sa masse. Et une énergie colossale.",
  body: `
  <div class="prose">
    <p>Si un atome avait la taille d'un stade de football, son noyau serait une tête d'épingle au centre, et les électrons des grains de poussière dans les tribunes. Le noyau contient deux sortes de <strong>nucléons</strong> :</p>
    <ul>
      <li>les <strong>protons</strong>, de charge +1. Leur nombre <strong>Z</strong> définit l'élément chimique : 1 proton = hydrogène, 6 = carbone, 92 = uranium ;</li>
      <li>les <strong>neutrons</strong>, sans charge. Leur nombre <strong>N</strong> peut varier pour un même élément.</li>
    </ul>
    <p>Le <strong>nombre de masse</strong> A = Z + N. Deux atomes qui ont le même Z mais un N différent sont des <strong>isotopes</strong> : le carbone-12 (6 protons, 6 neutrons) et le carbone-14 (6 protons, 8 neutrons) sont tous deux du carbone.</p>
    <p>Mais pourquoi les protons, qui se repoussent violemment, restent-ils collés ? Grâce à l'<strong>interaction forte</strong>, une force 100 fois plus intense que la force électrique, mais qui n'agit qu'à très courte distance (la taille d'un noyau). Les neutrons servent de « colle » supplémentaire sans ajouter de répulsion.</p>
  </div>
  ${lab("Labo", "Construis un noyau", `
    <div class="row" id="at-pre"></div>
    <div class="split">
      <canvas id="at-cv" aria-label="Noyau et électrons"></canvas>
      <div class="info-panel">
        <div class="eyebrow">Isotope</div>
        <h4 id="at-name" style="font-size:1.5rem"></h4>
        <div class="facts" id="at-facts"></div>
        <p class="status" id="at-stab"></p>
      </div>
    </div>
    <div class="controls">${slider("at-z", "Protons Z", 1, 94, 1, 6)}${slider("at-n", "Neutrons N", 0, 150, 1, 6)}</div>
    <p class="hint">Stabilité estimée avec la « vallée de stabilité » (formule semi-empirique). Modèle des couches électroniques simplifié.</p>`)}
  <div class="prose">
    <p class="note"><b>La vallée de stabilité.</b> Les noyaux légers sont stables avec autant de neutrons que de protons. Les noyaux lourds ont besoin de plus de neutrons pour compenser la répulsion entre protons. Au-delà du plomb (Z = 82), aucun noyau n'est stable : tous finissent par se désintégrer.</p>
  </div>`,
  mount(root) {
    const kit = canvasKit($("#at-cv", root), 0.72);
    let Z = 6, N = 6;
    const presets = [["H-1", 1, 0], ["H-3 (tritium)", 1, 2], ["He-4", 2, 2], ["C-12", 6, 6], ["C-14", 6, 8], ["Fe-56", 26, 30], ["I-131", 53, 78], ["Cs-137", 55, 82], ["U-235", 92, 143], ["U-238", 92, 146], ["Pu-239", 94, 145]];
    const pre = $("#at-pre", root);
    presets.forEach(p => {
      const b = h(`<button class="btn">${p[0]}</button>`);
      b.onclick = () => { $("#at-z", root).value = p[1]; $("#at-n", root).value = p[2]; $("#at-z", root).dispatchEvent(new Event("input")); $("#at-n", root).dispatchEvent(new Event("input")); };
      pre.appendChild(b);
    });
    const known = { "1-2": "radioactif", "4-4": "radioactif", "6-8": "radioactif" }; // H-3, Be-8, C-14
    function stability() {
      const A = Z + N;
      const zopt = A / (1.98 + 0.0155 * Math.pow(A, 2 / 3));
      let st, kind = "";
      if (known[Z + "-" + N]) st = false;
      else if (Z === 43 || Z === 61 || Z > 82) st = false;
      else if (N === 0 && Z > 1) st = false;
      else st = Math.abs(Z - zopt) <= 0.5 + A * 0.004;
      if (!st) {
        if (A > 209 && Z > 82) kind = "Désintégration probable : α (émission d'un noyau d'hélium), le noyau est trop gros.";
        else if (Z < zopt) kind = "Trop de neutrons : désintégration β⁻ probable (un neutron devient proton + électron).";
        else kind = "Trop de protons : désintégration β⁺ ou capture électronique probable.";
      }
      return { st, kind, zopt };
    }
    function upd() {
      const el = ELEMENTS[Z - 1], A = Z + N;
      $("#at-name", root).innerHTML = `<sup class="mono" style="font-size:.6em">${A}</sup>${el.sym} <span style="font-weight:400;font-size:.65em;color:var(--muted)">${el.name}-${A}</span>`;
      $("#at-facts", root).innerHTML = `Z = ${Z} protons<br>N = ${N} neutrons<br>A = ${A} nucléons<br>N/Z = ${fmt(N / Z, 2)}`;
      const s = stability(), m = $("#at-stab", root);
      m.className = "status " + (s.st ? "ok" : "warn");
      m.textContent = s.st ? "Probablement stable." : "Radioactif. " + s.kind;
    }
    bindRange(root, "at-z", v => v + " · " + ELEMENTS[v - 1].sym, v => { Z = v; upd(); });
    bindRange(root, "at-n", v => v + "", v => { N = v; upd(); });
    const stop = animate((dt, t) => {
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const cx = w / 2, cy = H / 2, A = Z + N;
      // couches électroniques (modèle de Bohr simplifié)
      const caps = [2, 8, 18, 32, 32, 18, 8];
      let left = Z, shells = [];
      for (const c of caps) { if (left <= 0) break; shells.push(Math.min(c, left)); left -= c; }
      const maxR = Math.min(w, H) / 2 - 8, r0 = 46;
      shells.forEach((n, i) => {
        const r = r0 + (maxR - r0) * (shells.length > 1 ? i / (shells.length - 1) : 0.4);
        circle(ctx, cx, cy, r, null, alpha(T.muted, 0.35));
        for (let k = 0; k < n; k++) {
          const a = t * (0.9 / (i + 1)) + k * 2 * Math.PI / n;
          circle(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.6, T.volt);
        }
      });
      // noyau : motif tournesol, protons et neutrons mélangés
      const rn = Math.max(1.8, Math.min(5, 34 / Math.sqrt(A)));
      for (let i = 0; i < A; i++) {
        const rr = rn * 1.05 * Math.sqrt(i), a = i * 2.39996;
        const isP = Math.floor((i + 1) * Z / A) !== Math.floor(i * Z / A);
        circle(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, rn, isP ? T.hot : T.muted);
      }
      text(ctx, "● proton", 10, H - 30, T.hot, 11); text(ctx, "● neutron", 10, H - 16, T.muted, 11);
      text(ctx, "● électron", w - 10, H - 16, T.volt, 11, "right");
    });
    upd();
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Qu'est-ce qui distingue l'uranium-235 de l'uranium-238 ?", a: ["Le nombre de protons", "Le nombre de neutrons", "Le nombre d'électrons", "Rien"], c: 1, why: "Ce sont des isotopes : 92 protons tous les deux, mais 143 ou 146 neutrons." },
    { q: "Quelle force maintient les protons ensemble dans le noyau ?", a: ["La gravité", "La force électrique", "L'interaction forte", "Le magnétisme"], c: 2, why: "L'interaction forte, très intense mais de très courte portée." }
  ]
});

/* ===================================================================== */
lesson({
  id: "radioactivite", track: "nuc",
  title: "La radioactivité",
  lead: "Un noyau instable finit toujours par se transformer en émettant un rayonnement. Henri Becquerel l'a découvert par hasard en 1896, Marie et Pierre Curie l'ont nommé.",
  body: `
  <div class="prose">
    <p>La radioactivité est la transformation spontanée d'un noyau instable en un noyau plus stable. Elle libère de l'énergie sous forme de <strong>rayonnements ionisants</strong>, capables d'arracher des électrons aux atomes qu'ils traversent (et donc d'abîmer l'ADN des cellules).</p>
    <ul>
      <li><strong>Alpha (α)</strong> : un noyau d'hélium (2 protons + 2 neutrons) est éjecté. Très ionisant mais arrêté par une feuille de papier ou quelques centimètres d'air. Dangereux surtout s'il est inhalé ou avalé.</li>
      <li><strong>Bêta (β⁻ ou β⁺)</strong> : un neutron se change en proton (ou l'inverse) en éjectant un électron (ou un positon). Arrêté par quelques millimètres d'aluminium.</li>
      <li><strong>Gamma (γ)</strong> : une onde électromagnétique très énergétique, comme la lumière mais bien plus pénétrante. Atténué par plusieurs centimètres de plomb ou des mètres de béton.</li>
      <li><strong>Neutrons</strong> : produits dans les réacteurs. Arrêtés par l'eau et le béton, qui contiennent beaucoup d'atomes légers.</li>
    </ul>
  </div>
  ${lab("Labo 1", "Qui traverse quoi ?", `
    <div class="row" id="pe-type"></div>
    <canvas id="pe-cv" aria-label="Rayonnements traversant des écrans"></canvas>
    <div class="row" id="pe-bar"></div>
    <div class="readouts">${readout("pe-n", "Particules détectées / s")}</div>`)}
  <div class="prose">
    <h2>Mesurer la radioactivité</h2>
    <p>Le <strong>becquerel</strong> (Bq) compte les désintégrations par seconde. Ton propre corps en compte environ 8 000 (potassium-40 et carbone-14 naturels). Le <strong>sievert</strong> (Sv) mesure l'effet biologique d'une dose reçue. On parle surtout en millisieverts (mSv).</p>
  </div>
  ${lab("Repères", "Doses comparées (échelle logarithmique)", `<div id="dose-chart" style="display:grid;gap:6px"></div><p class="hint">Valeurs indicatives (sources : IRSN, CIPR). Chaque graduation multiplie la dose par 10.</p>`)}
  <div class="prose">
    <p class="note"><b>Tout est un peu radioactif.</b> Le granit de Bretagne, le radon qui sort du sol, les rayons cosmiques en avion, les bananes (potassium-40)… En France, chaque habitant reçoit en moyenne environ 4,5 mSv par an, dont une bonne partie d'origine naturelle et le reste surtout médical.</p>
  </div>`,
  mount(root) {
    const types = [
      { k: "a", n: "Alpha α", c: () => T.hot, r: 4.5, v: 140, range: 0.55 },
      { k: "b", n: "Bêta β", c: () => T.volt, r: 2.5, v: 300, range: 2 },
      { k: "g", n: "Gamma γ", c: () => T.core, r: 2, v: 420, range: 2 },
      { k: "n", n: "Neutrons", c: () => T.ink, r: 3, v: 260, range: 2 }
    ];
    // probabilité de traverser chaque écran
    const bars = [
      { k: "pap", n: "Papier", x: 0.3, pass: { a: 0, b: 0.95, g: 1, n: 1 }, c: () => T.muted },
      { k: "alu", n: "Aluminium 5 mm", x: 0.46, pass: { a: 0, b: 0, g: 0.95, n: 0.95 }, c: () => T.cold },
      { k: "pb", n: "Plomb 5 cm", x: 0.62, pass: { a: 0, b: 0, g: 0.12, n: 0.9 }, c: () => T.ink },
      { k: "eau", n: "Eau / béton", x: 0.78, pass: { a: 0, b: 0, g: 0.35, n: 0.06 }, c: () => T.core }
    ];
    let type = 0;
    const on = { pap: true, alu: false, pb: false, eau: false };
    const tb = $("#pe-type", root), bb = $("#pe-bar", root);
    types.forEach((t, i) => { const b = h(`<button class="btn">${t.n}</button>`); b.onclick = () => { type = i; parts = []; refresh(); }; tb.appendChild(b); });
    bars.forEach(b => { const e = h(`<button class="btn">${b.n}</button>`); e.onclick = () => { on[b.k] = !on[b.k]; refresh(); }; bb.appendChild(e); b.btn = e; });
    function refresh() { $$("button", tb).forEach((b, i) => b.classList.toggle("on", i === type)); bars.forEach(b => b.btn.classList.toggle("on", on[b.k])); }
    refresh();
    const kit = canvasKit($("#pe-cv", root), 0.36);
    let parts = [], acc = 0, hits = [];
    const stop = animate((dt, t) => {
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const ty = types[type];
      acc += dt * 30;
      while (acc > 1) { acc--; parts.push({ x: 40, y: H / 2 + rand(-H * 0.3, H * 0.3), vy: rand(-12, 12), passed: {}, dead: false }); }
      // source et détecteur
      ctx.fillStyle = alpha(T.warn, 0.3); ctx.fillRect(10, H * 0.15, 28, H * 0.7);
      text(ctx, "source", 24, H * 0.1, T.muted, 10, "center");
      ctx.fillStyle = alpha(T.ok, 0.25); ctx.fillRect(w - 34, H * 0.15, 24, H * 0.7);
      text(ctx, "détecteur", w - 22, H * 0.1, T.muted, 10, "center");
      bars.forEach(b => {
        if (!on[b.k]) return;
        const x = b.x * w;
        ctx.fillStyle = alpha(b.c(), b.k === "pap" ? 0.5 : 0.75);
        ctx.fillRect(x - (b.k === "pap" ? 2 : 7), H * 0.08, b.k === "pap" ? 4 : 14, H * 0.84);
      });
      parts.forEach(p => {
        p.x += ty.v * dt; p.y += p.vy * dt;
        if (p.x > ty.range * w) p.dead = true;
        bars.forEach(b => {
          if (on[b.k] && !p.passed[b.k] && p.x >= b.x * w) {
            p.passed[b.k] = true;
            if (Math.random() > b.pass[ty.k]) p.dead = true;
          }
        });
        if (p.x > w - 34 && !p.dead) { p.dead = true; hits.push(t); }
        if (!p.dead) {
          if (ty.k === "g") {
            ctx.strokeStyle = ty.c(); ctx.lineWidth = 1.6; ctx.beginPath();
            for (let i = 0; i < 12; i++) { const xx = p.x - i * 1.6; const yy = p.y + Math.sin((xx + t * 300) / 3) * 3; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
            ctx.stroke();
          } else circle(ctx, p.x, p.y, ty.r, ty.c());
        }
      });
      parts = parts.filter(p => !p.dead);
      hits = hits.filter(x => t - x < 1);
      $("#pe-n", root).textContent = hits.length + " / 30 émises";
      if (ty.k === "a" && !on.pap) text(ctx, "les α s'arrêtent après quelques cm d'air", ty.range * w + 6, H - 12, T.muted, 10);
    });
    // graphique de doses
    const doses = [
      ["Manger une banane", 0.0001], ["Radio dentaire", 0.005], ["Radio du thorax", 0.02], ["Vol Paris–New York aller-retour", 0.06],
      ["Limite annuelle public (hors naturel et médical)", 1], ["Exposition moyenne annuelle en France", 4.5], ["Scanner de l'abdomen", 10],
      ["Limite annuelle travailleurs du nucléaire", 20], ["Effets sur la santé visibles (dose reçue d'un coup)", 1000], ["Dose mortelle pour 50 % des personnes (d'un coup)", 5000]
    ];
    const lmin = -4, lmax = 4;
    $("#dose-chart", root).innerHTML = doses.map(([n, v]) => {
      const p = (Math.log10(v) - lmin) / (lmax - lmin) * 100;
      const col = v >= 1000 ? "var(--danger)" : v >= 10 ? "var(--warn)" : "var(--core)";
      return `<div style="display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1.6fr);gap:10px;align-items:center;font-size:.88rem">
        <span>${n}</span><span style="display:flex;align-items:center;gap:8px;min-width:0"><span style="height:12px;border-radius:3px;background:${col};width:${Math.max(2, p)}%"></span><span class="mono" style="white-space:nowrap">${v < 0.01 ? fmt(v * 1000, 1) + " µSv" : fmt(v, 2) + " mSv"}</span></span></div>`;
    }).join("");
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Quel rayonnement est arrêté par une simple feuille de papier ?", a: ["Alpha", "Bêta", "Gamma", "Neutrons"], c: 0, why: "Les particules α, lourdes et chargées, perdent leur énergie très vite." },
    { q: "Le becquerel mesure…", a: ["l'effet biologique d'une dose", "le nombre de désintégrations par seconde", "l'énergie d'un rayon gamma", "la masse d'un noyau"], c: 1, why: "1 Bq = 1 désintégration par seconde. L'effet sur le corps se mesure en sieverts." }
  ]
});

/* ===================================================================== */
lesson({
  id: "demivie", track: "nuc",
  title: "La demi-vie",
  lead: "On ne peut jamais prévoir quand un noyau donné va se désintégrer. Mais sur des milliards de noyaux, la loi est implacable : la moitié disparaît à chaque demi-vie.",
  body: `
  <div class="prose">
    <p>La désintégration d'un noyau est un phénomène <strong>aléatoire</strong>, comme un dé qu'on lance. Chaque noyau a, à chaque instant, la même probabilité de se désintégrer, quel que soit son « âge ».</p>
    <p>La <strong>demi-vie</strong> (ou période) T½ est le temps au bout duquel la moitié des noyaux d'un échantillon s'est désintégrée. Après 2 demi-vies il en reste ¼, après 10 demi-vies environ 1/1 000.</p>
    <p class="formula">N(t) = N₀ × (½)^(t / T½)</p>
    <p>Les demi-vies vont de la fraction de seconde à des milliards d'années : iode-131 → 8 jours ; césium-137 → 30 ans ; carbone-14 → 5 730 ans ; plutonium-239 → 24 100 ans ; uranium-238 → 4,5 milliards d'années (l'âge de la Terre).</p>
  </div>
  ${lab("Labo 1", "400 noyaux et le hasard", `
    <div class="row"><label for="hl-iso" class="hint">Isotope</label><select id="hl-iso"></select><button class="btn primary" id="hl-go">Lancer</button><button class="btn" id="hl-reset">Réinitialiser</button></div>
    <canvas id="hl-cv" aria-label="Grille de noyaux et courbe de décroissance"></canvas>
    <div class="readouts">${readout("hl-t", "Temps écoulé")}${readout("hl-hl", "Nombre de demi-vies")}${readout("hl-n", "Noyaux restants")}${readout("hl-th", "Prévision théorique")}</div>`)}
  ${lab("Labo 2", "Datation au carbone-14", `
    <p class="hint">Un être vivant échange du carbone avec l'air et garde une proportion constante de C-14. À sa mort, le C-14 n'est plus renouvelé et décroît. En mesurant ce qui reste, on calcule l'âge.</p>
    <div class="controls">${slider("c14", "C-14 restant (par rapport à un être vivant)", 1, 100, 1, 50)}</div>
    <div class="readouts">${readout("c14-age", "Âge estimé")}${readout("c14-ex", "Exemple d'objet")}</div>`)}`,
  mount(root) {
    const isos = [["Iode-131", 8.02, "jours"], ["Radon-222", 3.82, "jours"], ["Cobalt-60", 5.27, "ans"], ["Césium-137", 30.1, "ans"], ["Carbone-14", 5730, "ans"], ["Plutonium-239", 24110, "ans"], ["Uranium-235", 7.04e8, "ans"], ["Uranium-238", 4.47e9, "ans"]];
    const sel = $("#hl-iso", root);
    isos.forEach((s, i) => sel.insertAdjacentHTML("beforeend", `<option value="${i}" ${i === 3 ? "selected" : ""}>${s[0]} (T½ = ${s[1] >= 1e6 ? sci(s[1]) : fmt(s[1], 2)} ${s[2]})</option>`));
    const kit = canvasKit($("#hl-cv", root), 0.48);
    let atoms, tHL, run = false, hist;
    const reset = () => { atoms = Array(400).fill(true); tHL = 0; hist = [[0, 400]]; run = false; $("#hl-go", root).textContent = "Lancer"; };
    reset();
    $("#hl-go", root).onclick = () => { run = !run; $("#hl-go", root).textContent = run ? "Pause" : "Reprendre"; };
    $("#hl-reset", root).onclick = reset;
    sel.onchange = reset;
    const stop = animate(dt => {
      if (run && tHL < 6) {
        const step = dt * 0.6; // 0,6 demi-vie par seconde
        const p = 1 - Math.pow(0.5, step);
        for (let i = 0; i < 400; i++) if (atoms[i] && Math.random() < p) atoms[i] = false;
        tHL += step;
        hist.push([tHL, atoms.filter(Boolean).length]);
        if (tHL >= 6) { run = false; $("#hl-go", root).textContent = "Terminé"; }
      }
      const iso = isos[+sel.value], n = atoms.filter(Boolean).length;
      const real = tHL * iso[1];
      $("#hl-t", root).textContent = (real >= 1e6 ? sci(real) : fmt(real, 1)) + " " + iso[2];
      $("#hl-hl", root).textContent = fmt(tHL, 2);
      $("#hl-n", root).textContent = n + " / 400";
      $("#hl-th", root).textContent = fmt(400 * Math.pow(0.5, tHL), 0);
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const gs = Math.min(H - 20, w * 0.42), cell = gs / 20, gx = 10, gy = (H - gs) / 2;
      for (let i = 0; i < 400; i++) {
        const x = gx + (i % 20) * cell + cell / 2, y = gy + Math.floor(i / 20) * cell + cell / 2;
        circle(ctx, x, y, cell * 0.36, atoms[i] ? T.hot : alpha(T.muted, 0.25));
      }
      // courbe
      const px = gx + gs + 46, pw = w - px - 14, py = 14, ph = H - 40;
      const X = v => px + pw * v / 6, Y = v => py + ph * (1 - v / 400);
      ctx.strokeStyle = T.line; ctx.lineWidth = 1;
      for (let k = 0; k <= 6; k++) { ctx.beginPath(); ctx.moveTo(X(k), py); ctx.lineTo(X(k), py + ph); ctx.stroke(); text(ctx, k + "", X(k), py + ph + 12, T.muted, 10, "center"); }
      [400, 200, 100, 50].forEach(v => { ctx.beginPath(); ctx.moveTo(px, Y(v)); ctx.lineTo(px + pw, Y(v)); ctx.stroke(); text(ctx, v + "", px - 6, Y(v), T.muted, 10, "right"); });
      text(ctx, "demi-vies →", px + pw, py + ph + 26, T.muted, 10, "right");
      ctx.setLineDash([4, 4]); ctx.strokeStyle = T.muted; ctx.beginPath();
      for (let k = 0; k <= 60; k++) { const v = k / 10; k ? ctx.lineTo(X(v), Y(400 * Math.pow(0.5, v))) : ctx.moveTo(X(v), Y(400)); }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = T.hot; ctx.lineWidth = 2.5; ctx.beginPath();
      hist.forEach((p, i) => i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])));
      ctx.stroke();
    });
    bindRange(root, "c14", v => v + " %", v => {
      const age = 5730 * Math.log2(100 / v);
      $("#c14-age", root).textContent = fmt(Math.round(age / 10) * 10, 0) + " ans";
      const ex = age < 600 ? "Charpente médiévale ou plus récente" : age < 2500 ? "Momie égyptienne, objet de l'Antiquité" : age < 6000 ? "Outil du Néolithique" : age < 20000 ? "Os de mammouth" : age < 40000 ? "Peintures de la grotte Chauvet (≈ 36 000 ans)" : "Limite de la méthode (≈ 50 000 ans)";
      $("#c14-ex", root).textContent = ex;
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Un échantillon contient 1 000 noyaux de demi-vie 10 ans. Combien en reste-t-il après 30 ans ?", a: ["0", "125", "250", "333"], c: 1, why: "30 ans = 3 demi-vies : 1 000 → 500 → 250 → 125." },
    { q: "Peut-on prévoir quand un noyau précis va se désintégrer ?", a: ["Oui, grâce à sa demi-vie", "Non, c'est aléatoire", "Oui, s'il est vieux", "Seulement pour l'uranium"], c: 1, why: "La désintégration est aléatoire. La demi-vie ne décrit qu'un comportement statistique." }
  ]
});

/* ===================================================================== */
lesson({
  id: "emc2", track: "nuc",
  title: "E = mc² et l'énergie de liaison",
  lead: "Dans une réaction nucléaire, un peu de masse disparaît. Elle se transforme en une quantité d'énergie gigantesque, selon la formule la plus célèbre de la physique.",
  body: `
  <div class="prose">
    <p>En 1905, Albert Einstein montre que la masse est une forme d'énergie :</p>
    <p class="formula">E = m × c²      (c = 299 792 458 m/s)</p>
    <p>Comme c² est énorme (9 × 10¹⁶), un gramme de matière correspond à 90 000 milliards de joules, soit l'énergie d'une centrale nucléaire pendant une journée entière.</p>
    <p>Quand on pèse un noyau, on trouve qu'il est <strong>plus léger</strong> que la somme de ses protons et neutrons séparés. Cette différence, le <strong>défaut de masse</strong>, correspond à l'<strong>énergie de liaison</strong> : l'énergie qu'il faudrait fournir pour séparer tous les nucléons.</p>
    <p>La courbe ci-dessous (dite courbe d'Aston) montre l'énergie de liaison par nucléon. Plus elle est haute, plus le noyau est solidement lié. Le fer et le nickel sont au sommet : ce sont les noyaux les plus stables de l'univers.</p>
  </div>
  ${lab("Labo 1", "La courbe d'Aston", `
    <canvas id="be-cv" aria-label="Courbe de l'énergie de liaison par nucléon"></canvas>
    <div class="info-panel"><h4 id="be-t">Survole ou touche un point</h4><p id="be-d" class="hint">Pour gagner de l'énergie, il faut monter sur la courbe : soit en <b>cassant</b> un noyau lourd (fission, à droite), soit en <b>fusionnant</b> des noyaux légers (fusion, à gauche).</p></div>`)}
  ${lab("Labo 2", "Convertis de la masse en énergie", `
    <div class="controls">${slider("mc-m", "Masse convertie", -6, 3, 1, 0)}</div>
    <div class="readouts">${readout("mc-j", "Énergie")}${readout("mc-kwh", "En kWh")}${readout("mc-foy", "Consommation annuelle de… foyers")}</div>
    <p class="hint">Dans un réacteur, la fission d'un gramme d'uranium-235 ne convertit qu'environ 0,9 mg de masse en énergie : ça suffit à libérer 82 milliards de joules, autant que la combustion de 2,8 tonnes de charbon.</p>`)}
  <div class="prose">
    <p class="note"><b>Nucléaire contre chimique.</b> Brûler un atome de carbone libère environ 4 électronvolts. Casser un noyau d'uranium-235 en libère environ 200 millions. Les liaisons dans le noyau sont des millions de fois plus fortes que les liaisons chimiques entre atomes.</p>
  </div>`,
  mount(root) {
    const data = [["H-2", 2, 1.112, "Deutérium : combustible de la fusion."], ["H-3", 3, 2.827, "Tritium : l'autre combustible de la fusion (radioactif)."], ["He-3", 3, 2.573, ""], ["He-4", 4, 7.074, "Hélium-4 : produit de la fusion. Exceptionnellement stable pour un noyau léger."], ["Li-6", 6, 5.332, ""], ["Li-7", 7, 5.606, ""], ["Be-9", 9, 6.463, ""], ["C-12", 12, 7.680, "Carbone-12 : fabriqué dans les étoiles."], ["N-14", 14, 7.476, ""], ["O-16", 16, 7.976, ""], ["Ne-20", 20, 8.032, ""], ["Mg-24", 24, 8.261, ""], ["Si-28", 28, 8.448, ""], ["Ca-40", 40, 8.551, ""], ["Fe-56", 56, 8.790, "Fer-56 : le sommet de la courbe. Les étoiles ne peuvent pas aller plus loin par fusion : c'est ce qui déclenche l'explosion des supernovas."], ["Ni-62", 62, 8.795, "Nickel-62 : le noyau le plus lié de tous."], ["Zr-90", 90, 8.710, ""], ["Kr-92", 92, 8.513, "Krypton-92 : un fragment typique de la fission de l'uranium."], ["Sn-120", 120, 8.505, ""], ["Ba-141", 141, 8.326, "Baryum-141 : l'autre fragment typique de la fission."], ["Pb-208", 208, 7.867, "Plomb-208 : le plus lourd des noyaux stables."], ["U-235", 235, 7.591, "Uranium-235 : en se cassant en deux fragments mieux liés (≈ 8,4 MeV/nucléon), il libère ≈ 200 MeV."], ["U-238", 238, 7.570, ""], ["Pu-239", 239, 7.560, "Plutonium-239 : fissile lui aussi, produit dans les réacteurs."]];
    const kit = canvasKit($("#be-cv", root), 0.5);
    let hover = null;
    const geo = () => { const { w, h: H } = kit; const pl = 44, pr = 14, pt = 14, pb = 34; return { X: a => pl + (w - pl - pr) * a / 245, Y: b => pt + (H - pt - pb) * (1 - b / 9.5), pl, pr, pt, pb, w, H }; };
    function draw() {
      const { ctx } = kit, g = geo();
      ctx.clearRect(0, 0, g.w, g.H);
      ctx.strokeStyle = T.line; ctx.lineWidth = 1;
      for (let b = 0; b <= 9; b += 1) { ctx.beginPath(); ctx.moveTo(g.pl, g.Y(b)); ctx.lineTo(g.w - g.pr, g.Y(b)); ctx.stroke(); if (b % 2 === 0) text(ctx, b + "", g.pl - 6, g.Y(b), T.muted, 10, "right"); }
      [0, 50, 100, 150, 200, 240].forEach(a => text(ctx, a + "", g.X(a), g.H - g.pb + 14, T.muted, 10, "center"));
      text(ctx, "nombre de nucléons A", g.w - g.pr, g.H - 6, T.muted, 10, "right");
      text(ctx, "MeV / nucléon", g.pl + 4, g.pt + 4, T.muted, 10);
      // zones fission / fusion
      ctx.fillStyle = alpha(T.core, 0.08); ctx.fillRect(g.X(0), g.pt, g.X(30) - g.X(0), g.Y(0) - g.pt);
      ctx.fillStyle = alpha(T.hot, 0.08); ctx.fillRect(g.X(200), g.pt, g.X(245) - g.X(200), g.Y(0) - g.pt);
      text(ctx, "fusion ↗", g.X(15), g.Y(0.6), T.core, 11, "center", "sans");
      text(ctx, "↖ fission", g.X(222), g.Y(0.6), T.hot, 11, "center", "sans");
      // courbe
      ctx.strokeStyle = T.ink; ctx.lineWidth = 1.6; ctx.beginPath();
      data.forEach((d, i) => i ? ctx.lineTo(g.X(d[1]), g.Y(d[2])) : ctx.moveTo(g.X(d[1]), g.Y(d[2])));
      ctx.stroke();
      data.forEach((d, i) => {
        const isH = hover === i, col = d[1] < 30 ? T.core : d[1] > 200 ? T.hot : T.ink;
        circle(ctx, g.X(d[1]), g.Y(d[2]), isH ? 6 : 3.5, isH ? T.volt : col);
      });
      if (hover != null) { const d = data[hover]; text(ctx, d[0], g.X(d[1]) + (d[1] > 200 ? -8 : 8), g.Y(d[2]) - 12, T.ink, 12, d[1] > 200 ? "right" : "left"); }
    }
    kit.onResize = draw; draw();
    const cv = $("#be-cv", root);
    const pick = e => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, g = geo();
      let best = null, bd = 1e9;
      data.forEach((d, i) => { const dd = Math.hypot(g.X(d[1]) - x, g.Y(d[2]) - y); if (dd < bd) { bd = dd; best = i; } });
      if (bd < 40 && best !== hover) {
        hover = best; draw();
        const d = data[best];
        $("#be-t", root).textContent = d[0] + " · " + fmt(d[2], 3) + " MeV/nucléon";
        $("#be-d", root).textContent = d[3] || "Énergie de liaison totale ≈ " + fmt(d[1] * d[2], 0) + " MeV.";
      }
    };
    cv.addEventListener("pointermove", pick);
    cv.addEventListener("pointerdown", pick);
    const labels = ["1 µg", "10 µg", "100 µg", "1 mg", "10 mg", "100 mg", "1 g", "10 g", "100 g", "1 kg"];
    bindRange(root, "mc-m", v => labels[v + 6], v => {
      const kg = Math.pow(10, v) / 1000, E = kg * 299792458 ** 2;
      $("#mc-j", root).textContent = sci(E) + " J";
      $("#mc-kwh", root).textContent = sci(E / 3.6e6) + " kWh";
      $("#mc-foy", root).textContent = sci(E / 3.6e6 / 4500, 1);
    });
    return () => kit.stop();
  },
  quiz: [
    { q: "Quel noyau est parmi les plus stables de l'univers ?", a: ["Uranium-235", "Hydrogène-1", "Fer-56", "Hélium-3"], c: 2, why: "Le fer-56 (et le nickel-62) sont au sommet de la courbe d'énergie de liaison." },
    { q: "Dans une fission, d'où vient l'énergie libérée ?", a: ["De la chaleur de l'uranium", "D'une petite perte de masse convertie en énergie (E = mc²)", "De la combustion de l'uranium", "Des électrons"], c: 1, why: "Les fragments sont un peu plus légers que le noyau de départ : la différence de masse devient de l'énergie." }
  ]
});

/* ===================================================================== */
lesson({
  id: "fission", track: "nuc",
  title: "La fission en chaîne",
  lead: "Un neutron frappe un noyau d'uranium-235, qui se casse en deux et libère 2 ou 3 nouveaux neutrons. Qui peuvent en casser d'autres. Tout l'art du réacteur est de garder ce processus parfaitement stable.",
  body: `
  <div class="prose">
    <p>L'uranium-235 est <strong>fissile</strong> : quand il absorbe un neutron lent, il devient instable et se scinde en deux noyaux plus légers (par exemple baryum et krypton), en libérant environ 200 MeV et en moyenne <strong>2,4 neutrons</strong>.</p>
    <p class="formula">n + ²³⁵U → ¹⁴¹Ba + ⁹²Kr + 3 n + ≈ 200 MeV</p>
    <p>Tout dépend du <strong>facteur de multiplication k</strong>, le nombre moyen de neutrons d'une génération qui provoquent une nouvelle fission :</p>
    <ul>
      <li><strong>k &lt; 1 : sous-critique.</strong> La réaction s'éteint.</li>
      <li><strong>k = 1 : critique.</strong> La réaction s'entretient à puissance constante. C'est l'état normal d'un réacteur en fonctionnement.</li>
      <li><strong>k &gt; 1 : sur-critique.</strong> Le nombre de fissions augmente. On le fait brièvement pour monter en puissance.</li>
    </ul>
    <p>Les neutrons émis sont très rapides (20 000 km/s). Or l'U-235 capture bien mieux les neutrons <strong>lents</strong>. On les ralentit avec un <strong>modérateur</strong> : de l'eau dans les réacteurs français. Pour contrôler la réaction, on utilise des <strong>barres de commande</strong> qui absorbent les neutrons (bore, cadmium, argent-indium), et du bore dissous dans l'eau.</p>
  </div>
  ${lab("Labo", "Pilote la réaction en chaîne", `
    <canvas id="fi-cv" aria-label="Simulation de réaction en chaîne"></canvas>
    <div class="controls">${slider("fi-rod", "Insertion des barres de commande", 0, 100, 1, 50)}
      <div class="ctl"><span class="ctl-top">Modérateur (eau)</span><div class="row"><button class="btn on" id="fi-mod">Présent</button></div></div></div>
    <div class="row"><button class="btn primary" id="fi-inj">Injecter 10 neutrons</button><button class="btn" id="fi-au" style="color:var(--danger);border-color:var(--danger)">Arrêt d'urgence</button><button class="btn" id="fi-reset">Réinitialiser</button></div>
    <div class="readouts">${readout("fi-n", "Neutrons en vol")}${readout("fi-f", "Fissions / seconde")}${readout("fi-k", "k estimé")}</div>
    <p class="status" id="fi-msg"></p>
    <p class="hint">Les noyaux fissionnés (gris) sont remplacés au bout de quelques secondes, comme si on rechargeait du combustible. Les neutrons qui sortent du cadre sont perdus.</p>`)}
  <div class="prose">
    <p class="note"><b>Les neutrons retardés, la clé du pilotage.</b> Environ 0,65 % des neutrons ne sont pas émis tout de suite mais quelques secondes plus tard, par certains fragments. Sans eux, la réaction varierait en quelques millisecondes et serait impossible à piloter. Grâce à eux, un réacteur réagit à l'échelle de la seconde ou de la minute.</p>
    <p class="note"><b>Une centrale ne peut pas exploser comme une bombe.</b> Une bombe exige de l'uranium enrichi à plus de 90 %, assemblé en une fraction de milliseconde. Le combustible d'un réacteur à eau n'est enrichi qu'à 3 à 5 %.</p>
  </div>`,
  mount(root) {
    const kit = canvasKit($("#fi-cv", root), 0.55);
    let nuclei = [], neutrons = [], flashes = [], mod = true, rods = 0.5;
    let events = [], born = [], lost = [], popHist = [];
    const rodX = [0.2, 0.4, 0.6, 0.8];
    const FI = { refl: 0.3, rodW: 9, pth: 0.6, cap: 0.15 }; // réglés pour être critique vers 50 %
    function setup() {
      nuclei = []; neutrons = []; flashes = []; events = []; born = []; lost = []; popHist = [];
      const { w, h: H } = kit, sp = 30;
      for (let y = sp / 2 + 6; y < H - 40; y += sp) for (let x = sp / 2 + 4; x < w - 4; x += sp) {
        const jx = x + rand(-6, 6), jy = y + rand(-6, 6);
        if (rodX.some(r => Math.abs(jx - r * w) < 10)) continue;
        nuclei.push({ x: jx, y: jy, alive: true, back: 0 });
      }
      inject(6);
    }
    function spawn(x, y) {
      const a = rand(0, Math.PI * 2), v = 240;
      neutrons.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, fast: true, path: 0, last: -1 });
    }
    function inject(n) { const { w, h: H } = kit; for (let i = 0; i < n; i++) spawn(rand(w * 0.1, w * 0.9), rand(20, H - 60)); }
    kit.onResize = setup;
    setup();
    bindRange(root, "fi-rod", v => v + " %", v => { rods = v / 100; });
    const modBtn = $("#fi-mod", root);
    modBtn.onclick = () => { mod = !mod; modBtn.classList.toggle("on", mod); modBtn.textContent = mod ? "Présent" : "Absent (vidangé)"; };
    $("#fi-inj", root).onclick = () => inject(10);
    $("#fi-au", root).onclick = () => { $("#fi-rod", root).value = 100; $("#fi-rod", root).dispatchEvent(new Event("input")); };
    $("#fi-reset", root).onclick = setup;
    let msgT = 0;
    const stop = animate((dt, t) => {
      const { ctx, w, h: H } = kit, floor = H - 40;
      ctx.clearRect(0, 0, w, H);
      // barres de commande
      rodX.forEach(r => {
        ctx.fillStyle = alpha(T.ink, 0.12); ctx.fillRect(r * w - 5, 0, 10, floor);
        ctx.fillStyle = T.ink; ctx.fillRect(r * w - 6, 0, 12, floor * rods);
      });
      if (mod) { ctx.fillStyle = alpha(T.cold, 0.06); ctx.fillRect(0, 0, w, floor); }
      // noyaux
      nuclei.forEach(n => {
        if (!n.alive && t > n.back) n.alive = true;
        circle(ctx, n.x, n.y, 6, n.alive ? T.hot : alpha(T.muted, 0.3));
      });
      // neutrons
      const next = [];
      for (const nn of neutrons) {
        const sp = Math.hypot(nn.vx, nn.vy);
        nn.x += nn.vx * dt; nn.y += nn.vy * dt; nn.path += sp * dt;
        if (nn.fast && mod && nn.path > 70) { nn.fast = false; nn.vx *= 0.33; nn.vy *= 0.33; }
        // diffusion légère
        if (Math.random() < dt * 1.5) { const a = rand(0, 6.283); const s = Math.hypot(nn.vx, nn.vy); nn.vx = Math.cos(a) * s; nn.vy = Math.sin(a) * s; }
        if (nn.x < 0 || nn.x > w || nn.y < 0 || nn.y > floor) {
          // réflecteur : une partie des neutrons rebondit
          if (Math.random() < FI.refl) { if (nn.x < 0 || nn.x > w) nn.vx *= -1; if (nn.y < 0 || nn.y > floor) nn.vy *= -1; nn.x = clamp(nn.x, 0, w); nn.y = clamp(nn.y, 0, floor); }
          else { lost.push(t); continue; }
        }
        if (rodX.some(r => Math.abs(nn.x - r * w) < FI.rodW && nn.y < floor * rods)) { lost.push(t); continue; }
        let gone = false;
        for (let i = 0; i < nuclei.length; i++) {
          const n = nuclei[i];
          if (!n.alive || i === nn.last) continue;
          if (Math.abs(n.x - nn.x) < 8 && Math.abs(n.y - nn.y) < 8) {
            nn.last = i;
            const p = nn.fast ? 0.1 : FI.pth;
            if (Math.random() < p) {
              n.alive = false; n.back = t + rand(3, 6);
              const k = Math.random() < 0.4 ? 3 : 2;
              for (let j = 0; j < k; j++) { spawn(n.x, n.y); born.push(t); }
              flashes.push({ x: n.x, y: n.y, t });
              events.push(t); lost.push(t); gone = true; break;
            } else if (Math.random() < FI.cap) { lost.push(t); gone = true; break; } // capture stérile par l'U-238
          }
        }
        if (!gone) next.push(nn);
      }
      neutrons = next.slice(0, 700);
      neutrons.forEach(nn => circle(ctx, nn.x, nn.y, 2.2, nn.fast ? T.volt : T.core));
      flashes = flashes.filter(f => t - f.t < 0.4);
      flashes.forEach(f => circle(ctx, f.x, f.y, 6 + (t - f.t) * 50, alpha(T.glow, 0.6 * (1 - (t - f.t) / 0.4))));
      // statistiques
      events = events.filter(x => t - x < 1); born = born.filter(x => t - x < 2); lost = lost.filter(x => t - x < 2);
      const k = lost.length ? born.length / lost.length : 0;
      popHist.push(neutrons.length); if (popHist.length > 300) popHist.shift();
      // courbe de population
      const mx = Math.max(50, ...popHist);
      ctx.strokeStyle = T.line; ctx.beginPath(); ctx.moveTo(0, floor + 0.5); ctx.lineTo(w, floor + 0.5); ctx.stroke();
      ctx.strokeStyle = T.core; ctx.lineWidth = 2; ctx.beginPath();
      popHist.forEach((v, i) => { const x = w * i / 300, y = H - 4 - (v / mx) * 30; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
      text(ctx, "population de neutrons", 6, floor + 10, T.muted, 10);
      text(ctx, "● rapide", w - 120, floor + 10, T.volt, 10); text(ctx, "● lent", w - 50, floor + 10, T.core, 10);
      if (t - msgT > 0.25) {
        msgT = t;
        $("#fi-n", root).textContent = neutrons.length;
        $("#fi-f", root).textContent = events.length;
        $("#fi-k", root).textContent = neutrons.length ? fmt(k, 2) : "–";
        const m = $("#fi-msg", root);
        if (neutrons.length >= 650) { m.className = "status danger"; m.textContent = "Sur-critique : la population explose. Insère les barres !"; }
        else if (neutrons.length === 0) { m.className = "status"; m.textContent = "Réaction éteinte (sous-critique). Retire un peu les barres et injecte des neutrons."; }
        else if (k > 1.12) { m.className = "status warn"; m.textContent = "Sur-critique : la puissance augmente."; }
        else if (k < 0.88) { m.className = "status warn"; m.textContent = "Sous-critique : la réaction s'éteint progressivement."; }
        else { m.className = "status ok"; m.textContent = "Proche de la criticité : la réaction s'entretient d'elle-même."; }
        if (!mod && neutrons.length) { m.className = "status"; m.textContent = "Sans modérateur, les neutrons restent rapides et provoquent peu de fissions : la réaction s'étouffe. C'est une sécurité des réacteurs à eau."; }
      }
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Que se passe-t-il quand k = 1 exactement ?", a: ["La réaction s'arrête", "La réaction s'emballe", "La réaction s'entretient à puissance constante", "Le réacteur explose"], c: 2, why: "Chaque fission en provoque exactement une autre : c'est l'état critique, le régime normal." },
    { q: "À quoi sert le modérateur dans un réacteur à eau ?", a: ["À refroidir les barres", "À ralentir les neutrons pour qu'ils provoquent plus de fissions", "À arrêter les rayons gamma", "À enrichir l'uranium"], c: 1, why: "L'U-235 capture beaucoup mieux les neutrons lents, d'où le rôle de l'eau." }
  ]
});

/* ===================================================================== */
lesson({
  id: "rep", track: "nuc",
  title: "Le réacteur à eau pressurisée",
  lead: "Les 57 réacteurs français sont des REP. Au fond, c'est une bouilloire géante : le cœur chauffe de l'eau, la vapeur fait tourner une turbine. Mais avec trois circuits d'eau séparés.",
  body: `
  <div class="prose">
    <p>Une centrale nucléaire est une <strong>centrale thermique</strong> : la fission chauffe de l'eau, la vapeur entraîne une turbine reliée à un alternateur. La particularité du REP est de garder l'eau radioactive enfermée dans un circuit fermé, séparé de celui qui fait tourner la turbine.</p>
  </div>
  ${lab("Labo", "Explore la centrale", `
    <div id="rep-svg" style="min-width:0;overflow-x:auto"></div>
    <div class="info-panel" id="rep-info" aria-live="polite"></div>
    <div class="controls">${slider("rep-rod", "Insertion des barres de commande", 0, 100, 1, 5)}</div>
    <div class="readouts">${readout("rep-th", "Puissance thermique")}${readout("rep-el", "Puissance électrique")}${readout("rep-tc", "Eau primaire (sortie cœur)")}${readout("rep-foy", "Foyers alimentés")}</div>
    <p class="hint">Clique sur un composant pour l'explorer. Valeurs typiques d'un réacteur de 1 300 MWe.</p>`)}
  <div class="prose">
    <h2>Les trois circuits</h2>
    <ul>
      <li><strong>Primaire</strong> (rouge) : l'eau traverse le cœur à 155 bars et sort à environ 320 °C. La pression l'empêche de bouillir. Elle est radioactive et ne quitte jamais l'enceinte.</li>
      <li><strong>Secondaire</strong> (ambre) : dans le générateur de vapeur, l'eau primaire chauffe à travers des milliers de tubes une autre eau, qui se vaporise et file vers la turbine.</li>
      <li><strong>Refroidissement</strong> (bleu) : la vapeur qui sort de la turbine est recondensée en eau grâce à l'eau d'une rivière ou de la mer. Le panache blanc des tours de refroidissement, c'est seulement de la vapeur d'eau.</li>
    </ul>
    <p class="note"><b>Rendement ≈ 33 %.</b> Comme toute centrale thermique, deux tiers de la chaleur produite partent dans la source froide. C'est une limite imposée par la thermodynamique (Carnot), pas un défaut du nucléaire.</p>
  </div>`,
  mount(root) {
    const info = {
      cuve: ["Cuve et cœur", "Un cylindre d'acier de 20 cm d'épaisseur et 13 m de haut. À l'intérieur, le cœur : environ 200 assemblages de 264 crayons de combustible, soit plus de 100 tonnes d'uranium. Les barres de commande coulissent par le haut.", "155 bar · 286 → 323 °C"],
      barres: ["Barres de commande", "Des grappes de crayons absorbants (argent-indium-cadmium, carbure de bore). En cas d'arrêt d'urgence, elles tombent par gravité dans le cœur en moins de 2 secondes et stoppent la réaction.", "chute < 2 s"],
      press: ["Pressuriseur", "Un gros réservoir partiellement rempli de vapeur, chauffé par des résistances. Il maintient la pression du circuit primaire à 155 bars, pour que l'eau reste liquide même à 320 °C.", "155 bar · 345 °C"],
      gv: ["Générateur de vapeur", "Un échangeur de chaleur de 20 m de haut. L'eau primaire passe dans 5 000 tubes en U ; l'eau secondaire, autour, se vaporise. Les deux eaux ne se mélangent jamais.", "≈ 70 bar · vapeur à 280 °C"],
      pompe: ["Pompe primaire", "Fait circuler l'eau du circuit primaire à plus de 20 000 m³ par heure. Chaque réacteur en a 3 ou 4.", "≈ 7 MW chacune"],
      turbine: ["Turbine", "La vapeur se détend à travers des étages d'ailettes et fait tourner l'arbre à 1 500 tr/min. Un étage haute pression, puis plusieurs basse pression.", "1 500 tr/min"],
      alt: ["Alternateur", "Le rotor, un électroaimant géant, tourne dans le stator et produit un courant alternatif triphasé à 50 Hz, autour de 20 000 V. Un transformateur l'élève ensuite à 400 000 V.", "≈ 1 300 MWe · 20 kV"],
      cond: ["Condenseur", "La vapeur sortant de la turbine est refroidie au contact de milliers de tubes parcourus par l'eau froide. Elle redevient liquide et repart vers le générateur de vapeur.", "≈ 0,05 bar · 35 °C"],
      tour: ["Tour de refroidissement", "L'eau chaude du condenseur est pulvérisée dans la tour ; une partie s'évapore et refroidit le reste. Les centrales au bord de la mer n'en ont pas : elles utilisent directement l'eau de mer.", "≈ 160 m de haut"],
      encl: ["Enceinte de confinement", "Un bâtiment en béton armé d'environ 1 m d'épaisseur (souvent double paroi), étanche. C'est la 3ᵉ barrière qui empêche toute fuite radioactive vers l'extérieur.", "≈ 60 m de diamètre"],
      ligne: ["Réseau", "Après le transformateur principal, l'électricité part à 400 000 V sur le réseau de RTE.", "400 kV"]
    };
    const svg = `<svg viewBox="0 0 900 440" style="min-width:560px" role="img" aria-label="Schéma d'un réacteur à eau pressurisée">
      <style>.hit{cursor:pointer}.hit:hover>*:first-child{stroke:var(--core);stroke-width:3}</style>
      <!-- enceinte -->
      <g class="hit" data-k="encl"><path d="M30 420 V140 Q30 40 180 40 Q330 40 330 140 V420 Z" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/><text x="44" y="410" font-size="15" fill="var(--muted)" font-family="IBM Plex Mono, monospace">enceinte</text></g>
      <!-- circuit primaire -->
      <path id="p-hot" d="M150 200 H245" stroke="var(--hot)" stroke-width="10" fill="none"/>
      <path d="M150 200 H245" stroke="var(--surface)" stroke-width="3" fill="none" stroke-dasharray="4 12" class="flow fl"/>
      <path d="M260 330 V370 H200 M185 370 H160 V310 H150" stroke="var(--cold)" stroke-width="10" fill="none" opacity=".8"/>
      <path d="M260 330 V370 H200 M185 370 H160 V310 H150" stroke="var(--surface)" stroke-width="3" fill="none" stroke-dasharray="4 12" class="flow fl"/>
      <path d="M190 200 V170" stroke="var(--hot)" stroke-width="6"/>
      <!-- cuve -->
      <g class="hit" data-k="cuve"><rect x="70" y="140" width="80" height="210" rx="34" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
        <rect x="84" y="230" width="52" height="96" fill="var(--hot)" opacity=".25" id="rep-core"/>
        ${[90, 98, 106, 114, 122, 130].map(x => `<line x1="${x}" y1="234" x2="${x}" y2="322" stroke="var(--hot)" stroke-width="3"/>`).join("")}
        <text x="110" y="372" text-anchor="middle" font-size="15" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">cuve</text></g>
      <g class="hit" data-k="barres" id="rep-rods">${[94, 110, 126].map(x => `<rect x="${x - 2.5}" y="128" width="5" height="100" fill="var(--ink)"/>`).join("")}<rect x="84" y="120" width="52" height="8" fill="var(--ink)"/></g>
      <!-- pressuriseur -->
      <g class="hit" data-k="press"><rect x="174" y="80" width="32" height="92" rx="16" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><rect x="176" y="128" width="28" height="42" rx="12" fill="var(--hot)" opacity=".35"/><text x="190" y="70" text-anchor="middle" font-size="14" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">pressuriseur</text></g>
      <!-- générateur de vapeur -->
      <g class="hit" data-k="gv"><rect x="232" y="80" width="56" height="256" rx="26" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
        <path d="M248 330 V180 Q260 160 272 180 V330" fill="none" stroke="var(--hot)" stroke-width="3"/><rect x="236" y="96" width="48" height="60" rx="18" fill="var(--volt)" opacity=".18"/>
        <text x="260" y="352" text-anchor="middle" font-size="14" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">générateur</text><text x="260" y="365" text-anchor="middle" font-size="14" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">de vapeur</text></g>
      <!-- pompe primaire -->
      <g class="hit" data-k="pompe"><circle cx="192" cy="370" r="14" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><path d="M186 364 L200 370 L186 376 Z" fill="var(--ink)"/><text x="192" y="400" text-anchor="middle" font-size="14" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">pompe</text></g>
      <!-- circuit secondaire -->
      <path d="M260 80 V22 H440 V110" stroke="var(--volt)" stroke-width="8" fill="none"/>
      <path d="M260 80 V22 H440 V110" stroke="var(--surface)" stroke-width="3" fill="none" stroke-dasharray="4 12" class="flow fl"/>
      <path d="M500 196 V250 M500 320 V380 H400 V300 H288" stroke="var(--volt)" stroke-width="6" fill="none" opacity=".7"/>
      <path d="M500 196 V250 M500 320 V380 H400 V300 H288" stroke="var(--surface)" stroke-width="2.5" fill="none" stroke-dasharray="4 12" class="flow fl"/>
      <!-- turbine -->
      <g class="hit" data-k="turbine"><path d="M420 110 L580 80 V226 L420 196 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
        <g id="rep-blades">${[0, 1, 2, 3, 4].map(i => `<line x1="${445 + i * 28}" y1="${110 - i * 4}" x2="${445 + i * 28}" y2="${196 + i * 4}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 4" class="flow fl"/>`).join("")}</g>
        <text x="500" y="244" text-anchor="middle" font-size="15" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">turbine</text></g>
      <line x1="580" y1="153" x2="610" y2="153" stroke="var(--ink)" stroke-width="6"/>
      <!-- alternateur -->
      <g class="hit" data-k="alt"><rect x="610" y="118" width="90" height="70" rx="10" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><text x="655" y="158" text-anchor="middle" font-size="15" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">alternateur</text></g>
      <!-- ligne -->
      <g class="hit" data-k="ligne"><path d="M700 153 H780" stroke="var(--volt)" stroke-width="3"/><path d="M800 60 L780 200 M800 60 L820 200 M786 100 H814 M782 140 H818 M775 80 H825" stroke="var(--ink)" stroke-width="2" fill="none"/><rect x="770" y="50" width="60" height="160" fill="transparent"/><text x="800" y="44" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="IBM Plex Mono, monospace">400 kV</text></g>
      <!-- condenseur -->
      <g class="hit" data-k="cond"><rect x="440" y="250" width="120" height="70" rx="8" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>${[266, 282, 298].map(y => `<line x1="450" y1="${y}" x2="550" y2="${y}" stroke="var(--cold)" stroke-width="3"/>`).join("")}<text x="500" y="340" text-anchor="middle" font-size="15" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">condenseur</text></g>
      <!-- refroidissement -->
      <path d="M560 266 H700 M700 300 H560" stroke="var(--cold)" stroke-width="7" fill="none"/>
      <path d="M560 266 H700 M700 300 H560" stroke="var(--surface)" stroke-width="2.5" fill="none" stroke-dasharray="4 12" class="flow fl"/>
      <g class="hit" data-k="tour"><path d="M700 420 Q730 330 712 250 H828 Q810 330 840 420 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
        <g id="rep-plume" opacity=".5"><circle cx="750" cy="232" r="16" fill="var(--muted)"/><circle cx="775" cy="220" r="20" fill="var(--muted)"/><circle cx="800" cy="232" r="15" fill="var(--muted)"/></g>
        <text x="770" y="400" text-anchor="middle" font-size="14" fill="var(--ink)" font-family="IBM Plex Sans, sans-serif">tour</text></g>
    </svg>`;
    $("#rep-svg", root).innerHTML = svg;
    const show = k => {
      const d = info[k];
      $("#rep-info", root).innerHTML = `<div class="eyebrow">Composant</div><h4>${d[0]}</h4><p>${d[1]}</p><div class="facts">${d[2]}</div>`;
    };
    $$(".hit", root).forEach(g => g.addEventListener("click", () => show(g.dataset.k)));
    show("cuve");
    bindRange(root, "rep-rod", v => v + " %", v => {
      const p = clamp((100 - v) / 95, 0, 1);
      $("#rep-th", root).textContent = fmt(3817 * p, 0) + " MWth";
      $("#rep-el", root).textContent = fmt(1300 * p, 0) + " MWe";
      $("#rep-tc", root).textContent = fmt(286 + 37 * p, 0) + " °C";
      $("#rep-foy", root).textContent = "≈ " + fmt(Math.round(1300 * p * 1000 * 7000 / 4500 / 10000) * 10000, 0);
      const ry = 128 + 96 * (v / 100);
      $$("#rep-rods rect", root).forEach((r, i) => r.setAttribute("y", i < 3 ? ry : ry - 8));
      $("#rep-core", root).setAttribute("opacity", 0.08 + 0.4 * p);
      $$(".fl", root).forEach(e => { e.style.animationDuration = p > 0.01 ? (1.2 / (0.2 + p)) + "s" : "0s"; e.style.animationPlayState = p > 0.01 ? "running" : "paused"; });
      $("#rep-plume", root).setAttribute("opacity", 0.1 + 0.5 * p);
    });
  },
  quiz: [
    { q: "Pourquoi l'eau du circuit primaire ne bout-elle pas à 320 °C ?", a: ["Elle contient du bore", "Elle est maintenue à 155 bars de pression", "Elle est radioactive", "Elle circule trop vite"], c: 1, why: "Sous très haute pression, la température d'ébullition de l'eau dépasse 340 °C." },
    { q: "Que sort-il des tours de refroidissement ?", a: ["De la fumée radioactive", "Du CO₂", "De la vapeur d'eau", "Des neutrons"], c: 2, why: "Le panache est de la vapeur d'eau du circuit de refroidissement, qui n'a jamais été en contact avec le cœur." }
  ]
});

/* ===================================================================== */
lesson({
  id: "combustible", track: "nuc",
  title: "Combustible et déchets",
  lead: "De la mine au stockage géologique, l'uranium suit un long voyage. Et il laisse des déchets dont une petite partie reste dangereuse pendant des centaines de milliers d'années.",
  body: `
  <div class="prose">
    <p>L'uranium naturel contient seulement <strong>0,7 % d'uranium-235</strong> fissile ; le reste est de l'uranium-238. Pour les réacteurs à eau, on l'<strong>enrichit</strong> à 3 à 5 % d'U-235. Le combustible prend la forme de pastilles de céramique grosses comme un bout de doigt : une seule pastille de 7 grammes produit autant d'électricité qu'environ une tonne de charbon.</p>
  </div>
  ${lab("Labo 1", "Le cycle du combustible", `
    <div class="steps" id="cy-steps"></div>
    <div class="info-panel" id="cy-info" aria-live="polite"></div>`)}
  <div class="prose">
    <h2>Les déchets radioactifs</h2>
    <p>En France, l'Andra classe les déchets selon leur activité et leur durée de vie. Le contraste est frappant : <strong>les déchets de haute activité représentent une infime fraction du volume, mais presque toute la radioactivité</strong>.</p>
  </div>
  ${lab("Labo 2", "Volume contre radioactivité", `
    <div class="row"><button class="btn on" id="wa-v">Part du volume</button><button class="btn" id="wa-r">Part de la radioactivité</button></div>
    <div id="wa-chart" style="display:grid;gap:8px"></div>
    <p class="hint">Ordres de grandeur d'après l'inventaire national de l'Andra.</p>`)}
  <div class="prose">
    <p class="note"><b>Cigéo.</b> Pour les déchets de haute activité et de moyenne activité à vie longue, la France prévoit un stockage géologique profond à Bure (Meuse/Haute-Marne), à 500 mètres sous terre dans une couche d'argile stable depuis 160 millions d'années.</p>
  </div>`,
  mount(root) {
    const steps = [
      ["Extraction", "On extrait le minerai d'uranium dans des mines (Kazakhstan, Canada, Niger, Australie…). Il est transformé sur place en « yellowcake », une poudre jaune concentrée à environ 75 % d'uranium."],
      ["Conversion", "Le yellowcake est purifié puis transformé en hexafluorure d'uranium (UF₆), qui devient gazeux vers 56 °C. En France : usines d'Orano à Malvési et au Tricastin."],
      ["Enrichissement", "On augmente la proportion d'U-235 de 0,7 % à 3–5 % par centrifugation : des milliers de centrifugeuses tournant à très grande vitesse séparent les isotopes, l'U-238 étant à peine plus lourd. Il reste de l'uranium appauvri."],
      ["Fabrication", "L'uranium enrichi est transformé en poudre d'oxyde (UO₂), pressé en pastilles, cuit à 1 700 °C, puis empilé dans des tubes de zirconium de 4 m : les crayons. 264 crayons forment un assemblage."],
      ["Réacteur", "Chaque assemblage reste 4 à 5 ans dans le cœur. Une partie de l'U-235 fissionne, une partie de l'U-238 se transforme en plutonium. À la sortie, le combustible usé contient environ 95 % d'uranium, 1 % de plutonium et 4 % de produits de fission."],
      ["Piscine", "Le combustible usé, très chaud et très radioactif, refroidit plusieurs années dans des piscines. Quelques mètres d'eau suffisent à arrêter le rayonnement."],
      ["Retraitement", "À La Hague, on sépare l'uranium et le plutonium (réutilisables) des produits de fission et actinides mineurs (déchets ultimes). Ces derniers sont vitrifiés : coulés dans du verre, dans des conteneurs en acier."],
      ["MOX", "Le plutonium récupéré, mélangé à de l'uranium appauvri, forme un nouveau combustible, le MOX, utilisé dans une vingtaine de réacteurs français."],
      ["Stockage", "Les déchets vitrifiés sont entreposés en attendant un stockage géologique profond (projet Cigéo). Les déchets de faible activité sont déjà stockés en surface dans l'Aube."]
    ];
    const bx = $("#cy-steps", root);
    steps.forEach((s, i) => { const b = h(`<button class="step"><i>${i + 1}</i>${s[0]}</button>`); b.onclick = () => sel(i); bx.appendChild(b); });
    function sel(i) {
      $$(".step", bx).forEach((b, j) => b.classList.toggle("on", i === j));
      $("#cy-info", root).innerHTML = `<div class="eyebrow">Étape ${i + 1} sur ${steps.length}</div><h4>${steps[i][0]}</h4><p>${steps[i][1]}</p><div class="row"><button class="btn" ${i ? "" : "disabled"} id="cy-prev">← Précédente</button><button class="btn" ${i < steps.length - 1 ? "" : "disabled"} id="cy-next">Suivante →</button></div>`;
      $("#cy-prev", root).onclick = () => i && sel(i - 1);
      $("#cy-next", root).onclick = () => i < steps.length - 1 && sel(i + 1);
    }
    sel(0);
    const cats = [
      ["HA · Haute activité", "Produits de fission vitrifiés. Vie : jusqu'à des centaines de milliers d'années.", 0.2, 95, "danger"],
      ["MA-VL · Moyenne activité, vie longue", "Gaines et structures métalliques des assemblages.", 2.9, 4.9, "warn"],
      ["FA-VL · Faible activité, vie longue", "Graphite des anciens réacteurs, déchets radifères.", 7.2, 0.1, "volt"],
      ["FMA-VC · Faible et moyenne activité, vie courte", "Gants, filtres, outils, vêtements… Activité divisée par 1 000 en 300 ans.", 59.6, 0.03, "core"],
      ["TFA · Très faible activité", "Gravats, terres, ferrailles issues du démantèlement.", 30.1, 0.0001, "ok"]
    ];
    let mode = 0;
    function draw() {
      $("#wa-v", root).classList.toggle("on", mode === 0); $("#wa-r", root).classList.toggle("on", mode === 1);
      $("#wa-chart", root).innerHTML = cats.map(c => {
        const v = c[2 + mode];
        return `<div style="display:grid;gap:3px"><div class="row" style="justify-content:space-between;font-size:.9rem"><b style="font-weight:600">${c[0]}</b><span class="mono">${v < 0.01 ? "< 0,01" : fmt(v, 1)} %</span></div>
          <div class="bar" style="height:12px;color:var(--${c[4]})"><i style="width:${Math.max(0.6, v)}%"></i></div><span class="hint">${c[1]}</span></div>`;
      }).join("");
    }
    $("#wa-v", root).onclick = () => { mode = 0; draw(); };
    $("#wa-r", root).onclick = () => { mode = 1; draw(); };
    draw();
  },
  quiz: [
    { q: "Quelle proportion d'U-235 contient l'uranium naturel ?", a: ["0,7 %", "5 %", "50 %", "90 %"], c: 0, why: "Seulement 0,7 %. Il faut l'enrichir à 3–5 % pour les réacteurs à eau." },
    { q: "Les déchets de haute activité représentent…", a: ["la majorité du volume", "environ 0,2 % du volume mais l'essentiel de la radioactivité", "la moitié de la radioactivité", "rien du tout"], c: 1, why: "Un volume minuscule, mais environ 95 % de la radioactivité totale des déchets." }
  ]
});

/* ===================================================================== */
lesson({
  id: "surete", track: "nuc",
  title: "Sûreté et accidents",
  lead: "Le principe de la sûreté nucléaire : supposer que tout peut tomber en panne, et empiler les protections pour qu'aucune défaillance isolée ne conduise à un rejet radioactif.",
  body: `
  <div class="prose">
    <p>La sûreté repose sur la <strong>défense en profondeur</strong> : plusieurs niveaux de protection indépendants, et trois <strong>barrières physiques</strong> successives entre le combustible et l'environnement. Trois fonctions doivent toujours être assurées : <strong>contrôler la réaction</strong>, <strong>refroidir le combustible</strong> (même à l'arrêt, il continue à chauffer : c'est la « chaleur résiduelle ») et <strong>confiner la radioactivité</strong>.</p>
    <p>En France, l'<strong>Autorité de sûreté nucléaire et de radioprotection</strong> (ASNR) contrôle les installations et peut imposer l'arrêt d'un réacteur.</p>
  </div>
  ${lab("Labo 1", "Les trois barrières", `
    <div class="split"><div id="sb-svg"></div><div class="info-panel" id="sb-info" aria-live="polite"></div></div>`)}
  ${lab("Labo 2", "L'échelle INES", `
    <div class="ines" id="ines"></div>
    <div class="info-panel" id="ines-info" aria-live="polite"></div>`)}
  ${lab("Histoire", "Trois accidents majeurs", `
    <div class="row" id="acc-btns"></div>
    <div class="info-panel" id="acc-info" aria-live="polite"></div>`)}`,
  mount(root) {
    const bar = [
      ["Gaine du combustible", "1ʳᵉ barrière : les pastilles d'uranium sont enfermées dans des tubes étanches en alliage de zirconium. Ils retiennent les produits de fission radioactifs."],
      ["Circuit primaire", "2ᵉ barrière : la cuve en acier de 20 cm et les tuyauteries du circuit primaire forment une enveloppe fermée autour du cœur."],
      ["Enceinte de confinement", "3ᵉ barrière : un bâtiment en béton armé de 1 m d'épaisseur ou plus, conçu pour résister à la pression d'un accident, et à l'extérieur, aux chocs comme une chute d'avion."]
    ];
    const cols = ["hot", "volt", "core"];
    $("#sb-svg", root).innerHTML = `<svg viewBox="0 0 300 260" role="img" aria-label="Trois barrières concentriques">
      ${[2, 1, 0].map(i => { const g = 2 - i; return `<g class="sb" data-i="${i}" style="cursor:pointer"><rect x="${20 + g * 40}" y="${20 + g * 34}" width="${260 - g * 80}" height="${220 - g * 68}" rx="${i === 0 ? 14 : 30 + i * 20}" fill="var(--surface)" stroke="var(--${cols[i]})" stroke-width="${i === 2 ? 6 : 4}"/></g>`; }).join("")}
      ${[[120, 115], [140, 115], [160, 115], [130, 135], [150, 135], [170, 135]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="var(--hot)" opacity=".6" pointer-events="none"/>`).join("")}
      <text x="150" y="44" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono, monospace" pointer-events="none">3 · enceinte</text>
      <text x="150" y="76" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono, monospace" pointer-events="none">2 · circuit primaire</text>
      <text x="150" y="168" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono, monospace" pointer-events="none">1 · gaines</text></svg>`;
    const showB = i => { $("#sb-info", root).innerHTML = `<div class="eyebrow">Barrière ${i + 1}</div><h4>${bar[i][0]}</h4><p>${bar[i][1]}</p>`; };
    $$(".sb", root).forEach(g => g.addEventListener("click", e => { e.stopPropagation(); showB(+g.dataset.i); }));
    showB(0);
    const ines = [
      ["0", "Écart", "Sans importance pour la sûreté.", "Plusieurs centaines par an en France."],
      ["1", "Anomalie", "Écart au fonctionnement autorisé, sans conséquence.", "Une centaine par an en France."],
      ["2", "Incident", "Défaillance importante des dispositifs de sûreté, sans rejet notable.", "Quelques cas par an en France."],
      ["3", "Incident grave", "Exposition de travailleurs au-delà des limites, contamination grave sur le site.", "Sellafield (Royaume-Uni), 2005 : fuite interne dans l'usine de retraitement."],
      ["4", "Accident sans risque important hors du site", "Fusion partielle du combustible, rejet mineur.", "Saint-Laurent-des-Eaux (France), 1969 et 1980 : fusion de quelques éléments combustibles."],
      ["5", "Accident avec risque hors du site", "Dommages graves au cœur, rejet limité.", "Three Mile Island (États-Unis), 1979."],
      ["6", "Accident grave", "Rejet important nécessitant des contre-mesures.", "Kychtym (URSS), 1957 : explosion d'une cuve de déchets."],
      ["7", "Accident majeur", "Rejet massif, effets étendus sur la santé et l'environnement.", "Tchernobyl (URSS), 1986 · Fukushima (Japon), 2011."]
    ];
    const col = i => i === 0 ? "var(--muted)" : i < 4 ? "var(--warn)" : "var(--danger)";
    const ib = $("#ines", root);
    ines.forEach((l, i) => { const b = h(`<button style="background:${col(i)};opacity:${0.55 + i * 0.065}" aria-label="Niveau ${i}">${l[0]}</button>`); b.onclick = () => selI(i); ib.appendChild(b); });
    function selI(i) {
      $$("button", ib).forEach((b, j) => b.classList.toggle("on", i === j));
      $("#ines-info", root).innerHTML = `<div class="eyebrow">Niveau ${i} · ${i < 4 ? "incident" : "accident"}</div><h4>${ines[i][1]}</h4><p>${ines[i][2]}</p><div class="facts">Exemple : ${ines[i][3]}</div>`;
    }
    selI(5);
    const acc = [
      ["Three Mile Island · 1979", "Une vanne restée ouverte et des indications trompeuses en salle de commande conduisent les opérateurs à couper le refroidissement de secours. Environ la moitié du cœur fond. Mais la cuve et l'enceinte tiennent : les rejets sont très faibles et aucun décès n'est attribué à l'accident.", "Leçon : l'importance des facteurs humains, de la formation et de l'ergonomie des salles de commande."],
      ["Tchernobyl · 1986", "Pendant un essai mal préparé, sur un réacteur RBMK de conception soviétique instable à faible puissance (coefficient de vide positif) et sans véritable enceinte de confinement, la puissance s'emballe. Explosion de vapeur, incendie du graphite pendant 10 jours, rejets massifs sur toute l'Europe. Une zone d'exclusion de 30 km existe encore.", "Bilan : plusieurs dizaines de morts directs, des milliers de cancers de la thyroïde chez les enfants exposés, et des estimations de décès à long terme qui font encore débat (de quelques milliers à plusieurs dizaines de milliers)."],
      ["Fukushima Daiichi · 2011", "Un séisme de magnitude 9 provoque l'arrêt automatique des réacteurs, puis un tsunami de 14 m noie les générateurs de secours. Sans refroidissement, la chaleur résiduelle fait fondre trois cœurs ; des explosions d'hydrogène détruisent les bâtiments. Plus de 100 000 personnes sont évacuées.", "Leçon : se protéger contre des agressions extrêmes. En France, un « noyau dur » de moyens de secours bunkerisés et une Force d'action rapide nucléaire (FARN) ont été créés après Fukushima."]
    ];
    const ab = $("#acc-btns", root);
    acc.forEach((a, i) => { const b = h(`<button class="btn">${a[0]}</button>`); b.onclick = () => selA(i); ab.appendChild(b); });
    function selA(i) {
      $$("button", ab).forEach((b, j) => b.classList.toggle("on", i === j));
      $("#acc-info", root).innerHTML = `<h4>${acc[i][0]}</h4><p>${acc[i][1]}</p><p class="note"><b>${acc[i][2].split(" : ")[0]} :</b> ${acc[i][2].split(" : ").slice(1).join(" : ")}</p>`;
    }
    selA(1);
  },
  quiz: [
    { q: "Pourquoi faut-il continuer à refroidir un réacteur après son arrêt ?", a: ["Pour économiser l'eau", "Le combustible continue de chauffer à cause de la radioactivité des produits de fission", "Parce que les barres chauffent", "Ce n'est pas nécessaire"], c: 1, why: "La chaleur résiduelle représente encore quelques % de la puissance juste après l'arrêt. C'est ce qui a causé la fusion à Fukushima." },
    { q: "Quelle est la 3ᵉ barrière de confinement ?", a: ["La gaine", "La cuve", "L'enceinte en béton", "La tour de refroidissement"], c: 2, why: "Gaine du combustible, circuit primaire, puis enceinte de confinement." }
  ]
});

/* ===================================================================== */
lesson({
  id: "fusion", track: "nuc",
  title: "La fusion nucléaire",
  lead: "Le Soleil brille en fusionnant de l'hydrogène en hélium. Reproduire ça sur Terre promet une énergie abondante, mais il faut chauffer la matière à 150 millions de degrés.",
  body: `
  <div class="prose">
    <p>La fusion fait l'inverse de la fission : elle assemble deux noyaux légers en un noyau plus lourd et mieux lié. La réaction la plus facile à obtenir sur Terre associe deux isotopes de l'hydrogène :</p>
    <p class="formula">²H (deutérium) + ³H (tritium) → ⁴He + n + 17,6 MeV</p>
    <p>Le problème : les deux noyaux sont chargés positivement et se repoussent. Pour qu'ils se touchent et que l'interaction forte prenne le relais, il faut qu'ils se percutent à une vitesse énorme. Cela veut dire une température d'environ <strong>150 millions de °C</strong>, dix fois plus que le cœur du Soleil. À ces températures, la matière est un <strong>plasma</strong> qu'aucun matériau ne peut contenir : on l'enferme dans une cage magnétique (tokamak) ou on le comprime avec des lasers.</p>
  </div>
  ${lab("Labo", "Fais fusionner deux noyaux", `
    <canvas id="fu-cv" aria-label="Deux noyaux qui se rapprochent"></canvas>
    <div class="controls">${slider("fu-t", "Température du plasma", 1, 300, 1, 40)}</div>
    <div class="readouts">${readout("fu-n", "Collisions")}${readout("fu-f", "Fusions réussies")}${readout("fu-p", "Taux de réussite")}</div>
    <p class="status" id="fu-msg"></p>
    <p class="hint">Probabilités illustratives : en réalité, même à 150 millions de °C, seule une infime fraction des collisions aboutit ; c'est l'énorme nombre de collisions par seconde qui fait la puissance.</p>`)}
  <div class="prose">
    <div class="table-wrap"><table>
      <thead><tr><th></th><th>Fission</th><th>Fusion</th></tr></thead>
      <tbody>
        <tr><td>Principe</td><td>Casser un noyau lourd</td><td>Assembler deux noyaux légers</td></tr>
        <tr><td>Combustible</td><td>Uranium, plutonium</td><td>Deutérium (eau de mer), tritium (fabriqué à partir de lithium)</td></tr>
        <tr><td>Déchets</td><td>Produits de fission à vie longue</td><td>Matériaux activés, surtout à vie courte</td></tr>
        <tr><td>Emballement possible ?</td><td>Oui, sans contrôle</td><td>Non : la réaction s'arrête d'elle-même</td></tr>
        <tr><td>Maturité</td><td>Industrielle depuis les années 1950</td><td>Expérimentale</td></tr>
      </tbody></table></div>
    <p class="note"><b>Où en est-on ?</b> En décembre 2022, le laser NIF (États-Unis) a pour la première fois produit plus d'énergie de fusion que l'énergie laser envoyée sur la cible. ITER, le grand tokamak international en construction à Cadarache (Bouches-du-Rhône), doit démontrer un plasma produisant 10 fois plus d'énergie qu'il n'en reçoit. L'électricité de fusion commerciale n'est pas attendue avant la seconde moitié du siècle.</p>
  </div>`,
  mount(root) {
    const kit = canvasKit($("#fu-cv", root), 0.36);
    let T6 = 40, col = 0, fus = 0, st = null;
    const pf = T => Math.exp(-3 * Math.pow(150 / T, 2 / 3));
    bindRange(root, "fu-t", v => v + " millions de °C", v => {
      T6 = v; col = 0; fus = 0;
      const m = $("#fu-msg", root);
      if (v < 15) { m.className = "status"; m.textContent = "Plus froid que le cœur du Soleil (15 M°C). Le Soleil y arrive grâce à sa densité colossale et à son immense volume : nous, non."; }
      else if (v < 100) { m.className = "status warn"; m.textContent = "La répulsion électrique gagne presque toujours : les noyaux rebondissent."; }
      else { m.className = "status ok"; m.textContent = "Zone de fonctionnement d'ITER (≈ 150 M°C) : les fusions deviennent assez fréquentes."; }
    });
    const reset = () => {
      const v = 0.6 + Math.sqrt(T6 / 150) * rand(0.6, 1.4);
      st = { x1: 0.08, x2: 0.92, v, phase: "in", t: 0, ok: Math.random() < pf(T6) * 3 };
    };
    reset();
    const stop = animate((dt, t) => {
      const { ctx, w, h: H } = kit, cy = H / 2;
      ctx.clearRect(0, 0, w, H);
      if (st.phase === "in") {
        st.x1 += st.v * dt * 0.35; st.x2 -= st.v * dt * 0.35;
        const gap = st.x2 - st.x1, minGap = st.ok ? 0.02 : 0.06 + 0.22 / (1 + st.v * 2);
        if (gap <= minGap) { st.phase = st.ok ? "boom" : "out"; st.t = t; col++; if (st.ok) fus++; }
      } else if (st.phase === "out") {
        st.x1 -= st.v * dt * 0.35; st.x2 += st.v * dt * 0.35;
        if (st.x1 < 0.05) reset();
      } else if (t - st.t > 1.3) reset();
      const X1 = st.x1 * w, X2 = st.x2 * w;
      if (st.phase !== "boom") {
        circle(ctx, X1 - 5, cy, 8, T.hot); circle(ctx, X1 + 5, cy, 8, T.muted); text(ctx, "D", X1, cy - 20, T.muted, 11, "center");
        circle(ctx, X2 - 8, cy, 8, T.hot); circle(ctx, X2 + 2, cy - 6, 8, T.muted); circle(ctx, X2 + 2, cy + 7, 8, T.muted); text(ctx, "T", X2, cy - 24, T.muted, 11, "center");
        if (st.phase === "out" && t - st.t < 0.3) text(ctx, "répulsion !", (X1 + X2) / 2, cy + 34, T.danger, 12, "center", "sans");
      } else {
        const k = (t - st.t) / 1.3, cx = (X1 + X2) / 2;
        circle(ctx, cx, cy, 20 + k * 120, alpha(T.glow, 0.5 * (1 - k)));
        [[-5, -5, T.hot], [5, 5, T.hot], [5, -5, T.muted], [-5, 5, T.muted]].forEach(([dx, dy, c]) => circle(ctx, cx - k * 60 + dx, cy + dy, 8, c));
        text(ctx, "⁴He · 3,5 MeV", cx - k * 60, cy - 26, T.ink, 11, "center");
        circle(ctx, cx + k * w * 0.4, cy, 7, T.muted);
        text(ctx, "neutron · 14,1 MeV", cx + k * w * 0.4, cy - 20, T.ink, 11, "center");
      }
      $("#fu-n", root).textContent = col;
      $("#fu-f", root).textContent = fus;
      $("#fu-p", root).textContent = col ? fmt(fus / col * 100, 0) + " %" : "–";
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Pourquoi faut-il une température aussi élevée pour la fusion ?", a: ["Pour faire fondre l'uranium", "Pour vaincre la répulsion électrique entre noyaux positifs", "Pour produire de la vapeur", "Pour créer des neutrons lents"], c: 1, why: "Les noyaux doivent aller assez vite pour s'approcher malgré leur répulsion, jusqu'à la portée de l'interaction forte." },
    { q: "Où est construit le réacteur expérimental ITER ?", a: ["Au Japon", "Aux États-Unis", "En France, à Cadarache", "En Suisse, au CERN"], c: 2, why: "ITER est en construction à Saint-Paul-lez-Durance, sur le site de Cadarache." }
  ]
});
