# « GAME OVER » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-arcade.mp4`. L'achat d'un appart raconté comme un jeu de plateforme 8 bits.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-arcade.mp4
```

## Script (120 BPM)

| Temps | Image | Son |
|---|---|---|
| 0–2 s (1ʳᵉ image) | Écran titre « ACHÈTE TON APPART », PRESS START | Fanfare chiptune |
| 2–7,4 s | 1er essai : le perso court, pièges cachés — mur « Ravalement −45 000 € », piques « Impayés −8 000 € », trappe « Fonds travaux 0 € » | Thème de niveau, dégâts, chute |
| 8–12 s | **GAME OVER**, compte à rebours CONTINUE ?, pièce insérée | Jingle de game over, pièce |
| 12–14 s | POWER-UP « Vision 300 pages » (AnalyseTaCopro) | Arpèges montants, impact |
| 14–20 s | 2e essai : les pièges sont visibles, sauts, bonus, drapeau | Thème en fa majeur + batterie trap |
| 20–22 s | LEVEL COMPLETE, Score copro 8.4/10 | Fanfare de fin de niveau |
| 22–26 s | MEILLEURS SCORES | Chiptune lo-fi |
| 26–30 s | « Ne joue pas ton appart en mode difficile. », bouton, analysetacopro.fr, « Lien en bio » | Fin |

Les montants et les scores sont fictifs (exemple).

## Bande-son

Chiptune originale (ondes carrées, triangle 4 bits, bruit) générée avec `../audio-engine/engine.py`, mêlée à une batterie trap au 2e essai. −11 LUFS.
