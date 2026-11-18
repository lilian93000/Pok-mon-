/* Plans de bataille proposés au joueur, doctrine qui permet aux officiers de les exécuter,
   et conseiller qui propose des manœuvres pendant la bataille.
   Chaque plan : déploiement + consignes par corps de troupe. Les unités que le joueur
   commande lui-même (u.manual) ne sont plus touchées par le plan. */
import { FRONT, RIGHT, REAR, LEFT } from './sim.js';

const HP = Math.PI / 2;

// ------------------------------------------------------------ placements
function at(u, x, zf, th, files, extra) {
  files = Math.max(4, Math.min(Math.round(files || u.files), Math.ceil(u.men)));
  const hd = (u.men / files) * u.T.spZ / 2;
  return { u, x: x - Math.sin(th) * hd, z: zf - Math.cos(th) * hd, th, files, ...extra };
}
const hist = (u) => at(u, u.def.x, u.def.zf, u.def.th, u.def.files);
const keep = (us, f) => us.map((u) => f(u) || hist(u));

/* --------------------------------------------------------------------- *
 *  Catalogue des stratégies
 * --------------------------------------------------------------------- */
export const STRATEGIES = {
  cannae: {
    0: [
      {
        id: 'varro', name: 'Le plan de Varron', tag: 'Historique',
        desc: "Les manipules serrés en profondeur enfoncent le centre ennemi. La cavalerie tient les ailes.",
        pros: ['Énorme poussée au centre', 'Les Gaulois cèdent vite'],
        cons: ["Les flancs et l'arrière restent sans protection", 'Exactement ce qu\'attend Hannibal'],
        ai: 'varro_cannae', deploy: (us) => keep(us, () => null),
      },
      {
        id: 'wide', name: 'Front large et réserves', tag: 'Prudent',
        desc: "Les légions s'étirent pour couvrir aussi les Libyens. Les triaires forment deux réserves derrière les ailes, prêtes à faire face à tout ce qui déborde.",
        pros: ['Plus de flanc découvert à l\'avance', 'Réserves pour contrer les Libyens'],
        cons: ['Centre moins profond, poussée plus faible', 'La cavalerie reste inférieure'],
        ai: 'doc:wide',
        roles: { velites: 'screen', hastati: { d: 'line', advance: true, delay: 35 }, principes: { d: 'support' }, triarii: { d: 'reserve', radius: 320 }, cavR: 'cavGuard', cavL: 'cavGuard' },
        deploy: (us) => keep(us, (u) => {
          const d = u.def;
          if (u.role === 'hastati' || u.role === 'principes') return at(u, -840 + d.col * 112, u.role === 'hastati' ? -250 : -304, 0, 64);
          if (u.role === 'triarii') { const w = d.col < 8, k = w ? d.col : d.col - 8; return at(u, (w ? -1 : 1) * (560 + (k % 4) * 66), -372 - Math.floor(k / 4) * 26, 0, 40); }
          if (u.role === 'cavR') return at(u, -1005, -280 - (d.x < -1000 ? 52 : 0), 0, 100);
          if (u.role === 'cavL') return at(u, d.x + 100, -270, 0, 100);
          if (u.role === 'velites') return at(u, d.x * 1.1, d.zf, 0, d.files);
          return null;
        }),
      },
      {
        id: 'hold', name: 'Mur de légions, garde arrière', tag: 'Défensif',
        desc: "L'armée ne bouge pas : Hannibal doit attaquer dans la profondeur romaine. Les triaires font face à l'arrière en mur de lances contre la cavalerie qui viendra faire le tour.",
        pros: ['Le croissant ne peut pas attirer les légions', 'Dos protégé contre Hasdrubal'],
        cons: ['Initiative laissée à Hannibal', 'Bataille plus longue'],
        ai: 'doc:hold',
        roles: { velites: 'screen', hastati: { d: 'line', advance: false }, principes: { d: 'support' }, triarii: 'rearguard', cavR: 'cavGuard', cavL: 'cavGuard' },
        deploy: (us) => keep(us, (u) => {
          const d = u.def;
          if (u.role === 'triarii') return at(u, d.x, -440, Math.PI, 40);
          if (u.role === 'cavR' || u.role === 'cavL') return at(u, d.x, -320, 0, d.files);
          return null;
        }),
      },
      {
        id: 'cav', name: 'Toute la cavalerie au fleuve', tag: 'Audacieux',
        desc: "Les 6 000 cavaliers romains et alliés se regroupent contre ceux d'Hasdrubal le long de l'Aufide, pour les battre avant qu'ils ne fassent le tour. Quatre unités de triaires gardent le flanc gauche contre les Numides.",
        pros: ["Égalité numérique face à Hasdrubal", 'Flanc gauche tenu par des vétérans'],
        cons: ['Les Numides harcèlent librement', 'Pari sur un seul choc de cavalerie'],
        ai: 'doc:cav',
        roles: { velites: 'screen', hastati: { d: 'line', advance: true, delay: 70, converge: 0.92 }, principes: { d: 'support' }, triarii: { d: 'reserve', radius: 300 }, cavR: 'cavStrike', cavL: 'cavStrike' },
        deploy: (us) => {
          let k = 0;
          return keep(us, (u) => {
            const d = u.def;
            if (u.role === 'cavL') { const i = k++; return at(u, i === 2 ? -1005 : i === 0 ? -905 : -1110, i === 2 ? -372 : -312, 0, 100); }
            if (u.role === 'triarii' && d.col >= 12) return at(u, 820, -250 - (d.col - 12) * 64, HP, 40, { dir: 'flankGuard' });
            return null;
          });
        },
      },
    ],
    1: [
      {
        id: 'hannibal', name: 'Le croissant d\'Hannibal', tag: 'Historique',
        desc: "Le centre gaulois et ibère bombé vers l'ennemi cède pas à pas ; les Libyens se referment sur les flancs ; la cavalerie d'Hasdrubal fait le tour et frappe dans le dos.",
        pros: ['Le chef-d\'œuvre de la tactique antique', 'Exploite la poussée romaine'],
        cons: ['Le centre doit tenir sans rompre', 'Demande un bon minutage'],
        ai: 'hannibal_cannae', deploy: (us) => keep(us, () => null),
      },
      {
        id: 'line', name: 'Ligne droite et marteau', tag: 'Classique',
        desc: "Toute l'infanterie en ligne droite tient le choc ; la cavalerie lourde balaie les cavaliers romains puis frappe les légions par derrière. Les Numides harcèlent l'autre aile.",
        pros: ['Simple et solide', 'La cavalerie reste décisive'],
        cons: ['Les Romains, plus nombreux, poussent partout', 'Pas de piège au centre'],
        ai: 'doc:line',
        roles: { light: 'screen', center: { d: 'line', advance: false }, libL: { d: 'line', advance: false }, libR: { d: 'line', advance: false }, cavL: 'cavStrike', cavL2: { d: 'cavStrike', delay: 25 }, cavR: 'cavHarass' },
        deploy: (us) => keep(us, (u) => (u.role === 'center' || u.role === 'libL' || u.role === 'libR' ? at(u, u.def.x, 205, Math.PI, u.def.files) : null)),
      },
      {
        id: 'depth', name: 'Défense en profondeur', tag: 'Défensif',
        desc: "Les Gaulois et les Ibères usent les légions ; les Libyens attendent en seconde ligne pour boucher les brèches et contre-attaquer. La cavalerie ne s'engage qu'après quatre minutes.",
        pros: ['Réserve de vétérans au centre', 'Les Romains s\'épuisent'],
        cons: ['Pas d\'enveloppement', 'Victoire lente et incertaine'],
        ai: 'doc:depth',
        roles: { light: 'screen', center: { d: 'line', advance: false }, libL: { d: 'reserve', radius: 260 }, libR: { d: 'reserve', radius: 260 }, cavL: { d: 'cavGuard', release: 240 }, cavL2: { d: 'cavGuard', release: 260 }, cavR: 'cavHarass' },
        deploy: (us) => keep(us, (u) => {
          if (u.role === 'center') return at(u, u.def.x, 225, Math.PI, u.def.files);
          if (u.role === 'libL' || u.role === 'libR') { const inner = Math.abs(u.def.x) < 700; const sg = Math.sign(u.def.x); return at(u, sg * (inner ? 130 : 360), 335, Math.PI, 60); }
          return null;
        }),
      },
    ],
  },
  zama: {
    0: [
      {
        id: 'scipio', name: 'Les couloirs de Scipion', tag: 'Historique',
        desc: "Manipules en colonnes séparées par des couloirs : les éléphants s'y engouffrent sans écraser personne. Trompettes pour les affoler, cavalerie lancée sur les ailes puis ramenée sur le dos des vétérans.",
        pros: ['Les éléphants perdent leur effet', 'Cavalerie très supérieure'],
        cons: ['Les colonnes sont étroites tant que les éléphants passent'],
        ai: 'scipio_zama', deploy: (us) => keep(us, () => null),
      },
      {
        id: 'quincunx', name: 'Le quinconce classique', tag: 'Classique',
        desc: "La disposition habituelle en damier, sans couloirs : plus de front, mais les éléphants frappent de plein fouet.",
        pros: ['Ligne plus large et plus solide face à l\'infanterie'],
        cons: ['Les éléphants font de gros dégâts'],
        ai: 'doc:quincunx',
        roles: { velites: 'screen', numInf: 'screen', hastati: { d: 'line', advance: true, delay: 25 }, principes: { d: 'support' }, triarii: { d: 'reserve', radius: 300 }, cavR: 'cavStrike', cavL: 'cavStrike' },
        deploy: (us) => keep(us, (u) => {
          const c = u.def.col;
          if (u.role === 'hastati') return at(u, -560 + c * 160, -250, 0, 50, { lanes: false });
          if (u.role === 'principes') return at(u, -480 + c * 160, -300, 0, 50, { lanes: false });
          if (u.role === 'triarii') return at(u, -560 + c * 160, -350, 0, 40, { lanes: false });
          return null;
        }),
      },
      {
        id: 'cavfirst', name: 'La cavalerie d\'abord', tag: 'Audacieux',
        desc: "L'infanterie attend dans ses couloirs pendant que Lélius et Massinissa chassent la cavalerie d'Hannibal puis reviennent frapper ses lignes par derrière. Les légions n'avancent qu'au bout de quatre minutes.",
        pros: ['Les vétérans d\'Hannibal pris entre deux feux'],
        cons: ['Si la cavalerie tarde, l\'infanterie reste passive'],
        ai: 'doc:cavfirst',
        roles: { velites: 'screen', numInf: 'screen', hastati: { d: 'line', advance: true, delay: 240 }, principes: { d: 'support' }, triarii: { d: 'reserve' }, cavR: 'cavStrike', cavL: 'cavStrike' },
        deploy: (us) => keep(us, () => null),
      },
    ],
    1: [
      {
        id: 'hannibalz', name: 'Le plan d\'Hannibal', tag: 'Historique',
        desc: "Les éléphants chargent en tête, les mercenaires suivent, la levée carthaginoise en deuxième ligne, et les vétérans d'Italie en réserve loin derrière.",
        pros: ['Les vétérans restent frais pour la fin'],
        cons: ['Éléphants jeunes et faciles à affoler', 'Cavalerie très inférieure'],
        ai: 'hannibal_zama', deploy: (us) => keep(us, () => null),
      },
      {
        id: 'elereserve', name: 'Éléphants en réserve', tag: 'Rusé',
        desc: "Les éléphants attendent derrière les ailes et ne chargent que lorsque les légions sont engagées, pour frapper leurs flancs au lieu de leur front.",
        pros: ['Les couloirs romains ne servent plus', 'Choc sur des flancs déjà occupés'],
        cons: ['Les trompettes peuvent encore les affoler', 'Cavalerie toujours faible'],
        ai: 'doc:elereserve',
        roles: { ele: 'eleFlank', light: 'screen', line1: { d: 'line', advance: true, delay: 40 }, line2: { d: 'support', leader: 'line1', gap: 50 }, line3: { d: 'reserve', radius: 260 }, cavR: 'cavGuard', cavL: 'cavGuard' },
        deploy: (us) => {
          let k = 0;
          return keep(us, (u) => {
            if (u.role !== 'ele') return null;
            const i = k++, sg = i < 4 ? -1 : 1, j = i % 4;
            return at(u, sg * (860 - (j % 2) * 80), 330 + Math.floor(j / 2) * 22, Math.PI, 10);
          });
        },
      },
      {
        id: 'veterans', name: 'Les vétérans en tête', tag: 'Offensif',
        desc: "Les vétérans d'Italie prennent la première ligne derrière les éléphants pour briser les hastati d'un coup ; les mercenaires passent en réserve.",
        pros: ['Le meilleur choc possible au centre'],
        cons: ['Plus de réserve solide si la cavalerie romaine revient'],
        ai: 'doc:veterans',
        roles: { ele: 'ele', light: 'screen', line3: { d: 'line', advance: true, delay: 50 }, line2: { d: 'support', leader: 'line3', gap: 50 }, line1: { d: 'reserve', radius: 280 }, cavR: 'cavGuard', cavL: 'cavGuard' },
        deploy: (us) => keep(us, (u) => {
          if (u.role === 'line3') return at(u, u.def.x, 280, Math.PI, u.def.files);
          if (u.role === 'line1') return at(u, u.def.x, 560, Math.PI, u.def.files);
          return null;
        }),
      },
    ],
  },
};
// Batailles de campagne : plans valables pour toute armée (rôles génériques)
const FIELD_ROLES = (o) => Object.assign({
  light: 'screen', ele: 'ele',
  hastati: { d: 'line', advance: true, delay: 25 }, principes: { d: 'support' }, triarii: { d: 'reserve', radius: 300 },
  line1: { d: 'line', advance: true, delay: 25 }, line2: { d: 'support', leader: 'line1', gap: 40 },
  cavL: 'cavStrike', cavR: 'cavStrike',
}, o);
const FIELD = [
  {
    id: 'attack', name: 'Assaut général', tag: 'Offensif',
    desc: "Toute la ligne marche à l'ennemi derrière l'écran des tirailleurs ; la cavalerie charge celle d'en face puis revient sur les flancs.",
    pros: ['Profite du nombre et de l\'élan', 'Simple à suivre'], cons: ['Les réserves s\'usent vite'],
    ai: 'doc:attack', roles: FIELD_ROLES({}), deploy: (us) => keep(us, () => null),
  },
  {
    id: 'hammer', name: 'Marteau et enclume', tag: 'Classique',
    desc: "L'infanterie tient sur place comme une enclume ; la cavalerie balaie les cavaliers ennemis puis frappe l'infanterie dans le dos.",
    pros: ['Décisif si ta cavalerie est la meilleure'], cons: ['Long si la cavalerie ennemie résiste'],
    ai: 'doc:hammer', roles: FIELD_ROLES({ hastati: { d: 'line', advance: false }, line1: { d: 'line', advance: false } }), deploy: (us) => keep(us, () => null),
  },
  {
    id: 'defend', name: 'Tenir la position', tag: 'Défensif',
    desc: "Personne ne bouge : l'ennemi doit venir s'user sur ta ligne. Les réserves bouchent les brèches, la cavalerie protège les flancs et ne s'élance qu'après cinq minutes.",
    pros: ['Le relief et le temps jouent pour toi', 'Flancs couverts'], cons: ['L\'initiative est à l\'ennemi'],
    ai: 'doc:defend', roles: FIELD_ROLES({ hastati: { d: 'line', advance: false }, line1: { d: 'line', advance: false }, line2: { d: 'reserve', radius: 260 }, cavL: { d: 'cavGuard', release: 300 }, cavR: { d: 'cavGuard', release: 300 } }), deploy: (us) => keep(us, () => null),
  },
  {
    id: 'skirmish', name: 'Harceler puis frapper', tag: 'Rusé',
    desc: "Les tirailleurs et la cavalerie légère usent l'ennemi à distance pendant quatre minutes ; la ligne ne s'avance qu'ensuite, contre un adversaire fatigué.",
    pros: ['Use le moral ennemi sans pertes'], cons: ['Peu efficace sans troupes de jet'],
    ai: 'doc:skirmish', roles: FIELD_ROLES({ hastati: { d: 'line', advance: true, delay: 240 }, line1: { d: 'line', advance: true, delay: 240 }, cavL: { d: 'cavGuard', release: 240 }, cavR: 'cavHarass' }), deploy: (us) => keep(us, () => null),
  },
];
STRATEGIES.field = { 0: FIELD, 1: FIELD };

