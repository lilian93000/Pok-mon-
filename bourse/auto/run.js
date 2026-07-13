#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — auto/run.js
   Screener quotidien du marché US en deux étapes (GitHub Actions,
   Node ≥ 18). Aucune clé API requise.

   ÉTAPE 1 — scan large : toutes les actions ordinaires US cotées
     (NASDAQ Trader Symbol Directory, ~5-6 000 titres), historiques
     1 an par lots de 20 via Yahoo Spark, pré-score technique+momentum.

   ÉTAPE 2 — analyse profonde des meilleurs candidats + favoris :
     · Cours + volumes : Yahoo Finance chart (repli : closes du scan)
     · News            : flux RSS Yahoo Finance
     · Fondamentaux    : Yahoo Finance quoteSummary — autonome, sans clé
                         (EDGAR est filtré par IP depuis les runners cloud) ;
                         Finnhub utilisé à la place si FINNHUB_API_KEY existe

   Sorties :
     · bourse/data/latest.json  — résultats complets pour la page web
     · bourse/data/history.json — top 5 quotidien (120 derniers jours)
     · bourse/data/rapport.md   — rapport lisible
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const fs = require("fs");
const path = require("path");
const Engine = require("../engine.js");
const { loadUniverse } = require("./universe.js");
const Fundamentals = require("./fundamentals.js");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const UA = { "User-Agent": "Mozilla/5.0 (compatible; OracleBourse/1.0)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ───────────── HTTP + pool de concurrence ───────────── */

async function get(url, { asText = false, tries = 3, headers = UA } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(25000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return asText ? await res.text() : await res.json();
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await sleep(1500 * (i + 1));
    }
  }
  throw lastErr;
}

/** Exécute fn(item) sur tous les items avec au plus n en parallèle. */
async function pool(items, n, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      try { results[i] = await fn(items[i], i); }
      catch (e) { results[i] = { __error: e }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return results;
}

/* ───────────── ÉTAPE 1 : scan du marché via Yahoo Spark ───────────── */

function parseSparkPayload(j) {
  // Format moderne : { spark: { result: [{ symbol, response: [chartLike] }] } }
  // Formats tolérés : { result: [...] } ou map { SYM: chartLike }
  const out = new Map();
  const list = j?.spark?.result || j?.result;
  const push = (symbol, node) => {
    const closes = (node?.indicators?.quote?.[0]?.close || node?.close || [])
      .filter((c) => c != null && isFinite(c));
    if (closes.length >= 60) out.set(symbol, closes);
  };
  if (Array.isArray(list)) {
    for (const r of list) push(r.symbol, r.response?.[0] || r);
  } else if (j && typeof j === "object") {
    for (const [sym, node] of Object.entries(j)) {
      if (node && typeof node === "object") push(sym, node.response?.[0] || node);
    }
  }
  return out;
}

async function scanMarket(symbols) {
  const closesBySym = new Map();
  const batches = [];
  for (let i = 0; i < symbols.length; i += 20) batches.push(symbols.slice(i, i + 20));

  let done = 0;
  await pool(batches, 5, async (batch) => {
    try {
      const j = await get(`https://query1.finance.yahoo.com/v8/finance/spark?symbols=${batch.join(",")}&range=1y&interval=1d`);
      for (const [sym, closes] of parseSparkPayload(j)) closesBySym.set(sym, closes);
    } catch { /* lot perdu — les titres seront simplement absents du scan du jour */ }
    done++;
    if (done % 40 === 0) console.log(`  … scan ${done}/${batches.length} lots (${closesBySym.size} historiques)`);
    await sleep(150);
  });
  return closesBySym;
}

function preScore(closes) {
  const t = Engine.scoreTechnical(closes, null).score;
  const m = Engine.scoreMomentum(closes).score;
  if (t == null || m == null) return null;
  return 0.55 * t + 0.45 * m;
}

/* ───────────── ÉTAPE 2 : analyse profonde ───────────── */

async function yahooChart(symbol) {
  const j = await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`);
  const r = j?.chart?.result?.[0];
  if (!r) throw new Error(j?.chart?.error?.description || "réponse Yahoo vide");
  const q = r.indicators?.quote?.[0] || {};
  const closes = [], volumes = [];
  for (let i = 0; i < (r.timestamp || []).length; i++) {
    const c = q.close?.[i];
    if (c != null && isFinite(c)) {
      closes.push(c);
      volumes.push(q.volume?.[i] ?? 0);
    }
  }
  if (closes.length < 40) throw new Error(`historique trop court (${closes.length} points)`);
  return { closes, volumes, name: r.meta?.longName || r.meta?.shortName || symbol };
}

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
}

async function yahooNews(symbol) {
  const xml = await get(`https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`, { asText: true });
  const items = [];
  for (const b of (xml.match(/<item>[\s\S]*?<\/item>/g) || []).slice(0, 20)) {
    const title = decodeEntities((b.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "").trim();
    const link = decodeEntities((b.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || "").trim();
    const pub = (b.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1];
    if (!title) continue;
    const dt = pub ? new Date(pub) : new Date();
    items.push({
      headline: title,
      daysAgo: Math.max(0, (Date.now() - dt.getTime()) / 864e5),
      source: "Yahoo Finance",
      url: link || undefined,
    });
  }
  return items;
}

async function finnhubFundamentals(symbol, key) {
  const j = await get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${key}`);
  const m = j.metric || {};
  const num = (x) => (x == null || isNaN(+x) ? null : +x);
  const de = num(m["totalDebt/totalEquityQuarterly"]);
  return {
    revenueGrowth: num(m.revenueGrowthTTMYoy),
    epsGrowth: num(m.epsGrowthTTMYoy),
    netMargin: num(m.netProfitMarginTTM),
    pe: num(m.peTTM),
    peg: num(m.pegRatio ?? m.pegTTM),
    debtToEquity: de != null ? de / 100 : null,
    roe: num(m.roeTTM),
  };
}

