# « POV : 3 mois après avoir signé » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-pov.mp4`

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-pov.mp4
```

## Script (140 BPM : 1 mesure = 1,714 s)

| Temps | Image | Son |
|---|---|---|
| 0 s (1ʳᵉ image) | Accroche : « POV : 3 mois après avoir signé sans lire les 300 pages » + notification déjà affichée « Appel de fonds exceptionnel : 12 400 € » | Vibreur + ping |
| 0–6 s | Les notifications s'empilent de plus en plus vite (banque, syndic, AG), le téléphone tremble | Cœur qui s'emballe, tic-tac, montée |
| 6,0 s | L'écran se brise, fond rouge : « Tu aurais pu savoir. » | Impact, verre, acouphène |
| 6,86–8,57 s | **◀◀ REWIND** façon VHS, « −90 JOURS », tout se rembobine | L'intro rejouée à l'envers en accéléré |
| 8,57–12 s | Analyse avant signature : 4 documents cochés, 300 pages lues | **Drop jersey club** |
| 12–13,7 s | Copropriété A : 4 risques → tampon « ON PASSE », swipe | |
| 13,7–17,1 s | Copropriété B : Score 8.4, « Copropriété excellente », feux verts, rapport en 72h | Carillon |
| 17,1–20,6 s | « POV : 3 mois après, version analysée » : bonnes notifications (rapport prêt, signature, prêt accordé, charges stables), confettis | Pings positifs |
| 20,6–24 s | « Même appart. Zéro surprise. » 300 pages lues · 7 critères notés · rapport en 72h | Mini-break, montée |
| 24–30 s | « **Ne signe pas à l'aveugle.** », bouton, analysetacopro.fr, « Lien en bio » | Drop final, queue de réverb |

Les notifications, montants et copropriétés sont fictifs (exemple). Aucune marque réelle de banque ou de syndic n'est utilisée.

## Bande-son

Jersey club originale (la majeur, I–V–vi–IV) générée avec `../audio-engine/engine.py` : grosses caisses sautillantes, « bed squeak », voix découpées, basse 808, arpèges ; intro de tension et rembobinage sonore. Bruitages HyperFrames (licence Pixabay). −11 LUFS.
