"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { LogoutButton } from "@/components/logout-button";
import { MODULE_ICONS } from "@/components/module-icons";
import { SealMark } from "@/components/seal-mark";
import type { ModuleDescriptor } from "@/features/modules";
import type { Agent } from "@/types/agent";

function estActif(pathname: string, href?: string): boolean {
  if (!href) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLinks({ modules, pathname, onNavigate }: { modules: ModuleDescriptor[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
      {modules.map((module) => {
        const Icon = MODULE_ICONS[module.icon];
        const actif = estActif(pathname, module.href);

        if (!module.href) {
          return (
            <span
              key={module.slug}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-faint"
              title={module.navHint ?? "Interface à venir"}
            >
              <Icon size={17} strokeWidth={1.75} />
              {module.label}
            </span>
          );
        }

        return (
          <Link
            key={module.slug}
            href={module.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              actif ? "bg-seal-tint text-seal-strong" : "text-ink-soft hover:bg-paper-sunken hover:text-ink"
            }`}
          >
            <Icon size={17} strokeWidth={1.75} className={actif ? "text-seal" : "text-ink-faint group-hover:text-ink-soft"} />
            {module.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-center gap-3 border-t border-line px-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-seal-tint font-display text-sm font-medium text-seal-strong">
        {agent.prenom.charAt(0)}
        {agent.nom.charAt(0)}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-ink">{agent.nom_complet}</span>
        <span className="truncate font-mono text-xs text-ink-faint">{agent.matricule}</span>
      </div>
    </div>
  );
}

export function AppShell({
  agent,
  modules,
  children,
}: {
  agent: Agent;
  modules: ModuleDescriptor[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOuvert, setDrawerOuvert] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Navigation desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-paper-raised lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
          <SealMark className="h-7 w-7 text-seal" />
          <span className="font-display text-lg font-medium tracking-tight text-ink">JUSTICIA</span>
        </Link>
        <NavLinks modules={modules} pathname={pathname} />
        <AgentCard agent={agent} />
        <div className="px-3 pb-3">
          <LogoutButton />
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
        <header className="flex items-center justify-between border-b border-line bg-paper-raised px-4 py-3 lg:hidden">
          <button
            aria-label="Ouvrir le menu"
            onClick={() => setDrawerOuvert(true)}
            className="rounded-md p-1.5 text-ink-soft hover:bg-paper-sunken"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <SealMark className="h-5 w-5 text-seal" />
            <span className="font-display text-base font-medium text-ink">JUSTICIA</span>
          </Link>
          <div className="w-8" />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
