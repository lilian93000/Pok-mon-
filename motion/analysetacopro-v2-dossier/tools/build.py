"""Génère index.html de « L'AFFAIRE DE LA COPRO DES LILAS » : test du style Halftone Dossier (Lemo-Opuscar), format vertical.

Papier crème, trames de points, encre marine + 4 encres (cobalt, jaune, rouge, rose), titres à empattements décalés,
tampons qui claquent, transitions en points. Calé sur tools/minutage.json (voix de Guillaume).
Usage : python3 tools/build.py
"""
import json
import math
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(HERE, "minutage.json")))
DUR, S, WP, EV, W = M["dur"], M["starts"], M["wipes"], M["ev"], M["words"]
PAPER, INK, COB, YEL, RED, PINK = "#f2e8d2", "#1c2753", "#3b5bdb", "#ffc93c", "#e03a2f", "#f08aa8"
# scènes : [début, fin]
SCN = [[0, WP[0] + 0.22], [WP[0] + 0.22, WP[1] + 0.22], [WP[1] + 0.22, WP[2] + 0.22], [WP[2] + 0.22, S[4] - 0.35], [S[4] - 0.35, S[5] - 0.3], [S[5] - 0.3, DUR]]


def dots(w, h, step, ang, dens, k=0.68):
    """Trame : cercles sur une grille tournée, rayon = densité × pas × k ; un seul chemin SVG."""
    ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    d, n = [], int(max(w, h) * 1.5 / step)
    for i in range(-n, n):
        for j in range(-n, n):
            x = w / 2 + (i * ca - j * sa) * step
            y = h / 2 + (i * sa + j * ca) * step
            if -step < x < w + step and -step < y < h + step:
                r = dens(x, y) * step * k
                if r > 1.2:
                    d.append(f"M{x - r:.1f} {y:.1f}a{r:.1f} {r:.1f} 0 1 0 {2 * r:.1f} 0a{r:.1f} {r:.1f} 0 1 0 {-2 * r:.1f} 0")
    return "".join(d)


def edge(w, h, m=260):
    return lambda x, y: max(0.0, 1 - min(x, y, w - x, h - y) / m) ** 1.4


def radial(cx, cy, r0):
    return lambda x, y: max(0.0, 1 - math.hypot(x - cx, y - cy) / r0) ** 0.9


BG1 = dots(1080, 1920, 24, 15, edge(1080, 1920, 300))
BG2 = dots(1080, 1920, 22, 75, edge(1080, 1920, 180))
HALO = dots(700, 760, 22, 45, radial(350, 380, 380))

# ---- sous-titres : phrases coupées sur « : » « . » « ? », mot-clé en jaune
KEY = {"347", "210", "000", "euros.", "beau", "vrai", "PV", "Étanchéité", "26", "carnet", "Canalisations", "jamais", "2009.",
       "règlement.", "Location", "courte", "durée", "interdite.", "négocier.", "fuir.", "dossier.", "l'ouvre"}


def show(w):
    return re.sub(r"\b((?:[A-Z]\.){2,})", lambda m: m.group(1).replace(".", ""), w).replace("..", ".")


merged = []
for x in W:
    if merged and re.fullmatch(r"[?:!;]+", x[1]) and merged[-1][0] == x[0]:
        merged[-1] = [merged[-1][0], merged[-1][1] + " " + x[1], merged[-1][2], x[3]]
    else:
        merged.append(list(x))
caps, cur = [], []
for k, x in enumerate(merged):
    cur.append(x)
    last = k == len(merged) - 1 or merged[k + 1][0] != x[0]
    if re.search(r"[?:.]$", x[1]) or last:
        caps.append(cur); cur = []
CAP = []
for i, c in enumerate(caps):
    nxt = caps[i + 1][0][2] if i + 1 < len(caps) else DUR
    t1 = min(nxt - 0.02, c[-1][3] + 0.9)
    txt = " ".join(f'<b>{show(x[1])}</b>' if x[1].split(" ")[0].strip(":").rstrip(".?") in {k.rstrip(".") for k in KEY} or x[1].split(" ")[0] in KEY else show(x[1]) for x in c)
    CAP.append((round(c[0][2] - 0.05, 3), round(t1, 3), txt))


