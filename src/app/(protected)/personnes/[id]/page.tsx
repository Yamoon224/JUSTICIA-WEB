import Link from "next/link";

import { Badge, Card, ErrorBanner, Field, SubmitButton, TextInput } from "@/components/form";
import { actionFusionnerPersonnes } from "@/features/identification/actions";
import { obtenirPersonne } from "@/lib/api/personnes";

export const metadata = { title: "Fiche personne — JUSTICIA" };

export default async function PersonnePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ motif?: string; erreur?: string }>;
}) {
  const { id } = await params;
  const { motif, erreur } = await searchParams;

  // §6.2 : toute consultation d'une fiche personne exige un motif explicite,
  // journalisé côté API — la page ne le contourne jamais côté client.
  if (!motif) {
    return (
      <div className="flex max-w-md flex-col gap-4">
        <h1 className="text-lg font-semibold text-zinc-900">Motif de consultation requis</h1>
        <p className="text-sm text-zinc-500">
          Cette consultation sera journalisée avec le motif que vous indiquez (§6.2, §8).
        </p>
        <form method="get" className="flex flex-col gap-3">
          <TextInput name="motif" required placeholder="Ex. vérification d'identité, recoupement d'affaire..." />
          <SubmitButton>Consulter</SubmitButton>
        </form>
      </div>
    );
  }

  const personne = await obtenirPersonne(Number(id), motif);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">{personne.nom_affichage}</h1>
        <p className="font-mono text-xs text-zinc-500">{personne.identifiant_unique}</p>
      </div>

      <ErrorBanner message={erreur} />

      <Card title="Identité">
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-zinc-500">Type</dt>
          <dd><Badge>{personne.type}</Badge></dd>
          <dt className="text-zinc-500">Date de naissance</dt>
          <dd>{personne.date_naissance ?? "—"}</dd>
          <dt className="text-zinc-500">Lieu de naissance</dt>
          <dd>{personne.lieu_naissance ?? "—"}</dd>
          <dt className="text-zinc-500">Adresse</dt>
          <dd>{personne.adresse ?? "—"}</dd>
        </dl>
      </Card>

      <Card title="Fusionner avec une fiche en doublon (§6.2)">
        <p className="text-xs text-zinc-500">
          Le rapprochement n&apos;est jamais automatique : indiquez l&apos;identifiant de la fiche à absorber
          après vérification.
        </p>
        <form action={actionFusionnerPersonnes} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="personne_id" value={personne.id} />
          <input type="hidden" name="motif" value={motif} />
          <Field label="ID de la fiche à absorber" htmlFor="personne_absorbee_id">
            <TextInput id="personne_absorbee_id" name="personne_absorbee_id" type="number" required />
          </Field>
          <SubmitButton>Fusionner</SubmitButton>
        </form>
      </Card>

      <Link href="/personnes" className="text-sm text-zinc-500 hover:underline">
        ← Retour à la recherche
      </Link>
    </div>
  );
}
