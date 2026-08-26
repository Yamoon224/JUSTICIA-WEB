"use server";

import { redirect } from "next/navigation";

import { amnistier, rehabiliter } from "@/lib/api/casier";
import { redirectAvecErreur } from "@/lib/forms/action-error";

/**
 * `nom` n'est qu'un affichage décoratif (jamais lu par l'API) porté d'écran
 * en écran par la query string — sans lui, la page retombe sur
 * « Personne #id » après chaque action, ce qui reste correct mais moins
 * lisible.
 */
function cheminRetour(personneId: number, nom: FormDataEntryValue | null): string {
  return nom ? `/casier/personnes/${personneId}?nom=${encodeURIComponent(nom.toString())}` : `/casier/personnes/${personneId}`;
}

export async function actionRehabiliter(formData: FormData): Promise<void> {
  const personneId = Number(formData.get("personne_id"));
  const retour = cheminRetour(personneId, formData.get("nom"));

  try {
    await rehabiliter(Number(formData.get("condamnation_id")));
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}

export async function actionAmnistier(formData: FormData): Promise<void> {
  const personneId = Number(formData.get("personne_id"));
  const retour = cheminRetour(personneId, formData.get("nom"));

  try {
    await amnistier(Number(formData.get("condamnation_id")), formData.get("texte_reference")!.toString());
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}
