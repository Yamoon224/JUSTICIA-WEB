"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState, useSyncExternalStore, type ReactNode } from "react";

import { LogoutButton } from "@/components/logout-button";
import { MODULE_ICONS } from "@/components/module-icons";
import { SealMark } from "@/components/seal-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LIBELLES_GROUPE, type ModuleDescriptor, type ModuleGroupKey } from "@/features/modules";
import type { Agent } from "@/types/agent";

const ORDRE_GROUPES: ModuleGroupKey[] = ["personnel", "chaine-penale", "pilotage"];
const CLE_STOCKAGE_REDUCTION = "justicia-sidebar-collapsed";
// `storage` ne se déclenche que dans les autres onglets ; cet événement
// maison permet à l'onglet qui vient de basculer de se resynchroniser aussi.
const EVENEMENT_REDUCTION = "justicia-sidebar-collapsed-changed";

function souscrireReduction(notifier: () => void): () => void {
  window.addEventListener("storage", notifier);
  window.addEventListener(EVENEMENT_REDUCTION, notifier);
  return () => {
    window.removeEventListener("storage", notifier);
    window.removeEventListener(EVENEMENT_REDUCTION, notifier);
  };
}

function lireReduction(): boolean {
  try {
    return localStorage.getItem(CLE_STOCKAGE_REDUCTION) === "1";
  } catch {
    return false;
  }
}

function lireReductionServeur(): boolean {
  return false;
}

