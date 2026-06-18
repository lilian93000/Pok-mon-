import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://analysetacopro.fr"),
  title: {
    default: "AnalyseTaCopro — N'achetez pas sans analyser votre copropriété",
    template: "%s · AnalyseTaCopro",
  },
  description:
    "Analyse indépendante de copropriété avant achat immobilier. Nous décryptons les documents pour révéler les risques cachés — travaux, impayés, litiges — avant que vous signiez. Rapport clair livré en 72h.",
  keywords: [
    "analyse copropriété",
    "avant achat immobilier",
    "diagnostic copropriété",
    "PV assemblée générale",
    "risques copropriété",
  ],
  openGraph: {
    title: "AnalyseTaCopro",
    description:
      "Comprenez. Anticipez. Décidez en confiance. L'analyse indépendante de copropriété avant votre achat.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
