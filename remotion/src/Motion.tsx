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
    case "place":
      return <PlaceLabel name={pop.name} sub={pop.sub} dur={pop.dur} />;
    case "price":
      return <PriceTag item={pop.item} price={pop.price} conv={pop.conv} dur={pop.dur} />;
    case "chip":
      return <InfoChip value={pop.value} label={pop.label} dur={pop.dur} />;
    case "route":
      return <RouteCard from={pop.from} to={pop.to} km={pop.km} time={pop.time} dur={pop.dur} />;
    case "quote":
      return <Info dur={pop.dur} title={pop.text} />;
    default:
      return null;
  }
};

/* =====================================================================
   Motion design « propre » : cartes, lieux, boutiques, prix
   ===================================================================== */
const PIN = "#FF4D4D";
const glass: React.CSSProperties = {
  background: "rgba(16,16,20,.62)",
  border: "1px solid rgba(255,255,255,.16)",
  borderRadius: 18,
  boxShadow: "0 12px 40px rgba(0,0,0,.35)",
};
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** révélation par masque (le texte glisse depuis le bas) */
const Reveal: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 16], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 100}%)` }}>{children}</div>
    </div>
  );
};

const PinIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size * 0.76} height={size} viewBox="0 0 26 34">
    <path d="M13 0C5.8 0 0 5.6 0 12.6 0 22 13 34 13 34s13-12 13-21.4C26 5.6 20.2 0 13 0z" fill={PIN} />
    <circle cx={13} cy={12.5} r={5} fill="white" />
  </svg>
);

/* ---------- Étiquette lieu / boutique (bas gauche) ---------- */
export const PlaceLabel: React.FC<{ name: string; sub?: string; dur: number }> = ({ name, sub, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const line = interpolate(frame, [4, 20], [0, 1], { ...clamp, easing: ease });
  const pin = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 190px 90px", opacity: out, fontFamily, color: C.white, textShadow: soft }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ transform: `scale(${pin})`, transformOrigin: "50% 100%" }}>
          <PinIcon size={44} />
        </div>
        <div style={{ height: 52, width: 3, background: "rgba(255,255,255,.85)", transform: `scaleY(${line})` }} />
        <div>
          <Reveal delay={6}>
            <div style={{ fontWeight: 800, fontSize: 48, lineHeight: 1.1 }}>{name}</div>
          </Reveal>
          {sub ? (
            <Reveal delay={11}>
              <div style={{ fontWeight: 500, fontSize: 28, opacity: 0.9 }}>{sub}</div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Étiquette de prix (haut droite) ---------- */
export const PriceTag: React.FC<{ item: string; price: string; conv?: string; dur: number }> = ({ item, price, conv, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const inn = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: ease });
  const swing = Math.sin(frame / 7) * 3 * Math.max(0, 1 - frame / 45);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "90px 100px", opacity: out * inn }}>
      <div style={{ transform: `translateY(${(1 - inn) * -30}px) rotate(${swing}deg)`, transformOrigin: "50% 0", display: "flex", alignItems: "stretch", fontFamily }}>
        {/* encoche d'étiquette */}
        <div style={{ width: 0, height: 0, borderTop: "56px solid transparent", borderBottom: "56px solid transparent", borderRight: "34px solid white", alignSelf: "center" }} />
        <div style={{ background: "white", color: "#111", padding: "14px 30px 14px 18px", borderRadius: "0 14px 14px 0", boxShadow: "0 12px 30px rgba(0,0,0,.35)", minHeight: 84 }}>
          <div style={{ fontWeight: 600, fontSize: 24, color: "#666" }}>{item}</div>
          <div style={{ fontWeight: 900, fontSize: 56, lineHeight: 1.05 }}>{price}</div>
          {conv ? <div style={{ fontWeight: 700, fontSize: 26, color: PIN }}>{conv}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Info chiffrée (pastille verre) ---------- */
export const InfoChip: React.FC<{ value: string; label: string; dur: number }> = ({ value, label, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const inn = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "90px 100px", opacity: out * inn }}>
      <div style={{ ...glass, padding: "16px 30px", fontFamily, color: C.white, transform: `translateX(${(1 - inn) * 40}px)`, textAlign: "right" }}>
        <div style={{ fontWeight: 900, fontSize: 60, lineHeight: 1.05 }}>{value}</div>
        <div style={{ fontWeight: 600, fontSize: 26, opacity: 0.85 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Trajet (ligne qui se trace) ---------- */
export const RouteCard: React.FC<{ from: string; to: string; km: number; time: string; dur: number }> = ({ from, to, km, time, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const inn = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: ease });
  const p = interpolate(frame, [12, 60], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const W = 640;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "90px 100px", opacity: out * inn }}>
      <div style={{ ...glass, width: W, padding: "18px 26px", fontFamily, color: C.white, transform: `translateY(${(1 - inn) * -20}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontWeight: 900, fontSize: 46 }}>{Math.round(km * p)} km</div>
          <div style={{ fontWeight: 700, fontSize: 30, opacity: 0.9 }}>{time} en train</div>
        </div>
        <svg width={W - 52} height={34} style={{ overflow: "visible", marginTop: 6 }}>
          <line x1={8} y1={17} x2={W - 60} y2={17} stroke="rgba(255,255,255,.25)" strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />
          <line x1={8} y1={17} x2={8 + (W - 68) * p} y2={17} stroke={PIN} strokeWidth={4} strokeLinecap="round" />
          <circle cx={8} cy={17} r={7} fill="white" />
          <circle cx={W - 60} cy={17} r={7} fill={p > 0.98 ? PIN : "rgba(255,255,255,.5)"} />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 24, opacity: 0.9 }}>
          <span>{from}</span>
          <span>{to}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Carte de Séoul (style plan sombre, propre) ---------- */
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
const MW = 500;
const MH = 330;
const proj = (lat: number, lon: number) => ({ x: 30 + ((lon - 126.918) / 0.078) * (MW - 60), y: 40 + ((37.586 - lat) / 0.034) * (MH - 80) });
const STREAM = [
  [37.5701, 126.9768],
  [37.5694, 126.9852],
  [37.5689, 126.9948],
  [37.5684, 127.004],
].map(([la, lo]) => proj(la, lo));
const ROADS = [
  [[37.586, 126.97], [37.548, 126.975]],
  [[37.586, 126.988], [37.548, 126.99]],
  [[37.575, 126.918], [37.573, 127.0]],
  [[37.56, 126.918], [37.562, 127.0]],
  [[37.586, 126.94], [37.548, 126.955]],
].map((r) => r.map(([la, lo]) => proj(la, lo)));

