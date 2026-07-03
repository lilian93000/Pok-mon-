# Routine quotidienne — value bets tennis WTA

Procédure exécutée chaque matin (~09h30 Paris) par le déclencheur
programmé de cette session Claude Code. Objectif : livrer **1 à 3 value
bets maximum** sur les matchs WTA du jour, ou dire clairement qu'il n'y
en a pas.

## Étapes

1. **Actualiser l'historique** : lancer `python3 telecharger_donnees.py`
   (saisons 2025-2026). Si un miroir plus frais répond, commit + push des
   CSV mis à jour. Noter la date du dernier tournoi couvert.

2. **Programme du jour** : rechercher sur le web (WebSearch) les matchs
   WTA du jour, tous tournois confondus (Grand Chelem, WTA 1000/500/250).
   Requêtes types : « WTA [tournoi] order of play [date] »,
   « [tournoi] women's singles schedule today ».

3. **Cotes réelles** : rechercher les cotes de chaque match
   (« [joueuse1] vs [joueuse2] odds »). Convertir les cotes américaines
   en décimales si besoin (+150 → 2.50 ; -200 → 1.50). Ne jamais
   inventer une cote : si introuvable, écarter le match.

4. **Analyse** : écrire les matchs + cotes dans un CSV et lancer
   `python3 tennis.py --cotes fichier.csv --bankroll 100`.

5. **Sélection (1 à 3 bets max)** :
   - viser les edges entre **+3 % et +20 %** : c'est la zone saine ;
   - un edge > 25 % signifie presque toujours que le modèle manque une
     info (forme récente, blessure, retour de maternité…) — le signaler
     comme « divergence forte » avec avertissement, jamais comme bet sûr ;
   - écarter les joueuses avec < 15 matchs dans les données ;
   - croiser avec l'actualité (recherche « [joueuse] injury/form ») pour
     les picks retenus ;
   - si rien ne passe les filtres : le dire, ne rien forcer.

6. **Livraison** : envoyer une notification push avec les picks résumés
   + un message détaillé dans la session (proba modèle, cote, edge,
   mise Kelly 25 % conseillée en % de bankroll).

## Limites connues de l'environnement

- Réseau restreint : seul GitHub est accessible en direct ;
  Flashscore / TennisExplorer / Tennis Abstract sont bloqués. Les infos
  du jour passent par la recherche web (fiable pour programme + cotes
  des gros tournois, plus difficile pour les WTA 250).
- Les miroirs de données s'arrêtent à fin avril 2026 tant qu'aucun fork
  plus frais n'apparaît : l'Elo ignore les ~2 derniers mois de forme.
  Compenser en vérifiant l'actualité récente des joueuses sélectionnées.
- Pour améliorer la précision : ajouter dans les réglages réseau de
  l'environnement (claude.ai/code → environnement → network access) les
  domaines `www.tennisexplorer.com`, `tennisabstract.com`,
  `www.flashscore.fr`, `www.tennis-data.co.uk` — la routine les
  utilisera automatiquement si accessibles.

## Garde-fous

- Jamais plus de 3 picks par jour, jamais de « pick du jour » forcé.
- Toujours rappeler : mise Kelly fractionné, bankroll dédiée, aucun
  gain garanti. Jeu responsable : joueurs-info-service.fr / 09 74 75 13 13.
