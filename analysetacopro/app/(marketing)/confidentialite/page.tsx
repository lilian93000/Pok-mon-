import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { LegalContent } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment AnalyseTaCopro collecte, utilise et protège vos données personnelles et vos documents de copropriété, dans le respect du RGPD.",
};

const SECTIONS = [
  {
    heading: "1. Préambule",
    blocks: [
      {
        type: "p" as const,
        text: "AnalyseTaCopro attache une grande importance à la protection de votre vie privée. La présente politique de confidentialité explique quelles données personnelles nous collectons, pourquoi, comment nous les utilisons et les protégeons, ainsi que les droits dont vous disposez. Elle s'applique au site analysetacopro.fr et à l'ensemble de nos prestations d'analyse de copropriété.",
      },
    ],
  },
  {
    heading: "2. Responsable du traitement",
    blocks: [
      {
        type: "p" as const,
        text: "Le responsable du traitement des données est AnalyseTaCopro, exploité par [À compléter : nom et prénom du fondateur / raison sociale], dont les coordonnées figurent dans les mentions légales.",
      },
      {
        type: "p" as const,
        text: "Pour toute question relative à vos données personnelles, vous pouvez nous écrire à : contact@analysetacopro.fr.",
      },
    ],
  },
  {
    heading: "3. Données que nous collectons",
    blocks: [
      {
        type: "p" as const,
        text: "Nous ne collectons que les données nécessaires à la fourniture de nos services :",
      },
      {
        type: "ul" as const,
        items: [
          "Données d'identité et de contact : nom, prénom, adresse e-mail, numéro de téléphone.",
          "Données relatives au bien : adresse, ville, code postal, type de bien concerné par l'analyse.",
          "Documents de copropriété que vous nous transmettez : procès-verbaux d'assemblée générale, règlement de copropriété, pré-état daté, carnet d'entretien, annexes comptables, diagnostics, etc.",
          "Données de facturation : informations nécessaires à l'établissement de la facture.",
          "Données techniques : données de navigation strictement nécessaires au bon fonctionnement du site.",
        ],
      },
    ],
  },
  {
    heading: "4. Finalités et bases légales",
    blocks: [
      {
        type: "p" as const,
        text: "Vos données sont traitées pour les finalités suivantes :",
      },
      {
        type: "ul" as const,
        items: [
          "Réaliser l'analyse de copropriété commandée et vous livrer votre rapport (exécution du contrat).",
          "Gérer la relation client, répondre à vos demandes et vous contacter au sujet de votre dossier (exécution du contrat / intérêt légitime).",
          "Établir la facturation et respecter nos obligations comptables et fiscales (obligation légale).",
          "Améliorer nos services et assurer la sécurité du site (intérêt légitime).",
        ],
      },
      {
        type: "p" as const,
        text: "Nous n'utilisons jamais vos données ni vos documents à des fins commerciales externes, et nous ne les vendons à aucun tiers.",
      },
    ],
  },
  {
    heading: "5. Destinataires et sous-traitants",
    blocks: [
      {
        type: "p" as const,
        text: "Vos données sont destinées exclusivement à AnalyseTaCopro. Pour fonctionner, nous pouvons faire appel à des prestataires techniques (sous-traitants au sens du RGPD), notamment notre hébergeur. Ces prestataires n'ont accès qu'aux données strictement nécessaires à leur mission et sont tenus à la confidentialité.",
      },
    ],
  },
  {
    heading: "6. Durée de conservation",
    blocks: [
      {
        type: "ul" as const,
        items: [
          "Documents de copropriété : conservés le temps de réaliser l'analyse, puis supprimés sur votre demande, et au plus tard quelques mois après la livraison du rapport.",
          "Rapport et données du dossier : conservés le temps nécessaire au suivi de la relation client.",
          "Documents comptables et factures : conservés pendant la durée légale applicable (10 ans).",
        ],
      },
      {
        type: "p" as const,
        text: "Vous pouvez demander la suppression anticipée de vos documents à tout moment après la livraison de votre rapport.",
      },
    ],
  },
  {
    heading: "7. Sécurité",
    blocks: [
      {
        type: "p" as const,
        text: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : connexion sécurisée (HTTPS), stockage protégé, accès restreint aux seules personnes habilitées. Malgré tout le soin apporté, aucune transmission de données sur Internet ne peut être garantie comme totalement infaillible.",
      },
    ],
  },
  {
    heading: "8. Vos droits",
    blocks: [
      {
        type: "p" as const,
        text: "Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :",
      },
      {
        type: "ul" as const,
        items: [
          "Droit d'accès à vos données,",
          "Droit de rectification des données inexactes,",
          "Droit à l'effacement (« droit à l'oubli »),",
          "Droit à la limitation du traitement,",
          "Droit d'opposition au traitement,",
          "Droit à la portabilité de vos données.",
        ],
      },
      {
        type: "p" as const,
        text: "Pour exercer ces droits, écrivez-nous à contact@analysetacopro.fr. Nous vous répondrons dans les meilleurs délais et au plus tard dans un délai d'un mois. En cas de désaccord, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).",
      },
    ],
  },
  {
    heading: "9. Cookies",
    blocks: [
      {
        type: "p" as const,
        text: "Le site utilise uniquement les cookies et le stockage local strictement nécessaires à son bon fonctionnement (par exemple la mémorisation de votre préférence d'affichage clair/sombre). Aucun cookie publicitaire ou de traçage tiers n'est déposé sans votre consentement.",
      },
    ],
  },
  {
    heading: "10. Transfert de données hors UE",
    blocks: [
      {
        type: "p" as const,
        text: "Vos données sont hébergées au sein de l'Union européenne. Si un prestataire venait à traiter des données en dehors de l'UE, nous nous assurerions que des garanties appropriées (clauses contractuelles types, etc.) soient en place.",
      },
    ],
  },
  {
    heading: "11. Modifications",
    blocks: [
      {
        type: "p" as const,
        text: "La présente politique de confidentialité peut être mise à jour pour refléter l'évolution de nos services ou de la réglementation. La date de dernière mise à jour figure en haut de cette page.",
      },
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero
        eyebrow="RGPD"
        title="Politique de confidentialité"
        subtitle="Vos données et vos documents sont traités avec la plus grande confidentialité."
      />
      <LegalContent
        sections={SECTIONS}
        updatedAt="20 juin 2026"
        intro="La présente politique décrit la manière dont AnalyseTaCopro traite vos données personnelles dans le cadre de l'utilisation du site et de ses prestations."
      />
    </>
  );
}
