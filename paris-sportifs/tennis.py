#!/usr/bin/env python3
"""
Analyse mathématique de matchs de tennis WTA (et ATP) pour les paris sportifs,
à partir de VRAIES données de matchs (format Jeff Sackmann / tennis_wta).

Deux modèles complémentaires :

  A. ELO PAR SURFACE (mode principal)
     Chaque joueuse a un classement Elo mis à jour après chaque match de
     l'historique, avec un Elo global et un Elo par surface (dur / terre /
     gazon). La probabilité de victoire vient de la formule Elo :
         P(A bat B) = 1 / (1 + 10^(-(Ra - Rb) / 400))
     Le facteur K décroît avec l'expérience (formule FiveThirtyEight) :
         K = 250 / (nb_matchs + 5)^0.4

  B. CHAÎNE DE MARKOV POINT PAR POINT (mode --service)
     À partir de la probabilité de gagner un point sur son service,
     calcul exact de toute la hiérarchie :
         point -> jeu -> tie-break -> set -> match (2 sets gagnants)

Ensuite : comparaison avec les cotes du bookmaker, détection de value bets
(espérance positive) et mise de Kelly fractionné.

Usage :
    # Télécharger d'abord les vraies données : python3 telecharger_donnees.py
    python3 tennis.py --match "Swiatek:Sabalenka" --surface gazon --cote1 1.85 --cote2 1.95
    python3 tennis.py --classement --surface gazon
    python3 tennis.py --cotes mes_cotes.csv --bankroll 200
    python3 tennis.py --service 0.60:0.55       # modèle de Markov pur

Aucune dépendance externe : Python 3 standard uniquement.
"""

import argparse
import csv
import glob
import os
import sys
from collections import defaultdict
from functools import lru_cache

ELO_INITIAL = 1500.0
POIDS_SURFACE = 0.5    # mélange : 50 % Elo global + 50 % Elo de la surface
SEUIL_VALUE = 0.03     # edge minimal (3 %) pour signaler un value bet
FRACTION_KELLY = 0.25  # Kelly fractionné : 25 % de la mise Kelly pleine
SURFACES = ("dur", "terre", "gazon")
DOSSIER_DONNEES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "donnees")

# Correspondance surfaces du format Sackmann -> français
TRAD_SURFACE = {"hard": "dur", "clay": "terre", "grass": "gazon",
                "carpet": "dur", "dur": "dur", "terre": "terre", "gazon": "gazon"}


# ----------------------------------------------------------------------
# Chargement des vraies données (format Jeff Sackmann : tennis_wta)
# ----------------------------------------------------------------------

def charger_historique(chemins):
    """
    Charge un ou plusieurs CSV au format Sackmann (wta_matches_XXXX.csv) :
    colonnes utiles : tourney_date, tourney_id, match_num, winner_name,
    loser_name, surface, score.
    Accepte aussi le format simple : date,gagnante,perdante,surface.
    Les forfaits (W/O) sont exclus ; les abandons comptent comme des victoires.
    """
    matchs = []
    ignores = 0
    for chemin in chemins:
        with open(chemin, newline="", encoding="utf-8") as f:
            lecteur = csv.DictReader(f)
            sackmann = "winner_name" in (lecteur.fieldnames or [])
            for ligne in lecteur:
                if sackmann:
                    surface = TRAD_SURFACE.get(ligne["surface"].strip().lower())
                    score = (ligne.get("score") or "").upper()
                    if surface is None or "W/O" in score or "WEA" in score:
                        ignores += 1
                        continue
                    matchs.append({
                        "cle": (ligne["tourney_date"], ligne["tourney_id"],
                                int(ligne["match_num"] or 0)),
                        "gagnante": ligne["winner_name"].strip(),
                        "perdante": ligne["loser_name"].strip(),
                        "surface": surface,
                    })
                else:
                    surface = TRAD_SURFACE.get(ligne["surface"].strip().lower())
                    if surface is None:
                        ignores += 1
                        continue
                    matchs.append({
                        "cle": (ligne["date"].strip(), "", 0),
                        "gagnante": ligne["gagnante"].strip(),
                        "perdante": ligne["perdante"].strip(),
                        "surface": surface,
                    })
    if not matchs:
        sys.exit("Aucun match exploitable dans les fichiers fournis.")
    matchs.sort(key=lambda m: m["cle"])
    return matchs, ignores


