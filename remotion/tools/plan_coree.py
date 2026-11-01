# Plan de montage du vlog « Corée du Sud ».
# Chaque bloc : (début_source, fin_source, type, options)
#   type "talk"  -> découpé au mot près, blancs > GAP supprimés
#   type "broll" -> gardé tel quel (plans d'ambiance)
# Options : vertical (clip 9:16 incrusté), zoom, punch (jump cuts zoomés), volume, blur (fond d'écran de fin)

HOOK = [
    (309.0, 312.8, "broll", {}),                 # « Il est trop bon ! Quel plaisir ! »
    (793.9, 797.0, "broll", {}),                 # « Oula ! Il vient de défoncer sa voiture… »
    (1120.6, 1123.3, "broll", {}),               # « J'étais une princesse. Princesse Violette. »
    (1178.3, 1183.0, "broll", {}),               # « 70 milliards de degrés »
    (1262.0, 1267.3, "broll", {}),               # les saucisses
    (353.0, 358.5, "broll", {"title": ("SÉOUL", "5 jours en Corée du Sud")}),
]

CHAPTERS = [
    ("L'arrivée", "Aéroport d'Incheon → Séoul", [
        (0.0, 49.8, "talk", {}),
        (50.2, 64.8, "talk", {}),
        (76.3, 103.9, "talk", {}),
    ]),
    ("Myeongdong by night", "Myeongdong, Séoul", [
        (131.7, 171.9, "talk", {}),
        (172.0, 185.0, "broll", {}),
        (204.0, 214.0, "broll", {}),
        (237.6, 259.4, "talk", {"vertical": True}),
        (259.6, 316.6, "talk", {}),
        (316.6, 329.0, "broll", {"volume": 0.8}),
    ]),
    ("Cheonggyecheon", "La rivière au cœur de Séoul", [
        (338.0, 345.0, "broll", {}),
        (371.4, 425.9, "talk", {}),
        (426.6, 431.4, "talk", {}),
    ]),
    ("Le guide de survie", "Tout ce qu'il faut savoir", [
        (446.1, 458.2, "talk", {}),
        (466.8, 517.9, "talk", {"punch": True}),
        (518.8, 533.0, "talk", {"punch": True}),
        (533.9, 538.2, "talk", {}),
        (547.4, 575.2, "talk", {"punch": True}),
        (575.6, 616.8, "talk", {"punch": True}),
        (617.0, 651.2, "talk", {"punch": True}),
        (651.6, 676.5, "talk", {"punch": True}),
    ]),
    ("À la recherche du temple", "Jongno, Séoul", [
        (677.4, 702.8, "talk", {}),
        (704.1, 719.9, "talk", {}),
        (721.6, 755.2, "talk", {}),
        (758.7, 777.2, "talk", {}),
        (786.5, 806.1, "talk", {}),
        (827.2, 867.5, "talk", {}),
        (867.5, 877.0, "broll", {}),
    ]),
    ("La fac sous terre", "Université Ewha, Séoul", [
        (887.0, 890.5, "broll", {}),
        (893.1, 948.2, "talk", {}),
        (961.0, 971.0, "broll", {}),
        (992.7, 1025.5, "talk", {}),
        (1051.0, 1058.0, "broll", {}),
    ]),
    ("Hanbok au palais", "Gyeongbokgung, Séoul", [
        (1081.0, 1215.0, "talk", {"gap": 2.0}),
    ]),
    ("Barbecue coréen", "Séoul", [
        (1215.4, 1347.3, "talk", {"gap": 1.5}),
    ]),
    ("Et la suite…", "Hanok, Hongdae…", [
        (1347.3, 1378.5, "talk", {}),
        (1383.0, 1388.0, "broll", {}),
        (1388.0, 1396.0, "broll", {"vertical": True}),
        (1408.0, 1416.0, "broll", {}),
        (1418.0, 1425.0, "broll", {}),
        (1426.0, 1431.0, "broll", {}),
        (1433.0, 1437.8, "broll", {}),
    ]),
]

# Écran de fin (20 s) : teaser Japon flouté, voix gardée.
# (on s'arrête avant 1438 s : la source a un texte jaune incrusté ensuite, caché par le flou)
END = [
    (1448.3, 1468.5, "broll", {"blur": True}),
]

# Fiches info du « guide de survie » (temps SOURCE)
TIPS = [
    (452.3, "🕐", "Décalage horaire", "+7 h par rapport à la France"),
    (469.3, "🛂", "À l'arrivée", "Immigration + douane : prévois du temps"),
    (479.9, "🚆", "Aéroport → Seoul Station", "Train direct · 40 à 50 min · 50 km"),
    (501.8, "💳", "Carte de transport", "En station de métro ou avec ta carte SIM"),
    (529.7, "🗣️", "La langue", "Peu de gens parlent anglais"),
    (551.3, "🙏", "Le service", "Des gens hyper serviables"),
    (586.2, "🏨", "Check-in hôtel", "15 h normalement (on l'a eu à 13 h !)"),
    (620.0, "💵", "Payer", "Apple Pay OK · cash pour transports & démarches"),
    (639.5, "🏦", "Frais bancaires", "Option Explorer (LCL) ou Revolut"),
    (735.9, "🗺️", "Google Maps ne marche pas", "Utilise Kakao Maps"),
    (759.6, "🚇", "Dernier métro", "Minuit le week-end · 1 h en semaine"),
]

