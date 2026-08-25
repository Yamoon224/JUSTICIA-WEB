import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { DroitGav, IssueGav, MesureGardeAVue } from "@/types/mesure-gav";

export interface PlacerEnGardeAVuePayload {
  affaire_id: number;
  personne_id: number;
  unite_id: number;
  debut_at?: string;
}

export async function placerEnGardeAVue(payload: PlacerEnGardeAVuePayload): Promise<MesureGardeAVue> {
  return backendFetch<MesureGardeAVue>("/gav/mesures", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function obtenirMesureGardeAVue(id: number): Promise<MesureGardeAVue> {
  return backendFetch<MesureGardeAVue>(`/gav/mesures/${id}`);
}

export async function prolongerGardeAVue(id: number, heures: number, autoriseParId: number): Promise<MesureGardeAVue> {
  return backendFetch<MesureGardeAVue>(`/gav/mesures/${id}/prolonger`, {
    method: "POST",
    body: JSON.stringify({ heures, autorise_par_id: autoriseParId }),
  });
}

export async function notifierDroitGardeAVue(id: number, droit: DroitGav, modeDeRemise: string): Promise<MesureGardeAVue> {
  return backendFetch<MesureGardeAVue>(`/gav/mesures/${id}/droits`, {
    method: "POST",
    body: JSON.stringify({ droit, mode_de_remise: modeDeRemise }),
  });
}

export async function aviserRepresentantLegal(id: number): Promise<MesureGardeAVue> {
  return backendFetch<MesureGardeAVue>(`/gav/mesures/${id}/avis-representant-legal`, { method: "POST" });
}

export async function enregistrerActeGardeAVue(
  id: number,
  type: string,
  debutAt: string,
  finAt?: string,
  notes?: string,
): Promise<MesureGardeAVue> {
  return backendFetch<MesureGardeAVue>(`/gav/mesures/${id}/actes`, {
    method: "POST",
    body: JSON.stringify({ type, debut_at: debutAt, fin_at: finAt, notes }),
  });
}

export async function cloturerGardeAVue(id: number, issue: IssueGav): Promise<MesureGardeAVue> {
  return backendFetch<MesureGardeAVue>(`/gav/mesures/${id}/cloturer`, {
    method: "POST",
    body: JSON.stringify({ issue }),
  });
}
