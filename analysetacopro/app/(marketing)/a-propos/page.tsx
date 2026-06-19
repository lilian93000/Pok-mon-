import type { Metadata } from "next";
import { ShieldCheck, Eye, Lock, Target } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Founder } from "@/components/sections/Founder";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "AnalyseTaCopro : le tiers de confiance de l'acheteur. Notre mission, notre indépendance, notre méthode.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Indépendance totale",
    text: "Ni agence, ni syndic, ni notaire. Aucune commission sur les ventes. Notre seul client, c'est l'acheteur.",
  },
  {
    icon: Eye,
    title: "Transparence",
    text: "Une méthode claire, 7 critères pondérés, un score explicable. Vous comprenez chaque conclusion.",
  },
  {
    icon: Lock,
    title: "Confidentialité",
    text: "Vos documents sont chiffrés, jamais partagés, et supprimables après livraison du rapport.",
  },
  {
    icon: Target,
    title: "Expertise terrain",
    text: "Une connaissance concrète de la copropriété, forgée par la gestion quotidienne, pas la théorie.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Le tiers de confiance de l'acheteur"
        subtitle="Comprenez. Anticipez. Décidez en confiance. C'est la promesse qui guide chacune de nos analyses."
      />

      <Section>
        <SectionHeader
          eyebrow="Notre mission"
          title="Rééquilibrer l'information avant l'achat"
          subtitle="Lors d'un achat en copropriété, l'acheteur est le moins informé de tous. L'agence vend, le syndic gère, le notaire sécurise l'acte. Personne n'analyse la santé réelle de la copropriété pour l'acheteur. Nous comblons ce vide."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 70}>
              <div className="h-full rounded-3xl border border-brand/10 bg-surface p-7 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {v.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Founder />
      <FinalCTA />
    </>
  );
}
