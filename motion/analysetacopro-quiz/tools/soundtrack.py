"""Bande-son de « RED FLAG ou GREEN FLAG ? » : trap jeu télé originale, 150 BPM, do majeur.

1 temps = 0,4 s, 1 mesure = 1,6 s.
0–1,6 s     accroche : accord de plateau, roulement, montée → 1,6 s le logo claque
1,6–19,2    groove ; à chaque manche : tic-tac du minuteur (3 temps) puis buzzer (red) ou jingle (green)
19,2–22,4   résultat : fanfare + applaudissements
22,4–25,6   « Nous, on les trouve tous » (groove filtré, montée)
25,6–30     drop final, fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT, BAR, DUR = 0.4, 1.6, 30.0
STEP = BEAT / 4
ANSWERS = ["r", "g", "r", "r", "g"]
CH = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
ROOTS = [36, 31, 33, 29]


def tick(f=1800):
    t = E.secs(0.08)
    return (np.sin(2 * np.pi * f * t) * 0.6 + E.highpass(E.noise(0.08), 3000) * 0.3) * np.exp(-t * 60) * 0.7


def buzzer():
    t = E.secs(0.55)
    s = np.sign(np.sin(2 * np.pi * 98 * t)) + np.sign(np.sin(2 * np.pi * 104 * t)) + 0.5 * E.saw(196, t)
    return E.lowpass(s * np.minimum(t / 0.01, 1) * np.exp(-np.maximum(t - 0.4, 0) * 30), 1800) * 0.35


def jingle():
    out = np.zeros(int(0.8 * E.SR))
    for k, n in enumerate([72, 76, 79, 84]):
        p = E.pluck(n, 0.5, 6000)
        cb = E.cowbell(n + 12, 0.3) * 0.4
        p[: len(cb)] += cb
        i = int(k * 0.07 * E.SR)
        out[i : i + len(p)] += p[: len(out) - i]
    return out


def applause(L=2.4):
    out = np.zeros(int(L * E.SR))
    rng = np.random.default_rng(5)
    c = E.clap(0.12)
    for _ in range(260):
        t0 = rng.random() * (L - 0.15)
        i = int(t0 * E.SR)
        g = 0.25 + rng.random() * 0.35
        out[i : i + len(c)] += c * g * min(1, (L - t0) / 0.8)
    return E.bandpass(out, 500, 9000) * 0.6


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=210, drive=2.8)
S = E.snare()
C = E.clap()
H = E.hat()

# Accroche
bus.add(E.supersaw([60, 64, 67, 72], 0.5, 6000), 0.0, 0.5, rev=0.4)
for k in range(8):
    bus.add(S, BAR / 2 + k * STEP, 0.15 + 0.06 * k)
bus.add(E.riser(BAR, 500, 12000, (300, 2400)), 0.0, 0.45)
bus.add(E.impact(), BAR, 1.0)
bus.add(E.vox("e", 64, 0.45), BAR, 0.55, rev=0.4)
bus.add(jingle(), BAR + 0.05, 0.6, rev=0.4)

# Groove (mesures 2 → 18)
for b in range(1, 18):
    tb = b * BAR
    if 12 * BAR <= tb < 14 * BAR:  # résultat : fanfare + applaudissements, batterie légère
        continue
    filtered = 14 * BAR <= tb < 16 * BAR
    ci = (b - 1) % 4
    for s in (0, 7, 10) if b % 2 else (0, 3, 10, 14):
        bus.add(K, tb + s * STEP, 0.9 if not filtered else 0.6)
        kicks.append(tb + s * STEP)
    for s in (8,):
        bus.add(C, tb + s * STEP, 0.7, rev=0.25)
        bus.add(S, tb + s * STEP, 0.4)
    for s in range(16):
        bus.add(H, tb + s * STEP, 0.35 if s % 2 else 0.2, pan=0.25 if s % 2 else -0.25)
    if b % 2 == 0:
        for k in range(6):
            bus.add(E.hat(0.035, tone=1.15), tb + 12 * STEP + k * STEP * 2 / 3, 0.2 + 0.03 * k, pan=0.3)
    bus.add(E.bass808(ROOTS[ci] + 12, BAR * 0.95, glide_from=ROOTS[ci] + 24 if b % 4 == 3 else None, drive=2.4), tb, 0.6)
    cut = 1600 if filtered else 5200
    for s in (0, 3, 6, 10, 12):
        bus.add(E.supersaw([n + 12 for n in CH[ci]], STEP * 2.5, cut), tb + s * STEP, 0.2, rev=0.2, duck=True)

# Manches : minuteur puis réponse
for i, a in enumerate(ANSWERS):
    R = 3.2 + i * 2 * BAR
    for k in range(3):
        bus.add(tick(1600 + 300 * k), R + BEAT * (k + 1), 0.7, pan=0.2)
    T = R + BAR
    if a == "r":
        bus.add(buzzer(), T, 0.9)
        bus.add(E.impact(1.2), T, 0.6)
    else:
        bus.add(jingle(), T, 0.75, rev=0.35)

# Résultat : fanfare + applaudissements
RS = 19.2
bus.add(E.supersaw([60, 64, 67, 72], BEAT * 0.9, 7000), RS, 0.45, rev=0.4)
bus.add(E.supersaw([62, 65, 69, 74], BEAT * 0.9, 7000), RS + BEAT, 0.45, rev=0.4)
bus.add(E.supersaw([64, 67, 71, 76], BAR, 7000), RS + 2 * BEAT, 0.5, rev=0.5)
bus.add(applause(3.0), RS + 0.1, 0.8)
for bt in np.arange(RS, RS + 2 * BAR, BEAT):
    bus.add(K, bt, 0.6)
    kicks.append(bt)
# Montée vers le drop final
bus.add(E.riser(BAR, 600, 12000, (400, 2600)), 15 * BAR, 0.5)
bus.add(E.reverse_cymbal(0.8), 16 * BAR - 0.8, 0.6)
bus.add(E.impact(), 16 * BAR, 1.0)
bus.add(E.vox("a", 60, 0.45), 16 * BAR, 0.5, rev=0.4)
# Fin
END = 18 * BAR  # 28,8 s
bus.add(E.impact(2.0), END, 0.9)
bus.add(E.kick(top=230, drive=3), END, 1.0)
kicks.append(END)
bus.add(jingle(), END + 0.05, 0.6, rev=0.7)

music = bus.render(kicks, duck_depth=0.55, mutes=[(16 * BAR - STEP, 16 * BAR)], fade_out=0.8)

SFX = [
    (BAR, "whoosh.mp3", -4, 0.0),
    (19.2, "sparkle.mp3", -4, 0.0),
    (19.2 + 1.2, "pop.mp3", -4, 0.0),  # bulle de commentaire
    (22.4 + 1.6, "pop.mp3", -6, 0.0),
    (22.4 + 2.0, "pop.mp3", -6, 0.0),
    (22.4 + 2.4, "pop.mp3", -6, 0.0),
    (25.6 + 0.8, "pop.mp3", -2, 0.0),
    (25.6 + 1.2, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
