import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site et du service AnalyseTaCopro : éditeur, hébergeur, propriété intellectuelle et conditions d'utilisation.",
};

const SECTIONS = [
  {
    heading: "1. Éditeur du site",
    blocks: [
      {
        type: "p" as const,
        text: "Le site analysetacopro.fr est édité par AnalyseTaCopro, service d'analyse indépendante de copropriété avant achat immobilier.",
      },
      {
        type: "ul" as const,
        items: [
          "Exploitant : [À compléter : nom et prénom du fondateur ou raison sociale]",
          "Statut : entreprise individuelle relevant du régime de la micro-entreprise",
          "SIRET : [À compléter : numéro SIRET]",
          "Siège : [À compléter : adresse]",
          "E-mail : contact@analysetacopro.fr",
          "Directeur de la publication : [À compléter : nom du fondateur]",
        ],
      },
      {
        type: "p" as const,
        text: "TVA non applicable, article 293 B du Code général des impôts (franchise en base de TVA).",
      },
    ],
  },
  {
    heading: "2. Hébergement",
    blocks: [
      {
        type: "p" as const,
        text: "Le site est hébergé par :",
      },
      {
        type: "ul" as const,
        items: [
          "IONOS SARL",
          "7 place de la Gare, BP 70109, 57201 Sarreguemines Cedex, France",
          "Site : www.ionos.fr",
        ],
      },
    ],
  },
  {
    heading: "3. Propriété intellectuelle",
    blocks: [
      {
        type: "p" as const,
        text: "L'ensemble des éléments du site (textes, visuels, logo, charte graphique, ainsi que la méthode et le nom « AnalyseTaCopro Score ») est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive d'AnalyseTaCopro.",
      },
      {
        type: "p" as const,
        text: "Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable, est interdite et constituerait une contrefaçon.",
      },
    ],
  },
  {
    heading: "4. Nature du service et responsabilité",
    blocks: [
      {
        type: "p" as const,
        text: "AnalyseTaCopro fournit une analyse documentaire indépendante destinée à éclairer l'acheteur. Ce service ne constitue pas un conseil juridique, fiscal ou notarial et ne se substitue pas à l'intervention d'un notaire, d'un avocat, d'un diagnostiqueur ou d'un syndic.",
      },
      {
        type: "p" as const,
        text: "Nos analyses sont réalisées avec sérieux à partir des documents fournis par le client. Leur pertinence dépend de l'exactitude et de l'exhaustivité de ces documents. AnalyseTaCopro ne saurait être tenu responsable des décisions prises par le client sur la base du rapport, ni des informations absentes des documents transmis.",
      },
    ],
  },
  {
    heading: "5. Données personnelles",
    blocks: [
      {
        type: "p" as const,
        text: "Le traitement de vos données personnelles est détaillé dans notre politique de confidentialité, accessible depuis le pied de page du site. Conformément au RGPD, vous disposez de droits d'accès, de rectification et de suppression de vos données, exerçables à contact@analysetacopro.fr.",
      },
    ],
  },
  {
    heading: "6. Liens externes",
    blocks: [
      {
        type: "p" as const,
        text: "Le site peut contenir des liens vers des sites tiers. AnalyseTaCopro n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
      },
    ],
  },
  {
    heading: "7. Droit applicable et litiges",
    blocks: [
      {
        type: "p" as const,
        text: "Les présentes mentions légales sont régies par le droit français. En cas de litige, et après recherche d'une solution amiable, les tribunaux français seront seuls compétents. Conformément à la réglementation, le consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige.",
      },
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        eyebrow="Informations légales"
        title="Mentions légales"
        subtitle="Informations relatives à l'éditeur, à l'hébergeur et aux conditions d'utilisation du site."
      />
      <LegalContent sections={SECTIONS} updatedAt="20 juin 2026" />
    </>
  );
}
