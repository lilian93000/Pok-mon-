# « LES BRUITS EN VISITE » — format v2 — AnalyseTaCopro (2160×3840, 60 i/s, 24,2 s, avec son)

Prototype du **format v2**, refonte de `analysetacopro-sons` après l'analyse des premières vidéos publiées :
pas d'intro de marque, l'accroche du sujet dès la 1ʳᵉ image (le « CLAC ! » et son bruit), gros sous-titres
mot à mot calés sur la voix, une idée par écran, une couleur par bruit, la révélation (le PV d'AG) et une fin courte.

Rendu : `../analysetacopro-v2-bruits.mp4` · TikTok/Instagram (1080p, sans musique) : `../tiktok-1080-sans-musique/analysetacopro-v2-bruits.mp4`.

Fabrication :
1. Voix de Guillaume avec minutage mot à mot (API ElevenLabs `with-timestamps`), une phrase par fichier.
2. `python3 tools/audio.py <voix> <sfx> assets/audio/soundtrack.wav tools/minutage.json` : voix ×1,12, bruitages synthétisés
   (coup de bélier, sifflement, glouglou), whooshs et impact ; écrit le minutage absolu de chaque mot.
3. `python3 tools/build.py` : génère `index.html` (sous-titres et apparitions calés sur `tools/minutage.json`).

| Temps | Voix (Guillaume) | Image |
|---|---|---|
| 0 s | (bruit : clac clac) « Tu entends ça pendant une visite ? Méfie-toi. » | « CLAC ! » géant qui tremble |
| 2,8 s | « Un clac dans les tuyaux quand tu fermes le robinet ? Coup de bélier : la plomberie souffre. » | 1/3, onde rouge, verdict « COUP DE BÉLIER » |
| 7,75 s | (sifflement) « Un sifflement dans la VMC ? Bouches encrassées : l'humidité s'installe. » | 2/3, onde cyan, « BOUCHES ENCRASSÉES » |
| 12,65 s | (glouglou) « Un glouglou dans l'évier ? Évacuation mal ventilée : souvent un problème de tout l'immeuble. » | 3/3, onde verte, « ÉVACUATION MAL VENTILÉE » |
| 17,75 s | « Ces bruits, l'annonce ne te les dira jamais. Les PV d'AG, si. » | PV d'AG fictif, résolution surlignée, tampon 48 000 € |
| 21,45 s | « Abonne-toi : la partie 2 arrive. » | « Partie 2 : les bruits de l'immeuble. » |

PV, résidence et montant : exemple fictif. Sources : un coup de bélier vient d'une surpression quand l'eau est coupée net
(se règle avec un anti-bélier) ; une VMC qui siffle a des bouches encrassées ou mal réglées ; un évier qui gargouille
signale une évacuation mal ventilée (colonne de chute et ventilation primaire, parties communes en copro).
