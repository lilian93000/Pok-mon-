/* Les soldats à l'écran.
   La simulation raisonne en unités ; ici chaque figurine (un homme, ou un groupe d'hommes
   selon l'échelle) a sa place dans les rangs. Quand un homme tombe au premier rang, celui
   qui est derrière lui avance d'un pas pour boucher le trou.
   Rendu : un maillage instancié par archétype et par niveau de détail ; les membres sont
   animés dans le vertex shader (marche, course, coups, lancers, chute). */
import * as THREE from 'three';
import { ARCH, buildArch } from './models.js';
import { ST } from './sim.js';
import { hash1, angDiff } from './noise.js';

const TAU = Math.PI * 2;
export const A = { IDLE: 0, WALK: 1, RUN: 2, FIGHT: 3, THROW: 4, DEAD: 5, KNEEL: 6, BRACE: 7, ROUT: 8 };

const HEAD = /* glsl */`
attribute float aPart; attribute float aMat; attribute vec3 aPivot;
attribute vec4 iPos; attribute vec4 iAnim;
uniform float uTime; uniform vec3 uPal[26]; uniform float uStyle; uniform vec3 uDust;
varying vec3 vCol; varying vec2 vMR;
mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
bool isv(float a, float b){ return abs(a-b) < 0.5; }
float throwArc(float ph){ float c = fract(ph/6.2832); return c<0.55 ? mix(-0.2,0.9,c/0.55) : c<0.7 ? mix(0.9,-2.3,(c-0.55)/0.15) : mix(-2.3,-0.2,(c-0.7)/0.3); }
vec3 figAnim(vec3 p, inout vec3 n) {
  float st = mod(iAnim.x, 16.0);
  float fl = floor(iAnim.x / 16.0 + 0.001);
  float ph = iAnim.y, dth = iAnim.z, sd = iAnim.w, part = aPart;
  vec3 pv = aPivot;
  bool runS = isv(st,2.) || isv(st,8.);
  if (uStyle < 9.5) {
    // ---------------- fantassin
    float legA = 0., armR = -0.12, armL = -0.38, lean = 0., bob = 0., drop = 0.;
    if (isv(st,1.)) { legA = 0.5*sin(ph); armR = -0.12 + 0.12*sin(ph); bob = 0.035*abs(cos(ph)); }
    else if (runS) { legA = 0.85*sin(ph); armR = -0.35 + 0.4*sin(ph); armL = isv(st,8.) ? 0.45*sin(ph+3.14) - 0.1 : -0.55; lean = 0.2; bob = 0.06*abs(cos(ph)); }
    else if (isv(st,3.)) {
      float c = fract(ph/6.2832);
      if (uStyle < 0.5) { float t = pow(max(0.,sin(ph)),3.); armR = -0.95 - 0.75*t; armL = -0.85 - 0.2*t; lean = 0.12 + 0.1*t; }
      else if (uStyle < 1.5) { armR = mix(-0.6, -2.75, smoothstep(0.0,0.45,c)); armR = mix(armR, -0.35, smoothstep(0.55,0.68,c)); armL = -0.7; lean = 0.08 + 0.12*smoothstep(0.55,0.68,c); }
      else { float t = pow(max(0.,sin(ph)),2.); armR = -1.3 - 0.3*t; armL = -0.75; lean = 0.1 + 0.06*t; }
    }
    else if (isv(st,4.)) { armR = uStyle > 3.5 ? -2.6 + 0.5*sin(ph*3.) : throwArc(ph); armL = -0.5; lean = 0.06; }
    else if (isv(st,6.)) { drop = 0.42; armL = -0.2; armR = -0.05; }
    else if (isv(st,7.)) { armR = -1.35; armL = -0.75; lean = 0.08; }
    else if (isv(st,5.)) { float k = min(1., dth*1.6); armR = -2.6*k; armL = -1.1*k; }
    else { armR = -0.12 + 0.03*sin(uTime*1.3+sd*30.); armL = -0.38; bob = 0.008*sin(uTime*1.7+sd*20.); }
    mat3 R = mat3(1.); bool rot = false;
    if (isv(part,1.) || isv(part,2.)) {
      float a = isv(part,1.) ? legA : -legA;
      if (isv(st,3.) || isv(st,7.) || isv(st,4.)) a = isv(part,1.) ? -0.3 : 0.28;
      if (isv(st,6.)) a = isv(part,1.) ? -0.95 : 1.0;
      R = rX(a); rot = true;
    } else if (isv(part,3.) || isv(part,6.) || isv(part,7.)) { R = rX(armR); rot = true; }
    else if (isv(part,4.)) { R = rX(armL); rot = true; }
    else if (isv(part,5.)) { R = rY(0.3*sin(uTime*0.37 + sd*40.)); rot = true; }
    if (rot) { p = R*(p - pv) + pv; n = R*n; }
    bool noPila = mod(fl, 2.) > 0.5;
    bool melee = isv(st,3.) || isv(st,5.);
    if (isv(part,6.) && (melee || noPila)) p = pv;
    if (isv(part,7.) && !(melee || noPila)) p = pv;
    if (!(isv(part,1.) || isv(part,2.))) { mat3 L = rX(lean); vec3 h = vec3(0.,0.92,0.); p = L*(p-h)+h; n = L*n; }
    p.y += bob - drop;
  } else if (uStyle < 19.5) {
    // ---------------- cheval et cavalier
    float gA = 0., pitch = 0., bob = 0.;
    vec4 phs = vec4(0., 3.1416, 1.5708, 4.7124);
    if (isv(st,1.)) gA = 0.35;
    else if (runS) { gA = 0.75; phs = vec4(0., 0.6, 3.1416, 3.75); pitch = 0.07*sin(ph); bob = 0.12*abs(sin(ph)); }
    else if (isv(st,3.)) { gA = 0.2; pitch = 0.03*sin(ph*0.5); }
    if (part > 10.5 && part < 14.5) {
      float i = part - 11.;
      float o = i < 0.5 ? phs.x : i < 1.5 ? phs.y : i < 2.5 ? phs.z : phs.w;
      float a = gA * sin(ph + o);
      if (isv(st,5.)) a = 0.45 * (i < 1.5 ? -1. : 1.) * min(1., dth*1.5);
      mat3 R = rX(a); p = R*(p-pv)+pv; n = R*n;
    } else if (isv(part,15.)) {
      float a = runS ? 0.12*sin(ph) : isv(st,0.) ? 0.55*smoothstep(0.8,1.,sin(uTime*0.23+sd*17.)) : 0.06*sin(ph);
      mat3 R = rX(a); p = R*(p-pv)+pv; n = R*n;
    } else if (isv(part,19.)) {
      mat3 R = rZ(0.25*sin(uTime*2.+sd*10.)) * rX(runS ? -0.6 : 0.); p = R*(p-pv)+pv; n = R*n;
    } else if (isv(part,17.)) {
      float a = -0.25;
      if (isv(st,3.)) a = uStyle > 10.5 ? -0.8 - 1.4*pow(max(0.,sin(ph)),2.) : -1.3 - 0.35*pow(max(0.,sin(ph)),3.);
      else if (isv(st,4.)) a = throwArc(ph);
      else if (runS) a = uStyle > 10.5 ? -0.3 : -1.2;
      mat3 R = rX(a); p = R*(p-pv)+pv; n = R*n;
    } else if (isv(part,18.)) { mat3 R = rX(-0.55); p = R*(p-pv)+pv; n = R*n; }
    mat3 P = rX(pitch); vec3 c0 = vec3(0.,1.1,0.); p = P*(p-c0)+c0; n = P*n;
    p.y += bob;
  } else {
    // ---------------- éléphant
    float gA = isv(st,1.) ? 0.25 : runS ? 0.42 : isv(st,3.) ? 0.15 : 0.;
    if (part > 20.5 && part < 24.5) {
      float i = part - 21.; float o = i<0.5?0.:i<1.5?3.1416:i<2.5?1.5708:4.7124;
      mat3 R = rX(gA*sin(ph+o)); p = R*(p-pv)+pv; n = R*n;
    } else if (isv(part,25.)) {
      float a = isv(st,3.) ? -0.9 + 0.5*sin(ph*0.7) : runS ? -0.75 : 0.25*sin(uTime*0.8+sd*9.);
      mat3 R = rX(a); p = R*(p-pv)+pv; n = R*n;
    } else if (isv(part,26.)) {
      float a = (runS||isv(st,3.) ? 0.5 : 0.15)*sin(uTime*(runS?4.:1.)+sd*7.);
      mat3 R = rY(a*sign(pv.x)); p = R*(p-pv)+pv; n = R*n;
    } else if (isv(part,19.)) { mat3 R = rZ(0.3*sin(uTime*1.5+sd*10.)); p = R*(p-pv)+pv; n = R*n; }
    p.y += runS ? 0.08*abs(sin(ph)) : 0.;
  }
  if (isv(st,5.)) {
    float f = 1. - pow(1. - clamp(dth,0.,1.), 2.);
    float dir = sd > 0.5 ? 1. : -1.;
    if (uStyle < 9.5) { mat3 D = rX(dir*1.48*f) * rZ((fract(sd*7.)-0.5)*0.7*f); p = D*p; n = D*n; p.y += 0.12*f; }
    else { mat3 D = rZ(dir*1.42*f); p = D*p; n = D*n; p.y += (uStyle > 19.5 ? 0.9 : 0.32)*f; }
  }
  mat3 H = rY(iPos.w); p = H*p; n = H*n;
  return p + iPos.xyz;
}
void figColor() {
  int mi = int(aMat + 0.5); float sd = iAnim.w;
  vec3 c;
  if (mi == 7) c = uPal[16 + int(fract(sd*7.31)*3.999)];
  else if (mi == 12) c = uPal[20 + int(fract(sd*3.17)*3.999)];
  else if (mi == 1) c = fract(sd*5.13) > 0.55 ? uPal[24] : uPal[1];
  else if (mi == 2 && abs(uStyle-1.) < 0.5) c = fract(sd*2.71) > 0.5 ? uPal[25] : uPal[2];
  else c = uPal[mi];
  if (mi == 0) c *= 0.82 + 0.3*fract(sd*13.7);
  else if (mi == 10) c *= 0.45 + 0.75*fract(sd*9.1);
  else if (mi == 9) { if (fract(sd*4.3) > 0.5) c = vec3(0.018,0.016,0.02); }
  else c *= 0.88 + 0.24*fract(sd*17.9);
  float low = 1. - smoothstep(0.05, 0.75, position.y);
  vCol = mix(c, uDust, 0.32*low);
  vMR = (mi==3||mi==8) ? vec2(0.85, 0.36) : mi==4 ? vec2(0.75, 0.45) : vec2(0.0, 0.86);
}
`;

