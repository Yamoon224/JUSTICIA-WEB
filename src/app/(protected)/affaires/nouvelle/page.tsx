import { FolderPlus } from "lucide-react";

import { Card, ErrorBanner, Field, PageHeader, SubmitButton, TextArea, TextInput } from "@/components/ui";
import { actionOuvrirAffaire } from "@/features/affaires/actions";
import { listerInfractions } from "@/lib/api/referentiels";

export const metadata = { title: "Nouvelle affaire — JUSTICIA" };

export default async function NouvelleAffairePage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const infractions = await listerInfractions();

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <PageHeader title="Ouvrir une affaire" description="Numéro unique attribué automatiquement dans votre ressort." />

      <ErrorBanner message={erreur} />

      <Card>
        <form action={actionOuvrirAffaire} className="flex flex-col gap-4">
          <Field label="Description" htmlFor="description">
            <TextArea id="description" name="description" rows={3} placeholder="Ex. Vol avec effraction au préjudice de M. Kouassi." />
          </Field>

          <Field label="Date d'ouverture" htmlFor="date_ouverture">
            <TextInput id="date_ouverture" name="date_ouverture" type="date" />
          </Field>

          <Field label="Infractions retenues" htmlFor="infractions" hint="Maintenez Ctrl pour une sélection multiple">
            <select
              id="infractions"
              name="infractions"
              multiple
              className="min-h-32 w-full rounded-lg border border-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink shadow-sm focus:border-seal focus:outline-none focus:ring-2 focus:ring-seal/15"
            >
              {infractions.map((infraction) => (
                <option key={infraction.id} value={infraction.id}>
                  {infraction.libelle} ({infraction.categorie})
                </option>
              ))}
            </select>
          </Field>

          <SubmitButton>
            <FolderPlus size={16} />
            Ouvrir l&apos;affaire
          </SubmitButton>
        </form>
      </Card>
    </div>
  );
}
