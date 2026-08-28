import { redirect } from "next/navigation";
import { Landmark, Mail, ShieldCheck, UserRound } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import { Badge, Card, PageHeader } from "@/components/ui";
import { getCurrentAgent } from "@/lib/auth/current-agent";

export const metadata = { title: "Mon profil — JUSTICIA" };

export default async function ProfilPage() {
  const agent = await getCurrentAgent();

  if (!agent) {
    redirect("/login");
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader eyebrow="Mon compte" title="Profil" description="Informations et habilitations associées à votre compte." />

      <Card>
        <div className="flex items-center gap-4 border-b border-line pb-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-seal-tint font-display text-xl font-medium text-seal-strong">
            {agent.prenom.charAt(0)}
            {agent.nom.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-medium text-ink">{agent.nom_complet}</span>
            <span className="font-mono text-sm text-ink-faint">{agent.matricule}</span>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoLigne icone={Mail} label="Courriel">
            {agent.email ?? "Non renseigné"}
          </InfoLigne>
          <InfoLigne icone={UserRound} label="Service">
            {agent.service?.nom ?? "Non rattaché"}
          </InfoLigne>
          <InfoLigne icone={Landmark} label="Ressort">
            {agent.ressort?.nom ?? "Non rattaché"}
          </InfoLigne>
          <InfoLigne icone={ShieldCheck} label="Statut">
            {agent.actif ? "Compte actif" : "Compte suspendu"}
          </InfoLigne>
        </dl>
      </Card>

      <Card title="Rôles" description="Habilitations attribuées à votre compte.">
        <div className="flex flex-wrap gap-2">
          {agent.roles.length > 0 ? (
            agent.roles.map((role) => (
              <Badge key={role} tone="seal">
                {role.replaceAll("_", " ")}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-ink-faint">Aucun rôle attribué.</p>
          )}
        </div>
      </Card>

      <Card title="Permissions" description="Actions autorisées, dérivées de vos rôles.">
        <div className="flex max-h-64 flex-wrap gap-1.5 overflow-y-auto scroll-slim pr-1">
          {agent.permissions.length > 0 ? (
            agent.permissions.map((permission) => (
              <Badge key={permission}>{permission.replaceAll("_", " ").replaceAll(".", " · ")}</Badge>
            ))
          ) : (
            <p className="text-sm text-ink-faint">Aucune permission accordée.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function InfoLigne({
  icone: Icone,
  label,
  children,
}: {
  icone: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper-sunken text-ink-faint">
        <Icone size={15} strokeWidth={1.75} />
      </span>
      <div className="flex flex-col">
        <dt className="text-xs uppercase tracking-wide text-ink-faint">{label}</dt>
        <dd className="text-sm text-ink">{children}</dd>
      </div>
    </div>
  );
}
