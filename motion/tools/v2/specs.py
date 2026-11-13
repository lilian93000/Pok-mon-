"""Fiches des vidéos « format v2 grand public » (voir tools/v2/README.md).

Chaque fiche : les phrases dites (une par scène), le décor de chaque scène et les bruitages.
Les temps ne sont jamais écrits à la main : ils viennent du minutage mot à mot de la voix.
Un « mot » d'ancrage (par ex. "21") place une apparition pile quand Guillaume le dit.
"""

SPECS = {}

# ---------------------------------------------------------------- PRIX : ce que 200 000 € t'achètent
SPECS["prix"] = dict(
    title="CE QUE 200 000 € T'ACHÈTENT",
    comment="Série prix : surface achetable avec 200 000 € dans 5 villes (prix moyens MeilleursAgents, 1er nov. 2026).",
    tag="200 000 € · 5 VILLES",
    source="Prix moyen au m² des appartements · MeilleursAgents, 1ᵉʳ nov. 2026 · hors frais",
    lines=[
        "200 000 euros : à Paris, un placard. Ailleurs, une maison. Regarde.",
        "Paris : 21 mètres carrés. Un studio.",
        "Lyon : 42 mètres carrés. Un deux-pièces.",
        "Bordeaux : 45 mètres carrés.",
        "Marseille : 56 mètres carrés. Un vrai trois-pièces.",
        "Et Saint-Étienne : 161 mètres carrés. Une maison de ville.",
        "Même budget, huit fois plus grand.",
        "Abonne-toi : demain, ta ville.",
    ],
    scenes=[
        dict(type="hook", pre="200 000 € à Paris =", big="UN PLACARD", sub="ailleurs, une maison ?", sub_at="Ailleurs", glow="#f59e0b"),
        dict(type="stat", label="PARIS", value=21, unit="m²", note="un studio", at="21", note_at="studio.", area=21, max=161, price="9 633 €/m²", glow="#ef4444"),
        dict(type="stat", label="LYON", value=42, unit="m²", note="un 2 pièces", at="42", note_at="deux-pièces.", area=42, max=161, price="4 736 €/m²", glow="#f97316"),
        dict(type="stat", label="BORDEAUX", value=45, unit="m²", note="un grand 2 pièces", at="45", note_at="carrés.", area=45, max=161, price="4 469 €/m²", glow="#a855f7"),
        dict(type="stat", label="MARSEILLE", value=56, unit="m²", note="un 3 pièces", at="56", note_at="trois-pièces.", area=56, max=161, price="3 581 €/m²", glow="#06b6d4"),
        dict(type="stat", label="SAINT-ÉTIENNE", value=161, unit="m²", note="une maison de ville", at="161", note_at="ville.", area=161, max=161, price="1 244 €/m²", glow="#22c55e"),
        dict(type="punch", big="×8", sub="même budget", at="Même", glow="#eab308"),
        dict(type="end", t1="Demain :", t2="ta ville.", glow="#2563eb"),
    ],
)

# ---------------------------------------------------------------- LOCATION : la caution
SPECS["caution"] = dict(
    title="TA CAUTION : CE QUE DIT LA LOI",
    comment="Série locataire : dépôt de garantie (loi du 6 juillet 1989, art. 22 et 25-6).",
    tag="LOCATAIRE · TES DROITS",
    source="Loi du 6 juillet 1989, art. 22 (location vide) et art. 25-6 (meublé)",
    lines=[
        "Ton proprio te doit peut-être de l'argent. Voici la loi sur ta caution.",
        "Un : elle ne dépasse pas un mois de loyer hors charges. Deux en meublé.",
        "Deux : il doit te la rendre sous un mois si l'état des lieux est conforme.",
        "Deux mois s'il y a des dégâts, et seulement avec devis ou factures.",
        "Trois : l'usure normale ne peut jamais t'être facturée.",
        "Et pour chaque mois de retard, il te doit 10 % du loyer en plus.",
        "Enregistre-la avant ton état des lieux.",
    ],
    scenes=[
        dict(type="hook", pre="Ta caution :", big="IL TE DOIT\nDE L'ARGENT ?", sub="voici la loi", sub_at="loi", glow="#ef4444"),
        dict(type="rule", n="1/3", big="1 MOIS", sub="de loyer hors charges, maximum", chip="2 en meublé", chip_at="meublé.", at="Un", glow="#3b82f6"),
        dict(type="rule", n="2/3", big="1 MOIS", sub="pour te la rendre", chip="si l'état des lieux est conforme", chip_at="conforme.", at="Deux", glow="#22c55e"),
        dict(type="rule", n="2/3", big="2 MOIS", sub="s'il y a des dégâts", chip="avec devis ou factures", chip_at="factures.", at="Deux", glow="#f97316"),
        dict(type="rule", n="3/3", big="USURE", sub="normale = jamais pour toi", chip="la vétusté reste au proprio", chip_at="facturée.", at="Trois", glow="#a855f7"),
        dict(type="punch", big="+10 %", sub="du loyer par mois de retard", at="Et", glow="#eab308"),
        dict(type="end", t1="Enregistre-la", t2="pour l'état des lieux.", glow="#2563eb"),
    ],
)