async function deepAnalyze(symbol, ctx) {
  const warnings = [];
  const sources = [];

  let prices = null;
  try {
    prices = await yahooChart(symbol);
    sources.push("Yahoo Finance (cours)");
  } catch (e) {
    const scanned = ctx.scanCloses.get(symbol);
    if (scanned) {
      prices = { closes: scanned, volumes: null, name: ctx.names.get(symbol) || symbol };
      sources.push("Yahoo Spark (cours du scan)");
      warnings.push(`Détail des cours indisponible (${e.message}) — volumes non analysés.`);
    } else {
      throw new Error(`cours introuvables : ${e.message}`);
    }
  }

  let news = null;
  try {
    news = await yahooNews(symbol);
    if (news.length) sources.push("Yahoo Finance (news)");
  } catch (e) {
    warnings.push(`News indisponibles : ${e.message}`);
  }

  let fundamentals = null;
  if (ctx.finnhubKey) {
    try {
      fundamentals = await finnhubFundamentals(symbol, ctx.finnhubKey);
      sources.push("Finnhub (fondamentaux)");
    } catch (e) {
      warnings.push(`Fondamentaux Finnhub indisponibles : ${e.message}`);
    }
  }
  if (!fundamentals && ctx.ysession) {
    try {
      fundamentals = await Fundamentals.fetchFundamentals(symbol, ctx.ysession);
      if (fundamentals) sources.push("Yahoo Finance (fondamentaux)");
      else warnings.push("Pas de fondamentaux Yahoo pour ce titre — pilier neutralisé.");
    } catch (e) {
      warnings.push(`Fondamentaux Yahoo indisponibles : ${e.message}`);
    }
  }

  const res = Engine.analyze({
    symbol,
    name: prices.name || ctx.names.get(symbol) || symbol,
    closes: prices.closes,
    volumes: prices.volumes,
    fundamentals,
    news,
  });
  res.closes = res.closes.slice(-130);
  res.news = (res.news || []).slice(0, 15);
  res.warnings = warnings;
  res.sources = sources;
  res.fromScan = !ctx.favorites.has(symbol);
  return res;
}

/* ───────────── Rapport markdown ───────────── */

function buildReport(results, meta) {
  const d = new Date(meta.generatedAt);
  const lines = [
    `# ◆ Oracle Bourse — screener quotidien du marché US`,
    ``,
    `Généré le **${d.toISOString().slice(0, 16).replace("T", " ")} UTC**`,
    ``,
    `**${meta.universe}** actions cotées répertoriées → **${meta.scanned}** scannées (technique + momentum) → ` +
      `**${results.length}** analysées en profondeur (+ fondamentaux SEC/news)` +
      (meta.failed.length ? ` · ${meta.failed.length} en échec` : ""),
    ``,
    `> ⚠️ Analyse statistique automatique — **pas un conseil financier**. Aucune garantie.`,
    ``,
    `| # | Titre | Score | Verdict | Tech. | Mom. | Fond. | Sent. | Conf. | Origine |`,
    `|---|-------|------:|---------|------:|-----:|------:|------:|------:|---------|`,
  ];
  const fmt = (v) => (v == null ? "—" : String(Math.round(v)));
  results.forEach((r, i) => {
    lines.push(
      `| ${i + 1} | **${r.symbol}** ${r.name && r.name !== r.symbol ? `(${r.name.slice(0, 40)})` : ""} | **${fmt(r.score)}** | ${r.verdict.emoji} ${r.verdict.label} ` +
      `| ${fmt(r.pillars.technical?.score)} | ${fmt(r.pillars.momentum?.score)} | ${fmt(r.pillars.fundamental?.score)} | ${fmt(r.pillars.sentiment?.score)} | ${r.confidence} % ` +
      `| ${r.fromScan ? "🔍 scan marché" : "⭐ favori"} |`
    );
  });

  const top = results.filter((r) => r.score >= 72).slice(0, 8);
  if (top.length) {
    lines.push(``, `## 🚀 Configurations les plus favorables du jour`);
    for (const r of top) {
      lines.push(``, `### ${r.symbol}${r.name && r.name !== r.symbol ? ` — ${r.name}` : ""} · ${Math.round(r.score)}/100`);
      const sigs = [
        ...(r.pillars.technical?.signals || []),
        ...(r.pillars.momentum?.signals || []),
        ...(r.pillars.fundamental?.signals || []),
        ...(r.pillars.sentiment?.signals || []),
      ].filter((s) => s.good).slice(0, 6);
      for (const s of sigs) lines.push(`- ▲ ${s.label}${s.detail ? ` — ${s.detail}` : ""}`);
    }
  }
  return lines.join("\n") + "\n";
}

