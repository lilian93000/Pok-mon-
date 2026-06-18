import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Pricing } from "@/components/sections/Pricing";
import { PricingB2B } from "@/components/sections/PricingB2B";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Grille tarifaire complète AnalyseTaCopro : formules particuliers (Essentiel, Premium, Investisseur) et packs agences co-brandés.",
};

export default function TarifsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tarifs"
        title="Des prix clairs, sans surprise"
        subtitle="Paiement unique pour les particuliers, packs dégressifs pour les agences. TVA non applicable (art. 293 B du CGI)."
      />
      <Pricing />
      <PricingB2B className="bg-brand-soft/40" />
      <FinalCTA />
    </>
  );
}
