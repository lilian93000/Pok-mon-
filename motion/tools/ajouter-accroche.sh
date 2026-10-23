#!/usr/bin/env bash
# Place l'accroche signature (hook-accroche.mp4, 2,4 s) devant une ou plusieurs vidéos TikTok 2160×3840 60 i/s.
# Usage : tools/ajouter-accroche.sh analysetacopro-gps.mp4 [autre.mp4 …]   (depuis le dossier motion/)
# Sortie : avec-accroche/<nom>.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p avec-accroche
for v in "$@"; do
  out="avec-accroche/$(basename "$v")"
  ffmpeg -nostdin -loglevel error -y -i hook-accroche.mp4 -i "$v" -filter_complex \
    "[0:v]scale=2160:3840,fps=60,setsar=1[h];[1:v]scale=2160:3840,fps=60,setsar=1[m];[0:a]aresample=48000,aformat=channel_layouts=stereo[ha];[1:a]aresample=48000,aformat=channel_layouts=stereo[ma];[h][ha][m][ma]concat=n=2:v=1:a=1[v][a]" \
    -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart "$out"
  echo "$out $(du -h "$out" | cut -f1)"
done
