/* ============================================================
   Walaxy — configuration du serveur
   ------------------------------------------------------------
   L'échelle de temps est compressée pour la démonstration :
   par défaut, 1 « jour » d'une séquence dure 3 minutes réelles,
   afin de voir le moteur travailler sans attendre une semaine.
   Passez WALAXY_JOUR_MS=86400000 pour un rythme réel.
   ============================================================ */

module.exports = {
  PORT: parseInt(process.env.PORT || "", 10) || 3000,

  /* Durée réelle (ms) d'un « jour » de séquence */
  JOUR_MS: parseInt(process.env.WALAXY_JOUR_MS || "", 10) || 3 * 60 * 1000,

  /* Fréquence de passage du moteur d'automatisation */
  TICK_MS: parseInt(process.env.WALAXY_TICK_MS || "", 10) || 4000,

  /* Durée de vie des jetons de session */
  TOKEN_TTL_MS: 7 * 24 * 3600 * 1000,

  /* URL publique du service, utilisée dans les liens de désabonnement
     des emails. À définir en production (ex. https://walaxy.exemple.fr). */
  URL_PUBLIQUE: (process.env.WALAXY_URL_PUBLIQUE || "").replace(/\/$/, "") ||
                `http://localhost:${parseInt(process.env.PORT || "", 10) || 3000}`,

  /* ---------- Envoi d'emails ----------
     Si WALAXY_SMTP_HOTE est défini, les emails partent réellement via
     ce serveur SMTP. Sinon, le moteur bascule en mode « aperçu » :
     chaque email est écrit sur disque (server/data/outbox/*.eml) au
     lieu d'être envoyé — pratique pour développer sans rien spammer. */
  SMTP: {
    hote: process.env.WALAXY_SMTP_HOTE || "",
    port: parseInt(process.env.WALAXY_SMTP_PORT || "", 10) || 587,
    // "tls" (implicite, port 465), "starttls" (port 587), "aucune" (local/dev)
    securite: process.env.WALAXY_SMTP_SECURITE || "starttls",
    utilisateur: process.env.WALAXY_SMTP_USER || "",
    motDePasse: process.env.WALAXY_SMTP_PASS || ""
  },

  /* Expéditeur et mentions légales obligatoires (conformité CAN-SPAM /
     RGPD : identité claire + adresse postale physique dans chaque email). */
  EMAIL: {
    expediteurEmail: process.env.WALAXY_FROM_EMAIL || "prospection@walaxy.exemple.fr",
    expediteurNom: process.env.WALAXY_FROM_NOM || "Lilian — Walaxy",
    repondreA: process.env.WALAXY_REPLY_TO || "",
    adressePostale: process.env.WALAXY_ADRESSE ||
      "Walaxy (démo), 12 rue de la Prospection, 75000 Paris, France"
  }
};
