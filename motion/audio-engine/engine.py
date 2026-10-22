"""Moteur audio des vidéos AnalyseTaCopro (numpy uniquement).

Instruments façon TR-808 / phonk, effets de transition, bus stéréo avec envois de
réverbération, sidechain, saturation, limiteur, puis normalisation de sonie en deux
passes avec ffmpeg et mixage des bruitages HyperFrames.
"""
import json
import os
import subprocess
import wave

import numpy as np

SR = 48000
_rng = np.random.default_rng(2026)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def secs(L):
    return np.arange(int(L * SR)) / SR


# ---------- Filtres (domaine fréquentiel) ----------
def _shape(x, gain_fn):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X * gain_fn(np.maximum(f, 1e-3)), len(x))


def lowpass(x, fc, order=2):
    return _shape(x, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order)))


def highpass(x, fc, order=2):
    return _shape(x, lambda f: 1 / np.sqrt(1 + (fc / f) ** (2 * order)))


def bandpass(x, lo, hi, order=2):
    return highpass(lowpass(x, hi, order), lo, order)


def peak(x, fc, q, gain):
    """Bosse en cloche (gain linéaire autour de fc)."""
    return _shape(x, lambda f: 1 + (gain - 1) * np.exp(-((np.log2(f / fc)) ** 2) * q))


def sweep_filter(x, f0, f1, chunks=48, kind="low"):
    """Filtre dont la fréquence glisse de f0 à f1 (par blocs)."""
    out = []
    for k, c in enumerate(np.array_split(x, chunks)):
        fc = f0 * (f1 / f0) ** (k / max(chunks - 1, 1))
        out.append(lowpass(c, fc) if kind == "low" else highpass(c, fc))
    return np.concatenate(out)


def noise(L):
    return _rng.standard_normal(int(L * SR))


def sq(f, t):
    return np.sign(np.sin(2 * np.pi * f * t))


def saw(f, t):
    return 2 * ((f * t) % 1.0) - 1


def phase_sine(freqs):
    return np.sin(2 * np.pi * np.cumsum(freqs) / SR)


# ---------- Batterie ----------
def kick(L=0.5, top=190, low=46, punch=34, drive=2.2):
    t = secs(L)
    f = low + (top - low) * np.exp(-t * punch)
    body = phase_sine(f) * np.exp(-t * 6.5)
    click = highpass(noise(L), 2500) * np.exp(-t * 300) * 0.35
    return np.tanh((body + click) * drive) * 0.95


def snare(L=0.32, tone=196, crack=0.9):
    t = secs(L)
    n = bandpass(noise(L), 1200, 9000) * np.exp(-t * 17) * crack
    body = (np.sin(2 * np.pi * tone * t) + 0.5 * np.sin(2 * np.pi * tone * 1.62 * t)) * np.exp(-t * 26)
    return np.tanh((n + body * 0.8) * 1.6) * 0.7


def clap(L=0.4):
    t = secs(L)
    env = np.zeros_like(t)
    for d in (0.0, 0.009, 0.018, 0.028):
        env += (t >= d) * np.exp(-np.maximum(t - d, 0) * (90 if d < 0.025 else 13))
    return bandpass(noise(L), 900, 5500) * env * 0.75


METAL = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]


def hat(L=0.07, open_=False, tone=1.0):
    t = secs(L if not open_ else 0.45)
    m = sum(sq(f * 4.0 * tone, t) for f in METAL) / 6
    s = highpass(m + noise(len(t) / SR) * 0.35, 7500, 3)
    return s * np.exp(-t * (13 if open_ else 75)) * 0.55


def cowbell(note, L=0.32):
    """Cloche 808 accordée : deux carrés en rapport 1,48, filtrés."""
    t = secs(L)
    f = midi(note)
    s = sq(f, t) * 0.6 + sq(f * 1.48, t) * 0.4
    env = np.exp(-t * 9) * 0.7 + np.exp(-t * 40) * 0.3
    return bandpass(s * env, f * 0.9, 5200) * 0.55


