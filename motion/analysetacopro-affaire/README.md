# « L'Affaire n°0347 » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-affaire.mp4`. Enquête façon true crime sur un tableau de liège.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-affaire.mp4
```

## Script (90 BPM : 1 mesure = 2,67 s)

| Temps | Image | Son |
|---|---|---|
| 0 s (1ʳᵉ image) | « DOSSIER N°0347 · CONFIDENTIEL », polaroïd épinglé, « Cet appart… » déjà affiché puis tapé : « …cachait un secret à **45 000 €**. » ; cercle rouge | Vinyle, piano sombre, machine à écrire, « ding » |
| 2,7–8 s | **LES FAITS** — post-it : 289 000 €, vendeur pressé, « aucuns travaux à prévoir », signature dans 15 jours | Contrebasse, coups de punaise |
| 8–16 s | **L'ENQUÊTE** — PV d'AG 2023 page 47 (ravalement voté 45 000 €), relevé (fonds travaux 0 €), courrier d'avocat (procédure contre le syndic) : surligneur, fils rouges, caméra qui pousse | Batterie noir, tampons, surligneur |
| 16–18,7 s | **LE VERDICT** — tampon « COUPABLE » : « 45 000 € de travaux… pour toi. » | Impact, accord grave, la batterie s'arrête |
| 18,7–21,3 s | **LE DÉTECTIVE** — badge AnalyseTaCopro : 300 pages lues, 7 critères, rapport en 72h | Bascule en majeur, cloche |
| 21,3–24 s | Tampon « AFFAIRE CLASSÉE » : « L'acheteur n'a pas signé. » « Ton futur appart a peut-être un dossier. » | Tampon, roulement |
| 24–30 s | « **Enquête sur ta copro avant de signer.** », bouton, analysetacopro.fr, « Lien en bio » | Drop final, piano |

L'affaire, l'adresse et les montants sont fictifs (exemple).

## Bande-son

Trap noir originale (la mineur, 90 BPM) générée avec `../audio-engine/engine.py` : piano électrique sombre, contrebasse, vinyle, machine à écrire, tampons, surligneur. −11,5 LUFS.
