/* =============================================================
   AFA – Compléments repris du support de cours officiel (2)
          (myVBV Lernmedien, pages « Récapitulation »)

   Suite de data-cours-officiel.js. Blocs ajoutés :
     · la chaîne officielle de la prime, en cinq niveaux ;
     · les groupes d'ayants droit d'un assureur ;
     · les processus de création de valeur, canaux de vente,
       service externe et service interne ;
     · l'entreprise d'assurance en chiffres ;
     · le rôle de l'assurance dans l'économie suisse ;
     · la taxonomie officielle de la réassurance ;
     · les courtiers Inhouse et le classement des intermédiaires ;
     · les fonctions de l'intermédiaire, les formes de conseil et
       les méthodes d'identification des besoins ;
     · la rémunération des intermédiaires.
   ============================================================= */
(function () {
  const M = window.AFA_MODULES || [];
  const m1 = M.find(x => x.id === 'm1');
  if (!m1) return;
  const ch = (id) => m1.chapters.find(c => c.id === id);
  const c2 = ch('c2'), c5 = ch('c5'), c6 = ch('c6'), c7 = ch('c7'), c10 = ch('c10');

  /* ═════════ c2 — la chaîne de la prime ═════════ */
  if (c2) {
    c2.sections.push({
      h: "Genres et éléments de prime : la chaîne officielle",
      html: `<p>Le support officiel décompose la prime en <b>cinq niveaux</b> successifs. Chaque niveau porte un nom précis&nbsp;— c'est ce vocabulaire qu'attend l'examen.</p>
      <table class="tbl">
        <tr><th>Niveau</th><th>Ce qu'il contient</th></tr>
        <tr><td><b>Prime de risque</b></td><td>La prime calculée par les actuaires&nbsp;: le coût statistique pur du risque.</td></tr>
        <tr><td class="muted">+ supplément pour risque</td>
            <td>Les éléments qui compensent les <b>imprévisibilités et les erreurs</b>&nbsp;: marge de sécurité, supplément pour cumul de risques, supplément pour risque de catastrophe, supplément pour renchérissement.</td></tr>
        <tr><td><b>= Prime nette</b></td><td>La prime englobant les <b>risques actuariels</b>.</td></tr>
        <tr><td class="muted">+ frais d'administration<br>+ marge de bénéfice<br><b>−</b> produit des intérêts</td>
            <td>Les frais financent les affaires courantes et la charge des sinistres. Le produit des intérêts se <b>retranche</b>&nbsp;: les primes encaissées d'avance sont placées, et ce rendement réduit la prime.</td></tr>
        <tr><td><b>= Prime brute</b></td><td>Le <b>point de référence</b> pour le calcul de la prime du client&nbsp;— la prime tarifaire.</td></tr>
        <tr><td class="muted">+ suppléments pour spécificités du client<br>−/+ rabais</td>
            <td>Paiement semestriel, suppléments pour risques particuliers&nbsp;; rabais de sommes élevées, de groupes, de famille.</td></tr>
        <tr><td><b>= Prime contractuelle</b></td><td>La prime qui <b>figure dans la police</b> du client.</td></tr>
        <tr><td class="muted">− bonus<br>+ malus</td>
            <td>Le bonus récompense les années sans sinistre&nbsp;; le malus pénalise les assurés qui ont eu recours à l'assurance.</td></tr>
        <tr><td><b>= Prime au comptant</b></td><td>La prime qui est <b>effectivement facturée</b> au client.</td></tr>
      </table>
      <p class="tip">Deux pièges&nbsp;: le <b>produit des intérêts se soustrait</b> (c'est le seul élément négatif de la montée), et l'assurance-vie fait exception&nbsp;— certains suppléments de risque n'y apparaissent pas, la marge de sécurité étant déjà comprise dans les tables de mortalité. En revanche, une <b>prime d'épargne</b> s'y ajoute pour alimenter la réserve mathématique.</p>`
    });
    c2.keypoints.push(
      "Chaîne de la prime : risque → nette → brute → contractuelle → au comptant.",
      "Prime nette = prime de risque + suppléments (sécurité, cumul, catastrophe, renchérissement).",
      "Prime brute = prime nette + frais + marge − produit des intérêts.",
      "Prime contractuelle = celle qui figure dans la police ; prime au comptant = celle qui est facturée.",
      "Bonus et malus s'appliquent après la prime contractuelle."
    );
  }

  /* ═════════ c5 — ayants droit, chiffres, rôle économique ═════════ */
  if (c5) {
    c5.sections.push({
      h: "Les principaux groupes d'ayants droit d'un assureur",
      html: `<p>Un assureur ne rend pas de comptes qu'à ses clients. Six groupes gravitent autour de lui, chacun avec ses attentes propres&nbsp;:</p>
      <table class="tbl">
        <tr><th>Groupe</th><th>Ce qu'il attend</th></tr>
        <tr><td><b>Clients</b></td><td>Un rapport prix/prestation correct, un traitement <b>compétent et libéral</b> des sinistres, des prestations de service de qualité.</td></tr>
        <tr><td><b>Collaborateurs</b></td><td>Un salaire équitable, des prestations sociales correctes, une atmosphère de travail positive et constructive, un emploi sûr.</td></tr>
        <tr><td><b>Bailleurs de fonds</b></td><td>Un bon rendement du capital prêté (intérêts, dividendes, cours ascendant de l'action) et la <b>sécurité</b>&nbsp;— le succès de l'entreprise à long terme.</td></tr>
        <tr><td><b>Fournisseurs</b></td><td>Une relation d'affaires loyale et durable, le paiement régulier des factures.</td></tr>
        <tr><td><b>Concurrents</b></td><td>Une publicité honnête, des méthodes de vente honnêtes&nbsp;— <b>pas de dumping</b> —, une concurrence par la qualité des conseillers.</td></tr>
        <tr><td><b>Société / État</b></td><td>Le respect des dispositions légales, le paiement des impôts, une contribution aux devoirs de société&nbsp;: formation, environnement, promotion de la culture.</td></tr>
      </table>
      <p class="tip">L'objectif principal d'une entreprise est d'acquérir le plus de clients possible et de les fidéliser&nbsp;— mais elle ne peut y parvenir durablement qu'en satisfaisant aussi les cinq autres groupes.</p>`
    });

    c5.sections.push({
      h: "L'entreprise d'assurance en chiffres",
      html: `<p>Les <b>comptes annuels</b>&nbsp;— compte de résultats et bilan&nbsp;— sont au cœur du <b>rapport de gestion</b>, qui informe la FINMA, les propriétaires de parts, les bailleurs de fonds, les clients, les collaborateurs, les concurrents et les médias.</p>
      <p>Trois taux indicatifs se déduisent directement des comptes&nbsp;:</p>
      <table class="tbl">
        <tr><th>Taux</th><th>Formule</th><th>Ce qu'il dit</th></tr>
        <tr><td><b>Taux des sinistres</b></td><td>charge des sinistres / primes</td><td>Le pourcentage des primes encaissées absorbé par les sinistres.</td></tr>
        <tr><td><b>Taux des coûts</b></td><td>coûts des opérations d'assurance / primes</td><td>Le coût de fonctionnement, rapporté aux primes.</td></tr>
        <tr><td><b>Ratio combiné</b> (RC)</td><td>(sinistres + coûts) / primes<br>= taux des sinistres + taux des coûts</td><td>Le <b>résultat technique</b>. Un RC de <b>100&nbsp;%</b> signifie que les coûts de l'exercice ont exactement égalé la recette des primes.</td></tr>
      </table>
      <p>D'autres indicateurs complètent le tableau&nbsp;: les résultats technique et financier, le total du bilan, le placement des capitaux et les réserves techniques. Pour les affaires non-vie, le ratio combiné reste l'indicateur de référence de l'efficacité de la gestion des primes encaissées.</p>`
    });

    c5.sections.push({
      h: "Le rôle de l'assurance dans l'économie suisse",
      html: `<p>L'assurance contribue <b>doublement</b> à l'essor économique du pays&nbsp;: par ses <b>produits</b>, et en tant qu'<b>acteur économique</b>.</p>
      <p><b>Le produit «&nbsp;assurances&nbsp;»</b> promeut le bien-être et la qualité de vie&nbsp;: les risques sont répartis sur <b>plusieurs épaules</b>, ce qui libère des capacités et favorise les activités économiques. Le sentiment d'être protégé est en soi un élément de qualité de vie, et les assureurs contribuent à la <b>protection de l'environnement</b> par leurs mesures préventives.</p>
      <p><b>L'industrie de l'assurance</b> est elle-même un facteur économique important&nbsp;:</p>
      <ul>
        <li>en tant qu'<b>employeur</b>&nbsp;;</li>
        <li>en tant que <b>contribuable</b>, directement et indirectement par ses collaborateurs&nbsp;;</li>
        <li>en tant qu'<b>investisseur</b>, par le placement de ses réserves&nbsp;;</li>
        <li>en tant qu'acteur du <b>marché immobilier</b>&nbsp;: acquisition de terrains, logements et locaux commerciaux, bailleur et prêteur hypothécaire&nbsp;;</li>
        <li>en tant que <b>générateur de fonds à l'étranger</b>, par la rétrocession des gains des filiales étrangères à la maison mère.</li>
      </ul>
      <p>Quelques ordres de grandeur du marché suisse&nbsp;: environ <b>84 assureurs suisses</b>, <b>51 assureurs étrangers</b> et <b>59 autres entités</b> (réassureurs, caisses-maladie pratiquant les complémentaires)&nbsp;; près de <b>50 000 collaborateurs</b> en Suisse&nbsp;; environ <b>140 milliards</b> de francs de primes brutes comptabilisées et <b>81 milliards</b> de paiements pour cas d'assurance.</p>
      <p class="tip">Ces chiffres évoluent&nbsp;: retenez surtout les <b>ordres de grandeur</b> et les <b>cinq rôles économiques</b>, qui, eux, ne changent pas.</p>`
    });

    c5.keypoints.push(
      "Six groupes d'ayants droit : clients, collaborateurs, bailleurs de fonds, fournisseurs, concurrents, société/État.",
      "Ratio combiné = taux des sinistres + taux des coûts ; 100 % = coûts égaux aux primes.",
      "L'assurance contribue à l'économie par ses produits et comme acteur économique.",
      "Cinq rôles économiques : employeur, contribuable, investisseur, acteur immobilier, générateur de fonds étrangers."
    );
  }

  /* ═════════ c10 — processus de création de valeur ═════════ */
  if (c10) {
    c10.sections.push({
      h: "Les trois familles de processus, en détail",
      html: `<table class="tbl">
        <tr><th>Famille</th><th>Ce qu'elle recouvre</th></tr>
        <tr><td><b>Processus de management</b></td><td>Essentiellement la <b>planification</b> et la <b>conduite</b> des activités de l'entreprise.</td></tr>
        <tr><td><b>Processus commerciaux</b></td><td>Toutes les activités liées directement au produit ou aux prestations de services&nbsp;: <b>gestion des produits</b>, <b>conseil et vente</b>, <b>souscription</b>, <b>gestion des risques</b>, <b>administration du portefeuille</b>, <b>gestion des sinistres et des prestations</b>.</td></tr>
        <tr><td><b>Processus de soutien</b></td><td>Ce qui contribue au bon déroulement des autres processus&nbsp;: <b>comptabilité</b>, <b>actuariat</b>, <b>gestion du personnel</b>, <b>informatique</b>, <b>droit et compliance</b>.</td></tr>
      </table>
      <p class="tip">Le test qui ne trompe pas&nbsp;: l'activité s'exercerait-elle à l'identique dans une entreprise d'un autre secteur&nbsp;? L'informatique et les RH, oui&nbsp;— ce sont des processus de soutien. La souscription, non&nbsp;— c'est le métier même de l'assureur.</p>`
    });

    c10.sections.push({
      h: "Les canaux de vente, le service externe et le service interne",
      html: `<p>L'assureur commercialise ses produits par des canaux <b>directs</b> et <b>indirects</b>&nbsp;:</p>
      <table class="tbl">
        <tr><th>Canaux de vente directe</th><th>Canaux de vente indirecte</th></tr>
        <tr>
          <td>L'assureur vend lui-même à ses clients&nbsp;: réseaux d'<b>agences</b>, <b>service externe</b>, <b>télévente</b>, <b>direct mail</b>, <b>vente en ligne</b>.</td>
          <td>Un <b>intermédiaire</b> s'interpose&nbsp;: <b>courtiers</b>, <b>agents multicontrats</b>, <b>vente structurelle</b> et <b>vente accessoire</b>.</td>
        </tr>
      </table>
      <p>Tous ces moyens ont leurs points forts et leurs points faibles&nbsp;: la plupart des assureurs disposent à la fois d'un <b>réseau d'agences</b> et d'un <b>service externe</b>, et utilisent dans certains domaines les deux types de canaux.</p>
      <p>D'où la division classique du travail chez l'assureur&nbsp;:</p>
      <table class="tbl">
        <tr><th>Service externe</th><th>Service interne</th></tr>
        <tr>
          <td>Les collaborateurs en contact avec la clientèle&nbsp;— conseillers et agents. Leur mission&nbsp;: <b>conclure des contrats d'assurance</b>. Cela inclut le conseil, l'assistance, l'acquisition de nouveaux clients et la représentation de l'<b>image</b> de l'entreprise.</td>
          <td>Toutes les tâches qui ne relèvent pas du service externe&nbsp;: management, comptabilité et controlling, services informatiques, personnel et formation, développement des produits, souscription et gestion des risques, gestion du portefeuille, service des sinistres, droit et compliance.</td>
        </tr>
      </table>`
    });

    c10.keypoints.push(
      "Processus de management = planification et conduite ; commerciaux = le métier ; soutien = les moyens.",
      "Vente directe : agences, service externe, télévente, direct mail, en ligne.",
      "Vente indirecte : courtiers, agents multicontrats, vente structurelle et accessoire.",
      "Service externe = contact client et conclusion des contrats ; service interne = tout le reste."
    );
  }

  /* ═════════ c7 — taxonomie officielle de la réassurance ═════════ */
  if (c7) {
    c7.sections.push({
      h: "Coup d'œil officiel sur la réassurance",
      html: `<p>Le support officiel croise <b>deux axes</b>&nbsp;: comment le traité est conclu, et comment le partage s'opère.</p>
      <table class="tbl">
        <tr><th>Comment le traité est conclu</th><th>Ce qu'il couvre</th></tr>
        <tr><td><b>Réassurance facultative</b></td><td>Réassurance de <b>risques isolés</b>, examinés un par un.</td></tr>
        <tr><td><b>Réassurance obligatoire</b></td><td>Réassurance de <b>portefeuilles</b> d'assurances, automatiquement.</td></tr>
      </table>
      <p>Dans les deux cas, la réassurance se conclut sur base <b>proportionnelle</b> ou <b>non proportionnelle</b>&nbsp;:</p>
      <table class="tbl">
        <tr><th>Forme</th><th>Fonctionnement</th></tr>
        <tr><td><b>Réassurance proportionnelle</b><br><span class="muted small">réassurance basée sur des sommes assurées</span></td>
            <td>Le réassureur prend part à la couverture, aux primes et, le cas échéant, aux prestations des assurances d'un portefeuille <b>selon une clé de répartition convenue</b>.</td></tr>
        <tr><td>· <b>Quote-part</b></td>
            <td>La clé de répartition s'applique à <b>toutes</b> les assurances du portefeuille.</td></tr>
        <tr><td>· <b>Excédent de somme</b></td>
            <td>Une <b>priorité</b> est convenue&nbsp;— un maximum que la cédante conserve. Le réassureur participe <b>uniquement</b> aux assurances dont la <b>somme assurée</b> dépasse la priorité.</td></tr>
        <tr><td><b>Réassurance en excédent de sinistre</b><br><span class="muted small">réassurance des dommages</span></td>
            <td>Le réassureur prend en charge les <b>dommages</b> qui excèdent la franchise convenue&nbsp;— priorité, ou déductible —, et ce jusqu'à concurrence du <b>plafond de couverture</b>.</td></tr>
        <tr><td>· <b>Par risque</b></td>
            <td>Un dommage provoqué par <b>un</b> risque assuré déclenche la couverture dès que son montant dépasse la priorité.</td></tr>
        <tr><td>· <b>Par événement</b></td>
            <td>Le traité couvre la <b>somme des sinistres</b> provoqués par un <b>même événement</b> assuré. Le réassureur prend en charge le montant qui dépasse la priorité.</td></tr>
      </table>
      <p class="tip">Le critère qui sépare les deux grandes familles&nbsp;: la <b>proportionnelle</b> raisonne sur la <b>somme assurée</b>, la <b>non proportionnelle</b> sur le <b>montant du dommage</b>. C'est pourquoi l'excédent de <b>somme</b> reste proportionnel, alors que l'excédent de <b>sinistre</b> ne l'est pas — malgré la ressemblance des noms.</p>`
    });
    c7.keypoints.push(
      "Facultative = risques isolés ; obligatoire = portefeuilles entiers.",
      "Proportionnelle = quote-part et excédent de somme ; elle raisonne sur la somme assurée.",
      "Non proportionnelle = excédent de sinistre, par risque ou par événement ; elle raisonne sur le dommage.",
      "Priorité = ce que la cédante garde ; plafond de couverture = la limite du réassureur."
    );
  }

  /* ═════════ c6 — intermédiaires : statut, fonctions, conseil, rémunération ═════════ */
  if (c6) {
    c6.sections.push({
      h: "Classer un intermédiaire : trois critères indépendants",
      html: `<p>Le support officiel insiste sur un point que l'examen aime piéger&nbsp;: <b>fonction</b>, <b>statut contractuel</b> et <b>statut LSA</b> sont trois questions distinctes.</p>
      <table class="tbl">
        <tr><th>Fonction</th><th>Statut selon le contrat</th><th>Statut selon la LSA</th></tr>
        <tr><td>Agent<br>Courtier</td><td>Employé<br>Indépendant</td><td>Intermédiaire lié<br>Intermédiaire non lié</td></tr>
      </table>
      <p>Les <b>intermédiaires non liés</b> sont principalement les courtiers et entreprises de courtage indépendants, ainsi que les intermédiaires <b>salariés</b> de ces entreprises&nbsp;— être salarié ne rend donc pas «&nbsp;lié&nbsp;».</p>
      <p>Les <b>intermédiaires liés</b> entretiennent un <b>rapport de loyauté</b> avec une entreprise d'assurance&nbsp;; au regard du droit de la surveillance, ils lui sont rattachés. Ce sont principalement les conseillers à la clientèle et les agents généraux en régie salariés d'un assureur, les agents généraux <b>indépendants</b> liés à un assureur, et les intermédiaires occasionnels liés à un assureur.</p>
      <p class="tip">Cas particulier à retenir&nbsp;: les <b>courtiers Inhouse</b> ne sont <b>pas</b> des intermédiaires au sens de la LSA. Ce sont des personnes engagées par une entreprise pour s'occuper de ses propres questions d'assurance. Elles ont une fonction de courtier à l'égard de l'assureur, mais comme elles sont <b>employées du preneur d'assurance</b>, la protection de la LSA n'a pas de raison d'être dans leur cas.</p>`
    });

    c6.sections.push({
      h: "Les fonctions de l'intermédiaire dans le processus de vente",
      html: `<p>L'intermédiaire remplit deux <b>fonctions principales</b>&nbsp;:</p>
      <ul>
        <li><b>Fonction d'acquisition</b>&nbsp;: recherche et acquisition de nouveaux clients, suivi et maintien des clients existants&nbsp;;</li>
        <li><b>Fonction de conseil</b>&nbsp;: le conseil à la clientèle.</li>
      </ul>
      <p>Le processus de vente se déroule en trois temps&nbsp;: <b>planification et préparation</b> du conseil, <b>exécution</b> du conseil et conclusion du contrat, puis <b>travaux subséquents</b>&nbsp;— contrôle de la satisfaction et gestion des réclamations.</p>
      <p>S'y ajoutent des <b>tâches secondaires</b>&nbsp;:</p>
      <table class="tbl">
        <tr><th>Pour soutenir la vente</th><th>Pour soutenir d'autres buts de l'entreprise</th></tr>
        <tr>
          <td>Administration de la vente, établissement d'offres, polices et documents d'accompagnement, support et décomptes, contrôles.</td>
          <td>Collecte des données du marché (besoins de la clientèle, activités de la concurrence), représentation de l'assureur, création de «&nbsp;<b>good will</b>&nbsp;».</td>
        </tr>
      </table>
      <p>Deux prestations méritent une mention particulière. Le <b>conseil en matière de prévention des sinistres</b> remplit deux fonctions&nbsp;: il accroît la crédibilité de la compagnie et construit une image de fournisseur compétent de solutions globales&nbsp;— l'expérience quotidienne fait des assureurs de bons conseillers en prévention. L'<b>assistance et le conseil en cas de sinistre</b>, eux, réclament beaucoup de doigté&nbsp;: le client se trouve dans une situation inhabituelle&nbsp;— colère, deuil, choc. Y rendre de précieux services, plutôt que d'organiser une vente forcée, établit une relation de confiance durable.</p>`
    });

    c6.sections.push({
      h: "Formes de conseil et identification des besoins",
      html: `<p>On distingue le <b>conseil global</b> et le <b>conseil partiel</b>&nbsp;— le conseil global gagne en importance. Dans le cadre d'une <b>prestation financière intégrée</b>, les besoins et les problèmes du client sont analysés tant dans le domaine de l'assurance que dans le domaine <b>financier</b>.</p>
      <p>La plupart des assureurs divisent leur marché en <b>segments</b> et offrent des <b>paquets d'assurances</b> spécifiques à chacun.</p>
      <p>Trois méthodes d'identification des besoins sont les plus répandues&nbsp;:</p>
      <ul>
        <li>l'<b>analyse des besoins</b>&nbsp;;</li>
        <li>l'<b>analyse du portefeuille</b>&nbsp;;</li>
        <li>la <b>gestion des risques</b>.</li>
      </ul>
      <p>Enfin, deux notions à ne pas confondre&nbsp;: l'<b>efficacité</b> est la meilleure exécution possible des objectifs du marketing, par des contacts de vente qualifiés&nbsp;; l'<b>efficience</b> correspond à leur réalisation <b>économique</b>, à des prix avantageux.</p>
      <p class="tip">Le meilleur conseil ne vaut rien s'il n'est pas suivi de la conclusion d'une affaire, ou si l'affaire conclue n'apporte pas de couverture notable. Il faut évaluer le rapport <b>efficacité / efficience</b> et garder une idée claire du rapport entre le nombre de contacts et le potentiel de primes du client.</p>`
    });

    c6.sections.push({
      h: "La rémunération des intermédiaires",
      html: `<p><b>Conseillers à la clientèle, agents et intermédiaires occasionnels</b>&nbsp;: la rémunération se compose d'une rétribution fixe convenue par contrat et/ou d'une rétribution basée sur les résultats. Les rétributions usuelles sont les <b>commissions d'acquisition</b>, les <b>commissions sur le portefeuille</b>, les <b>commissions de renouvellement</b>, les <b>supercommissions</b> et les <b>commissions d'administration</b>&nbsp;— combinables entre elles.</p>
      <p><b>Courtiers</b>&nbsp;: en règle générale, le courtier est rémunéré <b>par l'assureur</b>. On qualifie cette rétribution de <b>courtage</b>&nbsp;:</p>
      <ul>
        <li><b>Courtage d'acquisition</b>&nbsp;: pour la conclusion&nbsp;;</li>
        <li><b>Commission sur le portefeuille</b>&nbsp;: pour le maintien des rapports d'assurance et le suivi de l'effectif des assurés&nbsp;;</li>
        <li><b>Courtage permanent</b>&nbsp;: versé de manière <b>échelonnée</b>&nbsp;— en règle générale annuellement — durant toute la durée du contrat, à la place du courtage de conclusion et de maintien. Fréquent pour les opérations avec les entreprises. Son avantage&nbsp;: le courtier n'est <b>pas financièrement incité</b> à replacer ailleurs les contrats de ses clients.</li>
      </ul>
      <p><b>Honoraire</b>&nbsp;: lorsque l'intermédiaire reçoit une rétribution <b>fixe</b> convenue par contrat. Le volume se détermine soit par le <b>temps consacré</b> à une tâche définie (facturation à l'heure), soit par un <b>forfait</b>. Le remboursement des frais n'est dû <b>que s'il a été convenu</b>.</p>
      <p><b>Employés d'entreprises de courtage</b>&nbsp;: ce sont des salariés, rémunérés par un salaire fixe et/ou un salaire basé sur les résultats. Ils ont droit au remboursement de leurs frais par leur employeur.</p>`
    });

    c6.keypoints.push(
      "Fonction, statut contractuel et statut LSA sont trois critères indépendants.",
      "Un salarié d'une entreprise de courtage reste un intermédiaire NON lié.",
      "Les courtiers Inhouse ne sont pas des intermédiaires au sens de la LSA : ils sont employés du preneur.",
      "Deux fonctions principales : acquisition et conseil ; trois temps : préparation, exécution, travaux subséquents.",
      "Trois méthodes d'identification des besoins : analyse des besoins, analyse du portefeuille, gestion des risques.",
      "Efficacité = bien exécuter les objectifs ; efficience = les réaliser économiquement.",
      "Courtage permanent : versé annuellement, il retire au courtier l'incitation à replacer les contrats."
    );
  }

  /* ═════════ Questions ═════════ */
  const co = (q) => Object.assign({ lvl: 'off' }, q);
  const VF = ['Vrai', 'Faux'];

  m1.questions.push(
    /* — c2 : chaîne de la prime — */
    co({
      id: 'cp201', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, prime, genres de prime',
      q: "À quel genre de prime chaque définition correspond-elle ?",
      cols: ['Prime nette', 'Prime brute', 'Prime contractuelle', 'Prime au comptant'],
      rows: [
        "La prime englobant les risques actuariels.",
        "Le point de référence pour le calcul de la prime du client, dite prime tarifaire.",
        "La prime qui figure dans la police d'assurance du client.",
        "La prime qui est effectivement facturée au client.",
      ],
      answer: [0, 1, 2, 3],
      explain: "La chaîne officielle compte cinq niveaux : prime de risque, puis nette, brute, contractuelle et au comptant. Entre la contractuelle et celle au comptant s'intercalent le bonus, qui se déduit, et le malus, qui s'ajoute."
    }),
    co({
      id: 'cp202', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, prime, produit des intérêts',
      q: "Comment le produit des intérêts intervient-il dans le passage de la prime nette à la prime brute ?",
      choices: [
        "Il se soustrait, les primes encaissées d'avance étant placées",
        "Il s'ajoute, au même titre que les frais d'administration",
        "Il n'intervient qu'en assurance-vie, jamais en non-vie",
        "Il est neutre et ne figure pas dans le calcul",
      ],
      answer: [0],
      explain: "C'est le seul élément négatif de la montée : l'assureur encaisse la prime avant de payer les sinistres, et le rendement de ce placement vient en déduction. Frais d'administration et marge de bénéfice s'ajoutent, eux."
    }),
    co({
      id: 'cp203', chap: 'c2', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, prime, suppléments pour risque',
      q: "Quels suppléments s'ajoutent à la prime de risque pour obtenir la prime nette ?",
      choices: [
        "La marge de sécurité",
        "Le supplément pour cumul de risques",
        "Le supplément pour risque de catastrophe",
        "Le supplément pour renchérissement",
        "Les frais d'administration de la compagnie",
        "Le bonus accordé aux années sans sinistre",
      ],
      answer: [0, 1, 2, 3],
      explain: "Ces quatre suppléments compensent les imprévisibilités et les erreurs — ce sont les risques actuariels. Les frais d'administration n'interviennent qu'au niveau suivant, et le bonus tout à la fin, entre la prime contractuelle et la prime au comptant."
    }),
    co({
      id: 'cp204', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, prime, bonus et malus',
      q: "La chaîne de la prime : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Le bonus se déduit de la prime contractuelle pour obtenir la prime au comptant.",
        "Les rabais de groupe ou de famille interviennent avant la prime contractuelle.",
        "En assurance-vie mixte, une prime d'épargne s'ajoute pour alimenter la réserve mathématique.",
        "En assurance-vie, la marge de sécurité doit être ajoutée séparément à la prime de risque.",
      ],
      answer: [0, 0, 0, 1],
      explain: "En assurance-vie, la marge de sécurité est déjà comprise dans les tables de mortalité : certains suppléments de risque n'y apparaissent donc pas. En revanche la prime d'épargne s'y ajoute, ce qui n'existe pas en non-vie."
    }),

    /* — systèmes de financement — */
    co({
      id: 'cp205', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, systèmes de financement, attribution',
      q: "À quel système de financement chaque description correspond-elle ?",
      cols: ['Répartition', 'Capitalisation', 'Couverture des besoins'],
      rows: [
        "Les recettes des primes sont immédiatement affectées au paiement des prestations.",
        "Les primes constituent une forme d'épargne individuelle et alimentent la réserve mathématique.",
        "Le financement est assuré par le calcul préalable des primes et une réserve technique.",
      ],
      answer: [0, 1, 2],
      explain: "Répartition : l'AVS/AI et son fonds de compensation. Capitalisation : la prévoyance professionnelle et la part d'épargne de la vie mixte. Couverture des besoins : la quasi-totalité de l'assurance privée, et c'est le système le plus répandu en Suisse."
    }),
    co({
      id: 'cp206', chap: 'c2', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, systèmes de financement, couverture des besoins',
      q: "À quel type d'assurance le système de la couverture des besoins convient-il particulièrement ?",
      choices: [
        "Aux assurances à primes constantes, à risques faciles à évaluer et à contrats de 1 à 5 ans",
        "Aux assurances de très longue durée comportant une part d'épargne",
        "Aux assurances sociales obligatoires à très grand portefeuille",
        "Aux couvertures conclues pour un événement unique et ponctuel",
      ],
      answer: [0],
      explain: "Ce sont exactement les caractéristiques de l'assurance privée non-vie, d'où sa très large diffusion en Suisse. Les contrats de longue durée à composante d'épargne relèvent de la capitalisation, et les grandes assurances sociales de la répartition."
    }),
    co({
      id: 'cp207', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, systèmes de financement, prime moyenne',
      q: "Quand la méthode de la prime individuelle s'impose-t-elle à celle de la prime moyenne ?",
      choices: [
        "Quand le client est libre de changer d'assureur, sous peine de voir partir les bons risques",
        "Quand le portefeuille est trop petit pour être statistiquement exploitable",
        "Quand l'assurance est rendue obligatoire par la loi",
        "Quand l'assureur souhaite réduire ses frais d'administration",
      ],
      answer: [0],
      explain: "Une prime moyenne fait payer aux bons risques davantage que leur coût : dès que la concurrence joue, ils partent chez un assureur mieux tarifé. Cela dit, une différenciation démesurée coûte cher en études — la prime moyenne reste préférable quand la liberté de changer est faible."
    }),

    /* — c5 : ayants droit, chiffres, économie — */
    co({
      id: 'cp301', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, ayants droit, attentes',
      q: "Quel groupe d'ayants droit formule chacune de ces attentes envers l'assureur ?",
      cols: ['Collaborateurs', 'Bailleurs de fonds', 'Concurrents', 'Société / État'],
      rows: [
        "Un salaire équitable, une atmosphère de travail constructive et un emploi sûr.",
        "Un bon rendement du capital prêté et la sécurité d'un succès durable.",
        "Une publicité honnête et des méthodes de vente sans dumping.",
        "Le respect des dispositions légales, le paiement des impôts, une contribution à la formation.",
      ],
      answer: [0, 1, 2, 3],
      explain: "Six groupes gravitent autour de l'assureur : clients, collaborateurs, bailleurs de fonds, fournisseurs, concurrents et société/État. Fidéliser les clients reste l'objectif principal, mais il n'est tenable durablement que si les cinq autres groupes trouvent aussi leur compte."
    }),
    co({
      id: 'cp302', chap: 'c5', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, chiffres, ratio combiné',
      q: "Comment le ratio combiné se calcule-t-il à partir des deux autres taux indicatifs ?",
      choices: [
        "Taux des sinistres + taux des coûts",
        "Taux des sinistres − taux des coûts",
        "Taux des sinistres × taux des coûts",
        "Taux des coûts ÷ taux des sinistres",
      ],
      answer: [0],
      explain: "Le taux des sinistres rapporte la charge des sinistres aux primes, le taux des coûts rapporte le coût des opérations aux primes : leur somme donne le ratio combiné. Un RC de 100 % signifie que les coûts de l'exercice ont exactement égalé la recette des primes."
    }),
    co({
      id: 'cp303', chap: 'c5', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, rôle économique, facteur économique',
      q: "À quels titres l'industrie de l'assurance constitue-t-elle un facteur économique important ?",
      choices: [
        "En tant qu'employeur",
        "En tant que contribuable, directement et par ses collaborateurs",
        "En tant qu'investisseur plaçant ses réserves",
        "En tant qu'acteur du marché immobilier et prêteur hypothécaire",
        "En tant que générateur de fonds à l'étranger via ses filiales",
        "En tant qu'autorité de surveillance du secteur financier",
      ],
      answer: [0, 1, 2, 3, 4],
      explain: "Ces cinq rôles figurent au support officiel. La surveillance, elle, appartient à la FINMA : l'industrie est surveillée, elle ne se surveille pas elle-même — l'autorégulation de branche ne change rien à cela."
    }),
    co({
      id: 'cp304', chap: 'c5', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, rôle économique, double contribution',
      q: "De quelle double manière l'assurance contribue-t-elle à l'essor économique de la Suisse ?",
      choices: [
        "Par ses produits « assurances » et en tant qu'acteur économique elle-même",
        "Par ses placements en actions et par ses placements obligataires",
        "Par la vente directe et par la vente indirecte",
        "Par les assurances sociales et par les assurances privées",
      ],
      answer: [0],
      explain: "Le produit lui-même libère des capacités en répartissant les risques sur plusieurs épaules, ce qui favorise l'activité économique. L'industrie, elle, pèse comme employeur, contribuable, investisseur, acteur immobilier et générateur de fonds étrangers."
    }),

    /* — c7 : réassurance officielle — */
    co({
      id: 'cp401', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, réassurance, taxonomie officielle',
      q: "Chaque description correspond à quelle forme de réassurance ?",
      cols: ['Quote-part', 'Excédent de somme', 'Excédent de sinistre'],
      rows: [
        "La clé de répartition convenue s'applique à toutes les assurances du portefeuille.",
        "Le réassureur ne participe qu'aux assurances dont la somme assurée dépasse la priorité.",
        "Le réassureur prend en charge les dommages excédant la priorité, jusqu'au plafond de couverture.",
      ],
      answer: [0, 1, 2],
      explain: "Quote-part et excédent de somme sont proportionnels : ils raisonnent sur la somme assurée. L'excédent de sinistre est non proportionnel : il raisonne sur le montant du dommage. La ressemblance des noms « excédent de somme » et « excédent de sinistre » est le piège classique."
    }),
    co({
      id: 'cp402', chap: 'c7', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, réassurance, par risque et par événement',
      q: "Qu'est-ce qui distingue un excédent de sinistre « par événement » d'un excédent de sinistre « par risque » ?",
      choices: [
        "Le premier couvre la somme des sinistres d'un même événement, le second un sinistre isolé",
        "Le premier ne s'applique qu'aux catastrophes naturelles, le second aux risques industriels",
        "Le premier est proportionnel, le second ne l'est pas",
        "Le premier est facultatif, le second est obligatoire",
      ],
      answer: [0],
      explain: "Une tempête qui frappe des milliers de contrats forme un seul événement : c'est le traité par événement qui protège du cumul. Le traité par risque se déclenche, lui, dès qu'un dommage isolé dépasse la priorité."
    }),
    co({
      id: 'cp403', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, réassurance, facultative et obligatoire',
      q: "Ces traités relèvent-ils de la réassurance facultative ou obligatoire ?",
      cols: ['Facultative', 'Obligatoire'],
      rows: [
        "La réassurance porte sur des risques isolés, examinés un par un.",
        "La réassurance porte sur des portefeuilles entiers d'assurances.",
      ],
      answer: [0, 1],
      explain: "Le premier axe de la classification officielle porte sur le mode de conclusion, non sur le mode de partage. Facultative et obligatoire peuvent l'une comme l'autre être conclues sur base proportionnelle ou non proportionnelle."
    }),

    /* — c6 : intermédiaires — */
    co({
      id: 'cp501', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, courtiers Inhouse',
      q: "Quel est le statut d'un courtier Inhouse, employé par une entreprise pour gérer ses propres assurances ?",
      choices: [
        "Il n'est pas un intermédiaire au sens de la LSA",
        "Il est un intermédiaire lié, rattaché à l'assureur de son employeur",
        "Il est un intermédiaire non lié soumis à inscription au registre",
        "Il est assimilé à une entreprise d'assurance",
      ],
      answer: [0],
      explain: "Il exerce bien une fonction de courtier face à l'assureur, mais il est employé du preneur d'assurance lui-même. La LSA protège le preneur contre les intermédiaires : elle n'a pas de raison de s'appliquer à celui qui travaille pour lui."
    }),
    co({
      id: 'cp502', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, statut LSA',
      q: "Ces intermédiaires sont-ils liés ou non liés au sens de la LSA ?",
      cols: ['Intermédiaire lié', 'Intermédiaire non lié'],
      rows: [
        "Un conseiller à la clientèle salarié d'une entreprise d'assurance.",
        "Un intermédiaire salarié d'une entreprise de courtage indépendante.",
        "Un agent général indépendant lié par contrat à une entreprise d'assurance.",
        "Une entreprise de courtage indépendante mandatée par ses clients.",
      ],
      answer: [0, 1, 0, 1],
      explain: "Le critère n'est pas le contrat de travail mais le rapport de loyauté envers un assureur. Un salarié de courtier reste non lié ; un agent général indépendant reste lié — les deuxième et troisième lignes sont les pièges classiques."
    }),
    co({
      id: 'cp503', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, courtage permanent',
      q: "Quel avantage le courtage permanent présente-t-il par rapport au courtage d'acquisition ?",
      choices: [
        "Le courtier n'est pas incité financièrement à replacer ailleurs les contrats de ses clients",
        "Il dispense le courtier de tout suivi du portefeuille",
        "Il est versé en une seule fois, ce qui simplifie la comptabilité",
        "Il exonère l'assureur de toute rémunération pendant la durée du contrat",
      ],
      answer: [0],
      explain: "Versé de manière échelonnée — en règle générale annuellement — pendant toute la durée du contrat, il rémunère la continuité plutôt que la signature. Il est surtout pratiqué pour les opérations d'intermédiation avec les entreprises."
    }),
    co({
      id: 'cp504', chap: 'c6', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, méthodes d\'identification des besoins',
      q: "Quelles sont les méthodes d'identification des besoins les plus répandues ?",
      choices: [
        "L'analyse des besoins",
        "L'analyse du portefeuille",
        "La gestion des risques",
        "L'analyse du bilan fiscal du client",
        "Le sondage de satisfaction après sinistre",
      ],
      answer: [0, 1, 2],
      explain: "Ces trois méthodes structurent l'entretien de conseil. Elles se combinent avec les formes de conseil — global ou partiel — et, dans une prestation financière intégrée, avec l'analyse du domaine financier du client."
    }),
    co({
      id: 'cp505', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, distribution, canaux de vente',
      q: "Ces canaux relèvent-ils de la vente directe ou de la vente indirecte ?",
      cols: ['Vente directe', 'Vente indirecte'],
      rows: [
        "Le réseau d'agences et le service externe de l'assureur.",
        "Les courtiers et les agents multicontrats.",
        "La télévente, le direct mail et la vente en ligne.",
        "La vente structurelle et la vente accessoire.",
      ],
      answer: [0, 1, 0, 1],
      explain: "Le critère est l'existence d'un intermédiaire entre l'assureur et le client. La plupart des assureurs combinent les deux, avec un réseau d'agences et un service externe qui coexistent avec des partenariats de courtage."
    }),
    co({
      id: 'cp506', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, efficacité et efficience',
      q: "Qu'est-ce qui distingue l'efficacité de l'efficience dans l'activité de vente ?",
      choices: [
        "L'efficacité vise la meilleure exécution des objectifs, l'efficience leur réalisation économique",
        "L'efficacité concerne le service interne, l'efficience le service externe",
        "L'efficacité se mesure en primes encaissées, l'efficience en nombre de contrats",
        "L'efficacité s'applique au courtier, l'efficience à l'agent",
      ],
      answer: [0],
      explain: "Être efficace, c'est atteindre l'objectif par des contacts de vente qualifiés ; être efficient, c'est l'atteindre à un coût avantageux. Un conseil excellent mais qui ne débouche sur rien manque d'efficacité ; un conseil bâclé pour gagner du temps manque de qualité."
    }),
    co({
      id: 'cp507', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiation, fonctions et tâches',
      q: "Ces activités relèvent-elles des fonctions principales de l'intermédiaire ou de ses tâches secondaires ?",
      cols: ['Fonction principale', 'Tâche secondaire'],
      rows: [
        "Rechercher et acquérir de nouveaux clients.",
        "Conseiller la clientèle sur les couvertures adaptées.",
        "Collecter des données sur les besoins du marché et les activités de la concurrence.",
        "Établir les offres, les polices et les documents d'accompagnement.",
      ],
      answer: [0, 0, 1, 1],
      explain: "Les deux fonctions principales sont l'acquisition et le conseil. Les tâches secondaires soutiennent soit la vente elle-même — administration, offres, décomptes —, soit d'autres buts de l'entreprise : veille de marché, représentation, création de good will."
    })
  );
})();
