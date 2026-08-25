import Link from "next/link";
import { AlarmClock, ArrowLeft, ClipboardList, DoorOpen, Gavel, ShieldAlert, UserCheck } from "lucide-react";

import { Badge, Card, ErrorBanner, Field, Select, SubmitButton, TextArea, TextInput } from "@/components/ui";
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
  const enCours = mesure.statut !== "terminee";

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-seal">§6.1 — Garde à vue</span>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Mesure #{mesure.id}</h1>
          <Badge tone={mesure.statut === "terminee" ? "forest" : "neutral"}>{mesure.statut.replaceAll("_", " ")}</Badge>
          {mesure.mineur && <Badge tone="gold">mineur</Badge>}
        </div>
      </div>

      <ErrorBanner message={erreur} />

      {mesure.echeance_depassee && enCours && (
        <div className="flex items-center gap-3 rounded-2xl border border-rust/30 bg-rust-tint px-5 py-4 text-rust">
          <ShieldAlert size={20} className="shrink-0" />
          <p className="text-sm font-medium">Échéance légale dépassée — signalement prioritaire requis (§6.11).</p>
        </div>
      )}

      <Card>
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-seal-tint text-seal-strong">
            <AlarmClock size={18} />
          </span>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-ink-faint">Échéance</span>
            <span className="font-display text-base font-medium text-ink">
              {new Date(mesure.fin_prevue_at).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
            </span>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-ink-soft">Début</dt>
          <dd className="text-ink">{new Date(mesure.debut_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}</dd>
          <dt className="text-ink-soft">Durée</dt>
          <dd className="text-ink">{mesure.duree_heures} h</dd>
          {mesure.issue && (
            <>
              <dt className="text-ink-soft">Issue</dt>
              <dd className="text-ink">{mesure.issue.replaceAll("_", " ")}</dd>
            </>
          )}
        </dl>

        {enCours && (
          <form action={actionProlongerGardeAVue} className="flex flex-wrap items-end gap-3 border-t border-line pt-4">
            <input type="hidden" name="mesure_id" value={mesure.id} />
            <Field label="Prolonger de (heures)" htmlFor="heures">
              <TextInput id="heures" name="heures" type="number" min={1} max={96} required className="w-24" />
            </Field>
            <Field label="ID magistrat autorisant" htmlFor="autorise_par_id" hint="autorisation parquet — §6.1">
              <TextInput id="autorise_par_id" name="autorise_par_id" type="number" required className="w-44" />
            </Field>
            <SubmitButton variant="secondary">Prolonger</SubmitButton>
          </form>
        )}
      </Card>

      <Card title="Notification des droits">
        <ul className="flex flex-col divide-y divide-line">
          {(Object.keys(LIBELLES_DROITS) as DroitGav[]).map((droit) => {
            const notification = mesure.notifications_droits?.find((n) => n.droit === droit);
            return (
              <li key={droit} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 text-sm">
                <span className="text-ink">{LIBELLES_DROITS[droit]}</span>
                {notification ? (
                  <Badge tone="forest">
                    notifié {notification.notifie_at && new Date(notification.notifie_at).toLocaleTimeString("fr-FR")}
                  </Badge>
                ) : (
                  <Badge tone="gold">non notifié</Badge>
                )}
              </li>
            );
          })}
        </ul>

        {enCours && droitsRestants.length > 0 && (
          <form action={actionNotifierDroitGardeAVue} className="flex flex-wrap items-end gap-3 border-t border-line pt-4">
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
            <SubmitButton variant="secondary">Notifier</SubmitButton>
          </form>
        )}
      </Card>

      {mesure.mineur && (
        <Card title="Régime mineur">
          {mesure.avis_representant_legal_at ? (
            <div className="flex items-center gap-2 text-sm text-forest">
              <UserCheck size={16} />
              Représentant légal avisé le {new Date(mesure.avis_representant_legal_at).toLocaleString("fr-FR")}
            </div>
          ) : (
            <form action={actionAviserRepresentantLegal}>
              <input type="hidden" name="mesure_id" value={mesure.id} />
              <SubmitButton variant="secondary">
                <UserCheck size={16} />
                Aviser le représentant légal
              </SubmitButton>
            </form>
          )}
        </Card>
      )}

      <Card title="Actes durant la mesure">
        {mesure.actes?.length ? (
          <ul className="flex flex-col divide-y divide-line">
            {mesure.actes.map((acte, index) => (
              <li key={index} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 text-sm">
                <span className="flex items-center gap-2 text-ink">
                  <ClipboardList size={14} className="text-ink-faint" />
                  {acte.type.replaceAll("_", " ")}
                </span>
                <span className="text-ink-faint">{new Date(acte.debut_at).toLocaleString("fr-FR")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-faint">Aucun acte enregistré.</p>
        )}

        {enCours && (
          <form action={actionEnregistrerActeGardeAVue} className="flex flex-col gap-3 border-t border-line pt-4">
            <input type="hidden" name="mesure_id" value={mesure.id} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Type d'acte" htmlFor="type-acte">
                <Select id="type-acte" name="type" required>
                  {TYPES_ACTES.map((type) => (
                    <option key={type} value={type}>
                      {type.replaceAll("_", " ")}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Début" htmlFor="debut_at">
                <TextInput id="debut_at" name="debut_at" type="datetime-local" required />
              </Field>
            </div>
            <Field label="Notes" htmlFor="notes">
              <TextArea id="notes" name="notes" rows={2} />
            </Field>
            <SubmitButton variant="secondary">Enregistrer l&apos;acte</SubmitButton>
          </form>
        )}
      </Card>

      {enCours && (
        <Card title="Clôture" description="Issue obligatoire à la sortie de la mesure.">
          <form action={actionCloturerGardeAVue} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="mesure_id" value={mesure.id} />
            <Field label="Issue" htmlFor="issue">
              <Select id="issue" name="issue" required>
                <option value="liberation">Remise en liberté</option>
                <option value="convocation">Convocation ultérieure</option>
                <option value="deferement">Déferrement au parquet</option>
              </Select>
            </Field>
            <SubmitButton>
              <Gavel size={16} />
              Clôturer la mesure
            </SubmitButton>
          </form>
        </Card>
      )}

      {!enCours && mesure.issue === "deferement" && (
        <div className="flex items-center gap-3 rounded-2xl border border-seal/25 bg-seal-tint px-5 py-4 text-seal-strong">
          <DoorOpen size={18} className="shrink-0" />
          <p className="text-sm">Personne déférée au parquet — orientation à suivre dans le module Parquet.</p>
        </div>
      )}

      <Link href={`/affaires/${mesure.affaire_id}`} className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-seal">
        <ArrowLeft size={15} />
        Retour à l&apos;affaire
      </Link>
    </div>
  );
}
