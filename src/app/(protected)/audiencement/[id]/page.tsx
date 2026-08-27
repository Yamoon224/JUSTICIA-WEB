import Link from "next/link";
import { ArrowLeft, CalendarClock, Gavel, Landmark, Scale, ScrollText } from "lucide-react";

import { Badge, Card, EmptyState, ErrorBanner, Field, Mono, Select, SubmitButton, TextInput } from "@/components/ui";
import {
  actionEnregistrerDecision,
  actionEnregistrerRecours,
  actionEnroler,
  actionIntegrerDecisionRecours,
  actionRenvoyer,
} from "@/features/audiencement/actions";
import { actionMettreAExecution } from "@/features/execution/actions";
import { obtenirDossierAudiencement } from "@/lib/api/audiencement";
import { listerGreffiers, listerJugesAudience, listerJuridictions } from "@/lib/api/referentiels";
import { getCurrentAgent } from "@/lib/auth/current-agent";
import type { DecisionType, TypeRecours } from "@/types/audiencement";

export const metadata = { title: "Dossier d'audiencement — JUSTICIA" };

const LIBELLES_DECISION: Record<DecisionType, string> = {
  condamnation: "Condamnation",
  relaxe: "Relaxe",
  acquittement: "Acquittement",
  dispense_de_peine: "Dispense de peine",
};

const LIBELLES_RECOURS: Record<TypeRecours, string> = {
  appel: "Appel",
  opposition: "Opposition",
  pourvoi_cassation: "Pourvoi en cassation",
};