# ---------------------------------------------------------------- ARNAQUE : la fausse annonce de location
SPECS["arnaque"] = dict(
    title="CETTE ANNONCE EST UNE ARNAQUE",
    comment="Série arnaques : 4 indices d'une fausse annonce de location (décret n° 2015-1437 pour les pièces interdites).",
    tag="ARNAQUE OU PAS ?",
    source="Annonce fictive · pièces interdites : décret n° 2015-1437 du 5 nov. 2015",
    listing=dict(title="T2 lumineux · 45 m²", place="Paris 11ᵉ", price="650 €/mois", owner="Propriétaire · à l'étranger",
                 msg="Je suis à Londres. Faites un virement de 650 € pour réserver, et envoyez vos relevés bancaires."),
    lines=[
        "650 euros à Paris ? C'est une arnaque. Regarde.",
        "Un : le prix. Un deux-pièces à Paris à 650 euros, c'est bien trop bas.",
        "Deux : le propriétaire est à l'étranger. Pas de visite possible.",
        "Trois : il veut un virement pour réserver, avant toute visite.",
        "Quatre : il exige tes relevés bancaires. C'est interdit de les demander.",
        "La règle : jamais un euro avant la visite et le bail signé.",
        "Envoie-la à quelqu'un qui cherche un appart.",
    ],
    scenes=[
        dict(type="listing", glow="#ef4444"),
        dict(type="flag", n="1/4", target="price", label="PRIX TROP BAS", at="bas.", glow="#ef4444"),
        dict(type="flag", n="2/4", target="owner", label="PAS DE VISITE", at="visite", glow="#f97316"),
        dict(type="flag", n="3/4", target="pay", label="VIREMENT AVANT VISITE", at="virement", glow="#eab308"),
        dict(type="flag", n="4/4", target="docs", label="DOCUMENTS INTERDITS", at="interdit", glow="#a855f7"),
        dict(type="verdict", big="0 €", sub="avant la visite et le bail signé", at="La", glow="#22c55e"),
        dict(type="end", t1="Envoie-la", t2="à qui cherche.", glow="#2563eb"),
    ],
)

