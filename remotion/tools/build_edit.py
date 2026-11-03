"""Construit le montage à partir du plan + de la transcription.

Usage : python3 tools/build_edit.py <transcript.json> <src/data/current.json> <segments.json> [plan]
- plan         : nom du module tools/plan_<plan>.py (défaut : coree)
- current.json : données lues par Remotion (titres, chapitres, sous-titres, fiches, carte)
- segments.json: liste des plans à découper par ffmpeg (tools/render_base.py)
"""
import json
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
import importlib  # noqa: E402

plan = importlib.import_module("plan_" + (sys.argv[4] if len(sys.argv) > 4 else "coree"))
CHAPTER_MAP, CHAPTERS, END, FIX, HOOK = plan.CHAPTER_MAP, plan.CHAPTERS, plan.END, plan.FIX, plan.HOOK
NO_CAPTION, POPS, TIPS = plan.NO_CAPTION, plan.POPS, plan.TIPS

FPS = 30
GAP = 1.0  # blanc maximal gardé dans les passages parlés (s)
PAD_IN, PAD_OUT = 0.12, 0.22

raw = [w for seg in json.load(open(sys.argv[1])) for w in seg["words"]]
raw.sort(key=lambda w: w["s"])
# Whisper coupe parfois un mot en morceaux (« C » + « 'est », « bon » + « ! ») :
# un morceau sans espace devant est recollé au mot précédent.
words = []
for w in raw:
    glued = not w["w"].startswith(" ")
    punct = w["w"].strip() in ("!", "?", ":", ";", "!?")  # « plaisir ! » : ponctuation française isolée
    if words and (glued or punct) and w["s"] - words[-1]["e"] < 0.3:
        sep = "\u00a0" if punct and not glued else ""
        words[-1] = {**words[-1], "w": words[-1]["w"] + sep + w["w"].strip(), "e": w["e"]}
    else:
        words.append(dict(w))


def words_in(a, b):
    return [w for w in words if w["s"] >= a - 0.05 and w["e"] <= b + 0.05]


def split_talk(a, b, gap):
    ws = words_in(a, b)
    if not ws:
        return [(a, b)]
    pieces, start, prev = [], ws[0], ws[0]
    for w in ws[1:]:
        if w["s"] - prev["e"] > gap:
            pieces.append((start["s"], prev["e"]))
            start = w
        prev = w
    pieces.append((start["s"], prev["e"]))
    out = []
    for i, (s, e) in enumerate(pieces):
        s = a if i == 0 and s - a < 1.5 else max(a, s - PAD_IN)
        e = b if i == len(pieces) - 1 and b - e < 1.5 else min(b, e + PAD_OUT)
        out.append((s, e))
    return out


segments = []  # {from,to,frames,outStart,...}
cursor = 0  # frames


def add(a, b, opts):
    global cursor
    n = round((b - a) * FPS)
    if n < 6:
        return None
    seg = {"from": round(a, 3), "to": round(a + n / FPS, 3), "frames": n, "out": cursor}
    for k in ("vertical", "zoom", "volume", "blur"):
        if k in opts:
            seg[k] = opts[k]
    segments.append(seg)
    cursor += n
    return seg


def add_block(a, b, kind, opts):
    first = None
    if kind == "talk":
        for i, (s, e) in enumerate(split_talk(a, b, opts.get("gap", GAP))):
            o = dict(opts)
            if opts.get("punch"):
                o["zoom"] = 1.0 if i % 2 == 0 else 1.14  # « jump cut » : on resserre 1 plan sur 2
            seg = add(s, e, o)
            first = first or seg
    else:
        first = add(a, b, opts)
    return first


titles, chapters = [], []
for a, b, kind, opts in HOOK:
    seg = add_block(a, b, kind, opts)
    if "title" in opts:
        t, sub = opts["title"]
        titles.append({"at": seg["out"] / FPS + 0.3, "dur": (seg["frames"] / FPS) - 0.3, "text": t, "sub": sub})

for n, (title, place, blocks) in enumerate(CHAPTERS, 1):
    start = cursor
    for a, b, kind, opts in blocks:
        add_block(a, b, kind, opts)
    ch = {"at": start / FPS, "n": n, "title": title, "place": place}
    if n in CHAPTER_MAP:
        ch["map"], frm = CHAPTER_MAP[n]
        if frm:
            ch["mapFrom"] = frm
    chapters.append(ch)

end_at = cursor / FPS
for a, b, kind, opts in END:
    add_block(a, b, kind, opts)
duration = cursor / FPS


def src_to_out(t):
    for s in segments:
        if s["from"] <= t < s["to"]:
            return (s["out"] + (t - s["from"]) * FPS) / FPS
    return None


# ---- sous-titres : pages de ≤ 6 mots, coupées sur ponctuation / blanc ----
def fix(w):
    w = w.strip()
    return FIX.get(w, w)


