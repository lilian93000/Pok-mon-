# AFA Suisse — entraînement 🛡️

Site d'entraînement à la formation d'**intermédiaire en assurance AFA** (Association
pour la formation professionnelle en assurance / VBV), centré sur les Circles
**Lancement** et **Base**.

| Module | Titre | Contenu |
|--------|-------|---------|
| **1** | Industrie de l'assurance | Notions élémentaires, risque et risk management, principes techniques, prime et systèmes de financement, trois piliers, branches, marché suisse, affaires d'assurance et chaîne de valeur, distribution et intermédiaires, réassurance, surveillance et solvabilité |
| **2** | Droit de l'assurance | Bases du droit suisse, contrat selon le CO, LCA révisée (conclusion, vie du contrat, sinistre), sous/sur/double assurance et subrogation, responsabilité civile, LSA / LPD / LBA / LPCC, conciliation et juridiction |

**19 chapitres de cours et 357 questions, toutes au gabarit de l'examen** — dont les
**27 questions de la série zéro** publiée par l'AFA et **166 tableaux d'attribution**.
Le droit de l'assurance en compte **223**, l'industrie de l'assurance **134**.

### 🎯 Banque restreinte au format officiel

Le site ne sert plus que les questions marquées `lvl: 'off'` : celles de la série zéro
officielle, et celles rédigées sur le même modèle à partir du support de cours myVBV.
Les **autres questions ne sont pas supprimées** — leurs fichiers restent chargés et
intacts, elles sont seulement écartées de la banque active par `js/data-filtre-officiel.js`.

Pour rétablir l'intégralité de la banque, retirer une seule ligne d'`index.html` :

```html
<script src="js/data-filtre-officiel.js"></script>
```

Le sélecteur de niveau disparaît tant que toutes les questions relèvent du même niveau,
et réapparaît de lui-même dès que le filtre est levé.

Les chapitres les mieux fournis sont ceux qui pèsent le plus à l'examen : LSA, LPD,
LBA et LPCC (75 questions), principes techniques (36), LCA II — Vie du contrat (28),
LCA I — Conclusion (26), intermédiation (23) et responsabilité civile (22).

### 💤 Module Non-Vie en veille

Un troisième module couvre le **profil Non-Vie** (ménage, bâtiment et dommages naturels,
véhicules, RC privée et d'entreprise, choses des entreprises, protection juridique,
souscription et sinistres) : 8 chapitres et 261 questions. Il **n'est pas chargé**, le
parcours en cours portant sur Lancement et Base. Ses fichiers sont intacts — pour le
réactiver, il suffit de remettre dans `index.html`, avant `js/app.js`, les cinq lignes
signalées par le commentaire qui s'y trouve :

```html
<script src="js/data-module3.js"></script>
<script src="js/data-m3-extra1.js"></script>
<script src="js/data-m3-extra2.js"></script>
<script src="js/data-m3-extra3.js"></script>
<script src="js/data-cas1.js"></script>
```

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
  n'apparaît qu'à la fin, comme au vrai examen. Le **périmètre est réglable** : les deux
  modules, ou un seul.
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
| `js/data-module3.js`, `js/data-m3-extra1…3.js`, `js/data-cas1.js` | Module Non-Vie — **en veille**, non chargés dans `index.html` |
| `js/data-m1-extra1…4.js` | Banque de questions complémentaire du module 1 (2 chapitres par fichier) |
| `js/data-m2-extra1…5.js` | Banque de questions complémentaire du module 2 |
| `js/data-m1-hard.js`, `js/data-m2-hard.js` | Questions de niveau avancé (`lvl: 'hard'`) |
| `js/data-cas2…3.js` | Mises en situation (`lvl: 'cas'`, champ `ctx`) — cas2 format plateforme, cas3 Lancement &amp; Base |
| `js/data-sources.js` | Questions adossées à une source officielle (`lvl: 'src'`, champ `src`) |
| `js/data-plan-officiel.js` | Chapitres et sujets ajoutés pour coller au plan officiel des deux modules |
| `js/data-nullserie.js` | Les 27 questions de la série zéro publiée par l'AFA |
| `js/data-format-officiel.js` | Questions rédigées au gabarit de la série zéro (`lvl: 'off'`, dont les grilles) |
| `js/data-cours-officiel.js` | Support officiel (1) : 14 caractéristiques, risques actuariels, communauté de risques |
| `js/data-cours-officiel2.js` | Support officiel (2) : chaîne de la prime, ayants droit, canaux de vente, réassurance, intermédiaires |
| `js/data-questions-cours.js` | Questions du support officiel (1) : classification, surveillance, sources du droit, formation et fin du contrat, voies de droit, responsabilité |
| `js/data-questions-cours2.js` | Questions du support officiel (2) : notions élémentaires, affaires d'assurance, marché suisse, réassurance, sinistre |
| `js/data-questions-cours3.js` | Questions du support officiel (3) : caractéristiques restantes, chiffres du marché, formes de conseil, fonds LSA |
| `js/data-questions-droit.js` | Droit (1) : CO, sous-assurance et subrogation, bases du droit, sinistre, responsabilité civile |
| `js/data-questions-droit2.js` | Droit (2) : LCA article par article, LPD et LBA, causalité et solidarité, voies de droit |
| `js/data-questions-lpd-lba.js` | Droit (3) : protection des données et blanchiment — notions, principes, obligations, art. 305ter CP, autorégulation ASA, sanctions |
| `js/data-questions-lpcc.js` | Droit (4) : placements collectifs de capitaux — notion, formes ouvertes et fermées, autorisations, assurance-vie liée à des fonds, fonds étrangers |
| `js/data-filtre-officiel.js` | Restreint la banque active aux seules questions au gabarit de l'examen |
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
banque existante est en cours : **248 des 475 questions concernées** ont été réécrites à ce jour : le module 1 est
propre à 90 %, le module 2 à 60 %.

