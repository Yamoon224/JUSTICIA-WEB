import { FileText, Image as ImageIcon, Upload } from "lucide-react";

import { Field, Mono, Select, SubmitButton } from "@/components/ui";
import type { PieceVersee } from "@/types/document";

/**
 * Composant partagé (§6.2, §6.3, §6.4) : une pièce versée se rattache aussi
 * bien à une personne (photo, pièce d'identité) qu'à une affaire (pièce
 * cotée) ou un scellé (photo) — la présentation et le formulaire de
 * versement sont donc communs, pas dupliqués par module (§10.2).
 */

function formaterTaille(octets: number): string {
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${(octets / 1024).toFixed(0)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ListePiecesVersees({ documents }: { documents?: PieceVersee[] }) {
  if (!documents?.length) {
    return <p className="text-sm text-ink-faint">Aucune pièce versée.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-line">
      {documents.map((document) => (
        <li key={document.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
          <a
            href={`/api/documents/${document.id}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink hover:text-seal"
          >
            {document.mime_type.startsWith("image/") ? (
              <ImageIcon size={15} className="shrink-0 text-ink-faint" />
            ) : (
              <FileText size={15} className="shrink-0 text-ink-faint" />
            )}
            {document.cote !== null && <Mono className="shrink-0 text-ink-faint">#{document.cote}</Mono>}
            <span className="truncate">{document.nom_original}</span>
          </a>
          <span className="shrink-0 text-xs text-ink-faint">{formaterTaille(document.taille_octets)}</span>
        </li>
      ))}
    </ul>
  );
}

const CATEGORIES: Record<string, { value: string; label: string }[] | undefined> = {
  personne: [
    { value: "photo", label: "Photo" },
    { value: "piece_identite", label: "Pièce d'identité" },
  ],
};

export function FormulaireVersementPiece({
  action,
  champsCaches,
  categorie,
  idPrefix,
}: {
  action: (formData: FormData) => void | Promise<void>;
  champsCaches: Record<string, string | number>;
  /** "personne" propose un choix de catégorie ; omis pour affaire/scellé (fixée côté API). */
  categorie?: keyof typeof CATEGORIES;
  /** Distingue les id du DOM quand plusieurs formulaires apparaissent sur une même page (ex. un par scellé). */
  idPrefix: string;
}) {
  const options = categorie ? CATEGORIES[categorie] : undefined;

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      {Object.entries(champsCaches).map(([nom, valeur]) => (
        <input key={nom} type="hidden" name={nom} value={valeur} />
      ))}

      {options && (
        <Field label="Catégorie" htmlFor={`${idPrefix}-categorie`}>
          <Select id={`${idPrefix}-categorie`} name="categorie" required className="w-44">
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field label="Fichier" htmlFor={`${idPrefix}-fichier`} hint="jpg, png, webp ou pdf — 15 Mo max">
        <input
          id={`${idPrefix}-fichier`}
          name="fichier"
          type="file"
          required
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          className="text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-paper-sunken file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-line"
        />
      </Field>

      <SubmitButton variant="secondary">
        <Upload size={15} />
        Verser
      </SubmitButton>
    </form>
  );
}
