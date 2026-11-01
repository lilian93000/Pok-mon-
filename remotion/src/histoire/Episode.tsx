import React from "react";
import {
  AbsoluteFill, Audio, Img, interpolate, random, Sequence, spring, staticFile,
  useCurrentFrame, useVideoConfig, Easing,
} from "remotion";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import type { Beat, Props, Word } from "./types";

export const { fontFamily: serif } = loadCinzel("normal", { weights: ["700", "900"], subsets: ["latin", "latin-ext"] });
const { fontFamily: sans } = loadMont("normal", { weights: ["800", "900"], subsets: ["latin", "latin-ext"] });

// Direction artistique « Un jour, un fait » : marbre noir, rouge pompéien, or ancien.
export const C = {
  gold: "#E9B949",
  goldDeep: "#B8862B",
  red: "#7E1418",
  redDark: "#2A0507",
  ink: "#0B0A09",
  bone: "#F3EBDD",
};

const img = (id: string, key: string) => staticFile(`histoire/${id}/img/${key}.png`);

// ---------- Fonds ----------
const Marble: React.FC = () => (
  <Img src={staticFile("histoire/_tex/marble.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.16, mixBlendMode: "screen" }} />
);

export const Rays: React.FC<{ color: string }> = ({ color }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "38%", width: 3400, height: 3400,
        marginLeft: -1700, marginTop: -1700, transform: `rotate(${f * 0.12}deg)`,
        background: `repeating-conic-gradient(${color} 0deg 4deg, transparent 4deg 15deg)`,
        maskImage: "radial-gradient(circle, black 8%, transparent 52%)",
        WebkitMaskImage: "radial-gradient(circle, black 8%, transparent 52%)",
        opacity: 0.55,
      }}
    />
  );
};

const Background: React.FC<{ beat: Beat }> = ({ beat }) => {
  const red = beat.bg === "red";
  return (
    <AbsoluteFill
      style={{
        background: red
          ? `radial-gradient(ellipse at 50% 38%, #A3241F 0%, ${C.red} 38%, ${C.redDark} 100%)`
          : `radial-gradient(ellipse at 50% 38%, #2A2622 0%, #141210 45%, ${C.ink} 100%)`,
      }}
    >
      {!red && <Marble />}
      {beat.rays && <Rays color={red ? "rgba(255,190,120,.22)" : "rgba(233,185,73,.16)"} />}
    </AbsoluteFill>
  );
};

