# Électricité & Nucléaire

Cours interactif pour comprendre l'électricité et l'énergie nucléaire, en **HTML / CSS / JavaScript pur** (aucune dépendance).

## ▶️ Lancer

Ouvre `index.html` dans ton navigateur, ou depuis ce dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Contenu

**Parcours Électricité** (9 leçons) : charges et électrons · loi d'Ohm · circuits série/parallèle · puissance et énergie (calculateur de facture) · induction et alternateur · courant alternatif et transformateurs · réseau électrique (pertes en ligne + jeu « tiens le réseau à 50 Hz ») · mix électrique et CO₂ · sécurité électrique.

**Parcours Nucléaire** (9 leçons) : construction de noyaux et isotopes · radioactivité α/β/γ/neutrons et doses · demi-vie et datation au carbone-14 · E = mc² et courbe d'Aston · réaction en chaîne pilotable (barres de commande, modérateur, arrêt d'urgence) · schéma interactif d'un REP · cycle du combustible et déchets · sûreté, échelle INES et accidents · fusion.

Chaque leçon se valide par deux questions ; la progression est gardée dans le navigateur. Un **quiz final** (15 questions) et un **glossaire** complètent le cours.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page |
| `style.css` | Thème clair/sombre et mise en page |
| `core.js` | Outils partagés (canvas, curseurs, formatage) |
| `lecons-electricite.js` | Les 9 leçons d'électricité et leurs labos |
| `lecons-nucleaire.js` | Les 9 leçons de nucléaire et leurs labos |
| `extras.js` | Glossaire et questions bonus |
| `app.js` | Navigation, progression, quiz final |
