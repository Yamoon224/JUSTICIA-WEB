"use server";

import { redirect } from "next/navigation";

import { creerPersonne, fusionnerPersonnes } from "@/lib/api/personnes";
import { redirectAvecErreur } from "@/lib/forms/action-error";

export async function actionCreerPersonne(formData: FormData): Promise<void> {
  const type = formData.get("type") === "morale" ? "morale" : "physique";

  let personne;
  try {
    personne = await creerPersonne({
      type,
      nom: formData.get("nom")?.toString() || undefined,
      prenom: formData.get("prenom")?.toString() || undefined,
      date_naissance: formData.get("date_naissance")?.toString() || undefined,
      lieu_naissance: formData.get("lieu_naissance")?.toString() || undefined,
      raison_sociale: formData.get("raison_sociale")?.toString() || undefined,
      adresse: formData.get("adresse")?.toString() || undefined,
    });
  } catch (error) {
    redirectAvecErreur("/personnes/nouvelle", error);
  }

  redirect(`/personnes/${personne.id}?motif=${encodeURIComponent("Création de la fiche")}`);
}

export async function actionFusionnerPersonnes(formData: FormData): Promise<void> {
  const id = Number(formData.get("personne_id"));
  const absorbeeId = Number(formData.get("personne_absorbee_id"));
  const motif = formData.get("motif")?.toString() || "Fusion de doublons";

  try {
    await fusionnerPersonnes(id, absorbeeId);
  } catch (error) {
    redirectAvecErreur(`/personnes/${id}`, error);
  }

  redirect(`/personnes/${id}?motif=${encodeURIComponent(motif)}`);
}
