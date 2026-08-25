import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type {
  ActeInstruction,
  DossierInstruction,
  DossierInstructionListePage,
  Mandat,
  MesureSurete,
  Ordonnance,
  TypeActeInstruction,
  TypeMandat,
} from "@/types/instruction";

export type FiltreDossiersInstruction = "non_affectes" | "mon_portefeuille" | undefined;

export async function listerDossiersInstruction(filtre?: FiltreDossiersInstruction, page = 1): Promise<DossierInstructionListePage> {
  const params = new URLSearchParams({ page: String(page) });
  if (filtre) params.set("filtre", filtre);

  return backendFetch<DossierInstructionListePage>(`/instruction/dossiers?${params.toString()}`);
}

export async function obtenirDossierInstruction(id: number): Promise<DossierInstruction> {
  return backendFetch<DossierInstruction>(`/instruction/dossiers/${id}`);
}

export async function affecterJugeInstruction(dossierId: number, jugeId: number): Promise<DossierInstruction> {
  return backendFetch<DossierInstruction>(`/instruction/dossiers/${dossierId}/affecter`, {
    method: "POST",
    body: JSON.stringify({ juge_id: jugeId }),
  });
}

export async function mettreEnExamen(dossierId: number, personneId: number, statut: "mis_en_examen" | "temoin_assiste"): Promise<DossierInstruction> {
  return backendFetch<DossierInstruction>(`/instruction/dossiers/${dossierId}/mise-en-examen`, {
    method: "POST",
    body: JSON.stringify({ personne_id: personneId, statut }),
  });
}

export async function enregistrerActeInstruction(
  dossierId: number,
  type: TypeActeInstruction,
  description?: string,
  datePrevue?: string,
): Promise<ActeInstruction> {
  return backendFetch<ActeInstruction>(`/instruction/dossiers/${dossierId}/actes`, {
    method: "POST",
    body: JSON.stringify({ type, description, date_prevue: datePrevue }),
  });
}

export async function mettreAJourActeInstruction(acteId: number, statut: string): Promise<ActeInstruction> {
  return backendFetch<ActeInstruction>(`/instruction/actes/${acteId}/statut`, {
    method: "POST",
    body: JSON.stringify({ statut }),
  });
}

export async function emettreMandat(dossierId: number, personneId: number, type: TypeMandat): Promise<Mandat> {
  return backendFetch<Mandat>(`/instruction/dossiers/${dossierId}/mandats`, {
    method: "POST",
    body: JSON.stringify({ personne_id: personneId, type }),
  });
}

export async function mettreAJourMandat(mandatId: number, etape: "diffuse" | "execute"): Promise<Mandat> {
  return backendFetch<Mandat>(`/instruction/mandats/${mandatId}/etape`, {
    method: "POST",
    body: JSON.stringify({ etape }),
  });
}

export async function placerSousControleJudiciaire(dossierId: number, personneId: number, obligations: string): Promise<MesureSurete> {
  return backendFetch<MesureSurete>(`/instruction/dossiers/${dossierId}/controle-judiciaire`, {
    method: "POST",
    body: JSON.stringify({ personne_id: personneId, obligations }),
  });
}

export async function placerEnDetentionProvisoire(dossierId: number, personneId: number): Promise<MesureSurete> {
  return backendFetch<MesureSurete>(`/instruction/dossiers/${dossierId}/detention-provisoire`, {
    method: "POST",
    body: JSON.stringify({ personne_id: personneId }),
  });
}

export async function renouvelerDetentionProvisoire(mesureId: number, jours: number): Promise<MesureSurete> {
  return backendFetch<MesureSurete>(`/instruction/mesures-surete/${mesureId}/renouveler`, {
    method: "POST",
    body: JSON.stringify({ jours }),
  });
}

export async function leverMesureSurete(mesureId: number, motif: "mise_en_liberte" | "echeance"): Promise<MesureSurete> {
  return backendFetch<MesureSurete>(`/instruction/mesures-surete/${mesureId}/lever`, {
    method: "POST",
    body: JSON.stringify({ motif }),
  });
}

export async function rendreOrdonnance(dossierId: number, ordonnance: Ordonnance): Promise<DossierInstruction> {
  return backendFetch<DossierInstruction>(`/instruction/dossiers/${dossierId}/ordonnance`, {
    method: "POST",
    body: JSON.stringify({ ordonnance }),
  });
}