// ---------- Image principale ----------
const Subject: React.FC<{ id: string; beat: Beat; photo: boolean }> = ({ id, beat, photo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = (beat.end - beat.start) * fps;
  const pop = spring({ frame: f, fps, config: { damping: 14, mass: 0.7 } });
  const drift = interpolate(f, [0, len], [1, beat.zoom ? 1.45 : 1.07], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const blur = interpolate(f, [0, 6], [12, 0], { extrapolateRight: "clamp" });
  const src = img(id, beat.image!);
  const scale = (0.86 + 0.14 * pop) * drift;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 250 }}>
      <div style={{ width: 900, height: 980, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${scale})`, filter: `blur(${blur}px)`, opacity: pop }}>
        {photo ? (
          <div style={{ position: "relative", padding: 0 }}>
            <Img src={src} style={{ maxWidth: 880, maxHeight: 900, display: "block", filter: "sepia(.35) contrast(1.08) brightness(.92)", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }} />
            <Brackets />
          </div>
        ) : (
          <Img src={src} style={{ maxWidth: 900, maxHeight: 960, objectFit: "contain", filter: "drop-shadow(0 40px 60px rgba(0,0,0,.75)) contrast(1.06)" }} />
        )}
      </div>
    </AbsoluteFill>
  );
};

const Brackets: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 12], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = (pos: React.CSSProperties, t: string) => (
    <div style={{ position: "absolute", width: 70, height: 70, borderColor: C.gold, borderStyle: "solid", borderWidth: 0, ...pos, transform: t }} />
  );
  return (
    <>
      {s({ left: -22, top: -22, borderLeftWidth: 6, borderTopWidth: 6 }, `translate(${-o}px,${-o}px)`)}
      {s({ right: -22, top: -22, borderRightWidth: 6, borderTopWidth: 6 }, `translate(${o}px,${-o}px)`)}
      {s({ left: -22, bottom: -22, borderLeftWidth: 6, borderBottomWidth: 6 }, `translate(${-o}px,${o}px)`)}
      {s({ right: -22, bottom: -22, borderRightWidth: 6, borderBottomWidth: 6 }, `translate(${o}px,${o}px)`)}
    </>
  );
};

// ---------- Habillages ----------
const Stamp: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f - 4, fps, config: { damping: 11, stiffness: 220 } });
  const scale = interpolate(t, [0, 1], [2.6, 1]);
  const size = Math.min(140, Math.floor(1250 / Math.max(1, text.length)));
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 560, height: 400 }}>
      <div
        style={{
          fontFamily: serif, fontWeight: 900, fontSize: size, color: C.bone, letterSpacing: "0.04em",
          padding: "10px 34px", border: `10px solid ${C.bone}`, borderRadius: 14,
          transform: `rotate(-7deg) scale(${scale})`, opacity: t > 0.01 ? 1 : 0,
          background: "rgba(20,4,4,.55)", boxShadow: "0 20px 60px rgba(0,0,0,.6)",
          textShadow: "0 4px 0 rgba(0,0,0,.35)", whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [6, 20], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(f, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ top: 1150, height: 100, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 28 }}>
      <div style={{ width: w, height: 3, background: C.gold }} />
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 54, color: C.gold, letterSpacing: "0.22em", opacity: o }}>{text}</div>
      <div style={{ width: w, height: 3, background: C.gold }} />
    </AbsoluteFill>
  );
};

const DateCard: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f - 2, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ top: 120, height: 200, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 110, color: C.gold, transform: `translateY(${(1 - t) * -60}px)`, opacity: t, textShadow: "0 8px 30px rgba(0,0,0,.8)" }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const Counter: React.FC<{ to: number; suffix?: string; len: number }> = ({ to, suffix, len }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, Math.min(len - 6, 50)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ top: 140, height: 220, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 96, color: C.gold, textShadow: "0 8px 30px rgba(0,0,0,.85)", whiteSpace: "nowrap" }}>
        {fmt(to * p)}
        <span style={{ fontSize: 60, color: C.bone }}>{suffix}</span>
      </div>
    </AbsoluteFill>
  );
};

const Heads: React.FC<{ id: string; n: number }> = ({ id, n }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keys = ["head", "elder", "head", "elder"];
  return (
    <AbsoluteFill style={{ paddingTop: 280, alignItems: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 400px)", gap: 30 }}>
        {Array.from({ length: n }).map((_, i) => {
          const t = spring({ frame: f - i * 6, fps, config: { damping: 13 } });
          return (
            <div key={i} style={{ height: 460, display: "flex", justifyContent: "center", alignItems: "flex-end", opacity: t, transform: `scale(${0.6 + 0.4 * t}) ${i % 2 ? "scaleX(-1)" : ""}` }}>
              <Img src={img(id, keys[i % keys.length])} style={{ maxHeight: 440, maxWidth: 380, filter: "drop-shadow(0 25px 35px rgba(0,0,0,.8)) grayscale(.2)" }} />
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 64, color: C.gold, marginTop: 20, opacity: spring({ frame: f - n * 6, fps }) }}>
        {n} EMPEREURS · 1 AN
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f, fps, config: { damping: 14 } });
  const b = spring({ frame: f - 12, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 380, gap: 40 }}>
      <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 120, color: C.gold, textAlign: "center", lineHeight: 1.05, opacity: t, transform: `scale(${0.8 + 0.2 * t})` }}>
        UN JOUR<br />
        <span style={{ fontSize: 70, color: C.bone }}>·</span><br />
        UN FAIT
      </div>
      <div style={{ fontFamily: sans, fontWeight: 900, fontSize: 52, color: C.ink, background: C.gold, padding: "18px 48px", borderRadius: 999, transform: `scale(${b})`, letterSpacing: "0.06em" }}>
        + ABONNEZ-VOUS
      </div>
    </AbsoluteFill>
  );
};

// ---------- Sous-titres mot à mot ----------
type Chunk = { words: Word[]; start: number; end: number };

const chunkWords = (words: Word[], beats: Beat[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const brk = !next || next.beat !== w.beat || /[.,?!…:»]$/.test(w.w) || cur.length >= 3;
    if (brk) {
      out.push({ words: cur, start: cur[0].start - 0.05, end: 0 });
      cur = [];
    }
  });
  out.forEach((c, i) => {
    const beatEnd = beats[c.words[0].beat].end;
    c.end = Math.min(out[i + 1]?.start ?? beatEnd, beatEnd);
  });
  return out;
};

const Captions: React.FC<{ chunk: Chunk }> = ({ chunk }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = chunk.start;
  return (
    <AbsoluteFill style={{ top: 1290, height: 380, alignItems: "center", justifyContent: "center", padding: "0 70px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 26px" }}>
        {chunk.words.map((w, i) => {
          const local = f - (w.start - t0) * fps;
          const p = spring({ frame: local, fps, config: { damping: 12, stiffness: 260 } });
          const under = interpolate(local, [2, 9], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span
              key={i}
              style={{
                position: "relative", fontFamily: sans, fontWeight: 900, fontSize: 84, lineHeight: 1.12,
                textTransform: "uppercase", color: w.kw ? C.gold : "#FFFFFF", opacity: local < 0 ? 0 : 1,
                transform: `translateY(${(1 - p) * 26}px) scale(${0.9 + 0.1 * p})`, display: "inline-block",
                textShadow: "0 6px 0 rgba(0,0,0,.55), 0 10px 30px rgba(0,0,0,.6)", letterSpacing: "0.01em",
              }}
            >
              {w.w}
              {w.kw && (
                <span style={{ position: "absolute", left: 0, bottom: 2, height: 9, width: `${under}%`, background: C.gold, borderRadius: 4, boxShadow: "0 4px 0 rgba(0,0,0,.4)" }} />
              )}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Grain, vignette, secousse, flash ----------
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img src={staticFile(`histoire/_tex/grain${f % 4}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.65) 100%)" }} />
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 5], [0.55, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#FFE9C2", opacity: o }} />;
};

