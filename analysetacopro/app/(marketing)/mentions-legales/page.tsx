import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du service AnalyseTaCopro.",
};

const SECTIONS = [
  {
    heading: "Éditeur du site",
    paragraphs: [
      "AnalyseTaCopro — service d'analyse indépendante de copropriété.",
      "Contact : contact@analysetacopro.fr",
    ],
  },
  {
    heading: "Statut et TVA",
    paragraphs: [
      "Entreprise individuelle relevant du régime de la micro-entreprise. TVA non applicable, art. 293 B du CGI.",
    ],
  },
  {
    heading: "Hébergement",
    paragraphs: [
      "Le site est hébergé par Vercel Inc. Les documents sont stockés de manière sécurisée et chiffrée.",
    ],
  },
  {
    heading: "Propriété intellectuelle",
    paragraphs: [
      "L'ensemble des contenus du site (textes, visuels, logo, méthode du AnalyseTaCopro Score) est protégé. Toute reproduction sans autorisation est interdite.",
    ],
  },
  {
    heading: "Nature du service",
    paragraphs: [
      "AnalyseTaCopro fournit une analyse documentaire indépendante. Ce service ne constitue pas un conseil juridique, fiscal ou notarial, et ne se substitue pas à l'intervention d'un notaire ou d'un diagnostiqueur.",
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero eyebrow="Informations" title="Mentions légales" />
      <LegalContent sections={SECTIONS} />
    </>
  );
}