function figMaterial(arch, uniforms) {
  const pal = [];
  for (let i = 0; i < 26; i++) pal.push(new THREE.Color(arch.pal[i]));
  const u = { uTime: uniforms.uTime, uDust: uniforms.uDust, uPal: { value: pal }, uStyle: { value: arch.style } };
  const m = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + HEAD)
      .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = normal; vec3 animP = figAnim(position, objectNormal); figColor();')
      .replace('#include <begin_vertex>', 'vec3 transformed = animP;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCol; varying vec2 vMR;')
      .replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'vec4 diffuseColor = vec4( vCol, opacity );')
      .replace('float roughnessFactor = roughness;', 'float roughnessFactor = vMR.y;')
      .replace('float metalnessFactor = metalness;', 'float metalnessFactor = vMR.x;');
  };
  m.customProgramCacheKey = () => 'figure';
  const d = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  d.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + HEAD)
      .replace('#include <begin_vertex>', 'vec3 nD = vec3(0.,1.,0.); vec3 transformed = figAnim(position, nD);');
  };
  d.customProgramCacheKey = () => 'figure-depth';
  return [m, d];
}

class Layer {
  constructor(geo, cap, mat, depth, shadow) {
    const g = new THREE.InstancedBufferGeometry();
    for (const k in geo.attributes) g.setAttribute(k, geo.attributes[k]);
    this.pos = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, cap) * 4), 4);
    this.anim = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, cap) * 4), 4);
    this.pos.setUsage(THREE.DynamicDrawUsage); this.anim.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('iPos', this.pos); g.setAttribute('iAnim', this.anim);
    g.instanceCount = 0;
    this.g = g; this.cap = cap; this.n = 0;
    this.mesh = new THREE.Mesh(g, mat);
    this.mesh.frustumCulled = false;
    this.mesh.castShadow = shadow; this.mesh.receiveShadow = true;
    this.mesh.customDepthMaterial = depth;
  }
  push(x, y, z, h, st, ph, dt, sd) {
    if (this.n >= this.cap) return false;
    const i = this.n++ * 4, P = this.pos.array, Q = this.anim.array;
    P[i] = x; P[i + 1] = y; P[i + 2] = z; P[i + 3] = h;
    Q[i] = st; Q[i + 1] = ph; Q[i + 2] = dt; Q[i + 3] = sd;
    return true;
  }
  flush() {
    this.g.instanceCount = this.n;
    if (this.n) {
      this.pos.clearUpdateRanges(); this.anim.clearUpdateRanges();
      this.pos.addUpdateRange(0, this.n * 4); this.anim.addUpdateRange(0, this.n * 4);
      this.pos.needsUpdate = true; this.anim.needsUpdate = true;
    }
  }
}

