import Link from "next/link";

import { Badge, Card, ErrorBanner, Field, Select, SubmitButton, TextArea, TextInput } from "@/components/form";
import {
  actionAviserRepresentantLegal,
  actionCloturerGardeAVue,
  actionEnregistrerActeGardeAVue,
  actionNotifierDroitGardeAVue,
  actionProlongerGardeAVue,
} from "@/features/garde-a-vue/actions";
import { obtenirMesureGardeAVue } from "@/lib/api/garde-a-vue";
import type { DroitGav } from "@/types/mesure-gav";

export const metadata = { title: "Garde à vue — JUSTICIA" };

const LIBELLES_DROITS: Record<DroitGav, string> = {
  silence: "Droit au silence",
  avocat: "Droit à un avocat",
  medecin: "Droit à un examen médical",
  information_proche: "Information d'un proche",
};

const TYPES_ACTES = ["audition", "examen_medical", "entretien_avocat", "confrontation", "repos"];

export default async function MesureGardeAVuePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const mesure = await obtenirMesureGardeAVue(Number(id));

  const droitsNotifies = new Set(mesure.notifications_droits?.map((n) => n.droit));
  const droitsRestants = (Object.keys(LIBELLES_DROITS) as DroitGav[]).filter((droit) => !droitsNotifies.has(droit));

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Garde à vue #{mesure.id}</h1>
          <div className="mt-1 flex gap-2">
            <Badge tone={mesure.statut === "terminee" ? "green" : "zinc"}>{mesure.statut}</Badge>
            {mesure.mineur && <Badge tone="amber">mineur</Badge>}
            {mesure.echeance_depassee && <Badge tone="red">échéance dépassée</Badge>}
          </div>
        </div>
      </div>

      <ErrorBanner message={erreur} />

      <Card title="Échéance (§6.1, §6.11)">
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-zinc-500">Début</dt>
          <dd>{new Date(mesure.debut_at).toLocaleString("fr-FR")}</dd>
          <dt className="text-zinc-500">Durée</dt>
          <dd>{mesure.duree_heures} h</dd>
          <dt className="text-zinc-500">Fin prévue</dt>
          <dd>{new Date(mesure.fin_prevue_at).toLocaleString("fr-FR")}</dd>
          {mesure.issue && (
            <>
              <dt className="text-zinc-500">Issue</dt>
              <dd>{mesure.issue}</dd>
            </>
          )}
        </dl>
      </Card>

      {mesure.statut !== "terminee" && (
        <Card title="Prolongation (autorisation parquet — §6.1)">
          <form action={actionProlongerGardeAVue} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="mesure_id" value={mesure.id} />
            <Field label="Heures" htmlFor="heures">
              <TextInput id="heures" name="heures" type="number" min={1} max={96} required className="w-24" />
            </Field>
            <Field label="ID magistrat autorisant" htmlFor="autorise_par_id">
              <TextInput id="autorise_par_id" name="autorise_par_id" type="number" required className="w-40" />
            </Field>
            <SubmitButton>Prolonger</SubmitButton>
          </form>
        </Card>
      )}

      <Card title="Notification des droits (§6.1)">
        <ul className="flex flex-col gap-1 text-sm">
          {(Object.keys(LIBELLES_DROITS) as DroitGav[]).map((droit) => {
            const notification = mesure.notifications_droits?.find((n) => n.droit === droit);
            return (
              <li key={droit} className="flex items-center justify-between">
                <span>{LIBELLES_DROITS[droit]}</span>
                {notification ? (
                  <Badge tone="green">
                    notifié {notification.notifie_at && new Date(notification.notifie_at).toLocaleTimeString("fr-FR")}
                  </Badge>
                ) : (
                  <Badge tone="amber">non notifié</Badge>
                )}
              </li>
            );
          })}
        </ul>

        {mesure.statut !== "terminee" && droitsRestants.length > 0 && (
          <form action={actionNotifierDroitGardeAVue} className="flex flex-wrap items-end gap-3 border-t border-zinc-100 pt-3">
            <input type="hidden" name="mesure_id" value={mesure.id} />
            <Field label="Droit" htmlFor="droit">
              <Select id="droit" name="droit" required>
                {droitsRestants.map((droit) => (
                  <option key={droit} value={droit}>
                    {LIBELLES_DROITS[droit]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Mode de remise" htmlFor="mode_de_remise">
              <TextInput id="mode_de_remise" name="mode_de_remise" placeholder="oral, écrit..." required />
            </Field>
            <SubmitButton>Notifier</SubmitButton>
          </form>
        )}
      </Card>

      {mesure.mineur && (
        <Card title="Régime mineur (§6.1)">
          {mesure.avis_representant_legal_at ? (
            <Badge tone="green">
              Représentant légal avisé le {new Date(mesure.avis_representant_legal_at).toLocaleString("fr-FR")}
            </Badge>
          ) : (
            <form action={actionAviserRepresentantLegal}>
              <input type="hidden" name="mesure_id" value={mesure.id} />
              <SubmitButton>Aviser le représentant légal</SubmitButton>
            </form>
          )}
        </Card>
      )}

      <Card title="Actes durant la mesure (§6.1)">
        <ul className="flex flex-col gap-1 text-sm">
          {mesure.actes?.map((acte, index) => (
            <li key={index} className="flex justify-between text-zinc-700">
              <span>{acte.type}</span>
              <span className="text-zinc-500">{new Date(acte.debut_at).toLocaleString("fr-FR")}</span>
            </li>
          ))}
          {!mesure.actes?.length && <li className="text-zinc-500">Aucun acte enregistré.</li>}
        </ul>

        {mesure.statut !== "terminee" && (
          <form action={actionEnregistrerActeGardeAVue} className="flex flex-col gap-3 border-t border-zinc-100 pt-3">
            <input type="hidden" name="mesure_id" value={mesure.id} />
            <Field label="Type d'acte" htmlFor="type-acte">
              <Select id="type-acte" name="type" required>
                {TYPES_ACTES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Début" htmlFor="debut_at">
              <TextInput id="debut_at" name="debut_at" type="datetime-local" required />
            </Field>
            <Field label="Notes" htmlFor="notes">
              <TextArea id="notes" name="notes" rows={2} />
            </Field>
            <SubmitButton>Enregistrer l&apos;acte</SubmitButton>
          </form>
        )}
      </Card>

      {mesure.statut !== "terminee" && (
        <Card title="Clôture (§6.1 — issue obligatoire)">
          <form action={actionCloturerGardeAVue} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="mesure_id" value={mesure.id} />
            <Field label="Issue" htmlFor="issue">
              <Select id="issue" name="issue" required>
                <option value="liberation">Remise en liberté</option>
                <option value="convocation">Convocation ultérieure</option>
                <option value="deferement">Déferrement au parquet</option>
              </Select>
            </Field>
            <SubmitButton>Clôturer la mesure</SubmitButton>
          </form>
        </Card>
      )}

      <Link href={`/affaires/${mesure.affaire_id}`} className="text-sm text-zinc-500 hover:underline">
        ← Retour à l&apos;affaire
      </Link>
    </div>
  );
}
