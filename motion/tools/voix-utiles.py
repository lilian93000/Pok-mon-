"""Voix off des vidéos « utiles » : Guillaume lit ce qui apparaît à l'écran, au moment où ça apparaît.

Les phrases sont tirées des fiches (tools/edu/edu_specs.py) :
  0,2 s         le titre (cap)
  TIP[k]        chaque explication (tips), quand son encadré apparaît
  20,2          « Bon à savoir » : la première carte (know) ; la seconde reste à lire à l'écran
  24,3          la phrase de fin (endtitle)
Une fiche peut fournir ses propres phrases avec la clé « vo » (liste de (temps, texte)), par ex. « vraifaux ».

Calage strict : chaque phrase démarre quand son texte apparaît et doit finir avant le suivant. Si elle est trop
longue, elle seule est accélérée (×1,15 au plus), puis on retire son intitulé ; la voix n'est jamais en avance.
Deux versions : sans musique (voix + bruitages, pour un son TikTok) et avec un fond lo-fi discret.

Usage (depuis motion/) :
  python3 tools/voix-utiles.py --list [noms…]        # affiche les phrases et leurs temps, sans rien générer
  ELEVEN_KEY_FILE=… VO_CACHE=… python3 tools/voix-utiles.py [noms…]
"""
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools", "edu"))
import edu_specs  # noqa: E402

os.environ.setdefault("VO_VOICE", "guillaume")
sys.path.insert(0, os.path.join(ROOT, "audio-engine"))
import importlib.util  # noqa: E402
import subprocess  # noqa: E402

import numpy as np  # noqa: E402

_s = importlib.util.spec_from_file_location("vo", os.path.join(ROOT, "tools", "voix-off.py"))
vo = importlib.util.module_from_spec(_s)
_s.loader.exec_module(vo)
SFX = "/root/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/skills/media-use/audio/assets/sfx"
MAX_TEMPO = 1.15
VERSIONS = (("tiktok-sans-musique", "tiktok-1080-sans-musique", "sfx", 0.14), ("tiktok-final", "tiktok-1080", "lofi", 0.28))
KEEP = {"AG", "PV", "DPE", "VMC", "PLU", "PNO", "ABF", "RC", "TV", "4G/5G", "4/16/4", "UW"}

KNOW = (20.2,)
END = 24.3


def plain(h):
    """Texte affiché (HTML) → texte lisible."""
    h = re.sub(r"<br\s*/?>", " ", h)
    h = re.sub(r"<[^>]+>", "", h)
    h = html.unescape(h).replace(" ", " ")
    return re.sub(r"\s+", " ", h).strip()


def sentence(t):
    t = t.strip()
    return t if t[-1:] in ".!?…»" else t + "."


def heading(h):
    """« LE COUP DE BÉLIER » → « Le coup de bélier » (sigles conservés)."""
    w = [x if x.upper() in KEEP else x.lower() for x in plain(h).split()]
    t = " ".join(w)
    return t[:1].upper() + t[1:]


def joined(h, x):
    h = heading(h)
    x = sentence(plain(x))
    if h.upper() in ("VRAI", "FAUX") or not h:
        return x
    x = x[:1].lower() + x[1:] if not re.match(r"[A-Z]{2}|\d", x) else x
    return f"{h} {x[:1].upper() + x[1:]}" if h.endswith("?") else f"{h} : {x}"


def lines(name):
    """Liste de (temps d'apparition, [variantes du plus complet au plus court], échéance)."""
    spec = edu_specs.SPECS[name]
    if "vo" in spec:
        v = list(spec["vo"])
        return [(t, [x], (v[i + 1][0] if i + 1 < len(v) else 29.6) - 0.12) for i, (t, x) in enumerate(v)]
    T = json.loads(spec["T"])
    tip_at = spec.get("tipat", [round(t + 0.3, 2) for t in T])
    tips = spec.get("tips", [])
    out = [(0.2, [sentence(plain(spec["cap"]))], (tip_at[0] if tips else KNOW[0]) - 0.12)]
    for k, (h, x) in enumerate(tips):
        nxt = tip_at[k + 1] if k + 1 < len(tips) else KNOW[0]
        out.append((tip_at[k], [joined(h, x), sentence(plain(x))], nxt - 0.12))
    know = spec.get("know", [])
    if know:
        # les deux cartes ne restent que 4 s : la voix lit la première, la seconde reste à lire à l'écran
        h, x = know[0][0], know[0][1]
        out.append((KNOW[0], ["Bon à savoir. " + joined(h, x), joined(h, x), sentence(plain(x))], END - 0.15))
    out.append((END, [sentence(plain(" ".join(spec["endtitle"])))], 29.6))
    return out


