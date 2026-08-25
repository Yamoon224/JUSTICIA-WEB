/**
 * Registre des modules métier (§6 du cahier des charges), chacun porté par
 * un dossier features/<slug> à responsabilité unique (§10.2). Sert à piloter
 * l'affichage du tableau de bord selon les permissions de l'agent connecté
 * — le frontend n'y décide jamais d'une règle juridique, il affiche
 * seulement ce que le backend autorise (§10.2 : « le frontend affiche, le
 * backend décide »).
 */
export interface ModuleDescriptor {
  slug: string;
  label: string;
  description: string;
  /** Une seule de ces permissions suffit à rendre le module visible. */
  permissions: string[];
  /** Absent tant que le module n'a pas encore d'interface (§10.2). */
  href?: string;
}

export const MODULES: ModuleDescriptor[] = [
  {
    slug: "garde-a-vue",
    label: "Interpellation & garde à vue",
    description: "Registre de garde à vue, délais légaux, actes durant la mesure.",
    permissions: ["gav.gerer"],
    href: "/affaires",
  },
  {
    slug: "identification",
    label: "Identification des personnes",
    description: "Fichier central des personnes mises en cause, statuts par affaire.",
    permissions: ["personnes.gerer", "personnes.consulter"],
    href: "/personnes",
  },
  {
    slug: "affaires",
    label: "Affaires & procès-verbaux",
    description: "Dossiers d'affaire, procès-verbaux, pièces et scellés.",
    permissions: ["affaires.gerer", "affaires.consulter"],
    href: "/affaires",
  },
  {
    slug: "parquet",
    label: "Parquet",
    description: "Orientation des poursuites, déferrements, réquisitions.",
    permissions: ["parquet.gerer"],
  },
  {
    slug: "instruction",
    label: "Instruction",
    description: "Dossiers d'information, mandats, détention provisoire.",
    permissions: ["instruction.gerer"],
  },
  {
    slug: "audiencement",
    label: "Audiencement & jugement",
    description: "Rôle d'audience, décisions, minutes, voies de recours.",
    permissions: ["audiencement.gerer"],
  },
  {
    slug: "execution",
    label: "Exécution des peines",
    description: "Registre d'écrou, situations pénales, aménagements de peine.",
    permissions: ["execution.gerer"],
  },
  {
    slug: "casier",
    label: "Casier judiciaire",
    description: "Bulletins B1/B2/B3, réhabilitation, contrôle des accès.",
    permissions: ["casier.gerer", "casier.consulter_nominatif"],
  },
  {
    slug: "statistiques",
    label: "Statistiques & pilotage",
    description: "Tableaux de bord par juridiction, statistiques nationales.",
    permissions: ["statistiques.consulter"],
  },
  {
    slug: "administration",
    label: "Administration",
    description: "Référentiels, paramétrage des délais, habilitations.",
    permissions: ["administration.gerer", "habilitations.gerer"],
  },
];
