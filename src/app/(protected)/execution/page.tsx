import Link from "next/link";
import { Gavel, Landmark } from "lucide-react";

import { Badge, EmptyState, ErrorBanner, Mono, PageHeader, SubmitButton } from "@/components/ui";
import { actionMettreAExecution } from "@/features/execution/actions";
import { listerDecisionsAExecuter, listerDossiersExecution, type FiltreDossiersExecution } from "@/lib/api/execution";

export const metadata = { title: "Exécution des peines — JUSTICIA" };

type Onglet = FiltreDossiersExecution | "a_executer";

const ONGLETS: { onglet: Onglet; label: string }[] = [
  { onglet: undefined, label: "Tous" },
  { onglet: "en_cours", label: "En cours" },
  { onglet: "a_executer", label: "À mettre à exécution" },
];

export default async function ExecutionPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string; erreur?: string }>;
}) {
  const { filtre, erreur } = await searchParams;
  const ongletActif = (filtre as Onglet) ?? undefined;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Exécution des peines"
        title="Exécution"
        description="Écrou, situations pénales, amendes, travail d'intérêt général et mises à l'épreuve."
      />

      <div className="flex gap-1 border-b border-line">
        {ONGLETS.map(({ onglet, label }) => (
          <Link
            key={label}
            href={onglet ? `/execution?filtre=${onglet}` : "/execution"}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              ongletActif === onglet
                ? "border-seal text-seal"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <ErrorBanner message={erreur} />

      {ongletActif === "a_executer" ? <ListeDecisionsAExecuter /> : <ListeDossiers filtre={ongletActif} />}
    </div>
  );
}

async function ListeDossiers({ filtre }: { filtre: FiltreDossiersExecution }) {
  const dossiers = await listerDossiersExecution(filtre);

  if (dossiers.data.length === 0) {
    return <EmptyState message="Aucun dossier dans cette vue." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {dossiers.data.map((dossier) => {
        const personne = dossier.affaire?.personnes?.find((p) => p.id === dossier.personne_id);

        return (
          <Link
            key={dossier.id}
            href={`/execution/${dossier.id}`}
            className="group flex flex-col gap-2 rounded-2xl border border-line bg-paper-raised p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-seal/30 sm:flex-row sm:items-center sm:justify-between [border-left:3px_solid_var(--seal)]"
          >
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2">
                <Landmark size={14} className="text-ink-faint" />
                <Mono className="font-medium text-ink group-hover:text-seal">
                  {dossier.affaire?.numero_affaire ?? `Dossier #${dossier.id}`}
                </Mono>
              </span>
              <span className="text-sm text-ink-soft">
                {personne?.nom_affichage ?? `Personne #${dossier.personne_id}`} — mis à exécution le{" "}
                {new Date(dossier.mise_a_execution_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <Badge tone={dossier.statut === "terminee" ? "forest" : "gold"}>
              {dossier.statut === "terminee" ? "terminée" : "en cours"}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}

async function ListeDecisionsAExecuter() {
  const decisions = await listerDecisionsAExecuter();

  if (decisions.data.length === 0) {
    return <EmptyState message="Aucune condamnation définitive en attente de mise à exécution." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {decisions.data.map((decision) => (
        <div
          key={decision.id}
          className="flex flex-col gap-2 rounded-2xl border border-line bg-paper-raised p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between [border-left:3px_solid_var(--seal)]"
        >
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <Gavel size={14} className="text-ink-faint" />
              <Mono className="font-medium text-ink">{decision.affaire.numero_affaire}</Mono>
            </span>
            <span className="text-sm text-ink-soft">
              {decision.personne.nom_affichage}
              {decision.peine_principale && ` — ${decision.peine_principale}`}
            </span>
            <span className="text-xs text-ink-faint">
              Définitive depuis le {new Date(decision.delai_recours_expire_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <form action={actionMettreAExecution}>
            <input type="hidden" name="decision_id" value={decision.id} />
            <input type="hidden" name="retour" value="/execution?filtre=a_executer" />
            <SubmitButton>
              <Landmark size={16} />
              Mettre à exécution
            </SubmitButton>
          </form>
        </div>
      ))}
    </div>
  );
}
