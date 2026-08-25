"use server";

import { redirect } from "next/navigation";

import {
  enregistrerMouvementScelle,
  enregistrerScelle,
  ouvrirAffaire,
  rattacherPersonne,
  rectifierProcesVerbal,
  redigerProcesVerbal,
  signerProcesVerbal,
  transmettreAuParquet,
} from "@/lib/api/affaires";
import { redirectAvecErreur } from "@/lib/forms/action-error";

export async function actionOuvrirAffaire(formData: FormData): Promise<void> {
  const infractions = formData.getAll("infractions").map(Number);

  let affaire;
  try {
    affaire = await ouvrirAffaire({
      description: formData.get("description")?.toString() || undefined,
      date_ouverture: formData.get("date_ouverture")?.toString() || undefined,
      infractions: infractions.length > 0 ? infractions : undefined,
    });
  } catch (error) {
    redirectAvecErreur("/affaires/nouvelle", error);
  }

  redirect(`/affaires/${affaire.id}`);
}

export async function actionRattacherPersonne(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await rattacherPersonne(affaireId, Number(formData.get("personne_id")), formData.get("statut")!.toString());
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}

export async function actionTransmettreAuParquet(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await transmettreAuParquet(affaireId);
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}

export async function actionRedigerProcesVerbal(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await redigerProcesVerbal(affaireId, formData.get("type")!.toString(), formData.get("contenu")!.toString());
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}

export async function actionSignerProcesVerbal(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await signerProcesVerbal(Number(formData.get("pv_id")));
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}

export async function actionRectifierProcesVerbal(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await rectifierProcesVerbal(Number(formData.get("pv_id")), formData.get("contenu")!.toString());
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}

export async function actionEnregistrerScelle(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await enregistrerScelle(
      affaireId,
      formData.get("numero_scelle")!.toString(),
      formData.get("description")!.toString(),
      formData.get("lieu_saisie")?.toString() || undefined,
    );
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}

export async function actionEnregistrerMouvementScelle(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await enregistrerMouvementScelle(
      Number(formData.get("scelle_id")),
      formData.get("type")!.toString(),
      formData.get("motif")?.toString() || undefined,
    );
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}
