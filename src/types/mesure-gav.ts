/**
 * Reflète App\Http\Resources\MesureGardeAVueResource (§6.1).
 */
export type DroitGav = "silence" | "avocat" | "medecin" | "information_proche";
export type IssueGav = "liberation" | "convocation" | "deferement";

export interface NotificationDroit {
  droit: DroitGav;
  notifie_at: string | null;
}

export interface ActeGav {
  type: "audition" | "examen_medical" | "entretien_avocat" | "confrontation" | "repos";
  debut_at: string;
  fin_at: string | null;
}

export interface MesureGardeAVue {
  id: number;
  affaire_id: number;
  personne_id: number;
  unite_id: number;
  debut_at: string;
  duree_heures: number;
  fin_prevue_at: string;
  statut: "en_cours" | "prolongee" | "terminee";
  issue: IssueGav | null;
  fin_reelle_at: string | null;
  mineur: boolean;
  avis_representant_legal_at: string | null;
  echeance_depassee: boolean;
  notifications_droits?: NotificationDroit[];
  actes?: ActeGav[];
}
