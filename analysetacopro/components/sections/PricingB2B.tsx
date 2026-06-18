import { Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { PACKS_B2B } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface PricingB2BProps {
  withHeader?: boolean;
  className?: string;
}

export function PricingB2B({ withHeader = true, className }: PricingB2BProps) {
  return (
    <Section id="agences" className={className}>
      {withHeader && (
        <SectionHeader
          eyebrow="Agences immobilières"
          title="Des fiches vitrines co-brandées qui rassurent vos acheteurs"
          subtitle="Offrez à vos clients une analyse indépendante à votre image. Co-branding inclus, fiches valables 12 mois."
        />
      )}

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {PACKS_B2B.map((pack, i) => (
          <Reveal key={pack.id} delay={i * 60}>
            <div
              className={cn(
                "relative flex h-full flex-col rounded-3xl border p-6 text-center transition-all duration-300",
                pack.highlighted
                  ? "border-brand bg-brand-night text-white shadow-soft-lg lg:-translate-y-2"
                  : "border-brand/10 bg-white text-ink shadow-card hover:-translate-y-1"
              )}
            >
              {pack.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-0.5 text-[11px] font-bold text-white">
                  Populaire
                </span>
              )}
              <h3 className="text-base font-bold">{pack.name}</h3>
              <p
                className={cn(
                  "mt-1 text-sm",
                  pack.highlighted ? "text-white/60" : "text-slate"
                )}
              >
                {pack.sheets} {pack.sheets > 1 ? "fiches" : "fiche"}
              </p>
              <div className="mt-4">
                <span className="text-3xl font-extrabold tracking-tightest">
                  {pack.priceHT}
                </span>
                <span className="text-lg font-bold"> €</span>
                <span
                  className={cn(
                    "block text-xs",
                    pack.highlighted ? "text-white/50" : "text-slate"
                  )}
                >
                  HT
                </span>
              </div>
              <p
                className={cn(
                  "mt-3 text-sm font-semibold",
                  pack.highlighted ? "text-brand-bright" : "text-brand"
                )}
              >
                {pack.perSheet} € / fiche
              </p>
              <Button
                href="/contact"
                variant={pack.highlighted ? "primary" : "secondary"}
                size="sm"
                className="mt-5 w-full"
              >
                Commander
              </Button>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate">
          {[
            "Co-branding inclus (votre logo)",
            "Fiches valables 12 mois",
            "Facturation HT entreprise",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              {f}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