function estActif(pathname: string, href?: string): boolean {
  if (!href) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function grouper(modules: ModuleDescriptor[]): { groupe: ModuleGroupKey; modules: ModuleDescriptor[] }[] {
  return ORDRE_GROUPES.map((groupe) => ({ groupe, modules: modules.filter((m) => m.group === groupe) })).filter(
    (section) => section.modules.length > 0,
  );
}

function NavLinks({
  modules,
  pathname,
  onNavigate,
  reduit = false,
}: {
  modules: ModuleDescriptor[];
  pathname: string;
  onNavigate?: () => void;
  reduit?: boolean;
}) {
  return (
    <nav className={`flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4 ${reduit ? "px-2" : "px-3"}`}>
      {grouper(modules).map(({ groupe, modules: modulesDuGroupe }) => (
        <div key={groupe} className="flex flex-col gap-0.5">
          {reduit ? (
            <div className="mx-auto mb-1 h-px w-6 bg-line" aria-hidden="true" />
          ) : (
            <span className="px-3 pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
              {LIBELLES_GROUPE[groupe]}
            </span>
          )}
          {modulesDuGroupe.map((module) => {
            const Icon = MODULE_ICONS[module.icon];
            const actif = estActif(pathname, module.href);

            if (!module.href) {
              return (
                <span
                  key={module.slug}
                  title={reduit ? module.label : (module.navHint ?? "Interface à venir")}
                  className={`flex items-center gap-3 rounded-lg text-sm text-ink-faint ${
                    reduit ? "justify-center p-2.5" : "px-3 py-2"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.75} className="shrink-0" />
                  {!reduit && module.label}
                </span>
              );
            }

            return (
              <Link
                key={module.slug}
                href={module.href}
                onClick={onNavigate}
                title={reduit ? module.label : undefined}
                className={`group flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                  reduit ? "justify-center p-2.5" : "px-3 py-2"
                } ${actif ? "bg-seal-tint text-seal-strong" : "text-ink-soft hover:bg-paper-sunken hover:text-ink"}`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.75}
                  className={`shrink-0 ${actif ? "text-seal" : "text-ink-faint group-hover:text-ink-soft"}`}
                />
                {!reduit && module.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function TopBar({ onOpenMenu, alertesNonLues }: { onOpenMenu: () => void; alertesNonLues: number }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-paper-raised/85 px-4 backdrop-blur-sm sm:px-6 lg:px-10">
      <button
        aria-label="Ouvrir le menu"
        onClick={onOpenMenu}
        className="rounded-md p-1.5 text-ink-soft hover:bg-paper-sunken lg:hidden"
      >
        <Menu size={20} />
      </button>
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <SealMark className="h-5 w-5 text-seal" />
        <span className="font-display text-base font-medium text-ink">JUSTICIA</span>
      </Link>

      <div className="flex-1" />

      <ThemeToggle />

      <Link
        href="/alertes"
        aria-label={alertesNonLues > 0 ? `Alertes — ${alertesNonLues} non lue(s)` : "Alertes"}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-sunken hover:text-ink"
      >
        <Bell size={18} strokeWidth={1.75} />
        {alertesNonLues > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-seal px-1 text-[0.65rem] font-semibold leading-none text-white">
            {alertesNonLues > 9 ? "9+" : alertesNonLues}
          </span>
        )}
      </Link>
    </header>
  );
}

function AgentCard({ agent, reduit = false }: { agent: Agent; reduit?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 border-t border-line py-3.5 ${reduit ? "justify-center px-2" : "px-4"}`}
      title={reduit ? `${agent.nom_complet} — ${agent.matricule}` : undefined}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-seal-tint font-display text-sm font-medium text-seal-strong">
        {agent.prenom.charAt(0)}
        {agent.nom.charAt(0)}
      </div>
      {!reduit && (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-ink">{agent.nom_complet}</span>
          <span className="truncate font-mono text-xs text-ink-faint">{agent.matricule}</span>
        </div>
      )}
    </div>
  );
}

export function AppShell({
  agent,
  modules,
  alertesNonLues,
  children,
}: {
  agent: Agent;
  modules: ModuleDescriptor[];
  alertesNonLues: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOuvert, setDrawerOuvert] = useState(false);
  const reduit = useSyncExternalStore(souscrireReduction, lireReduction, lireReductionServeur);

  function basculerReduction() {
    try {
      localStorage.setItem(CLE_STOCKAGE_REDUCTION, reduit ? "0" : "1");
    } catch {
      // Stockage indisponible : la préférence ne survivra pas à la session.
    }
    window.dispatchEvent(new Event(EVENEMENT_REDUCTION));
  }

  return (
    <div className="flex min-h-screen">
      {/* Navigation desktop */}
      <aside
        className={`relative hidden shrink-0 flex-col border-r border-line bg-paper-raised transition-[width] duration-200 lg:sticky lg:top-0 lg:flex lg:h-screen ${
          reduit ? "w-[4.5rem]" : "w-64"
        }`}
      >
        <button
          type="button"
          onClick={basculerReduction}
          aria-label={reduit ? "Déplier le menu" : "Réduire le menu"}
          title={reduit ? "Déplier le menu" : "Réduire le menu"}
          className="absolute -right-3 top-6 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-line bg-paper-raised text-ink-soft shadow-sm transition-colors hover:text-seal lg:flex"
        >
          {reduit ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <Link href="/" className={`flex items-center gap-2.5 py-5 ${reduit ? "justify-center px-0" : "px-5"}`}>
          <SealMark className="h-7 w-7 shrink-0 text-seal" />
          {!reduit && <span className="font-display text-lg font-medium tracking-tight text-ink">JUSTICIA</span>}
        </Link>
        <NavLinks modules={modules} pathname={pathname} reduit={reduit} />
        <AgentCard agent={agent} reduit={reduit} />
        <div className={reduit ? "px-2 pb-3" : "px-3 pb-3"}>
          <LogoutButton reduit={reduit} />
        </div>
      </aside>

      {/* Tiroir mobile */}
      {drawerOuvert && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
            onClick={() => setDrawerOuvert(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-paper-raised shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="flex items-center gap-2.5">
                <SealMark className="h-6 w-6 text-seal" />
                <span className="font-display text-lg font-medium text-ink">JUSTICIA</span>
              </span>
              <button
                aria-label="Fermer le menu"
                onClick={() => setDrawerOuvert(false)}
                className="rounded-md p-1.5 text-ink-soft hover:bg-paper-sunken"
              >
                <X size={18} />
              </button>
            </div>
            <NavLinks modules={modules} pathname={pathname} onNavigate={() => setDrawerOuvert(false)} />
            <AgentCard agent={agent} />
            <div className="px-3 pb-3">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenMenu={() => setDrawerOuvert(true)} alertesNonLues={alertesNonLues} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
