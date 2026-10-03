/* Parcours CENTRALES NUCLÉAIRES — fonctionnement, pilotage, vie et parc français. */
"use strict";

/* ===================================================================== */
lesson({
  id: "centrale", track: "cen",
  title: "Comment marche une centrale nucléaire",
  lead: "Une centrale nucléaire transforme l'énergie cachée dans les noyaux d'uranium en électricité. Entre les deux, l'énergie change six fois de forme. Suivons-la pas à pas.",
  body: `
  <div class="prose">
    <p>Une centrale nucléaire est une <strong>centrale thermique</strong>, comme une centrale à charbon ou à gaz. Seule la source de chaleur change : au lieu de brûler un combustible, on fait fissionner des noyaux d'uranium. Ensuite, le principe est celui d'une machine à vapeur : de l'eau chauffée devient vapeur sous pression, la vapeur fait tourner une turbine, la turbine entraîne un alternateur.</p>
    <p>Un site nucléaire regroupe en général 2 à 6 <strong>réacteurs</strong> (on dit aussi « tranches »). Chaque tranche possède son bâtiment réacteur (le grand cylindre de béton au dôme arrondi), sa salle des machines (turbine et alternateur), sa salle de commande et son système de refroidissement.</p>
  </div>
  ${lab("Labo 1", "Le voyage de l'énergie, du noyau à ta prise", `
    <div id="ce-chain" style="overflow-x:auto"></div>
    <div class="info-panel" id="ce-info" aria-live="polite"></div>`)}
  <div class="prose">
    <h2>Où part l'énergie ?</h2>
    <p>Sur 100 unités de chaleur produites dans le cœur, environ 33 deviennent de l'électricité. Le reste est évacué dans la <strong>source froide</strong> : rivière, mer ou atmosphère via les tours de refroidissement. Ce n'est pas un gaspillage évitable : la thermodynamique impose qu'une machine thermique rejette de la chaleur, et le rendement maximal (de Carnot) dépend de l'écart entre la température de la vapeur et celle de la source froide.</p>
    <p class="formula">rendement max = 1 − T_froide / T_chaude   (températures en kelvins)</p>
  </div>
  ${lab("Labo 2", "Le bilan énergétique d'un réacteur de 1 300 MWe", `
    <canvas id="ce-cv" aria-label="Diagramme des flux d'énergie"></canvas>
    <div class="controls">${slider("ce-river", "Température de la rivière", 2, 30, 1, 14)}</div>
    <div class="readouts">${readout("ce-eta", "Rendement")}${readout("ce-pe", "Électricité nette")}${readout("ce-q", "Chaleur rejetée")}${readout("ce-y", "Production sur un an")}</div>
    <p class="status" id="ce-msg"></p>`)}
  <div class="prose">
    <p class="note"><b>Les ordres de grandeur.</b> Un réacteur de 1 300 MWe produit environ 9 TWh par an, la consommation de 2 millions de foyers. Pour cela, il consomme environ 25 tonnes d'uranium enrichi par an. Une centrale à charbon de même puissance brûlerait plus de 3 millions de tonnes de charbon.</p>
  </div>`,
  mount(root) {
    const steps = [
      ["Noyau", "Énergie nucléaire → mouvement", "Un neutron casse un noyau d'uranium-235. Les deux fragments partent à toute vitesse : 200 MeV d'énergie, dont l'essentiel sous forme de mouvement des fragments.", "≈ 3 × 10¹⁹ fissions par seconde dans un réacteur de 1 300 MWe"],
      ["Pastille", "Mouvement → chaleur", "Les fragments sont freinés en quelques micromètres dans la pastille d'oxyde d'uranium, qui s'échauffe. Le centre d'une pastille dépasse 1 000 °C. La gaine en zirconium qui l'entoure reste autour de 350 °C.", "pastille : 8 mm de diamètre, ≈ 7 g"],
      ["Eau primaire", "Chaleur → eau chaude sous pression", "L'eau du circuit primaire circule entre les crayons et emporte la chaleur. Pressurisée à 155 bars, elle reste liquide et sort du cœur vers 323 °C.", "≈ 20 000 m³/h par boucle"],
      ["Générateur de vapeur", "Eau chaude → vapeur", "L'eau primaire passe dans des milliers de tubes en U. À l'extérieur des tubes, l'eau du circuit secondaire bout et se transforme en vapeur. Les deux circuits ne se touchent jamais : la vapeur n'est pas radioactive.", "vapeur ≈ 70 bars, 285 °C"],
      ["Turbine", "Vapeur → rotation", "La vapeur se détend à travers des rangées d'ailettes et fait tourner un arbre de plusieurs dizaines de mètres de long à 1 500 tours par minute. Elle est ensuite recondensée en eau dans le condenseur, refroidi par la rivière ou la mer.", "1 500 tr/min · plusieurs centaines de tonnes"],
      ["Alternateur", "Rotation → électricité", "L'arbre de la turbine fait tourner le rotor de l'alternateur, un électroaimant géant. Par induction, il produit du courant alternatif triphasé à 50 Hz sous environ 20 000 V.", "≈ 1 300 MW électriques"],
      ["Transformateur", "20 kV → 400 kV", "Le transformateur principal élève la tension à 400 000 V pour que l'électricité voyage sur le réseau de RTE avec un minimum de pertes.", "400 kV"],
      ["Ta prise", "Réseau → maison", "Après plusieurs transformateurs abaisseurs (225 kV, 63 kV, 20 kV), l'électricité arrive chez toi à 230 V. Le trajet depuis la centrale prend quelques millisecondes.", "230 V · 50 Hz"]
    ];
    const W = 900, bw = 96, gap = (W - 20 - steps.length * bw) / (steps.length - 1);
    $("#ce-chain", root).innerHTML = `<svg viewBox="0 0 ${W} 110" style="min-width:640px" role="img" aria-label="Chaîne de conversion de l'énergie">
      ${steps.map((s, i) => { const x = 10 + i * (bw + gap); return `
        ${i ? `<path d="M${x - gap + 4} 45 H${x - 6}" stroke="var(--line)" stroke-width="3" marker-end="url(#ar)"/>` : ""}
        <g class="ce-n" data-i="${i}" style="cursor:pointer" role="button" tabindex="0">
          <rect x="${x}" y="18" width="${bw}" height="54" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>
          <text x="${x + bw / 2}" y="38" text-anchor="middle" font-size="11" font-family="IBM Plex Mono, monospace" fill="var(--muted)">${i + 1}</text>
          <text x="${x + bw / 2}" y="58" text-anchor="middle" font-size="${s[0].length > 12 ? 10.5 : 13}" font-weight="600" font-family="IBM Plex Sans, sans-serif" fill="var(--ink)">${s[0].length > 14 ? s[0].replace("de vapeur", "") : s[0]}</text>
        </g>`; }).join("")}
      <circle id="ce-dot" r="6" cy="90" cx="58" fill="var(--track)"/>
      <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--line)"/></marker></defs></svg>`;
    function sel(i) {
      $$(".ce-n", root).forEach((g, j) => {
        const r = g.querySelector("rect");
        r.setAttribute("stroke", j === i ? "var(--track)" : "var(--line)");
        r.setAttribute("fill", j === i ? "var(--track-soft)" : "var(--surface)");
      });
      $("#ce-dot", root).setAttribute("cx", 10 + i * (bw + gap) + bw / 2);
      const s = steps[i];
      $("#ce-info", root).innerHTML = `<div class="eyebrow">Étape ${i + 1} sur ${steps.length} · ${s[1]}</div><h4>${s[0]}</h4><p>${s[2]}</p><div class="facts">${s[3]}</div>
        <div class="row"><button class="btn" ${i ? "" : "disabled"} id="ce-prev">← Précédente</button><button class="btn" ${i < steps.length - 1 ? "" : "disabled"} id="ce-next">Suivante →</button></div>`;
      $("#ce-prev", root).onclick = () => i && sel(i - 1);
      $("#ce-next", root).onclick = () => i < steps.length - 1 && sel(i + 1);
    }
    $$(".ce-n", root).forEach(g => {
      g.addEventListener("click", () => sel(+g.dataset.i));
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sel(+g.dataset.i); } });
    });
    sel(0);

    /* Diagramme de Sankey */
    const kit = canvasKit($("#ce-cv", root), 0.42);
    const Pth = 3817, aux = 70;
    let flows = { e: 0.34, q: 0.66 };
    function draw() {
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const total = H - 40, x0 = 20, x1 = w * 0.42, x2 = w - 150;
      const he = total * flows.e, hq = total * flows.q, y0 = 20;
      const band = (yA, hA, yB, hB, col) => {
        ctx.fillStyle = col; ctx.beginPath();
        ctx.moveTo(x1, yA); ctx.bezierCurveTo((x1 + x2) / 2, yA, (x1 + x2) / 2, yB, x2, yB);
        ctx.lineTo(x2, yB + hB); ctx.bezierCurveTo((x1 + x2) / 2, yB + hB, (x1 + x2) / 2, yA + hA, x1, yA + hA);
        ctx.closePath(); ctx.fill();
      };
      ctx.fillStyle = alpha(T.hot, 0.75); ctx.fillRect(x0, y0, x1 - x0, total);
      text(ctx, "Chaleur du cœur", x0 + 8, y0 + 14, T.surface, 12, "left", "sans");
      text(ctx, fmt(Pth, 0) + " MW", x0 + 8, y0 + 30, T.surface, 12);
      band(y0, he, y0, he, alpha(T.volt, 0.75));
      band(y0 + he, hq, y0 + he + 18, hq, alpha(T.cold, 0.55));
      text(ctx, "Électricité brute", x2 + 8, y0 + he / 2 - 8, T.ink, 12, "left", "sans");
      text(ctx, fmt(Pth * flows.e, 0) + " MW", x2 + 8, y0 + he / 2 + 8, T.volt, 12);
      text(ctx, "Source froide", x2 + 8, y0 + he + 18 + hq / 2 - 8, T.ink, 12, "left", "sans");
      text(ctx, fmt(Pth * flows.q, 0) + " MW", x2 + 8, y0 + he + 18 + hq / 2 + 8, T.cold, 12);
    }
    kit.onResize = draw;
    bindRange(root, "ce-river", v => v + " °C", v => {
      const Th = 285 + 273.15, Tc = v + 15 + 273.15;           // condenseur ≈ 15 °C au-dessus de la rivière
      const eta = 0.75 * (1 - Tc / Th);                          // ≈ 75 % du rendement de Carnot
      flows = { e: eta, q: 1 - eta };
      const pe = Pth * eta - aux;
      $("#ce-eta", root).textContent = fmt(eta * 100, 1) + " %";
      $("#ce-pe", root).textContent = fmt(pe, 0) + " MWe";
      $("#ce-q", root).textContent = fmt(Pth * (1 - eta), 0) + " MW";
      $("#ce-y", root).textContent = fmt(pe * 8760 * 0.8 / 1e6, 1) + " TWh";
      const m = $("#ce-msg", root);
      if (v >= 25) { m.className = "status danger"; m.textContent = "Canicule : la rivière est déjà chaude. Pour protéger les poissons, la réglementation limite l'échauffement de l'eau en aval. Certaines centrales doivent alors baisser leur puissance, comme lors des étés 2003, 2019 ou 2022."; }
      else if (v >= 20) { m.className = "status warn"; m.textContent = "Eau tiède : le condenseur refroidit moins bien, le rendement baisse un peu."; }
      else { m.className = "status ok"; m.textContent = "Eau froide : bon refroidissement et meilleur rendement. Les centrales produisent un peu plus en hiver."; }
      draw();
    });
    return () => kit.stop();
  },
  quiz: [
    { q: "Dans une centrale nucléaire, qu'est-ce qui fait tourner la turbine ?", a: ["Les neutrons", "De la vapeur d'eau", "L'uranium directement", "Du vent"], c: 1, why: "La fission chauffe de l'eau, la vapeur sous pression fait tourner la turbine, comme dans toute centrale thermique." },
    { q: "Environ quelle part de la chaleur du cœur devient de l'électricité ?", a: ["10 %", "33 %", "66 %", "100 %"], c: 1, why: "Environ un tiers : le reste part obligatoirement dans la source froide (rivière, mer ou atmosphère)." }
  ]
});

