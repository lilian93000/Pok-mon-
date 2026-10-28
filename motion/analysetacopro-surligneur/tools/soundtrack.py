"""Bande-son de « LE SURLIGNEUR » : study beat original (marimba, boom bap doux), 96 BPM, ré majeur.

0–2 s      marimba seule, « clic » du feutre qu'on débouche
2–20     beat doux ; à chaque ligne : défilement de page (whoosh léger) + crissement du surligneur + « ding » d'explication
20–24    « Bon à savoir » : carillon, le beat s'ouvre (nappe, charleston)
24–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 96
BAR = BEAT * 4
STEP = BAR / 16
SWG = STEP * 0.18
DUR = 30.0
T = [2.0, 6.5, 11.0, 15.5]
P = 20.0


def marimba(note, L=0.6):
    t = E.secs(L)
    f = E.midi(note)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 22)
    return s * np.minimum(t / 0.002, 1) * 0.4


def squeak(L=0.65):
    """Feutre surligneur qui glisse sur le papier."""
    t = E.secs(L)
    n = E.bandpass(E.noise(L), 2500, 7000)
    wob = 0.7 + 0.3 * np.sin(2 * np.pi * 31 * t)
    return n * wob * np.sin(np.pi * np.clip(t / L, 0, 1)) ** 0.6 * 0.35


def ding(n=86):
    t = E.secs(0.6)
    return (np.sin(2 * np.pi * E.midi(n) * t) + 0.3 * np.sin(2 * np.pi * E.midi(n + 12) * t)) * np.exp(-t * 6) * 0.3


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=140, low=48, drive=1.6)
SN = E.snare(L=0.22, tone=220, crack=0.6)
H = E.hat(0.03)
PROG = [[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 67]]  # Dmaj7 Bm7 Gmaj7 A7
RIFF = [0, 2, 1, 3, 2, 1, 0, 2]


def beat(t0, nbars, gain=1.0, hats=True):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = PROG[b % 4]
        sw = lambda s: tb + s * STEP + (SWG if s % 2 else 0)  # noqa: E731
        for s in (0, 7, 10):
            bus.add(K, sw(s), 0.75 * gain)
            kicks.append(sw(s))
        for s in (4, 12):
            bus.add(SN, sw(s), 0.45 * gain, rev=0.25)
        if hats:
            for s in range(0, 16, 2):
                bus.add(H, sw(s), 0.14 * gain, pan=0.25)
        for k, r in enumerate(RIFF):
            bus.add(marimba(ch[r] + 12), sw(k * 2), 0.45 * gain, pan=0.15 * (-1) ** k, rev=0.2, duck=True)
        bus.add(E.bass808(ch[0] - 24, STEP * 7, drive=1.5), sw(0), 0.5 * gain)
        bus.add(E.bass808(ch[0] - 24, STEP * 5, drive=1.5), sw(10), 0.45 * gain)


# 0–2 : marimba seule
for k, n in enumerate([74, 78, 81, 78, 76, 73]):
    bus.add(marimba(n), k * STEP * 2, 0.5, rev=0.3)
bus.add(E.pad([62, 66, 69], 2.0, cutoff=2200, attack=0.3), 0.0, 0.3, rev=0.4)

# 2–20 : les 4 lignes
beat(2.0, 7, gain=0.9)
bus.add(E.pad([62, 69, 74], P - 2.0, cutoff=1200, attack=1.0), 2.0, 0.18, rev=0.5)
for k, t in enumerate(T):
    if k:
        bus.add(E.whoosh(0.5), t - 0.65, 0.25)
    bus.add(squeak(), t, 0.8, pan=0.2)
    bus.add(ding(86 + [0, 2, 4, 7][k]), t + 0.5, 0.6, rev=0.3)

# 20–24 : bon à savoir
for k, n in enumerate((86, 90, 93, 98)):
    bus.add(ding(n), P + k * 0.08, 0.5, rev=0.4)
beat(P, 1, gain=1.0)
bus.add(E.kick(L=0.4, top=120, drive=1.6), P + BAR, 0.6)
bus.add(E.pad([62, 66, 69, 74], 4.0, cutoff=2600, attack=0.4), P, 0.3, rev=0.4)
bus.add(ding(93), P + 1.6, 0.5, rev=0.4)

# 24–30 : fin
bus.add(E.impact(1.2), 24.0, 0.35)
beat(24.0, 2, gain=0.85)
bus.add(E.pad([62, 69, 74, 78], DUR - 24.0 - 2 * BAR, cutoff=2600), 24.0 + 2 * BAR, 0.4, rev=0.5)

music = bus.render(kicks, duck_depth=0.3, fade_out=0.9)

SFX = [
    (0.1, "click-soft.mp3", -4, 0.0),
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
