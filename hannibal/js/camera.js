/* Caméra de commandement : survol du champ de bataille, de la vue d'ensemble (5 km)
   jusqu'à hauteur d'homme. Souris, clavier (ZQSD ou WASD, A/E pour pivoter) et tactile
   (glisser, pincer, tourner et incliner à deux doigts). */
import * as THREE from 'three';
import { clamp } from './noise.js';

export class RTSCamera {
  constructor(camera, dom, terrain) {
    this.cam = camera; this.dom = dom; this.ter = terrain;
    this.target = new THREE.Vector3(0, 0, -200);
    this.yaw = Math.PI; this.pitch = 0.6; this.dist = 900;
    this.cur = { x: 0, z: -200, yaw: Math.PI, pitch: 0.6, dist: 900 };
    this.keys = new Set();
    this.pointers = new Map();
    this.mode = null; this.follow = null; this.rank = null; this.orbit = 0;
    this.onTap = null; this.onDragOrder = null; this.onBox = null;
    this.ray = new THREE.Raycaster();
    this.lock = false;
    // limites (bataille par défaut ; la carte de campagne les resserre)
    this.lim = { x0: -6000, x1: 6000, z0: -6000, z1: 6000, dmin: 5, dmax: 5000, pmin: null, pmax: 1.45 };
    const el = dom;
    el.addEventListener('pointerdown', (e) => this.down(e));
    window.addEventListener('pointermove', (e) => this.move(e));
    window.addEventListener('pointerup', (e) => this.up(e));
    window.addEventListener('pointercancel', (e) => this.up(e, true));
    el.addEventListener('wheel', (e) => this.wheel(e), { passive: false });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('keydown', (e) => { if (!isTyping(e)) this.keys.add(e.code); });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
  }

  set(x, z, yaw, pitch, dist, instant) {
    this.target.x = x; this.target.z = z;
    if (yaw !== undefined) this.yaw = yaw;
    if (pitch !== undefined) this.pitch = pitch;
    if (dist !== undefined) this.dist = dist;
    if (instant) Object.assign(this.cur, { x, z, yaw: this.yaw, pitch: this.pitch, dist: this.dist });
  }

  // point du sol sous un pixel de l'écran (marche le long du rayon sur le relief)
  ground(cx, cy) {
    const r = this.dom.getBoundingClientRect();
    const ndc = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(ndc, this.cam);
    const o = this.ray.ray.origin, d = this.ray.ray.direction;
    let t = 0, prev = 0;
    const maxT = 12000;
    while (t < maxT) {
      const x = o.x + d.x * t, y = o.y + d.y * t, z = o.z + d.z * t;
      const h = this.ter.height(x, z);
      if (y <= h) {
        let a = prev, b = t;
        for (let i = 0; i < 18; i++) {
          const m = (a + b) / 2, xm = o.x + d.x * m, ym = o.y + d.y * m, zm = o.z + d.z * m;
          if (ym <= this.ter.height(xm, zm)) b = m; else a = m;
        }
        return new THREE.Vector3(o.x + d.x * b, o.y + d.y * b, o.z + d.z * b);
      }
      prev = t;
      t += Math.max(0.5, (y - h) * 0.5);
    }
    return null;
  }
  // point du plan horizontal à la hauteur de la cible (pour un défilement régulier)
  plane(cx, cy, h) {
    const r = this.dom.getBoundingClientRect();
    const ndc = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(ndc, this.cam);
    const o = this.ray.ray.origin, d = this.ray.ray.direction;
    if (Math.abs(d.y) < 1e-4) return null;
    const t = (h - o.y) / d.y;
    if (t < 0) return null;
    return new THREE.Vector3(o.x + d.x * t, h, o.z + d.z * t);
  }

