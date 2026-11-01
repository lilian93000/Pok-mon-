import { Composition } from "remotion";
import { Thumbnail } from "./Thumbnail";
import { Vlog } from "./Vlog";
import edit from "./data/coree.json";
import type { Edit } from "./types";

const e = edit as Edit;

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Coree"
    component={Vlog}
    durationInFrames={Math.round(e.duration * e.fps)}
    fps={e.fps}
    width={1920}
    height={1080}
    defaultProps={{ edit: e }}
  />
  {/* Calque transparent (titres, sous-titres, chapitres) posé par ffmpeg sur le montage */}
  <Composition
    id="CoreeOverlay"
    component={Vlog}
    durationInFrames={Math.round(e.duration * e.fps)}
    fps={e.fps}
    width={1920}
    height={1080}
    defaultProps={{ edit: e, overlayOnly: true }}
  />
  <Composition
    id="CoreeMiniature"
    component={Thumbnail}
    durationInFrames={1}
    fps={30}
    width={1280}
    height={720}
    defaultProps={{ image: "thumb.jpg", line1: "5 JOURS", line2: "EN CORÉE", tag: "🇰🇷 Séoul · guide inclus" }}
  />
  </>
);