/* ===================================================================== */
lesson({
  id: "rep", track: "cen",
  title: "Le réacteur à eau pressurisée en détail",
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
  id: "pilotage", track: "cen",
  title: "Pilote ta centrale",
  lead: "Installe-toi en salle de commande. Ton objectif : faire diverger le réacteur, lancer la turbine, coupler l'alternateur au réseau et monter à pleine puissance, sans déclencher l'arrêt automatique.",
  body: `
  <div class="prose">
    <p>Les opérateurs disposent de trois leviers principaux :</p>
    <ul>
      <li><strong>Les barres de commande</strong> : rapides, elles absorbent les neutrons. On les retire pour démarrer, on les fait chuter pour arrêter.</li>
      <li><strong>Le bore</strong> dissous dans l'eau primaire : il absorbe aussi les neutrons. On le « dilue » (en ajoutant de l'eau pure) pour augmenter la réactivité, ou on « bore » pour la diminuer. Lent mais très uniforme.</li>
      <li><strong>La vanne d'admission de la turbine</strong> : elle règle la quantité de vapeur prélevée, donc la chaleur évacuée du cœur.</li>
    </ul>
    <p>La <strong>réactivité</strong> se mesure en pcm (pour cent mille). À 0 pcm, le réacteur est critique : sa puissance est stable. Au-dessus, elle monte ; en dessous, elle baisse. Point clé : quand l'eau chauffe, la réactivité diminue d'elle-même (contre-réaction de température). Le réacteur se stabilise naturellement, c'est une sécurité intrinsèque des REP.</p>
  </div>
  ${lab("Salle de commande", "Démarrage d'une tranche de 1 300 MWe", `
    <ol class="prose" id="pi-check" style="margin:0;padding-left:1.3em;display:grid;gap:2px"></ol>
    <canvas id="pi-cv" aria-label="Courbes de puissance et de température"></canvas>
    <div class="readouts">${readout("pi-p", "Puissance thermique")}${readout("pi-rho", "Réactivité")}${readout("pi-t", "T° eau (moyenne / sortie)")}${readout("pi-rpm", "Turbine")}${readout("pi-pe", "Électricité au réseau")}</div>
    <div class="controls">${slider("pi-rod", "Barres de commande insérées", 0, 100, 1, 100)}${slider("pi-b", "Consigne de bore", 900, 1400, 10, 1250)}${slider("pi-v", "Vanne d'admission turbine", 0, 100, 1, 0)}</div>
    <div class="row"><button class="btn primary" id="pi-c" disabled>Coupler au réseau</button><button class="btn" id="pi-au" style="color:var(--danger);border-color:var(--danger)">Arrêt d'urgence</button><button class="btn" id="pi-r">Réinitialiser</button></div>
    <p class="status" id="pi-msg"></p>
    <p class="hint">Simulateur pédagogique : les ordres de grandeur sont réalistes, les durées sont fortement accélérées (un vrai démarrage prend plusieurs heures). Les barres bougent de 8 %/s, le bore de 15 ppm/s.</p>`)}
  <div class="prose">
    <p class="note"><b>La vraie salle de commande.</b> Elle est occupée 24 h sur 24 par une équipe de quart : un chef d'exploitation, des opérateurs réacteur et turbine, un ingénieur sûreté. Chaque opérateur s'entraîne régulièrement sur un simulateur pleine échelle, une copie exacte de sa salle de commande, où l'on rejoue incidents et accidents.</p>
    <p class="note"><b>Suivi de charge.</b> Les réacteurs français savent moduler leur puissance plusieurs fois par jour, entre environ 20 % et 100 %, pour suivre la consommation et compenser le solaire et l'éolien. C'est assez rare dans le monde.</p>
  </div>`,
  mount(root) {
    const kit = canvasKit($("#pi-cv", root), 0.32);
    const goals = ["Faire diverger le réacteur : retirer les barres, puis diluer le bore jusqu'à une réactivité positive", "Monter à 10 % de puissance thermique", "Ouvrir la vanne pour amener la turbine à 1 500 tr/min", "Coupler l'alternateur au réseau", "Atteindre 1 300 MWe (± 5 %) et tenir 8 secondes"];
    let s;
    const setSlider = (id, v) => { const e = $("#" + id, root); e.value = v; e.dispatchEvent(new Event("input")); };
    function reset() {
      s = { P: 1e-5, T: 290, rods: 1, B: 1250, rpm: 0, coupled: false, trip: "", done: [false, false, false, false, false], hold: 0, hist: [], tt: 0, rho: 0 };
      setSlider("pi-rod", 100); setSlider("pi-b", 1250); setSlider("pi-v", 0);
    }
    const get = {
      rod: bindRange(root, "pi-rod", v => v + " %"),
      b: bindRange(root, "pi-b", v => v + " ppm"),
      v: bindRange(root, "pi-v", v => v + " %")
    };
    reset();
    $("#pi-r", root).onclick = reset;
    $("#pi-au", root).onclick = () => { if (!s.trip) s.trip = "Arrêt d'urgence manuel : les barres chutent dans le cœur."; };
    $("#pi-c", root).onclick = () => { if (!s.trip && s.rpm > 1480 && s.rpm < 1520) s.coupled = true; };
    const toward = (a, b, r, dt) => a + clamp(b - a, -r * dt, r * dt);
    let ui = 0;
    const stop = animate(dt => {
      s.tt += dt;
      if (s.trip) { s.rods = Math.min(1, s.rods + dt * 1.2); s.coupled = false; }
      else s.rods = toward(s.rods, get.rod() / 100, 0.08, dt);
      s.B = toward(s.B, get.b(), 15, dt);
      s.rho = -3000 * s.rods - 2.5 * (s.B - 1200) - 20 * (s.T - 290);
      s.P = Math.max(1e-6, s.P + (s.P * s.rho / 900 + 1e-6) * dt);
      const valve = get.v() / 100;
      const Q = Math.max(0, valve * (s.T - 280) / 30);
      s.T = clamp(s.T + (12 * (s.P - Q) - 0.01 * (s.T - 290)) * dt, 250, 400);
      const hot = s.T + 18 * s.P;
      if (s.coupled) s.rpm = 1500;
      else s.rpm = Math.max(0, s.rpm + (Q / 0.04 * 1500 - s.rpm) * 0.4 * dt);
      if (!s.coupled && s.rpm > 1650) { setSlider("pi-v", 0); s.rpm = 1600; $("#pi-msg", root).className = "status warn"; }
      const Pe = s.coupled ? Math.max(0, (Q - 0.03) / 0.97 * 1300) : 0;
      // protections automatiques
      if (!s.trip) {
        if (hot > 340) s.trip = "Arrêt automatique : température de sortie du cœur trop élevée (> 340 °C). La chaleur n'est pas assez évacuée : ouvre davantage la vanne turbine.";
        else if (s.P > 1.12) s.trip = "Arrêt automatique : puissance supérieure à 112 % du nominal. Dilue le bore plus progressivement à l'approche de 100 %.";
        else if (s.rho > 900) s.trip = "Arrêt automatique : réactivité trop forte, la puissance monterait dangereusement vite.";
      }
      // objectifs
      if (s.P > 1e-3) s.done[0] = true;
      if (s.P > 0.1) s.done[1] = true;
      if (s.rpm > 1480) s.done[2] = true;
      if (s.coupled) s.done[3] = true;
      if (s.coupled && Math.abs(Pe - 1300) < 65) { s.hold += dt; if (s.hold > 8) s.done[4] = true; } else s.hold = 0;
      s.hist.push([s.tt, s.P, s.T, hot]); while (s.hist.length && s.tt - s.hist[0][0] > 90) s.hist.shift();
      // dessin
      const { ctx, w, h: H } = kit;
      ctx.clearRect(0, 0, w, H);
      const pl = 44, pr = 44, pt = 10, pb = 18, gh = H - pt - pb;
      const X = t => pl + (w - pl - pr) * (1 - (s.tt - t) / 90);
      const YP = p => pt + gh * (1 - (Math.log10(Math.max(p, 1e-6)) + 6) / 6.1);
      const YT = T => pt + gh * (1 - (T - 270) / 80);
      ctx.strokeStyle = T.line; ctx.lineWidth = 1;
      [1e-6, 1e-4, 1e-2, 1].forEach(p => { ctx.beginPath(); ctx.moveTo(pl, YP(p)); ctx.lineTo(w - pr, YP(p)); ctx.stroke(); text(ctx, p >= 0.01 ? fmt(p * 100, 0) + "%" : sci(p * 100, 0).replace(" × ", "×") + "%", pl - 4, YP(p), T.core, 9, "right"); });
      [280, 310, 340].forEach(t => text(ctx, t + "°", w - pr + 4, YT(t), T.hot, 9));
      ctx.setLineDash([4, 4]); ctx.strokeStyle = alpha(T.danger, 0.7); ctx.beginPath(); ctx.moveTo(pl, YT(340)); ctx.lineTo(w - pr, YT(340)); ctx.stroke(); ctx.setLineDash([]);
      const line = (k, Y, col, wd) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); s.hist.forEach((p, i) => i ? ctx.lineTo(X(p[0]), Y(p[k])) : ctx.moveTo(X(p[0]), Y(p[k]))); ctx.stroke(); };
      line(1, YP, T.core, 2.5); line(3, YT, T.hot, 2);
      text(ctx, "puissance (log)", pl + 4, pt + 6, T.core, 10); text(ctx, "T sortie cœur", w - pr - 4, pt + 6, T.hot, 10, "right");
      // affichage (4 fois par seconde)
      ui += dt; if (ui < 0.25) return; ui = 0;
      $("#pi-p", root).textContent = s.P < 0.001 ? sci(s.P * 100, 1) + " %" : fmt(s.P * 100, s.P < 0.01 ? 2 : 1) + " % · " + fmt(s.P * 3817, 0) + " MW";
      $("#pi-rho", root).textContent = (s.rho > 0 ? "+" : "") + fmt(s.rho, 0) + " pcm";
      $("#pi-t", root).textContent = fmt(s.T, 1) + " / " + fmt(hot, 0) + " °C";
      $("#pi-rpm", root).textContent = fmt(s.rpm, 0) + " tr/min" + (s.coupled ? " · couplée" : "");
      $("#pi-pe", root).textContent = fmt(Pe, 0) + " MWe";
      $("#pi-c", root).disabled = !!s.trip || s.coupled || !(s.rpm > 1480 && s.rpm < 1520);
      $("#pi-check", root).innerHTML = goals.map((g, i) => `<li style="color:${s.done[i] ? "var(--ok)" : i === s.done.indexOf(false) ? "var(--ink)" : "var(--muted)"}">${s.done[i] ? "✓ " : ""}${g}</li>`).join("");
      const m = $("#pi-msg", root);
      if (s.trip) { m.className = "status danger"; m.textContent = s.trip + " Clique sur Réinitialiser pour recommencer."; }
      else if (s.done[4]) { m.className = "status ok"; m.textContent = "Bravo ! Ta tranche fournit 1 300 MWe au réseau, de quoi alimenter environ 2 millions de foyers."; }
      else if (s.rpm >= 1600 && !s.coupled) { m.className = "status warn"; m.textContent = "Survitesse turbine : la vanne s'est refermée automatiquement. Ouvre-la plus doucement."; }
      else if (!s.done[0]) { m.className = "status"; m.textContent = s.rods > 0.02 ? "Commence par retirer complètement les barres (curseur à 0 %)." : s.rho <= 0 ? "Les barres sont sorties mais la réactivité est encore négative : baisse la consigne de bore vers 1 100 ppm." : "Réactivité positive : la puissance monte. Patience…"; }
      else if (!s.done[1]) { m.className = "status"; m.textContent = "La puissance grimpe. En chauffant, l'eau fait baisser la réactivité : dilue un peu plus si ça plafonne."; }
      else if (!s.done[2]) { m.className = "status"; m.textContent = "Ouvre la vanne turbine petit à petit (≈ 8 à 10 %) pour atteindre 1 500 tr/min."; }
      else if (!s.done[3]) { m.className = "status"; m.textContent = "Turbine à vitesse de synchronisme : couple l'alternateur au réseau."; }
      else { m.className = "status"; m.textContent = "Couplée ! Pour monter en puissance, ouvre la vanne et dilue le bore ensemble, en surveillant la température de sortie du cœur (max 340 °C)."; }
    });
    return () => { stop(); kit.stop(); };
  },
  quiz: [
    { q: "Que se passe-t-il quand on dilue le bore de l'eau primaire ?", a: ["La réactivité diminue", "La réactivité augmente", "La turbine accélère directement", "La pression baisse"], c: 1, why: "Le bore absorbe les neutrons : moins de bore, plus de neutrons disponibles pour la fission." },
    { q: "Pourquoi un REP se stabilise-t-il de lui-même quand sa puissance monte ?", a: ["Grâce aux opérateurs", "Parce que l'eau qui chauffe réduit la réactivité", "Parce que l'uranium s'épuise instantanément", "Il ne se stabilise pas"], c: 1, why: "L'eau plus chaude modère moins bien les neutrons : c'est la contre-réaction de température." }
  ]
});

