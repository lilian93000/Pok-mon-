# « L'AFFAIRE DE LA COPRO DES LILAS » — test du style Halftone Dossier — AnalyseTaCopro (2160×3840, 60 i/s, 27,3 s, avec son)

Test d'un style de la collection Lemo-Opuscar (« Halftone Dossier », grammaire seulement) pour une série « le détective des copros » :
papier crème, trames de points, encre marine + cobalt, jaune, rouge et rose, titres à empattements décalés comme une impression,
tampons qui claquent, pièces à conviction numérotées, transitions en points, bandeau de sous-titres avec le mot-clé en jaune.

Rendu : `../analysetacopro-v2-dossier.mp4` · TikTok/Instagram (1080p, sans musique) : `../tiktok-1080-sans-musique/analysetacopro-v2-dossier.mp4`.

Fabrication : voix de Guillaume avec minutage mot à mot (ElevenLabs `with-timestamps`) →
`python3 tools/audio.py <voix> <sfx> assets/audio/soundtrack.wav tools/minutage.json` (voix ×1,12, tampons, déclencheur, papier,
feutre, machine à écrire ; −14 LUFS) → `python3 tools/build.py` (génère `index.html`).
Polices (licence OFL, Google Fonts) : Alfa Slab One, Bagel Fat One, JetBrains Mono, Inter.

| Temps | Voix (Guillaume) | Image |
|---|---|---|
| 0 s | « Dossier 347 : un deux-pièces à 210 000 euros. Trop beau pour être vrai ? » | AFFAIRE N° 347, l'immeuble « suspect » (yeux qui bougent), prix, toise |
| 5,75 s | « Pièce numéro un : le PV d'AG. Étanchéité des terrasses votée : 26 000 euros. » | PV, résolution surlignée, tampon VOTÉ · 26 000 € |
| 10,9 s | « Pièce numéro deux : le carnet d'entretien. Canalisations jamais vérifiées depuis 2009. » | carnet, « 2009 » entouré en rouge |
| 16,3 s | « Pièce numéro trois : le règlement. Location courte durée interdite. » | règlement caviardé, la bande se lève : INTERDITE |
| 20,75 s | « Verdict : à négocier. Ou à fuir. » | tampons À NÉGOCIER puis OU À FUIR |
| 23,45 s | « Ton futur appart a un dossier. On l'ouvre pour toi. » | le dossier, analysetacopro.fr, lien en bio |

Affaire, résidence et montants : exemple fictif. Sources : les PV d'AG listent les travaux votés ; le carnet d'entretien
(décret n° 2001-477) retrace les interventions ; le règlement de copropriété peut restreindre la location meublée de courte durée
(clause d'habitation bourgeoise exclusive, loi du 10 juillet 1965, art. 8 et 9).
