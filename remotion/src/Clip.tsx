import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Segment } from "./types";

const FADE = 3; // images de fondu audio à chaque coupe (évite les « clics »)

export const Clip: React.FC<{ src: string; seg: Segment; durationInFrames: number }> = ({ src, seg, durationInFrames }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const trimBefore = Math.round(seg.from * fps);
  const trimAfter = Math.round(seg.to * fps);
  const base = seg.volume ?? 1;
  const volume = (f: number) =>
    base * Math.min(1, f / FADE, (durationInFrames - f) / FADE);
  // léger « Ken Burns » pour donner du mouvement aux plans fixes
  const zoom = seg.zoom ?? 1;
  const scale = interpolate(frame, [0, durationInFrames], [zoom, zoom * 1.03]);
  const video = (style: React.CSSProperties, muted = false) => (
    <OffthreadVideo
      src={staticFile(src)}
      trimBefore={trimBefore}
      trimAfter={trimAfter}
      volume={muted ? 0 : volume}
      muted={muted}
      style={style}
    />
  );

  if (seg.vertical) {
    // la source contient un clip 9:16 au centre avec des bandes noires :
    // fond = même image très zoomée + floutée, premier plan = clip centré net
    return (
      <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
        {video({ width: "100%", height: "100%", objectFit: "cover", transform: "scale(3.4)", filter: "blur(40px) brightness(0.55)" }, true)}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ height: "100%", aspectRatio: "9 / 16", overflow: "hidden", position: "relative", boxShadow: "0 0 80px rgba(0,0,0,.6)" }}>
            {video({ position: "absolute", height: "100%", left: "50%", transform: "translateX(-50%)" })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      {video({ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` })}
    </AbsoluteFill>
  );
};
