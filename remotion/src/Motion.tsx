// Motion design — style vlog voyage YouTube classique.
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, caps, fontFamily, outline } from "./theme";
import type { Chapter, Pop } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** entrée en « pop » + sortie rapide */
const usePop = (dur: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const out = interpolate(frame, [D - 7, D], [1, 0], clamp);
  return { s, out, frame, fps };
};

/** boîte blanche, texte noir gras (le classique pop-up de vlog) */
const Box: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily, fontWeight: 800, background: C.white, color: C.black, padding: "14px 28px", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,.35)", ...style }}>
    {children}
  </div>
);

/* ======================= TITRE D'INTRO ======================= */
export const MotionIntro: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const { s, out, frame, fps } = usePop(dur);
  const sub2 = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: out }}>
      <div style={{ ...outline, fontFamily, fontWeight: 900, fontSize: 190, lineHeight: 1, transform: `scale(${0.7 + 0.3 * s})`, opacity: s }}>{text}</div>
      <Box style={{ fontSize: 46, marginTop: 20, background: C.accent, transform: `translateY(${(1 - sub2) * 40}px)`, opacity: sub2 }}>{sub}</Box>
    </AbsoluteFill>
  );
};

/* ======================= TITRE DE CHAPITRE + ÉTIQUETTE DE LIEU ======================= */
export const ChapterTitle: React.FC<{ ch: Chapter; total: number; dur: number }> = ({ ch, dur }) => {
  const { s, out, frame, fps } = usePop(dur);
  const tag = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", padding: "70px 90px", opacity: out }}>
      <div style={{ ...caps, ...outline, fontSize: 30, color: C.accent, transform: `translateX(${(1 - s) * -80}px)`, opacity: s }}>Partie {ch.n}</div>
      <div style={{ ...outline, fontFamily, fontWeight: 900, fontSize: 92, lineHeight: 1.05, transform: `translateX(${(1 - s) * -120}px)`, opacity: s }}>{ch.title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, background: "rgba(0,0,0,.65)", color: C.white, fontFamily, fontWeight: 700, fontSize: 32, padding: "10px 22px 10px 16px", borderRadius: 40, transform: `translateX(${(1 - tag) * -60}px)`, opacity: tag }}>
        <svg width={26} height={34} viewBox="0 0 26 34">
          <path d="M13 0C5.8 0 0 5.6 0 12.6 0 22 13 34 13 34s13-12 13-21.4C26 5.6 20.2 0 13 0z" fill={C.accent2} />
          <circle cx={13} cy={12.5} r={5} fill="white" />
        </svg>
        {ch.place}
      </div>
    </AbsoluteFill>
  );
};

/* ======================= CARTE (style appli de plans) ======================= */
export const PLACES: Record<string, { lat: number; lon: number; name: string }> = {
  station: { lat: 37.5547, lon: 126.9707, name: "Seoul Station" },
  myeongdong: { lat: 37.5636, lon: 126.9858, name: "Myeongdong" },
  cheonggye: { lat: 37.5692, lon: 126.9905, name: "Cheonggyecheon" },
  jongno: { lat: 37.5722, lon: 126.9833, name: "Jongno" },
  ewha: { lat: 37.5619, lon: 126.9466, name: "Ewha" },
  palace: { lat: 37.5796, lon: 126.977, name: "Gyeongbokgung" },
  hongdae: { lat: 37.5563, lon: 126.9236, name: "Hongdae" },
  hanok: { lat: 37.5826, lon: 126.983, name: "Bukchon" },
};
const MW = 520;
const MH = 340;
const proj = (lat: number, lon: number) => ({ x: 30 + ((lon - 126.918) / 0.078) * (MW - 60), y: 40 + ((37.586 - lat) / 0.034) * (MH - 80) });
const STREAM = [
  [37.5701, 126.9768],
  [37.5694, 126.9852],
  [37.5689, 126.9948],
  [37.5684, 127.004],
].map(([la, lo]) => proj(la, lo));
// quelques « rues » pour l'effet plan
const ROADS = [
  [[37.586, 126.97], [37.548, 126.975]],
  [[37.586, 126.988], [37.548, 126.99]],
  [[37.575, 126.918], [37.573, 127.0]],
  [[37.56, 126.918], [37.562, 127.0]],
  [[37.586, 126.94], [37.548, 126.955]],
].map((r) => r.map(([la, lo]) => proj(la, lo)));

