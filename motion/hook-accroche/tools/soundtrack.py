"""Logo sonore de l'accroche (2,4 s) : annonce → zoom arrière → boom → scan.

0–0,5 s    ambiance douce « appli d'annonces » (accord feutré) ; « like » à 0,2 s
0,5–1,0    zoom arrière : la musique ralentit et plonge (effet dolly), souffle qui aspire
1,0        boom : sub + impact + accord « marque » en ré mineur
1,15–1,65  balayage du scan AnalyseTaCopro + 4 bips d'alerte
1,65       coup « …et tous ses problèmes »
2,15–2,4   cymbale inversée + souffle vers la vidéo
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

DUR = 2.4
HIT = 1.0


def sweep_tone(f0, f1, L, amp=0.2):
    t = E.secs(L)
    f = f0 * (f1 / f0) ** (t / L)
    return np.sin(np.cumsum(f) / E.SR * 2 * np.pi) * amp * np.minimum(t / 0.01, 1) * np.minimum((L - t) / 0.02, 1)


def blip(note, L=0.12):
    t = E.secs(L)
    f = E.midi(note)
    return np.sign(np.sin(2 * np.pi * f * t)) * np.exp(-t * 18) * 0.12


def brand_stab(L=1.2):
    t = E.secs(L)
    return E.supersaw([50, 57, 62, 64, 69], L, cutoff=2600, attack=0.004) * np.exp(-t * 2.6) * 1.4


def scan_zap(L=0.5):
    t = E.secs(L)
    buzz = E.lowpass(E.saw(60, t) + 0.5 * E.saw(120.5, t), 1800) * 0.25
    return (buzz + sweep_tone(400, 2400, L, 0.12)) * np.sin(np.pi * t / L)


bus = E.Bus(DUR)
# 0–0,5 : accord feutré (fa majeur 7) qui va « tomber » avec le zoom
chord = sum(E.ep(n, 1.0) for n in (65, 69, 72, 76)) * 0.6
bus.add(chord, 0.0, 0.8, rev=0.3)
bus.add(E.hat(0.03, tone=1.3), 0.2, 0.3)
# 0,5–1,0 : plongée
bus.add(sweep_tone(900, 55, 0.5, 0.18), 0.5, 1.0)
bus.add(E.whoosh(0.5, up=False), 0.5, 0.9)
bus.add(E.reverse_cymbal(0.5), 0.5, 0.6)
# 1,0 : boom
bus.add(E.impact(1.4), HIT, 1.0)
bus.add(E.bass808(26, 1.2, glide_from=38, drive=2.8, glide=0.2), HIT, 0.9)
bus.add(brand_stab(), HIT, 0.5, rev=0.6)
bus.add(E.clap(), HIT, 0.5, rev=0.8)
# 1,15–1,65 : scan + alertes
bus.add(scan_zap(), 1.15, 0.8, pan=-0.2)
for k, n in enumerate((81, 84, 81, 88)):
    bus.add(blip(n), 1.21 + k * 0.12, 0.9, pan=(k % 2 - 0.5) * 0.6)
# 1,65 : « …et tous ses problèmes »
bus.add(E.kick(top=160, drive=2.6), 1.62, 0.8)
bus.add(E.snare(), 1.62, 0.5, rev=0.4)
bus.add(E.bass808(29, 0.5, drive=2.4), 1.62, 0.6)
# 2,15 : vers la vidéo
bus.add(E.reverse_cymbal(0.3), DUR - 0.3, 0.6)
music = bus.render([], duck_depth=0.0, fade_out=0.0)
# l'accord ralentit jusqu'à l'arrêt pendant le zoom (effet « bande »)
a, b = int(0.5 * E.SR), int(0.98 * E.SR)
seg = music[a:].copy()
rate = np.linspace(1, 0, b - a) ** 1.2
pos = np.cumsum(rate)
for c in range(2):
    music[a:b, c] = np.interp(pos, np.arange(len(seg)), seg[:, c]) * 0.7 + music[a:b, c] * 0.3

SFX = [
    (0.19, "pop.mp3", -1, 0.0),
    (2.12, "whoosh-short.mp3", -2, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-10.0)
    print("ok", sys.argv[2])
