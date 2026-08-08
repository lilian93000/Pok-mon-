/* =============================================================
   AFA – Mises en situation : Lancement & Base
   (module 1 « Industrie de l'assurance », module 2 « Droit »)

   Format de la plateforme : chaque question porte son propre
   énoncé (`ctx`), soit une situation à classer dans une
   catégorie, soit un « dans lesquelles de ces situations… »
   dont chaque choix est lui-même un scénario.
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list.map(q => ({ ...q, lvl: 'cas' })));
  };

  /* Jeux de catégories réutilisés */
  const PILIERS = ["A : 1er pilier", "B : 2e pilier", "C : 3e pilier"];
  const TRAITE = ["A : éviter le risque", "B : réduire le risque", "C : transférer le risque", "D : assumer le risque"];
  const NATURE = ["A : assurance de dommages", "B : assurance de sommes"];
  const STATUT = ["A : intermédiaire lié", "B : intermédiaire non lié", "C : ni l'un ni l'autre"];
  const FAUTE  = ["A : aucune réduction possible", "B : réduction possible (faute grave)", "C : aucune prestation (dessein)"];
  const RESP   = ["A : responsabilité pour faute (art. 41 CO)", "B : causale simple, avec preuve libératoire", "C : causale aggravée, sans preuve libératoire"];
  const DROIT  = ["A : droit privé", "B : droit public"];

  /* ================= MODULE 1 — Industrie ================= */
  add('m1', [
    /* --- Risque et traitement --- */
    { id: 'm1g01', chap: 'c1', type: 'single',
      ctx: "Une entreprise de logistique renonce définitivement à transporter des matières inflammables, activité qu'elle jugeait trop dangereuse.",
      q: "De quelle stratégie de traitement du risque s'agit-il ?", choices: TRAITE, answer: [0],
      explain: "Abandonner l'activité supprime le risque à sa source : c'est l'évitement, la stratégie la plus radicale et souvent la moins réaliste économiquement." },

    { id: 'm1g02', chap: 'c1', type: 'single',
      ctx: "La même entreprise installe un système d'extinction automatique et forme son personnel à la manipulation des produits dangereux.",
      q: "De quelle stratégie s'agit-il ?", choices: TRAITE, answer: [1],
      explain: "Les mesures techniques et organisationnelles diminuent la probabilité ou l'ampleur du sinistre : c'est la réduction, souvent récompensée par un rabais de prime." },

    { id: 'm1g03', chap: 'c1', type: 'single',
      ctx: "Elle souscrit ensuite une assurance incendie et une RC d'entreprise auprès d'un assureur privé.",
      q: "De quelle stratégie s'agit-il ?", choices: TRAITE, answer: [2],
      explain: "L'assurance déplace les conséquences financières du risque vers un tiers contre une prime. Le risque lui-même subsiste." },

    { id: 'm1g04', chap: 'c1', type: 'single',
      ctx: "Enfin, elle choisit une franchise élevée de CHF 20 000.– par sinistre et constitue une provision comptable pour les petits dommages.",
      q: "De quelle stratégie s'agit-il ?", choices: TRAITE, answer: [3],
      explain: "Elle garde consciemment une part du risque à sa charge et la finance sur ses propres moyens : c'est l'acceptation, ou auto-assurance." },

    { id: 'm1g05', chap: 'c1', type: 'multi',
      ctx: "Un client vous soumet plusieurs risques et vous demande lesquels une compagnie privée peut assurer.",
      q: "Dans lesquelles de ces situations le risque est-il assurable ?",
      choices: [
        "Un commerçant veut couvrir le vol par effraction de son stock.",
        "Un investisseur veut couvrir la perte de valeur de son portefeuille d'actions.",
        "Un restaurateur veut assurer l'amende qu'il devra payer en cas d'infraction sanitaire.",
        "Un propriétaire veut couvrir les dégâts d'eau de son immeuble."
      ],
      answer: [0, 3],
      explain: "Le portefeuille boursier est un risque spéculatif, qui peut aussi produire un gain. L'amende est une sanction personnelle : l'assurer viderait la peine de son sens. Vol et dégâts d'eau sont des risques purs classiques." },

    { id: 'm1g06', chap: 'c1', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "IA, risque, cumul",
      ctx: "Un agriculteur du Valais assure ses cultures contre la grêle. Une seule averse peut ruiner simultanément toutes les parcelles de la région.",
      q: "Quelle caractéristique du risque cette situation illustre-t-elle ?",
      choices: [
        "Un risque de masse, sans particularité notable",
        "Un risque de cumul, qui met en échec la compensation dans l'espace",
        "Un risque spéculatif, échappant à l'assurance",
        "Un risque subjectif, lié au comportement des assurés",
      ],
      answer: [1],
      explain: "Un même événement frappe d'un coup une multitude de contrats voisins : la répartition géographique, qui devait diluer les sinistres, ne joue plus. C'est la définition du risque de cumul, et la raison d'être de la réassurance catastrophe." },

    /* --- Prime et technique --- */
    { id: 'm1g07', chap: 'c2', type: 'single',
      ctx: "Un assureur calcule le tarif d'une nouvelle couverture. La fréquence attendue est de 2 % et le coût moyen d'un sinistre de CHF 5 000.–.",
      q: "À combien s'élève la prime de risque par contrat ?",
      choices: ["CHF 50.–", "CHF 100.–", "CHF 250.–", "CHF 1 000.–"],
      answer: [1],
      explain: "Prime de risque = fréquence × coût moyen = 2 % × 5 000 = CHF 100.–. Viennent ensuite s'ajouter sécurité, frais, marge, puis les taxes." },

    { id: 'm1g08', chap: 'c2', type: 'single',
      ctx: "Sur cette base, l'assureur ajoute CHF 10.– de supplément de sécurité, CHF 30.– de frais et CHF 10.– de marge. Il s'agit d'une assurance de choses.",
      q: "Quelle est la prime encaissée facturée au client ?",
      choices: ["CHF 150.–", "CHF 157.50", "CHF 152.50", "CHF 165.–"],
      answer: [1],
      explain: "Prime commerciale : 100 + 10 + 30 + 10 = CHF 150.–. Droit de timbre de 5 % sur une assurance de choses : 150 × 1,05 = CHF 157.50." },

    { id: 'm1g09', chap: 'c2', type: 'multi',
      ctx: "Vous devez indiquer à un client quelles primes supportent le droit de timbre.",
      q: "Dans lesquelles de ces situations un droit de timbre est-il perçu ?",
      choices: [
        "Une assurance ménage souscrite par un particulier.",
        "Une assurance-vie à primes périodiques susceptible de rachat.",
        "Une assurance responsabilité civile automobile.",
        "Une assurance-maladie complémentaire."
      ],
      answer: [0, 2],
      explain: "Les assurances de choses et de patrimoine sont taxées à 5 %. L'assurance-vie à primes périodiques et l'assurance-maladie sont exonérées." },

    { id: 'm1g10', chap: 'c2', type: 'single',
      ctx: "Une branche encaisse CHF 5 millions de primes, verse CHF 3,6 millions de sinistres et supporte CHF 1,2 million de frais.",
      q: "Quel est son combined ratio, et qu'en conclure ?",
      choices: ["72 %, activité bénéficiaire", "96 %, activité techniquement bénéficiaire", "104 %, activité déficitaire", "120 %, activité déficitaire"],
      answer: [1],
      explain: "(3,6 + 1,2) / 5 = 96 %. En dessous de 100 %, l'activité d'assurance proprement dite dégage un bénéfice, indépendamment des placements." },

    { id: 'm1g11', chap: 'c2', type: 'single',
      ctx: "Un assureur baisse fortement son tarif auto sans modifier ses critères de sélection. Un an plus tard, sa sinistralité s'est nettement dégradée.",
      q: "Quel phénomène explique le mieux cette évolution ?",
      choices: ["La loi des grands nombres", "L'antisélection", "La compensation dans le temps", "La divisibilité de la prime"],
      answer: [1],
      explain: "Une prime insuffisante attire précisément les risques supérieurs à la moyenne tarifée : les bons risques partent, les mauvais restent." },

    /* --- Trois piliers : classification --- */
    { id: 'm1g12', chap: 'c3', type: 'single',
      ctx: "Madame Rochat perçoit chaque mois une rente de vieillesse versée par sa caisse de compensation, calculée sur ses années de cotisation.",
      q: "De quel pilier relève cette prestation ?", choices: PILIERS, answer: [0],
      explain: "L'AVS constitue le 1er pilier : financé par répartition, il couvre les besoins vitaux et est obligatoire pour toute personne domiciliée ou active en Suisse." },

    { id: 'm1g13', chap: 'c3', type: 'single',
      ctx: "Monsieur Berger reçoit une rente de sa caisse de pension, calculée en appliquant un taux de conversion à l'avoir de vieillesse qu'il a accumulé.",
      q: "De quel pilier relève cette prestation ?", choices: PILIERS, answer: [1],
      explain: "La prévoyance professionnelle est le 2e pilier : financée par capitalisation, elle vise le maintien du niveau de vie habituel." },

    { id: 'm1g14', chap: 'c3', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, trois piliers, attribution",
      ctx: "Une cliente verse chaque année CHF 7 258.– sur un compte bancaire dédié, montant qu'elle déduit de son revenu imposable. Elle ne pourra y toucher qu'aux conditions prévues par la loi.",
      q: "De quel pilier cette prestation relève-t-elle ?",
      choices: [
        "Du 1er pilier",
        "Du 2e pilier",
        "Du 3e pilier lié (3a)",
        "Du 3e pilier libre (3b)",
      ],
      answer: [2],
      explain: "Le pilier 3a est la prévoyance individuelle liée : réservée aux personnes exerçant une activité lucrative, fiscalement déductible dans les limites annuelles, et bloquée jusqu'à cinq ans avant l'âge de référence sauf motif légal de retrait." },

    { id: 'm1g15', chap: 'c3', type: 'single',
      ctx: "Un salarié de 30 ans gagne CHF 70 000.– par an auprès d'un seul employeur.",
      q: "Quel est son salaire coordonné LPP en 2026 ?",
      choices: ["CHF 70 000.–", "CHF 43 540.–", "CHF 64 260.–", "CHF 26 460.–"],
      answer: [1],
      explain: "70 000 − 26 460 (déduction de coordination) = CHF 43 540.–. Il dépasse le seuil d'entrée de CHF 22 680.– et est donc assujetti." },

    { id: 'm1g16', chap: 'c3', type: 'single',
      ctx: "Un apprenti de 18 ans travaille à plein temps pour un salaire annuel de CHF 30 000.–.",
      q: "Quelle est sa situation au regard de la LPP ?",
      choices: ["Il n'est pas assujetti, il est trop jeune", "Il est assujetti pour les risques décès et invalidité seulement", "Il est assujetti pour les risques et l'épargne vieillesse", "Il est assujetti uniquement à l'épargne"],
      answer: [1],
      explain: "Dès 17 ans révolus et au-dessus du seuil d'entrée, la couverture porte sur les risques ; l'épargne vieillesse ne débute qu'à 25 ans révolus." },

    { id: 'm1g17', chap: 'c3', type: 'multi',
      ctx: "Plusieurs clients vous interrogent sur leur couverture accidents.",
      q: "Dans lesquelles de ces situations les accidents non professionnels sont-ils couverts par la LAA ?",
      choices: [
        "Une employée de bureau travaillant 32 heures par semaine chez un seul employeur.",
        "Un étudiant travaillant 5 heures par semaine dans un café.",
        "Un magasinier employé à plein temps.",
        "Une personne travaillant 6 heures chez un employeur et 5 heures chez un autre."
      ],
      answer: [0, 2],
      explain: "Le seuil de 8 heures hebdomadaires s'apprécie employeur par employeur : les heures ne s'additionnent pas d'un employeur à l'autre." },

    { id: 'm1g18', chap: 'c3', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "IA, trois piliers, 13e rente AVS",
      ctx: "Un retraité vous demande quand il touchera pour la première fois le supplément annuel décidé par le peuple.",
      q: "Que lui répondez-vous quant au premier versement du supplément annuel ?",
      choices: [
        "Il a déjà été versé pour la première fois en janvier 2025",
        "Il sera versé en décembre 2026, avec la rente de ce mois",
        "Il sera versé en janvier 2027, en début d'année civile",
        "Le supplément a été refusé en votation et n'existe pas",
      ],
      answer: [1],
      explain: "Le supplément correspond à un douzième de la rente de vieillesse annuelle et accompagne la rente de décembre, pour la première fois en décembre 2026. Le versement est automatique pour toute personne au bénéfice d'une rente de vieillesse ce mois-là." },

    /* --- Branches : dommages ou sommes --- */
    { id: 'm1g19', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, classification, dommage-somme",
      ctx: "Un assuré perçoit CHF 200 000.– au titre du capital décès prévu par son assurance-vie, quel que soit le préjudice financier réellement subi par ses proches.",
      q: "De quelle nature est cette assurance ?",
      choices: [
        "Une assurance de dommages",
        "Une assurance de sommes",
        "Une assurance sociale",
        "Une assurance obligatoire au sens de la LSA",
      ],
      answer: [1],
      explain: "Le montant est arrêté d'avance et versé sans que l'on mesure le préjudice réel : c'est le critère de l'assurance de sommes. Elle se cumule librement avec toute autre prestation, et n'ouvre aucun recours à l'assureur." },

    { id: 'm1g20', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, classification, dommage-somme",
      ctx: "Un incendie détruit le mobilier d'une famille. L'assureur mandate un expert, chiffre le dommage à CHF 34 000.– et verse ce montant sous déduction de la franchise.",
      q: "De quelle nature est cette assurance ?",
      choices: [
        "Une assurance de dommages",
        "Une assurance de sommes",
        "Une assurance sociale",
        "Une assurance de personnes au sens strict",
      ],
      answer: [0],
      explain: "La prestation dépend du préjudice effectivement constaté et ne peut pas le dépasser : c'est une assurance de dommages. D'où la règle proportionnelle en cas de sous-assurance et la subrogation contre le responsable." },

    { id: 'm1g21', chap: 'c4', type: 'multi',
      ctx: "Un client veut savoir quelles assurances sont obligatoires pour lui en Suisse.",
      q: "Dans lesquelles de ces situations une assurance est-elle imposée par la loi ?",
      choices: [
        "Il vient de s'installer en Suisse et doit se couvrir contre la maladie.",
        "Il immatricule une voiture à son nom.",
        "Il souhaite protéger son mobilier contre l'incendie.",
        "Il engage une employée de maison à 50 %."
      ],
      answer: [0, 1, 3],
      explain: "LAMal, RC véhicule et LAA sont obligatoires. L'assurance ménage reste facultative, même si elle est vivement recommandée." },

    /* --- Marché et intermédiaires --- */
    { id: 'm1g22', chap: 'c6', type: 'single',
      ctx: "Monsieur Favre est salarié d'une compagnie d'assurance dont il distribue exclusivement les produits auprès de la clientèle privée.",
      q: "Quel est son statut ?", choices: STATUT, answer: [0],
      explain: "Il agit pour le compte de l'entreprise qui l'emploie : c'est un intermédiaire lié, dont l'assureur répond et dont l'inscription au registre n'est plus obligatoire." },

    { id: 'm1g23', chap: 'c6', type: 'single',
      ctx: "Madame Cattin est mandatée par ses clients pour comparer le marché, négocier les conditions et gérer leur portefeuille. Elle est rémunérée par des courtages versés par les assureurs.",
      q: "Quel est son statut ?", choices: STATUT, answer: [1],
      explain: "Le critère décisif est l'intérêt représenté, non le mode de rémunération : mandatée par le client, elle est intermédiaire non lié et doit figurer au registre FINMA." },

    { id: 'm1g24', chap: 'c6', type: 'single',
      ctx: "Un intermédiaire souhaite conserver son contrat d'agence avec un assureur tout en se faisant mandater par ses clients comme courtier indépendant.",
      q: "Que dit la LSA ?",
      choices: ["C'est admis s'il l'indique dans sa documentation", "C'est interdit : le cumul des statuts lié et non lié n'est pas admis", "C'est admis avec l'accord de la FINMA", "C'est admis pour les seules assurances de choses"],
      answer: [1],
      explain: "Le conflit d'intérêts serait structurel : il faut choisir entre défendre le client et représenter l'assureur." },

    { id: 'm1g25', chap: 'c6', type: 'multi',
      ctx: "Vous préparez le dossier d'inscription au registre d'un futur courtier.",
      q: "Dans lesquelles de ces situations la condition d'inscription n'est-elle pas remplie ?",
      choices: [
        "Il n'a pas encore souscrit d'assurance responsabilité civile professionnelle.",
        "Il fait l'objet d'actes de défaut de biens récents.",
        "Il place des affaires auprès d'un assureur non autorisé en Suisse.",
        "Il ne dispose pas d'un capital social de CHF 100 000.–."
      ],
      answer: [0, 1, 2],
      explain: "Aucun capital minimal n'est exigé de l'intermédiaire : c'est la RC professionnelle qui protège les clients contre les conséquences d'un mauvais conseil." },

    { id: 'm1g26', chap: 'c6', type: 'single',
      ctx: "Lors d'un entretien, un courtier identifie une lacune importante dans la couverture de son client, mais celui-ci refuse de la combler pour des raisons de budget.",
      q: "Quelle est la bonne manière de procéder ?",
      choices: ["Ne rien noter et respecter le choix du client", "Consigner par écrit l'avertissement donné et le refus du client", "Résilier le mandat de courtage", "Annoncer le cas à la FINMA"],
      answer: [1],
      explain: "Le devoir de conseil impose d'avertir ; la documentation de cet avertissement est ensuite la meilleure protection de l'intermédiaire en cas de litige." },

    /* --- Réassurance --- */
    { id: 'm1g27', chap: 'c7', type: 'single',
      ctx: "Un assureur direct cède 30 % de chaque risque d'un portefeuille à un réassureur, qui reçoit en contrepartie 30 % des primes. Un sinistre de CHF 400 000.– survient.",
      q: "Quelle part le réassureur supporte-t-il ?",
      choices: ["CHF 120 000.–", "CHF 280 000.–", "CHF 400 000.–", "Rien, le sinistre est trop faible"],
      answer: [0],
      explain: "En quote-part, primes et sinistres se partagent dans la même proportion : 30 % de 400 000 = CHF 120 000.–." },

    { id: 'm1g28', chap: 'c7', type: 'single',
      ctx: "Un traité prévoit une priorité de CHF 2 millions et une garantie de CHF 6 millions au-delà. Un sinistre de CHF 5 millions survient.",
      q: "Combien le réassureur verse-t-il ?",
      choices: ["CHF 2 millions", "CHF 3 millions", "CHF 5 millions", "CHF 6 millions"],
      answer: [1],
      explain: "La cédante supporte la priorité de 2 millions ; le réassureur prend la tranche au-dessus, soit 5 − 2 = CHF 3 millions, dans la limite des 6 millions." },

    { id: 'm1g29', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "IA, réassurance, absence de lien contractuel",
      ctx: "L'assureur direct d'un client tombe en faillite. Le client apprend qu'une partie de son risque avait été réassurée et souhaite s'adresser directement au réassureur.",
      q: "Peut-il agir directement contre le réassureur ?",
      choices: [
        "Oui, à concurrence de la part du risque qui a été cédée",
        "Non, il n'a aucun lien contractuel avec le réassureur",
        "Oui, moyennant l'autorisation préalable de la FINMA",
        "Oui, dès lors que le sinistre dépasse CHF 100 000.–",
      ],
      answer: [1],
      explain: "La réassurance est un contrat entre assureurs : l'assuré y est un tiers. Son seul débiteur reste l'assureur direct, qui doit la prestation intégrale même si son réassureur fait défaut." },

    /* --- Surveillance --- */
    { id: 'm1g30', chap: 'c8', type: 'single',
      ctx: "Un assuré estime que son assureur refuse à tort de l'indemniser. Il vous demande de saisir la FINMA pour la contraindre à payer.",
      q: "Que lui répondez-vous ?",
      choices: ["La FINMA tranchera le litige", "La FINMA n'est pas une instance de recours contractuelle : la voie est l'Ombudsman puis le juge civil", "Il faut saisir le Tribunal fédéral directement", "Seul l'ASA peut intervenir"],
      answer: [1],
      explain: "La FINMA veille au respect du droit de la surveillance, pas à l'exécution des contrats individuels ; un abus systématique peut en revanche l'intéresser." },

    { id: 'm1g31', chap: 'c8', type: 'single',
      ctx: "Un assureur affiche un ratio SST de 78 %.",
      q: "Qu'est-ce que cela signifie ?",
      choices: ["Il est très solide", "Son capital porteur de risque ne couvre plus le capital cible : la FINMA intervient", "78 % de ses sinistres sont payés", "Sa fortune liée est excédentaire"],
      answer: [1],
      explain: "En dessous de 100 %, l'assureur ne couvre plus le capital exigé : la FINMA ordonne des mesures pouvant aller jusqu'au retrait de l'autorisation." },

    { id: 'm1g32', chap: 'c8', type: 'multi',
      ctx: "Un client s'inquiète de ce qui protégerait ses prétentions si son assureur devenait insolvable.",
      q: "Dans lesquelles de ces réponses lui donnez-vous une protection réelle ?",
      choices: [
        "La fortune liée, affectée en priorité aux créances d'assurance.",
        "Les exigences de solvabilité contrôlées par le SST.",
        "L'obligation de constituer des provisions techniques suffisantes.",
        "Le droit de timbre payé sur ses primes."
      ],
      answer: [0, 1, 2],
      explain: "Le droit de timbre est une taxe qui alimente la Confédération : il n'a aucune fonction de protection des assurés." }
  ]);

  /* ================= MODULE 2 — Droit ================= */
  add('m2', [
    /* --- Droit privé / public --- */
    { id: 'm2g01', chap: 'c1', type: 'single',
      ctx: "Un assuré conteste devant un tribunal le refus de son assureur de prendre en charge une hospitalisation en division privée, prévue par sa complémentaire.",
      q: "De quel domaine du droit relève ce litige ?", choices: DROIT, answer: [0],
      explain: "La complémentaire est un contrat soumis à la LCA, conclu entre parties juridiquement égales : droit privé, compétence du juge civil." },

    { id: 'm2g02', chap: 'c1', type: 'single',
      ctx: "Le même assuré conteste le montant de sa rente d'invalidité AI.",
      q: "De quel domaine du droit relève ce second litige ?", choices: DROIT, answer: [1],
      explain: "Les assurances sociales relèvent du droit public : l'État agit par voie de décision, et le litige se porte devant le tribunal des assurances sociales." },

    { id: 'm2g03', chap: 'c1', type: 'single',
      ctx: "Un jeune de 16 ans, parfaitement capable de discernement, souscrit seul une assurance ménage sans en parler à ses parents.",
      q: "Quel est le sort de ce contrat ?",
      choices: ["Il est pleinement valable", "Il est nul", "Il est boiteux : sa validité dépend de la ratification du représentant légal", "Il est annulable dans un délai d'un an"],
      answer: [2],
      explain: "Le mineur capable de discernement a besoin du consentement de son représentant légal : l'acte reste en suspens jusqu'à ratification." },

    /* --- Conclusion, révocation, réticence --- */
    { id: 'm2g04', chap: 'c3', type: 'single',
      ctx: "Madame Corti signe une proposition d'assurance le 3 mars. Elle reçoit la police le 11 mars et, le 14 mars, décide finalement de renoncer.",
      q: "Peut-elle encore se dégager, et sur quelle base ?",
      choices: ["Non, le contrat est définitif", "Oui, par le droit de révocation de 14 jours (art. 2a LCA), le délai courant depuis sa proposition", "Oui, en invoquant une réticence", "Oui, par la résiliation ordinaire de l'art. 35a"],
      answer: [1],
      explain: "Le délai de révocation court dès la proposition ou l'acceptation du preneur : au 14 mars, elle est encore dans les quatorze jours." },

    { id: 'm2g05', chap: 'c3', type: 'multi',
      ctx: "Plusieurs clients souhaitent revenir sur un contrat récemment conclu.",
      q: "Dans lesquelles de ces situations le droit de révocation de 14 jours s'applique-t-il ?",
      choices: [
        "Une assurance ménage conclue il y a six jours.",
        "Une couverture provisoire accordée en attendant la décision de l'assureur.",
        "Une assurance-vie conclue il y a dix jours.",
        "Une assurance de voyage conclue pour une durée de trois semaines."
      ],
      answer: [0, 2],
      explain: "La loi exclut la révocation pour les couvertures provisoires et pour les contrats d'une durée inférieure à un mois. L'assurance-vie, elle, est bien révocable." },

    { id: 'm2g06', chap: 'c3', type: 'single',
      ctx: "Monsieur Dubey n'a pas mentionné, dans son questionnaire de santé, une hypertension traitée depuis des années. Trois ans plus tard, il décède dans un accident de montagne. L'assureur découvre l'omission.",
      q: "Quelle est la situation ?",
      choices: ["L'assureur refuse le capital décès", "L'assureur doit la prestation, faute de causalité entre le fait tu et le décès, mais peut résilier pour l'avenir", "L'assureur réduit la prestation de moitié", "Le contrat est nul depuis l'origine"],
      answer: [1],
      explain: "Depuis la révision de 2022, le refus de prestation suppose que le fait non déclaré ait influé sur la survenance ou l'étendue du sinistre." },

    { id: 'm2g07', chap: 'c3', type: 'single',
      ctx: "Un assureur découvre une réticence le 2 avril. Il adresse sa résiliation le 20 mai, soit un peu plus de six semaines plus tard.",
      q: "Cette résiliation est-elle efficace ?",
      choices: ["Oui, le délai est de six mois", "Non : le délai de quatre semaines dès la connaissance est un délai de péremption", "Oui, s'il l'envoie en recommandé", "Oui, tant que cinq ans ne se sont pas écoulés"],
      answer: [1],
      explain: "Deux délais coexistent : quatre semaines dès la connaissance, et cinq ans dès la conclusion. Ici le délai court est dépassé, l'assureur perd son droit." },

    { id: 'm2g08', chap: 'c3', type: 'single',
      ctx: "Un client reçoit une police qui ne correspond pas à ce qui avait été convenu lors de l'entretien. Il s'en aperçoit deux mois plus tard.",
      q: "Quelle est sa situation depuis la révision de la LCA ?",
      choices: ["Il est trop tard, la police est réputée acceptée après quatre semaines", "L'accord réel des parties prime : la fiction d'approbation de l'ancien art. 12 a été abrogée", "Le contrat est nul", "Il doit saisir la FINMA dans les 30 jours"],
      answer: [1],
      explain: "L'ancien art. 12 LCA et sa « fiction d'approbation » ont disparu au 1.1.2022 : le silence du preneur ne vaut plus acceptation d'une police divergente." },

    /* --- Vie du contrat --- */
    { id: 'm2g09', chap: 'c4', type: 'single',
      ctx: "La prime d'un client échoit le 1er mars et reste impayée. L'assureur envoie le 15 mars une sommation régulière, avec un délai de 14 jours et la mention des conséquences. Un sinistre survient le 2 avril.",
      q: "Le sinistre est-il couvert ?",
      choices: ["Oui, le contrat n'est pas résilié", "Non : la couverture était suspendue depuis le 30 mars", "Oui, à concurrence de la moitié", "Cela dépend du montant du sinistre"],
      answer: [1],
      explain: "Le délai de quatorze jours dès le 15 mars expire le 29 mars ; la suspension court dès le 30 mars, avant la survenance du sinistre." },

    { id: 'm2g10', chap: 'c4', type: 'single',
      ctx: "Un preneur transforme son garage en atelier de soudure sans en informer son assureur incendie. Un incendie se déclare précisément dans cet atelier.",
      q: "Que devra établir l'assureur pour refuser sa prestation ?",
      choices: ["Rien, l'omission suffit", "Une aggravation essentielle du risque, du fait du preneur, en lien avec le sinistre", "Une prétention frauduleuse", "Un dommage supérieur à CHF 50 000.–"],
      answer: [1],
      explain: "L'aggravation doit porter sur un fait ayant fait l'objet d'une question, résulter du fait du preneur, et présenter un rapport avec le sinistre survenu." },

    { id: 'm2g11', chap: 'c4', type: 'multi',
      ctx: "Vous conseillez des clients dont les contrats prennent fin en cours d'année.",
      q: "Dans lesquelles de ces situations la part de prime non utilisée est-elle remboursée ?",
      choices: [
        "Le bateau assuré coule et est définitivement perdu ; l'assureur indemnise le dommage total.",
        "Un client résilie après un sinistre indemnisé, sur un contrat conclu cinq ans plus tôt.",
        "Un client résilie après un sinistre indemnisé, sur un contrat conclu quatre mois plus tôt.",
        "Un indépendant cesse définitivement son activité et ses contrats prennent fin."
      ],
      answer: [1],
      explain: "Seule la deuxième : ni disparition du risque, ni résiliation dans l'année suivant la conclusion. Les deux exceptions de l'art. 24 LCA font perdre la prime dans les trois autres cas." },

    { id: 'm2g12', chap: 'c4', type: 'single',
      ctx: "Monsieur Progin achète la maison de ses voisins le 15 mai. Le bâtiment est assuré auprès d'un assureur privé, contrat qu'il ne souhaite pas reprendre.",
      q: "De quel délai dispose-t-il pour refuser le transfert ?",
      choices: ["14 jours", "30 jours suivant le changement de propriétaire", "3 mois", "Il ne peut pas refuser"],
      answer: [1],
      explain: "Art. 54 LCA : l'acquéreur dispose de 30 jours pour refuser, l'assureur de 14 jours dès qu'il connaît son identité pour résilier." },

    /* --- Sinistre et faute --- */
    { id: 'm2g13', chap: 'c5', type: 'single',
      ctx: "Une conductrice provoque un accident après avoir consulté brièvement son téléphone à un feu rouge. L'expert retient une inattention momentanée sans circonstance aggravante.",
      q: "Quelle conséquence sur la prestation de son assurance casco ?", choices: FAUTE, answer: [0],
      explain: "La négligence légère fait partie du risque assuré : elle ne permet aucune réduction. Seules la faute grave et le dessein sont sanctionnés." },

    { id: 'm2g14', chap: 'c5', type: 'single',
      ctx: "Un conducteur prend le volant avec 1,9 ‰ d'alcool dans le sang et détruit son véhicule contre un arbre.",
      q: "Quelle conséquence sur sa prestation casco ?", choices: FAUTE, answer: [1],
      explain: "L'ivresse qualifiée est l'exemple type de la faute grave : l'assureur peut réduire dans la mesure répondant au degré de la faute (art. 14 al. 2 LCA)." },

    { id: 'm2g15', chap: 'c5', type: 'single',
      ctx: "Un assuré, criblé de dettes, met volontairement le feu à son entrepôt pour toucher l'indemnité.",
      q: "Quelle conséquence sur la prestation ?", choices: FAUTE, answer: [2],
      explain: "Le dessein supprime l'aléa, condition même de l'assurance : l'assureur est entièrement libéré, sans préjudice des suites pénales." },

    { id: 'm2g16', chap: 'c5', type: 'single',
      ctx: "Un assuré subit un vol réel de CHF 7 000.–. Pour « compenser la franchise », il ajoute à sa liste une tablette qu'il n'a jamais possédée, valant CHF 900.–.",
      q: "Quelle est la conséquence sur l'ensemble de sa prétention ?",
      choices: ["Il touche CHF 7 000.–", "Il perd tout droit aux prestations pour ce sinistre", "Il touche CHF 7 900.– moins la franchise", "Sa prime est majorée"],
      answer: [1],
      explain: "L'art. 40 LCA sanctionne intégralement la prétention frauduleuse : la part honnête tombe aussi, et l'assureur peut résilier le contrat." },

    { id: 'm2g17', chap: 'c5', type: 'single',
      ctx: "Un sinistre survient le 10 juin 2021. L'assuré ne l'annonce qu'en septembre 2026, aucun acte n'ayant interrompu le délai entre-temps.",
      q: "Quelle est la situation ?",
      choices: ["La créance est encore exigible, le délai est de dix ans", "La créance est prescrite, mais l'assureur doit invoquer la prescription", "Le juge écarte la demande d'office", "Le délai de deux ans s'applique"],
      answer: [1],
      explain: "Le délai de l'art. 46 LCA est de cinq ans depuis la révision. La prescription n'est jamais relevée d'office : elle doit être soulevée par le débiteur." },

    /* --- Sous-assurance et subrogation --- */
    { id: 'm2g18', chap: 'c6', type: 'single',
      ctx: "Un mobilier valant CHF 240 000.– est assuré pour CHF 180 000.–. Un dégât d'eau cause CHF 32 000.– de dommages. La franchise est de CHF 2 000.–.",
      q: "Quelle indemnité l'assureur verse-t-il ?",
      choices: ["CHF 30 000.–", "CHF 24 000.–", "CHF 22 000.–", "CHF 32 000.–"],
      answer: [2],
      explain: "Proportionnelle d'abord : 32 000 × (180 000/240 000) = CHF 24 000.–. Puis la franchise : 24 000 − 2 000 = CHF 22 000.–. L'ordre est impératif." },

    { id: 'm2g19', chap: 'c6', type: 'single',
      ctx: "Un assureur indemnise son assuré à hauteur de CHF 50 000.– pour un dommage causé par un tiers identifié. Le dommage total de l'assuré s'élevait à CHF 62 000.–. Le responsable n'est solvable qu'à hauteur de CHF 30 000.–.",
      q: "Comment ces CHF 30 000.– se répartissent-ils ?",
      choices: ["Entièrement à l'assureur", "CHF 12 000.– à l'assuré pour son découvert, le solde à l'assureur", "Par moitié", "Entièrement à l'assuré"],
      answer: [1],
      explain: "L'assuré est désintéressé en priorité pour la part non couverte (62 000 − 50 000). L'assureur ne récupère que le solde et supporte le risque d'insolvabilité." },

    { id: 'm2g20', chap: 'c6', type: 'multi',
      ctx: "Vous expliquez à un client dans quels cas son assureur pourra se retourner contre un tiers après l'avoir indemnisé.",
      q: "Dans lesquelles de ces situations la subrogation est-elle exclue ?",
      choices: [
        "La prestation provient d'une assurance de sommes.",
        "Le responsable est le conjoint vivant en ménage commun, sans faute grave.",
        "Le responsable est un locataire ayant endommagé l'appartement.",
        "Le responsable est un automobiliste inconnu du preneur."
      ],
      answer: [0, 1],
      explain: "L'assurance de sommes ignore le principe indemnitaire, et le recours contre les proches du ménage frapperait indirectement l'assuré lui-même." },

    /* --- Responsabilité civile : classification --- */
    { id: 'm2g21', chap: 'c7', type: 'single',
      ctx: "Un cycliste, distrait, renverse un piéton sur un passage protégé.",
      q: "Sur quelle base répond-il ?", choices: RESP, answer: [0],
      explain: "Le vélo n'est pas un véhicule à moteur au sens de la LCR : le cycliste répond selon la clause générale de l'art. 41 CO, donc pour faute." },

    { id: 'm2g22', chap: 'c7', type: 'single',
      ctx: "Le chien d'une famille mord un livreur devant la maison. Les détenteurs affirment avoir toujours pris toutes les précautions utiles.",
      q: "Sur quelle base répondent-ils ?", choices: RESP, answer: [1],
      explain: "L'art. 56 CO institue une causale simple : la responsabilité existe sans faute, mais la preuve de toute la diligence commandée peut libérer le détenteur." },

    { id: 'm2g23', chap: 'c7', type: 'single',
      ctx: "Un automobiliste, qui n'a commis aucune faute, blesse un enfant surgissant entre deux voitures.",
      q: "Sur quelle base répond-il ?", choices: RESP, answer: [2],
      explain: "L'art. 58 LCR met à la charge du détenteur une causale aggravée : aucune preuve libératoire, seules la force majeure ou une faute grave du lésé ou d'un tiers peuvent l'exonérer." },

    { id: 'm2g24', chap: 'c7', type: 'single',
      ctx: "Un conducteur ivre blesse gravement un piéton. Son assureur RC est appelé à indemniser la victime.",
      q: "Comment l'assureur doit-il procéder ?",
      choices: ["Réduire l'indemnité du piéton en raison de la faute grave", "Indemniser intégralement le piéton, puis exercer un recours contre son assuré", "Refuser toute prestation", "Renvoyer le piéton vers le Fonds national de garantie"],
      answer: [1],
      explain: "Les exceptions tirées du contrat ne sont pas opposables au lésé, qui dispose d'une action directe. La sanction se règle ensuite entre l'assureur et son assuré." },

    { id: 'm2g25', chap: 'c7', type: 'single',
      ctx: "Une victime d'accident découvre l'ampleur réelle de ses lésions et l'identité du responsable douze ans après les faits.",
      q: "Sa prétention est-elle prescrite ?",
      choices: ["Oui, le délai absolu est de dix ans", "Non : le délai relatif de trois ans court encore et le délai absolu est de vingt ans en cas de lésions corporelles", "Oui, le délai relatif est d'un an", "Non, la créance est imprescriptible"],
      answer: [1],
      explain: "La révision du droit de la prescription a porté le délai absolu à vingt ans en cas de mort ou de lésions corporelles, pour les dommages qui se révèlent tardivement." },

    /* --- LSA, LPD, LBA --- */
    { id: 'm2g26', chap: 'c8', type: 'multi',
      ctx: "Un intermédiaire non lié rencontre un nouveau client pour la première fois.",
      q: "Dans lesquelles de ces situations respecte-t-il son devoir d'information de l'art. 45 LSA ?",
      choices: [
        "Il indique son identité, son adresse et son statut de non lié.",
        "Il précise les entreprises d'assurance avec lesquelles il travaille.",
        "Il explique comment déposer une réclamation et qui répond en cas de conseil fautif.",
        "Il communique son chiffre d'affaires de l'année précédente."
      ],
      answer: [0, 1, 2],
      explain: "Le chiffre d'affaires de l'intermédiaire ne concerne pas le client ; en revanche, la transparence sur les indemnités reçues de tiers est exigée." },

    { id: 'm2g27', chap: 'c8', type: 'single',
      ctx: "Un assureur subit une intrusion informatique : les questionnaires de santé de plusieurs milliers de clients ont été exfiltrés.",
      q: "Quelle autorité doit être avisée ?",
      choices: ["La FINMA", "Le PFPDT, dans les meilleurs délais", "Le MROS", "L'ASA"],
      answer: [1],
      explain: "Les données de santé sont sensibles : le risque pour les personnes concernées est élevé, ce qui déclenche l'annonce au préposé fédéral à la protection des données." },

    { id: 'm2g28', chap: 'c8', type: 'single',
      ctx: "Un client souhaite verser CHF 300 000.– en espèces sur une assurance-vie à prime unique et reste évasif sur l'origine des fonds.",
      q: "Quelle est la marche à suivre ?",
      choices: ["Refuser l'affaire et expliquer au client que vous le soupçonnez", "Procéder aux clarifications et, si le soupçon subsiste, communiquer au MROS sans en informer le client", "Communiquer au PFPDT", "Accepter, l'assurance-vie n'étant pas soumise à la LBA"],
      answer: [1],
      explain: "L'assurance-vie directe est soumise à la LBA. Le risque accru impose des clarifications, puis une communication au MROS assortie de l'interdiction d'avertir le client." },

    { id: 'm2g29', chap: 'c8', type: 'multi',
      ctx: "Vous vérifiez si différentes opérations sont soumises à la loi sur le blanchiment d'argent.",
      q: "Dans lesquelles de ces situations la LBA s'applique-t-elle ?",
      choices: [
        "La souscription d'une assurance-vie à prime unique.",
        "La souscription d'une assurance ménage.",
        "La distribution de parts de placements collectifs par un assureur.",
        "La souscription d'une RC véhicule."
      ],
      answer: [0, 2],
      explain: "Seules les opérations à composante financière permettent de blanchir des fonds : l'assurance de choses et de patrimoine échappe à la LBA." },

    { id: 'm2g30', chap: 'c8', type: 'single',
      ctx: "Un client demande à son assureur d'effacer toutes les données le concernant, alors qu'une procédure judiciaire est en cours au sujet d'un sinistre.",
      q: "L'assureur peut-il refuser ?",
      choices: ["Non, le droit à l'effacement est absolu", "Oui, la conservation restant nécessaire à la défense de ses droits en justice", "Oui, mais seulement avec l'accord du PFPDT", "Non, il doit tout effacer sous 30 jours"],
      answer: [1],
      explain: "Le droit à l'effacement cède devant un motif justificatif : obligation légale de conservation, nécessité contractuelle ou constatation d'un droit en justice." }
  ]);
})();
