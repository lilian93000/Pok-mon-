"""Bande-son de « LA TOUR EN BOIS » : techno minimale originale, percussions bois, 124 BPM, mi mineur → sol majeur.

0–2,4 s    la tour se monte : un « toc » de bois par étage, qui monte
2,4–13,4   techno minimale tendue ; chaque bloc retiré = frottement de bois + grincement ; la tour penche (craquements)
13,4–15,6  effondrement : cascade de chocs de bois, impact
15,6–17,4  silence lourd, nappe
17,4–20,8  on reconstruit : 12 « tocs » montants, puis 12 « ding » de validation
20,8–24    TIENT DEBOUT : drop house en majeur
24–30      fin
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
DUR = 30.0
T = [3.0, 5.6, 8.2, 10.8]
C = 13.4
P = 17.4
OK = 20.8


def wood(note=79, L=0.18):
    """« Toc » de bloc de bois (résonance courte)."""
    t = E.secs(L)
    f = E.midi(note)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 38) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 60)
    click = E.bandpass(E.noise(L), 1500, 6000) * np.exp(-t * 200) * 0.6
    return (s + click) * 0.5


def scrape(L=0.6):
    t = E.secs(L)
    n = E.sweep_filter(E.noise(L), 900, 2500, 16)
    grain = 0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 38 * t))
    return n * grain * np.sin(np.pi * np.clip(t / L, 0, 1)) * 0.55


def creak(L=0.7, f0=110):
    t = E.secs(L)
    f = f0 * (1 + 0.25 * np.sin(2 * np.pi * 1.3 * t))
    pulses = np.sign(np.sin(np.cumsum(2 * np.pi * f / E.SR))) * (np.sin(2 * np.pi * 23 * t) > 0.2)
    return E.bandpass(pulses.astype(float), 300, 2500) * np.sin(np.pi * np.clip(t / L, 0, 1)) * 0.25


def ding(n=91):
    t = E.secs(0.3)
    return np.sin(2 * np.pi * E.midi(n) * t) * np.exp(-t * 14) * 0.3


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=160, low=45, drive=2.0)
H = E.hat(0.04)
HO = E.hat(0.18, open_=True)
CL = E.clap()
EM = [40, 40, 43, 38]  # mi, mi, sol, ré
MAJ = [[55, 59, 62, 66], [52, 55, 59, 62], [48, 52, 55, 59], [50, 54, 57, 60]]  # Gmaj7 Em7 Cmaj7 D7


def minimal(t0, nbars, roots, gain=1.0, ohat=True):
    for b in range(nbars):
        tb = t0 + b * BAR
        for q in range(4):
            bus.add(K, tb + q * BEAT, 0.85 * gain)
            kicks.append(tb + q * BEAT)
            if ohat:
                bus.add(HO, tb + q * BEAT + BEAT / 2, 0.16 * gain, pan=0.2)
        for s in (3, 7, 11, 14):
            bus.add(wood(84 if s % 2 else 79), tb + s * STEP, 0.4 * gain, pan=0.3 * (-1) ** s, rev=0.25)
        for s in range(16):
            bus.add(H, tb + s * STEP, 0.1 * gain, pan=-0.2)
        r = roots[b % len(roots)]
        for s in (2, 6, 10, 13):
            bus.add(E.bass808(r - 12, STEP * 1.6, drive=1.8), tb + s * STEP, 0.5 * gain)


# 0–2,4 : la tour se monte (12 étages)
for i in range(12):
    bus.add(wood(64 + i * 2, 0.2), i * 0.06 + 0.15, 0.6, pan=0.1 * (-1) ** i, rev=0.2)
bus.add(E.pad([52, 59, 64], 2.4, cutoff=1500, attack=0.4), 0.0, 0.3, rev=0.5)

# 2,4–13,4 : tension
minimal(2.4, 5, EM)
bus.add(E.pad([40, 47, 52], C - 2.4, cutoff=500, attack=1.5), 2.4, 0.3, rev=0.5)
bus.add(E.riser(C - 10.8, 200, 3000, (60, 220)), 10.8, 0.3)
for k, t in enumerate(T):
    bus.add(wood(72, 0.15), t - 0.45, 0.6)
    bus.add(scrape(), t - 0.1, 0.8, pan=0.2)
    bus.add(creak(0.8, 100 + 20 * k), t + 0.3, 0.8, rev=0.3)
    bus.add(E.impact(0.6), t + 0.25, 0.25)

# 13,4–15,6 : effondrement
for i in range(18):
    bus.add(wood(55 + int(np.floor(i * 7.3 % 20)), 0.22), C + 0.05 + i * 0.07 + (i % 3) * 0.02, 0.7, pan=0.6 * np.sin(i * 1.7), rev=0.35)
bus.add(E.impact(2.2), C + 0.76, 0.9)
bus.add(creak(1.0, 80), C - 0.3, 0.9)

# 15,6–17,4 : silence lourd
bus.add(E.pad([40, 43, 47], P - 15.6, cutoff=800, attack=0.3), 15.6, 0.3, rev=0.6)

# 17,4–20,8 : on reconstruit, on contrôle
bus.add(E.impact(1.0), P, 0.4)
for i in range(12):
    bus.add(wood(60 + i * 2, 0.2), P + 0.37 + i * 0.1, 0.7, rev=0.2)
    bus.add(ding(79 + [0, 2, 4, 7][i % 4] + 12 * (i // 8)), P + 1.6 + i * 0.1, 0.6, rev=0.3)
for k in range(8):
    bus.add(K, P + 2.8 + k * STEP, 0.25 + 0.06 * k)
    kicks.append(P + 2.8 + k * STEP)
bus.add(E.riser(OK - P - 1.2, 300, 11000, (200, 1800)), P + 1.2, 0.4)

# 20,8–24 : drop
bus.add(E.impact(1.4), OK, 0.6)
minimal(OK, 2, [43, 40])
for b in range(2):
    bus.add(E.supersaw(MAJ[b], BAR, cutoff=4500), OK + b * BAR, 0.3, rev=0.3, duck=True)
    for q in (1, 3):
        bus.add(CL, OK + b * BAR + q * BEAT, 0.4, rev=0.2)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.5)
minimal(24.0, 2, [48, 50], gain=0.9)
for b in range(2):
    bus.add(E.supersaw(MAJ[2 + b], BAR, cutoff=3500), 24.0 + b * BAR, 0.26, rev=0.3, duck=True)
bus.add(E.pad([55, 62, 67, 71], DUR - 24.0 - 2 * BAR, cutoff=2600), 24.0 + 2 * BAR, 0.45, rev=0.5)

music = bus.render(kicks, duck_depth=0.35, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
