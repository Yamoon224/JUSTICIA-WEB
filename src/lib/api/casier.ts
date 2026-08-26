import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { Bulletin, Condamnation, ConsultationCasier, TypeBulletin } from "@/types/casier";

/**
 * Vue de gestion (§6.10) : liste toutes les condamnations d'une personne
 * pour repérer celle à réhabiliter ou amnistier. Ce n'est pas une
 * consultation nominative au sens du bulletin — gouvernée par
 * `casier.gerer`, pas `casier.consulter_nominatif`.
 */
export async function listerCondamnations(personneId: number): Promise<Condamnation[]> {
  return backendFetch<Condamnation[]>(`/casier/personnes/${personneId}/condamnations`);
}

/**
 * Génère un bulletin — une consultation nominative journalisée à chaque
 * appel (§6.10), même idiome que la consultation d'une fiche personne
 * (§6.2) : un GET motivé, jamais un POST muet.
 */
export async function genererBulletin(personneId: number, type: TypeBulletin, motif: string): Promise<Bulletin> {
  const params = new URLSearchParams({ type, motif });

  return backendFetch<Bulletin>(`/casier/personnes/${personneId}/bulletin?${params.toString()}`);
}

export async function listerConsultations(personneId: number): Promise<ConsultationCasier[]> {
  return backendFetch<ConsultationCasier[]>(`/casier/personnes/${personneId}/consultations`);
}

export async function rehabiliter(condamnationId: number): Promise<Condamnation> {
  return backendFetch<Condamnation>(`/casier/condamnations/${condamnationId}/rehabiliter`, { method: "POST" });
}

export async function amnistier(condamnationId: number, texteReference: string): Promise<Condamnation> {
  return backendFetch<Condamnation>(`/casier/condamnations/${condamnationId}/amnistier`, {
    method: "POST",
    body: JSON.stringify({ texte_reference: texteReference }),
  });
}
