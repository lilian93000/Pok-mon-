/* =============================================================
   AFA – Module 3, questions supplémentaires : chapitres 1 à 4
   (Ménage / Bâtiment / Véhicules / RC privée)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m3', [
    /* ================= c1 — Ménage ================= */
    { id: 'm3c1x01', chap: 'c1', type: 'single',
      q: "Le vol par effraction suppose :",
      choices: ["Une simple disparition d'objet", "L'entrée forcée dans un local fermé, avec traces", "Un vol commis à l'extérieur", "Un vol commis par un proche"],
      answer: [1],
      explain: "L'effraction implique de forcer un obstacle : c'est ce qui la distingue du vol simple, couvert seulement en option et avec une sous-limite." },

    { id: 'm3c1x02', chap: 'c1', type: 'single',
      q: "Le brigandage se caractérise par :",
      choices: ["L'usage ou la menace de violence contre une personne", "L'entrée par une fenêtre ouverte", "Un vol sans témoin", "La perte d'un objet"],
      answer: [0],
      explain: "Le brigandage est assimilé au vol par effraction dans les conditions générales, car la contrainte exercée sur la personne remplace l'effraction matérielle." },

    { id: 'm3c1x03', chap: 'c1', type: 'single',
      q: "Un vélo est volé devant la gare, cadenassé. Quelle couverture s'applique ?",
      choices: ["Le vol par effraction", "Le vol simple à l'extérieur, dans les limites convenues", "L'assurance bâtiment", "La RC privée"],
      answer: [1],
      explain: "Hors du domicile et sans effraction d'un local, c'est le vol simple à l'extérieur. Le respect des exigences de diligence (cadenas) conditionne la prestation." },

    { id: 'm3c1x04', chap: 'c1', type: 'single',
      q: "Un incendie détruit un canapé acheté CHF 3 000.– il y a six ans. Comment est-il indemnisé en valeur à neuf ?",
      choices: ["Au prix d'achat de CHF 3 000.–", "Au coût de remplacement actuel d'un canapé équivalent neuf", "À la valeur de revente d'occasion", "À la moitié du prix d'achat"],
      answer: [1],
      explain: "La valeur à neuf permet un remplacement effectif : c'est le coût actuel d'un bien équivalent, sans déduction de vétusté, dans les limites du contrat." },

    { id: 'm3c1x05', chap: 'c1', type: 'multi',
      q: "Quels événements relèvent de la couverture dégâts d'eau du ménage ?",
      choices: ["Rupture d'une conduite d'eau", "Fuite d'un lave-linge", "Refoulement des canalisations", "Infiltration de pluie par une fenêtre laissée ouverte", "Rupture d'un aquarium"],
      answer: [0, 1, 2, 4],
      explain: "L'eau entrée par une fenêtre volontairement ouverte relève de la négligence et non d'un événement soudain et imprévu : elle est en principe exclue." },

    { id: 'm3c1x06', chap: 'c1', type: 'single',
      q: "Quel est l'effet d'une sous-limite pour objets de valeur ?",
      choices: ["Elle supprime la couverture de ces objets", "Elle plafonne l'indemnité pour cette catégorie, indépendamment de la somme globale", "Elle augmente la prime", "Elle double la franchise"],
      answer: [1],
      explain: "Même avec une somme d'assurance générale élevée, bijoux et montres ne sont indemnisés que jusqu'à leur sous-limite : d'où l'intérêt d'une couverture séparée." },

    { id: 'm3c1x07', chap: 'c1', type: 'single',
      q: "Un client déménage dans un quartier plus exposé aux cambriolages. Que doit-il faire ?",
      choices: ["Rien", "Annoncer le changement d'adresse : il peut s'agir d'une aggravation du risque", "Résilier son contrat", "Doubler sa somme d'assurance"],
      answer: [1],
      explain: "Le lieu de situation des biens est un élément déterminant du risque. L'assureur peut adapter la prime ou, en cas d'aggravation essentielle, résilier." },

    { id: 'm3c1x08', chap: 'c1', type: 'single',
      q: "Un étudiant vit en colocation pendant ses études, ses parents ayant une assurance ménage. Quelle vérification s'impose ?",
      choices: ["Aucune, il est toujours couvert", "Vérifier si la police étend la couverture aux enfants logeant hors du domicile", "Souscrire obligatoirement une RC véhicule", "Résilier la police des parents"],
      answer: [1],
      explain: "Beaucoup de contrats prévoient cette extension, mais pas tous ni sans limite : c'est un point de conseil fréquemment oublié." },

    { id: 'm3c1x09', chap: 'c1', type: 'single',
      q: "Inventaire de CHF 200 000.–, assuré pour CHF 200 000.–. Dommage de CHF 15 000.–, franchise CHF 500.–. Indemnité ?",
      choices: ["CHF 15 000.–", "CHF 14 500.–", "CHF 13 500.–", "CHF 500.–"],
      answer: [1],
      explain: "Aucune sous-assurance : le dommage est indemnisé intégralement, sous la seule déduction de la franchise, soit CHF 14 500.–." },

    { id: 'm3c1x10', chap: 'c1', type: 'multi',
      q: "Quelles obligations pèsent sur l'assuré après un cambriolage ?",
      choices: ["Annoncer le sinistre sans retard", "Déposer plainte auprès de la police", "Établir une liste des objets dérobés", "Conserver les traces et éviter d'altérer les lieux", "Renoncer à toute réparation provisoire"],
      answer: [0, 1, 2, 3],
      explain: "Les mesures conservatoires raisonnables sont au contraire attendues : l'obligation de réduire le dommage impose d'agir, non de laisser la situation empirer." },

    { id: 'm3c1x11', chap: 'c1', type: 'single',
      q: "L'assurance ménage couvre-t-elle les dommages que l'assuré cause au logement qu'il loue ?",
      choices: ["Oui, par la couverture incendie", "Non : cela relève de la RC privée, couverture des dommages à la chose louée", "Oui, sans limite", "Non, ce risque est inassurable"],
      answer: [1],
      explain: "Le ménage couvre les biens de l'assuré ; les dommages causés à la chose d'autrui — ici le logement du bailleur — engagent sa responsabilité civile." },

    { id: 'm3c1x12', chap: 'c1', type: 'single',
      q: "Pourquoi les provisions et denrées alimentaires figurent-elles dans l'inventaire assuré ?",
      choices: ["Par tradition", "Parce qu'elles font partie des biens mobiliers du ménage et peuvent être détruites (panne de congélateur, incendie)", "Parce que la loi l'impose", "Elles ne le sont jamais"],
      answer: [1],
      explain: "Certains contrats prévoient même une garantie spécifique pour le contenu du congélateur en cas de panne prolongée de courant." },

    { id: 'm3c1x13', chap: 'c1', type: 'single',
      q: "Un assuré sous-estime volontairement la valeur de son inventaire pour payer moins cher. Que risque-t-il ?",
      choices: ["Rien du tout", "Une réduction proportionnelle de chaque indemnité", "Une majoration automatique de sa prime", "La nullité pour prétention frauduleuse"],
      answer: [1],
      explain: "L'économie de prime se paie au moment du sinistre : la règle proportionnelle s'applique à chaque dommage, même partiel." },

    { id: 'm3c1x14', chap: 'c1', type: 'single',
      q: "Les dommages naturels couverts avec l'incendie du ménage comprennent notamment :",
      choices: ["La tempête, la grêle et l'inondation", "Le tremblement de terre", "L'usure des meubles", "Le vol"],
      answer: [0],
      explain: "Le tremblement de terre est exclu du régime ordinaire ; l'usure n'est pas un événement aléatoire ; le vol est une couverture distincte." },

    { id: 'm3c1x15', chap: 'c1', type: 'single',
      q: "Un client possède une collection de montres estimée à CHF 80 000.–. Quelle recommandation est la plus pertinente ?",
      choices: ["Se contenter de la police ménage standard", "Souscrire une couverture séparée sur liste avec estimation", "Renoncer à assurer la collection", "Augmenter uniquement la franchise"],
      answer: [1],
      explain: "Une police ménage plafonne les objets de valeur par une sous-limite très inférieure : seule une couverture dédiée, avec liste et expertise, protège réellement." },

    /* ================= c2 — Bâtiment ================= */
    { id: 'm3c2x01', chap: 'c2', type: 'single',
      q: "Combien de cantons connaissent un établissement cantonal d'assurance des bâtiments ?",
      choices: ["7", "13", "19", "26"],
      answer: [2],
      explain: "19 cantons ont un ECA en situation de monopole ; les 7 cantons GUSTAVO laissent ce marché aux assureurs privés." },

    { id: 'm3c2x02', chap: 'c2', type: 'single',
      q: "Dans un canton à monopole, un propriétaire peut-il choisir son assureur pour l'incendie du bâtiment ?",
      choices: ["Oui, librement", "Non, l'affiliation à l'établissement cantonal est obligatoire", "Oui, avec l'accord de la FINMA", "Oui, s'il assure aussi son ménage"],
      answer: [1],
      explain: "Le monopole exclut le choix : la prime et les conditions sont fixées par l'établissement cantonal, qui assure l'ensemble du parc immobilier du canton." },

    { id: 'm3c2x03', chap: 'c2', type: 'single',
      q: "Le tremblement de terre est-il couvert par l'assurance bâtiment ordinaire ?",
      choices: ["Oui, avec les dommages naturels", "Non, il est exclu et nécessite une couverture spécifique", "Oui, mais seulement dans les cantons GUSTAVO", "Oui, jusqu'à CHF 100 000.–"],
      answer: [1],
      explain: "Le potentiel de cumul est tel qu'il dépasse la capacité du régime ordinaire : la couverture passe par des solutions spécifiques ou des pools." },

    { id: 'm3c2x04', chap: 'c2', type: 'multi',
      q: "Quelles exclusions sont usuelles en assurance du bâtiment ?",
      choices: ["Usure et défaut d'entretien", "Tremblement de terre", "Affaissement dû au mode de construction", "Dommages de guerre", "Incendie accidentel"],
      answer: [0, 1, 2, 3],
      explain: "L'incendie accidentel est le risque assuré par excellence : c'est le cœur historique de l'assurance du bâtiment." },

    { id: 'm3c2x05', chap: 'c2', type: 'single',
      q: "Un immeuble locatif brûle et reste inhabitable neuf mois. Quelle garantie couvre les loyers non perçus ?",
      choices: ["La RC du propriétaire", "La garantie perte de loyer", "L'assurance ménage des locataires", "La protection juridique"],
      answer: [1],
      explain: "C'est l'équivalent, pour l'immeuble, de la perte d'exploitation d'une entreprise : elle compense le revenu locatif pendant la remise en état." },

    { id: 'm3c2x06', chap: 'c2', type: 'single',
      q: "Une tuile mal fixée blesse un passant. Quelle assurance intervient et sur quelle base ?",
      choices: ["L'assurance incendie du bâtiment", "La RC du propriétaire d'immeuble, art. 58 CO", "L'assurance ménage", "La casco"],
      answer: [1],
      explain: "Le propriétaire répond causalement du défaut d'entretien de son ouvrage : sa RC immeuble prend en charge les prétentions du lésé." },

    { id: 'm3c2x07', chap: 'c2', type: 'single',
      q: "Quel est l'intérêt d'assurer les frais de déblaiement séparément ?",
      choices: ["Ils sont toujours inclus dans la somme du bâtiment", "Ils peuvent représenter une part importante du coût et dépasser la somme prévue", "Ils sont pris en charge par la commune", "Ils ne sont jamais assurables"],
      answer: [1],
      explain: "Évacuer les décombres d'un immeuble détruit coûte cher ; sans garantie distincte, ces frais viennent réduire l'indemnité de reconstruction." },

    { id: 'm3c2x08', chap: 'c2', type: 'single',
      q: "Une pompe à chaleur récemment installée doit être :",
      choices: ["Ignorée dans le contrat", "Annoncée et intégrée à la valeur assurée du bâtiment", "Assurée par la RC privée", "Couverte par la casco"],
      answer: [1],
      explain: "Toute plus-value importante non annoncée crée une sous-assurance : l'installation doit être intégrée à la somme d'assurance." },

    { id: 'm3c2x09', chap: 'c2', type: 'single',
      q: "Dans un canton GUSTAVO, qui assure l'incendie d'une villa ?",
      choices: ["L'établissement cantonal", "Un assureur privé choisi par le propriétaire", "La Confédération", "Personne, l'assurance est interdite"],
      answer: [1],
      explain: "GE, UR, SZ, TI, AI, VS et OW n'ont pas d'ECA : le propriétaire choisit librement son assureur privé pour l'incendie comme pour le reste." },

    { id: 'm3c2x10', chap: 'c2', type: 'multi',
      q: "Quelles couvertures un propriétaire devrait-il examiner en plus de l'incendie et des dommages naturels ?",
      choices: ["Dégâts d'eau du bâtiment", "Bris de glace du bâtiment", "RC du propriétaire d'immeuble", "Perte de loyer", "Assurance-vie"],
      answer: [0, 1, 2, 3],
      explain: "L'assurance-vie relève de la prévoyance et d'un autre profil de certification : elle n'entre pas dans l'analyse des besoins d'un immeuble." },

    { id: 'm3c2x11', chap: 'c2', type: 'single',
      q: "Une inondation endommage à la fois le bâtiment et le mobilier d'un locataire. Quels contrats interviennent ?",
      choices: ["Uniquement l'assurance bâtiment", "L'assurance bâtiment pour l'immeuble et l'assurance ménage du locataire pour son mobilier", "Uniquement l'assurance ménage", "La RC du propriétaire"],
      answer: [1],
      explain: "Chacun assure ce qui lui appartient : l'immeuble pour le propriétaire, l'inventaire pour le locataire. C'est une question de conseil très fréquente." },

    { id: 'm3c2x12', chap: 'c2', type: 'single',
      q: "La valeur d'assurance d'un bâtiment correspond en principe :",
      choices: ["À son prix d'achat", "À son coût de reconstruction à neuf", "À sa valeur vénale sur le marché immobilier", "À la valeur du terrain"],
      answer: [1],
      explain: "Le terrain ne brûle pas : seule la construction est assurée, sur la base de ce qu'il en coûterait de la reconstruire à l'identique." },

    /* ================= c3 — Véhicules ================= */
    { id: 'm3c3x01', chap: 'c3', type: 'single',
      q: "Qui est le « détenteur » d'un véhicule au sens de la LCR ?",
      choices: ["Le conducteur au moment de l'accident", "Celui qui a le pouvoir de disposition effectif et l'utilise à ses frais et risques", "Le propriétaire inscrit uniquement", "Le titulaire du permis de conduire"],
      answer: [1],
      explain: "En leasing, le propriétaire est la société de financement mais le détenteur est l'utilisateur : c'est lui qui répond selon l'art. 58 LCR." },

    { id: 'm3c3x02', chap: 'c3', type: 'single',
      q: "Un véhicule stationné est rayé volontairement par un inconnu. Quelle couverture intervient ?",
      choices: ["La RC véhicule", "La casco complète, ou la partielle si le vandalisme y est inclus", "Le Fonds national de garantie", "L'assurance ménage"],
      answer: [1],
      explain: "Le vandalisme est couvert par la casco complète ; certaines casco partielles l'incluent aussi. La RC ne couvre jamais le véhicule de l'assuré." },

    { id: 'm3c3x03', chap: 'c3', type: 'single',
      q: "Le conducteur d'un véhicule cause un accident alors qu'il n'était pas autorisé à conduire. Quelle est la conséquence ?",
      choices: ["Le lésé n'est pas indemnisé", "Le lésé est indemnisé et l'assureur exerce un recours", "Le contrat devient nul", "La couverture est suspendue rétroactivement"],
      answer: [1],
      explain: "La protection du lésé est prioritaire : l'assureur paie, puis se retourne contre le responsable pour récupérer sa prestation." },

    { id: 'm3c3x04', chap: 'c3', type: 'multi',
      q: "Dans quels cas l'assureur RC véhicule peut-il exercer un recours contre son assuré ?",
      choices: ["Conduite en état d'ébriété qualifiée", "Conduite sans permis valable", "Excès de vitesse massif", "Accident survenu sans faute", "Utilisation du véhicule à des fins non autorisées"],
      answer: [0, 1, 2, 4],
      explain: "Sans faute qualifiée, il n'y a rien à reprocher à l'assuré : le recours suppose une violation grave de ses obligations." },

    { id: 'm3c3x05', chap: 'c3', type: 'single',
      q: "Une voiture neuve est détruite après 8 mois. Que permet une clause de valeur à neuf ?",
      choices: ["De percevoir la valeur vénale uniquement", "D'être indemnisé sur la base du prix d'un véhicule neuf équivalent", "De supprimer la franchise", "De doubler l'indemnité"],
      answer: [1],
      explain: "Sans cette clause, la décote des premiers mois serait entièrement à la charge de l'assuré. Elle est généralement limitée aux deux ou trois premières années." },

    { id: 'm3c3x06', chap: 'c3', type: 'single',
      q: "Un pare-brise est réparé plutôt que remplacé. Quelle est la pratique courante ?",
      choices: ["La franchise est doublée", "La franchise est souvent réduite ou supprimée pour encourager la réparation", "La prestation est refusée", "Le bonus est dégradé"],
      answer: [1],
      explain: "Réparer coûte bien moins cher que remplacer : l'assureur incite à ce choix en renonçant à la franchise." },

    { id: 'm3c3x07', chap: 'c3', type: 'single',
      q: "Un véhicule immatriculé en France cause un dommage en Suisse et son assureur est introuvable. Qui intervient ?",
      choices: ["Le Fonds national de garantie", "Le Bureau national d'assurance", "La FINMA", "L'ECA"],
      answer: [1],
      explain: "Le Bureau national d'assurance traite les sinistres impliquant des véhicules immatriculés à l'étranger ; le Fonds national vise les non-assurés et non-identifiés suisses." },

    { id: 'm3c3x08', chap: 'c3', type: 'single',
      q: "La protection juridique circulation couvre notamment :",
      choices: ["Les réparations du véhicule", "Les frais d'avocat et de procédure liés à un litige de circulation", "Les amendes d'ordre", "La perte de valeur du véhicule"],
      answer: [1],
      explain: "Elle finance la défense des intérêts juridiques de l'assuré ; les amendes restent personnelles et ne sont jamais assurables." },

    { id: 'm3c3x09', chap: 'c3', type: 'multi',
      q: "Quelles affirmations sur la casco sont exactes ?",
      choices: ["La casco complète inclut toujours les risques de la casco partielle", "La casco partielle couvre le vol", "La casco est facultative en droit", "La casco couvre la responsabilité envers les tiers", "La franchise est généralement plus élevée en casco complète"],
      answer: [0, 1, 2, 4],
      explain: "La responsabilité envers les tiers relève exclusivement de la RC : la casco ne couvre que le véhicule de l'assuré lui-même." },

    { id: 'm3c3x10', chap: 'c3', type: 'single',
      q: "Un conducteur heurte un mur en manœuvrant. Sans casco complète, qui supporte le dommage au véhicule ?",
      choices: ["L'assureur RC", "L'assuré lui-même", "Le Fonds national de garantie", "Le propriétaire du mur"],
      answer: [1],
      explain: "La collision dont on est responsable n'est couverte que par la casco complète. La RC indemnisera en revanche le propriétaire du mur endommagé." },

    { id: 'm3c3x11', chap: 'c3', type: 'single',
      q: "Que se passe-t-il si la prime d'une assurance RC véhicule reste impayée malgré sommation ?",
      choices: ["Rien, la couverture est maintenue par la loi", "La couverture est suspendue et l'autorité est informée, ce qui conduit au retrait des plaques", "Le contrat est transféré au Fonds national", "La prime est prélevée d'office"],
      answer: [1],
      explain: "L'assurance RC étant une condition de l'immatriculation, l'assureur annonce la suspension à l'autorité, qui fait retirer permis et plaques." },

    { id: 'm3c3x12', chap: 'c3', type: 'single',
      q: "Un client demande si sa casco couvre le vol du contenu de son coffre. Que répondez-vous ?",
      choices: ["Oui, sans limite", "Les effets personnels transportés font l'objet d'une couverture spécifique, souvent limitée", "Non, jamais", "C'est la RC qui s'en charge"],
      answer: [1],
      explain: "La casco couvre le véhicule ; les objets transportés relèvent d'une extension propre ou, selon les cas, du vol à l'extérieur de l'assurance ménage." },

    /* ================= c4 — RC privée ================= */
    { id: 'm3c4x01', chap: 'c4', type: 'single',
      q: "Un assuré casse le téléphone d'un ami. Sa RC privée intervient-elle ?",
      choices: ["Non, il s'agit d'un proche", "Oui, l'ami est un tiers et le dommage est causé dans la vie privée", "Non, seuls les dommages corporels sont couverts", "Uniquement si l'ami porte plainte"],
      answer: [1],
      explain: "Seuls les biens de l'assuré et des personnes vivant en ménage commun sont exclus ; un ami est un tiers ordinaire." },

    { id: 'm3c4x02', chap: 'c4', type: 'single',
      q: "Un assuré endommage sa propre voiture avec sa tondeuse. La RC privée intervient-elle ?",
      choices: ["Oui", "Non, les dommages à ses propres biens sont exclus", "Oui, à 50 %", "Oui, si la voiture est en leasing"],
      answer: [1],
      explain: "La responsabilité civile suppose un tiers lésé : on ne peut pas être responsable envers soi-même." },

    { id: 'm3c4x03', chap: 'c4', type: 'single',
      q: "Quelle somme de garantie est usuellement recommandée en RC privée ?",
      choices: ["CHF 100 000.–", "Plusieurs millions de francs", "CHF 50 000.–", "La valeur du ménage"],
      answer: [1],
      explain: "Un dommage corporel grave (invalidité d'un jeune actif) peut atteindre plusieurs millions : une garantie basse exposerait l'assuré sur son patrimoine personnel." },

    { id: 'm3c4x04', chap: 'c4', type: 'multi',
      q: "Quelles situations relèvent typiquement de la RC privée ?",
      choices: ["Un enfant casse la vitre du voisin", "Le chien de l'assuré mord un passant", "L'assuré inonde l'appartement du voisin", "L'assuré cause un accident avec sa voiture", "L'assuré abîme le parquet de son logement loué"],
      answer: [0, 1, 2, 4],
      explain: "L'accident de la circulation relève de la RC véhicule obligatoire, expressément exclue de la RC privée." },

    { id: 'm3c4x05', chap: 'c4', type: 'single',
      q: "Un tiers réclame CHF 40 000.– à l'assuré pour un dommage que celui-ci conteste. Que fait l'assureur RC ?",
      choices: ["Il paie immédiatement pour clore l'affaire", "Il examine le bien-fondé et repousse la prétention si elle est injustifiée, en assumant la défense", "Il renvoie l'assuré vers un avocat à ses frais", "Il résilie le contrat"],
      answer: [1],
      explain: "C'est la fonction passive de la RC : l'assureur devient le bouclier juridique de l'assuré, ce qui a souvent plus de valeur que le paiement lui-même." },

    { id: 'm3c4x06', chap: 'c4', type: 'single',
      q: "Un assuré prête sa perceuse à un voisin qui se blesse. La RC privée de l'assuré est-elle engagée ?",
      choices: ["Automatiquement", "Seulement si une responsabilité de l'assuré est établie, par exemple un défaut connu et non signalé", "Jamais", "Uniquement si le voisin est hospitalisé"],
      answer: [1],
      explain: "L'assurance suit la responsabilité : sans acte illicite ni faute imputable à l'assuré, il n'y a pas de prétention fondée à couvrir." },

    { id: 'm3c4x07', chap: 'c4', type: 'single',
      q: "Un assuré organise une fête et un invité se blesse en glissant. Quelle couverture est concernée ?",
      choices: ["La RC privée, si une responsabilité est établie", "L'assurance ménage", "La casco", "La protection juridique uniquement"],
      answer: [0],
      explain: "L'invité est un tiers ; si un défaut d'entretien ou une négligence de l'hôte est établi, la RC privée prend en charge les prétentions." },

    { id: 'm3c4x08', chap: 'c4', type: 'multi',
      q: "Quelles exclusions sont typiques d'une RC privée ?",
      choices: ["Dommages intentionnels", "Amendes et sanctions pénales", "Dommages liés à une activité professionnelle", "Dommages causés par un véhicule à moteur", "Dommages causés à un voisin par négligence"],
      answer: [0, 1, 2, 3],
      explain: "La négligence envers un voisin est précisément le risque assuré : c'est le cas d'école de la RC privée." },

    { id: 'm3c4x09', chap: 'c4', type: 'single',
      q: "Une famille loue un appartement et provoque un dégât d'eau chez le voisin du dessous. Qui indemnise ce voisin ?",
      choices: ["L'assurance ménage de la famille", "La RC privée de la famille", "L'assurance bâtiment", "Le voisin lui-même"],
      answer: [1],
      explain: "Le mobilier abîmé appartient à un tiers : c'est la responsabilité civile de la famille qui est engagée, et non son assurance de choses." },

    { id: 'm3c4x10', chap: 'c4', type: 'single',
      q: "Pourquoi la RC privée couvre-t-elle souvent les dommages causés par des enfants incapables de discernement ?",
      choices: ["Parce que la loi les rend responsables", "Par une clause d'équité contractuelle, malgré l'absence de responsabilité juridique", "Parce que les parents sont toujours fautifs", "Elle ne les couvre jamais"],
      answer: [1],
      explain: "Juridiquement l'enfant n'est pas responsable et les parents ne le sont que s'ils ont manqué à leur surveillance : la clause d'équité évite que le lésé reste sans indemnisation." },

    { id: 'm3c4x11', chap: 'c4', type: 'single',
      q: "Un assuré exerce une activité accessoire rémunérée le week-end. Quelle est la conséquence en RC ?",
      choices: ["Aucune, la RC privée suffit", "L'activité lucrative est exclue : une couverture professionnelle est nécessaire", "La prime privée double automatiquement", "Il doit résilier sa RC privée"],
      answer: [1],
      explain: "Le caractère accessoire n'y change rien : dès qu'il y a activité lucrative, la RC privée cesse de couvrir les dommages qui en découlent." },

    { id: 'm3c4x12', chap: 'c4', type: 'single',
      q: "La RC privée d'un propriétaire occupant sa maison couvre :",
      choices: ["Les dommages à sa propre maison", "Sa responsabilité de propriétaire d'ouvrage envers les tiers, selon les conditions", "Les frais de rénovation", "Les impôts fonciers"],
      answer: [1],
      explain: "Les dommages au bâtiment lui-même relèvent de l'assurance de choses ; la RC ne vise que les prétentions de tiers, notamment sur la base de l'art. 58 CO." }
  ]);
})();
