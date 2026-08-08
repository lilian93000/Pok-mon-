/* =============================================================
   AFA – Module 2 : Droit de l'assurance
   Fiches de cours + banque de questions
   ============================================================= */
(function () {
  const M = {
    id: 'm2',
    code: 'Module 2',
    title: "Droit de l'assurance",
    subtitle: "CO, LCA révisée, responsabilité civile, LSA, LPD et LBA",
    parcours: "Lancement · Base",
    icon: '⚖️',
    color: 'violet',
    chapters: [],
    questions: []
  };

  M.chapters = [
    {
      id: 'c1',
      title: 'Bases du droit suisse',
      resume: "Sources du droit, hiérarchie des normes, droit public et droit privé, où se situe le droit des assurances.",
      sections: [
        {
          h: "Sources et hiérarchie des normes",
          html: `<ol>
            <li><b>Constitution fédérale (Cst.)</b> — norme suprême&nbsp;;</li>
            <li><b>Lois fédérales</b> (CC, CO, LCA, LSA, LCR, LPD…) adoptées par le Parlement, sujettes au référendum&nbsp;;</li>
            <li><b>Ordonnances</b> du Conseil fédéral (OS, OSA, OAMal…) qui précisent les lois&nbsp;;</li>
            <li><b>Droit cantonal</b> puis <b>communal</b>, dans les domaines de compétence cantonale.</li>
          </ol>
          <p>Le <b>droit fédéral prime le droit cantonal</b>. À côté de la loi&nbsp;: la <b>coutume</b>, la <b>jurisprudence</b> (Tribunal fédéral) et la <b>doctrine</b>. Selon l'art. 1 CC, le juge qui ne trouve ni loi ni coutume statue <i>«&nbsp;selon les règles qu'il établirait s'il avait à faire acte de législateur&nbsp;»</i>.</p>`
        },
        {
          h: "Droit public / droit privé",
          html: `<table class="tbl">
            <tr><th></th><th>Droit privé</th><th>Droit public</th></tr>
            <tr><td>Rapport</td><td>Entre personnes <b>égales</b></td><td>Rapport de <b>subordination</b> à l'État</td></tr>
            <tr><td>Exemples en assurance</td><td><b>LCA</b>, CO, CC</td><td><b>LSA</b>, LAMal, LAA, LAVS (surveillance et assurances sociales)</td></tr>
            <tr><td>Juge compétent</td><td>Tribunal civil</td><td>Tribunal administratif / des assurances sociales</td></tr>
          </table>
          <p class="tip">Le réflexe d'examen&nbsp;: <b>LCA = contrat = droit privé</b>&nbsp;; <b>LSA = surveillance = droit public</b>. Les assurances sociales (LAMal, LAA, LPP obligatoire) relèvent du droit public&nbsp;; les complémentaires relèvent de la LCA.</p>`
        },
        {
          h: "Personnalité et capacité",
          html: `<ul>
            <li>La <b>personnalité</b> commence à la naissance accomplie de l'enfant vivant et finit par la mort (art. 31 CC). L'enfant conçu est capable de jouissance sous réserve qu'il naisse vivant.</li>
            <li><b>Capacité de jouissance</b>&nbsp;: aptitude à avoir des droits — toute personne l'a.</li>
            <li><b>Capacité d'exercice</b>&nbsp;: aptitude à s'obliger soi-même. Elle suppose la <b>majorité (18&nbsp;ans)</b> et la <b>capacité de discernement</b>.</li>
            <li>Un contrat conclu par une personne <b>incapable de discernement</b> est <b>nul</b>&nbsp;; conclu par un mineur capable de discernement sans le consentement du représentant légal, il est <b>boiteux</b> (validité en suspens jusqu'à ratification).</li>
            <li><b>Personnes morales</b>&nbsp;: SA, Sàrl, coopérative, association, fondation — elles acquièrent la personnalité par l'inscription au registre du commerce (sauf associations et fondations de famille).</li>
          </ul>`
        }
      ],
      keypoints: [
        "Hiérarchie : Constitution > lois > ordonnances > droit cantonal.",
        "LCA = droit privé (contrat) ; LSA = droit public (surveillance).",
        "Capacité d'exercice = majorité + discernement.",
        "Acte d'un incapable de discernement = nul ; acte d'un mineur capable = boiteux.",
        "Les assurances sociales relèvent du droit public, les complémentaires de la LCA."
      ]
    },

    {
      id: 'c2',
      title: 'Le contrat selon le CO',
      resume: "Formation du contrat, forme, vices du consentement, représentation, exécution et prescription générale.",
      sections: [
        {
          h: "La formation du contrat",
          html: `<p>Un contrat se forme par l'échange de manifestations de volonté <b>réciproques et concordantes</b> (art. 1 CO)&nbsp;: une <b>offre</b> et une <b>acceptation</b>.</p>
          <ul>
            <li>Offre <b>avec</b> délai&nbsp;: l'auteur est lié jusqu'à l'expiration du délai.</li>
            <li>Offre <b>sans</b> délai entre absents&nbsp;: liée jusqu'au moment où une réponse expédiée à temps peut être attendue.</li>
            <li>Entre présents&nbsp;: l'offre doit être acceptée <b>sur-le-champ</b>.</li>
            <li>Le <b>silence ne vaut pas acceptation</b>, sauf exceptions (usage, relation d'affaires durable).</li>
          </ul>
          <p><b>Forme</b>&nbsp;: la liberté de la forme est la règle (art. 11 CO). Des exceptions imposent la forme écrite (cession de créance), la forme authentique (vente d'immeuble) ou l'inscription au registre.</p>`
        },
        {
          h: "Les vices du consentement",
          html: `<ul>
            <li><b>Erreur essentielle</b> (art. 23–24 CO)&nbsp;: sur la nature du contrat, la chose, la personne, une prestation notablement plus étendue&nbsp;; l'erreur sur les <b>motifs</b> n'est en principe pas essentielle.</li>
            <li><b>Dol</b> (art. 28 CO)&nbsp;: tromperie intentionnelle.</li>
            <li><b>Crainte fondée</b> (art. 29–30 CO)&nbsp;: menace illicite.</li>
          </ul>
          <p>Le contrat vicié n'est pas nul de plein droit&nbsp;: la victime doit le <b>ratifier ou l'invalider dans un délai d'un an</b> (art. 31 CO) dès la découverte du vice ou la disparition de la crainte.</p>
          <p><b>Nullité absolue</b> (art. 20 CO) en cas d'objet impossible, illicite ou contraire aux mœurs.</p>`
        },
        {
          h: "Représentation et exécution",
          html: `<p><b>Représentation</b> (art. 32 ss CO)&nbsp;: les actes du représentant lient le représenté s'il agit au nom d'autrui et dans les limites de ses pouvoirs. Sans pouvoirs, l'acte ne lie le représenté que s'il le <b>ratifie</b>. Attention à la <b>procuration apparente</b>&nbsp;: celui qui laisse croire à des pouvoirs est lié — question très pratique pour l'agent d'assurance.</p>
          <p><b>Inexécution</b>&nbsp;: demeure (mise en demeure), dommages-intérêts, résolution. <b>Prescription</b> ordinaire&nbsp;: <b>10 ans</b> (art. 127 CO)&nbsp;; <b>5 ans</b> pour les créances périodiques, loyers, salaires, travaux de professionnels (art. 128 CO). En matière d'acte illicite&nbsp;: <b>3 ans</b> dès la connaissance du dommage et de l'auteur, <b>10 ans</b> au maximum dès le fait dommageable (<b>20 ans</b> en cas de lésions corporelles ou de mort).</p>`
        }
      ],
      keypoints: [
        "Contrat = offre + acceptation, volontés réciproques et concordantes.",
        "Le silence ne vaut pas acceptation.",
        "Vices : erreur essentielle, dol, crainte fondée — invalidation dans l'année.",
        "Prescription CO : 10 ans en général, 5 ans pour les créances périodiques.",
        "Acte illicite : 3 ans / 10 ans (20 ans pour lésions corporelles ou décès)."
      ]
    },

    {
      id: 'c3',
      title: 'LCA I – Conclusion du contrat',
      resume: "Devoir d'information, proposition, police, droit de révocation et réticence.",
      sections: [
        {
          h: "Champ d'application de la LCA",
          html: `<p>La <b>Loi fédérale sur le contrat d'assurance (LCA)</b> régit le contrat entre un preneur et une entreprise d'assurance <b>privée</b>. Elle ne s'applique pas aux assurances sociales. Le CO s'applique à titre <b>subsidiaire</b> pour ce que la LCA ne règle pas (art. 100 LCA).</p>
          <p>La LCA révisée est en vigueur depuis le <b>1<sup>er</sup> janvier 2022</b>. Certaines dispositions sont <b>impératives</b> (art. 97&nbsp;: on ne peut pas y déroger du tout) ou <b>semi-impératives</b> (art. 98&nbsp;: on ne peut y déroger qu'en faveur du preneur ou de l'ayant droit).</p>`
        },
        {
          h: "Devoir d'information de l'assureur (art. 3 LCA)",
          html: `<p><b>Avant</b> la conclusion, l'assureur doit renseigner le preneur, de manière compréhensible, notamment sur&nbsp;:</p>
          <ul>
            <li>son identité et son adresse&nbsp;;</li>
            <li>les <b>risques assurés</b> et l'<b>étendue de la couverture</b>&nbsp;;</li>
            <li>les <b>primes</b> et les autres obligations du preneur&nbsp;;</li>
            <li>la <b>durée</b> et la <b>fin</b> du contrat&nbsp;;</li>
            <li>le traitement des <b>données personnelles</b>&nbsp;;</li>
            <li>le <b>droit de révocation</b>.</li>
          </ul>
          <p>Si l'assureur viole ce devoir, le preneur peut résilier le contrat&nbsp;; le droit s'éteint quatre semaines après la connaissance de la violation, et en tout cas deux ans après.</p>`
        },
        {
          h: "Proposition, police et acceptation",
          html: `<ul>
            <li>La <b>proposition</b> émane en règle générale du client&nbsp;: c'est l'offre au sens du CO. Le proposant reste lié <b>14&nbsp;jours</b>, ou <b>4&nbsp;semaines</b> si un examen médical est nécessaire.</li>
            <li>Le contrat est conclu par l'<b>acceptation</b> de l'assureur, en général par l'envoi de la <b>police</b>.</li>
            <li>La <b>police</b> n'est <b>pas une condition de validité</b>&nbsp;: c'est un moyen de preuve du contrat.</li>
            <li>Si la police <b>diverge</b> de ce qui a été convenu, c'est l'accord réel des parties qui prime. La révision de 2022 a <b>abrogé l'ancien art. 12 LCA</b> et sa «&nbsp;<b>fiction d'approbation</b>&nbsp;»&nbsp;: le preneur qui ne réagit pas dans les quatre semaines n'est <b>plus</b> réputé accepter le contenu de la police. Il conserve le droit d'invoquer la divergence au-delà de ce délai.</li>
            <li>Une <b>couverture provisoire</b> peut être accordée avant la décision définitive.</li>
          </ul>`
        },
        {
          h: "Droit de révocation (art. 2a LCA)",
          html: `<p>Le preneur peut <b>révoquer</b> sa proposition ou son acceptation dans un délai de <b>14&nbsp;jours</b>, par écrit ou par tout autre moyen permettant d'en établir la preuve par un texte. Le délai court dès qu'il a proposé ou accepté le contrat&nbsp;; il est respecté si la révocation est <b>remise à la poste</b> le dernier jour.</p>
          <p>La révocation entraîne l'annulation dès l'origine&nbsp;; les prestations déjà versées doivent être restituées. <b>Exceptions</b>&nbsp;: les couvertures provisoires et les contrats d'une durée <b>inférieure à un mois</b> ne peuvent pas être révoqués.</p>`
        },
        {
          h: "La réticence (art. 4 à 6 LCA)",
          html: `<p>Le proposant doit déclarer <b>par écrit</b> tous les <b>faits importants</b> qu'il connaît ou doit connaître. Sont importants les faits <b>sur lesquels l'assureur a posé des questions précises et non équivoques</b> — le questionnaire délimite donc l'obligation de déclarer.</p>
          <p>Si un fait important a été <b>tu ou inexactement communiqué</b>, il y a <b>réticence</b>. L'assureur peut alors <b>résilier le contrat</b> dans les <b>4&nbsp;semaines</b> à compter du moment où il a eu connaissance de la réticence.</p>
          <p>Point crucial depuis la révision&nbsp;: l'assureur n'est libéré de son obligation de prestation, pour les sinistres déjà survenus, que si la réticence a <b>influé sur la survenance ou l'étendue du sinistre</b> — il faut un <b>lien de causalité</b>. Le droit de résilier s'éteint dans tous les cas <b>5&nbsp;ans</b> après la conclusion du contrat.</p>`
        }
      ],
      keypoints: [
        "LCA révisée en vigueur depuis le 1.1.2022 ; le CO s'applique à titre subsidiaire.",
        "Proposition : le client reste lié 14 jours (4 semaines si examen médical).",
        "La police prouve le contrat, elle n'en est pas une condition de validité ; la fiction d'approbation de l'ancien art. 12 LCA a été abrogée en 2022.",
        "Révocation : 14 jours, sauf couverture provisoire et contrats de moins d'un mois.",
        "Réticence : résiliation dans les 4 semaines dès la connaissance ; refus de prestation seulement s'il y a causalité."
      ]
    },

    {
      id: 'c4',
      title: 'LCA II – Vie du contrat',
      resume: "Prime, aggravation du risque, modification, durée et fin du contrat.",
      sections: [
        {
          h: "La prime",
          html: `<ul>
            <li>La prime est en principe payable <b>d'avance</b>, pour la période convenue&nbsp;; elle est <b>quérable</b>, c'est-à-dire que l'assureur doit la réclamer.</li>
            <li><b>Retard de paiement (art. 20 LCA)</b>&nbsp;: l'assureur envoie une <b>sommation</b> impartissant un délai de <b>14&nbsp;jours</b> et rappelant les conséquences de la demeure. Si la prime n'est pas payée à l'échéance de ce délai, la <b>couverture est suspendue</b>.</li>
            <li>La suspension dure jusqu'au paiement intégral. Si l'assureur ne poursuit pas le paiement dans les <b>2&nbsp;mois</b> qui suivent l'expiration du délai de sommation, il est censé s'être <b>départi du contrat</b> (art. 21 LCA).</li>
            <li>Un sinistre survenu <b>pendant la suspension n'est pas couvert</b>, même si la prime est payée après coup.</li>
          </ul>`
        },
        {
          h: "Aggravation du risque (art. 28 ss LCA)",
          html: `<p>Si le preneur, <b>de son fait</b>, aggrave <b>essentiellement</b> le risque en cours de contrat, l'assureur n'est plus lié pour l'avenir. Une aggravation est essentielle lorsqu'elle porte sur un fait sur lequel l'assureur avait interrogé le proposant.</p>
          <p>Le preneur doit annoncer l'aggravation. L'assureur peut alors résilier le contrat ou adapter la prime&nbsp;; le preneur qui refuse l'adaptation peut résilier. En cas de <b>diminution essentielle</b> du risque, le preneur a droit à une <b>réduction de prime</b>.</p>`
        },
        {
          h: "Durée et résiliation",
          html: `<ul>
            <li><b>Résiliation ordinaire (art. 35a LCA)</b>&nbsp;: un contrat conclu pour plus de trois ans peut être résilié pour la fin de la <b>3<sup>e</sup> année</b> ou de chaque année suivante, moyennant un <b>préavis de 3&nbsp;mois</b>. Cette règle est <b>semi-impérative</b>&nbsp;: on ne peut pas la durcir au détriment du preneur.</li>
            <li><b>Résiliation en cas de sinistre (art. 42 LCA)</b>&nbsp;: après un sinistre pour lequel une prestation a été versée, les deux parties peuvent résilier. Le droit de l'assureur de résilier après sinistre est <b>exclu en assurance-maladie complémentaire</b>.</li>
            <li><b>Modification unilatérale du contrat (art. 35b LCA)</b>&nbsp;: si l'assureur se réserve le droit d'adapter le contrat, le preneur peut résilier pour la date d'entrée en vigueur de la modification.</li>
            <li><b>Changement de propriétaire</b> d'une chose assurée&nbsp;: les droits et obligations passent en principe à l'acquéreur, qui peut refuser dans un délai légal&nbsp;; l'assureur peut également résilier.</li>
            <li><b>Faillite de l'assureur</b>&nbsp;: le contrat prend fin&nbsp;; les prétentions sont couvertes par la <b>fortune liée</b>.</li>
            <li><b>Disparition du risque</b>&nbsp;: le contrat s'éteint et la prime est due pro rata temporis.</li>
          </ul>`
        },
        {
          h: "La divisibilité de la prime (art. 24 LCA)",
          html: `<p>Depuis la révision de 2022, le principe d'<b>indivisibilité</b> de la prime est <b>abandonné</b>. La règle est désormais la <b>divisibilité</b>&nbsp;: si le contrat prend fin avant la fin de la période d'assurance, <b>la prime n'est due que jusqu'à la fin du contrat</b>. L'assuré récupère donc la part de prime <b>non utilisée</b>.</p>
          <p>Deux exceptions&nbsp;: la prime de la période en cours reste due <b>en entier</b> à l'assureur lorsque</p>
          <ol>
            <li>le contrat devient <b>caduc par suite de la disparition du risque</b> (l'objet assuré est détruit, l'activité assurée cesse)&nbsp;;</li>
            <li>le preneur <b>résilie à la suite d'un sinistre au cours de l'année qui suit la conclusion</b> du contrat.</li>
          </ol>
          <table class="tbl">
            <tr><th>Situation</th><th>Part de prime non utilisée</th></tr>
            <tr><td>Dommage <b>total</b> du véhicule, indemnisé, puis changement d'assureur</td><td><b>Non remboursée</b> — disparition du risque</td></tr>
            <tr><td>Dommage <b>partiel</b>, résiliation par le preneur, contrat conclu <b>6&nbsp;mois</b> plus tôt</td><td><b>Non remboursée</b> — résiliation dans l'année suivant la conclusion</td></tr>
            <tr><td>Dommage <b>partiel</b>, résiliation par le preneur, contrat conclu <b>3&nbsp;ans</b> plus tôt</td><td><b>Remboursée</b> — le principe de divisibilité s'applique</td></tr>
            <tr><td>Cessation définitive de l'activité assurée en cours d'année</td><td><b>Non remboursée</b> — disparition du risque</td></tr>
          </table>
          <p class="tip">Le piège&nbsp;: on croit spontanément que «&nbsp;contrat terminé plus tôt = prime rendue&nbsp;». C'est vrai <b>sauf</b> disparition du risque et <b>sauf</b> résiliation après sinistre pendant la première année.</p>`
        },
        {
          h: "Changement de propriétaire de la chose assurée (art. 54 LCA)",
          html: `<p>Lorsque l'objet assuré <b>change de propriétaire</b>, les droits et obligations découlant du contrat <b>passent au nouveau propriétaire</b>. Trois délais s'articulent&nbsp;:</p>
          <ul>
            <li>Le <b>nouveau propriétaire</b> peut <b>refuser</b> le transfert, par écrit ou par tout moyen permettant la preuve par un texte, dans les <b>30&nbsp;jours</b> suivant le changement de propriétaire&nbsp;;</li>
            <li>L'<b>entreprise d'assurance</b> peut <b>résilier</b> dans les <b>14&nbsp;jours</b> après avoir eu connaissance de l'identité du nouveau propriétaire&nbsp;; le contrat prend alors fin <b>au plus tôt 30&nbsp;jours</b> après la résiliation&nbsp;;</li>
            <li>Si le changement entraîne une <b>aggravation du risque</b>, les règles sur l'aggravation (art. 28 ss) s'appliquent par analogie.</li>
          </ul>
          <p>Autrement dit&nbsp;: la vente n'éteint pas le contrat. Elle ouvre une fenêtre pendant laquelle l'acquéreur peut refuser et l'assureur peut se retirer.</p>`
        },
        {
          h: "Obligations en cours de contrat",
          html: `<ul>
            <li>Annoncer les <b>aggravations de risque</b>&nbsp;;</li>
            <li>Respecter les <b>obligations de prévention</b> (mesures de sécurité convenues)&nbsp;;</li>
            <li><b>Annoncer le sinistre</b> dès qu'on en a connaissance&nbsp;;</li>
            <li><b>Réduire le dommage</b> et éviter son aggravation&nbsp;;</li>
            <li>Collaborer à l'établissement des faits.</li>
          </ul>
          <p>La violation d'une obligation <b>sans faute</b> du preneur n'entraîne aucune sanction (art. 45 LCA) — de même si la violation n'a eu aucune influence sur le sinistre.</p>`
        }
      ],
      keypoints: [
        "Sommation de prime : délai de 14 jours, puis suspension de la couverture.",
        "Si l'assureur ne poursuit pas dans les 2 mois, il est réputé s'être départi du contrat.",
        "Résiliation ordinaire : fin de la 3e année ou de chaque année suivante, préavis 3 mois.",
        "Après sinistre indemnisé, les deux parties peuvent résilier (sauf assureur en maladie complémentaire).",
        "Pas de sanction si la violation d'une obligation est sans faute ou sans influence sur le sinistre.",
        "Divisibilité de la prime (art. 24) : la prime n'est due que jusqu'à la fin du contrat.",
        "Sauf disparition du risque, ou résiliation après sinistre dans l'année suivant la conclusion : prime entière due.",
        "Changement de propriétaire : l'acquéreur peut refuser dans les 30 jours, l'assureur résilier dans les 14 jours."
      ]
    },

    {
      id: 'c5',
      title: 'LCA III – Sinistre et prestations',
      resume: "Étendue de la couverture, faute grave, prétention frauduleuse, prescription et for.",
      sections: [
        {
          h: "Étendue de la couverture (art. 33 LCA)",
          html: `<p>L'assureur répond de <b>tous les événements</b> qui présentent le caractère du risque contre les conséquences duquel l'assurance a été conclue, <b>à moins que le contrat n'exclue certains événements d'une manière précise et non équivoque</b>.</p>
          <p>Conséquence pratique&nbsp;: les <b>exclusions doivent être claires</b>&nbsp;; toute clause ambiguë s'interprète <b>contre son auteur</b> (règle <i>in dubio contra stipulatorem</i>) et donc en faveur de l'assuré. Les clauses <b>insolites</b> figurant dans les conditions générales, auxquelles le client ne pouvait pas s'attendre, sont écartées.</p>`
        },
        {
          h: "Faute de l'ayant droit",
          html: `<table class="tbl">
            <tr><th>Degré de faute</th><th>Conséquence</th></tr>
            <tr><td><b>Dessein</b> (acte intentionnel)</td><td>Aucune prestation&nbsp;: l'assureur est entièrement libéré</td></tr>
            <tr><td><b>Faute grave</b></td><td>L'assureur <b>peut réduire</b> sa prestation dans la mesure répondant au degré de la faute (art. 14 al. 2 LCA)</td></tr>
            <tr><td><b>Faute légère</b></td><td>Aucune réduction&nbsp;: prestation entière</td></tr>
            <tr><td>Faute d'un <b>tiers</b> ou d'un auxiliaire</td><td>Ne libère pas l'assureur, sous réserve d'une surveillance fautive</td></tr>
          </table>
          <p>Exemples typiques de faute grave&nbsp;: conduite en état d'ébriété qualifiée, excès de vitesse massif, laisser les clés sur le véhicule, porte non verrouillée.</p>`
        },
        {
          h: "Prétention frauduleuse (art. 40 LCA)",
          html: `<p>Si l'ayant droit <b>dissimule ou déclare inexactement</b> des faits qui excluraient ou réduiraient l'obligation de l'assureur, ou s'il cherche à l'induire en erreur pour obtenir une prestation indue, l'assureur <b>n'est pas lié par le contrat</b> envers lui.</p>
          <p>Deux conditions&nbsp;: un élément <b>objectif</b> (déclaration fausse sur un fait pertinent) et un élément <b>subjectif</b> (intention de tromper). La sanction est radicale&nbsp;: perte <b>intégrale</b> du droit aux prestations pour ce sinistre, même pour la partie honnête de la prétention&nbsp;; l'assureur peut de surcroît résilier le contrat.</p>`
        },
        {
          h: "Exigibilité, prescription et for",
          html: `<ul>
            <li>La prestation est <b>exigible 4&nbsp;semaines</b> après le moment où l'assureur a reçu les renseignements lui permettant de se convaincre du bien-fondé de la prétention (art. 41 LCA).</li>
            <li><b>Prescription&nbsp;: 5&nbsp;ans</b> dès le fait d'où naît l'obligation (art. 46 LCA). C'est une des grandes nouveautés de la révision&nbsp;: le délai était de 2&nbsp;ans auparavant.</li>
            <li><b>For</b>&nbsp;: le preneur ou l'ayant droit peut agir au for de son <b>domicile</b> en Suisse, ou au siège de l'assureur (art. 32 CPC pour les contrats conclus avec des consommateurs).</li>
            <li>Avant le procès&nbsp;: réclamation interne, puis <b>Ombudsman</b> (gratuit, recommandation non contraignante).</li>
          </ul>`
        }
      ],
      keypoints: [
        "Les exclusions doivent être précises et non équivoques ; le doute profite à l'assuré.",
        "Dessein = pas de prestation ; faute grave = réduction possible ; faute légère = prestation entière.",
        "Prétention frauduleuse (art. 40) : perte totale du droit pour ce sinistre.",
        "Prestation exigible 4 semaines après réception des justificatifs.",
        "Prescription LCA : 5 ans depuis la révision de 2022."
      ]
    },

    {
      id: 'c6',
      title: 'Sous-assurance, surassurance et subrogation',
      resume: "Les règles chiffrées de l'assurance de dommages, à connaître par cœur.",
      sections: [
        {
          h: "Somme d'assurance et valeur",
          html: `<ul>
            <li><b>Valeur à neuf</b>&nbsp;: coût de remplacement par un objet neuf de même type. Standard en assurance ménage et bâtiment.</li>
            <li><b>Valeur actuelle</b>&nbsp;: valeur à neuf moins la dépréciation due à l'usage et à l'âge.</li>
            <li><b>Valeur vénale</b>&nbsp;: prix qu'on obtiendrait sur le marché (véhicules).</li>
            <li><b>Valeur d'affection</b>&nbsp;: valeur sentimentale — <b>non assurable</b>.</li>
          </ul>`
        },
        {
          h: "La sous-assurance et la règle proportionnelle",
          html: `<p>Il y a <b>sous-assurance</b> lorsque la somme d'assurance est <b>inférieure</b> à la valeur de remplacement de l'ensemble des biens assurés. L'assureur n'indemnise alors que dans la proportion existant entre la somme assurée et la valeur totale (<b>règle proportionnelle</b>, art. 69 LCA)&nbsp;:</p>
          <p class="formula">Indemnité = Dommage × (Somme d'assurance ÷ Valeur d'assurance)</p>
          <p><b>Exemple.</b> Mobilier valant CHF 100&nbsp;000.–, assuré pour CHF 80&nbsp;000.–, dommage de CHF 20&nbsp;000.–&nbsp;:<br>
          20&nbsp;000 × (80&nbsp;000 ÷ 100&nbsp;000) = <b>CHF 16&nbsp;000.–</b>. Le preneur supporte les CHF 4&nbsp;000.– restants.</p>
          <p>Une clause de <b>renonciation à la sous-assurance</b> (assurance au premier risque) écarte cette règle&nbsp;: l'assureur paie jusqu'à concurrence de la somme convenue, sans proportion.</p>`
        },
        {
          h: "Surassurance et double assurance",
          html: `<ul>
            <li><b>Surassurance</b>&nbsp;: la somme d'assurance dépasse la valeur réelle. L'assureur n'indemnise <b>jamais plus que le dommage effectif</b> (principe indemnitaire). Si la surassurance a été convenue dans une <b>intention de fraude</b>, le contrat n'oblige pas l'assureur (art. 51 LCA).</li>
            <li><b>Double assurance</b>&nbsp;: le même intérêt est assuré contre le même risque auprès de <b>plusieurs assureurs</b> et les sommes cumulées dépassent la valeur. Le preneur doit <b>en aviser</b> chaque assureur&nbsp;; à défaut, l'assureur peut être libéré. Les assureurs répondent <b>solidairement</b> envers l'ayant droit, dans les limites de leurs contrats, et se répartissent la charge entre eux au prorata.</li>
          </ul>`
        },
        {
          h: "Subrogation (art. 95c LCA)",
          html: `<p>Dès qu'il indemnise, l'assureur est <b>subrogé</b> aux droits de l'assuré contre le <b>tiers responsable</b>, à concurrence de sa prestation. Cela évite le cumul et fait supporter la charge finale par le responsable.</p>
          <p>Conditions et limites&nbsp;:</p>
          <ul>
            <li>Elle ne joue que dans l'<b>assurance de dommages</b>, jamais dans l'assurance de sommes&nbsp;;</li>
            <li>L'assuré ne doit pas compromettre le recours (il doit conserver ses droits contre le responsable)&nbsp;;</li>
            <li>Pas de recours contre les <b>proches</b> du preneur (ménage commun) sauf faute qualifiée&nbsp;;</li>
            <li>L'assuré est <b>désintéressé en priorité</b>&nbsp;: si le responsable est insolvable, la part récupérée revient d'abord à l'assuré pour son dommage non couvert.</li>
          </ul>`
        }
      ],
      keypoints: [
        "Règle proportionnelle : Indemnité = Dommage × Somme / Valeur.",
        "L'assurance au premier risque écarte la sous-assurance.",
        "Surassurance : on ne touche jamais plus que le dommage ; nullité en cas d'intention frauduleuse.",
        "Double assurance : obligation d'aviser, responsabilité solidaire des assureurs.",
        "Subrogation seulement en assurance de dommages ; pas de recours contre les proches sauf faute grave."
      ]
    },

    {
      id: 'c7',
      title: 'La responsabilité civile',
      resume: "Conditions de la responsabilité, responsabilité pour faute, causales simples et aggravées.",
      sections: [
        {
          h: "Les conditions de la responsabilité",
          html: `<p>Quatre conditions doivent être réunies&nbsp;:</p>
          <ol>
            <li><b>Un dommage</b> — diminution involontaire du patrimoine&nbsp;: perte éprouvée (<i>damnum emergens</i>) et gain manqué (<i>lucrum cessans</i>). Le <b>tort moral</b> (art. 47 et 49 CO) répare l'atteinte à la personnalité, il n'est pas un dommage au sens technique.</li>
            <li><b>Un lien de causalité</b> naturel et <b>adéquat</b> entre le comportement et le dommage.</li>
            <li><b>L'illicéité</b> — violation d'un droit absolu (vie, intégrité, propriété) ou d'une norme protectrice.</li>
            <li><b>Une faute</b> (intention ou négligence) — <b>seulement</b> pour la responsabilité subjective&nbsp;; les responsabilités causales s'en passent.</li>
          </ol>
          <p>Facteurs d'interruption ou de réduction&nbsp;: <b>force majeure</b>, <b>faute grave du lésé</b>, <b>faute grave d'un tiers</b>, consentement du lésé.</p>`
        },
        {
          h: "Responsabilité pour faute (art. 41 CO)",
          html: `<p><i>«&nbsp;Celui qui cause, d'une manière illicite, un dommage à autrui, soit intentionnellement, soit par négligence ou imprudence, est tenu de le réparer.&nbsp;»</i> C'est la clause générale&nbsp;: le <b>lésé doit prouver</b> les quatre conditions, faute comprise.</p>`
        },
        {
          h: "Responsabilités causales",
          html: `<p>Elles n'exigent <b>pas de faute</b>. On distingue&nbsp;:</p>
          <p><b>Causales simples</b> (ou légères) — le responsable peut se libérer en apportant la <b>preuve libératoire</b> qu'il a pris tous les soins commandés&nbsp;:</p>
          <ul>
            <li><b>Art. 55 CO</b> — responsabilité de l'<b>employeur</b> pour ses auxiliaires&nbsp;;</li>
            <li><b>Art. 56 CO</b> — <b>détenteur d'animaux</b>&nbsp;;</li>
            <li><b>Art. 333 CC</b> — <b>chef de famille</b>&nbsp;;</li>
            <li><b>Art. 58 CO</b> — <b>propriétaire d'ouvrage</b> (défaut de construction ou d'entretien) — sans preuve libératoire véritable, la responsabilité est objective quant au défaut.</li>
          </ul>
          <p><b>Causales aggravées</b> (risque créé) — <b>aucune preuve libératoire</b>, seules la force majeure ou la faute grave du lésé ou d'un tiers peuvent libérer&nbsp;:</p>
          <ul>
            <li><b>Art. 58 LCR</b> — <b>détenteur de véhicule à moteur</b>&nbsp;;</li>
            <li><b>LRFP</b> — responsabilité du fait des produits&nbsp;;</li>
            <li>Installations de transport par conduites, chemins de fer, <b>installations nucléaires</b> (responsabilité illimitée et canalisée sur l'exploitant), droit de l'environnement.</li>
          </ul>`
        },
        {
          h: "RC véhicules à moteur",
          html: `<ul>
            <li>Le <b>détenteur</b> répond causalement des dommages causés par l'emploi du véhicule (art. 58 LCR).</li>
            <li>L'assurance RC est <b>obligatoire</b>&nbsp;; elle est attestée par le permis de circulation et les plaques.</li>
            <li>Le lésé dispose d'un <b>droit d'action directe</b> contre l'assureur RC.</li>
            <li>Les <b>exceptions</b> tirées du contrat (prime impayée, faute grave du conducteur) <b>ne sont pas opposables au lésé</b>&nbsp;: l'assureur paie puis exerce un <b>recours</b> contre son assuré.</li>
            <li><b>Fonds national de garantie</b>&nbsp;: véhicules non identifiés ou non assurés. <b>Bureau national d'assurance</b>&nbsp;: véhicules étrangers.</li>
          </ul>`
        }
      ],
      keypoints: [
        "4 conditions : dommage, causalité, illicéité, faute (sauf responsabilité causale).",
        "Art. 41 CO = responsabilité pour faute, le lésé supporte le fardeau de la preuve.",
        "Causale simple (55, 56 CO, 333 CC) : preuve libératoire possible.",
        "Causale aggravée (58 LCR, LRFP, nucléaire) : pas de preuve libératoire.",
        "Le lésé a une action directe contre l'assureur RC ; les exceptions ne lui sont pas opposables."
      ]
    },

    {
      id: 'c8',
      title: 'LSA, LPD et LBA',
      resume: "Droit de la surveillance appliqué aux intermédiaires, protection des données et lutte contre le blanchiment.",
      sections: [
        {
          h: "LSA : les intermédiaires",
          html: `<ul>
            <li><b>Art. 40 LSA</b>&nbsp;: définition des intermédiaires — les <b>non liés</b> agissent pour le compte des preneurs, les <b>liés</b> pour le compte des entreprises d'assurance. <b>Le double statut est interdit.</b></li>
            <li><b>Registre FINMA</b>&nbsp;: obligatoire pour les non liés. Conditions&nbsp;: qualifications professionnelles, formation continue, RC professionnelle, bonne réputation.</li>
            <li><b>Art. 45 LSA</b>&nbsp;: devoir d'information avant la conclusion (identité, statut, entreprises représentées, données, responsabilité, réclamations).</li>
            <li><b>Conflits d'intérêts et rémunération</b>&nbsp;: l'intermédiaire non lié doit informer le client des indemnités qu'il reçoit de tiers&nbsp;; il ne peut les conserver qu'avec l'accord exprès du client.</li>
            <li>Sanctions&nbsp;: radiation du registre, interdiction d'exercer, amendes.</li>
          </ul>`
        },
        {
          h: "Protection des données (nLPD)",
          html: `<p>La nouvelle <b>loi sur la protection des données</b> est en vigueur depuis le <b>1<sup>er</sup> septembre 2023</b>. Elle ne protège que les <b>personnes physiques</b>.</p>
          <p>Principes&nbsp;: <b>licéité</b>, <b>bonne foi</b>, <b>proportionnalité</b>, <b>finalité reconnaissable</b>, <b>exactitude</b>, <b>sécurité</b>, et <b>protection des données dès la conception</b> (privacy by design / by default).</p>
          <ul>
            <li>Les <b>données sensibles</b> (santé, religion, opinions politiques, données biométriques, poursuites pénales) exigent un <b>consentement exprès</b> — en assurance, les données de santé sont omniprésentes.</li>
            <li><b>Devoir d'informer</b> lors de la collecte&nbsp;; <b>droit d'accès</b>, de rectification et d'effacement de la personne concernée.</li>
            <li><b>Registre des activités de traitement</b> et <b>analyse d'impact</b> pour les traitements à risque élevé.</li>
            <li>Les <b>violations de la sécurité des données</b> doivent être annoncées <b>dans les meilleurs délais</b> au <b>PFPDT</b>.</li>
            <li>Les sanctions pénales frappent les <b>personnes physiques responsables</b>, jusqu'à CHF 250&nbsp;000.– d'amende.</li>
          </ul>`
        },
        {
          h: "LBA : blanchiment d'argent",
          html: `<p>Les assureurs qui exploitent l'<b>assurance-vie directe</b> ou proposent des parts de placements collectifs sont des <b>intermédiaires financiers</b> soumis à la LBA (l'assurance dommages ne l'est pas).</p>
          <p>Obligations de diligence&nbsp;:</p>
          <ul>
            <li><b>Vérification de l'identité du cocontractant</b> et identification de l'<b>ayant droit économique</b>&nbsp;;</li>
            <li><b>Clarifications particulières</b> en cas de transaction inhabituelle ou de risque accru (PEP)&nbsp;;</li>
            <li><b>Documentation</b> et conservation des pièces pendant <b>10&nbsp;ans</b>&nbsp;;</li>
            <li><b>Communication</b> au <b>MROS</b> (Bureau de communication en matière de blanchiment d'argent) en cas de soupçon fondé, avec <b>blocage</b> des avoirs et interdiction d'informer le client (<i>tipping off</i>).</li>
          </ul>
          <p>La branche s'organise via un <b>organisme d'autorégulation (OAR-ASA)</b> ou sous surveillance directe de la FINMA.</p>`
        },
        {
          h: "LSFin et assurances",
          html: `<p>La <b>LSFin</b> ne s'applique en principe pas aux contrats d'assurance, à l'exception des <b>assurances-vie qualifiées</b> (assurances-vie susceptibles de rachat liées à des parts, à capitalisation ou à des instruments financiers), qui sont traitées comme des instruments financiers&nbsp;: règles de conduite, vérification du caractère approprié et adéquat, feuille d'information de base.</p>`
        }
      ],
      keypoints: [
        "Non lié = pour le client et inscrit au registre ; lié = pour l'assureur ; double statut interdit.",
        "L'intermédiaire non lié doit rendre transparentes les rémunérations reçues de tiers.",
        "nLPD depuis le 1.9.2023 : ne protège que les personnes physiques ; données de santé = sensibles.",
        "Violation de sécurité des données : annonce au PFPDT dans les meilleurs délais.",
        "LBA : l'assurance-vie est soumise, pas l'assurance dommages ; soupçon → communication au MROS."
      ]
    }
  ];

  M.questions = [
    /* --- c1 --- */
    { id: 'm2c1q1', chap: 'c1', type: 'single',
      q: "La LCA relève de quel domaine du droit ?",
      choices: ["Du droit public", "Du droit privé", "Du droit pénal", "Du droit administratif"],
      answer: [1],
      explain: "La LCA régit le contrat entre deux parties juridiquement égales : c'est du droit privé. La LSA, qui organise la surveillance par l'État, relève du droit public." },

    { id: 'm2c1q2', chap: 'c1', type: 'single',
      q: "Quelle norme prime en cas de conflit ?",
      choices: ["Le droit cantonal prime le droit fédéral", "Le droit fédéral prime le droit cantonal", "Les ordonnances priment les lois", "La doctrine prime la jurisprudence"],
      answer: [1],
      explain: "La force dérogatoire du droit fédéral est un principe constitutionnel. La hiérarchie est : Constitution, lois, ordonnances, droit cantonal, droit communal." },

    { id: 'm2c1q3', chap: 'c1', type: 'single', pts: 1, cx: 'Simple',
      theme: "Droit, CC, exercice des droits civils",
      q: "Quelles conditions l'exercice des droits civils suppose-t-il ?",
      choices: [
        "La majorité seule",
        "La capacité de discernement seule",
        "La majorité et la capacité de discernement",
        "L'inscription au registre du commerce",
      ],
      answer: [2],
      explain: "Les deux conditions sont cumulatives (art. 13 CC) : un majeur privé de discernement ne peut pas s'obliger, un mineur capable de discernement non plus, sauf exceptions légales. C'est ce qui permet de contracter valablement." },

    { id: 'm2c1q4', chap: 'c1', type: 'single', pts: 1, cx: 'Simple',
      theme: "Droit, CC, incapacité de discernement",
      q: "Quelle est la valeur d'un contrat conclu par une personne totalement incapable de discernement ?",
      choices: [
        "Il est pleinement valable",
        "Il est nul",
        "Il est boiteux, en suspens jusqu'à ratification",
        "Il est annulable dans un délai d'un an",
      ],
      answer: [1],
      explain: "Sans discernement, il n'y a pas de volonté juridiquement reconnue : l'acte ne produit aucun effet et aucune ratification ne peut le sauver. Le contrat boiteux vise, lui, le mineur capable de discernement." },

    { id: 'm2c1q5', chap: 'c1', type: 'multi',
      q: "Lesquelles de ces lois relèvent du droit public ?",
      choices: ["LSA", "LAMal", "LCA", "LAA", "CO"],
      answer: [0, 1, 3],
      explain: "La LSA (surveillance) et les assurances sociales (LAMal, LAA) sont du droit public. La LCA et le CO régissent des rapports entre personnes égales : droit privé." },

    /* --- c2 --- */
    { id: 'm2c2q1', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: "Droit, CO, formation du contrat",
      q: "Comment un contrat se forme-t-il selon l'art. 1 CO ?",
      choices: [
        "Par la signature d'un document écrit par les deux parties",
        "Par l'échange de manifestations de volonté réciproques et concordantes",
        "Par le versement d'un premier acompte ou d'une prime",
        "Par l'inscription de l'accord dans un registre public",
      ],
      answer: [1],
      explain: "L'accord des volontés suffit : la forme est libre, sauf exigence légale ou conventionnelle. L'écrit sert alors de moyen de preuve, non de condition de validité." },

    { id: 'm2c2q2', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: "Droit, CO, silence",
      q: "Quelle portée le silence de celui qui reçoit une offre a-t-il ?",
      choices: [
        "Il vaut acceptation dans tous les cas",
        "Il ne vaut en principe pas acceptation",
        "Il vaut refus définitif et irrévocable",
        "Il prolonge automatiquement le délai de réflexion",
      ],
      answer: [1],
      explain: "Qui ne dit mot ne consent pas, en droit suisse : nul ne peut être lié par son inaction. Les usages ou une relation d'affaires durable peuvent toutefois faire exception." },

    { id: 'm2c2q3', chap: 'c2', type: 'multi',
      q: "Quels sont les vices du consentement ?",
      choices: ["L'erreur essentielle", "Le dol", "La crainte fondée", "La lésion d'intérêt économique", "Le retard de paiement"],
      answer: [0, 1, 2],
      explain: "Les trois vices du consentement du CO sont l'erreur essentielle, le dol (tromperie) et la crainte fondée (menace). La victime doit invalider le contrat dans l'année." },

    { id: 'm2c2q4', chap: 'c2', type: 'single',
      q: "Dans quel délai la victime d'un vice du consentement doit-elle invalider le contrat ?",
      choices: ["14 jours", "4 semaines", "1 an", "5 ans"],
      answer: [2],
      explain: "Un an dès la découverte de l'erreur ou du dol, ou dès la disparition de la crainte (art. 31 CO). Passé ce délai, le contrat est réputé ratifié." },

    { id: 'm2c2q5', chap: 'c2', type: 'single',
      q: "Quel est le délai de prescription ordinaire du CO ?",
      choices: ["2 ans", "5 ans", "10 ans", "20 ans"],
      answer: [2],
      explain: "10 ans (art. 127 CO), sauf disposition spéciale. Les créances périodiques (loyers, salaires) se prescrivent par 5 ans (art. 128 CO)." },

    { id: 'm2c2q6', chap: 'c2', type: 'single',
      q: "Un agent conclut un contrat en dépassant ses pouvoirs. Quelle est la conséquence ?",
      choices: ["Le contrat est automatiquement valable", "Le représenté n'est lié que s'il ratifie l'acte", "Le contrat est nul de plein droit", "L'agent devient partie au contrat d'assurance"],
      answer: [1],
      explain: "Sans pouvoirs, l'acte ne lie le représenté que par ratification. Attention toutefois à la procuration apparente : celui qui laisse croire que son agent a des pouvoirs se trouve engagé." },

    /* --- c3 --- */
    { id: 'm2c3q1', chap: 'c3', type: 'single',
      q: "Depuis quand la LCA révisée est-elle en vigueur ?",
      choices: ["1er janvier 2020", "1er janvier 2022", "1er septembre 2023", "1er janvier 2024"],
      answer: [1],
      explain: "La LCA révisée est entrée en vigueur le 1.1.2022 (droit de révocation de 14 jours, prescription portée à 5 ans, résiliation ordinaire, etc.). La LSA révisée, elle, date du 1.1.2024." },

    { id: 'm2c3q2', chap: 'c3', type: 'single',
      q: "Quel est le délai du droit de révocation de l'art. 2a LCA ?",
      choices: ["7 jours", "14 jours", "4 semaines", "3 mois"],
      answer: [1],
      explain: "14 jours dès la proposition ou l'acceptation, par écrit ou tout moyen permettant la preuve par texte. Le délai est respecté si la révocation est remise à la poste le dernier jour." },

    { id: 'm2c3q3', chap: 'c3', type: 'multi',
      q: "Quels contrats ne peuvent PAS être révoqués ?",
      choices: ["Les couvertures provisoires", "Les contrats d'une durée inférieure à un mois", "Les assurances-vie", "Les assurances ménage", "Les assurances RC privée"],
      answer: [0, 1],
      explain: "Le droit de révocation est exclu pour les couvertures provisoires et les contrats de moins d'un mois. Il vaut pour tous les autres, y compris l'assurance-vie." },

    { id: 'm2c3q4', chap: 'c3', type: 'single',
      q: "Combien de temps le proposant reste-t-il lié par sa proposition lorsqu'un examen médical est nécessaire ?",
      choices: ["14 jours", "4 semaines", "2 mois", "3 mois"],
      answer: [1],
      explain: "14 jours en règle générale, mais 4 semaines si le contrat exige un examen médical, car l'assureur a besoin de plus de temps pour évaluer le risque." },

    { id: 'm2c3q5', chap: 'c3', type: 'single',
      q: "Quelle est la fonction juridique de la police d'assurance ?",
      choices: ["Elle est une condition de validité du contrat", "Elle constitue un moyen de preuve du contrat", "Elle remplace les conditions générales", "Elle a valeur de papier-valeur négociable"],
      answer: [1],
      explain: "Le contrat est valable dès l'accord des volontés ; la police ne fait que le constater. Si elle diverge de ce qui a été convenu, c'est l'accord réel qui prime : depuis 2022, le silence du preneur ne vaut plus acceptation de la police." },

    { id: 'm2c3q6', chap: 'c3', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, déclaration du proposant",
      q: "Quels faits le proposant doit-il déclarer lors de la conclusion du contrat ?",
      choices: [
        "Tous les faits imaginables touchant à sa vie privée",
        "Les faits importants sur lesquels l'assureur a posé des questions précises",
        "Uniquement ceux qu'il estime lui-même pertinents",
        "Aucun : il appartient à l'assureur de se renseigner seul",
      ],
      answer: [1],
      explain: "L'art. 4 LCA impose un questionnaire écrit, précis et non équivoque : la déclaration se limite à ce qui a été demandé. Un fait important non couvert par une question ne peut pas fonder une réticence." },

    { id: 'm2c3q7', chap: 'c3', type: 'single', pts: 1, cx: 'Simple',
      theme: "Droit, LCA, délai de résiliation pour réticence",
      q: "Dans quel délai l'assureur doit-il résilier le contrat en cas de réticence ?",
      choices: [
        "Dans les 14 jours dès la conclusion du contrat",
        "Dans les 4 semaines dès qu'il a connaissance de la réticence",
        "Dans les 6 mois dès la survenance du sinistre",
        "Dans les 5 ans dès la conclusion du contrat",
      ],
      answer: [1],
      explain: "Art. 6 LCA : le délai de quatre semaines court dès la connaissance effective du fait tu, non depuis la conclusion. Le délai de cinq ans est, lui, la limite absolue au-delà de laquelle la réticence ne peut plus être invoquée." },

    { id: 'm2c3q8', chap: 'c3', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "Droit, LCA, réticence et causalité",
      q: "À quelle condition l'assureur peut-il refuser sa prestation pour un sinistre déjà survenu en cas de réticence ?",
      choices: [
        "Sans condition, la seule réticence suffisant à le libérer",
        "Seulement si le fait tu a influé sur la survenance ou l'étendue du sinistre",
        "Seulement si le sinistre dépasse CHF 10 000.–",
        "Seulement s'il s'agit d'une assurance sur la vie",
      ],
      answer: [1],
      explain: "Il faut un lien de causalité entre le fait dissimulé et le sinistre. Un preneur qui a tu un antécédent cardiaque reste couvert pour un dégât d'eau : la réticence permet de résilier, pas de tout refuser." },

    { id: 'm2c3q9', chap: 'c3', type: 'multi',
      q: "Sur quoi porte le devoir d'information de l'assureur avant la conclusion (art. 3 LCA) ?",
      choices: ["Les risques assurés et l'étendue de la couverture", "Les primes et autres obligations du preneur", "Les résultats financiers de l'assureur", "La durée et la fin du contrat", "Le traitement des données personnelles"],
      answer: [0, 1, 3, 4],
      explain: "Le devoir d'information ne porte pas sur les comptes de l'assureur, mais sur tout ce qui permet au client de comprendre ce qu'il achète, y compris le droit de révocation." },

    /* --- c4 --- */
    { id: 'm2c4q1', chap: 'c4', type: 'single',
      q: "Quel délai la sommation de payer la prime doit-elle impartir ?",
      choices: ["7 jours", "14 jours", "30 jours", "4 semaines"],
      answer: [1],
      explain: "L'assureur somme le preneur de payer dans les 14 jours en l'avertissant des conséquences ; à l'expiration de ce délai sans paiement, la couverture est suspendue (art. 20 LCA)." },

    { id: 'm2c4q2', chap: 'c4', type: 'single',
      q: "Un sinistre survient pendant la suspension de couverture pour non-paiement. Que se passe-t-il ?",
      choices: ["Il est couvert si la prime est payée après coup", "Il n'est pas couvert", "Il est couvert à 50 %", "Il est couvert par le Fonds national de garantie"],
      answer: [1],
      explain: "La suspension est réelle : aucun sinistre survenu pendant cette période n'est indemnisé, même si la prime est réglée ultérieurement. La couverture ne reprend que dès le paiement intégral." },

    { id: 'm2c4q3', chap: 'c4', type: 'single',
      q: "Si l'assureur ne poursuit pas le paiement dans les deux mois suivant l'expiration du délai de sommation :",
      choices: ["Le contrat continue normalement", "Il est censé s'être départi du contrat", "La couverture est rétablie automatiquement", "Il doit rembourser toutes les primes encaissées"],
      answer: [1],
      explain: "Art. 21 LCA : passé ce délai de deux mois sans poursuite, l'assureur est réputé s'être départi du contrat et renonce au paiement de la prime arriérée." },

    { id: 'm2c4q4', chap: 'c4', type: 'single',
      q: "Un contrat conclu pour dix ans peut être résilié par le preneur :",
      choices: ["Jamais avant l'échéance", "Pour la fin de la 3e année ou de chaque année suivante, avec un préavis de 3 mois", "En tout temps avec un préavis d'un mois", "Uniquement après un sinistre"],
      answer: [1],
      explain: "L'art. 35a LCA interdit d'enchaîner durablement le client : au-delà de trois ans, il peut sortir chaque année moyennant trois mois de préavis. La règle est semi-impérative." },

    { id: 'm2c4q5', chap: 'c4', type: 'single',
      q: "Après un sinistre pour lequel une prestation a été versée, qui peut résilier le contrat ?",
      choices: ["Uniquement le preneur", "Uniquement l'assureur", "Les deux parties, l'assureur ne pouvant toutefois pas le faire en assurance-maladie complémentaire", "Personne"],
      answer: [2],
      explain: "Le droit de résiliation après sinistre appartient aux deux parties ; la révision a supprimé ce droit pour l'assureur en assurance-maladie complémentaire, afin de protéger les assurés malades." },

    { id: 'm2c4q6', chap: 'c4', type: 'multi',
      q: "Quelles sont des obligations du preneur en cours de contrat ?",
      choices: ["Annoncer les aggravations essentielles du risque", "Annoncer le sinistre dès qu'il en a connaissance", "Réduire le dommage", "Verser une caution à l'assureur", "Respecter les mesures de prévention convenues"],
      answer: [0, 1, 2, 4],
      explain: "Aucune caution n'est due. Les obligations portent sur l'annonce, la prévention et la limitation du dommage ; leur violation sans faute ne peut pas être sanctionnée (art. 45 LCA)." },

    { id: 'm2c4q7', chap: 'c4', type: 'single',
      q: "Le preneur constate une diminution essentielle du risque. Que peut-il exiger ?",
      choices: ["La résiliation immédiate avec dommages-intérêts", "Une réduction de la prime", "Le remboursement de toutes les primes payées", "Rien du tout"],
      answer: [1],
      explain: "La symétrie de l'art. 28 LCA : l'aggravation permet à l'assureur d'adapter le contrat, la diminution donne au preneur droit à une réduction de prime pour l'avenir." },

    /* --- c5 --- */
    { id: 'm2c5q1', chap: 'c5', type: 'single',
      q: "Comment interprète-t-on une clause d'exclusion ambiguë dans les conditions générales ?",
      choices: ["En faveur de l'assureur", "En faveur de l'assuré, contre l'auteur de la clause", "Elle est annulée par la FINMA", "Le juge tire au sort"],
      answer: [1],
      explain: "Règle « in dubio contra stipulatorem » : l'ambiguïté se retourne contre celui qui a rédigé le texte. L'art. 33 LCA exige d'ailleurs des exclusions précises et non équivoques." },

    { id: 'm2c5q2', chap: 'c5', type: 'single',
      q: "L'assuré provoque le sinistre intentionnellement. Quelle est la conséquence ?",
      choices: ["L'assureur réduit sa prestation de moitié", "L'assureur n'est tenu à aucune prestation", "L'assureur paie puis exerce un recours", "L'assureur paie normalement"],
      answer: [1],
      explain: "Le dessein exclut totalement la prestation : l'aléa, condition de l'assurance, disparaît. En cas de faute grave, l'assureur peut seulement réduire dans la mesure du degré de la faute." },

    { id: 'm2c5q3', chap: 'c5', type: 'single',
      q: "En cas de faute grave de l'ayant droit, l'assureur peut :",
      choices: ["Refuser toute prestation", "Réduire sa prestation dans la mesure répondant au degré de la faute", "Résilier le contrat sans autre conséquence", "Doubler la prime rétroactivement"],
      answer: [1],
      explain: "Art. 14 al. 2 LCA : la réduction doit être proportionnée au degré de la faute. Beaucoup d'assureurs renoncent contractuellement à cette réduction (clause de renonciation au recours pour faute grave)." },

    { id: 'm2c5q4', chap: 'c5', type: 'single',
      q: "Un assuré gonfle volontairement la liste des objets volés. Quelle est la sanction ?",
      choices: ["Il est indemnisé pour les objets réellement volés", "Il perd tout droit aux prestations pour ce sinistre", "Sa prime est augmentée", "Il reçoit un avertissement"],
      answer: [1],
      explain: "Prétention frauduleuse (art. 40 LCA) : la sanction est intégrale, y compris pour la part honnête de la prétention, et l'assureur peut en outre résilier le contrat." },

    { id: 'm2c5q5', chap: 'c5', type: 'single',
      q: "Quel est le délai de prescription des créances découlant du contrat d'assurance ?",
      choices: ["2 ans", "5 ans", "10 ans", "1 an"],
      answer: [1],
      explain: "5 ans dès le fait d'où naît l'obligation (art. 46 LCA). Le délai était de 2 ans avant la révision de 2022 : c'est un piège classique d'examen." },

    { id: 'm2c5q6', chap: 'c5', type: 'single',
      q: "Quand la prestation de l'assureur devient-elle exigible ?",
      choices: ["Immédiatement après le sinistre", "4 semaines après réception des renseignements permettant de vérifier le bien-fondé de la prétention", "3 mois après la déclaration de sinistre", "Après décision de l'Ombudsman"],
      answer: [1],
      explain: "Art. 41 LCA. Ce délai laisse à l'assureur le temps d'instruire le dossier ; passé ce terme, il tombe en demeure et des intérêts moratoires peuvent courir." },

    { id: 'm2c5q7', chap: 'c5', type: 'single',
      q: "Devant quel tribunal le preneur consommateur peut-il agir contre son assureur ?",
      choices: ["Uniquement au siège de l'assureur", "Au for de son domicile ou au siège de l'assureur", "Uniquement à Berne", "Uniquement devant la FINMA"],
      answer: [1],
      explain: "Le for du domicile protège le consommateur. La FINMA n'est pas une instance de recours pour les litiges contractuels ; l'Ombudsman n'émet que des recommandations." },

    /* --- c6 --- */
    { id: 'm2c6q1', chap: 'c6', type: 'single',
      q: "Mobilier d'une valeur de CHF 200 000.–, assuré pour CHF 150 000.–. Dommage : CHF 40 000.–. Quelle indemnité ?",
      choices: ["CHF 40 000.–", "CHF 30 000.–", "CHF 20 000.–", "CHF 150 000.–"],
      answer: [1],
      explain: "Règle proportionnelle : 40 000 × (150 000 ÷ 200 000) = CHF 30 000.–. Le preneur supporte lui-même la différence de CHF 10 000.– parce qu'il est sous-assuré." },

    { id: 'm2c6q2', chap: 'c6', type: 'single',
      q: "Que permet une clause de renonciation à la sous-assurance (premier risque) ?",
      choices: ["D'augmenter la somme d'assurance chaque année", "D'être indemnisé jusqu'à la somme convenue sans application de la règle proportionnelle", "De supprimer la franchise", "D'assurer la valeur d'affection"],
      answer: [1],
      explain: "L'assurance au premier risque indemnise intégralement le dommage jusqu'au plafond convenu, sans comparer somme assurée et valeur totale. Très fréquente pour les objets de valeur." },

    { id: 'm2c6q3', chap: 'c6', type: 'single',
      q: "Un objet valant CHF 5 000.– est assuré pour CHF 8 000.–. Il est totalement détruit. L'assureur verse :",
      choices: ["CHF 8 000.–", "CHF 5 000.–", "CHF 6 500.–", "Rien, le contrat est nul"],
      answer: [1],
      explain: "Principe indemnitaire : on ne s'enrichit pas par l'assurance. En cas de surassurance, seul le dommage effectif est indemnisé. Le contrat n'est nul que si la surassurance visait à frauder." },

    { id: 'm2c6q4', chap: 'c6', type: 'multi',
      q: "Que doit faire le preneur en cas de double assurance ?",
      choices: ["En aviser chaque assureur", "Choisir un seul assureur pour l'indemnisation totale", "Ne rien dire pour être indemnisé deux fois", "Il peut s'adresser à l'un des assureurs, qui répondent solidairement"],
      answer: [0, 3],
      explain: "L'avis est obligatoire ; à défaut, l'assureur peut être libéré. Les assureurs répondent solidairement envers l'ayant droit et se répartissent ensuite la charge entre eux — sans jamais dépasser le dommage." },

    { id: 'm2c6q5', chap: 'c6', type: 'single',
      q: "Dans quel type d'assurance la subrogation s'applique-t-elle ?",
      choices: ["Dans l'assurance de sommes", "Dans l'assurance de dommages", "Dans les deux", "Dans aucune des deux"],
      answer: [1],
      explain: "La subrogation découle du principe indemnitaire, qui n'existe qu'en assurance de dommages. L'assurance de sommes se cumule avec les prétentions contre le responsable." },

    { id: 'm2c6q6', chap: 'c6', type: 'single',
      q: "L'assureur peut-il exercer un recours contre le conjoint de l'assuré vivant en ménage commun ?",
      choices: ["Oui, toujours", "Non, sauf faute grave / qualifiée", "Oui, mais seulement pour la moitié", "Non, jamais en aucun cas"],
      answer: [1],
      explain: "Le recours contre les proches faisant ménage commun est exclu, sauf s'ils ont causé le dommage intentionnellement ou par faute grave — sinon le recours frapperait indirectement l'assuré lui-même." },

    { id: 'm2c6q7', chap: 'c6', type: 'single',
      q: "La valeur d'affection d'un objet est :",
      choices: ["Assurable au premier risque", "Non assurable", "Toujours incluse dans la valeur à neuf", "Remboursée en cas de vol uniquement"],
      answer: [1],
      explain: "La valeur sentimentale n'est pas mesurable objectivement et ne correspond à aucun dommage patrimonial : elle n'est pas assurable." },

    /* --- c7 --- */
    { id: 'm2c7q1', chap: 'c7', type: 'multi',
      q: "Quelles sont les conditions de la responsabilité pour faute (art. 41 CO) ?",
      choices: ["Un dommage", "Un lien de causalité", "L'illicéité", "Une faute", "Un contrat entre les parties"],
      answer: [0, 1, 2, 3],
      explain: "Aucun contrat n'est nécessaire : la responsabilité délictuelle naît de l'acte illicite lui-même. Les quatre conditions doivent être prouvées par le lésé." },

    { id: 'm2c7q2', chap: 'c7', type: 'single',
      q: "Quelle condition n'est PAS requise dans une responsabilité causale ?",
      choices: ["Le dommage", "La causalité", "L'illicéité", "La faute"],
      answer: [3],
      explain: "C'est la définition même de la responsabilité causale (objective) : elle est engagée indépendamment de toute faute, en raison du risque créé ou de la situation occupée." },

    { id: 'm2c7q3', chap: 'c7', type: 'multi',
      q: "Lesquelles sont des responsabilités causales simples (avec preuve libératoire) ?",
      choices: ["Art. 55 CO – employeur", "Art. 56 CO – détenteur d'animaux", "Art. 333 CC – chef de famille", "Art. 58 LCR – détenteur de véhicule", "LRFP – fait des produits"],
      answer: [0, 1, 2],
      explain: "Le détenteur de véhicule (58 LCR) et le producteur (LRFP) relèvent des causales aggravées : aucune preuve libératoire ne les exonère, seules la force majeure ou une faute grave du lésé ou d'un tiers." },

    { id: 'm2c7q4', chap: 'c7', type: 'single',
      q: "Qui répond causalement des dommages causés par l'emploi d'un véhicule à moteur ?",
      choices: ["Le conducteur", "Le détenteur", "Le propriétaire du garage", "L'assureur uniquement"],
      answer: [1],
      explain: "L'art. 58 LCR met la responsabilité causale aggravée à la charge du détenteur, c'est-à-dire celui qui a le pouvoir de disposition effectif du véhicule et l'utilise à ses frais." },

    { id: 'm2c7q5', chap: 'c7', type: 'single',
      q: "L'assureur RC véhicule peut-il opposer au lésé la faute grave de son assuré ?",
      choices: ["Oui, il réduit d'autant l'indemnité au lésé", "Non, il indemnise le lésé puis exerce un recours contre son assuré", "Oui, si la faute est intentionnelle", "Non, et il ne dispose d'aucun recours"],
      answer: [1],
      explain: "Les exceptions tirées du contrat ne sont pas opposables au lésé, qui dispose d'une action directe. L'assureur paie intégralement, puis se retourne contre son assuré fautif." },

    { id: 'm2c7q6', chap: 'c7', type: 'single',
      q: "Un véhicule non identifié cause un dommage. Quel organisme intervient ?",
      choices: ["Le Bureau national d'assurance", "Le Fonds national de garantie", "La FINMA", "L'Ombudsman"],
      answer: [1],
      explain: "Le Fonds national de garantie couvre les dommages causés par des véhicules non identifiés ou non assurés ; le Bureau national d'assurance s'occupe des véhicules immatriculés à l'étranger." },

    { id: 'm2c7q7', chap: 'c7', type: 'single',
      q: "Quel est le délai de prescription en matière d'acte illicite ?",
      choices: ["1 an dès le dommage", "3 ans dès la connaissance du dommage et de l'auteur, 10 ans au maximum", "5 ans dans tous les cas", "10 ans dès la connaissance"],
      answer: [1],
      explain: "Délai relatif de 3 ans et délai absolu de 10 ans (art. 60 CO), porté à 20 ans en cas de lésions corporelles ou de mort depuis la révision du droit de la prescription." },

    { id: 'm2c7q8', chap: 'c7', type: 'single',
      q: "Le tort moral (art. 47 / 49 CO) répare :",
      choices: ["Le gain manqué", "Les frais médicaux", "L'atteinte à la personnalité, la souffrance subie", "Les dommages matériels"],
      answer: [2],
      explain: "Le tort moral est une réparation de la souffrance, distincte du dommage patrimonial (perte éprouvée et gain manqué). Il suppose une atteinte d'une certaine gravité." },

    /* --- c8 --- */
    { id: 'm2c8q1', chap: 'c8', type: 'single',
      q: "Qu'est-ce qu'un intermédiaire non lié au sens de l'art. 40 LSA ?",
      choices: ["Un intermédiaire sans contrat de travail", "Un intermédiaire qui agit pour le compte du preneur d'assurance", "Un intermédiaire salarié d'une compagnie", "Un intermédiaire non rémunéré"],
      answer: [1],
      explain: "Le critère est celui de l'intérêt représenté : le non lié agit pour le client (courtier), le lié pour l'entreprise d'assurance (agent). Le cumul des deux est interdit." },

    { id: 'm2c8q2', chap: 'c8', type: 'single',
      q: "Que doit faire un intermédiaire non lié qui touche des indemnités de tiers ?",
      choices: ["Rien, c'est sa rémunération", "En informer le client ; il ne peut les conserver qu'avec son accord exprès", "Les reverser à la FINMA", "Les déclarer à l'ASA"],
      answer: [1],
      explain: "La transparence sur la rémunération et la gestion des conflits d'intérêts sont au cœur de la LSA révisée : le client mandant doit savoir qui rémunère son courtier et à quelle hauteur." },

    { id: 'm2c8q3', chap: 'c8', type: 'single',
      q: "Depuis quand la nouvelle loi sur la protection des données (nLPD) est-elle en vigueur ?",
      choices: ["1er janvier 2022", "1er septembre 2023", "1er janvier 2024", "1er juin 2021"],
      answer: [1],
      explain: "Le 1er septembre 2023. Elle ne protège plus que les personnes physiques et introduit privacy by design, registre des traitements et annonce des violations au PFPDT." },

    { id: 'm2c8q4', chap: 'c8', type: 'multi',
      q: "Lesquelles sont des données sensibles au sens de la LPD ?",
      choices: ["Les données sur la santé", "Les opinions religieuses ou politiques", "L'adresse postale", "Les données biométriques identifiant une personne", "Les poursuites et sanctions pénales"],
      answer: [0, 1, 3, 4],
      explain: "L'adresse est une donnée personnelle ordinaire. Les données sensibles exigent un consentement exprès — un point capital en assurance, où les questionnaires de santé sont la norme." },

    { id: 'm2c8q5', chap: 'c8', type: 'single',
      q: "À qui une violation de la sécurité des données doit-elle être annoncée ?",
      choices: ["À la FINMA", "Au PFPDT", "Au MROS", "À l'ASA"],
      answer: [1],
      explain: "Au Préposé fédéral à la protection des données et à la transparence, dans les meilleurs délais, lorsque la violation entraîne vraisemblablement un risque élevé pour la personne concernée." },

    { id: 'm2c8q6', chap: 'c8', type: 'single',
      q: "Quelles activités d'assurance sont soumises à la LBA ?",
      choices: ["Toutes les branches d'assurance", "L'assurance-vie directe", "L'assurance RC uniquement", "L'assurance de choses"],
      answer: [1],
      explain: "Seuls les assureurs exploitant l'assurance-vie directe (ou distribuant des parts de placements collectifs) sont des intermédiaires financiers au sens de la LBA. L'assurance dommages n'y est pas soumise." },

    { id: 'm2c8q7', chap: 'c8', type: 'single',
      q: "En cas de soupçon fondé de blanchiment, à qui l'annonce doit-elle être faite ?",
      choices: ["À la police cantonale", "Au MROS", "Au PFPDT", "Au client concerné"],
      answer: [1],
      explain: "Au Bureau de communication en matière de blanchiment d'argent (MROS), avec blocage des avoirs et interdiction d'informer le client (interdiction du « tipping off »)." },

    { id: 'm2c8q8', chap: 'c8', type: 'single',
      q: "Combien de temps les documents LBA doivent-ils être conservés ?",
      choices: ["2 ans", "5 ans", "10 ans", "20 ans"],
      answer: [2],
      explain: "10 ans, comme la plupart des obligations de conservation en droit commercial suisse (art. 958f CO pour la comptabilité)." },

    { id: 'm2c8q9', chap: 'c8', type: 'multi',
      q: "Quelles conditions doit remplir un intermédiaire pour être inscrit au registre FINMA ?",
      choices: ["Des qualifications professionnelles et une formation continue", "Une RC professionnelle ou une garantie équivalente", "Une bonne réputation", "Un diplôme universitaire en droit", "Ne pas travailler pour un assureur non autorisé"],
      answer: [0, 1, 2, 4],
      explain: "Aucun diplôme universitaire n'est requis : c'est précisément le rôle de la certification AFA d'attester le standard minimal de qualification de la branche." },

    { id: 'm2c8q10', chap: 'c8', type: 'single',
      q: "La LSFin s'applique-t-elle aux contrats d'assurance ?",
      choices: ["Oui, à tous", "Non, sauf aux assurances-vie qualifiées", "Non, jamais", "Oui, mais uniquement à l'assurance RC"],
      answer: [1],
      explain: "Les assurances-vie qualifiées (susceptibles de rachat et liées à des parts ou à des instruments financiers) sont traitées comme des instruments financiers, avec règles de conduite et feuille d'information de base." }
  ];

  window.AFA_MODULES = window.AFA_MODULES || [];
  window.AFA_MODULES.push(M);
})();
