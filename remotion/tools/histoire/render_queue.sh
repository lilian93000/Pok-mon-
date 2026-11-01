#!/bin/bash
# File de rendu : rend chaque épisode qui a un props.json avec voix mais pas encore de out/<id>-final.mp4.
# Tourne en boucle (attend les nouveaux épisodes) jusqu'à ce que le fichier out/queue.stop existe.
cd "$(dirname "$0")/../.."
mkdir -p out
while [ ! -f out/queue.stop ]; do
  did=0
  for p in $(ls public/histoire/*/props.json 2>/dev/null | sort); do
    id=$(basename $(dirname $p))
    [ -f out/$id-final.mp4 ] && continue
    grep -q '"audio": "histoire' $p || continue
    [ -f public/histoire/$id/ready ] || continue
    echo "$(date +%H:%M) rendu $id"
    npx remotion render src/histoire/index.ts Histoire out/$id.mp4 --browser-executable=/opt/pw-browsers/chromium \
      --log=error --concurrency=$(nproc) --crf=20 \
      --props="{\"id\":\"$id\",\"fps\":30,\"duration\":10,\"audio\":null,\"words\":[],\"beats\":[]}" < /dev/null \
    && ffmpeg -v error -y -i out/$id.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=9" -ar 48000 -c:a aac -b:a 192k -t 60 out/$id-final.mp4 \
    && rm -f out/$id.mp4 && echo "$(date +%H:%M) OK $id" || echo "$(date +%H:%M) ECHEC $id"
    did=1; break
  done
  [ $did = 0 ] && sleep 20
done