export const SeoulMap: React.FC<{ from?: string; to: string; dur: number }> = ({ from, to, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const out = interpolate(frame, [D - 12, D], [1, 0], clamp);
  const inn = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: ease });
  const a = proj(PLACES[from ?? to].lat, PLACES[from ?? to].lon);
  const b = proj(PLACES[to].lat, PLACES[to].lon);
  const p = interpolate(frame, [14, 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const px = a.x + (b.x - a.x) * p;
  const py = a.y + (b.y - a.y) * p;
  const drop = interpolate(frame, [48, 58], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const pulse = (frame % 40) / 40;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "80px 90px", opacity: out * inn }}>
      <div style={{ ...glass, position: "relative", width: MW, height: MH, overflow: "hidden", transform: `translateY(${(1 - inn) * -24}px)` }}>
        <svg width={MW} height={MH} style={{ position: "absolute", inset: 0 }}>
          {ROADS.map((r, i) => (
            <line key={i} x1={r[0].x} y1={r[0].y} x2={r[1].x} y2={r[1].y} stroke="rgba(255,255,255,.12)" strokeWidth={6} />
          ))}
          <polyline points={STREAM.map((q) => `${q.x},${q.y}`).join(" ")} fill="none" stroke="rgba(120,180,255,.55)" strokeWidth={5} strokeLinecap="round" />
          {Object.entries(PLACES).map(([k, q0]) => {
            if (k === to) return null;
            const q = proj(q0.lat, q0.lon);
            const right = q.x > MW - 150;
            return (
              <g key={k} opacity={0.55}>
                <circle cx={q.x} cy={q.y} r={4} fill="white" />
                <text x={right ? q.x - 9 : q.x + 9} y={q.y + 5} textAnchor={right ? "end" : "start"} fill="white" fontFamily={fontFamily} fontWeight={600} fontSize={14}>
                  {q0.name}
                </text>
              </g>
            );
          })}
          {from && from !== to ? <line x1={a.x} y1={a.y} x2={px} y2={py} stroke={PIN} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 9" /> : null}
          <circle cx={b.x} cy={b.y} r={8 + 22 * pulse} fill="none" stroke={PIN} strokeWidth={2} opacity={(1 - pulse) * drop} />
          <g transform={`translate(${px - 13 * 0.9},${py - 34 * 0.9 - (1 - drop) * 16}) scale(0.9)`}>
            <path d="M13 0C5.8 0 0 5.6 0 12.6 0 22 13 34 13 34s13-12 13-21.4C26 5.6 20.2 0 13 0z" fill={PIN} />
            <circle cx={13} cy={12.5} r={5} fill="white" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 18, bottom: 14, fontFamily, color: C.white, opacity: drop }}>
          <div style={{ fontWeight: 600, fontSize: 18, opacity: 0.75 }}>Séoul</div>
          <div style={{ fontWeight: 800, fontSize: 30 }}>{PLACES[to].name}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
