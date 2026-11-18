/* Moteur de bataille antique (sans Three.js : tourne aussi dans Node pour les tests).

   Principes, d'après ce qu'on sait du combat antique :
   - seuls les premiers rangs combattent ; la profondeur donne la poussée et le moral ;
   - les pertes restent faibles tant qu'une ligne tient ; une bataille se décide au moral ;
   - être pris de flanc ou de dos est dévastateur ; une unité encerclée ne peut plus fuir
     et ses hommes, écrasés les uns contre les autres, ne peuvent plus manier leurs armes ;
   - les fuyards sont massacrés, surtout par la cavalerie ;
   - chaque javelot, pilum et balle de fronde est simulé avec sa trajectoire. */
import { TYPES } from './data.js';
import { mulberry32, clamp, angDiff } from './noise.js';

export const SIM_DT = 0.1;
export const ST = { READY: 0, MOVING: 1, ENGAGED: 2, ROUTING: 3, FLED: 4, DEAD: 5 };
export const FRONT = 0, RIGHT = 1, REAR = 2, LEFT = 3;
const BASE_KILL = 0.0032;
const G = 9.81;
const EDGE = 2950;

let UID = 0;

export class Unit {
  constructor(b, def) {
    const T = TYPES[def.type];
    if (!T) throw new Error('Type inconnu : ' + def.type);
    this.b = b; this.id = UID++; this.def = def; this.T = T; this.type = def.type;
    this.side = def.side; this.name = def.name; this.role = def.role || '';
    this.men = def.men; this.men0 = def.men;
    this.isGen = T.cat === 'gen';
    this.isCav = T.cat === 'cav' || T.cat === 'gen';
    this.isEle = T.cat === 'ele';
    this.light = !!T.light;
    this.heavyInf = T.cat === 'inf' && !T.light;
    this.spX = T.spX; this.spZ = T.spZ;
    this.files = Math.max(1, Math.min(def.files, def.men));
    this.th = def.th;
    this.axes();
    this.dims();
    this.x = def.x - this.fx * this.hd;
    this.z = def.zf - this.fz * this.hd;
    this.y = b.terrain.height(this.x, this.z);
    this.vx = 0; this.vz = 0; this.px = this.x; this.pz = this.z;
    this.morale = T.morale; this.fatigue = 0; this.coh = 1;
    this.state = ST.READY;
    this.order = { kind: 'hold' };
    this.contacts = [];
    this.eS = [0, 0, 0, 0];
    this.nSides = 0; this.engaged = false; this.wasEngaged = false; this.engagedT = 0;
    this.impactT = 0; this.impactBonus = 0;
    this.ammo = T.missile ? T.missile.ammo : 0;
    this.pila = T.pila || 0; this.pilaCD = 0;
    this.shotAcc = 0; this.fireTarget = null; this.fireT = 0; this.firing = 0; this.fireHold = false;
    this.hamperT = 0; this.turnT = 0;
    this.routCount = 0; this.safeT = 0; this.stuckT = 0;
    this.cas = 0; this.casRecent = 0; this.lossRate = 0; this.kills = 0;
    this.hits = []; // indices de points d'impact pour la couche des figurines
    this.reform = 0; // incrémenté à chaque changement de formation
    this.gen = def.general || null; this.genState = 0; // 0 sain, 1 blessé, 2 mort
    this.lanes = !!def.lanes;
    this.flags = {};
    this.ai = {};
    this.skirmish = !!(T.light || T.skirmisher);
    this.speed = 0; this.running = false;
    this.lastHitBy = null;
    this.form = 'normal'; this.manual = false; this.cd = {}; this.boostT = 0;
  }

