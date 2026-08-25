import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { DossierParquet, DossierParquetListePage, OrientationParquet, Requisition } from "@/types/parquet";

export type FiltreDossiers = "non_affectes" | "mon_portefeuille" | undefined;

export async function listerDossiersParquet(filtre?: FiltreDossiers, page = 1): Promise<DossierParquetListePage> {
  const params = new URLSearchParams({ page: String(page) });
  if (filtre) params.set("filtre", filtre);

  return backendFetch<DossierParquetListePage>(`/parquet/dossiers?${params.toString()}`);
}

export async function obtenirDossierParquet(id: number): Promise<DossierParquet> {
  return backendFetch<DossierParquet>(`/parquet/dossiers/${id}`);
}

export async function affecterMagistrat(dossierId: number, magistratId: number): Promise<DossierParquet> {
  return backendFetch<DossierParquet>(`/parquet/dossiers/${dossierId}/affecter`, {
    method: "POST",
    body: JSON.stringify({ magistrat_id: magistratId }),
  });
}

export async function orienterDossier(
  dossierId: number,
  orientation: OrientationParquet,
  motifClassementId?: number,
): Promise<DossierParquet> {
  return backendFetch<DossierParquet>(`/parquet/dossiers/${dossierId}/orienter`, {
    method: "POST",
    body: JSON.stringify({ orientation, motif_classement_id: motifClassementId }),
  });
}

export async function enregistrerRequisition(dossierId: number, type: string, contenu: string): Promise<Requisition> {
  return backendFetch<Requisition>(`/parquet/dossiers/${dossierId}/requisitions`, {
    method: "POST",
    body: JSON.stringify({ type, contenu }),
  });
}
