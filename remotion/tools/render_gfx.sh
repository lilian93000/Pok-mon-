#!/bin/bash
# Rend uniquement les plages animées en PNG transparents.
# Usage : tools/render_gfx.sh <plages.json> <dossier_sortie> [composition] [concurrence]
set -e
RANGES=$1; OUT=$2; COMP=${3:-VlogOverlay}; CONC=${4:-4}
cd "$(dirname "$0")/.."
BUNDLE=$OUT/bundle
npx remotion bundle --out-dir=$BUNDLE --log=error >/dev/null
python3 -c "import json,sys;[print(a,b) for a,b in json.load(open(sys.argv[1]))]" "$RANGES" | while read a b; do
  [ -f $OUT/$a/done ] && continue
  mkdir -p $OUT/$a
  npx remotion render $BUNDLE $COMP $OUT/$a --sequence --image-format=png --frames=$a-$b \
    --browser-executable=/opt/pw-browsers/chromium --concurrency=$CONC --log=error < /dev/null
  touch $OUT/$a/done && echo "plage $a-$b ok"
done
echo ALLDONE
