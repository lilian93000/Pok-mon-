# Studio de montage — règles permanentes

À relire au début de chaque session de montage.

## Fichiers mémoire
- `methode.md` : les étapes du montage, dans l'ordre.
- `suivi.md` : journal des vidéos (fait / validé / refusé / à faire).
- `docs/direction-artistique.md` : la DA validée (couleurs, police, sous-titres, rythme).
- `docs/library/` : effets validés, réutilisables (un fichier par effet).

## Règles
- Ne jamais committer de vidéo, d'audio ni de transcription : le dépôt est **public**
  (rushs dans `public/`, rendus dans `out/`, tout est ignoré par git).
- Les rushs arrivent par une **Release GitHub** (jusqu'à 2 Go) ; les supprimer après le montage.
- Toujours monter à partir d'une **transcription** (faster-whisper `large-v3-turbo`, mots horodatés).
- Ne pas inventer de mots dans les sous-titres : une ligne douteuse est masquée (`NO_CAPTION`),
  pas devinée.
- Montage hybride (rapide) : ffmpeg assemble les plans → Remotion rend un calque transparent
  (titres, sous-titres, fiches) → ffmpeg superpose. Le rendu Remotion « vidéo comprise » est
  ~20× plus lent : à réserver aux aperçus dans le Studio.
- Ne rien publier sur YouTube / réseaux : on livre le fichier, l'utilisateur publie.
