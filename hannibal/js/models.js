/* Modèles 3D procéduraux des combattants, chevaux et éléphants.
   Chaque sommet porte : aPart (membre animé), aMat (matériau dans la palette), aPivot (articulation).
   Deux niveaux de détail : 0 = proche (≈ 300 triangles), 1 = lointain et cadavres (≈ 60).

   Repère du modèle : pieds en y = 0, regard vers +z, côté gauche du soldat en +x.
   Parties : 0 corps, 1 jambe gauche, 2 jambe droite, 3 bras droit + arme, 4 bras gauche + bouclier,
   5 tête, 6 arme rangée (pilum), 7 arme de mêlée (glaive), 11-14 jambes du cheval,
   15 encolure, 16 cavalier, 17-18 bras du cavalier, 19 queue, 21-24 pattes d'éléphant,
   25 trompe, 26 oreilles, 27 cornac. */
import * as THREE from 'three';

class Builder {
  constructor() { this.P = []; this.N = []; this.A = []; this.M = []; this.V = []; }
  add(geo, o = {}) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...(o.r || [0, 0, 0]), o.ro || 'XYZ'));
    const pp = o.p || [0, 0, 0];
    m.compose(new THREE.Vector3(pp[0], pp[1] + (this.dy || 0), pp[2] + (this.dz || 0)), q, new THREE.Vector3(...(o.s || [1, 1, 1])));
    g.applyMatrix4(m);
    const p = g.attributes.position.array, n = g.attributes.normal.array;
    const part = this.partMap ? (this.partMap[o.part || 0] ?? (o.part || 0)) : (o.part || 0);
    const pv = o.pv ? [o.pv[0], o.pv[1] + (this.dy || 0), o.pv[2] + (this.dz || 0)] : [0, 0, 0];
    for (let i = 0; i < p.length; i += 3) {
      this.P.push(p[i], p[i + 1], p[i + 2]); this.N.push(n[i], n[i + 1], n[i + 2]);
      this.A.push(part); this.M.push(o.mat || 0); this.V.push(pv[0], pv[1], pv[2]);
    }
    g.dispose(); if (geo !== g) geo.dispose();
  }
  box(w, h, d, o) { this.add(new THREE.BoxGeometry(w, h, d), o); }
  cyl(rt, rb, h, seg, o, cap) { this.add(new THREE.CylinderGeometry(rt, rb, h, seg, 1, !cap), o); }
  sph(r, ws, hs, o, half) { this.add(half ? new THREE.SphereGeometry(r, ws, hs, 0, Math.PI * 2, 0, Math.PI / 2) : new THREE.SphereGeometry(r, ws, hs), o); }
  cone(r, h, seg, o) { this.add(new THREE.ConeGeometry(r, h, seg), o); }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.P, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.N, 3));
    g.setAttribute('aPart', new THREE.Float32BufferAttribute(this.A, 1));
    g.setAttribute('aMat', new THREE.Float32BufferAttribute(this.M, 1));
    g.setAttribute('aPivot', new THREE.Float32BufferAttribute(this.V, 3));
    g.computeBoundingSphere();
    g.boundingSphere.radius = 1e6; // les positions réelles viennent des instances
    return g;
  }
}

const HIP = 0.92, SH = 1.42;
const PV = { legL: [0.1, HIP, 0], legR: [-0.1, HIP, 0], armR: [-0.24, SH, 0], armL: [0.24, SH, 0], neck: [0, 1.5, 0] };

