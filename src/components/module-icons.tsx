import {
  BarChart3,
  Bell,
  BookLock,
  FileSearch,
  Fingerprint,
  FolderOpen,
  Gavel,
  Landmark,
  Scale,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

import type { ModuleIconKey } from "@/features/modules";

export const MODULE_ICONS: Record<ModuleIconKey, LucideIcon> = {
  alertes: Bell,
  "garde-a-vue": ShieldAlert,
  identification: Fingerprint,
  affaires: FolderOpen,
  parquet: Scale,
  instruction: FileSearch,
  audiencement: Gavel,
  execution: Landmark,
  casier: BookLock,
  statistiques: BarChart3,
  administration: Settings,
};
