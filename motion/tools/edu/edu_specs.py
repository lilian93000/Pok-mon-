SPECS = {}

T4 = "[2.0, 6.5, 11.0, 15.5]"
T5 = "[2.0, 5.6, 9.2, 12.8, 16.4]"

# ---------------------------------------------------------------- 1. LA CALCULETTE
SPECS["calcul"] = dict(
    comment="« LA CALCULETTE » — vidéo utile : ta part des travaux = tes tantièmes. 120 BPM (bossa nova) : 1 mesure = 2 s.",
    bpm=120,
    T=T4,
    vars="""        --bg1: #f2fff8;
        --bg2: #d3f5e3;
        --bg3: #a9e6c6;
        --ink: #0d2b20;
        --acc: #0a7a48;
        --pill: #0d2b20;
        --pillt: #7dffc0;
        --tipbg: #0d2b20;
        --tiph: #7dffc0;""",
    css="""      #calc {
        left: 190px;
        top: 450px;
        width: 700px;
        height: 740px;
        border-radius: 48px;
        background: linear-gradient(160deg, #26372f 0%, #141e1a 100%);
        box-shadow: 0 40px 80px rgba(13, 43, 32, 0.35);
      }
      #screen {
        position: absolute;
        left: 40px;
        right: 40px;
        top: 40px;
        height: 230px;
        border-radius: 22px;
        background: #c9f0d9;
        padding: 22px 30px;
        text-align: right;
        overflow: hidden;
      }
      #lab {
        font-size: 30px;
        font-weight: 900;
        letter-spacing: 0.08em;
        color: #2f5a47;
      }
      #num {
        margin-top: 18px;
        font-size: 104px;
        font-weight: 900;
        letter-spacing: -0.05em;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        color: #0d2b20;
        white-space: nowrap;
      }
      .key {
        position: absolute;
        width: 140px;
        height: 88px;
        border-radius: 20px;
        background: #3a4d45;
        color: #fff;
        font-size: 44px;
        font-weight: 800;
        line-height: 88px;
        text-align: center;
      }
      .key.op {
        background: #0a7a48;
      }
""",
    html="""        <div id="calc" class="abs">
          <div id="screen"><div id="lab">RAVALEMENT VOTÉ</div><div id="num">180&nbsp;000&nbsp;€</div></div>
          <div id="keys"></div>
        </div>""",
    cap="Travaux votés&nbsp;:<br /><span class=\"a\">combien tu paies&nbsp;?</span>",
    count0="Exemple · ravalement",
    countk="Étape ${k + 1}/4",
    tips=[
        ("1 · TES TANTIÈMES", "Ta part de l'immeuble. Elle est écrite dans le <b>règlement de copropriété</b>."),
        ("2 · TON POURCENTAGE", "250 sur 10&nbsp;000, c'est <b>2,5&nbsp;%</b> des charges générales."),
        ("3 · TA FACTURE", "180&nbsp;000&nbsp;€ × 2,5&nbsp;% = <b>4&nbsp;500&nbsp;€</b> pour toi."),
        ("4 · ATTENTION", "Ascenseur, chauffage&nbsp;: réparti <b>selon l'utilité</b> pour ton lot. Pas forcément 2,5&nbsp;%."),
    ],
    know=[
        ("OÙ LES TROUVER", "Tes tantièmes sont dans <b>l'état descriptif de division</b>.", "Il est annexé au règlement de copropriété."),
        ("ON LE FAIT POUR TOI", "Ta vraie part des travaux votés et à venir. <b>Rapport en 72&nbsp;h.</b>"),
    ],
    setup="""      const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ",", "=", "+"];
      document.getElementById("keys").innerHTML = KEYS.map((k, i) => `<div class="key${"÷×−=+".includes(k) ? " op" : ""}" id="key${i}" style="left: ${40 + (i % 4) * 160}px; top: ${310 + Math.floor(i / 4) * 106}px">${k}</div>`).join("");
      const lab = document.getElementById("lab"),
        num = document.getElementById("num");
      const sp = (n) => String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, "\\u00a0");""",
    js="""      const SCR = [
        ["TES TANTIÈMES", "250 / 10\\u00a0000", [10, 2, 12, 3]],
        ["TA PART", "2,5\\u00a0%", [14]],
        ["TA FACTURE", null, [7, 14]],
        ["ASCENSEUR, CHAUFFAGE", "≠ 2,5\\u00a0%", [15]],
      ];
      T.forEach((t, k) => {
        SCR[k][2].forEach((ki, j) => {
          tl.fromTo(`#key${ki}`, { scale: 1, backgroundColor: "#ffffff" }, { scale: 1, backgroundColor: ki === 3 || ki >= 14 || ki === 7 ? "#0a7a48" : "#3a4d45", duration: 0.25, immediateRender: false }, t - 0.4 + j * 0.1);
          tl.fromTo(`#key${ki}`, { scale: 0.88 }, { scale: 1, duration: 0.2, ease: "back.out(3)", immediateRender: false }, t - 0.4 + j * 0.1);
        });
        tl.set(lab, { textContent: SCR[k][0] }, t);
        if (SCR[k][1]) tl.set(num, { textContent: SCR[k][1] }, t);
        tl.fromTo("#screen", { backgroundColor: "#ffffff" }, { backgroundColor: "#c9f0d9", duration: 0.35, immediateRender: false }, t);
        shake("#calc", t, 6, 4);
      });
      const cnt = { v: 0 };
      tl.fromTo(cnt, { v: 0 }, { v: 4500, duration: 0.9, ease: "power2.out", immediateRender: false, onUpdate: () => (num.textContent = sp(Math.round(cnt.v / 10) * 10) + "\\u00a0€") }, T[2]);""",
    endtitle=["Calcule ta part", "avant de signer."],
    endacc="#7dffc0",
    endrgb="125, 255, 192",
)