// ------------------------------------------------------------------ humains
function legs(b, s, lod) {
  const legMat = s.trousers ? 2 : 0;
  for (const [side, part, pv] of [[1, 1, PV.legL], [-1, 2, PV.legR]]) {
    const x = 0.1 * side;
    if (lod) { b.box(0.12, 0.9, 0.13, { p: [x, 0.46, 0], part, pv, mat: legMat }); continue; }
    b.cyl(0.075, 0.058, 0.86, 5, { p: [x, 0.5, 0], part, pv, mat: legMat });
    b.box(0.1, 0.06, 0.24, { p: [x, 0.03, 0.04], part, pv, mat: 5 });
    if (s.greave && side === 1) b.cyl(0.072, 0.064, 0.36, 5, { p: [x, 0.3, 0.005], part, pv, mat: 3 });
  }
}
function body(b, s, lod) {
  const torsoMat = s.bare ? 0 : s.armor === 'mail' ? 4 : s.armor === 'linen' ? 14 : s.armor === 'muscle' ? 3 : 1;
  if (lod) {
    b.box(0.4, 0.86, 0.27, { p: [0, 1.04, 0], mat: torsoMat === 0 && !s.trousers ? 1 : torsoMat });
    b.box(0.2, 0.22, 0.2, { p: [0, 1.6, 0], mat: s.helmet ? (s.helmet === 'cap' ? 5 : s.helmet === 'hood' ? 15 : 3) : s.hair ? 10 : 0, part: 5, pv: PV.neck });
    if (s.cloak) b.box(0.42, 0.75, 0.04, { p: [0, 1.05, -0.16], mat: 11 });
    return;
  }
  if (!s.trousers || s.tunicLong) b.cyl(0.2, 0.26, 0.42, 7, { p: [0, 0.83, 0], mat: 1, s: [1, 1, 0.8] });
  if (s.trim && (!s.trousers || s.tunicLong)) b.cyl(0.262, 0.265, 0.05, 7, { p: [0, 0.635, 0], mat: 2, s: [1, 1, 0.8] });
  b.cyl(0.2, 0.175, 0.52, 7, { p: [0, 1.2, 0], mat: torsoMat, s: [1, 1, 0.66] });
  b.box(0.42, 0.07, 0.24, { p: [0, 1.45, 0], mat: torsoMat });
  if (s.armor === 'pectoral') b.box(0.21, 0.21, 0.03, { p: [0, 1.27, 0.125], mat: 3 });
  if (s.armor === 'mail' || s.armor === 'linen') b.box(0.46, 0.1, 0.27, { p: [0, 1.4, 0], mat: s.armor === 'mail' ? 4 : 14 });
  if (s.armor === 'linen') for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; b.box(0.1, 0.16, 0.02, { p: [Math.sin(a) * 0.2, 0.9, Math.cos(a) * 0.14], r: [0, a, 0], mat: 14 }); }
  b.cyl(0.19, 0.19, 0.06, 7, { p: [0, 0.98, 0], mat: 5, s: [1, 1, 0.68] });
  if (s.torque) b.add(new THREE.TorusGeometry(0.07, 0.012, 4, 8), { p: [0, 1.47, 0.02], r: [Math.PI / 2 - 0.3, 0, 0], mat: 3 });
  if (s.cloak) b.box(0.44, 0.85, 0.04, { p: [0, 1.0, -0.16], r: [0.1, 0, 0], mat: 11 });
  if (s.scabbard && !lod) b.box(0.05, 0.5, 0.04, { p: [-0.21, 0.82, 0.02], r: [0.2, 0, 0], mat: 5, part: 6, pv: [0, 0, 0] });
  // tête
  b.cyl(0.05, 0.055, 0.1, 5, { p: [0, 1.48, 0], mat: 0 });
  b.sph(0.105, 7, 5, { p: [0, 1.6, 0], mat: 0, part: 5, pv: PV.neck });
  b.box(0.028, 0.05, 0.035, { p: [0, 1.585, 0.105], r: [0.25, 0, 0], mat: 0, part: 5, pv: PV.neck });
  if (s.beard) b.box(0.13, 0.07, 0.06, { p: [0, 1.535, 0.07], mat: 10, part: 5, pv: PV.neck });
  if (s.hair) {
    b.sph(0.112, 7, 3, { p: [0, 1.62, -0.012], mat: 10, part: 5, pv: PV.neck }, true);
    if (s.longHair) b.box(0.2, 0.2, 0.06, { p: [0, 1.52, -0.08], mat: 10, part: 5, pv: PV.neck });
    if (s.moustache) b.box(0.09, 0.025, 0.03, { p: [0, 1.555, 0.098], mat: 10, part: 5, pv: PV.neck });
  }
  if (s.headband) b.cyl(0.112, 0.112, 0.03, 8, { p: [0, 1.65, 0], mat: 5, part: 5, pv: PV.neck });
  if (s.helmet === 'montefortino' || s.helmet === 'attic') {
    b.sph(0.124, 7, 3, { p: [0, 1.61, 0], mat: 3, part: 5, pv: PV.neck }, true);
    b.cyl(0.13, 0.14, 0.025, 7, { p: [0, 1.61, -0.01], mat: 3, part: 5, pv: PV.neck });
    if (s.helmet === 'montefortino') b.cyl(0.012, 0.022, 0.05, 5, { p: [0, 1.75, 0], mat: 3, part: 5, pv: PV.neck });
    for (const x of [-0.105, 0.105]) b.box(0.02, 0.09, 0.07, { p: [x, 1.555, 0.04], mat: 3, part: 5, pv: PV.neck });
  } else if (s.helmet === 'cap') {
    b.sph(0.118, 7, 3, { p: [0, 1.615, 0], mat: 5, part: 5, pv: PV.neck }, true);
  } else if (s.helmet === 'hood') {
    b.sph(0.13, 7, 3, { p: [0, 1.61, -0.005], mat: 15, part: 5, pv: PV.neck }, true);
    b.box(0.22, 0.3, 0.05, { p: [0, 1.45, -0.13], mat: 15 });
  }
  if (s.crest === 'feathers') {
    for (const [x, rz] of [[-0.035, 0.12], [0, 0], [0.035, -0.12]]) b.box(0.014, 0.36, 0.035, { p: [x, 1.93, -0.01], r: [0, 0, rz], mat: 9, part: 5, pv: PV.neck });
  } else if (s.crest === 'crest') {
    b.box(0.035, 0.13, 0.3, { p: [0, 1.79, -0.02], mat: 9, part: 5, pv: PV.neck });
  }
}
function arms(b, s, lod) {
  for (const [side, part, pv] of [[-1, 3, PV.armR], [1, 4, PV.armL]]) {
    const x = 0.25 * side;
    if (lod) { if (part === 3) b.box(0.1, 0.6, 0.1, { p: [x, 1.12, 0], part, pv, mat: 0 }); continue; }
    b.cyl(0.055, 0.042, 0.66, 5, { p: [x, 1.09, 0], part, pv, mat: 0 }, true);
    if (!s.bare) b.cyl(0.07, 0.065, 0.2, 5, { p: [x, 1.33, 0], part, pv, mat: s.armor === 'mail' ? 4 : s.armor === 'linen' ? 14 : 1 });
  }
}
function weapons(b, s, lod) {
  const pvR = PV.armR, hx = -0.27;
  const W = s.weapon;
  if (W === 'pilum') {
    // le pilum (rangé) disparaît au contact ou une fois lancé : le glaive apparaît
    if (lod) b.box(0.03, 2.0, 0.03, { p: [hx, 1.15, 0.06], part: 6, pv: pvR, mat: 6 });
    else {
      b.cyl(0.016, 0.016, 1.3, 4, { p: [hx, 0.9, 0.06], part: 6, pv: pvR, mat: 6 });
      b.cyl(0.006, 0.006, 0.62, 3, { p: [hx, 1.86, 0.06], part: 6, pv: pvR, mat: 4 });
      b.cone(0.013, 0.07, 4, { p: [hx, 2.2, 0.06], part: 6, pv: pvR, mat: 4 });
    }
    if (!lod) sword(b, 7, 0.55, lod);
  } else if (W === 'spear') {
    if (lod) b.box(0.035, 2.6, 0.035, { p: [hx, 1.45, 0.06], part: 3, pv: pvR, mat: 6 });
    else {
      b.cyl(0.018, 0.02, 2.5, 5, { p: [hx, 1.45, 0.06], part: 3, pv: pvR, mat: 6 });
      b.cone(0.03, 0.22, 4, { p: [hx, 2.8, 0.06], part: 3, pv: pvR, mat: 4 });
    }
  } else if (W === 'javelins') {
    for (let i = 0; i < (lod ? 1 : 3); i++) {
      b.cyl(0.011, 0.011, 1.35, 3, { p: [hx + i * 0.025, 1.05, 0.06 + i * 0.02], r: [0.05 * i, 0, 0], part: 3, pv: pvR, mat: 6 });
      if (!lod) b.cone(0.015, 0.08, 3, { p: [hx + i * 0.025, 1.76, 0.09 + i * 0.02], part: 3, pv: pvR, mat: 4 });
    }
  } else if (W === 'longsword') sword(b, 3, 0.85, lod);
  else if (W === 'falcata' || W === 'sword') sword(b, 3, W === 'falcata' ? 0.55 : 0.6, lod);
}
function sword(b, part, len, lod) {
  if (lod) { b.box(0.05, 0.02, len, { p: [-0.25, 0.79, 0.05 + len / 2], part, pv: PV.armR, mat: 4 }); return; }
  b.box(0.05, 0.012, len, { p: [-0.25, 0.79, 0.08 + len / 2], part, pv: PV.armR, mat: 4 });
  b.box(0.12, 0.03, 0.03, { p: [-0.25, 0.79, 0.07], part, pv: PV.armR, mat: 3 });
}
const SHIELD_DIMS = { scutum: [0.64, 1.15, 0.07], oval: [0.58, 1.12, 0.04], round: [0.9, 0.9, 0.05], parma: [0.85, 0.85, 0.04], caetra: [0.55, 0.55, 0.04], cav: [0.65, 0.65, 0.04], hide: [0.5, 0.75, 0.03] };
const shieldY = (S) => (S === 'round' ? 1.15 : S === 'caetra' ? 1.0 : 1.02);
// centre et demi-tailles du bouclier dans le repère du modèle, et motif peint
export function shieldInfo(key) {
  const a = ARCH[key], S = a.spec.shield;
  if (!S) return [0, -10, 1, 1, 9];
  const [w, h] = SHIELD_DIMS[S];
  const dy = a.kind === 'rider' ? (a.spec.pony ? 0.88 : 1) * 1.47 - 0.95 + 0.02 : 0;
  const style = S === 'scutum' ? 0 : S === 'oval' ? (key === 'gaul' || key === 'ligur' ? 1 : 3) : S === 'round' ? 2 : 3;
  return [0.142, shieldY(S) + dy, w / 2, h / 2, style];
}
function shield(b, s, lod) {
  const S = s.shield; if (!S) return;
  const pv = PV.armL, part = 4;
  const [w, h, t] = SHIELD_DIMS[S];
  const y = shieldY(S);
  const p = [0.13, y, 0.3];
  if (lod) { b.box(w, h, t + 0.02, { p, part, pv, mat: 7, r: [0, -0.2, 0] }); return; }
  b.add(new THREE.CylinderGeometry(0.5, 0.5, t, 11, 1), { p, r: [Math.PI / 2, -0.2, 0], ro: 'YXZ', s: [w, 1, h], part, pv, mat: 7 });
  b.sph(Math.min(w, h) * 0.12, 5, 2, { p: [p[0] + 0.012, p[1], p[2] + t / 2 - 0.005], r: [Math.PI / 2, 0, 0], part, pv, mat: 8 }, true);
  if (S === 'scutum' || S === 'oval') b.box(0.04, h * 0.85, 0.02, { p: [p[0] + 0.012, p[1], p[2] + t / 2], r: [0, -0.2, 0], part, pv, mat: S === 'scutum' ? 8 : 6 });
  if (S === 'round') b.add(new THREE.TorusGeometry(0.45, 0.02, 3, 12), { p: [p[0] + 0.01, p[1], p[2] + 0.02], r: [0, -0.2, 0], part, pv, mat: 3 });
}
// silhouette minimale : soldats très lointains et morts au sol
function simpleHuman(b, s) {
  b.box(0.26, 0.9, 0.15, { p: [0, 0.46, 0], mat: s.trousers ? 2 : 0 });
  b.box(0.4, 0.86, 0.27, { p: [0, 1.04, 0], mat: s.bare ? 0 : s.armor === 'mail' ? 4 : s.armor === 'linen' ? 14 : 1 });
  b.box(0.2, 0.22, 0.2, { p: [0, 1.6, 0], mat: s.helmet ? (s.helmet === 'cap' ? 5 : s.helmet === 'hood' ? 15 : 3) : s.hair ? 10 : 0 });
  if (s.shield) { const [w, h] = SHIELD_DIMS[s.shield]; b.box(w * 0.9, h * 0.9, 0.06, { p: [0.13, shieldY(s.shield), 0.3], mat: 7, part: 4, pv: PV.armL }); }
}
export function buildHuman(s, lod) {
  const b = new Builder();
  if (lod === 2) { simpleHuman(b, s); return b.build(); }
  legs(b, s, lod); body(b, s, lod); arms(b, s, lod); weapons(b, s, lod); shield(b, s, lod);
  return b.build();
}

