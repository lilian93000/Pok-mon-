"""Bande-son et minutage d'une vidéo sur voix v3 : la voix finale (essai validé) d'un seul tenant + bruitages calés sur les mots.

Les temps des mots viennent de la retranscription faster-whisper de la voix finale, alignée sur le script :
les sous-titres gardent l'orthographe du script (et « display » remplace, par ex., « six cent cinquante euros » par « 650 € »).
Usage : python3 tools/v3/mix_v3.py <nom> <voix.mp3> <whisper.json> <dossier_sfx> <projet>
Écrit <projet>/assets/audio/soundtrack.wav (−14 LUFS) et <projet>/tools/minutage.json (format du moteur v2).
"""
import json
import os
import re
import subprocess
import sys
from difflib import SequenceMatcher

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "v2"))
sys.path.insert(0, HERE)
from specs import SPECS  # noqa: E402
import voix_v3  # noqa: E402

SR = 48000
TAIL = 0.35   # la boucle repart vite


def load(path):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"])
    return np.frombuffer(raw, np.float32).astype(np.float64)


def place(bus, sig, t, g=1.0):
    i = max(0, int(t * SR)); j = min(len(bus), i + len(sig)); bus[i:j] += g * sig[: j - i]


def script_tokens(lines):
    """[(phrase, mot affiché, mot normalisé)] : un mot affiché peut donner plusieurs mots normalisés (« 650 » → six cent cinquante)."""
    out = []
    for li, ln in enumerate(lines):
        txt = re.sub(r"^\[[^\]]+\]\s*", "", ln)
        txt = re.sub(r"\s+([?:!;])", "\u00a0\\1", txt)   # « Paris ? » reste un seul mot affiché
        for disp in txt.split(" "):
            for n in voix_v3.norm(disp) or [None]:
                out.append((li, disp, n))
    return out


if __name__ == "__main__":
    name, voice, wjson, sfx, proj = sys.argv[1:6]
    spec = SPECS[name]
    lines, _ = voix_v3.read_script(spec["script"])
    toks = [t for t in script_tokens(lines) if t[2]]
    hyp = json.load(open(wjson))
    hw = []                                   # mots entendus, normalisés, avec leurs temps
    for w, a, b in hyp:
        for n in voix_v3.norm(w):
            hw.append((n, a, b))
    sm = SequenceMatcher(a=[t[2] for t in toks], b=[h[0] for h in hw], autojunk=False)
    times = [None] * len(toks)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                times[i1 + k] = (hw[j1 + k][1], hw[j1 + k][2])
        elif j2 > j1 and i2 > i1:             # passage différent : on répartit le temps entendu
            a, b = hw[j1][1], hw[j2 - 1][2]
            for k in range(i2 - i1):
                times[i1 + k] = (a + (b - a) * k / (i2 - i1), a + (b - a) * (k + 1) / (i2 - i1))
    for k in range(len(times)):               # mots non entendus : collés au voisin
        if times[k] is None:
            p = times[k - 1] if k and times[k - 1] else (0.0, 0.0)
            times[k] = (p[1], p[1] + 0.05)
    # mots affichés (un par mot du script), temps = du 1er au dernier sous-mot
    words, last = [], None
    for (li, disp, _n), (a, b) in zip(toks, times):
        key = (li, disp, id(disp))
        if words and last == key:
            words[-1][3] = b
        else:
            words.append([li, disp, a, b]); last = key
    # « display » : fusionne des mots dits en toutes lettres (six cent cinquante euros → 650 €)
    for spoken, shown in spec.get("display", {}).items():
        sw = voix_v3.norm(spoken)
        k = 0
        while k < len(words):
            toks, m = [], k
            while m < len(words) and len(toks) < len(sw) and words[m][0] == words[k][0]:
                toks += voix_v3.norm(words[m][1]); m += 1
            if toks == sw:
                tail = re.sub(r"^[\w€'-]+", "", words[m - 1][1])  # garde la ponctuation finale (« ? », « … »)
                words[k:m] = [[words[k][0], shown + tail, words[k][2], words[m - 1][3]]]
            k += 1
    # scènes : chaque scène couvre des phrases ; ses mots portent l'indice de la scène
    owner = {li: k for k, sc in enumerate(spec["scenes"]) for li in sc["groups"]}
    W = [[owner[w[0]], w[1], round(w[2], 3), round(w[3], 3)] for w in words]
    vo = load(voice)
    dur = round(len(vo) / SR + TAIL, 2)
    bus = np.zeros(int(dur * SR) + SR)
    place(bus, vo, 0.0)
    S = lambda f: load(os.path.join(sfx, f))  # noqa: E731
    whoosh, pop, impact2, error, ping, sparkle = (S(f) for f in ("whoosh-short.mp3", "pop.mp3", "impact-bass-2.mp3", "error.mp3", "ping.mp3", "sparkle.mp3"))
    scenes, starts = [], []
    for k, sc in enumerate(spec["scenes"]):
        first = next(w for w in W if w[0] == k)
        t0 = 0.0 if k == 0 else round(first[2] - 0.1, 3)
        ev = {"t0": t0}
        anchors = {key: sc[key] for key in ("at", "note_at", "chip_at", "sub_at") if key in sc}
        anchors.update({f"seg{j}": x["at"] for j, x in enumerate(sc.get("segments", []))})
        for key in anchors:
            if True:
                hits = [w[2] for w in W if w[0] == k and any(t.startswith(anchors[key]) for t in voix_v3.norm(w[1]))]
                if not hits:
                    raise SystemExit(f"mot d'ancrage introuvable : {anchors[key]!r} (scène {k})")
                ev[key] = hits[0]
        scenes.append(ev); starts.append(first[2])
        if k:
            place(bus, whoosh, t0 - 0.12, 0.3)
        ty = sc["type"]
        if ty == "listing":
            place(bus, pop, 0.02, 0.6)
        elif ty == "flag":
            place(bus, error, ev["at"], 0.4)
        elif ty == "punch":
            place(bus, impact2, ev["at"], 0.75); place(bus, sparkle, ev["at"] + 0.1, 0.4)
        elif ty == "verdict":
            place(bus, ping, ev["at"], 0.55)
        elif ty == "loop" or (ty == "hook" and k):
            place(bus, pop, t0 + 0.1, 0.45)
        elif ty == "stat":
            place(bus, pop, ev["at"] + 0.35, 0.5)
        elif ty == "rule":
            place(bus, impact2, ev["at"], 0.4)
        elif ty == "split":
            for j in range(len(sc["segments"])):
                place(bus, pop, ev[f"seg{j}"], 0.55)
    bus = bus[: int(dur * SR)]
    bus = np.tanh(1.4 * bus / np.abs(bus).max()) / np.tanh(1.4) * 0.89
    out = os.path.join(proj, "assets", "audio", "soundtrack.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                    "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", out], input=bus.astype(np.float32).tobytes(), check=True)
    json.dump({"dur": dur, "starts": starts, "scenes": scenes, "words": W}, open(os.path.join(proj, "tools", "minutage.json"), "w"), ensure_ascii=False)
    print("ok", name, dur, "s ; scènes", [round(s["t0"], 2) for s in scenes])
    print(" ".join(w[1] for w in W))
