/* =============================================================
   AFA – Mises en situation, format « plateforme » :
     · classification d'une situation dans une catégorie A/B/C ;
     · sélection multiple dont chaque choix est lui-même une situation.
   Chaque question porte son propre énoncé (champ `ctx`).
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list.map(q => ({ ...q, lvl: 'cas' })));
  };

  /* Catégories réutilisées pour les questions de classification « fin du contrat » */
  const FIN = [
    "Il prend fin automatiquement, sans intervention des parties",
    "Le preneur peut résilier, ou l'acquéreur refuser le transfert",
    "Seul l'assureur dispose d'un droit de résiliation"
  ];
  const CONSIGNE_FIN = "Dans certains cas, les contrats d'assurance prennent fin par eux-mêmes. Dans d'autres situations, le contrat est résilié par le preneur d'assurance ou par l'assureur.";

  /* ============ MODULE 2 : LCA – fin du contrat et prime ============ */
  add('m2', [
    /* ---- Classification : fin du contrat (une question par situation) ---- */
    { id: 'm2f01', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, fin du contrat",
      ctx: CONSIGNE_FIN + " — La famille Gruber vend sa maison. Celle-ci est assurée auprès d'un assureur privé.",
      q: "Quelle issue le contrat connaît-il dans cette situation ?",
      choices: [
        "Il prend fin automatiquement, sans intervention des parties",
        "Le preneur peut résilier, ou l'acquéreur refuser le transfert",
        "Seul l'assureur dispose d'un droit de résiliation",
      ],
      answer: [1],
      explain: "L'initiative appartient ici au preneur ou à l'acquéreur : le contrat ne tombe pas de lui-même et l'assureur ne peut pas l'imposer. Sans réaction dans le délai, la couverture se poursuit." },

    { id: 'm2f02', chap: 'c4', type: 'single',
      ctx: CONSIGNE_FIN + " — Jean Aymard annonce un sinistre bagatelle à son assureur responsabilité civile, qui prend le cas en charge.",
      q: "Quelle issue le contrat connaît-il dans cette situation ?", choices: FIN, answer: [2],
      explain: "Après un sinistre pour lequel une prestation a été versée, l'assureur dispose d'un droit de résiliation (art. 42 LCA) — droit qui lui est retiré en assurance-maladie complémentaire." },

    { id: 'm2f03', chap: 'c4', type: 'single',
      ctx: CONSIGNE_FIN + " — Le véhicule de Christian Simon subit un dommage total : il est détruit et mis à la casse.",
      q: "Quelle issue le contrat connaît-il dans cette situation ?", choices: FIN, answer: [0],
      explain: "L'objet assuré n'existe plus : le risque disparaît et le contrat devient caduc de plein droit, sans qu'aucune résiliation soit nécessaire." },

    { id: 'm2f04', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, fin du contrat",
      ctx: CONSIGNE_FIN + " — L'assureur informe Pierre Blanc que sa prime d'assurance responsabilité civile automobile sera majorée l'an prochain.",
      q: "Quelle issue le contrat connaît-il dans cette situation ?",
      choices: [
        "Il prend fin automatiquement, sans intervention des parties",
        "Le preneur peut résilier, ou l'acquéreur refuser le transfert",
        "Seul l'assureur dispose d'un droit de résiliation",
      ],
      answer: [1],
      explain: "Le contrat survit à l'événement et passe à l'acquéreur : il faut une déclaration pour y mettre fin. C'est la logique de l'art. 54 LCA, qui protège la continuité de la couverture." },

    { id: 'm2f05', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, fin du contrat",
      ctx: CONSIGNE_FIN + " — Sophie Aebi a conclu son assurance ménage il y a quatre ans pour une durée de dix ans. Elle souhaite en sortir pour la prochaine échéance annuelle.",
      q: "Quelle issue le contrat connaît-il dans cette situation ?",
      choices: [
        "Il prend fin automatiquement, sans intervention des parties",
        "Le preneur peut résilier, ou l'acquéreur refuser le transfert",
        "Seul l'assureur dispose d'un droit de résiliation",
      ],
      answer: [1],
      explain: "Ni extinction de plein droit, ni monopole de l'assureur : la loi confie le choix à celui qui subit le changement. Le silence vaut maintien du contrat." },

    { id: 'm2f06', chap: 'c4', type: 'single',
      ctx: CONSIGNE_FIN + " — L'entreprise d'assurance de Marc Duvoisin tombe en faillite.",
      q: "Quelle issue le contrat connaît-il dans cette situation ?", choices: FIN, answer: [0],
      explain: "La faillite de l'assureur met fin au contrat de plein droit ; les prétentions des assurés sont couvertes en priorité par la fortune liée." },

    { id: 'm2f07', chap: 'c4', type: 'single',
      ctx: CONSIGNE_FIN + " — Après un dégât d'eau indemnisé chez Laura Steiner, l'assureur constate que le risque est devenu trop lourd pour lui.",
      q: "Quelle issue le contrat connaît-il dans cette situation ?", choices: FIN, answer: [2],
      explain: "Le droit de résiliation après sinistre appartient aux deux parties ; c'est ici l'assureur qui l'exerce, dans le délai prévu par la loi et le contrat." },

    { id: 'm2f08', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, fin du contrat",
      ctx: CONSIGNE_FIN + " — Paul Renaud achète la voiture d'occasion de son voisin ; l'assurance casco du vendeur court encore neuf mois.",
      q: "Quelle issue le contrat connaît-il dans cette situation ?",
      choices: [
        "Il prend fin automatiquement, sans intervention des parties",
        "Le preneur peut résilier, ou l'acquéreur refuser le transfert",
        "Seul l'assureur dispose d'un droit de résiliation",
      ],
      answer: [1],
      explain: "Le droit de mettre fin au contrat appartient au preneur ou à l'acquéreur, dans le délai légal. Passé celui-ci, la couverture continue aux conditions convenues." },

    /* ---- Sélection multiple sur situations : divisibilité de la prime ---- */
    { id: 'm2p01', chap: 'c4', type: 'multi',
      ctx: "Depuis la révision de la LCA, la prime n'est en principe due que jusqu'à la fin du contrat : l'assuré récupère la part non utilisée. Deux exceptions maintiennent la prime entière due à l'assureur.",
      q: "Dans lesquelles des situations décrites ci-dessous l'assuré récupère-t-il la part de la prime inutilisée ?",
      choices: [
        "La voiture d'un client a subi un dommage total. L'assureur couvre l'intégralité du préjudice. Néanmoins, le client change d'assureur.",
        "À la suite d'une collision, le véhicule du client présente quelques tôles froissées. Le sinistre est pris en charge par l'assureur. Nonobstant, le client résilie l'assurance des véhicules à moteur conclue six mois auparavant.",
        "Le propriétaire d'une entreprise résilie, à la suite d'un dommage partiel, l'assurance du commerce conclue trois ans auparavant.",
        "Pour cause de retraite, Monsieur Maître abandonne sa menuiserie au milieu de l'année. L'ensemble des assurances prennent fin à ce moment-là."
      ],
      answer: [2],
      explain: "Seule la troisième : la résiliation après sinistre intervient au-delà de la première année, donc le principe de divisibilité s'applique. Les situations 1 et 4 relèvent de la disparition du risque (véhicule détruit, activité cessée) et la situation 2 d'une résiliation dans l'année suivant la conclusion : dans ces trois cas, la prime de la période en cours reste acquise à l'assureur." },

    { id: 'm2p02', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, divisibilité de la prime",
      ctx: "Le véhicule d'une cliente est déclaré épave après un accident. L'assureur verse l'indemnité de dommage total. Il reste sept mois de prime déjà payée sur la période d'assurance en cours.",
      q: "La cliente récupère-t-elle cette part de prime ?",
      choices: [
        "Oui, la prime étant divisible en toute hypothèse",
        "Non : le risque a disparu, la prime entière reste acquise",
        "Oui, mais à concurrence de la moitié seulement",
        "Cela dépend du montant de la franchise convenue",
      ],
      answer: [1],
      explain: "La disparition du risque est l'une des deux exceptions à la divisibilité de l'art. 24 LCA. L'assureur garde la prime de la période en cours, alors qu'il la restituerait au prorata dans les autres cas de fin anticipée." },

    { id: 'm2p03', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, divisibilité de la prime",
      ctx: "Un client a conclu son assurance ménage il y a cinq mois. Un cambriolage est indemnisé, puis il résilie le contrat en invoquant son droit de résiliation après sinistre. Quatre mois de prime restent à courir.",
      q: "Que devient la prime non utilisée ?",
      choices: [
        "Elle est remboursée au prorata de la période non courue",
        "Elle reste acquise : la résiliation intervient dans l'année suivant la conclusion",
        "Elle est remboursée à concurrence de la moitié",
        "Elle est reportée sur le prochain contrat souscrit",
      ],
      answer: [1],
      explain: "Seconde exception de l'art. 24 LCA : résilier durant la première année ne donne droit à aucune restitution. La règle évite qu'on souscrive pour quelques semaines avant de se dédire." },

    { id: 'm2p04', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, divisibilité de la prime",
      ctx: "Une entreprise assurée depuis huit ans subit un dommage partiel indemnisé. Elle résilie alors son contrat, alors que cinq mois de prime restent à courir sur la période en cours.",
      q: "Que devient cette part de prime ?",
      choices: [
        "Elle reste intégralement acquise à l'assureur",
        "Elle est remboursée : le principe de divisibilité s'applique",
        "Elle est convertie en réduction de franchise",
        "Elle est perdue pour moitié, à titre de frais",
      ],
      answer: [1],
      explain: "Aucune des deux exceptions ne joue ici : on revient au principe de l'art. 24 LCA, la prime n'étant due que pour le temps réellement couvert. L'assureur restitue le prorata." },

    { id: 'm2p05', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, divisibilité de la prime",
      ctx: "Un artisan cesse définitivement son activité en juin et ses contrats d'assurance d'entreprise prennent fin à ce moment. Il avait payé la prime annuelle en janvier.",
      q: "Peut-il exiger le remboursement des six mois de prime restants ?",
      choices: [
        "Oui, la prime étant divisible par principe",
        "Non : la cessation de l'activité fait disparaître le risque",
        "Oui, mais uniquement pour les assurances de choses",
        "Oui, sur décision de l'autorité de surveillance",
      ],
      answer: [1],
      explain: "Plus d'activité, plus de risque à couvrir : on retombe sur l'exception à la divisibilité. Une résiliation ordinaire à l'échéance aurait, elle, donné droit au remboursement du prorata." },

    { id: 'm2p06', chap: 'c4', type: 'multi',
      ctx: "Vous devez expliquer à un client la règle de la prime depuis la révision de la LCA.",
      q: "Quelles affirmations sont exactes ?",
      choices: [
        "En principe, la prime n'est due que jusqu'à la fin du contrat",
        "Le principe d'indivisibilité de la prime a été abandonné",
        "La prime reste entière due en cas de disparition du risque",
        "La prime reste entière due si le preneur résilie après sinistre dans l'année suivant la conclusion",
        "La prime est toujours remboursée au prorata, sans exception"
      ],
      answer: [0, 1, 2, 3],
      explain: "La divisibilité est le principe, mais elle connaît deux exceptions précises. Affirmer qu'il n'y en a aucune est l'erreur classique." },

    /* ---- Transfert de propriété : délais ---- */
    { id: 'm2t01', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, refus du transfert",
      ctx: "Madame Vaucher achète un immeuble le 1er mars. Le bâtiment est assuré auprès d'un assureur privé et elle ne souhaite pas conserver ce contrat.",
      q: "De quel délai dispose-t-elle pour refuser le transfert du contrat ?",
      choices: [
        "De 14 jours dès la connaissance du transfert",
        "De 30 jours suivant le changement de propriétaire",
        "De 3 mois dès l'inscription au registre",
        "D'aucun : le transfert s'impose à l'acquéreur",
      ],
      answer: [1],
      explain: "Art. 54 LCA : l'acquéreur reprend le contrat de plein droit, mais peut le refuser dans les trente jours. À ne pas confondre avec les quatorze jours dont dispose l'assureur pour résilier de son côté." },

    { id: 'm2t02', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, résiliation par l'assureur",
      ctx: "Le même immeuble a changé de mains. L'assureur apprend l'identité de la nouvelle propriétaire et estime que le risque ne lui convient plus.",
      q: "De quel délai dispose-t-il pour résilier, et quand le contrat prend-il fin ?",
      choices: [
        "30 jours pour résilier, avec effet immédiat",
        "14 jours dès la connaissance de l'identité, le contrat finissant 30 jours plus tard au plus tôt",
        "3 mois pour résilier, avec effet à l'échéance annuelle",
        "Aucun : l'assureur ne peut pas résilier dans ce cas",
      ],
      answer: [1],
      explain: "L'assureur doit réagir vite une fois qu'il sait qui est le nouveau propriétaire, mais le contrat ne s'arrête pas du jour au lendemain : l'acquéreur garde trente jours pour se réassurer ailleurs." },

    { id: 'm2t03', chap: 'c4', type: 'single',
      ctx: "Un client vend sa voiture à un tiers et vous demande si son assurance casco s'arrête automatiquement le jour de la vente.",
      q: "Que lui répondez-vous ?",
      choices: ["Oui, la vente met fin au contrat de plein droit", "Non : les droits et obligations passent à l'acquéreur, qui peut refuser dans les 30 jours", "Non, le contrat continue sans possibilité d'y mettre fin", "Oui, si la vente est notariée"],
      answer: [1],
      explain: "La vente n'éteint pas le contrat : elle ouvre une fenêtre pendant laquelle l'acquéreur peut refuser et l'assureur peut résilier." },

    { id: 'm2t04', chap: 'c4', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, changement de propriétaire",
      ctx: "Un immeuble locatif calme est vendu à un exploitant qui y installe un atelier de peinture industrielle. Le risque d'incendie s'en trouve nettement accru.",
      q: "Comment l'assureur peut-il réagir, au-delà de son droit de résiliation lié au changement de propriétaire ?",
      choices: [
        "Il ne dispose d'aucun autre moyen d'action",
        "Les règles sur l'aggravation du risque s'appliquent par analogie",
        "Il peut exiger le doublement de la somme d'assurance",
        "Il doit soumettre le cas à l'autorité de surveillance",
      ],
      answer: [1],
      explain: "Un nouveau propriétaire peut changer profondément le risque — usage du bien, expérience, environnement. L'assureur peut alors adapter la prime ou se départir du contrat selon le régime de l'aggravation." }
  ]);

  /* ============ MODULE 3 : déclinaison non-vie ============ */
  add('m3', [
    { id: 'm3p01', chap: 'c8', type: 'multi',
      ctx: "Vous gérez le portefeuille non-vie de plusieurs clients dont les contrats prennent fin en cours d'année.",
      q: "Dans lesquelles de ces situations la part de prime non utilisée est-elle remboursée ?",
      choices: [
        "Le hangar assuré brûle entièrement ; l'assureur indemnise le dommage total et le contrat tombe.",
        "Un client résilie son assurance de choses après un dommage partiel indemnisé, contrat conclu quatre ans plus tôt.",
        "Un commerçant ferme définitivement son magasin en septembre ; les contrats prennent fin à cette date.",
        "Un client résilie après un sinistre partiel une police conclue trois mois auparavant."
      ],
      answer: [1],
      explain: "Seule la deuxième : ni disparition du risque, ni résiliation pendant la première année. Les cas 1 et 3 sont des disparitions du risque, le cas 4 une résiliation dans l'année suivant la conclusion." },

    { id: 'm3p02', chap: 'c3', type: 'single',
      ctx: "La voiture d'un client est volée et jamais retrouvée. L'assureur verse l'indemnité de vol correspondant à la valeur du véhicule. Le client, qui ne rachète pas de voiture, demande le remboursement des cinq mois de prime restants.",
      q: "Quelle réponse est correcte ?",
      choices: ["La prime est remboursée au prorata", "La prime de la période en cours reste acquise à l'assureur : le risque a disparu", "Le remboursement dépend du degré de bonus", "Le contrat se poursuit sur un autre véhicule"],
      answer: [1],
      explain: "Le véhicule assuré n'existe plus pour l'assuré : le contrat devient caduc par disparition du risque, l'une des deux exceptions à la divisibilité de la prime." },

    { id: 'm3p03', chap: 'c3', type: 'single',
      ctx: "Un client vend son véhicule le 10 avril. Il ne prévient pas son assureur et suppose que tout s'arrête ce jour-là. L'acquéreur, lui, ne fait aucune démarche.",
      q: "Quelle est la situation juridique ?",
      choices: ["Le contrat s'est éteint le 10 avril", "Le contrat a passé à l'acquéreur, qui disposait de 30 jours pour le refuser", "Le contrat est nul", "Le contrat continue au nom du vendeur"],
      answer: [1],
      explain: "Faute de refus dans le délai de 30 jours, l'acquéreur reprend le contrat. Le vendeur a tout intérêt à annoncer la vente pour clarifier sa propre situation." },

    { id: 'm3p04', chap: 'c8', type: 'single',
      ctx: "Une PME a conclu son assurance de choses il y a huit mois. Un incendie partiel est indemnisé et l'entreprise décide de changer d'assureur en invoquant la résiliation après sinistre.",
      q: "Que devient la prime de la période en cours ?",
      choices: ["Elle est remboursée au prorata", "Elle reste entièrement due à l'assureur", "Elle est remboursée à hauteur de 50 %", "Elle est transférée au nouvel assureur"],
      answer: [1],
      explain: "La résiliation après sinistre survient dans l'année suivant la conclusion : l'exception de l'art. 24 LCA joue et la prime reste acquise." }
  ]);
})();
