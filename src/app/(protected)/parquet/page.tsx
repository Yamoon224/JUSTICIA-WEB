import Link from "next/link";
import { Inbox } from "lucide-react";

import { Badge, EmptyState, Mono, PageHeader } from "@/components/ui";
import { listerDossiersParquet, type FiltreDossiers } from "@/lib/api/parquet";

export const metadata = { title: "Parquet — JUSTICIA" };

const ONGLETS: { filtre: FiltreDossiers; label: string }[] = [
  { filtre: undefined, label: "Tous" },
  { filtre: "non_affectes", label: "Non affectés" },
  { filtre: "mon_portefeuille", label: "Mon portefeuille" },
];

export default async function ParquetPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { filtre } = await searchParams;
  const filtreActif = (filtre as FiltreDossiers) ?? undefined;
  const dossiers = await listerDossiersParquet(filtreActif);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="§6.5 — Bureau des arrivées"
        title="Parquet"
        description="Dossiers reçus, affectation aux magistrats et orientation des poursuites."
      />

      <div className="flex gap-1 border-b border-line">
        {ONGLETS.map((onglet) => (
          <Link
            key={onglet.label}
            href={onglet.filtre ? `/parquet?filtre=${onglet.filtre}` : "/parquet"}
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
              href={`/parquet/${dossier.id}`}
              className="group flex flex-col gap-2 rounded-2xl border border-line bg-paper-raised p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-seal/30 sm:flex-row sm:items-center sm:justify-between [border-left:3px_solid_var(--seal)]"
            >
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  <Inbox size={14} className="text-ink-faint" />
                  <Mono className="font-medium text-ink group-hover:text-seal">{dossier.affaire.numero_affaire}</Mono>
                </span>
                <span className="text-sm text-ink-soft">{dossier.affaire.description || "Aucune description."}</span>
              </div>
              <div className="flex items-center gap-2">
                {!dossier.magistrat_id && <Badge tone="gold">non affecté</Badge>}
                {dossier.magistrat_id && !dossier.orientation && <Badge tone="neutral">affecté</Badge>}
                {dossier.orientation && <Badge tone="forest">{dossier.orientation.replaceAll("_", " ")}</Badge>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
