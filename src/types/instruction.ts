import type { Affaire } from "./affaire";

/**
 * Reflète App\Http\Resources\DossierInstructionResource et les resources
 * associées (§6.6).
 */
export type TypeActeInstruction = "interrogatoire" | "confrontation" | "transport" | "commission_rogatoire" | "expertise";
export type StatutActeInstruction = "en_attente" | "realise" | "retour_recu" | "rapport_depose";
export type TypeMandat = "comparution" | "amener" | "depot" | "arret";
export type TypeMesureSurete = "controle_judiciaire" | "detention_provisoire";
export type Ordonnance = "renvoi" | "non_lieu";

export interface ActeInstruction {
  id: number;
  type: TypeActeInstruction;
  description: string | null;
  date_prevue: string | null;
  date_realisation: string | null;
  statut: StatutActeInstruction;
}

export interface Mandat {
  id: number;
  personne_id: number;
  type: TypeMandat;
  emis_at: string;
  diffuse_at: string | null;
  execute_at: string | null;
}

export interface MesureSurete {
  id: number;
  personne_id: number;
  type: TypeMesureSurete;
  debut_at: string;
  duree_jours: number | null;
  fin_prevue_at: string | null;
  renouvele_le: string | null;
  obligations: string | null;
  statut: "en_cours" | "terminee";
  fin_reelle_at: string | null;
  motif_fin: "mise_en_liberte" | "echeance" | null;
  echeance_depassee: boolean;
}

export interface DossierInstruction {
  id: number;
  affaire: Affaire;
  juge_instruction_id: number | null;
  ouvert_at: string;
  statut: "en_cours" | "cloture";
  ordonnance: Ordonnance | null;
  ordonnance_at: string | null;
  ordonnance_par: number | null;
  delai_recours_expire_at: string | null;
  actes?: ActeInstruction[];
  mandats?: Mandat[];
  mesures_surete?: MesureSurete[];
}

export interface DossierInstructionListePage {
  data: DossierInstruction[];
  meta: { current_page: number; last_page: number; total: number };
}
