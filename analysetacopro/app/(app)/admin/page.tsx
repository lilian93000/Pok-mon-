import {
  Euro,
  FolderOpen,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { Topbar } from "@/components/ui/topbar";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreEditor } from "@/components/ScoreEditor";
import {
  DOSSIERS_DEMO,
  FORMULE_LABEL,
  formatDate,
} from "@/lib/dossier";

export default function AdminPage() {
  const ca = DOSSIERS_DEMO.reduce((sum, d) => sum + d.prixHT, 0);
  const panier = Math.round(ca / DOSSIERS_DEMO.length);

  const kpis = [
    { label: "Chiffre d'affaires", value: `${ca} €`, icon: Euro },
    { label: "Dossiers", value: DOSSIERS_DEMO.length, icon: FolderOpen },
    { label: "Taux de conversion", value: "62 %", icon: TrendingUp },
    { label: "Panier moyen", value: `${panier} €`, icon: ShoppingCart },
  ];

  return (
    <>
      <Topbar
        title="Vue d'ensemble"
        subtitle="Pilotez l'activité, les dossiers et la saisie des scores."
      />

      <div className="space-y-10 p-6 md:p-8">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-3xl border border-brand/10 bg-white p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <k.icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-2xl font-extrabold tracking-tightest text-ink">
                {k.value}
              </p>
              <p className="text-sm text-slate">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Table des dossiers */}
        <div id="dossiers">
          <h2 className="mb-4 text-lg font-bold text-ink">Derniers dossiers</h2>
          <div className="overflow-hidden rounded-3xl border border-brand/10 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand/10 text-left text-xs uppercase tracking-wide text-slate">
                    <th className="px-5 py-3 font-semibold">Référence</th>
                    <th className="px-5 py-3 font-semibold">Bien</th>
                    <th className="px-5 py-3 font-semibold">Formule</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Montant</th>
                    <th className="px-5 py-3 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {DOSSIERS_DEMO.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-brand/5 last:border-0 hover:bg-brand-soft/30"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-slate">
                        {d.id}
                      </td>
                      <td className="px-5 py-3 font-medium text-ink">
                        {d.adresse}, {d.ville}
                      </td>
                      <td className="px-5 py-3 text-slate">
                        {FORMULE_LABEL[d.formule]}
                      </td>
                      <td className="px-5 py-3 text-slate">
                        {formatDate(d.createdAt)}
                      </td>
                      <td className="px-5 py-3 font-semibold text-ink">
                        {d.prixHT} €
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge statut={d.statut} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Saisie du score */}
        <div>
          <h2 className="mb-1 text-lg font-bold text-ink">
            Saisie du AnalyseTaCopro Score
          </h2>
          <p className="mb-5 text-sm text-slate">
            Dossier <span className="font-mono">dos_2b9c</span> — 5 avenue Victor
            Hugo, Bordeaux
          </p>
          <ScoreEditor dossierLabel="dos_2b9c" />
        </div>
      </div>
    </>
  );
}
