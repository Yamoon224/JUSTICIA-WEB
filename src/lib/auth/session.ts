import "server-only";

import { cookies } from "next/headers";

/**
 * Le frontend NextJS agit en BFF (Backend For Frontend) : il ne stocke
 * jamais le jeton d'accès Sanctum côté client (localStorage, JS lisible),
 * mais dans un cookie httpOnly posé sur son propre domaine — cohérent avec
 * l'exigence d'authentification forte du cahier des charges (§8). Les
 * requêtes vers l'API Laravel ne sont émises que depuis le serveur NextJS.
 */
const SESSION_COOKIE = "justicia_session";

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Aligné sur la durée de vie du token personnel Sanctum côté API.
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSessionToken(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