  axes() {
    if (this.th > Math.PI || this.th < -Math.PI) this.th = Math.atan2(Math.sin(this.th), Math.cos(this.th));
    this.fx = Math.sin(this.th); this.fz = Math.cos(this.th);
    this.rx = -this.fz; this.rz = this.fx;
  }
  dims() {
    if (this.files > this.men) this.files = Math.max(1, Math.ceil(this.men));
    let ranks = this.men / this.files;
    if (!this.isGen && !this.isEle && ranks < 3 && this.files > 6) {
      this.files = Math.max(6, Math.round(this.men / 3));
      ranks = this.men / this.files;
      this.reform++;
    }
    this.ranks = Math.max(1, ranks);
    this.w = this.files * this.spX;
    this.d = this.ranks * this.spZ;
    this.hw = this.w / 2; this.hd = this.d / 2;
    this.rad = Math.hypot(this.hw, this.hd);
  }
  // Profondeur qui diminue par l'arrière : le front reste en place
  shrink() {
    const hd0 = this.hd;
    this.dims();
    const dh = hd0 - this.hd;
    if (this.state !== ST.ROUTING) { this.x += this.fx * dh; this.z += this.fz * dh; }
  }
  ruled() { return this.manual && this.b.aiSide === this.side; }
  setFiles(f) {
    if (this.ruled()) return;
    f = Math.round(clamp(f, 4, this.men));
    if (f === this.files) return;
    const fz0 = this.x + this.fx * this.hd, fzz = this.z + this.fz * this.hd;
    this.files = f; this.dims();
    this.x = fz0 - this.fx * this.hd; this.z = fzz - this.fz * this.hd;
    this.coh = Math.min(this.coh, 0.75);
    this.reform++;
  }
  get alive() { return this.state !== ST.FLED && this.state !== ST.DEAD; }
  get routing() { return this.state === ST.ROUTING; }
  get active() { return this.state <= ST.ENGAGED; }
  local(x, z) { const dx = x - this.x, dz = z - this.z; return [dx * this.rx + dz * this.rz, dx * this.fx + dz * this.fz]; }
  world(lx, lz) { return [this.x + this.rx * lx + this.fx * lz, this.z + this.rz * lx + this.fz * lz]; }
  frontX() { return this.x + this.fx * this.hd; }
  frontZ() { return this.z + this.fz * this.hd; }
  // Point du rectangle le plus proche de (x,z)
  nearest(x, z) {
    const [lx, lz] = this.local(x, z);
    return this.world(clamp(lx, -this.hw, this.hw), clamp(lz, -this.hd, this.hd));
  }
  distTo(o) {
    const [nx, nz] = o.nearest(this.x, this.z);
    const [mx, mz] = this.nearest(nx, nz);
    return Math.hypot(nx - mx, nz - mz);
  }
  isInside(x, z, m = 0) {
    const [lx, lz] = this.local(x, z);
    return Math.abs(lx) <= this.hw + m && Math.abs(lz) <= this.hd + m;
  }
  command(o) {
    if (!this.alive || this.routing || this.ruled()) return;
    if ((this.form === 'orbis' || this.form === 'wall') && o.kind !== 'hold' && o.kind !== 'turn') this.setForm('normal');
    this.order = o;
    if (o.kind === 'turn') this.startTurn(o.dth);
  }
  // Formations : orbis (cercle), cuneus (coin de cavalerie), wall (mur de lances), loose / tight
  setForm(f) {
    if (this.ruled() || !this.alive || this.routing || f === this.form) return false;
    const T = this.T;
    if (f === 'orbis' && !(T.cat === 'inf' && !T.light)) return false;
    if (f === 'cuneus' && !this.isCav) return false;
    if (f === 'wall' && !T.spear) return false;
    if ((f === 'loose' || f === 'tight') && T.cat !== 'inf') return false;
    const prev = this.form;
    if (prev === 'orbis' && this.formFiles) { this.files = this.formFiles; }
    this.spX = T.spX; this.spZ = T.spZ;
    this.form = f;
    if (f === 'orbis') {
      this.formFiles = this.files;
      this.files = Math.max(4, Math.round(Math.sqrt(this.men * this.spZ / this.spX)));
      this.order = { kind: 'hold' };
    } else if (f === 'wall') this.order = { kind: 'hold' };
    else if (f === 'loose') { this.spX = T.spX * 1.6; this.spZ = T.spZ * 1.3; }
    else if (f === 'tight') { this.spX = T.spX * 0.85; }
    const fx0 = this.x + this.fx * this.hd, fz0 = this.z + this.fz * this.hd;
    this.dims();
    if (f !== 'orbis' && prev !== 'orbis') { this.x = fx0 - this.fx * this.hd; this.z = fz0 - this.fz * this.hd; }
    this.coh = Math.min(this.coh, 0.7);
    this.reform++;
    return true;
  }
  startTurn(dth) {
    this.th += dth; this.axes();
    if (Math.abs(Math.abs(dth) - Math.PI / 2) < 0.1 && !this.isCav) {
      const nf = Math.max(4, Math.round(this.ranks));
      this.files = Math.min(nf, Math.ceil(this.men)); this.dims();
    }
    this.turnT = this.isCav ? 3 : 7;
    this.coh = Math.min(this.coh, 0.6);
    this.reform++;
    this.order = { kind: 'hold', th: this.th };
  }
  statusText() {
    if (this.state === ST.FLED) return 'A quitté le champ de bataille';
    if (this.state === ST.DEAD) return 'Anéantie';
    if (this.state === ST.ROUTING) return this.nSides >= 2 ? 'Encerclée, en déroute' : 'En déroute';
    if (this.nSides >= 3) return 'Encerclée !';
    if (this.eS[REAR] > 0) return 'Prise à revers !';
    if (this.eS[LEFT] > 0 || this.eS[RIGHT] > 0) return this.eS[FRONT] > 0 ? 'Engagée de front et de flanc' : 'Prise de flanc !';
    if (this.eS[FRONT] > 0) return 'Engagée de front';
    if (this.turnT > 0) return 'Change de front';
    if (this.firing > 0) return this.T.missile && this.T.missile.kind === 'sling' ? 'Tire à la fronde' : 'Lance ses javelots';
    if (this.speed > 0.4) return this.running ? (this.isCav ? 'Charge' : 'Au pas de course') : 'En marche';
    return 'En position';
  }
  moraleText() {
    const m = this.morale;
    if (this.routing) return 'En déroute';
    return m > 70 ? 'Ardent' : m > 50 ? 'Ferme' : m > 32 ? 'Inquiet' : m > 18 ? 'Ébranlé' : 'Au bord de la fuite';
  }
  fatigueText() {
    const f = this.fatigue;
    return f < 20 ? 'Frais' : f < 45 ? 'En sueur' : f < 70 ? 'Fatigué' : 'Épuisé';
  }
}

export class Battle {
  constructor(scn, terrain, opts = {}) {
    UID = 0;
    this.scn = scn; this.terrain = terrain;
    this.scale = opts.scale || 1;
    this.rng = mulberry32(opts.seed || 216);
    this.t = 0;
    this.units = scn.units().map((d) => new Unit(this, d));
    this.byId = new Map(this.units.map((u) => [u.id, u]));
    this.events = [];
    this.stuck = []; // projectiles fichés au sol, pour le rendu
    this.wind = scn.wind;
    this.over = false; this.winner = -1;
    this.sides = [0, 1].map((s) => {
      const us = this.units.filter((u) => u.side === s);
      return { men0: us.reduce((a, u) => a + u.men, 0), killed: 0, fled: 0 };
    });
    // projectiles (structure de tableaux)
    const P = (this.PCAP = 9000);
    this.pX = new Float32Array(P); this.pY = new Float32Array(P); this.pZ = new Float32Array(P);
    this.pVX = new Float32Array(P); this.pVY = new Float32Array(P); this.pVZ = new Float32Array(P);
    this.pKind = new Uint8Array(P); this.pSide = new Uint8Array(P); this.pAge = new Float32Array(P);
    this.pW = new Float32Array(P); this.pOn = new Uint8Array(P); this.pType = new Array(P);
    this.pFree = []; for (let i = P - 1; i >= 0; i--) this.pFree.push(i);
    this.pCount = 0;
    this.listeners = [];
    this.flagT = {};
  }

  // ------------------------------------------------------------ événements
  emit(kind, text, u, extra) {
    const e = { t: this.t, kind, text, side: u ? u.side : -1, x: u ? u.x : 0, z: u ? u.z : 0, unit: u || null, ...extra };
    this.events.push(e);
    if (this.events.length > 300) this.events.shift();
    for (const f of this.listeners) f(e);
  }
  throttled(key, sec) {
    const t = this.flagT[key];
    if (t !== undefined && this.t - t < sec) return false;
    this.flagT[key] = this.t; return true;
  }

  // ---------------------------------------------------------------- pas
  step(dt = SIM_DT) {
    this.t += dt;
    this.stepN = (this.stepN || 0) + 1;
    const us = this.units;
    for (const u of us) { u.px = u.x; u.pz = u.z; u.cas = 0; }
    if (!this.sideCache || this.stepN % 10 === 0) this.sideCache = [this.sideState(0), this.sideState(1)];
    for (const u of us) if (u.alive) this.move(u, dt);
    this.collide(dt);
    this.fight(dt);
    this.missiles(dt);
    this.moveProjectiles(dt);
    for (const u of us) if (u.alive) this.morale(u, dt);
    for (const u of us) if (u.alive) this.losses(u, dt);
    if (this.stepN % 10 === 0 && !this.over) this.checkEnd();
  }

