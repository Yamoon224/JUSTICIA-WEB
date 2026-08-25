/**
 * Emblème de la marque : un sceau circulaire simplifié plutôt qu'un logo
 * générique — cohérent avec le vocabulaire visuel « registre & sceau »
 * du système (voir globals.css).
 */
export function SealMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="14.5" stroke="currentColor" strokeWidth="1" strokeDasharray="1.4 3.2" />
      <path
        d="M13 15.5 20 12l7 3.5v6.2c0 4.3-3 7.6-7 8.8-4-1.2-7-4.5-7-8.8v-6.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M16.6 20.2 19 22.6l4.6-5.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
