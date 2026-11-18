/* Troupes et ordres de bataille.
   Sources : Polybe, Histoires III.107-117 (Cannes), VI.19-26 (armée romaine), XV.9-16 (Zama) ;
   Tite-Live, XXII.44-50 et XXX.32-35. Effectifs réels ; les valeurs de combat sont des
   estimations relatives (armement, entraînement, moral) et non des données antiques.

   Unités : ma = attaque au corps à corps, md = défense (armure + bouclier), charge = impact,
   morale = moral de départ (0-100), stamina = vitesse de fatigue (1 = normale),
   spX / spZ = place d'un homme en largeur / profondeur (m), walk / run = vitesses (m/s). */

export const TYPES = {
  // ------------------------------------------------------------------ ROME
  hastati: {
    name: 'Hastati', short: 'Hastati', cat: 'inf', heavy: true, arch: 'hastatus',
    spX: 1.5, spZ: 1.2, walk: 1.25, run: 3.0, ma: 10, md: 10, charge: 6, morale: 60, stamina: 1.0, mass: 1.0,
    pila: 2,
    desc: "Première ligne de la légion : des hommes jeunes. Casque de bronze de type Montefortino surmonté de trois plumes droites, pourpres ou noires, hautes d'une coudée ; plaque de bronze sur la poitrine, grand bouclier ovale (scutum), deux pila et le glaive hispanique (Polybe VI.23).",
  },
  principes: {
    name: 'Principes', short: 'Principes', cat: 'inf', heavy: true, arch: 'princeps',
    spX: 1.5, spZ: 1.2, walk: 1.25, run: 3.0, ma: 11, md: 12, charge: 6, morale: 66, stamina: 0.95, mass: 1.0,
    pila: 2,
    desc: "Deuxième ligne : hommes dans la force de l'âge. Même armement que les hastati, mais beaucoup portent la cotte de mailles (lorica hamata), réservée à ceux qui peuvent se l'offrir.",
  },
  triarii: {
    name: 'Triarii', short: 'Triarii', cat: 'inf', heavy: true, arch: 'triarius', spear: true,
    spX: 1.5, spZ: 1.2, walk: 1.2, run: 2.6, ma: 11, md: 13, charge: 4, morale: 80, stamina: 1.0, mass: 1.05,
    desc: "Troisième ligne : les vétérans, armés de la lance longue (hasta). Ils attendent agenouillés derrière leur bouclier, d'où le proverbe « res ad triarios rediit » : l'affaire en est venue aux triaires.",
  },
  velites: {
    name: 'Vélites', short: 'Vélites', cat: 'inf', light: true, arch: 'veles', pass: true,
    spX: 2.2, spZ: 2.0, walk: 1.4, run: 3.8, ma: 4, md: 3, charge: 2, morale: 45, stamina: 0.9, mass: 0.6,
    missile: { kind: 'javelin', range: 34, ammo: 5, reload: 7, v: 21, pHit: 0.32, pKill: 0.35, spread: 0.06 },
    desc: "Infanterie légère : les plus pauvres et les plus jeunes. Petit bouclier rond (parma) de trois pieds, javelots légers dont la pointe se tord à l'impact, et souvent une peau de loup sur le casque pour être reconnus (Polybe VI.22).",
  },
  equites: {
    name: 'Cavalerie romaine', short: 'Equites', cat: 'cav', arch: 'eques',
    spX: 2.0, spZ: 3.4, walk: 1.8, trot: 4.5, run: 8.0, ma: 9, md: 8, charge: 13, morale: 56, stamina: 1.0, mass: 2.4,
    desc: "Les citoyens les plus riches, montés sans étriers ni selle à arçons. À Cannes, coincés entre la légion et l'Aufide, ils n'avaient pas la place de manœuvrer : Tite-Live raconte qu'ils mirent pied à terre pour combattre.",
  },
  socii_eq: {
    name: 'Cavalerie alliée', short: 'Eq. alliés', cat: 'cav', arch: 'eques_socii',
    spX: 2.0, spZ: 3.4, walk: 1.8, trot: 4.5, run: 8.0, ma: 9, md: 8, charge: 13, morale: 54, stamina: 1.0, mass: 2.4,
    desc: "Cavaliers fournis par les alliés italiens de Rome. Sous les ordres directs du consul Varron sur l'aile gauche.",
  },
  gen_rom: {
    name: 'Consul et escorte', short: 'Consul', cat: 'gen', arch: 'gen_rom',
    spX: 2.4, spZ: 3.4, walk: 1.8, trot: 4.5, run: 8.0, ma: 11, md: 11, charge: 10, morale: 88, stamina: 0.9, mass: 2.4,
    desc: "Le général et ses licteurs à cheval. Sa présence raffermit le moral des unités proches ; sa mort ébranle toute l'armée.",
  },

  // ---------------------------------------------------------- CARTHAGE
  gauls: {
    name: 'Gaulois', short: 'Gaulois', cat: 'inf', heavy: true, arch: 'gaul',
    spX: 1.6, spZ: 1.3, walk: 1.3, run: 3.4, ma: 11, md: 6, charge: 12, morale: 58, stamina: 1.35, mass: 1.05,
    desc: "Insubres et Boïens de la plaine du Pô. Polybe les décrit nus jusqu'à la ceinture, avec de longues épées à taille seulement et de grands boucliers plats. Terribles au premier choc, ils se fatiguent vite.",
  },
  iberians: {
    name: 'Ibères', short: 'Ibères', cat: 'inf', heavy: true, arch: 'iber',
    spX: 1.6, spZ: 1.3, walk: 1.3, run: 3.3, ma: 10, md: 8, charge: 8, morale: 64, stamina: 1.0, mass: 1.0,
    desc: "Fantassins d'Hispanie en courtes tuniques de lin blanc bordées de pourpre (Polybe III.114), armés de l'épée courte qui frappe d'estoc et de taille, ancêtre du glaive romain.",
  },
  libyans: {
    name: 'Libyens', short: 'Libyens', cat: 'inf', heavy: true, arch: 'libyan',
    spX: 1.5, spZ: 1.2, walk: 1.3, run: 3.0, ma: 12, md: 12, charge: 7, morale: 82, stamina: 0.8, mass: 1.05,
    desc: "Le cœur de l'armée d'Hannibal : des vétérans d'Afrique, rééquipés avec les armes prises aux Romains à la Trébie et au lac Trasimène. De loin, on pouvait les prendre pour des légionnaires.",
  },
  balearics: {
    name: 'Frondeurs baléares', short: 'Baléares', cat: 'inf', light: true, arch: 'slinger', pass: true,
    spX: 2.4, spZ: 2.0, walk: 1.4, run: 3.8, ma: 3, md: 2, charge: 1, morale: 46, stamina: 0.9, mass: 0.5,
    missile: { kind: 'sling', range: 115, ammo: 30, reload: 5, v: 42, pHit: 0.2, pKill: 0.22, spread: 0.035 },
    desc: "Les meilleurs frondeurs du monde antique, entraînés dès l'enfance. Trois frondes de longueurs différentes selon la distance ; leurs balles pouvaient briser un casque. C'est l'une d'elles qui blessa le consul Paul-Émile au début de la bataille (Tite-Live XXII.49).",
  },
  lonchophoroi: {
    name: 'Lanceurs de javelots', short: 'Javeliniers', cat: 'inf', light: true, arch: 'lonch', pass: true,
    spX: 2.4, spZ: 2.0, walk: 1.4, run: 3.8, ma: 4, md: 3, charge: 2, morale: 48, stamina: 0.9, mass: 0.6,
    missile: { kind: 'javelin', range: 34, ammo: 5, reload: 7, v: 21, pHit: 0.3, pKill: 0.35, spread: 0.06 },
    desc: "Infanterie légère africaine et ibère armée de javelots (lonchophoroi chez Polybe), chargée de harceler la ligne romaine avant le choc.",
  },
  iber_cav: {
    name: 'Cavalerie ibère et gauloise', short: 'Cav. lourde', cat: 'cav', arch: 'ibercav',
    spX: 2.0, spZ: 3.4, walk: 1.8, trot: 4.5, run: 8.2, ma: 12, md: 9, charge: 16, morale: 74, stamina: 0.95, mass: 2.5,
    desc: "La cavalerie lourde d'Hasdrubal, le long du fleuve. Après avoir écrasé les cavaliers romains, elle fit le tour complet de l'armée romaine pour frapper les alliés par derrière, puis les légions dans le dos.",
  },
  numidians: {
    name: 'Cavalerie numide', short: 'Numides', cat: 'cav', light: true, arch: 'numid',
    spX: 2.6, spZ: 3.8, walk: 2.2, trot: 5.5, run: 9.5, ma: 6, md: 4, charge: 5, morale: 70, stamina: 0.8, mass: 1.6,
    missile: { kind: 'javelin', range: 30, ammo: 6, reload: 6, v: 22, pHit: 0.3, pKill: 0.33, spread: 0.07 },
    skirmisher: true,
    desc: "Cavaliers d'Afrique du Nord montant à cru de petits chevaux sans mors, guidés au cou par une simple corde. Javelots et petit bouclier rond : ils harcèlent, se dérobent et reviennent.",
  },
  gen_carth: {
    name: 'Général et escorte', short: 'Général', cat: 'gen', arch: 'gen_carth',
    spX: 2.4, spZ: 3.4, walk: 1.8, trot: 4.5, run: 8.0, ma: 12, md: 11, charge: 10, morale: 92, stamina: 0.9, mass: 2.4,
    desc: "Le général et sa garde montée. Hannibal et son frère Magon se tenaient au centre, avec les Gaulois et les Ibères, là où le danger était le plus grand.",
  },

  // ------------------------------------------------------------------ ZAMA
  elephants: {
    name: 'Éléphants de guerre', short: 'Éléphants', cat: 'ele', arch: 'elephant', perFigure: 1,
    spX: 7, spZ: 9, walk: 1.6, trot: 3.5, run: 5.2, ma: 26, md: 13, charge: 40, morale: 42, stamina: 0.9, mass: 9,
    desc: "Quatre-vingts éléphants de forêt d'Afrique du Nord, plus petits que ceux d'Asie, montés par un cornac. Jeunes et mal dressés à Zama : les trompettes romaines en affolèrent beaucoup, qui se retournèrent contre leur propre camp.",
  },
  ligures: {
    name: 'Mercenaires ligures', short: 'Ligures', cat: 'inf', heavy: true, arch: 'ligur',
    spX: 1.6, spZ: 1.3, walk: 1.3, run: 3.3, ma: 10, md: 7, charge: 8, morale: 56, stamina: 0.95, mass: 1.0,
    desc: "Montagnards de la côte ligure engagés comme mercenaires, réputés endurants. Première ligne d'Hannibal à Zama, avec les Gaulois, les Baléares et les Maures.",
  },
  gauls_merc: {
    name: 'Mercenaires gaulois', short: 'Gaulois', cat: 'inf', heavy: true, arch: 'gaul',
    spX: 1.6, spZ: 1.3, walk: 1.3, run: 3.4, ma: 11, md: 6, charge: 11, morale: 55, stamina: 1.3, mass: 1.05,
    desc: "Mercenaires gaulois de la première ligne. Polybe rapporte qu'ils se sentirent abandonnés par la seconde ligne et finirent par se battre contre les Carthaginois eux-mêmes.",
  },
  moors: {
    name: 'Maures et Baléares', short: 'Maures', cat: 'inf', light: true, arch: 'slinger', pass: true,
    spX: 2.4, spZ: 2.0, walk: 1.4, run: 3.8, ma: 3, md: 2, charge: 1, morale: 44, stamina: 0.9, mass: 0.5,
    missile: { kind: 'sling', range: 110, ammo: 26, reload: 5, v: 41, pHit: 0.19, pKill: 0.22, spread: 0.035 },
    desc: "Frondeurs baléares et archers et javeliniers maures, en écran devant la première ligne.",
  },
  citizens: {
    name: 'Levée carthaginoise', short: 'Carthaginois', cat: 'inf', heavy: true, arch: 'carthcit',
    spX: 1.5, spZ: 1.2, walk: 1.25, run: 2.9, ma: 8, md: 10, charge: 5, morale: 52, stamina: 1.05, mass: 1.0,
    desc: "Citoyens de Carthage et Libyens levés à la hâte, en armure de lin et grand bouclier rond. Peu entraînés : la deuxième ligne d'Hannibal.",
  },
  veterans: {
    name: "Vétérans d'Italie", short: 'Vétérans', cat: 'inf', heavy: true, arch: 'veteran',
    spX: 1.5, spZ: 1.2, walk: 1.25, run: 3.0, ma: 12, md: 11, charge: 7, morale: 86, stamina: 0.85, mass: 1.05,
    desc: "Les hommes qui avaient suivi Hannibal pendant quinze ans en Italie, Bruttiens et Africains. Tenus en réserve à plus d'un stade derrière, ils ne cédèrent pas : il fallut la cavalerie pour les prendre à revers.",
  },
  carth_cav: {
    name: 'Cavalerie carthaginoise', short: 'Cav. carth.', cat: 'cav', arch: 'carthcav',
    spX: 2.0, spZ: 3.4, walk: 1.8, trot: 4.5, run: 8.0, ma: 10, md: 9, charge: 12, morale: 58, stamina: 1.0, mass: 2.4,
    desc: "Cavalerie de citoyens carthaginois, peu nombreuse à Zama : Hannibal avait perdu l'appui de la plupart des Numides, passés à Rome avec Massinissa.",
  },
  numid_inf: {
    name: 'Infanterie numide', short: 'Inf. numide', cat: 'inf', light: true, arch: 'lonch', pass: true,
    spX: 2.2, spZ: 2.0, walk: 1.4, run: 3.8, ma: 6, md: 4, charge: 3, morale: 58, stamina: 0.85, mass: 0.7,
    missile: { kind: 'javelin', range: 32, ammo: 5, reload: 7, v: 21, pHit: 0.3, pKill: 0.33, spread: 0.06 },
    desc: "Fantassins de Massinissa, alliés de Rome, armés de javelots.",
  },
  gen_scipio: {
    name: 'Scipion et sa garde', short: 'Scipion', cat: 'gen', arch: 'gen_rom',
    spX: 2.4, spZ: 3.4, walk: 1.8, trot: 4.5, run: 8.0, ma: 11, md: 11, charge: 10, morale: 92, stamina: 0.9, mass: 2.4,
    desc: "Publius Cornelius Scipion, 33 ans, qui a reconquis l'Hispanie et porté la guerre en Afrique. Il étudie Hannibal depuis des années.",
  },
};

