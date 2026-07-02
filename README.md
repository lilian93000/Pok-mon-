# Walaxy 👽

Recréation complète de **Waalaxy**, l'outil d'automatisation de prospection LinkedIn — front-end **et** back-end, sans aucune dépendance externe.

> ⚠️ **L'intégration LinkedIn est simulée.** Automatiser un compte LinkedIn viole ses conditions d'utilisation : le moteur remplace donc les appels réels par un simulateur (acceptations ~60 %, réponses ~35 %). Tout le reste — comptes, API, moteur de séquences, quotas, persistance, temps réel — est réel et fonctionnel.

## Deux modes de fonctionnement

| Mode | Quand | Ce que ça donne |
|---|---|---|
| **Serveur** | `npm start` puis http://localhost:3000 | Comptes multi-utilisateurs, moteur d'automatisation en tâche de fond, persistance disque, mises à jour temps réel (SSE) |
| **Démo** | ouverture directe d'`index.html` (ou GitHub Pages) | Interface identique, données de démo dans le `localStorage` |

Le front détecte automatiquement la présence du serveur via `/api/sante`.

## Lancer le serveur

Node ≥ 18, aucune installation :

```bash
npm start            # http://localhost:3000 — 1 « jour » de séquence = 3 min
npm run start:rapide # échelle accélérée : 1 « jour » = 20 s
```

Variables d'environnement : `PORT`, `WALAXY_JOUR_MS` (durée réelle d'un « jour » de séquence, `86400000` pour un rythme réel), `WALAXY_TICK_MS` (fréquence du moteur).

## Ce que fait le back-end

- **Comptes** — inscription/connexion, mots de passe hachés (scrypt + sel), jetons de session signés HMAC avec expiration, données isolées par utilisateur.
- **Moteur d'automatisation** (`server/moteur.js`) — à chaque passage : remise à zéro des quotas au changement de jour, exécution des actions de la file arrivées à échéance (invitations, messages, visites) dans la limite des quotas, avancement des séquences étape par étape (« Attendre N jours » compris), arrêt des relances dès qu'un prospect répond, clôture automatique des campagnes finies.
- **Simulateur** — à l'endroit exact où le produit réel piloterait LinkedIn : tirages probabilistes d'acceptations et de réponses (textes générés), avec délais aléatoires « humains ».
- **API REST** — `/api/auth/*`, `/api/etat`, `/api/campagnes`, `/api/prospects/import`, `/api/file/:id/annuler`, `/api/conversations/:id/*`.
- **Temps réel** — `/api/events` (Server-Sent Events) : l'interface se met à jour dès que le moteur travaille.
- **Persistance** — JSON sur disque (`server/data/`, non versionné), écritures atomiques.

## L'interface

- **Accueil** — tuiles de stats, graphique d'activité interactif sur 14 jours (SVG fait main, tooltip), quotas journaliers, prochaines actions.
- **Prospects** — recherche, filtres, sélection multiple, import simulé, ajout à une campagne.
- **Campagnes** — assistant de création en 3 étapes (nom → séquence → prospects), pause/reprise, détail avec entonnoir de conversion et progression par prospect.
- **Messagerie** — boîte à deux volets ; les messages automatiques du moteur et les réponses simulées y arrivent en direct.
- **File d'attente** — actions planifiées avec échéances, annulables.
- **Abonnement** — page de tarifs.

Modes clair/sombre automatiques, responsive.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` / `style.css` | Coquille et design system |
| `data.js` | Données de départ (partagées front/serveur) |
| `app.js` | Routeur, vues, graphique SVG, client API + SSE, bascule serveur/démo |
| `server/serveur.js` | Serveur HTTP : statique + API REST + SSE |
| `server/moteur.js` | Moteur d'automatisation et simulateur LinkedIn |
| `server/authentification.js` | scrypt + jetons HMAC |
| `server/magasin.js` | Persistance JSON atomique, état initial des comptes |
| `server/config.js` | Port, échelle de temps, cadence du moteur |

Réinitialiser la démo localStorage : `localStorage.removeItem("walaxy-state-v1")` dans la console. Réinitialiser le serveur : supprimer `server/data/`.
