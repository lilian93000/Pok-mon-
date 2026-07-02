/* ============================================================
   Walaxy — moteur d'automatisation
   ------------------------------------------------------------
   Le moteur tourne en tâche de fond et, à chaque passage :
     1. remet les quotas à zéro au changement de jour
     2. exécute les actions de la file arrivées à échéance
        (en respectant les quotas et l'état de la campagne)
     3. fait avancer chaque prospect dans sa séquence
     4. traite les événements simulés (acceptations, réponses)

   ⚠ SIMULATEUR : là où le produit réel piloterait un compte
   LinkedIn, ce moteur tire des probabilités (acceptation ~60 %,
   réponse ~35 %). L'intégration réelle n'est volontairement pas
   implémentée : automatiser LinkedIn viole ses conditions
   d'utilisation.
   ============================================================ */

const crypto = require("crypto");
const config = require("./config");
const magasin = require("./magasin");

/* ---------- Probabilités et délais du simulateur ---------- */

const PROBA_ACCEPTATION = 0.6;
const PROBA_REPONSE = 0.35;
const PROBA_REPONSE_MANUELLE = 0.4; // message écrit à la main depuis la messagerie

function alea(min, max) { return min + Math.random() * (max - min); }
function idUnique(prefixe) { return prefixe + crypto.randomBytes(5).toString("hex"); }

/* ---------- Petites aides sur l'état ---------- */

function isoJour(d = new Date()) { return d.toISOString().slice(0, 10); }
function libelleJour(d = new Date()) {
  return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0");
}

function campagneDe(etat, id) { return etat.campagnes.find(c => c.id === id); }
function prospectDe(etat, id) { return etat.prospects.find(p => p.id === id); }
function sequenceDe(etat, campagne) {
  return campagne && etat.sequences.find(s => s.id === campagne.sequenceId);
}

/* L'entrée d'activité du jour (le graphique en garde 14) */
function activiteDuJour(etat) {
  const iso = isoJour();
  let derniere = etat.activite[etat.activite.length - 1];
  if (!derniere || derniere.iso !== iso) {
    derniere = { jour: libelleJour(), iso, invitations: 0, acceptations: 0, reponses: 0 };
    etat.activite.push(derniere);
    while (etat.activite.length > 14) etat.activite.shift();
  }
  return derniere;
}

function remettreQuotas(etat) {
  const iso = isoJour();
  if (etat.quotas.date !== iso) {
    etat.quotas.date = iso;
    for (const cle of ["invitations", "messages", "visites"]) etat.quotas[cle].utilise = 0;
    return true;
  }
  return false;
}

function quotaPour(etat, typeAction) {
  if (typeAction === "Invitation") return etat.quotas.invitations;
  if (typeAction.startsWith("Message")) return etat.quotas.messages;
  return etat.quotas.visites;
}

/* ---------- Avancement dans la séquence ---------- */

function dureeAttente(etape) {
  const m = /Attendre (\d+) jour/.exec(etape);
  return m ? parseInt(m[1], 10) * config.JOUR_MS : 0;
}

/* La prochaine étape « active » après un index donné, avec le
   délai cumulé des étapes « Attendre N jours » intermédiaires. */
function prochaineEtape(etapes, apresIndex) {
  let attente = 0;
  for (let i = apresIndex + 1; i < etapes.length; i++) {
    if (etapes[i].startsWith("Attendre")) attente += dureeAttente(etapes[i]);
    else return { index: i, type: etapes[i], attente };
  }
  return null;
}

function enfiler(etat, campagne, prospectId, etapeIndex, type, dueAt) {
  etat.file.push({
    id: idUnique("q"),
    type,
    prospectId,
    campagneId: campagne.id,
    etapeIndex,
    dueAt: Math.round(dueAt)
  });
}

/* Planifie la première étape d'une séquence pour chaque prospect,
   en étalant les échéances (comportement humain). Utilisé par la
   route de création de campagne. */
function planifierCampagne(etat, campagne) {
  const seq = sequenceDe(etat, campagne);
  if (!seq) return;
  const premiere = seq.etapes[0].startsWith("Attendre")
    ? prochaineEtape(seq.etapes, 0)
    : { index: 0, type: seq.etapes[0], attente: 0 };
  if (!premiere) return;
  campagne.prospects.forEach((pid, i) => {
    const decalage = (i + 1) * alea(0.03, 0.09) * config.JOUR_MS;
    enfiler(etat, campagne, pid, premiere.index, premiere.type, Date.now() + premiere.attente + decalage);
  });
}

function planifierSuite(etat, campagne, prospectId, apresIndex) {
  const seq = sequenceDe(etat, campagne);
  if (!seq) return;
  const suite = prochaineEtape(seq.etapes, apresIndex);
  if (!suite) return;
  enfiler(etat, campagne, prospectId, suite.index, suite.type,
    Date.now() + Math.max(suite.attente, alea(0.02, 0.06) * config.JOUR_MS));
}

