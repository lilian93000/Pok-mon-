/* =============================================================
   AFA – Module 1 : Industrie de l'assurance
   Fiches de cours + banque de questions
   ============================================================= */
(function () {
  const M = {
    id: 'm1',
    code: 'Module 1',
    title: "Industrie de l'assurance",
    subtitle: "Risque, principes techniques, marché suisse, acteurs et surveillance",
    parcours: "Lancement · Base",
    icon: '🏛️',
    color: 'blue',
    chapters: [],
    questions: []
  };

  /* ---------------------------------------------------------
     CHAPITRES DE COURS
     --------------------------------------------------------- */
  M.chapters = [
    {
      id: 'c1',
      title: 'Risque et gestion des risques',
      resume: "Ce qu'est un risque, comment on le classe, comment une entreprise le traite et à quelles conditions il devient assurable.",
      sections: [
        {
          h: "Définition du risque",
          html: `<p>Le <b>risque</b> est la possibilité qu'un événement futur et <b>incertain</b> survienne et cause un <b>dommage</b>. Trois composantes le caractérisent&nbsp;:</p>
          <ul>
            <li><b>La probabilité de survenance</b> (fréquence) — combien de fois l'événement se produit&nbsp;;</li>
            <li><b>L'ampleur du dommage</b> (intensité, sinistre maximal possible)&nbsp;;</li>
            <li><b>L'aléa</b> — on ne sait ni si, ni quand, ni pour combien.</li>
          </ul>
          <p>On distingue le <b>risque pur</b> (il ne peut produire qu'une perte&nbsp;: incendie, accident, décès) du <b>risque spéculatif</b> (il peut produire une perte <i>ou</i> un gain&nbsp;: placement boursier, lancement d'un produit). <b>Seul le risque pur est assurable.</b></p>`
        },
        {
          h: "Les catégories de risques",
          html: `<ul>
            <li><b>Risques de personnes</b>&nbsp;: décès, invalidité, maladie, accident, vieillesse (longévité).</li>
            <li><b>Risques de choses</b>&nbsp;: incendie, dégâts d'eau, vol, bris de glace, événements naturels.</li>
            <li><b>Risques de patrimoine</b>&nbsp;: responsabilité civile, perte d'exploitation, protection juridique, crédit et caution.</li>
          </ul>
          <p>Autres axes de classement&nbsp;: risques <b>individuels</b> / <b>de masse</b> / <b>de cumul</b> (une tempête touche des milliers de contrats en même temps), risques <b>statiques</b> / <b>dynamiques</b>, risques <b>subjectifs</b> (comportement de l'assuré) / <b>objectifs</b>.</p>`
        },
        {
          h: "Le processus de gestion des risques (risk management)",
          html: `<ol>
            <li><b>Identification</b> des risques (inventaire, analyse des processus).</li>
            <li><b>Analyse / évaluation</b>&nbsp;: fréquence × intensité, matrice des risques.</li>
            <li><b>Traitement</b>, selon quatre stratégies&nbsp;:
              <ul>
                <li><b>Éviter</b> le risque (renoncer à l'activité)&nbsp;;</li>
                <li><b>Réduire / prévenir</b> (sprinkler, formation, alarme, mesures de protection)&nbsp;;</li>
                <li><b>Transférer</b> (assurance, contrat, sous-traitance)&nbsp;;</li>
                <li><b>Assumer / supporter</b> soi-même (franchise, auto-assurance, provisions).</li>
              </ul>
            </li>
            <li><b>Contrôle et suivi</b>&nbsp;: le processus est un cycle, il se répète.</li>
          </ol>
          <p class="tip">Règle pratique&nbsp;: on <b>assure</b> les risques rares mais lourds (faible fréquence, forte intensité). Les risques fréquents mais légers se <b>préviennent</b> ou s'<b>assument</b> (franchise).</p>`
        },
        {
          h: "Les conditions d'assurabilité",
          html: `<p>Pour qu'un risque puisse être assuré par une compagnie privée, il doit être&nbsp;:</p>
          <ul>
            <li><b>Aléatoire</b> — l'événement est incertain et indépendant de la volonté de l'assuré&nbsp;;</li>
            <li><b>Mesurable / estimable</b> — on peut évaluer la probabilité et le montant (statistiques)&nbsp;;</li>
            <li><b>Homogène et suffisamment fréquent</b> — assez de risques semblables pour former une communauté&nbsp;;</li>
            <li><b>Indépendant</b> — pas de cumul incontrôlable frappant tout le portefeuille en même temps&nbsp;;</li>
            <li><b>Économiquement supportable</b> — la prime reste payable et l'engagement reste finançable&nbsp;;</li>
            <li><b>Licite</b> — conforme à l'ordre juridique et aux mœurs (on n'assure pas une amende pénale ni un acte intentionnel).</li>
          </ul>`
        }
      ],
      keypoints: [
        "Risque = probabilité + ampleur + aléa.",
        "Seul le risque PUR est assurable ; le risque spéculatif ne l'est pas.",
        "4 stratégies de traitement : éviter, réduire, transférer, assumer.",
        "Assurabilité : aléatoire, mesurable, homogène, indépendant, supportable, licite.",
        "Le dessein (acte intentionnel) n'est jamais assurable."
      ]
    },

    {
      id: 'c2',
      title: "Principes techniques de l'assurance",
      resume: "Mutualité, loi des grands nombres, composition de la prime, provisions techniques et rôle de l'actuaire.",
      sections: [
        {
          h: "Mutualité et loi des grands nombres",
          html: `<p>L'assurance repose sur la <b>mutualité</b>&nbsp;: un grand nombre de personnes exposées au <b>même risque</b> versent chacune une contribution modeste (la prime) dans une caisse commune, qui indemnise les quelques-unes réellement touchées. C'est le principe <i>«&nbsp;les nombreux paient pour les rares&nbsp;»</i>.</p>
          <p>La <b>loi des grands nombres</b> (statistique) affirme que plus le nombre de cas observés est élevé, plus le résultat réel se rapproche de la probabilité théorique. C'est ce qui rend le risque <b>calculable</b> pour l'assureur alors qu'il reste imprévisible pour l'individu.</p>
          <p>La <b>compensation des risques</b> s'opère&nbsp;:</p>
          <ul>
            <li><b>dans l'espace</b> (grand nombre de contrats, régions différentes)&nbsp;;</li>
            <li><b>dans le temps</b> (bonnes et mauvaises années se compensent, d'où les provisions)&nbsp;;</li>
            <li><b>par la réassurance</b> (partage avec d'autres porteurs de risque).</li>
          </ul>`
        },
        {
          h: "La composition de la prime",
          html: `<table class="tbl">
            <tr><th>Élément</th><th>Contenu</th></tr>
            <tr><td><b>Prime de risque</b> (prime nette)</td><td>Fréquence × coût moyen des sinistres&nbsp;: le coût pur du risque.</td></tr>
            <tr><td>+ <b>Supplément de sécurité</b></td><td>Marge pour les écarts défavorables par rapport aux statistiques.</td></tr>
            <tr><td>+ <b>Chargements de frais</b></td><td>Frais d'acquisition (commissions, publicité), frais de gestion, frais de sinistres.</td></tr>
            <tr><td>+ <b>Marge bénéficiaire</b></td><td>Rémunération du capital.</td></tr>
            <tr><td>= <b>Prime commerciale (brute)</b></td><td>La prime tarifaire.</td></tr>
            <tr><td>+ <b>Taxes et frais accessoires</b></td><td>Droit de timbre, contributions légales (p.&nbsp;ex. prévention des accidents), frais de police.</td></tr>
            <tr><td>= <b>Prime encaissée</b></td><td>Le montant réellement facturé au preneur.</td></tr>
          </table>
          <p>En assurance-vie, la prime comprend en plus une <b>partie épargne</b> qui alimente la réserve mathématique.</p>`
        },
        {
          h: "Droit de timbre sur les primes",
          html: `<p>La Confédération prélève un <b>droit de timbre</b> sur les primes d'assurance&nbsp;:</p>
          <ul>
            <li><b>5&nbsp;%</b> pour la plupart des assurances de choses et de patrimoine (RC, ménage, véhicules, etc.)&nbsp;;</li>
            <li><b>2,5&nbsp;%</b> pour les assurances-vie susceptibles de rachat financées par <b>prime unique</b>.</li>
          </ul>
          <p>Sont <b>exonérées</b>&nbsp;: l'assurance-vie à primes périodiques, l'assurance-maladie et accidents, l'assurance-chômage, l'assurance grêle et bétail, la réassurance, ainsi que les assurances de la prévoyance professionnelle.</p>`
        },
        {
          h: "Tarification, sélection et provisions",
          html: `<p>La <b>tarification</b> répartit les assurés en classes de risque homogènes selon des critères objectifs (âge, région, type de véhicule, mode de construction, degré de bonus). Une tarification trop grossière provoque l'<b>antisélection</b>&nbsp;: les bons risques partent, les mauvais restent, la sinistralité explose.</p>
          <p>Les <b>provisions techniques</b> sont les engagements de l'assureur envers les assurés inscrits au passif du bilan&nbsp;:</p>
          <ul>
            <li><b>Provision pour primes non acquises</b> (report de primes) — part de prime concernant l'exercice suivant&nbsp;;</li>
            <li><b>Provision pour sinistres</b> — sinistres survenus, déclarés ou non encore déclarés (IBNR), pas encore réglés&nbsp;;</li>
            <li><b>Réserve mathématique</b> — engagements de l'assurance-vie&nbsp;;</li>
            <li><b>Provision pour fluctuation / sécurité</b> — amortit les mauvaises années.</li>
          </ul>
          <p>Le <b>ratio combiné</b> (combined ratio) = charge des sinistres + frais, rapportés aux primes. En dessous de 100&nbsp;%, l'activité d'assurance proprement dite est bénéficiaire.</p>`
        }
      ],
      keypoints: [
        "Mutualité : les primes des nombreux financent les sinistres des rares.",
        "Loi des grands nombres : plus il y a de cas, plus le réel colle à la théorie.",
        "Prime de risque + sécurité + frais + bénéfice = prime commerciale ; + taxes = prime encaissée.",
        "Droit de timbre : 5 % choses/patrimoine, 2,5 % vie à prime unique susceptible de rachat.",
        "Combined ratio < 100 % = activité d'assurance rentable."
      ]
    },

    {
      id: 'c3',
      title: 'Le système suisse des trois piliers',
      resume: "Prévoyance vieillesse, survivants et invalidité : AVS/AI, LPP, prévoyance individuelle, et les autres assurances sociales.",
      sections: [
        {
          h: "L'architecture des trois piliers (art. 111 Cst.)",
          html: `<table class="tbl">
            <tr><th></th><th>1<sup>er</sup> pilier</th><th>2<sup>e</sup> pilier</th><th>3<sup>e</sup> pilier</th></tr>
            <tr><td><b>But</b></td><td>Couvrir les <b>besoins vitaux</b></td><td>Maintenir le <b>niveau de vie habituel</b> (env. 60&nbsp;% du dernier salaire avec le 1<sup>er</sup>)</td><td>Combler les <b>lacunes</b>, besoins individuels</td></tr>
            <tr><td><b>Contenu</b></td><td>AVS / AI / APG + <b>PC</b></td><td>LPP (caisse de pension) + LAA</td><td>3a lié / 3b libre</td></tr>
            <tr><td><b>Caractère</b></td><td>Obligatoire</td><td>Obligatoire pour les salariés (conditions)</td><td>Facultatif</td></tr>
            <tr><td><b>Financement</b></td><td><b>Répartition</b> (les actifs paient les rentes courantes)</td><td><b>Capitalisation</b> (chacun épargne son capital)</td><td>Capitalisation individuelle</td></tr>
          </table>`
        },
        {
          h: "1er pilier : AVS / AI / APG",
          html: `<p>Obligatoire pour <b>toute personne domiciliée ou exerçant une activité lucrative en Suisse</b>. Cotisation dès le 1<sup>er</sup> janvier suivant les 17&nbsp;ans pour les salariés, dès 20&nbsp;ans pour les personnes sans activité lucrative.</p>
          <ul>
            <li>Cotisation AVS/AI/APG&nbsp;: <b>10,6&nbsp;%</b> du salaire, partagée à parts égales employeur/employé (5,3&nbsp;% chacun). Sans plafond de salaire.</li>
            <li>Rente de vieillesse (valeurs&nbsp;2026)&nbsp;: <b>minimale CHF 1&nbsp;260.–</b>, <b>maximale CHF 2&nbsp;520.–</b> par mois. Plafond pour un couple&nbsp;: <b>150&nbsp;%</b> de la rente maximale, soit CHF 3&nbsp;780.–.</li>
            <li>La rente complète suppose une <b>durée de cotisation complète</b>&nbsp;; chaque année manquante réduit la rente d'env. 1/44<sup>e</sup>.</li>
            <li>Bonifications pour <b>tâches éducatives</b> et pour <b>tâches d'assistance</b>&nbsp;; <b>splitting</b> des revenus entre conjoints.</li>
            <li>Les <b>prestations complémentaires (PC)</b> interviennent lorsque la rente ne couvre pas le minimum vital.</li>
          </ul>`
        },
        {
          h: "2e pilier : LPP",
          html: `<p>Assujettissement obligatoire du salarié dès qu'il touche plus que le <b>seuil d'entrée</b> auprès d'un employeur et qu'il est déjà assuré à l'AVS&nbsp;: dès 17&nbsp;ans pour les <b>risques décès et invalidité</b>, dès 24&nbsp;ans (25&nbsp;ans révolus) pour l'<b>épargne vieillesse</b>.</p>
          <p>Valeurs de référence&nbsp;2026&nbsp;:</p>
          <ul>
            <li>Seuil d'entrée&nbsp;: <b>CHF 22&nbsp;680.–</b></li>
            <li>Déduction de coordination&nbsp;: <b>CHF 26&nbsp;460.–</b></li>
            <li>Salaire coordonné&nbsp;: minimum CHF 3&nbsp;780.–, maximum CHF 64&nbsp;260.–</li>
            <li>Salaire LPP maximal assurable&nbsp;: <b>CHF 90&nbsp;720.–</b></li>
          </ul>
          <p>Bonifications de vieillesse&nbsp;: 7&nbsp;% (25–34&nbsp;ans), 10&nbsp;% (35–44), 15&nbsp;% (45–54), 18&nbsp;% (55 à l'âge de référence). L'employeur paie <b>au moins la moitié</b> des cotisations. Le <b>taux de conversion</b> minimal LPP est de <b>6,8&nbsp;%</b>. Encouragement à la propriété du logement (EPL) et libre passage sont réglés par la LFLP/LEPL.</p>`
        },
        {
          h: "3e pilier",
          html: `<ul>
            <li><b>Pilier 3a (lié)</b>&nbsp;: réservé aux personnes exerçant une activité lucrative, fiscalement déductible. Maximum&nbsp;2026&nbsp;: <b>CHF 7&nbsp;258.–</b> avec caisse de pension, <b>20&nbsp;% du revenu, au maximum CHF 36&nbsp;288.–</b> sans caisse de pension. Retrait anticipé seulement dans des cas légaux (logement, départ à l'étranger, indépendance, invalidité, rachat LPP), au plus tôt 5&nbsp;ans avant l'âge de référence.</li>
            <li><b>Pilier 3b (libre)</b>&nbsp;: épargne libre (assurance-vie, titres, immobilier), pas de déduction fiscale (sauf déductions cantonales limitées pour primes), liberté de désignation du bénéficiaire et de disposition.</li>
          </ul>`
        },
        {
          h: "Les réformes récentes à connaître (2024–2026)",
          html: `<p>Le programme d'examen suit l'actualité législative. Quatre dossiers dominent la période&nbsp;:</p>
          <ul>
            <li><b>13<sup>e</sup> rente AVS</b>&nbsp;— l'initiative acceptée en votation est mise en œuvre&nbsp;: un <b>supplément annuel</b> correspondant à <b>un douzième de la rente de vieillesse annuelle</b> est versé avec la rente de <b>décembre</b>, pour la <b>première fois en décembre 2026</b>. Le versement est <b>automatique</b> pour toute personne ayant droit à une rente de <b>vieillesse</b> en décembre&nbsp;; il est effectué par les caisses de compensation.</li>
            <li><b>AVS 21</b>&nbsp;— acceptée le 25 septembre 2022, en vigueur depuis le <b>1<sup>er</sup> janvier 2024</b>. L'<b>âge de référence des femmes</b> passe de 64 à 65&nbsp;ans par étapes de trois mois dès le 1<sup>er</sup> janvier 2025. En <b>2026</b>, il s'établit à <b>64&nbsp;ans et 6&nbsp;mois</b> (femmes nées en 1962). La réforme a aussi flexibilisé la retraite entre 63 et 70&nbsp;ans.</li>
            <li><b>Réforme LPP&nbsp;: rejetée</b>&nbsp;— le <b>22 septembre 2024</b>, le peuple a refusé la réforme par <b>67,1&nbsp;%</b> de non. Elle prévoyait notamment d'abaisser le taux de conversion minimal de 6,8&nbsp;% à 6&nbsp;%. Conséquence directe&nbsp;: le <b>taux de conversion minimal reste à 6,8&nbsp;%</b> et la déduction de coordination n'est pas modifiée.</li>
            <li><b>EFAS</b> (financement uniforme des prestations)&nbsp;— modification de la <b>LAMal</b> acceptée le <b>24 novembre 2024</b> par <b>53,3&nbsp;%</b> des voix. Elle unifie le financement des prestations ambulatoires et stationnaires entre cantons et assureurs&nbsp;; sa mise en œuvre est échelonnée sur les années suivantes.</li>
          </ul>
          <p class="tip">Piège classique&nbsp;: on confond volontiers «&nbsp;réforme acceptée&nbsp;» et «&nbsp;réforme en vigueur&nbsp;». AVS&nbsp;21 est <b>en vigueur</b>, EFAS est <b>acceptée mais déployée progressivement</b>, la réforme LPP a été <b>refusée</b>.</p>`
        },
        {
          h: "Les autres assurances sociales",
          html: `<ul>
            <li><b>LAMal</b>&nbsp;: obligation de s'assurer dans les <b>3&nbsp;mois</b> suivant la prise de domicile ou la naissance (effet rétroactif). Franchise ordinaire adulte CHF 300.– à 2&nbsp;500.–, quote-part 10&nbsp;% (max. CHF 700.–/an adulte, 350.– enfant).</li>
            <li><b>LAA</b>&nbsp;: obligatoire pour tous les salariés. Accidents professionnels dès le 1<sup>er</sup> jour&nbsp;; accidents <b>non</b> professionnels dès <b>8&nbsp;heures</b> de travail par semaine. Prime ATNP à la charge du salarié en principe. Indemnité journalière&nbsp;: <b>80&nbsp;%</b> du gain assuré dès le 3<sup>e</sup> jour. Gain assuré maximum&nbsp;: <b>CHF 148&nbsp;200.–</b> par an.</li>
            <li><b>AC (chômage)</b>&nbsp;: 2,2&nbsp;% du salaire jusqu'à CHF 148&nbsp;200.–, moitié employeur / moitié employé.</li>
            <li><b>APG / maternité</b>&nbsp;: 80&nbsp;% du revenu, 14&nbsp;semaines pour la mère, 2&nbsp;semaines pour l'autre parent.</li>
            <li><b>Allocations familiales (LAFam)</b>&nbsp;: au moins CHF 200.–/mois par enfant et CHF 250.– pour un jeune en formation.</li>
          </ul>
          <p class="tip">Valeurs indiquées à titre indicatif&nbsp;(2026)&nbsp;; elles sont adaptées périodiquement&nbsp;— vérifiez toujours les chiffres de l'année d'examen.</p>`
        }
      ],
      keypoints: [
        "1er pilier = besoins vitaux, répartition ; 2e = niveau de vie, capitalisation ; 3e = individuel.",
        "AVS/AI/APG : 10,6 % du salaire, sans plafond, moitié employeur.",
        "Rente AVS 2026 : min. 1 260.–, max. 2 520.–, couple plafonné à 3 780.–.",
        "LPP : dès 17 ans risques, dès 25 ans épargne ; taux de conversion minimal 6,8 %.",
        "LAA : ATNP dès 8 h/semaine, IJ 80 % dès le 3e jour, gain max 148 200.–.",
        "13e rente AVS : 1/12 de la rente annuelle, versée avec celle de décembre, dès décembre 2026.",
        "AVS 21 en vigueur depuis 2024 ; âge de référence des femmes à 64 ans et 6 mois en 2026.",
        "Réforme LPP refusée le 22.09.2024 (67,1 % de non) : le taux de conversion reste à 6,8 %.",
        "EFAS accepté le 24.11.2024 (53,3 %) : financement uniforme des prestations LAMal."
      ]
    },

    {
      id: 'c4',
      title: "Les branches d'assurance",
      resume: "Comment se classent les produits : personnes, choses, patrimoine ; assurance de dommages et assurance de sommes.",
      sections: [
        {
          h: "Assurance de dommages vs assurance de sommes",
          html: `<table class="tbl">
            <tr><th></th><th>Assurance de dommages</th><th>Assurance de sommes</th></tr>
            <tr><td><b>Prestation</b></td><td>Indemnise le dommage <b>effectivement subi</b></td><td>Verse la <b>somme convenue</b>, indépendamment du dommage</td></tr>
            <tr><td><b>Principe</b></td><td>Principe <b>indemnitaire</b>&nbsp;: pas d'enrichissement</td><td>Pas de principe indemnitaire</td></tr>
            <tr><td><b>Cumul</b></td><td>Non&nbsp;: surindemnisation exclue</td><td>Oui&nbsp;: cumulable avec d'autres prestations</td></tr>
            <tr><td><b>Subrogation</b></td><td>Oui, l'assureur peut se retourner contre le responsable</td><td>Non</td></tr>
            <tr><td><b>Exemples</b></td><td>Ménage, RC, casco, perte d'exploitation</td><td>Assurance-vie décès/capital, capital invalidité par accident</td></tr>
          </table>`
        },
        {
          h: "Assurances de personnes",
          html: `<ul>
            <li><b>Vie</b>&nbsp;: risque pur (décès temporaire), mixte (capital décès et vie), rente viagère, assurance liée à des parts de fonds (unit linked).</li>
            <li><b>Maladie</b>&nbsp;: assurance de base LAMal (droit des assurances sociales) et <b>complémentaires LCA</b> (hospitalisation demi-privée/privée, médecine alternative, dentaire).</li>
            <li><b>Accidents</b>&nbsp;: LAA obligatoire pour les salariés, LAA complémentaire, assurance-accidents individuelle pour les non-salariés.</li>
            <li><b>Indemnités journalières maladie</b> (IJM, LCA la plupart du temps).</li>
          </ul>`
        },
        {
          h: "Assurances de choses",
          html: `<ul>
            <li><b>Inventaire du ménage</b>&nbsp;: incendie, dégâts d'eau, vol (avec ou sans vol simple à l'extérieur), bris de glace, dommages naturels.</li>
            <li><b>Bâtiment</b>&nbsp;: dans 19&nbsp;cantons, l'assurance incendie et dommages naturels du bâtiment est confiée à un <b>établissement cantonal monopolistique (ECA)</b>&nbsp;; dans les cantons dits <i>GUSTAVO</i> (GE, UR, SZ, TI, AI, VS, OW) elle relève des assureurs privés.</li>
            <li><b>Véhicules&nbsp;: casco partielle</b> (vol, incendie, bris de glace, forces de la nature, collision avec animaux) et <b>casco complète</b> (partielle + dommages de collision causés par le conducteur).</li>
            <li><b>Technique</b>&nbsp;: bris de machines, travaux de construction, montage, informatique.</li>
            <li><b>Transport</b>&nbsp;: marchandises, corps de véhicules, valeurs.</li>
          </ul>`
        },
        {
          h: "Assurances de patrimoine",
          html: `<ul>
            <li><b>Responsabilité civile</b>&nbsp;: RC privée, RC véhicules à moteur (obligatoire), RC d'entreprise, RC professionnelle, RC des organes (D&amp;O).</li>
            <li><b>Protection juridique</b>&nbsp;: circulation et privée.</li>
            <li><b>Perte d'exploitation</b> (interruption d'activité à la suite d'un dommage matériel).</li>
            <li><b>Crédit, caution, garantie</b>, assurance des risques à l'exportation.</li>
            <li><b>Cyber</b>&nbsp;: hybride, couvre à la fois des frais propres et la responsabilité envers des tiers.</li>
          </ul>`
        }
      ],
      keypoints: [
        "Assurance de dommages : principe indemnitaire + subrogation. Assurance de sommes : ni l'un ni l'autre.",
        "Trois grandes familles : personnes, choses, patrimoine.",
        "Casco partielle = vol, incendie, bris de glace, nature, animaux ; casco complète = + collision propre.",
        "19 cantons ont un établissement cantonal d'assurance des bâtiments (monopole).",
        "La RC véhicules à moteur est l'assurance de patrimoine obligatoire par excellence."
      ]
    },

    {
      id: 'c5',
      title: "Le marché suisse de l'assurance",
      resume: "Poids économique, acteurs, formes juridiques, chiffres-clés et structure du secteur.",
      sections: [
        {
          h: "Poids économique",
          html: `<ul>
            <li>Le secteur de l'assurance emploie environ <b>50&nbsp;000 personnes</b> en Suisse et contribue pour à peu près <b>4&nbsp;%</b> au PIB (finance dans son ensemble&nbsp;: env. 9&nbsp;%).</li>
            <li>La Suisse figure parmi les pays où la <b>densité d'assurance</b> (primes par habitant) est la plus élevée du monde.</li>
            <li>La <b>FINMA</b> surveille près de <b>200</b> entreprises d'assurance et de réassurance.</li>
            <li>Volume de primes&nbsp;: de l'ordre de <b>CHF 60&nbsp;milliards</b> par an sur le marché suisse, réparti grossièrement entre vie et non-vie.</li>
            <li>La Suisse est le siège de deux des plus grands réassureurs du monde et le secteur est fortement <b>exportateur</b>.</li>
          </ul>
          <p class="tip">Retenez les <b>ordres de grandeur</b> plutôt que les décimales&nbsp;: ils suffisent à l'examen et restent valables d'une année à l'autre.</p>`
        },
        {
          h: "Les acteurs",
          html: `<ul>
            <li><b>Entreprises d'assurance</b> (assureurs directs) — vie, dommages, maladie, réassurance.</li>
            <li><b>Réassureurs</b> — assureurs des assureurs.</li>
            <li><b>Intermédiaires</b> — agents liés et courtiers non liés.</li>
            <li><b>Preneurs d'assurance / assurés / ayants droit</b> — trois rôles qui peuvent être ou non la même personne.</li>
            <li><b>FINMA</b> — autorité de surveillance des marchés financiers.</li>
            <li><b>ASA (Association Suisse d'Assurances)</b> — association faîtière des assureurs privés.</li>
            <li><b>AFA / VBV</b> — Association pour la formation professionnelle en assurance, responsable de la certification des intermédiaires et du registre de formation continue (Cicero).</li>
            <li><b>Ombudsman de l'assurance privée et de la SUVA</b> — médiation gratuite et neutre, sans pouvoir de décision.</li>
            <li><b>Fonds national de garantie</b> et <b>Bureau national d'assurance</b> — véhicules non assurés / non identifiés et véhicules étrangers.</li>
            <li><b>SUVA</b> — assureur-accidents de droit public pour certaines branches définies par la loi.</li>
          </ul>`
        },
        {
          h: "Formes juridiques et organisation",
          html: `<p>Une entreprise d'assurance suisse doit revêtir la forme de la <b>société anonyme</b> ou de la <b>société coopérative</b> (art. 7 LSA). Elle a besoin d'une <b>autorisation de la FINMA</b> avant de commencer son activité, sur la base d'un <b>plan d'exploitation</b>.</p>
          <p><b>Séparation vie / non-vie</b>&nbsp;: une compagnie autorisée pour l'assurance-vie ne peut pas exploiter simultanément d'autres branches, sauf l'assurance-accidents et maladie (principe de la spécialisation, art. 12 LSA). D'où les structures de groupe avec une société vie et une société dommages.</p>
          <p>Fonctions internes typiques&nbsp;: souscription (underwriting), actuariat, gestion des sinistres, placements, distribution, gestion des risques, <b>compliance</b>, révision interne, et l'<b>actuaire responsable</b> exigé par la LSA.</p>`
        }
      ],
      keypoints: [
        "Env. 50 000 emplois, ~4 % du PIB, ~200 assureurs surveillés par la FINMA.",
        "Formes juridiques admises : SA ou société coopérative.",
        "Principe de spécialisation : pas de cumul vie / non-vie dans la même entité.",
        "L'ASA est la faîtière des assureurs ; l'AFA/VBV s'occupe de la formation.",
        "L'Ombudsman est gratuit, neutre et ne rend pas de décision contraignante."
      ]
    },

    {
      id: 'c6',
      title: 'Distribution et intermédiaires',
      resume: "Canaux de vente, statut d'intermédiaire lié ou non lié, rémunération et devoirs professionnels.",
      sections: [
        {
          h: "Les canaux de distribution",
          html: `<ul>
            <li><b>Service externe propre</b> (agents liés, collaborateurs salariés de la compagnie)&nbsp;;</li>
            <li><b>Agences générales</b> et agents indépendants liés par contrat d'agence&nbsp;;</li>
            <li><b>Courtiers</b> (intermédiaires non liés) mandatés par le client&nbsp;;</li>
            <li><b>Bancassurance</b> — distribution via le réseau bancaire&nbsp;;</li>
            <li><b>Vente directe</b>&nbsp;: internet, téléphone, comparateurs en ligne&nbsp;;</li>
            <li><b>Partenariats / affinity</b>&nbsp;: garages, concessionnaires, détaillants, associations.</li>
          </ul>`
        },
        {
          h: "Lié ou non lié : la distinction centrale",
          html: `<table class="tbl">
            <tr><th></th><th>Intermédiaire <b>lié</b></th><th>Intermédiaire <b>non lié</b></th></tr>
            <tr><td>Agit pour</td><td>Le compte de l'entreprise d'assurance</td><td>Le compte du <b>preneur d'assurance</b></td></tr>
            <tr><td>Base contractuelle</td><td>Contrat de travail ou d'agence</td><td>Mandat de courtage du client</td></tr>
            <tr><td>Rémunération</td><td>Salaire / commissions de l'assureur</td><td>Courtage de l'assureur ou honoraires du client</td></tr>
            <tr><td>Registre FINMA</td><td>Enregistrement <b>non</b> obligatoire</td><td>Enregistrement <b>obligatoire</b></td></tr>
            <tr><td>Exemple</td><td>Agent, conseiller d'une compagnie</td><td>Courtier</td></tr>
          </table>
          <p>Depuis la révision de la LSA en vigueur au <b>1<sup>er</sup> janvier 2024</b>, seuls les intermédiaires <b>non liés</b> doivent s'inscrire au registre de la FINMA. Le <b>cumul des deux statuts est interdit</b>&nbsp;: on ne peut pas être simultanément lié et non lié.</p>`
        },
        {
          h: "Conditions d'inscription au registre",
          html: `<ul>
            <li><b>Qualifications professionnelles</b>&nbsp;: formation initiale et formation continue reconnues (standard minimal de la branche, examen AFA)&nbsp;;</li>
            <li><b>Assurance responsabilité civile professionnelle</b> ou garantie financière équivalente&nbsp;;</li>
            <li><b>Bonne réputation</b>, absence d'actes de défaut de biens et garantie d'une activité irréprochable&nbsp;;</li>
            <li>Ne pas travailler pour une entreprise d'assurance <b>non autorisée</b>.</li>
          </ul>`
        },
        {
          h: "Devoirs professionnels",
          html: `<ul>
            <li><b>Devoir d'information</b> (art. 45 LSA)&nbsp;: identité et adresse, statut lié / non lié, entreprises représentées, traitement des données, qui répond en cas de faute, comment déposer une réclamation.</li>
            <li><b>Transparence sur les rémunérations</b> et gestion des <b>conflits d'intérêts</b>.</li>
            <li><b>Devoir de diligence et de fidélité</b>&nbsp;: analyse des besoins, conseil adapté, <b>documentation</b> de l'entretien.</li>
            <li><b>Interdiction du démarchage téléphonique à froid</b> et règles de comportement définies par l'autorégulation de la branche.</li>
            <li><b>Formation continue</b>&nbsp;: attestation par une plateforme reconnue (Cicero) pour rester enregistré.</li>
          </ul>`
        }
      ],
      keypoints: [
        "Non lié = agit pour le client (courtier) ; lié = agit pour l'assureur (agent).",
        "Depuis 2024, seuls les non liés doivent figurer au registre FINMA.",
        "Le cumul des statuts lié / non lié est interdit.",
        "Inscription : qualifications, RC professionnelle, bonne réputation.",
        "L'intermédiaire doit s'identifier, dire pour qui il travaille et documenter son conseil."
      ]
    },

    {
      id: 'c7',
      title: 'Réassurance et transfert alternatif du risque',
      resume: "Pourquoi les assureurs s'assurent, et sous quelles formes.",
      sections: [
        {
          h: "Fonctions de la réassurance",
          html: `<ul>
            <li><b>Augmenter la capacité de souscription</b> — accepter des risques plus grands que ses fonds propres ne le permettraient&nbsp;;</li>
            <li><b>Homogénéiser le portefeuille</b> et lisser les résultats&nbsp;;</li>
            <li><b>Protéger contre les cumuls et les catastrophes</b> (tempête, grêle, tremblement de terre)&nbsp;;</li>
            <li><b>Alléger les exigences de fonds propres</b> et soutenir la solvabilité&nbsp;;</li>
            <li><b>Apporter du savoir-faire</b> (tarification, nouveaux risques).</li>
          </ul>
          <p>Le réassureur n'a <b>aucun lien contractuel avec l'assuré</b>&nbsp;: seul l'assureur direct (cédante) répond envers le preneur d'assurance.</p>`
        },
        {
          h: "Réassurance proportionnelle",
          html: `<p>Primes et sinistres sont partagés dans la <b>même proportion</b>.</p>
          <ul>
            <li><b>Quote-part</b>&nbsp;: un pourcentage fixe de chaque risque est cédé (p.&nbsp;ex. 40&nbsp;%). Simple, mais cède aussi les petits risques que la cédante pourrait garder.</li>
            <li><b>Excédent de plein (surplus)</b>&nbsp;: la cédante conserve un plein de conservation et cède le surplus. Permet d'homogénéiser le portefeuille.</li>
          </ul>`
        },
        {
          h: "Réassurance non proportionnelle",
          html: `<p>Le réassureur intervient <b>au-delà d'une priorité</b> (franchise), contre une prime négociée sans lien proportionnel.</p>
          <ul>
            <li><b>Excess of Loss (XL) par risque ou par événement</b>&nbsp;: prise en charge de la tranche au-delà de la priorité, jusqu'à une limite.</li>
            <li><b>Stop Loss</b>&nbsp;: intervient lorsque le <b>ratio de sinistralité annuel</b> global dépasse un seuil.</li>
          </ul>`
        },
        {
          h: "Transfert alternatif du risque (ART)",
          html: `<ul>
            <li><b>Captive</b>&nbsp;: filiale d'assurance créée par un groupe industriel pour porter ses propres risques.</li>
            <li><b>Cat bonds / titres liés à l'assurance (ILS)</b>&nbsp;: transfert du risque de catastrophe aux marchés financiers&nbsp;; l'investisseur perd son capital si l'événement défini survient.</li>
            <li><b>Pools</b>&nbsp;: mise en commun de risques particuliers (nucléaire, terrorisme, dommages naturels).</li>
            <li><b>Rétrocession</b>&nbsp;: la réassurance de la réassurance.</li>
          </ul>`
        }
      ],
      keypoints: [
        "Le réassureur n'a pas de relation contractuelle avec l'assuré.",
        "Proportionnelle : quote-part et excédent de plein.",
        "Non proportionnelle : excess of loss (par risque/événement) et stop loss.",
        "La réassurance augmente la capacité, lisse les résultats et protège des cumuls.",
        "ART : captives, cat bonds, pools ; rétrocession = réassurance du réassureur."
      ]
    },

    {
      id: 'c8',
      title: 'Surveillance, solvabilité et protection des clients',
      resume: "FINMA, LSA, test suisse de solvabilité et voies de recours du consommateur.",
      sections: [
        {
          h: "La FINMA",
          html: `<p>La <b>FINMA</b> est un établissement de droit public <b>indépendant</b>, doté de sa propre personnalité juridique, financé par les <b>émoluments et taxes des assujettis</b> et non par l'impôt. Elle rend compte au Conseil fédéral et au Parlement mais n'en reçoit pas d'instructions dans ses décisions.</p>
          <p>Buts de la surveillance (art. 1 LSA)&nbsp;: <b>protéger les assurés contre les risques d'insolvabilité et les abus</b>. La surveillance des assurances est une surveillance <b>de la solvabilité et des abus</b> — la FINMA n'approuve en principe <b>plus les tarifs ni les conditions générales à l'avance</b>, sauf pour l'assurance-maladie complémentaire et l'assurance-accidents obligatoire.</p>
          <p>Instruments&nbsp;: autorisation, plan d'exploitation, agrément des personnes dirigeantes, contrôle sur place, <b>chargé d'enquête</b>, mesures allant jusqu'au <b>retrait d'autorisation</b> et à la liquidation.</p>`
        },
        {
          h: "Solvabilité et fortune liée",
          html: `<ul>
            <li><b>Test suisse de solvabilité (SST)</b>&nbsp;: modèle fondé sur des valeurs de marché et une approche <b>fondée sur le risque</b>&nbsp;; il compare le <b>capital porteur de risque</b> au <b>capital cible</b>. Un ratio inférieur à 100&nbsp;% déclenche l'intervention de la FINMA.</li>
            <li><b>Fortune liée</b>&nbsp;: patrimoine affecté à la couverture des engagements découlant des contrats d'assurance. Elle est <b>séparée</b> du reste de la fortune et sert en priorité les assurés en cas de faillite&nbsp;: c'est un <b>privilège</b> majeur pour l'assuré.</li>
            <li><b>Fonds d'organisation</b>&nbsp;: capital destiné à la constitution et à l'extension de l'entreprise.</li>
            <li><b>Provisions techniques</b> suffisantes et <b>actuaire responsable</b>.</li>
          </ul>`
        },
        {
          h: "Protection des clients et voies de droit",
          html: `<ol>
            <li>Réclamation auprès de l'assureur (service clientèle, gestion des plaintes).</li>
            <li><b>Ombudsman de l'assurance privée et de la SUVA</b>&nbsp;: procédure <b>gratuite</b>, neutre, informelle&nbsp;; il émet des recommandations, <b>sans force obligatoire</b>.</li>
            <li><b>Tribunal civil</b>&nbsp;: le preneur peut agir au for de son <b>domicile</b> ou au siège de l'assureur&nbsp;; la procédure est en principe gratuite en matière d'assurance complémentaire dans plusieurs cantons.</li>
            <li>La <b>FINMA n'est pas une instance de recours individuelle</b>&nbsp;: elle n'arbitre pas les litiges de contrat, mais peut agir si un comportement révèle un abus systématique.</li>
            <li><b>PFPDT</b> pour les questions de protection des données.</li>
          </ol>`
        }
      ],
      keypoints: [
        "La FINMA est indépendante et financée par les assujettis.",
        "Buts : protection contre l'insolvabilité et contre les abus.",
        "Le SST compare capital porteur de risque et capital cible.",
        "La fortune liée protège les assurés en cas de faillite de l'assureur.",
        "L'Ombudsman recommande, il ne décide pas ; la FINMA ne tranche pas les litiges individuels."
      ]
    }
  ];

  /* ---------------------------------------------------------
     QUESTIONS
     type: 'single' (une réponse) | 'multi' (plusieurs réponses)
     --------------------------------------------------------- */
  M.questions = [
    /* --- c1 : risque --- */
    { id: 'm1c1q1', chap: 'c1', type: 'single',
      q: "Quelle est la caractéristique qui rend un risque assurable par une compagnie privée ?",
      choices: ["Il peut produire soit une perte, soit un gain", "Il s'agit d'un risque pur, ne pouvant produire qu'une perte", "Il dépend de la volonté de l'assuré", "Il est certain de survenir"],
      answer: [1],
      explain: "Seul le risque pur (qui ne peut entraîner qu'une perte) est assurable. Le risque spéculatif, qui peut aussi produire un gain, ne l'est pas ; un événement certain ou voulu n'est pas aléatoire." },

    { id: 'm1c1q2', chap: 'c1', type: 'multi',
      q: "Quelles sont les stratégies de traitement du risque en risk management ?",
      choices: ["Éviter le risque", "Réduire / prévenir le risque", "Transférer le risque", "Assumer le risque soi-même", "Ignorer le risque"],
      answer: [0, 1, 2, 3],
      explain: "Les quatre stratégies sont : éviter, réduire, transférer (assurance) et assumer. « Ignorer » n'est pas une stratégie : c'est une absence de gestion." },

    { id: 'm1c1q3', chap: 'c1', type: 'single',
      q: "Un risque de fréquence élevée mais d'intensité faible sera typiquement…",
      choices: ["Transféré intégralement à un assureur", "Prévenu ou assumé par une franchise", "Réassuré en excess of loss", "Interdit par la FINMA"],
      answer: [1],
      explain: "L'assurance est faite pour les risques rares et lourds. Les petits sinistres fréquents coûteraient plus cher en frais de gestion qu'en indemnités : on les prévient ou on les garde à sa charge (franchise)." },

    { id: 'm1c1q4', chap: 'c1', type: 'multi',
      q: "Quelles conditions un risque doit-il remplir pour être assurable ?",
      choices: ["Être aléatoire", "Être mesurable statistiquement", "Frapper simultanément tout le portefeuille", "Être économiquement supportable", "Être licite"],
      answer: [0, 1, 3, 4],
      explain: "Le cumul incontrôlable est au contraire un obstacle à l'assurabilité : les risques doivent être suffisamment indépendants les uns des autres." },

    { id: 'm1c1q5', chap: 'c1', type: 'single',
      q: "Le vol d'un vélo est un risque de quelle catégorie ?",
      choices: ["Risque de personne", "Risque de chose", "Risque de patrimoine", "Risque spéculatif"],
      answer: [1],
      explain: "Le vélo est un bien matériel : il s'agit d'un risque de chose. Les risques de patrimoine touchent la fortune sans destruction d'un objet (RC, perte d'exploitation, protection juridique)." },

    { id: 'm1c1q6', chap: 'c1', type: 'single',
      q: "Que signifie « risque subjectif » ?",
      choices: ["Un risque lié au comportement et à la moralité de l'assuré", "Un risque impossible à chiffrer", "Un risque couvert par la réassurance", "Un risque propre aux entreprises"],
      answer: [0],
      explain: "Le risque subjectif dépend de la personne assurée (négligence, malhonnêteté, mauvaise foi) ; le risque objectif tient aux caractéristiques matérielles de l'objet ou de l'activité." },

    { id: 'm1c1q7', chap: 'c1', type: 'single',
      q: "Installer un système sprinkler dans un entrepôt relève de quelle stratégie ?",
      choices: ["Éviter le risque", "Réduire le risque", "Transférer le risque", "Assumer le risque"],
      answer: [1],
      explain: "Les mesures de protection diminuent la probabilité ou l'ampleur du sinistre : c'est une réduction du risque (prévention/protection). Elles se traduisent souvent par un rabais de prime." },

    { id: 'm1c1q8', chap: 'c1', type: 'single',
      q: "Quelle est la première étape du processus de gestion des risques ?",
      choices: ["L'évaluation", "Le traitement", "L'identification", "Le contrôle"],
      answer: [2],
      explain: "On ne peut évaluer ni traiter que ce que l'on a d'abord identifié. Le cycle est : identification → analyse → traitement → contrôle." },

    /* --- c2 : principes techniques --- */
    { id: 'm1c2q1', chap: 'c2', type: 'single',
      q: "Sur quel principe repose fondamentalement l'assurance ?",
      choices: ["La solidarité intergénérationnelle", "La mutualité", "La répartition fiscale", "La capitalisation obligatoire"],
      answer: [1],
      explain: "La mutualité : une communauté de risques verse des primes dans une caisse commune, qui indemnise les membres sinistrés. La loi des grands nombres rend ce mécanisme calculable." },

    { id: 'm1c2q2', chap: 'c2', type: 'single',
      q: "Que dit la loi des grands nombres ?",
      choices: ["Plus le nombre de cas observés est grand, plus le résultat réel se rapproche de la probabilité théorique", "Les grands risques coûtent plus cher que les petits", "Plus l'assureur est grand, plus ses primes sont basses", "Le nombre de sinistres augmente avec le portefeuille"],
      answer: [0],
      explain: "C'est un principe statistique : la loi des grands nombres permet à l'assureur de prévoir avec précision une sinistralité globale qui reste totalement imprévisible pour un individu isolé." },

    { id: 'm1c2q3', chap: 'c2', type: 'single',
      q: "La prime de risque correspond à…",
      choices: ["La prime encaissée moins les taxes", "La fréquence multipliée par le coût moyen des sinistres", "Le chargement pour frais d'acquisition", "La marge bénéficiaire de l'assureur"],
      answer: [1],
      explain: "La prime de risque (ou prime nette) est le coût pur du risque : fréquence × coût moyen. On y ajoute ensuite sécurité, frais et bénéfice pour obtenir la prime commerciale." },

    { id: 'm1c2q4', chap: 'c2', type: 'multi',
      q: "Quels éléments composent la prime commerciale (brute) ?",
      choices: ["Prime de risque", "Supplément de sécurité", "Chargements de frais", "Marge bénéficiaire", "Droit de timbre"],
      answer: [0, 1, 2, 3],
      explain: "Le droit de timbre est une taxe ajoutée APRÈS la prime commerciale pour obtenir la prime encaissée : il ne fait pas partie de la prime commerciale." },

    { id: 'm1c2q5', chap: 'c2', type: 'single',
      q: "Quel est le taux du droit de timbre sur une prime d'assurance ménage ?",
      choices: ["2,5 %", "5 %", "7,7 %", "Exonéré"],
      answer: [1],
      explain: "Les assurances de choses et de patrimoine sont soumises à 5 %. Le taux de 2,5 % vise les assurances-vie susceptibles de rachat financées par prime unique." },

    { id: 'm1c2q6', chap: 'c2', type: 'multi',
      q: "Quelles primes sont exonérées du droit de timbre ?",
      choices: ["Assurance-maladie et accidents", "Assurance-chômage", "Assurance RC véhicule à moteur", "Assurance grêle et bétail", "Réassurance"],
      answer: [0, 1, 3, 4],
      explain: "La RC véhicule est une assurance de patrimoine soumise à 5 %. Les autres citées sont exonérées, comme l'assurance-vie à primes périodiques." },

    { id: 'm1c2q7', chap: 'c2', type: 'single',
      q: "Qu'est-ce que l'antisélection ?",
      choices: ["Le refus d'un risque par l'assureur", "Le phénomène par lequel les bons risques quittent le portefeuille et les mauvais y restent", "La sélection des sinistres à indemniser", "Le choix du réassureur"],
      answer: [1],
      explain: "Si la tarification n'est pas assez différenciée, les bons risques paient trop cher et partent ; il ne reste que les mauvais, ce qui dégrade le résultat et force à augmenter les primes." },

    { id: 'm1c2q8', chap: 'c2', type: 'single',
      q: "Un combined ratio de 97 % signifie que…",
      choices: ["L'assureur a perdu de l'argent sur son activité d'assurance", "L'activité d'assurance est bénéficiaire avant résultat financier", "97 % des sinistres ont été payés", "97 % des contrats ont été renouvelés"],
      answer: [1],
      explain: "Le combined ratio additionne charge de sinistres et frais rapportés aux primes. En dessous de 100 %, l'activité technique est bénéficiaire, indépendamment du résultat des placements." },

    { id: 'm1c2q9', chap: 'c2', type: 'multi',
      q: "Quelles sont des provisions techniques figurant au passif d'un assureur ?",
      choices: ["Provision pour sinistres à régler", "Report de primes (primes non acquises)", "Réserve mathématique", "Fonds d'organisation", "Provision pour fluctuation"],
      answer: [0, 1, 2, 4],
      explain: "Le fonds d'organisation n'est pas une provision technique : c'est un capital destiné à la constitution et au développement de l'entreprise." },

    /* --- c3 : trois piliers --- */
    { id: 'm1c3q1', chap: 'c3', type: 'single',
      q: "Quel est le but du 1er pilier ?",
      choices: ["Maintenir le niveau de vie habituel", "Couvrir les besoins vitaux", "Compléter individuellement la prévoyance", "Financer les soins médicaux"],
      answer: [1],
      explain: "Le 1er pilier (AVS/AI/APG, complété par les PC) garantit le minimum vital. C'est le 2e pilier qui vise le maintien du niveau de vie habituel, avec le 1er, autour de 60 % du dernier salaire." },

    { id: 'm1c3q2', chap: 'c3', type: 'single',
      q: "Le 1er pilier est financé selon quel système ?",
      choices: ["La capitalisation", "La répartition", "L'impôt sur la fortune uniquement", "Les primes par tête"],
      answer: [1],
      explain: "Le 1er pilier fonctionne par répartition : les cotisations des actifs financent immédiatement les rentes des retraités. Le 2e pilier fonctionne par capitalisation." },

    { id: 'm1c3q3', chap: 'c3', type: 'single',
      q: "Quel est le taux de cotisation AVS/AI/APG sur le salaire ?",
      choices: ["8,7 %", "10,6 %", "12,8 %", "5,3 %"],
      answer: [1],
      explain: "10,6 % au total (AVS 8,7 % + AI 1,4 % + APG 0,5 %), partagés par moitié entre employeur et employé, soit 5,3 % chacun, sans plafond de salaire." },

    { id: 'm1c3q4', chap: 'c3', type: 'single',
      q: "En 2026, la rente AVS mensuelle maximale d'une personne seule s'élève à :",
      choices: ["CHF 1 260.–", "CHF 2 450.–", "CHF 2 520.–", "CHF 3 780.–"],
      answer: [2],
      explain: "Rente minimale CHF 1 260.–, maximale CHF 2 520.–. Le plafond pour un couple correspond à 150 % de la rente maximale, soit CHF 3 780.–." },

    { id: 'm1c3q5', chap: 'c3', type: 'single',
      q: "À partir de quel âge un salarié est-il assuré à la LPP pour l'épargne vieillesse ?",
      choices: ["Dès 17 ans", "Dès 20 ans", "Dès 25 ans révolus", "Dès 30 ans"],
      answer: [2],
      explain: "Dès 17 ans pour les risques décès et invalidité, dès 25 ans révolus (soit le 1er janvier suivant les 24 ans) pour la constitution de l'avoir de vieillesse." },

    { id: 'm1c3q6', chap: 'c3', type: 'single',
      q: "Quel est le taux de conversion minimal LPP dans le régime obligatoire ?",
      choices: ["5,8 %", "6,0 %", "6,8 %", "7,2 %"],
      answer: [2],
      explain: "Le taux de conversion minimal légal est de 6,8 % : un avoir de CHF 100 000.– donne droit à une rente annuelle de CHF 6 800.–. Il ne s'applique qu'à la part obligatoire." },

    { id: 'm1c3q7', chap: 'c3', type: 'multi',
      q: "Quelles affirmations sur le pilier 3a sont exactes ?",
      choices: ["Il est réservé aux personnes exerçant une activité lucrative", "Les versements sont déductibles fiscalement", "On peut retirer les fonds à tout moment sans motif", "Un retrait anticipé est possible pour acquérir son logement principal", "Le bénéficiaire peut être librement choisi"],
      answer: [0, 1, 3],
      explain: "Le 3a est lié : retrait uniquement dans les cas prévus par la loi (logement en propriété, départ définitif de Suisse, passage à l'indépendance, invalidité, rachat LPP) et ordre des bénéficiaires fixé par la loi. C'est le 3b qui est libre." },

    { id: 'm1c3q8', chap: 'c3', type: 'single',
      q: "À partir de combien d'heures de travail hebdomadaires un salarié est-il assuré contre les accidents non professionnels (LAA) ?",
      choices: ["4 heures", "8 heures", "12 heures", "Dès la première heure"],
      answer: [1],
      explain: "Les accidents professionnels sont couverts dès la première heure ; les accidents non professionnels (ATNP) le sont dès 8 heures de travail par semaine chez le même employeur." },

    { id: 'm1c3q9', chap: 'c3', type: 'single',
      q: "Dans quel délai faut-il s'affilier à l'assurance-maladie obligatoire après la prise de domicile en Suisse ?",
      choices: ["30 jours", "3 mois", "6 mois", "1 an"],
      answer: [1],
      explain: "L'affiliation doit intervenir dans les 3 mois ; elle prend alors effet rétroactivement à la date de la prise de domicile ou de la naissance." },

    { id: 'm1c3q10', chap: 'c3', type: 'single',
      q: "Quel taux l'indemnité journalière LAA représente-t-elle du gain assuré ?",
      choices: ["60 %", "70 %", "80 %", "100 %"],
      answer: [2],
      explain: "80 % du gain assuré, versée dès le 3e jour qui suit celui de l'accident. Le gain assuré maximum est de CHF 148 200.– par an." },

    /* --- c4 : branches --- */
    { id: 'm1c4q1', chap: 'c4', type: 'single',
      q: "Quelle est la différence essentielle entre assurance de dommages et assurance de sommes ?",
      choices: ["Le montant de la prime", "L'assurance de dommages indemnise le dommage effectif, l'assurance de sommes verse le capital convenu", "L'assurance de sommes est toujours obligatoire", "L'assurance de dommages ne concerne que les entreprises"],
      answer: [1],
      explain: "L'assurance de dommages suit le principe indemnitaire (pas d'enrichissement, subrogation possible). L'assurance de sommes verse le montant convenu quel que soit le dommage réel et se cumule avec d'autres prestations." },

    { id: 'm1c4q2', chap: 'c4', type: 'multi',
      q: "Quels risques la casco partielle couvre-t-elle ?",
      choices: ["Le vol du véhicule", "L'incendie", "Le bris de glace", "La collision dont le conducteur est responsable", "Les forces de la nature"],
      answer: [0, 1, 2, 4],
      explain: "Le dommage de collision causé par le conducteur lui-même n'est couvert que par la casco complète. La casco partielle vise les événements subis (vol, incendie, glace, nature, animaux)." },

    { id: 'm1c4q3', chap: 'c4', type: 'single',
      q: "L'assurance perte d'exploitation appartient à quelle catégorie ?",
      choices: ["Assurance de personnes", "Assurance de choses", "Assurance de patrimoine", "Assurance sociale"],
      answer: [2],
      explain: "Elle couvre une perte financière (marge et frais fixes) consécutive à un sinistre matériel : le patrimoine est touché, pas la chose elle-même." },

    { id: 'm1c4q4', chap: 'c4', type: 'single',
      q: "Une assurance-vie de capital décès est :",
      choices: ["Une assurance de dommages", "Une assurance de sommes", "Une assurance sociale", "Une assurance de choses"],
      answer: [1],
      explain: "Le capital convenu est versé indépendamment du préjudice réellement subi : c'est une assurance de sommes. Elle se cumule avec toute autre prestation et n'ouvre pas de subrogation." },

    { id: 'm1c4q5', chap: 'c4', type: 'single',
      q: "Dans la majorité des cantons suisses, l'assurance incendie du bâtiment est :",
      choices: ["Libre auprès de n'importe quel assureur privé", "Confiée à un établissement cantonal monopolistique", "Interdite", "Gérée par la Confédération"],
      answer: [1],
      explain: "19 cantons connaissent un établissement cantonal d'assurance (ECA) avec monopole. Les cantons dits « GUSTAVO » (GE, UR, SZ, TI, AI, VS, OW) laissent le marché aux assureurs privés." },

    { id: 'm1c4q6', chap: 'c4', type: 'multi',
      q: "Lesquelles de ces assurances sont des assurances de personnes ?",
      choices: ["Assurance-vie", "Indemnités journalières maladie", "Protection juridique", "Assurance-accidents individuelle", "Assurance bris de machines"],
      answer: [0, 1, 3],
      explain: "La protection juridique est une assurance de patrimoine, le bris de machines une assurance de choses." },

    { id: 'm1c4q7', chap: 'c4', type: 'single',
      q: "Quelle assurance est obligatoire pour circuler avec un véhicule à moteur en Suisse ?",
      choices: ["La casco complète", "La casco partielle", "La responsabilité civile véhicule à moteur", "La protection juridique circulation"],
      answer: [2],
      explain: "Seule la RC du détenteur est obligatoire (LCR). Les couvertures casco sont facultatives, même si elles sont souvent exigées en cas de leasing." },

    /* --- c5 : marché --- */
    { id: 'm1c5q1', chap: 'c5', type: 'multi',
      q: "Quelles formes juridiques une entreprise d'assurance suisse peut-elle adopter ?",
      choices: ["Société anonyme", "Société coopérative", "Société à responsabilité limitée", "Raison individuelle", "Fondation"],
      answer: [0, 1],
      explain: "La LSA n'admet que la société anonyme et la société coopérative (les succursales d'assureurs étrangers étant réglées séparément)." },

    { id: 'm1c5q2', chap: 'c5', type: 'single',
      q: "Que signifie le principe de spécialisation en droit de la surveillance ?",
      choices: ["Chaque assureur doit se spécialiser dans un seul produit", "Une entreprise autorisée pour l'assurance-vie ne peut pas exploiter simultanément d'autres branches, hormis accidents et maladie", "Seuls des spécialistes peuvent vendre de l'assurance", "Les courtiers doivent se spécialiser par branche"],
      answer: [1],
      explain: "La séparation vie / non-vie protège les avoirs de prévoyance des assurés-vie contre les risques des branches dommages. D'où les groupes composés de plusieurs sociétés." },

    { id: 'm1c5q3', chap: 'c5', type: 'single',
      q: "Quel organisme est l'association faîtière des assureurs privés suisses ?",
      choices: ["La FINMA", "L'ASA", "L'AFA / VBV", "L'Ombudsman"],
      answer: [1],
      explain: "L'ASA (Association Suisse d'Assurances) défend les intérêts de la branche. L'AFA/VBV s'occupe de la formation professionnelle, la FINMA de la surveillance." },

    { id: 'm1c5q4', chap: 'c5', type: 'single',
      q: "Le preneur d'assurance est :",
      choices: ["Toujours la personne assurée", "Le cocontractant de l'assureur, débiteur de la prime", "Le bénéficiaire des prestations", "L'intermédiaire qui conclut le contrat"],
      answer: [1],
      explain: "Le preneur signe le contrat et doit la prime. L'assuré est la personne ou la chose exposée au risque, l'ayant droit celui qui touche la prestation : les trois rôles peuvent coïncider ou non." },

    { id: 'm1c5q5', chap: 'c5', type: 'single',
      q: "Environ combien de personnes le secteur de l'assurance emploie-t-il en Suisse ?",
      choices: ["Environ 10 000", "Environ 50 000", "Environ 150 000", "Environ 300 000"],
      answer: [1],
      explain: "Environ 50 000 personnes, pour une contribution d'à peu près 4 % du PIB. Retenez l'ordre de grandeur plutôt que le chiffre exact." },

    /* --- c6 : distribution --- */
    { id: 'm1c6q1', chap: 'c6', type: 'single',
      q: "Un courtier en assurance agit :",
      choices: ["Pour le compte de l'entreprise d'assurance", "Pour le compte du preneur d'assurance", "Pour le compte de la FINMA", "Sans mandat particulier"],
      answer: [1],
      explain: "Le courtier est un intermédiaire non lié : il est mandaté par le client et défend ses intérêts, même s'il est le plus souvent rémunéré par des courtages versés par l'assureur." },

    { id: 'm1c6q2', chap: 'c6', type: 'single',
      q: "Depuis la révision de la LSA entrée en vigueur en 2024, qui doit s'inscrire au registre de la FINMA ?",
      choices: ["Tous les intermédiaires", "Uniquement les intermédiaires non liés", "Uniquement les intermédiaires liés", "Personne, le registre a été supprimé"],
      answer: [1],
      explain: "L'inscription est obligatoire pour les intermédiaires non liés (courtiers) et facultative — en principe supprimée — pour les intermédiaires liés, dont l'assureur répond." },

    { id: 'm1c6q3', chap: 'c6', type: 'single',
      q: "Un intermédiaire peut-il être simultanément lié et non lié ?",
      choices: ["Oui, sans restriction", "Oui, avec l'accord de la FINMA", "Non, le cumul des statuts est interdit", "Oui, s'il l'indique dans ses documents"],
      answer: [2],
      explain: "La LSA interdit expressément le double statut : il crée un conflit d'intérêts insoluble entre la défense du client et celle de l'assureur." },

    { id: 'm1c6q4', chap: 'c6', type: 'multi',
      q: "Quelles conditions sont requises pour l'inscription au registre des intermédiaires ?",
      choices: ["Des qualifications professionnelles reconnues", "Une assurance responsabilité civile professionnelle ou une garantie équivalente", "Un capital social minimal de CHF 100 000.–", "Une bonne réputation", "Ne pas travailler pour un assureur non autorisé"],
      answer: [0, 1, 3, 4],
      explain: "Aucun capital minimal n'est exigé de l'intermédiaire ; c'est la RC professionnelle qui protège les clients contre les conséquences d'un mauvais conseil." },

    { id: 'm1c6q5', chap: 'c6', type: 'multi',
      q: "Sur quoi l'intermédiaire doit-il informer le client avant la conclusion (art. 45 LSA) ?",
      choices: ["Son identité et son adresse", "S'il est lié ou non lié", "Le montant du salaire de ses collaborateurs", "Le traitement des données personnelles", "Qui répond en cas de conseil fautif"],
      answer: [0, 1, 3, 4],
      explain: "Le devoir d'information porte sur l'identité, le statut, les entreprises représentées, le traitement des données, la responsabilité et les voies de réclamation — pas sur les salaires internes." },

    { id: 'm1c6q6', chap: 'c6', type: 'single',
      q: "Que doit faire l'intermédiaire à l'issue d'un entretien de conseil ?",
      choices: ["Rien de particulier", "Documenter le conseil et les besoins identifiés", "Transmettre le dossier à la FINMA", "Faire signer une décharge de responsabilité générale"],
      answer: [1],
      explain: "L'analyse des besoins et la documentation du conseil sont au cœur des devoirs professionnels : c'est aussi la meilleure protection de l'intermédiaire en cas de litige." },

    { id: 'm1c6q7', chap: 'c6', type: 'single',
      q: "Comment un intermédiaire enregistré prouve-t-il sa formation continue ?",
      choices: ["Par une déclaration sur l'honneur", "Par une attestation d'une plateforme reconnue de la branche (Cicero)", "Par un examen annuel de la FINMA", "Ce n'est pas exigé"],
      answer: [1],
      explain: "La branche a mis en place un standard minimal de formation continue, attesté par une plateforme reconnue ; sans lui, l'inscription au registre ne peut être maintenue." },

    /* --- c7 : réassurance --- */
    { id: 'm1c7q1', chap: 'c7', type: 'single',
      q: "Quel lien juridique existe entre le réassureur et l'assuré ?",
      choices: ["Le réassureur répond solidairement envers l'assuré", "Aucun : seul l'assureur direct est lié à l'assuré", "L'assuré peut agir directement contre le réassureur", "Le réassureur devient partie au contrat d'assurance"],
      answer: [1],
      explain: "La réassurance est un contrat entre assureurs. L'assuré n'a de créance que contre son assureur direct (la cédante), même si celle-ci est en difficulté." },

    { id: 'm1c7q2', chap: 'c7', type: 'multi',
      q: "Lesquelles sont des formes de réassurance proportionnelle ?",
      choices: ["Quote-part", "Excédent de plein (surplus)", "Excess of loss", "Stop loss"],
      answer: [0, 1],
      explain: "En proportionnelle, primes et sinistres sont partagés dans la même proportion (quote-part, excédent de plein). L'excess of loss et le stop loss sont non proportionnels." },

    { id: 'm1c7q3', chap: 'c7', type: 'single',
      q: "Le stop loss intervient lorsque…",
      choices: ["Un sinistre individuel dépasse une priorité", "Le ratio de sinistralité annuel de la cédante dépasse un seuil convenu", "Le nombre de contrats dépasse un maximum", "L'assureur perd son autorisation"],
      answer: [1],
      explain: "Le stop loss protège le résultat annuel global du portefeuille, alors que l'excess of loss vise un sinistre ou un événement individuel au-delà d'une priorité." },

    { id: 'm1c7q4', chap: 'c7', type: 'multi',
      q: "Quelles sont des fonctions de la réassurance ?",
      choices: ["Augmenter la capacité de souscription", "Lisser les résultats dans le temps", "Protéger contre les risques de cumul", "Remplacer l'assureur direct auprès du client", "Soutenir la solvabilité"],
      answer: [0, 1, 2, 4],
      explain: "La réassurance ne se substitue jamais à l'assureur direct dans la relation client : c'est un contrat interne entre porteurs de risques." },

    { id: 'm1c7q5', chap: 'c7', type: 'single',
      q: "Qu'est-ce qu'une captive ?",
      choices: ["Un contrat de réassurance non proportionnelle", "Une société d'assurance créée par un groupe industriel pour porter ses propres risques", "Un fonds de garantie étatique", "Un intermédiaire exclusif"],
      answer: [1],
      explain: "La captive est un instrument de transfert alternatif du risque : le groupe conserve économiquement ses risques tout en accédant aux marchés de la réassurance." },

    { id: 'm1c7q6', chap: 'c7', type: 'single',
      q: "La rétrocession désigne :",
      choices: ["Le remboursement d'une prime au client", "La réassurance souscrite par un réassureur", "Le retour d'un risque vers l'assuré", "La commission versée à un courtier"],
      answer: [1],
      explain: "Le réassureur se réassure à son tour : c'est la rétrocession, qui permet de disséminer les très grands risques dans le marché mondial." },

    /* --- c8 : surveillance --- */
    { id: 'm1c8q1', chap: 'c8', type: 'multi',
      q: "Quels sont les buts de la surveillance des assurances selon la LSA ?",
      choices: ["Protéger les assurés contre les risques d'insolvabilité", "Protéger les assurés contre les abus", "Garantir un bénéfice aux entreprises d'assurance", "Fixer le montant des primes du marché"],
      answer: [0, 1],
      explain: "La LSA vise la protection des assurés contre l'insolvabilité et les abus. La FINMA n'intervient ni dans la rentabilité ni, en principe, dans la fixation des tarifs." },

    { id: 'm1c8q2', chap: 'c8', type: 'single',
      q: "Comment la FINMA est-elle financée ?",
      choices: ["Par l'impôt fédéral", "Par les émoluments et taxes de surveillance des assujettis", "Par les cotisations de l'ASA", "Par les amendes qu'elle prononce"],
      answer: [1],
      explain: "Elle est financée par ceux qu'elle surveille, ce qui garantit son indépendance budgétaire vis-à-vis du politique. C'est un établissement de droit public autonome." },

    { id: 'm1c8q3', chap: 'c8', type: 'single',
      q: "Que compare le Test suisse de solvabilité (SST) ?",
      choices: ["Les primes encaissées et les sinistres payés", "Le capital porteur de risque et le capital cible", "Les fonds propres et le chiffre d'affaires", "Les actifs et les passifs comptables"],
      answer: [1],
      explain: "Le SST est un modèle prospectif fondé sur des valeurs de marché : le capital porteur de risque doit couvrir le capital cible. Un ratio inférieur à 100 % déclenche l'intervention de la FINMA." },

    { id: 'm1c8q4', chap: 'c8', type: 'single',
      q: "À quoi sert la fortune liée ?",
      choices: ["À payer les salaires des collaborateurs", "À couvrir les engagements découlant des contrats d'assurance, avec un privilège pour les assurés en cas de faillite", "À financer les acquisitions de l'entreprise", "À constituer le capital-actions"],
      answer: [1],
      explain: "La fortune liée est séparée du reste du patrimoine et affectée en priorité aux prétentions des assurés : c'est l'une des protections les plus fortes du droit de la surveillance." },

    { id: 'm1c8q5', chap: 'c8', type: 'multi',
      q: "Quelles affirmations concernant l'Ombudsman de l'assurance privée sont exactes ?",
      choices: ["Sa saisine est gratuite pour le client", "Il est neutre et indépendant", "Ses recommandations lient l'assureur", "Il remplace le tribunal", "Il traite les litiges entre assurés et assureurs privés ou la SUVA"],
      answer: [0, 1, 4],
      explain: "L'Ombudsman recommande mais ne décide pas : ses avis n'ont pas force obligatoire et la voie judiciaire reste toujours ouverte." },

    { id: 'm1c8q6', chap: 'c8', type: 'single',
      q: "La FINMA peut-elle trancher un litige individuel entre un assuré et son assureur ?",
      choices: ["Oui, c'est son rôle principal", "Non, elle n'est pas une instance de recours pour les litiges contractuels", "Oui, mais seulement en assurance-vie", "Oui, si le montant dépasse CHF 100 000.–"],
      answer: [1],
      explain: "Les litiges contractuels relèvent de l'Ombudsman puis du juge civil. La FINMA intervient si un comportement révèle un abus systématique ou une violation du droit de la surveillance." },

    { id: 'm1c8q7', chap: 'c8', type: 'single',
      q: "Avant de commencer son activité, une entreprise d'assurance doit :",
      choices: ["S'annoncer au registre du commerce uniquement", "Obtenir une autorisation de la FINMA sur la base d'un plan d'exploitation", "Obtenir l'accord de l'ASA", "Passer un examen auprès de l'AFA"],
      answer: [1],
      explain: "L'activité d'assurance est soumise à autorisation préalable. Le plan d'exploitation décrit les branches, l'organisation, les tarifs et la réassurance ; ses modifications essentielles doivent être annoncées." }
  ];

  window.AFA_MODULES = window.AFA_MODULES || [];
  window.AFA_MODULES.push(M);
})();
