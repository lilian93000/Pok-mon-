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
  TOKEN_TTL_MS: 7 * 24 * 3600 * 1000
};
