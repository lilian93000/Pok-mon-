/* ============================================================
   Walaxy — serveur HTTP (Node pur, zéro dépendance)
   ------------------------------------------------------------
   - Sert l'interface (fichiers statiques à la racine du dépôt)
   - Expose l'API REST sous /api/*
   - Pousse les mises à jour en temps réel via SSE (/api/events)
   - Lance le moteur d'automatisation en tâche de fond

   Démarrage :  node server/serveur.js   (ou : npm start)
   ============================================================ */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("./config");
const magasin = require("./magasin");
const auth = require("./authentification");
const moteur = require("./moteur");
const email = require("./email");

const RACINE = path.join(__dirname, "..");

/* ============================================================
   Réponses & lecture du corps
   ============================================================ */

function repondreJson(res, code, objet) {
  const corps = JSON.stringify(objet);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(corps);
}

function lireCorps(req) {
  return new Promise((resolve, reject) => {
    let donnees = "";
    req.on("data", morceau => {
      donnees += morceau;
      if (donnees.length > 100 * 1024) { reject(new Error("Corps trop volumineux")); req.destroy(); }
    });
    req.on("end", () => {
      try { resolve(donnees ? JSON.parse(donnees) : {}); }
      catch (e) { reject(new Error("JSON invalide")); }
    });
    req.on("error", reject);
  });
}

/* ============================================================
   SSE — mises à jour en temps réel
   ============================================================ */

const fluxParUtilisateur = new Map(); // uid → Set<res>

function diffuser(uid) {
  const ensemble = fluxParUtilisateur.get(uid);
  if (!ensemble) return;
  for (const res of ensemble) res.write(`data: {"type":"maj"}\n\n`);
}

/* ============================================================
   Libellés calculés côté serveur
   ============================================================ */

