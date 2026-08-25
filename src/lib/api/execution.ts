import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type {
  Amende,
  AmenagementPeine,
  DecisionAExecuterListePage,
  DossierExecution,
  DossierExecutionListePage,
  Ecrou,
  MiseALEpreuve,
  MotifLiberation,
  MotifRemisePeine,
  TravailInteretGeneral,
  TypeAmenagementPeine,
} from "@/types/execution";

export type FiltreDossiersExecution = "en_cours" | undefined;

export async function listerDossiersExecution(filtre?: FiltreDossiersExecution, page = 1): Promise<DossierExecutionListePage> {
  const params = new URLSearchParams({ page: String(page) });
  if (filtre) params.set("filtre", filtre);

  return backendFetch<DossierExecutionListePage>(`/execution/dossiers?${params.toString()}`);
}

export async function listerDecisionsAExecuter(page = 1): Promise<DecisionAExecuterListePage> {
  return backendFetch<DecisionAExecuterListePage>(`/execution/decisions-a-executer?page=${page}`);
}

export async function obtenirDossierExecution(id: number): Promise<DossierExecution> {
  return backendFetch<DossierExecution>(`/execution/dossiers/${id}`);
}

export async function mettreAExecution(decisionId: number): Promise<DossierExecution> {
  return backendFetch<DossierExecution>(`/execution/decisions/${decisionId}/mettre-a-execution`, { method: "POST" });
}

export interface EcrouerPayload {
  etablissement_id: number;
  duree_jours: number;
  detention_provisoire_imputee_jours?: number;
}

export async function ecrouer(dossierId: number, payload: EcrouerPayload): Promise<Ecrou> {
  return backendFetch<Ecrou>(`/execution/dossiers/${dossierId}/ecrouer`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function transmettreAmende(dossierId: number, montant: number): Promise<Amende> {
  return backendFetch<Amende>(`/execution/dossiers/${dossierId}/amende`, {
    method: "POST",
    body: JSON.stringify({ montant }),
  });
}

export async function affecterTig(dossierId: number, heuresRequises: number, affecteA?: string): Promise<TravailInteretGeneral> {
  return backendFetch<TravailInteretGeneral>(`/execution/dossiers/${dossierId}/tig`, {
    method: "POST",
    body: JSON.stringify({ heures_requises: heuresRequises, affecte_a: affecteA }),
  });
}

export async function placerSousMiseALEpreuve(dossierId: number, obligations: string): Promise<MiseALEpreuve> {
  return backendFetch<MiseALEpreuve>(`/execution/dossiers/${dossierId}/mise-a-l-epreuve`, {
    method: "POST",
    body: JSON.stringify({ obligations }),
  });
}

export async function enregistrerRemiseDePeine(ecrouId: number, jours: number, motif: MotifRemisePeine): Promise<Ecrou> {
  return backendFetch<Ecrou>(`/execution/ecrous/${ecrouId}/remise-de-peine`, {
    method: "POST",
    body: JSON.stringify({ jours, motif }),
  });
}

export async function liberer(ecrouId: number, motif: MotifLiberation): Promise<Ecrou> {
  return backendFetch<Ecrou>(`/execution/ecrous/${ecrouId}/liberer`, {
    method: "POST",
    body: JSON.stringify({ motif }),
  });
}

export async function transferer(ecrouId: number, etablissementDestinationId: number, motif?: string): Promise<Ecrou> {
  return backendFetch<Ecrou>(`/execution/ecrous/${ecrouId}/transferer`, {
    method: "POST",
    body: JSON.stringify({ etablissement_destination_id: etablissementDestinationId, motif }),
  });
}

export async function decideAmenagement(ecrouId: number, type: TypeAmenagementPeine): Promise<AmenagementPeine> {
  return backendFetch<AmenagementPeine>(`/execution/ecrous/${ecrouId}/amenagement`, {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

export async function marquerAmendeRecouvree(amendeId: number): Promise<Amende> {
  return backendFetch<Amende>(`/execution/amendes/${amendeId}/recouvree`, { method: "POST" });
}

export async function enregistrerHeuresTig(tigId: number, heures: number): Promise<TravailInteretGeneral> {
  return backendFetch<TravailInteretGeneral>(`/execution/tig/${tigId}/heures`, {
    method: "POST",
    body: JSON.stringify({ heures }),
  });
}

export async function leverMiseALEpreuve(miseId: number): Promise<MiseALEpreuve> {
  return backendFetch<MiseALEpreuve>(`/execution/mises-a-l-epreuve/${miseId}/lever`, { method: "POST" });
}
