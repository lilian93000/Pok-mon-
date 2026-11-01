import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, Rays, serif } from "./Episode";

// Photo de profil TikTok (1080×1080, lisible dans le rond)
export const Avatar: React.FC<{ image: string; variant: "buste" | "piece" }> = ({ image, variant }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #B32A22 0%, ${C.red} 45%, ${C.redDark} 100%)`, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, transform: "translateY(-260px)" }}>
      <Rays color="rgba(255,200,130,.28)" />
    </div>
    <div style={{ position: "absolute", top: 34, left: 34, right: 34, bottom: 34, border: `20px solid ${C.gold}`, borderRadius: "50%", boxShadow: "inset 0 0 60px rgba(0,0,0,.5), 0 0 30px rgba(0,0,0,.4)" }} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: variant === "buste" ? "flex-end" : "center" }}>
      <Img
        src={staticFile(image)}
        style={
          variant === "buste"
            ? { height: 900, marginBottom: 40, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.7)) contrast(1.1)" }
            : { width: 560, marginTop: -150, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.7))" }
        }
      />
    </AbsoluteFill>
    {variant === "piece" && (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 190 }}>
        <div style={{ fontFamily: serif, fontWeight: 900, fontSize: 84, color: C.gold, letterSpacing: "0.06em", textShadow: "0 6px 20px rgba(0,0,0,.7)" }}>
          1 JOUR · 1 FAIT
        </div>
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
