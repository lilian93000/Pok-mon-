"""Bande-son originale de « Le Scanner » (AnalyseTaCopro), 30 s, 120 BPM.

0–4 s   rêverie en fa majeur (piano électrique, nappe) puis arrêt de bande
4–5 s   « Vraiment ? » : impact grave, glitch
5–12,5  scan en ré mineur : pulsation de basse, tic-tac, bourdon du scanner qui monte
12,5–16 tension : battement de cœur, montée
16–18   coup de fouet, scan express, silence d'une croche
18–30   drop lumineux en fa majeur (F–C–Dm–B♭), fin apaisée

Usage :  python3 tools/soundtrack.py <dossier_sfx_hyperframes> <sortie.wav>
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

SR = 48000
DUR = 30.0
BEAT = 0.5
N = int(SR * DUR)
T = np.arange(N) / SR
rng = np.random.default_rng(11)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(X, len(x))


def highpass(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X, len(x))


def place(buf, sig, t0, gain=1.0):
    i = int(round(t0 * SR))
    if i >= len(buf) or i < 0:
        return
    n = min(len(sig), len(buf) - i)
    buf[i : i + n] += sig[:n] * gain


def saw(f, t):
    return 2 * ((f * t) % 1.0) - 1


def ep(f, L=1.6):
    """Piano électrique doux (FM légère)."""
    t = np.arange(int(L * SR)) / SR
    mod = np.sin(2 * np.pi * f * 2 * t) * 1.2 * np.exp(-t * 6)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 2.2) * 0.4


def kick(L=0.45, top=120, decay=7):
    t = np.arange(int(L * SR)) / SR
    f = 44 + top * np.exp(-t * 30)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay)
    click = rng.standard_normal(len(t)) * np.exp(-t * 400) * 0.2
    return np.tanh((body + click) * 1.6)


def snare():
    t = np.arange(int(0.25 * SR)) / SR
    n = highpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 20)
    return (n + np.sin(2 * np.pi * 185 * t) * np.exp(-t * 30) * 0.6) * 0.6


def clap():
    t = np.arange(int(0.3 * SR)) / SR
    env = sum((t >= d) * np.exp(-np.maximum(t - d, 0) * (60 if d < 0.02 else 16)) for d in (0.0, 0.012, 0.024))
    return highpass(lowpass(rng.standard_normal(len(t)), 3600), 900) * env * 0.8


def tick(f=6000, L=0.04):
    t = np.arange(int(L * SR)) / SR
    return highpass(rng.standard_normal(len(t)), f) * np.exp(-t * 90) * 0.5


def pluck(f, L=0.4, bright=3000):
    t = np.arange(int(L * SR)) / SR
    s = (saw(f, t) * 0.6 + np.sign(np.sin(2 * np.pi * f * 1.002 * t)) * 0.4) * np.exp(-t * 8)
    return lowpass(s, bright) * 0.45


def pad_chord(notes, L, cutoff, attack=0.4):
    t = np.arange(int(L * SR)) / SR
    s = sum(saw(midi(n + d), t) for n in notes for d in (-0.07, 0.0, 0.06))
    env = np.minimum(t / attack, 1) * np.exp(-np.maximum(t - (L - 0.15), 0) * 20)
    return lowpass(s * env, cutoff) / (3 * len(notes))


L_ = np.zeros(N)
R_ = np.zeros(N)


def add(sig, t0, gain=1.0, pan=0.0):
    place(L_, sig, t0, gain * (1 - max(pan, 0)))
    place(R_, sig, t0, gain * (1 + min(pan, 0)))


# ---------- 0–4 s : rêverie en fa majeur ----------
dream = np.zeros(N)
for k, (n, tt) in enumerate([(65, 0.0), (69, 0.25), (72, 0.5), (76, 0.75), (64, 1.0), (69, 1.25), (72, 1.5), (76, 1.75),
                              (65, 2.0), (69, 2.25), (72, 2.5), (77, 2.75), (67, 3.0), (71, 3.25), (74, 3.5)]):
    place(dream, ep(midi(n)), tt, 0.9)
place(dream, pad_chord([53, 57, 60, 64], 2.0, 1400, 0.6), 0.0, 0.8)
place(dream, pad_chord([52, 57, 60, 64], 2.0, 1400, 0.3), 2.0, 0.8)
vinyl = highpass(rng.standard_normal(int(4 * SR)), 3000) * 0.02
vinyl += (rng.random(int(4 * SR)) > 0.9993) * rng.standard_normal(int(4 * SR)) * 0.4
place(dream, vinyl, 0.0)
# Arrêt de bande entre 3,55 et 4,0 s : la vitesse de lecture tombe à zéro
a, b = int(3.55 * SR), int(4.0 * SR)
seg = dream[a:].copy()
rate = np.linspace(1, 0, b - a) ** 1.4
pos = np.cumsum(rate)
stopped = np.interp(pos, np.arange(len(seg)), seg)
dream[a:b] = stopped * np.linspace(1, 0.3, b - a)
dream[b:] = 0
L_ += dream
R_ += np.roll(dream, int(0.009 * SR)) * 0.95

# ---------- 4–5 s : « Vraiment ? » ----------
t = np.arange(int(1.8 * SR)) / SR
boom = np.sin(2 * np.pi * np.cumsum(28 + 70 * np.exp(-t * 4)) / SR) * np.exp(-t * 1.8)
add(boom, 4.0, 0.9)

# ---------- 5–16 s : scan en ré mineur ----------
DM = [38, 38, 41, 36]  # ré, ré, fa, do (basses)
for e in range(int(5.0 / 0.25), int(16.0 / 0.25)):
    te = e * 0.25
    bar = int(te // 2)
    f = midi(DM[bar % 4] + 12)
    tt = np.arange(int(0.2 * SR)) / SR
    s = np.tanh(saw(f, tt) * 1.8) * np.exp(-tt * 14)
    add(lowpass(s, 600 + 900 * min(max((te - 5) / 7, 0), 1)), te, 0.42 if te < 12.5 else 0.3)
for s16 in range(int(5.0 / 0.125), int(16.0 / 0.125)):
    ts = s16 * 0.125
    add(tick(7000 if s16 % 2 else 5000), ts, 0.35 if s16 % 4 == 0 else 0.18, pan=0.3 if s16 % 2 else -0.3)
# Grosse caisse en demi-temps pendant le scan, battement de cœur pendant le bilan
K = kick()
for bt in np.arange(5.0, 12.5, 1.0):
    add(K, bt, 0.7)
HB = kick(0.35, 70, 9)
for bt in np.arange(12.5, 16.0, 1.0):
    add(HB, bt, 0.8)
    add(HB, bt + 0.22, 0.5)
# Nappe sombre ré mineur
for bar in range(2, 8):
    ch = [[50, 53, 57], [50, 53, 57], [53, 57, 60], [48, 52, 55]][bar % 4]
    add(pad_chord(ch, 2.05, 900), bar * 2.0 + (1.0 if bar == 2 else 0.0), 0.55)
# Bourdon du scanner qui monte avec le rayon (5,5 → 12,5 s)
a, b = int(5.4 * SR), int(12.6 * SR)
tt = np.arange(b - a) / SR
fr = 140 + 520 * (tt / tt[-1]) ** 1.6
hum = np.sin(2 * np.pi * np.cumsum(fr) / SR) * 0.5 + np.sin(2 * np.pi * np.cumsum(fr * 1.5) / SR) * 0.25
hum *= 0.6 + 0.4 * np.sin(2 * np.pi * 8 * tt)  # trémolo en doubles croches
hum *= np.minimum(tt / 0.3, 1) * np.minimum((tt[-1] - tt) / 0.2, 1)
add(lowpass(hum, 2500) * 0.16, 5.4)
# Montée vers le coup de fouet
a, b = int(14.0 * SR), int(16.0 * SR)
n = rng.standard_normal(b - a)
ramp = np.linspace(0, 1, b - a)
out = np.concatenate([lowpass(c, 300 + 8000 * (k / 30) ** 2) for k, c in enumerate(np.array_split(n, 30))])
add(out * ramp**2 * 0.3, 14.0)
# Scan express (16,9 → 17,9 s) : balayage montant
tt = np.arange(int(1.0 * SR)) / SR
sweep = np.sin(2 * np.pi * np.cumsum(300 + 2200 * tt**1.5) / SR) * np.sin(np.pi * tt) * 0.12
add(sweep, 16.9)
S = snare()
for k, ts in enumerate(np.arange(16.5, 17.92, 0.125)):
    add(S, ts, 0.15 + 0.4 * k / 12)

# ---------- 18–30 s : drop lumineux en fa majeur ----------
CH = [[53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53]]  # F C Dm Bb
RT = [41, 36, 38, 34]
for bar in range(9, 15):
    ch = CH[(bar - 9) % 4]
    add(pad_chord(ch + [ch[0] + 12], 2.05, 2600 if bar < 13 else 1500, 0.15), bar * 2.0, 0.6)
C = clap()
for bt in np.arange(18.0, 28.0, 0.5):
    add(K, bt, 0.85)
    if int(round(bt / 0.5)) % 2 == 1:
        add(C, bt, 0.6)
for s16 in range(int(18.0 / 0.125), int(28.0 / 0.125)):
    ts = s16 * 0.125
    add(tick(8000), ts, 0.3 if s16 % 2 else 0.15, pan=0.25)
    bar = int(ts // 2)
    ch = CH[(bar - 9) % 4]
    seq = [ch[0] + 24, ch[2] + 12, ch[1] + 24, ch[2] + 24]
    if ts < 26.0:
        add(pluck(midi(seq[s16 % 4])), ts, 0.28, pan=-0.35 if s16 % 2 else 0.35)
for e in range(int(18.0 / 0.25), int(28.0 / 0.25)):
    te = e * 0.25
    bar = int(te // 2)
    f = midi(RT[(bar - 9) % 4] + 12)
    tt = np.arange(int(0.22 * SR)) / SR
    s = np.tanh(saw(f, tt) * 2 + np.sin(2 * np.pi * f / 2 * tt)) * np.exp(-tt * 9)
    add(lowpass(s, 1100), te, 0.4 if e % 2 else 0.25)
t = np.arange(int(1.6 * SR)) / SR
sub = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 3)) / SR) * np.exp(-t * 1.6)
add(sub, 18.0, 0.9)
add(sub, 26.0, 0.6)
add(K, 28.0, 1.0)
# Notes finales au piano électrique
for k, n in enumerate([65, 69, 72, 77]):
    add(ep(midi(n), 2.0), 28.0 + k * 0.12, 0.7)

# Silence d'une croche avant le drop, fondu final
gate = np.ones(N)
gate[int(17.93 * SR) : int(18.0 * SR)] = 0
fade = np.clip((30.0 - T) / 1.5, 0, 1)
stereo = np.stack([L_ * gate * fade, R_ * gate * fade], 1)
stereo /= np.max(np.abs(stereo)) * 1.12


def write_wav(path, data):
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(data, -1, 1) * 32767).astype("<i2").tobytes())


SFX_TRIM = -10
SFX = [
    # (temps, fichier, gain dB, début dans le fichier)
    (1.5, "pop.mp3", -2, 0.0),  # étiquette de prix
    (1.55, "sparkle.mp3", -6, 0.0),
    (4.0, "glitch-1.mp3", 0, 0.0),  # « Vraiment ? »
    (4.0, "impact-bass-1.mp3", -2, 0.0),
    (5.4, "notification.mp3", -8, 0.0),  # le scanner s'allume
    (5.95, "error.mp3", -4, 0.0),  # toiture
    (7.92, "error.mp3", -4, 0.0),  # façade
    (10.18, "error.mp3", -4, 0.0),  # impayés
    (12.12, "error.mp3", -4, 0.0),  # litige
    (5.95, "ping.mp3", -6, 0.0),
    (7.92, "ping.mp3", -6, 0.0),
    (10.18, "ping.mp3", -6, 0.0),
    (12.12, "ping.mp3", -6, 0.0),
    (13.4, "impact-bass-2.mp3", -6, 0.0),  # bilan
    (16.0, "whoosh.mp3", 0, 0.0),  # coup de fouet
    (17.0, "click-soft.mp3", -2, 0.0),
    (17.22, "click-soft.mp3", -2, 0.0),
    (17.44, "click-soft.mp3", -2, 0.0),
    (17.66, "click-soft.mp3", -2, 0.0),
    (18.0, "impact-bass-1.mp3", 0, 0.0),  # DROP
    (19.6, "chime.mp3", -4, 0.0),  # copropriété excellente
    (21.75, "whoosh.mp3", -2, 0.0),
    (22.0, "pop.mp3", -4, 0.0),
    (22.75, "pop.mp3", -4, 0.0),
    (23.5, "pop.mp3", -4, 0.0),
    (24.25, "pop.mp3", -4, 0.0),
    (25.7, "whoosh-short.mp3", -4, 0.0),
    (26.0, "whoosh-cinematic.mp3", -8, 0.0),  # le rayon révèle la signature
    (27.0, "pop.mp3", -2, 0.0),
    (27.3, "typing.mp3", -4, 0.0),
]

if __name__ == "__main__":
    sfx_dir, out = sys.argv[1], sys.argv[2]
    tmp = out + ".music.wav"
    write_wav(tmp, stereo)
    args = ["ffmpeg", "-nostdin", "-y", "-loglevel", "error", "-i", tmp]
    filters = ["[0:a]volume=0dB[m]"]
    labels = ["[m]"]
    for k, (t0, f, db, ss) in enumerate(SFX, start=1):
        args += ["-ss", str(ss), "-i", os.path.join(sfx_dir, f)]
        ms = int(t0 * 1000)
        filters.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={db + SFX_TRIM}dB,adelay={ms}|{ms}[s{k}]")
        labels.append(f"[s{k}]")
    mix = "".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=first,atrim=0:{DUR}"
    # Passe 1 : mesure ; passe 2 : normalisation linéaire à -14 LUFS (cible TikTok)
    probe = subprocess.run(
        [a if a != "error" else "info" for a in args]
        + ["-filter_complex", ";".join(filters + [mix + ",loudnorm=I=-14:TP=-1.5:LRA=20:print_format=json[out]"]), "-map", "[out]", "-f", "null", "-"],
        check=True, capture_output=True, text=True,
    ).stderr
    m = json.loads(probe[probe.rindex("{") : probe.rindex("}") + 1])
    ln = (
        f"loudnorm=I=-14:TP=-1.5:LRA=20:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
        f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}"
    )
    filters.append(mix + "," + ln + ",aresample=48000[out]")
    args += ["-filter_complex", ";".join(filters), "-map", "[out]", "-ar", "48000", "-ac", "2", out]
    subprocess.run(args, check=True)
    os.remove(tmp)
    print("ok", out)
