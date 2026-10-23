"""Bande-son de « L'ADDITION » : boom bap original, 96 BPM, la mineur → do majeur.

0–2,5 s    imprimante à aiguilles seule (l'accroche est déjà à l'écran)
2,5–11,25  le beat tombe ; chaque coût caché = rafale d'imprimante + « ka-ching »
11,25      tampon « +52 000 € » : coup sourd + impact
12,5–15    « Ça, personne ne te l'a dit » : beat filtré, piano seul
15         le ticket se déchire
17,5–25    ticket AnalyseTaCopro : le beat revient en majeur, cloches à chaque ligne
25–30      fin : logo, CTA
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT, BAR, DUR = 0.625, 2.5, 30.0
STEP = BAR / 16
SWING = STEP * 0.18


def sw(s):
    """Position d'un pas de 16e avec un swing façon MPC."""
    return s * STEP + (SWING if s % 2 else 0.0)


# ---------- Bruitages synthétisés ----------
def printer(L=0.22):
    """Imprimante à aiguilles : train d'impacts métalliques rapides."""
    t = E.secs(L)
    n = E.noise(L)
    train = (np.sin(2 * np.pi * 220 * t) > 0.6).astype(float) * (0.6 + 0.4 * (np.sin(2 * np.pi * 37 * t) > 0))
    s = E.bandpass(n * train, 1500, 7000) + E.bandpass(n, 300, 900) * 0.15
    return s * np.minimum(t / 0.004, 1) * np.minimum((L - t) / 0.01, 1) * 0.9


def kaching():
    """Caisse enregistreuse : le tiroir puis la cloche."""
    L = 1.1
    t = E.secs(L)
    drawer = E.bandpass(E.noise(L), 200, 2000) * np.exp(-t * 30) * 0.5
    bell = np.zeros_like(t)
    tb = np.maximum(t - 0.07, 0)
    for f, g in ((2637, 1.0), (3520, 0.7), (5280, 0.35), (7040, 0.2)):
        bell += np.sin(2 * np.pi * f * tb) * g * np.exp(-tb * (5 + f / 1500))
    return drawer + bell * (t >= 0.07) * 0.32


def rip(L=0.85):
    """Papier déchiré : crépitements filtrés qui accélèrent."""
    t = E.secs(L)
    n = E.noise(L)
    grain = (np.abs(E.noise(L)) > 1.5).astype(float)
    crack = E.bandpass(n * (0.3 + grain), 1200, 9000)
    env = np.sin(np.pi * np.clip(t / L, 0, 1)) ** 0.6 * (0.6 + 0.4 * np.sin(2 * np.pi * (8 + 30 * t) * t))
    return crack * env * 0.8


def stamp():
    t = E.secs(0.5)
    thud = E.phase_sine(60 + 120 * np.exp(-t * 40)) * np.exp(-t * 14)
    slap = E.bandpass(E.noise(0.5), 300, 3000) * np.exp(-t * 45) * 0.6
    return np.tanh((thud + slap) * 2.0) * 0.9


def bell(note, L=0.8):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)) * np.exp(-t * 4) * 0.3


def dusty(x):
    """Couleur « échantillon de vinyle » : bande passante réduite + légère saturation."""
    return np.tanh(E.lowpass(E.highpass(x, 120), 4200) * 1.4)


# ---------- Musique ----------
bus = E.Bus(DUR)
kicks = []
K = E.kick(L=0.45, top=150, low=48, punch=30, drive=1.8)
S = E.snare(L=0.35, tone=180, crack=1.1)
H = E.hat(0.05, tone=0.8)
HO = E.hat(open_=True, tone=0.8)
MINOR = [[57, 60, 64, 67], [53, 57, 60, 64], [50, 53, 57, 60], [52, 56, 59, 62]]  # Am7 Fmaj7 Dm7 E7
MAJOR = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]]  # Cmaj7 Am7 Fmaj7 G7
VINYL = E.highpass(E.noise(DUR), 2000) * 0.004 + (np.abs(E.noise(DUR)) > 3.6) * E.noise(DUR) * 0.04


def keys(t0, chord, gain=0.55, rev=0.35):
    for k, n in enumerate(chord):
        bus.add(dusty(E.ep(n, BAR * 0.95)), t0 + k * 0.018, gain, pan=(k - 1.5) * 0.15, rev=rev)


