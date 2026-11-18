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

const QUALITY = {
  low: { pr: 1, shadows: true, shadowMap: 1024, groundTex: 1024, N: 385, trees: 1500, bushes: 1500, rocks: 600, reeds: 1200, grass: 0, treeShadows: false, dust: 700, nearDist: 70, nearCap: 1200, copies: 1, post: false, strawTex: 512, bump: 0.6 },
  medium: { pr: 1.5, shadows: true, shadowMap: 2048, groundTex: 1024, N: 385, trees: 3000, bushes: 4000, rocks: 1500, reeds: 2500, grass: 30000, grassTile: 70, treeShadows: true, dust: 1600, nearDist: 110, nearCap: 1200, copies: 2, post: true, msaa: 0, bloom: false, strawTex: 1024, bump: 1 },
  high: { pr: 2, shadows: true, shadowMap: 4096, groundTex: 1024, N: 769, trees: 5000, bushes: 7000, rocks: 3000, reeds: 4500, grass: 90000, grassTile: 100, treeShadows: true, dust: 2600, nearDist: 150, nearCap: 1500, copies: 4, post: true, msaa: 4, bloom: true, strawTex: 1024, bump: 1 },
  ultra: { pr: 'ultra', shadows: true, shadowMap: 4096, groundTex: 1536, N: 769, trees: 7000, bushes: 10000, rocks: 5000, reeds: 7000, grass: 180000, grassTile: 130, treeShadows: true, rocksShadow: true, dust: 3500, nearDist: 220, nearCap: 2500, copies: 4, post: true, msaa: 4, bloom: true, strawTex: 2048, bump: 1.2 },
};
const mobile = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 700;
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
  cfg: null, worldKey: '', state: 'menu',
};
app.audio = new BattleAudio();
app.cam = new RTSCamera(camera, canvas, null);
app.ui = new UI(app);
app.cam.onTap = (x, y, o) => app.ui.onTap(x, y, o);
app.cam.onBox = (...a) => app.ui.onBox(...a);
app.cam.onDragOrder = (...a) => app.ui.onDragOrder(...a);

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
  const scn = SCENARIOS[cfg.scn];
  const q = QUALITY[cfg.quality];
  const key = cfg.scn + '|' + cfg.quality;
  app.building = true;
  $('loading').hidden = false;
  $('loadmsg').textContent = `${scn.name}, ${scn.date}`;
  await wait(30);
  if (app.worldKey !== key) {
    disposeScene(app.scene);
    app.scene = new THREE.Scene();
    app.terrain = new Terrain(scn.terrain, 7, q.N || 385);
    app.cam.ter = app.terrain;
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
  $('loadmsg').textContent = 'Rassemblement des légions…';
  await wait(20);
  const scale = background ? Math.max(8, cfg.scale) : cfg.scale;
  app.battle = new Battle(scn, app.terrain, { scale, seed: 216 + Math.floor(Math.random() * 1000) });
  app.player = background ? 2 : cfg.side;
  app.cmd = makeCommanders(app.battle, scn.id, app.player);
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
  await build({ ...(app.cfg || app.ui.cfg), scn: id, quality: app.ui.cfg.quality }, true);
  app.state = 'menu';
  app.cam.set(0, 0, 0.7, 0.42, 1500, true);
  app.cam.orbit = 0.04;
};

app.start = async (cfg) => {
  $('menu').hidden = true;
  app.strategy = null;
  app.audio.start();
  await build(cfg, false);
  app.state = 'battle';
  app.ui.startBattle(app);
  const side = cfg.side;
  // vue de départ derrière son armée
  if (side === 1) app.cam.set(0, 380, 0, 0.5, 950, true);
  else app.cam.set(0, -420, Math.PI, 0.5, 950, true);
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
  setTimeout(() => a.horn(app.battle.scn.id === 'cannae' ? 'carnyx' : 'elephant', 0.45), 1700);
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

function frame(now) {
  requestAnimationFrame(frame);
  const rdt = Math.min(0.1, (now - last) / 1000);
  last = now;
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
  $('menu').hidden = false;
  requestAnimationFrame(frame);
  // vérification rapide : un état visible en cas d'erreur de rendu
  window.__app = app; void ST;
})();
