"""Bande-son de « L'Affaire n°0347 » : trap noir originale, 90 BPM, la mineur.

1 temps = 0,667 s, 1 mesure = 2,667 s.
0–2,67 s     accroche : vinyle, piano sombre, machine à écrire (une frappe par lettre), « ding »
2,67–16      les faits puis l'enquête : contrebasse, batterie au ralenti, coups de tampon sur chaque indice
16,67        le verdict : impact + accord grave, la batterie s'arrête un temps
18,67–21,33  le détective : bascule en la majeur, cloche
21,33–24     affaire classée : tampon, roulement
24–30        fin : groove complet puis queue de réverb
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 90
BAR = BEAT * 4
STEP = BEAT / 4
DUR = 30.0
HOOK_CHARS = len("Cet appart cachait un secret à 45 000 €.")


def keyclick():
    t = E.secs(0.07)
    return (E.bandpass(E.noise(0.07), 1500, 7000) * np.exp(-t * 90) + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 60) * 0.4) * 0.6


def thud():
    """Coup de tampon / punaise."""
    t = E.secs(0.35)
    body = E.phase_sine(60 + 90 * np.exp(-t * 40)) * np.exp(-t * 14)
    paper = E.bandpass(E.noise(0.35), 400, 4000) * np.exp(-t * 30) * 0.5
    return np.tanh((body + paper) * 2) * 0.8


def marker():
    t = E.secs(0.45)
    return E.sweep_filter(E.noise(0.45), 1200, 5000, 12) * np.sin(np.pi * t / 0.45) * 0.25


def bassnote(note, L=0.9):
    t = E.secs(L)
    f = E.midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6)
    return s * np.minimum(t / 0.006, 1) * np.exp(-t * 3.2) * 0.7


def piano(note, L=1.6):
    a = E.ep(note, L)
    b = E.ep(note + 0.06, L) * 0.6
    return (a + b) * 0.8


def bell(note, L=1.8):
    t = E.secs(L)
    f = E.midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4)) * np.exp(-t * 2.5) * 0.3


AM = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]]  # Am F Dm E
ROOTS = [45, 41, 38, 40]
bus = E.Bus(DUR)
kicks = []

# Vinyle tout du long
crack = E.highpass(E.noise(DUR), 3500) * 0.004
pops = (np.random.default_rng(3).random(int(DUR * E.SR)) > 0.99965) * E.noise(DUR) * 0.5
bus.add(crack + E.lowpass(pops, 6000), 0.0, 1.0)

# Accroche : machine à écrire + piano sombre
for k in range(HOOK_CHARS - 11):  # les 11 premiers caractères sont déjà à l'écran
    bus.add(keyclick(), 0.05 + k * 0.02, 0.5, pan=(k % 5 - 2) * 0.08)
t = E.secs(0.6)
bus.add(np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 7) * 0.25, 0.05 + (HOOK_CHARS - 11) * 0.02 + 0.05, 1.0, rev=0.4)  # « ding »
for k, n in enumerate([69, 72, 76, 72]):
    bus.add(piano(n), k * BEAT, 0.5, rev=0.5)
bus.add(E.pad([45, 52, 57, 60], BAR, 900, 0.8), 0.0, 0.55, rev=0.4)
bus.add(thud(), 1.4, 0.5)  # cercle rouge

# Groove noir (mesures 2 → 12)
S = E.snare(0.4, 180, 0.7)
H = E.hat()
K = E.kick(top=160, drive=2.2)
for b in range(1, 12):
    tb = b * BAR
    ci = (b - 1) % 4
    verdict = b == 6
    detective = b == 7
    end = b >= 9
    major = detective
    ch = [[57, 61, 64], [57, 61, 64], [52, 56, 59], [57, 61, 64]][ci] if major else AM[ci]
    # Piano : arpège en croches
    seq = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[2]]
    for s, n in enumerate(seq):
        bus.add(piano(n + 12, 1.2), tb + s * BEAT / 2, 0.32, pan=-0.2 if s % 2 else 0.2, rev=0.5, duck=True)
    bus.add(E.pad([n - 12 for n in ch] + [ch[0]], BAR, 1100 if not end else 1800, 0.4), tb, 0.45, rev=0.4, duck=True)
    # Contrebasse
    r = (ROOTS[ci] + 1 if False else ROOTS[ci]) if not major else 45
    for s in (0, 6, 8, 14):
        bus.add(bassnote(r if s < 8 else r + 7, 0.8), tb + s * STEP, 0.55)
    if b == 1:
        continue  # les faits commencent sans batterie
    # Batterie (le verdict s'arrête sur le 1er temps)
    for s in (0, 10) if not verdict else (10,):
        bus.add(K, tb + s * STEP, 0.85)
        kicks.append(tb + s * STEP)
        bus.add(E.bass808(r - 12 if r > 40 else r, 0.6, drive=1.8), tb + s * STEP, 0.4)
    for s in (4, 12):
        if verdict and s == 4:
            continue
        bus.add(S, tb + s * STEP, 0.55, rev=0.35)
    for s in range(0, 16, 2):
        bus.add(H, tb + s * STEP + (0.04 if s % 4 == 2 else 0), 0.28, pan=0.25)
    if b % 2 == 0:
        for k in range(6):
            bus.add(E.hat(0.035), tb + 12 * STEP + k * STEP * 2 / 3, 0.18 + 0.03 * k, pan=-0.3)

# Les faits : un post-it par temps (slam = coup sourd)
for k in range(4):
    bus.add(thud(), BAR + BEAT * (1 + k * 1.5), 0.7, pan=(k % 2 - 0.5) * 0.4)
# L'enquête : document, surligneur, fil rouge
for k in range(3):
    t0 = BAR * 3 + k * BAR
    bus.add(thud(), t0, 0.9)
    bus.add(E.impact(1.0), t0, 0.35)
    bus.add(marker(), t0 + BEAT, 0.7)
    bus.add(E.riser(0.6, 800, 6000, (500, 1400)), t0 + BEAT * 2, 0.25)
# Le verdict
VD = BAR * 6 + BEAT
bus.add(E.impact(2.4), VD, 1.0)
bus.add(thud(), VD, 1.0)
bus.add(E.supersaw([33, 40, 45, 48], 1.6, 900), VD, 0.6, rev=0.5)
# Le détective : cloche
for k, n in enumerate([81, 85, 88]):
    bus.add(bell(n), BAR * 7 + 0.1 + k * 0.18, 0.7, rev=0.6)
# Affaire classée
CL = BAR * 8 + 0.38
bus.add(thud(), CL, 1.0)
bus.add(E.impact(1.5), CL, 0.6)
for k in range(8):
    bus.add(S, 24.0 - BEAT + k * STEP / 2 * 1.0, 0.1 + 0.05 * k)
bus.add(E.reverse_cymbal(0.9), 24.0 - 0.9, 0.5)
bus.add(E.impact(), 24.0, 0.9)
# Fin
END = BAR * 11  # 29,33 s
bus.add(E.impact(1.8), END, 0.7)
for k, n in enumerate([57, 60, 64, 69]):
    bus.add(piano(n, 2.0), END + k * 0.08, 0.5, rev=0.8)

music = bus.render(kicks, duck_depth=0.45, mutes=[(24.0 - STEP, 24.0)], fade_out=0.6)

SFX = [
    (BAR * 3 - 0.35, "whoosh.mp3", -4, 0.0),  # les post-it s'envolent
    (BAR * 7 + 0.1, "sparkle.mp3", -6, 0.0),  # badge
    (24.0 + BEAT * 2, "pop.mp3", -2, 0.0),
    (24.0 + BEAT * 2.5, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.5)
    print("ok", sys.argv[2])
