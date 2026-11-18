/* Interface de commandement : menu, sélection, ordres, fiches, étiquettes, carte, dépêches, bilan. */
import * as THREE from 'three';
import { SCENARIOS, TYPES } from './data.js';
import { ST, FRONT } from './sim.js';
import { HALF } from './terrain.js';

const $ = (id) => document.getElementById(id);
const nf = new Intl.NumberFormat('fr-FR');
const fmt = (n) => nf.format(Math.round(n));
const _v = new THREE.Vector3();

const ICON = {
  advance: '<path d="M12 20V5M6 11l6-6 6 6"/>',
  charge: '<path d="M5 19L19 5M11 5h8v8M5 13l6 6"/>',
  hold: '<rect x="6" y="6" width="12" height="12" rx="1"/>',
  back: '<path d="M12 4v15M6 13l6 6 6-6"/>',
  left: '<path d="M9 8H5V4M5 8a8 8 0 1 1 1 9"/>',
  right: '<path d="M15 8h4V4M19 8a8 8 0 1 0-1 9"/>',
  about: '<path d="M7 7l-3 3 3 3M4 10h11a5 5 0 0 1 0 10h-3"/>',
  deep: '<path d="M8 4h8M8 9h8M8 14h8M8 19h8"/>',
  wide: '<path d="M3 9h18M3 15h18"/>',
  fire: '<path d="M4 20L20 4M14 4h6v6M4 14l2 2"/>',
  skirm: '<path d="M4 12c4-6 12-6 16 0M4 12c4 6 12 6 16 0"/><circle cx="12" cy="12" r="2"/>',
  relief: '<path d="M7 4v16M17 4v16M7 8l10 8M17 8L7 16"/>',
  follow: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  rank: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

const GROUPS = {
  cannae: [
    [['velites'], 'Vélites'], [['hastati'], 'Hastati'], [['principes'], 'Principes'], [['triarii'], 'Triarii'],
    [['cavR'], 'Cavalerie romaine'], [['cavL'], 'Cavalerie alliée'], [['gen'], 'Consuls'],
    [['light'], 'Troupes légères'], [['center'], 'Gaulois et Ibères'], [['libL'], 'Libyens ouest'], [['libR'], 'Libyens est'],
    [['cavL', 'cavL2', 'genCavL'], "Cavalerie d'Hasdrubal"], [['cavR', 'genCavR'], 'Numides'],
  ],
  zama: [
    [['velites'], 'Vélites'], [['hastati'], 'Hastati'], [['principes'], 'Principes'], [['triarii'], 'Triarii'],
    [['cavR', 'numInf', 'genCavR'], 'Massinissa'], [['cavL', 'genCavL'], 'Lélius'], [['gen'], 'Scipion'],
    [['ele'], 'Éléphants'], [['light'], 'Frondeurs'], [['line1'], '1re ligne'], [['line2'], '2e ligne'], [['line3'], 'Vétérans'],
  ],
};

export class UI {
  constructor(app) {
    this.app = app;
    this.sel = new Set();
    this.inspect = null;
    this.overlay = 'auto';
    this.labels = new Map();
    this.feedN = 0;
    this.lastHud = 0; this.lastLbl = 0; this.lastMini = 0;
    this.cfg = { scn: 'cannae', side: 0, scale: app.defaultScale, quality: app.defaultQuality };
    this.buildMenu();
    this.bindHud();
  }

  // ---------------------------------------------------------------- menu
  buildMenu() {
    const box = $('scns');
    box.innerHTML = '';
    for (const id of ['cannae', 'zama']) {
      const s = SCENARIOS[id];
      const us = s.units();
      const r = us.filter((u) => u.side === 0).reduce((a, u) => a + u.men, 0), c = us.filter((u) => u.side === 1).reduce((a, u) => a + u.men, 0);
      const b = document.createElement('button');
      b.className = 'scn' + (id === this.cfg.scn ? ' on' : '');
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', id === this.cfg.scn);
      b.dataset.id = id;
      b.innerHTML = `<span class="nm">${s.name}</span><span class="dt">${s.date}</span><span class="ds">${s.place}. ${id === 'cannae' ? "Hannibal enveloppe une armée presque deux fois plus nombreuse que la sienne." : "Scipion affronte Hannibal et ses éléphants aux portes de Carthage."}</span><span class="vs"><span style="color:var(--rome)">Rome ${fmt(r)}</span><span style="color:var(--carthage)">Carthage ${fmt(c)}${id === 'zama' ? ' et 80 éléphants' : ''}</span></span>`;
      b.onclick = () => { this.cfg.scn = id; this.buildMenu(); this.app.preview(id); };
      box.appendChild(b);
    }
    const seg = (id, key, conv) => {
      const el = $(id);
      for (const b of el.querySelectorAll('button')) {
        b.classList.toggle('on', String(this.cfg[key]) === b.dataset.v);
        b.onclick = () => { this.cfg[key] = conv(b.dataset.v); this.buildMenu(); };
      }
    };
    seg('sideSeg', 'side', Number); seg('scaleSeg', 'scale', Number); seg('qualSeg', 'quality', String);
    const s = SCENARIOS[this.cfg.scn];
    const total = s.units().reduce((a, u) => a + u.men, 0);
    $('scaleNote').textContent = this.cfg.scale === 1 ? `Chaque homme est représenté : ${fmt(total)} soldats. Pour un ordinateur puissant.` : `Une figurine pour ${this.cfg.scale} hommes : environ ${fmt(total / this.cfg.scale)} figurines.`;
    $('sideNote').textContent = this.cfg.side === 2 ? "L'ordinateur suit le plan historique des deux généraux." : `Tu commandes ${s.commanders[this.cfg.side]}. L'adversaire suit le plan historique.`;
    $('brief').innerHTML = `<b>${s.name}, ${s.date}.</b> ${s.brief[this.cfg.side]}`;
    $('startBtn').onclick = () => this.app.start({ ...this.cfg });
  }
  showMenu(running) {
    $('menu').hidden = false;
    $('startBtn').textContent = running ? 'Recommencer' : 'Prendre le commandement';
    let r = $('resumeBtn');
    if (running && !r) {
      r = document.createElement('button'); r.id = 'resumeBtn'; r.className = 'ghost'; r.textContent = 'Reprendre la bataille';
      $('startBtn').after(r);
    }
    if (r) { r.hidden = !running; r.onclick = () => { $('menu').hidden = true; this.app.resume(); }; }
  }

  // ------------------------------------------------------------ HUD
  bindHud() {
    for (const b of $('speed').querySelectorAll('button')) b.onclick = () => this.app.setSpeed(+b.dataset.s);
    $('soundBtn').onclick = () => {
      const a = this.app.audio;
      if (!a.ctx) { a.start(); a.setMuted(false); }
      else a.setMuted(!a.muted);
      $('waves').style.opacity = a.muted ? 0.2 : 1;
    };
    $('viewBtn').onclick = () => {
      this.overlay = this.overlay === 'auto' ? 'on' : this.overlay === 'on' ? 'off' : 'auto';
      this.toast(this.overlay === 'on' ? 'Aide tactique : toutes les unités' : this.overlay === 'off' ? 'Aide tactique : désactivée' : 'Aide tactique : automatique (vue de haut)');
    };
    $('helpBtn').onclick = () => { $('helpM').hidden = false; };
    for (const b of document.querySelectorAll('[data-close]')) b.onclick = () => { b.closest('.modal').hidden = true; };
    $('menuBtn').onclick = () => { this.app.setSpeed(0); this.showMenu(true); };
    $('engage').onclick = () => this.app.engage();
    $('resetDeploy').onclick = () => this.app.resetDeploy();
    window.addEventListener('keydown', (e) => this.key(e));
    const mini = $('miniC');
    mini.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const r = mini.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * this.miniSpan * 2, z = ((e.clientY - r.top) / r.height - 0.5) * this.miniSpan * 2;
      this.app.cam.follow = null; this.app.cam.target.x = x; this.app.cam.target.z = z;
    });
  }
  setSpeedUI(s) {
    for (const b of $('speed').querySelectorAll('button')) b.classList.toggle('on', +b.dataset.s === s);
  }
  key(e) {
    if (!$('menu').hidden || e.target.tagName === 'INPUT') return;
    const k = e.code;
    if (k === 'Space') { e.preventDefault(); this.app.setSpeed(this.app.speed ? 0 : this.app.lastSpeed || 4); }
    else if (k.startsWith('Digit') && +k[5] >= 1 && +k[5] <= 5) this.app.setSpeed([1, 2, 4, 8, 16][+k[5] - 1]);
    else if (k === 'KeyV') this.order('advance');
    else if (k === 'KeyC') this.order('charge');
    else if (k === 'KeyH') this.order('hold');
    else if (k === 'KeyB') this.order('back');
    else if (k === 'Escape') { this.clearSel(); for (const m of document.querySelectorAll('.modal')) m.hidden = true; }
  }
  toast(text) { this.feed({ text, kind: 'info', side: -1, t: this.app.battle ? this.app.battle.t : 0 }); }

  // ----------------------------------------------------- partie lancée
  startBattle(app) {
    const b = app.battle;
    this.sel.clear(); this.inspect = null;
    for (const el of this.labels.values()) el.remove();
    this.labels.clear();
    $('feed').innerHTML = '';
    $('top').hidden = false; $('bottom').hidden = false; $('mini').hidden = false;
    this.buildGroups();
    this.miniBg = null;
    b.listeners.push((e) => this.onEvent(e));
    this.updateCard();
  }
  buildGroups() {
    const b = this.app.battle, side = this.app.player;
    const el = $('groups');
    el.innerHTML = '';
    if (side > 1) return;
    const scnId = b.scn.id;
    const roles = new Set(b.units.filter((u) => u.side === side).map((u) => u.role));
    this.groupDefs = [];
    for (const [rs, label] of GROUPS[scnId]) {
      if (!rs.some((r) => roles.has(r))) continue;
      const us = b.units.filter((u) => u.side === side && rs.includes(u.role));
      if (!us.length) continue;
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.innerHTML = `${label}<b>${us.length}</b>`;
      chip.onclick = (ev) => {
        if (!ev.shiftKey) this.sel.clear();
        this.inspect = null;
        for (const u of us) if (u.alive && !u.routing) this.sel.add(u);
        if (chip.dataset.last && performance.now() - chip.dataset.last < 450) this.focus(us);
        chip.dataset.last = performance.now();
        this.updateCard();
      };
      el.appendChild(chip);
      this.groupDefs.push({ chip, us });
    }
    const all = document.createElement('button');
    all.className = 'chip'; all.textContent = 'Toute l\'armée';
    all.onclick = () => { this.sel = new Set(b.units.filter((u) => u.side === side && u.active)); this.updateCard(); };
    el.appendChild(all);
  }
  focus(us) {
    const a = us.filter((u) => u.alive); if (!a.length) return;
    const cam = this.app.cam;
    cam.follow = null;
    cam.target.x = a.reduce((s, u) => s + u.x, 0) / a.length; cam.target.z = a.reduce((s, u) => s + u.z, 0) / a.length;
    cam.dist = Math.min(cam.dist, 700);
  }

  // ------------------------------------------------------- sélection
  project(x, y, z) {
    const c = this.app.camera; _v.set(x, y, z).project(c);
    if (_v.z > 1) return null;
    const r = this.app.canvas.getBoundingClientRect();
    return [(_v.x + 1) / 2 * r.width + r.left, (1 - _v.y) / 2 * r.height + r.top];
  }
  pick(sx, sy) {
    const b = this.app.battle; if (!b) return null;
    const g = this.app.cam.ground(sx, sy);
    let best = null, bs = Infinity;
    for (const u of b.units) {
      if (!u.alive || u.men < 1) continue;
      if (g && u.isInside(g.x, g.z, u.routing ? 25 : 3)) {
        const s = Math.hypot(g.x - u.x, g.z - u.z) * 0.001;
        if (s < bs) { bs = s; best = u; }
        continue;
      }
      const p = this.project(u.x, u.y + 2, u.z);
      if (!p) continue;
      const d = Math.hypot(p[0] - sx, p[1] - sy);
      if (d < 30 && 1 + d < bs) { bs = 1 + d; best = u; }
    }
    return best;
  }
  clearSel() { this.sel.clear(); this.inspect = null; this.app.effects.ghosts = null; this.updateCard(); }
  mine(u) { return u && u.side === this.app.player; }
  selected() { return [...this.sel].filter((u) => this.mine(u) && u.alive && !u.routing); }

  onTap(x, y, o) {
    const app = this.app; if (!app.battle || !$('menu').hidden) return;
    const u = this.pick(x, y);
    const g = app.cam.ground(x, y);
    const units = this.selected();
    if (o.button === 2) {
      if (u && !this.mine(u) && units.length) this.attack(units, u);
      else if (g && units.length) this.moveTo(units, g.x, g.z);
      return;
    }
    if (u && this.mine(u)) {
      this.inspect = null;
      if (o.shift || o.ctrl) { if (this.sel.has(u)) this.sel.delete(u); else this.sel.add(u); }
      else if (this.sel.size === 1 && this.sel.has(u) && o.touch) { /* déjà choisie */ }
      else { this.sel.clear(); this.sel.add(u); }
      this.updateCard();
      return;
    }
    if (u && !this.mine(u)) {
      if (units.length && (o.touch || o.long)) { this.attack(units, u); return; }
      this.inspect = u; this.updateCard();
      return;
    }
    if (g && units.length && (o.touch || o.long)) { this.moveTo(units, g.x, g.z); return; }
    this.clearSel();
  }
  onBox(phase, x0, y0, x1, y1) {
    const box = $('box');
    if (phase === 'preview') {
      box.hidden = false;
      Object.assign(box.style, { left: Math.min(x0, x1) + 'px', top: Math.min(y0, y1) + 'px', width: Math.abs(x1 - x0) + 'px', height: Math.abs(y1 - y0) + 'px' });
      return;
    }
    box.hidden = true;
    const [a, b2, c, d] = [Math.min(x0, x1), Math.max(x0, x1), Math.min(y0, y1), Math.max(y0, y1)];
    this.sel.clear(); this.inspect = null;
    for (const u of this.app.battle.units) {
      if (!this.mine(u) || !u.active) continue;
      const p = this.project(u.x, u.y + 1, u.z);
      if (p && p[0] >= a && p[0] <= b2 && p[1] >= c && p[1] <= d) this.sel.add(u);
    }
    this.updateCard();
  }
  // tracer une ligne de bataille : position, front et orientation
  onDragOrder(phase, s, e) {
    const units = this.selected();
    if (!units.length) return;
    const lx = e.x - s.x, lz = e.z - s.z, len = Math.hypot(lx, lz);
    if (len < 8) { this.app.effects.ghosts = null; if (phase === 'commit') this.moveTo(units, e.x, e.z); return; }
    const ux = lx / len, uz = lz / len;
    let nx = uz, nz = -ux;
    const cam = this.app.camera.position, mx = (s.x + e.x) / 2, mz = (s.z + e.z) / 2;
    if ((mx - cam.x) * nx + (mz - cam.z) * nz < 0) { nx = -nx; nz = -nz; }
    const th = Math.atan2(nx, nz);
    const sorted = units.slice().sort((a, b) => (a.x - s.x) * ux + (a.z - s.z) * uz - ((b.x - s.x) * ux + (b.z - s.z) * uz));
    const wsum = sorted.reduce((a, u) => a + u.w, 0);
    const gap = sorted.length > 1 ? Math.min(6, len * 0.02) : 0;
    const usable = len - gap * (sorted.length - 1);
    let off = 0;
    const plan = sorted.map((u) => {
      const w = usable * (u.w / wsum);
      const files = Math.max(4, Math.min(u.men, Math.round(w / u.spX)));
      const ranks = u.men / files;
      const c = off + w / 2; off += w + gap;
      const d = ranks * u.spZ;
      return { u, files, x: s.x + ux * c - nx * d / 2, z: s.z + uz * c - nz * d / 2, th, hw: files * u.spX / 2, hd: d / 2 };
    });
    if (phase === 'preview') { this.app.effects.ghosts = plan; return; }
    this.app.effects.ghosts = null;
    for (const p of plan) {
      if (this.app.deploying) { if (this.inZone(p.u, p.x, p.z)) { p.u.setFiles(p.files); this.app.place(p.u, p.x, p.z, th); } }
      else { p.u.setFiles(p.files); p.u.command({ kind: 'move', x: p.x, z: p.z, th }); }
    }
    this.sound('move');
    this.updateCard();
  }
  inZone(u, x, z) {
    const zone = this.app.battle.scn.id === 'cannae' ? 120 : 100;
    return u.side === 0 ? z < -zone : z > zone;
  }
  moveTo(units, gx, gz) {
    const cx = units.reduce((a, u) => a + u.x, 0) / units.length, cz = units.reduce((a, u) => a + u.z, 0) / units.length;
    const dist = Math.hypot(gx - cx, gz - cz);
    let sx = 0, sz = 0; for (const u of units) { sx += u.fx; sz += u.fz; }
    const meanTh = Math.atan2(sx, sz);
    const th = dist > 90 ? Math.atan2(gx - cx, gz - cz) : meanTh;
    const d = units.length > 1 ? th - meanTh : 0, c = Math.cos(d), s = Math.sin(d);
    for (const u of units) {
      const ox = u.x - cx, oz = u.z - cz;
      const tx = gx + ox * c + oz * s, tz = gz - ox * s + oz * c;
      const uth = units.length > 1 || dist > 90 ? th : u.th;
      if (this.app.deploying) { if (this.inZone(u, tx, tz)) this.app.place(u, tx, tz, uth); else this.toast('Hors de la zone de déploiement.'); }
      else u.command({ kind: 'move', x: tx, z: tz, th: uth });
    }
    this.sound('move');
  }
  attack(units, t) {
    if (this.app.deploying) { this.toast("La bataille n'est pas encore engagée."); return; }
    for (const u of units) u.command({ kind: 'attack', target: t });
    this.sound('charge');
  }
  sound(kind) {
    const a = this.app.audio, side = this.app.player;
    if (!a.ctx) return;
    if (side === 0) a.horn(kind === 'charge' ? 'tuba' : 'cornu', 0.35);
    else a.horn(kind === 'charge' ? 'carnyx' : 'cornu', 0.3);
  }

  // ------------------------------------------------------------ ordres
  order(kind) {
    const app = this.app, units = this.selected();
    if (!units.length) return;
    const dep = app.deploying;
    for (const u of units) {
      switch (kind) {
        case 'advance': if (!dep) u.command({ kind: 'advance' }); break;
        case 'charge': {
          if (dep) break;
          let t = app.battle.frontEnemy(u, 500);
          if (!t) { let bd = 600; for (const e of app.battle.units) { if (e.side === u.side || !e.active || e.isGen) continue; const [lx, lz] = u.local(e.x, e.z); const d = Math.hypot(lx, lz); if (lz > 0 && Math.abs(Math.atan2(lx, lz)) < 0.9 && d < bd) { bd = d; t = e; } } }
          if (t) u.command({ kind: 'attack', target: t, run: true }); else u.command({ kind: 'advance', run: true });
          break;
        }
        case 'hold': u.command({ kind: 'hold' }); break;
        case 'back': if (!dep) u.command({ kind: 'withdraw', dist: 40 }); break;
        case 'left': case 'right': case 'about': {
          const dth = kind === 'left' ? Math.PI / 2 : kind === 'right' ? -Math.PI / 2 : Math.PI;
          if (dep) { u.startTurn(dth); u.turnT = 0; app.place(u, u.x, u.z, u.th); }
          else u.command({ kind: 'turn', dth });
          break;
        }
        case 'deep': u.setFiles(u.files * 0.8); if (dep) app.place(u, u.x, u.z, u.th); break;
        case 'wide': u.setFiles(u.files * 1.25); if (dep) app.place(u, u.x, u.z, u.th); break;
        case 'fire': u.fireHold = !u.fireHold; break;
        case 'skirm': u.skirmish = !u.skirmish; break;
        case 'relief': if (!dep) this.relief(u); break;
      }
    }
    if (kind === 'follow') { app.cam.follow = units[0]; app.cam.dist = Math.min(app.cam.dist, 350); }
    if (kind === 'rank') { const u = units[0]; app.cam.enterRank(() => (u.alive && u.fg.n ? app.figures.frontFigure(u) : null)); this.toast('Vue dans le rang : glisse pour regarder autour, molette ou bouton pour sortir.'); }
    if (['advance', 'charge'].includes(kind)) this.sound('charge');
    else if (['back', 'left', 'right', 'about', 'hold'].includes(kind)) this.sound('move');
    this.updateCard();
  }
  // relève de la ligne : les hastati repassent derrière, les principes prennent leur place
  relief(u) {
    if (!u.def || u.def.line === undefined) return;
    const b = this.app.battle;
    const behind = b.units.find((o) => o.side === u.side && o.def.col === u.def.col && o.def.line === u.def.line + 1 && o.active);
    if (!behind) { this.toast(`Personne derrière ${u.name} pour la relever.`); return; }
    u.flags.pass = true; behind.flags.pass = true;
    const [bx, bz] = behind.world(0, -behind.hd - u.hd - 6);
    u.command({ kind: 'move', x: bx, z: bz, th: u.th });
    behind.command({ kind: 'advance' });
    setTimeout(() => { u.flags.pass = false; behind.flags.pass = false; }, 45000 / Math.max(1, this.app.speed || 1));
    this.toast(`${behind.name} relève ${u.name}.`);
  }

  // ------------------------------------------------------- fiche unité
  updateCard() {
    const bar = $('unitbar'), card = $('card'), ord = $('orders');
    const units = this.selected();
    const show = this.inspect || units.length;
    bar.hidden = !show;
    for (const g of this.groupDefs || []) g.chip.classList.toggle('on', g.us.length && g.us.every((u) => !u.active || this.sel.has(u)));
    if (!show) return;
    this.renderCard();
    ord.hidden = !units.length;
    if (!units.length) return;
    const dep = this.app.deploying;
    const missile = units.some((u) => u.T.missile), light = units.some((u) => u.light || u.T.skirmisher);
    const relief = !dep && units.some((u) => u.def.line === 0 && u.side === 0 && u.type === 'hastati');
    const B = [];
    if (!dep) B.push(['advance', 'Avancer', 'V'], ['charge', 'Charger', 'C']);
    B.push(['hold', 'Halte', 'H']);
    if (!dep) B.push(['back', 'Reculer', 'B']);
    B.push(['left', 'Face à gauche'], ['right', 'Face à droite'], ['about', 'Demi-tour'], ['deep', 'Plus profond'], ['wide', 'Plus large']);
    if (missile) B.push(['fire', units.every((u) => !u.T.missile || u.fireHold) ? 'Tir retenu' : 'Tir à volonté', '', units.some((u) => u.fireHold)]);
    if (light) B.push(['skirm', units.some((u) => u.skirmish) ? 'Se dérobe' : 'Tient le contact', '', units.some((u) => u.skirmish)]);
    if (relief) B.push(['relief', 'Relève']);
    B.push(['follow', 'Suivre']);
    if (units.length === 1 && !dep) B.push(['rank', 'Dans le rang']);
    ord.innerHTML = B.map(([k, l, kb, on]) => `<button class="ord${on ? ' on' : ''}" data-o="${k}">${svg(k)}${l}${kb ? ` <kbd>${kb}</kbd>` : ''}</button>`).join('');
    for (const b of ord.querySelectorAll('button')) b.onclick = () => this.order(b.dataset.o);
  }
  renderCard() {
    const card = $('card');
    const units = this.selected();
    const u = this.inspect || (units.length === 1 ? units[0] : null);
    const close = `<button class="ord" style="float:right;padding:4px 6px" data-x aria-label="Fermer">${svg('close')}</button>`;
    if (u) {
      const T = u.T, mor = u.morale, fat = u.fatigue;
      const stCol = u.routing ? 'var(--bad)' : u.nSides >= 2 || u.eS[2] > 0 ? 'var(--warn)' : u.engaged ? 'var(--bronze)' : 'var(--ink)';
      const m = (lab, v, col, txt) => `<div class="meter"><span>${lab}</span><span class="g"><i style="width:${Math.max(0, Math.min(100, v))}%;background:${col}"></i></span><span>${txt}</span></div>`;
      const morCol = mor > 50 ? 'var(--ok)' : mor > 25 ? 'var(--warn)' : 'var(--bad)';
      let ammo = '';
      if (T.pila) ammo = `Pila : ${u.pila} volée${u.pila > 1 ? 's' : ''}`;
      if (T.missile) ammo = `${T.missile.kind === 'sling' ? 'Balles' : 'Javelots'} : ${Math.max(0, u.ammo).toFixed(1).replace('.', ',')} par homme`;
      const gen = u.gen ? `<div class="sub">${u.gen.name}${u.genState === 1 ? ' · blessé' : u.genState === 2 ? ' · tombé' : ''} · rayon d'autorité ${u.gen.aura} m</div>` : '';
      card.innerHTML = `${close}<h3>${u.name}</h3><div class="sub">${T.name} · ${u.side === 0 ? 'Rome' : 'Carthage'}${this.mine(u) ? '' : ' (ennemi)'}</div>${gen}
        <div class="st" style="color:${stCol}">${u.statusText()}</div>
        ${m('Effectif', (u.men / u.men0) * 100, 'var(--ink)', `<span class="num">${fmt(u.men)}</span>`)}
        ${m('Moral', mor, morCol, u.moraleText())}
        ${m('Fatigue', fat, fat > 60 ? 'var(--bad)' : 'var(--warn)', u.fatigueText())}
        ${m('Cohésion', u.coh * 100, 'var(--bronze)', `<span class="num">${Math.round(u.coh * 100)} %</span>`)}
        <div class="sub" style="margin:4px 0 0">${Math.round(u.files)} hommes de front sur ${Math.max(1, Math.round(u.ranks))} rangs${ammo ? ' · ' + ammo : ''}</div>
        <details><summary>Qui sont-ils ?</summary><p>${T.desc}</p></details>`;
    } else {
      const men = units.reduce((a, x) => a + x.men, 0), mor = units.reduce((a, x) => a + x.morale * x.men, 0) / Math.max(1, men);
      const eng = units.filter((x) => x.engaged).length, rt = units.filter((x) => x.routing).length;
      card.innerHTML = `${close}<h3>${units.length} unités</h3><div class="sub"><span class="num">${fmt(men)}</span> hommes · moral moyen ${Math.round(mor)}</div><div class="st">${eng ? eng + ' engagée' + (eng > 1 ? 's' : '') : 'Aucune engagée'}${rt ? ' · ' + rt + ' en déroute' : ''}</div>`;
    }
    const x = card.querySelector('[data-x]'); if (x) x.onclick = () => this.clearSel();
  }

  // ------------------------------------------------------- dépêches
  onEvent(e) {
    const p = this.app.player;
    const u = e.unit;
    if (e.kind === 'end') { setTimeout(() => this.showEnd(e.winner), 2500); }
    const a = this.app.audio;
    if (a.ctx) {
      const cam = this.app.camera.position;
      const d = u ? Math.hypot(u.x - cam.x, u.z - cam.z) : 0;
      if (e.kind === 'pila' && d < 500) a.volley(1 - d / 500);
      if (e.kind === 'horns') { a.horn('tuba', 0.6); setTimeout(() => a.horn('elephant', 0.45), 900); }
      if (e.kind === 'charge' && u && u.isEle && d < 900) a.horn('elephant', 0.4);
    }
    const important = ['plan', 'gen', 'surround', 'horns', 'end', 'trample', 'contact'].includes(e.kind)
      || (e.kind === 'rout' && u && !u.light && (u.men0 > 500 || u.isGen))
      || (e.kind === 'rally' && u && !u.light)
      || ((e.kind === 'flank' || e.kind === 'rear') && u && (u.side === p || u.men0 > 1500))
      || (e.kind === 'charge' && u && u.isCav);
    if (!important) return;
    if (e.kind === 'plan' && e.side !== p && p < 2 && e.unit === null && Math.random() < 0) return;
    this.feed(e);
  }
  feed(e) {
    const box = $('feed');
    const d = document.createElement('div');
    d.className = e.side === 0 ? 'r' : e.side === 1 ? 'c' : '';
    const t = e.t || 0;
    d.innerHTML = `<span class="tm">${Math.floor(t / 60)}′${String(Math.floor(t % 60)).padStart(2, '0')}</span>${e.text}`;
    if (e.unit) { d.style.pointerEvents = 'auto'; d.style.cursor = 'pointer'; d.onclick = () => this.focus([e.unit]); }
    box.prepend(d);
    while (box.children.length > (innerWidth < 760 ? 3 : 5)) box.lastChild.remove();
    setTimeout(() => { d.style.opacity = 0; setTimeout(() => d.remove(), 1100); }, 16000);
  }

  // ------------------------------------------------------------ bilan
  showEnd(w) {
    const b = this.app.battle, p = this.app.player, scn = b.scn;
    const rows = [0, 1].map((s) => {
      let pris = 0, fuite = b.sides[s].fled, ordre = 0;
      for (const u of b.units) {
        if (u.side !== s || u.state === ST.DEAD || u.state === ST.FLED) continue;
        if (u.routing) { if (u.trapped || u.nSides >= 2) pris += u.men; else fuite += u.men; }
        else ordre += u.men;
      }
      return { s, men0: b.sides[s].men0, killed: b.sides[s].killed, fuite, pris, ordre };
    });
    const title = p === 2 ? `${scn.sideNames[w]} l'emporte` : w === p ? 'Victoire' : 'Défaite';
    const mins = Math.round(b.t / 60);
    const hist = scn.hist;
    $('endBox').innerHTML = `<div class="cap" style="color:var(--bronze);font-size:12px">${scn.name} · ${scn.date} · ${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')} de combat</div>
      <h2>${title}</h2>
      <p>${w === 0 ? (scn.id === 'cannae' ? "Rome a brisé le piège d'Hannibal. L'histoire aurait changé de cours." : "Comme en 202 av. J.-C., Rome l'emporte : Carthage devra demander la paix.") : (scn.id === 'cannae' ? "Comme en 216 av. J.-C., l'armée romaine a été enveloppée. Le soir, Maharbal aurait dit à Hannibal : « Tu sais vaincre, Hannibal, mais tu ne sais pas profiter de ta victoire. »" : "Hannibal a renversé le cours de Zama. Carthage reste maîtresse de son destin.")}</p>
      <table class="tbl"><thead><tr><th></th><th>Engagés</th><th>Tués</th><th>Encerclés</th><th>En fuite</th><th>En ordre</th></tr></thead><tbody>
      ${rows.map((r) => `<tr><td style="font-family:var(--font-display);color:${r.s ? 'var(--carthage)' : 'var(--rome)'}">${scn.sideNames[r.s]}</td><td>${fmt(r.men0)}</td><td>${fmt(r.killed)}</td><td>${fmt(r.pris)}</td><td>${fmt(r.fuite)}</td><td>${fmt(r.ordre)}</td></tr>`).join('')}
      </tbody></table>
      <p class="hist"><b>Dans l'histoire :</b> ${hist.result} Rome : ${hist.rome} Carthage : ${hist.carth}</p>
      <div class="row2"><button class="primary" id="endWatch">Revoir le champ de bataille</button><button class="ghost" id="endAgain">Rejouer</button><button class="ghost" id="endMenu">Menu</button></div>`;
    $('endM').hidden = false;
    $('endWatch').onclick = () => { $('endM').hidden = true; };
    $('endAgain').onclick = () => { $('endM').hidden = true; this.app.start({ ...this.app.cfg }); };
    $('endMenu').onclick = () => { $('endM').hidden = true; this.showMenu(false); };
  }

  // ------------------------------------------------- boucle d'affichage
  update(rdt) {
    const app = this.app, b = app.battle; if (!b) return;
    const now = performance.now();
    if (now - this.lastHud > 250) {
      this.lastHud = now;
      const scn = b.scn, w = scn.wind;
      $('clockT').textContent = `${scn.name} · ${app.world.clockText()}`;
      $('windT').textContent = `${w.name}, ${w.speed} m/s`;
      $('wind').style.transform = `rotate(${((Math.atan2(w.x, -w.z) + app.cam.cur.yaw) * 180) / Math.PI}deg)`;
      $('elapsed').textContent = app.deploying ? 'avant la bataille' : `${Math.floor(b.t / 60)} min de combat`;
      const sc = b.sideCache || [b.sideState(0), b.sideState(1)];
      $('romeN').textContent = fmt(sc[0].active); $('carthN').textContent = fmt(sc[1].active);
      $('barR').style.width = `${(sc[0].active / sc[0].men0) * 50}%`; $('barC').style.width = `${(sc[1].active / sc[1].men0) * 50}%`;
      for (const g of this.groupDefs || []) { const n = g.us.filter((u) => u.active).length; g.chip.querySelector('b').textContent = n; }
      if (this.sel.size || this.inspect) {
        for (const u of [...this.sel]) if (!u.alive) this.sel.delete(u);
        if (this.inspect && !this.inspect.alive) this.inspect = null;
        if ($('unitbar').hidden === !!(this.sel.size || this.inspect)) this.updateCard(); else this.renderCard();
      }
    }
    if (now - this.lastLbl > 66) { this.lastLbl = now; this.updateLabels(); }
    if (now - this.lastMini > 200) { this.lastMini = now; this.drawMini(); }
  }
  updateLabels() {
    const app = this.app, b = app.battle, cam = app.camera.position;
    if (app.state !== 'battle' || !document.getElementById('menu').hidden) { for (const el of this.labels.values()) el.hidden = true; return; }
    const camH = cam.y - app.terrain.height(cam.x, cam.z);
    const showAll = this.overlay === 'on' || (this.overlay === 'auto' && camH > 380);
    const placed = [];
    const want = new Set();
    const list = b.units.filter((u) => u.alive && u.men >= 1).sort((a, c) => (this.sel.has(c) - this.sel.has(a)) || c.men - a.men);
    for (const u of list) {
      const sel = this.sel.has(u) || this.inspect === u;
      if (!sel && (!showAll || u.light && !u.routing)) continue;
      const p = this.project(u.x, u.y + (u.isCav ? 9 : 7), u.z);
      if (!p || p[0] < -50 || p[1] < -20 || p[0] > innerWidth + 50 || p[1] > innerHeight + 20) continue;
      if (!sel && placed.some(([x, y]) => Math.abs(x - p[0]) < 70 && Math.abs(y - p[1]) < 22)) continue;
      placed.push(p);
      want.add(u);
      let el = this.labels.get(u);
      if (!el) {
        el = document.createElement('div');
        el.className = 'lbl' + (u.side ? ' c' : '');
        el.innerHTML = `<span></span><i><b></b></i>`;
        $('labels').appendChild(el);
        this.labels.set(u, el);
      }
      el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px';
      el.classList.toggle('sel', sel); el.classList.toggle('rt', u.routing);
      const nm = camH > 1500 && !sel ? u.T.short : u.name;
      if (el.dataset.n !== nm) { el.firstChild.textContent = nm; el.dataset.n = nm; }
      const bb = el.lastChild.firstChild;
      bb.style.width = `${(u.men / u.men0) * 100}%`;
      bb.style.background = u.routing ? '#777' : u.morale > 50 ? 'var(--ok)' : u.morale > 25 ? 'var(--warn)' : 'var(--bad)';
      el.hidden = false;
    }
    for (const [u, el] of this.labels) if (!want.has(u)) el.hidden = true;
  }
  drawMini() {
    const app = this.app, b = app.battle, cv = $('miniC'), ctx = cv.getContext('2d');
    const S = cv.width, span = (this.miniSpan = 2200);
    const toPx = (x) => (x / span / 2 + 0.5) * S;
    if (!this.miniBg && app.world.groundCanvas) {
      const off = document.createElement('canvas'); off.width = off.height = S;
      const o = off.getContext('2d');
      const g = app.world.groundCanvas, k = g.width / (HALF * 2);
      const src = (HALF - span) * k;
      o.drawImage(g, src, src, span * 2 * k, span * 2 * k, 0, 0, S, S);
      o.fillStyle = 'rgba(10,9,8,0.25)'; o.fillRect(0, 0, S, S);
      this.miniBg = off;
    }
    if (this.miniBg) ctx.drawImage(this.miniBg, 0, 0); else { ctx.fillStyle = '#2a261f'; ctx.fillRect(0, 0, S, S); }
    for (const u of b.units) {
      if (!u.alive || u.men < 1) continue;
      ctx.save();
      ctx.translate(toPx(u.x), toPx(u.z));
      ctx.rotate(-u.th);
      const w = Math.max(3, (u.w / span / 2) * S), d = Math.max(2, (u.d / span / 2) * S);
      ctx.fillStyle = u.routing ? 'rgba(200,200,200,0.55)' : u.side === 0 ? '#d0453a' : '#a066c0';
      if (this.sel.has(u)) { ctx.strokeStyle = '#f0d9a0'; ctx.lineWidth = 3; ctx.strokeRect(-w / 2 - 1, -d / 2 - 1, w + 2, d + 2); }
      ctx.fillRect(-w / 2, -d / 2, w, d);
      ctx.restore();
    }
    // caméra
    const c = app.cam.cur;
    ctx.strokeStyle = '#f3e3c0'; ctx.lineWidth = 2.5;
    const cx = toPx(c.x), cz = toPx(c.z), r = Math.max(8, Math.min(60, (c.dist / span) * S * 0.5));
    ctx.beginPath();
    const a = -c.yaw;
    ctx.moveTo(cx, cz);
    ctx.lineTo(cx + Math.sin(a - 0.5) * r, cz - Math.cos(a - 0.5) * r);
    ctx.moveTo(cx, cz);
    ctx.lineTo(cx + Math.sin(a + 0.5) * r, cz - Math.cos(a + 0.5) * r);
    ctx.stroke();
  }
}
