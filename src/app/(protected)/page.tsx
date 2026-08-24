import { getCurrentAgent } from "@/lib/auth/current-agent";
import { MODULES } from "@/features/modules";

export default async function DashboardPage() {
  const agent = await getCurrentAgent();
  const accessible = MODULES.filter(
    (module) => !agent || module.permissions.some((permission) => agent.permissions.includes(permission)),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Tableau de bord</h1>
        <p className="text-sm text-zinc-500">Modules accessibles selon votre habilitation.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accessible.map((module) => (
          <div
            key={module.slug}
            className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-4"
          >
            <span className="text-sm font-medium text-zinc-900">{module.label}</span>
            <span className="text-xs text-zinc-500">{module.description}</span>
          </div>
        ))}

        {accessible.length === 0 && (
          <p className="text-sm text-zinc-500">
            Aucun module ne vous est encore accessible. Contactez votre administrateur.
          </p>
        )}
      </div>
    </div>
  );
}
