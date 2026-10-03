/* Parcours ÉLECTRICITÉ — 9 leçons, chacune avec un labo interactif. */
"use strict";

/* ===================================================================== */
lesson({
  id: "charges", track: "elec",
  title: "Charges et électrons",
  lead: "Tout commence dans l'atome : des électrons négatifs autour d'un noyau positif. L'électricité, c'est ce qui se passe quand ces charges se mettent en mouvement.",
  body: `
  <div class="prose">
    <p>La matière est faite d'atomes. Chaque atome possède un <strong>noyau</strong> chargé positivement (des protons) entouré d'<strong>électrons</strong> chargés négativement. Deux charges de même signe se repoussent, deux charges opposées s'attirent : c'est la <strong>force électrique</strong>, décrite par la loi de Coulomb.</p>
    <p class="formula">F = k · q₁ · q₂ / d²    (k ≈ 9 × 10⁹ N·m²/C²)</p>
    <p>La charge d'un seul électron est minuscule : <span class="mono">e = 1,602 × 10⁻¹⁹ C</span>. Il faut environ <strong>6,24 milliards de milliards</strong> d'électrons pour faire 1 coulomb.</p>
    <h2>Conducteurs et isolants</h2>
    <p>Dans un <strong>métal</strong>, les électrons les plus éloignés du noyau ne sont presque pas retenus : ils forment un « gaz » d'<strong>électrons libres</strong> qui circulent entre les atomes. Il suffit d'une petite poussée (une tension) pour les faire avancer : c'est un <strong>conducteur</strong>.</p>
    <p>Dans le verre, le caoutchouc ou le bois sec, chaque électron reste attaché à son atome : rien ne circule, c'est un <strong>isolant</strong>. Entre les deux, les <strong>semi-conducteurs</strong> (silicium) ont très peu de porteurs libres, mais on peut en contrôler le nombre : c'est la base de toute l'électronique.</p>
  </div>
  ${lab("Labo", "Conducteur ou isolant ?", `
    <div class="row" id="mat-btns"></div>
    <canvas id="mat-cv" aria-label="Simulation des électrons dans un matériau"></canvas>
    <div class="row"><button class="btn primary" id="mat-on">Brancher la pile</button><span class="hint">Les électrons libres (en ambre) dérivent vers la borne + quand la pile est branchée.</span></div>
    <div class="readouts">${readout("mat-rho", "Résistivité ρ")}${readout("mat-r", "Résistance d'1 m de fil (1 mm²)")}${readout("mat-i", "Courant sous 1 V")}</div>
    <p class="hint" id="mat-desc"></p>`)}
  <div class="prose">
    <p class="note"><b>À retenir.</b> Le courant électrique est un déplacement d'ensemble de charges. Dans un fil de cuivre, ce sont les électrons libres ; dans l'eau salée ou une batterie, ce sont des ions.</p>
  </div>`,
  mount(root) {
    const mats = [
      { n: "Cuivre", rho: 1.7e-8, free: 1, d: "Le meilleur conducteur courant (après l'argent). Presque tous les câbles électriques sont en cuivre." },
      { n: "Aluminium", rho: 2.7e-8, free: 0.8, d: "Moins bon que le cuivre mais trois fois plus léger : on l'utilise pour les lignes à haute tension." },
      { n: "Eau salée", rho: 0.2, free: 0.3, d: "Ici ce ne sont pas des électrons mais des ions Na⁺ et Cl⁻ qui se déplacent. C'est pour ça que l'eau du robinet (qui contient des sels) est dangereuse avec l'électricité." },
      { n: "Silicium", rho: 2.3e3, free: 0.05, d: "Semi-conducteur : très peu de porteurs libres à température ambiante, mais on peut en ajouter (dopage). C'est le matériau des puces et des panneaux solaires." },
      { n: "Verre", rho: 1e11, free: 0, d: "Isolant : ses électrons sont solidement liés. On l'utilise pour les isolateurs des lignes électriques." },
      { n: "Caoutchouc", rho: 1e13, free: 0, d: "Excellent isolant, utilisé pour les gaines des câbles et les gants d'électricien." }
    ];
    let cur = 0, on = false;
    const btns = $("#mat-btns", root);
    mats.forEach((m, i) => {
      const b = h(`<button class="btn">${m.n}</button>`);
      b.onclick = () => { cur = i; setup(); };
      btns.appendChild(b);
    });
    const onBtn = $("#mat-on", root);
    onBtn.onclick = () => { on = !on; onBtn.textContent = on ? "Débrancher la pile" : "Brancher la pile"; };
    const kit = canvasKit($("#mat-cv", root), 0.38);
    let ions = [], els = [];
    function setup() {
      $$("button", btns).forEach((b, i) => b.classList.toggle("on", i === cur));
      const m = mats[cur];
      const { w, h: H } = kit;
      ions = []; els = [];
      const cols = Math.max(6, Math.floor((w - 80) / 44)), rows = 4;
      const gx = (w - 80) / cols, gy = (H - 30) / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
        ions.push({ x: 40 + gx * (c + 0.5), y: 15 + gy * (r + 0.5), ph: Math.random() * 7 });
      const nFree = Math.round(ions.length * m.free);
      for (let i = 0; i < nFree; i++) els.push({ x: rand(40, w - 40), y: rand(18, H - 18), vx: rand(-40, 40), vy: rand(-40, 40) });
      $("#mat-rho", root).textContent = sci(m.rho) + " Ω·m";
      const R = m.rho / 1e-6;
      $("#mat-r", root).textContent = R < 1e6 ? si(R, "Ω") : sci(R) + " Ω";
      const I = 1 / R;
      $("#mat-i", root).textContent = I > 1e-3 ? si(I, "A") : sci(I) + " A";
      $("#mat-desc", root).textContent = m.d;
    }
    kit.onResize = setup;
    setup();
    const stop = animate((dt, t) => {
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      // bornes
      ctx.fillStyle = alpha(T.cold, 0.25); ctx.fillRect(0, 0, 26, H);
      ctx.fillStyle = alpha(T.hot, 0.25); ctx.fillRect(w - 26, 0, 26, H);
      text(ctx, "−", 13, H / 2, T.ink, 18, "center"); text(ctx, "+", w - 13, H / 2, T.ink, 18, "center");
      const free = mats[cur].free;
      ions.forEach(io => {
        circle(ctx, io.x, io.y, 9, alpha(T.core, 0.18), T.core);
        text(ctx, "+", io.x, io.y + 0.5, T.core, 11, "center");
        if (free < 1) { // électron lié qui tourne autour de son atome
          const a = t * 3 + io.ph, j = on ? 2.5 : 0;
          circle(ctx, io.x + Math.cos(a) * (14 + j), io.y + Math.sin(a) * 12, 3, alpha(T.volt, 0.65));
        }
      });
      els.forEach(e => {
        e.vx += rand(-300, 300) * dt; e.vy += rand(-300, 300) * dt;
        e.vx *= 0.96; e.vy *= 0.96;
        if (on) e.vx += 260 * dt;
        e.x += e.vx * dt; e.y += e.vy * dt;
        if (e.y < 10 || e.y > H - 10) { e.vy *= -1; e.y = clamp(e.y, 10, H - 10); }
        if (on) { if (e.x > w - 30) e.x = 30; }
        else if (e.x < 30 || e.x > w - 30) { e.vx *= -1; e.x = clamp(e.x, 30, w - 30); }
        circle(ctx, e.x, e.y, 3.5, T.volt);
      });
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Pourquoi le cuivre conduit-il bien l'électricité ?", a: ["Il contient beaucoup de protons libres", "Ses électrons extérieurs sont libres de se déplacer", "Il est magnétique", "Il est très dense"], c: 1, why: "Dans les métaux, les électrons périphériques forment un « gaz » d'électrons libres." },
    { q: "Deux charges négatives placées côte à côte…", a: ["s'attirent", "se repoussent", "ne font rien", "s'annulent"], c: 1, why: "Charges de même signe : répulsion. Signes opposés : attraction." }
  ]
});

/* ===================================================================== */
lesson({
  id: "ohm", track: "elec",
  title: "Tension, courant, résistance",
  lead: "Trois grandeurs suffisent pour comprendre presque tout circuit. La tension pousse, le courant circule, la résistance freine.",
  body: `
  <div class="prose">
    <p>Imagine un circuit d'eau. La <strong>tension</strong> (en volts, V) est la différence de pression créée par la pompe. Le <strong>courant</strong> (en ampères, A) est le débit d'eau. La <strong>résistance</strong> (en ohms, Ω) est l'étroitesse du tuyau.</p>
    <ul>
      <li><strong>Tension U</strong> : l'« envie » qu'ont les électrons d'aller d'une borne à l'autre. Pile AA : 1,5 V. Prise : 230 V.</li>
      <li><strong>Courant I</strong> : la quantité de charges qui passe chaque seconde. 1 A = 1 coulomb par seconde.</li>
      <li><strong>Résistance R</strong> : l'opposition du matériau au passage du courant. Elle transforme l'énergie électrique en chaleur (effet Joule).</li>
    </ul>
    <p>Ces trois grandeurs sont reliées par la <strong>loi d'Ohm</strong> :</p>
    <p class="formula">U = R × I   ⇔   I = U / R</p>
    <p>Et la <strong>puissance</strong> consommée par la résistance vaut :</p>
    <p class="formula">P = U × I = R × I² = U² / R   (en watts)</p>
  </div>
  ${lab("Labo", "Le circuit le plus simple du monde", `
    <canvas id="ohm-cv" aria-label="Circuit avec pile et ampoule"></canvas>
    <div class="controls">${slider("ohm-u", "Tension de la pile U", 0, 24, 0.5, 6)}${slider("ohm-r", "Résistance de l'ampoule R", 1, 100, 1, 12)}</div>
    <div class="row"><button class="btn" id="ohm-dir">Afficher le sens conventionnel</button></div>
    <div class="readouts">${readout("ohm-i", "Courant I = U/R")}${readout("ohm-p", "Puissance P = U×I")}${readout("ohm-v", "Vitesse réelle des électrons*")}</div>
    <p class="hint">* Vitesse de dérive dans un fil de cuivre de 1 mm². Les électrons avancent à peine de quelques millimètres par minute, mais le « signal » se propage presque à la vitesse de la lumière : tous les électrons du fil se mettent en marche en même temps, comme l'eau d'un tuyau déjà plein.</p>`)}
  <div class="prose">
    <p class="note"><b>Sens du courant.</b> Par convention historique (avant la découverte de l'électron), le courant va du + vers le −. Les électrons, eux, vont du − vers le +. Les deux descriptions donnent les mêmes résultats.</p>
  </div>`,
  mount(root) {
    const kit = canvasKit($("#ohm-cv", root), 0.42);
    let U = 6, R = 12, conv = false, phase = 0;
    const upd = () => {
      const I = U / R, P = U * I;
      $("#ohm-i", root).textContent = si(I, "A");
      $("#ohm-p", root).textContent = si(P, "W");
      const v = I / (8.5e28 * 1.602e-19 * 1e-6); // m/s
      $("#ohm-v", root).textContent = I === 0 ? "0" : fmt(v * 1000 * 60, 1) + " mm/min";
    };
    bindRange(root, "ohm-u", v => fmt(v, 1) + " V", v => { U = v; upd(); });
    bindRange(root, "ohm-r", v => v + " Ω", v => { R = v; upd(); });
    const dirBtn = $("#ohm-dir", root);
    dirBtn.onclick = () => { conv = !conv; dirBtn.classList.toggle("on", conv); dirBtn.textContent = conv ? "Afficher les électrons" : "Afficher le sens conventionnel"; };
    const stop = animate(dt => {
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const L = 50, Rr = w - 50, Tp = 40, B = H - 36;
      const per = 2 * (Rr - L) + 2 * (B - Tp);
      const I = U / R, P = U * I;
      // fils
      ctx.lineWidth = 6; ctx.strokeStyle = alpha(T.muted, 0.35); ctx.lineJoin = "round";
      ctx.strokeRect(L, Tp, Rr - L, B - Tp);
      // pile (côté gauche)
      const my = (Tp + B) / 2;
      ctx.fillStyle = T.surface2; ctx.fillRect(L - 20, my - 26, 40, 52);
      ctx.lineWidth = 4; ctx.strokeStyle = T.ink;
      ctx.beginPath(); ctx.moveTo(L - 20, my - 8); ctx.lineTo(L + 20, my - 8); ctx.stroke();
      ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(L - 10, my + 8); ctx.lineTo(L + 10, my + 8); ctx.stroke();
      text(ctx, "+", L + 30, my - 12, T.ink, 15); text(ctx, "−", L + 30, my + 12, T.ink, 15);
      text(ctx, fmt(U, 1) + " V", L + 44, my, T.muted, 12);
      // ampoule (en haut)
      const bx = (L + Rr) / 2, b = clamp(Math.log10(P + 1) / Math.log10(100), 0, 1.2);
      if (b > 0.01) {
        const g = ctx.createRadialGradient(bx, Tp, 4, bx, Tp, 20 + 70 * b);
        g.addColorStop(0, alpha(T.glow, Math.min(1, 0.9 * b)));
        g.addColorStop(1, alpha(T.glow, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, Tp, 20 + 70 * b, 0, 7); ctx.fill();
      }
      circle(ctx, bx, Tp, 17, T.surface, T.ink);
      ctx.lineWidth = 2; ctx.strokeStyle = b > 0.05 ? T.volt : T.muted;
      ctx.beginPath(); ctx.moveTo(bx - 8, Tp + 6); for (let i = 0; i < 5; i++) ctx.lineTo(bx - 8 + i * 4 + 2, Tp + (i % 2 ? 6 : -4)); ctx.lineTo(bx + 8, Tp + 6); ctx.stroke();
      text(ctx, R + " Ω", bx, Tp - 28, T.muted, 12, "center");
      if (P > 150) text(ctx, "Trop de puissance : le filament va griller !", bx, B + 22, T.danger, 12, "center", "sans");
      // charges en mouvement
      const speed = 38 * Math.log1p(I * 2);
      phase = (phase + (conv ? 1 : -1) * speed * dt + per) % per;
      const pos = s => {
        s = ((s % per) + per) % per;
        const tw = Rr - L, th = B - Tp;
        if (s < tw) return [L + s, Tp];
        if ((s -= tw) < th) return [Rr, Tp + s];
        if ((s -= th) < tw) return [Rr - s, B];
        s -= tw; return [L, B - s];
      };
      for (let s = 0; s < per; s += 26) {
        const [x, y] = pos(s + phase);
        if (x === L && Math.abs(y - my) < 30) continue;
        if (conv) {
          ctx.fillStyle = T.hot; ctx.beginPath();
          // petite flèche dans le sens de parcours
          const [x2, y2] = pos(s + phase + 1);
          const a = Math.atan2(y2 - y, x2 - x);
          ctx.moveTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6);
          ctx.lineTo(x + Math.cos(a + 2.5) * 5, y + Math.sin(a + 2.5) * 5);
          ctx.lineTo(x + Math.cos(a - 2.5) * 5, y + Math.sin(a - 2.5) * 5);
          ctx.fill();
        } else circle(ctx, x, y, 3.5, T.volt);
      }
      text(ctx, conv ? "courant conventionnel (+ → −)" : "électrons (− → +)", w - 52, B + 22, conv ? T.hot : T.volt, 11, "right");
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Une ampoule de 46 Ω est branchée sur 230 V. Quel courant la traverse ?", a: ["0,2 A", "5 A", "46 A", "10 580 A"], c: 1, why: "I = U / R = 230 / 46 = 5 A." },
    { q: "Si on double la tension aux bornes d'une résistance, la puissance…", a: ["double", "reste la même", "est multipliée par 4", "est divisée par 2"], c: 2, why: "P = U²/R : doubler U multiplie P par 2² = 4." }
  ]
});

/* ===================================================================== */
lesson({
  id: "circuits", track: "elec",
  title: "Circuits série et parallèle",
  lead: "La façon dont on branche les appareils change tout. Une guirlande en série s'éteint en entier quand une ampoule grille ; ta maison, câblée en parallèle, non.",
  body: `
  <div class="prose">
    <p>En <strong>série</strong>, les composants sont à la queue leu leu : le même courant les traverse tous, et la tension de la source se partage entre eux. Les résistances s'additionnent :</p>
    <p class="formula">R_série = R₁ + R₂ + R₃</p>
    <p>En <strong>parallèle</strong>, chaque composant a son propre chemin : tous reçoivent la même tension, et les courants s'additionnent. La résistance équivalente diminue :</p>
    <p class="formula">1 / R_parallèle = 1/R₁ + 1/R₂ + 1/R₃</p>
    <p>Deux lois, dites de <strong>Kirchhoff</strong>, résument tout : le courant qui entre dans un nœud égale celui qui en sort (rien ne se perd), et la somme des tensions autour d'une boucle est nulle.</p>
  </div>
  ${lab("Labo", "Dévisse une ampoule", `
    <div class="row"><button class="btn on" id="sp-s">En série</button><button class="btn" id="sp-p">En parallèle</button><span class="hint">Clique sur une ampoule pour la dévisser ou la revisser. Pile de 12 V, ampoules de 12 Ω.</span></div>
    <div id="sp-svg"></div>
    <div class="readouts">${readout("sp-req", "Résistance équivalente")}${readout("sp-i", "Courant fourni par la pile")}${readout("sp-pb", "Puissance par ampoule")}${readout("sp-pt", "Puissance totale")}</div>
    <p class="status" id="sp-msg"></p>`)}
  <div class="prose">
    <p class="note"><b>Chez toi.</b> Toutes les prises et lampes sont en parallèle : chacune reçoit 230 V et fonctionne indépendamment. Mais chaque appareil branché ajoute du courant dans le câble commun : c'est pour ça qu'une multiprise surchargée chauffe, et qu'un disjoncteur coupe au-delà de 16 A ou 20 A.</p>
  </div>`,
  mount(root) {
    let mode = "s", onb = [true, true, true];
    const U = 12, R = 12;
    const box = $("#sp-svg", root);
    $("#sp-s", root).onclick = () => { mode = "s"; draw(); };
    $("#sp-p", root).onclick = () => { mode = "p"; draw(); };
    function bulb(x, y, i, P) {
      const b = clamp(P / 12, 0, 1), here = onb[i];
      return `<g class="bulb" data-i="${i}" style="cursor:pointer" role="button" tabindex="0" aria-label="Ampoule ${i + 1}">
        <circle cx="${x}" cy="${y}" r="${12 + 30 * b}" fill="var(--glow)" opacity="${here ? 0.15 + 0.6 * b : 0}"/>
        <circle cx="${x}" cy="${y}" r="17" fill="var(--surface)" stroke="var(--ink)" stroke-width="2" ${here ? "" : 'stroke-dasharray="4 4" opacity="0.5"'}/>
        ${here ? `<path d="M${x - 9} ${y + 5} l3 -9 l3 9 l3 -9 l3 9 l3 -9" fill="none" stroke="${b > 0.02 ? "var(--volt)" : "var(--muted)"}" stroke-width="2"/>` : `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono, monospace">vide</text>`}
        <text x="${x}" y="${y + 36}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono, monospace">L${i + 1}</text></g>`;
    }
    function draw() {
      $("#sp-s", root).classList.toggle("on", mode === "s");
      $("#sp-p", root).classList.toggle("on", mode === "p");
      const n = onb.filter(Boolean).length;
      let I, Pb = [0, 0, 0], Req, msg, cls;
      if (mode === "s") {
        const closed = n === 3;
        Req = closed ? 3 * R : Infinity;
        I = closed ? U / Req : 0;
        Pb = onb.map(o => (o && closed ? R * I * I : 0));
        msg = closed ? "Les 3 ampoules se partagent 12 V : 4 V chacune. Elles brillent 9 fois moins qu'une ampoule seule sur 12 V." : "Circuit ouvert : une seule ampoule manquante coupe le courant pour toutes les autres.";
        cls = closed ? "status warn" : "status danger";
      } else {
        Req = n ? R / n : Infinity;
        I = n * U / R;
        Pb = onb.map(o => (o ? U * U / R : 0));
        msg = n === 3 ? "Chaque ampoule reçoit les 12 V de la pile et brille à pleine puissance. La pile fournit 3 fois plus de courant." : "Les autres ampoules continuent de briller normalement : chaque branche est indépendante.";
        cls = "status ok";
      }
      const dur = I > 0 ? clamp(1.2 / I, 0.25, 6) : 0;
      const flow = I > 0 ? `class="flow" style="animation-duration:${dur}s"` : "";
      let svg;
      if (mode === "s") {
        svg = `<svg viewBox="0 0 560 280" role="img" aria-label="Circuit en série">
          <path d="M60 128 V60 H500 V230 H60 V152" fill="none" stroke="var(--line)" stroke-width="6" stroke-linejoin="round"/>
          <path d="M60 128 V60 H500 V230 H60 V152" fill="none" stroke="var(--volt)" stroke-width="3" stroke-dasharray="3 11" ${flow} opacity="${I > 0 ? 1 : 0}"/>
          ${battery()}
          ${bulb(180, 60, 0, Pb[0])}${bulb(290, 60, 1, Pb[1])}${bulb(400, 60, 2, Pb[2])}</svg>`;
      } else {
        const br = [200, 320, 440];
        svg = `<svg viewBox="0 0 560 300" role="img" aria-label="Circuit en parallèle">
          <path d="M60 138 V50 H440 M60 162 V250 H440 ${br.map(x => `M${x} 50 V250`).join(" ")}" fill="none" stroke="var(--line)" stroke-width="6" stroke-linejoin="round"/>
          <path d="M60 138 V50 H${br[onb.lastIndexOf(true)] || 60} M60 162 V250 H${br[onb.lastIndexOf(true)] || 60}" fill="none" stroke="var(--volt)" stroke-width="3" stroke-dasharray="3 11" ${flow} opacity="${I > 0 ? 1 : 0}"/>
          ${br.map((x, i) => onb[i] ? `<path d="M${x} 50 V250" fill="none" stroke="var(--volt)" stroke-width="3" stroke-dasharray="3 11" class="flow" style="animation-duration:${clamp(1.2, 0.25, 6)}s"/>` : "").join("")}
          ${battery(150)}
          ${br.map((x, i) => bulb(x, 150, i, Pb[i])).join("")}</svg>`;
      }
      box.innerHTML = svg;
      $$(".bulb", box).forEach(g => {
        const tog = () => { const i = +g.dataset.i; onb[i] = !onb[i]; draw(); };
        g.addEventListener("click", tog);
        g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tog(); } });
      });
      $("#sp-req", root).textContent = isFinite(Req) ? fmt(Req, 1) + " Ω" : "∞ (ouvert)";
      $("#sp-i", root).textContent = si(I, "A");
      const firstOn = Pb.find(p => p > 0) || 0;
      $("#sp-pb", root).textContent = si(firstOn, "W");
      $("#sp-pt", root).textContent = si(Pb.reduce((a, b) => a + b, 0), "W");
      const m = $("#sp-msg", root); m.className = cls; m.textContent = msg;
    }
    function battery(y = 140) {
      return `<rect x="34" y="${y - 22}" width="52" height="44" fill="var(--surface)"/>
        <line x1="38" y1="${y - 7}" x2="82" y2="${y - 7}" stroke="var(--ink)" stroke-width="4"/>
        <line x1="49" y1="${y + 7}" x2="71" y2="${y + 7}" stroke="var(--ink)" stroke-width="8"/>
        <text x="92" y="${y - 3}" font-size="12" fill="var(--muted)" font-family="IBM Plex Mono, monospace">12 V</text>`;
    }
    draw();
  },
  quiz: [
    { q: "Dans une maison, les prises sont branchées…", a: ["en série", "en parallèle", "au hasard", "en série par pièce"], c: 1, why: "En parallèle, chaque appareil reçoit 230 V et fonctionne indépendamment." },
    { q: "Deux résistances de 10 Ω en parallèle équivalent à…", a: ["20 Ω", "10 Ω", "5 Ω", "100 Ω"], c: 2, why: "1/R = 1/10 + 1/10 = 2/10, donc R = 5 Ω." }
  ]
});

/* ===================================================================== */
lesson({
  id: "energie", track: "elec",
  title: "Puissance et énergie",
  lead: "Les watts disent à quelle vitesse un appareil consomme. Les kilowattheures disent combien il a consommé au total. C'est ce second chiffre qui apparaît sur ta facture.",
  body: `
  <div class="prose">
    <p>La <strong>puissance</strong> (en watts) est un débit d'énergie : 1 W = 1 joule par seconde. L'<strong>énergie</strong> est ce débit multiplié par la durée :</p>
    <p class="formula">E (Wh) = P (W) × t (h)      1 kWh = 1 000 W pendant 1 h = 3,6 millions de joules</p>
    <p>Un radiateur de 2 000 W allumé 30 minutes consomme 1 kWh. Une ampoule LED de 8 W doit briller 125 heures pour consommer autant.</p>
    <p>Pour te donner un ordre de grandeur : 1 kWh, c'est l'énergie qu'il faut pour soulever une voiture d'une tonne à 367 mètres de haut. Et pourtant il ne coûte qu'environ 20 centimes.</p>
  </div>
  ${lab("Labo", "La consommation de ton foyer", `
    <p class="hint">Coche les appareils et règle leur durée d'utilisation par jour. Les puissances sont des valeurs typiques.</p>
    <div class="appliances" id="ap-list"></div>
    <div class="row"><label for="ap-price" class="hint">Prix du kWh (€)</label><input id="ap-price" type="number" step="0.01" min="0" value="0.20" style="width:90px;border:1px solid var(--line);border-radius:8px;padding:6px 8px;background:var(--surface)"></div>
    <div class="readouts">${readout("ap-day", "Par jour")}${readout("ap-year", "Par an")}${readout("ap-cost", "Coût annuel")}${readout("ap-top", "Plus gros poste")}</div>`)}
  <div class="prose">
    <p class="note"><b>Repère.</b> Un foyer français consomme en moyenne autour de 4 500 kWh par an, beaucoup plus s'il se chauffe à l'électricité. Le chauffage et l'eau chaude représentent souvent plus de la moitié de la facture.</p>
  </div>`,
  mount(root) {
    const apps = [
      { n: "Réfrigérateur", w: 40, h: 24, on: true, max: 24, note: "moyenne (le compresseur tourne par intermittence)" },
      { n: "Chauffe-eau", w: 2200, h: 3, on: true, max: 8 },
      { n: "Radiateur électrique", w: 1500, h: 6, on: false, max: 24 },
      { n: "Plaques à induction", w: 2000, h: 0.7, on: true, max: 4 },
      { n: "Four", w: 2400, h: 0.3, on: true, max: 4 },
      { n: "Lave-linge", w: 2000, h: 0.4, on: true, max: 4 },
      { n: "Télévision", w: 100, h: 3, on: true, max: 24 },
      { n: "Box internet", w: 12, h: 24, on: true, max: 24 },
      { n: "Ordinateur portable", w: 50, h: 4, on: true, max: 24 },
      { n: "10 ampoules LED", w: 80, h: 5, on: true, max: 24 },
      { n: "Voiture électrique (≈ 40 km/j)", w: 7400, h: 1, on: false, max: 8 }
    ];
    const list = $("#ap-list", root);
    apps.forEach((a, i) => {
      const row = h(`<div class="appliance">
        <input type="checkbox" id="ap-c${i}" ${a.on ? "checked" : ""} aria-label="${a.n}">
        <label class="name" for="ap-c${i}">${a.n} <small>${fmt(a.w, 0)} W</small></label>
        <input type="range" id="ap-h${i}" min="0" max="${a.max}" step="0.1" value="${a.h}" aria-label="Heures par jour pour ${a.n}">
        <span class="kwh" id="ap-k${i}"></span></div>`);
      list.appendChild(row);
    });
    function upd() {
      let tot = 0, top = null, topV = -1;
      apps.forEach((a, i) => {
        a.on = $("#ap-c" + i, root).checked; a.h = +$("#ap-h" + i, root).value;
        const kwh = a.on ? a.w * a.h / 1000 : 0;
        $("#ap-k" + i, root).textContent = fmt(a.h, 1) + " h · " + fmt(kwh * 365, 0) + " kWh/an";
        $("#ap-k" + i, root).style.opacity = a.on ? 1 : 0.4;
        tot += kwh; if (kwh > topV) { topV = kwh; top = a.n; }
      });
      const price = Math.max(0, +$("#ap-price", root).value || 0);
      $("#ap-day", root).textContent = fmt(tot, 1) + " kWh";
      $("#ap-year", root).textContent = fmt(tot * 365, 0) + " kWh";
      $("#ap-cost", root).textContent = fmt(tot * 365 * price, 0) + " €";
      $("#ap-top", root).textContent = topV > 0 ? top : "–";
    }
    root.addEventListener("input", e => { if (e.target.closest(".appliances") || e.target.id === "ap-price") upd(); });
    upd();
  },
  quiz: [
    { q: "Un four de 2 500 W fonctionne 2 heures. Il consomme…", a: ["1 250 kWh", "5 kWh", "2,5 kWh", "5 000 kWh"], c: 1, why: "2 500 W × 2 h = 5 000 Wh = 5 kWh." },
    { q: "Le kilowattheure (kWh) mesure…", a: ["une puissance", "une énergie", "une tension", "un courant"], c: 1, why: "Le kWh est une unité d'énergie (puissance × durée). Le kW, lui, est une puissance." }
  ]
});

/* ===================================================================== */
lesson({
  id: "induction", track: "elec",
  title: "Magnétisme et induction",
  lead: "Presque toute l'électricité du monde est produite de la même manière : en faisant tourner un aimant près d'une bobine de fil. C'est l'induction, découverte par Faraday en 1831.",
  body: `
  <div class="prose">
    <p>Électricité et magnétisme sont les deux faces d'un même phénomène, l'<strong>électromagnétisme</strong>. Un courant dans un fil crée un champ magnétique autour de lui (c'est le principe de l'électroaimant et du moteur). Et inversement :</p>
    <p><strong>Un champ magnétique qui varie à travers une bobine fait apparaître une tension à ses bornes.</strong> C'est la loi de Faraday :</p>
    <p class="formula">e = − N × dΦ/dt</p>
    <p>N est le nombre de spires de la bobine et dΦ/dt la vitesse à laquelle le flux magnétique change. Plus l'aimant tourne vite et plus il y a de spires, plus la tension est forte. Le signe « − » (loi de Lenz) dit que le courant induit s'oppose à la cause qui l'a créé : c'est pour ça qu'il faut fournir un effort pour faire tourner un alternateur qui alimente quelque chose.</p>
    <p>Un <strong>alternateur</strong> de centrale, c'est exactement ça : un rotor aimanté (un électroaimant de plusieurs centaines de tonnes) entraîné par une turbine, à l'intérieur de bobines fixes (le stator).</p>
  </div>
  ${lab("Labo", "Alternateur et oscilloscope", `
    <canvas id="ind-cv" aria-label="Aimant tournant dans une bobine et courbe de tension"></canvas>
    <div class="controls">${slider("ind-rpm", "Vitesse de rotation", 0, 3600, 60, 1500)}${slider("ind-n", "Nombre de spires", 10, 500, 10, 200)}</div>
    <div class="readouts">${readout("ind-f", "Fréquence produite")}${readout("ind-a", "Tension crête (relative)")}${readout("ind-slow", "Animation")}</div>`)}
  <div class="prose">
    <p class="note"><b>Pourquoi 50 Hz ?</b> En Europe, les alternateurs tournent de façon à produire 50 cycles par seconde : 3 000 tr/min pour un rotor à 2 pôles (turbines à vapeur des centrales thermiques), 1 500 tr/min pour un rotor à 4 pôles (la plupart des centrales nucléaires françaises). Aux États-Unis, c'est 60 Hz.</p>
  </div>`,
  mount(root) {
    const kit = canvasKit($("#ind-cv", root), 0.45);
    let rpm = 1500, N = 200, th = 0;
    const buf = [];
    bindRange(root, "ind-rpm", v => fmt(v, 0) + " tr/min", v => { rpm = v; $("#ind-f", root).textContent = fmt(v / 60, 1) + " Hz"; });
    bindRange(root, "ind-n", v => v + " spires", v => { N = v; });
    $("#ind-slow", root).textContent = "ralentie ×100";
    const stop = animate(dt => {
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const omegaVis = 2 * Math.PI * (rpm / 60) / 100;
      th += omegaVis * dt;
      const amp = (N / 500) * (rpm / 3600);
      const e = amp * Math.sin(th);
      $("#ind-a", root).textContent = fmt(amp * 100, 0) + " %";
      buf.push(e); if (buf.length > 400) buf.shift();
      // partie gauche : stator + rotor
      const cx = Math.min(w * 0.22, 150), cy = H / 2, r = Math.min(H * 0.32, cx * 0.62);
      // bobines du stator
      [-1, 1].forEach(s => {
        const x = cx + s * (r + 24);
        ctx.fillStyle = T.surface; ctx.strokeStyle = T.volt; ctx.lineWidth = 2;
        ctx.fillRect(x - 12, cy - r * 0.8, 24, r * 1.6);
        const turns = Math.round(4 + N / 40);
        for (let i = 0; i < turns; i++) {
          const y = cy - r * 0.8 + (i + 0.5) * (r * 1.6 / turns);
          ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y); ctx.stroke();
        }
      });
      circle(ctx, cx, cy, r + 4, null, T.line);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(th);
      ctx.fillStyle = T.hot; ctx.fillRect(-r, -r * 0.22, r, r * 0.44);
      ctx.fillStyle = T.cold; ctx.fillRect(0, -r * 0.22, r, r * 0.44);
      text(ctx, "S", -r * 0.55, 0, T.surface, 13, "center", "sans");
      text(ctx, "N", r * 0.55, 0, T.surface, 13, "center", "sans");
      ctx.restore();
      circle(ctx, cx, cy, 4, T.ink);
      // partie droite : oscilloscope
      const ox = cx * 2 + 30, ow = w - ox - 12, oh = H - 24, oy = 12;
      ctx.fillStyle = T.surface; ctx.fillRect(ox, oy, ow, oh);
      ctx.strokeStyle = T.line; ctx.lineWidth = 1;
      for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(ox + ow * i / 8, oy); ctx.lineTo(ox + ow * i / 8, oy + oh); ctx.stroke(); }
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(ox, oy + oh * i / 4); ctx.lineTo(ox + ow, oy + oh * i / 4); ctx.stroke(); }
      ctx.strokeStyle = T.volt; ctx.lineWidth = 2.5; ctx.beginPath();
      buf.forEach((v, i) => { const x = ox + ow * i / 400, y = oy + oh / 2 - v * oh * 0.45; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
      text(ctx, "tension induite e(t)", ox + 8, oy + 12, T.muted, 11);
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Que faut-il pour produire une tension dans une bobine ?", a: ["Un aimant immobile posé dessus", "Un champ magnétique qui varie", "Une bobine très chaude", "Du courant continu"], c: 1, why: "La loi de Faraday : seule la variation du flux magnétique induit une tension." },
    { q: "Un alternateur à 4 pôles produisant du 50 Hz tourne à…", a: ["50 tr/min", "1 500 tr/min", "3 000 tr/min", "6 000 tr/min"], c: 1, why: "Avec 2 paires de pôles, chaque tour produit 2 cycles : 25 tours/s = 1 500 tr/min." }
  ]
});

/* ===================================================================== */
lesson({
  id: "transfo", track: "elec",
  title: "Alternatif, continu et transformateurs",
  lead: "Ta prise délivre du courant alternatif, ta batterie de téléphone stocke du continu. Si le réseau est alternatif, c'est grâce à un appareil simple et génial : le transformateur.",
  body: `
  <div class="prose">
    <p>Le <strong>courant continu</strong> (DC) circule toujours dans le même sens : piles, batteries, panneaux solaires, électronique. Le <strong>courant alternatif</strong> (AC) change de sens 100 fois par seconde (50 allers-retours) : c'est ce que produisent les alternateurs.</p>
    <p>Les 230 V de ta prise sont une valeur <strong>efficace</strong> : la tension oscille en réalité entre −325 V et +325 V (230 × √2), mais chauffe autant qu'un continu de 230 V.</p>
    <h2>La guerre des courants</h2>
    <p>Dans les années 1880, Thomas Edison défendait le continu, George Westinghouse et Nikola Tesla l'alternatif. L'alternatif a gagné pour une raison : on peut facilement <strong>changer sa tension</strong> avec un transformateur, et transporter l'électricité à très haute tension sur des centaines de kilomètres avec peu de pertes. Toute cette histoire est racontée dans la <a href="#guerre">leçon suivante</a>.</p>
    <p>Un transformateur, ce sont deux bobines enroulées sur un même noyau de fer. Le courant alternatif dans la première crée un champ magnétique variable, qui induit une tension dans la seconde. Le rapport des tensions est celui des nombres de spires :</p>
    <p class="formula">U₂ / U₁ = N₂ / N₁      et (presque sans pertes)  U₁ × I₁ ≈ U₂ × I₂</p>
  </div>
  ${lab("Labo", "Construis ton transformateur", `
    <canvas id="tr-cv" aria-label="Transformateur avec deux bobines"></canvas>
    <div class="controls">${slider("tr-n1", "Spires au primaire N₁", 50, 2000, 10, 1000)}${slider("tr-n2", "Spires au secondaire N₂", 10, 4000, 10, 52)}</div>
    <div class="row"><button class="btn on" id="tr-ac">Alternatif 230 V</button><button class="btn" id="tr-dc">Continu 230 V</button><span class="hint">Charge branchée au secondaire : une lampe de 60 W.</span></div>
    <div class="readouts">${readout("tr-u2", "Tension de sortie U₂")}${readout("tr-k", "Rapport N₂/N₁")}${readout("tr-i1", "Courant primaire I₁")}${readout("tr-i2", "Courant secondaire I₂")}</div>
    <p class="status" id="tr-msg"></p>`)}
  <div class="prose">
    <p class="note"><b>Partout autour de toi.</b> Le chargeur de ton téléphone abaisse 230 V à 5 V (puis redresse en continu). Les transformateurs de poste élèvent la tension des centrales à 400 000 V, et ceux de ton quartier la ramènent à 230 V.</p>
  </div>`,
  mount(root) {
    const kit = canvasKit($("#tr-cv", root), 0.42);
    let N1 = 1000, N2 = 52, ac = true, t = 0;
    const upd = () => {
      const U2 = ac ? 230 * N2 / N1 : 0;
      $("#tr-u2", root).textContent = si(U2, "V");
      $("#tr-k", root).textContent = fmt(N2 / N1, 3);
      $("#tr-i1", root).textContent = ac ? si(60 / 230, "A") : "—";
      $("#tr-i2", root).textContent = ac && U2 > 0 ? si(60 / U2, "A") : "0 A";
      const m = $("#tr-msg", root);
      if (!ac) { m.className = "status danger"; m.textContent = "En continu, le champ magnétique ne varie pas : aucune tension n'est induite au secondaire. Et le primaire, sans rien pour limiter le courant, chauffe dangereusement."; }
      else if (N2 > N1) { m.className = "status warn"; m.textContent = "Transformateur élévateur : la tension monte, le courant baisse dans le même rapport. C'est ce qu'on fait à la sortie des centrales."; }
      else { m.className = "status ok"; m.textContent = "Transformateur abaisseur : la tension baisse, le courant augmente. C'est le rôle des postes de quartier et des chargeurs."; }
    };
    bindRange(root, "tr-n1", v => v + " spires", v => { N1 = v; upd(); });
    bindRange(root, "tr-n2", v => v + " spires", v => { N2 = v; upd(); });
    const setAC = v => { ac = v; $("#tr-ac", root).classList.toggle("on", v); $("#tr-dc", root).classList.toggle("on", !v); upd(); };
    $("#tr-ac", root).onclick = () => setAC(true);
    $("#tr-dc", root).onclick = () => setAC(false);
    const stop = animate(dt => {
      t += dt;
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const cx = w / 2, cw = Math.min(w * 0.36, 260), chh = H * 0.62, cy = H * 0.42, th = 26;
      // noyau
      ctx.fillStyle = alpha(T.muted, 0.35);
      ctx.fillRect(cx - cw / 2, cy - chh / 2, cw, th); ctx.fillRect(cx - cw / 2, cy + chh / 2 - th, cw, th);
      ctx.fillRect(cx - cw / 2, cy - chh / 2, th, chh); ctx.fillRect(cx + cw / 2 - th, cy - chh / 2, th, chh);
      // flux magnétique animé
      const flux = ac ? Math.sin(t * 4) : 1;
      ctx.strokeStyle = alpha(T.core, ac ? 0.25 + 0.6 * Math.abs(flux) : 0.6); ctx.lineWidth = 3; ctx.setLineDash([6, 8]);
      ctx.lineDashOffset = ac ? -t * 40 * Math.sign(flux) : 0;
      ctx.strokeRect(cx - cw / 2 + th / 2, cy - chh / 2 + th / 2, cw - th, chh - th);
      ctx.setLineDash([]);
      // bobines
      const coil = (x, n, color) => {
        const loops = clamp(Math.round(n / 60), 2, 26), top = cy - chh / 2 + th + 6, hh = chh - 2 * th - 12;
        ctx.strokeStyle = color; ctx.lineWidth = 2.5;
        for (let i = 0; i < loops; i++) {
          const y = top + (i + 0.5) * hh / loops;
          ctx.beginPath(); ctx.ellipse(x, y, th * 0.85, Math.max(1.5, hh / loops / 2.2), 0, 0, Math.PI * 2); ctx.stroke();
        }
      };
      coil(cx - cw / 2 + th / 2, N1, T.hot);
      coil(cx + cw / 2 - th / 2, N2, T.volt);
      text(ctx, "N₁ = " + N1, cx - cw / 2 - 12, cy - chh / 2 - 2, T.hot, 12, "right");
      text(ctx, "N₂ = " + N2, cx + cw / 2 + 12, cy - chh / 2 - 2, T.volt, 12, "left");
      // petites courbes de tension
      const wave = (x0, ww, ampl, color, label) => {
        const y0 = H - 26;
        ctx.strokeStyle = alpha(T.line, 1); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + ww, y0); ctx.stroke();
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const x = x0 + ww * i / 60, v = ac ? Math.sin(i / 60 * Math.PI * 4 - t * 4) : 1;
          const y = y0 - v * ampl;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        text(ctx, label, x0 + ww / 2, H - 6, T.muted, 11, "center");
      };
      const ww = Math.min(150, w * 0.28);
      const U2 = ac ? 230 * N2 / N1 : 0;
      const scale = 22 / Math.max(230, U2);
      wave(12, ww, 230 * scale, T.hot, "U₁ = 230 V");
      wave(w - ww - 12, ww, U2 * scale, T.volt, "U₂ = " + si(U2, "V"));
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Un transformateur a 2 000 spires au primaire et 100 au secondaire. On applique 230 V. On obtient…", a: ["4 600 V", "11,5 V", "115 V", "230 V"], c: 1, why: "U₂ = 230 × 100/2 000 = 11,5 V." },
    { q: "Pourquoi un transformateur ne fonctionne-t-il pas en courant continu ?", a: ["Le fer fond", "Le flux magnétique ne varie pas, donc rien n'est induit", "Le continu est trop faible", "Il fonctionne très bien en continu"], c: 1, why: "L'induction exige une variation du champ magnétique." }
  ]
});

/* ===================================================================== */
lesson({
  id: "guerre", track: "elec",
  title: "La guerre des courants : Edison contre Tesla",
  lead: "À la fin des années 1880, deux visions s'affrontent pour électrifier le monde : le courant continu de Thomas Edison et le courant alternatif de Nikola Tesla et George Westinghouse. Brevets, coups bas, chaise électrique et chutes du Niagara : voici l'histoire.",
  body: `
  <div class="prose">
    <p>En 1880, l'électricité est une curiosité. Dix ans plus tard, c'est une industrie qui vaut des fortunes. La question est simple : <strong>quel courant faut-il envoyer dans les rues ?</strong> Le choix fait à cette époque explique pourquoi ta prise délivre aujourd'hui du courant alternatif à 50 Hz.</p>
  </div>
  <div class="tracks" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
    <div class="track-card"><div class="eyebrow" style="color:var(--volt)">Courant continu</div><h2>Thomas Edison</h2><p class="hint mono">1847 – 1931 · États-Unis</p>
      <p>Inventeur et homme d'affaires redoutable, plus de 1 000 brevets. Il met au point en 1879 une ampoule à incandescence durable et, surtout, tout le système autour : centrales, câbles, compteurs, interrupteurs. Il croit au <strong>courant continu</strong>, qu'il maîtrise et qui fonctionne bien avec ses lampes et ses moteurs.</p></div>
    <div class="track-card"><div class="eyebrow" style="color:var(--core)">Courant alternatif</div><h2>Nikola Tesla</h2><p class="hint mono">1856 – 1943 · né à Smiljan (actuelle Croatie)</p>
      <p>Ingénieur visionnaire d'origine serbe. Il imagine le <strong>moteur à champ tournant</strong> (moteur à induction) et un système complet de courant <strong>alternatif polyphasé</strong> : générateurs, transformateurs, moteurs. C'est encore le principe de nos réseaux triphasés. L'unité de champ magnétique, le tesla, porte son nom.</p></div>
    <div class="track-card"><div class="eyebrow" style="color:var(--hot)">L'industriel</div><h2>George Westinghouse</h2><p class="hint mono">1846 – 1914 · États-Unis</p>
      <p>Riche inventeur du frein à air pour les trains. Il parie sur l'alternatif, rachète les brevets de Tesla et devient le <strong>vrai adversaire commercial</strong> d'Edison. Dans les faits, la « guerre » oppose surtout les entreprises Edison et Westinghouse.</p></div>
  </div>
  ${lab("Labo 1", "La frise de la guerre des courants", `
    <div class="steps" id="gw-steps"></div>
    <div class="info-panel" id="gw-info" aria-live="polite"></div>`)}
  <div class="prose">
    <h2>Le vrai problème du courant continu</h2>
    <p>Au XIXᵉ siècle, on ne sait pas changer facilement la tension d'un courant continu. Edison distribue donc directement <strong>110 V</strong>, la tension de ses lampes. Pour transporter beaucoup de puissance à si basse tension, il faut un courant énorme, et les pertes dans les câbles (R × I²) explosent avec la distance. Résultat : une centrale Edison ne peut desservir qu'un rayon d'environ <strong>1,5 km</strong>. Il faudrait une centrale dans chaque quartier.</p>
    <p>Avec l'alternatif, un <strong>transformateur</strong> élève la tension à des milliers de volts pour le transport, puis l'abaisse près des maisons. Le courant dans la ligne devient minuscule, les pertes aussi, et une seule grande centrale peut alimenter une ville entière à des dizaines de kilomètres.</p>
  </div>
  ${lab("Labo 2", "Edison contre Westinghouse : alimente la ville", `
    <div class="row"><button class="btn volt on" id="gw-dc">Edison · continu 110 V</button><button class="btn" id="gw-ac">Westinghouse-Tesla · alternatif 2 400 V</button></div>
    <canvas id="gw-cv" aria-label="Centrale reliée à une ville par une ligne électrique"></canvas>
    <div class="controls">${slider("gw-d", "Distance entre la centrale et la ville", 0.2, 30, 0.1, 1)}</div>
    <div class="readouts">${readout("gw-u", "Tension chez les clients")}${readout("gw-loss", "Pertes dans la ligne")}${readout("gw-eta", "Puissance livrée")}${readout("gw-cu", "Cuivre de la ligne")}</div>
    <p class="status" id="gw-msg"></p>
    <p class="hint">Une ville de 400 lampes de 50 W (20 kW). Edison utilise de gros câbles de cuivre de 500 mm², Westinghouse des câbles de 50 mm², dix fois plus fins. Les lampes sont prévues pour 110 V.</p>`)}
  <div class="prose">
    <h2>Mythes et réalité</h2>
    <ul>
      <li><strong>« Tesla a inventé le courant alternatif. »</strong> Pas seul. Le transformateur moderne doit beaucoup au Français <strong>Lucien Gaulard</strong> et à l'Anglais John Gibbs (1882–1884), puis aux ingénieurs hongrois de l'entreprise Ganz (1885). L'Italien Galileo Ferraris a eu l'idée du champ tournant presque en même temps que Tesla. L'apport de Tesla, c'est un système polyphasé complet et un moteur pratique.</li>
      <li><strong>« Edison a escroqué Tesla de 50 000 dollars. »</strong> L'anecdote vient des souvenirs de Tesla lui-même. Elle est plausible mais invérifiable.</li>
      <li><strong>« Edison a électrocuté l'éléphante Topsy. »</strong> Faux. En 1903, l'exécution de Topsy à Coney Island a été filmée par la société de production d'Edison, mais Edison n'y a pas participé, et la guerre des courants était terminée depuis dix ans.</li>
      <li><strong>« Edison était le méchant, Tesla le génie incompris. »</strong> C'est la version de la culture populaire. Edison a mené une campagne de peur honteuse, mais il a aussi inventé le premier réseau électrique de l'histoire. Tesla était génial mais piètre homme d'affaires : il est mort pauvre à New York en 1943.</li>
    </ul>
    <h2>Qui a gagné, finalement ?</h2>
    <p>L'alternatif a gagné le réseau : partout dans le monde, l'électricité est produite et distribuée en alternatif triphasé. Mais le continu prend sa revanche :</p>
    <ul>
      <li>tous tes appareils électroniques (téléphone, ordinateur, LED) fonctionnent en continu, grâce au petit bloc qui convertit le 230 V ;</li>
      <li>panneaux solaires et batteries produisent et stockent du continu ;</li>
      <li>pour les très longues distances et les câbles sous-marins, on construit aujourd'hui des lignes à <strong>courant continu haute tension</strong> (HVDC), devenues possibles grâce à l'électronique de puissance. La France est reliée à l'Angleterre et à l'Espagne par de telles liaisons.</li>
    </ul>
    <p class="note"><b>Fin officielle.</b> À New York, la compagnie Con Edison, héritière directe d'Edison, a coupé son dernier client en courant continu le 14 novembre 2007, 125 ans après l'ouverture de la centrale de Pearl Street.</p>
  </div>`,
  mount(root) {
    const ev = [
      ["1879", "L'ampoule d'Edison", "Edison met au point une ampoule à filament de carbone qui dure des centaines d'heures. Il ne vend pas seulement des ampoules : il veut vendre tout le système électrique qui va avec."],
      ["1882", "Pearl Street", "Le 4 septembre, Edison inaugure à New York la centrale de Pearl Street : la première centrale électrique commerciale au monde. Courant continu, 110 V, quelques centaines de clients dans un rayon d'environ 1,5 km. Pendant ce temps en Europe, Gaulard et Gibbs présentent leur « générateur secondaire », ancêtre du transformateur."],
      ["1884", "Tesla chez Edison", "Tesla débarque à New York avec presque rien en poche et une lettre de recommandation. Il est embauché dans l'entreprise d'Edison pour améliorer les dynamos à courant continu. Selon son propre récit, Edison lui aurait promis 50 000 dollars s'il réussissait, puis aurait répondu : « Vous ne comprenez pas l'humour américain. » Tesla démissionne en 1885."],
      ["1886", "Premier réseau alternatif", "Pendant que Tesla, ruiné, creuse des tranchées pour gagner sa vie, l'ingénieur William Stanley installe pour Westinghouse un réseau alternatif avec transformateurs à Great Barrington (Massachusetts). Westinghouse fonde sa compagnie électrique et commence à concurrencer Edison."],
      ["1888", "Les brevets de Tesla", "Tesla dépose ses brevets sur le moteur à induction et les systèmes polyphasés, et donne une conférence remarquée. Westinghouse les achète aussitôt. Le même année, Harold Brown, soutenu par le camp Edison, électrocute publiquement des animaux avec du courant alternatif pour prouver qu'il est mortel."],
      ["1890", "La chaise électrique", "Le 6 août, William Kemmler est le premier condamné exécuté sur une chaise électrique, à la prison d'Auburn (New York). Elle fonctionne au courant alternatif avec des générateurs Westinghouse obtenus en secret. L'exécution est atroce. Le camp Edison voulait que le public associe l'alternatif à la mort ; Edison proposait même d'appeler ça être « westinghousé »."],
      ["1892", "Edison écarté", "Les financiers, dont J. P. Morgan, fusionnent la société d'Edison avec son concurrent Thomson-Houston, qui fait déjà de l'alternatif. Naissance de General Electric. Edison perd le contrôle de l'entreprise qui porte son nom, et le nom disparaît même de la raison sociale."],
      ["1893", "L'exposition de Chicago", "Westinghouse remporte le contrat pour éclairer l'Exposition universelle de Chicago, en cassant les prix face à General Electric. Près de 100 000 lampes et un système polyphasé de Tesla en démonstration devant des millions de visiteurs : c'est la victoire de l'alternatif dans l'opinion."],
      ["1896", "Niagara", "La centrale hydraulique des chutes du Niagara, équipée de générateurs Westinghouse conçus sur les brevets de Tesla, envoie son courant alternatif jusqu'à Buffalo, à environ 40 km. Impossible en continu à l'époque. La guerre est gagnée."],
      ["1943", "Mort de Tesla", "Tesla meurt seul et pauvre dans une chambre d'hôtel à New York, le 7 janvier. On raconte qu'il avait renoncé dans les années 1890 aux redevances que Westinghouse lui devait, pour sauver l'entreprise en difficulté. Edison, lui, était mort en 1931, célébré comme un héros national."],
      ["2007", "Fin du continu à New York", "Con Edison coupe son dernier client en courant continu, un immeuble de Manhattan. Mais à la même époque, les liaisons à courant continu haute tension (HVDC) se multiplient dans le monde : le continu revient par la grande porte."]
    ];
    const bx = $("#gw-steps", root);
    ev.forEach((e, i) => { const b = h(`<button class="step"><i>${e[0]}</i>${e[1]}</button>`); b.onclick = () => sel(i); bx.appendChild(b); });
    function sel(i) {
      $$(".step", bx).forEach((b, j) => b.classList.toggle("on", i === j));
      $("#gw-info", root).innerHTML = `<div class="eyebrow">${ev[i][0]}</div><h4>${ev[i][1]}</h4><p>${ev[i][2]}</p><div class="row"><button class="btn" ${i ? "" : "disabled"} id="gw-prev">← Avant</button><button class="btn" ${i < ev.length - 1 ? "" : "disabled"} id="gw-next">Après →</button></div>`;
      $("#gw-prev", root).onclick = () => i && sel(i - 1);
      $("#gw-next", root).onclick = () => i < ev.length - 1 && sel(i + 1);
    }
    sel(0);

    /* Simulateur : même ville, deux systèmes */
    const kit = canvasKit($("#gw-cv", root), 0.36);
    let ac = false, d = 1, res = { bright: 1, lossFrac: 0 };
    const P = 20000;
    function calc() {
      const U = ac ? 2400 : 110, S = ac ? 50e-6 : 500e-6;
      const R = 1.7e-8 * 2 * d * 1000 / S;            // aller-retour
      const RL = U * U / P;                            // charge vue depuis la ligne
      const I = U / (R + RL), Pl = RL * I * I, loss = R * I * I;
      const Uc = I * RL * (ac ? 110 / 2400 : 1);       // tension chez le client (après transformateur)
      res = { bright: Pl / P, lossFrac: loss / (loss + Pl) };
      $("#gw-u", root).textContent = fmt(Uc, 0) + " V";
      $("#gw-loss", root).textContent = si(loss, "W") + " (" + fmt(res.lossFrac * 100, 0) + " %)";
      $("#gw-eta", root).textContent = si(Pl, "W") + " / 20 kW";
      $("#gw-cu", root).textContent = fmt(8960 * 2 * d * 1000 * S / 1000, 1) + " t";
      const m = $("#gw-msg", root);
      if (Pl / P > 0.9) { m.className = "status ok"; m.textContent = ac ? "Les lampes brillent normalement. L'alternatif transporte l'énergie loin avec des câbles fins." : "À cette distance, le continu d'Edison fonctionne bien : c'est un quartier autour de sa centrale."; }
      else if (Pl / P > 0.6) { m.className = "status warn"; m.textContent = "La tension chute en route : les lampes sont jaunâtres et faiblardes."; }
      else { m.className = "status danger"; m.textContent = ac ? "Même l'alternatif finit par perdre trop à cette distance : il faudrait une tension encore plus haute." : "La ville est plongée dans la pénombre : l'essentiel de l'énergie chauffe les câbles. Il faudrait construire une centrale ici."; }
    }
    const setMode = v => { ac = v; $("#gw-dc", root).classList.toggle("on", !v); $("#gw-ac", root).classList.toggle("on", v); calc(); };
    $("#gw-dc", root).onclick = () => setMode(false);
    $("#gw-ac", root).onclick = () => setMode(true);
    bindRange(root, "gw-d", v => fmt(v, 1) + " km", v => { d = v; calc(); });
    const stop = animate((dt, t) => {
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const ly = H * 0.5, x0 = 80, x1 = w - Math.min(220, w * 0.42);
      // centrale
      ctx.fillStyle = T.surface; ctx.strokeStyle = T.ink; ctx.lineWidth = 2;
      ctx.fillRect(14, ly - 26, 54, 52); ctx.strokeRect(14, ly - 26, 54, 52);
      ctx.fillRect(48, ly - 50, 12, 24); ctx.strokeRect(48, ly - 50, 12, 24);
      circle(ctx, 56, ly - 60 - (t * 12 % 14), 5, alpha(T.muted, 0.35));
      text(ctx, "centrale", 41, ly + 40, T.muted, 10, "center");
      // transformateurs
      const tr = x => { circle(ctx, x - 5, ly, 9, T.surface, T.core); circle(ctx, x + 5, ly, 9, null, T.core); };
      // ligne
      const heat = res.lossFrac;
      ctx.strokeStyle = alpha(T.hot, 0.15 + heat * 0.85); ctx.lineWidth = ac ? 3 : 9;
      ctx.beginPath(); ctx.moveTo(68, ly); ctx.lineTo(x1, ly); ctx.stroke();
      if (heat > 0.2) { ctx.strokeStyle = alpha(T.hot, heat * 0.25); ctx.lineWidth = (ac ? 3 : 9) + 10 * heat; ctx.stroke(); }
      // charges en mouvement
      const n = Math.floor((x1 - 68) / 22), sp = (ac ? 0 : 1) * 30 * res.bright;
      for (let i = 0; i < n; i++) {
        const x = 68 + ((i * 22 + (ac ? Math.sin(t * 8) * 6 : (t * sp) % 22)) + 22) % (x1 - 68);
        circle(ctx, 68 + (x - 68), ly, 2.4, T.volt);
      }
      if (ac) { tr(x0 + 6); tr(x1 - 14); text(ctx, "2 400 V", (x0 + x1) / 2, ly - 16, T.core, 11, "center"); text(ctx, "élévateur", x0 + 6, ly + 22, T.muted, 9, "center"); text(ctx, "abaisseur", x1 - 14, ly + 22, T.muted, 9, "center"); }
      else text(ctx, "110 V", (x0 + x1) / 2, ly - 16, T.volt, 11, "center");
      text(ctx, fmt(d, 1) + " km", (x0 + x1) / 2, ly + 22, T.muted, 11, "center");
      // ville : 40 maisons
      const cols = 8, rows = 5, cw = (w - x1 - 14) / cols, rh = (H - 20) / rows;
      for (let i = 0; i < 40; i++) {
        const cx = x1 + 6 + (i % cols) * cw + cw / 2, cy = 10 + Math.floor(i / cols) * rh + rh / 2;
        const b = clamp(res.bright, 0, 1), s = Math.min(cw, rh) * 0.34;
        if (b > 0.05) circle(ctx, cx, cy, s * (1.2 + 1.6 * b), alpha(T.glow, 0.35 * b * b));
        ctx.fillStyle = T.surface; ctx.strokeStyle = T.muted; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx - s, cy); ctx.lineTo(cx, cy - s); ctx.lineTo(cx + s, cy); ctx.lineTo(cx + s, cy + s); ctx.lineTo(cx - s, cy + s); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = b > 0.05 ? alpha(T.volt, 0.25 + 0.75 * b * b) : alpha(T.muted, 0.3);
        ctx.fillRect(cx - s * 0.35, cy + s * 0.1, s * 0.7, s * 0.6);
      }
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Pourquoi le courant alternatif l'a-t-il emporté pour les réseaux ?", a: ["Il est moins dangereux", "On peut changer sa tension avec un transformateur et le transporter loin avec peu de pertes", "Edison l'a choisi", "Il ne chauffe pas les câbles"], c: 1, why: "Le transformateur permet de transporter à haute tension (courant faible, pertes faibles), puis de redescendre à 110 ou 230 V chez les clients." },
    { q: "Quel industriel a racheté les brevets de Tesla ?", a: ["Thomas Edison", "J. P. Morgan", "George Westinghouse", "Henry Ford"], c: 2, why: "Westinghouse a acheté les brevets du moteur à induction et des systèmes polyphasés en 1888." }
  ]
});

/* ===================================================================== */
lesson({
  id: "reseau", track: "elec",
  title: "Le réseau électrique",
  lead: "Entre la centrale et ta prise, l'électricité parcourt des centaines de kilomètres en une fraction de seconde. Et à chaque instant, la production doit égaler exactement la consommation.",
  body: `
  <div class="prose">
    <p>Le réseau français a trois étages :</p>
    <ul>
      <li><strong>Transport</strong> (géré par RTE) : lignes à 400 000 V et 225 000 V, environ 100 000 km de lignes. Les grands pylônes que tu vois traverser les campagnes.</li>
      <li><strong>Répartition</strong> : 63 000 V et 90 000 V, pour alimenter les villes et les gros industriels.</li>
      <li><strong>Distribution</strong> (géré surtout par Enedis) : 20 000 V dans les quartiers, puis 230 V / 400 V après le transformateur de rue.</li>
    </ul>
    <h2>Pourquoi une tension aussi haute ?</h2>
    <p>Un câble a toujours une petite résistance. Le courant qui le traverse le chauffe et perd de l'énergie : <span class="mono">P_pertes = R × I²</span>. Pour transporter une puissance donnée <span class="mono">P = U × I</span>, plus la tension est élevée, plus le courant est faible… et les pertes chutent avec le carré du courant.</p>
  </div>
  ${lab("Labo 1", "Transporter 500 MW sur 100 km", `
    <div class="row" id="ls-btns"></div>
    <div class="readouts">${readout("ls-i", "Courant dans la ligne")}${readout("ls-p", "Pertes par effet Joule")}${readout("ls-pc", "Part perdue")}</div>
    <div class="bar" style="height:14px;color:var(--danger)"><i id="ls-bar" style="width:0"></i></div>
    <p class="status" id="ls-msg"></p>
    <p class="hint">Modèle simplifié : une ligne de résistance totale 5 Ω, en monophasé.</p>`)}
  <div class="prose">
    <h2>L'équilibre permanent : 50 Hz</h2>
    <p>L'électricité se stocke très mal à grande échelle. Chaque seconde, les centrales doivent produire exactement ce que le pays consomme. Le thermomètre de cet équilibre, c'est la <strong>fréquence</strong> : si on consomme plus qu'on ne produit, les alternateurs freinent et la fréquence baisse sous 50 Hz ; si on produit trop, elle monte. En dessous de 49 Hz, on coupe des quartiers entiers (délestage) pour éviter le black-out.</p>
  </div>
  ${lab("Labo 2", "Tiens le réseau à 50 Hz pendant 24 h", `
    <canvas id="gr-cv" aria-label="Courbe de consommation et fréquence du réseau"></canvas>
    <div class="controls">${slider("gr-nuc", "Nucléaire (lent à moduler)", 35, 61, 0.5, 38.5)}${slider("gr-hyd", "Hydraulique (très rapide)", 0, 18, 0.5, 3)}${slider("gr-gas", "Gaz (rapide)", 0, 12, 0.5, 1)}</div>
    <div class="row"><button class="btn primary" id="gr-go">Démarrer la journée</button><button class="btn" id="gr-reset">Recommencer</button></div>
    <div class="readouts">${readout("gr-h", "Heure")}${readout("gr-c", "Consommation")}${readout("gr-p", "Production totale")}${readout("gr-f", "Fréquence")}${readout("gr-s", "Temps dans la zone verte")}</div>
    <p class="status" id="gr-msg">Une journée d'hiver en France. Le solaire et l'éolien suivent la météo : à toi d'ajuster le reste.</p>`)}
  <div class="prose">
    <p class="note"><b>Dans la vraie vie.</b> Des automatismes ajustent la production en quelques secondes (réglage primaire), puis RTE rééquilibre en quelques minutes. Les échanges avec les pays voisins aident aussi : le réseau européen est synchronisé de Lisbonne à Varsovie.</p>
  </div>`,
  mount(root) {
    /* Pertes en ligne */
    const P = 500e6, R = 5;
    const volts = [[230, "230 V"], [20e3, "20 kV"], [90e3, "90 kV"], [225e3, "225 kV"], [400e3, "400 kV"]];
    const lb = $("#ls-btns", root);
    function sel(i) {
      $$("button", lb).forEach((b, j) => b.classList.toggle("on", j === i));
      const U = volts[i][0], I = P / U, L = R * I * I, pc = L / P * 100;
      $("#ls-i", root).textContent = si(I, "A");
      $("#ls-p", root).textContent = si(L, "W");
      $("#ls-pc", root).textContent = pc > 100 ? "> 100 %" : fmt(pc, 1) + " %";
      $("#ls-bar", root).style.width = Math.min(100, pc) + "%";
      const m = $("#ls-msg", root);
      if (pc > 100) { m.className = "status danger"; m.textContent = "Impossible : les pertes dépasseraient la puissance transportée. Les câbles fondraient bien avant."; }
      else if (pc > 10) { m.className = "status warn"; m.textContent = "Beaucoup trop de pertes pour une longue distance."; }
      else { m.className = "status ok"; m.textContent = "Rentable : c'est pour ça que les grandes lignes sont à 225 kV ou 400 kV."; }
    }
    volts.forEach((v, i) => { const b = h(`<button class="btn">${v[1]}</button>`); b.onclick = () => sel(i); lb.appendChild(b); });
    sel(4);

    /* Jeu d'équilibrage */
    const kit = canvasKit($("#gr-cv", root), 0.42);
    const gauss = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
    const conso = hh => 50 + 11 * gauss(hh, 9, 2) + 17 * gauss(hh, 19.2, 1.9) + 5 * gauss(hh, 13, 2.5) - 7 * gauss(hh, 4, 2.4) - 7 * gauss(hh, 28, 2.4) - 7 * gauss(hh, -20, 2.4);
    const solar = hh => (hh > 8 && hh < 17 ? 8 * Math.sin(Math.PI * (hh - 8) / 9) : 0);
    let s, running;
    const get = {
      nuc: bindRange(root, "gr-nuc", v => fmt(v, 1) + " GW"),
      hyd: bindRange(root, "gr-hyd", v => fmt(v, 1) + " GW"),
      gas: bindRange(root, "gr-gas", v => fmt(v, 1) + " GW")
    };
    function reset() {
      s = { hh: 0, nuc: get.nuc(), hyd: get.hyd(), gas: get.gas(), wind: 6, f: 50, inBand: 0, total: 0, hist: [], over: false };
      running = false; $("#gr-go", root).textContent = "Démarrer la journée";
      $("#gr-msg", root).className = "status";
      $("#gr-msg", root).textContent = "Une journée d'hiver en France. Le solaire et l'éolien suivent la météo : à toi d'ajuster le reste.";
    }
    reset();
    $("#gr-go", root).onclick = () => {
      if (s.over) reset();
      running = !running; $("#gr-go", root).textContent = running ? "Pause" : "Reprendre";
    };
    $("#gr-reset", root).onclick = reset;
    const ramp = (cur, target, rate, dt) => cur + clamp(target - cur, -rate * dt, rate * dt);
    const stop = animate(dt => {
      if (running && !s.over) {
        s.hh += dt / 3; // 24 h en 72 s
        s.nuc = ramp(s.nuc, get.nuc(), 0.35, dt);
        s.hyd = ramp(s.hyd, get.hyd(), 6, dt);
        s.gas = ramp(s.gas, get.gas(), 1.5, dt);
        s.wind = clamp(s.wind + rand(-1, 1) * dt * 2.2, 2, 11);
        const C = conso(s.hh), Pt = s.nuc + s.hyd + s.gas + s.wind + solar(s.hh);
        s.f += ((50 + (Pt - C) * 0.04) - s.f) * Math.min(1, dt * 2);
        s.total += dt; if (Math.abs(s.f - 50) < 0.1) s.inBand += dt;
        s.hist.push([s.hh, Pt, s.f]);
        const m = $("#gr-msg", root);
        if (s.f < 49) { s.over = true; running = false; m.className = "status danger"; m.textContent = "Fréquence sous 49 Hz : délestage ! Des quartiers sont coupés pour sauver le réseau. Recommence."; $("#gr-go", root).textContent = "Rejouer"; }
        else if (s.f > 51) { s.over = true; running = false; m.className = "status danger"; m.textContent = "Fréquence au-dessus de 51 Hz : les protections déconnectent des centrales. Recommence."; $("#gr-go", root).textContent = "Rejouer"; }
        else if (s.hh >= 24) { s.over = true; running = false; const sc = Math.round(s.inBand / s.total * 100); m.className = sc > 70 ? "status ok" : "status warn"; m.textContent = `Journée terminée. Score : ${sc} % du temps dans la zone verte (49,9–50,1 Hz).`; $("#gr-go", root).textContent = "Rejouer"; }
        else if (Math.abs(s.f - 50) >= 0.2) { m.className = "status warn"; m.textContent = s.f < 50 ? "Il manque de la production ! La fréquence chute." : "Trop de production ! La fréquence monte."; }
        else { m.className = "status"; m.textContent = "Le réseau tient. Anticipe le pic de 19 h."; }
      }
      const hh = Math.min(s.hh, 24), C = conso(hh), Pt = s.nuc + s.hyd + s.gas + s.wind + solar(hh);
      $("#gr-h", root).textContent = String(Math.floor(hh)).padStart(2, "0") + " h " + String(Math.floor((hh % 1) * 60)).padStart(2, "0");
      $("#gr-c", root).textContent = fmt(C, 1) + " GW";
      $("#gr-p", root).textContent = fmt(Pt, 1) + " GW";
      $("#gr-f", root).textContent = fmt(s.f, 2) + " Hz";
      $("#gr-s", root).textContent = s.total ? Math.round(s.inBand / s.total * 100) + " %" : "–";
      // dessin
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const pl = 40, pr = 12, pt = 10, pb = 64, gh = H - pt - pb;
      const X = x => pl + (w - pl - pr) * x / 24, Y = v => pt + gh * (1 - (v - 30) / 50);
      ctx.strokeStyle = T.line; ctx.lineWidth = 1;
      [40, 50, 60, 70].forEach(v => { ctx.beginPath(); ctx.moveTo(pl, Y(v)); ctx.lineTo(w - pr, Y(v)); ctx.stroke(); text(ctx, v + "", pl - 6, Y(v), T.muted, 10, "right"); });
      [0, 6, 12, 18, 24].forEach(x => text(ctx, x + "h", X(x), pt + gh + 10, T.muted, 10, "center"));
      text(ctx, "GW", 4, pt + 4, T.muted, 10);
      // solaire en fond
      ctx.fillStyle = alpha(T.volt, 0.12); ctx.beginPath(); ctx.moveTo(X(8), Y(30));
      for (let x = 8; x <= 17; x += 0.25) ctx.lineTo(X(x), Y(30 + solar(x))); ctx.lineTo(X(17), Y(30)); ctx.fill();
      // consommation prévue
      ctx.setLineDash([5, 5]); ctx.strokeStyle = T.muted; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let x = 0; x <= 24; x += 0.2) { const y = Y(conso(x)); x ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); }
      ctx.stroke(); ctx.setLineDash([]);
      // production réalisée
      ctx.strokeStyle = T.core; ctx.lineWidth = 2.5; ctx.beginPath();
      s.hist.forEach((p, i) => { i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); });
      ctx.stroke();
      circle(ctx, X(hh), Y(Pt), 4, T.core);
      text(ctx, "consommation", X(0.3), Y(conso(0.3)) - 10, T.muted, 10);
      text(ctx, "ta production", X(0.3), Y(conso(0.3)) + 14, T.core, 10);
      // jauge de fréquence
      const gy = H - 26, gx0 = pl, gx1 = w - pr;
      const F = f => gx0 + (gx1 - gx0) * (f - 49) / 2;
      ctx.fillStyle = alpha(T.danger, 0.18); ctx.fillRect(gx0, gy - 7, gx1 - gx0, 14);
      ctx.fillStyle = alpha(T.warn, 0.25); ctx.fillRect(F(49.8), gy - 7, F(50.2) - F(49.8), 14);
      ctx.fillStyle = alpha(T.ok, 0.4); ctx.fillRect(F(49.9), gy - 7, F(50.1) - F(49.9), 14);
      [49, 49.5, 50, 50.5, 51].forEach(f => text(ctx, fmt(f, 1), F(f), gy + 17, T.muted, 10, "center"));
      ctx.fillStyle = T.ink; const nx = F(clamp(s.f, 49, 51));
      ctx.beginPath(); ctx.moveTo(nx, gy - 10); ctx.lineTo(nx - 6, gy - 20); ctx.lineTo(nx + 6, gy - 20); ctx.fill();
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Pourquoi transporte-t-on l'électricité à 400 000 V ?", a: ["Pour qu'elle aille plus vite", "Pour réduire le courant et donc les pertes par effet Joule", "Pour tuer les oiseaux", "Parce que les centrales ne savent pas faire moins"], c: 1, why: "À puissance égale, tension élevée = courant faible, et les pertes R×I² s'effondrent." },
    { q: "Que se passe-t-il si la consommation dépasse la production ?", a: ["La fréquence monte", "La fréquence baisse", "La tension double", "Rien"], c: 1, why: "Les alternateurs ralentissent sous l'effort : la fréquence descend sous 50 Hz." }
  ]
});

/* ===================================================================== */
lesson({
  id: "mix", track: "elec",
  title: "Produire l'électricité",
  lead: "Nucléaire, barrages, éoliennes, panneaux, charbon, gaz : chaque moyen de production a ses forces. Compose ton propre mix et regarde ce qu'il émet.",
  body: `
  <div class="prose">
    <p>À part le solaire photovoltaïque, presque toutes les centrales font tourner un alternateur. Ce qui change, c'est ce qui fait tourner la turbine :</p>
    <ul>
      <li><strong>Thermique</strong> (charbon, gaz, fioul, biomasse, nucléaire) : on chauffe de l'eau pour faire de la vapeur sous pression qui pousse une turbine.</li>
      <li><strong>Hydraulique</strong> : l'eau d'un barrage tombe et fait tourner une turbine.</li>
      <li><strong>Éolien</strong> : le vent fait tourner les pales, reliées à un alternateur.</li>
      <li><strong>Photovoltaïque</strong> : la lumière arrache directement des électrons dans du silicium (effet photoélectrique). Pas de pièce mobile, et le courant produit est continu.</li>
    </ul>
    <p>Deux critères comptent beaucoup : les <strong>émissions de CO₂</strong> sur tout le cycle de vie (construction comprise) et le caractère <strong>pilotable</strong> (peut-on produire quand on en a besoin ?).</p>
  </div>
  ${lab("Labo", "Compose ton mix électrique", `
    <div class="row" id="mx-pre"></div>
    <div id="mx-stack" style="display:flex;height:34px;border-radius:8px;overflow:hidden;border:1px solid var(--line)"></div>
    <div class="controls" id="mx-sl"></div>
    <div class="readouts">${readout("mx-co2", "Intensité carbone")}${readout("mx-low", "Part bas carbone")}${readout("mx-pil", "Part pilotable")}</div>
    <p class="hint">Émissions en cycle de vie, valeurs médianes du GIEC (gCO₂e/kWh). Mix réels arrondis, ordres de grandeur.</p>`)}
  <div class="prose">
    <p class="note"><b>Le cas français.</b> Environ deux tiers de l'électricité vient de 57 réacteurs nucléaires, complétés par l'hydraulique, l'éolien et le solaire. C'est l'une des électricités les moins carbonées des grands pays industrialisés.</p>
  </div>`,
  mount(root) {
    const src = [
      { k: "nuc", n: "Nucléaire", g: 12, pil: true, c: () => T.core },
      { k: "hyd", n: "Hydraulique", g: 24, pil: true, c: () => T.cold },
      { k: "eol", n: "Éolien", g: 11, pil: false, c: () => T.ok },
      { k: "sol", n: "Solaire", g: 41, pil: false, c: () => T.glow },
      { k: "bio", n: "Bioénergies", g: 230, pil: true, c: () => T.warn },
      { k: "gaz", n: "Gaz", g: 490, pil: true, c: () => T.hot },
      { k: "cha", n: "Charbon", g: 820, pil: true, c: () => T.muted }
    ];
    const presets = {
      "France 2024": { nuc: 67, hyd: 14, eol: 9, sol: 5, bio: 2, gaz: 3, cha: 0 },
      "Allemagne 2024": { nuc: 0, hyd: 5, eol: 33, sol: 14, bio: 9, gaz: 15, cha: 22 },
      "Pologne 2024": { nuc: 0, hyd: 1, eol: 14, sol: 10, bio: 5, gaz: 11, cha: 57 },
      "Monde 2023": { nuc: 9, hyd: 14, eol: 8, sol: 6, bio: 3, gaz: 23, cha: 37 }
    };
    const sl = $("#mx-sl", root);
    src.forEach(s => sl.insertAdjacentHTML("beforeend", slider("mx-" + s.k, s.n, 0, 100, 1, 0)));
    const pre = $("#mx-pre", root);
    Object.keys(presets).forEach(name => {
      const b = h(`<button class="btn">${name}</button>`);
      b.onclick = () => { src.forEach(s => { $("#mx-" + s.k, root).value = presets[name][s.k]; }); $$("button", pre).forEach(x => x.classList.toggle("on", x === b)); upd(); };
      pre.appendChild(b);
    });
    function upd() {
      const v = src.map(s => +$("#mx-" + s.k, root).value);
      const tot = v.reduce((a, b) => a + b, 0) || 1;
      src.forEach((s, i) => { $("#mx-" + s.k + "-o", root).textContent = fmt(v[i] / tot * 100, 0) + " %"; });
      $("#mx-stack", root).innerHTML = src.map((s, i) => v[i] ? `<div title="${s.n}" style="width:${v[i] / tot * 100}%;background:${s.c()}"></div>` : "").join("");
      const g = src.reduce((a, s, i) => a + s.g * v[i], 0) / tot;
      $("#mx-co2", root).textContent = fmt(g, 0) + " g/kWh";
      $("#mx-low", root).textContent = fmt(src.reduce((a, s, i) => a + (s.g < 50 ? v[i] : 0), 0) / tot * 100, 0) + " %";
      $("#mx-pil", root).textContent = fmt(src.reduce((a, s, i) => a + (s.pil ? v[i] : 0), 0) / tot * 100, 0) + " %";
    }
    sl.addEventListener("input", () => { $$("button", pre).forEach(x => x.classList.remove("on")); upd(); });
    pre.firstElementChild.click();
  },
  quiz: [
    { q: "Parmi ces sources, laquelle émet le plus de CO₂ par kWh ?", a: ["Nucléaire", "Éolien", "Charbon", "Hydraulique"], c: 2, why: "Le charbon émet environ 820 g/kWh, contre une dizaine pour le nucléaire et l'éolien." },
    { q: "Qu'est-ce qu'une source « pilotable » ?", a: ["Une source qu'on peut démarrer et moduler selon les besoins", "Une source télécommandée par un pilote", "Une source renouvelable", "Une source sans CO₂"], c: 0, why: "Pilotable = on décide quand elle produit, contrairement au vent ou au soleil." }
  ]
});

/* ===================================================================== */
lesson({
  id: "securite", track: "elec",
  title: "Sécurité électrique",
  lead: "Ce n'est pas la tension qui tue, c'est le courant qui traverse le corps. Mais c'est la tension qui le pousse.",
  body: `
  <div class="prose">
    <p>Le corps humain conduit l'électricité, surtout quand il est mouillé. Sa résistance varie énormément : plusieurs milliers d'ohms avec la peau sèche, quelques centaines d'ohms avec la peau mouillée ou dans un bain. Le courant qui le traverse vaut <span class="mono">I = U / R_corps</span>.</p>
    <p>Les effets dépendent de l'intensité et de la durée :</p>
    <div class="table-wrap"><table>
      <thead><tr><th class="num">Courant (50 Hz)</th><th>Effet typique</th></tr></thead>
      <tbody>
        <tr><td class="num mono">0,5 mA</td><td>Seuil de perception (picotement)</td></tr>
        <tr><td class="num mono">10 mA</td><td>Contraction musculaire : on ne peut plus lâcher</td></tr>
        <tr><td class="num mono">30 mA</td><td>Risque de paralysie respiratoire</td></tr>
        <tr><td class="num mono">75 mA et plus</td><td>Fibrillation cardiaque possible : danger de mort</td></tr>
      </tbody></table></div>
    <p>Le <strong>disjoncteur différentiel 30 mA</strong>, obligatoire dans les tableaux électriques, compare le courant qui part et celui qui revient. Si une différence de 30 mA apparaît (le courant fuit, par exemple à travers toi), il coupe en quelques dizaines de millisecondes. La <strong>prise de terre</strong> évacue les fuites d'une carcasse métallique avant que quelqu'un ne la touche.</p>
  </div>
  ${lab("Labo", "Que se passe-t-il si on touche ?", `
    <div class="controls">
      <div class="ctl"><label for="sf-u" class="ctl-top">Tension touchée</label><select id="sf-u"><option value="12">12 V (batterie de voiture)</option><option value="48">48 V</option><option value="230" selected>230 V (prise)</option><option value="400">400 V (triphasé)</option></select></div>
      <div class="ctl"><label for="sf-r" class="ctl-top">État de la peau</label><select id="sf-r"><option value="5000">Sèche (≈ 5 000 Ω)</option><option value="1500" selected>Humide (≈ 1 500 Ω)</option><option value="600">Mouillée, pieds dans l'eau (≈ 600 Ω)</option></select></div>
      <div class="ctl"><span class="ctl-top">Protection</span><label class="row" style="gap:6px"><input type="checkbox" id="sf-d" checked> Disjoncteur différentiel 30 mA</label></div>
    </div>
    <div id="sf-gauge" style="position:relative;height:40px;border-radius:8px;overflow:hidden;display:flex"></div>
    <div class="readouts">${readout("sf-i", "Courant dans le corps")}${readout("sf-e", "Effet")}</div>
    <p class="status" id="sf-msg"></p>`)}
  <div class="prose">
    <p class="note"><b>Réflexes.</b> Couper le courant au tableau avant toute intervention. Ne jamais toucher une personne électrisée tant que le courant n'est pas coupé. Pas d'appareil branché près d'une baignoire. Une ligne haute tension peut tuer à distance par arc électrique : on ne s'en approche jamais, même avec un cerf-volant ou une canne à pêche.</p>
  </div>`,
  mount(root) {
    const zones = [[0.1, 0.5, "ok", "Imperceptible"], [0.5, 10, "ok", "Picotement, désagréable"], [10, 30, "warn", "Impossible de lâcher, douleur"], [30, 75, "danger", "Paralysie respiratoire possible"], [75, 1000, "danger", "Fibrillation cardiaque : danger de mort"]];
    const lg = v => Math.log10(v);
    const pos = mA => clamp((lg(mA) - lg(0.1)) / (lg(1000) - lg(0.1)), 0, 1) * 100;
    const g = $("#sf-gauge", root);
    g.innerHTML = zones.map(z => `<div style="width:${pos(z[1]) - pos(z[0])}%;background:color-mix(in srgb, var(--${z[2]}) ${z[2] === "ok" && z[0] < 0.5 ? 18 : 35}%, var(--surface))"></div>`).join("") +
      `<div id="sf-needle" style="position:absolute;top:0;bottom:0;width:3px;background:var(--ink);transition:left .3s"></div>` +
      [0.5, 10, 30, 75].map(v => `<span class="mono" style="position:absolute;bottom:2px;left:calc(${pos(v)}% + 3px);font-size:10px;color:var(--muted)">${fmt(v, 1)} mA</span>`).join("");
    function upd() {
      const U = +$("#sf-u", root).value, R = +$("#sf-r", root).value, diff = $("#sf-d", root).checked;
      const mA = U / R * 1000;
      const z = zones.find(z => mA < z[1]) || zones[zones.length - 1];
      $("#sf-needle", root).style.left = pos(mA) + "%";
      $("#sf-i", root).textContent = fmt(mA, 1) + " mA";
      $("#sf-e", root).textContent = z[3];
      const m = $("#sf-msg", root);
      if (U <= 48 && mA < 30) { m.className = "status ok"; m.textContent = "Très basse tension : le courant reste faible. C'est pourquoi les jouets et l'électronique fonctionnent sous moins de 50 V."; }
      else if (mA >= 30 && diff) { m.className = "status warn"; m.textContent = "Le différentiel détecte la fuite et coupe en moins de 40 ms. Le choc est violent mais la durée trop courte pour arrêter le cœur dans la plupart des cas."; }
      else if (mA >= 30) { m.className = "status danger"; m.textContent = "Sans différentiel, rien ne coupe : le courant traverse le corps tant que le contact dure. Situation potentiellement mortelle."; }
      else { m.className = "status warn"; m.textContent = "Sous le seuil de 30 mA, le différentiel ne déclenche pas. Le choc reste dangereux (chute, brûlure)."; }
    }
    root.addEventListener("change", e => { if (e.target.id.startsWith("sf-")) upd(); });
    upd();
  },
  quiz: [
    { q: "À partir de quel courant de fuite un différentiel domestique coupe-t-il ?", a: ["3 mA", "30 mA", "300 mA", "16 A"], c: 1, why: "30 mA : c'est le seuil choisi pour protéger les personnes." },
    { q: "Pourquoi est-il plus dangereux de toucher une prise avec les mains mouillées ?", a: ["L'eau augmente la tension", "La résistance du corps baisse, donc le courant augmente", "L'eau attire les électrons", "Ce n'est pas plus dangereux"], c: 1, why: "I = U/R : avec une résistance plus faible, le courant qui traverse le corps est plus fort." }
  ]
});
