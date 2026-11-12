"""Génère index.html d'une vidéo « format v2 grand public » à partir de sa fiche (specs.py) et de son minutage (mix.py).

Règles du format : l'accroche dès la 1re image, une idée par scène, gros sous-titres mot à mot (le mot dit en jaune),
une couleur de fond par scène, chaque apparition calée sur le mot qui la dit, fin courte.
Usage : python3 tools/v2/build.py <nom> <projet>
"""
import json
import math
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from specs import SPECS  # noqa: E402

NAME, PROJ = sys.argv[1], sys.argv[2]
SPEC = SPECS[NAME]
M = json.load(open(os.path.join(PROJ, "tools", "minutage.json")))
DUR, SC, W = M["dur"], M["scenes"], M["words"]
YEL, INK, BG = "#fde047", "#0a0d1f", "#0a0d1f"
N = len(SPEC["scenes"])
ENDS = [SC[k + 1]["t0"] if k + 1 < N else DUR for k in range(N)]


def show(w):
    return re.sub(r"\b((?:[A-Z]\.){2,})", lambda m: m.group(1).replace(".", ""), w).replace("..", ".")


# ------------------------------------------------------------ sous-titres mot à mot
words = []
for x in W:
    if words and re.fullmatch(r"[?:!;]+", x[1]) and words[-1][0] == x[0]:
        words[-1] = [words[-1][0], words[-1][1] + " " + x[1], words[-1][2], x[3]]
    else:
        words.append(list(x))
chunks, cur = [], []
for k, x in enumerate(words):
    cur.append(x)
    last = k == len(words) - 1 or words[k + 1][0] != x[0]
    if len(cur) == 4 or re.search(r"[?:.,!]$", x[1]) or last:
        chunks.append(cur); cur = []
CAPS = []
for i, c in enumerate(chunks):
    nxt = chunks[i + 1][0][2] if i + 1 < len(chunks) else DUR
    CAPS.append([0.0 if i == 0 else round(c[0][2] - 0.04, 3), round(min(nxt, c[-1][3] + 0.55), 3), [[show(x[1]), x[2]] for x in c]])


def size_for(txt, big=230):
    n = len(txt)
    return big if n <= 5 else int(big * 0.78) if n <= 8 else int(big * 0.6) if n <= 12 else int(big * 0.46)


# ------------------------------------------------------------ scènes
html_sc, js = [], []
first_stat = next((s for s in SPEC["scenes"] if s["type"] == "stat"), None)


def plan(side, ghost=False, cls=""):
    """Plan d'appartement : contour, cloison et porte, carré de côté proportionnel à √surface."""
    s = side
    stroke = "rgba(255,255,255,0.45)" if ghost else "#ffffff"
    dash = 'stroke-dasharray="14 12"' if ghost else ""
    fill = "none" if ghost else "rgba(253,224,71,0.16)"
    inner = "" if ghost else (f'<line x1="{s * 0.58:.0f}" y1="8" x2="{s * 0.58:.0f}" y2="{s * 0.42:.0f}" stroke="#fff" stroke-width="6" />'
                              f'<path d="M {s * 0.18:.0f} {s - 8:.0f} a {s * 0.16:.0f} {s * 0.16:.0f} 0 0 1 {s * 0.16:.0f} {-s * 0.16:.0f}" fill="none" stroke="#fff" stroke-width="4" />')
    return (f'<svg class="plan {cls}" width="{s + 16:.0f}" height="{s + 16:.0f}" viewBox="-8 -8 {s + 16:.0f} {s + 16:.0f}">'
            f'<rect x="0" y="0" width="{s:.0f}" height="{s:.0f}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="10" {dash} />{inner}</svg>')


def fmt(n):
    return f"{n:,}".replace(",", " ")


