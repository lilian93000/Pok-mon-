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
  neutral: { dot: "bg-slate", badge: "bg-slate/10 text-slate" },
  info: { dot: "bg-brand-bright", badge: "bg-brand-soft text-brand-dark" },
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

/** Jeu de données de démonstration (en attendant la connexion DB). */
export const DOSSIERS_DEMO: DossierDemo[] = [
  {
    id: "dos_8f3a",
    adresse: "12 rue des Lilas",
    ville: "Lyon",
    codePostal: "69003",
    typeBien: "APPARTEMENT",
    formule: "PREMIUM",
    statut: "RAPPORT_LIVRE",
    prixHT: 249,
    scoreFinal: 8.4,
    criteria: {
      finances: 8.5,
      travaux: 8,
      gestion: 8.8,
      contentieux: 9,
      impayes: 7.5,
      energie: 7.8,
      transparence: 9.2,
    },
    createdAt: "2026-05-28",
    documents: [
      { nom: "PV AG 2025.pdf", type: "PV_AG", poids: 2_400_000 },
      { nom: "Pré-état daté.pdf", type: "PRE_ETAT_DATE", poids: 1_100_000 },
      { nom: "Règlement copro.pdf", type: "REGLEMENT", poids: 3_800_000 },
    ],
  },
  {
    id: "dos_2b9c",
    adresse: "5 avenue Victor Hugo",
    ville: "Bordeaux",
    codePostal: "33000",
    typeBien: "APPARTEMENT",
    formule: "INVESTISSEUR",
    statut: "ANALYSE_EN_COURS",
    prixHT: 349,
    createdAt: "2026-06-12",
    documents: [
      { nom: "PV AG 2024.pdf", type: "PV_AG", poids: 2_100_000 },
      { nom: "Annexes comptables.pdf", type: "ANNEXE_COMPTABLE", poids: 900_000 },
    ],
  },
  {
    id: "dos_5d1e",
    adresse: "8 place du Marché",
    ville: "Nantes",
    codePostal: "44000",
    typeBien: "APPARTEMENT",
    formule: "ESSENTIEL",
    statut: "DOCUMENTS_INCOMPLETS",
    prixHT: 149,
    createdAt: "2026-06-16",
    documents: [{ nom: "PV AG 2025.pdf", type: "PV_AG", poids: 1_800_000 }],
  },
];

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
