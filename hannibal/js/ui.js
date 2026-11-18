/* Interface de commandement : menu, sélection, ordres, fiches, étiquettes, carte, dépêches, bilan. */
import * as THREE from 'three';
import { SCENARIOS, TYPES } from './data.js';
import { ST, FRONT } from './sim.js';
import { HALF } from './terrain.js';
import { STRATEGIES, advise } from './plans.js';
import { FACTIONS } from './campaign.js';
import { loadSave } from './campui.js';

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
  orbis: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  wall: '<path d="M4 20l6-16M10 20l6-16M16 20l4-11"/>',
  wedge: '<path d="M12 4l8 16H4z"/>',
  loose: '<circle cx="6" cy="6" r="1.5"/><circle cx="18" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/>',
  pila: '<path d="M3 21L17 7M17 7l4-4M14 6l4 4M8 21L21 8"/>',
  harangue: '<path d="M4 10v4h3l6 5V5L7 10zM16 8l4-3M16 12h5M16 16l4 3"/>',
  rally: '<path d="M6 21V4M6 4h11l-3 4 3 4H6"/>',
  horns: '<path d="M3 10c6 0 10-4 18-6v16c-8-2-12-6-18-6z"/>',
  release: '<path d="M4 12h12M12 6l6 6-6 6"/>',
  multi: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M14 17h6M17 14v6"/>',
};
export const TI = {
  legion: '<path d="M6 14a6 6 0 0 1 12 0v2H6z"/><path d="M12 8V3M9.5 4.5L12 3l2.5 1.5"/><path d="M8 16l-1 4M16 16l1 4"/>',
  spear: '<path d="M12 2l2.2 5h-4.4zM12 7v15"/><path d="M6.5 15a5.5 5.5 0 0 1 11 0"/>',
  javelin: '<path d="M4 20L18 6M18 6l-1 4M18 6l-4 1"/><circle cx="8" cy="9" r="3.5"/>',
  sling: '<path d="M5 4c6 4 8 8 7 16M12 20c1-6 3-10 7-12"/><circle cx="19" cy="7" r="1.6"/>',
  horse: '<path d="M7 21l1-6-3-3 4-7 5 1 4 3 2 5-3 1-2-2-2 2 1 6"/>',
  gen: '<path d="M4 9l4 3 4-6 4 6 4-3-2 9H6z"/>',
  oval: '<ellipse cx="12" cy="12" rx="5.5" ry="9"/><path d="M12 3v18"/>',
  sword: '<path d="M6 18c6-1 11-6 13-14-6 3-10 7-12 12zM5 19l2-2"/>',
  round: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/>',
  ele: '<path d="M4 15c0-6 4-9 9-9 4 0 7 3 7 7v6h-3v-4h-2v4h-3v-4H9c0 3-1 5-3 5"/><path d="M6 15c-2 1-2 4 0 5"/>',
};
export const ARCH_ICON = { hastatus: 'legion', princeps: 'legion', triarius: 'spear', veles: 'javelin', gaul: 'oval', iber: 'sword', libyan: 'legion', veteran: 'legion', ligur: 'oval', slinger: 'sling', lonch: 'javelin', carthcit: 'round', eques: 'horse', eques_socii: 'horse', ibercav: 'horse', numid: 'horse', carthcav: 'horse', gen_rom: 'gen', gen_carth: 'gen', elephant: 'ele' };
const tsvg = (u) => `<svg viewBox="0 0 24 24" aria-hidden="true">${TI[ARCH_ICON[u.T.arch]] || TI.legion}</svg>`;
const FORM = { normal: '', orbis: 'Orbis', cuneus: 'Coin', wall: 'Mur de lances', loose: 'Ordre lâche', tight: 'Ordre serré' };
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

