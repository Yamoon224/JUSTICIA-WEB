import { AlertTriangle, BarChart3, BookLock, Clock, Gavel, Landmark, Scale, ShieldAlert } from "lucide-react";

import { Badge, Card, PageHeader, Select } from "@/components/ui";
import { listerRessorts } from "@/lib/api/referentiels";
import { obtenirTableauDeBord } from "@/lib/api/statistiques";
import { getCurrentAgent } from "@/lib/auth/current-agent";

export const metadata = { title: "Statistiques — JUSTICIA" };

const LIBELLES_STATUT_AFFAIRE: Record<string, string> = {
  ouverte: "Ouverte",
  transmise_parquet: "Transmise au parquet",
  classee_sans_suite: "Classée sans suite",
  information_ouverte: "Information ouverte",
  audiencee: "Audiencée",
  jugee: "Jugée",
  cloturee: "Clôturée",
};

const LIBELLES_ORIENTATION: Record<string, string> = {
  classement_sans_suite: "Classement sans suite",
  rappel_a_la_loi: "Rappel à la loi",
  mediation_penale: "Médiation pénale",
  composition_penale: "Composition pénale",
  citation_directe: "Citation directe",
  ouverture_information: "Ouverture d'information",
  comparution_immediate: "Comparution immédiate",
};

export default async function StatistiquesPage({
  searchParams,
}: {
  searchParams: Promise<{ ressort_id?: string }>;
}) {
  const { ressort_id } = await searchParams;
  const ressortId = ressort_id ? Number(ressort_id) : undefined;

  const agent = await getCurrentAgent();
  const estAdministrateur = agent?.permissions.includes("administration.gerer") ?? false;

  const [tableau, ressorts] = await Promise.all([
    obtenirTableauDeBord(ressortId),
    estAdministrateur ? listerRessorts() : Promise.resolve([]),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="§6.11-6.12 — Statistiques et pilotage"
        title="Statistiques"
        description={
          tableau.ressort_id
            ? "Instantané agrégé pour le ressort sélectionné."
            : "Instantané agrégé national, tous ressorts confondus."
        }
      />

      {estAdministrateur && (
        <form method="get" className="flex flex-wrap items-end gap-3">
          <Select name="ressort_id" defaultValue={ressort_id ?? ""} className="w-auto">
            <option value="">Vue nationale</option>
            {ressorts.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nom}
              </option>
            ))}
          </Select>
          <button
            type="submit"
            className="rounded-lg border border-line-strong bg-paper-raised px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-seal/40 hover:text-seal"
          >
            Afficher
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Affaires"
          description={`${tableau.affaires.total} au total`}
          actions={<BarChart3 size={18} className="text-ink-faint" />}
        >
          <Repartition donnees={tableau.affaires.par_statut} libelles={LIBELLES_STATUT_AFFAIRE} />
        </Card>

        <Card
          title="Garde à vue"
          description="§6.1"
          actions={<ShieldAlert size={18} className="text-ink-faint" />}
        >
          <Statistique label="En cours" valeur={tableau.garde_a_vue.en_cours} />
          <Statistique
            label="Échéances dépassées"
            valeur={tableau.garde_a_vue.echeances_depassees}
            alerte={tableau.garde_a_vue.echeances_depassees > 0}
          />
        </Card>

        <Card
          title="Parquet"
          description="§6.5"
          actions={<Gavel size={18} className="text-ink-faint" />}
        >
          <Statistique label="En attente d'orientation" valeur={tableau.parquet.en_attente_orientation} />
          <Repartition donnees={tableau.parquet.orientations_par_type} libelles={LIBELLES_ORIENTATION} />
        </Card>

        <Card
          title="Instruction"
          description="§6.6"
          actions={<Scale size={18} className="text-ink-faint" />}
        >
          <Statistique label="Dossiers ouverts" valeur={tableau.instruction.dossiers_ouverts} />
          <Statistique label="Détention provisoire en cours" valeur={tableau.instruction.detention_provisoire_en_cours} />
          <Statistique
            label="Échéances dépassées"
            valeur={tableau.instruction.detention_provisoire_echeances_depassees}
            alerte={tableau.instruction.detention_provisoire_echeances_depassees > 0}
          />
        </Card>

        <Card
          title="Audiencement"
          description="§6.7-6.8"
          actions={<Landmark size={18} className="text-ink-faint" />}
        >
          <Statistique label="À enrôler" valeur={tableau.audiencement.a_enroler} />
          <Statistique label="Enrôlées" valeur={tableau.audiencement.enrole} />
          <Statistique label="Jugées" valeur={tableau.audiencement.jugee} />
        </Card>

        <Card
          title="Exécution des peines"
          description="§6.9"
          actions={<AlertTriangle size={18} className="text-ink-faint" />}
        >
          <Statistique label="Dossiers en cours" valeur={tableau.execution.dossiers_en_cours} />
          <Statistique label="Écroués en détention" valeur={tableau.execution.ecroues_en_detention} />
          <Statistique
            label="Échéances de libération dépassées"
            valeur={tableau.execution.echeances_liberation_depassees}
            alerte={tableau.execution.echeances_liberation_depassees > 0}
          />
        </Card>

        <Card
          title="Casier judiciaire"
          description="§6.10 — registre national, non cloisonné par ressort"
          actions={<BookLock size={18} className="text-ink-faint" />}
        >
          <Statistique label="Total" valeur={tableau.casier.total} />
          <Statistique label="Actives" valeur={tableau.casier.actives} />
          <Statistique label="Réhabilitées" valeur={tableau.casier.rehabilitees} />
          <Statistique label="Amnistiées" valeur={tableau.casier.amnistiees} />
        </Card>

        <Card
          title="Délais moyens de traitement"
          description="§6.11"
          actions={<Clock size={18} className="text-ink-faint" />}
        >
          <Statistique label="Garde à vue" valeur={formatDuree(tableau.delais_moyens_jours.garde_a_vue_heures, "h")} />
          <Statistique label="Instruction" valeur={formatDuree(tableau.delais_moyens_jours.instruction_jours, "j")} />
          <Statistique label="Avant jugement" valeur={formatDuree(tableau.delais_moyens_jours.jugement_jours, "j")} />
        </Card>
      </div>
    </div>
  );
}

function Statistique({ label, valeur, alerte = false }: { label: string; valeur: number | string; alerte?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink-soft">{label}</span>
      {alerte ? (
        <Badge tone="rust">{valeur}</Badge>
      ) : (
        <span className="font-display text-lg font-medium text-ink">{valeur}</span>
      )}
    </div>
  );
}

function Repartition({ donnees, libelles }: { donnees: Record<string, number>; libelles: Record<string, string> }) {
  const entrees = Object.entries(donnees);
  const maximum = Math.max(1, ...entrees.map(([, n]) => n));

  if (entrees.length === 0) {
    return <p className="text-sm text-ink-faint">Aucune donnée.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {entrees.map(([cle, valeur]) => (
        <li key={cle} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-soft">{libelles[cle] ?? cle}</span>
            <span className="font-medium text-ink">{valeur}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-sunken">
            <div className="h-full rounded-full bg-seal/70" style={{ width: `${(valeur / maximum) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatDuree(valeur: number | null, unite: string): string {
  return valeur === null ? "—" : `${valeur} ${unite}`;
}