def hl(text, cls="hl", extra=""):
    """Titre découpé en lettres (pop lettre par lettre)."""
    out = []
    for word in text.split(" "):
        out.append('<span class="w">' + "".join(f'<span class="c">{ch}</span>' for ch in word) + "</span>")
    return f'<div class="{cls}" {extra}>' + " ".join(out) + "</div>"


BUILDING = f"""<svg class="bld" viewBox="0 0 520 700" width="520" height="700">
            <path d="{HALO}" transform="translate(-90,-40)" fill="{YEL}" />
            <g stroke="{INK}" stroke-width="7" stroke-linejoin="round">
              <rect x="40" y="90" width="440" height="590" rx="10" fill="{PINK}" />
              <rect x="20" y="62" width="480" height="40" rx="8" fill="{INK}" />
              <rect x="200" y="20" width="120" height="46" rx="6" fill="{PAPER}" />
              {''.join(f'<rect x="{80 + c * 130}" y="{140 + r * 120}" width="90" height="80" rx="8" fill="{PAPER}" />' for r in range(4) for c in range(3) if not (r == 1 and c != 1) and not (r == 3 and c == 1))}
              <rect x="205" y="560" width="110" height="120" rx="8" fill="{COB}" />
              <g id="eyeL"><ellipse cx="135" cy="300" rx="52" ry="44" fill="{PAPER}" /><ellipse id="pupL" cx="145" cy="306" rx="22" ry="26" fill="{INK}" stroke="none" /></g>
              <g id="eyeR"><ellipse cx="385" cy="300" rx="52" ry="44" fill="{PAPER}" /><ellipse id="pupR" cx="375" cy="306" rx="22" ry="26" fill="{INK}" stroke="none" /></g>
              <rect id="lidL" x="80" y="252" width="110" height="96" fill="{PINK}" stroke="none" />
              <rect id="lidR" x="330" y="252" width="110" height="96" fill="{PINK}" stroke="none" />
            </g>
            <circle cx="152" cy="296" r="6" fill="{PAPER}" /><circle cx="368" cy="296" r="6" fill="{PAPER}" />
            <text x="260" y="52" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="24" fill="{INK}">N° 12</text>
          </svg>"""

CHART = "".join(f'<div class="tick" style="top:{y}px"><span>{lab}</span></div>' for y, lab in [(640, "15 M"), (820, "10 M"), (1000, "5 M"), (1180, "0 M")])


def numeral(n):
    return f"""<svg class="num" viewBox="0 0 400 600" width="400" height="600">
            <text x="200" y="560" text-anchor="middle" font-family="Bagel Fat One" font-size="620" fill="{COB}" stroke="{INK}" stroke-width="12" paint-order="stroke fill">{n}</text>
            <text x="200" y="560" text-anchor="middle" font-family="Bagel Fat One" font-size="620" fill="url(#dotInk)">{n}</text>
          </svg>"""


def doc(title, sub, body):
    return f"""<div class="doc"><div class="dh">{title}</div><div class="ds">{sub}</div>{body}</div>"""


LINE = '<div class="ln" style="width:{w}%"></div>'
EX1 = doc("PROCÈS-VERBAL D'AG", "Résidence Les Lilas · exemple fictif", LINE.format(w=90) + LINE.format(w=70) +
          f'<div class="row" id="r1"><div class="mk" id="mk1"></div><span>Résolution 9 : étanchéité des terrasses</span></div>' + LINE.format(w=82) + LINE.format(w=55) +
          f'<div class="tag" id="t1">VOTÉ · 26&nbsp;000&nbsp;€</div>')
