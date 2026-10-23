# « LA MÉTÉO DE TA COPRO » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-meteo.mp4`. Un bulletin météo télé… sur une copropriété.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-meteo.mp4
```

## Script (120 BPM : 1 mesure = 2 s)

| Temps | Image | Son |
|---|---|---|
| 0–2 s (1ʳᵉ image) | « ALERTE ROUGE sur ta future copro. », immeuble sous l'orage, vigilance rouge, éclairs | Sirène, tonnerre, pluie |
| 2–4 s | Le ciel se vide : « Les prévisions pour ton futur appart : » | Jingle météo télé |
| 4–7 s | Averses sur la toiture (étanchéité : 27 000 €), vigilance jaune | Groove funk, pluie |
| 7–10 s | Orage électrique (mise aux normes : 14 000 €), la façade se fissure, vigilance orange | Tonnerre |
| 10–13 s | Brouillard chez le syndic (3 syndics en 4 ans) | Nappe |
| 13–16 s | Tempête en AG (procès contre le promoteur), vigilance rouge | Rafales |
| 16–19 s | Prévisions sur 10 ans : orages partout. « Ça, l'agent immo ne te l'a pas dit. » | Tension, roulement |
| 19–25 s | Soleil : « Avec une analyse, tu choisis la copro où il fait beau. » Ciel dégagé (Résidence des Acacias), score 9.1/10, prévisions au beau fixe | Drop house en majeur |
| 25–30 s | « Regarde la météo de ta copro avant de signer. », bouton, analysetacopro.fr, « Lien en bio » | Fin |

Les montants, noms et le score sont fictifs (exemple).

## Bande-son

Originale, générée avec `../audio-engine/engine.py` : générique « météo télé » (glockenspiel, piano électrique), funk à basse slappée, tonnerre et pluie synthétisés, puis house en majeur. −11 LUFS.
