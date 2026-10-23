"""Logo sonore de l'accroche (2,11 s) : phonk brésilienne, 128 BPM, le drop tombe dès l'image 0.

0 s        CE QUE           crash + kick + 808 distordue + cloche phonk (riff en doubles-croches)
0,47 s     TON FUTUR APPART kick + impact, charleston
0,94 s     TE CACHE         alarme + roulement de caisse claire qui accélère
1,41 s     la colonne       gros drop : sub qui plonge, accord saturé, « hey ! », claquement
2,03 s     vers la vidéo    souffle
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 128
STEP = BEAT / 4
DUR = 2.11
P = [0.0, BEAT, BEAT * 2, BEAT * 3]


def crash(L=1.2):
    t = E.secs(L)
    return E.highpass(E.noise(L), 4000) * np.exp(-t * 3.5) * 0.5


def alarm(L):
    t = E.secs(L)
    f = np.where((t * 8) % 1 < 0.5, 1046, 784)
    return E.lowpass(np.sign(np.sin(np.cumsum(f) / E.SR * 2 * np.pi)), 3500) * 0.09


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=230, drive=3.2)
C = E.clap()
# riff de cloche phonk (ré mineur) sur 3 temps, joué en doubles-croches
RIFF = [74, 74, 77, 74, 72, 74, 69, None, 74, 74, 77, 79, 77, 74, 72, 69]
for s in range(12):
    n = RIFF[s % 16]
    if n is not None:
        bus.add(E.cowbell(n), s * STEP, 0.75, pan=0.18 if s % 2 else -0.12, rev=0.15, duck=True)
# temps 1 : crash + kick + 808
bus.add(crash(), 0.0, 1.0)
for t, g in ((0.0, 1.0), (P[1], 0.95), (P[1] + STEP * 2, 0.6), (P[2], 0.95)):
    bus.add(K, t, g)
    kicks.append(t)
bus.add(E.bass808(38, BEAT * 0.95, drive=3.0), 0.0, 0.9)
bus.add(E.bass808(41, BEAT * 0.95, glide_from=38, drive=3.0), P[1], 0.9)
bus.add(E.bass808(44, BEAT * 0.95, glide_from=41, drive=3.0), P[2], 0.9)
bus.add(C, P[1], 0.6, rev=0.2)
bus.add(E.impact(0.6), P[1], 0.6)
for s in range(4, 12):
    bus.add(E.hat(0.035), s * STEP, 0.25 + 0.02 * s, pan=0.25)
# temps 3 : alarme + roulement
bus.add(alarm(BEAT), P[2], 0.9)
for k in range(8):
    bus.add(E.snare(), P[2] + k * BEAT / 8, 0.25 + 0.08 * k)
bus.add(E.riser(BEAT, 600, 12000, (400, 2400)), P[2], 0.5)
# temps 4 : le drop de la colonne
D = P[3] + 0.09
bus.add(E.impact(1.2), D, 1.0)
bus.add(E.kick(L=0.6, top=260, drive=3.6), D, 1.0)
kicks.append(D)
bus.add(E.bass808(26, 0.62, glide_from=38, drive=3.4, glide=0.12), D, 1.0)
bus.add(E.supersaw([50, 57, 62, 65, 69], 0.6, cutoff=3800, attack=0.003), D, 0.7, rev=0.4)
bus.add(E.vox("e", 62, 0.3), D + 0.02, 0.6, rev=0.3)
bus.add(C, D, 0.8, rev=0.5)
for s in range(3):
    bus.add(E.cowbell([81, 77, 74][s]), D + 0.12 + s * STEP, 0.5, rev=0.3)
bus.add(E.reverse_cymbal(0.25), DUR - 0.25, 0.6)
music = bus.render(kicks, duck_depth=0.35, fade_out=0.0)

SFX = [
    (P[3] + 0.09, "impact-bass-1.mp3", 0, 0.0),
    (DUR - 0.12, "whoosh-short.mp3", -1, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-9.5)
    print("ok", sys.argv[2])
