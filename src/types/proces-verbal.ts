/**
 * Reflète App\Http\Resources\ProcesVerbalResource (§6.3).
 */
export interface ProcesVerbal {
  id: number;
  cote: string;
  type: "interpellation" | "audition" | "perquisition" | "constatation" | "rectificatif" | "autre";
  contenu: string;
  signe: boolean;
  signe_at: string | null;
  rectifie_par_pv_id: number | null;
}
