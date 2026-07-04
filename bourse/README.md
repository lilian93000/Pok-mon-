# ◆ Oracle Bourse — machine d'analyse multi-facteurs

Application web 100 % locale (aucun serveur) qui analyse des actions selon **quatre piliers**
et produit un score composite 0–100 mesurant la qualité de la configuration haussière.

## Les quatre piliers

| Pilier | Poids | Ce qui est mesuré |
|---|---|---|
| 📐 Technique | 35 % | RSI 14 j, MACD 12/26/9, bandes de Bollinger, prix vs MM50/MM200, pente de régression 60 j, proximité du plus-haut 52 semaines, poussées de volume |
| 🚀 Momentum | 15 % | Performances 1/3/6 mois ajustées de la volatilité, accélération récente |
| 🏛️ Fondamental | 30 % | Croissance CA et BPA, marges, PER, PEG, endettement, ROE |
| 📰 Sentiment | 20 % | Analyse lexicale FR/EN des titres de presse pondérée par fraîcheur, scores de sentiment Alpha Vantage, volume de buzz |

Si une source manque, le pilier est neutralisé, les poids sont redistribués et l'indicateur
de **confiance** baisse — le moteur n'invente jamais de données.

## 🤖 Mode automatique (zéro clic)

Le workflow GitHub Actions [`oracle-bourse.yml`](../.github/workflows/oracle-bourse.yml)
lance le robot [`auto/run.js`](auto/run.js) **chaque jour ouvré à 21h35 UTC**
(≈ 35 min après la clôture de Wall Street) :

1. Il récupère cours + volumes (Yahoo Finance, repli Stooq) et les news (RSS Yahoo)
   pour tous les tickers de [`auto/watchlist.json`](auto/watchlist.json) — **aucune clé requise** ;
2. il calcule les scores et committe `data/latest.json`, `data/history.json` et
   `data/rapport.md` dans le repo ;
3. la page web charge automatiquement `data/latest.json` à l'ouverture : le classement
   du jour s'affiche **sans aucun clic**, et le rapport markdown est lisible
   directement sur GitHub.

Optionnel : ajouter un secret d'Actions `FINNHUB_API_KEY` (Settings → Secrets and
variables → Actions) pour activer le pilier fondamental dans l'analyse quotidienne.

> ⚠️ Les crons GitHub ne s'exécutent que sur la **branche par défaut** du dépôt —
> le robot s'active une fois cette branche fusionnée (ou via « Run workflow »
> dans l'onglet Actions).

## Modes de fonctionnement (page web)

- **Mode démo** (par défaut, zéro configuration) : données simulées déterministes avec des
  profils réalistes (hyper-croissance, blue chip, valeur en difficulté…). Idéal pour
  comprendre le moteur.
- **Données réelles** : collez une ou deux clés API gratuites —
  - [Finnhub](https://finnhub.io) → news, fondamentaux (60 appels/min gratuits)
  - [Alpha Vantage](https://www.alphavantage.co/support/#api-key) → historique de cours,
    news avec sentiment pré-calculé (25 appels/jour gratuits — la watchlist est analysée
    avec un débit ralenti pour respecter la limite)

Les clés sont stockées dans le `localStorage` du navigateur et ne quittent jamais votre machine
(les appels partent directement vers les API concernées).

## Lancer

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
cd bourse && python3 -m http.server 8000
```

## ⚠️ Avertissement

**Ceci n'est pas un conseil financier.** Aucun modèle ne prédit la bourse avec certitude —
si c'était possible, le signal disparaîtrait aussitôt exploité. Ce moteur identifie des
*configurations statistiquement favorables* selon des critères objectifs et transparents ;
il ne garantit rien. Les performances passées ne préjugent pas des performances futures.
