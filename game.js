/* =========================================================
   Moteur du jeu Monstrobattle
   - Overworld en grille (canvas)
   - Rencontres aléatoires dans les hautes herbes
   - Combat au tour par tour, capture, XP/niveaux
   ========================================================= */

/* ---------- Utilitaires ---------- */
const rand = (n) => Math.floor(Math.random() * n);
const randRange = (min, max) => min + rand(max - min + 1);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const $ = (sel) => document.querySelector(sel);

/* ---------- Modèle de créature ---------- */
// Calcule une stat à partir de la base et du niveau
function statAt(base, level, isHp) {
  if (isHp) return Math.floor((base * 2 * level) / 100) + level + 10;
  return Math.floor((base * 2 * level) / 100) + 5;
}

function xpForLevel(level) {
  return level * level * level; // courbe cubique simple
}

function createMonster(speciesId, level) {
  const sp = SPECIES[speciesId];
  const maxHp = statAt(sp.base.pv, level, true);
  return {
    speciesId,
    name: sp.name,
    type: sp.type,
    sprite: sp.sprite,
    color: sp.color,
    level,
    xp: xpForLevel(level),
    maxHp,
    hp: maxHp,
    atk: statAt(sp.base.atk, level, false),
    def: statAt(sp.base.def, level, false),
    vit: statAt(sp.base.vit, level, false),
    moves: sp.moves.slice(),
  };
}

function recalcStats(mon) {
  const sp = SPECIES[mon.speciesId];
  const ratio = mon.hp / mon.maxHp;
  mon.maxHp = statAt(sp.base.pv, mon.level, true);
  mon.hp = Math.max(1, Math.round(mon.maxHp * ratio));
  mon.atk = statAt(sp.base.atk, mon.level, false);
  mon.def = statAt(sp.base.def, mon.level, false);
  mon.vit = statAt(sp.base.vit, mon.level, false);
}

/* ---------- État global ---------- */
const game = {
  party: [],
  balls: 10,
  // combat courant
  battle: null,
};

/* =========================================================
   OVERWORLD
   ========================================================= */
const TILE = 32;
const MAP_W = 15;
const MAP_H = 15;

// 0 = herbe normale, 1 = hautes herbes, 2 = eau (bloquant), 3 = arbre (bloquant), 4 = centre de soins
let worldMap = [];

function generateMap() {
  worldMap = [];
  for (let y = 0; y < MAP_H; y++) {
    const row = [];
    for (let x = 0; x < MAP_W; x++) {
      // bordure d'arbres
      if (x === 0 || y === 0 || x === MAP_W - 1 || y === MAP_H - 1) {
        row.push(3);
      } else {
        const r = Math.random();
        if (r < 0.28) row.push(1); // hautes herbes
        else if (r < 0.34) row.push(3); // arbre
        else if (r < 0.40) row.push(2); // eau
        else row.push(0);
      }
    }
    worldMap.push(row);
  }
  // case de départ dégagée
  worldMap[7][7] = 0;
  worldMap[7][6] = 0;
  worldMap[7][8] = 0;
  // centre de soins
  worldMap[2][2] = 4;
}

const player = { x: 7, y: 7 };
let stepsSinceEncounter = 0;

const canvas = $("#map");
const ctx = canvas.getContext("2d");

function tileColor(t) {
  switch (t) {
    case 0: return "#7cc66e";
    case 1: return "#4e9e54";
    case 2: return "#5aa9e6";
    case 3: return "#2f6b3a";
    case 4: return "#e85d75";
    default: return "#000";
  }
}

