# Walaxy 👽

Recréation complète de **Waalaxy**, l'outil d'automatisation de prospection — front-end **et** back-end, sans aucune dépendance externe.

## Deux canaux, deux philosophies

| Canal | Statut | Pourquoi |
|---|---|---|
| **📧 Email** | **Automatisation RÉELLE** | L'envoi d'emails de prospection est **légal** s'il respecte les règles anti-spam. Le moteur envoie de vrais emails via un client SMTP, avec désabonnement en un clic, liste de suppression et mentions légales. |
| **in LinkedIn** | **Semi-automatique** | Automatiser LinkedIn **viole ses conditions d'utilisation** et fait bannir les comptes. Le programme prépare donc tout (message personnalisé, ordre, liste) mais **c'est vous qui ouvrez le profil et envoyez** — voir la page « À faire ». Les campagnes de démo existantes restent simulées. |

Tout le reste — comptes, API, moteur de séquences, quotas, persistance, temps réel — est réel et fonctionnel.

## Le canal email (vraie automatisation légale)

Créez une campagne avec une séquence **📧 Email** : le moteur envoie réellement les emails, échelonnés, dans la limite du quota journalier, et gère les relances.

**Conformité intégrée** (RGPD / CAN-SPAM) :
- lien **« se désabonner en un clic »** dans chaque email + en-têtes `List-Unsubscribe` / `List-Unsubscribe-Post` (le désabonnement automatique de Gmail/Outlook fonctionne) ;
- **liste de suppression** consultée avant *chaque* envoi — un désabonné ne reçoit plus rien, et son prospect passe en « Désabonné » ;
- **identité de l'expéditeur** et **adresse postale physique** dans le pied de chaque message.

**Configurer l'envoi réel** (sinon mode « aperçu » : les emails sont écrits dans `server/data/outbox/*.eml` au lieu d'être envoyés) :

```bash
export WALAXY_SMTP_HOTE=smtp.votrefournisseur.com
export WALAXY_SMTP_PORT=587           # 465 pour TLS implicite
export WALAXY_SMTP_SECURITE=starttls  # "tls" | "starttls" | "aucune"
export WALAXY_SMTP_USER=...  WALAXY_SMTP_PASS=...
export WALAXY_FROM_EMAIL="vous@votredomaine.fr"
export WALAXY_FROM_NOM="Votre Nom"
export WALAXY_ADRESSE="Votre société, adresse postale complète"
export WALAXY_URL_PUBLIQUE="https://votredomaine.fr"  # pour les liens de désabonnement
npm start
```

> ⚠️ Pour un envoi de masse en production, utilisez un domaine avec **SPF, DKIM et DMARC** configurés, et un fournisseur d'envoi réputé — sinon vos emails finiront en spam.

## Le canal LinkedIn (semi-automatique, sans risque)

Créez une campagne avec une séquence **in LinkedIn** : elle n'est **pas** envoyée automatiquement. Chaque action apparaît dans la page **« À faire »** avec :

- le **message personnalisé** déjà rédigé (bouton « Copier le message ») ;
- un lien **« Ouvrir le profil LinkedIn »** (recherche du prospect) ;
- un bouton **« C'est envoyé »** qui fait avancer la séquence à l'étape suivante.

Vous gardez la main sur chaque envoi — le programme ne fait que préparer et ordonner. Aucun pilotage automatisé de LinkedIn, donc **aucun risque de bannissement** : c'est la différence avec les extensions qui automatisent réellement (et exposent votre compte).

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
- **Moteur d'automatisation** (`server/moteur.js`) — à chaque passage : remise à zéro des quotas au changement de jour, exécution des actions de la file arrivées à échéance (invitations, messages, visites, **emails**) dans la limite des quotas, avancement des séquences étape par étape (« Attendre N jours » compris), arrêt des relances dès qu'un prospect répond ou se désabonne, clôture automatique des campagnes finies.
- **Envoi d'emails réel** (`server/email.js`) — client SMTP écrit à la main (TLS implicite, STARTTLS, ou clair en dev), message MIME multipart (texte + HTML), en-têtes de désabonnement, liste de suppression, jetons de désabonnement signés (HMAC). Bascule en mode « aperçu » sans configuration SMTP.
- **Simulateur LinkedIn** — à l'endroit exact où le produit réel piloterait LinkedIn : tirages probabilistes d'acceptations et de réponses (textes générés), avec délais aléatoires « humains ».
- **API REST** — `/api/auth/*`, `/api/etat`, `/api/campagnes`, `/api/prospects/import`, `/api/file/:id/annuler`, `/api/conversations/:id/*`, et la page publique `/desabonnement`.
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
| `server/serveur.js` | Serveur HTTP : statique + API REST + SSE + désabonnement |
| `server/moteur.js` | Moteur d'automatisation (email réel + simulateur LinkedIn) |
| `server/email.js` | Client SMTP, emails MIME conformes, liste de suppression |
| `server/authentification.js` | scrypt + jetons HMAC |
| `server/magasin.js` | Persistance JSON atomique, état initial des comptes |
| `server/config.js` | Port, échelle de temps, cadence du moteur |

Réinitialiser la démo localStorage : `localStorage.removeItem("walaxy-state-v1")` dans la console. Réinitialiser le serveur : supprimer `server/data/`.
