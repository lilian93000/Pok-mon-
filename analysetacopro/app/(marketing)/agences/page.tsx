import type { Metadata } from "next";
import { Palette, TrendingUp, Handshake, BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { PricingB2B } from "@/components/sections/PricingB2B";
import { ScoreGauge } from "@/components/ScoreGauge";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pour les agences",
  description:
    "Fiches vitrines co-brandées AnalyseTaCopro pour agences immobilières : rassurez vos acheteurs avec une analyse indépendante à votre image.",
};

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Vous rassurez l'acheteur",
    text: "Une analyse indépendante lève les doutes et accélère la prise de décision.",
  },
  {
    icon: TrendingUp,
    title: "Vous accélérez vos ventes",
    text: "Moins d'allers-retours, des acheteurs confiants, des compromis signés plus vite.",
  },
  {
    icon: Palette,
    title: "À votre image",
    text: "Chaque fiche est co-brandée avec votre logo et vos couleurs.",
  },
];

export default function AgencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Agences immobilières"
        title="L'analyse de copropriété qui fait vendre"
        subtitle="Proposez à vos acheteurs une fiche vitrine co-brandée : une analyse indépendante, à votre image, qui inspire confiance et accélère la signature."
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <Badge>
                <Handshake className="h-4 w-4" />
                La fiche vitrine co-brandée
              </Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tightest text-ink md:text-[40px] md:leading-[1.1]">
                Un argument de vente puissant, clé en main
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate">
                Pour chaque bien que vous commercialisez, offrez une fiche
                d&apos;analyse de la copropriété portant votre marque. Vos
                acheteurs voient le AnalyseTaCopro Score, comprennent les
                risques, et vous font confiance.
              </p>
              <ul className="mt-6 space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b.title} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <b.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{b.title}</p>
                      <p className="text-sm text-slate">{b.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-brand-gradient opacity-10 blur-2xl" />
              <ScoreGauge />
            </div>
          </Reveal>
        </div>
      </Section>

      <PricingB2B className="bg-brand-soft/40" />
      <FinalCTA />
    </>
  );
}
