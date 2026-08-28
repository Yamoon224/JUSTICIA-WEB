import { FolderPlus, Gavel, Scale, ShieldQuestion } from "lucide-react";

import { RichTextArea } from "@/components/rich-text-editor";
import { Card, ErrorBanner, Field, PageHeader, SubmitButton, TextInput } from "@/components/ui";
import { actionOuvrirAffaire } from "@/features/affaires/actions";
import { listerInfractions, type InfractionReferentiel } from "@/lib/api/referentiels";

export const metadata = { title: "Nouvelle affaire — JUSTICIA" };

const LIBELLES_CATEGORIE: Record<InfractionReferentiel["categorie"], string> = {
  contravention: "Contraventions",
  delit: "Délits",
  crime: "Crimes",
};

const ORDRE_CATEGORIES: InfractionReferentiel["categorie"][] = ["contravention", "delit", "crime"];

const ETAPES = [
  { titre: "Ouverture", description: "Un numéro d'affaire unique est attribué automatiquement dans votre ressort." },
  { titre: "Transmission au parquet", description: "Le dossier part vers le bureau des arrivées pour affectation à un magistrat." },
  { titre: "Orientation", description: "Classement, poursuites ou ouverture d'une information — décision toujours humaine." },
];

export default async function NouvelleAffairePage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const infractions = await listerInfractions();

  const infractionsParCategorie = ORDRE_CATEGORIES.map((categorie) => ({
    categorie,
    infractions: infractions.filter((infraction) => infraction.categorie === categorie),
  })).filter((groupe) => groupe.infractions.length > 0);

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        eyebrow="Chaîne pénale"
        title="Ouvrir une affaire"
        description="Numéro unique attribué automatiquement dans votre ressort."
      />

      <ErrorBanner message={erreur} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <Card title="Détails de l'affaire" description="Les champs peuvent être complétés ou corrigés après ouverture.">
          <form action={actionOuvrirAffaire} className="flex flex-col gap-5">
            <Field label="Description" htmlFor="description" hint="Facultatif">
              <RichTextArea id="description" name="description" rows={4} placeholder="Ex. Vol avec effraction au préjudice de M. Kouassi." />
            </Field>

            <Field label="Date d'ouverture" htmlFor="date_ouverture" hint="Aujourd'hui si laissé vide">
              <TextInput id="date_ouverture" name="date_ouverture" type="date" className="sm:w-56" />
            </Field>

            <Field label="Infractions retenues" htmlFor="infractions" hint="Facultatif, modifiable ensuite">
              {infractionsParCategorie.length > 0 ? (
                <div className="scroll-slim flex max-h-80 flex-col gap-4 overflow-y-auto rounded-xl border border-line bg-paper-sunken/40 p-4">
                  {infractionsParCategorie.map(({ categorie, infractions: infractionsDuGroupe }) => (
                    <fieldset key={categorie} className="flex flex-col gap-2">
                      <legend className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        {LIBELLES_CATEGORIE[categorie]}
                      </legend>
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {infractionsDuGroupe.map((infraction) => (
                          <label
                            key={infraction.id}
                            className="flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-ink transition-colors hover:bg-paper-raised"
                          >
                            <input
                              type="checkbox"
                              name="infractions"
                              value={infraction.id}
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong text-seal accent-seal focus:ring-2 focus:ring-seal/30"
                            />
                            {infraction.libelle}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-faint">Aucune infraction référencée.</p>
              )}
            </Field>

            <SubmitButton>
              <FolderPlus size={16} />
              Ouvrir l&apos;affaire
            </SubmitButton>
          </form>
        </Card>

        <div className="flex flex-col gap-4">
          <Card title="Après l'ouverture">
            <ol className="flex flex-col gap-4">
              {ETAPES.map((etape, index) => (
                <li key={etape.titre} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-seal-tint font-mono text-xs font-medium text-seal-strong">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-ink">{etape.titre}</span>
                    <span className="text-xs text-ink-soft">{etape.description}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-tint text-gold">
                <ShieldQuestion size={17} strokeWidth={1.75} />
              </span>
              <p className="text-sm text-ink-soft">
                Les infractions et la description restent modifiables depuis la fiche de l&apos;affaire tant que le
                dossier n&apos;a pas été transmis au parquet.
              </p>
            </div>
          </Card>

          <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper-raised p-5 text-sm text-ink-soft shadow-[var(--shadow-card)]">
            <Gavel size={16} className="shrink-0 text-ink-faint" />
            <Scale size={16} className="shrink-0 text-ink-faint" />
            <span>Chaque affaire ouverte est journalisée et horodatée dès sa création.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
