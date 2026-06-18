import type { Metadata } from "next";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez AnalyseTaCopro pour faire analyser une copropriété ou poser vos questions.",
};

const INFOS = [
  {
    icon: Mail,
    title: "Par email",
    text: "contact@analysetacopro.fr",
  },
  {
    icon: Clock,
    title: "Réponse rapide",
    text: "Sous 24h ouvrées en moyenne.",
  },
  {
    icon: ShieldCheck,
    title: "Confidentialité",
    text: "Vos échanges restent strictement privés.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet"
        subtitle="Une question, un achat en vue, un besoin pour votre agence ? Écrivez-nous."
      />
      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            {INFOS.map((info) => (
              <div
                key={info.title}
                className="flex items-start gap-4 rounded-2xl border border-brand/10 bg-white p-5 shadow-card"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <info.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{info.title}</h3>
                  <p className="text-sm text-slate">{info.text}</p>
                </div>
              </div>
            ))}
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