pages = []
for s in segments:
    if s["out"] / FPS >= end_at:
        break
    seg_words = [w for w in words if s["from"] <= w["s"] and w["e"] <= s["to"] + 0.05]
    seg_words = [w for w in seg_words if not any(a <= w["s"] < b for a, b in NO_CAPTION)]
    page = []
    for w in seg_words:
        base = s["out"] / FPS - s["from"]  # temps source -> temps montage, dans CE plan
        ow = {"w": fix(w["w"]), "s": round(base + max(w["s"], s["from"]), 3), "e": round(base + min(w["e"], s["to"]), 3)}
        ends_sentence = ow["w"][-1:] in ".?!"
        too_long = len(page) >= (7 if ends_sentence else 6)  # évite un mot orphelin en fin de phrase
        if page and (too_long or ow["s"] - page[-1]["e"] > 0.45 or page[-1]["w"][-1:] in ".?!,"):
            pages.append(page)
            page = []
        page.append(ow)
    if page:
        pages.append(page)

captions = []
for i, p in enumerate(pages):
    s = p[0]["s"]
    e = p[-1]["e"] + 0.25
    if i + 1 < len(pages):
        e = min(e, pages[i + 1][0]["s"])
    captions.append({"s": s, "e": round(e, 3), "words": p})

tips = []
for t, icon, title, text in TIPS:
    at = src_to_out(t)
    if at is not None:
        tips.append({"at": round(at, 3), "dur": 5.5, "icon": icon, "title": title, "text": text})

def src_to_outs(t):
    """toutes les positions dans le montage (un moment peut être dans l'accroche ET dans son chapitre)"""
    return [(s["out"] + (t - s["from"]) * FPS) / FPS for s in segments if s["from"] <= t < s["to"]]


pops = []
for t, dur, data in POPS:
    for at in src_to_outs(t):
        if at + dur <= end_at:
            pops.append({"at": round(at, 3), "dur": dur, **data})
pops.sort(key=lambda p: p["at"])

edit = {
    "src": "base.mp4",
    "fps": FPS,
    "duration": duration,
    "segments": [],  # le montage vidéo est fait par ffmpeg (base.mp4)
    "chapters": chapters,
    "captions": captions,
    "titles": titles,
    "tips": tips,
    "pops": pops,
    "endScreenAt": end_at,
    "city": getattr(plan, "CITY", ""),
    "places": getattr(plan, "PLACES", {}),
    "endText": getattr(plan, "END_TEXT", ["", ""]),
}
json.dump(edit, open(sys.argv[2], "w"), ensure_ascii=False)
json.dump(segments, open(sys.argv[3], "w"), indent=0)
m, s = divmod(duration, 60)
print(f"{len(segments)} plans · durée {int(m)} min {s:04.1f} s · {len(captions)} sous-titres · {len(tips)} fiches · {len(pops)} animations")
for c in chapters:
    print(f"  {int(c['at'] // 60):02d}:{c['at'] % 60:04.1f}  {c['n']}. {c['title']}")
print(f"  {int(end_at // 60):02d}:{end_at % 60:04.1f}  écran de fin")


# ---- sous-titres ASS (gravés par ffmpeg/libass : bien plus rapide que Remotion) ----
def ass_time(t):
    t = max(0, t)
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def esc(w):
    return w.replace("\\", "").replace("{", "(").replace("}", ")")


ACCENT = "&H007F3DFF&"  # #FF3D7F en BGR
ass = [
    "[Script Info]", "ScriptType: v4.00+", "PlayResX: 1920", "PlayResY: 1080", "WrapStyle: 0", "ScaledBorderAndShadow: yes", "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    "Style: Cap,Montserrat ExtraBold,58,&H00FFFFFF,&H00FFFFFF,&H50000000,&H90000000,0,0,0,0,100,100,0,0,1,1.2,2.5,2,240,240,70,1",
    "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
]
for c in captions:
    ws = c["words"]
    # une ligne par mot prononcé : le mot actif passe en rose
    bounds = [c["s"]] + [w["s"] for w in ws[1:]] + [c["e"]]
    for i in range(len(ws)):
        a, b = max(bounds[i], c["s"]), bounds[i + 1]
        if b - a < 0.02:
            continue
        # « \h » élargit l'espace (celui de Poppins est très étroit)
        txt = " ".join(esc(w["w"]) for w in ws)  # sous-titres simples, sans mot surligné
        ass.append(f"Dialogue: 0,{ass_time(a)},{ass_time(b)},Cap,,0,0,0,,{txt}")
ass_path = sys.argv[2].rsplit(".", 1)[0] + ".ass"
open(ass_path, "w").write("\n".join(ass) + "\n")
print("sous-titres ASS :", ass_path)
