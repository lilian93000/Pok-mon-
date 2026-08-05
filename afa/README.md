# AFA Suisse — entraînement 🛡️

Site d'entraînement aux **deux premiers modules** de la formation d'**intermédiaire en
assurance AFA** (Association pour la formation professionnelle en assurance / VBV) :

| Module | Titre | Contenu |
|--------|-------|---------|
| **1** | Industrie de l'assurance | Risque et risk management, principes techniques et prime, trois piliers, branches, marché suisse, distribution et intermédiaires, réassurance, surveillance et solvabilité |
| **2** | Droit de l'assurance | Bases du droit suisse, contrat selon le CO, LCA révisée (conclusion, vie du contrat, sinistre), sous/sur/double assurance et subrogation, responsabilité civile, LSA / LPD / LBA |

**16 chapitres de cours, 613 questions commentées, 67 fiches de glossaire.**

Soit environ 35 à 40 questions par chapitre : de quoi refaire plusieurs séries sur un
même sujet sans retomber sur les mêmes questions.

## ▶️ Utilisation

Ouvre `index.html` dans ton navigateur — c'est du HTML/CSS/JS pur, sans installation
ni dépendance.

Ou, depuis ce dossier :

```bash
python3 -m http.server 8000
# puis ouvre http://localhost:8000
```

## ✨ Ce que le site propose

- **Cours** — une fiche par chapitre : explications, tableaux comparatifs, renvois aux
  articles de loi et encadré « à retenir ».
- **Quiz** — par chapitre ou par module. Questions à réponse unique **et** à réponses
  multiples, chacune corrigée avec une explication.
- **Longueur de série réglable** (10, 20, 40 ou tout le lot). La sélection n'est pas
  purement aléatoire : les questions **ratées** sortent en premier, puis celles **jamais
  vues**, et enfin celles déjà acquises.
- **Examen blanc** — 40 questions tirées au hasard dans les deux modules, 45 minutes,
  seuil de réussite à 70 %. La correction n'apparaît qu'à la fin, comme au vrai examen.
- **Réviser mes erreurs** — rejoue uniquement les questions ratées au dernier passage.
- **Flashcards & glossaire** — cartes recto/verso filtrables par thème, avec recherche.
- **Progression** — taux de réussite par chapitre, historique des examens blancs,
  liste des questions à retravailler.
- Thème clair / sombre, raccourcis clavier (`1`–`5` pour répondre, `Entrée` pour valider),
  et mise en page adaptée au mobile.

La progression est stockée **localement** dans le navigateur (`localStorage`) :
rien n'est envoyé sur un serveur.

## 📁 Structure

| Fichier | Rôle |
|---------|------|
| `index.html` | Ossature de la page et chargement des scripts |
| `style.css` | Mise en forme, thèmes clair/sombre, responsive |
| `js/app.js` | Routeur, moteur de quiz, examen, flashcards, statistiques |
| `js/data-module1.js` | Cours et premières questions — Industrie de l'assurance |
| `js/data-module2.js` | Cours et premières questions — Droit de l'assurance |
| `js/data-m1-extra1…4.js` | Banque de questions complémentaire du module 1 (2 chapitres par fichier) |
| `js/data-m2-extra1…5.js` | Banque de questions complémentaire du module 2 |
| `js/data-glossaire.js` | Notions du glossaire / flashcards |

Les fichiers `*-extra*.js` ne contiennent que des questions : ils viennent s'ajouter au
module correspondant via `window.AFA_MODULES`. Tout nouveau fichier de données doit être
déclaré dans `index.html`, **avant** `js/app.js`.

## ➕ Ajouter une question

Dans `js/data-module1.js` ou `js/data-module2.js`, ajoute un objet au tableau
`M.questions` :

```js
{ id: 'm1c2q10', chap: 'c2', type: 'single',   // ou 'multi'
  q: "Intitulé de la question ?",
  choices: ["Réponse A", "Réponse B", "Réponse C"],
  answer: [1],                                  // index des bonnes réponses
  explain: "Pourquoi c'est cette réponse." }
```

`chap` doit correspondre à l'`id` d'un chapitre du même module, et `id` doit être
unique dans tout le site. Cinq choix au maximum, pour rester compatible avec les
raccourcis clavier.

## ⚠️ Avertissement

Support pédagogique **non officiel**, sans lien avec l'AFA/VBV. Les valeurs chiffrées
(rentes AVS, seuils LPP, plafonds LAA, montants du pilier 3a) sont celles de **2025** et
sont adaptées périodiquement : vérifie-les pour l'année de ton examen. En cas de doute,
seuls les textes légaux publiés (LCA, LSA, CO, CC…) font foi.