for k, sc in enumerate(SPEC["scenes"]):
    t0, t1, ty = SC[k]["t0"], ENDS[k], sc["type"]
    ev = SC[k]
    sid = f"s{k}"
    parts = []
    if ty == "hook":
        big = sc["big"].split("\n")
        fs = sc.get("fs") or size_for(max(big, key=len), 250)
        pre = f'<div class="hpre">{sc["pre"]}</div>' if "pre" in sc else ""
        parts.append(f'<div class="hookbox">{pre}<div class="hook" style="font-size:{fs}px">{"<br />".join(big)}</div><div class="hsub" id="{sid}sub">{sc["sub"]}</div></div>')
        # 1re image = l'accroche déjà lisible (c'est aussi la couverture par défaut) ; elle « claque » juste après
        js.append(f'tl.fromTo("#{sid} .hook", {{ scale: 1.07 }}, {{ scale: 1, duration: 0.22, ease: "power4.out", immediateRender: false }}, {t0:.3f});')
        js.append(f'shake("#{sid} .hook", {t0 + 0.05:.3f}, 20);')
        js.append(f'tl.fromTo("#{sid}sub", {{ y: 40 }}, {{ y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }}, {t0:.3f});')
        if "sub_at" in ev:
            js.append(f'tl.fromTo("#{sid}sub", {{ scale: 1 }}, {{ scale: 1.12, duration: 0.15, yoyo: true, repeat: 1, ease: "sine.out", immediateRender: false }}, {ev["sub_at"]:.3f});')
        js.append(f'tl.to("#{sid} .hook", {{ scale: 1.06, duration: {max(0.3, t1 - t0 - 0.4):.2f}, ease: "none" }}, {t0 + 0.3:.3f});')
    elif ty == "stat":
        side = 430 * math.sqrt(sc["area"] / sc["max"])
        ghost = ""
        if first_stat is not None and sc is not first_stat:
            gs = 430 * math.sqrt(first_stat["area"] / first_stat["max"])
            ghost = f'<div class="ghost" style="width:{gs + 16:.0f}px">{plan(gs, True)}<span>{first_stat["label"].title()}</span></div>'
        parts.append(f'''<div class="lab">{sc["label"]}</div><div class="ppm">{sc["price"]}</div>
          <div class="val"{' style="font-size:210px"' if len(str(sc["value"])) >= 3 else ''}><span id="{sid}n">0</span><small>{sc["unit"]}</small></div>
          <div class="planbox">{ghost}{plan(side)}</div>
          <div class="chip" id="{sid}c" style="background:{sc["glow"]}">{sc["note"]}</div>
          <div class="src">{SPEC["source"]}</div>''')
        js.append(f'tl.fromTo("#{sid} .lab", {{ x: -120, opacity: 0 }}, {{ x: 0, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: false }}, {t0 + 0.02:.3f});')
        js.append(f'tl.fromTo("#{sid} .ppm", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3, immediateRender: false }}, {t0 + 0.25:.3f});')
        js.append(f'roll("#{sid}n", 0, {sc["value"]}, {ev["at"] - 0.05:.3f}, 0.45);')
        js.append(f'tl.fromTo("#{sid} .val", {{ scale: 0.6 }}, {{ scale: 1, duration: 0.45, ease: "back.out(2.2)", immediateRender: false }}, {ev["at"] - 0.05:.3f});')
        js.append(f'tl.fromTo("#{sid} .plan:not(.g)", {{ scale: 0, transformOrigin: "0% 100%" }}, {{ scale: 1, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }}, {ev["at"]:.3f});')
        js.append(f'tl.fromTo("#{sid}c", {{ scale: 0, rotate: -8 }}, {{ scale: 1, rotate: -2, duration: 0.3, ease: "back.out(3)", immediateRender: false }}, {ev.get("note_at", ev["at"] + 0.6):.3f});')
    elif ty in ("rule", "punch", "verdict"):
        big = sc["big"]
        fs = size_for(big, 260 if ty != "rule" else 230)
        cls = "rbig" + (" punch" if ty == "punch" else "") + (" ok" if ty == "verdict" else "")
        chip = f'<div class="chip" id="{sid}c" style="background:{sc["glow"]}">{sc["chip"]}</div>' if "chip" in sc else ""
        bar = f'<div class="bar" id="{sid}b" style="background:{sc["glow"]}"></div>' if ty == "rule" else ""
        parts.append(f'<div class="{cls}" id="{sid}big" style="font-size:{fs}px">{big}</div>{bar}<div class="rsub" id="{sid}sub">{sc["sub"]}</div>{chip}')
        at = ev["at"]
        js.append(f'tl.fromTo("#{sid}big", {{ scale: 2.3, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.14, ease: "power4.in", immediateRender: false }}, {at - 0.12:.3f});')
        js.append(f'shake("#{sid}big", {at + 0.02:.3f}, 20); flash({at + 0.02:.3f}, 0.22, 0.15);')
        if bar:
            js.append(f'tl.fromTo("#{sid}b", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.4, ease: "power3.out", immediateRender: false }}, {at + 0.1:.3f});')
        sub_t = t0 + 0.1 if ty == "punch" else at + 0.15   # le « coup de poing » : le contexte d'abord, le mot choc pile sur la voix
        js.append(f'tl.fromTo("#{sid}sub", {{ y: 50, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }}, {sub_t:.3f});')
        if chip:
            js.append(f'tl.fromTo("#{sid}c", {{ scale: 0, rotate: -8 }}, {{ scale: 1, rotate: -2, duration: 0.3, ease: "back.out(3)", immediateRender: false }}, {ev["chip_at"]:.3f});')
        if ty == "punch":
            js.append(f'tl.to("#{sid}big", {{ scale: 1.08, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }}, {at + 0.3:.3f});')
    elif ty == "split":
        # où part l'argent : une barre qui se découpe au fil de la voix, puis une ligne par part
        tot = sum(x["value"] for x in sc["segments"])
        bar = "".join(f'<i id="{sid}g{j}" style="width:{100 * x["value"] / tot:.2f}%;background:{x["color"]}"></i>' for j, x in enumerate(sc["segments"]))
        rows = "".join(f'<div class="srow" id="{sid}r{j}"><b style="background:{x["color"]}"></b><span>{x["label"]}</span><em>{fmt(x["value"])}&nbsp;€</em></div>' for j, x in enumerate(sc["segments"]))
        parts.append(f'<div class="stitle">{sc["title"]}</div><div class="sbar">{bar}</div><div class="srows">{rows}</div><div class="src">{SPEC["source"]}</div>')
        js.append(f'tl.fromTo("#{sid} .stitle", {{ y: 50, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }}, {t0 + 0.05:.3f});')
        js.append(f'tl.fromTo("#{sid} .sbar", {{ scaleX: 0.2, opacity: 0 }}, {{ scaleX: 1, opacity: 1, duration: 0.35, ease: "power3.out", immediateRender: false }}, {t0 + 0.2:.3f});')
        for j, x in enumerate(sc["segments"]):
            at = ev[f"seg{j}"]
            js.append(f'tl.fromTo("#{sid}g{j}", {{ opacity: 0.12 }}, {{ opacity: 1, duration: 0.2, immediateRender: false }}, {at:.3f});')
            js.append(f'tl.fromTo("#{sid}g{j}", {{ scaleY: 1.6 }}, {{ scaleY: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }}, {at:.3f});')
            js.append(f'tl.fromTo("#{sid}r{j}", {{ x: -80, opacity: 0 }}, {{ x: 0, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }}, {at:.3f});')
    elif ty == "listing":
        parts.append("")  # l'annonce vit dans son propre calque (#lst)
    elif ty == "flag":
        parts.append("")
    elif ty == "loop":
        parts.append('<div class="lbrand">AnalyseTaCopro · lien en bio</div>')
    elif ty == "end":
        parts.append(f'''<div class="elogo"><svg viewBox="0 0 56 64" width="50" height="58"><rect x="2" y="0" width="52" height="9" rx="4" fill="#fff" /><rect x="8" y="14" width="9" height="36" rx="3" fill="#fff" /><rect x="23" y="14" width="9" height="36" rx="3" fill="#fff" /><rect x="38" y="14" width="9" height="36" rx="3" fill="#fff" /><rect x="0" y="55" width="56" height="9" rx="4" fill="#fff" /></svg>AnalyseTaCopro</div>
          <div class="eb"><div class="et">{sc["t1"]}<br /><span>{sc["t2"]}</span></div><div class="eurl">analysetacopro.fr · lien en bio</div></div>''')
        js.append(f'tl.fromTo("#{sid} .et", {{ y: 80, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }}, {t0 + 0.08:.3f});')
        js.append(f'tl.fromTo("#{sid} .eurl", {{ y: 40, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: false }}, {t0 + 0.4:.3f});')
    html_sc.append(f'        <div class="scn" id="{sid}">{"".join(parts)}</div>')
    if "n" in sc:
        js.append(f'tl.set("#count", {{ textContent: "{sc["n"]}" }}, {t0:.3f}); tl.fromTo("#count", {{ scale: 1.7, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }}, {t0:.3f});')
    else:
        js.append(f'tl.set("#count", {{ opacity: 0 }}, {t0:.3f});')

