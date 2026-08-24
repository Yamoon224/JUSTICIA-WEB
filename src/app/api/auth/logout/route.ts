import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";
import { clearSessionToken } from "@/lib/auth/session";

export async function POST(): Promise<NextResponse> {
  try {
    await backendFetch("/auth/logout", { method: "POST" });
  } finally {
    // Le cookie local est purgé même si l'appel API échoue (token déjà
    // expiré côté serveur, par exemple) : l'agent ne doit jamais rester
    // bloqué en session côté navigateur.
    await clearSessionToken();
  }

  return NextResponse.json(null, { status: 204 });
}
