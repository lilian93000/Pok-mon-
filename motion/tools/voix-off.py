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

import numpy as np

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


ACRONYMS = ("DPE", "VMC", "PLU", "PNO", "ABF", "TEOM", "PPPT", "RC", "PTO", "ANAH", "HLM")
SUBS = [
    (r"(\d)\s*/\s*10\s?000", r"\1 sur 10 000"), (r"(\d)\s*/\s*1000\b", r"\1 sur 1000"),
    (r"\b1/3\b", "un tiers"), (r"\b2/3\b", "deux tiers"), (r"\b4/16/4\b", "4, 16, 4"), (r"4G/5G", "4G ou 5G"),
    (r"W/m²\.K", "watts par mètre carré kelvin"), (r"\bUw\b", "U W"), (r"\bHT\b", "hors taxes"),
    (r"m²", "mètres carrés"), (r"m³", "mètres cubes"), (r"(\d)\s?m\b", r"\1 mètres"), (r"(\d)\s?mm\b", r"\1 millimètres"),
    (r"(\d)\s?mA\b", r"\1 milliampères"), (r"(\d)\s?dB\b", r"\1 décibels"), (r"(\d)\s?°", r"\1 degrés"),
    (r"(\d)\s?h\b", r"\1 heures"), (r"(\d)\s?%", r"\1 pour cent"), (r"(\d)\s?€", r"\1 euros"), (r"€", "euros"),
    (r"\b1ᵉʳ\b", "premier"), (r"\b1ʳᵉ\b", "première"), (r"\b(\d+)ᵉ\b", r"\1ème"),
    (r"≈\s?", "environ "), (r"\s×\s", " fois "), (r"(\d[^=]*?)\s=\s(\d)", r"\1 égale \2"), (r"\s=\s", " : "), (r"\+ de\b", "plus de"), (r"\bEx\. ?:", "Par exemple :"),
    (r"\bart\. ?", "article "), (r"\bn°\s?", "numéro "), (r"(\d+)\s?–\s?(\d+)", r"\1 à \2"), (r"…", "..."),
]


def speakable(t):
    """Adapte le texte écrit à la prononciation."""
    t = t.replace("AnalyseTaCopro", "Analyse ta copro")
    t = re.sub(r"\bPV\b", "P.V.", t)
    t = re.sub(r"\bAG\b", "A.G.", t)
    for a in ACRONYMS:
        t = re.sub(rf"\b{a}\b", ".".join(a) + ".", t)
    for pat, rep in SUBS:
        t = re.sub(pat, rep, t)
    t = re.sub(r"(\d),(\d)", r"\1 virgule \2", t)
    t = t.replace("« ", "").replace(" »", "").replace("«", "").replace("»", "")
    return re.sub(r"\s+", " ", t).strip()


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


SR = 48000


def pcm(path, af, ch):
    """Décode un fichier audio en float32 48 kHz (ch canaux), filtre ffmpeg af appliqué."""
    raw = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-i", path, "-vn", "-af", f"{af},aresample={SR}",
                          "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32).copy()
    return a if ch == 1 else a.reshape(-1, ch)


def fit(a, n):
    return a[:n] if len(a) >= n else np.concatenate([a, np.zeros((n - len(a),) + a.shape[1:], a.dtype)])


def write_wav(path, a, ch):
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", str(ch), "-i", "-",
                    "-c:a", "pcm_f32le", path], input=np.ascontiguousarray(a, np.float32).tobytes(), check=True)


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


def build(name, secs=None, plan=None, out_dir=None, bed=None, gain=None):
    """plan : liste (début en s dans la vidéo avec accroche, fichier, tempo) déjà calée ; sinon calculée depuis secs."""
    os.makedirs(CACHE, exist_ok=True)
    src = os.path.join(ROOT, "avec-accroche", f"analysetacopro-{name}.mp4")
    orig = os.path.join(ROOT, f"analysetacopro-{name}.mp4")
    out = os.path.join(ROOT, out_dir or os.environ.get("VO_OUT", "tiktok-final"), f"analysetacopro-{name}.mp4")
    bed = bed or os.environ.get("VO_BED")
    gain = gain if gain is not None else float(os.environ.get("VO_MUSIC_GAIN", "0.55"))
    offset = dur(src) - dur(orig)
    total = dur(src)
    def gen(lines):
        out = []
        for t, text in lines:
            p = os.path.join(CACHE, hashlib.sha1(f"{VOICE}|{MODEL}|{text}".encode()).hexdigest()[:16] + ".wav")
            tts(text, p)
            out.append((t, p))
        return out

    if plan is None:
        hook_plan = schedule(gen(secs.get(HOOK_LINES, [])), 0.0, offset + 0.6)[0] if secs.get(HOOK_LINES) else []
        main, tempo = schedule(gen(secs[name]), offset, total)
        plan = [(st, p, 1.0) for st, p in hook_plan] + [(st, p, tempo) for st, p in main]
    # Les pistes sont posées échantillon par échantillon (numpy) puis mixées en une fois :
    # adelay + amix + loudnorm décalaient toute la voix (le silence de tête de la 1ʳᵉ phrase était perdu).
    n = int(round(total * SR))
    vo = np.zeros(n, np.float32)
    for start, p, tempo in plan:
        tempo_f = f"atempo={tempo:.3f}," if abs(tempo - 1.0) > 1e-3 else ""
        # chaque phrase est ramenée à un niveau voix off clair (≈ −13 LUFS) avant d'être placée
        a = pcm(p, f"{tempo_f}loudnorm=I=-13:TP=-1.5:LRA=7", ch=1)
        i = int(round(start * SR))
        vo[i:i + len(a)] += a[: max(0, n - i)]
    mus = pcm(src, f"volume={gain}", ch=2)
    if bed:
        # garde le son de l'accroche, puis le fond choisi à la place de la bande-son d'origine
        h = int(round(offset * SR))
        b = pcm(bed, f"volume={gain}", ch=2)
        mus[h:] = 0
        mus[h:h + len(b)] += b[: max(0, len(mus) - h)]
    mus = fit(mus, n)
    tmp = os.path.join(CACHE, f"mix-{name}")
    write_wav(tmp + "-vo.wav", vo[:, None], 1)
    write_wav(tmp + "-mus.wav", mus, 2)
    f = ["[2:a]highpass=f=90,equalizer=f=3500:t=q:w=1.2:g=3,acompressor=threshold=0.2:ratio=3:attack=5:release=120,"
         "aformat=channel_layouts=stereo,asplit=2[vo][key]",
         "[1:a][key]sidechaincompress=threshold=0.015:ratio=20:attack=10:release=300:makeup=1[duck]",
         "[duck][vo]amix=inputs=2:normalize=0:weights='1 1',loudnorm=I=-11:TP=-1:LRA=11,aresample=48000[a]"]
    args = ["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", src, "-i", tmp + "-mus.wav", "-i", tmp + "-vo.wav",
            "-filter_complex", ";".join(f), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k",
            "-movflags", "+faststart", "-t", f"{total:.3f}", out]
    os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.run(args, check=True)
    print(f"{name}: {len(plan)} phrases, tempo max ×{max(t for _, _, t in plan):.2f} → {os.path.relpath(out, ROOT)}")


if __name__ == "__main__":
    secs = parse()
    names = sys.argv[1:] or [n for n in secs if n != HOOK_LINES]
    for n in names:
        build(n, secs)
