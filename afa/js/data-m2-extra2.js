/* =============================================================
   AFA – Module 2, questions supplémentaires : chapitres 3 et 4
   (LCA I – conclusion / LCA II – vie du contrat)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m2', [
    /* ================= c3 — LCA I : conclusion ================= */
    { id: 'm2c3x01', chap: 'c3', type: 'single',
      q: "Quelle loi s'applique subsidiairement à ce que la LCA ne règle pas ?",
      choices: ["Le Code civil", "Le Code des obligations", "La LSA", "La LAMal"],
      answer: [1],
      explain: "Art. 100 LCA : le CO complète la LCA pour tout ce qu'elle ne traite pas, notamment la formation du contrat et la représentation." },

    { id: 'm2c3x02', chap: 'c3', type: 'single',
      q: "La LCA s'applique-t-elle à l'assurance-accidents obligatoire (LAA) ?",
      choices: ["Oui, intégralement", "Non, la LAA relève des assurances sociales", "Oui, pour les seuls indépendants", "Oui, à titre subsidiaire"],
      answer: [1],
      explain: "La LCA ne régit que les contrats d'assurance privée. Les assurances sociales obéissent à leurs propres lois et à la LPGA." },

    { id: 'm2c3x03', chap: 'c3', type: 'single',
      q: "Une disposition semi-impérative de la LCA signifie qu'on ne peut y déroger :",
      choices: ["Sous aucune forme", "Qu'en faveur du preneur ou de l'ayant droit", "Qu'en faveur de l'assureur", "Que par écrit"],
      answer: [1],
      explain: "Art. 98 LCA. Une clause plus favorable à l'assuré reste valable ; une clause qui le désavantage par rapport à la loi est nulle." },

    { id: 'm2c3x04', chap: 'c3', type: 'single',
      q: "Que se passe-t-il si l'assureur viole son devoir d'information de l'art. 3 LCA ?",
      choices: ["Rien", "Le preneur peut résilier le contrat, dans un délai de quatre semaines dès la connaissance de la violation", "Le contrat est nul de plein droit", "La FINMA annule le contrat"],
      answer: [1],
      explain: "Le droit de résiliation s'éteint quatre semaines après la connaissance de la violation, et en tout cas deux ans après celle-ci." },

    { id: 'm2c3x05', chap: 'c3', type: 'single',
      q: "La proposition d'assurance émane en règle générale :",
      choices: ["De l'assureur", "Du client (proposant)", "De la FINMA", "Du réassureur"],
      answer: [1],
      explain: "Le client fait l'offre au sens du CO ; l'assureur l'accepte, le plus souvent par l'envoi de la police, ce qui conclut le contrat." },

    { id: 'm2c3x06', chap: 'c3', type: 'single',
      q: "Une couverture provisoire :",
      choices: ["Est un contrat définitif", "Assure le risque avant la décision définitive de l'assureur", "Ne produit aucun effet juridique", "Dure obligatoirement un an"],
      answer: [1],
      explain: "Elle protège le client durant l'examen de sa proposition. Elle ne peut pas être révoquée au sens de l'art. 2a LCA, précisément en raison de sa brièveté." },

    { id: 'm2c3x07', chap: 'c3', type: 'single',
      q: "Le preneur reçoit une police qui diverge de ce qui avait été convenu et ne réagit pas pendant deux mois. Quelle est la situation depuis la révision de 2022 ?",
      choices: ["La police est réputée acceptée après quatre semaines de silence", "L'accord réel des parties prime : le silence ne vaut plus acceptation de la police", "Le contrat est nul", "Le preneur doit saisir la FINMA dans les 30 jours"],
      answer: [1],
      explain: "L'ancien art. 12 LCA et sa « fiction d'approbation » ont été abrogés au 1.1.2022. Le preneur peut donc invoquer la divergence au-delà de quatre semaines ; c'est l'accord effectivement conclu qui fait foi, la police n'étant qu'un moyen de preuve." },

    { id: 'm2c3x08', chap: 'c3', type: 'single',
      q: "Sous quelle forme la révocation de l'art. 2a LCA doit-elle intervenir ?",
      choices: ["Oralement", "Par écrit ou par tout autre moyen permettant d'en établir la preuve par un texte", "Par acte notarié", "Par recommandé exclusivement"],
      answer: [1],
      explain: "Un courriel ou un SMS suffisent donc, pour autant qu'ils permettent la preuve par texte. Le délai est respecté si l'envoi est fait le dernier jour." },

    { id: 'm2c3x09', chap: 'c3', type: 'single',
      q: "Quel est l'effet de la révocation ?",
      choices: ["Le contrat prend fin pour l'avenir", "Le contrat est annulé dès l'origine et les prestations versées sont restituées", "La prime reste due pour l'année", "Le contrat est suspendu six mois"],
      answer: [1],
      explain: "La révocation a un effet rétroactif : tout se passe comme si le contrat n'avait jamais été conclu." },

    { id: 'm2c3x10', chap: 'c3', type: 'multi',
      q: "Quels contrats échappent au droit de révocation ?",
      choices: ["Les couvertures provisoires", "Les contrats d'une durée inférieure à un mois", "Les assurances ménage", "Les assurances-vie", "Les assurances RC"],
      answer: [0, 1],
      explain: "Seules ces deux exceptions figurent dans la loi ; toutes les autres branches, y compris la vie, sont révocables pendant 14 jours." },

    { id: 'm2c3x11', chap: 'c3', type: 'single',
      q: "Le questionnaire de santé rempli lors de la proposition sert à :",
      choices: ["Fixer la valeur de rachat", "Délimiter l'obligation de déclarer du proposant", "Établir la police", "Calculer le droit de timbre"],
      answer: [1],
      explain: "Sont importants les faits sur lesquels l'assureur a posé des questions écrites, précises et non équivoques : le questionnaire fixe donc le périmètre de la réticence." },

    { id: 'm2c3x12', chap: 'c3', type: 'single',
      q: "Un proposant ignore de bonne foi une maladie qu'il n'a jamais ressentie ni fait diagnostiquer. Y a-t-il réticence ?",
      choices: ["Oui, dans tous les cas", "Non, l'obligation porte sur les faits qu'il connaît ou doit connaître", "Oui, si la maladie apparaît plus tard", "Oui, si l'assureur le découvre"],
      answer: [1],
      explain: "L'obligation de déclarer est limitée par la connaissance effective ou exigible du proposant : on ne peut pas déclarer ce que l'on ignore légitimement." },

    { id: 'm2c3x13', chap: 'c3', type: 'single',
      q: "Le droit de résilier pour réticence s'éteint dans tous les cas :",
      choices: ["Après 2 ans", "Après 5 ans depuis la conclusion du contrat", "Après 10 ans", "Il ne s'éteint jamais"],
      answer: [1],
      explain: "Au-delà de cinq ans, l'assureur ne peut plus se prévaloir de la réticence, sauf réticence commise dans l'intention de tromper (dol)." },

    { id: 'm2c3x14', chap: 'c3', type: 'single',
      q: "Un assuré n'a pas déclaré un diabète. Il décède d'un accident de la route sans lien avec sa maladie. L'assureur :",
      choices: ["Peut refuser toute prestation", "Doit verser la prestation, faute de causalité entre le fait tu et le sinistre", "Doit verser la moitié", "Peut annuler le contrat rétroactivement"],
      answer: [1],
      explain: "Depuis la révision, le refus de prestation suppose que le fait non déclaré ait influé sur la survenance ou l'étendue du sinistre. L'assureur peut résilier pour l'avenir." },

    { id: 'm2c3x15', chap: 'c3', type: 'multi',
      q: "Quels effets produit une résiliation pour réticence ?",
      choices: ["Le contrat prend fin", "L'assureur peut refuser les prestations pour les sinistres liés causalement au fait tu", "L'assureur doit rembourser toutes les primes encaissées", "Le contrat est annulé rétroactivement dans tous les cas", "La résiliation doit intervenir dans les quatre semaines dès la connaissance"],
      answer: [0, 1, 4],
      explain: "La résiliation opère pour l'avenir : elle n'anéantit pas le contrat depuis l'origine et n'oblige pas l'assureur à restituer l'ensemble des primes." },

    { id: 'm2c3x16', chap: 'c3', type: 'single',
      q: "Quelle est la fonction de la police d'assurance ?",
      choices: ["Constituer le contrat lui-même", "Constater le contrat et servir de moyen de preuve", "Remplacer la proposition", "Servir de titre négociable"],
      answer: [1],
      explain: "Le contrat naît de l'accord des volontés ; la police en est la trace écrite, remise au preneur pour lui permettre de vérifier ce qui a été convenu." },

    { id: 'm2c3x17', chap: 'c3', type: 'single',
      q: "Un proposant a signé sa proposition il y a 20 jours et n'a pas encore reçu de réponse. Est-il encore lié ?",
      choices: ["Oui, pendant six mois", "Non, le délai de 14 jours est échu (sauf examen médical, 4 semaines)", "Oui, indéfiniment", "Non, il n'est jamais lié"],
      answer: [1],
      explain: "Passé ce délai, le proposant retrouve sa liberté : l'assureur qui accepte tardivement fait alors une nouvelle offre, que le client peut refuser." },

    { id: 'm2c3x18', chap: 'c3', type: 'single',
      q: "L'assurance d'un sinistre déjà survenu au moment de la conclusion :",
      choices: ["Est toujours nulle", "Est possible si ni le preneur ni l'assuré ne connaissaient la survenance du sinistre", "Est réservée aux entreprises", "Doit être approuvée par la FINMA"],
      answer: [1],
      explain: "La couverture rétroactive suppose que l'aléa subsiste subjectivement : personne du côté du preneur ne devait savoir que l'événement s'était déjà produit." },

    { id: 'm2c3x19', chap: 'c3', type: 'single',
      q: "Le devoir d'information de l'art. 3 LCA doit être exécuté :",
      choices: ["Après la conclusion du contrat", "Avant la conclusion du contrat", "Au moment du premier sinistre", "À la demande du client seulement"],
      answer: [1],
      explain: "L'information doit précéder la décision du client : elle doit être compréhensible et porter sur les éléments essentiels de la couverture proposée." },

    { id: 'm2c3x20', chap: 'c3', type: 'single',
      q: "Les dispositions absolument impératives de la LCA figurent :",
      choices: ["À l'art. 97 LCA", "À l'art. 33 LCA", "À l'art. 46 LCA", "À l'art. 14 LCA"],
      answer: [0],
      explain: "L'art. 97 énumère les dispositions auxquelles on ne peut jamais déroger, l'art. 98 celles auxquelles on ne peut déroger qu'en faveur de l'assuré." },

    { id: 'm2c3x21', chap: 'c3', type: 'single',
      q: "Un client conclut une assurance par internet. Le droit de révocation de 14 jours :",
      choices: ["Ne s'applique pas à la vente en ligne", "S'applique de la même manière", "Est réduit à 7 jours", "Est porté à 30 jours"],
      answer: [1],
      explain: "L'art. 2a LCA vaut quel que soit le canal de conclusion : le mode de distribution ne modifie pas les droits du preneur." },

    { id: 'm2c3x22', chap: 'c3', type: 'single',
      q: "En cas de réticence commise intentionnellement pour tromper l'assureur, celui-ci peut en outre :",
      choices: ["Se prévaloir du dol selon le CO au-delà des délais de la LCA", "Doubler la prime", "Confisquer la valeur de rachat sans autre", "Saisir le MROS"],
      answer: [0],
      explain: "Le dol relève du droit général du contrat et permet une invalidation dans l'année dès la découverte, indépendamment de la péremption quinquennale de la LCA." },

    { id: 'm2c3x23', chap: 'c3', type: 'multi',
      q: "Quelles nouveautés la révision de 2022 a-t-elle apportées ?",
      choices: ["Un droit de révocation de 14 jours", "Un délai de prescription porté à 5 ans", "Un droit de résiliation ordinaire après trois ans", "L'exigence d'un lien de causalité en cas de réticence", "La suppression de la police"],
      answer: [0, 1, 2, 3],
      explain: "La police subsiste comme moyen de preuve du contrat ; la révision a surtout renforcé la position du preneur d'assurance." },

    { id: 'm2c3x24', chap: 'c3', type: 'single',
      q: "Le preneur d'assurance doit-il déclarer spontanément des faits non couverts par le questionnaire ?",
      choices: ["Oui, tous les faits qu'il juge importants", "Non, l'obligation est délimitée par les questions écrites de l'assureur", "Oui, mais uniquement en assurance-vie", "Oui, sous peine de nullité"],
      answer: [1],
      explain: "C'est le système du questionnaire fermé : l'assureur qui n'interroge pas sur un point ne peut pas ensuite reprocher au client de ne pas l'avoir mentionné." },

    { id: 'm2c3x25', chap: 'c3', type: 'single',
      q: "Un client révoque son contrat le 14e jour en le remettant à la poste. La révocation est :",
      choices: ["Tardive", "Valable, l'expédition dans le délai suffit", "Valable seulement si l'assureur la reçoit le même jour", "Nulle si elle est envoyée en courrier B"],
      answer: [1],
      explain: "La loi se contente de l'expédition dans le délai : le risque d'acheminement postal ne pénalise pas le preneur." },

    /* ================= c4 — LCA II : vie du contrat ================= */
    { id: 'm2c4x01', chap: 'c4', type: 'single',
      q: "La prime est en principe payable :",
      choices: ["À terme échu", "D'avance pour la période convenue", "Au moment du premier sinistre", "En fin de contrat"],
      answer: [1],
      explain: "L'assureur garantit un risque pour une période donnée : la prime correspondante est due au début de cette période." },

    { id: 'm2c4x02', chap: 'c4', type: 'single',
      q: "Que doit contenir la sommation de l'art. 20 LCA ?",
      choices: ["Uniquement le montant dû", "Un délai de 14 jours et le rappel des conséquences de la demeure", "Une menace de poursuite pénale", "L'accord de la FINMA"],
      answer: [1],
      explain: "Sans indication des conséquences (suspension de la couverture), la sommation est inefficace et la couverture subsiste malgré le non-paiement." },

    { id: 'm2c4x03', chap: 'c4', type: 'single',
      q: "À quel moment la couverture est-elle suspendue en cas de non-paiement ?",
      choices: ["Dès l'échéance de la prime", "Dès l'expiration du délai de 14 jours de la sommation", "Après deux mois", "Après un an"],
      answer: [1],
      explain: "La suspension n'intervient pas automatiquement à l'échéance : elle suppose une sommation régulière et l'expiration du délai qu'elle impartit." },

    { id: 'm2c4x04', chap: 'c4', type: 'single',
      q: "La couverture suspendue reprend effet :",
      choices: ["Rétroactivement dès le paiement", "Dès le paiement intégral, pour l'avenir uniquement", "Après décision de la FINMA", "Jamais"],
      answer: [1],
      explain: "Les sinistres survenus pendant la suspension restent définitivement à la charge de l'assuré : le paiement tardif ne les fait pas revivre." },

    { id: 'm2c4x05', chap: 'c4', type: 'single',
      q: "Quel délai l'assureur a-t-il pour poursuivre le paiement, sous peine d'être réputé s'être départi du contrat ?",
      choices: ["14 jours", "1 mois", "2 mois dès l'expiration du délai de sommation", "6 mois"],
      answer: [2],
      explain: "Art. 21 LCA. Cette règle évite qu'un contrat reste indéfiniment suspendu, sans couverture pour le client et sans encaissement pour l'assureur." },

    { id: 'm2c4x06', chap: 'c4', type: 'single',
      q: "Une aggravation du risque est « essentielle » lorsqu'elle porte sur :",
      choices: ["N'importe quel changement de situation", "Un fait sur lequel l'assureur avait interrogé le proposant", "Le montant de la prime", "Le domicile de l'assuré uniquement"],
      answer: [1],
      explain: "Le questionnaire sert de référence, à la conclusion comme en cours de contrat : ce qui était important pour souscrire l'est aussi pour maintenir le contrat." },

    { id: 'm2c4x07', chap: 'c4', type: 'multi',
      q: "Que peut faire l'assureur en cas d'aggravation essentielle du risque du fait du preneur ?",
      choices: ["Résilier le contrat", "Proposer une adaptation de la prime", "Refuser toute prestation future liée au risque aggravé", "Exiger une amende", "Doubler rétroactivement toutes les primes payées"],
      answer: [0, 1, 2],
      explain: "Amendes et rétroactivité générale ne sont pas prévues : l'assureur adapte le contrat pour l'avenir ou y met fin." },

    { id: 'm2c4x08', chap: 'c4', type: 'single',
      q: "En cas de diminution essentielle du risque, le preneur peut exiger :",
      choices: ["Une réduction de prime", "Le remboursement de toutes les primes", "Une prestation immédiate", "Une prolongation gratuite du contrat"],
      answer: [0],
      explain: "La règle est symétrique à celle de l'aggravation : la prime doit correspondre au risque effectivement couvert." },

    { id: 'm2c4x09', chap: 'c4', type: 'single',
      q: "Un contrat d'assurance ménage est conclu pour 5 ans. Le preneur peut le résilier au plus tôt :",
      choices: ["Après un an", "Pour la fin de la 3e année, avec un préavis de 3 mois", "Seulement à l'échéance des 5 ans", "En tout temps sans préavis"],
      answer: [1],
      explain: "Art. 35a LCA : au-delà de trois ans, le preneur peut sortir chaque année, moyennant un préavis de trois mois. La règle est semi-impérative." },

    { id: 'm2c4x10', chap: 'c4', type: 'single',
      q: "Après un sinistre indemnisé en assurance-maladie complémentaire, l'assureur peut-il résilier ?",
      choices: ["Oui, comme dans toute branche", "Non, ce droit lui est retiré dans cette branche", "Oui, avec l'accord de la FINMA", "Oui, si le sinistre dépasse CHF 10 000.–"],
      answer: [1],
      explain: "La révision protège les assurés devenus malades : sans cette règle, l'assureur pourrait se séparer de ses mauvais risques au pire moment." },

    { id: 'm2c4x11', chap: 'c4', type: 'single',
      q: "Une chose assurée est vendue. Que deviennent les droits et obligations du contrat ?",
      choices: ["Le contrat s'éteint immédiatement", "Ils passent en principe à l'acquéreur, qui peut refuser", "Ils reviennent à l'assureur", "Ils sont suspendus un an"],
      answer: [1],
      explain: "Le transfert évite une rupture de couverture. L'acquéreur peut refuser la reprise dans le délai légal et l'assureur dispose aussi d'un droit de résiliation." },

    { id: 'm2c4x12', chap: 'c4', type: 'single',
      q: "Si l'entreprise d'assurance tombe en faillite, le contrat :",
      choices: ["Continue avec le liquidateur", "Prend fin, les prétentions étant couvertes par la fortune liée", "Est transféré d'office à la FINMA", "Devient une assurance sociale"],
      answer: [1],
      explain: "La fortune liée est affectée en priorité aux créances découlant des contrats d'assurance : c'est la protection essentielle des assurés en cas d'insolvabilité." },

    { id: 'm2c4x13', chap: 'c4', type: 'single',
      q: "Le risque assuré disparaît définitivement (l'objet assuré est détruit par un événement non couvert). Le contrat :",
      choices: ["Continue jusqu'à l'échéance", "S'éteint, la prime étant due jusqu'à ce moment", "Se transforme en assurance-vie", "Doit être racheté"],
      answer: [1],
      explain: "Sans risque, l'assurance n'a plus d'objet. La prime est due pro rata temporis pour la période de couverture effective." },

    { id: 'm2c4x14', chap: 'c4', type: 'multi',
      q: "Quelles obligations incombent au preneur en cours de contrat ?",
      choices: ["Payer la prime", "Annoncer les aggravations essentielles du risque", "Annoncer le sinistre sans retard", "Prendre les mesures propres à réduire le dommage", "Choisir lui-même l'expert de l'assureur"],
      answer: [0, 1, 2, 3],
      explain: "La désignation des experts appartient à l'assureur ou résulte d'un accord ; ce n'est pas une obligation du preneur." },

    { id: 'm2c4x15', chap: 'c4', type: 'single',
      q: "Le preneur viole une obligation contractuelle sans aucune faute de sa part. Quelle sanction ?",
      choices: ["Réduction de moitié de la prestation", "Aucune sanction (art. 45 LCA)", "Résiliation immédiate", "Perte totale du droit"],
      answer: [1],
      explain: "L'art. 45 LCA exclut la sanction en l'absence de faute, ou lorsque la violation n'a eu aucune influence sur la survenance ou l'étendue du sinistre." },

    { id: 'm2c4x16', chap: 'c4', type: 'single',
      q: "L'assureur se réserve le droit d'adapter les primes. Il l'exerce. Le preneur peut :",
      choices: ["Rien faire", "Résilier le contrat pour la date d'entrée en vigueur de la modification", "Exiger le maintien des anciennes conditions", "Saisir la FINMA pour annuler l'adaptation"],
      answer: [1],
      explain: "Art. 35b LCA : la contrepartie du droit de modification unilatérale est le droit de sortie du preneur, qui n'est pas prisonnier des nouvelles conditions." },

    { id: 'm2c4x17', chap: 'c4', type: 'single',
      q: "La prime est « quérable ». Cela signifie que :",
      choices: ["Le preneur doit la porter spontanément", "L'assureur doit la réclamer", "Elle est payable en espèces", "Elle est indexée"],
      answer: [1],
      explain: "L'assureur envoie la facture ; c'est aussi la raison pour laquelle la demeure suppose une sommation formelle avant toute suspension de couverture." },

    { id: 'm2c4x18', chap: 'c4', type: 'single',
      q: "Un preneur déménage dans un quartier à forte criminalité. En matière d'assurance vol, il s'agit :",
      choices: ["D'une diminution du risque", "D'une possible aggravation à annoncer", "D'un changement sans portée", "D'un motif de nullité"],
      answer: [1],
      explain: "Le lieu de situation des biens est un élément déterminant du risque : le changement doit être annoncé, l'assureur pouvant adapter la prime ou résilier." },

    { id: 'm2c4x19', chap: 'c4', type: 'single',
      q: "Une résiliation en cas de sinistre doit intervenir :",
      choices: ["Dans le délai prévu par la loi et le contrat, après le versement de la prestation", "Cinq ans après le sinistre", "Avant le sinistre", "Uniquement à l'échéance annuelle"],
      answer: [0],
      explain: "Le droit de résilier après sinistre s'exerce dans un délai bref suivant le règlement ; passé ce moment, le contrat se poursuit normalement." },

    { id: 'm2c4x20', chap: 'c4', type: 'single',
      q: "Un contrat conclu pour un an avec clause de reconduction tacite :",
      choices: ["Est interdit par la LCA", "Se renouvelle d'année en année sauf résiliation dans le délai convenu", "Devient perpétuel", "Doit être renouvelé par écrit chaque année"],
      answer: [1],
      explain: "La tacite reconduction est admise ; le preneur doit veiller au délai de résiliation, généralement de trois mois avant l'échéance." },

    { id: 'm2c4x21', chap: 'c4', type: 'multi',
      q: "Quelles causes mettent fin à un contrat d'assurance ?",
      choices: ["L'expiration de la durée convenue", "La résiliation ordinaire", "La disparition du risque", "La faillite de l'assureur", "Le changement d'intermédiaire"],
      answer: [0, 1, 2, 3],
      explain: "Changer de courtier n'affecte en rien le contrat d'assurance : le mandat de courtage et le contrat d'assurance sont deux relations juridiques distinctes." },

    { id: 'm2c4x22', chap: 'c4', type: 'single',
      q: "Le preneur omet d'annoncer une aggravation essentielle du risque. Un sinistre lié survient. L'assureur :",
      choices: ["Doit payer intégralement", "N'est en principe pas lié pour ce sinistre", "Doit payer la moitié", "Doit d'abord résilier le contrat"],
      answer: [1],
      explain: "L'assureur n'est plus lié pour l'avenir dès l'aggravation, s'il y a un lien entre le risque aggravé et le sinistre survenu." },

    { id: 'm2c4x23', chap: 'c4', type: 'single',
      q: "Une prime annuelle est payée pour l'année, mais le contrat prend fin au bout de quatre mois par disparition du risque. L'assureur :",
      choices: ["Garde toute la prime", "Rembourse la part de prime correspondant à la période non courue", "Doit une indemnité au preneur", "Reporte la prime sur un autre contrat"],
      answer: [1],
      explain: "La prime rémunère une garantie qui n'est plus fournie : elle est due pro rata temporis, sauf disposition contractuelle admissible contraire." },

    { id: 'm2c4x24', chap: 'c4', type: 'single',
      q: "La sommation de payer la prime est envoyée mais ne mentionne pas les conséquences du non-paiement. Elle est :",
      choices: ["Valable", "Inefficace : la couverture n'est pas suspendue", "Valable si envoyée en recommandé", "Valable après confirmation orale"],
      answer: [1],
      explain: "L'avertissement sur les conséquences est une condition de validité : la loi veut que le client comprenne exactement ce qu'il risque." },

    { id: 'm2c4x25', chap: 'c4', type: 'single',
      q: "Le preneur d'un contrat de plus de trois ans veut résilier pour la fin de la quatrième année. Quel préavis doit-il respecter ?",
      choices: ["1 mois", "3 mois", "6 mois", "1 an"],
      answer: [1],
      explain: "Trois mois avant la fin de l'année d'assurance concernée. Ce droit s'exerce chaque année à partir de la fin de la troisième." },

    { id: 'm2c4x26', chap: 'c4', type: 'single',
      q: "L'obligation de réduire le dommage impose à l'assuré :",
      choices: ["De payer lui-même les réparations", "De prendre les mesures raisonnables pour limiter l'ampleur du sinistre", "De renoncer à toute prestation", "D'attendre l'accord écrit de l'assureur avant toute action"],
      answer: [1],
      explain: "Couper l'eau, sécuriser les lieux, appeler les secours : les frais engagés à cette fin sont d'ailleurs en principe pris en charge par l'assureur." },

    { id: 'm2c4x27', chap: 'c4', type: 'single',
      q: "Un assuré tarde de plusieurs mois à annoncer un sinistre, sans conséquence sur son traitement. L'assureur :",
      choices: ["Peut refuser toute prestation", "Ne peut pas sanctionner, la violation étant sans influence sur le sinistre", "Peut réduire de moitié", "Doit résilier le contrat"],
      answer: [1],
      explain: "Art. 45 LCA : la sanction suppose une faute et une influence de la violation. Un retard sans conséquence ne justifie pas de réduction." },

    { id: 'm2c4x28', chap: 'c4', type: 'single',
      q: "Le paiement de la prime par un tiers (par exemple un parent) est :",
      choices: ["Interdit", "Admis, l'assureur devant l'accepter", "Soumis à l'accord de la FINMA", "Nul"],
      answer: [1],
      explain: "Ce qui compte est que la dette soit éteinte : l'assureur ne peut refuser un paiement valable au motif qu'il émane d'un tiers." },

    { id: 'm2c4x29', chap: 'c4', type: 'multi',
      q: "Quelles affirmations sur la suspension de couverture sont exactes ?",
      choices: ["Elle suppose une sommation régulière", "Elle prend effet à l'expiration du délai de 14 jours", "Les sinistres survenus pendant la suspension ne sont pas couverts", "Elle éteint immédiatement le contrat", "La couverture reprend au paiement intégral, sans effet rétroactif"],
      answer: [0, 1, 2, 4],
      explain: "La suspension n'est pas une extinction : le contrat subsiste, seule la garantie est mise en veille jusqu'au paiement ou au départ de l'assureur." },

    { id: 'm2c4x30', chap: 'c4', type: 'single',
      q: "Le contrat prévoit une clause moins favorable au preneur qu'une disposition semi-impérative de la LCA. Cette clause est :",
      choices: ["Valable", "Nulle, la disposition légale s'appliquant", "Valable si le preneur l'a signée", "Valable pour les entreprises uniquement"],
      answer: [1],
      explain: "On ne peut déroger aux règles semi-impératives qu'en faveur du preneur ou de l'ayant droit : toute clause défavorable est écartée au profit de la loi." }
  ]);
})();
