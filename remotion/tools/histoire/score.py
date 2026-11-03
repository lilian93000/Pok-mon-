#!/usr/bin/env python3
"""Musique composée sur mesure pour un épisode, calée sur la narration.

Usage : ELEVENLABS_API_KEY=... python3 tools/histoire/score.py <id> [--ambiance malice] [--seed N]

Lit public/histoire/<id>/props.json (plans horodatés), découpe l'histoire en sections
(accroche, montée, suspense, drop, final) et demande à ElevenLabs Music (music_v2_5,
composition_plan) une piste instrumentale dont chaque section tombe pile sur les plans.
Puis la musique est « ducking » sous la voix (sidechain ffmpeg) : elle respire dans les
silences et s'efface quand Guillaume parle. Écrit public/histoire/<id>/music.mp3 et met à
jour props.json (music, musicVolume).
"""
import json, os, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Palette par ambiance : styles globaux (le 1er chunk fixe le genre) + interdits communs.
AMBIANCES = {
    "malice": ["playful heist trailer music", "pizzicato strings", "staccato brass stabs", "trap hi-hats",
               "deep 808 bass", "140 BPM", "mischievous", "sneaky", "catchy rhythmic motif", "instrumental"],
    "sombre": ["dark cinematic trailer music", "hybrid trap drums", "deep 808", "low string ostinato",
               "ticking clock", "140 BPM", "ominous", "tense", "instrumental"],
    "epique": ["epic hybrid orchestral trailer", "taiko drums", "trap hi-hats", "driving string ostinato",
               "brass hits", "140 BPM", "heroic", "powerful", "instrumental"],
    "mystere": ["mystery documentary trailer music", "pulsing synth bass", "plucked strings", "trap drums",
                "130 BPM", "curious", "suspenseful", "intriguing", "instrumental"],
    "absurde": ["quirky comedic trailer music", "bouncy pizzicato", "marimba", "trap drums", "808 bass",
                "140 BPM", "funny", "playful", "upbeat", "instrumental"],
}
NEG = ["vocals", "singing", "choir words", "rap", "spoken word", "lyrics", "lo-fi", "slow ambient", "fade in", "long intro"]

SECTIONS = {
    "hook": ("[Hook]", ["massive impact hit on the very first beat", "full energy immediately", "no intro", "punchy drums"]),
    "build": ("[Build]", ["driving rhythm", "steady pulse", "rising tension", "groove"]),
    "break": ("[Breakdown]", ["drums drop out", "quiet", "only low pulse and ticking", "suspense", "sparse"]),
    "drop": ("[Drop]", ["full drop", "heavy drums", "big energy", "brass stabs", "triumphant"]),
    "final": ("[Finale]", ["dramatic", "epic", "intense", "rising", "climax"]),
    "end": ("[Ending]", ["building tension", "riser", "ends abruptly on a hit", "no fade out"]),
}


def kind(i, b, n):
    if i == 0:
        return "hook"
    if b.get("tag") == "whispers":
        return "break"
    if i >= n - 1:
        return "end"
    if i >= n - 3 or b.get("tag") == "dramatically":
        return "final"
    if b.get("bg") == "red" or b.get("stamp") or b.get("tag") in ("laughs",):
        return "drop"
    return "build"


