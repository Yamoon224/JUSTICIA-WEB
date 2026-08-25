import { ErrorBanner, Field, Select, SubmitButton } from "@/components/form";
import { actionPlacerEnGardeAVue } from "@/features/garde-a-vue/actions";
import { obtenirAffaire } from "@/lib/api/affaires";
import { listerUnites } from "@/lib/api/referentiels";

export const metadata = { title: "Placement en garde à vue — JUSTICIA" };

export default async function NouvelleGardeAVuePage({
  searchParams,
}: {
  searchParams: Promise<{ affaire_id?: string; personne_id?: string; erreur?: string }>;
}) {
  const { affaire_id: affaireId, personne_id: personneId, erreur } = await searchParams;

  if (!affaireId) {
    return (
      <div className="flex max-w-md flex-col gap-4">
        <h1 className="text-lg font-semibold text-zinc-900">Affaire requise</h1>
        <p className="text-sm text-zinc-500">
          Le placement en garde à vue se fait depuis la fiche d&apos;une affaire, pour une personne déjà rattachée.
        </p>
      </div>
    );
  }

  const [affaire, unites] = await Promise.all([obtenirAffaire(Number(affaireId)), listerUnites()]);

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Placement en garde à vue</h1>
        <p className="text-sm text-zinc-500">
          Affaire {affaire.numero_affaire} — la durée légale sera calculée automatiquement (§6.1).
        </p>
      </div>

      <ErrorBanner message={erreur} />

      <form action={actionPlacerEnGardeAVue} className="flex flex-col gap-4">
        <input type="hidden" name="affaire_id" value={affaire.id} />

        <Field label="Personne" htmlFor="personne_id">
          <Select id="personne_id" name="personne_id" required defaultValue={personneId ?? ""}>
            <option value="" disabled>
              Sélectionner...
            </option>
            {affaire.personnes?.map((personne) => (
              <option key={personne.id} value={personne.id}>
                {personne.nom_affichage}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Unité" htmlFor="unite_id">
          <Select id="unite_id" name="unite_id" required defaultValue="">
            <option value="" disabled>
              Sélectionner...
            </option>
            {unites.map((unite) => (
              <option key={unite.id} value={unite.id}>
                {unite.nom}
              </option>
            ))}
          </Select>
        </Field>

        <SubmitButton>Placer en garde à vue</SubmitButton>
      </form>
    </div>
  );
}
