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
