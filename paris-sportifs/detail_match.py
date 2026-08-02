#!/usr/bin/env python3
"""Dump COMPLET des 103 facteurs pour un match + parcours tournoi.

Usage : python3 detail_match.py "Kristina Liutova" "Darja Vidmanova" dur I memphis
"""
import sys, os, glob, datetime
import caracteristiques as C

j1, j2, surface = sys.argv[1], sys.argv[2], sys.argv[3]
niveau = sys.argv[4] if len(sys.argv) > 4 else "I"
filtre_trn = sys.argv[5].lower() if len(sys.argv) > 5 else None

D = os.path.join(C.DOSSIER, "donnees")
fichiers = sorted(glob.glob(os.path.join(D, "*matches*_[0-9]*.csv")))
fichiers += sorted(glob.glob(os.path.join(D, "resultats_recents*.csv")))
matchs = C.charger_matchs(fichiers)
moteur = C.construire_moteur(matchs, verbeux=False)   # données + poids (cache)

p1, x, contribs = moteur.proba(j1, j2, surface, niveau=niveau)
contrib_par_nom = dict(contribs)

print("=" * 70)
print(f"  {j1}  vs  {j2}   ({surface})   —   103 FACTEURS")
print("=" * 70)
print(f"Proba modèle : {j1} {p1:.1%}  |  {j2} {1-p1:.1%}")
print("Signe : +  pousse vers " + j1.split()[-1]
      + "   ;   −  pousse vers " + j2.split()[-1])
print("(magnitude = poids du facteur × écart entre les deux joueuses)\n")

i = 0
for fam, n in C.FAMILLES:
    noms = C.NOMS_FEATURES[i:i+n]
    i += n
    sous = sorted(((nm, contrib_par_nom.get(nm, 0.0)) for nm in noms),
                  key=lambda t: abs(t[1]), reverse=True)
    total = sum(c for _, c in sous)
    fleche = j1.split()[-1] if total > 0 else j2.split()[-1]
    print(f"── {fam}  (poussée nette {total:+.2f} → {fleche}) "
          + "─" * max(0, 40 - len(fam)))
    for nm, c in sous:
        barre = "█" * min(20, int(abs(c) * 40))
        print(f"   {nm:<40}{c:+.3f}  {barre}")
    print()

# Parcours tournoi tel que la machine l'a enregistré
if filtre_trn:
    print("=" * 70)
    print(f"  PARCOURS sur '{filtre_trn}' (tel qu'enregistré par la machine)")
    print("=" * 70)
    for nom in (j1, j2):
        J = moteur.j.get(nom)
        print(f"\n{nom} :")
        if not J or not J.hist:
            print("   (aucun match en base)")
            continue
        lignes = [e for e in J.hist if filtre_trn in (e.get("trn") or "").lower()]
        if not lignes:
            print("   (aucun match trouvé sur ce tournoi dans la base)")
        for e in lignes:
            d = datetime.date.fromordinal(e["d"])
            res = "V" if e["v"] else "D"
            mn = f"{e['mn']}min" if e.get("mn") else "?"
            sv = f"{e['sv']*100:.0f}% svc" if e.get("sv") is not None else ""
            print(f"   {d}  {res}  [{e.get('rd','?'):>3}]  {e['surf']:<5} {mn:>6}  {sv}")
