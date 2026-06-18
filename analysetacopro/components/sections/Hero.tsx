import { ShieldCheck, ArrowRight, Building2, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "@/components/ScoreGauge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="container relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        {/* Colonne texte */}
        <div className="animate-fade-up">
          <Badge>
            <ShieldCheck className="h-4 w-4" />
            Cabinet d&apos;analyse 100% indépendant
          </Badge>
          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tightest text-ink md:text-[56px]">
            N&apos;achetez pas un appartement sans{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              analyser sa copropriété.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
            Nous décryptons les documents de copropriété pour révéler les
            risques cachés — travaux, impayés, litiges — avant que vous signiez.
            Rapport clair, indépendant, livré en 72h.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/analyse-avant-achat" size="lg">
              Faire analyser ma copropriété
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/#score" variant="secondary" size="lg">
              Découvrir le Score
            </Button>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate">
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-brand" /> 1 200+ lots gérés
            </span>
            <span className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-brand" /> 40 AG / an
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand" /> 100% indépendant
            </span>
          </div>
        </div>

        {/* Colonne jauge */}
        <div className="animate-fade-up [animation-delay:150ms]">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-brand-gradient opacity-10 blur-2xl" />
            <ScoreGauge />
          </div>
        </div>
      </div>
    </section>
  );
}
