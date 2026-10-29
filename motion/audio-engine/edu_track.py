"""Structure commune des bandes-son des vidéos « utiles » (30 s) :

0 → T[0]        intro (instrument seul, sans batterie)
T[0] → KNOW     le style complet ; à chaque étape T[k] : whoosh + « ding » montant
KNOW → 24       « Bon à savoir » : carillon, style complet
24 → 30         fin : impact, style, nappe finale
"""
import numpy as np

import engine as E
import styles as S


def build(style, bpm, prog, T, know, out_sfx_dir, out, extra=None, dur=30.0, music=True):
    """music=False : seulement les bruitages (whoosh, « ding », carillon, impact), pour poser un son TikTok par-dessus."""
    BAR = 4 * 60 / bpm
    bus = E.Bus(dur)
    kicks = []
    if not music:
        style = None
    # intro sans batterie
    if style:
        S.style(style, bus, kicks, 0.0, max(1, int(np.ceil(T[0] / BAR))), BAR, prog, gain=0.8, drums=False)
    # les étapes
    n = int(np.floor((know - T[0]) / BAR))
    if style:
        S.style(style, bus, kicks, T[0], n, BAR, prog)
    # complète jusqu'à « bon à savoir » sans batterie (petit break)
    if style:
        S.style(style, bus, kicks, T[0] + n * BAR, 1, BAR, prog, gain=0.7, drums=False)
    bus.add(E.riser(min(1.2, know - T[0] - n * BAR + 0.01), 400, 9000, (300, 1400)), max(T[-1] + 0.5, know - 1.2), 0.3)
    for k, t in enumerate(T):
        if k:
            bus.add(E.whoosh(0.45), t - 0.45, 0.3)
        bus.add(S.ding(84 + [0, 2, 4, 5, 7, 9][k % 6]), t, 0.6, rev=0.3)
    # bon à savoir
    for k, nn in enumerate((84, 88, 91, 96)):
        bus.add(S.ding(nn), know + k * 0.08, 0.45, rev=0.4)
    if style:
        S.style(style, bus, kicks, know, int(np.ceil((24.0 - know) / BAR)), BAR, prog)
    # fin
    bus.add(E.impact(1.2), 24.0, 0.4)
    nb = int((dur - 24.0) // BAR)
    nb = max(1, nb - 1)
    if style:
        S.style(style, bus, kicks, 24.0, nb, BAR, prog, gain=0.9)
    root = prog[0]
    if style:
        bus.add(E.pad([n + 12 for n in root], dur - 24.0 - nb * BAR, cutoff=2600), 24.0 + nb * BAR, 0.4, rev=0.5)
    if extra:
        extra(bus, kicks)
    music = bus.render(kicks, duck_depth=0.3, fade_out=0.9)
    sfx = [(24.9, "pop.mp3", -2, 0.0), (24.65, "typing.mp3", -4, 0.0)]
    E.mixdown(music, sfx, out_sfx_dir, out, dur, lufs=-11.0)
