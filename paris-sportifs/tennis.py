#!/usr/bin/env python3
"""
Analyse mathématique de matchs de tennis (ATP / WTA) pour les paris sportifs.

Deux modèles complémentaires :

  A. ELO PAR SURFACE (mode principal)
     Chaque joueuse a un classement Elo mis à jour après chaque match de
     l'historique, avec un Elo global et un Elo par surface (dur / terre /
     gazon). La probabilité de victoire vient de la formule Elo :
         P(A bat B) = 1 / (1 + 10^(-(Ra - Rb) / 400))
     Le facteur K décroît avec l'expérience (formule FiveThirtyEight) :
         K = 250 / (nb_matchs + 5)^0.4
     → grosse mise à jour pour une joueuse peu connue, fine pour une star.

  B. CHAÎNE DE MARKOV POINT PAR POINT (mode --service)
     À partir de la probabilité de gagner un point sur son service,
     on remonte toute la hiérarchie du tennis par calcul exact :
         point -> jeu -> tie-break -> set -> match (2 sets gagnants)
     Utile pour estimer les marchés "score exact en sets" et la solidité
     d'un favori.

Ensuite, comme pour le foot : comparaison avec les cotes du bookmaker,
détection de value bets (espérance positive) et mise de Kelly fractionné.

Usage :
    python3 tennis.py --historique matchs_tennis_exemple.csv --cotes cotes_tennis_exemple.csv
    python3 tennis.py --historique matchs_tennis_exemple.csv \
        --match "Swiatek:Gauff" --surface terre --cote1 1.45 --cote2 2.90
    python3 tennis.py --service 0.62:0.55          # modèle de Markov pur

Aucune dépendance externe : Python 3 standard uniquement.
"""

import argparse
import csv
import sys
from collections import defaultdict
from functools import lru_cache

ELO_INITIAL = 1500.0
POIDS_SURFACE = 0.5    # mélange : 50 % Elo global + 50 % Elo de la surface
SEUIL_VALUE = 0.03     # edge minimal (3 %) pour signaler un value bet
FRACTION_KELLY = 0.25  # Kelly fractionné : 25 % de la mise Kelly pleine
SURFACES = ("dur", "terre", "gazon")


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
        if surface in self.surface:
            self._maj(self.surface[surface], self.nb_matchs_surface[surface],
                      gagnante, perdante)

    def note(self, joueuse, surface):
        """Elo combiné : mélange global / surface."""
        if surface in self.surface and self.nb_matchs_surface[surface][joueuse] > 0:
            return ((1 - POIDS_SURFACE) * self.global_[joueuse]
                    + POIDS_SURFACE * self.surface[surface][joueuse])
        return self.global_[joueuse]

    def proba_match(self, j1, j2, surface):
        return self.proba(self.note(j1, surface), self.note(j2, surface))


def charger_historique(chemin):
    """CSV : date,gagnante,perdante,surface — trié chronologiquement."""
    matchs = []
    with open(chemin, newline="", encoding="utf-8") as f:
        for ligne in csv.DictReader(f):
            surface = ligne["surface"].strip().lower()
            if surface not in SURFACES:
                sys.exit(f"Surface inconnue « {surface} » (attendu : dur/terre/gazon)")
            matchs.append({
                "date": ligne["date"].strip(),
                "gagnante": ligne["gagnante"].strip(),
                "perdante": ligne["perdante"].strip(),
                "surface": surface,
            })
    if not matchs:
        sys.exit(f"Aucun match trouvé dans {chemin}")
    matchs.sort(key=lambda m: m["date"])
    return matchs


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
                "surface": ligne["surface"].strip().lower(),
                "cote_1": float(ligne["cote_1"]),
                "cote_2": float(ligne["cote_2"]),
            })
    return rencontres


# ----------------------------------------------------------------------
# B. Chaîne de Markov : point -> jeu -> tie-break -> set -> match
# ----------------------------------------------------------------------

