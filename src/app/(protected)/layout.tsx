import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/logout-button";
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

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-900">JUSTICIA</span>
          <span className="text-xs text-zinc-500">
            {agent.nom_complet} · {agent.matricule}
            {agent.service ? ` · ${agent.service.nom}` : ""}
          </span>
        </div>
        <LogoutButton />
      </header>

      <main className="flex flex-1 flex-col px-6 py-8">{children}</main>
    </div>
  );
}