const Badge: React.FC<{ n: string }> = ({ n }) => (
  <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 30, color: "rgba(243,235,221,.7)", letterSpacing: "0.3em" }}>
      UN JOUR · UN FAIT · Nº {n}
    </div>
  </div>
);

export const Episode: React.FC<Props & { photos?: string[] }> = (props) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const { id, beats, words, audio } = props;
  const chunks = chunkWords(words, beats);
  const fr = (s: number) => Math.round(s * fps);
  const num = id.split("-")[0];

  // secousse sur les tampons
  const stampBeat = beats.find((b) => b.stamp && frame >= fr(b.start) + 4 && frame < fr(b.start) + 14);
  const shake = stampBeat ? (random(frame) - 0.5) * 22 * interpolate(frame - fr(stampBeat.start), [4, 14], [1, 0]) : 0;

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {audio && <Audio src={staticFile(audio)} />}
      {props.music && (
        <Audio
          src={staticFile(props.music)}
          volume={(f) => 0.24 * interpolate(f, [0, 8, fr(props.duration) - 25, fr(props.duration)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      )}
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake * 0.6}px)` }}>
        {beats.map((b, i) => {
          const from = fr(b.start);
          const dur = Math.max(1, fr(b.end) - from);
          const photo = (b as Beat & { photo?: boolean }).photo ?? false;
          return (
            <Sequence key={i} from={from} durationInFrames={dur} layout="none">
              <AbsoluteFill>
                <Background beat={b} />
                {b.image && !b.outro && <Subject id={id} beat={b} photo={photo} />}
                {b.heads && <Heads id={id} n={b.heads} />}
                {b.label && <Label text={b.label} />}
                {b.date && <DateCard text={b.date} />}
                {b.counter && <Counter to={b.counter.to} suffix={b.counter.suffix} len={dur} />}
                {b.stamp && <Stamp text={b.stamp} />}
                {b.outro && <Outro />}
                {b.bg === "red" && i > 0 && <Flash />}
              </AbsoluteFill>
            </Sequence>
          );
        })}
        {chunks.map((c, i) => (
          <Sequence key={`c${i}`} from={fr(c.start)} durationInFrames={Math.max(1, fr(c.end) - fr(c.start))} layout="none">
            <Captions chunk={c} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <Grain />
      <Badge n={num} />
    </AbsoluteFill>
  );
};
