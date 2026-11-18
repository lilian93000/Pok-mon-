/* Point d'entrée : assemble terrain, bataille, IA, rendu, son et interface. */
import * as THREE from 'three';
import { SCENARIOS } from './data.js';
import { Terrain } from './terrain.js';
import { Battle, SIM_DT, ST } from './sim.js';
import { makeCommanders } from './ai.js';
import { World } from './world.js';
import { Figures } from './figures.js';
import { Effects } from './effects.js';
import { RTSCamera } from './camera.js';
import { BattleAudio } from './audio.js';
import { UI } from './ui.js';
import { Post } from './post.js';
import { Campaign } from './campaign.js';
import { CampaignMap, MB } from './campmap.js';
import { CampaignUI, loadSave } from './campui.js';
import { fieldScenario, fieldOutcome, battleSides } from './battlegen.js';

const QUALITY = {
  low: { pr: 1, shadows: true, shadowMap: 1024, groundTex: 1024, N: 385, trees: 1500, bushes: 1500, rocks: 600, reeds: 1200, grass: 0, treeShadows: false, dust: 700, nearDist: 70, nearCap: 1200, copies: 1, post: false, strawTex: 512, bump: 0.6 },
  medium: { pr: 1.5, shadows: true, shadowMap: 2048, groundTex: 1024, N: 385, trees: 3000, bushes: 4000, rocks: 1500, reeds: 2500, grass: 30000, grassTile: 70, treeShadows: true, dust: 1600, nearDist: 110, nearCap: 1200, copies: 2, post: true, msaa: 0, bloom: false, strawTex: 1024, bump: 1 },
  high: { pr: 2, shadows: true, shadowMap: 4096, groundTex: 1024, N: 769, trees: 5000, bushes: 7000, rocks: 3000, reeds: 4500, grass: 90000, grassTile: 100, treeShadows: true, dust: 2600, nearDist: 150, nearCap: 1500, copies: 4, post: true, msaa: 4, bloom: true, strawTex: 1024, bump: 1 },
  ultra: { pr: 'ultra', shadows: true, shadowMap: 4096, groundTex: 1536, N: 769, trees: 7000, bushes: 10000, rocks: 5000, reeds: 7000, grass: 180000, grassTile: 130, treeShadows: true, rocksShadow: true, dust: 3500, nearDist: 220, nearCap: 2500, copies: 4, post: true, msaa: 4, bloom: true, strawTex: 2048, bump: 1.2 },
};
const touch = matchMedia('(pointer: coarse)').matches;
const mobile = touch || Math.min(screen.width, screen.height) < 700;
const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const canvas = $('view');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
} catch (err) {
  $('loadmsg').textContent = "Ce navigateur n'a pas pu démarrer la 3D (WebGL). Essaie un navigateur récent ou un autre appareil.";
  throw err;
}
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.62;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 60000);

const app = {
  canvas, renderer, camera,
  defaultScale: mobile ? 8 : 4,
  defaultQuality: mobile ? 'low' : 'medium',
  speed: 0, lastSpeed: 4, player: 0, deploying: false,
  scene: null, world: null, terrain: null, battle: null, figures: null, effects: null, cmd: [],
  cfg: null, worldKey: '', state: 'menu', touch,
  camp: null, cmap: null, campBattle: null,
};
const BATTLE_LIM = { x0: -6000, x1: 6000, z0: -6000, z1: 6000, dmin: 5, dmax: 5000, pmin: null, pmax: 1.45 };
const MAP_LIM = { x0: MB.x0 + 150, x1: MB.x1 - 150, z0: MB.z0 + 120, z1: MB.z1 - 60, dmin: 160, dmax: 2600, pmin: 0.5, pmax: 1.3 };
app.audio = new BattleAudio();
app.cam = new RTSCamera(camera, canvas, null);
app.ui = new UI(app);
app.cam.onTap = (x, y, o) => app.ui.onTap(x, y, o);
app.cam.onBox = (...a) => app.ui.onBox(...a);
app.cam.onDragOrder = (...a) => app.ui.onDragOrder(...a);
app.cam.onTap = (x, y, o) => (app.state === 'campaign' ? app.campUI.onTap(x, y, o) : app.ui.onTap(x, y, o));
app.cam.canHoldOrder = (x, y) => { if (app.state !== 'battle' || !app.ui.selected().length) return false; const u = app.ui.pick(x, y); return !u || u.side === app.player; };
app.campUI = new CampaignUI(app);

