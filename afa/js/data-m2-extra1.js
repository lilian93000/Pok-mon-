/* =============================================================
   AFA – Module 2, questions supplémentaires : chapitres 1 et 2
   (Bases du droit suisse / Le contrat selon le CO)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m2', [
    /* ================= c1 — Bases du droit ================= */
    { id: 'm2c1x01', chap: 'c1', type: 'single',
      q: "Quelle est la norme suprême de l'ordre juridique suisse ?",
      choices: ["Le Code des obligations", "La Constitution fédérale", "Les ordonnances du Conseil fédéral", "La jurisprudence du Tribunal fédéral"],
      answer: [1],
      explain: "La Constitution fédérale se situe au sommet de la hiérarchie : lois et ordonnances doivent s'y conformer, de même que le droit cantonal." },

    { id: 'm2c1x02', chap: 'c1', type: 'single',
      q: "Qui édicte les ordonnances comme l'OS ou l'OSA ?",
      choices: ["Le Parlement", "Le Conseil fédéral", "Le Tribunal fédéral", "La FINMA seule"],
      answer: [1],
      explain: "Les ordonnances d'exécution émanent du Conseil fédéral et précisent les lois adoptées par le Parlement ; la FINMA édicte pour sa part des circulaires." },

    { id: 'm2c1x03', chap: 'c1', type: 'single',
      q: "Une loi fédérale peut faire l'objet :",
      choices: ["D'un référendum facultatif", "D'aucune contestation populaire", "D'un veto de la FINMA", "D'un recours au Tribunal fédéral pour inconstitutionnalité"],
      answer: [0],
      explain: "50 000 signatures permettent de soumettre une loi fédérale au vote populaire. Le Tribunal fédéral ne peut pas refuser d'appliquer une loi fédérale (art. 190 Cst.)." },

    { id: 'm2c1x04', chap: 'c1', type: 'multi',
      q: "Quelles sont des sources du droit suisse ?",
      choices: ["La loi", "La coutume", "La jurisprudence", "La doctrine", "Les conditions générales d'assurance"],
      answer: [0, 1, 2, 3],
      explain: "Les CGA sont des clauses contractuelles, pas une source du droit : elles ne valent qu'entre les parties et doivent respecter les lois impératives." },

    { id: 'm2c1x05', chap: 'c1', type: 'single',
      q: "Quand la personnalité juridique d'un être humain commence-t-elle ?",
      choices: ["À la conception", "À la naissance accomplie de l'enfant vivant", "À la majorité", "À l'inscription à l'état civil"],
      answer: [1],
      explain: "Art. 31 CC. L'enfant conçu jouit toutefois de droits conditionnels, sous réserve qu'il naisse vivant — ce qui compte en droit successoral et en assurance-vie." },

    { id: 'm2c1x06', chap: 'c1', type: 'single',
      q: "La capacité de jouissance appartient :",
      choices: ["Aux seuls majeurs", "À toute personne, sans exception", "Aux seules personnes capables de discernement", "Aux seules personnes morales"],
      answer: [1],
      explain: "Toute personne peut être titulaire de droits et d'obligations. C'est la capacité d'exercice — s'obliger soi-même — qui suppose majorité et discernement." },

    { id: 'm2c1x07', chap: 'c1', type: 'single',
      q: "Un mineur de 16 ans capable de discernement conclut seul une assurance ménage. Le contrat est :",
      choices: ["Nul de plein droit", "Valable sans réserve", "Boiteux, sa validité dépendant de la ratification du représentant légal", "Annulable dans un délai de cinq ans"],
      answer: [2],
      explain: "L'acte reste en suspens : si le représentant légal l'approuve, il devient valable rétroactivement ; à défaut, il est caduc." },

    { id: 'm2c1x08', chap: 'c1', type: 'single',
      q: "Le droit public se caractérise par :",
      choices: ["Un rapport d'égalité entre les parties", "Un rapport de subordination entre l'État et l'administré", "L'absence de sanctions", "Son application par les seuls tribunaux civils"],
      answer: [1],
      explain: "L'État y exerce la puissance publique. En droit privé, les parties sont juridiquement égales et organisent librement leurs rapports." },

    { id: 'm2c1x09', chap: 'c1', type: 'multi',
      q: "Quelles matières relèvent du droit privé ?",
      choices: ["Le contrat d'assurance (LCA)", "Le droit des obligations", "Le droit de la famille", "La surveillance des assurances (LSA)", "L'assurance-accidents obligatoire (LAA)"],
      answer: [0, 1, 2],
      explain: "LSA et LAA organisent l'intervention de l'État et des assurances sociales : elles appartiennent au droit public." },

    { id: 'm2c1x10', chap: 'c1', type: 'single',
      q: "Quand une personne morale de type SA acquiert-elle la personnalité juridique ?",
      choices: ["À la signature des statuts", "À l'inscription au registre du commerce", "À la première assemblée générale", "Au versement du capital"],
      answer: [1],
      explain: "L'inscription est constitutive pour les sociétés commerciales. Les associations, elles, naissent dès l'adoption de leurs statuts, sans inscription obligatoire." },

    { id: 'm2c1x11', chap: 'c1', type: 'single',
      q: "Que prévoit l'art. 1 CC en l'absence de loi et de coutume applicables ?",
      choices: ["Le juge refuse de statuer", "Le juge prononce selon les règles qu'il établirait s'il avait à faire acte de législateur", "L'affaire est renvoyée au Parlement", "On applique le droit étranger"],
      answer: [1],
      explain: "Le juge comble la lacune en s'inspirant des solutions consacrées par la doctrine et la jurisprudence : c'est le fondement du pouvoir créateur du juge suisse." },

    { id: 'm2c1x12', chap: 'c1', type: 'single',
      q: "Une norme impérative se caractérise par le fait que :",
      choices: ["Les parties peuvent y déroger librement", "Les parties ne peuvent pas y déroger par contrat", "Elle ne s'applique qu'aux entreprises", "Elle est facultative pour le juge"],
      answer: [1],
      explain: "L'art. 97 LCA énumère les dispositions absolument impératives ; l'art. 98 vise les semi-impératives, auxquelles on ne peut déroger qu'en faveur de l'assuré." },

    { id: 'm2c1x13', chap: 'c1', type: 'single',
      q: "Le principe de la bonne foi (art. 2 CC) impose :",
      choices: ["D'agir loyalement dans l'exercice de ses droits", "De déclarer tous ses revenus", "De consulter un avocat", "De conclure un contrat écrit"],
      answer: [0],
      explain: "L'abus manifeste d'un droit n'est pas protégé par la loi. Cette règle générale irrigue tout le droit, y compris l'interprétation des contrats d'assurance." },

    { id: 'm2c1x14', chap: 'c1', type: 'single',
      q: "Le Tribunal fédéral est :",
      choices: ["La plus haute autorité judiciaire de la Confédération", "Une autorité administrative", "Un organe de la FINMA", "Une instance de médiation"],
      answer: [0],
      explain: "Ses arrêts unifient l'application du droit fédéral ; ils constituent une source majeure d'interprétation, notamment en droit des assurances." },

    { id: 'm2c1x15', chap: 'c1', type: 'single',
      q: "Une personne durablement incapable de discernement :",
      choices: ["Peut conclure seule tout contrat", "Ne peut pas s'obliger valablement par ses propres actes", "Perd sa capacité de jouissance", "Devient automatiquement une personne morale"],
      answer: [1],
      explain: "Elle conserve la capacité de jouissance — elle reste titulaire de droits — mais ses actes juridiques sont nuls ; elle agit par un représentant légal." },

    { id: 'm2c1x16', chap: 'c1', type: 'multi',
      q: "Quelles lois s'appliquent à une assurance-maladie complémentaire ?",
      choices: ["La LCA", "Le CO à titre subsidiaire", "La LAMal", "La LSA pour la surveillance de l'assureur", "La LPP"],
      answer: [0, 1, 3],
      explain: "La complémentaire est un contrat privé soumis à la LCA, complété par le CO ; l'assureur qui la propose est surveillé selon la LSA." },

    { id: 'm2c1x17', chap: 'c1', type: 'single',
      q: "Le droit cantonal peut-il déroger au droit fédéral ?",
      choices: ["Oui, s'il est plus récent", "Non, le droit fédéral prime", "Oui, en matière d'assurance uniquement", "Oui, avec l'accord du Conseil fédéral"],
      answer: [1],
      explain: "La force dérogatoire du droit fédéral est un principe constitutionnel : le droit cantonal contraire est inapplicable." },

    { id: 'm2c1x18', chap: 'c1', type: 'single',
      q: "La majorité civile en Suisse est atteinte à :",
      choices: ["16 ans", "18 ans", "20 ans", "21 ans"],
      answer: [1],
      explain: "18 ans révolus. Combinée à la capacité de discernement, la majorité confère la pleine capacité d'exercice des droits civils." },

    { id: 'm2c1x19', chap: 'c1', type: 'single',
      q: "Les circulaires de la FINMA :",
      choices: ["Ont rang de loi fédérale", "Précisent la pratique de l'autorité dans l'application du droit de la surveillance", "Lient les tribunaux civils", "Remplacent les ordonnances"],
      answer: [1],
      explain: "Elles explicitent comment la FINMA entend appliquer la loi. Sans être des normes au sens formel, elles orientent fortement la pratique des assujettis." },

    { id: 'm2c1x20', chap: 'c1', type: 'single',
      q: "L'assurance-accidents obligatoire (LAA) relève :",
      choices: ["Du droit privé", "Du droit public des assurances sociales", "Du droit pénal", "Du droit international"],
      answer: [1],
      explain: "Les assurances sociales appartiennent au droit public : les litiges s'y règlent devant les tribunaux cantonaux des assurances, non devant le juge civil ordinaire." },

    /* ================= c2 — Le contrat selon le CO ================= */
    { id: 'm2c2x01', chap: 'c2', type: 'single',
      q: "Une offre faite entre présents doit être acceptée :",
      choices: ["Dans les 14 jours", "Sur-le-champ", "Dans le mois", "Dans un délai raisonnable de 30 jours"],
      answer: [1],
      explain: "Faute d'acceptation immédiate, l'auteur de l'offre entre présents (y compris par téléphone) n'est plus lié." },

    { id: 'm2c2x02', chap: 'c2', type: 'single',
      q: "Quel principe régit la forme des contrats en droit suisse ?",
      choices: ["La forme écrite est toujours obligatoire", "La liberté de la forme, sauf exception légale ou conventionnelle", "La forme authentique est la règle", "Seuls les contrats oraux sont valables"],
      answer: [1],
      explain: "Art. 11 CO. Les exceptions visent notamment la vente d'immeubles (acte authentique) ou la cession de créance (forme écrite)." },

    { id: 'm2c2x03', chap: 'c2', type: 'single',
      q: "Un contrat dont l'objet est illicite ou contraire aux mœurs est :",
      choices: ["Valable mais résiliable", "Nul (art. 20 CO)", "Annulable dans un délai d'un an", "Valable si les parties le confirment"],
      answer: [1],
      explain: "La nullité est absolue : le contrat ne produit aucun effet, elle peut être invoquée en tout temps et par toute personne intéressée." },

    { id: 'm2c2x04', chap: 'c2', type: 'single',
      q: "L'erreur portant sur les simples motifs d'une partie est :",
      choices: ["Toujours essentielle", "En principe non essentielle, donc sans effet sur la validité", "Un cas de dol", "Un cas de crainte fondée"],
      answer: [1],
      explain: "Se tromper sur la rentabilité ou l'opportunité d'une affaire ne permet pas d'invalider le contrat : seules les erreurs qualifiées d'essentielles le permettent." },

    { id: 'm2c2x05', chap: 'c2', type: 'single',
      q: "Le dol se définit comme :",
      choices: ["Une erreur spontanée", "Une tromperie intentionnelle amenant l'autre partie à contracter", "Une menace physique", "Un défaut de forme"],
      answer: [1],
      explain: "Contrairement à l'erreur, le dol suppose une manœuvre volontaire de l'autre partie. La victime peut invalider le contrat même si l'erreur n'était pas essentielle." },

    { id: 'm2c2x06', chap: 'c2', type: 'single',
      q: "À partir de quand court le délai d'un an pour invalider un contrat entaché de crainte fondée ?",
      choices: ["Dès la conclusion du contrat", "Dès que la crainte a cessé", "Dès la découverte du dommage", "Dès le premier paiement"],
      answer: [1],
      explain: "Art. 31 CO : le délai part de la découverte de l'erreur ou du dol, ou de la disparition de la crainte, car la victime ne peut agir tant qu'elle est sous pression." },

    { id: 'm2c2x07', chap: 'c2', type: 'single',
      q: "Que se passe-t-il si la victime d'un dol laisse s'écouler le délai d'un an sans agir ?",
      choices: ["Le contrat devient nul", "Le contrat est tenu pour ratifié", "Le délai se prolonge de dix ans", "Le juge invalide d'office"],
      answer: [1],
      explain: "Le silence vaut ratification : le contrat est définitivement valable, ce qui garantit la sécurité des transactions." },

    { id: 'm2c2x08', chap: 'c2', type: 'multi',
      q: "Quelles conditions sont nécessaires à la formation d'un contrat valable ?",
      choices: ["Des manifestations de volonté réciproques et concordantes", "La capacité d'exercice des parties", "Un objet licite et possible", "Le respect de la forme lorsqu'elle est prescrite", "Une signature devant notaire"],
      answer: [0, 1, 2, 3],
      explain: "L'acte authentique n'est exigé que dans des cas déterminés par la loi ; il n'est pas une condition générale de validité." },

    { id: 'm2c2x09', chap: 'c2', type: 'single',
      q: "Un agent conclut un contrat au nom de l'assureur dans les limites de ses pouvoirs. Qui est lié ?",
      choices: ["L'agent personnellement", "L'assureur représenté", "Aucun des deux", "Le client uniquement"],
      answer: [1],
      explain: "Art. 32 CO : lorsque le représentant agit au nom d'autrui et dans les limites de ses pouvoirs, le contrat lie directement le représenté." },

    { id: 'm2c2x10', chap: 'c2', type: 'single',
      q: "La procuration apparente signifie que :",
      choices: ["Le représenté est lié s'il a laissé croire de bonne foi à l'existence de pouvoirs", "Le représentant devient propriétaire du contrat", "La représentation est nulle", "Seule la forme écrite compte"],
      answer: [0],
      explain: "Celui qui laisse une personne se comporter comme son représentant assume les conséquences envers les tiers de bonne foi — un point sensible pour les agents d'assurance." },

    { id: 'm2c2x11', chap: 'c2', type: 'single',
      q: "Quel est le délai de prescription des créances périodiques comme les loyers ou les salaires ?",
      choices: ["1 an", "2 ans", "5 ans", "10 ans"],
      answer: [2],
      explain: "Art. 128 CO. Le délai ordinaire de 10 ans (art. 127 CO) s'applique à toutes les créances pour lesquelles la loi ne prévoit pas de règle spéciale." },

    { id: 'm2c2x12', chap: 'c2', type: 'single',
      q: "La prescription a pour effet :",
      choices: ["D'éteindre la dette elle-même", "De permettre au débiteur de refuser le paiement en soulevant l'exception de prescription", "D'annuler le contrat", "De transférer la dette à un tiers"],
      answer: [1],
      explain: "La dette subsiste comme obligation naturelle, mais elle n'est plus exigible en justice si le débiteur invoque la prescription — le juge ne la relève pas d'office." },

    { id: 'm2c2x13', chap: 'c2', type: 'multi',
      q: "Quels actes interrompent la prescription ?",
      choices: ["La reconnaissance de dette par le débiteur", "La réquisition de poursuite", "L'ouverture d'action en justice", "Une simple lettre de rappel du créancier", "Un paiement partiel"],
      answer: [0, 1, 2, 4],
      explain: "Un rappel ne suffit pas : il faut un acte formel ou une reconnaissance. À l'interruption, un nouveau délai recommence à courir intégralement." },

    { id: 'm2c2x14', chap: 'c2', type: 'single',
      q: "La demeure du débiteur suppose en principe :",
      choices: ["Une interpellation du créancier, sauf terme convenu", "Un jugement", "Une faillite", "Une résiliation du contrat"],
      answer: [0],
      explain: "Si une échéance a été fixée, la demeure survient automatiquement ; sinon, le créancier doit interpeller le débiteur pour le mettre en retard." },

    { id: 'm2c2x15', chap: 'c2', type: 'single',
      q: "Le taux d'intérêt moratoire légal en droit suisse est de :",
      choices: ["3 %", "5 %", "8 %", "10 %"],
      answer: [1],
      explain: "5 % l'an (art. 104 CO), sauf convention contraire ou usage commercial prévoyant un taux plus élevé." },

    { id: 'm2c2x16', chap: 'c2', type: 'single',
      q: "Une clause insolite dans des conditions générales est :",
      choices: ["Toujours valable", "Écartée si le client ne pouvait raisonnablement s'y attendre et qu'elle n'a pas été mise en évidence", "Nulle uniquement pour les entreprises", "Valable si elle est en petits caractères"],
      answer: [1],
      explain: "La règle de l'insolite protège la partie qui adhère à des conditions préformulées : une clause surprenante et défavorable doit être spécialement signalée." },

    { id: 'm2c2x17', chap: 'c2', type: 'single',
      q: "L'interprétation d'une clause contractuelle ambiguë se fait :",
      choices: ["En faveur de celui qui l'a rédigée", "Contre celui qui l'a rédigée", "Par tirage au sort", "Selon le montant du litige"],
      answer: [1],
      explain: "Règle « in dubio contra stipulatorem » : celui qui rédige supporte le risque de l'ambiguïté. En assurance, cela profite presque toujours à l'assuré." },

    { id: 'm2c2x18', chap: 'c2', type: 'single',
      q: "Un contrat conclu par correspondance déploie ses effets :",
      choices: ["Dès l'envoi de l'offre", "Dès le moment où l'acceptation a été expédiée", "Dès la signature du notaire", "Dès le premier paiement"],
      answer: [1],
      explain: "Art. 10 CO : le contrat produit ses effets dès l'expédition de l'acceptation, même si l'offrant n'en a pas encore pris connaissance." },

    { id: 'm2c2x19', chap: 'c2', type: 'single',
      q: "Le contrat d'assurance est un contrat :",
      choices: ["Unilatéral", "Synallagmatique, chaque partie ayant des obligations", "Gratuit", "Réel"],
      answer: [1],
      explain: "Le preneur doit la prime et les obligations d'annonce ; l'assureur doit la couverture et la prestation. Les obligations sont réciproques." },

    { id: 'm2c2x20', chap: 'c2', type: 'multi',
      q: "Quelles affirmations sur la représentation sont exactes ?",
      choices: ["Le représentant doit agir au nom du représenté", "Les actes accomplis sans pouvoirs peuvent être ratifiés", "La procuration peut être révoquée", "Le représentant devient partie au contrat conclu au nom d'autrui", "L'étendue des pouvoirs détermine l'engagement du représenté"],
      answer: [0, 1, 2, 4],
      explain: "Le représentant reste extérieur au contrat : il crée un lien entre le représenté et le tiers, sans devenir lui-même créancier ou débiteur." },

    { id: 'm2c2x21', chap: 'c2', type: 'single',
      q: "Une offre assortie d'un délai de réponse lie son auteur :",
      choices: ["Jusqu'à l'expiration du délai fixé", "Pendant 24 heures", "Jusqu'à révocation en tout temps", "Sans limite de temps"],
      answer: [0],
      explain: "Celui qui fixe un délai s'engage à le respecter : il ne peut pas retirer son offre avant son expiration." },

    { id: 'm2c2x22', chap: 'c2', type: 'single',
      q: "L'erreur essentielle sur la personne du cocontractant est pertinente :",
      choices: ["Toujours", "Lorsque l'identité de la personne était déterminante pour la conclusion", "Jamais", "Uniquement en droit de la famille"],
      answer: [1],
      explain: "Dans un contrat conclu intuitu personae — un mandat, une assurance sur la tête d'un tiers — l'identité peut être décisive." },

    { id: 'm2c2x23', chap: 'c2', type: 'single',
      q: "Une convention prévoyant que la modification d'un contrat n'est valable que par écrit :",
      choices: ["Est nulle", "Est valable : c'est une forme réservée conventionnellement", "N'engage que l'assureur", "Doit être approuvée par la FINMA"],
      answer: [1],
      explain: "Les parties peuvent réserver une forme plus stricte que la loi. Elle est alors présumée être une condition de validité de leur accord." },

    { id: 'm2c2x24', chap: 'c2', type: 'single',
      q: "Le silence peut exceptionnellement valoir acceptation :",
      choices: ["Jamais, sans exception", "Lorsque les usages ou une relation d'affaires durable le prévoient", "Dès que l'offre est écrite", "Si l'offre est envoyée par recommandé"],
      answer: [1],
      explain: "L'expédition non sollicitée d'une marchandise, en revanche, n'oblige jamais le destinataire : le silence ne saurait lui être imposé comme un consentement." },

    { id: 'm2c2x25', chap: 'c2', type: 'single',
      q: "Un contrat conclu sous l'empire d'une menace illicite peut être invalidé pour :",
      choices: ["Erreur essentielle", "Dol", "Crainte fondée", "Impossibilité initiale"],
      answer: [2],
      explain: "La crainte fondée suppose une menace illicite et sérieuse qui a déterminé la conclusion ; la victime dispose d'un an pour invalider." },

    { id: 'm2c2x26', chap: 'c2', type: 'single',
      q: "Le délai de prescription absolue pour les prétentions découlant d'un acte illicite ayant causé des lésions corporelles est de :",
      choices: ["3 ans", "10 ans", "20 ans", "30 ans"],
      answer: [2],
      explain: "La révision du droit de la prescription a porté ce délai absolu à 20 ans pour la mort et les lésions corporelles, en raison des dommages différés (amiante)." },

    { id: 'm2c2x27', chap: 'c2', type: 'single',
      q: "Une partie n'exécute pas ses obligations. Le créancier peut notamment :",
      choices: ["Exiger l'exécution et réclamer des dommages-intérêts", "Se faire justice lui-même", "Modifier unilatéralement le contrat", "Résilier sans aucune condition"],
      answer: [0],
      explain: "Selon les cas, il peut aussi renoncer à l'exécution et demander la réparation du dommage, ou se départir du contrat après avoir fixé un délai supplémentaire." },

    { id: 'm2c2x28', chap: 'c2', type: 'single',
      q: "La cession de créance requiert :",
      choices: ["La forme écrite", "L'accord du débiteur", "La forme authentique", "L'inscription au registre"],
      answer: [0],
      explain: "Art. 165 CO : la cession n'est valable que par écrit, mais elle ne nécessite pas le consentement du débiteur, simplement informé du changement de créancier." },

    { id: 'm2c2x29', chap: 'c2', type: 'multi',
      q: "Quelles affirmations sur les conditions générales (CGA) sont exactes ?",
      choices: ["Elles sont des clauses contractuelles préformulées", "Elles doivent respecter le droit impératif", "Les clauses insolites peuvent être écartées", "Elles priment la loi", "Le doute s'interprète contre leur auteur"],
      answer: [0, 1, 2, 4],
      explain: "Aucune clause contractuelle ne peut l'emporter sur une disposition impérative : les CGA se meuvent dans l'espace laissé libre par la loi." },

    { id: 'm2c2x30', chap: 'c2', type: 'single',
      q: "Le contrat d'assurance est en outre qualifié de contrat :",
      choices: ["De durée, exécuté dans le temps", "Instantané", "Réel", "Unilatéral et gratuit"],
      answer: [0],
      explain: "L'assureur fournit une garantie continue pendant toute la période convenue : d'où l'importance des règles sur la résiliation et la suspension de couverture." }
  ]);
})();