# ---------------------------------------------------------------- 2. LE CALENDRIER DU DPE
SPECS["dpe"] = dict(
    comment="« LE CALENDRIER DU DPE » — vidéo utile : gel des loyers, interdictions de louer G / F / E, DPE collectif. 150 BPM (future bass).",
    bpm=150,
    T=T4,
    vars="""        --bg1: #ffffff;
        --bg2: #eef2f8;
        --bg3: #d5deec;
        --ink: #14213a;
        --acc: #d7221f;
        --pill: #14213a;
        --pillt: #ffd23f;
        --tipbg: #14213a;
        --tiph: #ffd23f;""",
    css="""      .dbar {
        position: absolute;
        left: 70px;
        height: 62px;
        border-radius: 0 31px 31px 0;
        color: #fff;
        font-size: 44px;
        font-weight: 900;
        line-height: 62px;
        padding-left: 22px;
      }
      .dtag {
        position: absolute;
        height: 62px;
        padding: 0 20px;
        border-radius: 14px;
        background: #14213a;
        color: #fff;
        font-size: 30px;
        font-weight: 900;
        line-height: 62px;
        white-space: nowrap;
        opacity: 0;
      }
      .dtag.x {
        background: #d7221f;
      }
      .strike {
        position: absolute;
        height: 8px;
        border-radius: 4px;
        background: #14213a;
        transform-origin: 0% 50%;
        transform: scaleX(0);
      }
      #line {
        left: 90px;
        top: 1085px;
        width: 810px;
        height: 8px;
        border-radius: 4px;
        background: #c3cee0;
      }
      .yr {
        position: absolute;
        top: 1110px;
        width: 140px;
        margin-left: -70px;
        text-align: center;
        font-size: 36px;
        font-weight: 900;
        color: #51617f;
      }
      .yd {
        position: absolute;
        top: 1077px;
        width: 24px;
        height: 24px;
        margin-left: -12px;
        border-radius: 50%;
        background: #c3cee0;
      }
      #mark {
        left: 0;
        top: 1063px;
        width: 52px;
        height: 52px;
        margin-left: -26px;
        border-radius: 50%;
        background: #d7221f;
        border: 8px solid #fff;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        opacity: 0;
      }
""",
    html="""        <div id="bars"></div>
        <div id="line" class="abs"></div>
        <div id="years"></div>
        <div id="mark" class="abs"></div>""",
    cap="DPE&nbsp;: le calendrier<br /><span class=\"a\">à connaître.</span>",
    count0="De A à G",
    countk="${[2022, 2025, 2028, 2034][k]}",
    tips=[
        ("DEPUIS AOÛT 2022 · F ET G", "Loyers <b>gelés</b>&nbsp;: interdit de les augmenter."),
        ("DEPUIS 2025 · LOGEMENTS G", "<b>Plus de nouveau bail</b> pour un logement classé G."),
        ("2028 · LOGEMENTS F", "Les F suivent&nbsp;: <b>plus de nouveau bail</b> non plus."),
        ("2034 · LOGEMENTS E", "Puis les E. Un appart E acheté aujourd'hui <b>sera concerné</b>."),
    ],
    know=[
        ("DPE COLLECTIF", "Obligatoire en copro&nbsp;: <b>2024</b> (+ de 200 lots), <b>2025</b> (50 à 200), <b>2026</b> (moins de 50).", "Il montre si l'immeuble entier est une passoire."),
        ("ON VÉRIFIE", "Le DPE de l'immeuble et les travaux d'isolation prévus. <b>72&nbsp;h.</b>"),
    ],
    k0style=' style="font-size: 44px"',
    k1top=980,
    setup="""      const L = ["A", "B", "C", "D", "E", "F", "G"];
      const C = ["#009c6d", "#52b153", "#a5cc74", "#e6d600", "#f0b50f", "#eb8235", "#d7221f"];
      const W = (i) => 220 + i * 50;
      const BY = (i) => 450 + i * 78;
      document.getElementById("bars").innerHTML =
        L.map((l, i) => `<div class="dbar" id="d${l}" style="top: ${BY(i)}px; width: ${W(i)}px; background: ${C[i]}${i > 0 && i < 6 ? "; color: #14213a" : ""}">${l}</div><div class="strike" id="s${l}" data-layout-allow-occlusion style="left: 130px; top: ${BY(i) + 27}px; width: ${W(i) - 50}px"></div>`).join("") +
        [["F", "Loyer gelé", 0], ["G", "Loyer gelé", 1], ["G", "Location interdite", 2, "x"], ["F", "Location interdite", 3, "x"], ["E", "Location interdite", 4, "x"]].map(([l, t, n, x]) => `<div class="dtag${x ? " x" : ""}" id="g${n}" style="left: ${70 + W(L.indexOf(l)) + 20}px; top: ${BY(L.indexOf(l))}px">${t}</div>`).join("");
      const YX = [150, 380, 610, 840];
      document.getElementById("years").innerHTML = [2022, 2025, 2028, 2034].map((y, k) => `<div class="yd" style="left: ${YX[k]}px"></div><div class="yr" id="y${k}" style="left: ${YX[k]}px">${y}</div>`).join("");""",
    js="""      tl.fromTo(".dbar", { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.25, ease: "power3.out", stagger: 0.06 }, 0.1);
      tl.set("#mark", { opacity: 1, x: YX[0] }, T[0] - 0.2);
      const TAGS = [[0, 1], [2], [3], [4]];
      const STR = [[], ["G"], ["F"], ["E"]];
      T.forEach((t, k) => {
        if (k) tl.to("#mark", { x: YX[k], duration: 0.45, ease: "power2.inOut" }, t - 0.45);
        tl.fromTo("#mark", { scale: 1.5 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
        tl.to(`#y${k}`, { color: "#14213a", scale: 1.15, duration: 0.2 }, t);
        if (k === 1) tl.to("#g1", { opacity: 0, duration: 0.15 }, t - 0.1);
        if (k === 2) tl.to("#g0", { opacity: 0, duration: 0.15 }, t - 0.1);
        TAGS[k].forEach((g, j) => tl.fromTo(`#g${g}`, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25, ease: "back.out(2)", immediateRender: false }, t + 0.1 + j * 0.12));
        STR[k].forEach((l) => {
          tl.to(`#s${l}`, { scaleX: 1, duration: 0.3, ease: "power2.out" }, t + 0.05);
          tl.to(`#d${l}`, { opacity: 0.45, duration: 0.3 }, t + 0.05);
        });
        flash(t, 0.25, 0.2);
      });""",
    endtitle=["Vérifie le DPE", "avant de signer."],
    endacc="#ffd23f",
    endrgb="255, 210, 63",
)

