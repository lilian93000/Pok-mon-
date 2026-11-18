# Hannibal ad portas

Simulateur 3D de bataille antique dans le navigateur : **Rome contre Hannibal**, à **Cannes**
(2 août 216 av. J.-C.) et à **Zama** (19 octobre 202 av. J.-C.). HTML et JavaScript purs,
Three.js chargé depuis un CDN, aucune installation.

## Lancer

```bash
python3 -m http.server 8000
# puis http://localhost:8000/hannibal/
```

Il faut être connecté (Three.js et les polices viennent d'un CDN).

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

## Jouer

- Choisis la bataille, ton camp (Rome, Carthage ou spectateur), l'échelle et la qualité.
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
| `js/terrain.js` | Relief, rivière, nature du sol |
| `js/models.js` | Soldats, chevaux et éléphants modélisés par code |
| `js/figures.js` | Soldats instanciés et animés sur la carte graphique |
| `js/world.js` | Ciel, soleil, terrain, rivière, végétation, camps |
| `js/effects.js` | Projectiles, poussière, étendards, contours tactiques |
| `js/camera.js` | Caméra souris, clavier et tactile |
| `js/audio.js` | Sons synthétisés |
| `js/ui.js` | Menu, sélection, ordres, carte, dépêches, bilan |
| `js/main.js` | Assemblage et boucle de jeu |
