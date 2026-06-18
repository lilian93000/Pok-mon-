import type { Metadata } from "next";
import { FileText, Clock, ShieldCheck, ListChecks } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Problem } from "@/components/sections/Problem";
import { Steps } from "@/components/sections/Steps";
import { ScoreSection } from "@/components/sections/ScoreSection";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Analyse avant achat",
  description:
    "Faites analyser une copropriété avant d'acheter : rapport clair, AnalyseTaCopro Score, recommandations indépendantes livrées en 72h.",
};

const DELIVERABLES = [
  {
    icon: FileText,
    title: "Un rapport clair",
    text: "15 à 20+ pages structurées, sans jargon, avec une synthèse exécutive en première page.",
  },
  {
    icon: ListChecks,
    title: "Le Score détaillé",
    text: "Une note sur 10 et le détail des 7 critères, pour voir où se situent les risques.",
  },
  {
    icon: ShieldCheck,
    title: "Des recommandations",
    text: "Nos conseils concrets : points de vigilance, questions à poser, marges de négociation.",
  },
  {
    icon: Clock,
    title: "Une livraison rapide",
    text: "72h, 48h ou 24h selon votre formule. Parce qu'un achat n'attend pas.",
  },
];

export default function AnalyseAvantAchatPage() {
  return (
    <>
      <PageHero
        eyebrow="Particuliers & investisseurs"
        title="Faites analyser votre copropriété avant de signer"
        subtitle="Confiez-nous les documents, nous révélons les risques cachés et vous remettons un rapport clair avec votre AnalyseTaCopro Score."
      />

      <Section>
        <SectionHeader
          eyebrow="Ce que vous recevez"
          title="Un rapport pensé pour décider"
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DELIVERABLES.map((d, i) => (
            <Reveal key={d.title} delay={i * 70}>
              <div className="h-full rounded-3xl border border-brand/10 bg-white p-7 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <d.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate">
                  {d.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Problem />
      <Steps />
      <ScoreSection />
      <Pricing className="bg-brand-soft/40" />
      <Faq />
      <FinalCTA />
    </>
  );
}