/* Retire de la file et des événements tout ce qui concerne un
   prospect dans une campagne (quand il répond, la séquence stoppe). */
function stopperSequence(etat, campagneId, prospectId) {
  etat.file = etat.file.filter(f => !(f.campagneId === campagneId && f.prospectId === prospectId));
  etat.evenements = etat.evenements.filter(e => !(e.campagneId === campagneId && e.prospectId === prospectId));
}

/* ---------- Conversations ---------- */

const TEXTES_SORTANTS = {
  "Invitation note": p => `Bonjour ${p.prenom}, votre parcours chez ${p.societe} a retenu mon attention. Au plaisir d'échanger !`,
  "Message": p => `Bonjour ${p.prenom}, merci d'avoir accepté ma demande ! Je travaille sur l'automatisation de la prospection B2B. Comment gérez-vous ce sujet chez ${p.societe} ?`,
  "Message 1": p => `Bonjour ${p.prenom}, ravi d'être connecté ! Curieux d'en savoir plus sur vos process de prospection chez ${p.societe}. Un créneau de 15 min cette semaine ?`,
  "Message 2": p => `Bonjour ${p.prenom}, je me permets de revenir vers vous — le sujet de l'automatisation vous parle-t-il ? Je peux partager quelques exemples concrets.`,
  "Message 3": p => `Bonjour ${p.prenom}, dernière relance promis 🙂 Si le moment est mal choisi, aucun souci — je reste disponible quand vous voudrez.`
};

const TEXTES_REPONSES = [
  "Bonjour Lilian, merci pour votre message ! Oui, le sujet m'intéresse. Vous auriez un créneau la semaine prochaine ?",
  "Bonjour, c'est un sujet qu'on regarde en ce moment justement. Pouvez-vous m'en dire plus ?",
  "Merci pour la relance — débordé ces derniers temps ! Envoyez-moi une doc, je regarde ça.",
  "Bonjour Lilian, pas de besoin immédiat mais je garde vos coordonnées, merci !",
  "Intéressant ! Comment gérez-vous les limites imposées par LinkedIn ?",
  "Bonjour, oui volontiers. Plutôt jeudi ou vendredi en fin de journée pour moi."
];

