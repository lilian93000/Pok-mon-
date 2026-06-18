import { AppSidebar, ADMIN_NAV } from "@/components/AppSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brand-soft/30">
      <AppSidebar items={ADMIN_NAV} label="Administration" />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
