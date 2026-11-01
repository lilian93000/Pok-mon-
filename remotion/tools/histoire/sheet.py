"""Planche des images détourées d'épisodes (contrôle visuel) : sheet.py out.jpg id1 id2 ..."""
import glob, sys
from PIL import Image, ImageDraw
fs = [f for e in sys.argv[2:] for f in sorted(glob.glob(f"public/histoire/{e}/img/*.png"))]
cols = 8; S = Image.new("RGB", (cols * 160, ((len(fs) + cols - 1) // cols) * 180), (40, 40, 40)); d = ImageDraw.Draw(S)
for k, f in enumerate(fs):
    im = Image.open(f); im.thumbnail((155, 155)); x, y = (k % cols) * 160, (k // cols) * 180
    S.paste(im, (x, y), im if im.mode == "RGBA" else None); d.text((x, y + 160), f.split("/")[2][:3] + " " + f.split("/")[-1][:-4], fill="white")
S.save(sys.argv[1])
