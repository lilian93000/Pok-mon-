/* =============================================================
   AFA – Questions tirées du support de cours officiel myVBV

   Gabarit de la série zéro : en-tête « Thème », barème
   (1 point = simple, 2 points = moyenne), et les trois formats
   de l'épreuve écrite — choix unique, choix multiple, tableau
   d'attribution (dont la variante Vrai/Faux).

   Sujets couverts : classification des assurances, rôle de
   l'État et surveillance, sources du droit du contrat,
   formation et fin du contrat, obligations des parties, voies
   de droit, surveillance des intermédiaires, devoir de conseil
   et responsabilité.

   Articles vérifiés : art. 28 LCA (aggravation par le fait du
   preneur — le support imprime « art. 2 al. 1 », c'est une
   coquille) et art. 42 LCA (14 jours après notification).
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m1 = M.find(x => x.id === 'm1');
  const m2 = M.find(x => x.id === 'm2');
  if (!m1 || !m2) return;
  const q = (o) => Object.assign({ lvl: 'off' }, o);
  const VF = ['Vrai', 'Faux'];

  /* ══════════════ MODULE 1 — CLASSIFICATION ══════════════ */

  m1.questions.push(
    q({
      id: 'ofc101', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "IA, classification, objet de l'assurance",
      q: "Décidez, pour chacune de ces couvertures, quel est l'objet de l'assurance.",
      cols: ['Assurance de personnes', 'Assurance de choses', 'Assurance de patrimoine'],
      rows: [
        "Assurance contre les dégâts causés aux cultures par la grêle",
        "Assurance casco d'un véhicule",
        "Assurance de protection juridique",
        "Assurance invalidité",
      ],
      answer: [2, 1, 2, 0],
      explain: "Le piège est la grêle : ce que l'assurance couvre, c'est le manque à gagner du maraîcher sur sa récolte, donc une perte de patrimoine — et non la plante elle-même. La protection juridique couvre elle aussi une perte d'argent, la casco un bien corporel, et l'invalidité la personne."
    }),
    q({
      id: 'ofc102', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, classification, assurance de patrimoine",
      q: "Que couvre une assurance de patrimoine ?",
      choices: [
        "Les pertes d'argent consécutives à la réalisation de l'événement assuré",
        "Les dommages consécutifs à la détérioration ou à la destruction d'une chose",
        "La perte de gain d'une personne en cas de décès ou d'invalidité",
        "Les frais de remise en état d'un bien corporel endommagé",
      ],
      answer: [0],
      explain: "Aucun bien n'est détruit et aucune personne n'est atteinte : c'est la fortune qui diminue. Responsabilité civile, protection juridique, perte d'exploitation et dégâts aux cultures entrent dans cette catégorie."
    }),
    q({
      id: 'ofc103', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, classification, assurance de personnes",
      q: "Contre quoi une assurance de personnes protège-t-elle ?",
      choices: [
        "Contre la perte de gain ou le préjudice patrimonial en cas de décès, d'accident, de maladie ou d'invalidité",
        "Contre la détérioration, la destruction ou le vol d'un objet corporel",
        "Contre les prétentions que des tiers élèvent à l'encontre de l'assuré",
        "Contre l'interruption de l'activité d'une entreprise",
      ],
      answer: [0],
      explain: "C'est la personne elle-même qui est assurée — sa vie, sa santé, sa capacité de gain. Vie, accidents, maladie et invalidité forment le noyau de cette catégorie."
    }),
    q({
      id: 'ofc104', chap: 'c4', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, critères répandus',
      q: "Quels critères de classification des assurances le support officiel retient-il ?",
      choices: [
        "L'objet de l'assurance : personnes, choses ou patrimoine",
        "Ce que couvre l'assurance : le revenu ou la fortune",
        "L'assurance d'un ou de plusieurs risques : individuelle ou collective",
        "La branche : vie ou non-vie",
        "La prestation prévue : assurance de dommages ou de sommes",
        "Le statut juridique de l'assureur : privé ou de droit public",
        "Le régime : assurance facultative ou obligatoire",
        "La nationalité du preneur d'assurance",
      ],
      answer: [0, 1, 2, 3, 4, 5, 6],
      explain: "Sept critères, et un seul intrus. La nationalité n'entre dans aucune classification : elle ne dit rien du risque, de la prestation ni du statut de l'assureur."
    }),
    q({
      id: 'ofc105', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, chevauchement des critères',
      q: "Que faut-il retenir du rapport entre les différents critères de classification ?",
      choices: [
        "Ils se chevauchent : un même type d'assurance répond toujours à plusieurs critères",
        "Ils s'excluent : chaque assurance ne relève que d'un seul critère",
        "Ils se succèdent : on applique le second seulement si le premier ne tranche pas",
        "Ils sont alternatifs : l'assureur choisit celui qu'il veut appliquer",
      ],
      answer: [0],
      explain: "Une assurance casco est simultanément une assurance de choses, de dommages, individuelle, non-vie, privée et facultative. Chercher « la » catégorie unique d'un produit est donc une erreur de méthode."
    }),
    q({
      id: 'ofc106', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, dommages et sommes',
      q: "Selon le critère de la prestation prévue, comment ces couvertures se classent-elles ?",
      cols: ['Assurance de dommages', 'Assurance de sommes'],
      rows: [
        "Assurance des frais de guérison",
        "Capital décès dans l'assurance accidents des occupants",
        "Assurance responsabilité civile",
        "Assurance vie",
      ],
      answer: [0, 1, 0, 1],
      explain: "L'assurance de dommages fixe la prestation d'après le dommage effectif — le besoin pécuniaire —, avec en général un plafond contractuel. L'assurance de sommes verse le montant convenu d'avance, le besoin pécuniaire ne jouant aucun rôle."
    }),
    q({
      id: 'ofc107', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, assurance de sommes',
      q: "L'assurance de sommes : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Le besoin pécuniaire de l'assuré ne joue aucun rôle dans le calcul de la prestation.",
        "La somme assurée est entièrement due même en cas de double assurance.",
        "L'assureur peut réduire la prestation si l'assuré perçoit déjà une indemnité d'un tiers.",
        "La somme d'assurance est convenue à l'avance entre les parties.",
      ],
      answer: [0, 0, 1, 0],
      explain: "C'est précisément parce que la prestation est indépendante du besoin pécuniaire que la double couverture ne pose pas de problème : les deux assureurs doivent s'acquitter intégralement. Réduire pour cause de cumul serait raisonner en assurance de dommages."
    }),
    q({
      id: 'ofc108', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, cumul en assurance de sommes',
      ctx: "Le copilote d'une voiture est mortellement blessé dans un accident. Il avait conclu une assurance vie prévoyant CHF 100 000.– en cas de décès en faveur de sa femme. Le conducteur de la voiture avait pour sa part conclu une assurance accidents des occupants prévoyant CHF 50 000.– au décès d'un occupant, en faveur des héritiers.",
      q: "Quelles prestations sont dues ?",
      choices: [
        "Les deux assureurs doivent s'acquitter intégralement de leur prestation",
        "Les deux prestations sont réduites de moitié pour éviter un enrichissement",
        "Seule l'assurance vie doit sa prestation, l'autre étant subsidiaire",
        "Seule l'assurance accidents doit sa prestation, l'accident en étant la cause",
      ],
      answer: [0],
      explain: "Assurance vie et assurance accidents des occupants sont toutes deux des assurances de sommes : le montant convenu est exigible même si le risque est doublement couvert. L'interdiction de l'enrichissement ne vaut que pour l'assurance de dommages."
    }),
    q({
      id: 'ofc109', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, organisme d\'assurance',
      q: "Ces assureurs relèvent-ils du droit privé ou du droit public ?",
      cols: ['Assureur privé', 'Assureur de droit public'],
      rows: [
        "Une compagnie exploitée sous forme de société anonyme",
        "L'AVS et l'AI",
        "La SUVA",
        "Un établissement cantonal d'assurance incendie des bâtiments",
      ],
      answer: [0, 1, 1, 1],
      explain: "Le critère est l'organisation de l'assureur. Les assureurs privés exercent en tant qu'entreprises privées, le plus souvent en société anonyme. Les assureurs de droit public sont l'État lui-même — AVS, AI — ou des établissements qu'il a créés et qu'il contrôle."
    }),
    q({
      id: 'ofc110', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, classification, forme juridique",
      q: "Quelle forme juridique la grande majorité des compagnies d'assurances privées adopte-t-elle ?",
      choices: [
        "La société anonyme",
        "La société coopérative",
        "La fondation",
        "L'association",
      ],
      answer: [0],
      explain: "La société anonyme domine largement ; la coopérative est plus rare et les autres formes tout à fait marginales. Ce qui compte pour la classification n'est pas la forme retenue, mais le fait que l'activité soit exercée sur une base privée."
    })
  );

  /* ══════════════ MODULE 2 — L'ÉTAT ET LA SURVEILLANCE ══════════════ */

  m2.questions.push(
    q({
      id: 'ofc201', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, surveillance, raisons de l'intervention de l'État",
      q: "Pour quelles raisons l'État intervient-il dans le domaine des assurances ?",
      choices: [
        "Pour protéger les assurés contre l'insolvabilité de l'entreprise d'assurance",
        "Pour empêcher l'exploitation de l'infériorité d'une partie",
        "Pour protéger le public contre les abus et préserver le climat de confiance",
        "Pour garantir un bénéfice minimal aux entreprises d'assurance",
        "Pour fixer lui-même le montant des primes du marché",
      ],
      answer: [0, 1, 2],
      explain: "Trois raisons, énoncées par le support à partir de l'art. 1 al. 2 LSA. Une garantie de sinistre ne vaut rien si l'assureur ne peut pas payer ; l'assurance est une opération compliquée que peu de clients maîtrisent ; et une perte de confiance générale aurait de graves conséquences économiques."
    }),
    q({
      id: 'ofc202', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, surveillance, deux corps de règles',
      q: "Ces éléments relèvent-ils du droit de la surveillance ou du droit du contrat d'assurance ?",
      cols: ['Droit de la surveillance (public)', 'Droit du contrat (privé)'],
      rows: [
        "La loi sur la surveillance des assurances (LSA) et son ordonnance",
        "Le code des obligations et le code civil suisse",
        "La FINMA comme autorité compétente",
        "La loi sur le contrat d'assurance (LCA)",
      ],
      answer: [0, 1, 0, 1],
      explain: "L'État agit par deux moyens distincts. Le droit de la surveillance encadre l'entreprise et relève du droit public, avec la FINMA pour autorité. Le droit du contrat règle le rapport entre les parties et relève du droit privé."
    }),
    q({
      id: 'ofc203', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, absence d\'autorité en droit privé',
      q: "Quelle autorité est compétente en matière de droit du contrat d'assurance ?",
      choices: [
        "Aucune : s'agissant de droit privé, le lésé doit lui-même agir en justice",
        "La FINMA, qui tranche les litiges entre assureur et preneur",
        "L'ombudsman, dont les décisions s'imposent aux deux parties",
        "L'Association Suisse d'Assurances, par voie d'arbitrage obligatoire",
      ],
      answer: [0],
      explain: "C'est tout l'enjeu : personne ne veille d'office sur le contrat, le lésé doit intenter une action. C'est précisément pour éviter des procès coûteux que les assureurs ont créé eux-mêmes un service d'ombudsman, de nature privée."
    }),
    q({
      id: 'ofc204', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LSA, champ d\'application',
      q: "À qui la LSA s'applique-t-elle ?",
      choices: [
        "À tous les assureurs privés exerçant l'assurance directe et la réassurance en Suisse",
        "Aux seules entreprises d'assurance vie établies en Suisse",
        "À l'ensemble des assureurs, y compris les assureurs sociaux",
        "Aux seules succursales d'assureurs étrangers actives en Suisse",
      ],
      answer: [0],
      explain: "Elle constitue l'élément-clé du droit relatif à la surveillance. Les assureurs sociaux, eux, relèvent de leurs propres lois et d'autres autorités que la FINMA."
    }),
    q({
      id: 'ofc205', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, questions réglées',
      q: "Quelles questions la LSA règle-t-elle principalement ?",
      choices: [
        "L'octroi de l'agrément et la surveillance de l'activité des entreprises",
        "La garantie de la solvabilité des entreprises d'assurance",
        "La surveillance des intermédiaires d'assurance",
        "L'assainissement et la faillite de l'entreprise d'assurance",
        "L'obligation de caution des assureurs extérieurs à l'UE",
        "Le contenu des conditions générales de chaque produit vendu",
      ],
      answer: [0, 1, 2, 3, 4],
      explain: "La LSA encadre l'entreprise, pas le produit : le contenu du contrat relève de la LCA et de la liberté contractuelle. La caution est un montant qu'un assureur étranger hors UE doit déposer en garantie pour opérer en Suisse."
    }),
    q({
      id: 'ofc206', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "Droit, LSA, procédure d'agrément",
      q: "Remettez les étapes de la procédure d'agrément dans l'ordre.",
      cols: ['1re étape', '2e étape', '3e étape', '4e étape'],
      rows: [
        "Établissement du plan d'exploitation",
        "Demande d'agrément à la FINMA",
        "Examen de la demande par la FINMA",
        "Octroi de l'agrément si les conditions sont remplies",
      ],
      answer: [0, 1, 2, 3],
      explain: "Le plan d'exploitation vient en premier : c'est la pièce sur laquelle tout l'examen repose. La FINMA y vérifie la solvabilité, l'organisation, la direction, la forme juridique, l'absence d'activités étrangères à l'assurance et la séparation des branches."
    }),
    q({
      id: 'ofc207', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, LSA, examen de la demande d'agrément",
      q: "Que la FINMA vérifie-t-elle sur la base du plan d'exploitation ?",
      choices: [
        "La solvabilité de l'entreprise",
        "Son organisation et sa direction",
        "Sa forme juridique",
        "L'absence d'activités étrangères à l'assurance",
        "La séparation des branches",
        "Le niveau des primes prévues pour chaque produit",
      ],
      answer: [0, 1, 2, 3, 4],
      explain: "Cinq critères structurels, aucun sur le prix : la tarification est en principe libre en assurance privée, sauf dans les domaines à approbation particulière comme la maladie complémentaire."
    }),
    q({
      id: 'ofc208', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "Droit, LSA, fin de l'activité",
      q: "Ces situations mettent-elles fin à l'activité avec ou sans faillite de l'entreprise ?",
      cols: ['Sans faillite', 'Avec faillite'],
      rows: [
        "Abandon volontaire de l'activité, par renonciation",
        "Retrait de l'agrément par la FINMA",
        "Transfert du portefeuille d'assurances à une autre compagnie",
        "Liquidation liée à l'insolvabilité ou au surendettement",
      ],
      answer: [0, 0, 0, 1],
      explain: "Renonciation, retrait forcé de l'agrément et transfert de portefeuille se déroulent sans faillite. Seule l'insolvabilité ou le surendettement y conduit — et dans tous ces cas, la LSA prévoit des mesures de protection en faveur des assurés."
    }),
    q({
      id: 'ofc209', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: "Droit, LSA, assainissement",
      q: "Dans quel but la FINMA peut-elle ordonner une procédure d'assainissement ?",
      choices: [
        "Pour permettre d'écarter le risque d'insolvabilité de l'entreprise d'assurance",
        "Pour contraindre l'entreprise à baisser ses primes",
        "Pour transférer d'office le portefeuille à un concurrent",
        "Pour indemniser directement les assurés lésés",
      ],
      answer: [0],
      explain: "L'assainissement intervient en amont de la faillite : il vise à redresser l'entreprise tant que c'est encore possible. C'est une mesure de protection des assurés, non une sanction commerciale."
    }),
    q({
      id: 'ofc210', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, garantie de la solvabilité',
      q: "Quels éléments participent à la garantie de la solvabilité au sens de la LSA ?",
      choices: [
        "Le capital minimum",
        "La solvabilité, soit le rapport entre capital propre et volume des primes",
        "Le fonds de garantie et le fonds d'organisation",
        "Le fonds de sûreté pour les assurances vie",
        "Le nombre d'intermédiaires inscrits au registre",
      ],
      answer: [0, 1, 2, 3],
      explain: "La solvabilité est la capacité de l'entreprise de faire face à ses engagements. Le nombre d'intermédiaires n'y joue aucun rôle : c'est une question de distribution, pas de solidité financière."
    })
  );

  /* ══════════════ MODULE 2 — SOURCES DU DROIT DU CONTRAT ══════════════ */

  m2.questions.push(
    q({
      id: 'ofc301', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, contrat, sources à consulter',
      q: "Dans quel ordre consulte-t-on ces sources pour résoudre une question relative à un contrat d'assurance ?",
      cols: ['1re source', '2e source', '3e source', '4e source'],
      rows: [
        "La police d'assurance et ses conditions",
        "La loi sur le contrat d'assurance (LCA)",
        "Le code des obligations (CO)",
        "Les autres lois, dont le code civil suisse (CC)",
      ],
      answer: [0, 1, 2, 3],
      explain: "On part toujours du contrat lui-même : la police prouve ce que les parties ont convenu. La LCA vient ensuite comme loi spéciale, le CO supplée à ses lacunes en réglant les rapports contractuels de façon générale, et le CC intervient pour des questions comme l'exercice des droits."
    }),
    q({
      id: 'ofc302', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, structure de la loi',
      q: "À quel titre de la LCA ces plages d'articles correspondent-elles ?",
      cols: ['Dispositions générales', 'Dispositions spéciales', 'Dispositions impératives', 'Dispositions finales'],
      rows: [
        "LCA 1 à 47a",
        "LCA 50 à 96",
        "LCA 97 à 99",
        "LCA 100 à 104",
      ],
      answer: [0, 1, 2, 3],
      explain: "La LCA compte quatre titres. Les dispositions impératives des art. 97 à 99 sont celles auxquelles on ne peut pas déroger, ou seulement en faveur du preneur — c'est là que se joue la protection du client."
    }),
    q({
      id: 'ofc303', chap: 'c1', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, contrat, rôle du CO',
      q: "Quel rôle le code des obligations joue-t-il en matière de contrat d'assurance ?",
      choices: [
        "Il supplée aux lacunes de la LCA en réglant les rapports contractuels de façon générale",
        "Il prime la LCA, étant la loi la plus ancienne",
        "Il ne s'applique jamais, la LCA étant exhaustive",
        "Il ne s'applique qu'aux contrats conclus par des entreprises",
      ],
      answer: [0],
      explain: "La LCA est une loi spéciale : elle ne règle que ce qui est propre à l'assurance. Tout ce qu'elle ne traite pas — formation du contrat, vices du consentement, demeure — relève du CO."
    }),
    q({
      id: 'ofc304', chap: 'c3', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, contrat, hiérarchie des conditions',
      q: "Que faut-il consulter en premier lorsqu'une question porte sur l'étendue de la couverture ?",
      choices: [
        "Les conditions particulières, car la règle spéciale prime la règle générale",
        "Les conditions générales, car elles s'appliquent à tous les contrats",
        "Le texte de la LCA, qui l'emporte sur toute stipulation",
        "Peu importe : les deux ont exactement la même valeur",
      ],
      answer: [0],
      explain: "Les CGA posent le régime commun ; les conditions particulières (CPA) ou spéciales (CSA) l'écartent pour un cas ou un groupe de clients donné. Commencer par les générales fait perdre du temps et conduit à des réponses fausses."
    }),
    q({
      id: 'ofc305', chap: 'c3', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, contrat, composition de la police',
      q: "De quoi la police d'assurance se compose-t-elle ?",
      choices: [
        "De la page de couverture",
        "Des conditions générales d'assurance (CGA)",
        "D'éventuelles autres conditions, particulières ou spéciales",
        "Du texte intégral de la loi sur le contrat d'assurance",
        "Du rapport de gestion de l'entreprise d'assurance",
      ],
      answer: [0, 1, 2],
      explain: "La police constitue la preuve écrite de l'accord passé entre les parties. Elle ne contient ni la loi, que nul n'est censé ignorer, ni les comptes de l'assureur."
    })
  );

  /* ══════════════ MODULE 2 — FORMATION DU CONTRAT ══════════════ */

  m2.questions.push(
    q({
      id: 'ofc401', chap: 'c3', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, points essentiels de la proposition",
      q: "Quels sont les points essentiels que doit contenir une proposition d'assurance ?",
      choices: [
        "Le danger (risque) assuré",
        "L'objet ou la personne assuré(e)",
        "La prestation d'assurance",
        "La prime",
        "Le début de la couverture d'assurance",
        "La durée du contrat",
        "Le nom de l'intermédiaire ayant recueilli la proposition",
      ],
      answer: [0, 1, 2, 3, 4, 5],
      explain: "Six points essentiels, sans lesquels la proposition est incomplète. L'identité de l'intermédiaire y figure en pratique, mais elle ne fait pas partie des éléments essentiels du contrat."
    }),
    q({
      id: 'ofc402', chap: 'c3', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, délai d'option",
      q: "Que désigne le « délai d'option » dans la formation du contrat d'assurance ?",
      choices: [
        "Le délai dans lequel l'assureur doit notifier son acceptation de la proposition",
        "Le délai de 14 jours pendant lequel le preneur peut révoquer",
        "Le délai dont dispose le preneur pour choisir entre plusieurs variantes de couverture",
        "Le délai au terme duquel la police doit être établie",
      ],
      answer: [0],
      explain: "Le proposant reste lié par son offre pendant ce délai ; l'assureur qui entend y donner suite doit notifier son acceptation dans ses limites. À ne pas confondre avec le droit de révocation de l'art. 2a LCA, qui appartient au preneur."
    }),
    q({
      id: 'ofc403', chap: 'c3', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, contenu de la proposition",
      q: "Quels autres points figurent généralement dans une proposition d'assurance ?",
      choices: [
        "Les questions de l'entreprise d'assurance sur le risque à assurer",
        "Le renvoi aux CGA et la clause certifiant que le preneur les a reçues",
        "La date et la signature du client",
        "Le montant des commissions versées à l'intermédiaire",
      ],
      answer: [0, 1, 2],
      explain: "Le questionnaire fonde la réticence, la clause de réception des CGA sert de preuve à l'information précontractuelle, et la signature date l'offre. La rémunération de l'intermédiaire relève d'une autre obligation, celle de l'art. 45b LSA pour les non liés."
    }),
    q({
      id: 'ofc404', chap: 'c3', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, police d\'assurance',
      q: "Que prouve la police d'assurance, et que ne prouve-t-elle pas ?",
      choices: [
        "Elle atteste l'existence du contrat et les obligations des parties, sans conditionner sa validité",
        "Elle conditionne la validité du contrat, qui n'existe pas sans elle",
        "Elle remplace les conditions générales, qu'elle rend superflues",
        "Elle vaut proposition, que le client doit encore accepter",
      ],
      answer: [0],
      explain: "C'est une pièce justificative, donc un moyen de preuve : le contrat existe dès l'accord des volontés, même avant l'établissement de la police. Perdre sa police ne fait pas perdre sa couverture."
    }),
    q({
      id: 'ofc405', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, début de l'assurance",
      q: "Le début de la couverture : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "La protection commence en principe à la date convenue par les parties.",
        "En cas de couverture provisoire, la protection commence dès l'acceptation de l'assureur de couvrir le risque.",
        "La couverture ne peut jamais commencer avant l'établissement de la police.",
        "La couverture provisoire intervient avant la conclusion définitive du contrat.",
      ],
      answer: [0, 0, 1, 0],
      explain: "La police est une preuve, pas une condition : la couverture peut parfaitement précéder son émission. La note de couverture provisoire sert précisément à combler le vide entre la proposition et la décision de l'assureur."
    })
  );

  /* ══════════════ MODULE 2 — OBLIGATIONS DES PARTIES ══════════════ */

  m2.questions.push(
    q({
      id: 'ofc501', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, choix de l\'assureur en cas de demeure',
      q: "Après la suspension de la couverture pour non-paiement, quel est le double choix de l'assureur ?",
      cols: ['Maintenir le contrat', 'Se départir du contrat'],
      rows: [
        "Intenter une action en exécution, par la voie de la poursuite",
        "Renoncer à la prime et laisser le contrat s'éteindre",
        "Ne rien entreprendre pendant les deux mois qui suivent",
        "Encaisser la prime et les frais de recouvrement, la couverture reprenant effet",
      ],
      answer: [0, 1, 1, 0],
      explain: "Poursuivre, c'est vouloir garder le contrat ; l'inaction pendant deux mois vaut départ et fait perdre à l'assureur sa créance de prime. Le paiement intégral, primes et frais compris, fait redéployer la couverture — mais pour l'avenir seulement."
    }),
    q({
      id: 'ofc502', chap: 'c4', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, contenu de la sommation',
      q: "Que doit mentionner la sommation écrite adressée au preneur en retard de paiement ?",
      choices: [
        "Le délai de grâce de 14 jours",
        "Les conséquences du retard",
        "Les frais qui seront mis à la charge du débiteur",
        "L'identité du réassureur de l'entreprise",
      ],
      answer: [0, 1, 2],
      explain: "Ces trois mentions conditionnent l'efficacité de la sommation : sans elles, la couverture n'est pas suspendue et l'assureur ne pourra pas refuser un sinistre survenu ensuite."
    }),
    q({
      id: 'ofc503', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, aggravation du risque',
      q: "Selon que l'aggravation du risque procède ou non du fait du preneur, quelle est la conséquence ?",
      cols: ["Du fait du preneur", "Sans le fait du preneur"],
      rows: [
        "L'entreprise d'assurance n'est plus liée par le contrat pour l'avenir",
        "Le preneur doit adresser une déclaration écrite, faute de quoi l'assureur n'est plus lié",
      ],
      answer: [0, 1],
      explain: "Art. 28 LCA : quand le preneur provoque lui-même l'aggravation essentielle, l'assureur cesse d'être lié. Quand elle survient sans son fait, il conserve la couverture à condition d'annoncer — et l'assureur dispose alors de 14 jours pour résilier."
    }),
    q({
      id: 'ofc504', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, diminution du risque',
      q: "De quels droits le preneur dispose-t-il en cas de diminution du risque ?",
      choices: [
        "Il peut résilier le contrat ou exiger une réduction de la prime",
        "Il peut uniquement exiger une réduction de la prime",
        "Il peut uniquement résilier le contrat",
        "Il ne dispose d'aucun droit particulier",
      ],
      answer: [0],
      explain: "Le support officiel énonce les deux branches de l'alternative. Le preneur choisit : soit il fait adapter le prix au risque réel, soit il quitte un contrat devenu inutile."
    }),
    q({
      id: 'ofc505', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, obligations en cas de sinistre',
      q: "À quelle obligation de l'ayant droit chaque comportement se rattache-t-il ?",
      cols: ['Avis immédiat', 'Faciliter le constat', 'Interdiction de changement', 'Obligation de sauvetage'],
      rows: [
        "Annoncer le sinistre à l'assureur sans attendre",
        "Fournir tous les renseignements sur les circonstances et les conséquences",
        "Laisser les choses en l'état jusqu'au passage des experts",
        "Faire son possible pour limiter l'ampleur du dommage",
      ],
      answer: [0, 1, 2, 3],
      explain: "Quatre obligations distinctes. L'interdiction de changement est la plus souvent négligée : réparer trop vite empêche l'expertise. Et s'il n'y a pas péril en la demeure, l'assuré doit prendre contact avec l'assureur et suivre ses instructions avant d'agir."
    }),
    q({
      id: 'ofc506', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, prestation selon la faute',
      q: "Quelle est l'étendue de la prestation selon le degré de la faute ?",
      cols: ['Pas de prestation', 'Réduction possible', 'Pleine prestation'],
      rows: [
        "Sinistre causé intentionnellement",
        "Sinistre causé par une faute grave",
        "Sinistre causé par une faute légère",
      ],
      answer: [0, 1, 2],
      explain: "L'échelle est la même que dans la série zéro officielle : l'intention exclut la couverture faute d'aléa, la faute grave permet une réduction proportionnée à sa gravité, la faute légère reste sans conséquence."
    }),
    q({
      id: 'ofc507', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, annonce tardive fautive',
      q: "Quelles sont les conséquences d'un manquement à l'obligation d'annoncer le sinistre ?",
      choices: [
        "Retard fautif : réduction possible ; omission intentionnelle : refus de prestation et départ du contrat",
        "Dans tous les cas, l'assureur doit sa prestation intégrale",
        "Dans tous les cas, l'assureur peut refuser toute prestation",
        "Retard fautif : refus total ; omission intentionnelle : réduction de moitié",
      ],
      answer: [0],
      explain: "La sanction est graduée selon l'état d'esprit de l'assuré. Encore faut-il, pour le retard simplement fautif, que le manquement ait eu une influence — un retard sans conséquence sur l'instruction reste sans effet."
    })
  );

  /* ══════════════ MODULE 2 — FIN DU CONTRAT ══════════════ */

  m2.questions.push(
    q({
      id: 'ofc601', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, moment de la fin du contrat',
      q: "À quel moment le contrat prend-il fin dans chacun de ces cas ?",
      cols: ['Immédiatement', '14 jours après la notification', '30 jours au plus tôt'],
      rows: [
        "Résiliation en cas de réticence",
        "Résiliation après un dommage partiel indemnisé",
        "Résiliation par l'assureur en cas de changement de main",
      ],
      answer: [0, 1, 2],
      explain: "Trois régimes différents. La réticence annule le contrat avec effet immédiat (art. 6 LCA) ; le sinistre partiel laisse quatorze jours (art. 42 LCA) ; le changement de propriétaire laisse au moins trente jours à l'acquéreur pour se réassurer (art. 54 LCA)."
    }),
    q({
      id: 'ofc602', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, sort de la prime',
      q: "Que devient la prime de la période non écoulée dans chacun de ces cas ?",
      cols: ["Remboursée au preneur", "Acquise à l'assureur"],
      rows: [
        "Résiliation par l'assureur après un dommage partiel indemnisé",
        "Résolution pour violation fautive de l'obligation de déclarer le sinistre",
        "Résolution pour fraude à l'assurance",
        "Résiliation pour réticence, jusqu'à la dissolution du contrat",
      ],
      answer: [0, 0, 0, 1],
      explain: "Contre-intuitif mais constant : même quand l'assuré est fautif — déclaration tardive, fraude —, la prime de la période restante lui revient, l'assureur ne portant plus le risque. En cas de réticence, en revanche, le preneur doit la prime jusqu'à la dissolution."
    }),
    q({
      id: 'ofc603', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, reconduction tacite',
      q: "Quelle limite l'art. 47 LCA impose-t-il à la clause de reconduction tacite ?",
      choices: [
        "Le renouvellement ne peut avoir d'effet que pour une année",
        "Le renouvellement ne peut excéder trois années",
        "La clause de reconduction tacite est interdite",
        "Le renouvellement doit être confirmé par écrit chaque année",
      ],
      answer: [0],
      explain: "La prescription est impérative : un contrat ne peut pas se reconduire tacitement pour plusieurs années d'un coup. Le preneur retrouve ainsi une occasion de sortir chaque année."
    }),
    q({
      id: 'ofc604', chap: 'c4', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, extinction du contrat',
      q: "Dans quels cas un contrat d'assurance prend-il fin par principe, c'est-à-dire par son exécution ?",
      choices: [
        "Un dommage total survient et l'assureur verse sa prestation",
        "La durée convenue expire sans clause de reconduction tacite",
        "Le risque assuré disparaît définitivement et complètement",
        "Le preneur change d'adresse en cours de contrat",
        "L'assureur augmente la prime en vertu d'une clause d'adaptation",
      ],
      answer: [0, 1, 2],
      explain: "Ces trois cas éteignent le contrat par lui-même. Le changement d'adresse relève de l'aggravation ou de la diminution du risque, et l'adaptation de prime ouvre seulement un droit de résiliation au preneur."
    }),
    q({
      id: 'ofc605', chap: 'c4', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, autres motifs d'extinction",
      q: "Quels sont les autres motifs d'extinction d'un contrat d'assurance ?",
      choices: [
        "Une clause des CGA prévoyant un droit de résilier ou de résoudre",
        "Une disposition légale prévoyant un tel droit",
        "La volonté commune des parties de l'annuler",
        "La décision de la FINMA d'annuler le contrat",
      ],
      answer: [0, 1, 2],
      explain: "Contrat, loi, ou accord des deux parties : trois voies. La FINMA n'annule jamais un contrat individuel — elle surveille l'entreprise, pas la relation contractuelle."
    })
  );

  /* ══════════════ MODULE 2 — VOIES DE DROIT ══════════════ */

  m2.questions.push(
    q({
      id: 'ofc701', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, ombudsman',
      q: "L'ombudsman de l'assurance privée et de la SUVA : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Il a été créé par l'Association Suisse d'Assurances et il est ouvert à tous.",
        "Il peut proposer des solutions, mais il ne peut pas les imposer.",
        "Lorsqu'une solution est acceptée, elle engage les deux parties.",
        "Il constitue une autorité judiciaire dont la décision peut faire l'objet d'un recours.",
      ],
      answer: [0, 0, 0, 1],
      explain: "C'est un office de médiation, pas un tribunal : il aide à clarifier et propose. La nuance à retenir est la troisième — sans force obligatoire au départ, l'accord accepté lie pourtant les deux parties. Les assurances sociales ont leur propre ombudsman pour l'assurance-maladie sociale."
    }),
    q({
      id: 'ofc702', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, instances en assurance privée',
      q: "Remettez dans l'ordre les instances saisies lors d'un litige d'assurance privée.",
      cols: ['1re étape', '2e étape', '3e étape', '4e étape'],
      rows: [
        "Procédure de conciliation",
        "Première instance cantonale",
        "Deuxième instance cantonale",
        "Tribunal fédéral",
      ],
      answer: [0, 1, 2, 3],
      explain: "Le litige d'assurance privée suit la voie civile ordinaire : tout se joue d'abord au niveau cantonal. Le Tribunal fédéral ne statue qu'en dernier ressort, et sa décision est sans appel."
    }),
    q({
      id: 'ofc703', chap: 'c9', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, valeur litigieuse',
      q: "Quelle condition de valeur un litige d'assurance privée doit-il remplir pour être porté devant le Tribunal fédéral ?",
      choices: [
        "Il doit porter sur au moins CHF 30 000.–",
        "Il doit porter sur au moins CHF 10 000.–",
        "Il doit porter sur au moins CHF 100 000.–",
        "Aucune condition de valeur n'est exigée",
      ],
      answer: [0],
      explain: "L'affaire doit être d'une certaine importance pour être recevable. En dessous de ce seuil, la décision de la dernière instance cantonale est définitive — sauf question juridique de principe."
    }),
    q({
      id: 'ofc704', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, voies en assurances sociales',
      q: "Remettez dans l'ordre les étapes de la procédure applicable aux assurances sociales.",
      cols: ['1re étape', '2e étape', '3e étape'],
      rows: [
        "Opposition auprès de l'autorité de décision",
        "Recours auprès de l'autorité cantonale de recours",
        "Recours en matière de droit public auprès du Tribunal fédéral",
      ],
      answer: [0, 1, 2],
      explain: "Trois étapes, chacune avec un délai de 30 jours. Les deux cours de droit social du Tribunal fédéral, à Lucerne, s'occupent spécialement de ces litiges et jugent en dernière instance."
    }),
    q({
      id: 'ofc705', chap: 'c9', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, prévoyance professionnelle',
      q: "Qu'est-ce qui distingue la procédure applicable aux litiges de la prévoyance professionnelle ?",
      choices: [
        "Elle ne connaît pas l'opposition : l'intéressé recourt directement auprès de l'autorité cantonale",
        "Elle se déroule intégralement devant le Tribunal fédéral",
        "Elle exclut tout recours au Tribunal fédéral",
        "Elle impose une procédure de conciliation préalable obligatoire",
      ],
      answer: [0],
      explain: "C'est l'exception à retenir dans le régime des assurances sociales. La décision de l'autorité cantonale peut ensuite faire l'objet d'un recours en matière de droit public au Tribunal fédéral, comme ailleurs."
    }),
    q({
      id: 'ofc706', chap: 'c9', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, litige, délai d\'opposition',
      q: "De quel délai l'assuré dispose-t-il pour faire opposition à la décision d'une institution d'assurance sociale ?",
      choices: ["30 jours dès la réception de la décision", "14 jours dès la réception de la décision", "3 mois dès la réception", "Aucun délai n'est fixé"],
      answer: [0],
      explain: "Trente jours dès le moment où la décision lui est parvenue. L'autorité prononce ensuite une décision sur opposition, elle-même sujette à recours dans un nouveau délai de trente jours."
    })
  );

  /* ══════════════ SURVEILLANCE DES INTERMÉDIAIRES ══════════════ */

  m2.questions.push(
    q({
      id: 'ofc801', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, objectif de la surveillance des intermédiaires',
      q: "Au regard de quoi la protection de la clientèle est-elle recherchée par la surveillance des intermédiaires ?",
      choices: [
        "La transparence des relations commerciales",
        "La confiance en la qualification personnelle et professionnelle",
        "La confiance en une responsabilité intrinsèque suffisante en cas de prétentions en dommages-intérêts",
        "L'uniformisation des commissions sur le marché",
      ],
      answer: [0, 1, 2],
      explain: "Trois axes : savoir à qui l'on a affaire, être conseillé par quelqu'un de compétent, et pouvoir être indemnisé si le conseil tourne mal. Le niveau des rémunérations n'est pas encadré — seule leur transparence l'est."
    }),
    q({
      id: 'ofc802', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, instruments de la surveillance',
      q: "Quels sont les deux instruments dont le droit de la surveillance dispose à l'égard des intermédiaires ?",
      choices: [
        "Le devoir d'information sur les rapports de représentation et l'inscription au registre des non liés",
        "L'approbation préalable des contrats et le contrôle des primes",
        "L'agrément individuel de chaque intermédiaire et l'examen annuel obligatoire",
        "La caution financière et l'affiliation à une association professionnelle",
      ],
      answer: [0],
      explain: "Le devoir d'information vise tous les intermédiaires : le client doit savoir pour qui son interlocuteur travaille. L'obligation d'inscription au registre de la FINMA ne concerne, elle, que les non liés."
    }),
    q({
      id: 'ofc803', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, inscription au registre (art. 42)',
      q: "Quelles conditions un intermédiaire non lié doit-il remplir pour être inscrit au registre de la FINMA ?",
      choices: [
        "Satisfaire aux conditions personnelles : exercice des droits civils, pas de condamnation pénale incompatible, pas d'acte de défaut de biens",
        "Garantir le respect des obligations réglementaires et les exigences de bonne gestion",
        "Disposer d'une assurance responsabilité civile professionnelle ou d'une sûreté équivalente",
        "Apporter la preuve de la formation initiale et continue conforme aux normes minimales",
        "Justifier d'un chiffre d'affaires annuel minimal",
      ],
      answer: [0, 1, 2, 3],
      explain: "Honorabilité, bonne gestion, sûretés financières et qualification : quatre conditions. Le volume d'affaires n'en fait pas partie — un intermédiaire débutant peut s'inscrire."
    }),
    q({
      id: 'ofc804', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, sûretés financières',
      q: "Quel ordre de grandeur la couverture exigée au titre des sûretés financières atteint-elle ?",
      choices: [
        "Une somme d'assurance de l'ordre de 2 à 5 millions de francs",
        "Une somme d'assurance de l'ordre de 100 000 à 500 000 francs",
        "Une somme d'assurance de l'ordre de 20 à 50 millions de francs",
        "Aucun montant n'est fixé, l'assureur en décide librement",
      ],
      answer: [0],
      explain: "L'assurance responsabilité civile professionnelle — ou une sûreté alternative équivalente — doit couvrir la responsabilité née d'une violation du devoir de diligence, avec un minimum de l'ordre de 2 millions pour l'ensemble des dommages d'une année."
    }),
    q({
      id: 'ofc805', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, obligations particulières',
      q: "À quelle disposition chacune de ces obligations se rattache-t-elle ?",
      cols: ["Prévention des conflits d'intérêts (art. 45a)", 'Publicité des rémunérations (art. 45b)', 'Obligation de rendre compte'],
      rows: [
        "Les entreprises doivent prendre des mesures organisationnelles pour éviter tout désavantage aux preneurs",
        "L'intermédiaire non lié doit informer expressément le preneur de sa rémunération",
        "L'intermédiaire non lié établit chaque année un rapport à l'intention de la FINMA",
      ],
      answer: [0, 1, 2],
      explain: "Trois obligations distinctes de la LSA révisée. Sur la rémunération, la règle est stricte : soit l'intermédiaire renonce à la percevoir de l'assureur, soit il la transfère intégralement au client."
    }),
    q({
      id: 'ofc806', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LSA, sanctions',
      q: "Comment une violation des dispositions de surveillance des intermédiaires peut-elle être sanctionnée ?",
      choices: [
        "Par la radiation du registre, valant interdiction d'exercer, et par des amendes",
        "Par une simple mise en garde écrite de l'autorité",
        "Par l'annulation des contrats conclus par l'intermédiaire",
        "Par une suspension automatique de trois mois",
      ],
      answer: [0],
      explain: "La radiation est la sanction la plus lourde : concrètement, l'intermédiaire ne peut plus travailler. Les contrats déjà conclus, eux, restent valables — la sanction frappe l'intermédiaire, pas les clients."
    })
  );

  /* ══════════════ DEVOIR DE CONSEIL ET RESPONSABILITÉ ══════════════ */

  m1.questions.push(
    q({
      id: 'ofc901', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, aspects du devoir de conseil',
      q: "À quel aspect du devoir de conseil chaque comportement se rattache-t-il ?",
      cols: ["Devoir d'informer et d'instruire", 'Devoir de se renseigner', "Devoir d'avertir"],
      rows: [
        "Renseigner le client sur l'identité de l'assureur et les principaux éléments du contrat",
        "Poser des questions pour vérifier que le client a bien compris l'étendue de la couverture",
        "Signaler au client les risques qu'il encourt s'il s'écarte des recommandations professionnelles",
      ],
      answer: [0, 1, 2],
      explain: "Trois aspects complémentaires : dire, vérifier qu'on a été compris, et alerter. Lorsque le client persiste malgré l'avertissement, il est recommandé de lui faire part de ses doutes par écrit, à des fins de preuve."
    }),
    q({
      id: 'ofc902', chap: 'c6', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "IA, intermédiation, information de l'art. 3 LCA",
      q: "Sur quoi le preneur doit-il être renseigné avant la conclusion du contrat ?",
      choices: [
        "L'identité de l'entreprise d'assurance",
        "Les principaux éléments du contrat",
        "Le traitement confidentiel des données",
        "Le montant des provisions techniques de l'assureur",
      ],
      answer: [0, 1, 2],
      explain: "Trois objets, fixés par l'art. 3 LCA. Pour des raisons de preuve, l'information devrait se faire par écrit. La situation comptable de l'assureur relève, elle, de la publication du rapport sur la situation financière."
    }),
    q({
      id: 'ofc903', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, étendue du devoir pour un agent',
      q: "Sur quels produits porte le devoir d'information de l'intermédiaire exerçant la fonction d'agent ?",
      choices: [
        "Sur les seuls produits de l'entreprise qu'il représente",
        "Sur l'ensemble des produits disponibles sur le marché suisse",
        "Sur les produits de son entreprise et sur ceux des trois principaux concurrents",
        "Sur les produits que le client lui demande expressément de comparer",
      ],
      answer: [0],
      explain: "L'agent n'est pas tenu de connaître les produits de la concurrence : il représente son assureur, et le client le sait puisque le statut doit lui être annoncé. C'est le courtier, mandataire du client, qui doit comparer le marché."
    }),
    q({
      id: 'ofc904', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, devoir de se renseigner',
      q: "Que doit faire l'intermédiaire qui constate que son client se fait une fausse idée de l'étendue de la couverture ?",
      choices: [
        "Lui expliquer son erreur",
        "Se taire, le client étant seul responsable de sa compréhension",
        "Refuser de conclure le contrat",
        "Renvoyer le client vers les conditions générales",
      ],
      answer: [0],
      explain: "Le devoir de se renseigner est actif : l'intermédiaire prend l'initiative de poser des questions pour vérifier que tout est compris. Détecter une méprise et ne rien dire engage sa responsabilité."
    })
  );

  m2.questions.push(
    q({
      id: 'ofc905', chap: 'c7', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, bases juridiques dans la relation triangulaire',
      q: "Quelles sont les principales bases juridiques de la responsabilité dans le double rapport juridique entre intermédiaire, client et assureur ?",
      choices: [
        "La responsabilité aquilienne",
        "Les responsabilités causales",
        "La responsabilité contractuelle",
        "La responsabilité pénale de l'intermédiaire",
      ],
      answer: [0, 1, 2],
      explain: "Trois bases civiles. La responsabilité pénale existe mais poursuit un autre but : sanctionner, non réparer — et elle est indépendante de l'action civile en dommages-intérêts."
    }),
    q({
      id: 'ofc906', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, contre qui le client agit',
      ctx: "Un client a été conseillé par un intermédiaire lié à une entreprise d'assurance. Il estime avoir subi un dommage et cherche à qui s'adresser.",
      q: "Contre qui le client peut-il diriger ses prétentions en dommages-intérêts ?",
      cols: ["Contre l'assureur", "Contre l'intermédiaire"],
      rows: [
        "Violation du contrat d'assurance",
        "Violation du devoir d'informer et de conseiller",
        "Dommages matériels causés à l'occasion d'une visite chez le client",
      ],
      answer: [0, 0, 1],
      explain: "L'assureur répond du contrat et du conseil de son intermédiaire lié — c'est l'art. 34 LCA. Les dommages causés accessoirement lors d'une visite se dirigent d'abord contre l'intermédiaire lui-même, et éventuellement contre l'assureur."
    }),
    q({
      id: 'ofc907', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, relation triangulaire avec un courtier',
      ctx: "Le même client a cette fois été conseillé par un courtier, qu'il a lui-même mandaté.",
      q: "Contre qui le client peut-il diriger ses prétentions en dommages-intérêts ?",
      cols: ["Contre l'assureur", "Contre le courtier"],
      rows: [
        "Violation du contrat d'assurance",
        "Mauvais conseil ou conseil erroné",
        "Dommages causés à l'occasion d'une visite chez le client",
      ],
      answer: [0, 1, 1],
      explain: "C'est là que tout se joue : l'assureur ne répond que du contrat. Le conseil erroné se règle avec le courtier, sur la base du contrat de courtage, parce que le courtier est l'intermédiaire du preneur et non celui de l'assureur."
    }),
    q({
      id: 'ofc908', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, art. 34 et le courtier',
      q: "Pourquoi l'assureur ne répond-il pas des conseils erronés donnés par un courtier ?",
      choices: [
        "Parce que le courtier agit comme intermédiaire du preneur, non de l'assureur : l'art. 34 LCA ne s'applique pas",
        "Parce que le courtier est toujours couvert par sa propre assurance responsabilité civile",
        "Parce que le preneur renonce contractuellement à toute prétention envers l'assureur",
        "Parce que la LCA exclut toute responsabilité pour le conseil en assurance",
      ],
      answer: [0],
      explain: "L'art. 34 LCA rend l'assureur responsable des actes de son intermédiaire — mais le courtier n'est pas le sien. Le preneur a choisi lui-même son spécialiste : le devoir d'informer, de se renseigner et d'avertir repose sur les épaules du courtier."
    }),
    q({
      id: 'ofc909', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, responsabilité pour les auxiliaires',
      q: "Un employé d'une entreprise de courtage commet une faute qui cause un dommage au client. Qui en répond envers le client ?",
      choices: [
        "Le courtier, qui répond des actes de son employé comme des siens (art. 101 CO)",
        "L'employé seul, à titre personnel",
        "L'entreprise d'assurance dont le contrat a été placé",
        "Personne : la faute d'un auxiliaire n'engage pas le mandataire",
      ],
      answer: [0],
      explain: "Art. 101 CO : celui qui recourt à un auxiliaire pour exécuter son obligation répond de lui. Le courtier peut ensuite se retourner contre son employé pour violation du contrat de travail."
    }),
    q({
      id: 'ofc910', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, recours de l\'assureur',
      q: "Dans quel cas l'assureur peut-il exiger réparation de son propre intermédiaire lié ?",
      choices: [
        "Lorsque l'intermédiaire a violé ses obligations contractuelles, en particulier si l'assureur a dû indemniser le client pour ses fautes",
        "Lorsque l'intermédiaire a placé un contrat auprès d'un concurrent",
        "Lorsque le portefeuille de l'intermédiaire diminue d'une année à l'autre",
        "Jamais : l'assureur supporte définitivement les fautes de ses intermédiaires",
      ],
      answer: [0],
      explain: "L'art. 34 LCA protège le client, pas l'intermédiaire. Une fois le client indemnisé, l'assureur se retourne contre celui qui a commis la faute, sur la base du contrat qui les lie."
    }),
    q({
      id: 'ofc911', chap: 'c7', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, prévention de la responsabilité',
      q: "Quelles mesures de prévention de la responsabilité le support officiel met-il en avant ?",
      choices: [
        "L'acquisition et le maintien des compétences professionnelles",
        "L'établissement et le maintien de relations solides avec la clientèle",
        "L'examen des questions juridiques avec le client",
        "Des mesures organisationnelles pour surveiller les processus et documenter les contacts",
        "La gestion correcte des erreurs et des omissions",
        "La limitation contractuelle de toute responsabilité envers le client",
      ],
      answer: [0, 1, 2, 3, 4],
      explain: "Cinq mesures concrètes, toutes tournées vers la qualité du travail et la traçabilité. Exclure sa responsabilité par contrat n'en fait pas partie : une telle clause serait de toute façon sans effet pour les fautes graves."
    })
  );
})();