# ------------------------------------------------------------ l'annonce (arnaque) : un calque qui traverse les scènes
LST = ""
if "listing" in SPEC:
    L = SPEC["listing"]
    msg = L["msg"]
    for tg, txt in L.get("hl", {"pay": "Faites un virement de 650 € pour réserver", "docs": "vos relevés bancaires"}).items():
        msg = msg.replace(txt, f'<span id="hl-{tg}">{txt}</span>')
    LST = f'''        <div id="lst">
          <div class="card">
            <svg class="photo" viewBox="0 0 840 330" width="840" height="330">
              <rect width="840" height="330" fill="#fde68a" /><rect x="0" y="230" width="840" height="100" fill="#d6a86b" />
              <rect x="520" y="40" width="250" height="170" rx="10" fill="#bae6fd" stroke="#fff" stroke-width="14" /><line x1="645" y1="40" x2="645" y2="210" stroke="#fff" stroke-width="10" />
              <circle cx="590" cy="95" r="30" fill="#fef08a" />
              <rect x="90" y="150" width="330" height="100" rx="26" fill="#6366f1" /><rect x="70" y="120" width="70" height="140" rx="24" fill="#4f46e5" /><rect x="370" y="120" width="70" height="140" rx="24" fill="#4f46e5" />
              <rect x="470" y="190" width="28" height="70" rx="6" fill="#92400e" /><circle cx="484" cy="170" r="42" fill="#16a34a" />
                          </svg>
            <div class="lt">{L["title"]}</div><div class="lp">{L["place"]}</div>
            <div class="lprice" id="lprice">{L["price"]}</div>
            <div class="lowner" id="lowner"><i></i>{L["owner"]}</div>
            <div class="lmsg" id="lmsg">{msg}</div>
          </div>
          <div class="ring" id="ring-price"></div><div class="ring" id="ring-owner"></div>
          {''.join(f'<div class="stampx" id="st-{s["target"]}">{s["label"]}</div>' for s in SPEC["scenes"] if s["type"] == "flag")}
        </div>'''
    js.append('tl.set("#lst", { opacity: 1 }, 0);')
    js.append('tl.fromTo("#lst .card", { scale: 1.1 }, { scale: 1, duration: 0.25, ease: "power4.out", immediateRender: false }, 0);')
    js.append('flash(0, 0.3, 0.2);')
    js.append('tl.to("#lst .card", { scale: 1.04, duration: 2.2, ease: "none" }, 0.3);')
    prev = []
    for k, sc in enumerate(SPEC["scenes"]):
        if sc["type"] != "flag":
            continue
        at = SC[k]["at"]
        tg = sc["target"]
        if tg in ("price", "owner"):
            js.append(f'tl.fromTo("#ring-{tg}", {{ scale: 1.6, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.22, ease: "power3.in", immediateRender: false }}, {at - 0.05:.3f});')
        else:
            js.append(f'tl.fromTo("#hl-{tg}", {{ backgroundColor: "rgba(239,68,68,0)", color: "#374151" }}, {{ backgroundColor: "rgba(239,68,68,1)", color: "#ffffff", duration: 0.2, immediateRender: false }}, {at - 0.05:.3f});')
        if prev:
            js.append(f'tl.to({json.dumps(prev)}, {{ opacity: 0.3, scale: 0.92, duration: 0.2 }}, {at - 0.15:.3f});')
        prev.append(f"#st-{tg}")
        js.append(f'tl.fromTo("#st-{tg}", {{ scale: 2.6, opacity: 0 }}, {{ scale: 1, opacity: 0.95, duration: 0.1, ease: "power4.in", immediateRender: false }}, {at:.3f});')
        js.append(f'shake("#lst", {at + 0.1:.3f}, 16); flash({at + 0.1:.3f}, 0.2, 0.14);')

