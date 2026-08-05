/* =============================================================
   AFA – Module 2, questions supplémentaires : chapitres 5 et 6
   (LCA III – sinistre / Sous-assurance, surassurance, subrogation)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m2', [
    /* ================= c5 — LCA III : sinistre et prestations ================= */
    { id: 'm2c5x01', chap: 'c5', type: 'single',
      q: "Selon l'art. 33 LCA, l'assureur répond :",
      choices: ["Uniquement des événements expressément énumérés", "De tous les événements présentant le caractère du risque assuré, sauf exclusion précise et non équivoque", "Des seuls événements approuvés par la FINMA", "Des événements survenus après un délai de carence d'un an"],
      answer: [1],
      explain: "La couverture est de principe, l'exclusion est l'exception : c'est à l'assureur de rédiger clairement ce qu'il ne veut pas couvrir." },

    { id: 'm2c5x02', chap: 'c5', type: 'single',
      q: "Une clause d'exclusion rédigée de façon obscure produit quel effet ?",
      choices: ["Elle s'applique intégralement", "Elle s'interprète en faveur de l'assuré", "Elle rend le contrat nul", "Elle doit être approuvée par un juge avant application"],
      answer: [1],
      explain: "L'assureur rédige les conditions générales : il supporte le risque de l'ambiguïté. C'est le corollaire pratique de l'art. 33 LCA." },

    { id: 'm2c5x03', chap: 'c5', type: 'single',
      q: "Un conducteur provoque un accident avec 1,8 ‰ d'alcool dans le sang. Sur le plan de la faute, il s'agit :",
      choices: ["D'une faute légère", "D'une faute grave", "D'un cas fortuit", "D'un dessein"],
      answer: [1],
      explain: "L'ivresse qualifiée est l'exemple type de la faute grave : l'assureur peut réduire sa prestation, et en RC véhicule exercer un recours après avoir indemnisé le lésé." },

    { id: 'm2c5x04', chap: 'c5', type: 'single',
      q: "La réduction pour faute grave doit être :",
      choices: ["Fixée forfaitairement à 50 %", "Proportionnée au degré de la faute", "Toujours totale", "Décidée par la FINMA"],
      answer: [1],
      explain: "Art. 14 al. 2 LCA. De nombreux contrats renoncent d'ailleurs contractuellement à cette réduction, ce qui constitue un argument de vente." },

    { id: 'm2c5x05', chap: 'c5', type: 'multi',
      q: "Quelles conditions doivent être réunies pour retenir une prétention frauduleuse (art. 40 LCA) ?",
      choices: ["Une déclaration inexacte portant sur un fait pertinent", "L'intention de tromper l'assureur", "Un dommage supérieur à CHF 10 000.–", "Une condamnation pénale préalable", "Le but d'obtenir une prestation indue"],
      answer: [0, 1, 4],
      explain: "Ni montant minimal ni condamnation pénale ne sont exigés : la sanction civile est indépendante d'une éventuelle procédure pénale pour escroquerie." },

    { id: 'm2c5x06', chap: 'c5', type: 'single',
      q: "Un assuré subit un vol réel de CHF 5 000.– mais déclare CHF 12 000.– pour « arrondir ». Conséquence :",
      choices: ["Il touche CHF 5 000.–", "Il perd tout droit aux prestations pour ce sinistre", "Il touche CHF 12 000.–", "Sa prime est majorée"],
      answer: [1],
      explain: "La sanction de l'art. 40 LCA frappe l'ensemble de la prétention, y compris sa partie honnête, et l'assureur peut en outre résilier le contrat." },

    { id: 'm2c5x07', chap: 'c5', type: 'single',
      q: "Quand la prestation de l'assureur devient-elle exigible ?",
      choices: ["Immédiatement après l'annonce du sinistre", "Quatre semaines après réception des renseignements permettant de vérifier le bien-fondé de la prétention", "Après un an", "Après décision de l'Ombudsman"],
      answer: [1],
      explain: "Art. 41 LCA. Le point de départ n'est pas l'annonce mais la réception des justificatifs, ce qui laisse à l'assureur le temps d'instruire le dossier." },

    { id: 'm2c5x08', chap: 'c5', type: 'single',
      q: "Le délai de prescription de cinq ans de l'art. 46 LCA court dès :",
      choices: ["La conclusion du contrat", "Le fait d'où naît l'obligation de l'assureur", "Le refus de prestation", "La fin du contrat"],
      answer: [1],
      explain: "En principe la survenance du sinistre. La révision a doublé de plus de deux fois l'ancien délai de deux ans, très défavorable aux assurés." },

    { id: 'm2c5x09', chap: 'c5', type: 'single',
      q: "Un preneur domicilié à Lausanne veut agir contre son assureur dont le siège est à Zurich. Il peut saisir :",
      choices: ["Uniquement le tribunal de Zurich", "Le tribunal de son domicile ou celui du siège de l'assureur", "Uniquement le Tribunal fédéral", "Uniquement la FINMA"],
      answer: [1],
      explain: "Le for du domicile protège le consommateur, qui n'a pas à plaider loin de chez lui contre une partie économiquement plus forte." },

    { id: 'm2c5x10', chap: 'c5', type: 'single',
      q: "Un assuré cause le sinistre par une faute légère. L'assureur :",
      choices: ["Ne peut pas réduire sa prestation", "Peut réduire de 25 %", "Est entièrement libéré", "Peut résilier immédiatement"],
      answer: [0],
      explain: "Seules la faute grave (réduction) et le dessein (libération totale) sont sanctionnés. La négligence légère fait partie du risque assuré." },

    { id: 'm2c5x11', chap: 'c5', type: 'single',
      q: "Une clause insolite figurant dans les CGA, à laquelle le client ne pouvait s'attendre :",
      choices: ["Lie le client car il a signé", "Peut être écartée par le juge", "Doit être approuvée par la FINMA", "Rend le contrat nul"],
      answer: [1],
      explain: "La règle de l'insolite complète la protection de l'art. 33 LCA : une clause surprenante et défavorable doit avoir été spécialement mise en évidence." },

    { id: 'm2c5x12', chap: 'c5', type: 'single',
      q: "L'assureur tarde à payer après l'échéance du délai de quatre semaines. Il doit :",
      choices: ["Rien de plus", "Des intérêts moratoires", "Une pénalité de 20 %", "Résilier le contrat"],
      answer: [1],
      explain: "La demeure de l'assureur produit les effets ordinaires du CO, soit un intérêt moratoire de 5 % l'an, sauf convention plus favorable." },

    { id: 'm2c5x13', chap: 'c5', type: 'multi',
      q: "Quelles obligations pèsent sur l'assuré après un sinistre ?",
      choices: ["Annoncer le sinistre dès qu'il en a connaissance", "Prendre les mesures pour limiter le dommage", "Collaborer à l'établissement des faits", "Conserver ses droits contre le tiers responsable", "Renoncer à porter plainte pénale"],
      answer: [0, 1, 2, 3],
      explain: "Renoncer à une plainte n'est pas exigé ; en revanche, compromettre le recours contre le responsable peut entraîner une réduction de la prestation." },

    { id: 'm2c5x14', chap: 'c5', type: 'single',
      q: "L'assuré laisse prescrire sa créance contre le tiers responsable, empêchant la subrogation. L'assureur peut :",
      choices: ["Réduire sa prestation dans la mesure du préjudice subi", "Rien faire", "Résilier rétroactivement", "Exiger une amende"],
      answer: [0],
      explain: "L'assuré doit préserver les droits qui passeront à l'assureur : les compromettre par sa faute justifie une réduction correspondante." },

    { id: 'm2c5x15', chap: 'c5', type: 'single',
      q: "L'Ombudsman rend une recommandation favorable à l'assuré. L'assureur :",
      choices: ["Doit obligatoirement s'y conformer", "N'y est pas juridiquement contraint", "Perd son autorisation s'il refuse", "Doit saisir la FINMA"],
      answer: [1],
      explain: "La médiation repose sur l'autorité morale et l'expertise : les recommandations sont largement suivies mais restent dépourvues de force obligatoire." },

    { id: 'm2c5x16', chap: 'c5', type: 'single',
      q: "L'assurance couvre-t-elle un dommage causé par l'assuré intentionnellement à un tiers ?",
      choices: ["Oui, c'est le but de la RC", "Non, le dessein exclut la prestation", "Oui, avec une franchise majorée", "Oui, si le tiers est innocent"],
      answer: [1],
      explain: "L'acte intentionnel supprime l'aléa. En RC véhicule, l'assureur indemnise néanmoins le lésé — protection légale de la victime — puis exerce son recours." },

    { id: 'm2c5x17', chap: 'c5', type: 'single',
      q: "Qui supporte le fardeau de la preuve de la survenance du sinistre ?",
      choices: ["L'assureur", "L'ayant droit", "Le juge", "L'expert"],
      answer: [1],
      explain: "Celui qui réclame une prestation doit prouver que les conditions en sont réunies ; l'assureur doit en revanche prouver les faits d'exclusion qu'il invoque." },

    { id: 'm2c5x18', chap: 'c5', type: 'single',
      q: "Qui doit prouver l'existence d'une cause d'exclusion de la couverture ?",
      choices: ["L'assuré", "L'assureur", "Le tribunal", "L'Ombudsman"],
      answer: [1],
      explain: "L'exclusion est un fait qui éteint ou empêche le droit : elle incombe à celui qui s'en prévaut, c'est-à-dire à l'assureur." },

    { id: 'm2c5x19', chap: 'c5', type: 'single',
      q: "Un sinistre survient six ans après sa survenance et n'a jamais été annoncé. La créance est :",
      choices: ["Encore exigible", "Prescrite (délai de 5 ans)", "Prescrite après 2 ans seulement", "Imprescriptible"],
      answer: [1],
      explain: "Le délai de l'art. 46 LCA est de cinq ans dès le fait d'où naît l'obligation ; l'assureur peut alors refuser de payer en soulevant la prescription." },

    { id: 'm2c5x20', chap: 'c5', type: 'single',
      q: "Une expertise contradictoire prévue dans les CGA sert à :",
      choices: ["Trancher définitivement le droit à la prestation", "Établir le montant du dommage par des experts désignés par les deux parties", "Remplacer le tribunal", "Fixer la prime future"],
      answer: [1],
      explain: "Elle porte sur les faits et le chiffrage, non sur les questions juridiques de couverture, qui restent du ressort des tribunaux." },

    { id: 'm2c5x21', chap: 'c5', type: 'multi',
      q: "Quelles conséquences peut avoir une prétention frauduleuse ?",
      choices: ["Perte du droit aux prestations pour le sinistre concerné", "Résiliation du contrat par l'assureur", "Poursuites pénales pour escroquerie", "Remboursement des prestations déjà versées", "Amende infligée par la FINMA au client"],
      answer: [0, 1, 2, 3],
      explain: "La FINMA ne sanctionne pas les assurés : elle surveille les assureurs et les intermédiaires, pas les clients." },

    { id: 'm2c5x22', chap: 'c5', type: 'single',
      q: "L'assuré ne peut pas produire de facture pour un objet volé. L'assureur :",
      choices: ["Refuse automatiquement toute prestation", "Apprécie les preuves disponibles, la facture n'étant pas la seule preuve admissible", "Doit payer sans discussion", "Saisit le juge pénal"],
      answer: [1],
      explain: "Photos, relevés bancaires, témoignages ou emballages peuvent établir la possession et la valeur : la preuve est libre en procédure civile suisse." },

    { id: 'm2c5x23', chap: 'c5', type: 'single',
      q: "En assurance de dommages, l'indemnité ne peut jamais dépasser :",
      choices: ["La somme d'assurance", "Le dommage effectivement subi", "Le total des primes payées", "La valeur à neuf majorée de 20 %"],
      answer: [1],
      explain: "Le principe indemnitaire plafonne la prestation au dommage réel, et la somme d'assurance constitue en outre un plafond contractuel." },

    { id: 'm2c5x24', chap: 'c5', type: 'single',
      q: "Un assuré conteste le refus de prestation. Quel ordre de démarches est le plus judicieux ?",
      choices: ["Tribunal, puis assureur, puis Ombudsman", "Assureur, puis Ombudsman, puis tribunal", "FINMA, puis tribunal", "Ombudsman, puis FINMA"],
      answer: [1],
      explain: "La réclamation interne est souvent la plus rapide ; la médiation est gratuite ; le procès demeure l'ultime recours, plus long et plus coûteux." },

    { id: 'm2c5x25', chap: 'c5', type: 'single',
      q: "Un délai de carence dans un contrat signifie :",
      choices: ["Que la couverture ne débute qu'après un certain temps depuis la conclusion", "Que la prime est payée en retard", "Que le contrat est suspendu", "Que le sinistre est prescrit"],
      answer: [0],
      explain: "Fréquent en assurance-maladie complémentaire ou en indemnités journalières, il prévient l'antisélection de clients qui souscrivent juste avant un besoin connu." },

    /* ================= c6 — Sous-assurance, surassurance, subrogation ================= */
    { id: 'm2c6x01', chap: 'c6', type: 'single',
      q: "Mobilier valant CHF 150 000.–, assuré pour CHF 100 000.–, dommage de CHF 30 000.–. L'indemnité s'élève à :",
      choices: ["CHF 30 000.–", "CHF 20 000.–", "CHF 15 000.–", "CHF 100 000.–"],
      answer: [1],
      explain: "30 000 × (100 000 / 150 000) = CHF 20 000.–. La règle proportionnelle sanctionne la sous-assurance : l'assuré supporte le tiers non assuré." },

    { id: 'm2c6x02', chap: 'c6', type: 'single',
      q: "Valeur CHF 400 000.–, somme d'assurance CHF 300 000.–, dommage total de CHF 400 000.–. L'indemnité est de :",
      choices: ["CHF 400 000.–", "CHF 300 000.–", "CHF 225 000.–", "CHF 100 000.–"],
      answer: [1],
      explain: "La règle proportionnelle donne 400 000 × (300 000/400 000) = CHF 300 000.–, soit exactement la somme d'assurance, qui plafonne de toute façon la prestation." },

    { id: 'm2c6x03', chap: 'c6', type: 'single',
      q: "Valeur CHF 80 000.–, somme assurée CHF 60 000.–, dommage CHF 8 000.–, franchise CHF 500.–. L'assureur verse :",
      choices: ["CHF 7 500.–", "CHF 6 000.–", "CHF 5 500.–", "CHF 8 000.–"],
      answer: [2],
      explain: "On applique d'abord la proportionnelle : 8 000 × (60 000/80 000) = CHF 6 000.–, puis la franchise : 6 000 − 500 = CHF 5 500.–." },

    { id: 'm2c6x04', chap: 'c6', type: 'single',
      q: "Quel est le principal risque pratique de la sous-assurance pour le client ?",
      choices: ["Une prime trop élevée", "Une indemnité réduite proportionnellement, même pour un petit sinistre", "La nullité du contrat", "La perte du droit de résiliation"],
      answer: [1],
      explain: "La réduction s'applique à tous les sinistres, pas seulement aux sinistres totaux : d'où l'importance d'actualiser régulièrement la somme d'assurance." },

    { id: 'm2c6x05', chap: 'c6', type: 'single',
      q: "L'assurance au premier risque signifie que :",
      choices: ["Seul le premier sinistre de l'année est couvert", "L'assureur indemnise jusqu'à la somme convenue sans appliquer la règle proportionnelle", "La franchise est supprimée", "Le premier assureur consulté paie seul"],
      answer: [1],
      explain: "Le client accepte un plafond mais échappe à la sanction de la sous-assurance : formule fréquente pour les objets de valeur ou les frais de déblaiement." },

    { id: 'm2c6x06', chap: 'c6', type: 'single',
      q: "Un objet vaut CHF 10 000.– et est assuré pour CHF 15 000.–. Il est détruit. L'assureur verse :",
      choices: ["CHF 15 000.–", "CHF 12 500.–", "CHF 10 000.–", "Rien"],
      answer: [2],
      explain: "La surassurance ne procure aucun gain : seul le dommage effectif est indemnisé. La prime payée sur les CHF 5 000.– excédentaires est perdue." },

    { id: 'm2c6x07', chap: 'c6', type: 'single',
      q: "Une surassurance conclue dans une intention de fraude entraîne :",
      choices: ["Une simple réduction de l'indemnité", "L'absence d'obligation de l'assureur (art. 51 LCA)", "Une majoration de prime", "Une amende de la FINMA"],
      answer: [1],
      explain: "Assurer volontairement au-delà de la valeur pour s'enrichir dénature le contrat : l'assureur n'est pas lié et conserve en principe la prime." },

    { id: 'm2c6x08', chap: 'c6', type: 'single',
      q: "Il y a double assurance lorsque :",
      choices: ["Deux personnes assurent le même bien pour des intérêts différents", "Le même intérêt est assuré contre le même risque auprès de plusieurs assureurs et que les sommes dépassent la valeur", "Un contrat est renouvelé deux fois", "L'assuré paie deux primes"],
      answer: [1],
      explain: "Trois éléments doivent coïncider : même intérêt, même risque, et sommes cumulées excédant la valeur assurable." },

    { id: 'm2c6x09', chap: 'c6', type: 'single',
      q: "Le preneur en situation de double assurance doit :",
      choices: ["Résilier immédiatement l'un des contrats", "En aviser chaque assureur", "Ne rien dire", "Informer uniquement la FINMA"],
      answer: [1],
      explain: "L'omission de cet avis peut libérer les assureurs : la transparence est la contrepartie de la protection accordée par la solidarité." },

    { id: 'm2c6x10', chap: 'c6', type: 'single',
      q: "En cas de double assurance, comment les assureurs répondent-ils envers l'ayant droit ?",
      choices: ["Chacun pour la moitié seulement", "Solidairement, dans les limites de leur contrat", "Le plus ancien contrat seul", "Le plus récent contrat seul"],
      answer: [1],
      explain: "L'assuré peut s'adresser à l'un d'eux pour la totalité de son dommage ; les assureurs se répartissent ensuite la charge au prorata de leurs engagements." },

    { id: 'm2c6x11', chap: 'c6', type: 'single',
      q: "Deux contrats couvrent le même bien pour CHF 60 000.– et CHF 40 000.–. Le dommage est de CHF 50 000.–. La répartition interne se fait :",
      choices: ["Par moitié entre les deux", "Au prorata des sommes : 60 % et 40 %", "À la charge du seul premier assureur", "Au choix de l'assuré uniquement"],
      answer: [1],
      explain: "L'assuré touche CHF 50 000.– au total ; entre eux, les assureurs supportent CHF 30 000.– et CHF 20 000.–, proportionnellement à leurs engagements." },

    { id: 'm2c6x12', chap: 'c6', type: 'single',
      q: "Quel est le fondement de la subrogation ?",
      choices: ["Éviter que l'assuré cumule indemnité et dommages-intérêts, et faire supporter la charge au responsable", "Réduire la prime", "Permettre à l'assureur de résilier", "Financer la réassurance"],
      answer: [0],
      explain: "Le principe indemnitaire interdit l'enrichissement ; la subrogation dirige la charge définitive vers celui qui a causé le dommage." },

    { id: 'm2c6x13', chap: 'c6', type: 'single',
      q: "L'assureur est subrogé aux droits de l'assuré :",
      choices: ["Dès la conclusion du contrat", "Dès qu'il a versé l'indemnité, à concurrence de sa prestation", "Après cinq ans", "Sur décision du juge uniquement"],
      answer: [1],
      explain: "Art. 95c LCA : la subrogation légale s'opère au moment du paiement et dans la limite de ce qui a été payé." },

    { id: 'm2c6x14', chap: 'c6', type: 'single',
      q: "Le responsable est partiellement insolvable et ne peut payer qu'une partie du dommage. Qui est servi en priorité ?",
      choices: ["L'assureur", "L'assuré, pour la part de dommage non couverte", "Les deux à parts égales", "L'État"],
      answer: [1],
      explain: "L'assuré ne doit pas pâtir de l'insolvabilité du responsable : il est désintéressé en priorité pour son découvert, l'assureur venant ensuite." },

    { id: 'm2c6x15', chap: 'c6', type: 'multi',
      q: "Dans quels cas la subrogation est-elle exclue ou limitée ?",
      choices: ["En assurance de sommes", "Contre les proches vivant en ménage commun, sauf faute grave", "Lorsque l'assuré a lui-même causé le dommage", "Contre un tiers totalement étranger à l'assuré", "Lorsque le dommage dépasse CHF 100 000.–"],
      answer: [0, 1],
      explain: "Le montant du dommage est sans effet sur le principe, et le recours contre un tiers étranger est précisément le cas normal de subrogation." },

    { id: 'm2c6x16', chap: 'c6', type: 'single',
      q: "Pourquoi le recours contre les proches faisant ménage commun est-il en principe exclu ?",
      choices: ["Parce qu'ils sont solvables", "Parce que le recours frapperait économiquement l'assuré lui-même", "Parce qu'ils sont co-assurés par définition", "Parce que la loi les protège pénalement"],
      answer: [1],
      explain: "Poursuivre le conjoint ou l'enfant vivant sous le même toit reviendrait à reprendre d'une main ce qui a été versé de l'autre." },

    { id: 'm2c6x17', chap: 'c6', type: 'single',
      q: "La valeur à neuf correspond :",
      choices: ["Au prix payé à l'achat il y a dix ans", "Au coût de remplacement par un objet neuf de même type et qualité", "À la valeur de revente sur le marché de l'occasion", "À la valeur sentimentale"],
      answer: [1],
      explain: "C'est la base usuelle en assurance ménage et bâtiment : elle permet un remplacement effectif, sans que l'assuré doive supporter la vétusté." },

    { id: 'm2c6x18', chap: 'c6', type: 'single',
      q: "La valeur actuelle se calcule :",
      choices: ["Valeur à neuf moins la dépréciation liée à l'âge et à l'usage", "Valeur à neuf plus l'inflation", "Prix d'achat divisé par deux", "Somme d'assurance moins la franchise"],
      answer: [0],
      explain: "Elle reflète l'état réel du bien au moment du sinistre ; certains contrats basculent en valeur actuelle lorsque la vétusté dépasse un seuil convenu." },

    { id: 'm2c6x19', chap: 'c6', type: 'single',
      q: "Pour un véhicule d'occasion, l'indemnisation se fonde en principe sur :",
      choices: ["La valeur à neuf", "La valeur vénale", "Le prix catalogue", "La valeur d'affection"],
      answer: [1],
      explain: "La valeur vénale correspond au prix qu'on obtiendrait sur le marché de l'occasion, éventuellement corrigée par une clause de valeur à neuf temporaire." },

    { id: 'm2c6x20', chap: 'c6', type: 'single',
      q: "Un tableau de famille sans grande valeur marchande mais d'une grande importance affective est détruit. L'assurance couvre :",
      choices: ["La valeur d'affection", "La seule valeur matérielle objective", "Le double de la valeur vénale", "Rien du tout"],
      answer: [1],
      explain: "La valeur d'affection n'est pas mesurable objectivement et ne correspond à aucun dommage patrimonial : elle reste inassurable." },

    { id: 'm2c6x21', chap: 'c6', type: 'single',
      q: "Une clause d'indexation de la somme d'assurance vise à :",
      choices: ["Éviter la sous-assurance due au renchérissement", "Réduire la prime chaque année", "Supprimer la franchise", "Prolonger le contrat"],
      answer: [0],
      explain: "En adaptant automatiquement la somme à l'évolution des prix, elle empêche que l'inflation ne crée insidieusement une sous-assurance." },

    { id: 'm2c6x22', chap: 'c6', type: 'multi',
      q: "Quelles affirmations sur la règle proportionnelle sont exactes ?",
      choices: ["Elle s'applique en assurance de dommages", "Elle réduit l'indemnité dans le rapport somme/valeur", "Elle s'applique aussi aux sinistres partiels", "Elle peut être écartée par une clause de renonciation", "Elle s'applique en assurance de sommes"],
      answer: [0, 1, 2, 3],
      explain: "L'assurance de sommes ignore la notion de valeur assurable : il n'y a donc ni sous-assurance ni règle proportionnelle." },

    { id: 'm2c6x23', chap: 'c6', type: 'single',
      q: "Un assuré perçoit CHF 20 000.– de son assureur pour un dommage causé par un tiers responsable. L'assureur peut réclamer au responsable :",
      choices: ["CHF 40 000.–", "CHF 20 000.– au maximum", "Rien", "Le montant de la prime"],
      answer: [1],
      explain: "La subrogation joue à concurrence de la prestation versée : l'assureur ne peut pas s'enrichir davantage que ce qu'il a déboursé." },

    { id: 'm2c6x24', chap: 'c6', type: 'single',
      q: "Un assuré perçoit un capital d'une assurance-accidents de sommes et obtient en plus des dommages-intérêts du responsable. Est-ce admissible ?",
      choices: ["Non, il y a surindemnisation", "Oui, l'assurance de sommes se cumule avec les prétentions en responsabilité", "Oui, mais l'assureur peut demander la moitié", "Non, sauf accord de l'assureur"],
      answer: [1],
      explain: "Absence de principe indemnitaire et de subrogation : c'est précisément l'intérêt de l'assurance de sommes pour l'assuré." },

    { id: 'm2c6x25', chap: 'c6', type: 'single',
      q: "Pour éviter la sous-assurance en assurance ménage, il convient de :",
      choices: ["Réduire la somme d'assurance pour payer moins", "Estimer correctement la valeur de remplacement de l'ensemble du mobilier et l'actualiser", "Souscrire plusieurs contrats identiques", "Augmenter la franchise"],
      answer: [1],
      explain: "Un inventaire réaliste, révisé après tout achat important, est le meilleur moyen d'éviter une mauvaise surprise au moment du sinistre." },

    { id: 'm2c6x26', chap: 'c6', type: 'single',
      q: "La somme d'assurance représente :",
      choices: ["Le montant maximal que l'assureur versera", "Le montant minimal garanti quel que soit le dommage", "La prime annuelle", "La valeur de rachat"],
      answer: [0],
      explain: "En assurance de dommages, elle constitue un plafond : l'indemnité est limitée à la fois par ce montant et par le dommage effectivement subi." },

    { id: 'm2c6x27', chap: 'c6', type: 'single',
      q: "Un locataire endommage l'appartement qu'il loue. L'assureur du bailleur indemnise puis se retourne contre lui. Est-ce possible ?",
      choices: ["Non, le locataire est un proche", "Oui, le locataire est un tiers responsable au sens de la subrogation", "Non, la subrogation est interdite entre parties à un bail", "Oui, mais seulement pour la moitié"],
      answer: [1],
      explain: "C'est exactement le rôle de la RC privée du locataire, qui couvre les dommages causés à la chose louée dans les limites du contrat." },

    { id: 'm2c6x28', chap: 'c6', type: 'single',
      q: "Le montant du dommage en assurance de choses se détermine :",
      choices: ["Librement par l'assuré", "Selon la valeur convenue au contrat (à neuf, actuelle ou vénale) au moment du sinistre", "Selon le prix d'achat historique uniquement", "Selon le montant de la prime payée"],
      answer: [1],
      explain: "La base d'indemnisation est un élément essentiel du contrat : elle doit être expliquée au client, car elle détermine ce qu'il touchera réellement." },

    { id: 'm2c6x29', chap: 'c6', type: 'single',
      q: "Assurance de CHF 250 000.– pour une valeur de CHF 250 000.–, dommage de CHF 40 000.–. L'indemnité (sans franchise) est de :",
      choices: ["CHF 40 000.–", "CHF 25 000.–", "CHF 20 000.–", "CHF 250 000.–"],
      answer: [0],
      explain: "Somme et valeur coïncident : il n'y a ni sous-assurance ni surassurance, et le dommage est indemnisé intégralement." },

    { id: 'm2c6x30', chap: 'c6', type: 'multi',
      q: "Quelles règles découlent du principe indemnitaire ?",
      choices: ["Interdiction de s'enrichir par l'assurance", "Application de la règle proportionnelle en cas de sous-assurance", "Subrogation contre le tiers responsable", "Prise en compte de la double assurance", "Versement du capital convenu indépendamment du dommage"],
      answer: [0, 1, 2, 3],
      explain: "Le versement d'un capital fixe sans égard au dommage caractérise l'assurance de sommes, qui échappe précisément au principe indemnitaire." }
  ]);
})();