function drawWorld() {
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const t = worldMap[y][x];
      ctx.fillStyle = tileColor(t);
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      if (t === 1) {
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(x * TILE + 6, y * TILE + 18, 4, 8);
        ctx.fillRect(x * TILE + 14, y * TILE + 14, 4, 12);
        ctx.fillRect(x * TILE + 22, y * TILE + 18, 4, 8);
      } else if (t === 3) {
        ctx.font = "20px serif";
        ctx.fillText("🌲", x * TILE + 6, y * TILE + 24);
      } else if (t === 4) {
        ctx.font = "20px serif";
        ctx.fillText("🏥", x * TILE + 6, y * TILE + 24);
      }
    }
  }
  // joueur
  ctx.font = "24px serif";
  ctx.fillText("🧑", player.x * TILE + 4, player.y * TILE + 26);
}

function isBlocked(x, y) {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return true;
  const t = worldMap[y][x];
  return t === 2 || t === 3;
}

function tryMove(dx, dy) {
  if (currentScreen !== "world-screen") return;
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (isBlocked(nx, ny)) return;
  player.x = nx;
  player.y = ny;

  const t = worldMap[ny][nx];
  if (t === 4) {
    healParty();
    setWorldMsg("Tes créatures sont soignées ! ♥");
  } else if (t === 1) {
    stepsSinceEncounter++;
    if (Math.random() < 0.22 && stepsSinceEncounter >= 1) {
      stepsSinceEncounter = 0;
      startWildBattle();
    }
  }
  drawWorld();
}

function setWorldMsg(msg) {
  $("#world-msg").textContent = msg;
  if (msg) setTimeout(() => { if ($("#world-msg").textContent === msg) $("#world-msg").textContent = ""; }, 2500);
}

/* =========================================================
   GESTION DES ÉCRANS
   ========================================================= */
let currentScreen = "start-screen";

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  currentScreen = id;
  if (id === "world-screen") drawWorld();
}

/* =========================================================
   CHOIX DU STARTER
   ========================================================= */
function buildStarterScreen() {
  const container = $("#starter-choices");
  container.innerHTML = "";
  STARTERS.forEach((id) => {
    const sp = SPECIES[id];
    const card = document.createElement("div");
    card.className = "starter-card";
    card.style.background = sp.color;
    card.innerHTML = `
      <div class="starter-sprite">${sp.sprite}</div>
      <div class="starter-name">${sp.name}</div>
      <div class="starter-type" style="background:${TYPES[sp.type].color}">${TYPES[sp.type].name}</div>
    `;
    card.addEventListener("click", () => chooseStarter(id));
    container.appendChild(card);
  });
}

function chooseStarter(id) {
  game.party = [createMonster(id, 5)];
  generateMap();
  showScreen("world-screen");
  setWorldMsg(`Tu as choisi ${SPECIES[id].name} ! Bonne aventure.`);
}

/* =========================================================
   ÉQUIPE & SOINS
   ========================================================= */
function healParty() {
  game.party.forEach((m) => { m.hp = m.maxHp; });
}

function firstHealthy() {
  return game.party.find((m) => m.hp > 0);
}

function buildPartyScreen() {
  const list = $("#party-list");
  list.innerHTML = "";
  game.party.forEach((m) => {
    const div = document.createElement("div");
    div.className = "party-card";
    div.style.borderColor = TYPES[m.type].color;
    const pct = Math.round((m.hp / m.maxHp) * 100);
    div.innerHTML = `
      <div class="party-sprite" style="background:${m.color}">${m.sprite}</div>
      <div class="party-meta">
        <strong>${m.name}</strong> <span class="lvl">N.${m.level}</span>
        <span class="type-badge" style="background:${TYPES[m.type].color}">${TYPES[m.type].name}</span>
        <div class="hp-bar"><div class="hp-fill" style="width:${pct}%;background:${hpColor(pct)}"></div></div>
        <div class="hp-text">${m.hp}/${m.maxHp} PV</div>
      </div>`;
    list.appendChild(div);
  });
  const ballInfo = document.createElement("p");
  ballInfo.className = "ball-info";
  ballInfo.textContent = `Polkaballs : ${game.balls}`;
  list.appendChild(ballInfo);
}

