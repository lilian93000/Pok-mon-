/* ============================================================
   Walaxy — moteur d'automatisation
   ------------------------------------------------------------
   Le moteur tourne en tâche de fond et, à chaque passage :
     1. remet les quotas à zéro au changement de jour
     2. exécute les actions de la file arrivées à échéance
        (en respectant les quotas et l'état de la campagne)
     3. fait avancer chaque prospect dans sa séquence
     4. traite les événements simulés (acceptations, réponses)

   DEUX CANAUX :
   · LinkedIn (canal "linkedin") — SIMULÉ. Automatiser LinkedIn
     viole ses conditions d'utilisation ; les acceptations et
     réponses sont donc tirées au sort (~60 % / ~35 %).
   · Email (canal "email") — RÉEL. L'envoi d'emails de prospection
     est légal s'il respecte les règles anti-spam ; le moteur
     envoie de vrais emails via server/email.js (client SMTP),
     avec désabonnement en un clic et liste de suppression.
   ============================================================ */

const crypto = require("crypto");
const config = require("./config");
const magasin = require("./magasin");
const email = require("./email");

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
  if (typeAction.startsWith("Email")) return etat.quotas.emails;
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

/* Emails de séquence : sujet + corps (texte et HTML). Le pied de page
   légal (désabonnement + adresse) est ajouté par server/email.js. */
