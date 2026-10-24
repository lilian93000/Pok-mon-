"""Bande-son de « LE DÉTECTEUR DE MENSONGES » : thriller originale, 100 BPM, do mineur → mi bémol majeur.

0–19,4 s   interrogatoire : basse pulsée, horloge, cœur ; l'aiguille gratte le papier en continu
           chaque mensonge (3,6 / 8,4 / 13,2) = buzzer + coup + cordes stridentes
16,8–19,4  4e réponse : la machine s'affole (alarme, glitch, montée), « MACHINE HS » à 18 s
19,4–24    le rapport : beat clair en majeur, clics
24–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT, BAR, DUR = 0.6, 2.4, 30.0
STEP = BAR / 16
Q = [1.2, 6.0, 10.8, 15.6]
LIE = [3.6, 8.4, 13.2]
R = 19.4


def needle(L):
    """Le stylet qui gratte le papier, plus fort quand l'aiguille s'agite."""
    t = E.secs(L)
    return E.bandpass(E.noise(L), 2500, 8000) * (0.15 + 0.1 * np.sin(2 * np.pi * 3 * t) ** 2) * 0.25


def buzzer(L=0.5):
    t = E.secs(L)
    s = np.sign(np.sin(2 * np.pi * 110 * t)) + 0.6 * np.sign(np.sin(2 * np.pi * 116 * t))
    return E.lowpass(s, 2500) * np.minimum((L - t) / 0.03, 1) * 0.22


def strings(notes, L, cutoff=5000):
    t = E.secs(L)
    s = sum(E.saw(E.midi(n) * (1 + d * 0.005), t) for n in notes for d in (-1, 0, 1))
    trem = 0.7 + 0.3 * np.sin(2 * np.pi * 12 * t)
    return E.lowpass(s, cutoff) * trem * np.minimum(t / 0.02, 1) * np.exp(-t * 1.6) / (3 * len(notes)) * 1.2


def tick():
    t = E.secs(0.04)
    return E.bandpass(E.noise(0.04), 3000, 9000) * np.exp(-t * 150) * 0.4


def heart():
    t = E.secs(0.3)
    return np.sin(2 * np.pi * (50 + 40 * np.exp(-t * 30)) * t) * np.exp(-t * 14) * 0.9


def click():
    t = E.secs(0.05)
    return E.bandpass(E.noise(0.05), 2000, 8000) * np.exp(-t * 120) * 0.6


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=170, drive=2.2)

# 0–19,4 : interrogatoire
bus.add(needle(R), 0.0, 1.0, pan=0.15)
for b in range(8):
    tb = b * BAR
    root = [36, 36, 39, 35][b % 4]
    for s in range(16):
        if s % 2 == 0:
            bus.add(E.bass808(root + (12 if s % 8 == 6 else 0), STEP * 1.6, drive=1.8), tb + s * STEP, 0.45)
    for q in range(4):
        bus.add(tick(), tb + q * BEAT, 0.8, pan=-0.3)
    for q in (0, 2):
        bus.add(heart(), tb + q * BEAT, 0.7)
        bus.add(heart(), tb + q * BEAT + 0.18, 0.5)
    bus.add(E.pad([48, 51, 55], BAR, cutoff=900, attack=0.3), tb, 0.3, rev=0.5, duck=True)
for t in Q:
    bus.add(strings([72, 75], 0.8, 3000), t, 0.35, rev=0.4)
for t in LIE:
    bus.add(buzzer(), t, 1.0)
    bus.add(E.impact(1.2), t + 0.2, 0.8)
    bus.add(K, t + 0.2, 1.0)
    kicks.append(t + 0.2)
    bus.add(strings([79, 80, 84], 1.0, 7000), t + 0.2, 0.6, rev=0.4)
    bus.add(needle(1.2) * 3, t, 0.9)
# la machine s'affole
for k in range(10):
    bus.add(buzzer(0.12), 16.8 + k * 0.12, 0.6 + 0.04 * k)
bus.add(E.riser(1.6, 400, 12000, (300, 2400)), 16.8, 0.6)
bus.add(needle(2.6) * 4, 16.8, 1.0)
bus.add(E.impact(1.6), 18.0, 0.9)
bus.add(E.kick(L=0.6, top=120, drive=2.8), 18.0, 0.9)
bus.add(strings([60, 66, 72, 78], 1.3, 8000), 18.0, 0.6, rev=0.5)

# 19,4–24 : le rapport (majeur)
bus.add(E.impact(1.0), R, 0.5)
for b in range(2):
    tb = R + b * BAR
    ch = [[63, 67, 70, 74], [60, 63, 67, 70]][b % 2]
    for k, n in enumerate(ch):
        bus.add(E.ep(n, BAR * 0.9), tb + k * 0.012, 0.4, pan=(k - 1.5) * 0.15, rev=0.3, duck=True)
    for s in (0, 7, 10):
        bus.add(K, tb + s * STEP, 0.8)
        kicks.append(tb + s * STEP)
    for s in (4, 12):
        bus.add(E.clap(), tb + s * STEP, 0.5, rev=0.2)
    for s in range(0, 16, 2):
        bus.add(E.hat(0.04), tb + s * STEP, 0.2, pan=0.2)
    bus.add(E.bass808(ch[0] - 24, BAR * 0.45, drive=1.6), tb, 0.55)
for k in range(4):
    bus.add(click(), R + 0.6 + k * BEAT, 1.0)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.5)
for b in range(2):
    tb = 24.0 + b * BAR
    for s in (0, 7, 10):
        bus.add(K, tb + s * STEP, 0.8)
        kicks.append(tb + s * STEP)
    for k, n in enumerate([63, 67, 70, 74]):
        bus.add(E.ep(n, BAR * 0.9), tb + k * 0.012, 0.4, rev=0.3, duck=True)
bus.add(E.pad([51, 58, 63, 67, 70], DUR - 28.8, cutoff=2400), 28.8, 0.45, rev=0.5)

music = bus.render(kicks, duck_depth=0.3, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
    (17.2, "glitch-1.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
