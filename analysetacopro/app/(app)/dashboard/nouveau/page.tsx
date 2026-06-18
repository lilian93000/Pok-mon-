import { Topbar } from "@/components/ui/topbar";
import { DossierWizard } from "@/components/DossierWizard";

export default function NouveauDossierPage() {
  return (
    <>
      <Topbar
        title="Nouveau dossier"
        subtitle="Créez votre analyse de copropriété en 6 étapes."
      />
      <div className="p-6 md:p-8">
        <DossierWizard />
      </div>
    </>
  );
}
