import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { Affaire, AffaireListePage } from "@/types/affaire";
import type { ProcesVerbal } from "@/types/proces-verbal";
import type { Scelle } from "@/types/scelle";

export async function listerAffaires(page = 1): Promise<AffaireListePage> {
  return backendFetch<AffaireListePage>(`/affaires?page=${page}`);
}

export async function obtenirAffaire(id: number): Promise<Affaire> {
  return backendFetch<Affaire>(`/affaires/${id}`);
}

export interface OuvrirAffairePayload {
  description?: string;
  date_ouverture?: string;
  unite_id?: number;
  infractions?: number[];
}

export async function ouvrirAffaire(payload: OuvrirAffairePayload): Promise<Affaire> {
  return backendFetch<Affaire>("/affaires", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function rattacherPersonne(affaireId: number, personneId: number, statut: string): Promise<Affaire> {
  return backendFetch<Affaire>(`/affaires/${affaireId}/personnes`, {
    method: "POST",
    body: JSON.stringify({ personne_id: personneId, statut }),
  });
}

export async function transmettreAuParquet(affaireId: number): Promise<Affaire> {
  return backendFetch<Affaire>(`/affaires/${affaireId}/transmettre-parquet`, { method: "POST" });
}

export async function redigerProcesVerbal(affaireId: number, type: string, contenu: string): Promise<ProcesVerbal> {
  return backendFetch<ProcesVerbal>(`/affaires/${affaireId}/proces-verbaux`, {
    method: "POST",
    body: JSON.stringify({ type, contenu }),
  });
}

export async function signerProcesVerbal(pvId: number): Promise<ProcesVerbal> {
  return backendFetch<ProcesVerbal>(`/proces-verbaux/${pvId}/signer`, { method: "POST" });
}

export async function rectifierProcesVerbal(pvId: number, contenu: string): Promise<ProcesVerbal> {
  return backendFetch<ProcesVerbal>(`/proces-verbaux/${pvId}/rectifier`, {
    method: "POST",
    body: JSON.stringify({ contenu }),
  });
}

export async function enregistrerScelle(
  affaireId: number,
  numeroScelle: string,
  description: string,
  lieuSaisie?: string,
): Promise<Scelle> {
  return backendFetch<Scelle>(`/affaires/${affaireId}/scelles`, {
    method: "POST",
    body: JSON.stringify({ numero_scelle: numeroScelle, description, lieu_saisie: lieuSaisie }),
  });
}

export async function enregistrerMouvementScelle(scelleId: number, type: string, motif?: string): Promise<Scelle> {
  return backendFetch<Scelle>(`/scelles/${scelleId}/mouvements`, {
    method: "POST",
    body: JSON.stringify({ type, motif }),
  });
}
