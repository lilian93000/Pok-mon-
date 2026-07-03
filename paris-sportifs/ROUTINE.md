# Routine quotidienne — value bets tennis WTA

Procédure exécutée chaque matin (~09h30 Paris) par le déclencheur
programmé de cette session Claude Code. Objectif : livrer **1 à 3 value
bets maximum** sur les matchs WTA du jour, ou dire clairement qu'il n'y
en a pas.

## Étapes

1. **Ingérer les résultats de la veille (OBLIGATOIRE, en premier)** :
   rechercher sur le web les matchs WTA terminés la veille, tous
   tournois (« WTA [tournoi] results yesterday », « [tournoi] women's
   results [date] »). Ajouter chaque résultat vérifié dans
   `donnees/resultats_recents.csv` (format :
   `date,gagnante,perdante,surface,tournoi,source`), sans doublon.
   Ce fichier est chargé automatiquement par tennis.py : l'Elo intègre
   donc la forme récente jour après jour. **Commit + push** après ajout.

2. **Actualiser l'historique de base** : lancer
   `python3 telecharger_donnees.py` (saisons 2025-2026). Si un miroir
   plus frais répond, commit + push, et purger de resultats_recents.csv
   les lignes désormais couvertes par les fichiers officiels.

3. **Programme du jour** : rechercher les matchs WTA du jour, tous
   tournois confondus (« WTA [tournoi] order of play [date] »).

4. **Cotes réelles** : rechercher les cotes de chaque match
   (« [joueuse1] vs [joueuse2] odds »). Convertir les cotes américaines
   en décimales (+150 → 2.50 ; -200 → 1.50). Ne jamais inventer une
   cote : si introuvable, écarter le match.

5. **Analyse** : écrire les matchs + cotes dans un CSV et lancer
   `python3 tennis.py --cotes fichier.csv --bankroll 100`.

6. **Vérification forme & stats des candidats** : pour chaque pick
   envisagé, rechercher les stats récentes de la joueuse
   (« [joueuse] last matches stats », « [joueuse] serve stats
   [tournoi] », blessure, fatigue, titres récents sur la surface).
   Chercher notamment : résultats des 2-4 dernières semaines, % de
   points gagnés au service dans les derniers matchs (utilisable avec
   `tennis.py --service pA:pB` en contre-vérification Markov), abandons
   récents. Ajuster ou écarter le pick si la forme contredit l'Elo.

6bis. **Revue de presse & interviews d'après-match** : pour chaque pick
   candidat, rechercher les déclarations d'après-match et conférences
   de presse des deux joueuses (« [joueuse] press conference quotes
   [tournoi] », « [joueuse] interview after match »). Les vidéos
   YouTube ne sont pas lisibles depuis cet environnement, mais leurs
   contenus sont retranscrits par la presse spécialisée (tennis365,
   tennishead, puntodebreak, wtatennis.com…). Y chercher : blessure ou
   gêne évoquée, fatigue, confiance/doute, changement de matériel ou
   d'entraîneur, conditions (vent, toit fermé). Exemple réel : la
   presse a révélé le retour de blessure au poignet d'Anisimova et un
   2e tour arraché au super tie-break — invisible dans les chiffres,
   décisif pour écarter un « value bet » illusoire.

7. **Sélection (1 à 3 bets max)** :
   - viser les edges entre **+3 % et +20 %** : c'est la zone saine ;
   - un edge > 25 % = presque toujours une info manquante côté modèle —
     le signaler comme « divergence forte » avec avertissement, jamais
     comme bet sûr ;
   - écarter les joueuses avec < 15 matchs dans les données ;
   - si rien ne passe les filtres : le dire, ne rien forcer.

8. **Livraison** : envoyer une notification push avec les picks résumés
   + un message détaillé dans la session (proba modèle, cote, edge,
   mise Kelly 25 % conseillée en % de bankroll, et la forme récente qui
   justifie ou nuance chaque pick).

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
