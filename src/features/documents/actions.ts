"use server";

import { redirect } from "next/navigation";

import { verserDocumentAffaire, verserDocumentPersonne, verserDocumentScelle } from "@/lib/api/documents";
import { redirectAvecErreur } from "@/lib/forms/action-error";

export async function actionVerserDocumentPersonne(formData: FormData): Promise<void> {
  const personneId = Number(formData.get("personne_id"));
  const motif = formData.get("motif")?.toString() || "";
  const retour = `/personnes/${personneId}${motif ? `?motif=${encodeURIComponent(motif)}` : ""}`;

  try {
    await verserDocumentPersonne(personneId, formData);
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}

export async function actionVerserDocumentAffaire(formData: FormData): Promise<void> {
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await verserDocumentAffaire(affaireId, formData);
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}

export async function actionVerserDocumentScelle(formData: FormData): Promise<void> {
  const scelleId = Number(formData.get("scelle_id"));
  const affaireId = Number(formData.get("affaire_id"));

  try {
    await verserDocumentScelle(scelleId, formData);
  } catch (error) {
    redirectAvecErreur(`/affaires/${affaireId}`, error);
  }

  redirect(`/affaires/${affaireId}`);
}
