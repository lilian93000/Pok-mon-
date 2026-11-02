"""Génère index.html de « LES BRUITS EN VISITE » (format v2) à partir de tools/minutage.json.

Format v2 : accroche du sujet dès la 1ʳᵉ image, gros sous-titres mot à mot calés sur la voix,
une idée par écran, couleur qui change à chaque bruit, fin courte (≈ 2,8 s).
Usage : python3 tools/build.py
"""
import json
import math
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(HERE, "minutage.json")))
DUR = M["dur"]
W = M["words"]
S = M["starts"]
# fin de chaque scène (début de la phrase suivante, un peu avant)
SC = [(0, S[1] - 0.05), (S[1] - 0.05, S[2] - 0.5), (S[2] - 0.5, S[3] - 0.55), (S[3] - 0.55, S[4] - 0.2), (S[4] - 0.2, S[5] - 0.1), (S[5] - 0.1, DUR)]


def show(w):
    """Texte affiché : « V.M.C. » → « VMC », « P.V. » → « PV »."""
    return re.sub(r"\b((?:[A-Z]\.){2,})", lambda m: m.group(1).replace(".", ""), w).replace("..", ".")


def first(word):
    return next(x[2] for x in W if x[1] == word)



# la ponctuation isolée (« : », « ? ») reste collée au mot d'avant
_m = []
for x in W:
    if _m and re.fullmatch(r"[?:!;»]+", x[1]) and _m[-1][0] == x[0]:
        _m[-1] = [_m[-1][0], _m[-1][1] + "\u00a0" + x[1], _m[-1][2], x[3]]
    else:
        _m.append(list(x))
W = _m
VERD = [first("Coup"), first("Bouches"), first("Évacuation")]

# sous-titres : groupes de 1 à 4 mots, coupés sur la ponctuation
chunks = []
for li in range(len(S)):
    ws = [x for x in W if x[0] == li]
    cur = []
    for k, x in enumerate(ws):
        cur.append(x)
        if len(cur) == 4 or re.search(r"[?:.,!]$", x[1]) or k == len(ws) - 1:
            chunks.append(cur)
            cur = []
for i, c in enumerate(chunks):
    nxt = chunks[i + 1][0][2] if i + 1 < len(chunks) else DUR
    c_end = min(nxt, c[-1][3] + 0.6)
    chunks[i] = {"t0": round(c[0][2] - 0.04, 3), "t1": round(c_end, 3), "w": [[show(x[1]), x[2]] for x in c]}


def wave(kind, w=2600, h=220):
    pts = []
    for i in range(0, w + 1, 6):
        x = i
        if kind == "clac":
            ph = (i % 520) / 520.0
            y = 0.95 * math.exp(-((ph - 0.12) * 60) ** 2) * math.sin(i * 0.9) + 0.04 * math.sin(i * 0.3)
        elif kind == "fiii":
            y = 0.55 * math.sin(i * 0.8) * (0.8 + 0.2 * math.sin(i * 0.02))
        else:
            y = 0.7 * math.sin(i * 0.05) * math.sin(i * 0.013 + 1) + 0.25 * math.sin(i * 0.21)
        pts.append(f"{x},{h / 2 - y * h / 2 * 0.9:.1f}")
    return " ".join(pts)


SOUNDS = [
    ("« CLAC&nbsp;! »", "dans les tuyaux", "clac", "COUP DE BÉLIER", "la plomberie souffre", "#ff4d4d"),
    ("« FIIIIIH »", "dans la VMC", "fiii", "BOUCHES ENCRASSÉES", "l'humidité s'installe", "#22d3ee"),
    ("« GLOU GLOU »", "dans l'évier", "glou", "ÉVACUATION MAL VENTILÉE", "souvent tout l'immeuble", "#4ade80"),
]
GLOWS = ["#ff3b3b", "#ff3b3b", "#06b6d4", "#22c55e", "#2563eb", "#2563eb"]

