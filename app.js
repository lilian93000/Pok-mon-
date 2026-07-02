/* ============================================================
   Walaxy — logique de l'application (SPA sans dépendance)
   ============================================================ */

/* ---------- État ---------- */

const CLE_STOCKAGE = "walaxy-state-v1";

function chargerEtat() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (brut) return JSON.parse(brut);
  } catch (e) { /* stockage indisponible ou corrompu : on repart du seed */ }
  return JSON.parse(JSON.stringify(SEED));
}

function sauverEtat() {
  try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat)); } catch (e) { /* mode privé */ }
}

let etat = chargerEtat();

/* ---------- Utilitaires ---------- */

const $ = (sel, racine = document) => racine.querySelector(sel);
const $$ = (sel, racine = document) => [...racine.querySelectorAll(sel)];

function echap(txt) {
  return String(txt).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function initiales(p) { return (p.prenom[0] + p.nom[0]).toUpperCase(); }
function nomComplet(p) { return `${p.prenom} ${p.nom}`; }
function prospectParId(id) { return etat.prospects.find(p => p.id === id); }
function campagneParId(id) { return etat.campagnes.find(c => c.id === id); }
function sequenceParId(id) { return etat.sequences.find(s => s.id === id); }

function pct(part, total) { return total ? Math.round((part / total) * 100) : 0; }

function toast(message) {
  const zone = $("#toasts");
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = message;
  zone.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ---------- Modale ---------- */

function ouvrirModale(html) {
  $("#modal").innerHTML = html;
  $("#modal-backdrop").hidden = false;
}
function fermerModale() {
  $("#modal-backdrop").hidden = true;
  $("#modal").innerHTML = "";
}
$("#modal-backdrop").addEventListener("click", e => {
  if (e.target === e.currentTarget) fermerModale();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") fermerModale();
});

/* ---------- Badges de navigation ---------- */

function majBadges() {
  const nonLus = etat.conversations.filter(c => c.nonLu).length;
  const badgeInbox = $("#badge-inbox");
  badgeInbox.textContent = nonLus;
  badgeInbox.classList.toggle("visible", nonLus > 0);

  const badgeFile = $("#badge-queue");
  badgeFile.textContent = etat.file.length;
  badgeFile.classList.toggle("visible", etat.file.length > 0);
}

/* ============================================================
   Graphique d'activité (SVG construit à la main)
   ============================================================ */

const SERIES = [
  { cle: "invitations",  nom: "Invitations envoyées", varCss: "--serie-1" },
  { cle: "acceptations", nom: "Acceptations",         varCss: "--serie-2" },
  { cle: "reponses",     nom: "Réponses",             varCss: "--serie-3" }
];

function construireGraphique(donnees) {
  const L = 720, H = 240;
  const m = { haut: 14, droite: 64, bas: 26, gauche: 34 };
  const lTrace = L - m.gauche - m.droite;
  const hTrace = H - m.haut - m.bas;

  const maxBrut = Math.max(...donnees.map(d => Math.max(...SERIES.map(s => d[s.cle]))));
  const pas = maxBrut > 30 ? 10 : 5;
  const maxY = Math.max(pas, Math.ceil(maxBrut / pas) * pas);

  const x = i => m.gauche + (i / (donnees.length - 1)) * lTrace;
  const y = v => m.haut + hTrace - (v / maxY) * hTrace;

  let svg = "";

  // Grille horizontale + graduations Y (nombres ronds)
  for (let v = 0; v <= maxY; v += pas) {
    svg += `<line x1="${m.gauche}" y1="${y(v)}" x2="${L - m.droite}" y2="${y(v)}" stroke="var(--grid)" stroke-width="1"/>`;
    svg += `<text x="${m.gauche - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--ink-3)">${v}</text>`;
  }
  // Ligne de base
  svg += `<line x1="${m.gauche}" y1="${y(0)}" x2="${L - m.droite}" y2="${y(0)}" stroke="var(--baseline)" stroke-width="1"/>`;

  // Graduations X (1 jour sur 2 pour éviter les collisions)
  donnees.forEach((d, i) => {
    if (i % 2 === 0) {
      svg += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--ink-3)">${d.jour}</text>`;
    }
  });

  // Séries : lavis de surface, ligne 2px, point final avec anneau + étiquette directe
  SERIES.forEach(s => {
    const pts = donnees.map((d, i) => `${x(i)},${y(d[s.cle])}`).join(" ");
    const derniere = donnees[donnees.length - 1][s.cle];
    const xFin = x(donnees.length - 1), yFin = y(derniere);

    svg += `<polygon points="${m.gauche},${y(0)} ${pts} ${xFin},${y(0)}" style="fill: var(${s.varCss})" opacity="0.10"/>`;
    svg += `<polyline points="${pts}" fill="none" style="stroke: var(${s.varCss})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    svg += `<circle cx="${xFin}" cy="${yFin}" r="6" fill="var(--surface)"/>`;
    svg += `<circle cx="${xFin}" cy="${yFin}" r="4" style="fill: var(${s.varCss})"/>`;
    svg += `<text x="${xFin + 10}" y="${yFin + 4}" font-size="11.5" font-weight="600" fill="var(--ink-2)">${derniere}</text>`;
  });

  // Repère vertical de survol (déplacé en JS)
  svg += `<line id="chart-croix" x1="0" y1="${m.haut}" x2="0" y2="${y(0)}" stroke="var(--baseline)" stroke-width="1" visibility="hidden"/>`;
  svg += `<g id="chart-points" visibility="hidden">` +
    SERIES.map(s =>
      `<circle data-serie="${s.cle}" r="5.5" fill="var(--surface)"/>` +
      `<circle data-serie="${s.cle}" data-pt r="3.5" style="fill: var(${s.varCss})"/>`
    ).join("") + `</g>`;

  const legende = SERIES.map(s =>
    `<span class="legend-item"><span class="legend-swatch" style="background: var(${s.varCss})"></span>${s.nom}</span>`
  ).join("");

  return `
    <div class="chart-legend">${legende}</div>
    <div class="chart-wrap" id="chart-zone">
      <svg viewBox="0 0 ${L} ${H}" role="img" aria-label="Activité des 14 derniers jours : invitations envoyées, acceptations et réponses par jour">
        ${svg}
      </svg>
    </div>`;
}

function activerSurvolGraphique(donnees) {
  const zone = $("#chart-zone");
  if (!zone) return;
  const svg = $("svg", zone);
  const croix = $("#chart-croix", zone);
  const groupePts = $("#chart-points", zone);
  const tooltip = $("#chart-tooltip");

  const L = 720, H = 240;
  const m = { haut: 14, droite: 64, bas: 26, gauche: 34 };
  const lTrace = L - m.gauche - m.droite;
  const hTrace = H - m.haut - m.bas;
  const maxBrut = Math.max(...donnees.map(d => Math.max(...SERIES.map(s => d[s.cle]))));
  const pas = maxBrut > 30 ? 10 : 5;
  const maxY = Math.max(pas, Math.ceil(maxBrut / pas) * pas);
  const x = i => m.gauche + (i / (donnees.length - 1)) * lTrace;
  const y = v => m.haut + hTrace - (v / maxY) * hTrace;

  svg.addEventListener("mousemove", e => {
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * L;
    let i = Math.round(((px - m.gauche) / lTrace) * (donnees.length - 1));
    i = Math.max(0, Math.min(donnees.length - 1, i));
    const d = donnees[i];

    croix.setAttribute("x1", x(i));
    croix.setAttribute("x2", x(i));
    croix.setAttribute("visibility", "visible");

    groupePts.setAttribute("visibility", "visible");
    $$("circle", groupePts).forEach(c => {
      c.setAttribute("cx", x(i));
      c.setAttribute("cy", y(d[c.dataset.serie]));
    });

    tooltip.innerHTML = `<div class="tt-titre">${d.jour}</div>` + SERIES.map(s => `
      <div class="tt-ligne">
        <span class="tt-nom"><span class="legend-swatch" style="background: var(${s.varCss})"></span>${s.nom}</span>
        <span class="tt-val">${d[s.cle]}</span>
      </div>`).join("");
    tooltip.hidden = false;
    const tw = tooltip.offsetWidth;
    let gauche = e.clientX + 14;
    if (gauche + tw > window.innerWidth - 12) gauche = e.clientX - tw - 14;
    tooltip.style.left = gauche + "px";
    tooltip.style.top = (e.clientY - 10) + "px";
  });

  svg.addEventListener("mouseleave", () => {
    croix.setAttribute("visibility", "hidden");
    groupePts.setAttribute("visibility", "hidden");
    tooltip.hidden = true;
  });
}

/* ============================================================
   Vues
   ============================================================ */

/* ---------- Accueil ---------- */

function vueAccueil() {
  const a = etat.activite;
  const tot = cle => a.reduce((somme, j) => somme + j[cle], 0);
  const invitations = tot("invitations");
  const acceptations = tot("acceptations");
  const reponses = tot("reponses");
  const tauxAcceptation = pct(acceptations, invitations);
  const tauxReponse = pct(reponses, acceptations);

  const q = etat.quotas;
  const quotasHtml = Object.entries({
    "Invitations": q.invitations,
    "Messages": q.messages,
    "Visites de profil": q.visites
  }).map(([nom, v]) => `
    <div class="quota">
      <div class="quota-head"><span>${nom}</span><span class="quota-val">${v.utilise} / ${v.max}</span></div>
      <div class="quota-track"><div class="quota-fill" style="width:${pct(v.utilise, v.max)}%"></div></div>
    </div>`).join("");

  const prochaines = etat.file.slice(0, 4).map(f => {
    const p = prospectParId(f.prospectId);
    return `
      <tr>
        <td><div class="cell-nom"><span class="avatar">${p ? initiales(p) : "?"}</span>
          <div>${p ? echap(nomComplet(p)) : "Prospect supprimé"}<div class="cell-sous">${p ? echap(p.societe) : ""}</div></div></div></td>
        <td>${echap(f.type)}</td>
        <td class="cell-sous">${echap(f.prevu)}</td>
      </tr>`;
  }).join("");

  return `
    <div class="page-head">
      <div>
        <h1 class="page-title">Bonjour Lilian 👋</h1>
        <p class="page-sub">Voici l'activité de votre prospection sur les 14 derniers jours.</p>
      </div>
      <button class="btn btn-primaire" data-action="nouvelle-campagne">＋ Créer une campagne</button>
    </div>

    <div class="stats-row">
      <div class="card stat-tile">
        <div class="stat-label">Invitations envoyées</div>
        <div class="stat-value">${invitations}</div>
        <div class="stat-delta"><span class="haut">▲ 12 %</span> vs 14 j précédents</div>
      </div>
      <div class="card stat-tile">
        <div class="stat-label">Taux d'acceptation</div>
        <div class="stat-value">${tauxAcceptation}&nbsp;%</div>
        <div class="stat-delta"><span class="haut">▲ 3 pts</span> vs 14 j précédents</div>
      </div>
      <div class="card stat-tile">
        <div class="stat-label">Réponses reçues</div>
        <div class="stat-value">${reponses}</div>
        <div class="stat-delta"><span class="haut">▲ 8 %</span> vs 14 j précédents</div>
      </div>
      <div class="card stat-tile">
        <div class="stat-label">Taux de réponse</div>
        <div class="stat-value">${tauxReponse}&nbsp;%</div>
        <div class="stat-delta"><span class="bas">▼ 1 pt</span> vs 14 j précédents</div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="card">
        <h3 class="card-title">Activité quotidienne</h3>
        <p class="card-sub">Invitations, acceptations et réponses — 14 derniers jours</p>
        ${construireGraphique(a)}
      </div>
      <div style="display:grid; gap:14px;">
        <div class="card">
          <h3 class="card-title">Quotas du jour</h3>
          <p class="card-sub">Limites de sécurité pour protéger votre compte LinkedIn</p>
          ${quotasHtml}
        </div>
        <div class="card">
          <h3 class="card-title">Prochaines actions</h3>
          <p class="card-sub">${etat.file.length} action(s) en file d'attente</p>
          ${etat.file.length ? `<div class="table-wrap"><table class="liste"><tbody>${prochaines}</tbody></table></div>`
                             : `<div class="vide">Aucune action planifiée.</div>`}
          <div style="margin-top:12px;"><a class="btn btn-petit" href="#/file">Voir la file d'attente</a></div>
        </div>
      </div>
    </div>`;
}

/* ---------- Prospects ---------- */

let filtreProspects = { texte: "", statut: "Tous" };

function vueProspects() {
  const texte = filtreProspects.texte.toLowerCase();
  const visibles = etat.prospects.filter(p => {
    const okTexte = !texte || [nomComplet(p), p.societe, p.poste].join(" ").toLowerCase().includes(texte);
    const okStatut = filtreProspects.statut === "Tous" || p.statut === filtreProspects.statut;
    return okTexte && okStatut;
  });

  const lignes = visibles.map(p => {
    const camp = etat.campagnes.find(c => c.prospects.includes(p.id));
    return `
      <tr>
        <td><input type="checkbox" class="coche-prospect" data-id="${p.id}" style="accent-color: var(--brand)"></td>
        <td><div class="cell-nom"><span class="avatar">${initiales(p)}</span>
          <div>${echap(nomComplet(p))}<div class="cell-sous">${echap(p.poste)}</div></div></div></td>
        <td>${echap(p.societe)}</td>
        <td><span class="pill">${p.degre}</span></td>
        <td><span class="pill pill-${p.statut}">${p.statut}</span></td>
        <td>${camp ? `<a href="#/campagne/${camp.id}" class="cell-sous" style="color:var(--brand); font-weight:600">${echap(camp.nom)}</a>` : `<span class="cell-sous">—</span>`}</td>
        <td>${p.tags.map(t => `<span class="tag">${echap(t)}</span>`).join("")}</td>
      </tr>`;
  }).join("");

  const statuts = ["Tous", "Nouveau", "Invité", "Connecté", "Répondu"];

  return `
    <div class="page-head">
      <div>
        <h1 class="page-title">Prospects</h1>
        <p class="page-sub">${etat.prospects.length} prospects dans votre base</p>
      </div>
      <button class="btn btn-primaire" data-action="importer">⬇ Importer depuis LinkedIn</button>
    </div>

    <div class="toolbar">
      <input class="input input-recherche" id="recherche-prospects" type="search"
             placeholder="Rechercher un nom, une société…" value="${echap(filtreProspects.texte)}">
      <select class="input" id="filtre-statut">
        ${statuts.map(s => `<option ${s === filtreProspects.statut ? "selected" : ""}>${s}</option>`).join("")}
      </select>
      <div class="toolbar-espace"></div>
      <button class="btn" id="btn-ajouter-campagne" disabled>Ajouter à une campagne</button>
    </div>

    <div class="card" style="padding:0;">
      <div class="table-wrap">
        <table class="liste">
          <thead>
            <tr>
              <th style="width:34px"><input type="checkbox" id="coche-tout" style="accent-color: var(--brand)"></th>
              <th>Nom</th><th>Société</th><th>Relation</th><th>Statut</th><th>Campagne</th><th>Tags</th>
            </tr>
          </thead>
          <tbody>${lignes || `<tr><td colspan="7"><div class="vide"><div class="vide-icone">🔍</div>Aucun prospect ne correspond à votre recherche.</div></td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

function brancherProspects() {
  const champ = $("#recherche-prospects");
  champ.addEventListener("input", () => {
    filtreProspects.texte = champ.value;
    const pos = champ.selectionStart;
    rendre();
    const nouveau = $("#recherche-prospects");
    nouveau.focus();
    nouveau.setSelectionRange(pos, pos);
  });
  $("#filtre-statut").addEventListener("change", e => {
    filtreProspects.statut = e.target.value;
    rendre();
  });

  const majBouton = () => {
    $("#btn-ajouter-campagne").disabled = $$(".coche-prospect:checked").length === 0;
  };
  $$(".coche-prospect").forEach(c => c.addEventListener("change", majBouton));
  $("#coche-tout").addEventListener("change", e => {
    $$(".coche-prospect").forEach(c => { c.checked = e.target.checked; });
    majBouton();
  });

  $("#btn-ajouter-campagne").addEventListener("click", () => {
    const ids = $$(".coche-prospect:checked").map(c => c.dataset.id);
    ouvrirWizardCampagne(ids);
  });
}

function ouvrirModaleImport() {
  ouvrirModale(`
    <h2>Importer des prospects</h2>
    <p class="modal-sub">Dans la vraie application, l'extension navigateur importe les résultats d'une recherche LinkedIn ou Sales Navigator. Ici, l'import est simulé.</p>
    <div class="champ">
      <label>URL de recherche LinkedIn</label>
      <input class="input" id="url-import" placeholder="https://www.linkedin.com/search/results/people/?keywords=…">
    </div>
    <div class="champ">
      <label>Nombre de prospects à importer</label>
      <select class="input" id="nb-import"><option>3</option><option selected>5</option><option>10</option></select>
    </div>
    <div class="modal-pied">
      <div class="droite">
        <button class="btn" data-action="fermer-modale">Annuler</button>
        <button class="btn btn-primaire" data-action="confirmer-import">Importer</button>
      </div>
    </div>`);
}

const VIVIER_IMPORT = [
  { prenom: "Margaux",  nom: "Petit",    poste: "Growth Lead",         societe: "Skylio" },
  { prenom: "Adrien",   nom: "Leclerc",  poste: "Head of Product",     societe: "Bloomtech" },
  { prenom: "Pauline",  nom: "Girard",   poste: "CEO",                 societe: "Nuagia" },
  { prenom: "Mathieu",  nom: "Roy",      poste: "Sales Manager",       societe: "Veltis" },
  { prenom: "Océane",   nom: "Blanc",    poste: "Talent Partner",      societe: "Korail" },
  { prenom: "Damien",   nom: "Morel",    poste: "CTO",                 societe: "Structo" },
  { prenom: "Amandine", nom: "Caron",    poste: "Marketing Manager",   societe: "Plumeo" },
  { prenom: "Florian",  nom: "Bouvier",  poste: "Business Developer",  societe: "Antiga" },
  { prenom: "Justine",  nom: "Meunier",  poste: "Directrice RH",       societe: "Solyne" },
  { prenom: "Kevin",    nom: "Aubert",   poste: "VP Marketing",        societe: "Drivana" }
];

function confirmerImport() {
  const nb = parseInt($("#nb-import").value, 10);
  const dejaPris = new Set(etat.prospects.map(p => p.prenom + p.nom));
  const dispo = VIVIER_IMPORT.filter(v => !dejaPris.has(v.prenom + v.nom));
  const pris = dispo.slice(0, nb);
  pris.forEach((v, i) => {
    etat.prospects.push({
      id: "p" + Date.now() + i,
      prenom: v.prenom, nom: v.nom, poste: v.poste, societe: v.societe,
      statut: "Nouveau", degre: Math.random() < 0.5 ? "2e" : "3e", tags: ["Import"]
    });
  });
  sauverEtat();
  fermerModale();
  toast(pris.length ? `${pris.length} prospect(s) importé(s) ✓` : "Tous les prospects de cette recherche sont déjà importés.");
  rendre();
}

/* ---------- Campagnes ---------- */

function vueCampagnes() {
  const classePill = s => s === "En cours" ? "pill-encours" : s === "En pause" ? "pill-enpause" : "pill-terminee";

  const cartes = etat.campagnes.map(c => {
    const seq = sequenceParId(c.sequenceId);
    return `
      <div class="card camp-card" data-ouvrir-campagne="${c.id}">
        <div>
          <div class="camp-nom">${echap(c.nom)}</div>
          <div class="camp-meta">${seq ? seq.icone + " " + echap(seq.nom) : ""} · ${c.prospects.length} prospects · créée le ${c.creeLe}</div>
        </div>
        <span class="pill ${classePill(c.statut)}">${c.statut}</span>
        <div class="camp-stat"><div class="v">${c.stats.envoyees}</div><div class="l">envoyées</div></div>
        <div class="camp-stat"><div class="v">${pct(c.stats.acceptees, c.stats.envoyees)} %</div><div class="l">acceptation</div></div>
        <div class="camp-stat"><div class="v">${pct(c.stats.repondues, c.stats.acceptees)} %</div><div class="l">réponse</div></div>
        <button class="btn btn-petit" data-basculer-campagne="${c.id}" ${c.statut === "Terminée" ? "disabled" : ""}>
          ${c.statut === "En cours" ? "⏸ Pause" : c.statut === "En pause" ? "▶ Reprendre" : "Terminée"}
        </button>
      </div>`;
  }).join("");

  return `
    <div class="page-head">
      <div>
        <h1 class="page-title">Campagnes</h1>
        <p class="page-sub">${etat.campagnes.filter(c => c.statut === "En cours").length} campagne(s) en cours</p>
      </div>
      <button class="btn btn-primaire" data-action="nouvelle-campagne">＋ Créer une campagne</button>
    </div>
    <div class="camp-liste">
      ${cartes || `<div class="card vide"><div class="vide-icone">🚀</div>Aucune campagne pour l'instant. Lancez-vous !</div>`}
    </div>`;
}

function brancherCampagnes() {
  $$("[data-ouvrir-campagne]").forEach(carte => {
    carte.addEventListener("click", e => {
      if (e.target.closest("[data-basculer-campagne]")) return;
      location.hash = "#/campagne/" + carte.dataset.ouvrirCampagne;
    });
  });
  $$("[data-basculer-campagne]").forEach(btn => {
    btn.addEventListener("click", () => {
      const c = campagneParId(btn.dataset.basculerCampagne);
      if (!c || c.statut === "Terminée") return;
      c.statut = c.statut === "En cours" ? "En pause" : "En cours";
      sauverEtat();
      toast(c.statut === "En cours" ? "Campagne relancée ▶" : "Campagne mise en pause ⏸");
      rendre();
    });
  });
}

/* ---------- Détail d'une campagne ---------- */

function vueCampagneDetail(id) {
  const c = campagneParId(id);
  if (!c) return `<div class="card vide"><div class="vide-icone">🤔</div>Campagne introuvable. <a href="#/campagnes" style="color:var(--brand)">Retour aux campagnes</a></div>`;

  const seq = sequenceParId(c.sequenceId);
  const etapesHtml = seq ? seq.etapes.map((e, i) => {
    const attente = e.startsWith("Attendre");
    return `<span class="seq-step ${attente ? "attente" : ""}">${echap(e)}</span>` +
           (i < seq.etapes.length - 1 ? `<span class="seq-fleche">→</span>` : "");
  }).join("") : "";

  // Entonnoir : rampe séquentielle ordinale (un seul teinte, clair → foncé)
  const s = c.stats;
  const etapesFunnel = [
    { label: "Envoyées",  val: s.envoyees,  varCss: "--ramp-1" },
    { label: "Acceptées", val: s.acceptees, varCss: "--ramp-2" },
    { label: "Répondues", val: s.repondues, varCss: "--ramp-3" }
  ];
  const maxF = Math.max(1, ...etapesFunnel.map(e => e.val));
  const funnel = etapesFunnel.map(e => `
    <div class="funnel-row">
      <span class="f-label">${e.label}</span>
      <div class="funnel-track"><div class="funnel-bar" style="width:${pct(e.val, maxF)}%; background: var(${e.varCss})"></div></div>
      <span class="f-val">${e.val}</span>
    </div>`).join("");

  const lignes = c.prospects.map(pid => {
    const p = prospectParId(pid);
    if (!p) return "";
    return `
      <tr>
        <td><div class="cell-nom"><span class="avatar">${initiales(p)}</span>
          <div>${echap(nomComplet(p))}<div class="cell-sous">${echap(p.poste)} · ${echap(p.societe)}</div></div></div></td>
        <td><span class="pill pill-${p.statut}">${p.statut}</span></td>
        <td class="cell-sous">${p.statut === "Nouveau" ? "En attente dans la file" : p.statut === "Invité" ? "Invitation envoyée" : p.statut === "Connecté" ? "Séquence de messages en cours" : "Séquence terminée — a répondu"}</td>
      </tr>`;
  }).join("");

  const classePill = c.statut === "En cours" ? "pill-encours" : c.statut === "En pause" ? "pill-enpause" : "pill-terminee";

  return `
    <div class="page-head">
      <div>
        <a href="#/campagnes" style="color:var(--brand); font-weight:600; font-size:13px;">← Toutes les campagnes</a>
        <h1 class="page-title" style="margin-top:6px;">${echap(c.nom)} <span class="pill ${classePill}" style="vertical-align:middle;">${c.statut}</span></h1>
        <p class="page-sub">${seq ? seq.icone + " Séquence « " + echap(seq.nom) + " »" : ""} · ${c.prospects.length} prospects · créée le ${c.creeLe}</p>
      </div>
      <button class="btn" data-basculer-campagne="${c.id}" ${c.statut === "Terminée" ? "disabled" : ""}>
        ${c.statut === "En cours" ? "⏸ Mettre en pause" : c.statut === "En pause" ? "▶ Reprendre" : "Terminée"}
      </button>
    </div>

    <div class="dash-grid" style="margin-bottom:14px;">
      <div class="card">
        <h3 class="card-title">Entonnoir de conversion</h3>
        <p class="card-sub">Taux d'acceptation ${pct(s.acceptees, s.envoyees)} % · taux de réponse ${pct(s.repondues, s.acceptees)} %</p>
        <div class="funnel">${funnel}</div>
      </div>
      <div class="card">
        <h3 class="card-title">Séquence</h3>
        <p class="card-sub">Actions exécutées automatiquement pour chaque prospect</p>
        <div class="seq-steps">${etapesHtml}</div>
      </div>
    </div>

    <div class="card" style="padding:0;">
      <div class="table-wrap">
        <table class="liste">
          <thead><tr><th>Prospect</th><th>Statut</th><th>Progression</th></tr></thead>
          <tbody>${lignes || `<tr><td colspan="3"><div class="vide">Aucun prospect dans cette campagne.</div></td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

/* ---------- Assistant de création de campagne ---------- */

let wizard = null;

function ouvrirWizardCampagne(prospectsPreselectionnes = []) {
  wizard = {
    etape: 1,
    nom: "",
    sequenceId: null,
    prospects: new Set(prospectsPreselectionnes)
  };
  rendreWizard();
}

function rendreWizard() {
  const w = wizard;
  const points = [1, 2, 3].map(n => `<div class="etape-dot ${w.etape >= n ? "faite" : ""}"></div>`).join("");

  let corps = "";
  if (w.etape === 1) {
    corps = `
      <div class="champ">
        <label>Nom de la campagne</label>
        <input class="input" id="wiz-nom" placeholder="Ex. : Fondateurs SaaS — Lyon" value="${echap(w.nom)}">
      </div>`;
  } else if (w.etape === 2) {
    corps = `<div class="choix-seq">` + etat.sequences.map(s => `
      <div class="choix-seq-item ${w.sequenceId === s.id ? "choisi" : ""}" data-choisir-seq="${s.id}">
        <span class="icone">${s.icone}</span>
        <div>
          <div class="titre">${echap(s.nom)}</div>
          <div class="desc">${echap(s.description)}</div>
        </div>
      </div>`).join("") + `</div>`;
  } else {
    const dejaEnCampagne = new Set(etat.campagnes.flatMap(c => c.prospects));
    corps = `
      <p class="modal-sub" style="margin-bottom:10px;">${w.prospects.size} prospect(s) sélectionné(s)</p>
      <div class="choix-prospects">` + etat.prospects.map(p => `
        <label class="choix-prospect">
          <input type="checkbox" data-wiz-prospect="${p.id}" ${w.prospects.has(p.id) ? "checked" : ""}>
          <span class="avatar">${initiales(p)}</span>
          <div>
            <div style="font-weight:600; font-size:13px;">${echap(nomComplet(p))}
              ${dejaEnCampagne.has(p.id) ? `<span class="tag" title="Déjà dans une campagne">déjà en campagne</span>` : ""}</div>
            <div class="cell-sous">${echap(p.poste)} · ${echap(p.societe)}</div>
          </div>
        </label>`).join("") + `</div>`;
  }

  const titres = ["Nommez votre campagne", "Choisissez une séquence", "Ajoutez des prospects"];
  const peutContinuer =
    (w.etape === 1 && w.nom.trim().length > 0) ||
    (w.etape === 2 && w.sequenceId) ||
    (w.etape === 3 && w.prospects.size > 0);

  ouvrirModale(`
    <h2>Nouvelle campagne</h2>
    <p class="modal-sub">Étape ${w.etape} / 3 — ${titres[w.etape - 1]}</p>
    <div class="etapes-wizard">${points}</div>
    ${corps}
    <div class="modal-pied">
      ${w.etape > 1 ? `<button class="btn" data-action="wiz-retour">← Retour</button>` : ""}
      <div class="droite">
        <button class="btn" data-action="fermer-modale">Annuler</button>
        <button class="btn btn-primaire" data-action="${w.etape === 3 ? "wiz-lancer" : "wiz-suivant"}" ${peutContinuer ? "" : "disabled"}>
          ${w.etape === 3 ? "🚀 Lancer la campagne" : "Continuer →"}
        </button>
      </div>
    </div>`);

  if (w.etape === 1) {
    const champ = $("#wiz-nom");
    champ.focus();
    champ.addEventListener("input", () => {
      w.nom = champ.value;
      $("[data-action='wiz-suivant']").disabled = w.nom.trim().length === 0;
    });
  } else if (w.etape === 2) {
    $$("[data-choisir-seq]").forEach(item => item.addEventListener("click", () => {
      w.sequenceId = item.dataset.choisirSeq;
      rendreWizard();
    }));
  } else {
    $$("[data-wiz-prospect]").forEach(coche => coche.addEventListener("change", () => {
      if (coche.checked) w.prospects.add(coche.dataset.wizProspect);
      else w.prospects.delete(coche.dataset.wizProspect);
      const nb = w.prospects.size;
      $(".modal .choix-prospects").previousElementSibling.textContent = `${nb} prospect(s) sélectionné(s)`;
      $("[data-action='wiz-lancer']").disabled = nb === 0;
    }));
  }
}

function lancerCampagne() {
  const w = wizard;
  const seq = sequenceParId(w.sequenceId);
  const id = "c" + Date.now();
  const ids = [...w.prospects];

  etat.campagnes.unshift({
    id,
    nom: w.nom.trim(),
    sequenceId: w.sequenceId,
    statut: "En cours",
    creeLe: new Date().toISOString().slice(0, 10),
    prospects: ids,
    stats: { envoyees: 0, acceptees: 0, repondues: 0 }
  });

  // Planifie la première étape de la séquence pour chaque prospect
  const premiereEtape = seq ? seq.etapes.find(e => !e.startsWith("Attendre")) : "Invitation";
  ids.forEach((pid, i) => {
    etat.file.push({
      id: "q" + Date.now() + i,
      type: premiereEtape,
      prospectId: pid,
      campagneId: id,
      prevu: i < 3 ? "Aujourd'hui" : "Demain"
    });
  });

  sauverEtat();
  fermerModale();
  wizard = null;
  toast(`Campagne « ${w.nom.trim()} » lancée 🚀`);
  location.hash = "#/campagne/" + id;
}

/* ---------- Messagerie ---------- */

let convOuverte = null;

function vueMessagerie() {
  const items = etat.conversations.map(c => {
    const p = prospectParId(c.prospectId);
    const dernier = c.messages[c.messages.length - 1];
    return `
      <div class="conv-item ${convOuverte === c.id ? "actif" : ""}" data-ouvrir-conv="${c.id}">
        <span class="avatar">${p ? initiales(p) : "?"}</span>
        <div style="min-width:0;">
          <div class="conv-nom">${p ? echap(nomComplet(p)) : "Inconnu"} ${c.nonLu ? `<span class="point-nonlu"></span>` : ""}</div>
          <div class="conv-apercu">${echap(dernier.texte)}</div>
        </div>
      </div>`;
  }).join("");

  let thread;
  const conv = etat.conversations.find(c => c.id === convOuverte);
  if (conv) {
    const p = prospectParId(conv.prospectId);
    const bulles = conv.messages.map(msg => `
      <div class="bulle ${msg.de === "moi" ? "bulle-moi" : "bulle-eux"}">
        ${echap(msg.texte)}
        <div class="bulle-date">${msg.date}</div>
      </div>`).join("");
    thread = `
      <div class="thread">
        <div class="thread-head">
          <span class="avatar">${p ? initiales(p) : "?"}</span>
          <div>
            <div style="font-weight:650;">${p ? echap(nomComplet(p)) : "Inconnu"}</div>
            <div class="cell-sous">${p ? echap(p.poste) + " · " + echap(p.societe) : ""}</div>
          </div>
        </div>
        <div class="thread-messages" id="thread-messages">${bulles}</div>
        <div class="thread-saisie">
          <textarea id="saisie-message" placeholder="Écrivez votre message…"></textarea>
          <button class="btn btn-primaire" data-action="envoyer-message">Envoyer</button>
        </div>
      </div>`;
  } else {
    thread = `<div class="thread"><div class="thread-vide"><div style="font-size:32px;">💬</div>Sélectionnez une conversation</div></div>`;
  }

  const nonLus = etat.conversations.filter(c => c.nonLu).length;

  return `
    <div class="page-head">
      <div>
        <h1 class="page-title">Messagerie</h1>
        <p class="page-sub">${nonLus ? nonLus + " conversation(s) non lue(s)" : "Vous êtes à jour ✓"}</p>
      </div>
    </div>
    <div class="inbox ${conv ? "thread-ouvert" : ""}">
      <div class="inbox-liste">${items}</div>
      ${thread}
    </div>`;
}

function brancherMessagerie() {
  $$("[data-ouvrir-conv]").forEach(item => item.addEventListener("click", () => {
    convOuverte = item.dataset.ouvrirConv;
    const conv = etat.conversations.find(c => c.id === convOuverte);
    if (conv && conv.nonLu) { conv.nonLu = false; sauverEtat(); }
    rendre();
  }));

  const zone = $("#thread-messages");
  if (zone) zone.scrollTop = zone.scrollHeight;

  const saisie = $("#saisie-message");
  if (saisie) {
    saisie.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        envoyerMessage();
      }
    });
  }
}

function envoyerMessage() {
  const saisie = $("#saisie-message");
  const texte = saisie.value.trim();
  if (!texte) return;
  const conv = etat.conversations.find(c => c.id === convOuverte);
  if (!conv) return;
  const maintenant = new Date();
  conv.messages.push({
    de: "moi",
    texte,
    date: maintenant.toISOString().slice(0, 10) + " " +
          String(maintenant.getHours()).padStart(2, "0") + ":" + String(maintenant.getMinutes()).padStart(2, "0")
  });
  sauverEtat();
  rendre();
  toast("Message envoyé ✓");
}

/* ---------- File d'attente ---------- */

function vueFile() {
  const lignes = etat.file.map(f => {
    const p = prospectParId(f.prospectId);
    const c = campagneParId(f.campagneId);
    return `
      <tr>
        <td><div class="cell-nom"><span class="avatar">${p ? initiales(p) : "?"}</span>
          <div>${p ? echap(nomComplet(p)) : "Prospect supprimé"}<div class="cell-sous">${p ? echap(p.societe) : ""}</div></div></div></td>
        <td><span class="pill">${echap(f.type)}</span></td>
        <td>${c ? `<a href="#/campagne/${c.id}" style="color:var(--brand); font-weight:600;">${echap(c.nom)}</a>` : "—"}</td>
        <td class="cell-sous">${echap(f.prevu)}</td>
        <td style="text-align:right;"><button class="btn btn-petit btn-danger" data-annuler-action="${f.id}">Annuler</button></td>
      </tr>`;
  }).join("");

  return `
    <div class="page-head">
      <div>
        <h1 class="page-title">File d'attente</h1>
        <p class="page-sub">Les actions sont espacées aléatoirement, pendant vos heures d'activité, pour imiter un comportement humain.</p>
      </div>
    </div>
    <div class="card" style="padding:0;">
      <div class="table-wrap">
        <table class="liste">
          <thead><tr><th>Prospect</th><th>Action</th><th>Campagne</th><th>Prévu</th><th></th></tr></thead>
          <tbody>${lignes || `<tr><td colspan="5"><div class="vide"><div class="vide-icone">✨</div>La file d'attente est vide.</div></td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

function brancherFile() {
  $$("[data-annuler-action]").forEach(btn => btn.addEventListener("click", () => {
    etat.file = etat.file.filter(f => f.id !== btn.dataset.annulerAction);
    sauverEtat();
    toast("Action annulée");
    rendre();
  }));
}

/* ---------- Abonnement ---------- */

function vueAbonnement() {
  const plans = [
    {
      nom: "Freemium", prix: "0 €", populaire: false,
      pts: ["80 invitations / mois", "Séquences simples", "Messagerie LinkedIn", "Support par chat"]
    },
    {
      nom: "Avancé", prix: "56 €", populaire: true,
      pts: ["800 invitations / mois", "Toutes les séquences", "Import Sales Navigator", "Boîte mail chauffée", "Support prioritaire"]
    },
    {
      nom: "Business", prix: "80 €", populaire: false,
      pts: ["Tout le plan Avancé", "Enrichissement d'e-mails", "Séquences multicanales", "Intégrations CRM", "Account manager dédié"]
    }
  ];

  return `
    <div class="page-head">
      <div>
        <h1 class="page-title">Abonnement</h1>
        <p class="page-sub">Vous êtes en essai gratuit — il vous reste 12 jours. Choisissez le plan qui vous convient.</p>
      </div>
    </div>
    <div class="plans">
      ${plans.map(p => `
        <div class="card plan ${p.populaire ? "populaire" : ""}">
          ${p.populaire ? `<div class="plan-badge">Le plus populaire</div>` : ""}
          <div class="plan-nom">${p.nom}</div>
          <div class="plan-prix">${p.prix} <span>/ mois</span></div>
          <ul>${p.pts.map(x => `<li>${x}</li>`).join("")}</ul>
          <button class="btn ${p.populaire ? "btn-primaire" : ""}" data-choisir-plan="${p.nom}">Choisir ${p.nom}</button>
        </div>`).join("")}
    </div>`;
}

function brancherAbonnement() {
  $$("[data-choisir-plan]").forEach(btn => btn.addEventListener("click", () => {
    toast(`Ceci est une démo — le plan ${btn.dataset.choisirPlan} n'a pas été souscrit 😉`);
  }));
}

/* ============================================================
   Routeur & rendu
   ============================================================ */

function routeCourante() {
  const h = location.hash.replace(/^#\//, "");
  return h || "accueil";
}

function rendre() {
  const route = routeCourante();
  const main = $("#main");
  const [base, param] = route.split("/");

  $$(".nav-item").forEach(item => {
    const r = item.dataset.route;
    item.classList.toggle("actif", r === base || (base === "campagne" && r === "campagnes"));
  });

  switch (base) {
    case "prospects":
      main.innerHTML = vueProspects();
      brancherProspects();
      break;
    case "campagnes":
      main.innerHTML = vueCampagnes();
      brancherCampagnes();
      break;
    case "campagne":
      main.innerHTML = vueCampagneDetail(param);
      brancherCampagnes();
      break;
    case "messagerie":
      main.innerHTML = vueMessagerie();
      brancherMessagerie();
      break;
    case "file":
      main.innerHTML = vueFile();
      brancherFile();
      break;
    case "abonnement":
      main.innerHTML = vueAbonnement();
      brancherAbonnement();
      break;
    default:
      main.innerHTML = vueAccueil();
      activerSurvolGraphique(etat.activite);
  }

  majBadges();
}

/* ---------- Délégation des actions globales ---------- */

document.addEventListener("click", e => {
  const cible = e.target.closest("[data-action]");
  if (!cible) return;
  switch (cible.dataset.action) {
    case "nouvelle-campagne":  ouvrirWizardCampagne(); break;
    case "importer":           ouvrirModaleImport(); break;
    case "confirmer-import":   confirmerImport(); break;
    case "fermer-modale":      fermerModale(); break;
    case "wiz-suivant":        wizard.etape++; rendreWizard(); break;
    case "wiz-retour":         wizard.etape--; rendreWizard(); break;
    case "wiz-lancer":         lancerCampagne(); break;
    case "envoyer-message":    envoyerMessage(); break;
  }
});

window.addEventListener("hashchange", rendre);
rendre();
