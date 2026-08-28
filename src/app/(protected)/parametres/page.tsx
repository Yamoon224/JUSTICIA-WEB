import { ThemeSettings } from "@/components/theme-settings";
import { Card, PageHeader } from "@/components/ui";

export const metadata = { title: "Paramètres — JUSTICIA" };

export default function ParametresPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader eyebrow="Mon compte" title="Paramètres" description="Préférences d'affichage de l'application." />

      <Card title="Apparence" description="Choisissez comment JUSTICIA s'affiche sur cet appareil.">
        <ThemeSettings />
      </Card>
    </div>
  );
}
