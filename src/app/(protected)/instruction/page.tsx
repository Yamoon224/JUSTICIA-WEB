import Link from "next/link";
import { FileSearch } from "lucide-react";

import { Badge, EmptyState, Mono, PageHeader } from "@/components/ui";
import { listerDossiersInstruction, type FiltreDossiersInstruction } from "@/lib/api/instruction";

export const metadata = { title: "Instruction — JUSTICIA" };

const ONGLETS: { filtre: FiltreDossiersInstruction; label: string }[] = [
  { filtre: undefined, label: "Tous" },
  { filtre: "non_affectes", label: "Non affectés" },
  { filtre: "mon_portefeuille", label: "Mon cabinet" },
];

export default async function InstructionPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { filtre } = await searchParams;
  const filtreActif = (filtre as FiltreDossiersInstruction) ?? undefined;
  const dossiers = await listerDossiersInstruction(filtreActif);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cabinet d'instruction"
        title="Instruction"
        description="Dossiers d'information : mise en examen, actes, mandats, mesures de sûreté."
      />

      <div className="flex gap-1 border-b border-line">
        {ONGLETS.map((onglet) => (
          <Link
            key={onglet.label}
            href={onglet.filtre ? `/instruction?filtre=${onglet.filtre}` : "/instruction"}
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
              href={`/instruction/${dossier.id}`}
              className="group flex flex-col gap-2 rounded-2xl border border-line bg-paper-raised p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-seal/30 sm:flex-row sm:items-center sm:justify-between [border-left:3px_solid_var(--seal)]"
            >
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  <FileSearch size={14} className="text-ink-faint" />
                  <Mono className="font-medium text-ink group-hover:text-seal">{dossier.affaire.numero_affaire}</Mono>
                </span>
                <span className="text-sm text-ink-soft">{dossier.affaire.description || "Aucune description."}</span>
              </div>
              <div className="flex items-center gap-2">
                {dossier.statut === "cloture" ? (
                  <Badge tone="forest">{dossier.ordonnance?.replaceAll("_", " ") ?? "clôturé"}</Badge>
                ) : !dossier.juge_instruction_id ? (
                  <Badge tone="gold">non affecté</Badge>
                ) : (
                  <Badge tone="neutral">en cours</Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
