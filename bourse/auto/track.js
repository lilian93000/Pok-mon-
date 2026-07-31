#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — auto/track.js
   Performance RÉELLE des picks passés. Pour chaque jour de l'historique
   (top-5 par score), on récupère le cours à la date de reco puis le cours
   actuel, et on calcule le rendement — COMPARÉ au S&P 500 sur la même
   période (seule mesure honnête : battre le marché, pas juste « monter »).
   Aucune triche : cours réels Yahoo, point d'entrée = clôture du jour de reco.
   Écrit bourse/data/track.json.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const UA = { "User-Agent": "Mozilla/5.0 (compatible; OracleBourse/1.0)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) { lastErr = e; if (i < tries - 1) await sleep(1200 * (i + 1)); }
  }
  throw lastErr;
}
async function history(symbol) {
  const j = await get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`);
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
// Cours à (ou juste après) une date donnée
function closeOnOrAfter(bars, epoch) {
  for (let i = 0; i < bars.length; i++) if (bars[i].t >= epoch) return bars[i].c;
  return null;
}
function lastClose(bars) { return bars.length ? bars[bars.length - 1].c : null; }
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
const median = (a) => { if (!a.length) return 0; const b = [...a].sort((x, y) => x - y); const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };

async function main() {
  const hist = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "history.json"), "utf8"));
  if (!Array.isArray(hist) || !hist.length) { console.error("Historique vide."); process.exit(1); }

  // Tous les symboles uniques + benchmark
  const symbols = new Set(["^GSPC"]);
  for (const day of hist) for (const t of (day.top || [])) symbols.add(t.symbol);
  const list = [...symbols];
  console.log(`Récupération de ${list.length} séries de cours…`);
  const bars = new Map();
  const fetched = await pool(list, 6, async (s) => ({ s, b: await history(s) }));
  for (const r of fetched) if (r && r.b && r.b.length) bars.set(r.s, r.b);
  const gspc = bars.get("^GSPC");
  if (!gspc) { console.error("S&P 500 indisponible."); process.exit(1); }
  const gspcNow = lastClose(gspc);

  // Chaque pick : rendement depuis la reco, vs marché sur la même période
  const picks = [];
  for (const day of hist) {
    const epoch = Math.floor(new Date(day.date + "T00:00:00Z").getTime() / 1000);
    const gEntry = closeOnOrAfter(gspc, epoch);
    const mktRet = (gEntry && gspcNow) ? (gspcNow / gEntry - 1) * 100 : null;
    (day.top || []).forEach((t, rank) => {
      const b = bars.get(t.symbol); if (!b) return;
      const entry = closeOnOrAfter(b, epoch), now = lastClose(b);
      if (entry == null || now == null) return;
      const ret = (now / entry - 1) * 100;
      picks.push({
        date: day.date, symbol: t.symbol, rank: rank + 1, score: t.score,
        entry: Math.round(entry * 100) / 100, now: Math.round(now * 100) / 100,
        ret: Math.round(ret * 10) / 10,
        mktRet: mktRet == null ? null : Math.round(mktRet * 10) / 10,
        alpha: mktRet == null ? null : Math.round((ret - mktRet) * 10) / 10,
      });
    });
  }

  const rets = picks.map((p) => p.ret);
  const alphas = picks.filter((p) => p.alpha != null).map((p) => p.alpha);
  const top1 = picks.filter((p) => p.rank === 1);

  const summary = (subset) => {
    const r = subset.map((p) => p.ret), a = subset.filter((p) => p.alpha != null).map((p) => p.alpha);
    return {
      n: subset.length,
      avgRet: Math.round(mean(r) * 10) / 10,
      medRet: Math.round(median(r) * 10) / 10,
      winPct: Math.round(subset.filter((p) => p.ret > 0).length / subset.length * 100),
      beatMktPct: a.length ? Math.round(subset.filter((p) => p.alpha != null && p.alpha > 0).length / a.length * 100) : null,
      avgAlpha: a.length ? Math.round(mean(a) * 10) / 10 : null,
    };
  };

  const sorted = [...picks].sort((x, y) => y.ret - x.ret);
  const out = {
    generatedAt: new Date().toISOString(),
    method: "Rendement réel de chaque top-pick depuis sa date de recommandation (clôture Yahoo), comparé au S&P 500 sur la même période. Point d'entrée = clôture du jour de reco.",
    horizon: `${hist[0].date} → aujourd'hui`,
    all: summary(picks),
    top1: summary(top1),
    best: sorted.slice(0, 5),
    worst: sorted.slice(-5).reverse(),
    picks,
    caveats: [
      "Période très courte (quelques jours à ~4 semaines) — statistiquement peu significatif.",
      "Point d'entrée = clôture du jour ; en réel tu achèterais à l'ouverture suivante.",
      "Ne tient pas compte des frais ni du timing de sortie (buy & hold jusqu'à aujourd'hui).",
      "Biais du survivant possible (titres encore cotés).",
    ],
  };
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, "track.json"), JSON.stringify(out, null, 1));
  console.log(`\n=== PERFORMANCE DES PICKS (${out.horizon}) ===`);
  console.log(`Tous (${out.all.n}) : moy ${out.all.avgRet >= 0 ? "+" : ""}${out.all.avgRet}% | médiane ${out.all.medRet}% | gagnants ${out.all.winPct}% | battent le marché ${out.all.beatMktPct}% | alpha moy ${out.all.avgAlpha >= 0 ? "+" : ""}${out.all.avgAlpha}%`);
  console.log(`#1 du jour (${out.top1.n}) : moy ${out.top1.avgRet >= 0 ? "+" : ""}${out.top1.avgRet}% | gagnants ${out.top1.winPct}% | alpha moy ${out.top1.avgAlpha >= 0 ? "+" : ""}${out.top1.avgAlpha}%`);
  console.log("Meilleurs :", out.best.map((p) => `${p.symbol} ${p.ret >= 0 ? "+" : ""}${p.ret}%`).join(", "));
  console.log("Pires :", out.worst.map((p) => `${p.symbol} ${p.ret >= 0 ? "+" : ""}${p.ret}%`).join(", "));
}
main().catch((e) => { console.error(e); process.exit(1); });