const EMAILS_SORTANTS = {
  "Email": p => ({
    sujet: `Prospection chez ${p.societe} ?`,
    texte: `Bonjour ${p.prenom},\r\n\r\nJe travaille avec des équipes comme la vôtre chez ${p.societe} sur l'automatisation de la prospection B2B (email, séquences, suivi). Seriez-vous ouvert(e) à un échange de 15 minutes cette semaine ?\r\n\r\nBien à vous,\r\nLilian`,
    html: `<p>Bonjour ${p.prenom},</p><p>Je travaille avec des équipes comme la vôtre chez <strong>${p.societe}</strong> sur l'automatisation de la prospection B2B (email, séquences, suivi). Seriez-vous ouvert(e) à un échange de 15 minutes cette semaine ?</p><p>Bien à vous,<br>Lilian</p>`
  }),
  "Email 1": p => ({
    sujet: `${p.prenom}, une idée pour la prospection de ${p.societe}`,
    texte: `Bonjour ${p.prenom},\r\n\r\nEn regardant ${p.societe}, je me suis dit que notre approche des séquences d'emails pourrait vous faire gagner du temps sur la génération de rendez-vous. On peut en parler ?\r\n\r\nLilian`,
    html: `<p>Bonjour ${p.prenom},</p><p>En regardant <strong>${p.societe}</strong>, je me suis dit que notre approche des séquences d'emails pourrait vous faire gagner du temps sur la génération de rendez-vous. On peut en parler ?</p><p>Lilian</p>`
  }),
  "Email 2": p => ({
    sujet: `Re: prospection ${p.societe}`,
    texte: `Bonjour ${p.prenom},\r\n\r\nJe me permets une relance — le sujet de l'automatisation d'emails vous parle-t-il ? Je peux vous envoyer deux exemples concrets de séquences qui convertissent bien.\r\n\r\nLilian`,
    html: `<p>Bonjour ${p.prenom},</p><p>Je me permets une relance — le sujet de l'automatisation d'emails vous parle-t-il ? Je peux vous envoyer deux exemples concrets de séquences qui convertissent bien.</p><p>Lilian</p>`
  }),
  "Email 3": p => ({
    sujet: `Dernière relance, ${p.prenom}`,
    texte: `Bonjour ${p.prenom},\r\n\r\nDernier message promis. Si le moment n'est pas le bon, aucun souci — répondez simplement « plus tard » et je reviendrai vers vous au bon moment.\r\n\r\nBonne journée,\r\nLilian`,
    html: `<p>Bonjour ${p.prenom},</p><p>Dernier message promis. Si le moment n'est pas le bon, aucun souci — répondez simplement « plus tard » et je reviendrai vers vous au bon moment.</p><p>Bonne journée,<br>Lilian</p>`
  })
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

/* ---------- Semi-automatique LinkedIn (préparation, envoi manuel) ---------- */

/* Une campagne LinkedIn créée depuis l'assistant est en mode "manuel" :
   le moteur NE l'exécute PAS. Ses actions attendent que l'utilisateur
   les fasse à la main (copier le message, ouvrir le profil, envoyer),
   puis les valide. Aucune automatisation contraire aux CGU de LinkedIn. */
function estActionManuelle(etat, action) {
  const c = campagneDe(etat, action.campagneId);
  return !!(c && c.manuel);
}

/* Message pré-rédigé à copier-coller pour une action manuelle. */
function messagePourAction(prospect, type) {
  if (type.startsWith("Invitation")) return TEXTES_SORTANTS["Invitation note"](prospect);
  return texteSortant(type, prospect);
}

/* URL de recherche LinkedIn du prospect (le clic reste fait par l'humain). */
function urlProfilLinkedIn(prospect) {
  const q = encodeURIComponent(`${prospect.prenom} ${prospect.nom} ${prospect.societe}`);
  return `https://www.linkedin.com/search/results/people/?keywords=${q}`;
}

/* L'utilisateur a effectué l'action à la main : on avance la séquence. */
function executerManuel(etat, actionId) {
  const action = etat.file.find(f => f.id === actionId);
  if (!action) return { ok: false, erreur: "Action introuvable." };
  const campagne = campagneDe(etat, action.campagneId);
  const prospect = prospectDe(etat, action.prospectId);
  if (!campagne || !prospect) {
    etat.file = etat.file.filter(f => f.id !== actionId);
    return { ok: true };
  }

  // Trace le message dans le fil (marqué « envoyé manuellement »)
  const texte = messagePourAction(prospect, action.type);
  const conv = conversationPour(etat, prospect.id);
  conv.messages.push({ de: "moi", canal: "linkedin", manuel: true, texte, date: horodatage() });

  // Statut : invitation → Invité ; message → Contacté
  if (action.type.startsWith("Invitation")) {
    if (prospect.statut === "Nouveau") prospect.statut = "Invité";
  } else if (!["Répondu", "Désabonné"].includes(prospect.statut)) {
    prospect.statut = "Contacté";
  }
  campagne.stats.envoyees++;
  campagne.progression[prospect.id] = action.etapeIndex;
  activiteDuJour(etat).invitations += action.type.startsWith("Invitation") ? 1 : 0;

  // Étape suivante (elle reviendra dans la liste « À faire » après son délai)
  planifierSuite(etat, campagne, prospect.id, action.etapeIndex);
  etat.file = etat.file.filter(f => f.id !== actionId);
  return { ok: true };
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

/* ---------- Canal EMAIL (réel) ---------- */

async function executerEmail(etat, action, campagne, prospect, quota) {
  // Consentement / conformité : jamais d'envoi à un désabonné
  if (email.estDesabonne(prospect.email)) {
    prospect.statut = "Désabonné";
    stopperSequence(etat, campagne.id, prospect.id);
    return { retirer: true, changement: true };
  }

  const gabarit = (EMAILS_SORTANTS[action.type] || EMAILS_SORTANTS["Email"])(prospect);
  const resultat = await email.envoyer({
    destinataire: prospect.email,
    sujet: gabarit.sujet,
    texte: gabarit.texte,
    html: gabarit.html
  });

  if (!resultat.ok) {
    if (resultat.statut === "desabonne") {
      prospect.statut = "Désabonné";
      stopperSequence(etat, campagne.id, prospect.id);
      return { retirer: true, changement: true };
    }
    // Adresse invalide ou erreur SMTP : on abandonne cette étape sans boucler
    prospect.dernierEmail = { statut: resultat.statut, erreur: resultat.erreur, date: horodatage() };
    return { retirer: true, changement: true };
  }

  quota.utilise++;
  campagne.stats.envoyees++;
  prospect.statut = ["Répondu", "Désabonné"].includes(prospect.statut) ? prospect.statut : "Contacté";
  prospect.dernierEmail = { statut: resultat.statut, date: horodatage(), apercu: resultat.apercu || null };
  campagne.progression[prospect.id] = action.etapeIndex;

  // Trace l'email dans le fil de conversation (canal email)
  const conv = conversationPour(etat, prospect.id);
  conv.messages.push({
    de: "moi", canal: "email", sujet: gabarit.sujet,
    texte: gabarit.texte, date: horodatage(), statut: resultat.statut
  });

  // Journal d'envoi
  etat.emails = etat.emails || [];
  etat.emails.unshift({
    id: idUnique("m"), prospectId: prospect.id, campagneId: campagne.id,
    sujet: gabarit.sujet, statut: resultat.statut, date: horodatage(), apercu: resultat.apercu || null
  });
  if (etat.emails.length > 200) etat.emails.length = 200;

  planifierSuite(etat, campagne, prospect.id, action.etapeIndex);
  return { retirer: true, changement: true };
}

/* ---------- Exécution d'une action de la file ---------- */

async function executerAction(etat, action) {
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

  // Canal email : envoi réel
  if (action.type.startsWith("Email")) {
    return executerEmail(etat, action, campagne, prospect, quota);
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

async function passer(etat) {
  const maintenant = Date.now();
  let changement = remettreQuotas(etat);

  // Actions de la file arrivées à échéance (traitées une par une :
  // l'envoi d'email est asynchrone et doit consommer le quota en série).
  // Les actions LinkedIn en mode manuel sont laissées à l'utilisateur.
  const echues = etat.file.filter(f => f.dueAt <= maintenant && !estActionManuelle(etat, f));
  for (const action of echues) {
    const resultat = await executerAction(etat, action);
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
  let enCours = false;
  const boucle = async () => {
    if (enCours) return; // évite les passages qui se chevauchent (I/O email lente)
    enCours = true;
    try {
      for (const uid of magasin.listerIdsUtilisateurs()) {
        const etat = magasin.lireEtat(uid);
        if (!etat) continue;
        try {
          if (await passer(etat)) {
            magasin.ecrireEtat(uid, etat);
            surChangement(uid);
          }
        } catch (e) {
          console.error(`Moteur : erreur pour l'utilisateur ${uid} —`, e.message);
        }
      }
    } finally { enCours = false; }
  };
  boucle();
  return setInterval(boucle, config.TICK_MS);
}

module.exports = {
  demarrerMoteur, planifierCampagne, programmerReponse,
  conversationPour, horodatage, PROBA_REPONSE_MANUELLE,
  executerManuel, messagePourAction, urlProfilLinkedIn, estActionManuelle
};
