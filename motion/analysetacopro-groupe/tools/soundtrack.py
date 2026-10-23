"""Bande-son de « LE GROUPE DE LA COPRO » : amapiano originale, 112 BPM, mi bémol mineur → la bémol majeur.

0–15 s     le groupe des Lilas : amapiano (log drum, shaker, piano jazzy) ; « ping » à chaque message,
           note vocale (6 s), clavier (12 s), refus de quitter le groupe (14 s)
15,2–19,3  les PV d'AG : beat filtré, surligneur à chaque résolution
19,3–24    Résidence Bellevue : retour du groove, en majeur, plus lumineux
24–30      fin
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 112
BAR = BEAT * 4
STEP = BAR / 16
DUR = 30.0
MSG = [0.9, 1.9, 3.9, 6.0, 8.2, 9.1, 9.5, 9.9, 10.7]
GOOD = [19.7, 20.7, 21.7, 22.7]


def log_drum(note, L=0.45):
    """Le « log drum » de l'amapiano : sinus qui plonge, saturé, avec un clic boisé."""
    t = E.secs(L)
    f = E.midi(note) * (1 + 0.9 * np.exp(-t * 40))
    s = np.sin(np.cumsum(f) / E.SR * 2 * np.pi)
    return np.tanh(s * 2.2 * np.exp(-t * 5)) * 0.55 + E.bandpass(E.noise(L), 1500, 5000) * np.exp(-t * 120) * 0.2


def shaker(L=0.06):
    t = E.secs(L)
    return E.highpass(E.noise(L), 6000) * np.exp(-t * 60) * 0.25


def ping(note=88):
    t = E.secs(0.35)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 14) * 0.25


def typing(L):
    out = np.zeros(int(L * E.SR))
    for k in range(int(L / 0.05)):
        t = E.secs(0.03)
        c = E.bandpass(E.noise(0.03), 2000, 7000) * np.exp(-t * 200) * (0.25 + 0.15 * ((k * 7) % 3))
        i = int(k * 0.05 * E.SR)
        out[i : i + len(c)] += c[: len(out) - i]
    return out


def babble(L=2.0):
    """Note vocale étouffée (formants qui changent, filtrée comme un haut-parleur de téléphone)."""
    out = np.zeros(int(L * E.SR))
    vowels = "aeoiaoea"
    for k in range(int(L / 0.16)):
        s = E.vox(vowels[k % len(vowels)], 52 + (k * 5) % 7, 0.16)
        i = int(k * 0.16 * E.SR)
        out[i : i + len(s)] += s[: len(out) - i]
    return E.bandpass(out, 350, 3200) * 0.9


def highlighter(L=0.25):
    t = E.secs(L)
    return E.bandpass(E.noise(L), 1500, 6000) * np.sin(np.pi * t / L) * 0.4


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=150, drive=1.6)
MIN = [[63, 66, 70, 73], [59, 63, 66, 70], [61, 65, 68, 72], [58, 61, 65, 68]]  # E♭m9 B C♯ B♭m
MAJ = [[68, 72, 75, 79], [65, 68, 72, 75], [61, 65, 68, 72], [63, 67, 70, 73]]  # A♭ Fm D♭ E♭
LOG = [0, None, None, 0, None, None, 7, None, 12, None, 10, None, 7, None, 5, None]


def piano(t0, ch, g=0.4):
    for k, n in enumerate(ch):
        bus.add(E.ep(n, BAR * 0.45), t0 + k * 0.012, g, pan=(k - 1.5) * 0.15, rev=0.35, duck=True)


def amapiano(t0, nbars, prog, full=True):
    for b in range(nbars):
        tb = t0 + b * BAR
        ch = prog[b % len(prog)]
        piano(tb, ch)
        piano(tb + 10 * STEP, [n + 12 for n in ch[1:3]], 0.25)
        for q in range(4):
            bus.add(K, tb + q * BEAT, 0.7)
            kicks.append(tb + q * BEAT)
        if not full:
            continue
        bus.add(E.clap(), tb + BEAT, 0.35, rev=0.3)
        bus.add(E.clap(), tb + 3 * BEAT, 0.35, rev=0.3)
        for s in range(16):
            bus.add(shaker(), tb + s * STEP, 0.6 if s % 2 else 0.35, pan=0.3)
        root = ch[0] - 24
        for s, o in enumerate(LOG):
            if o is not None:
                bus.add(log_drum(root + o), tb + s * STEP, 0.8)


# 0–15,2 : le groupe des Lilas
bus.add(E.pad([51, 58, 63, 66], BAR * 0.5, cutoff=1500), 0.0, 0.35, rev=0.4)
amapiano(0.0, 7, MIN)
for k, t in enumerate(MSG):
    bus.add(ping(88 if k % 2 else 91), t, 0.8, pan=-0.1)
bus.add(babble(2.0), 6.2, 0.55, pan=0.1)
bus.add(typing(1.0), 12.0, 0.8, pan=0.2)
bus.add(ping(84), 13.0, 0.8)
bus.add(E.impact(1.4), 14.0, 0.8)
bus.add(E.kick(L=0.5, top=120, drive=2.4), 14.0, 0.8)
for k in range(3):
    bus.add(ping(70 - k * 3), 14.05 + k * 0.12, 0.5)

# 15,2–19,3 : les PV d'AG (groove filtré)
amapiano(15.0, 2, MIN[:2], full=False)
bus.add(E.pad([51, 54, 58, 63], 4.1, cutoff=900, attack=0.4), 15.2, 0.4, rev=0.5)
for k in range(4):
    bus.add(highlighter(), 15.7 + k * BEAT * 1.4, 0.8)
bus.add(E.riser(1.2, 400, 9000, (300, 1400)), 18.1, 0.4)

# 19,3–24 : Résidence Bellevue
bus.add(E.impact(1.2), 19.3, 0.5)
amapiano(19.3, 2, MAJ)
amapiano(19.3 + 2 * BAR, 1, MAJ[2:3])
for k, t in enumerate(GOOD):
    bus.add(ping(91 + 2 * k), t, 0.8)

# 24–30 : fin
bus.add(E.impact(1.6), 24.0, 0.5)
amapiano(24.0, 2, MAJ[:1] + MAJ[3:])
bus.add(E.pad([56, 63, 68, 72, 75], DUR - 24.0 - 2 * BAR, cutoff=2400), 24.0 + 2 * BAR, 0.4, rev=0.5)

music = bus.render(kicks, duck_depth=0.3, fade_out=0.9)

SFX = [
    (24.9, "pop.mp3", -2, 0.0),
    (24.65, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
