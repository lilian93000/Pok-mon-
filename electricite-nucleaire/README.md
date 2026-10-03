# Électricité & Nucléaire

Cours interactif pour comprendre l'électricité et l'énergie nucléaire, en **HTML / CSS / JavaScript pur** (aucune dépendance).

## ▶️ Lancer

Ouvre `index.html` dans ton navigateur, ou depuis ce dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Contenu

**Parcours Électricité** (10 leçons) : charges et électrons · loi d'Ohm · circuits série/parallèle · puissance et énergie (calculateur de facture) · induction et alternateur · courant alternatif et transformateurs · la guerre des courants Edison / Tesla / Westinghouse (frise + simulateur continu contre alternatif) · réseau électrique (pertes en ligne + jeu « tiens le réseau à 50 Hz ») · mix électrique et CO₂ · sécurité électrique.

**Parcours Nucléaire** (8 leçons) : construction de noyaux et isotopes · radioactivité α/β/γ/neutrons et doses · demi-vie et datation au carbone-14 · E = mc² et courbe d'Aston · réaction en chaîne pilotable (barres de commande, modérateur, arrêt d'urgence) · cycle du combustible et déchets · sûreté, échelle INES et accidents · fusion.

**Parcours Centrales nucléaires** (5 leçons) : le voyage de l'énergie du noyau à la prise et bilan énergétique · schéma interactif d'un REP · simulateur de salle de commande (divergence, turbine, couplage, montée en puissance) · la vie d'une centrale (rechargement du cœur, visites décennales, démantèlement) · carte du parc nucléaire français.

Chaque leçon se valide par deux questions ; la progression est gardée dans le navigateur. Un **quiz final** (15 questions) et un **glossaire** complètent le cours.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page |
| `style.css` | Thème clair/sombre et mise en page |
| `core.js` | Outils partagés (canvas, curseurs, formatage) |
| `lecons-electricite.js` | Les 10 leçons d'électricité et leurs labos |
| `lecons-nucleaire.js` | Les 8 leçons de nucléaire et leurs labos |
| `lecons-centrales.js` | Les 5 leçons sur les centrales nucléaires |
| `extras.js` | Glossaire et questions bonus |
| `app.js` | Navigation, progression, quiz final |