function libellePrevu(dueAt) {
  const diff = dueAt - Date.now();
  if (diff <= 5000) return "imminent";
  if (diff < 60000) return "dans moins d'une minute";
  if (diff < 3600000) return `dans ${Math.round(diff / 60000)} min`;
  const d = new Date(dueAt);
  return `le ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}` +
         ` à ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* Vue de l'état envoyée au client (échéances lisibles, tri de la file).
   Les actions LinkedIn manuelles reçoivent le message prêt à copier et
   l'URL du profil, pour la liste « À faire ». */
function serialiserEtat(etat) {
  return {
    ...etat,
    evenements: undefined, // détail interne du simulateur
    file: [...etat.file]
      .sort((a, b) => a.dueAt - b.dueAt)
      .map(f => {
        const item = { ...f, prevu: libellePrevu(f.dueAt), manuel: moteur.estActionManuelle(etat, f) };
        if (item.manuel) {
          const p = etat.prospects.find(x => x.id === f.prospectId);
          if (p) {
            item.message = moteur.messagePourAction(p, f.type);
            item.urlProfil = moteur.urlProfilLinkedIn(p);
          }
        }
        return item;
      })
  };
}

/* ============================================================
   Routes de l'API
   ============================================================ */

const VIVIER_IMPORT = [
  { prenom: "Margaux",  nom: "Petit",   poste: "Growth Lead",        societe: "Skylio" },
  { prenom: "Adrien",   nom: "Leclerc", poste: "Head of Product",    societe: "Bloomtech" },
  { prenom: "Pauline",  nom: "Girard",  poste: "CEO",                societe: "Nuagia" },
  { prenom: "Mathieu",  nom: "Roy",     poste: "Sales Manager",      societe: "Veltis" },
  { prenom: "Océane",   nom: "Blanc",   poste: "Talent Partner",     societe: "Korail" },
  { prenom: "Damien",   nom: "Morel",   poste: "CTO",                societe: "Structo" },
  { prenom: "Amandine", nom: "Caron",   poste: "Marketing Manager",  societe: "Plumeo" },
  { prenom: "Florian",  nom: "Bouvier", poste: "Business Developer", societe: "Antiga" },
  { prenom: "Justine",  nom: "Meunier", poste: "Directrice RH",      societe: "Solyne" },
  { prenom: "Kevin",    nom: "Aubert",  poste: "VP Marketing",       societe: "Drivana" }
];

async function routerApi(req, res, url) {
  const segments = url.pathname.split("/").filter(Boolean); // ["api", ...]
  const methode = req.method;

  /* ----- Santé (permet au front de détecter le back) ----- */
  if (url.pathname === "/api/sante" && methode === "GET") {
    return repondreJson(res, 200, {
      ok: true, nom: "walaxy", version: "1.1.0",
      modeEnvoi: email.modeEnvoi() // "smtp" (envoi réel) ou "apercu"
    });
  }

  /* ----- Authentification ----- */
  if (url.pathname === "/api/auth/inscription" && methode === "POST") {
    const { email, motDePasse } = await lireCorps(req);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) {
      return repondreJson(res, 400, { erreur: "Adresse e-mail invalide." });
    }
    if (!motDePasse || motDePasse.length < 6) {
      return repondreJson(res, 400, { erreur: "Le mot de passe doit faire au moins 6 caractères." });
    }
    if (magasin.utilisateurParEmail(email)) {
      return repondreJson(res, 409, { erreur: "Un compte existe déjà avec cette adresse." });
    }
    const utilisateur = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      motDePasse: auth.hacherMotDePasse(motDePasse),
      creeLe: new Date().toISOString()
    };
    magasin.ajouterUtilisateur(utilisateur);
    magasin.ecrireEtat(utilisateur.id, magasin.creerEtatInitial());
    return repondreJson(res, 201, { token: auth.creerToken(utilisateur.id), email: utilisateur.email });
  }

  if (url.pathname === "/api/auth/connexion" && methode === "POST") {
    const { email, motDePasse } = await lireCorps(req);
    const utilisateur = email && magasin.utilisateurParEmail(email);
    if (!utilisateur || !auth.verifierMotDePasse(motDePasse || "", utilisateur.motDePasse)) {
      return repondreJson(res, 401, { erreur: "Identifiants incorrects." });
    }
    return repondreJson(res, 200, { token: auth.creerToken(utilisateur.id), email: utilisateur.email });
  }

  /* ----- Tout le reste exige un jeton valide ----- */
  const enTete = req.headers.authorization || "";
  const token = enTete.startsWith("Bearer ") ? enTete.slice(7) : url.searchParams.get("token");
  const uid = auth.verifierToken(token);
  if (!uid) return repondreJson(res, 401, { erreur: "Authentification requise." });

  /* ----- Flux temps réel ----- */
  if (url.pathname === "/api/events" && methode === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    res.write("retry: 3000\n\n");
    if (!fluxParUtilisateur.has(uid)) fluxParUtilisateur.set(uid, new Set());
    fluxParUtilisateur.get(uid).add(res);
    const battement = setInterval(() => res.write(": ping\n\n"), 25000);
    req.on("close", () => {
      clearInterval(battement);
      const ensemble = fluxParUtilisateur.get(uid);
      if (ensemble) { ensemble.delete(res); if (!ensemble.size) fluxParUtilisateur.delete(uid); }
    });
    return;
  }

  const etat = magasin.lireEtat(uid);
  if (!etat) return repondreJson(res, 500, { erreur: "État introuvable pour ce compte." });

  const utilisateur = magasin.utilisateurParId(uid);

  function sauverEtRepondre(extra = {}) {
    magasin.ecrireEtat(uid, etat);
    diffuser(uid);
    repondreJson(res, 200, { etat: serialiserEtat(etat), ...extra });
  }

  /* ----- Lecture de l'état complet ----- */
  if (url.pathname === "/api/etat" && methode === "GET") {
    return repondreJson(res, 200, { etat: serialiserEtat(etat), email: utilisateur ? utilisateur.email : "" });
  }

  /* ----- Campagnes ----- */
  if (url.pathname === "/api/campagnes" && methode === "POST") {
    const { nom, sequenceId, prospectIds } = await lireCorps(req);
    if (!nom || !String(nom).trim()) return repondreJson(res, 400, { erreur: "Le nom de la campagne est requis." });
    if (!etat.sequences.some(s => s.id === sequenceId)) return repondreJson(res, 400, { erreur: "Séquence inconnue." });
    const ids = Array.isArray(prospectIds) ? prospectIds.filter(id => etat.prospects.some(p => p.id === id)) : [];
    if (!ids.length) return repondreJson(res, 400, { erreur: "Sélectionnez au moins un prospect." });

    const seq = etat.sequences.find(s => s.id === sequenceId);
    const campagne = {
      id: "c" + Date.now(),
      nom: String(nom).trim().slice(0, 80),
      sequenceId,
      statut: "En cours",
      creeLe: new Date().toISOString().slice(0, 10),
      // Les campagnes LinkedIn sont en SEMI-AUTO : le moteur prépare,
      // l'utilisateur envoie à la main (pas d'automatisation LinkedIn).
      manuel: seq && seq.canal === "linkedin",
      prospects: ids,
      progression: {},
      stats: { envoyees: 0, acceptees: 0, repondues: 0 }
    };
    etat.campagnes.unshift(campagne);
    moteur.planifierCampagne(etat, campagne);
    return sauverEtRepondre({ id: campagne.id });
  }

  if (segments[1] === "campagnes" && segments[3] === "basculer" && methode === "POST") {
    const campagne = etat.campagnes.find(c => c.id === segments[2]);
    if (!campagne) return repondreJson(res, 404, { erreur: "Campagne introuvable." });
    if (campagne.statut === "Terminée") return repondreJson(res, 400, { erreur: "Cette campagne est terminée." });
    campagne.statut = campagne.statut === "En cours" ? "En pause" : "En cours";
    return sauverEtRepondre();
  }

  /* ----- Import de prospects (simulé) ----- */
  if (url.pathname === "/api/prospects/import" && methode === "POST") {
    const { nb } = await lireCorps(req);
    const demande = Math.max(1, Math.min(10, parseInt(nb, 10) || 5));
    const dejaPris = new Set(etat.prospects.map(p => p.prenom + p.nom));
    const nouveaux = VIVIER_IMPORT.filter(v => !dejaPris.has(v.prenom + v.nom)).slice(0, demande);
    nouveaux.forEach((v, i) => {
      etat.prospects.push({
        id: "p" + Date.now() + i,
        prenom: v.prenom, nom: v.nom, poste: v.poste, societe: v.societe,
        statut: "Nouveau", degre: Math.random() < 0.5 ? "2e" : "3e", tags: ["Import"]
      });
    });
    return sauverEtRepondre({ ajoutes: nouveaux.length });
  }

  /* ----- File d'attente ----- */
  if (segments[1] === "file" && segments[3] === "annuler" && methode === "POST") {
    const avant = etat.file.length;
    etat.file = etat.file.filter(f => f.id !== segments[2]);
    if (etat.file.length === avant) return repondreJson(res, 404, { erreur: "Action introuvable." });
    return sauverEtRepondre();
  }

  /* ----- Action LinkedIn faite manuellement (semi-auto) ----- */
  if (segments[1] === "file" && segments[3] === "fait" && methode === "POST") {
    const resultat = moteur.executerManuel(etat, segments[2]);
    if (!resultat.ok) return repondreJson(res, 404, { erreur: resultat.erreur });
    return sauverEtRepondre();
  }

  /* ----- Conversations ----- */
  if (segments[1] === "conversations" && segments[3] === "messages" && methode === "POST") {
    const conv = etat.conversations.find(c => c.id === segments[2]);
    if (!conv) return repondreJson(res, 404, { erreur: "Conversation introuvable." });
    const { texte } = await lireCorps(req);
    if (!texte || !String(texte).trim()) return repondreJson(res, 400, { erreur: "Message vide." });
    conv.messages.push({ de: "moi", texte: String(texte).trim().slice(0, 2000), date: moteur.horodatage() });
    // Un message manuel peut lui aussi susciter une réponse simulée
    moteur.programmerReponse(etat, null, conv.prospectId, moteur.PROBA_REPONSE_MANUELLE);
    return sauverEtRepondre();
  }

  if (segments[1] === "conversations" && segments[3] === "lu" && methode === "POST") {
    const conv = etat.conversations.find(c => c.id === segments[2]);
    if (!conv) return repondreJson(res, 404, { erreur: "Conversation introuvable." });
    conv.nonLu = false;
    return sauverEtRepondre();
  }

  return repondreJson(res, 404, { erreur: "Route inconnue." });
}

/* ============================================================
   Fichiers statiques (l'interface)
   ============================================================ */

const TYPES_MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png":  "image/png",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon"
};

function servirStatique(req, res, url) {
  let chemin = decodeURIComponent(url.pathname);
  if (chemin === "/") chemin = "/index.html";

  const fichier = path.normalize(path.join(RACINE, chemin));
  const interdit =
    !fichier.startsWith(RACINE + path.sep) ||          // traversée de répertoire
    fichier.startsWith(path.join(RACINE, "server")) || // code & données du serveur
    chemin.split("/").some(s => s.startsWith("."));    // .git, fichiers cachés

  if (interdit) { res.writeHead(404); return res.end("Introuvable"); }

  fs.readFile(fichier, (erreur, contenu) => {
    if (erreur) { res.writeHead(404); return res.end("Introuvable"); }
    res.writeHead(200, { "Content-Type": TYPES_MIME[path.extname(fichier)] || "application/octet-stream" });
    res.end(contenu);
  });
}

/* ============================================================
   Désabonnement (page publique, sans authentification)
   ------------------------------------------------------------
   Répond au clic dans l'email ET à la requête POST « un clic »
   déclenchée automatiquement par Gmail/Outlook (List-Unsubscribe-Post).
   ============================================================ */

function pageDesabonnement(titre, message, ok) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titre}</title>
<style>
  body{font-family:system-ui,-apple-system,sans-serif;background:#f9f9f7;color:#0b0b0b;
       display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .c{background:#fff;border:1px solid rgba(11,11,11,.1);border-radius:16px;padding:36px 40px;
     max-width:440px;text-align:center;box-shadow:0 4px 24px rgba(11,11,11,.06)}
  .i{font-size:44px;margin-bottom:8px}
  h1{font-size:20px;margin:0 0 8px}
  p{color:#52514e;line-height:1.55;margin:0}
</style></head><body>
  <div class="c"><div class="i">${ok ? "✅" : "⚠️"}</div>
  <h1>${titre}</h1><p>${message}</p></div>
</body></html>`;
}

