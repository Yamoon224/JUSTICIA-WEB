/**
 * Reflète App\Http\Resources\AgentResource côté API Laravel.
 * Un agent est un utilisateur habilité JUSTICIA (§4 du cahier des charges) :
 * OPJ, magistrat, greffier, agent pénitentiaire, agent du casier...
 */
export interface Agent {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  nom_complet: string;
  email: string | null;
  actif: boolean;
  suspendu_at?: string | null;
  valide?: boolean;
  valide_at?: string | null;
  cree_par?: number | null;
  roles: string[];
  permissions: string[];
  service?: {
    id: number;
    code: string;
    nom: string;
    type: string;
  };
  ressort?: {
    id: number;
    code: string;
    nom: string;
    type: string;
  };
}
