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

## ◆ Bonus : Entraînement AFA Suisse

Le dossier [`afa/`](afa/) contient un site de révision pour les **deux premiers modules
de l'examen d'intermédiaire en assurance AFA**, plus un module dédié au **profil
Non-Vie** : fiches de cours, 1152 questions commentées — dont les 27 de la série zéro
publiée par l'AFA et 74 au gabarit exact de l'épreuve écrite, tableaux d'attribution
compris —, examen blanc chronométré, flashcards et suivi de progression. Ouvre
`afa/index.html` ou consulte [`afa/README.md`](afa/README.md).
