/* Art procédural de la carte de campagne : arbres, villes selon les peuples, ports et galères,
   armées en petites troupes avec général et étendard, textures de bruit et de nuages.
   Tout est construit à partir de formes simples, fusionnées en peu d'appels de dessin. */
import * as THREE from 'three';
import { ARCH, buildArch } from './models.js';
import { FACTIONS } from './campaign.js';
import { TYPES } from './data.js';

const TAU = Math.PI * 2;
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();

// ------------------------------------------------------------------ fusion
// Assemble des formes en une seule géométrie à facettes, colorée par sommet.
export class Geo {
  constructor() { this.P = []; this.N = []; this.C = []; this.X = []; }
  add(g, color, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1], extra = 0) {
    const ng = g.index ? g.toNonIndexed() : g;
    _e.set(r[0], r[1], r[2], 'YXZ'); _q.setFromEuler(_e);
    _m.compose(_v.set(p[0], p[1], p[2]), _q, _s.set(s[0], s[1], s[2]));
    ng.applyMatrix4(_m);
    ng.computeVertexNormals();
    _c.set(color);
    const pa = ng.attributes.position.array, na = ng.attributes.normal.array;
    for (let i = 0; i < pa.length; i += 3) {
      this.P.push(pa[i], pa[i + 1], pa[i + 2]); this.N.push(na[i], na[i + 1], na[i + 2]);
      this.C.push(_c.r, _c.g, _c.b); this.X.push(extra);
    }
    if (ng !== g) ng.dispose();
    g.dispose();
    return this;
  }
  box(w, h, d, x, y, z, ry, col, rx = 0, rz = 0) { return this.add(new THREE.BoxGeometry(w, h, d), col, [x, y, z], [rx, ry, rz]); }
  cyl(rt, rb, h, seg, x, y, z, col, s) { return this.add(new THREE.CylinderGeometry(rt, rb, h, seg, 1), col, [x, y, z], [0, 0, 0], s || [1, 1, 1]); }
  cone(r, h, seg, x, y, z, col, ry = 0) { return this.add(new THREE.ConeGeometry(r, h, seg, 1), col, [x, y, z], [0, ry, 0]); }
  // toit à quatre pans
  hip(w, d, h, x, y, z, ry, col) { const g = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1); g.rotateY(Math.PI / 4); return this.add(g, col, [x, y + h / 2, z], [0, ry, 0], [w, h, d]); }
  // toit à deux pentes (prisme triangulaire), faîte le long de z
  gable(w, d, h, x, y, z, ry, col) {
    const sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo(0, h); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2);
    return this.add(g, col, [x, y, z], [0, ry, 0]);
  }
  get count() { return this.P.length / 3; }
  build(extraName) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.P, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.N, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.C, 3));
    if (extraName) g.setAttribute(extraName, new THREE.Float32BufferAttribute(this.X, 1));
    g.computeBoundingSphere();
    return g;
  }
}