def bass808(note, L, glide_from=None, drive=2.4, glide=0.06):
    t = secs(L)
    f1 = midi(note)
    f = np.full_like(t, f1)
    if glide_from is not None:
        f0 = midi(glide_from)
        f = f1 + (f0 - f1) * np.exp(-t / glide)
    s = phase_sine(f)
    env = np.minimum(t / 0.004, 1) * np.exp(-np.maximum(t - L * 0.7, 0) * 18) * (0.85 + 0.15 * np.exp(-t * 4))
    return np.tanh(s * env * drive) * 0.8


def pluck(note, L=0.45, bright=3500):
    t = secs(L)
    f = midi(note)
    s = (saw(f, t) * 0.6 + saw(f * 1.004, t) * 0.4) * np.exp(-t * 7)
    return lowpass(s, bright) * 0.4


def ep(note, L=1.6):
    """Piano électrique (FM douce)."""
    t = secs(L)
    f = midi(note)
    mod = np.sin(2 * np.pi * f * 2 * t) * 1.3 * np.exp(-t * 6)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 2.2) * 0.38


def pad(notes, L, cutoff=1800, attack=0.3):
    t = secs(L)
    s = sum(saw(midi(n + d), t) for n in notes for d in (-0.08, 0.0, 0.07))
    env = np.minimum(t / attack, 1) * np.exp(-np.maximum(t - (L - 0.12), 0) * 25)
    return lowpass(s * env, cutoff) / (3 * len(notes))


def vox(vowel="a", note=57, L=0.32):
    """Cri de voix synthétique (formants) pour lancer un drop."""
    F = {"a": (800, 1150, 2900), "e": (400, 1900, 2600), "o": (450, 800, 2830), "i": (300, 2300, 3000)}[vowel]
    t = secs(L)
    f = midi(note) * (1 + 0.04 * np.exp(-t * 20))
    src = saw(1, np.cumsum(f) / SR) + noise(L) * 0.05
    s = sum(peak(src, fc, 6, g) - src for fc, g in zip(F, (14, 9, 5)))
    env = np.minimum(t / 0.01, 1) * np.exp(-np.maximum(t - L * 0.5, 0) * 14)
    return np.tanh(s * env * 0.25) * 0.8


# ---------- Effets de transition ----------
def riser(L, f0=200, f1=9000, pitch=(180, 1400)):
    t = secs(L)
    n = sweep_filter(noise(L), f0, f1)
    tone = phase_sine(pitch[0] + (pitch[1] - pitch[0]) * (t / L) ** 2) * 0.18
    return (n * 0.45 + tone) * (t / L) ** 1.6


def reverse_cymbal(L=1.0):
    t = secs(L)
    s = highpass(noise(L), 5000) * np.exp(-t * 4.5)
    return s[::-1] * 0.45


def impact(L=2.2):
    t = secs(L)
    sub = phase_sine(30 + 70 * np.exp(-t * 3.5)) * np.exp(-t * 1.7)
    burst = lowpass(noise(L), 2500) * np.exp(-t * 9) * 0.5
    return np.tanh((sub + burst) * 1.4) * 0.9


def whoosh(L=0.6, up=True):
    t = secs(L)
    env = np.sin(np.pi * np.clip(t / L, 0, 1)) ** 2
    n = sweep_filter(noise(L), 400 if up else 6000, 6000 if up else 400, 24)
    return n * env * 0.5


def tape_stop(x, a, b):
    """Ralentit x entre les échantillons a et b jusqu'à l'arrêt (en place)."""
    seg = x[a:].copy()
    rate = np.linspace(1, 0, b - a) ** 1.3
    x[a:b] = np.interp(np.cumsum(rate), np.arange(len(seg)), seg)
    x[b:] = 0


