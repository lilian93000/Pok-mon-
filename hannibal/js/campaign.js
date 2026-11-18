/* Grande campagne : la deuxième guerre punique, de 218 à 202 av. J.-C.
   Partie « pure » (sans Three.js ni DOM) : règles, données, IA, résolution automatique.
   Elle tourne aussi dans Node pour simuler des campagnes entières.

   Deux tours par an (été, hiver). Chaque province a une ville, un revenu, une garnison et
   des troupes à lever selon son peuple. Les armées (20 unités au plus, menées par un
   général) se déplacent de province en province, par terre ou par mer. */
import { TYPES } from './data.js';
import { mulberry32 } from './noise.js';

export const ROME = 0, CARTHAGE = 1, FREE = 2;
export const FACTIONS = [
  { id: 0, name: 'Rome', adj: 'romaine', color: '#b8302a', ink: '#f6e2d6', capital: 'roma', gen: 'gen_rom' },
  { id: 1, name: 'Carthage', adj: 'carthaginoise', color: '#7d3f96', ink: '#efe0f4', capital: 'carthago', gen: 'gen_carth' },
  { id: 2, name: 'Peuples libres', adj: 'libre', color: '#5f7a45', ink: '#e8efd8', capital: null, gen: 'gen_carth' },
];
export const START_YEAR = 218, TURNS = 34; // 218 été → 202 hiver
export const MAX_UNITS = 20;

/* Projection de la carte : 1 unité = 1 km. x vers l'est, z vers le sud. */
export const LON0 = 5, LAT0 = 38.5, KX = 87.6, KZ = 111.2;
export const proj = (lon, lat) => [(lon - LON0) * KX, -(lat - LAT0) * KZ];

/* --------------------------------------------------------------------- *
 *  Troupes de campagne : effectif plein, coût de levée, entretien par tour,
 *  puissance par homme pour la résolution automatique.
 * --------------------------------------------------------------------- */
export const CU = {
  hastati: { men: 1200, cost: 420, up: 95, pow: 1.0 },
  principes: { men: 1200, cost: 480, up: 105, pow: 1.15 },
  triarii: { men: 600, cost: 360, up: 80, pow: 1.3 },
  velites: { men: 1000, cost: 200, up: 45, pow: 0.45 },
  equites: { men: 500, cost: 520, up: 120, pow: 1.6 },
  socii_eq: { men: 600, cost: 480, up: 110, pow: 1.5 },
  gauls: { men: 1500, cost: 360, up: 80, pow: 0.95 },
  iberians: { men: 1200, cost: 420, up: 100, pow: 1.0 },
  libyans: { men: 1500, cost: 680, up: 160, pow: 1.3 },
  balearics: { men: 800, cost: 440, up: 100, pow: 0.65 },
  lonchophoroi: { men: 1000, cost: 240, up: 55, pow: 0.45 },
  iber_cav: { men: 800, cost: 640, up: 150, pow: 2.0 },
  numidians: { men: 700, cost: 520, up: 120, pow: 1.45 },
  elephants: { men: 30, cost: 1300, up: 260, pow: 42 },
  citizens: { men: 1500, cost: 340, up: 80, pow: 0.8 },
  carth_cav: { men: 600, cost: 560, up: 130, pow: 1.6 },
  ligures: { men: 1200, cost: 340, up: 80, pow: 0.9 },
  gauls_merc: { men: 1200, cost: 380, up: 90, pow: 0.9 },
  moors: { men: 900, cost: 360, up: 80, pow: 0.55 },
  veterans: { men: 1500, cost: 900, up: 170, pow: 1.45 },
  numid_inf: { men: 1000, cost: 280, up: 60, pow: 0.55 },
};
const GEN_POW = 4; // par homme de la garde du général

/* Troupes levées selon le peuple de la province (et le maître de la province). */
const RECRUIT = {
  latin: { 0: ['hastati', 'principes', 'triarii', 'velites', 'equites'], 1: ['ligures', 'lonchophoroi'] },
  italic: { 0: ['hastati', 'principes', 'triarii', 'velites', 'socii_eq'], 1: ['ligures', 'lonchophoroi', 'socii_eq'] },
  greek: { 0: ['hastati', 'velites', 'socii_eq'], 1: ['citizens', 'lonchophoroi', 'socii_eq'] },
  sard: { 0: ['velites', 'hastati'], 1: ['lonchophoroi', 'citizens'] },
  punic: { 1: ['libyans', 'citizens', 'carth_cav', 'lonchophoroi', 'elephants'], 0: ['citizens', 'lonchophoroi'] },
  libyan: { 1: ['libyans', 'citizens', 'lonchophoroi', 'elephants'], 0: ['lonchophoroi', 'citizens'] },
  iber: { any: ['iberians', 'iber_cav', 'lonchophoroi'] },
  balear: { any: ['balearics'] },
  gaul: { any: ['gauls', 'iber_cav'] },
  ligur: { any: ['ligures'] },
  numid: { any: ['numidians', 'numid_inf'] },
  maur: { any: ['moors', 'numidians'] },
};
// garnisons : milices de la ville
const GARRISON = {
  latin: ['hastati', 'principes', 'triarii', 'velites'], italic: ['hastati', 'velites'], greek: ['hastati', 'velites'],
  sard: ['velites'], punic: ['citizens', 'citizens', 'libyans', 'carth_cav'], libyan: ['citizens', 'lonchophoroi'],
  iber: ['iberians', 'iberians', 'lonchophoroi'], balear: ['balearics'], gaul: ['gauls', 'gauls', 'gauls', 'iber_cav'],
  ligur: ['ligures', 'ligures'], numid: ['numid_inf', 'numidians'], maur: ['moors', 'numidians'],
};

/* --------------------------------------------------------------------- *
 *  Provinces vers 218 av. J.-C.
 *  ter : terrain des batailles (plaine, collines, fleuve, aride, cannae, zama)
 *  walls : 0 bourgade, 1 ville, 2 grande ville fortifiée, 3 capitale
 *  seeds : points (lon, lat) qui dessinent l'étendue de la province sur la carte
 * --------------------------------------------------------------------- */
