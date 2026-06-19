import {
  Hammer,
  Wallet,
  Scale,
  TrendingUp,
  Building,
  Thermometer,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/Reveal";

const PROBLEMS = [
  {
    icon: Hammer,
    title: "Travaux cachés",
    text: "Ravalement, toiture, ascenseur : des dizaines de milliers d'euros qui vous tomberont dessus après l'achat.",
  },
  {
    icon: Wallet,
    title: "Impayés & dettes",
    text: "Des copropriétaires qui ne paient pas leurs charges fragilisent toute la copropriété — et votre budget.",
  },
  {
    icon: Scale,
    title: "Litiges & procédures",
    text: "Contentieux en cours, procédures contre le syndic ou un voisin : des risques rarement évoqués.",
  },
  {
    icon: TrendingUp,
    title: "Charges qui s'envolent",
    text: "Une trajectoire de charges mal maîtrisée peut transformer un bon achat en gouffre financier.",
  },
  {
    icon: Building,
    title: "Mauvaise gestion",
    text: "Un syndic défaillant, des AG bâclées, un carnet d'entretien vide : les signaux d'alerte.",
  },
  {
    icon: Thermometer,
    title: "Passoire thermique",
    text: "DPE collectif, isolation : des travaux énergétiques bientôt obligatoires et coûteux.",
  },
];

export function Problem() {
  return (
    <Section className="bg-surface-soft/40">
      <SectionHeader
        eyebrow="Le problème"
        title="Ce que les 300 pages de documents ne vous disent pas clairement"
        subtitle="Avant chaque vente, vous recevez une montagne de documents. Personne ne prend le temps de les analyser pour vous."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.title} delay={i * 70}>
            <div className="group h-full rounded-3xl border border-brand/5 bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-soft text-brand transition-colors group-hover:bg-brand-gradient group-hover:text-white">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {p.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150}>
        <p className="mx-auto mt-12 max-w-2xl text-center text-lg font-semibold text-foreground">
          Ni l&apos;agence, ni le notaire ne réalisent cette analyse.{" "}
          <span className="text-brand">Nous, si.</span>
        </p>
      </Reveal>
    </Section>
  );
}