export function strategyById(scn, id) {
  for (const s of [0, 1]) for (const p of STRATEGIES[scn][s]) if (p.id === id) return p;
  return null;
}

/* --------------------------------------------------------------------- *
 *  Doctrine : exécution des consignes par les officiers
 * --------------------------------------------------------------------- */
const norm = (d) => (typeof d === 'string' ? { d } : d);

export function doctrine(c, us, st) {
  const m = c.mem;
  if (!m.dinit) {
    m.dinit = 1;
    for (const u of us) { u.ai.home = [u.x, u.z, u.th]; u.ai.files0 = u.files; }
  }
  for (const u of us) {
    if (u.ai.passT && c.t > u.ai.passT) { u.flags.pass = false; u.ai.passT = 0; }
    if (!u.alive || u.isGen || u.routing || u.manual) continue;
    if (!u.ai.home) { u.ai.home = [u.x, u.z, u.th]; u.ai.files0 = u.files; }
    const d = u.ai.dir ? { d: u.ai.dir } : norm(st.roles[u.role]);
    if (!d) continue;
    const fn = DIR[d.d];
    if (fn) fn(c, u, d, us);
  }
  for (const g of us) {
    if (!g.isGen || g.routing || g.manual) continue;
    const danger = c.nearestFoe(g, (e) => e.active && !e.isGen, 70);
    if (danger) {
      const a = Math.atan2(g.x - danger.x, g.z - danger.z);
      g.command({ kind: 'move', x: g.x + Math.sin(a) * 120, z: g.z + Math.cos(a) * 120, run: true });
      continue;
    }
    if (!g.ai.anchor || !g.ai.anchor.alive || g.ai.anchor.routing) {
      let best = null, bd = Infinity;
      for (const u of us) { if (u.isGen || u.light || !u.active) continue; const dd = Math.hypot(u.x - g.x, u.z - g.z); if (dd < bd) { bd = dd; best = u; } }
      g.ai.anchor = best;
    }
    if (g.ai.anchor) c.follow(g, g.ai.anchor, 60);
  }
}

