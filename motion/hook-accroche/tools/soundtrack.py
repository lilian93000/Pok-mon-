"""Logo sonore de l'accroche (2,11 s) : coups d'orchestre façon bande-annonce + trap, 128 BPM.
Le son frappe dès l'image 0 ; un coup par mot, de plus en plus aigu, puis le « BRAAAM » de la colonne.

0 s        CE QUE           coup d'orchestre en ré + timbale + 808, charleston trap qui s'accélère
0,47 s     TON FUTUR APPART coup d'orchestre en fa
0,94 s     TE CACHE         coup dissonant haché (glitch) + montée
1,41 s     la colonne       « BRAAAM » grave + sub + impact, puis la cloche « AnalyseTaCopro »
2,03 s     vers la vidéo    souffle
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BEAT = 60 / 128
DUR = 2.11
P = [0.0, BEAT, BEAT * 2, BEAT * 3]
D = P[3] + 0.09  # la colonne touche le sol


def brass(notes, L, bright=3200, decay=3.5):
    t = E.secs(L)
    s = sum(E.saw(E.midi(n) * (1 + d * 0.004), t) for n in notes for d in (-1, 0, 1))
    env = np.minimum(t / 0.004, 1) * np.exp(-t * decay)
    filt = E.lowpass(s, bright) * 0.6 + E.lowpass(s, bright * 0.3) * 0.4
    return np.tanh(filt * env / len(notes) * 2.2) * 0.8


def timpani(note=38, L=0.6):
    t = E.secs(L)
    f = E.midi(note) * (1 + 0.15 * np.exp(-t * 25))
    return np.sin(np.cumsum(f) / E.SR * 2 * np.pi) * np.exp(-t * 6) * 0.9 + E.lowpass(E.noise(L), 600) * np.exp(-t * 40) * 0.6


def orch_hit(notes, L=0.45):
    """Coup d'orchestre : cuivres + cordes aiguës + attaque de bruit + timbale."""
    t = E.secs(L)
    strings = sum(E.saw(E.midi(n + 12) * (1 + d * 0.006), t) for n in notes for d in (-1, 1))
    strings = E.highpass(E.lowpass(strings, 6000), 400) * np.exp(-t * 7) / len(notes) * 0.5
    attack = E.bandpass(E.noise(L), 800, 8000) * np.exp(-t * 45) * 0.8
    return brass(notes, L) + strings + attack + timpani(notes[0] - 12, L)


def braaam(L=0.7):
    t = E.secs(L)
    f = E.midi(26)
    growl = 1 + 0.02 * np.sin(2 * np.pi * 18 * t)
    s = sum(E.saw(f * k * growl * (1 + d * 0.006), t) for k in (1, 2, 3) for d in (-1, 0, 1))
    env = np.minimum(t / 0.006, 1) * np.exp(-t * 1.6)
    return np.tanh(E.lowpass(s, 900) * env * 0.9) * 0.95


def bell(note, L=1.0):
    t = E.secs(L)
    f = E.midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 5) + 0.25 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 9)
    return s * np.exp(-t * 3) * 0.3


def stutter(sig, step, n):
    """Répète le début d'un son (effet glitch)."""
    seg = sig[: int(step * E.SR)]
    out = np.zeros(len(sig))
    for k in range(n):
        i = int(k * step * E.SR)
        out[i : i + len(seg)] += seg[: len(out) - i] * (1 - k * 0.08)
    return out


bus = E.Bus(DUR)
kicks = []
K = E.kick(top=220, drive=3.0)
# 0 : CE QUE — coup en ré mineur
bus.add(orch_hit([50, 57, 62, 65]), 0.0, 1.0, rev=0.3)
bus.add(K, 0.0, 1.0)
kicks.append(0.0)
bus.add(E.bass808(38, BEAT * 0.9, drive=2.6), 0.0, 0.8)
# 0,47 : TON FUTUR APPART — coup en fa
bus.add(orch_hit([53, 60, 65, 69]), P[1], 1.0, rev=0.3)
bus.add(K, P[1], 1.0)
kicks.append(P[1])
bus.add(E.clap(), P[1], 0.6, rev=0.3)
bus.add(E.bass808(41, BEAT * 0.9, glide_from=38, drive=2.6), P[1], 0.8)
# charleston trap qui s'accélère (croches → triolets → triples-croches)
grid = [k * BEAT / 4 for k in range(4)] + [BEAT + k * BEAT / 6 for k in range(6)] + [P[2] + k * BEAT / 8 for k in range(8)]
for k, t in enumerate(grid):
    bus.add(E.hat(0.03, tone=1.1), t, 0.18 + 0.012 * k, pan=0.25 if k % 2 else -0.15)
# 0,94 : TE CACHE — coup dissonant haché
hit3 = orch_hit([56, 62, 68, 74], 0.47)
bus.add(stutter(hit3, BEAT / 8, 6), P[2], 0.95, rev=0.25)
bus.add(K, P[2], 1.0)
kicks.append(P[2])
bus.add(E.bass808(44, BEAT * 0.9, glide_from=41, drive=2.8), P[2], 0.8)
bus.add(E.riser(BEAT, 500, 12000, (300, 2400)), P[2], 0.55)
for k in range(4):
    bus.add(E.snare(), P[2] + BEAT * 0.5 + k * BEAT / 8, 0.3 + 0.1 * k)
# 1,41 : la colonne — BRAAAM + sub + cloche de marque
bus.add(braaam(), D, 1.0, rev=0.4)
bus.add(timpani(26, 0.8), D, 1.0)
bus.add(E.kick(L=0.6, top=260, drive=3.6), D, 1.0)
kicks.append(D)
bus.add(E.bass808(26, 0.62, glide_from=38, drive=3.2, glide=0.12), D, 0.9)
bus.add(E.impact(1.0), D, 0.8)
for k, n in enumerate((86, 93)):
    bus.add(bell(n), D + 0.14 + k * 0.1, 0.7, rev=0.6)
bus.add(E.reverse_cymbal(0.25), DUR - 0.25, 0.6)
music = bus.render(kicks, duck_depth=0.3, fade_out=0.0)

SFX = [
    (D, "impact-bass-2.mp3", -2, 0.0),
    (DUR - 0.12, "whoosh-short.mp3", -1, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-9.5)
    print("ok", sys.argv[2])
