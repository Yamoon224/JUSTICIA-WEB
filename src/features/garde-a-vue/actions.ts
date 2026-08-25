"use server";

import { redirect } from "next/navigation";

import {
  aviserRepresentantLegal,
  cloturerGardeAVue,
  enregistrerActeGardeAVue,
  notifierDroitGardeAVue,
  placerEnGardeAVue,
  prolongerGardeAVue,
} from "@/lib/api/garde-a-vue";
import { redirectAvecErreur } from "@/lib/forms/action-error";
import type { DroitGav, IssueGav } from "@/types/mesure-gav";

export async function actionPlacerEnGardeAVue(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  let mesure;
  try {
    mesure = await placerEnGardeAVue({
      affaire_id: affaireId,
      personne_id: Number(formData.get("personne_id")),
      unite_id: Number(formData.get("unite_id")),
    });
  } catch (error) {
    redirectAvecErreur(`/garde-a-vue/nouvelle?affaire_id=${affaireId}`, error);
  }

  redirect(`/garde-a-vue/${mesure.id}`);
}

export async function actionProlongerGardeAVue(formData: FormData): Promise<void> {
  const mesureId = Number(formData.get("mesure_id"));

  try {
    await prolongerGardeAVue(mesureId, Number(formData.get("heures")), Number(formData.get("autorise_par_id")));
  } catch (error) {
    redirectAvecErreur(`/garde-a-vue/${mesureId}`, error);
  }

  redirect(`/garde-a-vue/${mesureId}`);
}

export async function actionNotifierDroitGardeAVue(formData: FormData): Promise<void> {
  const mesureId = Number(formData.get("mesure_id"));

  try {
    await notifierDroitGardeAVue(
      mesureId,
      formData.get("droit")!.toString() as DroitGav,
      formData.get("mode_de_remise")!.toString(),
    );
  } catch (error) {
    redirectAvecErreur(`/garde-a-vue/${mesureId}`, error);
  }

  redirect(`/garde-a-vue/${mesureId}`);
}

export async function actionAviserRepresentantLegal(formData: FormData): Promise<void> {
  const mesureId = Number(formData.get("mesure_id"));

  try {
    await aviserRepresentantLegal(mesureId);
  } catch (error) {
    redirectAvecErreur(`/garde-a-vue/${mesureId}`, error);
  }

  redirect(`/garde-a-vue/${mesureId}`);
}

export async function actionEnregistrerActeGardeAVue(formData: FormData): Promise<void> {
  const mesureId = Number(formData.get("mesure_id"));

  try {
    await enregistrerActeGardeAVue(
      mesureId,
      formData.get("type")!.toString(),
      formData.get("debut_at")!.toString(),
      formData.get("fin_at")?.toString() || undefined,
      formData.get("notes")?.toString() || undefined,
    );
  } catch (error) {
    redirectAvecErreur(`/garde-a-vue/${mesureId}`, error);
  }

  redirect(`/garde-a-vue/${mesureId}`);
}

export async function actionCloturerGardeAVue(formData: FormData): Promise<void> {
  const mesureId = Number(formData.get("mesure_id"));

  try {
    await cloturerGardeAVue(mesureId, formData.get("issue")!.toString() as IssueGav);
  } catch (error) {
    redirectAvecErreur(`/garde-a-vue/${mesureId}`, error);
  }

  redirect(`/garde-a-vue/${mesureId}`);
}
