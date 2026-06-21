"use client";

import { useCallback, useRef, useState } from "react";
import {
  MapPin,
  Building2,
  Warehouse,
  Car,
  UploadCloud,
  CreditCard,
  CheckCircle2,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Zap,
  FileText,
  Lock,
} from "lucide-react";
import { OFFERS_B2C, OPTION_URGENCE } from "@/lib/pricing";
import { TYPE_BIEN_LABEL, formatPoids, type TypeBien } from "@/lib/dossier";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Adresse" },
  { n: 2, label: "Type de bien" },
  { n: 3, label: "Documents" },
  { n: 4, label: "Formule" },
  { n: 5, label: "Paiement" },
  { n: 6, label: "Confirmation" },
];

const TYPES: { value: TypeBien; icon: typeof Building2 }[] = [
  { value: "APPARTEMENT", icon: Building2 },
  { value: "LOCAL", icon: Warehouse },
  { value: "PARKING", icon: Car },
];

const inputCls =
  "w-full rounded-2xl border border-brand/15 bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  file: File;
}

// Clé Web3Forms (reçue par email après inscription sur web3forms.com).
// Permet d'envoyer chaque commande par email, sans serveur.
const WEB3FORMS_KEY = "7affa5b5-f488-4288-b4c1-1d72e2fbf310";