# ---------------------------------------------------------------- 3. LE PETIT DICO
SPECS["dico"] = dict(
    comment="« LE PETIT DICO DE LA COPRO » — vidéo utile : 5 mots à connaître avant d'acheter. 100 BPM (pop baroque, clavecin).",
    bpm=100,
    T=T5,
    vars="""        --bg1: #4a3a2a;
        --bg2: #33271b;
        --bg3: #1e160e;
        --ink: #fff7e6;
        --acc: #ffc94d;
        --pill: #ffc94d;
        --pillt: #2b1d0f;
        --tipbg: #2b1d0f;
        --tiph: #ffc94d;""",
    css="""      #page {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 830px;
        border-radius: 10px 26px 26px 10px;
        background: linear-gradient(90deg, #efe3c8 0%, #fbf5e6 6%, #fbf5e6 100%);
        border-left: 22px solid #a3241c;
        box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
        color: #2b1d0f;
        overflow: hidden;
      }
      .entry {
        position: absolute;
        left: 56px;
        right: 50px;
        top: 60px;
        opacity: 0;
      }
      .entry .w {
        font-size: 92px;
        font-weight: 900;
        letter-spacing: -0.05em;
        line-height: 0.95;
      }
      .entry .g {
        margin-top: 12px;
        font-size: 34px;
        font-weight: 700;
        font-style: italic;
        color: #a3241c;
      }
      .entry .d {
        margin-top: 28px;
        padding-top: 26px;
        border-top: 3px solid #2b1d0f;
        font-size: 46px;
        font-weight: 800;
        letter-spacing: -0.025em;
        line-height: 1.14;
      }
      .entry .e {
        margin-top: 26px;
        font-size: 32px;
        font-weight: 700;
        font-style: italic;
        color: #6b5a40;
        line-height: 1.2;
      }
      .entry.cover {
        top: 200px;
        text-align: center;
        opacity: 1;
      }
      .entry.cover .w {
        font-size: 84px;
      }
      #tab {
        left: 870px;
        top: 560px;
        width: 70px;
        height: 120px;
        border-radius: 0 18px 18px 0;
        background: #a3241c;
        color: #fff;
        font-size: 52px;
        font-weight: 900;
        line-height: 120px;
        text-align: center;
        z-index: 2;
      }
""",
    html="""        <div id="tab" class="abs">A</div>
        <div id="page" class="abs" data-layout-allow-overlap>
          <div class="entry cover" id="e0"><div class="w">Le petit dico<br />de la copro</div><div class="g">5 mots à connaître avant d'acheter</div></div>
          <div class="entry" id="e1"><div class="w">Syndic</div><div class="g">n. m.</div><div class="d">Le gestionnaire de la copro&nbsp;: comptes, entretien, assemblées.</div><div class="e">Élu par l'AG, pour 3&nbsp;ans maximum.</div></div>
          <div class="entry" id="e2"><div class="w">Conseil syndical</div><div class="g">n. m.</div><div class="d">Des copropriétaires élus qui assistent et contrôlent le syndic.</div><div class="e">Bénévoles, ils sont tes alliés&nbsp;: pose-leur tes questions.</div></div>
          <div class="entry" id="e3"><div class="w">Tantièmes</div><div class="g">n. m. pl.</div><div class="d">Ta part de l'immeuble. Elle fixe ta part des charges et le poids de ta voix en AG.</div><div class="e">Ex.&nbsp;: 250&nbsp;/&nbsp;10&nbsp;000 = 2,5&nbsp;%.</div></div>
          <div class="entry" id="e4"><div class="w">Fonds de travaux</div><div class="g">n. m.</div><div class="d">L'épargne obligatoire de la copro, alimentée chaque année pour les gros travaux.</div><div class="e">Au moins 5&nbsp;% du budget annuel.</div></div>
          <div class="entry" id="e5"><div class="w">PPPT</div><div class="g">n. m. · plan pluriannuel de travaux</div><div class="d">La liste des travaux à prévoir sur 10&nbsp;ans, avec leur coût estimé.</div><div class="e">Obligatoire progressivement depuis 2023.</div></div>
        </div>""",
    cap="La copro<br /><span class=\"a\">en 5 mots.</span>",
    count0="Ouvre le dico",
    countk="Mot ${k + 1}/5",
    tips=[],
    know=[
        ("UN MOT PAS CLAIR&nbsp;?", "Dans notre rapport, <b>tout est expliqué simplement</b>."),
        ("RAPPORT EN 72&nbsp;H", "Travaux, charges, risques&nbsp;: <b>ton dossier décodé.</b>"),
    ],
    setup="",
    js="""      const LET = ["S", "C", "T", "F", "P"];
      T.forEach((t, k) => {
        tl.to(`#e${k}`, { x: -260, opacity: 0, duration: 0.3, ease: "power2.in" }, t - 0.3);
        tl.fromTo(`#e${k + 1}`, { x: 260, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, t);
        tl.fromTo("#page", { rotationY: -10, transformPerspective: 1600, transformOrigin: "0% 50%" }, { rotationY: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, t - 0.1);
        tl.set("#tab", { textContent: LET[k] }, t);
        tl.fromTo("#tab", { y: -30 }, { y: k * 90, duration: 0.35, ease: "back.out(2)", immediateRender: false }, t);
      });""",
    endtitle=["Comprends tout", "avant de signer."],
    endacc="#ffc94d",
    endrgb="255, 201, 77",
)