/* --------------------------------------------------------------------- *
 *  Scénarios. Chaque unité : x, zf (bord avant), th (orientation : 0 = face au sud,
 *  π = face au nord), files (nombre d'hommes de front), role (pour l'IA).
 * --------------------------------------------------------------------- */
const ROME = 0, CARTH = 1, N = Math.PI, S = 0;

function cannaeUnits() {
  const u = [];
  const legName = (i) => (i >= 4 && i <= 11 ? 'Legio ' + ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i - 4] : 'Socii ' + ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i < 4 ? i : i - 8]);
  for (let i = 0; i < 16; i++) {
    const x = -750 + i * 100;
    const ln = legName(i);
    const flank = i < 5 ? 'droite' : i > 10 ? 'gauche' : 'centre';
    u.push({ side: ROME, type: 'hastati', name: 'Hastati · ' + ln, men: 1300, x, zf: -250, th: S, files: 64, role: 'hastati', line: 0, col: i, flank });
    u.push({ side: ROME, type: 'principes', name: 'Principes · ' + ln, men: 1300, x, zf: -304, th: S, files: 64, role: 'principes', line: 1, col: i, flank });
    u.push({ side: ROME, type: 'triarii', name: 'Triarii · ' + ln, men: 600, x, zf: -358, th: S, files: 40, role: 'triarii', line: 2, col: i, flank });
  }
  for (let j = 0; j < 8; j++) {
    u.push({ side: ROME, type: 'velites', name: 'Vélites ' + ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][j], men: 1900, x: -700 + j * 200, zf: -165, th: S, files: 88, role: 'velites' });
  }
  u.push({ side: ROME, type: 'equites', name: 'Equites Romani I', men: 1200, x: -905, zf: -250, th: S, files: 100, role: 'cavR' });
  u.push({ side: ROME, type: 'equites', name: 'Equites Romani II', men: 1200, x: -1110, zf: -250, th: S, files: 100, role: 'cavR' });
  for (let j = 0; j < 3; j++) {
    u.push({ side: ROME, type: 'socii_eq', name: 'Equites sociorum ' + ['I', 'II', 'III'][j], men: 1200, x: 905 + j * 205, zf: -250, th: S, files: 100, role: 'cavL' });
  }
  u.push({ side: ROME, type: 'gen_rom', name: 'Paul-Émile', men: 40, x: -1000, zf: -318, th: S, files: 10, role: 'gen', general: { name: 'Lucius Aemilius Paullus', aura: 200, bonus: 1 } });
  u.push({ side: ROME, type: 'gen_rom', name: 'Varron', men: 40, x: 1110, zf: -318, th: S, files: 10, role: 'gen', general: { name: 'Caius Terentius Varro', aura: 180, bonus: 0.8 } });
  u.push({ side: ROME, type: 'gen_rom', name: 'Servilius', men: 40, x: 0, zf: -405, th: S, files: 10, role: 'gen', general: { name: 'Cnaeus Servilius Geminus', aura: 220, bonus: 0.9 } });

  // Carthage : écran léger, croissant gaulois et ibère, Libyens en profondeur sur les ailes
  const lights = [['balearics', 'Baléares I'], ['lonchophoroi', 'Javeliniers I'], ['lonchophoroi', 'Javeliniers II'], ['balearics', 'Baléares II']];
  lights.forEach(([t, n], j) => u.push({ side: CARTH, type: t, name: n, men: 2000, x: -540 + j * 360, zf: 70, th: N, files: 100, role: 'light' }));
  for (let k = 0; k < 11; k++) {
    const x = -510 + k * 102;
    const gaul = k % 2 === 0;
    const zf = 240 - 112 * (1 - (x / 560) ** 2);
    u.push({ side: CARTH, type: gaul ? 'gauls' : 'iberians', name: (gaul ? 'Gaulois ' : 'Ibères ') + romanNum(gaul ? k / 2 + 1 : (k + 1) / 2), men: gaul ? 2300 : 1640, x, zf, th: N, files: 60, role: 'center', ci: k });
  }
  u.push({ side: CARTH, type: 'libyans', name: 'Libyens I', men: 2500, x: -736, zf: 262, th: N, files: 60, role: 'libL', wing: -1 });
  u.push({ side: CARTH, type: 'libyans', name: 'Libyens II', men: 2500, x: -640, zf: 262, th: N, files: 60, role: 'libL', wing: -1 });
  u.push({ side: CARTH, type: 'libyans', name: 'Libyens III', men: 2500, x: 640, zf: 262, th: N, files: 60, role: 'libR', wing: 1 });
  u.push({ side: CARTH, type: 'libyans', name: 'Libyens IV', men: 2500, x: 736, zf: 262, th: N, files: 60, role: 'libR', wing: 1 });
  u.push({ side: CARTH, type: 'iber_cav', name: 'Cavaliers ibères', men: 1625, x: -895, zf: 248, th: N, files: 105, role: 'cavL' });
  u.push({ side: CARTH, type: 'iber_cav', name: 'Cavaliers gaulois', men: 1625, x: -1102, zf: 248, th: N, files: 105, role: 'cavL' });
  u.push({ side: CARTH, type: 'iber_cav', name: 'Cavaliers ibères II', men: 1625, x: -895, zf: 315, th: N, files: 105, role: 'cavL2' });
  u.push({ side: CARTH, type: 'iber_cav', name: 'Cavaliers gaulois II', men: 1625, x: -1102, zf: 315, th: N, files: 105, role: 'cavL2' });
  for (let j = 0; j < 3; j++) {
    u.push({ side: CARTH, type: 'numidians', name: 'Numides ' + romanNum(j + 1), men: 1170, x: 898 + j * 212, zf: 250, th: N, files: 80, role: 'cavR' });
  }
  u.push({ side: CARTH, type: 'gen_carth', name: 'Hannibal', men: 60, x: -40, zf: 255, th: N, files: 12, role: 'gen', general: { name: 'Hannibal Barca', aura: 340, bonus: 1.4 } });
  u.push({ side: CARTH, type: 'gen_carth', name: 'Magon', men: 40, x: 120, zf: 262, th: N, files: 10, role: 'gen', general: { name: 'Magon Barca', aura: 260, bonus: 1 } });
  u.push({ side: CARTH, type: 'gen_carth', name: 'Hasdrubal', men: 40, x: -985, zf: 400, th: N, files: 10, role: 'genCavL', general: { name: 'Hasdrubal', aura: 200, bonus: 1.1 } });
  u.push({ side: CARTH, type: 'gen_carth', name: 'Hannon', men: 40, x: 1080, zf: 345, th: N, files: 10, role: 'genCavR', general: { name: 'Hannon, fils de Bomilcar', aura: 180, bonus: 0.9 } });
  return u;
}

