"""Bande-son de « LA VOYANTE » : trap mystique originale, 136 BPM, ré phrygien dominant → ré majeur.

0–1,76 s    boule de cristal : nappe, carillons, souffle
1,76–15,9   tirage : chaque carte retournée = souffle + gong ; percussions façon tabla, mélodie orientale
15,9        la boule se brise : verre, arrêt de bande
16,6–24     le rapport : beat hip-hop propre en majeur, clic à chaque ligne, tampon « −15 000 € » (22,1)
24–30       fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 136
BAR = BEAT * 4
STEP = BAR / 16
DUR = 30.0
FL = [BAR, BAR * 3, BAR * 5, BAR * 7]
R = BAR * 9
N = R + BAR * 3.5


def tabla(f0=320, L=0.18, bend=0.4):
    t = E.secs(L)
    f = f0 * (1 + bend * np.exp(-t * 30))
    return np.sin(np.cumsum(f) / E.SR * 2 * np.pi) * np.exp(-t * 16) * 0.5


def gong(L=2.5):
    t = E.secs(L)
    s = sum(np.sin(2 * np.pi * f * t) * g * np.exp(-t * d) for f, g, d in ((110, 1, 1.2), (164, 0.6, 1.6), (233, 0.4, 2), (397, 0.25, 3)))
    return s * np.minimum(t / 0.01, 1) * 0.3


def chime(note, L=1.2):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t)) * np.exp(-t * 3) * 0.22


def glass(L=1.0):
    t = E.secs(L)
    shards = (np.abs(E.noise(L)) > 2.4) * E.noise(L)
    return (E.highpass(shards, 3000) * np.exp(-t * 4) * 1.4 + sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 7) for f in (2900, 4100, 5300)) * 0.1)


def click():
    t = E.secs(0.04)
    return E.bandpass(E.noise(0.04), 2000, 8000) * np.exp(-t * 120) * 0.6


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=180, drive=2.3)
SN = E.snare(L=0.3, tone=200)
H = E.hat(0.04)
# ré phrygien dominant : ré mi♭ fa♯ sol la si♭ do
MEL = [62, 63, 66, 67, 69, 67, 66, 63, 62, None, 69, 70, 69, 67, 66, 63]


def mystic(t0, nbars):
    for b in range(nbars):
        tb = t0 + b * BAR
        bus.add(E.pad([50, 57, 62, 66], BAR, cutoff=1300, attack=0.2), tb, 0.35, rev=0.5, duck=True)
        for s, n in enumerate(MEL):
            if n is not None and (s % 2 == 0 or b % 2):
                bus.add(E.pluck(n + 12, STEP * 1.8, 4200), tb + s * STEP, 0.32, pan=0.2, rev=0.35, duck=True)
        for s in (0, 6, 10):
            bus.add(K, tb + s * STEP, 0.85)
            kicks.append(tb + s * STEP)
        bus.add(SN, tb + 8 * STEP, 0.7, rev=0.3)
        for s in range(16):
            if s % 3 == 0:
                bus.add(tabla(300 if s % 2 else 420), tb + s * STEP, 0.5, pan=-0.25)
            if s % 2:
                bus.add(H, tb + s * STEP, 0.16, pan=0.25)
        bus.add(E.bass808(38, BAR * 0.45, drive=2.2), tb, 0.65)
        bus.add(E.bass808(39 if b % 2 else 38, BAR * 0.3, glide_from=38, drive=2.2), tb + 10 * STEP, 0.55)


def clean(t0, nbars):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = [[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 67]][b % 4]
        for k, n in enumerate(ch):
            bus.add(E.ep(n, BAR * 0.9), tb + k * 0.012, 0.4, pan=(k - 1.5) * 0.15, rev=0.3, duck=True)
        for s in (0, 7, 10):
            bus.add(K, tb + s * STEP, 0.85)
            kicks.append(tb + s * STEP)
        for s in (4, 12):
            bus.add(E.clap(), tb + s * STEP, 0.6, rev=0.2)
        for s in range(0, 16, 2):
            bus.add(H, tb + s * STEP, 0.2, pan=0.2)
        bus.add(E.bass808(ch[0] - 24, BAR * 0.45, drive=1.8), tb, 0.6)


# 0–1,76 : la boule de cristal
bus.add(E.pad([50, 57, 62, 66], BAR, cutoff=1000, attack=0.4), 0.0, 0.45, rev=0.6)
for k, n in enumerate([86, 90, 93, 98]):
    bus.add(chime(n), 0.1 + k * 0.18, 0.5, pan=(k % 2 - 0.5) * 0.6, rev=0.5)
bus.add(E.riser(1.0, 300, 6000, (200, 900)), BAR - 1.0, 0.3)

# 1,76–15,9 : tirage
mystic(BAR, 8)
for t in FL:
    bus.add(E.whoosh(0.45, up=True), t - 0.1, 0.7)
    bus.add(gong(), t + 0.2, 0.7, rev=0.4)
    bus.add(chime(98), t + 0.25, 0.3, rev=0.5)

# 15,9 : la boule se brise
bus.add(glass(), R, 1.0)
bus.add(E.impact(1.6), R, 0.8)
bus.add(E.reverse_cymbal(0.6), R + BAR - 0.6, 0.5)

# 16,6–24 : le rapport
clean(R + BAR * 0.5, 4)
for k in range(4):
    bus.add(click(), R + BAR + k * BEAT * 2, 1.0)
    bus.add(chime(81 + [0, 2, 4, 7][k], 0.5), R + BAR + k * BEAT * 2, 0.35)
bus.add(E.reverse_cymbal(0.5), N - 0.5, 0.5)
bus.add(E.kick(L=0.5, top=130, drive=2.6), N, 0.9)
bus.add(E.impact(1.4), N, 0.6)

# 24–30 : fin
bus.add(E.impact(1.6), 24.0, 0.5)
clean(24.0, 2)
bus.add(gong(3.0), 24.0 + 2 * BAR, 0.5, rev=0.5)
bus.add(E.pad([50, 57, 62, 66, 69], DUR - 24.0 - 2 * BAR, cutoff=2400), 24.0 + 2 * BAR, 0.4, rev=0.5)

music = bus.render(kicks, duck_depth=0.4, fade_out=0.9)
# la musique s'effondre quand la boule se brise
a = int(R * E.SR)
b = a + int(0.45 * E.SR)
seg = music[a:].copy()
rate = np.linspace(1, 0, b - a) ** 1.3
pos = np.cumsum(rate)
for c in range(2):
    music[a:b, c] = np.interp(pos, np.arange(len(seg)), seg[:, c]) * 0.6 + music[a:b, c] * 0.4

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
