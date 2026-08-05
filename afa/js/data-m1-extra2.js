/* =============================================================
   AFA – Module 1, questions supplémentaires : chapitres 3 et 4
   (Trois piliers / Branches d'assurance)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m1', [
    /* ================= c3 — Les trois piliers ================= */
    { id: 'm1c3x01', chap: 'c3', type: 'single',
      q: "Dans quel article de la Constitution le système des trois piliers est-il ancré ?",
      choices: ["Art. 8 Cst.", "Art. 111 Cst.", "Art. 41 Cst.", "Art. 190 Cst."],
      answer: [1],
      explain: "L'art. 111 Cst. confie à la Confédération la mission d'organiser la prévoyance vieillesse, survivants et invalidité sur la base des trois piliers." },

    { id: 'm1c3x02', chap: 'c3', type: 'single',
      q: "À partir de quel âge une personne sans activité lucrative cotise-t-elle à l'AVS ?",
      choices: ["Dès 17 ans", "Dès 18 ans", "Dès 20 ans", "Dès 25 ans"],
      answer: [2],
      explain: "Les personnes sans activité lucrative cotisent dès le 1er janvier suivant leur 20e anniversaire ; les salariés cotisent dès le 1er janvier suivant leurs 17 ans." },

    { id: 'm1c3x03', chap: 'c3', type: 'single',
      q: "Quelle part de la cotisation AVS/AI/APG l'employé supporte-t-il ?",
      choices: ["10,6 %", "5,3 %", "8,7 %", "2,65 %"],
      answer: [1],
      explain: "La cotisation totale de 10,6 % est partagée par moitié : 5,3 % pour l'employé, 5,3 % pour l'employeur, sur la totalité du salaire sans plafond." },

    { id: 'm1c3x04', chap: 'c3', type: 'single',
      q: "Un couple marié touchant chacun la rente AVS maximale reçoit au total :",
      choices: ["CHF 5 040.–", "CHF 3 780.–", "CHF 2 520.–", "CHF 4 200.–"],
      answer: [1],
      explain: "Les rentes d'un couple sont plafonnées à 150 % de la rente maximale individuelle, soit 2 520 × 1,5 = CHF 3 780.– et non 2 × 2 520.–." },

    { id: 'm1c3x05', chap: 'c3', type: 'single',
      q: "Que se passe-t-il si une personne présente des années de cotisation manquantes à l'AVS ?",
      choices: ["Elle ne touche aucune rente", "Sa rente est réduite d'environ 1/44e par année manquante", "Elle reçoit la rente maximale malgré tout", "Elle est affiliée d'office au 2e pilier"],
      answer: [1],
      explain: "La rente complète suppose une durée de cotisation complète. Chaque lacune entraîne une réduction proportionnelle, d'où l'intérêt des rachats de cotisations." },

    { id: 'm1c3x06', chap: 'c3', type: 'multi',
      q: "Quelles prestations relèvent du 1er pilier ?",
      choices: ["Rentes de vieillesse AVS", "Rentes d'invalidité AI", "Allocations pour perte de gain (APG)", "Prestations complémentaires (PC)", "Rentes de la caisse de pension"],
      answer: [0, 1, 2, 3],
      explain: "Les rentes de caisse de pension appartiennent au 2e pilier. Les PC ne sont pas des assurances mais des prestations sous condition de ressources, rattachées au 1er pilier." },

    { id: 'm1c3x07', chap: 'c3', type: 'single',
      q: "Les bonifications pour tâches éducatives visent à :",
      choices: ["Augmenter le salaire coordonné", "Compenser dans le calcul de la rente les années consacrées aux enfants", "Financer les allocations familiales", "Réduire les cotisations de l'employeur"],
      answer: [1],
      explain: "Elles s'ajoutent au revenu déterminant pour le calcul de la rente AVS, afin que l'éducation des enfants ne se traduise pas par une rente amputée." },

    { id: 'm1c3x08', chap: 'c3', type: 'single',
      q: "Le splitting AVS consiste à :",
      choices: ["Partager les revenus réalisés pendant le mariage entre les deux conjoints", "Diviser la rente par le nombre d'enfants", "Séparer les cotisations AVS et AI", "Partager la rente entre le 1er et le 2e pilier"],
      answer: [0],
      explain: "Lors du divorce ou de la retraite des deux conjoints, les revenus des années de mariage sont additionnés puis répartis par moitié sur chaque compte individuel." },

    { id: 'm1c3x09', chap: 'c3', type: 'single',
      q: "Quel est le seuil d'entrée LPP en 2025 ?",
      choices: ["CHF 21 510.–", "CHF 22 680.–", "CHF 26 460.–", "CHF 88 200.–"],
      answer: [1],
      explain: "En dessous de CHF 22 680.– de salaire annuel auprès d'un employeur, le salarié n'est pas soumis à la LPP obligatoire. Ce seuil est adapté périodiquement." },

    { id: 'm1c3x10', chap: 'c3', type: 'single',
      q: "Un salarié gagne CHF 80 000.–. Quel est son salaire coordonné LPP en 2025 ?",
      choices: ["CHF 80 000.–", "CHF 53 540.–", "CHF 64 260.–", "CHF 26 460.–"],
      answer: [1],
      explain: "80 000 − 26 460 (déduction de coordination) = CHF 53 540.–. La déduction évite d'assurer deux fois la part de salaire déjà couverte par l'AVS." },

    { id: 'm1c3x11', chap: 'c3', type: 'single',
      q: "Quel est le salaire annuel maximal assurable dans la LPP obligatoire en 2025 ?",
      choices: ["CHF 64 260.–", "CHF 88 200.–", "CHF 90 720.–", "CHF 148 200.–"],
      answer: [2],
      explain: "Le salaire LPP maximal est de CHF 90 720.– ; au-delà, la couverture relève de la prévoyance surobligatoire, librement organisée par la caisse." },

    { id: 'm1c3x12', chap: 'c3', type: 'single',
      q: "Quel est le taux de bonification de vieillesse LPP pour un assuré de 40 ans ?",
      choices: ["7 %", "10 %", "15 %", "18 %"],
      answer: [1],
      explain: "Les taux légaux sont de 7 % (25-34 ans), 10 % (35-44), 15 % (45-54) et 18 % (55 ans à l'âge de référence), appliqués au salaire coordonné." },

    { id: 'm1c3x13', chap: 'c3', type: 'single',
      q: "Un avoir de vieillesse LPP de CHF 300 000.– donne, au taux de conversion minimal, une rente annuelle de :",
      choices: ["CHF 15 000.–", "CHF 20 400.–", "CHF 24 000.–", "CHF 30 000.–"],
      answer: [1],
      explain: "300 000 × 6,8 % = CHF 20 400.– par an, soit CHF 1 700.– par mois. Ce taux minimal ne vaut que pour la part obligatoire de l'avoir." },

    { id: 'm1c3x14', chap: 'c3', type: 'single',
      q: "Quelle part des cotisations LPP l'employeur doit-il au minimum prendre en charge ?",
      choices: ["Un tiers", "La moitié", "Deux tiers", "La totalité"],
      answer: [1],
      explain: "L'employeur doit financer au moins la moitié du total des cotisations de ses salariés ; beaucoup de caisses prévoient une part patronale plus élevée." },

    { id: 'm1c3x15', chap: 'c3', type: 'multi',
      q: "Dans quels cas un retrait anticipé du pilier 3a est-il autorisé ?",
      choices: ["Acquisition de son logement principal", "Départ définitif de Suisse", "Début d'une activité indépendante", "Achat d'une voiture", "Rachat dans la caisse de pension"],
      answer: [0, 1, 2, 4],
      explain: "Les cas de retrait sont limitativement énumérés par la loi ; s'y ajoutent l'invalidité et le versement dans les cinq ans précédant l'âge de référence." },

    { id: 'm1c3x16', chap: 'c3', type: 'single',
      q: "Quel est le montant maximal déductible au pilier 3a en 2025 pour un salarié affilié à une caisse de pension ?",
      choices: ["CHF 6 883.–", "CHF 7 056.–", "CHF 7 258.–", "CHF 36 288.–"],
      answer: [2],
      explain: "CHF 7 258.– pour les personnes affiliées à une caisse de pension. Sans 2e pilier, la limite est de 20 % du revenu, au maximum CHF 36 288.–." },

    { id: 'm1c3x17', chap: 'c3', type: 'single',
      q: "Un indépendant sans caisse de pension gagnant CHF 100 000.– peut verser au 3a au maximum :",
      choices: ["CHF 7 258.–", "CHF 20 000.–", "CHF 36 288.–", "CHF 10 000.–"],
      answer: [1],
      explain: "20 % de CHF 100 000.– = CHF 20 000.–, ce qui reste en dessous du plafond absolu de CHF 36 288.–. C'est donc le pourcentage qui limite le versement." },

    { id: 'm1c3x18', chap: 'c3', type: 'multi',
      q: "Quelles différences distinguent le pilier 3a du pilier 3b ?",
      choices: ["Le 3a est déductible fiscalement", "Le 3a impose un ordre légal des bénéficiaires", "Le 3b permet un retrait en tout temps", "Le 3b est réservé aux salariés", "Le 3a exige une activité lucrative"],
      answer: [0, 1, 2, 4],
      explain: "Le 3b est ouvert à tous, sans condition d'activité lucrative, et reste librement disponible ; c'est le 3a qui est « lié » et réservé aux personnes actives." },

    { id: 'm1c3x19', chap: 'c3', type: 'single',
      q: "Le 2e pilier est financé selon le système :",
      choices: ["De la répartition", "De la capitalisation", "De l'impôt", "De la solidarité intergénérationnelle pure"],
      answer: [1],
      explain: "Chaque assuré constitue son propre capital, qui lui sera restitué sous forme de rente ou de capital. C'est l'inverse du 1er pilier, financé par répartition." },

    { id: 'm1c3x20', chap: 'c3', type: 'single',
      q: "Le but du 2e pilier, combiné au 1er, est d'atteindre environ quel pourcentage du dernier salaire ?",
      choices: ["30 %", "45 %", "60 %", "90 %"],
      answer: [2],
      explain: "L'objectif constitutionnel est le maintien du niveau de vie habituel, estimé à environ 60 % du dernier revenu pour les deux premiers piliers réunis." },

    { id: 'm1c3x21', chap: 'c3', type: 'single',
      q: "Quel est le montant maximal du gain assuré LAA par année ?",
      choices: ["CHF 90 720.–", "CHF 126 000.–", "CHF 148 200.–", "Illimité"],
      answer: [2],
      explain: "CHF 148 200.– par an. Au-delà, l'employeur peut compléter par une assurance-accidents complémentaire soumise à la LCA." },

    { id: 'm1c3x22', chap: 'c3', type: 'single',
      q: "Qui paie en principe la prime pour les accidents non professionnels (ATNP) ?",
      choices: ["L'employeur", "Le salarié", "La Confédération", "La caisse-maladie"],
      answer: [1],
      explain: "La prime ATNP est en règle générale à la charge du salarié, tandis que la prime pour les accidents professionnels incombe obligatoirement à l'employeur." },

    { id: 'm1c3x23', chap: 'c3', type: 'single',
      q: "À partir de quel jour l'indemnité journalière LAA est-elle versée ?",
      choices: ["Dès le jour de l'accident", "Dès le 3e jour qui suit l'accident", "Dès le 8e jour", "Dès le 31e jour"],
      answer: [1],
      explain: "L'indemnité journalière est due dès le 3e jour suivant celui de l'accident ; le salaire des premiers jours reste à la charge de l'employeur." },

    { id: 'm1c3x24', chap: 'c3', type: 'single',
      q: "Une personne travaillant 5 heures par semaine chez un employeur est-elle couverte par la LAA pour un accident survenu pendant ses loisirs ?",
      choices: ["Oui, dès la première heure de travail", "Non, il faut au moins 8 heures par semaine", "Oui, si l'employeur le décide", "Oui, mais avec une prestation réduite de moitié"],
      answer: [1],
      explain: "En dessous de 8 heures hebdomadaires, seuls les accidents professionnels sont couverts. Les accidents non professionnels doivent alors être assurés via la LAMal." },

    { id: 'm1c3x25', chap: 'c3', type: 'single',
      q: "Quelle est la quote-part LAMal et son plafond annuel pour un adulte ?",
      choices: ["10 %, au maximum CHF 700.–", "20 %, au maximum CHF 500.–", "10 %, au maximum CHF 350.–", "15 %, sans plafond"],
      answer: [0],
      explain: "Après la franchise, l'assuré participe à 10 % des coûts, avec un plafond annuel de CHF 700.– pour un adulte et CHF 350.– pour un enfant." },

    { id: 'm1c3x26', chap: 'c3', type: 'single',
      q: "Quelle est la fourchette des franchises ordinaires LAMal pour un adulte ?",
      choices: ["CHF 0.– à 1 000.–", "CHF 300.– à 2 500.–", "CHF 500.– à 3 000.–", "CHF 300.– à 1 500.–"],
      answer: [1],
      explain: "La franchise ordinaire est de CHF 300.– et peut être portée jusqu'à CHF 2 500.– contre une réduction de prime. Pour les enfants, elle va de 0 à CHF 600.–." },

    { id: 'm1c3x27', chap: 'c3', type: 'single',
      q: "Combien de semaines dure le congé de maternité indemnisé par les APG ?",
      choices: ["8 semaines", "14 semaines", "16 semaines", "20 semaines"],
      answer: [1],
      explain: "14 semaines à 80 % du revenu pour la mère ; l'autre parent bénéficie de 2 semaines. Certains employeurs et cantons prévoient des régimes plus généreux." },

    { id: 'm1c3x28', chap: 'c3', type: 'single',
      q: "Quel est le taux de cotisation à l'assurance-chômage sur le salaire soumis ?",
      choices: ["1,1 %", "2,2 %", "3,4 %", "5,3 %"],
      answer: [1],
      explain: "2,2 % jusqu'à CHF 148 200.–, partagés par moitié entre employeur et salarié. Une cotisation de solidarité s'ajoute sur la part de salaire supérieure." },

    { id: 'm1c3x29', chap: 'c3', type: 'single',
      q: "Quel est le montant minimal légal de l'allocation pour enfant (LAFam) ?",
      choices: ["CHF 150.– par mois", "CHF 200.– par mois", "CHF 250.– par mois", "CHF 300.– par mois"],
      answer: [1],
      explain: "Le minimum fédéral est de CHF 200.– par mois et par enfant, porté à CHF 250.– pour un jeune en formation. Les cantons peuvent prévoir davantage." },

    { id: 'm1c3x30', chap: 'c3', type: 'multi',
      q: "Quelles affirmations sur les prestations complémentaires (PC) sont exactes ?",
      choices: ["Elles font partie du 1er pilier", "Elles sont versées lorsque les rentes ne couvrent pas le minimum vital", "Elles dépendent des revenus et de la fortune", "Elles sont financées par des primes individuelles", "Elles sont versées automatiquement à tous les retraités"],
      answer: [0, 1, 2],
      explain: "Les PC sont financées par les pouvoirs publics et non par des primes ; elles supposent une demande et un examen de la situation économique." },

    /* ================= c4 — Les branches d'assurance ================= */
    { id: 'm1c4x01', chap: 'c4', type: 'single',
      q: "Le principe indemnitaire signifie que :",
      choices: ["L'assuré ne peut pas s'enrichir par l'assurance", "L'assureur paie toujours la somme d'assurance", "La prime est proportionnelle au capital", "L'assuré choisit librement son indemnité"],
      answer: [0],
      explain: "En assurance de dommages, la prestation est plafonnée au dommage effectivement subi : l'assurance rétablit une situation, elle ne procure pas de gain." },

    { id: 'm1c4x02', chap: 'c4', type: 'single',
      q: "Une assurance de rente en cas d'invalidité par accident, versant un montant fixe convenu, est :",
      choices: ["Une assurance de dommages", "Une assurance de sommes", "Une assurance sociale", "Une assurance de choses"],
      answer: [1],
      explain: "Le montant est déterminé d'avance, sans lien avec la perte de gain réelle : la prestation se cumule donc avec d'autres indemnités." },

    { id: 'm1c4x03', chap: 'c4', type: 'multi',
      q: "Quels risques la casco complète couvre-t-elle en plus de la casco partielle ?",
      choices: ["Les dommages de collision causés par le conducteur", "Le vandalisme sur le véhicule en stationnement", "Le vol du véhicule", "L'incendie", "Le bris de glace"],
      answer: [0, 1],
      explain: "Vol, incendie et bris de glace figurent déjà dans la casco partielle. La casco complète ajoute les dommages de collision et, selon les conditions, les actes de vandalisme." },

    { id: 'm1c4x04', chap: 'c4', type: 'single',
      q: "Une collision avec un chevreuil sur la route relève de :",
      choices: ["La casco partielle", "Uniquement de la casco complète", "La RC véhicule", "L'assurance protection juridique"],
      answer: [0],
      explain: "Les collisions avec des animaux sauvages sont couvertes par la casco partielle, au même titre que les forces de la nature ou le vol." },

    { id: 'm1c4x05', chap: 'c4', type: 'single',
      q: "L'assurance responsabilité civile privée couvre :",
      choices: ["Les dommages que l'assuré subit lui-même", "Les dommages que l'assuré cause à des tiers", "Les amendes de circulation", "Les dommages intentionnels"],
      answer: [1],
      explain: "La RC prend en charge les prétentions justifiées de tiers et repousse les prétentions injustifiées — sa fonction de « protection juridique passive »." },

    { id: 'm1c4x06', chap: 'c4', type: 'multi',
      q: "Quelles sont des assurances de choses ?",
      choices: ["Assurance inventaire du ménage", "Assurance bris de machines", "Assurance transport de marchandises", "Assurance responsabilité civile", "Assurance perte d'exploitation"],
      answer: [0, 1, 2],
      explain: "RC et perte d'exploitation frappent le patrimoine sans destruction d'un bien précis : ce sont des assurances de patrimoine." },

    { id: 'm1c4x07', chap: 'c4', type: 'single',
      q: "Combien de cantons connaissent un établissement cantonal d'assurance des bâtiments (ECA) ?",
      choices: ["7", "13", "19", "26"],
      answer: [2],
      explain: "19 cantons ont un monopole cantonal. Les sept cantons « GUSTAVO » (GE, UR, SZ, TI, AI, VS, OW) laissent ce marché aux assureurs privés." },

    { id: 'm1c4x08', chap: 'c4', type: 'single',
      q: "L'assurance perte d'exploitation indemnise :",
      choices: ["La reconstruction du bâtiment détruit", "La marge brute et les frais fixes pendant l'interruption d'activité", "Les salaires des dirigeants uniquement", "Les créances impayées des clients"],
      answer: [1],
      explain: "Elle prend le relais de l'assurance de choses : celle-ci répare le bien, celle-là compense la perte de résultat pendant la remise en marche." },

    { id: 'm1c4x09', chap: 'c4', type: 'single',
      q: "L'assurance protection juridique appartient à quelle catégorie ?",
      choices: ["Assurance de personnes", "Assurance de choses", "Assurance de patrimoine", "Assurance sociale"],
      answer: [2],
      explain: "Elle prend en charge des frais (avocat, tribunal, expertises) qui grèveraient le patrimoine de l'assuré : c'est une assurance de patrimoine." },

    { id: 'm1c4x10', chap: 'c4', type: 'multi',
      q: "Quelles couvertures sont typiquement comprises dans une assurance ménage complète ?",
      choices: ["Incendie", "Dégâts d'eau", "Vol par effraction", "Responsabilité civile privée", "Casco du véhicule"],
      answer: [0, 1, 2, 3],
      explain: "Le « paquet ménage » combine l'assurance de choses (inventaire) et l'assurance de patrimoine (RC privée). Le véhicule fait l'objet d'un contrat distinct." },

    { id: 'm1c4x11', chap: 'c4', type: 'single',
      q: "Une assurance-vie mixte combine :",
      choices: ["Une couverture décès et une épargne payable en cas de vie", "Deux assurances de choses", "Une RC et une protection juridique", "Une rente et une casco"],
      answer: [0],
      explain: "Le capital est versé au décès s'il survient avant l'échéance, ou à l'assuré s'il est en vie au terme : c'est le produit d'épargne-prévoyance classique." },

    { id: 'm1c4x12', chap: 'c4', type: 'single',
      q: "Une assurance-vie risque pur (temporaire décès) :",
      choices: ["Constitue toujours une valeur de rachat importante", "Ne verse une prestation qu'en cas de décès pendant la durée convenue", "Est une assurance de dommages", "Garantit un capital à l'échéance"],
      answer: [1],
      explain: "Sans composante d'épargne, la prime est faible et il n'y a en principe pas de valeur de rachat : c'est une couverture pure du risque de décès." },

    { id: 'm1c4x13', chap: 'c4', type: 'single',
      q: "Une assurance-vie liée à des parts de fonds (unit linked) se caractérise par :",
      choices: ["Un rendement garanti par l'assureur", "Un risque de placement supporté par le preneur", "Une exonération de tout droit de timbre", "L'absence de couverture décès"],
      answer: [1],
      explain: "La valeur du contrat suit celle des fonds choisis : le preneur assume la performance, en échange d'un potentiel de rendement supérieur." },

    { id: 'm1c4x14', chap: 'c4', type: 'single',
      q: "L'assurance d'indemnités journalières maladie (IJM) pour une entreprise relève le plus souvent :",
      choices: ["De la LAMal", "De la LCA", "De la LAA", "De la LPP"],
      answer: [1],
      explain: "Les assurances collectives d'indemnités journalières sont en règle générale conclues selon la LCA, ce qui laisse une large liberté contractuelle aux parties." },

    { id: 'm1c4x15', chap: 'c4', type: 'multi',
      q: "Quelles assurances sont obligatoires en Suisse ?",
      choices: ["L'assurance-maladie de base (LAMal)", "La RC véhicule à moteur", "L'assurance ménage", "L'assurance-accidents pour les salariés (LAA)", "La protection juridique"],
      answer: [0, 1, 3],
      explain: "Ménage et protection juridique restent facultatives. S'ajoutent aux obligations citées certaines RC professionnelles (avocats, intermédiaires non liés, médecins)." },

    { id: 'm1c4x16', chap: 'c4', type: 'single',
      q: "Une assurance cyber pour PME est considérée comme :",
      choices: ["Une pure assurance de choses", "Une couverture hybride mêlant frais propres et responsabilité envers des tiers", "Une assurance de sommes", "Une assurance sociale"],
      answer: [1],
      explain: "Elle finance à la fois les frais de restauration des systèmes et l'indemnisation des tiers dont les données ont été compromises." },

    { id: 'm1c4x17', chap: 'c4', type: 'single',
      q: "L'assurance de crédit couvre :",
      choices: ["Le risque de non-paiement d'un débiteur", "Les intérêts hypothécaires", "Le vol d'argent liquide", "La perte d'un moyen de paiement"],
      answer: [0],
      explain: "Elle protège le fournisseur contre l'insolvabilité de ses clients : c'est une assurance de patrimoine, très utilisée dans le commerce et l'exportation." },

    { id: 'm1c4x18', chap: 'c4', type: 'single',
      q: "Une assurance travaux de construction couvre principalement :",
      choices: ["La responsabilité du maître d'ouvrage envers les voisins uniquement", "Les dommages matériels survenant à l'ouvrage en cours de réalisation", "Les retards de chantier", "Les défauts de conception exclusivement"],
      answer: [1],
      explain: "Elle protège l'ouvrage lui-même pendant sa construction. La RC du maître d'ouvrage fait l'objet d'une couverture distincte, souvent souscrite en parallèle." },

    { id: 'm1c4x19', chap: 'c4', type: 'single',
      q: "Une assurance de sommes se distingue par le fait :",
      choices: ["Qu'elle ouvre un droit de subrogation à l'assureur", "Qu'elle ne peut pas se cumuler avec d'autres prestations", "Qu'elle verse la prestation convenue sans égard au dommage réel", "Qu'elle s'applique uniquement aux entreprises"],
      answer: [2],
      explain: "Absence de principe indemnitaire, cumul possible, pas de subrogation : les trois conséquences directes de la nature d'assurance de sommes." },

    { id: 'm1c4x20', chap: 'c4', type: 'single',
      q: "Le vol simple à l'extérieur (par exemple un sac dérobé au restaurant) est :",
      choices: ["Toujours inclus dans l'assurance ménage de base", "Une couverture complémentaire à souscrire séparément", "Couvert par la RC privée", "Exclu de toute assurance"],
      answer: [1],
      explain: "L'assurance ménage couvre d'abord le vol par effraction au domicile ; le vol simple à l'extérieur constitue une extension facultative avec des limites propres." },

    { id: 'm1c4x21', chap: 'c4', type: 'single',
      q: "L'assurance dommages naturels couvre notamment :",
      choices: ["Les tremblements de terre dans tous les cas", "Les inondations, tempêtes, grêle, avalanches et glissements de terrain", "L'usure normale des bâtiments", "Les dégâts d'eau dus à une conduite défectueuse"],
      answer: [1],
      explain: "Le tremblement de terre est en principe exclu de la couverture ordinaire des dommages naturels ; les dégâts d'eau relèvent d'une couverture distincte." },

    { id: 'm1c4x22', chap: 'c4', type: 'multi',
      q: "Quelles assurances relèvent des assurances de personnes ?",
      choices: ["Assurance-vie", "Assurance-accidents individuelle", "Assurance-maladie complémentaire", "Assurance casco", "Assurance de crédit"],
      answer: [0, 1, 2],
      explain: "Casco (chose) et crédit (patrimoine) ne visent pas l'intégrité ou l'existence d'une personne, mais des biens ou de la fortune." },

    { id: 'm1c4x23', chap: 'c4', type: 'single',
      q: "Dans une assurance de dommages, si le responsable du sinistre est un tiers, l'assureur :",
      choices: ["Ne paie rien", "Indemnise puis exerce un recours contre le responsable", "Renvoie l'assuré vers le tiers", "Partage le dommage par moitié"],
      answer: [1],
      explain: "L'assuré est indemnisé rapidement par son propre assureur, qui reprend ses droits contre le responsable : c'est la subrogation." },

    { id: 'm1c4x24', chap: 'c4', type: 'single',
      q: "La RC d'entreprise couvre en principe :",
      choices: ["Les dommages causés à des tiers dans le cadre de l'exploitation", "Les dommages aux machines de l'entreprise", "Le manque à gagner de l'entreprise", "Les amendes administratives"],
      answer: [0],
      explain: "Les dommages aux biens propres relèvent de l'assurance de choses, et le manque à gagner de la perte d'exploitation. Les amendes ne sont pas assurables." },

    { id: 'm1c4x25', chap: 'c4', type: 'single',
      q: "Une assurance D&O protège :",
      choices: ["Les employés contre le licenciement", "Les organes dirigeants contre les prétentions en responsabilité liées à leur gestion", "Les clients de l'entreprise", "Les actionnaires contre la baisse du cours"],
      answer: [1],
      explain: "« Directors and Officers » : elle couvre la responsabilité personnelle des administrateurs et directeurs pour des décisions prises dans l'exercice de leur mandat." },

    { id: 'm1c4x26', chap: 'c4', type: 'single',
      q: "Pour un véhicule de dix ans, l'indemnisation en cas de destruction totale s'effectue en principe sur la base de :",
      choices: ["La valeur à neuf", "La valeur vénale", "Le prix d'achat initial", "La somme d'assurance de la RC"],
      answer: [1],
      explain: "Les véhicules s'indemnisent à la valeur vénale, sauf clause de valeur à neuf limitée aux premières années du contrat." },

    { id: 'm1c4x27', chap: 'c4', type: 'single',
      q: "L'assurance transport couvre en priorité :",
      choices: ["Les marchandises pendant leur acheminement", "Le personnel de conduite", "La RC du transporteur uniquement", "Les infrastructures routières"],
      answer: [0],
      explain: "Elle protège la marchandise contre les risques du voyage (avarie, perte, vol), quelle que soit la responsabilité du transporteur." },

    { id: 'm1c4x28', chap: 'c4', type: 'multi',
      q: "Quelles caractéristiques valent pour l'assurance de dommages ?",
      choices: ["Application du principe indemnitaire", "Possibilité de subrogation", "Prise en compte de la sous-assurance", "Cumul illimité avec d'autres prestations", "Versement d'un capital fixe convenu"],
      answer: [0, 1, 2],
      explain: "Cumul illimité et capital fixe caractérisent l'assurance de sommes, où le dommage réel n'entre pas en ligne de compte." },

    { id: 'm1c4x29', chap: 'c4', type: 'single',
      q: "La couverture « bris de glace » d'un ménage vise :",
      choices: ["Uniquement les pare-brise de véhicules", "Les vitrages du logement, et selon les conditions le mobilier vitré", "Les objets en cristal exclusivement", "Les panneaux solaires uniquement"],
      answer: [1],
      explain: "En assurance ménage, le bris de glace concerne les vitrages du bâtiment et du mobilier ; pour le véhicule, il relève de la casco partielle." },

    { id: 'm1c4x30', chap: 'c4', type: 'single',
      q: "L'assurance-maladie complémentaire d'hospitalisation privée est régie par :",
      choices: ["La LAMal", "La LCA", "La LAA", "La LPP"],
      answer: [1],
      explain: "Seule l'assurance de base relève de la LAMal, donc du droit public. Les complémentaires sont des contrats de droit privé soumis à la LCA." }
  ]);
})();
