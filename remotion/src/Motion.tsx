// Motion design : intro, transitions de chapitre, carte de Séoul, autocollants animés, compteurs…
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily } from "./theme";
import type { Chapter, Pop } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.7, 0, 0.2, 1);

/* ======================= INTRO « SÉOUL / 서울 » ======================= */
export const MotionIntro: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const out = interpolate(frame, [D - 12, D], [1, 0], clamp);
  const wipe = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: ease });
  const korean = interpolate(frame, [4, 40], [0, 1], clamp);
  const ring = (delay: number) => interpolate(frame, [delay, delay + 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden" }}>
      {/* voile + bandes diagonales qui balaient */}
      <AbsoluteFill style={{ background: `rgba(11,11,16,${0.45 * wipe})` }} />
      {[0, 1, 2].map((i) => {
        const p = interpolate(frame, [i * 3, i * 3 + 22], [-1, 1.4], { ...clamp, easing: ease });
        return (
          <div key={i} style={{ position: "absolute", top: -200, bottom: -200, width: 60 + i * 40, left: `${p * 100}%`, transform: "skewX(-18deg)", background: i === 1 ? C.accent2 : C.accent, opacity: 0.85 - i * 0.2 }} />
        );
      })}
      {/* anneaux qui s'ouvrent */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {[8, 16, 24].map((d, i) => (
          <div key={i} style={{ position: "absolute", width: 300 + 900 * ring(d), height: 300 + 900 * ring(d), borderRadius: "50%", border: `3px solid ${i === 1 ? C.accent2 : C.accent}`, opacity: (1 - ring(d)) * 0.8 }} />
        ))}
      </AbsoluteFill>
      {/* 서울 en filigrane */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: "sans-serif", fontWeight: 900, fontSize: 520, color: "rgba(255,255,255,.16)", transform: `translateY(${(1 - korean) * 60}px) scale(${1.15 - 0.15 * korean})`, opacity: korean, letterSpacing: 40 }}>
          서울
        </div>
      </AbsoluteFill>
      {/* SÉOUL lettre par lettre */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", fontFamily, fontWeight: 900, fontSize: 210, color: C.white, letterSpacing: 6, textShadow: "0 10px 40px rgba(0,0,0,.6)" }}>
          {text.split("").map((ch, i) => {
            const s = spring({ frame: frame - 10 - i * 3, fps, config: { damping: 12, mass: 0.7 } });
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * 140}px) rotate(${(1 - s) * (i % 2 ? 12 : -12)}deg)`, opacity: s }}>
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{ height: 10, width: 520 * interpolate(frame, [26, 44], [0, 1], { ...clamp, easing: ease }), background: C.accent, borderRadius: 5, margin: "6px 0 22px" }} />
        <div style={{ fontFamily, fontWeight: 800, fontSize: 54, color: C.white, overflow: "hidden", whiteSpace: "nowrap", width: `${interpolate(frame, [32, 58], [0, 100], clamp)}%`, textAlign: "center", textShadow: "0 4px 20px rgba(0,0,0,.7)" }}>
          {sub}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ======================= TRANSITION DE CHAPITRE (plein écran) ======================= */
export const ChapterTransition: React.FC<{ ch: Chapter; total: number }> = ({ ch, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 0-12 : volet rose entre ; 12-34 : texte ; 34-46 : sortie
  const inn = interpolate(frame, [0, 12], [-130, 0], { ...clamp, easing: ease });
  const outp = interpolate(frame, [34, 46], [0, 130], { ...clamp, easing: ease });
  const x = frame < 34 ? inn : outp;
  const stripe = interpolate(frame, [2, 14], [-130, 0], { ...clamp, easing: ease });
  const stripeOut = interpolate(frame, [30, 44], [0, 130], { ...clamp, easing: ease });
  const num = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  const textOp = interpolate(frame, [30, 36], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: "-20% -30%", background: C.accent2, transform: `translateX(${frame < 30 ? stripe : stripeOut}%) skewX(-14deg)` }} />
      <div style={{ position: "absolute", inset: "-20% -30%", background: C.accent, transform: `translateX(${x}%) skewX(-14deg)` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: textOp, transform: `translateX(${frame < 34 ? 0 : outp * 0.6}%)` }}>
        <div style={{ fontFamily, color: C.white, textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 300, lineHeight: 0.9, opacity: 0.25 + 0.75 * num, transform: `scale(${0.6 + 0.4 * num})`, color: "transparent", WebkitTextStroke: "6px white" }}>
            {String(ch.n).padStart(2, "0")}
          </div>
          <div style={{ display: "flex", justifyContent: "center", fontWeight: 900, fontSize: 110, lineHeight: 1, marginTop: -40 }}>
            {ch.title.split("").map((c, i) => {
              const s = spring({ frame: frame - 10 - i * 0.8, fps, config: { damping: 15 } });
              return (
                <span key={i} style={{ display: "inline-block", whiteSpace: "pre", transform: `translateY(${(1 - s) * 80}px)`, opacity: s }}>
                  {c}
                </span>
              );
            })}
          </div>
          <div style={{ fontWeight: 600, fontSize: 34, letterSpacing: 10, marginTop: 18, opacity: num }}>
            CHAPITRE {ch.n} / {total}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ======================= CARTE DE SÉOUL ANIMÉE ======================= */
export const PLACES: Record<string, { lat: number; lon: number; name: string }> = {
  station: { lat: 37.5547, lon: 126.9707, name: "Seoul Station" },
  myeongdong: { lat: 37.5636, lon: 126.9858, name: "Myeongdong" },
  cheonggye: { lat: 37.5692, lon: 126.9905, name: "Cheonggyecheon" },
  jongno: { lat: 37.5722, lon: 126.9833, name: "Jongno" },
  ewha: { lat: 37.5619, lon: 126.9466, name: "Ewha" },
  palace: { lat: 37.5796, lon: 126.977, name: "Gyeongbokgung" },
  hongdae: { lat: 37.5563, lon: 126.9236, name: "Hongdae" },
  hanok: { lat: 37.5826, lon: 126.983, name: "Bukchon Hanok" },
};
const MW = 620;
const MH = 400;
// cadre élargi (marges) pour que les noms de lieux restent dans la carte
const proj = (lat: number, lon: number) => ({ x: 30 + ((lon - 126.918) / 0.078) * (MW - 60), y: 50 + ((37.586 - lat) / 0.034) * (MH - 100) });
const STREAM = [
  [37.5701, 126.9768],
  [37.5694, 126.9852],
  [37.5689, 126.9948],
  [37.5684, 127.004],
].map(([la, lo]) => proj(la, lo));

export const SeoulMap: React.FC<{ from?: string; to: string; dur: number }> = ({ from, to, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const inn = spring({ frame, fps, config: { damping: 16 } });
  const out = interpolate(frame, [D - 12, D], [1, 0], clamp);
  const a = proj(PLACES[from ?? to].lat, PLACES[from ?? to].lon);
  const b = proj(PLACES[to].lat, PLACES[to].lon);
  const travel = interpolate(frame, [12, 40], [0, 1], { ...clamp, easing: ease });
  const px = a.x + (b.x - a.x) * travel;
  const py = a.y + (b.y - a.y) * travel;
  const drop = spring({ frame: frame - 40, fps, config: { damping: 9 } });
  const pulse = (frame % 30) / 30;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: "0 70px 210px 0", opacity: out }}>
      <div style={{ position: "relative", width: MW, height: MH, borderRadius: 26, overflow: "hidden", background: "rgba(11,11,16,.82)", border: "2px solid rgba(255,255,255,.14)", boxShadow: "0 24px 70px rgba(0,0,0,.5)", transform: `translateY(${(1 - inn) * 60}px) scale(${0.9 + 0.1 * inn})`, opacity: inn }}>
        <svg width={MW} height={MH} style={{ position: "absolute", inset: 0 }}>
          {/* quadrillage */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 56} y1={0} x2={i * 56} y2={MH} stroke="rgba(255,255,255,.05)" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 56} x2={MW} y2={i * 56} stroke="rgba(255,255,255,.05)" />
          ))}
          {/* ruisseau Cheonggyecheon */}
          <polyline points={STREAM.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={C.accent2} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
          {/* lieux */}
          {Object.entries(PLACES).map(([k, p]) => {
            const q = proj(p.lat, p.lon);
            const cur = k === to;
            return (
              <g key={k} opacity={cur ? 0 : 0.55}>
                <circle cx={q.x} cy={q.y} r={6} fill="white" />
                <text x={q.x > MW - 190 ? q.x - 12 : q.x + 12} y={q.y + 6} textAnchor={q.x > MW - 190 ? "end" : "start"} fill="white" fontFamily={fontFamily} fontSize={18} fontWeight={600}>
                  {p.name}
                </text>
              </g>
            );
          })}
          {/* trajet */}
          {from && from !== to ? (
            <line x1={a.x} y1={a.y} x2={px} y2={py} stroke={C.accent} strokeWidth={5} strokeDasharray="10 8" strokeLinecap="round" />
          ) : null}
          {/* lieu actuel */}
          <circle cx={b.x} cy={b.y} r={14 + 40 * pulse} fill="none" stroke={C.accent} strokeWidth={3} opacity={(1 - pulse) * drop} />
          <g transform={`translate(${px},${py - (1 - drop) * 40})`}>
            <path d="M0,0 C-16,-22 -20,-30 -20,-40 A20,20 0 1,1 20,-40 C20,-30 16,-22 0,0Z" fill={C.accent} stroke="white" strokeWidth={3} />
            <circle cx={0} cy={-40} r={7} fill="white" />
          </g>
          <text x={b.x} y={b.y + 36} textAnchor="middle" fill="white" fontFamily={fontFamily} fontSize={26} fontWeight={900} opacity={drop}>
            {PLACES[to].name}
          </text>
        </svg>
        <div style={{ position: "absolute", left: 20, top: 14, fontFamily, fontWeight: 600, fontSize: 20, letterSpacing: 5, color: C.accent }}>SÉOUL 서울</div>
      </div>
    </AbsoluteFill>
  );
};

/* ======================= AUTOCOLLANT ANIMÉ ======================= */
const posStyle = (pos?: string): React.CSSProperties =>
  pos === "left"
    ? { justifyContent: "flex-start", alignItems: "flex-start", padding: "200px 0 0 140px" }
    : pos === "center"
      ? { justifyContent: "center", alignItems: "center" }
      : { justifyContent: "flex-start", alignItems: "flex-end", padding: "200px 140px 0 0" };

const Burst: React.FC<{ p: number; color: string }> = ({ p, color }) => (
  <svg width={420} height={420} style={{ position: "absolute", left: -210 + 70, top: -210 + 70 }} viewBox="-210 -210 420 420">
    {Array.from({ length: 10 }).map((_, i) => {
      const ang = (i / 10) * Math.PI * 2;
      const r1 = 70 + 80 * p;
      const r2 = 90 + 120 * p;
      return (
        <line key={i} x1={Math.cos(ang) * r1} y1={Math.sin(ang) * r1} x2={Math.cos(ang) * r2} y2={Math.sin(ang) * r2} stroke={color} strokeWidth={8} strokeLinecap="round" opacity={1 - p} />
      );
    })}
  </svg>
);

export const Sticker: React.FC<{ pop: Extract<Pop, { kind: "sticker" }> }> = ({ pop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = pop.dur * fps;
  const s = spring({ frame, fps, config: { damping: 8, mass: 0.6 } });
  const out = interpolate(frame, [D - 8, D], [1, 0], clamp);
  const burst = interpolate(frame, [2, 20], [0, 1], clamp);
  const wobble = Math.sin(frame / 6) * 4;
  const tilt = pop.pos === "left" ? -6 : 6;
  const color = pop.color ?? C.accent;
  return (
    <AbsoluteFill style={{ ...posStyle(pop.pos), opacity: out }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, transform: `scale(${s * out + 0.2 * (1 - out)}) rotate(${tilt + wobble * (1 - Math.min(1, frame / 40))}deg)` }}>
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <Burst p={burst} color={color} />
          <div style={{ position: "absolute", inset: 0, fontSize: 120, lineHeight: "140px", textAlign: "center", transform: `rotate(${wobble}deg)` }}>{pop.emoji}</div>
        </div>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 64, color: C.white, background: color, padding: "10px 30px", borderRadius: 18, boxShadow: "0 10px 0 rgba(0,0,0,.35), 0 18px 40px rgba(0,0,0,.35)", whiteSpace: "nowrap", border: "4px solid white" }}>
          {pop.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ======================= CONVERSION MONNAIE ======================= */
export const Money: React.FC<{ pop: Extract<Pop, { kind: "money" }> }> = ({ pop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = pop.dur * fps;
  const s = spring({ frame, fps, config: { damping: 13 } });
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const won = Math.round(interpolate(frame, [6, 30], [0, pop.won], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const eur = interpolate(frame, [26, 46], [0, pop.eur], { ...clamp, easing: Easing.out(Easing.cubic) });
  const arrow = interpolate(frame, [22, 32], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "190px 120px 0 0", opacity: out }}>
      <div style={{ fontFamily, display: "flex", alignItems: "center", gap: 26, background: "rgba(11,11,16,.85)", borderRadius: 28, padding: "26px 40px", border: `3px solid ${C.accent}`, transform: `translateY(${(1 - s) * -80}px)`, opacity: s, color: C.white }}>
        <div style={{ fontWeight: 900, fontSize: 80 }}>{won.toLocaleString("fr-FR")} ₩</div>
        <div style={{ fontWeight: 900, fontSize: 70, color: C.accent, transform: `scaleX(${arrow})` }}>→</div>
        <div style={{ fontWeight: 900, fontSize: 80, color: C.accent2, opacity: arrow }}>≈ {eur.toFixed(eur < 10 ? 0 : 0)} €</div>
      </div>
    </AbsoluteFill>
  );
};

/* ======================= TRAJET AÉROPORT → SÉOUL ======================= */
export const Route: React.FC<{ pop: Extract<Pop, { kind: "route" }> }> = ({ pop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = pop.dur * fps;
  const s = spring({ frame, fps, config: { damping: 15 } });
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const p = interpolate(frame, [14, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const W = 980;
  const pathD = `M 60 150 C 300 40, 620 260, ${W - 60} 110`;
  // point le long de la courbe de Bézier
  const bz = (t: number) => {
    const P = [
      [60, 150],
      [300, 40],
      [620, 260],
      [W - 60, 110],
    ];
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]);
  };
  const [tx, ty] = bz(p);
  const [tx2, ty2] = bz(Math.min(1, p + 0.01));
  const ang = (Math.atan2(ty2 - ty, tx2 - tx) * 180) / Math.PI;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 120, opacity: out }}>
      <div style={{ position: "relative", width: W, height: 330, background: "rgba(11,11,16,.85)", borderRadius: 30, border: "2px solid rgba(255,255,255,.15)", transform: `scale(${0.85 + 0.15 * s})`, opacity: s, fontFamily, color: C.white }}>
        <svg width={W} height={260} style={{ position: "absolute", top: 20 }}>
          <path d={pathD} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={8} strokeDasharray="4 14" strokeLinecap="round" />
          <path d={pathD} fill="none" stroke={C.accent} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
          <circle cx={60} cy={150} r={14} fill={C.accent2} />
          <circle cx={W - 60} cy={110} r={14} fill={p > 0.98 ? C.accent : "rgba(255,255,255,.4)"} />
          <text x={tx} y={ty} fontSize={56} textAnchor="middle" dominantBaseline="central" transform={`rotate(${ang} ${tx} ${ty})`}>
            🚆
          </text>
        </svg>
        <div style={{ position: "absolute", left: 30, bottom: 20, fontWeight: 800, fontSize: 30 }}>{pop.from}</div>
        <div style={{ position: "absolute", right: 30, bottom: 20, fontWeight: 800, fontSize: 30 }}>{pop.to}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center", fontWeight: 900, fontSize: 44 }}>
          <span style={{ color: C.accent }}>{Math.round(pop.km * p)} km</span> · {pop.time}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ======================= THERMOMÈTRE ======================= */
export const Thermo: React.FC<{ pop: Extract<Pop, { kind: "thermo" }> }> = ({ pop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = pop.dur * fps;
  const s = spring({ frame, fps, config: { damping: 12 } });
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const v = interpolate(frame, [8, 50], [15, pop.value], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fill = (v - 10) / 30;
  const shake = v >= pop.value - 0.5 ? Math.sin(frame * 1.8) * 3 : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: "160px 150px 0 0", opacity: out }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 24, transform: `scale(${s}) rotate(${shake}deg)`, fontFamily }}>
        <div style={{ position: "relative", width: 70, height: 360, borderRadius: 40, background: "rgba(255,255,255,.9)", border: "6px solid white", boxShadow: "0 16px 40px rgba(0,0,0,.4)" }}>
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, height: `${fill * 82}%`, borderRadius: 30, background: `linear-gradient(0deg, ${C.accent}, #FFB000)` }} />
          <div style={{ position: "absolute", left: -15, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: C.accent, border: "6px solid white" }} />
        </div>
        <div style={{ color: C.white, textShadow: "0 6px 24px rgba(0,0,0,.7)" }}>
          <div style={{ fontSize: 110 }}>☀️</div>
          <div style={{ fontWeight: 900, fontSize: 130, lineHeight: 1 }}>{Math.round(v)}°C</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ======================= NOTE EN ÉTOILES ======================= */
export const Rating: React.FC<{ pop: Extract<Pop, { kind: "rating" }> }> = ({ pop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = pop.dur * fps;
  const s = spring({ frame, fps, config: { damping: 14 } });
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const stars = 5;
  const score = (pop.value / pop.max) * stars;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 150, opacity: out }}>
      <div style={{ fontFamily, textAlign: "center", color: C.white, background: "rgba(11,11,16,.85)", borderRadius: 30, padding: "26px 50px", transform: `translateY(${(1 - s) * -100}px)`, border: `3px solid ${C.accent}` }}>
        <div style={{ fontWeight: 600, fontSize: 30, letterSpacing: 6, color: C.accent }}>{pop.label}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "8px 0" }}>
          {Array.from({ length: stars }).map((_, i) => {
            const st = spring({ frame: frame - 10 - i * 5, fps, config: { damping: 9 } });
            const part = Math.max(0, Math.min(1, score - i));
            return (
              <div key={i} style={{ position: "relative", fontSize: 90, transform: `scale(${st})` }}>
                <span style={{ color: "rgba(255,255,255,.2)" }}>★</span>
                <span style={{ position: "absolute", left: 0, top: 0, width: `${part * 100}%`, overflow: "hidden", color: "#FFC83D" }}>★</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontWeight: 900, fontSize: 90, lineHeight: 1 }}>
          {Math.round(interpolate(frame, [10, 40], [0, pop.value], clamp))}
          <span style={{ fontSize: 50, opacity: 0.7 }}>/{pop.max}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ======================= BOUTON S'ABONNER ======================= */
export const Subscribe: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = dur * fps;
  const s = spring({ frame, fps, config: { damping: 14 } });
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  const cx = interpolate(frame, [16, 40], [380, 0], { ...clamp, easing: ease });
  const cy = interpolate(frame, [16, 40], [200, 0], { ...clamp, easing: ease });
  const click = frame >= 44;
  const press = interpolate(frame, [42, 44, 50], [1, 0.9, 1], clamp);
  const bell = click ? Math.sin((frame - 44) * 0.9) * 18 * Math.max(0, 1 - (frame - 44) / 30) : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 250px 110px", opacity: out }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, transform: `translateX(${(1 - s) * -500}px)`, fontFamily }}>
        <div style={{ fontWeight: 800, fontSize: 46, padding: "18px 40px", borderRadius: 60, background: click ? "#303036" : "#FF0033", color: C.white, transform: `scale(${press})`, boxShadow: "0 14px 40px rgba(0,0,0,.45)" }}>
          {click ? "Abonné ✓" : "S'abonner"}
        </div>
        <div style={{ fontSize: 64, transform: `rotate(${bell}deg)`, transformOrigin: "50% 10%", opacity: click ? 1 : 0.4 }}>🔔</div>
        <div style={{ position: "absolute", left: 150 + cx, top: 40 + cy, fontSize: 70, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.5))" }}>👆</div>
      </div>
    </AbsoluteFill>
  );
};

export const PopView: React.FC<{ pop: Pop }> = ({ pop }) => {
  switch (pop.kind) {
    case "sticker":
      return <Sticker pop={pop} />;
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
