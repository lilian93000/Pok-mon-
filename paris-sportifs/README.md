# Analyse probabiliste de paris sportifs ⚽📊

Un programme Python (sans aucune dépendance) qui analyse des matchs de
football avec un **modèle de Poisson** et détecte les **value bets** :
les paris où la cote du bookmaker est plus élevée que ce que les
probabilités justifient.

## Les maths derrière le programme

### 1. Forces des équipes
À partir de l'historique des matchs, on calcule pour chaque équipe :
- une **force d'attaque** = buts marqués par match ÷ moyenne de la ligue
- une **force de défense** = buts encaissés par match ÷ moyenne de la ligue

Le tout séparément à domicile et à l'extérieur, pour capturer
l'avantage du terrain.

### 2. Modèle de Poisson
Le nombre de buts d'une équipe suit une loi de Poisson :

```
P(k buts) = e^(-λ) · λ^k / k!
```

avec l'espérance de buts :

```
λ_domicile = moyenne_ligue_dom × attaque(dom) × défense(ext)
λ_extérieur = moyenne_ligue_ext × attaque(ext) × défense(dom)
```

En croisant les deux lois, on obtient la probabilité de **chaque score
exact** (0-0, 1-0, 2-1…), et en sommant : victoire / nul / défaite,
plus/moins de 2,5 buts, les deux équipes marquent (BTTS).

### 3. Détection des value bets
Une cote `c` implique une probabilité `1/c`. Le bookmaker gonfle ces
probabilités (sa **marge**, généralement 5-8 %). Si le modèle estime
une probabilité `p` telle que :

```
edge = p × c − 1 > 0
```

alors le pari a une **espérance de gain positive** : c'est un value bet.

### 4. Critère de Kelly
Pour dimensionner la mise, on utilise la formule de Kelly :

```
f* = (p × (c − 1) − (1 − p)) / (c − 1)
```

`f*` est la fraction optimale de la bankroll à miser. Le programme
applique un **Kelly fractionné à 25 %** pour limiter la variance (le
Kelly plein est très agressif quand le modèle se trompe).

## Utilisation

Analyser une journée complète (fichier de cotes) :

```bash
python3 analyse.py --historique matchs_exemple.csv --cotes cotes_exemple.csv --bankroll 200
```

Analyser un seul match en tapant les cotes à la main :

```bash
python3 analyse.py --historique matchs_exemple.csv \
    --match "Monaco:Marseille" --cote1 2.10 --coteX 3.60 --cote2 3.30
```

## Format des fichiers

`matchs_exemple.csv` — l'historique (plus il y a de matchs, mieux c'est) :

```csv
domicile,exterieur,buts_dom,buts_ext
PSG,Marseille,3,1
```

`cotes_exemple.csv` — les rencontres à analyser (les colonnes
`cote_plus25`/`cote_moins25` sont optionnelles) :

```csv
domicile,exterieur,cote_1,cote_X,cote_2,cote_plus25,cote_moins25
PSG,Monaco,1.75,3.90,4.50,1.72,2.10
```

Pour utiliser de vraies données, remplace les CSV par les résultats de
la saison en cours (ex. les CSV gratuits de football-data.co.uk) et les
cotes de ton bookmaker.

## Limites et avertissement ⚠️

- Le modèle de Poisson est simple : il ignore la forme récente, les
  blessures, la motivation, et sous-estime légèrement les scores
  faibles (0-0, 1-1). Des raffinements existent (Dixon-Coles, pondération
  temporelle des matchs récents).
- Un edge affiché n'est fiable que si l'historique est suffisant
  (idéalement une saison complète ou plus).
- **Aucun modèle ne garantit un gain.** Les paris sportifs comportent un
  risque réel de perte. Jouez de manière responsable, uniquement de
  l'argent que vous pouvez vous permettre de perdre. Si le jeu devient
  un problème : joueurs-info-service.fr / 09 74 75 13 13.
