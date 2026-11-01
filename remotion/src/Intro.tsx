import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = { title: string; subtitle: string };

export const Intro: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12 } });
  const subOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const spin = interpolate(frame, [0, durationInFrames], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 40%, #4fc3f7, #1a237e)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial Black, sans-serif",
        opacity: fadeOut,
      }}
    >
      {/* Polkaball */}
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          border: "14px solid #111",
          background: "linear-gradient(#e53935 0 50%, #fff 50% 100%)",
          transform: `scale(${pop}) rotate(${spin}deg)`,
          position: "relative",
          marginBottom: 50,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 60,
            height: 60,
            margin: -30,
            borderRadius: "50%",
            background: "#fff",
            border: "12px solid #111",
            boxSizing: "border-box",
          }}
        />
      </div>
      <h1
        style={{
          fontSize: 150,
          margin: 0,
          color: "#ffd600",
          WebkitTextStroke: "6px #0d47a1",
          transform: `scale(${pop})`,
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 56, color: "#fff", opacity: subOpacity, margin: 20 }}>{subtitle}</p>
    </AbsoluteFill>
  );
};
