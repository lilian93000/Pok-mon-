"""Bande-son de « L'AFFAIRE DE LA COPRO DES LILAS » (test du style Halftone Dossier) : voix de Guillaume ×1.12 + bruitages, sans musique.

Usage : python3 tools/audio.py <dossier_voix> <dossier_sfx_hyperframes> <sortie.wav> <minutage.json>
"""
import json
import subprocess
import sys

import numpy as np

SR = 48000
TEMPO = 1.12
STARTS = [0.35, 5.75, 10.9, 16.3, 20.75, 23.45]   # accroche, pièces 1-3, verdict, fin
WIPES = [5.3, 10.45, 15.85]                         # transitions en points
DUR = 27.3


def load(path, tempo=1.0):
    f = ["-af", f"atempo={tempo}"] if tempo != 1.0 else []
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, *f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"])
    return np.frombuffer(raw, np.float32).copy()


def env(n, a=0.002, r=0.05):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)


RNG = np.random.default_rng(7)


def stamp():
    """Tampon : boum qui descend + claquement."""
    n = int(0.5 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(40 + 110 * np.exp(-t / 0.05)) / SR) * env(n, 0.001, 0.16)
    click = RNG.standard_normal(n) * env(n, 0.0003, 0.012)
    return 0.95 * boom + 0.6 * click


def pop(f0=900):
    n = int(0.07 * SR); t = np.arange(n) / SR
    return 0.35 * np.sin(2 * np.pi * (f0 * t - 2500 * t * t)) * env(n, 0.002, 0.02)


def paper(sec=0.35):
    """Glissement de papier : bruit filtré qui monte puis retombe."""
    n = int(sec * SR); x = RNG.standard_normal(n)
    x = np.convolve(x, np.ones(6) / 6, mode="same") - np.convolve(x, np.ones(40) / 40, mode="same")
    t = np.arange(n) / SR
    return 0.5 * x * np.sin(np.pi * t / sec) ** 2


def shutter():
    a = RNG.standard_normal(int(0.012 * SR)) * env(int(0.012 * SR), 0.0002, 0.003)
    out = np.zeros(int(0.12 * SR)); out[: len(a)] += a; out[int(0.07 * SR): int(0.07 * SR) + len(a)] += 0.7 * a
    return 0.8 * out


def marker(sec=0.5):
    n = int(sec * SR); x = RNG.standard_normal(n)
    x = np.convolve(x, np.ones(3) / 3, mode="same")
    t = np.arange(n) / SR
    return 0.18 * x * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t)) * np.minimum(1, (sec - t) / 0.05)


def place(bus, sig, t, g=1.0):
    i = int(t * SR); j = min(len(bus), i + len(sig)); bus[i:j] += g * sig[: j - i]


def at(words, line, w):
    return next(x[2] for x in words if x[0] == line and x[1].startswith(w))


if __name__ == "__main__":
    vdir, sfx, out, tim = sys.argv[1:5]
    voix = json.load(open(f"{vdir}/voix.json"))
    bus = np.zeros(int(DUR * SR), np.float32)
    words = []
    for i, (st, v) in enumerate(zip(STARTS, voix)):
        place(bus, load(f"{vdir}/l{i}.mp3", TEMPO), st, 1.0)
        for w, a, b in v["words"]:
            words.append([i, w, round(st + a / TEMPO, 3), round(st + b / TEMPO, 3)])
    whoosh = load(f"{sfx}/whoosh-short.mp3")
    key = load(f"{sfx}/key-press.mp3")
    ev = {
        "shutter0": 0.0, "price": at(words, 0, "210"),
        "num1": at(words, 1, "26"), "circle2": at(words, 2, "2009"), "reveal3": at(words, 3, "Location"),
        "stamp": at(words, 4, "négocier"), "stamp2": at(words, 4, "fuir"), "endfile": STARTS[5] - 0.25,
    }
    place(bus, shutter(), 0.0, 0.9); place(bus, stamp(), 0.02, 0.5)
    for k in range(6):  # le n° de dossier se tape
        place(bus, key, 0.12 + k * 0.07, 0.25)
    place(bus, pop(700), ev["price"], 0.9)
    for w in WIPES:
        place(bus, whoosh, w - 0.05, 0.35); place(bus, paper(), w + 0.2, 0.6)
    for s in STARTS[1:4]:
        place(bus, stamp(), s - 0.2, 0.45)  # le grand numéro de pièce tombe
    place(bus, stamp(), ev["num1"], 0.55)
    place(bus, marker(), ev["circle2"], 0.9)
    place(bus, paper(0.3), ev["reveal3"] - 0.05, 0.8)
    place(bus, shutter(), STARTS[4] - 0.3, 0.6)
    place(bus, stamp(), ev["stamp"], 1.0); place(bus, load(f"{sfx}/impact-bass-2.mp3"), ev["stamp"], 0.5)
    place(bus, stamp(), ev["stamp2"], 0.8)
    place(bus, paper(0.4), ev["endfile"], 0.8); place(bus, stamp(), ev["endfile"] + 0.32, 0.5)
    # mastering doux vers −14 LUFS (pic vérifié ensuite)
    peak = float(np.abs(bus).max()); bus = np.tanh(1.6 * bus / peak) / np.tanh(1.6) * 0.89
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), "-c:a", "pcm_s16le", out], input=bus.tobytes(), check=True)
    json.dump({"starts": STARTS, "wipes": WIPES, "dur": DUR, "ev": ev, "words": words}, open(tim, "w"), ensure_ascii=False)
    print("ok", out, {k: round(v, 2) for k, v in ev.items()})
