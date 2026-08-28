"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { ComponentType } from "react";

import {
  appliquerTheme,
  lireThemeServeur,
  lireThemeStocke,
  souscrireTheme,
  type ThemePreference,
} from "@/lib/theme";

const OPTIONS: { valeur: ThemePreference; label: string; description: string; icone: ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { valeur: "system", label: "Système", description: "Suit le réglage de votre appareil.", icone: Laptop },
  { valeur: "light", label: "Clair", description: "Fond blanc en permanence.", icone: Sun },
  { valeur: "dark", label: "Sombre", description: "Fond sombre en permanence.", icone: Moon },
];

/** Sélecteur de thème à trois positions, pour la page Paramètres. */
export function ThemeSettings() {
  const themeStocke = useSyncExternalStore(souscrireTheme, lireThemeStocke, lireThemeServeur);
  const preferenceActuelle: ThemePreference = themeStocke ?? "system";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {OPTIONS.map(({ valeur, label, description, icone: Icone }) => {
        const selectionne = preferenceActuelle === valeur;
        return (
          <button
            key={valeur}
            type="button"
            onClick={() => appliquerTheme(valeur)}
            aria-pressed={selectionne}
            className={`flex flex-col items-start gap-2 rounded-xl border px-4 py-3.5 text-left transition-colors ${
              selectionne
                ? "border-seal bg-seal-tint text-seal-strong shadow-sm"
                : "border-line bg-paper-raised text-ink hover:border-line-strong"
            }`}
          >
            <Icone size={18} strokeWidth={1.75} />
            <span className="text-sm font-medium">{label}</span>
            <span className={`text-xs ${selectionne ? "text-seal-strong/80" : "text-ink-faint"}`}>{description}</span>
          </button>
        );
      })}
    </div>
  );
}
