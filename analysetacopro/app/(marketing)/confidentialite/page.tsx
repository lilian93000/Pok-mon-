import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment AnalyseTaCopro protège vos données personnelles et vos documents de copropriété (RGPD).",
};

const SECTIONS = [
  {
    heading: "1. Responsable du traitement",
    paragraphs: [
      "AnalyseTaCopro est responsable du traitement des données personnelles collectées via ce site et dans le cadre de ses prestations d'analyse de copropriété.",
    ],
  },
  {
    heading: "2. Données collectées",
    paragraphs: [
      "Nous collectons les données que vous nous transmettez : identité, coordonnées, et les documents de copropriété nécessaires à l'analyse (PV d'AG, pré-état daté, règlement, etc.).",
    ],
  },
  {
    heading: "3. Finalités",
    paragraphs: [
      "Vos données sont utilisées uniquement pour réaliser l'analyse commandée, vous livrer votre rapport, gérer la facturation et vous contacter à propos de votre dossier.",
    ],
  },
  {
    heading: "4. Conservation et suppression",
    paragraphs: [
      "Vos documents sont stockés de manière chiffrée. Ils peuvent être supprimés après la livraison de votre rapport, sur simple demande de votre part.",
    ],
  },
  {
    heading: "5. Vos droits (RGPD)",
    paragraphs: [
      "Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données, ainsi que d'un droit d'opposition. Pour les exercer, contactez-nous à contact@analysetacopro.fr.",
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero eyebrow="RGPD" title="Politique de confidentialité" />
      <LegalContent sections={SECTIONS} />
    </>
  );
}
