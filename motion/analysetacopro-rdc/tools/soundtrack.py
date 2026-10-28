"""Bande-son de « LE REZ-DE-CHAUSSÉE » : dembow original, 98 BPM (grosse caisse en 4, caisse « boom-ch-boom-chick », pluck).

Structure commune des vidéos utiles (audio-engine/edu_track.py) : intro sans batterie, un « ding » montant à chaque étape,
carillon sur « Bon à savoir » (20 s), fin à 24 s.
Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "audio-engine"))
import edu_track  # noqa: E402

PROG = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]]
T = [2.0, 6.5, 11.0, 15.5]

if __name__ == "__main__":
    edu_track.build("dembow", 98, PROG, T, 20.0, sys.argv[1], sys.argv[2])
    print("ok", sys.argv[2])
