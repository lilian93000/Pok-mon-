/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — auto/fundamentals.js
   Pilier fondamental autonome via Yahoo Finance quoteSummary.

   Pourquoi Yahoo et pas la SEC : l'API XBRL d'EDGAR (data.sec.gov) est
   filtrée par IP et renvoie 403 depuis les runners cloud (GitHub Actions
   tourne sur Azure), quel que soit le User-Agent. Yahoo, en revanche, est
   joignable depuis ce même environnement (c'est déjà la source des cours)
   et expose directement les ratios fondamentaux, agrégés à partir des
   états financiers déposés par les sociétés.

   Yahoo protège quoteSummary par un couple cookie + « crumb » : on
   l'obtient une fois, puis on le réutilise pour tous les titres.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const YUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Ouvre une session Yahoo : récupère un cookie puis le crumb associé. */
async function initSession() {
  // 1. Cookie : fc.yahoo.com renvoie souvent 404 mais avec un Set-Cookie utile.
  let cookie = "";
  for (const url of ["https://fc.yahoo.com/", "https://finance.yahoo.com/"]) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": YUA, "Accept": "text/html" },
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
      });
      const setCookies = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
      const jar = setCookies.map((c) => c.split(";")[0]).filter(Boolean);
      if (jar.length) { cookie = jar.join("; "); break; }
    } catch { /* essaie l'hôte suivant */ }
  }
  if (!cookie) throw new Error("cookie Yahoo introuvable");

  // 2. Crumb lié à ce cookie
  const res = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: { "User-Agent": YUA, "Cookie": cookie },
    signal: AbortSignal.timeout(15000),
  });
  const crumb = (await res.text()).trim();
  if (!crumb || crumb.length > 40 || /[<{}\s]/.test(crumb)) {
    throw new Error(`crumb invalide (${crumb.slice(0, 30)})`);
  }
  return { cookie, crumb };
}

const raw = (x) => (x && x.raw != null && isFinite(x.raw) ? x.raw : null);
const pct = (x) => { const v = raw(x); return v == null ? null : v * 100; };

/**
 * Fondamentaux d'un titre via quoteSummary.
 * session : { cookie, crumb } issu d'initSession().
 * Renvoie le format attendu par Engine.scoreFundamental, ou null.
 */
async function fetchFundamentals(symbol, session, tries = 2) {
  const mods = "financialData,defaultKeyStatistics,summaryDetail";
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}`
    + `?modules=${mods}&crumb=${encodeURIComponent(session.crumb)}`;
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": YUA, "Cookie": session.cookie },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      const r = j?.quoteSummary?.result?.[0];
      if (!r) throw new Error("réponse vide");
      const fd = r.financialData || {}, ks = r.defaultKeyStatistics || {}, sd = r.summaryDetail || {};
      const de = raw(fd.debtToEquity); // Yahoo l'exprime en % (150 = 1,5x)
      const f = {
        revenueGrowth: pct(fd.revenueGrowth),
        epsGrowth: pct(fd.earningsGrowth),
        netMargin: pct(fd.profitMargins),
        pe: raw(sd.trailingPE),
        peg: raw(ks.pegRatio),
        debtToEquity: de != null ? de / 100 : null,
        roe: pct(fd.returnOnEquity),
      };
      if (Object.values(f).every((v) => v == null)) return null;
      return f;
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw lastErr;
}

module.exports = { initSession, fetchFundamentals };
