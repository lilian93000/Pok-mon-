# Monstrobattle 🐲

Un petit jeu de rôle au tour par tour inspiré de Pokémon, codé en **HTML / CSS / JavaScript pur** (aucune dépendance, aucune installation).

## ▶️ Jouer

Ouvre simplement `index.html` dans ton navigateur.

Ou, depuis le dossier du projet, lance un petit serveur local :

```bash
python3 -m http.server 8000
# puis ouvre http://localhost:8000
```

## 🎮 Comment jouer

1. **Choisis ton starter** parmi trois créatures (Feu / Eau / Plante).
2. **Déplace-toi** sur la carte avec les **flèches** ou **ZQSD**.
3. Marche dans les **hautes herbes** 🌿 pour déclencher des **rencontres sauvages**.
4. En combat tu peux :
   - **⚔️ Attaquer** avec les attaques de ta créature,
   - **🎯 Lancer une Polkaball** pour capturer l'adversaire (plus il est affaibli, plus c'est facile),
   - **🔄 Changer** de créature,
   - **🏃 Fuir**.
5. Reviens sur le **centre de soins** 🏥 (ou clique sur « Centre de soins ») pour récupérer tous tes PV.

## ✨ Fonctionnalités

- Système de **types** (Feu, Eau, Plante, Électrik, Normal) avec table d'efficacité (super efficace / pas très efficace) et bonus STAB.
- **Combat au tour par tour** avec précision des attaques, dégâts variables et ordre d'action.
- **Capture** de créatures sauvages (équipe de 6 max).
- **XP et niveaux**, avec **évolutions** à certains paliers.
- Carte générée aléatoirement avec herbes, arbres, eau et centre de soins.

## 📁 Structure

| Fichier      | Rôle                                              |
|--------------|---------------------------------------------------|
| `index.html` | Structure des écrans (accueil, carte, combat).    |
| `style.css`  | Mise en forme et interface.                       |
| `data.js`    | Types, attaques et espèces de créatures.          |
| `game.js`    | Moteur : overworld, combat, capture, progression. |

Bon jeu ! 🎉

---

## ◆ Bonus : Oracle Bourse

Le dossier [`bourse/`](bourse/) contient un autre projet : une **machine d'analyse
boursière multi-facteurs** (technique, fondamental, momentum, sentiment des news)
qui classe les actions selon leur potentiel de hausse. Ouvre `bourse/index.html`
ou consulte [`bourse/README.md`](bourse/README.md).

---

## ✦ Bonus : Atlas cosmique

Le dossier [`univers/`](univers/) contient une **carte interactive de l'univers** :
on zoome en continu de la Terre et la Lune jusqu'au fond diffus cosmologique, à
46,5 milliards d'années-lumière, avec de vraies distances.

- Planètes à leur **position réelle du jour**, temps accéléré réglable.
- Étoiles voisines, nébuleuses, Voie lactée, Groupe local, superamas Laniakea,
  toile cosmique et limite de l'univers observable.
- Fiche pour chaque astre : distance, temps de trajet de la lumière, taille, anecdote.
- Recherche, raccourcis d'échelle, molette / pincement / glisser.
- **Vue 3D interactive** : un clic sur un astre zoome dessus puis ouvre une scène 3D
  qu'on fait tourner au doigt ou à la souris. La Terre (jour, nuit, nuages,
  océans brillants, atmosphère), la Lune, les planètes, le Soleil animé, les étoiles,
  TRAPPIST-1 et ses 7 planètes, un trou noir avec lentille gravitationnelle,
  un quasar et ses jets, des galaxies, des nébuleuses, des amas, la sonde Voyager 1,
  l'héliopause, la toile cosmique et le fond diffus cosmologique.
- **Champs magnétiques** (bouton « Champ magnétique » dans la vue 3D) : magnétosphère
  terrestre avec ceintures de Van Allen, aurores, onde de choc et vent solaire ;
  boucles coronales du Soleil ; magnétosphères géantes de Jupiter (tore d'Io) et
  Saturne ; champs basculés d'Uranus et Neptune ; magnétisme fossile de Mars ;
  magnétosphère induite de Vénus ; pulsar du Crabe et ses faisceaux ; jets en hélice
  des trous noirs ; champ de la Voie lactée ; spirale de Parker jusqu'à l'héliopause.
- Lueur cinématographique (bloom) et ciel avec la bande de la Voie lactée.
- **Voyage guidé** : 14 étapes commentées de la Terre au fond diffus cosmologique.
- **Terre en direct** : jour et nuit calculés pour l'instant présent (position réelle
  du Soleil), ISS en orbite, anneau des satellites géostationnaires.
- **Orbites képlériennes** (éléments JPL) : vraies ellipses, excentricités et inclinaisons.
- **Lunes** de Jupiter, Saturne, Mars, Uranus et Neptune ; **James Webb** au point L2
  et **Voyager 2**.
- **Comparer les tailles** : la Terre ou le Soleil à l'échelle à côté de chaque astre
  (et les orbites de la Terre et de Mars à l'intérieur de Bételgeuse).
- **Ambiance sonore** générée en direct (Web Audio) et **qualité adaptative** qui
  baisse la résolution si l'appareil peine.
- **Vraies positions célestes** : hors du Système solaire, la carte est vue du pôle
  nord galactique ; chaque astre est placé selon sa vraie longitude galactique
  (conversion des coordonnées J2000), à sa vraie distance.
- **Portrait de la Voie lactée** : barre centrale, deux bras majeurs (Persée,
  Écu-Croix), bras secondaires et bras d'Orion où se trouve le Soleil, nommés sur la carte.
- **Voyage de la lumière** : un rayon part de la Terre ; le front lumineux s'étend et
  chaque astre atteint s'affiche avec le temps réel de trajet (Lune 1,3 s, Proxima 4,24 ans…).
- **Fiches scientifiques** : masse, gravité, jour, température, lunes ; type spectral,
  température, luminosité et rayon des étoiles ; et « Sur Terre quand cette lumière
  est partie » pour relier chaque distance à l'histoire humaine.
- Planètes éclairées du côté du Soleil, toile cosmique organique, géantes gazeuses aux
  bandes animées en rotation différentielle et ombre des anneaux sur Saturne.

Ouvre simplement `univers/index.html` dans ton navigateur (aucune installation ;
la vue 3D charge Three.js depuis un CDN, il faut donc être connecté).
