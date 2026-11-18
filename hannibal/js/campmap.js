/* Carte de campagne en relief : Méditerranée occidentale vers 218 av. J.-C.
   Côtes, montagnes et fleuves tracés à la main (geo.js). Les provinces s'étendent depuis leurs
   villes en suivant le relief (les frontières passent par les crêtes) ; les voies romaines sont
   tracées sur le terrain le long des vallées. Forêts, villes, ports et armées en 3D ;
   mer animée, brume et nuages aux confins du monde connu. */
import * as THREE from 'three';
import { LANDS, RIDGES, RIVERS } from './geo.js';
import { PROVINCES, PROV, WILDS, proj, FACTIONS, LAND_LINKS, SEA_ROUTES } from './campaign.js';
import { makeNoise2D, smoothstep, clamp } from './noise.js';
import {
  tileNoise, cloudTexture, treeGeometry, treeMaterial, galleyGeometry, buildSettlements, emblemTexture, siegeGeometry,
  bannerMaterial, bannerGeometry, armyGeometry, armyMaterial, armyComposition, mulberry,
} from './mapart.js';

export const MB = { x0: -1320, x1: 1420, z0: -1010, z1: 1070 };
const WW = MB.x1 - MB.x0, HH = MB.z1 - MB.z0;
const R = 4; // km par cellule du raster
const VS = 9; // exagération du relief (unités par km d'altitude)
const NX = Math.round(WW / R), NZ = Math.round(HH / R);
const F = 2, FX = NX * F, FZ = NZ * F, FR = R / F; // raster fin des provinces (2 km)
const NP = PROVINCES.length, NW = WILDS.length, UNCLAIMED = NP + NW, NONE = 255;
const AS = 2.6; // échelle des figurines d'armée
const HAZE = '#b8c6cf';
const SUN = new THREE.Vector3(-0.62, 0.68, 0.39).normalize();

// plaines fertiles (lon, lat, demi-axes en degrés, intensité) : greniers de Rome et de Carthage
const PLAINS = [
  [10.0, 45.05, 2.6, 0.45, 0.95], [14.3, 40.98, 0.55, 0.35, 0.95], [15.6, 41.5, 0.6, 0.35, 0.75], [11.0, 43.62, 0.6, 0.3, 0.55],
  [-5.2, 37.5, 1.3, 0.35, 0.85], [-0.8, 41.6, 1.2, 0.3, 0.55], [9.6, 36.62, 0.9, 0.35, 0.95], [10.4, 35.6, 0.5, 0.4, 0.6],
  [4.8, 44.0, 0.3, 0.8, 0.5], [14.5, 37.4, 0.8, 0.4, 0.7], [8.9, 39.5, 0.3, 0.3, 0.6], [12.6, 41.6, 0.5, 0.3, 0.6], [-0.5, 39.4, 0.4, 0.5, 0.6],
];

export class CampaignMap {
  constructor(renderer, opts = {}) {
    this.r = renderer; this.opts = opts;
    this.mobile = !!opts.mobile;
    this.scene = new THREE.Scene();
    this.n = makeNoise2D(41); this.m = makeNoise2D(97);
    this.time = 0;
    this.uTime = { value: 0 }; this.uPulse = { value: 0 }; this.uCloud = { value: new THREE.Vector2() };
    // étapes de construction (durées en ms gardées dans this.timings)
    this.timings = {};
    let t0 = performance.now();
    const step = (name, f) => { f(); const t = performance.now(); this.timings[name] = Math.round(t - t0); t0 = t; };
    step('noise', () => { this.noiseTex = tileNoise(256, 11); });
    step('raster', () => this.buildRaster());
    step('fields', () => this.buildFields());
    step('provinces', () => this.buildProvinces());
    step('mesh', () => this.buildMesh(opts.mesh || 1));
    step('routes', () => this.buildRoutes());
    step('texture', () => this.buildTerrainTexture(opts.texScale || 2));
    step('material', () => { this.buildTerrainMaterial(); this.buildWater(); this.buildSky(); this.buildLights(); });
    step('rivers', () => { this.buildRivers(); this.buildRoads(); });
    step('trees', () => this.buildTrees(opts.trees ?? 1));
    step('cities', () => this.buildCities());
    step('clouds', () => this.buildClouds(opts.clouds ?? 1));
    this.tokens = new Map();
    this.anims = [];
    this.sel = null;
    this.owner = null;
    this.pathGroup = new THREE.Group(); this.scene.add(this.pathGroup);
  }

