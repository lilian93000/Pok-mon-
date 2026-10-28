"""Bande-son de « LES PIÈGES D'UN PLAN » : klezmer original, 100 BPM (clarinette en mode freygish, oum-pa).

Structure commune des vidéos utiles (audio-engine/edu_track.py) : intro sans batterie, un « ding » montant à chaque étape,
carillon sur « Bon à savoir » (20 s), fin à 24 s.
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import edu_track  # noqa: E402

PROG = [[62, 66, 69, 72], [67, 70, 74, 79], [62, 66, 69, 72], [64, 67, 70, 74]]
T = [2.0, 6.5, 11.0, 15.5]

if __name__ == "__main__":
    edu_track.build("klezmer", 100, PROG, T, 20.0, sys.argv[1], sys.argv[2])
    print("ok", sys.argv[2])
