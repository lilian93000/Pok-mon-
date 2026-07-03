# Analyse probabiliste de paris sportifs 🎾⚽📊

Des programmes Python (sans aucune dépendance) qui analysent des matchs
avec des modèles probabilistes et détectent les **value bets** : les
paris où la cote du bookmaker est plus élevée que ce que les
probabilités justifient.

- **`tennis.py`** — tennis ATP/WTA : Elo par surface + chaîne de Markov
- **`analyse.py`** — football : modèle de Poisson

---

## 🎾 Tennis (`tennis.py`)

### Modèle A : Elo par surface

Chaque joueuse a un classement Elo mis à jour match après match à
partir de l'historique. La probabilité de victoire vient de la formule
Elo :

```
P(A bat B) = 1 / (1 + 10^(−(Ra − Rb) / 400))
```

Le facteur de mise à jour K décroît avec l'expérience (formule
FiveThirtyEight, conçue pour le tennis) :

```
K = 250 / (nb_matchs + 5)^0.4
```

Le programme maintient un **Elo global + un Elo par surface**
(dur / terre / gazon) et mélange les deux (50/50) pour la prédiction —
essentiel au tennis où certaines joueuses sont bien plus fortes sur une
surface (ex. terre battue).

### Modèle B : chaîne de Markov point par point (`--service`)

À partir de la probabilité de gagner un point sur son service, on
remonte **toute la hiérarchie du tennis par calcul exact** :
point → jeu → tie-break → set → match (2 sets gagnants).

Probabilité de tenir son jeu de service (formule fermée, l'égalité
étant une série géométrique) :

```
P(jeu) = p⁴(1 + 4q + 10q²) + 20p³q³ · p²/(1 − 2pq)     avec q = 1 − p
```

Le set et le tie-break sont calculés par récurrence exacte sur le
score. Utile pour les marchés « score exact en sets » et pour jauger
la solidité d'un favori. En WTA, les probabilités de points gagnés au
service tournent typiquement autour de 55-62 % (moins qu'en ATP : le
service y pèse moins, donc plus de breaks et plus de retournements).

### Utilisation

```bash
# Journée complète avec fichier de cotes
python3 tennis.py --historique matchs_tennis_exemple.csv --cotes cotes_tennis_exemple.csv --bankroll 200

# Un seul match, cotes tapées à la main
python3 tennis.py --historique matchs_tennis_exemple.csv \
    --match "Swiatek:Gauff" --surface terre --cote1 1.45 --cote2 2.90

# Afficher le classement Elo (global + par surface)
python3 tennis.py --historique matchs_tennis_exemple.csv --classement

# Modèle de Markov pur (probas de points au service)
python3 tennis.py --service 0.60:0.55
```

### Format des fichiers tennis

`matchs_tennis_exemple.csv` — l'historique, trié par date :

```csv
date,gagnante,perdante,surface
2025-04-16,Swiatek,Sabalenka,terre
```

`cotes_tennis_exemple.csv` — les rencontres à analyser :

```csv
joueuse_1,joueuse_2,surface,cote_1,cote_2
Swiatek,Gauff,terre,1.40,3.00
```

Pour de vraies données WTA : **tennis-data.co.uk** publie des CSV
gratuits de chaque saison WTA (et ATP) avec les résultats **et les
cotes de clôture des bookmakers** — parfait pour alimenter l'historique
et même backtester le modèle. Plus l'historique est long (1 à 2 saisons),
plus l'Elo est fiable.

---

## ⚽ Football (`analyse.py`)

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

---

## Limites et avertissement ⚠️

- Ces modèles ignorent la forme du jour, les blessures, la fatigue
  (enchaînement de tournois) et la motivation. Au tennis, l'Elo ne voit
  pas non plus les abandons ni les retours de blessure — vérifie
  toujours le contexte avant de suivre un signal.
- Un edge affiché n'est fiable que si l'historique est suffisant
  (idéalement une saison complète ou plus, et au moins 10-15 matchs
  par joueuse).
- Les gros edges (> 20 %) sont plus souvent le signe que le modèle
  manque une information (blessure, forfait probable) que d'une vraie
  erreur du bookmaker. Les vrais value bets durables sont petits
  (2-8 %).
- **Aucun modèle ne garantit un gain.** Les paris sportifs comportent un
  risque réel de perte. Jouez de manière responsable, uniquement de
  l'argent que vous pouvez vous permettre de perdre. Si le jeu devient
  un problème : joueurs-info-service.fr / 09 74 75 13 13.
