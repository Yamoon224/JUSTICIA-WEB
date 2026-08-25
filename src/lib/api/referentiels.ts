import "server-only";

import { backendFetch } from "@/lib/api/backend";

export interface InfractionReferentiel {
  id: number;
  code: string;
  libelle: string;
  categorie: "contravention" | "delit" | "crime";
}

export interface UniteReferentiel {
  id: number;
  code: string;
  nom: string;
  type: "police" | "gendarmerie";
  ressort_id: number;
}

export async function listerInfractions(): Promise<InfractionReferentiel[]> {
  return backendFetch<InfractionReferentiel[]>("/referentiels/infractions");
}

export async function listerUnites(): Promise<UniteReferentiel[]> {
  return backendFetch<UniteReferentiel[]>("/referentiels/unites");
}
