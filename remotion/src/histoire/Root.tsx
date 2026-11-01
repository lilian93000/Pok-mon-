import { Composition, staticFile } from "remotion";
import { Episode } from "./Episode";
import { Avatar } from "./Avatar";
import type { Props } from "./types";

const empty: Props = { id: "001-vespasien", fps: 30, duration: 10, audio: null, words: [], beats: [] };

export const HistoireRoot: React.FC = () => (
  <>
  <Composition id="AvatarBuste" component={Avatar} width={1080} height={1080} fps={30} durationInFrames={1}
    defaultProps={{ image: "histoire/001-vespasien/img/head.png", variant: "buste" as const }} />
  <Composition id="AvatarPiece" component={Avatar} width={1080} height={1080} fps={30} durationInFrames={1}
    defaultProps={{ image: "histoire/001-vespasien/img/vesp.png", variant: "piece" as const }} />
  <Composition
    id="Histoire"
    component={Episode}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={empty}
    // Charge public/histoire/<id>/props.json (produit par tools/histoire/build.py)
    calculateMetadata={async ({ props }) => {
      const p: Props = props.words.length
        ? props
        : await fetch(staticFile(`histoire/${props.id}/props.json`)).then((r) => r.json());
      return { props: p, durationInFrames: Math.ceil(p.duration * p.fps), fps: p.fps };
    }}
  />
  </>
);
