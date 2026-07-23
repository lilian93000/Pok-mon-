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
  let dataGeneratedAt = null; // horodatage de l'analyse chargée (fraîcheur des données)

  // Format capitalisation boursière (2,3 Md$, 450 M$…)
  function fmtCap(x) {
    if (x == null || !isFinite(x)) return null;
    if (x >= 1e12) return (x / 1e12).toFixed(1).replace(".", ",") + " T$";
    if (x >= 1e9) return (x / 1e9).toFixed(1).replace(".", ",") + " Md$";
    if (x >= 1e6) return Math.round(x / 1e6) + " M$";
    return Math.round(x) + " $";
  }

  const SECTORS_FR = {
    "Financial Services": "Finance", "Healthcare": "Santé", "Technology": "Technologie",
    "Energy": "Énergie", "Consumer Cyclical": "Consommation cyclique",
    "Consumer Defensive": "Consommation de base", "Industrials": "Industrie",
    "Basic Materials": "Matériaux", "Communication Services": "Communication",
    "Utilities": "Services aux collectivités", "Real Estate": "Immobilier",
  };
  const translateSector = (s) => SECTORS_FR[s] || s;

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
      tdName.appendChild(el("strong", null, (r.fromScan ? "🔍 " : "") + r.symbol));
      tdName.appendChild(el("span", "sub", r.name !== r.symbol ? r.name : ""));
      if (r.fromScan) tdName.title = "Détecté par le scan du marché (pas dans les favoris)";
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
    // Profil d'entreprise (données du jour)
    if (r.profile) {
      const pr = r.profile;
      const bits = [];
      if (pr.sector) bits.push(translateSector(pr.sector));
      if (pr.industry && pr.industry !== pr.sector) bits.push(pr.industry);
      if (pr.marketCap) bits.push("capi. " + fmtCap(pr.marketCap));
      if (pr.employees) bits.push(pr.employees.toLocaleString("fr-FR") + " employés");
      if (bits.length) meta.appendChild(el("div", "meta-line", "🏢 " + bits.join(" · ")));
    }
    // Signaux avancés (force relative, tendance de fond, analystes, short, résultats)
    const adv = [];
    if (r.rs) adv.push(`RS marché ${r.rs.excess >= 0 ? "+" : ""}${r.rs.excess} pts`);
    if (r.trend) adv.push(`tendance ${r.trend.passed}/${r.trend.total}`);
    const ex = r.extra || {};
    if (ex.targetUpside != null) adv.push(`potentiel analystes ${ex.targetUpside >= 0 ? "+" : ""}${Math.round(ex.targetUpside)} %`);
    if (ex.shortPercent != null && ex.shortPercent >= 8) adv.push(`short ${Math.round(ex.shortPercent)} %`);
    if (ex.earningsInDays != null && ex.earningsInDays >= 0 && ex.earningsInDays <= 30) adv.push(`résultats dans ${ex.earningsInDays} j`);
    if (adv.length) meta.appendChild(el("div", "meta-line", "📊 " + adv.join(" · ")));
    meta.appendChild(el("div", "meta-line", `Confiance : ${r.confidence} % des critères couverts par des données`));
    if (dataGeneratedAt) {
      const d = new Date(dataGeneratedAt);
      meta.appendChild(el("div", "meta-line sub", `🕒 Données du ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} à ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` + (r.sources.length ? ` · ${r.sources.join(" · ")}` : "")));
    } else if (r.sources.length) {
      meta.appendChild(el("div", "meta-line sub", `Sources : ${r.sources.join(" · ")}`));
    }
    head.appendChild(meta);
    body.appendChild(head);

    // Description de l'entreprise (repliée) — texte source Yahoo
    if (r.profile && r.profile.summary) {
      const det = document.createElement("details");
      det.className = "profile-summary";
      det.appendChild(el("summary", null, "Que fait l'entreprise ?"));
      det.appendChild(el("p", null, r.profile.summary + "…"));
      body.appendChild(det);
    }

    // Analyse écrite : pourquoi investir maintenant, forces, risques, profil
    if (r.analysis) {
      const a = r.analysis;
      const box = el("div", "analysis-box");
      box.appendChild(el("h3", null, "📝 L'analyse de la machine"));
      if (a.resume) box.appendChild(el("p", "an-resume", a.resume));

      if (a.pourquoi) {
        box.appendChild(el("h4", "an-h", "Pourquoi c'est intéressant maintenant"));
        box.appendChild(el("p", null, a.pourquoi));
      }

      // liste avec intitulé en gras + explication
      const richList = (items, cls) => {
        const ul = el("ul", `an-list ${cls}`);
        for (const it of items) {
          const li = document.createElement("li");
          if (it && typeof it === "object") {
            li.appendChild(el("strong", null, it.lead));
            if (it.detail) li.appendChild(document.createTextNode(" — " + it.detail));
          } else {
            li.textContent = it;
          }
          ul.appendChild(li);
        }
        return ul;
      };

      if (a.forces && a.forces.length) {
        box.appendChild(el("h4", "an-h an-good", "Les points forts, en détail"));
        box.appendChild(richList(a.forces, "an-list-good"));
      }
      if (a.piliers && a.piliers.length) {
        box.appendChild(el("h4", "an-h", "Ce que disent les 4 piliers"));
        const ul = el("ul", "an-list an-list-pillars");
        for (const p of a.piliers) ul.appendChild(el("li", null, p));
        box.appendChild(ul);
      }
      if (a.vigilance && a.vigilance.length) {
        box.appendChild(el("h4", "an-h an-warn", "Les points de vigilance"));
        box.appendChild(richList(a.vigilance, "an-list-warn"));
      }
      if (a.profil) {
        box.appendChild(el("h4", "an-h", "Pour quel profil"));
        box.appendChild(el("p", null, a.profil));
      }
      if (a.pratique) box.appendChild(el("p", "an-pratique", a.pratique));
      body.appendChild(box);
    }

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

  /* ───────────── Picks du jour ───────────── */

  const PICK_META = {
    avantBoum: { emoji: "🌱", cls: "pick-ab" },
    longTerme: { emoji: "🏛️", cls: "pick-lt" },
    complet: { emoji: "⭐", cls: "pick-cp" },
    oneShot: { emoji: "🚀", cls: "pick-os" },
  };

  function pickPillar(lbl, v) {
    const row = el("div", "pp-row");
    row.appendChild(el("span", "pp-lbl", lbl));
    const track = el("div", "pp-track");
    const fill = el("div", "pp-fill");
    if (v == null) {
      fill.classList.add("pp-none");
    } else {
      fill.style.width = `${Math.round(v)}%`;
      fill.classList.add(v >= 70 ? "s-good-bg" : v >= 50 ? "s-mid-bg" : v >= 35 ? "s-low-bg" : "s-bad-bg");
    }
    track.appendChild(fill);
    row.appendChild(track);
    row.appendChild(el("span", "pp-val", v == null ? "—" : String(v)));
    return row;
  }

  function renderPicks(picks) {
    const grid = $("picksGrid");
    grid.innerHTML = "";
    let any = false;
    for (const key of ["avantBoum", "longTerme", "complet", "oneShot"]) {
      const p = picks[key];
      if (!p) continue;
      any = true;
      const meta = PICK_META[key];
      const card = el("div", `pick-card ${meta.cls}`);

      // En-tête : pastille profil + gros score
      const head = el("div", "pick-head");
      head.appendChild(el("span", "pick-cat", `${meta.emoji} ${p.category}`));
      const scoreWrap = el("div", "pick-score-wrap");
      scoreWrap.appendChild(el("span", "pick-score", String(p.score)));
      scoreWrap.appendChild(el("span", "pick-score-max", "/100"));
      head.appendChild(scoreWrap);
      card.appendChild(head);

      // Ticker + nom + verdict
      const tick = el("div", "pick-ticker");
      tick.appendChild(el("strong", null, p.symbol));
      if (p.name && p.name !== p.symbol) tick.appendChild(el("span", "pick-name", p.name));
      card.appendChild(tick);
      card.appendChild(el("div", `pick-verdict ${p.verdict.cls || ""}`, `${p.verdict.emoji} ${p.verdict.label}`));

      // Badge « avant le boum » : où en est le mouvement
      if (key === "avantBoum" && p.early) {
        const e = p.early;
        card.appendChild(el("div", "pick-early",
          `🌱 seulement +${Math.max(0, e.perf3)} % sur 3 mois · à ${e.distHigh}% du sommet · démarrage ${e.earlyScore}/100`));
      }

      // « Pourquoi elle » — le cœur, en clair
      if (p.plain) {
        const plain = el("div", "pick-plain");
        plain.appendChild(el("span", "pick-plain-lbl", "Pourquoi elle"));
        plain.appendChild(el("p", null, p.plain));
        card.appendChild(plain);
      } else if (p.note) {
        card.appendChild(el("div", "pick-plain", p.note));
      }

      // Piliers en barres labellisées
      const bars = el("div", "pick-pillars");
      bars.appendChild(pickPillar("Technique", p.technical));
      bars.appendChild(pickPillar("Momentum", p.momentum));
      bars.appendChild(pickPillar("Fondamental", p.fundamental));
      bars.appendChild(pickPillar("Sentiment", p.sentiment));
      card.appendChild(bars);

      // Détails techniques repliés
      if (p.why && p.why.length) {
        const det = document.createElement("details");
        det.className = "pick-why-wrap";
        det.appendChild(el("summary", null, "Détails techniques"));
        const why = el("ul", "pick-why");
        for (const s of p.why.slice(0, 4)) why.appendChild(el("li", null, s.label + (s.detail ? ` — ${s.detail}` : "")));
        det.appendChild(why);
        card.appendChild(det);
      }

      // Pied : volatilité + confiance, avec bouton d'ouverture
      const foot = el("div", "pick-foot");
      foot.appendChild(el("span", null, `volatilité ${p.volatility}% · confiance ${p.confidence}%`));
      const r = results.find((x) => x.symbol === p.symbol);
      if (r) {
        foot.appendChild(el("span", "pick-open", "Détail →"));
        card.classList.add("clickable");
        card.onclick = (e) => { if (!e.target.closest(".pick-why-wrap")) showDetail(r); };
      }
      card.appendChild(foot);

      grid.appendChild(card);
    }
    if (any) $("picksSection").classList.remove("hidden");
  }

  /* ───────────── Moteur de recherche ─────────────
     Cherche dans l'index de marché (data/market.json, ~5 000 actions
     scannées) chargé à la volée. Si l'action fait partie du top analysé
     en profondeur du jour → analyse complète (4 piliers). Sinon → analyse
     technique + momentum (les piliers calculables sur le seul cours). */

  let marketIndex = null;   // [{ s, n, p, t, m }]
  let marketLoading = null;

  function loadMarket() {
    if (marketIndex) return Promise.resolve(marketIndex);
    if (marketLoading) return marketLoading;
    marketLoading = fetch("data/market.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { marketIndex = (j && j.stocks) || []; return marketIndex; })
      .catch(() => { marketIndex = []; return marketIndex; });
    return marketLoading;
  }

  function searchMatches(q) {
    q = q.trim().toUpperCase();
    if (!q || !marketIndex) return [];
    const bySym = [], byName = [];
    for (const e of marketIndex) {
      if (e.s.startsWith(q)) bySym.push(e);
      else if (e.n && e.n.toUpperCase().includes(q)) byName.push(e);
      if (bySym.length >= 10) break;
    }
    return [...bySym, ...byName].slice(0, 10);
  }

  function marketVerdict(t, m) {
    const avg = 0.55 * t + 0.45 * m;
    if (avg >= 70) return { label: "Cours bien orienté", emoji: "📈", cls: "v-up" };
    if (avg >= 55) return { label: "Tendance positive", emoji: "🙂", cls: "v-up" };
    if (avg >= 45) return { label: "Neutre", emoji: "😐", cls: "v-flat" };
    if (avg >= 35) return { label: "Sous pression", emoji: "🌧️", cls: "v-down" };
    return { label: "Faible", emoji: "⚠️", cls: "v-bad" };
  }

  function renderDropdown(matches) {
    const dd = $("searchDropdown");
    dd.innerHTML = "";
    if (!matches.length) { dd.classList.add("hidden"); return; }
    for (const e of matches) {
      const deep = results.find((r) => r.symbol === e.s);
      const row = el("div", "sr-row");
      const left = el("div", "sr-left");
      left.appendChild(el("strong", null, e.s));
      left.appendChild(el("span", "sr-name", e.n !== e.s ? e.n : ""));
      row.appendChild(left);
      row.appendChild(el("span", "sr-tag", deep ? "⭐ analyse complète" : `T ${e.t} · M ${e.m}`));
      row.onmousedown = (ev) => { ev.preventDefault(); analyzeSearch(e.s); };
      dd.appendChild(row);
    }
    dd.classList.remove("hidden");
  }

  function analyzeSearch(symbol) {
    symbol = symbol.trim().toUpperCase();
    if (!symbol) return;
    $("searchInput").value = symbol;
    $("searchDropdown").classList.add("hidden");
    $("searchHint").textContent = "";

    const deep = results.find((r) => r.symbol === symbol);
    if (deep) { showDetail(deep); return; }

    const entry = marketIndex && marketIndex.find((e) => e.s === symbol);
    if (entry) { showQuickAnalysis(entry); return; }

    $("searchHint").textContent = marketIndex && marketIndex.length
      ? `« ${symbol} » introuvable dans l'univers analysé (${marketIndex.length.toLocaleString("fr-FR")} actions US). Vérifie le symbole.`
      : "Index de marché indisponible pour l'instant.";
  }

  // Analyse « rapide » (cours only) pour une action hors du top du jour
  function showQuickAnalysis(e) {
    const v = marketVerdict(e.t, e.m);
    $("detailTitle").textContent = `${v.emoji} ${e.s}${e.n !== e.s ? ` — ${e.n}` : ""}`;
    const body = $("detailBody");
    body.innerHTML = "";

    const head = el("div", "detail-head");
    const scoreBox = el("div", "score-box");
    scoreBox.appendChild(el("div", "score-big", String(Math.round(0.55 * e.t + 0.45 * e.m))));
    scoreBox.appendChild(el("div", "score-sub", "note marché"));
    head.appendChild(scoreBox);
    const meta = el("div", "detail-meta");
    meta.appendChild(el("div", `badge big ${v.cls}`, `${v.emoji} ${v.label}`));
    meta.appendChild(el("div", "meta-line", `Dernier cours : ${e.p.toFixed(2)} $`));
    meta.appendChild(el("div", "meta-line sub", "Analyse fondée sur le cours (technique + momentum)."));
    head.appendChild(meta);
    body.appendChild(head);

    const pb = el("div", "pillar-box");
    pb.appendChild(el("h3", null, "Analyse du cours"));
    pb.appendChild(pillarBar("Technique", 0.55, e.t));
    pb.appendChild(pillarBar("Momentum", 0.45, e.m));
    body.appendChild(pb);

    const note = el("div", "warn-box");
    note.appendChild(el("div", "warn-line",
      "ℹ️ Cette action n'est pas dans le top analysé en profondeur aujourd'hui. Les piliers fondamental (chiffres financiers) et sentiment (news) ne sont calculés que pour la sélection du jour, mais sa configuration technique et son momentum sont à jour ci-dessus."));
    body.appendChild(note);

    $("detailPanel").classList.remove("hidden");
    $("detailPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initSearch() {
    const input = $("searchInput");
    if (!input) return;
    input.addEventListener("focus", loadMarket);
    input.addEventListener("input", async () => {
      await loadMarket();
      $("searchHint").textContent = "";
      renderDropdown(searchMatches(input.value));
    });
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        const matches = searchMatches(input.value);
        const exact = matches.find((m) => m.s === input.value.trim().toUpperCase());
        if (exact) analyzeSearch(exact.s);
        else if (matches.length) analyzeSearch(matches[0].s);
        else analyzeSearch(input.value);
      } else if (ev.key === "Escape") {
        $("searchDropdown").classList.add("hidden");
      }
    });
    input.addEventListener("blur", () => setTimeout(() => $("searchDropdown").classList.add("hidden"), 150));
  }

  /* ───────────── Backtest : fiabilité du modèle ───────────── */

  function twoLineChart(curve, w, h) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`); svg.setAttribute("width", w); svg.setAttribute("height", h);
    svg.classList.add("bt-chart");
    const vals = curve.flatMap((p) => [p.strat, p.market]);
    const min = Math.min(...vals), max = Math.max(...vals), span = max - min || 1, pad = 6;
    const xy = (v, i) => [pad + (i / (curve.length - 1)) * (w - 2 * pad), h - pad - ((v - min) / span) * (h - 2 * pad)];
    const line = (key, cls) => {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", "M" + curve.map((pt, i) => xy(pt[key], i).map((n) => n.toFixed(1)).join(",")).join(" L"));
      p.setAttribute("fill", "none"); p.setAttribute("stroke-width", "2"); p.classList.add(cls);
      svg.appendChild(p);
    };
    line("market", "bt-market"); line("strat", "bt-strat");
    return svg;
  }

  async function loadBacktest() {
    let data;
    try {
      const res = await fetch("data/backtest.json", { cache: "no-store" });
      if (!res.ok) return;
      data = await res.json();
    } catch { return; }
    if (!data || !data.periods) return;

    const V = { edge: { txt: "✅ Le modèle a montré un vrai avantage", cls: "v-hot" },
      leger: { txt: "🟡 Avantage léger / non concluant", cls: "v-flat" },
      faible: { txt: "🔴 Pas d'avantage démontré sur cette période", cls: "v-bad" } }[data.verdict] || { txt: "—", cls: "" };

    const body = $("backtestBody");
    body.innerHTML = "";
    $("backtestHint").textContent = `${data.years} ans · ${data.universeSize} valeurs`;

    body.appendChild(el("div", `badge big ${V.cls}`, V.txt));
    body.appendChild(el("p", "bt-scope", data.scope));

    // Chiffres clés
    const stats = el("div", "bt-stats");
    const stat = (lbl, val, sub) => { const b = el("div", "bt-stat"); b.appendChild(el("div", "bt-val", val)); b.appendChild(el("div", "bt-lbl", lbl)); if (sub) b.appendChild(el("div", "bt-sub", sub)); return b; };
    stats.appendChild(stat("Stratégie (top 20 %)", `${data.annReturnStrategy >= 0 ? "+" : ""}${data.annReturnStrategy} %/an`));
    stats.appendChild(stat("Marché (S&P 500)", `${data.annReturnMarket >= 0 ? "+" : ""}${data.annReturnMarket} %/an`));
    stats.appendChild(stat("Réussite vs marché", `${data.hitRatePct} %`, "des mois"));
    stats.appendChild(stat("Pire perte subie", `−${data.maxDrawdownPct} %`));
    body.appendChild(stats);

    // Comparatif des stratégies (quel signal marche vraiment ?)
    if (data.strategies && data.strategies.length) {
      const box = el("div", "bt-strats");
      box.appendChild(el("h3", null, "Chaque signal testé séparément — qui bat le marché ?"));
      const tbl = document.createElement("table");
      tbl.className = "bt-table";
      tbl.innerHTML = "<thead><tr><th>Stratégie</th><th class='num'>Perf/an</th><th class='num'>vs marché</th><th class='num'>Pire perte</th></tr></thead>";
      const tb = document.createElement("tbody");
      for (const s of data.strategies) {
        const tr = document.createElement("tr");
        if (s.key === data.bestKey) tr.className = "bt-best";
        const vs = s.vsMarket;
        tr.innerHTML =
          `<td>${s.label}${s.key === data.bestKey ? " 🏆" : ""}</td>` +
          `<td class='num'>${s.annReturn >= 0 ? "+" : ""}${s.annReturn} %</td>` +
          `<td class='num ${vs > 0 ? "s-good" : vs < 0 ? "s-bad" : ""}'>${vs >= 0 ? "+" : ""}${vs}</td>` +
          `<td class='num'>−${s.maxDrawdownPct} %</td>`;
        tb.appendChild(tr);
      }
      tbl.appendChild(tb);
      const marketRow = el("p", "bt-note", `Référence : acheter le S&P 500 = ${data.annReturnMarket >= 0 ? "+" : ""}${data.annReturnMarket} %/an, pire perte −${data.marketMaxDrawdownPct || data.maxDrawdownPct} %.`);
      box.appendChild(tbl); box.appendChild(marketRow);
      body.appendChild(box);
    }

    // Courbe stratégie vs marché
    if (data.curve && data.curve.length > 3) {
      const cb = el("div", "chart-box");
      cb.appendChild(el("h3", null, "100 investis au départ deviennent…"));
      const wrap = el("div", "chart-wrap");
      wrap.appendChild(twoLineChart(data.curve, 640, 150));
      const leg = el("div", "bt-legend");
      leg.appendChild(el("span", "bt-leg bt-leg-strat", `Stratégie : ${data.finalStrategy}`));
      leg.appendChild(el("span", "bt-leg bt-leg-mkt", `Marché : ${data.finalMarket}`));
      cb.appendChild(wrap); cb.appendChild(leg);
      body.appendChild(cb);
    }

    // Quintiles : rendement mensuel du meilleur au pire groupe
    if (data.quintileMonthlyReturnsPct) {
      const qb = el("div", "pillar-box");
      qb.appendChild(el("h3", null, "Rendement mensuel moyen, du groupe le mieux noté au moins bien noté"));
      const labels = ["Top 20 %", "20-40 %", "40-60 %", "60-80 %", "Bottom 20 %"];
      const q = data.quintileMonthlyReturnsPct;
      const maxAbs = Math.max(0.1, ...q.map((v) => Math.abs(v)));
      q.forEach((v, i) => {
        const row = el("div", "pbar-row");
        row.appendChild(el("span", "pbar-label", labels[i] || `Q${i + 1}`));
        const track = el("div", "pbar-track");
        const fill = el("div", "pbar-fill");
        fill.style.width = `${(Math.abs(v) / maxAbs) * 100}%`;
        fill.classList.add(v >= 0 ? "s-good-bg" : "s-bad-bg");
        track.appendChild(fill); row.appendChild(track);
        row.appendChild(el("span", "pbar-val", `${v >= 0 ? "+" : ""}${v.toFixed(2)} %`));
        qb.appendChild(row);
      });
      qb.appendChild(el("p", "bt-note", `Idéalement, le haut rapporte plus que le bas (écart : ${data.topMinusBottomMonthlyPct >= 0 ? "+" : ""}${data.topMinusBottomMonthlyPct} %/mois). Un écart positif régulier = le score a un pouvoir prédictif.`));
      body.appendChild(qb);
    }

    // Précautions
    if (data.caveats) {
      const wb = el("div", "warn-box");
      wb.appendChild(el("h3", null, "À lire avant de conclure"));
      for (const c of data.caveats) wb.appendChild(el("div", "warn-line", "• " + c));
      body.appendChild(wb);
    }
    $("backtestPanel").classList.remove("hidden");
  }

  /* ───────────── Chargement automatique de l'analyse quotidienne ─────────────
     Le robot GitHub Actions (bourse/auto/run.js) committe data/latest.json
     chaque jour ouvré ; si le fichier existe, la page l'affiche sans un clic. */

  async function tryAutoLoad() {
    try {
      const res = await fetch("data/latest.json", { cache: "no-store" });
      if (!res.ok) return false;
      const data = await res.json();
      if (!Array.isArray(data.results) || !data.results.length) return false;
      results = data.results;
      dataGeneratedAt = data.generatedAt || null;
      renderTable();
      if (data.picks) renderPicks(data.picks);

      const rankHint = $("rankHint");
      if (rankHint) rankHint.textContent = `${data.results.length} actions`;

      const d = new Date(data.generatedAt);
      const banner = $("autoBanner");
      const funnel = data.universe
        ? `${data.universe.toLocaleString("fr-FR")} actions cotées → ${data.scanned.toLocaleString("fr-FR")} scannées → top ${data.results.length} analysées en profondeur`
        : `${data.results.length} titres analysés`;
      banner.textContent = `🤖 Screener automatique du ${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} — ${funnel}. Mise à jour chaque jour ouvré après la clôture de Wall Street.`
        + (data.failed && data.failed.length ? ` (échecs : ${data.failed.length})` : "");
      banner.classList.remove("hidden");

      const pill = $("modePill");
      pill.textContent = "Analyse auto quotidienne";
      pill.classList.add("live");
      return true;
    } catch {
      return false; // pas de fichier (usage local / robot pas encore passé) → mode manuel
    }
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
    initSearch();

    tryAutoLoad(); // affiche l'analyse du robot sans aucun clic, si elle existe
    loadBacktest(); // affiche la fiabilité du modèle si le backtest existe
  }

  document.addEventListener("DOMContentLoaded", init);
})();