# ---------------------------------------------------------------- 4. LE MICRO (5 questions)
SPECS["questions"] = dict(
    comment="« LE MICRO » — vidéo utile : 5 questions à poser avant d'acheter, et pourquoi. 84 BPM (néo-soul).",
    bpm=84,
    T=T5,
    vars="""        --bg1: #5a1f8c;
        --bg2: #2c0b4a;
        --bg3: #12041f;
        --ink: #ffffff;
        --acc: #ffd23f;
        --pill: #ffd23f;
        --pillt: #2c0b4a;
        --tipbg: #ffd23f;
        --tiph: #5a1f8c;""",
    css="""      #spot {
        left: 140px;
        top: 380px;
        width: 800px;
        height: 900px;
        background: radial-gradient(50% 60% at 50% 40%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 70%);
      }
      #mic {
        left: 760px;
        top: 360px;
        width: 140px;
        height: 240px;
        z-index: 3;
      }
      .q {
        position: absolute;
        left: 70px;
        right: 160px;
        top: 640px;
        padding: 40px 40px 46px;
        border-radius: 40px 40px 40px 8px;
        background: #fff;
        color: #2c0b4a;
        font-size: 64px;
        font-weight: 900;
        letter-spacing: -0.045em;
        line-height: 1.04;
        opacity: 0;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
      }
      .q small {
        display: block;
        font-size: 30px;
        letter-spacing: 0.08em;
        color: #8a4fd0;
        margin-bottom: 12px;
      }
      .tip {
        color: #2c0b4a;
      }
      .tip .x b {
        color: #5a1f8c;
      }
""",
    html="""        <div id="spot" class="abs"></div>
        <svg id="mic" class="abs" viewBox="0 0 140 240" data-layout-allow-overlap>
          <rect x="40" y="10" width="60" height="110" rx="30" fill="#d9d9e6" stroke="#fff" stroke-width="4" />
          <path d="M48 40h44M48 60h44M48 80h44" stroke="#8d8da6" stroke-width="4" />
          <path d="M24 90 Q24 150 70 150 Q116 150 116 90" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" />
          <path d="M70 150 V200 M40 205 H100" stroke="#fff" stroke-width="8" stroke-linecap="round" />
        </svg>
        <div class="q" id="q0"><small>QUESTION 1</small>Des travaux sont-ils votés ou prévus&nbsp;?</div>
        <div class="q" id="q1"><small>QUESTION 2</small>Combien de charges par an&nbsp;?</div>
        <div class="q" id="q2"><small>QUESTION 3</small>Y a-t-il une procédure en cours&nbsp;?</div>
        <div class="q" id="q3"><small>QUESTION 4</small>Combien dans le fonds de travaux&nbsp;?</div>
        <div class="q" id="q4"><small>QUESTION 5</small>Le syndic&nbsp;: pro ou bénévole&nbsp;? Depuis quand&nbsp;?</div>""",
    cap="5 questions à poser<br /><span class=\"a\">avant d'acheter.</span>",
    count0="Micro ouvert",
    countk="Question ${k + 1}/5",
    tips=[
        ("POURQUOI", "Demande les PV d'AG et le <b>plan pluriannuel de travaux</b>."),
        ("POURQUOI", "Le vendeur doit te donner les montants des <b>2 derniers exercices</b>."),
        ("POURQUOI", "Un procès peut coûter cher à <b>tous les copropriétaires</b>."),
        ("POURQUOI", "Cet argent <b>reste à la copro</b>, même quand le lot est vendu."),
        ("POURQUOI", "Beaucoup de changements de syndic = <b>signal d'alerte</b>."),
    ],
    know=[
        ("ET ENSUITE&nbsp;?", "Note les réponses… puis <b>vérifie-les dans les documents</b>."),
        ("ON S'EN CHARGE", "Chaque réponse contrôlée dans les PV et les comptes. <b>72&nbsp;h.</b>"),
    ],
    setup="",
    js="""      tl.to("#mic", { rotation: 6, duration: BEAT, yoyo: true, repeat: 20, ease: "sine.inOut", transformOrigin: "50% 100%" }, 0);
      T.forEach((t, k) => {
        if (k) tl.to(`#q${k - 1}`, { x: -120, opacity: 0, duration: 0.25, ease: "power2.in" }, t - 0.3);
        tl.fromTo(`#q${k}`, { scale: 0.6, opacity: 0, transformOrigin: "0% 100%" }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, t);
        tl.fromTo("#spot", { opacity: 1.6 }, { opacity: 1, duration: 0.4, immediateRender: false }, t);
      });""",
    endtitle=["Pose les bonnes", "questions."],
    endacc="#ffd23f",
    endrgb="255, 210, 63",
)

