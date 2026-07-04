#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — auto/run.js
   Robot d'analyse quotidienne (GitHub Actions, Node ≥ 18).

   Sources — aucune clé requise :
     · Cours + volumes : Yahoo Finance chart API (repli : Stooq CSV)
     · News            : flux RSS Yahoo Finance par ticker
     · Fondamentaux    : Finnhub, seulement si FINNHUB_API_KEY est défini
                         (secret optionnel — sinon pilier neutralisé)

   Sorties :
     · bourse/data/latest.json  — résultats complets pour la page web
     · bourse/data/history.json — top 5 quotidien (120 derniers jours)
     · bourse/data/rapport.md   — rapport lisible
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const fs = require("fs");
const path = require("path");
const Engine = require("../engine.js");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const UA = { "User-Agent": "Mozilla/5.0 (compatible; OracleBourse/1.0)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ───────────── HTTP avec retries ───────────── */

async function get(url, { asText = false, tries = 3 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return asText ? await res.text() : await res.json();
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await sleep(1500 * (i + 1));
    }
  }
  throw lastErr;
}

/* ───────────── Cours : Yahoo, repli Stooq ───────────── */

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
  return { closes, volumes, name: r.meta?.longName || r.meta?.shortName || symbol, source: "Yahoo Finance" };
}

async function stooqDaily(symbol) {
  const csv = await get(`https://stooq.com/q/d/l/?s=${symbol.toLowerCase()}.us&i=d`, { asText: true });
  const lines = csv.trim().split("\n").slice(1); // en-tête : Date,Open,High,Low,Close,Volume
  const closes = [], volumes = [];
  for (const line of lines.slice(-300)) {
    const cols = line.split(",");
    const c = parseFloat(cols[4]);
    if (isFinite(c)) {
      closes.push(c);
      volumes.push(parseFloat(cols[5]) || 0);
    }
  }
  if (closes.length < 40) throw new Error("historique Stooq trop court");
  return { closes, volumes, name: symbol, source: "Stooq" };
}

/* ───────────── News : RSS Yahoo ───────────── */

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
}

