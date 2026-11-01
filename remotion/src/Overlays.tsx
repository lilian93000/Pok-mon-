import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily } from "./theme";
import type { CaptionPage, Chapter, Tip, Title } from "./types";

/* ---------- Sous-titres : 1 page de quelques mots, mot actif surligné ---------- */
export const Captions: React.FC<{ pages: CaptionPage[] }> = ({ pages }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const page = pages.find((p) => t >= p.s && t < p.e);
  if (!page) return null;
  const pin = spring({ frame: frame - Math.round(page.s * fps), fps, config: { damping: 200 }, durationInFrames: 6 });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110 }}>
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.15,
          textAlign: "center",
          maxWidth: 1400,
          color: C.white,
          textShadow: "0 4px 18px rgba(0,0,0,.85), 0 0 4px rgba(0,0,0,.9)",
          transform: `translateY(${(1 - pin) * 14}px)`,
          opacity: pin,
        }}
      >
        {page.words.map((w, i) => {
          const active = t >= w.s && t < w.e + 0.05;
          return (
            <span key={i} style={{ color: active ? C.accent : C.white, display: "inline-block", transform: active ? "scale(1.06)" : undefined, margin: "0 0.12em" }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Carte de chapitre (en bas à gauche, ne coupe pas le rythme) ---------- */
export const ChapterCard: React.FC<{ ch: Chapter; total: number }> = ({ ch, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 3.6 * fps;
  const inn = spring({ frame, fps, config: { damping: 16 } });
  const out = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar = interpolate(frame, [6, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", padding: "80px 96px", opacity: out }}>
      <div style={{ fontFamily, color: C.white, transform: `translateX(${(1 - inn) * -60}px)`, opacity: inn, textShadow: "0 4px 24px rgba(0,0,0,.7)" }}>
        <div style={{ fontWeight: 600, fontSize: 30, letterSpacing: 6, color: C.accent }}>
          CHAPITRE {String(ch.n).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <div style={{ fontWeight: 900, fontSize: 96, lineHeight: 1, marginTop: 8 }}>{ch.title}</div>
        <div style={{ height: 8, width: 260 * bar, background: C.accent, borderRadius: 4, margin: "18px 0" }} />
        <div style={{ fontWeight: 600, fontSize: 34, opacity: 0.9 }}>📍 {ch.place}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Gros titre plein écran (accroche) ---------- */
export const BigTitle: React.FC<{ title: Title }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = title.dur * fps;
  const pop = spring({ frame, fps, config: { damping: 11, mass: 0.8 } });
  const out = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out, background: "radial-gradient(ellipse at center, rgba(0,0,0,.45), rgba(0,0,0,0) 70%)" }}>
      <div style={{ fontFamily, textAlign: "center", color: C.white, textShadow: "0 6px 30px rgba(0,0,0,.8)" }}>
        <div style={{ fontWeight: 900, fontSize: 150, lineHeight: 1, transform: `scale(${0.6 + 0.4 * pop})`, letterSpacing: -3 }}>
          {title.text}
        </div>
        {title.sub ? (
          <div style={{ fontWeight: 800, fontSize: 48, marginTop: 18, color: C.accent, opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
            {title.sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Barre de progression par chapitres (en haut) ---------- */
export const ChapterBar: React.FC<{ chapters: Chapter[]; duration: number; endAt: number }> = ({ chapters, endAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const start = chapters[0]?.at ?? 0;
  if (t < start || t > endAt) return null;
  const span = endAt - start;
  return (
    <AbsoluteFill style={{ padding: "0", justifyContent: "flex-start" }}>
      <div style={{ display: "flex", gap: 6, padding: "18px 24px 0", opacity: 0.85 }}>
        {chapters.map((c, i) => {
          const s = c.at;
          const e = chapters[i + 1]?.at ?? endAt;
          const p = Math.max(0, Math.min(1, (t - s) / (e - s)));
          return (
            <div key={i} style={{ flex: (e - s) / span, height: 6, background: "rgba(255,255,255,.28)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: C.accent }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Écran de fin : place libre pour les éléments YouTube ---------- */
export const EndScreen: React.FC<{ text: string; sub: string }> = ({ text, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const pop = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: `rgba(11,11,16,${0.55 * fade})` }}>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 120 }}>
        <div style={{ fontFamily, textAlign: "center", color: C.white, transform: `scale(${pop})` }}>
          <div style={{ fontWeight: 600, fontSize: 40, letterSpacing: 8, color: C.accent }}>{sub}</div>
          <div style={{ fontWeight: 900, fontSize: 130, lineHeight: 1.05 }}>{text}</div>
        </div>
      </AbsoluteFill>
      {/* emplacements indicatifs (vidéo suggérée à gauche, abonnement à droite) */}
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 120, paddingBottom: 170, opacity: fade }}>
        <div style={{ width: 720, height: 405, borderRadius: 18, border: "4px dashed rgba(255,255,255,.35)" }} />
        <div style={{ width: 300, height: 300, borderRadius: "50%", border: "4px dashed rgba(255,255,255,.35)" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Fiche info (en haut à droite) ---------- */
export const TipCard: React.FC<{ tip: Tip }> = ({ tip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = tip.dur * fps;
  const inn = spring({ frame, fps, config: { damping: 15 } });
  const out = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-start", padding: "90px 80px", opacity: out }}>
      <div
        style={{
          fontFamily,
          display: "flex",
          alignItems: "center",
          gap: 28,
          background: "rgba(11,11,16,.78)",
          border: "2px solid rgba(255,255,255,.12)",
          borderLeft: `10px solid ${C.accent}`,
          borderRadius: 24,
          padding: "26px 40px 26px 30px",
          maxWidth: 760,
          color: C.white,
          transform: `translateX(${(1 - inn) * 120}px)`,
          opacity: inn,
          boxShadow: "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        <div style={{ fontSize: 76, lineHeight: 1 }}>{tip.icon}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: 4, color: C.accent }}>BON À SAVOIR</div>
          <div style={{ fontWeight: 900, fontSize: 44, lineHeight: 1.1 }}>{tip.title}</div>
          <div style={{ fontWeight: 600, fontSize: 32, opacity: 0.9, marginTop: 6 }}>{tip.text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