  // ---------------------------------------------------------- mouvement
  move(u, dt) {
    const T = u.T, o = u.order;
    if (u.turnT > 0) u.turnT -= dt;
    if (u.pilaCD > 0) u.pilaCD -= dt;
    if (u.hamperT > 0) u.hamperT -= dt;
    if (u.impactT > 0) u.impactT -= dt;
    let dvx = 0, dvz = 0, wantTh = u.th, run = false, spd = 0;
    const fat = 1 - 0.35 * u.fatigue / 100;

    if (u.routing) {
      // fuite : loin des ennemis, vers l'arrière de son armée
      let ax = 0, az = 0, quad = 0;
      for (const e of this.units) {
        if (e.side === u.side || !e.active) continue;
        const dx = u.x - e.x, dz = u.z - e.z, d2 = dx * dx + dz * dz;
        if (d2 > 400 * 400) continue;
        const k = 1 / Math.max(400, d2);
        ax += dx * k; az += dz * k;
        const dd = Math.sqrt(d2) - e.rad - u.rad;
        if (dd < 50) quad |= 1 << ((((Math.atan2(-dx, -dz) + Math.PI) / (Math.PI / 2)) | 0) & 3);
      }
      const nq = (quad & 1) + ((quad >> 1) & 1) + ((quad >> 2) & 1) + ((quad >> 3) & 1);
      u.trapped = nq >= 3;
      if (u.trapped && !u.flags.trap && this.throttled('trap' + u.side, 20)) { u.flags.trap = 1; this.emit('surround', `${u.name} est prise au piège : plus aucune issue !`, u); }
      const home = u.side === 0 ? -1 : 1;
      const al = Math.hypot(ax, az);
      if (al > 0) { ax /= al; az /= al; }
      ax = ax * 1.0; az = az * 1.0 + home * 0.35;
      const l = Math.hypot(ax, az) || 1;
      spd = T.run * 0.85 * fat * (u.jamT > 0 ? 0.35 : 1) * (u.trapped ? 0.2 : 1);
      if (u.jamT > 0) u.jamT -= dt;
      dvx = ax / l * spd; dvz = az / l * spd; run = true;
      wantTh = Math.atan2(dvx, dvz);
      u.th += clamp(angDiff(u.th, wantTh), -1.5 * dt, 1.5 * dt); u.axes();
    } else if (u.turnT <= 0) {
      const walk = (u.isCav ? (T.trot || T.walk) : T.walk) * fat;
      const fwdOK = !(u.eS[FRONT] > 0);
      switch (o.kind) {
        case 'move': {
          const dx = o.x - u.x, dz = o.z - u.z, dist = Math.hypot(dx, dz);
          if (dist > 1.2) {
            const dirTh = Math.atan2(dx, dz);
            const rel = angDiff(u.th, dirTh);
            const agile = u.isCav || u.light || u.isGen || u.isEle;
            run = !!o.run;
            spd = run ? T.run * fat : walk;
            spd = Math.min(spd, dist * 0.6 + 0.4);
            if (agile || Math.abs(rel) < 0.9 || (dist < 60 && o.th !== undefined)) {
              if (agile && dist > 8) wantTh = dirTh;
              else if (o.th !== undefined && dist < 40) wantTh = o.th;
              const k = agile ? 1 : 1 - 0.55 * Math.min(1, Math.abs(rel) / 0.9) * (Math.abs(rel) > 0.9 ? 1 : 0.6);
              if (!agile && Math.abs(rel) > 0.9) spd *= 0.4; else spd *= k;
              dvx = dx / dist * spd; dvz = dz / dist * spd;
            } else {
              wantTh = dirTh; // pivoter avant de marcher
              if (Math.abs(rel) < 1.2) { dvx = dx / dist * spd * 0.3; dvz = dz / dist * spd * 0.3; }
            }
          } else {
            if (o.th !== undefined) wantTh = o.th;
            if (o.then) { const n = o.then; u.order = n; } else if (o.th === undefined || Math.abs(angDiff(u.th, o.th)) < 0.02) u.order = { kind: 'hold', th: o.th };
          }
          break;
        }
        case 'advance': {
          run = !!o.run;
          spd = (run ? T.run * fat : walk) * (o.speed || 1);
          dvx = u.fx * spd; dvz = u.fz * spd;
          if (o.th !== undefined) wantTh = o.th;
          break;
        }
        case 'attack': {
          const t = o.target;
          if (!t || !t.alive) { u.order = { kind: 'hold' }; break; }
          let ax = t.x, az = t.z;
          if (o.via) { ax = o.via[0]; az = o.via[1]; if (Math.hypot(ax - u.x, az - u.z) < 25) o.via = null; }
          else { const p = t.nearest(u.x, u.z); ax = p[0]; az = p[1]; }
          const dx = ax - u.x, dz = az - u.z, dist = Math.hypot(dx, dz) || 1;
          const gap = Math.max(0, dist - u.hd);
          const dirTh = Math.atan2(dx, dz);
          wantTh = dirTh;
          const chargeDist = u.isCav || u.isEle ? 140 : 45;
          run = o.run || (gap < chargeDist && !o.via && (!t.routing || u.isCav));
          if (u.heavyInf && u.pila > 0 && gap < 60 && gap > 20 && !t.routing) run = false; // s'approcher au pas pour le pilum
          spd = run ? T.run * fat : walk;
          const rel = Math.abs(angDiff(u.th, dirTh));
          const agile = u.isCav || u.light || u.isGen || u.isEle;
          if (!agile && rel > 0.9 && dist > 50) spd *= 0.25;
          dvx = dx / dist * spd; dvz = dz / dist * spd;
          break;
        }
        case 'withdraw': {
          spd = (o.speed || T.walk * 0.6) * fat;
          dvx = -u.fx * spd; dvz = -u.fz * spd;
          o.done = (o.done || 0) + spd * dt;
          if (o.dist && o.done >= o.dist) u.order = { kind: 'hold' };
          break;
        }
        case 'hold': default: {
          if (o.th !== undefined) wantTh = o.th;
          break;
        }
      }
      // engagé : on ne traverse pas l'ennemi ; on peut tenter de rompre le contact
      if (u.engaged) {
        const fwd = dvx * u.fx + dvz * u.fz;
        if (!fwdOK && fwd > 0) { dvx -= u.fx * fwd; dvz -= u.fz * fwd; }
        if (o.kind === 'attack' || o.kind === 'advance') { dvx *= 0.1; dvz *= 0.1; }
        else { dvx *= u.isCav ? 0.6 : 0.3; dvz *= u.isCav ? 0.6 : 0.3; }
        if (u.nSides >= 1 && o.kind !== 'turn') wantTh = u.th; // pas de pivot au contact
      }
      // rotation (les grandes lignes pivotent lentement)
      const agileRot = u.isGen ? 1.2 : u.isEle ? 0.4 : u.isCav ? 0.22 : u.light ? 0.25 : Math.max(0.035, (T.walk * 0.9) / Math.max(4, u.hw));
      const dth = angDiff(u.th, wantTh);
      if (Math.abs(dth) > 0.002) {
        u.th += clamp(dth, -agileRot * dt, agileRot * dt); u.axes();
        if (!u.isCav && !u.light) u.coh = Math.max(0.5, u.coh - 0.004 * dt);
      }
    }

    // terrain : eau et pentes
    if (this.terrain.hasRiver && this.terrain.inWater(u.x + dvx, u.z + dvz)) {
      dvx *= 0.4; dvz *= 0.4; u.coh = Math.max(0.3, u.coh - 0.03 * dt);
    }
    const vl = Math.hypot(dvx, dvz);
    if (vl > 0.05) {
      const sl = this.terrain.slopeAlong(u.x, u.z, dvx / vl, dvz / vl);
      const k = sl > 0 ? 1 - clamp(sl * 3, 0, 0.45) : 1;
      dvx *= k; dvz *= k;
    }
    // accélération limitée
    const acc = (u.isCav ? 2.5 : u.isEle ? 1.2 : 0.9) * dt;
    u.vx += clamp(dvx - u.vx, -acc, acc);
    u.vz += clamp(dvz - u.vz, -acc, acc);
    u.x += u.vx * dt; u.z += u.vz * dt;
    u.speed = Math.hypot(u.vx, u.vz);
    u.running = run && u.speed > T.walk * 1.3;

    // fatigue et cohésion
    const sp = u.speed;
    let df = -0.05;
    if (u.engaged) df = 0.06 * T.stamina;
    else if (u.running) df = (u.isCav ? 0.10 : 0.2) * T.stamina;
    else if (sp > 0.3) df = 0.012 * T.stamina;
    if (u.routing) df = 0.12;
    u.fatigue = clamp(u.fatigue + df * dt, 0, 100);
    if (u.running && !u.isCav && !u.light) u.coh = Math.max(0.45, u.coh - 0.02 * dt);
    else if (!u.engaged) u.coh = Math.min(1, u.coh + 0.025 * dt);

    if (u.routing && (Math.abs(u.x) > EDGE || Math.abs(u.z) > EDGE)) {
      u.state = ST.FLED;
      this.sides[u.side].fled += u.men;
      this.emit('fled', `${u.name} a quitté le champ de bataille.`, u);
    }
    u.x = clamp(u.x, -EDGE - 40, EDGE + 40); u.z = clamp(u.z, -EDGE - 40, EDGE + 40);
  }