const GROUPS = {
  cannae: {
    0: [[['velites'], 'Vélites'], [['hastati'], 'Hastati'], [['principes'], 'Principes'], [['triarii'], 'Triarii'], [['cavR'], 'Cav. romaine'], [['cavL'], 'Cav. alliée'], [['gen'], 'Consuls']],
    1: [[['light'], 'Légers'], [['center'], 'Gaulois et Ibères'], [['libL'], 'Libyens ouest'], [['libR'], 'Libyens est'], [['cavL', 'cavL2'], 'Hasdrubal'], [['cavR'], 'Numides'], [['gen', 'genCavL', 'genCavR'], 'Généraux']],
  },
  zama: {
    0: [[['velites'], 'Vélites'], [['hastati'], 'Hastati'], [['principes'], 'Principes'], [['triarii'], 'Triarii'], [['cavR', 'numInf'], 'Massinissa'], [['cavL'], 'Lélius'], [['gen', 'genCavL', 'genCavR'], 'Généraux']],
    1: [[['ele'], 'Éléphants'], [['light'], 'Frondeurs'], [['line1'], '1re ligne'], [['line2'], '2e ligne'], [['line3'], 'Vétérans'], [['cavR', 'cavL'], 'Cavalerie'], [['gen'], 'Hannibal']],
  },
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
    this.adv = { cd: {}, last: 0 };
    this.buildMenu();
    this.bindHud();
  }

  // ---------------------------------------------------------------- menu
  buildMenu() {
    const app = this.app;
    this.mode = this.mode || 'camp';
    for (const b of document.querySelectorAll('#menu .mode')) {
      b.classList.toggle('on', b.dataset.m === this.mode);
      b.setAttribute('aria-selected', b.dataset.m === this.mode);
      b.onclick = () => { this.mode = b.dataset.m; this.buildMenu(); if (this.mode === 'hist' && app.state === 'menu') app.preview(this.cfg.scn); };
    }
    const camp = this.mode === 'camp';
    $('campMenu').hidden = !camp; $('histMenu').hidden = camp; $('histGo').hidden = camp; $('sideOpt').hidden = camp;
    // ---- campagne
    this.cfg.fac = this.cfg.fac ?? 0;
    const FD = [
      { ds: "Tiens l'Italie face au plus grand général de l'Antiquité. Tes légions se relèvent de chaque défaite ; ta flotte domine la mer. Porte ensuite la guerre en Hispanie et en Afrique.", gen: 'Scipion, Fabius, Marcellus' },
      { ds: "Pars de Carthagène, franchis les Pyrénées et les Alpes, soulève les Gaulois et brise la confédération italienne avant que Rome ne lève de nouvelles légions.", gen: 'Hannibal, Hasdrubal, Magon' },
    ];
    $('facs').innerHTML = [0, 1].map((s) => `<button class="fac${this.cfg.fac === s ? ' on' : ''}" data-s="${s}" style="--fc:${FACTIONS[s].color}"><span class="emb"></span><b>${FACTIONS[s].name}</b><span class="ds">${FD[s].ds}</span><span class="gen">${FD[s].gen}</span></button>`).join('');
    for (const b of $('facs').querySelectorAll('.fac')) b.onclick = () => { this.cfg.fac = +b.dataset.s; this.buildMenu(); };
    const save = loadSave();
    const cont = $('campCont');
    cont.hidden = !save || app.camp && app.state === 'campaign';
    if (save) cont.textContent = `Continuer : ${FACTIONS[save.player].name}, ${save.turn % 2 ? 'hiver' : 'été'} ${218 - Math.floor(save.turn / 2)}`;
    cont.onclick = () => app.continueCampaign();
    $('campNew').onclick = () => app.newCampaign(this.cfg.fac);
    const res = $('campResume');
    res.hidden = !(app.camp && (app.state === 'campaign' || app.campBattle));
    res.textContent = app.campBattle ? 'Reprendre la bataille' : 'Reprendre la campagne';
    res.onclick = () => { $('menu').hidden = true; if (app.campBattle) app.resume(); };
    // ---- batailles historiques
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
      b.innerHTML = `<span class="nm">${s.name}</span><span class="dt">${s.date}</span><span class="ds">${s.place}. ${id === 'cannae' ? "Hannibal enveloppe une armée presque deux fois plus nombreuse que la sienne." : "Scipion affronte Hannibal et ses éléphants aux portes de Carthage."}</span><span class="vs"><span style="color:#d4554a">Rome ${fmt(r)}</span><span style="color:#a874c4">Carthage ${fmt(c)}${id === 'zama' ? ' et 80 éléphants' : ''}</span></span>`;
      b.onclick = () => { this.cfg.scn = id; this.buildMenu(); if (app.state === 'menu') app.preview(id); };
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
    $('scaleNote').textContent = camp ? `Batailles de campagne : une figurine pour ${this.cfg.scale} homme${this.cfg.scale > 1 ? 's' : ''}.` : this.cfg.scale === 1 ? `Chaque homme est représenté : ${fmt(total)} soldats. Pour un ordinateur puissant.` : `Une figurine pour ${this.cfg.scale} hommes : environ ${fmt(total / this.cfg.scale)} figurines.`;
    $('qualNote').textContent = { low: 'Pour téléphones et petits ordinateurs.', medium: 'Herbes 3D près de la caméra, nuages et rendu cinéma.', high: 'Relief deux fois plus fin, anticrénelage, halo, 90 000 touffes d\'herbe.', ultra: 'Rendu interne en 4K, 180 000 touffes d\'herbe, détail des soldats jusqu\'à 260 m. Carte graphique puissante conseillée.' }[this.cfg.quality];
    $('sideNote').textContent = this.cfg.side === 2 ? "L'ordinateur suit le plan historique des deux généraux." : `Tu commandes ${s.commanders[this.cfg.side]}. L'adversaire suit le plan historique.`;
    $('brief').innerHTML = `<b>${s.name}, ${s.date}.</b> ${s.brief[this.cfg.side]}`;
    $('startBtn').onclick = () => app.start({ ...this.cfg });
    const running = app.state === 'battle' && app.battle && !app.campBattle;
    $('startBtn').textContent = running ? 'Recommencer' : 'Prendre le commandement';
    let rb = $('resumeBtn');
    if (running && !rb) { rb = document.createElement('button'); rb.id = 'resumeBtn'; rb.className = 'ghost'; rb.textContent = 'Reprendre la bataille'; $('startBtn').after(rb); }
    if (rb) { rb.hidden = !running; rb.onclick = () => { $('menu').hidden = true; app.resume(); }; }
  }
  showMenu() {
    $('menu').hidden = false;
    this.buildMenu();
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
    $('menuBtn').onclick = () => { this.app.setSpeed(0); if (this.app.campBattle) this.fieldMenu(); else this.showMenu(true); };
    this.multi = false;
    this.adviceOn = true;
    $('advBtn').onclick = () => { this.adviceOn = !this.adviceOn; $('advBtn').classList.toggle('off', !this.adviceOn); this.adv.keys = ''; this.updateAdvice(); this.toast(this.adviceOn ? 'Conseiller activé.' : 'Conseiller désactivé.'); };
    $('mapBtn').onclick = (e) => { e.stopPropagation(); this.miniBig = !this.miniBig; $('mini').classList.toggle('big', this.miniBig); this.drawMini(); };
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
    else if (k === 'Tab' || k === 'KeyM') { e.preventDefault(); $('mapBtn').click(); }
    else if (k === 'KeyO') this.order('orbis');
    else if (k === 'KeyP') this.order('pila');
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
    const cols = b.scn.sideColors || ['#c0392b', '#8e4fa6'];
    document.documentElement.style.setProperty('--rome', cols[0]);
    document.documentElement.style.setProperty('--carthage', cols[1]);
    const nb = document.querySelectorAll('#forces b');
    nb[0].textContent = b.scn.sideNames[0]; nb[1].textContent = b.scn.sideNames[1];
    this.multi = false;
    this.buildCards();
    this.miniBg = null;
    this.adv = { cd: {}, shown: [], last: 0 };
    $('advice').innerHTML = ''; $('advice').hidden = true;
    b.listeners.push((e) => this.onEvent(e));
    if (app.player < 2) this.buildPlans(); else $('plans').innerHTML = '';
    this.updateCard();
  }

  // ------------------------------------------------- plans de bataille
  buildPlans() {
    const app = this.app, b = app.battle;
    const list = STRATEGIES[b.scn.id][app.player];
    const el = $('plans');
    const cur = app.strategy ? app.strategy.id : 'free';
    const card = (id, name, tag, desc, pros, cons) => `<div class="plan${id === cur ? ' on' : ''}" data-id="${id}">
      <div class="ph"><b>${name}</b>${tag ? `<span class="tag">${tag}</span>` : ''}</div>
      <p>${desc}</p>
      ${pros.length ? `<ul>${pros.map((x) => `<li class="pro">${x}</li>`).join('')}${cons.map((x) => `<li class="con">${x}</li>`).join('')}</ul>` : ''}
      <button class="${id === cur ? 'ghost' : 'primary'} sm" data-apply="${id}">${id === cur ? 'Plan choisi' : 'Appliquer'}</button></div>`;
    el.innerHTML = list.map((p) => card(p.id, p.name, p.tag, p.desc, p.pros, p.cons)).join('')
      + card('free', 'Commandement libre', '', "Déploiement historique, aucun plan : chaque unité attend tes ordres.", [], []);
    for (const btn of el.querySelectorAll('[data-apply]')) btn.onclick = () => {
      const id = btn.dataset.apply;
      app.applyStrategy(id === 'free' ? null : list.find((p) => p.id === id));
      this.buildPlans();
      this.toast(id === 'free' ? 'Commandement libre : tes unités attendent tes ordres.' : `Plan « ${list.find((p) => p.id === id).name} » : tes officiers l'exécuteront. Tu peux reprendre n'importe quelle unité à tout moment.`);
    };
  }

  // -------------------------------------------- conseiller du légat
  updateAdvice() {
    const app = this.app, b = app.battle, box = $('advice');
    if (app.player > 1 || app.deploying || b.over || !this.adviceOn) { box.hidden = true; return; }
    const list = advise(b, app.player).filter((a) => !((this.adv.cd[a.key] || -1) > b.t)).slice(0, innerWidth < 760 ? 1 : 2);
    const keys = list.map((a) => a.key).join('|');
    if (keys === this.adv.keys) return;
    this.adv.keys = keys; this.adv.list = list;
    box.hidden = !list.length;
    const who = app.player === 0 ? 'Le légat' : 'Ton officier';
    box.innerHTML = `<div class="ah">${who} propose</div>` + list.map((a, i) => `<div class="adv"><p data-f="${i}">${a.text}</p><div class="aa"><button class="primary sm" data-a="${i}">${a.label}</button><button class="ghost sm" data-x="${i}">Ignorer</button></div></div>`).join('');
    for (const el of box.querySelectorAll('[data-a]')) el.onclick = () => {
      const a = this.adv.list[+el.dataset.a]; if (!a) return;
      a.act(); this.adv.cd[a.key] = b.t + 90; this.adv.keys = '';
      this.feed({ text: `Ordre transmis : ${a.label.toLowerCase()}.`, side: app.player, t: b.t });
      this.sound('charge'); this.updateAdvice(); this.updateCard();
    };
    for (const el of box.querySelectorAll('[data-x]')) el.onclick = () => { const a = this.adv.list[+el.dataset.x]; if (a) this.adv.cd[a.key] = b.t + 150; this.adv.keys = ''; this.updateAdvice(); };
    for (const el of box.querySelectorAll('[data-f]')) el.onclick = () => { const a = this.adv.list[+el.dataset.f]; if (a) this.focus(a.units); };
  }
  // --------------------------------------- cartes d'unités (façon Total War)
  buildCards() {
    const b = this.app.battle, side = this.app.player, el = $('cards');
    el.innerHTML = '';
    this.cardEls = new Map();
    this.groupDefs = [];
    el.hidden = side > 1;
    if (side > 1) return;
    for (const [rs, label] of (b.scn.groups || GROUPS[b.scn.id])[side]) {
      const us = b.units.filter((u) => u.side === side && rs.includes(u.role));
      if (!us.length) continue;
      const sec = document.createElement('div'); sec.className = 'sec';
      const head = document.createElement('button'); head.className = 'sh'; head.textContent = label; head.title = 'Sélectionner le groupe (double-clic : y aller)';
      head.onclick = (ev) => {
        if (!ev.shiftKey) this.sel.clear();
        this.inspect = null;
        for (const u of us) if (u.alive && !u.routing) this.sel.add(u);
        if (head.dataset.last && performance.now() - head.dataset.last < 450) this.focus(us);
        head.dataset.last = performance.now();
        this.updateCard();
      };
      sec.appendChild(head);
      for (const u of us) {
        const c = document.createElement('button');
        c.className = 'uc' + (side ? ' c' : '');
        c.title = u.name;
        c.innerHTML = `${tsvg(u)}<span class="n num"></span><i class="hp"><b></b></i><i class="mo"><b></b></i><span class="fl"></span>`;
        c.onclick = (ev) => {
          const add = ev.shiftKey || ev.ctrlKey || this.multi;
          if (!add) this.sel.clear();
          if (this.sel.has(u) && add) this.sel.delete(u); else if (u.alive) this.sel.add(u);
          this.inspect = null;
          if (c.dataset.last && performance.now() - c.dataset.last < 450) this.focus([u]);
          c.dataset.last = performance.now();
          this.updateCard();
        };
        sec.appendChild(c);
        this.cardEls.set(u, c);
      }
      el.appendChild(sec);
      this.groupDefs.push({ chip: head, us });
    }
    this.updateCards();
  }
  updateCards() {
    if (!this.cardEls) return;
    for (const [u, c] of this.cardEls) {
      const dead = !u.alive || u.men < 1;
      c.classList.toggle('dead', dead);
      c.classList.toggle('sel', this.sel.has(u));
      c.classList.toggle('rt', u.routing);
      c.classList.toggle('eng', u.engaged && !u.routing);
      c.classList.toggle('man', u.manual && !!this.app.strategy);
      c.children[1].textContent = dead ? '✕' : u.men >= 1000 ? (u.men / 1000).toFixed(1).replace('.', ',') + 'k' : Math.round(u.men);
      c.children[2].firstChild.style.width = `${(u.men / u.men0) * 100}%`;
      const mo = c.children[3].firstChild;
      mo.style.width = `${Math.max(4, u.morale)}%`;
      mo.style.background = u.routing ? '#777' : u.morale > 50 ? 'var(--ok)' : u.morale > 25 ? 'var(--warn)' : 'var(--bad)';
      c.children[4].textContent = u.routing ? '⚑' : u.form !== 'normal' ? FORM[u.form][0] : u.nSides >= 2 ? '!' : '';
    }
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
      if (o.shift || o.ctrl || this.multi) { if (this.sel.has(u)) this.sel.delete(u); else this.sel.add(u); }
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
      else { p.u.manual = true; p.u.setFiles(p.files); p.u.command({ kind: 'move', x: p.x, z: p.z, th }); }
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
      else { u.manual = true; u.command({ kind: 'move', x: tx, z: tz, th: uth }); }
    }
    this.sound('move');
  }
  attack(units, t) {
    if (this.app.deploying) { this.toast("La bataille n'est pas encore engagée."); return; }
    for (const u of units) { u.manual = true; u.command({ kind: 'attack', target: t }); }
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
    const b = app.battle;
    if (kind === 'multi') { this.multi = !this.multi; this.toast(this.multi ? 'Sélection multiple : touche les unités à ajouter ou retirer.' : 'Sélection simple.'); this.updateCard(); return; }
    const passive = ['follow', 'rank', 'release', 'pila', 'harangue', 'rally', 'horns', 'fire', 'skirm'];
    if (!dep && !passive.includes(kind)) for (const u of units) u.manual = true;
    const form = (u, f) => { const ok = u.setForm(u.form === f ? 'normal' : f); if (ok && dep) app.place(u, u.x, u.z, u.th); return ok; };
    if (kind === 'horns') { if (!b.horns(app.player)) this.toast('Les trompettes viennent de sonner : attends un peu.'); this.updateCard(); return; }
    for (const u of units) {
      switch (kind) {
        case 'orbis': form(u, 'orbis'); break;
        case 'wall': form(u, 'wall'); break;
        case 'wedge': form(u, 'cuneus'); break;
        case 'loose': form(u, 'loose'); break;
        case 'release': u.manual = false; break;
        case 'pila': if (!b.throwPila(u) && units.length === 1) this.toast(u.pila > 0 ? 'Aucun ennemi à moins de 30 pas devant.' : 'Les pila ont déjà été lancés.'); break;
        case 'harangue': if (u.gen && !b.harangue(u)) this.toast(`${u.name} doit reprendre son souffle (${Math.ceil(u.cd.harangue || 0)} s).`); break;
        case 'rally': if (u.gen && !b.rally(u)) this.toast(`${u.name} ne peut pas encore rallier (${Math.ceil(u.cd.rally || 0)} s).`); break;
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
    const inf = units.filter((u) => u.T.cat === 'inf' && !u.T.light), cav = units.filter((u) => u.isCav && !u.isGen);
    if (inf.length) B.push(['orbis', 'Orbis', '', inf.every((u) => u.form === 'orbis')]);
    if (units.some((u) => u.T.spear)) B.push(['wall', 'Mur de lances', '', units.filter((u) => u.T.spear).every((u) => u.form === 'wall')]);
    if (units.some((u) => u.T.cat === 'inf')) B.push(['loose', 'Ordre lâche', '', units.filter((u) => u.T.cat === 'inf').every((u) => u.form === 'loose')]);
    if (cav.length) B.push(['wedge', 'Coin (cuneus)', '', cav.every((u) => u.form === 'cuneus')]);
    if (!dep && units.some((u) => u.pila > 0)) B.push(['pila', 'Lancer les pila']);
    const gens = units.filter((u) => u.gen && u.genState < 2);
    if (!dep && gens.length) {
      const g = gens[0];
      B.push(['harangue', (g.cd.harangue || 0) > 0 ? `Haranguer (${Math.ceil(g.cd.harangue)} s)` : 'Haranguer'], ['rally', (g.cd.rally || 0) > 0 ? `Rallier (${Math.ceil(g.cd.rally)} s)` : 'Rallier']);
      if (this.app.battle.units.some((e) => e.isEle && e.side !== this.app.player && e.active)) B.push(['horns', 'Trompettes']);
    }
    if (!dep && this.app.strategy && units.some((u) => u.manual)) B.push(['release', 'Rendre au plan']);
    B.push(['follow', 'Suivre']);
    if (units.length === 1 && !dep) B.push(['rank', 'Dans le rang']);
    if (this.app.touch) B.unshift(['multi', this.multi ? 'Plusieurs : oui' : 'Plusieurs', '', this.multi]);
    ord.innerHTML = B.map(([k, l, kb, on]) => `<button class="ord${on ? ' on' : ''}" data-o="${k}" title="${l}" aria-label="${l}">${svg(k)}<span class="l">${l}</span>${kb ? ` <kbd>${kb}</kbd>` : ''}</button>`).join('');
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
      const m = (lab, v, col, txt, cls = '') => `<div class="meter ${cls}"><span>${lab}</span><span class="g"><i style="width:${Math.max(0, Math.min(100, v))}%;background:${col}"></i></span><span>${txt}</span></div>`;
      const morCol = mor > 50 ? 'var(--ok)' : mor > 25 ? 'var(--warn)' : 'var(--bad)';
      let ammo = '';
      if (T.pila) ammo = `Pila : ${u.pila} volée${u.pila > 1 ? 's' : ''}`;
      if (T.missile) ammo = `${T.missile.kind === 'sling' ? 'Balles' : 'Javelots'} : ${Math.max(0, u.ammo).toFixed(1).replace('.', ',')} par homme`;
      const gen = u.gen ? `<div class="sub">${u.gen.name}${u.genState === 1 ? ' · blessé' : u.genState === 2 ? ' · tombé' : ''} · rayon d'autorité ${u.gen.aura} m</div>` : '';
      card.innerHTML = `${close}<h3>${u.name}</h3><div class="sub">${T.name} · ${this.app.battle.scn.sideNames[u.side]}${this.mine(u) ? '' : ' (ennemi)'}${u.def.xp ? ' · vétérans ' + '›'.repeat(u.def.xp) : ''}</div>${gen}
        <div class="st" style="color:${stCol}">${u.statusText()}</div>
        ${m('Effectif', (u.men / u.men0) * 100, 'var(--ink)', `<span class="num">${fmt(u.men)}</span>`)}
        ${m('Moral', mor, morCol, u.moraleText())}
        ${m('Fatigue', fat, fat > 60 ? 'var(--bad)' : 'var(--warn)', u.fatigueText(), 'mx')}
        ${m('Cohésion', u.coh * 100, 'var(--bronze)', `<span class="num">${Math.round(u.coh * 100)} %</span>`, 'mx')}
        <div class="sub" style="margin:4px 0 0">${u.form !== 'normal' ? FORM[u.form] + ' · ' : ''}${Math.round(u.files)} hommes de front sur ${Math.max(1, Math.round(u.ranks))} rangs${ammo ? ' · ' + ammo : ''}</div>
        ${this.mine(u) && this.app.strategy ? `<div class="sub" style="margin:2px 0 0;color:${u.manual ? 'var(--bronze)' : 'var(--muted)'}">${u.manual ? 'Sous tes ordres directs' : 'Suit le plan : ' + this.app.strategy.name}</div>` : ''}
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
    const important = ['plan', 'gen', 'surround', 'horns', 'end', 'trample', 'contact', 'ability'].includes(e.kind)
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
    if (scn.field) { this.fieldEnd(w); return; }
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

  // bilan d'une bataille de campagne
  lossRows() {
    const b = this.app.battle;
    return [0, 1].map((s) => {
      let pris = 0, fuite = b.sides[s].fled, ordre = 0;
      for (const u of b.units) {
        if (u.side !== s || u.state === ST.DEAD || u.state === ST.FLED) continue;
        if (u.routing) { if (u.trapped || u.nSides >= 2) pris += u.men; else fuite += u.men; }
        else ordre += u.men;
      }
      return { s, men0: b.sides[s].men0, killed: b.sides[s].killed, fuite, pris, ordre };
    });
  }
  fieldEnd(w) {
    const b = this.app.battle, p = this.app.player, scn = b.scn;
    const mins = Math.round(b.t / 60);
    const won = w === p;
    $('endBox').innerHTML = `<div class="cap" style="color:var(--bronze);font-size:12px">${scn.name} · ${scn.date} · ${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')} de combat</div>
      <h2>${won ? 'Victoire' : 'Défaite'}</h2>
      <p>${won ? "L'ennemi est rompu. Ta cavalerie poursuit les fuyards tant qu'il fait jour." : "Ton armée est rompue. Les survivants se replient vers la province voisine."}</p>
      ${this.lossTable(scn)}
      <div class="row2"><button class="primary" id="endCamp">Retour à la carte</button><button class="ghost" id="endWatch">Regarder la poursuite</button></div>`;
    $('endM').hidden = false;
    $('endCamp').onclick = () => { $('endM').hidden = true; this.app.endField(false); };
    $('endWatch').onclick = () => { $('endM').hidden = true; this.toast('Le menu (en haut à droite) ramène à la carte.'); };
  }
  lossTable(scn) {
    const rows = this.lossRows();
    return `<table class="tbl"><thead><tr><th></th><th>Engagés</th><th>Tués</th><th>Encerclés</th><th>En fuite</th><th>En ordre</th></tr></thead><tbody>
      ${rows.map((r) => `<tr><td style="font-family:var(--font-display);color:${r.s ? 'var(--carthage)' : 'var(--rome)'}">${scn.sideNames[r.s]}</td><td>${fmt(r.men0)}</td><td>${fmt(r.killed)}</td><td>${fmt(r.pris)}</td><td>${fmt(r.fuite)}</td><td>${fmt(r.ordre)}</td></tr>`).join('')}
      </tbody></table>`;
  }
  // menu pendant une bataille de campagne
  fieldMenu() {
    const app = this.app, b = app.battle, scn = b.scn;
    $('endBox').innerHTML = `<div class="cap" style="color:var(--bronze);font-size:12px">${scn.name} · ${scn.date}</div><h2>${b.over ? 'La bataille est jouée' : 'Bataille en cours'}</h2>
      ${this.lossTable(scn)}
      <div class="row2">${b.over ? '<button class="primary" data-f="map">Retour à la carte</button>' : `<button class="primary" data-f="resume">Reprendre</button><button class="ghost" data-f="auto">Laisser les officiers finir</button><button class="ghost" data-f="retreat">Sonner la retraite</button>`}<button class="ghost" data-f="menu">Menu principal</button></div>`;
    $('endM').hidden = false;
    for (const btn of $('endBox').querySelectorAll('[data-f]')) btn.onclick = () => {
      const f = btn.dataset.f;
      $('endM').hidden = true;
      if (f === 'resume') app.resume();
      if (f === 'map') app.endField(false);
      if (f === 'auto') app.autoFinish();
      if (f === 'retreat') app.endField(true);
      if (f === 'menu') this.showMenu();
    };
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
      this.updateCards();
      if (this.sel.size || this.inspect) {
        for (const u of [...this.sel]) if (!u.alive) this.sel.delete(u);
        if (this.inspect && !this.inspect.alive) this.inspect = null;
        if ($('unitbar').hidden === !!(this.sel.size || this.inspect)) this.updateCard(); else this.renderCard();
      }
    }
    if (now - this.lastLbl > 66) { this.lastLbl = now; this.updateLabels(); }
    if (now - this.lastMini > (this.miniBig ? 120 : 200)) { this.lastMini = now; this.drawMini(); }
    if (now - this.adv.last > 1500) { this.adv.last = now; this.updateAdvice(); }
  }
  // Bannières au-dessus des unités : symbole du type, effectif et moral
  updateLabels() {
    const app = this.app, b = app.battle, cam = app.camera.position;
    if (app.state !== 'battle' || !document.getElementById('menu').hidden) { for (const el of this.labels.values()) el.hidden = true; return; }
    const camH = cam.y - app.terrain.height(cam.x, cam.z);
    const showAll = this.overlay !== 'off' && camH > 45;
    const placed = [];
    const want = new Set();
    const list = b.units.filter((u) => u.alive && u.men >= 1).sort((a, c) => (this.sel.has(c) - this.sel.has(a)) || c.men - a.men);
    for (const u of list) {
      const sel = this.sel.has(u) || this.inspect === u;
      if (!sel && !showAll) continue;
      const p = this.project(u.x, u.y + (u.isCav ? 9 : 7), u.z);
      if (!p || p[0] < -50 || p[1] < -20 || p[0] > innerWidth + 50 || p[1] > innerHeight + 20) continue;
      if (!sel && placed.some(([x, y]) => Math.abs(x - p[0]) < 24 && Math.abs(y - p[1]) < 30)) continue;
      placed.push(p);
      want.add(u);
      let el = this.labels.get(u);
      if (!el) {
        el = document.createElement('div');
        el.className = 'bn' + (u.side ? ' c' : '');
        el.innerHTML = `<span class="fg">${tsvg(u)}</span><i class="hp"><b></b></i><i class="mo"><b></b></i><span class="nm"></span>`;
        $('labels').appendChild(el);
        this.labels.set(u, el);
      }
      el.style.transform = `translate(${p[0] - 12}px, ${p[1] - 40}px)`;
      el.classList.toggle('sel', sel); el.classList.toggle('rt', u.routing); el.classList.toggle('eng', u.engaged && !u.routing);
      const nm = sel || this.overlay === 'on' ? u.name : '';
      if (el.dataset.n !== nm) { el.lastChild.textContent = nm; el.dataset.n = nm; }
      el.children[1].firstChild.style.width = `${(u.men / u.men0) * 100}%`;
      const mo = el.children[2].firstChild;
      mo.style.width = `${Math.max(4, u.morale)}%`;
      mo.style.background = u.routing ? '#777' : u.morale > 50 ? 'var(--ok)' : u.morale > 25 ? 'var(--warn)' : 'var(--bad)';
      el.hidden = false;
    }
    for (const [u, el] of this.labels) if (!want.has(u)) el.hidden = true;
  }
  drawMini() {
    const app = this.app, b = app.battle, cv = $('miniC'), ctx = cv.getContext('2d');
    const want = this.miniBig ? 900 : 392;
    if (cv.width !== want) { cv.width = cv.height = want; this.miniBg = null; }
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
      ctx.fillStyle = u.routing ? 'rgba(200,200,200,0.55)' : (b.scn.sideColors ? b.scn.sideColors[u.side] : u.side === 0 ? '#d0453a' : '#a066c0');
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
