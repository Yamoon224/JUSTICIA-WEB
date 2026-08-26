import type { PieceVersee } from "./document";

/**
 * Reflète App\Http\Resources\ScelleResource (§6.4).
 */
export interface ScelleMouvement {
  type: string;
  motif: string | null;
  horodatage: string;
}

export interface Scelle {
  id: number;
  numero_scelle: string;
  description: string;
  lieu_saisie: string | null;
  statut: "en_depot" | "sorti_expertise" | "restitue" | "confisque" | "detruit";
  mouvements?: ScelleMouvement[];
  documents?: PieceVersee[];
}
