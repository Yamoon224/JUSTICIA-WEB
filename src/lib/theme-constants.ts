/**
 * Constantes partagées entre code serveur (app/layout.tsx, lecture via
 * next/headers) et code client (lib/theme.ts). Volontairement dans un
 * fichier sans "use client" : un export de simple valeur (pas un composant)
 * depuis un module "use client" ne se résout pas correctement quand il est
 * importé par un Server Component — next/headers y lisait toujours
 * `undefined` malgré un cookie bien présent.
 */
export type ThemePreference = "light" | "dark" | "system";
export type ThemeExplicite = "light" | "dark";

export const COOKIE_THEME = "justicia-theme";
