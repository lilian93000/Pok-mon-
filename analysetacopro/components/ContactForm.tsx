"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const inputCls =
  "w-full rounded-2xl border border-brand/15 bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    // Site statique (GitHub Pages) : pas de backend → on ouvre la
    // messagerie du visiteur (mailto), honnête et fonctionnel.
    if (process.env.NEXT_PUBLIC_STATIC === "true") {
      const to = "contact@analysetacopro.fr";
      const subject = encodeURIComponent(
        `[Contact] ${data.subject || "Nouveau message"} — ${data.name || ""}`
      );
      const body = encodeURIComponent(
        `Nom : ${data.name || ""}\nEmail : ${data.email || ""}\nTéléphone : ${
          data.phone || "—"
        }\n\n${data.message || ""}`
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-success/20 bg-success/5 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h3 className="text-xl font-bold text-foreground">Message envoyé !</h3>
        <p className="max-w-sm text-muted">
          Merci de nous avoir contactés. Nous vous répondons généralement sous
          24h ouvrées.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-brand hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-brand/10 bg-surface p-7 shadow-card"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Nom *
          </label>
          <input name="name" required className={inputCls} placeholder="Jean Dupont" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className={inputCls}
            placeholder="jean@email.fr"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Téléphone
          </label>
          <input name="phone" className={inputCls} placeholder="06 12 34 56 78" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Sujet
          </label>
          <input
            name="subject"
            className={inputCls}
            placeholder="Analyse avant achat"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className={cn(inputCls, "resize-none")}
          placeholder="Décrivez votre projet ou votre question…"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient font-semibold text-white shadow-soft transition hover:shadow-soft-lg disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Envoi…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> Envoyer le message
          </>
        )}
      </button>
      <p className="text-center text-xs text-muted">
        En envoyant ce formulaire, vous acceptez notre politique de
        confidentialité. Vos données ne sont jamais revendues.
      </p>
    </form>
  );
}
