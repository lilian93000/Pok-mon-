/**
 * Logique métier centrale : le AnalyseTaCopro Score.
 *
 * Note globale sur 10, calculée à partir de 7 sous-critères notés chacun
 * sur 10 et pondérés. Cette fonction est réutilisable côté front ET back.
 */

export type CriteriaKey =
  | "finances"
  | "travaux"
  | "gestion"
  | "contentieux"
  | "impayes"
  | "energie"
  | "transparence";

/** Notes des 7 critères, chacune sur 10. */
export type ScoreCriteria = Record<CriteriaKey, number>;

/** Pondération de chaque critère (somme = 1). */
export const CRITERIA_WEIGHTS: Record<CriteriaKey, number> = {
  finances: 0.25,
  travaux: 0.2,
  gestion: 0.15,
  contentieux: 0.15,
  impayes: 0.1,
  energie: 0.1,
  transparence: 0.05,
};

/** Métadonnées d'affichage de chaque critère (libellé + poids en %). */
export const CRITERIA_META: Record<
  CriteriaKey,
  { label: string; weightPct: number }
> = {
  finances: { label: "Finances", weightPct: 25 },
  travaux: { label: "Travaux", weightPct: 20 },
  gestion: { label: "Gestion", weightPct: 15 },
  contentieux: { label: "Contentieux", weightPct: 15 },
  impayes: { label: "Impayés", weightPct: 10 },
  energie: { label: "Énergie", weightPct: 10 },
  transparence: { label: "Transparence", weightPct: 5 },
};

export const CRITERIA_ORDER: CriteriaKey[] = [
  "finances",
  "travaux",
  "gestion",
  "contentieux",
  "impayes",
  "energie",
  "transparence",
];

/** Borne une valeur dans l'intervalle [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Calcule le AnalyseTaCopro Score (sur 10) à partir des 7 notes.
 * Chaque note est bornée à [0, 10]. Résultat arrondi à une décimale.
 */
export function calculateScore(criteria: ScoreCriteria): number {
  const total = CRITERIA_ORDER.reduce((sum, key) => {
    const note = clamp(criteria[key] ?? 0, 0, 10);
    return sum + note * CRITERIA_WEIGHTS[key];
  }, 0);
  return Math.round(total * 10) / 10;
}

export type RiskLevel = {
  /** Identifiant machine. */
  id: "excellente" | "bonne" | "acceptable" | "risquee" | "tres-risquee";
  /** Verdict affiché. */
  label: string;
  /** Couleur associée (hex). */
  color: string;
  /** Token de couleur de marque (classes Tailwind). */
  token: "success" | "success-soft" | "amber" | "orange" | "danger";
};

/** Renvoie le niveau de risque (verdict + couleur) correspondant à un score. */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 8)
    return { id: "excellente", label: "Excellente", color: "#12B981", token: "success" };
  if (score >= 6)
    return { id: "bonne", label: "Bonne", color: "#34D399", token: "success-soft" };
  if (score >= 4)
    return { id: "acceptable", label: "Acceptable", color: "#F5A524", token: "amber" };
  if (score >= 2)
    return { id: "risquee", label: "Risquée", color: "#FB923C", token: "orange" };
  return { id: "tres-risquee", label: "Très risquée", color: "#EF4444", token: "danger" };
}
