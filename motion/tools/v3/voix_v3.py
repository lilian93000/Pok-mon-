"""Voix « histoire » pour AnalyseTaCopro : Guillaume sur ElevenLabs v3, énergique, avec émotions, puis montage et vérification.

Méthode (fixée par Lilian) :
- eleven_v3, stability 0.0 (« Creative »), similarity 0.8, style 1.0, speaker boost ; tout le texte en UNE génération (/with-timestamps).
- Une phrase courte par ligne, un tag d'émotion devant chaque phrase, mots clés en MAJUSCULES, « … » avant le mot important.
- Montage : chaque blanc de plus de 0,12 s ramené à 0,12 s (silencedetect −38 dB), début et fin intacts, puis atempo ×1,15.
- Les horodatages v3 sont imprécis : on ne coupe jamais d'après eux. Contrôle par retranscription faster-whisper (medium, fr).

Usage : ELEVEN_KEY_FILE=… python3 tools/v3/voix_v3.py <script.txt> <dossier_sortie> <n° d'essai>
<script.txt> : une ligne par phrase, « [tag] texte ». Une ligne « # phonétique: mot => prononciation » remplace un mot pour la voix seulement.
"""
import json
import os
import re
import subprocess
import sys
import urllib.request
from difflib import SequenceMatcher

import numpy as np

VOICE = "3HZyQcLKlT0a3RDeXVsP"   # Guillaume
MODEL = "eleven_v3"
SETTINGS = {"stability": 0.0, "similarity_boost": 0.8, "style": 1.0, "use_speaker_boost": True}
SR = 44100
GAP = 0.12        # blanc maximal gardé (s)
TEMPO = 1.15


def read_script(path):
    lines, phon = [], {}
    for raw in open(path, encoding="utf-8"):
        raw = raw.strip()
        if not raw:
            continue
        m = re.match(r"#\s*phonétique:\s*(.+?)\s*=>\s*(.+)", raw)
        if m:
            phon[m.group(1)] = m.group(2)
        elif not raw.startswith("#"):
            lines.append(raw)
    return lines, phon


def tts(text, mp3, js):
    key = open(os.environ["ELEVEN_KEY_FILE"]).read().strip()
    body = json.dumps({"text": text, "model_id": MODEL, "language_code": "fr", "voice_settings": SETTINGS}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_192",
                                 data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
    d = json.load(urllib.request.urlopen(req, timeout=300))
    import base64
    open(mp3, "wb").write(base64.b64decode(d["audio_base64"]))
    json.dump(d.get("alignment"), open(js, "w"), ensure_ascii=False)


def pcm(path):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"])
    return np.frombuffer(raw, np.float32).copy()


def silences(path):
    out = subprocess.run(["ffmpeg", "-i", path, "-af", f"silencedetect=noise=-38dB:d={GAP}", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    return list(zip(st, en))


def tighten(src, dst):
    """Ramène chaque blanc intérieur à GAP secondes (moitié gardée de chaque côté), début et fin intacts."""
    a = pcm(src)
    dur = len(a) / SR
    keep, pos, cut = [], 0, 0.0
    for s, e in silences(src):
        if s <= 0.02 or e >= dur - 0.02:      # blanc du tout début ou de la toute fin : on n'y touche pas
            continue
        if e - s <= GAP:
            continue
        h = GAP / 2
        keep.append(a[pos:int((s + h) * SR)])
        pos = int((e - h) * SR)
        cut += (e - s) - GAP
    keep.append(a[pos:])
    b = np.concatenate(keep)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    "-af", f"atempo={TEMPO}", "-ar", str(SR), "-c:a", "libmp3lame", "-b:a", "192k", dst],
                   input=b.astype(np.float32).tobytes(), check=True)
    return dur, cut


def norm(s):
    from num2words import num2words
    s = re.sub(r"\d[\d\s]*\d|\d", lambda m: " " + num2words(int(m.group(0).replace(" ", "")), lang="fr") + " ", s)  # 650 → six cent cinquante
    s = re.sub(r"\[[^\]]+\]", " ", s).lower().replace("…", " ").replace("’", "'").replace(" '", "'")
    s = re.sub(r"[^\w' -]", " ", s)
    return [w for w in re.split(r"[\s-]+", s) if w]


def transcribe(path):
    from faster_whisper import WhisperModel
    m = WhisperModel("medium", device="cpu", compute_type="int8")
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"])
    audio = np.frombuffer(raw, np.float32).copy()   # décodé par ffmpeg (évite le décodeur intégré)
    segs, _ = m.transcribe(audio, language="fr", word_timestamps=True, beam_size=5, vad_filter=False)
    words = []
    for sg in segs:
        for w in sg.words:
            words.append([w.word.strip(), round(w.start, 3), round(w.end, 3)])
    return words


def compare(lines, words):
    """Aligne la retranscription sur le texte, phrase par phrase ; renvoie les écarts."""
    ref, owner = [], []
    for i, ln in enumerate(lines):
        for w in norm(ln):
            ref.append(w); owner.append(i)
    hyp = [w for x in words for w in norm(x[0])]
    sm = SequenceMatcher(a=ref, b=hyp, autojunk=False)
    issues = {}
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        li = owner[min(i1, len(owner) - 1)]
        issues.setdefault(li, []).append(f"{tag}: attendu « {' '.join(ref[i1:i2])} » / entendu « {' '.join(hyp[j1:j2])} »")
    return issues, round(sm.ratio() * 100, 1)


if __name__ == "__main__":
    script, out, n = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(out, exist_ok=True)
    lines, phon = read_script(script)
    voice_lines = []
    for ln in lines:
        for k, v in phon.items():
            ln = ln.replace(k, v)
        voice_lines.append(ln)
    text = "\n".join(voice_lines)
    raw, al = f"{out}/essai{n}-brut.mp3", f"{out}/essai{n}-alignement.json"
    if not os.path.exists(raw):
        tts(text, raw, al)
    final = f"{out}/essai{n}.mp3"
    dur, cut = tighten(raw, final)
    words = transcribe(final)
    json.dump(words, open(f"{out}/essai{n}-whisper.json", "w"), ensure_ascii=False)
    issues, score = compare(lines, words)
    fdur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", final]))
    print(f"essai {n} : brut {dur:.2f} s, blancs retirés {cut:.2f} s, final ×{TEMPO} = {fdur:.2f} s, concordance {score} %")
    print("entendu :", " ".join(w[0] for w in words))
    for i, ln in enumerate(lines):
        print(("  OK  " if i not in issues else "  ⚠  ") + re.sub(r"^\[[^\]]+\]\s*", "", ln))
        for x in issues.get(i, []):
            print("        ", x)
