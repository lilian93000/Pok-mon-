import { Composition, registerRoot } from "remotion";
import { Ciel, type CielData } from "./Ciel";
import ciel from "./data/ciel.json";

const c = ciel as unknown as CielData;

// Point d'entrée séparé : npx remotion render src/CielRoot.tsx TiktokCiel
const CielRoot: React.FC = () => (
  <Composition
    id="TiktokCiel"
    component={Ciel}
    durationInFrames={Math.ceil(c.duration * c.fps)}
    fps={c.fps}
    width={1080}
    height={1920}
    defaultProps={{ data: c }}
  />
);

registerRoot(CielRoot);
