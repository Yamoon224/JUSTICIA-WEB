"use client";

import { useSyncExternalStore } from "react";

/**
 * État partagé de la préférence de thème (voir theme-toggle.tsx et la page
 * Paramètres). `null`/`"system"` signifie : suivre `prefers-color-scheme`
 * (globals.css) ; un choix explicite pose `data-theme` sur <html>, qui prime
 * dans les deux sens (voir le commentaire dans globals.css).
 *
 * `storage` ne se déclenche que dans les autres onglets ; l'événement
 * `justicia-theme-changed` permet à l'onglet qui vient de basculer de se
 * resynchroniser aussi (voir souscrireTheme).
 */
export type ThemePreference = "light" | "dark" | "system";
export type ThemeExplicite = "light" | "dark";

export const CLE_STOCKAGE_THEME = "justicia-theme";
export const EVENEMENT_THEME = "justicia-theme-changed";

export function lireThemeStocke(): ThemeExplicite | null {
  try {
    const valeur = localStorage.getItem(CLE_STOCKAGE_THEME);
    return valeur === "light" || valeur === "dark" ? valeur : null;
  } catch {
    return null;
  }
}

export function lireThemeServeur(): ThemeExplicite | null {
  return null;
}

export function souscrireTheme(notifier: () => void): () => void {
  window.addEventListener("storage", notifier);
  window.addEventListener(EVENEMENT_THEME, notifier);
  return () => {
    window.removeEventListener("storage", notifier);
    window.removeEventListener(EVENEMENT_THEME, notifier);
  };
}

export function appliquerTheme(preference: ThemePreference): void {
  if (preference === "system") {
    document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.removeItem(CLE_STOCKAGE_THEME);
    } catch {
      // Stockage indisponible : rien à nettoyer, le système reste la source de vérité.
    }
  } else {
    document.documentElement.setAttribute("data-theme", preference);
    try {
      localStorage.setItem(CLE_STOCKAGE_THEME, preference);
    } catch {
      // Stockage indisponible (navigation privée, quotas atteints) : le
      // choix reste appliqué pour la session en cours sans être mémorisé.
    }
  }
  window.dispatchEvent(new Event(EVENEMENT_THEME));
}

export function systemeEstSombre(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Hook partagé : le thème effectivement affiché est-il sombre ? (voir charts.tsx) */
export function useEstSombre(): boolean {
  const theme = useSyncExternalStore(souscrireTheme, lireThemeStocke, lireThemeServeur);
  return theme === "dark" || (theme === null && systemeEstSombre());
}