function resize() {
  const q = QUALITY[app.cfg ? app.cfg.quality : app.defaultQuality];
  // Ultra : rendu interne en 4K (3840 px de large), même sur un écran plus petit
  app.maxPr = q.pr === 'ultra' ? Math.max(devicePixelRatio || 1, Math.min(2.5, 3840 / innerWidth)) : Math.min(devicePixelRatio || 1, q.pr);
  app.pr = app.pr ? Math.min(app.pr, app.maxPr) : app.maxPr;
  renderer.setPixelRatio(app.pr);
  renderer.setSize(innerWidth, innerHeight, false);
  if (app.post) app.post.resize();
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

function disposeScene(scene) {
  if (!scene) return;
  scene.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) for (const m of [].concat(o.material)) { for (const k in m) if (m[k] && m[k].isTexture) m[k].dispose(); m.dispose(); }
  });
}

async function build(cfg, background) {
  const scn = cfg.scnObj || SCENARIOS[cfg.scn];
  const q = QUALITY[cfg.quality];
  const key = (scn.terrainKey || scn.id) + '|' + cfg.quality + '|' + (scn.camps ? JSON.stringify(scn.town) : '');
  app.building = true;
  $('loading').hidden = false;
  $('loadmsg').textContent = `${scn.name}, ${scn.date}`;
  await wait(30);
  if (app.worldKey !== key) {
    disposeScene(app.scene);
    app.scene = new THREE.Scene();
    app.terrain = new Terrain(scn.terrain, scn.seed || 7, q.N || 385, { lush: scn.lush || 0 });
    $('loadmsg').textContent = 'Modelage du terrain et des champs…';
    await wait(20);
    app.world = new World(renderer, app.scene, app.terrain, scn, q);
    app.post = q.post ? new Post(renderer, app.scene, camera, q) : null;
    app.pr = 0;
    app.worldKey = key;
    app.staticCount = app.scene.children.length;
  } else {
    // retirer les soldats de la partie précédente, garder le décor
    const keep = app.scene.children.slice(0, app.staticCount);
    for (const o of app.scene.children.slice(app.staticCount)) { if (o.geometry) o.geometry.dispose(); }
    app.scene.children.length = 0;
    for (const o of keep) app.scene.add(o);
    app.world.setTime(scn.startHour, true);
    // effacer le piétinement
    app.world.trData.fill(0); app.world.trTex.needsUpdate = true;
  }
  app.cam.ter = app.terrain;
  $('loadmsg').textContent = scn.field ? 'Déploiement des armées…' : 'Rassemblement des légions…';
  await wait(20);
  const scale = background ? Math.max(8, cfg.scale) : cfg.scale;
  app.battle = new Battle(scn, app.terrain, { scale, seed: 216 + Math.floor(Math.random() * 1000) });
  app.player = background ? 2 : cfg.side;
  app.cmd = makeCommanders(app.battle, scn.id, app.player);
  app.battleMode();
  app.figures = new Figures(app.battle, app.terrain, app.scene, { nearDist: q.nearDist, nearCap: q.nearCap, shadows: q.shadows, copies: q.copies || 1 });
  app.effects = new Effects(app.scene, app.battle, app.terrain, q);
  app.cfg = cfg;
  app.world.setTime(scn.startHour, true);
  resize();
  app.building = false;
  $('loading').hidden = true;
}

app.preview = async (id) => {
  if (app.state !== 'menu' && app.battle) return;
  app.campBattle = null;
  await build({ ...(app.cfg || app.ui.cfg), scn: id, quality: app.ui.cfg.quality }, true);
  app.state = 'menu';
  app.cam.set(0, 0, 0.7, 0.42, 1500, true);
  app.cam.orbit = 0.04;
};

