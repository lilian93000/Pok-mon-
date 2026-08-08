/* =============================================================
   AFA – Module 2 : questions de niveau avancé
   Marquées lvl:'hard' — cas pratiques, délais combinés,
   calculs d'indemnité et pièges de qualification juridique.
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list.map(q => ({ ...q, lvl: 'hard' })));
  };

  add('m2', [
    /* --------- c1 / c2 : bases et CO --------- */
    { id: 'm2c1h01', chap: 'c1', type: 'single',
      q: "Un litige oppose un assuré à sa caisse-maladie sur une prestation de base ET sur sa complémentaire. Devant quelles juridictions doit-il agir ?",
      choices: ["Le tribunal civil pour les deux", "Le tribunal des assurances sociales pour la base, le tribunal civil pour la complémentaire", "Le tribunal administratif pour les deux", "La FINMA pour les deux"],
      answer: [1],
      explain: "La nature juridique commande la compétence : la base est du droit public (LAMal), la complémentaire du droit privé (LCA). Un même sinistre peut donc donner lieu à deux procédures distinctes." },

    { id: 'm2c2h01', chap: 'c2', type: 'single',
      q: "Un agent d'assurance promet oralement à un client une couverture que les conditions générales excluent clairement. Le client subit ensuite ce sinistre. Quel raisonnement s'impose ?",
      choices: ["Les CGA priment toujours, le client n'obtient rien", "L'agent étant un intermédiaire lié agissant pour l'assureur, sa déclaration peut engager celui-ci en vertu de la représentation et de la bonne foi", "Seul l'agent répond personnellement en tout état de cause", "Le contrat est nul"],
      answer: [1],
      explain: "L'agent lié agit au nom de l'assureur : ses déclarations dans les limites de ses pouvoirs — ou d'une procuration apparente — engagent le représenté. La bonne foi protège le client qui s'y est fié." },

    { id: 'm2c2h02', chap: 'c2', type: 'single',
      q: "Une créance en dommages-intérêts pour lésions corporelles naît d'un accident survenu il y a 12 ans ; la victime n'a découvert l'ampleur du dommage et l'identité du responsable qu'il y a 2 ans. La prétention est-elle prescrite ?",
      choices: ["Oui, le délai absolu de 10 ans est dépassé", "Non : le délai relatif de 3 ans court encore et le délai absolu est de 20 ans en cas de lésions corporelles", "Oui, le délai relatif est de 1 an", "Non, ce type de créance est imprescriptible"],
      answer: [1],
      explain: "Depuis la révision du droit de la prescription, le délai absolu passe à 20 ans en cas de mort ou de lésions corporelles, précisément pour les dommages qui se révèlent tardivement." },

    /* --------- c3 : LCA conclusion --------- */
    { id: 'm2c3h01', chap: 'c3', type: 'single',
      q: "Un assureur découvre une réticence 3 ans après la conclusion et résilie 6 semaines après cette découverte. Un sinistre causalement lié était survenu entre-temps. Quelle est la situation ?",
      choices: ["La résiliation est valable et la prestation refusée", "La résiliation est tardive : le délai de 4 semaines dès la connaissance est un délai de péremption, l'assureur reste lié", "La résiliation est nulle car plus de 2 ans se sont écoulés", "L'assureur doit d'abord saisir la FINMA"],
      answer: [1],
      explain: "Deux délais coexistent : 4 semaines dès la connaissance et 5 ans dès la conclusion. Ici le délai long est respecté mais le délai court est dépassé : l'assureur perd son droit." },

    { id: 'm2c3h02', chap: 'c3', type: 'single',
      q: "Un proposant omet de déclarer une hypertension. Il décède deux ans plus tard d'un accident de montagne. L'assureur découvre l'omission. Que peut-il faire ?",
      choices: ["Refuser le capital décès", "Résilier le contrat pour l'avenir, mais il doit la prestation faute de causalité entre l'hypertension et le décès", "Réduire la prestation de moitié", "Invoquer la prétention frauduleuse"],
      answer: [1],
      explain: "C'est l'apport central de la révision de 2022 : sans lien de causalité entre le fait tu et le sinistre, l'assureur doit payer. Il ne conserve que le droit de résilier pour l'avenir." },

    { id: 'm2c3h03', chap: 'c3', type: 'single',
      q: "Un client signe une proposition le 1er mars, reçoit la police le 10 mars et souhaite tout annuler le 12 mars. Quelle est sa position ?",
      choices: ["Il est engagé jusqu'à la fin de la première année", "Il peut révoquer : le délai de 14 jours court dès sa proposition et n'est pas encore écoulé", "Il doit invoquer une réticence", "Il ne peut agir qu'en résiliation ordinaire après trois ans"],
      answer: [1],
      explain: "Le délai de révocation de l'art. 2a LCA court dès la proposition ou l'acceptation par le preneur, soit ici depuis le 1er mars : au 12 mars, il reste dans les quatorze jours." },

    { id: 'm2c3h04', chap: 'c3', type: 'multi',
      q: "Une police reçue diverge de ce qui a été convenu et le preneur ne réagit pas. Quelles affirmations sont exactes depuis 2022 ?",
      choices: ["L'ancien art. 12 LCA et sa fiction d'approbation ont été abrogés", "Le silence pendant quatre semaines ne vaut plus acceptation", "C'est l'accord réel des parties qui prime", "La police est une condition de validité du contrat", "Le preneur peut encore invoquer la divergence au-delà de quatre semaines"],
      answer: [0, 1, 2, 4],
      explain: "La police n'a jamais été une condition de validité : elle constate le contrat. La révision a supprimé la fiction d'approbation, qui pénalisait le preneur peu attentif." },

    /* --------- c4 : vie du contrat --------- */
    { id: 'm2c4h01', chap: 'c4', type: 'single', lvl: 'hard', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, suspension et sinistre",
      q: "Prime échue le 1er avril et impayée, sommation régulière envoyée le 20 avril, sinistre le 8 mai, paiement le 15 mai. Quelle est l'issue ?",
      choices: [
        "Le sinistre est couvert, la prime ayant finalement été payée",
        "Le sinistre n'est pas couvert : la couverture était suspendue depuis le 5 mai",
        "Le sinistre est couvert à concurrence de la moitié de l'indemnité",
        "Le contrat était déjà éteint au jour du sinistre",
      ],
      answer: [1],
      explain: "Les quatorze jours courent dès l'envoi du 20 avril, donc jusqu'au 4 mai : la suspension commence le 5 mai et le sinistre du 8 mai tombe dedans. Le paiement du 15 mai rétablit la couverture pour l'avenir seulement." },

    { id: 'm2c4h02', chap: 'c4', type: 'single', lvl: 'hard', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, inaction de l'assureur",
      q: "L'assureur reste inactif pendant trois mois après l'expiration du délai de sommation. Quelle en est la conséquence ?",
      choices: [
        "La couverture reprend automatiquement son plein effet",
        "Il est censé s'être départi du contrat et renonce à la prime arriérée",
        "Il conserve cinq ans pour agir en recouvrement",
        "Le contrat se reconduit tacitement pour une nouvelle période",
      ],
      answer: [1],
      explain: "Le délai de deux mois est un délai de péremption : passé ce terme, la présomption de départ joue et rien ne la renverse. L'assureur perd donc à la fois le contrat et sa créance." },

    { id: 'm2c4h03', chap: 'c4', type: 'single',
      q: "Un contrat d'assurance ménage est conclu le 1.1.2024 pour une durée de 5 ans. Quelle est la première échéance à laquelle le preneur peut le résilier ordinairement, et avec quel préavis ?",
      choices: ["31.12.2024, préavis 1 mois", "31.12.2026, préavis 3 mois", "31.12.2028, préavis 3 mois", "En tout temps, préavis 1 mois"],
      answer: [1],
      explain: "L'art. 35a LCA permet de résilier pour la fin de la 3e année d'assurance, soit le 31.12.2026, moyennant un préavis de trois mois — donc une résiliation notifiée au plus tard fin septembre 2026." },

    { id: 'm2c4h04', chap: 'c4', type: 'multi',
      q: "Un assuré omet d'annoncer qu'il a transformé son garage en atelier de menuiserie. Un incendie s'y déclare. Quels éléments l'assureur devra-t-il établir pour refuser sa prestation ?",
      choices: ["Que l'aggravation est essentielle, c'est-à-dire qu'elle porte sur un fait ayant fait l'objet d'une question", "Qu'elle résulte du fait du preneur", "Qu'il existe un lien entre le risque aggravé et le sinistre", "Que le dommage dépasse CHF 50 000.–", "Que le preneur a agi frauduleusement"],
      answer: [0, 1, 2],
      explain: "Ni seuil financier ni fraude ne sont requis. Il faut une aggravation essentielle imputable au preneur et un rapport entre cette aggravation et le sinistre survenu." },

    /* --------- c5 : sinistre --------- */
    { id: 'm2c5h01', chap: 'c5', type: 'single',
      q: "Un assuré déclare un vol réel de CHF 9 000.– mais y ajoute un ordinateur qu'il n'a jamais possédé, pour CHF 1 500.–. Quelle est la conséquence exacte ?",
      choices: ["Il touche CHF 9 000.–", "Il touche CHF 10 500.– moins la franchise", "Il perd la totalité de son droit pour ce sinistre, y compris les CHF 9 000.– honnêtes", "Il subit une réduction proportionnelle de 15 %"],
      answer: [2],
      explain: "L'art. 40 LCA sanctionne intégralement la prétention frauduleuse : la part honnête tombe aussi. L'assureur peut de surcroît résilier le contrat, et une procédure pénale reste possible." },

    { id: 'm2c5h02', chap: 'c5', type: 'single',
      q: "Une clause des CGA exclut « les dommages survenant dans des circonstances particulières ». Comment un tribunal traitera-t-il cette clause ?",
      choices: ["Il l'appliquera littéralement", "Il l'écartera ou l'interprétera en faveur de l'assuré, faute d'exclusion précise et non équivoque au sens de l'art. 33 LCA", "Il demandera l'avis de la FINMA", "Il annulera tout le contrat"],
      answer: [1],
      explain: "L'art. 33 LCA impose des exclusions précises et non équivoques ; à défaut, la règle « in dubio contra stipulatorem » fait supporter l'ambiguïté à l'assureur qui a rédigé le texte." },

    { id: 'm2c5h03', chap: 'c5', type: 'single',
      q: "Un assuré annonce son sinistre 5 ans et 2 mois après sa survenance. Aucun acte interruptif n'est intervenu. Quelle est la situation ?",
      choices: ["La créance est prescrite ; l'assureur doit toutefois invoquer la prescription, le juge ne la relève pas d'office", "Le juge écarte la demande d'office", "La créance reste exigible pendant 10 ans", "La prescription est de 2 ans, elle est acquise depuis longtemps"],
      answer: [0],
      explain: "Le délai de l'art. 46 LCA est de 5 ans, dépassé ici. Mais la prescription est une exception : si l'assureur ne l'invoque pas, il devra payer malgré l'écoulement du temps." },

    { id: 'm2c5h04', chap: 'c5', type: 'multi',
      q: "Qui supporte la charge de la preuve, et de quoi, dans un litige de couverture ?",
      choices: ["L'assuré prouve la survenance du sinistre et son montant", "L'assureur prouve les faits constitutifs d'une exclusion", "L'assureur prouve la faute grave qu'il invoque pour réduire", "L'assuré prouve l'absence de toute exclusion", "L'assureur prouve l'intention de tromper en cas d'art. 40 LCA"],
      answer: [0, 1, 2, 4],
      explain: "Nul n'a à prouver un fait négatif : l'assuré établit son droit, l'assureur établit tout ce qui l'éteint ou le réduit (exclusion, faute grave, fraude). C'est l'application de l'art. 8 CC." },

    /* --------- c6 : calculs d'indemnité --------- */
    { id: 'm2c6h01', chap: 'c6', type: 'single',
      q: "Mobilier d'une valeur de CHF 180 000.– assuré pour CHF 120 000.–. Dommage de CHF 27 000.–, franchise de CHF 1 000.–. Quelle indemnité l'assureur verse-t-il ?",
      choices: ["CHF 26 000.–", "CHF 18 000.–", "CHF 17 000.–", "CHF 16 333.–"],
      answer: [2],
      explain: "Règle proportionnelle d'abord : 27 000 × (120 000/180 000) = CHF 18 000.–. Puis la franchise : 18 000 − 1 000 = CHF 17 000.–. L'ordre compte, l'inverse donnerait CHF 17 333.–." },

    { id: 'm2c6h02', chap: 'c6', type: 'single',
      q: "Même situation, mais le contrat contient une clause de renonciation à la sous-assurance (premier risque) avec un plafond de CHF 120 000.–. Quelle indemnité ?",
      choices: ["CHF 17 000.–", "CHF 26 000.–", "CHF 18 000.–", "CHF 27 000.–"],
      answer: [1],
      explain: "La clause écarte la règle proportionnelle : le dommage est indemnisé intégralement jusqu'au plafond, sous déduction de la franchise, soit 27 000 − 1 000 = CHF 26 000.–." },

    { id: 'm2c6h03', chap: 'c6', type: 'single',
      q: "Un bien vaut CHF 300 000.–. Il est assuré chez A pour CHF 200 000.– et chez B pour CHF 250 000.–, sans que les assureurs en aient été avisés. Un dommage de CHF 150 000.– survient. Que peut réclamer l'assuré au total ?",
      choices: ["CHF 450 000.–", "CHF 300 000.–", "CHF 150 000.– au maximum, les assureurs répondant solidairement", "Rien, la double assurance est nulle"],
      answer: [2],
      explain: "Le principe indemnitaire plafonne la prestation au dommage effectif : jamais plus de CHF 150 000.–. Les assureurs répondent solidairement et se répartissent la charge, mais le défaut d'avis peut les libérer." },

    { id: 'm2c6h04', chap: 'c6', type: 'single',
      q: "Un assureur indemnise son assuré pour CHF 40 000.–. Le tiers responsable n'est solvable qu'à hauteur de CHF 30 000.–, alors que le dommage total de l'assuré s'élevait à CHF 55 000.–. Comment les CHF 30 000.– se répartissent-ils ?",
      choices: ["Entièrement à l'assureur, par subrogation", "CHF 15 000.– à l'assuré pour son découvert, puis le solde à l'assureur", "Par moitié", "Entièrement à l'assuré"],
      answer: [1],
      explain: "L'assuré est désintéressé en priorité pour la part de dommage non couverte (55 000 − 40 000 = 15 000). L'assureur ne récupère que le solde, soit CHF 15 000.–, et supporte le risque d'insolvabilité." },

    { id: 'm2c6h05', chap: 'c6', type: 'single',
      q: "Un objet valant CHF 12 000.– est assuré pour CHF 20 000.–, la surassurance ayant été convenue sciemment pour toucher davantage. L'objet est détruit. Que se passe-t-il ?",
      choices: ["L'assureur verse CHF 12 000.–", "L'assureur verse CHF 20 000.–", "Le contrat n'oblige pas l'assureur, la surassurance étant frauduleuse", "L'assureur verse CHF 16 000.–"],
      answer: [2],
      explain: "Une surassurance simple donne lieu au versement du seul dommage effectif ; mais conclue dans une intention de fraude, elle libère l'assureur de toute obligation (art. 51 LCA)." },

    { id: 'm2c6h06', chap: 'c6', type: 'multi',
      q: "Dans quels cas l'assureur qui a indemnisé ne pourra pas récupérer sa prestation auprès d'un tiers ?",
      choices: ["Lorsqu'il s'agit d'une assurance de sommes", "Lorsque le responsable est le conjoint vivant en ménage commun, sans faute grave", "Lorsque l'assuré a compromis les droits contre le responsable — il subit alors une réduction", "Lorsque le tiers est un locataire", "Lorsque le dommage dépasse la somme d'assurance"],
      answer: [0, 1],
      explain: "Le locataire est un tiers responsable ordinaire. Quant à l'assuré qui compromet le recours, cela n'empêche pas la subrogation : cela justifie une réduction de sa propre indemnité." },

    /* --------- c7 : responsabilité civile --------- */
    { id: 'm2c7h01', chap: 'c7', type: 'single',
      q: "Un chien s'échappe d'un jardin mal clôturé et provoque un accident de la circulation. Le détenteur du chien prouve avoir vérifié la clôture le matin même. Quelle est sa situation ?",
      choices: ["Il répond sans échappatoire, la responsabilité étant causale aggravée", "Il peut se libérer par la preuve libératoire de l'art. 56 CO s'il établit avoir pris tous les soins commandés", "Il ne répond que si une faute est prouvée par le lésé", "La responsabilité incombe au détenteur du véhicule uniquement"],
      answer: [1],
      explain: "L'art. 56 CO institue une causale simple : la diligence prouvée exonère. La causale aggravée de l'art. 58 LCR pèse en parallèle sur le détenteur du véhicule, d'où un possible concours de responsabilités." },

    { id: 'm2c7h02', chap: 'c7', type: 'single',
      q: "Un conducteur ivre blesse un piéton. L'assureur RC indemnise la victime, puis veut agir contre son assuré. Quel raisonnement est correct ?",
      choices: ["L'assureur pouvait réduire l'indemnité versée au piéton en raison de la faute grave", "L'assureur devait indemniser intégralement le piéton, les exceptions du contrat ne lui étant pas opposables, puis exercer un recours contre l'assuré", "L'assureur pouvait refuser toute prestation", "Le piéton devait d'abord poursuivre le conducteur"],
      answer: [1],
      explain: "La protection du lésé est absolue en RC véhicule obligatoire : action directe et inopposabilité des exceptions. La sanction de la faute grave se règle ensuite entre l'assureur et son assuré, par le recours." },

    { id: 'm2c7h03', chap: 'c7', type: 'multi',
      q: "Une balustrade vétuste cède dans un immeuble locatif et blesse un visiteur. Quelles bases de responsabilité peuvent entrer en jeu ?",
      choices: ["Art. 58 CO – responsabilité du propriétaire d'ouvrage", "Art. 41 CO si une faute personnelle est établie contre un intervenant", "Art. 55 CO si un employé d'une entreprise d'entretien a mal exécuté sa tâche", "Art. 58 LCR", "LRFP contre le fabricant si la balustrade présentait un défaut de fabrication"],
      answer: [0, 1, 2, 4],
      explain: "L'art. 58 LCR ne concerne que les véhicules à moteur. Les autres fondements peuvent se cumuler, le lésé choisissant celui qui lui est le plus favorable en termes de preuve." },

    { id: 'm2c7h04', chap: 'c7', type: 'single',
      q: "Un piéton traverse hors passage en regardant son téléphone et est renversé. Quel effet sa faute produit-elle sur son indemnisation par le détenteur ?",
      choices: ["Aucun : la responsabilité causale aggravée est absolue", "Elle peut réduire l'indemnité, et l'exclure si elle est si grave qu'elle rompt le lien de causalité adéquate", "Elle transfère la responsabilité au piéton uniquement", "Elle double le tort moral"],
      answer: [1],
      explain: "Même en causale aggravée, la faute grave du lésé est un facteur de réduction, voire d'interruption du lien de causalité — au même titre que la force majeure ou la faute grave d'un tiers." },

    { id: 'm2c7h05', chap: 'c7', type: 'single',
      q: "Deux entreprises causent conjointement un dommage de CHF 300 000.–, l'une par faute grave, l'autre par faute légère. Que peut faire le lésé ?",
      choices: ["Réclamer CHF 150 000.– à chacune", "Réclamer l'intégralité à l'une d'elles, la répartition interne se faisant ensuite selon la gravité des fautes", "Ne poursuivre que celle qui a commis la faute grave", "Rien avant un jugement pénal"],
      answer: [1],
      explain: "La solidarité protège le lésé, qui n'a pas à supporter la difficulté de la répartition ni l'insolvabilité éventuelle de l'un des coresponsables. Le partage se règle entre eux par l'action récursoire." },

    /* --------- c8 : LSA, LPD, LBA --------- */
    { id: 'm2c8h01', chap: 'c8', type: 'single',
      q: "Un courtier reçoit une demande de son client souhaitant verser CHF 400 000.– en espèces sur une assurance-vie à prime unique, sans expliquer l'origine des fonds. Quelle est la marche à suivre ?",
      choices: ["Refuser l'affaire et prévenir le client de ses soupçons", "Procéder aux clarifications sur l'origine des fonds et, si le soupçon subsiste, communiquer au MROS sans informer le client", "Communiquer immédiatement au PFPDT", "Accepter, l'assurance-vie n'étant pas soumise à la LBA"],
      answer: [1],
      explain: "L'assurance-vie directe est soumise à la LBA. Le risque accru impose des clarifications particulières, puis une communication au MROS avec blocage — et l'interdiction absolue d'avertir le client." },

    { id: 'm2c8h02', chap: 'c8', type: 'multi',
      q: "Un assureur subit une fuite de données touchant des questionnaires de santé. Quelles obligations en découlent ?",
      choices: ["Annoncer au PFPDT dans les meilleurs délais si le risque pour les personnes est élevé", "Informer les personnes concernées lorsque leur protection l'exige", "Documenter l'incident", "Annoncer au MROS", "Demander l'autorisation de la FINMA avant d'informer"],
      answer: [0, 1, 2],
      explain: "Le MROS ne traite que le blanchiment. Les données de santé étant sensibles, le risque est en principe élevé et déclenche l'annonce au préposé fédéral." },

    { id: 'm2c8h03', chap: 'c8', type: 'single',
      q: "Un intermédiaire souhaite conseiller librement ses clients tout en gardant un contrat d'agence avec un assureur pour une gamme de produits. Que dit la LSA ?",
      choices: ["C'est admis s'il l'indique dans sa documentation", "C'est interdit : le cumul des statuts lié et non lié n'est pas admis", "C'est admis avec l'accord de la FINMA", "C'est admis uniquement en assurance de choses"],
      answer: [1],
      explain: "Le conflit d'intérêts serait structurel et permanent. L'intermédiaire doit choisir : défendre le client (non lié, inscrit au registre) ou représenter l'assureur (lié)." },

    { id: 'm2c8h04', chap: 'c8', type: 'single',
      q: "Un client demande à un assureur d'effacer toutes ses données alors qu'un litige de sinistre est pendant. L'assureur peut-il refuser ?",
      choices: ["Non, le droit à l'effacement est absolu", "Oui, dans la mesure où la conservation reste nécessaire à l'exécution du contrat, à la défense en justice ou imposée par la loi", "Oui, mais seulement avec l'accord du PFPDT", "Non, il doit tout effacer sous 30 jours"],
      answer: [1],
      explain: "Le droit à l'effacement cède devant un motif justificatif : obligation légale de conservation, nécessité contractuelle ou constatation d'un droit en justice." },

    { id: 'm2c8h05', chap: 'c8', type: 'single',
      q: "Une assurance-vie liée à des parts de fonds, susceptible de rachat, est proposée à un client. Quel régime s'applique en plus de la LCA ?",
      choices: ["Aucun régime supplémentaire", "Les règles de conduite de la LSFin applicables aux assurances-vie qualifiées", "La LAMal", "La LPP"],
      answer: [1],
      explain: "Ces produits sont traités comme des instruments financiers : vérification du caractère approprié et adéquat, feuille d'information de base et devoirs d'information renforcés." },

    { id: 'm2c8h06', chap: 'c8', type: 'multi',
      q: "Quelles affirmations distinguent correctement les rôles des autorités ?",
      choices: ["La FINMA surveille la solvabilité et les abus des assureurs", "Le PFPDT traite la protection des données", "Le MROS reçoit les communications de soupçon de blanchiment", "L'Ombudsman rend des décisions contraignantes", "L'OFSP surveille l'assurance-maladie de base"],
      answer: [0, 1, 2, 4],
      explain: "L'Ombudsman est un médiateur : ses recommandations n'ont pas force obligatoire, ce qui le distingue d'une autorité de décision ou d'un tribunal." }
  ]);
})();
