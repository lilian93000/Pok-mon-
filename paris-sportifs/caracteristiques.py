#!/usr/bin/env python3
"""
Moteur de prédiction multi-facteurs pour le tennis WTA — 103 facteurs.

Pour chaque match, 103 indicateurs sont calculés pour chaque joueuse à
partir de l'INTÉGRALITÉ de son historique réel (226 000+ matchs chargés,
circuit principal + qualifications + ITF depuis 2019), répartis en 12
familles :

  1. Elo & niveau        (8)  Elo combiné/global/surface, momentum Elo,
                              distance au pic, classement, points, meilleur
                              classement carrière
  2. Expérience          (5)  matchs carrière, % victoires, années de
                              circuit, expérience du circuit principal
  3. Face-à-face         (3)  H2H total, H2H surface, H2H 2 dernières années
  4. Forme              (12)  fenêtres 3/5/10/25/50 matchs, série, forme
                              sur la surface, forme circuit principal,
                              bilan 52 semaines et trajectoire
  5. Titres & parcours   (6)  titres et finales 52 sem. et carrière, bilan
                              en finale, bilan en quarts et au-delà
  6. Adversité           (6)  bilans vs top 10/50/100, niveau moyen des
                              adversaires (calendrier), scalps récents
  7. Fatigue & rythme   (10)  minutes 7/14/30 j, matchs 7/14/30 j, repos,
                              matchs saison, tournois 90 j, matchs longs
  8. Profil physique     (7)  main, bilan contre ce profil, duel de mains,
                              taille, grande serveuse, âge, distance au pic
  9. Service            (10)  % pts service 10/30 matchs et par surface,
                              % 1res dedans, gains derrière 1re/2de,
                              % jeux de service tenus, aces, doubles fautes
 10. Retour              (7)  % pts retour 10/30 et surface, breaks/match,
                              retour sur 1re/2de, % jeux retour gagnés
 11. Domination          (7)  % jeux/sets/points gagnés, sets blancs,
                              victoires sèches, marge moyenne, rythme
 12. Clutch & mental    (10)  sets décisifs, tie-breaks, balles de break
                              sauvées, remontées après set perdu, départs
                              rapides, conversion, défaillances
 + Surface & contexte   (12)  spécialisation, adaptation récente,
                              polyvalence, Grand Chelem, gros matchs,
                              abandons récents (santé), usure

Le poids de chaque facteur est appris par régression logistique (pure
Python) sur les matchs du circuit principal uniquement — là où l'on
parie — les matchs ITF/qualifications nourrissant les fiches.

    P(A bat B) = sigmoide( somme_i poids_i * (x_i(A) - x_i(B)) )

Backtest :  python3 caracteristiques.py --backtest
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
VERSION_MODELE = 6

# Fin des données officielles (miroir Sackmann mikecristancho) : au-delà, on
# ne dispose que d'une ingestion manuelle incomplète. Un « trou » dans
# l'historique d'une joueuse qui ENJAMBE cette date n'est donc PAS une vraie
# absence (blessure/pause) mais un trou de données connu : on ne doit ni
# lever d'alerte « retour d'absence », ni appliquer le boost Elo de retour.
# À relever si un miroir plus frais réapparaît.
CUTOFF_DONNEES_OFFICIELLES = datetime.date(2026, 4, 21).toordinal()


def _gap_est_trou_donnees(d1, d2):
    """Le gap [d1, d2] est-il dû au trou de données post-avril plutôt qu'à une
    vraie absence ? Vrai si le gap DÉBUTE autour de la fin des données
    officielles (à ±3 semaines) et se termine après : c'est alors la période
    mai→été où le miroir ne fournit plus rien, pas une blessure. Un gap
    entièrement postérieur (ex. juillet→octobre) reste, lui, une vraie absence."""
    return d1 <= CUTOFF_DONNEES_OFFICIELLES + 21 and d2 > CUTOFF_DONNEES_OFFICIELLES

TRAD_SURFACE = {"hard": "dur", "clay": "terre", "grass": "gazon",
                "carpet": "dur", "dur": "dur", "terre": "terre", "gazon": "gazon"}
DECALAGE_TOUR = {"R128": 0, "R64": 1, "R32": 2, "R16": 4, "QF": 5, "SF": 6,
                 "F": 7, "RR": 2, "BR": 6, "ER": 0}
TOURS_TARDIFS = {"QF", "SF", "F", "BR"}
MIN_MATCHS_ENTRAINEMENT = 5

FAMILLES = [
    ("Elo & niveau", 8), ("Expérience", 5), ("Face-à-face", 3),
    ("Forme", 12), ("Titres & parcours", 6), ("Adversité", 6),
    ("Fatigue & rythme", 10), ("Profil physique", 7), ("Service", 10),
    ("Retour", 7), ("Domination", 7), ("Clutch & mental", 10),
    ("Surface & contexte", 12),
]

NOMS_FEATURES = [
    # 1. Elo & niveau (8)
    "Elo combiné (proba)", "Elo global", "Elo surface",
    "Momentum Elo (10 matchs)", "Elo vs pic carrière",
    "Classement WTA", "Points de classement", "Meilleur classement carrière",
    # 2. Expérience (5)
    "Expérience (nb matchs)", "% victoires carrière", "Années de circuit",
    "Expérience circuit principal", "% victoires circuit principal",
    # 3. Face-à-face (3)
    "H2H direct", "H2H sur cette surface", "H2H 2 dernières années",
    # 4. Forme (12)
    "Forme 3 derniers", "Forme 5 derniers", "Forme 10 derniers",
    "Forme 25 derniers", "Forme 50 derniers", "Série en cours",
    "Forme surface (5 der.)", "Forme surface (15 der.)",
    "Forme circuit principal (10 der.)", "Bilan 52 semaines",
    "Trajectoire (52 sem. vs carrière)", "Volume de victoires 52 sem.",
    # 5. Titres & parcours (6)
    "Titres 52 semaines", "Finales 52 semaines", "Titres carrière",
    "Bilan en finale", "Bilan en quarts et +", "Profondeur de parcours 52 sem.",
    # 6. Adversité (6)
    "Bilan vs top 10", "Bilan vs top 50", "Bilan vs top 100",
    "Niveau des adversaires battues 52 sem.", "Force du calendrier 52 sem.",
    "Scalps top 50 (52 sem.)",
    # 7. Fatigue & rythme (10)
    "Minutes jouées 7 jours", "Minutes jouées 14 jours", "Minutes jouées 30 jours",
    "Matchs 7 jours", "Matchs 14 jours", "Matchs 30 jours",
    "Jours de repos", "Matchs cette saison", "Tournois 90 jours",
    "Matchs longs (>2h) 30 jours",
    # 8. Profil physique (7)
    "Gauchère", "Bilan vs ce profil de main", "Duel gauchère-droitière",
    "Taille", "Grande serveuse (>=180cm)", "Âge", "Distance au pic (24,5 ans)",
    # 9. Service (10)
    "Service: % pts gagnés (10 der.)", "Service: % pts gagnés (30 der.)",
    "Service: % pts surface (10 der.)", "% 1res balles dedans",
    "% gagnés derrière la 1re", "% gagnés derrière la 2de",
    "% jeux de service tenus", "Aces/match", "Doubles fautes/match",
    "Solde aces - doubles fautes",
    # 10. Retour (7)
    "Retour: % pts gagnés (10 der.)", "Retour: % pts gagnés (30 der.)",
    "Retour: % pts surface (10 der.)", "Breaks réalisés/match",
    "Retour sur 1re balle", "Retour sur 2de balle", "% jeux de retour gagnés",
    # 11. Domination (7)
    "% jeux gagnés (10 der.)", "% sets gagnés (10 der.)",
    "% points totaux gagnés (10 der.)", "Sets blancs infligés (10 der.)",
    "% victoires en 2 sets secs", "Marge moyenne en jeux", "Minutes/match (rythme)",
    # 12. Clutch & mental (10)
    "Sets décisifs (carrière)", "Sets décisifs (20 der.)",
    "Tie-breaks (carrière)", "Tie-breaks (20 der.)",
    "BdB sauvées (carrière)", "BdB sauvées (20 der.)",
    "Remontées après set perdu", "% 1er set gagné (10 der.)",
    "Conversion après set 1 gagné", "Défaillances après set 1 gagné (20 der.)",
    # 13. Surface & contexte (12)
    "% victoires surface (carrière)", "% victoires surface (52 sem.)",
    "Expérience de la surface", "Spécialisation surface",
    "Écart Elo surface/global", "Adaptation: matchs surface 30 j",
    "Polyvalence (autres surfaces 52 sem.)", "Bilan Grand Chelem",
    "Bilan Grand Chelem 52 sem.", "Gros matchs: bilan vs top 20 (52 sem.)",
    "Santé: abandons 52 sem.", "Usure: % matchs en 3 sets (30 j)",
]
assert len(NOMS_FEATURES) == 103, len(NOMS_FEATURES)
assert sum(n for _, n in FAMILLES) == 103


def _f(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def _date_ordinale(tourney_date, tour):
    s = str(tourney_date)
    d = datetime.date(int(s[:4]), int(s[4:6]), int(s[6:8]))
    return d.toordinal() + DECALAGE_TOUR.get(tour, 2)


def _parse_score(score):
    """Analyse un score façon '6-4 3-6 7-6(5) RET' du point de vue de la
    gagnante. Retourne jeux/sets/tie-breaks/1er set/sets blancs/marge."""
    gw = gl = sw = sl = tbw = tbl = blancs = 0
    fsw = None
    for token in score.split():
        base = token.split("(")[0].strip("[]")
        if "-" not in base:
            continue
        a, _, b = base.partition("-")
        try:
            a, b = int(a), int(b)
        except ValueError:
            continue
        if a > 20 or b > 20:      # super tie-break noté [10-8]
            if fsw is None:
                fsw = a > b
            (sw, sl) = (sw + 1, sl) if a > b else (sw, sl + 1)
            continue
        gw += a
        gl += b
        if fsw is None:
            fsw = a > b
        if a > b:
            sw += 1
            if {a, b} == {7, 6}:
                tbw += 1
            if b <= 1 and a >= 6:
                blancs += 1
        else:
            sl += 1
            if {a, b} == {7, 6}:
                tbl += 1
    return {"gw": gw, "gl": gl, "sw": sw, "sl": sl, "tbw": tbw, "tbl": tbl,
            "blancs": blancs, "fsw": fsw if fsw is not None else True,
            "marge": gw - gl}


def charger_matchs(chemins):
    """Charge les CSV (format Sackmann complet ou format simple) triés
    chronologiquement, avec stats détaillées et score analysé."""
    matchs = []
    for chemin in chemins:
        secondaire = "qual_itf" in os.path.basename(chemin)
        with open(chemin, newline="", encoding="utf-8") as f:
            lecteur = csv.DictReader(f)
            sackmann = "winner_name" in (lecteur.fieldnames or [])
            for L in lecteur:
                if sackmann:
                    surface = TRAD_SURFACE.get((L["surface"] or "").strip().lower())
                    score = (L.get("score") or "").upper()
                    if surface is None or "W/O" in score or "WEA" in score:
                        continue

                    def joueuse(px, autre):
                        svpt = _f(L.get(f"{px}_svpt"))
                        in1 = _f(L.get(f"{px}_1stIn"))
                        w1 = _f(L.get(f"{px}_1stWon"))
                        w2 = _f(L.get(f"{px}_2ndWon"))
                        svg = _f(L.get(f"{px}_SvGms"))
                        bps = _f(L.get(f"{px}_bpSaved"))
                        bpf = _f(L.get(f"{px}_bpFaced"))
                        o_bps = _f(L.get(f"{autre}_bpSaved"))
                        o_bpf = _f(L.get(f"{autre}_bpFaced"))
                        prefixe = "winner" if px == "w" else "loser"
                        return {
                            "main": (L.get(f"{prefixe}_hand") or "U").strip(),
                            "taille": _f(L.get(f"{prefixe}_ht")),
                            "age": _f(L.get(f"{prefixe}_age")),
                            "rang": _f(L.get(f"{prefixe}_rank")),
                            "pts_rang": _f(L.get(f"{prefixe}_rank_points")),
                            "ace": _f(L.get(f"{px}_ace")), "df": _f(L.get(f"{px}_df")),
                            "svpt": svpt,
                            "svwon": (w1 or 0) + (w2 or 0) if svpt else None,
                            "in1": in1 / svpt if svpt and in1 is not None else None,
                            "w1": w1 / in1 if in1 and w1 is not None else None,
                            "w2": w2 / (svpt - in1) if svpt and in1 is not None
                                  and w2 is not None and svpt > in1 else None,
                            "svgms": svg,
                            "tenue": (svg - ((bpf or 0) - (bps or 0))) / svg
                                     if svg else None,
                            "bps": bps, "bpf": bpf,
                            "brk": (o_bpf or 0) - (o_bps or 0) if o_bpf is not None
                                   else None,
                        }

                    m = {
                        "date": _date_ordinale(L["tourney_date"], L.get("round", "")),
                        "cle": (L["tourney_date"], L["tourney_id"],
                                int(L["match_num"] or 0)),
                        "gagnante": L["winner_name"].strip(),
                        "perdante": L["loser_name"].strip(),
                        "surface": surface,
                        "niveau": (L.get("tourney_level") or "").strip(),
                        "circuit": "S" if secondaire else "P",
                        "tour": (L.get("round") or "").strip(),
                        "tournoi": L["tourney_id"],
                        "minutes": _f(L.get("minutes")),
                        "sc": _parse_score(score),
                        "ret": "RET" in score,
                        "g": joueuse("w", "l"),
                        "p": joueuse("l", "w"),
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
                        "surface": surface, "niveau": "", "circuit": "P",
                        "tour": "", "tournoi": "manuel:" + L.get("tournoi", ""),
                        "minutes": None, "sc": None, "ret": False,
                        "g": {}, "p": {},
                    }
                matchs.append(m)
    if not matchs:
        sys.exit("Aucun match exploitable.")
    matchs.sort(key=lambda m: m["cle"])
    return matchs


class Joueuse:
    """État cumulatif d'une joueuse. `hist` garde une entrée compacte par
    match ; les compteurs carrière sont incrémentaux."""

    def __init__(self):
        self.hist = []
        self.v = self.d = 0
        self.v_surface = defaultdict(int)
        self.d_surface = defaultdict(int)
        self.v_main = defaultdict(int)
        self.d_main = defaultdict(int)
        self.v_gc = self.d_gc = 0
        self.v_dec = self.d_dec = 0
        self.tb_v = self.tb_d = 0
        self.bps_c = self.bpf_c = 0
        self.v_fin = self.d_fin = 0          # finales
        self.v_qf = self.d_qf = 0            # quarts et au-delà
        self.v_t10 = self.d_t10 = 0
        self.v_t50 = self.d_t50 = 0
        self.v_t100 = self.d_t100 = 0
        self.cb_v = 0                        # victoires après 1er set perdu
        self.set1_perdu = 0
        self.conv_v = 0                      # victoires après 1er set gagné
        self.set1_gagne = 0
        self.v_P = self.d_P = 0              # circuit principal
        self.titres = 0
        self.main = "U"
        self.taille = None
        self.age = None
        self.rang = None
        self.pts_rang = None
        self.meilleur_rang = None
        self.premier_match = None

    def n(self):
        return self.v + self.d

    def maj(self, victoire, m, moi, adv):
        date = m["date"]
        if self.premier_match is None:
            self.premier_match = date
        sc = m["sc"]
        entree = {
            "d": date, "v": victoire, "mn": m["minutes"],
            "surf": m["surface"], "P": m["circuit"] == "P",
            "rd": m["tour"], "trn": m["tournoi"],
            "opp_rang": adv.get("rang"),
            "sv": None, "rt": None, "in1": moi.get("in1"),
            "w1": moi.get("w1"), "w2": moi.get("w2"),
            "tenue": moi.get("tenue"), "ace": moi.get("ace"),
            "df": moi.get("df"), "bps": moi.get("bps"), "bpf": moi.get("bpf"),
            "brk": moi.get("brk"), "opp_svgms": adv.get("svgms"),
            "pts": None, "g_pct": None, "s_pct": None, "blancs": 0,
            "marge": 0, "sec": None, "fsw": None, "tb": (0, 0),
        }
        if moi.get("svpt") and moi.get("svwon") is not None:
            entree["sv"] = moi["svwon"] / moi["svpt"]
        if adv.get("svpt") and adv.get("svwon") is not None:
            entree["rt"] = 1 - adv["svwon"] / adv["svpt"]
        entree["rt1"] = 1 - adv["w1"] if adv.get("w1") is not None else None
        entree["rt2"] = 1 - adv["w2"] if adv.get("w2") is not None else None
        if (entree["sv"] is not None and entree["rt"] is not None
                and moi.get("svpt") and adv.get("svpt")):
            tot = moi["svpt"] + adv["svpt"]
            entree["pts"] = (moi["svwon"] + adv["svpt"] - adv["svwon"]) / tot
        if sc:
            gw, gl = (sc["gw"], sc["gl"]) if victoire else (sc["gl"], sc["gw"])
            sw, sl = (sc["sw"], sc["sl"]) if victoire else (sc["sl"], sc["sw"])
            entree["g_pct"] = gw / (gw + gl) if gw + gl else None
            entree["s_pct"] = sw / (sw + sl) if sw + sl else None
            entree["blancs"] = sc["blancs"] if victoire else 0
            entree["marge"] = sc["marge"] if victoire else -sc["marge"]
            entree["sec"] = victoire and sc["sl"] == 0
            entree["fsw"] = sc["fsw"] if victoire else not sc["fsw"]
            entree["tb"] = ((sc["tbw"], sc["tbl"]) if victoire
                            else (sc["tbl"], sc["tbw"]))
            self.tb_v += entree["tb"][0]
            self.tb_d += entree["tb"][1]
            decisif = sw + sl >= 3 or (sw + sl == 2 and sw == sl)
            if sw + sl >= 3:
                if victoire:
                    self.v_dec += 1
                else:
                    self.d_dec += 1
            if entree["fsw"]:
                self.set1_gagne += 1
                self.conv_v += victoire
            else:
                self.set1_perdu += 1
                self.cb_v += victoire
        self.hist.append(entree)

        if victoire:
            self.v += 1
            self.v_surface[m["surface"]] += 1
        else:
            self.d += 1
            self.d_surface[m["surface"]] += 1
        if m["circuit"] == "P":
            if victoire:
                self.v_P += 1
            else:
                self.d_P += 1
        main_adv = adv.get("main", "U")
        if main_adv in ("L", "R"):
            (self.v_main if victoire else self.d_main)[main_adv] += 1
        if m["niveau"] == "G" and m["circuit"] != "S":
            if victoire:
                self.v_gc += 1
            else:
                self.d_gc += 1
        if m["tour"] == "F":
            if victoire:
                self.v_fin += 1
                self.titres += 1
            else:
                self.d_fin += 1
        if m["tour"] in TOURS_TARDIFS:
            if victoire:
                self.v_qf += 1
            else:
                self.d_qf += 1
        r = adv.get("rang")
        if r:
            if r <= 10:
                (self.v_t10, self.d_t10) = ((self.v_t10 + 1, self.d_t10)
                                            if victoire else (self.v_t10, self.d_t10 + 1))
            if r <= 50:
                (self.v_t50, self.d_t50) = ((self.v_t50 + 1, self.d_t50)
                                            if victoire else (self.v_t50, self.d_t50 + 1))
            if r <= 100:
                (self.v_t100, self.d_t100) = ((self.v_t100 + 1, self.d_t100)
                                              if victoire else (self.v_t100, self.d_t100 + 1))
        if moi.get("bpf"):
            self.bps_c += moi.get("bps") or 0
            self.bpf_c += moi["bpf"]
        if moi.get("main") in ("L", "R"):
            self.main = moi["main"]
        for cle in ("taille", "age", "rang", "pts_rang"):
            if moi.get(cle) is not None:
                setattr(self, cle, moi[cle])
        if moi.get("rang"):
            self.meilleur_rang = min(self.meilleur_rang or 9999, moi["rang"])

    # ------- helpers de fenêtres -------
    def forme(self, k):
        der = self.hist[-k:]
        return sum(e["v"] for e in der) / len(der) if der else 0.5

    def serie(self):
        s = 0
        for e in reversed(self.hist):
            if s == 0:
                s = 1 if e["v"] else -1
            elif (s > 0) == e["v"]:
                s += 1 if e["v"] else -1
            else:
                break
        return s

    def _52s(self, date, cap=200):
        return [e for e in self.hist[-cap:] if date - e["d"] <= 365]

    def _fenetre_jours(self, date, jours, cap=60):
        return [e for e in self.hist[-cap:] if date - e["d"] <= jours]

    def minutes_recentes(self, date, jours=14):
        return sum(e["mn"] or 0 for e in self._fenetre_jours(date, jours))

    def matchs_recents(self, date, jours=7):
        return len(self._fenetre_jours(date, jours))

    def repos(self, date):
        # plafonné à 30 j : au-delà c'est de l'absence (captée par la forme
        # et l'Elo), et un retard d'ingestion ne crée plus d'écart géant
        return min(date - self.hist[-1]["d"], 30) if self.hist else 30

    @staticmethod
    def taux(v, d):
        return (v + 1) / (v + d + 2)

    @staticmethod
    def moy(valeurs, defaut):
        vals = [x for x in valeurs if x is not None]
        return sum(vals) / len(vals) if vals else defaut

    def stat(self, cle, k, defaut, surf=None, cap=250):
        """Moyenne de la stat `cle` sur les k derniers matchs (option surface)."""
        if surf is None:
            src = self.hist[-k * 3:]
        else:
            src = [e for e in self.hist[-cap:] if e["surf"] == surf]
        vals = [e[cle] for e in src if e[cle] is not None][-k:]
        return sum(vals) / len(vals) if vals else defaut

    # compat fiche tennis.py
    @property
    def serve(self):
        return [e["sv"] for e in self.hist[-10:] if e["sv"] is not None]

    @property
    def retour(self):
        return [e["rt"] for e in self.hist[-10:] if e["rt"] is not None]

    @property
    def aces(self):
        return [e["ace"] for e in self.hist[-10:] if e["ace"] is not None]

    @property
    def df(self):
        return [e["df"] for e in self.hist[-10:] if e["df"] is not None]

    @property
    def bp(self):
        return [(e["bps"], e["bpf"]) for e in self.hist[-20:] if e["bpf"]]


class Moteur:
    """Elo + 103 facteurs + régression logistique."""

    def __init__(self):
        self.j = defaultdict(Joueuse)
        self.elo_g = defaultdict(lambda: 1500.0)
        self.elo_s = {s: defaultdict(lambda: 1500.0) for s in ("dur", "terre", "gazon")}
        self.n_elo = defaultdict(int)
        self.n_elo_s = {s: defaultdict(int) for s in ("dur", "terre", "gazon")}
        self.elo_hist = defaultdict(list)    # 11 derniers Elo globaux
        self.elo_pic = defaultdict(lambda: 1500.0)
        self.h2h = defaultdict(int)
        self.h2h_s = defaultdict(int)
        self.h2h_dates = defaultdict(list)   # dates des victoires de (A,B)
        self.derniere_date = {}              # dernier match joué par joueuse
        self.boost_k = defaultdict(int)      # matchs restants à K accéléré
        self.date_max = 0                    # date du match le plus récent ingéré
        self.poids = None
        self.ecarts = None

    def date_ref(self, date=None):
        """Date de référence pour « aujourd'hui » : la donnée la plus récente
        ingérée, PAS l'horloge système (qui peut dériver de la timeline des
        données). Évite de croire toutes les fiches périmées."""
        if date is not None:
            return date
        return self.date_max or datetime.date.today().toordinal()

    @staticmethod
    def _p_elo(ra, rb):
        return 1 / (1 + 10 ** (-(ra - rb) / 400))

    def _maj_elo(self, table, npar, g, p, mult_g=1.0, mult_p=1.0):
        pg = self._p_elo(table[g], table[p])
        table[g] += mult_g * 250 / (npar[g] + 5) ** 0.4 * (1 - pg)
        table[p] -= mult_p * 250 / (npar[p] + 5) ** 0.4 * (1 - pg)
        npar[g] += 1
        npar[p] += 1

    def elo_combine(self, nom, surface):
        if self.n_elo_s[surface][nom] > 0:
            return 0.5 * self.elo_g[nom] + 0.5 * self.elo_s[surface][nom]
        return self.elo_g[nom]

    # ------------------------------------------------------------------
    # Le vecteur des 103 différences A - B
    # ------------------------------------------------------------------
    def vecteur(self, a, b, surface, date, niveau="G"):
        A, B = self.j[a], self.j[b]
        t = Joueuse.taux
        gc = niveau == "G"

        def paire(f):
            return f(A, a) - f(B, b)

        def rang_score(J):
            return -math.log(J.rang if J.rang else 150)

        def h2h_recent(x, y):
            return sum(1 for d in self.h2h_dates[(x, y)] if date - d <= 730)

        def annees(J):
            return (date - J.premier_match) / 365 if J.premier_match else 0

        def titres_52(J):
            return sum(1 for e in J._52s(date) if e["rd"] == "F" and e["v"])

        def finales_52(J):
            return sum(1 for e in J._52s(date) if e["rd"] == "F")

        def profondeur(J):
            der = J._52s(date)
            return (sum(1 for e in der if e["rd"] in TOURS_TARDIFS) / len(der)
                    if der else 0)

        def scalps(J, seuil=50):
            return sum(1 for e in J._52s(date)
                       if e["v"] and e["opp_rang"] and e["opp_rang"] <= seuil)

        def calendrier(J):
            rangs = [e["opp_rang"] for e in J._52s(date) if e["opp_rang"]]
            return -math.log(sum(rangs) / len(rangs)) if rangs else -math.log(150)

        def battues_52(J):
            rangs = [e["opp_rang"] for e in J._52s(date) if e["v"] and e["opp_rang"]]
            return -math.log(sum(rangs) / len(rangs)) if rangs else -math.log(200)

        def bilan_52(J):
            der = J._52s(date)
            return sum(e["v"] for e in der) / len(der) if der else 0.5

        def vict_52(J):
            return math.log(1 + sum(e["v"] for e in J._52s(date)))

        def tournois_90j(J):
            return len({e["trn"] for e in J._fenetre_jours(date, 90, cap=40)})

        def longs_30j(J):
            return sum(1 for e in J._fenetre_jours(date, 30, cap=40)
                       if (e["mn"] or 0) > 120)

        def saison(J):
            debut = datetime.date.fromordinal(int(date)).replace(month=1, day=1)
            return sum(1 for e in J.hist[-80:] if e["d"] >= debut.toordinal())

        def forme_surf(J, k):
            der = [e for e in J.hist[-250:] if e["surf"] == surface][-k:]
            return sum(e["v"] for e in der) / len(der) if der else 0.5

        def forme_P(J, k):
            der = [e for e in J.hist[-150:] if e["P"]][-k:]
            return sum(e["v"] for e in der) / len(der) if der else 0.5

        def surf_52(J):
            der = [e for e in J._52s(date) if e["surf"] == surface]
            return sum(e["v"] for e in der) / len(der) if der else 0.5

        def autres_52(J):
            der = [e for e in J._52s(date) if e["surf"] != surface]
            return sum(e["v"] for e in der) / len(der) if der else 0.5

        def gc_52(J):
            der = [e for e in J._52s(date) if e["rd"] and e["P"]]
            # approximation : matchs de Grand Chelem = tournois niveau G
            return 0.0  # remplacé plus bas par les compteurs dédiés

        def top20_52(J):
            v = sum(1 for e in J._52s(date)
                    if e["v"] and e["opp_rang"] and e["opp_rang"] <= 20)
            d = sum(1 for e in J._52s(date)
                    if not e["v"] and e["opp_rang"] and e["opp_rang"] <= 20)
            return t(v, d)

        def abandons_52(J):
            # défaites écourtées (abandon) sur 52 semaines : signal blessure
            return sum(1 for e in J._52s(date)
                       if not e["v"] and (e["mn"] or 999) < 75 and e["s_pct"] == 0)

        def trois_sets_30j(J):
            der = J._fenetre_jours(date, 30, cap=40)
            if not der:
                return 0
            return sum(1 for e in der if e["s_pct"] not in (None, 0.0, 1.0)) / len(der)

        def tb20(J):
            w = sum(e["tb"][0] for e in J.hist[-20:])
            l = sum(e["tb"][1] for e in J.hist[-20:])
            return t(w, l)

        def bp20(J):
            s = sum(e["bps"] or 0 for e in J.hist[-20:] if e["bpf"])
            f = sum(e["bpf"] for e in J.hist[-20:] if e["bpf"])
            return (s + 1) / (f + 2)

        def dec20(J):
            der = [e for e in J.hist[-20:] if e["s_pct"] not in (None,)
                   and e["s_pct"] not in (0.0, 1.0)]
            return t(sum(e["v"] for e in der), sum(not e["v"] for e in der))

        def choke20(J):
            der = [e for e in J.hist[-20:] if e["fsw"] is True]
            if not der:
                return 0
            return sum(1 for e in der if not e["v"]) / len(der)

        def elo_momentum(J_nom):
            h = self.elo_hist[J_nom]
            return (self.elo_g[J_nom] - h[0]) / 100 if len(h) >= 10 else 0.0

        x = []
        # --- 1. Elo & niveau (8)
        x.append(self._p_elo(self.elo_combine(a, surface),
                             self.elo_combine(b, surface)) - 0.5)
        x.append((self.elo_g[a] - self.elo_g[b]) / 400)
        x.append((self.elo_s[surface][a] - self.elo_s[surface][b]) / 400)
        x.append(elo_momentum(a) - elo_momentum(b))
        x.append(((self.elo_g[a] - self.elo_pic[a])
                  - (self.elo_g[b] - self.elo_pic[b])) / 100)
        x.append((rang_score(A) - rang_score(B)) / 3)
        x.append((math.log(1 + (A.pts_rang or 100))
                  - math.log(1 + (B.pts_rang or 100))) / 3)
        x.append((-math.log(A.meilleur_rang or 150)
                  + math.log(B.meilleur_rang or 150)) / 3)
        # --- 2. Expérience (5)
        x.append((math.log(1 + A.n()) - math.log(1 + B.n())) / 3)
        x.append(t(A.v, A.d) - t(B.v, B.d))
        x.append((annees(A) - annees(B)) / 10)
        x.append((math.log(1 + A.v_P + A.d_P) - math.log(1 + B.v_P + B.d_P)) / 3)
        x.append(t(A.v_P, A.d_P) - t(B.v_P, B.d_P))
        # --- 3. H2H (3)
        h_ab, h_ba = self.h2h[(a, b)], self.h2h[(b, a)]
        hs_ab, hs_ba = self.h2h_s[(a, b, surface)], self.h2h_s[(b, a, surface)]
        hr_ab, hr_ba = h2h_recent(a, b), h2h_recent(b, a)
        x.append((h_ab - h_ba) / (h_ab + h_ba + 2))
        x.append((hs_ab - hs_ba) / (hs_ab + hs_ba + 2))
        x.append((hr_ab - hr_ba) / (hr_ab + hr_ba + 2))
        # --- 4. Forme (12)
        for k in (3, 5, 10, 25, 50):
            x.append(A.forme(k) - B.forme(k))
        x.append((max(-5, min(5, A.serie())) - max(-5, min(5, B.serie()))) / 5)
        x.append(forme_surf(A, 5) - forme_surf(B, 5))
        x.append(forme_surf(A, 15) - forme_surf(B, 15))
        x.append(forme_P(A, 10) - forme_P(B, 10))
        x.append(bilan_52(A) - bilan_52(B))
        x.append((bilan_52(A) - t(A.v, A.d)) - (bilan_52(B) - t(B.v, B.d)))
        x.append((vict_52(A) - vict_52(B)) / 3)
        # --- 5. Titres & parcours (6)
        x.append((titres_52(A) - titres_52(B)) / 3)
        x.append((finales_52(A) - finales_52(B)) / 3)
        x.append((math.log(1 + A.titres) - math.log(1 + B.titres)) / 2)
        x.append(t(A.v_fin, A.d_fin) - t(B.v_fin, B.d_fin))
        x.append(t(A.v_qf, A.d_qf) - t(B.v_qf, B.d_qf))
        x.append(profondeur(A) - profondeur(B))
        # --- 6. Adversité (6)
        x.append(t(A.v_t10, A.d_t10) - t(B.v_t10, B.d_t10))
        x.append(t(A.v_t50, A.d_t50) - t(B.v_t50, B.d_t50))
        x.append(t(A.v_t100, A.d_t100) - t(B.v_t100, B.d_t100))
        x.append((battues_52(A) - battues_52(B)) / 2)
        x.append((calendrier(A) - calendrier(B)) / 2)
        x.append((scalps(A) - scalps(B)) / 5)
        # --- 7. Fatigue & rythme (10)
        for jours in (7, 14, 30):
            x.append((A.minutes_recentes(date, jours)
                      - B.minutes_recentes(date, jours)) / 600)
        for jours in (7, 14, 30):
            x.append((A.matchs_recents(date, jours)
                      - B.matchs_recents(date, jours)) / 5)
        x.append((A.repos(date) - B.repos(date)) / 30)
        x.append((saison(A) - saison(B)) / 30)
        x.append((tournois_90j(A) - tournois_90j(B)) / 5)
        x.append((longs_30j(A) - longs_30j(B)) / 5)
        # --- 8. Profil physique (7)
        x.append((A.main == "L") - (B.main == "L"))
        x.append(t(A.v_main[B.main], A.d_main[B.main])
                 - t(B.v_main[A.main], B.d_main[A.main]))
        x.append((1 if A.main == "L" and B.main == "R" else 0)
                 - (1 if B.main == "L" and A.main == "R" else 0))
        x.append(((A.taille or 170) - (B.taille or 170)) / 20)
        x.append(((A.taille or 170) >= 180) - ((B.taille or 170) >= 180))
        x.append(((A.age or 24.5) - (B.age or 24.5)) / 10)
        x.append((-abs((A.age or 24.5) - 24.5) + abs((B.age or 24.5) - 24.5)) / 10)
        # --- 9. Service (10)
        x.append(A.stat("sv", 10, 0.55) - B.stat("sv", 10, 0.55))
        x.append(A.stat("sv", 30, 0.55) - B.stat("sv", 30, 0.55))
        x.append(A.stat("sv", 10, 0.55, surf=surface)
                 - B.stat("sv", 10, 0.55, surf=surface))
        x.append(A.stat("in1", 10, 0.62) - B.stat("in1", 10, 0.62))
        x.append(A.stat("w1", 10, 0.60) - B.stat("w1", 10, 0.60))
        x.append(A.stat("w2", 10, 0.45) - B.stat("w2", 10, 0.45))
        x.append(A.stat("tenue", 10, 0.65) - B.stat("tenue", 10, 0.65))
        x.append((A.stat("ace", 10, 2) - B.stat("ace", 10, 2)) / 10)
        x.append(-(A.stat("df", 10, 3) - B.stat("df", 10, 3)) / 10)
        x.append((A.stat("ace", 10, 2) - A.stat("df", 10, 3)
                  - B.stat("ace", 10, 2) + B.stat("df", 10, 3)) / 10)
        # --- 10. Retour (7)
        x.append(A.stat("rt", 10, 0.45) - B.stat("rt", 10, 0.45))
        x.append(A.stat("rt", 30, 0.45) - B.stat("rt", 30, 0.45))
        x.append(A.stat("rt", 10, 0.45, surf=surface)
                 - B.stat("rt", 10, 0.45, surf=surface))
        x.append((A.stat("brk", 10, 2) - B.stat("brk", 10, 2)) / 5)
        x.append(A.stat("rt1", 10, 0.40) - B.stat("rt1", 10, 0.40))
        x.append(A.stat("rt2", 10, 0.55) - B.stat("rt2", 10, 0.55))
        x.append((A.stat("brk", 10, 2) / max(A.stat("opp_svgms", 10, 10), 1)
                  - B.stat("brk", 10, 2) / max(B.stat("opp_svgms", 10, 10), 1)))
        # --- 11. Domination (7)
        x.append(A.stat("g_pct", 10, 0.5) - B.stat("g_pct", 10, 0.5))
        x.append(A.stat("s_pct", 10, 0.5) - B.stat("s_pct", 10, 0.5))
        x.append(A.stat("pts", 10, 0.5) - B.stat("pts", 10, 0.5))
        x.append((sum(e["blancs"] for e in A.hist[-10:])
                  - sum(e["blancs"] for e in B.hist[-10:])) / 5)
        x.append(Joueuse.moy([e["sec"] for e in A.hist[-10:]], 0.3)
                 - Joueuse.moy([e["sec"] for e in B.hist[-10:]], 0.3))
        x.append((A.stat("marge", 10, 0) - B.stat("marge", 10, 0)) / 6)
        x.append((A.stat("mn", 10, 100) - B.stat("mn", 10, 100)) / 60)
        # --- 12. Clutch & mental (10)
        x.append(t(A.v_dec, A.d_dec) - t(B.v_dec, B.d_dec))
        x.append(dec20(A) - dec20(B))
        x.append(t(A.tb_v, A.tb_d) - t(B.tb_v, B.tb_d))
        x.append(tb20(A) - tb20(B))
        x.append((A.bps_c + 1) / (A.bpf_c + 2) - (B.bps_c + 1) / (B.bpf_c + 2))
        x.append(bp20(A) - bp20(B))
        x.append(t(A.cb_v, A.set1_perdu - A.cb_v)
                 - t(B.cb_v, B.set1_perdu - B.cb_v))
        x.append(Joueuse.moy([e["fsw"] for e in A.hist[-10:]], 0.5)
                 - Joueuse.moy([e["fsw"] for e in B.hist[-10:]], 0.5))
        x.append(t(A.conv_v, A.set1_gagne - A.conv_v)
                 - t(B.conv_v, B.set1_gagne - B.conv_v))
        x.append(-(choke20(A) - choke20(B)))
        # --- 13. Surface & contexte (12)
        x.append(t(A.v_surface[surface], A.d_surface[surface])
                 - t(B.v_surface[surface], B.d_surface[surface]))
        x.append(surf_52(A) - surf_52(B))
        x.append((math.log(1 + A.v_surface[surface] + A.d_surface[surface])
                  - math.log(1 + B.v_surface[surface] + B.d_surface[surface])) / 3)
        x.append((t(A.v_surface[surface], A.d_surface[surface]) - t(A.v, A.d))
                 - (t(B.v_surface[surface], B.d_surface[surface]) - t(B.v, B.d)))
        x.append(((self.elo_s[surface][a] - self.elo_g[a])
                  - (self.elo_s[surface][b] - self.elo_g[b])) / 100)
        x.append((sum(1 for e in A._fenetre_jours(date, 30, cap=40)
                      if e["surf"] == surface)
                  - sum(1 for e in B._fenetre_jours(date, 30, cap=40)
                        if e["surf"] == surface)) / 5)
        x.append(autres_52(A) - autres_52(B))
        x.append((t(A.v_gc, A.d_gc) - t(B.v_gc, B.d_gc)) if gc else 0.0)
        x.append((bilan_52(A) - bilan_52(B)) if gc else 0.0)
        x.append(top20_52(A) - top20_52(B))
        x.append(-(abandons_52(A) - abandons_52(B)) / 2)
        x.append(-(trois_sets_30j(A) - trois_sets_30j(B)))
        assert len(x) == 103
        return x

    # ------------------------------------------------------------------
    def ingerer(self, m, collecter=True):
        g, p = m["gagnante"], m["perdante"]
        if m["date"] > self.date_max:
            self.date_max = m["date"]
        exemple = None
        if (collecter and m.get("circuit") == "P"
                and self.j[g].n() >= MIN_MATCHS_ENTRAINEMENT
                and self.j[p].n() >= MIN_MATCHS_ENTRAINEMENT):
            exemple = self.vecteur(g, p, m["surface"], m["date"],
                                   m["niveau"] or "I")
        if m.get("circuit") == "S":
            mult = 0.75 if m["niveau"] in ("G", "P", "PM", "I") else 0.5
        else:
            mult = 1.0
        # après une absence de 90+ jours, l'incertitude sur le niveau est
        # grande : le K est accéléré (x1.75) pendant 8 matchs pour que
        # l'Elo rattrape vite la réalité du retour (blessure, pause...)
        mults = {}
        for nom in (g, p):
            der = self.derniere_date.get(nom)
            if (der is not None and m["date"] - der > 90
                    and not _gap_est_trou_donnees(der, m["date"])):
                self.boost_k[nom] = 8
            mults[nom] = mult * (1.75 if self.boost_k[nom] > 0 else 1.0)
            if self.boost_k[nom] > 0:
                self.boost_k[nom] -= 1
            self.derniere_date[nom] = m["date"]
        self._maj_elo(self.elo_g, self.n_elo, g, p, mults[g], mults[p])
        self._maj_elo(self.elo_s[m["surface"]], self.n_elo_s[m["surface"]],
                      g, p, mults[g], mults[p])
        for nom in (g, p):
            h = self.elo_hist[nom]
            h.append(self.elo_g[nom])
            if len(h) > 11:
                del h[0]
            self.elo_pic[nom] = max(self.elo_pic[nom], self.elo_g[nom])
        self.h2h[(g, p)] += 1
        self.h2h_s[(g, p, m["surface"])] += 1
        self.h2h_dates[(g, p)].append(m["date"])
        self.j[g].maj(True, m, m["g"], m["p"])
        self.j[p].maj(False, m, m["p"], m["g"])
        return exemple

    # ------------------------------------------------------------------
    def entrainer(self, exemples, iterations=200, pas=0.5, l2=3e-3):
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
                e = 1 - 1 / (1 + math.exp(-max(-30, min(30, z))))
                for i in range(nf):
                    grad[i] += e * x[i]
            for i in range(nf):
                w[i] += pas * (grad[i] / n - l2 * w[i])
        self.poids = w

    def proba(self, a, b, surface, date=None, niveau="G"):
        date = self.date_ref(date)
        x = self.vecteur(a, b, surface, date, niveau)
        contribs = [w * xi / e for w, xi, e in zip(self.poids, x, self.ecarts)]
        z = sum(contribs)
        p = 1 / (1 + math.exp(-max(-30, min(30, z))))
        contributions = sorted(zip(NOMS_FEATURES, contribs),
                               key=lambda c: abs(c[1]), reverse=True)
        return p, x, contributions

    def avertissements(self, a, b, date=None):
        """Détecte les 3 profils où le modèle se trompe souvent : retard
        d'ingestion, retour d'absence longue, montée récente en ITF."""
        date = self.date_ref(date)
        alertes = []
        for nom in (a, b):
            J = self.j[nom]
            if not J.hist:
                alertes.append(f"{nom} : aucune donnée")
                continue
            trou = date - J.hist[-1]["d"]
            if 20 < trou < 120:
                alertes.append(
                    f"{nom} : aucun match depuis {trou} j dans la base — "
                    "retard d'ingestion probable ou absence, fiche périmée")
            dates = [e["d"] for e in J.hist[-40:]]
            # seul un retour RÉCENT (gap terminé dans les ~120 derniers jours)
            # rend la forme actuelle incertaine ; un vieux break d'intersaison
            # n'est pas pertinent. On exclut aussi les trous de données.
            if any(d2 - d1 > 90 and not _gap_est_trou_donnees(d1, d2)
                   for d1, d2 in zip(dates, dates[1:])
                   if date - d2 <= 120):
                alertes.append(
                    f"{nom} : retour d'absence longue sur les 12 derniers "
                    "mois — niveau réel incertain (blessure/pause)")
            recents = J.hist[-20:]
            if len(recents) >= 10 and sum(not e["P"] for e in recents) / len(recents) > 0.6:
                alertes.append(
                    f"{nom} : matchs récents surtout en ITF/qualifs — si en "
                    "pleine ascension, le modèle peut la sous-estimer")
        return alertes

    def sauver_poids(self, n_exemples):
        with open(FICHIER_POIDS, "w", encoding="utf-8") as f:
            json.dump({"n": n_exemples, "version": VERSION_MODELE,
                       "poids": self.poids, "ecarts": self.ecarts,
                       "features": NOMS_FEATURES}, f)

    def charger_poids(self, n_exemples):
        try:
            with open(FICHIER_POIDS, encoding="utf-8") as f:
                d = json.load(f)
            if (d["n"] == n_exemples and d["features"] == NOMS_FEATURES
                    and d.get("version") == VERSION_MODELE):
                self.poids, self.ecarts = d["poids"], d["ecarts"]
                return True
        except (OSError, ValueError, KeyError):
            pass
        return False


def construire_moteur(matchs, verbeux=True):
    moteur = Moteur()
    exemples = [e for m in matchs if (e := moteur.ingerer(m)) is not None]
    if moteur.charger_poids(len(exemples)):
        if verbeux:
            print(f"Modèle 103 facteurs : {len(exemples)} exemples, "
                  "poids chargés depuis le cache.")
    else:
        if verbeux:
            print(f"Entraînement du modèle 103 facteurs sur {len(exemples)} "
                  "matchs du circuit principal (~2 min la première fois)...")
        moteur.entrainer(exemples)
        moteur.sauver_poids(len(exemples))
    return moteur


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
    print(f"{len(exemples)} exemples d'entraînement (circuit principal), "
          f"{len(NOMS_FEATURES)} facteurs")
    moteur.entrainer(exemples)

    bons = bons_elo = total = 0
    ll = ll_elo = 0.0
    for m in test:
        g, p = m["gagnante"], m["perdante"]
        if (m.get("circuit") == "P" and moteur.j[g].n() >= 10
                and moteur.j[p].n() >= 10):
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

    print(f"\nSur {total} matchs de test 2026 (circuit principal, ≥ 10 matchs connus) :")
    print(f"  103 facteurs : {bons / total:.1%} de gagnantes trouvées | "
          f"log-loss {ll / total:.4f}")
    print(f"  Elo seul     : {bons_elo / total:.1%} de gagnantes trouvées | "
          f"log-loss {ll_elo / total:.4f}")
    print("\nTop 25 des facteurs les plus importants (poids appris) :")
    for nom, w in sorted(zip(NOMS_FEATURES, moteur.poids),
                         key=lambda c: abs(c[1]), reverse=True)[:25]:
        print(f"  {nom:<40}{w:+.3f}")


if __name__ == "__main__":
    if "--backtest" in sys.argv:
        backtest()
    else:
        print(__doc__)
