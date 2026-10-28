"""Bande-son de « LE MICRO » : néo-soul originale, 84 BPM (piano électrique, batterie traînante).

Structure commune des vidéos utiles (audio-engine/edu_track.py) : intro sans batterie, un « ding » montant à chaque étape,
carillon sur « Bon à savoir » (20 s), fin à 24 s.
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import edu_track  # noqa: E402

PROG = [[60, 64, 67, 71], [57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 65]]
T = [2.0, 5.6, 9.2, 12.8, 16.4]

if __name__ == "__main__":
    edu_track.build("neosoul", 84, PROG, T, 20.0, sys.argv[1], sys.argv[2])
    print("ok", sys.argv[2])
