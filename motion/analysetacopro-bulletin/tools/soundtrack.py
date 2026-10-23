"""Bande-son de « LE BULLETIN DE NOTES » : UK drill originale, 140 BPM, fa dièse mineur → la majeur.

0–2,57 s    sonnerie d'école + craie (l'accroche est déjà à l'écran)
2,57–12,9   le beat drill tombe ; chaque note = coup de stylo + cercle griffonné
12,86       tampon « REDOUBLE »
14,6–16,3   le bulletin part : silence, chœur
16,3–24     le bon bulletin : drill en majeur, cloches, tampon doré (20,75)
24–30       fin
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
G0 = BAR * 1.5
AV1 = G0 + 5 * BAR
ST1 = AV1 + BAR
OUT = ST1 + BAR
IN2 = OUT + BAR
AV2 = IN2 + 0.4 + 5 * BEAT + 0.2
ST2 = AV2 + BAR


def school_bell(L=2.2):
    t = E.secs(L)
    tone = np.sin(2 * np.pi * 1180 * t) + 0.6 * np.sin(2 * np.pi * 2710 * t) + 0.3 * np.sin(2 * np.pi * 3900 * t)
    clapper = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 24 * t))
    return tone * clapper * np.minimum(t / 0.01, 1) * np.minimum((L - t) / 0.15, 1) * 0.16


def chalk(L=0.5):
    t = E.secs(L)
    jitter = (np.abs(E.noise(L)) > 1.2).astype(float)
    return E.bandpass(E.noise(L) * (0.4 + jitter), 2500, 9000) * np.sin(np.pi * t / L) * 0.5


def pen(L=0.12):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 1800, 7000) * np.exp(-t * 25) * 0.8


def scribble(L):
    t = E.secs(L)
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 14 * t) ** 2
    return E.bandpass(E.noise(L), 2000, 8000) * am * np.sin(np.pi * t / L) * 0.4


def stamp():
    t = E.secs(0.5)
    thud = E.phase_sine(60 + 120 * np.exp(-t * 40)) * np.exp(-t * 14)
    slap = E.bandpass(E.noise(0.5), 300, 3000) * np.exp(-t * 45) * 0.6
    return np.tanh((thud + slap) * 2.0) * 0.9


def bell(note, L=1.0):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)) * np.exp(-t * 3.5) * 0.3



bus = E.Bus(DUR)
kicks = []
K = E.kick(top=200, drive=2.4)
SN = E.snare(L=0.3, tone=210, crack=1.2)
H = E.hat(0.05)
MINOR = [[54, 57, 61], [50, 54, 57], [52, 56, 59], [49, 53, 56]]  # F#m D E C#
MAJOR = [[57, 61, 64], [54, 57, 61], [50, 54, 57], [52, 56, 59]]  # A F#m D E
MEL_MIN = [66, None, 69, 68, None, 66, 64, None, 66, None, 61, None, 64, 66, None, None]
MEL_MAJ = [69, None, 73, 76, None, 73, 71, None, 69, None, 76, None, 74, 73, None, None]
# drill : kicks épars, caisse sur le 3e temps (+ fantôme), charleston en triolets par moments
KICK_STEPS = (0, 7, 10)
SN_STEPS = (8,)


def drill(t0, nbars, prog, mel, bright=False):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        bus.add(E.pad(ch, BAR, cutoff=2600 if bright else 1500, attack=0.05), tb, 0.4, rev=0.35, duck=True)
        for s, n in enumerate(mel):
            if n is not None:
                bus.add(bell(n, 0.5), tb + s * STEP, 0.35, pan=0.2, rev=0.3, duck=True)
        for s in KICK_STEPS:
            bus.add(K, tb + s * STEP, 0.8)
            kicks.append(tb + s * STEP)
        for s in SN_STEPS:
            bus.add(SN, tb + s * STEP, 0.8, rev=0.2)
        if b % 2 == 1:
            bus.add(SN, tb + 15 * STEP, 0.35)
        for s in range(16):
            if b % 2 == 1 and s >= 12:
                continue
            bus.add(H, tb + s * STEP, 0.3 if s % 2 == 0 else 0.15, pan=0.25)
        if b % 2 == 1:
            for k in range(6):
                bus.add(E.hat(0.035, tone=1.1), tb + 12 * STEP + k * STEP * 2 / 3, 0.18 + 0.04 * k, pan=-0.25)
        root = ch[0] - 24
        # 808 glissante
        bus.add(E.bass808(root, STEP * 6.6, drive=2.6), tb, 0.75)
        bus.add(E.bass808(root + 3, STEP * 2.8, glide_from=root, drive=2.6, glide=0.05), tb + 7 * STEP, 0.7)
        bus.add(E.bass808(root - 2 if b % 2 else root, STEP * 5.6, glide_from=root + 3, drive=2.6, glide=0.06), tb + 10 * STEP, 0.7)


# 0–2,57 : sonnerie + craie
bus.add(school_bell(2.2), 0.0, 1.0, rev=0.25)
bus.add(chalk(0.45), 0.9, 0.7)
bus.add(chalk(0.35), 1.45, 0.6)
bus.add(E.pad([54, 57, 61], G0, cutoff=900, attack=0.4), 0.0, 0.4, rev=0.4)
bus.add(E.riser(0.9, 300, 8000, (200, 1200)), G0 - 0.9, 0.35)
bus.add(E.vox("a", 54, 0.35), G0 - 0.35, 0.4, rev=0.3)

# 2,57–14,6 : drill en mineur, une note par mesure
drill(G0, 7, MINOR, MEL_MIN)
for k in range(5):
    t = G0 + k * BAR
    bus.add(pen(), t + BAR * 0.25, 0.9)
    bus.add(scribble(BAR * 0.3), t + BAR * 0.4, 0.6, pan=0.15)
    bus.add(scribble(BAR * 0.4), t + BAR * 0.45, 0.25, pan=-0.15)
bus.add(pen(), AV1 + BEAT, 1.0)
bus.add(E.reverse_cymbal(0.7), ST1 - 0.7, 0.45)
bus.add(stamp(), ST1, 1.0)
bus.add(E.impact(1.6), ST1, 0.6)

# 14,6–16,3 : le bulletin part
bus.add(E.pad([54, 57, 61, 66], BAR, cutoff=1300, attack=0.2), OUT, 0.55, rev=0.5)
bus.add(E.whoosh(0.6, up=True), OUT + BAR * 0.55, 0.6)
bus.add(E.riser(0.9, 300, 10000, (200, 1600)), IN2 - 0.9, 0.4)
bus.add(E.whoosh(0.5, up=False), IN2, 0.5)

# 16,3–24 : drill en majeur, le bon bulletin
drill(IN2, 5, MAJOR, MEL_MAJ, bright=True)
for k in range(5):
    t = IN2 + 0.4 + k * BEAT
    bus.add(pen(), t + BEAT * 0.4, 0.8)
    bus.add(bell(81 + [0, 4, 7, 12, 16][k], 0.6), t + BEAT * 0.4, 0.45, rev=0.3)
bus.add(pen(), AV2 + BEAT, 0.9)
bus.add(E.reverse_cymbal(0.7), ST2 - 0.7, 0.45)
bus.add(stamp(), ST2, 1.0)
for k, n in enumerate([81, 85, 88, 93]):
    bus.add(bell(n + 12, 1.4), ST2 + k * 0.07, 0.4, rev=0.5)
bus.add(E.pad([57, 61, 64, 69], BAR * 2, cutoff=3000, attack=0.1), ST2, 0.4, rev=0.5)

# 24–30 : fin
bus.add(E.impact(1.8), 24.0, 0.6)
drill(24.0, 3, MAJOR[:2], MEL_MAJ, bright=True)
bus.add(E.pad([57, 61, 64, 69], 1.0, cutoff=2500), 24.0 + 3 * BAR, 0.5, rev=0.6)
bus.add(school_bell(0.8), 24.0 + 3 * BAR, 0.5, rev=0.4)

music = bus.render(kicks, duck_depth=0.4, fade_out=0.8)

SFX = [
    (ST2 + 0.05, "sparkle.mp3", -2, 0.0),
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
