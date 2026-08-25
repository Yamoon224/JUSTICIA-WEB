import Link from "next/link";

import { rechercherPersonnes } from "@/lib/api/personnes";

export const metadata = { title: "Personnes — JUSTICIA" };

export default async function PersonnesPage({
  searchParams,
}: {
  searchParams: Promise<{ nom?: string; prenom?: string }>;
}) {
  const { nom, prenom } = await searchParams;
  const resultats = await rechercherPersonnes({ nom, prenom });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Identification des personnes</h1>
          <p className="text-sm text-zinc-500">Fichier central des personnes mises en cause (§6.2).</p>
        </div>
        <Link
          href="/personnes/nouvelle"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Nouvelle fiche
        </Link>
      </div>

      <form method="get" className="flex flex-wrap gap-3">
        <input
          type="text"
          name="nom"
          defaultValue={nom}
          placeholder="Nom"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          name="prenom"
          defaultValue={prenom}
          placeholder="Prénom"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100">
          Rechercher
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-2">Identifiant</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Naissance</th>
            </tr>
          </thead>
          <tbody>
            {resultats.data.map((personne) => (
              <tr key={personne.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-2 font-mono text-xs text-zinc-500">{personne.identifiant_unique.slice(0, 8)}</td>
                <td className="px-4 py-2">
                  <Link href={`/personnes/${personne.id}`} className="font-medium text-zinc-900 hover:underline">
                    {personne.nom_affichage || "—"}
                  </Link>
                </td>
                <td className="px-4 py-2 text-zinc-500">{personne.type}</td>
                <td className="px-4 py-2 text-zinc-500">{personne.date_naissance ?? "—"}</td>
              </tr>
            ))}

            {resultats.data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                  Aucune personne trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
