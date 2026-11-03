"""Transcription horodatée au mot (faster-whisper large-v3-turbo, CPU).

Usage : python3 tools/transcribe.py <video.mp4> <sortie_sans_extension> [langue=fr]
Écrit <sortie>.json (segments + mots horodatés) et <sortie>.txt (lisible, suivi en direct).
Le modèle (~1,5 Go) est téléchargé depuis huggingface.co au premier usage.
"""
import json
import subprocess
import sys
import time

import numpy as np
from faster_whisper import WhisperModel

video, out = sys.argv[1], sys.argv[2]
lang = sys.argv[3] if len(sys.argv) > 3 else "fr"
t0 = time.time()
# audio 16 kHz mono décodé par ffmpeg (évite les soucis de PyAV)
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vn", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
model = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=4)
segs, _ = model.transcribe(audio, language=lang, word_timestamps=True, vad_filter=True, beam_size=1)
res = []
with open(out + ".txt", "w") as f:
    for s in segs:
        res.append({"start": s.start, "end": s.end, "text": s.text.strip(),
                    "words": [{"w": w.word, "s": w.start, "e": w.end, "p": round(w.probability, 2)} for w in s.words]})
        line = f"[{s.start:7.1f}-{s.end:7.1f}] {s.text.strip()}"
        print(line, flush=True)
        f.write(line + "\n")
        f.flush()
json.dump(res, open(out + ".json", "w"), ensure_ascii=False)
print(f"DONE en {time.time() - t0:.0f} s", flush=True)
