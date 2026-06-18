import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/Reveal";
import { ARTICLES } from "@/lib/blog";
import { formatDate } from "@/lib/dossier";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conseils et guides pour comprendre la copropriété avant un achat immobilier : documents, finances, travaux, pièges à éviter.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Ressources"
        title="Comprendre la copropriété"
        subtitle="Nos guides pour décrypter les documents, anticiper les risques et acheter en confiance."
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-brand/10 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <span className="inline-flex w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                  {a.category}
                </span>
                <h2 className="mt-4 text-xl font-bold leading-snug text-ink">
                  {a.title}
                </h2>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate">
                  {a.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm text-slate">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {a.readingTime} min · {formatDate(a.date)}
                  </span>
                  <ArrowRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