def fichiers_donnees_par_defaut():
    """Les wta_matches_*.csv téléchargés + les résultats récents ajoutés à la main."""
    fichiers = sorted(glob.glob(os.path.join(DOSSIER_DONNEES, "*matches*_[0-9]*.csv")))
    fichiers += sorted(glob.glob(os.path.join(DOSSIER_DONNEES, "resultats_recents*.csv")))
    if not fichiers:
        sys.exit(
            "Aucune donnée trouvée dans " + DOSSIER_DONNEES + "\n"
            "Lance d'abord :  python3 telecharger_donnees.py\n"
            "ou indique tes fichiers avec --historique fichier1.csv fichier2.csv")
    return fichiers


# ----------------------------------------------------------------------
# Résolution des noms (permet de taper « Swiatek » pour « Iga Swiatek »)
# ----------------------------------------------------------------------

def resoudre_nom(saisie, joueuses, nb_matchs):
    s = saisie.strip().lower()
    exactes = [j for j in joueuses if j.lower() == s]
    if exactes:
        return exactes[0]
    candidates = [j for j in joueuses if s in j.lower()]
    if not candidates:
        sys.exit(f"Joueuse introuvable dans les données : « {saisie} »")
    if len(candidates) == 1:
        return candidates[0]
    # plusieurs correspondances : on prend la plus active, en prévenant
    candidates.sort(key=lambda j: nb_matchs[j], reverse=True)
    if nb_matchs[candidates[0]] >= 3 * max(1, nb_matchs[candidates[1]]):
        return candidates[0]
    sys.exit(f"« {saisie} » est ambigu : " + ", ".join(candidates[:6])
             + " — précise le nom complet.")


# ----------------------------------------------------------------------
# A. Modèle Elo par surface
# ----------------------------------------------------------------------

class Elo:
    def __init__(self):
        self.global_ = defaultdict(lambda: ELO_INITIAL)
        self.surface = {s: defaultdict(lambda: ELO_INITIAL) for s in SURFACES}
        self.nb_matchs = defaultdict(int)
        self.nb_matchs_surface = {s: defaultdict(int) for s in SURFACES}

    @staticmethod
    def proba(ra, rb):
        return 1.0 / (1.0 + 10 ** (-(ra - rb) / 400.0))

    @staticmethod
    def facteur_k(n):
        return 250.0 / (n + 5) ** 0.4

    def _maj(self, table, compteur, gagnante, perdante):
        p_gagnante = self.proba(table[gagnante], table[perdante])
        table[gagnante] += self.facteur_k(compteur[gagnante]) * (1 - p_gagnante)
        table[perdante] += self.facteur_k(compteur[perdante]) * (0 - (1 - p_gagnante))
        compteur[gagnante] += 1
        compteur[perdante] += 1

    def enregistrer(self, gagnante, perdante, surface):
        self._maj(self.global_, self.nb_matchs, gagnante, perdante)
        self._maj(self.surface[surface], self.nb_matchs_surface[surface],
                  gagnante, perdante)

    def note(self, joueuse, surface):
        if surface in self.surface and self.nb_matchs_surface[surface][joueuse] > 0:
            return ((1 - POIDS_SURFACE) * self.global_[joueuse]
                    + POIDS_SURFACE * self.surface[surface][joueuse])
        return self.global_[joueuse]

    def proba_match(self, j1, j2, surface):
        return self.proba(self.note(j1, surface), self.note(j2, surface))


