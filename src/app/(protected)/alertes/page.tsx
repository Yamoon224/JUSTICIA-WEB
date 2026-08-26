import Link from "next/link";
import { AlertTriangle, Bell, BellOff, Check } from "lucide-react";

import { Badge, Card, EmptyState, PageHeader, SubmitButton } from "@/components/ui";
import { actionMarquerAlerteLue } from "@/features/alertes/actions";
import { listerAlertes } from "@/lib/api/alertes";
import type { Alerte } from "@/types/alerte";

export const metadata = { title: "Alertes — JUSTICIA" };

const TONE_NIVEAU = {
  information: "neutral",
  avertissement: "gold",
  depassement: "rust",
} as const;

const LIBELLE_NIVEAU: Record<Alerte["niveau"], string> = {
  information: "Information",
  avertissement: "Avertissement",
  depassement: "Dépassement",
};

export default async function AlertesPage({
  searchParams,
}: {
  searchParams: Promise<{ non_lues?: string }>;
}) {
  const { non_lues } = await searchParams;
  const nonLuesSeulement = non_lues === "1";
  const { data: alertes } = await listerAlertes(nonLuesSeulement);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader
        eyebrow="§6.1, §6.11 — Agenda personnel"
        title="Mes alertes"
        description="Échéances de garde à vue et de détention provisoire qui vous concernent."
        actions={
          <div className="flex gap-1 rounded-lg border border-line-strong bg-paper-raised p-1 text-xs font-medium">
            <Link
              href="/alertes"
              className={`rounded-md px-3 py-1.5 ${!nonLuesSeulement ? "bg-seal-tint text-seal-strong" : "text-ink-soft hover:text-ink"}`}
            >
              Toutes
            </Link>
            <Link
              href="/alertes?non_lues=1"
              className={`rounded-md px-3 py-1.5 ${nonLuesSeulement ? "bg-seal-tint text-seal-strong" : "text-ink-soft hover:text-ink"}`}
            >
              Non lues
            </Link>
          </div>
        }
      />

      <Card>
        {alertes.length === 0 ? (
          <EmptyState message={nonLuesSeulement ? "Aucune alerte non lue." : "Aucune alerte."} />
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {alertes.map((alerte) => (
              <li key={alerte.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-start gap-2.5">
                  {alerte.niveau === "depassement" ? (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rust" />
                  ) : alerte.lue ? (
                    <BellOff size={16} className="mt-0.5 shrink-0 text-ink-faint" />
                  ) : (
                    <Bell size={16} className="mt-0.5 shrink-0 text-gold" />
                  )}
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={TONE_NIVEAU[alerte.niveau]}>{LIBELLE_NIVEAU[alerte.niveau]}</Badge>
                      {!alerte.lue && <Badge tone="seal">non lue</Badge>}
                    </div>
                    <p className="text-sm text-ink">{alerte.message}</p>
                    <p className="text-xs text-ink-faint">
                      {new Date(alerte.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                </div>

                {!alerte.lue && (
                  <form action={actionMarquerAlerteLue}>
                    <input type="hidden" name="alerte_id" value={alerte.id} />
                    <input type="hidden" name="non_lues" value={nonLuesSeulement ? "1" : "0"} />
                    <SubmitButton variant="secondary">
                      <Check size={14} />
                      Marquer comme lue
                    </SubmitButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