def tts(text):
    p = os.path.join(vo.CACHE, __import__("hashlib").sha1(f"{vo.VOICE}|{vo.MODEL}|{text}".encode()).hexdigest()[:16] + ".wav")
    vo.tts(text, p)
    return p


def plan(name):
    """Calage strict → [(début, fichier, tempo, texte)], alertes."""
    out, warn, prev_end = [], [], 0.0
    for i, (t, variants, deadline) in enumerate(lines(name)):
        start = max(t, prev_end + 0.1)
        if start > t + 0.05:
            warn.append(f"{t:.2f} commence en retard ({start:.2f})")
        dl = deadline
        pick = None
        for x in variants:
            p = tts(x)
            d = vo.dur(p)
            tempo = max(1.0, d / max(0.3, dl - start))
            if tempo <= MAX_TEMPO:
                pick = (start, p, tempo, x)
                break
        if pick is None:
            tempo = MAX_TEMPO
            pick = (start, p, tempo, x)
            warn.append(f"{t:.2f} trop long ({d:.2f} s pour {dl - start:.2f} s) : « {x} »")
        out.append(pick)
        prev_end = pick[0] + vo.dur(pick[1]) / pick[2]
    return out, warn


def beds(name):
    spec = edu_specs.SPECS[name]
    T = json.loads(spec["T"])
    st = importlib.util.spec_from_file_location("st", os.path.join(ROOT, f"analysetacopro-{name}", "tools", "soundtrack.py"))
    m = importlib.util.module_from_spec(st)
    st.loader.exec_module(m)
    import edu_track
    paths = {}
    for kind in ("sfx", "lofi"):
        p = os.path.join(vo.CACHE, f"bed-{name}-{kind}.wav")
        if not os.path.exists(p):
            edu_track.build("lofi", 82, m.PROG, T, 20.0, SFX, p, music=(kind == "lofi"))
        paths[kind] = p
    return paths


def lag_ms(name, pl, path):
    """Décalage mesuré entre la voix prévue et la voix entendue dans le fichier final (corrélation d'enveloppes)."""
    SR = 8000
    dec = lambda p: np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-i", p, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                                                 capture_output=True).stdout, np.float32)
    fin = dec(path)
    ref = np.zeros(len(fin), np.float32)
    for st, p, tempo, _ in pl:
        a = dec(p)
        if tempo != 1.0:
            idx = np.arange(0, len(a), tempo).astype(int)
            a = a[idx[idx < len(a)]]
        i = int(st * SR)
        ref[i:i + len(a)] += a[: max(0, len(ref) - i)]
    env = lambda x: np.sqrt(np.convolve(x ** 2, np.ones(400) / 400, "same"))[::80]
    er, ef = env(ref), env(fin)
    er, ef = er - er.mean(), ef - ef.mean()
    n = len(er)
    lags = range(-300, 301)
    c = [np.dot(er[max(0, -l):n - max(0, l)], ef[max(0, l):n - max(0, -l)]) for l in lags]
    return lags[int(np.argmax(c))] * 10


def run(name):
    src = os.path.join(ROOT, "avec-accroche", f"analysetacopro-{name}.mp4")
    offset = vo.dur(src) - vo.dur(os.path.join(ROOT, f"analysetacopro-{name}.mp4"))
    pl, warn = plan(name)
    shifted = [(st + offset, p, tempo) for st, p, tempo, _ in pl]
    b = beds(name)
    report = []
    for out_dir, out1080, kind, gain in VERSIONS:
        vo.build(name, plan=shifted, out_dir=out_dir, bed=b[kind], gain=gain)
        f = os.path.join(ROOT, out_dir, f"analysetacopro-{name}.mp4")
        g = os.path.join(ROOT, out1080, f"analysetacopro-{name}.mp4")
        os.makedirs(os.path.dirname(g), exist_ok=True)
        subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", f, "-vf", "scale=1080:1920:flags=lanczos", "-c:v", "libx264",
                        "-preset", "medium", "-crf", "20", "-profile:v", "high", "-level", "4.2", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                        "-ar", "44100", "-movflags", "+faststart", g], check=True)
        if kind == "sfx":
            report.append(f"décalage {lag_ms(name, [(st + offset, p, t, x) for st, p, t, x in pl], g)} ms")
    print(f"[{name}] " + " · ".join(report) + (" · ALERTES : " + " | ".join(warn) if warn else " · calage OK"), flush=True)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    names = args or list(edu_specs.SPECS)
    if "--list" in sys.argv:
        for n in names:
            print(f"## {n}")
            for t, v, _ in lines(n):
                print(f"  {t:5.2f}  {v[0]}")
    else:
        for n in names:
            run(n)
