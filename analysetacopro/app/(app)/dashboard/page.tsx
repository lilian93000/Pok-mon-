import Link from "next/link";
import {
  FilePlus2,
  FolderOpen,
  FileCheck2,
  Clock,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Topbar } from "@/components/ui/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DOSSIERS_DEMO,
  FORMULE_LABEL,
  TYPE_BIEN_LABEL,
  formatDate,
} from "@/lib/dossier";
import { getRiskLevel } from "@/lib/score";

export default function DashboardPage() {
  const total = DOSSIERS_DEMO.length;
  const enCours = DOSSIERS_DEMO.filter((d) =>
    ["ANALYSE_EN_COURS", "DOCUMENTS_RECUS", "ANALYSE_TERMINEE"].includes(
      d.statut
    )
  ).length;
  const livres = DOSSIERS_DEMO.filter((d) => d.statut === "RAPPORT_LIVRE")
    .length;

  const stats = [
    { label: "Dossiers", value: total, icon: FolderOpen },
    { label: "En cours", value: enCours, icon: Clock },
    { label: "Rapports livrés", value: livres, icon: FileCheck2 },
  ];

  return (
    <>
      <Topbar
        title="Tableau de bord"
        subtitle="Suivez vos analyses de copropriété en un coup d'œil."
        action={
          <Button href="/dashboard/nouveau" size="sm">
            <FilePlus2 className="h-4 w-4" />
            Nouveau dossier
          </Button>
        }
      />

      <div className="space-y-8 p-6 md:p-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-3xl border border-brand/10 bg-white p-5 shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tightest text-ink">
                  {s.value}
                </p>
                <p className="text-sm text-slate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Liste des dossiers */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-ink">Mes dossiers</h2>
          <div className="space-y-3">
            {DOSSIERS_DEMO.map((d) => {
              const risk =
                d.scoreFinal != null ? getRiskLevel(d.scoreFinal) : null;
              return (
                <Link
                  key={d.id}
                  href={`/dashboard/dossier/${d.id}`}
                  className="group flex flex-col gap-4 rounded-3xl border border-brand/10 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft-lg sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-ink">
                        {d.adresse}, {d.ville}
                      </p>
                      <p className="text-sm text-slate">
                        {TYPE_BIEN_LABEL[d.typeBien]} · Formule{" "}
                        {FORMULE_LABEL[d.formule]} · {formatDate(d.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-15 sm:pl-0">
                    {risk && (
                      <span
                        className="flex items-center gap-1.5 text-sm font-bold"
                        style={{ color: risk.hex }}
                      >
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: risk.hex }}
                        />
                        {d.scoreFinal?.toFixed(1)}/10
                      </span>
                    )}
                    <StatusBadge statut={d.statut} />
                    <ArrowRight className="h-5 w-5 text-slate transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