function horodatage(t = Date.now()) {
  const d = new Date(t);
  return d.toISOString().slice(0, 10) + " " +
    String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

function conversationPour(etat, prospectId) {
  let conv = etat.conversations.find(c => c.prospectId === prospectId);
  if (!conv) {
    conv = { id: idUnique("conv"), prospectId, nonLu: false, messages: [] };
    etat.conversations.unshift(conv);
  }
  return conv;
}

function texteSortant(type, prospect) {
  const gabarit = TEXTES_SORTANTS[type] || TEXTES_SORTANTS["Message"];
  return gabarit(prospect);
}

/* ---------- Simulateur (frontière de l'intégration réelle) ---------- */

function programmerAcceptation(etat, campagne, prospect, etapeIndex) {
  etat.evenements.push({
    id: idUnique("e"),
    type: "acceptation",
    succes: Math.random() < PROBA_ACCEPTATION,
    prospectId: prospect.id,
    campagneId: campagne.id,
    etapeIndex,
    dueAt: Math.round(Date.now() + alea(0.3, 2) * config.JOUR_MS)
  });
}

function programmerReponse(etat, campagneId, prospectId, probabilite) {
  if (Math.random() >= probabilite) return;
  etat.evenements.push({
    id: idUnique("e"),
    type: "reponse",
    prospectId,
    campagneId,
    texte: TEXTES_REPONSES[Math.floor(Math.random() * TEXTES_REPONSES.length)],
    dueAt: Math.round(Date.now() + alea(0.2, 1.5) * config.JOUR_MS)
  });
}

/* ---------- Exécution d'une action de la file ---------- */

function executerAction(etat, action) {
  const campagne = campagneDe(etat, action.campagneId);
  const prospect = prospectDe(etat, action.prospectId);

  // Campagne ou prospect disparu : on jette l'action
  if (!campagne || !prospect) return { retirer: true, changement: true };

  // Campagne en pause : l'action attend sans consommer de quota
  if (campagne.statut !== "En cours") return { retirer: false, changement: false };

  // Quota du jour épuisé : l'action est repoussée
  const quota = quotaPour(etat, action.type);
  if (quota.utilise >= quota.max) {
    action.dueAt = Date.now() + 0.5 * config.JOUR_MS;
    return { retirer: false, changement: true };
  }

  const act = activiteDuJour(etat);

  if (action.type === "Visite de profil") {
    quota.utilise++;
    campagne.progression[prospect.id] = action.etapeIndex;
    planifierSuite(etat, campagne, prospect.id, action.etapeIndex);
    return { retirer: true, changement: true };
  }

  if (action.type === "Invitation") {
    quota.utilise++;
    prospect.statut = prospect.statut === "Nouveau" ? "Invité" : prospect.statut;
    campagne.stats.envoyees++;
    act.invitations++;
    campagne.progression[prospect.id] = action.etapeIndex;
    // La suite de la séquence dépend de l'acceptation → simulateur
    programmerAcceptation(etat, campagne, prospect, action.etapeIndex);
    return { retirer: true, changement: true };
  }

  // Messages : il faut être en relation (1er niveau ou connexion acceptée)
  const joignable = ["Connecté", "Répondu"].includes(prospect.statut) || prospect.degre === "1er";
  if (!joignable) {
    // L'invitation n'a pas encore été acceptée : on réessaie plus tard
    action.dueAt = Date.now() + 0.5 * config.JOUR_MS;
    return { retirer: false, changement: true };
  }

  quota.utilise++;
  const conv = conversationPour(etat, prospect.id);
  conv.messages.push({ de: "moi", texte: texteSortant(action.type, prospect), date: horodatage() });
  campagne.progression[prospect.id] = action.etapeIndex;
  programmerReponse(etat, campagne.id, prospect.id, PROBA_REPONSE);
  planifierSuite(etat, campagne, prospect.id, action.etapeIndex);
  return { retirer: true, changement: true };
}

/* ---------- Traitement d'un événement simulé ---------- */

function traiterEvenement(etat, evenement) {
  const campagne = campagneDe(etat, evenement.campagneId);
  const prospect = prospectDe(etat, evenement.prospectId);
  if (!prospect) return;

  if (evenement.type === "acceptation") {
    if (!evenement.succes) return; // invitation restée sans réponse
    if (prospect.statut === "Invité" || prospect.statut === "Nouveau") prospect.statut = "Connecté";
    if (campagne) {
      campagne.stats.acceptees++;
      activiteDuJour(etat).acceptations++;
      planifierSuite(etat, campagne, prospect.id, evenement.etapeIndex);
    }
    return;
  }

  if (evenement.type === "reponse") {
    prospect.statut = "Répondu";
    if (campagne) {
      campagne.stats.repondues++;
      // Le prospect a répondu : on arrête les relances automatiques
      stopperSequence(etat, campagne.id, prospect.id);
    }
    activiteDuJour(etat).reponses++;
    const conv = conversationPour(etat, prospect.id);
    conv.messages.push({ de: "eux", texte: evenement.texte, date: horodatage() });
    conv.nonLu = true;
  }
}

/* Une campagne sans plus rien à faire est terminée */
function cloreCampagnesFinies(etat) {
  let changement = false;
  for (const c of etat.campagnes) {
    if (c.statut !== "En cours") continue;
    const resteFile = etat.file.some(f => f.campagneId === c.id);
    const resteEvt = etat.evenements.some(e => e.campagneId === c.id);
    if (!resteFile && !resteEvt && c.stats.envoyees + c.stats.acceptees > 0) {
      c.statut = "Terminée";
      changement = true;
    }
  }
  return changement;
}

/* ---------- Un passage du moteur pour un utilisateur ---------- */

function passer(etat) {
  const maintenant = Date.now();
  let changement = remettreQuotas(etat);

  // Actions de la file arrivées à échéance
  const echues = etat.file.filter(f => f.dueAt <= maintenant);
  for (const action of echues) {
    const resultat = executerAction(etat, action);
    if (resultat.retirer) etat.file = etat.file.filter(f => f.id !== action.id);
    changement = changement || resultat.changement;
  }

  // Événements simulés arrivés à échéance
  const evenements = etat.evenements.filter(e => e.dueAt <= maintenant);
  for (const evenement of evenements) {
    etat.evenements = etat.evenements.filter(e => e.id !== evenement.id);
    traiterEvenement(etat, evenement);
    changement = true;
  }

  changement = cloreCampagnesFinies(etat) || changement;
  return changement;
}

/* ---------- Boucle de fond ---------- */

function demarrerMoteur(surChangement) {
  const boucle = () => {
    for (const uid of magasin.listerIdsUtilisateurs()) {
      const etat = magasin.lireEtat(uid);
      if (!etat) continue;
      try {
        if (passer(etat)) {
          magasin.ecrireEtat(uid, etat);
          surChangement(uid);
        }
      } catch (e) {
        console.error(`Moteur : erreur pour l'utilisateur ${uid} —`, e.message);
      }
    }
  };
  boucle();
  return setInterval(boucle, config.TICK_MS);
}

module.exports = {
  demarrerMoteur, planifierCampagne, programmerReponse,
  conversationPour, horodatage, PROBA_REPONSE_MANUELLE
};
