# « RED FLAG ou GREEN FLAG ? » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-quiz.mp4`. Quiz façon jeu télé, pensé pour faire réagir en commentaire.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-quiz.mp4
```

## Script (150 BPM : 1 mesure = 1,6 s)

| Temps | Image | Son |
|---|---|---|
| 0 s (1ʳᵉ image) | « **97 %** des acheteurs ratent ces signaux dans les PV d'AG. » | Accord de plateau, roulement |
| 1,6 s | Le logo claque : « RED FLAG ou GREEN FLAG ? Tu joues ? » | Impact, jingle |
| 3,2–19,2 s | 5 manches : signal → minuteur 3 temps → RED FLAG (buzzer) ou GREEN FLAG (jingle) + explication ; pastilles de score | Trap jeu télé, tic-tac, buzzer / jingle |
| 19,2 s | « RÉSULTAT : 3 red flags sur 5 signaux. » + bulle « Et toi, t'en as trouvé combien ? Dis ton score en commentaire » | Fanfare, applaudissements |
| 22,4 s | « Nous, on les trouve tous. » 300 pages lues · 7 critères notés · rapport en 72h | Groove filtré, montée |
| 25,6–30 s | « **Ne joue pas avec ton appart.** », bouton, analysetacopro.fr, « Lien en bio » | Drop final |

Signaux : fonds travaux vide (red), carnet d'entretien à jour (green), 3 syndics en 4 ans (red), 12 % d'impayés (red), ravalement voté et payé par le vendeur (green). Le « 97 % » est une accroche illustrative à valider ou remplacer par un chiffre sourcé avant publication.

## Bande-son

Trap jeu télé originale (do majeur, 150 BPM) générée avec `../audio-engine/engine.py` : minuteur, buzzer, jingles, fanfare et applaudissements synthétisés. −11 LUFS.