export class Figures {
  constructor(battle, terrain, scene, opts = {}) {
    this.b = battle; this.ter = terrain; this.scene = scene;
    this.scale = battle.scale;
    this.nearDist = opts.nearDist || 140;
    this.nearCap = opts.nearCap || 6000;
    this.shadows = opts.shadows !== false;
    this.uniforms = { uTime: { value: 0 }, uDust: { value: new THREE.Color(battle.scn.terrain === 'zama' ? '#9a7650' : '#8f7a58') } };
    // figurines
    let total = 0;
    const perArch = {};
    for (const u of battle.units) {
      const k = u.T.perFigure ? 1 : this.scale;
      const n = Math.max(1, Math.ceil(u.men0 / k - 1e-6));
      u.fg = { first: total, n, cap: n, ids: new Int32Array(n), k, filesF: 0, reform: -1, arch: u.T.arch, acc: 0, vis: true };
      for (let i = 0; i < n; i++) u.fg.ids[i] = total + i;
      total += n;
      perArch[u.T.arch] = (perArch[u.T.arch] || 0) + n;
    }
    this.total = total;
    const F = (n) => new Float32Array(n);
    this.fx = F(total); this.fz = F(total); this.fy = F(total); this.fh = F(total);
    this.fvx = F(total); this.fvz = F(total); this.fph = F(total); this.fdt = F(total);
    this.fsd = F(total); this.fjx = F(total); this.fjz = F(total);
    this.fst = new Uint8Array(total); this.funit = new Int32Array(total);
    for (const u of battle.units) {
      for (let i = 0; i < u.fg.n; i++) {
        const id = u.fg.ids[i];
        this.funit[id] = u.id;
        this.fsd[id] = hash1(id * 7 + 13);
        this.fjx[id] = (hash1(id * 3 + 1) - 0.5) * 0.36;
        this.fjz[id] = (hash1(id * 5 + 2) - 0.5) * 0.3;
        this.fph[id] = hash1(id + 99) * TAU;
      }
      this.reconcile(u, u.fg, true);
      this.place(u, u.fg);
    }
    this.dying = [];
    // maillages
    this.layers = {};
    for (const key in perArch) {
      const a = ARCH[key];
      const [mat, depth] = figMaterial(a, this.uniforms);
      const near = buildArch(key, 0), far = buildArch(key, 1);
      const cap = perArch[key];
      const L = {
        near: new Layer(near, Math.min(cap, this.nearCap), mat, depth, this.shadows),
        far: new Layer(far, cap, mat, depth, false),
        farS: new Layer(far, cap, mat, depth, this.shadows),
        dead: new Layer(far, cap, mat, depth, false),
      };
      L.dead.mesh.castShadow = false;
      this.layers[key] = L;
      scene.add(L.near.mesh, L.far.mesh, L.farS.mesh, L.dead.mesh);
    }
    this.frustum = new THREE.Frustum();
    this.m4 = new THREE.Matrix4();
    this.sphere = new THREE.Sphere();
    this.time = 0;
    this.visibleCount = 0;
  }

