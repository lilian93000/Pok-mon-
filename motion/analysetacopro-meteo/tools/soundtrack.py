"""Bande-son de « LA MÉTÉO DE TA COPRO » : générique météo funk puis house, 120 BPM.

0–2 s      alerte rouge : sirène, tonnerre, pluie
2–4        jingle « météo télé » : cloches + accords de piano électrique
4–16       groove funk en mineur ; pluie (4), orage (7), brouillard (10), rafales (13)
16–19      prévisions : la batterie s'arrête, tension
19–25      le ciel se dégage : house en majeur
25–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT, BAR, DUR = 0.5, 2.0, 30.0
STEP = BAR / 16


def thunder(L=2.4):
    t = E.secs(L)
    crack = E.highpass(E.noise(L), 1500) * np.exp(-t * 18) * 0.7
    roll = E.lowpass(E.noise(L), 180) * (np.exp(-t * 1.6) * (1 + 0.6 * np.sin(2 * np.pi * 3.3 * t))) * 3.0
    return np.tanh((crack + roll) * 1.2) * 0.8


def rainbed(L):
    t = E.secs(L)
    n = E.bandpass(E.noise(L), 1500, 9000) * 0.25
    drops = (np.abs(E.noise(L)) > 3.0) * E.noise(L) * 0.5
    return (n + E.highpass(drops, 2500)) * np.minimum(t / 0.4, 1) * np.minimum((L - t) / 0.4, 1)


def siren(L=2.0):
    t = E.secs(L)
    f = 700 + 250 * np.sign(np.sin(2 * np.pi * 2 * t))
    return E.lowpass(np.sign(np.sin(np.cumsum(f) / E.SR * 2 * np.pi)), 2500) * 0.12 * np.minimum((L - t) / 0.05, 1)


def glock(note, L=1.0):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 4.07 * t) * np.exp(-t * 9)) * np.exp(-t * 3.5) * 0.3


def slap(note, L):
    t = E.secs(L)
    f = E.midi(note)
    s = E.saw(f, t) * 0.6 + np.sin(2 * np.pi * f * t)
    a = np.exp(-t * 25)
    s = E.lowpass(s, 3400) * a + E.lowpass(s, 900) * (1 - a)
    return np.tanh(s * np.exp(-t * 6) * 2.0) * 0.45


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=170, drive=2.0)
C = E.clap()
H = E.hat()
HO = E.hat(open_=True)
MIN = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 56, 59, 64]]  # Am7 Fmaj7 G7 E
MAJ = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67]]  # Cmaj7 Am7 Fmaj7 G
BASS_RIFF = [0, None, 0, 12, None, 0, 10, 12, 0, None, 0, 7, None, 10, 12, None]


def chords(t0, ch, gain=0.45, stab=False):
    for k, n in enumerate(ch):
        if stab:
            for s in (2, 6, 10, 14):
                bus.add(E.pluck(n, STEP * 1.5, 4500), t0 + s * STEP, gain * 0.9, pan=(k - 1.5) * 0.2, rev=0.25, duck=True)
        else:
            bus.add(E.ep(n, BAR * 0.95), t0 + k * 0.015, gain, pan=(k - 1.5) * 0.15, rev=0.3, duck=True)


def funk(t0, nbars, prog):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        chords(tb, ch)
        for q in range(4):
            bus.add(K, tb + q * BEAT, 0.85)
            kicks.append(tb + q * BEAT)
        for q in (1, 3):
            bus.add(C, tb + q * BEAT, 0.6, rev=0.2)
        for s in range(16):
            bus.add(HO if s % 4 == 2 else H, tb + s * STEP, 0.25 if s % 4 == 2 else (0.3 if s % 2 else 0.15), pan=0.2)
        root = ch[0] - 24
        for s, o in enumerate(BASS_RIFF):
            if o is not None:
                bus.add(slap(root + o, STEP * 0.9), tb + s * STEP, 0.7)


def house(t0, nbars, prog):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        chords(tb, ch, 0.5, stab=True)
        bus.add(E.pad(ch, BAR, cutoff=2500), tb, 0.35, rev=0.3, duck=True)
        for q in range(4):
            bus.add(K, tb + q * BEAT, 0.95)
            kicks.append(tb + q * BEAT)
            bus.add(HO, tb + q * BEAT + BEAT / 2, 0.3, pan=0.2)
        for q in (1, 3):
            bus.add(C, tb + q * BEAT, 0.65, rev=0.2)
        for s in range(16):
            bus.add(H, tb + s * STEP, 0.12, pan=-0.2)
        root = ch[0] - 24
        for q in range(4):
            bus.add(E.bass808(root, BEAT * 0.45, drive=1.8), tb + q * BEAT + BEAT / 2, 0.55)


# 0–2 : alerte
bus.add(siren(2.0), 0.0, 1.0)
bus.add(rainbed(2.1), 0.0, 0.6)
bus.add(thunder(1.6), 0.45, 1.0)
bus.add(thunder(1.0), 1.2, 0.8)
bus.add(E.pad([45, 52, 57, 60], 2.0, cutoff=900), 0.0, 0.5, rev=0.4)
bus.add(E.whoosh(0.4, up=True), 1.6, 0.4)

# 2–4 : jingle météo télé
for k, n in enumerate([72, 76, 79, 84, 79, 84, 88]):
    bus.add(glock(n), 2.0 + k * STEP * 1.5, 0.6, pan=(k % 2 - 0.5) * 0.4, rev=0.4)
chords(2.0, [60, 64, 67, 71], 0.5)
chords(3.0, [62, 65, 69, 72], 0.5)
bus.add(E.riser(1.0, 400, 8000, (300, 900)), 3.0, 0.3)

# 4–16 : funk en mineur + intempéries
funk(4.0, 6, MIN)
bus.add(rainbed(15.0), 4.0, 0.35)
for t, g in ((7.25, 1.0), (8.5, 0.7), (14.0, 0.9)):
    bus.add(thunder(), t, g)
bus.add(E.pad([57, 64, 69], 3.0, cutoff=700, attack=0.8), 10.0, 0.5, rev=0.5)
for t in (13.0, 14.5):
    bus.add(E.whoosh(1.2, up=True), t, 0.6)
for t in (4.0, 7.0, 10.0, 13.0):
    bus.add(glock(84), t, 0.4, rev=0.4)

# 16–19 : prévisions, tension
for k in range(5):
    bus.add(E.pluck(69 - k, 0.3, 2500), 16.1 + k * BEAT / 2, 0.5, rev=0.3)
bus.add(E.pad([45, 52, 55, 60], 3.0, cutoff=1100, attack=0.5), 16.0, 0.5, rev=0.4)
bus.add(thunder(1.4), 17.5, 0.8)
bus.add(thunder(1.0), 18.5, 0.6)
for k in range(8):
    bus.add(E.snare(), 18.0 + k * STEP, 0.2 + 0.08 * k)
bus.add(E.riser(1.0, 300, 10000, (200, 1600)), 18.0, 0.45)

# 19–25 : le soleil — house en majeur
bus.add(E.impact(), 19.0, 0.7)
house(19.0, 3, MAJ)
for k, n in enumerate([84, 88, 91, 96]):
    bus.add(glock(n, 1.4), 19.2 + k * 0.1, 0.5, rev=0.5)
bus.add(E.reverse_cymbal(1.0), 24.0, 0.5)

# 25–30 : fin
house(25.0, 2, MAJ[:1] + MAJ[3:])
bus.add(E.impact(1.6), 25.0, 0.5)
chords(29.0, [60, 64, 67, 72], 0.5)
bus.add(glock(96, 1.5), 29.0, 0.5, rev=0.5)

music = bus.render(kicks, duck_depth=0.45, fade_out=0.9)

SFX = [
    (26.0, "pop.mp3", -2, 0.0),
    (25.75, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
