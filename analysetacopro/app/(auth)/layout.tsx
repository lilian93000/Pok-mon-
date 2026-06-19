import Link from "next/link";
import { ShieldCheck, FileCheck2, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panneau marque */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient-dark p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-hero-glow opacity-60" aria-hidden />
        <Link href="/" className="relative">
          <Logo variant="light" />
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tightest">
            Comprenez. Anticipez.
            <br />
            Décidez en confiance.
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              { icon: ShieldCheck, t: "100% indépendant", s: "Aucune commission sur la vente." },
              { icon: FileCheck2, t: "Rapport clair en 72h", s: "Le AnalyseTaCopro Score sur 10." },
              { icon: Lock, t: "Confidentiel", s: "Vos documents chiffrés et protégés." },
            ].map((f) => (
              <li key={f.t} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface/10">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{f.t}</p>
                  <p className="text-sm text-white/60">{f.s}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/40">
          © {new Date().getFullYear()} AnalyseTaCopro
        </p>
      </div>

      {/* Formulaire */}
      <div className="relative flex items-center justify-center p-6 sm:p-12">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Logo />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
