# Accroche signature AnalyseTaCopro (2,1 s, 2160×3840, 60 i/s, avec son)

Rendu : `../hook-accroche.mp4`. La **même** accroche devant chaque vidéo TikTok : `../tools/ajouter-accroche.sh <vidéo.mp4> …` (sortie dans `../avec-accroche/`).

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../hook-accroche.mp4
```

## Principe

Sur TikTok tout se joue dans la première demi-seconde : le son et l'image frappent **dès l'image 0**, puis une coupe franche par temps (128 BPM, coups d'orchestre façon bande-annonce + trap). La phrase « Ce que ton futur appart te cache » parle à tous les acheteurs (recherche, visite, offre, signature) et ouvre une question à laquelle chaque vidéo répond. La signature : la colonne du logo qui s'écrase en bleu.

| Temps | Écran | Son |
|---|---|---|
| 0 s | Jaune : **CE QUE** | Coup d'orchestre en ré + timbale + 808, dès l'image 0 |
| 0,47 s | Noir : **TON FUTUR APPART** | Coup d'orchestre en fa, charleston trap qui s'accélère |
| 0,94 s | Rouge, glitch : **TE CACHE** | Coup dissonant haché (glitch) + montée |
| 1,41 s | Bleu : la colonne s'écrase (onde de choc), **On l'a trouvé.** · AnalyseTaCopro | « BRAAAM » grave + sub + impact, puis la cloche de marque |
| 2,03 s | Flash vers la vidéo | Souffle |
