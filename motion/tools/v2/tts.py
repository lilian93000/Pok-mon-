"""Voix de Guillaume avec minutage mot à mot (ElevenLabs /with-timestamps). Usage : VO_VOICE=guillaume ELEVEN_KEY_FILE=… python3 tools/v2/tts.py <dossier> <lignes.json>"""
import base64, importlib.util, json, os, subprocess, sys, urllib.request
sp = importlib.util.spec_from_file_location("vo", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "voix-off.py")); vo = importlib.util.module_from_spec(sp); sp.loader.exec_module(vo)
OUT = sys.argv[1]; LINES = json.load(open(sys.argv[2]))
key = open(os.environ["ELEVEN_KEY_FILE"]).read().strip()
res = []
for i, text in enumerate(LINES):
    mp3 = f"{OUT}/l{i}.mp3"; js = f"{OUT}/l{i}.json"
    if not os.path.exists(js):
        body = json.dumps({"text": vo.speakable(text), "model_id": vo.MODEL, "language_code": "fr", "voice_settings": vo.SETTINGS}).encode()
        req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{vo.VOICE}/with-timestamps?output_format=mp3_44100_128", data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
        d = json.load(urllib.request.urlopen(req, timeout=120))
        open(mp3, "wb").write(base64.b64decode(d["audio_base64"]))
        json.dump(d["alignment"], open(js, "w"), ensure_ascii=False)
    a = json.load(open(js))
    # regroupe les caractères en mots
    words, cur, t0 = [], "", None
    for ch, s, e in zip(a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]):
        if ch.isspace():
            if cur: words.append([cur, t0, pe]); cur = ""
            continue
        if not cur: t0 = s
        cur += ch; pe = e
    if cur: words.append([cur, t0, pe])
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]))
    res.append({"text": text, "dur": round(dur, 3), "words": words})
json.dump(res, open(f"{OUT}/voix.json", "w"), ensure_ascii=False, indent=1)
for r in res: print(r["dur"], r["text"], "| fin parole", round(r["words"][-1][2], 2))
