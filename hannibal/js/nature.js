/* Nature détaillée : chaumes et herbes sèches en 3D autour de la caméra, rochers, roseaux,
   nuages et leurs ombres sur la plaine, textures fines du sol (chaume, mottes, cailloux). */
import * as THREE from 'three';
import { HALF } from './terrain.js';
import { makeNoise2D, mulberry32, smoothstep } from './noise.js';

/* ----------------------------------------------------------- nuages
   Une texture de bruit qui se répète, utilisée à la fois pour la couche de nuages
   et pour leurs ombres : ce que l'on voit au ciel est ce qui assombrit le sol. */
export const CLOUD = {
  uCloudTex: { value: null },
  uCloudOff: { value: new THREE.Vector2() },
  uCloudCover: { value: 0.58 },
  uSunDir: { value: new THREE.Vector3(0, 1, 0) },
};
export const CLOUD_H = 1900, CLOUD_SCALE = 5200;
export const CLOUD_GLSL = /* glsl */`
uniform sampler2D uCloudTex; uniform vec2 uCloudOff; uniform float uCloudCover; uniform vec3 uSunDir;
float cloudAt(vec2 p) {
  vec2 uv = p / ${CLOUD_SCALE.toFixed(1)} + uCloudOff;
  float d = texture2D(uCloudTex, uv).r * 0.68 + texture2D(uCloudTex, uv * 2.7 + 0.37).r * 0.32;
  return smoothstep(uCloudCover, uCloudCover + 0.24, d);
}
float cloudShadow(vec3 wp) {
  float k = (${CLOUD_H.toFixed(1)} - wp.y) / max(0.12, uSunDir.y);
  return cloudAt(wp.xz + uSunDir.xz * k) * 0.3 * smoothstep(0.02, 0.15, uSunDir.y);
}`;
export function makeCloudTexture(S = 256) {
  // bruit qui se répète sans couture : mélange de quatre copies décalées
  const n = makeNoise2D(31), F = 5 / S;
  const f = (x, y) => n.fbm(x * F, y * F, 5);
  const data = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = x / S, v = y / S;
    const val = f(x, y) * (1 - u) * (1 - v) + f(x - S, y) * u * (1 - v) + f(x, y - S) * (1 - u) * v + f(x - S, y - S) * u * v;
    const w = (1 - u) * (1 - v) + u * (1 - v) + (1 - u) * v + u * v;
    const k = 0.5 + 0.9 * (val / w);
    const i = (y * S + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = Math.max(0, Math.min(255, k * 255)); data[i + 3] = 255;
  }
  const t = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true; t.needsUpdate = true;
  return t;
}
export function makeCloudLayer(scene) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...CLOUD, uSunCol: { value: new THREE.Color(1, 1, 1) }, uFogCol: { value: new THREE.Color() } },
    vertexShader: /* glsl */`varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      ${CLOUD_GLSL}
      uniform vec3 uSunCol; uniform vec3 uFogCol; varying vec3 vW;
      void main(){
        float c = cloudAt(vW.xz);
        if (c < 0.01) discard;
        float thick = cloudAt(vW.xz - uSunDir.xz * 260.0);
        vec3 lit = mix(vec3(1.0, 0.99, 0.97), vec3(0.62, 0.64, 0.7), thick * 0.7) * uSunCol;
        float d = length(vW.xz - cameraPosition.xz);
        float fade = 1.0 - smoothstep(9000.0, 26000.0, d);
        vec3 col = mix(uFogCol, lit, fade * 0.85 + 0.15);
        gl_FragColor = vec4(col, c * 0.92 * (0.25 + 0.75 * fade));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });
  const g = new THREE.PlaneGeometry(60000, 60000, 1, 1); g.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(g, mat);
  m.position.y = CLOUD_H; m.renderOrder = -1; m.frustumCulled = false;
  scene.add(m);
  return m;
}

/* ------------------------------------------------- textures fines du sol */
export function makeStrawTexture(S, zama) {
  const cv = document.createElement('canvas'); cv.width = cv.height = S;
  const c = cv.getContext('2d');
  const rnd = mulberry32(zama ? 77 : 11);
  c.fillStyle = zama ? '#8a8a8a' : '#808080'; c.fillRect(0, 0, S, S);
  // mottes de terre et cailloux
  for (let i = 0; i < S * 1.6; i++) {
    const x = rnd() * S, y = rnd() * S, r = 1 + rnd() * (zama ? 5 : 3);
    const g = 70 + rnd() * 90;
    c.fillStyle = `rgb(${g},${g},${g})`;
    c.beginPath(); c.ellipse(x, y, r, r * (0.6 + rnd() * 0.5), rnd() * 3, 0, Math.PI * 2); c.fill();
  }
  if (!zama) {
    // chaumes : tiges coupées alignées en rangs, et pailles couchées
    const rows = 26;
    for (let r = 0; r < rows; r++) {
      const y0 = (r + 0.5) * (S / rows);
      for (let k = 0; k < S / 4; k++) {
        const x = rnd() * S, y = y0 + (rnd() - 0.5) * (S / rows) * 0.5;
        const g = 150 + rnd() * 100;
        c.fillStyle = `rgb(${g},${g},${g})`;
        c.fillRect(x, y, 1.2 + rnd(), 1.2 + rnd() * 2);
      }
    }
    c.lineCap = 'round';
    for (let i = 0; i < S * 1.4; i++) {
      const x = rnd() * S, y = rnd() * S, a = rnd() * Math.PI, l = 4 + rnd() * 16;
      const g = 165 + rnd() * 90;
      c.strokeStyle = `rgba(${g},${g},${g * 0.95},${0.5 + rnd() * 0.5})`;
      c.lineWidth = 0.7 + rnd() * 0.9;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
    }
  } else {
    for (let i = 0; i < S * 0.8; i++) {
      const x = rnd() * S, y = rnd() * S, a = rnd() * Math.PI, l = 2 + rnd() * 8;
      const g = 120 + rnd() * 80;
      c.strokeStyle = `rgba(${g},${g},${g},0.7)`; c.lineWidth = 0.8;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
    }
  }
  // raccord des bords : on recopie le motif décalé pour masquer la couture
  const img = c.getImageData(0, 0, S, S);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.NoColorSpace;
  void img;
  return t;
}

/* ------------------------------------------- hauteur du relief en texture */
export function heightTexture(ter) {
  const t = new THREE.DataTexture(ter.h, ter.N, ter.N, THREE.RedFormat, THREE.FloatType);
  t.magFilter = t.minFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
}
const TERRAIN_GLSL = /* glsl */`
uniform sampler2D uHeight; uniform float uHN; uniform float uCell;
float terrainH(vec2 p) {
  vec2 f = (p + ${HALF.toFixed(1)}) / uCell; vec2 i = floor(f); vec2 t = f - i;
  float s = 1.0 / uHN;
  float a = texture2D(uHeight, (i + vec2(0.5, 0.5)) * s).r, b = texture2D(uHeight, (i + vec2(1.5, 0.5)) * s).r;
  float c = texture2D(uHeight, (i + vec2(0.5, 1.5)) * s).r, d = texture2D(uHeight, (i + vec2(1.5, 1.5)) * s).r;
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}`;

/* ------------------------------------------------------------ herbes
   Un carré d'herbes sèches et de chaumes qui suit la caméra ; chaque touffe prend
   la couleur du sol, se couche là où les troupes ont piétiné, et ondule au vent. */
export class GrassField {
  constructor(scene, ter, world, count, tile) {
    this.tile = tile;
    const blades = [];
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI + 0.3;
      const ca = Math.cos(a), sa = Math.sin(a), w = 0.022;
      // brin effilé : 2 triangles, légèrement courbé
      const P = [[-w, 0], [w, 0], [w * 0.5, 0.55], [-w * 0.5, 0.55], [0, 1]];
      const off = [(k - 1) * 0.05, (k % 2) * 0.04];
      const pts = P.map(([x, y]) => [x * ca + off[0], y, x * sa + off[1] + y * y * 0.12]);
      blades.push(pts[0], pts[1], pts[2], pts[0], pts[2], pts[3], pts[3], pts[2], pts[4]);
    }
    const pos = new Float32Array(blades.flat());
    const g = new THREE.InstancedBufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    const rnd = mulberry32(9);
    const off = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      off[i * 4] = rnd() * tile; off[i * 4 + 1] = rnd() * tile;
      off[i * 4 + 2] = 0.22 + rnd() * rnd() * 0.55; off[i * 4 + 3] = rnd() * Math.PI * 2;
    }
    g.setAttribute('iOff', new THREE.InstancedBufferAttribute(off, 4));
    g.instanceCount = count;
    const zama = ter.dry;
    this.u = {
      uCenter: { value: new THREE.Vector2() }, uTile: { value: tile }, uTime: { value: 0 },
      uWind: { value: new THREE.Vector2() }, uHeight: { value: heightTexture(ter) }, uHN: { value: ter.N }, uCell: { value: ter.cell },
      uGround: { value: world.colTex }, uTrample: { value: world.trTex }, uSparse: { value: zama ? 0.55 : 0.0 },
    };
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.92, side: THREE.DoubleSide });
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, this.u, CLOUD);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', `#include <common>
          ${TERRAIN_GLSL}
          attribute vec4 iOff; uniform vec2 uCenter; uniform float uTile; uniform float uTime; uniform vec2 uWind;
          uniform sampler2D uGround; uniform sampler2D uTrample; uniform float uSparse;
          varying vec3 vGCol; varying vec3 vWP;`)
        .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = vec3(0.0, 1.0, 0.0);')
        .replace('#include <begin_vertex>', `
          vec2 rel = mod(iOff.xy - uCenter + uTile * 0.5, uTile) - uTile * 0.5;
          vec2 wp = uCenter + rel;
          vec2 guv = (wp + ${HALF.toFixed(1)}) / ${(HALF * 2).toFixed(1)};
          vec4 tr = texture2D(uTrample, guv);
          vec3 gc = texture2D(uGround, guv).rgb;
          float fade = 1.0 - smoothstep(uTile * 0.32, uTile * 0.49, length(rel));
          float wet = smoothstep(0.08, 0.02, gc.r - gc.b);
          float keep = step(uSparse, fract(sin(dot(iOff.xy, vec2(12.9898, 78.233))) * 43758.5453));
          float hgt = iOff.z * fade * keep * (1.0 - clamp(tr.r * 1.6, 0.0, 0.95)) * (1.0 - wet);
          float c = cos(iOff.w), s = sin(iOff.w);
          vec3 p = vec3(position.x * c - position.z * s, position.y * hgt, position.x * s + position.z * c);
          float sway = (0.18 + 0.1 * sin(uTime * 1.9 + wp.x * 0.27 + wp.y * 0.21)) * position.y * position.y * hgt;
          p.xz += uWind * sway;
          vec3 transformed = vec3(wp.x, terrainH(wp) - 0.02, wp.y) + p;
          vWP = transformed;
          vGCol = gc * vec3(1.08, 1.04, 0.92) * (0.62 + 0.55 * position.y) * (0.9 + 0.2 * fract(iOff.w * 3.7));`);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          ${CLOUD_GLSL}
          varying vec3 vGCol; varying vec3 vWP;`)
        .replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'vec4 diffuseColor = vec4( vGCol * (1.0 - cloudShadow(vWP)), opacity );');
    };
    mat.customProgramCacheKey = () => 'grass';
    this.mesh = new THREE.Mesh(g, mat);
    this.mesh.frustumCulled = false;
    this.mesh.receiveShadow = true;
    scene.add(this.mesh);
  }
  update(cam, target, time, wind) {
    const dx = target.x - cam.position.x, dz = target.z - cam.position.z, l = Math.hypot(dx, dz) || 1;
    const k = Math.min(l, this.tile * 0.3);
    this.u.uCenter.value.set(cam.position.x + (dx / l) * k, cam.position.z + (dz / l) * k);
    this.u.uTime.value = time;
    this.u.uWind.value.set(wind.x * wind.speed * 0.12, wind.z * wind.speed * 0.12);
    const h = cam.position.y - target.y;
    this.mesh.visible = h < 260;
  }
}