function zamaUnits() {
  const u = [];
  // Scipion : manipules en colonnes, laissant des couloirs pour les éléphants (Polybe XV.9)
  for (let k = 0; k < 8; k++) {
    const x = -700 + k * 200;
    const ln = (k < 2 ? 'Socii ' : k < 6 ? 'Legio ' : 'Socii ') + romanNum(k < 2 ? k + 1 : k < 6 ? (k < 4 ? 5 : 6) : k - 3);
    u.push({ side: ROME, type: 'hastati', name: 'Hastati · col. ' + romanNum(k + 1), men: 800, x, zf: -250, th: S, files: 34, role: 'hastati', line: 0, col: k, lanes: true });
    u.push({ side: ROME, type: 'principes', name: 'Principes · col. ' + romanNum(k + 1), men: 800, x, zf: -300, th: S, files: 34, role: 'principes', line: 1, col: k, lanes: true });
    u.push({ side: ROME, type: 'triarii', name: 'Triarii · col. ' + romanNum(k + 1), men: 400, x, zf: -350, th: S, files: 30, role: 'triarii', line: 2, col: k, lanes: true });
    void ln;
  }
  for (let k = 0; k < 7; k++) {
    u.push({ side: ROME, type: 'velites', name: 'Vélites ' + romanNum(k + 1), men: 680, x: -600 + k * 200, zf: -250, th: S, files: 34, role: 'velites' });
  }
  u.push({ side: ROME, type: 'numid_inf', name: 'Fantassins de Massinissa', men: 3000, x: -975, zf: -250, th: S, files: 100, role: 'numInf' });
  u.push({ side: ROME, type: 'numidians', name: 'Numides de Massinissa I', men: 2000, x: -1180, zf: -240, th: S, files: 110, role: 'cavR' });
  u.push({ side: ROME, type: 'numidians', name: 'Numides de Massinissa II', men: 2000, x: -1180, zf: -300, th: S, files: 110, role: 'cavR' });
  u.push({ side: ROME, type: 'equites', name: 'Cavalerie italienne', men: 1500, x: 1000, zf: -245, th: S, files: 110, role: 'cavL' });
  u.push({ side: ROME, type: 'gen_scipio', name: 'Scipion', men: 50, x: 0, zf: -410, th: S, files: 10, role: 'gen', general: { name: 'Publius Cornelius Scipio', aura: 280, bonus: 1.4 } });
  u.push({ side: ROME, type: 'gen_rom', name: 'Lélius', men: 40, x: 1000, zf: -300, th: S, files: 10, role: 'genCavL', general: { name: 'Caius Laelius', aura: 190, bonus: 1 } });
  u.push({ side: ROME, type: 'gen_rom', name: 'Massinissa', men: 40, x: -1180, zf: -370, th: S, files: 10, role: 'genCavR', general: { name: 'Massinissa, roi des Massyles', aura: 200, bonus: 1.1 } });

  // Hannibal : 80 éléphants, trois lignes, cavalerie faible
  for (let k = 0; k < 8; k++) {
    u.push({ side: CARTH, type: 'elephants', name: 'Éléphants ' + romanNum(k + 1), men: 10, x: -700 + k * 200, zf: 130, th: N, files: 10, role: 'ele' });
  }
  u.push({ side: CARTH, type: 'moors', name: 'Frondeurs baléares', men: 1500, x: -380, zf: 190, th: N, files: 90, role: 'light' });
  u.push({ side: CARTH, type: 'moors', name: 'Archers maures', men: 1500, x: 380, zf: 190, th: N, files: 90, role: 'light' });
  const first = [['ligures', 'Ligures I'], ['gauls_merc', 'Gaulois I'], ['ligures', 'Ligures II'], ['gauls_merc', 'Gaulois II'], ['ligures', 'Ligures III'], ['gauls_merc', 'Gaulois III']];
  first.forEach(([t, n], k) => u.push({ side: CARTH, type: t, name: n, men: 1500, x: -625 + k * 250, zf: 280, th: N, files: 140, role: 'line1' }));
  for (let k = 0; k < 6; k++) u.push({ side: CARTH, type: 'citizens', name: 'Levée carthaginoise ' + romanNum(k + 1), men: 2000, x: -625 + k * 250, zf: 360, th: N, files: 150, role: 'line2' });
  for (let k = 0; k < 6; k++) u.push({ side: CARTH, type: 'veterans', name: "Vétérans d'Italie " + romanNum(k + 1), men: 2000, x: -625 + k * 250, zf: 560, th: N, files: 150, role: 'line3' });
  u.push({ side: CARTH, type: 'carth_cav', name: 'Cavalerie carthaginoise', men: 2000, x: 1020, zf: 270, th: N, files: 110, role: 'cavR' });
  u.push({ side: CARTH, type: 'numidians', name: 'Numides de Tychaios', men: 2000, x: -1080, zf: 270, th: N, files: 90, role: 'cavL' });
  u.push({ side: CARTH, type: 'gen_carth', name: 'Hannibal', men: 60, x: 0, zf: 470, th: N, files: 12, role: 'gen', general: { name: 'Hannibal Barca', aura: 280, bonus: 1.4 } });
  return u;
}

