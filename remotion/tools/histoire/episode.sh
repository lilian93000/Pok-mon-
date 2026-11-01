#!/bin/bash
# Fabrique un épisode « Un jour, un fait » de A à Z.
# Usage : tools/histoire/episode.sh histoire/episodes/<id>.json
# Variables : ELEVENLABS_API_KEY (obligatoire pour la voix), ELEVENLABS_VOICE_ID (sinon voix « Brian » nPczCjzI2devNBz1zQrb)
set -e
cd "$(dirname "$0")/../.."
EP=$1; ID=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['id'])" "$EP")
python3 tools/histoire/textures.py
python3 tools/histoire/assets.py "$EP"
python3 tools/histoire/build.py "$EP"
mkdir -p out
npx remotion render src/histoire/index.ts Histoire "out/$ID.mp4" \
  --browser-executable=/opt/pw-browsers/chromium --concurrency=$(nproc) --crf=20 --log=error \
  --props="{\"id\":\"$ID\",\"fps\":30,\"duration\":10,\"audio\":null,\"words\":[],\"beats\":[]}"
echo "→ out/$ID.mp4"
