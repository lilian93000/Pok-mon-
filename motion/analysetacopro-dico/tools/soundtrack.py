"""Bande-son de « LE PETIT DICO DE LA COPRO » : pop baroque originale, 100 BPM (clavecin en arpèges).

Structure commune des vidéos utiles (audio-engine/edu_track.py) : intro sans batterie, un « ding » montant à chaque étape,
carillon sur « Bon à savoir » (20 s), fin à 24 s.
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import edu_track  # noqa: E402

PROG = [[57, 60, 64, 69], [50, 53, 57, 62], [52, 56, 59, 64], [57, 60, 64, 69]]
T = [2.0, 5.6, 9.2, 12.8, 16.4]

if __name__ == "__main__":
    edu_track.build("baroque", 100, PROG, T, 20.0, sys.argv[1], sys.argv[2])
    print("ok", sys.argv[2])
