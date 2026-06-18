import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AnalyseTaCopro — Analyse indépendante de copropriété avant achat",
    template: "%s · AnalyseTaCopro",
  },
  description:
    "N'achetez pas un appartement sans analyser sa copropriété. Rapport clair et indépendant avec le AnalyseTaCopro Score, livré en 72h.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
