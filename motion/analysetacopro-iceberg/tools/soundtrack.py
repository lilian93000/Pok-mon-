"""Bande-son de « L'ICEBERG » : trap cinématique originale (demi-temps), 140 BPM, ré mineur → fa majeur.

0–2,4 s    au-dessus de l'eau : pluck clair, pad, mouettes de synthé
2,4 s      plongeon : impact + « splash », tout passe sous l'eau (graves, filtres fermés)
2,4–15,6   la descente : drone grave, trap en demi-temps, 808, un ping de sonar à chaque palier (plus grave à chaque fois)
15,6–17,4  le total : BRAAAM grave, silence lourd
17,4–20,6  le sonar : pings rapides, charleston en triolets, montée
20,6–24    retour à la surface, la bonne copro : drop en majeur
24–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 140
BAR = BEAT * 4
STEP = BAR / 16
DUR = 30.0
D0 = 2.4
T = [3.2, 5.8, 8.4, 11.0, 13.6]
S0 = 15.6
P = 17.4
G = 20.6


def ping(note, L=1.6):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 2.01 * t)) * np.minimum(t / 0.003, 1) * np.exp(-t * 2.6) * 0.4


def drone(note, L):
    t = E.secs(L)
    s = sum(np.sin(2 * np.pi * E.midi(note) * m * t + 0.3 * np.sin(2 * np.pi * 0.2 * t)) / m for m in (1, 2, 3))
    return E.lowpass(s, 400) * np.minimum(t / 0.6, 1) * np.exp(-np.maximum(t - (L - 0.3), 0) * 12) * 0.3


def braam(notes, L=2.0):
    t = E.secs(L)
    s = sum(E.saw(E.midi(n) * (1 + d), t) for n in notes for d in (-0.006, 0, 0.005))
    env = np.minimum(t / 0.02, 1) * np.exp(-t * 1.3)
    return np.tanh(E.lowpass(s, 900) * env * 0.6) * 0.7


def splash(L=1.0):
    t = E.secs(L)
    return E.sweep_filter(E.noise(L), 7000, 300, 24) * np.exp(-t * 3.2) * 0.8


def gull(L=0.5):
    t = E.secs(L)
    f = 1500 + 900 * np.sin(np.pi * np.clip(t / L, 0, 1)) - 600 * t / L
    return E.phase_sine(f) * np.sin(np.pi * np.clip(t / L, 0, 1)) ** 2 * 0.07


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=150, low=40, drive=2.6)
SN = E.snare(L=0.35, tone=180, crack=0.8)
CL = E.clap()
H = E.hat(0.035)
DM = [50, 46, 43, 45]  # ré, si bémol, sol, la
MAJ = [[53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 60]]  # Fmaj7 Dm7 Bbmaj7 C


def halftime(t0, nbars, roots, hats=True, rolls=False, gain=1.0):
    for b in range(nbars):
        tb = t0 + b * BAR
        for s in (0, 10) if b % 2 == 0 else (0, 7, 11):
            bus.add(K, tb + s * STEP, 0.9 * gain)
            kicks.append(tb + s * STEP)
        bus.add(SN, tb + 8 * STEP, 0.6 * gain, rev=0.35)
        bus.add(CL, tb + 8 * STEP, 0.35 * gain, rev=0.35)
        if hats:
            for s in range(0, 16, 2):
                bus.add(H, tb + s * STEP, 0.2 * gain, pan=0.25)
            if rolls:
                for k in range(6):
                    bus.add(E.hat(0.03, tone=1.2), tb + 12 * STEP + k * STEP * 2 / 3, (0.14 + 0.03 * k) * gain, pan=-0.2)
        r = roots[b % len(roots)]
        bus.add(E.bass808(r - 24, STEP * 9, drive=2.2), tb, 0.75 * gain)
        bus.add(E.bass808(r - 24, STEP * 5, glide_from=r - 12 if b % 2 else None, drive=2.2), tb + 10 * STEP, 0.6 * gain)


# 0–2,4 : au-dessus de l'eau
bus.add(E.pad([62, 65, 69], D0, cutoff=3000, attack=0.15), 0.0, 0.35, rev=0.4)
for k, n in enumerate([74, 77, 81, 79, 77, 74, 72, 74]):
    bus.add(E.pluck(n, 0.4, bright=6000), 0.05 + k * STEP * 2, 0.5, pan=0.15 * (-1) ** k, rev=0.3)
bus.add(gull(), 0.4, 0.8, pan=0.5, rev=0.4)
bus.add(gull(0.4), 1.3, 0.6, pan=-0.4, rev=0.4)
bus.add(E.riser(0.6, 600, 8000, (300, 900)), D0 - 0.6, 0.35)

# 2,4 : plongeon
bus.add(E.impact(2.0), D0, 0.7)
bus.add(splash(), D0, 0.8, rev=0.3)
bus.add(E.whoosh(0.8, up=False), D0, 0.5)

# 2,4–15,6 : la descente
bus.add(drone(38, S0 - D0), D0, 0.8)
bus.add(E.pad([50, 53, 57], S0 - D0, cutoff=600, attack=1.5), D0, 0.35, rev=0.6)
halftime(T[0] - 0.0, 7, DM, hats=True, rolls=True)
for k, t in enumerate(T):
    bus.add(ping(86 - k * 4), t, 0.7, rev=0.7)
    bus.add(E.whoosh(0.5, up=False), t - 0.5, 0.25)

# 15,6–17,4 : le total
bus.add(braam([26, 38, 45]), S0 + 0.1, 0.9, rev=0.3)
bus.add(E.impact(2.0), S0 + 0.1, 0.8)
bus.add(ping(62, 1.6), S0 + 1.0, 0.4, rev=0.8)

# 17,4–20,6 : le sonar
bus.add(E.impact(1.2), P, 0.4)
for k in range(5):
    bus.add(ping(81 + [0, 3, 5, 7, 10][k], 0.8), P + 0.25 + k * 0.42, 0.55, rev=0.5)
halftime(P, 1, DM[:1], rolls=True, gain=0.8)
for k in range(16):
    bus.add(E.hat(0.03, tone=1.1), P + BAR + k * STEP, 0.12 + 0.012 * k, pan=0.2)
bus.add(E.riser(G - P - BAR * 0.6, 300, 11000, (200, 1800)), P + BAR * 0.6, 0.45)
bus.add(E.pad([50, 57, 62], G - P, cutoff=1400, attack=0.4), P, 0.35, rev=0.5)

# 20,6–24 : la bonne copro (majeur)
bus.add(E.impact(1.4), G, 0.6)
bus.add(splash(0.7), G, 0.5)
halftime(G, 2, [53, 50])
for b in range(2):
    ch = MAJ[b]
    bus.add(E.supersaw(ch, BAR, cutoff=4500), G + b * BAR, 0.32, rev=0.3, duck=True)
    for s, n in enumerate([0, 2, 1, 3, 2, 1, 3, 2]):
        bus.add(E.pluck(ch[n] + 12, 0.35, bright=6500), G + b * BAR + s * STEP * 2, 0.4, pan=0.2 * (-1) ** s, rev=0.25)
for k, n in enumerate((77, 81, 84, 89)):
    bus.add(ping(n, 0.8), G + 1.36 + k * 0.07, 0.4, rev=0.4)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.5)
halftime(24.0, 2, [46, 48])
for b, ch in enumerate(MAJ[2:]):
    bus.add(E.supersaw(ch, BAR, cutoff=3500), 24.0 + b * BAR, 0.28, rev=0.3, duck=True)
bus.add(E.pad([53, 60, 65, 69, 72], DUR - 24.0 - 2 * BAR, cutoff=2600), 24.0 + 2 * BAR, 0.45, rev=0.5)

music = bus.render(kicks, duck_depth=0.35, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
