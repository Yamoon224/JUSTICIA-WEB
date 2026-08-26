import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { TableauDeBord } from "@/types/statistiques";

export async function obtenirTableauDeBord(ressortId?: number): Promise<TableauDeBord> {
  const query = ressortId ? `?ressort_id=${ressortId}` : "";

  return backendFetch<TableauDeBord>(`/statistiques/tableau-de-bord${query}`);
}
