# AFA Suisse — entraînement 🛡️

Site d'entraînement à la formation d'**intermédiaire en assurance AFA** (Association
pour la formation professionnelle en assurance / VBV) : les deux modules communs, plus
un module entièrement consacré au **profil Non-Vie**.

| Module | Titre | Contenu |
|--------|-------|---------|
| **1** | Industrie de l'assurance | Notions élémentaires, risque et risk management, principes techniques, prime et systèmes de financement, trois piliers, branches, marché suisse, affaires d'assurance et chaîne de valeur, distribution et intermédiaires, réassurance, surveillance et solvabilité |
| **2** | Droit de l'assurance | Bases du droit suisse, contrat selon le CO, LCA révisée (conclusion, vie du contrat, sinistre), sous/sur/double assurance et subrogation, responsabilité civile, LSA / LPD / LBA, conciliation et juridiction |
| **3** | Assurances non-vie *(profil Non-Vie)* | Ménage, bâtiment et dommages naturels, véhicules à moteur, RC privée, RC d'entreprise, assurances de choses des entreprises et perte d'exploitation, protection juridique / cyber / cautionnement, souscription et traitement des sinistres |

**27 chapitres de cours, 1152 questions commentées (dont 77 de niveau avancé, 142 mises en
situation, 33 adossées à une source officielle citée et 74 au gabarit exact de l'examen —
dont les 27 questions de la série zéro publiée par l'AFA), 67 fiches de glossaire.**

Le module 3 couvre le **profil Non-Vie** à lui seul, avec **261 questions**.

Soit environ 40 questions par chapitre : de quoi refaire plusieurs séries sur un
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
- **Filtre de niveau** — « tous niveaux », « difficiles », « mises en situation », « avec source officielle » ou « format officiel ». Les questions
  avancées (marquées `lvl: 'hard'`, signalées par un badge pendant le quiz) portent sur
  des calculs à plusieurs étapes, des combinaisons de délais et des pièges de
  qualification juridique. Les questions **sourcées** (`lvl: 'src'`) affichent sous la
  correction un lien vers la publication officielle qui les fonde — OFAS, OFSP, FINMA,
  Fedlex, AFA/VBV. Les **mises en situation** (`lvl: 'cas'`, champ `ctx`) reprennent le
  format de la plateforme officielle : chaque question porte **son propre énoncé**,
  soit une situation à classer dans une catégorie, soit un « dans lesquelles de ces
  situations… » dont chaque choix est lui-même un scénario.
- **Format officiel** (`lvl: 'off'`) — les questions calquées sur la série zéro publiée
  par l'AFA : en-tête « Thème : module, sujet, sous-sujet », consigne « Cochez la bonne
  réponse » / « Cochez les bonnes réponses », et barème affiché (1 point = complexité
  simple, 2 points = moyenne). Elles introduisent le **tableau d'attribution**
  (`type: 'grid'`) du vrai examen : une ligne par énoncé, une colonne à cocher par
  catégorie — y compris la variante Vrai/Faux. Les touches `1`–`4` remplissent le
  tableau ligne après ligne.
- **Examen blanc** — 40 questions, 45 minutes, seuil de réussite à 70 %. La correction
  n'apparaît qu'à la fin, comme au vrai examen. Le **périmètre est réglable** : tous les
  modules, ou un seul — pratique pour préparer le profil Non-Vie.
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
| `js/data-module3.js` | Cours et premières questions — Assurances non-vie |
| `js/data-m3-extra1…3.js` | Banque de questions complémentaire du module 3 |
| `js/data-m1-extra1…4.js` | Banque de questions complémentaire du module 1 (2 chapitres par fichier) |
| `js/data-m2-extra1…5.js` | Banque de questions complémentaire du module 2 |
| `js/data-m1-hard.js`, `js/data-m2-hard.js` | Questions de niveau avancé (`lvl: 'hard'`) |
| `js/data-cas1…3.js` | Mises en situation (`lvl: 'cas'`, champ `ctx`) — cas1 non-vie, cas2 format plateforme, cas3 Lancement &amp; Base |
| `js/data-sources.js` | Questions adossées à une source officielle (`lvl: 'src'`, champ `src`) |
| `js/data-plan-officiel.js` | Chapitres et sujets ajoutés pour coller au plan officiel des deux modules |
| `js/data-nullserie.js` | Les 27 questions de la série zéro publiée par l'AFA |
| `js/data-format-officiel.js` | Questions rédigées au gabarit de la série zéro (`lvl: 'off'`, dont les grilles) |
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

Pour une question au gabarit officiel, ajoute l'en-tête et le barème, et — s'il s'agit
d'un tableau d'attribution — remplace `choices` par `cols` / `rows`, `answer` donnant
alors l'index de colonne de **chaque ligne** :

```js
{ id: 'fo130', chap: 'c4', type: 'grid', lvl: 'off', pts: 2, cx: 'Moyenne',
  theme: 'IA, classification, dommage-somme',
  q: "S'agit-il d'une assurance de dommages ou d'une assurance de sommes ?",
  cols: ["Assurance de dommages", "Assurance de sommes"],
  rows: ["Assurance ménage", "Assurance décès à capital fixe"],
  answer: [0, 1],                               // ligne 0 → colonne 0, ligne 1 → colonne 1
  explain: "…" }
```

`chap` doit correspondre à l'`id` d'un chapitre du même module, et `id` doit être
unique dans tout le site — de même que le couple énoncé + question. Huit choix au
maximum (les touches `1`–`8` les sélectionnent), et quatre colonnes au maximum pour
une grille.

## ⚠️ Provenance du contenu et limites

Les questions sont écrites au gabarit de la **série zéro officielle** : énoncé formulé
comme une vraie question, propositions de longueur et de registre comparables, bonne
réponse dont la position varie et qui n'est jamais la plus longue — le piège qui permet
de deviner sans savoir. Un contrôle automatique signale les écarts, et la reprise de la
banque existante est en cours : **209 des 605 questions concernées** ont été réécrites à
ce jour, le module 1 étant terminé pour l'essentiel.

Les questions et les fiches ont, à une exception près, été **rédigées de A à Z pour ce
site**, à partir de connaissances générales du droit suisse des assurances et du
programme des deux premiers modules AFA. Elles ne proviennent d'aucun manuel ni
d'aucun examen réel.

L'exception : les **27 questions de `data-nullserie.js`** reprennent la **série zéro
publiée par l'AFA** (« Nullserie GFK »), que l'association diffuse précisément comme
exemples de l'épreuve écrite — intitulés, propositions et barème d'origine, avec des
commentaires rédigés pour ce site. Ce sont elles qui ont fixé le gabarit suivi par les
`data-format-officiel.js`, et notamment le **tableau d'attribution**.

Ont été **vérifiés contre des sources officielles** : les délais et articles clés de la
LCA révisée (art. 2a, 35a, 42, 46, ainsi que l'abrogation de l'ancien art. 12 et sa
« fiction d'approbation ») ; les montants 2026 des assurances sociales auprès de l'OFAS
(rentes AVS, seuils LPP, pilier 3a, gain assuré LAA) ; et l'actualité 2024–2026 —
13e rente AVS, calendrier AVS 21, rejet de la réforme LPP, acceptation d'EFAS, prime
moyenne LAMal 2026, rapport de la FINMA sur le marché de l'assurance 2024.

Les **33 questions marquées « source officielle »** citent chacune la publication qui
les fonde, avec un lien cliquable dans la correction. Les faits ont été contrôlés en
août 2026 ; les publications elles-mêmes peuvent évoluer.

N'ont **pas** été vérifiés un par un : chaque numéro d'article cité dans les 1152
questions. Signale toute divergence — en cas de doute, seuls les textes légaux publiés
(LCA, LSA, CO, CC…) font foi.

## 🎯 Repères par rapport au parcours officiel

Le parcours AFA est organisé en **Circles** regroupés par thèmes (*Base*, *Acquérir des
clients*, *Conseiller et servir les clients*, *Préparation à l'examen*). Les cercles
**Lancement** et **Base** correspondent à l'industrie de l'assurance et au droit de
l'assurance, soit les **modules 1 et 2** de ce site — c'est là que se concentrent les
mises en situation et les questions au format officiel. Le **module 3** prépare le
profil Non-Vie, qui intervient plus loin dans le parcours.

Le vocabulaire suit celui de l'examen lorsqu'il diverge des manuels : les questions
officielles parlent ainsi de « système de la couverture des besoins » là où la
littérature dit « répartition des dépenses ». Les deux appellations sont données côte
à côte dans la fiche de cours.

Le profil **Non-Vie** habilite à conclure exclusivement dans le domaine non-vie, à
l'exclusion de l'assurance-maladie complémentaire, qui relève d'un profil distinct.
L'épreuve écrite en ligne consacre 60 minutes à la partie non-vie, avec un traitement
de cas guidé. Ce site n'entraîne **que l'écrit** : la partie orale n'est pas simulée.

Support pédagogique **non officiel**, sans lien avec l'AFA/VBV. Les valeurs chiffrées
(rentes AVS, seuils LPP, plafonds LAA, montants du pilier 3a) sont celles de **2026** (vérifiées auprès de l'OFAS) et
sont adaptées périodiquement : vérifie-les pour l'année de ton examen. En cas de doute,
seuls les textes légaux publiés (LCA, LSA, CO, CC…) font foi.

## 📦 Version en un seul fichier

Pour héberger le site là où l'on ne peut déposer qu'un fichier (ou pour l'envoyer
par courriel), regroupe tout — style et scripts compris — en une page autonome :

```bash
node build-single-file.js            # produit afa-site-complet.html (~840 Ko)
node build-single-file.js /tmp/x.html  # ou vers le chemin de ton choix
```

Le fichier obtenu s'ouvre directement dans un navigateur, sans serveur et sans
connexion internet. Le script reprend l'ordre de chargement déclaré dans
`index.html` : ajoute-y tes nouveaux fichiers de données et ils suivront.
