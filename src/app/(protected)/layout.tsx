import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { MODULES } from "@/features/modules";
import { getCurrentAgent } from "@/lib/auth/current-agent";

/**
 * Toutes les routes sous ce groupe exigent un agent authentifié. Le proxy
 * (src/proxy.ts) filtre déjà l'absence de cookie ; cette revérification
 * serveur couvre le cas d'un jeton présent mais révoqué/expiré côté API.
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const agent = await getCurrentAgent();

  if (!agent) {
    redirect("/login");
  }

  const modules = MODULES.filter(
    (module) => module.permissions.length === 0 || module.permissions.some((permission) => agent.permissions.includes(permission)),
  );

  return (
    <AppShell agent={agent} modules={modules}>
      {children}
    </AppShell>
  );
}
