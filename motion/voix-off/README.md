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
