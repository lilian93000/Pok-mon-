"""Bande-son v2 de la vidéo ultra 4K : drift phonk originale, 120 BPM, ré mineur.

Mêmes points de synchronisation que l'image (1 mesure = 2 s) :
  0–2    accroche : riff de cloche filtré, montée → 2 s impact (le nom claque)
  2–16   drop A : groove phonk, charleston en triolets ; 12,5/13,5/14,5 impacts des tuiles
  16–18  break « Nous, si. » : réverb, montée, coup à 17 s, silence d'une croche
  18–28  drop B : plus dur (tamborzão, cris de voix, basse saturée)
  28–30  fin : impact et queue de réverb
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BAR, DUR = 2.0, 30.0
STEP = BAR / 16
RIFF = [
    [74, None, 74, None, 81, None, 74, None, 77, None, 74, None, 76, None, 72, None],
    [74, None, 74, None, 81, None, 74, None, 79, None, 77, None, 76, None, 81, 79],
]
ROOTS = [38, 38, 34, 36]  # ré, ré, si bémol, do (808)

bus = E.Bus(DUR)
kicks = []
# Accroche : riff filtré qui s'ouvre
for s, n in enumerate(RIFF[0]):
    if n is not None:
        bus.add(E.lowpass(E.cowbell(n), 1800 + 350 * s), s * STEP, 0.9, rev=0.35)
bus.add(E.riser(1.9), 0.0, 0.5)
bus.add(E.reverse_cymbal(0.9), 1.1, 0.6)
bus.add(E.impact(), 2.0, 1.0)
bus.add(E.vox("o", 50, 0.5), 2.0, 0.45, rev=0.4)
# Drop A (2–16 s) : kick 0/10, snare demi-temps sur 8
E.groove(bus, 2.0, 7, BAR, RIFF, ROOTS, kicks, kick_steps=(0, 7, 10), clap_steps=(8,), snare_steps=(8,), cow_gain=0.6, intensity=0.8, triplet_rolls=True)
# Break (16–18 s)
for b in range(1):
    for s, n in enumerate(RIFF[1]):
        if n is not None:
            bus.add(E.lowpass(E.cowbell(n), 2600), 16.0 + s * STEP, 0.8, rev=0.6)
bus.add(E.riser(1.9, 300, 11000, (300, 2400)), 16.0, 0.6)
bus.add(E.impact(1.2), 17.0, 0.6)
for k, t in enumerate([x * STEP / 2 for x in range(16)]):
    bus.add(E.snare(), 17.0 + t, 0.12 + 0.03 * k)
bus.add(E.reverse_cymbal(0.8), 17.2, 0.6)
# Drop B (18–28 s)
bus.add(E.impact(), 18.0, 1.0)
bus.add(E.vox("a", 57, 0.5), 18.0, 0.55, rev=0.45)
E.groove(bus, 18.0, 5, BAR, RIFF, ROOTS, kicks, kick_steps=(0, 3, 6, 10), clap_steps=(4, 12), snare_steps=(12,), cow_gain=0.7, intensity=1.3, triplet_rolls=True, vox_every=2, bass_drive=3.2)
# Fin
bus.add(E.impact(2.6), 28.0, 1.0)
bus.add(E.kick(top=230, drive=3), 28.0, 1.0)
kicks.append(28.0)
for k, n in enumerate([74, 81, 86]):
    bus.add(E.cowbell(n, 0.5), 28.0 + k * 0.25, 0.5, rev=0.8)
bus.add(E.bass808(38, 1.5, glide_from=50, glide=0.3), 28.0, 0.7)

music = bus.render(kicks, duck_depth=0.6, mutes=[(17.75, 18.0)], fade_out=1.0)

SFX = [
    (3.72, "whoosh.mp3", -2, 0.0),
    (6.5, "glitch-1.mp3", -6, 0.0),
    (7.72, "whoosh.mp3", -2, 0.0),
    (9.0, "impact-bass-1.mp3", -4, 0.0),
    (11.72, "whoosh.mp3", -2, 0.0),
    (12.5, "impact-bass-1.mp3", -2, 0.0),
    (13.5, "impact-bass-1.mp3", -2, 0.0),
    (14.5, "impact-bass-1.mp3", -2, 0.0),
    (15.45, "glitch-2.mp3", -6, 0.0),
    (16.4, "click.mp3", 0, 0.0),
    (16.9, "click.mp3", 0, 0.0),
    (19.7, "ping.mp3", -4, 0.0),
    (19.75, "sparkle.mp3", -6, 0.0),
    (23.72, "whoosh.mp3", -2, 0.0),
    (25.5, "pop.mp3", -2, 0.0),
    (26.0, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
