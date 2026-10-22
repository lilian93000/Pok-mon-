"""Bande-son de « CoproMatch » : phonk brésilienne originale, 128 BPM, fa dièse mineur.

16 mesures × 1,875 s = 30 s pile. Chaque coupe de la vidéo tombe sur une mesure.
  1      accroche : riff de cloche 808 seul + montée
  2–8    drop 1 : tamborzão, basse 808, claps, charleston
  9      break : réverb, filtre, montée, silence d'une croche
  10–15  drop 2 : plus dur (cris de voix, roulements, basse saturée)
  16     fin : impact et queue de réverb

Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import engine as E  # noqa: E402

BPM = 128
BEAT = 60 / BPM
STEP = BEAT / 4
BAR = BEAT * 4
DUR = 30.0


def bar_t(b, step=0):
    """Début de la mesure b (1-indexée) + n doubles croches."""
    return (b - 1) * BAR + step * STEP


# Riff de cloche (2 mesures, 16 pas chacune ; None = silence)
RIFF = [
    [78, None, 78, None, 85, None, 78, None, 81, None, 78, None, 80, None, 76, None],
    [78, None, 78, None, 85, None, 78, None, 83, None, 81, None, 80, None, 85, 83],
]
ROOTS = [30, 30, 26, 28]  # F#, F#, D, E (basse 808, octave 1)
KICK = [0, 3, 6, 10]  # tamborzão
KICK2 = [0, 3, 6, 10, 13, 14]
CLAP = [4, 12]

bus = E.Bus(DUR)
kicks = []
K = E.kick()
K2 = E.kick(top=220, drive=3.0)
S = E.snare()
C = E.clap()
H = E.hat()
HO = E.hat(open_=True)

for b in range(1, 17):
    drop1 = 2 <= b <= 8
    drop2 = 10 <= b <= 15
    full = drop1 or drop2
    # Cloche
    if b != 16:
        for s, n in enumerate(RIFF[(b - 1) % 2]):
            if n is None:
                continue
            g = 0.95 if b in (1, 9) else (0.62 if not drop2 else 0.7)
            sig = E.cowbell(n)
            if b == 1:
                sig = E.lowpass(sig, 2200 + 250 * s)
            if b == 9:
                sig = E.lowpass(sig, 3200)
            bus.add(sig, bar_t(b, s), g, pan=0.18 if s % 4 == 2 else -0.08, rev=0.35 if b in (1, 9) else 0.18, duck=full)
    if not full:
        continue
    # Batterie
    for s in (KICK2 if drop2 and b % 2 == 0 else KICK):
        t0 = bar_t(b, s)
        bus.add(K2 if drop2 else K, t0, 0.95)
        kicks.append(t0)
    for s in CLAP:
        bus.add(C, bar_t(b, s), 0.7, rev=0.25)
        bus.add(S, bar_t(b, s), 0.45 if drop2 else 0.3)
    for s in range(16):
        if s % 4 == 2:
            bus.add(HO, bar_t(b, s), 0.32, pan=0.3)
        else:
            bus.add(H, bar_t(b, s), 0.42 if s % 2 else 0.25, pan=-0.25 if s % 2 else 0.25)
    # Roulement de charleston en fin de mesure paire du drop 2
    if drop2 and b % 2 == 1:
        for k in range(6):
            bus.add(E.hat(0.04, tone=1.1), bar_t(b, 14) + k * STEP / 3, 0.25 + 0.04 * k, pan=0.2)
    # Basse 808 : suit la grosse caisse, glisse sur le dernier coup
    root = ROOTS[(b - 2) % 4] + 12
    steps = KICK2 if drop2 and b % 2 == 0 else KICK
    for k, s in enumerate(steps):
        nxt = steps[k + 1] if k + 1 < len(steps) else 16
        L = (nxt - s) * STEP * 0.95
        glide = root + 12 if (k == len(steps) - 1 and b % 2 == 0) else None
        bus.add(E.bass808(root, L, glide_from=glide, drive=3.2 if drop2 else 2.4), bar_t(b, s), 0.75 if drop2 else 0.68, duck=False)
    # Cri de voix au début de chaque mesure impaire du drop 2
    if drop2 and b % 2 == 0:
        bus.add(E.vox("a", 57), bar_t(b, 0), 0.5, rev=0.3)
        bus.add(E.vox("e", 64, 0.2), bar_t(b, 8), 0.35, pan=0.3, rev=0.3)

# Transitions
bus.add(E.riser(BAR * 0.95), bar_t(1), 0.5)
bus.add(E.reverse_cymbal(0.9), bar_t(2) - 0.9, 0.6)
bus.add(E.impact(), bar_t(2), 0.9)
bus.add(E.vox("o", 52, 0.45), bar_t(2), 0.45, rev=0.4)
bus.add(E.riser(BAR * 0.9, 300, 11000, (300, 2200)), bar_t(9), 0.55)
bus.add(E.reverse_cymbal(0.8), bar_t(10) - 0.8, 0.6)
bus.add(E.impact(), bar_t(10), 1.0)
bus.add(E.vox("a", 59, 0.5), bar_t(10), 0.5, rev=0.45)
# Swipes (fin des mesures 3, 5, 7) et le match (début mesure 12)
for b in (4, 6, 8):
    bus.add(E.whoosh(0.45), bar_t(b) - 0.4, 0.55, pan=-0.4)
bus.add(E.whoosh(0.5), bar_t(12) - 0.45, 0.6, pan=0.4)
# Fin : dernier impact, cloche finale en réverb
bus.add(E.impact(2.6), bar_t(16), 1.0)
bus.add(E.kick(top=230, drive=3), bar_t(16), 1.0)
for k, n in enumerate([78, 85, 90]):
    bus.add(E.cowbell(n, 0.5), bar_t(16) + k * STEP * 2, 0.45, rev=0.7)
bus.add(E.bass808(30 + 12, 1.4, glide_from=42 + 12, glide=0.25), bar_t(16), 0.7)

music = bus.render(kicks, duck_depth=0.65, mutes=[(bar_t(10) - STEP * 2, bar_t(10))], fade_out=0.8)

SFX = [
    (bar_t(2, 0) + 0.05, "pop.mp3", -4, 0.0),  # carte 1
    (bar_t(3, 0), "error.mp3", -6, 0.0),  # red flag 1
    (bar_t(5, 0), "error.mp3", -6, 0.0),  # red flag 2
    (bar_t(7, 0), "error.mp3", -6, 0.0),  # red flag 3
    (bar_t(8, 0), "glitch-1.mp3", -6, 0.0),  # « Tu swipes à l'aveugle ? »
    (bar_t(11, 0), "ping.mp3", -4, 0.0),  # feux verts
    (bar_t(11, 4), "ping.mp3", -6, 0.0),
    (bar_t(11, 8), "ping.mp3", -6, 0.0),
    (bar_t(12, 0), "sparkle.mp3", -2, 0.0),  # C'est un match !
    (bar_t(12, 0), "chime.mp3", -6, 0.0),
    (bar_t(13, 0), "pop.mp3", -6, 0.0),
    (bar_t(13, 4), "pop.mp3", -6, 0.0),
    (bar_t(13, 8), "pop.mp3", -6, 0.0),
    (bar_t(15, 4), "pop.mp3", -4, 0.0),  # bouton
    (bar_t(15, 8), "typing.mp3", -6, 0.0),
]

if __name__ == "__main__":
    E.mixdown(music, SFX, sys.argv[1], sys.argv[2], DUR, lufs=-11.0)
    print("ok", sys.argv[2])
