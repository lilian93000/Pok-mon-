/* Décor : ciel et soleil réels, terrain, rivière, végétation, camps et ville.
   Le soleil suit l'heure de la bataille pour la latitude et la date du scénario. */
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { HALF } from './terrain.js';
import { mulberry32, makeNoise2D, smoothstep } from './noise.js';

export class World {
  constructor(renderer, scene, terrain, scn, q) {
    this.r = renderer; this.scene = scene; this.ter = terrain; this.scn = scn; this.q = q;
    this.hour = scn.startHour;
    this.sky = new Sky();
    this.sky.scale.setScalar(400000);
    const su = this.sky.material.uniforms;
    su.turbidity.value = scn.turbidity; su.rayleigh.value = 1.2; su.mieCoefficient.value = 0.0055; su.mieDirectionalG.value = 0.82;
    scene.add(this.sky);
    this.skyScene = new THREE.Scene();
    this.skyEnv = new Sky(); this.skyEnv.scale.setScalar(1000); this.skyEnv.material = this.sky.material;
    this.skyScene.add(this.skyEnv);
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.sun = new THREE.DirectionalLight(0xffffff, 3);
    this.sun.castShadow = q.shadows;
    const sm = q.shadowMap;
    this.sun.shadow.mapSize.set(sm, sm);
    this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.6;
    this.sun.shadow.camera.near = 1; this.sun.shadow.camera.far = 3000;
    scene.add(this.sun, this.sun.target);
    this.hemi = new THREE.HemisphereLight(0xbfd4ee, 0x7a6a4a, 0.35);
    scene.add(this.hemi);
    scene.fog = new THREE.FogExp2(0xc9c6bb, 0.00011);
    this.sunDir = new THREE.Vector3();
    this.lastEnvEl = -99;
    this.buildTerrain();
    if (terrain.hasRiver) this.buildRiver();
    this.buildVegetation();
    this.buildCamps();
    this.setTime(this.hour, true);
  }

