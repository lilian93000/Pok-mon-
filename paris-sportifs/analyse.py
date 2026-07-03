#!/usr/bin/env python3
"""
Analyse mathématique de matchs de football pour les paris sportifs.

Principe :
  1. On estime la force offensive et défensive de chaque équipe à partir
     de l'historique des matchs (buts marqués / encaissés, domicile / extérieur).
  2. On modélise le nombre de buts de chaque équipe par une loi de Poisson :
        P(k buts) = exp(-lambda) * lambda^k / k!
  3. On en déduit les probabilités : victoire / nul / défaite (1X2),
     plus ou moins de 2,5 buts, les deux équipes marquent (BTTS),
     et les scores exacts les plus probables.
  4. On compare ces probabilités aux cotes du bookmaker pour détecter
     les "value bets" : paris où la cote proposée est supérieure à la
     cote "juste" issue du modèle (espérance de gain positive).
  5. On dimensionne la mise avec le critère de Kelly (fractionné pour
     limiter la variance).

Usage :
    python3 analyse.py --historique matchs_exemple.csv --cotes cotes_exemple.csv
    python3 analyse.py --historique matchs_exemple.csv \
        --match "PSG:Marseille" --cote1 1.55 --coteX 4.40 --cote2 5.80

Aucune dépendance externe : Python 3 standard uniquement.
"""

import argparse
import csv
import math
import sys
from collections import defaultdict

MAX_BUTS = 10          # taille de la matrice de scores (0..10 buts)
SEUIL_VALUE = 0.03     # edge minimal (3 %) pour signaler un value bet
FRACTION_KELLY = 0.25  # Kelly fractionné : 25 % de la mise Kelly pleine


# ----------------------------------------------------------------------
# 1. Chargement des données
# ----------------------------------------------------------------------

def charger_historique(chemin):
    """Charge un CSV : domicile,exterieur,buts_dom,buts_ext"""
    matchs = []
    with open(chemin, newline="", encoding="utf-8") as f:
        for ligne in csv.DictReader(f):
            matchs.append({
                "dom": ligne["domicile"].strip(),
                "ext": ligne["exterieur"].strip(),
                "bd": int(ligne["buts_dom"]),
                "be": int(ligne["buts_ext"]),
            })
    if not matchs:
        sys.exit(f"Aucun match trouvé dans {chemin}")
    return matchs


def charger_cotes(chemin):
    """Charge un CSV : domicile,exterieur,cote_1,cote_X,cote_2[,cote_plus25,cote_moins25]"""
    rencontres = []
    with open(chemin, newline="", encoding="utf-8") as f:
        for ligne in csv.DictReader(f):
            r = {
                "dom": ligne["domicile"].strip(),
                "ext": ligne["exterieur"].strip(),
                "cote_1": float(ligne["cote_1"]),
                "cote_X": float(ligne["cote_X"]),
                "cote_2": float(ligne["cote_2"]),
            }
            for cle in ("cote_plus25", "cote_moins25"):
                if cle in ligne and ligne[cle].strip():
                    r[cle] = float(ligne[cle])
            rencontres.append(r)
    return rencontres


# ----------------------------------------------------------------------
# 2. Estimation des forces des équipes
# ----------------------------------------------------------------------

def calculer_forces(matchs):
    """
    Force d'attaque = buts marqués par match / moyenne de la ligue.
    Force de défense = buts encaissés par match / moyenne de la ligue.
    Calculé séparément à domicile et à l'extérieur pour capturer
    l'avantage du terrain.
    """
    stats = defaultdict(lambda: {
        "bm_dom": 0, "be_dom": 0, "n_dom": 0,   # à domicile
        "bm_ext": 0, "be_ext": 0, "n_ext": 0,   # à l'extérieur
    })
    total_buts_dom = total_buts_ext = 0

    for m in matchs:
        stats[m["dom"]]["bm_dom"] += m["bd"]
        stats[m["dom"]]["be_dom"] += m["be"]
        stats[m["dom"]]["n_dom"] += 1
        stats[m["ext"]]["bm_ext"] += m["be"]
        stats[m["ext"]]["be_ext"] += m["bd"]
        stats[m["ext"]]["n_ext"] += 1
        total_buts_dom += m["bd"]
        total_buts_ext += m["be"]

    n = len(matchs)
    moy_dom = total_buts_dom / n   # buts moyens d'une équipe à domicile
    moy_ext = total_buts_ext / n   # buts moyens d'une équipe à l'extérieur

    forces = {}
    for equipe, s in stats.items():
        nd, ne = max(s["n_dom"], 1), max(s["n_ext"], 1)
        forces[equipe] = {
            # attaque : > 1 = marque plus que la moyenne
            "att_dom": (s["bm_dom"] / nd) / moy_dom if moy_dom else 1.0,
            "att_ext": (s["bm_ext"] / ne) / moy_ext if moy_ext else 1.0,
            # défense : < 1 = encaisse moins que la moyenne (bonne défense)
            "def_dom": (s["be_dom"] / nd) / moy_ext if moy_ext else 1.0,
            "def_ext": (s["be_ext"] / ne) / moy_dom if moy_dom else 1.0,
        }
    return forces, moy_dom, moy_ext