// ------------------------------------------------------------------ bruit
// Bruit de valeur périodique (tuile sans couture) : R, G, B, A = quatre fréquences.
export function tileNoise(S = 256, seed = 7) {
  const rnd = mulberry(seed);
  const lat = (L) => { const a = new Float32Array(L * L); for (let i = 0; i < a.length; i++) a[i] = rnd(); return a; };
  const val = (a, L, u, v) => {
    const x = u * L, y = v * L, i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
    const sx = fx * fx * fx * (fx * (fx * 6 - 15) + 10), sy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
    const i0 = ((i % L) + L) % L, j0 = ((j % L) + L) % L, i1 = (i0 + 1) % L, j1 = (j0 + 1) % L;
    const a00 = a[j0 * L + i0], a10 = a[j0 * L + i1], a01 = a[j1 * L + i0], a11 = a[j1 * L + i1];
    return (a00 + (a10 - a00) * sx) * (1 - sy) + (a01 + (a11 - a01) * sx) * sy;
  };
  const fbm = (base, oct, u, v, set) => { let s = 0, w = 0, amp = 1; for (let o = 0; o < oct; o++) { const L = base << o; s += amp * val(set[o], L, u, v); w += amp; amp *= 0.5; } return s / w; };
  const mk = (base, oct) => { const s = []; for (let o = 0; o < oct; o++) s.push(lat(base << o)); return s; };
  const s0 = mk(4, 5), s1 = mk(8, 4), s2 = mk(16, 4), s3 = mk(3, 5);
  const d = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = x / S, v = y / S, i = (y * S + x) * 4;
    d[i] = fbm(4, 5, u, v, s0) * 255;
    d[i + 1] = fbm(8, 4, u, v, s1) * 255;
    d[i + 2] = Math.abs(fbm(16, 4, u, v, s2) - 0.5) * 2 * 255;
    d[i + 3] = fbm(3, 5, u, v, s3) * 255;
  }
  // étirer le contraste (le fbm se resserre autour de 0,5)
  for (let c = 0; c < 4; c++) {
    let lo = 255, hi = 0;
    for (let i = c; i < d.length; i += 4) { if (d[i] < lo) lo = d[i]; if (d[i] > hi) hi = d[i]; }
    const k = 255 / Math.max(1, hi - lo);
    for (let i = c; i < d.length; i += 4) d[i] = (d[i] - lo) * k;
  }
  const t = new THREE.DataTexture(d, S, S, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

// nuage doux pour les sprites
export function cloudTexture() {
  const S = 128, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const x = cv.getContext('2d');
  const rnd = mulberry(5);
  for (let i = 0; i < 26; i++) {
    const r = S * (0.12 + rnd() * 0.16), cx = S / 2 + (rnd() - 0.5) * S * 0.5, cy = S / 2 + (rnd() - 0.5) * S * 0.28;
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'rgba(255,255,255,0.32)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ------------------------------------------------------------------ arbres
// kind : conifer, broad, pine (pin parasol), cypress, palm. Hauteur ≈ 3 unités (km).
export function treeGeometry(kind) {
  const g = new Geo();
  const trunk = '#5b4532';
  if (kind === 'conifer') {
    g.cyl(0.08, 0.12, 0.8, 5, 0, 0.4, 0, trunk);
    g.cone(0.85, 1.5, 7, 0, 1.25, 0, '#3f5a35');
    g.cone(0.66, 1.25, 7, 0, 1.95, 0, '#46633a');
    g.cone(0.42, 0.95, 6, 0, 2.6, 0, '#4d6b3f');
  } else if (kind === 'broad') {
    g.cyl(0.09, 0.14, 1.0, 5, 0, 0.5, 0, trunk);
    g.add(new THREE.IcosahedronGeometry(0.85, 0), '#5d7a3e', [0, 1.65, 0], [0.3, 0.5, 0], [1, 0.85, 1]);
    g.add(new THREE.IcosahedronGeometry(0.62, 0), '#6a8645', [0.45, 2.05, 0.2], [0.1, 1.1, 0], [1, 0.9, 1]);
    g.add(new THREE.IcosahedronGeometry(0.55, 0), '#56723a', [-0.4, 1.95, -0.25], [0.6, 0.2, 0]);
  } else if (kind === 'pine') {
    g.cyl(0.07, 0.11, 1.7, 5, 0, 0.85, 0, trunk);
    g.add(new THREE.IcosahedronGeometry(0.9, 0), '#556b38', [0, 1.95, 0], [0, 0.4, 0], [1.25, 0.42, 1.25]);
  } else if (kind === 'cypress') {
    g.cyl(0.06, 0.08, 0.4, 4, 0, 0.2, 0, trunk);
    g.add(new THREE.IcosahedronGeometry(0.42, 0), '#3e5733', [0, 1.45, 0], [0, 0.3, 0], [0.75, 3.0, 0.75]);
  } else if (kind === 'olive') {
    g.cyl(0.07, 0.11, 0.6, 5, 0, 0.3, 0, '#6a5a48');
    g.add(new THREE.IcosahedronGeometry(0.6, 0), '#7d8a5a', [0, 0.95, 0], [0.2, 0.8, 0], [1.2, 0.7, 1.2]);
  } else { // palmier
    const tr = new THREE.CylinderGeometry(0.05, 0.09, 2.4, 5, 3);
    const p = tr.attributes.position;
    for (let i = 0; i < p.count; i++) { const y = p.getY(i) + 1.2; p.setX(i, p.getX(i) + 0.05 * y * y); }
    g.add(tr, '#7a6248', [0, 1.2, 0]);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU;
      g.add(new THREE.BoxGeometry(0.16, 0.03, 1.1), '#5f7d3a', [0.3 + Math.sin(a) * 0.45, 2.3, Math.cos(a) * 0.45], [0.45, a, 0]);
    }
  }
  return g.build();
}

// matériau des arbres : ils rentrent dans le sol au-delà d'une distance (pas d'apparition brutale)
export function treeMaterial(fade) {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uFade = fade;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform vec2 uFade;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
        vec4 ipw = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        transformed *= 1.0 - smoothstep(uFade.x, uFade.y, distance(ipw.xyz, cameraPosition));
        #endif`);
  };
  m.customProgramCacheKey = () => 'maptree';
  return m;
}

// ------------------------------------------------------------------ galères
// Trirème : coque effilée, éperon, rangs de rames, mât et voile aux couleurs du maître.
export function galleyGeometry(sail = '#e8dcc0', stripe = '#8a2a20') {
  const g = new Geo();
  const hull = new THREE.BoxGeometry(1.0, 0.42, 5.2, 1, 1, 8);
  const p = hull.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const z = p.getZ(i), t = Math.max(0, (Math.abs(z) - 1.3) / 1.3);
    p.setX(i, p.getX(i) * (1 - 0.85 * t * t));
    if (p.getY(i) > 0) p.setY(i, p.getY(i) + 0.35 * t * t * (z < 0 ? 1.4 : 0.6));
  }
  g.add(hull, '#5a3e28', [0, 0.18, 0]);
  g.box(0.9, 0.08, 4.4, 0, 0.42, 0, 0, '#7a5a3a');
  // éperon de bronze
  g.add(new THREE.ConeGeometry(0.09, 0.7, 4), '#a8823c', [0, 0.05, 2.9], [Math.PI / 2, 0, 0]);
  for (const sd of [-1, 1]) g.add(new THREE.BoxGeometry(1.1, 0.03, 3.4), '#6a4e30', [sd * 0.95, 0.12, -0.1], [0, 0, sd * 0.35]);
  g.cyl(0.04, 0.05, 2.6, 5, 0, 1.6, 0.2, '#4a3624');
  g.box(1.9, 0.05, 0.05, 0, 2.7, 0.2, 0, '#4a3624');
  const sl = new THREE.PlaneGeometry(1.8, 1.5, 4, 2);
  const sp = sl.attributes.position;
  for (let i = 0; i < sp.count; i++) sp.setZ(i, 0.18 * (1 - (sp.getX(i) / 0.9) ** 2));
  g.add(sl, sail, [0, 1.92, 0.24]);
  g.box(1.8, 0.24, 0.04, 0, 2.15, 0.33, 0, stripe);
  g.box(0.5, 0.3, 0.5, 0, 0.62, -2.0, 0, '#6a4e30');
  return g.build();
}

