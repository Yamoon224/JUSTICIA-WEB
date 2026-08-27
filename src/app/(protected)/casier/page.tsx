import Link from "next/link";
import { Search } from "lucide-react";

import { EmptyState, Mono, PageHeader, TextInput } from "@/components/ui";
import { rechercherPersonnes } from "@/lib/api/personnes";

export const metadata = { title: "Casier judiciaire — JUSTICIA" };

export default async function CasierPage({
  searchParams,
}: {
  searchParams: Promise<{ nom?: string; prenom?: string }>;
}) {
  const { nom, prenom } = await searchParams;
  const resultats = nom || prenom ? await rechercherPersonnes({ nom, prenom }) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Casier judiciaire"
        title="Casier judiciaire"
        description="Recherchez une personne pour consulter ou gérer son casier."
      />

      <form method="get" className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[10rem]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <TextInput type="text" name="nom" defaultValue={nom} placeholder="Nom" className="pl-9" />
        </div>
        <TextInput type="text" name="prenom" defaultValue={prenom} placeholder="Prénom" className="flex-1 min-w-[10rem]" />
        <button
          type="submit"
          className="rounded-lg border border-line-strong bg-paper-raised px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-seal/40 hover:text-seal"
        >
          Rechercher
        </button>
      </form>

      {resultats === null ? (
        <EmptyState message="Indiquez un nom ou un prénom pour rechercher une personne." />
      ) : resultats.data.length === 0 ? (
        <EmptyState message="Aucune personne ne correspond à cette recherche." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-[var(--shadow-card)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper-sunken/60 text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="hidden px-4 py-3 sm:table-cell">Identifiant</th>
                <th className="px-4 py-3">Nom</th>
                <th className="hidden px-4 py-3 sm:table-cell">Naissance</th>
              </tr>
            </thead>
            <tbody>
              {resultats.data.map((personne) => (
                <tr key={personne.id} className="border-b border-line last:border-0 hover:bg-paper-sunken/40">
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Mono className="text-ink-faint">{personne.identifiant_unique.slice(0, 8)}</Mono>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/casier/personnes/${personne.id}?nom=${encodeURIComponent(personne.nom_affichage)}`}
                      className="font-medium text-ink hover:text-seal hover:underline"
                    >
                      {personne.nom_affichage || "—"}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-soft sm:table-cell">{personne.date_naissance ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
