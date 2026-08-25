import Link from "next/link";
import { FolderPlus } from "lucide-react";

import { Badge, EmptyState, LinkButton, Mono, PageHeader } from "@/components/ui";
import { listerAffaires } from "@/lib/api/affaires";
import type { StatutAffaire } from "@/types/affaire";

export const metadata = { title: "Affaires — JUSTICIA" };

const TONE_PAR_STATUT: Record<StatutAffaire, "neutral" | "forest" | "gold" | "rust"> = {
  ouverte: "neutral",
  transmise_parquet: "gold",
  classee_sans_suite: "rust",
  information_ouverte: "gold",
  audiencee: "gold",
  jugee: "forest",
  cloturee: "forest",
};

export default async function AffairesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const affaires = await listerAffaires(page ? Number(page) : 1);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="§6.3 — Dossiers"
        title="Affaires"
        description="Dossiers de votre ressort, de l'ouverture à la transmission au parquet."
        actions={
          <LinkButton href="/affaires/nouvelle">
            <FolderPlus size={16} />
            Ouvrir une affaire
          </LinkButton>
        }
      />

      {affaires.data.length === 0 ? (
        <EmptyState message="Aucune affaire dans votre ressort." />
      ) : (
        <div className="flex flex-col gap-3">
          {affaires.data.map((affaire) => (
            <Link
              key={affaire.id}
              href={`/affaires/${affaire.id}`}
              className="group flex flex-col gap-2 rounded-2xl border border-line bg-paper-raised p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-seal/30 sm:flex-row sm:items-center sm:justify-between [border-left:3px_solid_var(--seal)]"
            >
              <div className="flex flex-col gap-1">
                <Mono className="font-medium text-ink group-hover:text-seal">{affaire.numero_affaire}</Mono>
                <span className="text-sm text-ink-soft">{affaire.description || "Aucune description."}</span>
              </div>
              <Badge tone={TONE_PAR_STATUT[affaire.statut]}>{affaire.statut.replaceAll("_", " ")}</Badge>
            </Link>
          ))}
        </div>
      )}

      {affaires.meta.last_page > 1 && (
        <p className="text-sm text-ink-faint">
          Page {affaires.meta.current_page} / {affaires.meta.last_page}
        </p>
      )}
    </div>
  );
}