  // -------------------------------------------------------------- soleil
  sunPosition(hour) {
    const d2r = Math.PI / 180, lat = this.scn.lat * d2r, dec = this.scn.decl * d2r;
    const H = (hour - 12) * 15 * d2r;
    const sinEl = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H);
    const el = Math.asin(sinEl);
    let cosA = (Math.sin(dec) - sinEl * Math.sin(lat)) / (Math.cos(el) * Math.cos(lat));
    cosA = Math.max(-1, Math.min(1, cosA));
    let az = Math.acos(cosA); if (H > 0) az = 2 * Math.PI - az;
    return { el, az };
  }
  setTime(hour, force) {
    this.hour = hour;
    const { el, az } = this.sunPosition(hour);
    this.sunEl = el; this.sunAz = az;
    this.sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    this.sky.material.uniforms.sunPosition.value.copy(this.sunDir);
    const e = Math.max(0, Math.sin(el));
    const warm = 1 - smoothstep(0.05, 0.5, e);
    this.sun.color.setRGB(1, 0.93 - 0.25 * warm, 0.84 - 0.45 * warm);
    this.sun.intensity = 3.2 * smoothstep(-0.02, 0.25, e);
    this.hemi.intensity = 0.25 + 0.2 * e;
    const fogC = new THREE.Color().setRGB(0.80 - 0.08 * warm, 0.79 - 0.12 * warm, 0.74 - 0.18 * warm);
    this.scene.fog.color.copy(fogC);
    if (force || Math.abs(el - this.lastEnvEl) > 0.035) {
      this.lastEnvEl = el;
      if (this.env) this.env.dispose();
      this.env = this.pmrem.fromScene(this.skyScene, 0, 0.1, 2000).texture;
      this.scene.environment = this.env;
      this.scene.environmentIntensity = 0.55;
    }
  }
  clockText() {
    const h = Math.floor(this.hour), m = Math.floor((this.hour - h) * 60);
    return `${h} h ${String(m).padStart(2, '0')}`;
  }
  // l'ombre suit la caméra et couvre une zone adaptée à la distance de vue
  updateShadow(target, dist) {
    const ext = Math.max(40, Math.min(900, dist * 0.9));
    const c = this.sun.shadow.camera;
    if (Math.abs(c.right - ext) > ext * 0.15) { c.left = -ext; c.right = ext; c.top = ext; c.bottom = -ext; c.updateProjectionMatrix(); }
    const tex = (2 * ext) / this.sun.shadow.mapSize.x;
    this.shadowBox = { x: target.x, z: target.z, e: ext * 1.15 };
    const tx = Math.round(target.x / tex) * tex, tz = Math.round(target.z / tex) * tex;
    const ty = this.ter.height(tx, tz);
    this.sun.target.position.set(tx, ty, tz);
    this.sun.position.set(tx + this.sunDir.x * 1500, ty + this.sunDir.y * 1500, tz + this.sunDir.z * 1500);
    this.sun.target.updateMatrixWorld();
  }

  // ------------------------------------------------------------- terrain
  buildTerrain() {
    const t = this.ter, N = t.N;
    const pos = new Float32Array(N * N * 3);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const k = (j * N + i) * 3;
      pos[k] = -HALF + i * t.cell; pos[k + 1] = t.h[j * N + i]; pos[k + 2] = -HALF + j * t.cell;
    }
    const idx = new Uint32Array((N - 1) * (N - 1) * 6);
    let o = 0;
    for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
      const a = j * N + i, b = a + 1, c = a + N, d = c + 1;
      idx[o++] = a; idx[o++] = c; idx[o++] = b; idx[o++] = b; idx[o++] = c; idx[o++] = d;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeVertexNormals();
    // texture de couleur (6 m par texel)
    const S = this.q.groundTex;
    const cv = document.createElement('canvas'); cv.width = cv.height = S;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const wx = -HALF + (x + 0.5) / S * HALF * 2, wz = -HALF + (y + 0.5) / S * HALF * 2;
      const c = t.groundColor(wx, wz);
      const k = (y * S + x) * 4;
      img.data[k] = Math.min(255, c[0] * 255); img.data[k + 1] = Math.min(255, c[1] * 255); img.data[k + 2] = Math.min(255, c[2] * 255); img.data[k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    this.groundCanvas = cv;
    const colTex = new THREE.CanvasTexture(cv);
    colTex.colorSpace = THREE.SRGBColorSpace; colTex.anisotropy = 8;
    colTex.wrapS = colTex.wrapT = THREE.ClampToEdgeWrapping;
    // détail fin répété (chaume, mottes, cailloux)
    const detail = detailTexture(256);
    // piétinement et sang : mis à jour pendant la bataille
    this.trS = 512;
    this.trData = new Uint8Array(this.trS * this.trS * 4);
    this.trTex = new THREE.DataTexture(this.trData, this.trS, this.trS, THREE.RGBAFormat);
    this.trTex.magFilter = THREE.LinearFilter; this.trTex.minFilter = THREE.LinearFilter;
    this.trTex.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({ map: colTex, roughness: 0.95, metalness: 0 });
    const zama = t.kind === 'zama';
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uDetail = { value: detail };
      sh.uniforms.uTrample = { value: this.trTex };
      sh.uniforms.uMud = { value: new THREE.Color(zama ? '#a27c56' : '#a48c6a') };
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vW;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed,1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vW; uniform sampler2D uDetail; uniform sampler2D uTrample; uniform vec3 uMud;')
        .replace('#include <map_fragment>', `
          vec2 guv = (vW.xz + ${HALF.toFixed(1)}) / ${(HALF * 2).toFixed(1)};
          vec4 gc = texture2D(map, guv);
          float d1 = texture2D(uDetail, vW.xz / 3.1).r, d2 = texture2D(uDetail, vW.xz / 23.0).g, d3 = texture2D(uDetail, vW.xz / 0.9).b;
          float dd = mix(1.0, (0.78 + 0.44*d1) * (0.86 + 0.28*d2), 1.0);
          float camD = length(vW - cameraPosition);
          dd = mix(dd, 1.0, smoothstep(250.0, 1400.0, camD));
          dd *= mix(0.9 + 0.2*d3, 1.0, smoothstep(10.0, 60.0, camD));
          vec3 col = gc.rgb * dd;
          vec4 tr = texture2D(uTrample, guv);
          col = mix(col, uMud * (0.8 + 0.35*d1), clamp(tr.r * 1.2, 0.0, 0.8));
          col = mix(col, vec3(0.2, 0.07, 0.05), clamp(tr.g * 0.6, 0.0, 0.32) * (0.6 + 0.4*d3));
          diffuseColor.rgb *= col;`);
    };
    mat.customProgramCacheKey = () => 'ground';
    this.ground = new THREE.Mesh(g, mat);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    // relief lointain jusqu'à l'horizon
    const R = 40000, M = 96;
    const og = new THREE.PlaneGeometry(R * 2, R * 2, M, M); og.rotateX(-Math.PI / 2);
    const op = og.attributes.position;
    const cols = new Float32Array(op.count * 3);
    const nz = makeNoise2D(5);
    for (let i = 0; i < op.count; i++) {
      const x = op.getX(i), z = op.getZ(i);
      const inside = Math.abs(x) < HALF - 100 && Math.abs(z) < HALF - 100;
      op.setY(i, inside ? t.height(x, z) - 30 : t.far(x, z) - (Math.max(Math.abs(x), Math.abs(z)) < HALF + 900 ? 1.5 : 0));
      const v = 0.5 + 0.5 * nz.fbm(x / 4000, z / 4000, 3);
      const c = zama ? [0.62 + 0.1 * v, 0.5 + 0.08 * v, 0.34] : [0.6 + 0.12 * v, 0.55 + 0.1 * v, 0.36 + 0.04 * v];
      const hill = smoothstep(30, 140, op.getY(i));
      cols[i * 3] = c[0] * (1 - 0.25 * hill); cols[i * 3 + 1] = c[1] * (1 - 0.1 * hill); cols[i * 3 + 2] = c[2] * (1 - 0.05 * hill);
    }
    og.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    og.computeVertexNormals();
    const outer = new THREE.Mesh(og, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
    outer.receiveShadow = false;
    this.scene.add(outer);
  }

  // Le piétinement s'accumule là où les troupes passent et combattent
  stamp(units, dt) {
    const S = this.trS, D = this.trData, k = S / (HALF * 2);
    let dirty = false;
    for (const u of units) {
      if (!u.alive || u.men < 1) continue;
      const mv = u.speed > 0.4, fight = u.engaged;
      if (!mv && !fight) continue;
      const amt = (fight ? 26 : u.isCav ? 10 : 5) * dt * (u.isCav ? 1.4 : 1);
      const blood = fight ? 7 * dt * Math.min(3, u.lossRate) : 0;
      const r = Math.max(u.hw, u.hd);
      const x0 = Math.floor((u.x - r + HALF) * k), x1 = Math.ceil((u.x + r + HALF) * k);
      const z0 = Math.floor((u.z - r + HALF) * k), z1 = Math.ceil((u.z + r + HALF) * k);
      for (let zz = Math.max(0, z0); zz <= Math.min(S - 1, z1); zz++) for (let xx = Math.max(0, x0); xx <= Math.min(S - 1, x1); xx++) {
        const wx = xx / k - HALF, wz = zz / k - HALF;
        if (!u.isInside(wx, wz, 4)) continue;
        const i = (zz * S + xx) * 4;
        const [, lz] = u.local(wx, wz);
        const front = fight ? 1 + 2 * Math.max(0, 1 - Math.abs(lz - u.hd) / 12) : 1;
        D[i] = Math.min(255, D[i] + amt * front);
        if (blood) D[i + 1] = Math.min(255, D[i + 1] + blood * front);
        dirty = true;
      }
    }
    if (dirty) this.trTex.needsUpdate = true;
  }

  // ------------------------------------------------------------- rivière
  buildRiver() {
    const t = this.ter, pts = [];
    for (let z = -HALF * 1.6; z <= HALF * 1.6; z += 15) pts.push(z);
    const W = 60, pos = [], uv = [], idx = [];
    pts.forEach((z, i) => {
      const x = t.riverX(z), dz = 2, sl = (t.riverX(z + dz) - t.riverX(z - dz)) / (2 * dz);
      const nx = 1 / Math.sqrt(1 + sl * sl), nzz = -sl / Math.sqrt(1 + sl * sl);
      const y = Math.abs(z) < HALF ? t.waterLevelAt(z) : t.waterLevelAt(Math.sign(z) * (HALF - 10));
      pos.push(x - nx * W, y, z - nzz * W, x + nx * W, y, z + nzz * W);
      uv.push(0, z / 40, 1, z / 40);
      if (i > 0) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    const nrm = waterNormals(256);
    nrm.wrapS = nrm.wrapT = THREE.RepeatWrapping;
    const mat = new THREE.MeshStandardMaterial({ color: 0x3b4a3a, roughness: 0.08, metalness: 0.0, normalMap: nrm, normalScale: new THREE.Vector2(0.35, 0.35), transparent: true, opacity: 0.9 });
    this.waterMat = mat;
    this.water = new THREE.Mesh(g, mat);
    this.water.receiveShadow = true;
    this.scene.add(this.water);
  }

  // ---------------------------------------------------------- végétation
  buildVegetation() {
    const t = this.ter, rnd = mulberry32(42);
    const zama = t.kind === 'zama';
    const want = this.q.trees;
    const olives = [], poplars = [], bushes = [];
    let tries = 0;
    while (olives.length + poplars.length < want && tries++ < want * 40) {
      const x = (rnd() * 2 - 1) * HALF, z = (rnd() * 2 - 1) * HALF;
      const d = t.treeDensity(x, z);
      if (rnd() > d) continue;
      const near = t.hasRiver && t.riverDist(x, z) < 120;
      (near && rnd() < 0.8 ? poplars : olives).push([x, z]);
    }
    for (let i = 0; i < this.q.bushes; i++) {
      const x = (rnd() * 2 - 1) * HALF, z = (rnd() * 2 - 1) * HALF;
      const core = Math.max(Math.abs(x) * 0.8, Math.abs(z));
      if (core < 1050 && rnd() > 0.08) continue;
      if (t.hasRiver && t.riverDist(x, z) < 45) continue;
      bushes.push([x, z]);
    }
    const mk = (geo, list, scaleF, colA, colB, shadow) => {
      const mat = new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true, vertexColors: true });
      const m = new THREE.InstancedMesh(geo, mat, Math.max(1, list.length));
      const o = new THREE.Object3D(), c = new THREE.Color();
      list.forEach(([x, z], i) => {
        const s = scaleF(rnd);
        o.position.set(x, t.height(x, z) - 0.2, z); o.rotation.set(0, rnd() * Math.PI * 2, 0);
        o.scale.set(s[0], s[1], s[0]); o.updateMatrix(); m.setMatrixAt(i, o.matrix);
        c.set(colA).lerp(new THREE.Color(colB), rnd()); m.setColorAt(i, c);
      });
      m.count = list.length;
      m.castShadow = shadow; m.receiveShadow = true;
      this.scene.add(m);
      return m;
    };
    mk(treeGeo('olive'), olives, (r) => { const s = 0.8 + r() * 0.6; return [s, s * (0.9 + r() * 0.3)]; }, zama ? '#8a8a5a' : '#7f8f5e', zama ? '#5e6a40' : '#56653c', this.q.treeShadows);
    mk(treeGeo('poplar'), poplars, (r) => { const s = 0.8 + r() * 0.5; return [s, s * (0.9 + r() * 0.5)]; }, '#6e8a48', '#4a6230', this.q.treeShadows);
    mk(treeGeo('bush'), bushes, (r) => { const s = 0.5 + r() * 1.2; return [s, s * (0.6 + r() * 0.5)]; }, zama ? '#7a7448' : '#6e7442', zama ? '#5a5232' : '#4e5530', false);
  }

  // --------------------------------------------------------- camps, ville
  buildCamps() {
    const t = this.ter, zama = t.kind === 'zama';
    const boxes = [], tents = [];
    const camp = (cx, cz, w, d, ang, roman) => {
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const P = (lx, lz) => [cx + lx * ca - lz * sa, cz + lx * sa + lz * ca];
      // rempart de terre et palissade, avec quatre portes
      const wall = (lx0, lz0, lx1, lz1) => {
        const len = Math.hypot(lx1 - lx0, lz1 - lz0), n = Math.ceil(len / 20);
        for (let i = 0; i < n; i++) {
          const f = (i + 0.5) / n; if (Math.abs(f - 0.5) < 0.04) continue;
          const [x, z] = P(lx0 + (lx1 - lx0) * f, lz0 + (lz1 - lz0) * f);
          const a = Math.atan2(lx1 - lx0, lz1 - lz0) + ang;
          boxes.push({ x, z, y: 0.9, w: 3.2, h: 1.8, d: len / n + 0.5, a, c: roman ? '#8a7656' : '#7a6a50' });
          boxes.push({ x, z, y: 2.6, w: 0.25, h: 1.8, d: len / n + 0.3, a, c: '#5a4630' });
        }
      };
      wall(-w / 2, -d / 2, w / 2, -d / 2); wall(w / 2, -d / 2, w / 2, d / 2); wall(w / 2, d / 2, -w / 2, d / 2); wall(-w / 2, d / 2, -w / 2, -d / 2);
      const rnd = mulberry32(Math.round(cx + cz));
      const step = roman ? 9 : 11;
      for (let lz = -d / 2 + 25; lz < d / 2 - 20; lz += step) {
        if (roman && Math.abs(lz) < 18) continue; // via principalis
        for (let lx = -w / 2 + 25; lx < w / 2 - 20; lx += roman ? 7 : 9 + rnd() * 6) {
          if (roman && Math.abs(lx) < 14) continue;
          if (!roman && rnd() < 0.3) continue;
          const [x, z] = P(lx + (roman ? 0 : rnd() * 4), lz);
          tents.push({ x, z, a: ang + (roman ? 0 : rnd() * 0.6), c: roman ? '#b8a27a' : rnd() < 0.5 ? '#a8946c' : '#8a6e4e' });
        }
      }
      const [px, pz] = P(0, 0);
      boxes.push({ x: px, z: pz, y: 2.5, w: 18, h: 5, d: 14, a: ang, c: roman ? '#a8322a' : '#5a2a50' });
    };
    if (zama) {
      camp(-200, -1900, 560, 520, 0.05, true);
      camp(300, 2100, 600, 480, -0.1, false);
    } else {
      camp(-300, -1800, 620, 600, 0.04, true);
      camp(-2080, 300, 380, 360, 0.1, true);
      camp(-650, 1700, 560, 520, -0.12, false);
      // Cannes : village fortifié et grenier sur la colline
      const rnd = mulberry32(216);
      for (let i = 0; i < 70; i++) {
        const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 150;
        const x = 900 + Math.cos(a) * r, z = 1950 + Math.sin(a) * r * 0.75;
        boxes.push({ x, z, y: 2, w: 6 + rnd() * 8, h: 4 + rnd() * 3, d: 6 + rnd() * 8, a: rnd() * 0.3, c: rnd() < 0.5 ? '#c9b89a' : '#b8a283', roof: true });
      }
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        boxes.push({ x: 900 + Math.cos(a) * 175, z: 1950 + Math.sin(a) * 135, y: 2.5, w: 3, h: 5, d: 24, a: -a, c: '#b7a98e' });
      }
    }
    const bg = new THREE.BoxGeometry(1, 1, 1);
    const bm = new THREE.InstancedMesh(bg, new THREE.MeshStandardMaterial({ roughness: 0.95 }), boxes.length);
    const roofs = boxes.filter((b) => b.roof);
    const rg = new THREE.ConeGeometry(0.75, 0.5, 4, 1); rg.rotateY(Math.PI / 4);
    const rm = new THREE.InstancedMesh(rg, new THREE.MeshStandardMaterial({ color: '#9a5a3a', roughness: 0.9 }), Math.max(1, roofs.length));
    const o = new THREE.Object3D(), c = new THREE.Color();
    let ri = 0;
    boxes.forEach((b, i) => {
      const gy = t.height(b.x, b.z);
      o.position.set(b.x, gy + b.y, b.z); o.rotation.set(0, b.a, 0); o.scale.set(b.w, b.h, b.d); o.updateMatrix();
      bm.setMatrixAt(i, o.matrix); bm.setColorAt(i, c.set(b.c));
      if (b.roof) { o.position.y = gy + b.y + b.h / 2 + 1.2; o.scale.set(b.w * 1.4, 3, b.d * 1.4); o.updateMatrix(); rm.setMatrixAt(ri++, o.matrix); }
    });
    rm.count = ri;
    bm.castShadow = bm.receiveShadow = true; rm.castShadow = true;
    this.scene.add(bm, rm);
    // tentes de cuir
    const tg = new THREE.CylinderGeometry(0, 1, 1, 4, 1); tg.rotateY(Math.PI / 4); tg.scale(1, 1, 1);
    const tm = new THREE.InstancedMesh(tg, new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), Math.max(1, tents.length));
    tents.forEach((tt, i) => {
      o.position.set(tt.x, t.height(tt.x, tt.z) + 0.95, tt.z); o.rotation.set(0, tt.a, 0); o.scale.set(2.2, 1.9, 2.8); o.updateMatrix();
      tm.setMatrixAt(i, o.matrix); tm.setColorAt(i, c.set(tt.c));
    });
    tm.count = tents.length; tm.castShadow = true; tm.receiveShadow = true;
    this.scene.add(tm);
  }

  update(dt, time) {
    if (this.waterMat) {
      this.waterMat.normalMap.offset.set(0, -time * 0.02);
    }
  }
}