# ---------------------------------------------------------------- ARNAQUE, voix v3 « histoire » (émotions, une seule génération)
# La voix vient de tools/v3/voix_v3.py (voix-off/v3/arnaque.txt) ; « groups » = phrases du script couvertes par chaque scène.
SPECS["arnaque3"] = dict(
    title="650 € À PARIS ? C'EST UNE ARNAQUE",
    comment="Arnaque à la location, voix v3 énergique ; la fin reprend l'annonce du début pour que la vidéo boucle.",
    tag="ARNAQUE OU PAS ?",
    source="Annonce fictive · pièces interdites : décret n° 2015-1437 du 5 nov. 2015",
    script="voix-off/v3/arnaque.txt",
    display={"six cent cinquante euros": "650 €"},
    listing=dict(title="T2 lumineux · 45 m²", place="Paris 11ᵉ", price="650 €/mois", owner="Propriétaire · à Londres",
                 msg="Je suis à Londres. Faites un virement de 650 € pour réserver, puis envoyez votre relevé de banque.",
                 hl={"pay": "Faites un virement de 650 € pour réserver", "docs": "votre relevé de banque"}),
    scenes=[
        dict(type="listing", groups=[0, 1, 2], glow="#ef4444"),
        dict(type="flag", groups=[3], n="1/4", target="price", label="PRIX TROP BAS", at="beaucoup", glow="#ef4444"),
        dict(type="flag", groups=[4, 5], n="2/4", target="owner", label="PAS DE VISITE", at="impossible", glow="#f97316"),
        dict(type="flag", groups=[6, 7], n="3/4", target="pay", label="VIREMENT AVANT VISITE", at="virement", glow="#eab308"),
        dict(type="flag", groups=[8], n="4/4", target="docs", label="DOCUMENT INTERDIT", at="interdit", glow="#a855f7"),
        dict(type="punch", groups=[9], big="ARNAQUE !", sub="4 indices sur 4", at="arnaque", glow="#ef4444"),
        dict(type="verdict", groups=[10], big="0 €", sub="avant visite et bail signé", at="jamais", glow="#22c55e"),
        dict(type="loop", groups=[11], glow="#ef4444"),
    ],
)

# ---------------------------------------------------------------- PRIX, voix v3 (voix-off/v3/prix.txt, essai 2 validé)
SPECS["prix3"] = dict(
    title="200 000 € : TU ACHÈTES QUOI ?",
    comment="Surface achetable avec 200 000 € dans 5 villes (MeilleursAgents, 1er nov. 2026), voix v3 énergique ; la fin boucle sur le début.",
    tag="200 000 € · 5 VILLES",
    source="Prix moyen au m² des appartements · MeilleursAgents, 1ᵉʳ nov. 2026 · hors frais",
    script="voix-off/v3/prix.txt",
    display={"deux cent mille euros": "200 000 €", "vingt et un mètres carrés": "21 m²", "quarante-deux mètres carrés": "42 m²",
             "quarante-cinq": "45 m²", "cinquante-six mètres carrés": "56 m²", "cent soixante et un mètres carrés": "161 m²"},
    scenes=[
        dict(type="hook", groups=[0], big="200 000 €", sub="tu achètes QUOI ?", sub_at="quoi", glow="#f59e0b"),
        dict(type="stat", groups=[1, 2], label="PARIS", value=21, unit="m²", note="un studio", at="vingt", note_at="studio", area=21, max=161, price="9 633 €/m²", glow="#ef4444"),
        dict(type="stat", groups=[3], label="LYON", value=42, unit="m²", note="un 2 pièces", at="quarant", area=42, max=161, price="4 736 €/m²", glow="#f97316"),
        dict(type="stat", groups=[4], label="BORDEAUX", value=45, unit="m²", note="ça respire", at="quarant", note_at="respir", area=45, max=161, price="4 469 €/m²", glow="#a855f7"),
        dict(type="stat", groups=[5], label="MARSEILLE", value=56, unit="m²", note="un 3 pièces", at="cinquant", area=56, max=161, price="3 581 €/m²", glow="#06b6d4"),
        dict(type="stat", groups=[6, 7, 8], label="SAINT-ÉTIENNE", value=161, unit="m²", note="une maison de ville", at="cent", note_at="maison", area=161, max=161, price="1 244 €/m²", glow="#22c55e"),
        dict(type="punch", groups=[9], big="×8", sub="même budget", at="huit", glow="#eab308"),
        dict(type="hook", groups=[10], big="200 000 €", sub="tu achètes…", glow="#f59e0b"),
    ],
)