export const PROVINCES = [
  // ----------------------------------------------------------- Italie
  { id: 'roma', name: 'Latium', city: 'Rome', lon: 12.48, lat: 41.89, owner: 0, cult: 'latin', inc: 1200, ter: 'hills', walls: 3, port: true, seeds: [[13.1, 41.55]] },
  { id: 'capua', name: 'Campanie', city: 'Capoue', lon: 14.25, lat: 41.08, owner: 0, cult: 'italic', inc: 900, ter: 'plain', walls: 2, port: true },
  { id: 'arretium', name: 'Étrurie', city: 'Arretium', lon: 11.88, lat: 43.46, owner: 0, cult: 'italic', inc: 600, ter: 'hills', walls: 1, port: true, seeds: [[11.0, 43.2], [11.7, 42.6]] },
  { id: 'ariminum', name: 'Ombrie et Picénum', city: 'Ariminum', lon: 12.57, lat: 44.06, owner: 0, cult: 'italic', inc: 450, ter: 'hills', walls: 1, seeds: [[13.3, 43.25], [13.9, 42.45]] },
  { id: 'placentia', name: 'Cispadane', city: 'Placentia', lon: 9.69, lat: 45.05, owner: 0, cult: 'italic', inc: 300, ter: 'river', walls: 1, seeds: [[10.4, 44.85]] },
  { id: 'beneventum', name: 'Samnium', city: 'Bénévent', lon: 14.78, lat: 41.13, owner: 0, cult: 'italic', inc: 450, ter: 'hills', walls: 1, seeds: [[14.4, 41.75]] },
  { id: 'arpi', name: 'Apulie', city: 'Arpi', lon: 15.55, lat: 41.45, owner: 0, cult: 'italic', inc: 500, ter: 'cannae', walls: 1, seeds: [[16.3, 41.15], [17.3, 40.75]] },
  { id: 'paestum', name: 'Lucanie', city: 'Paestum', lon: 15.0, lat: 40.42, owner: 0, cult: 'italic', inc: 400, ter: 'hills', walls: 1, seeds: [[15.9, 40.35]] },
  { id: 'tarentum', name: 'Tarente', city: 'Tarente', lon: 17.24, lat: 40.47, owner: 0, cult: 'greek', inc: 700, ter: 'plain', walls: 2, port: true, seeds: [[18.1, 40.2]] },
  { id: 'rhegium', name: 'Bruttium', city: 'Rhegium', lon: 15.65, lat: 38.11, owner: 0, cult: 'italic', inc: 400, ter: 'hills', walls: 1, port: true, seeds: [[16.3, 39.0], [16.4, 39.6]] },
  { id: 'mediolanum', name: 'Insubrie', city: 'Mediolanum', lon: 9.19, lat: 45.46, owner: 2, people: 'Insubres', cult: 'gaul', inc: 400, ter: 'river', walls: 0, seeds: [[7.7, 45.05], [8.6, 45.7]] },
  { id: 'felsina', name: 'Pays boïen', city: 'Felsina', lon: 11.34, lat: 44.49, owner: 2, people: 'Boïens', cult: 'gaul', inc: 400, ter: 'plain', walls: 0, seeds: [[11.8, 45.2]] },
  { id: 'genua', name: 'Ligurie', city: 'Genua', lon: 8.93, lat: 44.41, owner: 2, people: 'Ligures', cult: 'ligur', inc: 250, ter: 'hills', walls: 0, port: true, seeds: [[7.9, 44.15]] },
  // ----------------------------------------------------------- îles
  { id: 'lilybaeum', name: 'Sicile occidentale', city: 'Lilybée', lon: 12.44, lat: 37.8, owner: 0, cult: 'greek', inc: 500, ter: 'hills', walls: 2, port: true, seeds: [[13.5, 37.75]] },
  { id: 'syracusae', name: 'Syracuse', city: 'Syracuse', lon: 15.29, lat: 37.07, owner: 0, cult: 'greek', inc: 700, ter: 'plain', walls: 3, port: true, seeds: [[14.7, 37.75]] },
  { id: 'carales', name: 'Sardaigne', city: 'Carales', lon: 9.11, lat: 39.22, owner: 0, cult: 'sard', inc: 350, ter: 'hills', walls: 1, port: true, seeds: [[8.95, 40.4]] },
  { id: 'aleria', name: 'Corse', city: 'Aléria', lon: 9.51, lat: 42.09, owner: 0, cult: 'sard', inc: 150, ter: 'hills', walls: 0, port: true },
  { id: 'ebusus', name: 'Baléares', city: 'Ebusus', lon: 1.43, lat: 38.91, owner: 1, cult: 'balear', inc: 250, ter: 'hills', walls: 1, port: true, seeds: [[2.9, 39.6], [4.1, 39.95]] },
  // ----------------------------------------------------------- Gaule
  { id: 'massalia', name: 'Massalia', city: 'Massalia', lon: 5.37, lat: 43.3, owner: 0, cult: 'greek', inc: 600, ter: 'hills', walls: 2, port: true, seeds: [[6.3, 43.5]] },
  { id: 'narbo', name: 'Gaule du Sud', city: 'Narbo', lon: 3.0, lat: 43.18, owner: 2, people: 'Volques', cult: 'gaul', inc: 400, ter: 'river', walls: 0, seeds: [[4.6, 44.6], [0.5, 44.0], [2.6, 45.5], [5.6, 45.4]] },
  // ----------------------------------------------------------- Hispanie
  { id: 'tarraco', name: 'Ilergètes', city: 'Tarraco', lon: 1.25, lat: 41.12, owner: 2, people: 'Ilergètes', cult: 'iber', inc: 400, ter: 'hills', walls: 1, port: true, seeds: [[0.6, 41.9], [2.6, 41.9]] },
  { id: 'saguntum', name: 'Édétanie', city: 'Sagonte', lon: -0.27, lat: 39.68, owner: 1, cult: 'iber', inc: 450, ter: 'plain', walls: 1, port: true, seeds: [[-1.0, 40.6]] },
  { id: 'cartnova', name: 'Carthagène', city: 'Carthago Nova', lon: -0.98, lat: 37.6, owner: 1, cult: 'iber', inc: 900, ter: 'arid', walls: 2, port: true, seeds: [[-2.1, 38.4]] },
  { id: 'castulo', name: 'Orétanie', city: 'Castulo', lon: -3.63, lat: 38.03, owner: 1, cult: 'iber', inc: 1100, ter: 'hills', walls: 1, seeds: [[-4.4, 39.6], [-2.9, 39.3]] },
  { id: 'gades', name: 'Bétique', city: 'Gadès', lon: -6.29, lat: 36.53, owner: 1, cult: 'iber', inc: 800, ter: 'river', walls: 2, port: true, seeds: [[-5.5, 37.5], [-4.6, 37.0]] },
  { id: 'numantia', name: 'Celtibérie', city: 'Numance', lon: -2.44, lat: 41.81, owner: 2, people: 'Celtibères', cult: 'iber', inc: 350, ter: 'hills', walls: 1, seeds: [[-4.5, 42.2], [-5.5, 43.1], [-1.4, 42.5]] },
  { id: 'olisipo', name: 'Lusitanie', city: 'Olisipo', lon: -9.14, lat: 38.72, owner: 2, people: 'Lusitaniens', cult: 'iber', inc: 300, ter: 'hills', walls: 0, port: true, seeds: [[-7.9, 40.5], [-8.0, 42.4], [-7.6, 38.2]] },
  // ----------------------------------------------------------- Afrique
  { id: 'carthago', name: 'Carthage', city: 'Carthage', lon: 10.32, lat: 36.85, owner: 1, cult: 'punic', inc: 2000, ter: 'zama', walls: 3, port: true, seeds: [[9.4, 36.5]] },
  { id: 'hadrumetum', name: 'Byzacène', city: 'Hadrumète', lon: 10.64, lat: 35.83, owner: 1, cult: 'libyan', inc: 750, ter: 'zama', walls: 1, port: true, seeds: [[9.4, 34.8]] },
  { id: 'leptis', name: 'Emporia', city: 'Leptis', lon: 14.29, lat: 32.64, owner: 1, cult: 'libyan', inc: 450, ter: 'arid', walls: 1, port: true, seeds: [[11.8, 32.6], [17.0, 31.1]] },
  { id: 'cirta', name: 'Massylie', city: 'Cirta', lon: 6.61, lat: 36.36, owner: 1, cult: 'numid', inc: 350, ter: 'arid', walls: 1, seeds: [[5.0, 35.9], [7.6, 35.1]] },
  { id: 'siga', name: 'Masaesylie', city: 'Siga', lon: -1.47, lat: 35.27, owner: 2, people: 'Masaesyles', cult: 'numid', inc: 300, ter: 'arid', walls: 1, port: true, seeds: [[1.6, 35.9], [0.2, 34.2]] },
  { id: 'tingis', name: 'Maurétanie', city: 'Tingis', lon: -5.8, lat: 35.77, owner: 2, people: 'Maures', cult: 'maur', inc: 250, ter: 'arid', walls: 0, port: true, seeds: [[-6.5, 34.0], [-8.4, 31.6]] },
];
// terres sans maître (non jouables) : elles dessinent la carte
export const WILDS = [
  { name: 'Alpes', seeds: [[7.1, 45.9], [8.9, 46.5], [10.8, 46.7], [12.8, 46.5], [6.6, 44.9]] },
  { name: 'Illyrie', seeds: [[14.6, 45.6], [16.2, 44.2], [18.3, 42.9], [19.9, 41.3], [17.5, 44.9], [20.3, 40.2]] },
  { name: 'Gaule chevelue', seeds: [[0.0, 46.8], [3.6, 46.8], [-1.0, 45.6]] },
  { name: 'Désert', seeds: [[2.5, 31.0], [7.5, 31.6], [-3.0, 31.0], [11.0, 30.5]] },
];
export const PROV = Object.fromEntries(PROVINCES.map((p) => [p.id, p]));

// liaisons par terre ; « alpes » et « pyr » coûtent des hommes
const LAND = [
  ['roma', 'arretium'], ['roma', 'capua'], ['roma', 'beneventum'], ['roma', 'ariminum'],
  ['capua', 'beneventum'], ['capua', 'paestum'],
  ['arretium', 'ariminum'], ['arretium', 'felsina'], ['arretium', 'genua'],
  ['ariminum', 'felsina'], ['ariminum', 'beneventum'],
  ['felsina', 'placentia'], ['placentia', 'mediolanum'], ['placentia', 'genua'], ['mediolanum', 'genua'],
  ['genua', 'massalia'], ['massalia', 'narbo'],
  ['beneventum', 'arpi'], ['beneventum', 'paestum'], ['arpi', 'paestum'], ['arpi', 'tarentum'],
  ['paestum', 'tarentum'], ['paestum', 'rhegium'], ['tarentum', 'rhegium'],
  ['rhegium', 'syracusae'], ['syracusae', 'lilybaeum'], ['carales', 'aleria'],
  ['tarraco', 'saguntum'], ['tarraco', 'numantia'], ['saguntum', 'cartnova'], ['saguntum', 'numantia'], ['saguntum', 'castulo'],
  ['cartnova', 'castulo'], ['castulo', 'gades'], ['castulo', 'numantia'], ['castulo', 'olisipo'], ['gades', 'olisipo'], ['numantia', 'olisipo'],
  ['carthago', 'hadrumetum'], ['carthago', 'cirta'], ['hadrumetum', 'leptis'], ['hadrumetum', 'cirta'], ['cirta', 'siga'], ['siga', 'tingis'],
];
export const PASSES = { 'narbo|mediolanum': 'alpes', 'tarraco|narbo': 'pyr', 'genua|massalia': 'coast' };
LAND.push(['narbo', 'mediolanum'], ['tarraco', 'narbo']);
// routes maritimes (un tour entier, depuis un port)
const SEA = [
  ['carthago', 'lilybaeum'], ['carthago', 'carales'], ['carthago', 'cartnova'], ['carthago', 'syracusae'], ['carthago', 'leptis'],
  ['cartnova', 'ebusus'], ['ebusus', 'tarraco'], ['ebusus', 'saguntum'], ['cartnova', 'siga'], ['gades', 'tingis'],
  ['tarraco', 'massalia'], ['massalia', 'roma'], ['massalia', 'aleria'], ['roma', 'carales'], ['roma', 'aleria'],
  ['carales', 'lilybaeum'], ['lilybaeum', 'capua'], ['syracusae', 'tarentum'], ['lilybaeum', 'hadrumetum'], ['genua', 'aleria'],
  ['capua', 'carales'], ['syracusae', 'leptis'],
];
// routes tenues par la flotte romaine : interdites aux armées carthaginoises
const ROMAN_LANES = new Set(['tarraco|massalia', 'massalia|roma', 'massalia|aleria', 'roma|carales', 'roma|aleria', 'lilybaeum|capua', 'syracusae|tarentum', 'genua|aleria', 'capua|carales', 'carales|lilybaeum']);
export const romanLane = (a, b) => ROMAN_LANES.has(a + '|' + b) || ROMAN_LANES.has(b + '|' + a);
export const ADJ = {}, SEADJ = {};
for (const p of PROVINCES) { ADJ[p.id] = []; SEADJ[p.id] = []; }
for (const [a, b] of LAND) { ADJ[a].push(b); ADJ[b].push(a); }
for (const [a, b] of SEA) { SEADJ[a].push(b); SEADJ[b].push(a); }
export const SEA_ROUTES = SEA, LAND_LINKS = LAND;
export const passOf = (a, b) => PASSES[a + '|' + b] || PASSES[b + '|' + a] || null;
const ITALY = ['roma', 'capua', 'arretium', 'ariminum', 'placentia', 'beneventum', 'arpi', 'paestum', 'tarentum', 'rhegium', 'mediolanum', 'felsina', 'genua'];
const SOUTH = ['capua', 'beneventum', 'arpi', 'paestum', 'tarentum', 'rhegium'];
const HISPANIA = ['tarraco', 'saguntum', 'cartnova', 'castulo', 'gades', 'numantia', 'olisipo'];
export const REGIONS = { ITALY, HISPANIA };

