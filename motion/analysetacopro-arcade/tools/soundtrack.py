"""Bande-son de « GAME OVER » : chiptune originale (façon console 8 bits), 120 BPM, do majeur.

0–2 s      écran titre : fanfare
2–7,4      1er essai : thème de niveau ; 3,5 / 5,5 dégâts ; 7,35 chute
8–10       jingle de game over
10–12      compte à rebours, pièce insérée
12–14      power-up : arpèges montants
14–20      2e essai : le thème passe en fa majeur, mêlé à une batterie trap ; sauts, bonus, drapeau
20–22      fanfare de fin de niveau
22–26      meilleurs scores (chiptune + beat lo-fi)
26–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT, BAR, DUR = 0.5, 2.0, 30.0
E8 = BEAT / 2


# ---------- Puces sonores ----------
def pulse(note, L, duty=0.25, decay=3.0, vib=0.0):
    t = E.secs(L)
    f = E.midi(note) * (1 + vib * np.sin(2 * np.pi * 6 * t))
    ph = np.cumsum(f) / E.SR % 1.0
    s = np.where(ph < duty, 1.0, -1.0)
    env = np.minimum(t / 0.003, 1) * np.exp(-t * decay) * np.minimum((L - t) / 0.01, 1)
    return s * env * 0.22


def tri(note, L):
    t = E.secs(L)
    ph = (E.midi(note) * t) % 1.0
    s = 4 * np.abs(ph - 0.5) - 1
    s = np.round(s * 8) / 8  # pas de 4 bits
    return s * np.minimum((L - t) / 0.01, 1) * 0.35


def nkick():
    t = E.secs(0.18)
    f = 180 * np.exp(-t * 25) + 50
    ph = np.cumsum(f) / E.SR % 1.0
    return np.where(ph < 0.5, 1.0, -1.0) * np.exp(-t * 18) * 0.45


def nsnare():
    t = E.secs(0.16)
    n = np.sign(E.noise(0.16)) * 0.5
    n = np.repeat(n[::6], 6)[: len(t)]  # bruit « basse résolution »
    return n * np.exp(-t * 22) * 0.5


def nhat():
    t = E.secs(0.05)
    n = np.repeat(np.sign(E.noise(0.05))[::2], 2)[: len(t)]
    return n * np.exp(-t * 80) * 0.18


def sweep(f0, f1, L, duty=0.5, decay=2.0):
    t = E.secs(L)
    f = f0 * (f1 / f0) ** (t / L)
    ph = np.cumsum(f) / E.SR % 1.0
    return np.where(ph < duty, 1.0, -1.0) * np.exp(-t * decay) * np.minimum((L - t) / 0.01, 1) * 0.25


def seq(notes, step, L=None, duty=0.25, decay=4.0):
    out = np.zeros(int((len(notes) * step + 0.6) * E.SR))
    for k, n in enumerate(notes):
        if n is None:
            continue
        p = pulse(n, L or step * 0.95, duty, decay)
        i = int(k * step * E.SR)
        out[i : i + len(p)] += p
    return out


def coin():
    return np.concatenate([pulse(83, 0.07, 0.5, 0), pulse(88, 0.32, 0.5, 6)])


def hit():
    t = E.secs(0.35)
    n = np.repeat(np.sign(E.noise(0.35))[::8], 8)[: len(t)] * np.exp(-t * 10) * 0.4
    return n + sweep(600, 120, 0.35, 0.5, 4)


MEL = [72, 76, 79, 76, 72, 76, 79, 84, 81, 79, 77, 76, 74, 76, 72, None]
BASS = [48, 48, 53, 55]
bus = E.Bus(DUR)
kicks = []

# 0–2 s : fanfare de l'écran titre
bus.add(seq([72, 72, 72, 76, None, 79, None, 84], E8 / 2, duty=0.5, decay=2), 0.05, 1.0, rev=0.2)
bus.add(seq([60, 64, 67, 72], E8, duty=0.125), 0.05, 0.6, pan=0.3)
bus.add(tri(48, 1.0), 1.0, 1.0)
bus.add(sweep(300, 1600, 0.3), 1.7, 0.6)


def level_theme(t0, bars, shift=0, trap=False):
    for b in range(bars):
        tb = t0 + b * BAR
        half = MEL[(b % 2) * 8 : (b % 2) * 8 + 8]
        bus.add(seq([n + shift if n else None for n in half], E8, duty=0.25, decay=3), tb, 0.9, pan=-0.1, rev=0.15)
        bus.add(seq([n + shift - 12 if n else None for n in half], E8, duty=0.125, decay=5), tb + 0.02, 0.35, pan=0.3)
        for q in range(4):
            bus.add(tri(BASS[q] + shift - 12, BEAT * 0.9), tb + q * BEAT, 1.0)
        for s in range(8):
            bus.add(nhat(), tb + s * E8, 1.0, pan=0.2)
        for off in (0.0, 0.75, 1.0, 1.75):
            bus.add(nkick(), tb + off, 1.0)
        bus.add(nsnare(), tb + BEAT, 1.0)
        bus.add(nsnare(), tb + 3 * BEAT, 1.0)
        if trap:
            K = E.kick(top=210, drive=2.6)
            for s in (0, 6, 10):
                bus.add(K, tb + s * BEAT / 4, 0.85)
                kicks.append(tb + s * BEAT / 4)
            bus.add(E.clap(), tb + BEAT, 0.6, rev=0.25)
            bus.add(E.clap(), tb + 3 * BEAT, 0.6, rev=0.25)
            bus.add(E.bass808(BASS[b % 4] + shift - 12, BAR * 0.9, drive=2.2), tb, 0.45)
            for k in range(6):
                bus.add(E.hat(0.035), tb + 12 * BEAT / 4 + k * BEAT / 6, 0.18 + 0.03 * k, pan=-0.3)


# 2–7,4 s : 1er essai
level_theme(2.0, 3)
for t0 in (3.5, 5.5):
    bus.add(hit(), t0, 1.0)
    bus.add(sweep(900, 300, 0.4, 0.5, 2), t0 + 0.05, 0.6)  # pièces perdues
bus.add(sweep(900, 60, 0.7, 0.5, 0.8), 7.35, 1.0)  # chute

# 8–10 s : game over
bus.add(seq([72, 67, 64, 60, 59, 55, None, 48], 0.22, duty=0.5, decay=1.5), 8.0, 1.0, rev=0.35)
bus.add(tri(36, 1.2), 9.6, 1.0)
# 10–12 s : compte à rebours + pièce
for k in range(4):
    bus.add(pulse(79, 0.1, 0.5, 8), 10 + k * BEAT, 0.9)
bus.add(coin(), 10.9, 1.0)
bus.add(coin(), 11.25, 0.8)
bus.add(nkick(), 11.95, 1.0)
# 12–14 s : power-up
for k in range(16):
    bus.add(pulse(60 + (k * 4) % 24 + (k // 6) * 2, 0.09, 0.5, 6), 12.0 + k * 0.06, 0.7, pan=(k % 2 - 0.5) * 0.4)
bus.add(seq([72, 76, 79, 84, 79, 84, 88, None], E8, duty=0.25, decay=2), 13.0, 0.8, rev=0.3)
bus.add(E.riser(1.0, 800, 12000, (500, 2600)), 13.0, 0.4)
bus.add(E.impact(), 14.0, 0.9)

# 14–20 s : 2e essai (fa majeur + trap)
level_theme(14.0, 3, shift=5, trap=True)
for t0 in (15.25, 17.25, 19.1):
    bus.add(sweep(300, 900, 0.18, 0.5, 4), t0, 0.7)  # saut
for t0 in (16.5, 18.5):
    bus.add(coin(), t0, 0.9)
bus.add(seq([77, 81, 84, 89, 84, 89, 93], 0.05, duty=0.5, decay=6), 19.7, 0.7)  # drapeau

# 20–22 s : fin de niveau
bus.add(seq([72, 76, 79, 84, None, 79, 84, None], E8 / 1.5, duty=0.5, decay=1.5), 20.0, 1.0, rev=0.3)
bus.add(seq([77, 81, 84, 89, None, None, 89, 89, 89, 91], E8 / 1.5, duty=0.5, decay=1.5), 20.8, 1.0, rev=0.3)
bus.add(tri(53, 0.8), 20.8, 1.0)
bus.add(tri(55, 0.6), 21.4, 1.0)

# 22–26 s : meilleurs scores (lo-fi)
for b in range(2):
    tb = 22.0 + b * BAR
    for k, n in enumerate([72, 76, 79, 83, 81, 79, 76, 74]):
        bus.add(pulse(n, E8 * 0.9, 0.125, 5), tb + k * E8, 0.5, pan=0.2, rev=0.4)
    bus.add(tri(48 if b == 0 else 45, BAR * 0.95), tb, 0.8)
    for s in (0, 5):
        bus.add(E.kick(top=150, drive=1.8), tb + s * E8, 0.7)
        kicks.append(tb + s * E8)
    bus.add(E.snare(), tb + BEAT, 0.35, rev=0.3)
    bus.add(E.snare(), tb + 3 * BEAT, 0.35, rev=0.3)
    for s in range(8):
        bus.add(E.hat(), tb + s * E8, 0.2)
for k in range(4):
    bus.add(coin(), 22.5 + k * BEAT, 0.4)

# 26–30 s : fin
level_theme(26.0, 1, shift=0, trap=True)
bus.add(seq([72, 76, 79, 84, 88, None, 84, None], E8, duty=0.5, decay=1.5), 28.0, 1.0, rev=0.4)
bus.add(tri(48, 1.6), 28.0, 1.0)
bus.add(E.impact(1.8), 28.0, 0.6)

music = bus.render(kicks, duck_depth=0.4, fade_out=0.8)

SFX = [
    (27.0, "pop.mp3", -2, 0.0),
    (27.3, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