async function yahooNews(symbol) {
  const xml = await get(`https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`, { asText: true });
  const items = [];
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const b of blocks.slice(0, 20)) {
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

/* ───────────── Fondamentaux : Finnhub (optionnel) ───────────── */

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

/* ───────────── Analyse d'un titre ───────────── */

async function analyzeSymbol(symbol, finnhubKey) {
  const warnings = [];
  const sources = [];

  let prices = null;
  try {
    prices = await yahooChart(symbol);
  } catch (e1) {
    try {
      prices = await stooqDaily(symbol);
      warnings.push(`Yahoo indisponible (${e1.message}) — repli sur Stooq.`);
    } catch (e2) {
      throw new Error(`cours introuvables (Yahoo : ${e1.message} ; Stooq : ${e2.message})`);
    }
  }
  sources.push(`${prices.source} (cours)`);

  let news = null;
  try {
    news = await yahooNews(symbol);
    if (news.length) sources.push("Yahoo Finance (news)");
  } catch (e) {
    warnings.push(`News indisponibles : ${e.message}`);
  }

  let fundamentals = null;
  if (finnhubKey) {
    try {
      fundamentals = await finnhubFundamentals(symbol, finnhubKey);
      sources.push("Finnhub (fondamentaux)");
    } catch (e) {
      warnings.push(`Fondamentaux indisponibles : ${e.message}`);
    }
  }

  const res = Engine.analyze({
    symbol,
    name: prices.name,
    closes: prices.closes,
    volumes: prices.volumes,
    fundamentals,
    news,
  });
  res.closes = res.closes.slice(-130); // la page n'a besoin que de ~6 mois
  res.news = (res.news || []).slice(0, 15);
  res.warnings = warnings;
  res.sources = sources;
  return res;
}

/* ───────────── Rapport markdown ───────────── */

function buildReport(results, generatedAt, failed) {
  const d = new Date(generatedAt);
  const lines = [
    `# ◆ Oracle Bourse — rapport automatique`,
    ``,
    `Généré le **${d.toISOString().slice(0, 16).replace("T", " ")} UTC** · ${results.length} titres analysés` +
      (failed.length ? ` · ${failed.length} en échec (${failed.join(", ")})` : ""),
    ``,
    `> ⚠️ Analyse statistique automatique — **pas un conseil financier**. Aucune garantie.`,
    ``,
    `| # | Titre | Score | Verdict | Technique | Momentum | Fondamental | Sentiment | Confiance |`,
    `|---|-------|------:|---------|----------:|---------:|------------:|----------:|----------:|`,
  ];
  const fmt = (v) => (v == null ? "—" : String(Math.round(v)));
  results.forEach((r, i) => {
    lines.push(
      `| ${i + 1} | **${r.symbol}** ${r.name !== r.symbol ? `(${r.name})` : ""} | **${fmt(r.score)}** | ${r.verdict.emoji} ${r.verdict.label} ` +
      `| ${fmt(r.pillars.technical?.score)} | ${fmt(r.pillars.momentum?.score)} | ${fmt(r.pillars.fundamental?.score)} | ${fmt(r.pillars.sentiment?.score)} | ${r.confidence} % |`
    );
  });

  const top = results.filter((r) => r.score >= 70).slice(0, 5);
  if (top.length) {
    lines.push(``, `## 🚀 Configurations les plus favorables`);
    for (const r of top) {
      lines.push(``, `### ${r.symbol} — ${Math.round(r.score)}/100`);
      const sigs = [
        ...(r.pillars.technical?.signals || []),
        ...(r.pillars.momentum?.signals || []),
        ...(r.pillars.fundamental?.signals || []),
        ...(r.pillars.sentiment?.signals || []),
      ].filter((s) => s.good).slice(0, 5);
      for (const s of sigs) lines.push(`- ▲ ${s.label}${s.detail ? ` — ${s.detail}` : ""}`);
    }
  }
  return lines.join("\n") + "\n";
}

/* ───────────── Main ───────────── */

async function main() {
  const finnhubKey = process.env.FINNHUB_API_KEY || "";
  const wl = JSON.parse(fs.readFileSync(path.join(__dirname, "watchlist.json"), "utf8"));
  const symbols = wl.symbols || [];
  console.log(`Oracle Bourse — analyse de ${symbols.length} titres` + (finnhubKey ? " (fondamentaux Finnhub activés)" : " (sans fondamentaux — pas de clé Finnhub)"));

  const results = [];
  const failed = [];
  for (const sym of symbols) {
    try {
      const r = await analyzeSymbol(sym, finnhubKey);
      results.push(r);
      console.log(`  ✓ ${sym.padEnd(6)} score ${r.score != null ? Math.round(r.score) : "—"} — ${r.verdict.label}`);
    } catch (e) {
      failed.push(sym);
      console.error(`  ✗ ${sym.padEnd(6)} ${e.message}`);
    }
    await sleep(400); // politesse envers les API
  }

  if (!results.length) {
    console.error("Aucun titre analysé — abandon sans écrire de données.");
    process.exit(1);
  }

  results.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  const generatedAt = new Date().toISOString();

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, "latest.json"),
    JSON.stringify({ generatedAt, auto: true, failed, results }, null, 1)
  );

  // Historique : top 5 du jour, 120 derniers points
  const histFile = path.join(DATA_DIR, "history.json");
  let hist = [];
  try { hist = JSON.parse(fs.readFileSync(histFile, "utf8")); } catch { /* premier passage */ }
  const day = generatedAt.slice(0, 10);
  hist = hist.filter((h) => h.date !== day);
  hist.push({ date: day, top: results.slice(0, 5).map((r) => ({ symbol: r.symbol, score: Math.round(r.score ?? 0) })) });
  fs.writeFileSync(histFile, JSON.stringify(hist.slice(-120), null, 1));

  const report = buildReport(results, generatedAt, failed);
  fs.writeFileSync(path.join(DATA_DIR, "rapport.md"), report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);

  console.log(`\nTerminé : ${results.length} analysés, ${failed.length} échecs.`);
  console.log(`Top 3 : ${results.slice(0, 3).map((r) => `${r.symbol} (${Math.round(r.score)})`).join(", ")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
