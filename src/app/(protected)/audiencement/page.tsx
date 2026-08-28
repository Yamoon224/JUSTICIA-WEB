import Link from "next/link";
import { Gavel } from "lucide-react";

import { Badge, EmptyState, Mono, PageHeader } from "@/components/ui";
import { listerDossiersAudiencement, type FiltreDossiersAudiencement } from "@/lib/api/audiencement";
import { htmlVersExtrait } from "@/lib/rich-text";

export const metadata = { title: "Audiencement — JUSTICIA" };

const ONGLETS: { filtre: FiltreDossiersAudiencement; label: string }[] = [
  { filtre: undefined, label: "Tous" },
  { filtre: "a_enroler", label: "À enrôler" },
  { filtre: "a_venir", label: "À venir" },
];

const LIBELLES_STATUT: Record<string, string> = {
  a_enroler: "à enrôler",
  enrole: "enrôlé",
  jugee: "jugée",
};

export default async function AudiencementPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { filtre } = await searchParams;
  const filtreActif = (filtre as FiltreDossiersAudiencement) ?? undefined;
  const dossiers = await listerDossiersAudiencement(filtreActif);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Audiencement"
        title="Audiencement"
        description="Enrôlement, tenue d'audience, décisions et voies de recours."
      />

      <div className="flex gap-1 border-b border-line">
        {ONGLETS.map((onglet) => (
          <Link
            key={onglet.label}
            href={onglet.filtre ? `/audiencement?filtre=${onglet.filtre}` : "/audiencement"}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              filtreActif === onglet.filtre
                ? "border-seal text-seal"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {onglet.label}
          </Link>
        ))}
      </div>

      {dossiers.data.length === 0 ? (
        <EmptyState message="Aucun dossier dans cette vue." />
      ) : (
        <div className="flex flex-col gap-3">
          {dossiers.data.map((dossier) => (
            <Link
              key={dossier.id}
              href={`/audiencement/${dossier.id}`}
              className="group flex flex-col gap-2 rounded-2xl border border-line bg-paper-raised p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-seal/30 sm:flex-row sm:items-center sm:justify-between [border-left:3px_solid_var(--seal)]"
            >
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  <Gavel size={14} className="text-ink-faint" />
                  <Mono className="font-medium text-ink group-hover:text-seal">{dossier.affaire.numero_affaire}</Mono>
                </span>
                <span className="truncate text-sm text-ink-soft">
                  {dossier.date_audience
                    ? new Date(dossier.date_audience).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
                    : htmlVersExtrait(dossier.affaire.description) || "Aucune description."}
                </span>
              </div>
              <Badge tone={dossier.statut === "jugee" ? "forest" : dossier.statut === "enrole" ? "neutral" : "gold"}>
                {LIBELLES_STATUT[dossier.statut]}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
