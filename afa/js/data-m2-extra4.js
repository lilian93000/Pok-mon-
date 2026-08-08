/* =============================================================
   AFA – Module 2, questions supplémentaires : chapitres 7 et 8
   (Responsabilité civile / LSA, LPD et LBA)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m2', [
    /* ================= c7 — Responsabilité civile ================= */
    { id: 'm2c7x01', chap: 'c7', type: 'single',
      q: "Le dommage au sens juridique se définit comme :",
      choices: ["Toute contrariété subie", "La diminution involontaire du patrimoine, soit la différence entre l'état actuel et celui sans l'événement", "Le montant réclamé par le lésé", "La somme d'assurance"],
      answer: [1],
      explain: "C'est la théorie de la différence. Elle englobe la perte éprouvée et le gain manqué, mais pas la souffrance, réparée par le tort moral." },

    { id: 'm2c7x02', chap: 'c7', type: 'single',
      q: "Le « lucrum cessans » désigne :",
      choices: ["La perte éprouvée", "Le gain manqué", "Le tort moral", "Les frais d'avocat"],
      answer: [1],
      explain: "Perte de salaire, chiffre d'affaires non réalisé : le gain manqué complète la perte éprouvée (damnum emergens) pour former le dommage total." },

    { id: 'm2c7x03', chap: 'c7', type: 'single',
      q: "La causalité « adéquate » signifie que :",
      choices: ["Le fait doit être la seule cause du dommage", "Le fait doit être, selon le cours ordinaire des choses, propre à produire un tel dommage", "Le dommage doit dépasser un certain montant", "Le lien doit être prouvé par un expert"],
      answer: [1],
      explain: "Elle complète la causalité naturelle et écarte les enchaînements insolites, afin d'éviter une responsabilité illimitée pour des conséquences imprévisibles." },

    { id: 'm2c7x04', chap: 'c7', type: 'single',
      q: "L'illicéité est réalisée lorsque :",
      choices: ["Un droit absolu est violé ou une norme protectrice est transgressée", "Le lésé subit une perte financière quelconque", "Le responsable est en faute", "Un contrat est résilié"],
      answer: [0],
      explain: "Atteinte à la vie, à l'intégrité corporelle ou à la propriété : illicéité de résultat. Le dommage purement économique suppose la violation d'une norme de protection." },

    { id: 'm2c7x05', chap: 'c7', type: 'multi',
      q: "Quels faits peuvent réduire ou supprimer la responsabilité ?",
      choices: ["La force majeure", "La faute grave du lésé", "La faute grave d'un tiers", "Le consentement du lésé", "L'absence d'assurance du responsable"],
      answer: [0, 1, 2, 3],
      explain: "L'absence d'assurance ne change rien à la responsabilité : elle en rend seulement l'exécution plus difficile pour la victime." },

    { id: 'm2c7x06', chap: 'c7', type: 'single',
      q: "Dans la responsabilité de l'art. 41 CO, qui doit prouver la faute ?",
      choices: ["Le responsable, qui doit prouver son absence de faute", "Le lésé", "Le juge d'office", "L'assureur RC"],
      answer: [1],
      explain: "C'est le régime de la responsabilité subjective : le lésé doit établir les quatre conditions, y compris la faute, ce qui est souvent difficile." },

    { id: 'm2c7x07', chap: 'c7', type: 'single',
      q: "Dans les responsabilités causales simples, le responsable peut se libérer :",
      choices: ["En prouvant qu'il a pris tous les soins commandés par les circonstances", "En prouvant qu'il n'était pas présent", "En invoquant son absence d'assurance", "Jamais"],
      answer: [0],
      explain: "C'est la preuve libératoire : l'employeur de l'art. 55 CO, par exemple, échappe à sa responsabilité s'il démontre avoir bien choisi, instruit et surveillé son auxiliaire." },

    { id: 'm2c7x08', chap: 'c7', type: 'single',
      q: "Un chien mord un passant. Sur quelle base son détenteur répond-il ?",
      choices: ["Art. 41 CO", "Art. 55 CO", "Art. 56 CO", "Art. 58 LCR"],
      answer: [2],
      explain: "L'art. 56 CO institue une responsabilité causale simple du détenteur d'animaux, avec possibilité de preuve libératoire s'il a pris toutes les précautions." },

    { id: 'm2c7x09', chap: 'c7', type: 'single',
      q: "Une tuile mal fixée tombe d'un toit et blesse un piéton. Qui répond ?",
      choices: ["Le locataire", "Le propriétaire de l'ouvrage (art. 58 CO)", "L'entreprise de nettoyage", "Personne, c'est un cas fortuit"],
      answer: [1],
      explain: "Le propriétaire répond des défauts de construction ou d'entretien de son ouvrage, indépendamment de toute faute personnelle." },

    { id: 'm2c7x10', chap: 'c7', type: 'multi',
      q: "Lesquelles sont des responsabilités causales aggravées ?",
      choices: ["Art. 58 LCR – détenteur de véhicule", "Responsabilité du fait des produits (LRFP)", "Responsabilité de l'exploitant d'installation nucléaire", "Art. 55 CO – employeur", "Art. 333 CC – chef de famille"],
      answer: [0, 1, 2],
      explain: "Les art. 55 CO et 333 CC admettent une preuve libératoire : ce sont des causales simples. Les aggravées reposent sur le risque créé et n'admettent pas d'exonération par la diligence." },

    { id: 'm2c7x11', chap: 'c7', type: 'single',
      q: "Le « détenteur » d'un véhicule est :",
      choices: ["Toujours le propriétaire inscrit", "Celui qui a le pouvoir de disposition effectif et l'utilise à ses frais et risques", "Le conducteur au moment de l'accident", "Le titulaire du permis de conduire"],
      answer: [1],
      explain: "Propriétaire et détenteur peuvent différer, par exemple en cas de leasing : c'est l'usage économique effectif qui détermine la qualité de détenteur." },

    { id: 'm2c7x12', chap: 'c7', type: 'single',
      q: "Un lésé peut-il agir directement contre l'assureur RC du détenteur de véhicule ?",
      choices: ["Non, il doit d'abord poursuivre le détenteur", "Oui, il dispose d'un droit d'action directe", "Oui, uniquement avec l'accord du détenteur", "Non, jamais"],
      answer: [1],
      explain: "L'action directe garantit une indemnisation rapide du lésé, sans le contraindre à supporter l'insolvabilité éventuelle du responsable." },

    { id: 'm2c7x13', chap: 'c7', type: 'single',
      q: "L'assureur RC véhicule paie un lésé alors que son assuré conduisait ivre. Il peut :",
      choices: ["Refuser de payer le lésé", "Exercer un recours contre son assuré", "Résilier avec effet rétroactif", "Réclamer le remboursement au lésé"],
      answer: [1],
      explain: "Les exceptions du contrat ne sont pas opposables au lésé : l'assureur indemnise d'abord, puis se retourne contre l'assuré fautif." },

    { id: 'm2c7x14', chap: 'c7', type: 'single',
      q: "Le Fonds national de garantie intervient pour les dommages causés par :",
      choices: ["Des véhicules étrangers", "Des véhicules non identifiés ou non assurés", "Des piétons", "Des installations ferroviaires"],
      answer: [1],
      explain: "Il évite qu'une victime reste sans indemnisation face à un chauffard en fuite ou à un détenteur ayant négligé son obligation d'assurance." },

    { id: 'm2c7x15', chap: 'c7', type: 'single',
      q: "Le tort moral se distingue du dommage parce qu'il :",
      choices: ["Répare une atteinte à la personnalité et une souffrance, non une perte patrimoniale", "Est toujours plus élevé", "Ne concerne que les entreprises", "Est fixé par la FINMA"],
      answer: [0],
      explain: "Art. 47 et 49 CO : il suppose une atteinte d'une certaine gravité et son montant est fixé en équité par le juge." },

    { id: 'm2c7x16', chap: 'c7', type: 'single',
      q: "Le délai de prescription relatif en matière d'acte illicite est de :",
      choices: ["1 an", "3 ans dès la connaissance du dommage et de l'auteur", "5 ans", "10 ans"],
      answer: [1],
      explain: "Le délai absolu est de 10 ans dès le fait dommageable, porté à 20 ans en cas de mort ou de lésions corporelles." },

    { id: 'm2c7x17', chap: 'c7', type: 'single',
      q: "La responsabilité du fait des produits (LRFP) frappe :",
      choices: ["Le seul détaillant", "Le producteur, pour les dommages causés par un produit défectueux", "L'acheteur", "L'assureur du produit"],
      answer: [1],
      explain: "Elle protège les consommateurs sans exiger la preuve d'une faute ; l'importateur et, à défaut d'identification du producteur, le fournisseur peuvent également répondre." },

    { id: 'm2c7x18', chap: 'c7', type: 'single',
      q: "Un employé cause un dommage à un client pendant son travail. Sur quelle base l'employeur peut-il répondre ?",
      choices: ["Art. 41 CO uniquement", "Art. 55 CO, responsabilité pour les auxiliaires", "Art. 58 LCR", "Il ne répond jamais"],
      answer: [1],
      explain: "L'employeur répond du dommage causé par ses auxiliaires dans l'accomplissement de leur travail, sauf preuve libératoire de la diligence requise." },

    { id: 'm2c7x19', chap: 'c7', type: 'single',
      q: "Le chef de famille répond selon l'art. 333 CC :",
      choices: ["Du dommage causé par les personnes mineures ou sous curatelle vivant dans son ménage", "De toutes les dettes de sa famille", "Uniquement des dommages causés par ses animaux", "Des accidents de la circulation de ses enfants majeurs"],
      answer: [0],
      explain: "Responsabilité causale simple : il se libère en prouvant avoir exercé la surveillance usuelle et l'attention commandée par les circonstances." },

    { id: 'm2c7x20', chap: 'c7', type: 'multi',
      q: "Quelles conditions sont communes à toutes les responsabilités civiles ?",
      choices: ["Un dommage", "Un lien de causalité", "L'illicéité ou la réalisation du risque légalement visé", "Une faute", "Un contrat entre les parties"],
      answer: [0, 1, 2],
      explain: "La faute n'est requise que dans la responsabilité subjective, et aucun contrat n'est nécessaire en matière délictuelle." },

    { id: 'm2c7x21', chap: 'c7', type: 'single',
      q: "La faute concomitante du lésé a pour effet :",
      choices: ["De supprimer toujours la responsabilité", "De réduire l'indemnité, voire de l'exclure si elle est très grave", "D'augmenter l'indemnité", "D'être sans effet"],
      answer: [1],
      explain: "Le juge tient compte de la part de responsabilité de la victime dans la survenance de son propre dommage pour fixer l'indemnité." },

    { id: 'm2c7x22', chap: 'c7', type: 'single',
      q: "L'assurance RC privée couvre typiquement :",
      choices: ["Les dommages causés à des tiers dans la vie privée", "Les dommages causés dans l'exercice d'une activité professionnelle indépendante", "Les amendes", "Les dommages à ses propres biens"],
      answer: [0],
      explain: "L'activité professionnelle relève d'une RC d'entreprise ou professionnelle ; les propres biens relèvent de l'assurance de choses." },

    { id: 'm2c7x23', chap: 'c7', type: 'single',
      q: "La fonction dite « passive » de l'assurance RC consiste à :",
      choices: ["Payer les prétentions justifiées", "Repousser les prétentions injustifiées, y compris en assumant la défense juridique", "Attendre le jugement", "Réduire la prime"],
      answer: [1],
      explain: "L'assureur RC est aussi un bouclier juridique : il conteste et fait rejeter les réclamations infondées, ce qui a une grande valeur économique." },

    { id: 'm2c7x24', chap: 'c7', type: 'single',
      q: "Un dommage purement économique, sans atteinte à un bien ou à une personne, est réparable :",
      choices: ["Toujours", "Seulement si une norme protectrice a été violée ou en cas de rapport contractuel", "Jamais", "Uniquement en RC véhicule"],
      answer: [1],
      explain: "L'illicéité de comportement suppose la violation d'une norme destinée à protéger le lésé contre ce type d'atteinte patrimoniale." },

    { id: 'm2c7x25', chap: 'c7', type: 'single',
      q: "La responsabilité de l'exploitant d'une installation nucléaire est :",
      choices: ["Limitée à CHF 1 million", "Illimitée et canalisée sur l'exploitant", "Exclue par la loi", "Assumée par la Confédération seule"],
      answer: [1],
      explain: "Le régime le plus sévère du droit suisse : responsabilité objective aggravée, illimitée dans son montant et concentrée sur un seul débiteur identifié." },

    /* ================= c8 — LSA, LPD, LBA ================= */
    { id: 'm2c8x01', chap: 'c8', type: 'single',
      q: "Depuis quand la LSA révisée est-elle en vigueur ?",
      choices: ["1er janvier 2022", "1er septembre 2023", "1er janvier 2024", "1er juillet 2021"],
      answer: [2],
      explain: "La LCA révisée date du 1.1.2022, la nLPD du 1.9.2023 et la LSA révisée du 1.1.2024 : trois dates à ne pas confondre à l'examen." },

    { id: 'm2c8x02', chap: 'c8', type: 'single',
      q: "Le critère décisif pour distinguer intermédiaire lié et non lié est :",
      choices: ["Le mode de rémunération", "L'intérêt représenté : celui de l'assureur ou celui du preneur", "Le nombre de contrats vendus", "Le lieu de travail"],
      answer: [1],
      explain: "Un courtier reste non lié même s'il est payé par courtages : ce qui compte est qu'il agisse juridiquement pour le compte de son client." },

    { id: 'm2c8x03', chap: 'c8', type: 'multi',
      q: "Que doit contenir l'information de l'art. 45 LSA ?",
      choices: ["L'identité et l'adresse de l'intermédiaire", "Son statut lié ou non lié", "Les entreprises d'assurance qu'il représente", "Qui répond en cas de conseil fautif", "Les comptes annuels de l'assureur"],
      answer: [0, 1, 2, 3],
      explain: "Il s'agit de permettre au client de savoir à qui il a affaire, pour qui son interlocuteur travaille et vers qui se tourner en cas de problème." },

    { id: 'm2c8x04', chap: 'c8', type: 'single',
      q: "Un intermédiaire non lié omet d'informer son client des commissions reçues de l'assureur. Il viole :",
      choices: ["La LBA", "Ses devoirs de transparence et de gestion des conflits d'intérêts selon la LSA", "La LAMal", "Le droit de timbre"],
      answer: [1],
      explain: "Il ne peut conserver ces indemnités qu'avec l'accord exprès du client, informé de leur nature et de leur ampleur." },

    { id: 'm2c8x05', chap: 'c8', type: 'single',
      q: "Quelle sanction la FINMA peut-elle prononcer contre un intermédiaire fautif ?",
      choices: ["Une peine de prison", "La radiation du registre et une interdiction d'exercer", "La résiliation des contrats de ses clients", "Une majoration de ses primes"],
      answer: [1],
      explain: "La FINMA prononce des mesures administratives ; les sanctions pénales relèvent des autorités judiciaires ordinaires." },

    { id: 'm2c8x06', chap: 'c8', type: 'single',
      q: "La nLPD protège :",
      choices: ["Les personnes physiques et morales", "Uniquement les personnes physiques", "Uniquement les entreprises", "Uniquement les personnes domiciliées en Suisse"],
      answer: [1],
      explain: "C'est un changement majeur par rapport à l'ancien droit : les données des personnes morales ne bénéficient plus de la protection de la LPD." },

    { id: 'm2c8x07', chap: 'c8', type: 'multi',
      q: "Quels principes régissent tout traitement de données personnelles ?",
      choices: ["Licéité", "Bonne foi et proportionnalité", "Finalité reconnaissable", "Exactitude des données", "Gratuité du traitement"],
      answer: [0, 1, 2, 3],
      explain: "S'y ajoutent la sécurité des données et la protection dès la conception (privacy by design et by default)." },

    { id: 'm2c8x08', chap: 'c8', type: 'single',
      q: "Quel type de consentement les données de santé exigent-elles ?",
      choices: ["Aucun", "Un consentement exprès", "Un consentement tacite suffit", "L'accord de la FINMA"],
      answer: [1],
      explain: "Données sensibles par nature, elles sont omniprésentes en assurance de personnes : le consentement doit être explicite et documenté." },

    { id: 'm2c8x09', chap: 'c8', type: 'single',
      q: "Le droit d'accès permet à la personne concernée :",
      choices: ["De consulter les données la concernant et d'en obtenir une copie", "D'accéder aux locaux de l'assureur", "De consulter les dossiers des autres assurés", "D'obtenir une indemnité automatique"],
      answer: [0],
      explain: "Il est en principe gratuit et doit être satisfait dans un délai de 30 jours ; il permet ensuite d'exiger rectification ou effacement." },

    { id: 'm2c8x10', chap: 'c8', type: 'single',
      q: "Le registre des activités de traitement est :",
      choices: ["Facultatif pour tous", "Obligatoire, avec des allègements pour les petites entreprises à faible risque", "Tenu par le PFPDT", "Public"],
      answer: [1],
      explain: "Il documente les traitements effectués et constitue le premier élément demandé lors d'un contrôle du préposé fédéral." },

    { id: 'm2c8x11', chap: 'c8', type: 'single',
      q: "Une analyse d'impact relative à la protection des données est requise :",
      choices: ["Pour tout traitement", "Lorsque le traitement présente un risque élevé pour la personnalité ou les droits fondamentaux", "Uniquement pour les banques", "Jamais en assurance"],
      answer: [1],
      explain: "Profilage à risque élevé ou traitement massif de données sensibles imposent d'évaluer préalablement les risques et les mesures de protection." },

    { id: 'm2c8x12', chap: 'c8', type: 'single',
      q: "Les sanctions pénales de la nLPD frappent :",
      choices: ["L'entreprise en tant que telle uniquement", "Les personnes physiques responsables, jusqu'à CHF 250 000.– d'amende", "Les clients", "La FINMA"],
      answer: [1],
      explain: "Contrairement au RGPD européen, la loi suisse vise la personne physique responsable de la violation, non l'entreprise via un pourcentage du chiffre d'affaires." },

    { id: 'm2c8x13', chap: 'c8', type: 'single',
      q: "Pourquoi les assurances de choses échappent-elles à la LBA, alors que l'assurance-vie y est soumise ?",
      choices: ["Parce que leurs primes sont plus faibles", "Parce qu'elles ne comportent pas de composante de placement permettant d'y faire transiter des fonds", "Parce qu'elles ne sont pas surveillées par la FINMA", "Parce qu'elles ne concernent que des particuliers"],
      answer: [1],
      explain: "La LBA vise les intermédiaires financiers. Une police ménage rembourse un dommage et ne permet pas de placer de l'argent ; une assurance-vie à composante d'épargne, si — d'où son assujettissement." },

    { id: 'm2c8x14', chap: 'c8', type: 'multi',
      q: "Quelles obligations de diligence la LBA impose-t-elle ?",
      choices: ["Vérifier l'identité du cocontractant", "Identifier l'ayant droit économique", "Procéder à des clarifications particulières en cas de risque accru", "Conserver les documents 10 ans", "Informer le client de toute communication au MROS"],
      answer: [0, 1, 2, 3],
      explain: "Informer le client est au contraire interdit : c'est l'interdiction du « tipping off », qui garantit l'efficacité de l'enquête." },

    { id: 'm2c8x15', chap: 'c8', type: 'single',
      q: "Qu'est-ce qu'une PEP au sens de la LBA ?",
      choices: ["Une police d'épargne privilégiée", "Une personne politiquement exposée, soumise à des clarifications renforcées", "Un produit d'épargne-prévoyance", "Un plan d'exploitation particulier"],
      answer: [1],
      explain: "Les personnes exerçant des fonctions publiques importantes, et leurs proches, présentent un risque accru de corruption : la relation d'affaires exige une vigilance renforcée." },

    { id: 'm2c8x16', chap: 'c8', type: 'single',
      q: "En cas de soupçon fondé de blanchiment, l'intermédiaire financier doit :",
      choices: ["Résilier le contrat sans rien dire", "Communiquer au MROS et bloquer les avoirs", "Informer la police cantonale et le client", "Attendre une décision de justice"],
      answer: [1],
      explain: "La communication s'accompagne du blocage des valeurs et de l'interdiction d'informer le client de la démarche entreprise." },

    { id: 'm2c8x17', chap: 'c8', type: 'single',
      q: "Un OAR (organisme d'autorégulation) est :",
      choices: ["Un tribunal spécialisé", "Un organisme reconnu qui surveille l'application de la LBA auprès de ses membres", "Une association de consommateurs", "Un service de la FINMA"],
      answer: [1],
      explain: "L'OAR-ASA regroupe les assureurs-vie : il édicte un règlement et contrôle ses affiliés, sous la supervision de la FINMA." },

    { id: 'm2c8x18', chap: 'c8', type: 'single',
      q: "Quelles assurances sont considérées comme des instruments financiers au sens de la LSFin ?",
      choices: ["Toutes les assurances-vie", "Les assurances-vie qualifiées, susceptibles de rachat et liées à des parts ou instruments financiers", "Les assurances de choses", "Aucune"],
      answer: [1],
      explain: "Pour ces produits à composante de placement, les règles de conduite de la LSFin s'appliquent : vérification du caractère approprié et feuille d'information de base." },

    { id: 'm2c8x19', chap: 'c8', type: 'single',
      q: "Un intermédiaire non lié travaille pour une entreprise d'assurance non autorisée en Suisse. Conséquence :",
      choices: ["Aucune, s'il informe ses clients", "Il ne remplit plus les conditions d'inscription au registre", "Il doit simplement doubler sa RC professionnelle", "Il doit s'annoncer au MROS"],
      answer: [1],
      explain: "Ne pas collaborer avec des assureurs non autorisés est une condition légale d'inscription : sa violation entraîne la radiation du registre." },

    { id: 'm2c8x20', chap: 'c8', type: 'single',
      q: "La FINMA peut-elle contraindre un assureur à verser une prestation à un assuré déterminé ?",
      choices: ["Oui, sur plainte de l'assuré", "Non, les litiges contractuels relèvent de l'Ombudsman puis du juge civil", "Oui, si le montant dépasse CHF 50 000.–", "Oui, en assurance-vie uniquement"],
      answer: [1],
      explain: "La FINMA veille au respect du droit de la surveillance, non à l'exécution des contrats individuels : c'est une distinction fréquemment testée." },

    { id: 'm2c8x21', chap: 'c8', type: 'multi',
      q: "Quelles conditions doit remplir un intermédiaire pour figurer au registre ?",
      choices: ["Qualifications professionnelles et formation continue", "RC professionnelle ou garantie financière équivalente", "Garantie d'une activité irréprochable et bonne réputation", "Capital minimal de CHF 50 000.–", "Ne pas travailler pour un assureur non autorisé"],
      answer: [0, 1, 2, 4],
      explain: "Aucun capital minimal n'est requis : c'est la RC professionnelle qui assure la protection financière des clients en cas de conseil fautif." },

    { id: 'm2c8x22', chap: 'c8', type: 'single',
      q: "Le transfert de données personnelles vers un pays sans protection adéquate suppose :",
      choices: ["Rien de particulier", "Des garanties appropriées, telles que des clauses contractuelles types", "L'accord préalable de la FINMA", "Une interdiction absolue"],
      answer: [1],
      explain: "À défaut de décision d'adéquation du Conseil fédéral, l'exportateur doit mettre en place des garanties contractuelles ou obtenir un consentement éclairé." },

    { id: 'm2c8x23', chap: 'c8', type: 'single',
      q: "Le devoir d'informer lors de la collecte de données impose de communiquer :",
      choices: ["L'identité du responsable, la finalité du traitement et les destinataires éventuels", "Le chiffre d'affaires de l'entreprise", "Le nom de tous les collaborateurs", "Les données des autres clients"],
      answer: [0],
      explain: "La personne concernée doit pouvoir comprendre qui traite quoi, pourquoi, et à qui les données seront éventuellement transmises." },

    { id: 'm2c8x24', chap: 'c8', type: 'single',
      q: "Quand une violation de la sécurité des données doit-elle être annoncée au PFPDT ?",
      choices: ["Toujours, sans exception", "Lorsqu'elle entraîne vraisemblablement un risque élevé pour la personnalité ou les droits fondamentaux", "Une fois par an", "Uniquement si un client se plaint"],
      answer: [1],
      explain: "L'annonce doit intervenir dans les meilleurs délais ; la personne concernée doit également être informée si sa protection l'exige." },

    { id: 'm2c8x25', chap: 'c8', type: 'single',
      q: "Un courtier conserve les documents de conseil de ses clients. Cette conservation :",
      choices: ["Est inutile", "Sert de preuve du respect de ses devoirs professionnels", "Est interdite par la LPD", "Doit être limitée à trois mois"],
      answer: [1],
      explain: "La LPD n'interdit pas la conservation : elle exige une finalité légitime, une durée proportionnée et une sécurité adéquate des données." },

    { id: 'm2c8x26', chap: 'c8', type: 'single',
      q: "Le cumul des statuts d'intermédiaire lié et non lié est :",
      choices: ["Autorisé avec information du client", "Interdit par la LSA", "Autorisé pour les seules assurances de personnes", "Soumis à autorisation de l'ASA"],
      answer: [1],
      explain: "Le conflit d'intérêts serait structurel : on ne peut pas défendre simultanément l'intérêt du client et celui de l'assureur." },

    { id: 'm2c8x27', chap: 'c8', type: 'single',
      q: "L'obligation de formation continue de l'intermédiaire découle :",
      choices: ["Du seul contrat de travail", "De la LSA et du standard minimal de la branche", "De la LBA", "Du CO"],
      answer: [1],
      explain: "Elle conditionne le maintien de l'inscription au registre et s'atteste via une plateforme reconnue de la branche." },

    { id: 'm2c8x28', chap: 'c8', type: 'multi',
      q: "Quelles affirmations sur la LBA en assurance sont exactes ?",
      choices: ["L'assurance-vie directe y est soumise", "Les documents se conservent 10 ans", "Le MROS reçoit les communications de soupçon", "Le client doit être informé de la communication", "L'assurance dommages n'y est pas soumise"],
      answer: [0, 1, 2, 4],
      explain: "L'interdiction d'informer le client (« tipping off ») est un pilier du dispositif : le prévenir compromettrait l'enquête et expose à des sanctions." },

    { id: 'm2c8x29', chap: 'c8', type: 'single',
      q: "Un client demande l'effacement de ses données alors que le contrat est toujours en cours. L'assureur :",
      choices: ["Doit tout effacer immédiatement", "Peut refuser dans la mesure où la conservation est nécessaire à l'exécution du contrat ou imposée par la loi", "Doit saisir le PFPDT", "Doit résilier le contrat"],
      answer: [1],
      explain: "Le droit à l'effacement n'est pas absolu : obligations légales de conservation et nécessité contractuelle constituent des motifs justificatifs." },

    { id: 'm2c8x30', chap: 'c8', type: 'single',
      q: "Un intermédiaire découvre que son client souhaite verser une prime unique très élevée en espèces, d'origine inexpliquée, sur une assurance-vie. Il doit :",
      choices: ["Accepter sans question, le client étant roi", "Procéder aux clarifications requises et, en cas de soupçon fondé, communiquer au MROS", "Refuser et prévenir immédiatement le client de ses soupçons", "En informer la presse"],
      answer: [1],
      explain: "Le cas typique de risque accru : clarification de l'origine des fonds, documentation, puis communication si le soupçon subsiste — sans jamais avertir le client." }
  ]);
})();
