# « LE BULLETIN DE NOTES » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-bulletin.mp4`. Le bulletin scolaire de ta future copro, corrigé au stylo rouge.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-bulletin.mp4
```

## Script (140 BPM : 1 mesure ≈ 1,71 s)

| Temps | Image | Son |
|---|---|---|
| 0–2,6 s (1ʳᵉ image) | « J'ai demandé le bulletin de notes de ma future copro. », bulletin vierge sur fond de tableau noir | Sonnerie d'école, craie |
| 2,6–11 s | Une note par mesure, entourée au stylo rouge (Résidence Les Peupliers) : Toiture & étanchéité 5/20 (fuites depuis 2019), Ascenseur 4/20 (en panne 3 mois par an), Assiduité en AG 6/20 (quorum jamais atteint), Relations avec le syndic 3/20 (change tous les ans), Préparation de l'avenir 7/20 (aucun plan de travaux) | Le beat drill tombe, stylo, gribouillis |
| 11,1–14,6 s | Moyenne générale 5/20, tampon « REDOUBLE — avis du conseil : ne pas signer », « Ce bulletin, personne ne te le montre. » | Tampon, impact |
| 14,6–16,3 s | Le bulletin est jeté | Silence, souffle |
| 16,3–24 s | « Avec une analyse, tu compares les bulletins : » Résidence des Acacias : 15, 17, 16, 18, 16 → 16,4/20, tampon doré « FÉLICITATIONS DU CONSEIL — score copro 8.2/10 » | Drill en majeur, cloches, scintillement |
| 24–30 s | « Demande son bulletin avant de signer. », bouton, analysetacopro.fr, « Lien en bio » | Fin |

Les résidences, notes et montants sont fictifs (exemple).

## Bande-son

UK drill originale (808 glissante, charleston en triolets) générée avec `../audio-engine/engine.py`, avec sonnerie, craie, stylo et tampons synthétisés ; « sparkle » HyperFrames (Pixabay) sur le tampon doré. −10,9 LUFS.
