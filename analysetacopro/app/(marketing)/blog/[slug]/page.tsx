import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARTICLES, getArticle } from "@/lib/blog";
import { formatDate } from "@/lib/dossier";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: "Article introuvable" };
  return { title: article.title, description: article.excerpt };
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les articles
        </Link>

        <span className="mt-6 inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          {article.category}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tightest text-ink md:text-[42px] md:leading-[1.1]">
          {article.title}
        </h1>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate">
          <Clock className="h-4 w-4" />
          {article.readingTime} min de lecture · {formatDate(article.date)}
        </p>

        <div className="mt-10 space-y-6">
          {article.content.map((block, i) => {
            if (block.type === "h2")
              return (
                <h2
                  key={i}
                  className="pt-2 text-2xl font-extrabold tracking-tightest text-ink"
                >
                  {block.text}
                </h2>
              );
            if (block.type === "ul")
              return (
                <ul key={i} className="space-y-2">
                  {block.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-slate">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span className="leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>
              );
            if (block.type === "quote")
              return (
                <blockquote
                  key={i}
                  className="rounded-2xl border-l-4 border-brand bg-brand-soft/50 p-5 text-lg font-medium italic text-ink"
                >
                  {block.text}
                </blockquote>
              );
            return (
              <p key={i} className="text-lg leading-relaxed text-slate">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-brand-gradient-dark p-8 text-center text-white">
          <h3 className="text-xl font-extrabold tracking-tightest">
            Une copropriété en vue ?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-white/70">
            Faites-la analyser avant de signer. Rapport clair et indépendant en
            72h.
          </p>
          <div className="mt-5 flex justify-center">
            <Button href="/analyse-avant-achat">
              Faire analyser ma copropriété
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
