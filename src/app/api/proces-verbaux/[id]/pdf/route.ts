import { NextResponse } from "next/server";

import { getSessionToken } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

/**
 * Proxie l'édition PDF d'un procès-verbal (§6.3, §9) — même principe BFF que
 * /api/documents/[id] : le navigateur ne parle jamais directement à Laravel.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  // Cf. /api/documents/[id] : un `%2F` encodé dans la requête survit décodé
  // en `/` littéral dans `id`, ce qui permettrait de faire sortir la requête
  // sortante (avec le jeton Sanctum du BFF) de `/api/v1/proces-verbaux/{id}`.
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ message: "Identifiant invalide." }, { status: 400 });
  }

  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/api/v1/proces-verbaux/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Impossible de générer ce PDF." }, { status: response.status });
  }

  // Le backend n'édite que des PDF sur cette route — pas d'allowlist à
  // vérifier ici, à la différence de /api/documents/[id] qui relaie un
  // fichier versé par un agent (type potentiellement inattendu).
  const contenu = await response.arrayBuffer();
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("X-Content-Type-Options", "nosniff");
  const disposition = response.headers.get("content-disposition");
  if (disposition) {
    headers.set("Content-Disposition", disposition);
  }

  return new NextResponse(contenu, { status: 200, headers });
}
