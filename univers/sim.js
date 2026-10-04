/* =========================================================================
   Simulateur de mission de l'Arche Aurore : 38 ans, année par année.
   Chaque décision modifie la population, le moral, les réserves et la coque.
   ========================================================================= */
(function () {
  "use strict";
  const root = document.getElementById("sim");
  if (!root || !window.Ship) return;
  const S = window.Ship;
  const nf = (v, d = 0) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: d, minimumFractionDigits: d }).format(v);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Événements : y = année fixe (sinon tirage aléatoire), once = une seule fois
  // effets : pop, moral, food (années de réserve), water (milliers de m³), air (jours de réserve), hull (%)
  const EVENTS = [
    { y: 0, title: "Départ", text: "Les 2 000 passagers regardent la Terre rapetisser depuis l'observatoire. Le moteur s'allume : 0,04 g, à peine perceptible.", choices: [
      { label: "Fête de départ dans les deux anneaux", fx: { moral: 6 }, out: "Une nuit de musique sous la ligne de lumière. Le voyage commence dans la joie." },
      { label: "Exercice de crise dès le premier jour", fx: { moral: -2, hull: 2 }, out: "L'équipage connaît désormais chaque sas par cœur." } ] },
    { y: 3, title: "Fin de l'accélération", text: "Le moteur se coupe : 12 % de la vitesse de la lumière. La croisière de 32 ans commence. Que faire de la salle des machines, désormais silencieuse ?", choices: [
      { label: "La transformer en ateliers et en école d'ingénieurs", fx: { moral: 4 }, out: "Une génération d'ingénieurs se forme sur les machines mêmes du voyage." },
      { label: "La garder sous scellés, prête au freinage", fx: { hull: 3 }, out: "Tout restera exactement en état pour le freinage." } ] },
    { y: 4.5, title: "Premier message de la Terre", text: "Parti il y a des années, un message arrive enfin : la Terre prépare une seconde Arche et salue l'équipage.", choices: [
      { label: "Le diffuser dans tout le vaisseau", fx: { moral: 8 }, out: "Des larmes et des applaudissements sur les places des villages." },
      { label: "Répondre avec un concert enregistré", fx: { moral: 6 }, out: "Il mettra plus de quatre ans à arriver, mais tout le monde a chanté." } ] },
    { y: 12, title: "Le 300ᵉ enfant", text: "Une petite fille naît dans l'anneau A : le 300ᵉ enfant du vaisseau. Le conseil doit fixer la politique de naissances pour les dix ans à venir.", choices: [
      { label: "Encourager les naissances", fx: { pop: 120, moral: 5, food: -0.3 }, out: "Les écoles s'agrandissent. Les fermes devront suivre." },
      { label: "Maintenir le rythme actuel", fx: { pop: 40 }, out: "Équilibre prudent entre ressources et avenir." },
      { label: "Limiter strictement", fx: { pop: -10, moral: -8, food: 0.2 }, out: "Les réserves sont sûres, mais la décision divise." } ] },
    { y: 22, title: "Les sondes éclaireuses", text: "Les données des sondes à voile laser arrivent : Proxima b possède de la glace d'eau dans la zone crépusculaire, et peut-être une fine atmosphère.", choices: [
      { label: "Viser la zone crépusculaire près de la glace", fx: { moral: 8 }, out: "Le site d'atterrissage est choisi. Les enfants le dessinent partout." },
      { label: "Attendre d'autres données", fx: { moral: 2 }, out: "Prudence : la décision sera prise en orbite." } ] },
    { y: 35.4, title: "Déploiement de la voile magnétique", text: "Il faut dérouler 100 km de câble supraconducteur. Une bobine résiste.", choices: [
      { label: "Sortie dans l'espace pour la débloquer", fx: { hull: -2, moral: 4, pop: -1 }, out: "Réussite, mais un ingénieur n'est pas revenu. Le vaisseau entier lui rend hommage." },
      { label: "Laisser les robots travailler, quitte à freiner plus au moteur", fx: { moral: -2 }, out: "Trois semaines de retard et un peu plus de carburant brûlé, mais personne n'a été mis en danger." } ] },
    { y: 38.3, end: true },

    { title: "Micrométéorite", text: "Un grain a échappé aux lasers et percé l'anneau B. Un compartiment de fermes se vide de son air.", choices: [
      { label: "Sceller et réparer en sortie extravéhiculaire", fx: { hull: -3, moral: 2 }, out: "Réparé en six heures par une équipe héroïque." },
      { label: "Évacuer le secteur et laisser les robots réparer", fx: { hull: -5, food: -0.2 }, out: "Les cultures du secteur sont perdues, mais l'équipe est en sécurité." } ] },
    { title: "Maladie des plantes", text: "Un champignon attaque le blé dans trois compartiments de l'anneau B.", choices: [
      { label: "Quarantaine et brûlage des cultures touchées", fx: { food: -0.3, moral: -2 }, out: "La maladie est stoppée net." },
      { label: "Traitement biologique, plus lent", fx: { food: -0.15, moral: 1 }, out: "Des bactéries alliées repoussent le champignon en un mois." } ] },
    { title: "Panne d'un réacteur", text: "Le réacteur 2 s'arrête d'urgence après une fuite magnétique.", choices: [
      { label: "Réduire l'éclairage des fermes et réparer posément", fx: { food: -0.2 }, out: "Un mois de récoltes plus maigres, réacteur réparé." },
      { label: "Réparer en urgence à pleine charge", fx: { hull: -4, moral: 2 }, out: "Réparé en quatre jours, mais la coque du module a souffert." } ] },
    { title: "Épidémie", text: "Un virus de la grippe a muté dans l'anneau A. Quarante malades en trois jours.", choices: [
      { label: "Quarantaine stricte du quartier", fx: { moral: -5, pop: -2 }, out: "L'épidémie s'éteint en trois semaines." },
      { label: "Vaccin synthétisé en urgence, vie normale", fx: { moral: -1, pop: -6 }, out: "Le vaccin arrive en cinq semaines ; quelques personnes âgées n'ont pas survécu." } ] },
    { title: "Ceux qui veulent rentrer", text: "Un groupe réclame de faire demi-tour. C'est physiquement impossible, mais la colère monte.", choices: [
      { label: "Débat public et référendum sur la vie à bord", fx: { moral: 4 }, out: "Le vote rassemble : on améliore les quartiers, la colère retombe." },
      { label: "Ignorer la contestation", fx: { moral: -10 }, out: "Le malaise s'installe pour des années." } ] },
    { title: "Défaillance de VIGIE", text: "Un des trois cœurs de l'IA donne des résultats différents des deux autres.", choices: [
      { label: "L'isoler et le reconstruire", fx: { hull: 1 }, out: "Les deux autres cœurs assurent l'intérim pendant deux mois." },
      { label: "Installer une mise à jour expérimentale", fx: { hull: -3, moral: -2 }, out: "Le bug revient trois fois avant d'être corrigé." } ] },
    { title: "Fuite au réservoir", text: "Une soudure du réservoir d'eau suinte : 200 m³ par jour.", choices: [
      { label: "Rationner l'eau pendant la réparation", fx: { water: -2, moral: -3 }, out: "Douches de deux minutes pendant un mois." },
      { label: "Réparer sous pression avec des plongeurs", fx: { water: -4, moral: 1 }, out: "Spectaculaire et réussi, mais il a fallu tout un mois de pertes." } ] },
    { title: "Nuage de poussière", text: "Le lidar détecte une région plus dense en poussière droit devant.", choices: [
      { label: "Lasers à pleine puissance pendant six mois", fx: { hull: -1, food: -0.1 }, out: "L'énergie des lasers a été prise sur les fermes, mais le bouclier a tenu." },
      { label: "Traverser en comptant sur le bouclier", fx: { hull: -6 }, out: "Le bouclier frontal s'est usé plus que prévu." } ] },
    { title: "Fatigue des ingénieurs", text: "L'équipe de maintenance est épuisée ; les erreurs se multiplient.", choices: [
      { label: "Former 100 jeunes et réduire les horaires", fx: { moral: 4, food: -0.05 }, out: "Une relève solide arrive en deux ans." },
      { label: "Heures supplémentaires obligatoires", fx: { moral: -6, hull: 2 }, out: "Le travail est fait, mais au prix de la santé de l'équipe." } ] },
    { title: "Planète vagabonde", text: "Les télescopes repèrent une planète errante à 0,3 année-lumière de la route.", choices: [
      { label: "Larguer une petite sonde pour l'étudier", fx: { moral: 5, hull: -1 }, out: "Ses images feront le tour du vaisseau… et de la Terre, quatre ans plus tard." },
      { label: "Observer seulement au télescope", fx: { moral: 2 }, out: "Une belle découverte, sans risque." } ] },
    { title: "Saison des fêtes", text: "Les quartiers proposent de créer une fête annuelle propre au vaisseau.", choices: [
      { label: "La « Nuit des étoiles », au moyeu", fx: { moral: 7, food: -0.05 }, out: "Une nouvelle tradition est née, la première d'une nouvelle culture." },
      { label: "Garder les fêtes de la Terre", fx: { moral: 3 }, out: "Le lien avec les origines reste vivant." } ] },
    { title: "Récolte record", text: "Une variété de riz sélectionnée à bord donne 30 % de plus.", choices: [
      { label: "Étendre les réserves", fx: { food: 0.4 }, out: "Les silos se remplissent." },
      { label: "Banquet pour tout le vaisseau", fx: { food: 0.15, moral: 6 }, out: "On parlera longtemps de ce banquet." } ] },
  ];

  let st = null, timer = 0, auto = false;

  function reset() {
    st = { t: 0, pop: 2000, moral: 75, food: 3, water: 150, air: 365, hull: 100, log: [], seen: new Set(), pending: null, done: false, deaths: 0 };
    S.setYear(0);
    trigger(EVENTS.find((e) => e.y === 0));
    render();
  }
  function trigger(ev) {
    st.pending = ev;
    if (ev.y !== undefined) st.seen.add(ev);
  }
  function apply(fx) {
    for (const k in fx) st[k] += fx[k];
    st.moral = clamp(st.moral, 0, 100); st.hull = clamp(st.hull, 0, 100);
    st.food = Math.max(0, st.food); st.water = Math.max(0, st.water);
  }
  function choose(i) {
    const ev = st.pending, c = ev.choices[i];
    apply(c.fx);
    st.log.unshift({ t: st.t, title: ev.title, text: c.out });
    st.pending = null;
    check();
    render();
    if (auto && !st.done) timer = setTimeout(step, 900);
  }
  function step() {
    if (!st || st.pending || st.done) return;
    const t0 = st.t, t1 = Math.min(S.T_END, t0 + 1);
    // une année de fonctionnement normal
    st.t = t1;
    S.setYear(st.t);
    const births = Math.round(st.pop * (st.pop > 2800 ? 0.006 : 0.012) * (st.moral / 75)), deaths = Math.round(st.pop * 0.004 + (st.t > 25 ? st.pop * 0.004 : 0));
    st.pop += births - deaths; st.deaths += deaths;
    st.water -= 0.37;                        // ≈ 1 m³ par jour de pertes
    st.food += 0.05 - (st.pop - 2000) * 0.00004;
    st.hull = clamp(st.hull - 0.4, 0, 100);  // usure
    st.moral = clamp(st.moral + (st.moral < 60 ? 1 : -0.5), 0, 100);
    // événement fixe dans l'intervalle ?
    const fixed = EVENTS.find((e) => e.y !== undefined && !st.seen.has(e) && e.y > t0 && e.y <= t1 + 1e-9);
    if (fixed) {
      if (fixed.end) { st.seen.add(fixed); finish(); render(); return; }
      trigger(fixed);
    } else if (Math.random() < 0.42) {
      const pool = EVENTS.filter((e) => e.y === undefined && (!st.seen.has(e) || Math.random() < 0.25));
      const ev = pool[(Math.random() * pool.length) | 0];
      st.seen.add(ev);
      trigger(ev);
    } else {
      st.log.unshift({ t: st.t, title: "Année calme", text: `${births} naissances, ${deaths} décès. ${S.state(st.t).phase === "Croisière" ? "Le vaisseau file à 36 000 km/s." : S.state(st.t).phase + " en cours."}` });
    }
    check();
    render();
    if (auto && !st.pending && !st.done) timer = setTimeout(step, 700);
  }
  function check() {
    if (st.done) return;
    if (st.hull <= 15 || st.moral <= 5 || st.food <= 0 || st.water <= 10) {
      st.done = true;
      st.fail = st.hull <= 15 ? "La coque n'a pas tenu." : st.moral <= 5 ? "La société du vaisseau s'est effondrée." : st.food <= 0 ? "Les réserves de nourriture sont épuisées." : "Il n'y a plus assez d'eau.";
      auto = false;
    }
    if (!st.done && st.t >= S.T_END - 1e-6) finish();
  }
  function finish() {
    st.t = S.T_END; S.setYear(st.t);
    st.done = true; auto = false;
  }
  function grade() {
    const sc = st.moral * 0.4 + st.hull * 0.3 + Math.min(3, st.food) * 10;
    if (sc > 85) return "Arrivée triomphale : une colonie prospère commence.";
    if (sc > 65) return "Arrivée réussie : la colonisation peut commencer.";
    return "Arrivée difficile : l'équipage est épuisé, mais vivant.";
  }

  const meter = (k, v, max, unit, warn) => {
    const p = clamp(v / max, 0, 1);
    return `<div class="sim-m${p < warn ? " low" : ""}"><span class="k">${k}</span><span class="v">${unit(v)}</span><i style="--p:${(p * 100).toFixed(1)}%"></i></div>`;
  };

  function render() {
    const s = S.state(st.t);
    const ev = st.pending;
    root.innerHTML = `
      <div class="sim-head">
        <div><span class="sim-k">Simulateur de mission · Arche Aurore</span>
        <h3>Année ${nf(st.t, 1)} <small>· ${s.phase} · ${nf(s.v * 100, 1)} % c · ${nf(s.d, 2)} al</small></h3></div>
        <button type="button" class="sim-x" id="sim-close" aria-label="Fermer le simulateur">×</button>
      </div>
      <div class="sim-bar"><i style="width:${(s.frac * 100).toFixed(1)}%"></i><span>Terre</span><span>Proxima b</span></div>
      <div class="sim-meters">
        ${meter("Population", st.pop, 3000, (v) => nf(v), 0.4)}
        ${meter("Moral", st.moral, 100, (v) => nf(v) + " %", 0.35)}
        ${meter("Nourriture", st.food, 3, (v) => nf(v, 1) + " an" + (v >= 2 ? "s" : ""), 0.3)}
        ${meter("Eau", st.water, 150, (v) => nf(v * 1000) + " m³", 0.3)}
        ${meter("Coque", st.hull, 100, (v) => nf(v) + " %", 0.4)}
        ${meter("Carburant", s.fuel, 1, (v) => nf(v * 100) + " %", 0.03)}
      </div>
      ${ev ? `
        <div class="sim-card">
          <span class="sim-k">${ev.y !== undefined ? "Étape de la mission" : "Événement"}</span>
          <h4>${ev.title}</h4><p>${ev.text}</p>
          <div class="sim-choices">${ev.choices.map((c, i) => `<button type="button" data-c="${i}">${c.label}</button>`).join("")}</div>
        </div>` : st.done ? `
        <div class="sim-card ${st.fail ? "fail" : "win"}">
          <span class="sim-k">${st.fail ? "Mission compromise" : "Arrivée à Proxima b"}</span>
          <h4>${st.fail ? st.fail : grade()}</h4>
          <p>${st.fail ? `Année ${nf(st.t, 1)}. Recommencez et essayez d'autres décisions.` : `${nf(st.pop)} personnes arrivent après ${nf(S.T_END, 1)} ans, dont environ ${nf(Math.max(0, st.pop - 2000 + st.deaths))} nées à bord. Moral ${nf(st.moral)} %, coque ${nf(st.hull)} %.`}</p>
        </div>` : ""}
      <div class="sim-ctl">
        <button type="button" id="sim-step" ${ev || st.done ? "disabled" : ""}>Avancer d'un an</button>
        <button type="button" id="sim-auto" ${ev || st.done ? "disabled" : ""}>${auto ? "Pause" : "Lecture automatique"}</button>
        <button type="button" id="sim-reset">Recommencer</button>
      </div>
      <ol class="sim-log">${st.log.slice(0, 8).map((l) => `<li><time>an ${nf(l.t, 1)}</time><b>${l.title}</b> ${l.text}</li>`).join("")}</ol>`;
    root.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => choose(+b.dataset.c)));
    root.querySelector("#sim-step").addEventListener("click", () => { auto = false; step(); });
    root.querySelector("#sim-auto").addEventListener("click", () => { auto = !auto; clearTimeout(timer); if (auto) step(); else render(); });
    root.querySelector("#sim-reset").addEventListener("click", () => { clearTimeout(timer); auto = false; reset(); });
    root.querySelector("#sim-close").addEventListener("click", close);
  }

  function open() {
    root.hidden = false;
    document.body.classList.add("simming");
    if (!st || st.done) reset(); else render();
  }
  function close() {
    clearTimeout(timer); auto = false;
    root.hidden = true;
    document.body.classList.remove("simming");
  }
  window.ShipSim = { open, close, isOpen: () => !root.hidden };
})();
