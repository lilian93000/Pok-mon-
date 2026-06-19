"use client";

import { useEffect, useRef, useState } from "react";
import {
  CRITERIA,
  EXAMPLE_CRITERIA,
  calculateScore,
  getRiskLevel,
  type ScoreCriteria,
} from "@/lib/score";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  criteria?: ScoreCriteria;
  /** Affiche le détail des 7 critères en barres. */
  showBreakdown?: boolean;
  className?: string;
  size?: number;
}

/** Hook : déclenche `true` quand l'élément entre dans le viewport. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

/**
 * Élément signature d'AnalyseTaCopro : la jauge circulaire animée
 * du Score, avec le détail des 7 critères pondérés.
 */
export function ScoreGauge({
  criteria = EXAMPLE_CRITERIA,
  showBreakdown = true,
  className,
  size = 220,
}: ScoreGaugeProps) {
  const score = calculateScore(criteria);
  const risk = getRiskLevel(score);
  const { ref, inView } = useInView<HTMLDivElement>();

  // Animation du nombre affiché.
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(score * eased * 10) / 10);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, score]);

  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = inView ? score / 10 : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-brand/10 bg-surface p-7 shadow-card",
        className
      )}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Jauge circulaire */}
        <div
          className="relative shrink-0"
          style={{ width: size, height: size }}
        >
          <svg width={size} height={size} className="-rotate-90">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B5FFF" />
                <stop offset="100%" stopColor="#4D8BFF" />
              </linearGradient>
            </defs>
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
              stroke="url(#gaugeGrad)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transition:
                  "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold tracking-tightest text-foreground tabular-nums">
              {displayed.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-muted">sur 10</span>
          </div>
        </div>

        {/* Verdict + breakdown */}
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            AnalyseTaCopro Score
          </p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: risk.hex }}
            />
            <span
              className="text-2xl font-extrabold tracking-tightest"
              style={{ color: risk.hex }}
            >
              Copropriété {risk.label.toLowerCase()}
            </span>
          </div>

          {showBreakdown && (
            <div className="mt-5 space-y-3">
              {CRITERIA.map((c, i) => {
                const note = criteria[c.key] ?? 0;
                return (
                  <div key={c.key}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{c.label}</span>
                      <span className="tabular-nums text-muted">
                        {note.toFixed(1)}
                        <span className="ml-1 text-xs text-muted/60">
                          {Math.round(c.weight * 100)}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
                      <div
                        className="h-full rounded-full bg-brand-gradient"
                        style={{
                          width: inView ? `${(note / 10) * 100}%` : "0%",
                          transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${
                            0.1 + i * 0.08
                          }s`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