app.start = async (cfg) => {
  $('menu').hidden = true;
  $('endM').hidden = true;
  app.strategy = null;
  app.audio.start();
  if (!cfg.scnObj) { app.campBattle = null; app.campUI.close(); }
  await build(cfg, false);
  app.state = 'battle';
  app.ui.startBattle(app);
  const side = cfg.side;
  // vue de départ derrière son armée
  if (side === 1) app.cam.set(0, 380, 0, 0.5, 950, true);
  else app.cam.set(0, -420, Math.PI, 0.5, 950, true);
  app.checkRotate();
  app.cam.orbit = 0;
  if (side < 2) {
    app.deploying = true;
    app.setSpeed(0);
    app.world.setZone(side);
    $('deploy').hidden = false;
    document.body.classList.add('deploying');
  } else {
    app.deploying = false;
    document.body.classList.remove('deploying');
    $('deploy').hidden = true;
    app.setSpeed(4);
    app.horns();
  }
};
app.engage = () => {
  app.deploying = false;
  app.world.setZone(null);
  document.body.classList.remove('deploying');
  $('deploy').hidden = true;
  app.setSpeed(app.lastSpeed || 4);
  app.horns();
  app.ui.updateCard();
};
app.horns = () => {
  const a = app.audio;
  if (!a.ctx) return;
  a.horn('tuba', 0.5);
  const ele = app.battle.units.some((u) => u.isEle);
  setTimeout(() => a.horn(app.battle.scn.id === 'cannae' || !ele ? 'carnyx' : 'elephant', 0.45), 1700);
};
// applique un plan de bataille : déploiement + consignes pour les officiers
app.applyStrategy = (st) => {
  const b = app.battle, side = app.player;
  app.resetDeploy();
  app.strategy = st;
  if (!st) { app.cmd[side].setPlan(null); return; }
  const P = st.deploy(b.units.filter((u) => u.side === side && u.alive));
  for (const p of P) {
    const u = p.u;
    if (p.lanes !== undefined) u.lanes = p.lanes;
    u.files = p.files; u.dims();
    app.place(u, p.x, p.z, p.th);
  }
  app.cmd[side].setPlan(st.ai);
  for (const p of P) if (p.dir) p.u.ai.dir = p.dir;
};
app.resetDeploy = () => {
  for (const u of app.battle.units) {
    if (u.side !== app.player) continue;
    const d = u.def;
    u.manual = false; u.lanes = !!d.lanes;
    if (u.form !== 'normal') u.setForm('normal');
    u.th = d.th; u.axes(); u.files = Math.max(1, Math.min(d.files, d.men)); u.dims();
    u.reform++;
    app.place(u, d.x - u.fx * u.hd, d.zf - u.fz * u.hd, d.th);
  }
};
app.place = (u, x, z, th) => {
  u.x = x; u.z = z; u.vx = u.vz = 0;
  if (th !== undefined) { u.th = th; u.axes(); }
  u.y = app.terrain.height(x, z);
  u.order = { kind: 'hold' };
  u.reform++;
  app.figures.reconcile(u, u.fg, false);
  app.figures.place(u, u.fg);
};
app.resume = () => { app.setSpeed(app.lastSpeed || 4); };
app.setSpeed = (s) => {
  if (app.deploying && s > 0) { app.ui.toast('Engage la bataille pour lancer le temps.'); s = 0; }
  if (s > 0) app.lastSpeed = s;
  app.speed = s;
  app.ui.setSpeedUI(s);
};

// ------------------------------------------------------------- boucle
let last = performance.now(), acc = 0, stampAcc = 0, sunAcc = 0, audioAcc = 0, perf = 0, perfN = 0;
const audioInfo = { fight: 0, near: 0, march: 0, cav: 0, camH: 500, wind: 1, speed: 0 };
const QUIET = { fight: 0, near: 0, march: 0, cav: 0, camH: 3000, wind: 0.4, speed: 0 };