# ---------------------------------------------------------------- CAUTION, voix v3 (voix-off/v3/caution.txt, essai 1 validé)
SPECS["caution3"] = dict(
    title="TA CAUTION : CE QUE DIT LA LOI",
    comment="Dépôt de garantie (loi du 6 juillet 1989, art. 22 et 25-6), voix v3 énergique ; la fin boucle sur le début.",
    tag="LOCATAIRE · TES DROITS",
    source="Loi du 6 juillet 1989, art. 22 (location vide) et art. 25-6 (meublé)",
    script="voix-off/v3/caution.txt",
    display={"dix pour cent": "10 %"},
    scenes=[
        dict(type="hook", groups=[0, 1], pre="Ta caution :", big="IL TE DOIT\nDE L'ARGENT ?", sub="peut-être bien…", sub_at="argent", glow="#ef4444"),
        dict(type="rule", groups=[2, 3], n="1/3", big="1 MOIS", sub="de loyer hors charges, maximum", chip="2 en meublé", at="regl", chip_at="meubl", glow="#3b82f6"),
        dict(type="rule", groups=[4], n="2/3", big="1 MOIS", sub="pour te la rendre", chip="si l'état des lieux est nickel", at="regl", chip_at="rendu", glow="#22c55e"),
        dict(type="rule", groups=[5], n="2/3", big="2 MOIS", sub="s'il y a des dégâts", chip="avec devis ou factures", at="deg", chip_at="factur", glow="#f97316"),
        dict(type="rule", groups=[6, 7], n="3/3", big="USURE", sub="normale = pas ton problème", chip="la vétusté reste au proprio", at="detail", chip_at="problem", glow="#a855f7"),
        dict(type="punch", groups=[8, 9], big="+10 %", sub="par mois de retard", at="dix", glow="#eab308"),
        dict(type="hook", groups=[10], pre="Ton proprio garde", big="TA CAUTION ?", fs=128, sub="la loi dit non", glow="#ef4444"),
    ],
)

# ---------------------------------------------------------------- FRAIS DE NOTAIRE, voix v3 (voix-off/v3/notaire.txt, essai 2 validé)
SPECS["notaire3"] = dict(
    title="FRAIS DE NOTAIRE : QUI GARDE L'ARGENT ?",
    comment="Sur 200 000 € dans l'ancien : ~16 000 € de frais, dont ~12 600 € de droits de mutation (6,32 %) et ~2 500 € pour le notaire ; voix v3, fin en boucle.",
    tag="ACHETER · LES VRAIS CHIFFRES",
    source="Ancien, 200 000 € · droits de mutation 6,32 % (taux relevé, la plupart des départements) · émoluments barème 2026 · arrondis",
    script="voix-off/v3/notaire.txt",
    display={"deux cent mille": "200 000 €", "seize mille": "16 000 €", "deux mille cinq cents": "2 500 €",
             "douze mille six cents euros": "12 600 €", "sept à huit pour cent": "7 à 8 %", "deux à trois pour cent": "2 à 3 %"},
    scenes=[
        dict(type="hook", groups=[0], pre="Un appart à 200 000 € :", big="16 000 €", sub="de frais de notaire !", sub_at="seiz", glow="#f59e0b"),
        dict(type="split", groups=[1, 2, 3, 4, 5], title="Qui garde tes 16 000 € ?", glow="#ef4444",
             segments=[dict(label="Le notaire", value=2500, color="#3b82f6", at="environ"),
                       dict(label="Les taxes", value=12600, color="#ef4444", at="douz"),
                       dict(label="Autres frais", value=900, color="#a3a3a3", at="mutat")]),
        dict(type="rule", groups=[6, 7], big="7 À 8 %", sub="du prix, dans l'ancien", chip="le vrai coût de l'achat", at="ancien", chip_at="pri", glow="#f97316"),
        dict(type="rule", groups=[8], big="2 À 3 %", sub="dans le neuf", chip="taxes réduites", at="neuf", chip_at="seulement", glow="#22c55e"),
        dict(type="punch", groups=[9], big="IMPÔTS", sub="pas vraiment des « frais de notaire »", at="impot", glow="#a855f7"),
        dict(type="hook", groups=[10], pre="Un appart à 200 000 € :", big="16 000 €", sub="de frais de notaire…", glow="#f59e0b"),
    ],
)

