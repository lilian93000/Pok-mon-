/* Interface de la grande campagne : carte, armées, provinces, levées, batailles, tours.
   Pensée d'abord pour le doigt : gros boutons, panneaux en bas d'écran, marqueurs de destination. */
import { TYPES } from './data.js';
import { Campaign, PROVINCES, PROV, FACTIONS, CU, MAX_UNITS, ROME, CARTHAGE, FREE, S_NAME, fmtNum, TURNS, ADJ } from './campaign.js';
import { TI, ARCH_ICON } from './ui.js';

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const SAVE = 'hannibal-campagne-v1';
const fmt = fmtNum;
const icon = (type) => `<svg viewBox="0 0 24 24" aria-hidden="true">${TI[ARCH_ICON[TYPES[type].arch]] || TI.legion}</svg>`;
const stars = (n) => '★'.repeat(n) + '<span class="off">' + '★'.repeat(5 - n) + '</span>';
const IC = {
  attack: '<path d="M5 19L19 5M14 5h5v5M5 14l5 5M3 21l3-3"/>',
  move: '<path d="M4 12h14M13 6l6 6-6 6"/>',
  sea: '<path d="M3 17c2 2 4 2 6 0s4-2 6 0 4 2 6 0M12 3v10M12 3l6 8H6z"/>',
  siege: '<path d="M4 20V9l4-3 4 3 4-3 4 3v11zM9 20v-5h6v5"/>',
  end: '<path d="M7 3h10M7 21h10M8 3c0 6 8 6 8 9s-8 3-8 9M16 3c0 6-8 6-8 9"/>',
  log: '<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  recruit: '<path d="M12 5v14M5 12h14"/>',
  merge: '<path d="M6 4v6a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6V4M12 16v5"/>',
  center: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M9 9.5c0-1 1.3-1.8 3-1.8s3 .8 3 1.8-1.3 1.6-3 2-3 1-3 2 1.3 1.8 3 1.8 3-.8 3-1.8M12 6v12"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
const CULT = { latin: 'Latins', italic: 'Italiques', greek: 'Grecs', sard: 'Sardes et Corses', punic: 'Puniques', libyan: 'Libyens', iber: 'Ibères', balear: 'Baléares', gaul: 'Gaulois', ligur: 'Ligures', numid: 'Numides', maur: 'Maures' };
const WALLS = ['Bourgade sans murs', 'Ville murée', 'Grande ville fortifiée', 'Capitale aux murs imprenables'];

export function loadSave() { try { const s = localStorage.getItem(SAVE); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
export function clearSave() { try { localStorage.removeItem(SAVE); } catch (e) { /* stockage indisponible */ } }

export class CampaignUI {
  constructor(app) {
    this.app = app;
    this.c = null;
    this.sel = null; this.selProv = null;
    this.cityEls = {}; this.armyEls = new Map(); this.markEls = [];
    this.phase = 'player';
    this.busy = false;
    this.lastLbl = 0;
    $('cEnd').onclick = () => this.endTurn();
    $('cLogBtn').onclick = () => { const l = $('cLog'); l.hidden = !l.hidden; if (!l.hidden) this.renderLog(); };
    $('cMenuBtn').onclick = () => this.app.showMainMenu();
    $('cHelpBtn').onclick = () => this.help();
    $('cSoundBtn').onclick = () => { const a = this.app.audio; if (!a.ctx) { a.start(); a.setMuted(false); } else a.setMuted(!a.muted); $('cSoundBtn').classList.toggle('off', a.muted); };
    $('cModal').addEventListener('click', (e) => { if (e.target === $('cModal') && this.modalClose) this.modalClose(); });
  }

  // ------------------------------------------------------------ ouverture
  open(c) {
    this.c = c;
    $('camp').hidden = false;
    this.buildLabels();
    this.refresh(false);
    this.updateTop();
    if (!this.focused) { this.focused = true; this.focusOn(this.c.player === ROME ? 'roma' : 'cartnova', innerWidth < 900 ? 820 : 1150); }
  }
  close() {
    $('camp').hidden = true;
    $('cLabels').innerHTML = '';
    this.cityEls = {}; this.armyEls.clear(); this.markEls = [];
  }
  save() { try { localStorage.setItem(SAVE, JSON.stringify(this.c.toJSON())); } catch (e) { /* plein ou interdit */ } }

  // ---------------------------------------------------------- étiquettes
  buildLabels() {
    const box = $('cLabels');
    box.innerHTML = '';
    this.cityEls = {}; this.armyEls.clear(); this.markEls = [];
    for (const p of PROVINCES) {
      const el = document.createElement('button');
      el.className = 'clbl w' + p.walls;
      el.innerHTML = `<i></i><span>${p.city}</span>`;
      el.onclick = (e) => { e.stopPropagation(); this.tapProvince(p.id, true); };
      box.appendChild(el);
      this.cityEls[p.id] = el;
    }
  }
  syncArmyLabels() {
    const box = $('cLabels'), c = this.c;
    const alive = new Set(c.armies.map((a) => a.id));
    for (const [id, el] of this.armyEls) if (!alive.has(id)) { el.remove(); this.armyEls.delete(id); }
    for (const a of c.armies) {
      let el = this.armyEls.get(a.id);
      if (!el) {
        el = document.createElement('button');
        el.className = 'abadge';
        el.onclick = (e) => { e.stopPropagation(); this.tapArmy(a.id); };
        box.appendChild(el);
        this.armyEls.set(a.id, el);
      }
      const mine = a.side === c.player;
      const sieging = c.siege[a.prov] && c.siege[a.prov].army === a.id;
      el.style.setProperty('--fc', FACTIONS[a.side].color);
      el.classList.toggle('mine', mine);
      el.classList.toggle('sel', this.sel === a.id);
      el.classList.toggle('done', mine && a.mp <= 0);
      el.innerHTML = `<b>${a.gen.short}</b><span class="num">${a.units.length}</span>${sieging ? svg('siege') : ''}${mine ? `<i class="mp">${'<s></s>'.repeat(Math.max(0, a.mp))}</i>` : ''}`;
      el.title = `${a.gen.name} · ${a.units.length} unités · ${fmt(c.men(a.units))} hommes`;
    }
    for (const p of PROVINCES) {
      const el = this.cityEls[p.id];
      el.style.setProperty('--fc', FACTIONS[c.owner[p.id]].color);
      el.classList.toggle('sieged', !!c.siege[p.id]);
      el.classList.toggle('mine', c.owner[p.id] === c.player);
    }
  }
  updateLabels() {
    const app = this.app, cam = app.camera, map = app.cmap;
    if ($('camp').hidden || !this.c || !Object.keys(this.cityEls).length) return;
    const W = innerWidth, H = innerHeight;
    const dist = app.cam.cur.dist;
    const small = dist > (innerWidth < 900 ? 1000 : 1500);
    const place = (el, v, dy, hideFar) => {
      const p = app.ui.project(v.x, v.y + dy, v.z);
      if (!p || p[0] < -60 || p[1] < -30 || p[0] > W + 60 || p[1] > H + 30 || (hideFar && small)) { el.style.visibility = 'hidden'; return; }
      el.style.visibility = '';
      el.style.transform = `translate(${p[0]}px, ${p[1]}px)`;
    };
    // priorité : marqueurs, armées, capitales, grandes villes ; on masque ce qui se chevauche
    const boxes = [];
    const free = (x, y, w, h) => { for (const b of boxes) if (Math.abs(b[0] - x) < (b[2] + w) / 2 && Math.abs(b[1] - y) < (b[3] + h) / 2) return false; boxes.push([x, y, w, h]); return true; };
    const put = (el, v, dy, w, h, oy, force) => {
      const p = app.ui.project(v.x, v.y + dy, v.z);
      if (!p || p[0] < -60 || p[1] < -30 || p[0] > W + 60 || p[1] > H + 30 || (!force && !free(p[0], p[1] + oy, w, h))) { el.style.visibility = 'hidden'; return; }
      el.style.visibility = '';
      el.style.transform = `translate(${p[0]}px, ${p[1]}px)`;
    };
    for (const m of this.markEls) put(m.el, m.pos, 6, 46, 58, 6, true);
    for (const a of this.c.armies) {
      const el = this.armyEls.get(a.id), t = map.tokens.get(a.id);
      if (el && t) put(el, t.gr.position, 22, el.offsetWidth || 80, 22, -11, a.id === this.sel);
    }
    const order = PROVINCES.slice().sort((a, b) => b.walls - a.walls || (this.c.owner[b.id] === this.c.player) - (this.c.owner[a.id] === this.c.player));
    const marked = new Set(this.markEls.map((m) => m.prov));
    for (const p of order) {
      const el = this.cityEls[p.id];
      if (marked.has(p.id)) { el.style.visibility = 'hidden'; continue; }
      if (small && p.walls < 2 && p.id !== this.selProv) { el.style.visibility = 'hidden'; continue; }
      put(el, map.cityPos[p.id], -3, el.offsetWidth || 70, 20, 14, p.id === this.selProv);
    }
    void cam;
  }

  // -------------------------------------------------------------- toucher
  onTap(x, y) {
    if (this.busy || !$('cModal').hidden) return;
    const app = this.app, c = this.c;
    const a = app.cmap.armyAtScreen(c, x, y, (px, py, pz) => app.ui.project(px, py, pz));
    if (a) { this.tapArmy(a.id); return; }
    const g = app.cam.ground(x, y);
    const pid = g ? app.cmap.provinceAt(g.x, g.z) : null;
    if (pid) this.tapProvince(pid);
    else this.clearSel();
  }
  tapArmy(id) {
    const c = this.c, a = c.army(id);
    if (!a || this.busy) return;
    const sel = this.sel ? c.army(this.sel) : null;
    // une armée ennemie touchée alors qu'une des miennes peut l'atteindre : attaque
    if (sel && a.side !== c.player && sel.side === c.player && sel.prov !== a.prov) {
      const opt = c.options(sel).find((o) => o.prov === a.prov);
      if (opt) { this.move(sel, a.prov); return; }
    }
    // fusion : toucher une autre de mes armées dans la même province
    this.sel = id; this.selProv = null;
    this.showArmy(a);
    this.refresh(false);
  }
  tapProvince(pid, info) {
    const c = this.c;
    if (this.busy) return;
    const sel = this.sel ? c.army(this.sel) : null;
    if (!info && sel && sel.side === c.player && sel.prov !== pid) {
      const opt = c.options(sel).find((o) => o.prov === pid);
      if (opt) { this.move(sel, pid); return; }
    }
    this.sel = null; this.selProv = pid;
    this.showProv(pid);
    this.refresh(false);
  }
  clearSel() {
    this.sel = null; this.selProv = null;
    $('cPanel').hidden = true;
    this.refresh(false);
  }
  focusOn(pid, dist) {
    const p = this.app.cmap.cityPos[pid], cam = this.app.cam;
    cam.follow = null;
    cam.target.x = p.x; cam.target.z = p.z + 60;
    if (dist) cam.dist = dist;
  }

  // ---------------------------------------------------------- affichage
  refresh(animate = true) {
    const c = this.c, map = this.app.cmap;
    const hl = {};
    const sel = this.sel ? c.army(this.sel) : null;
    this.markEls.forEach((m) => m.el.remove());
    this.markEls = [];
    if (sel && sel.side === c.player && !this.busy) {
      for (const o of c.options(sel)) {
        hl[o.prov] = o.attack ? 2 : o.sea ? 3 : 1;
        const el = document.createElement('button');
        const kind = o.attack ? 'attack' : o.sea ? 'sea' : 'move';
        el.className = 'cmark ' + kind;
        el.innerHTML = svg(kind) + `<span>${PROV[o.prov].city}</span>`;
        el.title = (o.attack ? 'Attaquer ' : o.sea ? 'Traverser la mer vers ' : 'Marcher sur ') + PROV[o.prov].city + (o.pass === 'alpes' ? ' (passage des Alpes)' : '');
        el.onclick = (e) => { e.stopPropagation(); this.move(sel, o.prov); };
        $('cLabels').appendChild(el);
        const cp = map.cityPos[o.prov];
        // le marqueur se place entre la ville et l'armée, un peu du côté de la ville
        const t = map.tokens.get(sel.id);
        const fx = t ? t.gr.position.x : cp.x, fz = t ? t.gr.position.z : cp.z;
        const k = 0.78;
        const pos = { x: fx + (cp.x - fx) * k, y: cp.y, z: fz + (cp.z - fz) * k };
        pos.y = map.height(pos.x, pos.z);
        this.markEls.push({ el, pos, prov: o.prov });
      }
    }
    if (sel && sel.side !== c.player) hl[sel.prov] = 2;
    map.sel = this.sel;
    map.paint(c.owner, hl, this.selProv || (sel ? sel.prov : null));
    map.syncArmies(c, animate);
    this.syncArmyLabels();
    this.updateTop();
    this.updateLabels();
  }
  updateTop() {
    const c = this.c, f = FACTIONS[c.player], fin = c.finance(c.player);
    $('cFac').style.setProperty('--fc', f.color);
    $('cFacN').textContent = f.name;
    $('cDate').textContent = `${c.dateText} · tour ${c.turn + 1}/${TURNS}`;
    $('cGold').innerHTML = `${svg('coin')}<b class="num">${fmt(c.gold[c.player])}</b><span class="num ${fin.net >= 0 ? 'ok' : 'bad'}">${fin.net >= 0 ? '+' : '−'}${fmt(Math.abs(fin.net))}</span>`;
    $('cGold').title = `Revenus ${fmt(fin.inc)} · solde des troupes ${fmt(fin.up)} par tour`;
    const idle = c.armies.filter((a) => a.side === c.player && a.mp > 0).length;
    $('cEnd').innerHTML = this.busy ? `${svg('end')}<span>L'ennemi joue…</span>` : `${svg('end')}<span>Fin du tour</span>${idle ? `<small>${idle} armée${idle > 1 ? 's' : ''} peu${idle > 1 ? 'vent' : 't'} encore marcher</small>` : ''}`;
    $('cEnd').disabled = this.busy || !!c.over;
  }

  // ---------------------------------------------------------- panneaux
  showArmy(a) {
    const c = this.c, mine = a.side === c.player, p = PROV[a.prov];
    const panel = $('cPanel');
    panel.hidden = false;
    const men = c.men(a.units);
    const sieging = c.siege[a.prov] && c.siege[a.prov].army === a.id ? c.siege[a.prov] : null;
    const others = c.armies.filter((x) => x !== a && x.side === a.side && x.prov === a.prov);
    const canRec = mine && c.owner[a.prov] === c.player && c.recruitList(a.prov).length && !c.siege[a.prov];
    const acts = [];
    if (canRec) acts.push(`<button class="cact" data-act="recruit">${svg('recruit')}Lever des troupes <small>${c.maxSlots(a.prov) - c.slots[a.prov]} restante${c.maxSlots(a.prov) - c.slots[a.prov] > 1 ? 's' : ''}</small></button>`);
    if (mine && others.length) acts.push(`<button class="cact" data-act="merge">${svg('merge')}Réunir avec ${others[0].gen.short}</button>`);
    if (mine && sieging) acts.push(`<button class="cact warn" data-act="assault">${svg('siege')}Donner l'assaut</button>`);
    acts.push(`<button class="cact" data-act="center">${svg('center')}Centrer</button>`);
    panel.innerHTML = `
      <div class="cph"><span class="emb" style="--fc:${FACTIONS[a.side].color}"></span>
        <div class="cpt"><b>${a.gen.name}</b> <span class="stars" title="Commandement ${a.gen.cmd} sur 5">${stars(a.gen.cmd)}</span>
        <div class="sub">${FACTIONS[a.side].name} · ${p.name} · ${a.units.length}/${MAX_UNITS} unités · <span class="num">${fmt(men)}</span> hommes${mine ? ` · ${a.mp > 0 ? `${a.mp} mouvement${a.mp > 1 ? 's' : ''}` : 'a marché'}` : ''}</div>
        ${sieging ? `<div class="sub warn">Siège de ${p.city} : ${sieging.t}/${sieging.need} saisons · garnison ${fmt(c.men(c.garrison[a.prov]))} hommes</div>` : ''}
        ${a.gen.bio ? `<div class="sub bio">${a.gen.bio}</div>` : ''}</div>
        <button class="cx" data-x aria-label="Fermer">${svg('close')}</button></div>
      <div class="cunits">${a.units.map((u, i) => this.unitCard(u, i, a.side)).join('')}</div>
      <div class="cacts">${acts.join('')}</div>
      ${mine && a.mp > 0 ? '<div class="hint">Touche une province en surbrillance (ou un marqueur) pour y marcher. Rouge : attaque.</div>' : ''}
      <div id="cSub"></div>`;
    this.bindPanel(a);
  }
  unitCard(u, i, side) {
    const T = TYPES[u.type];
    return `<button class="cu${side ? ' c' : ''}" data-u="${i}" style="--fc:${FACTIONS[side].color}" title="${T.name}">${icon(u.type)}<span class="n num">${u.men >= 1000 ? (u.men / 1000).toFixed(1).replace('.', ',') + 'k' : u.men}</span><i><b style="width:${Math.round((u.men / u.max) * 100)}%"></b></i>${u.xp ? `<span class="xp">${'›'.repeat(u.xp)}</span>` : ''}</button>`;
  }
  bindPanel(a) {
    const panel = $('cPanel'), c = this.c;
    const x = panel.querySelector('[data-x]'); if (x) x.onclick = () => this.clearSel();
    for (const b of panel.querySelectorAll('[data-u]')) b.onclick = () => this.unitInfo(a, +b.dataset.u);
    for (const b of panel.querySelectorAll('[data-act]')) b.onclick = () => {
      const k = b.dataset.act;
      if (k === 'center') this.focusOn(a.prov);
      if (k === 'recruit') this.recruitList(a.prov, a);
      if (k === 'merge') { const o = c.armies.find((y) => y !== a && y.side === a.side && y.prov === a.prov); if (o) { c.merge(a, o); this.after(); this.showArmy(a); } }
      if (k === 'assault') this.assault(a);
    };
  }
  unitInfo(a, i) {
    const u = a.units[i]; if (!u) return;
    const T = TYPES[u.type], mine = a.side === this.c.player;
    $('cSub').innerHTML = `<div class="csub"><div class="cph">${icon(u.type)}<div class="cpt"><b>${T.name}</b><div class="sub"><span class="num">${fmt(u.men)}</span> / ${fmt(u.max)} hommes · solde ${CU[u.type].up} par tour${u.xp ? ` · expérience ${u.xp}` : ''}</div></div></div><p>${T.desc}</p>${mine && a.units.length > 1 ? '<button class="ghost sm" data-dis>Renvoyer cette unité</button>' : ''}</div>`;
    const d = $('cSub').querySelector('[data-dis]');
    if (d) d.onclick = () => { this.c.disband(a, i); this.after(); this.showArmy(a); };
  }
  recruitList(pid, army) {
    const c = this.c, list = c.recruitList(pid);
    const left = c.maxSlots(pid) - c.slots[pid];
    const box = $('cSub');
    box.innerHTML = `<div class="csub"><div class="sub">Levées possibles à ${PROV[pid].city} ce tour-ci : <b>${left}</b>. Trésor : <b class="num">${fmt(c.gold[c.player])}</b>.</div><div class="crec">${list.map((t) => {
      const err = c.canRecruit(pid, t) || (army && army.units.length >= MAX_UNITS ? 'Armée complète (20 unités).' : '');
      return `<button class="crb" data-t="${t}" ${err ? `disabled title="${err}"` : ''}>${icon(t)}<span><b>${TYPES[t].name}</b><small>${fmt(CU[t].men)} hommes · solde ${CU[t].up}</small></span><span class="cost num">${fmt(CU[t].cost)}</span></button>`;
    }).join('')}</div></div>`;
    for (const b of box.querySelectorAll('[data-t]')) b.onclick = () => {
      const r = c.recruit(pid, b.dataset.t, army && army.prov === pid && army.units.length < MAX_UNITS ? army.id : null);
      if (r.err) { this.toast(r.err); return; }
      this.after();
      this.app.audio.ctx && this.app.audio.horn(c.player === ROME ? 'cornu' : 'carnyx', 0.25);
      if (army) { this.showArmy(c.army(r.army.id)); this.recruitList(pid, c.army(r.army.id)); }
      else { this.showProv(pid); this.recruitList(pid, null); }
    };
  }
  showProv(pid) {
    const c = this.c, p = PROV[pid], o = c.owner[pid], mine = o === c.player;
    const panel = $('cPanel');
    panel.hidden = false;
    const g = c.garrison[pid];
    const armies = c.armies.filter((a) => a.prov === pid);
    const s = c.siege[pid];
    const neigh = ADJ[pid].map((q) => PROV[q].city).join(', ');
    panel.innerHTML = `
      <div class="cph"><span class="emb" style="--fc:${FACTIONS[o].color}"></span>
        <div class="cpt"><b>${p.city}</b> · ${p.name}
        <div class="sub">${S_NAME(o, p)} · ${CULT[p.cult]} · revenu <span class="num">${fmt(p.inc)}</span> par tour · ${WALLS[p.walls]}${p.port ? ' · port' : ''}</div>
        ${s ? `<div class="sub warn">Assiégée par ${c.army(s.army) ? c.army(s.army).gen.short : 'l\'ennemi'} : ${s.t}/${s.need} saisons</div>` : ''}
        <div class="sub">Voisins : ${neigh}</div></div>
        <button class="cx" data-x aria-label="Fermer">${svg('close')}</button></div>
      <div class="sub">Garnison : <span class="num">${fmt(c.men(g))}</span> hommes</div>
      <div class="cunits">${g.map((u, i) => this.unitCard(u, i, o)).join('') || '<span class="sub">aucune</span>'}</div>
      ${armies.length ? `<div class="cacts">${armies.map((a) => `<button class="cact" data-army="${a.id}" style="--fc:${FACTIONS[a.side].color}"><span class="dot"></span>${a.gen.short} · ${a.units.length} unités</button>`).join('')}</div>` : ''}
      ${mine && c.recruitList(pid).length && !s ? `<div class="cacts"><button class="cact" data-act="recruit">${svg('recruit')}Lever des troupes <small>${c.maxSlots(pid) - c.slots[pid]} restante(s)</small></button></div>` : ''}
      <div id="cSub"></div>`;
    panel.querySelector('[data-x]').onclick = () => this.clearSel();
    for (const b of panel.querySelectorAll('[data-army]')) b.onclick = () => this.tapArmy(+b.dataset.army);
    const r = panel.querySelector('[data-act="recruit"]');
    if (r) r.onclick = () => this.recruitList(pid, c.armiesIn(pid, c.player).find((a) => a.units.length < MAX_UNITS) || null);
  }

  // ------------------------------------------------------------- actions
  async move(a, pid) {
    const c = this.c;
    if (this.busy) return;
    const res = c.move(a, pid);
    if (res.err) { this.toast(res.err); return; }
    this.sound(res.battle ? 'charge' : 'move');
    this.refresh(true);
    for (const e of res.events) this.toast(e, 7000);
    if (res.destroyed) { this.toast('L\'armée a péri en route.'); this.sel = null; }
    if (res.captured) this.toast(`${PROV[pid].city} est à nous !`);
    if (res.siege) this.toast(`Siège de ${PROV[pid].city} : la ville tombera par la faim, ou par un assaut.`, 6000);
    this.after();
    if (c.army(a.id)) this.showArmy(c.army(a.id));
    await this.showMessages();
    if (res.battle) {
      this.busy = true; this.refresh(false);
      await wait(650);
      await this.battleFlow(res.battle);
    }
  }
  async assault(a) {
    const c = this.c, s = c.siege[a.prov]; if (!s) return;
    const bt = c.makeBattle(a.prov, a, [], true); bt.assault = true;
    const p = c.odds(bt);
    const ok = await this.confirm('Donner l\'assaut', `Les murs de ${PROV[a.prov].city} multiplient la force des défenseurs. Chances estimées : ${Math.round(p * 100)} %. Un assaut se résout automatiquement ; attendre affame la garnison.`, 'À l\'assaut !');
    if (!ok) return;
    const res = c.assault(a);
    this.after();
    await this.resultModal(res, bt);
  }
  after() {
    this.refresh(false);
    this.save();
    if (this.c.over) this.overModal();
  }

  // ------------------------------------------------------------- batailles
  // le joueur choisit : bataille en 3D, résolution automatique ou retraite
  async battleFlow(bt) {
    const c = this.c;
    bt = c.refresh(bt);
    if (!bt) { this.busy = false; this.after(); return this.continueFlow(); }
    this.focusOn(bt.prov, 700);
    this.refresh(false);
    const choice = await this.battleModal(bt);
    if (choice === 'fight') { this.save(); this.app.fieldBattle(bt); return; }
    if (choice === 'auto') { const res = c.autoresolve(bt); this.after(); await this.resultModal(res, bt); }
    else if (choice === 'retreat') { c.withdraw(bt, c.player); this.after(); }
    return this.continueFlow();
  }
  // retour d'une bataille jouée en 3D
  async afterField(res, bt) {
    this.busy = true;
    this.refresh(false);
    this.save();
    await this.resultModal(res, bt);
    return this.continueFlow();
  }
  async continueFlow() {
    const c = this.c;
    if (this.phase === 'ai') {
      if (c.pending.length) return this.battleFlow(c.pending.shift());
      this.phase = 'player';
      c.finishPending();
      this.newTurn();
      return;
    }
    this.busy = false;
    this.after();
    if (this.sel && c.army(this.sel)) this.showArmy(c.army(this.sel));
    await this.showMessages();
  }
  async endTurn() {
    const c = this.c;
    if (this.busy || c.over) return;
    this.busy = true; this.sel = null; this.selProv = null;
    $('cPanel').hidden = true;
    this.refresh(false);
    await wait(60);
    this.phase = 'ai';
    const before = c.turn;
    c.endTurn();
    this.refresh(true);
    await wait(900);
    if (c.pending.length) return this.battleFlow(c.pending.shift());
    this.phase = 'player';
    if (c.turn === before && !c.over) c.finishPending();
    this.newTurn();
  }
  async newTurn() {
    const c = this.c;
    this.busy = false;
    this.after();
    // ce qui s'est passé pendant le tour ennemi
    const recent = c.log.filter((l) => l.turn >= c.turn - 1 && l.side !== c.player && (l.kind === 'battle' || l.kind === 'capture' || l.kind === 'siege')).slice(-3);
    this.toast(`${c.dateText}. Trésor : ${fmt(c.gold[c.player])}.`, 5000);
    for (const l of recent) this.toast(l.text, 8000);
    if (c.over) return;
    await this.showMessages();
  }
  battleModal(bt) {
    const c = this.c, p = PROV[bt.prov];
    const [A, D] = c.forces(bt);
    const me = bt.att === c.player ? A : D, foe = me === A ? D : A;
    const pa = c.odds(bt), pm = me === A ? pa : 1 - pa;
    const side = (S) => {
      const men = S.units.reduce((s, x) => s + x.u.men, 0);
      const cat = {};
      for (const x of S.units) { const k = TYPES[x.u.type].arch; cat[x.u.type] = (cat[x.u.type] || 0) + 1; void k; }
      return `<div class="bside" style="--fc:${FACTIONS[S.side].color}"><span class="emb"></span><b>${S_NAME(S.side, p)}</b>
        <div>${S.gen ? `${S.gen.name} <span class="stars">${stars(S.gen.cmd)}</span>` : 'la garnison'}</div>
        <div class="num big">${fmt(men)}</div><div class="sub">${S.units.length} unités</div>
        <div class="bic">${Object.entries(cat).map(([t, n]) => `<span title="${TYPES[t].name}">${icon(t)}${n > 1 ? `<b>${n}</b>` : ''}</span>`).join('')}</div></div>`;
    };
    const verdict = pm > 0.68 ? 'Très favorable' : pm > 0.56 ? 'Favorable' : pm > 0.44 ? 'Équilibré' : pm > 0.32 ? 'Défavorable' : 'Très défavorable';
    const TER = { plain: 'plaine', hills: 'collines', river: 'vallée et fleuve', arid: 'terres arides', cannae: "plaine de l'Aufide, près de Cannes", zama: "plaine d'Afrique" };
    const title = bt.att === c.player ? `Tu attaques en ${p.name}` : `${A.gen ? A.gen.short : S_NAME(bt.att, p)} t'attaque en ${p.name}`;
    return this.modal(`<div class="cap" style="color:var(--bronze);font-size:12px">Bataille · ${c.dateText}</div><h2>${title}</h2>
      <div class="bvs">${side(A)}<div class="bmid">contre</div>${side(D)}</div>
      <div class="odds"><i style="width:${Math.round(pm * 100)}%;background:${FACTIONS[c.player].color}"></i></div>
      <p class="sub">Rapport des forces : <b>${verdict}</b> (${Math.round(pm * 100)} %). Terrain : ${TER[p.ter] || p.ter}. ${c.winter ? 'Hiver : sol boueux, vent froid.' : 'Été : poussière et chaleur.'}</p>
      <div class="row2"><button class="primary" data-r="fight">Livrer bataille en 3D</button><button class="ghost" data-r="auto">Résolution automatique</button><button class="ghost" data-r="retreat">${bt.att === c.player ? 'Renoncer' : 'Se replier'}</button></div>`, 'retreat');
  }
  resultModal(res, bt) {
    const c = this.c, won = res.winner === c.player, p = PROV[res.prov];
    this.sound(won ? 'charge' : 'move');
    return this.modal(`<div class="cap" style="color:var(--bronze);font-size:12px">${p.name} · ${c.dateText}</div><h2>${won ? 'Victoire' : 'Défaite'}</h2>
      <p>${res.text}</p>${res.events.map((e) => `<p class="sub">${e}</p>`).join('')}
      ${res.captured ? `<p><b>${p.city}</b> change de mains.</p>` : ''}${res.siege ? `<p>Les survivants s'enferment dans ${p.city} : le siège commence.</p>` : ''}
      <div class="row2"><button class="primary" data-r="ok">Continuer</button></div>`, 'ok');
  }
  async showMessages() {
    const c = this.c;
    while (c.messages.length) {
      const m = c.messages.shift();
      await this.modal(`<div class="cap" style="color:var(--bronze);font-size:12px">${c.dateText}</div><h2>${m.title}</h2><p>${m.text}${m.cities ? ` (${m.cities.join(', ')})` : ''}</p>${m.quote ? `<p class="hist">${m.quote}</p>` : ''}<div class="row2"><button class="primary" data-r="ok">Continuer</button></div>`, 'ok');
    }
    if (c.over) this.overModal();
  }
  overModal() {
    const c = this.c;
    if (this.overShown) return; this.overShown = true;
    const won = c.over.winner === c.player, st = c.stats, s = c.player;
    this.modal(`<div class="cap" style="color:var(--bronze);font-size:12px">${c.dateText}</div><h2>${won ? 'Victoire' : 'Défaite'}</h2><p>${c.over.why}</p>
      <table class="tbl"><tbody><tr><td>Batailles livrées</td><td>${st.battles[s]}</td></tr><tr><td>Victoires</td><td>${st.won[s]}</td></tr><tr><td>Ennemis tués</td><td>${fmt(st.killed[s])}</td></tr><tr><td>Hommes perdus</td><td>${fmt(st.lost[s])}</td></tr><tr><td>Provinces</td><td>${c.provsOf(s).length}</td></tr></tbody></table>
      <p class="hist">Dans l'histoire, Rome tint bon malgré Cannes, porta la guerre en Hispanie puis en Afrique, et Scipion battit Hannibal à Zama en 202 av. J.-C.</p>
      <div class="row2"><button class="primary" data-r="new">Nouvelle campagne</button><button class="ghost" data-r="map">Voir la carte</button><button class="ghost" data-r="menu">Menu</button></div>`, 'map').then((r) => {
      if (r === 'new') { clearSave(); this.app.newCampaign(c.player); }
      if (r === 'menu') this.app.showMainMenu();
    });
  }
  help() {
    this.modal(`<h2>La campagne</h2>
      <div class="keys"><kbd>Toucher une armée</kbd><span>La choisir : ses destinations s'allument (or : marche, rouge : attaque, bleu : traversée).</span>
      <kbd>Toucher une destination</kbd><span>Y marcher. Deux mouvements par tour en été, un seul en hiver.</span>
      <kbd>Toucher une ville</kbd><span>Sa province : revenus, garnison, levées.</span>
      <kbd>Glisser · pincer</kbd><span>Déplacer et zoomer la carte, tourner à deux doigts.</span></div>
      <p>Chaque ville lève des troupes selon son peuple : légions dans le Latium, Libyens et éléphants en Afrique, Ibères et cavaliers en Hispanie, Gaulois dans la plaine du Pô. Chaque unité coûte une solde à chaque tour : un trésor vide fait déserter les troupes.</p>
      <p>Entrer dans une province ennemie : combat contre son armée, siège d'une ville fortifiée (elle tombe par la faim ou par l'assaut), ou prise d'une bourgade. Les batailles se jouent en 3D ou se résolvent automatiquement.</p>
      <p class="hist">Rome gagne en prenant Carthage. Carthage gagne en prenant Rome, ou en détachant de Rome neuf provinces d'Italie. Fin en 202 av. J.-C.</p>
      <div class="row2"><button class="primary" data-r="ok">Compris</button></div>`, 'ok');
  }
  renderLog() {
    const c = this.c;
    $('cLog').innerHTML = `<div class="ah">Chronique</div>` + c.log.slice(-30).reverse().map((l) => `<div class="cl ${l.side === 0 ? 'r' : l.side === 1 ? 'c' : ''}"><span class="tm">${START(l.turn)}</span>${l.text}</div>`).join('');
  }

  // ------------------------------------------------------------ fenêtres
  modal(html, dflt) {
    return new Promise((resolve) => {
      const m = $('cModal');
      $('cModalBox').innerHTML = html;
      m.hidden = false;
      const done = (v) => { m.hidden = true; this.modalClose = null; resolve(v); };
      this.modalClose = () => done(dflt);
      for (const b of $('cModalBox').querySelectorAll('[data-r]')) b.onclick = () => done(b.dataset.r);
    });
  }
  confirm(title, text, yes) {
    return this.modal(`<h2>${title}</h2><p>${text}</p><div class="row2"><button class="primary" data-r="y">${yes}</button><button class="ghost" data-r="n">Annuler</button></div>`, 'n').then((r) => r === 'y');
  }
  toast(text, ms = 4500) {
    const box = $('cToast');
    const d = document.createElement('div');
    d.textContent = text;
    box.prepend(d);
    while (box.children.length > (innerHeight < 500 ? 2 : 4)) box.lastChild.remove();
    setTimeout(() => { d.style.opacity = 0; setTimeout(() => d.remove(), 900); }, ms);
  }
  sound(kind) {
    const a = this.app.audio; if (!a.ctx) return;
    a.horn(kind === 'charge' ? (this.c.player === ROME ? 'tuba' : 'carnyx') : 'cornu', 0.3);
  }

  update() {
    const now = performance.now();
    if (now - this.lastLbl > 33) { this.lastLbl = now; this.updateLabels(); }
  }
}
const START = (t) => `${218 - Math.floor(t / 2)}${t % 2 ? ' h' : ' é'}`;
export { Campaign, CARTHAGE, FREE };
