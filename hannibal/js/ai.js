/* Commandement automatique.
   - Réflexes communs à toutes les unités (faire face à une attaque de flanc, tirailleurs
     qui se replient, cavalerie qui poursuit les fuyards).
   - Plans historiques : Hannibal et Varron à Cannes, Hannibal et Scipion à Zama.
   Le joueur garde la main sur ses unités ; seuls les réflexes s'appliquent aux siennes. */
import { FRONT, RIGHT, REAR, LEFT } from './sim.js';
import { clamp } from './noise.js';
import { doctrine, strategyById } from './plans.js';

const HALFPI = Math.PI / 2;

export class Commander {
  constructor(b, side, plan, auto = false) {
    this.b = b; this.side = side; this.plan = plan; this.auto = auto; // auto = réflexes seulement (joueur)
    this.t = 0; this.next = 0; this.mem = {};
    this.home = side === 0 ? -1 : 1; // direction de l'arrière (z)
  }
  get mine() { return this.b.units.filter((u) => u.side === this.side && u.alive); }
  get foes() { return this.b.units.filter((u) => u.side !== this.side && u.alive); }
  role(r) { return this.mine.filter((u) => u.role === r); }
  say(text, u) { this.b.emit('plan', text, u || null, { side: this.side }); }

  update(dt) {
    this.t += dt;
    if (this.t < this.next) return;
    this.next = this.t + 0.5;
    const us = this.mine;
    if (this.plan) {
      this.b.aiSide = this.side;
      try {
        if (this.plan.startsWith('doc:')) doctrine(this, us, strategyById(this.b.scn.id, this.plan.slice(4)));
        else PLANS[this.plan](this, us);
      } finally { this.b.aiSide = -1; }
    }
    if ((!this.auto || this.plan) && this.t > 1200) this.exploit(us.filter((u) => !u.manual));
    for (const u of us) this.reflex(u);
  }

