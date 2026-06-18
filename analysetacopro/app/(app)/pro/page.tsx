import { Check, Users } from "lucide-react";
import { Topbar } from "@/components/ui/topbar";
import { Button } from "@/components/ui/button";
import { CoBranding } from "@/components/CoBranding";
import { PACKS_B2B } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const HISTORIQUE = [
  { ref: "FIC_1042", bien: "3 rue Pasteur, Lille", date: "14 juin 2026", score: 7.6, statut: "Livrée" },
  { ref: "FIC_1039", bien: "21 cours Mirabeau, Aix", date: "9 juin 2026", score: 8.9, statut: "Livrée" },
  { ref: "FIC_1031", bien: "7 quai de Seine, Rouen", date: "2 juin 2026", score: 5.4, statut: "Livrée" },
];

const EQUIPE = [
  { nom: "Camille Roux", role: "Responsable agence", email: "camille@agence.fr" },
  { nom: "Léo Martin", role: "Négociateur", email: "leo@agence.fr" },
  { nom: "Sarah Benali", role: "Négociatrice", email: "sarah@agence.fr" },
];

export default function ProPage() {
  return (
    <>
      <Topbar
        title="Espace agence"
        subtitle="Vos fiches co-brandées, votre équipe, votre historique."
        action={
          <Button href="#commander" size="sm">
            Commander des fiches
          </Button>
        }
      />

      <div className="space-y-10 p-6 md:p-8">
        {/* KPIs rapides */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { v: "8", l: "Fiches restantes" },
            { v: "17", l: "Fiches commandées" },
            { v: "7.4", l: "Score moyen" },
          ].map((k) => (
            <div
              key={k.l}
              className="rounded-3xl border border-brand/10 bg-white p-5 shadow-card"
            >
              <p className="text-2xl font-extrabold tracking-tightest text-ink">
                {k.v}
              </p>
              <p className="text-sm text-slate">{k.l}</p>
            </div>
          ))}
        </div>

        {/* Commander */}
        <section id="commander">
          <h2 className="mb-4 text-lg font-bold text-ink">Commander des fiches</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PACKS_B2B.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "rounded-3xl border p-5 text-center",
                  p.highlighted
                    ? "border-brand bg-brand-night text-white"
                    : "border-brand/10 bg-white"
                )}
              >
                <h3 className="text-sm font-bold">{p.name}</h3>
                <p className={cn("text-sm", p.highlighted ? "text-white/60" : "text-slate")}>
                  {p.sheets} {p.sheets > 1 ? "fiches" : "fiche"}
                </p>
                <p className="mt-3 text-2xl font-extrabold tracking-tightest">
                  {p.priceHT} €
                </p>
                <p className={cn("text-xs", p.highlighted ? "text-brand-bright" : "text-brand")}>
                  {p.perSheet} € / fiche
                </p>
                <Button
                  href="/contact"
                  variant={p.highlighted ? "primary" : "secondary"}
                  size="sm"
                  className="mt-4 w-full"
                >
                  Choisir
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Historique */}
        <section id="historique">
          <h2 className="mb-4 text-lg font-bold text-ink">Historique des fiches</h2>
          <div className="overflow-hidden rounded-3xl border border-brand/10 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand/10 text-left text-xs uppercase tracking-wide text-slate">
                    <th className="px-5 py-3 font-semibold">Référence</th>
                    <th className="px-5 py-3 font-semibold">Bien</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Score</th>
                    <th className="px-5 py-3 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORIQUE.map((h) => (
                    <tr key={h.ref} className="border-b border-brand/5 last:border-0 hover:bg-brand-soft/30">
                      <td className="px-5 py-3 font-mono text-xs text-slate">{h.ref}</td>
                      <td className="px-5 py-3 font-medium text-ink">{h.bien}</td>
                      <td className="px-5 py-3 text-slate">{h.date}</td>
                      <td className="px-5 py-3 font-bold text-brand">{h.score}/10</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                          <Check className="h-3 w-3" />
                          {h.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Équipe */}
        <section id="equipe">
          <h2 className="mb-4 text-lg font-bold text-ink">Mon équipe</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EQUIPE.map((m) => (
              <div
                key={m.email}
                className="flex items-center gap-4 rounded-3xl border border-brand/10 bg-white p-5 shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient font-bold text-white">
                  {m.nom.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{m.nom}</p>
                  <p className="truncate text-sm text-slate">{m.role}</p>
                </div>
              </div>
            ))}
            <button className="flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-brand/20 p-5 text-sm font-semibold text-brand transition hover:bg-brand-soft/40">
              <Users className="h-5 w-5" />
              Inviter un collaborateur
            </button>
          </div>
        </section>

        {/* Co-branding */}
        <section id="co-branding">
          <h2 className="mb-4 text-lg font-bold text-ink">Co-branding</h2>
          <CoBranding />
        </section>
      </div>
    </>
  );
}