// ------------------------------------------------------------------ villes
// Construit les agglomérations : muraille, tours et portes, maisons selon le peuple,
// temples et monuments ; ports et quais. Renvoie la géométrie fusionnée et les postes des navires.
const STYLE = {
  latin: 'tile', italic: 'tile', greek: 'tile', punic: 'punic', libyan: 'flat', iber: 'flat', balear: 'flat',
  gaul: 'hut', ligur: 'hut', numid: 'tent', maur: 'tent', sard: 'nuraghe',
};
export function buildSettlements(provs, ctx) {
  const g = new Geo();
  const ships = [];
  const H = ctx.h; // hauteur du maillage
  for (const p of provs) {
    const c = ctx.cityPos[p.id];
    const rnd = mulberry(hashStr(p.id));
    const st = STYLE[p.cult] || 'tile';
    const Rr = ctx.radius(p);
    const ang0 = rnd() * TAU;
    const gates = ctx.gates[p.id] || [];
    const nearGate = (a) => gates.some((b) => Math.abs(angDiff(a, b)) < 0.24);
    const inStreet = (x, z) => {
      const dx = x - c.x, dz = z - c.z, r = Math.hypot(dx, dz);
      if (r < Rr * 0.22) return true;
      for (const b of gates) { const t = dx * Math.cos(b) + dz * Math.sin(b), n = Math.abs(-dx * Math.sin(b) + dz * Math.cos(b)); if (t > 0 && n < 0.75) return true; }
      return false;
    };
    const rock = st === 'flat' || st === 'tent' ? '#c9a77a' : st === 'hut' ? '#8a7a62' : '#c7b48f';
    // ------------------------------------------------ muraille
    if (p.walls > 0) {
      const K = 14 + p.walls * 6, wh = 0.9 + p.walls * 0.55, th = 0.45 + p.walls * 0.12;
      const pts = [];
      for (let i = 0; i < K; i++) {
        const a = ang0 + (i / K) * TAU;
        const rr = Rr * (1 + 0.07 * Math.sin(a * 3 + p.walls) + 0.05 * (rnd() - 0.5));
        pts.push([c.x + Math.cos(a) * rr, c.z + Math.sin(a) * rr, a]);
      }
      const wallCol = st === 'hut' ? '#6e5a3e' : st === 'punic' ? '#d2c3a4' : '#b9aa8c';
      for (let i = 0; i < K; i++) {
        const [x0, z0, a0] = pts[i], [x1, z1] = pts[(i + 1) % K];
        const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, len = Math.hypot(x1 - x0, z1 - z0);
        const am = a0 + Math.PI / K;
        if (nearGate(am)) {
          // porte : deux tours carrées et un linteau
          const gx = Math.cos(am - Math.PI / 2), gz = Math.sin(am - Math.PI / 2);
          for (const sd of [-1, 1]) { const tx = mx + gx * sd * len * 0.32, tz = mz + gz * sd * len * 0.32; g.box(1.1, wh * 1.9, 1.1, tx, H(tx, tz) + wh * 0.8, tz, -am, wallCol); g.hip(1.25, 1.25, 0.5, tx, H(tx, tz) + wh * 1.75, tz, -am, '#9a5a3a'); }
          continue;
        }
        const y = Math.min(H(x0, z0), H(x1, z1), H(mx, mz));
        const top = Math.max(H(x0, z0), H(x1, z1), H(mx, mz));
        const hh = wh + (top - y);
        g.box(th, hh, len + th * 0.6, mx, y + hh / 2 - 0.15, mz, Math.atan2(x1 - x0, z1 - z0), wallCol);
        if (i % (p.walls >= 2 ? 2 : 3) === 0) {
          const ty = H(x0, z0);
          if (st === 'hut') g.box(0.9, wh * 1.6, 0.9, x0, ty + wh * 0.7, z0, a0, '#5e4a30');
          else { g.cyl(0.55 + p.walls * 0.1, 0.65 + p.walls * 0.1, wh * 1.7, 8, x0, ty + wh * 0.75, z0, wallCol); if (p.walls >= 2) g.cone(0.75 + p.walls * 0.1, 0.7, 8, x0, ty + wh * 1.95, z0, '#9e5d3c'); }
        }
      }
    }
    // ------------------------------------------------ maisons
    const sp = st === 'hut' || st === 'tent' ? 2.1 : 1.75;
    const lim = Rr * (p.walls ? 0.9 : 1.0);
    const ca = Math.cos(ang0), sa = Math.sin(ang0);
    for (let gx = -lim; gx <= lim; gx += sp) for (let gz = -lim; gz <= lim; gz += sp) {
      const lx = gx + (rnd() - 0.5) * sp * 0.45, lz = gz + (rnd() - 0.5) * sp * 0.45;
      const r = Math.hypot(lx, lz);
      if (r > lim) continue;
      if (!p.walls && rnd() > 1.05 - r / lim) continue; // bourgade : moins dense au bord
      const x = c.x + lx * ca - lz * sa, z = c.z + lx * sa + lz * ca;
      if (inStreet(x, z) || ctx.sd(x, z) < 1.2) continue;
      const y = H(x, z);
      const core = 1 - r / lim;
      if (st === 'hut') {
        const rr = 0.55 + rnd() * 0.3;
        g.cyl(rr, rr, 0.55, 7, x, y + 0.27, z, '#8a7356');
        g.cone(rr * 1.25, 0.95 + rnd() * 0.3, 7, x, y + 0.98, z, rnd() < 0.5 ? '#a08a52' : '#8e7a48');
      } else if (st === 'tent') {
        if (rnd() < 0.45) { const w = 1.2 + rnd() * 0.6; g.box(w, 0.6 + rnd() * 0.3, w * (0.8 + rnd() * 0.4), x, y + 0.3, z, ang0 + rnd() * 0.3, '#c29a6a'); }
        else g.add(new THREE.ConeGeometry(0.75, 0.8, 4, 1), rnd() < 0.5 ? '#6e5640' : '#8a6e50', [x, y + 0.4, z], [0, rnd() * TAU, 0], [1.2, 1, 0.8]);
      } else {
        const w = 1.1 + rnd() * 0.7, d = 1.1 + rnd() * 0.8, hh = 0.75 + rnd() * 0.6 + core * 0.9 * (st === 'tile' ? 1 : 0.6);
        const wc = st === 'flat' ? (rnd() < 0.5 ? '#c9ab80' : '#b99a70') : st === 'punic' ? (rnd() < 0.6 ? '#e6dcc6' : '#d4c4a2') : rnd() < 0.5 ? '#ddd0b4' : '#cdbb98';
        const ry = ang0 + (rnd() - 0.5) * 0.12;
        g.box(w, hh, d, x, y + hh / 2 - 0.1, z, ry, wc);
        if (st === 'tile' || (st === 'punic' && rnd() < 0.35)) g.hip(w * 1.12, d * 1.12, 0.45 + w * 0.12, x, y + hh - 0.1, z, ry, rnd() < 0.7 ? '#b0603e' : '#9a5236');
        else if (st === 'nuraghe' && rnd() < 0.3) g.cone(w * 0.7, 0.6, 6, x, y + hh + 0.2, z, '#8a7a5a');
      }
    }
    // ------------------------------------------------ monuments
    const hiPt = (() => { let best = [c.x, c.z], bh = -1e9; for (let i = 0; i < 18; i++) { const a = rnd() * TAU, r = rnd() * Rr * 0.5; const x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r; const h = H(x, z); if (h > bh && !inStreet(x, z)) { bh = h; best = [x, z]; } } return best; })();
    if (p.walls >= 2 && (st === 'tile' || st === 'punic')) temple(g, hiPt[0], H(hiPt[0], hiPt[1]), hiPt[1], ang0, 1 + (p.walls - 2) * 0.4);
    if (st === 'nuraghe') for (let i = 0; i < 2; i++) { const a = rnd() * TAU, x = c.x + Math.cos(a) * Rr * 1.4, z = c.z + Math.sin(a) * Rr * 1.4; if (ctx.sd(x, z) > 1) { g.cyl(1.0, 1.5, 2.4, 9, x, H(x, z) + 1.1, z, '#8f8068'); g.cyl(1.1, 1.0, 0.25, 9, x, H(x, z) + 2.4, z, '#7d705a'); } }
    if (p.id === 'roma') {
      // Capitole, forum et Circus Maximus
      const [tx, tz] = [c.x - Rr * 0.25, c.z - Rr * 0.2];
      temple(g, tx, H(tx, tz) + 0.4, tz, ang0, 1.6);
      const cx = c.x + Rr * 0.35, cz = c.z + Rr * 0.25;
      for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; const x = cx + Math.cos(a) * 4.2, z = cz + Math.sin(a) * 1.5; g.box(0.5, 0.7, 1.05, x, H(x, z) + 0.3, z, Math.atan2(Math.cos(a) * 4.2, -Math.sin(a) * 1.5) + Math.PI / 2, '#d8cbb0'); }
      g.box(5.2, 0.12, 1.4, cx, H(cx, cz) + 0.05, cz, 0, '#c8a876');
    }
    if (p.id === 'carthago') {
      // Byrsa et le port circulaire (cothon) avec l'îlot de l'amirauté
      temple(g, c.x, H(c.x, c.z) + 0.6, c.z, ang0, 1.5);
      const sa2 = ctx.seaDir(p.id);
      if (sa2 !== null) {
        const hx = c.x + Math.cos(sa2) * Rr * 0.62, hz = c.z + Math.sin(sa2) * Rr * 0.62, hy = H(hx, hz);
        g.add(new THREE.CylinderGeometry(4.0, 4.0, 0.3, 28), '#2f5a6e', [hx, hy + 0.05, hz]);
        g.cyl(1.3, 1.4, 0.6, 16, hx, hy + 0.3, hz, '#d8ccb2');
        g.cyl(0.6, 0.6, 1.4, 10, hx, hy + 1.2, hz, '#e6dcc6');
        g.cone(0.8, 0.6, 10, hx, hy + 2.2, hz, '#9e5d3c');
        for (let i = 0; i < 30; i++) { const a = (i / 30) * TAU; const x = hx + Math.cos(a) * 4.5, z = hz + Math.sin(a) * 4.5; g.box(0.45, 0.7, 1.2, x, H(x, z) + 0.3, z, -a + Math.PI / 2, '#d4c4a2'); }
      }
    }
    if (p.id === 'syracusae' || p.id === 'tarentum' || p.id === 'massalia') {
      // théâtre grec adossé à la colline
      const a = ang0 + 2.2, x0 = c.x + Math.cos(a) * Rr * 0.5, z0 = c.z + Math.sin(a) * Rr * 0.5;
      for (let r = 0; r < 3; r++) for (let i = 0; i <= 8; i++) { const b = a + Math.PI / 2 + (i / 8) * Math.PI; const x = x0 + Math.cos(b) * (1.6 + r * 0.6), z = z0 + Math.sin(b) * (1.6 + r * 0.6); g.box(0.5, 0.3 + r * 0.3, 0.55, x, H(x, z) + 0.1 + r * 0.15, z, -b, '#ddd2bb'); }
    }
    // ------------------------------------------------ villas et fermes alentour
    const nv = 3 + p.walls * 3;
    for (let i = 0; i < nv; i++) {
      const a = rnd() * TAU, r = Rr * (1.5 + rnd() * 1.6);
      const x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r;
      if (ctx.sd(x, z) < 1.5) continue;
      const y = H(x, z);
      if (st === 'hut') { g.cyl(0.6, 0.6, 0.5, 7, x, y + 0.25, z, '#8a7356'); g.cone(0.8, 0.9, 7, x, y + 0.9, z, '#a08a52'); }
      else if (st === 'tent') g.add(new THREE.ConeGeometry(0.75, 0.8, 4, 1), '#6e5640', [x, y + 0.4, z], [0, a, 0], [1.2, 1, 0.8]);
      else { const ry = a; g.box(1.6, 0.8, 1.1, x, y + 0.35, z, ry, '#d8c8a6'); g.hip(1.8, 1.25, 0.55, x, y + 0.75, z, ry, '#a85a3a'); g.box(1.0, 0.6, 0.9, x + Math.cos(a) * 1.4, H(x + Math.cos(a) * 1.4, z + Math.sin(a) * 1.4) + 0.25, z + Math.sin(a) * 1.4, ry, '#cdbb98'); }
    }
    // ------------------------------------------------ port : quai, jetées, navires
    if (p.port) {
      const sa3 = ctx.seaDir(p.id);
      if (sa3 !== null) {
        let r = Rr * 0.7; while (r < Rr * 3 && ctx.sd(c.x + Math.cos(sa3) * r, c.z + Math.sin(sa3) * r) > 0.3) r += 0.5;
        const qx = c.x + Math.cos(sa3) * r, qz = c.z + Math.sin(sa3) * r;
        const tx = -Math.sin(sa3), tz = Math.cos(sa3);
        g.box(0.9, 0.4, 7 + p.walls * 2, qx, 0.2, qz, Math.atan2(tx, tz), '#9a8a6a');
        for (const k of [-1, 0, 1]) {
          const px = qx + tx * k * 2.8 + Math.cos(sa3) * 1.8, pz = qz + tz * k * 2.8 + Math.sin(sa3) * 1.8;
          g.box(0.5, 0.25, 3.4, px, 0.15, pz, Math.atan2(Math.cos(sa3), Math.sin(sa3)), '#6a5034');
          if (k !== 0 || p.walls >= 2) ships.push({ x: px + tx * 1.1 + Math.cos(sa3) * 0.6, z: pz + tz * 1.1 + Math.sin(sa3) * 0.6, a: Math.atan2(Math.cos(sa3), Math.sin(sa3)), prov: p.id });
        }
        // phare des grands ports
        if (p.walls >= 2) { const lx = qx + Math.cos(sa3) * 4.5 + tx * 4, lz = qz + Math.sin(sa3) * 4.5 + tz * 4; if (ctx.sd(lx, lz) < 0) { g.box(1.0, 0.4, 1.0, lx, 0.2, lz, 0, '#a89a7a'); g.cyl(0.35, 0.5, 3.2, 8, lx, 1.9, lz, '#e0d6c0'); g.cyl(0.42, 0.42, 0.4, 8, lx, 3.6, lz, '#f2c46a'); } }
      }
    }
  }
  return { geo: g.build(), ships };
}
function temple(g, x, y, z, ry, k = 1) {
  const w = 2.6 * k, d = 4.2 * k, ch = 1.5 * k;
  g.box(w + 0.6, 0.45, d + 0.8, x, y + 0.1, z, ry, '#d6ccb4');
  g.box(w * 0.62, ch, d * 0.7, x, y + 0.3 + ch / 2, z, ry, '#ebe3d1');
  const ca = Math.cos(ry), sa = Math.sin(ry);
  const col = (lx, lz) => g.cyl(0.11 * k, 0.12 * k, ch, 6, x + lx * ca + lz * sa, y + 0.32 + ch / 2, z - lx * sa + lz * ca, '#f2ecdf');
  for (let i = 0; i < 6; i++) { const lz = -d / 2 + 0.2 + (i / 5) * (d - 0.4); col(-w / 2 + 0.1, lz); col(w / 2 - 0.1, lz); }
  for (let i = 1; i < 4; i++) { const lx = -w / 2 + 0.1 + (i / 4) * (w - 0.2); col(lx, d / 2 - 0.2); col(lx, -d / 2 + 0.2); }
  g.box(w + 0.1, 0.22, d + 0.1, x, y + 0.42 + ch, z, ry, '#e2d8c2');
  g.gable(w + 0.3, d + 0.3, 0.75 * k, x, y + 0.52 + ch, z, ry, '#b4643f');
}