/* --------------------------------------------------------------------- *
 *  Généraux historiques. from : année (av. J.-C.) où il peut commander.
 * --------------------------------------------------------------------- */
export const GENERALS = [
  { id: 'pscipio', side: 0, name: 'Publius Cornelius Scipio', short: 'P. Scipion', cmd: 3, from: 218, bio: "Consul en 218. Il voulait arrêter Hannibal en Hispanie et arriva trop tard sur le Rhône." },
  { id: 'sempronius', side: 0, name: 'Tiberius Sempronius Longus', short: 'Sempronius', cmd: 2, from: 218, bio: "Consul en 218, impétueux. Battu à la Trébie, dans la neige, au solstice d'hiver." },
  { id: 'vulso', side: 0, name: 'Lucius Manlius Vulso', short: 'Manlius', cmd: 1, from: 218, bio: "Préteur en Cisalpine, pris en embuscade par les Boïens en 218." },
  { id: 'cnscipio', side: 0, name: 'Cnaeus Cornelius Scipio Calvus', short: 'Cn. Scipion', cmd: 3, from: 218, bio: "Frère de Publius. Il porta la guerre en Hispanie dès 218 et y resta sept ans." },
  { id: 'flaminius', side: 0, name: 'Caius Flaminius', short: 'Flaminius', cmd: 2, from: 217, bio: "Consul populaire et hardi, tué au lac Trasimène dans le brouillard." },
  { id: 'servilius', side: 0, name: 'Cnaeus Servilius Geminus', short: 'Servilius', cmd: 2, from: 217, bio: "Consul en 217, tué à Cannes à la tête du centre." },
  { id: 'fabius', side: 0, name: 'Quintus Fabius Maximus', short: 'Fabius', cmd: 4, from: 217, cautious: true, bio: "Le Temporisateur (Cunctator). Dictateur en 217, il refusa la bataille et usa Hannibal." },
  { id: 'paullus', side: 0, name: 'Lucius Aemilius Paullus', short: 'Paul-Émile', cmd: 3, from: 216, bio: "Consul en 216, prudent. Tombé à Cannes." },
  { id: 'varro', side: 0, name: 'Caius Terentius Varro', short: 'Varron', cmd: 1, from: 216, bio: "Consul en 216. Il commandait le jour de Cannes et survécut au désastre." },
  { id: 'marcellus', side: 0, name: 'Marcus Claudius Marcellus', short: 'Marcellus', cmd: 4, from: 215, bio: "L'Épée de Rome. Il tint Nole contre Hannibal et prit Syracuse en 212." },
  { id: 'gracchus', side: 0, name: 'Tiberius Sempronius Gracchus', short: 'Gracchus', cmd: 3, from: 215, bio: "Il mena les volones, esclaves enrôlés et affranchis pour leur bravoure." },
  { id: 'nero', side: 0, name: 'Caius Claudius Nero', short: 'Néron', cmd: 4, from: 211, bio: "Il fit traverser l'Italie à marche forcée à son armée pour écraser Hasdrubal au Métaure." },
  { id: 'scipio', side: 0, name: 'Publius Cornelius Scipio', short: 'Scipion', cmd: 5, from: 210, bio: "Le futur Africain. À 25 ans, il prend Carthagène, puis porte la guerre en Afrique." },
  { id: 'laelius', side: 0, name: 'Caius Laelius', short: 'Lélius', cmd: 3, from: 209, bio: "L'ami de Scipion, chef de sa flotte puis de sa cavalerie à Zama." },
  { id: 'salinator', side: 0, name: 'Marcus Livius Salinator', short: 'Salinator', cmd: 3, from: 207, bio: "Vainqueur d'Hasdrubal au Métaure avec Néron." },
  { id: 'hannibal', side: 1, name: 'Hannibal Barca', short: 'Hannibal', cmd: 5, from: 218, bio: "Fils d'Hamilcar, il a juré enfant une haine éternelle à Rome. 29 ans en 218." },
  { id: 'hasdrubal', side: 1, name: 'Hasdrubal Barca', short: 'Hasdrubal', cmd: 3, from: 218, bio: "Frère d'Hannibal, chargé de l'Hispanie. Il passera à son tour les Alpes en 207." },
  { id: 'hanno', side: 1, name: 'Hannon', short: 'Hannon', cmd: 2, from: 218, bio: "Laissé par Hannibal pour tenir le pays au nord de l'Èbre." },
  { id: 'bomilcar', side: 1, name: 'Bomilcar', short: 'Bomilcar', cmd: 2, from: 218, bio: "Amiral carthaginois, il ravitailla Hannibal en Italie." },
  { id: 'mago', side: 1, name: 'Magon Barca', short: 'Magon', cmd: 3, from: 217, bio: "Le plus jeune des fils d'Hamilcar, embusqué à la Trébie avec mille cavaliers." },
  { id: 'maharbal', side: 1, name: 'Maharbal', short: 'Maharbal', cmd: 4, from: 217, bio: "Chef de la cavalerie numide : « Tu sais vaincre, Hannibal, mais tu ne sais pas profiter de ta victoire. »" },
  { id: 'hannob', side: 1, name: 'Hannon, fils de Bomilcar', short: 'Hannon B.', cmd: 3, from: 216, bio: "Neveu d'Hannibal, il commandait l'aile droite à Cannes." },
  { id: 'gisco', side: 1, name: 'Hasdrubal Giscon', short: 'Giscon', cmd: 3, from: 214, bio: "Général en Hispanie puis en Afrique, beau-père de Massinissa et de Syphax." },
  { id: 'himilco', side: 1, name: 'Himilcon', short: 'Himilcon', cmd: 2, from: 213, bio: "Envoyé en Sicile pour secourir Syracuse." },
];
const NAMES = {
  0: ['Lucius Postumius', 'Marcus Minucius', 'Appius Claudius', 'Quintus Fulvius', 'Publius Sulpicius', 'Marcus Valerius', 'Lucius Marcius', 'Titus Manlius', 'Caius Hostilius', 'Quintus Petilius'],
  1: ['Hamilcar', 'Hannon', 'Carthalon', 'Adherbal', 'Himilcon', 'Bostar', 'Hasdrubal', 'Mutines', 'Abdmelqart', 'Bodashtart'],
  2: ['Indibilis', 'Mandonius', 'Ducarius', 'Brennos', 'Allucius', 'Comboiomaros'],
};

/* --------------------------------------------------------------------- *
 *  La campagne
 * --------------------------------------------------------------------- */
