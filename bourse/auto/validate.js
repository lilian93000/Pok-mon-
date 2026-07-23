#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — auto/validate.js
   Validation HORS-ÉCHANTILLON : un signal qui marche sur les données
   où on l'a trouvé peut n'être que de la chance. Ici on le re-teste :
     · sur des PÉRIODES différentes (1re moitié / 2e moitié) ;
     · sur un PANIER d'actions DIFFÉRENT (univers B, aucune valeur de A).
   S'il tient partout → vrai edge. Sinon → chance / sur-optimisation.
   Point-in-time strict, signaux de prix uniquement (comme le backtest).
   Écrit bourse/data/validate.json.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const fs = require("fs");
const path = require("path");
const Engine = require("../engine.js");

const DATA_DIR = path.join(__dirname, "..", "data");
const UA = { "User-Agent": "Mozilla/5.0 (compatible; OracleBourse/1.0)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const YEARS = 6, REBAL = 21, HORIZON = 21, MIN_HIST = 260, COST = 0.001, QUINTILES = 5;

// Univers A : là où le trend template a été « découvert » gagnant (grandes valeurs)
const UNIV_A = ["AAPL","MSFT","GOOGL","AMZN","META","NVDA","TSLA","AVGO","ORCL","CRM","ADBE","AMD","INTC","CSCO","QCOM","TXN","IBM","NOW","INTU","AMAT","MU","JPM","BAC","WFC","GS","MS","C","BLK","V","MA","SPGI","LLY","JNJ","MRK","ABBV","PFE","TMO","ABT","DHR","AMGN","UNH","XOM","CVX","COP","SLB","EOG","WMT","COST","PG","KO","PEP","MCD","NKE","HD","LOW","DIS","CAT","DE","BA","HON","GE","UNP","UPS","RTX","LMT","LIN","NEE","DUK","AMT","PLD","T","VZ","TMUS","CMCSA"];

// Univers B : aucune valeur de A → hors-échantillon total (autres grandes/moyennes valeurs)
const UNIV_B = ["MRVL","ON","MCHP","FTNT","ANET","DELL","WDAY","TEAM","DDOG","ZS","NET","HUBS","TTD","ROP","CDNS","SNPS","ADSK","MSCI","FICO","GRMN","GLW","STX","NXPI","SWKS","USB","PNC","TFC","COF","DFS","AIG","MET","PRU","ALL","AFL","FITB","HBAN","RF","KEY","CFG","NDAQ","ICE","CME","AMP","TROW","CI","HUM","ZTS","BSX","SYK","BDX","EW","IDXX","IQV","DXCM","HCA","MCK","CNC","RMD","WAT","F","GM","MAR","HLT","YUM","EL","KMB","GIS","HSY","KHC","STZ","ORLY","AZO","ROST","DG","DLTR","LULU","ULTA","ITW","PH","GD","NOC","CMI","PCAR","FDX","WM","RSG","VRSK","ODFL","FAST","PAYX","NUE","VMC","MLM","PSA","WELL","DLR","XEL","KR","SYY","ADM","VLO","DVN","FANG","HAL"];

async function get(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try { const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) }); if (!res.ok) throw new Error(`HTTP ${res.status}`); return await res.json(); }
    catch (e) { lastErr = e; if (i < tries - 1) await sleep(1500 * (i + 1)); }
  }
  throw lastErr;
}
async function history(symbol) {
  const j = await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${YEARS}y&interval=1d`);
  const r = j?.chart?.result?.[0]; if (!r) throw new Error("vide");
  const ts = r.timestamp || [], cl = r.indicators?.quote?.[0]?.close || [], out = [];
  for (let i = 0; i < ts.length; i++) if (cl[i] != null && isFinite(cl[i])) out.push({ t: ts[i], c: cl[i] });
  return out;
}
async function pool(items, n, fn) {
  const res = new Array(items.length); let idx = 0;
  async function w() { while (idx < items.length) { const i = idx++; try { res[i] = await fn(items[i]); } catch { res[i] = null; } } }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, w)); return res;
}
function closeAt(bars, t) { let lo = 0, hi = bars.length - 1, ans = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (bars[m].t <= t) { ans = m; lo = m + 1; } else hi = m - 1; } return ans; }
function windowArr(bars, idx) { const s = Math.max(0, idx - 299), w = []; for (let i = s; i <= idx; i++) w.push(bars[i].c); return w; }
function mean(a) { return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; }
function idxReturnsAt(g, idx) { const w = windowArr(g, idx); return { r21: Engine.periodReturn(w, 21), r63: Engine.periodReturn(w, 63), r126: Engine.periodReturn(w, 126) }; }

// Stratégies testées (signaux de prix)
const STRAT = {
  trend: (b) => b.trend,
  momentum: (b) => b.m,
  composite: (b) => 0.45 * b.t + 0.30 * b.m + 0.25 * b.rs,
};
function baseScores(w, idxRet) {
  const t = Engine.scoreTechnical(w, null).score, m = Engine.scoreMomentum(w).score;
  if (t == null || m == null) return null;
  const rs = Engine.relStrength(w, idxRet), tt = Engine.trendTemplate(w);
  return { t, m, rs: rs ? rs.score : 50, trend: tt ? tt.score : 50 };
}

// Backtest d'une stratégie sur un segment [gStart, gEnd] de la timeline de l'indice
function runSegment(barsBySym, gspc, gStart, gEnd, stratFn) {
  let eq = 100, mkt = 100; const tops = [], mkts = [], bots = [];
  for (let gi = gStart; gi + HORIZON <= gEnd; gi += REBAL) {
    const T = gspc[gi].t, Tf = gspc[gi + HORIZON].t, idxRet = idxReturnsAt(gspc, gi);
    const rows = [];
    for (const [, bars] of barsBySym) {
      const iT = closeAt(bars, T); if (iT < MIN_HIST - 1) continue;
      const iF = closeAt(bars, Tf); if (iF <= iT) continue;
      const b = baseScores(windowArr(bars, iT), idxRet); if (!b) continue;
      const sc = stratFn(b); if (sc == null) continue;
      rows.push({ sc, fwd: bars[iF].c / bars[iT].c - 1 });
    }
    if (rows.length < QUINTILES * 3) continue;
    rows.sort((a, b) => b.sc - a.sc);
    const p = rows.length / QUINTILES;
    const topRet = mean(rows.slice(0, Math.floor(p)).map((r) => r.fwd)) - COST;
    const botRet = mean(rows.slice(Math.floor((QUINTILES - 1) * p)).map((r) => r.fwd));
    const mktRet = gspc[gi + HORIZON].c / gspc[gi].c - 1;
    tops.push(topRet); bots.push(botRet); mkts.push(mktRet);
    eq *= (1 + topRet); mkt *= (1 + mktRet);
  }
  const n = tops.length; if (!n) return null;
  const years = (gspc[gEnd].t - gspc[gStart].t) / (365.25 * 86400);
  const ann = (e) => (Math.pow(e / 100, 1 / years) - 1) * 100;
  const hit = tops.filter((r, i) => r > mkts[i]).length / n * 100;
  return {
    periods: n, years: Math.round(years * 10) / 10,
    annStrat: Math.round(ann(eq) * 10) / 10, annMkt: Math.round(ann(mkt) * 10) / 10,
    vsMarket: Math.round((ann(eq) - ann(mkt)) * 10) / 10,
    hitPct: Math.round(hit), spread: Math.round((mean(tops) - mean(bots)) * 10000) / 100,
  };
}

async function loadUniverse(list) {
  const map = new Map();
  const fetched = await pool(list, 6, async (s) => ({ s, bars: await history(s) }));
  for (const r of fetched) if (r && r.bars && r.bars.length >= MIN_HIST + HORIZON) map.set(r.s, r.bars);
  return map;
}

async function main() {
  console.log("Validation hors-échantillon du trend template…");
  const gspc = await history("^GSPC").catch(() => null);
  if (!gspc || gspc.length < 400) { console.error("Indice indisponible."); process.exit(1); }
  const A = await loadUniverse(UNIV_A);
  const B = await loadUniverse(UNIV_B);
  console.log(`Univers A : ${A.size} valeurs | Univers B : ${B.size} valeurs`);

  const start = MIN_HIST, end = gspc.length - 1, mid = Math.floor((start + end) / 2);
  const segments = [
    { key: "A_full", label: "Univers A — période complète", univ: A, a: start, b: end, oos: false },
    { key: "A_h1", label: "Univers A — 1re moitié", univ: A, a: start, b: mid, oos: false },
    { key: "A_h2", label: "Univers A — 2e moitié", univ: A, a: mid, b: end, oos: true },
    { key: "B_full", label: "Univers B — panier DIFFÉRENT (hors-échantillon)", univ: B, a: start, b: end, oos: true },
    { key: "B_h2", label: "Univers B — 2e moitié (double hors-échantillon)", univ: B, a: mid, b: end, oos: true },
  ];

  const results = [];
  for (const seg of segments) {
    const trend = runSegment(seg.univ, gspc, seg.a, seg.b, STRAT.trend);
    const compo = runSegment(seg.univ, gspc, seg.a, seg.b, STRAT.composite);
    if (!trend) continue;
    results.push({ key: seg.key, label: seg.label, oos: seg.oos, trend, composite: compo });
    console.log(`  ${seg.label.padEnd(48)} trend ${trend.vsMarket >= 0 ? "+" : ""}${trend.vsMarket} vs marché, réussite ${trend.hitPct}%, spread ${trend.spread >= 0 ? "+" : ""}${trend.spread}%`);
  }

  // Verdict : le trend template tient-il HORS-échantillon ?
  const oos = results.filter((r) => r.oos);
  const oosWin = oos.filter((r) => r.trend.vsMarket > 0 && r.trend.spread > 0).length;
  const allWin = results.filter((r) => r.trend.vsMarket > 0).length;
  let verdict, verdictText;
  if (oos.length && oosWin === oos.length && allWin === results.length) {
    verdict = "robuste"; verdictText = "Le trend template garde son avantage sur TOUTES les périodes et sur un panier d'actions différent. C'est le signe d'un vrai edge, pas de la chance.";
  } else if (oosWin >= Math.ceil(oos.length / 2)) {
    verdict = "partiel"; verdictText = "Le trend template tient sur une partie des tests hors-échantillon, mais pas tous. Edge probable mais fragile : à surveiller, sans surestimer.";
  } else {
    verdict = "non_confirme"; verdictText = "Le trend template ne se confirme PAS hors-échantillon : son avantage sur la période initiale était probablement dû à la chance. On ne se ment pas — on n'y accorde pas de confiance particulière.";
  }

  const out = {
    generatedAt: new Date().toISOString(),
    method: "Validation hors-échantillon : re-test du trend template sur des périodes distinctes (1re/2e moitié) et sur un panier d'actions entièrement différent (univers B).",
    universeA: A.size, universeB: B.size, segments: results, verdict, verdictText,
    caveats: [
      "Toujours biais du survivant (valeurs actuelles).",
      "Signaux de prix uniquement ; ~6 ans d'historique — un vrai institutionnel testerait sur 20-30 ans et plusieurs marchés.",
      "Performances passées ≠ performances futures.",
    ],
  };
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, "validate.json"), JSON.stringify(out, null, 1));
  console.log(`\nVerdict : ${verdict.toUpperCase()}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
