"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  FolderOpen,
  Shield,
  Users,
  Settings,
  LogOut,
  ShoppingBag,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Nouveau dossier", href: "/dashboard/nouveau", icon: FilePlus2 },
];

export const PRO_NAV: NavItem[] = [
  { label: "Vue d'ensemble", href: "/pro", icon: LayoutDashboard },
  { label: "Commander", href: "/pro#commander", icon: ShoppingBag },
  { label: "Historique", href: "/pro#historique", icon: FolderOpen },
  { label: "Mon équipe", href: "/pro#equipe", icon: Users },
  { label: "Co-branding", href: "/pro#co-branding", icon: Palette },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { label: "Dossiers", href: "/admin#dossiers", icon: FolderOpen },
  { label: "Clients", href: "/admin#clients", icon: Users },
  { label: "Paramètres", href: "/admin#parametres", icon: Settings },
];

export function AppSidebar({
  items,
  label,
}: {
  items: NavItem[];
  label: string;
}) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-brand/10 bg-surface md:flex">
      <div className="flex h-16 items-center border-b border-brand/5 px-6">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-2 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted">
        <Shield className="h-3.5 w-3.5" />
        {label}
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (!["/dashboard", "/admin", "/pro"].includes(item.href) &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-gradient text-white shadow-soft"
                  : "text-muted hover:bg-surface-soft hover:text-brand"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center justify-between gap-2 border-t border-brand/5 p-3">
        <Link
          href="/"
          className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-soft hover:text-brand"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Se déconnecter
        </Link>
        <ThemeToggle />
      </div>
    </aside>
  );
}
