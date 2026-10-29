"""Voix off ElevenLabs sur les vidéos TikTok (avec accroche).

Lit voix-off/TEXTES.md (sections « ## Titre », lignes « > temps — texte »), génère chaque phrase avec la voix choisie,
la cale sur l'image (temps de la vidéo sans accroche + durée de l'accroche), baisse la musique sous la voix
(sidechain) et remplace la piste son de avec-accroche/<nom>.mp4 → tiktok-final/<nom>.mp4 (image copiée telle quelle).

Usage (depuis motion/) :
  ELEVEN_KEY_FILE=/chemin/vers/cle python3 tools/voix-off.py [gps meteo …]     # sans argument : toutes
  VO_VOICE=guillaume … python3 tools/voix-off.py vraifaux                        # autre voix (voir VOICES)
  VO_BED=fond.wav VO_MUSIC_GAIN=0.3 VO_OUT=dossier …                             # autre fond sonore (après l'accroche),
                                                                                 # son volume, et le dossier de sortie
La clé n'est jamais écrite dans le dépôt ; les phrases générées sont mises en cache hors dépôt (VO_CACHE).
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# voix ElevenLabs : (identifiant, modèle, balise de ton v3, réglages)
VOICES = {
    "liam": ("TX3LPaxmHKxFdv7VOQHJ", "eleven_v3", "[excited] ", None),
    "guillaume": ("3HZyQcLKlT0a3RDeXVsP", "eleven_multilingual_v2", "", {"stability": 0.45, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True}),
}
VOICE, MODEL, TAG, SETTINGS = VOICES[os.environ.get("VO_VOICE", "liam")]
CACHE = os.environ.get("VO_CACHE", "/tmp/voix-off-cache")
HOOK_LINES = "Accroche"

FILES = {
    "GPS": "gps",
    "La météo de ta copro": "meteo",
    "Le bulletin de notes": "bulletin",
    "Notice de montage": "notice",
    "Bilan de santé": "sante",
    "La voyante": "voyante",
    "L'addition": "addition",
    "Game Over (arcade)": "arcade",
    "L'affaire n°0347": "affaire",
    "Red flag ou green flag (quiz)": "quiz",
    "POV : 3 mois après": "pov",
    "CoproMatch": "match",
    "Le scanner": "scanner",
    "4K (« N'achète pas sans analyser »)": "4k",
    "Motion design (3 étapes)": "tiktok-motion",
    "Vrais humains": "tiktok",
    "Le groupe de la copro": "groupe",
    "Unboxing": "unboxing",
    "La recette ratée": "recette",
    "Le détecteur de mensonges": "mensonge",
    "Le ticket à gratter": "grattage",
    "Le jeu des 5 erreurs": "erreurs",
    "L'iceberg": "iceberg",
    "Les poupées russes": "poupees",
    "La Bourse": "bourse",
    "La tour en bois": "tour",
    "Vrai ou faux en copro": "vraifaux",
}

NUM = {"0": "zéro", "1": "un", "2": "deux", "3": "trois", "4": "quatre", "5": "cinq", "6": "six", "7": "sept", "8": "huit", "9": "neuf"}


def speakable(t):
    """Adapte le texte écrit à la prononciation."""
    t = t.replace("AnalyseTaCopro", "Analyse ta copro")
    t = re.sub(r"\bPV\b", "P.V.", t)
    t = re.sub(r"\bAG\b", "A.G.", t)
    t = re.sub(r"(\d),(\d)", lambda m: f"{NUM[m.group(1)]} virgule {NUM[m.group(2)]}", t)
    t = t.replace("« ", "").replace(" »", "")
    return t


def parse():
    secs, cur = {}, None
    for line in open(os.path.join(ROOT, "voix-off", "TEXTES.md"), encoding="utf-8"):
        line = line.rstrip("\n")
        if line.startswith("## "):
            title = line[3:].strip()
            cur = HOOK_LINES if title.startswith("Accroche") else FILES.get(title)
            if cur:
                secs[cur] = []
        elif line.startswith("> ") and cur:
            m = re.match(r">\s*([\d,]+)\s*—\s*(.+)", line)
            if m:
                secs[cur].append((float(m.group(1).replace(",", ".")), m.group(2).strip()))
    return secs


def tts(text, out):
    if os.path.exists(out):
        return
    key = open(os.environ["ELEVEN_KEY_FILE"]).read().strip()
    payload = {"text": TAG + speakable(text), "model_id": MODEL, "language_code": "fr"}
    if SETTINGS:
        payload["voice_settings"] = SETTINGS
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
        data=body,
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    raw = out + ".raw.mp3"
    open(raw, "wb").write(data)
    # coupe les silences de début et de fin, mono 48 kHz
    trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", raw, "-af", trim, "-ar", "48000", "-ac", "1", out], check=True)
    os.remove(raw)


def dur(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True).stdout)


def schedule(lines, offset, end, gap=0.08, max_drift=0.9):
    """Place les phrases au plus près de leur temps, sans chevauchement.
    Prend la vitesse la plus naturelle qui garde chaque phrase à moins de max_drift s de son image."""
    best = None
    for tempo in (1.0, 1.05, 1.1, 1.15, 1.2):
        t_prev, plan, drift = 0.0, [], 0.0
        for t, path in lines:
            d = dur(path) / tempo
            start = max(t + offset, t_prev + gap)
            drift = max(drift, start - (t + offset))
            plan.append((start, path))
            t_prev = start + d
        fits = t_prev <= end - 0.25
        if fits and drift <= max_drift:
            return plan, tempo
        if best is None or (fits, -drift) > (best[2], -best[3]):
            best = (plan, tempo, fits, drift)
    return best[0], best[1]


def build(name, secs):
    os.makedirs(CACHE, exist_ok=True)
    src = os.path.join(ROOT, "avec-accroche", f"analysetacopro-{name}.mp4")
    orig = os.path.join(ROOT, f"analysetacopro-{name}.mp4")
    out = os.path.join(ROOT, os.environ.get("VO_OUT", "tiktok-final"), f"analysetacopro-{name}.mp4")
    bed = os.environ.get("VO_BED")
    gain = float(os.environ.get("VO_MUSIC_GAIN", "0.55"))
    offset = dur(src) - dur(orig)
    total = dur(src)
    def gen(lines):
        out = []
        for t, text in lines:
            p = os.path.join(CACHE, hashlib.sha1(f"{VOICE}|{MODEL}|{text}".encode()).hexdigest()[:16] + ".wav")
            tts(text, p)
            out.append((t, p))
        return out

    hook_plan = schedule(gen(secs.get(HOOK_LINES, [])), 0.0, offset + 0.6)[0] if secs.get(HOOK_LINES) else []
    plan, tempo = schedule(gen(secs[name]), offset, total)
    plan = hook_plan + plan
    args = ["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", src]
    for _, p in plan:
        args += ["-i", p]
    if bed:
        args += ["-i", bed]
    f = []
    for k, (start, _) in enumerate(plan, start=1):
        ms = int(start * 1000)
        tempo_f = f"atempo={tempo:.3f}," if tempo != 1.0 else ""
        # chaque phrase est ramenée à un niveau voix off clair (≈ −13 LUFS) avant d'être placée
        f.append(f"[{k}:a]{tempo_f}loudnorm=I=-13:TP=-1.5:LRA=7,aresample=48000,adelay={ms}|{ms},apad[v{k}]")
    vo_in = "".join(f"[v{k}]" for k in range(1, len(plan) + 1))
    f.append(f"{vo_in}amix=inputs={len(plan)}:normalize=0:duration=longest,atrim=0:{total:.3f},"
             "highpass=f=90,equalizer=f=3500:t=q:w=1.2:g=3,acompressor=threshold=0.2:ratio=3:attack=5:release=120,"
             "aformat=channel_layouts=stereo,asplit=2[vo][key]")
    if bed:
        # garde le son de l'accroche, puis le fond choisi à la place de la bande-son d'origine
        ms = int(offset * 1000)
        f.append(f"[0:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{offset:.3f},apad[hk]")
        f.append(f"[{len(plan) + 1}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[bd]")
        f.append(f"[hk][bd]amix=inputs=2:normalize=0:duration=longest,atrim=0:{total:.3f},volume={gain}[mus]")
    else:
        f.append(f"[0:a]aresample=48000,aformat=channel_layouts=stereo,volume={gain}[mus]")
    f.append("[mus][key]sidechaincompress=threshold=0.015:ratio=20:attack=10:release=300:makeup=1[duck]")
    f.append("[duck][vo]amix=inputs=2:normalize=0:weights='1 1',loudnorm=I=-11:TP=-1:LRA=11,aresample=48000[a]")
    args += ["-filter_complex", ";".join(f), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k",
             "-movflags", "+faststart", "-t", f"{total:.3f}", out]
    os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.run(args, check=True)
    print(f"{name}: {len(plan)} phrases, tempo ×{tempo:.2f} → {os.path.relpath(out, ROOT)}")


if __name__ == "__main__":
    secs = parse()
    names = sys.argv[1:] or [n for n in secs if n != HOOK_LINES]
    for n in names:
        build(n, secs)
