import Link from "next/link";
import { ArrowLeft, BookText, History, ScrollText, ShieldQuestion, Stamp } from "lucide-react";

import { Badge, Card, EmptyState, ErrorBanner, Field, Select, SubmitButton, TextInput } from "@/components/ui";
import { actionAmnistier, actionRehabiliter } from "@/features/casier/actions";
import { genererBulletin, listerCondamnations, listerConsultations } from "@/lib/api/casier";
import { getCurrentAgent } from "@/lib/auth/current-agent";
import type { Condamnation, StatutCondamnation, TypeBulletin } from "@/types/casier";

export const metadata = { title: "Casier judiciaire — JUSTICIA" };

const LIBELLES_TYPE_BULLETIN: Record<TypeBulletin, string> = {
  b1: "Bulletin n°1 (autorités judiciaires)",
  b2: "Bulletin n°2 (administrations)",
  b3: "Bulletin n°3 (personne concernée)",
};

const LIBELLES_STATUT: Record<StatutCondamnation, string> = {
  active: "active",
  rehabilitee: "réhabilitée",
  amnistiee: "amnistiée",
};

export default async function CasierPersonnePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nom?: string; type?: string; motif?: string; erreur?: string }>;
}) {
  const { id } = await params;
  const { nom, type, motif, erreur } = await searchParams;
  const personneId = Number(id);

  const agent = await getCurrentAgent();
  const peutConsulterNominatif = agent?.permissions.includes("casier.consulter_nominatif") ?? false;
  const peutGerer = agent?.permissions.includes("casier.gerer") ?? false;

  const typeBulletin = type as TypeBulletin | undefined;
  const bulletin = peutConsulterNominatif && typeBulletin && motif ? await genererBulletin(personneId, typeBulletin, motif) : null;

  const [condamnations, consultations] = peutGerer
    ? await Promise.all([listerCondamnations(personneId), listerConsultations(personneId)])
    : [null, null];

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-seal">§6.10 — Casier judiciaire</span>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">{nom || `Personne #${personneId}`}</h1>
      </div>

      <ErrorBanner message={erreur} />

      {peutConsulterNominatif && (
        <Card title="Générer un bulletin" description="Chaque génération est une consultation nominative, journalisée et motivée.">
          <form method="get" className="flex flex-wrap items-end gap-3">
            {nom && <input type="hidden" name="nom" value={nom} />}
            <Field label="Bulletin" htmlFor="type">
              <Select id="type" name="type" required defaultValue={typeBulletin ?? ""}>
                <option value="" disabled>
                  Sélectionner...
                </option>
                <option value="b1">Bulletin n°1</option>
                <option value="b2">Bulletin n°2</option>
                <option value="b3">Bulletin n°3</option>
              </Select>
            </Field>
            <Field label="Motif" htmlFor="motif">
              <TextInput id="motif" name="motif" required defaultValue={motif} placeholder="Vérification, recrutement..." className="w-64" />
            </Field>
            <SubmitButton>
              <BookText size={16} />
              Générer
            </SubmitButton>
          </form>

          {bulletin && (
            <div className="flex flex-col gap-3 border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-faint">
                {LIBELLES_TYPE_BULLETIN[bulletin.type]} — généré le {new Date(bulletin.genere_at).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
              </p>
              {bulletin.condamnations.length === 0 ? (
                <EmptyState message="Aucune mention sur ce bulletin." />
              ) : (
                <ul className="flex flex-col gap-2">
                  {bulletin.condamnations.map((condamnation) => (
                    <LigneCondamnation key={condamnation.id} condamnation={condamnation} />
                  ))}
                </ul>
              )}
            </div>
          )}
        </Card>
      )}

      {peutGerer && condamnations && (
        <Card title="Condamnations" description="Gestion des mentions — réhabilitation judiciaire et amnistie.">
          {condamnations.length === 0 ? (
            <EmptyState message="Aucune condamnation inscrite au casier." />
          ) : (
            <ul className="flex flex-col gap-3">
              {condamnations.map((condamnation) => (
                <li key={condamnation.id} className="flex flex-col gap-3 rounded-xl border border-line bg-paper-sunken/40 p-4">
                  <LigneCondamnation condamnation={condamnation} detaillee />
                  {condamnation.statut === "active" && (
                    <div className="flex flex-wrap items-end gap-2 border-t border-line pt-3">
                      <form action={actionRehabiliter}>
                        <input type="hidden" name="personne_id" value={personneId} />
                        <input type="hidden" name="condamnation_id" value={condamnation.id} />
                        {nom && <input type="hidden" name="nom" value={nom} />}
                        <SubmitButton variant="secondary">
                          <Stamp size={15} />
                          Réhabiliter (judiciaire)
                        </SubmitButton>
                      </form>
                      <form action={actionAmnistier} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="personne_id" value={personneId} />
                        <input type="hidden" name="condamnation_id" value={condamnation.id} />
                        {nom && <input type="hidden" name="nom" value={nom} />}
                        <Field label="Texte de référence" htmlFor={`texte-${condamnation.id}`}>
                          <TextInput id={`texte-${condamnation.id}`} name="texte_reference" required placeholder="Décret d'amnistie n°..." className="w-56" />
                        </Field>
                        <SubmitButton variant="secondary">Amnistier</SubmitButton>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {peutGerer && consultations && (
        <Card title="Historique des consultations" description="Qui a consulté ce casier, et pourquoi.">
          {consultations.length === 0 ? (
            <EmptyState message="Aucune consultation enregistrée." />
          ) : (
            <ul className="flex flex-col gap-2">
              {consultations.map((consultation) => (
                <li key={consultation.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <History size={14} className="text-ink-faint" />
                  <Badge tone="neutral">{consultation.type_bulletin.toUpperCase()}</Badge>
                  <span className="text-ink-soft">
                    {consultation.consultee_par?.nom_complet ?? "Agent inconnu"} —{" "}
                    {new Date(consultation.consultee_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                  <span className="flex items-center gap-1 text-ink-faint">
                    <ShieldQuestion size={13} />
                    {consultation.motif}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {!peutConsulterNominatif && !peutGerer && (
        <EmptyState message="Vous n'avez pas d'habilitation sur le casier judiciaire." />
      )}

      <Link href="/casier" className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-seal">
        <ArrowLeft size={15} />
        Retour à la recherche
      </Link>
    </div>
  );
}

function LigneCondamnation({ condamnation, detaillee = false }: { condamnation: Condamnation; detaillee?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <ScrollText size={14} className="text-ink-faint" />
        <span className="font-medium text-ink">{condamnation.numero_affaire}</span>
        <Badge tone={condamnation.statut === "active" ? "gold" : condamnation.statut === "amnistiee" ? "rust" : "forest"}>
          {LIBELLES_STATUT[condamnation.statut]}
        </Badge>
        {condamnation.sursis && <Badge tone="neutral">sursis</Badge>}
      </div>
      <p className="text-sm text-ink-soft">
        {condamnation.infraction_libelle} ({condamnation.categorie_infraction}) — {condamnation.juridiction_nom}
      </p>
      {condamnation.peine_principale && <p className="text-sm text-ink-soft">{condamnation.peine_principale}</p>}
      <p className="text-xs text-ink-faint">Condamnation du {new Date(condamnation.condamnee_at).toLocaleDateString("fr-FR")}</p>
      {detaillee && condamnation.rehabilitation && (
        <p className="text-xs text-ink-faint">
          Réhabilitée ({condamnation.rehabilitation.type === "plein_droit" ? "de plein droit" : "judiciaire"}) le{" "}
          {new Date(condamnation.rehabilitation.decidee_at).toLocaleDateString("fr-FR")}
        </p>
      )}
      {detaillee && condamnation.amnistie && (
        <p className="text-xs text-ink-faint">
          Amnistiée ({condamnation.amnistie.texte_reference}) le {new Date(condamnation.amnistie.decidee_at).toLocaleDateString("fr-FR")}
        </p>
      )}
    </div>
  );
}
