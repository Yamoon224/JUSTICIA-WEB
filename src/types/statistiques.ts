/**
 * Reflète App\Domain\Statistiques\Actions\GenererTableauDeBordAction
 * (§6.11-6.12) : un instantané agrégé, jamais un état à modifier — ce
 * module n'expose aucune action d'écriture.
 */
export interface TableauDeBord {
  ressort_id: number | null;
  affaires: {
    total: number;
    par_statut: Record<string, number>;
  };
  garde_a_vue: {
    en_cours: number;
    echeances_depassees: number;
  };
  parquet: {
    en_attente_orientation: number;
    orientations_par_type: Record<string, number>;
  };
  instruction: {
    dossiers_ouverts: number;
    detention_provisoire_en_cours: number;
    detention_provisoire_echeances_depassees: number;
  };
  audiencement: {
    a_enroler: number;
    enrole: number;
    jugee: number;
  };
  execution: {
    dossiers_en_cours: number;
    ecroues_en_detention: number;
    echeances_liberation_depassees: number;
  };
  casier: {
    total: number;
    actives: number;
    rehabilitees: number;
    amnistiees: number;
  };
  delais_moyens_jours: {
    garde_a_vue_heures: number | null;
    instruction_jours: number | null;
    jugement_jours: number | null;
  };
}
