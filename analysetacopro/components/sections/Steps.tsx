import { Upload, Search, FileText } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    icon: Upload,
    title: "Envoyez vos documents",
    text: "PV d'AG, règlement de copropriété, pré-état daté, carnet d'entretien, annexes comptables.",
  },
  {
    icon: Search,
    title: "Nous analysons",
    text: "Un expert décortique finances, travaux, gestion et risques, critère par critère.",
  },
  {
    icon: FileText,
    title: "Recevez votre rapport",
    text: "Synthèse claire + AnalyseTaCopro Score + recommandations concrètes pour décider.",
  },
];

export function Steps() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Comment ça marche"
        title="Trois étapes, zéro jargon"
        subtitle="Un parcours simple, de l'envoi des documents à votre décision d'achat."
      />

      <div className="relative mt-14 grid gap-8 md:grid-cols-3">
        {/* Ligne de liaison */}
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent md:block" />
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 120}>
            <div className="relative text-center">
              <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-soft">
                <s.icon className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-night text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-slate">
                {s.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