/* Répercute le désabonnement dans les états de tous les comptes :
   le prospect passe en « Désabonné » et ses relances sont annulées. */
function repercuterDesabonnement(adresse) {
  for (const uid of magasin.listerIdsUtilisateurs()) {
    const etat = magasin.lireEtat(uid);
    if (!etat) continue;
    let modifie = false;
    for (const p of etat.prospects) {
      if ((p.email || "").toLowerCase() === adresse && p.statut !== "Désabonné") {
        p.statut = "Désabonné";
        etat.file = etat.file.filter(f => f.prospectId !== p.id);
        modifie = true;
      }
    }
    if (modifie) { magasin.ecrireEtat(uid, etat); diffuser(uid); }
  }
}

async function routerDesabonnement(req, res, url) {
  const jeton = url.searchParams.get("jeton");
  const adresse = email.verifierJetonDesabonnement(jeton);
  if (!adresse) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(pageDesabonnement("Lien invalide",
      "Ce lien de désabonnement est invalide ou a expiré.", false));
  }
  email.desabonner(adresse);
  repercuterDesabonnement(adresse);

  // La requête POST « un clic » n'attend pas de page, juste un 200
  if (req.method === "POST") { res.writeHead(200); return res.end("OK"); }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  return res.end(pageDesabonnement("Désabonnement confirmé",
    `L'adresse <strong>${adresse.replace(/[&<>"]/g, "")}</strong> ne recevra plus aucun email de prospection.`, true));
}

