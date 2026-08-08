/* =============================================================
   AFA – Alignement sur le plan officiel des deux modules

   Plan relevé sur la plateforme :
     Industrie de l'assurance
       · Notions élémentaires
       · Risque et gestion des risques
       · Les affaires d'assurance
       · Intermédiation en assurance
       · Composition de la prime et systèmes de financement
       · Classification des assurances
     Droit des assurances
       · Aperçu et surveillance des assurances
       · Contrat d'assurance et juridiction
       · Droit relatif aux intermédiaires d'assurance

   Ce fichier ajoute les sujets officiels qui manquaient, et
   déclare la correspondance entre les chapitres du site et le
   plan officiel.
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m1 = M.find(x => x.id === 'm1');
  const m2 = M.find(x => x.id === 'm2');
  if (!m1 || !m2) return;

  /* ---------------------------------------------------------
     1. Section manquante : les systèmes de financement
        (chapitre officiel « Composition de la prime et
         systèmes de financement »)
     --------------------------------------------------------- */
  const c2 = m1.chapters.find(c => c.id === 'c2');
  if (c2) {
    c2.sections.push({
      h: "Les systèmes de financement",
      html: `<p>Une assurance peut financer ses prestations de trois manières. La distinction est un classique de l'examen&nbsp;:</p>
      <table class="tbl">
        <tr><th>Procédé</th><th>Principe</th><th>Où il s'applique</th></tr>
        <tr>
          <td><b>Répartition des dépenses</b><br><span class="muted small">appelé <b>système de la couverture des besoins</b> dans les questions officielles</span></td>
          <td>Les cotisations encaissées pendant une période financent <b>directement</b> les prestations versées pendant cette même période. Rien n'est mis de côté pour l'avenir.</td>
          <td><b>AVS / AI / APG</b>, assurance-chômage, allocations familiales&nbsp;; en <b>LAA</b>, les soins, les indemnités journalières et les autres charges à court terme.</td>
        </tr>
        <tr>
          <td><b>Capitalisation</b></td>
          <td>Les cotisations sont <b>accumulées et placées</b>&nbsp;; l'avoir constitué finance plus tard les prestations de la <b>même</b> personne.</td>
          <td><b>LPP</b>, pilier 3a et 3b, assurance-vie privée.</td>
        </tr>
        <tr>
          <td><b>Répartition des capitaux de couverture</b><br><span class="muted small">le <b>système de répartition</b> au sens strict</span></td>
          <td>Lorsqu'une rente est <b>fixée</b>, le capital nécessaire à son service futur est <b>constitué immédiatement</b> et financé par les cotisations de la période en cours.</td>
          <td><b>LAA</b> pour les rentes d'invalidité et de survivants.</td>
        </tr>
      </table>
      <p class="tip">Moyen mnémotechnique&nbsp;: l'AVS <b>dépense ce qu'elle encaisse</b>, la LPP <b>épargne pour chacun</b>, et la LAA <b>met de côté d'un coup</b> le capital de chaque rente qu'elle accorde.</p>`
    });
    c2.keypoints.push(
      "Répartition des dépenses : les cotisations financent les prestations de la même période (AVS).",
      "Capitalisation : chacun constitue son propre avoir (LPP, 3e pilier, vie).",
      "Répartition des capitaux de couverture : le capital d'une rente est constitué dès sa fixation (rentes LAA).",
      "Vocabulaire de l'examen : « couverture des besoins » = répartition des dépenses ; « système de répartition » = la solidarité actifs/rentiers de l'AVS."
    );
  }

  /* ---------------------------------------------------------
     2. Chapitres officiels manquants
     --------------------------------------------------------- */
  m1.chapters.push(
    {
      id: 'c9',
      title: 'Notions élémentaires',
      resume: "Le vocabulaire de base : qui est qui, quels documents, quels montants, et les grandes distinctions.",
      sections: [
        {
          h: "Qui est qui",
          html: `<table class="tbl">
            <tr><th>Rôle</th><th>Définition</th></tr>
            <tr><td><b>Preneur d'assurance</b></td><td>Le cocontractant de l'assureur. Il signe, doit la <b>prime</b> et exerce les droits du contrat (résiliation, modification).</td></tr>
            <tr><td><b>Assuré</b></td><td>La personne — ou la chose — exposée au risque couvert.</td></tr>
            <tr><td><b>Ayant droit / bénéficiaire</b></td><td>Celui qui peut réclamer la prestation.</td></tr>
            <tr><td><b>Entreprise d'assurance</b></td><td>Le porteur du risque, autorisé par la FINMA.</td></tr>
            <tr><td><b>Intermédiaire</b></td><td>Lié (pour l'assureur) ou non lié (pour le preneur).</td></tr>
          </table>
          <p>Les trois premiers rôles peuvent être réunis sur une même personne, ou répartis&nbsp;: un employeur (preneur) assure ses salariés (assurés) qui percevront eux-mêmes les prestations (ayants droit). C'est l'<b>assurance pour compte d'autrui</b>.</p>`
        },
        {
          h: "Les documents du contrat",
          html: `<ul>
            <li><b>Proposition</b>&nbsp;: l'offre, émanant en règle générale du client.</li>
            <li><b>Police</b>&nbsp;: le document qui <b>constate</b> le contrat. Moyen de preuve, jamais condition de validité.</li>
            <li><b>Conditions générales (CGA)</b>&nbsp;: le texte préformulé qui définit couverture, exclusions et obligations.</li>
            <li><b>Conditions spéciales / particulières</b>&nbsp;: ce qui est convenu pour ce contrat précis. En cas de contradiction, elles <b>priment</b> les conditions générales.</li>
            <li><b>Avenant</b>&nbsp;: la modification écrite d'un contrat en cours.</li>
          </ul>`
        },
        {
          h: "Les montants",
          html: `<ul>
            <li><b>Prime</b>&nbsp;: le prix de la garantie, payable d'avance et <b>quérable</b>.</li>
            <li><b>Période d'assurance</b>&nbsp;: l'unité de temps sur laquelle la prime est calculée, en général une année.</li>
            <li><b>Somme d'assurance</b>&nbsp;: le <b>plafond</b> de la prestation.</li>
            <li><b>Valeur d'assurance</b>&nbsp;: ce que vaut réellement l'objet assuré. Somme inférieure à la valeur = <b>sous-assurance</b>.</li>
            <li><b>Franchise</b>&nbsp;: la part du dommage laissée à la charge de l'assuré.</li>
            <li><b>Sous-limite</b>&nbsp;: un plafond particulier applicable à une catégorie (objets de valeur, vol à l'extérieur).</li>
          </ul>`
        },
        {
          h: "Les grandes distinctions",
          html: `<ul>
            <li><b>Assurance privée</b> (LCA, contrat, liberté) / <b>assurance sociale</b> (loi, affiliation obligatoire, droit public).</li>
            <li><b>Obligatoire</b> (LAMal, LAA, RC véhicule) / <b>facultative</b> (ménage, protection juridique).</li>
            <li><b>Personnes</b> / <b>choses</b> / <b>patrimoine</b>.</li>
            <li><b>Assurance de dommages</b> (principe indemnitaire, subrogation) / <b>assurance de sommes</b> (montant convenu, cumul possible).</li>
            <li><b>Individuelle</b> / <b>collective</b>.</li>
          </ul>`
        }
      ],
      keypoints: [
        "Preneur = signe et paie ; assuré = porte le risque ; ayant droit = touche la prestation.",
        "La police prouve le contrat ; les conditions spéciales priment les conditions générales.",
        "Somme d'assurance = plafond ; valeur d'assurance = réalité. Somme < valeur = sous-assurance.",
        "Privée/sociale, obligatoire/facultative, personnes/choses/patrimoine, dommages/sommes.",
        "Assurance pour compte d'autrui : le preneur contracte en faveur d'un tiers assuré."
      ]
    },
    {
      id: 'c10',
      title: "Les affaires d'assurance",
      resume: "Comment une compagnie fabrique et vend sa prestation, et d'où vient son résultat.",
      sections: [
        {
          h: "Un cycle de production inversé",
          html: `<p>Une entreprise ordinaire connaît son coût de revient avant de fixer son prix. L'assureur fait l'inverse&nbsp;: il <b>encaisse la prime d'abord</b> et ne découvre le coût réel de sa prestation que <b>plus tard</b>, parfois des années après.</p>
          <p>Trois conséquences majeures&nbsp;:</p>
          <ul>
            <li>le prix repose sur une <b>estimation statistique</b>, jamais sur un coût connu&nbsp;;</li>
            <li>l'assureur détient entre-temps des fonds considérables qu'il doit <b>placer</b>&nbsp;;</li>
            <li>il doit constituer des <b>provisions</b> pour des engagements dont il ignore encore le montant définitif.</li>
          </ul>`
        },
        {
          h: "La chaîne de valeur",
          html: `<ol>
            <li><b>Conception du produit</b>&nbsp;: définition du risque couvert, des exclusions et du tarif.</li>
            <li><b>Distribution</b>&nbsp;: service externe, agences, courtiers, bancassurance, vente en ligne.</li>
            <li><b>Souscription</b>&nbsp;: appréciation du risque, acceptation, refus ou acceptation avec réserves.</li>
            <li><b>Encaissement et administration</b> des contrats.</li>
            <li><b>Placements</b>&nbsp;: gestion de la fortune, dont la <b>fortune liée</b> affectée aux engagements d'assurance.</li>
            <li><b>Sinistres</b>&nbsp;: vérification de la couverture, chiffrage, règlement, recours.</li>
            <li><b>Réassurance</b>&nbsp;: cession d'une part des risques.</li>
          </ol>`
        },
        {
          h: "D'où vient le résultat",
          html: `<p>Le résultat d'un assureur a <b>deux sources</b> distinctes&nbsp;:</p>
          <table class="tbl">
            <tr><th>Résultat technique</th><th>Résultat financier</th></tr>
            <tr>
              <td>Primes acquises − charge des sinistres − frais. Mesuré par le <b>combined ratio</b>&nbsp;: en dessous de 100&nbsp;%, l'activité d'assurance est bénéficiaire.</td>
              <td>Produits des placements de la fortune, en particulier des provisions et de la fortune liée.</td>
            </tr>
          </table>
          <p>Un assureur peut afficher un combined ratio supérieur à 100&nbsp;% et rester bénéficiaire grâce à ses placements&nbsp;— situation courante lorsque les taux d'intérêt sont élevés, dangereuse lorsqu'ils sont bas.</p>`
        }
      ],
      keypoints: [
        "Cycle de production inversé : la prime est encaissée avant que le coût soit connu.",
        "Chaîne de valeur : produit, distribution, souscription, administration, placements, sinistres, réassurance.",
        "Deux sources de résultat : technique (combined ratio) et financier (placements).",
        "Un combined ratio > 100 % peut être compensé par le résultat des placements.",
        "Les provisions et la fortune liée constituent l'essentiel des fonds placés."
      ]
    }
  );

  m2.chapters.push({
    id: 'c9',
    title: 'Conciliation et juridiction',
    resume: "Où et comment un litige d'assurance se règle : réclamation, médiation, conciliation, procès.",
    sections: [
      {
        h: "Les étapes, dans l'ordre",
        html: `<ol>
          <li><b>Réclamation interne</b> auprès de l'assureur — gratuite, souvent la plus rapide.</li>
          <li><b>Ombudsman de l'assurance privée et de la SUVA</b> — <b>gratuit</b>, neutre, informel. Il émet des <b>recommandations</b>, <b>sans force obligatoire</b>, et ne rend aucune décision.</li>
          <li><b>Autorité de conciliation</b> — avant le procès civil, une <b>tentative de conciliation</b> est en principe obligatoire. Si elle échoue, l'autorité délivre l'autorisation de procéder.</li>
          <li><b>Tribunal civil</b> de première instance, puis les voies de recours cantonales et le <b>Tribunal fédéral</b>.</li>
        </ol>
        <p>La <b>FINMA</b> n'intervient à aucune de ces étapes comme instance de recours&nbsp;: elle surveille les entreprises, elle ne tranche pas les litiges contractuels.</p>`
      },
      {
        h: "Où agir : le for",
        html: `<p>Le preneur d'assurance consommateur peut porter l'action&nbsp;:</p>
        <ul>
          <li>au for de son <b>domicile</b> en Suisse&nbsp;;</li>
          <li>ou au <b>siège</b> de l'entreprise d'assurance.</li>
        </ul>
        <p>Ce for du domicile est une protection importante&nbsp;: il évite au client de devoir plaider à l'autre bout du pays contre une partie économiquement plus forte.</p>`
      },
      {
        h: "Particularités de la procédure",
        html: `<ul>
          <li><b>Procédure simplifiée</b> pour les litiges patrimoniaux dont la valeur ne dépasse pas <b>CHF 30&nbsp;000.–</b>&nbsp;: formes allégées, juge plus actif dans l'établissement des faits.</li>
          <li><b>Assurances complémentaires à l'assurance-maladie sociale</b>&nbsp;: les cantons peuvent désigner un <b>tribunal statuant en instance cantonale unique</b>&nbsp;; la procédure y est simplifiée et, dans plusieurs cantons, sans frais judiciaires.</li>
          <li><b>Prescription</b>&nbsp;: 5&nbsp;ans dès le fait d'où naît l'obligation (art. 46 LCA). Elle n'est <b>jamais relevée d'office</b> par le juge&nbsp;: le débiteur doit l'invoquer.</li>
          <li><b>Fardeau de la preuve</b>&nbsp;: à l'ayant droit d'établir le sinistre et son montant, à l'assureur d'établir les faits d'exclusion, la faute grave ou la fraude qu'il invoque.</li>
        </ul>`
      }
    ],
    keypoints: [
      "Ordre : réclamation interne, Ombudsman, conciliation, tribunal civil.",
      "L'Ombudsman est gratuit et ne rend que des recommandations non contraignantes.",
      "For : domicile du preneur consommateur ou siège de l'assureur.",
      "Procédure simplifiée jusqu'à CHF 30 000.– de valeur litigieuse.",
      "La prescription de 5 ans doit être invoquée : le juge ne la relève pas d'office."
    ]
  });

  /* ---------------------------------------------------------
     3. Correspondance avec le plan officiel
     --------------------------------------------------------- */
  m1.planOfficiel = [
    ["Notions élémentaires", "Chapitre 9"],
    ["Risque et gestion des risques", "Chapitre 1"],
    ["Les affaires d'assurance", "Chapitres 10 et 5"],
    ["Intermédiation en assurance", "Chapitre 6"],
    ["Composition de la prime et systèmes de financement", "Chapitre 2"],
    ["Classification des assurances", "Chapitre 4"],
    ["(hors plan « Industrie » : réassurance, surveillance, prévoyance)", "Chapitres 3, 7 et 8"]
  ];
  m2.planOfficiel = [
    ["Aperçu et surveillance des assurances", "Chapitres 1 et 8"],
    ["Contrat d'assurance : sources juridiques", "Chapitres 1 et 2"],
    ["Comment se forme le contrat d'assurance", "Chapitre 3"],
    ["Droits et obligations des parties", "Chapitres 4 et 5"],
    ["Durée et fin du contrat d'assurance", "Chapitre 4"],
    ["Procédure de conciliation et juridiction", "Chapitre 9"],
    ["Droit relatif aux intermédiaires d'assurance", "Chapitre 8"],
    ["(compléments : sous-assurance, responsabilité civile, LPD et LBA)", "Chapitres 6, 7 et 8"]
  ];

  /* ---------------------------------------------------------
     4. Questions sur les sujets nouvellement couverts
     --------------------------------------------------------- */
  const push = (mod, list) => mod.questions.push(...list);

  push(m1, [
    /* --- Systèmes de financement (c2) --- */
    { id: 'm1c2s01', chap: 'c2', type: 'single',
      q: "Selon quel procédé l'AVS est-elle financée ?",
      choices: ["La capitalisation", "La répartition des dépenses", "La répartition des capitaux de couverture", "Le financement par l'impôt uniquement"],
      answer: [1],
      explain: "Les cotisations encaissées pendant une période financent directement les rentes versées pendant cette même période : rien n'est mis de côté pour l'avenir." },

    { id: 'm1c2s02', chap: 'c2', type: 'single',
      q: "Selon quel procédé la prévoyance professionnelle (LPP) est-elle financée ?",
      choices: ["La répartition des dépenses", "La capitalisation", "La répartition des capitaux de couverture", "Le système des trois piliers"],
      answer: [1],
      explain: "Chaque assuré constitue et place son propre avoir de vieillesse, qui financera plus tard ses propres prestations." },

    { id: 'm1c2s03', chap: 'c2', type: 'single',
      q: "Comment les rentes d'invalidité et de survivants de la LAA sont-elles financées ?",
      choices: ["Par répartition des dépenses", "Par capitalisation individuelle dès l'affiliation", "Par répartition des capitaux de couverture", "Par l'impôt fédéral"],
      answer: [2],
      explain: "Lorsqu'une rente est fixée, le capital nécessaire à son service futur est constitué immédiatement et financé par les cotisations de la période en cours." },

    { id: 'm1c2s04', chap: 'c2', type: 'multi',
      q: "Quelles prestations de la LAA sont financées par répartition des dépenses ?",
      choices: ["Les frais de traitement", "Les indemnités journalières", "Les rentes d'invalidité", "Les rentes de survivants", "Les autres charges à court terme"],
      answer: [0, 1, 4],
      explain: "La LAA combine deux procédés : répartition des dépenses pour les charges à court terme, répartition des capitaux de couverture pour les rentes." },

    { id: 'm1c2s05', chap: 'c2', type: 'single', lvl: 'cas',
      ctx: "Un client vous demande pourquoi l'AVS n'a pas « son argent de côté » alors que sa caisse de pension lui envoie chaque année un certificat indiquant son avoir accumulé.",
      q: "Quelle explication donnez-vous ?",
      choices: [
        "L'AVS a mal géré ses fonds",
        "L'AVS fonctionne par répartition des dépenses, la LPP par capitalisation individuelle",
        "Les deux fonctionnent par capitalisation, mais l'AVS ne communique pas",
        "L'AVS fonctionne par répartition des capitaux de couverture"
      ],
      answer: [1],
      explain: "Deux logiques opposées : l'AVS redistribue immédiatement ce qu'elle encaisse, la LPP accumule un avoir propre à chaque assuré. C'est la différence structurelle entre le 1er et le 2e pilier." },

    /* --- Notions élémentaires (c9) --- */
    { id: 'm1c9q01', chap: 'c9', type: 'single',
      q: "Qui est le preneur d'assurance ?",
      choices: ["La personne exposée au risque", "Le cocontractant de l'assureur, débiteur de la prime", "Celui qui reçoit la prestation", "L'intermédiaire qui a vendu le contrat"],
      answer: [1],
      explain: "Le preneur signe le contrat, doit la prime et exerce les droits contractuels. Il peut être distinct de l'assuré et de l'ayant droit." },

    { id: 'm1c9q02', chap: 'c9', type: 'single', lvl: 'cas',
      ctx: "Une entreprise conclut une assurance-accidents collective pour ses collaborateurs. Un employé se blesse et perçoit des indemnités journalières.",
      q: "Qui occupe quel rôle ?",
      choices: [
        "L'entreprise est preneur, l'employé est assuré et ayant droit",
        "L'employé est preneur et assuré",
        "L'entreprise est assurée, l'employé est preneur",
        "L'assureur est preneur"
      ],
      answer: [0],
      explain: "C'est l'assurance pour compte d'autrui : l'entreprise contracte et paie, l'employé porte le risque sur sa personne et perçoit la prestation." },

    { id: 'm1c9q03', chap: 'c9', type: 'single',
      q: "En cas de contradiction entre les conditions générales et les conditions spéciales d'un contrat, lesquelles l'emportent ?",
      choices: ["Les conditions générales", "Les conditions spéciales", "Celles qui sont les plus favorables à l'assureur", "Le juge tranche au cas par cas sans règle"],
      answer: [1],
      explain: "Les conditions spéciales traduisent ce que les parties ont voulu pour ce contrat précis : elles priment le texte préformulé." },

    { id: 'm1c9q04', chap: 'c9', type: 'single',
      q: "Quelle est la différence entre la somme d'assurance et la valeur d'assurance ?",
      choices: [
        "Aucune, ce sont des synonymes",
        "La somme est le plafond convenu, la valeur est ce que vaut réellement l'objet",
        "La somme est la prime, la valeur est l'indemnité",
        "La valeur est le plafond, la somme est le dommage"
      ],
      answer: [1],
      explain: "Quand la somme est inférieure à la valeur, il y a sous-assurance et la règle proportionnelle s'applique à chaque sinistre." },

    { id: 'm1c9q05', chap: 'c9', type: 'multi',
      q: "Quelles affirmations sur la police d'assurance sont exactes ?",
      choices: [
        "Elle constate le contrat",
        "Elle constitue un moyen de preuve",
        "Elle est une condition de validité du contrat",
        "Le contrat existe dès l'accord des volontés",
        "Elle est un papier-valeur négociable"
      ],
      answer: [0, 1, 3],
      explain: "Le contrat naît de l'accord des volontés ; la police ne fait que le constater. Ce n'est ni une condition de validité ni un titre négociable." },

    { id: 'm1c9q06', chap: 'c9', type: 'single',
      q: "Que désigne une sous-limite dans un contrat ?",
      choices: [
        "Le montant minimal de la prime",
        "Un plafond particulier applicable à une catégorie de biens ou de risques",
        "La franchise minimale",
        "La valeur de rachat"
      ],
      answer: [1],
      explain: "Objets de valeur, vol à l'extérieur, frais de déblaiement : ces catégories sont plafonnées indépendamment de la somme d'assurance globale." },

    { id: 'm1c9q07', chap: 'c9', type: 'single', lvl: 'cas',
      ctx: "Un client a une somme d'assurance ménage de CHF 150 000.– et une sous-limite de CHF 20 000.– pour les objets de valeur. Ses bijoux, estimés à CHF 45 000.–, sont volés lors d'un cambriolage.",
      q: "Quelle indemnité peut-il espérer pour ces bijoux, avant franchise ?",
      choices: ["CHF 45 000.–", "CHF 20 000.–", "CHF 150 000.–", "Rien"],
      answer: [1],
      explain: "La sous-limite s'applique indépendamment de la somme globale : au-delà de CHF 20 000.–, il aurait fallu une couverture séparée sur liste estimée." },

    { id: 'm1c9q08', chap: 'c9', type: 'multi',
      q: "Quelles distinctions fondamentales structurent le monde de l'assurance ?",
      choices: [
        "Assurance privée / assurance sociale",
        "Assurance obligatoire / facultative",
        "Personnes / choses / patrimoine",
        "Assurance de dommages / de sommes",
        "Assurance rouge / assurance bleue"
      ],
      answer: [0, 1, 2, 3],
      explain: "Ces quatre axes se combinent : une RC véhicule est privée, obligatoire, de patrimoine et de dommages." },

    { id: 'm1c9q09', chap: 'c9', type: 'single',
      q: "La prime est quérable et non portable. Quelle conséquence pratique en découle ?",
      choices: ["Le preneur tombe en demeure sans rappel dès l'échéance", "L'assureur doit réclamer la prime ; à défaut de paiement, il ne peut suspendre la couverture qu'après sommation", "Le preneur doit se rendre au siège de l'assureur pour payer", "La prime doit être payée en une seule fois pour toute la durée du contrat"],
      answer: [1],
      explain: "Quérable signifie que c'est au créancier de venir chercher son dû : l'assureur facture. C'est précisément pour cela que la loi exige une sommation avec délai de 14 jours avant toute suspension de couverture." },

    { id: 'm1c9q10', chap: 'c9', type: 'single',
      q: "Qu'est-ce qu'un avenant ?",
      choices: ["Une clause insolite", "La modification écrite d'un contrat en cours", "Un document publicitaire", "Une police provisoire"],
      answer: [1],
      explain: "Changement d'adresse, d'objet assuré ou de somme : l'avenant constate la modification et fait partie intégrante du contrat." },

    /* --- Les affaires d'assurance (c10) --- */
    { id: 'm1c10q01', chap: 'c10', type: 'single',
      q: "Que signifie l'expression « cycle de production inversé » en assurance ?",
      choices: [
        "Les sinistres sont réglés avant la conclusion du contrat",
        "La prime est encaissée avant que le coût réel de la prestation soit connu",
        "Les placements précèdent la souscription",
        "Le client paie après le sinistre"
      ],
      answer: [1],
      explain: "L'assureur vend une promesse dont il ignore le coût : d'où le recours aux statistiques, la constitution de provisions et l'importance des placements." },

    { id: 'm1c10q02', chap: 'c10', type: 'multi',
      q: "Quelles conséquences découlent du cycle de production inversé ?",
      choices: [
        "Le prix repose sur une estimation statistique",
        "L'assureur détient des fonds importants qu'il doit placer",
        "Il doit provisionner des engagements au montant encore incertain",
        "Il connaît son coût de revient avant de fixer sa prime",
        "Il n'a pas besoin de fonds propres"
      ],
      answer: [0, 1, 2],
      explain: "C'est précisément parce que le coût est inconnu que la solvabilité, les provisions et la surveillance prennent tant d'importance." },

    { id: 'm1c10q03', chap: 'c10', type: 'single',
      q: "De quelles deux sources le résultat d'un assureur provient-il ?",
      choices: [
        "Du résultat technique et du résultat financier",
        "Des primes et du droit de timbre",
        "Des sinistres et des commissions",
        "De la réassurance et de la fortune liée"
      ],
      answer: [0],
      explain: "Le résultat technique mesure l'activité d'assurance elle-même ; le résultat financier provient du placement des provisions et de la fortune." },

    { id: 'm1c10q04', chap: 'c10', type: 'single', lvl: 'cas',
      ctx: "Un assureur publie un combined ratio de 103 % mais annonce tout de même un bénéfice annuel.",
      q: "Comment l'expliquer ?",
      choices: [
        "C'est une erreur comptable",
        "Le résultat des placements a compensé la perte technique",
        "Le droit de timbre lui a été remboursé",
        "La réassurance lui a versé un bénéfice"
      ],
      answer: [1],
      explain: "Au-delà de 100 %, l'activité d'assurance est déficitaire ; les revenus des placements peuvent néanmoins rendre l'exercice bénéficiaire — situation fragile si les taux baissent." },

    { id: 'm1c10q05', chap: 'c10', type: 'multi',
      q: "Quelles étapes composent la chaîne de valeur d'un assureur ?",
      choices: [
        "Conception du produit et tarification",
        "Distribution",
        "Souscription et appréciation du risque",
        "Placements et gestion des sinistres",
        "Fixation du droit de timbre"
      ],
      answer: [0, 1, 2, 3],
      explain: "Le droit de timbre est fixé par la loi fédérale : l'assureur ne fait que le percevoir pour le compte de la Confédération." },

    { id: 'm1c10q06', chap: 'c10', type: 'single',
      q: "Pourquoi les provisions techniques représentent-elles l'essentiel des fonds placés par un assureur ?",
      choices: [
        "Parce qu'elles constituent son bénéfice",
        "Parce qu'elles correspondent aux engagements envers les assurés, encaissés avant d'être payés",
        "Parce que la loi l'impose sans raison économique",
        "Parce qu'elles remplacent le capital-actions"
      ],
      answer: [1],
      explain: "L'écart de temps entre l'encaissement de la prime et le paiement du sinistre crée une masse de fonds à gérer : c'est le cœur du métier financier de l'assureur." }
  ]);

  push(m2, [
    /* --- Conciliation et juridiction (c9) --- */
    { id: 'm2c9q01', chap: 'c9', type: 'single',
      q: "Dans quel ordre un litige d'assurance se règle-t-il en principe ?",
      choices: [
        "Tribunal, puis Ombudsman, puis assureur",
        "Réclamation à l'assureur, Ombudsman, conciliation, tribunal civil",
        "FINMA, puis tribunal",
        "Conciliation, puis FINMA, puis Ombudsman"
      ],
      answer: [1],
      explain: "On épuise d'abord les voies gratuites et rapides ; le procès civil reste l'ultime recours, plus long et plus coûteux." },

    { id: 'm2c9q02', chap: 'c9', type: 'single',
      q: "Quelle est la portée d'une recommandation de l'Ombudsman de l'assurance privée ?",
      choices: [
        "Elle lie l'assureur",
        "Elle n'a pas force obligatoire",
        "Elle vaut jugement exécutoire",
        "Elle suspend la prescription pendant cinq ans"
      ],
      answer: [1],
      explain: "L'Ombudsman est un médiateur : sa force est morale et technique, non juridique. La voie judiciaire reste toujours ouverte." },

    { id: 'm2c9q03', chap: 'c9', type: 'single',
      q: "Devant quel tribunal un preneur consommateur peut-il agir ?",
      choices: [
        "Uniquement au siège de l'assureur",
        "À son domicile en Suisse ou au siège de l'assureur",
        "Uniquement devant le Tribunal fédéral",
        "Uniquement devant la FINMA"
      ],
      answer: [1],
      explain: "Le for du domicile évite au client de devoir plaider loin de chez lui contre une partie économiquement plus forte." },

    { id: 'm2c9q04', chap: 'c9', type: 'single',
      q: "Que se passe-t-il avant un procès civil ordinaire en matière d'assurance ?",
      choices: [
        "Rien, on saisit directement le tribunal",
        "Une tentative de conciliation est en principe obligatoire",
        "La FINMA rend un préavis",
        "L'Ombudsman rend une décision contraignante"
      ],
      answer: [1],
      explain: "En cas d'échec, l'autorité de conciliation délivre l'autorisation de procéder, qui permet de porter l'action devant le tribunal." },

    { id: 'm2c9q05', chap: 'c9', type: 'single',
      q: "Jusqu'à quelle valeur litigieuse la procédure simplifiée s'applique-t-elle ?",
      choices: ["CHF 5 000.–", "CHF 10 000.–", "CHF 30 000.–", "CHF 100 000.–"],
      answer: [2],
      explain: "En dessous de CHF 30 000.–, les formes sont allégées et le juge joue un rôle plus actif dans l'établissement des faits." },

    { id: 'm2c9q06', chap: 'c9', type: 'multi',
      q: "Quelles affirmations sur la FINMA et les litiges sont exactes ?",
      choices: [
        "Elle ne tranche pas les litiges contractuels individuels",
        "Elle surveille la solvabilité et les abus",
        "Un comportement systématiquement abusif peut néanmoins l'intéresser",
        "Elle peut ordonner à un assureur de payer un sinistre déterminé",
        "Elle remplace l'autorité de conciliation"
      ],
      answer: [0, 1, 2],
      explain: "La FINMA agit sur le plan de la surveillance, jamais sur celui de l'exécution d'un contrat déterminé." },

    { id: 'm2c9q07', chap: 'c9', type: 'single', lvl: 'cas',
      ctx: "Un assuré vous appelle, furieux : son assureur refuse de couvrir un dégât d'eau de CHF 12 000.–. Il veut « attaquer immédiatement » et vous demande s'il doit saisir la FINMA.",
      q: "Que lui conseillez-vous ?",
      choices: [
        "Saisir la FINMA, qui tranchera",
        "Adresser une réclamation motivée à l'assureur, puis saisir l'Ombudsman, gratuitement, avant d'envisager la voie judiciaire",
        "Aller directement devant le Tribunal fédéral",
        "Attendre cinq ans que la prescription soit acquise"
      ],
      answer: [1],
      explain: "La FINMA n'est pas une instance de recours contractuelle. La réclamation puis la médiation sont gratuites et résolvent une grande partie des cas." },

    { id: 'm2c9q08', chap: 'c9', type: 'single', lvl: 'cas',
      ctx: "Un litige porte sur une assurance complémentaire à l'assurance-maladie sociale, pour une valeur de CHF 8 000.–.",
      q: "Quelles particularités procédurales peuvent s'appliquer ?",
      choices: [
        "Aucune, c'est une procédure ordinaire",
        "Procédure simplifiée, et dans plusieurs cantons un tribunal statuant en instance cantonale unique, souvent sans frais judiciaires",
        "Compétence exclusive du tribunal des assurances sociales",
        "Compétence de la FINMA"
      ],
      answer: [1],
      explain: "La complémentaire relève du droit privé, donc du juge civil, mais le législateur a allégé la procédure pour ce contentieux sensible." },

    { id: 'm2c9q09', chap: 'c9', type: 'single',
      q: "Le juge peut-il constater d'office qu'une créance d'assurance est prescrite ?",
      choices: [
        "Oui, il doit le faire",
        "Non : la prescription doit être invoquée par le débiteur",
        "Oui, au-delà de dix ans seulement",
        "Non, la prescription n'existe pas en assurance"
      ],
      answer: [1],
      explain: "Si l'assureur omet de soulever l'exception de prescription, il devra payer malgré l'écoulement des cinq ans de l'art. 46 LCA." },

    { id: 'm2c9q10', chap: 'c9', type: 'multi',
      q: "Comment le fardeau de la preuve se répartit-il dans un litige de couverture ?",
      choices: [
        "L'ayant droit prouve la survenance du sinistre",
        "L'ayant droit prouve le montant de son dommage",
        "L'assureur prouve les faits constitutifs d'une exclusion",
        "L'assureur prouve la faute grave qu'il invoque",
        "L'ayant droit prouve l'absence de toute exclusion"
      ],
      answer: [0, 1, 2, 3],
      explain: "Nul n'a à prouver un fait négatif : chacun établit ce qui fonde sa propre position, application de l'art. 8 CC." }
  ]);
})();
