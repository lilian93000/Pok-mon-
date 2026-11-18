/* Terrain des batailles : relief, rivière, nature du sol.
   Partie « pure » (sans Three.js) : la simulation l'utilise pour les pentes et les gués,
   le rendu pour le maillage, la texture du sol et la végétation.

   Repère : x vers l'est, z vers le sud (le nord est en -z), y vers le haut, en mètres.
   Le champ fait 6 km × 6 km, centré sur le point de rencontre des deux armées. */
import { makeNoise2D, smoothstep, clamp } from './noise.js';

export const HALF = 3000;

export class Terrain {
  constructor(kind = 'cannae', seed = 7) {
    this.kind = kind;
    this.n = makeNoise2D(seed);
    this.m = makeNoise2D(seed * 3 + 1);
    this.N = 385;
    this.size = HALF * 2;
    this.cell = this.size / (this.N - 1);
    this.hasRiver = kind === 'cannae';
    this.h = new Float32Array(this.N * this.N);
    for (let j = 0; j < this.N; j++) {
      const z = -HALF + j * this.cell;
      for (let i = 0; i < this.N; i++) {
        const x = -HALF + i * this.cell;
        this.h[j * this.N + i] = this.raw(x, z);
      }
    }
  }

  // Tracé de l'Aufide (Ofanto) : il longe le flanc droit romain, à l'ouest du champ
  riverX(z) {
    return -1330 + 95 * Math.sin(z / 610 + 0.7) + 42 * Math.sin(z / 233 + 2.1) - 0.00006 * Math.max(0, z - 900) ** 2;
  }
  riverDist(x, z) {
    if (!this.hasRiver) return 1e9;
    const dz = 2;
    const slope = (this.riverX(z + dz) - this.riverX(z - dz)) / (2 * dz);
    return Math.abs(x - this.riverX(z)) / Math.sqrt(1 + slope * slope);
  }

  raw(x, z) {
    const n = this.n;
    if (this.kind === 'zama') {
      let h = 7 * n.fbm(x / 1700, z / 1700, 4) + 1.2 * n.fbm(x / 260 + 3, z / 260, 3);
      const flat = 1 - 0.55 * (1 - smoothstep(900, 1700, Math.max(Math.abs(x) * 0.9, Math.abs(z))));
      h *= flat;
      h += 22 * smoothstep(1500, 2900, z) * (0.6 + 0.4 * n.fbm(x / 900, 9));
      h += 30 * Math.exp(-(((x + 1900) / 600) ** 2 + ((z + 2100) / 450) ** 2));
      h += 16 * Math.exp(-(((x - 2200) / 500) ** 2 + ((z - 600) / 700) ** 2));
      h += 10 * smoothstep(-1800, -2900, z);
      // oued à sec, au nord-est
      const wx = 1900 + 120 * Math.sin(z / 400);
      h -= 3.5 * Math.exp(-(((x - wx) / 28) ** 2));
      return h;
    }
    // Cannes : plaine d'Apulie, colline de Cannes au sud-est, Aufide à l'ouest
    let h = 4.2 * n.fbm(x / 1500, z / 1500, 4) + 1.1 * n.fbm(x / 300 + 5, z / 300, 3);
    const core = 1 - smoothstep(700, 1500, Math.max(Math.abs(x) * 0.8, Math.abs(z)));
    h *= 1 - 0.5 * core;
    h += 7 * smoothstep(1400, 3000, x);
    h += 44 * Math.exp(-(((x - 900) / 430) ** 2 + ((z - 1950) / 330) ** 2)); // colline de Cannes
    h += 20 * Math.exp(-(((x - 1600) / 700) ** 2 + ((z - 2450) / 520) ** 2));
    h += 14 * smoothstep(1600, 2950, z) * (0.6 + 0.4 * n.fbm(x / 700, 3.3));
    h += 11 * smoothstep(-1900, -2950, z) * (0.7 + 0.3 * n.fbm(x / 800, 7.7));
    h += 7 * smoothstep(-1500, -2900, x);
    const d = this.riverDist(x, z);
    h -= 5.5 * Math.exp(-((d / 170) ** 2));
    h -= 3.4 * (1 - smoothstep(22, 46, d));
    return h;
  }

  // Altitude interpolée (bilinéaire) ; hors carte, relief lointain analytique
  height(x, z) {
    const fx = (x + HALF) / this.cell, fz = (z + HALF) / this.cell;
    if (fx < 0 || fz < 0 || fx >= this.N - 1 || fz >= this.N - 1) return this.far(x, z);
    const i = fx | 0, j = fz | 0, tx = fx - i, tz = fz - j;
    const N = this.N, h = this.h, k = j * N + i;
    const a = h[k], b = h[k + 1], c = h[k + N], e = h[k + N + 1];
    return (a + (b - a) * tx) * (1 - tz) + (c + (e - c) * tx) * tz;
  }

  // Collines lointaines jusqu'à l'horizon (Apennins à l'ouest pour Cannes)
  far(x, z) {
    const r = Math.max(Math.abs(x), Math.abs(z));
    const t = smoothstep(HALF, HALF * 4, r);
    const base = this.raw(clamp(x, -HALF, HALF), clamp(z, -HALF, HALF));
    const hills = 60 * this.m.ridge(x / 5000, z / 5000, 4) * t + 140 * smoothstep(9000, 30000, -x) * (this.kind === 'cannae' ? 1 : 0.4);
    return base * (1 - t) + hills + 8 * t;
  }