/* ------------------------------------------------------ rochers et roseaux */
export function addRocks(scene, ter, count, shadows) {
  if (!count) return;
  const rnd = mulberry32(17), n = makeNoise2D(4);
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 1 + 0.28 * n(x * 1.7 + 3, z * 1.7 + y);
    p.setXYZ(i, x * k, y * k * 0.62, z * k);
  }
  geo.computeVertexNormals();
  const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.95, flatShading: true }), count);
  const o = new THREE.Object3D(), c = new THREE.Color();
  let i = 0, tries = 0;
  const zama = ter.dry;
  while (i < count && tries++ < count * 30) {
    const x = (rnd() * 2 - 1) * HALF, z = (rnd() * 2 - 1) * HALF;
    const sl = Math.abs(ter.height(x + 5, z) - ter.height(x - 5, z)) + Math.abs(ter.height(x, z + 5) - ter.height(x, z - 5));
    const core = Math.max(Math.abs(x) * 0.8, Math.abs(z));
    const want = smoothstep(0.6, 2.5, sl) * 0.9 + (core > 900 ? 0.05 : 0.004) + (zama ? 0.04 : 0);
    if (rnd() > want) continue;
    if (ter.hasRiver && ter.riverDist(x, z) < 40) continue;
    const s = (0.2 + Math.pow(rnd(), 3) * 2.2) * (core > 900 ? 1 : 0.45);
    o.position.set(x, ter.height(x, z) - s * 0.15, z); o.rotation.set(rnd() * 0.4, rnd() * 6.3, rnd() * 0.4);
    o.scale.set(s * (0.8 + rnd() * 0.5), s, s * (0.8 + rnd() * 0.5)); o.updateMatrix();
    m.setMatrixAt(i, o.matrix);
    const v = 0.36 + rnd() * 0.2;
    m.setColorAt(i, c.setRGB(v * (zama ? 1.0 : 0.95), v * (zama ? 0.84 : 0.9), v * (zama ? 0.7 : 0.8)));
    i++;
  }
  m.count = i; m.castShadow = shadows; m.receiveShadow = true;
  scene.add(m);
}
export function addReeds(scene, ter, count, uTime) {
  if (!ter.hasRiver || !count) return;
  const P = [];
  for (let k = 0; k < 7; k++) {
    const a = k * 2.4, r = 0.25 * Math.sqrt(k / 7), x = Math.cos(a) * r, z = Math.sin(a) * r;
    const h = 1.6 + (k % 3) * 0.45, w = 0.03, lean = (k - 3) * 0.06;
    P.push([x - w, 0, z], [x + w, 0, z], [x + lean, h, z + lean * 0.5]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P.flat(), 3));
  g.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.85, side: THREE.DoubleSide });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `vec3 transformed = position;
        float ph = instanceMatrix[3].x * 0.13 + instanceMatrix[3].z * 0.11;
        transformed.x += sin(uTime * 1.7 + ph) * 0.12 * position.y * position.y / 4.0;`);
  };
  const m = new THREE.InstancedMesh(g, mat, count);
  const rnd = mulberry32(23), o = new THREE.Object3D(), c = new THREE.Color();
  let i = 0, tries = 0;
  while (i < count && tries++ < count * 20) {
    const z = (rnd() * 2 - 1) * HALF, side = rnd() < 0.5 ? -1 : 1;
    const d = 24 + rnd() * 34;
    const dzz = 2, sl = (ter.riverX(z + dzz) - ter.riverX(z - dzz)) / (2 * dzz);
    const x = ter.riverX(z) + side * d / Math.cos(Math.atan(sl));
    const y = ter.height(x, z), wl = ter.waterLevelAt(z);
    if (y > wl + 1.6) continue;
    o.position.set(x, Math.max(y, wl - 0.4), z); o.rotation.set(0, rnd() * 6.3, 0);
    const s = 0.7 + rnd() * 0.7; o.scale.set(s, s, s); o.updateMatrix();
    m.setMatrixAt(i, o.matrix);
    m.setColorAt(i, c.setRGB(0.42 + rnd() * 0.15, 0.45 + rnd() * 0.12, 0.22 + rnd() * 0.08));
    i++;
  }
  m.count = i; m.receiveShadow = true;
  scene.add(m);
}
