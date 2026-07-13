/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — auto/edgar.js
   Pilier fondamental autonome : lecture des rapports annuels déposés
   à la SEC (API XBRL "companyfacts" d'EDGAR — gratuit, sans clé).

   La SEC demande un User-Agent identifiant et ≤ 10 requêtes/s.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

// La SEC exige un User-Agent déclarant une identité + un e-mail de contact,
// sinon elle répond 403 (politique « fair access »). Format : "Nom email@domaine".
const UA = {
  "User-Agent": "Oracle Bourse Screener oracle-bourse@users.noreply.github.com",
  "Accept-Encoding": "gzip, deflate",
};

async function getJSON(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
      if (res.status === 404) return null; // pas de dépôts XBRL (fonds, étrangers…)
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

/* Un même poste comptable peut être déclaré sous plusieurs tags US-GAAP
   selon les entreprises : on essaie dans l'ordre. */
const TAGS = {
  revenue: [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "Revenues",
    "SalesRevenueNet",
    "RevenueFromContractWithCustomerIncludingAssessedTax",
    "SalesRevenueGoodsNet",
  ],
  netIncome: ["NetIncomeLoss", "ProfitLoss"],
  eps: ["EarningsPerShareDiluted", "EarningsPerShareBasicAndDiluted", "EarningsPerShareBasic"],
  equity: ["StockholdersEquity", "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest"],
  debt: ["LongTermDebtNoncurrent", "LongTermDebt", "DebtLongtermAndShorttermCombinedAmount"],
};

/* Extrait, pour un tag "durée" (CA, résultat, BPA), les valeurs annuelles :
   dépôts 10-K/20-F, exercice complet (> 300 jours), une valeur par exercice,
   triées par date de fin croissante. */
function annualSeries(fact, unitKeys) {
  if (!fact || !fact.units) return [];
  let entries = null;
  for (const u of unitKeys) {
    if (fact.units[u]) { entries = fact.units[u]; break; }
  }
  if (!entries) return [];
  const byEnd = new Map();
  for (const e of entries) {
    if (!/10-K|20-F/.test(e.form || "")) continue;
    if (e.start) {
      const days = (new Date(e.end) - new Date(e.start)) / 864e5;
      if (days < 300 || days > 430) continue; // exercice complet uniquement
    }
    if (e.val == null || !isFinite(e.val)) continue;
    // en cas de re-dépôt, la valeur la plus récente écrase l'ancienne
    byEnd.set(e.end, e.val);
  }
  return [...byEnd.entries()]
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([end, val]) => ({ end, val }));
}

/* Valeur "instantanée" la plus récente (fonds propres, dette) */
function latestInstant(fact, unitKeys) {
  const s = annualSeries(fact, unitKeys);
  return s.length ? s[s.length - 1].val : null;
}

function firstFact(gaap, tags) {
  for (const t of tags) if (gaap[t]) return gaap[t];
  return null;
}

function growth(series) {
  if (series.length < 2) return null;
  const prev = series[series.length - 2].val;
  const cur = series[series.length - 1].val;
  if (!prev || prev <= 0) return null; // croissance non significative depuis une base ≤ 0
  return (cur / prev - 1) * 100;
}

/**
 * Fondamentaux d'une entreprise depuis EDGAR.
 * cik : CIK à 10 chiffres. price : dernier cours (pour PER/PEG).
 * Renvoie le format attendu par Engine.scoreFundamental, ou null.
 */
async function fundamentalsFromEdgar(cik, price) {
  const j = await getJSON(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`);
  const gaap = j && j.facts && j.facts["us-gaap"];
  if (!gaap) return null; // dépôts en IFRS (étrangers) ou pas de XBRL

  const rev = annualSeries(firstFact(gaap, TAGS.revenue), ["USD"]);
  const ni = annualSeries(firstFact(gaap, TAGS.netIncome), ["USD"]);
  const eps = annualSeries(firstFact(gaap, TAGS.eps), ["USD/shares"]);
  const equity = latestInstant(firstFact(gaap, TAGS.equity), ["USD"]);
  const debt = latestInstant(firstFact(gaap, TAGS.debt), ["USD"]);

  const lastRev = rev.length ? rev[rev.length - 1].val : null;
  const lastNi = ni.length ? ni[ni.length - 1].val : null;
  const lastEps = eps.length ? eps[eps.length - 1].val : null;

  const revenueGrowth = growth(rev);
  // Croissance des bénéfices : BPA en priorité, sinon résultat net
  const epsGrowth = growth(eps) ?? growth(ni);

  const netMargin = lastRev && lastNi != null ? (lastNi / lastRev) * 100 : null;
  const roe = equity && equity > 0 && lastNi != null ? (lastNi / equity) * 100 : null;
  const debtToEquity = equity && equity > 0 && debt != null ? debt / equity : null;
  const pe = price && lastEps && lastEps > 0 ? price / lastEps : null;
  const peg = pe && epsGrowth && epsGrowth > 5 ? pe / epsGrowth : null;

  if ([revenueGrowth, epsGrowth, netMargin, roe, pe].every((v) => v == null)) return null;

  return { revenueGrowth, epsGrowth, netMargin, pe, peg, debtToEquity, roe };
}

module.exports = { fundamentalsFromEdgar, annualSeries, growth, TAGS };