EX2 = f"""<div class="doc nb"><div class="rings">{''.join('<i></i>' for _ in range(9))}</div><div class="dh">CARNET D'ENTRETIEN</div><div class="ds">Dernières interventions</div>
            <div class="trow"><span>Ascenseur</span><span>2024</span></div><div class="trow"><span>Chauffage</span><span>2023</span></div>
            <div class="trow" id="tr2"><span>Canalisations</span><span id="y2009">2009</span></div><div class="trow"><span>Toiture</span><span>2021</span></div>
            <svg class="circ" viewBox="0 0 300 140" width="300" height="140"><ellipse id="ring2" cx="150" cy="70" rx="135" ry="58" fill="none" stroke="{RED}" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-6 150 70)" /></svg></div>"""
EX3 = doc("RÈGLEMENT DE COPROPRIÉTÉ", "Article 14 · usage des lots", '<div class="red" style="width:88%"></div><div class="red" style="width:64%"></div>' +
          f'<div class="row r3"><span>Location courte durée :</span> <em>INTERDITE</em><div class="red cover" id="cov3"></div></div>' + '<div class="red" style="width:76%"></div><div class="red" style="width:50%"></div>')

COLS, ROWS, CELL = 9, 16, 120
WIPE = "".join(f'<circle cx="{c * CELL + 60}" cy="{r * CELL + 60}" r="0" />' for r in range(ROWS) for c in range(COLS))
WCOL = [INK, YEL, COB]

