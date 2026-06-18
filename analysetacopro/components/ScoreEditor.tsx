"use client";

import { useState } from "react";
import { Save, RotateCcw, Check } from "lucide-react";
import {
  CRITERIA,
  calculateScore,
  getRiskLevel,
  type CriterionKey,
  type ScoreCriteria,
} from "@/lib/score";
import { ScoreGauge } from "@/components/ScoreGauge";

const EMPTY: ScoreCriteria = {
  finances: 5,
  travaux: 5,
  gestion: 5,
  contentieux: 5,
  impayes: 5,
  energie: 5,
  transparence: 5,
};

export function ScoreEditor({
  initial = EMPTY,
  dossierLabel,
}: {
  initial?: ScoreCriteria;
  dossierLabel?: string;
}) {
  const [criteria, setCriteria] = useState<ScoreCriteria>(initial);
  const [saved, setSaved] = useState(false);

  const score = calculateScore(criteria);
  const risk = getRiskLevel(score);

  const set = (key: CriterionKey, value: number) => {
    setCriteria((c) => ({ ...c, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Saisie des 7 notes */}
      <div className="rounded-3xl border border-brand/10 bg-white p-6 shadow-card">
        <h3 className="font-bold text-ink">
          Saisie des notes{dossierLabel ? ` — ${dossierLabel}` : ""}
        </h3>
        <p className="mt-1 text-sm text-slate">
          Le score global est calculé automatiquement (pondération du brief).
        </p>

        <div className="mt-5 space-y-5">
          {CRITERIA.map((c) => (
            <div key={c.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-ink">
                  {c.label}{" "}
                  <span className="text-xs text-slate">
                    ({Math.round(c.weight * 100)}%)
                  </span>
                </label>
                <span className="tabular-nums text-sm font-bold text-brand">
                  {criteria[c.key].toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={criteria[c.key]}
                onChange={(e) => set(c.key, parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-soft accent-brand"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              setSaved(true);
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:shadow-soft-lg"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" /> Score enregistré
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Enregistrer le score
              </>
            )}
          </button>
          <button
            onClick={() => {
              setCriteria(initial);
              setSaved(false);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand/15 px-5 py-3 text-sm font-semibold text-slate transition hover:text-brand"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Aperçu live */}
      <div className="space-y-4">
        <div className="rounded-3xl bg-brand-night p-5 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Score calculé
          </p>
          <p
            className="mt-1 text-5xl font-extrabold tracking-tightest tabular-nums"
            style={{ color: risk.hex }}
          >
            {score.toFixed(1)}
            <span className="text-2xl text-white/40">/10</span>
          </p>
          <p className="mt-1 font-semibold" style={{ color: risk.hex }}>
            Copropriété {risk.label.toLowerCase()}
          </p>
        </div>
        <ScoreGauge criteria={criteria} />
      </div>
    </div>
  );
}
