/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — providers.js
   Couche d'accès aux données : Finnhub, Alpha Vantage, mode démo.
   Chaque provider remplit ce qu'il peut ; le moteur neutralise le reste.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const Providers = (() => {

  /* ───────────── Mode démo : générateur déterministe ─────────────
     Générateur congruentiel seedé par ticker → mêmes données à chaque
     visite, profils variés (hyper-croissance, blue chip, en difficulté…). */

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seedFrom(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // Profils : drift annuel, volatilité, tendance news, croissance
  const DEMO_PROFILES = {
    NVDA: { drift: 0.65, vol: 0.45, mood: 2.0, rev: 55, eps: 70, margin: 32, pe: 48, peg: 1.1, de: 0.3, roe: 45, name: "NVIDIA" },
    AAPL: { drift: 0.12, vol: 0.22, mood: 0.5, rev: 5, eps: 8, margin: 25, pe: 29, peg: 2.8, de: 1.6, roe: 60, name: "Apple" },
    MSFT: { drift: 0.20, vol: 0.22, mood: 1.0, rev: 14, eps: 16, margin: 35, pe: 33, peg: 2.1, de: 0.4, roe: 38, name: "Microsoft" },
    TSLA: { drift: 0.10, vol: 0.60, mood: -0.3, rev: 3, eps: -15, margin: 7, pe: 90, peg: 4.5, de: 0.2, roe: 12, name: "Tesla" },
    AMZN: { drift: 0.22, vol: 0.28, mood: 0.8, rev: 12, eps: 30, margin: 8, pe: 38, peg: 1.5, de: 0.6, roe: 22, name: "Amazon" },
    GOOGL: { drift: 0.18, vol: 0.25, mood: 0.6, rev: 13, eps: 20, margin: 26, pe: 24, peg: 1.3, de: 0.1, roe: 30, name: "Alphabet" },
    META: { drift: 0.28, vol: 0.32, mood: 0.9, rev: 18, eps: 35, margin: 33, pe: 26, peg: 1.0, de: 0.3, roe: 35, name: "Meta" },
    AMD: { drift: 0.25, vol: 0.48, mood: 0.7, rev: 15, eps: 25, margin: 8, pe: 45, peg: 1.6, de: 0.1, roe: 6, name: "AMD" },
    PLTR: { drift: 0.55, vol: 0.62, mood: 1.5, rev: 28, eps: 60, margin: 18, pe: 180, peg: 3.2, de: 0.0, roe: 8, name: "Palantir" },
    INTC: { drift: -0.15, vol: 0.38, mood: -1.2, rev: -8, eps: -40, margin: -2, pe: 0, peg: 0, de: 0.9, roe: -4, name: "Intel" },
    KO: { drift: 0.06, vol: 0.13, mood: 0.1, rev: 3, eps: 5, margin: 23, pe: 24, peg: 4.0, de: 1.7, roe: 40, name: "Coca-Cola" },
    BA: { drift: -0.05, vol: 0.35, mood: -1.5, rev: -2, eps: -25, margin: -6, pe: 0, peg: 0, de: 8.0, roe: -30, name: "Boeing" },
  };

  const DEMO_HEADLINES = {
    pos: [
      "{N} dépasse les attentes avec des résultats records au dernier trimestre",
      "{N} relève ses objectifs annuels, le titre bondit",
      "{N} signe un contrat majeur avec un géant du secteur",
      "Les analystes relèvent leur objectif de cours sur {N}",
      "{N} annonce un partenariat stratégique dans l'IA",
      "{N} beats estimates as demand surges",
      "{N} announces record quarterly revenue and raises guidance",
      "Strong growth momentum continues at {N}, analysts say",
    ],
    neg: [
      "{N} déçoit le consensus, le titre chute",
      "{N} abaisse ses prévisions, avertissement sur les résultats",
      "Enquête réglementaire visant {N}, l'action recule",
      "{N} annonce un plan de licenciements",
      "{N} misses estimates as demand slows",
      "Analysts downgrade {N} on weak outlook",
      "{N} faces lawsuit over product defects",
    ],
    neu: [
      "{N} présentera ses résultats trimestriels la semaine prochaine",
      "Le PDG de {N} s'exprimera à la conférence du secteur",
      "{N} to present at upcoming investor conference",
      "Volume d'échanges inhabituel sur {N} en séance",
    ],
  };

  function demoData(symbol) {
    const p = DEMO_PROFILES[symbol] || {
      drift: 0.05, vol: 0.35, mood: 0, rev: 5, eps: 5, margin: 10,
      pe: 25, peg: 2, de: 0.8, roe: 12, name: symbol,
    };
    const rnd = mulberry32(seedFrom(symbol));
    const days = 260;
    const dailyDrift = p.drift / 252;
    const dailyVol = p.vol / Math.sqrt(252);
    let price = 20 + rnd() * 300;
    const closes = [], volumes = [];
    const baseVol = 1e6 * (1 + rnd() * 20);
    for (let i = 0; i < days; i++) {
      // Box-Muller pour un choc gaussien
      const u1 = Math.max(rnd(), 1e-9), u2 = rnd();
      const g = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      // régime : petit cycle sinusoïdal pour créer des phases
      const regime = Math.sin(i / 40 + rnd() * 0.1) * dailyVol * 0.4;
      price = Math.max(1, price * (1 + dailyDrift + regime + g * dailyVol));
      closes.push(price);
      volumes.push(baseVol * (0.6 + rnd() * 0.8 + (Math.abs(g) > 1.5 ? rnd() * 1.5 : 0)));
    }

    // News tirées selon l'humeur du profil
    const news = [];
    const nArticles = 4 + Math.floor(rnd() * 8);
    for (let i = 0; i < nArticles; i++) {
      const roll = rnd() * 4 - 2 + p.mood; // centré sur mood
      const pool = roll > 0.6 ? DEMO_HEADLINES.pos : roll < -0.6 ? DEMO_HEADLINES.neg : DEMO_HEADLINES.neu;
      const tpl = pool[Math.floor(rnd() * pool.length)];
      news.push({
        headline: tpl.replace(/\{N\}/g, p.name),
        daysAgo: Math.floor(rnd() * 14),
        source: "Démo",
      });
    }

    return {
      symbol,
      name: p.name + " (démo)",
      closes,
      volumes,
      fundamentals: {
        revenueGrowth: p.rev, epsGrowth: p.eps, netMargin: p.margin,
        pe: p.pe > 0 ? p.pe : null, peg: p.peg > 0 ? p.peg : null,
        debtToEquity: p.de, roe: p.roe,
      },
      news,
      sources: ["Simulation (mode démo)"],
    };
  }

  /* ───────────── Helpers réseau ───────────── */

  async function getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  const num = (x) => (x == null || x === "None" || x === "-" || isNaN(+x) ? null : +x);

  /* ───────────── Finnhub (news, fondamentaux, cours spot) ───────────── */

  async function finnhubFundamentals(symbol, key) {
    const j = await getJSON(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${key}`);
    const m = j.metric || {};
    return {
      revenueGrowth: num(m.revenueGrowthTTMYoy),
      epsGrowth: num(m.epsGrowthTTMYoy),
      netMargin: num(m.netProfitMarginTTM),
      pe: num(m.peTTM),
      peg: num(m.pegRatio ?? m.pegTTM),
      debtToEquity: num(m["totalDebt/totalEquityQuarterly"]) != null
        ? num(m["totalDebt/totalEquityQuarterly"]) / 100
        : null,
      roe: num(m.roeTTM),
    };
  }

  async function finnhubNews(symbol, key) {
    const to = new Date();
    const from = new Date(Date.now() - 14 * 864e5);
    const fmt = (d) => d.toISOString().slice(0, 10);
    const j = await getJSON(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fmt(from)}&to=${fmt(to)}&token=${key}`);
    if (!Array.isArray(j)) return [];
    return j.slice(0, 30).map((a) => ({
      headline: a.headline || "",
      summary: (a.summary || "").slice(0, 300),
      daysAgo: Math.max(0, (Date.now() / 1000 - a.datetime) / 86400),
      source: a.source || "Finnhub",
      url: a.url,
    }));
  }

  /* ───────────── Alpha Vantage (historique, overview, news notées) ───────────── */

  async function alphaDaily(symbol, key) {
    const j = await getJSON(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${key}`);
    const series = j["Time Series (Daily)"];
    if (!series) {
      const note = j.Note || j.Information || j["Error Message"];
      throw new Error(note ? `Alpha Vantage : ${String(note).slice(0, 120)}` : "réponse vide");
    }
    const dates = Object.keys(series).sort(); // ascendant
    const closes = [], volumes = [];
    for (const d of dates) {
      closes.push(+series[d]["4. close"]);
      volumes.push(+series[d]["5. volume"]);
    }
    return { closes, volumes };
  }

  async function alphaOverview(symbol, key) {
    const j = await getJSON(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${key}`);
    if (!j.Symbol) return null;
    return {
      name: j.Name,
      fundamentals: {
        revenueGrowth: num(j.QuarterlyRevenueGrowthYOY) != null ? num(j.QuarterlyRevenueGrowthYOY) * 100 : null,
        epsGrowth: num(j.QuarterlyEarningsGrowthYOY) != null ? num(j.QuarterlyEarningsGrowthYOY) * 100 : null,
        netMargin: num(j.ProfitMargin) != null ? num(j.ProfitMargin) * 100 : null,
        pe: num(j.PERatio),
        peg: num(j.PEGRatio),
        debtToEquity: null,
        roe: num(j.ReturnOnEquityTTM) != null ? num(j.ReturnOnEquityTTM) * 100 : null,
      },
    };
  }

  async function alphaNews(symbol, key) {
    const j = await getJSON(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&limit=30&apikey=${key}`);
    if (!Array.isArray(j.feed)) return [];
    return j.feed.map((a) => {
      const t = a.time_published; // ex 20260703T101500
      const dt = t ? new Date(`${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}T${t.slice(9, 11)}:${t.slice(11, 13)}:00Z`) : new Date();
      const mine = (a.ticker_sentiment || []).find((s) => s.ticker === symbol);
      return {
        headline: a.title || "",
        summary: (a.summary || "").slice(0, 300),
        daysAgo: Math.max(0, (Date.now() - dt.getTime()) / 864e5),
        avSentiment: mine ? num(mine.ticker_sentiment_score) : num(a.overall_sentiment_score),
        source: a.source || "Alpha Vantage",
        url: a.url,
      };
    });
  }

  /* ───────────── Orchestration : le meilleur de chaque source ───────────── */

  /**
   * Récupère tout ce qui est possible pour un ticker.
   * keys = { finnhub, alpha } — l'un, l'autre, les deux ou aucun.
   * Renvoie { symbol, name, closes, volumes, fundamentals, news, sources, warnings }
   */
  async function fetchAll(symbol, keys) {
    if (!keys.finnhub && !keys.alpha) return demoData(symbol);

    const out = {
      symbol, name: symbol, closes: null, volumes: null,
      fundamentals: null, news: null, sources: [], warnings: [],
    };

    const tasks = [];

    if (keys.alpha) {
      tasks.push(
        alphaDaily(symbol, keys.alpha)
          .then((d) => { out.closes = d.closes; out.volumes = d.volumes; out.sources.push("Alpha Vantage (historique)"); })
          .catch((e) => out.warnings.push(`Historique indisponible : ${e.message}`)),
        alphaNews(symbol, keys.alpha)
          .then((n) => { if (n.length) { out.news = n; out.sources.push("Alpha Vantage (news notées)"); } })
          .catch(() => {}),
      );
      if (!keys.finnhub) {
        tasks.push(
          alphaOverview(symbol, keys.alpha)
            .then((o) => {
              if (o) {
                out.fundamentals = o.fundamentals;
                out.name = o.name || symbol;
                out.sources.push("Alpha Vantage (fondamentaux)");
              }
            })
            .catch(() => {}),
        );
      }
    }

    if (keys.finnhub) {
      tasks.push(
        finnhubFundamentals(symbol, keys.finnhub)
          .then((f) => { out.fundamentals = f; out.sources.push("Finnhub (fondamentaux)"); })
          .catch((e) => out.warnings.push(`Fondamentaux indisponibles : ${e.message}`)),
      );
      tasks.push(
        finnhubNews(symbol, keys.finnhub)
          .then((n) => {
            // Fusion : Alpha (notées) prioritaire, Finnhub complète
            if (n.length && (!out.news || out.news.length < 10)) {
              out.news = [...(out.news || []), ...n].slice(0, 30);
              out.sources.push("Finnhub (news)");
            }
          })
          .catch(() => {}),
      );
    }

    await Promise.all(tasks);

    if (!out.closes) {
      out.warnings.push(keys.alpha
        ? "Pas d'historique de cours — piliers technique et momentum neutralisés."
        : "Ajoutez une clé Alpha Vantage pour l'historique de cours (piliers technique/momentum).");
    }
    return out;
  }

  return { fetchAll, demoData, DEMO_PROFILES };
})();
