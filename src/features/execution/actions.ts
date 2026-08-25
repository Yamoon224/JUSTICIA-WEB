"use server";

import { redirect } from "next/navigation";

import {
  affecterTig,
  decideAmenagement,
  ecrouer,
  enregistrerHeuresTig,
  enregistrerRemiseDePeine,
  leverMiseALEpreuve,
  liberer,
  marquerAmendeRecouvree,
  mettreAExecution,
  placerSousMiseALEpreuve,
  transferer,
  transmettreAmende,
} from "@/lib/api/execution";
import { redirectAvecErreur } from "@/lib/forms/action-error";
import type { MotifLiberation, MotifRemisePeine, TypeAmenagementPeine } from "@/types/execution";

export async function actionMettreAExecution(formData: FormData): Promise<void> {
  const decisionId = Number(formData.get("decision_id"));
  const retour = formData.get("retour")?.toString() ?? "/audiencement";

  let dossierId: number;
  try {
    dossierId = (await mettreAExecution(decisionId)).id;
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionEcrouer(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));
  const detentionImputee = formData.get("detention_provisoire_imputee_jours");

  try {
    await ecrouer(dossierId, {
      etablissement_id: Number(formData.get("etablissement_id")),
      duree_jours: Number(formData.get("duree_jours")),
      detention_provisoire_imputee_jours: detentionImputee ? Number(detentionImputee) : undefined,
    });
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionTransmettreAmende(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await transmettreAmende(dossierId, Number(formData.get("montant")));
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionAffecterTig(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await affecterTig(dossierId, Number(formData.get("heures_requises")), formData.get("affecte_a")?.toString() || undefined);
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionPlacerSousMiseALEpreuve(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await placerSousMiseALEpreuve(dossierId, formData.get("obligations")!.toString());
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionEnregistrerRemiseDePeine(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await enregistrerRemiseDePeine(Number(formData.get("ecrou_id")), Number(formData.get("jours")), formData.get("motif") as MotifRemisePeine);
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionLiberer(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await liberer(Number(formData.get("ecrou_id")), formData.get("motif") as MotifLiberation);
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionTransferer(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await transferer(
      Number(formData.get("ecrou_id")),
      Number(formData.get("etablissement_destination_id")),
      formData.get("motif")?.toString() || undefined,
    );
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionDecideAmenagement(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await decideAmenagement(Number(formData.get("ecrou_id")), formData.get("type") as TypeAmenagementPeine);
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionMarquerAmendeRecouvree(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await marquerAmendeRecouvree(Number(formData.get("amende_id")));
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionEnregistrerHeuresTig(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await enregistrerHeuresTig(Number(formData.get("tig_id")), Number(formData.get("heures")));
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}

export async function actionLeverMiseALEpreuve(formData: FormData): Promise<void> {
  const dossierId = Number(formData.get("dossier_id"));

  try {
    await leverMiseALEpreuve(Number(formData.get("mise_id")));
  } catch (error) {
    redirectAvecErreur(`/execution/${dossierId}`, error);
  }

  redirect(`/execution/${dossierId}`);
}