function hpColor(pct) {
  if (pct > 50) return "#4caf50";
  if (pct > 20) return "#ffc107";
  return "#f44336";
}

/* =========================================================
   COMBAT
   ========================================================= */
function weightedWild() {
  const total = WILD_POOL.reduce((s, w) => s + w.weight, 0);
  let r = rand(total);
  for (const entry of WILD_POOL) {
    if (r < entry.weight) return entry.id;
    r -= entry.weight;
  }
  return WILD_POOL[0].id;
}

function startWildBattle() {
  const wildId = weightedWild();
  const playerMon = firstHealthy();
  const lvl = clamp(playerMon.level + randRange(-2, 1), 2, 30);
  const enemy = createMonster(wildId, lvl);
  game.battle = {
    enemy,
    active: playerMon,
    over: false,
    canCatch: true,
  };
  showScreen("battle-screen");
  renderBattle();
  logBattle(`Un ${enemy.name} sauvage (N.${enemy.level}) apparaît !`);
  buildBattleMenu("main");
}

function renderBattle() {
  const b = game.battle;
  $("#enemy-sprite").innerHTML = `<div class="sprite-box" style="background:${b.enemy.color}">${b.enemy.sprite}</div>`;
  $("#player-sprite").innerHTML = `<div class="sprite-box" style="background:${b.active.color}">${b.active.sprite}</div>`;
  $("#enemy-info").innerHTML = monInfoHtml(b.enemy, false);
  $("#player-info").innerHTML = monInfoHtml(b.active, true);
}

function monInfoHtml(m, showXp) {
  const pct = Math.round((m.hp / m.maxHp) * 100);
  let html = `
    <div class="info-name">${m.name} <span class="lvl">N.${m.level}</span>
      <span class="type-badge" style="background:${TYPES[m.type].color}">${TYPES[m.type].name}</span>
    </div>
    <div class="hp-bar"><div class="hp-fill" style="width:${pct}%;background:${hpColor(pct)}"></div></div>`;
  if (showXp) html += `<div class="hp-text">${m.hp}/${m.maxHp} PV</div>`;
  return html;
}

let battleLogTimer = null;
function logBattle(msg) {
  $("#battle-log").textContent = msg;
}

function buildBattleMenu(mode) {
  const menu = $("#battle-menu");
  menu.innerHTML = "";
  const b = game.battle;
  if (b.over) return;

  if (mode === "main") {
    addBtn(menu, "⚔️ Attaque", () => buildBattleMenu("moves"));
    addBtn(menu, "🎯 Polkaball", () => playerCatch());
    addBtn(menu, "🔄 Changer", () => buildBattleMenu("switch"));
    addBtn(menu, "🏃 Fuite", () => playerFlee());
  } else if (mode === "moves") {
    b.active.moves.forEach((mvId) => {
      const mv = MOVES[mvId];
      addBtn(menu, `${mv.name} (${TYPES[mv.type].name})`, () => playerAttack(mvId));
    });
    addBtn(menu, "↩ Retour", () => buildBattleMenu("main"));
  } else if (mode === "switch") {
    game.party.forEach((m, i) => {
      if (m === b.active) return;
      const label = m.hp > 0 ? `${m.name} (${m.hp}/${m.maxHp})` : `${m.name} (K.O.)`;
      const btn = addBtn(menu, label, () => playerSwitch(i));
      if (m.hp <= 0) btn.disabled = true;
    });
    addBtn(menu, "↩ Retour", () => buildBattleMenu("main"));
  }
}

function addBtn(parent, label, onClick) {
  const b = document.createElement("button");
  b.textContent = label;
  b.addEventListener("click", onClick);
  parent.appendChild(b);
  return b;
}

function disableMenu() {
  document.querySelectorAll("#battle-menu button").forEach((b) => (b.disabled = true));
}