// --------------------------------------------------------------- cavaliers
function horse(b, s, lod) {
  const k = s.pony ? 0.88 : 1;
  const legs = [[0.17, 0.62, 11], [-0.17, 0.62, 12], [0.17, -0.6, 13], [-0.17, -0.6, 14]];
  if (lod) {
    b.box(0.55 * k, 0.55 * k, 1.6 * k, { p: [0, 1.15 * k, 0], mat: 12 });
    b.box(0.22, 0.6, 0.3, { p: [0, 1.6 * k, 0.95 * k], r: [-0.6, 0, 0], mat: 12, part: 15, pv: [0, 1.3 * k, 0.7 * k] });
    for (const [x, z, part] of legs) b.box(0.1, 0.95 * k, 0.12, { p: [x * k, 0.5 * k, z * k], part, pv: [x * k, 1.0 * k, z * k], mat: 12 });
    return;
  }
  b.cyl(0.31 * k, 0.29 * k, 1.25 * k, 8, { p: [0, 1.17 * k, 0], r: [Math.PI / 2, 0, 0], s: [0.85, 1, 1.05], mat: 12 });
  b.sph(0.32 * k, 8, 6, { p: [0, 1.18 * k, 0.6 * k], s: [0.85, 1, 1], mat: 12 });
  b.sph(0.33 * k, 8, 6, { p: [0, 1.2 * k, -0.6 * k], s: [0.9, 1, 1], mat: 12 });
  const npv = [0, 1.35 * k, 0.72 * k];
  b.cyl(0.12 * k, 0.2 * k, 0.75 * k, 7, { p: [0, 1.62 * k, 0.95 * k], r: [0.75, 0, 0], mat: 12, part: 15, pv: npv });
  b.box(0.17 * k, 0.2 * k, 0.52 * k, { p: [0, 1.86 * k, 1.27 * k], r: [0.75, 0, 0], mat: 12, part: 15, pv: npv });
  b.box(0.05, 0.3 * k, 0.6 * k, { p: [0, 1.82 * k, 0.9 * k], r: [0.75, 0, 0], mat: 13, part: 15, pv: npv });
  for (const x of [-0.05, 0.05]) b.cone(0.03, 0.1, 3, { p: [x, 2.1 * k, 1.1 * k], mat: 12, part: 15, pv: npv });
  for (const [x, z, part] of legs) {
    const pv = [x * k, 1.05 * k, z * k];
    b.cyl(0.065 * k, 0.04 * k, 1.0 * k, 5, { p: [x * k, 0.55 * k, z * k], part, pv, mat: 12 });
    b.cyl(0.05 * k, 0.055 * k, 0.08, 5, { p: [x * k, 0.04, z * k], part, pv, mat: 13 });
  }
  b.box(0.08, 0.6 * k, 0.08, { p: [0, 0.98 * k, -0.95 * k], r: [-0.35, 0, 0], mat: 13, part: 19, pv: [0, 1.25 * k, -0.85 * k] });
  if (s.cloth) b.box(0.62 * k, 0.03, 0.7 * k, { p: [0, 1.47 * k, -0.02], mat: s.cloth });
}
function rider(b, s, lod) {
  const dy = (s.pony ? 0.88 : 1) * 1.47 - 0.95 + 0.02;
  // cuisses et jambes le long des flancs
  const legMat = s.trousers ? 2 : 0;
  for (const side of [1, -1]) {
    b.box(0.13, 0.13, 0.42, { p: [0.21 * side, dy + 0.98, 0.14], mat: legMat, part: 16 });
    b.box(0.1, 0.48, 0.11, { p: [0.27 * side, dy + 0.72, 0.3], mat: legMat, part: 16 });
  }
  const r = new Builder();
  r.dy = dy; r.partMap = { 0: 16, 3: 17, 4: 18, 5: 16, 6: 17, 7: 17 };
  body(r, s, lod); arms(r, s, lod); weapons(r, s, lod); shield(r, s, lod);
  for (let i = 0; i < r.A.length; i++) { b.P.push(r.P[i * 3], r.P[i * 3 + 1], r.P[i * 3 + 2]); b.N.push(r.N[i * 3], r.N[i * 3 + 1], r.N[i * 3 + 2]); b.A.push(r.A[i]); b.M.push(r.M[i]); b.V.push(r.V[i * 3], r.V[i * 3 + 1], r.V[i * 3 + 2]); }
}
export function buildRider(s, lod) {
  const b = new Builder();
  if (lod === 2) {
    const k = s.pony ? 0.88 : 1;
    b.box(0.55 * k, 0.55 * k, 1.6 * k, { p: [0, 1.15 * k, 0], mat: 12 });
    b.box(0.22, 0.6, 0.3, { p: [0, 1.6 * k, 0.95 * k], r: [-0.6, 0, 0], mat: 12 });
    b.box(0.3, 1.0 * k, 1.3 * k, { p: [0, 0.5 * k, 0], mat: 12 });
    b.box(0.36, 0.7, 0.24, { p: [0, 1.47 * k + 0.4, 0], mat: s.armor === 'muscle' ? 3 : 1 });
    b.box(0.2, 0.22, 0.2, { p: [0, 1.47 * k + 0.86, 0], mat: s.helmet ? 3 : 10 });
    return b.build();
  }
  horse(b, s, lod); rider(b, s, lod);
  return b.build();
}

