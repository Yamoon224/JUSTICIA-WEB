import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { PieceVersee } from "@/types/document";

/**
 * Le fichier lui-même reste dans `formData` (champ "fichier"), déjà reçu
 * par la Server Action depuis le <form> — jamais reconstruit ni relu ici.
 */
export async function verserDocumentPersonne(personneId: number, formData: FormData): Promise<PieceVersee> {
  return backendFetch<PieceVersee>(`/personnes/${personneId}/documents`, { method: "POST", body: formData });
}

export async function verserDocumentAffaire(affaireId: number, formData: FormData): Promise<PieceVersee> {
  return backendFetch<PieceVersee>(`/affaires/${affaireId}/documents`, { method: "POST", body: formData });
}

export async function verserDocumentScelle(scelleId: number, formData: FormData): Promise<PieceVersee> {
  return backendFetch<PieceVersee>(`/scelles/${scelleId}/documents`, { method: "POST", body: formData });
}