# ---------------------------------------------------------------- 5. LA LIGNE DE MÉTRO (étapes de l'achat)
SPECS["etapes"] = dict(
    comment="« LA LIGNE DE MÉTRO » — vidéo utile : de l'offre à l'acte, les 5 étapes de l'achat. 108 BPM (afrobeat).",
    bpm=108,
    T=T5,
    vars="""        --bg1: #ffffff;
        --bg2: #f1f0ea;
        --bg3: #dcd9cc;
        --ink: #1b1b22;
        --acc: #7b2ff7;
        --pill: #7b2ff7;
        --pillt: #ffffff;
        --tipbg: #1b1b22;
        --tiph: #c9a8ff;""",
    css="""      #track {
        left: 136px;
        top: 500px;
        width: 28px;
        height: 640px;
        border-radius: 14px;
        background: #d8d2f0;
      }
      #fill {
        left: 136px;
        top: 500px;
        width: 28px;
        height: 640px;
        border-radius: 14px;
        background: #7b2ff7;
        transform-origin: 50% 0%;
        transform: scaleY(0);
      }
      .st {
        position: absolute;
        left: 116px;
        width: 68px;
        height: 68px;
        border-radius: 50%;
        background: #fff;
        border: 12px solid #d8d2f0;
      }
      .sl {
        position: absolute;
        left: 220px;
        right: 160px;
        font-size: 46px;
        font-weight: 900;
        letter-spacing: -0.035em;
        line-height: 1;
        color: #6f6b84;
      }
      .sl small {
        display: block;
        margin-bottom: 6px;
        font-size: 26px;
        letter-spacing: 0.08em;
        color: #6f6b84;
      }
      #train {
        left: 104px;
        top: 0;
        width: 92px;
        height: 92px;
        border-radius: 26px;
        background: #1b1b22;
        color: #fff;
        font-size: 46px;
        font-weight: 900;
        line-height: 92px;
        text-align: center;
        z-index: 3;
        opacity: 0;
      }
""",
    html="""        <div id="track" class="abs"></div>
        <div id="fill" class="abs"></div>
        <div id="stations"></div>
        <div id="train" class="abs">M</div>""",
    cap="Acheter un appart&nbsp;:<br /><span class=\"a\">les 5 étapes.</span>",
    count0="Ligne de l'achat",
    countk="Station ${k + 1}/5",
    tips=[
        ("1 · OFFRE D'ACHAT", "Tu proposes un prix par écrit. Le vendeur <b>accepte… ou non</b>."),
        ("2 · COMPROMIS", "Les documents de la copro y sont joints&nbsp;: <b>PV, charges, règlement</b>."),
        ("3 · RÉTRACTATION", "<b>10 jours</b> pour renoncer, sans te justifier."),
        ("4 · PRÊT", "Condition suspensive&nbsp;: <b>au moins 1 mois</b> pour l'obtenir. Prêt refusé = dépôt rendu."),
        ("5 · ACTE CHEZ LE NOTAIRE", "En général <b>environ 3 mois</b> après le compromis. Les clés&nbsp;!"),
    ],
    know=[
        ("LE BON MOMENT", "Fais analyser la copro <b>avant le compromis</b>… ou pendant les 10 jours."),
        ("RAPPORT EN 72&nbsp;H", "Assez rapide pour <b>décider à temps</b>."),
    ],
    setup="""      const SY = [500, 640, 780, 920, 1060];
      const SN = ["Offre d'achat", "Compromis de vente", "10 jours de rétractation", "Accord du prêt", "Acte chez le notaire"];
      document.getElementById("stations").innerHTML = SY.map((y, k) => `<div class="st" id="st${k}" style="top: ${y + 2}px"></div><div class="sl" id="sl${k}" style="top: ${y + 4}px"><small>STATION ${k + 1}</small>${SN[k]}</div>`).join("");""",
    js="""      tl.set("#train", { opacity: 1, y: SY[0] - 10 }, 0);
      T.forEach((t, k) => {
        if (k) {
          tl.to("#train", { y: SY[k] - 10, duration: 0.55, ease: "power2.inOut" }, t - 0.55);
          tl.to("#fill", { scaleY: (SY[k] - 500 + 36) / 640, duration: 0.55, ease: "power2.inOut" }, t - 0.55);
        }
        tl.to(`#st${k}`, { borderColor: "#7b2ff7", duration: 0.2 }, t);
        tl.to([`#sl${k}`, `#sl${k} small`], { color: "#1b1b22", duration: 0.2 }, t);
        tl.fromTo(`#st${k}`, { scale: 1.4 }, { scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t);
        tl.fromTo(`#sl${k}`, { x: 20 }, { x: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, t);
      });""",
    endtitle=["Analyse la copro", "au bon moment."],
    endacc="#c9a8ff",
    endrgb="201, 168, 255",
)
