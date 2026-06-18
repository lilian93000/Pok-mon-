import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Faq } from "@/components/sections/Faq";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes sur l'analyse de copropriété avant achat : documents, délais, confidentialité, indépendance.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions fréquentes"
        subtitle="Les réponses aux questions que se posent nos clients avant de nous confier leur analyse."
      />
      <Faq withHeader={false} />
      <FinalCTA />
    </>
  );
}
