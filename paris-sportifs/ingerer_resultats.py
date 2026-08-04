#!/usr/bin/env python3
"""Ingestion COMPREHENSIVE des résultats WTA du jour dans resultats_recents.csv.

But : garder chaque fiche à jour jour par jour. On ne se limite PAS aux
picks — on ingère TOUS les matchs terminés de TOUS les tournois actifs.

Usage :
    python3 ingerer_resultats.py --tournoi "Toronto WTA" --date 20260804 <<'FIN'
    Coco Gauff def. Kayla Day 6-2 6-1
    Iga Swiatek bat Sara Bejlek 6-1 6-3
    ...
    FIN

Formats de ligne acceptés (souples) :
    "Gagnante def. Perdante 6-2 6-1"
    "Gagnante bat Perdante"
    "Gagnante d. Perdante"
    "Gagnante > Perdante"
La surface est déduite du nom de tournoi (table SURFACES). Dédoublonnage
automatique sur (date, gagnante, perdante). --tournoi/--date servent de
valeurs par défaut ; on peut aussi préfixer une ligne par "TOURNOI|DATE|".
"""
import argparse, csv, os, re, sys, unicodedata

DOSSIER = os.path.dirname(os.path.abspath(__file__))
FICHIER = os.path.join(DOSSIER, "donnees", "resultats_recents.csv")

# tournoi (sous-chaîne, minuscule) -> surface
SURFACES = {
    "wimbledon": "gazon", "queen": "gazon", "eastbourne": "gazon",
    "bad homburg": "gazon", "berlin": "gazon", "nottingham": "gazon",
    "s-hertogenbosch": "gazon", "birmingham": "gazon",
    "roland": "terre", "madrid": "terre", "rome": "terre", "iasi": "terre",
    "hamburg": "terre", "palermo": "terre", "bucharest": "terre",
    "kitzb": "terre", "warsaw": "terre", "prague": "terre",
    # été/automne dur nord-américain + asie
    "toronto": "dur", "montreal": "dur", "canadian": "dur", "national bank": "dur",
    "cincinnati": "dur", "washington": "dur", "dc open": "dur", "monterrey": "dur",
    "cleveland": "dur", "us open": "dur", "flushing": "dur", "guadalajara": "dur",
    "san diego": "dur", "tokyo": "dur", "beijing": "dur", "china open": "dur",
    "wuhan": "dur", "ningbo": "dur", "seoul": "dur", "osaka": "dur",
    "memphis": "dur", "targu": "dur", "lexington": "dur",
}
DEFAUT_SURFACE = "dur"

SEP = re.compile(r"\s+(?:def\.?|d\.|bat|beats?|defeats?|>|vs\.? winner)\s+", re.I)


def _norm(s):
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower().strip()


def surface_de(tournoi):
    t = _norm(tournoi)
    for cle, surf in SURFACES.items():
        if cle in t:
            return surf
    return DEFAUT_SURFACE


def charger_existants():
    vus = set()
    if os.path.exists(FICHIER):
        with open(FICHIER, newline="", encoding="utf-8") as f:
            for L in csv.DictReader(f):
                vus.add((L["date"], _norm(L["gagnante"]), _norm(L["perdante"])))
    return vus


def parse_ligne(ligne, tournoi_def, date_def):
    ligne = ligne.strip()
    if not ligne or ligne.startswith("#"):
        return None
    tournoi, date = tournoi_def, date_def
    # préfixe optionnel "TOURNOI|DATE|reste"
    if ligne.count("|") >= 2:
        a, b, ligne = ligne.split("|", 2)
        if a.strip():
            tournoi = a.strip()
        if b.strip():
            date = b.strip()
        ligne = ligne.strip()
    # retirer un score final éventuel
    sans_score = re.split(r"\s+\d\-\d", ligne, 1)[0].strip()
    m = SEP.split(sans_score)
    if len(m) != 2:
        return ("ERR", ligne)
    gagnante, perdante = m[0].strip(" .\t"), m[1].strip(" .\t")
    if not gagnante or not perdante:
        return ("ERR", ligne)
    return (date, gagnante, perdante, surface_de(tournoi), tournoi)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tournoi", default="")
    ap.add_argument("--date", default="", help="AAAAMMJJ")
    ap.add_argument("--source", default="websearch")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    vus = charger_existants()
    ajouts, erreurs, doublons = [], [], 0
    for ligne in sys.stdin:
        r = parse_ligne(ligne, args.tournoi, args.date)
        if r is None:
            continue
        if r[0] == "ERR":
            erreurs.append(r[1])
            continue
        date, g, p, surf, trn = r
        cle = (date, _norm(g), _norm(p))
        if cle in vus:
            doublons += 1
            continue
        vus.add(cle)
        ajouts.append((date, g, p, surf, trn, args.source))

    if ajouts and not args.dry_run:
        with open(FICHIER, "a", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            for row in ajouts:
                w.writerow(row)

    print(f"{'[DRY-RUN] ' if args.dry_run else ''}{len(ajouts)} ajouts | "
          f"{doublons} doublons ignorés | {len(erreurs)} lignes illisibles")
    for row in ajouts:
        print("  +", row[0], row[1], "bat", row[2], f"[{row[3]}] {row[4]}")
    for e in erreurs:
        print("  ! illisible :", e)


if __name__ == "__main__":
    main()
