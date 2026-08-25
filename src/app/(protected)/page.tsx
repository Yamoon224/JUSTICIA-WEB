import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MODULE_ICONS } from "@/components/module-icons";
import { PageHeader } from "@/components/ui";
import { MODULES } from "@/features/modules";
import { getCurrentAgent } from "@/lib/auth/current-agent";

export default async function DashboardPage() {
  const agent = await getCurrentAgent();
  const accessibles = MODULES.filter(
    (module) => !agent || module.permissions.some((permission) => agent.permissions.includes(permission)),
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Tableau de bord"
        title={agent ? `Bonjour, ${agent.prenom}` : "Bonjour"}
        description="Modules accessibles selon votre habilitation et votre ressort (§8 du cahier des charges)."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accessibles.map((module) => {
          const Icon = MODULE_ICONS[module.icon];
          const contenu = (
            <>
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-seal-tint text-seal-strong">
                  <Icon size={19} strokeWidth={1.75} />
                </span>
                {module.href && (
                  <ArrowRight size={16} className="text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-seal" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-base font-medium text-ink">{module.label}</span>
                <span className="text-sm text-ink-soft">{module.description}</span>
              </div>
              {!module.href && (
                <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                  {module.navHint ?? "Interface à venir"}
                </span>
              )}
            </>
          );

          return module.href ? (
            <Link
              key={module.slug}
              href={module.href}
              className="group flex flex-col gap-4 rounded-2xl border border-line bg-paper-raised p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-seal/30 hover:shadow-lg"
            >
              {contenu}
            </Link>
          ) : (
            <div
              key={module.slug}
              className="flex flex-col gap-4 rounded-2xl border border-dashed border-line-strong bg-paper-sunken/50 p-5 opacity-70"
            >
              {contenu}
            </div>
          );
        })}

        {accessibles.length === 0 && (
          <p className="text-sm text-ink-soft">
            Aucun module ne vous est encore accessible. Contactez votre administrateur.
          </p>
        )}
      </div>
    </div>
  );
}
