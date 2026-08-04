#!/usr/bin/env python3
"""Diagnostic de calibration + recherche du facteur de temperament optimal.

Entraine <2026, teste 2026. Mesure si les probas sont trop extremes
(surconfiance) et trouve T tel que p' = sigmoid(logit(p)/T) calibre le mieux.
"""
import glob, os, math, datetime
import caracteristiques as C

D = os.path.join(C.DOSSIER, "donnees")
fichiers = sorted(glob.glob(os.path.join(D, "*matches*_[0-9]*.csv")))
fichiers += sorted(glob.glob(os.path.join(D, "resultats_recents*.csv")))
matchs = C.charger_matchs(fichiers)
seuil = datetime.date(2026, 1, 1).toordinal()
train = [m for m in matchs if m["date"] < seuil]
test = [m for m in matchs if m["date"] >= seuil]

mo = C.Moteur()
ex = [e for m in train if (e := mo.ingerer(m)) is not None]
mo.entrainer(ex)

# collecte des logits de la gagnante (label implicite = 1)
zs = []
for m in test:
    g, p = m["gagnante"], m["perdante"]
    if (m.get("circuit") == "P" and mo.j[g].n() >= 10 and mo.j[p].n() >= 10):
        proba, _, _ = mo.proba(g, p, m["surface"], m["date"], m["niveau"] or "I")
        proba = min(max(proba, 1e-6), 1 - 1e-6)
        zs.append(math.log(proba / (1 - proba)))
    mo.ingerer(m, collecter=False)

def logloss(T):
    return sum(-math.log(1/(1+math.exp(-z/T))) for z in zs) / len(zs)
def acc(T):  # inchange par T monotone, verif
    return sum(1 for z in zs if z/T > 0) / len(zs)

# recherche T optimal (grille + affinage)
Ts = [round(0.8+0.05*i,2) for i in range(60)]
best = min(Ts, key=logloss)
print(f"Matchs de calibration : {len(zs)}")
print(f"T=1.00 (actuel) : log-loss {logloss(1.0):.4f} | justesse {acc(1.0):.1%}")
print(f"T optimal = {best:.2f} : log-loss {logloss(best):.4f} | justesse {acc(best):.1%}")
print(f"  (T>1 => le modele est SURCONFIANT, il faut ecraser les probas vers 50%)\n")

# courbe de calibration : bins sur la proba de la gagnante (set symetrique)
print("Calibration (set symetrique) — proba predite vs taux reel :")
print(f"{'bande proba':>14} {'n':>6} {'predit':>8} {'reel':>8}  {'ecart':>7}")
def bins(T):
    B = {}
    for z in zs:
        for zz,lab in ((z,1),(-z,0)):
            pp = 1/(1+math.exp(-zz/T))
            k = min(int(pp*10),9)
            B.setdefault(k,[0,0.0,0.0])
            B[k][0]+=1; B[k][1]+=pp; B[k][2]+=lab
    return B
for lab,T in (("AVANT (T=1)",1.0),):
    print(f"\n[{lab}]")
    B=bins(T)
    for k in sorted(B):
        n,sp,sl=B[k]
        print(f"  {k*10:>3}-{k*10+10:<3}%     {n:>6} {sp/n:>7.1%} {sl/n:>7.1%}  {(sp-sl)/n:>+6.1%}")
print(f"\n[APRES (T={best})]")
B=bins(best)
for k in sorted(B):
    n,sp,sl=B[k]
    print(f"  {k*10:>3}-{k*10+10:<3}%     {n:>6} {sp/n:>7.1%} {sl/n:>7.1%}  {(sp-sl)/n:>+6.1%}")