# ---------------------------------------------------------------- ÉTAT DES LIEUX D'ENTRÉE, voix v3 (voix-off/v3/etatdeslieux.txt, essai 1 validé)
SPECS["etatdeslieux3"] = dict(
    title="ÉTAT DES LIEUX : LE DÉLAI SECRET",
    comment="10 jours pour compléter l'état des lieux d'entrée (1er mois de chauffe pour le chauffage), commission de conciliation, présomption de bon état sans état des lieux ; voix v3, fin en boucle.",
    tag="LOCATAIRE · TES DROITS",
    source="Loi du 6 juillet 1989, art. 3-2 · Code civil, art. 1731",
    script="voix-off/v3/etatdeslieux.txt",
    display={"dix jours": "10 jours"},
    scenes=[
        dict(type="hook", groups=[0], pre="État des lieux d'entrée :", big="DÉLAI SECRET", fs=128, sub="que personne ne te dit", sub_at="secret", glow="#ef4444"),
        dict(type="punch", groups=[1], big="UNE FUITE", sub="juste après avoir signé…", at="fuit", glow="#06b6d4"),
        dict(type="rule", groups=[2, 3], n="1/3", big="10 JOURS", sub="pour compléter l'état des lieux", chip="tout défaut oublié", at="dix", chip_at="complet", glow="#22c55e"),
        dict(type="rule", groups=[4], n="1/3", big="CHAUFFAGE", sub="1ᵉʳ mois de chauffe", chip="délai plus long", at="chauffag", chip_at="premier", glow="#f97316"),
        dict(type="rule", groups=[5], n="2/3", big="RECOMMANDÉ", sub="avec photos datées", chip="garde une preuve", at="recommand", chip_at="photo", glow="#3b82f6"),
        dict(type="rule", groups=[6, 7], n="3/3", big="GRATUIT", sub="commission de conciliation", chip="si le proprio refuse", at="commission", chip_at="refus", glow="#a855f7"),
        dict(type="punch", groups=[8, 9, 10], big="BON ÉTAT", sub="sans état des lieux : présumé", at="bon", glow="#ef4444"),
        dict(type="hook", groups=[11], pre="Ton état des lieux d'entrée :", big="10 JOURS", sub="pas un de plus", glow="#22c55e"),
    ],
)

# ---------------------------------------------------------------- TÉLÉPHONE EN VISITE, voix v3 (voix-off/v3/telephone.txt, essai 2 validé)
SPECS["telephone3"] = dict(
    title="TON TÉLÉPHONE, L'OUTIL SECRET DE LA VISITE",
    comment="4 réflexes en visite avec son téléphone : niveau, lampe rasante, chargeur dans les prises, réseau ; voix v3, fin en boucle.",
    tag="VISITE · LES BONS RÉFLEXES",
    source="Astuces de visite AnalyseTaCopro",
    script="voix-off/v3/telephone.txt",
    scenes=[
        dict(type="hook", groups=[0], pre="En visite d'appart :", big="TON\nTÉLÉPHONE", sub="l'outil secret", sub_at="secret", glow="#06b6d4"),
        dict(type="rule", groups=[1, 2], n="1/4", big="NIVEAU", sub="pose-le au sol", chip="ça penche = plancher qui a bougé", at="niveau", chip_at="pench", glow="#3b82f6"),
        dict(type="rule", groups=[3, 4], n="2/4", big="LAMPE", sub="collée au mur", chip="fissures et bosses apparaissent", at="lamp", chip_at="fissur", glow="#f59e0b"),
        dict(type="rule", groups=[5, 6], n="3/4", big="CHARGEUR", sub="dans chaque prise", chip="prise morte = à noter", at="chargeur", chip_at="mort", glow="#22c55e"),
        dict(type="rule", groups=[7, 8], n="4/4", big="RÉSEAU", sub="dans chaque pièce", chip="0 barre dans la chambre ?", at="reseau", chip_at="zero", glow="#a855f7"),
        dict(type="hook", groups=[9], pre="En visite d'appart :", big="TON\nTÉLÉPHONE", sub="l'outil…", glow="#06b6d4"),
    ],
)