const DIR = {
  screen(c, u, d) {
    const h = u.ai.home;
    if (!u.ai.s0) { u.ai.s0 = 1; const dist = d.dist || 90; u.command({ kind: 'move', x: u.x + Math.sin(h[2]) * dist, z: u.z + Math.cos(h[2]) * dist, th: h[2] }); }
    if (u.ai.back) return;
    const near = c.nearestFoe(u, (e) => (e.heavyInf || e.isCav || e.isEle) && e.active, 70);
    if (near || u.ammo <= 0.3) {
      u.ai.back = 1; u.flags.pass = true;
      u.command({ kind: 'move', x: h[0] - Math.sin(h[2]) * 260, z: h[1] - Math.cos(h[2]) * 260, run: true, th: h[2] });
    }
  },
  line(c, u, d) {
    const h = u.ai.home;
    if (d.advance && !u.ai.adv && c.t >= (d.delay || 0)) {
      u.ai.adv = 1;
      if (d.converge && d.converge !== 1) u.command({ kind: 'move', x: h[0] * d.converge, z: u.z + Math.cos(h[2]) * 320, th: h[2], then: { kind: 'advance' } });
      else u.command({ kind: 'advance' });
      return;
    }
    if (u.ai.adv) { if (u.order.kind !== 'move' || u.ai.turned) c.reengage(u, h[2], u.ai.files0); return; }
    if (u.engaged) return;
    if (u.order.kind === 'hold') {
      const e = c.nearestFoe(u, (e) => e.active && !e.isGen && !e.light, 40);
      if (e) u.command({ kind: 'attack', target: e });
      else if (Math.abs(angle(u.th, h[2])) > 0.2 && !u.ai.turned) u.command({ kind: 'hold', th: h[2] });
    } else if (u.order.kind === 'attack') {
      // ne pas poursuivre loin ; ne jamais tourner le dos pour regagner son poste
      const t = u.order.target;
      if (!t || !t.active || Math.hypot(u.x - h[0], u.z - h[1]) > 90) u.command({ kind: 'hold', th: u.th });
    }
  },
  support(c, u, d, us) {
    if (u.ai.lead === undefined) {
      const lr = d.leader || 'hastati';
      u.ai.lead = us.find((o) => o.role === lr && o.def.col !== undefined && o.def.col === u.def.col) || nearestAhead(u, us.filter((o) => o.role === lr)) || null;
    }
    const a = u.ai.lead;
    if (u.engaged) return;
    const fight = u.ai.fight || !a || !a.alive || a.routing || (a.engaged && (a.morale < 28 || a.men < a.men0 * 0.5));
    if (fight) {
      if (!u.ai.fight) { u.ai.fight = 1; u.command({ kind: 'advance' }); }
      c.reengage(u, u.ai.home[2], u.ai.files0);
      return;
    }
    if (d.relief !== false && a.engaged && a.engagedT > 60 && a.fatigue > 62 && u.fatigue < 35 && !a.ai.relieved && a.morale > 20 && !a.manual) {
      relieve(c, a, u);
      return;
    }
    const gap = d.gap || 16;
    const tx = a.x - a.fx * (a.hd + gap + u.hd), tz = a.z - a.fz * (a.hd + gap + u.hd);
    if (Math.hypot(tx - u.x, tz - u.z) > 6) u.command({ kind: 'move', x: tx, z: tz, th: a.th });
  },
  reserve(c, u, d, us) {
    if (u.engaged || u.turnT > 0) return;
    const R = d.radius || 300;
    const cur = u.order.kind === 'attack' ? u.order.target : null;
    if (cur && cur.active && u.distTo(cur) < R + 150) return;
    let t = c.nearestFoe(u, (e) => e.active && !e.light && !e.isGen, R);
    if (!t) {
      const ally = us.find((a) => a.engaged && a !== u && (a.eS[LEFT] || a.eS[RIGHT] || a.eS[REAR]) && Math.hypot(a.x - u.x, a.z - u.z) < R * 1.6);
      if (ally) { const k = ally.contacts.find((k) => k.side !== FRONT && !k.o.routing); t = k ? k.o : null; }
    }
    if (t) {
      const ang = angle(u.th, Math.atan2(t.x - u.x, t.z - u.z));
      if (Math.abs(ang) > 1.1 && !u.isCav) u.command({ kind: 'turn', dth: snap(ang) });
      else u.command({ kind: 'attack', target: t });
      return;
    }
    const h = u.ai.home;
    if (u.order.kind !== 'move' && Math.hypot(u.x - h[0], u.z - h[1]) > 40) u.command({ kind: 'move', x: h[0], z: h[1], th: h[2] });
  },
  flankGuard(c, u, d, us) { DIR.reserve(c, u, { radius: 280 }, us); },
  relieved(c, u, d, us) { DIR.reserve(c, u, { radius: 220 }, us); },
  rearguard(c, u) {
    if (u.engaged) return;
    if (u.T.spear && u.form !== 'wall' && u.order.kind === 'hold' && u.turnT <= 0) u.setForm('wall');
    const e = c.nearestFoe(u, (e) => e.active && !e.light && !e.isGen && !e.isCav, 60);
    if (e) u.command({ kind: 'attack', target: e });
  },
  cavStrike(c, u, d) {
    if (c.t < (d.delay || 0) || u.engaged) return;
    const cur = u.order.kind === 'attack' ? u.order.target : null;
    if (cur && (cur.active || cur.routing) && !bracedFront(cur, u)) return;
    const ec = c.nearestFoe(u, (e) => e.isCav && e.active && !e.isGen, 2200);
    if (ec) { u.command({ kind: 'attack', target: ec }); return; }
    cavHunt(c, u);
  },
  cavGuard(c, u, d) {
    if (d.release && c.t > d.release) return DIR.cavStrike(c, u, {});
    if (u.engaged) return;
    const h = u.ai.home;
    const e = c.nearestFoe(u, (e) => e.isCav && e.active && !e.isGen, 220);
    if (e && Math.hypot(e.x - h[0], e.z - h[1]) < 480) { if (u.order.target !== e) u.command({ kind: 'attack', target: e }); return; }
    if (!c.foes.some((e) => e.isCav && e.active && !e.isGen)) return DIR.cavStrike(c, u, {});
    if (u.order.kind !== 'move' && Math.hypot(u.x - h[0], u.z - h[1]) > 60) u.command({ kind: 'move', x: h[0], z: h[1], th: h[2] });
  },
  cavHarass(c, u) {
    if (u.engaged) return;
    const r = c.nearestFoe(u, (e) => e.routing, 600);
    if (r) { u.skirmish = false; if (u.order.target !== r) u.command({ kind: 'attack', target: r }); return; }
    u.skirmish = true;
    if (u.order.evade) return;
    const t = c.nearestFoe(u, (e) => e.isCav && e.active && !e.isGen, 1500) || c.nearestFoe(u, (e) => e.active && !e.isGen, 1500);
    if (!t) return;
    if (u.distTo(t) > 32) {
      const p = t.nearest(u.x, u.z), a = Math.atan2(u.x - p[0], u.z - p[1]);
      u.command({ kind: 'move', x: p[0] + Math.sin(a) * 24, z: p[1] + Math.cos(a) * 24, th: a + Math.PI });
    }
  },
  ele(c, u) {
    if (u.order.kind === 'attack' && u.order.target && u.order.target.active) return;
    const e = c.nearestFoe(u, (e) => e.active && !e.isGen, 700);
    if (e) u.command({ kind: 'attack', target: e, run: true });
  },
  eleFlank(c, u) {
    if (u.order.kind === 'attack' && u.order.target && u.order.target.active) return;
    const go = c.mine.some((o) => o.heavyInf && o.engaged);
    if (!go) return;
    const ts = c.foes.filter((e) => e.heavyInf && e.active && e.engaged);
    let t = null, bd = Infinity;
    for (const e of ts) { const dd = Math.hypot(e.x - u.x, e.z - u.z); if (dd < bd) { bd = dd; t = e; } }
    if (!t) return;
    const [lx] = t.local(u.x, u.z), sg = lx < 0 ? -1 : 1;
    u.command({ kind: 'attack', target: t, run: true, via: t.world(sg * (t.hw + 45), 0) });
  },
};

