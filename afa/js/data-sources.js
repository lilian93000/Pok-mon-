/* =============================================================
   AFA – Questions adossées à des sources officielles (2025–2026)

   Chaque question porte un champ `src` { t: titre, u: url } affiché
   dans la correction. Les faits ont été contrôlés en août 2026
   contre les publications officielles citées (OFAS, OFSP, FINMA,
   Fedlex, AFA/VBV).

   Ces questions sont marquées lvl:'src' pour pouvoir être isolées.
   ============================================================= */
(function () {
  const add = (mid, list) => {
    const m = (window.AFA_MODULES || []).find(x => x.id === mid);
    if (m) m.questions.push(...list.map(q => ({ ...q, lvl: 'src' })));
  };

  /* Sources réutilisées */
  const S = {
    r13:   { t: "OFAS — Mise en œuvre de l'initiative pour une 13e rente AVS", u: "https://www.bsv.admin.ch/fr/misenoeuvre-13-rente-avs" },
    avs21: { t: "OFAS — Stabilisation de l'AVS (AVS 21)", u: "https://www.bsv.admin.ch/bsv/fr/home/assurances-sociales/ahv/reformes-et-revisions/ahv-21.html" },
    lpp24: { t: "Votation fédérale du 22 septembre 2024 — Réforme LPP", u: "https://www.easyvote.ch/fr/votations/22-septembre-2024/reforme-lpp" },
    efas:  { t: "OFSP — Votation sur le financement uniforme des prestations (EFAS)", u: "https://www.bag.admin.ch/fr/votation-populaire-concernant-la-modification-de-la-loi-federale-sur-lassurance-maladie-lamal-financement-uniforme-des-prestations" },
    prim:  { t: "OFSP / Priminfo — Prime moyenne de l'assurance-maladie", u: "https://www.priminfo.admin.ch/fr/zahlen-und-fakten/mittlere_praemie" },
    mont:  { t: "OFAS — Montants valables à partir du 1er janvier 2026", u: "https://www.bsv.admin.ch/dam/bsv/fr/dokumente/ahv/uebersichten/renten-und-beitraege-20260101.pdf.download.pdf/renten-und-beitraege-20260101.pdf" },
    fmark: { t: "FINMA — Rapport sur le marché de l'assurance 2024 (publié le 3.9.2025)", u: "https://www.finma.ch/fr/~/media/finma/dokumente/dokumentencenter/myfinma/finma-publikationen/versicherungsbericht/20250903-versicherungsmarktbericht-2024.pdf" },
    fra25: { t: "FINMA — Rapport annuel 2025", u: "https://report.finma.ch/2025/fr/" },
    lca:   { t: "Fedlex — Loi fédérale sur le contrat d'assurance (LCA, RS 221.229.1)", u: "https://www.fedlex.admin.ch/eli/cc/24/719_735_717/fr" },
    lcarev:{ t: "ASA — Ce qui change avec la LCA révisée", u: "https://www.svv.ch/fr/secteur/reglementation-et-surveillance/quest-ce-qui-change-avec-la-lca-revisee" },
    vbv:   { t: "AFA/VBV — Profil professionnel Intermédiaire d'assurance AFA", u: "https://www.vbv.ch/fr/qualifications/intermediaire-dassurance-afa" }
  };

  /* ================= MODULE 1 ================= */
  add('m1', [
    /* --- 13e rente AVS --- */
    { id: 'm1s01', chap: 'c3', type: 'single', src: S.r13,
      q: "Quand la 13e rente AVS est-elle versée pour la première fois ?",
      choices: ["En janvier 2025", "En décembre 2026", "En janvier 2027", "Elle n'est pas encore décidée"],
      answer: [1],
      explain: "Le supplément est versé une fois par an avec la rente de décembre ; le premier versement intervient en décembre 2026." },

    { id: 'm1s02', chap: 'c3', type: 'single', src: S.r13,
      q: "À combien correspond le montant de la 13e rente AVS ?",
      choices: ["À un mois de salaire moyen", "À un douzième de la rente de vieillesse annuelle", "À CHF 1 000.– forfaitaires", "À 10 % de la rente annuelle"],
      answer: [1],
      explain: "Le supplément équivaut à un douzième de la rente de vieillesse annuelle, arrondi au franc. Le calcul définitif n'est possible qu'en décembre, la rente pouvant varier en cours d'année." },

    { id: 'm1s03', chap: 'c3', type: 'multi', src: S.r13,
      q: "Quelles affirmations sur la 13e rente AVS sont exactes ?",
      choices: ["Elle est versée automatiquement, sans démarche de l'assuré", "Elle concerne les personnes ayant droit à une rente de vieillesse en décembre", "Les caisses de compensation en assurent le calcul et le versement", "Elle est versée en douze mensualités", "Il faut en faire la demande écrite chaque année"],
      answer: [0, 1, 2],
      explain: "Il s'agit d'un supplément unique à la rente de décembre, versé d'office par les caisses de compensation : ni demande ni fractionnement mensuel." },

    { id: 'm1s04', chap: 'c3', type: 'single', src: S.r13,
      q: "Une personne au bénéfice d'une rente AVS maximale de CHF 2 520.– par mois. À quel ordre de grandeur s'élève sa 13e rente ?",
      choices: ["CHF 210.–", "CHF 2 520.–", "CHF 30 240.–", "CHF 1 260.–"],
      answer: [1],
      explain: "Un douzième de la rente annuelle (2 520 × 12 = 30 240) équivaut à une mensualité, soit CHF 2 520.–. Le supplément correspond donc bien à un « 13e mois » de rente." },

    /* --- AVS 21 --- */
    { id: 'm1s05', chap: 'c3', type: 'single', src: S.avs21,
      q: "Depuis quand la réforme AVS 21 est-elle en vigueur ?",
      choices: ["Depuis le 1er janvier 2022", "Depuis le 1er janvier 2024", "Depuis le 1er janvier 2026", "Elle a été refusée en votation"],
      answer: [1],
      explain: "Acceptée en votation le 25 septembre 2022, la réforme AVS 21 est entrée en vigueur le 1er janvier 2024." },

    { id: 'm1s06', chap: 'c3', type: 'single', src: S.avs21,
      q: "Quel est l'âge de référence AVS des femmes en 2026 ?",
      choices: ["64 ans", "64 ans et 3 mois", "64 ans et 6 mois", "65 ans"],
      answer: [2],
      explain: "L'âge de référence des femmes est relevé de trois mois par an dès 2025. En 2026, la deuxième étape le porte à 64 ans et 6 mois, pour les femmes nées en 1962." },

    { id: 'm1s07', chap: 'c3', type: 'single', src: S.avs21,
      q: "Comment le relèvement de l'âge de référence des femmes s'opère-t-il ?",
      choices: ["D'un seul coup au 1er janvier 2025", "Par étapes de trois mois par année de naissance, jusqu'à 65 ans", "Par étapes de six mois", "Il reste facultatif"],
      answer: [1],
      explain: "Le relèvement de 64 à 65 ans se fait en quatre étapes de trois mois, la première étant intervenue le 1er janvier 2025." },

    /* --- Réforme LPP rejetée --- */
    { id: 'm1s08', chap: 'c3', type: 'single', src: S.lpp24,
      q: "Qu'est-il advenu de la réforme de la LPP soumise au peuple le 22 septembre 2024 ?",
      choices: ["Elle a été acceptée et est en vigueur", "Elle a été nettement rejetée (67,1 % de non)", "Elle a été acceptée mais reportée", "Elle n'a jamais été soumise au vote"],
      answer: [1],
      explain: "Le rejet a été massif : 67,1 % de non. C'est un point d'actualité classique, souvent confondu avec l'acceptation d'AVS 21." },

    { id: 'm1s09', chap: 'c3', type: 'single', src: S.lpp24,
      q: "Quelle conséquence directe le rejet de la réforme LPP a-t-il sur le taux de conversion minimal ?",
      choices: ["Il est abaissé à 6 %", "Il reste fixé à 6,8 %", "Il est porté à 7 %", "Il est supprimé"],
      answer: [1],
      explain: "La réforme prévoyait de l'abaisser de 6,8 % à 6 %. Son rejet maintient le taux de conversion minimal légal à 6,8 % dans le régime obligatoire." },

    { id: 'm1s10', chap: 'c3', type: 'multi', src: S.lpp24,
      q: "Que faut-il retenir de la votation LPP du 22 septembre 2024 ?",
      choices: ["Le projet visait à abaisser le taux de conversion minimal", "Le projet a été refusé par le peuple", "Le taux de conversion minimal demeure inchangé", "La déduction de coordination a été supprimée", "Le seuil d'entrée a été abaissé comme prévu"],
      answer: [0, 1, 2],
      explain: "Le refus laisse le régime obligatoire inchangé : ni la déduction de coordination ni le seuil d'entrée n'ont été modifiés par ce projet." },

    /* --- EFAS et LAMal --- */
    { id: 'm1s11', chap: 'c3', type: 'single', src: S.efas,
      q: "Que prévoit la réforme EFAS acceptée le 24 novembre 2024 ?",
      choices: ["La suppression de l'assurance-maladie obligatoire", "Le financement uniforme des prestations ambulatoires et stationnaires dans la LAMal", "La création d'une caisse-maladie unique", "L'abandon des franchises"],
      answer: [1],
      explain: "EFAS modifie la LAMal pour unifier la clé de financement entre cantons et assureurs, quel que soit le cadre — ambulatoire ou stationnaire — dans lequel la prestation est fournie." },

    { id: 'm1s12', chap: 'c3', type: 'single', src: S.efas,
      q: "Avec quel résultat le peuple a-t-il accepté EFAS ?",
      choices: ["Par 53,3 % des voix", "Par 67,1 % des voix", "À l'unanimité des cantons", "Il l'a refusée"],
      answer: [0],
      explain: "Acceptation serrée, à 53,3 %, malgré l'opposition des cantons romands. À ne pas confondre avec les 67,1 % de non à la réforme LPP." },

    { id: 'm1s13', chap: 'c3', type: 'single', src: S.prim,
      q: "À combien s'élève la prime mensuelle moyenne de l'assurance-maladie obligatoire en 2026 ?",
      choices: ["CHF 359.50", "CHF 376.70", "CHF 393.30", "CHF 412.–"],
      answer: [2],
      explain: "La prime moyenne 2026 s'établit à CHF 393.30 par mois, en hausse de CHF 16.60 (soit 4,4 %) par rapport à 2025." },

    { id: 'm1s14', chap: 'c3', type: 'single', src: S.prim,
      q: "De combien la prime moyenne de l'assurance-maladie a-t-elle augmenté pour 2026 ?",
      choices: ["De 1,5 %", "De 4,4 %", "De 8,7 %", "Elle a baissé"],
      answer: [1],
      explain: "Hausse de 4,4 %, annoncée par l'OFSP fin septembre 2025, en lien avec la progression des coûts de la santé." },

    /* --- Montants 2026 --- */
    { id: 'm1s15', chap: 'c3', type: 'single', src: S.mont,
      q: "Quelle est la rente AVS de vieillesse mensuelle maximale d'une personne seule en 2026 ?",
      choices: ["CHF 2 450.–", "CHF 2 520.–", "CHF 2 620.–", "CHF 3 780.–"],
      answer: [1],
      explain: "Rente minimale CHF 1 260.–, maximale CHF 2 520.– par mois. Ces montants sont inchangés par rapport à 2025, les rentes n'étant adaptées que tous les deux ans." },

    { id: 'm1s16', chap: 'c3', type: 'multi', src: S.mont,
      q: "Quelles valeurs LPP sont exactes pour 2026 ?",
      choices: ["Seuil d'entrée CHF 22 680.–", "Déduction de coordination CHF 26 460.–", "Salaire coordonné maximal CHF 64 260.–", "Salaire LPP maximal assurable CHF 90 720.–", "Salaire coordonné minimal CHF 7 258.–"],
      answer: [0, 1, 2, 3],
      explain: "Le salaire coordonné minimal est de CHF 3 780.–. Le montant de CHF 7 258.– correspond au maximum du pilier 3a pour une personne affiliée à une caisse de pension." },

    { id: 'm1s17', chap: 'c3', type: 'single', src: S.mont,
      q: "Quel est le gain annuel maximal assuré selon la LAA en 2026 ?",
      choices: ["CHF 90 720.–", "CHF 126 000.–", "CHF 148 200.–", "Il n'y a pas de plafond"],
      answer: [2],
      explain: "CHF 148 200.– par an, montant qui sert aussi de plafond au salaire soumis à l'assurance-chômage." },

    /* --- Marché et surveillance --- */
    { id: 'm1s18', chap: 'c5', type: 'single', src: S.fmark,
      q: "Selon le rapport de la FINMA sur le marché de l'assurance 2024, comment le volume des primes non-vie a-t-il évolué en 2024 ?",
      choices: ["Il a reculé", "Il a progressé, à un rythme plus contenu qu'en 2023 (2,5 % contre 3,3 %)", "Il a doublé", "Il est resté strictement stable"],
      answer: [1],
      explain: "La croissance s'est poursuivie mais s'est tassée : 2,5 % en 2024 contre 3,3 % en 2023, selon le rapport publié le 3 septembre 2025." },

    { id: 'm1s19', chap: 'c8', type: 'single', src: S.fra25,
      q: "Quelle mission la FINMA met-elle en avant dans son rapport annuel 2025 ?",
      choices: ["Maximiser les bénéfices des assureurs", "La stabilité de la place financière et la protection des clients, dans un contexte de risques accrus", "La fixation des primes du marché", "La gestion des sinistres individuels"],
      answer: [1],
      explain: "Le rapport souligne l'augmentation des risques financiers et non financiers en 2025 et rappelle le double objectif de la surveillance : stabilité et protection de la clientèle." },

    /* --- Examen AFA lui-même --- */
    { id: 'm1s20', chap: 'c6', type: 'single', src: S.vbv,
      q: "Comment se compose l'examen final d'intermédiaire d'assurance AFA ?",
      choices: ["D'un unique examen écrit de 3 heures", "D'une partie électronique de 120 minutes et d'une partie orale", "D'un mémoire à rendre", "D'un contrôle continu uniquement"],
      answer: [1],
      explain: "L'examen comprend une partie électronique de 120 minutes et une partie orale d'environ 60 minutes, dont une trentaine de minutes de préparation." },

    { id: 'm1s21', chap: 'c6', type: 'single', src: S.vbv,
      q: "La certification d'intermédiaire d'assurance AFA se décline notamment selon quels profils ?",
      choices: ["Un profil unique et obligatoire", "Plusieurs profils, dont « toutes branches », « vie » et « non-vie »", "Un profil par canton", "Un profil par compagnie d'assurance"],
      answer: [1],
      explain: "Le choix du profil détermine les branches dans lesquelles l'intermédiaire est habilité à conseiller et à conclure des contrats." }
  ]);

  /* ================= MODULE 2 ================= */
  add('m2', [
    { id: 'm2s01', chap: 'c3', type: 'single', src: S.lcarev,
      q: "Quel délai de révocation la LCA révisée accorde-t-elle au preneur d'assurance ?",
      choices: ["7 jours", "14 jours", "30 jours", "Aucun"],
      answer: [1],
      explain: "L'art. 2a LCA introduit un droit de révocation de 14 jours dès la proposition ou l'acceptation, exerçable par écrit ou par tout moyen permettant la preuve par un texte." },

    { id: 'm2s02', chap: 'c5', type: 'single', src: S.lcarev,
      q: "Quel est le délai de prescription des créances découlant du contrat d'assurance depuis la révision entrée en vigueur en 2022 ?",
      choices: ["2 ans", "5 ans", "10 ans", "1 an"],
      answer: [1],
      explain: "L'art. 46 LCA porte le délai de deux à cinq ans dès le fait d'où naît l'obligation. C'est l'un des changements les plus favorables aux assurés." },

    { id: 'm2s03', chap: 'c4', type: 'single', src: S.lcarev,
      q: "À quelles conditions un contrat d'assurance de longue durée peut-il être résilié ordinairement ?",
      choices: ["Jamais avant son échéance", "Pour la fin de la 3e année ou de chaque année suivante, avec un préavis de 3 mois", "En tout temps sans préavis", "Uniquement après un sinistre"],
      answer: [1],
      explain: "L'art. 35a LCA introduit ce droit de résiliation ordinaire, afin qu'un preneur ne reste pas lié indéfiniment par un contrat de longue durée." },

    { id: 'm2s04', chap: 'c4', type: 'single', src: S.lcarev,
      q: "En assurance-maladie complémentaire, qui peut résilier le contrat après un sinistre ayant donné lieu à prestation ?",
      choices: ["Les deux parties", "Seul le preneur d'assurance", "Seul l'assureur", "Personne"],
      answer: [1],
      explain: "La révision a supprimé le droit de résiliation de l'assureur dans cette branche : sans cela, un assuré tombé malade pourrait se voir écarter au pire moment." },

    { id: 'm2s05', chap: 'c3', type: 'single', src: S.lcarev,
      q: "Qu'est devenue la « fiction d'approbation » de l'ancien art. 12 LCA, qui rendait la police acceptée après quatre semaines de silence ?",
      choices: ["Elle a été maintenue telle quelle", "Elle a été abrogée lors de la révision entrée en vigueur en 2022", "Elle a été étendue à huit semaines", "Elle ne s'applique plus qu'à l'assurance-vie"],
      answer: [1],
      explain: "L'abrogation protège le preneur : son silence ne vaut plus acceptation d'une police divergente, et il peut invoquer la divergence au-delà de quatre semaines." },

    { id: 'm2s06', chap: 'c3', type: 'multi', src: S.lcarev,
      q: "Quelles nouveautés la révision de la LCA entrée en vigueur le 1er janvier 2022 a-t-elle apportées ?",
      choices: ["Un droit de révocation de 14 jours", "Un délai de prescription porté à 5 ans", "Un droit de résiliation ordinaire des contrats de longue durée", "La suppression du droit de l'assureur de résilier après sinistre en maladie complémentaire", "La suppression de la police d'assurance"],
      answer: [0, 1, 2, 3],
      explain: "La police subsiste comme moyen de preuve du contrat. C'est la fiction d'approbation qui l'accompagnait, et non la police elle-même, qui a disparu." },

    { id: 'm2s07', chap: 'c5', type: 'single', src: S.lca,
      q: "Selon l'art. 33 LCA, quelle est la portée de la couverture accordée par l'assureur ?",
      choices: ["Elle est limitée aux seuls événements expressément énumérés", "Elle s'étend à tous les événements présentant le caractère du risque assuré, sauf exclusion précise et non équivoque", "Elle dépend de l'appréciation de la FINMA", "Elle est fixée après le sinistre"],
      answer: [1],
      explain: "La couverture est de principe et l'exclusion l'exception : une clause d'exclusion imprécise s'interprète en faveur de l'assuré." },

    { id: 'm2s08', chap: 'c8', type: 'single', src: S.vbv,
      q: "Pourquoi un intermédiaire doit-il disposer de qualifications professionnelles reconnues ?",
      choices: ["C'est une simple recommandation de la branche", "La loi et les standards du secteur l'exigent pour exercer comme intermédiaire d'assurance", "Cela ne concerne que les assureurs", "Uniquement pour les intermédiaires liés"],
      answer: [1],
      explain: "Les qualifications suffisantes sont une exigence légale, concrétisée par la certification AFA et par l'obligation de formation continue." }
  ]);
})();
