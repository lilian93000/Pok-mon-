import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient-dark px-8 py-16 text-center md:px-16 md:py-20">
            <div className="absolute inset-0 bg-hero-glow opacity-60" aria-hidden />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-tightest text-white md:text-[44px] md:leading-[1.1]">
                Votre futur appartement mérite une analyse avant la signature
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
                Rejoignez les acheteurs qui décident en confiance, documents en
                main et risques sous les yeux.
              </p>
              <div className="mt-9 flex justify-center">
                <Button href="/analyse-avant-achat" size="lg">
                  Faire analyser ma copropriété
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
