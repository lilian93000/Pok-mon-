/* Outils partagés : thème, canvas, contrôles, formatage. Chaque leçon s'enregistre
   dans LESSONS via lesson({...}) ; app.js s'occupe de la navigation. */
"use strict";

const LESSONS = [];
function lesson(def) { LESSONS.push(def); }

/* ---------- Couleurs du thème (lues depuis les variables CSS) ---------- */
const T = {};
function readTheme() {
  const cs = getComputedStyle(document.documentElement);
  ["bg", "surface", "surface-2", "ink", "muted", "line", "volt", "volt-soft", "core", "core-soft",
   "hot", "cold", "ok", "warn", "danger", "glow"].forEach(k => {
    T[k.replace("-", "")] = cs.getPropertyValue("--" + k).trim();
  });
}
readTheme();
try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readTheme); } catch (e) {}
new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

/* ---------- Stockage local (facultatif) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem("elecnuc:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("elecnuc:" + k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- DOM ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
function h(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }

/* Curseur avec étiquette et valeur affichée */
function slider(id, label, min, max, step, value) {
  return `<div class="ctl"><div class="ctl-top"><label for="${id}">${label}</label><output id="${id}-o"></output></div>
    <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"></div>`;
}
function readout(id, label) { return `<div class="readout"><div class="k">${label}</div><div class="v" id="${id}">–</div></div>`; }
function lab(eyebrow, title, inner) {
  return `<section class="lab"><div class="lab-head"><h3>${title}</h3><span class="eyebrow">${eyebrow}</span></div>${inner}</section>`;
}

/* ---------- Nombres ---------- */
function fmt(x, d = 2) {
  if (!isFinite(x)) return "∞";
  return x.toLocaleString("fr-FR", { maximumFractionDigits: d, minimumFractionDigits: 0 });
}
/* Préfixes SI : 0,0123 A → « 12,3 mA » */
function si(x, unit, d = 3) {
  if (x === 0) return "0 " + unit;
  if (!isFinite(x)) return "∞ " + unit;
  const pre = [[1e12, "T"], [1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"]];
  const a = Math.abs(x);
  for (const [f, p] of pre) if (a >= f * 0.9995) return fmt(x / f, Math.max(0, d - Math.floor(Math.log10(Math.abs(x / f))) - 1)) + " " + p + unit;
  return x.toExponential(2) + " " + unit;
}
function sci(x, d = 2) {
  if (x === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -1 && e < 6) return fmt(x, d);
  const m = x / Math.pow(10, e);
  const sup = String(e).replace(/-/g, "⁻").replace(/\d/g, c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]);
  return fmt(m, d) + " × 10" + sup;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- Canvas : gestion de la densité de pixels et de la taille ---------- */
function canvasKit(canvas, ratio) {
  const kit = { ctx: canvas.getContext("2d"), w: 0, h: 0 };
  function fit() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 600;
    const hgt = Math.round(w * ratio);
    canvas.style.height = hgt + "px";
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(hgt * dpr);
    kit.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    kit.w = w; kit.h = hgt;
    if (kit.onResize) kit.onResize();
  }
  fit();
  const ro = new ResizeObserver(() => { if (Math.abs((canvas.clientWidth || 0) - kit.w) > 1) fit(); });
  ro.observe(canvas);
  kit.stop = () => ro.disconnect();
  return kit;
}

/* Boucle d'animation ; renvoie une fonction d'arrêt. dt en secondes, plafonné. */
function animate(fn) {
  let last = performance.now(), id, alive = true;
  function frame(t) {
    if (!alive) return;
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    fn(dt, t / 1000);
    id = requestAnimationFrame(frame);
  }
  id = requestAnimationFrame(frame);
  return () => { alive = false; cancelAnimationFrame(id); };
}

function circle(ctx, x, y, r, fill, stroke) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}
function text(ctx, s, x, y, color, size = 12, align = "left", font = "mono") {
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.font = (font === "mono" ? "500 " : "600 ") + size + "px " + (font === "mono" ? '"IBM Plex Mono", monospace' : '"IBM Plex Sans", sans-serif');
  ctx.fillText(s, x, y);
}
function alpha(color, a) {
  // accepte #rrggbb
  if (!color || color[0] !== "#") return color;
  const n = parseInt(color.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

/* Lie un curseur à son affichage ; renvoie la valeur courante via get() */
function bindRange(root, id, format, onChange) {
  const el = $("#" + id, root), out = $("#" + id + "-o", root);
  const upd = () => { out.textContent = format(+el.value); onChange && onChange(+el.value); };
  el.addEventListener("input", upd);
  upd();
  return () => +el.value;
}
