# AnalyseTaCopro — motion design ultra 4K (2160×3840, 60 i/s, 30 s, avec son)

Rendu : `../analysetacopro-4k.mp4`

Composé en 1080×1920 (tout est vectoriel) et rendu en portrait-4k :

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav   # régénère la bande-son
npx hyperframes check
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../analysetacopro-4k.mp4
```

## Déroulé (calé sur la musique à 120 BPM : 1 mesure = 2 s)

| Temps | Scène | Son |
|---|---|---|
| 0–4 s | Trait de lumière, le logo colonne se construit en 3D, le nom claque à 2 s (flash, onde de choc, particules, tremblement) | Montée, impact basse + sub, la batterie démarre |
| 4–8 s | « N'ACHETEZ / PAS SANS / ANALYSER / VOTRE / COPRO. » : une ligne par temps, en bascule 3D ; glitch RVB puis remplissage d'« ANALYSER » | Groove, whoosh, glitch |
| 8–12 s | Tunnel de documents qui fonce vers la caméra, compteur 300 qui claque | Impact sur le temps fort |
| 12–16 s | « Ce qu'elles cachent : » + 3 tuiles risques qui tombent sur les temps forts, lueur rouge, glitch | 3 impacts, alerte, glitch |
| 16–18 s | « Ni l'agence. Ni le notaire. **Nous, si.** » | Break : roulement de caisse claire, montée, silence d'une croche |
| 18–24 s | DROP : carte Score en verre qui bascule en 3D, jauge 0 → 8.4, critères du site, reflet lumineux | Drop complet, arpège, ping |
| 24–30 s | « Achetez l'esprit tranquille. », bouton, analysetacopro.fr tapé au clavier, « Lien en bio » | Pop, frappe clavier, carillon, fin |

Habillage permanent : grain pellicule animé, vignettage, flashs de coupe. Texte dans la zone sûre TikTok (x 70–920, y 220–1480).

## Bande-son

- **Musique** : composition originale synthétisée par `tools/soundtrack.py` (fa mineur, Fm–D♭–A♭–E♭, 120 BPM) ; aucun droit tiers.
- **Bruitages** : banque intégrée à HyperFrames, issue de Pixabay (Pixabay Content License, usage commercial libre, sans attribution obligatoire).
- Mix normalisé à −14 LUFS (cible TikTok), crête −1,5 dBTP.
