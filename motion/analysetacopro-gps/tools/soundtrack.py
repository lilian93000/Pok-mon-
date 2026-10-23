"""Bande-son de « GPS » : synthwave de nuit originale, 100 BPM, mi mineur → sol majeur.

0–2,4 s     accroche : nappe + pulsation, « ding-dong » d'alerte
2,4–9,6     on roule : batterie synthwave, basse arpégée ; chaque alerte = carillon + coup sourd
9,6–12      route barrée : alarme, freinage, choc (11,8)
12–13,2     recalcul : arrêt de bande, glitch
13,2–24     nouvel itinéraire : le beat repart en majeur, carillons de validation, arrivée (21,6)
24–30       fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT, BAR, DUR = 0.6, 2.4, 30.0
STEP = BAR / 16


def chime(notes, gap=0.16, L=0.9):
    out = np.zeros(int((gap * len(notes) + L) * E.SR))
    for k, n in enumerate(notes):
        t = E.secs(L)
        f = E.midi(n)
        s = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2 * t)) * np.exp(-t * 4.5) * 0.28
        i = int(k * gap * E.SR)
        out[i : i + len(s)] += s
    return out


def gated_snare():
    s = E.snare(L=0.45, tone=190, crack=1.3)
    t = E.secs(0.45)
    tail = E.bandpass(E.noise(0.45), 800, 7000) * (t < 0.22) * 0.35
    return s + tail


def arp_bass(t0, root, bars=1):
    for s in range(16 * bars):
        n = root + (0, 12, 7, 12)[s % 4]
        bus.add(E.pluck(n, STEP * 0.9, 1600), t0 + s * STEP, 0.55, duck=True)


def alarm(L=2.2):
    t = E.secs(L)
    f = np.where((t * 4) % 1 < 0.5, 880, 660)
    return E.lowpass(np.sign(np.sin(np.cumsum(f) / E.SR * 2 * np.pi)), 3000) * 0.1


def brake(L=0.9):
    t = E.secs(L)
    f = 2400 - 1200 * t / L
    return E.bandpass(E.noise(L), 1500, 5000) * 0.25 + np.sin(np.cumsum(f) / E.SR * 2 * np.pi) * 0.06 * np.sin(np.pi * t / L)


def glitch(L=0.6):
    t = E.secs(L)
    sq = np.sign(np.sin(2 * np.pi * (200 + 1800 * ((t * 20) % 1)) * t))
    return E.lowpass(sq, 4000) * (np.sin(2 * np.pi * 16 * t) > 0) * 0.15


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=150, drive=1.9)
SN = gated_snare()
H = E.hat(0.05)
MIN = [52, 48, 55, 50]  # Em C G D
MAJ = [55, 52, 48, 50]  # G Em C D
CH = {52: [64, 67, 71], 48: [60, 64, 67], 55: [62, 67, 71], 50: [62, 66, 69]}


def drive(t0, nbars, roots, lead=None):
    for b in range(nbars):
        tb = t0 + b * BAR
        r = roots[b % len(roots)]
        bus.add(E.pad(CH[r], BAR, cutoff=2200, attack=0.15), tb, 0.35, rev=0.4, duck=True)
        arp_bass(tb, r - 12)
        for q in range(4):
            bus.add(K if q % 2 == 0 else K, tb + q * BEAT, 0.85 if q % 2 == 0 else 0.6)
            kicks.append(tb + q * BEAT)
        for q in (1, 3):
            bus.add(SN, tb + q * BEAT, 0.7, rev=0.45)
        for s in range(0, 16, 2):
            bus.add(H, tb + s * STEP, 0.18, pan=0.25)
        if lead:
            for k, n in enumerate(lead[b % len(lead)]):
                if n is not None:
                    bus.add(E.supersaw([n], BEAT * 0.9, cutoff=3500), tb + k * BEAT, 0.3, pan=-0.1, rev=0.35, duck=True)


# 0–2,4 : accroche
bus.add(E.pad([52, 59, 64, 67], BAR, cutoff=1400, attack=0.4), 0.0, 0.45, rev=0.5)
arp_bass(0.0, 40)
bus.add(chime([79, 76, 79, 76], 0.18), 0.1, 0.8, rev=0.3)
bus.add(E.riser(1.0, 400, 8000, (300, 1000)), BAR - 1.0, 0.3)

# 2,4–9,6 : on roule
drive(BAR, 3, MIN, lead=[[71, None, 74, 76], [72, None, 71, 67], [74, None, 71, 69]])
for t in (2.4, 4.8, 7.2):
    bus.add(chime([84, 79], 0.16), t, 0.9, rev=0.25)
    bus.add(E.impact(1.0), t + 0.15, 0.5)

# 9,6–12 : route barrée
drive(9.6, 1, [48])
bus.add(alarm(2.2), 9.6, 1.0)
bus.add(brake(), 10.9, 0.9)
bus.add(E.impact(1.6), 11.8, 0.9)
bus.add(E.kick(L=0.6, top=120, drive=2.6), 11.8, 0.9)

# 12–13,2 : recalcul
bus.add(glitch(0.9), 12.0, 1.0)
bus.add(E.pad([52, 55, 59], 1.2, cutoff=900), 12.0, 0.4, rev=0.5)
bus.add(E.reverse_cymbal(0.8), 13.2 - 0.8, 0.5)

# 13,2–24 : nouvel itinéraire (majeur)
bus.add(chime([79, 83, 86], 0.12), 13.2, 0.8, rev=0.3)
bus.add(E.pad([55, 62, 67, 71], 0.8, cutoff=2500), 13.2, 0.4, rev=0.4)
bus.add(E.riser(1.4, 300, 9000, (200, 1500)), 14.0, 0.35)
drive(14.4, 4, MAJ, lead=[[74, None, 79, 78], [76, None, 74, 71], [72, None, 76, 79], [78, None, 81, 83]])
bus.add(chime([86, 91], 0.12), 15.4, 0.7, rev=0.3)
for t in (16.8, 18.8, 20.8):
    bus.add(chime([83, 88], 0.12), t, 0.7, rev=0.25)
bus.add(chime([79, 83, 86, 91, 95], 0.1, 1.4), 21.6, 0.9, rev=0.4)
drive(24.0 - BAR, 1, [50])

# 24–30 : fin
bus.add(E.impact(1.8), 24.0, 0.6)
drive(24.0, 2, [55, 50], lead=[[79, None, 83, 86], [86, None, 83, 79]])
bus.add(E.pad([55, 62, 67, 71, 74], DUR - 28.8, cutoff=2600), 28.8, 0.45, rev=0.5)
bus.add(chime([91, 95], 0.12, 1.5), 28.8, 0.6, rev=0.5)

music = bus.render(kicks, duck_depth=0.4, fade_out=0.9)
a = int(12.0 * E.SR)
if music.ndim == 2:
    seg = music[a:].copy()
    rate = np.linspace(1, 0, int(0.5 * E.SR)) ** 1.3
    pos = np.cumsum(rate)
    for c in range(2):
        music[a : a + len(rate), c] = np.interp(pos, np.arange(len(seg)), seg[:, c])
    # le silence qui suit est rempli par le glitch rejoué plus bas
    music[a + len(rate) : int(13.2 * E.SR)] *= 0.0

SFX = [
    (12.55, "glitch-2.mp3", -2, 0.0),
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