css = f"""      @font-face {{ font-family: "Inter"; src: url("assets/fonts/Inter.woff2") format("woff2"); font-weight: 100 900; font-display: block; }}
      @font-face {{ font-family: "Alfa Slab One"; src: url("assets/fonts/AlfaSlabOne.woff2") format("woff2"); font-display: block; }}
      @font-face {{ font-family: "Bagel Fat One"; src: url("assets/fonts/BagelFatOne.woff2") format("woff2"); font-display: block; }}
      @font-face {{ font-family: "JetBrains Mono"; src: url("assets/fonts/JetBrainsMono.woff2") format("woff2"); font-weight: 800; font-display: block; }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: {PAPER}; }}
      #root {{ position: relative; width: 1080px; height: 1920px; overflow: hidden; font-family: "Inter", sans-serif; color: {INK}; background: {PAPER}; }}
      .clip {{ position: absolute; inset: 0; overflow: hidden; }}
      .abs {{ position: absolute; }}
      .scn {{ position: absolute; inset: 0; opacity: 0; }}
      #sc0 {{ opacity: 1; }}
      #bg {{ position: absolute; inset: 0; }}
      .hud {{ top: 150px; padding: 10px 22px; border-radius: 12px; font-family: "JetBrains Mono"; font-weight: 800; font-size: 30px; letter-spacing: 0.02em; }}
      #case {{ left: 70px; background: {INK}; color: {PAPER}; }}
      #chap {{ left: 450px; background: {YEL}; color: {INK}; border: 4px solid {INK}; opacity: 0; }}
      #rec {{ right: 150px; color: {INK}; }}
      #rec i {{ display: inline-block; width: 22px; height: 22px; border-radius: 50%; background: {RED}; margin-right: 10px; vertical-align: -2px; }}
      .hl {{ position: absolute; left: 70px; right: 150px; top: 250px; z-index: 2; font-family: "Alfa Slab One"; font-size: 132px; line-height: 1.02; letter-spacing: -0.01em; color: {INK}; text-shadow: 9px 9px 0 {COB}; }}
      .hl .w {{ display: inline-block; white-space: nowrap; }}
      .hl .c {{ display: inline-block; }}
      .hl .y {{ color: {YEL}; -webkit-text-stroke: 5px {INK}; paint-order: stroke fill; }}
      .bld {{ position: absolute; left: 470px; top: 540px; transform: scale(0.82); transform-origin: 100% 0%; }}
      #bld4 .bld {{ left: 460px; top: 560px; transform: none; }}
      .tick {{ position: absolute; left: 70px; width: 940px; border-top: 5px dashed {INK}; opacity: 0.55; }}
      .tick span {{ position: absolute; left: 0; top: 6px; font-family: "JetBrains Mono"; font-weight: 800; font-size: 26px; }}
      .plate {{ left: 70px; top: 1210px; padding: 14px 26px; background: {INK}; color: {PAPER}; font-family: "JetBrains Mono"; font-weight: 800; font-size: 34px; border-radius: 10px; }}
      #price {{ left: 50px; top: 880px; font-family: "Bagel Fat One"; font-size: 112px; line-height: 1; color: {YEL}; -webkit-text-stroke: 8px {INK}; paint-order: stroke fill; text-shadow: 10px 10px 0 {COB}; transform: rotate(-6deg); }}
      .num {{ position: absolute; left: 660px; top: 230px; }}
      .doc {{ position: absolute; left: 70px; top: 640px; width: 800px; min-height: 600px; background: #fffaf0; border: 7px solid {INK}; border-radius: 18px; padding: 40px 44px; box-shadow: 16px 16px 0 {INK}; }}
      .dh {{ font-family: "Alfa Slab One"; font-size: 46px; line-height: 1.05; }}
      .ds {{ margin-top: 8px; font-family: "JetBrains Mono"; font-weight: 800; font-size: 24px; opacity: 0.7; }}
      .ln {{ margin-top: 24px; height: 20px; border-radius: 10px; background: #d9d2c2; }}
      .row {{ position: relative; margin-top: 26px; padding: 12px 14px; font-weight: 900; font-size: 36px; line-height: 1.2; }}
      .row span, .row em {{ position: relative; z-index: 1; }}
      .mk {{ position: absolute; inset: 0; background: {YEL}; border-radius: 8px; transform-origin: 0 50%; transform: scaleX(0); }}
      .tag {{ position: absolute; right: -40px; bottom: -46px; padding: 16px 26px; background: {RED}; color: {PAPER}; border: 6px solid {INK}; border-radius: 14px; font-family: "Bagel Fat One"; font-size: 64px; transform: rotate(-7deg); opacity: 0; filter: url(#rough); }}
      .nb {{ padding-left: 90px; }}
      .rings {{ position: absolute; left: 22px; top: 40px; display: flex; flex-direction: column; gap: 46px; }}
      .rings i {{ display: block; width: 40px; height: 20px; border: 6px solid {INK}; border-radius: 12px; background: {PAPER}; }}
      .trow {{ display: flex; justify-content: space-between; margin-top: 30px; padding-bottom: 12px; border-bottom: 4px solid #d9d2c2; font-weight: 800; font-size: 40px; }}
      .trow span:last-child {{ font-family: "JetBrains Mono"; }}
      .circ {{ position: absolute; right: 18px; top: 318px; }}
      .red {{ margin-top: 24px; height: 34px; background: {INK}; border-radius: 4px; }}
      .r3 {{ margin-top: 30px; font-size: 38px; }}
      .r3 em {{ font-style: normal; color: {RED}; }}
      .r3 .cover {{ position: absolute; inset: 0; margin: 0; height: auto; transform-origin: 100% 50%; z-index: 2; }}
      .stamp {{ position: absolute; padding: 20px 34px; border: 10px solid {RED}; outline: 5px solid {RED}; outline-offset: 8px; border-radius: 20px; color: {RED}; font-family: "Inter"; font-weight: 900; font-size: 92px; letter-spacing: -0.02em; opacity: 0; filter: url(#rough); }}
      #st1 {{ left: 110px; top: 980px; transform: rotate(-9deg); }}
      #st2 {{ left: 470px; top: 1180px; font-size: 64px; transform: rotate(7deg); }}
      #cap {{ left: 60px; right: 60px; top: 1400px; height: 220px; }}
      .cb {{ position: absolute; left: 0; right: 0; top: 0; margin: 0 auto; width: fit-content; max-width: 960px; padding: 22px 34px; border-radius: 34px; background: {INK}; color: {PAPER}; box-shadow: 10px 10px 0 {COB}; font-weight: 900; font-size: 54px; line-height: 1.15; text-align: center; letter-spacing: -0.02em; opacity: 0; }}
      .cb b {{ color: {YEL}; }}
      #end-t {{ left: 70px; right: 150px; top: 520px; }}
      #folder {{ left: 70px; top: 1000px; width: 860px; height: 300px; background: #d8b46a; border: 7px solid {INK}; border-radius: 18px; box-shadow: 14px 14px 0 {INK}; }}
      #folder .lab {{ position: absolute; left: 40px; top: 40px; font-family: "JetBrains Mono"; font-weight: 800; font-size: 34px; }}
      #folder .url {{ position: absolute; left: 40px; top: 120px; font-family: "Bagel Fat One"; font-size: 84px; color: {PAPER}; -webkit-text-stroke: 6px {INK}; paint-order: stroke fill; }}
      #folder .bio {{ position: absolute; right: 40px; top: 40px; padding: 8px 18px; background: {INK}; color: {PAPER}; border-radius: 10px; font-weight: 900; font-size: 30px; }}
      #wipe {{ position: absolute; inset: 0; pointer-events: none; }}
      #paper {{ position: absolute; inset: 0; mix-blend-mode: multiply; pointer-events: none; }}
      #flash {{ background: #fffdf5; opacity: 0; pointer-events: none; }}
"""