css = """      @font-face {
        font-family: "Inter";
        src: url("assets/fonts/Inter.woff2") format("woff2");
        font-weight: 100 900;
        font-style: normal;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #070b1a; }
      #root { position: relative; width: 1080px; height: 1920px; overflow: hidden; font-family: "Inter", sans-serif; color: #fff; background: #070b1a; }
      .clip { position: absolute; inset: 0; overflow: hidden; }
      .abs { position: absolute; }
      .glow { position: absolute; left: 0; top: 200px; width: 1080px; height: 1400px; border-radius: 50%; opacity: 0; }
      #tag { left: 70px; top: 200px; padding: 12px 28px; border-radius: 999px; background: rgba(255,255,255,0.12); border: 2px solid rgba(255,255,255,0.25); font-size: 34px; font-weight: 800; letter-spacing: 0.04em; }
      #count { right: 170px; top: 200px; padding: 12px 26px; border-radius: 999px; background: #fff; color: #070b1a; font-size: 34px; font-weight: 900; opacity: 0; font-variant-numeric: tabular-nums; }
      #big { left: 0; right: 0; top: 520px; text-align: center; font-size: 250px; font-weight: 900; letter-spacing: -0.05em; line-height: 1; color: #fff; text-shadow: 0 0 60px rgba(255,59,59,0.9), 0 12px 0 #b91c1c; }
      .snd { position: absolute; left: 0; right: 0; top: 400px; height: 700px; opacity: 0; }
      .ono { position: absolute; left: 40px; right: 40px; top: 0; text-align: center; font-size: 132px; font-weight: 900; letter-spacing: -0.05em; line-height: 1.05; white-space: nowrap; }
      .where { position: absolute; left: 0; right: 0; top: 178px; text-align: center; font-size: 46px; font-weight: 700; color: rgba(255,255,255,0.75); }
      .wv { position: absolute; left: 70px; width: 940px; top: 270px; height: 220px; overflow: hidden; border-radius: 28px; background: rgba(0,0,0,0.35); }
      .wv svg { position: absolute; left: 0; top: 0; }
      .verd { position: absolute; left: 70px; right: 70px; top: 530px; padding: 26px 30px; border-radius: 30px; color: #070b1a; text-align: center; opacity: 0; }
      .verd b { display: block; font-size: 58px; font-weight: 900; letter-spacing: -0.03em; line-height: 1.05; }
      .verd span { display: block; margin-top: 6px; font-size: 38px; font-weight: 700; }
      #pv { left: 90px; width: 900px; top: 430px; height: 640px; border-radius: 26px; background: #fbfaf5; color: #1f2937; padding: 44px 50px; opacity: 0; box-shadow: 0 40px 80px rgba(0,0,0,0.5); }
      #pv h3 { font-size: 40px; font-weight: 900; letter-spacing: -0.02em; }
      #pv p { margin-top: 10px; font-size: 26px; color: #6b7280; font-weight: 600; }
      .ln { margin-top: 26px; height: 22px; border-radius: 11px; background: #e5e7eb; }
      #res { position: relative; margin-top: 30px; font-size: 36px; font-weight: 800; line-height: 1.25; padding: 14px 18px; }
      #mark { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: #fde047; border-radius: 10px; transform-origin: 0 50%; z-index: 0; }
      #res span { position: relative; z-index: 1; }
      #stamp { right: 60px; bottom: 60px; padding: 14px 26px; border: 7px solid #dc2626; color: #dc2626; border-radius: 16px; font-size: 52px; font-weight: 900; transform: rotate(-9deg); opacity: 0; }
      #caps { left: 60px; right: 60px; top: 1190px; height: 300px; }
      .ch { position: absolute; left: 0; right: 0; top: 0; text-align: center; font-size: 86px; font-weight: 900; letter-spacing: -0.035em; line-height: 1.12; opacity: 0; }
      .ch i { font-style: normal; color: #ffffff; display: inline-block; margin: 0 10px; }
      #end { opacity: 0; }
      #end-logo { left: 70px; top: 560px; font-size: 52px; font-weight: 800; display: flex; align-items: center; gap: 18px; }
      #end-logo svg { width: 56px; height: 64px; }
      #end-t { left: 70px; right: 150px; top: 680px; font-size: 104px; font-weight: 900; letter-spacing: -0.05em; line-height: 1.02; }
      #end-t span { color: #fde047; }
      #end-url { left: 70px; top: 1060px; font-size: 64px; font-weight: 800; }
      #flash { background: #fff; opacity: 0; pointer-events: none; }
"""

