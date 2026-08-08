/* Série zéro officielle de l'AFA/VBV (« Nullserie GFK »)
 *
 * Les 27 questions publiées par l'AFA comme exemples de l'épreuve écrite, avec
 * leur intitulé, leurs propositions et leur barème d'origine. Les commentaires
 * (champ `explain`) sont, eux, rédigés pour ce site.
 *
 * Ces questions donnent aussi le gabarit suivi par le reste de la banque :
 *   theme : « <module>, <sujet>, <sous-sujet> » repris de l'en-tête officiel
 *   pts   : 1 (complexité simple) ou 2 (complexité moyenne)
 *   cx    : libellé de complexité
 *   type  : 'single' | 'multi' | 'grid' (tableau d'attribution)
 */
(function () {
  const M = window.AFA_MODULES;
  const m1 = M.find(m => m.id === 'm1');
  const m2 = M.find(m => m.id === 'm2');

  const SRC = { t: 'AFA/VBV — série zéro « Nullserie GFK », questions d\'exemple de l\'examen', u: 'https://www.vbv.ch/fr/' };
  const off = (q) => Object.assign({ lvl: 'off', src: SRC }, q);

  /* ————————————————————— Module 1 — Industrie de l'assurance ————————————————————— */

  m1.questions.push(
    off({
      id: 'ns298', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, prime, principe de base',
      q: "Quel est le principe de base de la prime ?",
      choices: [
        "Les recettes de primes doivent être suffisantes pour couvrir les frais de sinistre, les frais administratifs et les bénéfices éventuels de l'assureur.",
        "Le revenu des primes doit être suffisant pour couvrir les frais administratifs de la compagnie d'assurance.",
        "Le revenu des primes doit être suffisant pour couvrir les frais de recouvrement et de risque de l'assuré."
      ],
      answer: [0],
      explain: "La prime doit financer les trois composantes du coût : la charge de sinistres (prime de risque), les frais d'exploitation (chargement) et la marge de l'assureur. Les deux autres propositions ne retiennent qu'une partie de l'équation."
    }),
    off({
      id: 'ns308', chap: 'c1', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, gestion des risques, définition',
      q: "La gestion des risques consiste principalement à…",
      choices: [
        "… gérer systématiquement les risques.",
        "… conclure le contrat le plus rapidement possible.",
        "… combler les lacunes d'assurance.",
        "… éviter tous les risques."
      ],
      answer: [0],
      explain: "Le risk management est un processus systématique : identifier, analyser, évaluer, traiter puis surveiller les risques. Éviter tous les risques est impossible, et l'assurance n'est qu'un des instruments de traitement."
    }),
    off({
      id: 'ns315', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, gestion des risques, mesures de sécurité',
      q: "Dans le cadre du processus de gestion des risques, il existe différentes façons de gérer les risques. Attribuez les décisions correctement.",
      cols: ['Éviter les risques', 'Réduire les risques', 'Transférer les risques'],
      rows: [
        "La direction considère que l'expansion à l'étranger est trop risquée et renonce donc à construire une usine de production en Pologne.",
        "Le propriétaire assure sa maison contre les incendies.",
        "Un bijoutier décide de réduire la marchandise exposée en vitrine. Désormais, il n'y aura plus que des bijoux d'une valeur maximale de CHF 20 000 dans la vitrine du magasin (jusqu'à présent, des bijoux jusqu'à CHF 100 000 étaient exposés)."
      ],
      answer: [0, 2, 1],
      explain: "Renoncer à l'activité elle-même = éviter le risque. Conclure une assurance = transférer le risque à un tiers. Diminuer la valeur exposée sans supprimer l'activité = réduire le risque (l'exposition baisse, le risque subsiste)."
    }),
    off({
      id: 'ns292', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, prime, types de primes',
      q: "Il existe différents types de primes. Attribuez le type de prime correct.",
      cols: ['Prime de risque', 'Prime contractuelle'],
      rows: [
        "Prime que les actuaires déterminent sur la base de statistiques et de calculs de probabilité.",
        "Si vous ajoutez les « particularités du client » à la prime brute, vous obtenez la …"
      ],
      answer: [0, 1],
      explain: "La prime de risque est le coût statistique pur du risque. En y ajoutant les frais et la marge on obtient la prime brute (prime tarifaire) ; en tenant compte des particularités du client — rabais, surprimes, franchise choisie — on arrive à la prime contractuelle effectivement facturée."
    }),
    off({
      id: 'ns288', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, systèmes de financement, distinction',
      q: "À quel système de financement les affirmations suivantes correspondent-elles le mieux ?",
      cols: ['Système de répartition', 'Système de la couverture des besoins', 'Système de capitalisation'],
      rows: [
        "Force : convient aux risques relativement constants et faciles à estimer",
        "Force : le droit au capital épargné est garanti",
        "Faiblesse : sensible à la hausse du taux de la rente de vieillesse"
      ],
      answer: [1, 2, 0],
      explain: "Couverture des besoins : les primes de l'année couvrent les dépenses de l'année — cela suppose des charges régulières et prévisibles. Capitalisation : chacun épargne son propre capital, qui lui reste acquis. Répartition : les actifs financent les rentiers, donc l'équilibre se dégrade dès que le rapport rentiers/actifs se détériore."
    }),
    off({
      id: 'ns277', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, personne-chose-patrimoine',
      q: "Les assurances peuvent être classées selon différents critères. Décidez s'il s'agit d'une assurance de choses, d'une assurance de personnes ou d'une assurance de patrimoine dans les cas suivants.",
      cols: ['Assurance de choses', 'Assurance de personnes', 'Assurance de patrimoine'],
      rows: [
        "Assurance inventaire du ménage",
        "Assurance incendie",
        "Assurance responsabilité civile",
        "Assurance perte d'exploitation",
        "Assurance-maladie",
        "Assurance invalidité"
      ],
      answer: [0, 0, 2, 2, 1, 1],
      explain: "Le critère est l'objet assuré. Un bien matériel → assurance de choses. Une atteinte à la fortune sans destruction d'un bien (dette de responsabilité, manque à gagner) → assurance de patrimoine. La personne elle-même, sa santé, sa capacité de gain ou sa vie → assurance de personnes."
    }),
    off({
      id: 'ns281', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, classification, dommage-somme',
      q: "Les assurances peuvent être classées selon différents critères. Quel critère permet de distinguer les « assurances dommages » et les « assurances de sommes » ?",
      choices: ["Prestation d'assurance", "Objet de l'assurance", "Obligation d'assurance", "Organisme d'assurance"],
      answer: [0],
      explain: "C'est le mode de calcul de la prestation qui sépare les deux : l'assurance de dommages indemnise le préjudice effectivement subi (principe indemnitaire), l'assurance de sommes verse le montant convenu d'avance, indépendamment du dommage réel."
    }),
    off({
      id: 'ns324', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, couverture d'assurance, cas de sinistre",
      q: "L'assurance couvre le besoin pécuniaire de l'assuré. Toutefois, la personne assurée ne doit pas retirer d'avantages financiers en cas de sinistre. Quel principe est décrit ici ?",
      choices: ["Enrichissement illégitime", "Obligation de collaborer", "Obligation de sauvetage", "Obligation de réduire le dommage"],
      answer: [0],
      explain: "C'est l'interdiction de l'enrichissement illégitime, corollaire du principe indemnitaire : l'indemnité replace l'assuré dans sa situation patrimoniale d'avant le sinistre, sans l'améliorer. Les trois autres réponses sont des obligations de l'assuré au moment du sinistre, pas un principe de calcul."
    }),
    off({
      id: 'ns329', chap: 'c10', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, processus de création de valeur, distinction',
      q: "La chaîne de valeur d'un assureur peut être divisée en processus de management, commerciaux et de soutien. Quelles activités appartiennent à quel processus ?",
      cols: ['Processus de management', 'Processus commercial', 'Processus de soutien'],
      rows: [
        "Gestion des produits",
        "Administration des contrats et service",
        "Informatique",
        "Souscription",
        "Planification et contrôle",
        "Gestion du personnel"
      ],
      answer: [1, 1, 2, 1, 0, 2],
      explain: "Les processus commerciaux sont ceux du métier d'assureur lui-même — concevoir les produits, souscrire, gérer les contrats et les sinistres. Les processus de management pilotent l'entreprise (stratégie, planification, contrôle). Les processus de soutien fournissent les moyens : informatique, RH, finances, logistique."
    })
  );

  /* ————————————————————— Module 2 — Droit de l'assurance ————————————————————— */

  m2.questions.push(
    off({
      id: 'ns13', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LSA, but',
      q: "Que règle la LSA ?",
      choices: [
        "La surveillance des entreprises d'assurance et des intermédiaires d'assurance",
        "La relation contractuelle entre les compagnies d'assurance et les assurés",
        "Les droits des salariés dans le secteur de l'assurance"
      ],
      answer: [0],
      explain: "La LSA est une loi de droit public : elle organise la surveillance exercée par la FINMA sur les entreprises et les intermédiaires. C'est la LCA, loi de droit privé, qui régit la relation contractuelle assureur–preneur."
    }),
    off({
      id: 'ns20', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA 45',
      q: "De quoi devez-vous informer les clients dans le cadre de l'art. 45 de la LSA ?",
      choices: [
        "Comment les clients peuvent s'informer sur votre formation initiale et votre formation continue.",
        "Votre nom et votre adresse",
        "Si l'intermédiation en assurance est liée ou non liée.",
        "Pour quelles compagnies d'assurance vous avez travaillé jusqu'à présent."
      ],
      answer: [0, 1, 2],
      explain: "L'art. 45 LSA impose au premier contact l'identité et l'adresse de l'intermédiaire, son statut (lié ou non lié), les liens contractuels avec les assureurs, le traitement des données, la responsabilité en cas de négligence et l'accès aux informations sur sa formation. Le parcours professionnel antérieur n'en fait pas partie."
    }),
    off({
      id: 'ns21', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA 45, contenu',
      q: "Quelles informations dois-tu donner à la clientèle dans le cadre de l'art. 45 LSA ?",
      choices: [
        "À propos du traitement des données personnelles",
        "À propos de la conservation des données personnelles",
        "De la personne qui peut être tenue responsable de négligence ou d'erreurs",
        "À propos des horaires d'ouverture de l'agence / filiale"
      ],
      answer: [0, 1, 2],
      explain: "Le traitement et la conservation des données, ainsi que la responsabilité en cas de faute de l'intermédiaire, figurent expressément dans la liste de l'art. 45 LSA. Les horaires d'ouverture relèvent du service commercial, pas du devoir légal d'information."
    }),
    off({
      id: 'ns15', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LSA, premier contact',
      q: "Quelle information dois-tu obligatoirement fournir à un client potentiel lors du premier contact ?",
      choices: [
        "Indiquer toutes les relations contractuelles existantes avec des compagnies d'assurance",
        "Donner des détails sur votre convention de courtier",
        "Indiquer la forme juridique de votre compagnie d'assurance",
        "Mentionner le for juridique en cas de litige"
      ],
      answer: [0],
      explain: "L'art. 45 LSA exige la transparence sur les liens contractuels avec les assureurs, parce qu'ils conditionnent l'indépendance du conseil. Le contenu de la convention de courtage, la forme juridique et le for ne sont pas des informations obligatoires du premier contact."
    }),
    off({
      id: 'ns210', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: "Droit, LSA, obligation d'information",
      q: "Un conseiller d'assurance conclut une assurance auprès d'un nouveau client. Il oublie d'informer le client au sujet de l'article 45 LSA et n'a pas non plus remis ce formulaire. Qu'est-ce qui s'applique à la validité du contrat ?",
      choices: [
        "L'assurance est conclue lorsque la compagnie d'assurance accepte le contrat.",
        "Le contrat n'est pas conclu en raison de la violation de l'obligation d'informer.",
        "Si les CGA ont été remises, le devoir d'information selon l'art. 45 LSA est rempli."
      ],
      answer: [0],
      explain: "L'obligation d'information de la LSA relève de la surveillance : sa violation expose l'intermédiaire à des mesures de la FINMA, mais elle n'affecte pas la validité du contrat, qui reste régie par la LCA. Et les CGA ne remplacent pas l'information sur l'intermédiaire lui-même."
    }),
    off({
      id: 'ns11', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, LSA, intermédiaires d'assurance",
      q: "Quelles affirmations s'appliquent aux intermédiaires d'assurance ?",
      choices: [
        "Les intermédiaires d'assurance non liés doivent fournir des garanties financières.",
        "Les intermédiaires d'assurance non liés ne doivent pas avoir de casier judiciaire ni d'antécédents en matière de poursuites.",
        "Les intermédiaires d'assurance non liés doivent disposer d'une assurance responsabilité civile professionnelle.",
        "Tous les intermédiaires d'assurance doivent être inscrits dans un registre.",
        "Tous les intermédiaires d'assurance doivent passer un examen professionnel fédéral.",
        "Les intermédiaires d'assurance liés doivent avoir une assurance responsabilité civile privée."
      ],
      answer: [0, 1, 2, 3],
      explain: "Les conditions d'enregistrement (garanties financières ou RC professionnelle, honorabilité, qualifications) visent les intermédiaires non liés ; depuis la révision de la LSA, tous les intermédiaires doivent figurer dans un registre — celui de la FINMA pour les non liés, celui tenu par l'assureur pour les liés. En revanche la qualification peut s'acquérir autrement que par un examen professionnel fédéral, et une RC privée n'a rien à voir avec l'activité professionnelle."
    }),
    off({
      id: 'ns3', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, protection des données, principes de base',
      q: "Quels sont les principes de base de la protection des données ?",
      choices: ["Exactitude", "Obligation de respecter le but indiqué", "Sécurité des données", "Droit d'accès", "Proportionnalité", "Solidarité"],
      answer: [0, 1, 2, 3, 4],
      explain: "La LPD repose sur la licéité, la bonne foi, la proportionnalité, la finalité (le but annoncé lie le responsable), l'exactitude et la sécurité des données, complétées par le droit d'accès de la personne concernée. La solidarité est un principe des assurances sociales, pas de la protection des données."
    }),
    off({
      id: 'ns10', chap: 'c9', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, litige, organe de conciliation',
      q: "En cas de litige entre un preneur d'assurance et son assureur, le client peut s'adresser à un organe de conciliation afin qu'une solution puisse être trouvée. Comment s'appelle cet organe ?",
      choices: [
        "L'ombudsman de l'assurance privée et de la SUVA",
        "Organe de conciliation Autorité fédérale de surveillance des marchés financiers (FINMA)",
        "Tribunal fédéral des assurances",
        "Fédération romande des consommateurs (FRC)"
      ],
      answer: [0],
      explain: "L'ombudsman de l'assurance privée et de la SUVA est l'organe de médiation gratuit et neutre du secteur. La FINMA surveille les entreprises mais ne tranche pas les litiges individuels, et la FRC est une association de consommateurs sans rôle de conciliation en assurance."
    }),
    off({
      id: 'ns92', chap: 'c3', type: 'multi', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, contractants',
      q: "Selon la loi sur le contrat d'assurance (LCA) qui est contractant ?",
      choices: ["L'entreprise d'assurance", "Le preneur d'assurance", "L'intermédiaire", "La personne assurée"],
      answer: [0, 1],
      explain: "Le contrat d'assurance lie deux parties : l'entreprise d'assurance et le preneur. L'intermédiaire ne fait que le préparer, et la personne assurée n'est partie que lorsqu'elle se confond avec le preneur — sinon elle est simplement bénéficiaire de la couverture."
    }),
    off({
      id: 'ns37', chap: 'c3', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, conclusion',
      q: "Il y a plusieurs éléments à considérer en relation avec la proposition et son acceptation par l'entreprise d'assurance.",
      choices: [
        "L'entreprise d'assurance doit informer explicitement le proposant de l'acceptation de sa proposition. L'envoi de la police d'assurance ne suffit pas.",
        "Lorsqu'un proposant signe une proposition, il doit être en possession des conditions générales d'assurance.",
        "L'entreprise d'assurance est libre d'accepter ou de refuser une proposition signée.",
        "Le proposant bénéficie de la couverture d'assurance demandée, même si la compagnie d'assurance n'a pas encore accepté la proposition."
      ],
      answer: [1, 2],
      explain: "L'information précontractuelle de l'art. 3 LCA — CGA comprises — doit être remise avant la signature de la proposition, et l'assureur reste libre de refuser un risque. En revanche l'envoi de la police vaut acceptation, et tant que celle-ci n'est pas intervenue il n'y a pas de couverture, sauf note de couverture provisoire expresse."
    }),
    off({
      id: 'ns95', chap: 'c3', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, droit de révocation',
      q: "Existe-t-il une exigence de forme pour la déclaration de révocation ?",
      choices: [
        "Oui, elle doit être faite sous forme de texte.",
        "Oui, elle doit comporter une signature manuscrite.",
        "Non, il n'existe pas d'exigence de forme."
      ],
      answer: [0],
      explain: "L'art. 2a LCA permet de révoquer dans les 14 jours ; la déclaration doit être faite par écrit ou par tout autre moyen permettant d'en établir la preuve par un texte — un courriel suffit donc, mais un appel téléphonique non."
    }),
    off({
      id: 'ns33', chap: 'c3', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, champ d'application",
      q: "À quelles assurances, dans la liste ci-après, s'appliquent les dispositions de la LCA ?",
      choices: [
        "Assurance responsabilité civile d'entreprise",
        "Assurance véhicules à moteur",
        "Assurance de protection juridique",
        "Assurance vie",
        "Prévoyance professionnelle",
        "Assurance-maladie obligatoire",
        "Assurance vieillesse et survivants",
        "Assurance militaire"
      ],
      answer: [0, 1, 2, 3],
      explain: "La LCA régit les contrats d'assurance privée. Les quatre dernières relèvent des assurances sociales, gouvernées par leurs propres lois (LPP, LAMal, LAVS, LAM) et par la LPGA — la LCA ne s'y applique pas."
    }),
    off({
      id: 'ns42', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, réticence',
      ctx: "La société Optique SA a déjà subi deux effractions. L'assureur de l'époque a ensuite résilié la police d'entreprise combinée. Connaissant le problème, la société Optique SA a demandé une couverture d'assurance auprès d'une autre compagnie. Cependant, elle n'a pas mentionné les deux effractions. Comme un malheur n'arrive jamais seul, il y a d'abord eu un dégât d'eau et juste après une nouvelle effraction. Lors de l'effraction, les deux sinistres antérieurs ont été mis au jour.",
      q: "Réticence d'Optique SA : ces affirmations sont-elles vraies ou fausses ?",
      cols: ['Vrai', 'Faux'],
      rows: [
        "La compagnie peut résilier la police dans les deux semaines après avoir eu connaissance de la réticence.",
        "La compagnie peut résilier la police dans les quatre semaines après avoir eu connaissance de la réticence.",
        "L'assureur conserve la prime déjà payée pour la période d'assurance en cours.",
        "Le nouvel assureur peut demander le remboursement de l'indemnité déjà versée pour le dégât d'eau."
      ],
      answer: [1, 0, 1, 1],
      explain: "Art. 6 LCA : le délai de résiliation pour réticence est de quatre semaines dès la connaissance de la réticence — donc « deux semaines » est faux. La résiliation met fin au contrat pour l'avenir : la prime de la période en cours n'est pas acquise à l'assureur au-delà de la fin du contrat, et l'assureur ne peut réclamer les prestations déjà versées que pour les sinistres en lien de causalité avec le fait tu. Le dégât d'eau n'a aucun rapport avec des effractions antérieures : l'indemnité reste acquise."
    }),
    off({
      id: 'ns63', chap: 'c4', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, possibilités de résiliation',
      q: "Parmi les cas cités ci-après, dans quelles situations un contrat d'assurance peut-il être résilié ?",
      choices: [
        "Échéance de la police",
        "L'assureur modifie la prime pendant la durée du contrat",
        "L'assureur fournit des prestations découlant d'un sinistre partiel",
        "Refus d'un cas de sinistre"
      ],
      answer: [0, 1, 2],
      explain: "L'échéance ordinaire, l'adaptation de la prime en cours de contrat (art. 35 LCA) et le versement d'une prestation après sinistre partiel (art. 42 LCA) ouvrent un droit de résiliation. Le simple refus d'un sinistre, lui, ne fait naître aucun droit de résiliation extraordinaire : c'est un litige sur la couverture, à porter devant l'ombudsman ou le juge."
    }),
    off({
      id: 'ns70', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, prime',
      q: "Si une prime reste impayée, l'obligation de prestation de la compagnie d'assurance est interrompue par une sommation légale. Dans quel délai le paiement doit-il être effectué pour éviter la suspension de couverture ?",
      choices: [
        "14 jours à partir de l'envoi de la sommation",
        "14 jours après la réception de la sommation",
        "30 jours à partir de l'envoi de la sommation",
        "30 jours après la réception de la sommation"
      ],
      answer: [0],
      explain: "Art. 20 LCA : la sommation fixe un délai de 14 jours qui court dès son envoi, et non dès sa réception. Passé ce délai sans paiement, la couverture est suspendue jusqu'au règlement intégral."
    }),
    off({
      id: 'ns77', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: "Droit, LCA, clause contractuelle d'adaptation des primes",
      q: "L'assureur informe Pierre Bailly que la prime de son assurance automobile sera augmentée au début de l'année prochaine (clause contractuelle d'adaptation des primes). Que se passe-t-il avec le contrat d'assurance ?",
      choices: [
        "Le contrat prend fin automatiquement.",
        "Le preneur d'assurance peut résilier le contrat.",
        "L'assureur peut résilier le contrat."
      ],
      answer: [1],
      explain: "Art. 35 LCA : lorsque l'assureur use d'une clause d'adaptation, le preneur peut résilier le contrat pour la date à laquelle la modification devait entrer en vigueur. Le contrat ne s'éteint pas de lui-même, et l'assureur ne gagne aucun droit de résiliation de ce fait."
    }),
    off({
      id: 'ns91', chap: 'c4', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, contrat d'assurance",
      q: "Dans quels cas le contrat d'assurance prend-il fin ?",
      choices: [
        "Une voiture de tourisme est entièrement détruite. L'assureur verse l'indemnité convenue pour ce cas.",
        "Le preneur d'assurance décède. L'assurance vie verse le capital-décès assuré.",
        "L'assureur résilie le contrat pour cause de réticence.",
        "Un incendie dans une pièce détruit certains éléments de l'inventaire du ménage de l'appartement de 4 pièces et demi."
      ],
      answer: [0, 1, 2],
      explain: "Le contrat s'éteint quand la prestation due est intégralement fournie (sinistre total, capital-décès versé) ou quand une résiliation extraordinaire y met fin, comme celle pour réticence. Un sinistre partiel, lui, laisse le contrat en vigueur : il ouvre seulement un droit de résiliation aux deux parties (art. 42 LCA)."
    }),
    off({
      id: 'ns35', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, prestations',
      q: "Quelle est l'étendue des prestations fournies par l'assureur ?",
      cols: ['Pas de prestation', 'Prestation réduite', 'Prestation complète'],
      rows: [
        "En cas de sinistre causé intentionnellement",
        "En cas de sinistre causé par une faute grave de la personne assurée",
        "En cas de sinistre causé par une faute légère",
        "En cas de sinistre causé par une faute grave du preneur d'assurance"
      ],
      answer: [0, 1, 2, 1],
      explain: "Art. 14 LCA : le sinistre provoqué intentionnellement n'est pas couvert ; la faute grave, du preneur comme de l'assuré, autorise une réduction de la prestation proportionnelle à la gravité de la faute ; la faute légère reste sans effet et la prestation est due en entier."
    })
  );
})();
