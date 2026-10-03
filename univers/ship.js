/* =========================================================================
   Arche Aurore — concept de vaisseau-arche pour coloniser Proxima b.
   Ordres de grandeur inspirés du projet Daedalus (BIS, 1978), du système
   de survie de l'ISS et des études de génétique des populations.
   ========================================================================= */
(function () {
  "use strict";
  const DIST = 4.24;               // al jusqu'à Proxima
  const VC = 0.05;                 // vitesse de croisière (fraction de c)
  const TA = 4;                    // années d'accélération (et de freinage)
  const T_CRUISE_END = TA + (DIST - 2 * 0.5 * VC * TA) / VC;   // 84,8 ans
  const T_END = T_CRUISE_END + TA;                            // 88,8 ans
  const VE = 0.04;                 // vitesse d'éjection (fraction de c)
  const M_DRY = 0.4, M0 = M_DRY * Math.exp(2 * VC / VE);       // millions de tonnes

  function state(t) {
    t = Math.max(0, Math.min(T_END, t));
    let d, v, phase, m;
    const k = VC / TA / 2;         // demi-accélération en al/an²
    if (t < TA) { v = VC * t / TA; d = k * t * t; phase = "Accélération"; m = M0 * Math.exp(-v / VE); }
    else if (t < T_CRUISE_END) { v = VC; d = k * TA * TA + VC * (t - TA); phase = "Croisière"; m = M0 * Math.exp(-VC / VE); }
    else {
      const u = t - T_CRUISE_END;
      v = VC * (1 - u / TA); d = k * TA * TA + VC * (T_CRUISE_END - TA) + VC * u - k * u * u; phase = t >= T_END ? "Arrivée" : "Freinage";
      m = M0 * Math.exp(-VC / VE) * Math.exp(-(VC - v) / VE);
    }
    const gen = 1 + Math.floor(t / 28);
    const pop = Math.round(1200 + 180 * Math.sin(Math.min(1, t / 60) * Math.PI) - (t > 80 ? (t - 80) * 4 : 0));
    const fuel = Math.max(0, (m - M_DRY) / (M0 - M_DRY));
    return { t, d, v, phase, gen, pop, fuel, frac: d / DIST };
  }

  const nf = (v, d = 0) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const tile = (k, v, s) => `<div class="sd-tile"><span class="k">${k}</span><span class="v">${v}</span>${s ? `<span class="s">${s}</span>` : ""}</div>`;
  const list = (items) => `<ul class="sd-list">${items.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join("")}</ul>`;

  // Diagramme du cycle de l'air : équipage → CO₂ → épuration → Sabatier/plantes → O₂
  const AIR_SVG = `
  <svg class="sd-svg" viewBox="0 0 340 210" role="img" aria-label="Cycle de l'oxygène et du dioxyde de carbone à bord">
    <defs><marker id="sd-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
    <g font-family="IBM Plex Sans, system-ui, sans-serif" font-size="11" text-anchor="middle">
      <rect x="120" y="8" width="100" height="36" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <text x="170" y="24" fill="var(--ink)">Équipage</text><text x="170" y="37" fill="var(--dim)" font-size="9.5">1 t d'O₂/jour</text>
      <rect x="236" y="86" width="100" height="40" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <text x="286" y="103" fill="var(--ink)">Épurateurs</text><text x="286" y="117" fill="var(--dim)" font-size="9.5">zéolithes, CO₂</text>
      <rect x="120" y="166" width="100" height="36" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <text x="170" y="182" fill="var(--ink)">Fermes + Sabatier</text><text x="170" y="195" fill="var(--dim)" font-size="9.5">CO₂ → O₂, eau</text>
      <rect x="4" y="86" width="100" height="40" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <text x="54" y="103" fill="var(--ink)">Électrolyse</text><text x="54" y="117" fill="var(--dim)" font-size="9.5">eau → O₂ + H₂</text>
      <path d="M222 30 Q 285 40 286 84" fill="none" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#sd-arr)"/>
      <path d="M286 128 Q 285 178 222 182" fill="none" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#sd-arr)"/>
      <path d="M118 182 Q 55 178 54 128" fill="none" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#sd-arr)"/>
      <path d="M54 84 Q 55 40 118 30" fill="none" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#sd-arr)"/>
      <text x="268" y="50" fill="var(--dim)" font-size="9.5">CO₂</text><text x="268" y="162" fill="var(--dim)" font-size="9.5">CO₂ concentré</text>
      <text x="72" y="162" fill="var(--dim)" font-size="9.5">eau</text><text x="72" y="50" fill="var(--dim)" font-size="9.5">O₂</text>
    </g>
  </svg>`;

  // Coupe schématique du vaisseau, de la proue (gauche) à la poupe
  const SHIP_SVG = `
  <svg class="sd-svg" viewBox="0 0 360 120" role="img" aria-label="Coupe du vaisseau de la proue à la poupe">
    <g font-family="IBM Plex Mono, ui-monospace, monospace" font-size="8" fill="var(--dim)" text-anchor="middle">
      <path d="M8 60 L26 30 L26 90 Z" fill="var(--accent)" opacity="0.8"/><text x="18" y="108">bouclier</text>
      <rect x="26" y="56" width="300" height="8" fill="var(--line)"/>
      <ellipse cx="62" cy="60" rx="6" ry="46" fill="none" stroke="var(--field)" stroke-width="2"/><text x="62" y="10">anneau A</text>
      <ellipse cx="88" cy="60" rx="6" ry="46" fill="none" stroke="var(--field)" stroke-width="2"/><text x="94" y="118">anneau B</text>
      <rect x="110" y="48" width="40" height="24" rx="4" fill="none" stroke="var(--ink)" opacity="0.6"/><text x="130" y="44">eau, abri</text>
      <circle cx="176" cy="46" r="10" fill="none" stroke="var(--ink)" opacity="0.6"/><circle cx="176" cy="74" r="10" fill="none" stroke="var(--ink)" opacity="0.6"/>
      <circle cx="200" cy="46" r="10" fill="none" stroke="var(--ink)" opacity="0.6"/><circle cx="200" cy="74" r="10" fill="none" stroke="var(--ink)" opacity="0.6"/><text x="188" y="98">carburant</text>
      <rect x="226" y="20" width="44" height="6" fill="var(--accent)" opacity="0.5"/><rect x="226" y="94" width="44" height="6" fill="var(--accent)" opacity="0.5"/><text x="248" y="14">radiateurs</text>
      <path d="M326 46 L346 34 L346 86 L326 74 Z" fill="none" stroke="var(--ink)" opacity="0.7"/><text x="336" y="108">moteur</text>
    </g>
  </svg>`;

  const SECTIONS = [
    {
      id: "apercu", label: "Aperçu",
      html: () => `
        <p class="sd-lead">Un vaisseau-génération : ceux qui partent ne verront pas l'arrivée. Leurs petits-enfants, si. 89 ans de voyage vers Proxima b, la planète connue la plus proche dans une zone habitable.</p>
        <div class="sd-grid">
          ${tile("Équipage au départ", "1 200", "capacité 1 500")}
          ${tile("Durée du voyage", "89 ans", "3 à 4 générations")}
          ${tile("Vitesse de croisière", "5 % de c", "15 000 km/s")}
          ${tile("Longueur", "2,4 km", "anneaux de 448 m")}
          ${tile("Masse au départ", "4,9 Mt", "dont 4,5 Mt de carburant")}
          ${tile("Gravité", "1 g", "anneaux à 2 tours/min")}
        </div>
        ${SHIP_SVG}
        <h4>Architecture</h4>
        <p>Une épine dorsale de 2,4 km porte tout. À l'avant, le bouclier. Juste derrière, deux anneaux habités de 224 m de rayon tournent en sens inverse l'un de l'autre : leurs effets gyroscopiques s'annulent et le vaisseau peut pivoter sans effort. Au milieu, un réservoir d'eau de 100 000 m³ sert à la fois de réserve et de blindage. À l'arrière, les réservoirs de deutérium et d'hélium 3, les radiateurs et le moteur à fusion.</p>
        <p class="sd-note">Concept imaginé à partir d'études réelles. Les chiffres sont des ordres de grandeur cohérents entre eux, pas un plan de construction.</p>`,
    },
    {
      id: "air", label: "Air et oxygène",
      html: () => `
        <div class="sd-grid">
          ${tile("Oxygène consommé", "1 t / jour", "0,84 kg par personne")}
          ${tile("Volume pressurisé", "3,4 M m³", "3 400 fois l'ISS")}
          ${tile("Atmosphère", "101 kPa", "21 % O₂, 78 % N₂")}
          ${tile("Réserve d'urgence", "180 jours", "oxygène liquide")}
        </div>
        ${AIR_SVG}
        <h4>Comment on respire pendant 89 ans</h4>
        <p><b>Les plantes d'abord.</b> Les 90 000 m² de cultures produisent l'essentiel de l'oxygène : environ 15 m² de blé sous lumière intense suffisent à une personne. Les photobioréacteurs à spiruline, des tubes d'algues vertes, jouent le rôle de tampon rapide.</p>
        <p><b>Les machines ensuite.</b> Le CO₂ est capté par des lits de zéolithes, comme sur l'ISS. Un réacteur de Sabatier le combine à l'hydrogène (CO₂ + 4 H₂ → CH₄ + 2 H₂O) pour récupérer de l'eau. L'électrolyse coupe ensuite l'eau en oxygène et hydrogène : 1 t d'O₂ par jour demande environ 260 kW.</p>
        <p><b>La sécurité.</b> Trois boucles indépendantes : anneau A, anneau B et moyeu. Chacune peut faire vivre tout l'équipage seule. Les capteurs gardent le CO₂ sous 0,1 % et l'azote, qui fuit lentement, est compensé à partir de réservoirs.</p>`,
    },
    {
      id: "eau", label: "Eau",
      html: () => `
        <div class="sd-grid">
          ${tile("Usage", "50 L", "par personne et par jour")}
          ${tile("Recyclage", "98 %", "record de l'ISS en 2023")}
          ${tile("Pertes", "1,2 m³ / jour", "39 000 m³ en 89 ans")}
          ${tile("Réservoir", "100 000 m³", "100 000 tonnes")}
        </div>
        <h4>Une goutte d'eau fait des milliers de tours</h4>
        ${list([
          ["Urine", "distillation par compression de vapeur ; l'azote récupéré devient de l'engrais."],
          ["Eaux grises", "douches et cuisines : filtration, bioréacteurs à bactéries, puis osmose inverse."],
          ["Humidité de l'air", "la transpiration et la respiration des 1 200 personnes et des plantes sont condensées."],
          ["Contrôle", "chaque litre est analysé (ions, bactéries, composés organiques) avant de revenir au robinet."],
        ])}
        <p>Le grand réservoir central entoure l'abri anti-radiations. Deux mètres d'eau arrêtent une grande partie des rayons cosmiques : chaque tonne d'eau embarquée sert deux fois.</p>`,
    },
    {
      id: "nourriture", label: "Nourriture",
      html: () => `
        <div class="sd-grid">
          ${tile("Énergie", "2 500 kcal", "par personne et par jour")}
          ${tile("Cultures", "90 000 m²", "75 m² par personne, sur 3 étages")}
          ${tile("Éclairage", "36 MW", "LED à spectre réglé")}
          ${tile("Réserve", "2 ans", "aliments lyophilisés")}
        </div>
        <h4>Une agriculture sans sol ni soleil</h4>
        ${list([
          ["Hydroponie et aéroponie", "blé, riz, soja, pommes de terre, patates douces, légumineuses, légumes ; racines dans une brume nutritive."],
          ["Vergers nains", "agrumes, pommiers, figuiers, petits fruits ; récolte toute l'année."],
          ["Spiruline et algues", "20 % des protéines ; elles poussent dix fois plus vite que les cultures."],
          ["Aquaponie", "tilapias et crevettes : leurs déjections nourrissent les plantes, qui filtrent leur eau."],
          ["Élevage d'insectes", "grillons et vers de farine : protéines complètes pour très peu d'espace."],
          ["Viande cultivée", "bioréacteurs à cellules pour les jours de fête."],
        ])}
        <p>Les fermes sont réparties entre les deux anneaux et en dizaines de compartiments étanches : une maladie des plantes ne peut jamais toucher plus d'une petite partie des récoltes. Une banque de 50 000 variétés de semences est gardée au froid.</p>`,
    },
    {
      id: "dechets", label: "Déchets",
      html: () => `
        <div class="sd-grid">
          ${tile("Déchets", "≈ 2 t / jour", "hors eau")}
          ${tile("Recyclage", "97 %", "de la masse")}
          ${tile("Biogaz", "méthane", "carburant de secours")}
          ${tile("Résidu ultime", "verre", "briques de blindage")}
        </div>
        <h4>Rien ne se perd : c'est une question de survie</h4>
        ${list([
          ["Déchets humains", "digesteurs anaérobies (biogaz), puis compostage : un engrais sûr pour les fermes."],
          ["Restes de cultures", "tiges et feuilles nourrissent champignons et insectes, puis le compost."],
          ["Plastiques", "triés, broyés, fondus en filaments pour les imprimantes 3D ; les autres sont pyrolysés."],
          ["Métaux", "refondus à la fonderie de bord pour fabriquer des pièces neuves."],
          ["Le reste", "oxydé à 650 °C dans de l'eau supercritique, puis vitrifié en briques qui renforcent le blindage."],
        ])}
        <p>Les défunts reçoivent des funérailles par compostage humain, dans un jardin du souvenir. Leurs éléments retournent à la vie du vaisseau : c'est le seul cycle possible quand chaque atome compte.</p>`,
    },
    {
      id: "energie", label: "Énergie",
      html: () => `
        <div class="sd-grid">
          ${tile("Réacteurs de bord", "2 × 400 MW", "fusion D-He3")}
          ${tile("Propulsion", "3,5 PW", "en pleine poussée")}
          ${tile("Radiateurs", "1,2 km²", "évacuent la chaleur")}
          ${tile("Secours", "7 jours", "batteries et piles")}
        </div>
        <p>Deux réacteurs à fusion deutérium-hélium 3 alimentent la vie à bord : lumière des fermes, recyclage, chauffage, ateliers. Cette réaction produit peu de neutrons, donc peu de radioactivité. Chacun peut tout alimenter seul.</p>
        <p>Dans l'espace, le plus dur n'est pas de produire de la chaleur mais de s'en débarrasser : il n'y a pas d'air pour refroidir. D'immenses radiateurs rougeoyants rayonnent la chaleur dans le vide, comme les panneaux de l'ISS, mais 1 000 fois plus grands.</p>`,
    },
    {
      id: "equipage", label: "Équipage",
      html: () => `
        <div class="sd-grid">
          ${tile("Au départ", "1 200", "20 à 40 ans, parité")}
          ${tile("Banque génétique", "10 000", "embryons congelés")}
          ${tile("Hôpital", "80 lits", "chirurgie robotisée")}
          ${tile("Travail", "25 h / sem.", "rotation des métiers")}
        </div>
        <h4>Une petite nation en route</h4>
        <p><b>Génétique.</b> Une étude de 2018 (Marin et Beluffi) estime qu'environ 100 personnes suffisent à éviter la consanguinité sur un tel voyage. L'Arche en emporte 1 200, plus des gamètes de 50 000 donneurs et 10 000 embryons congelés pour garder une grande diversité.</p>
        <p><b>Naissances.</b> La population est maintenue entre 1 200 et 1 500 personnes : les ressources sont calculées au plus juste. Le conseil de bord fixe chaque année le nombre de naissances possibles.</p>
        <p><b>Vie quotidienne.</b> Cycles jour-nuit naturels, saisons simulées, parcs, sport à 1 g, fenêtres virtuelles sur l'espace, école, université, musique. Chaque enfant apprend la biologie, la mécanique et l'histoire de la Terre : la survie du vaisseau dépend de tous.</p>
        <p><b>Gouvernance.</b> Une constitution écrite avant le départ, un conseil élu, une justice réparatrice : on ne peut exiler personne.</p>`,
    },
    {
      id: "salles", label: "Salles",
      html: () => `
        ${list([
          ["Pont de commandement", "à l'avant du moyeu : navigation, communication laser avec la Terre."],
          ["Anneau A : la ville", "logements de 30 m² par personne, écoles, hôpital, cantines, place centrale."],
          ["Anneau B : la campagne", "fermes sur trois étages, vergers, aquaponie, parc de 4 hectares avec un lac."],
          ["Moyeu, sans gravité", "laboratoires, observatoire, salle de sport en apesanteur, accès aux anneaux par ascenseurs dans les rayons."],
          ["Abri anti-radiations", "au cœur du réservoir d'eau : tout l'équipage peut s'y réfugier lors des éruptions de Proxima."],
          ["Banque génétique", "semences, embryons et gamètes à −196 °C, en triple exemplaire."],
          ["Archives de la Terre", "toute la connaissance humaine gravée sur cristaux de quartz, lisibles pendant des millénaires."],
          ["Usine et fonderie", "impression 3D, usinage, électronique : on doit tout réparer soi-même."],
          ["Hangar", "6 atterrisseurs et le matériel de la première colonie."],
          ["Salle des machines", "réacteurs, contrôle du moteur, réservoirs de carburant."],
        ])}`,
    },
    {
      id: "defense", label: "Défense",
      html: () => `
        <div class="sd-grid">
          ${tile("Grain de 1 µg", "112 kJ", "≈ 27 g de TNT à 5 % de c")}
          ${tile("Détection", "10 000 km", "0,67 s pour réagir")}
          ${tile("Compartiments", "140", "portes étanches automatiques")}
          ${tile("Dose visée", "< 20 mSv / an", "comme un travailleur du nucléaire")}
        </div>
        <h4>L'ennemi, c'est l'environnement</h4>
        ${list([
          ["La poussière interstellaire", "à 15 000 km/s, chaque grain est un projectile. Un lidar scrute l'avant, des lasers vaporisent les plus gros grains, et un nuage de fines particules projeté 200 km devant absorbe les autres."],
          ["Le bouclier frontal", "multicouche de type Whipple, puis 50 cm de béryllium et de graphite qui s'usent lentement (le principe du projet Daedalus)."],
          ["Les rayons cosmiques", "un champ magnétique supraconducteur dévie les particules chargées ; l'eau et les briques de déchets vitrifiés arrêtent le reste."],
          ["Les fuites et les incendies", "140 compartiments étanches, détection en moins d'une seconde, extinction à l'azote, combinaisons dans chaque pièce."],
          ["Les épidémies", "quarantaine possible de chaque quartier, laboratoire qui fabrique vaccins et médicaments à bord."],
          ["Les pannes", "tout système vital existe en trois exemplaires indépendants."],
        ])}
        <p class="sd-note">Aucune arme offensive : à des années-lumière de tout, la seule défense est de durer.</p>`,
    },
    {
      id: "voyage", label: "Voyage",
      html: () => `
        <div class="sd-timeline">
          <label for="sd-year">Année de voyage : <b id="sd-year-v">40</b></label>
          <input id="sd-year" type="range" min="0" max="${T_END.toFixed(1)}" step="0.1" value="40" />
          <div class="sd-grid" id="sd-state"></div>
        </div>
        <h4>Le plan de vol</h4>
        ${list([
          ["0 à 4 ans : accélération", "0,012 g de poussée continue jusqu'à 5 % de la vitesse de la lumière ; 0,1 année-lumière parcourue."],
          ["4 à 85 ans : croisière", "moteur coupé, le vaisseau file à 15 000 km/s pendant 81 ans."],
          ["85 à 89 ans : freinage", "le vaisseau se retourne et allume son moteur vers l'avant."],
          ["Arrivée", "mise en orbite autour de Proxima b, exploration, puis descente des atterrisseurs. Le vaisseau reste en orbite comme station."],
        ])}
        <h4>Propulsion</h4>
        <p>Un moteur à fusion par impulsions : des capsules de deutérium et d'hélium 3 sont comprimées par des faisceaux et explosent 250 fois par seconde dans une tuyère magnétique. Vitesse d'éjection : 12 000 km/s. Pour gagner puis perdre 5 % de c, il faut 12 fois plus de carburant que de vaisseau. L'hélium 3 serait récolté dans l'atmosphère de Jupiter.</p>
        <p class="sd-note">À cette vitesse, les messages vers la Terre mettent jusqu'à 4,24 ans à arriver. Le décalage relativiste du temps reste minime : 0,1 %.</p>`,
    },
  ];

  let current = "apercu", year = 40, onYear = null;

  function renderState() {
    const el = document.getElementById("sd-state");
    if (!el) return;
    const s = state(year);
    el.innerHTML =
      tile("Phase", s.phase, `génération ${s.gen}`) +
      tile("Vitesse", nf(s.v * 100, 1) + " % c", nf(s.v * 299792, 0) + " km/s") +
      tile("Distance", nf(s.d, 2) + " al", nf(s.frac * 100, 0) + " % du trajet") +
      tile("Population", nf(s.pop), "modèle démographique") +
      tile("Carburant", nf(s.fuel * 100, 0) + " %", "restant") +
      tile("Message vers la Terre", nf(s.d, 2) + " an" + (s.d >= 2 ? "s" : ""), "délai de la lumière");
    const v = document.getElementById("sd-year-v");
    if (v) v.textContent = nf(year, 1);
  }

  function render(root, sectionId) {
    if (sectionId) current = sectionId;
    const sec = SECTIONS.find((s) => s.id === current) || SECTIONS[0];
    root.innerHTML = `
      <div class="sd-tabs" role="tablist">${SECTIONS.map((s) => `<button type="button" role="tab" data-sec="${s.id}" aria-selected="${s.id === sec.id}">${s.label}</button>`).join("")}</div>
      <div class="sd-body">${sec.html()}</div>`;
    root.querySelectorAll(".sd-tabs button").forEach((b) => b.addEventListener("click", () => render(root, b.dataset.sec)));
    const sel = root.querySelector(`.sd-tabs [data-sec="${sec.id}"]`);
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest", inline: "center" });
    const range = root.querySelector("#sd-year");
    if (range) {
      range.value = year;
      range.addEventListener("input", () => { year = +range.value; renderState(); if (onYear) onYear(year); });
      renderState();
    }
  }

  window.Ship = {
    name: "Arche Aurore",
    state, render, sections: SECTIONS,
    get year() { return year; },
    set onYear(fn) { onYear = fn; },
    T_END, DIST,
  };
})();
