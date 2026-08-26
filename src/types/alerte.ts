/**
 * Reflète App\Http\Resources\AlerteResource (§6.1, §6.11).
 */
export interface Alerte {
  id: number;
  type: string;
  niveau: "information" | "avertissement" | "depassement";
  message: string;
  lue: boolean;
  lue_at: string | null;
  created_at: string;
}

export interface AlerteListePage {
  data: Alerte[];
  meta: { current_page: number; last_page: number; total: number };
}
