# « CoproMatch » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-match.mp4`. Parodie d'appli de rencontre : on swipe des profils de copropriétés.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-match.mp4
```

## Script (128 BPM : 1 mesure = 1,875 s, 16 mesures = 30 s)

| Mesures | Image | Son |
|---|---|---|
| 1 | « Acheter un appart, c'est comme **un date.** » + icône CoproMatch | Riff de cloche 808 seul, montée |
| 2–3 | Profil « Les Tilleuls » → scan → red flags (ravalement voté, fonds travaux vide) → tampon RED FLAG → swipe à gauche | Drop 1 : phonk brésilienne (tamborzão, basse 808) |
| 4–5 | Profil « Le Panoramique » → 12 % d'impayés, litige → swipe | |
| 6–7 | Profil « Villa Haussmann » → toiture à refaire, DPE G → swipe | |
| 8 | « Tu swipes **à l'aveugle ?** 300 pages de documents par profil. » | Glitch |
| 9 | « On lit les profils pour toi. » | Break : réverb, montée, silence |
| 10–11 | Profil « Résidence du Parc » → feux verts, Score 8.4, tampon MATCH | Drop 2 plus dur, cris de voix |
| 12 | Swipe à droite → « **C'est un match !** » cœurs, Score 8.4 | Étincelles, carillon |
| 13–14 | « Avant ton swipe, on lit tout : 300 pages · 7 critères notés · rapport en 72h » | |
| 15–16 | « **Matche avec la bonne copro.** », bouton, analysetacopro.fr, « Lien en bio » | Impact final |

Les profils, prix et red flags sont fictifs (exemples). « CoproMatch » est un nom inventé pour la vidéo.

## Bande-son

Phonk brésilienne originale (fa dièse mineur) générée avec `../audio-engine/engine.py`, bruitages HyperFrames (licence Pixabay), −11 LUFS.