function treeGeo(kind) {
  const parts = [];
  const push = (g, col) => {
    const n = g.attributes.position.count, c = new Float32Array(n * 3);
    const cc = new THREE.Color(col);
    for (let i = 0; i < n; i++) { c[i * 3] = cc.r; c[i * 3 + 1] = cc.g; c[i * 3 + 2] = cc.b; }
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    parts.push(g.index ? g.toNonIndexed() : g);
  };
  if (kind === 'olive') {
    const tr = new THREE.CylinderGeometry(0.22, 0.38, 2.4, 5); tr.translate(0, 1.2, 0); tr.rotateZ(0.12); push(tr, '#6a5a48');
    for (const [x, y, z, s] of [[0, 3.6, 0, 2.4], [1.3, 3.1, 0.6, 1.7], [-1.1, 3.2, -0.5, 1.8]]) {
      const c = new THREE.IcosahedronGeometry(s, 0); c.scale(1, 0.7, 1); c.translate(x, y, z); push(c, '#ffffff');
    }
  } else if (kind === 'poplar') {
    const tr = new THREE.CylinderGeometry(0.15, 0.3, 4, 5); tr.translate(0, 2, 0); push(tr, '#5a4a3a');
    const c = new THREE.IcosahedronGeometry(1.9, 0); c.scale(1, 3.6, 1); c.translate(0, 9, 0); push(c, '#ffffff');
  } else {
    const c = new THREE.IcosahedronGeometry(1.1, 0); c.scale(1.2, 0.8, 1.2); c.translate(0, 0.6, 0); push(c, '#ffffff');
  }
  // fusion
  let n = 0; for (const p of parts) n += p.attributes.position.count;
  const P = new Float32Array(n * 3), C = new Float32Array(n * 3); let o = 0;
  for (const p of parts) { P.set(p.attributes.position.array, o * 3); C.set(p.attributes.color.array, o * 3); o += p.attributes.position.count; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  g.setAttribute('color', new THREE.BufferAttribute(C, 3));
  g.computeVertexNormals();
  return g;
}

function detailTexture(S) {
  const n = makeNoise2D(9), m = makeNoise2D(17);
  const data = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = x / S, v = y / S;
    // bruit périodique (tuile sans couture)
    const tile = (f, nn, o) => {
      const a = u * Math.PI * 2, b = v * Math.PI * 2;
      return nn.fbm(Math.cos(a) * f + o, Math.sin(a) * f + Math.cos(b) * f * 0.7 + Math.sin(b) * f * 0.7, 4);
    };
    const i = (y * S + x) * 4;
    const stub = Math.abs(Math.sin((u * 60 + n(u * 9, v * 9) * 2) * Math.PI)) ** 6;
    const cl = (v) => Math.max(0, Math.min(255, v));
    data[i] = cl(128 + 90 * tile(3, n, 0) - 60 * stub);
    data[i + 1] = cl(128 + 110 * tile(2, m, 5));
    data[i + 2] = cl(128 + 120 * tile(6, m, 9));
    data[i + 3] = 255;
  }
  const t = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true; t.needsUpdate = true;
  return t;
}
function waterNormals(S) {
  const n = makeNoise2D(3);
  const h = new Float32Array(S * S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const a = (x / S) * Math.PI * 2, b = (y / S) * Math.PI * 2;
    h[y * S + x] = n.fbm(Math.cos(a) * 2 + 3, Math.sin(a) * 2 + Math.cos(b) * 3 + Math.sin(b) * 3, 4);
  }
  const data = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = h[y * S + ((x + 1) % S)] - h[y * S + ((x - 1 + S) % S)];
    const dy = h[((y + 1) % S) * S + x] - h[((y - 1 + S) % S) * S + x];
    const nx = -dx * 6, ny = -dy * 6, nz = 1, l = Math.hypot(nx, ny, nz);
    const i = (y * S + x) * 4;
    data[i] = (nx / l * 0.5 + 0.5) * 255; data[i + 1] = (ny / l * 0.5 + 0.5) * 255; data[i + 2] = (nz / l * 0.5 + 0.5) * 255; data[i + 3] = 255;
  }
  const t = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.needsUpdate = true;
  return t;
}
