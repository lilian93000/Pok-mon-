#!/bin/bash
# Fabrique un épisode « Un jour, un fait » de A à Z.
# Usage : tools/histoire/episode.sh histoire/episodes/<id>.json
# Variables : ELEVENLABS_API_KEY (obligatoire pour la voix), ELEVENLABS_VOICE_ID (par défaut : 3HZyQcLKlT0a3RDeXVsP)
set -e
cd "$(dirname "$0")/../.."
EP=$1; ID=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['id'])" "$EP")
python3 tools/histoire/textures.py
python3 tools/histoire/sfx.py epique 75
python3 tools/histoire/assets.py "$EP"
python3 tools/histoire/build.py "$EP"
mkdir -p out
npx remotion render src/histoire/index.ts Histoire "out/$ID.mp4" \
  --browser-executable=/opt/pw-browsers/chromium --concurrency=$(nproc) --crf=20 --log=error \
  --props="{\"id\":\"$ID\",\"fps\":30,\"duration\":10,\"audio\":null,\"words\":[],\"beats\":[]}"
ffmpeg -v error -y -i "out/$ID.mp4" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=9" -ar 48000 -c:a aac -b:a 192k "out/$ID-final.mp4"
echo "→ out/$ID-final.mp4"
