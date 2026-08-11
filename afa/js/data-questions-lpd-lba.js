/* =============================================================
   AFA – Droit de l'assurance : LPD et LBA

   Reprend les deux pages de récapitulation du cours officiel :
   protection des données (notions, principes, obligations,
   droits, surveillance et sanctions) et lutte contre le
   blanchiment d'argent (art. 305ter CP, obligations de
   diligence, autorégulation ASA, sanctions).
   Gabarit officiel : en-tête de thème, barème, choix unique,
   choix multiple et tableaux d'attribution.
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m2 = M.find(x => x.id === 'm2');
  if (!m2) return;
  const q = (o) => Object.assign({ lvl: 'off' }, o);
  const VF = ['Vrai', 'Faux'];

  m2.questions.push(

    /* ═══════════ LPD — notions et principes ═══════════ */
    q({
      id: 'dl801', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, notion de donnée personnelle',
      q: "La notion de donnée personnelle : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Une donnée personnelle se rapporte à une personne physique identifiée ou identifiable.",
        "Les données d'une société anonyme sont protégées au même titre que celles d'un client privé.",
        "Une donnée reste personnelle même si l'identification n'est possible qu'en la recoupant avec d'autres informations.",
        "Une donnée entièrement anonymisée sort du champ de la loi.",
      ],
      answer: [0, 1, 0, 0],
      explain: "« Identifiée ou identifiable » : le second terme fait tout le travail, puisqu'un numéro de police ou une plaque suffisent dès qu'un recoupement est possible. La révision a en revanche retiré les personnes morales du champ de la loi — une société ne peut plus invoquer la LPD."
    }),
    q({
      id: 'dl802', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LPD, notion de traitement',
      q: "Que recouvre le « traitement » de données au sens de la LPD ?",
      choices: [
        "Toute opération sur les données, de la collecte jusqu'à leur destruction",
        "La seule transmission des données à un tiers",
        "L'enregistrement informatique des données, à l'exclusion des dossiers papier",
        "L'exploitation des données à des fins commerciales uniquement",
      ],
      answer: [0],
      explain: "Collecter, conserver, consulter, modifier, communiquer, archiver, détruire : tout est traitement. La conséquence pratique est qu'un dossier simplement stocké dans une armoire relève déjà de la loi, sans qu'aucune exploitation active soit nécessaire."
    }),
    q({
      id: 'dl803', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, principes du traitement',
      q: "Quel principe chacune de ces exigences met-elle en œuvre ?",
      cols: ['Minimisation', 'Transparence', 'Sécurité'],
      rows: [
        "Détruire ou anonymiser les données dès qu'elles ne sont plus nécessaires",
        "Informer la personne concernée lors de la collecte de ses données",
        "Protéger les données par des mesures techniques et organisationnelles appropriées",
        "Ne conserver aucune donnée au-delà de la durée justifiée par le but poursuivi",
      ],
      answer: [0, 1, 2, 0],
      explain: "La minimisation ne se joue pas seulement à la collecte mais aussi à la sortie : ce dont on n'a plus besoin doit être anonymisé ou détruit. C'est le principe qu'on oublie le plus souvent, parce qu'il impose d'agir sur des données déjà en sa possession."
    }),
    q({
      id: 'dl804', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, configuration par défaut',
      q: "Qu'impose le principe de configuration par défaut respectueuse de la vie privée ?",
      choices: [
        "Les réglages livrés au client doivent d'emblée être les plus protecteurs",
        "Le client doit approuver chaque réglage avant toute utilisation du service",
        "Toute donnée doit être chiffrée avant d'être enregistrée",
        "Les traitements doivent être annoncés au préposé avant leur lancement",
      ],
      answer: [0],
      explain: "L'idée est que la protection ne dépende pas d'une démarche du client : c'est celui qui veut élargir le traitement qui doit agir, pas celui qui veut se protéger. Un espace client livré avec le partage publicitaire déjà coché viole ce principe."
    }),

    /* ═══════════ LPD — obligations ═══════════ */
    q({
      id: 'dl805', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, obligations du responsable',
      q: "Ces obligations pèsent-elles sur le responsable du traitement ?",
      cols: ['Obligation LPD', 'Aucune obligation'],
      rows: [
        "Tenir un registre des activités de traitement",
        "Annoncer au préposé les violations de la sécurité des données",
        "Procéder à une analyse d'impact lorsque le risque est élevé",
        "Faire approuver chaque nouveau traitement par le préposé avant sa mise en service",
      ],
      answer: [0, 0, 0, 1],
      explain: "La loi fonctionne par responsabilisation, non par autorisation préalable : on documente, on évalue et on annonce, mais on ne demande pas la permission. Croire à un régime d'agrément est l'erreur classique."
    }),
    q({
      id: 'dl806', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, analyse d\'impact',
      q: "Dans quel cas une analyse d'impact relative à la protection des données doit-elle être conduite ?",
      choices: [
        "Lorsque le traitement envisagé est susceptible d'entraîner un risque élevé pour la personne concernée",
        "Pour tout traitement portant sur plus de mille personnes",
        "Chaque fois que des données sont transmises à un prestataire externe",
        "Systématiquement, avant tout nouveau traitement",
      ],
      answer: [0],
      explain: "Le déclencheur est le risque élevé pour la personnalité ou les droits fondamentaux, apprécié notamment en cas de traitement de données sensibles à grande échelle ou de profilage à risque élevé. Le volume seul ne suffit pas : mille adresses postales ne valent pas cent dossiers médicaux."
    }),
    q({
      id: 'dl807', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, violation de la sécurité',
      q: "Une perte de données clients survient chez un assureur : vrai ou faux ?",
      cols: VF,
      rows: [
        "La violation doit être annoncée au préposé dès qu'elle entraîne vraisemblablement un risque élevé.",
        "L'annonce au préposé doit intervenir dans les meilleurs délais.",
        "La personne concernée doit être informée lorsque sa protection l'exige.",
        "Une violation causée par un prestataire externe dispense l'assureur de toute annonce.",
      ],
      answer: [0, 0, 0, 1],
      explain: "Le responsable du traitement reste responsable de ce que fait son sous-traitant : externaliser le traitement n'externalise pas l'obligation. Le sous-traitant doit d'ailleurs annoncer la violation au responsable, qui décide ensuite de l'annonce au préposé."
    }),
    q({
      id: 'dl808', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, communication à l\'étranger',
      q: "À quelle condition des données de clients peuvent-elles être transmises dans un État dont la législation n'assure pas une protection adéquate ?",
      choices: [
        "En prévoyant des garanties suffisantes, par exemple des clauses de protection des données",
        "Il suffit que le destinataire soit une société du même groupe",
        "La transmission est interdite sans exception",
        "Il suffit d'annoncer la transmission au préposé après coup",
      ],
      answer: [0],
      explain: "Le Conseil fédéral tient la liste des États à protection adéquate ; à défaut d'y figurer, on compense par des garanties — clauses types, règles d'entreprise contraignantes, consentement exprès dans certains cas. L'appartenance à un groupe ne crée aucune adéquation."
    }),

    /* ═══════════ LPD — droits, surveillance, sanctions ═══════════ */
    q({
      id: 'dl809', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, droits de la personne concernée',
      q: "La personne concernée dispose-t-elle de ces droits envers l'assureur ?",
      cols: ['Droit reconnu', 'Droit inexistant'],
      rows: [
        "Se faire remettre ses données dans un format électronique courant",
        "Faire rectifier des données inexactes",
        "Obtenir l'effacement de données traitées sans justification",
        "Exiger l'effacement d'un dossier de sinistre que l'assureur doit légalement conserver",
      ],
      answer: [0, 0, 0, 1],
      explain: "La portabilité et l'effacement ne sont pas des droits absolus : une obligation légale de conservation ou un intérêt prépondérant les tiennent en échec. L'assuré qui veut faire disparaître un sinistre gênant se heurte précisément à cette limite."
    }),
    q({
      id: 'dl810', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LPD, coût du droit d\'accès',
      q: "Que peut coûter à un client la demande d'accès à ses données auprès de son assureur ?",
      choices: [
        "Rien : le renseignement est en principe gratuit",
        "Un émolument forfaitaire fixé par le préposé",
        "Les frais effectifs de recherche, dans tous les cas",
        "Un montant convenu librement dans les conditions générales",
      ],
      answer: [0],
      explain: "La gratuité est le principe, sans quoi le droit d'accès resterait théorique pour beaucoup. Une participation aux frais n'est envisageable que dans les cas exceptionnels prévus par la loi, notamment lorsque la demande occasionne un travail disproportionné."
    }),
    q({
      id: 'dl811', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, surveillance et sanctions',
      q: "Surveillance et sanctions en matière de protection des données : vrai ou faux ?",
      cols: VF,
      rows: [
        "Le préposé fédéral surveille l'application de la loi et peut ouvrir une enquête d'office.",
        "L'amende encourue peut atteindre 250 000 francs.",
        "L'amende frappe en principe la personne physique responsable du manquement.",
        "Le préposé prononce lui-même les amendes qu'il inflige aux contrevenants.",
      ],
      answer: [0, 0, 0, 1],
      explain: "Le préposé enquête, recommande et ordonne des mesures, mais la sanction pénale relève des autorités cantonales de poursuite. Retenir le plafond de 250 000 francs et le fait qu'il vise une personne physique, non l'entreprise : c'est le renversement qui surprend le plus."
    }),
    q({
      id: 'dl812', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      ctx: "Un conseiller consulte, par curiosité, le dossier d'assurance d'une personnalité connue qui n'est pas dans son portefeuille. Aucune donnée n'est transmise à l'extérieur.",
      theme: 'Droit, LPD, licéité du traitement',
      q: "Comment ce comportement s'apprécie-t-il au regard de la LPD ?",
      choices: [
        "Il est illicite : la consultation est déjà un traitement, sans finalité légitime ici",
        "Il est licite tant qu'aucune donnée n'est communiquée à un tiers",
        "Il est licite, le conseiller étant employé de l'assureur détenteur des données",
        "Il n'est illicite que si la personne concernée s'en plaint",
      ],
      answer: [0],
      explain: "Consulter est traiter, et l'accès autorisé au système ne vaut pas autorisation d'accéder à tout dossier. Le manquement existe indépendamment de toute divulgation et de toute plainte — c'est le principe de finalité qui est violé dès la consultation."
    }),

    /* ═══════════ LBA — art. 305ter CP ═══════════ */
    q({
      id: 'dl813', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, art. 305ter CP',
      q: "Quel comportement l'art. 305ter CP réprime-t-il ?",
      choices: [
        "Omettre de vérifier l'identité de l'ayant droit économique avec la vigilance requise",
        "Accepter des espèces au-delà de 100 000 francs",
        "Refuser de communiquer un soupçon au Bureau de communication",
        "Conclure une relation d'affaires avec une personne politiquement exposée",
      ],
      answer: [0],
      explain: "L'infraction sanctionne un défaut de vigilance, pas le blanchiment lui-même : elle est consommée par l'omission de vérifier, même si les fonds se révèlent parfaitement propres. Le blanchiment proprement dit relève de l'art. 305bis CP."
    }),
    q({
      id: 'dl814', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, champ d\'application personnel',
      q: "Cette activité tombe-t-elle sous le devoir de vigilance de l'art. 305ter CP ?",
      cols: ['Soumise', 'Non soumise'],
      rows: [
        "Une banque qui ouvre un compte",
        "Une compagnie exploitant l'assurance directe sur la vie",
        "Un gérant de fortune indépendant",
        "Un garagiste qui vend un véhicule d'occasion",
      ],
      answer: [0, 0, 0, 1],
      explain: "La disposition ne vise que ceux qui acceptent, gardent en dépôt ou aident à placer ou transférer des valeurs appartenant à des tiers, à titre professionnel : banques, assurances, fiduciaires, gérants de fortune. Un commerçant reste hors du dispositif, quel que soit le montant encaissé."
    }),
    q({
      id: 'dl815', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, autorégulation',
      q: "L'art. 305ter CP exige une vérification faite « avec la vigilance que requièrent les circonstances ». Qui en précise la portée pour les assureurs ?",
      choices: [
        "L'organisme d'autorégulation de l'Association Suisse d'Assurances (OAR-ASA)",
        "Le préposé fédéral à la protection des données",
        "Le Bureau de communication en matière de blanchiment d'argent",
        "Chaque assureur, librement, dans ses directives internes",
      ],
      answer: [0],
      explain: "La loi pose un standard volontairement souple, que l'autorégulation traduit en règles concrètes : le règlement de l'OAR-ASA dit ce que la vigilance signifie en pratique pour un assureur vie. La FINMA reconnaît et surveille cet organisme."
    }),
    q({
      id: 'dl816', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, punissabilité',
      q: "Qui peut être puni d'une peine privative de liberté ou pécuniaire ? Vrai ou faux ?",
      cols: VF,
      rows: [
        "Seules des personnes physiques peuvent subir ces peines.",
        "L'entreprise elle-même peut être condamnée si l'infraction résulte d'un manque d'organisation et ne peut être imputée à aucun collaborateur.",
        "Le collaborateur fautif échappe à toute sanction dès lors que son employeur est mis en cause.",
        "L'entreprise encourt une amende, non une peine privative de liberté.",
      ],
      answer: [0, 0, 1, 0],
      explain: "Le droit pénal frappe d'abord des individus ; l'entreprise n'entre en scène qu'à titre subsidiaire, quand le désordre interne empêche de désigner un responsable. Mettre l'entreprise en cause ne blanchit donc personne."
    }),

    /* ═══════════ LBA — fonds visés et diligence ═══════════ */
    q({
      id: 'dl817', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, valeurs visées',
      q: "Quels fonds la lutte contre le blanchiment vise-t-elle à empêcher d'entrer dans le circuit financier ?",
      choices: [
        "Les valeurs provenant d'un crime",
        "Les valeurs provenant d'un délit fiscal qualifié",
        "Les fonds destinés au financement du terrorisme",
        "Les avoirs d'un client domicilié dans un État à fiscalité avantageuse",
        "Les primes payées en espèces pour une assurance ménage",
      ],
      answer: [0, 1, 2],
      explain: "Le champ s'est élargi : au crime classique se sont ajoutés le délit fiscal qualifié et le financement du terrorisme, où les fonds peuvent être d'origine parfaitement licite mais de destination criminelle. Un domicile fiscalement avantageux n'est pas une infraction."
    }),
    q({
      id: 'dl818', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, obligations de diligence',
      q: "À quelle obligation de diligence chacune de ces démarches se rattache-t-elle ?",
      cols: ['Identification', 'Documentation', 'Organisation'],
      rows: [
        "Vérifier l'identité du cocontractant sur pièce officielle",
        "Établir une déclaration écrite sur l'ayant droit économique",
        "Conserver les pièces de manière à pouvoir répondre à une demande d'information",
        "Former le personnel et désigner un service interne de lutte contre le blanchiment",
      ],
      answer: [0, 0, 1, 2],
      explain: "Quatre devoirs qui se répondent : on identifie, on consigne, on conserve, on s'organise. La déclaration sur l'ayant droit économique reste de l'identification — elle sert à savoir qui se tient derrière le cocontractant, non à archiver."
    }),
    q({
      id: 'dl819', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, détenteur du contrôle',
      q: "Quand faut-il déterminer le détenteur du contrôle plutôt que l'ayant droit économique ?",
      choices: [
        "Lorsque le cocontractant est une société non cotée exerçant une activité opérationnelle",
        "Lorsque le cocontractant est une personne physique agissant pour son propre compte",
        "Lorsque le contrat porte sur une assurance de choses",
        "Lorsque la prime est payée par un tiers",
      ],
      answer: [0],
      explain: "Derrière une société opérationnelle, il n'y a pas d'« ayant droit économique » des valeurs au sens usuel : on remonte donc aux personnes physiques qui la contrôlent, en principe dès 25 % du capital ou des voix. À défaut, on désigne la personne qui dirige effectivement."
    }),
    q({
      id: 'dl820', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, conduite en cas de soupçon',
      q: "Un soupçon fondé apparaît sur une relation d'affaires : vrai ou faux ?",
      cols: VF,
      rows: [
        "L'intermédiaire financier doit communiquer sans délai au Bureau de communication.",
        "Les avoirs concernés doivent être bloqués selon les règles de la loi.",
        "Le client doit être informé de la communication afin de pouvoir s'expliquer.",
        "L'intermédiaire peut mettre fin discrètement à la relation plutôt que de communiquer.",
      ],
      answer: [0, 0, 1, 1],
      explain: "Communiquer et bloquer, sans prévenir : l'interdiction d'informer le client est la clé du dispositif, puisque l'avertir reviendrait à lui donner le temps de déplacer les fonds. Rompre la relation en silence ne remplace pas la communication — c'est même le réflexe que la loi entend proscrire."
    }),

    /* ═══════════ LBA — application en assurance ═══════════ */
    q({
      id: 'dl821', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, activités d\'assurance concernées',
      q: "Cette activité fait-elle de la compagnie un intermédiaire financier au sens de la LBA ?",
      cols: ['Oui', 'Non'],
      rows: [
        "Exploiter l'assurance directe sur la vie",
        "Distribuer des parts de placements collectifs de capitaux",
        "Exploiter l'assurance responsabilité civile véhicules à moteur",
        "Exploiter l'assurance ménage et bâtiment",
      ],
      answer: [0, 0, 1, 1],
      explain: "Le critère est la possibilité de placer des fonds : une police d'épargne ou une part de fonds peut recevoir des valeurs et les restituer, une assurance de choses non. C'est pourquoi la LBA reste étrangère aux branches non-vie pures."
    }),
    q({
      id: 'dl822', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      ctx: "Un nouveau client souhaite conclure une assurance-vie à prime unique de 400 000 francs. Il propose de verser la somme en plusieurs tranches en espèces et se montre évasif sur la provenance des fonds.",
      theme: 'Droit, LBA, cas pratique',
      q: "Quelle est la conduite correcte du conseiller ?",
      choices: [
        "Vérifier l'identité et clarifier l'arrière-plan économique, puis alerter le service interne compétent",
        "Accepter le versement, la vérification incombant à la comptabilité de la compagnie",
        "Refuser sèchement le client et l'informer qu'il est soupçonné de blanchiment",
        "Fractionner la police en plusieurs contrats afin de rester sous les seuils",
      ],
      answer: [0],
      explain: "Espèces, montant élevé, fractionnement et réticence sur l'origine des fonds forment un faisceau d'indices classique appelant une clarification particulière. Fractionner soi-même pour passer sous les seuils est exactement le procédé que la loi vise ; annoncer ses soupçons au client est prohibé."
    }),
    q({
      id: 'dl823', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LBA, sanctions applicables',
      q: "Quelles sanctions un manquement aux obligations de la LBA peut-il entraîner ?",
      choices: [
        "Une amende pour l'entreprise, et une amende ou une peine privative de liberté pour les responsables",
        "Uniquement le retrait de l'autorisation d'exercer délivrée par la FINMA",
        "Uniquement des mesures disciplinaires internes à l'entreprise",
        "Uniquement une amende, la LBA ne prévoyant aucune peine privative de liberté",
      ],
      answer: [0],
      explain: "Le dispositif se joue à deux niveaux : l'entreprise répond par l'amende et par les mesures de la surveillance, les personnes responsables par la sanction pénale. C'est ce qui explique qu'un manquement remonte toujours à un nom, pas seulement à une raison sociale."
    })
  );
})();