  // ------------------------------------------------------------ réflexes
  // unité tenue par le joueur (et non par ses officiers)
  pc(u) { return this.auto && (u.manual || !this.plan); }
  setPlan(p) { this.plan = p; this.mem = {}; for (const u of this.mine) { u.ai = {}; } }
  reflex(u) {
    if (u.routing || u.turnT > 0 || u.form === 'orbis' || u.form === 'wall') return;
    // faire face à une attaque de flanc ou de dos si l'avant est libre
    if (!u.isCav && u.eS[FRONT] === 0 && u.engaged && (this.pc(u) ? u.order.kind === 'hold' || u.order.kind === 'advance' || u.order.kind === 'attack' : true)) {
      let best = -1, bl = 8;
      for (const s of [RIGHT, REAR, LEFT]) if (u.eS[s] > bl) { bl = u.eS[s]; best = s; }
      const serious = u.contacts.some((k) => k.side === best && !k.o.light && !k.o.routing);
      if (best >= 0 && serious) {
        u.ai.turned = this.t;
        u.command({ kind: 'turn', dth: best === RIGHT ? -HALFPI : best === LEFT ? HALFPI : Math.PI });
        return;
      }
    }
    // cavalerie prise de flanc : elle pivote librement
    if (u.isCav && u.engaged && u.eS[FRONT] === 0 && !this.pc(u)) {
      const c = u.contacts[0];
      if (c) u.command({ kind: 'attack', target: c.o });
    }
    // tirailleurs : se replier si l'ennemi approche
    if (u.skirmish && !u.engaged && (u.light || u.T.skirmisher)) {
      const threat = this.threat(u);
      if (threat) {
        const away = Math.atan2(u.x - threat.x, u.z - threat.z);
        const d = u.isCav ? 120 : 80;
        let tx = u.x + Math.sin(away) * d, tz = u.z + Math.cos(away) * d;
        if (!u.isCav) { tz = u.z + this.home * 140; tx = u.x; }
        if (u.order.kind !== 'move' || !u.order.evade) u.command({ kind: 'move', x: tx, z: tz, run: true, evade: true });
        return;
      }
      if (u.order.evade && (u.order.kind !== 'move' || Math.hypot(u.order.x - u.x, u.order.z - u.z) < 8)) {
        u.command({ kind: 'hold', th: this.faceFoe(u) });
      }
    }
    // unités IA au repos : engager l'ennemi proche
    if (!this.pc(u) && u.order.kind === 'hold' && !u.engaged && !u.isGen && !u.ai.noEngage) {
      const r = u.isCav ? 110 : u.light ? 0 : 35;
      if (r > 0) {
        const e = this.nearestFoe(u, (e) => !e.isGen && (!e.routing || u.isCav || Math.hypot(e.x - u.x, e.z - u.z) < u.rad + e.rad + 60), r + 40);
        if (e && (!u.T.skirmisher || e.routing)) u.command({ kind: 'attack', target: e });
      }
    }
  }
  // fin de bataille : les unités inactives vont chercher l'ennemi encore debout
  exploit(us) {
    for (const u of us) {
      if (!u.active || u.isGen || u.engaged || u.turnT > 0) continue;
      if (u.order.kind !== 'hold' && !(u.order.kind === 'attack' && (!u.order.target || !u.order.target.alive || (u.order.target.routing && !u.isCav)))) continue;
      if (u.light && u.ammo > 0.5) continue;
      const e = this.nearestFoe(u, (e) => !e.isGen && (e.active || (u.isCav && e.routing)), u.isCav ? 2500 : 1500);
      if (e) u.command({ kind: 'attack', target: e });
    }
  }
  threat(u) {
    const M = u.T.missile;
    const lim = u.isCav ? 55 : Math.max(30, (M ? M.range : 30) * 0.45);
    let best = null, bd = Infinity;
    for (const e of this.foes) {
      if (!e.active || e.light || e.isGen) continue;
      if (u.isCav && !e.isCav && !e.isEle) continue;
      const d = u.distTo(e);
      const l = e.isCav ? lim * 1.8 : lim;
      if (d < l && d < bd) { bd = d; best = e; }
    }
    return best;
  }
  faceFoe(u) {
    const e = this.nearestFoe(u, (e) => e.active, 3000);
    return e ? Math.atan2(e.x - u.x, e.z - u.z) : u.th;
  }
  nearestFoe(u, f, maxD = Infinity) {
    let best = null, bd = maxD;
    for (const e of this.foes) {
      if (f && !f(e)) continue;
      const d = Math.hypot(e.x - u.x, e.z - u.z) - e.rad - u.rad;
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }
  // attaquer par l'arrière : passer d'abord par un point derrière la cible
  attackRear(u, t) {
    const [vx, vz] = t.world(0, -t.hd - 70);
    u.command({ kind: 'attack', target: t, via: [vx, vz] });
  }
  // une unité d'infanterie sans contact : reprendre le combat de façon cohérente
  reengage(u, th0, files0) {
    if (u.engaged || u.turnT > 0 || u.routing) return;
    const o = u.order;
    if (o.kind === 'attack' && o.target && (!o.target.active || (o.target.routing && !u.isCav))) { u.command({ kind: 'hold' }); return; }
    if (o.kind === 'advance') {
      const f = this.b.frontEnemy(u, 40);
      const want = !!f && u.pila === 0;
      if (want !== !!o.run) u.command({ kind: 'advance', run: want });
      if (this.ahead(u, 450)) return;
    } else if (o.kind !== 'hold') return;
    const e = this.nearestFoe(u, (e) => e.active && !e.light && !e.isGen, 200);
    if (e) {
      const d = angDiff(u.th, Math.atan2(e.x - u.x, e.z - u.z));
      if (Math.abs(d) > 1.0 && !u.isCav) { u.command({ kind: 'turn', dth: snap(d) }); return; }
      u.command({ kind: 'attack', target: e });
      return;
    }
    const d0 = angDiff(u.th, th0);
    if (Math.abs(d0) > 1.2) { u.command({ kind: 'turn', dth: snap(d0) }); return; }
    if (Math.abs(d0) > 0.1) { u.command({ kind: 'hold', th: th0 }); return; }
    if (files0 && u.files < files0 * 0.75) u.setFiles(files0);
    u.command({ kind: 'advance' });
  }
  ahead(u, dist) {
    for (const e of this.foes) {
      if (!e.active || e.isGen) continue;
      const [lx, lz] = u.local(e.x, e.z);
      if (lz > 0 && Math.abs(Math.atan2(lx, lz)) < 0.8 && Math.hypot(lx, lz) < dist + e.rad) return true;
    }
    return false;
  }
  follow(gen, anchor, back = 70, side = 0) {
    if (!anchor || !anchor.alive) return;
    const [x, z] = anchor.world(side, -anchor.hd - back);
    if (Math.hypot(gen.x - x, gen.z - z) > 25) gen.command({ kind: 'move', x, z, th: anchor.th });
  }
  generals(us, anchors) {
    for (const g of us) {
      if (!g.isGen || g.routing) continue;
      const danger = this.nearestFoe(g, (e) => e.active && !e.isGen, 70);
      if (danger) {
        const a = Math.atan2(g.x - danger.x, g.z - danger.z);
        g.command({ kind: 'move', x: g.x + Math.sin(a) * 120, z: g.z + Math.cos(a) * 120, run: true });
        continue;
      }
      const anc = anchors[g.name];
      if (anc) this.follow(g, typeof anc === 'function' ? anc() : anc, 60);
    }
  }
}

function snap(d) {
  if (d > 0) return d < 2.3 ? HALFPI : Math.PI;
  return d > -2.3 ? -HALFPI : Math.PI;
}
function angDiff(a, b) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}
function activeOf(arr) { return arr.filter((u) => u.active); }
function centroid(arr) {
  let x = 0, z = 0;
  for (const u of arr) { x += u.x; z += u.z; }
  return arr.length ? [x / arr.length, z / arr.length] : [0, 0];
}

