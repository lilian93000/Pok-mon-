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

/* ---------- Carte de la ville (lieux du plan, cadrage automatique) ---------- */
type Places = Record<string, { lat: number; lon: number; name: string }>;
const MW = 500;
const MH = 330;
const makeProj = (places: Places) => {
  const ps = Object.values(places);
  const lats = ps.map((p) => p.lat);
  const lons = ps.map((p) => p.lon);
  const [la0, la1, lo0, lo1] = [Math.min(...lats), Math.max(...lats), Math.min(...lons), Math.max(...lons)];
  const dLa = Math.max(la1 - la0, 0.005);
  const dLo = Math.max(lo1 - lo0, 0.005);
  return (lat: number, lon: number) => ({ x: 40 + ((lon - lo0) / dLo) * (MW - 80), y: 50 + ((la1 - lat) / dLa) * (MH - 110) });
};

export const CityMap: React.FC<{ places: Places; city: string; from?: string; to: string; dur: number }> = ({ places, city, from, to, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!places[to]) return null;
  const proj = makeProj(places);
  const D = dur * fps;
  const out = interpolate(frame, [D - 12, D], [1, 0], clamp);
  const inn = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: ease });
  const src = places[from ?? to] ?? places[to];
  const a = proj(src.lat, src.lon);
  const b = proj(places[to].lat, places[to].lon);
  const p = interpolate(frame, [14, 50], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const px = a.x + (b.x - a.x) * p;
  const py = a.y + (b.y - a.y) * p;
  const drop = interpolate(frame, [48, 58], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const pulse = (frame % 40) / 40;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "80px 90px", opacity: out * inn }}>
      <div style={{ ...glass, position: "relative", width: MW, height: MH, overflow: "hidden", transform: `translateY(${(1 - inn) * -24}px)` }}>
        <svg width={MW} height={MH} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 62} y1={0} x2={i * 62 + 40} y2={MH} stroke="rgba(255,255,255,.07)" strokeWidth={5} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 64 + 20} x2={MW} y2={i * 64} stroke="rgba(255,255,255,.07)" strokeWidth={5} />
          ))}
          {Object.entries(places).map(([k, q0]) => {
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
          <div style={{ fontWeight: 600, fontSize: 18, opacity: 0.75 }}>{city}</div>
          <div style={{ fontWeight: 800, fontSize: 30 }}>{places[to].name}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
