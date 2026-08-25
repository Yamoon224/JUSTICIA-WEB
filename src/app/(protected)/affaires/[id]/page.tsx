import Link from "next/link";
import { ArrowLeft, FileSignature, PackageCheck, Send, ShieldPlus, UserRound } from "lucide-react";

import { Badge, Card, EmptyState, ErrorBanner, Field, Mono, PageHeader, Select, SubmitButton, TextArea, TextInput } from "@/components/ui";
import {
  actionEnregistrerMouvementScelle,
  actionEnregistrerScelle,
  actionRattacherPersonne,
  actionRectifierProcesVerbal,
  actionRedigerProcesVerbal,
  actionSignerProcesVerbal,
  actionTransmettreAuParquet,
} from "@/features/affaires/actions";
import { obtenirAffaire } from "@/lib/api/affaires";

export const metadata = { title: "Affaire — JUSTICIA" };

const STATUTS_PERSONNE = [
  "suspect",
  "temoin",
  "temoin_assiste",
  "mis_en_examen",
  "prevenu",
  "accuse",
  "condamne",
  "relaxe",
  "acquitte",
  "non_lieu",
  "victime",
  "avocat_constitue",
];

const MOUVEMENTS_SCELLE = ["sortie_expertise", "retour_expertise", "restitution", "confiscation", "destruction"];

