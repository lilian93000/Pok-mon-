/* ============================================================
   Walaxy — données de démonstration
   Ces données servent d'état initial ; l'état courant est
   persisté dans localStorage (clé "walaxy-state").
   ============================================================ */

const SEED = {

  /* ---------- Modèles de séquences ---------- */
  sequences: [
    {
      id: "seq-invitation",
      nom: "Invitation",
      description: "Envoie une simple demande de connexion, avec ou sans note.",
      etapes: ["Invitation"],
      icone: "🤝"
    },
    {
      id: "seq-invitation-message",
      nom: "Invitation + Message",
      description: "Demande de connexion puis message de suivi une fois acceptée.",
      etapes: ["Invitation", "Attendre 1 jour", "Message"],
      icone: "✉️"
    },
    {
      id: "seq-visite-invitation",
      nom: "Visite + Invitation",
      description: "Visite le profil pour créer une notification, puis invite.",
      etapes: ["Visite de profil", "Attendre 1 jour", "Invitation"],
      icone: "👀"
    },
    {
      id: "seq-invitation-2-relances",
      nom: "Invitation + 2 relances",
      description: "Connexion, message de bienvenue, puis deux relances espacées.",
      etapes: ["Invitation", "Attendre 1 jour", "Message 1", "Attendre 3 jours", "Message 2", "Attendre 5 jours", "Message 3"],
      icone: "🔁"
    },
    {
      id: "seq-message-simple",
      nom: "Message (relations existantes)",
      description: "Envoie un message direct à vos relations de 1er niveau.",
      etapes: ["Message"],
      icone: "💬"
    }
  ],

  /* ---------- Prospects ---------- */
  prospects: [
    { id: "p01", prenom: "Camille",   nom: "Roux",      poste: "Head of Growth",        societe: "Novaly",       statut: "Répondu",  degre: "1er",  tags: ["SaaS", "Paris"] },
    { id: "p02", prenom: "Thomas",    nom: "Lefèvre",   poste: "CEO",                   societe: "Brightpath",   statut: "Connecté", degre: "1er",  tags: ["SaaS"] },
    { id: "p03", prenom: "Inès",      nom: "Moreau",    poste: "Directrice Marketing",  societe: "Kelvio",       statut: "Invité",   degre: "2e",   tags: ["Marketing"] },
    { id: "p04", prenom: "Julien",    nom: "Garnier",   poste: "CTO",                   societe: "Datanest",     statut: "Connecté", degre: "1er",  tags: ["Tech", "Scale-up"] },
    { id: "p05", prenom: "Sophie",    nom: "Bernard",   poste: "Talent Acquisition",    societe: "Hirely",       statut: "Répondu",  degre: "1er",  tags: ["RH"] },
    { id: "p06", prenom: "Maxime",    nom: "Dubois",    poste: "Sales Director",        societe: "Cloudméa",     statut: "Invité",   degre: "2e",   tags: ["Sales"] },
    { id: "p07", prenom: "Léa",       nom: "Fontaine",  poste: "Founder",               societe: "Wando",        statut: "Nouveau",  degre: "2e",   tags: ["SaaS", "Paris"] },
    { id: "p08", prenom: "Antoine",   nom: "Chevalier", poste: "VP Engineering",        societe: "Loopside",     statut: "Nouveau",  degre: "3e",   tags: ["Tech"] },
    { id: "p09", prenom: "Chloé",     nom: "Marchand",  poste: "Head of Sales",         societe: "Ventizo",      statut: "Connecté", degre: "1er",  tags: ["Sales"] },
    { id: "p10", prenom: "Nicolas",   nom: "Perrot",    poste: "CEO",                   societe: "Squarelane",   statut: "Invité",   degre: "2e",   tags: ["Scale-up"] },
    { id: "p11", prenom: "Manon",     nom: "Gauthier",  poste: "CMO",                   societe: "Pixelio",      statut: "Nouveau",  degre: "2e",   tags: ["Marketing", "Paris"] },
    { id: "p12", prenom: "Hugo",      nom: "Renard",    poste: "Product Manager",       societe: "Flowdesk",     statut: "Connecté", degre: "1er",  tags: ["Produit"] },
    { id: "p13", prenom: "Élise",     nom: "Baron",     poste: "Recruteuse Tech",       societe: "Talentbee",    statut: "Répondu",  degre: "1er",  tags: ["RH", "Tech"] },
    { id: "p14", prenom: "Romain",    nom: "Colin",     poste: "CTO",                   societe: "Neomatik",     statut: "Nouveau",  degre: "3e",   tags: ["Tech", "Scale-up"] },
    { id: "p15", prenom: "Julie",     nom: "Vidal",     poste: "Growth Manager",        societe: "Splend",       statut: "Invité",   degre: "2e",   tags: ["SaaS"] },
    { id: "p16", prenom: "Alexandre", nom: "Masson",    poste: "Directeur Commercial",  societe: "Orbiwell",     statut: "Nouveau",  degre: "2e",   tags: ["Sales", "Lyon"] },
    { id: "p17", prenom: "Sarah",     nom: "Lemoine",   poste: "Head of People",        societe: "Yumana",       statut: "Nouveau",  degre: "2e",   tags: ["RH"] },
    { id: "p18", prenom: "Baptiste",  nom: "Guérin",    poste: "CEO",                   societe: "Finchly",      statut: "Connecté", degre: "1er",  tags: ["Fintech"] },
    { id: "p19", prenom: "Clara",     nom: "Navarro",   poste: "Account Executive",     societe: "Sellsy Lab",   statut: "Nouveau",  degre: "3e",   tags: ["Sales"] },
    { id: "p20", prenom: "Quentin",   nom: "Fabre",     poste: "Lead Developer",        societe: "Codexia",      statut: "Nouveau",  degre: "2e",   tags: ["Tech"] },
    { id: "p21", prenom: "Emma",      nom: "Rousseau",  poste: "Founder & CEO",         societe: "Miraya",       statut: "Invité",   degre: "2e",   tags: ["SaaS", "Bordeaux"] },
    { id: "p22", prenom: "Lucas",     nom: "Ferrand",   poste: "VP Sales",              societe: "Zentio",       statut: "Nouveau",  degre: "2e",   tags: ["Sales", "Scale-up"] },
    { id: "p23", prenom: "Anaïs",     nom: "Delacroix", poste: "Marketing Ops",         societe: "Brioz",        statut: "Nouveau",  degre: "3e",   tags: ["Marketing"] },
    { id: "p24", prenom: "Victor",    nom: "Lambert",   poste: "COO",                   societe: "Nordicwave",   statut: "Connecté", degre: "1er",  tags: ["Scale-up", "Lille"] }
  ],

  /* ---------- Campagnes ---------- */
  campagnes: [
    {
      id: "c01",
      nom: "Fondateurs SaaS — Paris",
      sequenceId: "seq-invitation-2-relances",
      statut: "En cours",
      creeLe: "2026-06-18",
      prospects: ["p01", "p02", "p03", "p07", "p10", "p15", "p21"],
      stats: { envoyees: 96, acceptees: 41, repondues: 17 }
    },
    {
      id: "c02",
      nom: "Recruteurs Tech Q3",
      sequenceId: "seq-invitation-message",
      statut: "En cours",
      creeLe: "2026-06-24",
      prospects: ["p05", "p13", "p17"],
      stats: { envoyees: 54, acceptees: 19, repondues: 8 }
    },
    {
      id: "c03",
      nom: "CTO Scale-ups France",
      sequenceId: "seq-visite-invitation",
      statut: "En pause",
      creeLe: "2026-06-10",
      prospects: ["p04", "p08", "p14", "p20"],
      stats: { envoyees: 73, acceptees: 22, repondues: 5 }
    },
    {
      id: "c04",
      nom: "Relance clients dormants",
      sequenceId: "seq-message-simple",
      statut: "Terminée",
      creeLe: "2026-05-20",
      prospects: ["p09", "p12", "p18", "p24"],
      stats: { envoyees: 40, acceptees: 40, repondues: 12 }
    }
  ],

  /* ---------- Activité sur 14 jours (graphique du tableau de bord) ---------- */
  activite: [
    { jour: "19/06", invitations: 22, acceptations:  8, reponses: 3 },
    { jour: "20/06", invitations: 28, acceptations: 11, reponses: 4 },
    { jour: "21/06", invitations: 12, acceptations:  9, reponses: 2 },
    { jour: "22/06", invitations:  0, acceptations:  5, reponses: 1 },
    { jour: "23/06", invitations: 31, acceptations:  7, reponses: 5 },
    { jour: "24/06", invitations: 26, acceptations: 13, reponses: 6 },
    { jour: "25/06", invitations: 30, acceptations: 12, reponses: 4 },
    { jour: "26/06", invitations: 24, acceptations: 15, reponses: 7 },
    { jour: "27/06", invitations: 18, acceptations: 10, reponses: 3 },
    { jour: "28/06", invitations:  9, acceptations:  6, reponses: 2 },
    { jour: "29/06", invitations: 27, acceptations: 14, reponses: 6 },
    { jour: "30/06", invitations: 33, acceptations: 16, reponses: 8 },
    { jour: "01/07", invitations: 29, acceptations: 18, reponses: 9 },
    { jour: "02/07", invitations: 21, acceptations: 12, reponses: 6 }
  ],

  /* ---------- Quotas journaliers ---------- */
  quotas: {
    invitations: { utilise: 21, max: 80 },
    messages:    { utilise: 46, max: 120 },
    visites:     { utilise: 63, max: 100 }
  },

  /* ---------- Conversations ---------- */
  conversations: [
    {
      id: "conv1", prospectId: "p01", nonLu: true,
      messages: [
        { de: "moi",  texte: "Bonjour Camille, merci d'avoir accepté ma demande ! Je travaille avec des équipes growth de SaaS B2B sur l'automatisation de la prospection. Curieux d'échanger sur vos process actuels ?", date: "2026-06-30 09:12" },
        { de: "eux",  texte: "Bonjour Lilian, avec plaisir. On utilise pas mal d'outils maison mais on atteint nos limites. Vous proposez quoi exactement ?", date: "2026-06-30 14:47" },
        { de: "moi",  texte: "On automatise les séquences LinkedIn + email avec des quotas sécurisés. Je peux vous montrer en 15 min cette semaine ?", date: "2026-07-01 08:30" },
        { de: "eux",  texte: "Ok pour jeudi 14h, envoyez-moi une invitation 👍", date: "2026-07-02 07:58" }
      ]
    },
    {
      id: "conv2", prospectId: "p05", nonLu: true,
      messages: [
        { de: "moi", texte: "Bonjour Sophie, je vois que vous recrutez beaucoup de profils tech chez Hirely. On aide les équipes TA à sourcer sur LinkedIn sans y passer leurs journées — ça vous parle ?", date: "2026-07-01 10:05" },
        { de: "eux", texte: "Bonjour ! Oui carrément, le sourcing manuel nous prend un temps fou. Vous avez une démo ou une doc à partager ?", date: "2026-07-02 06:42" }
      ]
    },
    {
      id: "conv3", prospectId: "p13", nonLu: false,
      messages: [
        { de: "moi", texte: "Bonjour Élise, merci pour la connexion ! Comment gérez-vous vos campagnes d'approche candidats en ce moment ?", date: "2026-06-28 11:20" },
        { de: "eux", texte: "Bonjour Lilian, on fait tout à la main pour l'instant. Pas encore convaincue par les outils d'automatisation, mais je reste ouverte.", date: "2026-06-29 09:15" },
        { de: "moi", texte: "Je comprends la prudence ! Si ça vous dit, je peux vous montrer comment on reste sous les limites LinkedIn. Sans engagement 🙂", date: "2026-06-29 17:03" }
      ]
    },
    {
      id: "conv4", prospectId: "p18", nonLu: false,
      messages: [
        { de: "eux", texte: "Merci pour votre message Lilian. Pas de besoin immédiat côté Finchly mais je garde vos coordonnées.", date: "2026-06-26 15:30" },
        { de: "moi", texte: "Parfait Baptiste, au plaisir d'échanger plus tard. Bonne semaine !", date: "2026-06-26 16:02" }
      ]
    }
  ],

  /* ---------- File d'attente ---------- */
  file: [
    { id: "q1", type: "Invitation",       prospectId: "p07", campagneId: "c01", prevu: "Aujourd'hui, 14:20" },
    { id: "q2", type: "Invitation",       prospectId: "p21", campagneId: "c01", prevu: "Aujourd'hui, 15:05" },
    { id: "q3", type: "Message 1",        prospectId: "p02", campagneId: "c01", prevu: "Aujourd'hui, 16:40" },
    { id: "q4", type: "Message",          prospectId: "p17", campagneId: "c02", prevu: "Demain, 09:10" },
    { id: "q5", type: "Visite de profil", prospectId: "p14", campagneId: "c03", prevu: "Demain, 10:35" },
    { id: "q6", type: "Message 2",        prospectId: "p10", campagneId: "c01", prevu: "Demain, 11:50" },
    { id: "q7", type: "Invitation",       prospectId: "p15", campagneId: "c01", prevu: "Demain, 14:15" }
  ]
};

/* Permet au serveur Node de réutiliser les mêmes données de départ */
if (typeof module !== "undefined" && module.exports) module.exports = SEED;
