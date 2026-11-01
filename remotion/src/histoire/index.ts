import { registerRoot } from "remotion";
import { HistoireRoot } from "./Root";

// Point d'entrée séparé du vlog : npx remotion render src/histoire/index.ts Histoire ...
registerRoot(HistoireRoot);
