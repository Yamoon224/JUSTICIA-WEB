import Link from "next/link";
import { ArrowLeft, FileClock, Gavel, Lock, ScrollText, ShieldAlert, UserCog2 } from "lucide-react";

import { RichTextArea } from "@/components/rich-text-editor";
import { Badge, Card, EmptyState, ErrorBanner, Field, Mono, RichText, Select, SubmitButton, TextInput } from "@/components/ui";
import {
  actionAffecterJuge,
  actionEmettreMandat,
  actionEnregistrerActe,
  actionLeverMesure,
  actionMettreAJourActe,
  actionMettreAJourMandat,
  actionMettreEnExamen,
  actionPlacerEnDetentionProvisoire,
  actionPlacerSousControleJudiciaire,
  actionRendreOrdonnance,
  actionRenouvelerDetention,
} from "@/features/instruction/actions";
import { obtenirDossierInstruction } from "@/lib/api/instruction";
import { listerJugesInstruction } from "@/lib/api/referentiels";

export const metadata = { title: "Dossier d'instruction — JUSTICIA" };

const TYPES_ACTES = ["interrogatoire", "confrontation", "transport", "commission_rogatoire", "expertise"];
const TYPES_MANDATS = ["comparution", "amener", "depot", "arret"];

export default async function DossierInstructionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const dossier = await obtenirDossierInstruction(Number(id));
  const affaire = dossier.affaire;
  const enCours = dossier.statut === "en_cours";
  const detentionsEnCours = dossier.mesures_surete?.filter((m) => m.type === "detention_provisoire" && m.statut === "en_cours") ?? [];
  const uneDetentionDepassee = detentionsEnCours.some((m) => m.echeance_depassee);

  const juges = !dossier.juge_instruction_id && enCours ? await listerJugesInstruction() : [];

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-seal">Instruction</span>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            <Mono>{affaire.numero_affaire}</Mono>
          </h1>
          {dossier.ordonnance ? (
            <Badge tone="forest">{dossier.ordonnance.replaceAll("_", " ")}</Badge>
          ) : dossier.juge_instruction_id ? (
            <Badge tone="neutral">en cours</Badge>
          ) : (
            <Badge tone="gold">non affecté</Badge>
          )}
        </div>
      </div>

      <ErrorBanner message={erreur} />

      {uneDetentionDepassee && (
        <div className="flex items-center gap-3 rounded-2xl border border-rust/30 bg-rust-tint px-5 py-4 text-rust">
          <ShieldAlert size={20} className="shrink-0" />
          <p className="text-sm font-medium">
            Détention provisoire à échéance dépassée — signalement prioritaire requis.
          </p>
        </div>
      )}

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

      {!dossier.juge_instruction_id && enCours && (
        <Card title="Affectation">
          <form action={actionAffecterJuge} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <Field label="Juge d'instruction" htmlFor="juge_id">
              <Select id="juge_id" name="juge_id" required defaultValue="">
                <option value="" disabled>
                  Sélectionner...
                </option>
                {juges.map((juge) => (
                  <option key={juge.id} value={juge.id}>
                    {juge.prenom} {juge.nom} — {juge.matricule}
                  </option>
                ))}
              </Select>
            </Field>
            <SubmitButton>
              <UserCog2 size={16} />
              Affecter
            </SubmitButton>
          </form>
        </Card>
      )}

      <Card title="Personnes & statuts" description="Un statut par affaire, jamais figé sur la fiche personne.">
        {affaire.personnes?.length ? (
          <ul className="flex flex-col divide-y divide-line">
            {affaire.personnes.map((personne) => (
              <li key={`${personne.id}-${personne.statut}`} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <Link href={`/personnes/${personne.id}`} className="text-sm font-medium text-ink hover:text-seal">
                  {personne.nom_affichage}
                </Link>
                <Badge tone="gold">{personne.statut.replaceAll("_", " ")}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Aucune personne rattachée." />
        )}

        {enCours && (
          <form action={actionMettreEnExamen} className="flex flex-wrap items-end gap-3 border-t border-line pt-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <Field label="Personne" htmlFor="personne_id-mee">
              <Select id="personne_id-mee" name="personne_id" required defaultValue="">
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
            <Field label="Statut" htmlFor="statut-mee">
              <Select id="statut-mee" name="statut" required>
                <option value="mis_en_examen">Mise en examen</option>
                <option value="temoin_assiste">Témoin assisté</option>
              </Select>
            </Field>
            <SubmitButton variant="secondary">Enregistrer</SubmitButton>
          </form>
        )}
      </Card>

      <Card title="Mesures de sûreté" description="Contrôle judiciaire ou détention provisoire, jamais renouvelées automatiquement.">
        {dossier.mesures_surete?.length ? (
          <ul className="flex flex-col gap-3">
            {dossier.mesures_surete.map((mesure) => (
              <li key={mesure.id} className="flex flex-col gap-3 rounded-xl border border-line bg-paper-sunken/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <Lock size={15} className="text-ink-faint" />
                    {mesure.type.replaceAll("_", " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    {mesure.echeance_depassee && <Badge tone="rust">échéance dépassée</Badge>}
                    <Badge tone={mesure.statut === "terminee" ? "forest" : "neutral"}>
                      {mesure.statut === "terminee" ? (mesure.motif_fin?.replaceAll("_", " ") ?? "terminée") : "en cours"}
                    </Badge>
                  </div>
                </div>

                <RichText html={mesure.obligations} />
                {mesure.fin_prevue_at && (
                  <p className="text-xs text-ink-faint">
                    Échéance : {new Date(mesure.fin_prevue_at).toLocaleString("fr-FR", { dateStyle: "long" })}
                  </p>
                )}

                {mesure.statut === "en_cours" && (
                  <div className="flex flex-wrap gap-3">
                    {mesure.type === "detention_provisoire" && (
                      <form action={actionRenouvelerDetention} className="flex items-end gap-2">
                        <input type="hidden" name="dossier_id" value={dossier.id} />
                        <input type="hidden" name="mesure_id" value={mesure.id} />
                        <Field label="Renouveler de (jours)" htmlFor={`jours-${mesure.id}`}>
                          <TextInput id={`jours-${mesure.id}`} name="jours" type="number" min={1} max={365} required placeholder="Ex. 30" className="w-28" />
                        </Field>
                        <SubmitButton variant="secondary">
                          <FileClock size={15} />
                          Renouveler
                        </SubmitButton>
                      </form>
                    )}
                    <form action={actionLeverMesure} className="flex items-end gap-2">
                      <input type="hidden" name="dossier_id" value={dossier.id} />
                      <input type="hidden" name="mesure_id" value={mesure.id} />
                      <input type="hidden" name="motif" value="mise_en_liberte" />
                      <SubmitButton variant="secondary">Mainlevée</SubmitButton>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Aucune mesure de sûreté." />
        )}

        {enCours && (
          <div className="grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-2">
            <form action={actionPlacerSousControleJudiciaire} className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Contrôle judiciaire</span>
              <input type="hidden" name="dossier_id" value={dossier.id} />
              <Field label="Personne" htmlFor="personne_id-cj">
                <Select id="personne_id-cj" name="personne_id" required defaultValue="">
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
              <Field label="Obligations" htmlFor="obligations">
                <RichTextArea id="obligations" name="obligations" rows={2} required placeholder="Ex. Pointage hebdomadaire au commissariat." />
              </Field>
              <SubmitButton variant="secondary">Placer sous contrôle</SubmitButton>
            </form>

            <form action={actionPlacerEnDetentionProvisoire} className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Détention provisoire</span>
              <input type="hidden" name="dossier_id" value={dossier.id} />
              <Field label="Personne" htmlFor="personne_id-dp">
                <Select id="personne_id-dp" name="personne_id" required defaultValue="">
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
              <SubmitButton variant="danger">Placer en détention</SubmitButton>
            </form>
          </div>
        )}
      </Card>

      <Card title="Mandats" description="Comparution, amener, dépôt, arrêt.">
        {dossier.mandats?.length ? (
          <ul className="flex flex-col gap-3">
            {dossier.mandats.map((mandat) => (
              <li key={mandat.id} className="flex flex-col gap-2 rounded-xl border border-line bg-paper-sunken/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <Gavel size={15} className="text-ink-faint" />
                    {mandat.type}
                  </span>
                  <div className="flex gap-1.5">
                    <Badge tone={mandat.diffuse_at ? "forest" : "gold"}>{mandat.diffuse_at ? "diffusé" : "non diffusé"}</Badge>
                    <Badge tone={mandat.execute_at ? "forest" : "neutral"}>{mandat.execute_at ? "exécuté" : "non exécuté"}</Badge>
                  </div>
                </div>
                {enCours && (!mandat.diffuse_at || !mandat.execute_at) && (
                  <form action={actionMettreAJourMandat} className="flex gap-2">
                    <input type="hidden" name="dossier_id" value={dossier.id} />
                    <input type="hidden" name="mandat_id" value={mandat.id} />
                    <input type="hidden" name="etape" value={!mandat.diffuse_at ? "diffuse" : "execute"} />
                    <SubmitButton variant="secondary">{!mandat.diffuse_at ? "Marquer diffusé" : "Marquer exécuté"}</SubmitButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Aucun mandat." />
        )}

        {enCours && (
          <form action={actionEmettreMandat} className="flex flex-wrap items-end gap-3 border-t border-line pt-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <Field label="Personne" htmlFor="personne_id-mandat">
              <Select id="personne_id-mandat" name="personne_id" required defaultValue="">
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
            <Field label="Type" htmlFor="type-mandat">
              <Select id="type-mandat" name="type" required>
                {TYPES_MANDATS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
            <SubmitButton variant="secondary">Émettre le mandat</SubmitButton>
          </form>
        )}
      </Card>

      <Card title="Actes d'instruction">
        {dossier.actes?.length ? (
          <ul className="flex flex-col gap-3">
            {dossier.actes.map((acte) => (
              <li key={acte.id} className="flex flex-col gap-2 rounded-xl border border-line bg-paper-sunken/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <ScrollText size={15} className="text-ink-faint" />
                    {acte.type.replaceAll("_", " ")}
                  </span>
                  <Badge tone={acte.statut === "en_attente" ? "gold" : "forest"}>{acte.statut.replaceAll("_", " ")}</Badge>
                </div>
                <RichText html={acte.description} />

                {enCours && acte.statut === "en_attente" && (
                  <form action={actionMettreAJourActe} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="dossier_id" value={dossier.id} />
                    <input type="hidden" name="acte_id" value={acte.id} />
                    <Select name="statut" required defaultValue="" className="w-auto">
                      <option value="" disabled>
                        Statut...
                      </option>
                      <option value="realise">Réalisé</option>
                      {acte.type === "commission_rogatoire" && <option value="retour_recu">Retour reçu</option>}
                      {acte.type === "expertise" && <option value="rapport_depose">Rapport déposé</option>}
                    </Select>
                    <SubmitButton variant="secondary">Mettre à jour</SubmitButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="Aucun acte d'instruction." />
        )}

        {enCours && (
          <form action={actionEnregistrerActe} className="flex flex-col gap-3 border-t border-line pt-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Type" htmlFor="type-acte">
                <Select id="type-acte" name="type" required>
                  {TYPES_ACTES.map((type) => (
                    <option key={type} value={type}>
                      {type.replaceAll("_", " ")}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Date prévue" htmlFor="date_prevue">
                <TextInput id="date_prevue" name="date_prevue" type="date" />
              </Field>
            </div>
            <Field label="Description" htmlFor="description-acte">
              <RichTextArea id="description-acte" name="description" rows={2} placeholder="Ex. Expertise psychiatrique du mis en examen." />
            </Field>
            <SubmitButton variant="secondary">Enregistrer l&apos;acte</SubmitButton>
          </form>
        )}
      </Card>

      {enCours && dossier.juge_instruction_id && (
        <Card title="Ordonnance de règlement" description="Seule décision qui clôture le dossier — jamais automatique.">
          <form action={actionRendreOrdonnance} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <Field label="Ordonnance" htmlFor="ordonnance">
              <Select id="ordonnance" name="ordonnance" required defaultValue="">
                <option value="" disabled>
                  Sélectionner...
                </option>
                <option value="renvoi">Renvoi (vers le jugement)</option>
                <option value="non_lieu">Non-lieu</option>
              </Select>
            </Field>
            <SubmitButton>
              <Gavel size={16} />
              Rendre l&apos;ordonnance
            </SubmitButton>
          </form>
        </Card>
      )}

      <Link href="/instruction" className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-seal">
        <ArrowLeft size={15} />
        Retour au cabinet d&apos;instruction
      </Link>
    </div>
  );
}
