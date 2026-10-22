# « Le Scanner » — AnalyseTaCopro (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-scanner.mp4`

Un seul plan continu sur un immeuble haussmannien : la façade de l'annonce, puis sa radiographie.

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav   # régénère la bande-son
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-scanner.mp4
```

## Script

| Temps | Image | Son |
|---|---|---|
| 0–4 s | « Cet appart a l'air **parfait.** » Façade au soleil, étiquette « À vendre 349 000 € » | Rêverie au piano électrique, la bande freine |
| 4–5 s | « **Vraiment ?** » en glitch, la nuit tombe sur un plan d'architecte | Impact grave, glitch |
| 5–12,5 s | « On passe la copro au scanner. » Un rayon descend : sous lui, l'immeuble passe en radiographie et chaque défaut déclenche une fiche (toiture, façade, impayés, litige), compteur 0 → 100 % | Pulsation sombre, bourdon du scanner qui monte, alertes |
| 12,5–16 s | « Ce que l'annonce ne dit pas. » Bilan : 4 risques, ≈ 9 800 € de frais cachés pour le lot | Battement de cœur, montée |
| 16–18 s | « Et celle-là ? » Coup de fouet vers un autre immeuble, scan express, tout passe au vert | Whoosh, clics, silence d'une croche |
| 18–22 s | DROP : « Celle-là, vous pouvez signer. » Score 8.4, « Copropriété excellente » | Drop en fa majeur, carillon |
| 22–26 s | 300 pages lues · 7 critères notés · 1 rapport clair · 72h chrono | Pops sur chaque ligne |
| 26–30 s | Le rayon révèle « **Scannez avant de signer.** », bouton, analysetacopro.fr, « Lien en bio » | Balayage, frappe clavier, fin au piano |

Les chiffres du scan (38 000 €, 3 lots, 9 800 €…) sont un **exemple illustratif**, signalé à l'écran (« SCAN · EXEMPLE », « Exemple illustratif de scan »).

## Bande-son

- **Musique (v2)** : rêverie au piano électrique → trap sombre pendant le scan → drop phonk lumineux en fa majeur avec supersaw (120 BPM), générée par `tools/soundtrack.py` avec le moteur partagé `../audio-engine/engine.py` ; aucun droit tiers.
- Bruitages : banque intégrée à HyperFrames issue de Pixabay (Pixabay Content License, usage commercial libre).
- Mix normalisé à −11 LUFS (niveau des sons TikTok), limiteur à −1 dBTP.
