import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  MapPin,
  Check,
} from "lucide-react";
import { Topbar } from "@/components/ui/topbar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreGauge } from "@/components/ScoreGauge";
import {
  DOSSIERS_DEMO,
  FORMULE_LABEL,
  TYPE_BIEN_LABEL,
  TYPE_DOC_LABEL,
  STATUT_FLOW,
  STATUT_META,
  formatDate,
  formatPoids,
} from "@/lib/dossier";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return DOSSIERS_DEMO.map((d) => ({ id: d.id }));
}

export default function DossierDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const dossier = DOSSIERS_DEMO.find((d) => d.id === params.id);
  if (!dossier) notFound();

  const currentIdx = STATUT_FLOW.indexOf(
    dossier.statut === "DOCUMENTS_INCOMPLETS" ? "DOCUMENTS_RECUS" : dossier.statut
  );
  const hasRapport = dossier.statut === "RAPPORT_LIVRE" && dossier.criteria;

  return (
    <>
      <Topbar
        title={`${dossier.adresse}, ${dossier.ville}`}
        subtitle={`Dossier ${dossier.id}`}
        action={<StatusBadge statut={dossier.statut} />}
      />

      <div className="space-y-8 p-6 md:p-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux dossiers
        </Link>

        {/* Suivi de statut */}
        <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-card">
          <h2 className="mb-6 font-bold text-ink">Suivi de votre analyse</h2>
          <ol className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0">
            {STATUT_FLOW.map((st, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <li
                  key={st}
                  className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:text-center"
                >
                  <div className="flex items-center gap-3 sm:w-full sm:flex-col">
                    <div className="flex items-center sm:w-full">
                      {i > 0 && (
                        <span
                          className={cn(
                            "hidden h-0.5 flex-1 sm:block",
                            i <= currentIdx ? "bg-brand" : "bg-brand-soft"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          done && "bg-brand text-white",
                          active && "bg-brand-gradient text-white shadow-soft ring-4 ring-brand/15",
                          !done && !active && "bg-brand-soft text-slate"
                        )}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      {i < STATUT_FLOW.length - 1 && (
                        <span
                          className={cn(
                            "hidden h-0.5 flex-1 sm:block",
                            i < currentIdx ? "bg-brand" : "bg-brand-soft"
                          )}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium sm:mt-2",
                        active ? "text-brand" : "text-slate"
                      )}
                    >
                      {STATUT_META[st].label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          {/* Infos */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-card">
              <h2 className="mb-4 font-bold text-ink">Informations</h2>
              <dl className="space-y-3 text-sm">
                <Info icon={MapPin} label="Adresse">
                  {dossier.adresse}, {dossier.codePostal} {dossier.ville}
                </Info>
                <Info label="Type de bien">
                  {TYPE_BIEN_LABEL[dossier.typeBien]}
                </Info>
                <Info label="Formule">{FORMULE_LABEL[dossier.formule]}</Info>
                <Info label="Créé le">{formatDate(dossier.createdAt)}</Info>
                <Info label="Montant">{dossier.prixHT} €</Info>
              </dl>
            </div>

            <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-card">
              <h2 className="mb-4 font-bold text-ink">
                Documents ({dossier.documents.length})
              </h2>
              <ul className="space-y-2">
                {dossier.documents.map((doc, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-brand/10 bg-brand-soft/30 px-4 py-2.5"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-brand" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {doc.nom}
                      </p>
                      <p className="text-xs text-slate">
                        {TYPE_DOC_LABEL[doc.type]} · {formatPoids(doc.poids)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rapport / Score */}
          <div>
            {hasRapport ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-ink">Votre rapport</h2>
                  <Button href="#" variant="secondary" size="sm">
                    <Download className="h-4 w-4" />
                    Télécharger le PDF
                  </Button>
                </div>
                <ScoreGauge criteria={dossier.criteria} />
                <p className="rounded-2xl border border-brand/10 bg-brand-soft/40 p-4 text-sm leading-relaxed text-slate">
                  Copropriété saine, bien gérée, avec des finances solides.
                  Quelques travaux énergétiques à anticiper à moyen terme.
                  Aucun contentieux significatif relevé.
                </p>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-brand/20 bg-white p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-bold text-ink">
                  Rapport en préparation
                </h3>
                <p className="mt-1 max-w-xs text-sm text-slate">
                  Votre rapport et votre AnalyseTaCopro Score apparaîtront ici
                  dès que l&apos;analyse sera terminée.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Info({
  icon: Icon,
  label,
  children,
}: {
  icon?: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="flex items-center gap-1.5 text-slate">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </dt>
      <dd className="text-right font-medium text-ink">{children}</dd>
    </div>
  );
}
