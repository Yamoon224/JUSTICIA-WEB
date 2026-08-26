/**
 * Reflète App\Http\Resources\CondamnationResource et les resources
 * associées (§6.10).
 */
export type StatutCondamnation = "active" | "rehabilitee" | "amnistiee";
export type CategorieInfraction = "contravention" | "delit" | "crime";
export type TypeBulletin = "b1" | "b2" | "b3";

export interface Rehabilitation {
  id: number;
  type: "plein_droit" | "judiciaire";
  decidee_at: string;
}

export interface Amnistie {
  id: number;
  texte_reference: string;
  decidee_at: string;
}

export interface Condamnation {
  id: number;
  personne_id: number;
  numero_affaire: string;
  juridiction_nom: string;
  infraction_libelle: string;
  categorie_infraction: CategorieInfraction;
  peine_principale: string | null;
  sursis: boolean;
  condamnee_at: string;
  statut: StatutCondamnation;
  inscrite_at: string;
  rehabilitation?: Rehabilitation;
  amnistie?: Amnistie;
}

export interface ConsultationCasier {
  id: number;
  type_bulletin: TypeBulletin;
  motif: string;
  consultee_at: string;
  consultee_par?: { id: number; nom_complet: string };
}

export interface Bulletin {
  personne_id: number;
  type: TypeBulletin;
  genere_at: string;
  condamnations: Condamnation[];
}
