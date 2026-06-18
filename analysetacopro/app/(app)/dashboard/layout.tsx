import { AppSidebar, DASHBOARD_NAV } from "@/components/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brand-soft/30">
      <AppSidebar items={DASHBOARD_NAV} label="Espace client" />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