# ---------- Bus et mastering ----------
class Bus:
    def __init__(self, dur):
        self.N = int(dur * SR)
        self.L = np.zeros(self.N)
        self.R = np.zeros(self.N)
        self.sendL = np.zeros(self.N)
        self.sendR = np.zeros(self.N)
        self.duck = np.zeros(self.N)  # piste « à pomper » (sidechain)
        self.duckR = np.zeros(self.N)

    def _place(self, buf, sig, t0, g):
        i = int(round(t0 * SR))
        if i < 0 or i >= self.N:
            return
        n = min(len(sig), self.N - i)
        buf[i : i + n] += sig[:n] * g

    def add(self, sig, t0, gain=1.0, pan=0.0, rev=0.0, duck=False):
        gl, gr = gain * min(1, 1 - pan), gain * min(1, 1 + pan)
        if duck:
            self._place(self.duck, sig, t0, gl)
            self._place(self.duckR, sig, t0, gr)
        else:
            self._place(self.L, sig, t0, gl)
            self._place(self.R, sig, t0, gr)
        if rev:
            self._place(self.sendL, sig, t0, gl * rev)
            self._place(self.sendR, sig, t0, gr * rev)

    def render(self, kick_times, duck_depth=0.7, rev_len=1.6, mutes=(), fade_out=1.2):
        # Sidechain
        env = np.ones(self.N)
        L = int(0.32 * SR)
        shape = 1 - duck_depth * np.exp(-np.arange(L) / SR * 11)
        for kt in kick_times:
            i = int(kt * SR)
            n = min(L, self.N - i)
            if n > 0:
                env[i : i + n] = np.minimum(env[i : i + n], shape[:n])
        # Réverbération (réponse impulsionnelle synthétique, stéréo décorrélée)
        t = secs(rev_len)
        irs = []
        for k in range(2):
            ir = _rng.standard_normal(len(t)) * np.exp(-t * 4.2)
            ir = lowpass(ir, 6000)
            ir[: int(0.012 * SR)] = 0
            irs.append(ir / np.sqrt(np.sum(ir**2)))
        n = 1 << int(np.ceil(np.log2(self.N + len(t))))
        wetL = np.fft.irfft(np.fft.rfft(self.sendL, n) * np.fft.rfft(irs[0], n), n)[: self.N]
        wetR = np.fft.irfft(np.fft.rfft(self.sendR, n) * np.fft.rfft(irs[1], n), n)[: self.N]
        L_ = self.L + self.duck * env + wetL * 0.5 * env
        R_ = self.R + self.duckR * env + wetR * 0.5 * env
        gate = np.ones(self.N)
        for a, b in mutes:
            gate[int(a * SR) : int(b * SR)] = 0
        T = np.arange(self.N) / SR
        fade = np.clip((self.N / SR - T) / fade_out, 0, 1) if fade_out else 1
        st = np.stack([L_ * gate * fade, R_ * gate * fade], 1)
        return master(st)


def master(st, drive=1.5, ceiling=0.94):
    st = st / (np.max(np.abs(st)) + 1e-9)
    # Glue : saturation douce parallèle
    st = 0.6 * st + 0.4 * np.tanh(st * drive) / np.tanh(drive)
    # Limiteur à anticipation (fenêtre 4 ms, relâchement 80 ms)
    a = np.max(np.abs(st), 1)
    w = int(0.004 * SR)
    pad_ = np.concatenate([a, np.zeros(w)])
    blocks = np.lib.stride_tricks.sliding_window_view(pad_, w).max(1)[: len(a)]
    gain = np.minimum(1, ceiling / np.maximum(blocks, 1e-9))
    rel = np.exp(-1 / (0.08 * SR))
    g = gain.copy()
    # lissage : descente immédiate, remontée exponentielle (vectorisé par blocs)
    for start in range(0, len(g), 4096):
        seg = g[start : start + 4096]
        prev = g[start - 1] if start else 1.0
        out = np.empty_like(seg)
        for i in range(len(seg)):
            prev = seg[i] if seg[i] < prev else prev * rel + seg[i] * (1 - rel)
            out[i] = prev
        g[start : start + 4096] = out
    return st * g[:, None]


def write_wav(path, data):
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(data, -1, 1) * 32767).astype("<i2").tobytes())


