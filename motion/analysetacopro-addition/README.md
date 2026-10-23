# « L'ADDITION » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-addition.mp4`. Le vrai ticket de caisse d'un appart, imprimé ligne par ligne.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-addition.mp4
```

## Script (96 BPM : 1 mesure = 2,5 s)

| Temps | Image | Son |
|---|---|---|
| 0–2,5 s (1ʳᵉ image) | « Le VRAI prix de ton appart : », imprimante, ticket « Appart T3 · Prix affiché 289 000 € », TOTAL 289 000 € | Imprimante à aiguilles, piano vinyle |
| 2,5–10,6 s | Sept coûts cachés s'impriment (ravalement, ascenseur, fonds travaux, procédure, impayés, charges, isolation) ; le TOTAL grimpe | Le beat boom bap tombe, « ka-ching » à chaque ligne |
| 11,25 s | Tampon « +52 000 € DE SURPRISES », TOTAL RÉEL 341 000 € | Coup de tampon, impact |
| 12,5–15 s | « Ça, personne ne te l'a dit. » | Beat filtré, piano seul, montée |
| 15 s | Le ticket se déchire | Papier déchiré, impact |
| 17,5–25 s | « Avec une analyse avant de signer : » ticket AnalyseTaCopro — 300 pages lues, travaux identifiés, charges anticipées, Score 8.4/10, SURPRISES 0 € | Beat en majeur, cloches, « ka-ching » |
| 25–30 s | « Connais l'addition avant de signer. », bouton, analysetacopro.fr, « Lien en bio » | Fin |

Les montants, la résidence et le score sont fictifs (exemple).

## Bande-son

Boom bap originale (la mineur → do majeur, swing façon MPC) générée avec `../audio-engine/engine.py` : piano électrique « vinyle », kick et caisse poussiéreux, basse, imprimante, caisse enregistreuse et déchirement synthétisés. −11,3 LUFS.
