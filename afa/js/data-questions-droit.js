/* =============================================================
   AFA – Droit de l'assurance : lot dédié, gabarit officiel

   Renforce le module 2, en visant d'abord ses chapitres les plus
   maigres : le contrat selon le CO, la sous-assurance et la
   subrogation, les bases du droit suisse.

   Note de provenance : le support de cours transmis couvre la
   LCA, la LSA, la formation du contrat et la responsabilité des
   intermédiaires. Il ne traite ni le CO en détail, ni la
   sous-assurance et la subrogation — les questions de ces
   chapitres s'appuient donc sur les textes légaux (CO, CC, LCA)
   plutôt que sur le support.
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m2 = M.find(x => x.id === 'm2');
  if (!m2) return;
  const q = (o) => Object.assign({ lvl: 'off' }, o);
  const VF = ['Vrai', 'Faux'];

  m2.questions.push(

    /* ═══════ c2 — LE CONTRAT SELON LE CO ═══════ */
    q({
      id: 'dr201', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, conditions de validité',
      q: "Ces conditions sont-elles nécessaires à la validité de tout contrat ?",
      cols: ['Nécessaire', 'Non nécessaire'],
      rows: [
        "Un échange de manifestations de volonté réciproques et concordantes",
        "L'exercice des droits civils des deux parties",
        "Un objet licite, possible et déterminable",
        "La forme écrite du contrat",
      ],
      answer: [0, 0, 0, 1],
      explain: "Accord, capacité et objet licite suffisent. L'art. 11 CO pose la liberté de la forme : l'écrit n'est exigé que si la loi le prévoit ou si les parties se le sont imposé — auquel cas il devient condition de validité."
    }),
    q({
      id: 'dr202', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, vices du consentement',
      q: "De quel vice du consentement s'agit-il dans chacun de ces cas ?",
      cols: ['Erreur essentielle', 'Dol', 'Crainte fondée'],
      rows: [
        "Une partie se trompe sur l'identité de son cocontractant, déterminante pour elle",
        "Une partie est amenée à contracter par une tromperie intentionnelle de l'autre",
        "Une partie contracte sous l'empire d'une menace illicite",
      ],
      answer: [0, 1, 2],
      explain: "Trois vices, un même délai : un an pour invalider, dès la découverte de l'erreur ou du dol, dès la cessation de la crainte. Passé ce délai sans réaction, le contrat est réputé ratifié."
    }),
    q({
      id: 'dr203', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, offre et acceptation',
      ctx: "Un assureur adresse à un client une offre écrite valable jusqu'au 30 avril. Le 15 avril, il souhaite se rétracter parce qu'il juge le risque moins attrayant qu'il ne le croyait.",
      q: "Le peut-il ?",
      choices: [
        "Non : ayant fixé un délai, il reste lié jusqu'à son expiration",
        "Oui, tant que le client n'a pas encore accepté",
        "Oui, moyennant le versement d'une indemnité au client",
        "Non, l'offre étant devenue un contrat dès son envoi",
      ],
      answer: [0],
      explain: "Fixer un délai, c'est s'engager à le tenir : l'auteur de l'offre ne peut pas se dédire entre-temps. L'offre n'est pas encore un contrat pour autant — il faudra l'acceptation du client pour qu'il se forme."
    }),
    q({
      id: 'dr204', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, qualification du contrat d\'assurance',
      q: "Comment le contrat d'assurance se qualifie-t-il selon chacun de ces critères ?",
      cols: ['Synallagmatique', 'Onéreux', 'De durée'],
      rows: [
        "Chaque partie s'oblige envers l'autre",
        "Chaque partie fournit une contrepartie",
        "L'exécution se déploie de façon continue dans le temps",
      ],
      answer: [0, 1, 2],
      explain: "Il est en outre aléatoire : la prestation de l'assureur dépend d'un événement incertain. C'est parce qu'il est un contrat de durée qu'il se termine par résiliation pour l'avenir, et non par annulation rétroactive."
    }),
    q({
      id: 'dr205', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, clause insolite',
      ctx: "Les conditions générales d'une assurance ménage contiennent, au milieu d'un paragraphe sur les obligations administratives, une clause excluant tout dommage survenu la nuit en l'absence des occupants.",
      q: "Quel sort une telle clause connaît-elle ?",
      choices: [
        "Elle est écartée : le client ne pouvait pas s'y attendre et elle n'a pas été mise en évidence",
        "Elle est valable, le client ayant accepté l'ensemble des conditions générales",
        "Elle est valable si l'assureur prouve que le client a lu les conditions",
        "Elle est nulle et entraîne la nullité de tout le contrat",
      ],
      answer: [0],
      explain: "La règle de la clause insolite écarte ce qui est étranger à l'attente légitime du client et se trouve noyé dans le texte. La mettre en évidence — encadré, caractères gras — l'aurait sauvée ; seule la clause tombe, pas le contrat."
    }),
    q({
      id: 'dr206', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, CO, interprétation des conditions',
      q: "Comment interprète-t-on une clause de conditions générales dont le sens est douteux ?",
      choices: [
        "Contre celui qui l'a rédigée",
        "En faveur de celui qui l'a rédigée",
        "En recherchant un compromis entre les deux lectures",
        "En appliquant systématiquement la solution la moins coûteuse",
      ],
      answer: [0],
      explain: "In dubio contra stipulatorem : qui rédige supporte le risque de ses ambiguïtés. La règle profite au preneur, qui n'a pas participé à la rédaction et n'a pu qu'adhérer."
    }),
    q({
      id: 'dr207', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, demeure et intérêts',
      q: "La demeure du débiteur : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Elle suppose en principe une interpellation du créancier.",
        "Un terme convenu rend l'interpellation superflue.",
        "L'intérêt moratoire légal s'élève à 5 % l'an.",
        "L'intérêt moratoire exclut toute réparation d'un dommage supplémentaire.",
      ],
      answer: [0, 0, 0, 1],
      explain: "Art. 102 et 104 CO. L'intérêt moratoire est un minimum forfaitaire : le créancier qui prouve un dommage plus important peut en réclamer réparation en sus."
    }),
    q({
      id: 'dr208', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, représentation',
      ctx: "Un collaborateur a quitté une agence il y a trois mois, mais il détient encore une procuration que son ancien employeur n'a pas révoquée. Il conclut un contrat au nom de l'agence avec un client de bonne foi.",
      q: "Quelle est la situation de l'agence ?",
      choices: [
        "Elle est liée : elle a laissé subsister l'apparence de pouvoirs",
        "Elle n'est pas liée, les pouvoirs ayant pris fin avec le contrat de travail",
        "Elle n'est liée que si elle ratifie expressément l'acte",
        "Elle est liée pour moitié seulement, le tiers devant vérifier les pouvoirs",
      ],
      answer: [0],
      explain: "La protection du tiers de bonne foi l'emporte sur l'absence de pouvoirs réels. D'où la règle pratique : retirer les procurations le jour même du départ, et informer les partenaires quand c'est nécessaire."
    }),
    q({
      id: 'dr209', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, prescription',
      q: "Quel délai de prescription s'applique à chacune de ces créances ?",
      cols: ['3 ans', '5 ans', '10 ans'],
      rows: [
        "Prétention en dommages-intérêts pour acte illicite, dès la connaissance du dommage",
        "Créance découlant d'un contrat d'assurance",
        "Créance contractuelle ordinaire, à défaut de règle spéciale",
      ],
      answer: [0, 1, 2],
      explain: "Trois régimes à ne pas mélanger. La prescription de cinq ans de l'art. 46 LCA a remplacé l'ancien délai de deux ans lors de la révision entrée en vigueur en 2022 ; elle est semi-impérative."
    }),
    q({
      id: 'dr210', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, forme réservée',
      q: "Quelle portée a une clause du contrat exigeant que toute modification soit faite par écrit ?",
      choices: [
        "La forme écrite devient une condition de validité des modifications",
        "La clause est nulle, les parties ne pouvant pas s'imposer une forme",
        "La clause n'a qu'une valeur indicative en matière de preuve",
        "La clause ne lie que la partie qui l'a rédigée",
      ],
      answer: [0],
      explain: "Art. 16 CO : les parties peuvent réserver une forme que la loi n'exige pas, et elle est alors présumée condition de validité. En assurance, cela donne l'avenant écrit pour toute modification de la police."
    }),

    /* ═══════ c6 — SOUS-ASSURANCE, SURASSURANCE, SUBROGATION ═══════ */
    q({
      id: 'dr601', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, qualification du rapport somme/valeur',
      q: "Comment qualifier chacun de ces rapports entre somme assurée et valeur d'assurance ?",
      cols: ['Sous-assurance', 'Surassurance', 'Assurance à la valeur totale'],
      rows: [
        "Somme CHF 40 000 pour une valeur de CHF 80 000",
        "Somme CHF 120 000 pour une valeur de CHF 80 000",
        "Somme CHF 80 000 pour une valeur de CHF 80 000",
      ],
      answer: [0, 1, 2],
      explain: "Seule la sous-assurance a une conséquence défavorable pour l'assuré : la règle proportionnelle réduit l'indemnité. La surassurance ne rapporte rien — l'excédent de prime est payé pour rien, l'indemnité restant plafonnée au dommage réel."
    }),
    q({
      id: 'dr602', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, règle proportionnelle',
      ctx: "L'inventaire du ménage de Madame Perret vaut CHF 150 000.–. Sa police porte sur une somme d'assurance de CHF 100 000.–. Un cambriolage lui cause un dommage de CHF 30 000.–.",
      q: "Quelle indemnité l'assureur doit-il, sans franchise ?",
      choices: ["CHF 20 000.–", "CHF 30 000.–", "CHF 100 000.–", "CHF 10 000.–"],
      answer: [0],
      explain: "Le rapport est de 100 000 / 150 000, soit deux tiers : 30 000 × 2/3 = CHF 20 000.–. L'assurée supporte elle-même le tiers restant, en contrepartie de la prime réduite qu'elle a acquittée."
    }),
    q({
      id: 'dr603', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, surassurance',
      ctx: "Un assuré a fait porter sa police ménage sur CHF 200 000.– alors que son inventaire vaut CHF 120 000.–. Un incendie détruit l'ensemble.",
      q: "Quelle indemnité reçoit-il ?",
      choices: [
        "CHF 120 000.–, l'excédent de somme restant sans effet",
        "CHF 200 000.–, conformément à la somme convenue",
        "CHF 160 000.–, soit la moyenne des deux montants",
        "Rien : la surassurance annule la couverture",
      ],
      answer: [0],
      explain: "Le principe indemnitaire plafonne l'indemnité au dommage effectif : on ne s'enrichit pas par l'assurance. L'assuré a payé pendant des années une prime calculée sur 200 000 sans rien obtenir en plus — d'où l'intérêt de réviser la somme assurée."
    }),
    q({
      id: 'dr604', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, subrogation',
      q: "Ce que la subrogation transfère, et jusqu'où : vrai ou faux ?",
      cols: VF,
      rows: [
        "L'assureur qui indemnise reprend les droits de l'assuré contre le tiers responsable.",
        "Elle est limitée au montant de l'indemnité effectivement versée.",
        "Elle s'applique aussi bien en assurance de sommes qu'en assurance de dommages.",
        "L'assuré ne doit rien faire qui compromette le recours de son assureur.",
      ],
      answer: [0, 0, 1, 0],
      explain: "La subrogation empêche l'assuré de cumuler indemnité et dommages-intérêts : elle est donc propre à l'assurance de dommages. En assurance de sommes, le capital convenu se cumule librement avec toute autre prestation."
    }),
    q({
      id: 'dr605', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, quittance pour solde',
      ctx: "Un automobiliste endommage le mur d'un client. L'assureur de choses du client l'indemnise. Peu après, le client signe avec le responsable une quittance pour solde de tout compte contre un dédommagement symbolique.",
      q: "Quelle est la conséquence pour l'assureur ?",
      choices: [
        "L'assuré a compromis le recours et engage sa responsabilité envers son assureur",
        "L'assureur conserve intact son recours, la quittance ne lui étant pas opposable",
        "L'assureur doit récupérer son indemnité auprès du client uniquement",
        "La quittance est nulle de plein droit",
      ],
      answer: [0],
      explain: "L'assuré subrogé n'est plus titulaire de la créance : en transigeant, il dispose d'un droit qui ne lui appartient plus. L'assureur peut lui réclamer le préjudice que cette renonciation lui cause."
    }),
    q({
      id: 'dr606', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, double assurance',
      q: "Comment traite-t-on le cumul de couvertures selon le type d'assurance ?",
      cols: ["Chaque assureur paie l'intégralité", 'Les assureurs se répartissent le dommage'],
      rows: [
        "Deux assurances de sommes couvrant le même décès",
        "Deux assurances de choses couvrant le même inventaire",
      ],
      answer: [0, 1],
      explain: "En assurance de sommes, le besoin pécuniaire ne joue aucun rôle : les deux capitaux sont dus. En assurance de dommages, l'interdiction de l'enrichissement impose que le dommage ne soit indemnisé qu'une fois, les assureurs contribuant proportionnellement."
    }),
    q({
      id: 'dr607', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, valeur à neuf et valeur vénale',
      q: "Qu'est-ce qui distingue une indemnisation à la valeur à neuf d'une indemnisation à la valeur vénale ?",
      choices: [
        "La valeur à neuf ignore la vétusté, la valeur vénale en tient compte",
        "La valeur à neuf s'applique aux entreprises, la valeur vénale aux particuliers",
        "La valeur à neuf est imposée par la loi, la valeur vénale est contractuelle",
        "La valeur à neuf concerne les bâtiments, la valeur vénale les inventaires",
      ],
      answer: [0],
      explain: "Le principe indemnitaire commande la valeur vénale — ce que valait le bien juste avant le sinistre. La garantie valeur à neuf est une extension contractuelle, en général limitée aux premières années de vie du bien."
    }),
    q({
      id: 'dr608', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, effet de la sous-assurance sur un sinistre total',
      ctx: "Un entrepreneur assure son stock pour CHF 60 000.– alors qu'il vaut CHF 100 000.–. Un incendie détruit l'intégralité du stock.",
      q: "Quelle indemnité reçoit-il ?",
      choices: [
        "CHF 60 000.–, la somme d'assurance plafonnant la prestation",
        "CHF 100 000.–, le dommage étant total",
        "CHF 36 000.–, après application de la règle proportionnelle",
        "CHF 80 000.–, soit la moyenne des deux montants",
      ],
      answer: [0],
      explain: "En cas de sinistre total, la règle proportionnelle ne change rien : l'indemnité bute de toute façon sur la somme d'assurance. C'est sur les sinistres partiels que la sous-assurance se fait vraiment sentir."
    }),

    /* ═══════ c1 — BASES DU DROIT ═══════ */
    q({
      id: 'dr101', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CC, capacité',
      q: "Ces personnes peuvent-elles s'obliger valablement par leurs propres actes ?",
      cols: ['Oui', 'Non'],
      rows: [
        "Une personne majeure et capable de discernement",
        "Un enfant de dix ans",
        "Une personne majeure durablement privée de discernement",
        "Un mineur de seize ans capable de discernement, avec l'accord de son représentant",
      ],
      answer: [0, 1, 1, 0],
      explain: "L'exercice des droits civils suppose majorité et discernement. Le mineur capable de discernement conclut un contrat boiteux : il devient pleinement valable si le représentant légal le ratifie, et tombe s'il le refuse."
    }),
    q({
      id: 'dr102', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, sources, hiérarchie des normes',
      q: "Classez ces textes du plus général au plus spécial en matière de contrat d'assurance.",
      cols: ['Le plus général', 'Intermédiaire', 'Le plus spécial'],
      rows: [
        "Le code civil suisse",
        "Le code des obligations",
        "La loi sur le contrat d'assurance",
      ],
      answer: [0, 1, 2],
      explain: "La loi spéciale prime la loi générale : on applique la LCA d'abord, le CO pour ce qu'elle ne règle pas, et le CC pour les questions de fond du droit privé — capacité, bonne foi, exercice des droits."
    }),
    q({
      id: 'dr103', chap: 'c1', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, sources, norme semi-impérative',
      q: "Qu'est-ce qu'une norme semi-impérative de la LCA ?",
      choices: [
        "Une norme à laquelle on ne peut déroger qu'en faveur du preneur ou de l'ayant droit",
        "Une norme qui ne s'applique qu'à la moitié des branches d'assurance",
        "Une norme dont le juge peut écarter l'application selon les circonstances",
        "Une norme qui n'entre en vigueur qu'après un délai transitoire",
      ],
      answer: [0],
      explain: "La loi fixe un plancher de protection : le contrat peut faire mieux pour le client, jamais moins bien. Une clause plus défavorable est nulle, et la règle légale s'applique à sa place."
    }),
    q({
      id: 'dr104', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, sources, public et privé',
      q: "Ces rapports relèvent-ils du droit public ou du droit privé ?",
      cols: ['Droit public', 'Droit privé'],
      rows: [
        "La FINMA retire son agrément à une entreprise d'assurance",
        "Un preneur réclame une indemnité à son assureur ménage",
        "Une caisse de compensation rend une décision sur une rente AVS",
        "Un courtier facture ses honoraires à son client",
      ],
      answer: [0, 1, 0, 1],
      explain: "Le critère est le rapport réglé : subordination à l'État, ou égalité entre particuliers. C'est lui qui commande la voie de droit — recours administratif d'un côté, action civile de l'autre."
    }),

    /* ═══════ c5 — SINISTRE ET PRESTATIONS ═══════ */
    q({
      id: 'dr501', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, faute et prestation',
      ctx: "Quatre assurés déclarent un sinistre. Le premier a mis le feu volontairement ; le deuxième a laissé une bougie allumée en quittant son domicile pour la nuit ; le troisième a oublié de fermer une fenêtre au premier étage ; le quatrième, preneur d'assurance, a confié ses clés à un inconnu.",
      q: "Quelle prestation l'assureur doit-il dans chaque cas ?",
      cols: ['Aucune', 'Réduite', 'Pleine'],
      rows: [
        "L'incendie allumé volontairement",
        "La bougie laissée allumée toute la nuit",
        "La fenêtre du premier étage restée ouverte",
        "Les clés confiées à un inconnu par le preneur",
      ],
      answer: [0, 1, 2, 1],
      explain: "Art. 14 LCA. L'intention exclut la couverture ; la faute grave — du preneur comme de l'assuré — permet une réduction proportionnée ; la faute légère reste sans effet. Une fenêtre oubliée à l'étage relève de l'inattention ordinaire."
    }),
    q({
      id: 'dr502', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, frais de sauvetage',
      q: "Qui supporte les frais engagés par l'assuré pour limiter le dommage ?",
      choices: [
        "L'assureur, dès lors que les mesures étaient commandées par les circonstances",
        "L'assuré, ces frais étant la contrepartie de son obligation",
        "Les deux parties, par moitié",
        "L'assureur, mais seulement si le sinistre s'avère finalement couvert à 100 %",
      ],
      answer: [0],
      explain: "Il serait absurde d'imposer une obligation de sauvetage sans en financer l'exécution : l'assuré qui agit dans l'intérêt de l'assureur ne doit pas y être de sa poche. Ces frais s'ajoutent à l'indemnité."
    }),
    q({
      id: 'dr503', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, prétention frauduleuse',
      q: "La prétention frauduleuse : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Elle libère l'assureur de son obligation envers l'ayant droit.",
        "Elle permet à l'assureur de résoudre le contrat avec effet immédiat.",
        "Elle n'a d'effet que si le montant surévalué dépasse un seuil légal.",
        "La prime de la période restante doit être remboursée au preneur.",
      ],
      answer: [0, 0, 1, 0],
      explain: "Aucun seuil : c'est la tromperie qui compte, pas son ampleur. Gonfler la liste des objets volés suffit à tout perdre — mais l'assureur, cessant de porter le risque, restitue la prime de la période restante."
    }),
    q({
      id: 'dr504', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, expertise en cas de désaccord',
      q: "Que prévoient en général les conditions générales lorsque assureur et assuré ne s'entendent pas sur le montant du dommage ?",
      choices: [
        "Une procédure d'expertise, chaque partie désignant un expert",
        "L'application automatique du montant proposé par l'assureur",
        "La saisine obligatoire du Tribunal fédéral",
        "La suspension du contrat jusqu'à l'accord des parties",
      ],
      answer: [0],
      explain: "L'expertise porte sur le chiffrage, non sur le principe de la couverture : les experts constatent, ils ne tranchent pas le droit. Un désaccord sur la couverture elle-même reste une question juridique, pour l'ombudsman ou le juge."
    }),

    /* ═══════ c7 — RESPONSABILITÉ CIVILE ═══════ */
    q({
      id: 'dr701', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, conditions de la responsabilité',
      ctx: "Un cycliste renverse un piéton en grillant un feu rouge. Le piéton se blesse et son téléphone est détruit.",
      q: "Ces conditions de la responsabilité de l'art. 41 CO sont-elles réunies ?",
      cols: ['Réunie', 'Non réunie'],
      rows: [
        "Un dommage",
        "Un acte illicite",
        "Un lien de causalité adéquate",
        "Une plainte pénale déposée par la victime",
      ],
      answer: [0, 0, 0, 1],
      explain: "Dommage, illicéité, causalité et faute suffisent : ce sont les quatre conditions cumulatives. La procédure pénale est indépendante — on peut être civilement responsable sans qu'aucune plainte n'ait été déposée."
    }),
    q({
      id: 'dr702', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, types de responsabilité',
      q: "Sur quel fondement chacune de ces responsabilités repose-t-elle ?",
      cols: ['Faute prouvée', 'Faute présumée', 'Sans faute'],
      rows: [
        "Responsabilité générale de l'art. 41 CO",
        "Responsabilité du détenteur d'animal (art. 56 CO)",
        "Responsabilité du détenteur de véhicule automobile (LCR)",
      ],
      answer: [0, 1, 2],
      explain: "Trois degrés. Le détenteur d'animal peut se libérer en prouvant qu'il a pris tous les soins commandés — c'est une faute présumée. Le détenteur de véhicule répond du seul fait de sa position : responsabilité causale aggravée."
    }),
    q({
      id: 'dr703', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, réduction pour faute concomitante',
      ctx: "Un client glisse sur le sol mouillé d'une agence dépourvue de signalisation. Le dommage s'élève à CHF 8 000.–. Le juge retient une faute concomitante de 25 % : la victime courait dans le couloir.",
      q: "Quel montant l'exploitant doit-il réparer ?",
      choices: ["CHF 6 000.–", "CHF 8 000.–", "CHF 2 000.–", "Rien, la faute de la victime étant décisive"],
      answer: [0],
      explain: "8 000 × 75 % = CHF 6 000.–. La faute concomitante réduit sans supprimer, sauf lorsqu'elle est si lourde qu'elle rompt le lien de causalité adéquate — ce qui n'est pas le cas d'une simple imprudence."
    }),
    q({
      id: 'dr704', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, responsabilité de l\'employeur',
      q: "À quelle condition l'employeur peut-il se libérer de sa responsabilité pour le dommage causé par son travailleur (art. 55 CO) ?",
      choices: [
        "En prouvant qu'il a pris tous les soins commandés par les circonstances pour éviter le dommage",
        "En établissant que le travailleur a agi contre ses instructions",
        "En démontrant que le travailleur est solvable",
        "Il ne peut jamais s'en libérer",
      ],
      answer: [0],
      explain: "C'est une responsabilité causale simple, avec preuve libératoire : choix, instruction et surveillance du personnel. À distinguer de l'art. 101 CO, qui rend le débiteur contractuel responsable de son auxiliaire sans échappatoire."
    })
  );
})();