def mixdown(music, sfx, sfx_dir, out, dur, lufs=-11.0, sfx_trim=-9):
    """Ajoute les bruitages (temps, fichier, dB, début) puis normalise en deux passes."""
    tmp = out + ".music.wav"
    write_wav(tmp, music)
    args = ["ffmpeg", "-nostdin", "-y", "-loglevel", "error", "-i", tmp]
    filters = ["[0:a]volume=0dB[m]"]
    labels = ["[m]"]
    for k, (t0, f, db, ss) in enumerate(sfx, start=1):
        args += ["-ss", str(ss), "-i", os.path.join(sfx_dir, f)]
        ms = int(t0 * 1000)
        filters.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={db + sfx_trim}dB,adelay={ms}|{ms}[s{k}]")
        labels.append(f"[s{k}]")
    mix = "".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=first,atrim=0:{dur}"
    probe = subprocess.run(
        [a if a != "error" else "info" for a in args]
        + ["-filter_complex", ";".join(filters + [mix + f",loudnorm=I={lufs}:TP=-1:LRA=20:print_format=json[out]"]), "-map", "[out]", "-f", "null", "-"],
        check=True, capture_output=True, text=True,
    ).stderr
    m = json.loads(probe[probe.rindex("{") : probe.rindex("}") + 1])
    ln = (
        f"loudnorm=I={lufs}:TP=-1:LRA=20:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
        f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}"
    )
    filters.append(mix + "," + ln + ",alimiter=limit=0.89:attack=1:release=60:level=disabled,aresample=48000[out]")
    args += ["-filter_complex", ";".join(filters), "-map", "[out]", "-ar", "48000", "-ac", "2", out]
    subprocess.run(args, check=True)
    os.remove(tmp)


def supersaw(notes, L, cutoff=4000, attack=0.02):
    """Accord « supersaw » (7 scies désaccordées par note)."""
    t = secs(L)
    s = sum(saw(midi(n) * (1 + d * 0.0045), t + k * 0.001) for n in notes for k, d in enumerate((-3, -2, -1, 0, 1, 2, 3)))
    env = np.minimum(t / attack, 1) * np.exp(-np.maximum(t - (L - 0.08), 0) * 30)
    return lowpass(s * env, cutoff) / (7 * len(notes)) * 1.6


def groove(bus, t0, nbars, BAR, riff, roots, kicks, kick_steps=(0, 3, 6, 10), clap_steps=(4, 12), snare_steps=(),
           cow_gain=0.6, intensity=1.0, triplet_rolls=False, vox_every=0, bass_drive=2.6, cowbell_on=True):
    """Pose nbars mesures de groove phonk à partir de t0 (riff en 16 pas, None = silence)."""
    STEP = BAR / 16
    K = kick(top=190 + 40 * intensity, drive=2.2 + intensity)
    C = clap()
    S = snare()
    H = hat()
    HO = hat(open_=True)
    for b in range(nbars):
        tb = t0 + b * BAR
        if cowbell_on:
            for s, n in enumerate(riff[b % len(riff)]):
                if n is not None:
                    bus.add(cowbell(n), tb + s * STEP, cow_gain, pan=0.18 if s % 4 == 2 else -0.08, rev=0.18, duck=True)
        for s in kick_steps:
            bus.add(K, tb + s * STEP, 0.95)
            kicks.append(tb + s * STEP)
        for s in clap_steps:
            bus.add(C, tb + s * STEP, 0.7, rev=0.25)
        for s in snare_steps:
            bus.add(S, tb + s * STEP, 0.6, rev=0.2)
        for s in range(16):
            if s % 4 == 2:
                bus.add(HO, tb + s * STEP, 0.28, pan=0.3)
            else:
                bus.add(H, tb + s * STEP, 0.4 if s % 2 else 0.22, pan=-0.25 if s % 2 else 0.25)
        if triplet_rolls and b % 2 == 1:
            for k in range(6):
                bus.add(hat(0.04, tone=1.1), tb + 12 * STEP + k * STEP * 2 / 3, 0.22 + 0.04 * k, pan=0.2)
        root = roots[b % len(roots)]
        ks = list(kick_steps)
        for k, s in enumerate(ks):
            nxt = ks[k + 1] if k + 1 < len(ks) else 16
            glide = root + 12 if (k == len(ks) - 1 and b % 2 == 1) else None
            bus.add(bass808(root, (nxt - s) * STEP * 0.95, glide_from=glide, drive=bass_drive), tb + s * STEP, 0.7)
        if vox_every and b % vox_every == 0:
            bus.add(vox("a", 57), tb, 0.45, rev=0.3)
