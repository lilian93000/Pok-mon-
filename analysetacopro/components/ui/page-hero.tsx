import { Badge } from "./badge";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

/** Bannière standard en tête des pages internes. */
export function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-night">
      <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
      <div className="container relative py-20 text-center md:py-28">
        {eyebrow && (
          <Badge tone="light" className="mb-5">
            {eyebrow}
          </Badge>
        )}
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tightest text-white md:text-[52px] md:leading-[1.08]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
