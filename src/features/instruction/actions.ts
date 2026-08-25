"use server";

import { redirect } from "next/navigation";

import {
  affecterJugeInstruction,
  emettreMandat,
  enregistrerActeInstruction,
  leverMesureSurete,
  mettreAJourActeInstruction,
  mettreAJourMandat,
  mettreEnExamen,
  placerEnDetentionProvisoire,
  placerSousControleJudiciaire,
  rendreOrdonnance,
  renouvelerDetentionProvisoire,
} from "@/lib/api/instruction";
import { redirectAvecErreur } from "@/lib/forms/action-error";
import type { Ordonnance, TypeActeInstruction, TypeMandat } from "@/types/instruction";

export async function actionAffecterJuge(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await affecterJugeInstruction(dossierId, Number(formData.get("juge_id")));
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionMettreEnExamen(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await mettreEnExamen(dossierId, Number(formData.get("personne_id")), formData.get("statut") as "mis_en_examen" | "temoin_assiste");
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionEnregistrerActe(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await enregistrerActeInstruction(
      dossierId,
      formData.get("type") as TypeActeInstruction,
      formData.get("description")?.toString() || undefined,
      formData.get("date_prevue")?.toString() || undefined,
    );
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionMettreAJourActe(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await mettreAJourActeInstruction(Number(formData.get("acte_id")), formData.get("statut")!.toString());
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionEmettreMandat(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await emettreMandat(dossierId, Number(formData.get("personne_id")), formData.get("type") as TypeMandat);
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionMettreAJourMandat(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await mettreAJourMandat(Number(formData.get("mandat_id")), formData.get("etape") as "diffuse" | "execute");
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionPlacerSousControleJudiciaire(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await placerSousControleJudiciaire(dossierId, Number(formData.get("personne_id")), formData.get("obligations")!.toString());
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionPlacerEnDetentionProvisoire(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await placerEnDetentionProvisoire(dossierId, Number(formData.get("personne_id")));
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionRenouvelerDetention(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await renouvelerDetentionProvisoire(Number(formData.get("mesure_id")), Number(formData.get("jours")));
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionLeverMesure(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await leverMesureSurete(Number(formData.get("mesure_id")), formData.get("motif") as "mise_en_liberte" | "echeance");
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}

export async function actionRendreOrdonnance(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await rendreOrdonnance(dossierId, formData.get("ordonnance") as Ordonnance);
  } catch (error) {
    redirectAvecErreur(`/instruction/${dossierId}`, error);
  }

  redirect(`/instruction/${dossierId}`);
}
