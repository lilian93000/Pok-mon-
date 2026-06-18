import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "light" | "success";
}

export function Badge({ children, className, tone = "brand" }: BadgeProps) {
  const tones = {
    brand: "bg-brand/10 text-brand",
    light: "bg-white/10 text-white border border-white/15",
    success: "bg-success/10 text-success",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
