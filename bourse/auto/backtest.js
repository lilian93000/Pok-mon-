#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — auto/backtest.js
   Valide le modèle sur l'historique : les actions bien notées ont-elles
   vraiment surperformé ? On rejoue le passé, sans tricher.

   Rigueur :
   · Point-in-time strict : à chaque date passée T, le score n'utilise
     QUE les cours jusqu'à T (aucune info du futur).
   · Uniquement les signaux de PRIX (technique + momentum + force
     relative) — les fondamentaux/news n'ont pas d'historique, les
     inclure serait du look-ahead. On l'assume et on le dit.
   · Coût de transaction déduit (~0,1 %/mois de rotation).
   · Biais du survivant : l'univers est un panier de grandes valeurs
     liquides d'aujourd'hui → à interpréter avec prudence (dit dans le
     rapport).

   Lourd (historique long × ~120 titres) → à lancer ponctuellement, pas
   chaque jour. Écrit bourse/data/backtest.json.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const fs = require("fs");
const path = require("path");
const Engine = require("../engine.js");

const DATA_DIR = path.join(__dirname, "..", "data");
const UA = { "User-Agent": "Mozilla/5.0 (compatible; OracleBourse/1.0)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const YEARS = 6;                 // profondeur d'historique
const REBAL = 21;                // rééquilibrage ~mensuel (jours de bourse)
const HORIZON = 21;              // rendement à ~1 mois
const MIN_HIST = 260;            // historique mini avant de scorer (1 an+)
const COST = 0.001;             // 0,1 %/mois de frais de rotation
const QUINTILES = 5;

/* Panier de grandes/moyennes valeurs US liquides, diversifié secteurs.
   Peu de disparitions → limite (sans éliminer) le biais du survivant. */
const UNIVERSE = [
  "AAPL","MSFT","GOOGL","AMZN","META","NVDA","TSLA","AVGO","ORCL","CRM","ADBE","AMD","INTC","CSCO","QCOM","TXN","IBM","NOW","INTU","AMAT","MU","ADI","LRCX","KLAC","PANW","CRWD","SNOW","SHOP","UBER","ABNB","PLTR","NFLX",
  "JPM","BAC","WFC","GS","MS","C","BLK","SCHW","AXP","V","MA","PYPL","SPGI","CB","PGR","MMC","BX","KKR",
  "LLY","UNH","JNJ","MRK","ABBV","PFE","TMO","ABT","DHR","BMY","AMGN","GILD","ISRG","VRTX","REGN","CVS","MDT","ELV",
  "XOM","CVX","COP","SLB","EOG","MPC","PSX","OXY","WMB","KMI",
  "WMT","COST","PG","KO","PEP","MCD","NKE","SBUX","TGT","LOW","HD","TJX","BKNG","CMG","DIS","CL","MDLZ","MO",
  "CAT","DE","BA","HON","GE","UNP","UPS","RTX","LMT","MMM","EMR","ETN","ADP","CSX","NSC",
  "LIN","SHW","FCX","NEM","APD","ECL",
  "NEE","DUK","SO","D","AEP",
  "AMT","PLD","EQIX","SPG","O","CCI",
  "T","VZ","TMUS","CMCSA",
];

async function get(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) { lastErr = e; if (i < tries - 1) await sleep(1500 * (i + 1)); }
  }
  throw lastErr;
}