  // ------------------------------------------------- effectifs et rangs
  reconcile(u, fg, init) {
    if (u.state === ST.FLED) { fg.n = 0; return; }
    const target = u.state === ST.DEAD ? 0 : Math.max(0, Math.ceil(u.men / fg.k - 1e-6));
    if (!fg.filesF) fg.filesF = Math.max(1, Math.min(fg.n, Math.round(u.files / Math.sqrt(fg.k))));
    let guard = 0;
    while (fg.n > target && guard++ < 400) {
      const F = fg.filesF, R = Math.ceil(fg.n / F);
      let k;
      if (u.hits.length >= 2) {
        const hz = u.hits.pop(), hx = u.hits.pop();
        const [lx, lz] = u.local(hx, hz);
        const file = Math.max(0, Math.min(F - 1, Math.floor((lx + u.hw) / (u.w / F))));
        const rank = Math.max(0, Math.min(R - 1, Math.floor((u.hd - lz) / (u.d / R))));
        k = rank * F + file;
        if (k >= fg.n) k = Math.min(file, fg.n - 1);
      } else k = Math.floor(Math.random() * Math.min(F, fg.n));
      this.kill(fg, k, init);
    }
    if (!init) u.hits.length = 0;
    const want = Math.max(1, Math.min(Math.max(1, fg.n), Math.round(u.files / Math.sqrt(fg.k))));
    if (u.reform !== fg.reform) { fg.reform = u.reform; this.resort(u, fg, want); }
    else if (want !== fg.filesF) fg.filesF = want;
  }
  kill(fg, k, silent) {
    const id = fg.ids[k], F = fg.filesF;
    let j = k;
    while (j + F < fg.n) { fg.ids[j] = fg.ids[j + F]; j += F; }
    if (j !== fg.n - 1) fg.ids[j] = fg.ids[fg.n - 1];
    fg.n--;
    if (silent) return;
    this.fst[id] = A.DEAD; this.fdt[id] = 0;
    this.dying.push(id);
  }
  resort(u, fg, F) {
    fg.filesF = F;
    const n = fg.n; if (n < 2) return;
    const R = Math.ceil(n / F), sz = u.d / R;
    const arr = new Array(n);
    for (let k = 0; k < n; k++) {
      const id = fg.ids[k];
      const [lx, lz] = u.local(this.fx[id], this.fz[id]);
      const band = Math.max(0, Math.min(R - 1, Math.floor((u.hd - lz) / sz)));
      arr[k] = [band * 1e5 + lx + u.hw + 1000, id];
    }
    arr.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < n; k++) fg.ids[k] = arr[k][1];
  }
  place(u, fg) {
    this.slots(u, fg, (id, x, z) => {
      this.fx[id] = x; this.fz[id] = z; this.fy[id] = this.ter.height(x, z); this.fh[id] = u.th;
    });
  }
  slots(u, fg, cb) {
    const n = fg.n, F = fg.filesF || 1, R = Math.ceil(n / F);
    const sx = u.w / F, sz = u.d / R, last = n - (R - 1) * F;
    for (let k = 0; k < n; k++) {
      const id = fg.ids[k], file = k % F, rank = (k / F) | 0;
      let fo = file + 0.5; if (rank === R - 1) fo += (F - last) / 2;
      const lx = fo * sx - u.hw + this.fjx[id] * sx, lz = u.hd - (rank + 0.5) * sz + this.fjz[id] * sz;
      cb(id, u.x + u.rx * lx + u.fx * lz, u.z + u.rz * lx + u.fz * lz, file, rank, F, R);
    }
  }

  // ------------------------------------------------------ mise à jour
  update(dt, camera) {
    this.time += dt;
    this.uniforms.uTime.value = this.time;
    this.m4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.m4);
    const cx = camera.position.x, cy = camera.position.y, cz = camera.position.z;
    const nd2 = this.nearDist * this.nearDist;
    for (const k in this.layers) { const L = this.layers[k]; L.near.n = 0; L.far.n = 0; L.farS.n = 0; }
    const sb = this.shadowBox;
    let vis = 0;
    for (const u of this.b.units) {
      const fg = u.fg;
      this.reconcile(u, fg, false);
      if (!fg.n) continue;
      this.sphere.center.set(u.x, u.y + 1, u.z);
      this.sphere.radius = u.rad + (u.routing ? 90 : 15);
      const visible = this.frustum.intersectsSphere(this.sphere);
      fg.acc += dt;
      if (!visible && fg.acc < 0.4) continue;
      const step = fg.acc; fg.acc = 0;
      this.move(u, fg, step, visible ? this.layers[fg.arch] : null, cx, cy, cz, nd2, sb);
      if (visible) vis += fg.n;
    }
    // chutes en cours puis passage aux cadavres
    for (let i = this.dying.length - 1; i >= 0; i--) {
      const id = this.dying[i];
      const u = this.b.byId.get(this.funit[id]);
      const L = this.layers[u.fg.arch];
      this.fdt[id] += dt * 1.5;
      const vx = this.fvx[id] *= 0.9, vz = this.fvz[id] *= 0.9;
      this.fx[id] += vx * dt; this.fz[id] += vz * dt;
      if (this.fdt[id] >= 1) {
        L.dead.push(this.fx[id], this.fy[id], this.fz[id], this.fh[id], A.DEAD, 0, 1, this.fsd[id]);
        L.dead.dirty = true;
        this.dying[i] = this.dying[this.dying.length - 1]; this.dying.pop();
        continue;
      }
      const dx = this.fx[id] - cx, dz = this.fz[id] - cz;
      const lay = dx * dx + dz * dz < nd2 ? L.near : L.far;
      if (!lay.push(this.fx[id], this.fy[id], this.fz[id], this.fh[id], A.DEAD, 0, this.fdt[id], this.fsd[id])) L.far.push(this.fx[id], this.fy[id], this.fz[id], this.fh[id], A.DEAD, 0, this.fdt[id], this.fsd[id]);
    }
    for (const k in this.layers) {
      const L = this.layers[k];
      L.near.flush(); L.far.flush(); L.farS.flush();
      if (L.dead.dirty) {
        L.dead.dirty = false;
        L.dead.g.instanceCount = L.dead.n;
        const start = L.dead.flushed || 0;
        L.dead.pos.clearUpdateRanges(); L.dead.anim.clearUpdateRanges();
        L.dead.pos.addUpdateRange(start * 4, (L.dead.n - start) * 4); L.dead.anim.addUpdateRange(start * 4, (L.dead.n - start) * 4);
        L.dead.pos.needsUpdate = true; L.dead.anim.needsUpdate = true;
        L.dead.flushed = L.dead.n;
      }
    }
    this.visibleCount = vis;
  }

  move(u, fg, dt, L, cx, cy, cz, nd2, sb) {
    const n = fg.n, F = fg.filesF || 1, R = Math.ceil(n / F);
    const sx = u.w / F, sz = u.d / R, last = n - (R - 1) * F;
    const routing = u.routing, T = u.T;
    const eF = u.eS[0] > 0, eR = u.eS[1] > 0, eB = u.eS[2] > 0, eL = u.eS[3] > 0;
    const cav = u.isCav, ele = u.isEle;
    const stride = ele ? 2.6 : cav ? 2.6 : 1.45;
    const corr = cav ? 5 : 2.2;
    const maxV = (routing ? T.run * 1.15 : u.speed * 1.15 + corr);
    const throwing = u.firing > 0 && (T.missile || u.T.pila);
    const kneel = u.type === 'triarii' && u.order.kind === 'hold' && !u.engaged && u.speed < 0.15 && u.turnT <= 0;
    const brace = !kneel && T.spear && u.order.kind === 'hold' && u.speed < 0.15 && u.sc && u.sc.nearEnemy < 70;
    const flags = (T.pila && u.pila === 0) || (T.pila && u.engaged) ? 16 : 0;
    const k = Math.min(1, dt * 4);
    const t = this.time;
    const ids = fg.ids, X = this.fx, Z = this.fz, Y = this.fy, H = this.fh, VX = this.fvx, VZ = this.fvz, PH = this.fph, SD = this.fsd;
    for (let s = 0; s < n; s++) {
      const id = ids[s], file = s % F, rank = (s / F) | 0;
      let fo = file + 0.5; if (rank === R - 1) fo += (F - last) / 2;
      let lx = fo * sx - u.hw + this.fjx[id] * sx, lz = u.hd - (rank + 0.5) * sz + this.fjz[id] * sz;
      let fight = false, face = u.th;
      const sd = SD[id];
      if (routing) {
        lx = lx * 1.6 + this.fjx[id] * 40 + Math.sin(t * 0.4 + sd * 50) * 2.5;
        lz = lz * 1.8 + this.fjz[id] * 50;
      } else if (u.engaged) {
        if (eF && rank <= (cav ? 0 : 1)) { fight = true; lz += 0.25 + 0.25 * Math.sin(PH[id] * 0.5); }
        else if (eB && rank >= R - 2) { fight = true; face = u.th + Math.PI; }
        else if (eL && file === 0) { fight = true; face = u.th + Math.PI / 2; }
        else if (eR && file === F - 1) { fight = true; face = u.th - Math.PI / 2; }
        else if (u.nSides >= 2) { lx += Math.sin(t * 1.3 + sd * 40) * 0.25; lz += Math.cos(t * 1.1 + sd * 30) * 0.2; }
      }
      const tx = u.x + u.rx * lx + u.fx * lz, tz = u.z + u.rz * lx + u.fz * lz;
      let vx = u.vx + (tx - X[id]) * 1.5, vz = u.vz + (tz - Z[id]) * 1.5;
      const vl = Math.hypot(vx, vz);
      if (vl > maxV) { vx *= maxV / vl; vz *= maxV / vl; }
      VX[id] += (vx - VX[id]) * k; VZ[id] += (vz - VZ[id]) * k;
      const x = (X[id] += VX[id] * dt), z = (Z[id] += VZ[id] * dt);
      const y = (Y[id] = this.ter.height(x, z));
      const sp = Math.hypot(VX[id], VZ[id]);
      const wantH = !fight && sp > (cav ? 1.2 : 0.6) ? Math.atan2(VX[id], VZ[id]) : face;
      H[id] += angDiff(H[id], wantH) * Math.min(1, dt * 5);
      let st;
      if (fight) st = A.FIGHT;
      else if (routing) st = sp > 0.6 ? A.ROUT : A.IDLE;
      else if (throwing && rank < (cav ? 2 : 3)) st = A.THROW;
      else if (sp > (cav ? 5.5 : ele ? 3 : 2.2)) st = A.RUN;
      else if (sp > 0.25) st = A.WALK;
      else if (kneel) st = A.KNEEL;
      else if (brace && rank < 2) st = A.BRACE;
      else st = A.IDLE;
      if (st === A.WALK || st === A.RUN || st === A.ROUT) PH[id] += dt * sp * TAU / (st === A.WALK && cav ? 1.8 : stride);
      else if (st === A.FIGHT) PH[id] += dt * (2.4 + 1.6 * sd);
      else if (st === A.THROW) PH[id] += dt * (T.missile && T.missile.kind === 'sling' ? 2.6 : 2.1);
      else PH[id] += dt * 0.6;
      if (PH[id] > 1e4) PH[id] -= 1e4;
      if (L) {
        const dx = x - cx, dy = y - cy, dz = z - cz;
        const lay = dx * dx + dy * dy + dz * dz < nd2 && L.near.n < L.near.cap ? L.near
          : sb && Math.abs(x - sb.x) < sb.e && Math.abs(z - sb.z) < sb.e ? L.farS : L.far;
        lay.push(x, y, z, H[id], st + flags, PH[id], 0, sd);
      }
    }
  }

  // position d'une figurine du premier rang (pour la vue « dans le rang »)
  frontFigure(u) {
    const fg = u.fg; if (!fg || !fg.n) return null;
    const F = fg.filesF || 1;
    const id = fg.ids[Math.min(fg.n - 1, Math.min(F - 1, Math.floor(F / 2)) + F * Math.min(2, Math.floor(fg.n / F) - 1 > 0 ? 2 : 0))];
    return { x: this.fx[id], y: this.fy[id], z: this.fz[id], h: this.fh[id] };
  }
  countDead() {
    let n = 0; for (const k in this.layers) n += this.layers[k].dead.n; return n;
  }
}