# Corrections de la transcription automatique (sous-titres)
FIX = {
    "Seoul": "Séoul", "Guedong.": "Myeongdong.", "Guedong": "Myeongdong", "gibier,": "billet,", "gibier": "billet",
    "Akeon": "d'Incheon", "Myedong,": "Myeongdong,", "Myedong": "Myeongdong", "DJ": "DJI", "résolut,": "Revolut,",
    "Béwa,": "Ewha,", "Cédeny": "Seven", "Leven": "Eleven", "Bassetto.": "Bassett.", "Bassetto": "Bassett",
    "Anok,": "Hanok,", "Honde,": "Hongdae,", "Hongdé,": "Hongdae,", "barbecu": "barbecue", "roulet.": "anglais.",
    "seriant.": "souriants.", "7-11.": "7-Eleven.", "7-11": "7-Eleven",
}
# lignes à ne pas sous-titrer (transcription douteuse) : (début, fin) source
NO_CAPTION = [(0.0, 1.8), (44.5, 46.9), (64.7, 76.0), (104.0, 131.0), (407.5, 411.2), (1105.5, 1117.0), (1378.5, 1449.7)]

# ---------------- Motion design ----------------
# Carte de Séoul affichée au début de chaque chapitre : (lieu d'arrivée, lieu de départ)
CHAPTER_MAP = {
    1: ("station", None),
    2: ("myeongdong", "station"),
    3: ("cheonggye", "myeongdong"),
    4: ("cheonggye", None),
    5: ("jongno", "cheonggye"),
    6: ("ewha", "jongno"),
    7: ("palace", "ewha"),
    8: ("cheonggye", "palace"),
    9: ("hongdae", "cheonggye"),
}

# Animations ponctuelles (temps SOURCE ; apparaissent aussi dans l'accroche si le moment y est)
POPS = [
    (7.7, 3.0, {"kind": "sticker", "emoji": "✈️", "text": "12 h de vol", "pos": "right"}),
    (13.0, 2.4, {"kind": "sticker", "emoji": "😎", "text": "Magnifique", "pos": "left"}),
    (29.8, 4.6, {"kind": "money", "won": 5000, "eur": 4}),
    (41.9, 2.8, {"kind": "sticker", "emoji": "☕", "text": "5,95 € en France", "pos": "left"}),
    (54.2, 6.5, {"kind": "route", "from": "Aéroport d'Incheon", "to": "Seoul Station", "km": 50, "time": "40 min en train"}),
    (157.7, 3.0, {"kind": "sticker", "emoji": "⚡", "text": "Gâteaux Pikachu", "pos": "right"}),
    (240.4, 3.0, {"kind": "sticker", "emoji": "🍗", "text": "Chicken time", "pos": "left"}),
    (309.0, 3.4, {"kind": "sticker", "emoji": "😋", "text": "TROP BON", "pos": "right"}),
    (412.8, 2.4, {"kind": "sticker", "emoji": "🤯", "text": "C'est fou", "pos": "right", "color": "#33D6FF"}),
    (447.5, 4.5, {"kind": "subscribe"}),
    (614.8, 2.6, {"kind": "sticker", "emoji": "🎥", "text": "Juste un vlog", "pos": "left"}),
    (656.7, 3.6, {"kind": "sticker", "emoji": "📷", "text": "DJI Osmo", "pos": "left", "color": "#33D6FF"}),
    (794.0, 3.0, {"kind": "sticker", "emoji": "💥", "text": "OULA", "pos": "center"}),
    (850.2, 2.6, {"kind": "sticker", "emoji": "🔒", "text": "Fermé…", "pos": "right"}),
    (900.6, 3.2, {"kind": "sticker", "emoji": "🎓", "text": "Une fac sous terre", "pos": "right", "color": "#33D6FF"}),
    (1094.3, 3.0, {"kind": "sticker", "emoji": "👘", "text": "Hanbok", "pos": "right"}),
    (1121.6, 3.0, {"kind": "sticker", "emoji": "👑", "text": "Princesse Violette", "pos": "left"}),
    (1134.1, 4.2, {"kind": "thermo", "value": 32}),
    (1180.1, 3.4, {"kind": "sticker", "emoji": "🔥", "text": "70 milliards de degrés", "pos": "center"}),
    (1262.0, 3.4, {"kind": "sticker", "emoji": "🌭", "text": "RIP les saucisses", "pos": "right"}),
    (1314.7, 4.2, {"kind": "rating", "value": 8, "max": 10, "label": "BARBECUE CORÉEN"}),
    (1335.2, 2.6, {"kind": "sticker", "emoji": "🍄", "text": "Champignon", "pos": "left", "color": "#33D6FF"}),
    (1338.2, 2.8, {"kind": "sticker", "emoji": "🌶️", "text": "Bœuf spicy", "pos": "right"}),
    (1366.8, 2.8, {"kind": "sticker", "emoji": "🏯", "text": "Village Hanok", "pos": "right"}),
    (1371.7, 2.8, {"kind": "sticker", "emoji": "🎤", "text": "Hongdae", "pos": "left", "color": "#33D6FF"}),
]
