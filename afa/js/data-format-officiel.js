/* Questions rédigées au gabarit de la série zéro officielle
 *
 * Même structure que `data-nullserie.js` : en-tête de thème « module, sujet,
 * sous-sujet », barème (1 point = simple, 2 points = moyenne), et les trois
 * formats de l'épreuve écrite — choix unique, choix multiple sans indication du
 * nombre de bonnes réponses, et tableau d'attribution (`type: 'grid'`), y
 * compris la variante Vrai/Faux.
 *
 * Contenu : Circles « Lancement » et « Base », soit l'industrie de l'assurance
 * (module 1) et le droit de l'assurance (module 2).
 */
(function () {
  const M = window.AFA_MODULES;
  const m1 = M.find(m => m.id === 'm1');
  const m2 = M.find(m => m.id === 'm2');
  const fo = (q) => Object.assign({ lvl: 'off' }, q);
  const VF = ['Vrai', 'Faux'];

  /* ═══════════════ Module 1 — Industrie de l'assurance ═══════════════ */

  m1.questions.push(
    /* — c1 : risque et gestion des risques — */
    fo({
      id: 'fo101', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, gestion des risques, mesures',
      q: "Attribuez chaque décision à la mesure de gestion des risques correspondante.",
      cols: ['Éviter', 'Réduire', 'Transférer', 'Assumer'],
      rows: [
        "Une PME installe une détection incendie et des portes coupe-feu dans son entrepôt.",
        "Un transporteur renonce définitivement à desservir une zone de guerre.",
        "Un garagiste choisit une franchise de CHF 5 000 pour garder les petits dégâts à sa charge.",
        "Un promoteur conclut une assurance travaux de construction pour son chantier."
      ],
      answer: [1, 0, 3, 2],
      explain: "Les mesures techniques qui diminuent la fréquence ou l'ampleur d'un sinistre réduisent le risque. Renoncer à l'activité l'évite. Une franchise ou une réserve financière signifie qu'on assume soi-même. Conclure une assurance transfère le risque."
    }),
    fo({
      id: 'fo102', chap: 'c1', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, risque, notion',
      q: "Qu'entend-on par « risque » au sens de l'assurance ?",
      choices: [
        "La possibilité qu'un événement dommageable futur et incertain survienne",
        "Le montant du dommage effectivement subi lors d'un sinistre",
        "La somme d'argent que l'assureur met en réserve pour un client",
        "La prime que le preneur d'assurance doit payer chaque année"
      ],
      answer: [0],
      explain: "Le risque est l'éventualité d'un événement futur, incertain et indépendant de la volonté de l'assuré. Une fois l'événement survenu, on ne parle plus de risque mais de sinistre."
    }),
    fo({
      id: 'fo103', chap: 'c1', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, risque, assurabilité',
      q: "Quels critères font qu'un risque peut être pris en charge par une compagnie d'assurance privée ?",
      choices: [
        "Il doit être aléatoire, donc indépendant de la volonté de l'assuré.",
        "Il doit pouvoir être évalué de manière chiffrée.",
        "Il doit exister un nombre suffisant de risques semblables.",
        "Il doit toucher tous les assurés du portefeuille en même temps.",
        "Il doit être certain de se réaliser au cours du contrat."
      ],
      answer: [0, 1, 2],
      explain: "L'assurabilité suppose le caractère aléatoire, la mesurabilité et une collectivité de risques comparables. Un événement certain n'est pas un risque, et un événement qui frapperait tout le portefeuille en même temps détruirait précisément l'équilibre de la mutualité."
    }),
    fo({
      id: 'fo104', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, gestion des risques, processus',
      q: "Le processus de gestion des risques : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "L'identification des risques précède leur analyse.",
        "La surveillance des risques est une étape unique, réalisée en fin de processus.",
        "L'assurance est l'un des instruments de traitement du risque, pas le seul.",
        "Un risque évalué comme faible en fréquence et faible en gravité justifie en principe une couverture d'assurance."
      ],
      answer: [0, 1, 0, 1],
      explain: "On identifie avant d'analyser, et la surveillance est continue : le processus est un cycle. L'assurance n'est qu'un mode de traitement parmi l'évitement, la réduction et la conservation — et les risques à faible fréquence et faible gravité sont typiquement ceux qu'on assume soi-même."
    }),

    /* — c2 : principes techniques et prime — */
    fo({
      id: 'fo105', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, prime, composantes',
      q: "Attribuez chaque élément à la composante de la prime correspondante.",
      cols: ['Prime de risque', 'Chargement de frais', 'Prime brute'],
      rows: [
        "Coût statistique attendu des sinistres, calculé sur la fréquence et le coût moyen",
        "Commissions versées aux intermédiaires et frais d'administration",
        "Montant obtenu en additionnant les deux éléments précédents"
      ],
      answer: [0, 1, 2],
      explain: "Prime de risque + chargement de frais (et marge) = prime brute, dite aussi prime tarifaire. La prime contractuelle s'en déduit en tenant compte des particularités du client, puis viennent encore les taxes légales."
    }),
    fo({
      id: 'fo106', chap: 'c2', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, principes techniques, loi des grands nombres',
      q: "Que dit la loi des grands nombres appliquée à l'assurance ?",
      choices: [
        "Plus la collectivité assurée est grande, plus le résultat réel se rapproche de la valeur attendue",
        "Plus l'assureur encaisse de primes, plus son bénéfice est garanti",
        "Plus le contrat est long, moins le risque de sinistre est élevé",
        "Plus il y a de sinistres, plus la prime de risque diminue"
      ],
      answer: [0],
      explain: "C'est le fondement statistique de l'assurance : sur un grand nombre de risques comparables et indépendants, l'écart entre la charge de sinistres réelle et la charge attendue se réduit, ce qui rend la prime calculable."
    }),
    fo({
      id: 'fo107', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, principes techniques, mutualité et solidarité',
      q: "Mutualité, compensation et équivalence : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "La mutualité signifie que les nombreux non-sinistrés financent les prestations des rares sinistrés.",
        "La compensation des risques dans le temps consiste à lisser les résultats sur plusieurs exercices.",
        "L'assurance privée applique le principe d'équivalence : la prime doit correspondre au risque apporté.",
        "Dans l'assurance privée, la prime est fixée en fonction de la capacité financière du preneur."
      ],
      answer: [0, 0, 0, 1],
      explain: "Mutualité, compensation dans le temps et équivalence prime/risque sont les trois piliers techniques de l'assurance privée. Fixer la prime selon les revenus relève de la solidarité des assurances sociales — l'AVS, dont les cotisations sont proportionnelles au salaire."
    }),
    fo({
      id: 'fo108', chap: 'c2', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, prime, facteurs de tarification',
      q: "Quels éléments influencent la prime contractuelle d'une assurance de choses ?",
      choices: [
        "La somme d'assurance convenue",
        "La franchise choisie par le preneur",
        "La statistique de sinistres de la branche",
        "L'évolution passée du sinistre du client (bonus/malus, rabais)",
        "Le taux d'imposition du canton de domicile de l'assureur"
      ],
      answer: [0, 1, 2, 3],
      explain: "Somme assurée, franchise, statistique de branche et historique de sinistres du client entrent tous dans le calcul. La fiscalité de l'assureur n'est pas un paramètre de tarification du contrat ; en revanche le timbre fédéral, lui, s'ajoute à la prime."
    }),

    /* — c3 : les trois piliers — */
    fo({
      id: 'fo109', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, trois piliers, attribution',
      q: "À quel pilier du système suisse de prévoyance ces éléments appartiennent-ils ?",
      cols: ['1er pilier', '2e pilier', '3e pilier'],
      rows: [
        "AVS / AI",
        "Prévoyance professionnelle obligatoire (LPP)",
        "Prévoyance individuelle liée (pilier 3a)",
        "Prestations complémentaires",
        "Assurance-vie libre auprès d'un assureur privé"
      ],
      answer: [0, 1, 2, 0, 2],
      explain: "Le 1er pilier assure le minimum vital et comprend l'AVS, l'AI et les prestations complémentaires. Le 2e pilier vise le maintien du niveau de vie habituel. Le 3e pilier est la prévoyance individuelle, liée (3a) ou libre (3b)."
    }),
    fo({
      id: 'fo110', chap: 'c3', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, trois piliers, but',
      q: "Quel est l'objectif visé par la combinaison du 1er et du 2e pilier ?",
      choices: [
        "Permettre de maintenir de manière appropriée le niveau de vie antérieur",
        "Garantir à chaque assuré le remboursement intégral de ses cotisations",
        "Couvrir uniquement les besoins vitaux du retraité",
        "Remplacer intégralement le dernier salaire perçu"
      ],
      answer: [0],
      explain: "La Constitution assigne au 1er pilier la couverture des besoins vitaux et aux deux premiers piliers ensemble le maintien approprié du niveau de vie antérieur — dans l'ordre de grandeur de 60 % du dernier salaire, et non de 100 %."
    }),
    fo({
      id: 'fo111', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, trois piliers, financement',
      q: "Le financement des trois piliers : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "L'AVS est financée par répartition : les cotisations des actifs paient les rentes en cours.",
        "La prévoyance professionnelle est financée par capitalisation individuelle.",
        "Les cotisations AVS sont plafonnées à partir d'un certain salaire.",
        "Le pilier 3a donne droit à une déduction fiscale plafonnée."
      ],
      answer: [0, 0, 1, 0],
      explain: "L'AVS fonctionne par répartition, la LPP par capitalisation. Les cotisations AVS sont prélevées sur l'intégralité du salaire, sans plafond — c'est la rente qui est plafonnée, ce qui fait la solidarité du système. Le 3a est déductible jusqu'à un maximum annuel fixé chaque année."
    }),

    /* — c4 : les branches d'assurance — */
    fo({
      id: 'fo112', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, dommage-somme',
      q: "S'agit-il d'une assurance de dommages ou d'une assurance de sommes ?",
      cols: ['Assurance de dommages', 'Assurance de sommes'],
      rows: [
        "Assurance inventaire du ménage",
        "Assurance décès à capital fixe",
        "Assurance responsabilité civile privée",
        "Assurance accidents avec capital d'invalidité convenu",
        "Assurance casco d'un véhicule"
      ],
      answer: [0, 1, 0, 1, 0],
      explain: "L'assurance de dommages indemnise le préjudice effectivement établi et ne peut jamais enrichir l'assuré. L'assurance de sommes verse le montant convenu à la survenance de l'événement, sans égard au dommage réel — c'est pourquoi elle peut se cumuler avec d'autres prestations."
    }),
    fo({
      id: 'fo113', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, classification, sociale-privée',
      q: "Ces assurances relèvent-elles des assurances sociales ou des assurances privées ?",
      cols: ['Assurance sociale', 'Assurance privée'],
      rows: [
        "Assurance-maladie obligatoire (LAMal)",
        "Assurance complémentaire d'hospitalisation",
        "Assurance-accidents obligatoire (LAA)",
        "Assurance responsabilité civile véhicules à moteur",
        "Assurance-chômage"
      ],
      answer: [0, 1, 0, 1, 0],
      explain: "Le critère n'est pas le caractère obligatoire mais le régime juridique. La RC véhicules est obligatoire et pourtant privée : elle est régie par la LCA et la LCR, non par la LPGA. À l'inverse, une complémentaire d'hospitalisation est privée bien qu'elle prolonge une assurance sociale."
    }),
    fo({
      id: 'fo114', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, classification, obligation',
      q: "Laquelle de ces assurances n'est pas obligatoire en Suisse pour un particulier ?",
      choices: [
        "L'assurance responsabilité civile privée",
        "L'assurance-maladie de base",
        "L'assurance responsabilité civile pour un véhicule à moteur immatriculé",
        "L'assurance-accidents pour un salarié occupé au moins huit heures par semaine"
      ],
      answer: [0],
      explain: "La RC privée est fortement recommandée mais reste facultative — sauf exigence d'un bailleur ou d'un canton pour certaines activités. La LAMal, la RC véhicules (LCR) et la LAA sont, elles, obligatoires."
    }),

    /* — c5 : le marché suisse — */
    fo({
      id: 'fo115', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, marché suisse, distinction vie / non-vie',
      q: "Ces activités relèvent-elles de l'assurance vie ou de l'assurance non-vie ?",
      cols: ['Vie', 'Non-vie'],
      rows: [
        "Assurance mixte avec capital garanti à l'échéance",
        "Assurance perte d'exploitation d'une entreprise",
        "Assurance de rente viagère",
        "Assurance protection juridique"
      ],
      answer: [0, 1, 0, 1],
      explain: "L'assurance vie couvre les risques liés à la durée de la vie humaine — décès et longévité. Tout le reste, choses, patrimoine et accidents/maladie privés, forme le domaine non-vie, celui du profil Non-Vie de l'examen."
    }),
    fo({
      id: 'fo116', chap: 'c5', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, marché suisse, résultat',
      q: "Le résultat d'une entreprise d'assurance se compose principalement…",
      choices: [
        "… du résultat technique et du résultat des placements",
        "… uniquement de la différence entre primes encaissées et sinistres payés",
        "… du chiffre d'affaires réalisé par les intermédiaires",
        "… de la variation du nombre de contrats en portefeuille"
      ],
      answer: [0],
      explain: "Un assureur gagne de deux façons : sur l'activité d'assurance elle-même (primes moins sinistres et frais, mesurée par le ratio combiné) et sur le placement des primes encaissées à l'avance. Le résultat des placements peut compenser un résultat technique déficitaire, et inversement."
    }),

    /* — c6 : distribution et intermédiaires — */
    fo({
      id: 'fo117', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, intermédiaires, liés / non liés',
      q: "L'intermédiaire décrit est-il lié ou non lié ?",
      cols: ['Intermédiaire lié', 'Intermédiaire non lié'],
      rows: [
        "Conseiller salarié d'une compagnie, qui ne place que les produits de son employeur",
        "Courtier mandaté par le client pour comparer les offres de plusieurs assureurs",
        "Agent qui, par contrat d'agence exclusif, ne représente qu'un seul assureur",
        "Société de courtage rémunérée par honoraires du client, sans lien avec un assureur"
      ],
      answer: [0, 1, 0, 1],
      explain: "Le critère est le rapport de dépendance économique et le mandant. L'intermédiaire lié agit pour l'assureur ; le non lié agit pour le client et doit être inscrit au registre de la FINMA, avec RC professionnelle ou garanties financières."
    }),
    fo({
      id: 'fo118', chap: 'c6', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'IA, distribution, canaux',
      q: "Quels éléments caractérisent la vente directe (sans intermédiaire) ?",
      choices: [
        "Les coûts d'acquisition sont en règle générale plus bas.",
        "Le client effectue lui-même l'analyse de ses besoins.",
        "L'assureur garde la maîtrise complète de la relation client.",
        "Le conseil personnalisé y est généralement plus approfondi qu'en courtage."
      ],
      answer: [0, 1, 2],
      explain: "La vente directe — en ligne, par téléphone ou en agence propre — supprime la commission d'intermédiaire et laisse l'assureur maître de la relation, mais reporte l'analyse des besoins sur le client. C'est précisément la profondeur du conseil qui y est moindre."
    }),

    /* — c7 : réassurance — */
    fo({
      id: 'fo119', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, réassurance, formes',
      q: "S'agit-il d'une réassurance proportionnelle ou non proportionnelle ?",
      cols: ['Proportionnelle', 'Non proportionnelle'],
      rows: [
        "Quote-part : le réassureur prend un pourcentage fixe de chaque risque",
        "Excédent de sinistre (excess of loss) : le réassureur intervient au-delà d'une priorité",
        "Excédent de plein (surplus) : la cession dépend de la somme assurée de chaque risque",
        "Excédent de perte annuelle (stop loss) : le réassureur intervient au-delà d'un ratio de sinistralité"
      ],
      answer: [0, 1, 0, 1],
      explain: "En réassurance proportionnelle, primes et sinistres se partagent dans le même rapport — quote-part et excédent de plein. En réassurance non proportionnelle, le partage se fait selon le montant du sinistre ou le résultat de l'exercice, au-delà d'un seuil : excess of loss et stop loss."
    }),
    fo({
      id: 'fo120', chap: 'c7', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, réassurance, but',
      q: "Pourquoi un assureur direct conclut-il des traités de réassurance ?",
      choices: [
        "Pour limiter les pointes de sinistres et accroître sa capacité de souscription",
        "Pour transférer au réassureur ses obligations envers le preneur d'assurance",
        "Pour échapper à la surveillance de la FINMA",
        "Pour supprimer l'obligation de constituer des provisions techniques"
      ],
      answer: [0],
      explain: "La réassurance lisse les résultats, protège les fonds propres contre les sinistres majeurs et permet d'accepter des risques plus grands. Elle ne change rien envers le client : l'assureur direct reste seul débiteur de la prestation, et reste pleinement surveillé."
    }),

    /* — c8 : surveillance et solvabilité — */
    fo({
      id: 'fo121', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'IA, surveillance, compétences',
      q: "Les instruments de la surveillance : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "La FINMA approuve les tarifs de toutes les branches de l'assurance privée avant leur mise sur le marché.",
        "La FINMA peut retirer l'autorisation d'exercer à une entreprise d'assurance.",
        "Le SST mesure la solvabilité en confrontant le capital porteur de risque au capital cible.",
        "La fortune liée sert à garantir les prétentions découlant des contrats d'assurance."
      ],
      answer: [1, 0, 0, 0],
      explain: "L'approbation préalable des tarifs ne subsiste que dans des domaines particuliers, notamment l'assurance-maladie complémentaire ; ailleurs le marché est libre et le contrôle intervient a posteriori. Le retrait d'autorisation, le Swiss Solvency Test et la fortune liée sont bien des instruments de la surveillance."
    }),
    fo({
      id: 'fo122', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'IA, surveillance, but',
      q: "Quel est le but principal de la surveillance des assurances ?",
      choices: [
        "Protéger les assurés contre l'insolvabilité de l'assureur et les abus",
        "Garantir un bénéfice minimum aux entreprises d'assurance",
        "Fixer le montant des primes de l'ensemble du marché",
        "Représenter les intérêts de la branche auprès du Parlement"
      ],
      answer: [0],
      explain: "L'art. 1 LSA place la protection des assurés au centre : solvabilité de l'entreprise et prévention des abus. La défense des intérêts de la branche relève de l'ASA, association professionnelle, et non de l'autorité de surveillance."
    })
  );

  /* ═══════════════ Module 2 — Droit de l'assurance ═══════════════ */

  m2.questions.push(
    /* — c1 / c2 : bases du droit et contrat selon le CO — */
    fo({
      id: 'fo201', chap: 'c1', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, sources, droit public / droit privé',
      q: "Ces textes relèvent-ils du droit public ou du droit privé ?",
      cols: ['Droit public', 'Droit privé'],
      rows: [
        "Loi sur la surveillance des assurances (LSA)",
        "Loi sur le contrat d'assurance (LCA)",
        "Code des obligations (CO)",
        "Loi sur la circulation routière (LCR)"
      ],
      answer: [0, 1, 1, 0],
      explain: "Le critère est le rapport réglé : État–administré ou particulier–particulier. La LSA organise la surveillance de l'État sur les assureurs, la LCR régit l'usage du domaine public ; la LCA et le CO régissent des rapports entre parties privées."
    }),
    fo({
      id: 'fo202', chap: 'c2', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, conclusion du contrat',
      q: "Quelles conditions sont nécessaires à la conclusion valable d'un contrat selon le CO ?",
      choices: [
        "Un échange de manifestations de volonté réciproques et concordantes",
        "L'exercice des droits civils des deux parties",
        "Un objet licite et possible",
        "La forme écrite, dans tous les cas",
        "L'intervention d'un notaire"
      ],
      answer: [0, 1, 2],
      explain: "Accord des volontés, capacité de contracter et objet licite suffisent. Le principe est la liberté de la forme (art. 11 CO) : l'écrit et l'acte authentique ne sont exigés que si la loi ou les parties le prévoient."
    }),
    fo({
      id: 'fo203', chap: 'c2', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, CO, exercice des droits civils',
      q: "Ces personnes ont-elles l'exercice des droits civils ?",
      cols: ['Oui', 'Non'],
      rows: [
        "Une personne majeure et capable de discernement",
        "Un enfant de 12 ans",
        "Une personne majeure durablement privée de discernement",
        "Une personne de 19 ans sous curatelle de portée générale"
      ],
      answer: [0, 1, 1, 1],
      explain: "L'exercice des droits civils suppose la majorité et la capacité de discernement (art. 13 CC). L'enfant, la personne privée de discernement et la personne sous curatelle de portée générale ne l'ont pas : leurs engagements passent par un représentant légal."
    }),

    /* — c3 : LCA I, conclusion — */
    fo({
      id: 'fo204', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, délais de la conclusion',
      q: "Attribuez le délai correct à chaque situation.",
      cols: ['14 jours', '4 semaines', '5 ans'],
      rows: [
        "Délai pour révoquer le contrat d'assurance (art. 2a LCA)",
        "Délai pour résilier le contrat en cas de réticence (art. 6 LCA)",
        "Délai maximal pendant lequel la réticence peut être invoquée depuis la conclusion"
      ],
      answer: [0, 1, 2],
      explain: "Le droit de révocation s'exerce dans les 14 jours dès l'acceptation. La résiliation pour réticence doit intervenir dans les quatre semaines dès la connaissance du fait tu, et au plus tard cinq ans après la conclusion du contrat — sauf réticence liée au sinistre survenu."
    }),
    fo({
      id: 'fo205', chap: 'c3', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, réticence',
      ctx: "En remplissant sa proposition d'assurance complémentaire, Madame Jaquet omet de signaler un traitement médical suivi l'année précédente, dont elle se souvient parfaitement. L'assureur découvre le fait onze mois après la conclusion, à l'occasion d'un sinistre sans rapport avec ce traitement.",
      q: "Que peut faire l'assureur ?",
      choices: [
        "Résilier le contrat dans les quatre semaines dès la découverte, tout en devant la prestation pour ce sinistre",
        "Résilier le contrat et refuser toute prestation, quel que soit le sinistre",
        "Rien, le délai de cinq ans étant déterminant pour toute réticence",
        "Exiger uniquement une majoration de prime rétroactive"
      ],
      answer: [0],
      explain: "La réticence ouvre un droit de résiliation dans les quatre semaines dès sa découverte. Mais l'assureur n'est libéré de sa prestation que si le fait tu a influé sur la survenance ou l'étendue du sinistre : sans lien de causalité, la prestation reste due."
    }),
    fo({
      id: 'fo206', chap: 'c3', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, information précontractuelle',
      q: "L'information précontractuelle de l'art. 3 LCA : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "L'assureur doit informer le proposant avant la signature de la proposition (art. 3 LCA).",
        "L'information précontractuelle peut être remise sur un support durable, papier ou électronique.",
        "L'information doit porter notamment sur l'étendue de la couverture et sur les risques exclus.",
        "L'assureur peut se limiter à renvoyer le client vers son site internet, sans autre remise de document."
      ],
      answer: [0, 0, 0, 1],
      explain: "L'art. 3 LCA exige une information complète — identité de l'assureur, risques couverts et exclus, primes, obligations, traitement des données — remise avant la signature, sur papier ou sur un autre support durable. Un simple renvoi à un site ne satisfait pas cette exigence."
    }),
    fo({
      id: 'fo207', chap: 'c3', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, révocation',
      ctx: "Monsieur Perrin signe une proposition d'assurance ménage le 3 mars. L'assureur l'accepte et lui envoie la police, qu'il reçoit le 10 mars. Le 18 mars, il change d'avis et souhaite se dégager.",
      q: "Quelle est sa situation ?",
      choices: [
        "Il peut encore révoquer : le délai de 14 jours court dès la réception de la police",
        "Il ne peut plus rien faire : le contrat est définitivement conclu depuis le 3 mars",
        "Il peut résilier avec effet immédiat, sans motif, à tout moment",
        "Il doit attendre l'échéance annuelle pour résilier"
      ],
      answer: [0],
      explain: "Le droit de révocation de l'art. 2a LCA s'exerce dans les 14 jours dès que le preneur a connaissance de la conclusion — ici le 10 mars, ce qui laisse jusqu'au 24 mars. Aucun motif n'est requis, mais la déclaration doit être faite sous forme de texte."
    }),

    /* — c4 : LCA II, vie du contrat — */
    fo({
      id: 'fo208', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, droit de résiliation',
      q: "Qui dispose d'un droit de résiliation dans les situations suivantes ?",
      cols: ['Le preneur seulement', "L'assureur seulement", 'Les deux parties'],
      rows: [
        "Après le versement d'une prestation à la suite d'un sinistre partiel (art. 42 LCA)",
        "En cas d'adaptation de la prime par l'assureur en vertu d'une clause contractuelle (art. 35 LCA)",
        "En cas de réticence du proposant (art. 6 LCA)"
      ],
      answer: [2, 0, 1],
      explain: "Le sinistre partiel ouvre un droit de résiliation aux deux parties. L'adaptation de prime ne profite qu'au preneur, puisque c'est l'assureur qui l'a décidée. La réticence n'ouvre un droit qu'à l'assureur, seul lésé par l'information omise."
    }),
    fo({
      id: 'fo209', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, contrats de longue durée',
      q: "Un contrat d'assurance conclu pour une durée supérieure à trois ans peut être résilié…",
      choices: [
        "… pour la fin de la troisième année ou de chaque année suivante, moyennant un préavis de trois mois",
        "… uniquement à son échéance finale",
        "… à tout moment et avec effet immédiat",
        "… seulement si l'assureur y consent"
      ],
      answer: [0],
      explain: "L'art. 35a LCA rend impératif ce droit de sortie : au-delà de trois ans, le preneur — et l'assureur — peuvent mettre fin au contrat pour la fin de la troisième année ou de chaque année suivante, avec trois mois de préavis. Toute clause plus restrictive est nulle."
    }),
    fo({
      id: 'fo210', chap: 'c4', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, prime',
      q: "Le retard dans le paiement de la prime : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "En cas de retard, l'assureur doit sommer le preneur avant de suspendre la couverture.",
        "Le délai de la sommation est de 14 jours dès son envoi.",
        "La suspension de couverture prend effet dès l'échéance de la prime, sans autre formalité.",
        "Après la suspension, l'assureur peut se départir du contrat s'il ne poursuit pas le paiement dans les deux mois."
      ],
      answer: [0, 0, 1, 0],
      explain: "Art. 20 LCA : la suspension n'intervient jamais automatiquement, elle suppose une sommation écrite mentionnant ses conséquences et un délai de 14 jours dès l'envoi. À défaut de poursuite dans les deux mois qui suivent l'expiration du délai, l'assureur est réputé s'être départi du contrat."
    }),
    fo({
      id: 'fo211', chap: 'c4', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, changement de propriétaire',
      ctx: "Madame Roth vend sa maison. Une assurance bâtiment court encore neuf mois auprès d'un assureur privé.",
      q: "Qu'advient-il du contrat d'assurance ?",
      choices: [
        "Il passe à l'acquéreur, qui peut le refuser ; l'assureur peut également le résilier",
        "Il s'éteint automatiquement le jour de la vente",
        "Il reste au nom de la venderesse jusqu'à l'échéance",
        "Il ne peut être transféré qu'avec l'accord écrit de la FINMA"
      ],
      answer: [0],
      explain: "Art. 54 LCA : en cas de changement de propriétaire, les droits et obligations passent de plein droit à l'acquéreur, qui dispose de 30 jours pour refuser le transfert ; l'assureur, lui, peut résilier dans les 14 jours dès qu'il a connaissance du changement."
    }),

    /* — c5 : LCA III, sinistre et prestations — */
    fo({
      id: 'fo212', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, obligations en cas de sinistre',
      q: "Attribuez chaque comportement à l'obligation concernée.",
      cols: ['Avis du sinistre', 'Obligation de réduire le dommage', 'Obligation de renseigner'],
      rows: [
        "L'assuré annonce le dégât d'eau à son assureur dès qu'il le constate.",
        "L'assuré ferme la vanne principale pour arrêter l'écoulement.",
        "L'assuré transmet à l'assureur les factures et le rapport du plombier."
      ],
      answer: [0, 1, 2],
      explain: "Trois obligations distinctes se déclenchent au sinistre : annoncer sans délai (art. 38 LCA), prendre les mesures propres à limiter le dommage (art. 61 LCA) et fournir les renseignements et pièces permettant d'établir la prétention (art. 39 LCA)."
    }),
    fo({
      id: 'fo213', chap: 'c5', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LCA, exigibilité de la prestation',
      q: "Dans quel délai la prestation de l'assureur devient-elle exigible ?",
      choices: [
        "Quatre semaines après réception des renseignements permettant d'établir le bien-fondé de la prétention",
        "Immédiatement à l'annonce du sinistre",
        "Deux ans après le sinistre",
        "À la fin de l'année d'assurance en cours"
      ],
      answer: [0],
      explain: "Art. 41 LCA : la créance devient exigible quatre semaines après le moment où l'assureur a reçu les renseignements lui permettant de se convaincre du bien-fondé de la prétention. Le simple avis de sinistre ne suffit donc pas à faire courir le délai."
    }),
    fo({
      id: 'fo214', chap: 'c5', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, prescription',
      q: "La prescription des créances d'assurance : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Les créances découlant du contrat d'assurance se prescrivent par cinq ans.",
        "Le délai court dès la survenance du fait d'où naît l'obligation.",
        "Le délai de prescription est de deux ans, comme sous l'ancien droit.",
        "Une clause du contrat peut raccourcir ce délai au détriment du preneur."
      ],
      answer: [0, 0, 1, 1],
      explain: "Depuis la révision entrée en vigueur en 2022, l'art. 46 LCA fixe la prescription à cinq ans dès le fait d'où naît l'obligation — contre deux ans auparavant. La disposition est semi-impérative : on ne peut pas y déroger au détriment du preneur."
    }),

    /* — c6 : sous-assurance, surassurance, subrogation — */
    fo({
      id: 'fo215', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, sous-assurance et surassurance',
      q: "Attribuez chaque situation à la qualification correcte.",
      cols: ['Sous-assurance', 'Surassurance', 'Assurance à la valeur totale'],
      rows: [
        "Somme assurée CHF 60 000 pour un inventaire valant CHF 100 000",
        "Somme assurée CHF 150 000 pour un inventaire valant CHF 100 000",
        "Somme assurée CHF 100 000 pour un inventaire valant CHF 100 000"
      ],
      answer: [0, 1, 2],
      explain: "Quand la somme assurée est inférieure à la valeur de remplacement, la règle proportionnelle s'applique et l'indemnité est réduite dans le rapport somme/valeur. Quand elle est supérieure, l'excédent est sans effet : l'indemnité reste plafonnée au dommage effectif, sans enrichissement."
    }),
    fo({
      id: 'fo216', chap: 'c6', type: 'single', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, règle proportionnelle',
      ctx: "L'inventaire du ménage de Monsieur Blanc vaut CHF 120 000. Sa police mentionne une somme d'assurance de CHF 90 000. Un incendie détruit pour CHF 40 000 de biens.",
      q: "Quelle indemnité l'assureur verse-t-il, sans franchise ?",
      choices: ["CHF 30 000", "CHF 40 000", "CHF 90 000", "CHF 10 000"],
      answer: [0],
      explain: "Il y a sous-assurance : 90 000 / 120 000 = 75 %. La règle proportionnelle de l'art. 69 LCA ramène l'indemnité à 40 000 × 75 % = CHF 30 000. Le preneur supporte lui-même le quart restant, en contrepartie de la prime moindre qu'il a payée."
    }),
    fo({
      id: 'fo217', chap: 'c6', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LCA, subrogation',
      q: "La subrogation de l'assureur : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "L'assureur qui indemnise est subrogé aux droits de l'assuré contre le tiers responsable.",
        "La subrogation est limitée au montant de l'indemnité versée.",
        "La subrogation joue aussi bien en assurance de dommages qu'en assurance de sommes.",
        "L'assuré ne doit rien entreprendre qui compromette le recours de l'assureur."
      ],
      answer: [0, 0, 1, 0],
      explain: "La subrogation évite que l'assuré cumule indemnité et dommages-intérêts : elle transfère à l'assureur, jusqu'à concurrence de ce qu'il a payé, les prétentions contre le responsable. Elle est propre à l'assurance de dommages ; en assurance de sommes, la prestation se cumule librement avec toute autre indemnisation."
    }),

    /* — c7 : responsabilité civile — */
    fo({
      id: 'fo218', chap: 'c7', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, causale ou pour faute',
      q: "Ces cas de responsabilité reposent-ils sur une faute ou sont-ils causals ?",
      cols: ['Responsabilité pour faute', 'Responsabilité causale'],
      rows: [
        "Responsabilité générale de l'art. 41 CO",
        "Responsabilité du détenteur de véhicule automobile (LCR)",
        "Responsabilité du propriétaire d'ouvrage (art. 58 CO)",
        "Responsabilité du détenteur d'animal (art. 56 CO)"
      ],
      answer: [0, 1, 1, 0],
      explain: "L'art. 41 CO exige une faute. Le détenteur de véhicule et le propriétaire d'ouvrage répondent sans faute, du seul fait de leur position — responsabilité causale aggravée pour le premier, simple pour le second. Le détenteur d'animal, lui, peut se libérer en prouvant qu'il a pris tous les soins commandés : c'est une responsabilité pour faute présumée."
    }),
    fo({
      id: 'fo219', chap: 'c7', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, RC, conditions',
      q: "Quelles conditions doivent être réunies pour engager la responsabilité civile selon l'art. 41 CO ?",
      choices: [
        "Un dommage",
        "Un acte illicite",
        "Un lien de causalité entre l'acte et le dommage",
        "Une faute de l'auteur",
        "Une plainte pénale préalable de la victime"
      ],
      answer: [0, 1, 2, 3],
      explain: "Dommage, illicéité, causalité adéquate et faute : les quatre conditions cumulatives de la responsabilité aquilienne. La procédure pénale est indépendante — on peut être responsable civilement sans qu'aucune plainte pénale n'ait été déposée."
    }),
    fo({
      id: 'fo220', chap: 'c7', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, RC, faute concomitante',
      ctx: "Un piéton traverse hors du passage, en dehors de toute visibilité. Un automobiliste, qui roulait légèrement trop vite, le renverse. Le dommage s'élève à CHF 20 000 et le juge retient une faute concomitante de la victime à hauteur de 40 %.",
      q: "Quel montant l'automobiliste doit-il en principe réparer ?",
      choices: ["CHF 12 000", "CHF 20 000", "CHF 8 000", "Rien, la faute de la victime interrompant le lien de causalité"],
      answer: [0],
      explain: "La faute concomitante réduit l'indemnité sans la supprimer, sauf si elle est si lourde qu'elle rompt le lien de causalité adéquate. Ici la réduction de 40 % ramène la réparation à CHF 12 000."
    }),

    /* — c8 : LSA, LPD, LBA — */
    fo({
      id: 'fo221', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, lois, champ de compétence',
      q: "Quelle loi règle chacun de ces objets ?",
      cols: ['LSA', 'LCA', 'LPD'],
      rows: [
        "L'autorisation d'exercer délivrée à une entreprise d'assurance",
        "Le droit de révoquer le contrat dans les 14 jours",
        "Le droit d'accès de la personne concernée à ses données",
        "L'obligation d'information de l'intermédiaire lors du premier contact"
      ],
      answer: [0, 1, 2, 0],
      explain: "Deux réflexes suffisent : tout ce qui concerne l'autorisation, la surveillance et le statut de l'intermédiaire relève de la LSA ; tout ce qui concerne le contenu du contrat relève de la LCA. La LPD s'ajoute pour le traitement des données personnelles."
    }),
    fo({
      id: 'fo222', chap: 'c8', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LPD, principes',
      q: "Les principes de la protection des données : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "Les données sur la santé sont des données personnelles sensibles.",
        "Le principe de proportionnalité interdit de collecter plus de données que nécessaire.",
        "Une donnée collectée pour un but donné peut librement être utilisée à d'autres fins.",
        "La personne concernée peut demander la rectification de données inexactes."
      ],
      answer: [0, 0, 1, 0],
      explain: "Santé, opinions religieuses ou politiques, données biométriques et poursuites pénales sont des données sensibles, soumises à des exigences renforcées. Le principe de finalité interdit le détournement d'usage : un changement de but exige une nouvelle base légale, un consentement ou un intérêt prépondérant."
    }),
    fo({
      id: 'fo223', chap: 'c8', type: 'multi', pts: 2, cx: 'Moyenne',
      theme: 'Droit, LBA, obligations',
      q: "Quelles obligations la LBA impose-t-elle à un intermédiaire financier ?",
      choices: [
        "Vérifier l'identité du cocontractant",
        "Identifier l'ayant droit économique",
        "Communiquer au Bureau de communication en cas de soupçon fondé",
        "Conserver les documents pendant dix ans",
        "Refuser toute relation d'affaires avec un client domicilié à l'étranger"
      ],
      answer: [0, 1, 2, 3],
      explain: "Identification du cocontractant et de l'ayant droit économique, clarification en cas de risque accru, communication au MROS et conservation des pièces dix ans forment le socle de la LBA. Le domicile à l'étranger n'est pas en soi un motif de refus : il peut simplement justifier une vigilance renforcée."
    }),
    fo({
      id: 'fo224', chap: 'c8', type: 'single', pts: 1, cx: 'Simple',
      theme: 'Droit, LBA, assurance concernée',
      q: "Quelle activité d'assurance est soumise à la LBA ?",
      choices: [
        "L'assurance-vie avec composante d'épargne",
        "L'assurance responsabilité civile privée",
        "L'assurance ménage",
        "L'assurance protection juridique"
      ],
      answer: [0],
      explain: "La LBA vise les intermédiaires financiers : en assurance, ce sont les assureurs vie exploitant l'assurance-vie directe ou proposant des parts de placements collectifs, parce que ces produits permettent de placer des fonds. Les branches non-vie pures n'y sont pas soumises."
    }),

    /* — c9 : conciliation et juridiction — */
    fo({
      id: 'fo225', chap: 'c9', type: 'grid', pts: 2, cx: 'Moyenne',
      theme: 'Droit, litige, voies de droit',
      q: "Le règlement des litiges en assurance : ces affirmations sont-elles vraies ou fausses ?",
      cols: VF,
      rows: [
        "La procédure devant l'ombudsman de l'assurance privée est gratuite pour le client.",
        "La décision de l'ombudsman lie juridiquement l'assureur.",
        "Le preneur d'assurance peut agir au for de son domicile.",
        "La FINMA tranche les litiges individuels entre un assuré et son assureur."
      ],
      answer: [0, 1, 0, 1],
      explain: "L'ombudsman est un organe de médiation gratuit dont les recommandations n'ont pas force obligatoire. Le preneur peut porter l'action au siège de l'assureur ou à son propre domicile. La FINMA surveille les entreprises mais ne rend jamais de décision sur un cas individuel."
    })
  );
})();
