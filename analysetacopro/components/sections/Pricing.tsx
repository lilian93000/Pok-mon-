import { Check, Zap, Star } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { OFFERS_B2C, OPTION_URGENCE } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface PricingProps {
  withHeader?: boolean;
  className?: string;
}

export function Pricing({ withHeader = true, className }: PricingProps) {
  return (
    <Section id="tarifs" className={className}>
      {withHeader && (
        <SectionHeader
          eyebrow="Particuliers & investisseurs"
          title="Une analyse, trois niveaux d'accompagnement"
          subtitle="Paiement unique, sans abonnement. Rapport indépendant livré rapidement."
        />
      )}

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {OFFERS_B2C.map((offer, i) => (
          <Reveal key={offer.id} delay={i * 90}>
            <div
              className={cn(
                "relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300",
                offer.highlighted
                  ? "border-brand bg-brand-night text-white shadow-soft-lg lg:-translate-y-3"
                  : "border-brand/10 bg-white text-ink shadow-card hover:-translate-y-1 hover:shadow-soft-lg"
              )}
            >
              {offer.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-4 py-1 text-xs font-bold text-white shadow-soft">
                  <Star className="mr-1 inline h-3 w-3 fill-current" />
                  Le plus choisi
                </span>
              )}
              <h3
                className={cn(
                  "text-lg font-bold",
                  offer.highlighted ? "text-white" : "text-ink"
                )}
              >
                {offer.name}
              </h3>
              <p
                className={cn(
                  "mt-1 text-sm",
                  offer.highlighted ? "text-white/70" : "text-slate"
                )}
              >
                {offer.description}
              </p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tightest">
                  {offer.price}
                </span>
                <span className="mb-1 text-xl font-bold">{offer.unit}</span>
              </div>
              <p
                className={cn(
                  "mt-1 text-sm font-medium",
                  offer.highlighted ? "text-brand-bright" : "text-brand"
                )}
              >
                {offer.delivery}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {offer.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px]">
                    <Check
                      className={cn(
                        "mt-0.5 h-5 w-5 shrink-0",
                        offer.highlighted ? "text-success" : "text-brand"
                      )}
                    />
                    <span
                      className={
                        offer.highlighted ? "text-white/90" : "text-ink/80"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                href={`/offres/${offer.id}`}
                variant={offer.highlighted ? "primary" : "secondary"}
                className="mt-7 w-full"
              >
                Choisir {offer.name}
              </Button>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-amber/20 bg-amber/5 px-6 py-4 text-center">
          <Zap className="h-5 w-5 shrink-0 text-amber" />
          <p className="text-sm text-ink">
            <span className="font-semibold">{OPTION_URGENCE.name} :</span>{" "}
            {OPTION_URGENCE.description}{" "}
            <span className="font-semibold text-amber">
              +{OPTION_URGENCE.price} €
            </span>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
