# Hannibal ad portas

Jeu de stratégie dans le navigateur sur la **deuxième guerre punique** (218-202 av. J.-C.) :
une **grande campagne** au tour par tour sur une carte en relief de la Méditerranée occidentale,
et des **batailles en temps réel en 3D**, soldat par soldat. Deux batailles historiques sont aussi
jouables seules : **Cannes** (2 août 216 av. J.-C.) et **Zama** (19 octobre 202 av. J.-C.).
HTML et JavaScript purs, Three.js chargé depuis un CDN, aucune installation. Le jeu se joue à la
souris ou au doigt, sur ordinateur, tablette ou téléphone tenu à l'horizontale.

## Lancer

```bash
python3 -m http.server 8000
# puis http://localhost:8000/hannibal/
```

Il faut être connecté (Three.js et les polices viennent d'un CDN).

## Grande campagne

- **La carte** : Hispanie, Gaule du Sud, Italie, Sicile, Sardaigne, Corse, Baléares et Afrique du
  Nord en relief, côtes, Alpes, Pyrénées, Apennins, Atlas et grands fleuves tracés à la main,
  33 provinces avec leur ville, leur peuple, leur revenu, leur garnison et leur muraille.
  Les frontières suivent les crêtes ; chaque faction borde son territoire de sa couleur. Forêts
  (chênes, pins parasols, cyprès, sapins des Alpes, palmiers d'Afrique), champs cultivés autour des
  villes et dans les greniers à blé (plaine du Pô, Campanie, Sicile, vallée du Bagradas), voies
  romaines tracées le long des vallées, mer animée avec écume sur les côtes, brume et nuages aux
  confins du monde connu.
- **Les villes** selon leur peuple : murailles, tours et portes, toits de tuiles en Italie, maisons
  à terrasses en Hispanie et en Afrique, huttes rondes des Gaulois, tentes des Numides, nuraghes de
  Sardaigne. Rome a son Capitole et son Circus Maximus, Carthage sa Byrsa et son port circulaire,
  Syracuse et Tarente leur théâtre ; les ports ont leurs quais, leurs phares et leurs galères.
- **Les armées** sont de petites troupes sur la carte : le général à cheval, l'enseigne de la
  faction qui flotte au vent, les soldats de l'armée (légionnaires, Libyens, Gaulois, éléphants…).
  Elles marchent le long des routes, s'embarquent sur des galères pour les traversées, et dressent
  un camp de siège (palissade, tour d'assaut, bélier) devant les villes qu'elles assiègent. Le
  trajet vers chaque destination possible s'affiche en pointillés : or pour marcher, rouge pour
  attaquer, bleu pour traverser.
- **Les camps** : Rome (15 provinces, la mer, des légions qui se relèvent de chaque défaite) ou
  Carthage (Hannibal à Carthagène avec ses éléphants, l'Hispanie, l'Afrique). Les peuples libres
  (Insubres, Boïens, Ligures, Volques, Celtibères, Lusitaniens, Numides, Maures) défendent leurs terres.
- **Deux tours par an** : en été, deux mouvements ; en hiver, un seul, et le passage des Alpes
  coûte deux fois plus d'hommes. Les traversées par mer prennent un tour, et la flotte romaine
  interdit à Carthage les routes de la mer Tyrrhénienne.
- **Armées et généraux** : 20 unités au plus par armée, menées par les vrais généraux (Hannibal,
  Hasdrubal, Magon, Maharbal, les Scipion, Fabius, Marcellus, Varron…) notés d'une à cinq étoiles.
  Les unités gagnent de l'expérience ; les généraux peuvent tomber au combat.
- **Économie** : chaque ville lève les troupes de son peuple (légions dans le Latium, Libyens et
  éléphants en Afrique, Ibères en Hispanie, Gaulois dans la plaine du Pô) ; chaque unité coûte une
  solde à chaque tour, et un trésor vide fait déserter les troupes.
- **Sièges** : une ville fortifiée se prend par la faim (quelques saisons) ou par l'assaut.
- **Batailles** : quand deux armées se rencontrent, le jeu montre le rapport des forces et propose
  de livrer bataille en 3D, de la résoudre automatiquement ou de se replier. Le champ de bataille
  est construit à partir des armées en présence (triple ligne romaine, ligne et réserve, cavalerie
  aux ailes, éléphants en tête) et du terrain de la province (collines d'Étrurie, plaine du Pô,
  plaine de l'Aufide près de Cannes, plaine d'Afrique), en été ou en hiver. Les pertes reviennent
  dans la campagne.
- **Histoire** : soulèvement des Gaulois cisalpins à l'arrivée d'Hannibal, dictature de Fabius
  après deux désastres, défection de Capoue et des cités du Sud, « Hannibal ad portas » et levée
  des légions urbaines, Syracuse qui change de camp, arrivée du jeune Scipion, ralliement de
  Massinissa, rappel d'Hannibal en Afrique.
- **Victoire** : Rome gagne en prenant Carthage ; Carthage en prenant Rome ou en détachant de Rome
  neuf provinces d'Italie. À la fin de 202 av. J.-C., le camp qui tient le plus de provinces impose
  la paix. La partie est sauvegardée dans le navigateur à chaque action.

## Sur téléphone

- Interface pensée pour l'écran à l'horizontale : barre du haut compacte, ordres en colonne
  d'icônes à droite, cartes d'unités en bas, plans de bataille en une ligne.
- Au doigt : toucher une unité pour la choisir, toucher le sol pour l'y envoyer, un ennemi pour
  l'attaquer ; **appui long puis glisser** pour tracer la ligne de bataille ; bouton « Plusieurs »
  pour choisir plusieurs unités ; glisser, pincer et tourner à deux doigts pour la caméra.
- Plein écran (Android et ordinateurs), invitation à tourner l'écran, qualité « Légère » et
  une figurine pour huit hommes par défaut, résolution qui s'adapte à la fluidité.
- En bataille, les commandes secondaires (son, conseiller, aide tactique, aide) se replient
  derrière le bouton « … » ; les plans de bataille tiennent en une bande et se choisissent d'un
  toucher ; le conseiller reste discret.

## Ce qui est simulé

**Les armées réelles.** À Cannes, 16 légions et ailes alliées (hastati, principes, triarii,
vélites), 6 000 cavaliers, trois consuls et proconsuls ; en face, le croissant gaulois et ibère,
les Libyens en profondeur sur les ailes, les frondeurs baléares, la cavalerie lourde d'Hasdrubal
le long de l'Aufide et les Numides. Environ 72 500 Romains et 50 000 hommes d'Hannibal sur le
terrain. À Zama, les 80 éléphants, les trois lignes d'Hannibal, les manipules de Scipion en
colonnes et la cavalerie de Lélius et de Massinissa.

**Chaque soldat.** On choisit l'échelle : 1:1 (chaque homme est dessiné, plus de 120 000
soldats), 1:2, 1:4, 1:8 ou 1:16. Les figurines tiennent leur place dans les rangs ; quand un
homme tombe au premier rang, celui qui est derrière avance pour boucher le trou. Les membres
sont animés sur la carte graphique (marche, course, coups d'estoc ou de taille, lancer de pilum,
triaires agenouillés, chute) et les morts restent sur le champ.

**Le combat antique.** Seuls les premiers rangs se battent ; la profondeur donne la poussée et
le moral. Les pertes restent faibles tant qu'une ligne tient, et la bataille se décide au moral :
attaque de flanc ou de dos, encerclement (les hommes, écrasés les uns contre les autres, ne
peuvent plus manier leurs armes), fatigue, cohésion, contagion de la panique, présence du
général. Les fuyards sont massacrés, surtout par la cavalerie, et une unité encerclée ne peut
plus fuir.

**Les projectiles.** Chaque javelot, pilum et balle de fronde vole avec sa vraie trajectoire
balistique ; les boucliers arrêtent ceux qui arrivent de face, les pila fichés alourdissent les
boucliers ennemis, et les armes manquées restent plantées dans le sol.

**Le terrain et le ciel.** Plaine d'Apulie moissonnée en août, Aufide, colline et village de
Cannes, camps romains et carthaginois avec leurs remparts et leurs tentes. Le soleil est à sa
position réelle pour la latitude et la date, et avance avec l'heure de la bataille. Le
Volturnus souffle du sud-est et pousse la poussière vers les Romains (Tite-Live XXII.46). Le
sol se piétine là où les troupes passent et combattent.

**Les plans historiques.** L'ordinateur suit le plan d'Hannibal à Cannes : écran de troupes
légères, croissant qui cède pas à pas, Libyens qui pivotent vers l'intérieur, cavalerie
d'Hasdrubal qui balaie les cavaliers romains, fait le tour de l'armée et frappe les alliés puis
les légions dans le dos. Côté romain, Varron fait avancer les légions en profondeur en les
serrant vers le centre. À Zama, les trompettes de Scipion affolent les éléphants, qui peuvent se
retourner contre leur propre camp.

**Le son**, entièrement synthétisé : vent, rumeur de la mêlée, chocs de métal et de boucliers,
cris, galop, sifflement des volées, tuba et cornu romains, carnyx gaulois, barrissements.

## Stratégie façon Total War

- **Plans de bataille proposés** avant chaque bataille, pour chaque camp, avec leurs atouts et
  leurs risques. Appliqué en un clic, un plan redéploie l'armée et tes officiers l'exécutent ; tu
  reprends la main sur n'importe quelle unité à tout moment (elle passe alors « sous tes ordres
  directs », et le bouton « Rendre au plan » la rend aux officiers).
  - Cannes, Rome : le plan de Varron (historique), front large et réserves, mur de légions et
    garde arrière, toute la cavalerie au fleuve.
  - Cannes, Carthage : le croissant d'Hannibal (historique), ligne droite et marteau, défense en
    profondeur.
  - Zama, Rome : les couloirs de Scipion (historique), le quinconce classique, la cavalerie
    d'abord.
  - Zama, Carthage : le plan d'Hannibal (historique), éléphants en réserve, vétérans en tête.
  Laissés à leurs officiers, ces plans n'ont pas tous la même issue : à Cannes, le plan de Varron
  perd comme en 216, alors que « Mur de légions, garde arrière » bat Hannibal.
- **Conseiller** pendant la bataille : il repère les menaces de flanc ou de dos, la cavalerie
  ennemie derrière les lignes, les unités épuisées à relever, la cavalerie libre qui peut frapper
  un dos exposé, les généraux en danger, les éléphants qui chargent… et propose à chaque fois une
  manœuvre exécutable en un clic.
- **Cartes d'unités** en bas de l'écran (effectif, moral, état, formation), regroupées par corps ;
  **bannières** au-dessus de chaque unité ; **carte tactique** agrandissable (Tab).
- **Formations et capacités** : orbis (cercle défensif sans flanc ni dos), mur de lances, ordre
  lâche contre les projectiles, coin de cavalerie (cuneus), volée de pila sur ordre, harangue et
  ralliement du général, trompettes contre les éléphants, relève des lignes.

## Graphismes

Quatre qualités, de « Légère » (téléphones) à **« Ultra 4K »** : rendu interne en 3840 × 2160,
relief deux fois plus fin, chaumes et herbes sèches en 3D autour de la caméra (jusqu'à
180 000 touffes qui ondulent au vent et se couchent là où les troupes passent), rochers, roseaux le
long de l'Aufide, oliviers et peupliers, couche de nuages dont les ombres glissent sur la plaine,
relief fin du sol calculé au pixel, boucliers peints (ailes et éclairs romains, anneaux gaulois,
signe de Tanit), anticrénelage, halo et étalonnage des couleurs. En qualité haute, chaque figurine
est dessinée comme un groupe de 2 à 4 soldats : les rangs ont leur vraie densité. Les soldats
lointains gardent une silhouette arrondie (casques, cimiers, tuniques), les chevaux ont un corps
modelé, une tête effilée et des jambes en deux parties. Vus de haut, les régiments ne sont plus
entourés de cadres : seuls les régiments choisis gardent leur contour.

## Jouer

- Choisis la grande campagne ou une bataille historique, ton camp (Rome, Carthage ou spectateur), l'échelle et la qualité.
- **Déploiement** : avant la bataille, déplace tes unités dans ta moitié du champ.
- **Sélection** : clic sur une unité (Maj pour en ajouter), Maj+glisser pour un rectangle, ou
  les boutons de groupe en bas (double-clic pour y aller).
- **Ordres** : clic droit sur le sol pour marcher, sur un ennemi pour attaquer ; glisser avec
  le clic droit pour tracer la ligne de bataille (position, largeur du front, orientation).
  Au toucher : choisis une unité puis touche le sol ou l'ennemi.
- Avancer, charger (les légionnaires lancent leurs deux pila juste avant le choc), halte,
  reculer, faire face à gauche, à droite ou demi-tour, formation plus profonde ou plus large,
  tir retenu ou à volonté, relève des hastati par les principes.
- **Caméra** : glisser pour se déplacer, molette ou pincement pour zoomer jusqu'à hauteur
  d'homme, clic milieu ou deux doigts pour tourner. Clavier : ZQSD/WASD, A/E pour pivoter,
  R/F pour incliner, Espace pour la pause, 1 à 5 pour la vitesse du temps. « Suivre » et
  « Dans le rang » placent la caméra au milieu des soldats.

## Sources

- Polybe, *Histoires*, III.107-117 (Cannes), VI.19-26 (l'armée romaine), XV.9-16 (Zama).
- Tite-Live, *Histoire romaine*, XXII.44-50 et XXX.32-35.
- Effectifs et pertes historiques : Polybe donne 70 000 Romains tués à Cannes et environ 5 700
  du côté d'Hannibal ; Tite-Live, 48 200 et 8 000.

Les valeurs de combat (attaque, défense, moral, fatigue) sont des estimations relatives, pas des
chiffres antiques. Lancée en spectateur, la bataille de Cannes reproduit en général
l'encerclement et une lourde défaite romaine.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Interface et styles |
| `js/data.js` | Types de troupes, ordres de bataille, textes historiques |
| `js/sim.js` | Moteur de bataille (sans Three.js, testable dans Node) |
| `js/ai.js` | Plans d'Hannibal, de Varron et de Scipion, réflexes des unités |
| `js/plans.js` | Plans proposés au joueur, doctrine des officiers, conseiller |
| `js/campaign.js` | Campagne : provinces, armées, généraux, économie, sièges, événements, IA (sans Three.js) |
| `js/battlegen.js` | Batailles de campagne : déploiement des armées, terrain, retour des pertes |
| `js/geo.js` | Côtes, montagnes et fleuves de la Méditerranée occidentale |
| `js/campmap.js` | Carte de campagne en 3D : relief, provinces, frontières, routes, mer, forêts, armées |
| `js/mapart.js` | Décors de la carte : arbres, villes selon les peuples, ports et galères, troupes, étendards, siège |
| `js/campui.js` | Interface de la campagne : sélection, marche, levées, batailles, tours |
| `js/nature.js` | Herbes 3D, rochers, roseaux, nuages et leurs ombres, textures fines du sol |
| `js/post.js` | Rendu cinéma (anticrénelage, halo, étalonnage) |
| `js/terrain.js` | Relief, rivière, nature du sol |
| `js/models.js` | Soldats, chevaux et éléphants modélisés par code |
| `js/figures.js` | Soldats instanciés et animés sur la carte graphique |
| `js/world.js` | Ciel, soleil, terrain, rivière, végétation, camps |
| `js/effects.js` | Projectiles, poussière, étendards, contours tactiques |
| `js/camera.js` | Caméra souris, clavier et tactile |
| `js/audio.js` | Sons synthétisés |
| `js/ui.js` | Menu, sélection, ordres, carte, dépêches, bilan |
| `js/main.js` | Assemblage et boucle de jeu |
