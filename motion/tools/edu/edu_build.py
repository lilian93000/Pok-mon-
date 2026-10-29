"""Génère les index.html des 5 vidéos « utiles » à partir d'une base commune (usage : python3 tools/edu/edu_build.py [calcul dpe …])."""
import json
import os
import sys

S = os.path.dirname(os.path.abspath(__file__))  # tools/edu/ : base commune + fiches des vidéos utiles
MOTION = os.path.dirname(os.path.dirname(S))
END = open(os.path.join(S, "end.html")).read()
ENDCSS = open(os.path.join(S, "end.css")).read()
ENDJS = open(os.path.join(S, "end.js")).read()
TITLE_OLD = """          <span class="mask"><span>Regarde sous</span></span>
          <span class="mask"><span>l'annonce</span></span>
          <span class="mask"><span class="y">avant de signer.</span></span>"""

BASE_CSS = """      @font-face {
        font-family: "Inter";
        src: url("assets/fonts/Inter.woff2") format("woff2");
        font-weight: 100 900;
        font-style: normal;
      }
      :root {
        --brand: #0b5fff;
%(vars)s
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html,
      body {
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background: var(--bg2);
      }
      #root {
        position: relative;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        font-family: "Inter", sans-serif;
        color: var(--ink);
        background: radial-gradient(80%% 55%% at 50%% 40%%, var(--bg1) 0%%, var(--bg2) 65%%, var(--bg3) 100%%);
      }
      .clip {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      .abs {
        position: absolute;
      }
      .cap {
        position: absolute;
        left: 70px;
        right: 160px;
        top: 215px;
        font-size: 60px;
        font-weight: 900;
        letter-spacing: -0.045em;
        line-height: 1.04;
        z-index: 6;
      }
      .cap .a {
        color: var(--acc);
      }
      #count {
        left: 70px;
        top: 372px;
        padding: 8px 24px;
        border-radius: 999px;
        background: var(--pill);
        color: var(--pillt);
        font-size: 36px;
        font-weight: 900;
        font-variant-numeric: tabular-nums;
        z-index: 6;
      }
      .tip {
        position: absolute;
        left: 70px;
        right: 160px;
        top: 1225px;
        padding: 22px 28px 26px;
        border-radius: 26px;
        background: var(--tipbg);
        color: #fff;
        opacity: 0;
        z-index: 5;
      }
      .tip .h {
        font-size: 26px;
        font-weight: 900;
        letter-spacing: 0.08em;
        color: var(--tiph);
      }
      .tip .x {
        margin-top: 6px;
        font-size: 40px;
        font-weight: 800;
        letter-spacing: -0.025em;
        line-height: 1.12;
      }
      .tip .x b {
        color: var(--tiph);
      }
      #know {
        background: radial-gradient(80%% 55%% at 50%% 40%%, #fff8d6 0%%, #ffe98a 65%%, #ffd84d 100%%);
        color: #14213a;
      }
      .card {
        position: absolute;
        left: 70px;
        right: 160px;
        padding: 34px 36px 38px;
        border-radius: 30px;
        background: #fff;
        box-shadow: 0 30px 70px rgba(80, 60, 0, 0.25);
        opacity: 0;
      }
      .card .h {
        font-size: 28px;
        font-weight: 900;
        letter-spacing: 0.08em;
        color: var(--brand);
      }
      .card .x {
        margin-top: 10px;
        font-size: 52px;
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1.06;
      }
      .card .x b {
        color: var(--brand);
      }
      .card .s {
        margin-top: 14px;
        font-size: 30px;
        font-weight: 700;
        color: #51617f;
      }
"""

