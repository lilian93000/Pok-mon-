"""Bande-son de « NOTICE DE MONTAGE » : tech-house ludique originale, 124 BPM, ré mineur → fa majeur.

0–2,4 s     couverture : marimba seule
2,4–12,1    étapes 1 à 4 : le groove démarre ; page tournée, « ding » à chaque validation
12,1–14,5   pièces en trop : la batterie s'amincit, pièces qui tombent, « boing »
14,5–17,9   effondrement : fracas, la musique s'écroule (arrêt bande)
17,9–20,3   étape 0 : montée lumineuse
20,3–24     montage réussi : drop en majeur
24–30       fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 124
BAR = BEAT * 4
STEP = BAR / 16
SEG = BAR * 1.25
DUR = 30.0
T = [k * SEG for k in range(7)]
C = T[6]
Z = C + SEG + BEAT * 2
W = Z + SEG


def marimba(note, L=0.5):
    t = E.secs(L)
    f = E.midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 3.9 * t) * np.exp(-t * 30)
    return s * np.exp(-t * 9) * 0.4


def wood(L=0.08):
    t = E.secs(L)
    return np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 60) * 0.4


def page_turn(L=0.35):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 1500, 8000) * np.sin(np.pi * t / L) ** 2 * 0.5


def ding(note=88):
    t = E.secs(0.9)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2 * t)) * np.exp(-t * 5) * 0.25


def thud(f0=140):
    t = E.secs(0.3)
    return np.tanh(E.phase_sine(f0 * 0.5 + f0 * np.exp(-t * 30)) * np.exp(-t * 16) * 2) * 0.7


def boing(L=0.6):
    t = E.secs(L)
    f = 220 * (1 + 0.5 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)) * (1 + t)
    return np.sin(np.cumsum(f) / E.SR * 2 * np.pi) * np.exp(-t * 5) * 0.4


def crash(L=1.8):
    t = E.secs(L)
    n = E.noise(L)
    debris = (np.abs(E.noise(L)) > 2.6) * n
    return np.tanh((E.lowpass(n, 1200) * np.exp(-t * 3) * 1.2 + E.bandpass(debris, 800, 6000) * np.exp(-t * 2) * 1.5) * 1.5) * 0.7


def scribble(L):
    t = E.secs(L)
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 14 * t) ** 2
    return E.bandpass(E.noise(L), 2000, 8000) * am * np.sin(np.pi * t / L) * 0.4


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=160, drive=2.0)
C_ = E.clap()
H = E.hat(0.05)
HO = E.hat(open_=True)
MIN = [[62, 65, 69], [58, 62, 65], [60, 64, 67], [57, 61, 64]]  # Dm Bb C A
MAJ = [[65, 69, 72], [62, 65, 69], [58, 62, 65], [60, 64, 67]]  # F Dm Bb C
RIFF = [0, None, 7, None, 12, None, 7, 10, None, 7, None, 12, 10, None, 7, None]


def house(t0, t1, prog, full=True, riff=True):
    b = 0
    while t0 + b * BAR < t1 - 1e-6:
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        for q in range(4):
            if tb + q * BEAT >= t1:
                break
            bus.add(K, tb + q * BEAT, 0.9)
            kicks.append(tb + q * BEAT)
            if full:
                bus.add(HO, tb + q * BEAT + BEAT / 2, 0.25, pan=0.25)
        for s in range(16):
            ts = tb + s * STEP
            if ts >= t1:
                break
            if full and s in (4, 12):
                bus.add(C_, ts, 0.55, rev=0.2)
            if s % 2:
                bus.add(H, ts, 0.14, pan=-0.2)
            if riff and RIFF[s] is not None:
                bus.add(marimba(ch[0] + RIFF[s], 0.3), ts, 0.55, pan=0.15, rev=0.2, duck=True)
            if s in (3, 11):
                bus.add(wood(), ts, 0.4, pan=-0.3)
        root = ch[0] - 24
        for s in (2, 6, 10, 14):
            if tb + s * STEP < t1:
                bus.add(E.bass808(root, STEP * 1.6, drive=1.8), tb + s * STEP, 0.6)
        b += 1


# 0–2,4 : couverture
for k, n in enumerate([62, 69, 74, 72, 69, 65, 69, 74]):
    bus.add(marimba(n), k * BEAT / 2 + 0.05, 0.6, pan=(k % 2 - 0.5) * 0.4, rev=0.3)
bus.add(E.pad([50, 57, 62, 65], T[1], cutoff=1200, attack=0.3), 0.0, 0.35, rev=0.3)
bus.add(E.riser(0.8, 400, 6000, (300, 900)), T[1] - 0.8, 0.3)

# 2,4–12,1 : étapes 1 à 4
house(T[1], T[5], MIN)
for k in range(1, 5):
    bus.add(page_turn(), T[k] - 0.3, 0.8)
    bus.add(ding(86 + 2 * k), T[k] + BAR * 0.75, 0.7, rev=0.3)
bus.add(scribble(0.2), T[2] + 0.4, 0.6)
bus.add(thud(220), T[2] + 0.7, 0.5)
bus.add(scribble(0.5), T[3] + 0.35, 0.7)
bus.add(E.whoosh(0.8, up=True), T[4] + 0.3, 0.3)

# 12,1–14,5 : pièces en trop (batterie amincie)
bus.add(page_turn(), T[5] - 0.3, 0.8)
house(T[5], C, MIN[:1], full=False, riff=False)
for k in range(3):
    bus.add(thud(180 - 20 * k), T[5] + 0.2 + k * BEAT + 0.15, 0.9)
bus.add(boing(), T[5] + 0.2 + BEAT * 3, 0.8)
bus.add(E.pad([50, 56, 62], SEG, cutoff=900), T[5], 0.4, rev=0.4)

# 14,5–17,9 : effondrement
bus.add(page_turn(), C - 0.3, 0.8)
house(C, C + 0.95, MIN[3:])
bus.add(scribble(0.3), C + 0.35, 0.5)
bus.add(crash(), C + 0.6, 1.0)
bus.add(E.impact(2.0), C + 0.95, 0.9)
for k in range(4):
    bus.add(thud(260 - 30 * k), C + 1.0 + k * 0.08, 0.6)
bus.add(E.pad([50, 53, 56, 62], Z - C - 1.0, cutoff=700, attack=0.4), C + 1.0, 0.45, rev=0.5)
bus.add(E.bass808(38, 1.5, glide_from=50, drive=2.0, glide=0.3), C + 1.1, 0.5)
bus.add(E.riser(1.2, 300, 10000, (200, 1600)), Z - 1.2, 0.45)

# 17,9–20,3 : étape 0
bus.add(page_turn(), Z - 0.3, 0.8)
bus.add(E.impact(1.4), Z, 0.5)
for k, n in enumerate([65, 69, 72, 77, 81, 84, 89, 93]):
    bus.add(marimba(n, 0.6), Z + 0.2 + k * BEAT / 2, 0.5, pan=(k % 2 - 0.5) * 0.5, rev=0.4)
bus.add(E.pad([53, 60, 65, 69], SEG, cutoff=2500, attack=0.4), Z, 0.4, rev=0.4)
house(Z + BAR * 0.5, W, MAJ[:1], full=False, riff=False)
bus.add(E.whoosh(0.6), Z + 0.2 + BEAT * 1.5, 0.5)

# 20,3–24 : montage réussi
bus.add(page_turn(), W - 0.3, 0.8)
house(W, 24.0, MAJ)
for k in range(4):
    bus.add(ding(84 + [0, 4, 7, 12][k]), W + 0.2 + k * BEAT / 2, 0.5, rev=0.3)
bus.add(ding(96), W + BAR * 0.75, 0.6, rev=0.4)

# 24–30 : fin
bus.add(E.impact(1.6), 24.0, 0.5)
house(24.0, 24.0 + 2 * BAR, MAJ[:1] + MAJ[3:])
for k, n in enumerate([65, 69, 72, 77]):
    bus.add(marimba(n, 1.2), 24.0 + 2 * BAR + k * 0.06, 0.6, rev=0.5)
bus.add(E.pad([53, 60, 65, 69, 72], DUR - 24.0 - 2 * BAR, cutoff=2500), 24.0 + 2 * BAR, 0.4, rev=0.5)

music = bus.render(kicks, duck_depth=0.4, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
