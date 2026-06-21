"use client";

import { useEffect, useState } from "react";
import { FolderOpen, FileCheck2, Clock, MapPin, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  FORMULE_LABEL,
  TYPE_BIEN_LABEL,
  formatDate,
} from "@/lib/dossier";
import { getClientDossiers, type ClientDossier } from "@/lib/clientDossiers";

export function DashboardDossiers() {
  const [dossiers, setDossiers] = useState<ClientDossier[] | null>(null);

  useEffect(() => {
    setDossiers(getClientDossiers());
  }, []);

  // Pendant le chargement initial (avant lecture du navigateur)
  const list = dossiers ?? [];
  const total = list.length;
  const enCours = list.filter((d) =>
    ["ANALYSE_EN_COURS", "DOCUMENTS_RECUS", "ANALYSE_TERMINEE", "NOUVEAU"].includes(
      d.statut
    )
  ).length;
  const livres = list.filter((d) => d.statut === "RAPPORT_LIVRE").length;

  const stats = [
    { label: "Dossiers", value: total, icon: FolderOpen },
    { label: "En cours", value: enCours, icon: Clock },
    { label: "Rapports livrés", value: livres, icon: FileCheck2 },
  ];

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-3xl border border-brand/10 bg-surface p-5 shadow-card"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-soft text-brand">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tightest text-foreground">
                {s.value}
              </p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Liste des dossiers */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">Mes dossiers</h2>

        {total === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand/20 bg-surface p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-soft text-brand">
              <FolderOpen className="h-6 w-6" />
            </div>
            <p className="font-semibold text-foreground">
              Aucun dossier pour le moment
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              Lancez votre première analyse de copropriété en quelques minutes.
            </p>
            <Button href="/dashboard/nouveau" size="sm" className="mt-5">
              <FilePlus2 className="h-4 w-4" />
              Nouveau dossier
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((d) => (
              <div
                key={d.id}
                className="flex flex-col gap-4 rounded-3xl border border-brand/10 bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-soft text-brand">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {d.adresse}, {d.ville}
                    </p>
                    <p className="text-sm text-muted">
                      {TYPE_BIEN_LABEL[d.typeBien]} · Formule{" "}
                      {FORMULE_LABEL[d.formule]} · {formatDate(d.createdAt)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {d.documents.length} document
                      {d.documents.length > 1 ? "s" : ""} · {d.total} €
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-15 sm:pl-0">
                  <StatusBadge statut={d.statut} />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-muted/70">
          Vos dossiers sont enregistrés sur cet appareil. Une copie de chaque
          demande est transmise à notre équipe, qui vous recontacte par email.
        </p>
      </div>
    </div>
  );
}
