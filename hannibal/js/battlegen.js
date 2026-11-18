/* Batailles de campagne : un champ de bataille construit à partir des armées en présence.
   - terrain selon la province (collines d'Étrurie, plaine du Pô, Apulie, Afrique…) et la saison ;
   - déploiement : triple ligne romaine (hastati, principes, triaires) ou ligne et réserve,
     tirailleurs en écran, cavalerie sur les ailes, éléphants en tête, généraux en retrait ;
   - plans génériques pour l'ordinateur et pour le joueur ;
   - retour des pertes vers la campagne. Partie pure (testable dans Node). */
import { TYPES } from './data.js';
import { PROV, FACTIONS, ROME, CARTHAGE, FREE, S_NAME } from './campaign.js';
import { ST } from './sim.js';

const ROMAN = { hastati: 0, principes: 1, triarii: 2 };
const romanNum = (n) => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'][n] || String(n);
const TER_NAME = { plain: 'plaine', hills: 'collines', river: 'vallée et fleuve', arid: 'terres arides', cannae: "plaine de l'Aufide", zama: "plaine d'Afrique" };

// camp de campagne → camp de bataille (Rome toujours au nord, côté 0)
export function battleSides(bt) {
  const s = [bt.att, bt.def];
  if (s.includes(ROME)) return [ROME, s.find((x) => x !== ROME)];
  if (s.includes(CARTHAGE)) return [s.find((x) => x !== CARTHAGE), CARTHAGE];
  return [bt.att, bt.def];
}

export function fieldScenario(c, bt, opts = {}) {
  const p = PROV[bt.prov];
  const [A, D] = c.forces(bt);
  const sides = battleSides(bt); // sides[battleSide] = camp de campagne
  const F = (cs) => (cs === bt.att ? A : D);
  const winter = c.winter;
  const kind = p.ter;
  const seed = (hash(p.id) + c.turn * 7) % 997 + 3;
  const lush = kind === 'zama' || kind === 'arid' ? (winter ? 0.12 : 0) : (kind === 'hills' ? 0.42 : kind === 'river' ? 0.25 : 0.12) + (winter ? 0.32 : 0);
  // la ville de la province, au bord du champ, côté de son maître
  const ownerB = sides.indexOf(c.owner[bt.prov]);
  const tz = ownerB === 0 ? -1950 : 1950;
  const town = { x: (seed % 2 ? 1 : -1) * 1250, z: ownerB < 0 ? 2000 : tz, r: 70 + p.walls * 45, seed, walls: p.walls, temple: p.walls >= 2 };
  const units = [];
  const groups = {};
  const plans = {};
  for (const bs of [0, 1]) {
    const S = F(sides[bs]);
    const lay = layout(S, bs, sides[bs]);
    units.push(...lay.units);
    groups[bs] = lay.groups;
  }
  // plans de l'ordinateur selon le rapport des forces
  const pw = (bs, pred) => units.filter((u) => u.side === bs && pred(TYPES[u.type])).reduce((s, u) => s + u.men * (TYPES[u.type].cat === 'cav' ? 2 : 1), 0);
  for (const bs of [0, 1]) {
    const me = pw(bs, () => true), foe = pw(1 - bs, () => true);
    const cav = pw(bs, (T) => T.cat === 'cav'), fcav = pw(1 - bs, (T) => T.cat === 'cav');
    const S = F(sides[bs]);
    const cautious = S.gen && S.gen.cautious;
    plans[bs] = cautious || me < foe * 0.75 ? 'defend' : cav > fcav * 1.5 && cav > 1500 ? 'hammer' : 'attack';
  }
  const gname = (S) => (S.gen ? S.gen.short : null);
  const sideNames = sides.map((cs) => S_NAME(cs, p));
  const att = sides.indexOf(bt.att);
  const wind = windFor(seed, winter);
  const scn = {
    id: 'field', field: true, campaignBattle: bt.id,
    terrain: kind, seed, lush, winter,
    name: p.name, latin: p.city,
    date: c.dateText, place: `${p.name}, près de ${p.city}`,
    lat: p.lat, decl: winter ? -16 : 15, startHour: winter ? 10.2 : 9.3,
    wind, turbidity: kind === 'arid' || kind === 'zama' ? 8 : winter ? 5 : 7,
    sideNames,
    sideColors: sides.map((cs) => FACTIONS[cs].color),
    sideCamp: sides,
    commanders: sides.map((cs) => gname(F(cs)) || 'la garnison'),
    units: () => units.map((u) => ({ ...u })),
    groups, aiPlan: plans, attacker: att,
    camps: [
      { x: -150 + (seed % 5) * 60, z: -1850, w: 560, d: 520, a: 0.04, roman: sides[0] === ROME },
      { x: 200 - (seed % 3) * 80, z: 1900, w: 560, d: 500, a: -0.08, roman: false },
    ],
    town,
    hist: null,
    brief: [0, 1].map((bs) => briefFor(c, bt, p, sides, bs, F, kind, winter)),
  };
  scn.terrainKey = `${kind}|${seed}|${lush.toFixed(2)}`;
  return scn;
}