function frame(now) {
  requestAnimationFrame(frame);
  const rdt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (app.state === 'campaign' && app.cmap) {
    app.cam.update(rdt);
    app.cmap.update(rdt);
    app.campUI.update(rdt);
    app.audio.update(rdt, QUIET);
    renderer.render(app.cmap.scene, camera);
    return;
  }
  const b = app.battle;
  if (!b || app.building) return;
  let gdt = 0;
  if (app.state === 'battle' && app.speed > 0 && !app.deploying) {
    acc += rdt * app.speed;
    let steps = 0;
    while (acc >= SIM_DT && steps < 60) {
      for (const c of app.cmd) c.update(SIM_DT);
      b.step(SIM_DT);
      acc -= SIM_DT; steps++;
    }
    if (steps >= 60) acc = 0;
    gdt = rdt * app.speed;
  }
  const w = app.world;
  sunAcc += gdt;
  if (sunAcc > 20 || app.state === 'menu') { sunAcc = 0; w.setTime(b.scn.startHour + b.t / 3600); }
  app.cam.update(rdt);
  app.figures.shadowBox = w.shadowBox;
  app.figures.update(gdt, camera);
  app.effects.update(gdt, rdt, camera, w, app.ui.sel, app.ui.overlay);
  stampAcc += gdt;
  if (stampAcc > 0.5) { w.stamp(b.units, stampAcc); stampAcc = 0; }
  w.updateShadow(app.cam.target, app.cam.cur.dist);
  w.update(rdt, now / 1000, gdt, b.wind, camera, app.cam.target);
  audioAcc += rdt;
  if (audioAcc > 0.25) { audioAcc = 0; soundScan(); }
  audioInfo.speed = app.speed;
  app.audio.update(rdt, audioInfo);
  app.ui.update(rdt);
  if (app.post) app.post.render(now / 1000); else renderer.render(app.scene, camera);
  // résolution adaptative
  perf += rdt; perfN++;
  if (perfN >= 45) {
    const avg = perf / perfN; perf = 0; perfN = 0;
    let pr = app.pr;
    if (avg > 0.045 && pr > 0.6) pr = Math.max(0.6, pr - 0.15);
    else if (avg < 0.02 && pr < app.maxPr) pr = Math.min(app.maxPr, pr + 0.1);
    if (pr !== app.pr) { app.pr = pr; renderer.setPixelRatio(pr); renderer.setSize(innerWidth, innerHeight, false); if (app.post) app.post.resize(); }
  }
}

function soundScan() {
  const b = app.battle, cp = camera.position;
  const camH = cp.y - app.terrain.height(cp.x, cp.z);
  let fight = 0, nearest = 1e9, march = 0, cav = 0;
  for (const u of b.units) {
    if (!u.alive) continue;
    const d = Math.max(1, Math.hypot(u.x - cp.x, u.z - cp.z, (u.y - cp.y)) - u.rad * 0.5);
    if (u.engaged) { const L = u.eS[0] + u.eS[1] + u.eS[2] + u.eS[3]; fight += L / (1 + d / 250); nearest = Math.min(nearest, d); }
    if (u.speed > 0.5 && d < 600) { march += (u.w / 100) * (1 - d / 600); if (u.isCav) cav += (1 - d / 600) * Math.min(1, u.speed / 6); }
  }
  audioInfo.fight = Math.min(1, fight / 900);
  audioInfo.near = 1 - Math.min(1, Math.max(0, (nearest - 25) / 900));
  audioInfo.march = Math.min(1, march * 0.5);
  audioInfo.cav = Math.min(1, cav);
  audioInfo.camH = camH;
  audioInfo.wind = b.wind.speed / 6;
}

