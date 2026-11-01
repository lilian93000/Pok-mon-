"""Télécharge les images d'un épisode et détoure celles marquées "cut".
Usage : python3 tools/histoire/assets.py histoire/episodes/<id>.json
Sortie : public/histoire/<id>/img/<clé>.png (ignoré par git)."""
import io, json, sys, urllib.request
from pathlib import Path
from PIL import Image

ep = json.load(open(sys.argv[1]))
out = Path(__file__).resolve().parents[2] / "public" / "histoire" / ep["id"] / "img"
out.mkdir(parents=True, exist_ok=True)
session = None
for key, spec in ep["images"].items():
    dst = out / f"{key}.png"
    if dst.exists():
        continue
    raw = urllib.request.urlopen(urllib.request.Request(spec["url"], headers={"User-Agent": "histoire-shorts/1.0"}), timeout=120).read()
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    im.thumbnail((1600, 1600))
    if spec.get("cut"):
        from rembg import remove, new_session
        session = session or new_session("isnet-general-use")
        im = remove(im, session=session)
        bbox = im.getchannel("A").point(lambda a: 255 if a > 40 else 0).getbbox()
        if bbox:
            im = im.crop(bbox)
    im.save(dst)
    print("ok", key, im.size)
