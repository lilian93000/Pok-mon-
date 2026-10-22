"""Bande-son de « POV : 3 mois après avoir signé » : jersey club originale à 140 BPM (la majeur).

1 temps = 0,4286 s, 1 mesure = 1,7143 s.
0–6,0 s     tension : vibreur + ping à chaque notification, cœur qui s'emballe, tic-tac, montée
6,0         l'écran se brise : impact + verre ; acouphène jusqu'au rembobinage
6,86–8,57   REWIND : l'intro rejouée à l'envers en accéléré, bande qui repart
8,57–23,8   jersey club : grosses caisses sautillantes, « bed squeak », voix découpées,
            accords I–V–vi–IV en arpèges
24–30       fin : drop final puis queue de réverb
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 140
BAR = BEAT * 4
STEP = BEAT / 4
DUR = 30.0
CRACK = BAR * 3 + 0.857
REW = BAR * 4
DROP = BAR * 5
NOTIFS = [0, BEAT * 2, BEAT * 4, BEAT * 6, BEAT * 8, BEAT * 10] + [BAR * 3 + k * BEAT / 4 for k in range(8)]
GOOD = [BAR * 10 + i * BEAT * 2 for i in range(4)]


def ping(f=1568):
    t = E.secs(0.5)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 9) + np.sin(2 * np.pi * f * 1.335 * t) * np.exp(-np.maximum(t - 0.09, 0) * 9) * (t > 0.09)
    return s * 0.35


def buzz(L=0.28):
    t = E.secs(L)
    return np.tanh(np.sin(2 * np.pi * 160 * t) * 3) * (0.5 + 0.5 * np.sin(2 * np.pi * 24 * t)) * np.minimum(t / 0.01, 1) * np.exp(-t * 4) * 0.35


def squeak():
    """« Bed squeak » du jersey club."""
    t = E.secs(0.13)
    f = 1100 + 600 * (t / t[-1]) + 40 * np.sin(2 * np.pi * 30 * t)
    s = E.phase_sine(f) * 0.7 + np.sign(E.phase_sine(f * 0.5)) * 0.15
    return E.bandpass(s * np.minimum(t / 0.004, 1) * np.exp(-t * 22), 700, 4500) * 0.6


def glass():
    t = E.secs(1.2)
    s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(3100, 7), (4700, 9), (6200, 12), (5300, 10), (2500, 6)])
    n = E.highpass(E.noise(1.2), 3000) * np.exp(-t * 14)
    return (s * 0.12 + n * 0.6) * 0.8


# ---------- 0–6,86 s : tension ----------
intro = E.Bus(6.9)
for t0 in NOTIFS:
    intro.add(ping(1568 if t0 < BAR * 3 else 1760), t0, 0.8 if t0 < BAR * 3 else 0.55, pan=(np.sin(t0 * 7)) * 0.3, rev=0.2)
    intro.add(buzz(), t0, 0.7)
# Cœur qui s'emballe : un coup par temps puis par croche
hb = E.kick(0.3, 90, 40, 30, 2.0)
t = 0.0
while t < CRACK - 0.05:
    intro.add(hb, t, 0.8)
    intro.add(hb, t + 0.16, 0.45)
    t += BEAT * 2 if t < BAR * 2 else BEAT
for k in range(int(CRACK / (BEAT / 2))):
    intro.add(E.hat(0.03, tone=0.7), k * BEAT / 2, 0.25, pan=0.3)
intro.add(E.pad([50, 53, 57], CRACK, 700, 0.6), 0.0, 0.5, rev=0.4)
tt = E.secs(CRACK)
intro.add(E.phase_sine(36.7 + 0 * tt) * np.minimum(tt / 1.0, 1) * 0.35, 0.0)
intro.add(E.riser(CRACK - BAR * 2.5, 300, 9000, (200, 1600)), BAR * 2.5, 0.5)
pre = intro.render([], duck_depth=0, fade_out=0)

bus = E.Bus(DUR)
n = min(len(pre), int(CRACK * E.SR))
bus.L[:n] += pre[:n, 0]
bus.R[:n] += pre[:n, 1]
# 6,0 s : l'écran se brise, puis acouphène
bus.add(E.impact(), CRACK, 1.0)
bus.add(glass(), CRACK, 0.9, rev=0.4)
tt = E.secs(REW - CRACK)
bus.add(np.sin(2 * np.pi * 3600 * tt) * np.exp(-tt * 1.5) * 0.12, CRACK)

# ---------- 6,86–8,57 s : REWIND (l'intro à l'envers, accélérée) ----------
src = pre[: int(CRACK * E.SR)]
L = int((BAR - 0.12) * E.SR)
idx = np.linspace(len(src) - 1, 0, L)
rev = np.stack([np.interp(idx, np.arange(len(src)), src[:, c]) for c in range(2)], 1)
ramp = np.linspace(0.3, 1, L)[:, None]
i0 = int(REW * E.SR)
bus.L[i0 : i0 + L] += rev[:, 0] * ramp[:, 0] * 0.8
bus.R[i0 : i0 + L] += rev[:, 1] * ramp[:, 0] * 0.8
tt = E.secs(BAR - 0.12)
bus.add(np.tanh(E.saw(1, np.cumsum(60 + 900 * (tt / tt[-1]) ** 2) / E.SR) * 2) * 0.12 * (tt / tt[-1]), REW)
bus.add(E.reverse_cymbal(0.9), DROP - 0.9, 0.6)

# ---------- 8,57–30 s : jersey club ----------
CH = [[57, 61, 64], [52, 56, 59], [54, 57, 61], [50, 54, 57]]  # A E F#m D
ROOTS = [33, 28, 30, 26]
K = E.kick(top=200, drive=2.8)
C = E.clap()
H = E.hat()
SQ = squeak()
kicks = []
bus.add(E.impact(), DROP, 1.0)
bus.add(E.vox("e", 64, 0.45), DROP, 0.55, rev=0.4)
first_bar, last_bar = 6, 17  # mesures 6 à 17 (1-indexées)
for b in range(first_bar, last_bar + 1):
    tb = (b - 1) * BAR
    ci = (b - first_bar) % 4
    if b == 14:  # mini break avant le drop final
        for s in range(0, 16, 2):
            bus.add(E.pluck(CH[ci][s // 2 % 3] + 12), tb + s * STEP, 0.25, rev=0.5)
        bus.add(E.riser(BAR * 0.95, 600, 12000, (400, 2600)), tb, 0.5)
        for k in range(8):
            bus.add(E.snare(), tb + BAR / 2 + k * STEP, 0.12 + 0.05 * k)
        continue
    final = b >= 15
    ks = [0, 4, 8, 11, 14] if b % 2 == 0 else [0, 4, 8, 10, 12, 13, 14, 15]
    for s in ks:
        bus.add(K, tb + s * STEP, 0.9 if s in (0, 4, 8) else 0.7)
        kicks.append(tb + s * STEP)
    for s in (4, 12):
        bus.add(C, tb + s * STEP, 0.7, rev=0.25)
    for s in (2, 6, 10) if b % 2 == 0 else (2, 6, 10, 15):
        bus.add(SQ, tb + s * STEP, 0.55, pan=0.25 if s % 4 == 2 else -0.25, rev=0.15)
    for s in range(0, 16, 2):
        bus.add(H, tb + s * STEP, 0.35, pan=-0.2)
    # Basse 808 sur les grosses caisses
    for k, s in enumerate(ks):
        nxt = ks[k + 1] if k + 1 < len(ks) else 16
        bus.add(E.bass808(ROOTS[ci] + 12, (nxt - s) * STEP * 0.9, drive=2.6), tb + s * STEP, 0.6)
    # Accords en arpège (doubles croches) + nappe
    for s in range(16):
        bus.add(E.pluck(CH[ci][s % 3] + (24 if s % 4 == 3 else 12), 0.3, 4200), tb + s * STEP, 0.22, pan=-0.3 if s % 2 else 0.3, rev=0.25, duck=True)
    bus.add(E.supersaw([n + 12 for n in CH[ci]], BAR * 0.98, 3500 if not final else 5000), tb, 0.22, rev=0.2, duck=True)
    # Voix découpées
    if b % 2 == 0:
        bus.add(E.vox("a", 61, 0.22), tb + 7 * STEP, 0.4, pan=0.3, rev=0.3)
    else:
        bus.add(E.vox("e", 64, 0.18), tb + 3 * STEP, 0.35, pan=-0.3, rev=0.3)
    if final and b == 15:
        bus.add(E.impact(), tb, 1.0)
        bus.add(E.vox("o", 57, 0.5), tb, 0.5, rev=0.45)
# Notifications positives (17,1 s) et étincelles
for t0 in GOOD:
    bus.add(ping(2093), t0, 0.5, rev=0.3)
# Fin : dernier coup puis queue
END = 17 * BAR  # 29,14 s
bus.add(E.impact(2.0), END, 0.9)
bus.add(E.kick(top=230, drive=3), END, 0.9)
kicks.append(END)
for k, n in enumerate([69, 73, 76, 81]):
    bus.add(E.pluck(n, 0.9, 5000), END + k * 0.05, 0.35, rev=0.8)

music = bus.render(kicks, duck_depth=0.6, mutes=[(DROP - STEP, DROP), (15 * BAR - STEP, 15 * BAR)], fade_out=0.7)

SFX = [
    (CRACK, "glitch-2.mp3", -6, 0.0),
    (BAR * 7, "error.mp3", -4, 0.0),  # copropriété A
    (BAR * 7 + BEAT * 3, "impact-bass-1.mp3", -6, 0.0),  # ON PASSE
    (BAR * 8 - 0.25, "whoosh.mp3", -2, 0.0),
    (BAR * 9, "chime.mp3", -6, 0.0),  # copropriété excellente
    (BAR * 11, "sparkle.mp3", -2, 0.0),  # confettis
    (BAR * 12 - 0.35, "whoosh.mp3", 0, 0.0),
    (24.0 + BEAT * 2, "pop.mp3", -2, 0.0),
    (24.0 + BEAT * 3, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
