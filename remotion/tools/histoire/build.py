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
words = []  # {w, kw, beat}
for i, b in enumerate(ep["beats"]):
    inside = False
    text = b["text"].replace("« ", "«\u00a0").replace(" »", "\u00a0»").replace(" ?", "\u00a0?").replace(" :", "\u00a0:")
    for tok in text.split(" "):
        kw = inside
        for ch in tok:
            if ch == "*":
                inside = not inside
                kw = kw or inside
        words.append({"w": tok.replace("*", ""), "kw": kw, "beat": i})
full = " ".join(w["w"] for w in words)

key = os.environ.get("ELEVENLABS_API_KEY")
audio = None
if key:
    voice = os.environ.get("ELEVENLABS_VOICE_ID", "")
    cache = pub / "voice.json"
    if not cache.exists() or json.load(open(cache)).get("text") != full:
        if not voice:
            req = urllib.request.Request("https://api.elevenlabs.io/v1/voices", headers={"xi-api-key": key})
            voices = json.load(urllib.request.urlopen(req, timeout=60))["voices"]
            print("Voix disponibles :", [(v["name"], v["voice_id"]) for v in voices])
            voice = voices[0]["voice_id"]
        body = json.dumps({
            "text": full,
            "model_id": os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
            "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True},
        }).encode()
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
            data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
        r = json.load(urllib.request.urlopen(req, timeout=300))
        (pub / "voice.mp3").write_bytes(base64.b64decode(r["audio_base64"]))
        json.dump({"text": full, "alignment": r["alignment"]}, open(cache, "w"))
    al = json.load(open(cache))["alignment"]
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    pos = 0
    for w in words:
        i = full.index(w["w"], pos)
        j = i + len(w["w"]) - 1
        w["start"], w["end"] = st[i], en[j]
        pos = j + 1
    audio = f"histoire/{ep['id']}/voice.mp3"
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

duration = words[-1]["end"] + 1.6
beats = []
for i, b in enumerate(ep["beats"]):
    ws = [w for w in words if w["beat"] == i]
    photo = bool(b.get("image")) and not ep["images"][b["image"]].get("cut")
    beats.append({**{k: v for k, v in b.items() if k != "text"}, "photo": photo, "start": ws[0]["start"] - (0.4 if i == 0 else 0.08)})
for i, b in enumerate(beats):
    b["start"] = max(0, b["start"])
    b["end"] = beats[i + 1]["start"] if i + 1 < len(beats) else duration
props = {"id": ep["id"], "fps": FPS, "duration": round(duration, 3), "audio": audio,
         "words": [{k: w[k] for k in ("w", "kw", "start", "end", "beat")} for w in words], "beats": beats}
json.dump(props, open(pub / "props.json", "w"), ensure_ascii=False, indent=1)
print(f"{'voix ElevenLabs' if audio else 'minutage ESTIMÉ (pas de clé)'} — {duration:.1f} s, {len(words)} mots, {len(beats)} plans")
