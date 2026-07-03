#!/usr/bin/env python3
"""
Moteur de prédiction multi-facteurs pour le tennis WTA.

Pour chaque match, ~23 indicateurs sont calculés pour chaque joueuse à
partir de l'INTÉGRALITÉ de son historique réel (11 000+ matchs chargés) :

  Niveau               : Elo global+surface, classement WTA, expérience
  Face-à-face          : H2H total, H2H sur la surface du jour
  Forme                : % victoires sur 5 et 15 derniers matchs, série en cours
  Calendrier / fatigue : minutes jouées sur 14 j, matchs sur 7 j,
                         jours de repos depuis le dernier match
  Profil physique      : gauchère/droitière, bilan contre ce profil de main,
                         taille, âge (distance au pic ~24,5 ans)
  Qualité de jeu       : % points gagnés au service (10 derniers matchs),
                         % points gagnés en retour, aces/match, doubles
                         fautes/match
  Mental / clutch      : % balles de break sauvées (20 derniers),
                         % sets décisifs gagnés (carrière)
  Contexte             : % victoires sur la surface (carrière), bilan en
                         Grand Chelem

Le poids de chaque facteur n'est pas choisi à la main : une régression
logistique (pure Python, sans dépendance) est ENTRAÎNÉE sur les matchs
historiques — chaque match passé sert d'exemple « la joueuse au meilleur
profil a-t-elle gagné ? ». La probabilité finale :

    P(A bat B) = sigmoide( somme_i poids_i * (x_i(A) - x_i(B)) )

Les poids appris sont mis en cache dans donnees/poids_modele.json.

Backtest :  python3 caracteristiques.py --backtest
(entraîne sur tout sauf 2026, évalue sur 2026, compare au modèle Elo seul)
"""

import csv
import datetime
import json
import math
import os
import sys
from collections import defaultdict

DOSSIER = os.path.dirname(os.path.abspath(__file__))
FICHIER_POIDS = os.path.join(DOSSIER, "donnees", "poids_modele.json")

TRAD_SURFACE = {"hard": "dur", "clay": "terre", "grass": "gazon",
                "carpet": "dur", "dur": "dur", "terre": "terre", "gazon": "gazon"}
DECALAGE_TOUR = {"R128": 0, "R64": 1, "R32": 2, "R16": 4, "QF": 5, "SF": 6,
                 "F": 7, "RR": 2, "BR": 6, "ER": 0}
MIN_MATCHS_ENTRAINEMENT = 5

NOMS_FEATURES = [
    "Elo (global+surface)", "Classement WTA", "Expérience (nb matchs)",
    "H2H direct", "H2H sur cette surface",
    "Forme 5 derniers matchs", "Forme 15 derniers", "Série en cours",
    "Fatigue: minutes/14j", "Matchs sur 7 jours", "Jours de repos",
    "Gauchère", "Bilan vs ce profil de main", "Taille", "Âge (pic ~24,5 ans)",
    "Service: % pts gagnés (10 der.)", "Retour: % pts gagnés (10 der.)",
    "Aces/match", "Doubles fautes/match",
    "Clutch: % BdB sauvées", "Sets décisifs gagnés (carrière)",
    "% victoires sur la surface", "Bilan en Grand Chelem",
]


