import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/Reveal";

const STATS = [
  { value: "2+", label: "ans d'expérience" },
  { value: "1 200+", label: "lots gérés" },
  { value: "40", label: "AG par an" },
];

const TAGS = [
  "Tiers indépendant",
  "Aucun intérêt dans la vente",
  "100% confidentiel",
];

export function Founder() {
  return (
    <Section className="bg-brand-soft/40">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <Badge>Le fondateur</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tightest text-ink md:text-[40px] md:leading-[1.1]">
              Pas un théoricien. Un professionnel de la copropriété.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate">
              AnalyseTaCopro n&apos;est pas né d&apos;une idée abstraite, mais
              d&apos;années passées à gérer des copropriétés au quotidien :
              budgets, assemblées générales, travaux, litiges. Je sais où se
              cachent les risques — parce que je les ai gérés.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Badge key={tag} tone="success">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-brand/10 bg-white p-6 text-center shadow-card"
              >
                <p className="bg-brand-gradient bg-clip-text text-3xl font-extrabold tracking-tightest text-transparent md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm font-medium text-slate">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
