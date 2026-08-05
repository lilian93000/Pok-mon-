/* =============================================================
   AFA – Module 3, questions supplémentaires : chapitres 5 à 8
   (RC entreprise / Choses entreprises / PJ-cyber / Sinistres)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m3', [
    /* ================= c5 — RC entreprise ================= */
    { id: 'm3c5x01', chap: 'c5', type: 'single',
      q: "Un employé d'une entreprise de nettoyage casse un vase de valeur chez un client. Quelle couverture intervient ?",
      choices: ["La RC privée de l'employé", "La RC exploitation de l'entreprise", "L'assurance de choses de l'entreprise", "La perte d'exploitation"],
      answer: [1],
      explain: "L'employeur répond des dommages causés par ses auxiliaires dans l'accomplissement de leur travail (art. 55 CO) : c'est le cœur de la RC exploitation." },

    { id: 'm3c5x02', chap: 'c5', type: 'single',
      q: "Un produit défectueux provoque un incendie chez un consommateur. Quelle couverture est concernée ?",
      choices: ["La RC produits", "La RC professionnelle", "L'assurance transport", "La D&O"],
      answer: [0],
      explain: "Le dommage est causé par le produit après sa mise en circulation : c'est le domaine de la RC produits, adossée à la responsabilité causale de la LRFP." },

    { id: 'm3c5x03', chap: 'c5', type: 'single',
      q: "Que couvre l'extension « frais de retrait et de rappel » ?",
      choices: ["Le dommage subi par les victimes du produit", "Les coûts du retrait du marché, du tri et du remplacement des produits défectueux", "La perte de chiffre d'affaires", "Les amendes des autorités"],
      answer: [1],
      explain: "Ce sont des frais propres à l'entreprise, engagés souvent avant tout dommage à un tiers : la RC de base ne les couvre pas sans extension." },

    { id: 'm3c5x04', chap: 'c5', type: 'single',
      q: "Un fiduciaire commet une erreur de déclaration fiscale qui coûte CHF 40 000.– à son client. Quelle couverture répond ?",
      choices: ["La RC exploitation", "La RC professionnelle", "La protection juridique", "L'assurance de choses"],
      answer: [1],
      explain: "Aucun bien ni aucune personne n'est atteint : c'est un dommage purement patrimonial, que seule la RC professionnelle prend en charge." },

    { id: 'm3c5x05', chap: 'c5', type: 'single',
      q: "Pourquoi un courtier en assurance doit-il disposer d'une RC professionnelle ?",
      choices: ["Pour payer les primes de ses clients", "Parce que c'est une condition légale d'inscription au registre et que son conseil peut causer un dommage patrimonial", "Pour couvrir ses locaux", "Pour bénéficier d'un rabais de timbre"],
      answer: [1],
      explain: "Une lacune de couverture due à un mauvais conseil peut coûter très cher au client : la RC professionnelle, ou une garantie équivalente, est exigée par la LSA." },

    { id: 'm3c5x06', chap: 'c5', type: 'single',
      q: "Une entreprise suisse exporte aux États-Unis. Quel point doit être vérifié en priorité dans sa RC produits ?",
      choices: ["Le montant de la franchise ménage", "La territorialité : les USA et le Canada sont souvent exclus ou fortement surtarifés", "Le taux de conversion", "La durée du contrat de travail"],
      answer: [1],
      explain: "Le niveau des indemnités et les frais de procédure y sont sans commune mesure avec la pratique suisse : la couverture doit être expressément étendue." },

    { id: 'm3c5x07', chap: 'c5', type: 'single',
      q: "En base « loss occurrence », quel événement déclenche la couverture ?",
      choices: ["La réclamation du lésé", "La survenance du dommage pendant la période d'assurance", "La signature du contrat", "La déclaration à la FINMA"],
      answer: [1],
      explain: "C'est la base usuelle en Suisse : peu importe quand la réclamation arrive, ce qui compte est la date à laquelle le dommage s'est produit." },

    { id: 'm3c5x08', chap: 'c5', type: 'single',
      q: "À quoi sert une couverture subséquente dans un contrat en base claims made ?",
      choices: ["À augmenter la somme de garantie", "À permettre l'annonce de réclamations après la fin du contrat, pour des faits antérieurs", "À couvrir les biens propres", "À supprimer la franchise"],
      answer: [1],
      explain: "Sans elle, un professionnel qui cesse son activité resterait exposé aux réclamations tardives, alors même qu'il n'a plus de contrat en cours." },

    { id: 'm3c5x09', chap: 'c5', type: 'multi',
      q: "Quels dommages une RC d'entreprise ne couvre-t-elle pas ?",
      choices: ["Les dommages aux biens propres de l'entreprise", "Les amendes administratives et pénales", "Les dommages causés intentionnellement", "Le manque à gagner de l'entreprise elle-même", "Les dommages corporels causés à un client"],
      answer: [0, 1, 2, 3],
      explain: "Le dommage corporel causé à un tiers est précisément le risque assuré. Les autres postes relèvent de l'assurance de choses, de la perte d'exploitation, ou ne sont pas assurables." },

    { id: 'm3c5x10', chap: 'c5', type: 'single',
      q: "Une somme de garantie « par sinistre et par année d'assurance » signifie que :",
      choices: ["Le plafond vaut une seule fois pour toute la durée du contrat", "Le plafond s'applique à chaque sinistre, mais aussi comme cumul annuel", "Il n'y a aucun plafond", "Le plafond double chaque année"],
      answer: [1],
      explain: "Deux limites se superposent : celle d'un sinistre isolé et celle de l'ensemble des sinistres d'une même année. Un cumul de cas peut donc épuiser la garantie." },

    { id: 'm3c5x11', chap: 'c5', type: 'single',
      q: "Un administrateur est recherché personnellement pour une décision de gestion ayant appauvri la société. Quelle couverture ?",
      choices: ["La RC exploitation", "La D&O", "La RC produits", "La protection juridique circulation"],
      answer: [1],
      explain: "La responsabilité des organes est personnelle et porte sur leur patrimoine privé : c'est exactement le risque que couvre l'assurance D&O." },

    { id: 'm3c5x12', chap: 'c5', type: 'single',
      q: "Un artisan endommage l'installation sur laquelle il travaille. Ce dommage est-il couvert par sa RC exploitation ?",
      choices: ["Oui, systématiquement", "Souvent exclu ou limité : il s'agit des dommages à l'objet du travail, qui exigent une extension", "Oui, sans limite", "Non, il relève de la RC privée"],
      answer: [1],
      explain: "Les dommages « à l'objet travaillé » sont une exclusion classique : ils relèvent de la qualité de la prestation, non d'un dommage causé à un tiers extérieur." },

    { id: 'm3c5x13', chap: 'c5', type: 'multi',
      q: "Quelles professions ont particulièrement besoin d'une RC professionnelle ?",
      choices: ["Fiduciaires et comptables", "Architectes et ingénieurs", "Médecins", "Intermédiaires d'assurance non liés", "Détaillants alimentaires"],
      answer: [0, 1, 2, 3],
      explain: "Un détaillant relève surtout de la RC exploitation et produits : son risque principal n'est pas le conseil mais le dommage matériel ou corporel." },

    /* ================= c6 — Choses entreprises ================= */
    { id: 'm3c6x01', chap: 'c6', type: 'single',
      q: "Un opérateur laisse tomber un outil dans une presse, qui est détruite. Quelle assurance intervient ?",
      choices: ["L'assurance incendie", "L'assurance bris de machines", "La RC exploitation", "La perte d'exploitation seule"],
      answer: [1],
      explain: "Corps étranger, erreur de manipulation, court-circuit : autant d'événements soudains et imprévus que l'incendie ne couvre pas et que le bris de machines prend en charge." },

    { id: 'm3c6x02', chap: 'c6', type: 'single',
      q: "Une entreprise perd trois mois de production après un incendie couvert. Quelle assurance compense la marge perdue ?",
      choices: ["L'assurance incendie", "La perte d'exploitation", "La RC exploitation", "L'assurance transport"],
      answer: [1],
      explain: "L'assurance de choses reconstruit le bien ; la perte d'exploitation compense le résultat que l'entreprise aurait dégagé pendant l'arrêt." },

    { id: 'm3c6x03', chap: 'c6', type: 'single',
      q: "Une entreprise voit ses ventes chuter à cause d'une crise économique. La perte d'exploitation intervient-elle ?",
      choices: ["Oui, c'est son objet", "Non : elle exige un dommage matériel couvert à l'origine de l'interruption", "Oui, à 50 %", "Oui, si le contrat a plus de trois ans"],
      answer: [1],
      explain: "C'est la limite fondamentale de cette couverture : sans sinistre matériel préalable assuré, aucune prestation, quelle que soit la réalité de la perte." },

    { id: 'm3c6x04', chap: 'c6', type: 'single',
      q: "Que couvre l'extension « carence fournisseur » ?",
      choices: ["Le retard de paiement d'un client", "L'interruption de l'activité due à un sinistre survenu chez un fournisseur", "La faillite de l'entreprise", "Le vol de marchandises"],
      answer: [1],
      explain: "Un incendie chez un fournisseur unique peut paralyser une usine sans qu'aucun dommage matériel ne l'ait touchée : d'où cette extension." },

    { id: 'm3c6x05', chap: 'c6', type: 'single',
      q: "La période d'indemnisation d'une perte d'exploitation correspond :",
      choices: ["À la durée du contrat", "À la durée convenue pendant laquelle l'assureur indemnise, souvent 12 à 24 mois", "À un mois maximum", "À la durée des travaux de reconstruction, sans limite"],
      answer: [1],
      explain: "Elle doit être calibrée sur le temps réel de reconstruction et de reconquête du marché : trop courte, elle laisse l'entreprise sans ressources à la reprise." },

    { id: 'm3c6x06', chap: 'c6', type: 'single',
      q: "Une entreprise sous-estime sa marge brute annuelle dans le calcul de la somme d'assurance. Conséquence ?",
      choices: ["Aucune", "Une réduction proportionnelle de l'indemnité, comme en sous-assurance de choses", "Une majoration de prime rétroactive", "La nullité du contrat"],
      answer: [1],
      explain: "Le principe est identique à celui de l'assurance de choses : la somme doit refléter la valeur réelle, sous peine de règle proportionnelle." },

    { id: 'm3c6x07', chap: 'c6', type: 'single',
      q: "Quelle assurance protège un ouvrage pendant sa construction ?",
      choices: ["L'assurance travaux de construction", "L'assurance bris de machines", "La perte d'exploitation", "La D&O"],
      answer: [0],
      explain: "Elle couvre les dommages matériels à l'ouvrage en cours de réalisation, souvent complétée par une RC du maître d'ouvrage pour les tiers et voisins." },

    { id: 'm3c6x08', chap: 'c6', type: 'multi',
      q: "Quelles valeurs faut-il recenser lors de l'analyse des besoins d'une PME industrielle ?",
      choices: ["Bâtiment et aménagements", "Machines et installations", "Marchandises et stocks", "Données et systèmes informatiques", "Le carnet d'adresses privé du dirigeant"],
      answer: [0, 1, 2, 3],
      explain: "L'inventaire des valeurs doit couvrir tout ce dont l'arrêt ou la destruction menacerait l'exploitation, y compris les actifs immatériels comme les données." },

    { id: 'm3c6x09', chap: 'c6', type: 'single',
      q: "Une palette de marchandises est volée pendant son transport routier. Quelle assurance répond directement au propriétaire ?",
      choices: ["La RC du transporteur uniquement", "L'assurance transport de marchandises", "La perte d'exploitation", "L'assurance bâtiment"],
      answer: [1],
      explain: "La RC du transporteur est souvent plafonnée par le droit du transport : l'assurance transport indemnise le propriétaire indépendamment de cette responsabilité." },

    { id: 'm3c6x10', chap: 'c6', type: 'single',
      q: "L'assurance informatique / électronique d'une entreprise couvre notamment :",
      choices: ["Uniquement le matériel", "Le matériel, mais aussi les données et les frais de reconstitution", "Les salaires du personnel informatique", "Les licences logicielles annuelles"],
      answer: [1],
      explain: "La reconstitution des données représente souvent un coût supérieur au remplacement du matériel : elle doit être expressément assurée." },

    { id: 'm3c6x11', chap: 'c6', type: 'single',
      q: "Pourquoi estimer le sinistre maximal possible d'une entreprise ?",
      choices: ["Pour calculer le droit de timbre", "Pour dimensionner les sommes d'assurance et la période d'indemnisation", "Pour fixer le salaire du dirigeant", "Pour choisir la forme juridique"],
      answer: [1],
      explain: "Le SMP correspond au scénario le plus défavorable : il détermine la capacité nécessaire, la structure de réassurance et le niveau de couverture à recommander." },

    { id: 'm3c6x12', chap: 'c6', type: 'multi',
      q: "Quelles obligations légales d'assurance une PME employant du personnel doit-elle respecter ?",
      choices: ["Assurance-accidents LAA", "Prévoyance professionnelle LPP", "RC des véhicules d'entreprise", "Assurance perte d'exploitation", "Assurance protection juridique"],
      answer: [0, 1, 2],
      explain: "Perte d'exploitation et protection juridique sont utiles mais facultatives ; LAA, LPP et RC véhicule sont imposées par la loi." },

    /* ================= c7 — PJ, cyber, crédit ================= */
    { id: 'm3c7x01', chap: 'c7', type: 'single',
      q: "Un assuré souhaite attaquer une décision dont l'issue est manifestement sans espoir. Que peut faire l'assureur de protection juridique ?",
      choices: ["Il doit financer la procédure", "Il peut refuser la prise en charge, la démarche étant dépourvue de chances de succès", "Il doit résilier le contrat", "Il doit saisir l'Ombudsman"],
      answer: [1],
      explain: "L'assureur n'a pas à financer une procédure vouée à l'échec ; en cas de désaccord, les conditions prévoient généralement une procédure d'arbitrage ou un second avis." },

    { id: 'm3c7x02', chap: 'c7', type: 'single',
      q: "Quand le libre choix de l'avocat est-il garanti en protection juridique ?",
      choices: ["Jamais", "Dans les cas prévus, notamment en cas de procédure judiciaire ou de conflit d'intérêts", "Uniquement pour les entreprises", "Uniquement au-delà de CHF 100 000.–"],
      answer: [1],
      explain: "En dehors de ces situations, l'assureur traite lui-même le dossier par son service juridique, ce qui explique le coût modéré de la couverture." },

    { id: 'm3c7x03', chap: 'c7', type: 'single',
      q: "Un délai de carence en protection juridique sert à :",
      choices: ["Réduire la prime", "Empêcher de souscrire une couverture alors qu'un litige est déjà prévisible", "Allonger la durée du contrat", "Fixer la franchise"],
      answer: [1],
      explain: "Sans ce délai, chacun souscrirait la veille d'un procès : l'antisélection rendrait la branche inassurable." },

    { id: 'm3c7x04', chap: 'c7', type: 'single',
      q: "Une PME subit un rançongiciel : systèmes chiffrés, activité arrêtée cinq jours. Quels postes une cyber couvre-t-elle typiquement ?",
      choices: ["Uniquement la rançon", "L'analyse forensique, la restauration, la perte d'exploitation cyber et l'assistance de crise", "Uniquement le matériel détruit", "Rien, le risque est inassurable"],
      answer: [1],
      explain: "La cyber est conçue pour l'ensemble de la chaîne : comprendre l'attaque, remettre en marche, compenser la perte et gérer la communication." },

    { id: 'm3c7x05', chap: 'c7', type: 'single',
      q: "Des données personnelles de clients sont dérobées lors d'une cyberattaque. Quel volet de la couverture cyber est concerné ?",
      choices: ["Les frais propres uniquement", "Le volet responsabilité envers les tiers", "L'assurance de choses", "La D&O uniquement"],
      answer: [1],
      explain: "Les personnes dont les données ont été compromises sont des tiers lésés : leurs prétentions relèvent du volet responsabilité, distinct des frais propres." },

    { id: 'm3c7x06', chap: 'c7', type: 'multi',
      q: "Quels éléments un questionnaire cyber examine-t-il avant la souscription ?",
      choices: ["L'existence de sauvegardes régulières et testées", "L'authentification à plusieurs facteurs", "La politique de mises à jour", "La sensibilisation du personnel", "Le chiffre d'affaires du dirigeant à titre privé"],
      answer: [0, 1, 2, 3],
      explain: "Ces mesures changent radicalement la probabilité et l'ampleur du sinistre : elles conditionnent l'acceptation du risque et le niveau de prime." },

    { id: 'm3c7x07', chap: 'c7', type: 'single',
      q: "Un fournisseur livre à crédit et craint l'insolvabilité de ses clients. Quelle solution proposer ?",
      choices: ["Une assurance-crédit", "Une protection juridique", "Une assurance transport", "Une D&O"],
      answer: [0],
      explain: "L'assurance-crédit indemnise les créances impayées en cas d'insolvabilité et apporte en outre un service de surveillance de la solvabilité des acheteurs." },

    { id: 'm3c7x08', chap: 'c7', type: 'single',
      q: "Une garantie de bonne exécution émise par un assureur profite :",
      choices: ["À l'entreprise garantie", "Au maître d'ouvrage bénéficiaire", "À l'assureur lui-même", "Aux employés"],
      answer: [1],
      explain: "C'est le bénéficiaire qui peut appeler la garantie ; l'assureur qui paie se retourne ensuite contre son client, à la différence d'une assurance classique." },

    { id: 'm3c7x09', chap: 'c7', type: 'multi',
      q: "Quelles prestations une assurance voyage propose-t-elle usuellement ?",
      choices: ["Frais d'annulation", "Assistance et rapatriement", "Bagages", "Interruption de voyage", "Réparation du véhicule au garage habituel"],
      answer: [0, 1, 2, 3],
      explain: "L'entretien courant du véhicule relève du propriétaire ; le dépannage en voyage fait en revanche partie des prestations d'assistance." },

    { id: 'm3c7x10', chap: 'c7', type: 'single',
      q: "Une collection d'art doit être assurée. Quelle approche est adaptée ?",
      choices: ["L'inclure dans la somme ménage globale", "Une couverture séparée tous risques, sur liste et avec estimation", "Une RC privée renforcée", "Une protection juridique"],
      answer: [1],
      explain: "Les sous-limites du contrat ménage sont très inférieures à la valeur de telles pièces : seule une police dédiée, fondée sur une expertise, protège réellement." },

    /* ================= c8 — Souscription et sinistres ================= */
    { id: 'm3c8x01', chap: 'c8', type: 'single',
      q: "Un souscripteur constate une sinistralité passée très défavorable. Quelle décision est proportionnée avant un refus pur et simple ?",
      choices: ["Accepter sans condition", "Accepter avec surprime, franchise majorée ou obligations de prévention", "Résilier tous les contrats du client", "Signaler le client à la FINMA"],
      answer: [1],
      explain: "La souscription dispose d'une palette de mesures : adapter le prix, la participation de l'assuré ou exiger des mesures de protection, avant d'en venir au refus." },

    { id: 'm3c8x02', chap: 'c8', type: 'single',
      q: "Valeur CHF 500 000.–, somme assurée CHF 400 000.–, dommage CHF 50 000.–, franchise CHF 2 000.–. Indemnité ?",
      choices: ["CHF 48 000.–", "CHF 38 000.–", "CHF 40 000.–", "CHF 36 000.–"],
      answer: [1],
      explain: "Proportionnelle d'abord : 50 000 × (400 000/500 000) = CHF 40 000.–. Puis la franchise : 40 000 − 2 000 = CHF 38 000.–." },

    { id: 'm3c8x03', chap: 'c8', type: 'single',
      q: "Un sinistre survient alors que la couverture était suspendue pour non-paiement, mais le client règle la prime le lendemain. Quelle est l'issue ?",
      choices: ["Le sinistre est couvert", "Le sinistre n'est pas couvert : la reprise n'a pas d'effet rétroactif", "Le sinistre est couvert à moitié", "Le contrat est nul"],
      answer: [1],
      explain: "C'est la première question de la trame de traitement : le contrat était-il en vigueur ? Ici la garantie était suspendue au moment de l'événement." },

    { id: 'm3c8x04', chap: 'c8', type: 'multi',
      q: "Quelles étapes composent la trame de traitement d'un sinistre non-vie ?",
      choices: ["Vérifier la validité du contrat et de la couverture", "Contrôler le respect des obligations de l'assuré", "Apprécier une éventuelle faute grave", "Calculer l'indemnité", "Fixer la prime de l'année suivante"],
      answer: [0, 1, 2, 3],
      explain: "La tarification future est une décision de souscription distincte : elle n'entre pas dans le traitement du cas lui-même, qui se termine par l'examen du recours." },

    { id: 'm3c8x05', chap: 'c8', type: 'single',
      q: "Un tiers identifié est responsable du sinistre indemnisé. Quelle est la dernière étape du traitement ?",
      choices: ["Résilier le contrat", "Examiner le recours par subrogation contre le responsable", "Augmenter la franchise", "Informer la FINMA"],
      answer: [1],
      explain: "L'assureur reprend les droits de l'assuré à concurrence de sa prestation : c'est ce qui fait supporter la charge finale au responsable." },

    { id: 'm3c8x06', chap: 'c8', type: 'single',
      q: "L'assuré a déclaré des objets qu'il ne possédait pas. Quelle est la conséquence sur l'ensemble du sinistre ?",
      choices: ["Seule la part fictive est écartée", "Il perd tout droit aux prestations pour ce sinistre", "L'indemnité est réduite de 20 %", "Une simple mise en garde"],
      answer: [1],
      explain: "La prétention frauduleuse de l'art. 40 LCA entraîne la perte intégrale du droit, y compris pour la part honnête, et permet la résiliation du contrat." },

    { id: 'm3c8x07', chap: 'c8', type: 'single',
      q: "Quel est l'effet d'une clause de renonciation à la sous-assurance dans le calcul d'un sinistre ?",
      choices: ["Elle supprime la franchise", "Elle écarte la règle proportionnelle, l'indemnité étant versée jusqu'au plafond convenu", "Elle double la somme d'assurance", "Elle réduit la prime de moitié"],
      answer: [1],
      explain: "L'assureur renonce à comparer somme et valeur : très fréquent en assurance au premier risque et pour les frais annexes comme le déblaiement." },

    { id: 'm3c8x08', chap: 'c8', type: 'single',
      q: "Une entreprise déclare un sinistre 4 mois après l'avoir constaté, sans que cela nuise à l'instruction. L'assureur peut-il réduire ?",
      choices: ["Oui, automatiquement", "Non, si la violation n'a eu aucune influence sur la survenance ou l'étendue du sinistre", "Oui, de moitié", "Oui, il peut refuser toute prestation"],
      answer: [1],
      explain: "L'art. 45 LCA subordonne la sanction à une faute et à une influence effective : un retard sans conséquence ne justifie aucune réduction." },

    { id: 'm3c8x09', chap: 'c8', type: 'multi',
      q: "Quels documents étayent utilement un dossier de sinistre non-vie ?",
      choices: ["Photos des dommages", "Factures et justificatifs d'achat", "Rapport de police en cas de vol", "Devis de réparation", "Relevé du compte de prévoyance"],
      answer: [0, 1, 2, 3],
      explain: "Le compte de prévoyance n'a aucun rapport avec un sinistre de choses : les pièces utiles sont celles qui établissent l'existence, la valeur et l'ampleur du dommage." },

    { id: 'm3c8x10', chap: 'c8', type: 'single',
      q: "Un souscripteur exige l'installation d'un système d'alarme comme condition d'acceptation. De quoi s'agit-il ?",
      choices: ["D'une exclusion", "D'une obligation de prévention imposée par le contrat", "D'une franchise", "D'une surprime"],
      answer: [1],
      explain: "Sa violation peut entraîner une réduction de la prestation si elle a influé sur le sinistre : c'est une obligation contractuelle, non une exclusion de couverture." },

    { id: 'm3c8x11', chap: 'c8', type: 'single',
      q: "Le dommage est estimé à CHF 30 000.– mais la somme d'assurance n'est que de CHF 25 000.–, la valeur étant de CHF 25 000.–. Quelle indemnité, sans franchise ?",
      choices: ["CHF 30 000.–", "CHF 25 000.–", "CHF 20 833.–", "CHF 12 500.–"],
      answer: [1],
      explain: "Il n'y a pas de sous-assurance puisque somme et valeur coïncident ; l'indemnité est plafonnée à la somme d'assurance, soit CHF 25 000.–." },

    { id: 'm3c8x12', chap: 'c8', type: 'single',
      q: "Dans un traitement de cas guidé, après avoir établi que le risque est couvert, quelle question vient ensuite ?",
      choices: ["Le montant de la prime", "Le respect des obligations de l'assuré et l'existence d'une faute", "Le nom du courtier", "La forme juridique de l'entreprise"],
      answer: [1],
      explain: "L'ordre logique est : couverture, puis obligations et faute, puis calcul de l'indemnité, puis recours éventuel contre un tiers responsable." }
  ]);
})();