// ---------------------------------------------------------------- éléphants
export function buildElephant(s, lod) {
  const b = new Builder();
  if (lod === 2) lod = 1;
  b.sph(1.0, lod ? 6 : 10, lod ? 5 : 8, { p: [0, 1.95, -0.05], s: [0.95, 0.95, 1.4], mat: 12 });
  const hp = [0, 2.35, 1.25];
  b.sph(0.62, lod ? 6 : 9, lod ? 5 : 7, { p: hp, mat: 12 });
  for (const sd of [1, -1]) b.box(0.08, 1.0, 0.85, { p: [0.62 * sd, 2.3, 1.05], r: [0, 0.35 * sd, 0], mat: 12, part: 26, pv: [0.45 * sd, 2.4, 1.2] });
  const tp = [0, 2.2, 1.7];
  b.cyl(0.19, 0.07, 1.7, lod ? 5 : 8, { p: [0, 1.4, 1.9], r: [0.18, 0, 0], mat: 12, part: 25, pv: tp });
  for (const sd of [1, -1]) b.cone(0.06, 0.6, 5, { p: [0.22 * sd, 1.85, 1.85], r: [2.2, 0, 0.15 * sd], mat: 14 });
  const L = [[0.55, 0.85, 21], [-0.55, 0.85, 22], [0.55, -0.85, 23], [-0.55, -0.85, 24]];
  for (const [x, z, part] of L) b.cyl(0.3, 0.26, 1.65, lod ? 5 : 8, { p: [x, 0.83, z], part, pv: [x, 1.6, z], mat: 12 });
  b.box(0.06, 0.8, 0.06, { p: [0, 1.6, -1.45], r: [-0.25, 0, 0], mat: 13, part: 19, pv: [0, 2.0, -1.35] });
  // cornac à califourchon sur le cou
  const r = new Builder(); r.dy = 2.85 - 0.95; r.dz = 0.75; r.partMap = { 0: 27, 3: 27, 4: 27, 5: 27, 6: 27, 7: 27 };
  body(r, { hair: true, sleeveless: true }, lod); arms(r, { hair: true }, lod);
  for (let i = 0; i < r.A.length; i++) { b.P.push(r.P[i * 3], r.P[i * 3 + 1], r.P[i * 3 + 2]); b.N.push(r.N[i * 3], r.N[i * 3 + 1], r.N[i * 3 + 2]); b.A.push(r.A[i]); b.M.push(r.M[i]); b.V.push(r.V[i * 3], r.V[i * 3 + 1], r.V[i * 3 + 2]); }
  if (s.cloth) b.box(1.3, 0.04, 1.2, { p: [0, 2.9, 0.1], mat: s.cloth });
  return b.build();
}

