/* =============================================================
   AFA – Module 2, complément : chapitres 1, 3, 5 et 7
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m2', [
    /* --------- c1 : bases du droit --------- */
    { id: 'm2c1y01', chap: 'c1', type: 'single',
      q: "Le Code des obligations est formellement :",
      choices: ["Une ordonnance du Conseil fédéral", "La cinquième partie du Code civil suisse", "Une loi cantonale", "Un règlement de la FINMA"],
      answer: [1],
      explain: "Le CO constitue le livre cinquième du Code civil, même s'il est publié séparément. Cette unité explique la parenté des règles générales des deux textes." },

    { id: 'm2c1y02', chap: 'c1', type: 'single',
      q: "Quelle juridiction est compétente pour un litige portant sur une assurance-maladie complémentaire ?",
      choices: ["Le tribunal des assurances sociales", "Le tribunal civil", "Le tribunal administratif", "La FINMA"],
      answer: [1],
      explain: "La complémentaire est un contrat de droit privé soumis à la LCA : le juge civil est compétent, alors que l'assurance de base relève du tribunal des assurances sociales." },

    { id: 'm2c1y03', chap: 'c1', type: 'single',
      q: "La LPGA est :",
      choices: ["La loi sur la partie générale du droit des assurances sociales", "Une loi sur les placements collectifs", "La loi sur la prévoyance générale", "Une ordonnance d'application de la LCA"],
      answer: [0],
      explain: "Elle harmonise les notions communes aux assurances sociales (invalidité, incapacité de gain, procédure) mais ne s'applique pas aux contrats soumis à la LCA." },

    { id: 'm2c1y04', chap: 'c1', type: 'single',
      q: "Une association acquiert la personnalité juridique :",
      choices: ["Par l'inscription au registre du commerce dans tous les cas", "Dès qu'elle exprime dans ses statuts sa volonté d'être organisée corporativement", "Par décision du canton", "Par l'ouverture d'un compte bancaire"],
      answer: [1],
      explain: "Contrairement aux sociétés commerciales, l'association naît sans inscription ; celle-ci ne devient obligatoire que si elle exploite une entreprise en la forme commerciale." },

    { id: 'm2c1y05', chap: 'c1', type: 'single',
      q: "Le droit dispositif se caractérise par le fait que :",
      choices: ["Les parties peuvent y déroger par convention", "Il ne s'applique qu'aux entreprises", "Il est édicté par les cantons", "Il prime le droit impératif"],
      answer: [0],
      explain: "Il ne s'applique qu'à défaut d'accord contraire des parties : c'est la règle supplétive qui comble les silences du contrat." },

    { id: 'm2c1y06', chap: 'c1', type: 'multi',
      q: "Quelles caractéristiques valent pour le droit privé ?",
      choices: ["Rapport d'égalité entre les parties", "Autonomie de la volonté", "Compétence du juge civil", "Exercice de la puissance publique", "Application de la LCA"],
      answer: [0, 1, 2, 4],
      explain: "L'exercice de la puissance publique caractérise le droit public, où l'État impose unilatéralement sa volonté aux administrés." },

    { id: 'm2c1y07', chap: 'c1', type: 'single',
      q: "Une personne sous curatelle de portée générale :",
      choices: ["Conserve sa pleine capacité d'exercice", "Est privée de l'exercice des droits civils et agit par son curateur", "Perd sa capacité de jouissance", "Ne peut plus être assurée"],
      answer: [1],
      explain: "Elle demeure titulaire de droits (capacité de jouissance) mais ne peut plus s'obliger seule : le curateur la représente pour les actes juridiques." },

    { id: 'm2c1y08', chap: 'c1', type: 'single',
      q: "L'art. 8 CC pose la règle selon laquelle :",
      choices: ["Chacun doit prouver les faits qu'il allègue pour en déduire un droit", "Le juge établit les faits d'office", "La preuve incombe toujours au défendeur", "Les contrats doivent être écrits"],
      answer: [0],
      explain: "Cette règle sur le fardeau de la preuve est décisive en assurance : l'assuré prouve le sinistre, l'assureur prouve l'exclusion qu'il invoque." },

    { id: 'm2c1y09', chap: 'c1', type: 'single',
      q: "Les conventions internationales ratifiées par la Suisse :",
      choices: ["Font partie de l'ordre juridique suisse", "N'ont aucune valeur en droit interne", "Doivent être approuvées par chaque canton", "Priment la Constitution en toute hypothèse"],
      answer: [0],
      explain: "Le droit international ratifié est directement applicable en Suisse dès son entrée en vigueur, sans transposition dans une loi interne." },

    { id: 'm2c1y10', chap: 'c1', type: 'single',
      q: "Un contrat conclu par un mineur de 8 ans, incapable de discernement, est :",
      choices: ["Valable", "Nul", "Boiteux", "Annulable dans l'année"],
      answer: [1],
      explain: "Sans discernement, il n'y a pas de volonté juridiquement reconnue : l'acte est nul, contrairement à celui du mineur capable de discernement, simplement boiteux." },

    /* --------- c3 : LCA I --------- */
    { id: 'm2c3y01', chap: 'c3', type: 'single',
      q: "Un client remplit sa proposition avec l'aide d'un agent qui inscrit une réponse inexacte de sa propre initiative. Cette inexactitude :",
      choices: ["Est toujours imputée au client", "Peut être imputée à l'assureur, l'agent agissant pour son compte", "Rend le contrat nul", "Doit être signalée à la FINMA"],
      answer: [1],
      explain: "L'intermédiaire lié agit pour l'assureur : ce que sait ou fait l'agent lors de la conclusion est en principe opposable à la compagnie qu'il représente." },

    { id: 'm2c3y02', chap: 'c3', type: 'single',
      q: "L'assureur accepte la proposition après l'expiration du délai de liaison. Juridiquement, il s'agit :",
      choices: ["D'une acceptation valable", "D'une nouvelle offre que le client peut accepter ou refuser", "D'une réticence", "D'une modification unilatérale"],
      answer: [1],
      explain: "Le proposant étant libéré, l'acceptation tardive constitue une contre-offre ; le contrat ne se forme que si le client y consent." },

    { id: 'm2c3y03', chap: 'c3', type: 'single',
      q: "Les informations de l'art. 3 LCA doivent être fournies :",
      choices: ["Oralement uniquement", "De manière compréhensible et sur un support permettant la preuve par texte", "Par acte notarié", "Sur demande écrite du client"],
      answer: [1],
      explain: "L'exigence de compréhensibilité vise à empêcher que l'information se noie dans un document technique illisible pour le client." },

    { id: 'm2c3y04', chap: 'c3', type: 'single',
      q: "Un assuré a répondu « non » à une question sur d'éventuelles hospitalisations, alors qu'il a été hospitalisé deux ans plus tôt. Il s'agit :",
      choices: ["D'une simple inexactitude sans conséquence", "D'une réticence potentielle", "D'une prétention frauduleuse", "D'une aggravation du risque"],
      answer: [1],
      explain: "La réticence concerne la phase de conclusion ; la prétention frauduleuse vise le moment du sinistre, et l'aggravation la vie du contrat." },

    { id: 'm2c3y05', chap: 'c3', type: 'single',
      q: "Le délai de quatre semaines pour résilier en cas de réticence court dès :",
      choices: ["La conclusion du contrat", "La connaissance effective de la réticence par l'assureur", "La survenance du sinistre", "L'envoi de la police"],
      answer: [1],
      explain: "L'assureur qui tarde après avoir su perd son droit : la jurisprudence est stricte sur le point de départ de ce délai de péremption." },

    { id: 'm2c3y06', chap: 'c3', type: 'multi',
      q: "Quelles étapes marquent la conclusion d'un contrat d'assurance ?",
      choices: ["Information précontractuelle de l'assureur", "Proposition du client", "Examen du risque par l'assureur", "Acceptation, généralement matérialisée par la police", "Homologation par la FINMA"],
      answer: [0, 1, 2, 3],
      explain: "Aucune homologation n'est requise : la FINMA n'approuve les conditions à l'avance que dans des cas particuliers comme la maladie complémentaire." },

    { id: 'm2c3y07', chap: 'c3', type: 'single',
      q: "Un preneur révoque son contrat d'assurance ménage au 10e jour. Que devient la prime déjà versée ?",
      choices: ["Elle reste acquise à l'assureur", "Elle doit être restituée", "Elle est retenue à 50 %", "Elle est reportée sur un autre contrat"],
      answer: [1],
      explain: "La révocation anéantit le contrat dès l'origine : les prestations réciproques déjà exécutées doivent être restituées." },

    { id: 'm2c3y08', chap: 'c3', type: 'single',
      q: "Le devoir d'information de l'art. 3 LCA porte notamment sur :",
      choices: ["Le droit de révocation", "Le nom des actionnaires de l'assureur", "Le montant des commissions internes", "Le résultat technique de la branche"],
      answer: [0],
      explain: "Informer sur le droit de révocation est essentiel : sans cette information, le preneur ignorerait la faculté de revenir sur son engagement." },

    { id: 'm2c3y09', chap: 'c3', type: 'single',
      q: "Une assurance conclue pour couvrir un événement dont le preneur sait déjà qu'il s'est produit est :",
      choices: ["Valable", "Sans effet, faute d'aléa subjectif", "Valable avec une surprime", "Soumise à l'accord de la FINMA"],
      answer: [1],
      explain: "L'assurance suppose une incertitude ; celui qui connaît déjà la réalisation du risque ne transfère pas un aléa mais une dette certaine." },

    { id: 'm2c3y10', chap: 'c3', type: 'single',
      q: "Les conditions générales font partie du contrat :",
      choices: ["Automatiquement, même si le client ne les a jamais reçues", "Si elles ont été portées à la connaissance du client et acceptées par lui", "Uniquement si elles sont signées page par page", "Seulement après approbation de la FINMA"],
      answer: [1],
      explain: "L'intégration suppose que le client ait pu en prendre connaissance ; à défaut, elles ne lui sont pas opposables, et les clauses insolites sont écartées." },

    /* --------- c5 : LCA III --------- */
    { id: 'm2c5y01', chap: 'c5', type: 'single',
      q: "Un assuré ne fournit pas les pièces demandées pour instruire son sinistre. Le délai de quatre semaines de l'art. 41 LCA :",
      choices: ["Court malgré tout dès l'annonce", "Ne commence pas à courir tant que l'assureur ne dispose pas des renseignements nécessaires", "Est réduit à deux semaines", "Est suspendu une année"],
      answer: [1],
      explain: "Le point de départ est la réception des informations permettant de vérifier le bien-fondé de la prétention : l'assuré maîtrise donc en partie ce délai." },

    { id: 'm2c5y02', chap: 'c5', type: 'single',
      q: "Une clause prévoyant un délai de prescription de deux ans en faveur de l'assureur serait :",
      choices: ["Valable", "Nulle, car moins favorable que les 5 ans de l'art. 46 LCA", "Valable si le client la signe", "Valable pour les entreprises seulement"],
      answer: [1],
      explain: "On ne peut déroger aux dispositions semi-impératives qu'en faveur du preneur : raccourcir la prescription lui serait défavorable." },

    { id: 'm2c5y03', chap: 'c5', type: 'single',
      q: "L'assuré laisse volontairement les clés sur le contact de sa voiture, qui est volée. Il s'agit typiquement :",
      choices: ["D'une faute légère", "D'une faute grave permettant une réduction", "D'un dessein", "D'un cas fortuit"],
      answer: [1],
      explain: "Négliger une précaution élémentaire caractérise la faute grave : l'assureur peut réduire sa prestation dans la mesure du degré de la faute." },

    { id: 'm2c5y04', chap: 'c5', type: 'single',
      q: "Une exclusion de couverture doit figurer :",
      choices: ["Dans le contrat, de manière précise et non équivoque", "Dans une circulaire de la FINMA", "Dans la loi uniquement", "Sur le site internet de l'assureur"],
      answer: [0],
      explain: "Art. 33 LCA : ce qui n'est pas clairement exclu par le contrat reste couvert, dès lors que l'événement présente le caractère du risque assuré." },

    { id: 'm2c5y05', chap: 'c5', type: 'single',
      q: "Un assuré déclare un sinistre entièrement réel mais falsifie une facture pour accélérer le règlement. L'art. 40 LCA :",
      choices: ["Ne s'applique pas, le sinistre étant réel", "Peut s'appliquer, car il y a tromperie sur un fait pertinent", "S'applique uniquement au-delà de CHF 5 000.–", "Ne s'applique qu'en assurance-vie"],
      answer: [1],
      explain: "L'élément décisif est l'intention de tromper sur un fait déterminant, même si le sinistre lui-même est authentique." },

    { id: 'm2c5y06', chap: 'c5', type: 'multi',
      q: "Quelles affirmations sur la prescription de l'art. 46 LCA sont exactes ?",
      choices: ["Le délai est de 5 ans", "Il court dès le fait d'où naît l'obligation", "Il peut être interrompu par une poursuite ou une action en justice", "Le juge l'applique d'office", "Il était de 2 ans avant la révision"],
      answer: [0, 1, 2, 4],
      explain: "La prescription n'est jamais relevée d'office : le débiteur doit l'invoquer, faute de quoi il devra payer malgré l'écoulement du temps." },

    { id: 'm2c5y07', chap: 'c5', type: 'single',
      q: "L'assureur refuse une prestation en invoquant une exclusion. En cas de procès, il devra :",
      choices: ["Attendre que l'assuré prouve l'absence d'exclusion", "Prouver lui-même que les conditions de l'exclusion sont réunies", "Saisir la FINMA", "Faire trancher par l'Ombudsman"],
      answer: [1],
      explain: "Celui qui invoque un fait qui éteint ou empêche un droit doit le prouver : c'est le corollaire de l'art. 8 CC appliqué à l'assurance." },

    { id: 'm2c5y08', chap: 'c5', type: 'single',
      q: "En assurance de dommages, si l'assuré est indemnisé et obtient ensuite réparation du responsable, il doit :",
      choices: ["Conserver les deux montants", "Restituer à l'assureur ce qui excède son dommage, en vertu du principe indemnitaire", "Verser la différence à la FINMA", "Résilier son contrat"],
      answer: [1],
      explain: "Le cumul aboutirait à un enrichissement : c'est précisément ce que la subrogation et le principe indemnitaire empêchent." },

    { id: 'm2c5y09', chap: 'c5', type: 'single',
      q: "Quelle est la conséquence pratique la plus importante de l'art. 33 LCA pour la rédaction des CGA ?",
      choices: ["Les exclusions doivent être formulées clairement, sous peine d'être inopposables", "Les CGA doivent être approuvées par la FINMA", "Les CGA doivent être traduites en quatre langues", "Les CGA doivent être signées par un notaire"],
      answer: [0],
      explain: "Une exclusion vague se retourne contre son auteur : la précision rédactionnelle est le seul moyen pour l'assureur de délimiter effectivement sa couverture." },

    { id: 'm2c5y10', chap: 'c5', type: 'single',
      q: "Un assuré agit contre son assureur six ans après le sinistre, mais avait déposé une réquisition de poursuite la troisième année. La créance est :",
      choices: ["Prescrite", "Non prescrite, la poursuite ayant interrompu le délai", "Prescrite de moitié", "Imprescriptible"],
      answer: [1],
      explain: "L'interruption fait courir un nouveau délai de cinq ans à compter de l'acte interruptif : la créance reste donc exigible." },

    /* --------- c7 : responsabilité civile --------- */
    { id: 'm2c7y01', chap: 'c7', type: 'single',
      q: "Un cycliste renverse un piéton par inattention. Sur quelle base répond-il ?",
      choices: ["Art. 58 LCR (responsabilité causale aggravée)", "Art. 41 CO (responsabilité pour faute)", "Art. 55 CO", "Il ne répond pas"],
      answer: [1],
      explain: "Le vélo sans moteur n'est pas un véhicule à moteur au sens de la LCR : le cycliste répond selon la clause générale de l'art. 41 CO, donc pour faute." },

    { id: 'm2c7y02', chap: 'c7', type: 'single',
      q: "La responsabilité causale aggravée se justifie par :",
      choices: ["La faute présumée du responsable", "Le risque particulier créé par une activité ou une installation", "La solvabilité du responsable", "L'existence d'une assurance obligatoire"],
      answer: [1],
      explain: "Celui qui crée un danger accru en tire un profit et doit en assumer les conséquences, même sans le moindre reproche personnel." },

    { id: 'm2c7y03', chap: 'c7', type: 'single',
      q: "Deux personnes causent ensemble un même dommage. Envers le lésé, elles répondent :",
      choices: ["Chacune pour la moitié", "Solidairement", "Successivement", "Aucune n'est responsable"],
      answer: [1],
      explain: "Le lésé peut réclamer la totalité à l'une d'elles ; la répartition interne entre coresponsables s'opère ensuite selon la gravité de leurs fautes respectives." },

    { id: 'm2c7y04', chap: 'c7', type: 'single',
      q: "Le juge fixe l'indemnité en tenant compte :",
      choices: ["Uniquement du dommage prouvé", "Du dommage, de la gravité de la faute et des circonstances, y compris la faute du lésé", "Du montant de l'assurance souscrite", "Du revenu du responsable uniquement"],
      answer: [1],
      explain: "Art. 43 et 44 CO : l'étendue de la réparation est déterminée d'après les circonstances et la gravité de la faute, avec réduction en cas de faute concomitante." },

    { id: 'm2c7y05', chap: 'c7', type: 'single',
      q: "Un dommage est causé par une force majeure imprévisible et irrésistible. La responsabilité causale aggravée est :",
      choices: ["Maintenue intégralement", "Interrompue, la force majeure rompant le lien de causalité adéquate", "Réduite de moitié", "Transférée à l'État"],
      answer: [1],
      explain: "La force majeure est l'un des rares moyens libératoires en responsabilité causale aggravée, avec la faute grave du lésé ou d'un tiers." },

    { id: 'm2c7y06', chap: 'c7', type: 'multi',
      q: "Quels postes composent le dommage corporel indemnisable ?",
      choices: ["Les frais de traitement", "La perte de gain actuelle et future", "L'atteinte à l'avenir économique", "Le tort moral, à titre distinct", "Les amendes pénales du responsable"],
      answer: [0, 1, 2, 3],
      explain: "Les sanctions pénales sont personnelles au responsable et ne constituent pas un poste du dommage du lésé." },

    { id: 'm2c7y07', chap: 'c7', type: 'single',
      q: "L'assurance RC véhicule couvre les dommages causés :",
      choices: ["Au détenteur lui-même", "Aux tiers par l'emploi du véhicule", "Au véhicule assuré", "Aux passagers exclusivement"],
      answer: [1],
      explain: "Les dommages au véhicule lui-même relèvent de la casco ; la RC protège le patrimoine du détenteur contre les prétentions des tiers lésés." },

    { id: 'm2c7y08', chap: 'c7', type: 'single',
      q: "Un employeur prouve avoir choisi, instruit et surveillé son employé avec toute la diligence requise. Selon l'art. 55 CO :",
      choices: ["Il reste responsable", "Il est libéré par la preuve libératoire", "Il répond solidairement avec l'employé", "Il doit indemniser la moitié du dommage"],
      answer: [1],
      explain: "C'est la caractéristique de la causale simple : la diligence prouvée exonère, contrairement aux responsabilités causales aggravées." },

    { id: 'm2c7y09', chap: 'c7', type: 'single',
      q: "La victime d'un accident de la circulation dispose d'un délai de prescription de :",
      choices: ["1 an", "3 ans dès la connaissance du dommage et de l'auteur", "5 ans", "10 ans dès l'accident, sans délai relatif"],
      answer: [1],
      explain: "Le délai relatif est de 3 ans ; le délai absolu de 10 ans est porté à 20 ans en cas de lésions corporelles ou de décès." },

    { id: 'm2c7y10', chap: 'c7', type: 'single',
      q: "Le consentement éclairé du lésé à une activité risquée (sport de contact, par exemple) :",
      choices: ["Est sans effet", "Peut exclure l'illicéité pour les risques inhérents à l'activité acceptée", "Transfère la responsabilité à l'organisateur", "Double l'indemnité"],
      answer: [1],
      explain: "Accepter les risques normaux d'une pratique écarte l'illicéité pour ceux-ci, mais ne couvre évidemment pas les comportements gravement fautifs." }
  ]);
})();
