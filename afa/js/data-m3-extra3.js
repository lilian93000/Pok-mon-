/* =============================================================
   AFA – Module 3, complément : cas pratiques et calculs non-vie
   Beaucoup de ces questions sont marquées lvl:'hard' : elles
   reproduisent la logique du traitement de cas guidé de
   l'épreuve écrite non-vie.
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m3', [
    /* ---------- c1 : ménage ---------- */
    { id: 'm3c1h01', chap: 'c1', type: 'single', lvl: 'hard',
      q: "Inventaire valant CHF 160 000.–, assuré pour CHF 100 000.–. Incendie : dommage de CHF 24 000.–, franchise CHF 500.–. Indemnité versée ?",
      choices: ["CHF 23 500.–", "CHF 15 000.–", "CHF 14 500.–", "CHF 12 000.–"],
      answer: [2],
      explain: "Proportionnelle : 24 000 × (100 000/160 000) = CHF 15 000.–. Puis franchise : 15 000 − 500 = CHF 14 500.–. L'ordre est impératif." },

    { id: 'm3c1h02', chap: 'c1', type: 'single', lvl: 'hard',
      q: "Même situation, mais le contrat comporte une garantie contre la sous-assurance car la somme suit le barème de l'assureur. Indemnité ?",
      choices: ["CHF 23 500.–", "CHF 14 500.–", "CHF 15 000.–", "CHF 24 000.–"],
      answer: [0],
      explain: "La garantie écarte la règle proportionnelle : le dommage est indemnisé intégralement, sous la seule déduction de la franchise, soit CHF 23 500.–." },

    { id: 'm3c1x16', chap: 'c1', type: 'single',
      q: "Un dégât d'eau abîme le parquet du logement loué et le mobilier du locataire. Quels contrats interviennent ?",
      choices: ["Le ménage pour tout", "Le ménage pour le mobilier, la RC privée pour le parquet du bailleur", "La RC privée pour tout", "L'assurance bâtiment pour tout"],
      answer: [1],
      explain: "Chacun assure ce qui lui appartient : le mobilier du locataire relève de son ménage, le parquet appartient au bailleur et engage la responsabilité du locataire." },

    { id: 'm3c1x17', chap: 'c1', type: 'multi',
      q: "Quelles précautions conditionnent la couverture du vol simple à l'extérieur ?",
      choices: ["Ne pas laisser les objets sans surveillance", "Utiliser les moyens de fermeture disponibles", "Respecter les sous-limites déclarées", "Déclarer le vol à la police", "Assurer le véhicule en casco complète"],
      answer: [0, 1, 2, 3],
      explain: "La casco du véhicule est sans rapport. Les exigences de diligence sont au cœur de cette couverture, souvent source de litiges." },

    { id: 'm3c1x18', chap: 'c1', type: 'single',
      q: "Un client augmente fortement la valeur de son inventaire après un héritage. Que faut-il faire ?",
      choices: ["Rien avant l'échéance annuelle", "Adapter sans délai la somme d'assurance pour éviter la sous-assurance", "Résilier et souscrire ailleurs", "Augmenter la franchise"],
      answer: [1],
      explain: "La sous-assurance s'apprécie au moment du sinistre : attendre l'échéance expose le client à une réduction proportionnelle sur tout dommage survenu entre-temps." },

    /* ---------- c2 : bâtiment ---------- */
    { id: 'm3c2h01', chap: 'c2', type: 'single', lvl: 'hard',
      q: "Un immeuble situé dans le canton de Vaud subit un incendie, puis un dégât d'eau distinct dû à une conduite rompue. Qui intervient pour chaque sinistre ?",
      choices: ["L'ECA pour les deux", "L'ECA pour l'incendie, un assureur privé pour le dégât d'eau", "Un assureur privé pour les deux", "La commune pour les deux"],
      answer: [1],
      explain: "Vaud connaît un établissement cantonal : le monopole porte sur l'incendie et les dommages naturels. Les dégâts d'eau restent au marché privé." },

    { id: 'm3c2x13', chap: 'c2', type: 'single',
      q: "Une tempête arrache des tuiles et la pluie détruit ensuite le mobilier du propriétaire. Quels contrats interviennent ?",
      choices: ["Uniquement l'assurance bâtiment", "Le bâtiment pour la toiture, le ménage pour le mobilier", "Uniquement le ménage", "La RC privée"],
      answer: [1],
      explain: "Le dommage naturel touche le bâtiment ; les biens mobiliers relèvent du contrat ménage du propriétaire occupant." },

    { id: 'm3c2x14', chap: 'c2', type: 'single',
      q: "Un propriétaire construit une extension sans l'annoncer à son assureur. Quel est le risque principal ?",
      choices: ["Une amende de la FINMA", "Une sous-assurance du bâtiment lors d'un sinistre", "La nullité du contrat", "Le retrait du permis de construire"],
      answer: [1],
      explain: "La valeur assurée ne correspond plus à la valeur de reconstruction : la règle proportionnelle s'appliquera au moment du sinistre." },

    { id: 'm3c2x15', chap: 'c2', type: 'multi',
      q: "Quels dommages relèvent typiquement de l'assurance dégâts d'eau du bâtiment ?",
      choices: ["Rupture d'une conduite encastrée", "Refoulement des canalisations", "Fuite du système de chauffage", "Infiltration due à une toiture non entretenue", "Débordement d'une baignoire"],
      answer: [0, 1, 2, 4],
      explain: "Le défaut d'entretien est exclu : l'assurance couvre les événements soudains et imprévus, non la dégradation prévisible." },

    /* ---------- c3 : véhicules ---------- */
    { id: 'm3c3h01', chap: 'c3', type: 'single', lvl: 'hard',
      q: "Un conducteur en état d'ébriété qualifiée blesse un piéton (CHF 200 000.–) et détruit sa propre voiture (CHF 30 000.–), assurée en casco complète. Que se passe-t-il ?",
      choices: ["Rien n'est payé", "Le piéton est indemnisé intégralement par la RC avec recours contre l'assuré ; la casco peut réduire sa prestation pour faute grave", "La RC réduit l'indemnité du piéton de moitié", "La casco paie intégralement, la RC rien"],
      answer: [1],
      explain: "Deux régimes coexistent : la protection du lésé est absolue en RC obligatoire, tandis que la casco, assurance de choses de l'assuré lui-même, peut réduire pour faute grave." },

    { id: 'm3c3h02', chap: 'c3', type: 'single', lvl: 'hard',
      q: "Un véhicule de 3 ans, valeur vénale CHF 18 000.–, est volé. Franchise casco partielle CHF 1 000.–. Aucune clause de valeur à neuf ne s'applique encore. Indemnité ?",
      choices: ["CHF 18 000.–", "CHF 17 000.–", "CHF 19 000.–", "Rien, le vol n'est pas couvert"],
      answer: [1],
      explain: "Le vol relève de la casco partielle ; l'indemnisation se fait à la valeur vénale, sous déduction de la franchise : 18 000 − 1 000 = CHF 17 000.–." },

    { id: 'm3c3x13', chap: 'c3', type: 'single',
      q: "Un conducteur emboutit le véhicule d'un tiers par sa faute. Quels contrats interviennent et pour quoi ?",
      choices: ["La RC pour le véhicule du tiers, la casco complète pour le sien", "La casco pour les deux", "La RC pour les deux", "Aucun"],
      answer: [0],
      explain: "La RC répare le dommage causé au tiers ; le dommage à son propre véhicule n'est couvert que s'il a souscrit la casco complète." },

    { id: 'm3c3x14', chap: 'c3', type: 'single',
      q: "Une remorque tractée cause un dommage à un tiers. Qui répond ?",
      choices: ["Personne", "Le détenteur du véhicule tracteur, dont la RC s'étend en principe à la remorque", "Le fabricant de la remorque", "Le passager"],
      answer: [1],
      explain: "L'ensemble tracteur-remorque forme une unité au sens de la responsabilité du détenteur ; il convient toutefois de vérifier la déclaration de la remorque au contrat." },

    { id: 'm3c3x15', chap: 'c3', type: 'multi',
      q: "Quels éléments influencent la prime d'une assurance véhicule ?",
      choices: ["Le degré de bonus-malus", "La puissance et le type de véhicule", "Le kilométrage annuel", "La franchise choisie", "La couleur de la carrosserie"],
      answer: [0, 1, 2, 3],
      explain: "La tarification repose sur des critères objectivement corrélés au risque ; la couleur n'en fait pas partie." },

    { id: 'm3c3x16', chap: 'c3', type: 'single',
      q: "Un client prête sa voiture à un ami qui cause un accident. La RC couvre-t-elle le lésé ?",
      choices: ["Non, seul le détenteur est couvert", "Oui, la RC suit le véhicule et couvre les conducteurs autorisés", "Oui, mais avec une franchise doublée", "Non, il faut une déclaration préalable"],
      answer: [1],
      explain: "La RC véhicule est attachée au véhicule et protège le lésé quel que soit le conducteur autorisé ; un recours reste possible en cas de faute grave." },

    /* ---------- c4 : RC privée ---------- */
    { id: 'm3c4h01', chap: 'c4', type: 'single', lvl: 'hard',
      q: "Un assuré, en jouant au football entre amis, blesse gravement un joueur qui subit une incapacité durable. La RC privée est-elle engagée ?",
      choices: ["Toujours, dès qu'il y a blessure", "Seulement si une faute est établie, le risque inhérent au jeu étant accepté par les participants", "Jamais, le sport est exclu", "Uniquement si le match est officiel"],
      answer: [1],
      explain: "Le consentement aux risques normaux du jeu écarte l'illicéité pour ceux-ci ; une faute caractérisée, comme un tacle d'une brutalité anormale, engage en revanche la responsabilité." },

    { id: 'm3c4x13', chap: 'c4', type: 'single',
      q: "Un assuré cause un dommage de CHF 3 millions à un tiers. Sa RC privée est plafonnée à CHF 5 millions. Que se passe-t-il ?",
      choices: ["L'assuré paie la différence", "Le dommage est couvert, le plafond n'étant pas atteint", "L'assureur paie CHF 5 millions", "La couverture est nulle"],
      answer: [1],
      explain: "La somme de garantie est un plafond, non un montant versé : l'assureur indemnise le dommage réel tant qu'il reste dans la limite convenue." },

    { id: 'm3c4x14', chap: 'c4', type: 'single',
      q: "Un assuré, employé, casse une machine de son employeur. Sa RC privée intervient-elle ?",
      choices: ["Oui, l'employeur est un tiers", "Non en principe : le dommage survient dans le cadre professionnel, exclu de la RC privée", "Oui, à 50 %", "Oui, si l'employeur porte plainte"],
      answer: [1],
      explain: "L'exclusion de l'activité professionnelle s'applique ; certaines polices prévoient toutefois une couverture limitée pour les biens confiés par l'employeur." },

    { id: 'm3c4x15', chap: 'c4', type: 'multi',
      q: "Quelles prétentions la RC privée prend-elle en charge ?",
      choices: ["Frais médicaux du lésé", "Perte de gain du lésé", "Réparation des biens endommagés du tiers", "Tort moral dû au lésé", "Amende infligée à l'assuré"],
      answer: [0, 1, 2, 3],
      explain: "Les sanctions pénales sont personnelles et jamais assurables ; tous les autres postes composent le dommage réparable du lésé." },

    /* ---------- c5 : RC entreprise ---------- */
    { id: 'm3c5h01', chap: 'c5', type: 'single', lvl: 'hard',
      q: "Un fabricant découvre un défaut sur un lot déjà livré. Aucun dommage n'est encore survenu. Quelle couverture peut financer le rappel ?",
      choices: ["La RC produits de base", "L'extension frais de retrait et de rappel", "La perte d'exploitation", "Aucune, il faut attendre un dommage"],
      answer: [1],
      explain: "Sans dommage à un tiers, la RC produits ne s'applique pas encore. Seule l'extension rappel finance l'action préventive, généralement dans une limite propre." },

    { id: 'm3c5h02', chap: 'c5', type: 'single', lvl: 'hard',
      q: "Un architecte cesse son activité en 2026. En 2029, un client lui reproche une erreur commise en 2024. Le contrat était en base claims made sans couverture subséquente. Quelle est la situation ?",
      choices: ["La réclamation est couverte car la faute date de 2024", "La réclamation n'est pas couverte, aucun contrat n'étant en vigueur au moment où elle est formulée", "Elle est couverte à 50 %", "La FINMA prend en charge"],
      answer: [1],
      explain: "C'est tout le danger du claims made : sans couverture subséquente, la fin du contrat ferme la porte aux réclamations tardives, même pour des faits couverts à l'époque." },

    { id: 'm3c5x14', chap: 'c5', type: 'single',
      q: "Une entreprise loue des locaux et provoque un incendie qui les détruit. Quelle couverture répond envers le bailleur ?",
      choices: ["L'assurance de choses de l'entreprise", "La RC exploitation, couverture des dommages à la chose louée", "La perte d'exploitation", "La D&O"],
      answer: [1],
      explain: "Les locaux appartiennent à un tiers : c'est la responsabilité civile de l'entreprise locataire qui est engagée, généralement avec une sous-limite spécifique." },

    { id: 'm3c5x15', chap: 'c5', type: 'single',
      q: "Un client de l'entreprise glisse sur un sol mouillé non signalé et se blesse. Quelle base et quelle couverture ?",
      choices: ["Art. 58 LCR, RC véhicule", "Responsabilité de l'exploitant, RC exploitation", "LRFP, RC produits", "Aucune"],
      answer: [1],
      explain: "Le défaut d'organisation ou de signalisation engage l'exploitant envers ses visiteurs : c'est le risque type de la RC exploitation." },

    { id: 'm3c5x16', chap: 'c5', type: 'multi',
      q: "Quels points doivent figurer dans l'analyse RC d'une entreprise de construction ?",
      choices: ["RC exploitation, y compris travaux chez des tiers", "Dommages aux conduites souterraines", "RC du maître d'ouvrage", "Dommages à l'objet du travail", "Assurance-vie du personnel"],
      answer: [0, 1, 2, 3],
      explain: "L'assurance-vie relève de la prévoyance. Les conduites souterraines et l'objet du travail sont deux extensions cruciales dans la construction." },

    /* ---------- c6 : choses entreprises ---------- */
    { id: 'm3c6h01', chap: 'c6', type: 'single', lvl: 'hard',
      q: "Marge brute annuelle CHF 1 200 000.–, somme assurée en perte d'exploitation CHF 900 000.–. Interruption entraînant une perte de CHF 300 000.–. Indemnité, sans franchise ?",
      choices: ["CHF 300 000.–", "CHF 225 000.–", "CHF 900 000.–", "CHF 240 000.–"],
      answer: [1],
      explain: "Sous-assurance : 900 000 / 1 200 000 = 75 %. L'indemnité est réduite dans la même proportion : 300 000 × 75 % = CHF 225 000.–." },

    { id: 'm3c6h02', chap: 'c6', type: 'single', lvl: 'hard',
      q: "Un incendie détruit un entrepôt. L'entreprise redémarre en 14 mois, mais la période d'indemnisation convenue est de 12 mois. Quelle conséquence ?",
      choices: ["L'assureur indemnise les 14 mois", "L'assureur n'indemnise que 12 mois, les 2 derniers restant à charge de l'entreprise", "Le contrat est nul", "L'assureur double la somme"],
      answer: [1],
      explain: "La période d'indemnisation est une limite ferme : d'où l'importance de la calibrer sur le temps réel de reconstruction, souvent sous-estimé." },

    { id: 'm3c6x13', chap: 'c6', type: 'single',
      q: "Un vol de marchandises est commis dans l'entrepôt d'une entreprise, sans effraction, par un employé. Quelle couverture est envisageable ?",
      choices: ["L'assurance vol par effraction ordinaire", "Une couverture spécifique « détournement / infidélité »", "La RC exploitation", "La perte d'exploitation"],
      answer: [1],
      explain: "Sans effraction et commis par une personne de l'entreprise, l'événement échappe à la couverture vol classique : il exige une garantie infidélité dédiée." },

    { id: 'm3c6x14', chap: 'c6', type: 'single',
      q: "Une machine neuve tombe en panne à cause d'un défaut de fabrication, pendant la garantie du fournisseur. Que couvre le bris de machines ?",
      choices: ["Tout, sans restriction", "En principe rien pour la part relevant de la garantie du fournisseur", "Uniquement la perte d'exploitation", "Uniquement la RC"],
      answer: [1],
      explain: "L'assurance n'a pas vocation à se substituer à la garantie contractuelle du vendeur : ces dommages sont généralement exclus tant que la garantie joue." },

    { id: 'm3c6x15', chap: 'c6', type: 'multi',
      q: "Quels risques une entreprise de production alimentaire doit-elle particulièrement examiner ?",
      choices: ["RC produits et frais de rappel", "Bris de machines et perte d'exploitation", "Détérioration de marchandises réfrigérées", "Cyber, en cas de pilotage informatisé", "Assurance grêle sur les bâtiments voisins"],
      answer: [0, 1, 2, 3],
      explain: "On assure ses propres risques, pas ceux du voisin. Les quatre premiers postes constituent le cœur d'un programme agroalimentaire." },

    /* ---------- c7 : PJ, cyber ---------- */
    { id: 'm3c7h01', chap: 'c7', type: 'single', lvl: 'hard',
      q: "Une PME est victime d'un rançongiciel. Elle n'avait pas de sauvegarde hors ligne, contrairement à ce qu'elle avait déclaré dans le questionnaire de souscription. Quelle est la conséquence probable ?",
      choices: ["Aucune, la couverture joue normalement", "Une possible réticence : l'assureur peut résilier et refuser la prestation si le fait tu a influé sur le sinistre", "Une simple majoration de prime", "Le contrat est automatiquement prolongé"],
      answer: [1],
      explain: "La déclaration inexacte porte sur un fait sur lequel l'assureur avait posé une question précise, et l'absence de sauvegarde a directement aggravé le sinistre : les deux conditions de la réticence sont réunies." },

    { id: 'm3c7x11', chap: 'c7', type: 'single',
      q: "Un assuré consulte un avocat avant d'annoncer le cas à sa protection juridique. Quel est le risque ?",
      choices: ["Aucun", "Les frais engagés sans accord préalable peuvent ne pas être remboursés", "Le contrat est résilié", "La franchise double"],
      answer: [1],
      explain: "Les conditions exigent en règle générale l'annonce préalable et l'accord de l'assureur : c'est une obligation contractuelle dont la violation peut coûter cher." },

    { id: 'm3c7x12', chap: 'c7', type: 'single',
      q: "Une protection juridique entreprise couvre typiquement :",
      choices: ["Les litiges de droit du travail avec les employés", "Les amendes fiscales", "Le paiement des salaires", "Les dettes fournisseurs"],
      answer: [0],
      explain: "Droit du travail, contrats et recouvrement forment le cœur de la protection juridique entreprise ; les dettes et amendes ne sont pas assurables." },

    { id: 'm3c7x13', chap: 'c7', type: 'multi',
      q: "Quels postes une cyber couvre-t-elle au titre des frais propres ?",
      choices: ["Analyse forensique", "Restauration des données et des systèmes", "Communication de crise", "Perte d'exploitation d'origine cyber", "Indemnisation des clients lésés"],
      answer: [0, 1, 2, 3],
      explain: "L'indemnisation des tiers lésés relève du volet responsabilité, distinct des frais propres engagés par l'entreprise pour se rétablir." },

    { id: 'm3c7x14', chap: 'c7', type: 'single',
      q: "Une entreprise craint l'insolvabilité d'un gros client à l'export. Quelle combinaison est pertinente ?",
      choices: ["Assurance-crédit, éventuellement avec couverture du risque politique", "Protection juridique circulation", "Bris de machines", "D&O"],
      answer: [0],
      explain: "À l'export s'ajoute le risque pays : les assureurs-crédit et les organismes publics d'assurance à l'exportation proposent ces couvertures combinées." },

    /* ---------- c8 : sinistres ---------- */
    { id: 'm3c8h01', chap: 'c8', type: 'single', lvl: 'hard',
      q: "Sinistre incendie chez un commerçant : marchandises détruites pour CHF 90 000.–, valeur totale du stock CHF 300 000.–, somme assurée CHF 240 000.–, franchise CHF 5 000.–. Un tiers est responsable. Quelle indemnité, et que peut faire l'assureur ensuite ?",
      choices: ["CHF 85 000.– puis aucun recours", "CHF 67 000.– puis recours contre le tiers à concurrence de sa prestation", "CHF 90 000.– puis recours", "CHF 72 000.– sans recours"],
      answer: [1],
      explain: "Proportionnelle : 90 000 × (240 000/300 000) = CHF 72 000.–. Franchise : 72 000 − 5 000 = CHF 67 000.–. L'assureur est ensuite subrogé jusqu'à concurrence des CHF 67 000.– versés." },

    { id: 'm3c8h02', chap: 'c8', type: 'single', lvl: 'hard',
      q: "Un assuré n'a pas installé l'alarme exigée par son contrat. Un cambriolage survient, mais les voleurs sont entrés par une trappe de toit qu'aucune alarme n'aurait détectée. Quelle est l'issue ?",
      choices: ["Réduction automatique de 50 %", "Pas de sanction : la violation n'a pas influé sur la survenance du sinistre", "Refus total de prestation", "Résiliation rétroactive"],
      answer: [1],
      explain: "L'art. 45 LCA exige un lien entre la violation et le sinistre : ici l'absence d'alarme n'a eu aucune influence, la prestation est donc due en entier." },

    { id: 'm3c8x13', chap: 'c8', type: 'single',
      q: "Quel est l'ordre correct des étapes d'un traitement de cas ?",
      choices: ["Calcul, couverture, obligations, recours", "Couverture, obligations et faute, calcul, recours", "Recours, calcul, couverture", "Obligations, recours, couverture"],
      answer: [1],
      explain: "On établit d'abord si l'on doit quelque chose, puis combien, puis si l'on peut le récupérer auprès d'un responsable." },

    { id: 'm3c8x14', chap: 'c8', type: 'single',
      q: "Un expert est mandaté pour chiffrer un dommage important. Sa mission porte :",
      choices: ["Sur la question juridique de la couverture", "Sur l'établissement des faits et le montant du dommage", "Sur la fixation de la prime future", "Sur la résiliation du contrat"],
      answer: [1],
      explain: "L'expertise porte sur les faits et les chiffres ; la question de savoir si le risque est couvert reste une appréciation juridique de l'assureur, puis du juge." },

    { id: 'm3c8x15', chap: 'c8', type: 'multi',
      q: "Dans quels cas l'assureur peut-il réduire ou refuser sa prestation ?",
      choices: ["Faute grave de l'assuré", "Dessein de l'assuré", "Prétention frauduleuse", "Violation fautive d'une obligation ayant influé sur le sinistre", "Sinistre survenu un jour férié"],
      answer: [0, 1, 2, 3],
      explain: "La date du sinistre est sans effet. Les quatre autres motifs correspondent aux sanctions prévues par la LCA, du plus léger au plus radical." },

    { id: 'm3c8x16', chap: 'c8', type: 'single',
      q: "Après un sinistre indemnisé, quelles parties peuvent résilier le contrat ?",
      choices: ["Personne", "Les deux parties, sous réserve des restrictions légales propres à certaines branches", "Uniquement l'assureur", "Uniquement le preneur"],
      answer: [1],
      explain: "Le droit de résiliation après sinistre appartient aux deux parties ; en assurance-maladie complémentaire, il a été retiré à l'assureur par la révision de la LCA." },

    { id: 'm3c8x17', chap: 'c8', type: 'single',
      q: "Un client demande pourquoi sa prime augmente après deux sinistres. Quelle explication est correcte ?",
      choices: ["C'est interdit par la loi", "La tarification tient compte de la sinistralité effective, dans les limites du contrat", "C'est une sanction pénale", "C'est dû au droit de timbre"],
      answer: [1],
      explain: "Adapter le prix au risque observé est le fondement même de la tarification ; le client conserve son droit de résiliation s'il refuse la nouvelle prime." },

    { id: 'm3c8x18', chap: 'c8', type: 'multi',
      q: "Quelles informations l'intermédiaire doit-il documenter lors de la vente d'un contrat non-vie ?",
      choices: ["Les besoins identifiés du client", "Les couvertures recommandées et celles écartées", "Les avertissements donnés", "L'accord ou le refus du client sur les recommandations", "Le montant de son propre salaire"],
      answer: [0, 1, 2, 3],
      explain: "La documentation du conseil protège les deux parties en cas de litige. La rémunération de l'intermédiaire doit être transparente, mais elle n'est pas un élément de l'analyse des besoins." }
  ]);
})();