  slopeAlong(x, z, dx, dz) {
    return (this.height(x + dx * 4, z + dz * 4) - this.height(x - dx * 4, z - dz * 4)) / 8;
  }

  // Eau : profondeur d'eau au point (0 = terre ferme)
  waterLevelAt(z) {
    const x = this.riverX(z);
    return this.raw(x, z) + 2.3;
  }
  inWater(x, z) {
    if (!this.hasRiver) return false;
    if (this.riverDist(x, z) > 50) return false;
    return this.height(x, z) < this.waterLevelAt(z) - 0.3;
  }

  // Couleur du sol (sRGB 0-1) : chaumes de blé moissonné, friches, labours, berges.
  // Début août en Apulie : tout est sec et doré, sauf le long de l'eau.
  groundColor(x, z) {
    const n = this.n, m = this.m;
    const zama = this.kind === 'zama';
    // parcelles agricoles (champs orientés comme un cadastre)
    const a = 0.32, ca = Math.cos(a), sa = Math.sin(a);
    const u = x * ca - z * sa, v = x * sa + z * ca;
    const pu = Math.floor(u / 170), pv = Math.floor(v / 240);
    const r = (((pu * 73856093) ^ (pv * 19349663)) >>> 0) % 1000 / 1000;
    let c;
    // limites de parcelles irrégulières
    const wob = 0;
    const pu2 = Math.floor(u / 170 + wob), pv2 = Math.floor(v / 240 - wob);
    const r2 = (((pu2 * 73856093) ^ (pv2 * 19349663)) >>> 0) % 1000 / 1000;
    if (zama) {
      const pal = [[0.69, 0.53, 0.35], [0.65, 0.5, 0.33], [0.71, 0.57, 0.38], [0.62, 0.51, 0.34], [0.67, 0.55, 0.36]];
      c = pal[(r2 * pal.length) | 0].slice();
    } else {
      const pal = [
        [0.82, 0.72, 0.49], // chaume de blé
        [0.79, 0.69, 0.46], // chaume plus terne
        [0.76, 0.68, 0.46], // herbe grillée
        [0.74, 0.66, 0.45], // friche sèche
        [0.84, 0.75, 0.53],
        [0.70, 0.60, 0.42], // labour (rare)
      ];
      c = pal[r2 < 0.9 ? ((r2 / 0.9) * 5) | 0 : 5].slice();
    }
    void r;
    const big = n.fbm(x / 900, z / 900, 3), mid = m.fbm(x / 160, z / 160, 3);
    const k = 1 + 0.05 * big + 0.04 * mid;
    c[0] *= k; c[1] *= k; c[2] *= k * 0.98;
    // chemins de terre entre certaines parcelles
    const eu = Math.abs((u / 170) - Math.round(u / 170)) * 170, ev = Math.abs((v / 240) - Math.round(v / 240)) * 240;
    if ((eu < 2 && ((pv & 7) === 1)) || (ev < 2 && ((pu & 7) === 2))) { c = [0.70, 0.61, 0.47]; }
    const h = this.height(x, z);
    const sx = this.height(x + 6, z) - this.height(x - 6, z), sz = this.height(x, z + 6) - this.height(x, z - 6);
    const slope = Math.sqrt(sx * sx + sz * sz) / 12;
    // affleurements calcaires sur les pentes
    const rock = smoothstep(0.10, 0.32, slope + 0.05 * mid);
    const rc = zama ? [0.72, 0.62, 0.48] : [0.74, 0.70, 0.60];
    c = mix3(c, rc, rock * 0.7);
    if (this.hasRiver) {
      const d = this.riverDist(x, z);
      const green = 1 - smoothstep(30, 260 + 80 * big, d);
      c = mix3(c, [0.36, 0.42, 0.22], green * 0.75);
      const mud = 1 - smoothstep(20, 48, d);
      c = mix3(c, [0.36, 0.31, 0.24], mud * 0.85);
    }
    if (zama) {
      const scrub = smoothstep(0.35, 0.65, m.fbm(x / 120 + 9, z / 120, 3));
      c = mix3(c, [0.42, 0.40, 0.26], scrub * 0.35);
    }
    // haut des collines : herbe plus verte, pâturages
    c = mix3(c, zama ? [0.6, 0.52, 0.34] : [0.52, 0.52, 0.32], smoothstep(18, 45, h) * 0.35);
    return c;
  }

  // Densité d'arbres (oliviers, chênes, peupliers le long de l'eau) : 0..1
  treeDensity(x, z) {
    const core = Math.max(Math.abs(x) * 0.75, Math.abs(z));
    if (core < 1250) return 0;
    let d = smoothstep(1250, 2200, core) * smoothstep(0.1, 0.7, this.m.fbm(x / 600 + 4, z / 600, 3) + 0.25);
    if (this.hasRiver) {
      const rd = this.riverDist(x, z);
      if (rd < 40) return 0;
      d = Math.max(d, (1 - smoothstep(45, 110, rd)) * 0.9 * (core > 900 ? 1 : 0.15));
    }
    if (this.kind === 'zama') d *= 0.35;
    return d;
  }
}

function mix3(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
