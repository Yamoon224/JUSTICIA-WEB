import { NextResponse } from "next/server";
import { z } from "zod";

import { BackendApiError, backendFetch } from "@/lib/api/backend";
import { setSessionToken } from "@/lib/auth/session";
import type { Agent } from "@/types/agent";

const LoginPayload = z.object({
  matricule: z.string().min(1, "Matricule requis."),
  password: z.string().min(1, "Mot de passe requis."),
});

/**
 * Relaie l'authentification vers POST /api/v1/auth/login (Laravel) puis pose
 * le jeton reçu dans un cookie httpOnly côté NextJS — le navigateur ne voit
 * jamais le jeton d'accès Sanctum lui-même (§8).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const payload = LoginPayload.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ message: payload.error.issues[0]?.message ?? "Requête invalide." }, { status: 422 });
  }

  try {
    const { token, agent } = await backendFetch<{ token: string; agent: Agent }>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ ...payload.data, device_name: "web" }),
    });

    await setSessionToken(token);

    return NextResponse.json({ agent });
  } catch (error) {
    if (error instanceof BackendApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