// Cavalerie libre : achever les fuyards, sinon frapper le dos d'une infanterie déjà engagée
export function cavHunt(c, u) {
  const r = c.nearestFoe(u, (e) => e.routing, 260);
  if (r) { u.command({ kind: 'attack', target: r }); return; }
  let best = null, bs = Infinity;
  for (const e of c.foes) {
    if (!e.heavyInf || !e.active || e.eS[REAR] > 0) continue;
    const [, lz] = e.local(u.x, u.z);
    if (!(e.eS[FRONT] > 0 || lz < -e.hd)) continue;
    const s = Math.hypot(e.x - u.x, e.z - u.z) * (e.eS[FRONT] > 0 ? 0.5 : 1);
    if (s < bs) { bs = s; best = e; }
  }
  if (best) c.attackRear(u, best);
  else {
    const e = c.nearestFoe(u, (e) => e.heavyInf && e.active, 1500);
    if (e) { const [x, z] = e.world(0, -e.hd - 140); u.command({ kind: 'move', x, z, th: e.th }); }
  }
}
function bracedFront(t, u) {
  if (!t.heavyInf || t.routing || t.eS[FRONT] > 0) return false;
  const [, lz] = t.local(u.x, u.z);
  return lz > 0;
}
function relieve(c, front, back) {
  front.ai.relieved = true; front.ai.dir = 'relieved';
  front.flags.pass = back.flags.pass = true;
  front.ai.passT = back.ai.passT = c.t + 40;
  const [bx, bz] = back.world(0, -back.hd - front.hd - 6);
  front.command({ kind: 'move', x: bx, z: bz, th: front.th });
  back.ai.fight = 1;
  back.command({ kind: 'advance' });
  c.say(`${back.name} relève ${front.name}, épuisée.`, back);
}
function nearestAhead(u, list) {
  let best = null, bd = 160;
  for (const o of list) { const [, lz] = u.local(o.x, o.z); const d = Math.hypot(o.x - u.x, o.z - u.z); if (lz > 0 && d < bd) { bd = d; best = o; } }
  return best;
}
function angle(a, b) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}
function snap(d) { return d > 0 ? (d < 2.3 ? HP : Math.PI) : (d > -2.3 ? -HP : Math.PI); }

