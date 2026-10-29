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
          <div id="screen"><div id="lab">COUR INTÉRIEURE À REFAIRE</div><div id="num">75&nbsp;000&nbsp;€</div></div>
          <div id="keys"></div>
        </div>""",
    cap="Travaux votés&nbsp;:<br /><span class=\"a\">combien tu paies&nbsp;?</span>",
    count0="Exemple · cour intérieure",
    countk="Étape ${k + 1}/4",
    tips=[
        ("1 · TES TANTIÈMES", "Ta part de l'immeuble, en millièmes ou dix-millièmes. Ici&nbsp;: <b>380 / 10&nbsp;000</b>."),
        ("2 · TON POURCENTAGE", "380 sur 10&nbsp;000, c'est <b>3,8&nbsp;%</b> des charges générales."),
        ("3 · TA FACTURE", "75&nbsp;000&nbsp;€ × 3,8&nbsp;% = <b>2&nbsp;850&nbsp;€</b> pour toi."),
        ("4 · CHARGES SPÉCIALES", "Travaux d'un seul bâtiment&nbsp;: si le règlement le prévoit, <b>seuls ses lots paient</b>."),
    ],
    know=[
        ("OÙ LES TROUVER", "Tes tantièmes sont dans <b>l'état descriptif de division</b>.", "Le numéro de ton lot y figure aussi."),
        ("LE RÉFLEXE", "Pour chaque chantier annoncé, <b>multiplie par tes tantièmes</b>. Tu connais ta facture."),
    ],
    setup="""      const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ",", "=", "+"];
      document.getElementById("keys").innerHTML = KEYS.map((k, i) => `<div class="key${"÷×−=+".includes(k) ? " op" : ""}" id="key${i}" style="left: ${40 + (i % 4) * 160}px; top: ${310 + Math.floor(i / 4) * 106}px">${k}</div>`).join("");
      const lab = document.getElementById("lab"),
        num = document.getElementById("num");
      const sp = (n) => String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, "\\u00a0");""",
    js="""      const SCR = [
        ["TES TANTIÈMES", "380 / 10\\u00a0000", [10, 5, 12, 3]],
        ["TA PART", "3,8\\u00a0%", [14]],
        ["TA FACTURE", null, [7, 14]],
        ["TRAVAUX DU BÂT. B · TOI AU A", "0\\u00a0€", [15]],
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
      tl.fromTo(cnt, { v: 0 }, { v: 2850, duration: 0.9, ease: "power2.out", immediateRender: false, onUpdate: () => (num.textContent = sp(Math.round(cnt.v / 10) * 10) + "\\u00a0€") }, T[2]);""",
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
        ("AVANT D'ACHETER POUR LOUER", "Regarde la lettre du DPE <b>et l'année</b> où elle sera interdite."),
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
          <div class="entry" id="e3"><div class="w">Parties communes</div><div class="g">n. f. pl.</div><div class="d">Ce qui appartient à tous les copropriétaires&nbsp;: toit, façade, hall, escaliers, canalisations communes.</div><div class="e">Leur entretien est payé par tous.</div></div>
          <div class="entry" id="e4"><div class="w">Appel de fonds</div><div class="g">n. m.</div><div class="d">La demande de paiement envoyée par le syndic pour couvrir le budget ou des travaux.</div><div class="e">Pour le budget, en général un par trimestre.</div></div>
          <div class="entry" id="e5"><div class="w">PPPT</div><div class="g">n. m. · plan pluriannuel de travaux</div><div class="d">La liste des travaux à prévoir sur 10&nbsp;ans, avec leur coût estimé.</div><div class="e">Obligatoire progressivement depuis 2023.</div></div>
        </div>""",
    cap="La copro<br /><span class=\"a\">en 5 mots.</span>",
    count0="Ouvre le dico",
    countk="Mot ${k + 1}/5",
    tips=[],
    know=[
        ("UN MOT PAS CLAIR&nbsp;?", "Dans notre rapport, <b>tout est expliqué simplement</b>."),
        ("LE RÉFLEXE", "Garde ces 5 mots en tête pour <b>ta prochaine visite</b>."),
    ],
    setup="",
    js="""      const LET = ["S", "C", "P", "A", "P"];
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
        <div class="q" id="q0"><small>QUESTION 1</small>Le chauffage est-il collectif&nbsp;?</div>
        <div class="q" id="q1"><small>QUESTION 2</small>La cave et le parking font-ils partie du lot&nbsp;?</div>
        <div class="q" id="q2"><small>QUESTION 3</small>Quand a eu lieu la dernière AG&nbsp;?</div>
        <div class="q" id="q3"><small>QUESTION 4</small>Que permet le règlement de copro&nbsp;?</div>
        <div class="q" id="q4"><small>QUESTION 5</small>Combien de lots dans l'immeuble&nbsp;?</div>""",
    cap="5 questions à poser<br /><span class=\"a\">avant d'acheter.</span>",
    count0="Micro ouvert",
    countk="Question ${k + 1}/5",
    tips=[
        ("POURQUOI", "Collectif = il est <b>dans tes charges</b>. Demande son coût sur la dernière année."),
        ("POURQUOI", "Vérifie leurs <b>numéros de lot</b> dans le compromis. Sinon, ils ne sont pas vendus avec."),
        ("POURQUOI", "L'AG doit se tenir <b>au moins une fois par an</b>. Sinon, la copro est mal tenue."),
        ("POURQUOI", "Activité pro, store, enseigne&nbsp;: <b>ce qui est permis y est écrit</b>."),
        ("POURQUOI", "Peu de lots = chaque chantier <b>pèse plus lourd</b> sur ta part."),
    ],
    know=[
        ("ET ENSUITE&nbsp;?", "Demande des <b>réponses écrites</b>, pas seulement à l'oral."),
        ("ON S'EN CHARGE", "On <b>recoupe chaque réponse</b> avec les documents de la copro."),
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
        ("ASTUCE", "Demande les documents de la copro <b>dès l'offre acceptée</b>&nbsp;: tu gagnes des jours."),
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

# ================================================================ SÉRIE « PENDANT LA VISITE »

# ---------------------------------------------------------------- 6. LE REZ-DE-CHAUSSÉE COMMERÇANT
SPECS["rdc"] = dict(
    comment="« LE REZ-DE-CHAUSSÉE » — vidéo utile pendant la visite : un commerce en bas, ce qu'il faut regarder. 98 BPM (dembow).",
    bpm=98,
    T=T4,
    vars="""        --bg1: #fff4ec;
        --bg2: #ffd9c2;
        --bg3: #f2b08c;
        --ink: #2a1206;
        --acc: #c2410c;
        --pill: #2a1206;
        --pillt: #ffb27a;
        --tipbg: #2a1206;
        --tiph: #ffb27a;""",
    css="""      #fac {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 750px;
      }
      #sign {
        left: 230px;
        top: 966px;
        width: 530px;
        height: 48px;
        border-radius: 8px;
        background: #2a1206;
        color: #fff;
        font-size: 32px;
        font-weight: 900;
        letter-spacing: 0.1em;
        line-height: 48px;
        text-align: center;
        z-index: 2;
      }
      #clock {
        left: 120px;
        top: 470px;
        padding: 10px 22px;
        border-radius: 16px;
        background: #14213a;
        color: #ffd23f;
        font-size: 44px;
        font-weight: 900;
        font-variant-numeric: tabular-nums;
        opacity: 0;
        z-index: 3;
      }
""",
    html="""        <svg id="fac" class="abs" viewBox="0 0 850 750" data-layout-allow-overlap></svg>
        <div id="sign" class="abs">À VENDRE · T3 AU 1ᵉʳ</div>
        <div id="clock" class="abs">4&nbsp;h&nbsp;00</div>""",
    cap="Un commerce en bas&nbsp;?<br /><span class=\"a\">Regarde ça.</span>",
    count0="Visite · façade",
    countk="Commerce ${k + 1}/4",
    tips=[
        ("RESTAURANT", "Odeurs et <b>gaine d'extraction</b>&nbsp;: regarde par où elle monte, façade ou cour."),
        ("BOULANGERIE", "Le fournil démarre souvent <b>avant l'aube</b>&nbsp;: bruit et chaleur au 1ᵉʳ étage."),
        ("SUPÉRETTE", "<b>Livraisons et rideau métallique</b> tôt le matin, parfois tous les jours."),
        ("LES POUBELLES DU COMMERCE", "Où sont-elles stockées&nbsp;? Souvent <b>dans la cour</b>, sous les fenêtres."),
    ],
    know=[
        ("LE RÈGLEMENT", "Il fixe la <b>destination de l'immeuble</b>&nbsp;: les activités admises y sont écrites."),
        ("LE TEST", "Repasse devant <b>un samedi soir et un matin tôt</b>."),
    ],
    setup="""      let f = `<rect x="120" y="40" width="610" height="710" fill="#f3e1c6" stroke="#2a1206" stroke-width="5"/>`;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) f += `<rect x="${160 + c * 140}" y="${80 + r * 112}" width="90" height="76" rx="6" fill="#bfe3ff" stroke="#2a1206" stroke-width="4"/>`;
      f += `<rect x="160" y="580" width="530" height="170" fill="#9fd3ff" stroke="#2a1206" stroke-width="5"/><path d="M425 580V750" stroke="#2a1206" stroke-width="5"/>`;
      const AW = ["#c2410c", "#b45309", "#15803d", "#475569"];
      AW.forEach((c, k) => {
        let a = "";
        for (let i = 0; i < 8; i++) a += `<path d="M${150 + i * 69} 528 h69 l-8 44 h-53 z" fill="${i % 2 ? "#fff" : c}" stroke="#2a1206" stroke-width="3"/>`;
        f += `<g id="aw${k}" opacity="${k ? 0 : 1}">${a}</g>`;
      });
      // restaurant : gaine + fumée
      f += `<g id="fx0" opacity="0"><rect x="736" y="20" width="40" height="560" fill="#9aa3ad" stroke="#2a1206" stroke-width="4"/>`;
      for (let i = 0; i < 3; i++) f += `<path id="sm${i}" d="M${745 + i * 10} 10 q-20 -30 0 -60 q20 -30 0 -60" stroke="#8a8f99" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.7"/>`;
      f += `</g>`;
      // boulangerie : lune + chaleur
      f += `<g id="fx1" opacity="0"><circle cx="790" cy="90" r="40" fill="#fff6c2"/><circle cx="805" cy="80" r="36" fill="#ffd9c2"/>`;
      for (let i = 0; i < 4; i++) f += `<path d="M${220 + i * 120} 520 q-12 -24 0 -48 q12 -24 0 -48" stroke="#ef4444" stroke-width="6" fill="none" opacity="0.6"/>`;
      f += `</g>`;
      // supérette : camion + rideau
      f += `<g id="fx2" opacity="0"><g id="truck"><rect x="-10" y="610" width="300" height="120" rx="12" fill="#e5e7eb" stroke="#2a1206" stroke-width="4"/><rect x="290" y="650" width="90" height="80" rx="10" fill="#cbd5e1" stroke="#2a1206" stroke-width="4"/><circle cx="70" cy="738" r="22" fill="#2a1206"/><circle cx="320" cy="738" r="22" fill="#2a1206"/></g>`;
      for (let i = 0; i < 7; i++) f += `<rect x="430" y="${585 + i * 24}" width="255" height="16" fill="#94a3b8"/>`;
      f += `</g>`;
      // poubelles
      f += `<g id="fx3" opacity="0">`;
      for (let i = 0; i < 4; i++) f += `<rect x="${200 + i * 120}" y="640" width="90" height="110" rx="8" fill="${["#15803d", "#ca8a04", "#475569", "#15803d"][i]}" stroke="#2a1206" stroke-width="4"/><rect x="${194 + i * 120}" y="628" width="102" height="18" rx="6" fill="#2a1206"/>`;
      f += `</g>`;
      document.getElementById("fac").innerHTML = f;""",
    js="""      const SIGN = ["RESTAURANT", "BOULANGERIE", "SUPÉRETTE", "LA COUR · POUBELLES"];
      T.forEach((t, k) => {
        if (k) {
          tl.to(`#aw${k - 1}`, { opacity: 0, duration: 0.2 }, t - 0.2);
          tl.to(`#fx${k - 1}`, { opacity: 0, duration: 0.2 }, t - 0.2);
        }
        tl.to(`#aw${k}`, { opacity: 1, duration: 0.2 }, t);
        tl.to(`#fx${k}`, { opacity: 1, duration: 0.3 }, t);
        tl.set("#sign", { textContent: SIGN[k] }, t);
        tl.fromTo("#sign", { scale: 1.2 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
        shake("#fac", t, 6, 4);
      });
      for (let i = 0; i < 3; i++) tl.fromTo(`#sm${i}`, { y: 20, opacity: 0.8 }, { y: -40, opacity: 0, duration: 1.2, repeat: 2, ease: "none", immediateRender: false }, T[0] + 0.2 + i * 0.35);
      tl.to("#clock", { opacity: 1, duration: 0.2 }, T[1]);
      tl.to("#clock", { opacity: 0, duration: 0.2 }, T[2] - 0.2);
      tl.fromTo("#truck", { x: -420 }, { x: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, T[2]);""",
    endtitle=["Regarde le rez-de-chaussée", "avant de signer."],
    endacc="#ffb27a",
    endrgb="255, 178, 122",
)

# ---------------------------------------------------------------- 7. LES BOÎTES AUX LETTRES
SPECS["boites"] = dict(
    comment="« LES BOÎTES AUX LETTRES » — vidéo utile pendant la visite : un immeuble plein de locataires, ce que ça change. 112 BPM (city pop).",
    bpm=112,
    T=T4,
    vars="""        --bg1: #f5f3ff;
        --bg2: #e2ddf7;
        --bg3: #c6bde8;
        --ink: #1e1640;
        --acc: #6d28d9;
        --pill: #1e1640;
        --pillt: #c4b5fd;
        --tipbg: #1e1640;
        --tiph: #c4b5fd;""",
    css="""      #wall {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 700px;
      }
      .mb {
        position: absolute;
        width: 196px;
        height: 152px;
        border-radius: 10px;
        background: linear-gradient(#b9bfcc, #9aa1b1);
        border: 4px solid #4b5163;
      }
      .mb .slot {
        position: absolute;
        left: 30px;
        right: 30px;
        top: 26px;
        height: 14px;
        border-radius: 7px;
        background: #2b2f3a;
      }
      .mb .lb {
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 22px;
        height: 48px;
        border-radius: 4px;
        background: #e9e4d8;
        color: #2b2f3a;
        font-size: 26px;
        font-weight: 800;
        line-height: 48px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
      }
      .mb .lb.tape {
        background: #fff3a6;
        transform: rotate(-4deg);
        font-style: italic;
      }
      .mb.hot {
        box-shadow: 0 0 0 6px #6d28d9;
      }
      #alouer {
        left: 560px;
        top: 1040px;
        padding: 14px 26px;
        border-radius: 10px;
        background: #dc2626;
        color: #fff;
        font-size: 46px;
        font-weight: 900;
        transform: rotate(-6deg);
        opacity: 0;
        z-index: 3;
      }
      #ratio {
        left: 120px;
        top: 760px;
        padding: 24px 40px;
        border-radius: 26px;
        background: #1e1640;
        color: #fff;
        font-size: 84px;
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1;
        text-align: center;
        opacity: 0;
        z-index: 3;
      }
      #ratio small {
        display: block;
        margin-top: 8px;
        font-size: 32px;
        letter-spacing: 0;
        color: #c4b5fd;
      }
      #vote {
        left: 150px;
        top: 700px;
        width: 700px;
        padding: 30px 36px;
        border-radius: 26px;
        background: #fff;
        color: #1e1640;
        opacity: 0;
        z-index: 4;
        box-shadow: 0 30px 70px rgba(30, 22, 64, 0.35);
      }
      #vote .h {
        font-size: 28px;
        font-weight: 900;
        letter-spacing: 0.08em;
        color: #6d28d9;
      }
      #vote .bar {
        margin-top: 18px;
        height: 44px;
        border-radius: 22px;
        background: #e2ddf7;
        overflow: hidden;
      }
      #vote .fill {
        width: 34%;
        height: 100%;
        border-radius: 22px;
        background: #6d28d9;
        transform-origin: 0% 50%;
      }
      #vote .x {
        margin-top: 14px;
        font-size: 44px;
        font-weight: 900;
        letter-spacing: -0.03em;
      }
""",
    html="""        <div id="wall" class="abs" data-layout-allow-occlusion data-layout-allow-overlap></div>
        <div id="alouer" class="abs" data-layout-allow-overlap>À LOUER</div>
        <div id="ratio" class="abs" data-layout-allow-overlap data-layout-allow-occlusion>9 / 16<small>boîtes aux noms scotchés</small></div>
        <div id="vote" class="abs" data-layout-allow-overlap data-layout-allow-occlusion><div class="h">EXEMPLE · DERNIÈRE AG</div><div class="bar"><div class="fill" id="vfill"></div></div><div class="x">34&nbsp;% des tantièmes représentés</div></div>""",
    cap="Un immeuble<br /><span class=\"a\">plein de locataires&nbsp;?</span>",
    count0="Hall · boîtes aux lettres",
    countk="Indice ${k + 1}/4",
    tips=[
        ("NOMS SCOTCHÉS", "Étiquettes à la main, plusieurs noms&nbsp;: souvent des <b>locataires qui changent</b>."),
        ("« À LOUER »", "Annonces dans le hall ou aux fenêtres&nbsp;: <b>beaucoup de logements loués</b>."),
        ("PROPRIÉTAIRES ABSENTS", "Des bailleurs qui vivent loin <b>viennent moins aux AG</b> et suivent moins l'immeuble."),
        ("CONSÉQUENCE", "Peu de votants&nbsp;: <b>décisions plus dures à prendre</b>, entretien qui traîne."),
    ],
    know=[
        ("LA PREUVE", "Le procès-verbal d'AG indique <b>qui était présent ou représenté</b>&nbsp;: regarde le total."),
        ("BON SIGNE", "Beaucoup de propriétaires <b>qui habitent sur place</b>&nbsp;: immeuble souvent mieux suivi."),
    ],
    setup="""      const NAMES = ["Martin", "Petit / Ba", "Leroy", "Colin + Kaya", "Faure", "Nguyen ?", "Ap. 7 · Sam", "Morel", "Diallo / W.", "Ap. 10", "Garnier", "Lucie & Tom", "Chevalier", "Ap. 14 · ?", "R. + J.", "Lemoine"];
      const TAPE = [1, 3, 5, 6, 8, 9, 11, 13, 14];
      document.getElementById("wall").innerHTML = NAMES.map((n, i) => `<div class="mb" id="mb${i}" style="left: ${(i % 4) * 218}px; top: ${Math.floor(i / 4) * 172}px"><div class="slot"></div><div class="lb${TAPE.includes(i) ? " tape" : ""}">${n}</div></div>`).join("");""",
    js="""      T.forEach((t, k) => shake("#wall", t, 5, 3));
      TAPE.forEach((i, j) => {
        tl.set(`#mb${i}`, { className: "mb hot" }, T[0] + j * 0.08);
        tl.fromTo(`#mb${i}`, { scale: 1.08 }, { scale: 1, duration: 0.25, ease: "back.out(3)", immediateRender: false }, T[0] + j * 0.08);
      });
      tl.fromTo("#alouer", { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: "power4.in", immediateRender: false }, T[1]);
      tl.to("#alouer", { opacity: 0, duration: 0.2 }, T[2] - 0.2);
      tl.to("#wall", { opacity: 0.3, duration: 0.3 }, T[2]);
      tl.fromTo("#ratio", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, T[2]);
      tl.to("#ratio", { opacity: 0, duration: 0.2 }, T[3] - 0.2);
      tl.fromTo("#vote", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T[3]);
      tl.fromTo("#vfill", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out", immediateRender: false }, T[3] + 0.3);""",
    endtitle=["Regarde qui vit là", "avant de signer."],
    endacc="#c4b5fd",
    endrgb="196, 181, 253",
)

# ---------------------------------------------------------------- 8. LES PARTIES COMMUNES PARLENT
SPECS["escalier"] = dict(
    comment="« LES PARTIES COMMUNES PARLENT » — vidéo utile pendant la visite : 4 détails de la cage d'escalier. 160 BPM (ska).",
    bpm=160,
    T=T4,
    vars="""        --bg1: #f7faf5;
        --bg2: #dfe9d8;
        --bg3: #bccdb1;
        --ink: #17260f;
        --acc: #0f5f2d;
        --pill: #17260f;
        --pillt: #bef264;
        --tipbg: #17260f;
        --tiph: #bef264;""",
    css="""      #scene {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 750px;
        border-radius: 26px;
        overflow: hidden;
        box-shadow: 0 30px 70px rgba(23, 38, 15, 0.3);
      }
      #loupe {
        left: 0;
        top: 0;
        width: 200px;
        height: 200px;
        margin: -100px 0 0 -100px;
        border-radius: 50%;
        border: 14px solid #17260f;
        box-shadow: 0 0 0 9999px rgba(23, 38, 15, 0.18), inset 0 0 0 6px rgba(255, 255, 255, 0.6);
        opacity: 0;
        z-index: 3;
      }
      #note {
        left: 470px;
        top: 690px;
        width: 150px;
        padding: 8px 10px;
        background: #fff;
        color: #17260f;
        font-size: 28px;
        font-weight: 800;
        line-height: 1.1;
        text-align: center;
        transform: rotate(3deg);
        z-index: 2;
      }
""",
    html="""        <svg id="scene" class="abs" viewBox="0 0 850 750" data-layout-allow-overlap></svg>
        <div id="note" class="abs">Note syndic<br />mars 2023</div>
        <div id="loupe" class="abs" data-layout-allow-overlap></div>""",
    cap="Les parties communes<br /><span class=\"a\">parlent.</span>",
    count0="Cage d'escalier",
    countk="Détail ${k + 1}/4",
    tips=[
        ("AMPOULES GRILLÉES", "Grillées depuis longtemps&nbsp;? <b>L'entretien courant n'est pas suivi.</b>"),
        ("LE TABLEAU D'AFFICHAGE", "Dernière note du syndic il y a 2&nbsp;ans&nbsp;? <b>Il est peu présent.</b>"),
        ("L'EXTINCTEUR", "S'il y en a un, lis <b>la date de sa dernière vérification</b> sur l'étiquette."),
        ("TACHES AU PLAFOND", "Trace d'eau dans l'escalier&nbsp;: demande <b>si la fuite a été réparée</b>."),
    ],
    know=[
        ("LE RÉFLEXE", "Monte <b>jusqu'au dernier étage</b>, même si l'appart est au 1ᵉʳ."),
        ("À DEMANDER", "Le <b>contrat de ménage</b> de l'immeuble&nbsp;: qui nettoie, et à quel rythme&nbsp;?"),
    ],
    setup="""      let e = `<rect width="850" height="750" fill="#efe6d6"/><rect width="850" height="60" fill="#f7f1e6"/>`;
      e += `<path d="M180 30 q40 -14 90 6 q40 20 70 0 q-10 30 -60 34 q-60 6 -100 -40z" fill="#b08a5a" opacity="0.55"/>`;
      // escalier en zigzag
      for (let i = 0; i < 9; i++) e += `<rect x="${380 + i * 52}" y="${700 - i * 46}" width="52" height="${50 + i * 46}" fill="#c9b9a0" stroke="#8a7458" stroke-width="3"/>`;
      e += `<path d="M380 640 L848 230" stroke="#5a4636" stroke-width="10"/>`;
      for (let i = 0; i < 9; i++) e += `<path d="M${400 + i * 52} ${626 - i * 46} v70" stroke="#5a4636" stroke-width="5"/>`;
      // lampe
      e += `<path d="M640 60 v40" stroke="#17260f" stroke-width="5"/><circle cx="640" cy="118" r="24" fill="#d1d5db" stroke="#17260f" stroke-width="4"/><path d="M628 106 l24 24 M652 106 l-24 24" stroke="#17260f" stroke-width="4"/>`;
      // extincteur
      e += `<rect x="96" y="380" width="56" height="130" rx="18" fill="#dc2626" stroke="#17260f" stroke-width="4"/><rect x="108" y="360" width="32" height="26" fill="#17260f"/><rect x="104" y="430" width="40" height="34" fill="#fff"/>`;
      // tableau d'affichage
      e += `<rect x="370" y="210" width="230" height="170" rx="8" fill="#c08a52" stroke="#5a4636" stroke-width="5"/>`;
      // porte
      e += `<rect x="190" y="420" width="150" height="330" fill="#8a5a2b" stroke="#17260f" stroke-width="4"/><circle cx="316" cy="590" r="8" fill="#ffd23f"/>`;
      document.getElementById("scene").innerHTML = e;""",
    js="""      const SPOT = [[640 + 70, 118 + 450], [485 + 70, 300 + 450], [124 + 70, 445 + 450], [250 + 70, 40 + 450]];
      tl.set("#loupe", { opacity: 1, x: SPOT[0][0], y: SPOT[0][1] }, T[0] - 0.3);
      T.forEach((t, k) => {
        if (k) tl.to("#loupe", { x: SPOT[k][0], y: SPOT[k][1], duration: 0.5, ease: "power2.inOut" }, t - 0.5);
        tl.fromTo("#loupe", { scale: 1.3 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
      });
      tl.to("#loupe", { opacity: 0, duration: 0.2 }, 19.6);""",
    endtitle=["Écoute les parties", "communes."],
    endacc="#bef264",
    endrgb="190, 242, 100",
)

# ---------------------------------------------------------------- 9. VISITER À 5 MOMENTS
SPECS["moments"] = dict(
    comment="« VISITER À 5 MOMENTS » — vidéo utile : ce qu'on découvre selon l'heure de la visite. 76 BPM (reggae one drop).",
    bpm=76,
    T=T5,
    vars="""        --bg1: #fffbea;
        --bg2: #fde9a8;
        --bg3: #f5cf63;
        --ink: #241a03;
        --acc: #b45309;
        --pill: #241a03;
        --pillt: #fde68a;
        --tipbg: #241a03;
        --tiph: #fde68a;""",
    css="""      #tint {
        background: #0b1530;
        opacity: 0;
      }
      #clk {
        left: 240px;
        top: 470px;
        width: 600px;
        height: 600px;
        z-index: 2;
      }
      #when {
        left: 70px;
        right: 160px;
        top: 1100px;
        text-align: center;
        font-size: 64px;
        font-weight: 900;
        letter-spacing: -0.04em;
        z-index: 2;
      }
      #rain {
        opacity: 0;
        z-index: 1;
      }
      #main .cap,
      #count {
        z-index: 6;
      }
""",
    html="""        <div id="tint" class="clip" data-layout-allow-overlap></div>
        <svg id="rain" class="clip" viewBox="0 0 1080 1920" data-layout-allow-overlap></svg>
        <svg id="clk" class="abs" viewBox="-300 -300 600 600"></svg>
        <div id="when" class="abs">Quand visiter&nbsp;?</div>""",
    cap="Visite un appart<br /><span class=\"a\">à 5 moments.</span>",
    count0="Horloge",
    countk="Moment ${k + 1}/5",
    tips=[
        ("8 H EN SEMAINE", "Trafic, école, bus&nbsp;: <b>écoute la rue</b> fenêtres fermées."),
        ("13 H", "Regarde la <b>vraie lumière</b> dans chaque pièce."),
        ("20 H", "Les voisins sont rentrés&nbsp;: pas, voix, télé. <b>Ça teste l'isolation.</b>"),
        ("SAMEDI 23 H", "Terrasses, fêtes, stationnement&nbsp;: <b>le vrai bruit du week-end</b>."),
        ("UN JOUR DE PLUIE", "Regarde le bas des fenêtres et les murs&nbsp;: <b>traces d'eau&nbsp;?</b>"),
    ],
    know=[
        ("ASTUCE", "Demande une <b>2ᵉ visite à une autre heure</b>&nbsp;: un vendeur serein accepte."),
        ("LA BOUSSOLE", "Sors la boussole du téléphone&nbsp;: <b>plein sud = plus de soleil</b>."),
    ],
    setup="""      let c = `<circle r="280" fill="#fff" stroke="#241a03" stroke-width="16"/>`;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        c += `<path d="M${(Math.sin(a) * 240).toFixed(1)} ${(-Math.cos(a) * 240).toFixed(1)} L${(Math.sin(a) * 265).toFixed(1)} ${(-Math.cos(a) * 265).toFixed(1)}" stroke="#241a03" stroke-width="${i % 3 ? 6 : 12}" stroke-linecap="round"/>`;
      }
      c += `<path id="hh" d="M0 20 V-150" stroke="#241a03" stroke-width="20" stroke-linecap="round"/><path id="mh" d="M0 30 V-220" stroke="#b45309" stroke-width="10" stroke-linecap="round"/><circle r="16" fill="#241a03"/>`;
      document.getElementById("clk").innerHTML = c;
      let r = "";
      for (let i = 0; i < 80; i++) r += `<path d="M${(rnd(i, 1) * 1080).toFixed(0)} ${(rnd(i, 2) * 1920).toFixed(0)} l-18 54" stroke="#93c5fd" stroke-width="4" opacity="0.7"/>`;
      document.getElementById("rain").innerHTML = r;""",
    js="""      const H = [8, 13, 20, 23, 16];
      const WHEN = ["8 h · semaine", "13 h", "20 h", "Samedi 23 h", "Un jour de pluie"];
      const NIGHT = [0, 0, 0.55, 0.75, 0.25];
      let prev = 0;
      T.forEach((t, k) => {
        const hourDeg = 360 * Math.ceil(prev / 360) + ((H[k] % 12) / 12) * 360;
        tl.to("#hh", { rotation: hourDeg, svgOrigin: "0 0", duration: 0.6, ease: "power2.inOut" }, t - 0.6);
        tl.to("#mh", { rotation: 360 * (k + 1) * 3, svgOrigin: "0 0", duration: 0.6, ease: "power2.inOut" }, t - 0.6);
        prev = hourDeg;
        tl.to("#tint", { opacity: NIGHT[k], duration: 0.5 }, t - 0.5);
        tl.set("#when", { textContent: WHEN[k], color: NIGHT[k] > 0.4 ? "#ffffff" : "#241a03" }, t);
        tl.fromTo("#when", { scale: 1.2 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
        tl.set("#main .cap", { color: NIGHT[k] > 0.4 ? "#ffffff" : "#241a03" }, t - 0.2);
        tl.set("#main .cap .a", { color: NIGHT[k] > 0.4 ? "#fde68a" : "#b45309" }, t - 0.2);
      });
      tl.to("#rain", { opacity: 1, duration: 0.3 }, T[4]);
      tl.fromTo("#rain", { y: -60 }, { y: 60, duration: 0.5, repeat: 6, ease: "none", immediateRender: false }, T[4]);""",
    endtitle=["Visite à plusieurs", "moments."],
    endacc="#fde68a",
    endrgb="253, 230, 138",
)

# ---------------------------------------------------------------- 10. LES 5 TESTS DE LA VISITE
SPECS["tests"] = dict(
    comment="« LES 5 TESTS DE LA VISITE » — vidéo utile : une note de téléphone qu'on coche pendant la visite. 120 BPM (indie pop).",
    bpm=120,
    T=T5,
    vars="""        --bg1: #fdf2f8;
        --bg2: #f9d5e7;
        --bg3: #f0a8cb;
        --ink: #3b0a24;
        --acc: #be185d;
        --pill: #3b0a24;
        --pillt: #fbcfe8;
        --tipbg: #3b0a24;
        --tiph: #fbcfe8;""",
    css="""      #phone {
        left: 190px;
        top: 440px;
        width: 700px;
        height: 760px;
        border-radius: 60px;
        background: #111;
        padding: 26px;
        box-shadow: 0 40px 80px rgba(59, 10, 36, 0.35);
      }
      #screen {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 38px;
        background: #fffdf5;
        overflow: hidden;
        color: #1f1f1f;
      }
      #screen .top {
        padding: 34px 36px 10px;
        font-size: 30px;
        font-weight: 800;
        color: #8a6200;
      }
      #screen .ttl {
        padding: 0 36px 18px;
        font-size: 50px;
        font-weight: 900;
        letter-spacing: -0.035em;
        border-bottom: 2px solid #eee4cc;
      }
      .it {
        position: absolute;
        left: 36px;
        right: 30px;
        display: flex;
        gap: 20px;
        align-items: center;
        font-size: 36px;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .ck {
        flex: none;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        border: 5px solid #c9bfa8;
        color: #fff;
        font-size: 30px;
        font-weight: 900;
        line-height: 42px;
        text-align: center;
      }
""",
    html="""        <div id="phone" class="abs">
          <div id="screen">
            <div class="top">‹ Notes</div>
            <div class="ttl">Visite du samedi</div>
            <div id="items"></div>
          </div>
        </div>""",
    cap="Ta visite&nbsp;:<br /><span class=\"a\">5 tests en 5 minutes.</span>",
    count0="Note à garder",
    countk="Test ${k + 1}/5",
    tips=[
        ("POURQUOI", "La pression doit tenir. Sinon, <b>plomberie ou colonne fatiguée</b>."),
        ("POURQUOI", "Vieux fusibles à broches&nbsp;? <b>Une mise aux normes est à prévoir.</b>"),
        ("POURQUOI", "<b>4 reflets = double vitrage</b>, 2 reflets = simple vitrage."),
        ("POURQUOI", "Taches noires = <b>humidité ou aération insuffisante</b>."),
        ("POURQUOI", "Odeur d'égout&nbsp;: <b>siphon sec ou évacuation à revoir</b>."),
    ],
    know=[
        ("À EMPORTER", "Une <b>lampe de poche</b>, un briquet ou ton téléphone, et cette liste."),
        ("ET LE RESTE&nbsp;?", "Les <b>documents de la copro</b> disent ce que la visite ne montre pas."),
    ],
    setup="""      const IT = ["Ouvrir 2 robinets en même temps", "Regarder le tableau électrique", "Une flamme devant la vitre", "Regarder derrière les meubles", "Sentir la salle de bain"];
      document.getElementById("items").innerHTML = IT.map((t, k) => `<div class="it" id="it${k}" style="top: ${200 + k * 104}px"><div class="ck" id="ck${k}"></div><span>${t}</span></div>`).join("");""",
    js="""      T.forEach((t, k) => {
        tl.to(`#ck${k}`, { backgroundColor: "#be185d", borderColor: "#be185d", duration: 0.15 }, t);
        tl.set(`#ck${k}`, { textContent: "✓" }, t);
        tl.fromTo(`#ck${k}`, { scale: 1.5 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
        tl.fromTo(`#it${k}`, { backgroundColor: "rgba(251,207,232,0.9)" }, { backgroundColor: "rgba(251,207,232,0)", duration: 1.2, immediateRender: false }, t);
      });""",
    endtitle=["Teste tout", "pendant la visite."],
    endacc="#fbcfe8",
    endrgb="251, 207, 232",
)

# ================================================================ SÉRIE 3 « UTILE »

# ---------------------------------------------------------------- 11. LE TRI DES CHARGES (location)
SPECS["charges"] = dict(
    comment="« LE TRI DES CHARGES » — vidéo utile pour qui loue : charges récupérables sur le locataire ou non. 104 BPM (calypso).",
    bpm=104,
    T=T5,
    vars="""        --bg1: #f0fdfa;
        --bg2: #ccf3ea;
        --bg3: #99e0d2;
        --ink: #08332c;
        --acc: #0f766e;
        --pill: #08332c;
        --pillt: #99f6e4;
        --tipbg: #08332c;
        --tiph: #99f6e4;""",
    css="""      .bin {
        position: absolute;
        top: 860px;
        width: 400px;
        height: 330px;
        border-radius: 20px 20px 46px 46px;
        color: #fff;
        text-align: center;
        padding-top: 24px;
        box-shadow: 0 30px 60px rgba(8, 51, 44, 0.3);
      }
      .bin .t {
        font-size: 34px;
        font-weight: 900;
        letter-spacing: -0.02em;
        line-height: 1.05;
      }
      .bin .n {
        margin-top: 18px;
        font-size: 120px;
        font-weight: 900;
        letter-spacing: -0.05em;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      #binA {
        left: 70px;
        background: linear-gradient(#0f766e, #115e59);
      }
      #binB {
        left: 520px;
        background: linear-gradient(#dc2626, #991b1b);
      }
      .cc {
        position: absolute;
        left: 240px;
        top: 470px;
        width: 600px;
        padding: 30px 34px;
        border-radius: 26px;
        background: #fff;
        color: #08332c;
        font-size: 48px;
        font-weight: 900;
        letter-spacing: -0.035em;
        line-height: 1.05;
        text-align: center;
        box-shadow: 0 30px 60px rgba(8, 51, 44, 0.25);
        opacity: 0;
        z-index: 3;
      }
""",
    html="""        <div class="bin" id="binA"><div class="t">Récupérable<br />sur le locataire</div><div class="n" id="nA">0</div></div>
        <div class="bin" id="binB"><div class="t">Reste<br />à ta charge</div><div class="n" id="nB">0</div></div>
        <div class="cc" id="cc0" data-layout-allow-overlap>Taxe d'ordures ménagères</div>
        <div class="cc" id="cc1" data-layout-allow-overlap>Honoraires du syndic</div>
        <div class="cc" id="cc2" data-layout-allow-overlap>Électricité des parties communes</div>
        <div class="cc" id="cc3" data-layout-allow-overlap>Assurance de l'immeuble</div>
        <div class="cc" id="cc4" data-layout-allow-overlap>Salaire du gardien</div>""",
    cap="Tu loues ton appart&nbsp;?<br /><span class=\"a\">Qui paie quoi.</span>",
    count0="Le tri des charges",
    countk="Charge ${k + 1}/5",
    tips=[
        ("RÉCUPÉRABLE", "La <b>taxe d'enlèvement des ordures ménagères</b> se refacture au locataire."),
        ("À TA CHARGE", "Les <b>honoraires du syndic</b> ne se refacturent jamais."),
        ("RÉCUPÉRABLE", "Électricité et <b>entretien courant</b> des parties communes."),
        ("À TA CHARGE", "L'<b>assurance de l'immeuble</b> n'est pas récupérable."),
        ("RÉCUPÉRABLE EN PARTIE", "<b>75&nbsp;%</b> s'il fait l'entretien et sort les poubelles, 40&nbsp;% s'il fait l'un des deux."),
    ],
    know=[
        ("LA LISTE OFFICIELLE", "Les charges récupérables sont fixées par <b>un décret de 1987</b>."),
        ("POUR TON RENDEMENT", "Compte seulement <b>ce qui reste à ta charge</b>, pas toutes les charges."),
    ],
    setup="",
    js="""      const SIDE = ["A", "B", "A", "B", "A"];
      const cnt = { A: 0, B: 0 };
      tl.fromTo("#cc0", { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }, 0.5);
      T.forEach((t, k) => {
        if (k) tl.fromTo(`#cc${k}`, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }, t - 1.0);
        const dx = SIDE[k] === "A" ? -230 : 220;
        tl.to(`#cc${k}`, { x: dx, y: 470, scale: 0.4, rotation: SIDE[k] === "A" ? -12 : 12, duration: 0.5, ease: "power2.in" }, t);
        tl.to(`#cc${k}`, { opacity: 0, duration: 0.1 }, t + 0.45);
        cnt[SIDE[k]]++;
        tl.set(`#n${SIDE[k]}`, { textContent: String(cnt[SIDE[k]]) }, t + 0.5);
        tl.fromTo(`#bin${SIDE[k]}`, { scaleY: 0.9, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.4, ease: "elastic.out(1.2, 0.4)", immediateRender: false }, t + 0.5);
      });""",
    endtitle=["Trie tes charges", "avant d'investir."],
    endacc="#99f6e4",
    endrgb="153, 246, 228",
)

# ---------------------------------------------------------------- 12. TRAVAUX CHEZ TOI : QUI DOIT DIRE OUI ?
SPECS["travaux"] = dict(
    comment="« TRAVAUX CHEZ TOI » — vidéo utile : quels travaux dans ton lot demandent l'accord de la copro. 118 BPM (country).",
    bpm=118,
    T=T5,
    vars="""        --bg1: #fffaf0;
        --bg2: #f6e7c8;
        --bg3: #e6c98e;
        --ink: #2b1a07;
        --acc: #a16207;
        --pill: #2b1a07;
        --pillt: #fcd34d;
        --tipbg: #2b1a07;
        --tiph: #fcd34d;""",
    css="""      #plan {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 740px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 70px rgba(43, 26, 7, 0.25);
      }
      .stk {
        position: absolute;
        padding: 12px 22px;
        border-radius: 16px;
        color: #fff;
        font-size: 34px;
        font-weight: 900;
        letter-spacing: 0.02em;
        white-space: nowrap;
        opacity: 0;
        z-index: 3;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
      }
      .stk.ag {
        background: #dc2626;
      }
      .stk.ok {
        background: #16a34a;
      }
      .stk.sy {
        background: #2563eb;
      }
      .ring {
        position: absolute;
        width: 150px;
        height: 150px;
        margin: -75px 0 0 -75px;
        border-radius: 50%;
        border: 10px solid #a16207;
        opacity: 0;
        z-index: 2;
      }
""",
    html="""        <svg id="plan" class="abs" viewBox="0 0 850 740"></svg>
        <div class="ring" id="rg0" style="left: 480px; top: 760px"></div>
        <div class="ring" id="rg1" style="left: 210px; top: 470px"></div>
        <div class="ring" id="rg2" style="left: 640px; top: 1000px"></div>
        <div class="ring" id="rg3" style="left: 210px; top: 1120px"></div>
        <div class="ring" id="rg4" style="left: 800px; top: 640px"></div>
        <div class="stk ag" id="sk0" style="left: 420px; top: 850px">VOTE EN AG</div>
        <div class="stk ag" id="sk1" style="left: 270px; top: 510px">VOTE EN AG SI L'ASPECT CHANGE</div>
        <div class="stk ok" id="sk2" style="left: 470px; top: 1060px">LIBRE (+ RÈGLEMENT)</div>
        <div class="stk sy" id="sk3" style="left: 300px; top: 1090px">PRÉVENIR LE SYNDIC</div>
        <div class="stk ag" id="sk4" style="left: 520px; top: 560px">AG + MAIRIE</div>""",
    cap="Travaux chez toi&nbsp;:<br /><span class=\"a\">qui doit dire oui&nbsp;?</span>",
    count0="Plan de l'appart",
    countk="Travaux ${k + 1}/5",
    tips=[
        ("ABATTRE UN MUR PORTEUR", "Il fait souvent partie des parties communes&nbsp;: <b>autorisation de l'AG</b>."),
        ("CHANGER LES FENÊTRES", "Autre couleur ou autre modèle&nbsp;? Ça touche l'aspect extérieur&nbsp;: <b>vote en AG</b>."),
        ("REFAIRE LE SOL", "Libre, mais respecte <b>l'isolation phonique</b> prévue par le règlement."),
        ("BORNE DE RECHARGE AU PARKING", "<b>Droit à la prise</b>&nbsp;: tu préviens le syndic, pas besoin de vote."),
        ("FERMER LE BALCON", "Aspect extérieur&nbsp;: <b>accord de l'AG</b>, et souvent déclaration en mairie."),
    ],
    know=[
        ("AVANT D'ACHETER", "Tu prévois de casser une cloison&nbsp;? <b>Vérifie qu'elle n'est pas porteuse.</b>"),
        ("LE BON ORDRE", "Demande l'accord <b>avant</b> les travaux, jamais après."),
    ],
    setup="""      let p = `<rect x="40" y="40" width="770" height="660" fill="none" stroke="#2b1a07" stroke-width="12"/>`;
      p += `<path d="M40 340 H460 M460 40 V560 M460 460 H810 M250 340 V700" stroke="#2b1a07" stroke-width="8"/>`;
      p += `<path d="M410 300 V320" stroke="#2b1a07" stroke-width="20"/>`;
      p += `<rect x="90" y="32" width="200" height="16" fill="#93c5fd"/><rect x="560" y="32" width="180" height="16" fill="#93c5fd"/>`;
      p += `<rect x="802" y="120" width="16" height="230" fill="#93c5fd"/><rect x="818" y="120" width="30" height="230" fill="#e7e5e4" stroke="#2b1a07" stroke-width="4"/>`;
      for (let i = 0; i < 9; i++) p += `<path d="M${470 + i * 37} 470 v220" stroke="#e8d3a6" stroke-width="6"/>`;
      p += `<rect x="60" y="600" width="170" height="80" rx="8" fill="#e5e7eb" stroke="#2b1a07" stroke-width="4"/><rect x="100" y="618" width="20" height="44" fill="#2563eb"/>`;
      p += `<path d="M385 330 h50" stroke="#a16207" stroke-width="6" stroke-dasharray="8 6"/>`;
      document.getElementById("plan").innerHTML = p;""",
    js="""      T.forEach((t, k) => {
        if (k) {
          tl.to(`#rg${k - 1}`, { opacity: 0, duration: 0.2 }, t - 0.2);
          tl.to(`#sk${k - 1}`, { opacity: 0, duration: 0.2 }, t - 0.2);
        }
        tl.fromTo(`#rg${k}`, { scale: 2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, t);
        tl.fromTo(`#sk${k}`, { scale: 0.3, rotation: -8, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t + 0.2);
        shake("#plan", t + 0.2, 4, 3);
      });""",
    endtitle=["Vérifie avant", "de casser un mur."],
    endacc="#fcd34d",
    endrgb="252, 211, 77",
)

# ---------------------------------------------------------------- 13. LES DIAGNOSTICS SELON L'ÂGE
SPECS["diags"] = dict(
    comment="« LES DIAGNOSTICS » — vidéo utile : quels diagnostics obligatoires à la vente, selon l'âge et la situation. 122 BPM (synthpop).",
    bpm=122,
    T=T5,
    vars="""        --bg1: #1f1147;
        --bg2: #120a2e;
        --bg3: #07041a;
        --ink: #ffffff;
        --acc: #f472b6;
        --pill: #f472b6;
        --pillt: #120a2e;
        --tipbg: #f472b6;
        --tiph: #120a2e;""",
    css="""      #year {
        left: 70px;
        right: 160px;
        top: 450px;
        padding: 26px 30px;
        border-radius: 26px;
        background: rgba(255, 255, 255, 0.08);
        border: 2px solid rgba(255, 255, 255, 0.2);
        text-align: center;
      }
      #year small {
        display: block;
        font-size: 28px;
        font-weight: 900;
        letter-spacing: 0.1em;
        color: #c4b5fd;
      }
      #year b {
        display: block;
        font-size: 110px;
        font-weight: 900;
        letter-spacing: -0.05em;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .chip {
        position: absolute;
        width: 410px;
        height: 104px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.06);
        border: 3px solid rgba(255, 255, 255, 0.18);
        color: rgba(255, 255, 255, 0.45);
        font-size: 38px;
        font-weight: 900;
        line-height: 98px;
        text-align: center;
        letter-spacing: -0.02em;
      }
      .tip {
        color: #120a2e;
      }
""",
    html="""        <div id="year" class="abs"><small>EXEMPLE · IMMEUBLE CONSTRUIT EN</small><b id="yr">2024</b></div>
        <div id="chips"></div>""",
    cap="Les diagnostics&nbsp;:<br /><span class=\"a\">lesquels pour ton appart&nbsp;?</span>",
    count0="Vente en copro",
    countk="Règle ${k + 1}/5",
    tips=[
        ("TOUJOURS", "<b>DPE</b>, <b>état des risques</b> et, en copro, <b>mesure Carrez</b>."),
        ("CONSTRUIT AVANT 1949", "Constat de risque d'exposition au <b>plomb</b>."),
        ("PERMIS AVANT JUILLET 1997", "Repérage de l'<b>amiante</b>."),
        ("INSTALLATION DE + DE 15 ANS", "Diagnostics <b>électricité</b> et <b>gaz</b>."),
        ("ZONE À TERMITES", "Diagnostic <b>termites</b> si un arrêté préfectoral couvre la commune."),
    ],
    know=[
        ("DURÉE DE VALIDITÉ", "DPE&nbsp;: <b>10 ans</b>. Électricité, gaz&nbsp;: <b>3 ans</b>. Termites, risques&nbsp;: <b>6 mois</b>."),
        ("LE DOSSIER", "Ils forment le <b>dossier de diagnostic technique</b>, annexé à la promesse."),
    ],
    setup="""      const CH = ["DPE", "État des risques", "Carrez", "Plomb", "Amiante", "Électricité", "Gaz", "Termites"];
      document.getElementById("chips").innerHTML = CH.map((c, i) => `<div class="chip" id="ch${i}" style="left: ${70 + (i % 2) * 440}px; top: ${700 + Math.floor(i / 2) * 124}px">${c}</div>`).join("");
      const yr = document.getElementById("yr");""",
    js="""      const ON = [[0, 1, 2], [3], [4], [5, 6], [7]];
      const COL = ["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"];
      const yv = { v: 2024 };
      tl.to(yv, { v: 1938, duration: 1.4, ease: "power2.inOut", onUpdate: () => (yr.textContent = String(Math.round(yv.v))) }, T[0] - 1.4);
      T.forEach((t, k) => {
        ON[k].forEach((i, j) => {
          tl.to(`#ch${i}`, { backgroundColor: COL[k], borderColor: COL[k], color: "#120a2e", duration: 0.2 }, t + j * 0.12);
          tl.fromTo(`#ch${i}`, { scale: 1.12 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t + j * 0.12);
        });
        flash(t, 0.2, 0.2);
      });""",
    endtitle=["Lis les diagnostics", "avant de signer."],
    endacc="#f472b6",
    endrgb="244, 114, 182",
)

# ---------------------------------------------------------------- 14. LA LOI CARREZ
SPECS["carrez"] = dict(
    comment="« LA LOI CARREZ » — vidéo utile : ce qui compte dans la surface, et ce que tu peux obtenir en cas d'erreur. 84 BPM (trip-hop).",
    bpm=84,
    T=T4,
    vars="""        --bg1: #eef2ff;
        --bg2: #d6ddf5;
        --bg3: #b4bfe6;
        --ink: #121a3a;
        --acc: #4338ca;
        --pill: #121a3a;
        --pillt: #c7d2fe;
        --tipbg: #121a3a;
        --tiph: #c7d2fe;""",
    css="""      #cut {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 560px;
      }
      #surf {
        left: 70px;
        right: 160px;
        top: 1030px;
        display: flex;
        gap: 20px;
      }
      #surf .s {
        flex: 1;
        padding: 18px 20px;
        border-radius: 22px;
        background: #fff;
        text-align: center;
        box-shadow: 0 20px 40px rgba(18, 26, 58, 0.18);
      }
      #surf small {
        display: block;
        font-size: 26px;
        font-weight: 900;
        letter-spacing: 0.08em;
        color: #4338ca;
      }
      #surf b {
        display: block;
        font-size: 64px;
        font-weight: 900;
        letter-spacing: -0.04em;
        font-variant-numeric: tabular-nums;
      }
      #mlab {
        left: 140px;
        top: 735px;
        padding: 8px 16px;
        border-radius: 12px;
        background: #4338ca;
        color: #fff;
        font-size: 30px;
        font-weight: 900;
        opacity: 0;
        z-index: 2;
      }
      .tip {
        top: 1190px;
      }
""",
    html="""        <svg id="cut" class="abs" viewBox="0 0 850 560"></svg>
        <div id="mlab" class="abs">1,80&nbsp;m</div>
        <div id="surf" class="abs"><div class="s"><small>ANNONCE</small><b>42&nbsp;m²</b></div><div class="s"><small>CARREZ</small><b id="cz">42&nbsp;m²</b></div></div>""",
    cap="La loi Carrez<br /><span class=\"a\">en 4 règles.</span>",
    count0="Coupe de l'appart",
    countk="Règle ${k + 1}/4",
    tips=[
        ("CE QUI COMPTE", "La surface au sol, <b>murs et cloisons déduits</b>."),
        ("SOUS 1,80 M", "Les parties <b>sous 1,80&nbsp;m de hauteur</b> ne comptent pas."),
        ("HORS CARREZ", "<b>Caves, garages, parkings</b>, et les lots de moins de 8&nbsp;m²."),
        ("ERREUR DE + DE 5 %", "Surface réelle plus petite&nbsp;? <b>Baisse de prix proportionnelle.</b> Ici&nbsp;: ≈ 24&nbsp;100&nbsp;€ sur 230&nbsp;000&nbsp;€."),
    ],
    know=[
        ("LE DÉLAI", "Pour demander la baisse&nbsp;: <b>1 an après l'acte</b> de vente."),
        ("À FAIRE", "Compare la surface de l'annonce et <b>celle du certificat Carrez</b>."),
    ],
    setup="""      let c = `<path d="M40 520 V420 L320 120 H530 L810 420 V520 Z" fill="#ffffff" stroke="#121a3a" stroke-width="8"/>`;
      c += `<path id="lowL" d="M40 520 V420 L124 330 V520 Z" fill="#ef4444" opacity="0"/><path id="lowR" d="M810 520 V420 L726 330 V520 Z" fill="#ef4444" opacity="0"/>`;
      c += `<path id="h180" d="M40 330 H810" stroke="#4338ca" stroke-width="5" stroke-dasharray="14 10" opacity="0"/>`;
      c += `<rect id="walls" x="420" y="200" width="18" height="320" fill="#121a3a"/><rect x="40" y="512" width="770" height="10" fill="#121a3a"/>`;
      c += `<rect id="cave" x="600" y="530" width="210" height="30" rx="6" fill="#94a3b8" opacity="0"/>`;
      document.getElementById("cut").innerHTML = c;
      const cz = document.getElementById("cz");""",
    js="""      tl.fromTo("#walls", { attr: { fill: "#121a3a" } }, { attr: { fill: "#f59e0b" }, duration: 0.3, yoyo: true, repeat: 3, immediateRender: false }, T[0]);
      tl.to("#h180", { opacity: 1, duration: 0.3 }, T[1]);
      tl.to("#mlab", { opacity: 1, duration: 0.3 }, T[1]);
      tl.to(["#lowL", "#lowR"], { opacity: 0.35, duration: 0.4 }, T[1] + 0.2);
      tl.to("#cave", { opacity: 1, duration: 0.3 }, T[2]);
      const v = { s: 42 };
      tl.to(v, { s: 37.6, duration: 0.9, ease: "power2.out", onUpdate: () => (cz.textContent = v.s.toFixed(1).replace(".", ",") + "\\u00a0m²") }, T[1] + 0.3);
      tl.to("#cz", { color: "#dc2626", duration: 0.2 }, T[3]);
      tl.fromTo("#surf", { scale: 1.06 }, { scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, T[3]);""",
    endtitle=["Mesure avant", "de payer."],
    endacc="#c7d2fe",
    endrgb="199, 210, 254",
)

# ---------------------------------------------------------------- 15. LES VOTES EN AG
SPECS["votes"] = dict(
    comment="« LES VOTES EN AG » — vidéo utile : articles 24, 25, la passerelle et l'article 26, sur un hémicycle de 100 voix. 112 BPM (tango).",
    bpm=112,
    T=T4,
    vars="""        --bg1: #fff1f2;
        --bg2: #fbd5da;
        --bg3: #f2a7b1;
        --ink: #3a0812;
        --acc: #be123c;
        --pill: #3a0812;
        --pillt: #fecdd3;
        --tipbg: #3a0812;
        --tiph: #fecdd3;""",
    css="""      #hemi {
        left: 70px;
        top: 470px;
        width: 850px;
        height: 470px;
      }
      #verdict {
        left: 70px;
        right: 160px;
        top: 980px;
        text-align: center;
        font-size: 50px;
        font-weight: 900;
        letter-spacing: -0.03em;
        line-height: 1.1;
      }
      #verdict small {
        display: block;
        font-size: 30px;
        font-weight: 800;
        color: #7f1d1d;
      }
""",
    html="""        <svg id="hemi" class="abs" viewBox="0 0 850 470"></svg>
        <div id="verdict" class="abs">100 voix = 100&nbsp;%<small>des tantièmes de l'immeuble</small></div>""",
    cap="Les votes en AG<br /><span class=\"a\">en 30 secondes.</span>",
    count0="Hémicycle de la copro",
    countk="Règle ${k + 1}/4",
    tips=[
        ("ARTICLE 24", "Majorité des voix <b>des présents et représentés</b>. Ex.&nbsp;: approuver les comptes."),
        ("ARTICLE 25", "Majorité des voix <b>de tous</b>, absents compris. Ex.&nbsp;: élire le syndic."),
        ("LA PASSERELLE", "Raté, mais au moins <b>1/3 des voix</b>&nbsp;? Nouveau vote tout de suite, à l'article 24."),
        ("ARTICLE 26", "Majorité des copropriétaires <b>et 2/3 des voix</b>. Ex.&nbsp;: changer l'usage des parties communes."),
    ],
    know=[
        ("TON POIDS", "Ton nombre de voix dépend de <b>tes tantièmes</b>."),
        ("À REGARDER", "Dans le PV&nbsp;: <b>à quel article</b> chaque décision a été votée."),
    ],
    setup="""      let h = "";
      const R = [180, 240, 300, 360, 420];
      const N = [12, 16, 20, 24, 28];
      let id = 0;
      const seats = [];
      R.forEach((r, ri) => {
        for (let i = 0; i < N[ri]; i++) {
          const a = Math.PI - (i / (N[ri] - 1)) * Math.PI;
          seats.push([425 + Math.cos(a) * r, 450 - Math.sin(a) * r, a]);
        }
      });
      seats.sort((p, q) => q[2] - p[2]);
      seats.forEach(([x, y]) => (h += `<circle id="s${id++}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="#e7c3c9"/>`));
      document.getElementById("hemi").innerHTML = h;
      const verdict = document.getElementById("verdict");""",
    js="""      // états : oui (rouge), non (gris foncé), absent (clair)
      const STATE = [
        { yes: 35, no: 25, txt: "35 oui · 25 non · 40 absents", sub: "Article 24 : 35 > 25 → <b>ADOPTÉ</b>" },
        { yes: 45, no: 15, txt: "45 oui sur 100 voix", sub: "Article 25 : il en faut 51 → <b>REJETÉ</b>" },
        { yes: 45, no: 15, txt: "45 ≥ 1/3 des voix", sub: "Passerelle : revote à l'article 24 → <b>ADOPTÉ</b>" },
        { yes: 70, no: 10, txt: "70 oui sur 100 voix", sub: "Article 26 : 2/3 atteints (et majorité des copropriétaires) → <b>ADOPTÉ</b>" },
      ];
      T.forEach((t, k) => {
        const st = STATE[k];
        for (let i = 0; i < 100; i++) {
          const col = i < st.yes ? "#be123c" : i < st.yes + st.no ? "#4b5563" : "#f3d9dd";
          tl.to(`#s${i}`, { attr: { fill: col }, duration: 0.15 }, t + (i % 50) * 0.008);
        }
        tl.set(verdict, { innerHTML: `${st.txt}<small>${st.sub}</small>` }, t + 0.4);
        tl.fromTo("#verdict", { scale: 1.1 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t + 0.4);
      });""",
    endtitle=["Comprends l'AG", "avant d'y voter."],
    endacc="#fecdd3",
    endrgb="254, 205, 211",
)

# ================================================================ SÉRIE 4 « COPRO, BÂTIMENT, APPART »

# ---------------------------------------------------------------- 16. CHOISIR SON ÉTAGE
SPECS["etages"] = dict(
    comment="« CHOISIR SON ÉTAGE » — vidéo utile : avantages et pièges de chaque étage. 100 BPM (bhangra).",
    bpm=100,
    T=T5,
    vars="""        --bg1: #fff7ed;
        --bg2: #fde3c3;
        --bg3: #f6c48a;
        --ink: #2d1606;
        --acc: #c2410c;
        --pill: #2d1606;
        --pillt: #fdba74;
        --tipbg: #2d1606;
        --tiph: #fdba74;""",
    css="""      #bld {
        left: 200px;
        top: 440px;
        width: 520px;
        height: 760px;
      }
      #cab {
        left: 740px;
        top: 0;
        width: 160px;
        padding: 12px 0;
        border-radius: 18px;
        background: #2d1606;
        color: #fdba74;
        font-size: 34px;
        font-weight: 900;
        text-align: center;
        opacity: 0;
        z-index: 3;
      }
      #hl {
        left: 200px;
        top: 0;
        width: 520px;
        height: 130px;
        border-radius: 10px;
        border: 8px solid #c2410c;
        background: rgba(194, 65, 12, 0.12);
        opacity: 0;
        z-index: 2;
      }
""",
    html="""        <svg id="bld" class="abs" viewBox="0 0 520 760"></svg>
        <div id="hl" class="abs" data-layout-allow-overlap></div>
        <div id="cab" class="abs">RDC</div>""",
    cap="Quel étage choisir&nbsp;?<br /><span class=\"a\">Les pièges de chacun.</span>",
    count0="Coupe de l'immeuble",
    countk="Étage ${k + 1}/5",
    tips=[
        ("REZ-DE-CHAUSSÉE", "Moins cher, mais <b>vis-à-vis, bruit de la rue</b> et parfois humidité du sol."),
        ("1ᵉʳ – 2ᵉ ÉTAGE", "Pratique <b>sans ascenseur</b>, mais encore proche du bruit de la rue."),
        ("ÉTAGES DU MILIEU", "Voisins dessus et dessous&nbsp;: <b>moins de chaleur perdue</b> en hiver."),
        ("DERNIER ÉTAGE", "Lumineux et calme, mais <b>chaud l'été</b> si le toit est mal isolé."),
        ("SOUS LES TOITS", "Charme, mais <b>surface Carrez réduite</b> par la pente."),
    ],
    know=[
        ("À DEMANDER", "Les combles sont-ils <b>isolés</b>&nbsp;? Ça change tout au dernier étage."),
        ("LE PRIX", "Le même appart vaut souvent <b>plus cher en hauteur</b>&nbsp;: compare à étage égal."),
    ],
    setup="""      let b = `<path d="M30 160 L260 30 L490 160 Z" fill="#9a3412" stroke="#2d1606" stroke-width="6"/>`;
      b += `<rect x="40" y="160" width="440" height="600" fill="#f5deb3" stroke="#2d1606" stroke-width="6"/>`;
      for (let f = 0; f < 5; f++) {
        const y = 160 + f * 120;
        b += `<path d="M40 ${y} H480" stroke="#2d1606" stroke-width="3" opacity="0.4"/>`;
        for (let w = 0; w < 3; w++) b += `<rect x="${80 + w * 140}" y="${y + 28}" width="80" height="64" rx="6" fill="#bfe3ff" stroke="#2d1606" stroke-width="4"/>`;
      }
      b += `<rect x="225" y="680" width="70" height="80" fill="#7c2d12"/>`;
      b += `<rect x="150" y="100" width="80" height="50" rx="6" fill="#bfe3ff" stroke="#2d1606" stroke-width="4" transform="rotate(-29 190 125)"/>`;
      document.getElementById("bld").innerHTML = b;""",
    js="""      // 0 = sous les toits … 5 = RDC (y écran)
      const FY = [440 + 640, 440 + 520, 440 + 400, 440 + 280, 440 + 30];
      const LBL = ["RDC", "1ᵉʳ", "3ᵉ", "5ᵉ", "Combles"];
      tl.set("#cab", { opacity: 1, y: FY[0] + 30 }, 0.2);
      T.forEach((t, k) => {
        tl.to("#cab", { y: FY[k] + 30, duration: 0.5, ease: "power2.inOut" }, t - 0.5);
        tl.to("#hl", { y: FY[k], height: k === 4 ? 130 : 120, opacity: 1, duration: 0.5, ease: "power2.inOut" }, t - 0.5);
        tl.set("#cab", { textContent: LBL[k] }, t);
        tl.fromTo("#cab", { scale: 1.2 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
      });""",
    endtitle=["Choisis ton étage", "en connaissance."],
    endacc="#fdba74",
    endrgb="253, 186, 116",
)

# ---------------------------------------------------------------- 17. LES MOTS PIÈGES DU RÈGLEMENT
SPECS["reglement"] = dict(
    comment="« LES MOTS PIÈGES DU RÈGLEMENT » — vidéo utile : 4 clauses du règlement de copro à repérer. 132 BPM (jazz).",
    bpm=132,
    T=T4,
    vars="""        --bg1: #fefce8;
        --bg2: #fbf3b8;
        --bg3: #f1df6e;
        --ink: #1c1a05;
        --acc: #a16207;
        --pill: #1c1a05;
        --pillt: #fde047;
        --tipbg: #1c1a05;
        --tiph: #fde047;""",
    css="""      .sign {
        position: absolute;
        left: 240px;
        top: 470px;
        width: 600px;
        height: 520px;
        opacity: 0;
      }
      .sign svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .sign .w {
        position: absolute;
        left: 120px;
        right: 120px;
        top: 250px;
        text-align: center;
        font-size: 44px;
        font-weight: 900;
        letter-spacing: -0.03em;
        line-height: 1.05;
        color: #1c1a05;
      }
""",
    html="""        <div id="signs"></div>""",
    cap="Le règlement de copro&nbsp;:<br /><span class=\"a\">4 mots pièges.</span>",
    count0="Panneaux attention",
    countk="Mot piège ${k + 1}/4",
    tips=[
        ("JOUISSANCE EXCLUSIVE", "Le jardin ou la terrasse est à toi d'usage, mais <b>reste une partie commune</b>."),
        ("HABITATION BOURGEOISE", "Clause stricte&nbsp;: <b>activité pro souvent limitée</b> ou interdite dans les logements."),
        ("DROIT DE SURÉLÉVATION", "La copro peut vendre le droit de bâtir au-dessus&nbsp;: <b>chantier sur ta tête</b>."),
        ("USAGE DU LOT", "Grenier, cellier&nbsp;: <b>pas une pièce à vivre</b> sans autorisation."),
    ],
    know=[
        ("OÙ CHERCHER", "Dans le <b>règlement de copropriété</b> et ses modificatifs, demandés avant le compromis."),
        ("LE RÉFLEXE", "Un mot pas clair&nbsp;? <b>Demande au notaire</b> avant de signer."),
    ],
    setup="""      const W = ["Jouissance<br />exclusive", "Habitation<br />bourgeoise", "Droit de<br />surélévation", "Usage<br />du lot"];
      document.getElementById("signs").innerHTML = W.map((w, k) => `<div class="sign" id="sg${k}"><svg viewBox="0 0 600 520"><path d="M300 30 L570 490 H30 Z" fill="#fde047" stroke="#dc2626" stroke-width="40" stroke-linejoin="round"/></svg><div class="w">${w}</div></div>`).join("");""",
    js="""      T.forEach((t, k) => {
        if (k) tl.to(`#sg${k - 1}`, { rotationY: 90, opacity: 0, duration: 0.25, ease: "power2.in", transformPerspective: 1400 }, t - 0.25);
        tl.fromTo(`#sg${k}`, { rotationY: -90, opacity: 0, transformPerspective: 1400 }, { rotationY: 0, opacity: 1, duration: 0.35, ease: "back.out(1.6)", immediateRender: false }, k ? t : 0.3);
        tl.to(`#sg${k}`, { rotation: 3, duration: BEAT, yoyo: true, repeat: 5, ease: "sine.inOut", transformOrigin: "50% 100%" }, t + 0.4);
      });""",
    endtitle=["Lis le règlement", "avant de signer."],
    endacc="#fde047",
    endrgb="253, 224, 71",
)

# ---------------------------------------------------------------- 18. LES 3 TYPES DE SYNDIC
SPECS["syndics"] = dict(
    comment="« LES 3 TYPES DE SYNDIC » — vidéo utile : professionnel, bénévole, coopératif, et le contrat. 96 BPM (celtique).",
    bpm=96,
    T=T4,
    vars="""        --bg1: #ecfdf5;
        --bg2: #c8f0dc;
        --bg3: #94dbb7;
        --ink: #052e1b;
        --acc: #047857;
        --pill: #052e1b;
        --pillt: #6ee7b7;
        --tipbg: #052e1b;
        --tiph: #6ee7b7;""",
    css="""      .pc {
        position: absolute;
        top: 470px;
        width: 260px;
        height: 380px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(5, 46, 27, 0.25);
        text-align: center;
        padding-top: 30px;
        opacity: 0;
      }
      .pc .ic {
        margin: 0 auto;
        width: 140px;
        height: 140px;
        border-radius: 50%;
        font-size: 72px;
        font-weight: 900;
        line-height: 140px;
        color: #fff;
      }
      .pc .n {
        margin-top: 26px;
        font-size: 40px;
        font-weight: 900;
        letter-spacing: -0.03em;
        line-height: 1.05;
      }
      .pc.on {
        box-shadow: 0 0 0 10px #047857, 0 30px 60px rgba(5, 46, 27, 0.3);
      }
      #contract {
        left: 160px;
        top: 900px;
        width: 680px;
        padding: 26px 30px;
        border-radius: 20px;
        background: #fff;
        border: 4px dashed #047857;
        text-align: center;
        font-size: 40px;
        font-weight: 900;
        letter-spacing: -0.02em;
        opacity: 0;
      }
""",
    html="""        <div class="pc" id="pc0" style="left: 70px"><div class="ic" style="background: #2563eb">€</div><div class="n">Syndic<br />pro</div></div>
        <div class="pc" id="pc1" style="left: 365px"><div class="ic" style="background: #d97706">1</div><div class="n">Syndic<br />bénévole</div></div>
        <div class="pc" id="pc2" style="left: 660px"><div class="ic" style="background: #047857">≡</div><div class="n">Syndic<br />coopératif</div></div>
        <div id="contract" class="abs">Contrat type · mandat de 3&nbsp;ans max.</div>""",
    cap="Ton futur syndic&nbsp;:<br /><span class=\"a\">lequel des 3&nbsp;?</span>",
    count0="3 cartes",
    countk="Carte ${k + 1}/4",
    tips=[
        ("SYNDIC PRO", "Une agence payée au forfait. Elle doit offrir un <b>espace en ligne</b> avec les documents."),
        ("SYNDIC BÉNÉVOLE", "Un <b>copropriétaire</b> qui gère&nbsp;: moins cher, idéal pour les petites copros."),
        ("SYNDIC COOPÉRATIF", "Le <b>conseil syndical</b> gère lui-même et élit son président syndic."),
        ("LE CONTRAT", "<b>Contrat type</b> obligatoire, mandat de 3&nbsp;ans max., mise en concurrence régulière."),
    ],
    know=[
        ("À REGARDER", "Les <b>prestations hors forfait</b> du contrat&nbsp;: c'est là que la facture grimpe."),
        ("À DEMANDER", "Le nom du syndic et <b>depuis quand</b> il gère l'immeuble."),
    ],
    setup="",
    js="""      tl.fromTo(".pc", { y: 80, opacity: 0, rotation: (i) => [-6, 0, 6][i] }, { y: 0, opacity: 1, rotation: 0, duration: 0.4, ease: "back.out(2)", stagger: 0.12, immediateRender: false }, 0.3);
      T.forEach((t, k) => {
        if (k < 3) {
          if (k) tl.set(`#pc${k - 1}`, { className: "pc" }, t);
          tl.set(`#pc${k}`, { className: "pc on" }, t);
          tl.fromTo(`#pc${k}`, { y: 0 }, { y: -30, duration: 0.3, ease: "power2.out", immediateRender: false }, t);
          if (k) tl.to(`#pc${k - 1}`, { y: 0, duration: 0.3 }, t);
        } else {
          tl.set("#pc2", { className: "pc" }, t);
          tl.to("#pc2", { y: 0, duration: 0.3 }, t);
          tl.fromTo("#contract", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }, t);
        }
      });""",
    endtitle=["Connais ton syndic", "avant d'acheter."],
    endacc="#6ee7b7",
    endrgb="110, 231, 183",
)

# ---------------------------------------------------------------- 19. L'ÂGE DE L'IMMEUBLE
SPECS["age"] = dict(
    comment="« L'ÂGE DE L'IMMEUBLE » — vidéo utile : ce qu'on peut attendre d'un immeuble selon son époque. 124 BPM (électropop).",
    bpm=124,
    T=T5,
    vars="""        --bg1: #f0f9ff;
        --bg2: #cfe9fb;
        --bg3: #9fcfef;
        --ink: #082032;
        --acc: #0369a1;
        --pill: #082032;
        --pillt: #7dd3fc;
        --tipbg: #082032;
        --tiph: #7dd3fc;""",
    css="""      .era {
        position: absolute;
        left: 190px;
        top: 450px;
        width: 700px;
        height: 620px;
        opacity: 0;
      }
      #yrs {
        left: 70px;
        right: 160px;
        top: 1100px;
        height: 90px;
        display: flex;
        gap: 10px;
      }
      #yrs div {
        flex: 1;
        border-radius: 16px;
        background: rgba(8, 32, 50, 0.08);
        color: #4a6a80;
        font-size: 28px;
        font-weight: 900;
        line-height: 90px;
        text-align: center;
      }
      .tip {
        top: 1220px;
      }
""",
    html="""        <svg class="era" id="er0" viewBox="0 0 700 620"></svg>
        <svg class="era" id="er1" viewBox="0 0 700 620"></svg>
        <svg class="era" id="er2" viewBox="0 0 700 620"></svg>
        <svg class="era" id="er3" viewBox="0 0 700 620"></svg>
        <svg class="era" id="er4" viewBox="0 0 700 620"></svg>
        <div id="yrs" class="abs"><div id="y0">&lt;1948</div><div id="y1">48–74</div><div id="y2">75–99</div><div id="y3">00–12</div><div id="y4">2012+</div></div>""",
    cap="L'âge de l'immeuble<br /><span class=\"a\">en dit long.</span>",
    count0="Remonte le temps",
    countk="Époque ${k + 1}/5",
    tips=[
        ("AVANT 1948", "Pierre, murs épais, beaux volumes. <b>Isolation et électricité</b> souvent à revoir."),
        ("1948 – 1974", "Béton, construit vite&nbsp;: <b>peu isolé</b>, avant toute norme thermique."),
        ("1975 – 1999", "Première <b>réglementation thermique</b> (1974)&nbsp;: un peu mieux isolé."),
        ("2000 – 2012", "Normes renforcées&nbsp;: <b>double vitrage</b> et isolation plus sérieuse."),
        ("APRÈS 2012", "RT 2012 puis RE 2020&nbsp;: <b>bâtiments basse consommation</b>."),
    ],
    know=[
        ("OÙ TROUVER L'ANNÉE", "Dans le <b>diagnostic technique</b> ou l'acte de propriété du vendeur."),
        ("ATTENTION", "Un immeuble ancien <b>bien rénové</b> peut battre un récent mal entretenu."),
    ],
    setup="""      const E5 = [
        (() => { let s = `<rect x="80" y="80" width="540" height="540" fill="#e7d3a8" stroke="#082032" stroke-width="6"/><path d="M60 80 h580 l-30 -50 h-520z" fill="#64748b" stroke="#082032" stroke-width="6"/>`; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += `<rect x="${120 + c * 125}" y="${120 + r * 120}" width="70" height="90" rx="35" fill="#bfe3ff" stroke="#082032" stroke-width="4"/><rect x="${112 + c * 125}" y="${205 + r * 120}" width="86" height="10" fill="#082032"/>`; return s; })(),
        (() => { let s = `<rect x="40" y="140" width="620" height="480" fill="#d1d5db" stroke="#082032" stroke-width="6"/>`; for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) s += `<rect x="${60 + c * 76}" y="${160 + r * 76}" width="56" height="50" fill="#94a3b8" stroke="#082032" stroke-width="3"/>`; return s; })(),
        (() => { let s = `<rect x="100" y="120" width="500" height="500" fill="#fde2c4" stroke="#082032" stroke-width="6"/><path d="M80 120 L350 20 L620 120 Z" fill="#b45309" stroke="#082032" stroke-width="6"/>`; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += `<rect x="${140 + c * 115}" y="${160 + r * 110}" width="80" height="70" fill="#bfe3ff" stroke="#082032" stroke-width="4"/>`; return s; })(),
        (() => { let s = `<rect x="100" y="90" width="500" height="530" fill="#f8fafc" stroke="#082032" stroke-width="6"/>`; for (let r = 0; r < 5; r++) s += `<rect x="130" y="${120 + r * 100}" width="440" height="70" fill="#7dd3fc" stroke="#082032" stroke-width="4"/><path d="M350 ${120 + r * 100} v70" stroke="#082032" stroke-width="4"/>`; return s; })(),
        (() => { let s = `<rect x="90" y="70" width="520" height="550" fill="#e2e8f0" stroke="#082032" stroke-width="6"/>`; for (let r = 0; r < 5; r++) { s += `<rect x="120" y="${100 + r * 104}" width="300" height="80" fill="#38bdf8" stroke="#082032" stroke-width="4"/><rect x="440" y="${100 + r * 104}" width="140" height="80" fill="#a3a38a" stroke="#082032" stroke-width="4"/>`; } s += `<rect x="90" y="40" width="520" height="30" fill="#16a34a"/>`; return s; })(),
      ];
      E5.forEach((s, k) => (document.getElementById(`er${k}`).innerHTML = s));
      gsap.set("#er0", { opacity: 1 });""",
    js="""      T.forEach((t, k) => {
        if (k) {
          tl.to(`#er${k - 1}`, { opacity: 0, scale: 0.9, duration: 0.3 }, t - 0.3);
          tl.to(`#y${k - 1}`, { backgroundColor: "rgba(8,32,50,0.08)", color: "#4a6a80", duration: 0.2 }, t);
        }
        tl.fromTo(`#er${k}`, { opacity: k ? 0 : 1, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, t);
        tl.to(`#y${k}`, { backgroundColor: "#0369a1", color: "#ffffff", duration: 0.2 }, t);
      });""",
    endtitle=["Regarde son âge", "avant de signer."],
    endacc="#7dd3fc",
    endrgb="125, 211, 252",
)

# ---------------------------------------------------------------- 20. QUI PAIE LA RÉPARATION ?
SPECS["reparer"] = dict(
    comment="« QUI PAIE LA RÉPARATION ? » — vidéo utile : parties communes ou privatives, toi ou la copro. 100 BPM (samba).",
    bpm=100,
    T=T4,
    vars="""        --bg1: #fdf4ff;
        --bg2: #f3d7fa;
        --bg3: #e2aef0;
        --ink: #2e0838;
        --acc: #86198f;
        --pill: #2e0838;
        --pillt: #f0abfc;
        --tipbg: #2e0838;
        --tiph: #f0abfc;""",
    css="""      #flat {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 620px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(46, 8, 56, 0.2);
      }
      #legend {
        left: 70px;
        right: 160px;
        top: 1090px;
        display: flex;
        gap: 16px;
        font-size: 32px;
        font-weight: 900;
      }
      #legend span {
        flex: 1;
        padding: 12px 0;
        border-radius: 14px;
        text-align: center;
        color: #fff;
      }
      .tip {
        top: 1200px;
      }
""",
    html="""        <svg id="flat" class="abs" viewBox="0 0 850 620"></svg>
        <div id="legend" class="abs"><span style="background: #2563eb">LA COPRO</span><span style="background: #ea580c">TOI</span></div>""",
    cap="Une réparation&nbsp;:<br /><span class=\"a\">toi ou la copro&nbsp;?</span>",
    count0="Coupe de l'appart",
    countk="Cas ${k + 1}/4",
    tips=[
        ("LA COLONNE D'EAU", "La grosse canalisation qui monte dans l'immeuble&nbsp;: <b>en général la copro</b>."),
        ("APRÈS LA VANNE", "Le tuyau qui part vers ton évier et tes robinets&nbsp;: <b>en général toi</b>."),
        ("LE BALCON", "La dalle et la structure&nbsp;: <b>la copro</b>. Le carrelage&nbsp;: <b>souvent toi</b>."),
        ("LA PORTE PALIÈRE", "Souvent <b>à toi</b>, mais son aspect côté palier est fixé par le règlement."),
    ],
    know=[
        ("LA RÉPONSE EXACTE", "Elle est dans le <b>règlement de copropriété</b>&nbsp;: chaque immeuble a ses règles."),
        ("DÉGÂT DES EAUX", "Préviens vite <b>ton assureur et le syndic</b>, même si tu ne sais pas qui paie."),
    ],
    setup="""      let f = `<rect x="40" y="60" width="560" height="500" fill="#faf5ff" stroke="#2e0838" stroke-width="8"/>`;
      f += `<rect id="col" x="70" y="20" width="44" height="580" fill="#cbd5e1" stroke="#2e0838" stroke-width="4"/>`;
      f += `<circle cx="140" cy="300" r="16" fill="#cbd5e1" stroke="#2e0838" stroke-width="4"/><path id="pipe" d="M114 300 H420 V360" stroke="#cbd5e1" stroke-width="16" fill="none"/>`;
      f += `<rect x="380" y="360" width="120" height="60" rx="8" fill="#e2e8f0" stroke="#2e0838" stroke-width="4"/>`;
      f += `<rect id="slab" x="600" y="440" width="210" height="30" fill="#cbd5e1" stroke="#2e0838" stroke-width="4"/><rect id="tile" x="600" y="428" width="210" height="12" fill="#e2e8f0" stroke="#2e0838" stroke-width="3"/><path d="M800 300 V428" stroke="#2e0838" stroke-width="6"/><path d="M610 330 H800" stroke="#2e0838" stroke-width="4"/>`;
      f += `<rect id="door" x="300" y="420" width="90" height="140" fill="#e2e8f0" stroke="#2e0838" stroke-width="4"/><circle cx="375" cy="495" r="6" fill="#2e0838"/>`;
      document.getElementById("flat").innerHTML = f;""",
    js="""      const B = "#2563eb", O = "#ea580c";
      tl.to("#col", { attr: { fill: B }, duration: 0.3 }, T[0]);
      tl.fromTo("#col", { scaleX: 1.3, transformOrigin: "50% 50%" }, { scaleX: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, T[0]);
      tl.to("#pipe", { attr: { stroke: O }, duration: 0.4 }, T[1]);
      tl.to("#slab", { attr: { fill: B }, duration: 0.3 }, T[2]);
      tl.to("#tile", { attr: { fill: O }, duration: 0.3 }, T[2] + 0.4);
      tl.to("#door", { attr: { fill: O }, duration: 0.3 }, T[3]);
      T.forEach((t) => shake("#flat", t, 4, 3));""",
    endtitle=["Sache qui répare", "avant d'acheter."],
    endacc="#f0abfc",
    endrgb="240, 171, 252",
)

# ================================================================ SÉRIE 5 « L'APPART ET L'IMMEUBLE »

# ---------------------------------------------------------------- 21. LES BRUITS DANS L'IMMEUBLE
SPECS["bruits"] = dict(
    comment="« LES BRUITS » — vidéo utile pendant la visite : repérer une mauvaise isolation phonique. 96 BPM (chillwave).",
    bpm=96,
    T=T4,
    vars="""        --bg1: #f5f3ff;
        --bg2: #dcd6fb;
        --bg3: #b7aaf0;
        --ink: #1b1440;
        --acc: #6d28d9;
        --pill: #1b1440;
        --pillt: #c4b5fd;
        --tipbg: #1b1440;
        --tiph: #c4b5fd;""",
    css="""      #sec {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
      }
      .wave {
        fill: none;
        stroke: #6d28d9;
        stroke-width: 7;
        opacity: 0;
      }
""",
    html="""        <svg id="sec" class="abs" viewBox="0 0 850 720"></svg>""",
    cap="Les bruits de l'immeuble&nbsp;:<br /><span class=\"a\">teste avant d'acheter.</span>",
    count0="Coupe de deux étages",
    countk="Test ${k + 1}/4",
    tips=[
        ("2 TYPES DE BRUIT", "<b>Aériens</b>&nbsp;: voix, télé. <b>D'impact</b>&nbsp;: pas, chaises, talons."),
        ("TAPE SUR LA CLOISON", "Son creux&nbsp;? C'est une <b>cloison légère</b>&nbsp;: tu entendras la pièce d'à côté."),
        ("LE SOL DU DESSUS", "Parquet ou carrelage chez le voisin&nbsp;? Demande s'il y a une <b>sous-couche acoustique</b>."),
        ("LES CANALISATIONS", "Chasse d'eau, descente d'eaux usées&nbsp;: <b>écoute les murs</b> de la salle de bain."),
    ],
    know=[
        ("LE REPÈRE", "Immeubles neufs&nbsp;: une <b>réglementation acoustique</b> s'applique depuis 1996."),
        ("LE TEST", "Demande à quelqu'un de <b>marcher à l'étage</b> pendant ta visite."),
    ],
    setup="""      let s = `<rect x="20" y="20" width="810" height="680" fill="#ffffff" stroke="#1b1440" stroke-width="6"/>`;
      s += `<rect x="20" y="340" width="810" height="36" fill="#a5a0c2"/>`;
      s += `<rect x="420" y="20" width="14" height="320" fill="#d6d3e8" stroke="#1b1440" stroke-width="3"/><rect x="420" y="376" width="14" height="324" fill="#d6d3e8" stroke="#1b1440" stroke-width="3"/>`;
      s += `<rect x="760" y="20" width="40" height="680" fill="#cbd5e1" stroke="#1b1440" stroke-width="3"/>`;
      // TV + personnage (haut), chaise (haut), WC (haut droite)
      s += `<rect x="80" y="210" width="120" height="80" rx="8" fill="#1b1440"/><rect x="92" y="222" width="96" height="56" fill="#818cf8"/>`;
      s += `<circle cx="300" cy="230" r="22" fill="#1b1440"/><rect x="284" y="254" width="32" height="70" rx="12" fill="#1b1440"/>`;
      s += `<rect x="620" y="270" width="80" height="60" rx="14" fill="#e5e7eb" stroke="#1b1440" stroke-width="4"/>`;
      // pièce du bas : toi
      s += `<circle cx="600" cy="560" r="24" fill="#6d28d9"/><rect x="583" y="586" width="34" height="80" rx="12" fill="#6d28d9"/>`;
      const W = [[140, 250], [300, 330], [427, 500], [780, 520]];
      W.forEach(([x, y], k) => {
        for (let r = 0; r < 3; r++) s += `<circle class="wave w${k}" cx="${x}" cy="${y}" r="${30 + r * 35}"/>`;
      });
      document.getElementById("sec").innerHTML = s;""",
    js="""      T.forEach((t, k) => {
        const g = k === 0 ? ".w0, .w1" : `.w${k + 1 > 3 ? 3 : k + 1}`;
        if (k) tl.to(".wave", { opacity: 0, duration: 0.2 }, t - 0.2);
        tl.fromTo(g, { scale: 0.4, opacity: 0.9, transformOrigin: "50% 50%" }, { scale: 1.3, opacity: 0, duration: 0.9, ease: "power1.out", stagger: 0.12, repeat: 3, immediateRender: false }, t);
        shake("#sec", t, 4, 3);
      });""",
    endtitle=["Écoute l'immeuble", "avant de signer."],
    endacc="#c4b5fd",
    endrgb="196, 181, 253",
)

# ---------------------------------------------------------------- 22. LE CHAUFFAGE DE L'APPART
SPECS["chauffage"] = dict(
    comment="« LE CHAUFFAGE » — vidéo utile : reconnaître le système de chauffage et ce qu'il implique. 108 BPM (flamenco).",
    bpm=108,
    T=T4,
    vars="""        --bg1: #fff1f2;
        --bg2: #fecdd3;
        --bg3: #fca5b0;
        --ink: #3b0711;
        --acc: #be123c;
        --pill: #3b0711;
        --pillt: #fda4af;
        --tipbg: #3b0711;
        --tiph: #fda4af;""",
    css="""      .hc {
        position: absolute;
        left: 70px;
        width: 850px;
        height: 150px;
        border-radius: 24px;
        background: #fff;
        display: flex;
        align-items: center;
        gap: 26px;
        padding: 0 30px;
        box-shadow: 0 20px 40px rgba(59, 7, 17, 0.15);
        opacity: 0.35;
      }
      .hc .nm {
        flex: 1;
        font-size: 40px;
        font-weight: 900;
        letter-spacing: -0.03em;
        line-height: 1.05;
      }
      .hc .gauge {
        flex: none;
        width: 230px;
        height: 30px;
        border-radius: 15px;
        background: #fde2e5;
        overflow: hidden;
      }
      .hc .gauge i {
        display: block;
        height: 100%;
        border-radius: 15px;
        transform-origin: 0% 50%;
        transform: scaleX(0);
      }
      #glab {
        left: 640px;
        top: 452px;
        font-size: 26px;
        font-weight: 900;
        letter-spacing: 0.06em;
        color: #3b0711;
      }
""",
    html="""        <div id="glab" class="abs">COÛT D'USAGE</div>
        <div class="hc" id="hc0" style="top: 500px"><svg width="90" height="90" viewBox="0 0 90 90"><rect x="8" y="20" width="74" height="50" rx="8" fill="#94a3b8"/><path d="M18 34 h54 M18 46 h54 M18 58 h54" stroke="#fff" stroke-width="4"/></svg><div class="nm">Convecteurs électriques</div><div class="gauge"><i style="width: 95%; background: #dc2626"></i></div></div>
        <div class="hc" id="hc1" style="top: 670px"><svg width="90" height="90" viewBox="0 0 90 90"><rect x="8" y="16" width="74" height="58" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/><path d="M22 28 v34 M34 28 v34 M46 28 v34 M58 28 v34 M70 28 v34" stroke="#94a3b8" stroke-width="5"/></svg><div class="nm">Radiateurs à inertie, pompe à chaleur</div><div class="gauge"><i style="width: 45%; background: #16a34a"></i></div></div>
        <div class="hc" id="hc2" style="top: 840px"><svg width="90" height="90" viewBox="0 0 90 90"><rect x="20" y="8" width="50" height="74" rx="8" fill="#e2e8f0" stroke="#64748b" stroke-width="4"/><path d="M45 52 q-10 -10 0 -24 q10 14 0 24z" fill="#f97316"/></svg><div class="nm">Chaudière gaz individuelle</div><div class="gauge"><i style="width: 60%; background: #f59e0b"></i></div></div>
        <div class="hc" id="hc3" style="top: 1010px"><svg width="90" height="90" viewBox="0 0 90 90"><rect x="10" y="20" width="70" height="50" rx="8" fill="#f8fafc" stroke="#be123c" stroke-width="4"/><rect x="34" y="6" width="22" height="22" rx="4" fill="#be123c"/><text x="45" y="23" font-size="14" text-anchor="middle" fill="#fff"></text></svg><div class="nm">Collectif avec répartiteurs</div><div class="gauge"><i style="width: 55%; background: #f59e0b"></i></div></div>""",
    cap="Ton futur chauffage&nbsp;:<br /><span class=\"a\">reconnais-le.</span>",
    count0="4 systèmes",
    countk="Système ${k + 1}/4",
    tips=[
        ("CONVECTEURS « GRILLE-PAIN »", "Pas chers à installer, <b>chers à l'usage</b>. Souvent signe d'un mauvais DPE."),
        ("INERTIE OU POMPE À CHALEUR", "Plus <b>économes</b>&nbsp;: demande leur âge et la facture d'un hiver."),
        ("CHAUDIÈRE GAZ INDIVIDUELLE", "<b>Entretien obligatoire chaque année</b>&nbsp;: demande la dernière attestation."),
        ("COLLECTIF + RÉPARTITEURS", "Petits boîtiers sur les radiateurs&nbsp;: tu paies <b>selon ta consommation</b>."),
    ],
    know=[
        ("À DEMANDER", "Les <b>factures d'énergie</b> d'une année complète, hiver compris."),
        ("À REGARDER", "L'<b>âge</b> de la chaudière ou des radiateurs&nbsp;: un remplacement coûte cher."),
    ],
    setup="",
    js="""      T.forEach((t, k) => {
        if (k) tl.to(`#hc${k - 1}`, { opacity: 0.55, scale: 1, duration: 0.3 }, t);
        tl.to(`#hc${k}`, { opacity: 1, scale: 1.03, duration: 0.3, ease: "back.out(2)" }, t);
        tl.to(`#hc${k} .gauge i`, { scaleX: 1, duration: 0.8, ease: "power2.out" }, t + 0.2);
      });""",
    endtitle=["Vérifie le chauffage", "avant de signer."],
    endacc="#fda4af",
    endrgb="253, 164, 175",
)

# ---------------------------------------------------------------- 23. LE VIS-À-VIS ET LA LOI
SPECS["visavis"] = dict(
    comment="« LE VIS-À-VIS » — vidéo utile : distances de vue, jours de souffrance et terrain d'en face. 80 BPM (dub).",
    bpm=80,
    T=T4,
    vars="""        --bg1: #f0fdf4;
        --bg2: #cdeed8;
        --bg3: #9bd8b0;
        --ink: #062b16;
        --acc: #15803d;
        --pill: #062b16;
        --pillt: #86efac;
        --tipbg: #062b16;
        --tiph: #86efac;""",
    css="""      #top {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
        border-radius: 26px;
        background: #f7fdf9;
        box-shadow: 0 30px 60px rgba(6, 43, 22, 0.2);
      }
      .ms {
        position: absolute;
        padding: 8px 16px;
        border-radius: 12px;
        background: #15803d;
        color: #fff;
        font-size: 34px;
        font-weight: 900;
        opacity: 0;
        z-index: 3;
      }
""",
    html="""        <svg id="top" class="abs" viewBox="0 0 850 720"></svg>
        <div class="ms" id="m0" style="left: 340px; top: 780px">1,90&nbsp;m</div>
        <div class="ms" id="m1" style="left: 560px; top: 640px">0,60&nbsp;m</div>
        <div class="ms" id="m2" style="left: 150px; top: 1000px">verre fixe</div>
        <div class="ms" id="m3" style="left: 600px; top: 1040px">constructible&nbsp;?</div>""",
    cap="Le vis-à-vis&nbsp;:<br /><span class=\"a\">ce que dit la loi.</span>",
    count0="Vue du dessus",
    countk="Règle ${k + 1}/4",
    tips=[
        ("VUE DROITE", "Fenêtre face au voisin&nbsp;: au moins <b>1,90&nbsp;m</b> de la limite de propriété."),
        ("VUE OBLIQUE", "Fenêtre en biais&nbsp;: au moins <b>0,60&nbsp;m</b>."),
        ("JOUR DE SOUFFRANCE", "Une ouverture qui laisse passer <b>la lumière, pas la vue</b>&nbsp;: verre fixe et opaque."),
        ("LE TERRAIN EN FACE", "Vide aujourd'hui&nbsp;? Le <b>plan local d'urbanisme</b> dit si on peut y construire."),
    ],
    know=[
        ("À LA MAIRIE", "Le <b>PLU</b> se consulte en mairie ou en ligne."),
        ("À REGARDER", "La <b>hauteur</b> des immeubles voisins et leur distance à tes fenêtres."),
    ],
    setup="""      let p = `<rect x="40" y="60" width="380" height="260" fill="#d1fae5" stroke="#062b16" stroke-width="6"/>`;
      p += `<rect x="40" y="440" width="380" height="240" fill="#e5e7eb" stroke="#062b16" stroke-width="6"/>`;
      p += `<path d="M20 380 H830" stroke="#dc2626" stroke-width="5" stroke-dasharray="16 10"/>`;
      p += `<rect x="460" y="420" width="360" height="270" fill="#fef9c3" stroke="#a16207" stroke-width="4" stroke-dasharray="12 8"/>`;
      p += `<rect x="200" y="314" width="90" height="12" fill="#38bdf8"/><rect x="414" y="140" width="12" height="80" fill="#38bdf8"/><rect x="100" y="434" width="70" height="12" fill="#94a3b8"/>`;
      p += `<path id="a0" d="M245 330 V375" stroke="#15803d" stroke-width="6" opacity="0"/><path id="a1" d="M426 180 L470 372" stroke="#15803d" stroke-width="6" opacity="0"/>`;
      document.getElementById("top").innerHTML = p;""",
    js="""      T.forEach((t, k) => {
        if (k) tl.to(`#m${k - 1}`, { opacity: 0.35, duration: 0.2 }, t);
        tl.fromTo(`#m${k}`, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t + 0.2);
        if (k < 2) tl.to(`#a${k}`, { opacity: 1, duration: 0.3 }, t);
      });""",
    endtitle=["Regarde en face", "avant de signer."],
    endacc="#86efac",
    endrgb="134, 239, 172",
)

# ---------------------------------------------------------------- 24. LA SÉCURITÉ DANS LE LOGEMENT
SPECS["securite"] = dict(
    comment="« LA SÉCURITÉ DANS LE LOGEMENT » — vidéo utile : 4 points de sécurité à vérifier. 118 BPM (highlife).",
    bpm=118,
    T=T4,
    vars="""        --bg1: #fffbeb;
        --bg2: #fde9b0;
        --bg3: #f8cf6a;
        --ink: #2a1c02;
        --acc: #b45309;
        --pill: #2a1c02;
        --pillt: #fcd34d;
        --tipbg: #2a1c02;
        --tiph: #fcd34d;""",
    css="""      #room {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(42, 28, 2, 0.2);
      }
      .hs {
        position: absolute;
        width: 130px;
        height: 130px;
        margin: -65px 0 0 -65px;
        border-radius: 50%;
        border: 10px solid #b45309;
        opacity: 0;
        z-index: 2;
      }
""",
    html="""        <svg id="room" class="abs" viewBox="0 0 850 720"></svg>
        <div class="hs" id="h0" style="left: 495px; top: 500px"></div>
        <div class="hs" id="h1" style="left: 205px; top: 970px"></div>
        <div class="hs" id="h2" style="left: 860px; top: 1000px"></div>
        <div class="hs" id="h3" style="left: 210px; top: 570px"></div>""",
    cap="La sécurité chez toi&nbsp;:<br /><span class=\"a\">4 points à vérifier.</span>",
    count0="Inspection",
    countk="Point ${k + 1}/4",
    tips=[
        ("DÉTECTEUR DE FUMÉE", "<b>Obligatoire</b> dans chaque logement depuis 2015. Il y en a un&nbsp;?"),
        ("CHEMINÉE", "Un conduit utilisé doit être <b>ramoné régulièrement</b>, souvent au moins une fois par an."),
        ("TUYAU DE GAZ", "Sur la gazinière&nbsp;: lis sa <b>date limite</b>. Périmé&nbsp;? À changer."),
        ("TABLEAU ÉLECTRIQUE", "Cherche un <b>différentiel 30 mA</b> avec un bouton test&nbsp;: il protège des électrocutions."),
    ],
    know=[
        ("À DEMANDER", "Les <b>diagnostics électricité et gaz</b> s'ils existent&nbsp;: ils listent les anomalies."),
        ("À PRÉVOIR", "Une mise en sécurité électrique peut coûter <b>plusieurs milliers d'euros</b>."),
    ],
    setup="""      let r = `<rect x="0" y="0" width="850" height="720" fill="#fffdf6"/><rect x="0" y="600" width="850" height="120" fill="#e7d7b6"/>`;
      r += `<circle cx="425" cy="50" r="30" fill="#f8fafc" stroke="#2a1c02" stroke-width="5"/><circle cx="425" cy="50" r="6" fill="#dc2626"/>`;
      r += `<rect x="60" y="260" width="150" height="340" fill="#d6c3a0" stroke="#2a1c02" stroke-width="5"/><rect x="80" y="440" width="110" height="160" fill="#2a1c02"/><path d="M100 520 q15 -30 30 0 q15 -30 30 0" stroke="#f97316" stroke-width="8" fill="none"/>`;
      r += `<rect x="600" y="400" width="200" height="200" fill="#e5e7eb" stroke="#2a1c02" stroke-width="5"/><circle cx="650" cy="430" r="14" fill="#2a1c02"/><circle cx="700" cy="430" r="14" fill="#2a1c02"/><path d="M800 520 q40 0 40 60" stroke="#f59e0b" stroke-width="10" fill="none"/>`;
      r += `<rect x="70" y="40" width="140" height="160" rx="10" fill="#f1f5f9" stroke="#2a1c02" stroke-width="5"/>`;
      for (let i = 0; i < 4; i++) r += `<rect x="${86 + i * 30}" y="70" width="20" height="44" rx="4" fill="${i ? "#94a3b8" : "#2563eb"}"/>`;
      r += `<rect x="86" y="140" width="56" height="40" rx="6" fill="#16a34a"/>`;
      document.getElementById("room").innerHTML = r;""",
    js="""      T.forEach((t, k) => {
        if (k) tl.to(`#h${k - 1}`, { opacity: 0, duration: 0.2 }, t - 0.2);
        tl.fromTo(`#h${k}`, { scale: 2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, t);
        tl.to(`#h${k}`, { scale: 1.12, duration: BEAT / 2, yoyo: true, repeat: 5, ease: "sine.inOut" }, t + 0.4);
      });""",
    endtitle=["Vérifie la sécurité", "dès la visite."],
    endacc="#fcd34d",
    endrgb="252, 211, 77",
)

# ---------------------------------------------------------------- 25. LES PIÈGES D'UN PLAN
SPECS["plan"] = dict(
    comment="« LES PIÈGES D'UN PLAN » — vidéo utile : lire un plan d'appartement avant la visite. 100 BPM (klezmer).",
    bpm=100,
    T=T4,
    vars="""        --bg1: #eff6ff;
        --bg2: #cfe0fb;
        --bg3: #9fbff0;
        --ink: #0b1d3a;
        --acc: #1d4ed8;
        --pill: #0b1d3a;
        --pillt: #93c5fd;
        --tipbg: #0b1d3a;
        --tiph: #93c5fd;""",
    css="""      #fp {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(11, 29, 58, 0.2);
      }
      .zn {
        opacity: 0;
      }
""",
    html="""        <svg id="fp" class="abs" viewBox="0 0 850 720"></svg>""",
    cap="Un plan d'appart&nbsp;:<br /><span class=\"a\">4 pièges à repérer.</span>",
    count0="Plan de l'annonce",
    countk="Piège ${k + 1}/4",
    tips=[
        ("PIÈCE SANS FENÊTRE", "Une « chambre » sans ouverture sur l'extérieur <b>n'en est pas une</b>."),
        ("LA SURFACE MINIMALE", "Un logement décent a au moins une pièce de <b>9&nbsp;m² et 2,20&nbsp;m</b> sous plafond (ou 20&nbsp;m³)."),
        ("LES COULOIRS", "Ils comptent dans la surface mais <b>ne servent à rien</b>&nbsp;: compare les m² utiles."),
        ("PIÈCES EN ENFILADE", "Passer par une chambre pour aller dans une autre&nbsp;: <b>zéro intimité</b>."),
    ],
    know=[
        ("À DEMANDER", "Un <b>plan coté</b>, avec les mesures de chaque pièce."),
        ("À FAIRE", "Repère où sont <b>les fenêtres</b> sur le plan avant de visiter."),
    ],
    setup="""      let f = `<rect x="40" y="40" width="770" height="640" fill="none" stroke="#0b1d3a" stroke-width="12"/>`;
      f += `<path d="M40 300 H330 V680 M330 40 V230 M330 300 H560 M560 40 V680 M560 360 H810" stroke="#0b1d3a" stroke-width="8" fill="none"/>`;
      f += `<rect x="120" y="32" width="140" height="16" fill="#38bdf8"/><rect x="620" y="32" width="140" height="16" fill="#38bdf8"/><rect x="802" y="440" width="16" height="160" fill="#38bdf8"/><rect x="32" y="400" width="16" height="160" fill="#38bdf8"/>`;
      f += `<rect class="zn" id="z0" x="336" y="306" width="218" height="368" fill="#0b1d3a" opacity="0"/>`;
      f += `<rect class="zn" id="z1" x="566" y="366" width="238" height="308" fill="#22c55e" opacity="0"/>`;
      f += `<rect class="zn" id="z2" x="336" y="46" width="218" height="248" fill="url(#hatch)" opacity="0"/>`;
      f += `<defs><pattern id="hatch" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="20" fill="#fde68a"/><path d="M0 0 V20" stroke="#f59e0b" stroke-width="8"/></pattern></defs>`;
      f += `<path class="zn" id="z3" d="M180 170 C 300 170, 400 200, 680 200" stroke="#dc2626" stroke-width="12" fill="none" stroke-dasharray="20 14" opacity="0"/><path class="zn" id="z3b" d="M660 180 l30 20 l-30 20" stroke="#dc2626" stroke-width="12" fill="none" opacity="0"/>`;
      document.getElementById("fp").innerHTML = f;""",
    js="""      const OP = [0.55, 0.45, 0.8, 1];
      T.forEach((t, k) => {
        if (k) tl.to(k === 4 ? [] : `#z${k - 1}${k - 1 === 3 ? ", #z3b" : ""}`, { opacity: 0.12, duration: 0.25 }, t);
        tl.to(k === 3 ? "#z3, #z3b" : `#z${k}`, { opacity: OP[k], duration: 0.35 }, t);
        shake("#fp", t, 4, 3);
      });""",
    endtitle=["Lis le plan", "avant de visiter."],
    endacc="#93c5fd",
    endrgb="147, 197, 253",
)

# ================================================================ SÉRIE 6

# ---------------------------------------------------------------- 26. DÉCODER UNE ANNONCE
SPECS["annonce"] = dict(
    comment="« DÉCODER UNE ANNONCE » — vidéo utile : les mots qui cachent quelque chose et les mentions obligatoires. 98 BPM (zouk).",
    bpm=98,
    T=T5,
    vars="""        --bg1: #fff7ed;
        --bg2: #ffe4cc;
        --bg3: #fdc79b;
        --ink: #2b1405;
        --acc: #ea580c;
        --pill: #2b1405;
        --pillt: #fdba74;
        --tipbg: #2b1405;
        --tiph: #fdba74;""",
    css="""      #ad {
        left: 70px;
        top: 450px;
        width: 850px;
        padding: 0 0 26px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(43, 20, 5, 0.2);
        overflow: hidden;
      }
      #ad .ph {
        height: 230px;
        background: linear-gradient(135deg, #fbbf8a, #f97316);
      }
      #ad .pr {
        padding: 22px 30px 0;
        font-size: 56px;
        font-weight: 900;
        letter-spacing: -0.04em;
      }
      #ad .ln {
        padding: 8px 30px 0;
        font-size: 36px;
        font-weight: 700;
        line-height: 1.3;
        color: #4b3221;
      }
      #ad mark {
        background: transparent;
        color: inherit;
        border-radius: 8px;
        padding: 0 6px;
      }
""",
    html="""        <div id="ad" class="abs">
          <div class="ph"></div>
          <div class="pr">T3 · 61 m² · 4e étage</div>
          <div class="ln"><mark id="w0">À rafraîchir</mark>, <mark id="w1">idéal investisseur</mark>, quartier <mark id="w2">calme</mark>.</div>
          <div class="ln"><mark id="w3">Copropriété de 24 lots, charges 1&nbsp;680&nbsp;€/an</mark>.</div>
          <div class="ln"><mark id="w4">DPE&nbsp;D · dépenses estimées 1&nbsp;100 à 1&nbsp;500&nbsp;€/an</mark>.</div>
        </div>""",
    cap="Une annonce&nbsp;:<br /><span class=\"a\">ce qu'elle veut dire.</span>",
    count0="Annonce type",
    countk="Mot ${k + 1}/5",
    tips=[
        ("« À RAFRAÎCHIR »", "Des travaux à prévoir&nbsp;: <b>peinture… ou beaucoup plus</b>. Visite avec un devis en tête."),
        ("« IDÉAL INVESTISSEUR »", "Souvent <b>déjà loué</b>&nbsp;: tu achètes avec le locataire et son bail."),
        ("« CALME »", "Parfois <b>loin des commerces et des transports</b>. Vérifie le trajet."),
        ("OBLIGATOIRE · LA COPRO", "L'annonce doit dire <b>copro, nombre de lots et charges annuelles</b>."),
        ("OBLIGATOIRE · LE DPE", "La <b>classe énergie</b> et une estimation des dépenses d'énergie par an."),
    ],
    know=[
        ("SI ÇA MANQUE", "Une mention obligatoire absente&nbsp;? <b>Demande-la</b> avant de visiter."),
        ("LE RÉFLEXE", "Fais une capture de l'annonce&nbsp;: elle peut <b>disparaître ou changer</b>."),
    ],
    setup="",
    js="""      const HL = ["#fed7aa", "#fde68a", "#bbf7d0", "#bfdbfe", "#fbcfe8"];
      T.forEach((t, k) => {
        tl.to(`#w${k}`, { backgroundColor: HL[k], duration: 0.3 }, t);
        tl.fromTo(`#w${k}`, { scale: 1.15 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
      });""",
    endtitle=["Lis entre les lignes", "de l'annonce."],
    endacc="#fdba74",
    endrgb="253, 186, 116",
)

# ---------------------------------------------------------------- 27. TES DROITS FACE AUX VOISINS
SPECS["voisins"] = dict(
    comment="« TES DROITS FACE AUX VOISINS » — vidéo utile : bruit de nuit, de jour, bricolage, conciliateur. 138 BPM (trance).",
    bpm=138,
    T=T4,
    vars="""        --bg1: #1e1b4b;
        --bg2: #13103a;
        --bg3: #070520;
        --ink: #ffffff;
        --acc: #a5b4fc;
        --pill: #a5b4fc;
        --pillt: #13103a;
        --tipbg: #a5b4fc;
        --tiph: #13103a;""",
    css="""      #meter {
        left: 120px;
        top: 470px;
        width: 760px;
        height: 560px;
      }
      #when {
        left: 70px;
        right: 160px;
        top: 1060px;
        text-align: center;
        font-size: 60px;
        font-weight: 900;
        letter-spacing: -0.04em;
      }
      .tip {
        color: #13103a;
      }
""",
    html="""        <svg id="meter" class="abs" viewBox="0 0 760 560"></svg>
        <div id="when" class="abs">Le bruit des voisins</div>""",
    cap="Tes voisins font du bruit&nbsp;?<br /><span class=\"a\">Tes droits.</span>",
    count0="Décibels",
    countk="Règle ${k + 1}/4",
    tips=[
        ("LA NUIT", "Entre <b>22&nbsp;h et 7&nbsp;h</b>, un bruit qui te gêne est du tapage nocturne&nbsp;: sanctionné."),
        ("LE JOUR AUSSI", "Un bruit <b>répétitif, long ou intense</b> peut être sanctionné, même en journée."),
        ("LE BRICOLAGE", "Les horaires autorisés sont fixés par <b>arrêté de la mairie ou de la préfecture</b>."),
        ("LA SOLUTION", "Le <b>conciliateur de justice</b>&nbsp;: gratuit, avant toute procédure."),
    ],
    know=[
        ("EN COPRO", "Le <b>règlement de copropriété</b> peut ajouter ses propres règles sur le bruit."),
        ("D'ABORD", "Un mot ou une visite au voisin règle <b>souvent tout</b>."),
    ],
    setup="""      let m = "";
      for (let i = 0; i < 12; i++) {
        const h = 60 + i * 38;
        const c = i < 5 ? "#34d399" : i < 9 ? "#fbbf24" : "#f87171";
        m += `<rect id="b${i}" x="${20 + i * 62}" y="${540 - h}" width="46" height="${h}" rx="10" fill="${c}" opacity="0.18"/>`;
      }
      document.getElementById("meter").innerHTML = m;
      const when = document.getElementById("when");""",
    js="""      const LV = [11, 8, 6, 2];
      const W = ["22 h → 7 h", "En journée", "Perceuse, marteau", "Conciliateur gratuit"];
      T.forEach((t, k) => {
        for (let i = 0; i < 12; i++) tl.to(`#b${i}`, { opacity: i <= LV[k] ? 1 : 0.18, duration: 0.15 }, t + i * 0.03);
        tl.set(when, { textContent: W[k] }, t);
        tl.fromTo("#when", { scale: 1.15 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
        flash(t, 0.15, 0.2);
      });""",
    endtitle=["Connais tes droits", "avant d'emménager."],
    endacc="#a5b4fc",
    endrgb="165, 180, 252",
)

# ---------------------------------------------------------------- 28. LES ASSURANCES EN COPRO
SPECS["assurances"] = dict(
    comment="« LES ASSURANCES EN COPRO » — vidéo utile : qui doit assurer quoi. 130 BPM (breakbeat).",
    bpm=130,
    T=T4,
    vars="""        --bg1: #ecfeff;
        --bg2: #c9f1f7;
        --bg3: #93dbe8;
        --ink: #062a33;
        --acc: #0e7490;
        --pill: #062a33;
        --pillt: #67e8f9;
        --tipbg: #062a33;
        --tiph: #67e8f9;""",
    css="""      .um {
        position: absolute;
        top: 470px;
        width: 260px;
        text-align: center;
        opacity: 0.25;
      }
      .um svg {
        width: 260px;
        height: 220px;
      }
      .um .n {
        margin-top: 8px;
        font-size: 36px;
        font-weight: 900;
        letter-spacing: -0.03em;
        line-height: 1.05;
      }
      #drop {
        left: 300px;
        top: 860px;
        width: 480px;
        padding: 24px 30px;
        border-radius: 24px;
        background: #fff;
        text-align: center;
        font-size: 40px;
        font-weight: 900;
        letter-spacing: -0.02em;
        line-height: 1.1;
        box-shadow: 0 20px 40px rgba(6, 42, 51, 0.2);
        opacity: 0;
      }
""",
    html="""        <div class="um" id="u0" style="left: 70px"><svg viewBox="0 0 260 220"><path d="M20 120 Q130 0 240 120 Z" fill="#0e7490"/><path d="M130 120 V190 q0 20 -20 20" stroke="#062a33" stroke-width="10" fill="none"/></svg><div class="n">La copro</div></div>
        <div class="um" id="u1" style="left: 365px"><svg viewBox="0 0 260 220"><path d="M20 120 Q130 0 240 120 Z" fill="#f97316"/><path d="M130 120 V190 q0 20 -20 20" stroke="#062a33" stroke-width="10" fill="none"/></svg><div class="n">Toi, propriétaire</div></div>
        <div class="um" id="u2" style="left: 660px"><svg viewBox="0 0 260 220"><path d="M20 120 Q130 0 240 120 Z" fill="#8b5cf6"/><path d="M130 120 V190 q0 20 -20 20" stroke="#062a33" stroke-width="10" fill="none"/></svg><div class="n">Ton locataire</div></div>
        <div id="drop" class="abs">Dégât des eaux<br />jusqu'à 5&nbsp;000&nbsp;€ HT</div>""",
    cap="Les assurances en copro&nbsp;:<br /><span class=\"a\">qui assure quoi&nbsp;?</span>",
    count0="3 parapluies",
    countk="Règle ${k + 1}/4",
    tips=[
        ("LA COPRO", "Le syndicat doit assurer l'immeuble <b>en responsabilité civile</b>."),
        ("TOI, PROPRIÉTAIRE", "<b>Responsabilité civile obligatoire</b>, que tu habites l'appart ou que tu le loues."),
        ("TON LOCATAIRE", "Il doit s'assurer contre <b>les risques locatifs</b> et te donner l'attestation."),
        ("DÉGÂT DES EAUX", "Jusqu'à 5&nbsp;000&nbsp;€ HT, c'est en général <b>l'assureur du logement touché</b> qui gère."),
    ],
    know=[
        ("SI TU LOUES", "Une assurance <b>propriétaire non occupant</b> couvre ce que celle du locataire ne couvre pas."),
        ("TON CONTRAT", "Compare les <b>franchises</b>&nbsp;: c'est ce qui reste à ta charge."),
    ],
    setup="",
    js="""      T.forEach((t, k) => {
        if (k < 3) {
          tl.to(`#u${k}`, { opacity: 1, duration: 0.25 }, t);
          tl.fromTo(`#u${k} svg`, { y: -40, rotation: -10 }, { y: 0, rotation: 0, duration: 0.5, ease: "bounce.out", immediateRender: false }, t);
        } else {
          tl.fromTo("#drop", { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, t);
        }
      });""",
    endtitle=["Assure-toi bien", "dès la signature."],
    endacc="#67e8f9",
    endrgb="103, 232, 249",
)

# ---------------------------------------------------------------- 29. APRÈS LA SIGNATURE
SPECS["apres"] = dict(
    comment="« APRÈS LA SIGNATURE » — vidéo utile : 5 choses à faire quand tu as les clés. 108 BPM (soul).",
    bpm=108,
    T=T5,
    vars="""        --bg1: #fefce8;
        --bg2: #fdf1b0;
        --bg3: #f6dc5f;
        --ink: #262003;
        --acc: #a16207;
        --pill: #262003;
        --pillt: #fde047;
        --tipbg: #262003;
        --tiph: #fde047;""",
    css="""      #ring {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
      }
      .ktag {
        position: absolute;
        padding: 10px 18px;
        border-radius: 14px;
        background: #fff;
        border: 4px solid #a16207;
        font-size: 30px;
        font-weight: 900;
        letter-spacing: -0.01em;
        white-space: nowrap;
        opacity: 0.4;
      }
""",
    html="""        <svg id="ring" class="abs" viewBox="0 0 850 720"></svg>
        <div id="tags"></div>""",
    cap="Tu as les clés&nbsp;!<br /><span class=\"a\">5 choses à faire.</span>",
    count0="Trousseau",
    countk="Clé ${k + 1}/5",
    tips=[
        ("L'ASSURANCE", "Ton assurance habitation doit <b>démarrer le jour de l'acte</b>."),
        ("LES COMPTEURS", "Relève <b>eau, électricité, gaz</b> à la remise des clés et ouvre tes contrats."),
        ("LE SYNDIC", "Le notaire le prévient&nbsp;: demande ton <b>accès à l'espace en ligne</b>."),
        ("LA TAXE FONCIÈRE", "Celle de l'année est due par le vendeur, souvent <b>remboursée au prorata</b> dans l'acte."),
        ("LA PROCHAINE AG", "Tu votes dès la prochaine&nbsp;: <b>lis l'ordre du jour</b> en avance."),
    ],
    know=[
        ("À GARDER", "L'<b>acte de vente</b> et tous les documents de la copro, même après."),
        ("À FAIRE VITE", "Change ton adresse&nbsp;: <b>impôts, banque, assurance</b>."),
    ],
    setup="""      let r = `<circle cx="425" cy="150" r="70" fill="none" stroke="#a16207" stroke-width="18"/>`;
      const KX = [130, 270, 425, 580, 720];
      KX.forEach((x, k) => {
        r += `<g id="key${k}" opacity="0.35"><path d="M425 210 L${x} 330" stroke="#a16207" stroke-width="6"/><circle cx="${x}" cy="360" r="34" fill="#facc15" stroke="#262003" stroke-width="5"/><rect x="${x - 9}" y="390" width="18" height="170" fill="#facc15" stroke="#262003" stroke-width="5"/><rect x="${x + 9}" y="500" width="26" height="14" fill="#facc15" stroke="#262003" stroke-width="4"/><rect x="${x + 9}" y="530" width="18" height="14" fill="#facc15" stroke="#262003" stroke-width="4"/></g>`;
      });
      document.getElementById("ring").innerHTML = r;
      const TG = ["Assurance", "Compteurs", "Syndic", "Taxe foncière", "AG"];
      document.getElementById("tags").innerHTML = TG.map((t, k) => `<div class="ktag" id="kt${k}" style="left: ${70 + KX[k] - 70}px; top: ${450 + 600 + (k % 2) * 60}px">${t}</div>`).join("");""",
    js="""      T.forEach((t, k) => {
        tl.to(`#key${k}`, { opacity: 1, duration: 0.2 }, t);
        tl.fromTo(`#key${k}`, { rotation: -20, svgOrigin: "425 210" }, { rotation: 0, svgOrigin: "425 210", duration: 0.6, ease: "elastic.out(1.2, 0.4)", immediateRender: false }, t);
        tl.to(`#kt${k}`, { opacity: 1, backgroundColor: "#fde047", duration: 0.2 }, t + 0.1);
      });""",
    endtitle=["Bien acheter,", "jusqu'au bout."],
    endacc="#fde047",
    endrgb="253, 224, 71",
)

# ---------------------------------------------------------------- 30. LES 3 TYPES D'HUMIDITÉ
SPECS["humidite"] = dict(
    comment="« LES 3 TYPES D'HUMIDITÉ » — vidéo utile : condensation, remontées capillaires, infiltration, ventilation. 130 BPM (baile funk).",
    bpm=130,
    T=T4,
    vars="""        --bg1: #eff6ff;
        --bg2: #d4e6fb;
        --bg3: #a7c9f2;
        --ink: #0a1c33;
        --acc: #0369a1;
        --pill: #0a1c33;
        --pillt: #7dd3fc;
        --tipbg: #0a1c33;
        --tiph: #7dd3fc;""",
    css="""      #wall {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(10, 28, 51, 0.2);
      }
      .arr {
        opacity: 0;
      }
""",
    html="""        <svg id="wall" class="abs" viewBox="0 0 850 720"></svg>""",
    cap="L'humidité&nbsp;:<br /><span class=\"a\">d'où vient-elle&nbsp;?</span>",
    count0="Coupe d'un mur",
    countk="Type ${k + 1}/4",
    tips=[
        ("CONDENSATION", "Buée sur les vitres, moisissures dans les angles&nbsp;: <b>logement mal aéré</b>."),
        ("REMONTÉES CAPILLAIRES", "Bas des murs abîmés, <b>traces blanches</b>&nbsp;: souvent au rez-de-chaussée ancien."),
        ("INFILTRATION", "Une tache qui <b>apparaît après la pluie</b>&nbsp;: façade, toit ou fenêtre."),
        ("LA VENTILATION", "Grilles d'aération bouchées&nbsp;? <b>Ne les bouche jamais</b>&nbsp;: l'humidité reste."),
    ],
    know=[
        ("LE TEST", "Un <b>humidimètre</b> à quelques euros mesure l'humidité d'un mur."),
        ("À DEMANDER", "Y a-t-il eu des <b>sinistres liés à l'eau</b> ces dernières années&nbsp;?"),
    ],
    setup="""      let w = `<rect x="0" y="0" width="850" height="720" fill="#f8fafc"/><rect x="0" y="620" width="850" height="100" fill="#a8a29e"/>`;
      w += `<rect x="560" y="40" width="70" height="580" fill="#d6d3d1" stroke="#0a1c33" stroke-width="5"/>`;
      w += `<rect x="630" y="40" width="220" height="580" fill="#bae6fd"/>`;
      w += `<rect x="150" y="160" width="220" height="180" fill="#e0f2fe" stroke="#0a1c33" stroke-width="5"/>`;
      w += `<rect x="410" y="110" width="80" height="40" rx="6" fill="#e5e7eb" stroke="#0a1c33" stroke-width="4"/><path d="M420 122 h60 M420 132 h60 M420 142 h60" stroke="#0a1c33" stroke-width="3"/>`;
      // flèches : intérieur (condensation), sol (capillaires), extérieur (infiltration), grille (ventilation)
      w += `<g class="arr" id="r0"><circle cx="200" cy="200" r="10" fill="#0369a1"/><circle cx="240" cy="230" r="8" fill="#0369a1"/><circle cx="300" cy="190" r="9" fill="#0369a1"/><circle cx="330" cy="260" r="7" fill="#0369a1"/></g>`;
      w += `<g class="arr" id="r1"><path d="M595 610 V470" stroke="#0369a1" stroke-width="12" marker-end="url(#ah)"/><path d="M20 610 V500" stroke="#0369a1" stroke-width="12" marker-end="url(#ah)"/></g>`;
      w += `<g class="arr" id="r2"><path d="M800 220 H640" stroke="#0369a1" stroke-width="12" marker-end="url(#ah)"/><path d="M700 140 l-14 30 M740 120 l-14 30 M780 150 l-14 30" stroke="#0369a1" stroke-width="5"/></g>`;
      w += `<g class="arr" id="r3"><path d="M450 170 V260" stroke="#16a34a" stroke-width="12" marker-end="url(#ahg)"/><path d="M450 100 V40" stroke="#16a34a" stroke-width="12" marker-end="url(#ahg)"/></g>`;
      w += `<defs><marker id="ah" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="#0369a1"/></marker><marker id="ahg" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="#16a34a"/></marker></defs>`;
      document.getElementById("wall").innerHTML = w;""",
    js="""      T.forEach((t, k) => {
        if (k) tl.to(`#r${k - 1}`, { opacity: 0.25, duration: 0.2 }, t);
        tl.fromTo(`#r${k}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, t);
        shake("#wall", t, 4, 3);
      });""",
    endtitle=["Traque l'humidité", "avant d'acheter."],
    endacc="#7dd3fc",
    endrgb="125, 211, 252",
)

# ---------------------------------------------------------------- 31. LES ANIMAUX EN COPRO
SPECS["animaux"] = dict(
    comment="« LES ANIMAUX EN COPRO » — vidéo utile : ce que le règlement peut (ou pas) interdire. 82 BPM (lo-fi).",
    bpm=82,
    T=T4,
    vars="""        --bg1: #fff7ed;
        --bg2: #fde7cf;
        --bg3: #f5c79a;
        --ink: #2a1606;
        --acc: #c2410c;
        --pill: #2a1606;
        --pillt: #fdba74;
        --tipbg: #2a1606;
        --tiph: #fdba74;""",
    css="""      #doc {
        left: 70px;
        top: 450px;
        width: 850px;
        padding: 40px 44px 30px;
        border-radius: 26px;
        background: #fffdf8;
        box-shadow: 0 30px 60px rgba(42, 22, 6, 0.18);
      }
      #doc .t {
        font-size: 30px;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #9a3412;
        margin-bottom: 22px;
      }
      .cl {
        position: relative;
        padding: 20px 22px;
        margin-bottom: 14px;
        border-radius: 16px;
        background: #f5efe6;
        font-size: 36px;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.02em;
        opacity: 0.4;
      }
      .cl s {
        text-decoration: none;
      }
      .cl .bar {
        position: absolute;
        left: 18px;
        right: 18px;
        top: 50%;
        height: 6px;
        border-radius: 3px;
        background: #dc2626;
        transform: scaleX(0);
        transform-origin: left center;
      }
      .st {
        position: absolute;
        right: 14px;
        bottom: -16px;
        padding: 6px 14px;
        border: 5px solid;
        border-radius: 12px;
        background: #fffdf8;
        font-size: 28px;
        font-weight: 900;
        letter-spacing: 0.06em;
        opacity: 0;
      }
      .st.no {
        color: #dc2626;
      }
      .st.ok {
        color: #15803d;
      }
""",
    html="""        <div id="doc" class="abs" data-layout-allow-overlap>
          <div class="t">RÈGLEMENT DE COPROPRIÉTÉ · ART. 12</div>
          <div class="cl" id="c0">« Les animaux sont interdits dans les appartements. »<div class="bar"></div><div class="st no">NON ÉCRITE</div></div>
          <div class="cl" id="c1">« Les chiens d'attaque (1ʳᵉ catégorie) sont interdits. »<div class="st ok">VALABLE</div></div>
          <div class="cl" id="c2">« Aucune nuisance : aboiements, odeurs, dégâts. »<div class="st ok">VALABLE</div></div>
          <div class="cl" id="c3">« Chiens tenus en laisse dans les parties communes. »<div class="st ok">VALABLE</div></div>
        </div>""",
    cap="Ton chat, ton chien&nbsp;:<br /><span class=\"a\">la copro peut-elle dire non&nbsp;?</span>",
    count0="4 clauses",
    countk="Clause ${k + 1}/4",
    tips=[
        ("INTERDIRE LES ANIMAUX", "Une clause qui interdit les animaux familiers est <b>réputée non écrite</b>."),
        ("L'EXCEPTION", "Les <b>chiens de 1ʳᵉ catégorie</b> (dits d'attaque) peuvent être interdits."),
        ("LES NUISANCES", "Aboiements, odeurs, dégâts&nbsp;: <b>tu en restes responsable</b>."),
        ("LES PARTIES COMMUNES", "Le règlement peut imposer <b>la laisse et la propreté</b>."),
    ],
    know=[
        ("TU LOUES&nbsp;?", "Le bail ne peut pas interdire <b>un animal familier</b> à ton locataire."),
        ("UN DÉGÂT&nbsp;?", "Ascenseur rayé, moquette abîmée&nbsp;: <b>c'est le maître qui paie</b>."),
    ],
    setup="",
    js="""      T.forEach((t, k) => {
        if (k) tl.to(`#c${k - 1}`, { opacity: 0.55, duration: 0.2 }, t);
        tl.to(`#c${k}`, { opacity: 1, backgroundColor: "#ffedd5", duration: 0.25 }, t);
        if (k === 0) tl.to("#c0 .bar", { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, t + 0.3);
        tl.fromTo(`#c${k} .st`, { scale: 2.2, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.35, ease: "back.out(2)", immediateRender: false }, t + 0.6);
        shake("#doc", t + 0.6, 6, 3);
      });""",
    endtitle=["Ton animal", "a sa place."],
    endacc="#fdba74",
    endrgb="253, 186, 116",
)

# ---------------------------------------------------------------- 32. LIRE UN DOUBLE VITRAGE
SPECS["vitrage"] = dict(
    comment="« LIRE UN DOUBLE VITRAGE » — vidéo utile : date, composition, buée, performance. 118 BPM (disco).",
    bpm=118,
    T=T4,
    vars="""        --bg1: #f0fdfa;
        --bg2: #cdf3ea;
        --bg3: #99e0d0;
        --ink: #052e2a;
        --acc: #0f766e;
        --pill: #052e2a;
        --pillt: #5eead4;
        --tipbg: #052e2a;
        --tiph: #5eead4;""",
    css="""      #win {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
      }
      #stamp {
        left: 210px;
        top: 882px;
        width: 570px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 0.04em;
        color: #f1f5f9;
        border-radius: 6px;
      }
      #sect {
        left: 70px;
        top: 1000px;
        width: 850px;
        height: 180px;
        border-radius: 22px;
        background: #fff;
        box-shadow: 0 20px 40px rgba(5, 46, 42, 0.15);
        opacity: 0;
      }
      .lay {
        position: absolute;
        top: 30px;
        height: 80px;
        border-radius: 6px;
      }
      .ln {
        position: absolute;
        top: 122px;
        text-align: center;
        font-size: 28px;
        font-weight: 900;
        letter-spacing: -0.02em;
      }
      #uw {
        left: 640px;
        top: 500px;
        width: 240px;
        padding: 18px 10px;
        border-radius: 22px;
        background: #052e2a;
        color: #5eead4;
        text-align: center;
        font-size: 54px;
        font-weight: 900;
        letter-spacing: -0.03em;
        line-height: 1;
        opacity: 0;
      }
      #uw small {
        display: block;
        margin-top: 8px;
        font-size: 24px;
        color: #ccfbf1;
        letter-spacing: 0;
      }
""",
    html="""        <svg id="win" class="abs" viewBox="0 0 850 720"></svg>
        <div id="stamp" class="abs" data-layout-allow-overlap>04/2009 · VITRERIE NORD · 4/16/4</div>
        <div id="sect" class="abs">
          <div class="lay" style="left: 150px; width: 70px; background: #67e8f9"></div>
          <div class="lay" style="left: 220px; width: 410px; background: #ecfeff; border: 4px dashed #94a3b8"></div>
          <div class="lay" style="left: 630px; width: 70px; background: #67e8f9"></div>
          <div class="ln" style="left: 95px; width: 180px">4 mm verre</div>
          <div class="ln" style="left: 275px; width: 300px">16 mm d'air ou de gaz</div>
          <div class="ln" style="left: 575px; width: 180px">4 mm verre</div>
        </div>
        <div id="uw" class="abs" data-layout-allow-overlap>Uw 1,3<small>W/m².K</small></div>""",
    cap="Ton double vitrage&nbsp;:<br /><span class=\"a\">ce qu'il te dit.</span>",
    count0="Une fenêtre",
    countk="Indice ${k + 1}/4",
    tips=[
        ("L'INTERCALAIRE", "La barrette entre les vitres porte <b>la date de fabrication</b>."),
        ("4/16/4", "<b>Verre 4 mm, lame de 16 mm, verre 4 mm</b>&nbsp;: la composition du vitrage."),
        ("DE LA BUÉE ENTRE LES VITRES", "Le vitrage n'est <b>plus étanche</b>&nbsp;: il est à changer."),
        ("LE COEFFICIENT Uw", "<b>Plus il est bas, mieux la fenêtre isole</b>. 1,3 ou moins, c'est performant."),
    ],
    know=[
        ("LE SURVITRAGE", "Une 2ᵉ vitre ajoutée sur un vieux châssis&nbsp;: <b>moins efficace</b> qu'un vrai double vitrage."),
        ("À LA VISITE", "Ouvre chaque fenêtre&nbsp;: elle doit <b>fermer sans forcer</b>, joints souples."),
    ],
    setup="""      let w = `<rect x="40" y="0" width="770" height="520" rx="18" fill="#f8fafc" stroke="#052e2a" stroke-width="6"/>`;
      w += `<rect x="100" y="50" width="650" height="420" fill="#475569"/>`;
      w += `<rect x="122" y="72" width="606" height="358" fill="#bfeff5"/>`;
      w += `<path d="M170 110 L300 110 L170 240 Z" fill="#fff" opacity="0.55"/><path d="M560 380 L690 260 L690 300 L600 380 Z" fill="#fff" opacity="0.4"/>`;
      w += `<g id="fog" opacity="0"><ellipse cx="330" cy="300" rx="170" ry="90" fill="#fff" opacity="0.75"/><ellipse cx="520" cy="230" rx="150" ry="70" fill="#fff" opacity="0.6"/><ellipse cx="420" cy="380" rx="200" ry="50" fill="#fff" opacity="0.65"/></g>`;
      w += `<rect id="hl" x="136" y="431" width="578" height="38" rx="8" fill="#facc15" opacity="0"/>`;
      document.getElementById("win").innerHTML = w;""",
    js="""      tl.to("#hl", { opacity: 0.9, duration: 0.2 }, T[0]);
      tl.to("#stamp", { color: "#052e2a", duration: 0.2 }, T[0]);
      tl.fromTo("#stamp", { scale: 1 }, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.inOut", immediateRender: false }, T[0] + 0.1);
      tl.fromTo("#sect", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, T[1]);
      tl.to("#sect", { opacity: 0.3, duration: 0.2 }, T[2]);
      tl.to("#hl", { opacity: 0, duration: 0.2 }, T[2]);
      tl.to("#stamp", { color: "#f1f5f9", duration: 0.2 }, T[2]);
      tl.to("#fog", { opacity: 1, duration: 1.2, ease: "power1.inOut" }, T[2]);
      tl.to("#fog", { opacity: 0.25, duration: 0.3 }, T[3]);
      tl.fromTo("#uw", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T[3]);""",
    endtitle=["Lis tes fenêtres", "avant d'acheter."],
    endacc="#5eead4",
    endrgb="94, 234, 212",
)

# ---------------------------------------------------------------- 33. LA FIBRE DANS L'IMMEUBLE
SPECS["fibre"] = dict(
    comment="« LA FIBRE DANS L'IMMEUBLE » — vidéo utile : vérifier, repérer, faire installer. 172 BPM (drum & bass).",
    bpm=172,
    T=T4,
    vars="""        --bg1: #1a1240;
        --bg2: #100a2e;
        --bg3: #07041a;
        --ink: #f5f3ff;
        --acc: #22d3ee;
        --pill: #22d3ee;
        --pillt: #07041a;
        --tipbg: #22d3ee;
        --tiph: #4c1d95;""",
    css="""      #bld {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
      }
      #map {
        left: 560px;
        top: 470px;
        padding: 14px 20px;
        border-radius: 16px;
        background: #f5f3ff;
        color: #07041a;
        font-size: 30px;
        font-weight: 900;
        letter-spacing: -0.02em;
        white-space: nowrap;
        opacity: 0;
      }
      .tip {
        color: #07041a;
      }
""",
    html="""        <svg id="bld" class="abs" viewBox="0 0 850 720"></svg>
        <div id="map" class="abs">Éligible fibre ?</div>""",
    cap="La fibre dans l'immeuble&nbsp;:<br /><span class=\"a\">vérifie avant d'acheter.</span>",
    count0="Ton immeuble",
    countk="Étape ${k + 1}/4",
    tips=[
        ("LA CARTE", "Tape l'adresse sur la carte <b>« Ma connexion internet »</b> de l'Arcep."),
        ("SUR LE PALIER", "Un <b>boîtier fibre</b> sur le palier ou dans la gaine&nbsp;: l'immeuble est câblé."),
        ("DANS L'APPART", "Une <b>prise optique</b> au mur&nbsp;: le logement est déjà raccordé."),
        ("PAS ENCORE FIBRÉ&nbsp;?", "La proposition d'un opérateur est <b>votée en AG</b>&nbsp;: l'installation est à ses frais."),
    ],
    know=[
        ("TON DROIT", "On ne peut pas t'empêcher de te raccorder <b>sans motif sérieux</b>."),
        ("LE MOBILE", "Regarde aussi la <b>couverture 4G/5G</b> sur la carte de l'Arcep."),
    ],
    setup="""      let w = `<rect x="140" y="80" width="460" height="560" fill="#2a2160" stroke="#a78bfa" stroke-width="5"/><path d="M120 80 L370 10 L620 80 Z" fill="#3b2f7a" stroke="#a78bfa" stroke-width="5"/>`;
      for (let f = 0; f < 4; f++) {
        const y = 100 + f * 135;
        w += `<path d="M140 ${y + 125} H600" stroke="#a78bfa" stroke-width="3" opacity="0.6"/>`;
        for (let i = 0; i < 3; i++) w += `<rect x="${175 + i * 140}" y="${y + 20}" width="90" height="70" rx="6" fill="#4c3f99"/>`;
      }
      w += `<rect x="0" y="640" width="850" height="80" fill="#1e1a3a"/>`;
      w += `<path id="cable" d="M0 690 H360 V560 V290" stroke="#22d3ee" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="760" stroke-dashoffset="760"/>`;
      w += `<path id="drop" d="M380 290 H470 V250" stroke="#22d3ee" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="140" stroke-dashoffset="140"/>`;
      w += `<g id="pb" opacity="0.3"><rect x="345" y="270" width="50" height="40" rx="6" fill="#f5f3ff"/><circle cx="370" cy="290" r="8" fill="#22d3ee"/></g>`;
      w += `<g id="pto" opacity="0.3"><rect x="452" y="222" width="36" height="36" rx="6" fill="#f5f3ff"/><circle cx="470" cy="240" r="7" fill="#22d3ee"/></g>`;
      w += `<g id="pin" opacity="0"><path d="M700 230 c-40 -50 -40 -110 0 -110 c40 0 40 60 0 110 Z" fill="#22d3ee"/><circle cx="700" cy="155" r="16" fill="#07041a"/></g>`;
      w += `<g id="ag" opacity="0"><rect x="640" y="380" width="190" height="130" rx="16" fill="#f5f3ff"/><path d="M690 445 l25 25 l55 -55" stroke="#16a34a" stroke-width="14" fill="none" stroke-linecap="round"/></g>`;
      document.getElementById("bld").innerHTML = w;""",
    js="""      tl.fromTo("#pin", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.45, ease: "bounce.out", immediateRender: false }, T[0]);
      tl.fromTo("#map", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, T[0] + 0.3);
      tl.to("#map", { opacity: 0, duration: 0.2 }, T[1]);
      tl.to("#cable", { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, T[1]);
      tl.to("#pb", { opacity: 1, duration: 0.2 }, T[1] + 0.9);
      tl.fromTo("#pb", { scale: 1 }, { scale: 1.4, svgOrigin: "370 290", duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T[1] + 0.9);
      tl.to("#drop", { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, T[2]);
      tl.to("#pto", { opacity: 1, duration: 0.2 }, T[2] + 0.4);
      tl.fromTo("#pto", { scale: 1 }, { scale: 1.5, svgOrigin: "470 240", duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T[2] + 0.4);
      tl.fromTo("#ag", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, svgOrigin: "735 445", duration: 0.4, ease: "back.out(2)", immediateRender: false }, T[3]);
      T.forEach((t) => shake("#bld", t, 4, 3));""",
    endtitle=["Vérifie la fibre", "avant de signer."],
    endacc="#22d3ee",
    endrgb="34, 211, 238",
)

# ---------------------------------------------------------------- 34. LE TEST DE FUITE AU COMPTEUR
SPECS["fuite"] = dict(
    comment="« LE TEST DE FUITE » — vidéo utile : repérer une fuite cachée avec le compteur d'eau. 100 BPM (gospel).",
    bpm=100,
    T=T5,
    vars="""        --bg1: #f0f9ff;
        --bg2: #d6ecfb;
        --bg3: #a5d3f3;
        --ink: #04213a;
        --acc: #0284c7;
        --pill: #04213a;
        --pillt: #7dd3fc;
        --tipbg: #04213a;
        --tiph: #7dd3fc;""",
    css="""      #meter {
        left: 190px;
        top: 450px;
        width: 610px;
        height: 610px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 40%, #ffffff 0%, #e2e8f0 70%, #94a3b8 100%);
        border: 18px solid #1e3a5f;
        box-shadow: 0 30px 60px rgba(4, 33, 58, 0.25);
      }
      #odo {
        position: absolute;
        left: 95px;
        top: 150px;
        width: 384px;
        height: 96px;
        display: flex;
        border-radius: 12px;
        overflow: hidden;
        border: 5px solid #04213a;
      }
      .dg {
        flex: 1;
        height: 86px;
        overflow: hidden;
        background: #04213a;
        color: #f8fafc;
        border-right: 2px solid #334155;
      }
      .dg.r {
        background: #dc2626;
      }
      .dg div {
        height: 86px;
        line-height: 86px;
        text-align: center;
        font-size: 60px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }
      #unit {
        position: absolute;
        left: 0;
        right: 0;
        top: 262px;
        text-align: center;
        font-size: 30px;
        font-weight: 800;
        color: #334155;
      }
      #star {
        position: absolute;
        left: 255px;
        top: 340px;
        width: 64px;
        height: 64px;
      }
      #clock {
        left: 70px;
        top: 450px;
        width: 150px;
        height: 150px;
        opacity: 0;
      }
      #drip {
        left: 120px;
        top: 700px;
        width: 760px;
        padding: 22px 28px;
        border-radius: 22px;
        background: #fff;
        text-align: center;
        font-size: 40px;
        font-weight: 900;
        letter-spacing: -0.02em;
        box-shadow: 0 20px 40px rgba(4, 33, 58, 0.18);
        opacity: 0;
      }
      #drip b {
        color: #0284c7;
      }
""",
    html="""        <div id="meter" class="abs">
          <div id="odo"></div>
          <div id="unit">m³ · litres en rouge</div>
          <svg id="star" viewBox="-32 -32 64 64"><g id="wheel"><path d="M0 -28 L8 -8 L28 0 L8 8 L0 28 L-8 8 L-28 0 L-8 -8 Z" fill="#dc2626"/><circle r="6" fill="#04213a"/></g></svg>
        </div>
        <svg id="clock" class="abs" viewBox="0 0 180 180"><circle cx="90" cy="90" r="80" fill="#fff" stroke="#04213a" stroke-width="10"/><path id="hand" d="M90 90 V30" stroke="#0284c7" stroke-width="10" stroke-linecap="round"/><circle cx="90" cy="90" r="9" fill="#04213a"/></svg>
        <div id="drip" class="abs" data-layout-allow-overlap>Chasse d'eau&nbsp;: <b>2 gouttes de colorant</b> dans le réservoir</div>""",
    cap="Une fuite cachée&nbsp;?<br /><span class=\"a\">Le test du compteur.</span>",
    count0="Compteur d'eau",
    countk="Étape ${k + 1}/5",
    tips=[
        ("ÉTAPE 1", "Ferme tous les robinets et <b>note l'index</b> du compteur."),
        ("ÉTAPE 2", "Attends <b>1 à 2 heures</b> sans utiliser d'eau."),
        ("ÉTAPE 3", "L'index a bougé ou <b>la petite roue tourne</b>&nbsp;? Il y a une fuite."),
        ("LA CHASSE D'EAU", "La cuvette se colore <b>sans tirer la chasse</b>&nbsp;? Elle fuit."),
        ("LE ROBINET QUI GOUTTE", "Environ <b>120 litres par jour</b>&nbsp;: à réparer vite."),
    ],
    know=[
        ("ABONNÉ EN DIRECT&nbsp;?", "Fuite sur une canalisation après compteur&nbsp;: la facture peut être <b>plafonnée</b> si tu répares."),
        ("EN COPRO", "Demande s'il y a <b>un compteur individuel</b> ou si l'eau est dans les charges."),
    ],
    setup="""      const A = "00412", B = "318", C = "341";
      let h = "";
      for (let i = 0; i < 8; i++) {
        const red = i >= 5;
        const d0 = (A + B)[i], d1 = (A + C)[i];
        h += `<div class="dg${red ? " r" : ""}"><div class="rl" id="d${i}"><div>${d0}</div><div>${d1}</div></div></div>`;
      }
      document.getElementById("odo").innerHTML = h;""",
    js="""      tl.fromTo("#odo", { scale: 1 }, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.inOut", immediateRender: false }, T[0]);
      tl.fromTo("#clock", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T[1]);
      tl.fromTo("#hand", { rotation: 0, svgOrigin: "90 90" }, { rotation: 720, svgOrigin: "90 90", duration: 3.2, ease: "power1.inOut", immediateRender: false }, T[1] + 0.2);
      tl.to("#clock", { opacity: 0, duration: 0.2 }, T[2]);
      [6, 7].forEach((i) => tl.to(`#d${i}`, { y: -86, duration: 0.5, ease: "power2.inOut" }, T[2] + 0.1 * (i - 5)));
      tl.fromTo("#wheel", { rotation: 0, svgOrigin: "0 0" }, { rotation: 1080, svgOrigin: "0 0", duration: 3.4, ease: "none", immediateRender: false }, T[2]);
      shake("#meter", T[2] + 0.6, 6, 3);
      tl.to("#meter", { opacity: 0.2, duration: 0.25 }, T[3]);
      tl.to("#meter", { opacity: 1, duration: 0.25 }, T[4]);
      tl.fromTo("#drip", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T[3]);
      tl.to("#drip", { opacity: 0, duration: 0.2 }, T[4]);""",
    endtitle=["Une fuite cachée", "se voit au compteur."],
    endacc="#7dd3fc",
    endrgb="125, 211, 252",
)

# ---------------------------------------------------------------- 35. LE CHAUFFE-EAU
SPECS["ballon"] = dict(
    comment="« LE CHAUFFE-EAU » — vidéo utile : capacité, âge, groupe de sécurité, heures creuses. 104 BPM (mambo).",
    bpm=104,
    T=T4,
    vars="""        --bg1: #fdf2f8;
        --bg2: #f9d9ea;
        --bg3: #f0a8cc;
        --ink: #34061d;
        --acc: #be185d;
        --pill: #34061d;
        --pillt: #f9a8d4;
        --tipbg: #34061d;
        --tiph: #f9a8d4;""",
    css="""      #tank {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 760px;
      }
      .lab {
        position: absolute;
        padding: 12px 18px;
        border-radius: 16px;
        background: #34061d;
        color: #f9a8d4;
        font-size: 34px;
        font-weight: 900;
        letter-spacing: -0.02em;
        white-space: nowrap;
        opacity: 0;
      }
""",
    html="""        <svg id="tank" class="abs" viewBox="0 0 850 760"></svg>
        <div class="lab" id="l0" style="left: 600px; top: 560px">200 L · 4 pers.</div>
        <div class="lab" id="l1" style="left: 600px; top: 750px">Année : 2009</div>
        <div class="lab" id="l2" style="left: 600px; top: 1082px">Goutte : normal</div>
        <div class="lab" id="l3" style="left: 600px; top: 660px">Chauffe la nuit</div>""",
    cap="Le chauffe-eau&nbsp;:<br /><span class=\"a\">4 choses à regarder.</span>",
    count0="Le ballon",
    countk="Point ${k + 1}/4",
    tips=[
        ("LA CAPACITÉ", "Compte environ <b>50 litres par personne</b>&nbsp;: 200 L pour 4."),
        ("L'ÂGE", "Il dure en général <b>10 à 15 ans</b>&nbsp;: lis l'année sur la plaque."),
        ("LE GROUPE DE SÉCURITÉ", "Il <b>goutte un peu pendant la chauffe</b>&nbsp;: c'est normal. Fais-le jouer chaque mois."),
        ("LES HEURES CREUSES", "Vérifie qu'il <b>chauffe la nuit</b>&nbsp;: c'est moins cher."),
    ],
    know=[
        ("THERMODYNAMIQUE", "Un chauffe-eau thermodynamique consomme <b>2 à 3 fois moins</b>."),
        ("EAU CHAUDE COLLECTIVE&nbsp;?", "Elle est dans les charges&nbsp;: demande <b>le relevé de ton compteur</b>."),
    ],
    setup="""      let w = `<defs><clipPath id="tc"><rect x="170" y="60" width="300" height="560" rx="150"/></clipPath></defs>`;
      w += `<rect x="170" y="60" width="300" height="560" rx="150" fill="#fff" stroke="#34061d" stroke-width="8"/>`;
      w += `<g clip-path="url(#tc)"><rect id="lvl" x="170" y="620" width="300" height="560" fill="#fb7185" opacity="0.8"/></g>`;
      w += `<g id="plate" opacity="0.5"><rect x="240" y="290" width="160" height="90" rx="8" fill="#e5e7eb" stroke="#34061d" stroke-width="4"/><path d="M258 315 h124 M258 335 h90 M258 355 h110" stroke="#34061d" stroke-width="5"/></g>`;
      w += `<path d="M260 620 V670 M380 620 V650" stroke="#34061d" stroke-width="12"/>`;
      w += `<g id="grp" opacity="0.5"><rect x="350" y="640" width="60" height="50" rx="8" fill="#be185d" stroke="#34061d" stroke-width="4"/><path d="M380 690 V705" stroke="#34061d" stroke-width="8"/><path id="drop" d="M380 712 c-10 14 -10 24 0 24 c10 0 10 -10 0 -24 Z" fill="#0ea5e9" opacity="0"/></g>`;
      w += `<g id="moon" opacity="0"><circle cx="640" cy="120" r="44" fill="#34061d"/><circle cx="660" cy="106" r="40" fill="#f9d9ea"/></g>`;
      w += `<path id="p0" d="M470 150 H520" stroke="#34061d" stroke-width="5" opacity="0"/><path id="p1" d="M400 335 H520" stroke="#34061d" stroke-width="5" opacity="0"/><path id="p2" d="M410 665 H520" stroke="#34061d" stroke-width="5" opacity="0"/>`;
      document.getElementById("tank").innerHTML = w;""",
    js="""      tl.to("#lvl", { attr: { y: 120 }, duration: 1.4, ease: "power2.out" }, T[0]);
      tl.to("#p0", { opacity: 1, duration: 0.2 }, T[0] + 0.4);
      tl.fromTo("#l0", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, T[0] + 0.4);
      tl.to(["#l0", "#p0"], { opacity: 0.35, duration: 0.2 }, T[1]);
      tl.to("#plate", { opacity: 1, duration: 0.2 }, T[1]);
      tl.to("#p1", { opacity: 1, duration: 0.2 }, T[1] + 0.2);
      tl.fromTo("#l1", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, T[1] + 0.2);
      tl.to(["#l1", "#p1", "#plate"], { opacity: 0.35, duration: 0.2 }, T[2]);
      tl.to("#grp", { opacity: 1, duration: 0.2 }, T[2]);
      tl.to("#p2", { opacity: 1, duration: 0.2 }, T[2] + 0.2);
      tl.fromTo("#l2", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, T[2] + 0.2);
      for (let i = 0; i < 3; i++) tl.fromTo("#drop", { opacity: 1, y: 0 }, { opacity: 0, y: 18, duration: 0.8, ease: "power2.in", immediateRender: false }, T[2] + 0.4 + i * 1.2);
      tl.to(["#l0", "#l1", "#l2", "#p0", "#p1", "#p2"], { opacity: 0, duration: 0.2 }, T[3]);
      tl.to("#grp", { opacity: 0.35, duration: 0.2 }, T[3]);
      tl.fromTo("#moon", { opacity: 0, rotation: -40, svgOrigin: "640 120" }, { opacity: 1, rotation: 0, svgOrigin: "640 120", duration: 0.5, ease: "back.out(2)", immediateRender: false }, T[3]);
      tl.fromTo("#l3", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, T[3] + 0.2);
      T.forEach((t) => shake("#tank", t, 4, 3));""",
    endtitle=["Regarde le ballon", "à la visite."],
    endacc="#f9a8d4",
    endrgb="249, 168, 212",
)

# ---------------------------------------------------------------- 36. CONTESTER UNE DÉCISION D'AG
SPECS["contester"] = dict(
    comment="« CONTESTER UNE DÉCISION D'AG » — vidéo utile : qui peut, quel délai, où, pourquoi. 122 BPM (deep house).",
    bpm=122,
    T=T4,
    vars="""        --bg1: #eef2ff;
        --bg2: #d9defc;
        --bg3: #b2bcf5;
        --ink: #14123a;
        --acc: #4338ca;
        --pill: #14123a;
        --pillt: #a5b4fc;
        --tipbg: #14123a;
        --tiph: #a5b4fc;""",
    css="""      .vt {
        position: absolute;
        top: 450px;
        width: 195px;
        height: 130px;
        border-radius: 22px;
        background: #fff;
        border: 5px solid #c7cdf5;
        text-align: center;
        line-height: 120px;
        font-size: 32px;
        font-weight: 900;
        letter-spacing: -0.02em;
        opacity: 0.45;
      }
      .vt.on {
        border-color: #4338ca;
      }
      #tline {
        left: 70px;
        top: 630px;
        width: 850px;
        height: 180px;
        padding: 26px 34px;
        border-radius: 24px;
        background: #fff;
        box-shadow: 0 20px 40px rgba(20, 18, 58, 0.14);
        opacity: 0;
      }
      #tline .rail {
        position: absolute;
        left: 34px;
        right: 34px;
        top: 80px;
        height: 22px;
        border-radius: 11px;
        background: #e0e4fb;
      }
      #fill {
        position: absolute;
        left: 34px;
        right: 34px;
        top: 80px;
        height: 22px;
        border-radius: 11px;
        background: #4338ca;
        transform-origin: left center;
      }
      .tk {
        position: absolute;
        top: 116px;
        font-size: 30px;
        font-weight: 800;
      }
      #dl {
        position: absolute;
        right: 34px;
        top: 18px;
        font-size: 44px;
        font-weight: 900;
        color: #4338ca;
        letter-spacing: -0.03em;
      }
      #court {
        left: 70px;
        top: 850px;
        width: 850px;
        padding: 26px 34px;
        border-radius: 24px;
        background: #14123a;
        color: #fff;
        font-size: 44px;
        font-weight: 900;
        letter-spacing: -0.03em;
        opacity: 0;
      }
      #court b {
        color: #a5b4fc;
      }
      .why {
        position: absolute;
        padding: 16px 24px;
        border-radius: 999px;
        background: #fff;
        border: 5px solid #4338ca;
        font-size: 34px;
        font-weight: 900;
        letter-spacing: -0.02em;
        white-space: nowrap;
        opacity: 0;
      }
""",
    html="""        <div class="vt" id="v0" style="left: 70px">Pour</div>
        <div class="vt" id="v1" style="left: 288px">Abstention</div>
        <div class="vt on" id="v2" style="left: 506px">Contre</div>
        <div class="vt on" id="v3" style="left: 724px">Absent</div>
        <div id="tline" class="abs"><div class="rail"></div><div id="fill"></div><div class="tk" style="left: 34px">PV notifié</div><div class="tk" style="right: 34px">Trop tard</div><div id="dl">2 mois</div></div>
        <div id="court" class="abs">Tribunal judiciaire <b>+ avocat</b></div>
        <div class="why" id="w0" style="left: 70px; top: 990px">Mauvaise majorité</div>
        <div class="why" id="w1" style="left: 470px; top: 990px">Convocation irrégulière</div>
        <div class="why" id="w2" style="left: 70px; top: 1095px">Abus de majorité</div>""",
    cap="Une décision d'AG injuste&nbsp;?<br /><span class=\"a\">Tu peux la contester.</span>",
    count0="Ton vote",
    countk="Règle ${k + 1}/4",
    tips=[
        ("QUI PEUT", "Seuls ceux qui ont <b>voté contre</b>, ou qui étaient <b>absents et non représentés</b>."),
        ("LE DÉLAI", "<b>2 mois</b> à partir de la notification du procès-verbal. Après, c'est fini."),
        ("OÙ", "Devant le <b>tribunal judiciaire</b>, avec un avocat."),
        ("POURQUOI", "Une majorité mal appliquée, une convocation irrégulière ou <b>un abus de majorité</b>."),
    ],
    know=[
        ("LE PV", "Le syndic doit te le notifier <b>dans le mois</b> qui suit l'AG."),
        ("LES TRAVAUX", "Sauf urgence, les gros travaux votés <b>attendent la fin des 2 mois</b>."),
    ],
    setup="",
    js="""      tl.to(["#v2", "#v3"], { opacity: 1, backgroundColor: "#e0e7ff", duration: 0.25 }, T[0]);
      tl.fromTo(["#v2", "#v3"], { y: 0 }, { y: -18, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out", stagger: 0.1, immediateRender: false }, T[0]);
      tl.to(["#v0", "#v1"], { opacity: 0.2, duration: 0.25 }, T[0] + 0.3);
      tl.fromTo("#tline", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T[1]);
      tl.fromTo("#fill", { scaleX: 0 }, { scaleX: 1, duration: 2.4, ease: "power1.inOut" }, T[1] + 0.3);
      tl.to("#fill", { backgroundColor: "#dc2626", duration: 0.3 }, T[1] + 2.5);
      tl.fromTo("#court", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T[2]);
      shake("#court", T[2] + 0.35, 6, 3);
      [0, 1, 2].forEach((i) => tl.fromTo(`#w${i}`, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }, T[3] + i * 0.35));""",
    endtitle=["Connais le délai,", "garde ta voix."],
    endacc="#a5b4fc",
    endrgb="165, 180, 252",
)

# ---------------------------------------------------------------- 37. LE PALIER ANNEXÉ
SPECS["annexion"] = dict(
    comment="« LE PALIER ANNEXÉ » — vidéo utile : une partie commune privatisée sans vote. 132 BPM (UK garage).",
    bpm=132,
    T=T4,
    vars="""        --bg1: #fef2f2;
        --bg2: #fbd9d9;
        --bg3: #f2a9a9;
        --ink: #3b0a0a;
        --acc: #b91c1c;
        --pill: #3b0a0a;
        --pillt: #fca5a5;
        --tipbg: #3b0a0a;
        --tiph: #fca5a5;""",
    css="""      #plan {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(59, 10, 10, 0.16);
      }
      .pl {
        position: absolute;
        text-align: center;
        font-size: 34px;
        font-weight: 900;
        letter-spacing: -0.02em;
        color: #3b0a0a;
      }
      .bd {
        position: absolute;
        left: 590px;
        width: 290px;
        padding: 14px 18px;
        border-radius: 16px;
        text-align: center;
        font-size: 30px;
        font-weight: 900;
        letter-spacing: -0.02em;
        line-height: 1.1;
        opacity: 0;
      }
""",
    html="""        <svg id="plan" class="abs" viewBox="0 0 850 720"></svg>
        <div class="pl" style="left: 110px; top: 690px; width: 380px">Lot 12</div>
        <div class="pl" style="left: 570px; top: 890px; width: 310px">Lot 13</div>
        <div class="pl" style="left: 400px; top: 1030px; width: 400px">Palier commun</div>
        <div class="pl" id="q" style="left: 110px; top: 1025px; width: 220px; color: #b91c1c; opacity: 0; font-size: 60px">?</div>
        <div class="bd" id="b0" style="top: 520px; background: #b91c1c; color: #fff" data-layout-allow-overlap>Sans vote&nbsp;: à remettre en état</div>
        <div class="bd" id="b1" style="top: 650px; background: #3b0a0a; color: #fca5a5" data-layout-allow-overlap>Vote art.&nbsp;26 + notaire</div>
        <div class="bd" id="b2" style="top: 780px; background: #15803d; color: #fff" data-layout-allow-overlap>Inscrit dans ton lot&nbsp;?</div>""",
    cap="Le bout de palier fermé&nbsp;:<br /><span class=\"a\">à qui est-il vraiment&nbsp;?</span>",
    count0="Plan d'étage",
    countk="Règle ${k + 1}/4",
    tips=[
        ("LE PIÈGE", "Bout de palier fermé, combles aménagés&nbsp;: <b>souvent des parties communes</b>."),
        ("SANS VOTE", "C'est une appropriation&nbsp;: la copro peut exiger <b>la remise en état</b>."),
        ("RÉGULARISER", "Vente votée en AG (art.&nbsp;26), <b>acte chez le notaire</b>, état descriptif modifié."),
        ("À LA VISITE", "Vérifie que chaque mètre carré figure <b>dans ton lot</b>, sur l'état descriptif."),
    ],
    know=[
        ("30 ANS", "Après 30 ans d'occupation paisible et publique, <b>la prescription</b> peut jouer."),
        ("L'ACTE", "Ce qui n'est pas dans ton acte <b>ne t'appartient pas</b>, même si le vendeur l'utilisait."),
    ],
    setup="""      let w = `<defs><pattern id="hz" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="#fee2e2"/><path d="M0 0 V18" stroke="#b91c1c" stroke-width="7"/></pattern></defs>`;
      w += `<rect x="40" y="40" width="440" height="480" fill="#fafaf9"/><rect x="500" y="40" width="310" height="480" fill="#fafaf9"/><rect x="40" y="520" width="770" height="160" fill="#f5f5f4"/>`;
      w += `<g id="zone" opacity="0"><rect x="40" y="520" width="220" height="160" fill="url(#hz)"/></g>`;
      w += `<path d="M40 40 H810 V680 H40 Z M480 40 V520 M500 40 V520 M40 520 H120 M190 520 H600 M670 520 H810" stroke="#3b0a0a" stroke-width="10" fill="none"/>`;
      for (let i = 0; i < 6; i++) w += `<path d="M${700 + i * 18} 560 V660" stroke="#a8a29e" stroke-width="5"/>`;
      w += `<path id="nw" d="M260 520 V680" stroke="#b91c1c" stroke-width="14" fill="none" stroke-dasharray="160" stroke-dashoffset="160"/>`;
      w += `<path id="door" d="M260 600 L330 600" stroke="#b91c1c" stroke-width="8" opacity="0"/>`;
      document.getElementById("plan").innerHTML = w;""",
    js="""      tl.to("#nw", { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, T[0]);
      tl.to("#door", { opacity: 1, duration: 0.2 }, T[0] + 0.5);
      tl.to("#zone", { opacity: 1, duration: 0.4 }, T[0] + 0.6);
      tl.fromTo("#q", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, T[0] + 0.8);
      [0, 1, 2].forEach((i) => {
        tl.fromTo(`#b${i}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T[i + 1]);
        if (i) tl.to(`#b${i - 1}`, { opacity: 0.35, duration: 0.2 }, T[i + 1]);
      });
      tl.fromTo("#zone", { opacity: 1 }, { opacity: 0.4, duration: 0.25, yoyo: true, repeat: 3, immediateRender: false }, T[1]);
      shake("#plan", T[1], 8, 4);""",
    endtitle=["Chaque mètre carré", "doit être dans l'acte."],
    endacc="#fca5a5",
    endrgb="252, 165, 165",
)

# ---------------------------------------------------------------- 38. LES SERVITUDES
SPECS["servitudes"] = dict(
    comment="« LES SERVITUDES » — vidéo utile : des droits invisibles sur ton terrain. 100 BPM (cumbia).",
    bpm=100,
    T=T4,
    vars="""        --bg1: #f0fdf4;
        --bg2: #d3f5de;
        --bg3: #9fe0b5;
        --ink: #052e16;
        --acc: #15803d;
        --pill: #052e16;
        --pillt: #86efac;
        --tipbg: #052e16;
        --tiph: #86efac;""",
    css="""      #site {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
        border-radius: 26px;
        overflow: hidden;
        box-shadow: 0 30px 60px rgba(5, 46, 22, 0.16);
      }
      .sl {
        position: absolute;
        text-align: center;
        font-size: 32px;
        font-weight: 900;
        letter-spacing: -0.02em;
        color: #052e16;
      }
      #mon {
        left: 500px;
        top: 470px;
        padding: 12px 18px;
        border-radius: 16px;
        background: #052e16;
        color: #86efac;
        font-size: 30px;
        font-weight: 900;
        white-space: nowrap;
        opacity: 0;
      }
""",
    html="""        <svg id="site" class="abs" viewBox="0 0 850 720"></svg>
        <div class="sl" style="left: 110px; top: 540px; width: 400px">Voisin</div>
        <div class="sl" style="left: 120px; top: 850px; width: 300px; color: #fff">Ton immeuble</div>
        <div class="sl" style="left: 445px; top: 1102px; width: 100px; color: #fff; background: #57534e; border-radius: 10px">Rue</div>
        <div id="mon" class="abs" data-layout-allow-overlap>Monument à 500 m</div>""",
    cap="Les servitudes&nbsp;:<br /><span class=\"a\">des droits invisibles.</span>",
    count0="Vue du ciel",
    countk="Servitude ${k + 1}/4",
    tips=[
        ("LE PASSAGE", "Le voisin peut avoir <b>le droit de traverser ta cour</b> pour rejoindre la rue."),
        ("LES CANALISATIONS", "Ses tuyaux peuvent <b>passer sous ton terrain</b>&nbsp;: c'est une servitude."),
        ("L'ÉCHELLE", "Un acte peut lui permettre de <b>poser son échelle chez toi</b> pour réparer son mur."),
        ("LE MONUMENT", "Près d'un monument historique, les travaux extérieurs passent par <b>l'architecte des Bâtiments de France</b>."),
    ],
    know=[
        ("OÙ LES TROUVER", "Dans <b>l'acte de vente</b> et au service de la publicité foncière."),
        ("LE PLU", "Il liste les <b>servitudes d'utilité publique</b> de la parcelle."),
    ],
    setup="""      let w = `<rect width="850" height="720" fill="#bbf7d0"/><rect x="0" y="0" width="850" height="190" fill="#dcfce7"/><path d="M0 190 H850" stroke="#052e16" stroke-width="6" stroke-dasharray="20 12"/>`;
      w += `<rect x="150" y="40" width="300" height="120" rx="10" fill="#86efac" stroke="#052e16" stroke-width="5"/>`;
      w += `<rect x="40" y="230" width="380" height="360" rx="10" fill="#166534" stroke="#052e16" stroke-width="5"/>`;
      w += `<rect x="0" y="630" width="850" height="90" fill="#57534e"/><path d="M0 675 H850" stroke="#fafaf9" stroke-width="6" stroke-dasharray="40 30"/>`;
      w += `<path id="pass" d="M300 160 C300 220 600 230 600 330 S600 560 600 630" stroke="#f97316" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="26 18" opacity="0"/>`;
      w += `<path id="pipe" d="M420 160 V200 H760 V630" stroke="#0284c7" stroke-width="12" fill="none" stroke-dasharray="810" stroke-dashoffset="810"/>`;
      w += `<g id="lad" opacity="0"><path d="M470 196 L520 330 M500 190 L550 324" stroke="#a16207" stroke-width="7"/>`;
      for (let i = 0; i < 5; i++) w += `<path d="M${477 + i * 9} ${215 + i * 25} L${507 + i * 9} ${209 + i * 25}" stroke="#a16207" stroke-width="6"/>`;
      w += `</g><g id="zone" opacity="0"><circle cx="850" cy="0" r="700" fill="#15803d" opacity="0.18"/><circle cx="850" cy="0" r="700" fill="none" stroke="#052e16" stroke-width="6" stroke-dasharray="18 12"/><rect x="760" y="20" width="60" height="70" fill="#052e16"/><path d="M752 20 L790 -8 L828 20 Z" fill="#052e16"/></g>`;
      document.getElementById("site").innerHTML = w;""",
    js="""      tl.to("#pass", { opacity: 1, duration: 0.3 }, T[0]);
      tl.fromTo("#pass", { strokeDashoffset: 0 }, { strokeDashoffset: -176, duration: 4, ease: "none", immediateRender: false }, T[0]);
      tl.to("#pass", { opacity: 0.35, duration: 0.2 }, T[1]);
      tl.to("#pipe", { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, T[1]);
      tl.to("#pipe", { opacity: 0.35, duration: 0.2 }, T[2]);
      tl.fromTo("#lad", { opacity: 0, rotation: -30, svgOrigin: "520 330" }, { opacity: 1, rotation: 0, svgOrigin: "520 330", duration: 0.5, ease: "back.out(2)", immediateRender: false }, T[2]);
      tl.to("#lad", { opacity: 0.35, duration: 0.2 }, T[3]);
      tl.fromTo("#zone", { opacity: 0, scale: 0.3, svgOrigin: "850 0" }, { opacity: 1, scale: 1, svgOrigin: "850 0", duration: 0.8, ease: "power3.out", immediateRender: false }, T[3]);
      tl.fromTo("#mon", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.3, immediateRender: false }, T[3] + 0.5);""",
    endtitle=["Lis les servitudes", "dans l'acte."],
    endacc="#86efac",
    endrgb="134, 239, 172",
)

# ---------------------------------------------------------------- 39. LE REGISTRE DES COPROPRIÉTÉS
SPECS["registre"] = dict(
    comment="« LE REGISTRE DES COPROPRIÉTÉS » — vidéo utile : la fiche publique de chaque copro. 126 BPM (électro-swing).",
    bpm=126,
    T=T4,
    vars="""        --bg1: #f8fafc;
        --bg2: #e2e8f0;
        --bg3: #c4cfdd;
        --ink: #0f172a;
        --acc: #2563eb;
        --pill: #0f172a;
        --pillt: #93c5fd;
        --tipbg: #0f172a;
        --tiph: #93c5fd;""",
    css="""      #bar {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 100px;
        border-radius: 50px;
        background: #fff;
        box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
      }
      #bar svg {
        position: absolute;
        left: 30px;
        top: 28px;
        width: 44px;
        height: 44px;
      }
      #qw {
        position: absolute;
        left: 96px;
        top: 26px;
        height: 50px;
        overflow: hidden;
        white-space: nowrap;
        font-size: 38px;
        font-weight: 800;
        line-height: 50px;
        width: 0;
      }
      #card {
        left: 70px;
        top: 590px;
        width: 850px;
        padding: 26px 34px 14px;
        border-radius: 26px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(15, 23, 42, 0.16);
        opacity: 0;
      }
      .rw {
        display: flex;
        justify-content: space-between;
        padding: 18px 16px;
        margin: 0 -16px;
        border-radius: 14px;
        border-bottom: 3px solid #e2e8f0;
        font-size: 34px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .rw b {
        font-weight: 900;
      }
      #ok {
        left: 600px;
        top: 1080px;
        padding: 12px 22px;
        border: 6px solid #15803d;
        border-radius: 14px;
        background: #fff;
        color: #15803d;
        font-size: 32px;
        font-weight: 900;
        letter-spacing: 0.04em;
        opacity: 0;
      }
""",
    html="""        <div id="bar" class="abs"><svg viewBox="0 0 44 44"><circle cx="18" cy="18" r="13" fill="none" stroke="#2563eb" stroke-width="6"/><path d="M28 28 L40 40" stroke="#2563eb" stroke-width="7" stroke-linecap="round"/></svg><div id="qw">8 rue des Glycines, Lyon</div></div>
        <div id="card" class="abs">
          <div class="rw" id="r0"><span>N° d'immatriculation</span><b>AC9512874</b></div>
          <div class="rw" id="r1"><span>Type de syndic</span><b>Professionnel</b></div>
          <div class="rw" id="r2"><span>Nombre de lots</span><b>31</b></div>
          <div class="rw" id="r3"><span>Plan de sauvegarde</span><b>Non</b></div>
          <div class="rw" id="r4" style="border-bottom: 0"><span>Arrêté de mise en sécurité</span><b>Non</b></div>
        </div>
        <div id="ok" class="abs" data-layout-allow-overlap>VÉRIFIÉ ✓</div>""",
    cap="Chaque copro a une fiche&nbsp;:<br /><span class=\"a\">le registre national.</span>",
    count0="Recherche",
    countk="Info ${k + 1}/4",
    tips=[
        ("L'OBLIGATION", "Toute copro d'habitation doit être <b>immatriculée</b> au registre national."),
        ("EN LIGNE", "Tape l'adresse&nbsp;: <b>type de syndic, nombre de lots</b>, et plus."),
        ("LES ALERTES", "Plan de sauvegarde, arrêté de mise en sécurité&nbsp;: <b>des signaux à connaître</b>."),
        ("À LA VENTE", "Le notaire <b>vérifie l'immatriculation</b> avant de signer."),
    ],
    know=[
        ("C'EST GRATUIT", "Sur <b>registre-coproprietes.gouv.fr</b>, rubrique annuaire."),
        ("MIS À JOUR", "Le syndic doit actualiser la fiche <b>chaque année</b>, après l'AG."),
    ],
    setup="",
    js="""      tl.to("#qw", { width: 720, duration: 1.2, ease: "steps(24)" }, 0.6);
      tl.fromTo("#card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, T[0]);
      const HL = [[0], [1, 2], [3, 4]];
      HL.forEach((rows, k) => {
        rows.forEach((r) => tl.to(`#r${r}`, { backgroundColor: "#dbeafe", duration: 0.25 }, T[k] + 0.2));
        if (k) HL[k - 1].forEach((r) => tl.to(`#r${r}`, { backgroundColor: "rgba(219, 234, 254, 0)", duration: 0.25 }, T[k]));
      });
      HL[2].forEach((r) => tl.to(`#r${r}`, { backgroundColor: "rgba(219, 234, 254, 0)", duration: 0.25 }, T[3]));
      tl.fromTo("#ok", { opacity: 0, scale: 2, rotation: -16 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T[3] + 0.3);
      shake("#card", T[3] + 0.6, 6, 3);""",
    endtitle=["Cherche la copro", "avant de visiter."],
    endacc="#93c5fd",
    endrgb="147, 197, 253",
)

# ---------------------------------------------------------------- 40. LE MUR MITOYEN
SPECS["mitoyen"] = dict(
    comment="« LE MUR MITOYEN » — vidéo utile : à qui il est, comment le savoir, qui l'entretient. 112 BPM (amapiano).",
    bpm=112,
    T=T4,
    vars="""        --bg1: #faf7f2;
        --bg2: #efe4d2;
        --bg3: #dcc6a3;
        --ink: #2b1d0e;
        --acc: #92400e;
        --pill: #2b1d0e;
        --pillt: #fcd34d;
        --tipbg: #2b1d0e;
        --tiph: #fcd34d;""",
    css="""      #bld {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 720px;
      }
      .ml {
        position: absolute;
        padding: 10px 18px;
        border-radius: 14px;
        font-size: 32px;
        font-weight: 900;
        letter-spacing: -0.02em;
        white-space: nowrap;
      }
      #heb {
        left: 600px;
        top: 650px;
        background: #2b1d0e;
        color: #fcd34d;
        opacity: 0;
      }
      #ins {
        left: 560px;
        top: 760px;
        width: 330px;
        height: 230px;
        border-radius: 22px;
        background: #fff;
        box-shadow: 0 20px 40px rgba(43, 29, 14, 0.2);
        opacity: 0;
      }
      #ins .c {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 14px;
        text-align: center;
        font-size: 28px;
        font-weight: 900;
      }
      #half {
        left: 600px;
        top: 1030px;
        background: #92400e;
        color: #fff;
        opacity: 0;
      }
""",
    html="""        <svg id="bld" class="abs" viewBox="0 0 850 720"></svg>
        <div class="ml" style="left: 170px; top: 1080px; background: #fff">Toi</div>
        <div class="ml" style="left: 600px; top: 1080px; background: #fff">Voisin</div>
        <div id="heb" class="ml abs" data-layout-allow-overlap>Héberge</div>
        <div id="ins" class="abs" data-layout-allow-overlap><svg viewBox="0 0 330 180" width="330" height="180"><rect x="60" y="80" width="210" height="90" fill="#d6b48a" stroke="#2b1d0e" stroke-width="5"/><path d="M50 80 L280 50 L280 80 Z" fill="#92400e" stroke="#2b1d0e" stroke-width="5"/><path d="M300 60 l14 0 m-7 -7 l7 7 l-7 7" stroke="#2b1d0e" stroke-width="5" fill="none"/></svg><div class="c">Penche côté voisin&nbsp;: à lui</div></div>
        <div id="half" class="ml abs" data-layout-allow-overlap>Entretien&nbsp;: à deux</div>""",
    cap="Le mur mitoyen&nbsp;:<br /><span class=\"a\">à qui est-il&nbsp;?</span>",
    count0="Deux immeubles",
    countk="Règle ${k + 1}/4",
    tips=[
        ("LA RÈGLE", "Entre deux bâtiments, le mur est <b>présumé mitoyen</b> jusqu'au toit le plus bas."),
        ("LES SIGNES", "Un sommet qui <b>penche d'un seul côté</b>&nbsp;: le mur est à celui de ce côté."),
        ("L'ENTRETIEN", "Les réparations se font <b>à frais partagés</b> entre les deux propriétaires."),
        ("Y TOUCHER", "Encastrer une poutre&nbsp;: <b>jusqu'à la moitié de l'épaisseur</b>, avec l'accord du voisin."),
    ],
    know=[
        ("LE RACHAT", "Tu peux rendre mitoyen le mur du voisin en lui <b>payant la moitié</b> de sa valeur."),
        ("LES FENÊTRES", "On ne perce pas <b>une fenêtre</b> dans un mur mitoyen sans accord."),
    ],
    setup="""      let w = `<rect x="40" y="40" width="360" height="600" fill="#e7d5bb" stroke="#2b1d0e" stroke-width="5"/>`;
      w += `<rect x="450" y="250" width="360" height="390" fill="#e7d5bb" stroke="#2b1d0e" stroke-width="5"/>`;
      for (let f = 0; f < 6; f++) for (let i = 0; i < 3; i++) w += `<rect x="${80 + i * 105}" y="${70 + f * 95}" width="65" height="55" rx="4" fill="#fff" stroke="#2b1d0e" stroke-width="3"/>`;
      for (let f = 0; f < 4; f++) for (let i = 0; i < 3; i++) w += `<rect x="${490 + i * 105}" y="${280 + f * 90}" width="65" height="50" rx="4" fill="#fff" stroke="#2b1d0e" stroke-width="3"/>`;
      w += `<rect x="400" y="40" width="50" height="210" fill="#b45309" stroke="#2b1d0e" stroke-width="5"/>`;
      w += `<g id="wall"><rect x="400" y="250" width="25" height="390" fill="#b45309"/><rect x="425" y="250" width="25" height="390" fill="#f59e0b"/><rect x="400" y="250" width="50" height="390" fill="none" stroke="#2b1d0e" stroke-width="5"/></g>`;
      w += `<path id="hl" d="M380 250 H560" stroke="#2b1d0e" stroke-width="5" stroke-dasharray="14 10" opacity="0"/>`;
      w += `<rect id="beam" x="250" y="420" width="0" height="30" fill="#78350f"/>`;
      w += `<rect x="0" y="640" width="850" height="80" fill="#a8a29e"/>`;
      document.getElementById("bld").innerHTML = w;""",
    js="""      tl.fromTo("#wall", { opacity: 0.3 }, { opacity: 1, duration: 0.3, immediateRender: false }, T[0]);
      tl.to("#hl", { opacity: 1, duration: 0.3 }, T[0] + 0.3);
      tl.fromTo("#heb", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, T[0] + 0.4);
      tl.to("#heb", { opacity: 0, duration: 0.2 }, T[1]);
      tl.fromTo("#ins", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T[1]);
      tl.to("#ins", { opacity: 0, duration: 0.2 }, T[2]);
      tl.fromTo("#half", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, immediateRender: false }, T[2]);
      tl.fromTo("#wall", { scaleX: 1, svgOrigin: "425 445" }, { scaleX: 1.25, svgOrigin: "425 445", duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T[2] + 0.2);
      tl.to("#half", { opacity: 0.35, duration: 0.2 }, T[3]);
      tl.to("#beam", { attr: { width: 162 }, duration: 0.9, ease: "power2.out" }, T[3]);
      shake("#bld", T[3] + 0.9, 6, 3);""",
    endtitle=["Un mur partagé,", "des règles partagées."],
    endacc="#fcd34d",
    endrgb="252, 211, 77",
)

# ---------------------------------------------------------------- 41. VRAI OU FAUX EN COPRO
SPECS["vraifaux"] = dict(
    comment="« VRAI OU FAUX EN COPRO » — vidéo utile en quiz : 4 idées reçues. 140 BPM (phonk).",
    bpm=140,
    T=T4,
    vars="""        --bg1: #fdf4ff;
        --bg2: #f3d9fb;
        --bg3: #e3a8f5;
        --ink: #2e0a3a;
        --acc: #a21caf;
        --pill: #2e0a3a;
        --pillt: #f0abfc;
        --tipbg: #2e0a3a;
        --tiph: #f0abfc;""",
    css="""      #qcard {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 340px;
        border-radius: 30px;
        background: #fff;
        box-shadow: 0 30px 60px rgba(46, 10, 58, 0.18);
      }
      .st {
        position: absolute;
        left: 44px;
        right: 44px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 48px;
        font-weight: 900;
        letter-spacing: -0.035em;
        line-height: 1.08;
        opacity: 0;
      }
      .st i {
        font-style: normal;
        color: #a21caf;
      }
      .btn {
        position: absolute;
        top: 830px;
        width: 410px;
        height: 150px;
        border-radius: 30px;
        background: #fff;
        border: 8px solid;
        text-align: center;
        line-height: 134px;
        font-size: 72px;
        font-weight: 900;
        letter-spacing: -0.03em;
      }
      #bv {
        left: 70px;
        border-color: #16a34a;
        color: #16a34a;
      }
      #bf {
        left: 510px;
        border-color: #dc2626;
        color: #dc2626;
      }
""",
    html="""        <div id="qcard" class="abs">
          <div class="st" id="q0">« Je peux poser des <i>panneaux solaires</i> sur mon balcon sans rien demander. »</div>
          <div class="st" id="q1">« Ma <i>sonnette-caméra</i> peut filmer le palier. »</div>
          <div class="st" id="q2">« Le syndic peut <i>entrer chez moi</i> quand il veut. »</div>
          <div class="st" id="q3">« Mon <i>locataire</i> peut voter à l'AG à ma place. »</div>
        </div>
        <div class="btn" id="bv">VRAI</div>
        <div class="btn" id="bf">FAUX</div>""",
    cap="Vrai ou faux&nbsp;?<br /><span class=\"a\">Spécial copro.</span>",
    count0="Prêt&nbsp;?",
    countk="Question ${k + 1}/4",
    tips=[
        ("FAUX", "Ça change l'aspect de l'immeuble&nbsp;: il faut <b>l'accord de l'AG</b>."),
        ("FAUX", "Filmer les parties communes demande <b>l'accord de l'AG</b>, et la vie privée compte."),
        ("FAUX", "Seulement pour des travaux votés, <b>avec 8 jours de préavis</b> (sauf urgence)."),
        ("VRAI", "Oui, si tu lui donnes <b>un pouvoir écrit</b>."),
    ],
    know=[
        ("LE POUVOIR", "Tu peux le donner à presque n'importe qui, <b>sauf au syndic</b> et à ses proches."),
        ("LA RÈGLE D'OR", "Ce qui se voit de l'extérieur&nbsp;: <b>demande avant</b> de le faire."),
    ],
    setup="",
    js="""      const ANS = [1, 1, 1, 0];
      T.forEach((t, k) => {
        if (k) tl.to(`#q${k - 1}`, { opacity: 0, y: -30, duration: 0.2 }, t - 0.05);
        tl.fromTo(`#q${k}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, t);
        tl.to(["#bv", "#bf"], { backgroundColor: "#ffffff", color: (i) => (i ? "#dc2626" : "#16a34a"), scale: 1, opacity: 1, duration: 0.15 }, t);
        const win = ANS[k] ? "#bf" : "#bv", lose = ANS[k] ? "#bv" : "#bf";
        tl.to(win, { backgroundColor: ANS[k] ? "#dc2626" : "#16a34a", color: "#ffffff", duration: 0.2 }, t + 0.6);
        tl.fromTo(win, { scale: 1 }, { scale: 1.1, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, t + 0.6);
        tl.to(lose, { opacity: 0.3, duration: 0.2 }, t + 0.6);
        shake("#qcard", t + 0.6, 8, 4);
      });""",
    endtitle=["Vrai ou faux&nbsp;?", "Maintenant tu sais."],
    endacc="#f0abfc",
    endrgb="240, 171, 252",
)

# ---------------------------------------------------------------- 42. CES BRUITS DANS L'IMMEUBLE
SPECS["sons"] = dict(
    comment="« CES BRUITS DANS L'IMMEUBLE » — vidéo utile : 4 bruits et ce qu'ils veulent dire. 150 BPM (rockabilly).",
    bpm=150,
    T=T4,
    vars="""        --bg1: #ecfccb;
        --bg2: #d4f59a;
        --bg3: #a9e05a;
        --ink: #1a2e05;
        --acc: #4d7c0f;
        --pill: #1a2e05;
        --pillt: #bef264;
        --tipbg: #1a2e05;
        --tiph: #bef264;""",
    css="""      #spk {
        left: 70px;
        top: 450px;
        width: 850px;
        height: 560px;
        border-radius: 30px;
        background: #1a2e05;
        overflow: hidden;
        box-shadow: 0 30px 60px rgba(26, 46, 5, 0.25);
      }
      .sn {
        position: absolute;
        left: 0;
        right: 0;
        top: 44px;
        text-align: center;
        font-size: 64px;
        font-weight: 900;
        letter-spacing: -0.04em;
        color: #bef264;
        opacity: 0;
      }
      .sn small {
        display: block;
        margin-top: 6px;
        font-size: 32px;
        font-weight: 800;
        letter-spacing: 0;
        color: #ecfccb;
      }
      #wv {
        position: absolute;
        left: 0;
        top: 230px;
        width: 850px;
        height: 300px;
      }
      .dot {
        position: absolute;
        top: 1050px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #1a2e05;
        opacity: 0.2;
      }
""",
    html="""        <div id="spk" class="abs">
          <div class="sn" id="n0">« Clac&nbsp;! »<small>dans les tuyaux</small></div>
          <div class="sn" id="n1">« Glou-glou »<small>dans le radiateur</small></div>
          <div class="sn" id="n2">« Fiiiiii »<small>dans la VMC</small></div>
          <div class="sn" id="n3">« Gloub »<small>dans l'évier</small></div>
          <svg id="wv" viewBox="0 0 850 300"></svg>
        </div>
        <div class="dot" id="d0" style="left: 405px"></div>
        <div class="dot" id="d1" style="left: 455px"></div>
        <div class="dot" id="d2" style="left: 505px"></div>
        <div class="dot" id="d3" style="left: 555px"></div>""",
    cap="Ces bruits chez toi&nbsp;:<br /><span class=\"a\">ce qu'ils veulent dire.</span>",
    count0="Écoute",
    countk="Bruit ${k + 1}/4",
    tips=[
        ("LE COUP DE BÉLIER", "La pression cogne quand tu fermes un robinet&nbsp;: <b>un anti-bélier</b> règle ça."),
        ("LE RADIATEUR", "De l'air dans le circuit&nbsp;: il faut <b>le purger</b>."),
        ("LA VMC QUI SIFFLE", "Bouches <b>encrassées ou mal réglées</b>&nbsp;: nettoie-les."),
        ("L'ÉVIER QUI GARGOUILLE", "L'évacuation respire mal&nbsp;: <b>ventilation bouchée</b>, à signaler au syndic."),
    ],
    know=[
        ("À LA VISITE", "Ouvre et ferme vite un robinet&nbsp;: <b>écoute les tuyaux</b>."),
        ("LE SOIR", "Quand tout est calme, <b>écoute la VMC et les radiateurs</b>."),
    ],
    setup="""      const F = [
        (x) => { const m = x % 425; return m < 30 ? 120 * Math.sin((m / 30) * Math.PI * 6) * Math.exp(-m / 12) : 3 * Math.sin(x / 6); },
        (x) => 50 * Math.sin((x * 2 * Math.PI) / 85) * Math.max(0, Math.sin((x * 2 * Math.PI) / 425)),
        (x) => 22 * Math.sin((x * 2 * Math.PI) / 10.625),
        (x) => 90 * Math.sin((x * 2 * Math.PI) / 212.5) * Math.sin((x * 2 * Math.PI) / 850) + 20 * Math.sin((x * 2 * Math.PI) / 42.5),
      ];
      let w = "";
      F.forEach((f, k) => {
        let d = "M0 150";
        for (let x = 0; x <= 1700; x += 3) d += ` L${x} ${(150 - f(x)).toFixed(1)}`;
        w += `<path id="w${k}" d="${d}" stroke="#bef264" stroke-width="7" fill="none" stroke-linejoin="round" opacity="0"/>`;
      });
      document.getElementById("wv").innerHTML = w;""",
    js="""      T.forEach((t, k) => {
        if (k) {
          tl.to([`#n${k - 1}`, `#w${k - 1}`], { opacity: 0, duration: 0.15 }, t - 0.05);
          tl.to(`#d${k - 1}`, { opacity: 0.45, scale: 1, duration: 0.15 }, t);
        }
        tl.fromTo(`#n${k}`, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }, t);
        tl.to(`#w${k}`, { opacity: 1, duration: 0.2 }, t);
        tl.fromTo(`#w${k}`, { x: 0 }, { x: -850, duration: 2.2, ease: "none", repeat: 1, immediateRender: false }, t);
        tl.to(`#d${k}`, { opacity: 1, scale: 1.3, duration: 0.2 }, t);
        shake("#spk", t + 0.1, 6, 3);
      });
      tl.to("#d3", { opacity: 0.45, scale: 1, duration: 0.2 }, 19.5);""",
    endtitle=["Écoute l'immeuble,", "il te parle."],
    endacc="#bef264",
    endrgb="190, 242, 100",
)

# ---------------------------------------------------------------- 43. COMBIEN DE TEMPS ÇA DURE ?
SPECS["duree"] = dict(
    comment="« COMBIEN DE TEMPS ÇA DURE ? » — vidéo utile : durée de vie des équipements d'un appart. 110 BPM (ukulélé pop).",
    bpm=110,
    T=T5,
    vars="""        --bg1: #fff7ed;
        --bg2: #ffe4c4;
        --bg3: #fdc48a;
        --ink: #2b1405;
        --acc: #c2410c;
        --pill: #2b1405;
        --pillt: #fdba74;
        --tipbg: #2b1405;
        --tiph: #fdba74;""",
    css="""      .row {
        position: absolute;
        left: 70px;
        width: 850px;
        height: 130px;
        opacity: 0.3;
      }
      .row .l {
        font-size: 38px;
        font-weight: 900;
        letter-spacing: -0.03em;
      }
      .row .tr {
        position: absolute;
        left: 0;
        top: 56px;
        width: 850px;
        height: 50px;
        border-radius: 25px;
        background: rgba(43, 20, 5, 0.1);
      }
      .row .fl {
        position: absolute;
        left: 0;
        top: 56px;
        width: 0;
        height: 50px;
        border-radius: 25px;
        background: #ea580c;
      }
      .row .v {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 38px;
        font-weight: 900;
        color: #ea580c;
        opacity: 0;
      }
""",
    html="""        <div id="rows"></div>""",
    cap="Combien de temps&nbsp;<br /><span class=\"a\">ça dure&nbsp;?</span>",
    count0="Durée de vie",
    countk="Équipement ${k + 1}/5",
    tips=[
        ("LES JOINTS", "Environ <b>5 ans</b>. Noirs ou décollés près de la douche&nbsp;? À refaire."),
        ("LA PEINTURE", "Environ <b>10 ans</b>. Traces et taches partout&nbsp;: à prévoir."),
        ("LA ROBINETTERIE", "Environ <b>15 ans</b>. Du calcaire, un robinet qui force&nbsp;: bientôt à changer."),
        ("LE VOLET ROULANT", "Son moteur&nbsp;: <b>15 à 20 ans</b>. Teste chaque volet à la visite."),
        ("LE PARQUET MASSIF", "<b>50 ans et plus</b>&nbsp;: il se ponce et se vitrifie plusieurs fois."),
    ],
    know=[
        ("EN LOCATION", "Ces durées servent à calculer <b>la vétusté</b> en fin de bail."),
        ("À LA VISITE", "Demande <b>l'année des derniers travaux</b> de chaque équipement."),
    ],
    setup="""      const R = [["Joints en silicone", 5, "≈ 5 ans"], ["Peinture", 10, "≈ 10 ans"], ["Robinetterie", 15, "≈ 15 ans"], ["Volet roulant motorisé", 20, "15–20 ans"], ["Parquet massif", 50, "50 ans et +"]];
      document.getElementById("rows").innerHTML = R.map((r, k) => `<div class="row" id="w${k}" style="top: ${450 + k * 148}px" data-w="${r[1] * 17}"><div class="l">${r[0]}</div><div class="v">${r[2]}</div><div class="tr"></div><div class="fl"></div></div>`).join("");""",
    js="""      T.forEach((t, k) => {
        const w = +document.getElementById(`w${k}`).dataset.w;
        if (k) tl.to(`#w${k - 1}`, { opacity: 0.55, duration: 0.2 }, t);
        tl.to(`#w${k}`, { opacity: 1, duration: 0.2 }, t);
        tl.fromTo(`#w${k} .fl`, { width: 0 }, { width: w, duration: k === 4 ? 1.4 : 0.8, ease: "power3.out", immediateRender: false }, t + 0.1);
        tl.fromTo(`#w${k} .v`, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, t + 0.5);
      });
      shake("#rows", T[4] + 1.4, 8, 4);""",
    endtitle=["Chaque équipement", "a une date limite."],
    endacc="#fdba74",
    endrgb="253, 186, 116",
)

# ---------------------------------------------------------------- 44. TES VOIX EN AG
SPECS["voix"] = dict(
    comment="« TES VOIX EN AG » — vidéo utile : tantièmes, propriétaire majoritaire, pouvoirs. 140 BPM (jersey club).",
    bpm=140,
    T=T4,
    vars="""        --bg1: #ecfeff;
        --bg2: #c6f2f8;
        --bg3: #8adbe9;
        --ink: #082f3a;
        --acc: #0e7490;
        --pill: #082f3a;
        --pillt: #67e8f9;
        --tipbg: #082f3a;
        --tiph: #67e8f9;""",
    css="""      #dn {
        left: 70px;
        top: 460px;
        width: 560px;
        height: 560px;
      }
      .cv {
        position: absolute;
        left: 70px;
        top: 690px;
        width: 560px;
        text-align: center;
        font-size: 66px;
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1;
        opacity: 0;
      }
      .cv small {
        display: block;
        font-size: 30px;
        font-weight: 800;
        letter-spacing: 0;
        color: #0e7490;
      }
      .lg {
        position: absolute;
        left: 670px;
        width: 250px;
        padding: 14px 18px;
        border-radius: 16px;
        background: #fff;
        font-size: 28px;
        font-weight: 900;
        line-height: 1.1;
        opacity: 0.35;
      }
      .lg i {
        display: inline-block;
        width: 22px;
        height: 22px;
        margin-right: 8px;
        border-radius: 6px;
        vertical-align: -2px;
      }
      .env {
        position: absolute;
        left: 670px;
        width: 250px;
        height: 76px;
        border-radius: 14px;
        background: #082f3a;
        color: #67e8f9;
        text-align: center;
        line-height: 76px;
        font-size: 30px;
        font-weight: 900;
        opacity: 0;
      }
""",
    html="""        <svg id="dn" class="abs" viewBox="0 0 560 560"></svg>
        <div class="cv" id="c0">87 voix<small>tes 87/1000</small></div>
        <div class="cv" id="c1">600 voix<small>un gros propriétaire</small></div>
        <div class="cv" id="c2">400 voix<small>plafonné</small></div>
        <div class="cv" id="c3">3 pouvoirs<small>maximum</small></div>
        <div class="lg" id="g0" style="top: 480px"><i style="background: #0e7490"></i>Toi&nbsp;: 87</div>
        <div class="lg" id="g1" style="top: 570px"><i style="background: #f97316"></i>Gros proprio&nbsp;: 600</div>
        <div class="lg" id="g2" style="top: 660px"><i style="background: #94a3b8"></i>Les autres&nbsp;: 313</div>
        <div class="env" id="e0" style="top: 790px">Pouvoir 1</div>
        <div class="env" id="e1" style="top: 880px">Pouvoir 2</div>
        <div class="env" id="e2" style="top: 970px">Pouvoir 3</div>""",
    cap="En AG, tu as&nbsp;<br /><span class=\"a\">combien de voix&nbsp;?</span>",
    count0="1 000 tantièmes",
    countk="Règle ${k + 1}/4",
    tips=[
        ("TES VOIX", "1 tantième = 1 voix&nbsp;: avec 87/1000, tu as <b>87 voix</b>."),
        ("PAS 1 PERSONNE = 1 VOIX", "Celui qui a le plus de tantièmes <b>pèse le plus</b>."),
        ("LE GARDE-FOU", "Plus de la moitié des voix&nbsp;? Elles sont <b>ramenées</b> à la somme des autres."),
        ("LES POUVOIRS", "Une personne peut porter <b>3 pouvoirs maximum</b>, sauf petites exceptions."),
    ],
    know=[
        ("ABSENT&nbsp;?", "Tu peux <b>voter par correspondance</b> avec le formulaire de la convocation."),
        ("À DISTANCE", "L'AG peut se tenir <b>en visio</b> si elle l'a décidé."),
    ],
    setup="""      const C = 2 * Math.PI * 200;
      const seg = (id, a, b, col, op) => `<circle id="${id}" cx="280" cy="280" r="200" fill="none" stroke="${col}" stroke-width="90" stroke-dasharray="${((b - a) / 1000) * C} ${C}" stroke-dashoffset="${(-a / 1000) * C}" transform="rotate(-90 280 280)" opacity="${op}"/>`;
      document.getElementById("dn").innerHTML = seg("sO", 687, 1000, "#94a3b8", 0.5) + seg("sB1", 87, 487, "#f97316", 0.15) + seg("sB2", 487, 687, "#f97316", 0.15) + seg("sY", 0, 87, "#0e7490", 0.3);""",
    js="""      const cv = (k, t) => {
        if (k) tl.to(`#c${k - 1}`, { opacity: 0, duration: 0.15 }, t - 0.05);
        tl.fromTo(`#c${k}`, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)", immediateRender: false }, t);
      };
      cv(0, T[0]);
      tl.to("#sY", { opacity: 1, duration: 0.3 }, T[0]);
      tl.fromTo("#sY", { attr: { "stroke-width": 90 } }, { attr: { "stroke-width": 130 }, duration: 0.25, yoyo: true, repeat: 1, immediateRender: false }, T[0] + 0.1);
      tl.to("#g0", { opacity: 1, duration: 0.2 }, T[0]);
      cv(1, T[1]);
      tl.to(["#sB1", "#sB2"], { opacity: 1, duration: 0.3 }, T[1]);
      tl.to("#g1", { opacity: 1, duration: 0.2 }, T[1]);
      tl.to("#g2", { opacity: 1, duration: 0.2 }, T[1] + 0.2);
      cv(2, T[2]);
      tl.to("#sB2", { opacity: 0.15, duration: 0.5 }, T[2] + 0.2);
      shake("#dn", T[2] + 0.2, 8, 4);
      cv(3, T[3]);
      tl.to(["#g0", "#g1", "#g2"], { opacity: 0.35, duration: 0.2 }, T[3]);
      [0, 1, 2].forEach((i) => tl.fromTo(`#e${i}`, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, T[3] + 0.2 + i * 0.3));""",
    endtitle=["Tes voix comptent,", "utilise-les."],
    endacc="#67e8f9",
    endrgb="103, 232, 249",
)

# ---------------------------------------------------------------- 45. TON TÉLÉPHONE À LA VISITE
SPECS["telephone"] = dict(
    comment="« TON TÉLÉPHONE À LA VISITE » — vidéo utile : 4 tests à faire avec son téléphone. 120 BPM (fanfare).",
    bpm=120,
    T=T4,
    vars="""        --bg1: #fefce8;
        --bg2: #fbf0a8;
        --bg3: #f2d653;
        --ink: #1f1a03;
        --acc: #a16207;
        --pill: #1f1a03;
        --pillt: #fde047;
        --tipbg: #1f1a03;
        --tiph: #fde047;""",
    css="""      #ph {
        left: 300px;
        top: 450px;
        width: 400px;
        height: 740px;
        border-radius: 64px;
        background: #1f1a03;
        box-shadow: 0 40px 70px rgba(31, 26, 3, 0.35);
      }
      #scr {
        position: absolute;
        left: 18px;
        top: 18px;
        right: 18px;
        bottom: 18px;
        border-radius: 48px;
        background: #fffdf0;
        overflow: hidden;
      }
      .sc {
        position: absolute;
        inset: 0;
        opacity: 0;
      }
      .ap {
        position: absolute;
        left: 0;
        right: 0;
        top: 60px;
        text-align: center;
        font-size: 44px;
        font-weight: 900;
        letter-spacing: -0.03em;
      }
      #tube {
        position: absolute;
        left: 40px;
        top: 300px;
        width: 284px;
        height: 90px;
        border-radius: 45px;
        background: #d9f99d;
        border: 6px solid #1f1a03;
      }
      #bub {
        position: absolute;
        left: 106px;
        top: 12px;
        width: 60px;
        height: 54px;
        border-radius: 50%;
        background: #fff;
        border: 4px solid #1f1a03;
      }
      #deg {
        position: absolute;
        left: 0;
        right: 0;
        top: 440px;
        text-align: center;
        font-size: 70px;
        font-weight: 900;
        color: #dc2626;
      }
      #beam {
        position: absolute;
        left: -40px;
        top: 140px;
        width: 440px;
        height: 460px;
        background: radial-gradient(60% 55% at 50% 30%, #fff 0%, #fef08a 45%, rgba(254, 240, 138, 0) 75%);
      }
      #bat {
        position: absolute;
        left: 92px;
        top: 220px;
        width: 180px;
        height: 300px;
        border-radius: 24px;
        border: 10px solid #1f1a03;
      }
      #batf {
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 8px;
        height: 0;
        border-radius: 12px;
        background: #22c55e;
      }
      .br {
        position: absolute;
        bottom: 230px;
        width: 46px;
        border-radius: 10px;
        background: #1f1a03;
        opacity: 0.15;
      }
      #room {
        position: absolute;
        left: 0;
        right: 0;
        top: 560px;
        text-align: center;
        font-size: 36px;
        font-weight: 900;
      }
""",
    html="""        <div id="ph" class="abs"><div id="scr">
          <div class="sc" id="s0"><div class="ap">Niveau</div><div id="tube"><div id="bub"></div></div><div id="deg">2,1°</div></div>
          <div class="sc" id="s1"><div id="beam"></div><div class="ap">Lampe torche</div></div>
          <div class="sc" id="s2"><div class="ap">Charge</div><div id="bat"><div id="batf"></div></div></div>
          <div class="sc" id="s3"><div class="ap">Réseau</div><div class="br" id="br0" style="left: 70px; height: 70px"></div><div class="br" id="br1" style="left: 130px; height: 130px"></div><div class="br" id="br2" style="left: 190px; height: 190px"></div><div class="br" id="br3" style="left: 250px; height: 250px"></div><div id="room">Chambre du fond</div></div>
        </div></div>""",
    cap="Ton téléphone&nbsp;:<br /><span class=\"a\">l'outil secret de la visite.</span>",
    count0="4 tests",
    countk="Test ${k + 1}/4",
    tips=[
        ("LE NIVEAU", "Pose-le au sol&nbsp;: <b>un sol qui penche</b> peut cacher un plancher affaissé."),
        ("LA LAMPE", "Collée au mur, elle fait apparaître <b>bosses, fissures et reprises</b>."),
        ("LE CHARGEUR", "Branche-le dans chaque prise&nbsp;: <b>il doit charger</b>."),
        ("LE RÉSEAU", "Regarde les barres <b>dans chaque pièce</b>&nbsp;: certains murs bloquent tout."),
    ],
    know=[
        ("LES PHOTOS", "Photographie tout&nbsp;: <b>compteurs, plafonds, placards</b>."),
        ("LA VIDÉO", "Filme la visite en commentant&nbsp;: <b>tu oublieras moins</b>."),
    ],
    setup="",
    js="""      T.forEach((t, k) => {
        if (k) tl.to(`#s${k - 1}`, { opacity: 0, duration: 0.15 }, t - 0.05);
        tl.to(`#s${k}`, { opacity: 1, duration: 0.2 }, t);
        tl.fromTo("#ph", { rotation: k % 2 ? 6 : -6 }, { rotation: 0, duration: 0.5, ease: "back.out(2)", immediateRender: false }, t);
      });
      tl.fromTo("#bub", { x: 0 }, { x: 70, duration: 1.2, ease: "elastic.out(1, 0.5)", immediateRender: false }, T[0] + 0.3);
      tl.fromTo("#ph", { rotation: 0 }, { rotation: 4, duration: 1.2, ease: "power2.out", immediateRender: false }, T[0] + 0.5);
      tl.to("#ph", { rotation: 0, duration: 0.3 }, T[1] - 0.3);
      tl.fromTo("#beam", { opacity: 0.2, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", immediateRender: false }, T[1] + 0.2);
      tl.fromTo("#batf", { height: 0 }, { height: 264, duration: 2.5, ease: "power1.inOut", immediateRender: false }, T[2] + 0.2);
      [0, 1, 2, 3].forEach((i) => tl.to(`#br${i}`, { opacity: i < 1 ? 1 : 0.15, backgroundColor: i < 1 ? "#dc2626" : "#1f1a03", duration: 0.2 }, T[3] + 0.3));
      [0, 1, 2, 3].forEach((i) => tl.fromTo(`#br${i}`, { opacity: 0.15 }, { opacity: 1, duration: 0.15, immediateRender: false }, T[3] + 0.3 + i * 0.15).to(`#br${i}`, { opacity: i < 1 ? 1 : 0.15, duration: 0.2 }, T[3] + 1.4));""",
    endtitle=["Ton téléphone,", "ton meilleur outil."],
    endacc="#fde047",
    endrgb="253, 224, 71",
)
