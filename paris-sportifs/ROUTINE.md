# Routine quotidienne — value bets tennis WTA

Procédure exécutée chaque matin (~09h30 Paris) par le déclencheur
programmé de cette session Claude Code. Objectif : livrer **1 à 3 value
bets maximum** sur les matchs WTA du jour, ou dire clairement qu'il n'y
en a pas.

## Étapes

1. **Ingérer les résultats de la veille — COMPREHENSIF (priorité absolue)** :
   la donnée jour par jour est LA priorité. Ne pas se limiter aux picks :
   ingérer **TOUS les matchs terminés de TOUS les tournois actifs** (chaque
   tour, chaque tournoi WTA + 125), pour que la fiche de chaque joueuse en
   activité reste fraîche. Pour chaque tournoi actif, rechercher
   « [tournoi] WTA all results [date] » / « [tournoi] scores round [date] ».
   Utiliser l'outil dédié qui déduit la surface et dédoublonne :
     ```
     python3 ingerer_resultats.py --tournoi "Toronto WTA" --date 20260804 <<'FIN'
     Coco Gauff def. Kayla Day 6-2 6-1
     Iga Swiatek bat Sara Bejlek
     ... (toutes les rencontres terminées, une par ligne)
     FIN
     ```
   **Règle anti-erreur** : n'ingérer qu'une gagnante *clairement vérifiée*
   (jamais un score garbled d'un snippet ; recouper si doute — cf. erreur
   Bondar-Zidansek). Le score est optionnel (l'outil ne garde que
   gagnante/perdante/surface). Format final :
   `date,gagnante,perdante,surface,tournoi,source`. Ce fichier est chargé
   automatiquement par tennis.py : l'Elo intègre donc la forme récente jour
   après jour. **Commit + push** après ajout.

   *Contexte réseau (constat 04/08)* : la politique proxy bloque tout sauf
   GitHub (raw) et WebSearch — pas d'API de résultats ni de miroir GitHub
   frais au-delà d'avril. La seule voie fiable pour « jour par jour » est
   donc ce harvest WebSearch comprehensif. Le système d'avertissements de
   tennis.py signale toute fiche encore périmée : ne jamais parier dessus.

2. **Actualiser l'historique de base** : lancer
   `python3 telecharger_donnees.py` (saisons 2025-2026). Si un miroir
   plus frais répond, commit + push, et purger de resultats_recents.csv
   les lignes désormais couvertes par les fichiers officiels.

3. **Programme du jour + cotes AUTOMATIQUES** : lancer
   `python3 cotes_du_jour.py` — il télécharge le flux GitHub
   Mriganka-codes/tennis_data (scrape de tennisexplorer toutes les 6 h,
   accessible via raw.githubusercontent.com) et écrit `cotes_auto.csv`
   avec les matchs WTA du jour, cotes réelles et noms résolus.
   Vérifier la fraîcheur du flux (champ last_updated < 12 h). Adapter
   le dictionnaire SURFACES_TOURNOIS au calendrier (gazon/terre/dur).

4. **Complément par recherche web** : pour les matchs signalés « non
   résolus » par le script, les tournois absents du flux, ou si le flux
   est en panne : rechercher « [joueuse1] vs [joueuse2] odds ».
   **Chaque lundi** : vérifier la liste des tournois de la semaine
   (« WTA calendar this week », y compris les 125) et confirmer que
   chacun apparaît dans le flux — sinon, le couvrir manuellement par
   recherche (exemple raté : Enka Open Istanbul 125, semaine du 13/07,
   absent du flux tennisexplorer).
   Convertir les cotes américaines en décimales (+150 → 2.50 ;
   -200 → 1.50). Ne jamais inventer une cote : si introuvable, écarter
   le match.

4bis. **Complétude des résultats (anti-trou de données)** : chaque
   dimanche, ou à la fin de chaque tournoi, vérifier que TOUS les
   résultats du tableau final (au minimum des quarts à la finale) sont
   dans resultats_recents.csv ; pour les Grands Chelems, tous les tours.
   Si un miroir Sackmann redevient vivant (telecharger_donnees.py),
   purger de resultats_recents.csv les lignes couvertes par les
   fichiers officiels.

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
