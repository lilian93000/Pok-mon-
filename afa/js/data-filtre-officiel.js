/* =============================================================
   AFA – Filtre « questions officielles uniquement »

   Ne conserve que les questions au gabarit de l'examen
   (`lvl: 'off'`) : les 27 questions de la série zéro publiée par
   l'AFA, et celles rédigées sur le même modèle à partir du
   support de cours officiel.

   Les autres questions ne sont pas supprimées : leurs fichiers
   restent chargés et intacts, elles sont seulement écartées de
   la banque active. Pour les rétablir, il suffit de retirer la
   ligne « data-filtre-officiel.js » d'index.html.

   Les fiches de cours, elles, ne sont pas touchées.
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  let retirees = 0, gardees = 0;

  M.forEach(m => {
    const avant = m.questions.length;
    m.questions = m.questions.filter(q => q.lvl === 'off');
    gardees += m.questions.length;
    retirees += avant - m.questions.length;
  });

  // Trace utile en console : on sait immédiatement que le filtre est actif.
  if (typeof console !== 'undefined' && console.info) {
    console.info('[AFA] Filtre « format officiel » actif : ' + gardees +
      ' question(s) conservée(s), ' + retirees + ' écartée(s).');
  }
})();
