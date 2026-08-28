import Link from "next/link";
import { ArrowLeft, ArrowRightLeft, Banknote, HardHat, Handshake, Lock, ScrollText, Unlock } from "lucide-react";

import { Badge, Card, EmptyState, ErrorBanner, Field, Mono, RichText, Select, SubmitButton, TextInput } from "@/components/ui";
import {
  actionAffecterTig,
  actionDecideAmenagement,
  actionEcrouer,
  actionEnregistrerHeuresTig,
  actionEnregistrerRemiseDePeine,
  actionLeverMiseALEpreuve,
  actionLiberer,
  actionMarquerAmendeRecouvree,
  actionPlacerSousMiseALEpreuve,
  actionTransferer,
  actionTransmettreAmende,
} from "@/features/execution/actions";
import { obtenirDossierExecution } from "@/lib/api/execution";
import { listerEtablissementsPenitentiaires } from "@/lib/api/referentiels";
import type { MotifLiberation, MotifRemisePeine, TypeAmenagementPeine } from "@/types/execution";

export const metadata = { title: "Dossier d'exécution — JUSTICIA" };

const LIBELLES_MOTIF_LIBERATION: Record<MotifLiberation, string> = {
  terme: "Terme de la peine",
  amenagement: "Aménagement de peine",
  grace: "Grâce",
};

const LIBELLES_MOTIF_REMISE: Record<MotifRemisePeine, string> = {
  grace: "Grâce",
  reduction_peine: "Réduction de peine",
};

const LIBELLES_AMENAGEMENT: Record<TypeAmenagementPeine, string> = {
  liberation_conditionnelle: "Libération conditionnelle",
  semi_liberte: "Semi-liberté",
  placement_exterieur: "Placement extérieur",
};