# ------------------------------------------------------------ fonds, compteur, sous-titres
glows = "\n".join(f'        <div class="glow" id="g{k}" style="background: radial-gradient(closest-side, {s["glow"]}99, {s["glow"]}26 55%, transparent 75%)"></div>' for k, s in enumerate(SPEC["scenes"]))
caps = "\n".join(f'          <div class="ch" id="c{i}">' + " ".join(f'<i id="c{i}w{j}">{t}</i>' for j, (t, _) in enumerate(c[2])) + "</div>" for i, c in enumerate(CAPS))
WIN = [[round(SC[k]["t0"], 3), round(ENDS[k], 3)] for k in range(N)]
# l'annonce s'efface à la première scène qui suit le dernier indice ; une scène « loop » la ramène (la vidéo boucle)
flags = [k for k, s in enumerate(SPEC["scenes"]) if s["type"] == "flag"]
listing_end = SC[flags[-1] + 1]["t0"] if flags and flags[-1] + 1 < N else None
if listing_end is not None:
    js.append(f'tl.to("#lst", {{ scale: 0.55, y: -160, opacity: 0.18, duration: 0.35, ease: "power2.in" }}, {listing_end:.3f});')
for k, s in enumerate(SPEC["scenes"]):
    if s["type"] == "loop" and "listing" in SPEC:
        t = SC[k]["t0"]
        tgs = [f["target"] for f in SPEC["scenes"] if f["type"] == "flag"]
        js.append(f'tl.set({json.dumps([f"#st-{g}" for g in tgs] + ["#ring-price", "#ring-owner"])}, {{ opacity: 0, scale: 1 }}, {t:.3f});')
        js.append(f'tl.set(["#hl-pay", "#hl-docs"], {{ backgroundColor: "rgba(239,68,68,0)", color: "#374151" }}, {t:.3f});')
        js.append(f'tl.fromTo("#lst", {{ opacity: 0, scale: 0.9, y: 60 }}, {{ opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }}, {t:.3f});')
        js.append(f'tl.set("#lst .card", {{ scale: 1 }}, {t:.3f});')

