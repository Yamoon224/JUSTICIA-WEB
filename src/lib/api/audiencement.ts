import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type {
  Decision,
  DecisionType,
  DossierAudiencement,
  DossierAudiencementListePage,
  IssueRecours,
  Recours,
  TypeRecours,
} from "@/types/audiencement";

export type FiltreDossiersAudiencement = "a_enroler" | "a_venir" | undefined;

export async function listerDossiersAudiencement(filtre?: FiltreDossiersAudiencement, page = 1): Promise<DossierAudiencementListePage> {
  const params = new URLSearchParams({ page: String(page) });
  if (filtre) params.set("filtre", filtre);

  return backendFetch<DossierAudiencementListePage>(`/audiencement/dossiers?${params.toString()}`);
}

export async function obtenirDossierAudiencement(id: number): Promise<DossierAudiencement> {
  return backendFetch<DossierAudiencement>(`/audiencement/dossiers/${id}`);
}

export interface EnrolerPayload {
  juridiction_id: number;
  chambre: string;
  date_audience: string;
  president_id: number;
  greffier_id: number;
}

export async function enroler(dossierId: number, payload: EnrolerPayload): Promise<DossierAudiencement> {
  return backendFetch<DossierAudiencement>(`/audiencement/dossiers/${dossierId}/enroler`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function renvoyer(dossierId: number, nouvelleDate: string, motif: string): Promise<DossierAudiencement> {
  return backendFetch<DossierAudiencement>(`/audiencement/dossiers/${dossierId}/renvoyer`, {
    method: "POST",
    body: JSON.stringify({ nouvelle_date: nouvelleDate, motif }),
  });
}

export interface EnregistrerDecisionPayload {
  personne_id: number;
  decision: DecisionType;
  peine_principale?: string;
  sursis?: boolean;
  interets_civils?: string;
}

export async function enregistrerDecision(dossierId: number, payload: EnregistrerDecisionPayload): Promise<Decision> {
  return backendFetch<Decision>(`/audiencement/dossiers/${dossierId}/decisions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function enregistrerRecours(decisionId: number, type: TypeRecours, formeeParPersonneId?: number): Promise<Recours> {
  return backendFetch<Recours>(`/audiencement/decisions/${decisionId}/recours`, {
    method: "POST",
    body: JSON.stringify({ type, formee_par_personne_id: formeeParPersonneId }),
  });
}

export async function integrerDecisionRecours(recoursId: number, issue: IssueRecours): Promise<Recours> {
  return backendFetch<Recours>(`/audiencement/recours/${recoursId}/decision`, {
    method: "POST",
    body: JSON.stringify({ issue }),
  });
}
