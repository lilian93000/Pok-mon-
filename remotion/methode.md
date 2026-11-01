# Méthode de montage

1. **Réception** — le rush est déposé en Release GitHub ; on le télécharge et on vérifie
   l'empreinte sha256. Copie dans `public/`.
2. **Analyse** — `ffprobe` (format, durée), planches contact horodatées (1 image / 10 s),
   détection des coupes (`scene`), des clips verticaux (`cropdetect`), des textes incrustés.
3. **Transcription** — audio 16 kHz mono → faster-whisper, horodatage au mot.
4. **Plan** — `tools/plan_<video>.py` : accroche, chapitres, blocs gardés (`talk` = coupé au
   mot, blancs > 1 s retirés ; `broll` = gardé tel quel), fiches info, corrections de
   transcription, lignes non sous-titrées.
5. **Construction** — `python3 tools/build_edit.py transcript.json src/data/<video>.json segments.json`
   → durée, chapitres (minutages YouTube), sous-titres, fiches.
6. **Base vidéo** — `python3 tools/render_base.py rush.mp4 segments.json base.mp4`
   (1080p30, recadrage, fond flou des clips verticaux, jump cuts zoomés, fondus audio).
7. **Calque** — `npx remotion render <Video>Overlay out/overlay --sequence --image-format=png`.
8. **Final** — superposition ffmpeg base + calque → `out/<video>-final.mp4`.
9. **Contrôle** — planche de vérification, écoute des coupes, puis livraison + chapitres
   YouTube + proposition de miniature.
10. **Retours** — noter dans `suivi.md` ce qui est validé/refusé ; mettre à jour la DA et la
    bibliothèque d'effets.
