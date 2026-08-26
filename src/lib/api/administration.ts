import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { Agent } from "@/types/agent";
import type { AgentListePage } from "@/types/administration";

/**
 * Gestion des comptes et des habilitations (§6.13). Réservé aux agents
 * disposant de `administration.gerer`/`habilitations.gerer` côté API — ce
 * module ne reproduit aucune de ces règles ici (§10.2 : le frontend
 * affiche, le backend décide).
 */
export async function listerAgents(enAttenteSeulement = false): Promise<AgentListePage> {
  const query = enAttenteSeulement ? "?en_attente=1" : "";

  return backendFetch<AgentListePage>(`/administration/agents${query}`);
}

export interface CreerCompteArgs {
  matricule: string;
  nom: string;
  prenom: string;
  email?: string;
  password: string;
  service_id?: number;
  ressort_id?: number;
}

export async function creerCompte(donnees: CreerCompteArgs): Promise<Agent> {
  return backendFetch<Agent>("/administration/agents", { method: "POST", body: JSON.stringify(donnees) });
}

export async function validerCompte(agentId: number): Promise<Agent> {
  return backendFetch<Agent>(`/administration/agents/${agentId}/valider`, { method: "POST" });
}

export async function suspendreCompte(agentId: number, motif?: string): Promise<Agent> {
  return backendFetch<Agent>(`/administration/agents/${agentId}/suspendre`, {
    method: "POST",
    body: JSON.stringify({ motif }),
  });
}

export async function reactiverCompte(agentId: number): Promise<Agent> {
  return backendFetch<Agent>(`/administration/agents/${agentId}/reactiver`, { method: "POST" });
}

export async function listerRolesDisponibles(): Promise<string[]> {
  return backendFetch<string[]>("/administration/roles");
}

export async function assignerRoles(agentId: number, roles: string[]): Promise<Agent> {
  return backendFetch<Agent>(`/administration/agents/${agentId}/roles`, {
    method: "POST",
    body: JSON.stringify({ roles }),
  });
}

export interface CreerInfractionArgs {
  code: string;
  libelle: string;
  categorie: "contravention" | "delit" | "crime";
  texte_reference?: string;
  date_entree_vigueur: string;
  date_fin_vigueur?: string;
}

export async function creerInfraction(donnees: CreerInfractionArgs): Promise<unknown> {
  return backendFetch("/administration/infractions", { method: "POST", body: JSON.stringify(donnees) });
}