def construire_elo(matchs):
    elo = Elo()
    for m in matchs:
        elo.enregistrer(m["gagnante"], m["perdante"], m["surface"])
    return elo


def charger_cotes(chemin):
    """CSV : joueuse_1,joueuse_2,surface,cote_1,cote_2"""
    rencontres = []
    with open(chemin, newline="", encoding="utf-8") as f:
        for ligne in csv.DictReader(f):
            rencontres.append({
                "j1": ligne["joueuse_1"].strip(),
                "j2": ligne["joueuse_2"].strip(),
                "surface": TRAD_SURFACE.get(ligne["surface"].strip().lower(), "dur"),
                "cote_1": float(ligne["cote_1"]),
                "cote_2": float(ligne["cote_2"]),
            })
    return rencontres


# ----------------------------------------------------------------------
# B. Chaîne de Markov : point -> jeu -> tie-break -> set -> match
# ----------------------------------------------------------------------

def proba_jeu(p):
    """
    Probabilité de tenir son jeu de service si on gagne chaque point
    avec probabilité p (l'égalité est une série géométrique) :
        P = p⁴(1 + 4q + 10q²) + 20 p³q³ · p²/(1 − 2pq)
    """
    q = 1 - p
    deuce = p * p / (1 - 2 * p * q)
    return p ** 4 * (1 + 4 * q + 10 * q * q) + 20 * p ** 3 * q ** 3 * deuce


