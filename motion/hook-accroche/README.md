# Accroche signature AnalyseTaCopro (2,1 s, 2160×3840, 60 i/s, avec son)

Rendu : `../hook-accroche.mp4`. La **même** accroche devant chaque vidéo TikTok : `../tools/ajouter-accroche.sh <vidéo.mp4> …` (sortie dans `../avec-accroche/`).

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../hook-accroche.mp4
```

## Principe

Sur TikTok tout se joue dans la première demi-seconde : le son et l'image frappent **dès l'image 0**, puis une coupe franche par temps (phonk 128 BPM). La phrase « Ce que ton futur appart te cache » parle à tous les acheteurs (recherche, visite, offre, signature) et ouvre une question à laquelle chaque vidéo répond. La signature : la colonne du logo qui s'écrase en bleu.

| Temps | Écran | Son |
|---|---|---|
| 0 s | Jaune : **CE QUE** | Crash, kick, 808 distordue, cloche phonk |
| 0,47 s | Noir : **TON FUTUR APPART** | Kick, impact, charleston |
| 0,94 s | Rouge, glitch : **TE CACHE** | Alarme, roulement de caisse claire |
| 1,41 s | Bleu : la colonne s'écrase (onde de choc), **On l'a trouvé.** · AnalyseTaCopro | Drop : sub, accord saturé, « hey ! » |
| 2,03 s | Flash vers la vidéo | Souffle |
