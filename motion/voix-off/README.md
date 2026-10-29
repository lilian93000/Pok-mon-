# Voix off TikTok

- Voix : **Liam** (ElevenLabs, modèle `eleven_v3`, ton « excited »), en français.
- Textes : `TEXTES.md` (≈ 35–40 mots par vidéo, calés à la seconde sur l'image).
- Script : `../tools/voix-off.py` — génère chaque phrase, la place au plus près de son image (sans chevauchement),
  baisse la musique sous la voix (sidechain), normalise à −11 LUFS et remplace la piste son de `../avec-accroche/<vidéo>.mp4`.
- Résultat final (accroche + vidéo + musique + voix) : `../tiktok-final/`.

```bash
ELEVEN_KEY_FILE=/chemin/hors-depot/cle VO_CACHE=/tmp/vo python3 tools/voix-off.py            # toutes les vidéos
ELEVEN_KEY_FILE=… python3 tools/voix-off.py gps meteo                                          # quelques-unes
```

La clé API n'est jamais stockée dans le dépôt. Licence : le plan gratuit ElevenLabs n'autorise pas l'usage commercial —
passer au minimum au plan payant (Starter) avant de publier ces vidéos pour AnalyseTaCopro.

## Vidéos « utiles » : voix de Guillaume (calage strict)

- Voix : **Guillaume** (`3HZyQcLKlT0a3RDeXVsP`, `eleven_multilingual_v2`), réglée dans `tools/voix-off.py` (`VO_VOICE=guillaume`).
- Script : `../tools/voix-utiles.py` — tire les phrases des fiches (`tools/edu/edu_specs.py`) : titre, chaque explication
  quand son encadré apparaît, 1ʳᵉ carte « Bon à savoir », phrase de fin. Chaque phrase démarre à l'apparition de son texte
  et finit avant le suivant (accélération ≤ ×1,15, sinon version courte de `SHORT`). Le décalage voix/image est mesuré
  sur chaque fichier final.
- Sorties : `../tiktok-1080-sans-musique/` (voix + bruitages, à publier avec un son TikTok à 10–15 %)
  et `../tiktok-1080/` (voix + fond lo-fi discret). Les versions 4K sont dans `tiktok-sans-musique/` et `tiktok-final/`.

```bash
ELEVEN_KEY_FILE=/chemin/hors-depot/cle VO_CACHE=/tmp/vo python3 tools/voix-utiles.py --list carrez   # voir les phrases
ELEVEN_KEY_FILE=… VO_CACHE=… python3 tools/voix-utiles.py carrez dpe                                  # générer
```
