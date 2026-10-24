"""Bande-son de « LE TICKET À GRATTER » : disco casino originale, 118 BPM, la mineur → la majeur.

0–12 s     disco (grosse caisse à chaque temps, basse en octaves, cordes) ; grattage ASMR à la pièce
           RAS = petit « ding » ; VMC = suspense puis PERDU (8,46 s) : machine à sous qui descend + buzzer
12,2–14    le ticket est jeté : souffle, arrêt
14–24      ticket AnalyseTaCopro : disco en majeur, « ding » par ligne, GAGNÉ = jackpot de pièces + fanfare
24–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 118
BAR = BEAT * 4
STEP = BAR / 16
DUR = 30.0
SCR = [(1.0, 1.6), (3.4, 1.6), (5.8, 2.2), (9.7, 1.4)]
LOSE = 8.46
G = 14.0
W = G + 0.6 + 4 * BEAT + 0.4


def scratch(L):
    t = E.secs(L)
    am = 0.35 + 0.65 * np.abs(np.sin(2 * np.pi * (7 / (2 * L)) * t * 2))
    grit = (np.abs(E.noise(L)) > 1.4).astype(float) * 0.6 + 0.4
    return E.bandpass(E.noise(L) * grit, 1800, 8000) * am * 0.7


def ding(note=88, L=0.8):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2 * t)) * np.exp(-t * 5) * 0.3


def slot(notes, step=0.09):
    out = np.zeros(int((len(notes) * step + 0.3) * E.SR))
    for k, n in enumerate(notes):
        t = E.secs(step * 0.9)
        s = np.sign(np.sin(2 * np.pi * E.midi(n) * t)) * np.exp(-t * 10) * 0.18
        i = int(k * step * E.SR)
        out[i : i + len(s)] += s
    return E.lowpass(out, 5000)


def buzzer(L=0.6):
    t = E.secs(L)
    return E.lowpass(np.sign(np.sin(2 * np.pi * 98 * t)) + np.sign(np.sin(2 * np.pi * 104 * t)), 2000) * 0.15 * np.minimum((L - t) / 0.03, 1)


def coins(L=1.6, n=28):
    out = np.zeros(int(L * E.SR))
    for k in range(n):
        f = 2400 + (k * 377) % 1800
        t = E.secs(0.25)
        s = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.47 * t)) * np.exp(-t * 18) * 0.12
        i = int((k / n) * (L - 0.25) * E.SR * (0.6 + 0.4 * ((k * 7) % 5) / 5))
        out[i : i + len(s)] += s
    return out


def strings(notes, L):
    t = E.secs(L)
    s = sum(E.saw(E.midi(n) * (1 + d * 0.005), t) for n in notes for d in (-1, 0, 1))
    return E.lowpass(s, 4500) * np.minimum(t / 0.01, 1) * np.exp(-t * 6) / (3 * len(notes)) * 1.4


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=160, drive=2.0)
HO = E.hat(open_=True)
MIN = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 56, 59]]  # Am F G E
MAJ = [[57, 61, 64], [54, 57, 61], [50, 54, 57], [52, 56, 59]]  # A F#m D E


def disco(t0, nbars, prog, gain=1.0):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        for q in range(4):
            bus.add(K, tb + q * BEAT, 0.9 * gain)
            kicks.append(tb + q * BEAT)
            bus.add(HO, tb + q * BEAT + BEAT / 2, 0.3 * gain, pan=0.25)
        for q in (1, 3):
            bus.add(E.clap(), tb + q * BEAT, 0.5 * gain, rev=0.25)
        root = ch[0] - 24
        for s in range(8):
            bus.add(E.pluck(root + (12 if s % 2 else 0), STEP * 1.6, 1800), tb + s * BEAT / 2, 0.75 * gain)
        bus.add(strings([n + 12 for n in ch], BEAT * 0.9), tb + BEAT * 1.5, 0.5 * gain, rev=0.3)
        bus.add(strings([n + 12 for n in ch], BEAT * 0.9), tb + BEAT * 3.5, 0.5 * gain, rev=0.3)


# 0–12 : on gratte
bus.add(E.pad([57, 60, 64, 69], 1.0, cutoff=2000), 0.0, 0.4, rev=0.4)
disco(0.0, 4, MIN, 0.85)
for t, d in SCR:
    bus.add(scratch(d), t, 0.9, pan=0.1)
bus.add(ding(88), 2.6, 0.8, rev=0.3)
bus.add(ding(91), 5.0, 0.8, rev=0.3)
bus.add(E.riser(1.4, 400, 9000, (300, 1500)), 6.6, 0.4)
bus.add(slot([81, 79, 76, 72, 69, 64, 57]), LOSE, 0.9)
bus.add(buzzer(), LOSE + 0.1, 1.0)
bus.add(E.impact(1.2), LOSE, 0.8)
disco(LOSE + 0.6, 1, MIN[3:], 0.6)
bus.add(slot([69, 64, 60]), 11.15, 0.7)
bus.add(E.whoosh(0.6, up=False), 13.4, 0.6)

# 14–24 : ticket AnalyseTaCopro
bus.add(E.impact(1.2), G, 0.5)
disco(G, 5, MAJ)
for k in range(4):
    bus.add(ding(85 + 2 * k), G + 0.6 + k * BEAT, 0.7, rev=0.3)
bus.add(coins(), W, 1.0, pan=0.0)
bus.add(slot([69, 73, 76, 81, 85, 88, 93], 0.06), W, 0.9)
bus.add(strings([69, 73, 76, 81], 1.2), W, 0.7, rev=0.4)

# 24–30 : fin
bus.add(E.impact(1.4), 24.0, 0.5)
disco(24.0, 2, MAJ[:1] + MAJ[3:])
bus.add(E.pad([57, 61, 64, 69, 73], DUR - 24.0 - 2 * BAR, cutoff=2600), 24.0 + 2 * BAR, 0.45, rev=0.5)

music = bus.render(kicks, duck_depth=0.35, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