  // ------------------------------------------------------------ raster
  buildRaster() {
    const cv = document.createElement('canvas'); cv.width = NX; cv.height = NZ;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, NX, NZ);
    ctx.fillStyle = '#fff';
    for (const poly of LANDS) {
      ctx.beginPath();
      poly.forEach(([lon, lat], i) => { const [x, z] = proj(lon, lat); const px = (x - MB.x0) / R, pz = (z - MB.z0) / R; i ? ctx.lineTo(px, pz) : ctx.moveTo(px, pz); });
      ctx.closePath(); ctx.fill();
    }
    const img = ctx.getImageData(0, 0, NX, NZ).data;
    const N = NX * NZ;
    this.land = new Uint8Array(N);
    for (let i = 0; i < N; i++) this.land[i] = img[i * 4] > 127 ? 1 : 0;
    const dl = new Float32Array(N), ds = new Float32Array(N);
    for (let i = 0; i < N; i++) { dl[i] = this.land[i] ? 1e6 : 0; ds[i] = this.land[i] ? 0 : 1e6; }
    for (const d of [dl, ds]) chamfer(d, NX, NZ);
    this.sd = new Float32Array(N); // distance signée à la côte (km) : > 0 à terre
    for (let i = 0; i < N; i++) this.sd[i] = this.land[i] ? (dl[i] / 3) * R : -(ds[i] / 3) * R;
    // relief : plateaux, collines, puis chaînes de montagnes
    this.h = new Float32Array(N);
    const n = this.n, m = this.m;
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const k = j * NX + i, x = MB.x0 + (i + 0.5) * R, z = MB.z0 + (j + 0.5) * R;
      const sd = this.sd[k];
      if (sd > 0) {
        const inland = Math.min(1, sd / 220);
        this.h[k] = (0.06 + 0.33 * inland + 0.22 * Math.max(0, n.fbm(x / 160, z / 160, 4) + 0.2) * (0.4 + inland) + 0.05 * n.fbm(x / 30, z / 30, 2) * smoothstep(0, 30, sd)) * VS;
      } else this.h[k] = -0.4 - Math.min(1, -sd / 120) * 2;
    }
    for (const r of RIDGES) {
      const pts = r.pts.map(([lo, la]) => proj(lo, la));
      const wk = r.w * 100;
      let bx0 = 1e9, bx1 = -1e9, bz0 = 1e9, bz1 = -1e9;
      for (const [x, z] of pts) { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); bz0 = Math.min(bz0, z); bz1 = Math.max(bz1, z); }
      const pad = wk * 2.6;
      const i0 = Math.max(0, Math.floor((bx0 - pad - MB.x0) / R)), i1 = Math.min(NX - 1, Math.ceil((bx1 + pad - MB.x0) / R));
      const j0 = Math.max(0, Math.floor((bz0 - pad - MB.z0) / R)), j1 = Math.min(NZ - 1, Math.ceil((bz1 + pad - MB.z0) / R));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const k = j * NX + i;
        if (this.sd[k] <= 0) continue;
        const x = MB.x0 + (i + 0.5) * R, z = MB.z0 + (j + 0.5) * R;
        let d = 1e9;
        for (let s = 0; s < pts.length - 1; s++) d = Math.min(d, segDist(x, z, pts[s], pts[s + 1]));
        if (pts.length === 1) d = Math.hypot(x - pts[0][0], z - pts[0][1]);
        if (d > pad) continue;
        const rough = 0.55 + 0.75 * m.ridge(x / 70, z / 70, 4);
        const add = r.h * Math.exp(-((d / wk) ** 2)) * rough * VS * smoothstep(0, 25, this.sd[k]);
        if (add > this.h[k] * 0.1) this.h[k] += add;
      }
    }
    // crêtes et vallées dans les montagnes
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const k = j * NX + i; if (this.sd[k] <= 0) continue;
      const hk = this.h[k] / VS, mt = smoothstep(0.55, 1.7, hk);
      if (mt <= 0) continue;
      const x = MB.x0 + (i + 0.5) * R, z = MB.z0 + (j + 0.5) * R;
      this.h[k] = Math.max(0.05 * VS, this.h[k] + VS * 0.5 * mt * (m.ridge(x / 24 + 3, z / 24, 3) - 0.6));
    }
  }
  hAt(x, z) { return bil(this.h, x, z); }
  sdAt(x, z) { return bil(this.sd, x, z); }
  // hauteur exacte du maillage affiché (pour poser villes, arbres, routes, armées)
  meshH(x, z) {
    const gx = this.gx, gz = this.gz;
    const fx = clamp(((x - MB.x0) / WW) * (gx - 1), 0, gx - 1.0001), fz = clamp(((z - MB.z0) / HH) * (gz - 1), 0, gz - 1.0001);
    const i = Math.floor(fx), j = Math.floor(fz), tx = fx - i, tz = fz - j, Y = this.HY;
    const a = Y[j * gx + i], b = Y[j * gx + i + 1], c = Y[(j + 1) * gx + i], e = Y[(j + 1) * gx + i + 1];
    return tx + tz < 1 ? a + (b - a) * tx + (c - a) * tz : e + (c - e) * (1 - tx) + (b - e) * (1 - tz);
  }
  // altitude visible (la mer est plate) : pour la caméra et le placement
  height(x, z) { return Math.max(0.05, this.HY ? this.meshH(x, z) : this.hAt(x, z)); }

  // ------------------------------------------- climat, végétation, cultures
  buildFields() {
    const N = NX * NZ, n = this.n, m = this.m;
    const hk = (this.hk = new Float32Array(N)), slope = (this.slope = new Float32Array(N));
    const dry = (this.dry = new Float32Array(N)), des = (this.des = new Float32Array(N));
    const forest = (this.forest = new Float32Array(N)), con = (this.conifer = new Float32Array(N)), farm = (this.farm = new Float32Array(N));
    for (let k = 0; k < N; k++) hk[k] = this.h[k] / VS;
    for (let j = 1; j < NZ - 1; j++) for (let i = 1; i < NX - 1; i++) {
      const k = j * NX + i;
      slope[k] = Math.hypot(hk[k + 1] - hk[k - 1], hk[k + NX] - hk[k - NX]) / (2 * R);
    }
    // distance aux villes (km)
    const cd = new Float32Array(N).fill(1e6);
    for (const p of PROVINCES) { const [x, z] = proj(p.lon, p.lat); const i = Math.floor((x - MB.x0) / R), j = Math.floor((z - MB.z0) / R); if (i >= 0 && j >= 0 && i < NX && j < NZ) cd[j * NX + i] = 0; }
    chamfer(cd, NX, NZ);
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const k = j * NX + i, sd = this.sd[k];
      if (sd <= 0) continue;
      const x = MB.x0 + (i + 0.5) * R, z = MB.z0 + (j + 0.5) * R;
      const lat = 38.5 - z / 111.2, lon = 5 + x / 87.6;
      const v1 = n.fbm(x / 90, z / 90, 3);
      const south = smoothstep(44.5, 37.0, lat + v1 * 1.3);
      const desert = smoothstep(34.6, 32.2, lat + v1 * 0.9) * (0.7 + 0.3 * smoothstep(-9, -7, lon));
      const box = (a, b, c, d, w) => smoothstep(a - w, a + w, lon + v1 * 0.8) * (1 - smoothstep(b - w, b + w, lon + v1 * 0.8)) * smoothstep(c - w, c + w, lat + v1 * 0.6) * (1 - smoothstep(d - w, d + w, lat + v1 * 0.6));
      const meseta = box(-6.8, 0.4, 37.6, 42.4, 0.9) * smoothstep(0, 90, sd) * 0.55;
      const afr = smoothstep(36.5, 35.0, lat + v1 * 0.5) * (0.5 + 0.5 * smoothstep(-4, -2, lon));
      dry[k] = clamp(south * 0.72 + meseta + afr * 0.45 + desert, 0, 1);
      des[k] = desert;
      const fn = m.fbm(x / 48 + 7, z / 48, 4);
      const cityK = 1 - smoothstep(16, 64, (cd[k] / 3) * R + 22 * fn);
      let plain = 0;
      for (const [plo, pla, rx, rz, kk] of PLAINS) { const d = ((lon - plo) / rx) ** 2 + ((lat - pla) / rz) ** 2; if (d < 1) plain = Math.max(plain, kk * (1 - d * d)); }
      let fa = Math.max(cityK * 0.85, plain) * (1 - smoothstep(0.5, 1.05, hk[k])) * (1 - desert) * smoothstep(2, 7, sd) * (1 - smoothstep(0.05, 0.12, slope[k]));
      fa *= clamp(0.65 + 0.7 * (n.fbm(x / 25 + 3, z / 25, 2) + 0.2), 0, 1.2);
      farm[k] = clamp(fa, 0, 1);
      const fo = smoothstep(-0.08, 0.32, fn + 0.25 * (1 - dry[k]) - 0.12) * (1 - desert) * (1 - 0.5 * dry[k]) * (1 - smoothstep(2.1, 2.7, hk[k])) * smoothstep(1, 10, sd);
      forest[k] = clamp(fo * (1 - farm[k] * 0.95), 0, 1);
      con[k] = clamp(smoothstep(1.0, 1.7, hk[k] + 0.4 * v1) + smoothstep(46.0, 47.6, lat) * 0.55, 0, 1);
    }
  }

  // -------------------------------------------------------- provinces
  buildProvinces() {
    const N = NX * NZ, land = this.land;
    // coût de passage : les pentes freinent, les frontières suivent les crêtes
    const cost = new Float32Array(N);
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const k = j * NX + i;
      cost[k] = land[k] ? 1 + 34 * this.slope[k] + 0.35 * (this.n(i / 7.5, j / 7.5) + 1) : 1e9;
    }
    const lab = (this.pid = new Int16Array(N).fill(-1));
    const dist = new Float64Array(N).fill(1e30);
    const heap = new Heap();
    const seed = (lon, lat, v) => {
      const [x, z] = proj(lon, lat);
      let i = Math.round((x - MB.x0) / R), j = Math.round((z - MB.z0) / R);
      if (!land[j * NX + i]) {
        let best = null, bd = 1e9;
        for (let dj = -8; dj <= 8; dj++) for (let di = -8; di <= 8; di++) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= NX || jj >= NZ) continue; if (land[jj * NX + ii] && di * di + dj * dj < bd) { bd = di * di + dj * dj; best = [ii, jj]; } }
        if (!best) return; [i, j] = best;
      }
      const k = j * NX + i;
      if (dist[k] > 0) { dist[k] = 0; lab[k] = v; heap.push(0, k); }
    };
    PROVINCES.forEach((p, v) => { seed(p.lon, p.lat, v); for (const [lo, la] of p.seeds || []) seed(lo, la, v); });
    WILDS.forEach((w, v) => { for (const [lo, la] of w.seeds) seed(lo, la, NP + v); });
    const nb = [1, -1, NX, -NX, NX + 1, NX - 1, -NX + 1, -NX - 1], nl = [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2];
    while (heap.size) {
      const d = heap.topKey(), k = heap.pop();
      if (d > dist[k]) continue;
      const i = k % NX;
      for (let t = 0; t < 8; t++) {
        const kk = k + nb[t];
        if (kk < 0 || kk >= N || !land[kk]) continue;
        if (Math.abs((kk % NX) - i) > 1) continue;
        const nd = d + (cost[k] + cost[kk]) * 0.5 * nl[t];
        if (nd < dist[kk]) { dist[kk] = nd; lab[kk] = lab[k]; heap.push(nd, kk); }
      }
    }
    // raster fin : majorité lissée sur le voisinage (frontières arrondies)
    const FN = FX * FZ;
    const flab = (this.flab = new Uint8Array(FN).fill(NONE));
    const fland = (this.fland = new Uint8Array(FN));
    const acc = new Float32Array(64);
    for (let fj = 0; fj < FZ; fj++) for (let fi = 0; fi < FX; fi++) {
      const x = MB.x0 + (fi + 0.5) * FR, z = MB.z0 + (fj + 0.5) * FR;
      const fk = fj * FX + fi;
      if (this.sdAt(x, z) <= 0) continue;
      fland[fk] = 1;
      const cx = (x - MB.x0) / R - 0.5, cz = (z - MB.z0) / R - 0.5;
      const ci = Math.round(cx), cj = Math.round(cz);
      let first = -2, same = true;
      for (let dj = -1; dj <= 1 && same; dj++) for (let di = -1; di <= 1; di++) {
        const ii = clamp(ci + di, 0, NX - 1), jj = clamp(cj + dj, 0, NZ - 1), v = lab[jj * NX + ii];
        if (first === -2) first = v; else if (v !== first) { same = false; break; }
      }
      if (same && first >= 0) { flab[fk] = first; continue; }
      acc.fill(0);
      let best = -1, bw = 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const ii = clamp(ci + di, 0, NX - 1), jj = clamp(cj + dj, 0, NZ - 1), v = lab[jj * NX + ii];
        if (v < 0) continue;
        const ddx = ii - cx, ddz = jj - cz;
        const w = Math.exp(-(ddx * ddx + ddz * ddz) / (2 * 0.8 * 0.8));
        acc[v] += w;
        if (acc[v] > bw) { bw = acc[v]; best = v; }
      }
      flab[fk] = best >= 0 ? best : UNCLAIMED;
    }
    // étiquettes prolongées en mer (pour que les lignes ne longent pas les côtes)
    const flabD = (this.flabD = flab.slice());
    let front = [];
    for (let k = 0; k < FN; k++) if (flab[k] !== NONE) front.push(k);
    for (let step = 0; step < 4; step++) {
      const nf = [];
      for (const k of front) {
        const i = k % FX;
        for (const kk of [k + 1, k - 1, k + FX, k - FX]) {
          if (kk < 0 || kk >= FN || flabD[kk] !== NONE) continue;
          if (Math.abs((kk % FX) - i) > 1) continue;
          flabD[kk] = flabD[k]; nf.push(kk);
        }
      }
      front = nf;
    }
    // coloriage des régions en 4 classes (voisines différentes) pour tracer les frontières
    const NL = UNCLAIMED + 1, adj = Array.from({ length: NL }, () => new Set());
    for (let fj = 0; fj < FZ; fj++) for (let fi = 0; fi < FX - 1; fi++) {
      const k = fj * FX + fi, a = flab[k];
      if (a === NONE) continue;
      const b = flab[k + 1], c = fj < FZ - 1 ? flab[k + FX] : NONE;
      if (b !== NONE && b !== a) { adj[a].add(b); adj[b].add(a); }
      if (c !== NONE && c !== a) { adj[a].add(c); adj[c].add(a); }
    }
    this.regAdj = adj;
    const cls = new Int8Array(NL).fill(-1);
    const order = [...Array(NL).keys()].sort((a, b) => adj[b].size - adj[a].size);
    for (const v of order) {
      const used = [0, 0, 0, 0];
      for (const w of adj[v]) if (cls[w] >= 0) used[cls[w]]++;
      let best = 0; for (let c = 1; c < 4; c++) if (used[c] < used[best]) best = c;
      cls[v] = best;
    }
    const pind = new Uint8Array(FN * 4);
    for (let k = 0; k < FN; k++) { const v = flabD[k]; if (v !== NONE) pind[k * 4 + cls[v]] = 255; }
    this.tPInd = dataTex(pind, FX, FZ, THREE.RGBAFormat, true);
    // distance aux limites de province, terre, cultures
    const dP = new Float32Array(FN);
    for (let fj = 0; fj < FZ; fj++) for (let fi = 0; fi < FX; fi++) {
      const k = fj * FX + fi, a = flab[k];
      let edge = false;
      if (a !== NONE) for (const kk of [fi < FX - 1 ? k + 1 : -1, fi > 0 ? k - 1 : -1, k + FX, k - FX]) { if (kk < 0 || kk >= FN) continue; const b = flab[kk]; if (b !== NONE && b !== a) { edge = true; break; } }
      dP[k] = edge ? 0 : 1e6;
    }
    chamfer(dP, FX, FZ);
    const dist4 = (this.dist4 = new Uint8Array(FN * 4));
    for (let fj = 0; fj < FZ; fj++) for (let fi = 0; fi < FX; fi++) {
      const k = fj * FX + fi;
      const x = MB.x0 + (fi + 0.5) * FR, z = MB.z0 + (fj + 0.5) * FR;
      dist4[k * 4] = Math.min(255, (dP[k] / 3 + 0.5) * 32);
      dist4[k * 4 + 1] = 255;
      dist4[k * 4 + 2] = clamp(128 + this.sdAt(x, z) * 24, 0, 255);
      dist4[k * 4 + 3] = clamp(bil(this.farm, x, z) * 255, 0, 255);
    }
    this.tDist = dataTex(dist4, FX, FZ, THREE.RGBAFormat, true);
    this.tLabel = dataTex(flab, FX, FZ, THREE.RedFormat, false);
    this.fInd = new Uint8Array(FN * 4);
    this.tFInd = dataTex(this.fInd, FX, FZ, THREE.RGBAFormat, true);
    this.pdata = new Uint8Array(64 * 3 * 4);
    this.tPD = dataTex(this.pdata, 64, 3, THREE.RGBAFormat, false);
    // positions des villes
    this.pIndex = PROVINCES.map((p) => p.id);
    this.cityPos = {};
    for (const p of PROVINCES) { const [x, z] = proj(p.lon, p.lat); this.cityPos[p.id] = new THREE.Vector3(x, this.hAt(x, z), z); }
  }
  provinceAt(x, z) {
    const i = Math.floor((x - MB.x0) / FR), j = Math.floor((z - MB.z0) / FR);
    if (i < 0 || j < 0 || i >= FX || j >= FZ) return null;
    const v = this.flab[j * FX + i];
    return v < NP ? this.pIndex[v] : null;
  }
  cityR(p) { return 6 + p.walls * 3.4 + (p.id === 'roma' || p.id === 'carthago' ? 1.5 : 0); }

  // ------------------------------------------------------------ maillage
  buildMesh(st) {
    const gx = (this.gx = Math.floor(NX / st) + 1), gz = (this.gz = Math.floor(NZ / st) + 1);
    const pos = new Float32Array(gx * gz * 3), uv = new Float32Array(gx * gz * 2);
    this.HY = new Float32Array(gx * gz);
    for (let j = 0; j < gz; j++) for (let i = 0; i < gx; i++) {
      const x = MB.x0 + (i / (gx - 1)) * WW, z = MB.z0 + (j / (gz - 1)) * HH;
      const k = j * gx + i, y = Math.max(-1.2, this.hAt(x, z));
      pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z;
      this.HY[k] = y;
      uv[k * 2] = i / (gx - 1); uv[k * 2 + 1] = 1 - j / (gz - 1);
    }
    const idx = new Uint32Array((gx - 1) * (gz - 1) * 6);
    let o = 0;
    for (let j = 0; j < gz - 1; j++) for (let i = 0; i < gx - 1; i++) {
      const a = j * gx + i, b = a + 1, c = a + gx, e = c + 1;
      idx[o++] = a; idx[o++] = c; idx[o++] = b; idx[o++] = b; idx[o++] = c; idx[o++] = e;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeVertexNormals();
    this.groundGeo = g;
    for (const p of PROVINCES) { const c = this.cityPos[p.id]; c.y = this.height(c.x, c.z); }
  }

  // ------------------------------------------------ voies romaines et routes de mer
  buildRoutes() {
    const N = NX * NZ;
    const rc = new Float32Array(N), sc = new Float32Array(N);
    for (let k = 0; k < N; k++) {
      if (this.land[k]) { rc[k] = 1 + 28 * this.slope[k] + 1.6 * smoothstep(1.1, 2.2, this.hk[k]) + 0.4 * this.forest[k]; sc[k] = 1e9; }
      else { rc[k] = 32; sc[k] = 1 + 2.5 * (1 - smoothstep(4, 18, -this.sd[k])); }
    }
    const cell = (x, z) => [clamp(Math.floor((x - MB.x0) / R), 0, NX - 1), clamp(Math.floor((z - MB.z0) / R), 0, NZ - 1)];
    const toPts = (path) => path.map((k) => [MB.x0 + ((k % NX) + 0.5) * R, MB.z0 + (Math.floor(k / NX) + 0.5) * R]);
    this.roads = {}; this.lanes = {}; this.gates = {};
    this.roadMask = new Uint8Array(N);
    for (const [a, b] of LAND_LINKS) {
      const A = this.cityPos[a], B = this.cityPos[b];
      const ca = cell(A.x, A.z), cb = cell(B.x, B.z);
      const path = astar(rc, ca, cb);
      let pts = path ? toPts(path) : [[A.x, A.z], [B.x, B.z]];
      pts[0] = [A.x, A.z]; pts[pts.length - 1] = [B.x, B.z];
      pts = resample(chaikin(simplify(pts), 3), 1.6);
      pts = this.straightenEnds(pts, a, b);
      this.roads[a + '|' + b] = pts; this.roads[b + '|' + a] = pts.slice().reverse();
      if (path) for (const k of path) this.roadMask[k] = 1;
      for (const [pid, end] of [[a, 0], [b, 1]]) {
        const C = this.cityPos[pid], Rr = this.cityR(PROV[pid]);
        const seq = end ? pts.slice().reverse() : pts;
        const q = seq.find((p) => Math.hypot(p[0] - C.x, p[1] - C.z) > Rr * 1.05) || seq[seq.length - 1];
        (this.gates[pid] = this.gates[pid] || []).push(Math.atan2(q[1] - C.z, q[0] - C.x));
      }
    }
    // ports : la case de mer la plus proche de chaque ville portuaire
    this.ports = {};
    for (const p of PROVINCES) {
      if (!p.port) continue;
      const C = this.cityPos[p.id], [ci, cj] = cell(C.x, C.z);
      let best = null, bd = 1e9;
      for (let dj = -12; dj <= 12; dj++) for (let di = -12; di <= 12; di++) {
        const i = ci + di, j = cj + dj; if (i < 0 || j < 0 || i >= NX || j >= NZ) continue;
        const k = j * NX + i; if (this.sd[k] > -2.5) continue;
        const d = di * di + dj * dj; if (d < bd) { bd = d; best = [i, j]; }
      }
      if (best) this.ports[p.id] = best;
    }
    for (const [a, b] of SEA_ROUTES) {
      const pa = this.ports[a], pb = this.ports[b]; if (!pa || !pb) continue;
      const path = astar(sc, pa, pb);
      const A = this.cityPos[a], B = this.cityPos[b];
      let pts = path ? toPts(path) : [];
      pts = resample(chaikin(simplify([[A.x, A.z], ...pts, [B.x, B.z]]), 3), 3);
      this.lanes[a + '|' + b] = pts; this.lanes[b + '|' + a] = pts.slice().reverse();
    }
  }
  // dans la ville, la voie file droit jusqu'au forum
  straightenEnds(pts, a, b) {
    const fix = (seq, pid) => {
      const C = this.cityPos[pid], Rr = this.cityR(PROV[pid]) * 1.1;
      let i = 0; while (i < seq.length - 1 && Math.hypot(seq[i][0] - C.x, seq[i][1] - C.z) < Rr) i++;
      const q = seq[i], out = [];
      const L = Math.hypot(q[0] - C.x, q[1] - C.z), n = Math.max(1, Math.ceil(L / 1.6));
      for (let s = 0; s < n; s++) out.push([C.x + ((q[0] - C.x) * s) / n, C.z + ((q[1] - C.z) * s) / n]);
      return out.concat(seq.slice(i));
    };
    let p = fix(pts, a);
    p = fix(p.reverse(), b).reverse();
    return p;
  }
  seaDir(pid) {
    const C = this.cityPos[pid];
    let best = null, bd = 1e9;
    for (let a = 0; a < 32; a++) {
      const ang = (a / 32) * Math.PI * 2;
      let s = 0;
      for (const r of [8, 14, 22]) s += this.sdAt(C.x + Math.cos(ang) * r, C.z + Math.sin(ang) * r);
      if (s < bd) { bd = s; best = ang; }
    }
    return bd < 0 ? best : null;
  }
  // tracé d'un trajet entre deux provinces (par la route ou par la mer)
  routePts(a, b, sea) {
    const r = sea ? this.lanes[a + '|' + b] : this.roads[a + '|' + b];
    if (r) return r.map((p) => p.slice());
    const A = this.cityPos[a], B = this.cityPos[b];
    return resample([[A.x, A.z], [B.x, B.z]], 3);
  }

  // ---------------------------------------------------------- texture
  buildTerrainTexture(S) {
    const W = Math.round(NX * S), H = Math.round(NZ * S);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(W, H), d = img.data;
    const nd = this.noiseTex.image.data, NS = this.noiseTex.image.width;
    const nz = (x, z, sc, ch) => {
      const u = (x / sc) * NS, v = (z / sc) * NS;
      const i = Math.floor(u), j = Math.floor(v), tx = u - i, tz = v - j;
      const i0 = ((i % NS) + NS) % NS, j0 = ((j % NS) + NS) % NS, i1 = (i0 + 1) % NS, j1 = (j0 + 1) % NS;
      const a = nd[(j0 * NS + i0) * 4 + ch], b = nd[(j0 * NS + i1) * 4 + ch], c = nd[(j1 * NS + i0) * 4 + ch], e = nd[(j1 * NS + i1) * 4 + ch];
      return ((a + (b - a) * tx) * (1 - tz) + (c + (e - c) * tx) * tz) / 255;
    };
    const winter = this.opts.winter ? 0.5 : 0;
    const L = SUN;
    let k = 0, tx = 0, tz = 0;
    const B = (a) => (a[k] * (1 - tx) + a[k + 1] * tx) * (1 - tz) + (a[k + NX] * (1 - tx) + a[k + NX + 1] * tx) * tz;
    for (let py = 0; py < H; py++) {
      const z = MB.z0 + ((py + 0.5) / H) * HH, lat = 38.5 - z / 111.2;
      const snowLine = 2.0 + 0.09 * (46 - lat) - winter;
      for (let px = 0; px < W; px++) {
        const x = MB.x0 + ((px + 0.5) / W) * WW;
        const fx = (x - MB.x0) / R - 0.5, fz = (z - MB.z0) / R - 0.5;
        const i = clamp(Math.floor(fx), 0, NX - 2), j = clamp(Math.floor(fz), 0, NZ - 2);
        tx = clamp(fx - i, 0, 1); tz = clamp(fz - j, 0, 1); k = j * NX + i;
        const sd = B(this.sd);
        const nA = nz(x, z, 37, 0), nB = nz(x, z, 9, 1);
        let c0, c1, c2;
        if (sd < 0) {
          const t = smoothstep(0, 60, -sd);
          c0 = 0.27 + (0.10 - 0.27) * t; c1 = 0.56 + (0.27 - 0.56) * t; c2 = 0.58 + (0.43 - 0.58) * t;
          const t2 = smoothstep(50, 230, -sd);
          c0 += (0.06 - c0) * t2; c1 += (0.17 - c1) * t2; c2 += (0.32 - c2) * t2;
          const v = 1 + (nA - 0.5) * 0.08; c0 *= v; c1 *= v; c2 *= v;
          if (sd > -3) { const s = 0.5 * (1 + sd / 3); c0 += (0.72 - c0) * s; c1 += (0.70 - c1) * s; c2 += (0.56 - c2) * s; }
        } else {
          const hk = B(this.hk), dry = B(this.dry), des = B(this.des), fo = B(this.forest), cn = B(this.conifer), fa = B(this.farm), sl = B(this.slope);
          // prairies et garrigues selon l'aridité
          if (dry < 0.5) { const t = dry * 2; c0 = 0.30 + 0.20 * t; c1 = 0.42 + 0.08 * t; c2 = 0.17 + 0.12 * t; }
          else { const t = (dry - 0.5) * 2; c0 = 0.50 + 0.19 * t; c1 = 0.50 + 0.08 * t; c2 = 0.29 + 0.08 * t; }
          const pv = (nA - 0.5) * 0.9; c0 *= 1 + 0.10 * pv; c1 *= 1 + 0.06 * pv; c2 *= 1 - 0.08 * pv;
          // désert : sable, regs et dunes
          if (des > 0) { const r = nB * 0.8; const s0 = 0.86 - 0.1 * r, s1 = 0.71 - 0.16 * r, s2 = 0.48 - 0.12 * r; c0 += (s0 - c0) * des; c1 += (s1 - c1) * des; c2 += (s2 - c2) * des; }
          // terres cultivées (le dessin des champs est fait par le shader)
          if (fa > 0) { const t = fa * 0.4; c0 += (0.6 - c0) * t; c1 += (0.57 - c1) * t; c2 += (0.32 - c2) * t; }
          // forêts : feuillus, chênes verts, conifères
          if (fo > 0) {
            let f0 = 0.20 + 0.13 * dry, f1 = 0.30 + 0.07 * dry, f2 = 0.13 + 0.07 * dry;
            f0 += (0.15 - f0) * cn; f1 += (0.24 - f1) * cn; f2 += (0.14 - f2) * cn;
            const t = fo * (0.75 + 0.25 * nB);
            c0 += (f0 - c0) * t; c1 += (f1 - c1) * t; c2 += (f2 - c2) * t;
          }
          // roche puis neige
          const rk = clamp(smoothstep(1.25, 2.3, hk + (nB - 0.5) * 0.5) * 0.9 + smoothstep(0.1, 0.24, sl) * 0.5, 0, 1);
          if (rk > 0) { const hi = smoothstep(1.6, 2.6, hk); const r0 = 0.50 + 0.12 * hi, r1 = 0.46 + 0.14 * hi, r2 = 0.40 + 0.17 * hi; c0 += (r0 - c0) * rk; c1 += (r1 - c1) * rk; c2 += (r2 - c2) * rk; }
          const sn = smoothstep(snowLine, snowLine + 0.45, hk + (nB - 0.5) * 0.6);
          if (sn > 0) { c0 += (0.94 - c0) * sn; c1 += (0.95 - c1) * sn; c2 += (0.97 - c2) * sn; }
          // plages
          const be = (1 - smoothstep(0.6, 3.0, sd)) * (1 - rk * 0.6);
          c0 += (0.84 - c0) * be; c1 += (0.78 - c1) * be; c2 += (0.60 - c2) * be;
          // ombrage gravé (même soleil que la lumière)
          const e = 3, hx = (this.hAt(x + e, z) - this.hAt(x - e, z)) / (2 * e), hz = (this.hAt(x, z + e) - this.hAt(x, z - e)) / (2 * e);
          const nl = Math.hypot(hx, 1, hz);
          const sh = (-hx * L.x + L.y - hz * L.z) / nl;
          const f = clamp(0.62 + 0.5 * sh, 0.5, 1.15);
          c0 *= f; c1 *= f; c2 *= f;
        }
        const o = (py * W + px) * 4;
        d[o] = clamp(c0 * 255, 0, 255); d[o + 1] = clamp(c1 * 255, 0, 255); d[o + 2] = clamp(c2 * 255, 0, 255); d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.flipY = true;
    this.baseTex = tex;
  }
  buildTerrainMaterial() {
    const mat = new THREE.MeshStandardMaterial({ map: this.baseTex, roughness: 0.93, metalness: 0 });
    const U = {
      tLabel: { value: this.tLabel }, tPD: { value: this.tPD }, tDist: { value: this.tDist }, tPInd: { value: this.tPInd }, tFInd: { value: this.tFInd },
      tNoise: { value: this.noiseTex }, uB: { value: new THREE.Vector4(MB.x0, MB.z0, WW, HH) }, uFS: { value: new THREE.Vector2(FX, FZ) },
      uTime: this.uTime, uPulse: this.uPulse, uCloud: this.uCloud, uHaze: { value: new THREE.Color(HAZE) }, uBump: { value: this.mobile ? 0.6 : 1 },
    };
    this.terrainU = U;
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vW;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec3 vW;
          uniform sampler2D tLabel, tPD, tDist, tPInd, tFInd, tNoise;
          uniform vec4 uB; uniform vec2 uFS; uniform float uTime, uPulse, uBump; uniform vec2 uCloud; uniform vec3 uHaze;
          float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          vec3 bumpN(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection) {
            vec3 vSigmaX = normalize(dFdx(surf_pos)); vec3 vSigmaY = normalize(dFdy(surf_pos));
            vec3 R1 = cross(vSigmaY, surf_norm); vec3 R2 = cross(surf_norm, vSigmaX);
            float fDet = dot(vSigmaX, R1) * faceDirection;
            vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
            return normalize(abs(fDet) * surf_norm - vGrad);
          }`)
        .replace('#include <map_fragment>', `#include <map_fragment>
          vec2 wuv = (vW.xz - uB.xy) / uB.zw;
          float camD = length(cameraPosition - vW);
          vec3 col = diffuseColor.rgb;
          vec4 dsx = texture2D(tDist, wuv);
          float landK = smoothstep(0.49, 0.53, dsx.b);
          vec4 n1 = texture2D(tNoise, vW.xz / 41.0);
          vec4 n2 = texture2D(tNoise, vW.xz / 5.7);
          float nearK = 1.0 - smoothstep(160.0, 950.0, camD);
          col *= mix(1.0, 0.84 + 0.32 * n2.r, nearK * landK) * (0.95 + 0.1 * n1.g);
          // champs cultivés : parcelles, haies, chemins
          float farm = dsx.a * landK;
          if (farm > 0.01) {
            vec2 q = vW.xz + (n1.rg - 0.5) * 7.0;
            q = mat2(0.94, -0.34, 0.34, 0.94) * q;
            vec2 cq = q / vec2(2.3, 1.5); vec2 cell = floor(cq); vec2 fq = fract(cq);
            float hs = h21(cell);
            if (hs > 0.62) { cq = q / vec2(1.15, 0.75); cell = floor(cq) + 31.0; fq = fract(cq); hs = h21(cell); }
            vec3 fc = hs < 0.28 ? vec3(1.32, 1.17, 0.78) : hs < 0.5 ? vec3(0.84, 1.1, 0.76) : hs < 0.68 ? vec3(0.88, 0.72, 0.58) : hs < 0.84 ? vec3(1.15, 1.1, 0.86) : vec3(0.74, 0.88, 0.66);
            float ed = min(min(fq.x, 1.0 - fq.x), min(fq.y, 1.0 - fq.y));
            float hedge = 1.0 - smoothstep(0.02, 0.07, ed);
            float fade = 1.0 - smoothstep(0.07, 0.28, fwidth(cq.x));
            col = mix(col, col * fc * (1.0 - 0.45 * hedge), farm * fade);
          }
          // ombre des nuages
          float cs = texture2D(tNoise, (vW.xz + uCloud) / 610.0).a;
          col *= 1.0 - 0.24 * smoothstep(0.55, 0.8, cs);
          // provinces : teinte, lisière des maîtres, frontières, surbrillance
          if (landK > 0.01) {
            vec2 fp = wuv * uFS - 0.5; vec2 f0 = floor(fp); vec2 fw = fp - f0;
            vec3 fill = vec3(0.0), hcol = vec3(0.0); float isP = 0.0, hA = 0.0, selA = 0.0, ws = 0.0;
            for (int k = 0; k < 4; k++) {
              vec2 o = vec2(float(k - (k / 2) * 2), float(k / 2));
              float w = (o.x > 0.5 ? fw.x : 1.0 - fw.x) * (o.y > 0.5 ? fw.y : 1.0 - fw.y);
              float lb = floor(texture2D(tLabel, (f0 + o + 0.5) / uFS).r * 255.0 + 0.5);
              if (lb > 254.5) continue;
              float u = (lb + 0.5) / 64.0;
              vec4 r0 = texture2D(tPD, vec2(u, 0.5 / 3.0)), r1 = texture2D(tPD, vec2(u, 1.5 / 3.0)), r2 = texture2D(tPD, vec2(u, 2.5 / 3.0));
              fill += r0.rgb * w; hcol += r1.rgb * w; hA += r1.a * w; isP += r2.r * w; selA += r2.g * w; ws += w;
            }
            if (ws > 0.001) { fill /= ws; hcol /= ws; hA /= ws; isP /= ws; selA /= ws; }
            float dP = dsx.r * 255.0 / 32.0 - 0.5, dF = dsx.g * 255.0 / 12.0 - 0.5;
            vec4 pi = texture2D(tPInd, wuv), fi = texture2D(tFInd, wuv);
            float pm = max(max(pi.r, pi.g), max(pi.b, pi.a)), fm = max(max(fi.r, fi.g), max(fi.b, fi.a));
            float pw = fwidth(pm), fw2 = fwidth(fm);
            float pwc = min(pw, 0.2), fwc = min(fw2, 0.2);
            float pline = 1.0 - smoothstep(0.5 + 0.7 * pwc, 0.5 + 1.7 * pwc, pm);
            float fcore = 1.0 - smoothstep(0.5 + 0.5 * fwc, 0.5 + 1.2 * fwc, fm);
            float fline = 1.0 - smoothstep(0.5 + 1.6 * fwc, 0.5 + 3.2 * fwc, fm);
            if (fw2 > 0.2) fline = max(fline, 1.0 - smoothstep(0.3, 1.1, dF));
            if (pw > 0.2) pline = max(pline, (1.0 - smoothstep(0.15, 0.8, dP)) * 0.85);
            vec3 base = col;
            float band = exp(-max(dF, 0.0) * 0.16) * isP;
            col = mix(col, fill, isP * 0.1 + band * 0.45);
            col = mix(col, vec3(0.04, 0.035, 0.03), pline * 0.78 * (1.0 - fline));
            col = mix(col, fill * 1.35 + 0.05, fline * 0.95);
            col = mix(col, vec3(0.97, 0.9, 0.72), fcore * 0.8);
            float gl = exp(-max(dP, 0.0) * 0.5);
            col = mix(col, hcol, hA * (0.14 + 0.6 * gl * (0.7 + 0.3 * uPulse)));
            col = mix(col, vec3(1.0, 0.9, 0.62), selA * (0.06 + 0.45 * gl));
            col = mix(base, col, landK);
          }
          // brume aux confins de la carte
          float ex = min(vW.x - uB.x, uB.x + uB.z - vW.x), ez = min(vW.z - uB.y, uB.y + uB.w - vW.z);
          float hazeK = (1.0 - smoothstep(10.0, 230.0, min(ex, ez))) * 0.97;
          diffuseColor.rgb = col;
          float bumpH = (n2.b * 0.65 + texture2D(tNoise, vW.xz / 1.9).r * 0.35) * nearK * landK;`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
          normal = bumpN(-vViewPosition, normal, vec2(dFdx(bumpH), dFdy(bumpH)) * 1.6 * uBump, faceDirection);`)
        .replace('#include <tonemapping_fragment>', `gl_FragColor.rgb = mix(gl_FragColor.rgb, uHaze, hazeK);
          #include <tonemapping_fragment>`);
    };
    mat.customProgramCacheKey = () => 'campTerrain';
    this.ground = new THREE.Mesh(this.groundGeo, mat);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    // au-delà de la carte : la brume
    const outer = new THREE.Mesh(new THREE.PlaneGeometry(40000, 40000), new THREE.MeshBasicMaterial({ color: HAZE }));
    outer.rotation.x = -Math.PI / 2; outer.position.y = -3;
    this.scene.add(outer);
  }

  // ------------------------------------------------------------ mer
  buildWater() {
    const g = new THREE.PlaneGeometry(WW + 600, HH + 600, 1, 1);
    g.rotateX(-Math.PI / 2);
    g.translate((MB.x0 + MB.x1) / 2, 0, (MB.z0 + MB.z1) / 2);
    this.uSun = { value: SUN.clone() };
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, fog: true,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
        uSky: { value: new THREE.Color('#b9d2e2') }, uHaze: { value: new THREE.Color(HAZE) }, uB: { value: new THREE.Vector4(MB.x0, MB.z0, WW, HH) },
      }]),
      vertexShader: `#include <common>
        #include <fog_pars_vertex>
        varying vec3 vW;
        void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
      fragmentShader: `#include <common>
        #include <fog_pars_fragment>
        uniform float uTime; uniform vec3 uSun; uniform vec3 uSky; uniform vec3 uHaze; uniform sampler2D tDist; uniform sampler2D tNoise; uniform vec4 uB;
        varying vec3 vW;
        void main(){
          vec2 uv = (vW.xz - uB.xy) / uB.zw;
          float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
          float land = inside > 0.5 ? texture2D(tDist, uv).b : 0.0;
          if (land > 0.53) discard;
          float camD = length(cameraPosition - vW);
          float near = 1.0 - smoothstep(250.0, 1700.0, camD);
          vec2 p1 = vW.xz / 6.5 + vec2(uTime * 0.04, uTime * 0.022), p2 = vW.xz / 17.0 + vec2(-uTime * 0.017, uTime * 0.03);
          float e = 1.0 / 256.0;
          float a0 = texture2D(tNoise, p1).r, ax = texture2D(tNoise, p1 + vec2(e, 0.0)).r, az = texture2D(tNoise, p1 + vec2(0.0, e)).r;
          float b0 = texture2D(tNoise, p2).g, bx = texture2D(tNoise, p2 + vec2(e, 0.0)).g, bz = texture2D(tNoise, p2 + vec2(0.0, e)).g;
          float amp = 1.6 * (0.35 + 0.65 * near);
          vec3 n = normalize(vec3(((a0 - ax) + (b0 - bx) * 0.7) * amp, 0.12, ((a0 - az) + (b0 - bz) * 0.7) * amp));
          vec3 v = normalize(cameraPosition - vW);
          float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0);
          vec3 r = reflect(-v, n);
          float sd = max(dot(r, uSun), 0.0);
          float spec = pow(sd, 260.0) * 1.6 + pow(sd, 24.0) * 0.08;
          // écume le long des côtes, qui bat au rythme de la houle
          float coast = smoothstep(0.47, 0.53, land);
          float shore = smoothstep(0.30, 0.5, land);
          float wv = 0.5 + 0.5 * sin(land * 60.0 - uTime * 1.4 + a0 * 7.0);
          float foam = (shore * smoothstep(0.66, 0.97, wv * (0.55 + 0.7 * b0)) * 0.45 + coast * 0.3) * (0.25 + 0.75 * near);
          vec3 col = uSky * (0.25 + fres) * 0.9 + vec3(1.0, 0.95, 0.85) * spec;
          float alpha = clamp(0.08 + fres * 0.5 + spec * 0.8, 0.0, 0.85);
          col = mix(col, vec3(0.93, 0.95, 0.94), clamp(foam, 0.0, 1.0));
          alpha = max(alpha, clamp(foam, 0.0, 1.0) * 0.8);
          float ex = min(vW.x - uB.x, uB.x + uB.z - vW.x), ez = min(vW.z - uB.y, uB.y + uB.w - vW.z);
          float hz = 1.0 - smoothstep(10.0, 230.0, min(ex, ez));
          col = mix(col, uHaze, hz); alpha = mix(alpha, 1.0, hz * 0.95);
          gl_FragColor = vec4(col, alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }`,
    });
    mat.uniforms.uTime = this.uTime; mat.uniforms.uSun = this.uSun; mat.uniforms.tDist = { value: this.tDist }; mat.uniforms.tNoise = { value: this.noiseTex };
    this.water = new THREE.Mesh(g, mat);
    this.water.renderOrder = 1;
    this.scene.add(this.water);
  }
  buildSky() {
    const g = new THREE.SphereGeometry(9000, 32, 16);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { uTop: { value: new THREE.Color('#5d88b0') }, uHor: { value: new THREE.Color(HAZE) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform vec3 uTop, uHor; varying vec3 vP;
        void main(){ float t = clamp(normalize(vP).y, 0.0, 1.0); gl_FragColor = vec4(mix(uHor, uTop, pow(t, 0.55)), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`,
    });
    this.sky = new THREE.Mesh(g, mat);
    this.sky.frustumCulled = false; this.sky.renderOrder = -1;
    this.scene.add(this.sky);
  }
  buildLights() {
    const s = this.scene;
    s.background = new THREE.Color(HAZE);
    s.fog = new THREE.Fog(HAZE, 3000, 9000);
    const sun = (this.sun = new THREE.DirectionalLight('#fff1dc', 2.5));
    sun.position.copy(SUN).multiplyScalar(1500);
    sun.castShadow = !!this.opts.shadows;
    if (sun.castShadow) {
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.4;
      sun.shadow.camera.near = 10; sun.shadow.camera.far = 4000;
    }
    s.add(sun, sun.target);
    s.add(new THREE.HemisphereLight('#d2e2f0', '#5c4c34', 0.85));
  }
  updateShadow(tx, tz, dist) {
    if (!this.sun.castShadow) return;
    const ext = clamp(dist * 0.8, 90, 1000), c = this.sun.shadow.camera;
    if (Math.abs(c.right - ext) > ext * 0.15) { c.left = -ext; c.right = ext; c.top = ext; c.bottom = -ext; c.updateProjectionMatrix(); }
    const tex = (2 * ext) / 2048, x = Math.round(tx / tex) * tex, z = Math.round(tz / tex) * tex;
    this.sun.target.position.set(x, 0, z);
    this.sun.position.set(x + SUN.x * 1500, SUN.y * 1500, z + SUN.z * 1500);
    this.sun.target.updateMatrixWorld();
  }

  // ------------------------------------------------------ fleuves et routes
  ribbon(pts, wFn, yOff, opts = {}) {
    const P = [], UV = [], I = [];
    let acc = 0, vi = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x, z] = pts[i];
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let dx = b[0] - a[0], dz = b[1] - a[1]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      if (i > 0) acc += Math.hypot(x - pts[i - 1][0], z - pts[i - 1][1]);
      const w = wFn(i / (pts.length - 1)) / 2;
      const lx = x - dz * w, lz = z + dx * w, rx = x + dz * w, rz = z - dx * w;
      const hy = (px, pz) => (opts.sea ? Math.max(0, this.meshH(px, pz)) : this.meshH(px, pz)) + yOff;
      P.push(lx, hy(lx, lz), lz, rx, hy(rx, rz), rz);
      UV.push(acc, 0, acc, 1);
      if (i > 0 && (!opts.skip || !opts.skip(pts[i - 1], pts[i]))) I.push(vi - 2, vi, vi - 1, vi - 1, vi, vi + 1);
      vi += 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2));
    g.setIndex(I);
    g.computeVertexNormals();
    return g;
  }
  buildRivers() {
    const mat = new THREE.MeshStandardMaterial({ color: '#41707f', roughness: 0.22, metalness: 0.1, transparent: true, opacity: 0.92, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
    for (const rv of RIVERS) {
      let pts = rv.pts.map(([lo, la]) => proj(lo, la));
      pts = resample(chaikin(pts, 3), 1.5);
      const g = this.ribbon(pts, (t) => 0.35 + 1.0 * t, 0.1, { skip: (a, b) => this.sdAt(a[0], a[1]) < -1 && this.sdAt(b[0], b[1]) < -1 });
      const m = new THREE.Mesh(g, mat); m.receiveShadow = true; m.renderOrder = 0;
      this.scene.add(m);
    }
  }
  buildRoads() {
    const cv = document.createElement('canvas'); cv.width = 32; cv.height = 32;
    const x = cv.getContext('2d');
    const gr = x.createLinearGradient(0, 0, 0, 32);
    gr.addColorStop(0, 'rgba(90,72,48,0)'); gr.addColorStop(0.18, 'rgba(96,78,52,0.9)'); gr.addColorStop(0.28, 'rgba(205,188,150,1)');
    gr.addColorStop(0.72, 'rgba(205,188,150,1)'); gr.addColorStop(0.82, 'rgba(96,78,52,0.9)'); gr.addColorStop(1, 'rgba(90,72,48,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 32, 32);
    x.fillStyle = 'rgba(150,132,100,0.5)'; for (let i = 0; i < 4; i++) x.fillRect(i * 8, 9, 1, 14);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = THREE.RepeatWrapping; tex.repeat.set(0.5, 1);
    const mat = new THREE.MeshLambertMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -6 });
    const done = new Set();
    for (const key in this.roads) {
      const [a, b] = key.split('|'); const id = a < b ? a + '|' + b : b + '|' + a;
      if (done.has(id)) continue; done.add(id);
      const g = this.ribbon(this.roads[key], () => 0.95, 0.18, { skip: (p, q) => this.sdAt(p[0], p[1]) < 0.3 || this.sdAt(q[0], q[1]) < 0.3 });
      const m = new THREE.Mesh(g, mat); m.receiveShadow = true; m.renderOrder = 0;
      this.scene.add(m);
    }
  }

  // ------------------------------------------------------------ forêts
  buildTrees(density) {
    if (density <= 0) { this.treeChunks = []; return; }
    const kinds = ['conifer', 'broad', 'pine', 'cypress', 'olive', 'palm'];
    const geos = Object.fromEntries(kinds.map((k) => [k, treeGeometry(k)]));
    this.uTreeFade = { value: new THREE.Vector2(this.mobile ? 1000 : 1500, this.mobile ? 1400 : 2100) };
    const mat = treeMaterial(this.uTreeFade);
    const CX = 8, CZ = 6;
    const chunks = Array.from({ length: CX * CZ }, () => Object.fromEntries(kinds.map((k) => [k, []])));
    const rnd = mulberry(77);
    const cities = PROVINCES.map((p) => [this.cityPos[p.id], this.cityR(p) * 2.2 + 3]);
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const k = j * NX + i;
      if (this.sd[k] < 2 || this.roadMask[k]) continue;
      const fo = this.forest[k], fa = this.farm[k], dry = this.dry[k], de = this.des[k];
      const want = (fo * fo * 2.4 + (fa * dry > 0.25 ? 0.18 : 0) + (de > 0.3 && de < 0.8 && this.sd[k] < 40 ? 0.05 : 0)) * density;
      let n = Math.floor(want) + (rnd() < want - Math.floor(want) ? 1 : 0);
      while (n-- > 0) {
        const x = MB.x0 + (i + rnd()) * R, z = MB.z0 + (j + rnd()) * R;
        if (this.sdAt(x, z) < 1.5) continue;
        if (cities.some(([c, r]) => Math.abs(c.x - x) < r && Math.abs(c.z - z) < r && Math.hypot(c.x - x, c.z - z) < r)) continue;
        const lat = 38.5 - z / 111.2, lon = 5 + x / 87.6;
        let kind;
        const r = rnd();
        if (this.conifer[k] > 0.5 && rnd() < this.conifer[k]) kind = 'conifer';
        else if (de > 0.25 || (lat < 37.2 && dry > 0.6)) kind = r < 0.6 ? 'palm' : 'olive';
        else if (fo < 0.25 && fa > 0.2) kind = r < 0.7 ? 'olive' : 'cypress';
        else if (dry > 0.5) kind = r < 0.4 ? 'pine' : r < 0.55 && lon > 7.5 && lon < 18.5 && lat > 37 ? 'cypress' : r < 0.72 ? 'olive' : 'broad';
        else kind = r < 0.8 ? 'broad' : 'conifer';
        const ci = clamp(Math.floor(((x - MB.x0) / WW) * CX), 0, CX - 1), cj = clamp(Math.floor(((z - MB.z0) / HH) * CZ), 0, CZ - 1);
        const s = (0.75 + rnd() * 0.5) * (kind === 'olive' ? 0.9 : 1);
        chunks[cj * CX + ci][kind].push([x, this.meshH(x, z) - 0.1, z, s, rnd() * Math.PI * 2, rnd()]);
      }
    }
    this.treeChunks = [];
    const o = new THREE.Object3D(), col = new THREE.Color();
    chunks.forEach((ch, ci) => {
      const cx = MB.x0 + ((ci % CX) + 0.5) * (WW / CX), cz = MB.z0 + (Math.floor(ci / CX) + 0.5) * (HH / CZ);
      const meshes = [];
      for (const kind of kinds) {
        const list = ch[kind]; if (!list.length) continue;
        const im = new THREE.InstancedMesh(geos[kind], mat, list.length);
        list.forEach(([x, y, z, s, a, v], i) => {
          o.position.set(x, y, z); o.rotation.set(0, a, 0); o.scale.set(s, s * (0.85 + v * 0.3), s); o.updateMatrix();
          im.setMatrixAt(i, o.matrix);
          col.setRGB(0.85 + v * 0.3, 0.88 + v * 0.22, 0.85 + v * 0.2);
          im.setColorAt(i, col);
        });
        im.computeBoundingSphere();
        im.receiveShadow = true;
        this.scene.add(im);
        meshes.push(im);
      }
      this.treeChunks.push({ x: cx, z: cz, rx: WW / CX / 2, rz: HH / CZ / 2, meshes });
    });
  }

  // ----------------------------------------------------------- villes
  buildCities() {
    const H = (x, z) => Math.max(0.02, this.meshH(x, z));
    const { geo, ships } = buildSettlements(PROVINCES, {
      cityPos: this.cityPos, h: H, sd: (x, z) => this.sdAt(x, z), radius: (p) => this.cityR(p),
      gates: this.gates, seaDir: (pid) => this.seaDir(pid),
    });
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86, metalness: 0 });
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true; m.receiveShadow = true;
    this.scene.add(m);
    // navires au mouillage
    this.ships = ships;
    if (ships.length) {
      this.shipMesh = new THREE.InstancedMesh(galleyGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }), ships.length);
      this.shipMesh.castShadow = true;
      this.scene.add(this.shipMesh);
    }
    // étendards des villes, aux couleurs du maître
    this.flagTex = [0, 1, 2].map((s) => emblemTexture(s));
    this.flagMat = this.flagTex.map((t) => bannerMaterial(t, this.uTime, 4.4));
    this.cityFlags = {};
    const poleG = new THREE.CylinderGeometry(0.12, 0.14, 9, 5); poleG.translate(0, 4.5, 0);
    const poleM = new THREE.MeshStandardMaterial({ color: '#4a3a28' });
    const fg = bannerGeometry(4.4, 3.1);
    for (const p of PROVINCES) {
      const c = this.cityPos[p.id], gr = new THREE.Group();
      gr.position.set(c.x, c.y, c.z);
      gr.add(new THREE.Mesh(poleG, poleM));
      const fm = new THREE.Mesh(fg, this.flagMat[p.owner]);
      fm.position.y = 7.4; fm.castShadow = true;
      gr.add(fm);
      gr.userData.flag = fm;
      this.scene.add(gr);
      this.cityFlags[p.id] = gr;
    }
  }

  // ------------------------------------------------------------ nuages
  buildClouds(k) {
    this.clouds = [];
    if (!k) return;
    const tex = cloudTexture();
    const rnd = mulberry(321);
    const n = Math.round((this.mobile ? 26 : 44) * k);
    for (let i = 0; i < n; i++) {
      // surtout aux bords du monde, quelques-uns au-dessus de la mer
      const edge = i < n * 0.7;
      let x, z;
      if (edge) { const a = rnd() * Math.PI * 2; const rr = 0.92 + rnd() * 0.35; x = (MB.x0 + MB.x1) / 2 + Math.cos(a) * WW * 0.5 * rr; z = (MB.z0 + MB.z1) / 2 + Math.sin(a) * HH * 0.5 * rr; }
      else { x = MB.x0 + rnd() * WW; z = MB.z0 + rnd() * HH; }
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, fog: false });
      const s = new THREE.Sprite(mat);
      const sc = 260 + rnd() * 360;
      s.scale.set(sc, sc * 0.55, 1);
      s.position.set(x, 90 + rnd() * 110, z);
      s.userData = { base: edge ? 0.95 : 0.6, v: 4 + rnd() * 6 };
      this.scene.add(s);
      this.clouds.push(s);
    }
  }

  // ------------------------------------------- couche politique et surbrillance
  paint(owner, hl = {}, selProv = null) {
    const sig = PROVINCES.map((p) => owner[p.id]).join('');
    if (sig !== this.ownSig) { this.ownSig = sig; this.owner = owner; this.updateFactions(owner); }
    const d = this.pdata;
    d.fill(0);
    const lin = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };
    const fc = FACTIONS.map((f) => lin(f.color));
    const HL = [null, lin('#f2cf6e'), lin('#ff5a3c'), lin('#5fb3ff')];
    const put = (i, row, r, g, b, a) => { const o = (row * 64 + i) * 4; d[o] = clamp(r * 255, 0, 255); d[o + 1] = clamp(g * 255, 0, 255); d[o + 2] = clamp(b * 255, 0, 255); d[o + 3] = clamp(a * 255, 0, 255); };
    PROVINCES.forEach((p, i) => {
      const c = fc[owner[p.id]];
      put(i, 0, c[0], c[1], c[2], 1);
      const h = hl[p.id] || 0;
      if (h) put(i, 1, HL[h][0], HL[h][1], HL[h][2], 1);
      put(i, 2, 1, p.id === selProv ? 1 : 0, 0, 1);
    });
    for (let v = NP; v <= UNCLAIMED; v++) put(v, 0, 0.32, 0.30, 0.26, 1);
    this.tPD.needsUpdate = true;
    for (const p of PROVINCES) {
      const fm = this.cityFlags[p.id].userData.flag;
      fm.material = this.flagMat[owner[p.id]];
    }
  }
  updateFactions(owner) {
    const FN = FX * FZ, flab = this.flab, flabD = this.flabD, ind = this.fInd;
    const cls = new Uint8Array(UNCLAIMED + 1).fill(3);
    PROVINCES.forEach((p, i) => { cls[i] = owner[p.id]; });
    ind.fill(0);
    for (let k = 0; k < FN; k++) { const v = flabD[k]; if (v !== NONE) ind[k * 4 + cls[v]] = 255; }
    this.tFInd.needsUpdate = true;
    const dF = new Float32Array(FN);
    for (let fj = 0; fj < FZ; fj++) for (let fi = 0; fi < FX; fi++) {
      const k = fj * FX + fi, a = flab[k];
      let edge = false;
      if (a !== NONE) {
        const ca = cls[a];
        for (const kk of [fi < FX - 1 ? k + 1 : -1, fi > 0 ? k - 1 : -1, k + FX, k - FX]) { if (kk < 0 || kk >= FN) continue; const b = flab[kk]; if (b !== NONE && cls[b] !== ca) { edge = true; break; } }
      }
      dF[k] = edge ? 0 : 1e6;
    }
    chamfer(dF, FX, FZ);
    const D = this.dist4;
    for (let k = 0; k < FN; k++) D[k * 4 + 1] = Math.min(255, (dF[k] / 3 + 0.5) * 12);
    this.tDist.needsUpdate = true;
  }

  // ----------------------------------------------------------- armées
  tokenFor(a) {
    let t = this.tokens.get(a.id);
    const comp = armyComposition(a), sig = comp.front + comp.back + comp.cav + comp.ele + a.side;
    if (t && t.sig === sig) return t;
    if (t) { t.body.geometry.dispose(); const { geo } = armyGeometry(a); t.body.geometry = geo; t.sig = sig; return t; }
    const gr = new THREE.Group();
    const { geo } = armyGeometry(a);
    const mat = armyMaterial(this.uTime);
    const body = new THREE.Mesh(geo, mat);
    body.scale.setScalar(AS); body.castShadow = true; body.receiveShadow = true;
    gr.add(body);
    // porte-étendard : hampe et grande enseigne
    if (!this.armyBanner) {
      this.armyBanner = [0, 1, 2].map((s) => bannerMaterial(this.flagTex[s], this.uTime, 5.0));
      this.poleGeo = new THREE.CylinderGeometry(0.13, 0.15, 13, 5); this.poleGeo.translate(0, 6.5, 0);
      this.poleMat = new THREE.MeshStandardMaterial({ color: '#4a3a28', roughness: 0.8 });
      this.bannerGeo = bannerGeometry(5.0, 3.5);
      this.decalTex = decalTexture();
      this.ringGeo = new THREE.RingGeometry(9.5, 11, 40); this.ringGeo.rotateX(-Math.PI / 2);
    }
    const pole = new THREE.Mesh(this.poleGeo, this.poleMat); pole.position.set(-0.6 * AS, 0, 0.6 * AS); pole.castShadow = true;
    const flag = new THREE.Mesh(this.bannerGeo, this.armyBanner[a.side]); flag.position.set(-0.6 * AS, 11, 0.6 * AS); flag.castShadow = true;
    gr.add(pole, flag);
    // ombre portée douce et liseré aux couleurs de la faction
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.MeshBasicMaterial({ map: this.decalTex, color: FACTIONS[a.side].color, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8 }));
    decal.rotation.x = -Math.PI / 2; decal.position.y = 0.25; decal.renderOrder = 2;
    gr.add(decal);
    const ring = new THREE.Mesh(this.ringGeo, new THREE.MeshBasicMaterial({ color: '#f3d58a', transparent: true, opacity: 0.95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8 }));
    ring.position.y = 0.35; ring.visible = false; ring.renderOrder = 3;
    gr.add(ring);
    // galère pour les traversées
    const sailCol = FACTIONS[a.side].color;
    const ship = new THREE.Mesh(galleyGeometry('#efe4cc', sailCol), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }));
    ship.scale.setScalar(2.6); ship.visible = false; ship.castShadow = true;
    gr.add(ship);
    this.scene.add(gr);
    t = { gr, body, flag, pole, decal, ring, ship, mat, x: 0, z: 0, ready: false, prov: null, heading: 0, sig };
    this.tokens.set(a.id, t);
    return t;
  }
  // place les armées : devant leur ville
  slotPos(c, a) {
    const here = c.armies.filter((x) => x.prov === a.prov);
    const k = here.indexOf(a), n = here.length;
    const cp = this.cityPos[a.prov];
    const sieging = c.siege[a.prov] && c.siege[a.prov].army === a.id;
    const base = sieging ? 0.6 : 1.9;
    const mixed = n > 1 && here.some((x) => x.side !== a.side);
    const ang = base + (k - (n - 1) / 2) * 0.62 + (mixed && a.side !== here[0].side ? Math.PI : 0);
    const r = this.cityR(PROV[a.prov]) + (sieging ? 8 : 13);
    let x = cp.x + Math.cos(ang) * r, z = cp.z + Math.sin(ang) * r;
    for (let i = 0; i < 14 && this.sdAt(x, z) < 4; i++) { const a2 = ang + (i + 1) * 0.5 * (i % 2 ? -1 : 1); x = cp.x + Math.cos(a2) * r; z = cp.z + Math.sin(a2) * r; }
    return [x, z];
  }
  syncArmies(c, animate = true) {
    this.syncSieges(c);
    const alive = new Set(c.armies.map((a) => a.id));
    for (const [id, t] of this.tokens) if (!alive.has(id)) { this.scene.remove(t.gr); t.body.geometry.dispose(); this.tokens.delete(id); this.anims = this.anims.filter((an) => an.t !== t); }
    for (const a of c.armies) {
      const t = this.tokenFor(a);
      const [x, z] = this.slotPos(c, a);
      if (!t.ready || !animate) {
        t.x = x; t.z = z; t.ready = true; t.prov = a.prov;
        this.anims = this.anims.filter((an) => an.t !== t);
        t.gr.position.set(x, this.height(x, z), z); t.body.visible = true; t.ship.visible = false;
      } else if (Math.hypot(t.x - x, t.z - z) > 0.5 || t.prov !== a.prov) {
        const from = [t.gr.position.x, t.gr.position.z];
        let pts;
        if (t.prov && t.prov !== a.prov) {
          const sea = !this.roads[t.prov + '|' + a.prov] && !!this.lanes[t.prov + '|' + a.prov];
          pts = this.routePts(t.prov, a.prov, sea);
          pts = trimRoute(pts, from, [x, z], this.cityR(PROV[t.prov]) * 0.8, this.cityR(PROV[a.prov]) * 0.8, this.cityPos[t.prov], this.cityPos[a.prov]);
        } else pts = [from, [x, z]];
        pts = resample(pts, 2);
        const len = polyLen(pts);
        this.anims = this.anims.filter((an) => an.t !== t);
        this.anims.push({ t, pts, len, k: 0, dur: clamp(0.5 + len / 300, 0.6, 2.6) });
        t.x = x; t.z = z; t.prov = a.prov;
      }
      t.ring.visible = this.sel === a.id;
      t.ring.material.color.set(a.side === c.player ? '#f3d58a' : '#ff8a70');
      t.decal.material.opacity = this.sel === a.id ? 1 : 0.85;
    }
  }
  // travaux de siège devant les villes assiégées
  syncSieges(c) {
    if (!this.sieges) { this.sieges = {}; this.siegeGeo = siegeGeometry(); this.siegeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }); }
    for (const pid in this.sieges) if (!c.siege[pid]) { this.scene.remove(this.sieges[pid]); delete this.sieges[pid]; }
    for (const pid in c.siege) {
      const s = c.siege[pid], a = c.army(s.army); if (!a) continue;
      let m = this.sieges[pid];
      if (!m) { m = new THREE.Mesh(this.siegeGeo, this.siegeMat); m.castShadow = true; m.receiveShadow = true; m.scale.setScalar(1.25); this.scene.add(m); this.sieges[pid] = m; }
      const C = this.cityPos[pid], [ax, az] = this.slotPos(c, a);
      const dx = C.x - ax, dz = C.z - az, L = Math.hypot(dx, dz) || 1;
      const x = ax + (dx / L) * 4, z = az + (dz / L) * 4;
      m.position.set(x, this.height(x, z), z);
      m.rotation.y = Math.atan2(dx, dz);
    }
  }
  armyAtScreen(c, sx, sy, project) {
    let best = null, bd = 38;
    for (const a of c.armies) {
      const t = this.tokens.get(a.id); if (!t) continue;
      for (const dy of [3, 9]) {
        const p = project(t.gr.position.x, t.gr.position.y + dy, t.gr.position.z);
        if (!p) continue;
        const d = Math.hypot(p[0] - sx, p[1] - sy);
        if (d < bd) { bd = d; best = a; }
      }
    }
    return best;
  }

  // ------------------------------------------------ trajets proposés à l'armée choisie
  showPaths(a, options) {
    for (const m of this.pathGroup.children) if (m.geometry !== this.arrowGeo) m.geometry.dispose();
    this.pathGroup.clear();
    this.pathEnd = {};
    if (!a || !options || !options.length) return;
    const t = this.tokens.get(a.id); if (!t) return;
    if (!this.pathMats) {
      const mk = (hex) => new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -12,
        uniforms: { uCol: { value: new THREE.Color(hex) }, uTime: this.uTime },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: `uniform vec3 uCol; uniform float uTime; varying vec2 vUv;
          void main(){ float ac = abs(vUv.y - 0.5) * 2.0; float dash = smoothstep(0.35, 0.5, fract(vUv.x / 4.2 - uTime * 0.7));
            float core = 1.0 - smoothstep(0.55, 0.95, ac); float glow = 1.0 - ac;
            gl_FragColor = vec4(mix(uCol * 0.6, uCol, dash), core * (0.45 + 0.5 * dash) + glow * 0.15);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      });
      this.pathMats = { move: mk('#f2cf6e'), attack: mk('#ff5a3c'), sea: mk('#6cc0ff') };
      this.arrowGeo = (() => { const s = new THREE.Shape(); s.moveTo(0, -3.2); s.lineTo(2.2, 1); s.lineTo(-2.2, 1); s.closePath(); const g = new THREE.ShapeGeometry(s); g.rotateX(-Math.PI / 2); return g; })();
    }
    const from = [t.x, t.z];
    for (const o of options) {
      const kind = o.attack ? 'attack' : o.sea ? 'sea' : 'move';
      const C = this.cityPos[o.prov];
      let pts = this.routePts(a.prov, o.prov, !!o.sea);
      const stop = this.cityR(PROV[o.prov]) + 7;
      pts = trimRoute(pts, from, null, this.cityR(PROV[a.prov]) * 0.8, stop, this.cityPos[a.prov], C);
      pts = resample(pts, 1.5);
      if (pts.length < 2) continue;
      const g = this.ribbon(pts, (u) => 1.6 * (u > 0.94 ? (1 - u) / 0.06 * 0.6 + 0.4 : 1), 0.7, { sea: true });
      const m = new THREE.Mesh(g, this.pathMats[kind]); m.renderOrder = 4;
      this.pathGroup.add(m);
      const [ex, ez] = pts[pts.length - 1], [px, pz] = pts[Math.max(0, pts.length - 3)];
      this.pathEnd[o.prov] = new THREE.Vector3(ex, Math.max(0, this.meshH(ex, ez)), ez);
      const ar = new THREE.Mesh(this.arrowGeo, this.pathMats[kind]);
      ar.position.set(ex, Math.max(0, this.meshH(ex, ez)) + 0.9, ez);
      ar.rotation.y = Math.atan2(ex - px, ez - pz);
      ar.renderOrder = 4;
      this.pathGroup.add(ar);
    }
  }

  // ------------------------------------------------------------ animation
  update(dt, camera, cam) {
    this.time += dt;
    this.uTime.value = this.time;
    this.uPulse.value = 0.5 + 0.5 * Math.sin(this.time * 3);
    this.uCloud.value.set(this.time * 6, this.time * 2.5);
    for (const an of this.anims) {
      an.k = Math.min(1, an.k + dt / an.dur);
      const e = an.k < 0.5 ? 2 * an.k * an.k : 1 - (-2 * an.k + 2) ** 2 / 2;
      const [x, z, hx, hz] = along(an.pts, e * an.len);
      const t = an.t;
      const water = this.sdAt(x, z) < 0.5;
      t.gr.position.set(x, water ? 0.15 : this.height(x, z), z);
      t.heading = Math.atan2(hx, hz);
      t.gr.rotation.y = t.heading;
      t.body.visible = !water; t.flag.visible = !water; t.pole.visible = !water; t.decal.visible = !water;
      t.ship.visible = water;
      t.mat.userData.uWalk.value = an.k < 1 ? 1 : 0;
      if (an.k >= 1) { t.mat.userData.uWalk.value = 0; t.body.visible = t.flag.visible = t.pole.visible = t.decal.visible = true; t.ship.visible = false; }
    }
    this.anims = this.anims.filter((a) => a.k < 1);
    for (const t of this.tokens.values()) if (t.ring.visible) t.ring.scale.setScalar(1 + 0.06 * Math.sin(this.time * 4));
    // navires au port : la houle les berce
    if (this.shipMesh) {
      const o = this._o || (this._o = new THREE.Object3D());
      this.ships.forEach((s, i) => {
        o.position.set(s.x, 0.12 + 0.08 * Math.sin(this.time * 1.3 + i), s.z);
        o.rotation.set(0.03 * Math.sin(this.time * 1.1 + i * 2), s.a, 0.05 * Math.sin(this.time * 0.9 + i));
        o.scale.setScalar(1.15); o.updateMatrix();
        this.shipMesh.setMatrixAt(i, o.matrix);
      });
      this.shipMesh.instanceMatrix.needsUpdate = true;
    }
    if (camera && cam) {
      const dist = cam.cur.dist;
      // brume : l'horizon se perd dans le lointain
      this.scene.fog.near = dist * 1.25 + 300; this.scene.fog.far = dist * 3.2 + 1600;
      // nuages : visibles quand on prend de la hauteur
      const vis = smoothstep(900, 2100, dist);
      for (const s of this.clouds) {
        s.material.opacity = vis * s.userData.base;
        s.visible = vis > 0.01;
        s.position.x += s.userData.v * dt;
        if (s.position.x > MB.x1 + 900) s.position.x = MB.x0 - 900;
      }
      // forêts : seuls les morceaux assez proches sont dessinés
      if (this.treeChunks) {
        const cp = camera.position, far = this.uTreeFade.value.y + 80;
        for (const ch of this.treeChunks) {
          const dx = Math.max(0, Math.abs(cp.x - ch.x) - ch.rx), dz = Math.max(0, Math.abs(cp.z - ch.z) - ch.rz);
          const vis2 = Math.hypot(dx, dz, cp.y) < far;
          for (const m of ch.meshes) m.visible = vis2;
        }
      }
      this.updateShadow(cam.cur.x, cam.cur.z, dist);
    }
  }
  get busy() { return this.anims.length > 0; }
}

// ---------------------------------------------------------------- outils
function bil(a, x, z) {
  const fx = (x - MB.x0) / R - 0.5, fz = (z - MB.z0) / R - 0.5;
  const i = clamp(Math.floor(fx), 0, NX - 2), j = clamp(Math.floor(fz), 0, NZ - 2);
  const tx = clamp(fx - i, 0, 1), tz = clamp(fz - j, 0, 1), k = j * NX + i;
  return (a[k] * (1 - tx) + a[k + 1] * tx) * (1 - tz) + (a[k + NX] * (1 - tx) + a[k + NX + 1] * tx) * tz;
}
function chamfer(d, W, H) {
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i; let v = d[k];
    if (i > 0) v = Math.min(v, d[k - 1] + 3);
    if (j > 0) { v = Math.min(v, d[k - W] + 3); if (i > 0) v = Math.min(v, d[k - W - 1] + 4); if (i < W - 1) v = Math.min(v, d[k - W + 1] + 4); }
    d[k] = v;
  }
  for (let j = H - 1; j >= 0; j--) for (let i = W - 1; i >= 0; i--) {
    const k = j * W + i; let v = d[k];
    if (i < W - 1) v = Math.min(v, d[k + 1] + 3);
    if (j < H - 1) { v = Math.min(v, d[k + W] + 3); if (i < W - 1) v = Math.min(v, d[k + W + 1] + 4); if (i > 0) v = Math.min(v, d[k + W - 1] + 4); }
    d[k] = v;
  }
}
function segDist(x, z, a, b) {
  const vx = b[0] - a[0], vz = b[1] - a[1], l = vx * vx + vz * vz;
  const t = l ? clamp(((x - a[0]) * vx + (z - a[1]) * vz) / l, 0, 1) : 0;
  return Math.hypot(x - a[0] - vx * t, z - a[1] - vz * t);
}
function dataTex(data, w, h, format, linear) {
  const t = new THREE.DataTexture(data, w, h, format, THREE.UnsignedByteType);
  t.magFilter = t.minFilter = linear ? THREE.LinearFilter : THREE.NearestFilter;
  t.generateMipmaps = false;
  t.unpackAlignment = 1;
  t.needsUpdate = true;
  return t;
}
function decalTexture() {
  const S = 128, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const x = cv.getContext('2d');
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.0)'); g.addColorStop(0.55, 'rgba(255,255,255,0.05)'); g.addColorStop(0.7, 'rgba(255,255,255,0.5)');
  g.addColorStop(0.78, 'rgba(255,255,255,0.75)'); g.addColorStop(0.86, 'rgba(255,255,255,0.15)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
// file de priorité (tas binaire)
class Heap {
  constructor() { this.k = []; this.v = []; }
  get size() { return this.v.length; }
  topKey() { return this.k[0]; }
  push(key, val) {
    const K = this.k, V = this.v; let i = V.length; K.push(key); V.push(val);
    while (i > 0) { const p = (i - 1) >> 1; if (K[p] <= key) break; K[i] = K[p]; V[i] = V[p]; i = p; }
    K[i] = key; V[i] = val;
  }
  pop() {
    const K = this.k, V = this.v, top = V[0], lk = K.pop(), lv = V.pop(), n = V.length;
    if (n) {
      let i = 0;
      for (;;) { let c = 2 * i + 1; if (c >= n) break; if (c + 1 < n && K[c + 1] < K[c]) c++; if (K[c] >= lk) break; K[i] = K[c]; V[i] = V[c]; i = c; }
      K[i] = lk; V[i] = lv;
    }
    return top;
  }
}
// plus court chemin sur la grille (8 voisins), coût par case
const _g = { g: null, from: null, touched: [] };
function astar(cost, [ai, aj], [bi, bj]) {
  const N = NX * NZ;
  if (!_g.g) { _g.g = new Float64Array(N).fill(Infinity); _g.from = new Int32Array(N).fill(-1); _g.closed = new Uint8Array(N); }
  const G = _g.g, from = _g.from, closed = _g.closed;
  for (const k of _g.touched) { G[k] = Infinity; from[k] = -1; closed[k] = 0; }
  _g.touched = [];
  const s = aj * NX + ai, e = bj * NX + bi;
  const hh = (k) => Math.hypot((k % NX) - bi, Math.floor(k / NX) - bj) * 0.9;
  const heap = new Heap();
  G[s] = 0; _g.touched.push(s); heap.push(hh(s), s);
  const nb = [1, -1, NX, -NX, NX + 1, NX - 1, -NX + 1, -NX - 1], nl = [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2];
  let it = 0;
  while (heap.size && it++ < 400000) {
    const k = heap.pop();
    if (closed[k]) continue;
    closed[k] = 1;
    if (k === e) break;
    const i = k % NX;
    for (let t = 0; t < 8; t++) {
      const kk = k + nb[t];
      if (kk < 0 || kk >= N || closed[kk]) continue;
      if (Math.abs((kk % NX) - i) > 1) continue;
      const c = cost[kk]; if (c >= 1e8) continue;
      const ng = G[k] + (cost[k] + c) * 0.5 * nl[t];
      if (ng < G[kk]) { if (G[kk] === Infinity) _g.touched.push(kk); G[kk] = ng; from[kk] = k; heap.push(ng + hh(kk), kk); }
    }
  }
  if (G[e] === Infinity) return null;
  const path = [];
  for (let k = e; k !== -1; k = from[k]) path.push(k);
  return path.reverse();
}
function simplify(pts) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = out[out.length - 1], b = pts[i], c = pts[i + 1];
    const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (Math.abs(cr) > 1e-6) out.push(b);
  }
  out.push(pts[pts.length - 1]);
  return out;
}
function chaikin(pts, it) {
  let p = pts;
  for (let n = 0; n < it; n++) {
    if (p.length < 3) return p;
    const q = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1];
      q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    q.push(p[p.length - 1]);
    p = q;
  }
  return p;
}
function resample(pts, step) {
  if (pts.length < 2) return pts.slice();
  const out = [pts[0].slice()];
  let carry = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let d = step - carry;
    while (d <= L) { const t = d / L; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); d += step; }
    carry = L - (d - step);
  }
  const last = pts[pts.length - 1];
  if (Math.hypot(out[out.length - 1][0] - last[0], out[out.length - 1][1] - last[1]) > step * 0.3) out.push(last.slice());
  else out[out.length - 1] = last.slice();
  return out;
}
function polyLen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
// position et direction à une distance donnée le long d'une ligne
function along(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= L || i === pts.length - 1) { const t = L ? clamp(d / L, 0, 1) : 1; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, (b[0] - a[0]) / (L || 1), (b[1] - a[1]) / (L || 1)]; }
    d -= L;
  }
  const p = pts[pts.length - 1]; return [p[0], p[1], 0, 1];
}
// un trajet d'armée : quitter son poste, prendre la route hors de la ville, rejoindre le nouveau poste
function trimRoute(pts, from, to, r0, r1, C0, C1) {
  let i0 = 0; while (i0 < pts.length - 1 && Math.hypot(pts[i0][0] - C0.x, pts[i0][1] - C0.z) < r0) i0++;
  let i1 = pts.length - 1; while (i1 > i0 && Math.hypot(pts[i1][0] - C1.x, pts[i1][1] - C1.z) < r1) i1--;
  const mid = pts.slice(i0, i1 + 1);
  // ne pas revenir en arrière : partir du point de la route le plus proche du départ, vers la destination
  let best = 0, bd = 1e9;
  for (let i = 0; i < Math.min(mid.length, 40); i++) { const d = Math.hypot(mid[i][0] - from[0], mid[i][1] - from[1]); if (d < bd) { bd = d; best = i; } }
  const out = [from, ...mid.slice(best)];
  if (to) out.push(to);
  return out;
}
export { NX, NZ, emblemTexture };
