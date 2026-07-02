/* ============================================================
   Walaxy — magasin de données (persistance JSON sur disque)
   ------------------------------------------------------------
   Un fichier utilisateurs.json (comptes) + un fichier
   etat-<uid>.json par utilisateur. Les écritures passent par
   un fichier temporaire puis un rename, donc sont atomiques.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const config = require("./config");
const SEED = require("../data.js");

const DOSSIER_DONNEES = path.join(__dirname, "data");
if (!fs.existsSync(DOSSIER_DONNEES)) fs.mkdirSync(DOSSIER_DONNEES, { recursive: true });

function lireJson(fichier, defaut) {
  try { return JSON.parse(fs.readFileSync(fichier, "utf8")); }
  catch (e) { return defaut; }
}

function ecrireJson(fichier, donnees) {
  const tmp = fichier + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(donnees, null, 2));
  fs.renameSync(tmp, fichier);
}

/* ---------- Comptes ---------- */

const FICHIER_UTILISATEURS = path.join(DOSSIER_DONNEES, "utilisateurs.json");

function lireUtilisateurs() {
  return lireJson(FICHIER_UTILISATEURS, { utilisateurs: [] });
}

function ecrireUtilisateurs(donnees) {
  ecrireJson(FICHIER_UTILISATEURS, donnees);
}

function utilisateurParEmail(email) {
  return lireUtilisateurs().utilisateurs.find(u => u.email === email.toLowerCase());
}

function utilisateurParId(id) {
  return lireUtilisateurs().utilisateurs.find(u => u.id === id);
}

function ajouterUtilisateur(utilisateur) {
  const donnees = lireUtilisateurs();
  donnees.utilisateurs.push(utilisateur);
  ecrireUtilisateurs(donnees);
}

function listerIdsUtilisateurs() {
  return lireUtilisateurs().utilisateurs.map(u => u.id);
}

/* ---------- État par utilisateur ---------- */

function fichierEtat(uid) {
  return path.join(DOSSIER_DONNEES, `etat-${uid}.json`);
}

function lireEtat(uid) {
  return lireJson(fichierEtat(uid), null);
}

function ecrireEtat(uid, etat) {
  ecrireJson(fichierEtat(uid), etat);
}

/* ---------- État initial d'un nouveau compte ---------- */

function libelleJour(d) {
  return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0");
}

function isoJour(d) {
  return d.toISOString().slice(0, 10);
}

/* Retrouve l'index d'une étape dans la séquence d'une campagne
   (les éléments de la file portent l'index de leur étape). */
function indexEtape(etat, campagneId, type) {
  const c = etat.campagnes.find(x => x.id === campagneId);
  const seq = c && etat.sequences.find(s => s.id === c.sequenceId);
  if (!seq) return 0;
  const i = seq.etapes.indexOf(type);
  return i >= 0 ? i : 0;
}

function creerEtatInitial() {
  const etat = JSON.parse(JSON.stringify(SEED));
  const maintenant = Date.now();

  // Activité recalée sur les 14 derniers jours réels
  etat.activite = etat.activite.map((a, i) => {
    const d = new Date(maintenant - (13 - i) * 86400000);
    return { ...a, jour: libelleJour(d), iso: isoJour(d) };
  });

  etat.quotas.date = isoJour(new Date());

  // La file de départ reçoit de vraies échéances, étalées dans le temps
  etat.file = etat.file.map((f, i) => ({
    id: f.id,
    type: f.type,
    prospectId: f.prospectId,
    campagneId: f.campagneId,
    etapeIndex: indexEtape(etat, f.campagneId, f.type),
    dueAt: Math.round(maintenant + (i + 1) * 0.12 * config.JOUR_MS * (0.8 + Math.random() * 0.6))
  }));

  // Événements simulés en attente (acceptations, réponses LinkedIn)
  etat.evenements = [];

  // Journal des emails réellement envoyés (canal email)
  etat.emails = [];

  // Progression de chaque prospect dans la séquence de sa campagne
  etat.campagnes.forEach(c => { c.progression = {}; });

  return etat;
}

module.exports = {
  lireUtilisateurs, utilisateurParEmail, utilisateurParId,
  ajouterUtilisateur, listerIdsUtilisateurs,
  lireEtat, ecrireEtat, creerEtatInitial,
  DOSSIER_DONNEES
};
