# Un jour, un fait — TikTok histoire

Un fait historique par vidéo (≈ 45–70 s, 1080×1920).

- `faits.md` : les 70 faits à traiter (cocher quand fait).
- `episodes/<nº>-<nom>.json` : script d'un épisode (plans, images, mots-clés entre `*astérisques*`).
- Images : collection Open Access du Metropolitan Museum (domaine public, CC0), détourées automatiquement.

## Fabriquer une vidéo
```bash
export ELEVENLABS_API_KEY=...   # dans les secrets de l'environnement, jamais dans le dépôt
export ELEVENLABS_VOICE_ID=...  # la voix ElevenLabs à utiliser
tools/histoire/episode.sh histoire/episodes/001-vespasien.json   # → out/001-vespasien.mp4
```
Sans clé, la vidéo sort muette avec un minutage estimé (aperçu pour valider l'image).

## Écrire un épisode
Chaque plan (`beats`) = une phrase et une image. Options : `bg` (`dark`/`red`), `rays`, `zoom`,
`stamp` (tampon), `label` (nom sous l'image), `date`, `counter` (`{"to": 40000000000}`), `heads`, `outro`.
Règle : chaque chiffre et chaque date doit être vérifiable ; si un fait ne repose que sur un auteur
antique, on le dit à l'oral (« selon Suétone… »).
