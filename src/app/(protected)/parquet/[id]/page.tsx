import Link from "next/link";
import { ArrowLeft, Gavel, Scale, UserCog } from "lucide-react";

import { RichTextArea } from "@/components/rich-text-editor";
import { Badge, Card, EmptyState, ErrorBanner, Field, Mono, RichText, Select, SubmitButton } from "@/components/ui";
import { actionAffecterMagistrat, actionEnregistrerRequisition, actionOrienterDossier } from "@/features/parquet/actions";
import { obtenirDossierParquet } from "@/lib/api/parquet";
import { listerMagistrats, listerMotifsClassement } from "@/lib/api/referentiels";
import type { OrientationParquet } from "@/types/parquet";

export const metadata = { title: "Dossier parquet — JUSTICIA" };

const LIBELLES_ORIENTATION: Record<OrientationParquet, string> = {
  classement_sans_suite: "Classement sans suite",
  rappel_a_la_loi: "Rappel à la loi",
  mediation_penale: "Médiation pénale",
  composition_penale: "Composition pénale",
  citation_directe: "Citation directe",
  ouverture_information: "Ouverture d'information",
  comparution_immediate: "Comparution immédiate",
};

export default async function DossierParquetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const dossier = await obtenirDossierParquet(Number(id));
  const affaire = dossier.affaire;

  const [magistrats, motifs] = await Promise.all(
    !dossier.orientation ? [listerMagistrats(), listerMotifsClassement()] : [[], []],
  );

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-seal">Parquet</span>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            <Mono>{affaire.numero_affaire}</Mono>
          </h1>
          {dossier.orientation ? (
            <Badge tone="forest">{LIBELLES_ORIENTATION[dossier.orientation]}</Badge>
          ) : dossier.magistrat_id ? (
            <Badge tone="neutral">affecté</Badge>
          ) : (
            <Badge tone="gold">non affecté</Badge>
          )}
        </div>
      </div>

      <ErrorBanner message={erreur} />

      <Card title="Dossier">
        <RichText html={affaire.description} fallback="Aucune description." />
        <div className="flex flex-wrap gap-1.5">
          {affaire.infractions?.map((infraction) => (
            <Badge key={infraction.id} tone="seal">
              {infraction.libelle}
            </Badge>
          ))}
        </div>
        <Link href={`/affaires/${affaire.id}`} className="w-fit text-sm text-seal hover:underline">
          Voir le dossier d&apos;affaire complet →
        </Link>
      </Card>

      {!dossier.magistrat_id && (
        <Card title="Affectation" description="Un dossier reçu est affecté à un procureur du ressort avant orientation.">
          <form action={actionAffecterMagistrat} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <Field label="Magistrat" htmlFor="magistrat_id">
              <Select id="magistrat_id" name="magistrat_id" required defaultValue="">
                <option value="" disabled>
                  Sélectionner...
                </option>
                {magistrats.map((magistrat) => (
                  <option key={magistrat.id} value={magistrat.id}>
                    {magistrat.prenom} {magistrat.nom} — {magistrat.matricule}
                  </option>
                ))}
              </Select>
            </Field>
            <SubmitButton>
              <UserCog size={16} />
              Affecter
            </SubmitButton>
          </form>
        </Card>
      )}

      {dossier.magistrat_id && !dossier.orientation && (
        <Card title="Orientation des poursuites" description="Décision toujours humaine — le système ne s'auto-oriente jamais.">
          <form action={actionOrienterDossier} className="flex flex-col gap-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <Field label="Orientation" htmlFor="orientation">
              <Select id="orientation" name="orientation" required defaultValue="">
                <option value="" disabled>
                  Sélectionner...
                </option>
                {(Object.keys(LIBELLES_ORIENTATION) as OrientationParquet[]).map((orientation) => (
                  <option key={orientation} value={orientation}>
                    {LIBELLES_ORIENTATION[orientation]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Motif de classement" htmlFor="motif_classement_id" hint="requis pour un classement sans suite">
              <Select id="motif_classement_id" name="motif_classement_id" defaultValue="">
                <option value="">—</option>
                {motifs.map((motif) => (
                  <option key={motif.id} value={motif.id}>
                    {motif.libelle}
                  </option>
                ))}
              </Select>
            </Field>
            <SubmitButton>
              <Scale size={16} />
              Orienter
            </SubmitButton>
          </form>
        </Card>
      )}

      <Card title="Réquisitions" description="Consignées aux différentes étapes de la procédure.">
        {dossier.requisitions?.length ? (
          <ul className="flex flex-col divide-y divide-line">
            {dossier.requisitions.map((requisition) => (
              <li key={requisition.id} className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Gavel size={14} className="text-ink-faint" />
                  {requisition.type}
                </span>
                <RichText html={requisition.contenu} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Aucune réquisition." />
        )}

        <form action={actionEnregistrerRequisition} className="flex flex-col gap-3 border-t border-line pt-4">
          <input type="hidden" name="dossier_id" value={dossier.id} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[12rem_1fr]">
            <Field label="Type" htmlFor="type-requisition">
              <input
                id="type-requisition"
                name="type"
                required
                placeholder="placement_detention, peine_requise..."
                className="w-full rounded-lg border border-line bg-paper-raised px-3.5 py-2.5 text-sm text-ink shadow-sm focus:border-seal focus:outline-none focus:ring-2 focus:ring-seal/15"
              />
            </Field>
          </div>
          <Field label="Contenu" htmlFor="contenu-requisition">
            <RichTextArea id="contenu-requisition" name="contenu" rows={2} required placeholder="Ex. Réquisition de placement en détention provisoire." />
          </Field>
          <SubmitButton variant="secondary">Enregistrer la réquisition</SubmitButton>
        </form>
      </Card>

      <Link href="/parquet" className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-seal">
        <ArrowLeft size={15} />
        Retour au bureau des arrivées
      </Link>
    </div>
  );
}
