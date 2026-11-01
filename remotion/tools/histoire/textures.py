"""Textures fixes (grain + marbre) : public/histoire/_tex/. Bien plus rapide au rendu que des filtres SVG."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
out = Path(__file__).resolve().parents[2] / "public" / "histoire" / "_tex"
out.mkdir(parents=True, exist_ok=True)
if not (out / "marble.png").exists():
    rng = np.random.default_rng(3)
    for k in range(4):
        Image.fromarray(rng.normal(128, 40, (960, 540)).clip(0, 255).astype("uint8")).save(out / f"grain{k}.png")
    W, H = 1080, 1920
    acc = np.zeros((H, W))
    for s, a in [(4, 1), (16, .5), (64, .25), (160, .12)]:
        n = rng.random((H // s + 2, W // (s * 3) + 2))
        acc += a * np.array(Image.fromarray((n * 255).astype("uint8")).resize((W, H), Image.BICUBIC)) / 255
    acc = (acc - acc.min()) / (acc.max() - acc.min())
    veins = np.exp(-(np.sin(acc * 18 + np.linspace(0, 6, W)[None, :] * 0.6)) ** 2 * 40)
    Image.fromarray((veins * 200).clip(0, 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.2)).save(out / "marble.png")