// Calcul des dégâts
function calcDamage(attacker, defender, move) {
  const stab = attacker.type === move.type ? 1.5 : 1;
  const eff = typeMultiplier(move.type, defender.type);
  const base = ((2 * attacker.level) / 5 + 2) * move.power * (attacker.atk / defender.def);
  const dmg = Math.floor((base / 25 + 2) * stab * eff * (0.85 + Math.random() * 0.15));
  return { dmg: Math.max(1, dmg), eff };
}

function effText(eff) {
  if (eff > 1) return " C'est super efficace !";
  if (eff < 1) return " Ce n'est pas très efficace…";
  return "";
}

function playerAttack(moveId) {
  const b = game.battle;
  if (b.over) return;
  disableMenu();
  const move = MOVES[moveId];

  if (Math.random() * 100 > move.accuracy) {
    logBattle(`${b.active.name} utilise ${move.name}… mais rate !`);
    setTimeout(enemyTurn, 1100);
    return;
  }
  const { dmg, eff } = calcDamage(b.active, b.enemy, move);
  b.enemy.hp = clamp(b.enemy.hp - dmg, 0, b.enemy.maxHp);
  renderBattle();
  logBattle(`${b.active.name} utilise ${move.name} ! -${dmg} PV.${effText(eff)}`);

  if (b.enemy.hp <= 0) {
    setTimeout(() => winBattle(), 1100);
  } else {
    setTimeout(enemyTurn, 1100);
  }
}

function enemyTurn() {
  const b = game.battle;
  if (b.over) return;
  const moveId = b.enemy.moves[rand(b.enemy.moves.length)];
  const move = MOVES[moveId];

  if (Math.random() * 100 > move.accuracy) {
    logBattle(`Le ${b.enemy.name} ennemi utilise ${move.name}… mais rate !`);
    setTimeout(() => buildBattleMenu("main"), 1000);
    return;
  }
  const { dmg, eff } = calcDamage(b.enemy, b.active, move);
  b.active.hp = clamp(b.active.hp - dmg, 0, b.active.maxHp);
  renderBattle();
  logBattle(`Le ${b.enemy.name} ennemi utilise ${move.name} ! -${dmg} PV.${effText(eff)}`);

  if (b.active.hp <= 0) {
    setTimeout(onPlayerMonFaint, 1100);
  } else {
    setTimeout(() => buildBattleMenu("main"), 1000);
  }
}

function onPlayerMonFaint() {
  const b = game.battle;
  logBattle(`${b.active.name} est K.O. !`);
  const next = firstHealthy();
  if (!next) {
    setTimeout(() => {
      b.over = true;
      logBattle("Toute ton équipe est K.O. ! Tu retournes au centre de soins.");
      healParty();
      player.x = 2; player.y = 3;
      setTimeout(() => showScreen("world-screen"), 1500);
    }, 1100);
  } else {
    b.active = next;
    renderBattle();
    setTimeout(() => {
      logBattle(`En avant, ${next.name} !`);
      buildBattleMenu("main");
    }, 1100);
  }
}

function playerSwitch(index) {
  const b = game.battle;
  const target = game.party[index];
  if (target.hp <= 0 || target === b.active) { buildBattleMenu("main"); return; }
  b.active = target;
  renderBattle();
  disableMenu();
  logBattle(`En avant, ${target.name} !`);
  setTimeout(enemyTurn, 1100);
}

function playerFlee() {
  const b = game.battle;
  disableMenu();
  // chance de fuite basée sur la vitesse
  const chance = b.active.vit >= b.enemy.vit ? 0.9 : 0.5;
  if (Math.random() < chance) {
    logBattle("Tu prends la fuite !");
    b.over = true;
    setTimeout(() => showScreen("world-screen"), 1100);
  } else {
    logBattle("Fuite impossible !");
    setTimeout(enemyTurn, 1100);
  }
}

