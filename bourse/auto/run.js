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
  let profile = null;
  if (ctx.ysession) {
    try {
      const qs = await Fundamentals.fetchQuoteSummary(symbol, ctx.ysession);
      profile = qs.profile;
      if (!fundamentals && qs.fundamentals) { fundamentals = qs.fundamentals; sources.push("Yahoo Finance (fondamentaux)"); }
      else if (!fundamentals) warnings.push("Pas de fondamentaux Yahoo pour ce titre — pilier neutralisé.");
    } catch (e) {
      if (!fundamentals) warnings.push(`Fondamentaux Yahoo indisponibles : ${e.message}`);
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
  res.fundamentals = fundamentals || null;   // chiffres bruts, pour l'analyse détaillée
  res.profile = profile || null;             // profil d'entreprise du jour (secteur, taille…)
  res.analysis = writtenAnalysis(res);       // analyse écrite (pourquoi investir, forces, risques…)
  return res;
}

/* ───────────── Picks du jour ─────────────
   Trois sélections complémentaires parmi les titres analysés :
     · long terme  — fondamentaux solides + faible volatilité
     · complet     — meilleur score global (équilibré sur les 4 piliers)
     · one shot    — momentum/technique explosif (risqué)
   Les trois sont distincts. */

/* Traduit les signaux techniques en une phrase compréhensible par un débutant :
   « pourquoi cette action précise est intéressante ». */
function plainReason(r, category) {
  const good = (k) => (r.pillars?.[k]?.signals || []).filter((s) => s.good);
  const has = (k, re) => good(k).some((s) => re.test(s.label));
  const grab = (k, re) => {
    for (const s of good(k)) { const m = s.label.match(re); if (m) return parseFloat(m[1]); }
    return null;
  };

  const caG = grab("fundamental", /Croissance CA\s*:\s*\+?(-?[\d.]+)/);
  const epsG = grab("fundamental", /Croissance BPA\s*:\s*\+?(-?[\d.]+)/);
  const per = grab("fundamental", /PER\s*:\s*([\d.]+)/);
  const pegCheap = has("fundamental", /PEG/);
  const lowDebt = has("fundamental", /Dette\/fonds/); // signalé seulement si bon

  const perf3 = grab("momentum", /Perf 3 mois\s*:\s*\+?(-?[\d.]+)/);
  const accel = has("momentum", /accélération/);
  const trend = has("technical", /Tendance/);
  const breakout = has("technical", /plus-haut|Cassure/);
  const aboveMA = has("technical", /Prix vs MM/);
  const news = has("sentiment", /Ton des news|Buzz/);
  const accumulation = has("technical", /Volume/);

  // Briques « fondamental » (la qualité de l'entreprise)
  const fond = [];
  if (caG != null && caG > 12) fond.push(`son chiffre d'affaires progresse vite (+${Math.round(caG)} %/an)`);
  if (epsG != null && epsG > 12) fond.push(`ses bénéfices sont en forte hausse (+${Math.round(epsG)} %/an)`);
  if (per != null && per > 0 && per < 22) fond.push(`et l'action reste raisonnablement valorisée (PER ${Math.round(per)})`);
  else if (pegCheap) fond.push(`et sa croissance n'est pas encore payée au prix fort`);
  if (!fond.length && lowDebt) fond.push(`l'entreprise est peu endettée`);

  // Briques « marché » (le comportement du cours)
  const marche = [];
  if (perf3 != null && perf3 > 0) marche.push(`elle a déjà pris +${Math.round(perf3)} % en 3 mois`);
  if (breakout) marche.push(`elle est au plus haut de l'année`);
  else if (trend || aboveMA) marche.push(`sa tendance de fond est haussière`);
  if (accel) marche.push(`et le mouvement s'accélère`);
  if (!marche.length && accumulation) marche.push(`les gros investisseurs accumulent le titre`);
  if (news) marche.push(`l'actualité récente joue en sa faveur`);

  // Capitalise le début de chaque phrase (après un point)
  const capSentences = (s) => s.replace(/(^\s*|[.!?]\s+)([a-zà-ÿ])/g, (_, p, c) => p + c.toUpperCase());
  let phrase;
  if (category === "Long terme") {
    phrase = [fond.slice(0, 3).join(", "), marche.slice(0, 1).join("")].filter(Boolean).join(". ");
  } else if (category === "One shot") {
    phrase = [marche.slice(0, 3).join(", "), fond.slice(0, 1).join("")].filter(Boolean).join(". ");
  } else {
    phrase = [fond.slice(0, 2).join(", "), marche.slice(0, 2).join(", ")].filter(Boolean).join(". ");
  }
  phrase = phrase ? capSentences(phrase.replace(/\.\s*\.$/, ".")) : "Configuration globalement favorable selon les 4 piliers.";
  if (!/[.!?]$/.test(phrase)) phrase += ".";

  const v = r.pillars?.momentum?.volatility ?? null;
  if (category === "One shot" && v != null && v > 45) {
    phrase += ` ⚠️ Mais elle bouge beaucoup (volatilité ${Math.round(v)} %) : petite somme et sortie prévue.`;
  }
  return phrase;
}

/* Formate une capitalisation boursière en dollars lisibles (2,3 Md$, 450 M$…). */
function fmtCap(x) {
  if (x == null || !isFinite(x)) return null;
  if (x >= 1e12) return `${(x / 1e12).toFixed(1).replace(".", ",")} T$`;
  if (x >= 1e9) return `${(x / 1e9).toFixed(1).replace(".", ",")} Md$`;
  if (x >= 1e6) return `${Math.round(x / 1e6)} M$`;
  return `${Math.round(x)} $`;
}

/* Analyse écrite détaillée et pédagogique, générée à partir des chiffres réels.
   Renvoie { resume, pourquoi, piliers[], forces[{lead,detail}], vigilance[{lead,detail}], profil, pratique }. */
function writtenAnalysis(r) {
  const P = r.pillars || {};
  const f = r.fundamentals || {};
  const sc = (k) => (P[k]?.score != null ? Math.round(P[k].score) : null);
  const grab = (k, re) => {
    for (const s of (P[k]?.signals || [])) { const m = s.label.match(re); if (m) return parseFloat(m[1]); }
    return null;
  };
  const has = (k, re, good = true) => (P[k]?.signals || []).some((s) => s.good === good && re.test(s.label));
  const vol = P.momentum?.volatility != null ? Math.round(P.momentum.volatility) : null;
  const name = r.name && r.name !== r.symbol ? r.name : r.symbol;
  const round = (x) => Math.round(x);

  // Fondamentaux (bruts si dispo, sinon relus dans les signaux)
  const caG = f.revenueGrowth != null ? f.revenueGrowth : grab("fundamental", /Croissance CA\s*:\s*\+?(-?[\d.]+)/);
  const epsG = f.epsGrowth != null ? f.epsGrowth : grab("fundamental", /Croissance BPA\s*:\s*\+?(-?[\d.]+)/);
  const per = f.pe != null ? f.pe : grab("fundamental", /PER\s*:\s*([\d.]+)/);
  const peg = f.peg != null ? f.peg : grab("fundamental", /PEG\s*:\s*([\d.]+)/);
  const margin = f.netMargin;
  const roe = f.roe;
  const debt = f.debtToEquity;

  // Technique / momentum (relus dans les signaux)
  const rsi = grab("technical", /RSI 14 j\s*:\s*(\d+)/);
  const trendM = grab("technical", /Tendance 60 j\s*:\s*\+?(-?[\d.]+)/);
  const distHigh = grab("technical", /À\s*(-?[\d.]+)\s*% du plus-haut/);
  const perf3 = grab("momentum", /Perf 3 mois\s*:\s*\+?(-?[\d.]+)/);
  const breakout = has("technical", /plus-haut|Cassure/);
  const aboveMA = has("technical", /Prix vs MM/);
  const macdUp = has("technical", /MACD : positif/) && has("technical", /en hausse/);
  const volumeAcc = has("technical", /Volume/);
  const accel = has("momentum", /accélération/);
  const decel = has("momentum", /décélération/, false);
  const newsPos = has("sentiment", /Ton des news|Buzz/);
  const newsNeg = has("sentiment", /Ton des news|avertissement/, false);

  // ── Résumé ── (ancré sur le profil du jour quand il est disponible)
  const prof = r.profile || {};
  let ident = "";
  if (prof.sector || prof.industry) {
    const bits = [prof.industry || prof.sector];
    if (prof.marketCap) bits.push(`capitalisation ${fmtCap(prof.marketCap)}`);
    ident = ` C'est une entreprise du secteur « ${prof.sector || prof.industry} »${prof.industry && prof.sector ? ` (${prof.industry})` : ""}${prof.marketCap ? `, capitalisée ${fmtCap(prof.marketCap)}` : ""}.`;
  }
  let resume = `${name} obtient une note globale de ${round(r.score)}/100 (${r.verdict.label.toLowerCase()}), en pesant quatre familles de critères : la santé financière de l'entreprise, la tendance de son cours, sa dynamique récente et le ton de l'actualité.${ident}`;
  if (caG != null && caG > 12 && (aboveMA || (trendM != null && trendM > 0))) {
    resume += " Le point clé : c'est une entreprise qui grandit vite ET dont le cours suit — les fondamentaux et le marché racontent la même histoire, ce qui est le cas de figure le plus solide.";
  } else if (aboveMA || (trendM != null && trendM > 0)) {
    resume += " Le point clé : sa force vient surtout de la dynamique de son cours ; c'est davantage un pari sur la tendance que sur les chiffres de l'entreprise.";
  } else if (caG != null && caG > 12) {
    resume += " Le point clé : l'entreprise croît vite, mais son cours est encore hésitant — l'intérêt est là si tu es patient.";
  } else {
    resume += " Sa configuration est contrastée : il y a du bon et du moins bon, à peser avant de décider.";
  }

  // ── Pourquoi maintenant ──
  const now = [];
  if (trendM != null && trendM > 1) now.push(`le cours progresse de façon régulière (environ ${round(trendM)} %/mois sur les 3 derniers mois), ce qui montre un flux d'achats constant et pas un simple coup de chaud`);
  else if (aboveMA) now.push("le cours se maintient au-dessus de ses moyennes 50 et 200 jours — la manière la plus simple de constater que la tendance est saine à court comme à long terme");
  if (breakout) now.push("il évolue au contact de son plus-haut de l'année : quand une action franchit ses sommets, plus personne n'est « coincé » avec une perte au-dessus, ce qui dégage la voie pour continuer à monter");
  if (rsi != null && rsi >= 45 && rsi <= 72) now.push(`son élan est sain (RSI ${round(rsi)}, ni suracheté ni survendu), donc la hausse a encore de la marge avant de fatiguer`);
  if (macdUp) now.push("son principal indicateur de tendance (le MACD) est orienté à la hausse et s'accélère");
  if (volumeAcc) now.push("les volumes d'échange sont au-dessus de la normale, signe que de gros investisseurs accumulent");
  if (accel) now.push("et la performance du dernier mois dépasse le rythme du trimestre — le mouvement gagne en vitesse");

  let pourquoi;
  if (now.length) {
    pourquoi = `Ce qui rend le moment intéressant, concrètement : ${now.slice(0, 4).join(" ; ")}. `;
  } else {
    pourquoi = "Côté timing, le cours n'est pas dans une dynamique forte pour l'instant : l'intérêt de ce titre repose surtout sur ses chiffres, pas sur son momentum. ";
  }
  if (caG != null && caG > 8) {
    pourquoi += `Et surtout, cette hausse s'appuie sur du concret : le chiffre d'affaires progresse de ${round(caG)} %/an`;
    if (epsG != null && epsG > 0) pourquoi += `, et les bénéfices encore plus vite (+${round(epsG)} %/an), ce qui veut dire que l'entreprise devient plus rentable à mesure qu'elle grandit`;
    pourquoi += ". Une action portée par de vrais résultats se tient mieux dans la durée qu'une action portée par le seul enthousiasme — c'est la différence entre une tendance et une bulle.";
  } else if (sc("fundamental") != null) {
    pourquoi += "Côté chiffres, l'entreprise est correcte sans être exceptionnelle : le principal moteur reste ici le comportement du cours.";
  }
  if (newsPos) pourquoi += " Enfin, l'actualité récente (résultats, contrats, relèvements d'objectifs) alimente l'intérêt et entretient le mouvement.";

  // ── Ce que disent les 4 piliers ──
  const lvl = (s, hi, mid) => (s == null ? null : s >= hi ? "haut" : s >= mid ? "moyen" : "bas");
  const piliers = [];
  const t = sc("technical"), m = sc("momentum"), fo = sc("fundamental"), se = sc("sentiment");
  if (t != null) piliers.push(`Technique ${t}/100 (poids 35 %) — ${t >= 70 ? "le graphique est clairement bien orienté" : t >= 50 ? "graphique correct, sans excès" : "graphique fragile, tendance peu convaincante"}.`);
  if (m != null) piliers.push(`Momentum ${m}/100 (poids 15 %) — ${m >= 70 ? "forte dynamique récente, le titre surperforme" : m >= 50 ? "dynamique honnête" : "peu de dynamique, le marché n'accompagne pas encore"}.`);
  piliers.push(fo != null
    ? `Fondamental ${fo}/100 (poids 30 %) — ${fo >= 70 ? "chiffres financiers solides (croissance, rentabilité, valorisation)" : fo >= 50 ? "chiffres corrects, dans la moyenne" : "chiffres financiers faibles"}.`
    : `Fondamental — non évalué (données financières indisponibles pour ce titre).`);
  if (se != null) piliers.push(`Sentiment ${se}/100 (poids 20 %) — ${se >= 65 ? "la presse récente est nettement positive" : se >= 50 ? "actualité neutre à légèrement positive" : "actualité mitigée à négative"}.`);

  // ── Forces (lead + explication avec repères) ──
  const forces = [];
  const push = (arr, lead, detail) => arr.push({ lead, detail });
  if (caG != null && caG > 12) {
    let d = `Une entreprise « normale » croît de 3 à 8 % par an ; au-delà de 12-15 %, on parle de forte croissance. C'est le premier moteur d'une action qui monte durablement.`;
    push(forces, `Croissance rapide : chiffre d'affaires +${round(caG)} %/an${epsG != null && epsG > 0 ? `, bénéfices +${round(epsG)} %/an` : ""}`, d);
  }
  if (per != null && per > 0 && per < 25) {
    let d = `Pour comparer : le marché américain se paie en moyenne autour de 20 fois les bénéfices. `;
    if (peg != null && peg > 0 && peg < 1.2) d += `Ici tu paies ${round(per)} fois pour une entreprise en forte croissance, et le PEG de ${peg.toFixed(2)} (sous 1 = bon marché) confirme que la croissance n'est pas encore payée au prix fort — le critère favori des investisseurs « croissance à bon prix ».`;
    else d += `Un PER de ${round(per)} est ${per < 15 ? "plutôt bas" : "raisonnable"} : tu n'achètes pas l'action trop cher.`;
    push(forces, `Action pas chère pour ce qu'elle offre (PER ${round(per)}${peg != null && peg > 0 ? `, PEG ${peg.toFixed(2)}` : ""})`, d);
  }
  if (margin != null && margin >= 8) {
    push(forces, `Entreprise rentable : marge nette de ${round(margin)} %`,
      `Sur 100 $ de ventes, il reste ${round(margin)} $ de bénéfice net. Au-dessus de 15 %, c'est très rentable ; une bonne marge protège l'entreprise quand la conjoncture se durcit.`);
  }
  if (roe != null && roe >= 15) {
    push(forces, `Bon rendement des capitaux (ROE ${round(roe)} %)`,
      `Le ROE mesure ce que l'entreprise rapporte avec l'argent des actionnaires. Au-dessus de 15 %, c'est le signe d'une société bien gérée qui réinvestit efficacement.`);
  }
  if (debt != null && debt < 1) {
    push(forces, `Peu endettée (dette/fonds propres ${debt.toFixed(1)})`,
      `Elle ne dépend pas des banques pour fonctionner — un vrai atout quand les taux d'intérêt sont élevés, car sa charge d'intérêts reste légère.`);
  }
  if (aboveMA) {
    push(forces, `Tendance haussière confirmée`,
      `Le cours est au-dessus de ses moyennes 50 et 200 jours. C'est la façon la plus fiable de constater que la tendance est bonne à court terme (50 j) ET à long terme (200 j).`);
  }
  if (breakout) {
    push(forces, `Au plus haut de l'année`,
      `Franchir ses sommets libère l'action des vendeurs « piégés » au-dessus du cours ; historiquement, les cassures de plus-hauts attirent de nouveaux acheteurs.`);
  }
  if (perf3 != null && perf3 > 0) {
    push(forces, `Déjà +${round(perf3)} % sur 3 mois${accel ? ", et ça accélère" : ""}`,
      `L'effet « momentum » est l'un des rares phénomènes robustes en bourse : les actions qui montent ont tendance à continuer à court terme, portées par l'afflux d'acheteurs.`);
  }
  if (newsPos) {
    push(forces, `Actualité porteuse`,
      `Le flux de nouvelles (contrats, résultats records, relèvements d'objectifs, notes d'analystes) est favorable et entretient l'attention du marché sur le titre.`);
  }
  if (!forces.length) push(forces, "Configuration équilibrée", "Aucun pilier ne se détache nettement, mais l'ensemble reste correct sur les quatre familles de critères.");

  // ── Vigilance (lead + explication) ──
  const vigilance = [];
  if (vol != null && vol > 50) push(vigilance, `Titre très volatil (${vol} %)`, `Il peut perdre 20 à 30 % en quelques séances sur une mauvaise nouvelle. N'y mets qu'une petite part de ton épargne et fixe une limite de perte à l'avance.`);
  else if (vol != null && vol > 35) push(vigilance, `Volatilité notable (${vol} %)`, `Attends-toi à des variations marquées : ce n'est pas un titre « tranquille » que l'on oublie dans un tiroir.`);
  if (per != null && per > 45) push(vigilance, `Valorisation tendue (PER ${round(per)})`, `Tu paies très cher les bénéfices actuels : beaucoup de croissance est déjà « dans le prix », donc la moindre déception peut faire chuter le cours brutalement.`);
  if (debt != null && debt > 2) push(vigilance, `Endettement élevé (dette/fonds propres ${debt.toFixed(1)})`, `L'entreprise s'appuie fortement sur la dette : c'est un facteur de fragilité si les taux montent ou si l'activité ralentit.`);
  if (sc("momentum") != null && sc("momentum") < 40) push(vigilance, `Momentum faible`, `La dynamique de hausse n'est pas là : le marché n'accompagne pas (encore) l'histoire de l'entreprise.`);
  if (decel) push(vigilance, `Hausse en essoufflement`, `Le rythme des dernières semaines ralentit par rapport au trimestre — la tendance pourrait marquer une pause.`);
  if (distHigh != null && distHigh < -20) push(vigilance, `Loin de ses sommets (${round(distHigh)} % sous le plus-haut)`, `Le titre doit encore prouver qu'il peut repartir : il reste du chemin avant de retrouver ses niveaux hauts.`);
  if (newsNeg) push(vigilance, `Actualité récente défavorable`, `Le ton de la presse est négatif en ce moment : à surveiller de près avant d'entrer.`);
  if (sc("fundamental") == null) push(vigilance, `Pas de données financières`, `L'analyse repose seulement sur le cours : on ne sait pas si l'entreprise est rentable ni comment elle croît. Prudence supplémentaire.`);
  if (r.confidence != null && r.confidence < 100) push(vigilance, `Analyse partielle (confiance ${r.confidence} %)`, `Une partie des données manquait au moment du calcul ; le score est donc moins fiable que pour un titre à 100 %.`);
  push(vigilance, `Rien n'est garanti`, `Même la plus belle configuration peut se retourner : un score élevé mesure une probabilité favorable, pas une certitude.`);

  // ── Profil ──
  let profil;
  if (vol != null && vol > 50) {
    profil = "Plutôt un pari court terme (« one shot ») : le potentiel de hausse rapide est réel, mais le risque de baisse l'est tout autant. À jouer avec une petite somme et une sortie planifiée (objectif de gain et limite de perte).";
  } else if ((sc("fundamental") ?? 0) >= 65 && (vol == null || vol < 35)) {
    profil = "Plutôt un placement de fond : fondamentaux solides et cours relativement calme, adapté pour être gardé plusieurs mois voire années. Le genre de titre que l'on renforce régulièrement plutôt que de trader.";
  } else {
    profil = "Profil intermédiaire : convient à un investisseur prêt à accepter quelques secousses en échange d'un vrai potentiel de progression. Ni un fond de portefeuille ultra-défensif, ni un pur pari spéculatif.";
  }

  // ── En pratique ──
  const pratique = "Ceci n'est pas un conseil financier, mais une lecture objective des données. Si tu décides d'investir : commence petit, ne mets jamais tout sur une seule action, et fixe-toi dès le départ un objectif de gain et une limite de perte. Le prochain rendez-vous à surveiller est en général la publication des résultats trimestriels de l'entreprise, qui peut faire bouger fortement le cours.";

  return { resume, pourquoi, piliers, forces, vigilance, profil, pratique };
}

function selectPicks(results) {
  const pil = (r, k) => r.pillars?.[k]?.score;
  const vol = (r) => r.pillars?.momentum?.volatility ?? 60;
  const scored = results.filter((r) => r.score != null);
  if (!scored.length) return null;

  const topSignals = (r) => [
    ...(r.pillars.technical?.signals || []),
    ...(r.pillars.momentum?.signals || []),
    ...(r.pillars.fundamental?.signals || []),
    ...(r.pillars.sentiment?.signals || []),
  ].filter((s) => s.good).slice(0, 4).map((s) => ({ label: s.label, detail: s.detail || "" }));

  const pack = (r, category, note) => ({
    category, note,
    plain: plainReason(r, category),
    symbol: r.symbol, name: r.name || r.symbol,
    score: Math.round(r.score),
    technical: pil(r, "technical") != null ? Math.round(pil(r, "technical")) : null,
    momentum: pil(r, "momentum") != null ? Math.round(pil(r, "momentum")) : null,
    fundamental: pil(r, "fundamental") != null ? Math.round(pil(r, "fundamental")) : null,
    sentiment: pil(r, "sentiment") != null ? Math.round(pil(r, "sentiment")) : null,
    volatility: Math.round(vol(r)),
    confidence: r.confidence,
    verdict: r.verdict,
    why: topSignals(r),
    fromScan: !!r.fromScan,
  });

  const best = (arr, keyFn) => arr.reduce((a, b) => (keyFn(b) > keyFn(a) ? b : a));
  const used = new Set();

  // One shot : momentum + technique, volatilité assumée
  const oneShot = best(scored, (r) => 0.45 * (pil(r, "momentum") || 0) + 0.35 * (pil(r, "technical") || 0) + 0.20 * (pil(r, "sentiment") || 0));
  used.add(oneShot.symbol);

  // Long terme : fondamentaux présents, on récompense qualité + calme
  const ltPool = scored.filter((r) => pil(r, "fundamental") != null && !used.has(r.symbol));
  const longTerme = (ltPool.length ? best(ltPool, (r) => 0.45 * r.score + 0.40 * pil(r, "fundamental") + 0.15 * Math.max(0, 100 - vol(r))) : null);
  if (longTerme) used.add(longTerme.symbol);

  // Complet : meilleur score global, fondamentaux présents, volatilité contenue
  const balPool = scored.filter((r) => !used.has(r.symbol) && pil(r, "fundamental") != null && vol(r) < 55);
  const complet = (balPool.length ? best(balPool, (r) => r.score) : scored.find((r) => !used.has(r.symbol)) || null);
  if (complet) used.add(complet.symbol);

  return {
    longTerme: longTerme ? pack(longTerme, "Long terme", "À garder — fondamentaux solides, faible volatilité.") : null,
    complet: complet ? pack(complet, "Le plus complet", "Le meilleur équilibre technique + fondamental + momentum.") : null,
    oneShot: oneShot ? pack(oneShot, "One shot", "Pari performance — momentum fort mais volatil. Petite taille + stop.") : null,
  };
}

/* ───────────── Rapport markdown ───────────── */

function reportPicks(picks) {
  if (!picks) return [];
  const emoji = { longTerme: "🏛️", complet: "⭐", oneShot: "🚀" };
  const out = ["", "## 🎯 Picks du jour", ""];
  for (const key of ["longTerme", "complet", "oneShot"]) {
    const p = picks[key];
    if (!p) continue;
    out.push(`### ${emoji[key]} ${p.category} — ${p.symbol}${p.name !== p.symbol ? ` (${p.name})` : ""} · ${p.score}/100`);
    if (p.plain) out.push(`**Pourquoi cette action :** ${p.plain}`, "");
    out.push(`*${p.note}* — volatilité ${p.volatility}%, confiance ${p.confidence}%.`);
    for (const s of p.why) out.push(`- ▲ ${s.label}${s.detail ? ` — ${s.detail}` : ""}`);
    out.push("");
  }
  return out;
}

function buildReport(results, meta, picks) {
  const d = new Date(meta.generatedAt);
  const lines = [
    `# ◆ Oracle Bourse — screener quotidien du marché US`,
    ``,
    `Généré le **${d.toISOString().slice(0, 16).replace("T", " ")} UTC**`,
    ``,
    `**${meta.universe}** actions cotées répertoriées → **${meta.scanned}** scannées (technique + momentum) → ` +
      `**${results.length}** analysées en profondeur (+ fondamentaux/news)` +
      (meta.failed.length ? ` · ${meta.failed.length} en échec` : ""),
    ``,
    `> ⚠️ Analyse statistique automatique — **pas un conseil financier**. Aucune garantie.`,
    ...reportPicks(picks),
    ``,
    `## Classement complet`,
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
  const market = []; // index léger pour le moteur de recherche (tout le marché)
  if (universe.length) {
    console.log(`Étape 1 — scan technique+momentum du marché…`);
    scanCloses = await scanMarket(universe.map((u) => u.symbol));
    console.log(`  ${scanCloses.size} historiques récupérés.`);
    for (const [sym, closes] of scanCloses) {
      const t = Engine.scoreTechnical(closes, null).score;
      const m = Engine.scoreMomentum(closes).score;
      if (t == null || m == null) continue;
      const price = closes[closes.length - 1];
      // Index recherche : symbole, nom, prix, technique, momentum
      market.push({ s: sym, n: names.get(sym) || sym, p: Math.round(price * 100) / 100, t: Math.round(t), m: Math.round(m) });
      if (price >= minPrice) candidates.push({ sym, s: 0.55 * t + 0.45 * m });
    }
    candidates.sort((a, b) => b.s - a.s);
    market.sort((a, b) => a.s.localeCompare(b.s));
    console.log(`  ${candidates.length} candidats scorés, ${market.length} au total dans l'index recherche.`);
    console.log(`  Top 5 provisoire : ${candidates.slice(0, 5).map((c) => `${c.sym} (${c.s.toFixed(0)})`).join(", ")}`);
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
  const picks = selectPicks(results);

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, "latest.json"),
    JSON.stringify({ generatedAt, auto: true, universe: universe.length, scanned: scanCloses.size, failed, picks, results }, null, 1)
  );

  // Index du moteur de recherche : tout le marché scanné (technique + momentum)
  fs.writeFileSync(
    path.join(DATA_DIR, "market.json"),
    JSON.stringify({ generatedAt, count: market.length, stocks: market })
  );

  const histFile = path.join(DATA_DIR, "history.json");
  let hist = [];
  try { hist = JSON.parse(fs.readFileSync(histFile, "utf8")); } catch { /* premier passage */ }
  const day = generatedAt.slice(0, 10);
  hist = hist.filter((h) => h.date !== day);
  hist.push({ date: day, top: results.slice(0, 5).map((r) => ({ symbol: r.symbol, score: Math.round(r.score ?? 0) })) });
  fs.writeFileSync(histFile, JSON.stringify(hist.slice(-120), null, 1));

  const report = buildReport(results, meta, picks);
  fs.writeFileSync(path.join(DATA_DIR, "rapport.md"), report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);

  if (picks) console.log(`Picks : long terme ${picks.longTerme?.symbol || "—"} · complet ${picks.complet?.symbol || "—"} · one shot ${picks.oneShot?.symbol || "—"}`);

  const withFund = results.filter((r) => r.pillars.fundamental?.score != null).length;
  console.log(`\nTerminé en ${((Date.now() - t0) / 60000).toFixed(1)} min : ${meta.scanned} scannées, ${results.length} analysées (${withFund} avec fondamentaux), ${failed.length} échecs.`);
  console.log(`Top 5 : ${results.slice(0, 5).map((r) => `${r.symbol} (${Math.round(r.score)})`).join(", ")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
