"""Bande-son de « LE JEU DES 5 ERREURS » : UK garage originale (2-step), 132 BPM, fa mineur → la bémol majeur.

0–15,6 s   2-step (grosse caisse décalée, caisse sur 2 et 4, charleston swingué), orgue, voix découpées
           chaque erreur trouvée = « ding » montant + coup de feutre (le cercle rouge)
15,6–17,4  « T'en as trouvé combien ? » : break, montée
17,4–24    la bonne copro : drop en majeur, tampon « 0 ERREUR »
24–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 132
BAR = BEAT * 4
STEP = BAR / 16
SWG = STEP * 0.22
DUR = 30.0
T = [2.2, 2.2 + 2 * BAR, 2.2 + 3.5 * BAR, 2.2 + 5 * BAR, 2.2 + 6.5 * BAR]
G = 17.4


def organ(notes, L):
    t = E.secs(L)
    s = sum(np.sin(2 * np.pi * E.midi(n) * k * t) / k for n in notes for k in (1, 2, 3, 4))
    return np.tanh(s / len(notes) * 0.8) * np.minimum(t / 0.005, 1) * np.exp(-t * 7) * 0.5


def found(k):
    t = E.secs(0.5)
    f = E.midi(84 + [0, 2, 4, 7, 12][k])
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2 * t)) * np.exp(-t * 7) * 0.3


def marker(L=0.3):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 1500, 6000) * np.sin(np.pi * t / L) * 0.45


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=170, drive=2.2)
SN = E.snare(L=0.25, tone=210, crack=1.1)
H = E.hat(0.04)
MIN = [[53, 56, 60, 63], [49, 53, 56, 60], [51, 55, 58, 61], [48, 51, 55, 58]]  # Fm7 Db Eb7 Cm7
MAJ = [[56, 60, 63, 67], [53, 56, 60, 63], [49, 53, 56, 60], [51, 55, 58, 62]]  # Ab Fm Db Eb
VOX = "aoeiaeoa"


def garage(t0, nbars, prog, full=True):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        sw = lambda s: tb + s * STEP + (SWG if s % 2 else 0)  # noqa: E731
        for s in (0, 7, 10) if b % 2 == 0 else (0, 6, 11):
            bus.add(K, sw(s), 0.9)
            kicks.append(sw(s))
        for s in (4, 12):
            bus.add(SN, sw(s), 0.65, rev=0.2)
        for s in range(16):
            if s % 2 or full:
                bus.add(H, sw(s), 0.24 if s % 2 else 0.12, pan=0.25)
        for s in (2, 6, 9, 14):
            bus.add(organ([n + 12 for n in ch[:3]], STEP * 1.4), sw(s), 0.5, pan=-0.15, rev=0.25, duck=True)
        bus.add(E.bass808(ch[0] - 24, STEP * 5, drive=2.0), sw(0), 0.65)
        bus.add(E.bass808(ch[0] - 24 + (7 if b % 2 else 0), STEP * 3, drive=2.0), sw(10), 0.6)
        if full:
            for k, s in enumerate((3, 5, 13)):
                bus.add(E.vox(VOX[(b + k) % 8], ch[2] - 12, STEP * 1.2), sw(s), 0.3, pan=0.2, rev=0.3)


# 0–15,6
bus.add(E.pad([53, 60, 65], 2.2, cutoff=1500, attack=0.2), 0.0, 0.4, rev=0.4)
for k in range(4):
    bus.add(organ([65, 68, 72], 0.3), k * BEAT, 0.5)
garage(2.2, 7, MIN)
for k, t in enumerate(T):
    bus.add(marker(), t, 0.9)
    bus.add(found(k), t + 0.1, 0.9, rev=0.3)

# 15,6–17,4 : break
bus.add(E.pad([53, 56, 60, 65], G - 15.6, cutoff=1200, attack=0.3), 15.6, 0.45, rev=0.5)
for k in range(8):
    bus.add(SN, 16.5 + k * STEP, 0.25 + 0.08 * k)
bus.add(E.riser(1.4, 400, 10000, (300, 1600)), G - 1.4, 0.45)

# 17,4–24 : la bonne copro
bus.add(E.impact(1.4), G, 0.6)
garage(G, 3, MAJ)
garage(G + 3 * BAR, 1, MAJ[3:], full=False)
bus.add(E.kick(L=0.5, top=130, drive=2.4), G + 1.36, 0.8)
for k, n in enumerate((80, 84, 87, 92)):
    bus.add(found(min(k, 4)), G + 1.4 + k * 0.08, 0.6, rev=0.4)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.5)
garage(24.0, 2, MAJ[:1] + MAJ[3:])
bus.add(E.pad([56, 63, 68, 72, 75], DUR - 24.0 - 2 * BAR, cutoff=2600), 24.0 + 2 * BAR, 0.45, rev=0.5)

music = bus.render(kicks, duck_depth=0.35, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
