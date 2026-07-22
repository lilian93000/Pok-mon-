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
async function fetchQuoteSummary(symbol, session, tries = 2) {
  // On récupère en un seul appel : fondamentaux + profil + signaux avancés + calendrier
  const mods = "financialData,defaultKeyStatistics,summaryDetail,assetProfile,price,calendarEvents";
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
      const ap = r.assetProfile || {}, pr = r.price || {};
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
      const fundamentals = Object.values(f).every((v) => v == null) ? null : f;

      // Profil d'entreprise (secteur, industrie, taille) — données du jour
      const marketCap = raw(pr.marketCap) ?? raw(sd.marketCap);
      const profile = (ap.sector || ap.industry || ap.longBusinessSummary || marketCap != null) ? {
        sector: ap.sector || null,
        industry: ap.industry || null,
        employees: ap.fullTimeEmployees ?? null,
        country: ap.country || null,
        marketCap: marketCap ?? null,
        summary: ap.longBusinessSummary ? ap.longBusinessSummary.slice(0, 600) : null,
      } : null;

      // Signaux avancés : potentiel analystes, short interest, prochain résultat
      const price = raw(fd.currentPrice) ?? raw(pr.regularMarketPrice);
      const target = raw(fd.targetMeanPrice);
      const ce = r.calendarEvents || {};
      let earningsInDays = null, earningsDate = null;
      const edArr = ce.earnings && ce.earnings.earningsDate;
      if (Array.isArray(edArr) && edArr.length && edArr[0].raw) {
        const dt = new Date(edArr[0].raw * 1000);
        earningsDate = dt.toISOString().slice(0, 10);
        earningsInDays = Math.round((dt.getTime() - Date.now()) / 864e5);
      }
      const extra = {
        targetMean: target ?? null,
        targetUpside: (target && price) ? (target / price - 1) * 100 : null,
        recommendation: fd.recommendationKey || null,     // strong_buy / buy / hold…
        numAnalysts: raw(fd.numberOfAnalystOpinions),
        shortPercent: pct(ks.shortPercentOfFloat),        // % du flottant vendu à découvert
        earningsDate, earningsInDays,
      };
      const hasExtra = Object.values(extra).some((v) => v != null);

      return { fundamentals, profile, extra: hasExtra ? extra : null };
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw lastErr;
}

module.exports = { initSession, fetchQuoteSummary };
