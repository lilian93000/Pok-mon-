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
