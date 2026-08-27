import { NextResponse } from "next/server";

import { getSessionToken } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

/**
 * Proxie l'édition sécurisée d'un bulletin du casier (§6.10, §9) — même
 * principe BFF que /api/documents/[id]. `type` et `motif` sont revalidés
 * côté Laravel (GenererBulletinRequest) ; cette route ne fait que relayer.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  // Cf. /api/documents/[id] : un `%2F` encodé dans la requête survit décodé
  // en `/` littéral dans `id`, ce qui permettrait de faire sortir la requête
  // sortante (avec le jeton Sanctum du BFF) de `/api/v1/casier/personnes/{id}`.
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ message: "Identifiant invalide." }, { status: 400 });
  }

  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const query = new URLSearchParams({
    type: searchParams.get("type") ?? "",
    motif: searchParams.get("motif") ?? "",
  }).toString();

  const response = await fetch(`${BACKEND_URL}/api/v1/casier/personnes/${id}/bulletin/pdf?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    return NextResponse.json({ message: body?.message ?? "Impossible de générer ce bulletin." }, { status: response.status });
  }

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
