"""Bande-son de « LES POUPÉES RUSSES » : hardbass originale + balalaïka de synthé (trémolo), 150 BPM, la mineur → do majeur.

0–2,4 s    balalaïka seule en trémolo, grosse caisse à la noire qui entre
2,4–14,4   chaque poupée ouverte = « pop » de bouchon + whoosh + accent ; la musique s'épaissit à chaque couche
           (1 : kick + basse pompante, 2 : + charleston, 3 : + mélodie à l'octave, 4 : + chœurs « hey »)
14,4–17,4  la pièce à 0 € : la musique s'effondre (tape stop), pièce qui tourne, « wah-wah » triste
17,4–20,6  on ouvre tout : 5 pops en rafale, montée
20,6–24    la bonne copro : drop en majeur
24–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 150
BAR = BEAT * 4
STEP = BAR / 16
DUR = 30.0
O = [2.4, 5.6, 8.8, 12.0, 14.4]
P = 17.4
G = 20.6


def bala(note, L, rate=STEP / 2):
    """Balalaïka de synthé : pincements rapides répétés (trémolo)."""
    out = np.zeros(int(L * E.SR) + 1)
    k = 0
    while k * rate < L:
        p = E.pluck(note, 0.12, bright=5200) * (0.8 + 0.2 * (k % 2))
        i = int(k * rate * E.SR)
        n = min(len(p), len(out) - i)
        out[i:i + n] += p[:n]
        k += 1
    return out * 0.9


def cork(L=0.18):
    t = E.secs(L)
    f = 900 * np.exp(-t * 18) + 250
    return E.phase_sine(f) * np.exp(-t * 26) * 0.7 + E.bandpass(E.noise(L), 1500, 5000) * np.exp(-t * 60) * 0.4


def hey(note=64):
    return E.vox("e", note, 0.22) * 0.9


def sad_trumpet(notes):
    out = []
    for n in notes:
        t = E.secs(0.45)
        f = E.midi(n) * (1 + 0.015 * np.sin(2 * np.pi * 6 * t))
        s = np.tanh(E.saw(1, np.cumsum(f) / E.SR) * 1.5)
        out.append(E.lowpass(s, 1600) * np.minimum(t / 0.03, 1) * np.exp(-np.maximum(t - 0.3, 0) * 10) * 0.3)
    return np.concatenate(out)


MEL = [69, 72, 76, 74, 72, 71, 72, 69, 67, 69, 71, 72, 71, 69, 68, 69]  # 2 mesures, croches (original)
AM = [45, 45, 40, 44]  # la, la, mi, sol#
MAJ = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F

bus = E.Bus(DUR)
kicks = []
K = E.kick(top=200, low=50, drive=3.2)
H = E.hat(0.05, open_=True)
CL = E.clap()


def hard(t0, nbars, layer, roots=AM, mel_shift=0, gain=1.0):
    for b in range(nbars):
        tb = t0 + b * BAR
        r = roots[b % len(roots)]
        for q in range(4):
            bus.add(K, tb + q * BEAT, 0.9 * gain)
            kicks.append(tb + q * BEAT)
            bus.add(E.bass808(r - 12, BEAT * 0.45, drive=3.0), tb + q * BEAT + BEAT / 2, 0.55 * gain)
            if layer >= 2:
                bus.add(H, tb + q * BEAT + BEAT / 2, 0.22 * gain, pan=0.2)
        if layer >= 1:
            for q in (1, 3):
                bus.add(CL, tb + q * BEAT, 0.4 * gain, rev=0.2)
        for k in range(8):
            n = MEL[(b % 2) * 8 + k] + mel_shift
            bus.add(bala(n, BEAT / 2), tb + k * BEAT / 2, 0.42 * gain, pan=-0.15, rev=0.2, duck=True)
            if layer >= 3:
                bus.add(E.pluck(n + 12, 0.18, bright=7000), tb + k * BEAT / 2, 0.22 * gain, pan=0.25, rev=0.25)
        if layer >= 4:
            bus.add(hey(), tb + 3 * BEAT + BEAT / 2, 0.45 * gain, rev=0.3)


# 0–2,4 : balalaïka seule puis la grosse caisse
for k in range(6):
    n = MEL[k]
    bus.add(bala(n, BEAT * 0.9), k * BEAT, 0.5, rev=0.3)
for q in (4, 5):
    bus.add(K, q * BEAT, 0.8)
    kicks.append(q * BEAT)
bus.add(E.riser(0.8, 500, 9000, (300, 1200)), O[0] - 0.8, 0.3)

# 2,4–14,4 : les couches
hard(O[0], 2, 1)
hard(O[1], 2, 2)
hard(O[2], 2, 3)
hard(O[3], 1, 4, mel_shift=0)
hard(O[3] + BAR, 0, 4)
# 13,6–14,4 : demi-mesure de transition
for q in range(2):
    bus.add(K, O[3] + BAR + q * BEAT, 0.9)
    kicks.append(O[3] + BAR + q * BEAT)
for k, t in enumerate(O):
    bus.add(cork(), t, 0.9)
    bus.add(E.whoosh(0.5), t - 0.1, 0.35)
    bus.add(E.impact(0.8), t + 0.1, 0.35)

# 14,4–17,4 : la pièce à 0 € (bus séparé, épargné par le tape stop)
fx = E.Bus(DUR)
coin_t = E.secs(1.2)
coin = np.sin(2 * np.pi * (2400 + 300 * np.sin(2 * np.pi * (3 + 9 * coin_t) * coin_t)) * coin_t) * np.exp(-coin_t * 2.0) * 0.12
fx.add(coin, O[4] + 0.3, 0.8, rev=0.3)
fx.add(sad_trumpet([62, 61, 60, 59]), O[4] + 0.9, 0.7, rev=0.3)
fx.add(E.pad([45, 52, 57], P - O[4], cutoff=900, attack=0.3), O[4], 0.3, rev=0.5)
fx.add(E.kick(L=0.5, top=120, drive=2.0), 16.0, 0.6)

# 17,4–20,6 : on ouvre tout
bus.add(E.impact(1.2), P, 0.4)
for k in range(5):
    bus.add(cork(), P + 0.6 + k * 0.3, 0.85)
    bus.add(E.pluck(76 + [0, 2, 3, 5, 7][k], 0.3, bright=6000), P + 0.65 + k * 0.3, 0.5, rev=0.3)
for k in range(16):
    bus.add(K, P + BAR + k * STEP, 0.25 + 0.03 * k)
    kicks.append(P + BAR + k * STEP)
bus.add(E.riser(G - P - 0.6, 300, 11000, (200, 1800)), P + 0.6, 0.45)

# 20,6–24 : la bonne copro, majeur
bus.add(E.impact(1.4), G, 0.6)
hard(G, 2, 3, roots=[48, 43], mel_shift=3)
bus.add(cork(), G + 0.7, 0.9)
for b in range(2):
    bus.add(E.supersaw(MAJ[b], BAR, cutoff=4500), G + b * BAR, 0.3, rev=0.3, duck=True)
for k, n in enumerate((72, 76, 79, 84)):
    bus.add(E.pluck(n, 0.4, bright=7000), G + 1.46 + k * 0.07, 0.5, rev=0.4)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.5)
hard(24.0, 2, 4, roots=[45, 41], mel_shift=0, gain=0.9)
bus.add(E.pad([60, 64, 67, 72], DUR - 24.0 - 2 * BAR, cutoff=2600), 24.0 + 2 * BAR, 0.45, rev=0.5)
for k in range(4):
    bus.add(bala(MAJ[0][k % 3] + 12, BEAT * 0.9), 24.0 + 2 * BAR + k * BEAT, 0.35, rev=0.4)

music = bus.render(kicks, duck_depth=0.35, fade_out=0.9)
# tape stop sous la pièce à 0 € : la musique s'effondre jusqu'à 16 s
a, b, c = int((O[4] + 0.05) * E.SR), int((O[4] + 0.75) * E.SR), int(16.0 * E.SR)
for ch in range(2):
    col = music[:, ch].copy()
    E.tape_stop(col, a, b)
    music[a:c, ch] = col[a:c]
music = music + fx.render([], duck_depth=0.0, fade_out=0) * 0.55

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
