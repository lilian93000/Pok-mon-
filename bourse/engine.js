/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — engine.js
   Moteur pur (aucun accès réseau) : indicateurs techniques,
   scoring fondamental, analyse de sentiment, score composite.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

const Engine = (() => {

  /* ───────────── Utilitaires ───────────── */

  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const last = (arr) => arr[arr.length - 1];
  const mean = (arr) => arr.reduce((s, x) => s + x, 0) / arr.length;

  function std(arr) {
    if (arr.length < 2) return 0;
    const m = mean(arr);
    return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / (arr.length - 1));
  }

  // Interpolation linéaire par paliers : ramp(x, [[x0,y0],[x1,y1],...])
  function ramp(x, pts) {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
      }
    }
    return last(pts)[1];
  }

  /* ───────────── Indicateurs techniques ───────────── */

  function sma(values, period) {
    const out = new Array(values.length).fill(null);
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      if (i >= period) sum -= values[i - period];
      if (i >= period - 1) out[i] = sum / period;
    }
    return out;
  }

  function ema(values, period) {
    const out = new Array(values.length).fill(null);
    const k = 2 / (period + 1);
    let prev = mean(values.slice(0, period));
    out[period - 1] = prev;
    for (let i = period; i < values.length; i++) {
      prev = values[i] * k + prev * (1 - k);
      out[i] = prev;
    }
    return out;
  }

  // RSI de Wilder, 14 périodes
  function rsi(closes, period = 14) {
    if (closes.length < period + 1) return null;
    let gain = 0, loss = 0;
    for (let i = 1; i <= period; i++) {
      const d = closes[i] - closes[i - 1];
      if (d > 0) gain += d; else loss -= d;
    }
    let avgG = gain / period, avgL = loss / period;
    for (let i = period + 1; i < closes.length; i++) {
      const d = closes[i] - closes[i - 1];
      avgG = (avgG * (period - 1) + Math.max(d, 0)) / period;
      avgL = (avgL * (period - 1) + Math.max(-d, 0)) / period;
    }
    if (avgL === 0) return 100;
    return 100 - 100 / (1 + avgG / avgL);
  }

  // MACD 12/26/9 → { macd, signal, hist, histPrev }
  function macd(closes) {
    if (closes.length < 26 + 9) return null;
    const e12 = ema(closes, 12), e26 = ema(closes, 26);
    const line = [];
    for (let i = 25; i < closes.length; i++) line.push(e12[i] - e26[i]);
    const sig = ema(line, 9);
    const n = line.length - 1;
    return {
      macd: line[n],
      signal: sig[n],
      hist: line[n] - sig[n],
      histPrev: line[n - 1] - sig[n - 1],
    };
  }

  // Position dans les bandes de Bollinger 20/2 : 0 = bande basse, 1 = bande haute
  function bollingerPos(closes, period = 20, mult = 2) {
    if (closes.length < period) return null;
    const win = closes.slice(-period);
    const m = mean(win), s = std(win);
    if (s === 0) return 0.5;
    return clamp((last(closes) - (m - mult * s)) / (2 * mult * s), -0.5, 1.5);
  }

  // Pente de régression linéaire sur les N derniers cours, en % / jour
  function trendSlope(closes, n = 60) {
    const win = closes.slice(-n);
    if (win.length < 10) return null;
    const len = win.length, xm = (len - 1) / 2, ym = mean(win);
    let num = 0, den = 0;
    for (let i = 0; i < len; i++) {
      num += (i - xm) * (win[i] - ym);
      den += (i - xm) ** 2;
    }
    return (num / den) / ym * 100;
  }

  // Volatilité annualisée des rendements quotidiens (%)
  function annualVol(closes, n = 60) {
    const win = closes.slice(-(n + 1));
    if (win.length < 20) return null;
    const rets = [];
    for (let i = 1; i < win.length; i++) rets.push(win[i] / win[i - 1] - 1);
    return std(rets) * Math.sqrt(252) * 100;
  }

  function periodReturn(closes, days) {
    if (closes.length <= days) return null;
    return (last(closes) / closes[closes.length - 1 - days] - 1) * 100;
  }

  // Z-score du volume récent (5 j) vs 60 j
  function volumeSurge(volumes) {
    if (!volumes || volumes.length < 30) return null;
    const base = volumes.slice(-60, -5);
    const recent = mean(volumes.slice(-5));
    const m = mean(base), s = std(base);
    if (s === 0) return 0;
    return (recent - m) / s;
  }

  /* ───────────── Pilier 1 : score technique (0–100) ───────────── */

  function scoreTechnical(closes, volumes) {
    if (!closes || closes.length < 40) return { score: null, signals: [] };
    const signals = [];
    const parts = [];
    const price = last(closes);

    // RSI : zone idéale 50–68 (tendance saine), suracheté > 75 pénalisé
    const r = rsi(closes);
    if (r !== null) {
      const s = ramp(r, [[20, 25], [30, 45], [45, 65], [55, 90], [68, 85], [75, 55], [85, 25]]);
      parts.push([s, 2]);
      signals.push({
        label: `RSI 14 j : ${r.toFixed(0)}`,
        good: r >= 45 && r <= 72,
        detail: r > 75 ? "suracheté — risque de repli" : r < 30 ? "survendu — faiblesse ou rebond possible" : r >= 55 ? "dynamique haussière saine" : "zone neutre",
      });
    }

    // MACD : histogramme positif et croissant = accélération
    const m = macd(closes);
    if (m) {
      const rising = m.hist > m.histPrev;
      const s = m.hist > 0 ? (rising ? 90 : 70) : (rising ? 55 : 25);
      parts.push([s, 2]);
      signals.push({
        label: `MACD : ${m.hist > 0 ? "positif" : "négatif"}${rising ? ", en hausse" : ", en baisse"}`,
        good: m.hist > 0,
        detail: m.hist > 0 && rising ? "accélération haussière" : m.hist > 0 ? "haussier mais s'essouffle" : rising ? "baissier mais se redresse" : "pression vendeuse",
      });
    }

    // Prix vs moyennes mobiles 50/200
    const s50 = last(sma(closes, Math.min(50, closes.length - 1)));
    const s200 = closes.length >= 200 ? last(sma(closes, 200)) : null;
    if (s50 !== null) {
      const above50 = price > s50, above200 = s200 === null || price > s200;
      const s = above50 && above200 ? 90 : above50 ? 65 : above200 ? 45 : 15;
      parts.push([s, 1.5]);
      signals.push({
        label: `Prix vs MM50${s200 !== null ? "/MM200" : ""}`,
        good: above50 && above200,
        detail: above50 && above200 ? "au-dessus des deux moyennes — structure haussière"
          : !above50 && !above200 ? "sous les deux moyennes — structure baissière" : "structure mixte",
      });
    }

    // Bollinger : proche de la bande haute avec tendance = force
    const bp = bollingerPos(closes);
    if (bp !== null) {
      const s = ramp(bp, [[-0.2, 30], [0.2, 45], [0.5, 60], [0.8, 80], [1.0, 75], [1.3, 50]]);
      parts.push([s, 1]);
    }

    // Pente de tendance 60 j
    const slope = trendSlope(closes);
    if (slope !== null) {
      const s = ramp(slope, [[-0.5, 10], [-0.1, 35], [0, 50], [0.15, 70], [0.4, 90], [0.9, 95]]);
      parts.push([s, 2]);
      signals.push({
        label: `Tendance 60 j : ${slope >= 0 ? "+" : ""}${(slope * 21).toFixed(1)} %/mois`,
        good: slope > 0.05,
        detail: slope > 0.3 ? "tendance haussière forte" : slope > 0.05 ? "tendance haussière" : slope > -0.05 ? "sans tendance" : "tendance baissière",
      });
    }

    // Proximité du plus-haut de la période (breakout)
    const high = Math.max(...closes.slice(-252));
    const distHigh = (price / high - 1) * 100; // 0 = au plus-haut
    const sHigh = ramp(distHigh, [[-40, 20], [-20, 40], [-8, 60], [-3, 80], [0, 95]]);
    parts.push([sHigh, 1.5]);
    if (distHigh > -3) {
      signals.push({ label: "Cassure : au contact du plus-haut 52 sem.", good: true, detail: "les cassures de plus-hauts attirent les acheteurs" });
    } else if (distHigh < -25) {
      signals.push({ label: `À ${distHigh.toFixed(0)} % du plus-haut 52 sem.`, good: false, detail: "loin de ses sommets" });
    }

    // Volume
    const vz = volumeSurge(volumes);
    if (vz !== null) {
      const up = periodReturn(closes, 5);
      const s = vz > 1 && up > 0 ? 90 : vz > 1 ? 30 : 55;
      parts.push([s, 1]);
      if (vz > 1) {
        signals.push({
          label: `Volume : +${(vz).toFixed(1)} σ au-dessus de la normale`,
          good: up > 0,
          detail: up > 0 ? "accumulation — les gros achètent" : "distribution — les gros vendent",
        });
      }
    }

    const totW = parts.reduce((s, [, w]) => s + w, 0);
    const score = parts.reduce((s, [v, w]) => s + v * w, 0) / totW;
    return { score: clamp(score, 0, 100), signals };
  }

  /* ───────────── Pilier 2 : score momentum (0–100) ───────────── */

  function scoreMomentum(closes) {
    if (!closes || closes.length < 45) return { score: null, signals: [] };
    const signals = [];
    const vol = annualVol(closes) || 30;

    const r21 = periodReturn(closes, 21);
    const r63 = periodReturn(closes, Math.min(63, closes.length - 1));
    const r126 = closes.length > 126 ? periodReturn(closes, 126) : null;

    // Rendement ajusté du risque, borné
    const adj = (r, days) => {
      if (r === null) return null;
      const annualized = r * (252 / days);
      return clamp(annualized / Math.max(vol, 10), -3, 3);
    };
    const parts = [];
    const a21 = adj(r21, 21), a63 = adj(r63, 63), a126 = adj(r126, 126);
    if (a21 !== null) parts.push([ramp(a21, [[-2, 10], [0, 45], [1, 75], [2.5, 95]]), 1]);
    if (a63 !== null) parts.push([ramp(a63, [[-2, 10], [0, 45], [1, 78], [2.5, 95]]), 1.5]);
    if (a126 !== null) parts.push([ramp(a126, [[-2, 10], [0, 45], [1, 80], [2.5, 95]]), 1]);

    // Accélération : le 1 mois bat-il le rythme des 3 mois ?
    if (r21 !== null && r63 !== null) {
      const accel = r21 - r63 / 3;
      parts.push([ramp(accel, [[-8, 25], [0, 50], [5, 80], [12, 92]]), 1]);
      if (accel > 4) signals.push({ label: "Momentum en accélération", good: true, detail: "le dernier mois surperforme le rythme trimestriel" });
      if (accel < -6) signals.push({ label: "Momentum en décélération", good: false, detail: "la hausse s'essouffle" });
    }

    if (r63 !== null) {
      signals.push({
        label: `Perf 3 mois : ${r63 >= 0 ? "+" : ""}${r63.toFixed(1)} % (vol. ${vol.toFixed(0)} %)`,
        good: r63 > 0,
        detail: vol > 55 ? "titre très volatil — potentiel ET risque élevés" : "volatilité modérée",
      });
    }

    if (!parts.length) return { score: null, signals };
    const totW = parts.reduce((s, [, w]) => s + w, 0);
    return { score: clamp(parts.reduce((s, [v, w]) => s + v * w, 0) / totW, 0, 100), signals, volatility: vol };
  }

  /* ───────────── Pilier 3 : score fondamental (0–100) ─────────────
     Combine VALEUR + CROISSANCE + QUALITÉ (multi-facteur = plus robuste, car
     les facteurs sont peu corrélés entre eux).
     f = { revenueGrowth, epsGrowth, netMargin, pe, peg, debtToEquity, roe,
           roa, grossMargin, operatingMargin, cashConversion, fcfPositive,
           currentRatio }  (champs en %, null si inconnu) */

  function scoreFundamental(f) {
    if (!f) return { score: null, signals: [] };
    const parts = [];
    const signals = [];

    if (f.revenueGrowth != null) {
      parts.push([ramp(f.revenueGrowth, [[-10, 10], [0, 35], [10, 60], [25, 85], [50, 95]]), 2]);
      signals.push({
        label: `Croissance CA : ${f.revenueGrowth >= 0 ? "+" : ""}${f.revenueGrowth.toFixed(1)} %/an`,
        good: f.revenueGrowth > 8,
        detail: f.revenueGrowth > 25 ? "hyper-croissance" : f.revenueGrowth > 8 ? "croissance solide" : f.revenueGrowth > 0 ? "croissance molle" : "chiffre d'affaires en recul",
      });
    }
    if (f.epsGrowth != null) {
      parts.push([ramp(f.epsGrowth, [[-20, 10], [0, 35], [15, 70], [35, 90], [70, 95]]), 2]);
      signals.push({
        label: `Croissance BPA : ${f.epsGrowth >= 0 ? "+" : ""}${f.epsGrowth.toFixed(1)} %/an`,
        good: f.epsGrowth > 10,
        detail: f.epsGrowth > 30 ? "bénéfices en forte expansion" : f.epsGrowth > 10 ? "bénéfices en croissance" : "bénéfices stagnants ou en baisse",
      });
    }
    if (f.netMargin != null) {
      parts.push([ramp(f.netMargin, [[-5, 15], [0, 35], [8, 55], [20, 80], [35, 92]]), 1]);
    }
    if (f.pe != null && f.pe > 0) {
      parts.push([ramp(f.pe, [[8, 75], [15, 85], [25, 70], [40, 50], [80, 30], [150, 15]]), 1]);
      signals.push({
        label: `PER : ${f.pe.toFixed(0)}`,
        good: f.pe < 35,
        detail: f.pe > 60 ? "valorisation exigeante — la moindre déception coûte cher" : f.pe < 18 ? "valorisation raisonnable" : "valorisation de croissance",
      });
    }
    if (f.peg != null && f.peg > 0) {
      parts.push([ramp(f.peg, [[0.5, 95], [1, 85], [1.8, 60], [3, 35], [5, 15]]), 1.5]);
      if (f.peg < 1.2) signals.push({ label: `PEG : ${f.peg.toFixed(2)}`, good: true, detail: "croissance pas encore payée au prix fort" });
    }
    if (f.debtToEquity != null) {
      parts.push([ramp(f.debtToEquity, [[0, 90], [0.5, 75], [1.5, 50], [3, 25]]), 1]);
      if (f.debtToEquity > 2) signals.push({ label: `Dette/fonds propres : ${f.debtToEquity.toFixed(1)}`, good: false, detail: "endettement lourd — fragile si les taux montent" });
    }
    if (f.roe != null) {
      parts.push([ramp(f.roe, [[-10, 15], [0, 35], [10, 55], [20, 80], [40, 92]]), 1]);
    }

    // ── Sous-score QUALITÉ (inspiré du F-score de Piotroski) ──
    // Le facteur qualité est l'un des rares à résister au test hors-échantillon,
    // et il est particulièrement efficace sur les petites capitalisations —
    // exactement le type d'actions que le screener remonte.
    if (f.roa != null) {
      parts.push([ramp(f.roa, [[-5, 15], [0, 40], [5, 62], [12, 82], [25, 93]]), 1.5]);
      signals.push({
        label: `Rentabilité des actifs (ROA) : ${f.roa >= 0 ? "+" : ""}${f.roa.toFixed(1)} %`,
        good: f.roa > 5,
        detail: f.roa > 12 ? "actifs très rentables — signe de qualité" : f.roa > 5 ? "actifs correctement rentabilisés" : f.roa > 0 ? "rentabilité faible des actifs" : "actifs non rentables",
      });
    }
    if (f.grossMargin != null) {
      parts.push([ramp(f.grossMargin, [[10, 35], [30, 55], [50, 75], [70, 90]]), 1]);
      if (f.grossMargin > 50) signals.push({ label: `Marge brute : ${f.grossMargin.toFixed(0)} %`, good: true, detail: "fort pouvoir de fixation des prix" });
    }
    if (f.operatingMargin != null) {
      parts.push([ramp(f.operatingMargin, [[-5, 15], [5, 45], [15, 70], [30, 88]]), 1.5]);
      signals.push({
        label: `Marge d'exploitation : ${f.operatingMargin >= 0 ? "+" : ""}${f.operatingMargin.toFixed(1)} %`,
        good: f.operatingMargin > 12,
        detail: f.operatingMargin > 25 ? "entreprise très efficace" : f.operatingMargin > 12 ? "bonne efficacité opérationnelle" : f.operatingMargin > 0 ? "marges d'exploitation minces" : "activité non rentable",
      });
    }
    // Bénéfices adossés au cash (anomalie des accruals) : un bénéfice non
    // converti en cash est un signal d'alerte bien documenté (Sloan, 1996).
    if (f.cashConversion != null) {
      parts.push([ramp(f.cashConversion, [[-0.5, 12], [0, 30], [0.6, 65], [1, 85], [1.6, 92]]), 1.5]);
      signals.push({
        label: `Conversion en cash : ${Math.round(f.cashConversion * 100)} % du bénéfice`,
        good: f.cashConversion > 0.7,
        detail: f.cashConversion > 1 ? "bénéfices intégralement adossés au cash — très sain" : f.cashConversion > 0.7 ? "bénéfices majoritairement convertis en cash" : "bénéfices peu convertis en cash — prudence",
      });
    } else if (f.fcfPositive != null) {
      parts.push([f.fcfPositive ? 72 : 22, 1]);
      if (!f.fcfPositive) signals.push({ label: "Flux de trésorerie libre négatif", good: false, detail: "l'entreprise brûle du cash — fragilité" });
    }
    if (f.currentRatio != null) {
      parts.push([ramp(f.currentRatio, [[0.6, 22], [1, 48], [1.5, 72], [3, 85]]), 1]);
      if (f.currentRatio < 1) signals.push({ label: `Ratio de liquidité : ${f.currentRatio.toFixed(2)}`, good: false, detail: "passif court terme supérieur à l'actif court terme" });
    }

    if (!parts.length) return { score: null, signals };
    const totW = parts.reduce((s, [, w]) => s + w, 0);
    return { score: clamp(parts.reduce((s, [v, w]) => s + v * w, 0) / totW, 0, 100), signals };
  }

  /* ───────────── Pilier 4 : sentiment des news (0–100) ───────────── */

  const LEXICON = [
    // [regex, poids]  — positifs
    [/\b(record|beats?|beat estimates|tops? estimates|d[ée]passe|surpasse)\b/i, 2],
    [/\b(surge[sd]?|soar(s|ed)?|jump(s|ed)?|rall(y|ies)|bondit?|s'envole|flambe)\b/i, 2],
    [/\b(raises? (guidance|outlook|forecast)|rel[èe]ve ses (objectifs|pr[ée]visions))\b/i, 3],
    [/\b(upgrade[sd]?|rel[èe]vement|surpond[ée]rer|buy rating|price target raised|objectif relev[ée])\b/i, 2],
    [/\b(partnership|partenariat|contrat|contract (win|award)|deal|accord|alliance)\b/i, 2],
    [/\b(approval|approuv[ée]|autorisation|feu vert|breakthrough|perc[ée])\b/i, 2],
    [/\b(buyback|rachat d'actions|dividend (increase|hike)|dividende (relev[ée]|augment[ée]))\b/i, 2],
    [/\b(strong (results|earnings|quarter)|r[ée]sultats (records?|solides)|profit (jump|surge)|b[ée]n[ée]fices? en (forte )?hausse)\b/i, 2],
    [/\b(growth|croissance|expansion|acc[ée]l[ée]ration|momentum)\b/i, 1],
    [/\b(innovation|launch(es|ed)?|lancement|nouveau produit|new product|IA|AI[- ])\b/i, 1],
    // négatifs
    [/\b(miss(es|ed)? (estimates|expectations)|d[ée][çc]oit|rate le consensus|below expectations)\b/i, -2],
    [/\b(plunge[sd]?|plummet(s|ed)?|tumble[sd]?|crash|chute|d[ée]gringole|s'effondre)\b/i, -2],
    [/\b(cuts? (guidance|outlook|forecast)|profit warning|abaisse ses (objectifs|pr[ée]visions)|avertissement)\b/i, -3],
    [/\b(downgrade[sd]?|d[ée]gradation|sous-pond[ée]rer|sell rating|price target (cut|lowered)|objectif abaiss[ée])\b/i, -2],
    [/\b(lawsuit|proc[èe]s|plainte|litige|sued?|poursuites?)\b/i, -2],
    [/\b(investigation|enqu[êe]te|probe|SEC charges|fraud|fraude|scandal|scandale)\b/i, -3],
    [/\b(layoffs?|licenciements?|job cuts|restructuring|restructuration|plan social)\b/i, -1],
    [/\b(recall|rappel de produits?|d[ée]faut|defect|outage|panne)\b/i, -2],
    [/\b(bankruptcy|faillite|default|d[ée]faut de paiement|dilution|going concern)\b/i, -3],
    [/\b(decline[sd]?|drop(s|ped)?|fall[s]?|fell|baisse|recul|ralentissement|slowdown|weak demand|demande faible)\b/i, -1],
  ];

  function scoreHeadline(text) {
    let s = 0;
    for (const [re, w] of LEXICON) if (re.test(text)) s += w;
    return clamp(s, -4, 4);
  }

  /**
   * news : [{ headline, summary?, daysAgo, avSentiment? }]
   * avSentiment : score Alpha Vantage déjà calculé (-1..1), prioritaire si présent.
   */
  function scoreSentiment(news) {
    if (!news || !news.length) return { score: null, signals: [], scored: [] };
    const scored = news.map((n) => {
      const lex = scoreHeadline(`${n.headline} ${n.summary || ""}`);
      const raw = n.avSentiment != null ? n.avSentiment * 4 : lex;
      const freshness = Math.exp(-(n.daysAgo || 0) / 7); // demi-vie ≈ 5 jours
      return { ...n, raw, weight: freshness };
    });
    const totW = scored.reduce((s, n) => s + n.weight, 0);
    const avg = scored.reduce((s, n) => s + n.raw * n.weight, 0) / (totW || 1);
    let score = ramp(avg, [[-3, 5], [-1.5, 25], [0, 50], [1, 72], [2, 88], [3.5, 97]]);

    const signals = [];
    const buzz = news.filter((n) => (n.daysAgo || 0) <= 7).length;
    if (buzz >= 8) {
      score = clamp(score + 5, 0, 100);
      signals.push({ label: `Buzz médiatique : ${buzz} articles en 7 j`, good: avg >= 0, detail: avg >= 0 ? "forte attention, ton positif" : "forte attention mais ton négatif" });
    }
    signals.push({
      label: `Ton des news : ${avg > 0.5 ? "positif" : avg < -0.5 ? "négatif" : "neutre"} (${news.length} articles)`,
      good: avg > 0.3,
      detail: avg > 1.5 ? "flux de nouvelles très favorable" : avg < -1.5 ? "flux de nouvelles très défavorable" : "pas de catalyseur net dans la presse",
    });

    return { score, signals, scored };
  }

  /* ───────────── Score composite ───────────── */

  const WEIGHTS = { technical: 0.35, momentum: 0.15, fundamental: 0.30, sentiment: 0.20 };

  function composite(pillars) {
    // pillars = { technical, momentum, fundamental, sentiment } — chacun {score|null}
    let totW = 0, sum = 0, available = 0;
    for (const key of Object.keys(WEIGHTS)) {
      const p = pillars[key];
      if (p && p.score != null) {
        sum += p.score * WEIGHTS[key];
        totW += WEIGHTS[key];
        available += WEIGHTS[key];
      }
    }
    if (totW === 0) return { score: null, confidence: 0 };
    return {
      score: clamp(sum / totW, 0, 100),
      confidence: Math.round(available * 100), // % des poids couverts par de vraies données
    };
  }

  function verdict(score, volatility) {
    if (score == null) return { emoji: "❔", label: "Données insuffisantes", cls: "v-none" };
    if (score >= 75) {
      return volatility > 55
        ? { emoji: "🚀", label: "Explosif (risqué)", cls: "v-hot" }
        : { emoji: "🚀", label: "Fort potentiel", cls: "v-hot" };
    }
    if (score >= 60) return { emoji: "📈", label: "Configuration haussière", cls: "v-up" };
    if (score >= 45) return { emoji: "😐", label: "Neutre", cls: "v-flat" };
    if (score >= 30) return { emoji: "🌧️", label: "Fragile", cls: "v-down" };
    return { emoji: "⚠️", label: "Configuration défavorable", cls: "v-bad" };
  }

  /* ───────────── Analyse complète d'un titre ───────────── */

  /**
   * data = { symbol, name, closes[], volumes[], fundamentals{}, news[] }
   */
  function analyze(data) {
    const technical = scoreTechnical(data.closes, data.volumes);
    const momentum = scoreMomentum(data.closes);
    const fundamental = scoreFundamental(data.fundamentals);
    const sentiment = scoreSentiment(data.news);
    const comp = composite({ technical, momentum, fundamental, sentiment });
    return {
      symbol: data.symbol,
      name: data.name || data.symbol,
      closes: data.closes,
      price: data.closes && data.closes.length ? last(data.closes) : null,
      pillars: { technical, momentum, fundamental, sentiment },
      score: comp.score,
      confidence: comp.confidence,
      verdict: verdict(comp.score, momentum.volatility || 0),
      news: sentiment.scored || [],
    };
  }

  /* ───────────── « Avant le boum » : détection de démarrage précoce ─────────────
     Objectif inverse du momentum : repérer les ressorts comprimés AVANT la hausse
     — base plate qui se resserre, cours qui presse sous sa résistance, gain encore
     modeste, tout début d'accélération — et écarter ce qui a déjà explosé.
     Ne travaille que sur les cours (utilisable sur tout le marché). */

  function earlySetup(closes) {
    if (!closes || closes.length < 80) return null;
    const price = last(closes);
    const ret = (d) => (closes.length > d ? (price / closes[closes.length - 1 - d] - 1) * 100 : null);
    const perf1 = ret(21);
    const perf3 = ret(63);
    const perf6 = ret(126);   // 6 mois : pour ne PAS confondre « début de mouvement » et « déjà envolé »
    if (perf3 == null || perf1 == null) return null;

    const ma50 = last(sma(closes, Math.min(50, closes.length - 1)));
    const win = closes.slice(-126);
    const highN = Math.max(...win);
    const lowN = Math.min(...win);
    const distHigh = (price / highN - 1) * 100;      // 0 = au plus-haut 6 mois
    const extMa50 = ma50 ? (price / ma50 - 1) * 100 : 0;

    // Resserrement de la base : volatilité récente (20 j) faible = ressort comprimé
    const recent = closes.slice(-21);
    const rets = [];
    for (let i = 1; i < recent.length; i++) rets.push(recent[i] / recent[i - 1] - 1);
    const tight = std(rets) * Math.sqrt(252) * 100;
    // Amplitude de la base sur ~40 j : étroite = consolidation saine
    const base = closes.slice(-40);
    const baseRange = (Math.max(...base) - Math.min(...base)) / mean(base) * 100;

    // Filtres durs : ni déjà envolé (3 MOIS ou 6 MOIS), ni en chute
    const alreadyMooned = perf3 > 30 || (perf6 != null && perf6 > 55);
    const nearHigh = distHigh >= -12;                // proche de sa résistance
    const eligible = !alreadyMooned && perf3 >= -12 && nearHigh && price > 1;

    // Composantes du score (0-100)
    const sBreak = ramp(distHigh, [[-30, 10], [-15, 35], [-8, 65], [-3, 88], [0, 95], [4, 78]]);
    const sSweet = ramp(perf3, [[-15, 20], [-5, 50], [5, 82], [14, 92], [22, 72], [30, 40], [45, 12]]);
    const accel = perf1 - perf3 / 3;                 // le dernier mois dépasse-t-il le rythme ?
    const sAccel = ramp(accel, [[-6, 25], [0, 55], [4, 80], [10, 92]]);
    const sTight = ramp(tight, [[15, 92], [28, 74], [45, 50], [70, 25], [110, 8]]);
    const sBase = ramp(baseRange, [[8, 90], [16, 72], [28, 48], [45, 22]]);
    const sExt = ramp(extMa50, [[-8, 30], [-2, 62], [3, 92], [10, 78], [20, 42], [35, 12]]);

    const parts = [[sBreak, 2], [sSweet, 2], [sAccel, 1.5], [sTight, 1.3], [sBase, 1], [sExt, 1]];
    const totW = parts.reduce((s, [, w]) => s + w, 0);
    let score = parts.reduce((s, [v, w]) => s + v * w, 0) / totW;
    if (!eligible) score = Math.min(score, alreadyMooned ? 25 : 40); // pénalise le hors-cible

    return {
      score: clamp(score, 0, 100), eligible,
      perf1, perf3, perf6, distHigh, extMa50, tight, baseRange, alreadyMooned,
    };
  }

  /* ───────────── Score de MOAT (avantage concurrentiel durable) ─────────
     Mesure ce qui « démarque » une entreprise de ses concurrents :
       · marge brute élevée      → pouvoir de fixation des prix (pricing power)
       · marge d'exploitation    → efficacité supérieure
       · ROE élevé               → capital très bien rémunéré
       · bénéfices adossés au cash → qualité réelle, pas comptable
       · faible dette            → indépendance / solidité
       · croissance régulière    → l'avantage se traduit en chiffre d'affaires
     Un score élevé = leader difficile à copier. f = mêmes champs que scoreFundamental. */
  function moatScore(f) {
    if (!f) return null;
    const parts = [];
    if (f.grossMargin != null) parts.push([ramp(f.grossMargin, [[20, 20], [40, 50], [55, 72], [70, 90], [80, 96]]), 2.2]);
    if (f.operatingMargin != null) parts.push([ramp(f.operatingMargin, [[0, 15], [10, 48], [20, 74], [35, 92]]), 2]);
    if (f.roe != null) parts.push([ramp(f.roe, [[0, 15], [10, 45], [20, 75], [35, 92]]), 1.5]);
    if (f.netMargin != null) parts.push([ramp(f.netMargin, [[0, 20], [8, 50], [18, 78], [30, 94]]), 1]);
    if (f.cashConversion != null) parts.push([ramp(f.cashConversion, [[0, 20], [0.6, 60], [1, 88], [1.5, 94]]), 1.5]);
    if (f.debtToEquity != null) parts.push([ramp(f.debtToEquity, [[0, 92], [0.5, 78], [1.5, 48], [3, 22]]), 1]);
    if (f.revenueGrowth != null) parts.push([ramp(f.revenueGrowth, [[0, 35], [8, 58], [20, 80], [40, 92]]), 1]);
    if (parts.length < 3) return null;   // besoin d'assez de données pour juger un moat
    const totW = parts.reduce((s, [, w]) => s + w, 0);
    return clamp(parts.reduce((s, [v, w]) => s + v * w, 0) / totW, 0, 100);
  }

  /* ───────────── Détecteur de DRAPEAUX ROUGES (événements de société) ─────
     La machine lit des chiffres et des cours, PAS le contexte. Or certains
     événements (rachat/retrait de cote, faillite, fraude, dilution, procès)
     rendent une action FAUSSEMENT belle : le cours se fige, la valorisation
     semble basse… alors que c'est un piège. On scanne donc les news pour les
     repérer. severity "hard" = à exclure des picks ; "warn" = à signaler.
     news : [{ headline, summary? }] */
  const RISK_PATTERNS = [
    [/\b(take[-\s]?private|go(?:ing)?\s+private|tender\s+offer|to\s+acquire\s+(?:the\s+)?remaining|acquisition\s+proposal|proposal\s+to\s+acquire|to\s+be\s+acquired|agreement\s+to\s+be\s+acquired|buyout\s+(?:offer|proposal|of)|squeeze[-\s]?out|minority\s+buy[-\s]?out)\b/i, "Rachat / retrait de la cote", "hard"],
    [/\b(going\s+concern|files?\s+for\s+bankruptcy|bankruptcy\s+protection|files?\s+chapter\s+(?:11|7)|chapter\s+(?:11|7)\s+(?:filing|bankruptcy|protection)|enters?\s+bankruptcy|insolven|debt\s+restructuring)\b/i, "Risque de faillite", "hard"],
    [/\b(accounting\s+(?:fraud|irregular)|financial\s+restat|restatement|SEC\s+(?:investigation|charges|probe|subpoena)|securities\s+fraud|material\s+weakness)\b/i, "Fraude / enquête comptable", "hard"],
    [/\b(delist(?:ing|ed)?|notice\s+of\s+noncompliance|deficiency\s+(?:letter|notice)|fails?\s+to\s+regain\s+compliance)\b/i, "Risque de radiation (delisting)", "hard"],
    [/\b(secondary\s+offering|public\s+offering|proposed\s+offering|priced\s+(?:its\s+)?(?:public\s+)?offering|at[-\s]?the[-\s]?market\s+offering|shelf\s+registration|dilut|convertible\s+notes?\s+offering|registered\s+direct\s+offering)\b/i, "Dilution (émission d'actions)", "warn"],
    [/\b(class[-\s]?action|securities\s+(?:class\s+)?(?:lawsuit|litigation)|shareholder\s+(?:suit|lawsuit|investigation)|investor\s+alert)\b/i, "Litige / enquête", "warn"],
    [/\b(reverse\s+(?:stock\s+)?split)\b/i, "Regroupement d'actions", "warn"],
    [/\b(profit\s+warning|cuts?\s+(?:its\s+)?(?:guidance|outlook|forecast)|withdraws?\s+guidance|slashes?\s+(?:outlook|guidance))\b/i, "Avertissement sur résultats", "warn"],
  ];
  const NAME_STOP = new Set(["inc", "corp", "corporation", "ltd", "limited", "company", "holdings", "holding", "group", "plc", "the", "common", "stock", "shares", "ordinary", "class", "depositary", "receipt", "and", "for", "financial", "capital", "international", "technologies", "technology", "industries"]);
  function nameTokens(name) {
    if (!name) return [];
    return name.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !NAME_STOP.has(w));
  }
  /** news : [{ headline, summary? }] ; name : raison sociale (pour éviter de
      flaguer un simple voisin cité dans l'article — on exige que le titre
      parle bien de CETTE société). */
  function detectRedFlags(news, name) {
    if (!news || !news.length) return [];
    const tokens = nameTokens(name);
    const found = new Map();
    for (const n of news) {
      const text = `${n.headline || ""} ${n.summary || ""}`;
      const lc = text.toLowerCase();
      // Le titre doit mentionner la société elle-même (sinon : voisin cité).
      const aboutUs = !tokens.length || tokens.some((t) => lc.includes(t));
      if (!aboutUs) continue;
      for (const [re, type, severity] of RISK_PATTERNS) {
        if (re.test(text) && !found.has(type)) {
          found.set(type, { type, severity, evidence: (n.headline || "").slice(0, 160) });
        }
      }
    }
    return [...found.values()];
  }

  /* ───────────── Résumé écrit de l'actualité (règles, sans LLM) ─────────
     Transforme une liste de titres en une phrase française lisible : ton
     général + thèmes détectés. Sert pour une action comme pour le marché.
     news : [{ headline, summary?, daysAgo? }] */
  const NEWS_TOPICS = [
    [/\b(beats?|tops?|record|surpass|blowout|strong\s+(?:results|quarter|earnings))\b/i, "de bons résultats", 1],
    [/\b(raises?\s+(?:guidance|outlook|forecast)|lifts?\s+outlook)\b/i, "des prévisions relevées", 1],
    [/\b(upgrade|strong\s+buy|buy\s+rating|price\s+target\s+(?:raise|hike|boost)|raised\s+.*target|outperform|top\s+.*stock|top\s+dividend)\b/i, "des avis d'analystes favorables", 1],
    [/\b(all[-\s]?time\s+high|record\s+high|52[-\s]?week\s+high|rally|surge|soar|jump|rockets?|spikes?)\b/i, "une forte hausse récente", 1],
    [/\b(dividend|payout|buyback|share\s+repurchase)\b/i, "un dividende / rachat d'actions", 1],
    [/\b(partnership|deal|contract|launch|approval|expansion|new\s+product)\b/i, "un développement stratégique", 1],
    [/\b(earnings|results|quarter|Q[1-4]\b|to\s+report|conference\s+call)\b/i, "des résultats attendus ou publiés", 0],
    [/\b(downgrade|sell\s+rating|price\s+target\s+(?:cut|lower)|underperform)\b/i, "des avis d'analystes prudents", -1],
    [/\b(miss(?:es|ed)?|disappoint|plunge|tumble|slump|sinks?|falls?\s+\d|drops?\s+\d)\b/i, "une déception / baisse", -1],
    [/\b(cuts?\s+(?:guidance|outlook|forecast)|profit\s+warning|withdraws?\s+guidance)\b/i, "un avertissement sur les prévisions", -1],
    [/\b(acquire|acquisition|merger|buyout|take[-\s]?private|tender\s+offer)\b/i, "une opération de rachat/fusion", 0],
    [/\b(offering|dilut|shelf\s+registration|convertible\s+notes?)\b/i, "une émission d'actions (dilution)", -1],
    [/\b(lawsuit|class[-\s]?action|investigation|probe|SEC\s+charges|subpoena)\b/i, "un litige ou une enquête", -1],
  ];
  function newsDigest(news) {
    if (!news || !news.length) return null;
    const n = news.length;
    let tot = 0;
    const topics = [];
    const seen = new Set();
    for (const item of news) {
      const h = `${item.headline || ""} ${item.summary || ""}`;
      tot += scoreHeadline(item.headline || "");
      for (const [re, label] of NEWS_TOPICS) {
        if (re.test(h) && !seen.has(label)) { seen.add(label); topics.push(label); }
      }
    }
    const avg = tot / n;
    const ton = avg > 0.6 ? "plutôt positive" : avg < -0.6 ? "plutôt négative" : "mitigée";
    let s = `Actualité récente ${ton} (${n} article${n > 1 ? "s" : ""})`;
    const list = topics.slice(0, 3);
    s += list.length ? " : " + list.join(", ") + "." : ".";
    return s;
  }

  /* ───────────── Force relative vs marché (S&P 500) ─────────────
     Le signal n°1 des « grands gagnants » : une action qui surperforme
     déjà l'indice avant de casser. idx = { r21, r63, r126 } (perfs indice). */
  function relStrength(closes, idx) {
    if (!closes || !idx) return null;
    const parts = [];
    const add = (d, w, ir) => { const s = periodReturn(closes, d); if (s != null && ir != null) parts.push([s - ir, w]); };
    add(21, 1, idx.r21); add(63, 2, idx.r63); add(126, 1.5, idx.r126);
    if (!parts.length) return null;
    const excess = parts.reduce((s, [v, w]) => s + v * w, 0) / parts.reduce((s, [, w]) => s + w, 0);
    return { excess, score: clamp(ramp(excess, [[-40, 8], [-15, 30], [0, 52], [10, 72], [25, 88], [50, 98]]), 0, 100) };
  }

  /* ───────────── « Trend template » (Minervini) ─────────────
     Coche les critères d'une action en tendance de fond confirmée,
     historiquement le terreau des fortes hausses. */
  function trendTemplate(closes) {
    if (!closes || closes.length < 150) return null;
    const price = last(closes);
    const ma50 = last(sma(closes, 50));
    const ma150 = closes.length >= 150 ? last(sma(closes, 150)) : null;
    const ma200 = closes.length >= 200 ? last(sma(closes, 200)) : null;
    const ma200prev = closes.length >= 221 ? last(sma(closes.slice(0, -21), 200)) : null;
    const hi = Math.max(...closes.slice(-252));
    const lo = Math.min(...closes.slice(-252));
    const checks = [
      { k: "Cours au-dessus de la MM200", ok: ma200 != null ? price > ma200 : price > ma50 },
      { k: "MM150 au-dessus de la MM200", ok: ma150 != null && ma200 != null ? ma150 > ma200 : true },
      { k: "MM200 orientée à la hausse", ok: ma200 != null && ma200prev != null ? ma200 > ma200prev : true },
      { k: "MM50 au-dessus des MM150/200", ok: ma50 != null && ma150 != null ? ma50 > ma150 : true },
      { k: "Cours au-dessus de la MM50", ok: ma50 != null ? price > ma50 : true },
      { k: "≥ 30 % au-dessus du plus-bas 52 sem.", ok: price >= lo * 1.3 },
      { k: "À moins de 25 % du plus-haut 52 sem.", ok: price >= hi * 0.75 },
    ];
    const passed = checks.filter((c) => c.ok).length;
    return { passed, total: checks.length, checks, score: clamp((passed / checks.length) * 100, 0, 100), pass: passed >= 6 };
  }

  return {
    analyze, verdict, composite, WEIGHTS, earlySetup, relStrength, trendTemplate, detectRedFlags, newsDigest, moatScore,
    scoreTechnical, scoreMomentum, scoreFundamental, scoreSentiment, scoreHeadline,
    rsi, macd, sma, ema, trendSlope, annualVol, periodReturn, bollingerPos, volumeSurge,
    clamp, ramp,
  };
})();

// Export Node (robot d'analyse automatique) — sans effet dans le navigateur
if (typeof module !== "undefined" && module.exports) module.exports = Engine;