# ----------------------------------------------------------------------
# 3. Modèle de Poisson
# ----------------------------------------------------------------------

def poisson(k, lam):
    return math.exp(-lam) * lam ** k / math.factorial(k)


def predire_match(dom, ext, forces, moy_dom, moy_ext):
    """
    Espérance de buts :
      lambda_dom = moyenne ligue à domicile * attaque(dom) * défense(ext)
      lambda_ext = moyenne ligue à l'extérieur * attaque(ext) * défense(dom)
    Puis matrice complète des scores P(i buts pour dom, j buts pour ext).
    """
    fd, fe = forces[dom], forces[ext]
    lam_dom = moy_dom * fd["att_dom"] * fe["def_ext"]
    lam_ext = moy_ext * fe["att_ext"] * fd["def_dom"]

    matrice = [[poisson(i, lam_dom) * poisson(j, lam_ext)
                for j in range(MAX_BUTS + 1)]
               for i in range(MAX_BUTS + 1)]

    p1 = sum(matrice[i][j] for i in range(MAX_BUTS + 1)
             for j in range(MAX_BUTS + 1) if i > j)
    px = sum(matrice[i][i] for i in range(MAX_BUTS + 1))
    p2 = sum(matrice[i][j] for i in range(MAX_BUTS + 1)
             for j in range(MAX_BUTS + 1) if i < j)

    p_plus25 = sum(matrice[i][j] for i in range(MAX_BUTS + 1)
                   for j in range(MAX_BUTS + 1) if i + j >= 3)
    p_btts = sum(matrice[i][j] for i in range(1, MAX_BUTS + 1)
                 for j in range(1, MAX_BUTS + 1))

    scores = sorted(
        ((i, j, matrice[i][j]) for i in range(MAX_BUTS + 1)
         for j in range(MAX_BUTS + 1)),
        key=lambda x: x[2], reverse=True)[:5]

    return {
        "lam_dom": lam_dom, "lam_ext": lam_ext,
        "p1": p1, "px": px, "p2": p2,
        "p_plus25": p_plus25, "p_moins25": 1 - p_plus25,
        "p_btts": p_btts,
        "top_scores": scores,
    }


# ----------------------------------------------------------------------
# 4. Value bets et critère de Kelly
# ----------------------------------------------------------------------

def marge_bookmaker(cotes):
    """Somme des probabilités implicites - 1 = marge du bookmaker."""
    return sum(1 / c for c in cotes) - 1


def kelly(p, cote, fraction=FRACTION_KELLY):
    """
    Mise optimale (fraction de la bankroll) selon Kelly :
        f* = (p * (cote - 1) - (1 - p)) / (cote - 1)
    On applique un facteur de fraction pour réduire la variance.
    """
    b = cote - 1
    if b <= 0:
        return 0.0
    f = (p * b - (1 - p)) / b
    return max(0.0, f * fraction)


def evaluer_paris(pred, rencontre):
    """Compare probabilités du modèle et cotes ; retourne les value bets."""
    candidats = [
        ("Victoire " + rencontre["dom"] + " (1)", pred["p1"], rencontre["cote_1"]),
        ("Match nul (X)", pred["px"], rencontre["cote_X"]),
        ("Victoire " + rencontre["ext"] + " (2)", pred["p2"], rencontre["cote_2"]),
    ]
    if "cote_plus25" in rencontre:
        candidats.append(("Plus de 2,5 buts", pred["p_plus25"], rencontre["cote_plus25"]))
    if "cote_moins25" in rencontre:
        candidats.append(("Moins de 2,5 buts", pred["p_moins25"], rencontre["cote_moins25"]))

    value_bets = []
    for nom, p, cote in candidats:
        edge = p * cote - 1  # espérance de gain pour 1 € misé
        if edge >= SEUIL_VALUE:
            value_bets.append({
                "pari": nom, "proba": p, "cote": cote,
                "cote_juste": 1 / p if p else float("inf"),
                "edge": edge, "kelly": kelly(p, cote),
            })
    value_bets.sort(key=lambda v: v["edge"], reverse=True)
    return candidats, value_bets


