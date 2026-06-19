import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, Clock, Users, Star, Zap } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Faq } from "@/components/sections/Faq";
import {
  OFFERS_B2C,
  OFFER_DETAILS,
  OPTION_URGENCE,
  getOffer,
} from "@/lib/pricing";

export function generateStaticParams() {
  return OFFERS_B2C.map((o) => ({ id: o.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const offer = getOffer(params.id);
  if (!offer) return { title: "Offre introuvable" };
  return {
    title: `Formule ${offer.name} — ${offer.price} €`,
    description: OFFER_DETAILS[params.id]?.tagline,
  };
}

export default function OffrePage({ params }: { params: { id: string } }) {
  const offer = getOffer(params.id);
  const detail = OFFER_DETAILS[params.id];
  if (!offer || !detail) notFound();

  return (
    <>
      <PageHero
        eyebrow={`Formule ${offer.name}`}
        title={detail.tagline}
        subtitle={`${offer.price} € · ${offer.delivery} · paiement unique, sans abonnement.`}
      />

      <Section>
        <Link
          href="/tarifs"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Toutes les formules
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Colonne contenu */}
          <div>
            {offer.highlighted && (
              <Badge className="mb-4">
                <Star className="h-4 w-4 fill-current" />
                Notre formule la plus choisie
              </Badge>
            )}
            <p className="text-lg leading-relaxed text-slate">{detail.intro}</p>

            {detail.highlight && (
              <p className="mt-6 rounded-2xl border-l-4 border-brand bg-brand-soft/50 p-4 font-medium text-ink">
                {detail.highlight}
              </p>
            )}

            {/* À qui ça s'adresse */}
            <div className="mt-10">
              <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tightest text-ink">
                <Users className="h-5 w-5 text-brand" />
                Pour qui ?
              </h2>
              <ul className="mt-4 space-y-2.5">
                {detail.forWho.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-slate">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ce qui est inclus */}
            <div className="mt-10">
              <h2 className="text-xl font-extrabold tracking-tightest text-ink">
                Ce qui est inclus, en détail
              </h2>
              <div className="mt-5 space-y-3">
                {detail.includes.map((inc) => (
                  <div
                    key={inc.title}
                    className="rounded-2xl border border-brand/10 bg-white p-5 shadow-card"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                        <Check className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-bold text-ink">{inc.title}</h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-slate">
                          {inc.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-amber/20 bg-amber/5 px-5 py-4">
              <Zap className="h-5 w-5 shrink-0 text-amber" />
              <p className="text-sm text-ink">
                Besoin du rapport plus vite ?{" "}
                <span className="font-semibold">
                  Option Urgence (24h) : +{OPTION_URGENCE.price} €
                </span>{" "}
                à ajouter lors de la commande.
              </p>
            </div>
          </div>

          {/* Colonne récap / CTA (sticky) */}
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="rounded-3xl border border-brand/10 bg-white p-7 shadow-card">
                <h3 className="text-lg font-bold text-ink">
                  Formule {offer.name}
                </h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-extrabold tracking-tightest text-ink">
                    {offer.price}
                  </span>
                  <span className="mb-1 text-xl font-bold text-ink">
                    {offer.unit}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-brand">
                  <Clock className="h-4 w-4" />
                  {offer.delivery}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {offer.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span className="text-ink/80">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button href="/dashboard/nouveau" className="mt-6 w-full">
                  Commander cette formule
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  href="/contact"
                  variant="secondary"
                  className="mt-3 w-full"
                >
                  Poser une question
                </Button>
                <p className="mt-4 text-center text-xs text-slate">
                  Paiement unique · TVA non applicable (art. 293 B du CGI)
                </p>
              </div>

              <ScoreGauge showBreakdown={false} size={180} />
            </div>
          </div>
        </div>
      </Section>

      <Faq />
    </>
  );
}
