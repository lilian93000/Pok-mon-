// TikTok « Tu regardes le passé » : style récit (fond sombre texturé, or, rouge, tampons latins)
import React from "react";
import {
  AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, random, Sequence,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

// polices variables en local (public/ciel/), pas de dépendance réseau au rendu
const SANS = "CielMontserrat";
const SERIF = "CielCinzel";
loadFont({ family: SANS, url: staticFile("ciel/montserrat.woff2"), weight: "100 900" });
loadFont({ family: SERIF, url: staticFile("ciel/cinzel.woff2"), weight: "400 900" });

const GOLD = "#E8B95A";
const GOLD_GRAD = "linear-gradient(180deg,#FFF4C8 0%,#F2CF7A 38%,#B27A26 52%,#E9C06A 70%,#FFE7A3 100%)";
const RED = "#8E1A1A";

type Scene = {
  kind: "video" | "plate" | "stamp" | "number";
  start: number; end: number;
  file?: string; x0?: number; x1?: number; z0?: number; z1?: number; fx?: string; flash?: boolean; shake?: boolean;
  img?: string; bg?: "dark" | "red" | "gold"; stamp?: string; stampAt?: number;
  word?: string; strike?: boolean; big?: string; sub?: string; credit?: string;
};
type Word = { w: string; s: number; e: number };
type Line = { i: number; text: string; start: number; end: number; words: Word[] };
export type CielData = { fps: number; duration: number; scenes: Scene[]; lines: Line[]; keys: string[] };

const NOISE = (seed: number, freq = 0.9, op = 0.5) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='540' height='960'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${op} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  )}")`;
const PAPER = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1920'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0.16 0'/></filter><rect width='100%' height='100%' filter='url(#p)'/></svg>`,
)}")`;

const ease = Easing.bezier(0.2, 0.8, 0.2, 1);

// ---------- Fonds ----------
const Rays: React.FC<{ color: string }> = ({ color }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      background: `repeating-conic-gradient(from ${f * 0.15}deg at 50% 40%, ${color} 0deg 2.2deg, transparent 2.2deg 15deg)`,
      maskImage: "radial-gradient(circle at 50% 40%, transparent 6%, #000 22%, #000 70%, transparent 100%)",
      WebkitMaskImage: "radial-gradient(circle at 50% 40%, transparent 6%, #000 22%, #000 70%, transparent 100%)",
    }} />
  );
};

const Bg: React.FC<{ v?: "dark" | "red" | "gold" }> = ({ v = "dark" }) => {
  const base =
    v === "red" ? "radial-gradient(circle at 50% 40%, #B3302A 0%, #7A1616 45%, #2A0606 100%)"
      : v === "gold" ? "radial-gradient(circle at 50% 40%, #B8893A 0%, #6E4A16 38%, #1E1305 100%)"
        : "radial-gradient(circle at 50% 42%, #24201A 0%, #14120F 55%, #070605 100%)";
  return (
    <AbsoluteFill style={{ background: base }}>
      <AbsoluteFill style={{ backgroundImage: PAPER, mixBlendMode: "screen" }} />
      {v !== "dark" && <Rays color={v === "red" ? "rgba(40,0,0,0.38)" : "rgba(90,50,0,0.35)"} />}
      <AbsoluteFill style={{ backgroundImage: NOISE(3, 0.8, 0.07) }} />
    </AbsoluteFill>
  );
};

// ---------- Ornements ----------
const Meander: React.FC<{ width: number; reveal: number }> = ({ width, reveal }) => {
  const u = 26;
  const n = Math.floor(width / u);
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = i * u;
    d += `M${x} 22 V2 H${x + 20} V16 H${x + 8} V9 H${x + 14} `;
  }
  return (
    <svg width={width} height={26} style={{ clipPath: `inset(0 ${(1 - reveal) * 50}% 0 ${(1 - reveal) * 50}%)` }}>
      <line x1={0} y1={24} x2={width} y2={24} stroke={GOLD} strokeWidth={2.5} />
      <path d={d} fill="none" stroke={GOLD} strokeWidth={3} />
    </svg>
  );
};

