# Accroche signature AnalyseTaCopro (2,4 s, 2160×3840, 60 i/s, avec son)

Rendu : `../hook-accroche.mp4`. À placer devant chaque vidéo TikTok avec `../tools/ajouter-accroche.sh` (sortie dans `../avec-accroche/`).

```bash
python3 tools/soundtrack.py <dossier_sfx_hyperframes> assets/audio/soundtrack.wav
npx hyperframes render --resolution portrait-4k -f 60 -q delivery -o ../hook-accroche.mp4
cd .. && tools/ajouter-accroche.sh analysetacopro-gps.mp4 analysetacopro-sante.mp4
```

## Idée

Quand tu achètes en copro, tu n'achètes pas seulement ton appart : tu achètes une part de **tout l'immeuble** — et de ses problèmes.
L'accroche parle à tout le monde (on cherche, on visite, on fait une offre, on signe) et montre ce que fait AnalyseTaCopro : regarder derrière l'annonce.

| Temps | Image | Son |
|---|---|---|
| 0 s (1ʳᵉ image) | « Tu crois acheter ça : » + une annonce (T2 lumineux · 48 m² · 334 000 €), photo d'un salon | Accord feutré |
| 0,2 s | Le doigt « like » l'annonce | « Pop » du like |
| 0,5–1 s | Zoom arrière : la photo n'était qu'une fenêtre… de tout un immeuble | La musique ralentit et plonge |
| 1 s | « En vrai, tu achètes **tout l'immeuble**. » | Boom (sub + impact + accord « marque ») |
| 1,15–1,65 s | Le faisceau bleu **AnalyseTaCopro** scanne la façade : fissure, toiture bâchée, humidité, alertes rouges | Balayage électrique + 4 bips |
| 1,65 s | « …et tous ses problèmes. » | Coup |
| 2,15–2,4 s | Départ éclair vers la vidéo | Souffle |

Le scan bleu et le logo sonore (plongée → boom → bips) servent de signature répétée en tête de chaque vidéo.
