import type { PieceVersee } from "./document";
import type { ProcesVerbal } from "./proces-verbal";
import type { Scelle } from "./scelle";

/**
 * Reflète App\Http\Resources\AffaireResource (§6.3).
 */
export type StatutAffaire =
  | "ouverte"
  | "transmise_parquet"
  | "classee_sans_suite"
  | "information_ouverte"
  | "audiencee"
  | "jugee"
  | "cloturee";

export interface AffaireInfraction {
  id: number;
  code: string;
  libelle: string;
  categorie: "contravention" | "delit" | "crime";
}

export interface AffairePersonne {
  id: number;
  identifiant_unique: string;
  nom_affichage: string;
  statut: string;
}

export interface Affaire {
  id: number;
  numero_affaire: string;
  statut: StatutAffaire;
  description: string | null;
  date_ouverture: string | null;
  ressort_id: number;
  unite_id: number | null;
  infractions?: AffaireInfraction[];
  personnes?: AffairePersonne[];
  proces_verbaux?: ProcesVerbal[];
  scelles?: Scelle[];
  documents?: PieceVersee[];
}

export interface AffaireListePage {
  data: Affaire[];
  meta: { current_page: number; last_page: number; total: number };
}