  // ------------------------------------------------- collisions et contacts
  collide(dt) {
    const us = this.units;
    for (const u of us) {
      u.wasEngaged = u.engaged;
      u.contacts.length = 0; u.eS[0] = u.eS[1] = u.eS[2] = u.eS[3] = 0;
    }
    for (let i = 0; i < us.length; i++) {
      const a = us[i]; if (!a.alive) continue;
      for (let j = i + 1; j < us.length; j++) {
        const b = us[j]; if (!b.alive) continue;
        const dx = b.x - a.x, dz = b.z - a.z;
        const rr = a.rad + b.rad + 4;
        if (dx * dx + dz * dz > rr * rr) continue;
        if (a.side !== b.side) {
          const c = obb(a, b, 1.6);
          if (!c) continue;
          this.contact(a, b, c);
          const p = obb(a, b, 0);
          if (p) {
            const ma = a.men * a.T.mass * (a.engaged || a.order.kind === 'hold' ? 1.5 : 1) + 1;
            const mb = b.men * b.T.mass * (b.engaged || b.order.kind === 'hold' ? 1.5 : 1) + 1;
            const wa = mb / (ma + mb), wb = ma / (ma + mb);
            const s = Math.min(p.ov, 3);
            a.x -= p.nx * s * wa; a.z -= p.nz * s * wa;
            b.x += p.nx * s * wb; b.z += p.nz * s * wb;
          }
        } else {
          // amis : l'infanterie légère passe dans les intervalles, les fuyards bousculent tout
          if (a.light || b.light || a.isGen || b.isGen || a.flags.pass || b.flags.pass) continue;
          if (a.routing || b.routing) {
            const r = a.routing ? a : b, o = a.routing ? b : a;
            if (!o.routing && obb(a, b, 0)) {
              o.coh = Math.max(0.3, o.coh - 0.05 * dt);
              if (!r.isEle) { r.jamT = 0.3; o.morale -= 0.15 * dt; }
              if (r.isEle) {
                o.cas += 1.2 * r.men * dt; // éléphants affolés qui piétinent leur propre camp
                o.morale -= 2.5 * dt;
                if (this.throttled('trample', 30)) this.emit('trample', `Des éléphants affolés piétinent ${o.name} !`, o);
              }
            }
            continue;
          }
          const p = obb(a, b, 0.4);
          if (!p) continue;
          const s = Math.min(p.ov, 2) * 0.35;
          const ma = a.men * a.T.mass + (a.engaged ? 4000 : 0), mb = b.men * b.T.mass + (b.engaged ? 4000 : 0);
          const wa = mb / (ma + mb), wb = ma / (ma + mb);
          a.x -= p.nx * s * wa; a.z -= p.nz * s * wa;
          b.x += p.nx * s * wb; b.z += p.nz * s * wb;
        }
      }
    }
    for (const u of us) {
      u.engaged = u.eS[0] + u.eS[1] + u.eS[2] + u.eS[3] > 0;
      u.nSides = (u.eS[0] > 0) + (u.eS[1] > 0) + (u.eS[2] > 0) + (u.eS[3] > 0);
      if (u.engaged) { u.engagedT += dt; if (u.state === ST.READY || u.state === ST.MOVING) u.state = ST.ENGAGED; }
      else { u.engagedT = 0; if (u.state === ST.ENGAGED) u.state = ST.READY; }
    }
  }

  contact(a, b, c) {
    const sa = sideOf(a, c.nx, c.nz), sb = sideOf(b, -c.nx, -c.nz);
    const la = contactLen(a, b, sa), lb = contactLen(b, a, sb);
    const L = Math.min(la, lb);
    if (L < 0.5) return;
    const newA = !a.contacts.length && !a.wasEngaged, newB = !b.contacts.length && !b.wasEngaged;
    a.contacts.push({ o: b, side: sa, len: L }); if (!b.routing) a.eS[sa] += L;
    b.contacts.push({ o: a, side: sb, len: L }); if (!a.routing) b.eS[sb] += L;
    // choc de la charge
    if (newB || newA) {
      this.impact(a, b, sb, newB);
      this.impact(b, a, sa, newA);
      if (!a.isGen && !b.isGen && a.heavyInf && b.heavyInf && this.throttled('clash', 45)) {
        this.emit('contact', `Choc des lignes : ${a.side === 0 ? a.name : b.name} contre ${a.side === 0 ? b.name : a.name}.`, a.side === 0 ? a : b);
      }
    }
    if (sa !== FRONT && !a.flags['f' + b.id] && !b.routing && !b.light) this.flankEvent(a, b, sa);
    if (sb !== FRONT && !b.flags['f' + a.id] && !a.routing && !a.light) this.flankEvent(b, a, sb);
  }
  flankEvent(v, by, side) {
    v.flags['f' + by.id] = 1;
    if (v.routing || v.isGen || v.light) return;
    v.morale -= side === REAR ? 8 : 5;
    if (this.throttled('flank' + v.side + side, 12)) {
      this.emit(side === REAR ? 'rear' : 'flank', side === REAR ? `${by.name} frappe ${v.name} dans le dos !` : `${by.name} prend ${v.name} de flanc !`, v);
    }
  }
  impact(att, def, defSide, fresh) {
    if (!fresh || att.routing) return;
    const along = att.vx * att.fx + att.vz * att.fz;
    const T = att.T;
    const fast = att.isCav || att.isEle ? along > 4 : along > 2.2;
    if (!fast) return;
    const sideMul = defSide === FRONT ? 1 : defSide === REAR ? 1.7 : 1.35;
    const braced = (def.T.spear && defSide === FRONT && def.speed < 0.5 && !def.routing) || def.form === 'wall' || def.form === 'orbis';
    let bonus = T.charge / 10 * sideMul * (att.form === 'cuneus' ? 1.5 : 1);
    if (att.isCav && def.heavyInf && defSide === FRONT && !def.routing) bonus *= braced ? 0.15 : 0.45;
    if (att.isEle && def.lanes) bonus *= 0.35;
    att.impactT = 3; att.impactBonus = bonus;
    const ratio = Math.min(1.5, (att.men * T.mass) / Math.max(1, def.men * def.T.mass) * 2);
    def.morale -= T.charge * 0.6 * sideMul * (braced ? 0.3 : 1) * ratio;
    def.coh = Math.max(0.3, def.coh - 0.15 * sideMul);
    att.coh = Math.max(0.4, att.coh - 0.1);
    if ((att.isCav || att.isEle) && this.throttled('charge' + att.side, 20)) this.emit('charge', `${att.name} charge ${def.name}.`, att);
  }

