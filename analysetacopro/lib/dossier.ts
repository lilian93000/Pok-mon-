/** Métadonnées et helpers pour les dossiers (statuts, types, démo). */

import type { ScoreCriteria } from "./score";

export type StatutDossier =
  | "NOUVEAU"
  | "DOCUMENTS_RECUS"
  | "DOCUMENTS_INCOMPLETS"
  | "ANALYSE_EN_COURS"
  | "ANALYSE_TERMINEE"
  | "RAPPORT_LIVRE"
  | "CLOTURE";

export type TypeBien = "APPARTEMENT" | "LOCAL" | "PARKING";

export type Formule = "ESSENTIEL" | "PREMIUM" | "INVESTISSEUR";

export type TypeDoc =
  | "PV_AG"
  | "PRE_ETAT_DATE"
  | "CARNET_ENTRETIEN"
  | "REGLEMENT"
  | "DIAGNOSTIC"
  | "ANNEXE_COMPTABLE"
  | "AUTRE";

export const STATUT_META: Record<
  StatutDossier,
  { label: string; tone: "neutral" | "info" | "warn" | "progress" | "success" }
> = {
  NOUVEAU: { label: "Nouveau", tone: "neutral" },
  DOCUMENTS_RECUS: { label: "Documents reçus", tone: "info" },
  DOCUMENTS_INCOMPLETS: { label: "Documents incomplets", tone: "warn" },
  ANALYSE_EN_COURS: { label: "Analyse en cours", tone: "progress" },
  ANALYSE_TERMINEE: { label: "Analyse terminée", tone: "progress" },
  RAPPORT_LIVRE: { label: "Rapport livré", tone: "success" },
  CLOTURE: { label: "Clôturé", tone: "neutral" },
};

export const STATUT_TONE_CLASSES: Record<
  string,
  { dot: string; badge: string }
> = {
  neutral: { dot: "bg-muted", badge: "bg-muted/10 text-muted" },
  info: { dot: "bg-brand-bright", badge: "bg-surface-soft text-brand-dark" },
  warn: { dot: "bg-amber", badge: "bg-amber/10 text-amber" },
  progress: { dot: "bg-brand", badge: "bg-brand/10 text-brand" },
  success: { dot: "bg-success", badge: "bg-success/10 text-success" },
};

/** Ordre du cycle de vie d'un dossier (pour la barre de progression). */
export const STATUT_FLOW: StatutDossier[] = [
  "NOUVEAU",
  "DOCUMENTS_RECUS",
  "ANALYSE_EN_COURS",
  "ANALYSE_TERMINEE",
  "RAPPORT_LIVRE",
];

export const TYPE_BIEN_LABEL: Record<TypeBien, string> = {
  APPARTEMENT: "Appartement",
  LOCAL: "Local commercial",
  PARKING: "Parking / Box",
};

export const FORMULE_LABEL: Record<Formule, string> = {
  ESSENTIEL: "Essentiel",
  PREMIUM: "Premium",
  INVESTISSEUR: "Investisseur",
};

export const TYPE_DOC_LABEL: Record<TypeDoc, string> = {
  PV_AG: "PV d'assemblée générale",
  PRE_ETAT_DATE: "Pré-état daté",
  CARNET_ENTRETIEN: "Carnet d'entretien",
  REGLEMENT: "Règlement de copropriété",
  DIAGNOSTIC: "Diagnostic / DPE",
  ANNEXE_COMPTABLE: "Annexe comptable",
  AUTRE: "Autre document",
};

export interface DossierDemo {
  id: string;
  adresse: string;
  ville: string;
  codePostal: string;
  typeBien: TypeBien;
  formule: Formule;
  statut: StatutDossier;
  prixHT: number;
  scoreFinal?: number;
  criteria?: ScoreCriteria;
  createdAt: string;
  documents: { nom: string; type: TypeDoc; poids: number }[];
}

/**
 * Liste des dossiers affichés dans l'espace privé.
 * Vide : aucune donnée fictive n'est montrée aux visiteurs. Les commandes
 * réelles sont reçues par email (voir DossierWizard / Web3Forms).
 */
export const DOSSIERS_DEMO: DossierDemo[] = [];

/** Formate un poids en octets vers une chaîne lisible. */
export function formatPoids(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/** Formate une date ISO (YYYY-MM-DD) en français. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
