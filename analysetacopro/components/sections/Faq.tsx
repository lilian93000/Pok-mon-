"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

export const DEFAULT_FAQ: FaqItem[] = [
  {
    q: "Vous remplacez le notaire ou le diagnostic ?",
    a: "Non, nous sommes complémentaires. Le notaire sécurise la vente, les diagnostics évaluent le logement. Nous, nous analysons la santé de la copropriété — un angle mort que personne ne couvre.",
  },
  {
    q: "Quels documents dois-je transmettre ?",
    a: "Les PV des 3 dernières AG, le règlement de copropriété, le pré-état daté, le carnet d'entretien et les annexes comptables. Nous vous guidons pas à pas.",
  },
  {
    q: "Quel est le délai de réception ?",
    a: "72h pour la formule Essentiel, 48h pour Premium et Investisseur. Une option Urgence permet une livraison en 24h.",
  },
  {
    q: "Mes documents sont-ils confidentiels ?",
    a: "Oui, strictement. Vos documents sont stockés de façon chiffrée et peuvent être supprimés après la livraison de votre rapport, sur simple demande.",
  },
  {
    q: "Pourquoi êtes-vous vraiment indépendant ?",
    a: "Parce que nous ne touchons aucune commission sur la vente. Nous ne sommes ni agence, ni syndic, ni notaire. Notre seul client, c'est vous — l'acheteur.",
  },
];

interface FaqProps {
  items?: FaqItem[];
  withHeader?: boolean;
}

export function Faq({ items = DEFAULT_FAQ, withHeader = true }: FaqProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      {withHeader && (
        <SectionHeader
          eyebrow="FAQ"
          title="Vos questions, nos réponses"
          subtitle="Tout ce qu'il faut savoir avant de nous confier votre analyse."
        />
      )}

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className="overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-card"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-ink">{item.q}</span>
                <Plus
                  className={cn(
                    "h-5 w-5 shrink-0 text-brand transition-transform duration-300",
                    isOpen && "rotate-45"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 leading-relaxed text-slate">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
