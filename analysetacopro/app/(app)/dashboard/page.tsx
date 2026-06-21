import { FilePlus2 } from "lucide-react";
import { Topbar } from "@/components/ui/topbar";
import { Button } from "@/components/ui/button";
import { DashboardDossiers } from "@/components/DashboardDossiers";

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="Tableau de bord"
        subtitle="Suivez vos analyses de copropriété en un coup d'œil."
        action={
          <Button href="/dashboard/nouveau" size="sm">
            <FilePlus2 className="h-4 w-4" />
            Nouveau dossier
          </Button>
        }
      />

      <DashboardDossiers />
    </>
  );
}
