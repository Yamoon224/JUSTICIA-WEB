import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { Personne, PersonneListePage } from "@/types/personne";

export interface RechercherPersonnesParams {
  nom?: string;
  prenom?: string;
  date_naissance?: string;
}

export async function rechercherPersonnes(params: RechercherPersonnesParams = {}): Promise<PersonneListePage> {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => Boolean(value)) as [string, string][],
  ).toString();

  return backendFetch<PersonneListePage>(`/personnes${query ? `?${query}` : ""}`);
}

export interface CreerPersonnePayload {
  type: "physique" | "morale";
  nom?: string;
  prenom?: string;
  date_naissance?: string;
  lieu_naissance?: string;
  sexe?: "M" | "F";
  raison_sociale?: string;
  adresse?: string;
  signalement?: string;
}

export async function creerPersonne(payload: CreerPersonnePayload): Promise<Personne> {
  return backendFetch<Personne>("/personnes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * §6.2 : toute consultation d'une fiche personne est journalisée avec
 * motif — le paramètre n'est donc jamais optionnel ici.
 */
export async function obtenirPersonne(id: number, motif: string): Promise<Personne> {
  return backendFetch<Personne>(`/personnes/${id}?motif=${encodeURIComponent(motif)}`);
}

export async function fusionnerPersonnes(id: number, personneAbsorbeeId: number): Promise<Personne> {
  return backendFetch<Personne>(`/personnes/${id}/fusionner`, {
    method: "POST",
    body: JSON.stringify({ personne_absorbee_id: personneAbsorbeeId }),
  });
}
