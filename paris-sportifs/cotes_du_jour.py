#!/usr/bin/env python3
"""
Récupère automatiquement les matchs WTA du jour avec leurs cotes réelles.

Source : le dépôt GitHub Mriganka-codes/tennis_data, qui scrape
tennisexplorer.com toutes les 6 heures via GitHub Actions et publie
matches.json (programme du jour + cotes). Accessible via
raw.githubusercontent.com même depuis un réseau restreint.

Les noms y sont abrégés (« Swiatek I. ») : on les résout contre les
joueuses connues de notre base pour retrouver les noms complets.

Usage :
    python3 cotes_du_jour.py                    # affiche + écrit le CSV
    python3 cotes_du_jour.py --sortie mes_cotes.csv
Puis :
    python3 tennis.py --cotes cotes_auto.csv
"""

import argparse
import csv
import glob
import json
import os
import sys
import unicodedata
import urllib.request

DOSSIER = os.path.dirname(os.path.abspath(__file__))
URL = "https://raw.githubusercontent.com/Mriganka-codes/tennis_data/main/matches.json"
# surface par tournoi en cours (à ajuster selon le calendrier)
SURFACES_TOURNOIS = {
    "wimbledon": ("gazon", "G"),
    "iasi": ("terre", "I"),
    "kitzb": ("terre", "I"),
    "rome": ("terre", "I"),
    "athens": ("dur", "I"),
    "hamburg": ("terre", "I"),
    "prague": ("dur", "I"),
    "palermo": ("terre", "I"),
}
SURFACE_DEFAUT = ("dur", "I")


def _normaliser(s):
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower()


def charger_noms_connus():
    """Noms complets -> nombre de matchs dans nos données."""
    from collections import Counter
    noms = Counter()
    for chemin in glob.glob(os.path.join(DOSSIER, "donnees", "*.csv")):
        if "poids" in chemin:
            continue
        with open(chemin, newline="", encoding="utf-8") as f:
            lecteur = csv.DictReader(f)
            champs = lecteur.fieldnames or []
            a, b = (("winner_name", "loser_name") if "winner_name" in champs
                    else ("gagnante", "perdante") if "gagnante" in champs
                    else (None, None))
            if a is None:
                continue
            for L in lecteur:
                noms[L[a].strip()] += 1
                noms[L[b].strip()] += 1
    return noms


def resoudre(abrege, noms, index):
    """« Swiatek I. » -> « Iga Swiatek » via nom de famille + initiale."""
    brut = abrege.split("(")[0].strip()           # retire le n° de tête de série
    morceaux = brut.rsplit(" ", 1)
    if len(morceaux) == 2 and morceaux[1].endswith("."):
        famille, initiale = morceaux[0], morceaux[1][0]
    else:
        famille, initiale = brut, ""
    cle = _normaliser(famille)
    candidats = index.get(cle, [])
    if initiale:
        candidats = [n for n in candidats
                     if _normaliser(n)[0] == _normaliser(initiale)] or candidats
    if len(candidats) == 1:
        return candidats[0]
    if len(candidats) > 1:
        # départage par activité : on prend la plus active si elle domine
        candidats.sort(key=lambda n: noms[n], reverse=True)
        if noms[candidats[0]] >= 5 * max(1, noms[candidats[1]]):
            return candidats[0]
    return None  # ambigu ou inconnue : à résoudre à la main


def construire_index(noms):
    """nom de famille normalisé -> [noms complets]"""
    index = {}
    for n in noms:
        # le nom de famille peut être composé : on indexe chaque suffixe
        mots = n.split()
        for i in range(1, len(mots)):
            cle = _normaliser(" ".join(mots[i:]))
            index.setdefault(cle, []).append(n)
    return index


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sortie", default=os.path.join(DOSSIER, "cotes_auto.csv"))
    ap.add_argument("--tour", default="WTA", choices=["WTA", "ATP"])
    args = ap.parse_args()

    with urllib.request.urlopen(URL, timeout=30) as r:
        d = json.load(r)
    print(f"Flux récupéré : {d['count']} matchs, mis à jour {d['last_updated']}")

    noms = charger_noms_connus()
    index = construire_index(noms)

    lignes = []
    inconnues = []
    for m in d["matches"]:
        if m.get("tour") != args.tour or not m.get("odds1") or not m.get("odds2"):
            continue
        surface, niveau = SURFACE_DEFAUT
        for cle, sn in SURFACES_TOURNOIS.items():
            if cle in m.get("tournament", "").lower():
                surface, niveau = sn
        j1 = resoudre(m["player1"], noms, index)
        j2 = resoudre(m["player2"], noms, index)
        if j1 and j2:
            lignes.append({"joueuse_1": j1, "joueuse_2": j2, "surface": surface,
                           "cote_1": m["odds1"], "cote_2": m["odds2"],
                           "niveau": niveau,
                           "tournoi": m.get("tournament", "")})
        else:
            inconnues.append((m["player1"], m["player2"], m.get("tournament")))

    with open(args.sortie, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["joueuse_1", "joueuse_2", "surface",
                                          "cote_1", "cote_2", "niveau", "tournoi"])
        w.writeheader()
        w.writerows(lignes)

    print(f"\n{len(lignes)} matchs {args.tour} écrits dans {args.sortie} :")
    for L in lignes:
        print(f"  {L['tournoi']:<22} {L['joueuse_1']} ({L['cote_1']}) vs "
              f"{L['joueuse_2']} ({L['cote_2']})  [{L['surface']}]")
    if inconnues:
        print(f"\n[!] {len(inconnues)} matchs ignorés (noms non résolus) :")
        for a, b, t in inconnues:
            print(f"    {t}: {a} vs {b}")


if __name__ == "__main__":
    main()
