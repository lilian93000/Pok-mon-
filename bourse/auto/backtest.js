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

// Scores de base point-in-time (calculés une fois, réutilisés par toutes les stratégies)
function baseScores(w, idxRet) {
  const t = Engine.scoreTechnical(w, null).score;
  const m = Engine.scoreMomentum(w).score;
  if (t == null || m == null) return null;
  const rs = Engine.relStrength(w, idxRet);
  const tt = Engine.trendTemplate(w);
  const r21 = Engine.periodReturn(w, 21);
  return { t, m, rs: rs ? rs.score : 50, trend: tt ? tt.score : 50, meanrev: r21 == null ? null : -r21 };
}

// Chaque stratégie = une façon de noter à partir des scores de base
const STRATEGIES = {
  composite:    { label: "Modèle complet (tech+mom+RS)", fn: (b) => 0.45 * b.t + 0.30 * b.m + 0.25 * b.rs },
  momentum:     { label: "Momentum seul",                fn: (b) => b.m },
  technique:    { label: "Technique seule",              fn: (b) => b.t },
  forceRel:     { label: "Force relative seule",         fn: (b) => b.rs },
  trend:        { label: "Trend template seul",          fn: (b) => b.trend },
  retourMoyenne:{ label: "Retour à la moyenne (survendu)", fn: (b) => b.meanrev },
};

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

  const keys = Object.keys(STRATEGIES);
  // état par stratégie
  const S = {};
  for (const k of keys) S[k] = { top: [], bottom: [], eq: 100, peak: 100, maxDD: 0 };
  // version « prudente » : le modèle complet, mais uniquement quand le marché est haussier (sinon cash)
  const REG = { eq: 100, peak: 100, maxDD: 0, invested: 0 };
  const mktReturns = [];
  let mktEquity = 100, mPeak = 100, mMaxDD = 0;
  const quintFwd = Array.from({ length: QUINTILES }, () => []); // quintiles du modèle complet
  const curve = [];

  for (const gi of rebalIdx) {
    const T = timeline[gi];
    const Tfwd = timeline[gi + HORIZON];
    const idxRet = idxReturnsAt(gspcBars, gi);

    // Scores de base + rendement futur pour chaque titre
    const rows = [];
    for (const [sym, bars] of barsBySym) {
      const iT = closeAt(bars, T);
      if (iT < MIN_HIST - 1) continue;
      const iF = closeAt(bars, Tfwd);
      if (iF <= iT) continue;
      const b = baseScores(window(bars, iT), idxRet);
      if (!b) continue;
      rows.push({ sym, b, fwd: bars[iF].c / bars[iT].c - 1 });
    }
    if (rows.length < QUINTILES * 3) continue;
    const per = rows.length / QUINTILES;
    const mktRet = gspcBars[gi + HORIZON].c / gspcBars[gi].c - 1;
    mktReturns.push(mktRet);
    mktEquity *= (1 + mktRet); mPeak = Math.max(mPeak, mktEquity); mMaxDD = Math.max(mMaxDD, (mPeak - mktEquity) / mPeak);

    // Régime de marché : S&P au-dessus de sa moyenne 200 jours ?
    const gWin = window(gspcBars, gi);
    const gma200 = gWin.length >= 200 ? Engine.sma(gWin, 200).filter((x) => x != null).pop() : null;
    const regimeUp = gma200 == null ? true : gspcBars[gi].c > gma200;

    for (const k of keys) {
      const scored = rows.filter((r) => STRATEGIES[k].fn(r.b) != null)
        .map((r) => ({ fwd: r.fwd, score: STRATEGIES[k].fn(r.b) }))
        .sort((a, b) => b.score - a.score);
      if (scored.length < QUINTILES * 3) continue;
      const p = scored.length / QUINTILES;
      const topRet = mean(scored.slice(0, Math.floor(p)).map((r) => r.fwd)) - COST;
      const botRet = mean(scored.slice(Math.floor((QUINTILES - 1) * p)).map((r) => r.fwd));
      S[k].top.push(topRet); S[k].bottom.push(botRet);
      S[k].eq *= (1 + topRet); S[k].peak = Math.max(S[k].peak, S[k].eq); S[k].maxDD = Math.max(S[k].maxDD, (S[k].peak - S[k].eq) / S[k].peak);

      if (k === "composite") {
        for (let q = 0; q < QUINTILES; q++) quintFwd[q].push(mean(scored.slice(Math.floor(q * p), Math.floor((q + 1) * p)).map((r) => r.fwd)));
        // Modèle complet + filtre de régime : investi si marché haussier, sinon cash (0 %)
        const regRet = regimeUp ? topRet : 0;
        if (regimeUp) REG.invested++;
        REG.eq *= (1 + regRet); REG.peak = Math.max(REG.peak, REG.eq); REG.maxDD = Math.max(REG.maxDD, (REG.peak - REG.eq) / REG.peak);
        curve.push({ date: new Date(T * 1000).toISOString().slice(0, 10), strat: Math.round(S.composite.eq * 10) / 10, market: Math.round(mktEquity * 10) / 10, prudent: Math.round(REG.eq * 10) / 10 });
      }
    }
  }

  const periods = S.composite.top.length;
  const yearsCovered = (timeline[rebalIdx[rebalIdx.length - 1] + HORIZON] - timeline[rebalIdx[0]]) / (365.25 * 86400);
  const ann = (eq) => (Math.pow(eq / 100, 1 / yearsCovered) - 1) * 100;
  const r1 = (x) => Math.round(x * 10) / 10;
  const annMkt = ann(mktEquity);

  // Résumé par stratégie
  const strategies = keys.map((k) => {
    const st = S[k];
    const hit = st.top.filter((r, i) => r > mktReturns[i]).length / periods * 100;
    const spread = (mean(st.top) - mean(st.bottom)) * 100;
    const sharpe = std(st.top) ? (mean(st.top) / std(st.top)) * Math.sqrt(12) : 0;
    return {
      key: k, label: STRATEGIES[k].label,
      annReturn: r1(ann(st.eq)), vsMarket: r1(ann(st.eq) - annMkt),
      hitRatePct: Math.round(hit), spreadMonthlyPct: Math.round(spread * 100) / 100,
      maxDrawdownPct: r1(st.maxDD * 100), sharpe: Math.round(sharpe * 100) / 100, final: Math.round(st.eq),
    };
  });
  // Ajoute la version prudente (modèle + régime)
  strategies.push({
    key: "prudent", label: "Modèle complet + filtre marché (prudent)",
    annReturn: r1(ann(REG.eq)), vsMarket: r1(ann(REG.eq) - annMkt),
    hitRatePct: null, spreadMonthlyPct: null,
    maxDrawdownPct: r1(REG.maxDD * 100), sharpe: null, final: Math.round(REG.eq),
    note: `Investi ${Math.round(REG.invested / periods * 100)} % du temps (marché haussier), cash le reste.`,
  });

  // La meilleure stratégie « au sens risque/rendement » (rendement puis moindre drawdown)
  const best = [...strategies].sort((a, b) => (b.annReturn - b.maxDrawdownPct * 0.25) - (a.annReturn - a.maxDrawdownPct * 0.25))[0];

  const comp = strategies.find((s) => s.key === "composite");
  const quintMean = quintFwd.map((a) => mean(a) * 100);
  const spread = quintMean[0] - quintMean[QUINTILES - 1];
  const monotonic = quintMean.every((v, i) => i === 0 || v <= quintMean[i - 1] + 0.15);
  let verdict;
  if (best.vsMarket > 1.5 && best.key !== "prudent") verdict = "edge";
  else if (best.vsMarket > -0.5 || (best.key === "prudent" && best.maxDrawdownPct < mMaxDD * 100 - 5)) verdict = "leger";
  else verdict = "faible";

  const out = {
    generatedAt: new Date().toISOString(),
    scope: "Signaux de prix uniquement (technique + momentum + force relative + trend + retour à la moyenne). Fondamentaux/news non backtestables (pas d'historique).",
    universeSize: barsBySym.size, years: r1(yearsCovered), periods,
    rebalance: "≈ mensuel", horizon: "≈ 1 mois", costPerRebalancePct: COST * 100,
    annReturnMarket: r1(annMkt), marketMaxDrawdownPct: r1(mMaxDD * 100), finalMarket: Math.round(mktEquity),
    // compat affichage historique (modèle complet)
    annReturnStrategy: comp.annReturn, hitRatePct: comp.hitRatePct,
    maxDrawdownPct: comp.maxDrawdownPct, sharpe: comp.sharpe, finalStrategy: comp.final,
    quintileMonthlyReturnsPct: quintMean.map((v) => Math.round(v * 100) / 100),
    topMinusBottomMonthlyPct: Math.round(spread * 100) / 100, monotonic,
    strategies, bestKey: best.key, verdict, curve,
    caveats: [
      "Biais du survivant : univers de grandes valeurs actuelles → résultats un peu flattés.",
      "Ne teste que les signaux de prix, pas les fondamentaux ni les news.",
      "Coût de rotation estimé à 0,1 %/mois ; le vrai coût dépend de ton courtier.",
      "Les performances passées ne préjugent pas des performances futures.",
    ],
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, "backtest.json"), JSON.stringify(out, null, 1));

  console.log(`\n=== RÉSULTAT (${out.years} ans, ${periods} périodes) — Marché ${r1(annMkt)}%/an, pire perte -${r1(mMaxDD * 100)}% ===`);
  for (const s of strategies) {
    console.log(`  ${s.label.padEnd(42)} ${String(s.annReturn).padStart(6)}%/an  vs marché ${(s.vsMarket >= 0 ? "+" : "") + s.vsMarket}  | DD -${s.maxDrawdownPct}%${s.note ? "  (" + s.note + ")" : ""}`);
  }
  console.log(`\nMeilleure : ${best.label} | Verdict : ${verdict}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
