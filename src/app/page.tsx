import { ScoreGauge } from "@/components/score-gauge";
import { calculateScore, type ScoreCriteria } from "@/lib/score";

// Jeu de données d'exemple pour la démonstration (Phase 1).
const demoCriteria: ScoreCriteria = {
  finances: 8.6,
  travaux: 7.8,
  gestion: 9.0,
  contentieux: 8.5,
  impayes: 8.0,
  energie: 7.5,
  transparence: 9.2,
};

const palette = [
  { name: "Bleu principal", className: "bg-brand", hex: "#0B5FFF" },
  { name: "Bleu foncé", className: "bg-brand-dark", hex: "#0A3D9E" },
  { name: "Bleu nuit", className: "bg-brand-night", hex: "#061A4A" },
  { name: "Bleu lumineux", className: "bg-brand-bright", hex: "#4D8BFF" },
  { name: "Bleu clair", className: "bg-brand-soft", hex: "#E8F0FF" },
  { name: "Succès", className: "bg-success", hex: "#12B981" },
  { name: "Ambre", className: "bg-amber", hex: "#F5A524" },
  { name: "Rouge", className: "bg-danger", hex: "#EF4444" },
];

export default function Home() {
  const score = calculateScore(demoCriteria);

  return (
    <main className="flex-1">
      {/* En-tête bleu nuit */}
      <header className="bg-brand-night text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-lg font-black">
            ⌶
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            AnalyseTaCopro
          </span>
          <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            Phase 1 · Fondations
          </span>
        </div>
      </header>

      {/* Hero + jauge */}
      <section className="bg-brand-soft">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand shadow-card">
              Comprenez. Anticipez. Décidez en confiance.
            </p>
            <h1 className="text-4xl leading-tight text-ink md:text-5xl">
              N&apos;achetez pas un appartement sans analyser sa copropriété.
            </h1>
            <p className="mt-4 max-w-md text-lg text-slate">
              Élément signature : le <strong>AnalyseTaCopro Score</strong>, une
              note de risque sur 10 calculée à partir de 7 critères pondérés.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-soft transition hover:opacity-90">
                Faire analyser ma copropriété
              </button>
              <button className="rounded-full bg-white px-6 py-3 font-semibold text-brand shadow-card transition hover:bg-brand-soft">
                Découvrir le Score
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-soft">
            <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-slate">
              Le AnalyseTaCopro Score
            </h2>
            <ScoreGauge score={score} criteria={demoCriteria} />
          </div>
        </div>
      </section>

      {/* Palette du design system */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl text-ink">Design system</h2>
        <p className="mt-1 text-slate">
          Palette de marque, typographie Inter (titres 800, letter-spacing
          −0.02em), coins arrondis et ombres bleutées.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {palette.map((c) => (
            <div
              key={c.name}
              className="overflow-hidden rounded-xl bg-white shadow-card"
            >
              <div className={`${c.className} h-20`} />
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-ink">{c.name}</p>
                <p className="text-xs text-slate">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-brand-night text-white/70">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm">
          <p className="font-semibold text-white">AnalyseTaCopro</p>
          <p className="mt-2 max-w-2xl text-xs">
            Service d&apos;analyse documentaire — ne constitue pas un conseil
            juridique, fiscal ou notarial.
          </p>
        </div>
      </footer>
    </main>
  );
}