  down(e) {
    if (this.lock) return;
    this.dom.setPointerCapture?.(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, b: e.button, t: performance.now() });
    this.orbit = 0;
    if (this.pointers.size === 2) { this.mode = 'pinch'; this.pinch0 = this.pinchState(); }
    else if (this.pointers.size === 1) {
      this.mode = 'pending';
      this.btn = e.pointerType === 'mouse' ? e.button : 0;
      this.mods = { shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
      this.ptype = e.pointerType;
    }
  }
  pinchState() {
    const [a, b] = [...this.pointers.values()];
    return { d: Math.hypot(a.x - b.x, a.y - b.y), ang: Math.atan2(b.y - a.y, b.x - a.x), my: (a.y + b.y) / 2, mx: (a.x + b.x) / 2, dist: this.dist, yaw: this.yaw, pitch: this.pitch };
  }
  move(e) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    const px = p.x, py = p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (this.mode === 'pinch' && this.pointers.size >= 2) {
      const s = this.pinchState(), s0 = this.pinch0;
      this.dist = clamp(s0.dist * (s0.d / Math.max(10, s.d)), this.lim.dmin, this.lim.dmax);
      this.yaw = s0.yaw - (s.ang - s0.ang);
      this.pitch = clamp(s0.pitch + (s.my - s0.my) * 0.004, this.minPitch(), this.lim.pmax);
      return;
    }
    const moved = Math.hypot(p.x - p.sx, p.y - p.sy);
    if (this.mode === 'pending' && moved > 7) {
      if (this.rank) this.mode = 'look';
      else if (this.btn === 2) this.mode = 'order';
      else if (this.btn === 1 || this.mods.alt || this.mods.ctrl) this.mode = 'rotate';
      else if (this.mods.shift) this.mode = 'box';
      else { this.mode = 'pan'; this.panH = this.target.y; this.panStart = this.plane(p.sx, p.sy, this.panH); this.panT0 = this.target.clone(); }
      if (this.mode === 'order') this.orderStart = this.ground(p.sx, p.sy);
    }
    if (this.mode === 'pan') {
      this.follow = null;
      const a = this.plane(p.x, p.y, this.panH);
      if (a && this.panStart) {
        // la caméra se déplace : recalculer à partir de la position de départ
        const dx = this.panStart.x - a.x, dz = this.panStart.z - a.z;
        this.target.x += dx; this.target.z += dz;
        this.cur.x += dx; this.cur.z += dz;
        this.syncCam();
      }
    } else if (this.mode === 'rotate' || this.mode === 'look') {
      this.yaw -= (p.x - px) * 0.005;
      this.pitch = clamp(this.pitch + (p.y - py) * 0.004, this.rank ? -0.6 : this.minPitch(), this.rank ? 0.8 : this.lim.pmax);
      if (this.rank) { this.cur.yaw = this.yaw; this.cur.pitch = this.pitch; }
    } else if (this.mode === 'order' && this.onDragOrder) {
      const g = this.ground(p.x, p.y);
      if (g && this.orderStart) this.onDragOrder('preview', this.orderStart, g);
    } else if (this.mode === 'box' && this.onBox) {
      this.onBox('preview', p.sx, p.sy, p.x, p.y);
    }
  }
  up(e, cancel) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    if (this.mode === 'pinch') { if (this.pointers.size === 0) this.mode = null; return; }
    if (cancel) { this.mode = null; return; }
    if (this.mode === 'pending' && this.onTap) {
      this.onTap(p.x, p.y, { button: this.btn, shift: this.mods.shift, ctrl: this.mods.ctrl, long: performance.now() - p.t > 550, touch: this.ptype !== 'mouse' });
    } else if (this.mode === 'order' && this.onDragOrder) {
      const g = this.ground(p.x, p.y);
      if (g && this.orderStart) this.onDragOrder('commit', this.orderStart, g);
    } else if (this.mode === 'box' && this.onBox) {
      this.onBox('commit', p.sx, p.sy, p.x, p.y);
    }
    this.mode = null;
  }
  wheel(e) {
    e.preventDefault();
    if (this.lock) return;
    this.orbit = 0;
    if (this.rank) { this.exitRank(); return; }
    const k = Math.exp(clamp(e.deltaY, -200, 200) * 0.0016);
    const nd = clamp(this.dist * k, this.lim.dmin, this.lim.dmax);
    // zoom vers le point visé
    const g = this.ground(e.clientX, e.clientY);
    if (g && k < 1) {
      const f = 1 - nd / this.dist;
      this.target.x += (g.x - this.target.x) * f; this.target.z += (g.z - this.target.z) * f;
    }
    this.dist = nd;
    this.follow = null;
  }
  minPitch() { if (this.lim.pmin !== null) return this.lim.pmin; return this.dist < 60 ? 0.03 : this.dist < 300 ? 0.12 : 0.22; }

  enterRank(getPose) { this.rank = getPose; this.yaw = 0; this.pitch = 0; this.cur.yaw = 0; this.cur.pitch = 0; }
  exitRank() {
    const p = this.rank && this.rank();
    this.rank = null;
    if (p) { this.target.set(p.x, p.y, p.z); this.dist = 45; this.pitch = 0.35; this.yaw = p.h + Math.PI; }
  }

  syncCam() {
    const c = this.cur;
    const ty = this.ter.height(c.x, c.z);
    this.target.y = ty;
    const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
    let x = c.x + Math.sin(c.yaw) * cp * c.dist, y = ty + sp * c.dist + 1.6, z = c.z + Math.cos(c.yaw) * cp * c.dist;
    const gh = this.ter.height(x, z) + 2.2;
    if (y < gh) y = gh;
    this.cam.position.set(x, y, z);
    this.cam.lookAt(c.x, ty + Math.min(1.7, c.dist * 0.05) + (c.dist < 40 ? 1.2 : 0), c.z);
    this.cam.updateMatrixWorld();
  }

  update(dt) {
    // appui long au doigt avec des unités choisies : tracer une ligne de bataille
    if (this.mode === 'pending' && this.ptype !== 'mouse' && this.pointers.size === 1 && this.canHoldOrder) {
      const p = [...this.pointers.values()][0];
      if (performance.now() - p.t > 380 && Math.hypot(p.x - p.sx, p.y - p.sy) < 8 && this.canHoldOrder(p.sx, p.sy)) {
        this.mode = 'order';
        this.orderStart = this.ground(p.sx, p.sy);
        if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { /* refusé */ }
        if (this.onHoldStart) this.onHoldStart(p.sx, p.sy);
      }
    }
    if (this.rank) {
      const p = this.rank();
      if (!p) { this.rank = null; return; }
      const h = p.h + this.yaw;
      this.cam.position.set(p.x, p.y + 1.62, p.z);
      const lp = Math.cos(this.pitch);
      this.cam.lookAt(p.x + Math.sin(h) * lp * 10, p.y + 1.62 + Math.sin(this.pitch) * 10, p.z + Math.cos(h) * lp * 10);
      return;
    }
    // clavier (touches physiques : ZQSD en AZERTY = WASD en QWERTY)
    const K = this.keys;
    if (K.size && !this.lock) {
      const sp = this.dist * 0.9 * dt;
      let fx = 0, fz = 0;
      if (K.has('KeyW') || K.has('ArrowUp')) fz -= 1;
      if (K.has('KeyS') || K.has('ArrowDown')) fz += 1;
      if (K.has('KeyA') || K.has('ArrowLeft')) fx -= 1;
      if (K.has('KeyD') || K.has('ArrowRight')) fx += 1;
      if (fx || fz) {
        this.follow = null; this.orbit = 0;
        const s = Math.sin(this.yaw), c = Math.cos(this.yaw);
        this.target.x += (fz * s + fx * c) * sp; this.target.z += (fz * c - fx * s) * sp;
      }
      if (K.has('KeyQ')) this.yaw += dt * 1.2;
      if (K.has('KeyE')) this.yaw -= dt * 1.2;
      if (K.has('KeyR')) this.pitch = clamp(this.pitch + dt * 0.8, this.minPitch(), this.lim.pmax);
      if (K.has('KeyF')) this.pitch = clamp(this.pitch - dt * 0.8, this.minPitch(), this.lim.pmax);
      if (K.has('Equal') || K.has('NumpadAdd')) this.dist = clamp(this.dist * (1 - dt * 1.5), this.lim.dmin, this.lim.dmax);
      if (K.has('Minus') || K.has('NumpadSubtract')) this.dist = clamp(this.dist * (1 + dt * 1.5), this.lim.dmin, this.lim.dmax);
    }
    if (this.orbit) this.yaw += this.orbit * dt;
    if (this.follow) {
      const u = this.follow;
      if (!u.alive) this.follow = null;
      else { this.target.x += (u.x - this.target.x) * Math.min(1, dt * 3); this.target.z += (u.z - this.target.z) * Math.min(1, dt * 3); }
    }
    this.target.x = clamp(this.target.x, this.lim.x0, this.lim.x1); this.target.z = clamp(this.target.z, this.lim.z0, this.lim.z1);
    // carte : la caméra se couche quand on s'approche (l'écart choisi au doigt est conservé)
    if (this.lim.auto) {
      const a = this.lim.auto, t = clamp((this.dist - a[0]) / (a[1] - a[0]), 0, 1), base = a[2] + (a[3] - a[2]) * t * t * (3 - 2 * t);
      if (this.autoBase === undefined) this.autoBase = base;
      this.pitch += base - this.autoBase;
      this.autoBase = base;
    }
    this.pitch = clamp(this.pitch, this.minPitch(), this.lim.pmax);
    const c = this.cur, k = 1 - Math.exp(-dt * 9);
    c.x += (this.target.x - c.x) * k; c.z += (this.target.z - c.z) * k;
    c.dist += (this.dist - c.dist) * k; c.pitch += (this.pitch - c.pitch) * k;
    let dy = this.yaw - c.yaw; c.yaw += dy * k;
    this.syncCam();
  }
}

function isTyping(e) {
  const t = e.target;
  return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
}
