"""Bande-son de « UNBOXING » : lo-fi originale, 90 BPM, fa majeur → (déraillement) → fa majeur.

0–2 s       ASMR : cutter dans le scotch, rabats du carton
2–6 s       lo-fi douce ; les bons objets (clés, vue) = froissement + carillon
6–15,3      chaque mauvaise surprise = scratch de vinyle, la bande pleure, coup de basse ; le beat se salit
15,3        tampon « 13 400 € de surprises — retour impossible »
17,4–24     la bonne copro : lo-fi claire, carillons à chaque ligne cochée
24–30       fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 90
BAR = BEAT * 4
STEP = BAR / 16
DUR = 30.0
T = [2.0, 4.0, 6.0, 8.7, 11.3, 13.3]
G = 17.4


def tape_cut(L=0.5):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 1500, 7000) * (0.5 + 0.5 * np.sin(2 * np.pi * 34 * t) ** 2) * np.sin(np.pi * t / L) * 0.6


def cardboard(L=0.3):
    t = E.secs(L)
    return (E.lowpass(E.noise(L), 900) * np.exp(-t * 20) * 1.4 + E.bandpass(E.noise(L), 1200, 5000) * np.exp(-t * 12) * 0.4)


def crinkle(L=0.45):
    t = E.secs(L)
    pops = (np.abs(E.noise(L)) > 2.0) * E.noise(L)
    return E.highpass(pops, 2500) * np.sin(np.pi * t / L) * 0.8


def chime(note, L=1.0):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 8)) * np.exp(-t * 3.5) * 0.25


def scratch(L=0.4):
    t = E.secs(L)
    f = 300 + 900 * np.abs(np.sin(2 * np.pi * 3.2 * t))
    s = E.bandpass(E.noise(L), 400, 4000) * 0.5 + np.sin(np.cumsum(f) / E.SR * 2 * np.pi) * 0.2
    return s * np.minimum(t / 0.01, 1) * np.exp(-t * 3)


def stamp():
    t = E.secs(0.5)
    thud = E.phase_sine(60 + 120 * np.exp(-t * 40)) * np.exp(-t * 14)
    return np.tanh((thud + E.bandpass(E.noise(0.5), 300, 3000) * np.exp(-t * 45) * 0.6) * 2.0) * 0.9


def dusty(x):
    return np.tanh(E.lowpass(E.highpass(x, 120), 4000) * 1.3)


bus = E.Bus(DUR)
kicks = []
K = E.kick(L=0.4, top=130, low=48, punch=28, drive=1.5)
SN = E.snare(L=0.3, tone=190, crack=0.8)
H = E.hat(0.04, tone=0.8)
CH = [[65, 69, 72, 76], [62, 65, 69, 72], [58, 62, 65, 69], [60, 64, 67, 70]]  # Fmaj7 Dm7 Bbmaj7 C7
VINYL = E.highpass(E.noise(DUR), 2500) * 0.003 + (np.abs(E.noise(DUR)) > 3.7) * E.noise(DUR) * 0.035


def lofi(t0, nbars, dirty=False):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = CH[b % 4]
        for k, n in enumerate(ch):
            bus.add(dusty(E.ep(n - (1 if dirty and k == 1 else 0), BAR * 0.9)), tb + k * 0.02, 0.45, pan=(k - 1.5) * 0.15, rev=0.35, duck=True)
        for s in (0, 7, 10):
            bus.add(K, tb + s * STEP, 0.8)
            kicks.append(tb + s * STEP)
        for s in (4, 12):
            bus.add(SN, tb + s * STEP, 0.45, rev=0.25)
        for s in range(0, 16, 2):
            bus.add(H, tb + s * STEP + (STEP * 0.2 if s % 4 else 0), 0.18, pan=0.2)
        bus.add(E.bass808(ch[0] - 24, BAR * 0.4, drive=1.3), tb, 0.5)
        bus.add(E.bass808(ch[0] - 24, BAR * 0.25, drive=1.3), tb + 10 * STEP, 0.45)


# 0–2 : ASMR
bus.add(tape_cut(), 0.6, 1.0, pan=0.1)
bus.add(cardboard(), 1.3, 0.9, pan=-0.2)
bus.add(cardboard(), 1.4, 0.8, pan=0.2)
bus.add(dusty(E.ep(65, 2.0)), 0.0, 0.3, rev=0.4)

# 2–17,4 : le déballage
lofi(2.0, 2)
lofi(2.0 + 2 * BAR, 4, dirty=True)
for k, t in enumerate(T):
    bus.add(crinkle(), t - 0.05, 0.9, pan=(k % 2 - 0.5) * 0.4)
    if k < 2:
        bus.add(chime(84 + 3 * k), t + 0.3, 0.7, rev=0.4)
    else:
        bus.add(scratch(), t + 0.3, 0.9)
        bus.add(E.bass808(29, 0.5, glide_from=41, drive=2.2, glide=0.1), t + 0.35, 0.7)
bus.add(E.reverse_cymbal(0.6), 15.3 - 0.6, 0.45)
bus.add(stamp(), 15.3, 1.0)
bus.add(E.impact(1.5), 15.3, 0.6)
bus.add(E.pad([53, 56, 60], 2.0, cutoff=700), 15.4, 0.4, rev=0.5)

# 17,4–24 : la bonne copro
bus.add(E.impact(1.0), G, 0.4)
lofi(G, 2)
lofi(G + 2 * BAR, 1)
for k in range(4):
    bus.add(chime(81 + [0, 4, 7, 12][k]), G + 0.6 + k * BEAT, 0.6, rev=0.4)
bus.add(chime(93, 1.4), G + 0.6 + 4 * BEAT, 0.6, rev=0.5)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.4)
lofi(24.0, 2)
bus.add(dusty(E.ep(65, 2.5)) + dusty(E.ep(72, 2.5)), 24.0 + 2 * BAR, 0.4, rev=0.5)

music = bus.render(kicks, duck_depth=0.3, fade_out=0.9)
# la bande « pleure » à chaque mauvaise surprise
for t in T[2:]:
    a, b = int((t + 0.3) * E.SR), int((t + 0.75) * E.SR)
    seg = music[a:b].copy()
    n = len(seg)
    rate = 1 - 0.12 * np.sin(np.linspace(0, np.pi, n))
    pos = np.clip(np.cumsum(rate), 0, n - 1)
    for c in range(2):
        music[a:b, c] = np.interp(pos, np.arange(n), seg[:, c])
music += VINYL[: len(music)][:, None]

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
