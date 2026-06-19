"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Avant achat", href: "/analyse-avant-achat" },
  { label: "Agences", href: "/agences" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "À propos", href: "/a-propos" },
  { label: "FAQ", href: "/faq" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-brand/5 bg-surface/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" aria-label="Accueil AnalyseTaCopro">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button href="/connexion" variant="ghost" size="sm">
            Connexion
          </Button>
          <Button href="/dashboard/nouveau" size="sm">
            Faire analyser
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={cn(
          "overflow-hidden border-t border-brand/5 bg-surface transition-all duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-soft"
            >
              {item.label}
            </Link>
          ))}
          <Button href="/dashboard/nouveau" className="mt-2 w-full">
            Faire analyser ma copropriété
          </Button>
        </div>
      </div>
    </header>
  );
}
