/* Effets : projectiles, armes fichées au sol, poussière, étendards, contours tactiques. */
import * as THREE from 'three';
import { mulberry32 } from './noise.js';

const _o = new THREE.Object3D();
const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const Z = new THREE.Vector3(0, 0, 1);

export class Effects {
  constructor(scene, battle, terrain, q) {
    this.scene = scene; this.b = battle; this.ter = terrain; this.q = q;
    this.rnd = mulberry32(5);
    // ------------------------------------------------ projectiles en vol
    const shaft = new THREE.CylinderGeometry(0.014, 0.014, 1, 4, 1); shaft.rotateX(Math.PI / 2);
    const metal = new THREE.MeshStandardMaterial({ color: 0x8a7a60, roughness: 0.6 });
    this.shafts = new THREE.InstancedMesh(shaft, metal, 3000);
    this.shafts.count = 0; this.shafts.frustumCulled = false;
    this.stones = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.06, 0), new THREE.MeshStandardMaterial({ color: 0x4a4440, roughness: 0.7 }), 3000);
    this.stones.count = 0; this.stones.frustumCulled = false;
    this.stuck = new THREE.InstancedMesh(shaft, metal, 5000);
    this.stuck.count = 0; this.stuck.frustumCulled = false; this.stuck.castShadow = false;
    this.stuckN = 0;
    scene.add(this.shafts, this.stones, this.stuck);
    // ------------------------------------------------------------ poussière
    this.dustCap = q.dust;
    const qg = new THREE.InstancedBufferGeometry();
    qg.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3));
    qg.setIndex([0, 1, 2, 0, 2, 3]);
    this.dP = new THREE.InstancedBufferAttribute(new Float32Array(this.dustCap * 4), 4);
    this.dD = new THREE.InstancedBufferAttribute(new Float32Array(this.dustCap * 4), 4);
    this.dP.setUsage(THREE.DynamicDrawUsage); this.dD.setUsage(THREE.DynamicDrawUsage);
    qg.setAttribute('iP', this.dP); qg.setAttribute('iD', this.dD);
    qg.instanceCount = 0;
    this.dust = { n: 0, x: new Float32Array(this.dustCap), y: new Float32Array(this.dustCap), z: new Float32Array(this.dustCap), s: new Float32Array(this.dustCap), age: new Float32Array(this.dustCap), life: new Float32Array(this.dustCap), a: new Float32Array(this.dustCap) };
    this.dustMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uCamR: { value: new THREE.Vector3() }, uCamU: { value: new THREE.Vector3() }, uCol: { value: new THREE.Color() } }]),
      vertexShader: /* glsl */`
        #include <fog_pars_vertex>
        attribute vec4 iP; attribute vec4 iD;
        uniform vec3 uCamR; uniform vec3 uCamU;
        varying float vA; varying vec2 vUv;
        void main(){
          float age = iD.x / iD.y;
          float size = iP.w * (0.55 + 0.9*age);
          vec3 wp = iP.xyz + (uCamR * position.x + uCamU * position.y) * size;
          vUv = position.xy + 0.5;
          vA = iD.z * smoothstep(0.0, 0.12, age) * (1.0 - smoothstep(0.45, 1.0, age));
          vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
          vA *= smoothstep(2.0, 25.0, -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: /* glsl */`
        #include <common>
        #include <fog_pars_fragment>
        uniform vec3 uCol; varying float vA; varying vec2 vUv;
        void main(){
          vec2 d = vUv - 0.5; float r = length(d) * 2.0;
          float a = (1.0 - smoothstep(0.15, 1.0, r)) * vA;
          a *= 0.75 + 0.25 * sin(vUv.x * 9.0 + vUv.y * 7.0);
          gl_FragColor = vec4(uCol, a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }`,
      transparent: true, depthWrite: false, fog: true,
    });
    this.dustMesh = new THREE.Mesh(qg, this.dustMat);
    this.dustMesh.frustumCulled = false; this.dustMesh.renderOrder = 2;
    this.dustGeo = qg;
    scene.add(this.dustMesh);
    // ----------------------------------------------------------- étendards
    const sc = this.b.scn.sideColors;
    this.sideRGB = sc ? sc.map((h) => { const c = new THREE.Color(h); return [c.r ** 0.45, c.g ** 0.45, c.b ** 0.45]; }) : null;
    this.buildStandards();
    // ------------------------------------------------- contours tactiques
    this.lineGeo = new THREE.BufferGeometry();
    this.linePos = new Float32Array(30000 * 3); this.lineCol = new Float32Array(30000 * 3);
    this.lineGeo.setAttribute('position', new THREE.BufferAttribute(this.linePos, 3).setUsage(THREE.DynamicDrawUsage));
    this.lineGeo.setAttribute('color', new THREE.BufferAttribute(this.lineCol, 3).setUsage(THREE.DynamicDrawUsage));
    this.lines = new THREE.LineSegments(this.lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, depthTest: false, fog: false }));
    this.lines.frustumCulled = false; this.lines.renderOrder = 10;
    scene.add(this.lines);
    this.fillGeo = new THREE.BufferGeometry();
    this.fillPos = new Float32Array(6000 * 3); this.fillCol = new Float32Array(6000 * 3);
    this.fillGeo.setAttribute('position', new THREE.BufferAttribute(this.fillPos, 3).setUsage(THREE.DynamicDrawUsage));
    this.fillGeo.setAttribute('color', new THREE.BufferAttribute(this.fillCol, 3).setUsage(THREE.DynamicDrawUsage));
    this.fills = new THREE.Mesh(this.fillGeo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.22, depthTest: false, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    this.fills.frustumCulled = false; this.fills.renderOrder = 9;
    scene.add(this.fills);
  }

  buildStandards() {
    const units = this.b.units.filter((u) => !u.light);
    this.stdUnits = units;
    const pole = new THREE.CylinderGeometry(0.03, 0.035, 3.6, 5); pole.translate(0, 1.8, 0);
    const tops = { rom: new THREE.Group(), cav: null };
    void tops;
    const metal = new THREE.MeshStandardMaterial({ color: 0xb08a48, metalness: 0.85, roughness: 0.35 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x6a5038, roughness: 0.8 });
    this.poles = new THREE.InstancedMesh(pole, wood, units.length);
    // emblèmes : disques (phalères) pour Rome, croissant et disque de Tanit pour Carthage
    const disc = new THREE.CylinderGeometry(0.14, 0.14, 0.03, 10); disc.rotateX(Math.PI / 2);
    this.discs = new THREE.InstancedMesh(disc, metal, units.length * 3);
    const cloth = new THREE.PlaneGeometry(0.75, 0.75, 6, 4); cloth.translate(0.375, 0, 0);
    const clothMat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.9 });
    clothMat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = this.clothTime = { value: 0 };
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace('#include <begin_vertex>', `vec3 transformed = position;
          float ph = instanceMatrix[3].x * 0.37 + instanceMatrix[3].z * 0.21;
          float k = position.x / 0.75;
          transformed.z += sin(uTime * 4.0 + position.x * 5.0 + ph) * 0.12 * k;
          transformed.y -= k * k * 0.08;`);
    };
    this.cloths = new THREE.InstancedMesh(cloth, clothMat, units.length);
    const c = new THREE.Color();
    const sc = this.b.scn.sideColors;
    units.forEach((u, i) => {
      const rome = u.side === 0;
      if (sc) { this.cloths.setColorAt(i, c.set(sc[u.side]).multiplyScalar(u.isGen ? 0.95 : 0.75)); return; }
      const col = u.isGen ? (rome ? '#a01818' : '#5a1f52') : u.isCav ? (rome ? '#8e1c1c' : '#6b2a5f') : rome ? '#8e1c1c' : u.type === 'gauls' || u.type === 'gauls_merc' ? '#2e4f7a' : '#6b2a5f';
      this.cloths.setColorAt(i, c.set(col));
    });
    for (const m of [this.poles, this.discs, this.cloths]) { m.castShadow = true; m.frustumCulled = false; this.scene.add(m); }
    this.poles.count = this.discs.count = this.cloths.count = 0;
  }

  // ------------------------------------------------------------- update
  update(dt, realDt, camera, world, selection, overlayMode) {
    const b = this.b;
    // projectiles
    let ns = 0, nr = 0;
    for (let i = 0; i < b.PCAP; i++) {
      if (!b.pOn[i] || b.pAge[i] < 0) continue;
      const kind = b.pKind[i];
      _v.set(b.pVX[i], b.pVY[i], b.pVZ[i]).normalize();
      _q.setFromUnitVectors(Z, _v);
      if (kind === 1) {
        if (nr >= 3000) continue;
        _o.position.set(b.pX[i], b.pY[i], b.pZ[i]); _o.quaternion.identity(); _o.scale.set(1.6, 1.6, 1.6); _o.updateMatrix();
        this.stones.setMatrixAt(nr++, _o.matrix);
      } else {
        if (ns >= 3000) continue;
        const len = kind === 2 ? 2.0 : 1.4;
        _o.position.set(b.pX[i], b.pY[i], b.pZ[i]); _o.quaternion.copy(_q); _o.scale.set(1, 1, len); _o.updateMatrix();
        this.shafts.setMatrixAt(ns++, _o.matrix);
      }
    }
    this.shafts.count = ns; this.stones.count = nr;
    this.shafts.instanceMatrix.needsUpdate = true; this.stones.instanceMatrix.needsUpdate = true;
    // armes fichées au sol (anneau de 5000)
    if (b.stuck.length) {
      const S = b.stuck;
      for (let k = 0; k < S.length; k += 7) {
        const len = S[k + 6] === 2 ? 2.0 : 1.4;
        _v.set(S[k + 3], S[k + 4], S[k + 5]);
        if (_v.y > -0.25) _v.y = -0.25 - this.rnd() * 0.4;
        _v.normalize();
        _q.setFromUnitVectors(Z, _v);
        _o.quaternion.copy(_q);
        _o.position.set(S[k] - _v.x * len * 0.3, S[k + 1] - _v.y * len * 0.3 - 0.05, S[k + 2] - _v.z * len * 0.3);
        _o.scale.set(1, 1, len); _o.updateMatrix();
        this.stuck.setMatrixAt(this.stuckN % 5000, _o.matrix);
        this.stuckN++;
      }
      S.length = 0;
      this.stuck.count = Math.min(5000, this.stuckN);
      this.stuck.instanceMatrix.needsUpdate = true;
    }
    this.updateDust(dt, camera, world);
    this.updateStandards(realDt);
    this.updateOverlay(camera, selection, overlayMode);
  }

  spawnDust(x, z, size, life, alpha) {
    const D = this.dust;
    if (D.n >= this.dustCap) return;
    const i = D.n++;
    D.x[i] = x; D.z[i] = z; D.y[i] = this.ter.height(x, z) + size * 0.22; D.s[i] = size; D.age[i] = 0; D.life[i] = life; D.a[i] = alpha;
  }
  updateDust(dt, camera, world) {
    const D = this.dust, b = this.b, w = b.wind, rnd = this.rnd;
    if (dt > 0) {
      for (const u of b.units) {
        if (!u.alive || u.men < 5) continue;
        let rate = 0;
        if (u.engaged) rate += (u.eS[0] + u.eS[1] + u.eS[2] + u.eS[3]) * 0.012;
        if (u.speed > 0.6) rate += u.w * u.speed * (u.isCav ? 0.0016 : u.isEle ? 0.004 : 0.0005);
        let n = rate * dt;
        while (n > 0) {
          if (n < 1 && rnd() > n) break; n -= 1;
          const lx = (rnd() * 2 - 1) * u.hw;
          const lz = u.engaged ? u.hd - rnd() * 6 : (rnd() * 2 - 1) * u.hd;
          const [x, z] = u.world(lx, lz);
          this.spawnDust(x, z, (u.isCav ? 10 : 7) + rnd() * 9, 9 + rnd() * 8, u.isCav ? 0.13 : 0.09);
        }
      }
    }
    const wx = w.x * w.speed * 0.8, wz = w.z * w.speed * 0.8;
    const P = this.dP.array, A = this.dD.array;
    let j = 0;
    for (let i = 0; i < D.n; i++) {
      D.age[i] += dt;
      if (D.age[i] >= D.life[i]) continue;
      D.x[i] += wx * dt; D.z[i] += wz * dt; D.y[i] += 0.35 * dt;
      if (j !== i) { D.x[j] = D.x[i]; D.y[j] = D.y[i]; D.z[j] = D.z[i]; D.s[j] = D.s[i]; D.age[j] = D.age[i]; D.life[j] = D.life[i]; D.a[j] = D.a[i]; }
      const k = j * 4;
      P[k] = D.x[j]; P[k + 1] = D.y[j]; P[k + 2] = D.z[j]; P[k + 3] = D.s[j];
      A[k] = D.age[j]; A[k + 1] = D.life[j]; A[k + 2] = D.a[j]; A[k + 3] = 0;
      j++;
    }
    D.n = j;
    this.dustGeo.instanceCount = j;
    if (j) {
      this.dP.clearUpdateRanges(); this.dD.clearUpdateRanges();
      this.dP.addUpdateRange(0, j * 4); this.dD.addUpdateRange(0, j * 4);
      this.dP.needsUpdate = true; this.dD.needsUpdate = true;
    }
    const e = camera.matrixWorld.elements;
    this.dustMat.uniforms.uCamR.value.set(e[0], e[1], e[2]);
    this.dustMat.uniforms.uCamU.value.set(e[4], e[5], e[6]);
    // la poussière est éclairée comme le sol : soleil direct + lumière du ciel
    const light = 0.9 + world.sun.intensity * Math.max(0.15, Math.sin(world.sunEl || 0.6)) * 0.85;
    const base = this.b.terrain.dry ? [0.74, 0.58, 0.42] : [0.78, 0.69, 0.53];
    this.dustMat.uniforms.uCol.value.setRGB(base[0], base[1], base[2]).convertSRGBToLinear().multiplyScalar(light * 0.62);
  }

  updateStandards(realDt) {
    if (this.clothTime) this.clothTime.value += realDt;
    let n = 0, nd = 0;
    for (const u of this.stdUnits) {
      if (!u.alive || u.men < 2 || u.routing) continue;
      const [x, z] = u.world(0, u.isGen ? 0 : u.hd - Math.min(3, u.d * 0.15));
      const y = this.ter.height(x, z) + (u.isCav || u.isGen ? 1.0 : 0);
      _o.position.set(x, y, z); _o.rotation.set(0, u.th, 0); _o.scale.set(1, 1, 1); _o.updateMatrix();
      this.poles.setMatrixAt(n, _o.matrix);
      const roman = u.side === 0;
      const flag = u.isCav || u.isGen || !roman;
      // drapeau orienté par le vent
      const wa = Math.atan2(this.b.wind.x, this.b.wind.z) - Math.PI / 2;
      _o.position.set(x, y + 3.15, z); _o.rotation.set(0, wa, 0); _o.scale.set(flag ? (u.isGen ? 1.5 : 1.1) : 0.6, flag ? (u.isGen ? 1.3 : 1) : 0.5, 1); _o.updateMatrix();
      this.cloths.setMatrixAt(n, _o.matrix);
      const nDisc = roman && !u.isCav && !u.isGen ? 3 : !roman ? 1 : 0;
      for (let k = 0; k < nDisc; k++) {
        _o.position.set(x, y + (roman ? 2.0 + k * 0.32 : 3.75), z); _o.rotation.set(0, u.th, 0); _o.scale.set(roman ? 1 : 1.5, roman ? 1 : 1.5, 1); _o.updateMatrix();
        this.discs.setMatrixAt(nd++, _o.matrix);
      }
      n++;
    }
    this.poles.count = this.cloths.count = n; this.discs.count = nd;
    this.poles.instanceMatrix.needsUpdate = this.cloths.instanceMatrix.needsUpdate = this.discs.instanceMatrix.needsUpdate = true;
  }

  // Contours des unités : sélection toujours, toutes les unités si l'aide tactique est active
  updateOverlay(camera, selection, mode) {
    const camH = camera.position.y - this.ter.height(camera.position.x, camera.position.z);
    // « auto » : contour pour les unités choisies seulement ; vu de très haut, une teinte au sol
    const showAll = mode === 'on' || (mode === 'auto' && camH > 650);
    const soft = mode !== 'on';
    const P = this.linePos, C = this.lineCol, FP = this.fillPos, FC = this.fillCol;
    let n = 0, f = 0;
    const seg = (x0, y0, z0, x1, y1, z1, r, g, bb) => {
      if (n >= 29990) return;
      P[n * 3] = x0; P[n * 3 + 1] = y0; P[n * 3 + 2] = z0; C[n * 3] = r; C[n * 3 + 1] = g; C[n * 3 + 2] = bb; n++;
      P[n * 3] = x1; P[n * 3 + 1] = y1; P[n * 3 + 2] = z1; C[n * 3] = r; C[n * 3 + 1] = g; C[n * 3 + 2] = bb; n++;
    };
    const tri = (a, bq, c, r, g, bb) => {
      if (f >= 5990) return;
      for (const p of [a, bq, c]) { FP[f * 3] = p[0]; FP[f * 3 + 1] = p[1]; FP[f * 3 + 2] = p[2]; FC[f * 3] = r; FC[f * 3 + 1] = g; FC[f * 3 + 2] = bb; f++; }
    };
    for (const u of this.b.units) {
      if (!u.alive || u.men < 1) continue;
      const sel = selection.has(u);
      if (!sel && !showAll) continue;
      const rome = u.side === 0;
      let [r, g, bb] = this.sideRGB ? this.sideRGB[u.side] : rome ? [0.85, 0.2, 0.15] : [0.55, 0.3, 0.75];
      if (u.routing) { r = g = bb = 0.75; }
      const k = sel ? 1.25 : 0.7;
      r = Math.min(1, r * k + (sel ? 0.25 : 0)); g = Math.min(1, g * k + (sel ? 0.25 : 0)); bb = Math.min(1, bb * k + (sel ? 0.25 : 0));
      const lift = 1.2;
      const pts = [[-u.hw, u.hd], [u.hw, u.hd], [u.hw, -u.hd], [-u.hw, -u.hd]].map(([lx, lz]) => {
        const [x, z] = u.world(lx, lz); return [x, this.ter.height(x, z) + lift, z];
      });
      if (!sel && soft) { tri(pts[0], pts[1], pts[2], r, g, bb); tri(pts[0], pts[2], pts[3], r, g, bb); continue; }
      for (let i = 0; i < 4; i++) { const a = pts[i], c = pts[(i + 1) % 4]; seg(a[0], a[1], a[2], c[0], c[1], c[2], r, g, bb); }
      // flèche d'orientation devant l'unité
      const al = Math.min(30, Math.max(8, u.w * 0.2));
      const [tx, tz] = u.world(0, u.hd + al), [lx0, lz0] = u.world(-al * 0.5, u.hd + 2), [rx0, rz0] = u.world(al * 0.5, u.hd + 2);
      const ty = this.ter.height(tx, tz) + lift;
      seg(lx0, ty, lz0, tx, ty, tz, r, g, bb); seg(rx0, ty, rz0, tx, ty, tz, r, g, bb);
      tri(pts[0], pts[1], pts[2], r, g, bb); tri(pts[0], pts[2], pts[3], r, g, bb);
      // ordre de mouvement en cours
      if (sel && u.order.kind === 'move') {
        const oy = this.ter.height(u.order.x, u.order.z) + lift;
        seg(u.x, this.ter.height(u.x, u.z) + lift, u.z, u.order.x, oy, u.order.z, 0.95, 0.85, 0.5);
      }
      if (sel && u.order.kind === 'attack' && u.order.target && u.order.target.alive) {
        const t = u.order.target;
        seg(u.x, this.ter.height(u.x, u.z) + lift, u.z, t.x, this.ter.height(t.x, t.z) + lift, t.z, 1, 0.45, 0.3);
      }
    }
    for (const g of this.ghosts || []) {
      const c = Math.cos(g.th), s = Math.sin(g.th);
      const W = (lx, lz) => { const x = g.x - c * lx + s * lz, z = g.z + s * lx + c * lz; return [x, this.ter.height(x, z) + 1.4, z]; };
      const pts = [W(-g.hw, g.hd), W(g.hw, g.hd), W(g.hw, -g.hd), W(-g.hw, -g.hd)];
      for (let i = 0; i < 4; i++) { const a = pts[i], d = pts[(i + 1) % 4]; seg(a[0], a[1], a[2], d[0], d[1], d[2], 1, 0.9, 0.55); }
      const t = W(0, g.hd + 15), l0 = W(-7, g.hd + 2), r0 = W(7, g.hd + 2);
      seg(l0[0], l0[1], l0[2], t[0], t[1], t[2], 1, 0.9, 0.55); seg(r0[0], r0[1], r0[2], t[0], t[1], t[2], 1, 0.9, 0.55);
    }
    this.lineGeo.setDrawRange(0, n);
    this.lineGeo.attributes.position.needsUpdate = true; this.lineGeo.attributes.color.needsUpdate = true;
    this.fillGeo.setDrawRange(0, f);
    this.fillGeo.attributes.position.needsUpdate = true; this.fillGeo.attributes.color.needsUpdate = true;
  }
}