export const SeoulMap: React.FC<{ from?: string; to: string; dur: number }> = ({ from, to, dur }) => {
  const { s, out, frame, fps } = usePop(dur);
  const a = proj(PLACES[from ?? to].lat, PLACES[from ?? to].lon);
  const b = proj(PLACES[to].lat, PLACES[to].lon);
  const travel = interpolate(frame, [12, 45], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const px = a.x + (b.x - a.x) * travel;
  const py = a.y + (b.y - a.y) * travel;
  const drop = spring({ frame: frame - 44, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "70px 80px", opacity: out }}>
      <div style={{ position: "relative", width: MW, height: MH, borderRadius: 18, overflow: "hidden", background: "#EEF0EA", border: "5px solid white", boxShadow: "0 14px 40px rgba(0,0,0,.4)", transform: `scale(${0.6 + 0.4 * s})`, transformOrigin: "100% 0", opacity: s }}>
        <svg width={MW} height={MH} style={{ position: "absolute", inset: 0 }}>
          {ROADS.map((r, i) => (
            <line key={i} x1={r[0].x} y1={r[0].y} x2={r[1].x} y2={r[1].y} stroke="white" strokeWidth={8} />
          ))}
          <polyline points={STREAM.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#9CC8F0" strokeWidth={7} strokeLinecap="round" />
          {Object.entries(PLACES).map(([k, p]) => {
            if (k === to) return null;
            const q = proj(p.lat, p.lon);
            const right = q.x > MW - 160;
            return (
              <g key={k}>
                <circle cx={q.x} cy={q.y} r={5} fill="#8A8F86" />
                <text x={right ? q.x - 9 : q.x + 9} y={q.y + 5} textAnchor={right ? "end" : "start"} fill="#6B7068" fontFamily={fontFamily} fontWeight={700} fontSize={15}>
                  {p.name}
                </text>
              </g>
            );
          })}
          {from && from !== to ? <line x1={a.x} y1={a.y} x2={px} y2={py} stroke={C.accent2} strokeWidth={6} strokeLinecap="round" /> : null}
          <g transform={`translate(${px},${py - (1 - drop) * 30})`}>
            <path d="M0,0 C-11,-15 -14,-21 -14,-28 A14,14 0 1,1 14,-28 C14,-21 11,-15 0,0Z" fill={C.accent2} stroke="white" strokeWidth={3} />
            <circle cx={0} cy={-28} r={5} fill="white" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 14, bottom: 12, fontFamily, fontWeight: 800, fontSize: 24, color: C.black, background: "white", padding: "4px 12px", borderRadius: 8, opacity: drop }}>
          📍 {PLACES[to].name}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ======================= TEXTE POP-UP (moments forts) ======================= */
export const Quote: React.FC<{ pop: Extract<Pop, { kind: "quote" }> }> = ({ pop }) => {
  const { s, out } = usePop(pop.dur);
  const left = pop.pos !== "right";
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: left ? "flex-start" : "flex-end", padding: "120px 110px", opacity: out }}>
      <Box style={{ fontSize: 60, transform: `scale(${s}) rotate(${left ? -3 : 3}deg)`, transformOrigin: left ? "0 50%" : "100% 50%" }}>{pop.text}</Box>
    </AbsoluteFill>
  );
};

/* ======================= INFO (prix, température, note) ======================= */
const Info: React.FC<{ dur: number; top: string; big: string; small?: string }> = ({ dur, top, big, small }) => {
  const { s, out, frame, fps } = usePop(dur);
  const s2 = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "110px 100px", opacity: out }}>
      <div style={{ ...caps, ...outline, fontSize: 28, color: C.accent, textAlign: "right", opacity: s }}>{top}</div>
      <Box style={{ fontSize: 84, lineHeight: 1.05, marginTop: 8, transform: `scale(${s})`, transformOrigin: "100% 0" }}>{big}</Box>
      {small ? <div style={{ ...outline, fontFamily, fontWeight: 700, fontSize: 32, marginTop: 12, opacity: s2 }}>{small}</div> : null}
    </AbsoluteFill>
  );
};

