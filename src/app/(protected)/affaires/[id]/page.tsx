import Link from "next/link";

import { Badge, Card, ErrorBanner, Field, SubmitButton, TextArea, TextInput } from "@/components/form";
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{affaire.numero_affaire}</h1>
          <Badge>{affaire.statut}</Badge>
        </div>

        {affaire.statut === "ouverte" && (
          <form action={actionTransmettreAuParquet}>
            <input type="hidden" name="affaire_id" value={affaire.id} />
            <SubmitButton>Transmettre au parquet</SubmitButton>
          </form>
        )}
      </div>

      <ErrorBanner message={erreur} />

      <Card title="Dossier">
        <p className="text-sm text-zinc-700">{affaire.description || "Aucune description."}</p>
        <div className="flex flex-wrap gap-1">
          {affaire.infractions?.map((infraction) => (
            <Badge key={infraction.id}>{infraction.libelle}</Badge>
          ))}
        </div>
      </Card>

      <Card title="Personnes rattachées (§6.2)">
        <ul className="flex flex-col gap-2 text-sm">
          {affaire.personnes?.map((personne) => (
            <li key={`${personne.id}-${personne.statut}`} className="flex items-center justify-between">
              <Link href={`/personnes/${personne.id}`} className="text-zinc-900 hover:underline">
                {personne.nom_affichage}
              </Link>
              <div className="flex items-center gap-2">
                <Badge>{personne.statut}</Badge>
                <Link
                  href={`/garde-a-vue/nouvelle?affaire_id=${affaire.id}&personne_id=${personne.id}`}
                  className="text-xs text-zinc-500 hover:underline"
                >
                  Placer en GAV
                </Link>
              </div>
            </li>
          ))}
          {!affaire.personnes?.length && <li className="text-zinc-500">Aucune personne rattachée.</li>}
        </ul>

        <form action={actionRattacherPersonne} className="flex flex-wrap items-end gap-3 border-t border-zinc-100 pt-3">
          <input type="hidden" name="affaire_id" value={affaire.id} />
          <Field label="ID personne" htmlFor="personne_id">
            <TextInput id="personne_id" name="personne_id" type="number" required className="w-28" />
          </Field>
          <Field label="Statut" htmlFor="statut">
            <select id="statut" name="statut" required className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
              {STATUTS_PERSONNE.map((statut) => (
                <option key={statut} value={statut}>
                  {statut}
                </option>
              ))}
            </select>
          </Field>
          <SubmitButton>Rattacher</SubmitButton>
        </form>
      </Card>

      <Card title="Procès-verbaux (§6.3)">
        <ul className="flex flex-col gap-3 text-sm">
          {affaire.proces_verbaux?.map((pv) => (
            <li key={pv.id} className="flex flex-col gap-2 rounded-md border border-zinc-100 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-900">
                  {pv.cote} — {pv.type}
                </span>
                <Badge tone={pv.signe ? "green" : "amber"}>{pv.signe ? "signé" : "non signé"}</Badge>
              </div>
              <p className="whitespace-pre-wrap text-zinc-600">{pv.contenu}</p>

              {!pv.signe && (
                <form action={actionSignerProcesVerbal} className="self-start">
                  <input type="hidden" name="affaire_id" value={affaire.id} />
                  <input type="hidden" name="pv_id" value={pv.id} />
                  <SubmitButton>Signer</SubmitButton>
                </form>
              )}

              {pv.signe && (
                <form action={actionRectifierProcesVerbal} className="flex flex-col gap-2">
                  <input type="hidden" name="affaire_id" value={affaire.id} />
                  <input type="hidden" name="pv_id" value={pv.id} />
                  <TextArea name="contenu" placeholder="Contenu rectifié" rows={2} required />
                  <SubmitButton>Émettre un rectificatif</SubmitButton>
                </form>
              )}
            </li>
          ))}
          {!affaire.proces_verbaux?.length && <li className="text-zinc-500">Aucun procès-verbal.</li>}
        </ul>

        <form action={actionRedigerProcesVerbal} className="flex flex-col gap-3 border-t border-zinc-100 pt-3">
          <input type="hidden" name="affaire_id" value={affaire.id} />
          <Field label="Type" htmlFor="type">
            <select id="type" name="type" required className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
              <option value="interpellation">Interpellation</option>
              <option value="audition">Audition</option>
              <option value="perquisition">Perquisition</option>
              <option value="constatation">Constatation</option>
              <option value="autre">Autre</option>
            </select>
          </Field>
          <Field label="Contenu" htmlFor="contenu">
            <TextArea id="contenu" name="contenu" rows={3} required />
          </Field>
          <SubmitButton>Rédiger le PV</SubmitButton>
        </form>
      </Card>

      <Card title="Scellés (§6.4)">
        <ul className="flex flex-col gap-3 text-sm">
          {affaire.scelles?.map((scelle) => (
            <li key={scelle.id} className="flex flex-col gap-2 rounded-md border border-zinc-100 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-900">
                  {scelle.numero_scelle} — {scelle.description}
                </span>
                <Badge>{scelle.statut}</Badge>
              </div>

              <ul className="text-xs text-zinc-500">
                {scelle.mouvements?.map((mouvement, index) => (
                  <li key={index}>
                    {mouvement.type} — {new Date(mouvement.horodatage).toLocaleString("fr-FR")}
                  </li>
                ))}
              </ul>

              <form action={actionEnregistrerMouvementScelle} className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="affaire_id" value={affaire.id} />
                <input type="hidden" name="scelle_id" value={scelle.id} />
                <Field label="Mouvement" htmlFor={`mouvement-${scelle.id}`}>
                  <select
                    id={`mouvement-${scelle.id}`}
                    name="type"
                    required
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  >
                    {MOUVEMENTS_SCELLE.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Motif" htmlFor={`motif-${scelle.id}`}>
                  <TextInput id={`motif-${scelle.id}`} name="motif" />
                </Field>
                <SubmitButton>Enregistrer</SubmitButton>
              </form>
            </li>
          ))}
          {!affaire.scelles?.length && <li className="text-zinc-500">Aucun scellé.</li>}
        </ul>

        <form action={actionEnregistrerScelle} className="flex flex-wrap items-end gap-3 border-t border-zinc-100 pt-3">
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
          <SubmitButton>Enregistrer le scellé</SubmitButton>
        </form>
      </Card>

      <Link href="/affaires" className="text-sm text-zinc-500 hover:underline">
        ← Retour aux affaires
      </Link>
    </div>
  );
}
