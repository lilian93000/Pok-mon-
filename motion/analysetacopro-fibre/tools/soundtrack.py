"""Bande-son de « LA FIBRE DANS L'IMMEUBLE » : drum & bass original, 172 BPM (break rapide, basse ronde).

Structure commune des vidéos utiles (audio-engine/edu_track.py) : intro sans batterie, un « ding » montant à chaque étape,
carillon sur « Bon à savoir » (20 s), fin à 24 s.
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import edu_track  # noqa: E402

PROG = [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 48, 52]]
T = [2.0, 6.5, 11.0, 15.5]

if __name__ == "__main__":
    edu_track.build("dnb", 172, PROG, T, 20.0, sys.argv[1], sys.argv[2])
    print("ok", sys.argv[2])