# ----------------------------------------------------------------------
# 5. Affichage
# ----------------------------------------------------------------------

def afficher_analyse(rencontre, pred, candidats, value_bets, bankroll):
    dom, ext = rencontre["dom"], rencontre["ext"]
    print("=" * 66)
    print(f"  {dom}  vs  {ext}")
    print("=" * 66)
    print(f"Buts attendus : {dom} {pred['lam_dom']:.2f} — {pred['lam_ext']:.2f} {ext}")
    print()
    print(f"{'Marché':<34}{'Proba modèle':>13}{'Cote juste':>11}{'Cote book':>10}")
    for nom, p, cote in candidats:
        print(f"{nom:<34}{p:>12.1%}{1 / p if p else 0:>11.2f}{cote:>10.2f}")

    marge = marge_bookmaker([rencontre["cote_1"], rencontre["cote_X"], rencontre["cote_2"]])
    print(f"\nMarge du bookmaker sur le 1X2 : {marge:.1%}")

    print("\nScores exacts les plus probables :")
    for i, j, p in pred["top_scores"]:
        print(f"   {i}-{j}  ({p:.1%})")

    print(f"\nAutres probabilités : +2,5 buts {pred['p_plus25']:.1%} | "
          f"-2,5 buts {pred['p_moins25']:.1%} | BTTS {pred['p_btts']:.1%}")

    if value_bets:
        print("\n*** VALUE BETS DÉTECTÉS ***")
        for v in value_bets:
            mise = v["kelly"] * bankroll
            print(f" -> {v['pari']}")
            print(f"    Proba modèle {v['proba']:.1%} | cote juste {v['cote_juste']:.2f} "
                  f"| cote proposée {v['cote']:.2f}")
            print(f"    Edge (espérance) : {v['edge']:+.1%} par euro misé")
            print(f"    Mise Kelly ({FRACTION_KELLY:.0%}) : {v['kelly']:.1%} "
                  f"de la bankroll ≈ {mise:.2f} €")
    else:
        print("\nAucun value bet (edge < "
              f"{SEUIL_VALUE:.0%}) : les cotes ne présentent pas d'avantage.")
    print()


# ----------------------------------------------------------------------
# 6. Programme principal
# ----------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description="Analyse probabiliste de paris sportifs (modèle de Poisson)")
    ap.add_argument("--historique", required=True, help="CSV des matchs passés")
    ap.add_argument("--cotes", help="CSV des rencontres à venir avec les cotes")
    ap.add_argument("--match", help='Analyser un seul match : "Domicile:Exterieur"')
    ap.add_argument("--cote1", type=float, help="Cote victoire domicile")
    ap.add_argument("--coteX", type=float, help="Cote match nul")
    ap.add_argument("--cote2", type=float, help="Cote victoire extérieur")
    ap.add_argument("--bankroll", type=float, default=100.0, help="Bankroll en euros (défaut 100)")
    args = ap.parse_args()

    matchs = charger_historique(args.historique)
    forces, moy_dom, moy_ext = calculer_forces(matchs)

    print(f"\nHistorique chargé : {len(matchs)} matchs, {len(forces)} équipes.")
    print(f"Moyenne de buts : {moy_dom:.2f} (domicile) / {moy_ext:.2f} (extérieur)\n")

    rencontres = []
    if args.cotes:
        rencontres = charger_cotes(args.cotes)
    elif args.match and args.cote1 and args.coteX and args.cote2:
        dom, ext = (x.strip() for x in args.match.split(":"))
        rencontres = [{"dom": dom, "ext": ext, "cote_1": args.cote1,
                       "cote_X": args.coteX, "cote_2": args.cote2}]
    else:
        sys.exit("Fournir --cotes fichier.csv OU --match \"A:B\" --cote1 --coteX --cote2")

    for r in rencontres:
        for equipe in (r["dom"], r["ext"]):
            if equipe not in forces:
                print(f"[!] Équipe inconnue dans l'historique : {equipe} — match ignoré.\n")
                break
        else:
            pred = predire_match(r["dom"], r["ext"], forces, moy_dom, moy_ext)
            candidats, value_bets = evaluer_paris(pred, r)
            afficher_analyse(r, pred, candidats, value_bets, args.bankroll)

    print("Rappel : un modèle ne garantit jamais un gain. Jouez de manière")
    print("responsable, uniquement de l'argent que vous pouvez vous permettre de perdre.")


if __name__ == "__main__":
    main()
