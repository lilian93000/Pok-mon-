import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Clip } from "./Clip";
import { ChapterTitle, MotionIntro, PopView, SeoulMap } from "./Motion";
import { Captions, ChapterBar, EndScreen, TipCard } from "./Overlays";
import type { Edit } from "./types";

export const Vlog: React.FC<{ edit: Edit; overlayOnly?: boolean }> = ({ edit, overlayOnly }) => {
  const { fps } = useVideoConfig();
  let cursor = 0;
  const clips = edit.segments.map((seg, i) => {
    const len = Math.round((seg.to - seg.from) * fps);
    const el = (
      <Sequence key={i} from={cursor} durationInFrames={len} premountFor={fps}>
        <Clip src={edit.src} seg={seg} durationInFrames={len} />
      </Sequence>
    );
    cursor += len;
    return el;
  });
  const endFrom = Math.round(edit.endScreenAt * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: overlayOnly ? "transparent" : "black" }}>
      {overlayOnly ? null : clips}
      {/* en mode calque, sous-titres et barre de chapitres sont gravés par ffmpeg (plus rapide) */}
      {overlayOnly ? null : <Captions pages={edit.captions} />}
      {overlayOnly ? null : <ChapterBar chapters={edit.chapters} duration={edit.duration} endAt={edit.endScreenAt} />}
      {edit.chapters.map((ch) => (
        <Sequence key={ch.n} from={Math.round((ch.at + 0.3) * fps)} durationInFrames={Math.round(4.6 * fps)}>
          <ChapterTitle ch={ch} total={edit.chapters.length} dur={4.6} />
        </Sequence>
      ))}
      {edit.chapters.map((ch) =>
        ch.map ? (
          <Sequence key={`map${ch.n}`} from={Math.round((ch.at + 1.2) * fps)} durationInFrames={Math.round(4.8 * fps)}>
            <SeoulMap from={ch.mapFrom} to={ch.map} dur={4.8} />
          </Sequence>
        ) : null,
      )}
      {edit.titles.map((t, i) => (
        <Sequence key={i} from={Math.round(t.at * fps)} durationInFrames={Math.round(t.dur * fps)}>
          <MotionIntro text={t.text} sub={t.sub ?? ""} dur={t.dur} />
        </Sequence>
      ))}
      {edit.pops.map((p, i) => (
        <Sequence key={`pop${i}`} from={Math.round(p.at * fps)} durationInFrames={Math.round(p.dur * fps)}>
          <PopView pop={p} />
        </Sequence>
      ))}
      {edit.tips.map((t, i) => (
        <Sequence key={`tip${i}`} from={Math.round(t.at * fps)} durationInFrames={Math.round(t.dur * fps)}>
          <TipCard tip={t} />
        </Sequence>
      ))}
      <Sequence from={endFrom}>
        <EndScreen text="Le Japon" sub="Prochain épisode" />
      </Sequence>
    </AbsoluteFill>
  );
};