const GLYPHS = ["☉", "☽", "♄", "♃", "✶", "Σ", "Ω", "Δ", "φ", "∞", "◇", "✧", "♂", "λ"];
const Glyphs: React.FC<{ seed: string; n?: number }> = ({ seed, n = 12 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: n }).map((_, i) => {
        const x = random(`${seed}x${i}`) * 960 + 60;
        const y = random(`${seed}y${i}`) * 1100 + 200;
        const sz = 26 + random(`${seed}s${i}`) * 34;
        const drift = Math.sin((f + i * 17) / 22) * 14;
        const op = interpolate(f, [i * 1.5, i * 1.5 + 8], [0, 0.55 + random(`${seed}o${i}`) * 0.35], { extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + drift, fontSize: sz, color: GOLD, opacity: op, fontFamily: SERIF }}>
            {GLYPHS[Math.floor(random(`${seed}g${i}`) * GLYPHS.length)]}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Corners: React.FC<{ w: number; h: number; p: number }> = ({ w, h, p }) => {
  const L = 70 * p;
  const s = { position: "absolute" as const, width: L, height: L, borderColor: GOLD, borderStyle: "solid", borderWidth: 0 };
  return (
    <>
      <div style={{ ...s, left: -16, top: -16, borderLeftWidth: 5, borderTopWidth: 5 }} />
      <div style={{ ...s, right: -16, top: -16, borderRightWidth: 5, borderTopWidth: 5 }} />
      <div style={{ ...s, left: -16, bottom: -16, borderLeftWidth: 5, borderBottomWidth: 5 }} />
      <div style={{ ...s, right: -16, bottom: -16, borderRightWidth: 5, borderBottomWidth: 5 }} />
      <div style={{ position: "absolute", inset: 0, width: w, height: h, boxShadow: `inset 0 0 0 3px rgba(232,185,90,${0.85 * p})` }} />
    </>
  );
};

// ---------- Scènes ----------
const Punch: React.FC<{ children: React.ReactNode; from?: number }> = ({ children, from = 1.07 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 6], [from, 1], { extrapolateRight: "clamp", easing: ease });
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

const VideoScene: React.FC<{ s: Scene; dur: number }> = ({ s, dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  // clip vertical natif (recadré depuis la 4K, panoramique déjà fait par ffmpeg) : ici seulement le zoom
  const z = (s.z0 ?? 1) + ((s.z1 ?? 1) - (s.z0 ?? 1)) * t;
  const W = 1080 * z, H = 1920 * z;
  const left = (1080 - W) / 2;
  const top = (1920 - H) / 2;
  let filter = "contrast(1.08) saturate(1.12)";
  if (s.fx === "dying") {
    const k = interpolate(f, [8, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    filter = `contrast(${1.08 + k * 0.3}) saturate(${1.1 - k}) brightness(${1 - k * 0.85})`;
  }
  const shake = s.shake && f < 16 ? (1 - f / 16) * 22 : 0;
  const sx = shake ? (random(`sx${f}`) - 0.5) * shake : 0;
  const sy = shake ? (random(`sy${f}`) - 0.5) * shake : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Punch>
        <div style={{ position: "absolute", left: left + sx, top: top + sy, width: W, height: H, filter }}>
          <OffthreadVideo src={staticFile(s.file!)} muted style={{ width: "100%", height: "100%" }} />
        </div>
      </Punch>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      {s.flash && (
        <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [0, 2, 12], [0, 1, 0], { extrapolateRight: "clamp" }) }} />
      )}
    </AbsoluteFill>
  );
};

const Stamp: React.FC<{ word: string; delay?: number; color?: string; size?: number; strike?: boolean }> = ({ word, delay = 0, color = "#F1D9A0", size = 120, strike }) => {
  const f = useCurrentFrame() - delay;
  if (f < 0) return null;
  const s = interpolate(f, [0, 5], [2.4, 1], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const op = interpolate(f, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  const strikeP = interpolate(f, [10, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center",
      transform: `rotate(-9deg) scale(${s})`, opacity: op,
    }}>
      <div style={{
        position: "relative", padding: "18px 40px", border: `9px double ${color}`, borderRadius: 14, color,
        fontFamily: SERIF, fontWeight: 900, fontSize: size, letterSpacing: 6, lineHeight: 1,
        maskImage: NOISE(11, 0.06, 2.6), WebkitMaskImage: NOISE(11, 0.06, 2.6), maskSize: "cover", WebkitMaskSize: "cover",
        textShadow: "0 0 1px rgba(0,0,0,.3)", whiteSpace: "nowrap",
      }}>
        {word}
        {strike && (
          <div style={{ position: "absolute", left: "4%", top: "48%", height: 16, width: `${92 * strikeP}%`, background: "#E0261F", boxShadow: "0 0 10px rgba(0,0,0,.4)" }} />
        )}
      </div>
    </div>
  );
};

const PlateImg: React.FC<{ img: string; dur: number; muted?: boolean }> = ({ img, dur, muted }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const z = interpolate(f, [0, dur], [1, 1.07]);
  const W = 860, H = 1040;
  return (
    <div style={{ position: "absolute", left: (1080 - W) / 2, top: 260, width: W, height: H, transform: `scale(${0.9 + 0.1 * p})`, opacity: p }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.7)" }}>
        <Img src={staticFile("ciel/" + img)} style={{
          width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`,
          filter: muted ? "grayscale(1) sepia(.5) brightness(.45) contrast(1.2)" : "sepia(.25) contrast(1.08) saturate(.9)",
        }} />
        <AbsoluteFill style={{ background: "radial-gradient(circle, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
      </div>
      <Corners w={W} h={H} p={p} />
    </div>
  );
};

const PlateScene: React.FC<{ s: Scene; dur: number; fps: number }> = ({ s, dur, fps }) => (
  <AbsoluteFill>
    <Bg v={s.bg} />
    <PlateImg img={s.img!} dur={dur} />
    {s.stamp && <Stamp word={s.stamp} delay={Math.round((s.stampAt ?? 0) * fps)} color="#D8322B" size={84} />}
  </AbsoluteFill>
);

const StampScene: React.FC<{ s: Scene; dur: number }> = ({ s, dur }) => (
  <AbsoluteFill>
    <Bg v={s.bg} />
    {s.img && <PlateImg img={s.img} dur={dur} muted />}
    <Stamp word={s.word!} strike={s.strike} size={s.word!.length > 11 ? 96 : 118} />
  </AbsoluteFill>
);

const NumberScene: React.FC<{ s: Scene; dur: number }> = ({ s }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 7], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const sc = interpolate(f, [0, 7], [1.35, 1], { extrapolateRight: "clamp", easing: ease });
  const len = s.big!.length;
  const size = len >= 8 ? 170 : len >= 4 ? 260 : 400;
  const subP = interpolate(f, [5, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill>
      <Bg v={s.bg} />
      <Glyphs seed={s.big!} />
      <AbsoluteFill style={{ alignItems: "center", top: 470 }}>
        <Meander width={760} reveal={p} />
        <div style={{
          fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.05, marginTop: 18,
          background: GOLD_GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          transform: `scale(${sc})`, opacity: p, filter: "drop-shadow(0 0 2px rgba(0,0,0,.9)) drop-shadow(0 10px 22px rgba(0,0,0,.85))", whiteSpace: "nowrap",
        }}>{s.big}</div>
        <div style={{
          fontFamily: SERIF, fontWeight: 700, fontSize: (s.sub?.length ?? 0) > 12 ? 52 : 72, color: GOLD, letterSpacing: 8,
          opacity: subP, transform: `translateY(${(1 - subP) * 20}px)`, filter: "drop-shadow(0 0 2px rgba(0,0,0,.95)) drop-shadow(0 4px 12px rgba(0,0,0,.85))", marginBottom: 18,
        }}>{s.sub}</div>
        <Meander width={760} reveal={p} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Sous-titres ----------
type Chunk = { words: { w: string; s: number; key: boolean }[]; start: number; end: number };
const norm = (w: string) => w.replace(/[.,!?;:«»"]/g, "");
function buildChunks(lines: Line[], keys: Set<string>): Chunk[] {
  const out: Chunk[] = [];
  for (const l of lines) {
    // ponctuation d'après le texte
    let pos = 0;
    const ws = l.words.map((w) => {
      const i = l.text.indexOf(w.w, pos);
      let after = "";
      if (i >= 0) {
        pos = i + w.w.length;
        const m = l.text.slice(pos).match(/^\s*([.,!?…]+)/);
        if (m) after = m[1].replace(/\s/g, "");
      }
      return { ...w, after };
    });
    let cur: typeof ws = [];
    const flush = () => {
      if (!cur.length) return;
      out.push({ words: cur.map((w) => ({ w: (w.w + (w.after && w.after !== "," ? (/^[?!:;]/.test(w.after) ? "\u202F" : "") + w.after : "")).toUpperCase(), s: w.s, key: keys.has(norm(w.w)) })), start: cur[0].s, end: cur[cur.length - 1].e });
      cur = [];
    };
    for (const w of ws) {
      cur.push(w);
      if (w.after || cur.length >= 3) flush();
    }
    flush();
  }
  for (let i = 0; i < out.length; i++) {
    const next = out[i + 1];
    out[i].end = next ? Math.min(next.start, out[i].end + 0.5) : out[i].end + 0.8;
  }
  return out;
}

const Captions: React.FC<{ chunks: Chunk[] }> = ({ chunks }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const c = chunks.find((k) => t >= k.start - 0.03 && t < k.end);
  if (!c) return null;
  return (
    <div style={{
      position: "absolute", left: 50, right: 50, top: 1330, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 26px",
      fontFamily: SANS, fontWeight: 900, fontSize: 82, lineHeight: 1.15, color: "#FFF", letterSpacing: 1,
      textShadow: "0 5px 14px rgba(0,0,0,.9), 0 0 3px rgba(0,0,0,.8)",
    }}>
      {c.words.map((w, i) => {
        const lf = (t - w.s) * fps;
        if (lf < -1) return null;
        const p = interpolate(lf, [-1, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
        return (
          <span key={i} style={{ display: "inline-block", position: "relative", transform: `scale(${0.75 + 0.25 * p})`, opacity: p, color: w.key ? GOLD : "#FFF" }}>
            {w.w}
            {w.key && (
              <span style={{ position: "absolute", left: 0, bottom: 2, height: 7, width: `${100 * p}%`, background: GOLD, boxShadow: "0 3px 8px rgba(0,0,0,.6)" }} />
            )}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Grain global ----------
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundImage: NOISE(seed + 20, 0.75, 0.09), mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Ciel: React.FC<{ data: CielData; audio?: boolean }> = ({ data, audio = true }) => {
  const { fps } = useVideoConfig();
  const chunks = React.useMemo(() => buildChunks(data.lines, new Set(data.keys)), [data]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {data.scenes.map((s, i) => {
        const from = Math.round(s.start * fps);
        const dur = Math.max(1, Math.round(s.end * fps) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} premountFor={30}>
            {s.kind === "video" && <VideoScene s={s} dur={dur} />}
            {s.kind === "plate" && <Punch><PlateScene s={s} dur={dur} fps={fps} /></Punch>}
            {s.kind === "stamp" && <Punch><StampScene s={s} dur={dur} /></Punch>}
            {s.kind === "number" && <NumberScene s={s} dur={dur} />}
            {s.credit && (
              <div style={{ position: "absolute", left: 40, right: 40, top: 150, fontFamily: SANS, fontWeight: 600, fontSize: 21, color: "rgba(255,255,255,.78)", textShadow: "0 1px 4px rgba(0,0,0,.9)", lineHeight: 1.3 }}>
                Crédit : {s.credit}
              </div>
            )}
          </Sequence>
        );
      })}
      <Grain />
      <Captions chunks={chunks} />
      {audio && <Audio src={staticFile("ciel/mix.wav")} />}
    </AbsoluteFill>
  );
};
