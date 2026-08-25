import type { Affaire } from "./affaire";

/**
 * Reflète App\Http\Resources\DossierAudiencementResource et les resources
 * associées (§6.7-6.8).
 */
export type DecisionType = "condamnation" | "relaxe" | "acquittement" | "dispense_de_peine";
export type TypeRecours = "appel" | "opposition" | "pourvoi_cassation";
export type IssueRecours = "confirmation" | "infirmation" | "cassation_avec_renvoi";

export interface RenvoiAudience {
  id: number;
  ancienne_date_audience: string | null;
  nouvelle_date_audience: string;
  motif: string;
}

export interface Recours {
  id: number;
  decision_id: number;
  type: TypeRecours;
  formee_par_personne_id: number | null;
  formee_at: string;
  recevable: boolean;
  effet_suspensif: boolean;
  decision_recours: IssueRecours | null;
  decision_recours_at: string | null;
}

export interface Decision {
  id: number;
  personne_id: number;
  decision: DecisionType;
  peine_principale: string | null;
  sursis: boolean;
  interets_civils: string | null;
  rendue_at: string;
  delai_recours_expire_at: string;
  est_definitive: boolean;
  recours?: Recours[];
  /** Présent (sinon absent) dès qu'un dossier d'exécution (§6.9) existe pour cette décision. */
  dossier_execution_id?: number | null;
}

export interface DossierAudiencement {
  id: number;
  affaire: Affaire;
  juridiction_id: number | null;
  chambre: string | null;
  date_audience: string | null;
  president_id: number | null;
  greffier_id: number | null;
  statut: "a_enroler" | "enrole" | "jugee";
  renvois?: RenvoiAudience[];
  decisions?: Decision[];
}

export interface DossierAudiencementListePage {
  data: DossierAudiencement[];
  meta: { current_page: number; last_page: number; total: number };
}