PAGE = """<!doctype html>
<html lang="fr" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      /* %(comment)s
         Composé en 1080×1920, rendu en 2160×3840 à 60 i/s. Bande-son : tools/soundtrack.py */
%(base)s%(css)s%(endcss)s      #flash {
        background: #fff;
        opacity: 0;
      }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="30"
      data-width="1080"
      data-height="1920"
    >
      <audio id="soundtrack" src="assets/audio/soundtrack.wav" data-start="0" data-duration="30" data-track-index="4" data-volume="1"></audio>

      <section id="main" class="clip" data-start="0" data-duration="20" data-track-index="0">
%(html)s
        <div class="cap">%(cap)s</div>
        <div id="count" class="abs">%(count0)s</div>
%(tips)s
      </section>

      <section id="know" class="clip" data-start="20" data-duration="4" data-track-index="0">
        <div class="cap">Bon à savoir&nbsp;:</div>
        <div class="card" id="k0" style="top: 420px"><div class="h">%(k0h)s</div><div class="x"%(k0style)s>%(k0x)s</div>%(k0s)s</div>
        <div class="card" id="k1" style="top: %(k1top)spx"><div class="h">%(k1h)s</div><div class="x">%(k1x)s</div>%(k1s)s</div>
      </section>

%(end)s

      <div id="flash" class="clip" data-start="0" data-duration="30" data-track-index="2" data-layout-allow-overlap></div>
    </div>
    <script>
      const BEAT = 60 / %(bpm)s,
        BAR = BEAT * 4;
      const rnd = (i, k) => {
        const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
        return x - Math.floor(x);
      };
      const T = %(T)s;
      const TIP = %(tipat)s;
%(setup)s
      document.getElementById("url").innerHTML = "analysetacopro.fr".split("").map((c) => `<span class="ch">${c}</span>`).join("");

      const tl = gsap.timeline({ paused: true });
      const flash = (t, a = 0.6, d = 0.25) => tl.fromTo("#flash", { opacity: a }, { opacity: 0, duration: d, ease: "power2.out", immediateRender: false }, t);
      const shake = (sel, t, amp = 10, n = 5) => {
        for (let i = 0; i < n; i++) tl.to(sel, { x: (rnd(i, t) - 0.5) * 2 * amp * (1 - i / n), y: (rnd(i, t + 1) - 0.5) * 2 * amp * (1 - i / n), duration: 0.03, ease: "none" }, t + i * 0.03);
        tl.to(sel, { x: 0, y: 0, duration: 0.04 }, t + n * 0.03);
      };
      tl.set("#flash", { opacity: 0 }, 0);

      // les étapes : compteur + explication
      T.forEach((t, k) => {
        tl.set("#count", { textContent: `%(countk)s` }, t);
        tl.fromTo("#count", { scale: 1.25 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
        if (document.getElementById(`tp${k}`)) {
          tl.fromTo(`#tp${k}`, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }, TIP[k]);
          tl.to(`#tp${k}`, { opacity: 0, y: -10, duration: 0.15 }, (T[k + 1] || 20) - 0.25);
        }
      });
%(js)s
      // 20 s : bon à savoir
      flash(20, 0.5, 0.25);
      tl.fromTo("#k0", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, 20.2);
      tl.fromTo("#k1", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, 21.3);

%(endjs)s
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""


def page(spec):
    tips = "\n".join(
        f'        <div class="tip" id="tp{k}"><div class="h">{h}</div><div class="x">{x}</div></div>' for k, (h, x) in enumerate(spec.get("tips", []))
    )
    end = END.replace(TITLE_OLD, "\n".join(
        f'          <span class="mask"><span{" class=\"y\"" if i == len(spec["endtitle"]) - 1 else ""}>{l}</span></span>' for i, l in enumerate(spec["endtitle"])
    ))
    k0, k1 = spec["know"]
    return PAGE % dict(
        comment=spec["comment"],
        base=BASE_CSS % dict(vars=spec["vars"]),
        css=spec["css"],
        endcss=ENDCSS.replace("#7fe3ff", spec["endacc"]).replace("127, 227, 255", spec["endrgb"]),
        html=spec["html"],
        cap=spec["cap"],
        count0=spec["count0"],
        tips=tips,
        k0h=k0[0], k0x=k0[1], k0s=f'<div class="s">{k0[2]}</div>' if len(k0) > 2 else "", k0style=spec.get("k0style", ""),
        k1h=k1[0], k1x=k1[1], k1s=f'<div class="s">{k1[2]}</div>' if len(k1) > 2 else "", k1top=spec.get("k1top", 900),
        end=end,
        bpm=spec["bpm"],
        T=spec["T"],
        tipat=spec.get("tipat", [round(t + 0.3, 2) for t in json.loads(spec["T"])]),
        setup=spec.get("setup", ""),
        countk=spec["countk"],
        js=spec["js"],
        endjs=ENDJS,
    )


if __name__ == "__main__":
    sys.path.insert(0, S)
    import edu_specs  # noqa: E402

    for name in sys.argv[1:] or list(edu_specs.SPECS):
        out = os.path.join(MOTION, f"analysetacopro-{name}", "index.html")
        open(out, "w").write(page(edu_specs.SPECS[name]))
        print("ok", out)
