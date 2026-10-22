"""Bande-son v2 de « Le Scanner » : 120 BPM, mêmes points de synchronisation que l'image.

0–4 s    rêverie (piano électrique, nappe, vinyle) puis arrêt de bande
4–5      « Vraiment ? » : impact
5–12,5   trap sombre pendant le scan : 808 graves, charleston en triolets, cloche inquiétante,
         bourdon du scanner qui monte avec le rayon
12,5–16  bilan : battement de cœur, montée
16–18    coup de fouet, scan express, roulement, silence d'une croche
18–26    drop lumineux en fa majeur : cloche phonk, supersaw qui pompe, tamborzão, cris de voix
26–30    le rayon révèle la signature, fin au piano électrique
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BAR, DUR = 2.0, 30.0
STEP = BAR / 16
bus = E.Bus(DUR)
kicks = []

# 0–4 s : rêverie, puis la bande freine (rendue à part pour appliquer l'arrêt)
dream = E.Bus(4.2)
for n, t in [(65, 0.0), (69, 0.25), (72, 0.5), (76, 0.75), (64, 1.0), (69, 1.25), (72, 1.5), (76, 1.75),
             (65, 2.0), (69, 2.25), (72, 2.5), (77, 2.75), (67, 3.0), (71, 3.25), (74, 3.5), (77, 3.75)]:
    dream.add(E.ep(n), t, 0.9, pan=0.15 if int(t * 4) % 2 else -0.15, rev=0.4)
dream.add(E.pad([53, 57, 60, 64], 2.0, 1500, 0.5), 0.0, 0.7, rev=0.3)
dream.add(E.pad([52, 57, 60, 64], 2.2, 1500, 0.3), 2.0, 0.7, rev=0.3)
dream.add(E.highpass(E.noise(4.0), 3000) * 0.015, 0.0, 1.0)
d = dream.render([], duck_depth=0, fade_out=0)
for ch in range(2):
    x = d[:, ch].copy()
    E.tape_stop(x, int(3.55 * E.SR), int(4.0 * E.SR))
    (bus.L if ch == 0 else bus.R)[: len(x)] += x * 0.8
bus.add(E.impact(), 4.0, 1.0)

# 5–12,5 s : trap sombre (ré mineur)
H = E.hat()
for b in range(4):
    tb = 4.5 + b * BAR
    for s in (0, 10):
        bus.add(E.kick(top=170, drive=2.4), tb + s * STEP, 0.9)
        kicks.append(tb + s * STEP)
    bus.add(E.clap(), tb + 8 * STEP, 0.6, rev=0.35)
    for s in range(16):
        bus.add(H, tb + s * STEP, 0.32 if s % 2 else 0.18, pan=0.25 if s % 2 else -0.25)
    for k in range(6):
        bus.add(E.hat(0.035, tone=1.15), tb + 12 * STEP + k * STEP * 2 / 3, 0.2 + 0.03 * k, pan=0.3)
    root = [26, 26, 29, 24][b]
    bus.add(E.bass808(root + 12, BAR * 0.95, glide_from=root + 24 if b % 2 else None, drive=2.2), tb, 0.75)
    for s, n in zip((0, 3, 6, 10, 14), [74, 77, 74, 81, 76] if b % 2 == 0 else [74, 77, 74, 72, 69]):
        bus.add(E.cowbell(n, 0.4), tb + s * STEP, 0.4, pan=0.2, rev=0.5, duck=True)
# Bourdon du scanner synchronisé avec le rayon (5,5 → 12,5 s)
t = E.secs(7.2)
fr = 140 + 520 * (t / t[-1]) ** 1.6
hum = E.phase_sine(fr) * 0.5 + E.phase_sine(fr * 1.5) * 0.25
hum *= (0.6 + 0.4 * np.sin(2 * np.pi * 8 * t)) * np.minimum(t / 0.3, 1) * np.minimum((t[-1] - t) / 0.2, 1)
bus.add(E.lowpass(hum, 2500) * 0.14, 5.4)

# 12,5–16 s : bilan, battement de cœur
for bt in np.arange(12.5, 16.0, 1.0):
    bus.add(E.kick(0.35, 90, 40, 30, 2.0), bt, 0.85)
    bus.add(E.kick(0.35, 90, 40, 30, 2.0), bt + 0.22, 0.5)
bus.add(E.pad([50, 53, 57], 3.5, 900, 0.8), 12.5, 0.6, rev=0.4)
bus.add(E.riser(2.0), 14.0, 0.5)

# 16–18 s : coup de fouet, scan express, roulement
bus.add(E.whoosh(0.5), 15.8, 0.7, pan=-0.4)
t = E.secs(1.0)
bus.add(E.phase_sine(300 + 2200 * t**1.5) * np.sin(np.pi * t) * 0.15, 16.9)
for k, ts in enumerate(np.arange(16.5, 17.92, STEP)):
    bus.add(E.snare(), ts, 0.12 + 0.4 * k / 12)
bus.add(E.reverse_cymbal(0.9), 17.1, 0.6)

# 18–26 s : drop lumineux en fa majeur
RIFF = [
    [77, None, 77, None, 84, None, 77, None, 81, None, 77, None, 79, None, 76, None],
    [77, None, 77, None, 84, None, 77, None, 86, None, 84, None, 81, None, 84, 86],
]
CH = [[53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53]]  # F C Dm Bb
bus.add(E.impact(), 18.0, 1.0)
bus.add(E.vox("a", 60, 0.5), 18.0, 0.5, rev=0.45)
E.groove(bus, 18.0, 4, BAR, RIFF, [41, 36, 38, 34], kicks, kick_steps=(0, 3, 6, 10), clap_steps=(4, 12), cow_gain=0.6, intensity=1.1, triplet_rolls=True, vox_every=2, bass_drive=2.6)
for b in range(4):
    for s in (0, 4, 8, 12):
        bus.add(E.supersaw([n + 12 for n in CH[b]], STEP * 3.5, 5000), 18.0 + b * BAR + s * STEP, 0.32, rev=0.2, duck=True)

# 26–30 s : signature
bus.add(E.impact(2.4), 26.0, 0.9)
bus.add(E.riser(0.8, 2000, 12000, (800, 3000)), 25.2, 0.4)
for k, n in enumerate([65, 69, 72, 77]):
    bus.add(E.ep(n, 2.2), 26.0 + k * 0.12, 0.8, rev=0.5)
bus.add(E.pad([53, 57, 60, 65], 3.8, 2000, 0.4), 26.0, 0.6, rev=0.4)
for b in range(2):
    bus.add(E.kick(), 26.5 + b * 1.0, 0.6)
    kicks.append(26.5 + b * 1.0)
bus.add(E.bass808(29, 2.5, glide_from=41, glide=0.3), 28.0, 0.6)

music = bus.render(kicks, duck_depth=0.6, mutes=[(17.93, 18.0)], fade_out=1.4)

SFX = [
    (1.5, "pop.mp3", -2, 0.0),
    (1.55, "sparkle.mp3", -6, 0.0),
    (4.0, "glitch-1.mp3", 0, 0.0),
    (5.4, "notification.mp3", -8, 0.0),
    (5.95, "error.mp3", -4, 0.0),
    (7.92, "error.mp3", -4, 0.0),
    (10.18, "error.mp3", -4, 0.0),
    (12.12, "error.mp3", -4, 0.0),
    (5.95, "ping.mp3", -6, 0.0),
    (7.92, "ping.mp3", -6, 0.0),
    (10.18, "ping.mp3", -6, 0.0),
    (12.12, "ping.mp3", -6, 0.0),
    (13.4, "impact-bass-2.mp3", -6, 0.0),
    (17.0, "click-soft.mp3", -2, 0.0),
    (17.22, "click-soft.mp3", -2, 0.0),
    (17.44, "click-soft.mp3", -2, 0.0),
    (17.66, "click-soft.mp3", -2, 0.0),
    (19.6, "chime.mp3", -4, 0.0),
    (21.75, "whoosh.mp3", -2, 0.0),
    (22.0, "pop.mp3", -4, 0.0),
    (22.75, "pop.mp3", -4, 0.0),
    (23.5, "pop.mp3", -4, 0.0),
    (24.25, "pop.mp3", -4, 0.0),
    (25.7, "whoosh-short.mp3", -4, 0.0),
    (27.0, "pop.mp3", -2, 0.0),
    (27.3, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
