# Walaxy 👽

Recréation de l'interface de **Waalaxy**, l'outil d'automatisation de prospection LinkedIn — en HTML, CSS et JavaScript pur, sans aucune dépendance.

> ⚠️ **Démo front-end uniquement.** Cette application ne se connecte pas à LinkedIn et n'automatise rien : toutes les données sont fictives et stockées dans le `localStorage` du navigateur.

## Fonctionnalités

- **Accueil** — tableau de bord avec tuiles de statistiques, graphique d'activité interactif sur 14 jours (SVG fait main, tooltip au survol), quotas journaliers et prochaines actions.
- **Prospects** — base de prospects avec recherche, filtre par statut, sélection multiple, import simulé et ajout à une campagne.
- **Campagnes** — liste des campagnes avec statistiques (envois, taux d'acceptation, taux de réponse), pause/reprise, et un **assistant de création en 3 étapes** (nom → séquence → prospects).
- **Détail de campagne** — entonnoir de conversion, visualisation de la séquence, progression prospect par prospect.
- **Messagerie** — boîte de réception à deux volets avec conversations, badges non-lus et envoi de réponses.
- **File d'attente** — actions planifiées avec possibilité d'annulation.
- **Abonnement** — page de tarifs (Freemium / Avancé / Business).

L'interface s'adapte automatiquement au **mode sombre** du système et aux écrans mobiles.

## Lancer en local

Aucune installation nécessaire :

```bash
# ouvrez simplement le fichier
open index.html        # macOS
xdg-open index.html    # Linux

# ou servez le dossier
python3 -m http.server 8000
```

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Coquille de l'application (barre latérale, modale, toasts) |
| `style.css` | Design system complet, modes clair et sombre |
| `data.js` | Données de démonstration (prospects, campagnes, conversations…) |
| `app.js` | Routeur, vues, graphique SVG, assistant de campagne, persistance |

Pour réinitialiser les données de démo : ouvrez la console et lancez
`localStorage.removeItem("walaxy-state-v1")` puis rechargez la page.
