# Analyse probabiliste de paris tennis WTA 🎾📊

Un programme Python (sans aucune dépendance) qui analyse des matchs de
tennis avec des modèles probabilistes construits sur de **vraies données
de matchs**, et détecte les **value bets** : les paris où la cote du
bookmaker est plus élevée que ce que les probabilités justifient.

## Les données (réelles)

Le dossier `donnees/` contient les résultats réels du circuit WTA au
format Jeff Sackmann (`wta_matches_XXXX.csv`), la base de référence
utilisée par les chercheurs et les modélisateurs tennis :

- **saisons 2022 à 2026** : ~11 700 matchs du circuit principal
  (Grands Chelems, WTA 1000/500/250, Finals, United Cup, BJK Cup)
- pour chaque match : tournoi, date, surface, joueuses, score, stats
  de service

Le dépôt GitHub original (`JeffSackmann/tennis_wta`) a été retiré ;
`telecharger_donnees.py` récupère donc les fichiers depuis des miroirs
publics (forks) et peut mettre à jour ou étendre les saisons :

```bash
python3 telecharger_donnees.py            # saisons 2022-2026
python3 telecharger_donnees.py 2019 2020  # années supplémentaires
```

⚠️ **Fraîcheur** : le miroir le plus récent s'arrête au 21 avril 2026
(fin de Madrid). Les matchs depuis (Rome, Roland-Garros…) ne sont pas
encore dans les données — l'Elo bouge lentement, mais garde-le en tête
et relance le script de téléchargement régulièrement pour vérifier si
un miroir plus frais existe.

## Modèle A : Elo par surface

Chaque joueuse a un classement Elo mis à jour match après match, dans
l'ordre chronologique des ~11 700 matchs réels. La probabilité de
victoire vient de la formule Elo :

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
surface. Les forfaits (W/O) sont exclus, les abandons comptent comme
des victoires.

## Modèle B : chaîne de Markov point par point

À partir de la probabilité de gagner un point sur son service, on
remonte **toute la hiérarchie du tennis par calcul exact** :
point → jeu → tie-break → set → match (2 sets gagnants).

Probabilité de tenir son jeu de service (formule fermée, l'égalité
étant une série géométrique) :

```
P(jeu) = p⁴(1 + 4q + 10q²) + 20p³q³ · p²/(1 − 2pq)     avec q = 1 − p
```

Le set et le tie-break sont calculés par récurrence exacte sur le
score. Utile pour les marchés « score exact en sets ». En WTA, les
probabilités de points gagnés au service tournent autour de 55-62 %
(moins qu'en ATP : plus de breaks, plus de retournements).

## Détection des value bets

Une cote `c` implique une probabilité `1/c`. Le bookmaker gonfle ces
probabilités (sa **marge**, ~3-7 %). Si le modèle estime une
probabilité `p` telle que :

```
edge = p × c − 1 > 0
```

alors le pari a une **espérance de gain positive** : c'est un value
bet. La mise est dimensionnée par le **critère de Kelly** :

```
f* = (p × (c − 1) − (1 − p)) / (c − 1)
```

fractionné à 25 % pour limiter la variance (le Kelly plein est très
agressif quand le modèle se trompe).

## Utilisation

```bash
# Un match : tu tapes les cotes de ton bookmaker (noms partiels acceptés)
python3 tennis.py --match "Rybakina:Anisimova" --surface gazon \
    --cote1 1.72 --cote2 2.20 --bankroll 200

# Plusieurs matchs d'un coup via un fichier de cotes
python3 tennis.py --cotes mes_cotes.csv --bankroll 200

# Classement Elo (global + surface choisie)
python3 tennis.py --classement --surface gazon

# Modèle de Markov pur (probas de points au service)
python3 tennis.py --service 0.60:0.55
```

Format du fichier de cotes (`mes_cotes.csv`) :

```csv
joueuse_1,joueuse_2,surface,cote_1,cote_2
Sabalenka,Swiatek,gazon,1.85,1.95
Gauff,Pegula,gazon,1.60,2.35
```

## Limites et avertissement ⚠️

- L'Elo ne voit pas la forme du jour, les blessures, la fatigue
  (enchaînement de tournois), les abandons récents ni les retours de
  blessure — vérifie toujours le contexte avant de suivre un signal.
- Une joueuse avec peu de matchs dans les données (< 10-15) a un Elo
  peu fiable ; le programme t'avertit dans ce cas.
- Les gros edges (> 15-20 %) sont plus souvent le signe que le modèle
  manque une information (blessure, méforme connue du marché) que d'une
  vraie erreur du bookmaker. Les vrais value bets durables sont petits
  (2-8 %).
- **Aucun modèle ne garantit un gain.** Les paris sportifs comportent un
  risque réel de perte. Joue de manière responsable, uniquement de
  l'argent que tu peux te permettre de perdre. Si le jeu devient un
  problème : joueurs-info-service.fr / 09 74 75 13 13.
