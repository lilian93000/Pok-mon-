"""Voix + minutage d'un épisode -> props Remotion.
Usage : python3 tools/histoire/build.py histoire/episodes/<id>.json
- Avec ELEVENLABS_API_KEY (+ ELEVENLABS_VOICE_ID) : voix ElevenLabs avec horodatage
  au caractère (endpoint with-timestamps), mise en cache dans public/histoire/<id>/.
- Sans clé : minutage estimé (aperçu muet, pour valider l'image).
Sortie : public/histoire/<id>/props.json"""
import base64, json, os, re, sys, urllib.request
from pathlib import Path

FPS = 30
ep = json.load(open(sys.argv[1]))
root = Path(__file__).resolve().parents[2]
pub = root / "public" / "histoire" / ep["id"]
pub.mkdir(parents=True, exist_ok=True)

# Texte : un mot = un jeton séparé par des espaces ; *mot* = mot-clé (accent)
def toks(text):
    text = text.replace("« ", "«\u00a0").replace(" »", "\u00a0»").replace(" ?", "\u00a0?").replace(" :", "\u00a0:").replace(" !", "\u00a0!")
    return text.split(" ")

def spoken(tok):
    # ce qu'on envoie à la voix : sans guillemets ni astérisques (les « en début de texte font dérailler la voix)
    return tok.replace("*", "").replace("«", "").replace("»", "").replace("\u00a0", " ").strip()

words = []  # {w: affiché, s: prononcé, kw, beat}
for i, b in enumerate(ep["beats"]):
    disp = toks(b["text"])
    # "prononciation" : {"Pecunia non olet": "Pékounia nonne olète"} — même nombre de mots
    said_text = b["text"]
    for k, v in b.get("prononciation", {}).items():
        said_text = said_text.replace(k, v)
    said = toks(said_text)
    assert len(said) == len(disp), f"plan {i} : la prononciation doit garder le même nombre de mots"
    inside = False
    for tok, sk in zip(disp, said):
        kw = inside
        for ch in tok:
            if ch == "*":
                inside = not inside
                kw = kw or inside
        words.append({"w": tok.replace("*", ""), "s": spoken(sk), "kw": kw, "beat": i})
full = " ".join(w["s"] for w in words if w["s"])

key = os.environ.get("ELEVENLABS_API_KEY")
audio = None
if key:
    voice = os.environ.get("ELEVENLABS_VOICE_ID", "3HZyQcLKlT0a3RDeXVsP")  # voix choisie par l'utilisateur
    cache = pub / "voice.json"
    # Réglages « énergiques » : moins de stabilité = plus d'intonation, style poussé, débit +12 %
    settings = {"stability": 0.28, "similarity_boost": 0.8, "style": 0.8, "use_speaker_boost": True, "speed": 1.2}
    settings.update(ep.get("voix", {}))
    sig = {"text": full, "voice": voice, "settings": settings}
    if not cache.exists() or json.load(open(cache)).get("sig") != sig:
        if not voice:
            req = urllib.request.Request("https://api.elevenlabs.io/v1/voices", headers={"xi-api-key": key})
            voices = json.load(urllib.request.urlopen(req, timeout=60))["voices"]
            print("Voix disponibles :", [(v["name"], v["voice_id"]) for v in voices])
            voice = voices[0]["voice_id"]
        body = json.dumps({
            "text": full,
            "model_id": os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
            "voice_settings": settings,
        }).encode()
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
            data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
        r = json.load(urllib.request.urlopen(req, timeout=300))
        (pub / "voice.mp3").write_bytes(base64.b64decode(r["audio_base64"]))
        json.dump({"sig": sig, "alignment": r["alignment"]}, open(cache, "w"))
    al = json.load(open(cache))["alignment"]
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    pos = 0
    for w in words:
        if not w["s"]:  # mot sans son (ex. « seul) : collé au mot suivant
            w["start"] = w["end"] = None
            continue
        i = full.index(w["s"], pos)
        j = i + len(w["s"]) - 1
        w["start"], w["end"] = st[i], en[j]
        pos = j + 1
    for k in range(len(words) - 1, -1, -1):
        if words[k]["start"] is None:
            nxt = words[k + 1] if k + 1 < len(words) else words[k - 1]
            words[k]["start"] = words[k]["end"] = nxt["start"]
    # Resserrer les silences (style TikTok) : max 0,2 s après ponctuation, 0,08 s sinon
    import subprocess
    keep, t, removed = [], 0.0, []
    lead = max(0.0, words[0]["start"] - 0.05)
    keep_start, shift = lead, lead
    cuts = [(0.0, lead)] if lead > 0 else []
    for a, b in zip(words, words[1:]):
        gap = b["start"] - a["end"]
        mx = 0.2 if a["w"][-1:] in ".?!…»,:" else 0.08
        if gap > mx:
            cuts.append((a["end"] + mx / 2, b["start"] - mx / 2))
    def remap(x):
        return x - sum(min(max(x - c0, 0), c1 - c0) for c0, c1 in cuts)
    segs, cur = [], 0.0
    for c0, c1 in cuts:
        if c0 > cur: segs.append((cur, c0))
        cur = c1
    segs.append((cur, words[-1]["end"] + 0.3))
    fc = "".join(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[s{i}];" for i, (a, b) in enumerate(segs))
    fc += "".join(f"[s{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1[o]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(pub / "voice.mp3"), "-filter_complex", fc, "-map", "[o]",
                    "-ar", "44100", "-b:a", "192k", str(pub / "voice_tight.mp3")], check=True)
    for w in words:
        w["start"], w["end"] = remap(w["start"]), remap(w["end"])
    audio = f"histoire/{ep['id']}/voice_tight.mp3"
else:
    t = 0.4
    for k, w in enumerate(words):
        d = 0.09 + 0.05 * len(w["w"])
        w["start"], w["end"] = t, t + d
        t += d + 0.05
        if w["w"][-1:] in ".?!…»" : t += 0.35
        elif w["w"][-1:] in ",:" : t += 0.15
        if k + 1 < len(words) and words[k + 1]["beat"] != w["beat"]:
            t += 0.1

TARGET = float(ep.get("duree", 60))  # durée imposée : 60 s pile
if words[-1]["end"] > TARGET - 0.8:
    sys.exit(f"Script trop long : la voix finit à {words[-1]['end']:.1f} s (max {TARGET - 0.8:.1f} s). Raccourcir le texte.")
duration = TARGET
beats = []
for i, b in enumerate(ep["beats"]):
    ws = [w for w in words if w["beat"] == i]
    photo = bool(b.get("image")) and not ep["images"][b["image"]].get("cut")
    beats.append({**{k: v for k, v in b.items() if k != "text"}, "photo": photo, "start": ws[0]["start"] - (0.4 if i == 0 else 0.08)})
for i, b in enumerate(beats):
    b["start"] = max(0, b["start"])
    b["end"] = beats[i + 1]["start"] if i + 1 < len(beats) else duration
props = {"id": ep["id"], "fps": FPS, "duration": round(duration, 3), "audio": audio,
         "music": None,  # musique ajoutée dans TikTok (thème Succession), pas dans le fichier
         "words": [{k: w[k] for k in ("w", "kw", "start", "end", "beat")} for w in words], "beats": beats}
json.dump(props, open(pub / "props.json", "w"), ensure_ascii=False, indent=1)
print(f"{'voix ElevenLabs' if audio else 'minutage ESTIMÉ (pas de clé)'} — {duration:.1f} s, {len(words)} mots, {len(beats)} plans")
