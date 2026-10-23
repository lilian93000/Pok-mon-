"""Bande-son de « LA RECETTE RATÉE » : swing jazz d'émission de cuisine, 120 BPM, si bémol majeur.

0–8,5 s     swing (contrebasse qui marche, ride, balais, piano) ; « plop » à chaque ingrédient
7–8,5       le fouet
8,5–11      le four : tic-tac du minuteur, le swing s'emballe, « DING » à 11 s
11,4–16,6   cramé : trombone triste (wah-wah-wah-waaah), fumée, une alerte par ligne
16,6–24     la recette du chef : swing en fanfare, cuivres, carillon
24–30       fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT, BAR, DUR = 0.5, 2.0, 30.0
SW = BEAT * 2 / 3  # croche swing
I = [1.0, 2.5, 4.0, 5.5]
C = 11.4
R = 16.6


def upright(note, L=0.45):
    t = E.secs(L)
    f = E.midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 8)
    return s * np.minimum(t / 0.006, 1) * np.exp(-t * 4.5) * 0.6


def ride(L=0.35):
    t = E.secs(L)
    return E.highpass(E.noise(L), 5000) * (0.6 + 0.4 * np.sin(2 * np.pi * 7400 * t)) * np.exp(-t * 9) * 0.22


def brush(L=0.2):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 1500, 7000) * np.sin(np.pi * t / L) * 0.18


def plop(f0=500):
    t = E.secs(0.2)
    f = f0 * (1 + 2 * np.exp(-t * 40))
    return np.sin(np.cumsum(f) / E.SR * 2 * np.pi) * np.exp(-t * 18) * 0.5


def whisk(L=1.4):
    t = E.secs(L)
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 9 * t) ** 2
    return E.bandpass(E.noise(L), 2500, 9000) * am * np.minimum(t / 0.1, 1) * np.minimum((L - t) / 0.1, 1) * 0.35


def tick():
    t = E.secs(0.05)
    return np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 120) * 0.25


def bell(note, L=1.6):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4)) * np.exp(-t * 2.2) * 0.35


def trombone(note, L, bend=0.0):
    t = E.secs(L)
    f = E.midi(note) * (1 - bend * (t / L))
    wah = 0.5 + 0.5 * np.sin(2 * np.pi * 5 * t)
    s = E.saw(1, np.cumsum(f) / E.SR)
    s = E.lowpass(s, 900) * (1 - wah * 0.5) + E.lowpass(s, 2400) * wah * 0.5
    return np.tanh(s * 1.6) * np.minimum(t / 0.03, 1) * np.minimum((L - t) / 0.05, 1) * 0.5


def brass(notes, L=0.35):
    t = E.secs(L)
    s = sum(E.saw(E.midi(n) * (1 + d * 0.004), t) for n in notes for d in (-1, 1))
    return np.tanh(E.lowpass(s, 3000) * np.exp(-t * 5) / len(notes) * 2) * 0.6


bus = E.Bus(DUR)
kicks = []
K = E.kick(L=0.3, top=120, low=55, punch=26, drive=1.2)
PROG = [[58, 62, 65, 69], [55, 58, 62, 65], [60, 63, 67, 70], [53, 57, 60, 63]]  # Bb6 Gm7 Cm7 F7
WALK = [[46, 50, 53, 55], [43, 46, 50, 51], [48, 51, 55, 52], [41, 45, 48, 44]]


def swing(t0, nbars, hot=False):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = PROG[b % 4]
        for q, n in enumerate(WALK[b % 4]):
            bus.add(upright(n - 12), tb + q * BEAT, 0.8)
            bus.add(ride(), tb + q * BEAT, 0.8, pan=0.3)
            if q % 2:
                bus.add(ride(), tb + q * BEAT + SW, 0.5, pan=0.3)
                bus.add(brush(), tb + q * BEAT, 0.9, pan=-0.2)
        bus.add(K, tb, 0.5)
        kicks.append(tb)
        for k, n in enumerate(ch):
            bus.add(E.ep(n + 12, 0.5), tb + SW + k * 0.01, 0.3, pan=(k - 1.5) * 0.2, rev=0.25, duck=True)
            bus.add(E.ep(n + 12, 0.4), tb + 2 * BEAT + SW + k * 0.01, 0.25, pan=(k - 1.5) * 0.2, rev=0.25, duck=True)
        if hot:
            bus.add(brass([n + 12 for n in ch[:3]]), tb + 3 * BEAT + SW, 0.6, rev=0.3)


# 0–11 : préparation + four
swing(0.0, 4)
for k, t in enumerate(I):
    bus.add(plop(450 + 80 * k), t + 0.3, 0.9)
bus.add(whisk(), 7.0, 0.9)
swing(8.0, 1)
for k in range(10):
    bus.add(tick(), 8.6 + k * 0.25, 0.9)
swing(10.0, 1, hot=True)
bus.add(bell(89), 11.0, 0.9, rev=0.4)

# 11,4–16,6 : cramé — trombone triste
bus.add(E.impact(1.2), C, 0.5)
for k, (n, L, bend) in enumerate([(58, 0.45, 0), (57, 0.45, 0), (56, 0.45, 0), (55, 1.6, 0.04)]):
    bus.add(trombone(n - 12, L, bend), C + 0.2 + k * 0.5, 0.9, rev=0.3)
for k in range(3):
    bus.add(E.kick(L=0.4, top=110, drive=2.0), C + 0.7 + k * 1.2, 0.6)
    bus.add(E.bass808(34, 0.4, drive=1.6), C + 0.7 + k * 1.2, 0.4)
bus.add(E.pad([46, 49, 53], 2.4, cutoff=700), C + 2.4, 0.35, rev=0.5)
bus.add(E.riser(1.0, 400, 8000, (300, 1200)), R - 1.0, 0.35)

# 16,6–24 : la recette du chef
bus.add(brass([70, 74, 77, 82], 0.6), R, 0.8, rev=0.3)
swing(R, 3, hot=True)
swing(R + 3 * BAR, 1)
for k in range(3):
    bus.add(plop(700 + 100 * k), R + 0.6 + k * BEAT, 0.8)
bus.add(bell(82), R + 2.2, 0.5, rev=0.4)
for k, n in enumerate((82, 86, 89, 94)):
    bus.add(bell(n, 1.2), R + 3.0 + k * 0.08, 0.4, rev=0.5)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.4)
swing(24.0, 2, hot=True)
bus.add(brass([70, 74, 77, 81, 84], 1.2), 28.0, 0.8, rev=0.5)
bus.add(upright(34, 1.2), 28.0, 0.9)

music = bus.render(kicks, duck_depth=0.25, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