export function DossierWizard() {
  const [step, setStep] = useState(1);
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [typeBien, setTypeBien] = useState<TypeBien>("APPARTEMENT");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [formuleId, setFormuleId] = useState("premium");
  const [urgence, setUrgence] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formule = OFFERS_B2C.find((o) => o.id === formuleId)!;
  const total = formule.price + (urgence ? OPTION_URGENCE.price : 0);

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      file: f,
    }));
    setFiles((prev) => [...prev, ...next]);
  }, []);

  const emailValide = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const canNext = () => {
    if (step === 1)
      return (
        !!adresse &&
        !!ville &&
        /^\d{5}$/.test(codePostal) &&
        !!nom &&
        emailValide &&
        telephone.replace(/\D/g, "").length >= 9
      );
    if (step === 3) return files.length > 0;
    return true;
  };

  const next = () => setStep((s) => Math.min(6, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  // Envoi de la commande par email (via Web3Forms) — sans serveur.
  async function submitOrder() {
    if (!WEB3FORMS_KEY) return;
    try {
      // FormData (multipart) : permet de joindre les documents à l'email.
      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_KEY);
      fd.append("subject", `Nouvelle commande — ${formule.name} — ${nom}`);
      fd.append("from_name", "AnalyseTaCopro");
      fd.append("Nom", nom);
      fd.append("Email", email);
      fd.append("Téléphone", telephone);
      fd.append("Adresse", `${adresse}, ${codePostal} ${ville}`);
      fd.append("Type de bien", TYPE_BIEN_LABEL[typeBien]);
      fd.append("Formule", formule.name);
      fd.append("Option urgence", urgence ? `Oui (+${OPTION_URGENCE.price} €)` : "Non");
      fd.append("Total", `${total} €`);
      fd.append(
        "Documents",
        files.map((f) => f.name).join(", ") || "(aucun)"
      );
      // Pièces jointes : on attache chaque fichier réellement téléversé.
      files.forEach((f, i) => {
        fd.append(`Document ${i + 1}`, f.file, f.name);
      });
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });
    } catch {
      /* on n'empêche pas la confirmation si l'email échoue */
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Indicateur d'étapes */}
      <ol className="mb-8 flex items-center">
        {STEPS.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <li key={s.n} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    done && "bg-success text-white",
                    active && "bg-brand-gradient text-white shadow-soft",
                    !done && !active && "bg-surface-soft text-muted"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : s.n}
                </span>
                <span
                  className={cn(
                    "mt-1.5 hidden text-[11px] font-medium sm:block",
                    active ? "text-brand" : "text-muted"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full transition-colors sm:mx-2",
                    step > s.n ? "bg-success" : "bg-surface-soft"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-brand/10 bg-surface p-7 shadow-card md:p-9">
        {/* Étape 1 — Adresse */}
        {step === 1 && (
          <div className="animate-fade-up">
            <StepTitle icon={MapPin} title="Adresse du bien" sub="Où se situe la copropriété à analyser ?" />
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Adresse
                </label>
                <input
                  className={inputCls}
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="12 rue des Lilas"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Ville
                  </label>
                  <input
                    className={inputCls}
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    placeholder="Lyon"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Code postal
                  </label>
                  <input
                    className={inputCls}
                    value={codePostal}
                    inputMode="numeric"
                    maxLength={5}
                    onChange={(e) =>
                      setCodePostal(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="69003"
                  />
                </div>
              </div>

              {/* Coordonnées du client */}
              <div className="mt-2 border-t border-brand/10 pt-5">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Vos coordonnées{" "}
                  <span className="font-normal text-muted">
                    (pour vous envoyer le rapport et vous recontacter)
                  </span>
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Nom complet
                    </label>
                    <input
                      className={inputCls}
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        className={inputCls}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean@email.fr"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        className={inputCls}
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 2 — Type de bien */}
        {step === 2 && (
          <div className="animate-fade-up">
            <StepTitle
              icon={Building2}
              title="Type de bien"
              sub="Quel type de lot achetez-vous dans cette copropriété ?"
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {TYPES.map((t) => {
                const selected = typeBien === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTypeBien(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all",
                      selected
                        ? "border-brand bg-surface-soft/60"
                        : "border-brand/10 hover:border-brand/30"
                    )}
                  >
                    <t.icon
                      className={cn(
                        "h-8 w-8",
                        selected ? "text-brand" : "text-muted"
                      )}
                    />
                    <span className="text-sm font-semibold text-foreground">
                      {TYPE_BIEN_LABEL[t.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Étape 3 — Documents */}
        {step === 3 && (
          <div className="animate-fade-up">
            <StepTitle
              icon={UploadCloud}
              title="Téléversement des documents"
              sub="PV d'AG, règlement, pré-état daté, carnet d'entretien, comptes…"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
                dragging
                  ? "border-brand bg-surface-soft/60"
                  : "border-brand/20 hover:border-brand/40 hover:bg-surface-soft/30"
              )}
            >
              <UploadCloud className="h-10 w-10 text-brand" />
              <p className="mt-3 font-semibold text-foreground">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="mt-1 text-sm text-muted">
                ou cliquez pour parcourir · PDF, DOCX, PNG, JPG · jusqu&apos;à
                100 Mo
              </p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-3 rounded-xl border border-brand/10 bg-surface-soft/40 px-4 py-2.5"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-brand" />
                    <span className="flex-1 truncate text-sm text-foreground">
                      {f.name}
                    </span>
                    <span className="text-xs text-muted">
                      {formatPoids(f.size)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles((prev) => prev.filter((x) => x.id !== f.id));
                      }}
                      className="text-muted transition-colors hover:text-danger"
                      aria-label="Retirer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Étape 4 — Formule */}
        {step === 4 && (
          <div className="animate-fade-up">
            <StepTitle
              icon={FileText}
              title="Choix de la formule"
              sub="Sélectionnez le niveau d'analyse adapté à votre projet."
            />
            <div className="mt-6 space-y-3">
              {OFFERS_B2C.map((o) => {
                const selected = formuleId === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setFormuleId(o.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                      selected
                        ? "border-brand bg-surface-soft/60"
                        : "border-brand/10 hover:border-brand/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2",
                          selected
                            ? "border-brand bg-brand"
                            : "border-brand/30"
                        )}
                      >
                        {selected && (
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        )}
                      </span>
                      <div>
                        <p className="font-bold text-foreground">{o.name}</p>
                        <p className="text-sm text-muted">{o.delivery}</p>
                      </div>
                    </div>
                    <span className="text-lg font-extrabold text-foreground">
                      {o.price} €
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => setUrgence((v) => !v)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                  urgence ? "border-amber bg-amber/5" : "border-brand/10 hover:border-amber/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border-2",
                      urgence ? "border-amber bg-amber" : "border-brand/30"
                    )}
                  >
                    {urgence && (
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber" />
                    <div>
                      <p className="font-bold text-foreground">{OPTION_URGENCE.name}</p>
                      <p className="text-sm text-muted">Livraison en 24h</p>
                    </div>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-amber">
                  +{OPTION_URGENCE.price} €
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Étape 5 — Paiement */}
        {step === 5 && (
          <div className="animate-fade-up">
            <StepTitle
              icon={CreditCard}
              title="Paiement sécurisé"
              sub="Réglez votre commande en toute sécurité (Stripe)."
            />
            <div className="mt-6 rounded-2xl bg-surface-soft/50 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Formule {formule.name}</span>
                <span className="font-semibold text-foreground">
                  {formule.price} €
                </span>
              </div>
              {urgence && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted">Option Urgence (24h)</span>
                  <span className="font-semibold text-foreground">
                    {OPTION_URGENCE.price} €
                  </span>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-brand/10 pt-3">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-xl font-extrabold text-brand">
                  {total} €
                </span>
              </div>
              <p className="mt-1 text-right text-xs text-muted">
                TVA non applicable, art. 293 B du CGI
              </p>
            </div>

            <div className="mt-5 space-y-4 opacity-90">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Numéro de carte
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-brand/15 px-4 py-3">
                  <CreditCard className="h-5 w-5 text-muted" />
                  <span className="text-muted">4242 4242 4242 4242</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-brand/15 px-4 py-3 text-muted">
                  12 / 28
                </div>
                <div className="rounded-2xl border border-brand/15 px-4 py-3 text-muted">
                  CVC
                </div>
              </div>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
              <Lock className="h-3.5 w-3.5" />
              Paiement chiffré — démo (brancher Stripe en Phase 8).
            </p>
          </div>
        )}

        {/* Étape 6 — Confirmation */}
        {step === 6 && (
          <div className="animate-fade-up text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tightest text-foreground">
              Dossier créé avec succès !
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Nous avons bien reçu vos {files.length} document
              {files.length > 1 ? "s" : ""} pour le bien situé{" "}
              <span className="font-semibold text-foreground">
                {adresse}, {ville}
              </span>
              . Un email de confirmation vous a été envoyé à{" "}
              <span className="font-semibold text-foreground">{email}</span>.
            </p>
            <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl bg-surface-soft/50 p-5 text-left text-sm">
              <Row label="Nom" value={nom} />
              <Row label="Email" value={email} />
              <Row label="Téléphone" value={telephone} />
              <Row label="Formule" value={formule.name} />
              <Row label="Type de bien" value={TYPE_BIEN_LABEL[typeBien]} />
              <Row label="Documents" value={`${files.length} fichier(s)`} />
              <Row label="Total réglé" value={`${total} €`} strong />
            </div>
            <div className="mt-7 flex justify-center">
              <Button href="/">
                Retour à l'accueil
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 6 && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={prev}
              disabled={step === 1}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors",
                step === 1
                  ? "invisible"
                  : "text-muted hover:bg-surface-soft hover:text-brand"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
            <button
              onClick={() => {
                if (step === 5) submitOrder();
                next();
              }}
              disabled={!canNext()}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-gradient px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:shadow-soft-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 5 ? "Payer et confirmer" : "Continuer"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepTitle({
  icon: Icon,
  title,
  sub,
}: {
  icon: typeof MapPin;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-soft">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold tracking-tightest text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted">{sub}</p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={cn("text-foreground", strong ? "font-extrabold text-brand" : "font-semibold")}>
        {value}
      </span>
    </div>
  );
}