# ---------------------------------------------------------------- VRAI OU FAUX LOCATAIRE, voix v3 (voix-off/v3/vfloc.txt, essai 1 validé)
SPECS["vfloc3"] = dict(
    title="VRAI OU FAUX : SPÉCIAL LOCATAIRE",
    comment="Jeu : visite du bailleur, révision du loyer (1 fois par an, IRL), réparations locatives (décret 87-712), trêve hivernale (1er nov.–31 mars) ; voix v3, fin en boucle.",
    tag="JEU · LOCATAIRE",
    source="Loi du 6 juillet 1989 · décret 87-712 · CCH, art. L412-6",
    script="voix-off/v3/vfloc.txt",
    display={"trente et un mars": "31 mars"},
    scenes=[
        dict(type="hook", groups=[0], pre="Spécial locataire :", big="VRAI\nOU FAUX ?", sub="4 questions", glow="#a855f7"),
        dict(type="hook", groups=[1], n="1/4", pre="Ton proprio entre chez toi", big="QUAND\nIL VEUT ?", sub="vrai ou faux ?", glow="#3b82f6"),
        dict(type="punch", groups=[2], big="FAUX", sub="c'est TON domicile", at="fau", glow="#ef4444"),
        dict(type="hook", groups=[3], n="2/4", pre="Il augmente le loyer", big="QUAND\nIL VEUT ?", sub="vrai ou faux ?", glow="#3b82f6"),
        dict(type="punch", groups=[4], big="FAUX", sub="1 fois par an, maximum", at="fau", glow="#ef4444"),
        dict(type="hook", groups=[5], n="3/4", pre="Les petites réparations", big="C'EST\nPOUR TOI ?", sub="vrai ou faux ?", glow="#3b82f6"),
        dict(type="verdict", groups=[6], big="VRAI", sub="joints, ampoules, poignées", at="vrai", glow="#22c55e"),
        dict(type="hook", groups=[7], n="4/4", pre="Dehors", big="EN PLEIN\nHIVER ?", sub="vrai ou faux ?", glow="#3b82f6"),
        dict(type="punch", groups=[8], big="FAUX", sub="trêve jusqu'au 31 mars", at="fau", glow="#ef4444"),
        dict(type="hook", groups=[9], pre="Ton score :", big="?/4", sub="dis-le en commentaire", glow="#eab308"),
        dict(type="hook", groups=[10], pre="Spécial locataire :", big="VRAI\nOU FAUX ?", sub="…", glow="#a855f7"),
    ],
)

# ---------------------------------------------------------------- 3 PHRASES D'UN PV D'AG, voix v3 (voix-off/v3/pvag.txt, essai 2 validé)
SPECS["pvag3"] = dict(
    title="3 PHRASES D'UN PV D'AG QUI DOIVENT TE FAIRE FUIR",
    comment="Travaux votés à appeler (payés par l'acheteur sauf clause du compromis, décret 1967 art. 6-2), question reportée, expertise en cours ; voix v3, fin en boucle.",
    tag="ACHETER · LA COPRO",
    source="Décret du 17 mars 1967, art. 6-2 · procès-verbaux d'assemblée générale",
    script="voix-off/v3/pvag.txt",
    display={"Trois phrases": "3 phrases"},
    scenes=[
        dict(type="hook", groups=[0], pre="Dans un PV d'AG :", big="3 PHRASES", sub="qui doivent te faire fuir", sub_at="fuir", glow="#ef4444"),
        dict(type="rule", groups=[1, 2, 3], n="1/3", big="APPELS DE FONDS", sub="« travaux votés, à venir »", chip="après la vente : c'est TOI qui paies", at="appel", chip_at="toi", glow="#f97316"),
        dict(type="rule", groups=[4, 5], n="2/3", big="REPORTÉ", sub="« à la prochaine assemblée »", chip="le problème traîne", at="report", chip_at="train", glow="#eab308"),
        dict(type="rule", groups=[6, 7], n="3/3", big="EXPERTISE", sub="« en cours sur les fissures »", chip="pas encore chiffrée", at="expertis", chip_at="chiffr", glow="#a855f7"),
        dict(type="punch", groups=[8], big="ON TRAQUE", sub="ces phrases pour toi", at="traqu", glow="#22c55e"),
        dict(type="hook", groups=[9], pre="Dans un PV d'AG :", big="3 PHRASES", sub="…", glow="#ef4444"),
    ],
)
