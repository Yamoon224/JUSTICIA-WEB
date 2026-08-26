"use server";

import { redirect } from "next/navigation";

import {
  assignerRoles,
  creerCompte,
  creerInfraction,
  reactiverCompte,
  suspendreCompte,
  validerCompte,
} from "@/lib/api/administration";
import { redirectAvecErreur } from "@/lib/forms/action-error";

function cheminRetour(formData: FormData): string {
  return formData.get("en_attente") === "1" ? "/administration?en_attente=1" : "/administration";
}

export async function actionCreerCompte(formData: FormData): Promise<void> {
  const retour = cheminRetour(formData);
  const serviceId = formData.get("service_id");
  const ressortId = formData.get("ressort_id");

  try {
    await creerCompte({
      matricule: formData.get("matricule")!.toString(),
      nom: formData.get("nom")!.toString(),
      prenom: formData.get("prenom")!.toString(),
      email: formData.get("email")?.toString() || undefined,
      password: formData.get("password")!.toString(),
      service_id: serviceId ? Number(serviceId) : undefined,
      ressort_id: ressortId ? Number(ressortId) : undefined,
    });
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}

export async function actionValiderCompte(formData: FormData): Promise<void> {
  const retour = cheminRetour(formData);

  try {
    await validerCompte(Number(formData.get("agent_id")));
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}

export async function actionSuspendreCompte(formData: FormData): Promise<void> {
  const retour = cheminRetour(formData);

  try {
    await suspendreCompte(Number(formData.get("agent_id")), formData.get("motif")?.toString() || undefined);
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}

export async function actionReactiverCompte(formData: FormData): Promise<void> {
  const retour = cheminRetour(formData);

  try {
    await reactiverCompte(Number(formData.get("agent_id")));
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}

export async function actionAssignerRoles(formData: FormData): Promise<void> {
  const retour = cheminRetour(formData);

  try {
    await assignerRoles(Number(formData.get("agent_id")), formData.getAll("roles").map(String));
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}

export async function actionCreerInfraction(formData: FormData): Promise<void> {
  const retour = cheminRetour(formData);

  try {
    await creerInfraction({
      code: formData.get("code")!.toString(),
      libelle: formData.get("libelle")!.toString(),
      categorie: formData.get("categorie")!.toString() as "contravention" | "delit" | "crime",
      texte_reference: formData.get("texte_reference")?.toString() || undefined,
      date_entree_vigueur: formData.get("date_entree_vigueur")!.toString(),
    });
  } catch (error) {
    redirectAvecErreur(retour, error);
  }

  redirect(retour);
}