function briefFor(c, bt, p, sides, bs, F, kind, winter) {
  const me = F(sides[bs]), foe = F(sides[1 - bs]);
  const men = (S) => S.units.reduce((s, x) => s + x.u.men, 0);
  const atk = sides[bs] === bt.att;
  const fg = foe.gen ? `${foe.gen.name}${foe.gen.cmd >= 4 ? ', redoutable tacticien,' : ''}` : 'la garnison';
  return `${winter ? 'Hiver' : 'Été'} ${c.year} av. J.-C., ${p.name} (${TER_NAME[kind] || kind}). ${atk ? 'Tu attaques' : 'Tu défends la province contre'} ${fg} : ${fmt(men(me))} hommes contre ${fmt(men(foe))}.${foe.units.some((x) => x.u.type === 'elephants') ? ' L\'ennemi a des éléphants.' : ''}`;
}

/* --------------------------------------------------------------------- *
 *  Déploiement d'une armée. Repère local : x > 0 = gauche de l'armée,
 *  y = 0 au bord avant de la ligne principale, y > 0 vers l'ennemi.
 * --------------------------------------------------------------------- */
function layout(S, bs, campSide) {
  const out = [];
  const th = bs === 0 ? 0 : Math.PI;
  const GAP = 240;
  const W = (x, y) => (bs === 0 ? [x, -GAP + y] : [-x, GAP - y]); // vers le monde
  const cnt = {};
  const label = (T) => { cnt[T.short] = (cnt[T.short] || 0) + 1; return `${T.short} ${romanNum(cnt[T.short])}`; };
  const all = S.units.map((x) => ({ ...x, T: TYPES[x.u.type] })).filter((x) => x.T && x.u.men >= 1);
  const light = all.filter((x) => x.T.cat === 'inf' && x.T.light);
  const cav = all.filter((x) => x.T.cat === 'cav');
  const ele = all.filter((x) => x.T.cat === 'ele');
  let heavy = all.filter((x) => x.T.cat === 'inf' && !x.T.light);
  const put = (x, role, lx, ly, files, extra = {}) => {
    const T = x.T, men = Math.round(x.u.men);
    const f = Math.max(4, Math.min(men, Math.round(files)));
    const [wx, wz] = W(lx, ly);
    out.push({ side: bs, type: x.u.type, name: (x.gar ? 'Garnison · ' : '') + label(T), men, x: wx, zf: wz, th, files: f, role, cu: x.u, xp: x.u.xp || 0, ...extra });
    return f * T.spX;
  };
  const filesOf = (x, ranks) => Math.max(12, Math.min(150, Math.round(x.u.men / ranks)));
  const widthOf = (x, ranks) => filesOf(x, ranks) * x.T.spX;
  const depthOf = (x, ranks) => (x.u.men / filesOf(x, ranks)) * x.T.spZ;
  // ---- infanterie lourde
  const roman = heavy.filter((x) => ROMAN[x.u.type] !== undefined);
  let frontW = 0;
  const lines = [[], [], []];
  if (roman.length >= heavy.length * 0.6 && roman.length >= 2) {
    // triple ligne en quinconce : colonnes de manipules
    const H = roman.filter((x) => x.u.type === 'hastati'), P = roman.filter((x) => x.u.type === 'principes'), Tr = roman.filter((x) => x.u.type === 'triarii');
    const others = heavy.filter((x) => ROMAN[x.u.type] === undefined);
    const ncol = Math.max(H.length, P.length, Tr.length, 1);
    const cols = [];
    for (let j = 0; j < ncol; j++) cols.push([H[j], P[j], Tr[j]]);
    for (const o of others) cols.push([o, null, null]);
    const cw = cols.map((col) => Math.max(...col.filter(Boolean).map((x) => widthOf(x, x.u.type === 'triarii' ? 6 : 8)), 40) + 14);
    frontW = cw.reduce((a, b) => a + b, 0);
    let off = frontW / 2;
    const depth = [0, 0, 0];
    cols.forEach((col, j) => { col.forEach((x, l) => { if (x) depth[l] = Math.max(depth[l], depthOf(x, x.u.type === 'triarii' ? 6 : 8)); }); });
    cols.forEach((col, j) => {
      const cx = off - cw[j] / 2; off -= cw[j];
      let y = 0;
      col.forEach((x, l) => {
        if (x) put(x, ROMAN[x.u.type] !== undefined ? x.u.type : 'line1', cx, y, filesOf(x, x.u.type === 'triarii' ? 6 : 8), { line: l, col: j });
        y -= depth[l] + 22;
      });
      lines[0].push(col[0]);
    });
  } else if (heavy.length) {
    // ligne de bataille et réserve des meilleures troupes
    heavy.sort((a, b) => b.T.morale - a.T.morale);
    const nRes = heavy.length > 6 ? Math.round(heavy.length * 0.35) : 0;
    const res = heavy.slice(0, nRes), main = heavy.slice(nRes);
    // les meilleures unités de la ligne aux ailes (comme les Libyens à Cannes)
    main.sort((a, b) => a.T.morale - b.T.morale);
    const arranged = [];
    main.forEach((x, i) => (i % 2 ? arranged.push(x) : arranged.unshift(x)));
    arranged.reverse();
    const mid = arranged.slice();
    const w = mid.map((x) => widthOf(x, 10) + 12);
    frontW = w.reduce((a, b) => a + b, 0);
    let off = frontW / 2;
    let d0 = 0;
    mid.forEach((x, j) => { put(x, 'line1', off - w[j] / 2, 0, filesOf(x, 10), { line: 0, col: j }); off -= w[j]; d0 = Math.max(d0, depthOf(x, 10)); });
    if (res.length) {
      const step = frontW / res.length;
      res.forEach((x, k) => {
        const cx = frontW / 2 - step * (k + 0.5);
        // colonne du soutien : l'unité de première ligne la plus proche
        let best = 0, bd = 1e9; let o2 = frontW / 2;
        w.forEach((ww, j) => { const c2 = o2 - ww / 2; o2 -= ww; if (Math.abs(c2 - cx) < bd) { bd = Math.abs(c2 - cx); best = j; } });
        put(x, 'line2', cx, -d0 - 60, filesOf(x, 10), { line: 1, col: best });
      });
    }
  }
  frontW = Math.max(frontW, 300);
  // ---- tirailleurs en écran devant la ligne
  if (light.length) {
    const step = frontW / light.length;
    light.forEach((x, k) => put(x, 'light', frontW / 2 - step * (k + 0.5), 55, Math.min(filesOf(x, 4), Math.round(step * 0.85 / x.T.spX))));
  }
  // ---- éléphants en tête
  if (ele.length) {
    const step = frontW / ele.length;
    ele.forEach((x, k) => put(x, 'ele', frontW / 2 - step * (k + 0.5), 120, Math.max(4, Math.round(x.u.men / 2))));
  }
  // ---- cavalerie sur les ailes : lourde à gauche, légère à droite
  if (cav.length) {
    const L = cav.filter((x) => !x.T.light).sort((a, b) => b.u.men - a.u.men), R = cav.filter((x) => x.T.light);
    // rééquilibrer si une aile est vide
    if (!R.length && L.length > 1) R.push(...L.splice(Math.ceil(L.length / 2)));
    if (!L.length && R.length > 1) L.push(...R.splice(Math.ceil(R.length / 2)));
    let ol = frontW / 2 + 40, or = -frontW / 2 - 40;
    L.forEach((x) => { const w = widthOf(x, 5); put(x, 'cavL', ol + w / 2, -5, filesOf(x, 5)); ol += w + 14; });
    R.forEach((x) => { const w = widthOf(x, 5); put(x, 'cavR', or - w / 2, -5, filesOf(x, 5)); or -= w + 14; });
  }
  // ---- généraux en retrait
  const gens = S.armies.filter((a) => a.gen);
  gens.forEach((a, k) => {
    const g = a.gen;
    const T = TYPES[FACTIONS[a.side].gen];
    const [wx, wz] = W(k === 0 ? 0 : (k % 2 ? 1 : -1) * frontW * 0.3, -150 - k * 10);
    out.push({ side: bs, type: FACTIONS[a.side].gen, name: g.short, men: 50, x: wx, zf: wz, th, files: 10, role: 'gen', genOf: a.id, general: { name: g.name, aura: 160 + 40 * g.cmd, bonus: 0.6 + 0.16 * g.cmd } });
    void T;
  });
  if (!gens.length && out.length) {
    // une garnison sans général : un magistrat de la cité
    const [wx, wz] = W(0, -150);
    out.push({ side: bs, type: campSide === ROME ? 'gen_rom' : 'gen_carth', name: 'Magistrat', men: 30, x: wx, zf: wz, th, files: 8, role: 'gen', general: { name: 'Le magistrat de la cité', aura: 160, bonus: 0.6 } });
  }
  // groupes pour les cartes d'unités
  const G = [[['light'], 'Légers'], [['ele'], 'Éléphants'], [['hastati'], 'Hastati'], [['principes'], 'Principes'], [['triarii'], 'Triarii'], [['line1'], 'Ligne'], [['line2'], 'Réserve'], [['cavL'], 'Aile gauche'], [['cavR'], 'Aile droite'], [['gen'], 'Généraux']];
  const groups = G.filter(([rs]) => out.some((u) => rs.includes(u.role)));
  return { units: out, groups };
}

