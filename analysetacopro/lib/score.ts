/**
 * AnalyseTaCopro Score — logique métier centrale.
 *
 * Note globale sur 10, calculée à partir de 7 sous-critères notés
 * chacun sur 10 et pondérés. Fonction réutilisable front + back.
 *
 *   score = Σ (note_critère × poids_critère)
 */

export type CriterionKey =
  | "finances"
  | "travaux"
  | "gestion"
  | "contentieux"
  | "impayes"
  | "energie"
  | "transparence";

export type ScoreCriteria = Record<CriterionKey, number>;

export interface CriterionMeta {
  key: CriterionKey;
  label: string;
  /** Poids exprimé en fraction (la somme vaut 1). */
  weight: number;
  description: string;
}

/** Les 7 critères et leur pondération (total = 100%). */
export const CRITERIA: CriterionMeta[] = [
  {
    key: "finances",
    label: "Finances",
    weight: 0.25,
    description: "Trésorerie, fonds travaux, budget prévisionnel.",
  },
  {
    key: "travaux",
    label: "Travaux",
    weight: 0.2,
    description: "Travaux votés, à venir, état du bâti.",
  },
  {
    key: "gestion",
    label: "Gestion",
    weight: 0.15,
    description: "Qualité du syndic, suivi, réactivité.",
  },
  {
    key: "contentieux",
    label: "Contentieux",
    weight: 0.15,
    description: "Litiges, procédures en cours.",
  },
  {
    key: "impayes",
    label: "Impayés",
    weight: 0.1,
    description: "Dettes des copropriétaires, recouvrement.",
  },
  {
    key: "energie",
    label: "Énergie",
    weight: 0.1,
    description: "Performance énergétique, passoires thermiques.",
  },
  {
    key: "transparence",
    label: "Transparence",
    weight: 0.05,
    description: "Clarté et complétude des documents.",
  },
];

export type RiskLevel = {
  label: string;
  min: number;
  max: number;
  /** Token de couleur sémantique. */
  tone: "excellent" | "good" | "ok" | "risky" | "danger";
  hex: string;
};

/** Niveaux de risque (verdict + couleur). */
export const RISK_LEVELS: RiskLevel[] = [
  { label: "Excellente", min: 8.0, max: 10, tone: "excellent", hex: "#12B981" },
  { label: "Bonne", min: 6.0, max: 7.9, tone: "good", hex: "#3FBF7F" },
  { label: "Acceptable", min: 4.0, max: 5.9, tone: "ok", hex: "#F5A524" },
  { label: "Risquée", min: 2.0, max: 3.9, tone: "risky", hex: "#F97316" },
  { label: "Très risquée", min: 0, max: 1.9, tone: "danger", hex: "#EF4444" },
];

/** Renvoie le niveau de risque correspondant à un score /10. */
export function getRiskLevel(score: number): RiskLevel {
  const s = clamp(score, 0, 10);
  return (
    RISK_LEVELS.find((lvl) => s >= lvl.min && s <= lvl.max + 0.0001) ??
    RISK_LEVELS[RISK_LEVELS.length - 1]
  );
}

/** Borne une valeur dans [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Calcule le score global pondéré à partir des 7 notes /10.
 * Les notes manquantes sont traitées comme 0.
 */
export function calculateScore(criteria: Partial<ScoreCriteria>): number {
  const total = CRITERIA.reduce((acc, c) => {
    const note = clamp(criteria[c.key] ?? 0, 0, 10);
    return acc + note * c.weight;
  }, 0);
  // Arrondi à une décimale.
  return Math.round(total * 10) / 10;
}

/** Exemple de copropriété (note vitrine 8.4/10) pour les démos. */
export const EXAMPLE_CRITERIA: ScoreCriteria = {
  finances: 8.5,
  travaux: 8.0,
  gestion: 8.8,
  contentieux: 9.0,
  impayes: 7.5,
  energie: 7.8,
  transparence: 9.2,
};
