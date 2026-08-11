/* =============================================================
   AFA – Droit de l'assurance : LPCC

   Reprend la page de récapitulation du cours officiel sur les
   placements collectifs de capitaux : notion et égalité de
   traitement, formes ouvertes et fermées, autorisation d'offrir
   des parts, parties à une assurance-vie liée à des fonds,
   catégories de fonds, représentant d'un placement collectif
   étranger.
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

    /* ═══════════ Notion et principes ═══════════ */
    q({
      id: 'lp801', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, notion de placement collectif',
      q: "La notion de placement collectif de capitaux : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Il est formé d'apports financiers opérés par des investisseurs.",
        "Ces apports sont administrés par des tiers comme une fortune globale.",
        "Les investisseurs doivent être traités de manière égale.",
        "Chaque investisseur reste propriétaire de titres qui lui sont individuellement attribués.",
      ],
      answer: [0, 0, 0, 1],
      explain: "Trois éléments font le placement collectif : des apports réunis, une gestion par des tiers, une fortune administrée globalement. C'est précisément la mise en commun qui exclut toute attribution individuelle de titres — l'investisseur détient une part de l'ensemble, pas des actions déterminées."
    }),
    q({
      id: 'lp802', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, formes ouvertes et fermées',
      q: "Chacune de ces formes relève-t-elle du placement collectif ouvert ou fermé ?",
      cols: ['Ouvert', 'Fermé'],
      rows: [
        "Le fonds de placement contractuel",
        "La société d'investissement à capital variable (SICAV)",
        "La société d'investissement à capital fixe (SICAF)",
        "La société en commandite de placement collectif",
      ],
      answer: [0, 0, 1, 1],
      explain: "Le mot « variable » de la SICAV signale l'ouverture, le mot « fixe » de la SICAF la fermeture : le capital suit ou ne suit pas les entrées et sorties d'investisseurs. La commandite de placement collectif est fermée par nature, puisqu'elle repose sur un contrat entre associés déterminés."
    }),
    q({
      id: 'lp803', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, placement ouvert',
      q: "Qu'est-ce qui caractérise un placement collectif de capitaux ouvert ?",
      choices: [
        "Il n'est pas limité à un nombre déterminé d'investisseurs",
        "Il n'investit que dans des valeurs cotées en bourse",
        "Il est ouvert au public sans aucune autorisation préalable",
        "Il peut être résilié en tout temps par la direction du fonds",
      ],
      answer: [0],
      explain: "L'ouverture porte sur le cercle des investisseurs, non sur la nature des placements : le fonds peut accueillir de nouveaux entrants et, en contrepartie, l'investisseur peut demander la restitution de sa part. Un placement fermé ne s'adresse au contraire qu'à un cercle déterminé."
    }),
    q({
      id: 'lp804', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LPCC, autorisation d\'offrir des parts',
      q: "Que doit posséder celui qui veut offrir ou vendre des parts de placements collectifs ?",
      choices: [
        "Une autorisation de l'autorité de surveillance",
        "Une simple inscription au registre du commerce",
        "L'accord écrit de la direction du fonds concerné",
        "Rien de particulier, la vente de parts étant libre",
      ],
      answer: [0],
      explain: "L'autorisation est la clé de voûte du dispositif : c'est elle qui permet à la surveillance de savoir qui approche le public et à quelles conditions. La confiance des investisseurs repose sur ce filtrage à l'entrée, pas sur des contrôles a posteriori."
    }),

    /* ═══════════ Assurance-vie liée à des fonds ═══════════ */
    q({
      id: 'lp805', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, parties au fonds contractuel',
      q: "Dans une assurance-vie liée à des fonds de placement contractuels, quelles sont les parties en présence ?",
      choices: [
        "La direction du fonds",
        "La banque dépositaire",
        "Le distributeur",
        "Le client",
        "L'autorité de surveillance",
      ],
      answer: [0, 1, 2, 3],
      explain: "Quatre acteurs et quatre rôles : la direction gère, la banque dépositaire conserve les valeurs, le distributeur vend, le client investit. L'autorité de surveillance n'est pas partie au rapport — elle le surveille de l'extérieur, ce qui est tout autre chose."
    }),
    q({
      id: 'lp806', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, autorisations exigées',
      q: "Cet acteur doit-il obtenir une autorisation de l'autorité de surveillance ?",
      cols: ['Autorisation exigée', 'Dispensé'],
      rows: [
        "La direction du fonds",
        "La banque dépositaire",
        "Un distributeur déjà soumis à une surveillance légale spécifique",
        "Un agent intégré dans l'organisation du travail de l'assureur",
      ],
      answer: [0, 0, 1, 1],
      explain: "La règle est l'autorisation, la dispense l'exception, et elle se justifie chaque fois qu'un contrôle équivalent existe déjà : l'acteur déjà surveillé n'a pas à l'être deux fois, l'agent est couvert par l'organisation de l'assureur dont il fait partie."
    }),
    q({
      id: 'lp807', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, intermédiaire indépendant',
      q: "Quel est le sort de l'intermédiaire d'assurance indépendant qui distribue des parts de placements collectifs ?",
      choices: [
        "Il doit obtenir l'autorisation, n'étant pas intégré dans l'organisation de l'assureur",
        "Il en est dispensé, comme tout intermédiaire d'assurance",
        "Il en est dispensé s'il travaille pour un assureur autorisé",
        "Il ne peut jamais distribuer de telles parts",
      ],
      answer: [0],
      explain: "Le critère n'est pas le titre porté mais l'intégration : celui qui appartient à l'organisation de l'assureur est couvert par elle, celui qui agit pour son propre compte ne l'est par personne. C'est la différence de fond entre l'agent et le courtier."
    }),
    q({
      id: 'lp808', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      ctx: "Un courtier indépendant propose à sa cliente une assurance-vie liée à des fonds. Il n'a jamais demandé d'autorisation pour la distribution de parts de placements collectifs et estime que celle de l'assureur lui suffit.",
      theme: 'Droit, LPCC, cas pratique',
      q: "Comment jugez-vous sa position ?",
      choices: [
        "Elle est erronée : l'autorisation de l'assureur ne couvre pas un intermédiaire indépendant",
        "Elle est correcte, le produit étant celui de l'assureur",
        "Elle est correcte tant qu'il ne perçoit aucune commission sur la part de fonds",
        "Elle est correcte s'il fait signer le contrat directement par l'assureur",
      ],
      answer: [0],
      explain: "Une autorisation n'est pas transmissible : elle s'attache à celui qui l'a obtenue et aux conditions vérifiées chez lui. Le courtier qui distribue sans être couvert opère hors du régime légal, quel que soit l'acheminement du contrat."
    }),

    /* ═══════════ Catégories de fonds ═══════════ */
    q({
      id: 'lp809', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, catégories de fonds',
      q: "À quelle catégorie de la LPCC chacun de ces placements se rattache-t-il ?",
      cols: ['Valeurs mobilières', 'Immobilier', 'Autres fonds'],
      rows: [
        "Un fonds investi en actions et obligations cotées",
        "Un fonds investi dans des immeubles de rendement suisses",
        "Un fonds recourant à des stratégies alternatives et à l'effet de levier",
      ],
      answer: [0, 1, 2],
      explain: "Trois catégories, trois régimes : la LPCC ne soumet pas ces fonds aux mêmes règles quant aux placements autorisés, à la répartition des risques et aux techniques de placement. C'est le degré de risque toléré qui commande le régime."
    }),
    q({
      id: 'lp810', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, portée de la classification',
      q: "Sur quoi les règles diffèrent-elles selon la catégorie de fonds ?",
      choices: [
        "Les placements autorisés",
        "La répartition des risques",
        "Les techniques de placement",
        "L'obligation de traiter les investisseurs de manière égale",
        "La nécessité d'une banque dépositaire",
      ],
      answer: [0, 1, 2],
      explain: "Ce qui varie tient à la politique de placement ; ce qui ne varie jamais tient à la protection de l'investisseur. L'égalité de traitement et la garde des valeurs par un dépositaire valent pour toutes les catégories, sans exception."
    }),

    /* ═══════════ Placement collectif étranger ═══════════ */
    q({
      id: 'lp811', chap: 'c8', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, placement collectif étranger',
      q: "À quelle condition les parts d'un placement collectif étranger peuvent-elles être vendues en Suisse par appel au public ?",
      choices: [
        "Par l'intermédiaire d'un représentant suisse préalablement chargé de cette mission",
        "Dès que le fonds est autorisé dans son pays d'origine",
        "À condition que la vente se fasse exclusivement en ligne",
        "Sans condition, la LPCC ne visant que les fonds suisses",
      ],
      answer: [0],
      explain: "Le représentant suisse est le point d'ancrage : sans lui, l'investisseur suisse n'aurait aucun interlocuteur soumis au droit et à la surveillance d'ici. L'autorisation obtenue à l'étranger ne vaut jamais laissez-passer pour le marché suisse."
    }),
    q({
      id: 'lp812', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, statut du représentant',
      q: "Le représentant d'un placement collectif étranger : vrai ou faux ?",
      cols: VF,
      rows: [
        "Il peut être une personne physique aussi bien qu'une personne morale.",
        "Il doit disposer d'une autorisation de l'autorité de surveillance.",
        "Il doit prouver qu'il satisfait aux exigences de l'art. 14 LPCC.",
        "Il est désigné après le début de la distribution en Suisse.",
      ],
      answer: [0, 0, 0, 1],
      explain: "« Préalablement chargé de cette mission » : la désignation précède la distribution, faute de quoi le dispositif de protection arriverait après les investisseurs. L'art. 14 LPCC fixe les exigences que le requérant doit établir pour obtenir son autorisation."
    }),
    q({
      id: 'lp813', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPCC, conditions de la distribution',
      q: "Quelles exigences accompagnent la distribution en Suisse des parts d'un placement collectif étranger ?",
      choices: [
        "Un représentant a été désigné pour les parts distribuées en Suisse",
        "Un service de paiement a été désigné en Suisse",
        "La dénomination du placement ne prête pas à confusion ni n'induit en erreur",
        "Le fonds est administré depuis un siège situé en Suisse",
        "Les investisseurs suisses bénéficient d'un rendement minimum garanti",
      ],
      answer: [0, 1, 2],
      explain: "Représentant, service de paiement, dénomination loyale : trois exigences tournées vers l'investisseur suisse, qui doit savoir à qui s'adresser, où son argent transite et ce qu'il achète. Exiger un siège en Suisse reviendrait à interdire les fonds étrangers, ce qui n'est pas le but."
    }),
    q({
      id: 'lp814', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LPCC, but de la surveillance',
      q: "Que visent les dispositions de l'État en matière de placements collectifs de capitaux ?",
      choices: [
        "La protection des droits des investisseurs",
        "La garantie du rendement des fonds distribués",
        "La limitation du nombre de fonds admis sur le marché",
        "Le financement des marchés de capitaux suisses",
      ],
      answer: [0],
      explain: "L'État protège le processus, jamais le résultat : transparence, séparation des rôles et surveillance des acteurs. Le risque de placement demeure entièrement chez l'investisseur — c'est la contrepartie du rendement qu'il espère."
    })
  );
})();