  // ------------------------------------------------------------- combat
  fight(dt) {
    const wind = this.wind;
    for (const a of this.units) {
      if (!a.alive) continue;
      for (const c of a.contacts) {
        const b = c.o;
        if (b.id < a.id) continue; // chaque paire une fois
        const cb = b.contacts.find((k) => k.o === a);
        if (!cb) continue;
        a.chasing = b.routing && !a.routing; b.chasing = a.routing && !b.routing;
        const ra = this.killRate(a, b, c.side, cb.side, c.len, wind);
        const rb = this.killRate(b, a, cb.side, c.side, c.len, wind);
        a.chasing = b.chasing = false;
        b.cas += ra * dt; a.cas += rb * dt;
        a.kills += ra * dt; b.kills += rb * dt;
        b.lastHitBy = a; a.lastHitBy = b;
        if (ra > 0) this.hint(b, a);
        if (rb > 0) this.hint(a, b);
        // poussée des lignes (front contre front)
        if (c.side === FRONT && cb.side === FRONT && !a.routing && !b.routing) {
          const pa = this.pressure(a, c.len), pb = this.pressure(b, c.len);
          const net = (pa - pb) / (pa + pb + 1e-6);
          const v = 0.3 * net * dt;
          const lo = net > 0 ? b : a, hi = net > 0 ? a : b, av = Math.abs(v);
          lo.x -= lo.fx * av; lo.z -= lo.fz * av;
          if (hi.order.kind === 'attack' || hi.order.kind === 'advance' || hi.order.kind === 'move') { hi.x += hi.fx * av; hi.z += hi.fz * av; }
        }
      }
    }
  }
  pressure(u, L) {
    const n = Math.min(u.men, L / u.spX);
    let p = n * u.T.mass * (0.5 + u.morale / 200) * (1 + 0.035 * Math.min(u.ranks, 25)) * (1 - 0.4 * u.fatigue / 100) * (0.6 + 0.4 * u.coh);
    if (u.order.kind === 'hold') p *= 1.2;
    if (u.order.kind === 'withdraw') p *= 0.6;
    return p;
  }
  fighters(u, side, L) {
    let n;
    if (u.chasing) n = (L / u.spX) * 2.2;
    else if (u.form === 'orbis') n = L / u.spX;
    else if (side === FRONT) n = (L / u.spX) * (u.T.spear ? 1.5 : 1.2);
    else if (side === REAR) n = (L / u.spX) * 0.5;
    else n = (L / u.spZ) * 0.8;
    n *= 1 / (1 + 0.45 * Math.max(0, u.nSides - 1)); // entassement
    return Math.min(n, u.men);
  }
  killRate(a, b, sa, sb, L, wind) {
    if (a.men < 1) return 0;
    const fa = this.fighters(a, sa, L);
    const fatA = 1 - 0.45 * Math.pow(a.fatigue / 100, 1.5), fatB = 1 - 0.45 * Math.pow(b.fatigue / 100, 1.5);
    let atk = a.T.ma * fatA * (0.6 + 0.4 * a.coh) * (a.morale < 25 ? 0.8 : 1) * (a.boostT > 0 ? 1.1 : 1) * (a.form === 'orbis' ? 0.85 : 1);
    let def = b.T.md * fatB * (0.6 + 0.4 * b.coh) * (sb === FRONT || b.form === 'orbis' ? 1 : sb === REAR ? 0.45 : 0.65) * (b.hamperT > 0 ? 0.8 : 1);
    if (b.form === 'loose') def *= 0.85; else if (b.form === 'tight') def *= 1.08;
    if (b.form === 'cuneus') def *= 0.88;
    if (a.routing) atk *= 0.25;
    let r = BASE_KILL * fa * 2 * atk / (atk + def);
    if (a.impactT > 0) r *= 1 + a.impactBonus * (a.impactT / 3);
    if (a.isCav && b.heavyInf && sb === FRONT && !b.routing && b.coh > 0.5) r *= 0.45;
    if (b.isCav && a.T.spear && sa === FRONT) r *= a.form === 'wall' ? 2.4 : 1.6;
    if (a.isEle) r *= b.lanes ? 0.5 : b.isCav ? 1.2 : 1.6;
    if (b.isEle) r *= 0.06; // un éléphant ne tombe pas comme un homme
    if (b.routing) r *= (a.isCav ? 7 : 5) * (b.trapped ? 1.5 : 1);
    if (b.order.kind === 'withdraw' && sb === FRONT) r *= 0.7;
    if (a.side === wind.dustSide) r *= 0.94; // poussée du Volturnus dans les yeux
    const dh = (a.y - b.y);
    if (dh > 1.5) r *= 1.1; else if (dh < -1.5) r *= 0.92;
    return r;
  }
  hint(u, from) {
    const [px, pz] = u.nearest(from.x, from.z);
    if (u.hits.length < 64) u.hits.push(px, pz);
  }

