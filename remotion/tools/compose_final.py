"""Assemble la vidéo finale : base ffmpeg + sous-titres ASS + barre de chapitres + animations Remotion.

Usage : python3 tools/compose_final.py <base.mp4> <src/data/video.json> <gfx_ranges.json> <dossier_gfx> <sortie.mp4> [durée_max_s]
"""
import json
import os
import subprocess
import sys

base, edit_path, ranges_path, gfx_dir, out = sys.argv[1:6]
limit = ["-t", sys.argv[6]] if len(sys.argv) > 6 else []  # pour un extrait
here = os.path.dirname(os.path.abspath(__file__))
fonts = os.path.join(here, "..", "fonts")
ass = edit_path.rsplit(".", 1)[0] + ".ass"
e = json.load(open(edit_path))
ranges = json.load(open(ranges_path))
FPS, W = 30, 1920

# --- barre de progression par chapitres (en haut) ---
ch = e["chapters"]
start, end = ch[0]["at"], e["endScreenAt"]
pad, gap, y, h = 24, 6, 14, 5
usable = W - 2 * pad - gap * (len(ch) - 1)
bars, x = [], pad
for i, c in enumerate(ch):
    s = c["at"]
    t_end = ch[i + 1]["at"] if i + 1 < len(ch) else end
    w = max(2, round(usable * (t_end - s) / (end - start)))
    on = f"between(t,{start:.3f},{end:.3f})"
    bars.append(f"drawbox=x={x}:y={y}:w={w}:h={h}:color=white@0.35:t=fill:enable='{on}'")
    # remplissage rose proportionnel à l'avancement du chapitre
    bars.append(
        f"drawbox=x={x}:y={y}:w='max(1,{w}*clip((t-{s:.3f})/{t_end - s:.3f},0,1))':h={h}:color=0xFFD400:t=fill:"
        f"enable='between(t,{s:.3f},{end:.3f})'"
    )
    x += w + gap

bars = []  # style simple : pas de barre de progression
esc_ass = ass.replace(":", "\\:").replace("'", "\\'")
# setpts=N/FPS : la concaténation laisse de petits trous d'horodatage (~2 s sur 17 min) ;
# on renumérote les images pour rester calé sur l'audio (continu) et sur les sous-titres.
chain = [f"[0:v]setpts=N/{FPS}/TB,subtitles='{esc_ass}':fontsdir='{fonts}'" + "".join("," + b for b in bars) + "[v0]"]
inputs = ["-i", base]
for k, (a, b) in enumerate(ranges, 1):
    # Remotion complète parfois les numéros par des zéros (element-000.png) : on lit par glob
    inputs += ["-thread_queue_size", "512", "-framerate", str(FPS), "-pattern_type", "glob",
               "-i", os.path.join(gfx_dir, str(a), "element-*.png")]
    chain.append(f"[{k}:v]setpts=PTS-STARTPTS+{a / FPS:.4f}/TB[g{k}]")
    chain.append(
        f"[v{k - 1}][g{k}]overlay=0:0:eof_action=pass:repeatlast=0:enable='between(t,{a / FPS:.4f},{(b + 1) / FPS:.4f})'[v{k}]"
    )
last = f"[v{len(ranges)}]"
fg = ";".join(chain)
fg += ";[0:a]asetpts=N/SR/TB[aout]"  # même renumérotation côté audio (sinon ~2 s de décalage en fin)
cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fg, "-map", last, "-map", "[aout]",
       "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", str(FPS),
       "-c:a", "aac", "-b:a", "192k", *limit, "-movflags", "+faststart", out]
subprocess.run(cmd, check=True)
print("ok", out)
