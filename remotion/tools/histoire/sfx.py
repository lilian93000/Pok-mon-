"""Banque de bruitages + musique via ElevenLabs (une fois, réutilisés) : public/histoire/_sfx/."""
import json, os, sys, urllib.request
from pathlib import Path
out = Path(__file__).resolve().parents[2] / "public" / "histoire" / "_sfx"
out.mkdir(parents=True, exist_ok=True)
KEY = os.environ["ELEVENLABS_API_KEY"]

def post(path, body, dst):
    if dst.exists():
        return
    req = urllib.request.Request("https://api.elevenlabs.io" + path, data=json.dumps(body).encode(),
                                 headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    dst.write_bytes(urllib.request.urlopen(req, timeout=600).read())
    print("ok", dst.name)

SFX = {
    "whoosh1": ("fast short cinematic whoosh swipe transition, clean", 0.8),
    "whoosh2": ("quick airy swoosh pass by, cinematic trailer", 0.8),
    "whoosh3": ("short deep whoosh with subtle low hit", 0.9),
    "impact": ("massive cinematic trailer impact boom hit with deep sub bass, short tail", 2.0),
    "stamp": ("heavy rubber stamp slam on wooden desk with a deep boom", 1.2),
    "riser": ("short tense cinematic riser build up", 2.0),
}
for k, (prompt, d) in SFX.items():
    post("/v1/sound-generation", {"text": prompt, "duration_seconds": d, "prompt_influence": 0.6}, out / f"{k}.mp3")

if len(sys.argv) > 1:  # musique de fond : sfx.py <nom> <durée_s> "<prompt>"
    name, secs = sys.argv[1], float(sys.argv[2])
    prompt = sys.argv[3] if len(sys.argv) > 3 else (
        "dark epic cinematic documentary underscore, driving pulsing low strings, taiko and war drums, "
        "tense and powerful, steady energy from start to end, no vocals, no silence")
    post("/v1/music", {"prompt": prompt, "music_length_ms": int(secs * 1000), "force_instrumental": True}, out / f"music-{name}.mp3")