// ------------------------------------------------------------------ siège
// Camp de siège tourné vers la ville (+z) : palissade, tentes, tour d'assaut et bélier.
export function siegeGeometry() {
  const g = new Geo();
  for (let i = 0; i < 9; i++) {
    const a = -0.9 + (i / 8) * 1.8;
    g.box(0.22, 0.75, 2.0, Math.sin(a) * 9, 0.35, Math.cos(a) * 9 - 4, a + Math.PI / 2, '#6a5034');
  }
  for (let i = 0; i < 7; i++) {
    const a = -1.2 + (i / 6) * 2.4, r = 7.5 + (i % 2) * 2.2;
    g.add(new THREE.ConeGeometry(0.9, 1.0, 4, 1), i % 3 ? '#cdb994' : '#b8a27a', [Math.sin(a) * r, 0.5, -Math.cos(a) * r * 0.6 - 2], [0, a, 0], [1, 1, 1.4]);
  }
  // tour d'assaut sur roues
  const tw = new THREE.BoxGeometry(1.6, 4.4, 1.6, 1, 3, 1);
  const tp = tw.attributes.position; for (let i = 0; i < tp.count; i++) { const k = 1 - 0.18 * (tp.getY(i) + 2.2) / 4.4; tp.setX(i, tp.getX(i) * k); tp.setZ(i, tp.getZ(i) * k); }
  g.add(tw, '#7a5a38', [2.2, 2.3, 4.5]);
  g.box(1.5, 0.15, 1.5, 2.2, 4.55, 4.5, 0, '#5a4028');
  g.box(1.0, 0.9, 0.08, 2.2, 3.7, 5.3, 0, '#9a8060');
  for (const sx of [-0.7, 0.7]) for (const sz of [-0.6, 0.6]) g.add(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 8), '#4a3624', [2.2 + sx, 0.28, 4.5 + sz], [0, 0, Math.PI / 2]);
  // bélier sous son toit
  g.box(0.9, 0.7, 2.6, -2.4, 0.55, 4.0, 0, '#6a4e30');
  g.hip(1.1, 2.8, 0.5, -2.4, 0.9, 4.0, 0, '#5a4028');
  g.add(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 6), '#8a6a45', [-2.4, 0.5, 5.2], [Math.PI / 2, 0, 0]);
  return g.build();
}

