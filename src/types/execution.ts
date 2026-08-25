import type { Affaire } from "./affaire";

/**
 * Reflète App\Http\Resources\DossierExecutionResource et les resources
 * associées (§6.9).
 */
export type StatutDossierExecution = "en_cours" | "terminee";
export type StatutEcrou = "en_detention" | "libere";
export type MotifLiberation = "terme" | "amenagement" | "grace";
export type MotifRemisePeine = "grace" | "reduction_peine";
export type TypeAmenagementPeine = "liberation_conditionnelle" | "semi_liberte" | "placement_exterieur";
export type StatutAmende = "transmise_tresor" | "recouvree";
export type StatutTig = "en_cours" | "terminee";
export type StatutMiseALEpreuve = "en_cours" | "terminee";

export interface RemisePeine {
  id: number;
  jours: number;
  motif: MotifRemisePeine;
  decide_at: string;
}

export interface AmenagementPeine {
  id: number;
  type: TypeAmenagementPeine;
  decide_at: string;
}

export interface TransfertEcrou {
  id: number;
  etablissement_origine_id: number;
  etablissement_destination_id: number;
  motif: string | null;
  transfere_at: string;
}

export interface Ecrou {
  id: number;
  numero_ecrou: string;
  personne_id: number;
  etablissement_id: number;
  date_ecrou: string;
  duree_jours: number;
  detention_provisoire_imputee_jours: number;
  date_fin_prevue: string;
  statut: StatutEcrou;
  date_liberation: string | null;
  motif_liberation: MotifLiberation | null;
  echeance_depassee: boolean;
  remises_peine?: RemisePeine[];
  amenagements?: AmenagementPeine[];
  transferts?: TransfertEcrou[];
}

export interface Amende {
  id: number;
  montant: number;
  statut: StatutAmende;
  transmise_at: string;
}

export interface TravailInteretGeneral {
  id: number;
  heures_requises: number;
  heures_effectuees: number;
  affecte_a: string | null;
  statut: StatutTig;
}

export interface MiseALEpreuve {
  id: number;
  obligations: string;
  statut: StatutMiseALEpreuve;
}

export interface DossierExecution {
  id: number;
  decision_id: number;
  personne_id: number;
  affaire?: Affaire;
  statut: StatutDossierExecution;
  mise_a_execution_at: string;
  ecrou?: Ecrou | null;
  amende?: Amende | null;
  tig?: TravailInteretGeneral | null;
  mise_a_l_epreuve?: MiseALEpreuve | null;
}

export interface DossierExecutionListePage {
  data: DossierExecution[];
  meta: { current_page: number; last_page: number; total: number };
}

/**
 * Reflète App\Http\Resources\DecisionAExecuterResource : vue allégée d'une
 * décision définitive pas encore mise à exécution, destinée au service
 * pénitentiaire (sans accès au dossier d'audiencement lui-même).
 */
export interface DecisionAExecuter {
  id: number;
  peine_principale: string | null;
  rendue_at: string;
  delai_recours_expire_at: string;
  affaire: { id: number; numero_affaire: string };
  personne: { id: number; nom_affichage: string };
}

export interface DecisionAExecuterListePage {
  data: DecisionAExecuter[];
  meta: { current_page: number; last_page: number; total: number };
}