/* --------------------------------------------------------------------- *
 *  Archétypes : équipement et palette (couleurs sRGB).
 *  Palette : 0 peau, 1 tunique, 2 bordure/braies, 3 bronze, 4 fer, 5 cuir, 6 bois, 7 bouclier,
 *  8 umbo, 9 cimier, 10 cheveux, 11 manteau, 12 robe, 13 crins/sabots, 14 lin/ivoire, 15 fourrure,
 *  16-19 variantes de bouclier, 20-23 robes de cheval, 24 tunique alternative, 25 braies alternatives.
 * --------------------------------------------------------------------- */
const HORSES = ['#5d321b', '#7b4220', '#2e211a', '#8f8678'];
function pal(o) {
  const base = {
    0: '#c49270', 1: '#a33a2a', 2: '#7a2a20', 3: '#a87a3c', 4: '#6a6a6e', 5: '#4a3424', 6: '#8a6a45', 7: '#8e2b22',
    8: '#a87a3c', 9: '#30202e', 10: '#33261d', 11: '#8e1c1c', 12: '#6b3a20', 13: '#1e1814', 14: '#e3dccb', 15: '#6e5c48',
    16: '#8e2b22', 17: '#9e3626', 18: '#7a2622', 19: '#8a4a2a', 20: HORSES[0], 21: HORSES[1], 22: HORSES[2], 23: HORSES[3],
    24: '#cfc3a8', 25: '#5a4a30',
  };
  return Object.assign(base, o);
}
export const ARCH = {
  hastatus: { kind: 'human', style: 0, spec: { armor: 'pectoral', helmet: 'montefortino', crest: 'feathers', shield: 'scutum', weapon: 'pilum', greave: true, scabbard: true }, pal: pal({}) },
  princeps: { kind: 'human', style: 0, spec: { armor: 'mail', helmet: 'montefortino', crest: 'feathers', shield: 'scutum', weapon: 'pilum', greave: true, scabbard: true }, pal: pal({ 24: '#b8a98a' }) },
  triarius: { kind: 'human', style: 2, spec: { armor: 'mail', helmet: 'montefortino', crest: 'crest', shield: 'scutum', weapon: 'spear', greave: true }, pal: pal({ 9: '#1f1a1a' }) },
  veles: { kind: 'human', style: 3, spec: { helmet: 'hood', shield: 'parma', weapon: 'javelins' }, pal: pal({ 1: '#b8ab8e', 24: '#8f7d62', 7: '#7a5a3a', 16: '#7a5a3a', 17: '#8d6b45', 18: '#6e4e30', 19: '#9a7650' }) },
  gaul: { kind: 'human', style: 1, spec: { bare: true, trousers: true, hair: true, longHair: true, moustache: true, torque: true, shield: 'oval', weapon: 'longsword' }, pal: pal({ 0: '#c4906c', 2: '#6b5a3a', 25: '#4a5a6a', 10: '#b0803e', 7: '#3d5a8a', 16: '#3d5a8a', 17: '#a8892f', 18: '#7a3a2a', 19: '#2f5a3a', 8: '#5a5a5e' }) },
  iber: { kind: 'human', style: 0, spec: { trim: true, helmet: 'cap', shield: 'oval', weapon: 'falcata' }, pal: pal({ 1: '#e6e0d2', 24: '#ddd5c2', 2: '#7c1830', 7: '#6a4a30', 16: '#6a4a30', 17: '#d9cfb8', 18: '#7a2a20', 19: '#4a3a2a', 8: '#5a5a5e' }) },
  libyan: { kind: 'human', style: 0, spec: { armor: 'mail', helmet: 'montefortino', shield: 'scutum', weapon: 'sword', beard: true }, pal: pal({ 0: '#9c6a48', 1: '#d4c29a', 24: '#c9b48a', 16: '#6e5a3a', 17: '#8a5a34', 18: '#5a4a3a', 19: '#9a8a6a', 7: '#6e5a3a' }) },
  slinger: { kind: 'human', style: 4, spec: { hair: true, headband: true }, pal: pal({ 0: '#b98a66', 1: '#a89a7c', 24: '#8c7c60' }) },
  lonch: { kind: 'human', style: 3, spec: { hair: true, shield: 'caetra', weapon: 'javelins' }, pal: pal({ 0: '#9c6a48', 1: '#c2ae8a', 24: '#a8946e', 16: '#8a6a45', 17: '#6e5236', 18: '#9a7a50', 19: '#5a4430' }) },
  carthcit: { kind: 'human', style: 2, spec: { armor: 'linen', helmet: 'attic', crest: 'crest', shield: 'round', weapon: 'spear', greave: true }, pal: pal({ 1: '#6b2a5f', 24: '#7a3060', 9: '#e8e0d0', 16: '#b08040', 17: '#e6dcc8', 18: '#6b2a5f', 19: '#8a2e24' }) },
  veteran: { kind: 'human', style: 0, spec: { armor: 'mail', helmet: 'montefortino', crest: 'crest', shield: 'scutum', weapon: 'sword', cloak: true }, pal: pal({ 0: '#a8785a', 1: '#c9b48a', 11: '#5a2a24', 9: '#1a1a1a', 16: '#5e4a34', 17: '#7a3a28', 18: '#4a3e30', 19: '#8a7a5a' }) },
  ligur: { kind: 'human', style: 0, spec: { hair: true, shield: 'oval', weapon: 'sword', helmet: 'cap' }, pal: pal({ 1: '#8a7a5a', 24: '#6e6048', 16: '#6a5a3a', 17: '#4a4a3a', 18: '#7a6040', 19: '#5a3a2a' }) },
  eques: { kind: 'rider', style: 10, spec: { armor: 'muscle', helmet: 'attic', crest: 'crest', shield: 'cav', weapon: 'spear', cloth: 11 }, pal: pal({ 11: '#7a2a24', 9: '#8a1515' }) },
  eques_socii: { kind: 'rider', style: 10, spec: { armor: 'linen', helmet: 'montefortino', shield: 'cav', weapon: 'spear', cloth: 11 }, pal: pal({ 11: '#5a4a6a', 16: '#6a5a3a', 17: '#8a6a3a', 18: '#5a3a2a', 19: '#7a6a4a' }) },
  gen_rom: { kind: 'rider', style: 10, spec: { armor: 'muscle', helmet: 'attic', crest: 'crest', shield: 'cav', weapon: 'sword', cloak: true, cloth: 11 }, pal: pal({ 11: '#a01818', 9: '#b01515', 20: '#d6d0c4', 21: '#cfc8bb', 22: '#e0dace', 23: '#bdb6a8' }) },
  ibercav: { kind: 'rider', style: 10, spec: { trim: true, helmet: 'cap', crest: 'crest', shield: 'oval', weapon: 'spear', cloth: 2 }, pal: pal({ 1: '#e6e0d2', 2: '#7c1830', 9: '#1a1a1a', 16: '#6a4a30', 17: '#d9cfb8', 18: '#7a2a20', 19: '#3d5a8a' }) },
  numid: { kind: 'rider', style: 11, spec: { hair: true, beard: true, shield: 'caetra', weapon: 'javelins', pony: true }, pal: pal({ 0: '#8a5a3c', 1: '#d8ccb0', 24: '#c2b490', 10: '#1a1410', 16: '#8a6a45', 17: '#6e5236', 18: '#9a7a50', 19: '#5a4430', 20: '#6a3c22', 21: '#8a5a32', 22: '#3a2a1e', 23: '#a08a6a' }) },
  gen_carth: { kind: 'rider', style: 10, spec: { armor: 'muscle', helmet: 'attic', crest: 'crest', shield: 'round', weapon: 'sword', cloak: true, cloth: 11 }, pal: pal({ 11: '#4e1c48', 9: '#e8e0d0', 16: '#b08040', 17: '#b08040', 18: '#b08040', 19: '#b08040', 20: '#1c1612', 21: '#241c16', 22: '#2a2018', 23: '#18120e' }) },
  carthcav: { kind: 'rider', style: 10, spec: { armor: 'linen', helmet: 'attic', shield: 'round', weapon: 'spear', cloth: 11 }, pal: pal({ 1: '#6b2a5f', 11: '#6b2a5f', 16: '#b08040', 17: '#e6dcc8', 18: '#6b2a5f', 19: '#8a2e24' }) },
  elephant: { kind: 'elephant', style: 20, spec: { cloth: 11 }, pal: pal({ 0: '#9a6a48', 1: '#c2ae8a', 11: '#6b2a5f', 12: '#6e6a64', 20: '#6e6a64', 21: '#7a746c', 22: '#5e5a54', 23: '#807868', 13: '#3a3632', 14: '#e8dcc0' }) },
};

export function buildArch(key, lod) {
  const a = ARCH[key];
  if (a.kind === 'human') return buildHuman(a.spec, lod);
  if (a.kind === 'rider') return buildRider(a.spec, lod);
  return buildElephant(a.spec, lod);
}