def boombap(t0, nbars, chords, full=True, roll=False):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = chords[b % len(chords)]
        keys(tb, ch)
        if b % 2 == 1:
            keys(tb + sw(10), [n + 12 for n in ch[1:3]], 0.3)
        if not full:
            continue
        for s in (0, 7, 10):
            bus.add(K, tb + sw(s), 0.95)
            kicks.append(tb + sw(s))
        for s in (4, 12):
            bus.add(S, tb + sw(s), 0.75, rev=0.18)
        for s in range(0, 16, 2):
            bus.add(H, tb + sw(s), 0.3, pan=0.2)
        for s in range(1, 16, 2):
            bus.add(H, tb + sw(s), 0.14, pan=-0.2)
        bus.add(HO, tb + sw(14), 0.18, pan=0.3)
        root = ch[0] - 24
        bus.add(E.bass808(root, BAR * 0.42, drive=1.6), tb, 0.6)
        bus.add(E.bass808(root, BAR * 0.3, drive=1.6), tb + sw(10), 0.55)
        if roll and b == nbars - 1:
            for k in range(4):
                bus.add(S, tb + sw(12) + k * STEP / 2, 0.25 + 0.1 * k)


# 0–2,5 : accroche — imprimante + vinyle + petite montée
for k in range(5):
    bus.add(printer(0.12), 0.3 + k * 0.1, 0.8, pan=0.1)
bus.add(dusty(E.ep(57, 2.0)), 0.0, 0.4, rev=0.4)
bus.add(dusty(E.ep(64, 2.0)), 0.02, 0.3, rev=0.4)
bus.add(E.riser(1.2, 300, 6000, (200, 800)), 1.3, 0.25)
bus.add(S, 2.5 - STEP, 0.4)

# 2,5–12,5 : le beat
boombap(2.5, 4, MINOR, roll=True)
for k in range(7):
    t = BAR + k * BAR / 2
    bus.add(printer(), t, 0.7, pan=0.1)
    bus.add(kaching(), t + 0.1, 0.55 + 0.04 * k, pan=-0.1 + 0.03 * k, rev=0.15)
bus.add(printer(0.15), 10.25, 0.6)
bus.add(printer(), 10.625, 0.7)
bus.add(E.reverse_cymbal(0.8), 11.25 - 0.8, 0.5)
bus.add(stamp(), 11.25, 1.0)
bus.add(E.impact(1.6), 11.25, 0.6)

# 12,5–15 : creux — piano seul, beat filtré au loin
keys(12.5, MINOR[0], 0.6, rev=0.5)
for s in (0, 7, 10):
    bus.add(E.lowpass(K, 300), 12.5 + sw(s), 0.5)
bus.add(E.lowpass(S, 900), 12.5 + sw(4), 0.4)
bus.add(E.lowpass(S, 900), 12.5 + sw(12), 0.4)
bus.add(E.riser(1.4, 300, 9000, (200, 1400)), 13.6, 0.35)

# 15 : déchirement
bus.add(rip(), 15.0, 1.0, pan=0.0)
bus.add(E.impact(2.0), 15.0, 0.7)
bus.add(E.whoosh(0.8, up=False), 15.05, 0.5)
keys(15.0 + BEAT * 2, [57, 60, 64], 0.35, rev=0.6)

# 17,5–25 : ticket AnalyseTaCopro, le beat revient en majeur
boombap(17.5, 3, MAJOR)
for k in range(10):
    t = 17.5 + k * BEAT * 0.5
    bus.add(printer(0.15), t, 0.55, pan=0.1)
    if k in (3, 4, 5, 6):
        bus.add(bell(84 + [0, 4, 7, 12][k - 3], 0.6), t + 0.08, 0.5, rev=0.3)
bus.add(kaching(), 17.5 + 9 * BEAT * 0.5, 0.7, rev=0.3)
for k, n in enumerate([72, 76, 79, 84]):
    bus.add(bell(n + 12, 1.2), 20.4 + k * 0.08, 0.35, rev=0.4)
bus.add(E.reverse_cymbal(1.0), 25.0 - 1.0, 0.5)

# 25–30 : fin
boombap(25.0, 2, MAJOR[:1] + MAJOR[3:])
bus.add(E.impact(2.0), 25.0, 0.6)
bus.add(E.bass808(36, 2.0, drive=1.6), 28.75, 0.5)
keys(28.75, [60, 64, 67, 71, 74], 0.5, rev=0.6)

music = bus.render(kicks, duck_depth=0.35, fade_out=0.9)
music += VINYL[: len(music)][:, None] if music.ndim == 2 else VINYL[: len(music)]

SFX = [
    (26.25, "pop.mp3", -2, 0.0),
    (26.55, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