caps_html = "\n".join(f'          <div class="cb" id="cb{i}">{t}</div>' for i, (_, _, t) in enumerate(CAP))
html = f"""<!doctype html>
<html lang="fr" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      /* « L'AFFAIRE DE LA COPRO DES LILAS » — test du style Halftone Dossier (grammaire du style-prompt Lemo-Opuscar), {DUR} s.
         Généré par tools/build.py à partir de tools/minutage.json. Composé en 1080×1920, rendu 2160×3840 à 60 i/s. */
{css}    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
      <audio id="soundtrack" src="assets/audio/soundtrack.wav" data-start="0" data-duration="{DUR}" data-track-index="4" data-volume="1"></audio>
      <section id="stage" class="clip" data-start="0" data-duration="{DUR}" data-track-index="0">
        <svg width="0" height="0" style="position: absolute">
          <defs>
            <pattern id="dotInk" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="13" cy="13" r="7" fill="{INK}" /></pattern>
            <filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="5" result="d" /><feComponentTransfer in="n" result="g"><feFuncA type="discrete" tableValues="1 1 0.75 1" /></feComponentTransfer><feComposite in="d" in2="g" operator="in" /></filter>
          </defs>
        </svg>
        <svg id="bg" viewBox="0 0 1080 1920" width="1080" height="1920"><path d="{BG1}" fill="{COB}" opacity="0.55" /><path d="{BG2}" fill="{PINK}" opacity="0.5" style="mix-blend-mode: multiply" /></svg>

        <div class="scn" id="sc0">
          {CHART}
          {hl("AFFAIRE N°\u00a0347", "hl", 'id="h0"')}
          {BUILDING}
          <div id="price" class="abs">210&nbsp;000&nbsp;€</div>
          <div class="plate abs">LES LILAS · 2 PIÈCES · 3ᵉ ÉTAGE</div>
        </div>
        <div class="scn" id="sc1">{numeral(1)}{hl("PIÈCE N°\u00a01", "hl", 'id="h1"')}{EX1}</div>
        <div class="scn" id="sc2">{numeral(2)}{hl("PIÈCE N°\u00a02", "hl", 'id="h2"')}{EX2}</div>
        <div class="scn" id="sc3">{numeral(3)}{hl("PIÈCE N°\u00a03", "hl", 'id="h3"')}{EX3}</div>
        <div class="scn" id="sc4">
          {CHART}
          {hl("VERDICT", "hl", 'id="h4"')}
          <div id="bld4">{BUILDING.replace('id="', 'id="b4')}</div>
          <div class="stamp" id="st1">À NÉGOCIER</div>
          <div class="stamp" id="st2">OU À FUIR</div>
        </div>
        <div class="scn" id="sc5">
          {hl("Ton appart a un dossier. On l'ouvre.", "hl", 'id="end-t"')}
          <div id="folder" class="abs"><div class="lab">DOSSIER · TON FUTUR APPART</div><div class="bio">Lien en bio</div><div class="url">analysetacopro.fr</div></div>
        </div>
        <div id="cap" class="abs">
{caps_html}
        </div>
        <svg id="wipe" viewBox="0 0 1080 1920" width="1080" height="1920">{''.join(f'<g id="wp{k}" fill="{c}">{WIPE}</g>' for k, c in enumerate(WCOL))}</svg>
        <div id="case" class="hud abs">DOSSIER N° 347</div>
        <div id="chap" class="hud abs">PIÈCE 1/3</div>
        <div id="rec" class="hud abs"><i id="recdot"></i>REC 02.11</div>
        <canvas id="paper" width="1080" height="1920"></canvas>
      </section>
      <div id="flash" class="clip" data-start="0" data-duration="{DUR}" data-track-index="2" data-layout-allow-overlap></div>
    </div>
    <script>
      // papier : marbrure, grain, vignette et pli (aléatoire à graine fixe → identique à chaque rendu)
      (() => {{
        let s = 1234567;
        const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
        const c = document.getElementById("paper"), x = c.getContext("2d");
        x.fillStyle = "#ffffff"; x.fillRect(0, 0, 1080, 1920);
        const t = document.createElement("canvas"); t.width = 36; t.height = 64;
        const tx = t.getContext("2d");
        for (let i = 0; i < 36; i++) for (let j = 0; j < 64; j++) {{ const v = 238 + Math.floor(rnd() * 17); tx.fillStyle = `rgb(${{v}},${{v - 4}},${{v - 12}})`; tx.fillRect(i, j, 1, 1); }}
        x.imageSmoothingEnabled = true; x.drawImage(t, 0, 0, 1080, 1920);
        for (let i = 0; i < 9000; i++) {{ const v = 200 + Math.floor(rnd() * 50); x.fillStyle = `rgba(${{v}},${{v - 10}},${{v - 30}},0.35)`; x.fillRect(rnd() * 1080, rnd() * 1920, 2, 2); }}
        const g = x.createRadialGradient(540, 900, 500, 540, 900, 1250); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(150,120,80,0.35)");
        x.fillStyle = g; x.fillRect(0, 0, 1080, 1920);
        x.fillStyle = "rgba(120,100,70,0.10)"; x.fillRect(538, 0, 4, 1920);
      }})();

      const DUR = {DUR}, SCN = {json.dumps([[round(a, 3), round(b, 3)] for a, b in SCN])}, WP = {json.dumps(WP)}, EV = {json.dumps(EV)};
      const CAP = {json.dumps([[a, b] for a, b, _ in CAP])};
      const tl = gsap.timeline({{ paused: true }});
      const flash = (t, a = 0.45, d = 0.2) => tl.fromTo("#flash", {{ opacity: a }}, {{ opacity: 0, duration: d, ease: "power2.out", immediateRender: false }}, t);
      const shake = (sel, t, amp = 18, n = 8) => {{
        for (let i = 0; i < n; i++) tl.to(sel, {{ x: Math.sin(i * 2.3 + t) * amp * (1 - i / n) ** 2, y: Math.cos(i * 3.7 + t) * amp * (1 - i / n) ** 2, duration: 0.03, ease: "none" }}, t + i * 0.03);
        tl.to(sel, {{ x: 0, y: 0, duration: 0.04 }}, t + n * 0.03);
      }};
      const pop = (sel, t, st = 0.05) => tl.fromTo(`${{sel}} .c`, {{ y: -90, scaleY: 1.5, scaleX: 0.7, opacity: 0 }}, {{ y: 0, scaleY: 1, scaleX: 1, opacity: 1, duration: 0.34, ease: "back.out(2.6)", stagger: st, immediateRender: false }}, t);
      const stampIn = (sel, t) => tl.fromTo(sel, {{ opacity: 0, scale: 2.6 }}, {{ opacity: 0.93, scale: 1, duration: 0.09, ease: "power3.in", immediateRender: false }}, t).to(sel, {{ scale: 1.04, duration: 0.06, yoyo: true, repeat: 1, ease: "sine.out" }}, t + 0.09);

      tl.set(["#flash", "#sc1", "#sc2", "#sc3", "#sc4", "#sc5", ".cb", "#chap"], {{ opacity: 0 }}, 0);
      // scènes visibles pendant leur fenêtre (la bascule se fait sous la transition)
      SCN.forEach(([a, b], i) => {{ if (i) tl.set(`#sc${{i}}`, {{ opacity: 1 }}, a); if (i < SCN.length - 1) tl.set(`#sc${{i}}`, {{ opacity: 0 }}, b); }});
      // transitions en points : la grille couvre puis se retire en diagonale
      WP.forEach((t, k) => {{
        const cs = document.querySelectorAll(["#wp0 circle", "#wp1 circle", "#wp2 circle"][k]);
        cs.forEach((c, i) => {{
          const d = ((i % 9) + Math.floor(i / 9)) * 0.009;
          tl.fromTo(c, {{ attr: {{ r: 0 }} }}, {{ attr: {{ r: 88 }}, duration: 0.2, ease: "power2.in", immediateRender: false }}, t + d - 0.02);
          tl.to(c, {{ attr: {{ r: 0 }}, duration: 0.2, ease: "power2.out" }}, t + 0.24 + d);
        }});
      }});
      // HUD : le point REC clignote
      for (let t = 0.5; t < DUR; t += 1) tl.set("#recdot", {{ opacity: 0.15 }}, t).set("#recdot", {{ opacity: 1 }}, t + 0.5);
      tl.fromTo("#case", {{ y: -60, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }}, 0.08);

      // 0 : l'affaire, le suspect, le prix
      flash(0.0, 0.5, 0.25);
      pop("#h0", 0.04, 0.035);
      tl.fromTo("#sc0 .bld", {{ y: 400, scale: 0.65 }}, {{ y: 0, scale: 0.82, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }}, 0.0);
      tl.fromTo("#price", {{ scale: 0, rotate: -30 }}, {{ scale: 1, rotate: -6, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }}, 0.12);
      tl.to("#price", {{ scale: 1.18, duration: 0.14, yoyo: true, repeat: 1, ease: "sine.out" }}, EV.price);
      tl.fromTo("#sc0 .plate", {{ y: 80, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }}, 0.6);
      tl.to("#sc0", {{ scale: 1.05, duration: SCN[0][1] - 0.5, ease: "none", transformOrigin: "50% 45%" }}, 0.5);
      tl.to(["#lidL", "#lidR"], {{ scaleY: 0, duration: 0.12, transformOrigin: "50% 0%" }}, 0.4);
      tl.to(["#pupL", "#pupR"], {{ x: -14, duration: 0.25 }}, 2.2).to(["#pupL", "#pupR"], {{ x: 12, duration: 0.3 }}, 3.4).to(["#pupL", "#pupR"], {{ x: 0, duration: 0.2 }}, 4.4);
      tl.to(["#lidL", "#lidR"], {{ scaleY: 0.55, duration: 0.1 }}, 4.3).to(["#lidL", "#lidR"], {{ scaleY: 0, duration: 0.1 }}, 4.5);

      // pièces 1 à 3
      [1, 2, 3].forEach((k) => {{
        const a = SCN[k][0];
        tl.set("#chap", {{ textContent: `PIÈCE ${{k}}/3` }}, a);
        tl.fromTo("#chap", {{ opacity: 0, scale: 0.4 }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }}, a + 0.05);
        tl.fromTo(`#sc${{k}} .num`, {{ y: -500, scaleY: 1.3 }}, {{ y: 0, scaleY: 1, duration: 0.32, ease: "back.out(1.6)", immediateRender: false }}, a + 0.02);
        pop(`#h${{k}}`, a + 0.15);
        tl.fromTo(`#sc${{k}} .doc`, {{ y: 700, rotate: 6 }}, {{ y: 0, rotate: -1.5, duration: 0.42, ease: "back.out(1.5)", immediateRender: false }}, a + 0.3);
        tl.to(`#sc${{k}}`, {{ scale: 1.04, duration: SCN[k][1] - a, ease: "none", transformOrigin: "40% 55%" }}, a);
      }});
      tl.to("#chap", {{ opacity: 0, duration: 0.15 }}, SCN[3][1] - 0.15);
      tl.to("#mk1", {{ scaleX: 1, duration: 0.55, ease: "power2.inOut" }}, EV.num1 - 1.9);
      stampIn("#t1", EV.num1); shake("#sc1 .doc", EV.num1 + 0.09, 16); flash(EV.num1 + 0.09, 0.3, 0.15);
      tl.fromTo("#ring2", {{ attr: {{ "stroke-dashoffset": 1 }} }}, {{ attr: {{ "stroke-dashoffset": 0 }}, duration: 0.5, ease: "power1.inOut", immediateRender: false }}, EV.circle2);
      tl.fromTo("#y2009", {{ color: "{INK}" }}, {{ color: "{RED}", duration: 0.2, immediateRender: false }}, EV.circle2 + 0.1);
      tl.fromTo("#cov3", {{ scaleX: 1 }}, {{ scaleX: 0, duration: 0.32, ease: "power3.inOut", immediateRender: false }}, EV.reveal3 - 0.05);
      flash(EV.reveal3 + 0.3, 0.25, 0.15);

      // verdict : silence, poussée, tampon
      const v0 = SCN[4][0];
      flash(v0 + 0.05, 0.5, 0.25);
      pop("#h4", v0 + 0.05);
      tl.fromTo("#bld4", {{ scale: 1 }}, {{ scale: 1.08, duration: EV.stamp - v0, ease: "power1.in", transformOrigin: "70% 60%", immediateRender: false }}, v0);
      tl.to(["#b4lidL", "#b4lidR"], {{ scaleY: 0, duration: 0.1, transformOrigin: "50% 0%" }}, v0);
      tl.to(["#b4lidL", "#b4lidR"], {{ scaleY: 0.6, duration: 0.15, transformOrigin: "50% 0%" }}, EV.stamp - 0.4);
      stampIn("#st1", EV.stamp); shake("#sc4", EV.stamp + 0.09, 26); flash(EV.stamp + 0.09, 0.5, 0.2);
      stampIn("#st2", EV.stamp2); shake("#sc4", EV.stamp2 + 0.09, 16);

      // fin : le dossier
      const e0 = SCN[5][0];
      pop("#end-t", e0 + 0.05, 0.022);
      tl.fromTo("#folder", {{ y: 900, rotate: 8 }}, {{ y: 0, rotate: -2, duration: 0.45, ease: "back.out(1.6)", immediateRender: false }}, EV.endfile + 0.05);
      shake("#folder", EV.endfile + 0.52, 12);

      // sous-titres (bandeau) : la phrase dite, mot-clé en jaune
      CAP.forEach(([a, b], i) => {{
        tl.fromTo(`#cb${{i}}`, {{ opacity: 0, scale: 0.6, y: 30 }}, {{ opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(2.4)", immediateRender: false }}, a);
        tl.to(`#cb${{i}}`, {{ opacity: 0, scale: 0.9, duration: 0.08 }}, b - 0.08);
      }});

      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
open(os.path.join(HERE, "..", "index.html"), "w").write(html)
print("ok", len(CAP), "bandeaux,", DUR, "s,", round(len(html) / 1024), "Ko")
