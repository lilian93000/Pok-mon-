"use client";

import { useEffect, useRef, useState } from "react";
import {
  CRITERIA_META,
  CRITERIA_ORDER,
  getRiskLevel,
  type ScoreCriteria,
} from "@/lib/score";
import { cn } from "@/lib/utils";

type ScoreGaugeProps = {
  /** Score global sur 10 (l'élément central). */
  score: number;
  /** Notes détaillées des 7 critères (affichées en barres). Optionnel. */
  criteria?: ScoreCriteria;
  /** Diamètre du cadran en pixels. */
  size?: number;
  /** Affiche ou non le détail des critères. */
  showCriteria?: boolean;
  className?: string;
};

/**
 * Élément signature : jauge circulaire animée du AnalyseTaCopro Score,
 * avec le détail des 7 critères en barres de progression colorées.
 */
export function ScoreGauge({
  score,
  criteria,
  size = 220,
  showCriteria = true,
  className,
}: ScoreGaugeProps) {
  const clamped = Math.min(10, Math.max(0, score));
  const risk = getRiskLevel(clamped);

  const stroke = Math.round(size * 0.075);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = clamped / 10;

  // Animation : on part de 0 puis on anime vers la valeur cible.
  const [progress, setProgress] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1100;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = ease(t);
      setProgress(fraction * eased);
      setDisplayScore(clamped * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fraction, clamped]);

  const offset = circumference * (1 - progress);

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`AnalyseTaCopro Score : ${clamped.toFixed(1)} sur 10, copropriété ${risk.label.toLowerCase()}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E8F0FF"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={risk.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-extrabold tracking-tight tabular-nums"
            style={{ color: risk.color }}
          >
            {displayScore.toFixed(1)}
          </span>
          <span className="text-sm font-medium text-slate">/ 10</span>
          <span
            className="mt-1 rounded-full px-3 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: risk.color }}
          >
            {risk.label}
          </span>
        </div>
      </div>

      {showCriteria && criteria && (
        <div className="w-full max-w-sm space-y-3">
          {CRITERIA_ORDER.map((key) => {
            const meta = CRITERIA_META[key];
            const note = Math.min(10, Math.max(0, criteria[key] ?? 0));
            const noteRisk = getRiskLevel(note);
            return (
              <div key={key}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="font-medium text-ink">
                    {meta.label}
                    <span className="ml-1.5 text-xs font-normal text-slate">
                      {meta.weightPct}%
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums text-ink">
                    {note.toFixed(1)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
                  <div
                    className="h-full rounded-full transition-[width] duration-1000 ease-out"
                    style={{
                      width: `${(note / 10) * 100}%`,
                      backgroundColor: noteRisk.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
