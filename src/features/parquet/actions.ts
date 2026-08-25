"use server";

import { redirect } from "next/navigation";

import { affecterMagistrat, enregistrerRequisition, orienterDossier } from "@/lib/api/parquet";
import { redirectAvecErreur } from "@/lib/forms/action-error";
import type { OrientationParquet } from "@/types/parquet";

export async function actionAffecterMagistrat(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await affecterMagistrat(dossierId, Number(formData.get("magistrat_id")));
  } catch (error) {
    redirectAvecErreur(`/parquet/${dossierId}`, error);
  }

  redirect(`/parquet/${dossierId}`);
}

export async function actionOrienterDossier(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));
  const motifClassementId = formData.get("motif_classement_id");

  try {
    await orienterDossier(
      dossierId,
      formData.get("orientation")!.toString() as OrientationParquet,
      motifClassementId ? Number(motifClassementId) : undefined,
    );
  } catch (error) {
    redirectAvecErreur(`/parquet/${dossierId}`, error);
  }

  redirect(`/parquet/${dossierId}`);
}

export async function actionEnregistrerRequisition(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await enregistrerRequisition(dossierId, formData.get("type")!.toString(), formData.get("contenu")!.toString());
  } catch (error) {
    redirectAvecErreur(`/parquet/${dossierId}`, error);
  }

  redirect(`/parquet/${dossierId}`);
}
