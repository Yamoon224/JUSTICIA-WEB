"use server";

import { redirect } from "next/navigation";

import { marquerAlerteLue } from "@/lib/api/alertes";
import { redirectAvecErreur } from "@/lib/forms/action-error";

export async function actionMarquerAlerteLue(formData: FormData): Promise<void> {
  const alerteId = Number(formData.get("alerte_id"));
  const nonLues = formData.get("non_lues") === "1";
  const retour = nonLues ? "/alertes?non_lues=1" : "/alertes";

  try {
    await marquerAlerteLue(alerteId);
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}