function romanNum(n) {
  return ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n] || String(n);
}

export const SCENARIOS = {
  cannae: {
    id: 'cannae', terrain: 'cannae', name: 'Cannes', latin: 'Cannae',
    date: '2 août 216 av. J.-C.', place: "Apulie, sur la rive de l'Aufide",
    lat: 41.3, decl: 17.6, startHour: 8.75,
    wind: { x: -0.6, z: -0.8, speed: 6, name: 'Volturnus', from: 'sud-est', dustSide: 0 },
    turbidity: 9,
    sideNames: ['Rome', 'Carthage'],
    commanders: ['Paul-Émile et Varron', 'Hannibal'],
    units: cannaeUnits,
    hist: {
      result: 'Victoire totale d\'Hannibal.',
      rome: 'Polybe : 70 000 tués et 10 000 prisonniers. Tite-Live : 48 200 tués et 19 300 prisonniers. Paul-Émile, 80 sénateurs et 29 tribuns militaires tombent.',
      carth: 'Polybe : environ 5 700 tués, dont 4 000 Gaulois. Tite-Live : 8 000.',
      romeDead: 50000, carthDead: 5700,
    },
    brief: {
      0: "Tu commandes la plus grande armée que Rome ait jamais levée : huit légions et autant d'alliés. Varron a ordonné de serrer les manipules en profondeur pour enfoncer le centre ennemi. Mais Hannibal t'attend, son centre bombé en croissant, ses vétérans libyens en retrait sur les ailes, et sa cavalerie est bien meilleure que la tienne. Le Volturnus souffle du sud-est et te jette la poussière au visage.",
      1: "Tu es Hannibal. En face, deux consuls et près de 80 000 hommes. Tu en as 50 000, mais ta cavalerie est supérieure. Ton plan : un centre gaulois et ibère en croissant qui cédera lentement, les Libyens qui se refermeront sur les flancs, et la cavalerie d'Hasdrubal qui fera le tour pour frapper Rome dans le dos.",
      2: "Assiste à la bataille telle qu'elle a pu se dérouler : les deux armées sont menées par l'ordinateur, chacune suivant le plan historique de son général.",
    },
  },
  zama: {
    id: 'zama', terrain: 'zama', name: 'Zama', latin: 'Zama Regia',
    date: '19 octobre 202 av. J.-C.', place: 'Afrique, au sud-ouest de Carthage',
    lat: 36.1, decl: -10.5, startHour: 9.5,
    wind: { x: 0.3, z: -0.95, speed: 3, name: 'brise', from: 'sud', dustSide: -1 },
    turbidity: 7,
    sideNames: ['Rome', 'Carthage'],
    commanders: ['Scipion', 'Hannibal'],
    units: zamaUnits,
    hist: {
      result: 'Victoire de Scipion, qui y gagne le surnom d\'Africain. Carthage demande la paix.',
      rome: 'Polybe : environ 1 500 tués.',
      carth: 'Polybe : 20 000 tués et presque autant de prisonniers.',
      romeDead: 1500, carthDead: 20000,
    },
    brief: {
      0: "Tu es Scipion. Hannibal aligne 80 éléphants devant trois lignes d'infanterie. Tu as disposé tes manipules en colonnes, en laissant des couloirs où les vélites attireront les bêtes. Tes trompettes sont prêtes à les affoler. Ta cavalerie, renforcée par les Numides de Massinissa, est bien supérieure : chasse celle d'Hannibal et reviens frapper ses vétérans dans le dos.",
      1: "Tu es Hannibal, rappelé d'Italie pour sauver Carthage. Tes éléphants sont jeunes, ta première ligne est faite de mercenaires et la deuxième de recrues. Tes vrais atouts : tes vétérans d'Italie, gardés en réserve. Ta cavalerie est faible face aux Numides de Massinissa.",
      2: "Assiste à la dernière bataille d'Hannibal, menée par l'ordinateur des deux côtés.",
    },
  },
};