def proba_jeu(p):
    """
    Probabilité de gagner son jeu de service si on gagne chaque point
    avec probabilité p. Formule fermée classique (deuce = série géométrique) :
        P = p⁴(1 + 4q + 10q²) + 20 p³q³ · p²/(1 − 2pq)
    """
    q = 1 - p
    deuce = p * p / (1 - 2 * p * q)
    return p ** 4 * (1 + 4 * q + 10 * q * q) + 20 * p ** 3 * q ** 3 * deuce


def proba_tiebreak(pa, pb):
    """
    Tie-break à 7 points (écart de 2). pa = proba que A gagne un point sur
    SON service ; pb = idem pour B. A sert en premier ; le service tourne
    après le 1er point puis tous les 2 points. À égalité >= 6-6, les deux
    points suivants comptent un service chacun -> série géométrique :
        P(A) = pa(1-pb) / (pa(1-pb) + (1-pa)pb)
    """
    p_deuce_a = pa * (1 - pb)
    p_deuce_b = (1 - pa) * pb
    p_tie = p_deuce_a / (p_deuce_a + p_deuce_b)

    @lru_cache(maxsize=None)
    def rec(a, b):
        if a >= 7 and a - b >= 2:
            return 1.0
        if b >= 7 and b - a >= 2:
            return 0.0
        if a >= 6 and b >= 6 and a == b:
            return p_tie
        n = a + b  # le serveur du point n : A si ((n+1)//2) pair
        p_point_a = pa if ((n + 1) // 2) % 2 == 0 else 1 - pb
        return p_point_a * rec(a + 1, b) + (1 - p_point_a) * rec(a, b + 1)

    return rec(0, 0)


def proba_set(pa, pb, a_sert_en_premier=True):
    """
    Set à 6 jeux (écart de 2, tie-break à 6-6), par récurrence exacte
    sur (jeux_a, jeux_b, serveur).
    """
    ga = proba_jeu(pa)        # A tient son service
    gb = proba_jeu(pb)        # B tient son service
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
    """
    Match en 2 sets gagnants. On moyenne selon qui sert en premier
    (l'effet est minime) et on suppose les sets indépendants :
        P(match) = s² (3 − 2s)
    Retourne aussi les probabilités de score en sets (2-0, 2-1, ...).
    """
    s = 0.5 * (proba_set(pa, pb, True) + proba_set(pa, pb, False))
    p20 = s * s
    p21 = 2 * s * s * (1 - s)
    p02 = (1 - s) ** 2
    p12 = 2 * s * (1 - s) ** 2
    return {
        "set": s,
        "match": p20 + p21,
        "scores": {"2-0": p20, "2-1": p21, "1-2": p12, "0-2": p02},
    }


# ----------------------------------------------------------------------
# Value bets et critère de Kelly (commun aux deux modèles)
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

    n1 = elo.note(j1, surface)
    n2 = elo.note(j2, surface)
    marge = 1 / r["cote_1"] + 1 / r["cote_2"] - 1

    print("=" * 66)
    print(f"  {j1}  vs  {j2}   ({surface})")
    print("=" * 66)
    print(f"Elo combiné : {j1} {n1:.0f}  |  {j2} {n2:.0f}")
    print(f"(global {elo.global_[j1]:.0f}/{elo.global_[j2]:.0f}, "
          f"surface {elo.surface[surface][j1]:.0f}/{elo.surface[surface][j2]:.0f}, "
          f"matchs joués {elo.nb_matchs[j1]}/{elo.nb_matchs[j2]})")
    print()
    print(f"{'Marché':<30}{'Proba modèle':>13}{'Cote juste':>11}{'Cote book':>10}")
    print(f"{'Victoire ' + j1:<30}{p1:>12.1%}{1 / p1:>11.2f}{r['cote_1']:>10.2f}")
    print(f"{'Victoire ' + j2:<30}{p2:>12.1%}{1 / p2:>11.2f}{r['cote_2']:>10.2f}")
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
    print("=" * 66)
    print("  Modèle de Markov point par point (match en 2 sets gagnants)")
    print("=" * 66)
    print(f"Joueuse A gagne {pa:.0%} des points sur son service")
    print(f"Joueuse B gagne {pb:.0%} des points sur son service\n")
    print(f"A tient son jeu de service : {proba_jeu(pa):.1%}")
    print(f"B tient son jeu de service : {proba_jeu(pb):.1%}")
    print(f"A gagne un set   : {res['set']:.1%}")
    print(f"A gagne le match : {res['match']:.1%}   (cote juste {1 / res['match']:.2f})\n")
    print("Score en sets le plus probable :")
    for score, p in sorted(res["scores"].items(), key=lambda x: x[1], reverse=True):
        print(f"   {score}  ({p:.1%})")
    print("\nAstuce : au tennis féminin le service pèse moins qu'en ATP ;")
    print("des probas de points au service de 55-62 % sont typiques en WTA.")
    print()


# ----------------------------------------------------------------------
# Classement et programme principal
# ----------------------------------------------------------------------

def afficher_classement(elo, surface=None):
    titre = f"Classement Elo ({'surface ' + surface if surface else 'global'})"
    print(titre)
    print("-" * len(titre))
    if surface:
        notes = [(elo.note(j, surface), j) for j in elo.global_]
    else:
        notes = [(elo.global_[j], j) for j in elo.global_]
    for i, (note, j) in enumerate(sorted(notes, reverse=True), 1):
        print(f"{i:>2}. {j:<22}{note:7.0f}  ({elo.nb_matchs[j]} matchs)")
    print()


def main():
    ap = argparse.ArgumentParser(
        description="Analyse probabiliste de paris tennis (Elo par surface + Markov)")
    ap.add_argument("--historique", help="CSV des matchs passés (date,gagnante,perdante,surface)")
    ap.add_argument("--cotes", help="CSV des rencontres à venir avec les cotes")
    ap.add_argument("--match", help='Analyser un seul match : "Joueuse1:Joueuse2"')
    ap.add_argument("--surface", default="dur", choices=SURFACES, help="Surface du match")
    ap.add_argument("--cote1", type=float, help="Cote victoire joueuse 1")
    ap.add_argument("--cote2", type=float, help="Cote victoire joueuse 2")
    ap.add_argument("--bankroll", type=float, default=100.0, help="Bankroll en euros (défaut 100)")
    ap.add_argument("--classement", action="store_true", help="Afficher le classement Elo")
    ap.add_argument("--service", metavar="pA:pB",
                    help="Modèle de Markov : probas de gagner un point sur son service, ex. 0.60:0.55")
    args = ap.parse_args()

    if args.service:
        pa, pb = (float(x) for x in args.service.split(":"))
        if not (0 < pa < 1 and 0 < pb < 1):
            sys.exit("Les probabilités de service doivent être entre 0 et 1.")
        afficher_markov(pa, pb)
        return

    if not args.historique:
        sys.exit("Fournir --historique fichier.csv (ou --service pA:pB pour le mode Markov)")

    matchs = charger_historique(args.historique)
    elo = construire_elo(matchs)
    print(f"\nHistorique chargé : {len(matchs)} matchs, {len(elo.global_)} joueuses.\n")

    if args.classement:
        afficher_classement(elo)
        for s in SURFACES:
            afficher_classement(elo, s)

    rencontres = []
    if args.cotes:
        rencontres = charger_cotes(args.cotes)
    elif args.match and args.cote1 and args.cote2:
        j1, j2 = (x.strip() for x in args.match.split(":"))
        rencontres = [{"j1": j1, "j2": j2, "surface": args.surface,
                       "cote_1": args.cote1, "cote_2": args.cote2}]
    elif not args.classement:
        sys.exit("Fournir --cotes fichier.csv OU --match \"A:B\" --cote1 --cote2")

    for r in rencontres:
        inconnues = [j for j in (r["j1"], r["j2"]) if j not in elo.global_]
        if inconnues:
            print(f"[!] Joueuse(s) absente(s) de l'historique : {', '.join(inconnues)} "
                  "— match ignoré.\n")
            continue
        analyser_rencontre(elo, r, args.bankroll)

    if rencontres:
        print("Rappel : un modèle ne garantit jamais un gain. Jouez de manière")
        print("responsable, uniquement de l'argent que vous pouvez vous permettre de perdre.")


if __name__ == "__main__":
    main()
