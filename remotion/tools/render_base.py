"""Assemble la vidéo de base (1080p30) à partir de segments.json avec ffmpeg.

Usage : python3 tools/render_base.py <source.mp4> <segments.json> <sortie.mp4> [dossier_travail]
Chaque plan est encodé à part (nombre d'images exact, audio PCM pour éviter toute dérive),
puis tout est concaténé : vidéo copiée, audio encodé une seule fois en AAC.
"""
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

src, segs_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
work = sys.argv[4] if len(sys.argv) > 4 else os.path.join(os.path.dirname(out), "parts")
os.makedirs(work, exist_ok=True)
segs = json.load(open(segs_path))
FPS, W, H = 30, 1920, 1080
# zone 9:16 incrustée dans la source 1280x720 (détectée avec cropdetect)
VX, VW = 438, 404


def vfilter(s):
    if s.get("vertical"):
        return (
            f"[0:v]split[a][b];"
            f"[a]crop={VW}:720:{VX}:0,scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=30,eq=brightness=-0.18[bg];"
            f"[b]crop={VW}:720:{VX}:0,scale=-2:{H}:flags=lanczos[fg];"
            f"[bg][fg]overlay=(W-w)/2:0,fps={FPS},setsar=1[v]"
        )
    z = s.get("zoom", 1.0)
    f = f"[0:v]scale={round(W * z / 2) * 2}:{round(H * z / 2) * 2}:flags=lanczos,crop={W}:{H}"
    if s.get("blur"):
        f += ",gblur=sigma=28,eq=brightness=-0.12"
    return f + f",fps={FPS},setsar=1[v]"


def render(i_s):
    i, s = i_s
    path = os.path.join(work, f"p{i:03d}.mkv")
    if os.path.exists(path):
        return path
    dur = s["frames"] / FPS
    vol = s.get("volume", 1.0)
    af = f"[0:a]aresample=48000,volume={vol},afade=t=in:d=0.04,afade=t=out:st={dur - 0.07:.3f}:d=0.07,apad,atrim=0:{dur:.4f}[a]"
    cmd = [
        "ffmpeg", "-v", "error", "-y", "-ss", f"{s['from']:.3f}", "-i", src, "-t", f"{dur + 0.5:.3f}",
        "-filter_complex", vfilter(s) + ";" + af, "-map", "[v]", "-map", "[a]",
        "-frames:v", str(s["frames"]), "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "pcm_s16le", "-ac", "2", "-threads", "2", path + ".tmp.mkv",
    ]
    subprocess.run(cmd, check=True)
    os.replace(path + ".tmp.mkv", path)
    return path


with ThreadPoolExecutor(max_workers=2) as ex:
    parts = list(ex.map(render, enumerate(segs)))

lst = os.path.join(work, "list.txt")
with open(lst, "w") as f:
    for p in parts:
        f.write(f"file '{os.path.abspath(p)}'\n")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
print("ok", out)