def proba_tiebreak(pa, pb):
    """Tie-break à 7 points (écart de 2), A sert en premier. Calcul exact."""
    p_deuce_a = pa * (1 - pb)
    p_deuce_b = (1 - pa) * pb
    p_tie = p_deuce_a / (p_deuce_a + p_deuce_b)

    @lru_cache(maxsize=None)
    def rec(a, b):
        if a >= 7 and a - b >= 2:
            return 1.0
        if b >= 7 and b - a >= 2:
            return 0.0
        if a >= 6 and a == b:
            return p_tie
        n = a + b  # serveur du point n : A si ((n+1)//2) pair
        p_point_a = pa if ((n + 1) // 2) % 2 == 0 else 1 - pb
        return p_point_a * rec(a + 1, b) + (1 - p_point_a) * rec(a, b + 1)

    return rec(0, 0)


def proba_set(pa, pb, a_sert_en_premier=True):
    """Set à 6 jeux (écart de 2, tie-break à 6-6), récurrence exacte."""
    ga = proba_jeu(pa)
    gb = proba_jeu(pb)
    tb = proba_tiebreak(pa, pb)

    @lru_cache(maxsize=None)
    def rec(a, b, a_sert):
        if a >= 6 and a - b >= 2:
            return 1.0
        if b >= 6 and b - a >= 2:
            return 0.0
        if a == 6 and b == 6:
            return tb if a_sert else 1 - proba_tiebreak(pb, pa)
        p_jeu_a = ga if a_sert else 1 - gb
        return (p_jeu_a * rec(a + 1, b, not a_sert)
                + (1 - p_jeu_a) * rec(a, b + 1, not a_sert))

    return rec(0, 0, a_sert_en_premier)


def proba_match_markov(pa, pb):
    """Match en 2 sets gagnants, sets supposés indépendants."""
    s = 0.5 * (proba_set(pa, pb, True) + proba_set(pa, pb, False))
    p20, p21 = s * s, 2 * s * s * (1 - s)
    p02, p12 = (1 - s) ** 2, 2 * s * (1 - s) ** 2
    return {"set": s, "match": p20 + p21,
            "scores": {"2-0": p20, "2-1": p21, "1-2": p12, "0-2": p02}}


# ----------------------------------------------------------------------
# Value bets et critère de Kelly
# ----------------------------------------------------------------------

def kelly(p, cote, fraction=FRACTION_KELLY):
    b = cote - 1
    if b <= 0:
        return 0.0
    return max(0.0, (p * b - (1 - p)) / b * fraction)


def analyser_rencontre(elo, r, bankroll):
    j1, j2, surface = r["j1"], r["j2"], r["surface"]
    p1 = elo.proba_match(j1, j2, surface)
    p2 = 1 - p1
    n1, n2 = elo.note(j1, surface), elo.note(j2, surface)
    marge = 1 / r["cote_1"] + 1 / r["cote_2"] - 1

    print("=" * 68)
    print(f"  {j1}  vs  {j2}   ({surface})")
    print("=" * 68)
    print(f"Elo combiné : {j1} {n1:.0f}  |  {j2} {n2:.0f}")
    print(f"(global {elo.global_[j1]:.0f}/{elo.global_[j2]:.0f}, "
          f"surface {elo.surface[surface][j1]:.0f}/{elo.surface[surface][j2]:.0f}, "
          f"matchs dans les données {elo.nb_matchs[j1]}/{elo.nb_matchs[j2]})")
    print()
    print(f"{'Marché':<34}{'Proba modèle':>13}{'Cote juste':>11}{'Cote book':>10}")
    print(f"{'Victoire ' + j1:<34}{p1:>12.1%}{1 / p1:>11.2f}{r['cote_1']:>10.2f}")
    print(f"{'Victoire ' + j2:<34}{p2:>12.1%}{1 / p2:>11.2f}{r['cote_2']:>10.2f}")
    print(f"\nMarge du bookmaker : {marge:.1%}")

    value_bets = []
    for nom, p, cote in ((j1, p1, r["cote_1"]), (j2, p2, r["cote_2"])):
        edge = p * cote - 1
        if edge >= SEUIL_VALUE:
            value_bets.append((nom, p, cote, edge, kelly(p, cote)))

    if value_bets:
        print("\n*** VALUE BETS DÉTECTÉS ***")
        for nom, p, cote, edge, f in sorted(value_bets, key=lambda v: v[3], reverse=True):
            print(f" -> Victoire {nom}")
            print(f"    Proba modèle {p:.1%} | cote juste {1 / p:.2f} | cote proposée {cote:.2f}")
            print(f"    Edge (espérance) : {edge:+.1%} par euro misé")
            print(f"    Mise Kelly ({FRACTION_KELLY:.0%}) : {f:.1%} de la bankroll "
                  f"≈ {f * bankroll:.2f} €")
    else:
        print(f"\nAucun value bet (edge < {SEUIL_VALUE:.0%}).")
    print()


def afficher_markov(pa, pb):
    res = proba_match_markov(pa, pb)
    print("=" * 68)
    print("  Modèle de Markov point par point (match en 2 sets gagnants)")
    print("=" * 68)
    print(f"Joueuse A gagne {pa:.0%} des points sur son service")
    print(f"Joueuse B gagne {pb:.0%} des points sur son service\n")
    print(f"A tient son jeu de service : {proba_jeu(pa):.1%}")
    print(f"B tient son jeu de service : {proba_jeu(pb):.1%}")
    print(f"A gagne un set   : {res['set']:.1%}")
    print(f"A gagne le match : {res['match']:.1%}   (cote juste {1 / res['match']:.2f})\n")
    print("Score en sets le plus probable :")
    for score, p in sorted(res["scores"].items(), key=lambda x: x[1], reverse=True):
        print(f"   {score}  ({p:.1%})")
    print("\nRepère : en WTA, gagner 55-62 % des points sur son service est typique.")
    print()


def afficher_classement(elo, surface=None, n=25, min_matchs=20):
    titre = (f"Top {n} Elo " + (f"sur {surface}" if surface else "(toutes surfaces)")
             + f" — joueuses avec ≥ {min_matchs} matchs")
    print(titre)
    print("-" * len(titre))
    if surface:
        notes = [(elo.note(j, surface), j) for j in elo.global_
                 if elo.nb_matchs[j] >= min_matchs
                 and elo.nb_matchs_surface[surface][j] >= 5]
    else:
        notes = [(elo.global_[j], j) for j in elo.global_
                 if elo.nb_matchs[j] >= min_matchs]
    for i, (note, j) in enumerate(sorted(notes, reverse=True)[:n], 1):
        print(f"{i:>2}. {j:<28}{note:7.0f}  ({elo.nb_matchs[j]} matchs)")
    print()


# ----------------------------------------------------------------------
# Programme principal
# ----------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(
        description="Analyse probabiliste de paris tennis WTA (Elo par surface + Markov), "
                    "sur données réelles")
    ap.add_argument("--historique", nargs="+",
                    help="CSV de matchs (format Sackmann wta_matches_XXXX.csv ou simple). "
                         "Par défaut : tous les CSV du dossier donnees/")
    ap.add_argument("--cotes", help="CSV des rencontres à venir : joueuse_1,joueuse_2,surface,cote_1,cote_2")
    ap.add_argument("--match", help='Analyser un match : "Joueuse1:Joueuse2" (nom partiel accepté)')
    ap.add_argument("--surface", default="dur", choices=SURFACES, help="Surface du match")
    ap.add_argument("--cote1", type=float, help="Cote victoire joueuse 1")
    ap.add_argument("--cote2", type=float, help="Cote victoire joueuse 2")
    ap.add_argument("--bankroll", type=float, default=100.0, help="Bankroll en euros (défaut 100)")
    ap.add_argument("--classement", action="store_true", help="Afficher le classement Elo")
    ap.add_argument("--service", metavar="pA:pB",
                    help="Modèle de Markov : probas de point sur son service, ex. 0.60:0.55")
    args = ap.parse_args()

    if args.service:
        pa, pb = (float(x) for x in args.service.split(":"))
        if not (0 < pa < 1 and 0 < pb < 1):
            sys.exit("Les probabilités de service doivent être entre 0 et 1.")
        afficher_markov(pa, pb)
        return

    fichiers = args.historique or fichiers_donnees_par_defaut()
    matchs, ignores = charger_historique(fichiers)
    elo = construire_elo(matchs)
    derniere = max(m["cle"][0] for m in matchs)
    print(f"\nDonnées réelles chargées : {len(matchs)} matchs, "
          f"{len(elo.global_)} joueuses, dernier tournoi commencé le {derniere} "
          f"({ignores} lignes ignorées : forfaits/surface manquante).\n")

    if args.classement:
        afficher_classement(elo)
        if args.surface:
            afficher_classement(elo, args.surface)

    rencontres = []
    if args.cotes:
        rencontres = charger_cotes(args.cotes)
    elif args.match and args.cote1 and args.cote2:
        j1, j2 = (x.strip() for x in args.match.split(":"))
        rencontres = [{"j1": j1, "j2": j2, "surface": args.surface,
                       "cote_1": args.cote1, "cote_2": args.cote2}]
    elif not args.classement:
        sys.exit('Fournir --match "A:B" --cote1 --cote2, ou --cotes fichier.csv, '
                 "ou --classement")

    for r in rencontres:
        r["j1"] = resoudre_nom(r["j1"], elo.global_.keys(), elo.nb_matchs)
        r["j2"] = resoudre_nom(r["j2"], elo.global_.keys(), elo.nb_matchs)
        for j in (r["j1"], r["j2"]):
            if elo.nb_matchs[j] < 10:
                print(f"[!] Attention : {j} n'a que {elo.nb_matchs[j]} matchs dans "
                      "les données, son Elo est peu fiable.")
        analyser_rencontre(elo, r, args.bankroll)

    if rencontres:
        print("Rappel : un modèle ne garantit jamais un gain. Jouez de manière")
        print("responsable, uniquement de l'argent que vous pouvez vous permettre de perdre.")


if __name__ == "__main__":
    main()
