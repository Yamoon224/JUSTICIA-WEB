/**
 * Convertit le HTML produit par <RichTextArea> (rich-text-editor.tsx) en
 * texte brut à une ligne, pour les vues en liste (carte compacte) où seule
 * la mise en forme du détail complet a du sens — la carte de liste garde un
 * simple extrait, le détail affiche <RichText> en entier.
 */
export function htmlVersExtrait(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/<\/(p|li|div|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
