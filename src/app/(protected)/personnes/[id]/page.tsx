import Link from "next/link";
import { ArrowLeft, BookLock, Combine, ShieldQuestion } from "lucide-react";

import { FormulaireVersementPiece, ListePiecesVersees } from "@/components/pieces-versees";
import { Badge, Card, ErrorBanner, Field, PageHeader, SubmitButton, TextInput } from "@/components/ui";
import { actionVerserDocumentPersonne } from "@/features/documents/actions";
import { actionFusionnerPersonnes } from "@/features/identification/actions";
import { obtenirPersonne } from "@/lib/api/personnes";
import { getCurrentAgent } from "@/lib/auth/current-agent";

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
      <div className="flex max-w-md flex-col gap-6">
        <PageHeader eyebrow="§6.2, §8" title="Motif de consultation requis" />
        <Card>
          <div className="flex items-start gap-3">
            <ShieldQuestion size={20} className="mt-0.5 shrink-0 text-gold" />
            <p className="text-sm text-ink-soft">
              Cette consultation sera journalisée avec le motif que vous indiquez.
            </p>
          </div>
          <form method="get" className="flex flex-col gap-3">
            <Field label="Motif" htmlFor="motif">
              <TextInput name="motif" id="motif" required placeholder="Ex. vérification d'identité, recoupement d'affaire..." />
            </Field>
            <SubmitButton>Consulter la fiche</SubmitButton>
          </form>
        </Card>
      </div>
    );
  }

  const [personne, agent] = await Promise.all([obtenirPersonne(Number(id), motif), getCurrentAgent()]);
  const peutVoirCasier = agent?.permissions.some((p) => ["casier.gerer", "casier.consulter_nominatif"].includes(p)) ?? false;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader
        eyebrow="§6.2 — Fiche personne"
        title={personne.nom_affichage}
        description={personne.identifiant_unique}
        actions={
          peutVoirCasier && (
            <Link
              href={`/casier/personnes/${personne.id}?nom=${encodeURIComponent(personne.nom_affichage)}`}
              className="inline-flex items-center gap-1.5 text-sm text-seal hover:underline"
            >
              <BookLock size={15} />
              Voir le casier
            </Link>
          )
        }
      />

      <ErrorBanner message={erreur} />

      <Card title="Identité">
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-ink-soft">Type</dt>
          <dd><Badge tone="seal">{personne.type}</Badge></dd>
          <dt className="text-ink-soft">Date de naissance</dt>
          <dd className="text-ink">{personne.date_naissance ?? "—"}</dd>
          <dt className="text-ink-soft">Lieu de naissance</dt>
          <dd className="text-ink">{personne.lieu_naissance ?? "—"}</dd>
          <dt className="text-ink-soft">Adresse</dt>
          <dd className="text-ink">{personne.adresse ?? "—"}</dd>
        </dl>
      </Card>

      <Card title="Pièces versées" description="§6.2, §9 — photo, pièces d'identité numérisées ; stockage chiffré.">
        <ListePiecesVersees documents={personne.documents} />
        <div className="border-t border-line pt-4">
          <FormulaireVersementPiece
            action={actionVerserDocumentPersonne}
            champsCaches={{ personne_id: personne.id, motif }}
            categorie="personne"
            idPrefix="personne"
          />
        </div>
      </Card>

      <Card title="Fusionner un doublon" description="Le rapprochement n'est jamais automatique : vérifiez avant d'absorber une fiche.">
        <form action={actionFusionnerPersonnes} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="personne_id" value={personne.id} />
          <input type="hidden" name="motif" value={motif} />
          <Field label="ID de la fiche à absorber" htmlFor="personne_absorbee_id">
            <TextInput id="personne_absorbee_id" name="personne_absorbee_id" type="number" required className="w-44" />
          </Field>
          <SubmitButton variant="secondary">
            <Combine size={16} />
            Fusionner
          </SubmitButton>
        </form>
      </Card>

      <Link href="/personnes" className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-seal">
        <ArrowLeft size={15} />
        Retour à la recherche
      </Link>
    </div>
  );
}
