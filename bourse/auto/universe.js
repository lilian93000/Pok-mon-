/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — auto/universe.js
   Univers d'actions : la liste officielle de tous les titres cotés
   aux US (NASDAQ Trader Symbol Directory — gratuit, sans clé).
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const UA = { "User-Agent": "Mozilla/5.0 (compatible; OracleBourse/1.0; +https://github.com/lilian93000/Pok-mon-)" };

async function getText(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw lastErr;
}

// Noms à écarter : produits structurés, SPAC, warrants… pas des actions ordinaires
const EXCLUDE_NAME = /warrant|right(s)? |\bunit(s)?\b|preferred|preference|depositar|acquisition corp|blank check|\bnote(s)? due\b|\bETN\b|closed[- ]end/i;

function parseNasdaqListed(txt) {
  // Symbol|Security Name|Market Category|Test Issue|Financial Status|Round Lot Size|ETF|NextShares
  const out = [];
  for (const line of txt.split("\n").slice(1)) {
    const c = line.split("|");
    if (c.length < 8 || c[0].startsWith("File Creation")) continue;
    const [symbol, name, , test, , , etf] = c;
    if (test !== "N" || etf !== "N") continue;
    out.push({ symbol: symbol.trim(), name: name.trim() });
  }
  return out;
}

function parseOtherListed(txt) {
  // ACT Symbol|Security Name|Exchange|CQS Symbol|ETF|Round Lot Size|Test Issue|NASDAQ Symbol
  const out = [];
  for (const line of txt.split("\n").slice(1)) {
    const c = line.split("|");
    if (c.length < 8 || c[0].startsWith("File Creation")) continue;
    const [symbol, name, , , etf, , test] = c;
    if (test !== "N" || etf !== "N") continue;
    out.push({ symbol: symbol.trim(), name: name.trim() });
  }
  return out;
}

/**
 * Renvoie la liste des actions ordinaires US : [{ symbol, name }]
 * Filtres : pas d'ETF, pas de titre de test, symbole simple (A-Z, ≤ 5),
 * pas de warrants/units/preferred/SPAC d'après le libellé.
 */
async function loadUniverse() {
  const [nasdaq, other] = await Promise.all([
    getText("https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt").then(parseNasdaqListed),
    getText("https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt").then(parseOtherListed),
  ]);
  const seen = new Set();
  const out = [];
  for (const s of [...nasdaq, ...other]) {
    if (!/^[A-Z]{1,5}$/.test(s.symbol)) continue;      // écarte classes B ("BRK.B"), warrants ("XX+")…
    if (EXCLUDE_NAME.test(s.name)) continue;
    if (seen.has(s.symbol)) continue;
    seen.add(s.symbol);
    out.push(s);
  }
  return out;
}

module.exports = { loadUniverse, parseNasdaqListed, parseOtherListed };
