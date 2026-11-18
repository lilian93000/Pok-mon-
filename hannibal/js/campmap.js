/* Carte de campagne en relief : Méditerranée occidentale vers 218 av. J.-C.
   Côtes, montagnes et fleuves tracés à la main (geo.js), provinces dessinées par
   inondation depuis leurs villes, couleurs politiques, villes et armées en 3D. */
import * as THREE from 'three';
import { LANDS, RIDGES, RIVERS } from './geo.js';
import { PROVINCES, PROV, WILDS, proj, FACTIONS, ADJ } from './campaign.js';
import { makeNoise2D, smoothstep, clamp } from './noise.js';
import { ARCH, buildArch } from './models.js';

export const MB = { x0: -1320, x1: 1420, z0: -1010, z1: 1070 };
const R = 4; // km par cellule du raster
const VS = 9; // exagération du relief (unités par km d'altitude)
const NX = Math.round((MB.x1 - MB.x0) / R), NZ = Math.round((MB.z1 - MB.z0) / R);

export class CampaignMap {
  constructor(renderer, opts = {}) {
    this.r = renderer; this.opts = opts;
    this.scene = new THREE.Scene();
    this.n = makeNoise2D(41); this.m = makeNoise2D(97);
    this.time = 0;
    this.buildRaster();
    this.buildProvinces();
    this.buildTerrain(opts.texScale || 2);
    this.buildWater();
    this.buildLights();
    this.buildCities();
    this.tokens = new Map();
    this.anims = [];
    this.sel = null;
    this.owner = null;
  }

