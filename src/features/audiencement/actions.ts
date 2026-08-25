"use server";

import { redirect } from "next/navigation";

import { enregistrerDecision, enregistrerRecours, enroler, integrerDecisionRecours, renvoyer } from "@/lib/api/audiencement";
import { redirectAvecErreur } from "@/lib/forms/action-error";
import type { DecisionType, IssueRecours, TypeRecours } from "@/types/audiencement";

export async function actionEnroler(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await enroler(dossierId, {
      juridiction_id: Number(formData.get("juridiction_id")),
      chambre: formData.get("chambre")!.toString(),
      date_audience: formData.get("date_audience")!.toString(),
      president_id: Number(formData.get("president_id")),
      greffier_id: Number(formData.get("greffier_id")),
    });
  } catch (error) {
    redirectAvecErreur(`/audiencement/${dossierId}`, error);
  }

  redirect(`/audiencement/${dossierId}`);
}

export async function actionRenvoyer(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await renvoyer(dossierId, formData.get("nouvelle_date")!.toString(), formData.get("motif")!.toString());
  } catch (error) {
    redirectAvecErreur(`/audiencement/${dossierId}`, error);
  }

  redirect(`/audiencement/${dossierId}`);
}

export async function actionEnregistrerDecision(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await enregistrerDecision(dossierId, {
      personne_id: Number(formData.get("personne_id")),
      decision: formData.get("decision") as DecisionType,
      peine_principale: formData.get("peine_principale")?.toString() || undefined,
      sursis: formData.get("sursis") === "on",
      interets_civils: formData.get("interets_civils")?.toString() || undefined,
    });
  } catch (error) {
    redirectAvecErreur(`/audiencement/${dossierId}`, error);
  }

  redirect(`/audiencement/${dossierId}`);
}

export async function actionEnregistrerRecours(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));
  const personneId = formData.get("formee_par_personne_id");

  try {
    await enregistrerRecours(
      Number(formData.get("decision_id")),
      formData.get("type") as TypeRecours,
      personneId ? Number(personneId) : undefined,
    );
  } catch (error) {
    redirectAvecErreur(`/audiencement/${dossierId}`, error);
  }

  redirect(`/audiencement/${dossierId}`);
}

export async function actionIntegrerDecisionRecours(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await integrerDecisionRecours(Number(formData.get("recours_id")), formData.get("issue") as IssueRecours);
  } catch (error) {
    redirectAvecErreur(`/audiencement/${dossierId}`, error);
  }

  redirect(`/audiencement/${dossierId}`);
}