// ------------------------------------------------------------------ étendards
// emblèmes : aigle et SPQR pour Rome, signe de Tanit pour Carthage, triskèle pour les peuples libres
export function emblemTexture(side) {
  const W = 256, Hh = 184, cv = document.createElement('canvas'); cv.width = W; cv.height = Hh;
  const x = cv.getContext('2d');
  const col = FACTIONS[side].color;
  x.fillStyle = col; x.fillRect(0, 0, W, Hh);
  const gr = x.createLinearGradient(0, 0, 0, Hh); gr.addColorStop(0, 'rgba(255,255,255,0.12)'); gr.addColorStop(1, 'rgba(0,0,0,0.28)');
  x.fillStyle = gr; x.fillRect(0, 0, W, Hh);
  x.strokeStyle = '#d9b45e'; x.lineWidth = 7; x.strokeRect(9, 9, W - 18, Hh - 18);
  // franges
  x.fillStyle = '#d9b45e';
  for (let i = 0; i < 16; i++) x.fillRect(8 + i * 15.5, Hh - 12, 7, 12);
  x.fillStyle = '#ecc86c'; x.strokeStyle = '#ecc86c'; x.lineCap = 'round'; x.lineJoin = 'round';
  const cx = W / 2;
  if (side === 0) {
    // aigle aux ailes déployées
    x.beginPath();
    x.moveTo(cx, 38); x.quadraticCurveTo(cx + 12, 44, cx + 8, 58);
    x.quadraticCurveTo(cx + 40, 30, cx + 78, 36); x.quadraticCurveTo(cx + 54, 52, cx + 64, 58); x.quadraticCurveTo(cx + 34, 62, cx + 14, 80);
    x.lineTo(cx + 18, 100); x.lineTo(cx, 92); x.lineTo(cx - 18, 100); x.lineTo(cx - 14, 80);
    x.quadraticCurveTo(cx - 34, 62, cx - 64, 58); x.quadraticCurveTo(cx - 54, 52, cx - 78, 36); x.quadraticCurveTo(cx - 40, 30, cx - 8, 58);
    x.quadraticCurveTo(cx - 12, 44, cx, 38); x.fill();
    x.font = '700 40px Georgia, "Times New Roman", serif'; x.textAlign = 'center'; x.fillText('SPQR', cx, 150);
  } else if (side === 1) {
    // signe de Tanit
    x.beginPath(); x.arc(cx, 52, 20, 0, TAU); x.fill();
    x.fillRect(cx - 52, 78, 104, 13);
    x.beginPath(); x.moveTo(cx, 82); x.lineTo(cx - 40, 160); x.lineTo(cx + 40, 160); x.closePath(); x.fill();
    x.lineWidth = 6; x.beginPath(); x.moveTo(cx - 52, 84); x.lineTo(cx - 60, 66); x.moveTo(cx + 52, 84); x.lineTo(cx + 60, 66); x.stroke();
    x.beginPath(); x.arc(cx, 30, 26, Math.PI * 0.15, Math.PI * 0.85, false); x.stroke();
  } else {
    x.lineWidth = 9;
    for (let i = 0; i < 3; i++) { const a = i * 2.094 - 1.57; x.beginPath(); x.arc(cx + Math.cos(a) * 24, 92 + Math.sin(a) * 24, 24, a + 0.4, a + 3.9); x.stroke(); }
    x.beginPath(); x.arc(cx, 92, 6, 0, TAU); x.fill();
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// étoffe qui ondule au vent (le tissu est accroché au bord x = 0)
export function bannerMaterial(tex, uTime, width) {
  const m = new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.85 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\nuniform float uTime;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float bw = clamp(position.x / ${width.toFixed(2)}, 0.0, 1.0);
        float ph = (modelMatrix[3].x + modelMatrix[3].z) * 0.37;
        transformed.z += sin(position.x * 1.25 - uTime * 4.2 + ph) * 0.42 * bw + sin(position.y * 2.0 - uTime * 2.7 + ph) * 0.12 * bw;
        transformed.y -= 0.22 * bw * bw;`);
  };
  m.customProgramCacheKey = () => 'banner' + width.toFixed(2);
  return m;
}
export function bannerGeometry(w, h) { const g = new THREE.PlaneGeometry(w, h, 10, 4); g.translate(w / 2, 0, 0); return g; }

// ------------------------------------------------------------------ armées
// Une petite troupe : le général à cheval, le porte-étendard, deux rangs de soldats choisis
// d'après la composition réelle de l'armée, un éléphant s'il y en a.
const _archGeo = {};
function coloredArch(key, lod = 0) {
  const k = key + lod;
  if (_archGeo[k]) return _archGeo[k];
  const g = buildArch(key, lod);
  const pal = ARCH[key].pal;
  const m = g.attributes.aMat.array, n = m.length, col = new Float32Array(n * 3), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    let hex = pal[m[i]] || '#888888';
    if (m[i] === 7) hex = pal[16] || hex;
    if (m[i] === 12) hex = pal[20] || hex;
    c.set(hex); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', g.attributes.position);
  out.setAttribute('normal', g.attributes.normal);
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  _archGeo[k] = out;
  return out;
}
export function armyComposition(a) {
  const inf = {}, cav = {};
  let ele = 0;
  for (const u of a.units) {
    const T = TYPES[u.type]; if (!T) continue;
    const kind = ARCH[T.arch] ? ARCH[T.arch].kind : 'human';
    if (kind === 'elephant') ele++;
    else if (kind === 'rider') cav[T.arch] = (cav[T.arch] || 0) + u.men;
    else inf[T.arch] = (inf[T.arch] || 0) + u.men;
  }
  const top = (o) => Object.entries(o).sort((x, y) => y[1] - x[1]).map((e) => e[0]);
  const fallback = a.side === 0 ? 'hastatus' : a.side === 1 ? 'libyan' : 'gaul';
  const I = top(inf), C = top(cav);
  return { front: I[0] || fallback, back: I[1] || I[0] || fallback, cav: C[0] || null, ele: ele > 0 };
}
export function armyGeometry(a) {
  const comp = armyComposition(a);
  const g = new Geo();
  const put = (key, x, z, ry = 0, s = 1, fig = 0) => {
    const src = coloredArch(key);
    const ng = new THREE.BufferGeometry();
    ng.setAttribute('position', src.attributes.position.clone());
    ng.setAttribute('normal', src.attributes.normal.clone());
    _e.set(0, ry, 0); _q.setFromEuler(_e); _m.compose(_v.set(x, 0, z), _q, _s.set(s, s, s));
    ng.applyMatrix4(_m);
    const pa = ng.attributes.position.array, na = ng.attributes.normal.array, ca = src.attributes.color.array;
    for (let i = 0; i < pa.length; i += 3) { g.P.push(pa[i], pa[i + 1], pa[i + 2]); g.N.push(na[i], na[i + 1], na[i + 2]); g.C.push(ca[i], ca[i + 1], ca[i + 2]); g.X.push(fig); }
    ng.dispose();
  };
  const genKey = FACTIONS[a.side].gen;
  put(genKey, 0, 1.6, 0, 1.15, 0);
  let f = 1;
  for (let i = -1; i <= 1; i++) put(comp.front, i * 1.05, -0.3, 0, 1, f++);
  for (let i = -1.5; i <= 1.5; i += 1) put(comp.back, i * 1.05, -1.4, 0, 1, f++);
  if (comp.cav) put(comp.cav, 2.6, -0.6, 0, 1, f++);
  if (comp.ele) put('elephant', -2.9, -0.8, 0, 0.85, f++);
  return { geo: g.build('aFig'), comp };
}
export function armyMaterial(uTime) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.72, metalness: 0.05 });
  m.userData.uWalk = { value: 0 };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime; sh.uniforms.uWalk = m.userData.uWalk;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aFig; uniform float uTime; uniform float uWalk;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        transformed.y += uWalk * abs(sin(uTime * 7.0 + aFig * 1.9)) * 0.09;`);
  };
  m.customProgramCacheKey = () => 'mapArmy';
  return m;
}

// ------------------------------------------------------------------ outils
export function hashStr(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function mulberry(a) { return () => { let t = (a = (a + 0x6D2B79F5) | 0); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }
