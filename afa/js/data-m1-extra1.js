/* =============================================================
   AFA – Module 1, questions supplémentaires : chapitres 1 et 2
   (Risque et gestion des risques / Principes techniques)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m1', [
    /* ================= c1 — Risque et gestion des risques ================= */
    { id: 'm1c1x01', chap: 'c1', type: 'multi',
      q: "Quelles composantes caractérisent un risque ?",
      choices: ["La probabilité de survenance", "L'ampleur du dommage possible", "Le montant de la prime", "L'aléa", "Le nom de l'assureur"],
      answer: [0, 1, 3],
      explain: "Un risque se décrit par sa fréquence, son intensité et son caractère incertain. La prime est la conséquence de cette analyse, pas une composante du risque." },

    { id: 'm1c1x02', chap: 'c1', type: 'single',
      q: "L'achat d'actions en bourse constitue :",
      choices: ["Un risque pur", "Un risque spéculatif", "Un risque de cumul", "Un risque subjectif"],
      answer: [1],
      explain: "Le placement peut produire un gain comme une perte : c'est un risque spéculatif, donc non assurable. L'assurance ne couvre que les risques qui ne peuvent produire qu'une perte." },

    { id: 'm1c1x03', chap: 'c1', type: 'single',
      q: "Le risque d'invalidité appartient à quelle catégorie ?",
      choices: ["Risque de chose", "Risque de personne", "Risque de patrimoine", "Risque spéculatif"],
      answer: [1],
      explain: "L'invalidité frappe la personne dans son intégrité et sa capacité de gain : c'est un risque de personne, au même titre que le décès, la maladie ou la vieillesse." },

    { id: 'm1c1x04', chap: 'c1', type: 'single',
      q: "Un tremblement de terre qui endommage des milliers de bâtiments assurés illustre :",
      choices: ["Un risque individuel", "Un risque de cumul", "Un risque spéculatif", "Un risque subjectif"],
      answer: [1],
      explain: "Un même événement frappe simultanément un très grand nombre de contrats : la compensation dans l'espace ne joue plus. C'est pourquoi ces risques exigent réassurance et pools." },

    { id: 'm1c1x05', chap: 'c1', type: 'single',
      q: "Renoncer à organiser un concert en plein air pour ne pas subir le risque météo relève de quelle stratégie ?",
      choices: ["Éviter le risque", "Réduire le risque", "Transférer le risque", "Assumer le risque"],
      answer: [0],
      explain: "Abandonner l'activité elle-même supprime le risque à la source : c'est l'évitement. C'est la stratégie la plus radicale, et souvent la moins réaliste économiquement." },

    { id: 'm1c1x06', chap: 'c1', type: 'single',
      q: "Conclure un contrat d'assurance correspond à quelle stratégie de traitement ?",
      choices: ["Éviter", "Réduire", "Transférer", "Assumer"],
      answer: [2],
      explain: "L'assurance transfère les conséquences financières du risque à un tiers contre une prime. Le risque lui-même subsiste : seule sa charge économique est déplacée." },

    { id: 'm1c1x07', chap: 'c1', type: 'single',
      q: "Une entreprise qui constitue une provision comptable pour ses petits sinistres :",
      choices: ["Évite le risque", "Assume le risque", "Transfère le risque", "Réduit le risque"],
      answer: [1],
      explain: "Elle garde le risque à sa charge et le finance sur ses propres moyens : c'est l'auto-assurance, une forme d'acceptation consciente du risque." },

    { id: 'm1c1x08', chap: 'c1', type: 'single',
      q: "Quelle combinaison correspond typiquement au domaine de l'assurance ?",
      choices: ["Fréquence élevée / intensité faible", "Fréquence faible / intensité élevée", "Fréquence élevée / intensité élevée", "Fréquence faible / intensité faible"],
      answer: [1],
      explain: "L'assurance est faite pour les événements rares mais lourds, qu'un particulier ne pourrait pas supporter seul. Les risques fréquents et lourds sont souvent inassurables." },

    { id: 'm1c1x09', chap: 'c1', type: 'single',
      q: "Un risque fréquent ET de très forte intensité est en général :",
      choices: ["Assuré à prime réduite", "Inassurable ou assurable seulement à des conditions restrictives", "Traité en assurance de sommes", "Pris en charge par l'Ombudsman"],
      answer: [1],
      explain: "La prime devrait alors couvrir presque intégralement le dommage attendu : elle deviendrait économiquement insupportable. La condition d'assurabilité économique n'est plus remplie." },

    { id: 'm1c1x10', chap: 'c1', type: 'single',
      q: "L'assurance d'une amende pénale est :",
      choices: ["Possible en RC d'entreprise", "Impossible, car contraire à l'ordre juridique", "Possible avec une surprime", "Possible uniquement pour les personnes morales"],
      answer: [1],
      explain: "Une sanction pénale est personnelle et vise à punir : en assurer le paiement viderait la peine de son sens. Le risque doit être licite pour être assurable." },

    { id: 'm1c1x11', chap: 'c1', type: 'multi',
      q: "Quelles étapes composent le cycle de gestion des risques ?",
      choices: ["Identification", "Analyse et évaluation", "Traitement", "Contrôle et suivi", "Facturation"],
      answer: [0, 1, 2, 3],
      explain: "Le risk management est un cycle en quatre temps qui se répète : ce qui a été traité doit être surveillé, car les risques évoluent avec l'activité." },

    { id: 'm1c1x12', chap: 'c1', type: 'single',
      q: "Le « sinistre maximal possible » (SMP) désigne :",
      choices: ["Le sinistre moyen constaté sur cinq ans", "Le dommage le plus grave concevable si toutes les circonstances défavorables se cumulent", "La somme d'assurance convenue", "La limite d'intervention du réassureur"],
      answer: [1],
      explain: "Le SMP correspond au scénario catastrophe, toutes protections supposées défaillantes. Il sert à dimensionner la capacité de souscription et la réassurance." },

    { id: 'm1c1x13', chap: 'c1', type: 'single',
      q: "Installer un détecteur de fumée est une mesure de :",
      choices: ["Prévention et protection (réduction du risque)", "Transfert du risque", "Évitement du risque", "Acceptation du risque"],
      answer: [0],
      explain: "Les mesures techniques et organisationnelles réduisent la probabilité ou l'ampleur du sinistre. Elles se traduisent fréquemment par des rabais de prime." },

    { id: 'm1c1x14', chap: 'c1', type: 'single',
      q: "L'« aléa moral » (risque subjectif) désigne le fait que :",
      choices: ["L'assuré devient moins prudent parce qu'il est assuré", "L'assureur refuse certains risques", "Le réassureur limite son engagement", "Les statistiques sont incomplètes"],
      answer: [0],
      explain: "Se sachant couvert, l'assuré peut relâcher sa vigilance. Franchises, bonus-malus et obligations de prévention servent précisément à contrer ce phénomène." },

    { id: 'm1c1x15', chap: 'c1', type: 'multi',
      q: "Lesquels sont des risques de patrimoine ?",
      choices: ["La responsabilité civile", "La perte d'exploitation", "L'incendie d'un bâtiment", "La protection juridique", "Le décès"],
      answer: [0, 1, 3],
      explain: "L'incendie touche une chose et le décès une personne. Les risques de patrimoine frappent la fortune sans destruction d'un bien déterminé." },

    { id: 'm1c1x16', chap: 'c1', type: 'single',
      q: "Pourquoi l'indépendance des risques est-elle une condition d'assurabilité ?",
      choices: ["Pour permettre la compensation entre un grand nombre de cas non corrélés", "Pour réduire les frais administratifs", "Pour éviter la double assurance", "Pour faciliter la subrogation"],
      answer: [0],
      explain: "Si tous les risques se réalisaient ensemble, la mutualité s'effondrerait : la caisse commune serait vidée d'un coup. C'est le problème des risques de cumul." },

    { id: 'm1c1x17', chap: 'c1', type: 'single',
      q: "Le risque de longévité consiste à :",
      choices: ["Mourir prématurément", "Vivre plus longtemps que ses ressources ne le permettent", "Perdre son emploi", "Devenir invalide"],
      answer: [1],
      explain: "C'est le risque de survivre à son capital : il est couvert par les rentes viagères et la prévoyance vieillesse, le miroir du risque de décès prématuré." },

    { id: 'm1c1x18', chap: 'c1', type: 'single',
      q: "La franchise contractuelle est un instrument :",
      choices: ["De transfert intégral du risque", "De participation de l'assuré, donc d'acceptation partielle du risque", "De réassurance proportionnelle", "De surveillance prudentielle"],
      answer: [1],
      explain: "L'assuré garde à sa charge la première tranche du dommage. Cela réduit la prime, écarte les petits sinistres coûteux à gérer et limite l'aléa moral." },

    { id: 'm1c1x19', chap: 'c1', type: 'single',
      q: "Un dommage causé intentionnellement par l'assuré est :",
      choices: ["Couvert avec réduction de prestation", "Non couvert, car l'aléa fait défaut", "Couvert si la prime est payée", "Couvert par la réassurance"],
      answer: [1],
      explain: "Sans incertitude, il n'y a pas de risque assurable : provoquer volontairement le sinistre supprime l'aléa et exclut toute prestation." },

    { id: 'm1c1x20', chap: 'c1', type: 'single',
      q: "Une matrice des risques croise habituellement :",
      choices: ["Prime et sinistres", "Fréquence et intensité", "Actif et passif", "Assuré et assureur"],
      answer: [1],
      explain: "En positionnant chaque risque selon sa probabilité et sa gravité, la matrice indique immédiatement la stratégie de traitement adaptée." },

    { id: 'm1c1x21', chap: 'c1', type: 'multi',
      q: "Quelles caractéristiques rendent le risque cyber difficile à assurer ?",
      choices: ["Un fort potentiel de cumul mondial", "Un manque de recul statistique", "L'évolution rapide des menaces", "Le fait qu'il s'agisse d'un risque spéculatif", "Son caractère toujours intentionnel de la part de l'assuré"],
      answer: [0, 1, 2],
      explain: "Le cyber reste un risque pur pour la victime, mais une même faille peut frapper le monde entier et les statistiques manquent de profondeur historique." },

    { id: 'm1c1x22', chap: 'c1', type: 'single',
      q: "Le risque « objectif » se rapporte :",
      choices: ["Au comportement de l'assuré", "Aux caractéristiques matérielles et techniques de l'objet ou de l'activité", "À la solvabilité de l'assureur", "Au montant de la franchise"],
      answer: [1],
      explain: "Mode de construction, matériaux, situation géographique, procédés industriels : autant d'éléments objectifs mesurables, indépendants de la personne assurée." },

    { id: 'm1c1x23', chap: 'c1', type: 'single',
      q: "Pourquoi un risque doit-il être mesurable pour être assurable ?",
      choices: ["Pour calculer une prime correspondant au risque réel", "Pour respecter le droit de timbre", "Pour permettre la révocation du contrat", "Pour établir la police"],
      answer: [0],
      explain: "Sans données sur la fréquence et le coût moyen, l'assureur ne peut pas fixer une prime suffisante : il exposerait la communauté des assurés à l'insolvabilité." },

    { id: 'm1c1x24', chap: 'c1', type: 'single',
      q: "Une entreprise de transport confie ses livraisons à un sous-traitant qui assume les dommages. Il s'agit :",
      choices: ["D'une réduction du risque", "D'un transfert contractuel du risque", "D'un évitement du risque", "D'une auto-assurance"],
      answer: [1],
      explain: "Le transfert ne passe pas nécessairement par une assurance : une clause contractuelle peut déplacer la charge du risque vers un partenaire." },

    { id: 'm1c1x25', chap: 'c1', type: 'multi',
      q: "Quels risques une assurance privée refuse-t-elle en principe de couvrir ?",
      choices: ["Le risque de guerre", "Les actes intentionnels de l'assuré", "Le vol par effraction", "Les risques nucléaires (hors pools spécifiques)", "L'incendie d'un immeuble"],
      answer: [0, 1, 3],
      explain: "Guerre et nucléaire présentent un potentiel de cumul incontrôlable ; l'acte intentionnel supprime l'aléa. Vol et incendie sont au contraire des risques assurables classiques." },

    { id: 'm1c1x26', chap: 'c1', type: 'single',
      q: "Quelle affirmation sur le risque est correcte ?",
      choices: ["Un risque certain de se réaliser reste assurable", "L'assurance supprime le risque", "L'assurance transfère les conséquences financières du risque", "Le risque disparaît dès la signature de la police"],
      answer: [2],
      explain: "L'assurance ne change rien à la probabilité de l'événement : elle en neutralise l'impact financier pour l'assuré, en le répartissant sur la communauté." },

    { id: 'm1c1x27', chap: 'c1', type: 'single',
      q: "L'homogénéité des risques dans un portefeuille signifie :",
      choices: ["Que tous les assurés paient la même prime", "Que les risques réunis sont de nature et d'ampleur comparables", "Que tous les contrats ont la même durée", "Que l'assureur ne pratique qu'une seule branche"],
      answer: [1],
      explain: "Des risques comparables permettent une statistique fiable. Un portefeuille très hétérogène ne se laisse pas modéliser : d'où l'excédent de plein en réassurance." },

    { id: 'm1c1x28', chap: 'c1', type: 'single',
      q: "Le risque de responsabilité civile se caractérise notamment par :",
      choices: ["Une somme d'assurance toujours égale à la valeur d'un bien", "Un dommage dont l'ampleur est difficile à plafonner à l'avance", "L'absence de tiers lésé", "Son caractère spéculatif"],
      answer: [1],
      explain: "En RC, l'étendue du dommage dépend de la victime et non d'un bien déterminé : d'où les sommes de garantie élevées et les longs délais de règlement." },

    { id: 'm1c1x29', chap: 'c1', type: 'single',
      q: "Que signifie « risque de masse » ?",
      choices: ["Un risque de très grande ampleur individuelle", "Un risque standardisé se présentant en très grand nombre de contrats semblables", "Un risque réservé aux entreprises", "Un risque exclu par la loi"],
      answer: [1],
      explain: "Ménage, RC privée, véhicules : produits standardisés vendus en masse, idéaux pour la loi des grands nombres, par opposition aux grands risques industriels individuels." },

    { id: 'm1c1x30', chap: 'c1', type: 'single',
      q: "Dans le processus de gestion des risques, l'évaluation intervient :",
      choices: ["Avant l'identification", "Après l'identification et avant le traitement", "Après le traitement", "En parallèle du contrôle uniquement"],
      answer: [1],
      explain: "On identifie, puis on mesure fréquence et intensité, ce qui permet ensuite de choisir la stratégie de traitement appropriée, avant de contrôler le dispositif." },

    /* ================= c2 — Principes techniques ================= */
    { id: 'm1c2x01', chap: 'c2', type: 'single',
      q: "La compensation des risques « dans le temps » signifie :",
      choices: ["Que les primes sont payées mensuellement", "Que les bonnes et les mauvaises années se compensent grâce aux provisions", "Que les sinistres sont réglés avec retard", "Que les contrats durent plusieurs années"],
      answer: [1],
      explain: "Les excédents des exercices favorables alimentent des provisions qui absorbent les années défavorables. C'est le rôle de la provision pour fluctuation." },

    { id: 'm1c2x02', chap: 'c2', type: 'multi',
      q: "Par quels moyens l'assureur compense-t-il les risques ?",
      choices: ["Dans l'espace, par un grand nombre de contrats répartis", "Dans le temps, par les provisions", "Par la réassurance", "Par l'augmentation du capital-actions", "Par la publicité"],
      answer: [0, 1, 2],
      explain: "Les trois axes de la compensation sont l'espace, le temps et le partage avec d'autres porteurs de risque. Le capital sert de coussin de solvabilité, pas de compensation." },

    { id: 'm1c2x03', chap: 'c2', type: 'single',
      q: "Une prime de risque de CHF 200.–, un chargement de frais de CHF 45.–, une marge et une sécurité de CHF 15.– donnent une prime commerciale de :",
      choices: ["CHF 200.–", "CHF 245.–", "CHF 260.–", "CHF 275.–"],
      answer: [2],
      explain: "200 + 45 + 15 = CHF 260.–. Le droit de timbre viendrait encore s'ajouter à ce montant pour obtenir la prime effectivement encaissée." },

    { id: 'm1c2x04', chap: 'c2', type: 'single',
      q: "Sur une prime commerciale de CHF 400.– en assurance ménage, quel est le montant du droit de timbre ?",
      choices: ["CHF 10.–", "CHF 20.–", "CHF 30.–", "Aucun, la branche est exonérée"],
      answer: [1],
      explain: "5 % de 400 = CHF 20.–. La prime encaissée s'élève donc à CHF 420.–, le timbre venant s'ajouter à la prime tarifaire." },

    { id: 'm1c2x05', chap: 'c2', type: 'single',
      q: "Une assurance-vie à primes périodiques susceptible de rachat est soumise à quel droit de timbre ?",
      choices: ["5 %", "2,5 %", "1 %", "Elle est exonérée"],
      answer: [3],
      explain: "Seules les assurances-vie susceptibles de rachat financées par prime unique subissent le taux de 2,5 %. Les primes périodiques sont exonérées, pour encourager la prévoyance." },

    { id: 'm1c2x06', chap: 'c2', type: 'single',
      q: "Une assurance-vie à prime unique de CHF 50 000.– supporte un droit de timbre de :",
      choices: ["CHF 500.–", "CHF 1 250.–", "CHF 2 500.–", "Aucun"],
      answer: [1],
      explain: "2,5 % de 50 000 = CHF 1 250.–. C'est le taux réservé aux assurances-vie susceptibles de rachat financées par une prime unique." },

    { id: 'm1c2x07', chap: 'c2', type: 'single',
      q: "Que représente le taux de sinistralité (loss ratio) ?",
      choices: ["Les frais rapportés aux primes", "La charge des sinistres rapportée aux primes", "Les primes rapportées au capital", "Les provisions rapportées aux actifs"],
      answer: [1],
      explain: "Le loss ratio isole la charge des sinistres ; ajouté au taux de frais (expense ratio), il donne le combined ratio." },

    { id: 'm1c2x08', chap: 'c2', type: 'single',
      q: "Un combined ratio de 104 % signifie :",
      choices: ["Un bénéfice technique", "Une perte technique compensée éventuellement par le résultat des placements", "Un excédent de solvabilité", "Une erreur de calcul"],
      answer: [1],
      explain: "Au-delà de 100 %, les sinistres et les frais dépassent les primes. L'exercice peut néanmoins être bénéficiaire si les revenus de placements comblent l'écart." },

    { id: 'm1c2x09', chap: 'c2', type: 'single',
      q: "La provision IBNR couvre :",
      choices: ["Les sinistres survenus mais pas encore déclarés", "Les primes encaissées d'avance", "Les frais de personnel", "Les créances douteuses"],
      answer: [0],
      explain: "« Incurred But Not Reported » : le sinistre s'est produit mais l'assureur l'ignore encore. Essentiel en RC, où les dommages se révèlent parfois des années plus tard." },

    { id: 'm1c2x10', chap: 'c2', type: 'single',
      q: "Le report de primes (primes non acquises) correspond :",
      choices: ["Aux primes impayées", "À la part de prime encaissée qui concerne l'exercice suivant", "Aux primes remboursées", "Aux primes de réassurance"],
      answer: [1],
      explain: "Une prime annuelle encaissée le 1er juillet couvre encore six mois de l'exercice suivant : cette part est provisionnée et ne compte pas dans le résultat de l'année." },

    { id: 'm1c2x11', chap: 'c2', type: 'single',
      q: "La réserve mathématique se rencontre principalement :",
      choices: ["En assurance de choses", "En assurance-vie", "En protection juridique", "En réassurance non proportionnelle"],
      answer: [1],
      explain: "Elle représente la valeur actuelle des engagements futurs de l'assureur-vie, alimentée par la partie épargne des primes, et sert de base à la valeur de rachat." },

    { id: 'm1c2x12', chap: 'c2', type: 'multi',
      q: "Que comprennent les chargements de frais dans la prime ?",
      choices: ["Les frais d'acquisition et commissions", "Les frais de gestion des contrats", "Les frais de traitement des sinistres", "La charge des sinistres elle-même", "Le droit de timbre"],
      answer: [0, 1, 2],
      explain: "La charge des sinistres est couverte par la prime de risque, et le droit de timbre est une taxe ajoutée en fin de calcul, pas un chargement." },

    { id: 'm1c2x13', chap: 'c2', type: 'single',
      q: "Le système bonus-malus en assurance véhicule vise à :",
      choices: ["Financer la réassurance", "Adapter la prime au comportement effectif de l'assuré", "Contourner le droit de timbre", "Remplacer la franchise"],
      answer: [1],
      explain: "Il différencie les primes selon la sinistralité individuelle, réduit l'aléa moral et limite l'antisélection en récompensant les conducteurs sans sinistre." },

    { id: 'm1c2x14', chap: 'c2', type: 'single',
      q: "Pourquoi l'assureur constitue-t-il un supplément de sécurité dans la prime ?",
      choices: ["Pour rémunérer les actionnaires", "Pour absorber les écarts défavorables par rapport aux statistiques", "Pour payer les commissions", "Pour financer la publicité"],
      answer: [1],
      explain: "Les statistiques donnent une espérance, pas une certitude : le supplément de sécurité protège la communauté contre une sinistralité supérieure à la moyenne attendue." },

    { id: 'm1c2x15', chap: 'c2', type: 'single',
      q: "La tarification consiste à :",
      choices: ["Regrouper les assurés en classes de risque homogènes selon des critères objectifs", "Fixer une prime identique pour tous les clients", "Négocier la commission de l'intermédiaire", "Déterminer la valeur de rachat"],
      answer: [0],
      explain: "Chaque classe doit être suffisamment fournie pour rester statistiquement fiable, tout en étant assez fine pour éviter l'antisélection." },

    { id: 'm1c2x16', chap: 'c2', type: 'single',
      q: "Que se passe-t-il si un assureur tarife trop bas par rapport au risque réel ?",
      choices: ["Il attire les bons risques et améliore son résultat", "Il attire les mauvais risques et dégrade sa sinistralité", "Sa solvabilité s'améliore", "Le droit de timbre diminue"],
      answer: [1],
      explain: "Une prime insuffisante attire précisément ceux dont le risque est supérieur à la moyenne tarifée : la sinistralité se dégrade et le portefeuille devient déficitaire." },

    { id: 'm1c2x17', chap: 'c2', type: 'single',
      q: "Le principe de mutualité implique que :",
      choices: ["Chaque assuré récupère exactement ses primes", "Les primes de la communauté financent les sinistres de quelques-uns", "L'assureur garantit un rendement", "Les assurés se connaissent entre eux"],
      answer: [1],
      explain: "La grande majorité des assurés ne touchera jamais de prestation : leur prime finance la sécurité collective, et c'est précisément ce qu'ils achètent." },

    { id: 'm1c2x18', chap: 'c2', type: 'single',
      q: "L'actuaire responsable a notamment pour tâche :",
      choices: ["De vendre les contrats", "De veiller au caractère suffisant des provisions techniques et des tarifs", "De représenter l'assureur en justice", "De surveiller les intermédiaires"],
      answer: [1],
      explain: "La LSA exige un actuaire responsable, garant que les engagements envers les assurés sont correctement évalués et couverts. Il fait rapport à la direction et à la FINMA." },

    { id: 'm1c2x19', chap: 'c2', type: 'single',
      q: "Une franchise fixe de CHF 500.– sur un dommage de CHF 3 000.– donne une indemnité de :",
      choices: ["CHF 3 000.–", "CHF 2 500.–", "CHF 500.–", "CHF 1 500.–"],
      answer: [1],
      explain: "3 000 − 500 = CHF 2 500.–. La franchise fixe se déduit systématiquement du dommage, quel que soit son montant." },

    { id: 'm1c2x20', chap: 'c2', type: 'single',
      q: "La participation aux excédents en assurance-vie signifie que :",
      choices: ["L'assuré supporte les pertes de l'assureur", "L'assuré reçoit une part des résultats favorables (mortalité, frais, placements)", "La prime augmente chaque année", "Le contrat est résilié en cas de bénéfice"],
      answer: [1],
      explain: "Les tarifs vie sont calculés prudemment ; si la réalité est meilleure que les hypothèses, une part de l'écart revient aux preneurs sous forme d'excédents." },

    { id: 'm1c2x21', chap: 'c2', type: 'single',
      q: "Le taux d'intérêt technique en assurance-vie correspond :",
      choices: ["Au taux du marché hypothécaire", "Au rendement minimal garanti pris en compte dans le calcul de la prime", "Au taux de la prime de risque", "Au taux de conversion LPP"],
      answer: [1],
      explain: "Il est fixé prudemment, car l'assureur s'engage sur des décennies. Plus il est bas, plus la prime nécessaire pour un même capital est élevée." },

    { id: 'm1c2x22', chap: 'c2', type: 'multi',
      q: "Quelles primes sont soumises au droit de timbre de 5 % ?",
      choices: ["Assurance ménage", "Assurance RC privée", "Assurance casco", "Assurance-maladie complémentaire", "Assurance-chômage"],
      answer: [0, 1, 2],
      explain: "Les assurances de choses et de patrimoine sont taxées à 5 %. L'assurance-maladie (y compris complémentaire) et l'assurance-chômage sont exonérées." },

    { id: 'm1c2x23', chap: 'c2', type: 'single',
      q: "Que signifie le caractère « quérable » de la prime ?",
      choices: ["Le preneur doit la porter au siège de l'assureur", "L'assureur doit la réclamer au preneur", "Elle est payable en une seule fois", "Elle est indexée chaque année"],
      answer: [1],
      explain: "L'assureur envoie la facture : le preneur n'a pas à s'exécuter spontanément. C'est aussi pourquoi la demeure suppose une sommation formelle." },

    { id: 'm1c2x24', chap: 'c2', type: 'single',
      q: "La prime de risque d'une couverture décès augmente avec l'âge parce que :",
      choices: ["Les frais administratifs croissent", "La probabilité de décès augmente", "Le droit de timbre augmente", "La réserve mathématique diminue"],
      answer: [1],
      explain: "La prime de risque suit la table de mortalité. Dans un contrat à prime constante, le trop-perçu des premières années finance les années suivantes." },

    { id: 'm1c2x25', chap: 'c2', type: 'single',
      q: "Un portefeuille de 10 contrats et un portefeuille de 100 000 contrats similaires : lequel donne le résultat le plus proche de la probabilité théorique ?",
      choices: ["Celui de 10 contrats", "Celui de 100 000 contrats", "Les deux de façon identique", "Cela dépend de la prime"],
      answer: [1],
      explain: "C'est la loi des grands nombres : plus l'effectif est important, plus l'écart entre le résultat observé et la valeur attendue se réduit." },

    { id: 'm1c2x26', chap: 'c2', type: 'single',
      q: "La provision pour fluctuation sert à :",
      choices: ["Financer les acquisitions de l'entreprise", "Absorber les variations de sinistralité entre les exercices", "Rémunérer les intermédiaires", "Couvrir les primes impayées"],
      answer: [1],
      explain: "Elle réalise la compensation des risques dans le temps, en mettant de côté les excédents des bonnes années pour les mauvaises." },

    { id: 'm1c2x27', chap: 'c2', type: 'single',
      q: "Les frais d'acquisition comprennent principalement :",
      choices: ["Les commissions et les coûts de conclusion des contrats", "Le coût des sinistres", "Les impôts sur le bénéfice", "Les provisions techniques"],
      answer: [0],
      explain: "Commissions de l'intermédiaire, publicité, examens médicaux et frais d'établissement de la police : tout ce que coûte la mise en portefeuille d'un contrat." },

    { id: 'm1c2x28', chap: 'c2', type: 'single',
      q: "Sur une prime encaissée, l'ordre de calcul correct est :",
      choices: ["Prime commerciale, puis prime de risque, puis timbre", "Prime de risque, puis chargements, puis timbre", "Timbre, puis prime de risque, puis chargements", "Chargements, puis timbre, puis prime de risque"],
      answer: [1],
      explain: "On part du coût pur du risque, on ajoute sécurité, frais et marge pour obtenir la prime commerciale, et l'on termine par les taxes." },

    { id: 'm1c2x29', chap: 'c2', type: 'single',
      q: "Un assuré ayant une franchise proportionnelle de 10 % (minimum CHF 200.–) subit un dommage de CHF 1 000.–. Sa participation est de :",
      choices: ["CHF 100.–", "CHF 200.–", "CHF 300.–", "CHF 1 000.–"],
      answer: [1],
      explain: "10 % de 1 000 = CHF 100.–, mais le minimum contractuel de CHF 200.– s'applique : l'assuré supporte CHF 200.– et reçoit CHF 800.–." },

    { id: 'm1c2x30', chap: 'c2', type: 'multi',
      q: "Quelles affirmations sur la prime sont exactes ?",
      choices: ["La prime de risque est aussi appelée prime nette", "La prime commerciale inclut les chargements", "Le droit de timbre fait partie de la prime commerciale", "La prime est en principe payable d'avance", "En assurance-vie, la prime peut contenir une part d'épargne"],
      answer: [0, 1, 3, 4],
      explain: "Le droit de timbre s'ajoute après la prime commerciale pour former la prime encaissée : c'est une taxe fédérale, non une composante technique de la prime." }
  ]);
})();
