"""Bande-son de « IDÉES REÇUES » : pop pizzicato originale, 112 BPM, sol majeur.

0–2 s      pizzicato seul, suspense léger (« vrai ou faux ? »)
2–20       à chaque post-it : arrachage (papier) + punaise (« tac »), puis le verdict :
           FAUX = buzzer grave · VRAI = carillon ; groove pop (kick, clap, pizz, basse)
20–24      « Ton score ? » : break, carillon
24–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 112
BAR = BEAT * 4
STEP = BAR / 16
DUR = 30.0
T = [2.0, 6.5, 11.0, 15.5]
VERD = ["f", "v", "f", "f"]
P = 20.0


def pizz(note, L=0.3):
    t = E.secs(L)
    f = E.midi(note)
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (9 + 5 * k)) / k for k in (1, 2, 3, 4))
    return s * np.minimum(t / 0.003, 1) * 0.35


def buzzer(L=0.5):
    t = E.secs(L)
    s = np.sign(np.sin(2 * np.pi * 110 * t)) + 0.6 * np.sign(np.sin(2 * np.pi * 116 * t))
    return E.lowpass(s, 1400) * np.minimum(t / 0.01, 1) * np.exp(-np.maximum(t - 0.35, 0) * 20) * 0.22


def chime():
    out = np.zeros(int(0.9 * E.SR))
    for k, n in enumerate((79, 83, 86, 91)):
        t = E.secs(0.6)
        s = np.sin(2 * np.pi * E.midi(n) * t) * np.exp(-t * 5) * 0.25
        i = int(k * 0.07 * E.SR)
        out[i:i + len(s)] += s[: len(out) - i]
    return out


def rip(L=0.35):
    t = E.secs(L)
    n = E.bandpass(E.noise(L), 1200, 7000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 60 * t)))
    return n * np.exp(-t * 6) * 0.5


def tac():
    t = E.secs(0.1)
    return (np.sin(2 * np.pi * 900 * t) * np.exp(-t * 80) + E.bandpass(E.noise(0.1), 2000, 6000) * np.exp(-t * 120)) * 0.5


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=170, low=50, drive=2.0)
CL = E.clap()
H = E.hat(0.03)
PROG = [[55, 59, 62], [52, 55, 59], [48, 52, 55], [50, 54, 57]]  # G Em C D
MEL = [0, 1, 2, 1, 0, 2, 1, 2]


def pop(t0, nbars, gain=1.0, drums=True):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = PROG[b % 4]
        if drums:
            for s in (0, 6, 8, 11):
                bus.add(K, tb + s * STEP, 0.8 * gain)
                kicks.append(tb + s * STEP)
            for s in (4, 12):
                bus.add(CL, tb + s * STEP, 0.45 * gain, rev=0.2)
            for s in range(0, 16, 2):
                bus.add(H, tb + s * STEP, 0.15 * gain, pan=0.25)
        for k, m in enumerate(MEL):
            bus.add(pizz(ch[m] + 12), tb + k * STEP * 2, 0.5 * gain, pan=0.2 * (-1) ** k, rev=0.15, duck=True)
        bus.add(E.bass808(ch[0] - 24, STEP * 6, drive=1.6), tb, 0.5 * gain)
        bus.add(E.bass808(ch[0] - 17, STEP * 4, drive=1.6), tb + 8 * STEP, 0.45 * gain)


# 0–2 : suspense
for k in range(7):
    bus.add(pizz([67, 71, 74, 71, 67, 71, 74][k]), k * STEP * 2, 0.5, rev=0.2)
bus.add(E.riser(0.8, 500, 7000, (300, 900)), 1.2, 0.25)

# 2–20 : les post-its
pop(2.0, 8)
for k, t in enumerate(T):
    if k:
        bus.add(rip(), t - 0.8, 0.7, pan=0.2)
        bus.add(E.whoosh(0.4, up=False), t - 0.55, 0.3)
        bus.add(tac(), t - 0.15, 0.8)
    bus.add(buzzer() if VERD[k] == "f" else chime(), t, 0.9, rev=0.2)
    bus.add(E.impact(0.6), t + 0.16, 0.3)

# 20–24 : ton score
bus.add(chime(), P, 0.7, rev=0.4)
pop(P, 1, gain=0.85, drums=False)
pop(P + BAR, 1, gain=0.9)

# 24–30 : fin
bus.add(E.impact(1.2), 24.0, 0.4)
pop(24.0, 2, gain=0.9)
bus.add(E.pad([55, 62, 67, 71], DUR - 24.0 - 2 * BAR, cutoff=2600), 24.0 + 2 * BAR, 0.4, rev=0.5)

music = bus.render(kicks, duck_depth=0.3, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