glows = "\n".join(f'        <div class="glow" id="g{i}" style="background: radial-gradient(closest-side, {c}88, {c}22 55%, transparent 75%)"></div>' for i, c in enumerate(GLOWS))
snds = "\n".join(f'''        <div class="snd" id="s{k}">
          <div class="ono" id="o{k}" style="color: {c}; text-shadow: 0 0 50px {c}">{o}</div>
          <div class="where">{wh}</div>
          <div class="wv"><svg id="wsv{k}" width="2600" height="220" viewBox="0 0 2600 220"><polyline points="{wave(kind)}" fill="none" stroke="{c}" stroke-width="7" stroke-linejoin="round" /></svg></div>
          <div class="verd" id="v{k}" style="background: {c}"><b>{vt}</b><span>{vs}</span></div>
        </div>''' for k, (o, wh, kind, vt, vs, c) in enumerate(SOUNDS))
caps = "\n".join(f'          <div class="ch" id="c{i}">' + " ".join(f'<i id="c{i}w{j}">{t}</i>' for j, (t, _) in enumerate(c["w"])) + "</div>" for i, c in enumerate(chunks))

html = f"""<!doctype html>
<html lang="fr" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      /* « LES BRUITS EN VISITE » — format v2 : accroche du sujet dès la 1ʳᵉ image, sous-titres mot à mot, {DUR} s.
         Généré par tools/build.py à partir de tools/minutage.json (voix de Guillaume). Rendu 2160×3840 à 60 i/s. */
{css}    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
      <audio id="soundtrack" src="assets/audio/soundtrack.wav" data-start="0" data-duration="{DUR}" data-track-index="4" data-volume="1"></audio>
      <section id="stage" class="clip" data-start="0" data-duration="{DUR}" data-track-index="0">
{glows}
        <div id="tag" class="abs">VISITE D'APPART</div>
        <div id="count" class="abs">1/3</div>
        <div id="big" class="abs">CLAC&nbsp;!</div>
{snds}
        <div id="pv" class="abs">
          <h3>Procès-verbal d'assemblée générale</h3>
          <p>Résidence Les Lilas · exemple fictif</p>
          <div class="ln" style="width: 92%"></div>
          <div class="ln" style="width: 78%"></div>
          <div id="res"><div id="mark"></div><span>Résolution 7 : remplacement des colonnes d'eau</span></div>
          <div class="ln" style="width: 85%"></div>
          <div class="ln" style="width: 60%"></div>
          <div id="stamp" class="abs">48&nbsp;000&nbsp;€</div>
        </div>
        <div id="end" class="abs" style="inset: 0">
          <div id="end-logo" class="abs"><svg viewBox="0 0 56 64"><rect x="2" y="0" width="52" height="9" rx="4" fill="#fff" /><rect x="8" y="14" width="9" height="36" rx="3" fill="#fff" /><rect x="23" y="14" width="9" height="36" rx="3" fill="#fff" /><rect x="38" y="14" width="9" height="36" rx="3" fill="#fff" /><rect x="0" y="55" width="56" height="9" rx="4" fill="#fff" /></svg>AnalyseTaCopro</div>
          <div id="end-t" class="abs">Partie 2 :<br /><span>les bruits de l'immeuble.</span></div>
          <div id="end-url" class="abs">analysetacopro.fr</div>
        </div>
        <div id="caps" class="abs">
{caps}
        </div>
      </section>
      <div id="flash" class="clip" data-start="0" data-duration="{DUR}" data-track-index="2" data-layout-allow-overlap></div>
    </div>
    <script>
      const DUR = {DUR};
      const SC = {json.dumps([[round(a, 3), round(b, 3)] for a, b in SC])};
      const VERD = {json.dumps([round(v, 3) for v in VERD])};
      const CH = {json.dumps([[c["t0"], c["t1"], [w[1] for w in c["w"]]] for c in chunks])};
      const tl = gsap.timeline({{ paused: true }});
      const flash = (t, a = 0.5, d = 0.22) => tl.fromTo("#flash", {{ opacity: a }}, {{ opacity: 0, duration: d, ease: "power2.out", immediateRender: false }}, t);
      const shake = (sel, t, amp = 22, n = 7) => {{
        for (let i = 0; i < n; i++) tl.to(sel, {{ x: Math.sin(i * 2.7 + t) * amp * (1 - i / n), y: Math.cos(i * 3.1 + t) * amp * (1 - i / n), duration: 0.03, ease: "none" }}, t + i * 0.03);
        tl.to(sel, {{ x: 0, y: 0, duration: 0.04 }}, t + n * 0.03);
      }};
      tl.set("#flash", {{ opacity: 0 }}, 0);
      tl.set("#end", {{ opacity: 0 }}, 0);

      // fonds : une couleur par scène
      SC.forEach(([a, b], i) => {{
        tl.fromTo(`#g${{i}}`, {{ opacity: 0, scale: 0.85 }}, {{ opacity: 1, scale: 1, duration: 0.35, ease: "power2.out", immediateRender: false }}, Math.max(0, a));
        if (i < SC.length - 1) tl.to(`#g${{i}}`, {{ opacity: 0, duration: 0.3 }}, b);
      }});

      // 0 s : l'accroche, le bruit tout de suite
      tl.fromTo("#big", {{ scale: 2.4, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.14, ease: "power4.out" }}, 0);
      shake("#big", 0.0, 26, 9);
      flash(0.0, 0.35, 0.18);
      tl.to("#big", {{ scale: 0.92, duration: SC[0][1] - 0.6, ease: "none" }}, 0.3);
      tl.to("#big", {{ opacity: 0, scale: 0.6, duration: 0.18 }}, SC[0][1] - 0.18);

      // les 3 bruits
      [0, 1, 2].forEach((k) => {{
        const [a, b] = SC[k + 1];
        tl.set("#count", {{ textContent: `${{k + 1}}/3` }}, a);
        tl.fromTo("#count", {{ opacity: 0, scale: 1.6 }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }}, a);
        tl.fromTo(`#s${{k}}`, {{ opacity: 0, y: 60 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }}, a);
        tl.fromTo(`#o${{k}}`, {{ scale: 1.7 }}, {{ scale: 1, duration: 0.3, ease: "back.out(2.2)", immediateRender: false }}, a);
        if (k === 0) shake(`#o${{k}}`, a + 0.02, 18);
        tl.fromTo(`#wsv${{k}}`, {{ x: 0 }}, {{ x: -1640, duration: b - a, ease: "none", immediateRender: false }}, a);
        tl.fromTo(`#v${{k}}`, {{ opacity: 0, y: 40, scale: 0.9 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }}, VERD[k]);
        flash(VERD[k], 0.18, 0.15);
        tl.to(`#s${{k}}`, {{ opacity: 0, y: -40, duration: 0.2 }}, b - 0.2);
      }});
      tl.to("#count", {{ opacity: 0, duration: 0.2 }}, SC[3][1] - 0.2);

      // la révélation : le PV d'AG
      const [pa, pb] = SC[4];
      tl.fromTo("#pv", {{ opacity: 0, y: 220, rotate: 4 }}, {{ opacity: 1, y: 0, rotate: 0, duration: 0.45, ease: "power3.out", immediateRender: false }}, pa);
      tl.fromTo("#mark", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.6, ease: "power2.inOut", immediateRender: false }}, pa + 1.3);
      tl.fromTo("#stamp", {{ opacity: 0, scale: 2.2 }}, {{ opacity: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }}, pa + 2.2);
      shake("#pv", pa + 2.42, 16);
      flash(pa + 2.42, 0.3, 0.18);
      tl.to(["#pv", "#tag"], {{ opacity: 0, duration: 0.2 }}, pb - 0.2);

      // fin courte
      const [ea] = SC[5];
      tl.fromTo("#end", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.25, immediateRender: false }}, ea);
      tl.fromTo("#end-t", {{ y: 60, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }}, ea + 0.1);
      tl.fromTo("#end-url", {{ y: 30, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: false }}, ea + 0.5);

      // sous-titres mot à mot
      CH.forEach(([t0, t1, ws], i) => {{
        tl.fromTo(`#c${{i}}`, {{ opacity: 0, y: 24, scale: 0.94 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "power2.out", immediateRender: false }}, t0);
        ws.forEach((s, j) => {{
          tl.set(`#c${{i}}w${{j}}`, {{ color: "#fde047" }}, s);
          if (j + 1 < ws.length) tl.set(`#c${{i}}w${{j}}`, {{ color: "#ffffff" }}, ws[j + 1]);
        }});
        tl.to(`#c${{i}}`, {{ opacity: 0, duration: 0.08 }}, t1 - 0.08);
      }});

      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
open(os.path.join(HERE, "..", "index.html"), "w").write(html)
print("ok", len(chunks), "sous-titres,", DUR, "s, verdicts", VERD)
