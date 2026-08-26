import type { PieceVersee } from "./document";

/**
 * Reflète App\Http\Resources\PersonneResource côté API Laravel (§6.2).
 */
export interface Personne {
  id: number;
  identifiant_unique: string;
  type: "physique" | "morale";
  nom: string | null;
  prenom: string | null;
  nom_affichage: string;
  alias: string[] | null;
  date_naissance: string | null;
  lieu_naissance: string | null;
  sexe: "M" | "F" | null;
  raison_sociale: string | null;
  adresse: string | null;
  pieces_identite?: { type: string; numero: string }[];
  documents?: PieceVersee[];
}

export interface PersonneListePage {
  data: Personne[];
  meta: { current_page: number; last_page: number; total: number };
}
