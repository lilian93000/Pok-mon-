# Moteur audio des vidéos AnalyseTaCopro

`engine.py` (numpy + ffmpeg) : instruments façon TR-808 et phonk (grosse caisse, caisse claire, clap, charleston métallique, cloche 808 accordée, basse 808 qui glisse, cris de voix en formants, supersaw, piano électrique), effets de transition (montée, cymbale inversée, impact, whoosh, arrêt de bande), bus stéréo avec réverbération à convolution, sidechain sur la grosse caisse, saturation, limiteur, puis mixage des bruitages HyperFrames et normalisation à −11 LUFS en deux passes.

Chaque vidéo a son `tools/soundtrack.py` qui importe ce moteur :

```bash
python3 <projet>/tools/soundtrack.py <dossier_sfx_hyperframes> <projet>/assets/audio/soundtrack.wav
```

Remplacer la musique d'une vidéo déjà rendue sans refaire l'image :

```bash
ffmpeg -i video.mp4 -i soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest sortie.mp4
```
