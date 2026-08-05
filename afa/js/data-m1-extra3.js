/* =============================================================
   AFA – Module 1, questions supplémentaires : chapitres 5 et 6
   (Marché suisse de l'assurance / Distribution et intermédiaires)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m1', [
    /* ================= c5 — Le marché suisse ================= */
    { id: 'm1c5x01', chap: 'c5', type: 'single',
      q: "L'assuré est :",
      choices: ["Celui qui signe le contrat et paie la prime", "La personne ou la chose exposée au risque couvert", "Celui qui reçoit la prestation", "L'intermédiaire mandaté"],
      answer: [1],
      explain: "Preneur, assuré et ayant droit sont trois rôles distincts qui peuvent coïncider. L'assuré est celui sur la tête ou sur les biens duquel repose le risque." },

    { id: 'm1c5x02', chap: 'c5', type: 'single',
      q: "L'ayant droit est :",
      choices: ["Le créancier de la prestation d'assurance", "Le débiteur de la prime", "L'organe de surveillance", "Le réassureur"],
      answer: [0],
      explain: "C'est celui qui peut réclamer la prestation : le bénéficiaire d'une assurance-vie, par exemple, sans être ni preneur ni assuré." },

    { id: 'm1c5x03', chap: 'c5', type: 'single',
      q: "Un père conclut une assurance-vie sur sa propre tête en faveur de sa fille. Qui est l'ayant droit ?",
      choices: ["Le père", "La fille", "L'assureur", "L'intermédiaire"],
      answer: [1],
      explain: "Le père est à la fois preneur et assuré ; sa fille, désignée comme bénéficiaire, est l'ayant droit qui recevra le capital décès." },

    { id: 'm1c5x04', chap: 'c5', type: 'single',
      q: "Pourquoi les groupes d'assurance créent-ils des sociétés distinctes pour la vie et le non-vie ?",
      choices: ["Pour des raisons fiscales uniquement", "En raison du principe de spécialisation imposé par la LSA", "Pour payer moins de droit de timbre", "Parce que la FINMA l'impose aux seuls réassureurs"],
      answer: [1],
      explain: "L'art. 12 LSA interdit à un assureur-vie d'exploiter simultanément d'autres branches, hormis accidents et maladie, afin de protéger les avoirs de prévoyance." },

    { id: 'm1c5x05', chap: 'c5', type: 'single',
      q: "Le plan d'exploitation d'une entreprise d'assurance décrit notamment :",
      choices: ["Le budget publicitaire", "Les branches exploitées, l'organisation, les bases techniques et la réassurance", "Le salaire des dirigeants", "Le portefeuille de chaque intermédiaire"],
      answer: [1],
      explain: "Il constitue le socle de l'autorisation délivrée par la FINMA ; ses modifications essentielles doivent lui être annoncées ou soumises." },

    { id: 'm1c5x06', chap: 'c5', type: 'multi',
      q: "Quels acteurs interviennent sur le marché suisse de l'assurance ?",
      choices: ["Les assureurs directs", "Les réassureurs", "Les intermédiaires", "La FINMA", "Le Tribunal fédéral en tant qu'assureur"],
      answer: [0, 1, 2, 3],
      explain: "Le Tribunal fédéral tranche des litiges, il n'est évidemment pas un acteur du marché de l'assurance." },

    { id: 'm1c5x07', chap: 'c5', type: 'single',
      q: "La SUVA est :",
      choices: ["Une société anonyme privée", "Un assureur-accidents de droit public compétent pour certaines branches définies par la loi", "Une association professionnelle", "Un organe de la FINMA"],
      answer: [1],
      explain: "Établissement autonome de droit public, la SUVA assure obligatoirement les entreprises des secteurs énumérés par la LAA (construction, industrie, transports…)." },

    { id: 'm1c5x08', chap: 'c5', type: 'single',
      q: "L'Association Suisse d'Assurances (ASA) a pour rôle :",
      choices: ["De surveiller les assureurs", "De représenter les intérêts de la branche et de coordonner l'autorégulation", "De délivrer les autorisations", "D'indemniser les assurés"],
      answer: [1],
      explain: "L'ASA est la faîtière des assureurs privés : lobbying, standards de branche, statistiques et autorégulation, sans pouvoir de surveillance." },

    { id: 'm1c5x09', chap: 'c5', type: 'single',
      q: "Quelle part du produit intérieur brut le secteur de l'assurance représente-t-il approximativement ?",
      choices: ["Environ 1 %", "Environ 4 %", "Environ 12 %", "Environ 25 %"],
      answer: [1],
      explain: "L'assurance pèse environ 4 % du PIB, la place financière dans son ensemble environ 9 %. Retenez l'ordre de grandeur plutôt que la décimale." },

    { id: 'm1c5x10', chap: 'c5', type: 'single',
      q: "Que mesure la « densité d'assurance » ?",
      choices: ["Le nombre d'assureurs par habitant", "Les primes versées par habitant", "Le nombre de contrats par ménage", "La part des sinistres dans les primes"],
      answer: [1],
      explain: "C'est le volume de primes rapporté à la population. La Suisse figure parmi les pays où cette densité est la plus élevée au monde." },

    { id: 'm1c5x11', chap: 'c5', type: 'single',
      q: "La « pénétration de l'assurance » désigne :",
      choices: ["Le rapport entre le volume de primes et le PIB", "La part de marché du plus grand assureur", "Le taux de résiliation des contrats", "La proportion d'assurés dans la population"],
      answer: [0],
      explain: "Elle rapporte les primes à la richesse produite par le pays et permet de comparer le développement des marchés d'assurance entre États." },

    { id: 'm1c5x12', chap: 'c5', type: 'single',
      q: "Une société coopérative d'assurance se caractérise par :",
      choices: ["L'absence de tout capital", "Le fait que ses membres sont en principe ses assurés", "L'interdiction de faire du bénéfice", "Sa soumission au droit public"],
      answer: [1],
      explain: "La coopérative appartient à ses sociétaires, souvent les assurés eux-mêmes. C'est l'une des deux formes juridiques admises par la LSA, avec la SA." },

    { id: 'm1c5x13', chap: 'c5', type: 'multi',
      q: "Quelles fonctions typiques trouve-t-on dans une entreprise d'assurance ?",
      choices: ["Souscription (underwriting)", "Actuariat", "Gestion des sinistres", "Compliance", "Surveillance prudentielle des concurrents"],
      answer: [0, 1, 2, 3],
      explain: "La surveillance prudentielle est la tâche exclusive de la FINMA ; un assureur ne surveille évidemment pas ses concurrents." },

    { id: 'm1c5x14', chap: 'c5', type: 'single',
      q: "Le souscripteur (underwriter) a pour mission :",
      choices: ["De régler les sinistres", "D'apprécier et de sélectionner les risques proposés, et d'en fixer les conditions", "De vendre les contrats aux particuliers", "De contrôler les comptes"],
      answer: [1],
      explain: "Il décide d'accepter, de refuser ou d'accepter avec réserves un risque, en fixant prime, franchise et exclusions adaptées." },

    { id: 'm1c5x15', chap: 'c5', type: 'single',
      q: "Le Bureau national d'assurance intervient pour :",
      choices: ["Les véhicules suisses non assurés", "Les dommages causés en Suisse par des véhicules immatriculés à l'étranger", "Les sinistres de la SUVA", "Les faillites d'assureurs"],
      answer: [1],
      explain: "Le Bureau national traite les véhicules étrangers ; le Fonds national de garantie s'occupe des véhicules non identifiés ou non assurés." },

    { id: 'm1c5x16', chap: 'c5', type: 'single',
      q: "Une succursale d'assureur étranger active en Suisse :",
      choices: ["Échappe à la surveillance suisse", "Doit obtenir une autorisation de la FINMA", "Relève uniquement de l'autorité de son pays d'origine", "Ne peut couvrir que des risques industriels"],
      answer: [1],
      explain: "Toute activité d'assurance exercée en Suisse est soumise à autorisation, y compris pour les succursales d'entreprises étrangères, avec des exigences propres." },

    { id: 'm1c5x17', chap: 'c5', type: 'single',
      q: "Le marché suisse de l'assurance se caractérise par :",
      choices: ["Un très faible degré de concurrence", "Une forte concentration et une importante activité internationale", "L'absence d'assureurs étrangers", "L'interdiction de la vente en ligne"],
      answer: [1],
      explain: "Quelques grands groupes dominent, et la Suisse abrite des réassureurs de rang mondial : le secteur est fortement exportateur de services." },

    { id: 'm1c5x18', chap: 'c5', type: 'single',
      q: "Le nombre d'entreprises d'assurance et de réassurance surveillées par la FINMA est d'environ :",
      choices: ["50", "200", "600", "1 200"],
      answer: [1],
      explain: "Environ 200 entités, assureurs directs et réassureurs confondus, auxquels s'ajoutent les caisses-maladie, surveillées elles par l'OFSP pour l'assurance de base." },

    { id: 'm1c5x19', chap: 'c5', type: 'single',
      q: "Qui surveille l'assurance-maladie obligatoire (LAMal) ?",
      choices: ["La FINMA", "L'Office fédéral de la santé publique (OFSP)", "L'ASA", "Le canton de domicile"],
      answer: [1],
      explain: "L'assurance de base relève de l'OFSP ; la FINMA surveille en revanche les assurances complémentaires soumises à la LCA." },

    { id: 'm1c5x20', chap: 'c5', type: 'single',
      q: "Le rôle du service de gestion des sinistres est notamment :",
      choices: ["De fixer les tarifs", "De vérifier la couverture, d'établir le dommage et de régler la prestation", "De recruter les intermédiaires", "D'émettre les polices"],
      answer: [1],
      explain: "C'est le moment de vérité du contrat : contrôle de la couverture, examen des obligations de l'assuré, chiffrage du dommage et paiement." },

    { id: 'm1c5x21', chap: 'c5', type: 'multi',
      q: "Quelles affirmations sur le preneur d'assurance sont exactes ?",
      choices: ["Il est le cocontractant de l'assureur", "Il doit la prime", "Il est nécessairement l'assuré", "Il exerce les droits de résiliation", "Il est toujours le bénéficiaire"],
      answer: [0, 1, 3],
      explain: "Preneur, assuré et bénéficiaire peuvent être trois personnes différentes : c'est fréquent en assurance-vie et en assurance pour compte d'autrui." },

    { id: 'm1c5x22', chap: 'c5', type: 'single',
      q: "L'assurance « pour compte d'autrui » signifie que :",
      choices: ["L'assureur agit pour un autre assureur", "Le preneur conclut le contrat en faveur d'un tiers assuré", "L'intermédiaire signe à la place du client", "La prime est payée par l'État"],
      answer: [1],
      explain: "Un employeur assurant ses collaborateurs, ou un transporteur assurant la marchandise de son client, agissent pour le compte de tiers." },

    { id: 'm1c5x23', chap: 'c5', type: 'single',
      q: "Le secteur suisse de l'assurance emploie environ :",
      choices: ["5 000 personnes", "50 000 personnes", "200 000 personnes", "500 000 personnes"],
      answer: [1],
      explain: "Environ 50 000 collaborateurs en Suisse, auxquels s'ajoutent les emplois indirects (courtiers indépendants, experts, réparateurs)." },

    { id: 'm1c5x24', chap: 'c5', type: 'single',
      q: "Le fonds d'organisation d'un assureur sert :",
      choices: ["À couvrir les engagements envers les assurés", "À financer la constitution et le développement de l'entreprise", "À payer les sinistres majeurs", "À indemniser les intermédiaires"],
      answer: [1],
      explain: "Il finance les coûts de démarrage et d'extension. Les engagements envers les assurés sont couverts par les provisions techniques et la fortune liée." },

    { id: 'm1c5x25', chap: 'c5', type: 'single',
      q: "Une mutuelle d'assurance se distingue d'une société anonyme par :",
      choices: ["L'absence de personnalité juridique", "Le fait que les assurés en sont les membres et non des actionnaires extérieurs", "L'interdiction d'employer du personnel", "L'exonération du droit de timbre"],
      answer: [1],
      explain: "L'objectif n'est pas la rémunération d'actionnaires mais la couverture des besoins des sociétaires, ce qui peut se traduire par des ristournes de primes." },

    { id: 'm1c5x26', chap: 'c5', type: 'single',
      q: "L'assurance directe se distingue de la réassurance par le fait que :",
      choices: ["L'assureur direct contracte avec le preneur, le réassureur avec l'assureur", "L'assureur direct ne prend aucun risque", "Le réassureur vend aux particuliers", "L'assurance directe est interdite aux SA"],
      answer: [0],
      explain: "La réassurance est une opération entre professionnels du risque : l'assuré n'a jamais de lien juridique avec le réassureur." },

    { id: 'm1c5x27', chap: 'c5', type: 'single',
      q: "La révision interne d'une compagnie d'assurance a pour tâche :",
      choices: ["De vendre les produits", "De contrôler de manière indépendante les processus et la maîtrise des risques internes", "De remplacer la FINMA", "De fixer les provisions"],
      answer: [1],
      explain: "Rattachée au conseil d'administration, elle vérifie l'efficacité du contrôle interne, indépendamment de la direction opérationnelle." },

    { id: 'm1c5x28', chap: 'c5', type: 'single',
      q: "La compliance dans une compagnie d'assurance veille :",
      choices: ["Au respect des prescriptions légales et réglementaires", "À la rentabilité des placements", "Au recrutement des courtiers", "Au calcul des primes"],
      answer: [0],
      explain: "Elle prévient les risques juridiques et de réputation : LBA, protection des données, règles de conduite, sanctions internationales." },

    { id: 'm1c5x29', chap: 'c5', type: 'multi',
      q: "Quelles branches un assureur autorisé pour l'assurance-vie peut-il également exploiter ?",
      choices: ["L'assurance-maladie", "L'assurance-accidents", "L'assurance incendie", "L'assurance RC", "L'assurance casco"],
      answer: [0, 1],
      explain: "Le principe de spécialisation n'admet que ces deux exceptions ; toutes les autres branches doivent être logées dans une entité distincte." },

    { id: 'm1c5x30', chap: 'c5', type: 'single',
      q: "Le marché suisse des assurances de personnes se compose principalement :",
      choices: ["De la vie individuelle et de la prévoyance professionnelle", "De l'assurance véhicules", "De la RC d'entreprise", "De la réassurance non proportionnelle"],
      answer: [0],
      explain: "L'assurance-vie collective liée au 2e pilier constitue la part la plus importante du volume de primes vie en Suisse, devant la vie individuelle." },

    /* ================= c6 — Distribution et intermédiaires ================= */
    { id: 'm1c6x01', chap: 'c6', type: 'single',
      q: "Sur quelle base juridique repose la relation entre un courtier et son client ?",
      choices: ["Un contrat de travail", "Un mandat de courtage", "Un contrat d'agence", "Un contrat d'assurance"],
      answer: [1],
      explain: "Le courtier reçoit un mandat de son client. L'agent, lui, est lié à l'assureur par un contrat de travail ou un contrat d'agence." },

    { id: 'm1c6x02', chap: 'c6', type: 'single',
      q: "Un agent général qui distribue exclusivement les produits d'une compagnie est :",
      choices: ["Un intermédiaire non lié", "Un intermédiaire lié", "Un réassureur", "Un souscripteur"],
      answer: [1],
      explain: "Il agit pour le compte de l'entreprise d'assurance qu'il représente : c'est le statut d'intermédiaire lié, dont l'assureur répond." },

    { id: 'm1c6x03', chap: 'c6', type: 'single',
      q: "Qui répond en principe du comportement fautif d'un intermédiaire lié ?",
      choices: ["L'intermédiaire seul", "L'entreprise d'assurance pour laquelle il agit", "La FINMA", "Le preneur d'assurance"],
      answer: [1],
      explain: "L'assureur répond des actes de ses agents, ce qui explique que leur inscription individuelle au registre ne soit plus exigée depuis 2024." },

    { id: 'm1c6x04', chap: 'c6', type: 'single',
      q: "Pourquoi le courtier doit-il disposer d'une RC professionnelle ?",
      choices: ["Pour garantir le paiement des primes", "Pour couvrir les conséquences financières d'un conseil ou d'un placement fautif", "Pour remplacer la fortune liée", "Pour financer sa formation continue"],
      answer: [1],
      explain: "Une lacune de couverture due à une erreur de conseil peut coûter très cher au client : la RC professionnelle, ou une garantie équivalente, le protège." },

    { id: 'm1c6x05', chap: 'c6', type: 'multi',
      q: "Quels sont des canaux de distribution en assurance ?",
      choices: ["Service externe propre", "Courtiers", "Bancassurance", "Vente en ligne et comparateurs", "Autorité de surveillance"],
      answer: [0, 1, 2, 3],
      explain: "La FINMA surveille le marché ; elle n'est évidemment pas un canal de distribution." },

    { id: 'm1c6x06', chap: 'c6', type: 'single',
      q: "La bancassurance désigne :",
      choices: ["L'assurance des banques contre le vol", "La distribution de produits d'assurance par le réseau bancaire", "La réassurance des crédits", "L'assurance-crédit à l'exportation"],
      answer: [1],
      explain: "Elle exploite la relation de confiance et les données du réseau bancaire, en particulier pour les produits de prévoyance et d'épargne." },

    { id: 'm1c6x07', chap: 'c6', type: 'single',
      q: "L'analyse des besoins du client sert principalement à :",
      choices: ["Vendre le produit le plus rémunérateur", "Identifier les risques réels et proposer une couverture adaptée", "Remplir une obligation purement formelle", "Déterminer la solvabilité de l'assureur"],
      answer: [1],
      explain: "Sans analyse des besoins, le conseil ne peut être adéquat. Elle constitue à la fois un devoir professionnel et la meilleure protection en cas de litige." },

    { id: 'm1c6x08', chap: 'c6', type: 'single',
      q: "La documentation du conseil protège :",
      choices: ["Uniquement le client", "Uniquement l'assureur", "À la fois le client et l'intermédiaire, en cas de contestation ultérieure", "Personne, elle est purement administrative"],
      answer: [2],
      explain: "Elle atteste ce qui a été expliqué, recommandé et éventuellement refusé par le client : c'est la pièce maîtresse en cas de reproche de mauvais conseil." },

    { id: 'm1c6x09', chap: 'c6', type: 'single',
      q: "Le démarchage téléphonique à froid en assurance est :",
      choices: ["Autorisé sans restriction", "Interdit ou strictement encadré par la loi et l'autorégulation", "Réservé aux intermédiaires liés", "Autorisé le week-end uniquement"],
      answer: [1],
      explain: "Appeler des personnes avec lesquelles aucune relation n'existe est prohibé ; la branche s'est en outre dotée de règles d'autorégulation sur les appels et les rémunérations." },

    { id: 'm1c6x10', chap: 'c6', type: 'single',
      q: "Un intermédiaire non lié rémunéré uniquement par honoraires de son client s'appelle :",
      choices: ["Un agent", "Un courtier en honoraires (fee-based)", "Un souscripteur", "Un gestionnaire de sinistres"],
      answer: [1],
      explain: "Le conseil est facturé au client, ce qui écarte le conflit d'intérêts lié aux courtages versés par les assureurs. Ce modèle reste minoritaire en Suisse." },

    { id: 'm1c6x11', chap: 'c6', type: 'multi',
      q: "Quelles informations l'intermédiaire doit-il fournir au client avant la conclusion ?",
      choices: ["Son identité et son adresse", "Son statut lié ou non lié", "Les entreprises d'assurance qu'il représente", "Les possibilités de réclamation et de médiation", "Le montant de son chiffre d'affaires annuel"],
      answer: [0, 1, 2, 3],
      explain: "Le chiffre d'affaires de l'intermédiaire ne concerne pas le client ; en revanche, la transparence sur les rémunérations reçues de tiers est exigée du courtier." },

    { id: 'm1c6x12', chap: 'c6', type: 'single',
      q: "Que risque un intermédiaire non lié qui exerce sans être inscrit au registre ?",
      choices: ["Rien, l'inscription est facultative", "Des sanctions de la FINMA, y compris une interdiction d'exercer", "Une simple amende de son employeur", "Un avertissement de l'ASA"],
      answer: [1],
      explain: "L'inscription est une condition légale de l'activité. La FINMA peut prononcer une interdiction d'exercer et, en cas de récidive, engager des poursuites pénales." },

    { id: 'm1c6x13', chap: 'c6', type: 'single',
      q: "La formation continue de l'intermédiaire vise à :",
      choices: ["Augmenter ses commissions", "Maintenir à jour ses connaissances professionnelles, condition du maintien de l'inscription", "Remplacer l'examen initial", "Satisfaire l'employeur uniquement"],
      answer: [1],
      explain: "Les règles et les produits évoluent constamment ; la branche impose un standard minimal, attesté par une plateforme reconnue comme Cicero." },

    { id: 'm1c6x14', chap: 'c6', type: 'single',
      q: "Un client se plaint d'un conseil erroné donné par un courtier. Vers qui se tourne-t-il en premier lieu ?",
      choices: ["Vers la FINMA", "Vers le courtier et son assurance RC professionnelle", "Vers le Tribunal fédéral", "Vers l'ASA"],
      answer: [1],
      explain: "La responsabilité du conseil incombe au courtier, couvert par sa RC professionnelle. La FINMA ne tranche pas les litiges individuels." },

    { id: 'm1c6x15', chap: 'c6', type: 'single',
      q: "Le courtier qui compare plusieurs offres du marché exécute :",
      choices: ["Une obligation découlant de son mandat envers le client", "Une faveur commerciale sans portée juridique", "Une exigence de la FINMA envers les agents", "Une tâche réservée à l'actuaire"],
      answer: [0],
      explain: "Mandaté par le client, le courtier lui doit diligence et fidélité, ce qui implique de rechercher la solution la plus adaptée sur le marché." },

    { id: 'm1c6x16', chap: 'c6', type: 'single',
      q: "Un intermédiaire lié peut-il conseiller les produits d'un concurrent de son mandant ?",
      choices: ["Oui, librement", "Non, il agit pour le compte de l'entreprise qu'il représente", "Oui, avec l'accord du client", "Oui, s'il est inscrit au registre"],
      answer: [1],
      explain: "Sa position découle de son lien avec l'assureur. S'il voulait agir librement pour le client, il devrait adopter le statut de non lié — sans pouvoir cumuler les deux." },

    { id: 'm1c6x17', chap: 'c6', type: 'multi',
      q: "Quels éléments caractérisent l'intermédiaire non lié ?",
      choices: ["Il agit pour le compte du preneur", "Il doit s'inscrire au registre FINMA", "Il doit disposer d'une RC professionnelle", "Il est salarié de l'assureur", "Il doit rendre transparentes les rémunérations reçues de tiers"],
      answer: [0, 1, 2, 4],
      explain: "Être salarié d'un assureur est précisément la marque de l'intermédiaire lié ; le non lié est indépendant de toute compagnie." },

    { id: 'm1c6x18', chap: 'c6', type: 'single',
      q: "La commission de suivi (ou courtage récurrent) rémunère :",
      choices: ["La seule conclusion du contrat", "La gestion continue du portefeuille du client", "L'examen médical du proposant", "Les frais de la FINMA"],
      answer: [1],
      explain: "Elle rétribue le service dans la durée : adaptation des couvertures, assistance en cas de sinistre, révision annuelle du portefeuille." },

    { id: 'm1c6x19', chap: 'c6', type: 'single',
      q: "Le conflit d'intérêts d'un courtier rémunéré par courtages provient de ce que :",
      choices: ["Il conseille le client mais est payé par l'assureur", "Il ne connaît pas les produits", "Il n'a pas de RC professionnelle", "Il travaille sans mandat"],
      answer: [0],
      explain: "D'où l'exigence de transparence : le client doit savoir qui paie son conseiller et à quelle hauteur, afin d'apprécier lui-même l'indépendance du conseil." },

    { id: 'm1c6x20', chap: 'c6', type: 'single',
      q: "Une entreprise qui vend des assurances en complément de son activité principale (garage, voyagiste) est :",
      choices: ["Toujours exemptée de toute règle", "Soumise aux règles applicables aux intermédiaires, avec des allègements possibles pour certaines assurances accessoires", "Interdite d'activité", "Considérée comme un assureur"],
      answer: [1],
      explain: "La LSA prévoit un régime allégé pour les assurances accessoires de faible portée, mais l'activité d'intermédiation reste encadrée." },

    { id: 'm1c6x21', chap: 'c6', type: 'single',
      q: "Le registre des intermédiaires est tenu par :",
      choices: ["L'ASA", "La FINMA", "L'AFA / VBV", "Le registre du commerce"],
      answer: [1],
      explain: "La FINMA tient le registre et le rend public, ce qui permet à chacun de vérifier si son interlocuteur est autorisé à exercer comme intermédiaire non lié." },

    { id: 'm1c6x22', chap: 'c6', type: 'single',
      q: "La « bonne réputation » exigée d'un intermédiaire s'apprécie notamment au regard :",
      choices: ["De son chiffre d'affaires", "De ses antécédents pénaux et de l'absence d'actes de défaut de biens", "De son ancienneté dans la branche", "De son niveau de formation universitaire"],
      answer: [1],
      explain: "Il s'agit de la garantie d'une activité irréprochable : condamnations pénales pertinentes et surendettement font obstacle à l'inscription." },

    { id: 'm1c6x23', chap: 'c6', type: 'single',
      q: "Que doit faire l'intermédiaire s'il constate qu'un produit ne correspond pas aux besoins du client ?",
      choices: ["Le vendre quand même si le client insiste, sans rien noter", "Le déconseiller et documenter son avertissement", "Résilier son mandat immédiatement", "Informer la FINMA"],
      answer: [1],
      explain: "Le devoir de conseil impose d'avertir ; si le client persiste, la documentation de l'avertissement protège l'intermédiaire d'un reproche ultérieur." },

    { id: 'm1c6x24', chap: 'c6', type: 'single',
      q: "Un comparateur en ligne qui conclut des contrats d'assurance :",
      choices: ["N'est soumis à aucune règle", "Exerce une activité d'intermédiation soumise aux règles de la LSA", "Est un assureur au sens de la LSA", "Relève exclusivement du droit de la concurrence"],
      answer: [1],
      explain: "Le canal numérique ne change rien à la nature de l'activité : les devoirs d'information et de conseil s'appliquent également en ligne." },

    { id: 'm1c6x25', chap: 'c6', type: 'multi',
      q: "Quelles obligations pèsent sur l'intermédiaire lors du traitement des données du client ?",
      choices: ["Informer sur la collecte et la finalité du traitement", "Obtenir un consentement exprès pour les données de santé", "Assurer la sécurité des données", "Transmettre librement les données à des tiers commerciaux", "Respecter le principe de proportionnalité"],
      answer: [0, 1, 2, 4],
      explain: "La transmission à des tiers suppose une base légale ou le consentement de la personne concernée : elle n'est jamais libre." },

    { id: 'm1c6x26', chap: 'c6', type: 'single',
      q: "Le mandat de courtage peut en principe être révoqué :",
      choices: ["Jamais avant cinq ans", "En tout temps par le client", "Uniquement avec l'accord de l'assureur", "Uniquement à l'échéance du contrat d'assurance"],
      answer: [1],
      explain: "Le mandat repose sur la confiance et peut être révoqué en tout temps par le mandant, ce qui n'affecte pas la validité des contrats d'assurance conclus." },

    { id: 'm1c6x27', chap: 'c6', type: 'single',
      q: "Un intermédiaire constate que son client a une lacune de couverture importante. Il doit :",
      choices: ["Attendre que le client en parle", "Le signaler activement dans le cadre de son devoir de conseil", "Prévenir la FINMA", "Résilier les contrats existants"],
      answer: [1],
      explain: "Le devoir de conseil est actif : il ne se limite pas à répondre aux questions posées, mais impose de signaler les risques non couverts identifiés." },

    { id: 'm1c6x28', chap: 'c6', type: 'single',
      q: "Le service externe (service de vente) d'une compagnie regroupe :",
      choices: ["Les collaborateurs chargés de la vente et du conseil auprès des clients", "Les experts en sinistres", "Les actuaires", "Les réviseurs internes"],
      answer: [0],
      explain: "Par opposition au service interne (administration, souscription, sinistres), le service externe est en contact direct avec la clientèle." },

    { id: 'm1c6x29', chap: 'c6', type: 'single',
      q: "Depuis 2024, un intermédiaire lié doit-il être inscrit au registre FINMA ?",
      choices: ["Oui, obligatoirement", "Non, l'inscription obligatoire ne vise que les non liés", "Oui, mais seulement en assurance-vie", "Oui, seulement s'il travaille pour plusieurs assureurs"],
      answer: [1],
      explain: "L'assureur répondant de ses agents, l'inscription obligatoire a été recentrée sur les courtiers, qui agissent pour le client et de manière indépendante." },

    { id: 'm1c6x30', chap: 'c6', type: 'single',
      q: "Un intermédiaire souhaite exercer à la fois comme agent d'un assureur et comme courtier indépendant. C'est :",
      choices: ["Autorisé s'il l'annonce à la FINMA", "Interdit, le cumul des statuts n'est pas admis", "Autorisé pour les seules assurances de personnes", "Autorisé après cinq ans d'expérience"],
      answer: [1],
      explain: "Le double statut placerait l'intermédiaire dans un conflit d'intérêts permanent : la LSA l'interdit expressément." }
  ]);
})();