/* ===================================================================== */
lesson({
  id: "vie", track: "cen",
  title: "La vie d'une centrale",
  lead: "Une centrale est conçue pour fonctionner au moins 40 ans, souvent 60. Entre sa construction et son démantèlement, elle vit au rythme des rechargements de combustible et des grandes visites décennales.",
  body: `
  <div class="prose">
    <p>Un réacteur tourne en continu pendant 12 à 18 mois, puis s'arrête plusieurs semaines pour un <strong>arrêt de tranche</strong>. On ouvre la cuve sous l'eau, on retire le combustible le plus usé (un tiers ou un quart du cœur), on déplace les autres assemblages, on ajoute du combustible neuf, et on en profite pour des milliers d'opérations de maintenance. Plusieurs centaines de techniciens extérieurs viennent renforcer les équipes.</p>
  </div>
  ${lab("Labo 1", "Recharge le cœur", `
    <div class="split">
      <div id="vi-core" style="min-width:0"></div>
      <div class="info-panel">
        <div class="eyebrow">193 assemblages · gestion par tiers</div>
        <div class="readouts" style="grid-template-columns:1fr 1fr">${readout("vi-cy", "Cycles réalisés")}${readout("vi-y", "Années de fonctionnement")}${readout("vi-pool", "Assemblages en piscine")}${readout("vi-e", "Électricité produite")}</div>
        <div class="row"><button class="btn primary" id="vi-go">Arrêt de tranche</button><button class="btn" id="vi-r">Réinitialiser</button></div>
        <p class="hint" id="vi-msg"></p>
      </div>
    </div>
    <div class="row hint"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--glow)"></span> neuf <span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--hot)"></span> 2ᵉ cycle <span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:var(--muted)"></span> 3ᵉ cycle (le plus usé)</div>
    <p class="hint">Plan de chargement simplifié. Les assemblages neufs, les plus réactifs, sont placés en damier au centre ; les plus usés en périphérie, pour limiter les fuites de neutrons et protéger la cuve.</p>`)}
  ${lab("Labo 2", "De la construction au démantèlement", `
    <div class="steps" id="vi-steps"></div>
    <div class="info-panel" id="vi-info" aria-live="polite"></div>`)}`,
  mount(root) {
    const rows = [7, 11, 13, 13, 15, 15, 15, 15, 15, 15, 15, 13, 13, 11, 7];
    const pos = [];
    rows.forEach((n, r) => { const off = (15 - n) / 2; for (let c = 0; c < n; c++) pos.push([c + off, r]); });
    const col = { 1: "var(--glow)", 2: "var(--hot)", 3: "var(--muted)" };
    let cyc, years, pool, energy;
    const pattern = () => pos.map(([c, r]) => { const d = Math.hypot(c - 7, r - 7); return d > 5.6 ? 3 : (c + r) % 2 ? 1 : 2; });
    let st = pattern();
    $("#vi-core", root).innerHTML = `<svg viewBox="-2 -2 154 154" role="img" aria-label="Plan de chargement du cœur" style="max-width:420px;margin:0 auto">
      <circle cx="75" cy="75" r="76" fill="none" stroke="var(--line)" stroke-width="2"/>
      ${pos.map(([c, r], i) => `<rect data-i="${i}" x="${c * 10 + 0.6}" y="${r * 10 + 0.6}" width="8.8" height="8.8" rx="1.5" style="transition:fill .5s"/>`).join("")}</svg>`;
    const cells = $$("#vi-core rect", root);
    function paint() {
      cells.forEach((c, i) => c.setAttribute("fill", col[st[i]]));
      $("#vi-cy", root).textContent = cyc;
      $("#vi-y", root).textContent = fmt(years, 1) + " ans";
      $("#vi-pool", root).textContent = pool;
      $("#vi-e", root).textContent = fmt(energy, 0) + " TWh";
    }
    function reset() { cyc = 0; years = 0; pool = 0; energy = 0; st = pattern(); $("#vi-msg", root).textContent = "Chaque cycle dure environ 18 mois à pleine puissance."; paint(); }
    $("#vi-go", root).onclick = () => {
      const out = st.filter(x => x === 3).length;
      pool += out; cyc++; years += 1.5; energy += 1300 * 8760 * 1.5 * 0.82 / 1e6;
      cells.forEach(c => c.setAttribute("fill", "var(--surface-2)"));
      setTimeout(() => { st = pattern(); paint(); }, 450);
      $("#vi-msg", root).textContent = `${out} assemblages usés partent en piscine, les autres sont déplacés, ${st.filter(x => x === 1).length} neufs sont chargés. L'arrêt dure environ 1 à 3 mois.` + (cyc % 7 === 0 ? " C'est aussi l'heure d'une visite décennale !" : "");
      paint();
    };
    $("#vi-r", root).onclick = reset;
    reset();
    const life = [
      ["Site et autorisations", "Avant tout, il faut un site : de l'eau pour refroidir (fleuve ou mer), un sol stable, des études sismiques et d'inondation. Débat public, enquête publique, puis décret d'autorisation de création. Plusieurs années de procédure."],
      ["Construction", "Pour les réacteurs des années 1980, il fallait environ 6 à 7 ans. L'EPR de Flamanville, premier de sa génération en France, a demandé 17 ans (2007–2024), un chantier marqué par de nombreuses difficultés. Le béton de l'enceinte, les gros composants (cuve, générateurs de vapeur) et des milliers de kilomètres de câbles."],
      ["Premier chargement", "On charge le combustible neuf, on remplit le circuit primaire, on réalise des essais à froid puis à chaud. Puis vient la première divergence : la première réaction en chaîne entretenue. Quelques semaines plus tard, le premier couplage au réseau."],
      ["Exploitation", "La centrale produit 24 h sur 24. Des équipes se relaient en salle de commande, d'autres assurent la maintenance, la radioprotection, la chimie, la surveillance de l'environnement (eau, air, lait, végétaux autour du site). Un site emploie de 700 à 2 000 salariés environ, plus les prestataires."],
      ["Arrêts de tranche", "Tous les 12 à 18 mois, recharge du combustible et maintenance programmée. C'est le moment le plus chargé de la vie d'une centrale : des milliers d'interventions en quelques semaines."],
      ["Visites décennales", "Tous les 10 ans, un très grand contrôle : épreuve hydraulique du circuit primaire, test d'étanchéité de l'enceinte mise en pression, inspection de la cuve par ultrasons. L'Autorité de sûreté décide ensuite si le réacteur peut repartir pour 10 ans, souvent en exigeant des améliorations."],
      ["Au-delà de 40 ans", "Les réacteurs de 900 MWe ont été autorisés à fonctionner au-delà de 40 ans moyennant d'importants travaux, notamment issus des leçons de Fukushima. La question de 60 ans et plus est à l'étude. La cuve, impossible à remplacer, est l'élément qui limite la durée de vie."],
      ["Arrêt définitif", "On retire le combustible, qui part en piscine puis au retraitement. Environ 99 % de la radioactivité quitte le site avec lui. Fessenheim, la plus ancienne centrale REP de France, a été arrêtée en 2020."],
      ["Démantèlement", "On décontamine, on découpe les équipements (souvent sous l'eau ou avec des robots), on démolit les bâtiments, on trie les déchets selon leur radioactivité. Cela prend 15 à 30 ans. Chooz A dans les Ardennes et Brennilis en Bretagne sont des chantiers pionniers en France."]
    ];
    const lb = $("#vi-steps", root);
    life.forEach((l, i) => { const b = h(`<button class="step"><i>${i + 1}</i>${l[0]}</button>`); b.onclick = () => sel(i); lb.appendChild(b); });
    function sel(i) {
      $$(".step", lb).forEach((b, j) => b.classList.toggle("on", i === j));
      $("#vi-info", root).innerHTML = `<div class="eyebrow">Étape ${i + 1} sur ${life.length}</div><h4>${life[i][0]}</h4><p>${life[i][1]}</p>`;
    }
    sel(4);
  },
  quiz: [
    { q: "Tous les combien un réacteur français s'arrête-t-il pour recharger son combustible ?", a: ["Tous les mois", "Tous les 12 à 18 mois", "Tous les 10 ans", "Jamais"], c: 1, why: "Un arrêt de tranche a lieu tous les 12 à 18 mois ; la visite décennale, plus lourde, tous les 10 ans." },
    { q: "Quel composant limite la durée de vie d'un réacteur ?", a: ["La turbine", "La cuve, qu'on ne peut pas remplacer", "Les pompes", "La salle de commande"], c: 1, why: "Presque tout se remplace dans une centrale, sauf la cuve (et l'enceinte)." }
  ]
});