function windFor(seed, winter) {
  const a = (seed * 2.399) % (Math.PI * 2);
  const sp = winter ? 4 + (seed % 5) : 2 + (seed % 4);
  return { x: Math.sin(a), z: Math.cos(a), speed: sp, name: winter ? 'vent d\'hiver' : 'brise', from: '', dustSide: -1 };
}
function hash(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 100003; return h; }
const nf = new Intl.NumberFormat('fr-FR');
const fmt = (n) => nf.format(Math.round(n));

/* --------------------------------------------------------------------- *
 *  Fin de bataille : survivants par unité de campagne
 * --------------------------------------------------------------------- */
export function fieldOutcome(b, bt, sides, retreatSide = -1) {
  let winner;
  if (retreatSide >= 0) winner = 1 - retreatSide;
  else if (b.over) winner = b.winner;
  else {
    const a = b.sideState(0), d = b.sideState(1);
    winner = a.active / a.men0 >= d.active / d.men0 ? 0 : 1;
  }
  const surv = new Map();
  const genDead = [];
  for (const u of b.units) {
    if (u.def.genOf && (u.genState === 2 || u.state === ST.DEAD)) genDead.push(u.def.genOf);
    const cu = u.def.cu;
    if (!cu) continue;
    const won = u.side === winner;
    let n;
    if (u.state === ST.DEAD) n = 0;
    else if (u.state === ST.FLED) n = u.men * (won ? 0.9 : 0.55);
    else if (u.routing) n = u.trapped ? 0 : u.men * (won ? 0.85 : 0.45);
    else n = u.men * (won || retreatSide !== u.side ? 1 : 0.85);
    surv.set(cu, Math.round(n));
  }
  return { winner: sides[winner], surv, genDead };
}
