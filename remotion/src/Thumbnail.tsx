import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, fontFamily } from "./theme";

// Miniature YouTube 1280x720 : photo + gros titre dans le ciel
export const Thumbnail: React.FC<{ image: string; line1: string; line2: string; tag: string }> = ({ image, line1, line2, tag }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    {/* fond flou + photo descendue pour libérer le ciel au-dessus des visages */}
    <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) saturate(1.2)", transform: "scale(1.1)" }} />
    <Img src={staticFile(image)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.25) contrast(1.08)", transform: "translateY(150px)", maskImage: "linear-gradient(180deg, transparent 0, #000 90px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 45%)" }} />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 26, fontFamily, textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 104, lineHeight: 0.95, color: C.white, letterSpacing: -2, textShadow: "0 6px 0 #000, 0 10px 30px rgba(0,0,0,.6)" }}>
        {line1}
      </div>
      <div style={{ fontWeight: 900, fontSize: 104, lineHeight: 0.95, color: C.accent, letterSpacing: -2, textShadow: "0 6px 0 #000, 0 10px 30px rgba(0,0,0,.6)" }}>
        {line2}
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: 30 }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 40, background: C.accent, color: C.white, padding: "10px 26px", borderRadius: 14, transform: "rotate(-3deg)", boxShadow: "0 8px 24px rgba(0,0,0,.45)" }}>
        {tag}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
