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
        "Avec 200 000 euros, tu achètes quoi ? Cinq villes.",
        "Paris : 21 mètres carrés. Un studio.",
        "Lyon : 42 mètres carrés. Un deux-pièces.",
        "Bordeaux : 45 mètres carrés.",
        "Marseille : 56 mètres carrés. Un vrai trois-pièces.",
        "Et Saint-Étienne : 161 mètres carrés. Une maison de ville.",
        "Même budget, huit fois plus grand.",
        "Abonne-toi : demain, ta ville.",
    ],
    scenes=[
        dict(type="hook", big="200 000 €", count=200000, sub="tu achètes quoi ?", glow="#f59e0b"),
        dict(type="stat", label="PARIS", value=21, unit="m²", note="un studio", at="21", note_at="studio.", area=21, max=161, price="9 633 €/m²", glow="#ef4444"),
        dict(type="stat", label="LYON", value=42, unit="m²", note="un 2 pièces", at="42", note_at="deux-pièces.", area=42, max=161, price="4 736 €/m²", glow="#f97316"),
        dict(type="stat", label="BORDEAUX", value=45, unit="m²", note="un grand 2 pièces", at="45", note_at="carrés.", area=45, max=161, price="4 469 €/m²", glow="#a855f7"),
        dict(type="stat", label="MARSEILLE", value=56, unit="m²", note="un 3 pièces", at="56", note_at="trois-pièces.", area=56, max=161, price="3 581 €/m²", glow="#06b6d4"),
        dict(type="stat", label="SAINT-ÉTIENNE", value=161, unit="m²", note="une maison de ville", at="161", note_at="ville.", area=161, max=161, price="1 244 €/m²", glow="#22c55e"),
        dict(type="punch", big="×8", sub="même budget", at="huit", glow="#eab308"),
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
        "Ton proprio peut garder ta caution ? Voici la loi.",
        "Un : elle ne dépasse pas un mois de loyer hors charges. Deux en meublé.",
        "Deux : il doit te la rendre sous un mois si l'état des lieux est conforme.",
        "Deux mois s'il y a des dégâts, et seulement avec devis ou factures.",
        "Trois : l'usure normale ne peut jamais t'être facturée.",
        "Et pour chaque mois de retard, il te doit 10 % du loyer en plus.",
        "Enregistre-la avant ton état des lieux.",
    ],
    scenes=[
        dict(type="hook", big="TA CAUTION", sub="il peut la garder ?", glow="#ef4444"),
        dict(type="rule", n="1/3", big="1 MOIS", sub="de loyer hors charges, maximum", chip="2 en meublé", chip_at="meublé.", at="mois", glow="#3b82f6"),
        dict(type="rule", n="2/3", big="1 MOIS", sub="pour te la rendre", chip="si l'état des lieux est conforme", chip_at="conforme.", at="mois", glow="#22c55e"),
        dict(type="rule", n="2/3", big="2 MOIS", sub="s'il y a des dégâts", chip="avec devis ou factures", chip_at="factures.", at="mois", glow="#f97316"),
        dict(type="rule", n="3/3", big="USURE", sub="normale = jamais pour toi", chip="la vétusté reste au proprio", chip_at="facturée.", at="normale", glow="#a855f7"),
        dict(type="punch", big="+10 %", sub="du loyer par mois de retard", at="10", glow="#eab308"),
        dict(type="end", t1="Enregistre-la", t2="avant l'état des lieux.", glow="#2563eb"),
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
        "Cette annonce est une arnaque. Tu vois pourquoi ?",
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
        dict(type="verdict", big="0 €", sub="avant la visite et le bail signé", at="euro", glow="#22c55e"),
        dict(type="end", t1="Envoie-la", t2="à qui cherche un appart.", glow="#2563eb"),
    ],
)