// --------------------------------------------------------- campagne
app.battleMode = () => {
  app.cam.lim = { ...BATTLE_LIM };
  camera.near = 0.5; camera.far = 60000; camera.updateProjectionMatrix();
  renderer.toneMappingExposure = 0.62;
};
app.mapMode = () => {
  app.cam.lim = { ...MAP_LIM };
  app.cam.ter = app.cmap;
  camera.near = 2; camera.far = 14000; camera.updateProjectionMatrix();
  renderer.toneMappingExposure = 0.92;
};
app.hideBattleHud = () => {
  for (const id of ['top', 'bottom', 'mini', 'advice', 'endM']) $(id).hidden = true;
  $('feed').innerHTML = '';
  $('labels').innerHTML = '';
  if (app.ui.labels) app.ui.labels.clear();
  app.ui.sel.clear();
};
app.openCampaign = async (c) => {
  $('menu').hidden = true;
  app.audio.start();
  app.hideBattleHud();
  if (!app.cmap) {
    $('loading').hidden = false;
    $('loadmsg').textContent = 'Tracé de la carte de la Méditerranée…';
    await wait(40);
    app.cmap = new CampaignMap(renderer, { shadows: !mobile, texScale: mobile ? 1.5 : 2 });
    $('loading').hidden = true;
  }
  app.camp = c;
  app.state = 'campaign';
  app.speed = 0;
  app.mapMode();
  if (app.mapCam) app.cam.set(app.mapCam.x, app.mapCam.z, app.mapCam.yaw, app.mapCam.pitch, app.mapCam.dist, true);
  else app.cam.set(0, 0, 0, 0.95, 1300, true);
  app.cam.orbit = 0; app.cam.follow = null; app.cam.rank = null;
  app.campUI.open(c);
  app.checkRotate();
};
app.saveMapCam = () => { const k = app.cam; app.mapCam = { x: k.target.x, z: k.target.z, yaw: k.yaw, pitch: k.pitch, dist: k.dist }; };
app.newCampaign = async (side) => {
  const c = new Campaign(side, (Date.now() % 100000) + 1);
  c.msg('start' + side, side);
  app.mapCam = null;
  app.campUI.focused = false; app.campUI.overShown = false; app.campUI.phase = 'player';
  await app.openCampaign(c);
  app.campUI.save();
  await app.campUI.showMessages();
};
app.continueCampaign = async () => {
  const data = loadSave();
  if (!data) return;
  const c = Campaign.load(data);
  app.mapCam = null;
  app.campUI.focused = false; app.campUI.overShown = false; app.campUI.phase = 'player';
  await app.openCampaign(c);
  // une bataille laissée en suspens (partie quittée pendant un combat)
  for (const p of Object.keys(c.owner)) {
    const mine = c.armies.filter((a) => a.prov === p && a.side === c.player), foe = c.armies.filter((a) => a.prov === p && a.side !== c.player);
    if (mine.length && foe.length) c.pending.push(c.makeBattle(p, mine[0].moved ? mine[0] : foe[0], mine[0].moved ? foe : mine));
  }
  if (c.pending.length) app.campUI.battleFlow(c.pending.shift());
};
app.fieldBattle = async (bt) => {
  const c = app.camp;
  const sides = battleSides(bt);
  const scn = fieldScenario(c, bt);
  app.saveMapCam();
  app.campUI.close();
  app.campBattle = { bt, sides, scn };
  await app.start({ scnObj: scn, side: sides.indexOf(c.player), scale: app.ui.cfg.scale, quality: app.ui.cfg.quality });
};
app.endField = async (retreat) => {
  const cb = app.campBattle; if (!cb) return;
  const out = fieldOutcome(app.battle, cb.bt, cb.sides, retreat ? app.player : -1);
  const res = app.camp.applyBattle(cb.bt, out);
  app.campBattle = null;
  app.setSpeed(0);
  await app.openCampaign(app.camp);
  app.campUI.afterField(res, cb.bt);
};
// les officiers terminent la bataille sans le joueur (calcul accéléré)
app.autoFinish = async () => {
  const b = app.battle, mine = app.cmd[app.player];
  mine.auto = false; mine.setPlan('doc:attack');
  for (const u of b.units) u.manual = false;
  $('loading').hidden = false;
  let guard = 0;
  while (!b.over && b.t < 5 * 3600 && guard++ < 400) {
    $('loadmsg').textContent = `Les officiers mènent la bataille… ${Math.floor(b.t / 60)} min`;
    for (let i = 0; i < 300 && !b.over; i++) { for (const c of app.cmd) c.update(SIM_DT); b.step(SIM_DT); }
    await wait(0);
  }
  for (let i = 0; i < 600; i++) { for (const c of app.cmd) c.update(SIM_DT); b.step(SIM_DT); }
  $('loading').hidden = true;
  app.endField(false);
};
app.showMainMenu = () => {
  if (app.state === 'battle') app.setSpeed(0);
  if (app.state === 'campaign') app.saveMapCam();
  app.ui.showMenu();
};
// écran à la verticale sur téléphone : inviter à tourner
app.checkRotate = () => {
  const portrait = innerHeight > innerWidth;
  $('rotate').hidden = !(touch && portrait && app.state !== 'menu' && !app.rotateSkip);
};
$('rotateSkip').onclick = () => { app.rotateSkip = true; app.checkRotate(); };
addEventListener('resize', () => app.checkRotate());
// plein écran (Android, ordinateurs) avec verrouillage à l'horizontale
const fsOk = !!(document.fullscreenEnabled && document.documentElement.requestFullscreen);
for (const b of document.querySelectorAll('.fsBtn')) {
  b.hidden = !fsOk;
  b.onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else { await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape').catch(() => {}); }
    } catch (e) { /* refusé par le navigateur */ }
  };
}

// ------------------------------------------------------------ démarrage
(async () => {
  resize();
  try {
    await app.preview('cannae');
  } catch (err) {
    console.error(err);
    $('loadmsg').textContent = 'Erreur au chargement : ' + err.message;
    return;
  }
  app.ui.showMenu();
  requestAnimationFrame(frame);
  // vérification rapide : un état visible en cas d'erreur de rendu
  window.__app = app; void ST;
})();
