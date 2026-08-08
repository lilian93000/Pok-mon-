/* =============================================================
   AFA – Module 1, questions supplémentaires : chapitres 7 et 8
   (Réassurance et ART / Surveillance, solvabilité, protection)
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list);
  };

  add('m1', [
    /* ================= c7 — Réassurance ================= */
    { id: 'm1c7x01', chap: 'c7', type: 'single',
      q: "Comment appelle-t-on l'assureur qui cède une partie de ses risques à un réassureur ?",
      choices: ["Le rétrocessionnaire", "La cédante", "Le souscripteur", "Le mandant"],
      answer: [1],
      explain: "L'assureur direct qui cède est la « cédante » ; si le réassureur cède à son tour, on parle de rétrocession et de rétrocessionnaire." },

    { id: 'm1c7x02', chap: 'c7', type: 'single',
      q: "Le « plein de conservation » désigne :",
      choices: ["La somme d'assurance maximale du contrat", "La part du risque que la cédante garde à sa charge", "La priorité d'un traité en excess of loss", "Le capital-actions minimal"],
      answer: [1],
      explain: "C'est le montant que l'assureur direct estime pouvoir supporter seul. Au-delà, l'excédent est cédé au réassureur." },

    { id: 'm1c7x03', chap: 'c7', type: 'single',
      q: "Dans une quote-part de 30 %, sur un sinistre de CHF 200 000.–, le réassureur prend en charge :",
      choices: ["CHF 30 000.–", "CHF 60 000.–", "CHF 140 000.–", "CHF 200 000.–"],
      answer: [1],
      explain: "30 % de 200 000 = CHF 60 000.–. En proportionnelle, le réassureur reçoit aussi 30 % des primes du portefeuille cédé." },

    { id: 'm1c7x04', chap: 'c7', type: 'single',
      q: "Un traité XL prévoit une priorité de CHF 1 million et une limite de CHF 4 millions. Pour un sinistre de CHF 3 millions, le réassureur paie :",
      choices: ["CHF 1 million", "CHF 2 millions", "CHF 3 millions", "CHF 4 millions"],
      answer: [1],
      explain: "La cédante supporte la priorité de CHF 1 million ; le réassureur prend la tranche au-dessus, soit CHF 2 millions, dans la limite des CHF 4 millions." },

    { id: 'm1c7x05', chap: 'c7', type: 'single',
      q: "Avec la même structure XL (priorité 1 million, garantie de 4 millions au-delà), un sinistre de CHF 7 millions laisse à la charge de la cédante :",
      choices: ["CHF 1 million", "CHF 2 millions", "CHF 3 millions", "CHF 7 millions"],
      answer: [2],
      explain: "Le réassureur couvre la tranche de 1 à 5 millions, soit 4 millions. La cédante supporte la priorité (1 million) et tout ce qui dépasse la garantie (7 − 5 = 2 millions), soit CHF 3 millions au total." },

    { id: 'm1c7x06', chap: 'c7', type: 'single',
      q: "Quelle forme de réassurance protège le résultat annuel global d'un portefeuille ?",
      choices: ["La quote-part", "L'excédent de plein", "L'excess of loss par risque", "Le stop loss"],
      answer: [3],
      explain: "Le stop loss se déclenche lorsque le ratio de sinistralité annuel dépasse un seuil convenu : il vise l'ensemble de l'exercice, non un sinistre isolé." },

    { id: 'm1c7x07', chap: 'c7', type: 'single',
      q: "La réassurance « facultative » se caractérise par :",
      choices: ["Un examen risque par risque, avec liberté d'accepter ou de refuser", "Une cession automatique de tout le portefeuille", "L'absence de prime", "Son interdiction en Suisse"],
      answer: [0],
      explain: "À l'inverse du traité obligatoire, qui couvre automatiquement une catégorie entière, la facultative se négocie au cas par cas, pour les risques atypiques ou très importants." },

    { id: 'm1c7x08', chap: 'c7', type: 'single',
      q: "L'excédent de plein (surplus) permet surtout :",
      choices: ["De céder un pourcentage identique de tous les risques", "D'homogénéiser le portefeuille en ne cédant que la part dépassant le plein", "De protéger contre les catastrophes naturelles uniquement", "De supprimer le besoin de fonds propres"],
      answer: [1],
      explain: "Les petits risques sont conservés intégralement, les gros sont écrêtés : le portefeuille conservé devient homogène, donc statistiquement plus stable." },

    { id: 'm1c7x09', chap: 'c7', type: 'multi',
      q: "Quelles affirmations sur la réassurance proportionnelle sont exactes ?",
      choices: ["Primes et sinistres sont partagés dans la même proportion", "La quote-part en est une forme", "L'excédent de plein en est une forme", "Elle repose sur une priorité", "Le réassureur verse en principe une commission de réassurance à la cédante"],
      answer: [0, 1, 2, 4],
      explain: "La notion de priorité caractérise la réassurance non proportionnelle. En proportionnelle, le réassureur participe aux frais d'acquisition via une commission." },

    { id: 'm1c7x10', chap: 'c7', type: 'single',
      q: "Un cat bond (obligation catastrophe) fonctionne ainsi :",
      choices: ["L'investisseur perd tout ou partie de son capital si l'événement défini survient", "L'assureur garantit un rendement fixe sans risque", "Le réassureur émet des actions", "L'État garantit le remboursement"],
      answer: [0],
      explain: "Le risque de catastrophe est transféré aux marchés financiers : en échange d'un coupon élevé, l'investisseur accepte de perdre son capital si le déclencheur se réalise." },

    { id: 'm1c7x11', chap: 'c7', type: 'single',
      q: "Un pool d'assurance sert à :",
      choices: ["Mettre en commun des risques particuliers que personne ne veut porter seul", "Fusionner deux compagnies", "Regrouper les intermédiaires", "Centraliser les sinistres bagatelles"],
      answer: [0],
      explain: "Risques nucléaires, terrorisme ou dommages naturels dépassent la capacité d'un seul assureur : le pool répartit l'engagement entre plusieurs participants." },

    { id: 'm1c7x12', chap: 'c7', type: 'single',
      q: "Si la cédante fait faillite, l'assuré peut-il réclamer directement au réassureur ?",
      choices: ["Oui, il dispose d'une action directe", "Non, il n'a aucun lien contractuel avec le réassureur", "Oui, à concurrence de la part cédée", "Oui, si la FINMA l'autorise"],
      answer: [1],
      explain: "Le contrat de réassurance ne profite qu'à la cédante. L'assuré est protégé par la fortune liée, non par un droit direct contre le réassureur." },

    { id: 'm1c7x13', chap: 'c7', type: 'multi',
      q: "Quels avantages la réassurance procure-t-elle à la cédante ?",
      choices: ["Capacité de souscription accrue", "Stabilisation des résultats", "Allègement des exigences de solvabilité", "Transfert de savoir-faire technique", "Suppression de l'obligation de constituer des provisions"],
      answer: [0, 1, 2, 3],
      explain: "La cédante reste seule débitrice envers ses assurés : elle doit continuer à provisionner intégralement ses engagements." },

    { id: 'm1c7x14', chap: 'c7', type: 'single',
      q: "Une captive de réassurance appartenant à un groupe industriel permet notamment :",
      choices: ["D'accéder directement au marché de la réassurance et de garder le bénéfice technique", "D'éviter toute surveillance", "De supprimer les risques du groupe", "De se dispenser d'assurance obligatoire"],
      answer: [0],
      explain: "Le groupe conserve économiquement ses bons risques, mutualise les autres et négocie sa protection directement auprès des réassureurs." },

    { id: 'm1c7x15', chap: 'c7', type: 'single',
      q: "Le principal réassureur suisse de dimension mondiale est :",
      choices: ["La SUVA", "Swiss Re", "La FINMA", "L'ASA"],
      answer: [1],
      explain: "Swiss Re est l'un des deux plus grands réassureurs mondiaux ; la présence de tels acteurs explique le poids international de la place suisse." },

    { id: 'm1c7x16', chap: 'c7', type: 'single',
      q: "Un traité de réassurance obligatoire signifie que :",
      choices: ["La cédante cède et le réassureur accepte automatiquement tous les risques de la catégorie définie", "La FINMA impose la réassurance", "L'assuré doit consentir à la cession", "Le traité est imposé par la loi"],
      answer: [0],
      explain: "« Obligatoire » qualifie l'automatisme entre les parties au traité, et non une contrainte légale : chacune est liée pour toute la catégorie convenue." },

    { id: 'm1c7x17', chap: 'c7', type: 'single',
      q: "Pourquoi la réassurance est-elle exonérée du droit de timbre ?",
      choices: ["Parce qu'elle concerne des contrats entre professionnels et non des preneurs finaux", "Parce qu'elle n'est pas rentable", "Parce qu'elle est interdite en Suisse", "Parce qu'elle relève du droit public"],
      answer: [0],
      explain: "Le timbre frappe les primes payées par les preneurs d'assurance. Taxer la réassurance reviendrait à imposer deux fois le même risque." },

    { id: 'm1c7x18', chap: 'c7', type: 'single',
      q: "La rétrocession permet au réassureur :",
      choices: ["De céder à son tour une partie des risques acceptés", "De reprendre les contrats de l'assureur direct", "De vendre des polices aux particuliers", "De supprimer sa propre solvabilité"],
      answer: [0],
      explain: "La dissémination des très grands risques passe par des chaînes de rétrocession qui répartissent l'engagement dans le marché mondial." },

    { id: 'm1c7x19', chap: 'c7', type: 'single',
      q: "Dans une quote-part, que reçoit le réassureur en contrepartie de sa participation aux sinistres ?",
      choices: ["Rien", "La même proportion des primes", "Une commission fixe uniquement", "Le capital-actions correspondant"],
      answer: [1],
      explain: "Le partage est symétrique : mêmes proportions sur les primes et les sinistres, corrigé par une commission de réassurance versée à la cédante." },

    { id: 'm1c7x20', chap: 'c7', type: 'single',
      q: "Un excess of loss « par événement » couvre :",
      choices: ["Un sinistre individuel seulement", "L'accumulation des sinistres provoqués par un même événement, au-delà de la priorité", "Le résultat annuel global", "Les frais d'acquisition"],
      answer: [1],
      explain: "Une tempête causant mille petits dommages est traitée comme un seul événement : c'est la protection adaptée aux risques de cumul." },

    { id: 'm1c7x21', chap: 'c7', type: 'multi',
      q: "Quels instruments relèvent du transfert alternatif du risque (ART) ?",
      choices: ["Les captives", "Les cat bonds", "Les pools", "La quote-part classique", "Les titres liés à l'assurance (ILS)"],
      answer: [0, 1, 2, 4],
      explain: "La quote-part est de la réassurance traditionnelle. L'ART cherche des capacités hors du marché classique, notamment sur les marchés financiers." },

    { id: 'm1c7x22', chap: 'c7', type: 'single',
      q: "La réassurance influence la solvabilité de la cédante parce qu'elle :",
      choices: ["Augmente son capital-actions", "Réduit son exposition nette au risque, donc son besoin de capital", "Supprime ses provisions", "Diminue ses primes encaissées uniquement"],
      answer: [1],
      explain: "Le SST tient compte de la réassurance : en réduisant les pertes potentielles, elle abaisse le capital cible exigé de l'assureur." },

    { id: 'm1c7x23', chap: 'c7', type: 'single',
      q: "Le risque de crédit en réassurance désigne :",
      choices: ["Le risque que l'assuré ne paie pas sa prime", "Le risque que le réassureur ne soit pas en mesure d'honorer ses engagements", "Le risque de change", "Le risque de taux d'intérêt"],
      answer: [1],
      explain: "Céder un risque, c'est le remplacer par une créance sur le réassureur : sa solidité financière doit donc être surveillée en permanence." },

    { id: 'm1c7x24', chap: 'c7', type: 'single',
      q: "Pourquoi la réassurance est-elle particulièrement importante en assurance des dommages naturels ?",
      choices: ["Parce que les primes y sont faibles", "En raison du fort potentiel de cumul d'un événement unique", "Parce que la loi l'impose", "Parce que les assurés sont peu nombreux"],
      answer: [1],
      explain: "Grêle, tempête ou inondation touchent simultanément des milliers de contrats dans une même région : la compensation dans l'espace ne joue plus." },

    { id: 'm1c7x25', chap: 'c7', type: 'single',
      q: "La réassurance non proportionnelle se rémunère :",
      choices: ["Par une part proportionnelle des primes du portefeuille", "Par une prime négociée en fonction de l'exposition, sans proportion avec les primes originales", "Par une commission de courtage", "Elle est gratuite"],
      answer: [1],
      explain: "La prime XL est calculée sur la probabilité que la tranche protégée soit atteinte : elle n'a pas de rapport arithmétique avec les primes du portefeuille." },

    { id: 'm1c7x26', chap: 'c7', type: 'single',
      q: "Dans une quote-part de 25 %, sur des primes de CHF 4 millions, le réassureur reçoit :",
      choices: ["CHF 250 000.–", "CHF 500 000.–", "CHF 1 million", "CHF 3 millions"],
      answer: [2],
      explain: "25 % de 4 millions = CHF 1 million, et il supportera dans la même proportion 25 % des sinistres du portefeuille cédé." },

    { id: 'm1c7x27', chap: 'c7', type: 'single',
      q: "Le courtier en réassurance intervient :",
      choices: ["Entre l'assuré et l'assureur direct", "Entre la cédante et les réassureurs", "Entre la FINMA et les assureurs", "Entre les assurés et l'Ombudsman"],
      answer: [1],
      explain: "Il place les programmes de réassurance auprès du marché, conseille sur la structure des traités et négocie les conditions pour la cédante." },

    { id: 'm1c7x28', chap: 'c7', type: 'single',
      q: "Une entreprise industrielle qui crée sa propre captive cherche avant tout :",
      choices: ["À se soustraire à toute assurance obligatoire", "À optimiser le coût de ses risques et à accéder à la réassurance", "À vendre des assurances au public", "À éviter la surveillance de son pays"],
      answer: [1],
      explain: "La captive rationalise le financement des risques du groupe ; elle est elle-même une entreprise d'assurance soumise à une surveillance." },

    { id: 'm1c7x29', chap: 'c7', type: 'single',
      q: "La réassurance permet à un jeune assureur en croissance :",
      choices: ["De souscrire des risques dépassant sa propre capacité financière", "De se dispenser d'autorisation", "D'éviter de constituer un capital", "De renoncer à l'actuaire responsable"],
      answer: [0],
      explain: "C'est la fonction de capacité : sans réassurance, un assureur de taille modeste ne pourrait accepter que de très petits risques." },

    { id: 'm1c7x30', chap: 'c7', type: 'multi',
      q: "Quelles formes de réassurance sont non proportionnelles ?",
      choices: ["Excess of loss par risque", "Excess of loss par événement", "Stop loss", "Quote-part", "Excédent de plein"],
      answer: [0, 1, 2],
      explain: "Quote-part et excédent de plein partagent primes et sinistres dans une même proportion : ils sont proportionnels par définition." },

    /* ================= c8 — Surveillance et solvabilité ================= */
    { id: 'm1c8x01', chap: 'c8', type: 'single',
      q: "Quel est le statut juridique de la FINMA ?",
      choices: ["Un département de l'administration fédérale", "Un établissement de droit public indépendant doté de la personnalité juridique", "Une société anonyme", "Une association de droit privé"],
      answer: [1],
      explain: "Son autonomie institutionnelle, fonctionnelle et financière la met à l'abri des influences politiques et de celles du secteur surveillé." },

    { id: 'm1c8x02', chap: 'c8', type: 'single',
      q: "La FINMA approuve-t-elle en principe les tarifs avant leur mise sur le marché ?",
      choices: ["Oui, pour toutes les branches", "Non, sauf exceptions comme l'assurance-maladie complémentaire", "Oui, pour les seules assurances de choses", "Non, jamais, sans aucune exception"],
      answer: [1],
      explain: "La surveillance porte sur la solvabilité et les abus, non sur les prix. L'approbation préalable subsiste là où la protection des assurés l'exige particulièrement." },

    { id: 'm1c8x03', chap: 'c8', type: 'multi',
      q: "De quels instruments la FINMA dispose-t-elle ?",
      choices: ["Octroi et retrait de l'autorisation", "Nomination d'un chargé d'enquête", "Contrôles sur place", "Interdiction d'exercer à l'encontre de personnes", "Fixation du montant des primes du marché"],
      answer: [0, 1, 2, 3],
      explain: "La fixation des primes relève de la liberté économique des assureurs ; la FINMA intervient seulement si un tarif traduit un abus ou met en péril la solvabilité." },

    { id: 'm1c8x04', chap: 'c8', type: 'single',
      q: "Le capital cible dans le SST correspond :",
      choices: ["Au capital-actions inscrit au registre du commerce", "Au capital nécessaire pour couvrir les risques sur un horizon d'un an avec un niveau de confiance élevé", "À la somme des primes encaissées", "Au montant de la fortune liée"],
      answer: [1],
      explain: "Le SST modélise les pertes possibles sur un an : le capital porteur de risque doit rester supérieur à ce capital cible, sous peine d'intervention." },

    { id: 'm1c8x05', chap: 'c8', type: 'single',
      q: "Un ratio SST de 85 % signifie que :",
      choices: ["L'assureur est très solide", "Le capital porteur de risque est insuffisant et la FINMA intervient", "85 % des sinistres sont payés", "La fortune liée est excédentaire"],
      answer: [1],
      explain: "En dessous de 100 %, l'assureur ne couvre plus le capital cible : la FINMA exige un plan de mesures et peut restreindre son activité." },

    { id: 'm1c8x06', chap: 'c8', type: 'single',
      q: "Quelle est la particularité de la fortune liée en cas de faillite de l'assureur ?",
      choices: ["Elle est répartie entre tous les créanciers", "Elle est affectée en priorité aux prétentions découlant des contrats d'assurance", "Elle revient aux actionnaires", "Elle est versée à la Confédération"],
      answer: [1],
      explain: "Cette affectation privilégiée est la protection essentielle des assurés : leurs créances passent avant celles des autres créanciers de l'entreprise." },

    { id: 'm1c8x07', chap: 'c8', type: 'multi',
      q: "Quelles exigences la LSA impose-t-elle à une entreprise d'assurance ?",
      choices: ["Un plan d'exploitation approuvé", "Des provisions techniques suffisantes", "Une fortune liée", "Un actuaire responsable", "Un nombre minimal d'intermédiaires"],
      answer: [0, 1, 2, 3],
      explain: "Le nombre d'intermédiaires relève de la stratégie commerciale et n'est évidemment pas une condition d'autorisation." },

    { id: 'm1c8x08', chap: 'c8', type: 'single',
      q: "L'Ombudsman de l'assurance privée peut :",
      choices: ["Rendre des décisions contraignantes", "Émettre des recommandations et faciliter un accord", "Prononcer des amendes", "Retirer l'autorisation d'un assureur"],
      answer: [1],
      explain: "Sa force réside dans son autorité morale et sa connaissance du secteur : les assureurs suivent généralement ses recommandations, sans y être contraints." },

    { id: 'm1c8x09', chap: 'c8', type: 'single',
      q: "La saisine de l'Ombudsman coûte au client :",
      choices: ["CHF 200.–", "Un pourcentage du litige", "Rien, elle est gratuite", "Les frais d'avocat"],
      answer: [2],
      explain: "La gratuité et l'absence de formalisme rendent la médiation accessible à tous, sans renoncer à la voie judiciaire en cas d'échec." },

    { id: 'm1c8x10', chap: 'c8', type: 'single',
      q: "La surveillance des assurances vise principalement à protéger :",
      choices: ["Les actionnaires des compagnies", "Les assurés", "Les intermédiaires", "Les concurrents étrangers"],
      answer: [1],
      explain: "L'art. 1 LSA place la protection des assurés contre les risques d'insolvabilité et contre les abus au cœur du dispositif." },

    { id: 'm1c8x11', chap: 'c8', type: 'single',
      q: "Le chargé d'enquête nommé par la FINMA a pour mission :",
      choices: ["De diriger définitivement l'entreprise", "d'établir les faits sur place et d'exécuter les mesures ordonnées", "De vendre le portefeuille", "De représenter les assurés en justice"],
      answer: [1],
      explain: "C'est un instrument d'investigation et d'exécution : la FINMA le mandate lorsqu'elle a besoin d'un accès direct et rapide à l'entreprise." },

    { id: 'm1c8x12', chap: 'c8', type: 'single',
      q: "Une entreprise d'assurance qui souhaite étendre son activité à une nouvelle branche doit :",
      choices: ["Simplement informer ses clients", "Obtenir une extension de son autorisation auprès de la FINMA", "Demander l'accord de l'ASA", "Modifier son capital uniquement"],
      answer: [1],
      explain: "L'autorisation est délivrée par branche : toute extension suppose une modification du plan d'exploitation soumise à la FINMA." },

    { id: 'm1c8x13', chap: 'c8', type: 'single',
      q: "Le transfert d'un portefeuille d'assurance à une autre compagnie :",
      choices: ["Est libre", "Requiert l'approbation de la FINMA", "Nécessite l'accord individuel de chaque assuré uniquement", "Est interdit"],
      answer: [1],
      explain: "La FINMA vérifie que les intérêts des assurés sont préservés ; ceux-ci sont informés et disposent en principe d'un droit de résiliation." },

    { id: 'm1c8x14', chap: 'c8', type: 'single',
      q: "Que se passe-t-il si un assureur ne respecte plus les exigences de solvabilité ?",
      choices: ["Rien tant qu'il paie les sinistres", "La FINMA ordonne des mesures pouvant aller jusqu'au retrait de l'autorisation", "L'ASA intervient", "Les assurés doivent payer une prime supplémentaire"],
      answer: [1],
      explain: "L'échelle des interventions va du plan de redressement à la restriction de la libre disposition des actifs, jusqu'à la liquidation de l'entreprise." },

    { id: 'm1c8x15', chap: 'c8', type: 'multi',
      q: "Quelles voies s'offrent à un assuré en désaccord avec son assureur ?",
      choices: ["Réclamation interne auprès de l'assureur", "Médiation par l'Ombudsman", "Action devant le tribunal civil", "Recours devant la FINMA contre la décision de prestation", "Plainte auprès du PFPDT pour les questions de données"],
      answer: [0, 1, 2, 4],
      explain: "La FINMA n'est pas une instance de recours pour les litiges contractuels : elle ne se prononce pas sur le bien-fondé d'une prestation refusée." },

    { id: 'm1c8x16', chap: 'c8', type: 'single',
      q: "Pourquoi la FINMA ne figure-t-elle pas au budget ordinaire de la Confédération ?",
      choices: ["Parce qu'elle est une société privée", "Parce qu'elle se finance par les taxes et émoluments prélevés auprès des assujettis, ce qui assure son indépendance", "Parce que les cantons la financent", "Parce qu'elle prélève une taxe sur chaque prime payée par les assurés"],
      answer: [1],
      explain: "Les assujettis eux-mêmes financent la surveillance. La FINMA n'est donc tributaire ni du Parlement pour son budget, ni de l'impôt : c'est une garantie d'indépendance, et non un statut privé." },

    { id: 'm1c8x17', chap: 'c8', type: 'single',
      q: "Les assurances complémentaires à l'assurance-maladie sont surveillées par :",
      choices: ["L'OFSP", "La FINMA", "Les cantons", "L'Ombudsman"],
      answer: [1],
      explain: "Complémentaires = LCA = FINMA. L'assurance de base LAMal relève en revanche de l'Office fédéral de la santé publique." },

    { id: 'm1c8x18', chap: 'c8', type: 'single',
      q: "Le SST se distingue d'un modèle purement comptable parce qu'il :",
      choices: ["Utilise des valeurs proches du marché et une approche fondée sur le risque", "Se limite au capital-actions", "Ignore les engagements futurs", "Ne concerne que la réassurance"],
      answer: [0],
      explain: "Actifs et passifs sont évalués en valeurs de marché, et le capital exigé dépend du profil de risque réel de l'assureur, non de simples ratios comptables." },

    { id: 'm1c8x19', chap: 'c8', type: 'single',
      q: "Un client estime que son assureur a violé la protection des données. Il peut s'adresser :",
      choices: ["Au PFPDT", "À l'ASA", "Au MROS", "Au Bureau national d'assurance"],
      answer: [0],
      explain: "Le Préposé fédéral à la protection des données et à la transparence est l'autorité compétente en matière de traitement des données personnelles." },

    { id: 'm1c8x20', chap: 'c8', type: 'single',
      q: "L'agrément des personnes chargées de la haute direction d'un assureur relève :",
      choices: ["De l'assemblée générale uniquement", "de l'exigence de garantie d'une activité irréprochable contrôlée par la FINMA", "Du registre du commerce", "De l'ASA"],
      answer: [1],
      explain: "Dirigeants et administrateurs doivent jouir d'une bonne réputation et disposer des compétences nécessaires ; la FINMA peut s'opposer à une nomination." },

    { id: 'm1c8x21', chap: 'c8', type: 'single',
      q: "Les provisions techniques figurent :",
      choices: ["À l'actif du bilan", "Au passif du bilan", "Hors bilan", "Dans le compte de résultat uniquement"],
      answer: [1],
      explain: "Ce sont des dettes envers les assurés : elles s'inscrivent au passif, tandis que les placements qui les couvrent figurent à l'actif." },

    { id: 'm1c8x22', chap: 'c8', type: 'single',
      q: "Que signifie la « surveillance des abus » ?",
      choices: ["Le contrôle des prix du marché", "L'intervention contre les pratiques qui désavantagent gravement et systématiquement les assurés", "La poursuite pénale des fraudeurs", "La vérification des sinistres individuels"],
      answer: [1],
      explain: "Elle vise les comportements structurels : clauses inéquitables, refus systématiques de prestation, pratiques de distribution trompeuses." },

    { id: 'm1c8x23', chap: 'c8', type: 'single',
      q: "Les entreprises d'assurance ne relevant pas de la surveillance suisse peuvent-elles démarcher librement des clients en Suisse ?",
      choices: ["Oui, sans restriction", "Non, l'exercice de l'activité d'assurance en Suisse suppose une autorisation", "Oui, si elles sont européennes", "Oui, pour les seules assurances-vie"],
      answer: [1],
      explain: "Exercer sans autorisation expose à des sanctions ; l'intermédiaire qui place des affaires auprès d'un assureur non autorisé perd son inscription au registre." },

    { id: 'm1c8x24', chap: 'c8', type: 'single',
      q: "Les clients « professionnels » au sens de la LSA révisée bénéficient :",
      choices: ["D'une protection renforcée", "D'un régime allégé, car présumés capables d'apprécier les risques", "D'une exonération du droit de timbre", "D'un accès prioritaire à l'Ombudsman"],
      answer: [1],
      explain: "Grandes entreprises et professionnels avertis n'ont pas besoin de la même protection que les consommateurs : certaines règles ne s'appliquent pas à eux." },

    { id: 'm1c8x25', chap: 'c8', type: 'single',
      q: "La liquidation d'une entreprise d'assurance en difficulté est menée :",
      choices: ["Par l'assemblée générale seule", "Sous la conduite de la FINMA", "Par l'ASA", "Par le tribunal de commerce sans intervention de la FINMA"],
      answer: [1],
      explain: "La FINMA dispose de compétences spéciales en matière d'assainissement et de faillite des assureurs, précisément pour préserver les intérêts des assurés." },

    { id: 'm1c8x26', chap: 'c8', type: 'multi',
      q: "Quels éléments protègent concrètement l'assuré contre l'insolvabilité de son assureur ?",
      choices: ["La fortune liée", "Les exigences de solvabilité (SST)", "Les provisions techniques suffisantes", "La surveillance de la FINMA", "Le droit de timbre"],
      answer: [0, 1, 2, 3],
      explain: "Le droit de timbre est une taxe fiscale qui alimente la Confédération : il n'a aucune fonction de protection des assurés." },

    { id: 'm1c8x27', chap: 'c8', type: 'single',
      q: "Le rapport sur la situation financière (SFCR) publié par les assureurs vise :",
      choices: ["À informer le public et le marché sur la solvabilité et la situation financière", "À remplacer les comptes annuels", "À fixer les primes", "À dénoncer les concurrents"],
      answer: [0],
      explain: "La transparence publique complète la surveillance : chacun peut apprécier la solidité financière de l'assureur avec lequel il envisage de contracter." },

    { id: 'm1c8x28', chap: 'c8', type: 'single',
      q: "Un assuré conteste un refus de prestation. Quel est l'ordre logique des démarches ?",
      choices: ["Tribunal, puis Ombudsman, puis assureur", "Assureur, puis Ombudsman, puis tribunal", "FINMA, puis assureur, puis tribunal", "Ombudsman, puis FINMA, puis assureur"],
      answer: [1],
      explain: "On commence toujours par la réclamation interne, puis la médiation gratuite, et l'on réserve la voie judiciaire aux cas non résolus." },

    { id: 'm1c8x29', chap: 'c8', type: 'single',
      q: "La FINMA surveille également :",
      choices: ["Uniquement les assureurs", "Les banques, les assurances, les marchés et certains intermédiaires financiers", "Uniquement les intermédiaires", "Les caisses de pension"],
      answer: [1],
      explain: "C'est une autorité de surveillance intégrée. Les institutions de prévoyance relèvent en revanche des autorités de surveillance LPP et de la Commission de haute surveillance." },

    { id: 'm1c8x30', chap: 'c8', type: 'single',
      q: "L'autorégulation de la branche (standards de l'ASA, Cicero) :",
      choices: ["Remplace intégralement la loi", "Complète le cadre légal par des règles que la branche se donne elle-même", "N'a aucune portée pratique", "Est imposée par la FINMA aux seuls réassureurs"],
      answer: [1],
      explain: "L'autorégulation précise et concrétise les exigences légales, notamment en matière de formation continue et de conduite lors de la distribution." }
  ]);
})();
