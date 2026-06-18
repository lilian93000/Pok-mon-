import Link from "next/link";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Service",
    links: [
      { label: "Analyse avant achat", href: "/analyse-avant-achat" },
      { label: "Pour les agences", href: "/agences" },
      { label: "Tarifs", href: "/tarifs" },
      { label: "Le Score", href: "/#score" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Mentions légales", href: "/mentions-legales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-night text-white/70">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Comprenez. Anticipez. Décidez en confiance.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              L&apos;analyse indépendante de copropriété avant votre achat
              immobilier.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-white/50">
            Service d&apos;analyse documentaire — ne constitue pas un conseil
            juridique, fiscal ou notarial. TVA non applicable, art. 293 B du
            CGI.
          </p>
          <p className="mt-3 text-xs text-white/40">
            © {new Date().getFullYear()} AnalyseTaCopro. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