css = f"""      @font-face {{ font-family: "Inter"; src: url("assets/fonts/Inter.woff2") format("woff2"); font-weight: 100 900; font-display: block; }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: {BG}; }}
      #root {{ position: relative; width: 1080px; height: 1920px; overflow: hidden; font-family: "Inter", sans-serif; color: #fff; background: {BG}; }}
      .clip {{ position: absolute; inset: 0; overflow: hidden; }}
      .abs {{ position: absolute; }}
      .glow {{ position: absolute; left: 0; top: 160px; width: 1080px; height: 1300px; border-radius: 50%; opacity: 0; }}
      #grid {{ position: absolute; left: 0; top: 0; width: 1080px; height: 2100px; opacity: 0.16; background-image: radial-gradient(circle, #fff 2px, transparent 2.5px); background-size: 54px 54px; }}
      #tag {{ left: 70px; top: 190px; padding: 12px 26px; border-radius: 999px; background: rgba(255,255,255,0.13); border: 2px solid rgba(255,255,255,0.28); font-size: 32px; font-weight: 800; letter-spacing: 0.04em; }}
      #count {{ right: 160px; top: 190px; padding: 12px 24px; border-radius: 999px; background: #fff; color: {INK}; font-size: 32px; font-weight: 900; opacity: 0; font-variant-numeric: tabular-nums; }}
      .scn {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; opacity: 0; }}
      .hookbox {{ position: absolute; left: 40px; right: 40px; top: 360px; height: 780px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }}
      .hpre {{ font-size: 64px; font-weight: 900; letter-spacing: -0.03em; color: rgba(255,255,255,0.85); margin-bottom: 18px; }}
      .hook {{ font-weight: 900; letter-spacing: -0.05em; line-height: 0.98; color: #fff; text-shadow: 0 12px 0 rgba(0,0,0,0.4), 0 0 80px rgba(255,255,255,0.3); white-space: nowrap; }}
      .hsub {{ margin-top: 34px; padding: 14px 32px; border-radius: 26px; background: {YEL}; color: {INK}; font-size: 66px; font-weight: 900; letter-spacing: -0.03em; }}
      .lab {{ position: absolute; left: 70px; top: 330px; font-size: 104px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; }}
      .ppm {{ position: absolute; left: 74px; top: 450px; font-size: 38px; font-weight: 700; color: rgba(255,255,255,0.72); }}
      .val {{ position: absolute; left: 60px; top: 560px; font-size: 290px; font-weight: 900; letter-spacing: -0.06em; line-height: 1; color: {YEL}; text-shadow: 0 12px 0 rgba(0,0,0,0.35); font-variant-numeric: tabular-nums; transform-origin: 0% 50%; }}
      .val small {{ font-size: 110px; letter-spacing: -0.03em; margin-left: 12px; color: #fff; }}
      .planbox {{ position: absolute; left: 570px; top: 480px; width: 450px; height: 460px; }}
      .plan {{ position: absolute; left: 0; bottom: 0; }}
      .ghost {{ position: absolute; left: 0; bottom: 0; }}
      .ghost span {{ position: absolute; left: 10px; top: -44px; font-size: 30px; font-weight: 800; color: rgba(255,255,255,0.6); white-space: nowrap; }}
      .chip {{ position: absolute; left: 70px; top: 975px; padding: 16px 30px; border-radius: 24px; color: {INK}; font-size: 54px; font-weight: 900; letter-spacing: -0.02em; transform-origin: 0% 50%; }}
      .src {{ position: absolute; left: 70px; right: 150px; top: 1100px; font-size: 28px; font-weight: 600; color: rgba(255,255,255,0.55); }}
      .rbig {{ position: absolute; left: 40px; right: 40px; top: 430px; text-align: center; font-weight: 900; letter-spacing: -0.05em; line-height: 1; white-space: nowrap; text-shadow: 0 12px 0 rgba(0,0,0,0.35); opacity: 0; }}
      .rbig.punch {{ color: {YEL}; top: 400px; }}
      .rbig.ok {{ color: #4ade80; }}
      .bar {{ position: absolute; left: 270px; width: 540px; top: 720px; height: 16px; border-radius: 8px; transform-origin: 0% 50%; transform: scaleX(0); }}
      .rsub {{ position: absolute; left: 70px; right: 70px; top: 770px; text-align: center; font-size: 62px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.12; opacity: 0; }}
      .rbig.punch ~ .rsub {{ top: 720px; }}
      .scn .chip.r {{ left: 0; right: 0; }}
      #lst {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; opacity: 0; transform-origin: 50% 40%; }}
      .card {{ position: absolute; left: 90px; top: 310px; width: 900px; height: 820px; background: #ffffff; border-radius: 36px; color: #111827; padding: 30px; box-shadow: 0 40px 90px rgba(0,0,0,0.55); transform-origin: 50% 50%; }}
      .card .photo {{ display: block; border-radius: 22px; }}
      .lt {{ margin-top: 22px; font-size: 48px; font-weight: 900; letter-spacing: -0.03em; }}
      .lp {{ margin-top: 2px; font-size: 34px; font-weight: 600; color: #6b7280; }}
      .lprice {{ position: absolute; left: 30px; top: 500px; font-size: 74px; font-weight: 900; letter-spacing: -0.04em; color: #111827; }}
      .lowner {{ position: absolute; left: 30px; top: 600px; font-size: 32px; font-weight: 700; color: #374151; display: flex; align-items: center; gap: 16px; }}
      .lowner i {{ width: 54px; height: 54px; border-radius: 50%; background: #c7d2fe; display: block; }}
      .lmsg {{ position: absolute; left: 30px; right: 30px; top: 676px; padding: 16px 22px; border-radius: 22px; background: #f3f4f6; font-size: 29px; font-weight: 600; line-height: 1.3; color: #374151; }}
      .lmsg span {{ border-radius: 8px; padding: 0 4px; }}
      .ring {{ position: absolute; border: 9px solid #ef4444; border-radius: 26px; opacity: 0; }}
      #ring-price {{ left: 100px; top: 795px; width: 440px; height: 112px; }}
      #ring-owner {{ left: 100px; top: 895px; width: 610px; height: 86px; }}
      .stampx {{ position: absolute; padding: 14px 24px; border: 8px solid #ef4444; outline: 4px solid #ef4444; outline-offset: 6px; border-radius: 18px; color: #ef4444; background: rgba(255,255,255,0.92); font-size: 46px; font-weight: 900; letter-spacing: -0.02em; white-space: nowrap; opacity: 0; }}
      #st-price {{ left: 560px; top: 808px; transform: rotate(-6deg); }}
      #st-owner {{ left: 130px; top: 360px; transform: rotate(5deg); }}
      #st-pay {{ left: 380px; top: 470px; transform: rotate(-4deg); }}
      #st-docs {{ left: 150px; top: 572px; transform: rotate(5deg); }}
      .elogo {{ position: absolute; left: 70px; top: 520px; display: flex; align-items: center; gap: 18px; font-size: 46px; font-weight: 800; }}
      .eb {{ position: absolute; left: 70px; right: 150px; top: 640px; }}
      .et {{ font-size: 112px; font-weight: 900; letter-spacing: -0.05em; line-height: 1.02; opacity: 0; }}
      .et span {{ color: {YEL}; }}
      .eurl {{ display: inline-block; margin-top: 44px; padding: 16px 28px; border-radius: 999px; background: #fff; color: {INK}; font-size: 40px; font-weight: 900; opacity: 0; }}
      .lbrand {{ position: absolute; right: 150px; top: 190px; padding: 12px 24px; border-radius: 999px; background: #fff; color: {INK}; font-size: 30px; font-weight: 900; }}
      .stitle {{ position: absolute; left: 70px; right: 150px; top: 330px; font-size: 76px; font-weight: 900; letter-spacing: -0.04em; line-height: 1.05; opacity: 0; }}
      .sbar {{ position: absolute; left: 70px; width: 940px; top: 560px; height: 130px; border-radius: 26px; overflow: hidden; display: flex; background: rgba(255,255,255,0.08); transform-origin: 0% 50%; }}
      .sbar i {{ display: block; height: 100%; opacity: 0.12; }}
      .srows {{ position: absolute; left: 70px; width: 940px; top: 740px; }}
      .srow {{ display: flex; align-items: center; gap: 22px; margin-bottom: 26px; font-size: 54px; font-weight: 800; opacity: 0; }}
      .srow b {{ width: 46px; height: 46px; border-radius: 12px; flex: none; }}
      .srow span {{ flex: 1; }}
      .srow em {{ font-style: normal; font-weight: 900; color: {YEL}; font-variant-numeric: tabular-nums; }}
      #caps {{ left: 60px; right: 60px; top: 1190px; height: 300px; }}
      .ch {{ position: absolute; left: 0; right: 0; top: 0; text-align: center; font-size: 84px; font-weight: 900; letter-spacing: -0.035em; line-height: 1.12; opacity: 0; text-shadow: 0 6px 0 rgba(0,0,0,0.45); }}
      .ch i {{ font-style: normal; color: #fff; display: inline-block; margin: 0 8px; }}
      #flash {{ background: #fff; opacity: 0; pointer-events: none; }}
"""