  // ------------------------------------------------------- tirs de projectiles
  missiles(dt) {
    for (const u of this.units) {
      u.firing = Math.max(0, u.firing - dt);
      if (!u.active || u.isGen) continue;
      const M = u.T.missile;
      // pila : deux volées juste avant le choc
      if (u.pila > 0 && u.pilaCD <= 0 && !u.engaged && (u.order.kind === 'attack' || u.order.kind === 'advance')) {
        const t = this.frontEnemy(u, 26);
        if (t) {
          const n = Math.min(u.men, u.files * 2);
          this.volley(u, t, PILUM, n, 1);
          u.pila--; u.pilaCD = 2.2; u.firing = 1.5;
          if (this.throttled('pila' + u.side, 40)) this.emit('pila', `${u.name} lance ses pila.`, u);
        }
      }
      if (!M || u.ammo <= 0 || u.fireHold || u.engaged || u.routing) continue;
      u.fireT -= dt;
      if (u.fireT <= 0) { u.fireTarget = this.pickTarget(u, M.range); u.fireT = 1; }
      const t = u.fireTarget;
      if (!t || !t.alive) continue;
      const shooters = u.isCav ? u.men * 0.5 : Math.min(u.men, u.files * 4);
      const rate = shooters / M.reload;
      u.shotAcc += rate * dt;
      u.ammo -= (rate * dt) / Math.max(1, u.men);
      u.firing = 1.2;
      const nVis = Math.floor(u.shotAcc / this.scale);
      if (nVis > 0) {
        u.shotAcc -= nVis * this.scale;
        this.volley(u, t, M, nVis, this.scale, true);
      }
    }
  }
  frontEnemy(u, range) {
    let best = null, bd = range;
    for (const e of this.units) {
      if (e.side === u.side || !e.alive || e.isGen) continue;
      if (Math.abs(e.x - u.x) > range + e.rad + u.rad || Math.abs(e.z - u.z) > range + e.rad + u.rad) continue;
      const [nx, nz] = e.nearest(u.frontX(), u.frontZ());
      const [lx, lz] = u.local(nx, nz);
      if (lz < u.hd - 2 || Math.abs(lx) > u.hw + 10) continue;
      const d = lz - u.hd;
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }
  pickTarget(u, range) {
    let best = null, bs = Infinity;
    for (const e of this.units) {
      if (e.side === u.side || !e.alive) continue;
      if (Math.abs(e.x - u.x) > range + e.rad + u.rad || Math.abs(e.z - u.z) > range + e.rad + u.rad) continue;
      const d = u.distTo(e);
      if (d > range) continue;
      // ne pas tirer dans une mêlée où sont engagés des amis
      if (e.contacts.some((c) => c.o.side === u.side && !c.o.isGen)) continue;
      const [lx, lz] = u.local(e.x, e.z);
      const ang = Math.abs(Math.atan2(lx, lz));
      if (!u.isCav && ang > 1.4) continue;
      const s = d * (e.isGen ? 0.7 : 1) * (e.routing ? 1.5 : 1);
      if (s < bs) { bs = s; best = e; }
    }
    return best;
  }
  volley(u, t, M, n, weight, single) {
    const rng = this.rng;
    const dustMul = this.wind.dustSide === u.side ? 1.5 : 1;
    const count = single ? n : Math.max(1, Math.round(n / this.scale));
    const w = single ? weight : n / count;
    for (let k = 0; k < count; k++) {
      if (!this.pFree.length) return;
      const i = this.pFree.pop();
      const lx = (rng() * 2 - 1) * u.hw, lz = u.hd - rng() * Math.min(u.d, M === PILUM ? 2.5 : 8);
      const [ox, oz] = u.world(lx, lz);
      const oy = this.terrain.height(ox, oz) + (u.isCav ? 2.6 : 1.8);
      const tlx = (rng() * 2 - 1) * t.hw * 0.95, tlz = (rng() * 2 - 1) * t.hd * 0.95;
      let [tx, tz] = t.world(tlx, tlz);
      const ty = this.terrain.height(tx, tz) + 1.0;
      const dx0 = tx - ox, dz0 = tz - oz, R0 = Math.hypot(dx0, dz0);
      const v = M.v * (0.92 + rng() * 0.16);
      const tof = R0 / (v * 0.85);
      tx += t.vx * tof; tz += t.vz * tof;
      const dx = tx - ox, dz = tz - oz, R = Math.max(1, Math.hypot(dx, dz)), dy = ty - oy;
      const disc = v ** 4 - G * (G * R * R + 2 * dy * v * v);
      let ang = disc >= 0 ? Math.atan((v * v - Math.sqrt(disc)) / (G * R)) : Math.PI / 4;
      ang += gauss(rng) * M.spread * dustMul * 0.6;
      const az = Math.atan2(dx, dz) + gauss(rng) * M.spread * dustMul;
      const ch = Math.cos(ang);
      this.pX[i] = ox; this.pY[i] = oy; this.pZ[i] = oz;
      this.pVX[i] = Math.sin(az) * ch * v; this.pVZ[i] = Math.cos(az) * ch * v; this.pVY[i] = Math.sin(ang) * v;
      this.pKind[i] = M.kind === 'sling' ? 1 : M === PILUM ? 2 : 0;
      this.pSide[i] = u.side; this.pAge[i] = -rng() * (M === PILUM ? 0.4 : 0.9); // départs étalés
      this.pW[i] = w; this.pOn[i] = 1; this.pType[i] = M;
      this.pCount++;
    }
  }
  moveProjectiles(dt) {
    const sub = 2, h = dt / sub;
    const ter = this.terrain;
    const P = this.PCAP;
    for (let i = 0; i < P; i++) {
      if (!this.pOn[i]) continue;
      for (let s = 0; s < sub; s++) {
        let a = this.pAge[i] + h;
        this.pAge[i] = a;
        if (a < 0) break; // pas encore lancé
        this.pVY[i] -= G * h;
        this.pX[i] += this.pVX[i] * h; this.pY[i] += this.pVY[i] * h; this.pZ[i] += this.pVZ[i] * h;
        const x = this.pX[i], z = this.pZ[i], y = this.pY[i];
        const gy = ter.height(x, z);
        if (y < gy + 2.0 && this.pVY[i] < 0 && this.projHit(i, x, z, y - gy)) { this.killProj(i); break; }
        if (y <= gy || a > 9) {
          if (this.pKind[i] !== 1 && y > gy - 1 && this.stuck.length < 4000) {
            const vx = this.pVX[i], vy = this.pVY[i], vz = this.pVZ[i], l = Math.hypot(vx, vy, vz) || 1;
            this.stuck.push(x, gy, z, vx / l, vy / l, vz / l, this.pKind[i]);
          }
          this.killProj(i); break;
        }
      }
    }
  }
  killProj(i) { this.pOn[i] = 0; this.pFree.push(i); this.pCount--; }
  projHit(i, x, z, hAbove) {
    const side = this.pSide[i];
    for (const u of this.units) {
      if (u.side === side || !u.alive) continue;
      const dx = x - u.x, dz = z - u.z;
      if (dx * dx + dz * dz > u.rad * u.rad) continue;
      if (!u.isInside(x, z)) continue;
      if ((u.isCav || u.isEle) ? hAbove > 3.2 : hAbove > 1.9) return false;
      const M = this.pType[i];
      const dens = clamp(2.2 / (u.spX * u.spZ), 0.3, 1) * (u.form === 'loose' ? 0.8 : 1);
      const vx = this.pVX[i], vz = this.pVZ[i];
      const fromFront = vx * u.fx + vz * u.fz < 0;
      const shield = u.isEle ? 0 : u.heavyInf ? 0.45 : u.isCav ? 0.15 : 0.25;
      let p = M.pHit * dens * (fromFront && !u.routing ? 1 - shield : 1) * (u.routing ? 1.2 : 1);
      if (this.rng() >= p) return false;
      const w = this.pW[i];
      if (u.isEle) {
        u.cas += w * 0.012;
        u.morale -= 0.9 * w / Math.max(1, u.men);
      } else {
        const armor = clamp(1.3 - u.T.md / 25, 0.55, 1.2);
        u.cas += w * M.pKill * armor;
      }
      if (M === PILUM) u.hamperT = 25; // boucliers alourdis par les pila fichés
      if (u.hits.length < 64) u.hits.push(x, z);
      if (u.isGen && u.genState === 0 && this.rng() < 0.08 * w) this.woundGeneral(u);
      return true;
    }
    return false;
  }

  // ------------------------------------------------------------- capacités
  // Harangue : le général raffermit les unités autour de lui
  harangue(g) {
    if (!g.gen || g.genState === 2 || g.routing || (g.cd.harangue || 0) > 0) return false;
    let n = 0;
    for (const u of this.units) {
      if (u.side !== g.side || !u.active || u === g) continue;
      if (Math.hypot(u.x - g.x, u.z - g.z) > g.gen.aura * 1.25 + u.rad) continue;
      u.morale = Math.min(u.T.morale + 22, u.morale + 16); u.boostT = 45; n++;
    }
    g.cd.harangue = 150;
    this.emit('ability', `${g.name} harangue ses hommes (${n} unités galvanisées).`, g);
    return true;
  }
  // Ralliement : rappeler les fuyards proches qui ne sont pas pris au piège
  rally(g) {
    if (!g.gen || g.genState === 2 || g.routing || (g.cd.rally || 0) > 0) return false;
    let n = 0;
    for (const u of this.units) {
      if (u.side !== g.side || !u.routing || u.trapped || u.men < u.men0 * 0.15) continue;
      if (Math.hypot(u.x - g.x, u.z - g.z) > g.gen.aura * 1.4 + u.rad) continue;
      u.state = ST.READY; u.order = { kind: 'hold' }; u.morale = Math.max(u.morale, 32); u.coh = 0.45; u.safeT = 0; n++;
    }
    g.cd.rally = 200;
    this.emit('ability', n ? `${g.name} rallie ${n} unité${n > 1 ? 's' : ''} en fuite.` : `${g.name} appelle au ralliement, mais personne ne l'entend.`, g);
    return true;
  }
  // Volée de pila sur ordre
  throwPila(u) {
    if (!u.active || u.pila <= 0 || u.pilaCD > 0 || u.engaged) return false;
    const t = this.frontEnemy(u, 32);
    if (!t) return false;
    this.volley(u, t, PILUM, Math.min(u.men, u.files * 2), 1);
    u.pila--; u.pilaCD = 2.2; u.firing = 1.5;
    this.emit('pila', `${u.name} lance ses pila.`, u);
    return true;
  }
  // Trompettes et cors : affolent les éléphants ennemis proches (Zama)
  horns(side) {
    const key = 'horns' + side;
    if ((this.flagT[key + 'cd'] || -1e9) > this.t) return false;
    let n = 0;
    for (const e of this.units) {
      if (e.side === side || !e.isEle || !e.active) continue;
      const near = this.units.some((o) => o.side === side && o.active && Math.hypot(o.x - e.x, o.z - e.z) < 450);
      if (!near) continue;
      e.morale -= 5 + this.rng() * 16; n++;
    }
    this.flagT[key + 'cd'] = this.t + 120;
    this.emit('horns', n ? 'Trompettes et cors sonnent ensemble : les éléphants s\'affolent.' : 'Les trompettes sonnent, mais aucun éléphant n\'est assez proche.', null, { side });
    return true;
  }

  // ------------------------------------------------------------- moral
  scan(u) {
    let nearEnemy = Infinity, auraBonus = 0, fear = 0, cavRear = 0;
    for (const o of this.units) {
      if (!o.alive || o === u) continue;
      const dx = o.x - u.x, dz = o.z - u.z;
      if (o.side !== u.side) {
        if (Math.abs(dx) > 900 || Math.abs(dz) > 900) continue;
        const d = Math.hypot(dx, dz);
        if (o.active && !o.isGen) nearEnemy = Math.min(nearEnemy, d - o.rad - u.rad);
        if (o.isEle && o.active && d < o.rad + u.rad + 40) fear += (u.isCav ? 0.6 : u.lanes ? 0.1 : 0.3); // peur des éléphants
        if (o.isCav && o.active && d < 160 + u.rad) {
          const [, lz] = u.local(o.x, o.z);
          if (lz < -u.hd) cavRear = 0.25; // cavalerie ennemie dans le dos
        }
      } else if (o.gen && o.genState < 2 && !o.routing) {
        const d = Math.hypot(dx, dz);
        if (d < o.gen.aura) auraBonus = Math.max(auraBonus, o.gen.bonus * (o.genState === 1 ? 0.5 : 1));
      }
    }
    return { nearEnemy, auraBonus, fear, cavRear };
  }
  morale(u, dt) {
    if (u.isGen) { this.genMorale(u, dt); }
    if (!u.sc || (this.stepN + u.id) % 5 === 0) u.sc = this.scan(u);
    const { nearEnemy, auraBonus } = u.sc;
    let dm = -u.sc.fear - (u.engaged ? u.sc.cavRear : 0);
    const cap = u.T.morale + 10 * auraBonus;
    if (u.routing) {
      if (nearEnemy > 220) { u.safeT += dt; u.morale += 0.8 * dt; } else { u.safeT = 0; }
      const sideOK = this.sideCache[u.side].active > this.sides[u.side].men0 * 0.35;
      if (u.safeT > 20 && u.morale > 40 && u.routCount < 2 && !u.isEle && u.men > u.men0 * 0.3 && sideOK) {
        u.state = ST.READY; u.order = { kind: 'hold' }; u.coh = 0.4;
        this.emit('rally', `${u.name} se rallie.`, u);
      }
      u.morale = clamp(u.morale, 0, 100);
      return;
    }
    if (u.boostT > 0) u.boostT -= dt;
    for (const k in u.cd) if (u.cd[k] > 0) u.cd[k] -= dt;
    const orb = u.form === 'orbis' ? 0.3 : 1;
    if (u.engaged) dm -= 0.04;
    if (u.eS[LEFT] > 0 || u.eS[RIGHT] > 0) dm -= 0.35 * orb;
    if (u.eS[REAR] > 0) dm -= 0.7 * orb;
    if (u.nSides >= 3) {
      dm -= 1.0 * (u.form === 'orbis' ? 0.4 : 1);
      if (!u.flags.surr && this.throttled('surr' + u.side, 15)) { u.flags.surr = 1; this.emit('surround', `${u.name} est encerclée !`, u); }
    }
    if (u.fatigue > 70) dm -= 0.08;
    if (u.engaged && u.side === this.wind.dustSide) dm -= 0.02;
    dm += 0.3 * auraBonus;
    if (!u.engaged && nearEnemy > 120) dm += 0.5;
    u.morale = Math.min(cap, u.morale + dm * dt);
    if (u.morale < cap && dm > 0) u.morale = Math.min(cap, u.morale);
    // seuil de rupture
    const flanked = u.form !== 'orbis' && (u.eS[LEFT] > 0 || u.eS[RIGHT] > 0 || u.eS[REAR] > 0);
    u.morale = Math.max(0, u.morale);
    if (u.morale < 10 || (flanked && u.morale < 18) || (u.isEle && u.morale < 22)) this.rout(u);
  }
  rout(u) {
    if (u.routing || !u.alive) return;
    u.state = ST.ROUTING; u.routCount++; u.safeT = 0;
    u.order = { kind: 'hold' };
    u.morale = Math.min(u.morale, 8);
    this.emit('rout', u.isEle ? `${u.name} s'affolent et font demi-tour !` : `${u.name} ${u.nSides >= 3 ? 'encerclée, cède' : 'se débande et fuit'} !`, u);
    // contagion de la panique
    for (const o of this.units) {
      if (!o.active || o === u) continue;
      const d = Math.hypot(o.x - u.x, o.z - u.z) - o.rad - u.rad;
      const big = Math.min(1, u.men0 / Math.max(300, o.men)) * (u.light ? 0.3 : 1);
      if (o.side === u.side) { if (d < 150) o.morale -= 4 * big; else if (d < 400) o.morale -= 1.5 * big; }
      else if (d < 300) o.morale = Math.min(o.T.morale + 15, o.morale + 3);
    }
  }
  genMorale(u) {
    if (u.genState < 2 && u.men < u.men0 * 0.15) this.killGeneral(u);
    else if (u.genState === 0 && u.men < u.men0 * 0.55) this.woundGeneral(u);
  }
  woundGeneral(u) {
    if (u.genState > 0) return;
    u.genState = 1;
    this.emit('gen', `${u.name} est blessé${u.lastHitBy && u.lastHitBy.T.missile && u.lastHitBy.T.missile.kind === 'sling' ? ' par une balle de fronde' : ''} !`, u);
  }
  killGeneral(u) {
    if (u.genState === 2) return;
    u.genState = 2;
    this.emit('gen', `${u.name} est tombé !`, u);
    for (const o of this.units) {
      if (o.side !== u.side || !o.active) continue;
      const d = Math.hypot(o.x - u.x, o.z - u.z);
      o.morale -= d < 400 ? 18 : 9;
    }
  }

  // -------------------------------------------------------------- pertes
  losses(u, dt) {
    if (u.cas <= 0) { u.lossRate *= 0.98; return; }
    const c = Math.min(u.cas, u.men);
    u.men -= c;
    this.sides[u.side].killed += c;
    u.lossRate = u.lossRate * 0.95 + (c / dt) * 0.05;
    if (!u.routing) u.morale -= (c / u.men0) * (u.isEle ? 120 : 300);
    if (u.men < 1 || (u.men < u.men0 * 0.04 && !u.isGen)) {
      if (u.men >= 1) this.sides[u.side].fled += u.men;
      u.men = 0; u.state = ST.DEAD;
      if (u.isGen) this.killGeneral(u);
      this.emit('destroyed', `${u.name} est anéantie.`, u);
      return;
    }
    u.shrink();
    u.y = this.terrain.height(u.x, u.z);
    if (u.isGen) this.genMorale(u);
  }

  // ------------------------------------------------------- fin de bataille
  sideState(s) {
    let active = 0, routing = 0, men = 0;
    for (const u of this.units) {
      if (u.side !== s || u.isGen) continue;
      if (u.active) active += u.men;
      else if (u.routing) routing += u.men;
      if (u.alive) men += u.men;
    }
    return { active, routing, men, men0: this.sides[s].men0, killed: this.sides[s].killed, fled: this.sides[s].fled };
  }
  checkEnd() {
    if (this.over) return;
    const st = [this.sideState(0), this.sideState(1)];
    for (const s of [0, 1]) {
      const me = st[s], foe = st[1 - s];
      // armée brisée : presque plus personne en ordre, ou trop peu face à un ennemi bien plus fort
      if (me.active < me.men0 * 0.12 || (me.active < me.men0 * 0.3 && foe.active > me.active * 2.5)) { this.finish(1 - s); return; }
    }
    if (this.t > 6 * 3600) {
      const a = this.sideState(0), b = this.sideState(1);
      this.finish(a.active / a.men0 > b.active / b.men0 ? 0 : 1);
    }
  }
  finish(w) {
    this.over = true; this.winner = w;
    this.emit('end', `${this.scn.sideNames[w]} remporte la bataille.`, null, { winner: w });
  }
}

const PILUM = { kind: 'pilum', range: 25, v: 18, pHit: 0.42, pKill: 0.42, spread: 0.05 };

// ---------------------------------------------------------- géométrie
// Test de séparation (SAT) entre deux rectangles orientés, agrandis de m.
// Renvoie le recouvrement minimal et la normale de a vers b.
function obb(a, b, m) {
  const dx = b.x - a.x, dz = b.z - a.z;
  let best = Infinity, nx = 0, nz = 0;
  const ax = [a.rx, a.fx, b.rx, b.fx], az = [a.rz, a.fz, b.rz, b.fz];
  const ahw = a.hw + m, ahd = a.hd + m, bhw = b.hw + m, bhd = b.hd + m;
  for (let k = 0; k < 4; k++) {
    const x = ax[k], z = az[k];
    const ra = ahw * Math.abs(a.rx * x + a.rz * z) + ahd * Math.abs(a.fx * x + a.fz * z);
    const rb = bhw * Math.abs(b.rx * x + b.rz * z) + bhd * Math.abs(b.fx * x + b.fz * z);
    const d = dx * x + dz * z;
    const ov = ra + rb - Math.abs(d);
    if (ov <= 0) return null;
    if (ov < best) { best = ov; const s = d < 0 ? -1 : 1; nx = x * s; nz = z * s; }
  }
  return { ov: best, nx, nz };
}
function sideOf(u, nx, nz) {
  const lx = nx * u.rx + nz * u.rz, lz = nx * u.fx + nz * u.fz;
  if (Math.abs(lz) >= Math.abs(lx) * 0.9) return lz > 0 ? FRONT : REAR;
  return lx > 0 ? RIGHT : LEFT;
}
function contactLen(a, b, side) {
  let ax, az, half;
  if (side === FRONT || side === REAR) { ax = a.rx; az = a.rz; half = a.hw; }
  else { ax = a.fx; az = a.fz; half = a.hd; }
  const c = (b.x - a.x) * ax + (b.z - a.z) * az;
  const r = b.hw * Math.abs(b.rx * ax + b.rz * az) + b.hd * Math.abs(b.fx * ax + b.fz * az);
  return Math.max(0, Math.min(half, c + r) - Math.max(-half, c - r));
}
function gauss(rng) {
  return (rng() + rng() + rng() + rng() - 2) * 1.2247;
}
