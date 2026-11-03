#!/bin/bash
# Termine un épisode déjà construit (build.py) : musique sur mesure, rendu, normalisation.
# Usage : tools/histoire/finish.sh <id>   (ELEVENLABS_API_KEY requis pour la musique)
set -e
cd "$(dirname "$0")/../.."
ID=$1
python3 tools/histoire/score.py "$ID"
npx remotion render src/histoire/index.ts Histoire "out/$ID.mp4" \
  --browser-executable=/opt/pw-browsers/chromium --concurrency=$(nproc) --crf=18 --log=error \
  --props="{\"id\":\"$ID\",\"fps\":30,\"duration\":10,\"audio\":null,\"words\":[],\"beats\":[]}"
ffmpeg -v error -y -i "out/$ID.mp4" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=9" -ar 48000 -c:a aac -b:a 192k "out/$ID-final.mp4"
echo "→ out/$ID-final.mp4"
