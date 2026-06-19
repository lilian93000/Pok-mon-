interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export function LegalContent({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="container max-w-3xl py-16 md:py-20">
      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-extrabold tracking-tightest text-foreground">
              {s.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {s.paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
        <p className="border-t border-brand/10 pt-6 text-sm text-muted/70">
          Service d&apos;analyse documentaire. Ne constitue pas un conseil
          juridique, fiscal ou notarial. TVA non applicable, art. 293 B du CGI.
        </p>
      </div>
    </div>
  );
}
