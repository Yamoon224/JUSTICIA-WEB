import type { Affaire } from "./affaire";

/**
 * Reflète App\Http\Resources\DossierParquetResource / RequisitionResource
 * (§6.5).
 */
export type OrientationParquet =
  | "classement_sans_suite"
  | "rappel_a_la_loi"
  | "mediation_penale"
  | "composition_penale"
  | "citation_directe"
  | "ouverture_information"
  | "comparution_immediate";

export interface Requisition {
  id: number;
  type: string;
  contenu: string;
  magistrat_id: number;
  created_at: string | null;
}

export interface DossierParquet {
  id: number;
  affaire: Affaire;
  magistrat_id: number | null;
  recu_at: string | null;
  affecte_at: string | null;
  orientation: OrientationParquet | null;
  motif_classement_id: number | null;
  oriente_at: string | null;
  oriente_par: number | null;
  requisitions?: Requisition[];
}

export interface DossierParquetListePage {
  data: DossierParquet[];
  meta: { current_page: number; last_page: number; total: number };
}