/* ───────────── Main ───────────── */

async function main() {
  const t0 = Date.now();
  const finnhubKey = process.env.FINNHUB_API_KEY || "";
  const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, "watchlist.json"), "utf8"));
  const favorites = cfg.favorites || cfg.symbols || [];
  const nFinalists = cfg.finalists || 80;
  const minPrice = cfg.minPrice || 2;

  /* Étape 0 : univers + session Yahoo pour les fondamentaux */
  let universe = [];
  try {
    universe = await loadUniverse();
    console.log(`Univers : ${universe.length} actions ordinaires US répertoriées.`);
  } catch (e) {
    console.error(`Univers indisponible (${e.message}) — repli sur les favoris uniquement.`);
  }
  let ysession = null;
  if (!finnhubKey) {
    try {
      ysession = await Fundamentals.initSession();
      console.log(`Session fondamentaux Yahoo ouverte (crumb OK).`);
    } catch (e) {
      console.error(`Session fondamentaux Yahoo indisponible (${e.message}) — pilier fondamental neutralisé.`);
    }
  }
  const names = new Map(universe.map((u) => [u.symbol, u.name]));

  /* Étape 1 : scan du marché */
  let scanCloses = new Map();
  let candidates = [];
  if (universe.length) {
    console.log(`Étape 1 — scan technique+momentum du marché…`);
    scanCloses = await scanMarket(universe.map((u) => u.symbol));
    console.log(`  ${scanCloses.size} historiques récupérés.`);
    for (const [sym, closes] of scanCloses) {
      if (closes[closes.length - 1] < minPrice) continue;
      const s = preScore(closes);
      if (s != null) candidates.push({ sym, s });
    }
    candidates.sort((a, b) => b.s - a.s);
    console.log(`  ${candidates.length} candidats scorés — top 5 provisoire : ${candidates.slice(0, 5).map((c) => `${c.sym} (${c.s.toFixed(0)})`).join(", ")}`);
  }

  /* Étape 2 : analyse profonde (top scan + favoris) */
  const finalSet = new Set(favorites);
  for (const c of candidates) {
    if (finalSet.size >= nFinalists + favorites.length) break;
    finalSet.add(c.sym);
  }
  const finalSyms = [...finalSet];
  console.log(`Étape 2 — analyse profonde de ${finalSyms.length} titres (${favorites.length} favoris + top scan)…`);

  const ctx = { scanCloses, names, ysession, finnhubKey, favorites: new Set(favorites) };
  const results = [];
  const failed = [];
  const analyzed = await pool(finalSyms, 3, async (sym) => {
    const r = await deepAnalyze(sym, ctx);
    await sleep(250);
    return r;
  });
  analyzed.forEach((r, i) => {
    if (r && !r.__error) {
      results.push(r);
    } else {
      failed.push(finalSyms[i]);
      console.error(`  ✗ ${finalSyms[i]} : ${r?.__error?.message || "erreur inconnue"}`);
    }
  });

  if (!results.length) {
    console.error("Aucun titre analysé — abandon sans écrire de données.");
    process.exit(1);
  }

  results.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const generatedAt = new Date().toISOString();
  const meta = { generatedAt, universe: universe.length, scanned: scanCloses.size, failed };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, "latest.json"),
    JSON.stringify({ generatedAt, auto: true, universe: universe.length, scanned: scanCloses.size, failed, results }, null, 1)
  );

  const histFile = path.join(DATA_DIR, "history.json");
  let hist = [];
  try { hist = JSON.parse(fs.readFileSync(histFile, "utf8")); } catch { /* premier passage */ }
  const day = generatedAt.slice(0, 10);
  hist = hist.filter((h) => h.date !== day);
  hist.push({ date: day, top: results.slice(0, 5).map((r) => ({ symbol: r.symbol, score: Math.round(r.score ?? 0) })) });
  fs.writeFileSync(histFile, JSON.stringify(hist.slice(-120), null, 1));

  const report = buildReport(results, meta);
  fs.writeFileSync(path.join(DATA_DIR, "rapport.md"), report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);

  const withFund = results.filter((r) => r.pillars.fundamental?.score != null).length;
  console.log(`\nTerminé en ${((Date.now() - t0) / 60000).toFixed(1)} min : ${meta.scanned} scannées, ${results.length} analysées (${withFund} avec fondamentaux), ${failed.length} échecs.`);
  console.log(`Top 5 : ${results.slice(0, 5).map((r) => `${r.symbol} (${Math.round(r.score)})`).join(", ")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