/* --------------------------------------------------------------------- *
 *  Conseiller : manœuvres proposées pendant la bataille (une action par conseil)
 * --------------------------------------------------------------------- */
export function advise(b, side) {
  const out = [];
  const mine = b.units.filter((u) => u.side === side && u.alive);
  const foes = b.units.filter((u) => u.side !== side && u.alive);
  const free = mine.filter((u) => u.active && !u.engaged && !u.isGen && u.heavyInf && u.turnT <= 0);
  const take = (u) => { u.manual = true; };
  const nearestFree = (e, excl, max = 650) => {
    let best = null, bd = max;
    for (const u of free) { if (u === excl) continue; const d = Math.hypot(u.x - e.x, u.z - e.z); if (d < bd) { bd = d; best = u; } }
    return best;
  };
  // 1. un ennemi va frapper le flanc ou le dos d'une unité engagée de front
  for (const f of mine) {
    if (!f.engaged || !f.heavyInf || f.eS[FRONT] === 0 || f.form === 'orbis') continue;
    for (const e of foes) {
      if (!e.active || e.light || e.isGen || e.engaged) continue;
      if (Math.abs(e.x - f.x) > 320 + f.rad || Math.abs(e.z - f.z) > 320 + f.rad) continue;
      const d = f.distTo(e);
      if (d > 260) continue;
      const [lx, lz] = f.local(e.x, e.z);
      if (lz > -f.hd * 0.3 && Math.abs(lx) < f.hw + 15) continue;
      const where = lz < -f.hd ? 'le dos' : 'le flanc';
      const h = nearestFree(e, f);
      out.push(h ? {
        key: 'flank' + e.id, pr: 5, units: [e, f, h],
        text: `${e.name} va frapper ${where} de ${f.name}.`, label: `Envoyer ${h.name}`,
        act: () => { take(h); const a = angle(h.th, Math.atan2(e.x - h.x, e.z - h.z)); if (Math.abs(a) > 1.1) h.command({ kind: 'turn', dth: snap(a) }); h.command({ kind: 'attack', target: e }); },
      } : {
        key: 'flank' + e.id, pr: 4, units: [e, f],
        text: `${e.name} va frapper ${where} de ${f.name}, et aucune réserve n'est libre.`, label: 'Former l\'orbis',
        act: () => { take(f); f.setForm('orbis'); },
      });
      break;
    }
    if (out.length > 2) break;
  }
  // 2. unité encerclée
  for (const f of mine) {
    if (f.active && f.nSides >= 3 && f.form !== 'orbis' && f.heavyInf) {
      out.push({ key: 'surr' + f.id, pr: 6, units: [f], text: `${f.name} est encerclée : en cercle, elle n'aura plus ni flanc ni dos.`, label: 'Former l\'orbis', act: () => { take(f); f.setForm('orbis'); } });
      break;
    }
  }
  // 3. cavalerie ennemie derrière les lignes : mur de lances
  for (const e of foes) {
    if (!e.isCav || !e.active || e.isGen) continue;
    const back = mine.filter((u) => u.T.spear && u.active && !u.engaged && u.form !== 'wall' && Math.hypot(u.x - e.x, u.z - e.z) < 320);
    if (!back.length) continue;
    const u = back[0];
    const [, lz] = u.local(e.x, e.z);
    out.push({
      key: 'wall' + u.id, pr: 4, units: [e, u],
      text: `La cavalerie ennemie (${e.name}) approche de ${u.name}.`, label: lz < 0 ? 'Demi-tour et mur de lances' : 'Mur de lances',
      act: () => { take(u); if (lz < 0) { u.command({ kind: 'turn', dth: Math.PI }); u.turnT = 0; } u.setForm('wall'); },
    });
    break;
  }
  // 4. relève d'une unité épuisée
  for (const f of mine) {
    if (!f.engaged || f.engagedT < 50 || f.fatigue < 60 || f.def.line === undefined) continue;
    const back = mine.find((o) => o.active && !o.engaged && o.def.col === f.def.col && o.def.line === f.def.line + 1 && o.fatigue < 40);
    if (!back) continue;
    out.push({
      key: 'relief' + f.id, pr: 3, units: [f, back],
      text: `${f.name} est épuisée (fatigue ${Math.round(f.fatigue)}). ${back.name} est fraîche juste derrière.`, label: 'Relève',
      act: () => { take(f); take(back); relieve({ say: (t, u) => b.emit('plan', t, u, { side }), t: b.t }, f, back); },
    });
    break;
  }
  // 5. cavalerie victorieuse et libre
  for (const u of mine) {
    if (!u.isCav || u.isGen || !u.active || u.engaged) continue;
    if (foes.some((e) => e.isCav && e.active && !e.isGen && Math.hypot(e.x - u.x, e.z - u.z) < 400)) continue;
    let best = null, bd = 1600;
    for (const e of foes) { if (!e.heavyInf || !e.active || !e.engaged || e.eS[REAR] > 0) continue; const d = Math.hypot(e.x - u.x, e.z - u.z); if (d < bd) { bd = d; best = e; } }
    if (!best || (u.order.kind === 'attack' && u.order.target && u.order.target.active)) continue;
    out.push({
      key: 'cav' + u.id, pr: 3, units: [u, best],
      text: `${u.name} n'a plus d'adversaire à cheval. ${best.name} est engagée de front et offre son dos.`, label: 'Charger dans le dos',
      act: () => { take(u); const [vx, vz] = best.world(0, -best.hd - 70); u.command({ kind: 'attack', target: best, via: [vx, vz] }); },
    });
    break;
  }
  // 6. fuyards ennemis à portée de cavalerie
  for (const u of mine) {
    if (!u.isCav || u.isGen || !u.active || u.engaged || u.order.kind === 'attack') continue;
    const r = foes.find((e) => e.routing && Math.hypot(e.x - u.x, e.z - u.z) < 500);
    if (!r) continue;
    out.push({ key: 'pursue' + u.id, pr: 2, units: [u, r], text: `${r.name} fuit à portée de ${u.name}.`, label: 'Poursuivre', act: () => { take(u); u.command({ kind: 'attack', target: r }); } });
    break;
  }
  // 7. harangue utile
  for (const g of mine) {
    if (!g.gen || g.genState === 2 || g.routing || (g.cd.harangue || 0) > 0) continue;
    const shaky = mine.filter((u) => u.active && u.engaged && u.morale < 38 && Math.hypot(u.x - g.x, u.z - g.z) < g.gen.aura * 1.25 + u.rad);
    if (shaky.length >= 2) {
      out.push({ key: 'har' + g.id, pr: 3, units: [g], text: `${shaky.length} unités vacillent autour de ${g.name}.`, label: 'Haranguer', act: () => b.harangue(g) });
      break;
    }
    const rout = mine.filter((u) => u.routing && !u.trapped && Math.hypot(u.x - g.x, u.z - g.z) < g.gen.aura * 1.4 + u.rad);
    if (rout.length && (g.cd.rally || 0) <= 0) {
      out.push({ key: 'ral' + g.id, pr: 3, units: [g], text: `${rout.length} unité${rout.length > 1 ? 's fuient' : ' fuit'} près de ${g.name}.`, label: 'Rallier', act: () => b.rally(g) });
      break;
    }
  }
  // 8. général en danger
  for (const g of mine) {
    if (!g.isGen || g.routing) continue;
    const e = foes.find((e) => e.active && !e.isGen && Math.hypot(e.x - g.x, e.z - g.z) < 110 + e.rad);
    if (!e) continue;
    out.push({ key: 'gen' + g.id, pr: 5, units: [g, e], text: `${g.name} est menacé par ${e.name}.`, label: 'Mettre à l\'abri', act: () => { take(g); const a = Math.atan2(g.x - e.x, g.z - e.z); g.command({ kind: 'move', x: g.x + Math.sin(a) * 220, z: g.z + Math.cos(a) * 220, run: true }); } });
    break;
  }
  // 9. éléphants qui approchent (Zama)
  const ele = foes.filter((e) => e.isEle && e.active);
  if (ele.length && (b.flagT['horns' + side + 'cd'] || -1e9) <= b.t && ele.some((e) => mine.some((u) => u.active && Math.hypot(u.x - e.x, u.z - e.z) < 300))) {
    out.push({ key: 'horns', pr: 6, units: [ele[0]], text: `${ele.length * 10} éléphants chargent.`, label: 'Sonner trompettes et cors', act: () => b.horns(side) });
  }
  // 10. tirailleurs sans munitions
  for (const u of mine) {
    if (!u.T.missile || !u.active || u.ammo > 0.3 || u.flags.noAmmoTold || u.isCav) continue;
    out.push({ key: 'ammo' + u.id, pr: 1, units: [u], text: `${u.name} n'a plus de projectiles.`, label: 'Repli derrière les lignes', act: () => { take(u); u.flags.noAmmoTold = 1; u.flags.pass = true; const back = side === 0 ? -1 : 1; u.command({ kind: 'move', x: u.x, z: u.z + back * 300, run: true, th: u.th }); } });
    break;
  }
  return out.sort((a, b2) => b2.pr - a.pr);
}
