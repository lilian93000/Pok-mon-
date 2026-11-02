"""Bande-son de « LES BRUITS EN VISITE » (format v2) : voix de Guillaume ×1.12 + bruitages synthétisés, sans musique.

Usage : python3 tools/audio.py <dossier_voix> <dossier_sfx_hyperframes> <sortie.wav> <minutage.json>
<dossier_voix> contient l0.mp3… et voix.json (minutage mot à mot ElevenLabs).
"""
import json
import subprocess
import sys

import numpy as np

SR = 48000
TEMPO = 1.12
# début de chaque phrase (s) : accroche, 3 bruits, la révélation, l'appel à s'abonner
STARTS = [0.30, 2.80, 7.75, 12.65, 17.75, 21.45]
DUR = 24.2


def load(path, tempo=1.0):
    f = ["-af", f"atempo={tempo}"] if tempo != 1.0 else []
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, *f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"])
    return np.frombuffer(raw, np.float32).copy()


def env(n, a=0.002, r=0.05):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)


def knock():
    """Coup de bélier : choc grave + claquement métallique."""
    n = int(0.35 * SR); t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * (70 + 60 * np.exp(-t / 0.02)) * t) * env(n, 0.001, 0.07)
    rng = np.random.default_rng(3)
    ping = sum(np.sin(2 * np.pi * f * t) * env(n, 0.0005, 0.03 + i * 0.01) for i, f in enumerate([1830, 2710, 3960]))
    click = rng.standard_normal(n) * env(n, 0.0002, 0.006)
    return 0.9 * thump + 0.25 * ping + 0.5 * click


def whistle(sec=0.9):
    n = int(sec * SR); t = np.arange(n) / SR
    f = 2350 + 40 * np.sin(2 * np.pi * 5.5 * t)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.random.default_rng(5).standard_normal(n) * 0.2
    e = np.minimum(1, t / 0.08) * np.minimum(1, (sec - t) / 0.15)
    return 0.32 * s * e


def gurgle(sec=1.0):
    n = int(sec * SR); out = np.zeros(n); rng = np.random.default_rng(9)
    for k in range(14):
        st = int((k * 0.065 + rng.uniform(0, 0.03)) * SR); m = int(0.06 * SR)
        if st + m > n: break
        t = np.arange(m) / SR; f0 = rng.uniform(250, 420)
        out[st:st + m] += np.sin(2 * np.pi * (f0 * t + rng.uniform(1500, 3500) * t * t)) * env(m, 0.003, 0.025)
    return 0.55 * out


def place(bus, sig, t, g=1.0):
    i = int(t * SR); j = min(len(bus), i + len(sig)); bus[i:j] += g * sig[: j - i]


if __name__ == "__main__":
    vdir, sfx, out, tim = sys.argv[1:5]
    voix = json.load(open(f"{vdir}/voix.json"))
    bus = np.zeros(int(DUR * SR), np.float32)
    words = []
    for i, (st, v) in enumerate(zip(STARTS, voix)):
        place(bus, load(f"{vdir}/l{i}.mp3", TEMPO), st, 1.0)
        for w, a, b in v["words"]:
            words.append([i, w, round(st + a / TEMPO, 3), round(st + b / TEMPO, 3)])
    # bruitages
    place(bus, knock(), 0.0, 0.9); place(bus, knock(), 0.16, 0.7)
    place(bus, knock(), 2.72, 0.6)
    place(bus, whistle(), 7.25, 0.7)
    place(bus, gurgle(), 12.1, 0.8)
    place(bus, load(f"{sfx}/whoosh-short.mp3"), 2.62, 0.35)
    place(bus, load(f"{sfx}/whoosh-short.mp3"), 7.15, 0.35)
    place(bus, load(f"{sfx}/whoosh-short.mp3"), 12.0, 0.35)
    place(bus, load(f"{sfx}/impact-bass-1.mp3"), 17.55, 0.55)
    place(bus, load(f"{sfx}/pop.mp3"), 21.35, 0.4)
    for w in words:  # le verdict tombe pile sur le mot
        if w[1] in ("Coup", "Bouches", "Évacuation"):
            place(bus, load(f"{sfx}/click-soft.mp3"), w[2], 0.35)
    bus /= max(1.0, float(np.abs(bus).max()) / 0.89)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "pcm_s16le", out], input=bus.tobytes(), check=True)
    json.dump({"starts": STARTS, "dur": DUR, "words": words}, open(tim, "w"), ensure_ascii=False)
    print("ok", out, len(words), "mots")
