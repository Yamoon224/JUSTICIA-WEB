/**
 * Registre des modules métier (§6 du cahier des charges), chacun porté par
 * un dossier features/<slug> à responsabilité unique (§10.2). Sert à piloter
 * la navigation et le tableau de bord selon les permissions de l'agent
 * connecté — le frontend n'y décide jamais d'une règle juridique, il
 * affiche seulement ce que le backend autorise (§10.2 : « le frontend
 * affiche, le backend décide »).
 *
 * `icon` référence une clé de src/components/module-icons.tsx plutôt qu'un
 * composant : ce fichier reste un module de données pur, importable aussi
 * bien depuis un Server Component que depuis un Client Component.
 */
export type ModuleIconKey =
  | "garde-a-vue"
  | "identification"
  | "affaires"
  | "parquet"
  | "instruction"
  | "audiencement"
  | "execution"
  | "casier"
  | "statistiques"
  | "administration";

export interface ModuleDescriptor {
  slug: string;
  label: string;
  description: string;
  icon: ModuleIconKey;
  /** Une seule de ces permissions suffit à rendre le module visible. */
  permissions: string[];
  /**
   * Absent tant que le module n'a pas de page de destination propre (§10.2)
   * — la garde à vue, par exemple, se pilote depuis la fiche d'une affaire
   * et n'a pas encore de vue de synthèse dédiée.
   */
  href?: string;
  /** Info-bulle affichée quand `href` est absent. */
  navHint?: string;
}

export const MODULES: ModuleDescriptor[] = [
  {
    slug: "garde-a-vue",
    label: "Garde à vue",
    description: "Registre de garde à vue, délais légaux, actes durant la mesure.",
    icon: "garde-a-vue",
    permissions: ["gav.gerer"],
    navHint: "Se pilote depuis la fiche d'une affaire",
  },
  {
    slug: "identification",
    label: "Personnes",
    description: "Fichier central des personnes mises en cause, statuts par affaire.",
    icon: "identification",
    permissions: ["personnes.gerer", "personnes.consulter"],
    href: "/personnes",
  },
  {
    slug: "affaires",
    label: "Affaires",
    description: "Dossiers d'affaire, procès-verbaux, pièces et scellés.",
    icon: "affaires",
    permissions: ["affaires.gerer", "affaires.consulter"],
    href: "/affaires",
  },
  {
    slug: "parquet",
    label: "Parquet",
    description: "Orientation des poursuites, déferrements, réquisitions.",
    icon: "parquet",
    permissions: ["parquet.gerer"],
    href: "/parquet",
  },
  {
    slug: "instruction",
    label: "Instruction",
    description: "Dossiers d'information, mandats, détention provisoire.",
    icon: "instruction",
    permissions: ["instruction.gerer"],
    href: "/instruction",
  },
  {
    slug: "audiencement",
    label: "Audiencement",
    description: "Rôle d'audience, décisions, minutes, voies de recours.",
    icon: "audiencement",
    permissions: ["audiencement.gerer"],
    href: "/audiencement",
  },
  {
    slug: "execution",
    label: "Exécution des peines",
    description: "Registre d'écrou, situations pénales, aménagements de peine.",
    icon: "execution",
    permissions: ["execution.gerer"],
  },
  {
    slug: "casier",
    label: "Casier judiciaire",
    description: "Bulletins B1/B2/B3, réhabilitation, contrôle des accès.",
    icon: "casier",
    permissions: ["casier.gerer", "casier.consulter_nominatif"],
  },
  {
    slug: "statistiques",
    label: "Statistiques",
    description: "Tableaux de bord par juridiction, statistiques nationales.",
    icon: "statistiques",
    permissions: ["statistiques.consulter"],
  },
  {
    slug: "administration",
    label: "Administration",
    description: "Référentiels, paramétrage des délais, habilitations.",
    icon: "administration",
    permissions: ["administration.gerer", "habilitations.gerer"],
  },
];
