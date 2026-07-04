/* ═══════════════════════════════════════════════════════════════════
   Oracle Bourse — app.js
   Orchestration UI : watchlist, lancement des analyses, rendu du
   classement, fiche détaillée, sparklines avec tooltip.
   ═══════════════════════════════════════════════════════════════════ */
"use strict";

(() => {

  const DEFAULT_WATCHLIST = ["NVDA", "AAPL", "MSFT", "TSLA", "AMZN", "GOOGL", "META", "AMD", "PLTR", "INTC", "KO", "BA"];
  const LS = { watch: "oracle.watchlist", finnhub: "oracle.finnhub", alpha: "oracle.alpha" };

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  let watchlist = loadWatchlist();
  let results = [];

  /* ───────────── Persistance ───────────── */

  function loadWatchlist() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS.watch));
      if (Array.isArray(raw) && raw.length) return raw;
    } catch { /* ignore */ }
    return [...DEFAULT_WATCHLIST];
  }
  const saveWatchlist = () => localStorage.setItem(LS.watch, JSON.stringify(watchlist));

  function keys() {
    return { finnhub: $("finnhubKey").value.trim(), alpha: $("alphaKey").value.trim() };
  }

  /* ───────────── Watchlist UI ───────────── */

  function renderChips() {
    const box = $("chips");
    box.innerHTML = "";
    for (const t of watchlist) {
      const chip = el("span", "chip", t + " ");
      const x = el("button", "chip-x", "✕");
      x.title = `Retirer ${t}`;
      x.onclick = () => { watchlist = watchlist.filter((w) => w !== t); saveWatchlist(); renderChips(); };
      chip.appendChild(x);
      box.appendChild(chip);
    }
    $("watchCount").textContent = `${watchlist.length} titre${watchlist.length > 1 ? "s" : ""}`;
  }

  function addTicker() {
    const t = $("tickerInput").value.trim().toUpperCase().replace(/[^A-Z.\-]/g, "");
    if (t && !watchlist.includes(t)) {
      watchlist.push(t);
      saveWatchlist();
      renderChips();
    }
    $("tickerInput").value = "";
  }

  /* ───────────── Mode pill ───────────── */

  function refreshMode() {
    const k = keys();
    const pill = $("modePill");
    if (k.finnhub && k.alpha) { pill.textContent = "Données réelles (Finnhub + Alpha Vantage)"; pill.classList.add("live"); }
    else if (k.finnhub) { pill.textContent = "Données réelles (Finnhub)"; pill.classList.add("live"); }
    else if (k.alpha) { pill.textContent = "Données réelles (Alpha Vantage)"; pill.classList.add("live"); }
    else { pill.textContent = "Mode démo"; pill.classList.remove("live"); }
  }

  /* ───────────── Analyse ───────────── */

  async function run() {
    if (!watchlist.length) return;
    const k = keys();
    localStorage.setItem(LS.finnhub, k.finnhub);
    localStorage.setItem(LS.alpha, k.alpha);
    refreshMode();

    $("runBtn").disabled = true;
    $("progress").classList.remove("hidden");
    $("detailPanel").classList.add("hidden");
    results = [];

    // Alpha Vantage gratuit ≈ 5 req/min → on espace les appels si clé Alpha seule
    const throttleMs = k.alpha ? 1300 : 0;

    for (let i = 0; i < watchlist.length; i++) {
      const sym = watchlist[i];
      $("progressLabel").textContent = `Analyse de ${sym}… (${i + 1}/${watchlist.length})`;
      $("progressFill").style.width = `${((i) / watchlist.length) * 100}%`;
      try {
        const data = await Providers.fetchAll(sym, k);
        const res = Engine.analyze(data);
        res.warnings = data.warnings || [];
        res.sources = data.sources || [];
        results.push(res);
        renderTable(); // rendu incrémental
      } catch (e) {
        results.push({
          symbol: sym, name: sym, score: null, confidence: 0,
          verdict: { emoji: "❌", label: `Erreur : ${e.message}`, cls: "v-none" },
          pillars: {}, news: [], warnings: [String(e.message)], sources: [],
        });
        renderTable();
      }
      if (throttleMs && i < watchlist.length - 1) await new Promise((r) => setTimeout(r, throttleMs));
    }

    $("progressFill").style.width = "100%";
    $("progressLabel").textContent = "Analyse terminée ✓";
    $("runBtn").disabled = false;
    setTimeout(() => $("progress").classList.add("hidden"), 1500);
  }

  /* ───────────── Tableau de classement ───────────── */

  function scoreCell(v) {
    const td = el("td", "num");
    if (v == null) { td.textContent = "—"; td.classList.add("muted"); return td; }
    td.textContent = Math.round(v);
    td.classList.add(v >= 70 ? "s-good" : v >= 50 ? "s-mid" : v >= 35 ? "s-low" : "s-bad");
    return td;
  }

  function renderTable() {
    const sorted = [...results].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    const body = $("resultsBody");
    body.innerHTML = "";
    $("resultsPanel").classList.remove("hidden");

    sorted.forEach((r, i) => {
      const tr = document.createElement("tr");
      tr.appendChild(el("td", "rank", String(i + 1)));

      const tdName = el("td", "name-cell");
      tdName.appendChild(el("strong", null, r.symbol));
      tdName.appendChild(el("span", "sub", r.name !== r.symbol ? r.name : ""));
      tr.appendChild(tdName);

      const tdScore = el("td", "num score-main");
      tdScore.textContent = r.score != null ? Math.round(r.score) : "—";
      tr.appendChild(tdScore);

      const tdV = el("td");
      const badge = el("span", `badge ${r.verdict.cls}`, `${r.verdict.emoji} ${r.verdict.label}`);
      tdV.appendChild(badge);
      tr.appendChild(tdV);

      tr.appendChild(scoreCell(r.pillars.technical?.score));
      tr.appendChild(scoreCell(r.pillars.momentum?.score));
      tr.appendChild(scoreCell(r.pillars.fundamental?.score));
      tr.appendChild(scoreCell(r.pillars.sentiment?.score));

      const tdC = el("td", "num");
      tdC.textContent = r.confidence ? `${r.confidence} %` : "—";
      if (r.confidence < 60) tdC.classList.add("muted");
      tr.appendChild(tdC);

      const tdSpark = el("td", "spark-cell");
      if (r.closes && r.closes.length > 5) tdSpark.appendChild(sparkline(r.closes.slice(-90), 120, 32));
      tr.appendChild(tdSpark);

      tr.onclick = () => showDetail(r);
      body.appendChild(tr);
    });
  }

  /* ───────────── Sparkline SVG + tooltip ───────────── */

  const tooltip = () => $("tooltip");

  function sparkline(values, w, h, interactive = false) {
    const min = Math.min(...values), max = Math.max(...values);
    const span = max - min || 1;
    const pad = 2;
    const pts = values.map((v, i) => [
      pad + (i / (values.length - 1)) * (w - 2 * pad),
      h - pad - ((v - min) / span) * (h - 2 * pad),
    ]);
    const up = values[values.length - 1] >= values[0];

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.classList.add("spark", up ? "spark-up" : "spark-down");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L"));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linejoin", "round");
    path.classList.add("spark-line");
    svg.appendChild(path);

    if (interactive) {
      const cross = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cross.setAttribute("y1", pad); cross.setAttribute("y2", h - pad);
      cross.classList.add("spark-cross", "hidden");
      svg.appendChild(cross);
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("r", "4");
      dot.classList.add("spark-dot", "hidden");
      svg.appendChild(dot);

      svg.addEventListener("mousemove", (ev) => {
        const rect = svg.getBoundingClientRect();
        const x = ((ev.clientX - rect.left) / rect.width) * w;
        const idx = Engine.clamp(Math.round(((x - pad) / (w - 2 * pad)) * (values.length - 1)), 0, values.length - 1);
        const [px, py] = pts[idx];
        cross.setAttribute("x1", px); cross.setAttribute("x2", px);
        dot.setAttribute("cx", px); dot.setAttribute("cy", py);
        cross.classList.remove("hidden");
        dot.classList.remove("hidden");
        const tt = tooltip();
        tt.textContent = `J-${values.length - 1 - idx} : ${values[idx].toFixed(2)} $`;
        tt.style.left = `${ev.clientX + 12}px`;
        tt.style.top = `${ev.clientY - 30}px`;
        tt.classList.remove("hidden");
      });
      svg.addEventListener("mouseleave", () => {
        cross.classList.add("hidden");
        dot.classList.add("hidden");
        tooltip().classList.add("hidden");
      });
    }
    return svg;
  }

  /* ───────────── Fiche détaillée ───────────── */

  function pillarBar(label, weight, score) {
    const row = el("div", "pbar-row");
    row.appendChild(el("span", "pbar-label", `${label} (${Math.round(weight * 100)} %)`));
    const track = el("div", "pbar-track");
    const fill = el("div", "pbar-fill");
    if (score != null) {
      fill.style.width = `${Math.round(score)}%`;
      fill.classList.add(score >= 70 ? "s-good-bg" : score >= 50 ? "s-mid-bg" : score >= 35 ? "s-low-bg" : "s-bad-bg");
    } else {
      fill.classList.add("pbar-none");
    }
    track.appendChild(fill);
    row.appendChild(track);
    row.appendChild(el("span", "pbar-val", score != null ? String(Math.round(score)) : "n/d"));
    return row;
  }

  function showDetail(r) {
    $("detailTitle").textContent = `${r.verdict.emoji} ${r.symbol} — ${r.name}`;
    const body = $("detailBody");
    body.innerHTML = "";

    // En-tête : score + prix + confiance
    const head = el("div", "detail-head");
    const scoreBox = el("div", "score-box");
    scoreBox.appendChild(el("div", "score-big", r.score != null ? String(Math.round(r.score)) : "—"));
    scoreBox.appendChild(el("div", "score-sub", "score / 100"));
    head.appendChild(scoreBox);

    const meta = el("div", "detail-meta");
    meta.appendChild(el("div", `badge big ${r.verdict.cls}`, `${r.verdict.emoji} ${r.verdict.label}`));
    if (r.price != null) meta.appendChild(el("div", "meta-line", `Dernier cours : ${r.price.toFixed(2)} $`));
    meta.appendChild(el("div", "meta-line", `Confiance : ${r.confidence} % des critères couverts par des données`));
    if (r.sources.length) meta.appendChild(el("div", "meta-line sub", `Sources : ${r.sources.join(" · ")}`));
    head.appendChild(meta);
    body.appendChild(head);

    // Graphique interactif
    if (r.closes && r.closes.length > 5) {
      const chartBox = el("div", "chart-box");
      chartBox.appendChild(el("h3", null, "Cours — 6 derniers mois"));
      const wrap = el("div", "chart-wrap");
      wrap.appendChild(sparkline(r.closes.slice(-126), 640, 140, true));
      chartBox.appendChild(wrap);
      body.appendChild(chartBox);
    }

    // Décomposition des piliers
    const pb = el("div", "pillar-box");
    pb.appendChild(el("h3", null, "Décomposition du score"));
    pb.appendChild(pillarBar("Technique", Engine.WEIGHTS.technical, r.pillars.technical?.score));
    pb.appendChild(pillarBar("Momentum", Engine.WEIGHTS.momentum, r.pillars.momentum?.score));
    pb.appendChild(pillarBar("Fondamental", Engine.WEIGHTS.fundamental, r.pillars.fundamental?.score));
    pb.appendChild(pillarBar("Sentiment", Engine.WEIGHTS.sentiment, r.pillars.sentiment?.score));
    body.appendChild(pb);

    // Signaux
    const allSignals = [
      ...(r.pillars.technical?.signals || []),
      ...(r.pillars.momentum?.signals || []),
      ...(r.pillars.fundamental?.signals || []),
      ...(r.pillars.sentiment?.signals || []),
    ];
    if (allSignals.length) {
      const sb = el("div", "signal-box");
      sb.appendChild(el("h3", null, "Signaux détectés"));
      for (const s of allSignals) {
        const row = el("div", "signal");
        row.appendChild(el("span", `sig-dot ${s.good ? "sig-good" : "sig-bad"}`, s.good ? "▲" : "▼"));
        const txt = el("div", "sig-txt");
        txt.appendChild(el("strong", null, s.label));
        if (s.detail) txt.appendChild(el("span", "sub", " — " + s.detail));
        row.appendChild(txt);
        sb.appendChild(row);
      }
      body.appendChild(sb);
    }

    // News
    if (r.news && r.news.length) {
      const nb = el("div", "news-box");
      nb.appendChild(el("h3", null, `Dernières news analysées (${r.news.length})`));
      for (const n of [...r.news].sort((a, b) => (a.daysAgo || 0) - (b.daysAgo || 0)).slice(0, 12)) {
        const row = el("div", "news-item");
        const tone = n.raw > 0.5 ? ["news-pos", "positif"] : n.raw < -0.5 ? ["news-neg", "négatif"] : ["news-neu", "neutre"];
        row.appendChild(el("span", `news-tag ${tone[0]}`, tone[1]));
        const txt = el("div", "news-txt");
        if (n.url) {
          const a = document.createElement("a");
          a.href = n.url; a.target = "_blank"; a.rel = "noopener";
          a.textContent = n.headline;
          txt.appendChild(a);
        } else {
          txt.appendChild(el("span", null, n.headline));
        }
        txt.appendChild(el("span", "sub", ` — ${n.source || ""}, il y a ${Math.round(n.daysAgo || 0)} j`));
        row.appendChild(txt);
        nb.appendChild(row);
      }
      body.appendChild(nb);
    }

    // Avertissements
    if (r.warnings && r.warnings.length) {
      const wb = el("div", "warn-box");
      for (const w of r.warnings) wb.appendChild(el("div", "warn-line", "ℹ️ " + w));
      body.appendChild(wb);
    }

    $("detailPanel").classList.remove("hidden");
    $("detailPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ───────────── Init ───────────── */

  function init() {
    $("finnhubKey").value = localStorage.getItem(LS.finnhub) || "";
    $("alphaKey").value = localStorage.getItem(LS.alpha) || "";
    refreshMode();
    renderChips();

    $("addTicker").onclick = addTicker;
    $("tickerInput").addEventListener("keydown", (e) => { if (e.key === "Enter") addTicker(); });
    $("resetWatch").onclick = () => { watchlist = [...DEFAULT_WATCHLIST]; saveWatchlist(); renderChips(); };
    $("runBtn").onclick = run;
    $("closeDetail").onclick = () => $("detailPanel").classList.add("hidden");
    $("finnhubKey").addEventListener("input", refreshMode);
    $("alphaKey").addEventListener("input", refreshMode);
    $("toggleConfig").onclick = () => {
      const b = $("configBody");
      const hidden = b.classList.toggle("hidden");
      $("toggleConfig").textContent = hidden ? "Déplier" : "Replier";
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
