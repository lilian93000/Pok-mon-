"""Bande-son d'une vidéo « format v2 » : voix de Guillaume (minutage mot à mot) + bruitages calés sur les mots, sans musique.

Usage : python3 tools/v2/mix.py <nom> <dossier_voix> <dossier_sfx_hyperframes> <projet>
Écrit <projet>/assets/audio/soundtrack.wav (−14 LUFS) et <projet>/tools/minutage.json.
"""
import json
import os
import re
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from specs import SPECS  # noqa: E402

SR = 48000
TEMPO = 1.08   # voix légèrement accélérée : rythme TikTok sans déformer
FIRST = 0.3    # la voix démarre sur la 1re image
GAP = 0.25     # respiration entre deux phrases
TAIL = 0.9     # la fin reste à l'écran après le dernier mot


def load(path, tempo=1.0):
    f = ["-af", f"atempo={tempo}"] if tempo != 1.0 else []
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, *f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"])
    return np.frombuffer(raw, np.float32).astype(np.float64)


def env(n, a=0.002, r=0.05):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)


RNG = np.random.default_rng(11)


def ticks(sec=0.5, n=9):
    """Compteur qui défile : petits tics de plus en plus rapprochés."""
    out = np.zeros(int(sec * SR) + 2000)
    for k in range(n):
        t = sec * (1 - (1 - k / n) ** 1.6)
        m = int(0.012 * SR); i = int(t * SR)
        tt = np.arange(m) / SR
        out[i:i + m] += np.sin(2 * np.pi * (2400 + 120 * k) * tt) * env(m, 0.0005, 0.004)
    return 0.4 * out


def stamp():
    n = int(0.45 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(45 + 110 * np.exp(-t / 0.05)) / SR) * env(n, 0.001, 0.14)
    return 0.9 * boom + 0.5 * RNG.standard_normal(n) * env(n, 0.0003, 0.01)


def norm(w):
    return re.sub(r"[^\wÀ-ÿ%-]", "", w.lower())


def find(words, line, anchor, after=0.0):
    a = norm(anchor)
    for x in words:
        if x[0] == line and x[2] >= after and norm(x[1]).startswith(a):
            return x[2]
    raise SystemExit(f"mot d'ancrage introuvable : {anchor!r} (phrase {line})")


def place(bus, sig, t, g=1.0):
    i = max(0, int(t * SR)); j = min(len(bus), i + len(sig)); bus[i:j] += g * sig[: j - i]


if __name__ == "__main__":
    name, vdir, sfx, proj = sys.argv[1:5]
    spec = SPECS[name]
    voix = json.load(open(f"{vdir}/voix.json"))
    assert [v["text"] for v in voix] == spec["lines"], "la voix ne correspond pas aux phrases de la fiche"
    starts, t = [], FIRST
    for v in voix:
        starts.append(round(t, 3)); t += v["dur"] / TEMPO + GAP
    dur = round(t - GAP + TAIL, 2)
    words = []
    bus = np.zeros(int(dur * SR) + SR)
    for i, (st, v) in enumerate(zip(starts, voix)):
        place(bus, load(f"{vdir}/l{i}.mp3", TEMPO), st)
        for w, a, b in v["words"]:
            words.append([i, w, round(st + a / TEMPO, 3), round(st + b / TEMPO, 3)])
    S = lambda f: load(os.path.join(sfx, f))  # noqa: E731
    whoosh, pop, click, impact, impact2, error, ping, sparkle = (S(f) for f in ("whoosh-short.mp3", "pop.mp3", "click-soft.mp3", "impact-bass-1.mp3", "impact-bass-2.mp3", "error.mp3", "ping.mp3", "sparkle.mp3"))
    scenes = []
    for k, sc in enumerate(spec["scenes"]):
        t0 = 0.0 if k == 0 else round(starts[k] - 0.1, 3)
        ev = {"t0": t0}
        for key in ("at", "note_at", "chip_at", "sub_at"):
            if key in sc:
                ev[key] = find(words, k, sc[key])
        scenes.append(ev)
        if k:
            place(bus, whoosh, t0 - 0.12, 0.3)
        ty = sc["type"]
        if ty == "hook":
            place(bus, impact, 0.0, 0.55)
            if "count" in sc:
                place(bus, ticks(0.8, 14), 0.05, 0.8)
        elif ty == "stat":
            place(bus, ticks(0.45, 8), ev["at"] - 0.05, 0.8); place(bus, pop, ev["at"] + 0.4, 0.6)
            place(bus, click, ev["note_at"], 0.4)
        elif ty == "rule":
            place(bus, stamp(), ev["at"], 0.6); place(bus, click, ev["chip_at"], 0.45)
        elif ty == "punch":
            place(bus, impact2, ev["at"], 0.7); place(bus, sparkle, ev["at"] + 0.1, 0.45)
        elif ty == "listing":
            place(bus, pop, 0.05, 0.6)
        elif ty == "flag":
            place(bus, error, ev["at"], 0.45); place(bus, stamp(), ev["at"] + 0.02, 0.5)
        elif ty == "verdict":
            place(bus, ping, ev["at"], 0.6); place(bus, sparkle, ev["at"] + 0.15, 0.4)
        elif ty == "end":
            place(bus, pop, t0 + 0.15, 0.5)
    bus = bus[: int(dur * SR)]
    bus = np.tanh(1.5 * bus / np.abs(bus).max()) / np.tanh(1.5) * 0.89
    out = os.path.join(proj, "assets", "audio", "soundtrack.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                    "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", out], input=bus.astype(np.float32).tobytes(), check=True)
    json.dump({"dur": dur, "starts": starts, "scenes": scenes, "words": words}, open(os.path.join(proj, "tools", "minutage.json"), "w"), ensure_ascii=False)
    print("ok", name, dur, "s", [round(s["t0"], 2) for s in scenes])
