#!/usr/bin/env python3
"""
Télécharge les vraies données de matchs WTA (format Jeff Sackmann)
dans le dossier donnees/.

Le dépôt original JeffSackmann/tennis_wta a été retiré de GitHub ; ce
script essaie donc plusieurs miroirs (forks publics) et prend le premier
qui répond. Tu peux ajouter d'autres miroirs ou années dans les listes
ci-dessous.

Usage :
    python3 telecharger_donnees.py            # saisons 2022 à 2026
    python3 telecharger_donnees.py 2020 2021  # années spécifiques
"""

import os
import sys
import urllib.request

MIROIRS = [
    "https://raw.githubusercontent.com/JeffSackmann/tennis_wta/master",
    "https://raw.githubusercontent.com/mikecristancho/tennis_wta/master",
    "https://raw.githubusercontent.com/VictorSquidWei/tennis_wta/master",
    "https://raw.githubusercontent.com/DawidSobol/tennis_wta/master",
]
ANNEES_DEFAUT = ["2022", "2023", "2024", "2025", "2026"]
DOSSIER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "donnees")


def telecharger(annee):
    nom = f"wta_matches_{annee}.csv"
    destination = os.path.join(DOSSIER, nom)
    for miroir in MIROIRS:
        url = f"{miroir}/{nom}"
        try:
            with urllib.request.urlopen(url, timeout=30) as reponse:
                contenu = reponse.read()
            if not contenu.startswith(b"tourney_id"):
                continue
            with open(destination, "wb") as f:
                f.write(contenu)
            lignes = contenu.count(b"\n")
            print(f"  {nom} : {lignes} matchs  (source : {miroir.split('/')[3]})")
            return True
        except Exception:
            continue
    print(f"  {nom} : ÉCHEC sur tous les miroirs")
    return False


def main():
    annees = sys.argv[1:] or ANNEES_DEFAUT
    os.makedirs(DOSSIER, exist_ok=True)
    print(f"Téléchargement des saisons WTA {', '.join(annees)} vers {DOSSIER}/")
    ok = sum(telecharger(a) for a in annees)
    print(f"\n{ok}/{len(annees)} fichiers téléchargés.")
    if ok:
        print("Tu peux maintenant lancer :  python3 tennis.py --classement")


if __name__ == "__main__":
    main()
