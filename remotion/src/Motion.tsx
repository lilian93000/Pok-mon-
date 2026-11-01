// Habillage « vlog voyage simple » : textes blancs propres, fondus courts, rien de forcé.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily } from "./theme";
import type { Chapter, Pop } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const soft = "0 2px 12px rgba(0,0,0,.55), 0 0 2px rgba(0,0,0,.4)";

/** fondu + léger glissement vers le haut */
const useFade = (dur: number, inF = 12, outF = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const op = Math.min(interpolate(frame, [0, inF], [0, 1], clamp), interpolate(frame, [D - outF, D], [1, 0], clamp));
  const y = interpolate(frame, [0, inF + 6], [12, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return { op, y, frame };
};

/* ---------- Titre d'intro ---------- */
export const MotionIntro: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const { op, y } = useFade(dur, 16, 16);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: op, transform: `translateY(${y}px)`, color: C.white, textShadow: soft, fontFamily }}>
      <div style={{ fontWeight: 800, fontSize: 150, letterSpacing: "0.04em", lineHeight: 1 }}>{text}</div>
      <div style={{ fontWeight: 500, fontSize: 42, marginTop: 14 }}>{sub}</div>
    </AbsoluteFill>
  );
};

/* ---------- Titre de chapitre (centre, simple) ---------- */
export const ChapterTitle: React.FC<{ ch: Chapter; total: number; dur: number }> = ({ ch, dur }) => {
  const { op, y } = useFade(dur, 10, 14);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op, transform: `translateY(${y}px)`, color: C.white, textShadow: soft, fontFamily }}>
      <div style={{ fontWeight: 800, fontSize: 96, lineHeight: 1 }}>{ch.title}</div>
    </AbsoluteFill>
  );
};

/* ---------- Étiquette de lieu (bas gauche) ---------- */
export const PlaceTag: React.FC<{ place: string; dur: number }> = ({ place, dur }) => {
  const { op, y } = useFade(dur, 12, 16);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 200px 90px", opacity: op, transform: `translateY(${y}px)`, color: C.white, textShadow: soft, fontFamily }}>
      <div style={{ fontWeight: 700, fontSize: 40 }}>📍 {place}</div>
    </AbsoluteFill>
  );
};

/* ---------- Petite info (prix, trajet…) en haut à droite ---------- */
const Info: React.FC<{ dur: number; title: string; line?: string }> = ({ dur, title, line }) => {
  const { op, y } = useFade(dur);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "80px 90px", opacity: op, transform: `translateY(${y}px)`, color: C.white, textShadow: soft, fontFamily, textAlign: "right" }}>
      <div style={{ fontWeight: 800, fontSize: 62 }}>{title}</div>
      {line ? <div style={{ fontWeight: 500, fontSize: 34, marginTop: 4 }}>{line}</div> : null}
    </AbsoluteFill>
  );
};

export const PopView: React.FC<{ pop: Pop }> = ({ pop }) => {
  switch (pop.kind) {
    case "money":
      return <Info dur={pop.dur} title={`${pop.won.toLocaleString("fr-FR")} ₩ ≈ ${pop.eur} €`} line="(5,95 € en France)" />;
    case "route":
      return <Info dur={pop.dur} title={`${pop.from} → ${pop.to}`} line={`${pop.km} km · ${pop.time} en train`} />;
    case "quote":
      return <Info dur={pop.dur} title={pop.text} />;
    case "thermo":
      return <Info dur={pop.dur} title={`${pop.value}°C`} line="plein soleil" />;
    case "rating":
      return <Info dur={pop.dur} title={`${pop.value}/${pop.max}`} line={pop.label} />;
    default:
      return null;
  }
};
