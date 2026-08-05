# AFA Suisse — entraînement 🛡️

Site d'entraînement aux **deux premiers modules** de la formation d'**intermédiaire en
assurance AFA** (Association pour la formation professionnelle en assurance / VBV) :

| Module | Titre | Contenu |
|--------|-------|---------|
| **1** | Industrie de l'assurance | Risque et risk management, principes techniques et prime, trois piliers, branches, marché suisse, distribution et intermédiaires, réassurance, surveillance et solvabilité |
| **2** | Droit de l'assurance | Bases du droit suisse, contrat selon le CO, LCA révisée (conclusion, vie du contrat, sinistre), sous/sur/double assurance et subrogation, responsabilité civile, LSA / LPD / LBA |

**16 chapitres de cours, 706 questions commentées (dont 64 de niveau avancé et 29 adossées à une source officielle citée), 67 fiches de glossaire.**

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
- **Filtre de niveau** — « tous niveaux », « difficiles » ou « avec source officielle ». Les questions
  avancées (marquées `lvl: 'hard'`, signalées par un badge pendant le quiz) portent sur
  des calculs à plusieurs étapes, des combinaisons de délais et des pièges de
  qualification juridique. Les questions **sourcées** (`lvl: 'src'`) affichent sous la
  correction un lien vers la publication officielle qui les fonde — OFAS, OFSP, FINMA,
  Fedlex, AFA/VBV.
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
| `js/data-m1-hard.js`, `js/data-m2-hard.js` | Questions de niveau avancé (`lvl: 'hard'`) |
| `js/data-sources.js` | Questions adossées à une source officielle (`lvl: 'src'`, champ `src`) |
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

Ajoute `lvl: 'hard'` pour classer la question parmi les questions difficiles :

```js
{ id: 'm1c2h06', chap: 'c2', type: 'single', lvl: 'hard', /* … */ }
```

`chap` doit correspondre à l'`id` d'un chapitre du même module, et `id` doit être
unique dans tout le site. Cinq choix au maximum, pour rester compatible avec les
raccourcis clavier.

## ⚠️ Provenance du contenu et limites

Les questions et les fiches ont été **rédigées de A à Z pour ce site**, à partir de
connaissances générales du droit suisse des assurances et du programme des deux
premiers modules AFA. Elles ne proviennent **d'aucune banque de questions officielle**,
d'aucun manuel et d'aucun examen réel : rien n'est copié, mais rien ne garantit non
plus que la formulation colle exactement à celle de l'examen.

Ont été **vérifiés contre des sources officielles** : les délais et articles clés de la
LCA révisée (art. 2a, 35a, 42, 46, ainsi que l'abrogation de l'ancien art. 12 et sa
« fiction d'approbation ») ; les montants 2026 des assurances sociales auprès de l'OFAS
(rentes AVS, seuils LPP, pilier 3a, gain assuré LAA) ; et l'actualité 2024–2026 —
13e rente AVS, calendrier AVS 21, rejet de la réforme LPP, acceptation d'EFAS, prime
moyenne LAMal 2026, rapport de la FINMA sur le marché de l'assurance 2024.

Les **29 questions marquées « source officielle »** citent chacune la publication qui
les fonde, avec un lien cliquable dans la correction. Les faits ont été contrôlés en
août 2026 ; les publications elles-mêmes peuvent évoluer.

N'ont **pas** été vérifiés un par un : chaque numéro d'article cité dans les 677
questions. Signale toute divergence — en cas de doute, seuls les textes légaux publiés
(LCA, LSA, CO, CC…) font foi.

Support pédagogique **non officiel**, sans lien avec l'AFA/VBV. Les valeurs chiffrées
(rentes AVS, seuils LPP, plafonds LAA, montants du pilier 3a) sont celles de **2026** (vérifiées auprès de l'OFAS) et
sont adaptées périodiquement : vérifie-les pour l'année de ton examen. En cas de doute,
seuls les textes légaux publiés (LCA, LSA, CO, CC…) font foi.

## 📦 Version en un seul fichier

Pour héberger le site là où l'on ne peut déposer qu'un fichier (ou pour l'envoyer
par courriel), regroupe tout — style et scripts compris — en une page autonome :

```bash
node build-single-file.js            # produit afa-site-complet.html (~430 Ko)
node build-single-file.js /tmp/x.html  # ou vers le chemin de ton choix
```

Le fichier obtenu s'ouvre directement dans un navigateur, sans serveur et sans
connexion internet. Le script reprend l'ordre de chargement déclaré dans
`index.html` : ajoute-y tes nouveaux fichiers de données et ils suivront.