html = f"""<!doctype html>
<html lang="fr" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      /* « {SPEC["title"]} » — format v2 grand public. {SPEC["comment"]}
         Généré par tools/v2/build.py ({NAME}) à partir de tools/minutage.json. Composé en 1080×1920, rendu 2160×3840 à 60 i/s. */
{css}    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
      <audio id="soundtrack" src="assets/audio/soundtrack.wav" data-start="0" data-duration="{DUR}" data-track-index="4" data-volume="1"></audio>
      <section id="stage" class="clip" data-start="0" data-duration="{DUR}" data-track-index="0">
        <div id="grid"></div>
{glows}
        <div id="tag" class="abs">{SPEC["tag"]}</div>
        <div id="count" class="abs">1</div>
{LST}
{chr(10).join(html_sc)}
        <div id="caps" class="abs">
{caps}
        </div>
      </section>
      <div id="flash" class="clip" data-start="0" data-duration="{DUR}" data-track-index="2" data-layout-allow-overlap></div>
    </div>
    <script>
      const DUR = {DUR}, WIN = {json.dumps(WIN)}, CAPS = {json.dumps([[a, b, [w[1] for w in ws]] for a, b, ws in CAPS])};
      const tl = gsap.timeline({{ paused: true }});
      const flash = (t, a = 0.4, d = 0.2) => tl.fromTo("#flash", {{ opacity: a }}, {{ opacity: 0, duration: d, ease: "power2.out", immediateRender: false }}, t);
      const shake = (sel, t, amp = 18, n = 7) => {{
        for (let i = 0; i < n; i++) tl.to(sel, {{ x: Math.sin(i * 2.7 + t) * amp * (1 - i / n), y: Math.cos(i * 3.1 + t) * amp * (1 - i / n), duration: 0.03, ease: "none" }}, t + i * 0.03);
        tl.to(sel, {{ x: 0, y: 0, duration: 0.04 }}, t + n * 0.03);
      }};
      const sp = (n) => String(Math.round(n)).replace(/\\B(?=(\\d{{3}})+(?!\\d))/g, "\\u202f");
      const roll = (sel, a, b, t, d) => {{
        const o = {{ v: a }};
        tl.fromTo(o, {{ v: a }}, {{ v: b, duration: d, ease: "power2.out", immediateRender: false, onUpdate: () => {{ document.querySelector(sel).textContent = sp(o.v); }} }}, t);
      }};
      tl.set("#flash", {{ opacity: 0 }}, 0);
      tl.fromTo("#grid", {{ y: 0 }}, {{ y: -180, duration: DUR, ease: "none" }}, 0);
      // chaque scène n'est visible que pendant sa fenêtre ; une couleur de fond par scène
      WIN.forEach(([a, b], k) => {{
        tl.set(`#s${{k}}`, {{ opacity: 1 }}, a);
        if (k < WIN.length - 1) tl.set(`#s${{k}}`, {{ opacity: 0 }}, b);
        if (k === 0) tl.set("#g0", {{ opacity: 1 }}, 0);
        else tl.fromTo(`#g${{k}}`, {{ opacity: 0, scale: 0.85 }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", immediateRender: false }}, a);
        if (k < WIN.length - 1) tl.to(`#g${{k}}`, {{ opacity: 0, duration: 0.25 }}, b);
      }});
{"      tl.to('#lst', { opacity: 0, duration: 0.25 }, " + str(round(listing_end + 0.4, 3)) + ");" if listing_end else ""}
{"      tl.to('#tag', { opacity: 0, duration: 0.2 }, WIN[WIN.length - 1][0]);" if SPEC["scenes"][-1]["type"] == "end" else ""}
{chr(10).join("      " + j for j in js)}
      // sous-titres mot à mot : le mot dit passe en jaune
      CAPS.forEach(([t0, t1, ws], i) => {{
        if (i === 0) tl.set("#c0", {{ opacity: 1 }}, 0);
        else tl.fromTo(`#c${{i}}`, {{ opacity: 0, y: 26, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "power2.out", immediateRender: false }}, t0);
        ws.forEach((s, j) => {{
          tl.set(`#c${{i}}w${{j}}`, {{ color: "{YEL}" }}, s);
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
open(os.path.join(PROJ, "index.html"), "w").write(html)
print("ok", NAME, len(CAPS), "sous-titres,", DUR, "s")
