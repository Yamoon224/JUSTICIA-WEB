/**
 * Reflète App\Http\Resources\DocumentResource (§6.2, §6.3, §6.4, §9) : une
 * pièce versée au dossier (photo, pièce d'identité, pièce d'affaire cotée,
 * photo de scellé). Le contenu lui-même ne transite jamais par cette
 * structure — voir /api/documents/[id] pour le téléchargement.
 */
export interface PieceVersee {
  id: number;
  categorie: string;
  cote: number | null;
  nom_original: string;
  mime_type: string;
  taille_octets: number;
  hash_integrite: string;
  verse_par: number;
  created_at: string;
}
