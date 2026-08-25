import { ErrorBanner, Field, SubmitButton, TextArea, TextInput } from "@/components/form";
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
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Ouvrir une affaire</h1>
        <p className="text-sm text-zinc-500">§6.3 — numéro unique attribué automatiquement dans votre ressort.</p>
      </div>

      <ErrorBanner message={erreur} />

      <form action={actionOuvrirAffaire} className="flex flex-col gap-4">
        <Field label="Description" htmlFor="description">
          <TextArea id="description" name="description" rows={3} />
        </Field>

        <Field label="Date d'ouverture" htmlFor="date_ouverture">
          <TextInput id="date_ouverture" name="date_ouverture" type="date" />
        </Field>

        <Field label="Infractions retenues" htmlFor="infractions">
          <select
            id="infractions"
            name="infractions"
            multiple
            className="min-h-32 rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            {infractions.map((infraction) => (
              <option key={infraction.id} value={infraction.id}>
                {infraction.libelle} ({infraction.categorie})
              </option>
            ))}
          </select>
        </Field>

        <SubmitButton>Ouvrir l&apos;affaire</SubmitButton>
      </form>
    </div>
  );
}
