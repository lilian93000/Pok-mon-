import { AppSidebar, PRO_NAV } from "@/components/AppSidebar";

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brand-soft/30">
      <AppSidebar items={PRO_NAV} label="Espace agence" />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
