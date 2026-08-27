import Link from "next/link";
import { Ban, Play, ShieldCheck, UserPlus } from "lucide-react";

import { Badge, Card, EmptyState, ErrorBanner, Field, PageHeader, Select, SubmitButton, TextInput } from "@/components/ui";
import {
  actionAssignerRoles,
  actionCreerCompte,
  actionCreerInfraction,
  actionReactiverCompte,
  actionSuspendreCompte,
  actionValiderCompte,
} from "@/features/administration/actions";
import { listerAgents, listerRolesDisponibles } from "@/lib/api/administration";
import { listerRessorts, listerServices } from "@/lib/api/referentiels";
import type { Agent } from "@/types/agent";

export const metadata = { title: "Administration — JUSTICIA" };

function statutAgent(agent: Agent): { label: string; tone: "gold" | "forest" | "rust" } {
  if (agent.suspendu_at) return { label: "suspendu", tone: "rust" };
  if (!agent.valide) return { label: "en attente de validation", tone: "gold" };
  return { label: "actif", tone: "forest" };
}

export default async function AdministrationPage({
  searchParams,
}: {
  searchParams: Promise<{ en_attente?: string; erreur?: string }>;
}) {
  const { en_attente, erreur } = await searchParams;
  const enAttenteSeulement = en_attente === "1";

  const [{ data: agents }, roles, services, ressorts] = await Promise.all([
    listerAgents(enAttenteSeulement),
    listerRolesDisponibles(),
    listerServices(),
    listerRessorts(),
  ]);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader
        eyebrow="Administration"
        title="Comptes et habilitations"
        description="Création de comptes à double validation, affectation des rôles, référentiel des infractions."
        actions={
          <div className="flex gap-1 rounded-lg border border-line-strong bg-paper-raised p-1 text-xs font-medium">
            <Link
              href="/administration"
              className={`rounded-md px-3 py-1.5 ${!enAttenteSeulement ? "bg-seal-tint text-seal-strong" : "text-ink-soft hover:text-ink"}`}
            >
              Tous
            </Link>
            <Link
              href="/administration?en_attente=1"
              className={`rounded-md px-3 py-1.5 ${enAttenteSeulement ? "bg-seal-tint text-seal-strong" : "text-ink-soft hover:text-ink"}`}
            >
              En attente
            </Link>
          </div>
        }
      />

      <ErrorBanner message={erreur} />

      <Card
        title="Comptes"
        description="La validation d'un compte doit être faite par un administrateur distinct de son créateur (double validation)."
      >
        {agents.length === 0 ? (
          <EmptyState message="Aucun compte." />
        ) : (
          <ul className="flex flex-col gap-3">
            {agents.map((agent) => {
              const statut = statutAgent(agent);

              return (
                <li key={agent.id} className="flex flex-col gap-3 rounded-xl border border-line bg-paper-sunken/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-ink">{agent.nom_complet}</span>
                      <span className="font-mono text-xs text-ink-faint">
                        {agent.matricule}
                        {agent.service && ` — ${agent.service.nom}`}
                        {agent.ressort && ` — ${agent.ressort.nom}`}
                      </span>
                    </div>
                    <Badge tone={statut.tone}>{statut.label}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {agent.roles.length === 0 ? (
                      <span className="text-xs text-ink-faint">Aucun rôle affecté.</span>
                    ) : (
                      agent.roles.map((role) => (
                        <Badge key={role} tone="neutral">
                          {role.replaceAll("_", " ")}
                        </Badge>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
                    {!agent.valide && (
                      <form action={actionValiderCompte}>
                        <input type="hidden" name="agent_id" value={agent.id} />
                        <input type="hidden" name="en_attente" value={enAttenteSeulement ? "1" : "0"} />
                        <SubmitButton variant="secondary">
                          <ShieldCheck size={14} />
                          Valider
                        </SubmitButton>
                      </form>
                    )}

                    {agent.valide && !agent.suspendu_at && (
                      <form action={actionSuspendreCompte} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="agent_id" value={agent.id} />
                        <input type="hidden" name="en_attente" value={enAttenteSeulement ? "1" : "0"} />
                        <TextInput name="motif" placeholder="Motif (facultatif)" className="w-48" />
                        <SubmitButton variant="danger">
                          <Ban size={14} />
                          Suspendre
                        </SubmitButton>
                      </form>
                    )}

                    {agent.suspendu_at && (
                      <form action={actionReactiverCompte}>
                        <input type="hidden" name="agent_id" value={agent.id} />
                        <input type="hidden" name="en_attente" value={enAttenteSeulement ? "1" : "0"} />
                        <SubmitButton variant="secondary">
                          <Play size={14} />
                          Réactiver
                        </SubmitButton>
                      </form>
                    )}
                  </div>

                  <form action={actionAssignerRoles} className="flex flex-col gap-2 border-t border-line pt-3">
                    <input type="hidden" name="agent_id" value={agent.id} />
                    <input type="hidden" name="en_attente" value={enAttenteSeulement ? "1" : "0"} />
                    <span className="text-xs font-medium uppercase tracking-[0.05em] text-ink-faint">Rôles</span>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {roles.map((role) => (
                        <label key={role} className="flex items-center gap-1.5 text-sm text-ink-soft">
                          <input
                            type="checkbox"
                            name="roles"
                            value={role}
                            defaultChecked={agent.roles.includes(role)}
                            className="rounded border-line-strong accent-seal"
                          />
                          {role.replaceAll("_", " ")}
                        </label>
                      ))}
                    </div>
                    <SubmitButton variant="secondary">Mettre à jour les rôles</SubmitButton>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card title="Créer un compte" description="Le compte reste inactif jusqu'à sa validation par un second administrateur.">
        <form action={actionCreerCompte} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input type="hidden" name="en_attente" value={enAttenteSeulement ? "1" : "0"} />
          <Field label="Matricule" htmlFor="matricule">
            <TextInput id="matricule" name="matricule" required placeholder="Ex. OPJ-0123" />
          </Field>
          <Field label="Email" htmlFor="email" hint="facultatif">
            <TextInput id="email" name="email" type="email" placeholder="agent@justicia.test" />
          </Field>
          <Field label="Nom" htmlFor="nom">
            <TextInput id="nom" name="nom" required placeholder="Ex. Kouassi" />
          </Field>
          <Field label="Prénom" htmlFor="prenom">
            <TextInput id="prenom" name="prenom" required placeholder="Ex. Awa" />
          </Field>
          <Field label="Mot de passe initial" htmlFor="password">
            <TextInput id="password" name="password" type="password" required minLength={8} placeholder="8 caractères minimum" />
          </Field>
          <Field label="Service" htmlFor="service_id">
            <Select id="service_id" name="service_id" defaultValue="">
              <option value="">—</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nom}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ressort" htmlFor="ressort_id">
            <Select id="ressort_id" name="ressort_id" defaultValue="">
              <option value="">—</option>
              {ressorts.map((ressort) => (
                <option key={ressort.id} value={ressort.id}>
                  {ressort.nom}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <SubmitButton>
              <UserPlus size={16} />
              Créer le compte
            </SubmitButton>
          </div>
        </form>
      </Card>

      <Card
        title="Référentiel des infractions"
        description="Une réforme s'intègre par une nouvelle version datée — jamais par modification d'une entrée existante."
      >
        <form action={actionCreerInfraction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input type="hidden" name="en_attente" value={enAttenteSeulement ? "1" : "0"} />
          <Field label="Code" htmlFor="code" hint="ex. CP-311">
            <TextInput id="code" name="code" required placeholder="Ex. CP-311" />
          </Field>
          <Field label="Catégorie" htmlFor="categorie">
            <Select id="categorie" name="categorie" required>
              <option value="contravention">Contravention</option>
              <option value="delit">Délit</option>
              <option value="crime">Crime</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Libellé" htmlFor="libelle">
              <TextInput id="libelle" name="libelle" required placeholder="Ex. Vol simple" />
            </Field>
          </div>
          <Field label="Texte de référence" htmlFor="texte_reference" hint="facultatif">
            <TextInput id="texte_reference" name="texte_reference" placeholder="Ex. Loi n° 2026-001 du 12 janvier 2026" />
          </Field>
          <Field label="Date d'entrée en vigueur" htmlFor="date_entree_vigueur">
            <TextInput id="date_entree_vigueur" name="date_entree_vigueur" type="date" required />
          </Field>
          <div className="sm:col-span-2">
            <SubmitButton variant="secondary">Verser cette version</SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