Les questions et les fiches ont, à une exception près, été **rédigées de A à Z pour ce
site**, à partir de connaissances générales du droit suisse des assurances et du
programme des deux premiers modules AFA. Elles ne proviennent d'aucun manuel ni
d'aucun examen réel.

L'exception : les **27 questions de `data-nullserie.js`** reprennent la **série zéro
publiée par l'AFA** (« Nullserie GFK »), que l'association diffuse précisément comme
exemples de l'épreuve écrite — intitulés, propositions et barème d'origine, avec des
commentaires rédigés pour ce site. Ce sont elles qui ont fixé le gabarit suivi par les
`data-format-officiel.js`, et notamment le **tableau d'attribution**.

Le **support de cours officiel** (myVBV Lernmedien) a servi de référence pour trois
blocs repris tels quels dans leur structure et leur vocabulaire : les **14 caractéristiques
de l'assurance**, les **risques actuariels** avec leur limitation primaire et secondaire, et
le passage **de l'aide mutuelle à la communauté de risques**, la **chaîne de la prime** en cinq
niveaux, les **groupes d'ayants droit**, les **canaux de vente**, la taxonomie de la
**réassurance** et le statut des **intermédiaires**. Le processus de gestion des
risques a été corrigé pour suivre les **cinq phases** officielles — la clarification des
objectifs manquait — et les quatre moyens de maîtrise portent désormais leurs noms
officiels : éviter, réduire/limiter, **répercuter**, **prendre en charge**. Les **systèmes de
financement** ont également été repris : contrairement à ce qui figurait ici, « répartition »
et « couverture des besoins » ne sont **pas** synonymes — la première affecte les primes
immédiatement aux prestations (AVS), la seconde les calcule d'avance et constitue une
réserve technique (assurance privée).

Ont été **vérifiés contre des sources officielles** : les délais et articles clés de la
LCA révisée (art. 2a, 35a, 42, 46, ainsi que l'abrogation de l'ancien art. 12 et sa
« fiction d'approbation ») ; les montants 2026 des assurances sociales auprès de l'OFAS
(rentes AVS, seuils LPP, pilier 3a, gain assuré LAA) ; et l'actualité 2024–2026 —
13e rente AVS, calendrier AVS 21, rejet de la réforme LPP, acceptation d'EFAS, prime
moyenne LAMal 2026, rapport de la FINMA sur le marché de l'assurance 2024.

Les **33 questions marquées « source officielle »** citent chacune la publication qui
les fonde, avec un lien cliquable dans la correction. Les faits ont été contrôlés en
août 2026 ; les publications elles-mêmes peuvent évoluer.

N'ont **pas** été vérifiés un par un : chaque numéro d'article cité dans les questions. Signale toute divergence — en cas de doute, seuls les textes légaux publiés
(LCA, LSA, CO, CC…) font foi.

## 🎯 Repères par rapport au parcours officiel

Le parcours AFA est organisé en **Circles** regroupés par thèmes (*Base*, *Acquérir des
clients*, *Conseiller et servir les clients*, *Préparation à l'examen*). Les cercles
**Lancement** et **Base** correspondent à l'industrie de l'assurance et au droit de
l'assurance, soit les **modules 1 et 2** de ce site — c'est là que se concentrent les
mises en situation et les questions au format officiel. Le module Non-Vie, qui
intervient plus loin dans le parcours, est pour l'instant en veille.

Le vocabulaire suit celui de l'examen lorsqu'il diverge des manuels : les questions
officielles parlent ainsi de « système de la couverture des besoins » là où la
littérature dit « répartition des dépenses ». Les deux appellations sont données côte
à côte dans la fiche de cours.

Ce site n'entraîne **que l'écrit** : la partie orale n'est pas simulée.

Support pédagogique **non officiel**, sans lien avec l'AFA/VBV. Les valeurs chiffrées
(rentes AVS, seuils LPP, plafonds LAA, montants du pilier 3a) sont celles de **2026** (vérifiées auprès de l'OFAS) et
sont adaptées périodiquement : vérifie-les pour l'année de ton examen. En cas de doute,
seuls les textes légaux publiés (LCA, LSA, CO, CC…) font foi.

## 📦 Version en un seul fichier

Pour héberger le site là où l'on ne peut déposer qu'un fichier (ou pour l'envoyer
par courriel), regroupe tout — style et scripts compris — en une page autonome :

```bash
node build-single-file.js            # produit afa-site-complet.html (~860 Ko)
node build-single-file.js /tmp/x.html  # ou vers le chemin de ton choix
```

Le fichier obtenu s'ouvre directement dans un navigateur, sans serveur et sans
connexion internet. Le script reprend l'ordre de chargement déclaré dans
`index.html` : ajoute-y tes nouveaux fichiers de données et ils suivront.
