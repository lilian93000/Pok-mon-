import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Couleur de la colonne. */
  variant?: "light" | "dark";
  withText?: boolean;
}

/** Logo AnalyseTaCopro — colonne antique stylisée. */
export function Logo({ className, variant = "dark", withText = true }: LogoProps) {
  const color = variant === "light" ? "#FFFFFF" : "#0B5FFF";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Chapiteau */}
        <rect x="10" y="9" width="28" height="5" rx="2.5" fill={color} />
        <rect x="13" y="14" width="22" height="3" rx="1.5" fill={color} opacity="0.85" />
        {/* Fûts cannelés */}
        <rect x="15" y="18" width="3.5" height="22" rx="1.75" fill={color} />
        <rect x="22.25" y="18" width="3.5" height="22" rx="1.75" fill={color} />
        <rect x="29.5" y="18" width="3.5" height="22" rx="1.75" fill={color} />
        {/* Base */}
        <rect x="12" y="40" width="24" height="4" rx="2" fill={color} />
      </svg>
      {withText && (
        <span
          className={cn(
            "text-lg font-extrabold tracking-tightest",
            variant === "light" ? "text-white" : "text-foreground"
          )}
        >
          AnalyseTa<span className="text-brand">Copro</span>
        </span>
      )}
    </span>
  );
}