export class Campaign {
  constructor(player = 0, seed = 218) {
    this.player = player; this.seed = seed;
    this.rngState = seed;
    this.turn = 0; this.uid = 1;
    this.gold = [1500, 2000, 0];
    this.owner = {}; this.garrison = {}; this.siege = {}; this.slots = {}; this.unrest = {};
    this.armies = [];
    this.usedGens = {}; this.deadGens = {};
    this.flags = {};
    this.stats = { battles: [0, 0], won: [0, 0], killed: [0, 0], lost: [0, 0] };
    this.log = [];
    this.pending = []; // batailles à résoudre par le joueur
    this.messages = []; // événements historiques à afficher
    this.over = null;
    for (const p of PROVINCES) {
      this.owner[p.id] = p.owner;
      this.garrison[p.id] = this.militia(p, p.owner, p.owner === FREE ? 1 : 0.8);
      this.slots[p.id] = 0;
    }
    this.setup();
    this.beginTurn(true);
  }
  rnd() {
    // mulberry32 sérialisable
    let t = (this.rngState = (this.rngState + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  // ------------------------------------------------------------ temps
  get year() { return START_YEAR - Math.floor(this.turn / 2); }
  get winter() { return this.turn % 2 === 1; }
  get dateText() { return `${this.winter ? 'Hiver' : 'Été'} ${this.year} av. J.-C.`; }

  // -------------------------------------------------------- utilitaires
  unit(type, f = 1) { const m = CU[type].men; return { type, men: Math.max(1, Math.round(m * f)), max: m, xp: 0 }; }
  militia(p, owner, f) {
    const list = (GARRISON[p.cult] || ['velites']).slice(0, p.walls >= 2 || owner === FREE ? 4 : 2);
    if (p.walls >= 3) list.push(...list.slice(0, 3));
    return list.map((t) => this.unit(t, f));
  }
  army(id) { return this.armies.find((a) => a.id === id); }
  armiesIn(pid, side) { return this.armies.filter((a) => a.prov === pid && (side === undefined || a.side === side)); }
  provsOf(side) { return PROVINCES.filter((p) => this.owner[p.id] === side); }
  power(units) { let s = 0; for (const u of units) s += u.men * (CU[u.type] ? CU[u.type].pow : GEN_POW) * (1 + 0.06 * (u.xp || 0)); return s; }
  armyPower(a) { return (this.power(a.units) + 60 * GEN_POW) * genFactor(a.gen); }
  garrisonPower(pid) { return this.power(this.garrison[pid]); }
  men(units) { return units.reduce((s, u) => s + u.men, 0); }
  say(text, side = -1, kind = 'info', prov = null) { this.log.push({ turn: this.turn, text, side, kind, prov }); if (this.log.length > 120) this.log.shift(); }
  general(side, prefer) {
    const year = this.year;
    let g = null;
    if (prefer) g = GENERALS.find((x) => x.id === prefer && !this.usedGens[x.id] && !this.deadGens[x.id]);
    if (!g) g = GENERALS.find((x) => x.side === side && x.from >= year && !this.usedGens[x.id] && !this.deadGens[x.id]);
    if (g) { this.usedGens[g.id] = 1; return { id: g.id, name: g.name, short: g.short, cmd: g.cmd, cautious: !!g.cautious, bio: g.bio }; }
    const pool = NAMES[side] || NAMES[2];
    const nm = pool[Math.floor(this.rnd() * pool.length)];
    return { id: 'g' + this.uid++, name: nm, short: nm.split(' ').pop(), cmd: 1 + Math.floor(this.rnd() * 2), bio: side === 0 ? 'Tribun militaire élevé au commandement.' : 'Officier de l\'armée.' };
  }
  newArmy(side, pid, units, prefer) {
    const a = { id: this.uid++, side, gen: this.general(side, prefer), units, prov: pid, mp: 0, moved: false, mission: null };
    this.armies.push(a);
    return a;
  }

  setup() {
    const U = (t, n = 1, f = 1) => Array.from({ length: n }, () => this.unit(t, f));
    // Carthage : Hannibal quitte Carthagène pour l'Italie
    this.newArmy(1, 'cartnova', [...U('libyans', 5), ...U('iberians', 5), ...U('balearics', 2), ...U('lonchophoroi', 1), ...U('iber_cav', 3), ...U('numidians', 3), ...U('elephants', 1, 37 / 30)], 'hannibal').mission = 'roma';
    this.newArmy(1, 'castulo', [...U('iberians', 3), ...U('libyans', 1), ...U('numidians', 2), ...U('iber_cav', 1), ...U('lonchophoroi', 1), ...U('elephants', 1, 21 / 30)], 'hasdrubal').mission = 'hold:HISPANIA';
    this.newArmy(1, 'saguntum', [...U('iberians', 3), ...U('lonchophoroi', 1), ...U('iber_cav', 1)], 'hanno').mission = 'hold:HISPANIA';
    this.newArmy(1, 'carthago', [...U('citizens', 3), ...U('libyans', 2), ...U('carth_cav', 1), ...U('lonchophoroi', 1)], 'bomilcar').mission = 'guard';
    // Rome : un consul part pour l'Hispanie, l'autre prépare l'invasion de l'Afrique
    const consular = (n = 2) => [...U('hastati', n), ...U('principes', n), ...U('triarii', n), ...U('velites', n), ...U('equites', 1), ...U('socii_eq', 1)];
    this.newArmy(0, 'massalia', consular(), 'pscipio').mission = 'hispania';
    this.newArmy(0, 'lilybaeum', consular(), 'sempronius').mission = 'italy';
    this.newArmy(0, 'placentia', [...U('hastati'), ...U('principes'), ...U('triarii'), ...U('velites'), ...U('socii_eq')], 'vulso').mission = 'italy';
    this.usedGens.cnscipio = 0;
    this.flags.genSeen = {};
  }

  // -------------------------------------------------------- économie
  upkeep(side) {
    let s = 0;
    for (const a of this.armies) if (a.side === side) for (const u of a.units) s += CU[u.type].up * (0.4 + 0.6 * u.men / u.max);
    return Math.round(s);
  }
  income(side) {
    let s = 0;
    for (const p of PROVINCES) if (this.owner[p.id] === side && !this.siege[p.id]) s += p.inc;
    // l'ordinateur reçoit un peu plus face à un joueur humain
    if (this.player >= 0 && side !== this.player && side !== FREE) s *= 1.25;
    return Math.round(s);
  }
  finance(side) { const inc = this.income(side), up = this.upkeep(side); return { inc, up, net: inc - up }; }
  recruitList(pid) {
    const p = PROV[pid], o = this.owner[pid];
    const R = RECRUIT[p.cult];
    if (!R || o === FREE) return [];
    return R.any || R[o] || [];
  }
  maxSlots(pid) { const p = PROV[pid]; return p.walls >= 3 ? 3 : p.walls >= 1 ? 2 : 1; }
  canRecruit(pid, type) {
    const o = this.owner[pid];
    if (o === FREE || this.siege[pid]) return 'Ville assiégée.';
    if (this.slots[pid] >= this.maxSlots(pid)) return 'Plus de levée possible ce tour-ci.';
    if (!this.recruitList(pid).includes(type)) return 'Ce peuple ne fournit pas ces troupes.';
    if (this.gold[o] < CU[type].cost) return 'Trésor insuffisant.';
    if (type === 'elephants' && this.flags.eleN >= 4) return 'Plus d\'éléphants dressés.';
    return '';
  }
  // levée : rejoint une armée présente dans la province, ou en forme une nouvelle
  recruit(pid, type, armyId) {
    const err = this.canRecruit(pid, type);
    if (err) return { err };
    const o = this.owner[pid];
    let a = armyId ? this.army(armyId) : this.armiesIn(pid, o).find((x) => x.units.length < MAX_UNITS);
    if (a && (a.prov !== pid || a.units.length >= MAX_UNITS)) a = null;
    this.gold[o] -= CU[type].cost;
    this.slots[pid]++;
    if (type === 'elephants') this.flags.eleN = (this.flags.eleN || 0) + 1;
    const u = this.unit(type, 1);
    if (a) a.units.push(u);
    else { a = this.newArmy(o, pid, [u]); a.mp = 0; }
    return { army: a, unit: u };
  }
  disband(a, i) { a.units.splice(i, 1); if (!a.units.length) this.removeArmy(a); }
  removeArmy(a, dead) {
    this.armies = this.armies.filter((x) => x !== a);
    if (dead && a.gen && GENERALS.some((g) => g.id === a.gen.id)) this.deadGens[a.gen.id] = 1;
    else if (a.gen) this.usedGens[a.gen.id] = 0;
  }
  // fusion de deux armées dans la même province
  merge(a, b) {
    if (a.prov !== b.prov || a.side !== b.side) return false;
    while (b.units.length && a.units.length < MAX_UNITS) a.units.push(b.units.shift());
    if (!b.units.length) this.removeArmy(b);
    a.mp = Math.min(a.mp, b.mp);
    return true;
  }

  // ------------------------------------------------------ déplacements
  maxMp(a) {
    const cav = a.units.filter((u) => /cav|eq|numid/.test(u.type) && u.type !== 'numid_inf').length / Math.max(1, a.units.length);
    return (this.winter ? 1 : 2) + (cav > 0.7 ? 1 : 0);
  }
  // destinations possibles en un mouvement
  options(a) {
    const out = [];
    if (a.mp <= 0) return out;
    for (const pid of ADJ[a.prov]) out.push({ prov: pid, sea: false, pass: passOf(a.prov, pid) });
    if (PROV[a.prov].port && a.mp >= this.maxMp(a)) for (const pid of SEADJ[a.prov]) if (!ADJ[a.prov].includes(pid) && !(a.side !== ROME && romanLane(a.prov, pid))) out.push({ prov: pid, sea: true, pass: null });
    for (const o of out) {
      const enemy = this.owner[o.prov] !== a.side;
      o.armies = this.armies.filter((x) => x.prov === o.prov && x.side !== a.side);
      o.hostile = o.armies.length > 0 || (enemy && this.owner[o.prov] !== a.side);
      o.attack = o.armies.length > 0 || enemy;
    }
    return out;
  }
  // déplacer une armée : renvoie ce qui se passe à l'arrivée
  move(a, pid) {
    const opt = this.options(a).find((o) => o.prov === pid);
    if (!opt) return { err: 'Hors de portée.' };
    const from = a.prov;
    if (this.siege[from] && this.siege[from].army === a.id) delete this.siege[from];
    a.moved = true;
    const res = { from, to: pid, sea: opt.sea, events: [] };
    if (opt.sea) {
      a.mp = 0;
      // la flotte romaine domine la mer ; les tempêtes frappent tout le monde
      const risk = a.side === CARTHAGE ? (this.flags.carthNavy ? 0.12 : 0.22) : 0.06;
      if (this.rnd() < risk) {
        const f = a.side === CARTHAGE ? 0.12 : 0.06;
        for (const u of a.units) u.men = Math.round(u.men * (1 - f * (0.5 + this.rnd())));
        res.events.push(a.side === CARTHAGE ? 'La flotte romaine a intercepté une partie des navires : des hommes sont perdus en mer.' : 'Une tempête disperse une partie de la flotte.');
      }
    } else {
      a.mp -= 1;
      if (opt.pass === 'alpes') {
        a.mp = 0;
        const f = this.winter ? 0.38 : 0.2;
        let lost = 0;
        for (const u of a.units) { const k = f * (u.type === 'elephants' ? 1.5 : u.type.includes('cav') || u.type === 'numidians' ? 1.2 : 1) * (0.8 + this.rnd() * 0.4); const d = Math.round(u.men * Math.min(0.8, k)); u.men -= d; lost += d; }
        res.events.push(`Passage des Alpes ${this.winter ? 'en plein hiver' : ''} : ${fmtN(lost)} hommes tombés dans les précipices, de froid ou sous les pierres des montagnards.`);
        if (!this.flags.alps && a.side === CARTHAGE) { this.flags.alps = 1; this.msg('alps', a.side); }
      } else if (opt.pass === 'pyr') {
        for (const u of a.units) u.men = Math.round(u.men * 0.95);
      } else if (opt.pass === 'coast') {
        a.mp = 0; // la route étroite de la côte ligure
      }
    }
    a.units = a.units.filter((u) => u.men >= 30 || (u.type === 'elephants' && u.men >= 1));
    if (!a.units.length) { this.removeArmy(a, true); res.destroyed = true; return res; }
    a.prov = pid; a.lastProv = from;
    // l'arrivée en Cisalpine soulève les Gaulois
    if (a.side === CARTHAGE) this.gaulsRise(a);
    return this.arrive(a, res);
  }
  // ce qui se passe quand une armée entre dans une province
  arrive(a, res = {}) {
    const pid = a.prov;
    const foes = this.armies.filter((x) => x.prov === pid && x.side !== a.side);
    if (foes.length) { res.battle = this.makeBattle(pid, a, foes); return res; }
    if (this.owner[pid] !== a.side) {
      const g = this.garrison[pid];
      if (!g.length || this.men(g) < 60) { this.capture(pid, a.side); res.captured = true; }
      else if (PROV[pid].walls === 0) { res.battle = this.makeBattle(pid, a, [], true); }
      else {
        // une ville fortifiée : on l'investit
        a.mp = 0;
        if (!this.siege[pid]) { this.siege[pid] = { army: a.id, side: a.side, t: 0, need: PROV[pid].walls * 2 }; res.siege = true; this.say(`${a.gen.short} met le siège devant ${PROV[pid].city}.`, a.side, 'siege', pid); }
      }
    }
    return res;
  }
  makeBattle(pid, att, defArmies, garrisonOnly) {
    const defSide = defArmies.length ? defArmies[0].side : this.owner[pid];
    const atts = [att, ...this.armies.filter((x) => x !== att && x.prov === pid && x.side === att.side)];
    const gs = this.owner[pid];
    const garSide = this.garrison[pid].length && (gs === defSide || gs === att.side) ? gs : -1;
    return { id: this.uid++, prov: pid, att: att.side, def: defSide, attIds: atts.map((x) => x.id), defIds: defArmies.map((x) => x.id), garSide, garrisonOnly: !!garrisonOnly, fromProv: att.lastProv || null };
  }
  // une bataille différée est-elle toujours d'actualité ?
  refresh(bt) {
    bt.attIds = this.armies.filter((x) => x.prov === bt.prov && x.side === bt.att).map((x) => x.id);
    bt.defIds = this.armies.filter((x) => x.prov === bt.prov && x.side === bt.def).map((x) => x.id);
    const gs = this.owner[bt.prov];
    bt.garSide = this.garrison[bt.prov].length && (gs === bt.def || gs === bt.att) ? gs : -1;
    if (!bt.attIds.length) return null;
    if (!bt.defIds.length) {
      const a = this.army(bt.attIds[0]);
      this.arrive(a, {});
      return null;
    }
    bt.garrisonOnly = false;
    return bt;
  }
  // forces engagées dans une bataille
  forces(bt) {
    const side = (ids, gar, s) => {
      const armies = ids.map((id) => this.army(id)).filter(Boolean);
      const units = [];
      for (const a of armies) a.units.forEach((u, i) => units.push({ u, a, i }));
      if (gar) this.garrison[bt.prov].forEach((u, i) => units.push({ u, a: null, i, gar: true }));
      return { side: s, armies, units, gen: armies.length ? armies.reduce((b, a) => (a.gen.cmd > b.gen.cmd ? a : b)).gen : null };
    };
    return [side(bt.attIds, bt.garSide === bt.att, bt.att), side(bt.defIds, bt.garSide === bt.def, bt.def)];
  }
  odds(bt) {
    const [A, D] = this.forces(bt);
    const pa = this.power(A.units.map((x) => x.u)) * genFactor(A.gen);
    const pd = this.power(D.units.map((x) => x.u)) * genFactor(D.gen) * 1.08 * (bt.assault ? wallF(PROV[bt.prov].walls) : 1);
    return pa / Math.max(1, pa + pd);
  }
  // résolution automatique
  autoresolve(bt) {
    const [A, D] = this.forces(bt);
    const p = this.odds(bt);
    const roll = p + (this.rnd() - 0.5) * 0.3;
    const attWins = roll > 0.5;
    const dom = attWins ? roll : 1 - roll; // 0.5 .. 1
    const W = attWins ? A : D, L = attWins ? D : A;
    const cavShare = W.units.filter((x) => TYPES[x.u.type] && TYPES[x.u.type].cat === 'cav').reduce((s, x) => s + x.u.men, 0) / Math.max(1, this.men(W.units.map((x) => x.u)));
    const lf = clamp(0.18 + (dom - 0.5) * 1.1 + cavShare * 0.25, 0.15, 0.85);
    const wf = clamp(0.24 * (1.15 - dom) * 1.4, 0.03, 0.32);
    const surv = new Map();
    for (const x of W.units) surv.set(x.u, Math.round(x.u.men * (1 - wf * (0.6 + this.rnd() * 0.8))));
    for (const x of L.units) surv.set(x.u, Math.round(x.u.men * (1 - lf * (0.6 + this.rnd() * 0.8))));
    return this.applyBattle(bt, { winner: attWins ? bt.att : bt.def, surv, auto: true });
  }
  // applique le résultat d'une bataille (auto ou jouée en 3D)
  applyBattle(bt, out) {
    const [A, D] = this.forces(bt);
    const killed = [0, 0, 0];
    for (const S of [A, D]) for (const x of S.units) {
      if (!out.surv.has(x.u)) continue;
      const n = Math.max(0, Math.min(x.u.men, out.surv.get(x.u)));
      killed[S.side] += x.u.men - n;
      x.u.men = n;
      if (out.winner === S.side) x.u.xp = Math.min(3, (x.u.xp || 0) + (this.rnd() < 0.6 ? 1 : 0));
    }
    // généraux tombés pendant la bataille jouée
    for (const id of out.genDead || []) {
      const a = this.army(id);
      if (!a || !a.gen) continue;
      if (GENERALS.some((g) => g.id === a.gen.id)) this.deadGens[a.gen.id] = 1;
      this.say(`${a.gen.name} est tombé au combat.`, a.side, 'battle', bt.prov);
      a.gen = this.general(a.side);
    }
    const win = out.winner, attWon = win === bt.att;
    const W = attWon ? A : D, L = attWon ? D : A;
    for (const S of [A, D]) {
      for (const a of S.armies) a.units = a.units.filter((u) => u.men >= Math.max(25, u.max * 0.06) || (u.type === 'elephants' && u.men >= 2));
      if (S.side !== FREE) { this.stats.battles[S.side]++; this.stats.lost[S.side] += killed[S.side]; this.stats.killed[S.side] += killed[1 - S.side] || 0; if (S === W) this.stats.won[S.side]++; }
    }
    this.garrison[bt.prov] = this.garrison[bt.prov].filter((u) => u.men >= 40);
    const pn = PROV[bt.prov];
    const res = { winner: win, killed, prov: bt.prov, events: [] };
    const nm = (S) => (S.gen ? S.gen.short : S.side === FREE ? (pn.people || 'la garnison') : 'la garnison');
    res.text = `${S_NAME(W.side, pn)} l'emporte en ${pn.name} : ${nm(W)} bat ${nm(L)}. Pertes : ${fmtN(killed[W.side])} contre ${fmtN(killed[L.side])}.`;
    // les vaincus se replient, sinon ils sont pris
    for (const a of L.armies) {
      if (!a.units.length) { this.removeArmy(a, true); res.events.push(`L'armée de ${a.gen.short} est anéantie.`); continue; }
      if (a.gen && this.rnd() < (killed[L.side] > 15000 ? 0.4 : 0.12)) { res.events.push(`${a.gen.name} est tombé au combat.`); this.deadGens[a.gen.id] = 1; a.gen = this.general(a.side); }
      const back = this.retreatFrom(a, bt);
      if (!back) { this.removeArmy(a, true); res.events.push(`Sans retraite possible, l'armée de ${a.gen.short} se rend.`); continue; }
      for (const u of a.units) u.men = Math.round(u.men * 0.9);
      a.prov = back; a.mp = 0;
    }
    for (const a of W.armies) if (!a.units.length) this.removeArmy(a, true);
    // la ville : prise, assiégée ou dégagée
    if (attWon && this.owner[bt.prov] !== bt.att) {
      const g = this.garrison[bt.prov];
      const walls = pn.walls;
      if (!g.length || this.men(g) < 60 || walls < 2 || bt.garrisonOnly || bt.assault) { this.capture(bt.prov, bt.att); res.captured = true; }
      else {
        const a = W.armies[0];
        if (a && !this.siege[bt.prov]) { this.siege[bt.prov] = { army: a.id, side: a.side, t: 0, need: walls * 2 }; res.siege = true; }
      }
    }
    if (!attWon && bt.garrisonOnly) {
      for (const a of A.armies) { const back = this.retreatFrom(a, bt); if (back) { a.prov = back; a.mp = 0; } }
    }
    // une grosse défaite romaine en Italie ébranle les alliés
    if (bt.att !== FREE && bt.def !== FREE && L.side === ROME && ITALY.includes(bt.prov) && killed[ROME] > 8000) {
      this.flags.romeDefeats = (this.flags.romeDefeats || 0) + 1;
      this.flags.romeLoss = (this.flags.romeLoss || 0) + killed[ROME];
      this.afterRomanDefeat(res);
    }
    this.say(res.text, W.side, 'battle', bt.prov);
    for (const e of res.events) this.say(e, -1, 'battle', bt.prov);
    this.checkVictory();
    return res;
  }
  // refuser la bataille : l'attaquant revient d'où il vient, le défenseur se replie
  withdraw(bt, side) {
    const ids = side === bt.att ? bt.attIds : bt.defIds;
    let ok = true;
    for (const id of ids) {
      const a = this.army(id); if (!a) continue;
      const back = this.retreatFrom(a, bt);
      if (!back) { ok = false; continue; }
      a.prov = back; a.mp = 0;
      if (side === bt.def) for (const u of a.units) u.men = Math.round(u.men * 0.93);
    }
    if (side === bt.def && ok) {
      // l'attaquant reste maître du terrain : la ville résiste seule
      const a = this.army(bt.attIds[0]);
      if (a) this.arrive(a, {});
    }
    this.say(side === bt.att ? 'L\'attaque est annulée : l\'armée se replie.' : 'L\'armée refuse le combat et se replie.', side, 'info', bt.prov);
    return ok;
  }
  retreatFrom(a, bt) {
    const cand = ADJ[bt.prov].filter((p) => this.owner[p] === a.side && !this.armies.some((x) => x.prov === p && x.side !== a.side));
    if (bt.fromProv && cand.includes(bt.fromProv)) return bt.fromProv;
    if (a.side === bt.att && a.lastProv && !this.armies.some((x) => x.prov === a.lastProv && x.side !== a.side)) return a.lastProv;
    if (cand.length) return cand[Math.floor(this.rnd() * cand.length)];
    const any = ADJ[bt.prov].filter((p) => !this.armies.some((x) => x.prov === p && x.side !== a.side) && this.owner[p] !== (a.side === 0 ? 1 : 0));
    return any.length ? any[0] : null;
  }
  capture(pid, side) {
    const prev = this.owner[pid];
    this.owner[pid] = side;
    delete this.siege[pid];
    const p = PROV[pid];
    this.garrison[pid] = this.militia(p, side, 0.45).slice(0, 2);
    this.slots[pid] = this.maxSlots(pid);
    this.say(`${p.city} tombe aux mains de ${S_NAME(side, p)}${prev === FREE && p.people ? ` (${p.people})` : ''}.`, side, 'capture', pid);
    this.checkVictory();
  }
  // assaut d'une ville assiégée
  assault(a) {
    const s = this.siege[a.prov];
    if (!s || s.army !== a.id) return { err: 'Aucun siège en cours.' };
    const bt = this.makeBattle(a.prov, a, [], true);
    bt.assault = true;
    return this.autoresolve(bt);
  }

  // ------------------------------------------------- événements
  msg(id, side, extra) { this.messages.push({ id, side, ...EVENTS[id], ...(extra || {}) }); }
  gaulsRise(a) {
    if (this.flags.gauls) return;
    const near = ['mediolanum', 'felsina', 'placentia', 'genua'];
    if (!near.includes(a.prov)) return;
    this.flags.gauls = 1;
    for (const pid of ['mediolanum', 'felsina']) if (this.owner[pid] === FREE) { this.owner[pid] = CARTHAGE; this.garrison[pid] = this.militia(PROV[pid], CARTHAGE, 0.8); }
    let n = 0;
    for (const t of ['gauls', 'gauls', 'gauls', 'iber_cav']) if (a.units.length < MAX_UNITS) { a.units.push(this.unit(t)); n++; }
    this.msg('gauls', CARTHAGE, { joined: n });
    this.say('Les Insubres et les Boïens se soulèvent et rejoignent Hannibal.', CARTHAGE, 'event');
  }
  afterRomanDefeat(res) {
    const big = this.flags.romeDefeats >= 2 || this.flags.romeLoss > 30000;
    if (this.flags.romeDefeats >= 2 && !this.flags.fabius) {
      this.flags.fabius = 1;
      this.msg('fabius', ROME);
      const pid = this.owner.roma === ROME ? 'roma' : this.provsOf(ROME)[0]?.id;
      if (pid) {
        const U = (t, n) => Array.from({ length: n }, () => this.unit(t));
        this.newArmy(ROME, pid, [...U('hastati', 2), ...U('principes', 2), ...U('triarii', 2), ...U('velites', 2), ...U('equites', 1)], 'fabius').mission = 'italy';
      }
    }
    if (big && !this.flags.defection) {
      this.flags.defection = 1;
      const went = [];
      for (const pid of SOUTH) {
        if (this.owner[pid] !== ROME || this.armies.some((x) => x.prov === pid && x.side === ROME)) continue;
        const near = ADJ[pid].some((q) => this.armies.some((x) => x.prov === q && x.side === CARTHAGE)) || this.armies.some((x) => x.prov === pid && x.side === CARTHAGE);
        const p = pid === 'capua' ? 0.85 : pid === 'tarentum' ? 0.25 : 0.55;
        if (this.rnd() < (near ? p : p * 0.4)) { this.owner[pid] = CARTHAGE; this.garrison[pid] = this.militia(PROV[pid], CARTHAGE, 0.6); went.push(PROV[pid].city); }
      }
      if (went.length) { this.msg('defection', CARTHAGE, { cities: went }); this.say(`Défection des alliés italiens : ${went.join(', ')} passent à Hannibal.`, CARTHAGE, 'event'); }
    }
  }
  yearEvents() {
    const y = this.year;
    // nouveaux généraux disponibles
    for (const g of GENERALS) {
      if (g.from === y && !this.flags.genSeen[g.id] && (g.id === 'scipio' || g.id === 'marcellus' || g.id === 'fabius')) {
        this.flags.genSeen[g.id] = 1;
        if (g.id === 'scipio') this.msg('scipio', ROME);
      }
    }
    // levées du Sénat chaque été : le réservoir d'hommes de Rome
    if (!this.winter && this.turn > 0 && this.owner.roma === ROME) {
      const n = this.flags.romeDefeats ? 3 : 2;
      for (let i = 0; i < n; i++) this.garrison.roma.push(this.unit(['hastati', 'principes', 'velites'][i % 3], 0.8));
      if (this.garrison.roma.length > 10) this.garrison.roma.splice(0, this.garrison.roma.length - 10);
    }
    // Hannibal aux portes : Rome arme tous ses citoyens
    if (!this.flags.portas && this.owner.roma === ROME && this.armies.some((a) => a.side === CARTHAGE && (a.prov === 'roma' || ADJ.roma.includes(a.prov)))) {
      this.flags.portas = 1;
      for (const t of ['hastati', 'hastati', 'principes', 'triarii', 'equites']) this.garrison.roma.push(this.unit(t, 0.9));
      this.msg('portas', ROME);
    }
    // Syracuse change de camp (214)
    if (y <= 214 && !this.flags.syracuse && this.owner.syracusae === ROME && ITALY.some((p) => this.owner[p] === CARTHAGE && SOUTH.includes(p))) {
      this.flags.syracuse = 1;
      if (!this.armies.some((x) => x.prov === 'syracusae' && x.side === ROME)) { this.owner.syracusae = CARTHAGE; this.garrison.syracusae = this.militia(PROV.syracusae, CARTHAGE, 0.9); this.msg('syracuse', CARTHAGE); }
    }
    // Massinissa passe à Rome (206)
    if (y <= 206 && !this.flags.massinissa && this.owner.cirta === CARTHAGE && HISPANIA.filter((p) => this.owner[p] === ROME).length >= 3) {
      this.flags.massinissa = 1;
      this.owner.cirta = ROME; this.garrison.cirta = [this.unit('numidians'), this.unit('numidians'), this.unit('numid_inf')];
      this.msg('massinissa', ROME);
    }
  }

  // ----------------------------------------------------------- tours
  beginTurn(first) {
    if (!first) this.turn++;
    if (this.turn >= TURNS) { this.endByTime(); return; }
    for (const p of PROVINCES) this.slots[p.id] = 0;
    for (const side of [ROME, CARTHAGE]) {
      if (!first) {
        const f = this.finance(side);
        this.gold[side] += f.net;
        // trésor vide : des unités désertent
        let guard = 0;
        while (this.gold[side] < 0 && guard++ < 30) {
          const list = this.armies.filter((a) => a.side === side);
          if (!list.length) { this.gold[side] = 0; break; }
          const a = list[Math.floor(this.rnd() * list.length)];
          const u = a.units.reduce((b, x) => (CU[x.type].up > CU[b.type].up ? x : b));
          this.gold[side] += CU[u.type].up * 3;
          this.disband(a, a.units.indexOf(u));
          this.say(`Faute de solde, une unité déserte : ${TYPES[u.type].name}.`, side, 'warn');
        }
      }
    }
    for (const a of this.armies) {
      a.mp = this.maxMp(a); a.moved = false; a.lastProv = a.prov;
      // renforts dans ses provinces
      if (!first && this.owner[a.prov] === a.side && !this.siege[a.prov]) for (const u of a.units) u.men = Math.min(u.max, Math.round(u.men + u.max * (this.armiesIn(a.prov).length && PROV[a.prov].walls ? 0.12 : 0.07)));
    }
    // garnisons qui se reforment
    if (!first) for (const p of PROVINCES) {
      const g = this.garrison[p.id], base = this.militia(p, this.owner[p.id], 1);
      for (const u of g) u.men = Math.min(u.max, Math.round(u.men + u.max * 0.08));
      if (g.length < base.length && !this.siege[p.id] && this.rnd() < 0.35) g.push(this.unit(base[g.length].type, 0.4));
    }
    // sièges
    if (!first) for (const pid of Object.keys(this.siege)) {
      const s = this.siege[pid], a = this.army(s.army);
      if (!a || a.prov !== pid) { delete this.siege[pid]; continue; }
      s.t++;
      for (const u of this.garrison[pid]) u.men = Math.round(u.men * 0.78);
      this.garrison[pid] = this.garrison[pid].filter((u) => u.men >= 40);
      if (!this.garrison[pid].length || s.t >= s.need) {
        this.say(`Affamée après ${s.t} saisons de siège, ${PROV[pid].city} ouvre ses portes.`, a.side, 'capture', pid);
        this.capture(pid, a.side);
      }
    }
    this.yearEvents();
    this.checkVictory();
  }
  // le joueur termine son tour : l'ordinateur joue
  endTurn() {
    if (this.over) return;
    for (const side of [ROME, CARTHAGE]) if (side !== this.player) runAI(this, side);
    // fin du tour : les sièges des armées immobiles continuent
    if (!this.pending.length) this.beginTurn();
  }
  // après les batailles imposées au joueur
  finishPending() { if (!this.pending.length && !this.over) this.beginTurn(); }

  checkVictory() {
    if (this.over) return;
    if (this.owner.roma !== ROME) { this.over = { winner: CARTHAGE, why: 'Rome est tombée. Hannibal a fait ce que nul n\'avait fait depuis les Gaulois de Brennus.' }; return; }
    if (this.owner.carthago !== CARTHAGE) { this.over = { winner: ROME, why: 'Carthage est prise. La puissance punique est brisée à jamais.' }; return; }
    const it = ITALY.filter((p) => this.owner[p] === CARTHAGE).length;
    if (it >= 9) { this.over = { winner: CARTHAGE, why: `La confédération italienne s'est effondrée : ${it} provinces d'Italie suivent Hannibal. Rome doit demander la paix.` }; return; }
    if (!this.provsOf(CARTHAGE).length) { this.over = { winner: ROME, why: 'Carthage n\'a plus aucune province.' }; return; }
  }
  endByTime() {
    const r = this.provsOf(ROME).length, c = this.provsOf(CARTHAGE).length;
    this.turn = TURNS - 1;
    this.over = r >= c
      ? { winner: ROME, why: `Fin de la guerre en 202 av. J.-C. Rome tient ${r} provinces contre ${c} à Carthage, qui doit accepter une paix dure.` }
      : { winner: CARTHAGE, why: `Fin de la guerre en 202 av. J.-C. Carthage tient ${c} provinces contre ${r} à Rome : Rome, épuisée, accepte la paix.` };
  }

  // --------------------------------------------------- sauvegarde
  toJSON() {
    const o = {};
    for (const k of ['player', 'seed', 'rngState', 'turn', 'uid', 'gold', 'owner', 'garrison', 'siege', 'slots', 'armies', 'usedGens', 'deadGens', 'flags', 'stats', 'log', 'over']) o[k] = this[k];
    o.v = 1;
    return o;
  }
  static load(o) {
    const c = Object.create(Campaign.prototype);
    Object.assign(c, JSON.parse(JSON.stringify(o)));
    c.pending = []; c.messages = [];
    return c;
  }
}

export const S_NAME = (side, p) => (side === FREE ? (p && p.people) || 'Les peuples libres' : FACTIONS[side].name);
export const wallF = (w) => [1, 1.5, 2, 3.2][w] || 1;
const genFactor = (g) => (g ? 1 + 0.08 * (g.cmd - 2) : 0.9);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const nf = new Intl.NumberFormat('fr-FR');
const fmtN = (n) => nf.format(Math.round(n));
export const fmtNum = fmtN;

/* --------------------------------------------------------------------- *
 *  Événements historiques
 * --------------------------------------------------------------------- */
export const EVENTS = {
  start0: { title: 'Rome déclare la guerre', text: "Sagonte, alliée de Rome, est tombée après huit mois de siège. Au Sénat de Carthage, Fabius a plié sa toge : « Je porte ici la paix et la guerre ; choisissez. » — « Choisis toi-même. » — « Alors c'est la guerre. » Tu commandes Rome : deux consuls, Publius Scipion à Massalia et Sempronius en Sicile, et un préteur en Cisalpine.", quote: 'Tite-Live, XXI.18' },
  start1: { title: 'Hannibal se met en marche', text: "Printemps 218. À Carthagène, Hannibal rassemble l'armée d'Hispanie : Libyens, Ibères, frondeurs baléares, cavaliers numides et 37 éléphants. Rome tient la mer : il faudra passer par les Pyrénées, la Gaule et les Alpes. Les Gaulois de la plaine du Pô n'attendent qu'un signal pour se soulever.", quote: 'Polybe, III.33-35' },
  alps: { title: 'Le passage des Alpes', text: "Quinze jours de marche dans la neige, les éboulis et les embuscades des montagnards. Pour élargir un passage, Hannibal fait chauffer les rochers et les arrose de vinaigre. Du sommet, il montre à ses hommes la plaine du Pô : « Vous franchissez aujourd'hui les murs de l'Italie, et même de Rome. »", quote: 'Polybe, III.54 ; Tite-Live, XXI.37' },
  gauls: { title: 'Les Gaulois se soulèvent', text: "Les Insubres et les Boïens, soumis par Rome quelques années plus tôt, se rallient à Hannibal. Des milliers de guerriers gaulois rejoignent son armée.", quote: 'Polybe, III.60' },
  fabius: { title: 'Un dictateur : Fabius', text: "Après tant de désastres, Rome nomme dictateur Quintus Fabius Maximus. Sa méthode : ne jamais livrer bataille, harceler, couper les vivres. On le surnomme Cunctator, le Temporisateur. Une nouvelle armée est levée à Rome.", quote: 'Tite-Live, XXII.8-12' },
  defection: { title: "Les alliés d'Italie font défection", text: "La nouvelle du désastre se répand dans toute l'Italie. Plusieurs cités alliées ouvrent leurs portes à Hannibal.", quote: 'Tite-Live, XXII.61' },
  syracuse: { title: 'Syracuse change de camp', text: "Le vieux roi Hiéron, fidèle allié de Rome, est mort. Son petit-fils Hiéronyme se tourne vers Carthage. Archimède prépare ses machines.", quote: 'Polybe, VII.2-5' },
  massinissa: { title: 'Massinissa passe à Rome', text: "Le prince numide Massinissa, qui a combattu en Hispanie pour Carthage, rencontre Scipion et change de camp. Ses cavaliers seront décisifs.", quote: 'Tite-Live, XXVIII.35' },
  portas: { title: 'Hannibal ad portas', text: "« Hannibal est aux portes ! » La panique gagne la ville. Les femmes balaient de leurs cheveux le sol des temples. Rome arme tous ses citoyens : deux légions urbaines garnissent les murs de Servius.", quote: 'Tite-Live, XXVI.9' },
  recall: { title: 'Hannibal rappelé', text: "Une armée romaine ravage l'Afrique. Le Sénat de Carthage rappelle Hannibal d'Italie. Tite-Live raconte qu'il quitta en grinçant des dents cette terre qu'il occupait depuis quinze ans.", quote: 'Tite-Live, XXX.20' },
  scipio: { title: 'Scipion, 25 ans', text: "Personne ne voulait du commandement en Hispanie, où son père et son oncle venaient de mourir. Le jeune Publius Cornelius Scipio se présente : le peuple l'élit. Il est désormais disponible comme général.", quote: 'Tite-Live, XXVI.18' },
};

/* --------------------------------------------------------------------- *
 *  Intelligence de campagne
 * --------------------------------------------------------------------- */
// distances (en mouvements) vers une province, pour un camp
function dist(c, side, goal) {
  const d = { [goal]: 0 }, q = [goal];
  while (q.length) {
    const p = q.shift();
    const nb = ADJ[p].map((x) => [x, passOf(p, x) === 'alpes' ? 2 : passOf(p, x) === 'coast' ? 3 : 1]).concat(SEADJ[p].filter((x) => PROV[p].port && !(side !== ROME && romanLane(p, x))).map((x) => [x, side === CARTHAGE ? 3 : 2]));
    for (const [n, w] of nb) {
      const nd = d[p] + w;
      if (d[n] === undefined || nd < d[n]) { d[n] = nd; q.push(n); }
    }
  }
  return d;
}

function threatAt(c, side, pid) {
  // puissance ennemie qui peut frapper la province au prochain tour
  let s = 0;
  for (const a of c.armies) if (a.side !== side && (a.prov === pid || ADJ[pid].includes(a.prov))) s += c.armyPower(a);
  return s;
}

export function runAI(c, side) {
  const foe = side === ROME ? CARTHAGE : ROME;
  // ---- levées
  const threatened = PROVINCES.filter((p) => c.owner[p.id] === side && threatAt(c, side, p.id) > 0).map((p) => p.id);
  const mine = c.provsOf(side).map((p) => p.id);
  const fin = c.finance(side);
  let budget = c.gold[side] - Math.max(0, -fin.net) * 2 - 300;
  const wantArmies = side === ROME ? 5 + Math.min(5, Math.floor(c.turn / 4)) : 4 + Math.min(2, Math.floor(c.turn / 8));
  let order = [...new Set([...threatened, ...mine.filter((p) => c.armiesIn(p, side).length), c.owner[FACTIONS[side].capital] === side ? FACTIONS[side].capital : mine[0]])].filter(Boolean);
  if (c.gold[side] > 3000) {
    // trésor plein : lever aussi près des fronts
    const front = mine.filter((p) => !order.includes(p) && PROV[p].walls >= 1).map((p) => [p, Math.min(...c.armies.filter((x) => x.side !== side && x.side !== FREE).map((x) => dist(c, side, x.prov)[p] ?? 9), 9)]).sort((x, y) => x[1] - y[1]);
    order = order.concat(front.slice(0, 3).map((x) => x[0]));
  }
  for (const pid of order) {
    if (budget < 300) break;
    const list = c.recruitList(pid);
    if (!list.length) continue;
    const here = c.armiesIn(pid, side);
    const nArm = c.armies.filter((a) => a.side === side).length;
    if (!here.length && nArm >= wantArmies && !threatened.includes(pid)) continue;
    let guard = 0;
    while (budget > 300 && c.slots[pid] < c.maxSlots(pid) && guard++ < 4) {
      const a = c.armiesIn(pid, side).find((x) => x.units.length < MAX_UNITS);
      // composition équilibrée : lignes lourdes, quelques légers, de la cavalerie
      const cnt = (pred) => (a ? a.units.filter(pred).length : 0);
      const n = a ? a.units.length : 0;
      let t;
      const cavT = list.find((x) => TYPES[x].cat === 'cav'), lightT = list.find((x) => TYPES[x].light && TYPES[x].cat === 'inf');
      const heavy = list.filter((x) => TYPES[x].cat === 'inf' && !TYPES[x].light);
      if (cavT && cnt((u) => TYPES[u.type].cat === 'cav') < Math.max(1, n * 0.2)) t = cavT;
      else if (lightT && cnt((u) => TYPES[u.type].light) < Math.max(1, n * 0.15)) t = lightT;
      else if (heavy.length) t = heavy[(n + guard) % heavy.length];
      else t = list[0];
      if (t === 'elephants' && (c.rnd() < 0.7 || budget < 2500)) t = heavy[0] || list[0];
      if (c.canRecruit(pid, t)) break;
      if (CU[t].cost > budget) break;
      if (c.finance(side).net - CU[t].up < (threatened.includes(pid) ? -150 : 120)) break;
      c.recruit(pid, t);
      budget -= CU[t].cost;
    }
  }
  // ---- fusion des petites armées
  for (const a of c.armies.filter((x) => x.side === side)) {
    const other = c.armies.find((b) => b !== a && b.side === side && b.prov === a.prov && b.units.length + a.units.length <= MAX_UNITS);
    if (other && c.armies.includes(a)) { const [big, small] = a.gen.cmd >= other.gen.cmd ? [a, other] : [other, a]; c.merge(big, small); }
  }
  // ---- missions des nouvelles armées
  const AFRICA = ['carthago', 'hadrumetum', 'leptis', 'cirta', 'siga', 'tingis'];
  for (const a of c.armies) {
    if (a.side !== side || a.mission) continue;
    if (HISPANIA.includes(a.prov)) a.mission = side === ROME ? 'hispania' : 'hold:HISPANIA';
    else if (AFRICA.includes(a.prov)) a.mission = side === ROME ? 'africa' : (c.armies.some((x) => x !== a && x.side === side && x.mission === 'guard') ? 'hold:AFRICA' : 'guard');
    else if (ITALY.includes(a.prov)) a.mission = side === ROME ? 'italy' : 'roma';
    else a.mission = side === ROME ? (c.rnd() < 0.5 ? 'hispania' : 'italy') : 'hold:HISPANIA';
    if (side === ROME && a.gen.id === 'scipio') a.mission = c.year <= 205 ? 'africa' : 'hispania';
  }
  // ---- Hannibal rappelé en Afrique
  if (side === CARTHAGE && !c.flags.recall && c.owner.carthago === CARTHAGE) {
    const rp = c.armies.filter((x) => x.side === ROME && AFRICA.includes(x.prov)).reduce((t, x) => t + c.armyPower(x), 0);
    const home = c.armiesIn('carthago', CARTHAGE).reduce((t, x) => t + c.armyPower(x), 0) + c.garrisonPower('carthago') * 2;
    const threat = rp > home * 0.8 || (c.year <= 204 && rp > 0);
    const h = c.armies.find((x) => x.side === CARTHAGE && x.gen.id === 'hannibal');
    if (threat && h && !AFRICA.includes(h.prov)) {
      c.flags.recall = 1;
      if (c.siege[h.prov] && c.siege[h.prov].army === h.id) delete c.siege[h.prov];
      for (const u of h.units) u.men = Math.round(u.men * 0.9);
      h.prov = 'carthago'; h.mp = 0; h.mission = 'guard';
      c.msg('recall', CARTHAGE);
      c.say('Hannibal est rappelé en Afrique pour défendre Carthage.', CARTHAGE, 'event', 'carthago');
      const res = c.arrive(h, {});
      if (res.battle) { if (res.battle.def === c.player || res.battle.att === c.player) c.pending.push(res.battle); else c.autoresolve(res.battle); }
    }
  }
  // ---- mouvements
  const goals = {};
  const goalDist = (g) => goals[g] || (goals[g] = dist(c, side, g));
  const foeCap = FACTIONS[foe].capital, myCap = FACTIONS[side].capital;
  for (const a of c.armies.filter((x) => x.side === side).sort((x, y) => c.armyPower(y) - c.armyPower(x))) {
    let guard = 0;
    while (c.armies.includes(a) && a.mp > 0 && guard++ < 4) {
      const my = c.armyPower(a);
      // garde de la capitale menacée
      const capThreat = c.owner[myCap] === side ? threatAt(c, side, myCap) : 0;
      // choix de la cible
      let goal = null;
      const m = a.mission || '';
      if (a.gen.id === 'hannibal' || m === 'roma') goal = c.owner.roma === ROME ? 'roma' : null;
      if (side === ROME && (a.gen.id === 'scipio' || m === 'africa') && c.year <= 205) goal = 'carthago';
      if (!goal && m === 'hispania') goal = HISPANIA.find((p) => c.owner[p] === CARTHAGE) || null;
      if (!goal && m.startsWith('hold')) goal = null;
      if (capThreat > (c.garrisonPower(myCap) + c.armiesIn(myCap, side).reduce((s, x) => s + c.armyPower(x), 0)) * 0.9 && a.prov !== myCap && goalDist(myCap)[a.prov] <= 3) goal = myCap;
      // armées ennemies en Italie : Rome les poursuit si elle est assez forte
      if (side === ROME && !goal && m !== 'hispania') {
        let best = null, bs = 0;
        for (const e of c.armies) {
          if (e.side !== CARTHAGE || (m === 'italy' && !ITALY.includes(e.prov))) continue;
          const d = goalDist(e.prov)[a.prov] || 9;
          const r = my / Math.max(1, c.armyPower(e));
          const sc = (ITALY.includes(e.prov) ? 2 : 1) * (r > 1.2 ? 1 : r > 0.8 && !a.gen.cautious ? 0.5 : 0.05) / (1 + d);
          if (sc > bs) { bs = sc; best = e.prov; }
        }
        goal = best || (ITALY.find((p) => c.owner[p] !== ROME && ADJ[p].some((q) => c.owner[q] === ROME)) || null);
      }
      if (side === CARTHAGE && !goal && m === 'guard') goal = null;
      if (side === CARTHAGE && !goal && !m.startsWith('hold') && m !== 'guard') goal = ITALY.find((p) => c.owner[p] === ROME) || null;
      const opts = c.options(a);
      if (!opts.length) break;
      // valeur de rester sur place
      let bestScore = c.siege[a.prov] && c.siege[a.prov].army === a.id ? 6 : 0;
      if (c.owner[a.prov] === side && threatAt(c, side, a.prov) > c.garrisonPower(a.prov)) bestScore += 2.5;
      if (a.units.length < 8 && c.owner[a.prov] === side) bestScore += 2;
      if (m === 'guard' && a.prov === myCap) bestScore += 8;
      if (m.startsWith('hold') && c.owner[a.prov] === side && HISPANIA.includes(a.prov)) bestScore += 1.2;
      let best = null;
      const gd = goal ? goalDist(goal) : null;
      for (const o of opts) {
        let sc = 0;
        const ep = o.armies.reduce((s, x) => s + c.armyPower(x), 0) + (c.owner[o.prov] !== side ? c.garrisonPower(o.prov) * (o.armies.length ? 1 : wallF(PROV[o.prov].walls) * 0.8) : 0);
        const r = my / Math.max(1, ep * 1.08);
        const bold = a.gen.id === 'hannibal' ? 0.85 : a.gen.cautious ? 1.6 : 1.15;
        if (o.attack) {
          if (r < bold) { sc -= 10; }
          else sc += 3 + PROV[o.prov].inc / 300 + (o.armies.length ? 2 : 0) + (o.prov === foeCap ? 6 : 0) + Math.min(2, r - 1);
          if (c.owner[o.prov] === FREE && !o.armies.length) sc -= side === ROME ? 1.5 : 1;
        } else {
          sc += 0.2;
          if (c.owner[o.prov] === side && threatAt(c, side, o.prov) > c.garrisonPower(o.prov)) sc += 1.5;
        }
        if (gd && gd[a.prov] !== undefined && gd[o.prov] !== undefined) sc += (gd[a.prov] - gd[o.prov]) * 2.2;
        // ne pas finir à côté d'un ennemi beaucoup plus fort
        const danger = ADJ[o.prov].reduce((s, p) => s + c.armies.filter((x) => x.prov === p && x.side === foe).reduce((t, x) => t + c.armyPower(x), 0), 0);
        if (danger > my * 1.6 && !o.attack) sc -= 2.5;
        if (o.sea) sc -= side === CARTHAGE ? 1.5 : 0.5;
        if (m.startsWith('hold')) { const reg = m === 'hold:HISPANIA' ? HISPANIA : AFRICA; if (!reg.includes(o.prov)) sc -= 4; }
        if (m === 'italy' && !ITALY.includes(o.prov) && !['lilybaeum', 'syracusae'].includes(o.prov)) sc -= 6;
        if (m === 'hispania' && !HISPANIA.includes(o.prov) && !['massalia', 'narbo', 'ebusus'].includes(o.prov)) sc -= 4;
        if (m === 'guard' && o.prov !== myCap) sc -= 3;
        if (o.pass === 'alpes' && c.winter) sc -= 4;
        if (sc > bestScore) { bestScore = sc; best = o; }
      }
      if (!best) break;
      const res = c.move(a, best.prov);
      if (res.battle) {
        res.battle.fromProv = res.from;
        if (res.battle.def === c.player) { c.pending.push(res.battle); a.mp = 0; break; }
        c.autoresolve(res.battle);
        a.mp = 0;
        break;
      }
      if (res.destroyed) break;
    }
    // assaut d'une ville assiégée si la garnison est faible
    if (c.armies.includes(a) && c.siege[a.prov] && c.siege[a.prov].army === a.id) {
      const r = c.armyPower(a) / Math.max(1, c.garrisonPower(a.prov) * wallF(PROV[a.prov].walls));
      if (r > 2.2 && c.rnd() < 0.5) c.assault(a);
    }
  }
}
