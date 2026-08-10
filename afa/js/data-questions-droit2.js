/* =============================================================
   AFA – Droit de l'assurance : deuxième lot dédié

   Approfondit les chapitres de la LCA article par article, la
   LPD et la LBA, la responsabilité civile et les voies de droit.
   Gabarit officiel : en-tête de thème, barème, choix unique,
   choix multiple et tableaux d'attribution.
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m2 = M.find(x => x.id === 'm2');
  if (!m2) return;
  const q = (o) => Object.assign({ lvl: 'off' }, o);
  const VF = ['Vrai', 'Faux'];

  m2.questions.push(

    /* ═══════ c3 — LCA I : CONCLUSION ═══════ */
    q({
      id: 'dx301', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, exigences du questionnaire",
      q: "Le questionnaire de l'assureur : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Les questions doivent être précises et non équivoques.",
        "Un fait important non couvert par une question peut fonder une réticence.",
        "Le proposant répond selon ce qu'il sait ou doit savoir.",
        "Une question ambiguë s'interprète en défaveur de l'assureur qui l'a rédigée.",
      ],
      answer: [0, 1, 0, 0],
      explain: "L'art. 4 LCA fait porter à l'assureur la charge de bien demander : ce qu'il n'a pas questionné ne peut pas lui être reproché. Une formulation floue se retourne contre lui, comme toute clause qu'il a rédigée."
    }),
    q({
      id: 'dx302', chap: 'c3', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, réticence sans causalité',
      ctx: "Un preneur a omis de déclarer un traitement dorsal suivi deux ans avant la conclusion. Trois ans plus tard, il subit une fracture du poignet lors d'une chute à ski. L'assureur découvre l'omission à cette occasion.",
      q: "Que peut faire l'assureur pour ce sinistre ?",
      choices: [
        "Il doit la prestation : le fait tu n'a pas influé sur ce sinistre",
        "Il refuse toute prestation, la réticence étant établie",
        "Il réduit la prestation de moitié",
        "Il suspend la prestation jusqu'à expertise médicale",
      ],
      answer: [0],
      explain: "Résilier et refuser la prestation sont deux choses distinctes. L'assureur peut mettre fin au contrat dans les quatre semaines, mais la libération suppose un lien de causalité entre le fait tu et le sinistre — un dos et un poignet n'en ont aucun."
    }),
    q({
      id: 'dx303', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, délais de la conclusion',
      q: "Quel délai s'attache à chacune de ces situations ?",
      cols: ['14 jours', '4 semaines', '5 ans'],
      rows: [
        "Révoquer le contrat après en avoir eu connaissance",
        "Résilier pour réticence dès la découverte du fait tu",
        "Limite absolue pour invoquer la réticence depuis la conclusion",
      ],
      answer: [0, 1, 2],
      explain: "Trois délais qu'on confond volontiers. Les quatre semaines courent depuis la connaissance effective, pas depuis la conclusion ; les cinq ans forment un plafond au-delà duquel la réticence ne peut plus être invoquée."
    }),
    q({
      id: 'dx304', chap: 'c3', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, information précontractuelle",
      q: "Sur quels points l'assureur doit-il renseigner le proposant avant la conclusion ?",
      choices: [
        "Son identité et son adresse",
        "Les risques couverts et l'étendue de la couverture",
        "Les risques exclus de la garantie",
        "Le montant de la prime et les autres obligations du preneur",
        "Le traitement des données personnelles",
        "Le résultat financier du dernier exercice de la compagnie",
      ],
      answer: [0, 1, 2, 3, 4],
      explain: "L'art. 3 LCA énumère les points sur lesquels le client doit pouvoir se décider en connaissance de cause. Les comptes de l'assureur relèvent de la transparence prudentielle, pas de l'information précontractuelle."
    }),
    q({
      id: 'dx305', chap: 'c3', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, révocation et couverture provisoire',
      q: "Quel effet la révocation produit-elle sur une couverture provisoire déjà accordée ?",
      choices: [
        "La révocation met fin au contrat, mais la couverture accordée jusque-là reste acquise",
        "La révocation efface rétroactivement toute couverture depuis l'origine",
        "La révocation est impossible tant qu'une couverture provisoire court",
        "La révocation transforme la couverture provisoire en contrat définitif",
      ],
      answer: [0],
      explain: "La révocation vaut pour l'avenir : ce qui a été couvert l'a été. Un sinistre survenu pendant la couverture provisoire reste donc à la charge de l'assureur, même si le preneur révoque ensuite."
    }),
    q({
      id: 'dx306', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, qui fait quoi dans la conclusion',
      q: "Qui accomplit chacun de ces actes dans la formation du contrat ?",
      cols: ['Le proposant', "L'entreprise d'assurance"],
      rows: [
        "Remplir et signer la proposition d'assurance",
        "Notifier son acceptation dans les limites du délai d'option",
        "Établir la police d'assurance",
        "Exercer le droit de révocation dans les quatorze jours",
      ],
      answer: [0, 1, 1, 0],
      explain: "L'offre vient du client, l'acceptation de l'assureur — c'est ce qui fonde sa liberté de sélectionner les risques. La police n'est qu'une pièce justificative établie ensuite par l'assureur."
    }),

    /* ═══════ c4 — LCA II : VIE DU CONTRAT ═══════ */
    q({
      id: 'dx401', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, divisibilité de la prime',
      q: "Dans ces situations, la prime de la période non courue est-elle restituée ?",
      cols: ['Restituée', "Acquise à l'assureur"],
      rows: [
        "Le contrat prend fin par résiliation ordinaire à l'échéance triennale",
        "L'objet assuré disparaît définitivement, faisant disparaître le risque",
        "Le preneur résilie dans l'année qui suit la conclusion",
        "L'assureur résilie après avoir indemnisé un sinistre partiel",
      ],
      answer: [0, 1, 1, 0],
      explain: "L'art. 24 LCA pose la divisibilité comme principe : on ne paie que le temps couvert. Deux exceptions le renversent — la disparition du risque et la résiliation durant la première année."
    }),
    q({
      id: 'dx402', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, changement de propriétaire',
      ctx: "Monsieur Kunz vend sa maison le 15 mars. Elle est assurée auprès d'un assureur privé, dont le contrat court encore huit mois.",
      q: "À qui appartient chacun de ces droits, et dans quel délai ?",
      cols: ["À l'acquéreur, 30 jours", "À l'assureur, 14 jours"],
      rows: [
        "Refuser la reprise du contrat",
        "Résilier dès la connaissance du changement de main",
      ],
      answer: [0, 1],
      explain: "Art. 54 LCA : le contrat passe de plein droit à l'acquéreur. Celui-ci dispose de trente jours pour le refuser ; l'assureur, de quatorze jours dès qu'il connaît le changement — et la couverture ne cesse alors qu'au plus tôt trente jours après."
    }),
    q({
      id: 'dx403', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, silence de l\'acquéreur',
      q: "Que se passe-t-il si l'acquéreur d'un bien assuré ne dit rien dans le délai légal ?",
      choices: [
        "Il devient preneur d'assurance aux conditions existantes et doit la prime",
        "Le contrat s'éteint faute d'acceptation expresse",
        "Le contrat reste au nom du vendeur jusqu'à l'échéance",
        "L'assureur doit lui soumettre une nouvelle proposition",
      ],
      answer: [0],
      explain: "Le transfert opère de plein droit : c'est le refus qui doit être exprimé, non l'acceptation. Le silence vaut donc reprise, avec les droits et les obligations du contrat en cours."
    }),
    q({
      id: 'dx404', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, qui peut résilier',
      q: "Dans chacune de ces situations, qui dispose d'un droit de résiliation ?",
      cols: ['Le preneur seul', "L'assureur seul", 'Les deux parties'],
      rows: [
        "L'assureur applique une clause contractuelle d'adaptation des primes",
        "Une réticence du proposant est découverte",
        "Une prestation a été versée après un sinistre partiel",
        "Le contrat court depuis plus de trois ans",
      ],
      answer: [0, 1, 2, 2],
      explain: "Quatre régimes distincts. L'adaptation de prime ne profite qu'au preneur, puisque l'assureur en a pris l'initiative ; la réticence ne profite qu'à l'assureur, seul lésé par l'omission ; le sinistre partiel et la durée de plus de trois ans ouvrent un droit réciproque."
    }),
    q({
      id: 'dx405', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, résiliation en maladie complémentaire',
      ctx: "Une assurée bénéficie d'une complémentaire d'hospitalisation. Après un séjour coûteux indemnisé par l'assureur, celui-ci souhaite se séparer d'elle.",
      q: "Le peut-il en invoquant le sinistre ?",
      choices: [
        "Non : le droit de résilier après sinistre est retiré à l'assureur en maladie complémentaire",
        "Oui, dans les quatorze jours suivant le versement de la prestation",
        "Oui, mais uniquement à l'échéance annuelle suivante",
        "Oui, à condition de rembourser la prime de la période restante",
      ],
      answer: [0],
      explain: "L'art. 42 LCA ouvre un droit réciproque après sinistre, mais il en prive expressément l'assureur en assurance-maladie complémentaire. Sans cette règle, l'assureur se débarrasserait des assurés au moment précis où ils ont besoin de la couverture."
    }),
    q({
      id: 'dx406', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, suspension pour non-paiement',
      ctx: "Une prime échoit le 1er juin et reste impayée. L'assureur envoie le 10 juin une sommation régulière, mentionnant le délai et les conséquences.",
      q: "Ces affirmations sur la suite sont-elles exactes ou inexactes ?",
      cols: ['Exacte', 'Inexacte'],
      rows: [
        "La couverture est suspendue à partir du 25 juin.",
        "Un sinistre survenu le 30 juin n'est pas couvert.",
        "Un paiement le 5 juillet rétablit la couverture rétroactivement au 1er juin.",
        "Sans poursuite dans les deux mois suivant le 24 juin, l'assureur est réputé s'être départi du contrat.",
      ],
      answer: [0, 0, 1, 0],
      explain: "Les quatorze jours courent dès l'envoi du 10 juin, soit jusqu'au 24 : la suspension commence le 25. Le paiement rétablit la couverture pour l'avenir seulement — l'absence de rétroactivité est le point qui coûte le plus cher aux assurés."
    }),

    /* ═══════ c5 — LCA III : SINISTRE ═══════ */
    q({
      id: 'dx501', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, obligations et articles',
      q: "À quelle obligation de l'assuré chaque disposition correspond-elle ?",
      cols: ['Avis du sinistre', 'Renseignements', 'Réduction du dommage'],
      rows: [
        "Annoncer le sinistre à l'assureur dès qu'on en a connaissance",
        "Fournir les pièces permettant d'établir le bien-fondé de la prétention",
        "Prendre les mesures que commandent les circonstances pour limiter le dommage",
      ],
      answer: [0, 1, 2],
      explain: "Trois obligations qui se déclenchent au sinistre, avec trois sanctions différentes. L'avis tardif fautif permet une réduction ; le refus de renseigner bloque l'exigibilité ; le défaut de sauvetage réduit l'indemnité du surcroît de dommage évitable."
    }),
    q({
      id: 'dx502', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, prescription des créances',
      ctx: "Un dégât d'eau survient le 3 mars 2022. L'assureur refuse toute prestation. Le preneur hésite, puis décide d'agir en justice.",
      q: "Jusqu'à quand peut-il en principe agir ?",
      choices: [
        "Jusqu'au 3 mars 2027, la prescription étant de cinq ans",
        "Jusqu'au 3 mars 2024, la prescription étant de deux ans",
        "Jusqu'au 3 mars 2032, la prescription étant de dix ans",
        "Sans limite, la créance d'assurance étant imprescriptible",
      ],
      answer: [0],
      explain: "L'art. 46 LCA fixe cinq ans dès le fait d'où naît l'obligation. La révision entrée en vigueur en 2022 a doublé et demi l'ancien délai de deux ans, qui laissait très peu de temps aux assurés."
    }),
    q({
      id: 'dx503', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, sanctions des manquements',
      q: "Quelle sanction s'attache à chacun de ces manquements de l'assuré ?",
      cols: ['Aucune sanction', 'Réduction possible', 'Refus et départ du contrat'],
      rows: [
        "Annonce tardive, sans influence sur le traitement du dossier",
        "Annonce tardive fautive ayant gêné l'instruction",
        "Omission intentionnelle d'annoncer le sinistre",
      ],
      answer: [0, 1, 2],
      explain: "L'échelle suit l'état d'esprit et le préjudice causé. Un retard qui n'a rien empêché reste sans conséquence : la sanction suppose que l'assureur en ait réellement souffert."
    }),
    q({
      id: 'dx504', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, faute grave et réduction',
      q: "Selon quel critère la prestation est-elle réduite en cas de faute grave ?",
      choices: [
        "Proportionnellement à la gravité de la faute",
        "De moitié, dans tous les cas",
        "Du montant de la franchise contractuelle",
        "Selon le nombre de sinistres antérieurs de l'assuré",
      ],
      answer: [0],
      explain: "Art. 14 LCA : la réduction s'ajuste à la gravité, elle n'est pas forfaitaire. Une négligence grave mais isolée n'entraîne pas la même réduction qu'un comportement délibérément insouciant répété."
    }),
    q({
      id: 'dx505', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, empêchement sans faute',
      q: "Ces manquements sont-ils sanctionnés ou excusés ?",
      cols: ['Sanctionné', 'Excusé'],
      rows: [
        "L'assuré, hospitalisé aux soins intensifs, annonce son sinistre trois semaines plus tard",
        "L'assuré, en vacances, ne relève pas son courrier et laisse passer le délai par négligence",
      ],
      answer: [1, 0],
      explain: "Le manquement suppose une faute : celui qui était empêché sans sa faute n'encourt aucune sanction. Partir en vacances sans organiser le suivi de son courrier reste, en revanche, une négligence de l'assuré."
    }),

    /* ═══════ c6 — SOUS-ASSURANCE ET SUBROGATION ═══════ */
    q({
      id: 'dx601', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, règle proportionnelle avec franchise',
      ctx: "Un inventaire vaut CHF 200 000.–, la somme assurée est de CHF 150 000.–. Un dégât d'eau cause CHF 40 000.– de dommage. La police prévoit une franchise de CHF 500.–.",
      q: "Quelle indemnité l'assureur verse-t-il ?",
      choices: ["CHF 29 500.–", "CHF 30 000.–", "CHF 39 500.–", "CHF 22 500.–"],
      answer: [0],
      explain: "On applique d'abord la règle proportionnelle : 40 000 × 150/200 = CHF 30 000.–. On déduit ensuite la franchise : 30 000 − 500 = CHF 29 500.–. L'ordre compte, déduire la franchise en premier donnerait un résultat différent."
    }),
    q({
      id: 'dx602', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, effets de la surassurance',
      q: "La surassurance : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "L'indemnité reste plafonnée au dommage effectivement subi.",
        "Le preneur a payé une prime supérieure à ce que sa couverture lui rapporte.",
        "La surassurance conclue de bonne foi rend le contrat nul.",
        "La surassurance conclue dans l'intention de s'enrichir peut entraîner la nullité.",
      ],
      answer: [0, 0, 1, 0],
      explain: "La surassurance involontaire est simplement inutile : on paie trop pour rien. C'est l'intention frauduleuse — surassurer pour provoquer le sinistre et en tirer profit — que la loi sanctionne par la nullité."
    }),
    q({
      id: 'dx603', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, recours contre un proche',
      ctx: "Un incendie est causé par la négligence du fils majeur de l'assurée, qui vit sous le même toit. L'assureur ménage indemnise le dommage.",
      q: "Peut-il exercer son recours contre le fils ?",
      choices: [
        "Non, sauf faute grave : le recours contre les proches vivant en ménage commun est en principe exclu",
        "Oui, sans restriction, la subrogation jouant contre tout responsable",
        "Non, jamais, la parenté excluant tout recours",
        "Oui, mais pour la moitié seulement du montant versé",
      ],
      answer: [0],
      explain: "Recourir contre un membre du ménage reviendrait à reprendre d'une main ce qu'on a versé de l'autre. La loi réserve toutefois le cas de la faute grave, où la protection tombe."
    }),
    q({
      id: 'dx604', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, valeurs d\'assurance',
      q: "À quelle valeur d'assurance chaque définition correspond-elle ?",
      cols: ['Valeur à neuf', 'Valeur vénale', "Valeur d'usage"],
      rows: [
        "Le coût de remplacement par un objet neuf équivalent",
        "La valeur du bien juste avant le sinistre, vétusté déduite",
        "Ce que le bien représentait concrètement pour son détenteur",
      ],
      answer: [0, 1, 2],
      explain: "Le principe indemnitaire commande la valeur vénale. La valeur à neuf est une extension contractuelle favorable, en général limitée dans le temps ; au-delà d'un certain âge, on retombe sur la valeur vénale."
    }),

    /* ═══════ c7 — RESPONSABILITÉ CIVILE ═══════ */
    q({
      id: 'dx701', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, catégories de dommage',
      q: "À quelle catégorie chaque poste appartient-il ?",
      cols: ['Dommage matériel', 'Dommage corporel', 'Tort moral'],
      rows: [
        "La réparation du véhicule endommagé",
        "Les frais de traitement et la perte de gain de la victime blessée",
        "La réparation de la souffrance éprouvée par les proches d'une victime décédée",
      ],
      answer: [0, 1, 2],
      explain: "Le tort moral ne répare pas une perte patrimoniale mais une atteinte à la personnalité. Il s'ajoute au dommage matériel et corporel, et son montant relève de l'appréciation du juge."
    }),
    q({
      id: 'dx702', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, responsabilité solidaire',
      ctx: "Deux entreprises, intervenant sur le même chantier, causent ensemble un dommage de CHF 60 000.– à un voisin. Leurs parts de responsabilité sont difficiles à départager.",
      q: "Que peut faire le lésé ?",
      choices: [
        "Réclamer l'intégralité du dommage à l'une des deux, à charge pour elle de se retourner contre l'autre",
        "Réclamer CHF 30 000.– à chacune, sans autre possibilité",
        "Attendre que les responsabilités soient établies avant toute réclamation",
        "Réclamer uniquement à celle dont la faute est la plus lourde",
      ],
      answer: [0],
      explain: "La solidarité protège le lésé : il n'a pas à démêler les responsabilités internes. Celle qui a payé exerce ensuite une action récursoire contre l'autre, selon leurs parts respectives."
    }),
    q({
      id: 'dx703', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, causalité',
      q: "La causalité en responsabilité civile : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "La causalité naturelle demande si le dommage se serait produit sans l'acte.",
        "La causalité adéquate demande si l'acte était propre, selon le cours ordinaire des choses, à produire un tel dommage.",
        "Une faute très lourde de la victime peut rompre le lien de causalité adéquate.",
        "La causalité naturelle suffit à elle seule à fonder la responsabilité.",
      ],
      answer: [0, 0, 0, 1],
      explain: "Les deux conditions sont cumulatives : sans causalité naturelle il n'y a pas de lien du tout, mais sans causalité adéquate on remonterait à l'infini dans la chaîne des causes."
    }),
    q({
      id: 'dx704', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, responsabilité du propriétaire d\'ouvrage',
      ctx: "Un balcon mal entretenu se détache et blesse un passant. Le propriétaire soutient qu'il ignorait le défaut et qu'il n'a commis aucune faute.",
      q: "Cet argument le libère-t-il ?",
      choices: [
        "Non : l'art. 58 CO institue une responsabilité causale, indépendante de toute faute",
        "Oui, l'absence de faute excluant toute responsabilité",
        "Oui, s'il prouve qu'il faisait inspecter l'immeuble régulièrement",
        "Non, mais sa responsabilité est réduite de moitié",
      ],
      answer: [0],
      explain: "Le propriétaire répond du défaut de construction ou d'entretien, qu'il l'ait connu ou non. C'est le prix de la maîtrise de l'ouvrage — et c'est ce qui rend l'assurance RC immeuble indispensable."
    }),
    q({
      id: 'dx705', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, prescription',
      q: "Quel délai de prescription s'applique à ces prétentions issues d'un acte illicite ?",
      cols: ['3 ans dès la connaissance', '10 ans dès le fait', '20 ans dès le fait'],
      rows: [
        "Délai relatif applicable à toute prétention en dommages-intérêts",
        "Délai absolu ordinaire",
        "Délai absolu en cas de lésions corporelles ou de mort d'homme",
      ],
      answer: [0, 1, 2],
      explain: "Le délai de vingt ans a été introduit pour les dommages différés, comme ceux de l'amiante, qui se révélaient après l'expiration de l'ancien délai de dix ans."
    }),

    /* ═══════ c8 — LSA, LPD, LBA ═══════ */
    q({
      id: 'dx801', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, données sensibles',
      q: "Ces données sont-elles des données personnelles sensibles ?",
      cols: ['Sensible', 'Non sensible'],
      rows: [
        "Les données relatives à la santé de l'assuré",
        "Les données biométriques identifiant une personne de manière univoque",
        "L'adresse postale du preneur d'assurance",
        "Les données relatives à des poursuites ou sanctions pénales",
      ],
      answer: [0, 0, 1, 0],
      explain: "Santé, données biométriques, poursuites pénales, opinions religieuses, politiques ou syndicales, vie intime et origine ethnique : la liste est fermée. Leur traitement obéit à des exigences renforcées."
    }),
    q({
      id: 'dx802', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, principes de traitement',
      q: "Quel principe de la protection des données chaque règle exprime-t-elle ?",
      cols: ['Proportionnalité', 'Finalité', 'Exactitude'],
      rows: [
        "Ne collecter que les données nécessaires au but poursuivi",
        "N'utiliser les données que pour le but annoncé lors de la collecte",
        "Veiller à ce que les données traitées soient correctes et à jour",
      ],
      answer: [0, 1, 2],
      explain: "Trois des principes de base, auxquels s'ajoutent la licéité, la bonne foi, la sécurité des données et la transparence. La personne concernée dispose en outre d'un droit d'accès et de rectification."
    }),
    q({
      id: 'dx803', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, droit d\'accès',
      q: "Que peut exiger la personne concernée au titre de son droit d'accès ?",
      choices: [
        "Savoir si des données la concernant sont traitées, et lesquelles",
        "Obtenir la destruction immédiate de toutes ses données",
        "Interdire à l'assureur de conserver le moindre dossier",
        "Consulter les dossiers des autres assurés comparables",
      ],
      answer: [0],
      explain: "Le droit d'accès est le point d'entrée : sans savoir ce qui est traité, on ne peut exercer aucun autre droit. Il ouvre ensuite sur la rectification et, dans certains cas, l'effacement — jamais sur un droit absolu à l'oubli."
    }),
    q({
      id: 'dx804', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, obligations de diligence',
      q: "Ces obligations découlent-elles de la LBA ou lui sont-elles étrangères ?",
      cols: ['Obligation LBA', 'Étrangère à la LBA'],
      rows: [
        "Vérifier l'identité du cocontractant",
        "Identifier l'ayant droit économique",
        "Conserver les documents pendant dix ans",
        "Refuser toute relation avec un client domicilié à l'étranger",
      ],
      answer: [0, 0, 0, 1],
      explain: "Identification, clarification en cas de risque accru, communication au Bureau de communication et conservation forment le socle de la LBA. Le domicile à l'étranger justifie une vigilance renforcée, jamais un refus automatique."
    }),
    q({
      id: 'dx805', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, communication au MROS',
      q: "Que doit faire l'intermédiaire financier qui a un soupçon fondé de blanchiment ?",
      choices: [
        "Communiquer au Bureau de communication en matière de blanchiment d'argent",
        "Dénoncer le client à la police cantonale de son domicile",
        "Résilier la relation d'affaires sans autre formalité",
        "Informer le client de ses soupçons afin qu'il s'explique",
      ],
      answer: [0],
      explain: "La communication va au MROS, pas à la police. Avertir le client est même prohibé : cela ruinerait l'enquête, et l'interdiction d'informer est expressément prévue par la loi."
    }),
    q({
      id: 'dx806', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, information au premier contact',
      q: "Ces informations doivent-elles être fournies au titre de l'art. 45 LSA ?",
      cols: ['Oui', 'Non'],
      rows: [
        "L'identité et l'adresse de l'intermédiaire",
        "Son statut : intermédiaire lié ou non lié",
        "Les liens contractuels avec les entreprises d'assurance",
        "Le chiffre d'affaires réalisé l'année précédente",
      ],
      answer: [0, 0, 0, 1],
      explain: "L'art. 45 LSA veut que le client sache à qui il parle et pour qui cette personne travaille. Le volume d'affaires de l'intermédiaire n'éclaire en rien la qualité ou l'indépendance du conseil."
    }),
    q({
      id: 'dx807', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LSA, effet du manquement à l\'information',
      q: "Quelle est la portée d'un manquement de l'intermédiaire à son devoir d'information de l'art. 45 LSA ?",
      choices: [
        "Il expose l'intermédiaire à des mesures de surveillance, sans affecter la validité du contrat",
        "Il entraîne la nullité du contrat d'assurance conclu",
        "Il permet au client de résilier le contrat en tout temps",
        "Il oblige l'assureur à rembourser toutes les primes encaissées",
      ],
      answer: [0],
      explain: "L'obligation relève du droit de la surveillance : sa violation intéresse la FINMA, pas la validité du contrat, qui reste régie par la LCA. Confondre les deux registres est le piège classique de ce chapitre."
    }),

    /* ═══════ c9 — VOIES DE DROIT ═══════ */
    q({
      id: 'dx901', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, à qui s\'adresser',
      q: "Vers quelle instance orienter chacune de ces situations ?",
      cols: ["L'ombudsman", 'Le juge civil', 'Le PFPDT', 'La FINMA'],
      rows: [
        "Un client conteste le refus d'indemnisation et cherche une solution amiable gratuite",
        "Le même client, la médiation ayant échoué, veut faire trancher son droit",
        "Un client estime que ses données de santé ont été traitées illicitement",
        "Un client s'inquiète de la solidité financière de son assureur",
      ],
      answer: [0, 1, 2, 3],
      explain: "Quatre portes différentes selon la nature du grief. La FINMA ne tranche jamais un litige individuel : elle surveille l'entreprise, et un signalement l'alimente sans donner de droit au signalant."
    }),
    q({
      id: 'dx902', chap: 'c9', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, portée de la solution acceptée',
      q: "Quelle est la portée d'une solution proposée par l'ombudsman et acceptée par les deux parties ?",
      choices: [
        "Elle engage les deux parties",
        "Elle n'a qu'une valeur de recommandation, même acceptée",
        "Elle doit encore être homologuée par un tribunal",
        "Elle n'engage que l'assureur, le client restant libre d'agir",
      ],
      answer: [0],
      explain: "L'ombudsman propose sans pouvoir imposer, mais l'accord des parties transforme la proposition en engagement. C'est la nuance qu'on rate en retenant seulement « ses décisions ne lient pas »."
    }),
    q({
      id: 'dx903', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, délais de recours',
      q: "Quel délai s'applique à chacune de ces démarches en assurances sociales ?",
      cols: ['30 jours', 'Aucun délai fixé'],
      rows: [
        "Faire opposition à la décision de l'institution d'assurance",
        "Recourir auprès de l'autorité cantonale contre la décision sur opposition",
        "Recourir au Tribunal fédéral contre la décision cantonale",
        "Demander à l'assureur des explications sur sa décision",
      ],
      answer: [0, 0, 0, 1],
      explain: "Trente jours à chaque étape formelle : c'est le rythme du droit des assurances sociales. Une simple demande d'explication n'est pas une voie de droit et n'interrompt aucun délai — d'où le risque de laisser filer le sien en discutant."
    })
  );
})();
