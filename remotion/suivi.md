# Suivi des vidéos

## 1. Vlog « On part en Corée du Sud » — en cours
- Source : Release GitHub `Rush` (24 min 35, 720p, déjà montée une première fois).
- Objectif : remontage YouTube « autrement » (accroche, chapitres, guide, sous-titres).
- Plan : `tools/plan_coree.py` → 17 min 33, 9 chapitres, 11 fiches info.
- À valider par l'utilisateur : DA v1, choix des coupes, accroche, écran de fin.
- Points à vérifier : nom prononcé dans l'intro (non sous-titré, transcription incertaine),
  séquence « fac Ewha » (un plan montre Yonsei).

## 2. TikTok « Tu regardes le passé » (univers) — v1 livrée, à valider
- Format : 1080×1920, 30 i/s, 75 s. Composition `TiktokCiel` (entrée séparée `src/CielRoot.tsx`).
- Style : récit façon « chaîne histoire » (fond sombre texturé, chiffres dorés + frises grecques,
  fonds rouges/dorés à rayons, tampons latins, gravures anciennes en cadre doré, sous-titres mot à mot
  avec mots-clés dorés soulignés).
- Images : vidéos 4K NASA SVS (domaine public) et ESO (CC BY 4.0, crédit **visible à l'écran obligatoire**),
  recadrées en vertical depuis la 4K (ffmpeg) ; gravures Wikimedia (domaine public, sauf outil oldowayen CC BY 3.0).
- Voix : synthèse fr-FR-RemyMultilingualNeural (−6 %, −5 Hz), une phrase à la fois, pauses réglées à la main.
- Son : nappe + battements + impacts + montée avant la supernova, générés en Python ; mix à −14 LUFS.
- À valider : voix (ou réenregistrer avec la vraie voix), rythme, accroche des 2 premières secondes.
