/** Articles de blog (SEO). Contenu statique pour le moment. */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: number;
  content: Block[];
}

export const ARTICLES: Article[] = [
  {
    slug: "5-pieges-copropriete-avant-achat",
    title: "5 pièges de copropriété à repérer avant d'acheter",
    excerpt:
      "Travaux votés mais non provisionnés, impayés, syndic défaillant… Voici les signaux d'alerte qui doivent vous arrêter avant de signer.",
    category: "Guide acheteur",
    date: "2026-06-10",
    readingTime: 6,
    content: [
      {
        type: "p",
        text: "Acheter en copropriété, c'est acheter une part d'un collectif. La santé de ce collectif pèse directement sur votre budget et votre tranquillité. Voici les cinq pièges les plus fréquents — et comment les détecter dans les documents.",
      },
      { type: "h2", text: "1. Des travaux votés mais pas provisionnés" },
      {
        type: "p",
        text: "Un ravalement ou une réfection de toiture voté en assemblée générale peut représenter plusieurs milliers d'euros par lot. Si le fonds travaux ne couvre pas la dépense, c'est vous, nouvel acheteur, qui paierez. Lisez attentivement les PV d'AG des trois dernières années.",
      },
      { type: "h2", text: "2. Des impayés élevés" },
      {
        type: "p",
        text: "Quand plusieurs copropriétaires ne paient pas leurs charges, la trésorerie se dégrade et les copropriétaires à jour compensent. Le pré-état daté indique le niveau d'impayés : un taux supérieur à 10–15 % doit alerter.",
      },
      { type: "h2", text: "3. Un syndic défaillant" },
      {
        type: "ul",
        items: [
          "Comptes peu clairs ou présentés en retard",
          "Carnet d'entretien vide ou non tenu",
          "AG bâclées, peu de décisions, faible participation",
          "Travaux urgents repoussés d'année en année",
        ],
      },
      { type: "h2", text: "4. Un contentieux en cours" },
      {
        type: "p",
        text: "Procédure contre un copropriétaire, litige avec une entreprise, recours contre une décision d'AG : un contentieux peut coûter cher et durer. Il est rarement mis en avant lors de la vente.",
      },
      { type: "h2", text: "5. Une passoire thermique qui s'ignore" },
      {
        type: "p",
        text: "Avec le durcissement des obligations énergétiques, les copropriétés mal isolées font face à des travaux importants. Le DPE collectif et le plan pluriannuel de travaux sont de bons indicateurs.",
      },
      {
        type: "quote",
        text: "Ni l'agence, ni le notaire ne réalisent cette analyse. C'est précisément le rôle d'un tiers indépendant.",
      },
    ],
  },
  {
    slug: "comprendre-le-pre-etat-date",
    title: "Le pré-état daté : comment le lire en 10 minutes",
    excerpt:
      "Ce document remis avant la vente résume la situation financière de votre futur lot. Voici les lignes à scruter en priorité.",
    category: "Documents",
    date: "2026-06-04",
    readingTime: 5,
    content: [
      {
        type: "p",
        text: "Le pré-état daté est l'un des documents les plus utiles avant un achat en copropriété. Il donne une photographie financière de votre lot et de la copropriété.",
      },
      { type: "h2", text: "Ce que vous devez y chercher" },
      {
        type: "ul",
        items: [
          "Le montant des charges courantes appelées",
          "Les sommes restant dues par le vendeur",
          "Le fonds de travaux (loi ALUR) rattaché au lot",
          "Les procédures et travaux en cours votés",
        ],
      },
      {
        type: "p",
        text: "Croisez ces informations avec les PV d'AG : un pré-état daté rassurant peut masquer des travaux importants votés très récemment.",
      },
    ],
  },
  {
    slug: "fonds-travaux-alur-tout-comprendre",
    title: "Fonds de travaux ALUR : tout comprendre avant d'acheter",
    excerpt:
      "Obligatoire dans la plupart des copropriétés, ce fonds anticipe les gros travaux. Bonne ou mauvaise nouvelle pour l'acheteur ?",
    category: "Finances",
    date: "2026-05-22",
    readingTime: 4,
    content: [
      {
        type: "p",
        text: "Le fonds de travaux, instauré par la loi ALUR, oblige les copropriétés à mettre de l'argent de côté chaque année pour financer les futurs travaux. C'est une bonne chose : une copropriété qui provisionne anticipe.",
      },
      { type: "h2", text: "Ce qu'il faut vérifier" },
      {
        type: "p",
        text: "Un fonds bien doté limite les appels de fonds exceptionnels. À l'inverse, un fonds quasi vide dans une copropriété ancienne est un signal de risque financier à court terme.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
