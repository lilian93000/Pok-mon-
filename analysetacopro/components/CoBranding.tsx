"use client";

import { useRef, useState } from "react";
import { UploadCloud, Building2 } from "lucide-react";
import { Logo } from "./Logo";

export function CoBranding() {
  const [logo, setLogo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/20 p-8 text-center transition-colors hover:border-brand/40 hover:bg-surface-soft/30"
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo agence" className="max-h-20 object-contain" />
        ) : (
          <>
            <UploadCloud className="h-9 w-9 text-brand" />
            <p className="mt-3 font-semibold text-foreground">
              Importez le logo de votre agence
            </p>
            <p className="mt-1 text-sm text-muted">PNG ou SVG · fond transparent conseillé</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Aperçu fiche co-brandée */}
      <div className="rounded-2xl border border-brand/10 bg-surface p-5 shadow-card">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Aperçu de la fiche
        </p>
        <div className="flex items-center justify-between border-b border-brand/10 pb-3">
          <Logo />
          <span className="text-muted">×</span>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Logo agence" className="max-h-8 object-contain" />
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-muted">
              <Building2 className="h-4 w-4" /> Votre agence
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-muted">
          Chaque fiche vitrine portera votre marque aux côtés du AnalyseTaCopro
          Score, pour rassurer vos acheteurs.
        </p>
      </div>
    </div>
  );
}
