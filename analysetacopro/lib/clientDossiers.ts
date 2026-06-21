/**
 * Stockage local des dossiers du client (dans son navigateur).
 *
 * Le site étant 100 % statique (sans base de données), les demandes faites
 * par un visiteur sont mémorisées dans le localStorage de SON appareil.
 * Chaque client ne voit donc que ses propres dossiers, et la copie réelle
 * de la commande est envoyée au gérant par email (Web3Forms).
 */

import type { Formule, StatutDossier, TypeBien } from "./dossier";

const STORAGE_KEY = "atc_dossiers";

export interface ClientDossier {
  id: string;
  adresse: string;
  ville: string;
  codePostal: string;
  typeBien: TypeBien;
  formule: Formule;
  formuleName: string;
  total: number;
  urgence: boolean;
  documents: { name: string; size: number }[];
  statut: StatutDossier;
  createdAt: string;
}

/** Lit les dossiers enregistrés sur cet appareil. */
export function getClientDossiers(): ClientDossier[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ClientDossier[]) : [];
  } catch {
    return [];
  }
}

/** Ajoute un dossier en tête de liste et le sauvegarde. */
export function addClientDossier(d: ClientDossier): void {
  if (typeof window === "undefined") return;
  try {
    const all = getClientDossiers();
    all.unshift(d);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* stockage indisponible : on ignore silencieusement */
  }
}

/** Identifiant court et lisible pour un nouveau dossier. */
export function newDossierId(): string {
  return `dos_${Math.random().toString(36).slice(2, 6)}`;
}
