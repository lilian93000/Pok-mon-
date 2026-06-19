import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Tokens sémantiques (basculent en mode clair/sombre via CSS vars)
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-soft": "rgb(var(--surface-soft) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        // Brand — AnalyseTaCopro
        brand: {
          DEFAULT: "#0B5FFF", // bleu principal (signature)
          dark: "#0A3D9E", // bleu foncé
          night: "#061A4A", // bleu nuit (fonds sombres)
          soft: "#E8F0FF", // bleu clair (fonds doux)
          bright: "#4D8BFF", // bleu lumineux (accent dégradé)
        },
        ink: "#0C1424", // texte principal
        slate: {
          DEFAULT: "#5A6577", // texte secondaire
        },
        success: "#12B981",
        amber: "#F5A524",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.02em",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(11, 95, 255, 0.18)",
        "soft-lg": "0 24px 60px -20px rgba(11, 95, 255, 0.28)",
        card: "0 2px 8px -2px rgba(12, 20, 36, 0.06), 0 12px 32px -12px rgba(11, 95, 255, 0.12)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #0B5FFF 0%, #4D8BFF 100%)",
        "brand-gradient-dark":
          "linear-gradient(135deg, #061A4A 0%, #0A3D9E 60%, #0B5FFF 100%)",
        "hero-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(77,139,255,0.25) 0%, rgba(11,95,255,0) 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.8s ease both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
