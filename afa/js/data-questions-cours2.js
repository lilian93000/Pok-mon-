/* =============================================================
   AFA – Questions au gabarit officiel (2e lot)

   Même gabarit que la série zéro. Ce lot creuse les sujets du
   support de cours myVBV déjà transmis, en visant en priorité
   les chapitres les moins fournis : notions élémentaires,
   affaires d'assurance, marché suisse, réassurance, bases du
   droit et sinistre.
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m1 = M.find(x => x.id === 'm1');
  const m2 = M.find(x => x.id === 'm2');
  if (!m1 || !m2) return;
  const q = (o) => Object.assign({ lvl: 'off' }, o);
  const VF = ['Vrai', 'Faux'];

  /* ═══════ m1/c9 — NOTIONS ÉLÉMENTAIRES ═══════ */
  m1.questions.push(
    q({
      id: 'of2901', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, notions élémentaires, rôles du contrat',
      ctx: "Une entreprise conclut une assurance collective d'indemnités journalières pour son personnel. Elle signe le contrat et acquitte les primes ; ses collaborateurs sont couverts et perçoivent eux-mêmes les indemnités en cas de maladie.",
      q: "Quel rôle chacun tient-il dans ce contrat ?",
      cols: ["Preneur d'assurance", 'Assuré', 'Ayant droit'],
      rows: [
        "L'entreprise qui signe et paie les primes",
        "Le collaborateur exposé au risque de maladie",
        "Le collaborateur qui encaisse l'indemnité journalière",
      ],
      answer: [0, 1, 2],
      explain: "C'est l'assurance pour compte d'autrui : les trois rôles, souvent réunis sur une même personne, se répartissent ici entre deux. Le preneur est le cocontractant et le débiteur de la prime, l'assuré porte le risque, l'ayant droit réclame la prestation."
    }),
    q({
      id: 'of2902', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, notions élémentaires, documents du contrat',
      q: "À quel document du contrat chaque définition correspond-elle ?",
      cols: ['Proposition', 'Police', 'Conditions générales', 'Avenant'],
      rows: [
        "L'offre, émanant en règle générale du client",
        "Le document qui constate le contrat et sert de moyen de preuve",
        "Le texte préformulé définissant couverture, exclusions et obligations",
        "La modification écrite d'un contrat en cours",
      ],
      answer: [0, 1, 2, 3],
      explain: "Quatre documents, quatre fonctions. La police prouve, elle ne valide pas : le contrat naît de l'accord des volontés. Les conditions particulières ou spéciales, elles, priment les conditions générales."
    }),
    q({
      id: 'of2903', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, notions élémentaires, montants du contrat',
      q: "À quelle notion chaque définition se rapporte-t-elle ?",
      cols: ["Somme d'assurance", "Valeur d'assurance", 'Franchise', 'Sous-limite'],
      rows: [
        "Le plafond de la prestation de l'assureur",
        "Ce que vaut réellement l'objet assuré",
        "La part du dommage laissée à la charge de l'assuré",
        "Un plafond particulier applicable à une catégorie de biens",
      ],
      answer: [0, 1, 2, 3],
      explain: "Confondre somme et valeur d'assurance est l'erreur qui coûte le plus cher : quand la somme est inférieure à la valeur, il y a sous-assurance et la règle proportionnelle s'applique. La sous-limite plafonne une catégorie — objets de valeur, vol à l'extérieur — à l'intérieur de la somme globale."
    }),
    q({
      id: 'of2904', chap: 'c9', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, notions élémentaires, grandes distinctions',
      q: "Quelles distinctions fondamentales structurent le vocabulaire de l'assurance ?",
      choices: [
        "Assurance privée ou assurance sociale",
        "Assurance obligatoire ou facultative",
        "Assurance de personnes, de choses ou de patrimoine",
        "Assurance de dommages ou de sommes",
        "Assurance individuelle ou collective",
        "Assurance rentable ou déficitaire",
      ],
      answer: [0, 1, 2, 3, 4],
      explain: "Cinq axes de lecture, qui se combinent sur un même produit. Le caractère rentable ou déficitaire est un résultat d'exploitation, pas une catégorie juridique ou technique."
    }),
    q({
      id: 'of2905', chap: 'c9', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, communauté de risques, contrainte',
      q: "Qu'est-ce qui distingue fondamentalement la communauté de risques de l'entraide familiale ?",
      choices: [
        "Le passage du volontaire au contraignant, avec un droit à la prestation",
        "Le nombre de personnes qui participent à la communauté",
        "Le montant des sommes mises en commun",
        "La durée pendant laquelle la protection est accordée",
      ],
      answer: [0],
      explain: "L'intention d'entraide est la même de part et d'autre. Ce qui change, c'est la règle : dans la famille on aide par solidarité, sans y être tenu ; dans la communauté de risques, des règles contraignantes ouvrent un droit exigible."
    })
  );

  /* ═══════ m1/c10 — LES AFFAIRES D'ASSURANCE ═══════ */
  m1.questions.push(
    q({
      id: 'of2a01', chap: 'c10', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "IA, affaires d'assurance, familles de processus",
      q: "À quelle famille de processus chaque activité appartient-elle ?",
      cols: ['Management', 'Commercial', 'Soutien'],
      rows: [
        "Planification et conduite des activités de l'entreprise",
        "Souscription et gestion des risques",
        "Administration du portefeuille et gestion des sinistres",
        "Droit et compliance",
      ],
      answer: [0, 1, 1, 2],
      explain: "Le test qui tranche : l'activité s'exercerait-elle à l'identique dans une entreprise d'un autre secteur ? Le droit et la compliance, oui — ce sont des processus de soutien. La souscription, non : c'est le métier même de l'assureur."
    }),
    q({
      id: 'of2a02', chap: 'c10', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, distribution, canaux directs et indirects',
      q: "Un intermédiaire s'interpose-t-il, ou l'assureur vend-il lui-même ?",
      cols: ['Vente directe', 'Vente indirecte'],
      rows: [
        "La vente en ligne sur le site de l'assureur",
        "La vente accessoire par un garage ou une agence de voyage",
        "Le direct mail adressé au fichier clients",
        "Les agents multicontrats",
      ],
      answer: [0, 1, 0, 1],
      explain: "Le critère est l'existence d'un intermédiaire entre l'assureur et le client. La vente accessoire est indirecte même quand l'assurance n'est qu'un complément au métier principal du vendeur."
    }),
    q({
      id: 'of2a03', chap: 'c10', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, organisation, service externe et interne',
      q: "Ces fonctions relèvent-elles du service externe ou du service interne ?",
      cols: ['Service externe', 'Service interne'],
      rows: [
        "Conseiller les clients et conclure les contrats d'assurance",
        "Développer les produits et souscrire les risques",
        "Acquérir de nouveaux clients et représenter l'image de l'entreprise",
        "Traiter les dossiers de sinistres depuis le siège",
      ],
      answer: [0, 1, 0, 1],
      explain: "Le service externe est au contact de la clientèle et a pour mission de conclure ; le service interne regroupe tout le reste — management, comptabilité, informatique, personnel, produits, souscription, portefeuille, sinistres, droit et compliance."
    }),
    q({
      id: 'of2a04', chap: 'c10', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "IA, affaires d'assurance, processus commerciaux",
      q: "Quelles activités font partie des processus commerciaux d'un assureur ?",
      choices: [
        "La gestion des produits",
        "Le conseil et la vente",
        "La souscription",
        "L'administration du portefeuille",
        "La gestion des sinistres et des prestations",
        "La tenue de la comptabilité générale",
      ],
      answer: [0, 1, 2, 3, 4],
      explain: "Les processus commerciaux sont ceux qui touchent directement au produit et aux prestations de services. La comptabilité, comme l'actuariat, les RH et l'informatique, relève des processus de soutien."
    })
  );

  /* ═══════ m1/c5 — MARCHÉ SUISSE ═══════ */
  m1.questions.push(
    q({
      id: 'of2501', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, chiffres, taux indicatifs',
      q: "À quel taux indicatif chaque formule correspond-elle ?",
      cols: ['Taux des sinistres', 'Taux des coûts', 'Ratio combiné'],
      rows: [
        "Charge des sinistres ÷ primes",
        "Coûts des opérations d'assurance ÷ primes",
        "(Charge des sinistres + coûts) ÷ primes",
      ],
      answer: [0, 1, 2],
      explain: "Le ratio combiné est la somme des deux autres. À 100 %, les coûts de l'exercice ont exactement égalé la recette des primes : l'activité d'assurance proprement dite est à l'équilibre, et seul le résultat des placements peut encore dégager un bénéfice."
    }),
    q({
      id: 'of2502', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, chiffres, lecture du ratio combiné',
      ctx: "Un assureur non-vie publie un taux des sinistres de 68 % et un taux des coûts de 26 % pour l'exercice écoulé.",
      q: "Que peut-on conclure de son résultat technique ?",
      choices: [
        "Le ratio combiné s'établit à 94 % : l'activité d'assurance est bénéficiaire",
        "Le ratio combiné s'établit à 42 % : l'activité dégage une marge considérable",
        "Le ratio combiné s'établit à 94 % : l'activité est déficitaire",
        "Les deux taux ne s'additionnent pas, aucune conclusion n'est possible",
      ],
      answer: [0],
      explain: "68 + 26 = 94 %. En dessous de 100 %, les primes couvrent les sinistres et les frais : le résultat technique est positif, avant même de compter le rendement des placements."
    }),
    q({
      id: 'of2503', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, ayants droit, attentes envers l\'assureur',
      q: "Quel groupe d'ayants droit exprime chacune de ces attentes ?",
      cols: ['Clients', 'Fournisseurs', 'Société et État'],
      rows: [
        "Un traitement compétent et libéral des sinistres",
        "Une relation d'affaires loyale et le paiement régulier des factures",
        "Une contribution aux devoirs de société : formation, environnement, culture",
      ],
      answer: [0, 1, 2],
      explain: "Six groupes gravitent autour de l'assureur, chacun avec ses attentes propres. Fidéliser les clients reste l'objectif principal, mais il ne tient dans la durée que si les cinq autres groupes y trouvent aussi leur compte."
    }),
    q({
      id: 'of2504', chap: 'c5', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, marché suisse, rôle du produit assurance',
      q: "Comment le produit « assurance » contribue-t-il au bien-être économique ?",
      choices: [
        "En répartissant les risques sur plusieurs épaules, ce qui libère des capacités d'activité",
        "En garantissant un rendement minimal sur l'épargne des ménages",
        "En finançant directement les infrastructures publiques",
        "En supprimant la survenance des sinistres grâce à la prévention",
      ],
      answer: [0],
      explain: "Sans transfert de risque, bien des projets ne seraient pas entrepris : c'est la fonction économique première de l'assurance. Le sentiment d'être protégé est en outre, en lui-même, un élément de qualité de vie."
    }),
    q({
      id: 'of2505', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, marché suisse, acteurs',
      q: "À quel acteur du marché suisse chaque rôle correspond-il ?",
      cols: ['SUVA', 'ASA', 'FINMA', 'Ombudsman'],
      rows: [
        "Assureur-accidents de droit public compétent pour des branches définies par la loi",
        "Association professionnelle représentant les intérêts de la branche",
        "Autorité de surveillance des marchés financiers",
        "Office indépendant de médiation, gratuit et ouvert à tous",
      ],
      answer: [0, 1, 2, 3],
      explain: "Quatre acteurs qu'on confond volontiers. L'ASA défend la branche, la FINMA la surveille, l'ombudsman arbitre les litiges sans pouvoir les trancher, et la SUVA est elle-même un assureur."
    }),
    q({
      id: 'of2506', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, marché suisse, comptes annuels',
      q: "Les comptes annuels d'un assureur : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Ils se composent du compte de résultats et du bilan.",
        "Ils sont au cœur du rapport de gestion.",
        "Ils n'intéressent que l'autorité de surveillance, à l'exclusion du public.",
        "Ils permettent de calculer le taux des sinistres et le taux des coûts.",
      ],
      answer: [0, 0, 1, 0],
      explain: "Le rapport de gestion informe la FINMA, mais aussi les propriétaires de parts, les bailleurs de fonds, les clients, les collaborateurs, les concurrents et les médias. La transparence fait partie du dispositif de protection des assurés."
    })
  );

  /* ═══════ m1/c7 — RÉASSURANCE ═══════ */
  m1.questions.push(
    q({
      id: 'of2701', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, réassurance, proportionnelle et non proportionnelle',
      q: "Sur quoi chacune de ces formes de réassurance raisonne-t-elle ?",
      cols: ['Sur la somme assurée', 'Sur le montant du dommage'],
      rows: [
        "Réassurance en quote-part",
        "Réassurance en excédent de somme",
        "Réassurance en excédent de sinistre",
      ],
      answer: [0, 0, 1],
      explain: "C'est le critère qui sépare les deux grandes familles. L'excédent de somme reste proportionnel — il regarde la somme assurée du risque — alors que l'excédent de sinistre ne l'est pas : il regarde le dommage. La ressemblance des noms est le piège classique."
    }),
    q({
      id: 'of2702', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, réassurance, excédent de somme',
      q: "Comment fonctionne un traité en excédent de somme ?",
      choices: [
        "Le réassureur ne participe qu'aux assurances dont la somme assurée dépasse la priorité convenue",
        "Le réassureur prend une part identique de toutes les assurances du portefeuille",
        "Le réassureur intervient dès qu'un dommage dépasse un montant convenu",
        "Le réassureur couvre le résultat annuel dès qu'il devient déficitaire",
      ],
      answer: [0],
      explain: "La cédante fixe un maximum qu'elle conserve — le plein — et ne cède que ce qui dépasse, risque par risque. Le portefeuille conservé devient homogène, ce que la quote-part ne permet pas puisqu'elle cède la même proportion partout."
    }),
    q({
      id: 'of2703', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, réassurance, mode de conclusion',
      q: "Ces caractéristiques désignent-elles la réassurance facultative ou obligatoire ?",
      cols: ['Facultative', 'Obligatoire'],
      rows: [
        "Elle porte sur des risques isolés, examinés un par un",
        "Elle porte sur des portefeuilles entiers d'assurances",
        "La cédante cède et le réassureur accepte automatiquement",
        "Chaque placement demande une négociation particulière",
      ],
      answer: [0, 1, 1, 0],
      explain: "Le premier axe de la classification officielle porte sur le mode de conclusion, non sur le mode de partage : facultative comme obligatoire peuvent être conclues sur base proportionnelle ou non proportionnelle."
    }),
    q({
      id: 'of2704', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, réassurance, priorité et plafond',
      ctx: "Un traité en excédent de sinistre prévoit une priorité de CHF 500 000.– et un plafond de couverture de CHF 2 millions au-delà de cette priorité.",
      q: "Que supporte le réassureur sur un sinistre de CHF 1,8 million ?",
      choices: ["CHF 1,3 million", "CHF 1,8 million", "CHF 500 000.–", "CHF 2 millions"],
      answer: [0],
      explain: "La cédante garde la priorité de 500 000, le réassureur prend le surplus : 1 800 000 − 500 000 = CHF 1,3 million, ce qui reste dans le plafond de deux millions. Au-delà du sommet du traité, l'exposition redeviendrait entièrement celle de la cédante."
    }),
    q({
      id: 'of2705', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, risques actuariels, limitation du risque',
      q: "L'assureur reste-t-il seul porteur du risque, ou fait-il entrer un tiers ?",
      cols: ['Limitation primaire', 'Limitation secondaire'],
      rows: [
        "Répartir géographiquement les risques souscrits",
        "Créer un pool avec d'autres assureurs pour les risques exceptionnels",
        "Exclure du portefeuille les risques indésirables",
        "Céder les pointes à un réassureur",
      ],
      answer: [0, 1, 0, 1],
      explain: "La limitation primaire agit sur la composition du portefeuille — c'est du travail de souscription et l'assureur reste seul porteur. La limitation secondaire fait entrer des tiers dans le risque : pool et réassurance."
    })
  );

  /* ═══════ m1/c8 — SURVEILLANCE ET SOLVABILITÉ ═══════ */
  m1.questions.push(
    q({
      id: 'of2801', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, surveillance, garantie de solvabilité',
      q: "Quels instruments la LSA mobilise-t-elle pour garantir la solvabilité d'un assureur ?",
      choices: [
        "L'exigence d'un capital minimum",
        "Le rapport entre capital propre et volume des primes",
        "Le fonds de garantie et le fonds d'organisation",
        "Le fonds de sûreté pour les assurances vie",
        "Le plafonnement du nombre de contrats souscrits",
      ],
      answer: [0, 1, 2, 3],
      explain: "La solvabilité est la capacité de faire face à ses engagements. La loi n'impose aucune limite au volume d'affaires : ce n'est pas le nombre de contrats qui pose problème, c'est le capital qui les soutient."
    }),
    q({
      id: 'of2802', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, surveillance, plan d\'exploitation',
      q: "Le plan d'exploitation : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Il décrit les branches exploitées, l'organisation, les bases techniques et la réassurance.",
        "Il constitue la pièce sur laquelle la FINMA fonde son examen de la demande d'agrément.",
        "Il peut être modifié librement, sans en informer l'autorité.",
        "La conformité à un plan figure parmi les caractéristiques essentielles de l'assurance.",
      ],
      answer: [0, 0, 1, 0],
      explain: "Le plan d'exploitation est le document-clé de l'autorisation, et toute modification importante doit être annoncée. C'est aussi lui qui permet à l'autorité de vérifier le respect des exigences de la technique d'assurance — d'où sa place parmi les quatorze caractéristiques."
    }),
    q({
      id: 'of2803', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, surveillance, fortune liée',
      q: "À quoi la fortune liée est-elle affectée ?",
      choices: [
        "À la garantie des prétentions découlant des contrats d'assurance",
        "Au financement de la constitution et du développement de l'entreprise",
        "Au versement des dividendes aux actionnaires",
        "À la rémunération du réseau d'intermédiaires",
      ],
      answer: [0],
      explain: "En cas de faillite, les assurés ne sont pas de simples créanciers : la fortune liée leur est réservée par privilège. Ne pas la confondre avec le fonds d'organisation, qui finance, lui, le démarrage et l'expansion de l'entreprise."
    })
  );

  /* ═══════ m1/c6 — INTERMÉDIATION ═══════ */
  m1.questions.push(
    q({
      id: 'of2601', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, modes de rémunération',
      q: "À quel mode de rémunération chaque description correspond-elle ?",
      cols: ["Courtage d'acquisition", 'Commission sur le portefeuille', 'Courtage permanent', 'Honoraire'],
      rows: [
        "Rétribution de la seule conclusion de l'affaire",
        "Rétribution du suivi de l'effectif des assurés",
        "Rétribution échelonnée, en règle générale annuelle, sur toute la durée du contrat",
        "Rétribution fixe convenue par contrat, au temps consacré ou au forfait",
      ],
      answer: [0, 1, 2, 3],
      explain: "Le courtage permanent a un mérite propre : versé année après année, il retire au courtier toute incitation financière à replacer ailleurs les contrats de ses clients. Il est surtout pratiqué avec les entreprises."
    }),
    q({
      id: 'of2602', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, honoraire et frais',
      q: "Dans quel cas l'intermédiaire rémunéré par honoraire peut-il réclamer le remboursement de ses frais ?",
      choices: [
        "Uniquement si cela a été convenu",
        "Toujours, les frais étant accessoires à l'honoraire",
        "Jamais, l'honoraire couvrant nécessairement les frais",
        "Uniquement lorsque l'honoraire est facturé au forfait",
      ],
      answer: [0],
      explain: "Le remboursement des frais ne va pas de soi : il suppose une clause. La règle diffère pour les employés d'une entreprise de courtage, qui ont droit au remboursement de leurs frais par leur employeur."
    }),
    q({
      id: 'of2603', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, statut des courtiers Inhouse',
      q: "Les courtiers Inhouse : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Ils sont engagés par une entreprise pour s'occuper de ses propres questions d'assurance.",
        "Ils exercent une fonction de courtier à l'égard de l'assureur.",
        "Ils sont des intermédiaires au sens de la loi sur la surveillance des assurances.",
        "Étant employés du preneur d'assurance, la protection de la LSA n'a pas d'objet dans leur cas.",
      ],
      answer: [0, 0, 1, 0],
      explain: "La LSA protège le preneur d'assurance contre les intermédiaires. Celui qui est salarié du preneur travaille déjà pour lui : le protéger contre son propre employé n'aurait aucun sens."
    }),
    q({
      id: 'of2604', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, conseil en prévention',
      q: "Quelles fonctions le conseil en matière de prévention des sinistres remplit-il pour l'assureur ?",
      choices: [
        "Il accroît la crédibilité de la compagnie et construit une image de fournisseur de solutions globales",
        "Il permet de facturer un supplément de prime au titre du service rendu",
        "Il dispense l'assureur de son obligation d'indemniser en cas de sinistre",
        "Il remplace l'analyse des besoins dans l'entretien de conseil",
      ],
      answer: [0],
      explain: "L'expérience quotidienne des sinistres fait des assureurs de bons conseillers en prévention, et ce conseil ne coûte rien au client. Il sert la relation autant que la sinistralité."
    }),
    q({
      id: 'of2605', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, assistance en cas de sinistre',
      q: "Quelle attitude le support officiel recommande-t-il à l'intermédiaire au moment d'un sinistre ?",
      choices: [
        "Rendre de précieux services au client, plutôt que de saisir l'occasion d'une vente",
        "Profiter du contact pour proposer une extension de couverture",
        "Renvoyer le client vers le service des sinistres et se retirer",
        "Attendre le règlement du dossier avant de reprendre contact",
      ],
      answer: [0],
      explain: "Le client se trouve dans une situation inhabituelle — colère, deuil, choc — qui réclame du doigté. C'est le moment où la relation de confiance se construit ou se perd, et une vente forcée la détruit."
    }),
    q({
      id: 'of2606', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, processus de vente',
      q: "À quelle phase du processus de vente chaque tâche appartient-elle ?",
      cols: ['Planification et préparation', 'Exécution et conclusion', 'Travaux subséquents'],
      rows: [
        "Rassembler les informations sur la situation du client avant l'entretien",
        "Mener le conseil et faire signer la proposition",
        "Contrôler la satisfaction et traiter les réclamations",
      ],
      answer: [0, 1, 2],
      explain: "Le processus ne s'arrête pas à la signature : les travaux subséquents font partie du métier, et c'est souvent là que se joue la fidélisation. La gestion des réclamations est d'ailleurs ce qui évite qu'un litige remonte jusqu'à l'ombudsman."
    })
  );

  /* ═══════ m1/c2 — PRINCIPES TECHNIQUES ═══════ */
  m1.questions.push(
    q({
      id: 'of2201', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, attribution",
      q: "Protection, cumul, exploitation : à quelle caractéristique essentielle chaque énoncé renvoie-t-il ?",
      cols: ['Protection et sécurité', 'Cumul', 'Exploitation économique'],
      rows: [
        "L'assuré ne doit plus craindre de tomber dans la gêne : il gagne en liberté financière",
        "Un seul événement entraîne une accumulation de prestations",
        "Le rapport entre dépenses et recettes doit rester favorable",
      ],
      answer: [0, 1, 2],
      explain: "Trois des quatorze caractéristiques essentielles. Le cumul est le seul point négatif de la liste : c'est le phénomène qu'on atténue par une meilleure répartition des risques."
    }),
    q({
      id: 'of2202', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, loi des grands nombres",
      q: "Comment la loi des grands nombres permet-elle d'estimer la prime à l'avance ?",
      choices: [
        "La fréquence des cas des années écoulées peut être extrapolée dans le futur",
        "Le nombre de contrats garantit un bénéfice à l'assureur",
        "Le volume des primes encaissées couvre nécessairement les sinistres",
        "L'augmentation du portefeuille réduit le coût moyen de chaque sinistre",
      ],
      answer: [0],
      explain: "Elle suppose des cas fortuits et une communauté aussi homogène que possible. C'est cette régularité statistique qui rend l'estimation préalable possible — sans quoi la prime ne pourrait pas être calculée."
    }),
    q({
      id: 'of2203', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, risques actuariels, fortuit et erreur',
      q: "Ces situations relèvent-elles du risque fortuit ou du risque d'erreur ?",
      cols: ['Risque fortuit', "Risque d'erreur"],
      rows: [
        "Un hiver exceptionnellement rigoureux fait exploser les sinistres de l'exercice",
        "Le vieillissement de la population fausse durablement les hypothèses du tarif vie",
        "Les statistiques restent bonnes, mais la réalité de l'année s'en écarte fortement",
      ],
      answer: [0, 1, 0],
      explain: "Le risque fortuit se compense dans le temps : bonnes et mauvaises années s'équilibrent. Le risque d'erreur ne se compense pas — une donnée de base a changé, et il faut corriger le tarif."
    }),
    q({
      id: 'of2204', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, prime, calcul de la prime au comptant',
      ctx: "La prime contractuelle d'une police véhicules s'élève à CHF 800.–. Le client bénéficie d'un bonus de 30 %.",
      q: "Quelle prime lui est facturée ?",
      choices: ["CHF 560.–", "CHF 800.–", "CHF 240.–", "CHF 1 040.–"],
      answer: [0],
      explain: "Le bonus se déduit de la prime contractuelle pour donner la prime au comptant : 800 − 30 % = CHF 560.–. Un malus, lui, s'ajouterait — c'est la dernière étape de la chaîne de la prime."
    }),
    q({
      id: 'of2205', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, systèmes de financement, exemples',
      q: "À quel système de financement chaque exemple correspond-il ?",
      cols: ['Répartition', 'Capitalisation', 'Couverture des besoins'],
      rows: [
        "L'AVS et son fonds de compensation",
        "La prévoyance professionnelle",
        "Une assurance ménage conclue pour trois ans",
        "La part d'épargne d'une assurance vie mixte",
      ],
      answer: [0, 1, 2, 1],
      explain: "Le régime de l'assurance privée est la couverture des besoins : prime calculée à l'avance, réserve technique, contrats de un à cinq ans. La capitalisation ne concerne que le 2e pilier et la part épargne de la vie mixte."
    }),
    q({
      id: 'of2206', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, systèmes de financement, provisions',
      q: "Pourquoi le système de la couverture des besoins impose-t-il de constituer des provisions ?",
      choices: [
        "Parce que des sinistres déclarés dans l'année ne seront réglés que plus tard",
        "Parce que les primes de l'année suivante ne sont pas encore encaissées",
        "Parce que la loi impose un capital minimum aux assureurs privés",
        "Parce que les assurés peuvent résilier leur contrat en tout temps",
      ],
      answer: [0],
      explain: "Une partie de la prime alimente la réserve technique, le reste paie les prestations courantes — mais un sinistre annoncé en décembre se règlera l'année suivante. La provision inscrit cette dette au bilan de l'exercice où le fait générateur est survenu."
    })
  );

  /* ═══════ m2/c1 — BASES DU DROIT ═══════ */
  m2.questions.push(
    q({
      id: 'of2b01', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, contenu des titres',
      q: "Dans quel titre de la LCA chercher chacune de ces règles ?",
      cols: ['Dispositions générales', 'Dispositions spéciales', 'Dispositions impératives'],
      rows: [
        "Le droit de révocation de 14 jours applicable à tout contrat",
        "Les règles propres à l'assurance contre les dommages et à l'assurance des personnes",
        "La liste des articles auxquels le contrat ne peut pas déroger",
      ],
      answer: [0, 1, 2],
      explain: "Les dispositions générales (art. 1 à 47a) valent pour tous les contrats ; les spéciales (art. 50 à 96) traitent des branches ; les impératives (art. 97 à 99) verrouillent la protection du preneur ; les finales (art. 100 à 104) règlent l'entrée en vigueur et le droit transitoire."
    }),
    q({
      id: 'of2b02', chap: 'c1', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, contrat, prestations réciproques',
      q: "Que se promettent réciproquement l'entreprise d'assurance et le preneur ?",
      choices: [
        "L'assureur promet la sécurité économique en cas d'événement assuré, le preneur promet la prime convenue",
        "L'assureur promet un rendement sur les primes, le preneur promet de rester fidèle",
        "L'assureur promet de prévenir le sinistre, le preneur promet de déclarer tout changement",
        "L'assureur promet d'indemniser tout dommage, le preneur promet de ne pas se montrer négligent",
      ],
      answer: [0],
      explain: "L'assureur ne promet pas d'empêcher le sinistre, ni de réparer tout dommage : il promet une sécurité économique pour le cas où l'événement assuré causerait un préjudice financier. C'est la définition même de la prestation d'assurance."
    }),
    q({
      id: 'of2b03', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, sources, où chercher la réponse',
      q: "Quelle source consulter en priorité pour chacune de ces questions ?",
      cols: ['La police et ses conditions', 'La LCA', 'Le CO ou le CC'],
      rows: [
        "L'étendue exacte de la couverture vol à l'extérieur souscrite par ce client",
        "Le délai dont dispose l'assureur pour résilier après une réticence",
        "La capacité d'un mineur à conclure seul un contrat",
      ],
      answer: [0, 1, 2],
      explain: "On part toujours du contrat, puis on remonte : la LCA pour ce qui est propre à l'assurance, le CO et le CC pour les règles générales du droit privé. Le CO supplée aux lacunes de la LCA, il ne la précède pas."
    })
  );

  /* ═══════ m2/c5 — SINISTRE ET PRESTATIONS ═══════ */
  m2.questions.push(
    q({
      id: 'of2c01', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, obligations en cas de sinistre',
      ctx: "Un dégât d'eau se déclare dans l'appartement d'un assuré, en pleine nuit. L'eau s'écoule d'une conduite éclatée et gagne le parquet du salon.",
      q: "Ces comportements sont-ils conformes ou contraires aux obligations de l'ayant droit ?",
      cols: ['Conforme', 'Contraire'],
      rows: [
        "Fermer immédiatement la vanne principale pour arrêter l'écoulement",
        "Annoncer le sinistre à l'assureur dès le lendemain matin",
        "Faire poser un parquet neuf avant le passage de l'expert",
        "Conserver les factures et le rapport du plombier pour l'assureur",
      ],
      answer: [0, 0, 1, 0],
      explain: "Trois obligations respectées, une violée. Remplacer le parquet avant l'expertise contrevient à l'interdiction de changement : l'assuré doit laisser les choses en l'état jusqu'à ce que le sinistre ait été vu, sauf péril en la demeure."
    }),
    q({
      id: 'of2c02', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, obligation de sauvetage',
      q: "Que doit faire l'ayant droit lorsqu'il n'y a pas péril en la demeure ?",
      choices: [
        "Prendre contact avec l'entreprise d'assurance et suivre ses instructions",
        "Engager immédiatement les travaux qu'il juge nécessaires",
        "Attendre passivement la visite de l'expert sans rien entreprendre",
        "Faire établir trois devis avant toute intervention",
      ],
      answer: [0],
      explain: "L'obligation de limiter le dommage n'autorise pas à agir seul quand rien ne presse : c'est l'assureur qui décide alors des mesures. En cas d'urgence en revanche, l'assuré agit d'abord et rend compte ensuite."
    }),
    q({
      id: 'of2c03', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, exigibilité de la prestation',
      ctx: "Un assuré annonce son sinistre le 5 septembre. L'assureur lui réclame des pièces complémentaires, qu'il reçoit le 20 septembre et qui lui permettent d'établir le bien-fondé de la prétention.",
      q: "À partir de quand la prestation devient-elle exigible ?",
      choices: [
        "Quatre semaines après le 20 septembre",
        "Quatre semaines après le 5 septembre",
        "Immédiatement dès le 20 septembre",
        "Immédiatement dès l'annonce du 5 septembre",
      ],
      answer: [0],
      explain: "Le délai de quatre semaines court dès la réception des renseignements permettant à l'assureur de se convaincre du bien-fondé, non dès l'annonce. Réclamer des pièces qui ne servent à rien pour retarder ce point de départ serait contraire à la bonne foi."
    }),
    q({
      id: 'of2c04', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, dommage total et partiel',
      q: "Le sort du contrat après le sinistre : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Un dommage total éteint le contrat.",
        "En cas de dommage total, la prime de l'année en cours reste acquise à l'assureur.",
        "Un dommage partiel éteint également le contrat.",
        "Après un dommage partiel indemnisé, les deux parties peuvent résilier.",
      ],
      answer: [0, 0, 1, 0],
      explain: "Le dommage total épuise la prestation : le contrat s'éteint par son exécution. Le dommage partiel, lui, laisse le contrat en vigueur et ouvre seulement un droit de résiliation aux deux parties (art. 42 LCA)."
    }),
    q({
      id: 'of2c05', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, omission intentionnelle',
      q: "Quelle est la conséquence d'une omission intentionnelle d'annoncer le sinistre ?",
      choices: [
        "L'assureur peut se départir du contrat et refuser la prestation",
        "L'assureur réduit la prestation de moitié",
        "L'assureur doit la prestation, mais peut majorer la prime future",
        "L'assureur ne peut rien faire s'il a pu instruire le dossier",
      ],
      answer: [0],
      explain: "L'échelle est graduée : le retard simplement fautif permet une réduction éventuelle, l'omission intentionnelle ouvre le droit de se départir et de refuser. C'est l'intention qui fait basculer la sanction."
    })
  );

  /* ═══════ m2/c3 et c4 — CONTRAT ═══════ */
  m2.questions.push(
    q({
      id: 'of2d01', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, formation du contrat',
      q: "Remettez dans l'ordre les étapes de la formation du contrat d'assurance.",
      cols: ['1re étape', '2e étape', '3e étape'],
      rows: [
        "Le proposant envoie la proposition à l'entreprise d'assurance",
        "L'entreprise accepte la proposition dans les limites du délai d'option",
        "Le contrat d'assurance devient effectif",
      ],
      answer: [0, 1, 2],
      explain: "L'offre vient du client, l'acceptation de l'assureur : c'est ce qui fonde sa liberté de sélectionner les risques. La police n'intervient qu'ensuite, pour attester ce qui a déjà été conclu."
    }),
    q({
      id: 'of2d02', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, proposition complète',
      q: "Ces éléments font-ils partie des six points essentiels de la proposition ?",
      cols: ['Point essentiel', 'Point non essentiel'],
      rows: [
        "Le danger assuré",
        "La prestation d'assurance",
        "La durée du contrat",
        "Le renvoi aux conditions générales",
      ],
      answer: [0, 0, 0, 1],
      explain: "Les six points essentiels sont le danger, l'objet ou la personne assurée, la prestation, la prime, le début de la couverture et la durée. Le renvoi aux CGA figure en pratique dans le formulaire, mais il relève des autres points, non des éléments essentiels."
    }),
    q({
      id: 'of2d03', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, échéance de la prime',
      q: "L'obligation de payer la prime : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "La première prime est due lors de la conclusion du contrat.",
        "Les primes suivantes sont dues au début de chaque période d'assurance.",
        "L'assureur peut augmenter la prime en cours de contrat même sans clause dans les CGA.",
        "Le montant de la prime est celui qui a été convenu entre les parties.",
      ],
      answer: [0, 0, 1, 0],
      explain: "L'augmentation en cours de contrat suppose une clause d'adaptation prévue dans les conditions générales — et lorsque l'assureur l'exerce, le preneur peut résilier pour la date d'entrée en vigueur de la modification."
    }),
    q({
      id: 'of2d04', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, reconduction tacite',
      ctx: "Une police d'assurance ménage conclue pour une année comporte une clause de reconduction tacite : le contrat se renouvelle automatiquement d'une année s'il n'est pas résilié trois mois avant son expiration.",
      q: "Que se passe-t-il si le preneur ne réagit pas dans le délai ?",
      choices: [
        "Le contrat se renouvelle pour une année, et pour une seule",
        "Le contrat se renouvelle pour une durée indéterminée",
        "Le contrat se renouvelle pour trois années supplémentaires",
        "Le contrat prend fin à l'échéance, faute de confirmation écrite",
      ],
      answer: [0],
      explain: "L'art. 47 LCA prescrit impérativement que le renouvellement ne peut avoir d'effet que pour une année. Le preneur retrouve donc chaque année une occasion de sortir, quelle que soit la rédaction de la clause."
    })
  );

  /* ═══════ m2/c9 — LITIGES ═══════ */
  m2.questions.push(
    q({
      id: 'of2e01', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, assurance privée et assurances sociales',
      q: "Ces étapes appartiennent-elles à la procédure de l'assurance privée ou des assurances sociales ?",
      cols: ['Assurance privée', 'Assurances sociales'],
      rows: [
        "Procédure de conciliation, puis première et deuxième instances cantonales",
        "Opposition auprès de l'autorité de décision",
        "Recours en matière de droit public auprès du Tribunal fédéral",
        "Recours auprès de l'autorité cantonale de recours",
      ],
      answer: [0, 1, 1, 1],
      explain: "Le litige d'assurance privée suit la voie civile ordinaire ; celui des assurances sociales passe par l'opposition puis les recours de droit public. Les deux cours de droit social du Tribunal fédéral, à Lucerne, traitent ces derniers."
    }),
    q({
      id: 'of2e02', chap: 'c9', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, gestion des réclamations',
      q: "Qu'est-ce qui se trouve à la base de la plupart des conflits en assurance privée ?",
      choices: [
        "Un client mécontent de son indemnisation",
        "Un défaut d'information au moment de la conclusion",
        "Une erreur de tarification de l'assureur",
        "Un désaccord sur la durée du contrat",
      ],
      answer: [0],
      explain: "Presque toujours, le litige naît au moment du règlement du sinistre. Une bonne gestion des réclamations suffit souvent à arranger les choses — c'est seulement dans le cas contraire qu'une médiation s'impose."
    })
  );
})();
