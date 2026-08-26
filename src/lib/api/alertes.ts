import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { Alerte, AlerteListePage } from "@/types/alerte";

/**
 * §6.1, §6.11 : agenda personnel de l'agent — jamais celles d'un autre
 * (contrôlé côté API, cf. AlerteController).
 */
export async function listerAlertes(nonLuesSeulement = false): Promise<AlerteListePage> {
  const query = nonLuesSeulement ? "?non_lues=1" : "";

  return backendFetch<AlerteListePage>(`/alertes${query}`);
}

export async function marquerAlerteLue(id: number): Promise<Alerte> {
  return backendFetch<Alerte>(`/alertes/${id}/lire`, { method: "POST" });
}