def _f(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def _date_ordinale(tourney_date, tour):
    """Date approximative du match : début du tournoi + décalage du tour."""
    s = str(tourney_date)
    d = datetime.date(int(s[:4]), int(s[4:6]), int(s[6:8]))
    return d.toordinal() + DECALAGE_TOUR.get(tour, 2)


def charger_matchs(chemins):
    """Charge les CSV (format Sackmann complet ou format simple) et trie
    chronologiquement. Retourne des dicts riches (stats incluses si dispo)."""
    matchs = []
    for chemin in chemins:
        with open(chemin, newline="", encoding="utf-8") as f:
            lecteur = csv.DictReader(f)
            sackmann = "winner_name" in (lecteur.fieldnames or [])
            for L in lecteur:
                if sackmann:
                    surface = TRAD_SURFACE.get((L["surface"] or "").strip().lower())
                    score = (L.get("score") or "").upper()
                    if surface is None or "W/O" in score or "WEA" in score:
                        continue
                    sets_joues = len([t for t in score.split() if "-" in t])
                    m = {
                        "date": _date_ordinale(L["tourney_date"], L.get("round", "")),
                        "cle": (L["tourney_date"], L["tourney_id"],
                                int(L["match_num"] or 0)),
                        "gagnante": L["winner_name"].strip(),
                        "perdante": L["loser_name"].strip(),
                        "surface": surface,
                        "niveau": (L.get("tourney_level") or "").strip(),
                        "minutes": _f(L.get("minutes")),
                        "decisif": sets_joues >= int(_f(L.get("best_of")) or 3),
                        "g": {"main": (L.get("winner_hand") or "U").strip(),
                              "taille": _f(L.get("winner_ht")),
                              "age": _f(L.get("winner_age")),
                              "rang": _f(L.get("winner_rank")),
                              "ace": _f(L.get("w_ace")), "df": _f(L.get("w_df")),
                              "svpt": _f(L.get("w_svpt")),
                              "svwon": (_f(L.get("w_1stWon")) or 0) + (_f(L.get("w_2ndWon")) or 0)
                                       if _f(L.get("w_svpt")) else None,
                              "bps": _f(L.get("w_bpSaved")), "bpf": _f(L.get("w_bpFaced"))},
                        "p": {"main": (L.get("loser_hand") or "U").strip(),
                              "taille": _f(L.get("loser_ht")),
                              "age": _f(L.get("loser_age")),
                              "rang": _f(L.get("loser_rank")),
                              "ace": _f(L.get("l_ace")), "df": _f(L.get("l_df")),
                              "svpt": _f(L.get("l_svpt")),
                              "svwon": (_f(L.get("l_1stWon")) or 0) + (_f(L.get("l_2ndWon")) or 0)
                                       if _f(L.get("l_svpt")) else None,
                              "bps": _f(L.get("l_bpSaved")), "bpf": _f(L.get("l_bpFaced"))},
                    }
                else:  # format simple : date,gagnante,perdante,surface[,...]
                    surface = TRAD_SURFACE.get((L["surface"] or "").strip().lower())
                    if surface is None:
                        continue
                    m = {
                        "date": _date_ordinale(L["date"].strip(), ""),
                        "cle": (L["date"].strip(), "zzz", 0),
                        "gagnante": L["gagnante"].strip(),
                        "perdante": L["perdante"].strip(),
                        "surface": surface, "niveau": "",
                        "minutes": None, "decisif": None,
                        "g": {}, "p": {},
                    }
                matchs.append(m)
    if not matchs:
        sys.exit("Aucun match exploitable.")
    matchs.sort(key=lambda m: m["cle"])
    return matchs


class Joueuse:
    """État cumulatif d'une joueuse, mis à jour match après match."""

    def __init__(self):
        self.historique = []          # (date, victoire, minutes)
        self.v = self.d = 0
        self.v_surface = defaultdict(int)
        self.d_surface = defaultdict(int)
        self.v_main = defaultdict(int)   # victoires contre main L/R
        self.d_main = defaultdict(int)
        self.v_gc = self.d_gc = 0        # Grand Chelem
        self.v_dec = self.d_dec = 0      # sets décisifs
        self.serve = []                  # % pts service gagnés, 10 derniers
        self.retour = []                 # % pts retour gagnés
        self.aces = []
        self.df = []
        self.bp = []                     # (sauvées, subies), 20 derniers
        self.main = "U"
        self.taille = None
        self.age = None
        self.rang = None

    def maj(self, victoire, m, moi, adv):
        date = m["date"]
        self.historique.append((date, victoire, m["minutes"]))
        if victoire:
            self.v += 1
            self.v_surface[m["surface"]] += 1
        else:
            self.d += 1
            self.d_surface[m["surface"]] += 1
        main_adv = adv.get("main", "U")
        if main_adv in ("L", "R"):
            (self.v_main if victoire else self.d_main)[main_adv] += 1
        if m["niveau"] == "G":
            if victoire:
                self.v_gc += 1
            else:
                self.d_gc += 1
        if m["decisif"]:
            if victoire:
                self.v_dec += 1
            else:
                self.d_dec += 1
        if moi.get("main") in ("L", "R"):
            self.main = moi["main"]
        for attr, cle in (("taille", "taille"), ("age", "age"), ("rang", "rang")):
            if moi.get(cle) is not None:
                setattr(self, attr, moi[cle])
        if moi.get("svpt") and moi.get("svwon") is not None:
            self.serve.append(moi["svwon"] / moi["svpt"])
            self.serve = self.serve[-10:]
        if adv.get("svpt") and adv.get("svwon") is not None:
            self.retour.append(1 - adv["svwon"] / adv["svpt"])
            self.retour = self.retour[-10:]
        if moi.get("ace") is not None:
            self.aces.append(moi["ace"])
            self.aces = self.aces[-10:]
        if moi.get("df") is not None:
            self.df.append(moi["df"])
            self.df = self.df[-10:]
        if moi.get("bpf"):
            self.bp.append((moi.get("bps") or 0, moi["bpf"]))
            self.bp = self.bp[-20:]

    # ---- indicateurs dérivés ----
    def n(self):
        return self.v + self.d

    def forme(self, k):
        der = self.historique[-k:]
        return sum(1 for _, v, _ in der if v) / len(der) if der else 0.5

    def serie(self):
        s = 0
        for _, v, _ in reversed(self.historique):
            if s == 0:
                s = 1 if v else -1
            elif (s > 0) == v:
                s += 1 if v else -1
            else:
                break
        return s

    def minutes_recentes(self, date, jours=14):
        return sum(mn or 0 for d, _, mn in self.historique if date - d <= jours)

    def matchs_recents(self, date, jours=7):
        return sum(1 for d, _, _ in self.historique if date - d <= jours)

    def repos(self, date):
        return min(date - self.historique[-1][0], 60) if self.historique else 60

    def taux(self, v, d):
        return (v + 1) / (v + d + 2)  # lissage de Laplace


class Moteur:
    """Elo + extraction des 23 indicateurs + régression logistique."""

    def __init__(self):
        self.j = defaultdict(Joueuse)
        self.elo_g = defaultdict(lambda: 1500.0)
        self.elo_s = {s: defaultdict(lambda: 1500.0) for s in ("dur", "terre", "gazon")}
        self.n_elo = defaultdict(int)
        self.n_elo_s = {s: defaultdict(int) for s in ("dur", "terre", "gazon")}
        self.h2h = defaultdict(int)          # (A,B) -> victoires de A sur B
        self.h2h_s = defaultdict(int)        # (A,B,surface)
        self.poids = None
        self.ecarts = None

    # ---- Elo interne ----
    @staticmethod
    def _p_elo(ra, rb):
        return 1 / (1 + 10 ** (-(ra - rb) / 400))

    def _maj_elo(self, table, npar, g, p):
        pg = self._p_elo(table[g], table[p])
        kg = 250 / (npar[g] + 5) ** 0.4
        kp = 250 / (npar[p] + 5) ** 0.4
        table[g] += kg * (1 - pg)
        table[p] -= kp * (1 - pg)
        npar[g] += 1
        npar[p] += 1

    def elo_combine(self, nom, surface):
        if self.n_elo_s[surface][nom] > 0:
            return 0.5 * self.elo_g[nom] + 0.5 * self.elo_s[surface][nom]
        return self.elo_g[nom]

    # ---- vecteur de différences A - B ----
    def vecteur(self, a, b, surface, date, niveau="G"):
        A, B = self.j[a], self.j[b]
        p_elo = self._p_elo(self.elo_combine(a, surface), self.elo_combine(b, surface))
        h_ab, h_ba = self.h2h[(a, b)], self.h2h[(b, a)]
        hs_ab, hs_ba = self.h2h_s[(a, b, surface)], self.h2h_s[(b, a, surface)]

        def rang_score(J):
            return -math.log(J.rang) if J.rang else -math.log(150)

        def moy(liste, defaut):
            return sum(liste) / len(liste) if liste else defaut

        def bp_taux(J):
            s = sum(x for x, _ in J.bp)
            f = sum(y for _, y in J.bp)
            return (s + 1) / (f + 2)

        gc = niveau == "G"
        return [
            p_elo - 0.5,
            (rang_score(A) - rang_score(B)) / 3,
            (math.log(1 + A.n()) - math.log(1 + B.n())) / 3,
            (h_ab - h_ba) / (h_ab + h_ba + 2),
            (hs_ab - hs_ba) / (hs_ab + hs_ba + 2),
            A.forme(5) - B.forme(5),
            A.forme(15) - B.forme(15),
            (max(-5, min(5, A.serie())) - max(-5, min(5, B.serie()))) / 5,
            (A.minutes_recentes(date) - B.minutes_recentes(date)) / 600,
            (A.matchs_recents(date) - B.matchs_recents(date)) / 5,
            (A.repos(date) - B.repos(date)) / 30,
            (A.main == "L") - (B.main == "L"),
            A.taux(A.v_main[B.main], A.d_main[B.main])
            - B.taux(B.v_main[A.main], B.d_main[A.main]),
            ((A.taille or 170) - (B.taille or 170)) / 20,
            (-abs((A.age or 24.5) - 24.5) + abs((B.age or 24.5) - 24.5)) / 10,
            moy(A.serve, 0.55) - moy(B.serve, 0.55),
            moy(A.retour, 0.45) - moy(B.retour, 0.45),
            (moy(A.aces, 2) - moy(B.aces, 2)) / 10,
            -(moy(A.df, 3) - moy(B.df, 3)) / 10,
            bp_taux(A) - bp_taux(B),
            A.taux(A.v_dec, A.d_dec) - B.taux(B.v_dec, B.d_dec),
            A.taux(A.v_surface[surface], A.d_surface[surface])
            - B.taux(B.v_surface[surface], B.d_surface[surface]),
            (A.taux(A.v_gc, A.d_gc) - B.taux(B.v_gc, B.d_gc)) if gc else 0.0,
        ]

    # ---- ingestion d'un match (produit un exemple d'entraînement puis met à jour) ----
    def ingerer(self, m, collecter=True):
        g, p = m["gagnante"], m["perdante"]
        exemple = None
        if (collecter and self.j[g].n() >= MIN_MATCHS_ENTRAINEMENT
                and self.j[p].n() >= MIN_MATCHS_ENTRAINEMENT):
            exemple = self.vecteur(g, p, m["surface"], m["date"],
                                   m["niveau"] or "I")
        self._maj_elo(self.elo_g, self.n_elo, g, p)
        self._maj_elo(self.elo_s[m["surface"]], self.n_elo_s[m["surface"]], g, p)
        self.h2h[(g, p)] += 1
        self.h2h_s[(g, p, m["surface"])] += 1
        self.j[g].maj(True, m, m["g"], m["p"])
        self.j[p].maj(False, m, m["p"], m["g"])
        return exemple

    # ---- régression logistique (gradient, pur Python) ----
    def entrainer(self, exemples, iterations=250, pas=0.6, l2=1e-3):
        nf = len(NOMS_FEATURES)
        self.ecarts = []
        for i in range(nf):
            var = sum(x[i] * x[i] for x in exemples) / len(exemples)
            self.ecarts.append(math.sqrt(var) or 1.0)
        X = [[x[i] / self.ecarts[i] for i in range(nf)] for x in exemples]
        w = [0.0] * nf
        n = len(X)
        for _ in range(iterations):
            grad = [0.0] * nf
            for x in X:
                z = sum(wi * xi for wi, xi in zip(w, x))
                e = 1 - 1 / (1 + math.exp(-max(-30, min(30, z))))  # 1 - sigma(z)
                for i in range(nf):
                    grad[i] += e * x[i]
            for i in range(nf):
                w[i] += pas * (grad[i] / n - l2 * w[i])
        self.poids = w

    def proba(self, a, b, surface, date=None, niveau="G"):
        date = date or datetime.date.today().toordinal()
        x = self.vecteur(a, b, surface, date, niveau)
        z = sum(w * xi / e for w, xi, e in zip(self.poids, x, self.ecarts))
        p = 1 / (1 + math.exp(-max(-30, min(30, z))))
        contributions = sorted(
            zip(NOMS_FEATURES, [w * xi / e for w, xi, e in
                                zip(self.poids, x, self.ecarts)]),
            key=lambda c: abs(c[1]), reverse=True)
        return p, x, contributions

    # ---- cache des poids ----
    def sauver_poids(self, n_exemples):
        with open(FICHIER_POIDS, "w", encoding="utf-8") as f:
            json.dump({"n": n_exemples, "poids": self.poids,
                       "ecarts": self.ecarts, "features": NOMS_FEATURES}, f)

    def charger_poids(self, n_exemples):
        try:
            with open(FICHIER_POIDS, encoding="utf-8") as f:
                d = json.load(f)
            if d["n"] == n_exemples and d["features"] == NOMS_FEATURES:
                self.poids, self.ecarts = d["poids"], d["ecarts"]
                return True
        except (OSError, ValueError, KeyError):
            pass
        return False


def construire_moteur(matchs, verbeux=True):
    """Construit le moteur complet : état + entraînement (avec cache)."""
    moteur = Moteur()
    exemples = [e for m in matchs if (e := moteur.ingerer(m)) is not None]
    if moteur.charger_poids(len(exemples)):
        if verbeux:
            print(f"Modèle multi-facteurs : {len(exemples)} exemples, "
                  "poids chargés depuis le cache.")
    else:
        if verbeux:
            print(f"Entraînement du modèle sur {len(exemples)} matchs "
                  "(régression logistique, ~30 s la première fois)...")
        moteur.entrainer(exemples)
        moteur.sauver_poids(len(exemples))
    return moteur


# ----------------------------------------------------------------------
# Backtest : train < 2026, test 2026, comparaison avec l'Elo seul
# ----------------------------------------------------------------------

def backtest():
    import glob as _glob
    fichiers = sorted(_glob.glob(os.path.join(DOSSIER, "donnees", "*matches*_[0-9]*.csv")))
    fichiers += sorted(_glob.glob(os.path.join(DOSSIER, "donnees", "resultats_recents*.csv")))
    matchs = charger_matchs(fichiers)
    seuil = datetime.date(2026, 1, 1).toordinal()
    train = [m for m in matchs if m["date"] < seuil]
    test = [m for m in matchs if m["date"] >= seuil]
    print(f"Entraînement : {len(train)} matchs (< 2026) | Test : {len(test)} matchs (2026)")

    moteur = Moteur()
    exemples = [e for m in train if (e := moteur.ingerer(m)) is not None]
    moteur.entrainer(exemples)

    bons = bons_elo = total = 0
    ll = ll_elo = 0.0
    for m in test:
        g, p = m["gagnante"], m["perdante"]
        if moteur.j[g].n() >= 10 and moteur.j[p].n() >= 10:
            proba, _, _ = moteur.proba(g, p, m["surface"], m["date"],
                                       m["niveau"] or "I")
            pe = moteur._p_elo(moteur.elo_combine(g, m["surface"]),
                               moteur.elo_combine(p, m["surface"]))
            total += 1
            bons += proba > 0.5
            bons_elo += pe > 0.5
            ll -= math.log(max(proba, 1e-9))
            ll_elo -= math.log(max(pe, 1e-9))
        moteur.ingerer(m, collecter=False)

    print(f"\nSur {total} matchs de test 2026 (joueuses avec ≥ 10 matchs connus) :")
    print(f"  Multi-facteurs : {bons / total:.1%} de gagnantes trouvées | "
          f"log-loss {ll / total:.4f}")
    print(f"  Elo seul       : {bons_elo / total:.1%} de gagnantes trouvées | "
          f"log-loss {ll_elo / total:.4f}")
    print("\nPoids appris (importance de chaque facteur, échelle normalisée) :")
    for nom, w in sorted(zip(NOMS_FEATURES, moteur.poids),
                         key=lambda c: abs(c[1]), reverse=True):
        print(f"  {nom:<34}{w:+.3f}")


if __name__ == "__main__":
    if "--backtest" in sys.argv:
        backtest()
    else:
        print(__doc__)
