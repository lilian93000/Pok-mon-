/** Offres et tarifs AnalyseTaCopro. */

export interface OfferB2C {
  id: string;
  name: string;
  price: number;
  unit: string;
  delivery: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

/** Offre B2C — Particuliers / Investisseurs. */
export const OFFERS_B2C: OfferB2C[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 149,
    unit: "€",
    delivery: "Livraison 72h",
    description: "L'analyse complète pour décider sereinement.",
    features: [
      "Rapport complet ~15 pages",
      "AnalyseTaCopro Score sur 10",
      "Synthèse des risques majeurs",
      "Recommandations claires",
      "Livraison sous 72h",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 249,
    unit: "€",
    delivery: "Livraison 48h",
    description: "L'analyse approfondie avec un conseil dédié.",
    features: [
      "Rapport approfondi 20+ pages",
      "Score détaillé par critère",
      "Appel conseil 30 min",
      "Analyse financière poussée",
      "Livraison sous 48h",
    ],
    highlighted: true,
  },
  {
    id: "investisseur",
    name: "Investisseur",
    price: 349,
    unit: "€",
    delivery: "Livraison 48h",
    description: "Pour les achats locatifs et la valorisation.",
    features: [
      "Tout le contenu Premium",
      "Analyse de rendement locatif",
      "Stratégie de valorisation",
      "Appel conseil 45 min",
      "Livraison sous 48h",
    ],
  },
];

export const OPTION_URGENCE = {
  name: "Option Urgence",
  price: 79,
  description: "Livraison en 24h sur n'importe quelle formule.",
};

/** Contenu détaillé d'une offre (page dédiée). */
export interface OfferDetail {
  tagline: string;
  intro: string;
  /** À qui s'adresse cette formule. */
  forWho: string[];
  /** Détail de ce qui est inclus (titre + explication). */
  includes: { title: string; text: string }[];
  /** Comparaison rapide / ce qui change vs l'offre précédente. */
  highlight?: string;
}

export const OFFER_DETAILS: Record<string, OfferDetail> = {
  essentiel: {
    tagline: "L'analyse complète pour décider sereinement.",
    intro:
      "La formule Essentiel vous donne l'essentiel pour acheter en confiance : nous épluchons les documents de la copropriété et vous remettons un rapport clair avec votre AnalyseTaCopro Score sur 10. Vous savez exactement où vous mettez les pieds avant de signer.",
    forWho: [
      "Vous achetez votre résidence principale ou secondaire",
      "Vous voulez une analyse fiable sans option superflue",
      "Vous avez besoin d'y voir clair rapidement (72h)",
    ],
    includes: [
      {
        title: "Rapport complet (~15 pages)",
        text: "Un document structuré et sans jargon, avec une synthèse en première page pour aller à l'essentiel.",
      },
      {
        title: "AnalyseTaCopro Score sur 10",
        text: "La note globale de la copropriété, calculée à partir de 7 critères pondérés (finances, travaux, gestion, etc.).",
      },
      {
        title: "Synthèse des risques majeurs",
        text: "Les points d'alerte identifiés dans les PV d'AG, le pré-état daté et les comptes : travaux, impayés, litiges.",
      },
      {
        title: "Recommandations claires",
        text: "Nos conseils concrets : questions à poser, points à vérifier et marges de négociation éventuelles.",
      },
      {
        title: "Livraison sous 72h",
        text: "Votre rapport est prêt en trois jours ouvrés après réception des documents.",
      },
    ],
  },
  premium: {
    tagline: "L'analyse approfondie avec un conseil dédié.",
    intro:
      "La formule Premium va plus loin : un rapport approfondi, le détail critère par critère de votre Score, une analyse financière poussée, et surtout un appel conseil de 30 minutes pour répondre à toutes vos questions. Notre formule la plus choisie.",
    forWho: [
      "Vous voulez comprendre chaque critère du Score en détail",
      "Vous souhaitez échanger de vive voix avec un expert",
      "L'achat est important et vous ne voulez aucun angle mort",
    ],
    includes: [
      {
        title: "Rapport approfondi (20+ pages)",
        text: "Une analyse détaillée de chaque dimension de la copropriété, avec exemples chiffrés.",
      },
      {
        title: "Score détaillé par critère",
        text: "Le détail des 7 notes et leur pondération, pour voir précisément où se situent les forces et les risques.",
      },
      {
        title: "Analyse financière poussée",
        text: "Trajectoire des charges, fonds de travaux, niveau d'impayés : une lecture experte de la santé financière.",
      },
      {
        title: "Appel conseil de 30 minutes",
        text: "Un échange avec notre expert pour décortiquer le rapport et répondre à vos questions.",
      },
      {
        title: "Livraison sous 48h",
        text: "Votre rapport est prêt en deux jours ouvrés après réception des documents.",
      },
    ],
    highlight: "Tout ce que contient Essentiel, en plus approfondi, avec l'appel conseil.",
  },
  investisseur: {
    tagline: "Pour les achats locatifs et la valorisation.",
    intro:
      "La formule Investisseur est pensée pour ceux qui achètent pour louer ou valoriser. Elle reprend tout le contenu Premium et y ajoute une analyse du rendement locatif, une stratégie de valorisation, et un appel conseil de 45 minutes.",
    forWho: [
      "Vous achetez pour mettre en location",
      "Vous visez la revente ou la valorisation à terme",
      "Vous voulez sécuriser la rentabilité de votre investissement",
    ],
    includes: [
      {
        title: "Tout le contenu Premium",
        text: "Rapport approfondi, Score détaillé, analyse financière et appel conseil inclus.",
      },
      {
        title: "Analyse de rendement locatif",
        text: "Estimation de la rentabilité en tenant compte des charges de copropriété et des travaux à venir.",
      },
      {
        title: "Stratégie de valorisation",
        text: "Nos pistes pour valoriser le bien et anticiper l'évolution de la copropriété.",
      },
      {
        title: "Appel conseil de 45 minutes",
        text: "Un échange étendu, orienté investissement et stratégie patrimoniale.",
      },
      {
        title: "Livraison sous 48h",
        text: "Votre rapport est prêt en deux jours ouvrés après réception des documents.",
      },
    ],
    highlight: "Tout Premium, plus la dimension rendement et valorisation pour investir sereinement.",
  },
};

export function getOffer(id: string): OfferB2C | undefined {
  return OFFERS_B2C.find((o) => o.id === id);
}

export interface PackB2B {
  id: string;
  name: string;
  sheets: number;
  priceHT: number;
  perSheet: number;
  highlighted?: boolean;
}

/** Offre B2B — Agences immobilières (fiche vitrine co-brandée). */
export const PACKS_B2B: PackB2B[] = [
  { id: "decouverte", name: "Découverte", sheets: 1, priceHT: 69, perSheet: 69 },
  { id: "classique", name: "Classique", sheets: 5, priceHT: 325, perSheet: 65 },
  { id: "pro", name: "Pro", sheets: 10, priceHT: 590, perSheet: 59, highlighted: true },
  { id: "agence", name: "Agence", sheets: 25, priceHT: 1349, perSheet: 54 },
  { id: "premium", name: "Premium", sheets: 50, priceHT: 2499, perSheet: 50 },
];
