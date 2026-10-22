"""Bande-son originale de la vidéo 4K AnalyseTaCopro.

Musique électro synthétisée (120 BPM, fa mineur, 30 s) puis mixée avec les
bruitages HyperFrames (Pixabay Content License) calés sur la timeline de
index.html. Usage :  python3 tools/soundtrack.py <dossier_sfx> <sortie.wav>
"""
import os
import subprocess
import sys
import wave

import numpy as np

SR = 48000
DUR = 30.0
BPM = 120
BEAT = 60 / BPM  # 0,5 s
N = int(SR * DUR)
t_all = np.arange(N) / SR
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, fc, order=2):
    """Passe-bas statique dans le domaine fréquentiel."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(X, len(x))


def highpass(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    with np.errstate(divide="ignore"):
        X *= 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X, len(x))


def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf):
        return
    n = min(len(sig), len(buf) - i)
    buf[i : i + n] += sig[:n] * gain


def saw(f, t):
    return 2 * ((f * t) % 1.0) - 1


# ---------- Instruments ----------
def kick():
    t = np.arange(int(0.45 * SR)) / SR
    f = 45 + 120 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7)
    click = rng.standard_normal(len(t)) * np.exp(-t * 400) * 0.25
    return np.tanh((body + click) * 1.6)


def clap():
    t = np.arange(int(0.3 * SR)) / SR
    env = np.zeros_like(t)
    for d in (0.0, 0.011, 0.022):
        env += (t >= d) * np.exp(-np.maximum(t - d, 0) * (60 if d < 0.02 else 18))
    n = highpass(lowpass(rng.standard_normal(len(t)), 3500), 900)
    return n * env * 0.9


def hat(open_=False):
    L = 0.25 if open_ else 0.06
    t = np.arange(int(L * SR)) / SR
    n = highpass(rng.standard_normal(len(t)), 7000)
    return n * np.exp(-t * (14 if open_ else 70)) * 0.5


def snare():
    t = np.arange(int(0.18 * SR)) / SR
    n = highpass(rng.standard_normal(len(t)), 1500) * np.exp(-t * 28)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 35) * 0.5
    return (n + tone) * 0.6


def pluck(f, L=0.35):
    t = np.arange(int(L * SR)) / SR
    s = (np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + saw(f * 1.003, t) * 0.5) * np.exp(-t * 9)
    return lowpass(s, 2600) * 0.5


# ---------- Harmonie : Fm – Db – Ab – Eb (1 accord par mesure) ----------
CHORDS = [
    [53, 56, 60],  # Fm
    [49, 53, 56],  # Db
    [56, 60, 63],  # Ab
    [51, 55, 58],  # Eb
]
ROOTS = [29, 25, 32, 27]

music = np.zeros(N)
drums = np.zeros(N)
bass = np.zeros(N)
pad = np.zeros(N)
lead = np.zeros(N)

# Pad (scies désaccordées, attaque lente) sur toute la durée
for bar in range(15):
    t0 = bar * 2.0
    ch = CHORDS[bar % 4]
    L = int(2.2 * SR)
    t = np.arange(L) / SR
    env = np.minimum(t / 0.35, 1) * np.exp(-np.maximum(t - 1.9, 0) * 8)
    s = np.zeros(L)
    for n in ch + [ch[0] + 12]:
        for d in (-0.08, 0.0, 0.07):
            s += saw(midi(n + d), t)
    place(pad, s * env / 12, t0)
pad_dark = lowpass(pad, 700)
pad_open = lowpass(pad, 2400)
mix_open = np.clip((t_all - 17.0) / 1.0, 0, 1) * (t_all < 28.5)
pad = pad_dark * (1 - mix_open) + pad_open * mix_open

# Enveloppe de « pompe » (sidechain) synchronisée sur la grosse caisse
kick_times = [b * BEAT for b in range(int(DUR / BEAT)) if (2.0 <= b * BEAT < 16.0) or (18.0 <= b * BEAT < 28.0)]
pump = np.ones(N)
for kt in kick_times:
    i = int(kt * SR)
    L = int(0.42 * SR)
    seg = 1 - 0.75 * np.exp(-np.arange(L) / SR * 10)
    pump[i : i + L] = np.minimum(pump[i : i + L], seg[: max(0, min(L, N - i))])

# Batterie
K = kick()
for kt in kick_times:
    place(drums, K, kt, 1.0)
place(drums, K, 28.0, 1.1)  # coup final
C = clap()
for b in range(int(DUR / BEAT)):
    tb = b * BEAT
    if b % 2 == 1 and ((6.0 <= tb < 16.0) or (18.0 <= tb < 28.0)):
        place(drums, C, tb, 0.8)
H, HO = hat(), hat(True)
for s16 in range(int(DUR / (BEAT / 4))):
    ts = s16 * BEAT / 4
    if (4.0 <= ts < 16.0) or (18.0 <= ts < 28.0):
        if s16 % 4 == 2:
            place(drums, HO, ts, 0.45)
        elif ts >= 8.0 and s16 % 2 == 1:
            place(drums, H, ts, 0.35)
        elif s16 % 2 == 0:
            place(drums, H, ts, 0.5)
# Roulement de caisse claire qui accélère pendant le break (16–18 s)
S = snare()
t = 16.0
step = BEAT / 2
while t < 17.92:
    place(drums, S, t, 0.25 + 0.6 * (t - 16.0) / 2.0)
    t += step
    if t >= 17.0:
        step = BEAT / 4
    if t >= 17.5:
        step = BEAT / 8

# Basse : croches décalées, saturée et filtrée
for e in range(int(DUR / (BEAT / 2))):
    te = e * BEAT / 2
    if not ((4.0 <= te < 16.0) or (18.0 <= te < 28.0)):
        continue
    bar = int(te // 2.0)
    f = midi(ROOTS[bar % 4] + 12)
    L = int(0.24 * SR)
    tt = np.arange(L) / SR
    s = np.tanh(saw(f, tt) * 2.2 + np.sin(2 * np.pi * f / 2 * tt) * 1.2) * np.exp(-tt * 6)
    place(bass, s, te, 0.55 if te < 18 else 0.7)
bass = lowpass(bass, 900)

# Lead en arpège (doubles croches) pendant le drop
for s16 in range(int(DUR / (BEAT / 4))):
    ts = s16 * BEAT / 4
    if not (18.0 <= ts < 28.0):
        continue
    bar = int(ts // 2.0)
    ch = CHORDS[bar % 4]
    seq = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
    place(lead, pluck(midi(seq[s16 % 4])), ts, 0.32)
# Écho stéréo (ping-pong 3/16) sur le lead
d = int(SR * BEAT * 0.75)
leadL = lead.copy()
leadR = np.zeros(N)
for k in range(1, 5):
    g = 0.42**k
    if k % 2:
        leadR[d * k :] += lead[: N - d * k] * g
    else:
        leadL[d * k :] += lead[: N - d * k] * g

# Montée (bruit qui s'ouvre) avant le logo et avant le drop
riser = np.zeros(N)
for a, b in ((0.0, 2.0), (16.0, 18.0)):
    i0, i1 = int(a * SR), int(b * SR)
    n = rng.standard_normal(i1 - i0)
    ramp = np.linspace(0, 1, i1 - i0)
    chunks = 40
    out = np.zeros_like(n)
    for c in range(chunks):
        s0, s1 = c * len(n) // chunks, (c + 1) * len(n) // chunks
        out[s0:s1] = lowpass(n[s0:s1], 300 + 9000 * (c / chunks) ** 2)
    sweep = np.sin(2 * np.pi * np.cumsum(200 + 1400 * ramp**2) / SR) * 0.15
    riser[i0:i1] = (out * 0.35 + sweep) * ramp**1.5
# Sub-drop au moment du drop
tt = np.arange(int(1.6 * SR)) / SR
sub = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-tt * 3)) / SR) * np.exp(-tt * 1.6)
place(riser, sub, 18.0, 0.9)
place(riser, sub, 2.0, 0.7)

# Fondu de sortie et silence d'une croche avant le drop
gate = np.ones(N)
gate[int(17.92 * SR) : int(18.0 * SR)] = 0.0
fade = np.clip((30.0 - t_all) / 1.6, 0, 1)

L = (drums + bass * pump + pad * (0.55 + 0.45 * pump) * 0.9 + leadL + riser) * gate * fade
R = (drums + bass * pump + pad * (0.55 + 0.45 * pump) * 0.9 + leadR + riser) * gate * fade
# Légère largeur stéréo sur le pad
R += np.roll(pad, int(0.012 * SR)) * 0.15 * fade
stereo = np.stack([L, R], 1)
stereo /= np.max(np.abs(stereo)) * 1.12


def write_wav(path, data):
    data = np.clip(data, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((data * 32767).astype("<i2").tobytes())


# ---------- Bruitages calés sur la timeline ----------
SFX_TRIM = -10  # les bruitages restent sous la musique
SFX = [
    # (temps, fichier, gain dB, début dans le fichier)
    (0.05, "whoosh-cinematic.mp3", -6, 0.0),
    (1.62, "impact-bass-2.mp3", -2, 0.0),  # pic sur 2,0 s (le nom claque)
    (2.0, "glitch-3.mp3", -14, 0.0),
    (3.72, "whoosh.mp3", -4, 0.0),
    (4.0, "whoosh-short.mp3", -10, 0.0),
    (5.0, "whoosh-short.mp3", -10, 0.0),
    (6.0, "pop.mp3", -6, 0.0),
    (6.5, "glitch-1.mp3", -8, 0.0),
    (7.72, "whoosh.mp3", -4, 0.0),
    (9.0, "impact-bass-1.mp3", -3, 0.0),
    (10.0, "click-soft.mp3", -6, 0.0),
    (11.72, "whoosh.mp3", -4, 0.0),
    (12.5, "impact-bass-1.mp3", -5, 0.0),
    (13.5, "impact-bass-1.mp3", -5, 0.0),
    (14.5, "impact-bass-1.mp3", -5, 0.0),
    (12.5, "error.mp3", -14, 0.0),
    (15.45, "glitch-2.mp3", -8, 0.0),
    (16.4, "click.mp3", -4, 0.0),
    (16.9, "click.mp3", -4, 0.0),
    (17.0, "impact-bass-1.mp3", -6, 0.0),
    (18.0, "impact-bass-1.mp3", 0, 0.0),
    (18.0, "whoosh-cinematic.mp3", -10, 0.0),
    (19.7, "ping.mp3", -6, 0.0),
    (19.75, "sparkle.mp3", -8, 0.0),
    (21.6, "whoosh-short.mp3", -12, 0.0),
    (23.72, "whoosh.mp3", -4, 0.0),
    (24.0, "impact-bass-2.mp3", -10, 0.45),
    (25.5, "pop.mp3", -4, 0.0),
    (26.0, "typing.mp3", -6, 0.0),
    (27.0, "chime.mp3", -8, 0.0),
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
    # Passe 1 : mesure de la sonie ; passe 2 : normalisation linéaire à -14 LUFS (cible TikTok)
    probe = subprocess.run(
        [a if a != "error" else "info" for a in args] + ["-filter_complex", ";".join(filters + [mix + ",loudnorm=I=-14:TP=-1.5:LRA=20:print_format=json[out]"]), "-map", "[out]", "-f", "null", "-"],
        check=True, capture_output=True, text=True,
    ).stderr
    import json
    m = json.loads(probe[probe.rindex("{") : probe.rindex("}") + 1])
    ln = (
        f"loudnorm=I=-14:TP=-1.5:LRA=20:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
        f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}"
    )
    filters.append(mix + "," + ln + ",aresample=48000[out]")
    args += ["-filter_complex", ";".join(filters), "-map", "[out]", "-ar", "48000", "-ac", "2", out]
    subprocess.run(args, check=True)
    if not os.environ.get("KEEP_MUSIC"):
        os.remove(tmp)
    print("ok", out)
