"""Prépare plusieurs rushs (téléphone, caméra…) en UNE source continue pour le montage.

Usage : python3 tools/prepare_rushs.py <dossier_rushs> <sortie.mp4> [rushs.json]

- trie les clips par date de tournage (métadonnée creation_time, sinon nom de fichier) ;
- les normalise tous en 1920x1080, 30 i/s, son stéréo 48 kHz (les clips verticaux sont
  posés au centre sur un fond flou, comme dans le montage) ;
- les met bout à bout dans <sortie.mp4> ;
- écrit rushs.json : pour chaque clip, son nom, sa date et sa position (début/fin en s)
  dans la source, pour retrouver « quel clip » dans le plan de montage.
"""
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

src_dir, out = sys.argv[1], sys.argv[2]
index_path = sys.argv[3] if len(sys.argv) > 3 else os.path.splitext(out)[0] + "_rushs.json"
work = os.path.splitext(out)[0] + "_norm"
os.makedirs(work, exist_ok=True)
EXT = (".mp4", ".mov", ".m4v", ".mkv", ".avi", ".mts", ".webm")
FPS, W, H = 30, 1920, 1080


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path],
                       capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


clips = []
for name in sorted(os.listdir(src_dir)):
    if not name.lower().endswith(EXT):
        continue
    path = os.path.join(src_dir, name)
    info = probe(path)
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), None)
    if not v:
        continue
    has_audio = any(s["codec_type"] == "audio" for s in info["streams"])
    tags = {**info["format"].get("tags", {}), **v.get("tags", {})}
    date = tags.get("com.apple.quicktime.creationdate") or tags.get("creation_time") or ""
    w, h = int(v["width"]), int(v["height"])
    rot = int(tags.get("rotate", 0) or 0)
    for sd in v.get("side_data_list", []):
        rot = int(sd.get("rotation", rot) or rot)
    if abs(rot) in (90, 270):
        w, h = h, w
    clips.append({"file": name, "path": path, "date": date, "vertical": h > w, "audio": has_audio,
                  "duration": float(info["format"]["duration"])})

clips.sort(key=lambda c: (c["date"] or "~", c["file"]))
print(f"{len(clips)} clips, {sum(c['duration'] for c in clips) / 60:.1f} min au total")


def normalize(ic):
    i, c = ic
    dst = os.path.join(work, f"c{i:03d}.mkv")
    if os.path.exists(dst):
        return dst
    if c["vertical"]:
        vf = (f"[0:v]split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
              f"gblur=sigma=30,eq=brightness=-0.18[bg];[b]scale=-2:{H}:flags=lanczos[fg];"
              f"[bg][fg]overlay=(W-w)/2:0,fps={FPS},setsar=1,format=yuv420p[v]")
    else:
        vf = (f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},"
              f"fps={FPS},setsar=1,format=yuv420p[v]")
    # clip sans son : piste silencieuse pour garder l'audio continu
    audio_in = [] if c["audio"] else ["-f", "lavfi", "-t", str(c["duration"]), "-i", "anullsrc=r=48000:cl=stereo"]
    amap = "0:a" if c["audio"] else "1:a"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", c["path"], *audio_in, "-filter_complex", vf,
                    "-map", "[v]", "-map", amap, "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
                    "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "2", "-shortest", dst + ".tmp.mkv"], check=True)
    os.replace(dst + ".tmp.mkv", dst)
    return dst


with ThreadPoolExecutor(max_workers=2) as ex:
    parts = list(ex.map(normalize, enumerate(clips)))

# position de chaque clip dans la source finale (durées réelles après normalisation)
t = 0.0
for c, p in zip(clips, parts):
    d = float(probe(p)["format"]["duration"])
    c["start"], c["end"] = round(t, 3), round(t + d, 3)
    t += d
    del c["path"]

lst = os.path.join(work, "list.txt")
with open(lst, "w") as f:
    for p in parts:
        f.write(f"file '{os.path.abspath(p)}'\n")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
json.dump(clips, open(index_path, "w"), ensure_ascii=False, indent=1)
print("ok", out, "·", index_path)
