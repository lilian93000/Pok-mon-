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
    if b.get("tag"):  # consigne de jeu ElevenLabs v3 (ex. [excited]) : dite, jamais affichée
        words.append({"w": "", "s": f"[{b['tag']}]", "kw": False, "beat": i})
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
    if ep.get("model") == "eleven_v3":
        settings = {"stability": 0.0, "similarity_boost": 0.8, "style": 1.0, "use_speaker_boost": True}
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
            "model_id": ep.get("model") or os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
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
    det = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(pub / "voice.mp3"), "-af", "silencedetect=noise=-38dB:d=0.12", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", det)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", det)]
    total = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", det).group(3)) + 60 * float(re.search(r"Duration: (\d+):(\d+)", det).group(2))
    lead = max(0.0, ends[0] - 0.03) if starts and starts[0] < 0.05 else 0.0  # blanc du début, mesuré
    cuts = [(0.0, lead)] if lead > 0 else []
    keep = float(ep.get("pause", 0.2))
    for s0, s1 in zip(starts, ends):
        if s0 < lead + 0.01 or s1 >= total - 0.05:  # ni le blanc du début, ni celui de la fin
            continue
        if s1 - s0 > keep:
            cuts.append((s0 + keep / 2, s1 - keep / 2))
    def remap(x):
        return x - sum(min(max(x - c0, 0), c1 - c0) for c0, c1 in cuts)
    segs, cur = [], 0.0
    for c0, c1 in cuts:
        if c0 > cur: segs.append((cur, c0))
        cur = c1
    tail = next((s0 for s0, s1 in zip(starts, ends) if s1 >= total - 0.05 and s0 > cur), total)
    segs.append((cur, min(total, tail + 0.15)))
    fc = "".join(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[s{i}];" for i, (a, b) in enumerate(segs))
    TEMPO = float(ep.get("tempo", 1.0))  # > 1 : voix accélérée au montage (atempo garde le timbre)
    fc += "".join(f"[s{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1" + (f",atempo={TEMPO}" if TEMPO != 1 else "") + "[o]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(pub / "voice.mp3"), "-filter_complex", fc, "-map", "[o]",
                    "-ar", "44100", "-b:a", "192k", str(pub / "voice_tight.mp3")], check=True)
    for w in words:
        w["start"], w["end"] = remap(w["start"]) / TEMPO, remap(w["end"]) / TEMPO
    audio = f"histoire/{ep['id']}/voice_tight.mp3"
    if ep.get("model") == "eleven_v3":
        # Recalage des sous-titres sur la voix finale (minutage v3 imprécis) : transcription mot à mot + alignement de séquences
        import difflib, unicodedata, wave
        import numpy as np
        from faster_whisper import WhisperModel
        wav = pub / "voice_tight.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(pub / "voice_tight.mp3"), "-ar", "16000", "-ac", "1", str(wav)], check=True)
        wf = wave.open(str(wav)); pcm = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768
        segs_w, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(pcm, language="fr", word_timestamps=True)
        hw = [x for g in segs_w for x in g.words]
        norm = lambda t: "".join(c for c in unicodedata.normalize("NFD", t.lower()) if c.isalnum())
        ours = [w for w in words if w["w"]]
        sm = difflib.SequenceMatcher(None, [norm(w["w"]) for w in ours], [norm(x.word) for x in hw], autojunk=False)
        fixed = 0
        for blk in sm.get_matching_blocks():
            for k in range(blk.size):
                w, x = ours[blk.a + k], hw[blk.b + k]
                w["start"], w["end"] = x.start, x.end; fixed += 1
        matched = {blk.a + k for blk in sm.get_matching_blocks() for k in range(blk.size)}
        k = 0
        while k < len(ours):  # mots non reconnus : répartis entre leurs voisins calés
            if k in matched:
                k += 1; continue
            j = k
            while j < len(ours) and j not in matched: j += 1
            t0 = ours[k - 1]["end"] if k > 0 else 0.0
            t1 = ours[j]["start"] if j < len(ours) else t0 + 0.35 * (j - k)
            step = max(0.05, (t1 - t0) / (j - k))
            for n in range(k, j):
                ours[n]["start"], ours[n]["end"] = t0 + step * (n - k), t0 + step * (n - k + 1) - 0.02
            k = j
        print(f"recalage : {fixed}/{len(ours)} mots calés sur la voix réelle, {len(ours) - fixed} répartis entre leurs voisins")
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

LOOP = bool(ep.get("v2"))  # format court en boucle : la vidéo s'arrête juste après le dernier mot
TARGET = round(words[-1]["end"] + 0.3, 3) if LOOP else float(ep.get("duree", 60))  # sinon : 60 s pile
if not LOOP and words[-1]["end"] > TARGET - 0.8:
    sys.exit(f"Script trop long : la voix finit à {words[-1]['end']:.1f} s (max {TARGET - 0.8:.1f} s). Raccourcir le texte.")
duration = TARGET
beats = []
for i, b in enumerate(ep["beats"]):
    ws = [w for w in words if w["beat"] == i and w["w"]]
    photo = bool(b.get("image")) and not ep["images"][b["image"]].get("cut")
    beats.append({**{k: v for k, v in b.items() if k != "text"}, "photo": photo, "start": ws[0]["start"] - (0.4 if i == 0 else 0.08)})
for i, b in enumerate(beats):
    b["start"] = max(0, b["start"])
    b["end"] = beats[i + 1]["start"] if i + 1 < len(beats) else duration
props = {"id": ep["id"], "v2": LOOP, "punch": bool(ep.get("punch")), "fps": FPS, "duration": round(duration, 3), "audio": audio,
         "music": f"histoire/_sfx/music-{ep['musique']}.mp3" if ep.get("musique") else None,
         "musicVolume": float(ep.get("volume_musique", 0.12)), "sfx": bool(ep.get("sfx")),
         "words": [{k: w[k] for k in ("w", "kw", "start", "end", "beat")} for w in words if w["w"]], "beats": beats}
json.dump(props, open(pub / "props.json", "w"), ensure_ascii=False, indent=1)
if audio:
    (pub / "ready").touch()  # signal pour tools/histoire/render_queue.sh
print(f"{'voix ElevenLabs' if audio else 'minutage ESTIMÉ (pas de clé)'} — {duration:.1f} s, {len(words)} mots, {len(beats)} plans")