/* ===================================================================== */
lesson({
  id: "parc", track: "cen",
  title: "Le parc nucléaire français",
  lead: "57 réacteurs répartis sur 18 sites, presque tous construits en vingt ans. Comment la France est devenue le pays le plus nucléarisé du monde par habitant.",
  body: `
  <div class="prose">
    <h2>Une histoire en accéléré</h2>
    <ul>
      <li><strong>1945</strong> : création du Commissariat à l'énergie atomique (CEA).</li>
      <li><strong>1956–1963</strong> : premiers réacteurs à Marcoule puis Chinon, d'une filière française (uranium naturel, graphite, gaz) aujourd'hui abandonnée.</li>
      <li><strong>1974</strong> : après le premier choc pétrolier, le plan Messmer lance la construction massive de réacteurs à eau pressurisée. « En France, on n'a pas de pétrole, mais on a des idées. »</li>
      <li><strong>1977–1999</strong> : mise en service de 58 réacteurs REP, souvent plusieurs par an.</li>
      <li><strong>2020</strong> : fermeture des deux réacteurs de Fessenheim (Haut-Rhin).</li>
      <li><strong>2024</strong> : l'EPR de Flamanville est couplé au réseau, premier nouveau réacteur depuis 25 ans.</li>
      <li><strong>Aujourd'hui</strong> : un programme de 6 nouveaux réacteurs EPR2 est lancé, à Penly, Gravelines et au Bugey.</li>
    </ul>
    <p>Grâce à la <strong>standardisation</strong>, les réacteurs sont regroupés en « paliers » presque identiques : 900 MWe, 1 300 MWe, N4 (1 450 MWe) et EPR (1 650 MWe). Une amélioration validée sur un réacteur peut être appliquée à tous ceux du même palier.</p>
  </div>
  ${lab("Labo", "La carte des centrales", `
    <div class="row" id="pk-f"></div>
    <div class="split">
      <div id="pk-map" style="min-width:0"></div>
      <div class="info-panel" id="pk-info" aria-live="polite"></div>
    </div>
    <div class="readouts">${readout("pk-n", "Réacteurs affichés")}${readout("pk-mw", "Puissance installée")}${readout("pk-s", "Sites")}</div>
    <p class="hint">Puissances nominales arrondies par palier. Clique sur un site.</p>`)}
  <div class="prose">
    <p class="note"><b>Pourquoi au bord de l'eau ?</b> Toutes les centrales sont sur la côte (Manche, estuaire de la Gironde) ou au bord d'un grand fleuve (Loire, Rhône, Seine, Garonne, Moselle, Meuse, Vienne) : il faut d'énormes quantités d'eau pour refroidir les condenseurs. Les centrales en bord de rivière à faible débit sont équipées de tours de refroidissement, qui limitent l'eau prélevée.</p>
  </div>`,
  mount(root) {
    // [nom, lat, lon, [[palier, nb]], source froide, mise en service, fermée]
    const sites = [
      ["Gravelines", 51.01, 2.13, [[900, 6]], "Mer du Nord", 1980], ["Penly", 49.98, 1.21, [[1300, 2]], "Manche", 1990],
      ["Paluel", 49.86, 0.63, [[1300, 4]], "Manche", 1984], ["Flamanville", 49.54, -1.88, [[1300, 2], [1650, 1]], "Manche", 1985],
      ["Chooz", 50.09, 4.79, [[1450, 2]], "Meuse", 1996], ["Cattenom", 49.42, 6.22, [[1300, 4]], "Moselle", 1986],
      ["Nogent-sur-Seine", 48.52, 3.52, [[1300, 2]], "Seine", 1987], ["Dampierre", 47.73, 2.52, [[900, 4]], "Loire", 1980],
      ["Belleville", 47.51, 2.88, [[1300, 2]], "Loire", 1987], ["Saint-Laurent", 47.72, 1.58, [[900, 2]], "Loire", 1981],
      ["Chinon", 47.23, 0.17, [[900, 4]], "Loire", 1982], ["Civaux", 46.46, 0.65, [[1450, 2]], "Vienne", 1997],
      ["Le Blayais", 45.26, -0.69, [[900, 4]], "Estuaire de la Gironde", 1981], ["Golfech", 44.11, 0.85, [[1300, 2]], "Garonne", 1990],
      ["Bugey", 45.80, 5.27, [[900, 4]], "Rhône", 1978], ["Saint-Alban", 45.40, 4.76, [[1300, 2]], "Rhône", 1985],
      ["Cruas", 44.63, 4.76, [[900, 4]], "Rhône", 1983], ["Tricastin", 44.33, 4.73, [[900, 4]], "Rhône (canal de Donzère)", 1980],
      ["Fessenheim", 47.90, 7.56, [[900, 2]], "Rhin (Grand Canal d'Alsace)", 1977, 2020]
    ];
    const pal = { 900: ["900 MWe", "var(--core)"], 1300: ["1 300 MWe", "var(--volt)"], 1450: ["N4 · 1 450 MWe", "var(--hot)"], 1650: ["EPR · 1 650 MWe", "var(--ok)"] };
    const outline = [[2.5, 51.08], [3.2, 50.75], [4.2, 50.35], [4.85, 50.15], [4.8, 49.95], [5.4, 49.6], [6.2, 49.5], [7, 49.15], [8.2, 48.98], [7.8, 48.6], [7.55, 47.6], [6.95, 47.45], [6.1, 46.9], [6.1, 46.25], [6.8, 46.0], [7.0, 45.9], [6.65, 45.1], [7.0, 44.25], [7.6, 43.8], [7.0, 43.55], [6.6, 43.15], [5.9, 43.1], [5.0, 43.4], [4.6, 43.45], [3.9, 43.5], [3.2, 43.15], [3.05, 42.6], [3.15, 42.43], [2.5, 42.35], [1.7, 42.5], [0.7, 42.7], [-0.3, 42.85], [-1.4, 43.25], [-1.78, 43.37], [-1.45, 43.6], [-1.25, 44.6], [-1.15, 45.6], [-1.2, 46.15], [-1.8, 46.5], [-2.15, 47.1], [-2.5, 47.3], [-3.0, 47.55], [-4.35, 47.8], [-4.75, 48.0], [-4.75, 48.4], [-4.4, 48.65], [-3.6, 48.8], [-3.0, 48.75], [-2.0, 48.65], [-1.55, 48.63], [-1.6, 49.2], [-1.9, 49.7], [-1.3, 49.7], [-1.1, 49.4], [0.0, 49.4], [0.2, 49.6], [1.2, 49.95], [1.6, 50.35], [1.6, 50.85]];
    const corse = [[9.4, 43.0], [9.55, 42.1], [9.2, 41.37], [8.6, 41.9], [8.7, 42.6]];
    const k = 40, cl = Math.cos(46.5 * Math.PI / 180);
    const P = ([lon, lat]) => [((lon + 5.2) * k * cl).toFixed(1), ((51.4 - lat) * k).toFixed(1)];
    const poly = pts => pts.map(P).map(p => p.join(",")).join(" ");
    let filt = 0, cur = 0;
    const fb = $("#pk-f", root);
    [[0, "Tous"], [900, "900 MWe"], [1300, "1 300 MWe"], [1450, "N4"], [1650, "EPR"]].forEach(([v, n]) => {
      const b = h(`<button class="btn">${n}</button>`); b.onclick = () => { filt = v; draw(); }; fb.appendChild(b); b.dataset.v = v;
    });
    function draw() {
      $$("button", fb).forEach(b => b.classList.toggle("on", +b.dataset.v === filt));
      const vis = s => !filt || s[3].some(([p]) => p === filt);
      $("#pk-map", root).innerHTML = `<svg viewBox="0 0 ${(14.9 * k * cl).toFixed(0)} ${(10.2 * k).toFixed(0)}" role="img" aria-label="Carte de France des centrales nucléaires" style="max-width:520px;margin:0 auto">
        <polygon points="${poly(outline)}" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="${poly(corse)}" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/>
        ${sites.map((s, i) => {
          const [x, y] = P([s[2], s[1]]), n = s[3].reduce((a, b) => a + b[1], 0), on = vis(s);
          const c = s[6] ? "var(--muted)" : pal[s[3][s[3].length - 1][0]][1];
          return `<g class="pk" data-i="${i}" style="cursor:pointer" opacity="${on ? 1 : 0.18}" role="button" tabindex="0" aria-label="${s[0]}">
            <circle cx="${x}" cy="${y}" r="${4 + n * 1.6}" fill="${c}" opacity="${s[6] ? 0.35 : 0.85}" stroke="${i === cur ? "var(--ink)" : "var(--surface)"}" stroke-width="${i === cur ? 2.5 : 1.5}" ${s[6] ? 'stroke-dasharray="3 2"' : ""}/>
            <text x="${x}" y="${+y + 0.5}" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="600" fill="var(--surface)" font-family="IBM Plex Mono, monospace" pointer-events="none">${s[6] ? "×" : n}</text></g>`;
        }).join("")}</svg>`;
      $$(".pk", root).forEach(g => {
        const go = () => { cur = +g.dataset.i; draw(); };
        g.addEventListener("click", go);
        g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      });
      const act = sites.filter(s => !s[6] && vis(s));
      let n = 0, mw = 0;
      act.forEach(s => s[3].forEach(([p, c]) => { if (!filt || p === filt) { n += c; mw += p * c; } }));
      $("#pk-n", root).textContent = n;
      $("#pk-mw", root).textContent = fmt(mw / 1000, 1) + " GW";
      $("#pk-s", root).textContent = act.length;
      const s = sites[cur], tot = s[3].reduce((a, [p, c]) => a + p * c, 0);
      $("#pk-info", root).innerHTML = `<div class="eyebrow">${s[6] ? "Centrale arrêtée" : "Centrale en service"}</div><h4>${s[0]}</h4>
        <p>${s[3].map(([p, c]) => `${c} réacteur${c > 1 ? "s" : ""} de ${pal[p][0]}`).join(" + ")}</p>
        <div class="facts">Puissance : ${fmt(tot, 0)} MWe<br>Source froide : ${s[4]}<br>Premier couplage : ${s[5]}${s[6] ? "<br>Arrêt définitif : " + s[6] : ""}${s[0] === "Flamanville" ? "<br>EPR couplé au réseau : 2024" : ""}</div>`;
    }
    draw();
  },
  quiz: [
    { q: "Combien de réacteurs nucléaires sont en service en France ?", a: ["19", "38", "57", "104"], c: 2, why: "57 réacteurs répartis sur 18 sites, depuis la mise en service de l'EPR de Flamanville en 2024." },
    { q: "Quel événement a déclenché le grand programme nucléaire français en 1974 ?", a: ["L'accident de Tchernobyl", "Le premier choc pétrolier", "La Seconde Guerre mondiale", "La découverte de l'uranium en France"], c: 1, why: "La flambée du prix du pétrole en 1973 pousse le gouvernement Messmer à miser sur le nucléaire pour l'indépendance énergétique." }
  ]
});
