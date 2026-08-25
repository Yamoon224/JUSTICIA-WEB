import Link from "next/link";

import { Badge } from "@/components/form";
import { listerAffaires } from "@/lib/api/affaires";
import type { StatutAffaire } from "@/types/affaire";

export const metadata = { title: "Affaires — JUSTICIA" };

const TONE_PAR_STATUT: Record<StatutAffaire, "zinc" | "green" | "amber" | "red"> = {
  ouverte: "zinc",
  transmise_parquet: "amber",
  classee_sans_suite: "red",
  information_ouverte: "amber",
  audiencee: "amber",
  jugee: "green",
  cloturee: "green",
};

export default async function AffairesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const affaires = await listerAffaires(page ? Number(page) : 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Affaires</h1>
          <p className="text-sm text-zinc-500">Dossiers de votre ressort (§6.3, §8).</p>
        </div>
        <Link
          href="/affaires/nouvelle"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Ouvrir une affaire
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-2">Numéro</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Ouverture</th>
            </tr>
          </thead>
          <tbody>
            {affaires.data.map((affaire) => (
              <tr key={affaire.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-2">
                  <Link href={`/affaires/${affaire.id}`} className="font-medium text-zinc-900 hover:underline">
                    {affaire.numero_affaire}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <Badge tone={TONE_PAR_STATUT[affaire.statut]}>{affaire.statut}</Badge>
                </td>
                <td className="px-4 py-2 text-zinc-500">{affaire.date_ouverture ?? "—"}</td>
              </tr>
            ))}

            {affaires.data.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-zinc-500">
                  Aucune affaire dans votre ressort.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {affaires.meta.last_page > 1 && (
        <div className="flex gap-2 text-sm text-zinc-500">
          Page {affaires.meta.current_page} / {affaires.meta.last_page}
        </div>
      )}
    </div>
  );
}
