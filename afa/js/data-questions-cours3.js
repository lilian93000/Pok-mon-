/* =============================================================
   AFA – Questions au gabarit officiel (3e lot)

   Achève l'exploitation du support de cours myVBV transmis :
   les caractéristiques essentielles encore inutilisées, les
   chiffres du marché, les formes de conseil et les segments,
   les fonds prévus par la LSA, et les points de détail du
   contrat qui n'avaient pas encore donné lieu à question.
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m1 = M.find(x => x.id === 'm1');
  const m2 = M.find(x => x.id === 'm2');
  if (!m1 || !m2) return;
  const q = (o) => Object.assign({ lvl: 'off' }, o);
  const VF = ['Vrai', 'Faux'];

  /* ═══════ Les 14 caractéristiques, suite ═══════ */
  m1.questions.push(
    q({
      id: 'of3201', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, communauté et prime",
      q: "Communauté, prime, hasard : à quelle caractéristique essentielle chaque énoncé renvoie-t-il ?",
      cols: ['Communauté des assurés', 'Prime', 'Hasard'],
      rows: [
        "Les assurés forment une communauté de risques dont l'entreprise assume l'organisation",
        "Le prix à payer pour la protection d'assurance",
        "La loi des grands nombres se fonde sur des cas indépendants de la volonté de l'assuré",
      ],
      answer: [0, 1, 2],
      explain: "Trois des quatorze caractéristiques essentielles. Le hasard va de pair avec l'exigence d'une communauté aussi homogène que possible : sans cas fortuits et sans homogénéité, la statistique ne dit plus rien."
    }),
    q({
      id: 'of3202', chap: 'c2', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, ce que l'assuré obtient",
      q: "Quelles caractéristiques décrivent ce que l'assuré obtient de l'assurance ?",
      choices: [
        "Un droit à la prestation, et non une aide discrétionnaire",
        "Une protection et une sécurité qui lui rendent de la liberté financière",
        "La couverture du besoin pécuniaire né de l'événement assuré",
        "L'interdiction de s'enrichir aux dépens des autres assurés",
        "La garantie que l'entreprise dégagera un bénéfice",
      ],
      answer: [0, 1, 2, 3],
      explain: "Les quatorze caractéristiques se lisent en trois blocs : ce que l'assuré obtient, ce que l'assurance calcule, ce que l'entreprise doit respecter. Le bénéfice relève du troisième bloc — l'exploitation économique — et concerne l'entreprise, pas l'assuré."
    }),
    q({
      id: 'of3203', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, fraude",
      q: "À quelle caractéristique essentielle la fraude à l'assurance porte-t-elle atteinte ?",
      choices: [
        "À l'interdiction de l'enrichissement illégitime",
        "À la conformité à un plan d'exploitation",
        "À l'estimation préalable de la prime",
        "À l'équipe pour la sécurité",
      ],
      answer: [0],
      explain: "Le fraudeur s'enrichit aux dépens des autres membres de la communauté : ce n'est pas l'assureur seul qui est lésé, c'est la mutualité. Le support qualifie expressément la fraude de grave violation de ce principe."
    }),
    q({
      id: 'of3204', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, risques actuariels, limitation primaire',
      q: "Ces mesures de limitation primaire jouent-elles sur la taille, l'homogénéité ou le partage du risque ?",
      cols: ['Taille du portefeuille', 'Homogénéité', 'Partage du risque'],
      rows: [
        "Constituer de très grands portefeuilles",
        "Écarter à la souscription les risques indésirables",
        "Faire participer l'assuré par une franchise ou une quote-part",
        "Souscrire le risque à plusieurs assureurs, en coassurance",
      ],
      answer: [0, 1, 2, 2],
      explain: "La limitation primaire agit sur la composition même du portefeuille. La coassurance en fait partie : plusieurs assureurs se partagent le risque dès la souscription, chacun envers le preneur — à la différence de la réassurance, qui relève de la limitation secondaire."
    })
  );

  /* ═══════ Chiffres et poids économique ═══════ */
  m1.questions.push(
    q({
      id: 'of3501', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, marché suisse, ordres de grandeur',
      q: "Quel ordre de grandeur correspond à chacune de ces données du marché suisse ?",
      cols: ['Environ 50 000', 'Environ 140 milliards', 'Environ 80 milliards'],
      rows: [
        "Nombre de collaborateurs employés en Suisse",
        "Primes brutes comptabilisées, en francs",
        "Paiements pour cas d'assurance, en francs",
      ],
      answer: [0, 1, 2],
      explain: "Ces chiffres évoluent d'une année à l'autre : ce sont les ordres de grandeur qu'il faut retenir, pas les décimales. Ils situent l'assurance parmi les tout premiers employeurs et contribuables du pays."
    }),
    q({
      id: 'of3502', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, marché suisse, rôle de bailleur',
      q: "À quel titre l'industrie de l'assurance pèse-t-elle sur le marché immobilier suisse ?",
      choices: [
        "Elle acquiert terrains, logements et locaux commerciaux, et prête sur hypothèque",
        "Elle fixe les loyers de référence utilisés par les cantons",
        "Elle assure obligatoirement tous les immeubles construits en Suisse",
        "Elle finance directement la construction de logements d'utilité publique",
      ],
      answer: [0],
      explain: "Les primes encaissées d'avance doivent être placées : l'immobilier en absorbe une part importante. L'assureur y est à la fois propriétaire, bailleur et prêteur hypothécaire."
    }),
    q({
      id: 'of3503', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, marché suisse, fonds étrangers',
      q: "Comment l'industrie suisse de l'assurance génère-t-elle des fonds en provenance de l'étranger ?",
      choices: [
        "Par la rétrocession à la maison mère des gains réalisés par les filiales étrangères",
        "Par la vente de polices suisses à des clients domiciliés hors de Suisse",
        "Par les subventions versées par les organisations internationales",
        "Par l'exonération fiscale accordée aux réassureurs étrangers",
      ],
      answer: [0],
      explain: "Plusieurs grands groupes suisses réalisent la majeure partie de leur chiffre d'affaires hors de Suisse. Les bénéfices remontés au siège constituent un apport net pour l'économie nationale."
    })
  );

  /* ═══════ Conseil, segments, prestation financière intégrée ═══════ */
  m1.questions.push(
    q({
      id: 'of3601', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, formes de conseil',
      q: "Ces démarches relèvent-elles du conseil global, du conseil partiel ou de la prestation financière intégrée ?",
      cols: ['Conseil global', 'Conseil partiel', 'Prestation financière intégrée'],
      rows: [
        "Passer en revue l'ensemble de la situation d'assurance du client",
        "Traiter uniquement la couverture véhicule que le client vient demander",
        "Analyser les besoins du client tant en assurance que dans le domaine financier",
      ],
      answer: [0, 1, 2],
      explain: "Le conseil global gagne en importance, et la prestation financière intégrée en est le prolongement : elle sort du seul champ de l'assurance pour embrasser la situation financière. Le conseil partiel reste légitime, mais il expose à laisser des lacunes."
    }),
    q({
      id: 'of3602', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, distribution, segments de marché',
      q: "Pourquoi les assureurs divisent-ils leur marché en segments ?",
      choices: [
        "Pour offrir à chacun des paquets d'assurances qui lui sont spécifiques",
        "Pour appliquer une prime identique à l'intérieur de chaque segment",
        "Pour se répartir géographiquement la clientèle entre concurrents",
        "Pour satisfaire une exigence de l'autorité de surveillance",
      ],
      answer: [0],
      explain: "Les besoins d'un jeune locataire, d'une famille propriétaire et d'une PME n'ont rien de commun. La segmentation permet de construire des offres cohérentes, sans que la prime soit pour autant uniforme à l'intérieur d'un segment."
    }),
    q({
      id: 'of3603', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, efficacité et efficience',
      q: "Ces situations traduisent-elles un défaut d'efficacité ou un défaut d'efficience ?",
      cols: ["Défaut d'efficacité", "Défaut d'efficience"],
      rows: [
        "Un conseil excellent, mais qui ne débouche sur aucune conclusion",
        "Une affaire conclue au prix d'un nombre de visites hors de proportion avec sa prime",
        "Une couverture placée qui n'apporte au client aucune protection notable",
      ],
      answer: [0, 1, 0],
      explain: "L'efficacité, c'est atteindre l'objectif ; l'efficience, c'est l'atteindre à un coût raisonnable. Un conseil qui ne conclut pas, ou qui conclut sur du vide, manque sa cible ; multiplier les contacts sur un petit potentiel coûte trop cher."
    }),
    q({
      id: 'of3604', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, documentation du conseil',
      q: "Pourquoi recommande-t-on à l'intermédiaire de confirmer par écrit ses doutes lorsque le client passe outre ses recommandations ?",
      choices: [
        "Pour disposer d'une preuve que le devoir d'avertir a été rempli",
        "Pour obliger le client à revenir sur sa décision",
        "Pour transférer la responsabilité à l'entreprise d'assurance",
        "Pour satisfaire une exigence de forme imposée par la LCA",
      ],
      answer: [0],
      explain: "Le devoir d'avertir est rempli dès l'avertissement oral, mais rien ne le prouve. L'écrit protège l'intermédiaire le jour où le risque écarté se réalise et où le client conteste avoir été prévenu."
    })
  );

  /* ═══════ LSA : fonds, branches particulières, transfrontalier ═══════ */
  m2.questions.push(
    q({
      id: 'of3801', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, fonds prévus par la loi',
      q: "À quoi chacun de ces fonds est-il destiné ?",
      cols: ['Fonds de garantie', "Fonds d'organisation", 'Fonds de sûreté'],
      rows: [
        "Garantir les engagements pris envers les assurés",
        "Financer la constitution et le développement de l'entreprise",
        "Répondre des engagements propres aux assurances vie",
      ],
      answer: [0, 1, 2],
      explain: "Trois fonds distincts, qu'on confond volontiers. Seul le fonds d'organisation sert l'entreprise elle-même ; les deux autres protègent les assurés, dont le fonds de sûreté réservé à la branche vie."
    }),
    q({
      id: 'of3802', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, obligation de caution',
      q: "Quelles entreprises doivent déposer une caution pour exercer en Suisse ?",
      choices: [
        "Les entreprises d'assurance extérieures à l'Union européenne",
        "Toutes les entreprises d'assurance étrangères sans exception",
        "Les entreprises suisses qui souhaitent opérer à l'étranger",
        "Les entreprises de réassurance, quelle que soit leur origine",
      ],
      answer: [0],
      explain: "La caution est un montant d'argent déposé en garantie, exigé des assureurs hors UE qui veulent opérer en Suisse. Elle compense l'absence de régime de surveillance équivalent reconnu."
    }),
    q({
      id: 'of3803', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, domaines particuliers',
      q: "Quels domaines la LSA traite-t-elle par des règles particulières ?",
      choices: [
        "Certaines branches d'assurance soumises à conditions particulières",
        "Les assurances vie qualifiées",
        "Les transactions d'assurance transfrontalières",
        "Les mesures en cas de risque d'insolvabilité et de liquidation",
        "Le contenu obligatoire des conditions générales d'assurance",
      ],
      answer: [0, 1, 2, 3],
      explain: "La LSA encadre l'entreprise et son activité. Le contenu du contrat — donc des CGA — relève de la LCA et de la liberté contractuelle, sous réserve des dispositions impératives."
    }),
    q({
      id: 'of3804', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, ce que la surveillance protège',
      q: "La surveillance des assurances : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Elle vise à protéger les assurés contre l'insolvabilité et contre les abus.",
        "Elle repose sur la LSA et sur l'ordonnance sur la surveillance.",
        "Elle garantit aux entreprises un niveau minimal de rentabilité.",
        "Elle s'exerce sur les entreprises comme sur les intermédiaires.",
      ],
      answer: [0, 0, 1, 0],
      explain: "L'art. 1 al. 2 LSA place la protection des assurés au centre. La rentabilité n'est un objectif que dans la mesure où elle conditionne la solvabilité : la surveillance ne garantit aucun résultat d'exploitation."
    })
  );

  /* ═══════ Contrat : détails non encore exploités ═══════ */
  m2.questions.push(
    q({
      id: 'of3c01', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, contrat, conditions applicables',
      q: "À quel niveau de conditions chaque description correspond-elle ?",
      cols: ['Conditions générales', 'Conditions particulières ou spéciales', 'Conditions individuelles'],
      rows: [
        "Le texte préformulé applicable à tous les contrats de la branche",
        "Les dispositions valables dans certains cas ou pour un groupe de clients",
        "Le formulaire établi pour un client déterminé",
      ],
      answer: [0, 1, 2],
      explain: "Trois niveaux, du plus général au plus particulier — et c'est dans cet ordre inverse qu'il faut les lire : la règle spéciale prime la règle générale, donc on commence par le plus précis."
    }),
    q({
      id: 'of3c02', chap: 'c3', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, couverture provisoire',
      ctx: "Un client signe une proposition d'assurance véhicule le lundi. L'assureur lui accorde une couverture provisoire le jour même, et n'acceptera formellement la proposition que le vendredi suivant.",
      q: "À partir de quand le véhicule est-il couvert ?",
      choices: [
        "Dès le lundi, l'assureur ayant accepté de couvrir le risque",
        "Dès le vendredi, date de l'acceptation formelle",
        "Dès l'établissement de la police d'assurance",
        "Dès le paiement de la première prime",
      ],
      answer: [0],
      explain: "La couverture provisoire comble précisément le vide entre la proposition et la décision : la protection commence avec l'acceptation de l'assureur de couvrir le risque, sans attendre la conclusion définitive."
    }),
    q({
      id: 'of3c03', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, réticence et ses effets',
      ctx: "Un preneur a tu, lors de la conclusion, un fait important sur lequel l'assureur l'avait interrogé. L'assureur le découvre et résilie dans le délai légal.",
      q: "Ces conséquences sont-elles exactes ou inexactes ?",
      cols: ['Exacte', 'Inexacte'],
      rows: [
        "Le contrat est annulé avec effet immédiat.",
        "Le preneur doit la prime jusqu'à la dissolution du contrat.",
        "Le preneur perd toute prétention, même pour un sinistre sans lien avec le fait tu.",
        "L'assureur disposait de quatre semaines dès la connaissance de la réticence.",
      ],
      answer: [0, 0, 1, 0],
      explain: "L'effet immédiat et le maintien de la prime jusqu'à la dissolution sont exacts, comme le délai de quatre semaines. Mais la perte de la prestation suppose un lien de causalité entre le fait tu et le sinistre : sans ce lien, la couverture reste due."
    }),
    q({
      id: 'of3c04', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, aggravation annoncée',
      ctx: "Un preneur annonce par écrit à son assureur une aggravation essentielle du risque survenue sans son fait. L'assureur ne réagit pas.",
      q: "Quelle est la situation à l'expiration du délai légal ?",
      choices: [
        "L'assurance continue de s'appliquer avec la modification du risque",
        "Le contrat est résilié de plein droit",
        "La couverture est suspendue jusqu'à décision de l'assureur",
        "Le preneur doit renouveler son annonce tous les quatorze jours",
      ],
      answer: [0],
      explain: "Le preneur a fait ce qu'il devait : il a annoncé. L'assureur disposait de quatorze jours pour se départir du contrat ; passé ce délai sans réaction, il est réputé accepter le risque tel qu'il est devenu."
    }),
    q({
      id: 'of3c05', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, cas de résolution par l\'assureur',
      q: "Dans quels cas l'assureur peut-il mettre fin au contrat avec effet immédiat ?",
      cols: ['Effet immédiat', 'Effet différé'],
      rows: [
        "Résolution pour violation fautive de l'obligation de déclarer le sinistre",
        "Résolution en cas de fraude à l'assurance",
        "Résiliation après un dommage partiel indemnisé",
        "Résiliation en cas de changement de main",
      ],
      answer: [0, 0, 1, 1],
      explain: "La faute de l'assuré justifie la rupture immédiate. En revanche le sinistre partiel laisse quatorze jours, et le changement de propriétaire au moins trente : dans ces deux cas, personne n'a mal agi, on laisse le temps de se réassurer."
    })
  );

  /* ═══════ Responsabilité : compléments ═══════ */
  m2.questions.push(
    q({
      id: 'of3d01', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, assurance RC professionnelle',
      q: "Que doit couvrir l'assurance responsabilité civile professionnelle exigée de l'intermédiaire ?",
      choices: [
        "La responsabilité née d'une violation du devoir de diligence professionnelle",
        "Les dommages que l'intermédiaire subit dans son propre patrimoine",
        "Les amendes prononcées par l'autorité de surveillance",
        "Le manque à gagner résultant de la perte d'un mandat",
      ],
      answer: [0],
      explain: "C'est une assurance de patrimoine tournée vers le client : elle répond des prétentions élevées contre l'intermédiaire pour un conseil fautif. Une amende, sanction personnelle, n'est jamais assurable."
    }),
    q({
      id: 'of3d02', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, prévention',
      q: "Ces mesures de prévention agissent-elles sur la compétence, sur la relation client ou sur l'organisation ?",
      cols: ['Compétence', 'Relation client', 'Organisation'],
      rows: [
        "Acquérir et maintenir ses compétences professionnelles",
        "Établir et entretenir des relations solides avec la clientèle",
        "Documenter les contacts et surveiller les processus",
        "Gérer correctement les erreurs et les omissions",
      ],
      answer: [0, 1, 2, 2],
      explain: "La prévention de la responsabilité ne se réduit pas à souscrire une RC professionnelle. Savoir, soigner la relation, et tracer ce qui a été dit : c'est la documentation qui sauve le jour où la parole de chacun s'oppose."
    }),
    q({
      id: 'of3d03', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, accord de collaboration',
      q: "Quel est l'objet de l'accord de collaboration passé entre un courtier et un assureur ?",
      choices: [
        "Régler la rémunération du courtier et la division du travail entre eux",
        "Obliger le courtier à défendre les intérêts de l'assureur",
        "Transférer à l'assureur la responsabilité des conseils du courtier",
        "Fixer les primes que le courtier pourra proposer à ses clients",
      ],
      answer: [0],
      explain: "C'est un contrat innommé, comme le contrat de courtage lui-même. Il organise la collaboration pour les affaires transmises — jamais un devoir d'agir dans l'intérêt de l'assureur, qui contredirait l'indépendance du courtier."
    })
  );
})();
