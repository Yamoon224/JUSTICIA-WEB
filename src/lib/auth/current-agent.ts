import "server-only";

import { backendFetch, BackendApiError } from "@/lib/api/backend";
import { getSessionToken } from "@/lib/auth/session";
import type { Agent } from "@/types/agent";

/**
 * Résout l'agent actuellement connecté à partir du cookie de session, en le
 * revérifiant auprès de l'API à chaque appel (§8 : pas de confiance dans un
 * état client). Retourne `null` en l'absence de session valide.
 */
export async function getCurrentAgent(): Promise<Agent | null> {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }

  try {
    return await backendFetch<Agent>("/auth/me");
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}
