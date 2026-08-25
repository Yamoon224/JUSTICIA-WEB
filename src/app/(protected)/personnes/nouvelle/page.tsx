import { actionCreerPersonne } from "@/features/identification/actions";
import { Field, TextInput, Select, SubmitButton, ErrorBanner } from "@/components/form";

export const metadata = { title: "Nouvelle personne — JUSTICIA" };

export default async function NouvellePersonnePage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Nouvelle fiche personne</h1>
        <p className="text-sm text-zinc-500">§6.2 — identifiant unique attribué automatiquement.</p>
      </div>

      <ErrorBanner message={erreur} />

      <form action={actionCreerPersonne} className="flex flex-col gap-4">
        <Field label="Type" htmlFor="type">
          <Select id="type" name="type" defaultValue="physique">
            <option value="physique">Personne physique</option>
            <option value="morale">Personne morale</option>
          </Select>
        </Field>

        <Field label="Nom" htmlFor="nom">
          <TextInput id="nom" name="nom" />
        </Field>

        <Field label="Prénom" htmlFor="prenom">
          <TextInput id="prenom" name="prenom" />
        </Field>

        <Field label="Date de naissance" htmlFor="date_naissance">
          <TextInput id="date_naissance" name="date_naissance" type="date" />
        </Field>

        <Field label="Lieu de naissance" htmlFor="lieu_naissance">
          <TextInput id="lieu_naissance" name="lieu_naissance" />
        </Field>

        <Field label="Raison sociale (si personne morale)" htmlFor="raison_sociale">
          <TextInput id="raison_sociale" name="raison_sociale" />
        </Field>

        <Field label="Adresse" htmlFor="adresse">
          <TextInput id="adresse" name="adresse" />
        </Field>

        <SubmitButton>Créer la fiche</SubmitButton>
      </form>
    </div>
  );
}
