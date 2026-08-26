import "server-only";

import { getSessionToken } from "@/lib/auth/session";

/**
 * L'URL de l'API Laravel n'est jamais exposée au navigateur : elle n'est
 * lue que côté serveur NextJS (server components, route handlers).
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export class BackendApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = "BackendApiError";
  }
}

/**
 * Appelle l'API JUSTICIA (Laravel) depuis le serveur NextJS, en joignant
 * automatiquement le jeton d'accès de l'agent connecté le cas échéant.
 * Ne doit jamais être importé depuis un composant client (voir "server-only").
 */
export async function backendFetch<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = init;
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  // Un FormData (versement de pièce, §6.2/6.3/6.4) doit fixer lui-même son
  // Content-Type (multipart/form-data; boundary=...) — l'imposer ici casserait
  // le corps de la requête.
  if (rest.body && !requestHeaders.has("Content-Type") && !(rest.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = await getSessionToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${BACKEND_URL}/api/v1${path}`, {
    ...rest,
    headers: requestHeaders,
    cache: "no-store",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new BackendApiError(
      typeof body === "object" && body && "message" in body
        ? String((body as { message: unknown }).message)
        : `Échec de l'appel API JUSTICIA (${response.status}).`,
      response.status,
      body,
    );
  }

  return body as T;
}
