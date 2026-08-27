import { UserPlus } from "lucide-react";

import { actionCreerPersonne } from "@/features/identification/actions";
import { Card, ErrorBanner, Field, PageHeader, Select, SubmitButton, TextInput } from "@/components/ui";

export const metadata = { title: "Nouvelle personne — JUSTICIA" };

export default async function NouvellePersonnePage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <PageHeader title="Nouvelle fiche personne" description="L'identifiant unique est attribué automatiquement." />

      <ErrorBanner message={erreur} />

      <Card>
        <form action={actionCreerPersonne} className="flex flex-col gap-4">
          <Field label="Type" htmlFor="type">
            <Select id="type" name="type" defaultValue="physique">
              <option value="physique">Personne physique</option>
              <option value="morale">Personne morale</option>
            </Select>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nom" htmlFor="nom">
              <TextInput id="nom" name="nom" placeholder="Ex. Kouassi" />
            </Field>
            <Field label="Prénom" htmlFor="prenom">
              <TextInput id="prenom" name="prenom" placeholder="Ex. Awa" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Date de naissance" htmlFor="date_naissance">
              <TextInput id="date_naissance" name="date_naissance" type="date" />
            </Field>
            <Field label="Lieu de naissance" htmlFor="lieu_naissance">
              <TextInput id="lieu_naissance" name="lieu_naissance" placeholder="Ex. Abidjan" />
            </Field>
          </div>

          <Field label="Raison sociale (si personne morale)" htmlFor="raison_sociale">
            <TextInput id="raison_sociale" name="raison_sociale" placeholder="Ex. SOTRA-CI SARL" />
          </Field>

          <Field label="Adresse" htmlFor="adresse">
            <TextInput id="adresse" name="adresse" placeholder="Ex. Cocody, Abidjan" />
          </Field>

          <SubmitButton>
            <UserPlus size={16} />
            Créer la fiche
          </SubmitButton>
        </form>
      </Card>
    </div>
  );
}