const Money: React.FC<{ pop: Extract<Pop, { kind: "money" }> }> = ({ pop }) => {
  const frame = useCurrentFrame();
  const won = Math.round(interpolate(frame, [4, 26], [0, pop.won], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return <Info dur={pop.dur} top="Le Starbucks" big={`${won.toLocaleString("fr-FR")} ₩ = ${pop.eur} €`} small="(5,95 € en France)" />;
};
const Thermo: React.FC<{ pop: Extract<Pop, { kind: "thermo" }> }> = ({ pop }) => {
  const frame = useCurrentFrame();
  const v = Math.round(interpolate(frame, [4, 30], [20, pop.value], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return <Info dur={pop.dur} top="Température" big={`☀️ ${v}°C`} small="Plein soleil, zéro ombre" />;
};
const Rating: React.FC<{ pop: Extract<Pop, { kind: "rating" }> }> = ({ pop }) => (
  <Info dur={pop.dur} top={pop.label} big={`⭐ ${pop.value}/${pop.max}`} small="Notre note" />
);

/* ======================= TRAJET ======================= */
const Route: React.FC<{ pop: Extract<Pop, { kind: "route" }> }> = ({ pop }) => {
  const { s, out, frame } = usePop(pop.dur);
  const p = interpolate(frame, [10, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const W = 820;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 90, opacity: out }}>
      <div style={{ width: W, background: C.white, borderRadius: 20, padding: "20px 30px 18px", boxShadow: "0 14px 40px rgba(0,0,0,.4)", transform: `scale(${s})`, fontFamily, color: C.black }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontWeight: 900, fontSize: 46 }}>🚆 {Math.round(pop.km * p)} km</div>
          <div style={{ fontWeight: 800, fontSize: 34, color: "#555" }}>⏱ {pop.time}</div>
        </div>
        <svg width={W - 60} height={40} style={{ marginTop: 6, overflow: "visible" }}>
          <line x1={10} y1={20} x2={W - 70} y2={20} stroke="#DDD" strokeWidth={8} strokeLinecap="round" />
          <line x1={10} y1={20} x2={10 + (W - 80) * p} y2={20} stroke={C.accent2} strokeWidth={8} strokeLinecap="round" />
          <circle cx={10} cy={20} r={10} fill={C.black} />
          <circle cx={W - 70} cy={20} r={10} fill={p > 0.98 ? C.accent2 : "#BBB"} />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 26, color: "#333" }}>
          <span>{pop.from}</span>
          <span>{pop.to}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ======================= BOUTON S'ABONNER ======================= */
const Subscribe: React.FC<{ dur: number }> = ({ dur }) => {
  const { s, out, frame } = usePop(dur);
  const cx = interpolate(frame, [12, 34], [300, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cy = interpolate(frame, [12, 34], [160, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const click = frame >= 38;
  const press = interpolate(frame, [36, 38, 44], [1, 0.9, 1], clamp);
  const bell = click ? Math.sin((frame - 38) * 0.9) * 16 * Math.max(0, 1 - (frame - 38) / 28) : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 230px 100px", opacity: out }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, transform: `scale(${s})`, transformOrigin: "0 50%", fontFamily }}>
        <div style={{ fontWeight: 800, fontSize: 40, padding: "14px 34px", borderRadius: 50, background: click ? "#3A3A3A" : "#FF0000", color: "white", transform: `scale(${press})`, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }}>
          {click ? "ABONNÉ" : "S'ABONNER"}
        </div>
        <div style={{ width: 66, height: 66, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, transform: `rotate(${bell}deg)`, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }}>🔔</div>
        <svg width={44} height={56} viewBox="0 0 22 28" style={{ position: "absolute", left: 170 + cx, top: 40 + cy, filter: "drop-shadow(0 3px 4px rgba(0,0,0,.5))" }}>
          <path d="M2 1 L2 22 L7.5 17 L11 26 L15 24.5 L11.5 15.5 L19 15.5 Z" fill="white" stroke="black" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const PopView: React.FC<{ pop: Pop }> = ({ pop }) => {
  switch (pop.kind) {
    case "quote":
      return <Quote pop={pop} />;
    case "money":
      return <Money pop={pop} />;
    case "route":
      return <Route pop={pop} />;
    case "thermo":
      return <Thermo pop={pop} />;
    case "rating":
      return <Rating pop={pop} />;
    case "subscribe":
      return <Subscribe dur={pop.dur} />;
    default:
      return null;
  }
};
