import { Section, SectionHeader } from "@/components/ui/section";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Reveal } from "@/components/Reveal";
import { CRITERIA, RISK_LEVELS } from "@/lib/score";

export function ScoreSection() {
  return (
    <Section id="score" className="bg-brand-night text-white">
      <SectionHeader
        light
        eyebrow="L'élément central"
        title="Le AnalyseTaCopro Score"
        subtitle="Une note unique sur 10, synthèse de 7 critères pondérés. Pour comprendre en un coup d'œil la santé d'une copropriété."
      />

      <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <ScoreGauge />
        </Reveal>

        <Reveal delay={100}>
          <div>
            <h3 className="text-xl font-bold text-white">
              7 critères, une méthode rigoureuse
            </h3>
            <ul className="mt-5 space-y-3">
              {CRITERIA.map((c) => (
                <li
                  key={c.key}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-surface/5 px-5 py-3.5"
                >
                  <div>
                    <p className="font-semibold text-white">{c.label}</p>
                    <p className="text-sm text-white/60">{c.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-bright/20 px-3 py-1 text-sm font-bold text-brand-bright">
                    {Math.round(c.weight * 100)}%
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {RISK_LEVELS.map((lvl) => (
                <span
                  key={lvl.label}
                  className="inline-flex items-center gap-2 rounded-full bg-surface/5 px-3 py-1.5 text-xs font-medium text-white/80"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: lvl.hex }}
                  />
                  {lvl.label}
                  <span className="text-white/40">
                    {lvl.min}–{lvl.max}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
