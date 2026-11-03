---
name: montage-vlog
description: Monte un vlog voyage YouTube (16:9, 1080p) à partir de rushs bruts - un ou plusieurs clips récupérés sur une Release GitHub, un lien Google Drive/Dropbox ou un fichier envoyé - avec le studio Remotion du dépôt (remotion/). Transcription au mot, dérush (blancs et ratés coupés), accroche, chapitres, sous-titres sobres, étiquettes de lieux et boutiques, prix, carte de la ville animée, fiches « bon à savoir », écran de fin, miniature, description YouTube avec chapitres, puis livraison (fichier < 400 Mo + lien complet). Utiliser quand l'utilisateur dit monte mon vlog, montage, monte ces rushs, fais la vidéo du voyage, /montage-vlog, ou dépose des vidéos de voyage.
---

# Montage vlog

Tout le studio est dans `remotion/`. Lis d'abord `remotion/CLAUDE.md` (règles), `remotion/methode.md`
(méthode), `remotion/suivi.md` (vidéos en cours) et `remotion/docs/direction-artistique.md`.

## Règles qui ne se discutent pas

- **Le dépôt est public** : jamais de vidéo, d'audio, de transcription ni de photo dans git
  (`remotion/public/*` et `remotion/src/data/*` sont ignorés). Travaille dans le dossier scratchpad.
- **Style validé par l'utilisateur** : vlog voyage français **simple**, pas forcé. Textes blancs propres
  (Montserrat), fondus courts. Motion design **utile** : lieux et boutiques, prix, carte de la ville,
  trajets, infos chiffrées. **Jamais** d'emojis-autocollants, d'explosions, de gros contours colorés,
  de barre de progression (jugés « trop enfant » / « trop forcé »).
- **Rien d'inventé** : prix, noms de boutiques et chiffres seulement s'ils sont dits ou visibles à l'écran.
  Une ligne de transcription douteuse est masquée (`NO_CAPTION`), pas devinée.
- **Montrer avant de tout rendre** : un extrait de 2 min d'abord ; la vidéo complète seulement après « ok ».
- Commandes longues (transcription, rendus) en arrière-plan, l'utilisateur interrompt souvent.

## Étapes

Variables : `S=<scratchpad>/<nom>` (travail), `R=/home/user/Pok-mon-/remotion`.

1. **Récupérer les rushs** dans `$S/rushs/`.
   - Release GitHub : lister les assets (outil GitHub `get_release_by_tag`), télécharger
     `https://github.com/<owner>/<repo>/releases/download/<tag>/<fichier>` avec curl, vérifier le sha256.
   - Google Drive / Dropbox : l'utilisateur doit autoriser le domaine (Network access) ; sinon le lui dire.
2. **Une seule source** : `python3 $R/tools/prepare_rushs.py $S/rushs $S/source.mp4`
   (tri par date, 1080p30, verticaux sur fond flou, `source_rushs.json` = position de chaque clip).
   Un seul fichier déjà monté : le copier tel quel en `source.mp4`.
3. **Analyser** : planche contact horodatée (1 image / 10 s), `select='gt(scene,0.3)'` pour les coupes,
   `cropdetect` pour les clips verticaux à bandes noires, repérer les textes déjà incrustés.
4. **Transcrire** (arrière-plan) : `python3 $R/tools/transcribe.py $S/source.mp4 $S/transcript`.
5. **Écrire le plan** `$R/tools/plan_<nom>.py` en copiant `plan_coree.py` : `HOOK` (accroche ~20 s,
   meilleurs moments + titre), `CHAPTERS` (titre, lieu, blocs `talk`/`broll`), `END`, `TIPS`,
   `POPS` (`place`, `price`, `chip`, `route`), `CHAPTER_MAP`, `CITY`, `PLACES` (lat/lon réels),
   `END_TEXT`, `FIX` (corrections de transcription), `NO_CAPTION`.
6. **Construire** : `python3 $R/tools/build_edit.py $S/transcript.json $R/src/data/current.json $S/segments.json <nom>`
   → durée, chapitres, sous-titres `.ass`.
7. **Base vidéo** (arrière-plan) : `python3 $R/tools/render_base.py $S/source.mp4 $S/segments.json $S/base.mp4 $S/parts`.
8. **Extrait 2 min** :
   `python3 $R/tools/gfx_ranges.py $R/src/data/current.json $S/gfx.json 120`,
   `$R/tools/render_gfx.sh $S/gfx.json $S/gfx`,
   `python3 $R/tools/compose_final.py $S/base.mp4 $R/src/data/current.json $S/gfx.json $S/gfx $R/out/apercu.mp4 120`.
   Contrôler 6 images (titre, chapitre, lieu, prix, sous-titres) avant d'envoyer (SendUserFile).
9. **Après validation**, vidéo complète : mêmes commandes sans la limite `120`.
   Vérifier : durée vidéo = durée audio, aucun trou d'horodatage audio.
10. **Livrer** : version < 400 Mo (encodage 2 passes, ~2,7 Mbit/s) via SendUserFile ; version complète
    par lien (branche orpheline `video-<nom>` en Git LFS, à supprimer ensuite) ; miniature
    (composition `Miniature`) ; `out/youtube-description.txt` avec les chapitres.
11. **Mettre à jour** `remotion/suivi.md` (ce qui est validé / refusé) et la DA si l'utilisateur a tranché.
