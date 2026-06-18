/* =========================================================
   Données du jeu : types, table d'efficacité, attaques,
   et espèces de créatures ("Polkamons").
   ========================================================= */

// Types élémentaires
const TYPES = {
  NORMAL: { name: "Normal", color: "#a8a878" },
  FEU: { name: "Feu", color: "#f08030" },
  EAU: { name: "Eau", color: "#6890f0" },
  PLANTE: { name: "Plante", color: "#78c850" },
  ELECTRIK: { name: "Électrik", color: "#f8d030" },
};

// Table d'efficacité : EFFECTIVENESS[attaque][defenseur] = multiplicateur
const EFFECTIVENESS = {
  FEU: { PLANTE: 2, EAU: 0.5, FEU: 0.5, ELECTRIK: 1, NORMAL: 1 },
  EAU: { FEU: 2, PLANTE: 0.5, EAU: 0.5, ELECTRIK: 1, NORMAL: 1 },
  PLANTE: { EAU: 2, FEU: 0.5, PLANTE: 0.5, ELECTRIK: 1, NORMAL: 1 },
  ELECTRIK: { EAU: 2, PLANTE: 0.5, ELECTRIK: 0.5, FEU: 1, NORMAL: 1 },
  NORMAL: { FEU: 1, EAU: 1, PLANTE: 1, ELECTRIK: 1, NORMAL: 1 },
};

function typeMultiplier(attackType, defenderType) {
  return (EFFECTIVENESS[attackType] && EFFECTIVENESS[attackType][defenderType]) || 1;
}

// Attaques disponibles
const MOVES = {
  charge: { name: "Charge", type: "NORMAL", power: 35, accuracy: 100 },
  griffe: { name: "Griffe", type: "NORMAL", power: 40, accuracy: 100 },
  flammeche: { name: "Flammèche", type: "FEU", power: 45, accuracy: 100 },
  lance_flammes: { name: "Lance-Flammes", type: "FEU", power: 65, accuracy: 90 },
  pistolet_a_o: { name: "Pistolet à O", type: "EAU", power: 45, accuracy: 100 },
  hydrocanon: { name: "Hydrocanon", type: "EAU", power: 65, accuracy: 90 },
  fouet_lianes: { name: "Fouet Lianes", type: "PLANTE", power: 45, accuracy: 100 },
  tempete_verte: { name: "Tempête Verte", type: "PLANTE", power: 65, accuracy: 90 },
  eclair: { name: "Éclair", type: "ELECTRIK", power: 45, accuracy: 100 },
  tonnerre: { name: "Tonnerre", type: "ELECTRIK", power: 65, accuracy: 90 },
};

/* Chaque espèce :
   - base : stats de base (pv, atk, def, vitesse)
   - moves : attaques connues
   - sprite : emoji utilisé comme "sprite"
   - color : couleur d'arrière-plan du sprite
   - evolvesTo / evolveLevel : évolution (optionnel)
*/
const SPECIES = {
  flammulot: {
    id: "flammulot", name: "Flammulot", type: "FEU", sprite: "🦊",
    color: "#ffd9b3",
    base: { pv: 39, atk: 12, def: 9, vit: 13 },
    moves: ["griffe", "flammeche"],
    evolvesTo: "pyrofox", evolveLevel: 16,
  },
  pyrofox: {
    id: "pyrofox", name: "Pyrofox", type: "FEU", sprite: "🔥",
    color: "#ffb380",
    base: { pv: 58, atk: 18, def: 13, vit: 18 },
    moves: ["griffe", "flammeche", "lance_flammes"],
  },
  aquoque: {
    id: "aquoque", name: "Aquoque", type: "EAU", sprite: "🐢",
    color: "#bcdcff",
    base: { pv: 44, atk: 10, def: 13, vit: 9 },
    moves: ["charge", "pistolet_a_o"],
    evolvesTo: "tortidal", evolveLevel: 16,
  },
  tortidal: {
    id: "tortidal", name: "Tortidal", type: "EAU", sprite: "🌊",
    color: "#99ccff",
    base: { pv: 63, atk: 15, def: 19, vit: 12 },
    moves: ["charge", "pistolet_a_o", "hydrocanon"],
  },
  bourgemon: {
    id: "bourgemon", name: "Bourgemon", type: "PLANTE", sprite: "🌱",
    color: "#cdeeb0",
    base: { pv: 45, atk: 11, def: 11, vit: 10 },
    moves: ["charge", "fouet_lianes"],
    evolvesTo: "floralion", evolveLevel: 16,
  },
  floralion: {
    id: "floralion", name: "Floralion", type: "PLANTE", sprite: "🌻",
    color: "#aadd88",
    base: { pv: 60, atk: 16, def: 16, vit: 14 },
    moves: ["charge", "fouet_lianes", "tempete_verte"],
  },
  // Créatures sauvages communes
  ratnoir: {
    id: "ratnoir", name: "Ratnoir", type: "NORMAL", sprite: "🐀",
    color: "#d9d9c3",
    base: { pv: 30, atk: 10, def: 8, vit: 12 },
    moves: ["charge", "griffe"],
  },
  piafou: {
    id: "piafou", name: "Piafou", type: "NORMAL", sprite: "🐦",
    color: "#e8e0c0",
    base: { pv: 28, atk: 9, def: 7, vit: 14 },
    moves: ["charge", "griffe"],
  },
  voltepuce: {
    id: "voltepuce", name: "Voltepuce", type: "ELECTRIK", sprite: "⚡",
    color: "#fff0a8",
    base: { pv: 35, atk: 11, def: 8, vit: 16 },
    moves: ["charge", "eclair"],
    evolvesTo: "tonneron", evolveLevel: 18,
  },
  tonneron: {
    id: "tonneron", name: "Tonnerron", type: "ELECTRIK", sprite: "🌩️",
    color: "#ffe680",
    base: { pv: 55, atk: 17, def: 12, vit: 22 },
    moves: ["charge", "eclair", "tonnerre"],
  },
  aquabave: {
    id: "aquabave", name: "Aquabave", type: "EAU", sprite: "🐟",
    color: "#c7e6ff",
    base: { pv: 32, atk: 10, def: 9, vit: 11 },
    moves: ["charge", "pistolet_a_o"],
  },
  herbiboule: {
    id: "herbiboule", name: "Herbiboule", type: "PLANTE", sprite: "🍃",
    color: "#d4f0bb",
    base: { pv: 33, atk: 9, def: 12, vit: 8 },
    moves: ["charge", "fouet_lianes"],
  },
};

// Starters proposés au début
const STARTERS = ["flammulot", "aquoque", "bourgemon"];

// Créatures rencontrables dans les hautes herbes (avec leur poids d'apparition)
const WILD_POOL = [
  { id: "ratnoir", weight: 30 },
  { id: "piafou", weight: 25 },
  { id: "voltepuce", weight: 15 },
  { id: "aquabave", weight: 15 },
  { id: "herbiboule", weight: 15 },
];