async function history(symbol) {
  const j = await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${YEARS}y&interval=1d`);
  const r = j?.chart?.result?.[0];
  if (!r) throw new Error("vide");
  const ts = r.timestamp || [];
  const cl = r.indicators?.quote?.[0]?.close || [];
  const out = [];
  for (let i = 0; i < ts.length; i++) if (cl[i] != null && isFinite(cl[i])) out.push({ t: ts[i], c: cl[i] });
  return out;
}

async function pool(items, n, fn) {
  const res = new Array(items.length);
  let idx = 0;
  async function worker() { while (idx < items.length) { const i = idx++; try { res[i] = await fn(items[i]); } catch { res[i] = null; } } }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return res;
}

// Dernier cours à la date t (ou juste avant) — recherche binaire
function closeAt(bars, t) {
  let lo = 0, hi = bars.length - 1, ans = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (bars[m].t <= t) { ans = m; lo = m + 1; } else hi = m - 1; }
  return ans;
}

// Fenêtre de cours (jusqu'à l'index idx inclus), au plus 300 points
function window(bars, idx) {
  const start = Math.max(0, idx - 299);
  const w = [];
  for (let i = start; i <= idx; i++) w.push(bars[i].c);
  return w;
}

// Score de PRIX point-in-time (technique + momentum + force relative)
function priceScore(w, idxRet) {
  const t = Engine.scoreTechnical(w, null).score;
  const m = Engine.scoreMomentum(w).score;
  if (t == null || m == null) return null;
  const rs = Engine.relStrength(w, idxRet);
  return 0.45 * t + 0.30 * m + 0.25 * (rs ? rs.score : 50);
}

function idxReturnsAt(gspc, idx) {
  const w = window(gspc, idx);
  return { r21: Engine.periodReturn(w, 21), r63: Engine.periodReturn(w, 63), r126: Engine.periodReturn(w, 126) };
}

function mean(a) { return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; }
function std(a) { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); }

async function main() {
  console.log(`Backtest — ${UNIVERSE.length} valeurs, ${YEARS} ans, rééquilibrage ~mensuel, horizon ~1 mois.`);
  const gspcBars = await history("^GSPC").catch(() => null);
  if (!gspcBars || gspcBars.length < 300) { console.error("Indice indisponible — abandon."); process.exit(1); }
  console.log(`S&P 500 : ${gspcBars.length} séances récupérées.`);

  const barsBySym = new Map();
  const fetched = await pool(UNIVERSE, 6, async (s) => ({ s, bars: await history(s) }));
  for (const r of fetched) if (r && r.bars && r.bars.length >= MIN_HIST + HORIZON) barsBySym.set(r.s, r.bars);
  console.log(`${barsBySym.size}/${UNIVERSE.length} valeurs avec assez d'historique.`);

  // Dates de rééquilibrage = calendrier de l'indice, tous les REBAL jours
  const timeline = gspcBars.map((b) => b.t);
  const rebalIdx = [];
  for (let i = MIN_HIST; i + HORIZON < timeline.length; i += REBAL) rebalIdx.push(i);

  const quintFwd = Array.from({ length: QUINTILES }, () => []); // rendements fwd par quintile
  const topReturns = [], mktReturns = [];                       // par période (top quintile vs marché)
  let stratEquity = 100, mktEquity = 100, peak = 100, maxDD = 0;
  const curve = [];

  for (const gi of rebalIdx) {
    const T = timeline[gi];
    const Tfwd = timeline[gi + HORIZON];
    const idxRet = idxReturnsAt(gspcBars, gi);

    // Score + rendement futur de chaque titre à cette date
    const rows = [];
    for (const [sym, bars] of barsBySym) {
      const iT = closeAt(bars, T);
      if (iT < MIN_HIST - 1) continue;
      const iF = closeAt(bars, Tfwd);
      if (iF <= iT) continue;
      const score = priceScore(window(bars, iT), idxRet);
      if (score == null) continue;
      const fwd = bars[iF].c / bars[iT].c - 1;
      rows.push({ sym, score, fwd });
    }
    if (rows.length < QUINTILES * 3) continue;

    rows.sort((a, b) => b.score - a.score);
    const per = rows.length / QUINTILES;
    for (let q = 0; q < QUINTILES; q++) {
      const slice = rows.slice(Math.floor(q * per), Math.floor((q + 1) * per));
      const avg = mean(slice.map((r) => r.fwd));
      quintFwd[q].push(avg);
    }
    // Stratégie = quintile du haut, équipondéré, moins les frais
    const top = rows.slice(0, Math.floor(per));
    const topRet = mean(top.map((r) => r.fwd)) - COST;
    const mktRet = gspcBars[gi + HORIZON].c / gspcBars[gi].c - 1;
    topReturns.push(topRet); mktReturns.push(mktRet);

    stratEquity *= (1 + topRet);
    mktEquity *= (1 + mktRet);
    peak = Math.max(peak, stratEquity);
    maxDD = Math.max(maxDD, (peak - stratEquity) / peak);
    curve.push({ date: new Date(T * 1000).toISOString().slice(0, 10), strat: Math.round(stratEquity * 10) / 10, market: Math.round(mktEquity * 10) / 10 });
  }

  const periods = topReturns.length;
  const yearsCovered = (timeline[rebalIdx[rebalIdx.length - 1] + HORIZON] - timeline[rebalIdx[0]]) / (365.25 * 86400);
  const annStrat = (Math.pow(stratEquity / 100, 1 / yearsCovered) - 1) * 100;
  const annMkt = (Math.pow(mktEquity / 100, 1 / yearsCovered) - 1) * 100;
  const hit = topReturns.filter((r, i) => r > mktReturns[i]).length / periods * 100;
  const quintMean = quintFwd.map((a) => mean(a) * 100);
  // Sharpe simplifié (mensuel annualisé), sans taux sans risque
  const sharpe = std(topReturns) ? (mean(topReturns) / std(topReturns)) * Math.sqrt(12) : 0;
  const spread = quintMean[0] - quintMean[QUINTILES - 1]; // top − bottom, par mois

  const monotonic = quintMean.every((v, i) => i === 0 || v <= quintMean[i - 1] + 0.15); // score plus haut ⇒ rendement ≥
  let verdict;
  if (spread > 0.4 && annStrat > annMkt + 1 && hit >= 52) verdict = "edge";
  else if (spread > 0.1 && annStrat >= annMkt - 0.5) verdict = "leger";
  else verdict = "faible";

  const out = {
    generatedAt: new Date().toISOString(),
    scope: "Signaux de prix uniquement (technique + momentum + force relative). Fondamentaux/news non backtestables (pas d'historique).",
    universeSize: barsBySym.size, years: Math.round(yearsCovered * 10) / 10, periods,
    rebalance: "≈ mensuel", horizon: "≈ 1 mois", costPerRebalancePct: COST * 100,
    annReturnStrategy: Math.round(annStrat * 10) / 10,
    annReturnMarket: Math.round(annMkt * 10) / 10,
    hitRatePct: Math.round(hit),
    quintileMonthlyReturnsPct: quintMean.map((v) => Math.round(v * 100) / 100),
    topMinusBottomMonthlyPct: Math.round(spread * 100) / 100,
    monotonic, maxDrawdownPct: Math.round(maxDD * 1000) / 10, sharpe: Math.round(sharpe * 100) / 100,
    finalStrategy: Math.round(stratEquity), finalMarket: Math.round(mktEquity),
    verdict, curve,
    caveats: [
      "Biais du survivant : univers de grandes valeurs actuelles (les faillites/retraits passés manquent) → résultats un peu flattés.",
      "Ne teste que les signaux de prix, pas les fondamentaux ni les news.",
      "Coût de rotation estimé à 0,1 %/mois ; le vrai coût dépend de ton courtier.",
      "Les performances passées ne préjugent pas des performances futures.",
    ],
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, "backtest.json"), JSON.stringify(out, null, 1));

  console.log(`\n=== RÉSULTAT (${out.years} ans, ${periods} périodes) ===`);
  console.log(`Stratégie top quintile : ${out.annReturnStrategy}%/an  |  Marché : ${out.annReturnMarket}%/an`);
  console.log(`Rendement mensuel par quintile (haut→bas) : ${out.quintileMonthlyReturnsPct.join("  ")}`);
  console.log(`Écart haut−bas : ${out.topMinusBottomMonthlyPct}%/mois | Réussite vs marché : ${out.hitRatePct}% | Sharpe ${out.sharpe} | pire perte ${out.maxDrawdownPct}%`);
  console.log(`Verdict : ${verdict}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
