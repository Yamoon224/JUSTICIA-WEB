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

export interface MotifClassementReferentiel {
  id: number;
  code: string;
  libelle: string;
}

export async function listerMotifsClassement(): Promise<MotifClassementReferentiel[]> {
  return backendFetch<MotifClassementReferentiel[]>("/referentiels/motifs-classement");
}

export interface MagistratReferentiel {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
}

export async function listerMagistrats(): Promise<MagistratReferentiel[]> {
  return backendFetch<MagistratReferentiel[]>("/referentiels/magistrats");
}

/** Réutilise MagistratReferentiel : même forme (id, matricule, nom, prénom). */
export async function listerJugesInstruction(): Promise<MagistratReferentiel[]> {
  return backendFetch<MagistratReferentiel[]>("/referentiels/juges-instruction");
}

export async function listerJugesAudience(): Promise<MagistratReferentiel[]> {
  return backendFetch<MagistratReferentiel[]>("/referentiels/juges-audience");
}

export async function listerGreffiers(): Promise<MagistratReferentiel[]> {
  return backendFetch<MagistratReferentiel[]>("/referentiels/greffiers");
}

export interface JuridictionReferentiel {
  id: number;
  code: string;
  nom: string;
  type: string | null;
  ressort_id: number;
}

export async function listerJuridictions(): Promise<JuridictionReferentiel[]> {
  return backendFetch<JuridictionReferentiel[]>("/referentiels/juridictions");
}