/* ===================================================================== */
const PLANS = {
  // --------------------------------------------------- Hannibal à Cannes
  hannibal_cannae(c, us) {
    const m = c.mem, b = c.b;
    const rome = c.foes;
    const romanHeavy = rome.filter((u) => u.heavyInf && u.active);
    const center = us.filter((u) => u.role === 'center');
    const light = us.filter((u) => u.role === 'light');
    const libL = us.filter((u) => u.role === 'libL'), libR = us.filter((u) => u.role === 'libR');
    const cav = us.filter((u) => u.role === 'cavL' || u.role === 'cavL2');
    const numid = us.filter((u) => u.role === 'cavR');
    if (!m.init) {
      m.init = 1; m.cavStage = 0; m.lib = 0; m.numStage = 0;
      for (const u of light) { u.command({ kind: 'move', x: u.x, z: u.z - 95, th: Math.PI }); u.ai.noEngage = true; }
      for (const u of center) u.ai.noEngage = true;
      for (const u of [...libL, ...libR]) u.ai.noEngage = true;
      for (const u of numid) u.ai.noEngage = true;
      c.say("Hannibal fait avancer les frondeurs baléares et les javeliniers.");
    }
    // écran léger : se replier derrière le croissant à l'approche des légions
    for (const u of light) {
      if (u.ai.back) continue;
      const near = c.nearestFoe(u, (e) => e.heavyInf && e.active, 70);
      if (near || u.ammo <= 0.3) {
        u.ai.back = 1;
        u.command({ kind: 'move', x: u.x * 0.8, z: 560, run: true, th: Math.PI });
        u.flags.pass = true;
        if (!m.lightBack) { m.lightBack = 1; c.say("Les troupes légères se replient à travers le croissant."); }
      }
    }
    // centre : le croissant attend, puis cède pas à pas en restant face à l'ennemi
    for (const u of center) {
      if (!u.active) continue;
      const zyield = 330 + 120 * (1 - (u.x / 560) ** 2);
      const fz = u.frontZ();
      if (u.engaged && u.eS[FRONT] > 0 && fz < zyield && u.morale > 18) {
        if (u.order.kind !== 'withdraw') u.command({ kind: 'withdraw', speed: 0.14 });
        if (!m.yield) { m.yield = 1; m.yieldT = c.t; c.say("Au centre, Gaulois et Ibères cèdent du terrain : le croissant se creuse."); }
      } else if (u.order.kind === 'withdraw' && (fz >= zyield || !u.engaged)) {
        u.command({ kind: 'hold', th: Math.PI });
      }
    }
    // Libyens : pivoter quand les Romains se sont enfoncés entre les deux ailes
    if (m.lib === 0 && m.yield) {
      const libFront = 262;
      const deep = romanHeavy.filter((r) => r.frontZ() > libFront - 25 && Math.abs(r.x) < 640).length;
      if ((deep >= 3 && m.cavStage >= 2) || c.t - m.yieldT > 330 || (deep >= 6 && c.t - m.yieldT > 120)) {
        m.lib = 1; m.libT = c.t;
        c.say("Hannibal donne le signal : les Libyens font face vers l'intérieur.");
        for (const u of libL) u.command({ kind: 'turn', dth: -HALFPI }); // face à l'est
        for (const u of libR) u.command({ kind: 'turn', dth: HALFPI }); // face à l'ouest
      }
    }
    if (m.lib === 1 && c.t - m.libT > 8) { m.lib = 2; c.say("Les Libyens se referment sur les flancs des légions."); }
    if (m.lib === 2) {
      for (const u of [...libL, ...libR]) {
        if (!u.active || u.engaged || u.turnT > 0) continue;
        if (u.order.kind === 'attack' && u.order.target && u.order.target.active) continue;
        let t = null, bs = Infinity;
        for (const e of romanHeavy) {
          const d = Math.hypot(e.x - u.x, e.z - u.z);
          if (d > 700) continue;
          const s = d * (e.eS[FRONT] > 0 ? 0.6 : 1);
          if (s < bs) { bs = s; t = e; }
        }
        if (!t) { if (u.order.kind !== 'hold') u.command({ kind: 'hold' }); continue; }
        const [lx] = t.local(u.x, u.z);
        const sgn = lx < 0 ? -1 : 1;
        u.command({ kind: 'attack', target: t, via: t.world(sgn * (t.hw + u.hd + 25), 0) });
      }
    }
    // cavalerie lourde d'Hasdrubal
    const romCavR = rome.filter((u) => u.role === 'cavR' && u.active);
    const romCavL = rome.filter((u) => u.role === 'cavL' && u.active);
    if (m.cavStage === 0) {
      for (const u of cav) {
        if (!u.active) continue;
        if (u.role === 'cavL2' && c.t < 25) continue;
        const t = c.nearestFoe(u, (e) => e.role === 'cavR' && e.active) || c.nearestFoe(u, (e) => e.isCav && e.active);
        if (t && (u.order.kind !== 'attack' || u.order.target !== t)) u.command({ kind: 'attack', target: t });
      }
      if (!m.cavSaid) { m.cavSaid = 1; c.say("Hasdrubal lance la cavalerie lourde le long de l'Aufide."); }
      const cavLeft = romCavR.filter((e) => e.men > e.men0 * 0.3);
      if (cavLeft.length === 0 && c.t > 30) { m.cavStage = 1; m.cavT = c.t; c.say("La cavalerie romaine est balayée. Hasdrubal rallie ses escadrons."); }
    } else if (m.cavStage === 1) {
      // poursuite brève puis ralliement derrière les lignes romaines
      for (const u of cav) {
        if (!u.active) continue;
        if (c.t - m.cavT < 45) {
          const r = c.nearestFoe(u, (e) => e.routing && e.isCav, 350);
          if (r) { if (u.order.target !== r) u.command({ kind: 'attack', target: r }); continue; }
        }
      }
      if (c.t - m.cavT >= 45) {
        m.cavStage = 2;
        const rear = Math.min(...rome.filter((u) => u.heavyInf).map((u) => u.z - u.hd), -400) - 170;
        m.rearZ = rear;
        cav.forEach((u, i) => u.command({ kind: 'move', x: -300 + i * 70, z: rear - i * 30, th: HALFPI }));
        c.say("Hasdrubal fait le tour de l'armée romaine par l'arrière.");
      }
    } else if (m.cavStage === 2) {
      // traverser derrière l'armée romaine vers la cavalerie alliée
      const arrived = cav.filter((u) => u.active && Math.abs(u.x - (-300)) < 300 && Math.abs(u.z - m.rearZ) < 160).length;
      if (arrived >= Math.max(1, activeOf(cav).length - 1) || c.t - m.cavT > 140) {
        m.cavStage = 3;
        const tgt = romCavL[0];
        for (const u of cav) {
          if (!u.active) continue;
          const t = c.nearestFoe(u, (e) => e.role === 'cavL' && e.active);
          if (t) c.attackRear(u, t);
        }
        if (tgt) c.say("La cavalerie d'Hasdrubal tombe sur le dos des cavaliers alliés de Varron.");
      }
    } else if (m.cavStage === 3) {
      if (romCavL.length === 0) {
        m.cavStage = 4;
        c.say("Plus de cavalerie romaine : Hasdrubal charge les légions dans le dos.");
      } else {
        for (const u of cav) {
          if (!u.active || u.order.kind === 'attack') continue;
          const t = c.nearestFoe(u, (e) => e.role === 'cavL' && e.active);
          if (t) c.attackRear(u, t);
        }
      }
    } else if (m.cavStage === 4) {
      for (const u of cav) {
        if (!u.active) continue;
        const cur = u.order.kind === 'attack' ? u.order.target : null;
        if (cur && cur.alive) {
          // ne jamais charger de face une infanterie en garde : se dérober
          const [, lz] = cur.local(u.x, u.z);
          const braced = cur.heavyInf && !cur.routing && cur.eS[FRONT] === 0 && lz > 0;
          if (!braced && (cur.active || cur.routing)) continue;
        }
        const r = c.nearestFoe(u, (e) => e.routing, 260);
        if (r) { u.command({ kind: 'attack', target: r }); continue; }
        let best = null, bs = Infinity;
        for (const e of rome) {
          if (!e.heavyInf || !e.active || e.eS[REAR] > 0) continue;
          const [, lz] = e.local(u.x, u.z);
          const exposed = e.eS[FRONT] > 0 || lz < -e.hd;
          if (!exposed) continue;
          const s = Math.hypot(e.x - u.x, e.z - u.z) * (e.eS[FRONT] > 0 ? 0.5 : 1);
          if (s < bs) { bs = s; best = e; }
        }
        if (best) c.attackRear(u, best);
        else {
          const e = c.nearestFoe(u, (e) => e.heavyInf && e.active, 1500);
          if (e) { const [x, z] = e.world(0, -e.hd - 140); u.command({ kind: 'move', x, z, th: e.th }); }
        }
      }
    }
    // Numides : harceler la cavalerie alliée, puis l'achever quand Hasdrubal arrive
    const allyEngaged = romCavL.some((e) => e.engaged);
    for (const u of numid) {
      if (!u.active) continue;
      if (m.cavStage >= 3 && (allyEngaged || romCavL.length === 0)) {
        u.skirmish = false;
        if (u.order.kind === 'attack' && u.order.target && u.order.target.alive) continue;
        const t = c.nearestFoe(u, (e) => e.isCav && (e.active || e.routing), 800) || c.nearestFoe(u, (e) => e.routing, 700);
        if (t) u.command({ kind: 'attack', target: t });
        if (!m.numSaid) { m.numSaid = 1; c.say("Les Numides se jettent sur les cavaliers alliés et poursuivent les fuyards."); }
      } else {
        // harcèlement : rester à portée de javelot
        const t = c.nearestFoe(u, (e) => e.role === 'cavL' && e.active);
        if (!t || u.order.evade) continue;
        const d = u.distTo(t);
        if (d > 32) {
          const p = t.nearest(u.x, u.z);
          const a = Math.atan2(u.x - p[0], u.z - p[1]);
          u.command({ kind: 'move', x: p[0] + Math.sin(a) * 24, z: p[1] + Math.cos(a) * 24, th: a + Math.PI });
        }
      }
    }
    c.generals(us, {
      Hannibal: () => center.find((u) => u.def.ci === 4 && u.alive) || center.find((u) => u.alive),
      Magon: () => center.find((u) => u.def.ci === 7 && u.alive) || center.find((u) => u.alive),
      Hasdrubal: () => cav.find((u) => u.active),
      Hannon: () => numid.find((u) => u.active),
    });
  },

  // ---------------------------------------------- Varron et Paul-Émile à Cannes
  varro_cannae(c, us) {
    const m = c.mem;
    const vel = us.filter((u) => u.role === 'velites');
    const hast = us.filter((u) => u.role === 'hastati');
    const princ = us.filter((u) => u.role === 'principes');
    const tri = us.filter((u) => u.role === 'triarii');
    const cavR = us.filter((u) => u.role === 'cavR'), cavL = us.filter((u) => u.role === 'cavL');
    if (!m.init) {
      m.init = 1;
      for (const u of vel) u.command({ kind: 'move', x: u.x, z: u.z + 95, th: 0 });
      for (const u of [...cavR, ...cavL]) u.ai.home = [u.x, u.z];
      c.say("Les vélites s'avancent pour engager l'écran ennemi.");
    }
    // vélites : se replier derrière les triaires quand les lignes lourdes approchent
    for (const u of vel) {
      if (u.ai.back) continue;
      const foe = c.nearestFoe(u, (e) => e.heavyInf && e.active, 60);
      const h = hast.find((h) => Math.abs(h.x - u.x) < 120);
      const close = h && c.nearestFoe(h, (e) => e.heavyInf && e.active, 110);
      if (foe || close || u.ammo <= 0.3) {
        u.ai.back = 1;
        u.command({ kind: 'move', x: u.x, z: -560, run: true, th: 0 });
      }
    }
    // marche générale des légions, en se resserrant vers le centre et en profondeur
    if (!m.adv && c.t > 40) {
      m.adv = 1;
      c.say("Varron fait avancer les légions. Les manipules serrent les rangs vers le centre.");
      for (const u of hast) {
        u.setFiles(u.files * 0.82);
        u.command({ kind: 'move', x: u.def.x * 0.78, z: 80, th: 0, then: { kind: 'advance' } });
      }
    }
    if (m.adv) {
      for (const u of hast) {
        if (!u.active) continue;
        if (u.order.kind === 'move' && !u.ai.turned) continue;
        c.reengage(u, 0, Math.round(u.def.files * 0.82));
      }
      // principes et triaires suivent leur colonne
      const lines = [[princ, hast, 16], [tri, princ, 16]];
      for (const [line, ahead, gap] of lines) {
        for (const u of line) {
          if (!u.active || u.engaged) continue;
          const a = ahead.find((h) => h.def.col === u.def.col);
          const fight = !a || !a.alive || a.routing || (a.engaged && (a.morale < 30 || a.men < a.men0 * 0.55));
          if (fight) {
            if (u.order.kind === 'move' || u.order.kind === 'hold' && !u.ai.fight) { u.ai.fight = 1; u.command({ kind: 'advance' }); }
            c.reengage(u, 0, u.def.files);
            continue;
          }
          if (u.role === 'triarii' && u.ai.rearGuard) continue;
          const tx = a.x - a.fx * (a.hd + gap + u.hd), tz = a.z - a.fz * (a.hd + gap + u.hd);
          if (Math.hypot(tx - u.x, tz - u.z) > 6) u.command({ kind: 'move', x: tx, z: tz, th: a.th });
        }
      }
    }
    // triaires : faire face à la cavalerie qui arrive dans le dos
    for (const u of tri) {
      if (!u.active || u.engaged || u.ai.rearGuard) continue;
      const e = c.nearestFoe(u, (e) => e.isCav && e.active, 260);
      if (e) {
        const [, lz] = u.local(e.x, e.z);
        if (lz < -u.hd) {
          u.ai.rearGuard = 1;
          u.command({ kind: 'turn', dth: Math.PI });
          c.say(`${u.name} fait demi-tour face à la cavalerie.`, u);
        }
      }
    }
    // cavalerie : tenir l'aile, contre-charger
    for (const u of [...cavR, ...cavL]) {
      if (!u.active) continue;
      const e = c.nearestFoe(u, (e) => e.isCav && e.active, u.role === 'cavR' ? 160 : 70);
      if (e && u.order.kind !== 'attack') u.command({ kind: 'attack', target: e });
      if (u.order.kind === 'attack' && u.ai.home && !u.engaged) {
        const d = Math.hypot(u.x - u.ai.home[0], u.z - u.ai.home[1]);
        if (d > 280) u.command({ kind: 'move', x: u.ai.home[0], z: u.ai.home[1], th: 0 });
      }
    }
    c.generals(us, {
      'Paul-Émile': () => cavR.find((u) => u.active) || hast[2],
      Varron: () => cavL.find((u) => u.active) || hast[13],
      Servilius: () => tri.find((u) => u.def.col === 7 && u.alive) || tri.find((u) => u.alive),
    });
  },

  // ------------------------------------------------------ Hannibal à Zama
  hannibal_zama(c, us) {
    const m = c.mem;
    const ele = us.filter((u) => u.role === 'ele');
    const light = us.filter((u) => u.role === 'light');
    const l1 = us.filter((u) => u.role === 'line1'), l2 = us.filter((u) => u.role === 'line2'), l3 = us.filter((u) => u.role === 'line3');
    const cav = us.filter((u) => u.role === 'cavR' || u.role === 'cavL');
    if (!m.init) {
      m.init = 1;
      for (const u of [...l1, ...l2, ...l3, ...light]) u.ai.noEngage = true;
      c.say("Hannibal lance ses quatre-vingts éléphants.");
      for (const u of ele) u.command({ kind: 'advance', run: false });
      for (const u of light) u.command({ kind: 'move', x: u.x, z: u.z - 120, th: Math.PI });
    }
    for (const u of ele) {
      if (!u.active || u.order.kind === 'attack') continue;
      const e = c.nearestFoe(u, (e) => e.active && !e.isGen, 160);
      if (e) u.command({ kind: 'attack', target: e, run: true });
    }
    for (const u of light) {
      if (u.ai.back) continue;
      if (c.nearestFoe(u, (e) => e.heavyInf && e.active, 70) || u.ammo <= 0.3) {
        u.ai.back = 1; u.command({ kind: 'move', x: u.x, z: 620, run: true, th: Math.PI });
      }
    }
    const eleDone = ele.every((u) => !u.active) || c.t > 150;
    if (eleDone && !m.l1) {
      m.l1 = 1; c.say("La première ligne de mercenaires marche à l'ennemi.");
      for (const u of l1) u.command({ kind: 'advance' });
    }
    if (m.l1) {
      for (const u of l2) {
        if (!u.active || u.engaged) continue;
        const a = l1.find((f) => Math.abs(f.x - u.x) < 60);
        if (!a || !a.active) { if (u.order.kind !== 'advance') u.command({ kind: 'advance' }); continue; }
        const tz = a.z + (a.hd + 50 + u.hd);
        if (Math.abs(tz - u.z) > 8) u.command({ kind: 'move', x: u.x, z: tz, th: Math.PI });
      }
    }
    for (const u of l3) {
      if (!u.active || u.engaged) continue;
      const e = c.nearestFoe(u, (e) => e.heavyInf && e.active, 90);
      if (e && u.order.kind !== 'attack') u.command({ kind: 'attack', target: e });
    }
    for (const u of cav) {
      if (!u.active || u.order.kind === 'attack') continue;
      const e = c.nearestFoe(u, (e) => e.isCav && e.active, 260);
      if (e) u.command({ kind: 'attack', target: e });
    }
    c.generals(us, { Hannibal: () => l3.find((u) => u.alive) });
  },

  // ------------------------------------------------------ Scipion à Zama
  scipio_zama(c, us) {
    const m = c.mem, b = c.b;
    const vel = us.filter((u) => u.role === 'velites');
    const hast = us.filter((u) => u.role === 'hastati');
    const princ = us.filter((u) => u.role === 'principes'), tri = us.filter((u) => u.role === 'triarii');
    const cav = us.filter((u) => u.role === 'cavR' || u.role === 'cavL');
    const ninf = us.filter((u) => u.role === 'numInf');
    const foes = c.foes;
    const ele = foes.filter((u) => u.isEle && u.active);
    if (!m.init) { m.init = 1; for (const u of vel) u.command({ kind: 'move', x: u.x, z: u.z + 60, th: 0 }); }
    // trompettes et cors pour affoler les éléphants (Polybe XV.12)
    if (!m.horns && ele.some((e) => e.z - e.hd < 40)) {
      m.horns = 1;
      b.emit('horns', "Scipion fait sonner toutes les trompettes et les cors : les éléphants s'affolent.", null, { side: 0 });
      for (const e of ele) e.morale -= 4 + b.rng() * 16;
    }
    for (const u of vel) {
      if (u.ai.back) continue;
      if (c.nearestFoe(u, (e) => (e.isEle || e.heavyInf) && e.active, 35) || u.ammo <= 0.3) {
        u.ai.back = 1; u.command({ kind: 'move', x: u.x, z: -520, run: true, th: 0 });
      }
    }
    if (!m.adv && (ele.length === 0 || c.t > 170)) {
      m.adv = 1;
      c.say("Les éléphants sont passés. Scipion referme les couloirs et fait avancer les hastati.");
      for (const u of hast) { u.setFiles(u.files * 2.2); u.lanes = false; u.command({ kind: 'advance' }); }
      for (const u of [...princ, ...tri]) u.lanes = false;
    }
    if (m.adv) {
      for (const u of hast) if (u.active && u.order.kind === 'hold' && !u.engaged) u.command({ kind: 'advance' });
      for (const [line, ahead] of [[princ, hast], [tri, princ]]) {
        for (const u of line) {
          if (!u.active || u.engaged) continue;
          const a = ahead.find((h) => h.def.col === u.def.col);
          if (!a || !a.alive || a.routing || (a.engaged && a.morale < 30)) { if (u.order.kind !== 'advance') u.command({ kind: 'advance' }); continue; }
          const tx = a.x - a.fx * (a.hd + 30 + u.hd), tz = a.z - a.fz * (a.hd + 30 + u.hd);
          if (Math.hypot(tx - u.x, tz - u.z) > 6) u.command({ kind: 'move', x: tx, z: tz, th: a.th });
        }
      }
    }
    for (const u of ninf) if (u.active && m.adv && u.order.kind === 'hold') u.command({ kind: 'advance' });
    // cavalerie : chasser, poursuivre, puis revenir prendre les vétérans à revers
    for (const u of cav) {
      if (!u.active) continue;
      u.ai.t = (u.ai.t || 0) + 0.5;
      const ecav = c.nearestFoe(u, (e) => e.isCav && !e.isGen && (e.active || e.routing), 900);
      if (ecav && !u.ai.returning) {
        if (u.order.target !== ecav) u.command({ kind: 'attack', target: ecav });
        continue;
      }
      if (!u.ai.returning) {
        u.ai.returning = 1;
        if (!m.cavBack) { m.cavBack = 1; c.say("La cavalerie de Lélius et de Massinissa revient sur le champ de bataille."); }
      }
      if (u.order.kind === 'attack' && u.order.target && u.order.target.active) continue;
      const vets = foes.filter((e) => e.role === 'line3' && e.active);
      const t = vets.length ? vets.reduce((a, e) => (Math.hypot(e.x - u.x, e.z - u.z) < Math.hypot(a.x - u.x, a.z - u.z) ? e : a)) : c.nearestFoe(u, (e) => e.active && !e.isGen);
      if (t) c.attackRear(u, t);
    }
    c.generals(us, {
      Scipion: () => tri.find((u) => u.def.col === 4 && u.alive) || tri.find((u) => u.alive),
      'Lélius': () => cav.find((u) => u.role === 'cavL' && u.active),
      Massinissa: () => cav.find((u) => u.role === 'cavR' && u.active),
    });
    void clamp; void centroid;
  },
};

export function makeCommanders(b, scnId, playerSide) {
  const plans = scnId === 'cannae' ? ['varro_cannae', 'hannibal_cannae'] : ['scipio_zama', 'hannibal_zama'];
  return [0, 1].map((s) => new Commander(b, s, s === playerSide ? null : plans[s], s === playerSide));
}