/* ============================================================
   Démarrage
   ============================================================ */

const serveur = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname === "/desabonnement") await routerDesabonnement(req, res, url);
    else if (url.pathname.startsWith("/api/")) await routerApi(req, res, url);
    else if (req.method === "GET") servirStatique(req, res, url);
    else { res.writeHead(405); res.end(); }
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
    if (!res.headersSent) repondreJson(res, 400, { erreur: erreur.message });
  }
});

moteur.demarrerMoteur(diffuser);

serveur.listen(config.PORT, () => {
  console.log(`👽 Walaxy écoute sur http://localhost:${config.PORT}`);
  console.log(`   Échelle de temps : 1 « jour » de séquence = ${Math.round(config.JOUR_MS / 1000)} s réelles`);
  console.log(`   Moteur : un passage toutes les ${config.TICK_MS / 1000} s`);
  if (email.modeEnvoi() === "smtp") {
    console.log(`   Emails : ENVOI RÉEL via ${config.SMTP.hote}:${config.SMTP.port} (${config.SMTP.securite})`);
  } else {
    console.log(`   Emails : mode APERÇU (aucun SMTP configuré) → écrits dans server/data/outbox/`);
    console.log(`            Pour envoyer réellement : définir WALAXY_SMTP_HOTE / _USER / _PASS.`);
  }
});
