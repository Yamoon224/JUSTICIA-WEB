"use client";

import { useSyncExternalStore } from "react";

import { COOKIE_THEME, type ThemeExplicite, type ThemePreference } from "@/lib/theme-constants";

/**
 * État partagé de la préférence de thème (voir theme-toggle.tsx et la page
 * Paramètres). `null`/`"system"` signifie : suivre `prefers-color-scheme`
 * (globals.css) ; un choix explicite pose `data-theme` sur <html>, qui prime
 * dans les deux sens (voir le commentaire dans globals.css).
 *
 * Mémorisé dans un cookie (pas localStorage) : app/layout.tsx le lit côté
 * serveur (next/headers) pour poser `data-theme` directement dans le HTML
 * généré, sans script d'initialisation avant hydratation. Ça évite à la
 * fois le flash du mauvais thème et l'avertissement React sur les balises
 * <script> rendues par un composant (next/script en stratégie
 * beforeInteractive en émet une pour les scripts en ligne, contournement
 * inutile puisque le serveur peut connaître le thème directement).
 *
 * Le nom du cookie (COOKIE_THEME) vit dans theme-constants.ts, un module
 * sans "use client" : un export de valeur depuis un module "use client" ne
 * se résout pas de façon fiable quand il est importé par un Server
 * Component (next/headers y lisait `undefined` malgré un cookie présent).
 */
export type { ThemeExplicite, ThemePreference };

const EVENEMENT_THEME = "justicia-theme-changed";
const UN_AN_EN_SECONDES = 60 * 60 * 24 * 365;

function lireCookie(nom: string): string | null {
  if (typeof document === "undefined") return null;
  const correspondance = document.cookie.match(new RegExp(`(?:^|; )${nom}=([^;]*)`));
  return correspondance ? decodeURIComponent(correspondance[1]) : null;
}

export function lireThemeStocke(): ThemeExplicite | null {
  const valeur = lireCookie(COOKIE_THEME);
  return valeur === "light" || valeur === "dark" ? valeur : null;
}

export function lireThemeServeur(): ThemeExplicite | null {
  return null;
}

export function souscrireTheme(notifier: () => void): () => void {
  window.addEventListener(EVENEMENT_THEME, notifier);
  return () => window.removeEventListener(EVENEMENT_THEME, notifier);
}

export function appliquerTheme(preference: ThemePreference): void {
  if (preference === "system") {
    document.documentElement.removeAttribute("data-theme");
    document.cookie = `${COOKIE_THEME}=; path=/; max-age=0; SameSite=Lax`;
  } else {
    document.documentElement.setAttribute("data-theme", preference);
    document.cookie = `${COOKIE_THEME}=${preference}; path=/; max-age=${UN_AN_EN_SECONDES}; SameSite=Lax`;
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