export default async function DossierAudiencementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const [dossier, agent] = await Promise.all([obtenirDossierAudiencement(Number(id)), getCurrentAgent()]);
  const affaire = dossier.affaire;
  const estAEnroler = dossier.statut === "a_enroler";
  const estEnrole = dossier.statut !== "a_enroler";
  const peutMettreAExecution = agent?.permissions.includes("execution.gerer") ?? false;

  const [juridictions, juges, greffiers] = estAEnroler
    ? await Promise.all([listerJuridictions(), listerJugesAudience(), listerGreffiers()])
    : [[], [], []];

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-seal">Audiencement</span>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            <Mono>{affaire.numero_affaire}</Mono>
          </h1>
          <Badge tone={dossier.statut === "jugee" ? "forest" : estEnrole ? "neutral" : "gold"}>
            {dossier.statut === "jugee" ? "jugée" : estEnrole ? "enrôlé" : "à enrôler"}
          </Badge>
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
        <Link href={`/affaires/${affaire.id}`} className="w-fit text-sm text-seal hover:underline">
          Voir le dossier d&apos;affaire complet →
        </Link>
      </Card>

      {estAEnroler ? (
        <Card title="Enrôlement" description="Juridiction, chambre, date et composition — un acte du greffe.">
          <form action={actionEnroler} className="flex flex-col gap-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Juridiction" htmlFor="juridiction_id">
                <Select id="juridiction_id" name="juridiction_id" required defaultValue="">
                  <option value="" disabled>
                    Sélectionner...
                  </option>
                  {juridictions.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nom}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Chambre" htmlFor="chambre">
                <TextInput id="chambre" name="chambre" required placeholder="Chambre correctionnelle" />
              </Field>
            </div>
            <Field label="Date d'audience" htmlFor="date_audience">
              <TextInput id="date_audience" name="date_audience" type="datetime-local" required />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Président" htmlFor="president_id">
                <Select id="president_id" name="president_id" required defaultValue="">
                  <option value="" disabled>
                    Sélectionner...
                  </option>
                  {juges.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.prenom} {j.nom}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Greffier" htmlFor="greffier_id">
                <Select id="greffier_id" name="greffier_id" required defaultValue="">
                  <option value="" disabled>
                    Sélectionner...
                  </option>
                  {greffiers.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.prenom} {g.nom}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <SubmitButton>
              <CalendarClock size={16} />
              Enrôler
            </SubmitButton>
          </form>
        </Card>
      ) : (
        <Card title="Audience">
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-ink-soft">Chambre</dt>
            <dd className="text-ink">{dossier.chambre}</dd>
            <dt className="text-ink-soft">Date</dt>
            <dd className="text-ink">
              {dossier.date_audience && new Date(dossier.date_audience).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
            </dd>
          </dl>

          {dossier.renvois && dossier.renvois.length > 0 && (
            <ul className="flex flex-col gap-1 border-l-2 border-line pl-3 text-xs text-ink-faint">
              {dossier.renvois.map((renvoi) => (
                <li key={renvoi.id}>
                  Renvoyée au {new Date(renvoi.nouvelle_date_audience).toLocaleDateString("fr-FR")} — {renvoi.motif}
                </li>
              ))}
            </ul>
          )}

          {dossier.statut === "enrole" && (
            <form action={actionRenvoyer} className="flex flex-wrap items-end gap-3 border-t border-line pt-4">
              <input type="hidden" name="dossier_id" value={dossier.id} />
              <Field label="Nouvelle date" htmlFor="nouvelle_date">
                <TextInput id="nouvelle_date" name="nouvelle_date" type="datetime-local" required />
              </Field>
              <Field label="Motif" htmlFor="motif">
                <TextInput id="motif" name="motif" required placeholder="Ex. Absence du prévenu" />
              </Field>
              <SubmitButton variant="secondary">Renvoyer</SubmitButton>
            </form>
          )}
        </Card>
      )}

      <Card title="Décisions" description="Par prévenu ; met immédiatement à jour son statut sur l'affaire.">
        {dossier.decisions?.length ? (
          <ul className="flex flex-col gap-3">
            {dossier.decisions.map((decision) => {
              const personne = affaire.personnes?.find((p) => p.id === decision.personne_id);
              const recoursRecevableNonResolu = decision.recours?.find((r) => r.recevable && !r.decision_recours);

              return (
                <li key={decision.id} className="flex flex-col gap-3 rounded-xl border border-line bg-paper-sunken/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-medium text-ink">
                      <Scale size={15} className="text-ink-faint" />
                      {personne?.nom_affichage ?? `Personne #${decision.personne_id}`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge tone={decision.decision === "condamnation" || decision.decision === "dispense_de_peine" ? "rust" : "forest"}>
                        {LIBELLES_DECISION[decision.decision]}
                      </Badge>
                      <Badge tone={decision.est_definitive ? "forest" : "gold"}>
                        {decision.est_definitive ? "définitive" : "délai en cours"}
                      </Badge>
                    </div>
                  </div>
                  {decision.peine_principale && (
                    <p className="text-sm text-ink-soft">
                      {decision.peine_principale}
                      {decision.sursis && " (avec sursis)"}
                    </p>
                  )}
                  {decision.interets_civils && <p className="text-sm text-ink-soft">Intérêts civils : {decision.interets_civils}</p>}
                  <p className="text-xs text-ink-faint">
                    Délai de recours jusqu&apos;au {new Date(decision.delai_recours_expire_at).toLocaleDateString("fr-FR")}
                  </p>

                  {decision.decision === "condamnation" && (
                    <div className="border-t border-line pt-3">
                      {decision.dossier_execution_id ? (
                        <Link
                          href={`/execution/${decision.dossier_execution_id}`}
                          className="inline-flex w-fit items-center gap-1.5 text-sm text-seal hover:underline"
                        >
                          <Landmark size={14} />
                          Voir le dossier d&apos;exécution →
                        </Link>
                      ) : decision.est_definitive ? (
                        peutMettreAExecution ? (
                          <form action={actionMettreAExecution}>
                            <input type="hidden" name="decision_id" value={decision.id} />
                            <input type="hidden" name="retour" value={`/audiencement/${dossier.id}`} />
                            <SubmitButton variant="secondary">
                              <Landmark size={16} />
                              Mettre à exécution
                            </SubmitButton>
                          </form>
                        ) : (
                          <p className="flex items-center gap-1.5 text-xs text-ink-faint">
                            <Landmark size={13} />
                            Décision définitive — mise à exécution à la charge du service pénitentiaire.
                          </p>
                        )
                      ) : (
                        <p className="text-xs text-ink-faint">
                          Mise à exécution possible une fois la décision définitive.
                        </p>
                      )}
                    </div>
                  )}

                  {decision.recours && decision.recours.length > 0 && (
                    <ul className="flex flex-col gap-2 border-t border-line pt-3">
                      {decision.recours.map((recours) => (
                        <li key={recours.id} className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <ScrollText size={14} className="text-ink-faint" />
                            <span className="text-ink">{LIBELLES_RECOURS[recours.type]}</span>
                            <Badge tone={recours.recevable ? "neutral" : "rust"}>{recours.recevable ? "recevable" : "irrecevable"}</Badge>
                            {recours.decision_recours && <Badge tone="forest">{recours.decision_recours.replaceAll("_", " ")}</Badge>}
                          </div>
                          {recours === recoursRecevableNonResolu && (
                            <form action={actionIntegrerDecisionRecours} className="flex flex-wrap items-end gap-2">
                              <input type="hidden" name="dossier_id" value={dossier.id} />
                              <input type="hidden" name="recours_id" value={recours.id} />
                              <Select name="issue" required defaultValue="" className="w-auto">
                                <option value="" disabled>
                                  Issue...
                                </option>
                                <option value="confirmation">Confirmation</option>
                                <option value="infirmation">Infirmation</option>
                                <option value="cassation_avec_renvoi">Cassation avec renvoi</option>
                              </Select>
                              <SubmitButton variant="secondary">Intégrer</SubmitButton>
                            </form>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {!decision.est_definitive && !recoursRecevableNonResolu && (
                    <form action={actionEnregistrerRecours} className="flex flex-wrap items-end gap-2 border-t border-line pt-3">
                      <input type="hidden" name="dossier_id" value={dossier.id} />
                      <input type="hidden" name="decision_id" value={decision.id} />
                      <input type="hidden" name="formee_par_personne_id" value={decision.personne_id} />
                      <Field label="Recours" htmlFor={`type-recours-${decision.id}`}>
                        <Select id={`type-recours-${decision.id}`} name="type" required>
                          <option value="appel">Appel</option>
                          <option value="opposition">Opposition</option>
                          <option value="pourvoi_cassation">Pourvoi en cassation</option>
                        </Select>
                      </Field>
                      <SubmitButton variant="secondary">Enregistrer le recours</SubmitButton>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState message="Aucune décision rendue." />
        )}

        {estEnrole && (
          <form action={actionEnregistrerDecision} className="flex flex-col gap-3 border-t border-line pt-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Personne" htmlFor="personne_id">
                <Select id="personne_id" name="personne_id" required defaultValue="">
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
              <Field label="Décision" htmlFor="decision">
                <Select id="decision" name="decision" required defaultValue="">
                  <option value="" disabled>
                    Sélectionner...
                  </option>
                  {(Object.keys(LIBELLES_DECISION) as DecisionType[]).map((decision) => (
                    <option key={decision} value={decision}>
                      {LIBELLES_DECISION[decision]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Peine principale" htmlFor="peine_principale" hint="le cas échéant">
              <TextInput id="peine_principale" name="peine_principale" placeholder="Emprisonnement 6 mois" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" name="sursis" className="h-4 w-4 rounded border-line-strong" />
              Avec sursis
            </label>
            <Field label="Intérêts civils" htmlFor="interets_civils" hint="le cas échéant">
              <TextInput id="interets_civils" name="interets_civils" placeholder="Ex. 500 000 FCFA à la partie civile" />
            </Field>
            <SubmitButton>
              <Gavel size={16} />
              Enregistrer la décision
            </SubmitButton>
          </form>
        )}
      </Card>

      <Link href="/audiencement" className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-seal">
        <ArrowLeft size={15} />
        Retour à l&apos;audiencement
      </Link>
    </div>
  );
}
