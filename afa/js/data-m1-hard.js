/* =============================================================
   AFA – Module 1 : questions de niveau avancé
   Marquées lvl:'hard' — calculs à plusieurs étapes, distinctions
   fines et pièges classiques.
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list.map(q => ({ ...q, lvl: 'hard' })));
  };

  add('m1', [
    /* --------- c1 : risque --------- */
    { id: 'm1c1h01', chap: 'c1', type: 'single',
      q: "Un assureur constate que sa sinistralité réelle s'écarte fortement de ses statistiques alors que son portefeuille compte 400 contrats hétérogènes. Quelle explication est la plus pertinente ?",
      choices: ["La loi des grands nombres ne joue pas : effectif trop faible et risques non homogènes", "Le droit de timbre a augmenté", "Les assurés ont commis une prétention frauduleuse", "La réassurance non proportionnelle est mal structurée"],
      answer: [0],
      explain: "La loi des grands nombres suppose un effectif important ET des risques comparables. Avec 400 contrats hétérogènes, les deux conditions manquent : l'écart-type reste élevé et le résultat devient imprévisible." },

    { id: 'm1c1h02', chap: 'c1', type: 'multi',
      q: "Une entreprise veut couvrir le risque de perte de son principal client, qui représente 60 % de son chiffre d'affaires. Quels obstacles à l'assurabilité se posent ?",
      choices: ["Il s'agit d'un risque largement spéculatif, lié à l'aléa commercial", "Le risque dépend en partie du comportement de l'assuré", "L'événement n'est pas mesurable statistiquement de façon fiable", "Le risque est trop fréquent pour être assuré", "Le risque est illicite"],
      answer: [0, 1, 2],
      explain: "La perte d'un client relève de l'aléa commercial ordinaire, dépend de la qualité des prestations de l'entreprise et échappe à toute statistique fiable. Rien d'illicite ici, et ce n'est pas une question de fréquence." },

    { id: 'm1c1h03', chap: 'c1', type: 'single',
      q: "Dans une matrice des risques, un risque est positionné en « faible fréquence / très forte intensité », mais son sinistre maximal possible dépasse les fonds propres de l'assureur pressenti. La solution la plus adaptée est :",
      choices: ["Renoncer à toute couverture", "Souscrire la couverture en la faisant adosser à un programme de réassurance non proportionnelle", "Augmenter la franchise jusqu'au SMP", "Traiter le risque en assurance de sommes"],
      answer: [1],
      explain: "C'est exactement la fonction de capacité de la réassurance : elle permet d'accepter un risque dont l'engagement excède ce que l'assureur peut porter seul, en écrêtant la tranche haute." },

    { id: 'm1c1h04', chap: 'c1', type: 'single',
      q: "Quelle affirmation distingue correctement risque de cumul et risque de masse ?",
      choices: ["Ils désignent la même réalité", "Le risque de masse tient au grand nombre de contrats semblables ; le risque de cumul tient à leur exposition simultanée à un même événement", "Le risque de cumul concerne les personnes, le risque de masse les choses", "Le risque de masse est inassurable"],
      answer: [1],
      explain: "Un portefeuille peut être de masse sans cumul (RC privée dispersée) ou de masse ET cumulatif (assurance grêle concentrée sur une région). Le cumul détruit la compensation dans l'espace, pas le nombre." },

    /* --------- c2 : technique --------- */
    { id: 'm1c2h01', chap: 'c2', type: 'single',
      q: "Une branche encaisse CHF 8 millions de primes, verse CHF 5,4 millions de sinistres et supporte CHF 2,8 millions de frais. Quel est son combined ratio ?",
      choices: ["67,5 %", "35 %", "102,5 %", "97,5 %"],
      answer: [2],
      explain: "(5,4 + 2,8) / 8 = 8,2 / 8 = 102,5 %. Au-delà de 100 %, l'activité technique est déficitaire : seul le résultat des placements peut encore sauver l'exercice." },

    { id: 'm1c2h02', chap: 'c2', type: 'single',
      q: "Une prime de risque vaut CHF 300.–. L'assureur applique 8 % de supplément de sécurité (sur la prime de risque), CHF 60.– de chargement de frais et CHF 24.– de marge. Quelle est la prime encaissée en assurance de choses ?",
      choices: ["CHF 408.–", "CHF 428.40", "CHF 448.–", "CHF 384.–"],
      answer: [1],
      explain: "300 + 24 (8 %) + 60 + 24 = CHF 408.– de prime commerciale, puis 5 % de droit de timbre : 408 × 1,05 = CHF 428.40." },

    { id: 'm1c2h03', chap: 'c2', type: 'single',
      q: "Un contrat annuel de CHF 1 200.– est encaissé le 1er octobre. Quel montant figure au report de primes à la clôture du 31 décembre ?",
      choices: ["CHF 300.–", "CHF 600.–", "CHF 900.–", "CHF 1 200.–"],
      answer: [2],
      explain: "Trois mois sont consommés sur douze : 9/12 × 1 200 = CHF 900.– concernent l'exercice suivant et sont provisionnés en primes non acquises." },

    { id: 'm1c2h04', chap: 'c2', type: 'multi',
      q: "Un assureur baisse fortement ses tarifs sur un segment sans modifier ses critères de sélection. Quelles conséquences sont à craindre ?",
      choices: ["Une antisélection : les risques supérieurs à la moyenne affluent", "Une détérioration du loss ratio", "Une pression sur les provisions et la solvabilité", "Une hausse automatique du droit de timbre", "Une amélioration mécanique du combined ratio"],
      answer: [0, 1, 2],
      explain: "Le droit de timbre est un pourcentage : il suit la prime sans « augmenter ». Et le combined ratio se dégrade, puisque le dénominateur (primes) baisse pendant que la sinistralité monte." },

    { id: 'm1c2h05', chap: 'c2', type: 'single',
      q: "Pourquoi la prime d'une assurance décès à prime constante dépasse-t-elle, les premières années, la prime de risque de l'année ?",
      choices: ["Pour financer le droit de timbre", "Parce que l'excédent constitue la réserve mathématique qui financera les années où le risque de décès sera plus élevé", "Parce que la loi l'impose", "Parce que les frais d'acquisition sont annuels"],
      answer: [1],
      explain: "La mortalité croît avec l'âge. Le trop-perçu initial est capitalisé en réserve mathématique et comble le déficit des dernières années : c'est la compensation dans le temps au niveau du contrat." },

    /* --------- c3 : trois piliers --------- */
    { id: 'm1c3h01', chap: 'c3', type: 'single',
      q: "Un salarié de 47 ans gagne CHF 120 000.–. Quelle est sa bonification de vieillesse LPP annuelle dans le régime obligatoire ?",
      choices: ["CHF 18 000.–", "CHF 9 639.–", "CHF 13 608.–", "CHF 6 426.–"],
      answer: [1],
      explain: "Le salaire dépasse le maximum LPP : on part de CHF 90 720.– moins la déduction de 26 460, soit un salaire coordonné plafonné à CHF 64 260.–. À 47 ans le taux est de 15 % : 64 260 × 15 % = CHF 9 639.–." },

    { id: 'm1c3h02', chap: 'c3', type: 'single',
      q: "Un salarié gagne CHF 25 000.– par an chez un seul employeur. Quel est son salaire coordonné LPP ?",
      choices: ["Zéro, il n'est pas assujetti", "CHF 3 780.– (le minimum légal)", "CHF 25 000.–", "CHF 1 460.–"],
      answer: [1],
      explain: "Il dépasse le seuil d'entrée de CHF 22 680.–, donc il est assujetti. Le calcul 25 000 − 26 460 donnerait un montant négatif : le salaire coordonné est alors porté au minimum légal de CHF 3 780.–." },

    { id: 'm1c3h03', chap: 'c3', type: 'single',
      q: "Un indépendant sans caisse de pension réalise un revenu de CHF 250 000.–. Quel montant peut-il verser au pilier 3a ?",
      choices: ["CHF 50 000.–", "CHF 36 288.–", "CHF 7 258.–", "CHF 20 000.–"],
      answer: [1],
      explain: "20 % de 250 000 = CHF 50 000.–, mais le plafond absolu de CHF 36 288.– s'applique. Le pourcentage et le plafond jouent ensemble : c'est le plus petit des deux qui l'emporte." },

    { id: 'm1c3h04', chap: 'c3', type: 'single',
      q: "Un travailleur de 19 ans est engagé avec un salaire de CHF 60 000.–. Quelle est sa situation LPP ?",
      choices: ["Non assujetti, il est trop jeune", "Assujetti uniquement pour les risques décès et invalidité", "Assujetti pour les risques et l'épargne vieillesse", "Assujetti uniquement à l'épargne vieillesse"],
      answer: [1],
      explain: "Dès 17 ans révolus, la couverture porte sur les risques décès et invalidité. La constitution de l'avoir de vieillesse ne commence qu'à partir de 25 ans révolus." },

    { id: 'm1c3h05', chap: 'c3', type: 'multi',
      q: "Un salarié travaille 6 heures par semaine chez l'employeur A et 5 heures chez l'employeur B. Qu'en est-il de sa couverture accidents ?",
      choices: ["Les accidents professionnels sont couverts chez chaque employeur", "Les accidents non professionnels ne sont couverts par aucun des deux, le seuil de 8 heures s'appréciant par employeur", "Il doit couvrir le risque accident par sa caisse-maladie", "Les 11 heures s'additionnent et ouvrent la couverture ATNP", "Il n'est couvert pour rien"],
      answer: [0, 1, 2],
      explain: "Le seuil de 8 heures s'apprécie employeur par employeur : 6 et 5 heures restent en dessous. Les accidents professionnels sont couverts dès la première heure, mais le risque accident non professionnel doit passer par la LAMal." },

    { id: 'm1c3h06', chap: 'c3', type: 'single',
      q: "Une personne perçoit un salaire de CHF 200 000.–. Sur quel montant les cotisations AVS et l'indemnité journalière LAA se calculent-elles respectivement ?",
      choices: ["AVS sur 200 000.– ; LAA sur 148 200.–", "AVS sur 148 200.– ; LAA sur 148 200.–", "AVS sur 90 720.– ; LAA sur 200 000.–", "Les deux sur 200 000.–"],
      answer: [0],
      explain: "L'AVS ne connaît aucun plafond de salaire cotisant. La LAA, elle, plafonne le gain assuré à CHF 148 200.– : au-delà, il faut une couverture complémentaire LCA." },

    /* --------- c4 : branches --------- */
    { id: 'm1c4h01', chap: 'c4', type: 'multi',
      q: "Un incendie détruit l'atelier d'une PME. Quelles couvertures interviennent, chacune pour sa part ?",
      choices: ["L'assurance de choses pour le bâtiment et les machines", "L'assurance perte d'exploitation pour la marge et les frais fixes pendant l'arrêt", "La RC d'entreprise si le feu s'est propagé chez le voisin", "L'assurance de sommes pour la valeur d'affection des locaux", "La protection juridique en cas de litige avec l'assureur"],
      answer: [0, 1, 2, 4],
      explain: "La valeur d'affection n'est pas assurable et ne concerne de toute façon pas une assurance de sommes. Les trois autres couvertures se complètent : le bien, le résultat et la responsabilité envers les tiers." },

    { id: 'm1c4h02', chap: 'c4', type: 'single',
      q: "Un assuré perçoit un capital de son assurance-accidents de sommes et obtient aussi des dommages-intérêts du responsable. L'assureur de sommes peut-il exercer un recours ?",
      choices: ["Oui, à concurrence de sa prestation", "Non : la subrogation suppose le principe indemnitaire, absent en assurance de sommes", "Oui, pour la moitié", "Seulement si le dommage dépasse le capital versé"],
      answer: [1],
      explain: "L'assurance de sommes verse un montant convenu sans égard au dommage : il n'y a ni surindemnisation au sens juridique, ni subrogation. Le cumul est licite et voulu." },

    { id: 'm1c4h03', chap: 'c4', type: 'single',
      q: "Un véhicule en leasing est détruit dans une collision dont le conducteur est responsable. Quelle couverture intervient pour le véhicule lui-même ?",
      choices: ["La RC véhicule à moteur", "La casco partielle", "La casco complète", "Le Fonds national de garantie"],
      answer: [2],
      explain: "La RC ne couvre jamais le véhicule de l'assuré, et la casco partielle exclut la collision dont on est responsable. Seule la casco complète répond, ce qui explique qu'elle soit exigée en leasing." },

    { id: 'm1c4h04', chap: 'c4', type: 'single',
      q: "Quelle combinaison décrit correctement l'assurance-maladie en Suisse ?",
      choices: ["Base et complémentaires relèvent toutes deux de la LAMal", "La base relève de la LAMal (droit public, OFSP) et les complémentaires de la LCA (droit privé, FINMA)", "La base relève de la LCA et les complémentaires de la LAMal", "Les deux relèvent de la LCA et de la FINMA"],
      answer: [1],
      explain: "Cette double nature explique tout le reste : obligation d'admission et absence de sélection dans la base, sélection des risques et réticence possibles dans les complémentaires." },

    /* --------- c5 : marché --------- */
    { id: 'm1c5h01', chap: 'c5', type: 'single',
      q: "Un groupe veut exploiter l'assurance-vie, l'assurance-accidents et l'assurance incendie. Comment doit-il s'organiser ?",
      choices: ["Une seule entité peut tout exploiter", "Une entité vie (qui peut aussi pratiquer accidents et maladie) et une entité distincte pour l'incendie", "Trois entités obligatoirement distinctes", "Une entité, à condition d'obtenir une dérogation de l'ASA"],
      answer: [1],
      explain: "Le principe de spécialisation n'autorise l'assureur-vie à cumuler que l'accidents et la maladie. L'incendie, assurance de choses, doit être logée dans une société séparée." },

    { id: 'm1c5h02', chap: 'c5', type: 'single',
      q: "Un employeur souscrit une assurance-accidents collective pour ses salariés. Qui est preneur, qui est assuré, qui est ayant droit en cas d'accident ?",
      choices: ["L'employeur pour les trois rôles", "L'employeur est preneur, le salarié est assuré et ayant droit", "Le salarié est preneur, l'employeur ayant droit", "L'assureur est preneur"],
      answer: [1],
      explain: "C'est l'assurance pour compte d'autrui : l'employeur contracte et paie la prime, le salarié porte le risque sur sa personne et perçoit la prestation." },

    /* --------- c6 : distribution --------- */
    { id: 'm1c6h01', chap: 'c6', type: 'single',
      q: "Un courtier place un contrat auprès d'un assureur qui n'est pas autorisé par la FINMA, en informant loyalement son client. Quelle est sa situation ?",
      choices: ["Elle est régulière puisqu'il a informé le client", "Il ne remplit plus une condition légale d'inscription et risque la radiation du registre", "Il doit simplement doubler sa RC professionnelle", "Il doit l'annoncer au MROS"],
      answer: [1],
      explain: "Ne pas travailler pour une entreprise non autorisée est une condition d'inscription : l'information du client n'y change rien, car la protection visée est celle du marché tout entier." },

    { id: 'm1c6h02', chap: 'c6', type: 'multi',
      q: "Un intermédiaire conseille un produit inadapté ; le client subit une lacune de couverture de CHF 80 000.–. Quels éléments détermineront l'issue ?",
      choices: ["La documentation du conseil et de l'analyse des besoins", "L'existence d'une RC professionnelle", "Le statut lié ou non lié, qui détermine qui répond", "Le montant du droit de timbre payé", "L'éventuel avertissement donné au client et consigné"],
      answer: [0, 1, 2, 4],
      explain: "Le statut est décisif : l'assureur répond de son agent lié, alors que le courtier répond personnellement. La documentation est la pièce maîtresse, et la RC professionnelle finance l'indemnisation." },

    { id: 'm1c6h03', chap: 'c6', type: 'single',
      q: "Un courtier perçoit un courtage récurrent de l'assureur et facture en plus des honoraires à son client, sans mentionner le courtage. Que viole-t-il ?",
      choices: ["Rien, les deux rémunérations sont licites", "Son devoir de transparence sur les rémunérations reçues de tiers et la gestion des conflits d'intérêts", "L'interdiction du cumul des statuts", "La LBA"],
      answer: [1],
      explain: "Cumuler honoraires et courtages n'est pas interdit en soi, mais le client mandant doit être informé des indemnités de tiers et donner son accord pour que le courtier les conserve." },

    /* --------- c7 : réassurance --------- */
    { id: 'm1c7h01', chap: 'c7', type: 'single',
      q: "Traité XL : priorité CHF 2 millions, garantie CHF 8 millions au-delà. Deux sinistres distincts de 3 et 11 millions surviennent. Combien le réassureur verse-t-il au total ?",
      choices: ["CHF 9 millions", "CHF 12 millions", "CHF 14 millions", "CHF 8 millions"],
      answer: [0],
      explain: "Premier sinistre : 3 − 2 = 1 million. Second : la tranche va de 2 à 10 millions, soit 8 millions (le solde de 1 million au-dessus de 10 reste à la cédante). Total : 1 + 8 = CHF 9 millions." },

    { id: 'm1c7h02', chap: 'c7', type: 'single',
      q: "Une cédante conserve un plein de CHF 500 000.– et cède le surplus en excédent de plein. Sur un risque de CHF 2 millions frappé d'un sinistre de CHF 800 000.–, quelle part supporte le réassureur ?",
      choices: ["CHF 300 000.–", "CHF 600 000.–", "CHF 200 000.–", "CHF 800 000.–"],
      answer: [1],
      explain: "La cession porte sur 1,5 million sur 2 millions, soit 75 %. En réassurance proportionnelle, le sinistre se partage dans la même proportion : 800 000 × 75 % = CHF 600 000.–." },

    { id: 'm1c7h03', chap: 'c7', type: 'single',
      q: "Quel montage protège le mieux un assureur contre une accumulation de milliers de petits dommages causés par une même tempête ?",
      choices: ["Un excess of loss par risque", "Un excess of loss par événement", "Une quote-part de 20 %", "Une couverture facultative"],
      answer: [1],
      explain: "Par risque, chaque petit sinistre resterait sous la priorité et rien ne serait couvert. L'XL par événement additionne tous les dommages d'un même événement avant d'appliquer la priorité." },

    { id: 'm1c7h04', chap: 'c7', type: 'single',
      q: "Une cédante en forte croissance manque de fonds propres et cherche aussi un allègement de ses frais d'acquisition. Quelle forme de réassurance répond le mieux ?",
      choices: ["Un stop loss", "Une quote-part, assortie d'une commission de réassurance", "Un excess of loss par événement", "Une rétrocession"],
      answer: [1],
      explain: "La quote-part cède une part des primes et donc du besoin de capital, et la commission de réassurance rembourse une partie des frais d'acquisition : c'est le montage classique du financement de la croissance." },

    /* --------- c8 : surveillance --------- */
    { id: 'm1c8h01', chap: 'c8', type: 'single',
      q: "Un assureur affiche un ratio SST de 180 % mais une provision pour sinistres manifestement insuffisante. Quelle lecture est correcte ?",
      choices: ["Tout va bien, le SST suffit", "Le ratio SST est trompeur : des provisions sous-évaluées gonflent artificiellement le capital porteur de risque", "Le SST ne concerne pas les provisions", "La FINMA ne peut rien exiger"],
      answer: [1],
      explain: "Les provisions sont au passif : les sous-évaluer augmente mécaniquement les fonds propres apparents. C'est pourquoi la LSA exige un actuaire responsable garant de leur suffisance." },

    { id: 'm1c8h02', chap: 'c8', type: 'multi',
      q: "Un assuré n'obtient pas la prestation qu'il estime due. Quelles affirmations sont exactes ?",
      choices: ["L'Ombudsman peut être saisi gratuitement mais ne rend pas de décision", "La FINMA ne tranche pas ce litige contractuel", "Le preneur consommateur peut agir au for de son domicile", "La FINMA peut ordonner le paiement si le montant dépasse CHF 100 000.–", "Un comportement systématiquement abusif peut néanmoins intéresser la FINMA"],
      answer: [0, 1, 2, 4],
      explain: "La FINMA ne dispose d'aucune compétence pour ordonner une prestation, quel que soit le montant : elle agit sur le plan de la surveillance, pas du contrat." },

    { id: 'm1c8h03', chap: 'c8', type: 'single',
      q: "Un assureur tombe en faillite. Dans quel ordre les prétentions issues des contrats d'assurance sont-elles servies ?",
      choices: ["Après les créanciers ordinaires", "En priorité sur la fortune liée, qui leur est spécialement affectée", "À égalité avec les actionnaires", "Elles sont reprises par la Confédération"],
      answer: [1],
      explain: "La fortune liée est un patrimoine séparé affecté aux engagements d'assurance : c'est le mécanisme central de protection des assurés, distinct du fonds d'organisation et du capital." },

    { id: 'm1c8h04', chap: 'c8', type: 'single',
      q: "Quelle affirmation sur le champ de la surveillance est exacte ?",
      choices: ["La FINMA surveille l'assurance-maladie de base et les complémentaires", "L'OFSP surveille l'assurance de base, la FINMA les complémentaires", "Les cantons surveillent les complémentaires", "L'ASA surveille les deux"],
      answer: [1],
      explain: "Cette répartition suit la nature juridique : la base est une assurance sociale de droit public, les complémentaires des contrats privés soumis à la LCA." }
  ]);
})();
