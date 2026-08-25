import { redirect } from "next/navigation";

import { BackendApiError } from "@/lib/api/backend";

/**
 * Les Server Actions n'ont pas de canal de retour d'erreur simple sans
 * passer par useActionState (composant client). Plus simple ici : en cas
 * d'échec côté API, on redirige vers la même page avec le message en
 * paramètre `?erreur=`, affiché par un <ErrorBanner> côté page.
 */
export function redirectAvecErreur(chemin: string, error: unknown): never {
  const message = error instanceof BackendApiError ? error.message : "Une erreur inattendue est survenue.";
  redirect(`${chemin}?erreur=${encodeURIComponent(message)}`);
}
