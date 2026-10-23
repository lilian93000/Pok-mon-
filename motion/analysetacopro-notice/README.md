# « NOTICE DE MONTAGE » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-notice.mp4`. Acheter un appart expliqué comme une notice de meuble en kit… à laquelle il manque une étape.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-notice.mp4
```

## Script (124 BPM : 1 mesure ≈ 1,94 s)

| Temps | Image | Son |
|---|---|---|
| 0–2,4 s (1ʳᵉ image) | « Notice pour acheter un appart. (il manque une étape) », couverture : carton, bonhomme « 1× », panneau ⚠ | Marimba |
| 2,4–12,1 s | Étapes 1 Visiter, 2 Négocier (289 000 € → 275 000 €), 3 Signer, 4 Emménager, chacune validée ✓ | Tech-house, page tournée, « ding » |
| 12,1–14,5 s | « Euh… il reste des pièces. » PV d'AG ×3, carnet d'entretien, relevé de charges, « ? » | Pièces qui tombent, « boing » |
| 14,5–17,9 s | « Résultat : 45 000 € de surprise. » L'immeuble se fissure et penche, ✗ rouge | Fracas, impact |
| 17,9–20,3 s | Étape **0** : faire analyser la copro (300 pages, loupe 8.4, AnalyseTaCopro) | Montée lumineuse |
| 20,3–24 s | « Avec l'étape 0, tout tient debout. » Montage réussi, score copro 8.4/10 | Drop en majeur |
| 24–30 s | « Ne saute pas l'étape 0. », bouton, analysetacopro.fr, « Lien en bio » | Fin |

Les montants et le score sont fictifs (exemple).

## Bande-son

Tech-house ludique originale (marimba, bloc de bois, basse) générée avec `../audio-engine/engine.py`, avec pages, « ding », chutes et fracas synthétisés. −11 LUFS.
