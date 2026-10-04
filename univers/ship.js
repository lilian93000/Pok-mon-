/* =========================================================================
   Arche Aurore — version ultime : vaisseau d'une seule génération vers Proxima b.
   Physique plausible (fusion D-He3 allumée à l'antimatière, voile magnétique
   pour freiner) ; ordres de grandeur inspirés du projet Daedalus, des études
   de voile magnétique de Zubrin et Andrews, du système de survie de l'ISS
   et des études de génétique des populations.
   ========================================================================= */
(function () {
  "use strict";
  const DIST = 4.24;               // al jusqu'à Proxima
  const VC = 0.12;                 // vitesse de croisière (fraction de c)
  const TA = 3;                    // années d'accélération (et de freinage)
  const T_CRUISE_END = TA + (DIST - VC * TA) / VC;             // 35,3 ans
  const T_END = T_CRUISE_END + TA;                            // 38,3 ans
  const VE = 0.08;                 // vitesse d'éjection (fraction de c)
  const V_SAIL = 0.05;             // en dessous, le moteur prend le relais de la voile
  const M_DRY = 0.6;               // millions de tonnes
  const M1 = M_DRY * Math.exp(V_SAIL / VE), M0 = M1 * Math.exp(VC / VE);

  function state(t) {
    t = Math.max(0, Math.min(T_END, t));
    let d, v, phase, m, sail = false, engine = false;
    const k = VC / TA / 2;
    if (t < TA) { v = VC * t / TA; d = k * t * t; phase = "Accélération"; m = M0 * Math.exp(-v / VE); engine = true; }
    else if (t < T_CRUISE_END) { v = VC; d = k * TA * TA + VC * (t - TA); phase = "Croisière"; m = M1; }
    else {
      const u = t - T_CRUISE_END;
      v = VC * (1 - u / TA); d = k * TA * TA + VC * (T_CRUISE_END - TA) + VC * u - k * u * u;
      phase = t >= T_END ? "Arrivée" : "Freinage";
      sail = v > V_SAIL && t < T_END; engine = v <= V_SAIL && t < T_END;
      m = v > V_SAIL ? M1 : M_DRY * Math.exp(Math.max(0, v) / VE);
    }
    const pop = Math.round(2000 + 28 * t - 0.15 * t * t);
    const fuel = Math.max(0, (m - M_DRY) / (M0 - M_DRY));
    return { t, d, v, phase, pop, fuel, sail, engine, frac: d / DIST, gen: t < 25 ? 1 : 2 };
  }

  const nf = (v, d = 0) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const tile = (k, v, s) => `<div class="sd-tile"><span class="k">${k}</span><span class="v">${v}</span>${s ? `<span class="s">${s}</span>` : ""}</div>`;
  const list = (items) => `<ul class="sd-list">${items.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join("")}</ul>`;
  const btn = (id, label, primary) => `<button type="button" class="sd-btn${primary ? " primary" : ""}" data-act="${id}">${label}</button>`;

  const AIR_SVG = `
  <svg class="sd-svg" viewBox="0 0 340 210" role="img" aria-label="Cycle de l'oxygène et du dioxyde de carbone à bord">
    <defs><marker id="sd-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>
    <g font-family="IBM Plex Sans, system-ui, sans-serif" font-size="11" text-anchor="middle">
      <rect x="120" y="8" width="100" height="36" rx="8" fill="var(--panel)" stroke="var(--line)"/>
      <text x="170" y="24" fill="var(--ink)">Équipage</text><text x="170" y="37" fill="var(--dim)" font-size="9.5">1,7 t d'O₂/jour</text>
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

  const SHIP_SVG = `
  <svg class="sd-svg" viewBox="0 0 360 130" role="img" aria-label="Coupe du vaisseau de la proue à la poupe">
    <g font-family="IBM Plex Mono, ui-monospace, monospace" font-size="8" fill="var(--dim)" text-anchor="middle">
      <path d="M6 65 L24 18 L24 112 Z" fill="var(--accent)" opacity="0.8"/><text x="16" y="126">bouclier</text>
      <rect x="24" y="61" width="306" height="8" fill="var(--line)"/>
      <ellipse cx="64" cy="65" rx="8" ry="52" fill="none" stroke="var(--field)" stroke-width="2.5"/><text x="64" y="9">anneau A · ville</text>
      <ellipse cx="96" cy="65" rx="8" ry="52" fill="none" stroke="#9fe8a0" stroke-width="2.5"/><text x="104" y="126">anneau B · fermes</text>
      <rect x="120" y="50" width="40" height="30" rx="4" fill="none" stroke="var(--ink)" opacity="0.6"/><text x="140" y="44">eau, abri</text>
      <circle cx="184" cy="50" r="11" fill="none" stroke="var(--ink)" opacity="0.6"/><circle cx="184" cy="80" r="11" fill="none" stroke="var(--ink)" opacity="0.6"/>
      <circle cx="210" cy="50" r="11" fill="none" stroke="var(--ink)" opacity="0.6"/><circle cx="210" cy="80" r="11" fill="none" stroke="var(--ink)" opacity="0.6"/><text x="197" y="104">carburant</text>
      <rect x="234" y="22" width="44" height="6" fill="var(--accent)" opacity="0.5"/><rect x="234" y="102" width="44" height="6" fill="var(--accent)" opacity="0.5"/><text x="256" y="16">radiateurs</text>
      <path d="M330 50 L352 36 L352 94 L330 80 Z" fill="none" stroke="var(--ink)" opacity="0.7"/><text x="340" y="112">moteur</text>
    </g>
  </svg>`;

  const DAY = [
    ["06:00", "Aube", "la ligne de lumière de l'axe s'allume en orange, puis blanchit en 30 minutes."],
    ["07:00", "Petit-déjeuner", "pain du blé de l'anneau B, fruits des vergers, œufs de la ferme avicole."],
    ["08:00", "Travail", "5 heures par jour : fermes, maintenance, médecine, enseignement, recherche."],
    ["13:00", "Déjeuner", "cantines de quartier ou repas en famille."],
    ["14:00", "Formation et loisirs", "université, ateliers, sport à 1 g, natation dans le lac de l'anneau B."],
    ["18:00", "Crépuscule", "la lumière tourne à l'ambre ; les fenêtres s'allument."],
    ["20:00", "Vie sociale", "théâtre, musique, observatoire du moyeu, conseils de quartier."],
    ["22:00", "Nuit", "la ligne de lumière devient bleu nuit, comme un clair de lune."],
  ];

  const SECTIONS = [
    {
      id: "apercu", label: "Aperçu",
      html: () => `
        <p class="sd-lead">La version ultime de l'Arche : un seul voyage de 38 ans. Ceux qui partent verront l'arrivée, avec les enfants nés pendant la traversée.</p>
        <div class="sd-grid">
          ${tile("Équipage au départ", "2 000", "capacité 3 000")}
          ${tile("Durée du voyage", "38 ans", "une seule génération")}
          ${tile("Vitesse de croisière", "12 % de c", "36 000 km/s")}
          ${tile("Longueur", "3,2 km", "anneaux de 800 m")}
          ${tile("Masse au départ", "5,0 Mt", "dont 4,4 Mt de carburant")}
          ${tile("Gravité", "1 g", "anneaux à 1,5 tour/min")}
        </div>
        ${SHIP_SVG}
        <h4>Ce qui la rend « ultime »</h4>
        ${list([
          ["Un voyage dans une vie", "12 % de la vitesse de la lumière grâce à une fusion allumée par de l'antimatière : 38 ans au lieu de 89."],
          ["Freiner sans carburant", "une voile magnétique de 100 km se déploie à l'arrivée et freine sur le gaz interstellaire : elle divise par plus de deux la masse au départ."],
          ["Une gravité confortable", "anneaux de 400 m de rayon tournant lentement (1,5 tour/min) : pas de vertiges en tournant la tête."],
          ["Des éclaireurs", "des sondes à voile laser, parties 20 ans plus tôt, étudient Proxima b et choisissent le site d'atterrissage avant l'arrivée."],
          ["Tout en quatre exemplaires", "air, eau, énergie et commande existent en quatre systèmes indépendants."],
        ])}
        <div class="sd-actions">${btn("visit-A", "Visiter la ville", true)}${btn("visit-B", "Visiter les fermes")}${btn("sim", "Simuler la mission")}</div>
        <p class="sd-note">Concept imaginé à partir d'études réelles. Les chiffres sont des ordres de grandeur cohérents entre eux, pas un plan de construction. L'antimatière nécessaire (quelques dizaines de grammes) dépasse de loin la production actuelle.</p>`,
    },
    {
      id: "vie", label: "Vie à bord",
      html: () => `
        <p class="sd-lead">Sous la gravité des anneaux, le sol remonte devant vous en une immense courbe, jusqu'à passer au-dessus de votre tête. Au centre, une ligne de lumière fait office de soleil.</p>
        <div class="sd-actions">${btn("visit-A", "Visiter la ville (anneau A)", true)}${btn("visit-B", "Visiter les fermes (anneau B)")}${btn("exterior", "Vue extérieure")}</div>
        <h4>Une journée type</h4>
        <ul class="sd-day">${DAY.map(([h, t, d]) => `<li><time>${h}</time><b>${t}</b><span>${d}</span></li>`).join("")}</ul>
        <h4>Les quartiers</h4>
        ${list([
          ["Logements", "40 m² par personne en moyenne, familles regroupées en villages de 200 habitants autour d'une place."],
          ["Écoles et université", "toutes les disciplines ; chaque enfant apprend aussi à réparer, à cultiver et à soigner."],
          ["Parc central", "8 hectares de forêt, un lac de baignade, des collines : le seul endroit où l'on oublie qu'on est dans un vaisseau."],
          ["Observatoire", "au moyeu, en apesanteur : un dôme ouvert sur les étoiles qui défilent… très lentement."],
        ])}`,
    },
    {
      id: "air", label: "Air",
      html: () => `
        <div class="sd-grid">
          ${tile("Oxygène consommé", "1,7 t / jour", "0,84 kg par personne")}
          ${tile("Volume pressurisé", "15 M m³", "15 000 fois l'ISS")}
          ${tile("Atmosphère", "101 kPa", "21 % O₂, 78 % N₂")}
          ${tile("Réserve d'urgence", "1 an", "oxygène liquide")}
        </div>
        ${AIR_SVG}
        <p><b>Les plantes d'abord.</b> Les 150 000 m² de cultures fournissent l'essentiel de l'oxygène ; des photobioréacteurs à spiruline servent de tampon rapide.</p>
        <p><b>Les machines ensuite.</b> Le CO₂ est capté par des zéolithes, comme sur l'ISS ; un réacteur de Sabatier (CO₂ + 4 H₂ → CH₄ + 2 H₂O) récupère l'eau, puis l'électrolyse la coupe en oxygène et hydrogène (environ 450 kW pour 1,7 t d'O₂ par jour).</p>
        <p><b>La sécurité.</b> Quatre boucles indépendantes, CO₂ maintenu sous 0,1 %, 50 000 capteurs d'air surveillés en continu par l'IA de bord.</p>`,
    },
    {
      id: "eau", label: "Eau",
      html: () => `
        <div class="sd-grid">
          ${tile("Usage", "50 L", "par personne et par jour")}
          ${tile("Recyclage", "99 %", "l'ISS atteint 98 %")}
          ${tile("Pertes", "1 m³ / jour", "14 000 m³ en 38 ans")}
          ${tile("Réservoir", "150 000 m³", "3 m d'épaisseur de blindage")}
        </div>
        ${list([
          ["Urine", "distillation par compression de vapeur ; l'azote devient de l'engrais."],
          ["Eaux grises", "filtration, bioréacteurs bactériens, osmose inverse, lampes UV."],
          ["Humidité de l'air", "transpiration et respiration de 2 000 personnes et des plantes, condensées."],
          ["Contrôle", "chaque litre analysé avant de revenir au robinet ; deux circuits séparés pour boire et pour les cultures."],
        ])}
        <p>Le réservoir entoure l'abri anti-radiations : trois mètres d'eau arrêtent l'essentiel des rayons cosmiques.</p>`,
    },
    {
      id: "nourriture", label: "Nourriture",
      html: () => `
        <div class="sd-grid">
          ${tile("Énergie", "2 500 kcal", "par personne et par jour")}
          ${tile("Cultures", "150 000 m²", "75 m² par personne")}
          ${tile("Éclairage", "60 MW", "LED à spectre réglé")}
          ${tile("Réserve", "3 ans", "aliments lyophilisés")}
        </div>
        ${list([
          ["Hydroponie et aéroponie", "blé, riz, soja, pommes de terre, légumineuses, légumes, sur trois étages."],
          ["Vergers", "agrumes, pommiers, figuiers, vigne : récolte toute l'année."],
          ["Spiruline et algues", "20 % des protéines, croissance dix fois plus rapide que les cultures."],
          ["Aquaponie et basse-cour", "poissons, crevettes, poules naines : leurs déchets fertilisent les plantes."],
          ["Insectes", "grillons et vers de farine, protéines complètes."],
          ["Viande et lait cultivés", "bioréacteurs à cellules et fermentation de précision."],
        ])}
        <p>Fermes réparties en 60 compartiments étanches : une maladie ne peut jamais toucher plus de 2 % des récoltes. Banque de 100 000 variétés de semences.</p>`,
    },
    {
      id: "dechets", label: "Déchets",
      html: () => `
        <div class="sd-grid">
          ${tile("Déchets", "≈ 3,3 t / jour", "hors eau")}
          ${tile("Recyclage", "98 %", "de la masse")}
          ${tile("Biogaz", "méthane", "carburant de secours")}
          ${tile("Résidu ultime", "verre", "briques de blindage")}
        </div>
        ${list([
          ["Déchets humains", "digesteurs anaérobies (biogaz), puis compostage : engrais sûr pour les fermes."],
          ["Restes de cultures", "nourrissent champignons et insectes, puis le compost."],
          ["Plastiques", "triés, fondus en filaments pour les imprimantes 3D, ou pyrolysés."],
          ["Métaux et électronique", "refondus et raffinés à la fonderie de bord."],
          ["Le reste", "oxydé à 650 °C dans de l'eau supercritique, puis vitrifié en briques de blindage."],
        ])}
        <p>Les défunts reçoivent des funérailles par compostage humain dans le jardin du souvenir : chaque atome retourne à la vie du vaisseau.</p>`,
    },
    {
      id: "energie", label: "Énergie",
      html: () => `
        <div class="sd-grid">
          ${tile("Réacteurs de bord", "3 × 600 MW", "fusion D-He3")}
          ${tile("Propulsion", "≈ 12 PW", "en pleine poussée")}
          ${tile("Radiateurs", "2 km²", "évacuent la chaleur")}
          ${tile("Secours", "30 jours", "batteries et piles")}
        </div>
        <p>Trois réacteurs de fusion deutérium-hélium 3 alimentent la vie à bord ; deux suffisent. La réaction produit peu de neutrons, donc peu de radioactivité.</p>
        <p>Dans le vide, le plus dur est de se débarrasser de la chaleur : d'immenses radiateurs rougeoyants la rayonnent vers les étoiles.</p>`,
    },
    {
      id: "medecine", label: "Médecine",
      html: () => `
        <div class="sd-grid">
          ${tile("Hôpital", "150 lits", "dont 20 en soins intensifs")}
          ${tile("Soignants", "120", "médecins, infirmiers, dentistes")}
          ${tile("Pharmacie", "à la demande", "synthèse et bioréacteurs")}
          ${tile("Torpeur médicale", "8 caissons", "hypothermie thérapeutique")}
        </div>
        ${list([
          ["Diagnostic", "imagerie IRM et scanner, laboratoire complet, séquençage génétique, aide au diagnostic par l'IA."],
          ["Chirurgie", "deux blocs avec robots chirurgicaux ; chaque chirurgien forme deux successeurs."],
          ["Médicaments", "insuline, antibiotiques, vaccins et anticancéreux produits par des levures et bactéries modifiées."],
          ["Torpeur", "en cas d'urgence, refroidir un patient à 32 °C ralentit son métabolisme le temps d'opérer (technique déjà utilisée à l'hôpital)."],
          ["Santé mentale", "psychologues, lumière naturelle simulée, intimité garantie, médiation des conflits."],
          ["Santé des os", "la gravité de 1 g évite la fonte osseuse et musculaire des astronautes."],
        ])}`,
    },
    {
      id: "ia", label: "IA de bord",
      html: () => `
        <div class="sd-grid">
          ${tile("Nom", "VIGIE", "intelligence de bord")}
          ${tile("Capteurs", "2 millions", "air, eau, coque, cultures")}
          ${tile("Cœurs", "3", "isolés, qui votent")}
          ${tile("Pouvoir", "conseil", "jamais de décision vitale seule")}
        </div>
        ${list([
          ["Surveillance", "détecte une fuite, une maladie des plantes ou une surchauffe avant qu'un humain ne la remarque."],
          ["Trois cœurs qui votent", "trois ordinateurs indépendants, fabriqués différemment ; deux doivent être d'accord pour agir."],
          ["Garde-fous", "VIGIE propose, les humains décident : elle ne peut ni ouvrir un sas, ni changer la route, ni rationner sans le conseil."],
          ["Mémoire", "toute la connaissance humaine, et des tuteurs pour chaque élève."],
          ["Mode dégradé", "en cas de panne totale, chaque système vital fonctionne à la main ; des exercices sont faits chaque mois."],
        ])}`,
    },
    {
      id: "equipage", label: "Équipage",
      html: () => `
        <div class="sd-grid">
          ${tile("Au départ", "2 000", "20 à 45 ans, parité")}
          ${tile("À l'arrivée", "≈ 2 850", "dont 1 000 nés à bord")}
          ${tile("Banque génétique", "10 000", "embryons congelés")}
          ${tile("Travail", "25 h / sem.", "rotation des métiers")}
        </div>
        <p><b>Génétique.</b> Une étude de 2018 (Marin et Beluffi) estime qu'une centaine de personnes suffit à éviter la consanguinité ; l'Arche part avec 2 000, plus des gamètes de 50 000 donneurs.</p>
        <p><b>Une seule génération.</b> La plupart des voyageurs ont entre 58 et 83 ans à l'arrivée ; leurs enfants, nés à bord, auront entre 0 et 35 ans et mèneront la colonisation.</p>
        <p><b>Gouvernance.</b> Constitution écrite avant le départ, conseil élu tous les 4 ans, référendum pour les grandes décisions, justice réparatrice.</p>`,
    },
    {
      id: "salles", label: "Salles",
      html: () => `
        ${list([
          ["Pont de commandement", "à l'avant : navigation, communication laser avec la Terre."],
          ["Anneau A : la ville", "logements, écoles, université, hôpital, théâtre, cantines."],
          ["Anneau B : la campagne", "fermes sur trois étages, vergers, aquaponie, parc de 8 hectares avec un lac."],
          ["Moyeu, sans gravité", "laboratoires, observatoire, sport en apesanteur, ascenseurs vers les anneaux."],
          ["Abri anti-radiations", "au cœur du réservoir d'eau : tout l'équipage y tient pendant les éruptions de Proxima."],
          ["Banque génétique", "semences, embryons et gamètes à −196 °C, en triple exemplaire."],
          ["Archives de la Terre", "connaissance, art et musique de l'humanité, gravés sur cristaux de quartz."],
          ["Usine et fonderie", "impression 3D, usinage, électronique : tout se répare à bord."],
          ["Hangar", "8 atterrisseurs et le matériel de la première colonie."],
          ["Salle des machines", "réacteurs, contrôle du moteur, réservoirs, voile magnétique repliée."],
        ])}`,
    },
    {
      id: "defense", label: "Défense",
      html: () => `
        <div class="sd-grid">
          ${tile("Grain de 1 µg", "650 kJ", "≈ 155 g de TNT à 12 % de c")}
          ${tile("Détection", "30 000 km", "0,8 s pour réagir")}
          ${tile("Compartiments", "300", "portes étanches automatiques")}
          ${tile("Dose visée", "< 10 mSv / an", "moitié d'un travailleur du nucléaire")}
        </div>
        ${list([
          ["Poussière interstellaire", "un lidar scrute 30 000 km devant ; des lasers vaporisent les grains ; un nuage de fines particules projeté à 500 km devant absorbe le reste."],
          ["Bouclier frontal", "plus large que les anneaux, qui restent dans son ombre : plaques Whipple espacées, puis un mètre de béryllium et de graphite qui s'usent lentement."],
          ["Rayons cosmiques", "bouclier magnétique supraconducteur, 3 m d'eau et briques de déchets vitrifiés."],
          ["Fuites et incendies", "300 compartiments, détection en moins d'une seconde, extinction à l'azote."],
          ["Épidémies", "quarantaine par quartier, vaccins synthétisés à bord en quelques semaines."],
          ["Pannes", "quatre systèmes vitaux indépendants, pièces fabriquées à bord."],
        ])}
        <p class="sd-note">Aucune arme offensive : à des années-lumière de tout, la seule défense est de durer.</p>`,
    },
    {
      id: "crises", label: "Crises",
      html: () => `
        <p>Chaque crise a son protocole, répété chaque année en exercice.</p>
        ${list([
          ["Dépressurisation", "les portes du compartiment se ferment en 2 s ; masques à chaque mur ; robots de colmatage en 10 min."],
          ["Incendie", "noyage à l'azote du compartiment ; les habitants passent dans le voisin par des sas."],
          ["Épidémie", "isolement du quartier, séquençage du pathogène en 24 h, vaccin en 3 à 6 semaines."],
          ["Perte de récoltes", "trois ans de réserves ; replantation depuis la banque de semences ; rationnement décidé par le conseil."],
          ["Panne de réacteur", "les deux autres prennent le relais ; on réduit l'éclairage des fermes non essentielles."],
          ["Éruption de Proxima", "à l'approche, tout le monde rejoint l'abri du réservoir pendant les alertes."],
          ["Défaillance de l'IA", "les trois cœurs se surveillent ; passage en commande manuelle."],
          ["Crise sociale", "médiation, référendum, droit de retrait dans un autre quartier : on ne peut exiler personne."],
        ])}
        <div class="sd-actions">${btn("sim", "Affronter ces crises dans le simulateur", true)}</div>`,
    },
    {
      id: "voyage", label: "Voyage",
      html: () => `
        <div class="sd-timeline">
          <label for="sd-year">Année de voyage : <b id="sd-year-v">20</b></label>
          <input id="sd-year" type="range" min="0" max="${T_END.toFixed(2)}" step="0.05" value="20" />
          <div class="sd-grid" id="sd-state"></div>
        </div>
        ${list([
          ["0 à 3 ans : accélération", "0,04 g de poussée, jusqu'à 12 % de la vitesse de la lumière ; 0,18 année-lumière parcourue."],
          ["3 à 35 ans : croisière", "moteur coupé ; 32 ans à 36 000 km/s."],
          ["35 à 38 ans : freinage", "la voile magnétique de 100 km se déploie et freine sur le gaz interstellaire jusqu'à 5 % de c ; le moteur fait le reste."],
          ["Arrivée", "mise en orbite autour de Proxima b."],
        ])}
        <h4>Propulsion</h4>
        <p>Fusion par impulsions : des capsules de deutérium et d'hélium 3 sont allumées par une infime dose d'antiprotons, 250 fois par seconde, dans une tuyère magnétique. Vitesse d'éjection : 24 000 km/s.</p>
        <p class="sd-note">Relativité : à 12 % de c, le temps à bord passe 0,7 % moins vite. Les voyageurs vieillissent environ 3 mois de moins que leurs proches restés sur Terre.</p>
        <div class="sd-actions">${btn("sim", "Simuler la mission", true)}</div>`,
    },
    {
      id: "colonie", label: "Colonisation",
      html: () => `
        <div class="sd-grid">
          ${tile("Planète", "Proxima b", "1,07 masse terrestre")}
          ${tile("Année", "11,2 jours", "rotation probablement synchrone")}
          ${tile("Première base", "200 pers.", "an 1 après l'arrivée")}
          ${tile("Atterrisseurs", "8", "réutilisables")}
        </div>
        ${list([
          ["Avant l'arrivée", "des sondes à voile laser (type Breakthrough Starshot), parties 20 ans plus tôt, ont cartographié la planète."],
          ["Mois 0 à 6", "mise en orbite, cartographie détaillée, recherche d'eau et d'un site abrité."],
          ["Site choisi", "la zone crépusculaire entre face jour et face nuit : ni brûlante, ni gelée."],
          ["Année 1", "habitats enterrés sous 3 m de régolithe contre les éruptions de Proxima, premières serres, extraction d'eau."],
          ["Années 2 à 10", "fonderie au sol, production d'oxygène et de carburant, descente progressive de toute la population."],
          ["Le vaisseau", "il reste en orbite comme station, chantier et refuge."],
        ])}
        <p class="sd-note">On ne sait pas encore si Proxima b a une atmosphère : la colonie est conçue pour survivre même sans.</p>`,
    },
  ];

  let current = "apercu", year = 20, onYear = null, onAction = null;

  function renderState() {
    const el = document.getElementById("sd-state");
    if (!el) return;
    const s = state(year);
    el.innerHTML =
      tile("Phase", s.phase, s.sail ? "voile magnétique déployée" : s.engine ? "moteur allumé" : "moteur coupé") +
      tile("Vitesse", nf(s.v * 100, 1) + " % c", nf(s.v * 299792, 0) + " km/s") +
      tile("Distance", nf(s.d, 2) + " al", nf(s.frac * 100, 0) + " % du trajet") +
      tile("Population", nf(s.pop), "modèle démographique") +
      tile("Carburant", nf(s.fuel * 100, 0) + " %", "restant") +
      tile("Message vers la Terre", nf(s.d, 2) + " an" + (s.d >= 2 ? "s" : ""), "délai de la lumière");
    const v = document.getElementById("sd-year-v");
    if (v) v.textContent = nf(year, 1);
  }

  function setYear(t) {
    year = Math.max(0, Math.min(T_END, t));
    const r = document.getElementById("sd-year");
    if (r) r.value = year;
    renderState();
    if (onYear) onYear(year);
  }

  function render(root, sectionId) {
    if (sectionId) current = sectionId;
    const sec = SECTIONS.find((s) => s.id === current) || SECTIONS[0];
    root.innerHTML = `
      <div class="sd-tabs" role="tablist">${SECTIONS.map((s) => `<button type="button" role="tab" data-sec="${s.id}" aria-selected="${s.id === sec.id}">${s.label}</button>`).join("")}</div>
      <div class="sd-body">${sec.html()}</div>`;
    root.querySelectorAll(".sd-tabs button").forEach((b) => b.addEventListener("click", () => render(root, b.dataset.sec)));
    root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => onAction && onAction(b.dataset.act)));
    const sel = root.querySelector(`.sd-tabs [data-sec="${sec.id}"]`);
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest", inline: "center" });
    const range = root.querySelector("#sd-year");
    if (range) {
      range.value = year;
      range.addEventListener("input", () => setYear(+range.value));
      renderState();
    }
  }

  window.Ship = {
    name: "Arche Aurore",
    state, render, setYear, sections: SECTIONS,
    get year() { return year; },
    set onYear(fn) { onYear = fn; },
    set onAction(fn) { onAction = fn; },
    T_END, DIST, VC,
  };
})();