function playerCatch() {
  const b = game.battle;
  if (game.balls <= 0) { logBattle("Tu n'as plus de Polkaball !"); return; }
  if (game.party.length >= 6) { logBattle("Ton équipe est pleine (6 max) !"); return; }
  disableMenu();
  game.balls--;
  // probabilité de capture : plus l'ennemi est blessé, mieux c'est
  const hpFactor = 1 - b.enemy.hp / b.enemy.maxHp; // 0..1
  const catchChance = clamp(0.25 + hpFactor * 0.6, 0.1, 0.95);
  logBattle("Tu lances une Polkaball… *clic* *clic*…");
  setTimeout(() => {
    if (Math.random() < catchChance) {
      logBattle(`Gagné ! ${b.enemy.name} est capturé !`);
      game.party.push(b.enemy);
      b.over = true;
      setTimeout(() => showScreen("world-screen"), 1500);
    } else {
      logBattle(`Oh non ! Le ${b.enemy.name} s'est échappé !`);
      setTimeout(enemyTurn, 1100);
    }
  }, 1300);
}

function winBattle() {
  const b = game.battle;
  b.over = true;
  logBattle(`Le ${b.enemy.name} ennemi est vaincu !`);
  // gain d'XP
  const gain = Math.floor((b.enemy.level * b.enemy.level) / 3) + 8;
  setTimeout(() => grantXp(b.active, gain), 1200);
}

function grantXp(mon, gain) {
  mon.xp += gain;
  logBattle(`${mon.name} gagne ${gain} points d'XP !`);
  let leveled = false;
  while (mon.xp >= xpForLevel(mon.level + 1) && mon.level < 50) {
    mon.level++;
    leveled = true;
  }
  if (leveled) {
    recalcStats(mon);
    setTimeout(() => {
      logBattle(`${mon.name} monte au niveau ${mon.level} !`);
      checkEvolution(mon);
    }, 1200);
  } else {
    endBattleToWorld();
  }
}

function checkEvolution(mon) {
  const sp = SPECIES[mon.speciesId];
  // apprentissage d'attaques de l'espèce supérieure : on garde les moves de base
  if (sp.evolvesTo && mon.level >= sp.evolveLevel) {
    const oldName = mon.name;
    const newSp = SPECIES[sp.evolvesTo];
    mon.speciesId = newSp.id;
    mon.name = newSp.name;
    mon.type = newSp.type;
    mon.sprite = newSp.sprite;
    mon.color = newSp.color;
    // ajoute les nouvelles attaques
    newSp.moves.forEach((mv) => { if (!mon.moves.includes(mv)) mon.moves.push(mv); });
    recalcStats(mon);
    renderBattle();
    setTimeout(() => {
      logBattle(`Hein ?! ${oldName} évolue en ${newSp.name} !`);
      endBattleToWorld();
    }, 1300);
  } else {
    endBattleToWorld();
  }
}

function endBattleToWorld() {
  setTimeout(() => showScreen("world-screen"), 1400);
}

/* =========================================================
   ENTRÉES CLAVIER
   ========================================================= */
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) e.preventDefault();
  if (key === "arrowup" || key === "z" || key === "w") tryMove(0, -1);
  else if (key === "arrowdown" || key === "s") tryMove(0, 1);
  else if (key === "arrowleft" || key === "q" || key === "a") tryMove(-1, 0);
  else if (key === "arrowright" || key === "d") tryMove(1, 0);
});

/* ---------- Boutons UI ---------- */
$("#btn-party").addEventListener("click", () => { buildPartyScreen(); showScreen("party-screen"); });
$("#btn-close-party").addEventListener("click", () => showScreen("world-screen"));
$("#btn-heal").addEventListener("click", () => { healParty(); setWorldMsg("Équipe soignée ! (Astuce : marche sur 🏥)"); });

/* ---------- Démarrage ---------- */
buildStarterScreen();
showScreen("start-screen");
