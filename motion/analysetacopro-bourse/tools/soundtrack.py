"""Bande-son de « LA BOURSE » : jersey club originale, 140 BPM, si bémol mineur → ré bémol majeur.

0–2,4 s    euphorie : arpège montant, ça monte
2,4–15,6   chaque info = notification « ding-ding » + chute (scie qui plonge) ; jersey club (kicks rebondissants, voix découpées)
15,6–17,4  KRACH : tape stop, sirène, impact
17,4–20,6  on lit les documents : tic-tic de validation, montée
20,6–24    la bonne copro : drop en majeur, courbe stable
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
T = [3.0, 5.6, 8.2, 10.8, 13.4]
END = 15.6
P = 17.4
G = 20.6


def notif():
    out = []
    for n in (88, 93):
        t = E.secs(0.12)
        out.append(np.sin(2 * np.pi * E.midi(n) * t) * np.exp(-t * 18) * 0.35)
    return np.concatenate(out)


def fall(L=0.7, n0=72, n1=36):
    t = E.secs(L)
    f = E.midi(n0) * (E.midi(n1) / E.midi(n0)) ** (t / L)
    s = E.saw(1, np.cumsum(f) / E.SR)
    return E.lowpass(np.tanh(s * 1.5), 2500) * np.exp(-t * 2.5) * 0.4


def siren(L=1.6):
    t = E.secs(L)
    f = 700 + 300 * np.sin(2 * np.pi * 2.5 * t)
    return np.tanh(E.saw(1, np.cumsum(f) / E.SR) * 1.2) * np.minimum(t / 0.05, 1) * np.exp(-t * 1.2) * 0.18


def tick(n=96):
    t = E.secs(0.08)
    return np.sin(2 * np.pi * E.midi(n) * t) * np.exp(-t * 50) * 0.4


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=180, low=48, drive=2.8)
CL = E.clap()
H = E.hat(0.04)
MIN = [46, 42, 44, 41]  # sib, solb, lab, fa
MAJ = [[61, 65, 68], [58, 61, 65], [54, 58, 61], [56, 60, 63]]  # Db Bbm Gb Ab
VOX = "aeoi"


def jersey(t0, nbars, roots, chords=None, gain=1.0, vox=True):
    for b in range(nbars):
        tb = t0 + b * BAR
        for s in (0, 3, 6, 10, 12) if b % 2 == 0 else (0, 4, 8, 10, 12, 14):
            bus.add(K, tb + s * STEP, 0.9 * gain)
            kicks.append(tb + s * STEP)
        for s in (4, 12):
            bus.add(CL, tb + s * STEP, 0.5 * gain, rev=0.2)
        for s in range(0, 16, 2):
            bus.add(H, tb + s * STEP, 0.18 * gain, pan=0.25)
        r = roots[b % len(roots)]
        bus.add(E.bass808(r - 12, STEP * 6, drive=2.4), tb, 0.6 * gain)
        bus.add(E.bass808(r - 12, STEP * 4, glide_from=r if b % 2 else None, drive=2.4), tb + 10 * STEP, 0.5 * gain)
        if vox:
            for k, s in enumerate((2, 7, 13)):
                bus.add(E.vox(VOX[(b + k) % 4], r + 12, STEP * 1.1), tb + s * STEP, 0.28 * gain, pan=0.2, rev=0.3)
        if chords:
            bus.add(E.supersaw(chords[b % len(chords)], BAR, cutoff=4000), tb, 0.26 * gain, rev=0.3, duck=True)


# 0–2,4 : euphorie
for k in range(12):
    bus.add(E.pluck(70 + [0, 3, 7, 10][k % 4] + 12 * (k // 8), 0.25, bright=6500), k * STEP * 2 * 0.7, 0.45, pan=0.2 * (-1) ** k, rev=0.3)
bus.add(E.pad([58, 65, 70], 2.4, cutoff=2500, attack=0.3), 0.0, 0.35, rev=0.4)
bus.add(E.riser(1.2, 400, 9000, (300, 1400)), 1.2, 0.35)

# 2,4–15,6 : les infos tombent
bus.add(E.impact(1.2), 2.4, 0.5)
jersey(2.4, 7, MIN)
bus.add(E.pad([46, 53, 58], END - 2.4, cutoff=700, attack=1.0), 2.4, 0.3, rev=0.5)
for t in T:
    bus.add(notif(), t - 0.15, 0.8, rev=0.2)
    bus.add(fall(), t, 0.7, rev=0.2)

# 15,6–17,4 : krach
bus.add(siren(), END + 0.1, 0.9, rev=0.3)
bus.add(E.impact(2.0), END + 0.26, 0.9)
bus.add(fall(1.2, 60, 24), END + 0.26, 0.8)

# 17,4–20,6 : on lit tout
bus.add(E.impact(1.0), P, 0.4)
for k in range(6):
    bus.add(tick(96 if k in (0, 3) else 84), P + 0.5 + k * 0.18, 0.7)
for k in range(16):
    bus.add(K, P + BAR + k * STEP, 0.2 + 0.03 * k)
    kicks.append(P + BAR + k * STEP)
bus.add(E.riser(G - P - 0.4, 300, 11000, (200, 1800)), P + 0.4, 0.45)
bus.add(E.pad([58, 61, 65], G - P, cutoff=1500, attack=0.4), P, 0.3, rev=0.5)

# 20,6–24 : la bonne copro
bus.add(E.impact(1.4), G, 0.6)
jersey(G, 2, [49, 46], MAJ)
for k, n in enumerate((73, 77, 80, 85)):
    bus.add(E.pluck(n, 0.4, bright=7000), G + 1.46 + k * 0.07, 0.5, rev=0.4)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.5)
jersey(24.0, 2, [42, 44], MAJ[2:], gain=0.9)
bus.add(E.pad([61, 65, 68, 73], DUR - 24.0 - 2 * BAR, cutoff=2600), 24.0 + 2 * BAR, 0.45, rev=0.5)

music = bus.render(kicks, duck_depth=0.35, fade_out=0.9)
# krach : la musique s'effondre (tape stop) puis silence jusqu'à 17,4 s
a, b, c = int((END + 0.05) * E.SR), int((END + 0.8) * E.SR), int(P * E.SR)
for ch in range(2):
    col = music[:, ch].copy()
    E.tape_stop(col, a, b)
    music[a:b, ch] = col[a:b]
    music[b:c, ch] *= 0.25

SFX = [
    (P + 0.1, "typing.mp3", -6, 0.0),
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