export default async function DossierExecutionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const dossier = await obtenirDossierExecution(Number(id));
  const affaire = dossier.affaire;
  const personne = affaire?.personnes?.find((p) => p.id === dossier.personne_id);
  const dossierEnCours = dossier.statut === "en_cours";
  const ecrou = dossier.ecrou;

  const besoinEtablissements = dossierEnCours && (!ecrou || ecrou.statut === "en_detention");
  const etablissements = besoinEtablissements ? await listerEtablissementsPenitentiaires() : [];

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-seal">Exécution des peines</span>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            <Mono>{affaire?.numero_affaire ?? `Dossier #${dossier.id}`}</Mono>
          </h1>
          <Badge tone={dossier.statut === "terminee" ? "forest" : "gold"}>
            {dossier.statut === "terminee" ? "terminée" : "en cours"}
          </Badge>
        </div>
        <p className="text-sm text-ink-soft">{personne?.nom_affichage ?? `Personne #${dossier.personne_id}`}</p>
      </div>

      <ErrorBanner message={erreur} />

      {affaire && (
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
      )}

      {/* Écrou */}
      <Card
        title="Écrou"
        description="Détention consécutive à la condamnation."
        actions={
          ecrou && <Lock size={16} className={ecrou.echeance_depassee ? "text-rust" : "text-ink-faint"} />
        }
      >
        {ecrou ? (
          <div className="flex flex-col gap-4">
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-ink-soft">Numéro</dt>
              <dd className="text-ink">
                <Mono>{ecrou.numero_ecrou}</Mono>
              </dd>
              <dt className="text-ink-soft">Statut</dt>
              <dd>
                <Badge tone={ecrou.statut === "libere" ? "forest" : ecrou.echeance_depassee ? "rust" : "neutral"}>
                  {ecrou.statut === "libere" ? "libéré" : ecrou.echeance_depassee ? "échéance dépassée" : "en détention"}
                </Badge>
              </dd>
              <dt className="text-ink-soft">Date d&apos;écrou</dt>
              <dd className="text-ink">{new Date(ecrou.date_ecrou).toLocaleDateString("fr-FR")}</dd>
              <dt className="text-ink-soft">Échéance prévue</dt>
              <dd className="text-ink">{new Date(ecrou.date_fin_prevue).toLocaleDateString("fr-FR")}</dd>
              {ecrou.date_liberation && (
                <>
                  <dt className="text-ink-soft">Libéré le</dt>
                  <dd className="text-ink">
                    {new Date(ecrou.date_liberation).toLocaleDateString("fr-FR")}
                    {ecrou.motif_liberation && ` (${LIBELLES_MOTIF_LIBERATION[ecrou.motif_liberation]})`}
                  </dd>
                </>
              )}
            </dl>

            {ecrou.remises_peine && ecrou.remises_peine.length > 0 && (
              <ul className="flex flex-col gap-1 border-l-2 border-line pl-3 text-xs text-ink-faint">
                {ecrou.remises_peine.map((remise) => (
                  <li key={remise.id}>
                    −{remise.jours} j — {LIBELLES_MOTIF_REMISE[remise.motif]} ({new Date(remise.decide_at).toLocaleDateString("fr-FR")})
                  </li>
                ))}
              </ul>
            )}

            {ecrou.transferts && ecrou.transferts.length > 0 && (
              <ul className="flex flex-col gap-1 border-l-2 border-line pl-3 text-xs text-ink-faint">
                {ecrou.transferts.map((transfert) => (
                  <li key={transfert.id} className="flex items-center gap-1.5">
                    <ArrowRightLeft size={11} />
                    Transféré le {new Date(transfert.transfere_at).toLocaleDateString("fr-FR")}
                    {transfert.motif && ` — ${transfert.motif}`}
                  </li>
                ))}
              </ul>
            )}

            {ecrou.amenagements && ecrou.amenagements.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {ecrou.amenagements.map((amenagement) => (
                  <li key={amenagement.id}>
                    <Badge tone="seal">{LIBELLES_AMENAGEMENT[amenagement.type]}</Badge>
                  </li>
                ))}
              </ul>
            )}

            {ecrou.statut === "en_detention" && (
              <div className="flex flex-col gap-4 border-t border-line pt-4">
                <form action={actionEnregistrerRemiseDePeine} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="dossier_id" value={dossier.id} />
                  <input type="hidden" name="ecrou_id" value={ecrou.id} />
                  <Field label="Remise de peine (jours)" htmlFor="jours">
                    <TextInput id="jours" name="jours" type="number" min={1} required placeholder="Ex. 10" className="w-32" />
                  </Field>
                  <Field label="Motif" htmlFor="motif-remise">
                    <Select id="motif-remise" name="motif" required defaultValue="">
                      <option value="" disabled>
                        Sélectionner...
                      </option>
                      <option value="grace">Grâce</option>
                      <option value="reduction_peine">Réduction de peine</option>
                    </Select>
                  </Field>
                  <SubmitButton variant="secondary">Enregistrer</SubmitButton>
                </form>

                <form action={actionTransferer} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="dossier_id" value={dossier.id} />
                  <input type="hidden" name="ecrou_id" value={ecrou.id} />
                  <Field label="Transférer vers" htmlFor="etablissement_destination_id">
                    <Select id="etablissement_destination_id" name="etablissement_destination_id" required defaultValue="">
                      <option value="" disabled>
                        Sélectionner...
                      </option>
                      {etablissements
                        .filter((e) => e.id !== ecrou.etablissement_id)
                        .map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.nom}
                          </option>
                        ))}
                    </Select>
                  </Field>
                  <Field label="Motif" htmlFor="motif-transfert" hint="facultatif">
                    <TextInput id="motif-transfert" name="motif" placeholder="Ex. Surpopulation carcérale" />
                  </Field>
                  <SubmitButton variant="secondary">
                    <ArrowRightLeft size={15} />
                    Transférer
                  </SubmitButton>
                </form>

                <form action={actionDecideAmenagement} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="dossier_id" value={dossier.id} />
                  <input type="hidden" name="ecrou_id" value={ecrou.id} />
                  <Field label="Aménagement de peine" htmlFor="type-amenagement">
                    <Select id="type-amenagement" name="type" required defaultValue="">
                      <option value="" disabled>
                        Sélectionner...
                      </option>
                      <option value="liberation_conditionnelle">Libération conditionnelle</option>
                      <option value="semi_liberte">Semi-liberté</option>
                      <option value="placement_exterieur">Placement extérieur</option>
                    </Select>
                  </Field>
                  <SubmitButton variant="secondary">Décider</SubmitButton>
                </form>

                <form action={actionLiberer} className="flex flex-wrap items-end gap-2 border-t border-line pt-4">
                  <input type="hidden" name="dossier_id" value={dossier.id} />
                  <input type="hidden" name="ecrou_id" value={ecrou.id} />
                  <Field label="Motif de libération" htmlFor="motif-liberation">
                    <Select id="motif-liberation" name="motif" required defaultValue="">
                      <option value="" disabled>
                        Sélectionner...
                      </option>
                      <option value="terme">Terme de la peine</option>
                      <option value="amenagement">Aménagement de peine</option>
                      <option value="grace">Grâce</option>
                    </Select>
                  </Field>
                  <SubmitButton>
                    <Unlock size={16} />
                    Libérer
                  </SubmitButton>
                </form>
              </div>
            )}
          </div>
        ) : dossierEnCours ? (
          <form action={actionEcrouer} className="flex flex-col gap-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Établissement" htmlFor="etablissement_id">
                <Select id="etablissement_id" name="etablissement_id" required defaultValue="">
                  <option value="" disabled>
                    Sélectionner...
                  </option>
                  {etablissements.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nom}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Durée (jours)" htmlFor="duree_jours">
                <TextInput id="duree_jours" name="duree_jours" type="number" min={1} required placeholder="Ex. 180" />
              </Field>
            </div>
            <Field
              label="Détention provisoire imputée (jours)"
              htmlFor="detention_provisoire_imputee_jours"
              hint="le cas échéant"
            >
              <TextInput id="detention_provisoire_imputee_jours" name="detention_provisoire_imputee_jours" type="number" min={0} placeholder="Ex. 30" />
            </Field>
            <SubmitButton>
              <Lock size={16} />
              Écrouer
            </SubmitButton>
          </form>
        ) : (
          <EmptyState message="Aucun écrou pour ce dossier." />
        )}
      </Card>

      {/* Amende */}
      <Card title="Amende" description="Transmission au Trésor puis recouvrement." actions={dossier.amende && <Banknote size={16} className="text-ink-faint" />}>
        {dossier.amende ? (
          <div className="flex flex-col gap-4">
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-ink-soft">Montant</dt>
              <dd className="text-ink">{dossier.amende.montant.toLocaleString("fr-FR")} FCFA</dd>
              <dt className="text-ink-soft">Transmise le</dt>
              <dd className="text-ink">{new Date(dossier.amende.transmise_at).toLocaleDateString("fr-FR")}</dd>
            </dl>
            <Badge tone={dossier.amende.statut === "recouvree" ? "forest" : "gold"}>
              {dossier.amende.statut === "recouvree" ? "recouvrée" : "transmise au Trésor"}
            </Badge>
            {dossier.amende.statut === "transmise_tresor" && (
              <form action={actionMarquerAmendeRecouvree} className="border-t border-line pt-4">
                <input type="hidden" name="dossier_id" value={dossier.id} />
                <input type="hidden" name="amende_id" value={dossier.amende.id} />
                <SubmitButton variant="secondary">Marquer recouvrée</SubmitButton>
              </form>
            )}
          </div>
        ) : dossierEnCours ? (
          <form action={actionTransmettreAmende} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <Field label="Montant (FCFA)" htmlFor="montant">
              <TextInput id="montant" name="montant" type="number" min={1} required placeholder="Ex. 50000" />
            </Field>
            <SubmitButton variant="secondary">
              <Banknote size={16} />
              Transmettre au Trésor
            </SubmitButton>
          </form>
        ) : (
          <EmptyState message="Aucune amende pour ce dossier." />
        )}
      </Card>

      {/* Travail d'intérêt général */}
      <Card title="Travail d'intérêt général" actions={dossier.tig && <HardHat size={16} className="text-ink-faint" />}>
        {dossier.tig ? (
          <div className="flex flex-col gap-4">
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-ink-soft">Heures</dt>
              <dd className="text-ink">
                {dossier.tig.heures_effectuees} / {dossier.tig.heures_requises}
              </dd>
              {dossier.tig.affecte_a && (
                <>
                  <dt className="text-ink-soft">Affectation</dt>
                  <dd className="text-ink">{dossier.tig.affecte_a}</dd>
                </>
              )}
            </dl>
            <Badge tone={dossier.tig.statut === "terminee" ? "forest" : "gold"}>
              {dossier.tig.statut === "terminee" ? "terminé" : "en cours"}
            </Badge>
            {dossier.tig.statut === "en_cours" && (
              <form action={actionEnregistrerHeuresTig} className="flex flex-wrap items-end gap-2 border-t border-line pt-4">
                <input type="hidden" name="dossier_id" value={dossier.id} />
                <input type="hidden" name="tig_id" value={dossier.tig.id} />
                <Field label="Heures effectuées" htmlFor="heures">
                  <TextInput id="heures" name="heures" type="number" min={1} required placeholder="Ex. 8" className="w-32" />
                </Field>
                <SubmitButton variant="secondary">Enregistrer</SubmitButton>
              </form>
            )}
          </div>
        ) : dossierEnCours ? (
          <form action={actionAffecterTig} className="flex flex-col gap-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Heures requises" htmlFor="heures_requises">
                <TextInput id="heures_requises" name="heures_requises" type="number" min={1} required placeholder="Ex. 40" />
              </Field>
              <Field label="Affectation" htmlFor="affecte_a" hint="facultatif">
                <TextInput id="affecte_a" name="affecte_a" placeholder="Mairie, association..." />
              </Field>
            </div>
            <SubmitButton variant="secondary">
              <HardHat size={16} />
              Affecter
            </SubmitButton>
          </form>
        ) : (
          <EmptyState message="Aucun TIG pour ce dossier." />
        )}
      </Card>

      {/* Sursis avec mise à l'épreuve */}
      <Card title="Mise à l'épreuve" actions={dossier.mise_a_l_epreuve && <Handshake size={16} className="text-ink-faint" />}>
        {dossier.mise_a_l_epreuve ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <ScrollText size={15} className="mt-0.5 shrink-0 text-ink-faint" />
              <RichText html={dossier.mise_a_l_epreuve.obligations} className="flex-1" />
            </div>
            <Badge tone={dossier.mise_a_l_epreuve.statut === "terminee" ? "forest" : "gold"}>
              {dossier.mise_a_l_epreuve.statut === "terminee" ? "levée" : "en cours"}
            </Badge>
            {dossier.mise_a_l_epreuve.statut === "en_cours" && (
              <form action={actionLeverMiseALEpreuve} className="border-t border-line pt-4">
                <input type="hidden" name="dossier_id" value={dossier.id} />
                <input type="hidden" name="mise_id" value={dossier.mise_a_l_epreuve.id} />
                <SubmitButton variant="secondary">
                  <Handshake size={16} />
                  Lever la mise à l&apos;épreuve
                </SubmitButton>
              </form>
            )}
          </div>
        ) : dossierEnCours ? (
          <form action={actionPlacerSousMiseALEpreuve} className="flex flex-col gap-4">
            <input type="hidden" name="dossier_id" value={dossier.id} />
            <Field label="Obligations" htmlFor="obligations">
              <TextInput id="obligations" name="obligations" required placeholder="Indemniser la victime, exercer une activité..." />
            </Field>
            <SubmitButton variant="secondary">
              <Handshake size={16} />
              Placer sous mise à l&apos;épreuve
            </SubmitButton>
          </form>
        ) : (
          <EmptyState message="Aucune mise à l'épreuve pour ce dossier." />
        )}
      </Card>

      <Link href="/execution" className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft hover:text-seal">
        <ArrowLeft size={15} />
        Retour à l&apos;exécution
      </Link>
    </div>
  );
}
