import { loadFont } from "@remotion/google-fonts/Montserrat";

// Style « vlog voyage YouTube classique » : Montserrat gras, blanc + contour noir, accent jaune.
export const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
export const sans = fontFamily;
export const serif = fontFamily;

export const C = {
  accent: "#FFD400", // jaune YouTube vlog
  accent2: "#FF3B30", // rouge (épingle, trajet)
  white: "#FFFFFF",
  black: "#111111",
  dim: "rgba(255,255,255,.8)",
};

// texte blanc avec contour noir (lisible sur n'importe quel plan)
export const outline: React.CSSProperties = {
  color: C.white,
  WebkitTextStroke: "0",
  textShadow: [
    "3px 3px 0 #000", "-3px 3px 0 #000", "3px -3px 0 #000", "-3px -3px 0 #000",
    "0 3px 0 #000", "0 -3px 0 #000", "3px 0 0 #000", "-3px 0 0 #000",
    "0 8px 20px rgba(0,0,0,.45)",
  ].join(","),
};

export const caps: React.CSSProperties = {
  fontFamily,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};
