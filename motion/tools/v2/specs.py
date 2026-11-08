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