export default async function AffairePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const affaire = await obtenirAffaire(Number(id));

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader eyebrow="§6.3 — Dossier" title={affaire.numero_affaire} />
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{affaire.statut.replaceAll("_", " ")}</Badge>
          {affaire.statut === "ouverte" && (
            <form action={actionTransmettreAuParquet}>
              <input type="hidden" name="affaire_id" value={affaire.id} />
              <SubmitButton variant="secondary">
                <Send size={15} />
                Transmettre au parquet
              </SubmitButton>
            </form>
          )}
        </div>
      </div>

      <ErrorBanner message={erreur} />

      <Card title="Dossier">
        <p className="text-sm text-ink-soft">{affaire.description || "Aucune description."}</p>
        <div className="flex flex-wrap gap-1.5">
          {affaire.infractions?.map((infraction) => (
            <Badge key={infraction.id} tone="seal">
              {infraction.libelle}
            </Badge>
          ))}
        </div>
      </Card>

      <Card title="Personnes rattachées" description="§6.2 — un statut par affaire, jamais figé sur la fiche personne.">
        {affaire.personnes?.length ? (
          <ul className="flex flex-col divide-y divide-line">
            {affaire.personnes.map((personne) => (
              <li key={`${personne.id}-${personne.statut}`} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <Link href={`/personnes/${personne.id}`} className="flex items-center gap-2 text-sm font-medium text-ink hover:text-seal">
                  <UserRound size={15} className="text-ink-faint" />
                  {personne.nom_affichage}
                </Link>
                <div className="flex items-center gap-3">
                  <Badge tone="gold">{personne.statut.replaceAll("_", " ")}</Badge>
                  <Link
                    href={`/garde-a-vue/nouvelle?affaire_id=${affaire.id}&personne_id=${personne.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-seal hover:underline"
                  >
                    <ShieldPlus size={13} />
                    Garde à vue
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Aucune personne rattachée." />
        )}

        <form action={actionRattacherPersonne} className="flex flex-wrap items-end gap-3 border-t border-line pt-4">
          <input type="hidden" name="affaire_id" value={affaire.id} />
          <Field label="ID personne" htmlFor="personne_id">
            <TextInput id="personne_id" name="personne_id" type="number" required className="w-28" />
          </Field>
          <Field label="Statut" htmlFor="statut">
            <Select id="statut" name="statut" required>
              {STATUTS_PERSONNE.map((statut) => (
                <option key={statut} value={statut}>
                  {statut.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
          </Field>
          <SubmitButton variant="secondary">Rattacher</SubmitButton>
        </form>
      </Card>

      <Card title="Procès-verbaux" description="§6.3 — un PV signé devient immuable ; toute correction passe par un rectificatif.">
        {affaire.proces_verbaux?.length ? (
          <ul className="flex flex-col gap-3">
            {affaire.proces_verbaux.map((pv) => (
              <li key={pv.id} className="flex flex-col gap-3 rounded-xl border border-line bg-paper-sunken/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <FileSignature size={15} className="text-ink-faint" />
                    <Mono>{pv.cote}</Mono>
                    <span className="text-ink-soft">— {pv.type}</span>
                  </span>
                  <Badge tone={pv.signe ? "forest" : "gold"}>{pv.signe ? "signé" : "non signé"}</Badge>
                </div>
                <p className="whitespace-pre-wrap text-sm text-ink-soft">{pv.contenu}</p>

                {!pv.signe && (
                  <form action={actionSignerProcesVerbal} className="self-start">
                    <input type="hidden" name="affaire_id" value={affaire.id} />
                    <input type="hidden" name="pv_id" value={pv.id} />
                    <SubmitButton variant="secondary">Signer</SubmitButton>
                  </form>
                )}

                {pv.signe && (
                  <form action={actionRectifierProcesVerbal} className="flex flex-col gap-2">
                    <input type="hidden" name="affaire_id" value={affaire.id} />
                    <input type="hidden" name="pv_id" value={pv.id} />
                    <TextArea name="contenu" placeholder="Contenu rectifié" rows={2} required />
                    <SubmitButton variant="secondary">Émettre un rectificatif</SubmitButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Aucun procès-verbal." />
        )}

        <form action={actionRedigerProcesVerbal} className="flex flex-col gap-3 border-t border-line pt-4">
          <input type="hidden" name="affaire_id" value={affaire.id} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr]">
            <Field label="Type" htmlFor="type">
              <Select id="type" name="type" required>
                <option value="interpellation">Interpellation</option>
                <option value="audition">Audition</option>
                <option value="perquisition">Perquisition</option>
                <option value="constatation">Constatation</option>
                <option value="autre">Autre</option>
              </Select>
            </Field>
          </div>
          <Field label="Contenu" htmlFor="contenu">
            <TextArea id="contenu" name="contenu" rows={3} required />
          </Field>
          <SubmitButton variant="secondary">Rédiger le PV</SubmitButton>
        </form>
      </Card>

      <Card title="Scellés" description="§6.4 — chaîne de conservation : chaque mouvement est tracé, jamais corrigé.">
        {affaire.scelles?.length ? (
          <ul className="flex flex-col gap-3">
            {affaire.scelles.map((scelle) => (
              <li key={scelle.id} className="flex flex-col gap-3 rounded-xl border border-line bg-paper-sunken/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <PackageCheck size={15} className="text-ink-faint" />
                    <Mono>{scelle.numero_scelle}</Mono>
                    <span className="text-ink-soft">— {scelle.description}</span>
                  </span>
                  <Badge tone="neutral">{scelle.statut.replaceAll("_", " ")}</Badge>
                </div>

                {scelle.mouvements && scelle.mouvements.length > 0 && (
                  <ul className="flex flex-col gap-1 border-l-2 border-line pl-3 text-xs text-ink-faint">
                    {scelle.mouvements.map((mouvement, index) => (
                      <li key={index}>
                        {mouvement.type.replaceAll("_", " ")} — {new Date(mouvement.horodatage).toLocaleString("fr-FR")}
                      </li>
                    ))}
                  </ul>
                )}

                <form action={actionEnregistrerMouvementScelle} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="affaire_id" value={affaire.id} />
                  <input type="hidden" name="scelle_id" value={scelle.id} />
                  <Field label="Mouvement" htmlFor={`mouvement-${scelle.id}`}>
                    <Select id={`mouvement-${scelle.id}`} name="type" required>
                      {MOUVEMENTS_SCELLE.map((type) => (
                        <option key={type} value={type}>
                          {type.replaceAll("_", " ")}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Motif" htmlFor={`motif-${scelle.id}`}>
                    <TextInput id={`motif-${scelle.id}`} name="motif" />
                  </Field>
                  <SubmitButton variant="secondary">Enregistrer</SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Aucun scellé." />
        )}

        <form action={actionEnregistrerScelle} className="flex flex-wrap items-end gap-3 border-t border-line pt-4">
          <input type="hidden" name="affaire_id" value={affaire.id} />
          <Field label="Numéro" htmlFor="numero_scelle">
            <TextInput id="numero_scelle" name="numero_scelle" required />
          </Field>
          <Field label="Description" htmlFor="description-scelle">
            <TextInput id="description-scelle" name="description" required />
          </Field>
          <Field label="Lieu de saisie" htmlFor="lieu_saisie">
            <TextInput id="lieu_saisie" name="lieu_saisie" />
          </Field>
          <SubmitButton variant="secondary">Enregistrer le scellé</SubmitButton>
        </form>
      </Card>

      <Link href="/affaires" className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-seal">
        <ArrowLeft size={15} />
        Retour aux affaires
      </Link>
    </div>
  );
}
