"""Bande-son de « LES 5 TESTS DE LA VISITE » : indie pop originale, 120 BPM (guitare en arpèges clairs, tambourin).

Structure commune des vidéos utiles (audio-engine/edu_track.py) : intro sans batterie, un « ding » montant à chaque étape,
carillon sur « Bon à savoir » (20 s), fin à 24 s.
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import edu_track  # noqa: E402

PROG = [[52, 56, 59], [57, 61, 64], [54, 57, 61], [59, 63, 66]]
T = [2.0, 5.6, 9.2, 12.8, 16.4]

if __name__ == "__main__":
    edu_track.build("indie", 120, PROG, T, 20.0, sys.argv[1], sys.argv[2])
    print("ok", sys.argv[2])
