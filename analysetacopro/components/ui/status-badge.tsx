import {
  STATUT_META,
  STATUT_TONE_CLASSES,
  type StatutDossier,
} from "@/lib/dossier";
import { cn } from "@/lib/utils";

export function StatusBadge({ statut }: { statut: StatutDossier }) {
  const meta = STATUT_META[statut];
  const tone = STATUT_TONE_CLASSES[meta.tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tone.badge
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
      {meta.label}
    </span>
  );
}
