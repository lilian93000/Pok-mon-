"""Bande-son de « BILAN DE SANTÉ » : drum & bass originale, 172 BPM, ré mineur → fa majeur.

0–2,79 s    moniteur cardiaque à 86 BPM (l'accroche est déjà à l'écran)
2,79–13,95  tachycardie : le bip passe à 172 BPM et devient une drum & bass sombre (basse « reese »)
            chaque diagnostic = balayage du scanner + coup
13,95–16,74 ligne plate : tout s'arrête, bip continu, tampon (14,65)
16,74–24    nouveau patient : liquid drum & bass en majeur, bips calmes
24–30       fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 172
BAR = BEAT * 4
HB = BEAT * 2
STEP = BAR / 16
DUR = 30.0
D = [2.79 + k * 2 * BAR for k in range(4)]
F = 13.95
G = 16.74


def beep(L=0.09, f=1000):
    t = E.secs(L)
    return np.sin(2 * np.pi * f * t) * np.minimum(t / 0.003, 1) * np.minimum((L - t) / 0.01, 1) * 0.22


def reese(note, L, cutoff=700):
    t = E.secs(L)
    f = E.midi(note)
    s = E.saw(f * 0.995, t) + E.saw(f * 1.006, t) + 0.5 * np.sin(2 * np.pi * f / 2 * t)
    env = np.minimum(t / 0.01, 1) * np.minimum((L - t) / 0.03, 1)
    return np.tanh(E.lowpass(s, cutoff) * env * 1.6) * 0.45


def scanner(L=0.5):
    t = E.secs(L)
    return E.sweep_filter(E.noise(L), 300, 7000, 24, "low") * np.sin(np.pi * t / L) * 0.4


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=200, drive=2.4)
SN = E.snare(L=0.25, tone=220, crack=1.3)
H = E.hat(0.03)


def dnb(t0, nbars, roots, dark=True):
    for b in range(nbars):
        tb = t0 + b * BAR
        r = roots[b % len(roots)]
        for s in (0, 10):
            bus.add(K, tb + s * STEP, 0.9)
            kicks.append(tb + s * STEP)
        for s in (4, 12):
            bus.add(SN, tb + s * STEP, 0.75, rev=0.15)
        if b % 2 == 1:
            bus.add(SN, tb + 15 * STEP, 0.3)
        for s in range(16):
            bus.add(H, tb + s * STEP, 0.22 if s % 2 else 0.12, pan=0.25 if s % 4 else -0.2)
        if dark:
            bus.add(reese(r - 24, BAR * 0.98, 500 + 300 * (b % 2)), tb, 0.8)
            bus.add(E.pad([r, r + 3, r + 7], BAR, cutoff=900, attack=0.1), tb, 0.25, rev=0.4, duck=True)
        else:
            bus.add(E.bass808(r - 24, BAR * 0.55, drive=1.6), tb, 0.6)
            bus.add(E.bass808(r - 24, BAR * 0.35, drive=1.6), tb + 10 * STEP, 0.5)
            bus.add(E.pad([r, r + 4, r + 7, r + 11], BAR, cutoff=2600, attack=0.2), tb, 0.35, rev=0.45, duck=True)
            for k, n in enumerate((r + 12, r + 16, r + 19, r + 23)):
                bus.add(E.ep(n, 0.6), tb + k * 3 * STEP, 0.35, pan=(k - 1.5) * 0.2, rev=0.4, duck=True)


# 0–2,79 : moniteur cardiaque
t = 0.0
while t < D[0] - 0.01:
    bus.add(beep(), t, 1.0)
    t += HB
bus.add(E.pad([50, 57, 62], D[0], cutoff=700, attack=0.5), 0.0, 0.35, rev=0.5)
bus.add(E.riser(1.2, 300, 8000, (200, 1200)), D[0] - 1.2, 0.35)

# 2,79–13,95 : tachycardie + DnB sombre
dnb(D[0], 8, [50, 46, 48, 45])
t = D[0]
while t < F - 0.01:
    bus.add(beep(0.06, 1200), t, 0.5)
    t += BEAT
for k, d in enumerate(D):
    bus.add(scanner(), d, 0.8, pan=-0.2 + 0.13 * k)
    bus.add(E.impact(1.0), d + 0.35, 0.5)

# 13,95–16,74 : ligne plate
bus.add(beep(G - F - 0.1, 1000) * 0.9, F, 1.0)
bus.add(E.pad([38, 45, 50], G - F, cutoff=400, attack=0.3), F, 0.4, rev=0.6)
bus.add(E.impact(2.0), F + HB, 0.9)
bus.add(E.kick(L=0.6, top=110, drive=2.8), F + HB, 0.8)
bus.add(E.riser(1.0, 400, 10000, (300, 1600)), G - 1.0, 0.4)

# 16,74–24 : patient en bonne santé — liquid DnB en majeur
bus.add(E.impact(1.4), G, 0.5)
dnb(G, 5, [53, 50, 46, 48], dark=False)
dnb(G + 5 * BAR, 1, [53], dark=False)
t = G
while t < 24.0:
    bus.add(beep(0.07, 880), t, 0.35)
    t += HB * 1.2
for k in range(4):
    bus.add(E.ep(77 + [0, 4, 7, 12][k], 1.0), G + 0.5 + k * BAR, 0.4, rev=0.4)

# 24–30 : fin
bus.add(E.impact(1.6), 24.0, 0.5)
dnb(24.0, 3, [53, 48], dark=False)
bus.add(E.pad([53, 60, 65, 69, 72], DUR - 24.0 - 3 * BAR, cutoff=2600), 24.0 + 3 * BAR, 0.45, rev=0.5)
bus.add(beep(0.09, 880), 24.0 + 3 * BAR, 0.4)

music = bus.render(kicks, duck_depth=0.4, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
