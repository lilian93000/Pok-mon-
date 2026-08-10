/* =============================================================
   AFA – Compléments repris du support de cours officiel
          (myVBV Lernmedien, pages « Récapitulation »)

   Trois blocs du programme officiel manquaient au site :
     · De l'aide mutuelle à la communauté de risques ;
     · Les 14 caractéristiques de l'assurance ;
     · Les risques actuariels et leur limitation.
   S'y ajoutent les acceptions officielles du mot « risque » et
   l'échelle de portée des dangers.

   Le vocabulaire suit celui du support : « répercuter » et
   « prendre en charge » plutôt que « transférer » et « assumer ».
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m1 = M.find(x => x.id === 'm1');
  if (!m1) return;
  const c1 = m1.chapters.find(c => c.id === 'c1');
  const c2 = m1.chapters.find(c => c.id === 'c2');
  const c9 = m1.chapters.find(c => c.id === 'c9');

  /* ---------------------------------------------------------
     1. c1 — les acceptions du mot « risque » et la portée
     --------------------------------------------------------- */
  if (c1) {
    c1.sections.push({
      h: "Les significations du mot « risque »",
      html: `<p>Le mot change de sens selon qui l'emploie&nbsp;— c'est une source classique de confusion à l'examen.</p>
      <table class="tbl">
        <tr><th>Contexte</th><th>Ce que « risque » désigne</th></tr>
        <tr><td><b>Langage courant</b></td><td>Un danger, une entreprise périlleuse.</td></tr>
        <tr><td><b>Terminologie des assurances</b></td>
            <td>Trois choses différentes&nbsp;:
              <ul>
                <li>l'<b>événement</b> qui déclenche l'obligation de fournir la prestation (p.&nbsp;ex. l'inondation)&nbsp;;</li>
                <li>l'<b>objet ou la chose assurée</b>&nbsp;;</li>
                <li>la <b>personne assurée</b>.</li>
              </ul></td></tr>
        <tr><td><b>Gestion des risques</b></td>
            <td>La <b>possibilité que les effets d'un imprévu contrecarrent ou empêchent la réalisation d'un objectif</b>.</td></tr>
      </table>
      <p>La terminologie des assurances qualifie encore le risque&nbsp;:</p>
      <table class="tbl">
        <tr><th>Qualificatif</th><th>Définition</th></tr>
        <tr><td><b>Risque maximal</b></td><td>Le plus grand dommage pécuniaire possible.</td></tr>
        <tr><td><b>Risque objectif</b></td><td>Danger <b>indépendant</b> du comportement de l'assuré (situation, matériaux, activité).</td></tr>
        <tr><td><b>Risque subjectif</b></td><td>Danger <b>créé ou influencé</b> par l'assuré (négligence, moralité).</td></tr>
        <tr><td><b>Risque constant</b></td><td>Risque qui <b>ne se modifie pas</b> pendant la durée du contrat.</td></tr>
        <tr><td><b>Risque variable</b></td><td>Risque qui <b>se modifie</b> pendant la durée du contrat.</td></tr>
      </table>
      <p class="tip">La paire <b>constant / variable</b> est celle qu'on oublie le plus souvent. C'est pourtant elle qui commande l'obligation d'annoncer une <b>aggravation</b> en cours de contrat&nbsp;: seul un risque variable peut s'aggraver.</p>`
    });

    c1.sections.push({
      h: "Évaluer la portée d'un danger",
      html: `<p>La troisième phase du processus croise deux questions&nbsp;: quelle <b>portée</b>, et quelle <b>probabilité de survenance</b>&nbsp;? Le support officiel gradue la portée en quatre degrés&nbsp;:</p>
      <ul>
        <li><b>Bagatelle</b>&nbsp;— conséquences négligeables, absorbées sans effort&nbsp;;</li>
        <li><b>Risque moyen</b>&nbsp;— gênant, mais supportable&nbsp;;</li>
        <li><b>Gros risque</b>&nbsp;— met l'objectif sérieusement en cause&nbsp;;</li>
        <li><b>Risque catastrophe</b>&nbsp;— menace l'existence même de l'entreprise ou du ménage.</li>
      </ul>
      <p class="tip">Cette échelle guide le choix du moyen&nbsp;: on <b>prend en charge</b> les bagatelles, on <b>réduit</b> les risques moyens, on <b>répercute</b> les gros risques sur un assureur, et on <b>évite</b> ce qui relève de la catastrophe si aucune couverture n'est disponible.</p>`
    });

    c1.keypoints.push(
      "En assurance, « risque » désigne aussi bien l'événement que l'objet ou la personne assurée.",
      "Risque objectif / subjectif : indépendant du comportement de l'assuré, ou influencé par lui.",
      "Risque constant / variable : seul le risque variable peut s'aggraver en cours de contrat.",
      "Portée d'un danger : bagatelle, risque moyen, gros risque, risque catastrophe."
    );
  }

  /* ---------------------------------------------------------
     2. c2 — les 14 caractéristiques et les risques actuariels
     --------------------------------------------------------- */
  if (c2) {
    c2.sections.push({
      h: "Les 14 caractéristiques de l'assurance",
      html: `<p>Le support officiel énumère quatorze <b>éléments et caractéristiques essentiels</b> de l'assurance. C'est la liste à connaître par cœur&nbsp;: l'examen y puise volontiers.</p>
      <table class="tbl">
        <tr><th>Caractéristique</th><th>Contenu</th></tr>
        <tr><td><b>1. Communauté des assurés</b></td><td>Les assurés forment une communauté de risques dont l'organisation est assumée par l'entreprise d'assurance.</td></tr>
        <tr><td><b>2. Droit à la prestation</b></td><td>Les assurés ont un <b>droit</b> à la prestation. En cas de sinistre, l'entreprise <b>doit</b> fournir la prestation convenue.</td></tr>
        <tr><td><b>3. Mutualité</b></td><td>La communauté repose sur le principe de mutualité&nbsp;: avec les primes versées par les assurés, l'entreprise paie ses frais administratifs et les prestations dues aux membres.</td></tr>
        <tr><td><b>4. Protection et sécurité</b></td><td>L'assuré ne doit plus craindre de tomber dans la gêne en cas de sinistre&nbsp;: l'assurance lui assure une plus grande <b>liberté financière</b>.</td></tr>
        <tr><td><b>5. Besoin pécuniaire</b></td><td>L'assurance couvre le <b>besoin pécuniaire</b> résultant de l'événement assuré.</td></tr>
        <tr><td><b>6. Enrichissement illégitime</b></td><td>L'assuré ne doit pas s'enrichir aux dépens des autres assurés. La fraude est une grave violation de ce principe.</td></tr>
        <tr><td><b>7. Prime</b></td><td>La prime est le <b>prix</b> à payer pour la protection d'assurance&nbsp;; l'entreprise l'utilise pour financer ses frais d'administration et les prestations.</td></tr>
        <tr><td><b>8. Estimation préalable</b></td><td>La prime doit pouvoir être <b>estimée à l'avance</b>.</td></tr>
        <tr><td><b>9. Loi des grands nombres</b></td><td>Le nombre permet d'estimer la prime&nbsp;: la constatation de la fréquence des cas des années écoulées permet de l'<b>extrapoler dans le futur</b>.</td></tr>
        <tr><td><b>10. Hasard / événement fortuit</b></td><td>La loi des grands nombres se fonde sur des cas <b>fortuits</b>, indépendants de la volonté de l'assuré. Il faut aussi une communauté d'assurés aussi <b>homogène</b> que possible.</td></tr>
        <tr><td><b>11. Cumul</b></td><td>Il y a cumul lorsqu'un seul événement entraîne une <b>accumulation de prestations</b>. On l'atténue par une meilleure répartition des risques.</td></tr>
        <tr><td><b>12. Conformité à un plan</b></td><td>Chaque assurance doit avoir un <b>plan d'exploitation</b>&nbsp;; grâce à lui, l'autorité de surveillance peut contrôler si l'entreprise respecte les exigences de la technique d'assurance.</td></tr>
        <tr><td><b>13. Exploitation économique</b></td><td>L'entreprise doit être gérée selon les principes de l'économie commerciale&nbsp;: le rapport entre dépenses et recettes doit être favorable.</td></tr>
        <tr><td><b>14. Équipe pour la sécurité</b></td><td>Le client et le conseiller forment ensemble une <b>équipe</b> pour trouver la solution d'assurance optimale.</td></tr>
      </table>
      <p class="tip">Trois blocs pour les retenir&nbsp;: ce que l'assuré <b>obtient</b> (1&nbsp;à&nbsp;6), ce que l'assurance <b>calcule</b> (7&nbsp;à&nbsp;11), et ce que l'entreprise <b>doit respecter</b> (12&nbsp;à&nbsp;14).</p>`
    });

    c2.sections.push({
      h: "Les risques actuariels",
      html: `<p>L'assureur ne porte pas seulement les risques de ses clients&nbsp;: il porte aussi les <b>risques actuariels</b>, propres à son métier. Ils naissent d'un diagnostic <b>lacunaire ou insuffisamment précis</b> du cours de l'assurance, et se divisent en deux&nbsp;:</p>
      <table class="tbl">
        <tr><th>Risque</th><th>Origine</th></tr>
        <tr><td><b>Risque fortuit</b></td><td>Les <b>variations fortuites</b>, donc imprévisibles, des sinistres en cours d'assurance. La statistique est bonne, mais la réalité s'en écarte cette année-là.</td></tr>
        <tr><td><b>Risque d'erreur</b></td><td>Une <b>fausse estimation</b> du cours de l'assurance. La cause est en général une <b>modification non prévue</b> d'une ou plusieurs données de base.</td></tr>
      </table>
      <p>L'assureur s'en protège à deux niveaux&nbsp;:</p>
      <table class="tbl">
        <tr><th>Limitation <b>primaire</b> du risque</th><th>Limitation <b>secondaire</b> du risque</th></tr>
        <tr>
          <td>Structurer des portefeuilles peu sensibles aux événements fortuits et aux erreurs&nbsp;:
            <ul>
              <li>très grands portefeuilles&nbsp;;</li>
              <li>portefeuilles <b>homogènes</b>&nbsp;;</li>
              <li>répartition <b>géographique</b>&nbsp;;</li>
              <li>exclusion des risques indésirables&nbsp;;</li>
              <li>participation de l'assuré (franchise, quote-part)&nbsp;;</li>
              <li>prise en charge par plusieurs assureurs&nbsp;: la <b>coassurance</b>.</li>
            </ul></td>
          <td>
            <ul>
              <li>Création d'un <b>pool d'assurances</b> avec d'autres assureurs, pour les risques exceptionnels et très graves&nbsp;;</li>
              <li>couverture par la <b>réassurance</b>&nbsp;: l'assureur direct cède une partie de ses risques à un réassureur.</li>
            </ul></td>
        </tr>
      </table>
      <p class="tip">Ne confondez pas les deux niveaux&nbsp;: la limitation <b>primaire</b> agit sur la <b>composition du portefeuille</b> — c'est du travail de souscription. La limitation <b>secondaire</b> fait intervenir des <b>tiers porteurs de risque</b> — pool et réassurance.</p>`
    });

    c2.keypoints.push(
      "14 caractéristiques : communauté, droit à la prestation, mutualité, protection, besoin pécuniaire, enrichissement illégitime, prime, estimation préalable, loi des grands nombres, hasard, cumul, plan, exploitation économique, équipe pour la sécurité.",
      "Risque fortuit = variations imprévisibles ; risque d'erreur = fausse estimation des données de base.",
      "Limitation primaire : structure du portefeuille (taille, homogénéité, géographie, franchise, coassurance).",
      "Limitation secondaire : pool d'assurances et réassurance."
    );
  }

  /* ---------------------------------------------------------
     3. c9 — de l'aide mutuelle à la communauté de risques
     --------------------------------------------------------- */
  if (c9) {
    c9.sections.unshift({
      h: "De l'aide mutuelle à la communauté de risques",
      html: `<p>Notre existence est constamment mise en danger&nbsp;: des hasards malheureux, des catastrophes naturelles, notre propre comportement et celui d'autres personnes mettent en danger notre santé, notre vie et nos biens. <b>C'est pourquoi nous constituons des communautés</b>&nbsp;: ensemble, nous nous protégeons mieux contre les risques et nous surmontons les coups du sort.</p>
      <table class="tbl">
        <tr><th>La famille</th><th>La communauté de risques</th></tr>
        <tr>
          <td>Le principe de l'<b>aide mutuelle volontaire</b> par solidarité y prévaut. Nous fournissons parfois aussi de l'aide volontaire en dehors du cercle familial.</td>
          <td>Lorsque l'aide volontaire ne suffit pas, nous constituons des communautés de risques régies par des <b>règles contraignantes</b>. Le principe «&nbsp;<b>un pour tous, tous pour un</b>&nbsp;» s'y applique.</td>
        </tr>
      </table>
      <p>L'<b>assurance est une forme moderne de la communauté de risques</b>&nbsp;: ce qui distingue les deux colonnes, ce n'est pas l'intention d'entraide, c'est le passage du volontaire au <b>contraignant</b>, du geste spontané au <b>droit à la prestation</b>.</p>`
    });
    c9.keypoints.unshift(
      "Famille = aide mutuelle volontaire par solidarité ; communauté de risques = règles contraignantes.",
      "« Un pour tous, tous pour un » : le principe de la communauté de risques.",
      "L'assurance est la forme moderne de la communauté de risques."
    );
  }

  /* ---------------------------------------------------------
     4. Questions, au gabarit de la série zéro
     --------------------------------------------------------- */
  const co = (q) => Object.assign({ lvl: 'off' }, q);
  const VF = ['Vrai', 'Faux'];

  m1.questions.push(
    /* — c1 : acceptions du risque, portée, processus — */
    co({
      id: 'co101', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, risque, acceptions du terme',
      q: "Dans la terminologie des assurances, que désigne le mot « risque » dans chacun de ces emplois ?",
      cols: ["L'événement assuré", "L'objet assuré", "La personne assurée"],
      rows: [
        "« L'inondation est un risque couvert par cette police. »",
        "« Ce bâtiment constitue un risque que nous refusons de souscrire. »",
        "« Ce risque présente des antécédents médicaux importants. »",
      ],
      answer: [0, 1, 2],
      explain: "Le même mot recouvre trois réalités en assurance : l'événement déclencheur de la prestation, la chose assurée et la personne assurée. En gestion des risques, il désigne encore autre chose : la possibilité qu'un imprévu empêche la réalisation d'un objectif."
    }),
    co({
      id: 'co102', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, risque, objectif et subjectif',
      q: "Ces dangers relèvent-ils du risque objectif ou du risque subjectif ?",
      cols: ['Risque objectif', 'Risque subjectif'],
      rows: [
        "La maison est construite en bois massif, sans compartimentage coupe-feu.",
        "L'assuré laisse habituellement ses clés sur le tableau de bord.",
        "L'entrepôt se situe dans une zone inondable répertoriée.",
        "Le preneur a déjà été condamné pour une escroquerie à l'assurance.",
      ],
      answer: [0, 1, 0, 1],
      explain: "Le risque objectif tient aux caractéristiques matérielles et techniques, indépendantes de la personne. Le risque subjectif tient au comportement et à la moralité de l'assuré — c'est lui que visent les questions du questionnaire de proposition sur les antécédents."
    }),
    co({
      id: 'co103', chap: 'c1', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, risque, constant et variable',
      q: "Qu'est-ce qui caractérise un risque dit « constant » ?",
      choices: [
        "Il ne se modifie pas pendant la durée du contrat",
        "Il se réalise avec une fréquence régulière et prévisible",
        "Il donne lieu à une prime identique pour tous les assurés",
        "Il est indépendant du comportement de la personne assurée",
      ],
      answer: [0],
      explain: "Le critère est la stabilité dans le temps, non la régularité des sinistres. Cette distinction commande l'obligation d'annoncer une aggravation : seul un risque variable peut s'aggraver en cours de contrat."
    }),
    co({
      id: 'co104', chap: 'c1', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, risque, risque maximal',
      q: "Que désigne le « risque maximal » ?",
      choices: [
        "Le plus grand dommage pécuniaire possible",
        "Le risque dont la probabilité de survenance est la plus forte",
        "La somme d'assurance la plus élevée du portefeuille",
        "Le seuil au-delà duquel l'assureur refuse de souscrire",
      ],
      answer: [0],
      explain: "C'est une mesure de l'ampleur, pas de la fréquence : on suppose le pire enchaînement de circonstances. Il sert à dimensionner la capacité de souscription et le programme de réassurance."
    }),
    co({
      id: 'co105', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, gestion des risques, cinq phases',
      q: "Attribuez chaque question à la phase du processus de gestion des risques à laquelle elle appartient.",
      cols: ['Clarifier les objectifs', 'Reconnaître les dangers', 'Évaluer les dangers', 'Décider des mesures'],
      rows: [
        "Qu'est-ce qui doit vraiment être atteint, et est-ce assez concret ?",
        "Qu'est-ce qui pourrait empêcher la réalisation de l'objectif ?",
        "Quelle est la portée du danger, et quelle est sa probabilité de survenance ?",
        "Faut-il éviter, réduire, répercuter ou prendre en charge ?",
      ],
      answer: [0, 1, 2, 3],
      explain: "Le processus officiel compte cinq phases, la cinquième étant la surveillance de ce qui change avec le temps. La première est celle qu'on oublie le plus : sans objectif clarifié, il n'y a pas de risque à identifier."
    }),
    co({
      id: 'co106', chap: 'c1', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, gestion des risques, deux significations',
      q: "Qu'entend-on par gestion des risques « au sens étroit » ?",
      choices: [
        "La décision de prendre certaines mesures de protection",
        "La méthode d'ensemble permettant de reconnaître et d'évaluer les dangers",
        "La souscription d'une couverture d'assurance auprès d'un tiers",
        "La surveillance permanente de l'évolution des dangers identifiés",
      ],
      answer: [0],
      explain: "Au sens large, la gestion des risques est la méthode complète : reconnaître, évaluer, décider, surveiller. Au sens étroit, elle se réduit à la quatrième phase — le choix parmi les quatre moyens de maîtrise."
    }),
    co({
      id: 'co107', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, gestion des risques, portée des dangers',
      q: "Comment qualifier la portée de chacun de ces dommages potentiels ?",
      cols: ['Bagatelle', 'Gros risque', 'Risque catastrophe'],
      rows: [
        "Un verre cassé dans la cuisine du restaurant.",
        "L'incendie total de l'unique atelier de production de l'entreprise.",
        "Le vol du véhicule de livraison, remplaçable en quelques jours.",
      ],
      answer: [0, 2, 1],
      explain: "L'échelle officielle compte quatre degrés : bagatelle, risque moyen, gros risque, risque catastrophe. Le critère n'est pas le montant en soi mais l'atteinte à l'objectif : ce qui menace l'existence même relève de la catastrophe."
    }),
    co({
      id: 'co108', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, gestion des risques, quatre moyens',
      q: "Selon le vocabulaire officiel, à quel moyen de maîtrise chaque décision correspond-elle ?",
      cols: ['Éviter', 'Réduire / limiter', 'Répercuter', 'Prendre en charge'],
      rows: [
        "L'entreprise renonce à ouvrir une filiale dans un pays instable.",
        "Elle installe une alarme et forme son personnel à l'évacuation.",
        "Elle conclut une police d'assurance couvrant l'incendie.",
        "Elle décide de financer elle-même les dommages inférieurs à CHF 2 000.–.",
      ],
      answer: [0, 1, 2, 3],
      explain: "Le support officiel dit « répercuter » et « prendre en charge » là où le langage courant dit « transférer » et « assumer ». Les quatre moyens couvrent tout le champ de la quatrième phase du processus."
    }),

    /* — c2 : les 14 caractéristiques — */
    co({
      id: 'co201', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, attribution",
      q: "À quelle caractéristique essentielle de l'assurance chaque énoncé se rapporte-t-il ?",
      cols: ['Mutualité', 'Besoin pécuniaire', 'Estimation préalable'],
      rows: [
        "Avec les primes versées par les assurés, l'entreprise paie ses frais et les prestations dues.",
        "L'assurance couvre la conséquence financière que l'événement assuré fait naître.",
        "La prime doit pouvoir être calculée à l'avance.",
      ],
      answer: [0, 1, 2],
      explain: "Ces trois éléments figurent parmi les quatorze caractéristiques essentielles du support officiel. La mutualité organise le partage, le besoin pécuniaire définit ce qui est couvert, l'estimation préalable rend la prime calculable."
    }),
    co({
      id: 'co202', chap: 'c2', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, liste officielle",
      q: "Lesquels de ces éléments figurent parmi les caractéristiques essentielles de l'assurance ?",
      choices: [
        "Le droit à la prestation",
        "La conformité à un plan",
        "L'équipe pour la sécurité",
        "Le hasard, ou événement fortuit",
        "La garantie d'un rendement minimal aux assurés",
        "L'obligation de s'assurer pour toute la population",
      ],
      answer: [0, 1, 2, 3],
      explain: "Le support officiel en énumère quatorze, dont ces quatre. En revanche l'assurance ne garantit aucun rendement — ce n'est pas un placement — et l'obligation générale de s'assurer relève des assurances sociales, non de l'assurance privée."
    }),
    co({
      id: 'co203', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, caractéristiques de l'assurance, droit à la prestation",
      q: "Que signifie la caractéristique du « droit à la prestation » ?",
      choices: [
        "L'assuré dispose d'un droit et l'entreprise doit fournir la prestation convenue",
        "L'entreprise décide au cas par cas d'accorder ou non une aide",
        "L'assuré peut exiger le remboursement de ses primes à tout moment",
        "L'entreprise peut adapter la prestation à sa situation financière",
      ],
      answer: [0],
      explain: "C'est ce qui sépare l'assurance de l'entraide et de la charité : la prestation n'est pas un geste discrétionnaire mais une obligation contractuelle, exigible en justice. C'est le passage du volontaire au contraignant."
    }),
    co({
      id: 'co204', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, conformité à un plan",
      q: "Que recouvre la caractéristique de « conformité à un plan » ?",
      choices: [
        "Chaque assurance doit disposer d'un plan d'exploitation contrôlable par l'autorité",
        "Chaque assuré doit établir un plan de prévention de ses propres risques",
        "Chaque prestation doit être versée selon un calendrier fixé d'avance",
        "Chaque assureur doit publier un plan de ses tarifs à l'avance",
      ],
      answer: [0],
      explain: "Le plan d'exploitation permet à l'autorité de surveillance de vérifier que l'entreprise respecte les exigences de la technique d'assurance. C'est le lien direct entre les caractéristiques essentielles et le droit de la surveillance."
    }),
    co({
      id: 'co205', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: "IA, caractéristiques de l'assurance, vrai ou faux",
      q: "Les caractéristiques essentielles de l'assurance : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "L'assuré ne doit pas s'enrichir aux dépens des autres assurés.",
        "La loi des grands nombres suppose des cas fortuits et une communauté homogène.",
        "Il y a cumul lorsqu'un seul événement entraîne une accumulation de prestations.",
        "L'entreprise d'assurance peut être gérée sans égard aux principes de l'économie commerciale.",
      ],
      answer: [0, 0, 0, 1],
      explain: "Les trois premières reprennent mot pour mot les caractéristiques 6, 9-10 et 11. La quatrième contredit la caractéristique d'exploitation économique : le rapport entre dépenses et recettes doit rester favorable, faute de quoi l'entreprise ne survit pas."
    }),
    co({
      id: 'co206', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: "IA, caractéristiques de l'assurance, équipe pour la sécurité",
      q: "Que désigne la caractéristique de l'« équipe pour la sécurité » ?",
      choices: [
        "Le client et le conseiller, qui cherchent ensemble la solution optimale",
        "Le service interne chargé de la prévention des sinistres chez l'assureur",
        "Les experts mandatés pour évaluer les dommages après un sinistre",
        "Les autorités de surveillance et les associations professionnelles réunies",
      ],
      answer: [0],
      explain: "Le support officiel fait du conseil une caractéristique de l'assurance elle-même : le client apporte la connaissance de sa situation, le conseiller celle des solutions. C'est aussi ce qui fonde le devoir de conseil de l'intermédiaire."
    }),

    /* — c2 : les risques actuariels — */
    co({
      id: 'co207', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, risques actuariels, distinction',
      q: "S'agit-il d'un risque fortuit ou d'un risque d'erreur ?",
      cols: ['Risque fortuit', "Risque d'erreur"],
      rows: [
        "Une année exceptionnellement chargée en sinistres, sans que les hypothèses aient changé.",
        "Une évolution médicale non anticipée fait dériver durablement la table de mortalité retenue.",
        "Les sinistres du semestre dépassent la moyenne, puis reviennent à la normale.",
        "Une modification imprévue des données de base fausse durablement le tarif.",
      ],
      answer: [0, 1, 0, 1],
      explain: "Le risque fortuit vient des variations imprévisibles autour d'une bonne estimation : il se compense dans le temps. Le risque d'erreur vient d'une estimation fausse au départ, en général parce qu'une donnée de base a changé sans qu'on l'ait prévu : il ne se compense pas, il faut corriger le tarif."
    }),
    co({
      id: 'co208', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, risques actuariels, définition',
      q: "D'où proviennent les risques actuariels supportés par l'assureur ?",
      choices: [
        "D'un diagnostic lacunaire ou insuffisamment précis du cours de l'assurance",
        "De l'insolvabilité des preneurs d'assurance en portefeuille",
        "De la variation des cours sur les marchés financiers",
        "Des erreurs commises par les intermédiaires lors de la vente",
      ],
      answer: [0],
      explain: "Ce sont les risques propres au métier d'assureur : mal prévoir le déroulement de l'assurance. Ils se divisent en risque fortuit et risque d'erreur, et se distinguent du risque de placement comme du risque opérationnel."
    }),
    co({
      id: 'co209', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, risques actuariels, limitation primaire et secondaire',
      q: "Ces mesures relèvent-elles de la limitation primaire ou secondaire du risque ?",
      cols: ['Limitation primaire', 'Limitation secondaire'],
      rows: [
        "Constituer de très grands portefeuilles, homogènes et bien répartis géographiquement.",
        "Céder une partie des risques à un réassureur.",
        "Exclure les risques indésirables et faire participer l'assuré par une franchise.",
        "Créer un pool avec d'autres assureurs pour les risques exceptionnels et très graves.",
      ],
      answer: [0, 1, 0, 1],
      explain: "La limitation primaire agit sur la composition du portefeuille — c'est du travail de souscription, l'assureur reste seul porteur. La limitation secondaire fait entrer des tiers dans le risque : pool et réassurance."
    }),
    co({
      id: 'co210', chap: 'c2', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, risques actuariels, limitation primaire',
      q: "Quelles mesures relèvent de la limitation primaire du risque ?",
      choices: [
        "Structurer de très grands portefeuilles d'assurances",
        "Rechercher l'homogénéité des portefeuilles",
        "Répartir géographiquement les risques souscrits",
        "Faire participer l'assuré par une franchise ou une quote-part",
        "Prendre en charge le risque à plusieurs assureurs, en coassurance",
        "Céder une partie des engagements à un réassureur",
      ],
      answer: [0, 1, 2, 3, 4],
      explain: "Toutes ces mesures façonnent le portefeuille lui-même, coassurance comprise — plusieurs assureurs se partagent le risque dès la souscription, chacun envers le preneur. La réassurance, elle, relève de la limitation secondaire : elle intervient après coup, entre assureurs."
    }),
    co({
      id: 'co211', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, risques actuariels, coassurance et réassurance',
      q: "Qu'est-ce qui distingue la coassurance de la réassurance ?",
      choices: [
        "En coassurance, chaque assureur est engagé envers le preneur ; en réassurance, seul l'assureur direct l'est",
        "La coassurance ne concerne que les risques de personnes, la réassurance les risques de choses",
        "La coassurance est imposée par la loi, la réassurance reste facultative",
        "La coassurance couvre les sinistres, la réassurance couvre les frais de gestion",
      ],
      answer: [0],
      explain: "En coassurance, le preneur a plusieurs débiteurs, chacun pour sa part. En réassurance, il n'a qu'un seul débiteur — son assureur — et aucun lien contractuel avec le réassureur, même si celui-ci porte l'essentiel du risque."
    })
  );

  /* — c9 : communauté de risques — */
  if (c9) {
    m1.questions.push(
      co({
        id: 'co301', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
        theme: 'IA, communauté de risques, distinction',
        q: "Ces caractéristiques relèvent-elles de la famille ou de la communauté de risques ?",
        cols: ['La famille', 'La communauté de risques'],
        rows: [
          "L'aide mutuelle y est volontaire et repose sur la solidarité.",
          "Les rapports y sont régis par des règles contraignantes.",
          "Le principe « un pour tous, tous pour un » s'y applique.",
          "L'entraide s'y exerce spontanément, sans droit à réclamer une prestation.",
        ],
        answer: [0, 1, 1, 0],
        explain: "Les deux formes poursuivent le même but — se protéger ensemble — mais diffèrent par la contrainte. La famille aide par solidarité, sans obligation juridique ; la communauté de risques repose sur des règles et ouvre un droit à la prestation."
      }),
      co({
        id: 'co302', chap: 'c9', type: 'single', pts: 1, cx: 'Simple',
        theme: 'IA, communauté de risques, assurance',
        q: "Comment le support officiel définit-il l'assurance par rapport à la communauté de risques ?",
        choices: [
          "L'assurance est une forme moderne de la communauté de risques",
          "L'assurance a remplacé la communauté de risques, devenue obsolète",
          "L'assurance s'oppose à la communauté de risques, qui repose sur le volontariat",
          "L'assurance est une communauté de risques réservée aux entreprises",
        ],
        answer: [0],
        explain: "L'idée est ancienne — se regrouper pour surmonter les coups du sort — et l'assurance en est la version organisée, contractuelle et surveillée. Elle ne remplace pas l'entraide familiale, elle prend le relais là où celle-ci ne suffit plus."
      }),
      co({
        id: 'co303', chap: 'c9', type: 'single', pts: 1, cx: 'Simple',
        theme: 'IA, communauté de risques, raison d\'être',
        q: "Pourquoi constituons-nous des communautés face aux dangers ?",
        choices: [
          "Parce qu'ensemble nous nous protégeons mieux et surmontons les coups du sort",
          "Parce que la loi impose à chacun de rejoindre une communauté de risques",
          "Parce que les dangers ne concernent jamais une personne isolée",
          "Parce que la mise en commun supprime la survenance des sinistres",
        ],
        answer: [0],
        explain: "Hasards malheureux, catastrophes naturelles, comportement d'autrui : notre existence est constamment menacée. Se regrouper ne fait pas disparaître les sinistres, cela en répartit les conséquences financières."
      })
    );
  }
})();
