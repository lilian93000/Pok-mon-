type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

interface LegalContentProps {
  sections: LegalSection[];
  intro?: string;
  updatedAt?: string;
}

export function LegalContent({ sections, intro, updatedAt }: LegalContentProps) {
  return (
    <div className="container max-w-3xl py-16 md:py-20">
      {(intro || updatedAt) && (
        <div className="mb-10 rounded-2xl border border-brand/10 bg-surface-soft/40 p-5">
          {updatedAt && (
            <p className="text-sm font-medium text-brand">
              Dernière mise à jour : {updatedAt}
            </p>
          )}
          {intro && (
            <p className="mt-1 leading-relaxed text-muted">{intro}</p>
          )}
        </div>
      )}

      <div className="space-y-9">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-extrabold tracking-tightest text-foreground">
              {s.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {s.blocks.map((b, i) =>
                b.type === "p" ? (
                  <p key={i} className="leading-relaxed text-muted">
                    {b.text}
                  </p>
                ) : (
                  <ul key={i} className="space-y-2">
                    {b.items.map((it, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span className="leading-relaxed">{it}</span>
                      </li>
                    ))}
                  </ul>
                )
              )}
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