def plan(props, ambiance):
    beats, total = props["beats"], round(props["duration"] * 1000)
    segs = []  # [kind, start_ms]
    for i, b in enumerate(beats):
        k = kind(i, b, len(beats))
        if not segs or segs[-1][0] != k:
            segs.append([k, round(b["start"] * 1000)])
    segs[0][1] = 0
    # chaque section ≥ 3 s (minimum de l'API). Le DÉBUT d'une section reste calé sur son plan :
    # une section courte prend du temps à la suivante ; sinon elle commence plus tôt ;
    # sinon elle fusionne avec la voisine la moins importante.
    PRIO = {"hook": 6, "break": 5, "drop": 4, "end": 3, "final": 2, "build": 1}
    MIN = 3000
    L = lambda j: (segs[j + 1][1] if j + 1 < len(segs) else total) - segs[j][1]
    while len(segs) > 1:
        j = min(range(len(segs)), key=L)
        if L(j) >= MIN:
            break
        need = MIN - L(j)
        if j + 1 < len(segs) and L(j + 1) - need >= MIN:
            segs[j + 1][1] += need
        elif j > 0 and L(j - 1) - need >= MIN:
            segs[j][1] -= need
        else:
            nb = [x for x in (j - 1, j + 1) if 0 <= x < len(segs)]
            o = min(nb, key=lambda x: PRIO[segs[x][0]])
            keep = max(segs[j][0], segs[o][0], key=PRIO.get)
            a, b = min(j, o), max(j, o)
            segs[a][0] = keep
            segs.pop(b)
        k = 1  # fusionne les voisines identiques
        while k < len(segs):
            if segs[k][0] == segs[k - 1][0]:
                segs.pop(k)
            else:
                k += 1
    chunks = []
    for j, (k, st) in enumerate(segs):
        end = segs[j + 1][1] if j + 1 < len(segs) else total
        name, styles = SECTIONS[k]
        pos = (AMBIANCES[ambiance] if j == 0 else []) + styles + (["instrumental"] if j else [])
        chunks.append({"text": f"{name} {{instrumental}}", "duration_ms": end - st,
                       "positive_styles": pos, "negative_styles": NEG})
    return chunks


def main():
    a = sys.argv[1:]
    ep_id = a[0]
    epf = ROOT / "histoire/episodes" / f"{ep_id}.json"
    ep_amb = json.load(open(epf)).get("ambiance") if epf.exists() else None
    ambiance = a[a.index("--ambiance") + 1] if "--ambiance" in a else (ep_amb or "malice")
    seed = int(a[a.index("--seed") + 1]) if "--seed" in a else None
    out = a[a.index("--out") + 1] if "--out" in a else "music.mp3"
    pub = ROOT / "public/histoire" / ep_id
    props = json.load(open(pub / "props.json"))
    chunks = plan(props, ambiance)
    for c in chunks:
        print(f"  {c['text']:<28} {c['duration_ms'] / 1000:5.1f} s")
    body = {"model_id": "music_v2_5", "composition_plan": {"chunks": chunks}}
    if seed is not None:
        body["seed"] = seed
    raw = pub / ("raw-" + out)
    sig = pub / ("plan-" + out + ".json")  # la musique est recomposée si le découpage change
    if raw.exists() and (not sig.exists() or json.load(open(sig)) != body):
        raw.unlink()
    if not raw.exists():
        req = urllib.request.Request("https://api.elevenlabs.io/v1/music?output_format=mp3_48000_192",
                                     data=json.dumps(body).encode(),
                                     headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
        try:
            raw.write_bytes(urllib.request.urlopen(req, timeout=600).read())
        except urllib.error.HTTPError as e:
            sys.exit(f"ElevenLabs Music : {e.code} {e.read()[:600]!r}")
        json.dump(body, open(sig, "w"))
    # ducking : la musique (normalisée) s'efface sous la voix, remonte dans les blancs
    voice = pub / "voice_tight.mp3"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-i", str(voice), "-filter_complex",
                    "[0:a]loudnorm=I=-16:TP=-2,aresample=48000[m];[1:a]aresample=48000,asplit=1[v];"
                    "[m][v]sidechaincompress=threshold=0.02:ratio=5:attack=20:release=300:makeup=1[o]",
                    "-map", "[o]", "-c:a", "libmp3lame", "-b:a", "192k", str(pub / out)], check=True)
    props["music"] = f"histoire/{ep_id}/{out}"
    props["musicVolume"] = float(a[a.index("--volume") + 1]) if "--volume" in a else 0.22
    json.dump(props, open(pub / "props.json", "w"), ensure_ascii=False, indent=1)
    print(f"musique → {pub / out} ({len(chunks)} sections, ambiance {ambiance})")


if __name__ == "__main__":
    main()