  // ------------------------------------------------------------ raster
  buildRaster() {
    // terres émergées : polygones rasterisés
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
    // distance à la côte (chamfrein 3-4), dans les deux milieux
    const dl = new Float32Array(N), ds = new Float32Array(N);
    for (let i = 0; i < N; i++) { dl[i] = this.land[i] ? 1e6 : 0; ds[i] = this.land[i] ? 0 : 1e6; }
    for (const d of [dl, ds]) chamfer(d, NX, NZ);
    this.sd = new Float32Array(N); // distance signée (km) : > 0 à terre
    for (let i = 0; i < N; i++) this.sd[i] = this.land[i] ? (dl[i] / 3) * R : -(ds[i] / 3) * R;
    // relief
    this.h = new Float32Array(N);
    const n = this.n, m = this.m;
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const k = j * NX + i, x = MB.x0 + (i + 0.5) * R, z = MB.z0 + (j + 0.5) * R;
      const sd = this.sd[k];
      if (sd > 0) {
        const inland = Math.min(1, sd / 220);
        this.h[k] = (0.06 + 0.35 * inland + 0.22 * Math.max(0, n.fbm(x / 160, z / 160, 4) + 0.2) * (0.4 + inland)) * VS;
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
        if (d > pad) continue;
        const rough = 0.55 + 0.75 * m.ridge(x / 70, z / 70, 4);
        const add = r.h * Math.exp(-((d / wk) ** 2)) * rough * VS * smoothstep(0, 25, this.sd[k]);
        if (add > this.h[k] * 0.1) this.h[k] += add;
        if (r.snow) this.snowL = 1;
      }
    }
  }
  hAt(x, z) {
    const fx = (x - MB.x0) / R - 0.5, fz = (z - MB.z0) / R - 0.5;
    const i = clamp(Math.floor(fx), 0, NX - 2), j = clamp(Math.floor(fz), 0, NZ - 2);
    const tx = clamp(fx - i, 0, 1), tz = clamp(fz - j, 0, 1), k = j * NX + i, h = this.h;
    return (h[k] * (1 - tx) + h[k + 1] * tx) * (1 - tz) + (h[k + NX] * (1 - tx) + h[k + NX + 1] * tx) * tz;
  }
  sdAt(x, z) {
    const fx = (x - MB.x0) / R - 0.5, fz = (z - MB.z0) / R - 0.5;
    const i = clamp(Math.floor(fx), 0, NX - 2), j = clamp(Math.floor(fz), 0, NZ - 2);
    const tx = clamp(fx - i, 0, 1), tz = clamp(fz - j, 0, 1), k = j * NX + i, h = this.sd;
    return (h[k] * (1 - tx) + h[k + 1] * tx) * (1 - tz) + (h[k + NX] * (1 - tx) + h[k + NX + 1] * tx) * tz;
  }
  // altitude visible (la mer est plate) : pour la caméra et le placement
  height(x, z) { return Math.max(0.05, this.hAt(x, z)); }

  // -------------------------------------------------------- provinces
  buildProvinces() {
    const N = NX * NZ;
    const id = (this.pid = new Int16Array(N).fill(-1));
    this.pIndex = PROVINCES.map((p) => p.id);
    const q = [];
    const seed = (lon, lat, v) => {
      const [x, z] = proj(lon, lat);
      let i = Math.round((x - MB.x0) / R), j = Math.round((z - MB.z0) / R);
      // ramener la graine sur la terre ferme
      if (!this.land[j * NX + i]) {
        let best = null, bd = 1e9;
        for (let dj = -8; dj <= 8; dj++) for (let di = -8; di <= 8; di++) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= NX || jj >= NZ) continue; if (this.land[jj * NX + ii] && di * di + dj * dj < bd) { bd = di * di + dj * dj; best = [ii, jj]; } }
        if (!best) return; [i, j] = best;
      }
      const k = j * NX + i;
      if (id[k] === -1) { id[k] = v; q.push(k); }
    };
    PROVINCES.forEach((p, v) => { seed(p.lon, p.lat, v); for (const [lo, la] of p.seeds || []) seed(lo, la, v); });
    WILDS.forEach((w, v) => { for (const [lo, la] of w.seeds) seed(lo, la, 100 + v); });
    // inondation sur la terre ferme (distance géodésique approchée)
    let h = 0;
    const nb = [1, -1, NX, -NX, NX + 1, NX - 1, -NX + 1, -NX - 1];
    while (h < q.length) {
      const k = q[h++], v = id[k];
      const i = k % NX;
      for (let t = 0; t < 8; t++) {
        const kk = k + nb[t];
        if (kk < 0 || kk >= N) continue;
        const ii = kk % NX;
        if (Math.abs(ii - i) > 1) continue;
        if (!this.land[kk] || id[kk] !== -1) continue;
        id[kk] = v; q.push(kk);
      }
    }
    // positions des villes
    this.cityPos = {};
    for (const p of PROVINCES) { const [x, z] = proj(p.lon, p.lat); this.cityPos[p.id] = new THREE.Vector3(x, this.height(x, z), z); }
  }
  provinceAt(x, z) {
    const i = Math.floor((x - MB.x0) / R), j = Math.floor((z - MB.z0) / R);
    if (i < 0 || j < 0 || i >= NX || j >= NZ) return null;
    const v = this.pid[j * NX + i];
    return v >= 0 && v < 100 ? this.pIndex[v] : null;
  }

  // ---------------------------------------------------------- terrain
  buildTerrain(S) {
    const W = Math.round(NX * S), H = Math.round(NZ * S);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(W, H), d = img.data;
    const n = this.n, m = this.m;
    const L = [-0.55, 0.62, -0.56]; // lumière rasante du nord-ouest (ombrage gravé)
    for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
      const x = MB.x0 + ((px + 0.5) / W) * (MB.x1 - MB.x0), z = MB.z0 + ((py + 0.5) / H) * (MB.z1 - MB.z0);
      const sd = this.sdAt(x, z);
      const lat = 38.5 - z / 111.2, lon = 5 + x / 87.6;
      let c;
      if (sd < 0) {
        // mer : turquoise près des côtes, bleu profond au large
        const t = smoothstep(0, 70, -sd), nn = n(x / 40, z / 40) * 0.03;
        c = mix([0.30, 0.56, 0.60], [0.10, 0.25, 0.42], t);
        c = mix(c, [0.07, 0.17, 0.33], smoothstep(60, 200, -sd));
        c[0] += nn; c[1] += nn; c[2] += nn;
        if (sd > -2.5) c = mix(c, [0.78, 0.74, 0.62], 0.5 * (1 - (-sd / 2.5)));
      } else {
        const h = this.hAt(x, z) / VS; // km
        const v1 = n.fbm(x / 90, z / 90, 4), v2 = m.fbm(x / 22, z / 22, 3);
        // biomes : vert au nord, ocre au sud, sable au désert
        const south = smoothstep(43.5, 36.5, lat + v1 * 1.2);
        const desert = smoothstep(34.2, 32.2, lat + v1 * 0.8) * (lon > -7 ? 1 : 0.6);
        const iberDry = (lon < 0.5 && lat < 41.8 && lat > 36.5 ? 0.55 : 0) * smoothstep(0, 80, sd);
        c = mix([0.42, 0.52, 0.27], [0.66, 0.6, 0.38], Math.min(1, south * 0.85 + iberDry));
        c = mix(c, [0.80, 0.66, 0.43], desert);
        // forêts et prairies
        const forest = smoothstep(0.12, 0.42, m.fbm(x / 45 + 7, z / 45, 4)) * (1 - desert) * (1 - south * 0.6) * smoothstep(0.15, 0.6, h + 0.2);
        c = mix(c, [0.26, 0.36, 0.18], forest * 0.75);
        // montagnes : roche puis neige
        c = mix(c, [0.52, 0.47, 0.40], smoothstep(0.75, 1.9, h + v2 * 0.25));
        const snowLine = 1.9 + 0.09 * (46 - lat) + (this.opts.winter ? -0.6 : 0);
        c = mix(c, [0.94, 0.95, 0.97], smoothstep(snowLine, snowLine + 0.5, h + v2 * 0.3));
        // plages
        c = mix(c, [0.82, 0.76, 0.58], 1 - smoothstep(0.8, 3.5, sd));
        const k = 1 + 0.06 * v1 + 0.05 * v2;
        c = [c[0] * k, c[1] * k, c[2] * k];
        // ombrage
        const e = 4, hx = (this.hAt(x + e, z) - this.hAt(x - e, z)) / (2 * e), hz = (this.hAt(x, z + e) - this.hAt(x, z - e)) / (2 * e);
        const nl = Math.hypot(hx, 1, hz);
        const sh = ((-hx * L[0] + 1 * L[1] - hz * L[2]) / nl) / 0.86;
        const f = clamp(0.72 + 0.4 * sh, 0.55, 1.18);
        c = [c[0] * f, c[1] * f, c[2] * f];
      }
      const o = (py * W + px) * 4;
      d[o] = clamp(c[0] * 255, 0, 255); d[o + 1] = clamp(c[1] * 255, 0, 255); d[o + 2] = clamp(c[2] * 255, 0, 255); d[o + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    // fleuves
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const rv of RIVERS) {
      ctx.beginPath();
      rv.pts.forEach(([lo, la], i) => { const [x, z] = proj(lo, la); const px = ((x - MB.x0) / (MB.x1 - MB.x0)) * W, pz = ((z - MB.z0) / (MB.z1 - MB.z0)) * H; i ? ctx.lineTo(px, pz) : ctx.moveTo(px, pz); });
      ctx.strokeStyle = 'rgba(40,86,110,0.9)'; ctx.lineWidth = 1.1 * (W / NX); ctx.stroke();
    }
    this.baseCanvas = cv;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    // couche politique (provinces, frontières, surbrillance)
    this.pol = document.createElement('canvas'); this.pol.width = NX; this.pol.height = NZ;
    this.polTex = new THREE.CanvasTexture(this.pol);
    this.polTex.colorSpace = THREE.SRGBColorSpace;
    // maillage : un sommet toutes les 2 cellules
    const st = 2, gx = Math.floor(NX / st) + 1, gz = Math.floor(NZ / st) + 1;
    const pos = new Float32Array(gx * gz * 3), uv = new Float32Array(gx * gz * 2);
    for (let j = 0; j < gz; j++) for (let i = 0; i < gx; i++) {
      const x = MB.x0 + (i / (gx - 1)) * (MB.x1 - MB.x0), z = MB.z0 + (j / (gz - 1)) * (MB.z1 - MB.z0);
      const k = j * gx + i;
      pos[k * 3] = x; pos[k * 3 + 1] = Math.max(-1.2, this.hAt(x, z)); pos[k * 3 + 2] = z;
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
    tex.flipY = true;
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 });
    this.uPulse = { value: 0 };
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.tPol = { value: this.polTex };
      sh.uniforms.uPulse = this.uPulse;
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform sampler2D tPol;\nuniform float uPulse;')
        .replace('#include <map_fragment>', `#include <map_fragment>
          vec4 pc = texture2D(tPol, vMapUv);
          diffuseColor.rgb = mix(diffuseColor.rgb, pc.rgb, pc.a);`);
    };
    this.ground = new THREE.Mesh(g, mat);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    // bords du monde : mer sombre au-delà de la carte
    const outer = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), new THREE.MeshBasicMaterial({ color: '#173149' }));
    outer.rotation.x = -Math.PI / 2; outer.position.y = -8;
    this.scene.add(outer);
  }
  buildWater() {
    const g = new THREE.PlaneGeometry(MB.x1 - MB.x0, MB.z1 - MB.z0, 1, 1);
    g.rotateX(-Math.PI / 2);
    g.translate((MB.x0 + MB.x1) / 2, 0, (MB.z0 + MB.z1) / 2);
    this.uTime = { value: 0 };
    this.uSun = { value: new THREE.Vector3(0.5, 0.7, 0.3).normalize() };
    // masque des terres : l'eau ne recouvre jamais une île, même petite
    const mk = new Uint8Array(NX * NZ);
    for (let i = 0; i < mk.length; i++) mk[i] = this.sd[i] > 0 ? 255 : 0;
    const mask = new THREE.DataTexture(mk, NX, NZ, THREE.RedFormat, THREE.UnsignedByteType);
    mask.magFilter = mask.minFilter = THREE.LinearFilter; mask.needsUpdate = true;
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uTime: this.uTime, uSun: this.uSun, uSky: { value: new THREE.Color('#a9c4d8') }, tMask: { value: mask }, uB: { value: new THREE.Vector4(MB.x0, MB.z0, MB.x1 - MB.x0, MB.z1 - MB.z0) } },
      vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform float uTime; uniform vec3 uSun; uniform vec3 uSky; uniform sampler2D tMask; uniform vec4 uB; varying vec3 vW;
        float h(vec2 p){ return sin(p.x)*sin(p.y); }
        void main(){
          float land = texture2D(tMask, (vW.xz - uB.xy) / uB.zw).r;
          if (land > 0.5) discard;
          vec2 p = vW.xz * 0.018;
          float t = uTime * 0.6;
          vec2 g = vec2(cos(p.x*1.7 + t) + 0.6*cos(p.x*3.1 - p.y*2.3 + t*1.3), cos(p.y*1.9 - t*0.8) + 0.6*cos(p.y*2.9 + p.x*1.7 - t*1.1));
          vec3 n = normalize(vec3(g.x*0.025, 1.0, g.y*0.025));
          vec3 v = normalize(cameraPosition - vW);
          float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0);
          vec3 r = reflect(-v, n);
          float spec = pow(max(dot(r, uSun), 0.0), 600.0) * smoothstep(1800.0, 300.0, length(cameraPosition - vW));
          vec3 col = uSky * fres * 0.5 + vec3(1.0, 0.96, 0.86) * spec;
          gl_FragColor = vec4(col, clamp(0.12 + fres * 0.35 + spec * 0.6, 0.0, 0.7) * (1.0 - smoothstep(0.25, 0.5, land)));
        }`,
    });
    this.water = new THREE.Mesh(g, mat);
    this.water.renderOrder = 1;
    this.scene.add(this.water);
  }
  buildLights() {
    const s = this.scene;
    s.background = new THREE.Color('#9db7c9');
    s.fog = new THREE.Fog('#9db7c9', 2600, 5200);
    const sun = (this.sun = new THREE.DirectionalLight('#fff4e2', 2.6));
    sun.position.set(-900, 1400, -700); sun.target.position.set(0, 0, 0);
    sun.castShadow = !!this.opts.shadows;
    if (sun.castShadow) {
      sun.shadow.mapSize.set(2048, 2048);
      const c = sun.shadow.camera; c.left = -1600; c.right = 1600; c.top = 1300; c.bottom = -1300; c.near = 10; c.far = 4000;
      sun.shadow.bias = -0.0008;
    }
    s.add(sun, sun.target);
    s.add(new THREE.HemisphereLight('#cfe0f0', '#6a5a3e', 0.9));
    this.uSun.value.copy(sun.position).normalize();
  }

  // ----------------------------------------------------------- villes
  buildCities() {
    const boxes = [], cones = [], cyl = [];
    for (const p of PROVINCES) {
      const c = this.cityPos[p.id];
      const rnd = mulberry(hashStr(p.id));
      const Rr = 7 + p.walls * 3.6;
      // maisons
      const nh = 12 + p.walls * 12;
      for (let i = 0; i < nh; i++) {
        const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * Rr * 0.85;
        const x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r;
        const w = 1.8 + rnd() * 2, hh = 1.3 + rnd() * 1.5 + (r < Rr * 0.3 ? 1.2 : 0);
        const y = this.height(x, z);
        boxes.push([x, y + hh / 2, z, w, hh, w * (0.8 + rnd() * 0.5), rnd() * 0.6, rnd() < 0.5 ? '#d9cbb0' : '#c8b593']);
        cones.push([x, y + hh + 0.45, z, w * 0.78, 0.9, rnd() * 0.6, rnd() < 0.7 ? '#a85a3a' : '#8a4a32']);
      }
      // muraille et tours
      if (p.walls > 0) {
        const k = 18 + p.walls * 6;
        for (let i = 0; i < k; i++) {
          const a = (i / k) * Math.PI * 2;
          const x = c.x + Math.cos(a) * Rr, z = c.z + Math.sin(a) * Rr, y = this.height(x, z);
          const wh = 1.2 + p.walls * 0.8;
          boxes.push([x, y + wh / 2, z, 0.5, wh, (2 * Math.PI * Rr) / k + 0.3, -a, '#bcae92']);
          if (i % 3 === 0) boxes.push([x, y + wh * 0.75, z, 1.6, wh * 1.5, 1.6, -a, '#b2a386']);
        }
      }
      // temple sur l'acropole des grandes villes
      if (p.walls >= 2) { const y = this.height(c.x, c.z); boxes.push([c.x, y + 2.4, c.z, 4.8, 4.8, 7.5, 0.3, '#ebe3d2']); cones.push([c.x, y + 5.4, c.z, 5.1, 2, 0.3 + Math.PI / 4, '#b0603e']); }
      // ports
      if (p.port) {
        let best = null, bd = 1e9;
        for (let a = 0; a < 16; a++) { const x = c.x + Math.cos(a / 16 * Math.PI * 2) * (Rr + 8), z = c.z + Math.sin(a / 16 * Math.PI * 2) * (Rr + 8); const s = this.sdAt(x, z); if (s < bd) { bd = s; best = [x, z, a / 16 * Math.PI * 2]; } }
        if (best && bd < 0) {
          for (let i = 0; i < 3; i++) { const t = (i - 1) * 0.5; boxes.push([best[0] + Math.cos(best[2] + t) * 3, 0.25, best[1] + Math.sin(best[2] + t) * 3, 0.9, 0.5, 4, -best[2] - t, '#5a4632']); }
        }
      }
    }
    const merge = (list, mk) => {
      const geos = [];
      const o = new THREE.Object3D(), col = new THREE.Color();
      for (const b of list) {
        const g = mk(b);
        o.position.set(b[0], b[1], b[2]); o.rotation.set(0, b[6], 0); o.scale.set(b[3], b[4], b[5] || b[3]); o.updateMatrix();
        g.applyMatrix4(o.matrix);
        col.set(b[7]);
        const n = g.attributes.position.count, cc = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { cc[i * 3] = col.r; cc[i * 3 + 1] = col.g; cc[i * 3 + 2] = col.b; }
        g.setAttribute('color', new THREE.BufferAttribute(cc, 3));
        geos.push(g.index ? g.toNonIndexed() : g);
      }
      return mergeGeos(geos);
    };
    const cityGeo = merge(boxes, () => new THREE.BoxGeometry(1, 1, 1));
    const roofGeo = merge(cones.map((c) => [c[0], c[1], c[2], c[3], c[4], c[3], c[5], c[6]]), () => { const g = new THREE.ConeGeometry(0.75, 1, 4); g.rotateY(Math.PI / 4); return g; });
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
    const m1 = new THREE.Mesh(cityGeo, mat), m2 = new THREE.Mesh(roofGeo, mat);
    m1.castShadow = m2.castShadow = true;
    this.scene.add(m1, m2);
    // étendards des villes, aux couleurs du maître
    this.flagTex = [0, 1, 2].map((s) => emblemTexture(s));
    this.cityFlags = {};
    const poleG = new THREE.CylinderGeometry(0.18, 0.18, 13, 5); poleG.translate(0, 6.5, 0);
    const poleM = new THREE.MeshStandardMaterial({ color: '#4a3a28' });
    const flagG = new THREE.PlaneGeometry(6, 4.4); flagG.translate(3, 10.6, 0);
    for (const p of PROVINCES) {
      const c = this.cityPos[p.id], gr = new THREE.Group();
      gr.position.set(c.x, this.height(c.x, c.z) + 1, c.z);
      gr.add(new THREE.Mesh(poleG, poleM));
      const fm = new THREE.Mesh(flagG, new THREE.MeshStandardMaterial({ map: this.flagTex[p.owner], side: THREE.DoubleSide, roughness: 0.8 }));
      gr.add(fm);
      gr.userData.flag = fm;
      this.scene.add(gr);
      this.cityFlags[p.id] = gr;
    }
  }

  // ------------------------------------------- couche politique et surbrillance
  paint(owner, hl = {}, selProv = null) {
    this.owner = owner;
    const ctx = this.pol.getContext('2d');
    const img = ctx.createImageData(NX, NZ), d = img.data;
    const cols = FACTIONS.map((f) => hex(f.color));
    const own = new Int8Array(PROVINCES.length);
    PROVINCES.forEach((p, i) => { own[i] = owner[p.id]; });
    const hlv = new Int8Array(PROVINCES.length);
    PROVINCES.forEach((p, i) => { hlv[i] = hl[p.id] || 0; });
    const selI = selProv ? this.pIndex.indexOf(selProv) : -1;
    const HL = [null, [0.95, 0.82, 0.45], [0.95, 0.3, 0.2], [0.55, 0.8, 0.95]];
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const k = j * NX + i, v = this.pid[k], o = k * 4;
      if (v < 0 || v >= 100 || !this.land[k]) { d[o + 3] = 0; continue; }
      const c = cols[own[v]];
      // frontière : un voisin d'une autre province
      let edge = 0, fEdge = 0;
      for (const kk of [k + 1, k - 1, k + NX, k - NX]) {
        if (kk < 0 || kk >= NX * NZ) continue;
        const w = this.pid[kk];
        if (w !== v && this.land[kk]) { edge = 1; if (w < 0 || w >= 100 || own[w] !== own[v]) fEdge = 1; }
      }
      let r = c[0], g = c[1], b = c[2], a = 0.27;
      if (hlv[v]) { const h = HL[hlv[v]]; r = r * 0.4 + h[0] * 0.6; g = g * 0.4 + h[1] * 0.6; b = b * 0.4 + h[2] * 0.6; a = 0.42; }
      if (v === selI) a += 0.15;
      if (edge) { if (fEdge) { r *= 0.75; g *= 0.75; b *= 0.75; a = 0.95; } else { r = 0.12; g = 0.1; b = 0.08; a = 0.45; } }
      d[o] = r * 255; d[o + 1] = g * 255; d[o + 2] = b * 255; d[o + 3] = a * 255;
    }
    ctx.putImageData(img, 0, 0);
    this.polTex.needsUpdate = true;
    for (const p of PROVINCES) {
      const fm = this.cityFlags[p.id].userData.flag;
      if (fm.material.map !== this.flagTex[owner[p.id]]) { fm.material.map = this.flagTex[owner[p.id]]; fm.material.needsUpdate = true; }
    }
  }

  // ----------------------------------------------------------- armées
  tokenFor(a) {
    let t = this.tokens.get(a.id);
    if (t) return t;
    const gr = new THREE.Group();
    const key = a.side === 0 ? 'gen_rom' : 'gen_carth';
    if (!this.genGeo) this.genGeo = {};
    if (!this.genGeo[key]) this.genGeo[key] = coloredArch(key);
    const fig = new THREE.Mesh(this.genGeo[key], new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 }));
    fig.scale.setScalar(6); fig.castShadow = true;
    gr.add(fig);
    // étendard
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 15, 5), new THREE.MeshStandardMaterial({ color: '#4a3a28' }));
    pole.position.set(-2.4, 7.5, -1); gr.add(pole);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.8), new THREE.MeshStandardMaterial({ map: this.flagTex[a.side], side: THREE.DoubleSide }));
    fl.position.set(0.3, 12.6, -1); gr.add(fl);
    // socle et anneau de sélection
    const base = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 0.6, 20), new THREE.MeshStandardMaterial({ color: FACTIONS[a.side].color, roughness: 0.6 }));
    base.position.y = 0.3; gr.add(base);
    const ring = new THREE.Mesh(new THREE.RingGeometry(5.4, 6.6, 32), new THREE.MeshBasicMaterial({ color: '#f3d58a', transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.35; ring.visible = false; gr.add(ring);
    gr.userData = { ring, fig, flag: fl, id: a.id };
    this.scene.add(gr);
    t = { gr, x: 0, z: 0, ready: false };
    this.tokens.set(a.id, t);
    return t;
  }
  // place les armées : à côté de la ville de leur province
  slotPos(c, a) {
    const here = c.armies.filter((x) => x.prov === a.prov);
    const k = here.indexOf(a), n = here.length;
    const cp = this.cityPos[a.prov];
    const sieging = c.siege[a.prov] && c.siege[a.prov].army === a.id;
    const base = sieging ? 0.6 : 2.4;
    const ang = base + (k - (n - 1) / 2) * 0.75 + (a.side ? Math.PI : 0) * (n > 1 && here.some((x) => x.side !== a.side) ? 1 : 0);
    const r = sieging ? 20 : 26 + p2(PROV[a.prov].walls) * 3.5;
    let x = cp.x + Math.cos(ang) * r, z = cp.z + Math.sin(ang) * r;
    // ne pas poser une armée dans la mer
    for (let i = 0; i < 12 && this.sdAt(x, z) < 3; i++) { const a2 = ang + (i + 1) * 0.55 * (i % 2 ? -1 : 1); x = cp.x + Math.cos(a2) * r; z = cp.z + Math.sin(a2) * r; }
    return [x, z];
  }
  syncArmies(c, animate = true) {
    const alive = new Set(c.armies.map((a) => a.id));
    for (const [id, t] of this.tokens) if (!alive.has(id)) { this.scene.remove(t.gr); this.tokens.delete(id); }
    for (const a of c.armies) {
      const t = this.tokenFor(a);
      const [x, z] = this.slotPos(c, a);
      if (!t.ready || !animate) { t.x = x; t.z = z; t.ready = true; t.gr.position.set(x, this.height(x, z), z); }
      else if (Math.hypot(t.x - x, t.z - z) > 0.5) {
        this.anims.push({ t, x0: t.gr.position.x, z0: t.gr.position.z, x1: x, z1: z, k: 0, dur: Math.min(1.6, 0.5 + Math.hypot(t.gr.position.x - x, t.gr.position.z - z) / 260) });
        t.x = x; t.z = z;
      }
      const g = t.gr.userData;
      g.ring.visible = this.sel === a.id;
      g.ring.material.color.set(a.side === c.player ? '#f3d58a' : '#ff8a70');
    }
  }
  armyAtScreen(c, sx, sy, project) {
    let best = null, bd = 34;
    for (const a of c.armies) {
      const t = this.tokens.get(a.id); if (!t) continue;
      const p = project(t.gr.position.x, t.gr.position.y + 7, t.gr.position.z);
      if (!p) continue;
      const d = Math.hypot(p[0] - sx, p[1] - sy);
      if (d < bd) { bd = d; best = a; }
    }
    return best;
  }
  update(dt) {
    this.time += dt;
    this.uTime.value = this.time;
    this.uPulse.value = 0.5 + 0.5 * Math.sin(this.time * 3);
    for (const an of this.anims) {
      an.k = Math.min(1, an.k + dt / an.dur);
      const e = an.k < 0.5 ? 2 * an.k * an.k : 1 - (-2 * an.k + 2) ** 2 / 2;
      const x = an.x0 + (an.x1 - an.x0) * e, z = an.z0 + (an.z1 - an.z0) * e;
      an.t.gr.position.set(x, this.height(x, z) + Math.abs(Math.sin(an.k * Math.PI * 6)) * 0.8, z);
      an.t.gr.rotation.y = Math.atan2(an.x1 - an.x0, an.z1 - an.z0);
    }
    this.anims = this.anims.filter((a) => a.k < 1);
    for (const t of this.tokens.values()) {
      const r = t.gr.userData.ring;
      if (r.visible) r.scale.setScalar(1 + 0.08 * Math.sin(this.time * 4));
      t.gr.userData.flag.rotation.y = Math.sin(this.time * 2 + t.x) * 0.25;
    }
    for (const id in this.cityFlags) this.cityFlags[id].userData.flag.rotation.y = Math.sin(this.time * 1.7 + this.cityFlags[id].position.x) * 0.3;
  }
  get busy() { return this.anims.length > 0; }
}

// ---------------------------------------------------------------- outils
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
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const hex = (h) => { const c = new THREE.Color(h); return [c.r ** (1 / 2.2), c.g ** (1 / 2.2), c.b ** (1 / 2.2)].map((v) => Math.min(1, v)); };
const p2 = (w) => w;
function hashStr(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry(a) { return () => { let t = (a = (a + 0x6D2B79F5) | 0); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function mergeGeos(geos) {
  let n = 0; for (const g of geos) n += g.attributes.position.count;
  const P = new Float32Array(n * 3), N = new Float32Array(n * 3), C = new Float32Array(n * 3);
  let o = 0;
  for (const g of geos) {
    P.set(g.attributes.position.array, o * 3); N.set(g.attributes.normal.array, o * 3); C.set(g.attributes.color.array, o * 3);
    o += g.attributes.position.count; g.dispose();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  g.setAttribute('color', new THREE.BufferAttribute(C, 3));
  return g;
}
// figurine de général colorée d'après la palette de son archétype
function coloredArch(key) {
  const g = buildArch(key, 0);
  const pal = ARCH[key].pal;
  const m = g.attributes.aMat.array, n = m.length, col = new Float32Array(n * 3), c = new THREE.Color();
  for (let i = 0; i < n; i++) { c.set(pal[m[i]] || '#888888'); c.convertSRGBToLinear(); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', g.attributes.position);
  out.setAttribute('normal', g.attributes.normal);
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return out;
}
// étendards : aigle et SPQR pour Rome, signe de Tanit pour Carthage, triskèle pour les peuples libres
export function emblemTexture(side) {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 96;
  const x = cv.getContext('2d');
  x.fillStyle = FACTIONS[side].color; x.fillRect(0, 0, 128, 96);
  x.fillStyle = 'rgba(0,0,0,0.18)'; x.fillRect(0, 84, 128, 12);
  x.strokeStyle = '#e8c56a'; x.fillStyle = '#e8c56a'; x.lineWidth = 5; x.lineCap = 'round';
  if (side === 0) {
    x.font = '700 30px Georgia, serif'; x.textAlign = 'center'; x.fillText('SPQR', 64, 60);
    x.beginPath(); x.moveTo(30, 24); x.quadraticCurveTo(64, 6, 98, 24); x.stroke();
  } else if (side === 1) {
    x.beginPath(); x.moveTo(64, 34); x.lineTo(44, 80); x.lineTo(84, 80); x.closePath(); x.fill();
    x.fillRect(38, 34, 52, 7);
    x.beginPath(); x.arc(64, 22, 10, 0, Math.PI * 2); x.fill();
  } else {
    for (let i = 0; i < 3; i++) { const a = i * 2.094; x.beginPath(); x.arc(64 + Math.cos(a) * 12, 48 + Math.sin(a) * 12, 12, a, a + 3.6); x.stroke(); }
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export { NX, NZ };
void ADJ;
