import { NextResponse } from "next/server";

import { getSessionToken } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// Reflète les types acceptés au versement (VerserDocumentPersonneRequest et
// consorts, côté Laravel) : une seconde barrière, indépendante de la
// validation backend, avant de renvoyer quoi que ce soit au navigateur sur
// l'origine de première partie (celle du cookie de session).
const MIME_AUTORISES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

/**
 * Proxie le téléchargement d'une pièce versée (§6.2, §6.3, §6.4) vers l'API
 * Laravel : le navigateur n'appelle jamais directement le backend (BFF,
 * §8 — voir src/lib/api/backend.ts) et ne voit jamais le jeton Sanctum. Le
 * corps binaire n'est ni parsé ni journalisé ici — seule l'API Laravel
 * connaît son contenu et journalise la consultation (RecupererDocumentAction).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  const motif = new URL(request.url).searchParams.get("motif");
  const query = motif ? `?motif=${encodeURIComponent(motif)}` : "";

  const response = await fetch(`${BACKEND_URL}/api/v1/documents/${id}${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Impossible de récupérer cette pièce." }, { status: response.status });
  }

  const mimeType = response.headers.get("content-type") ?? "application/octet-stream";
  if (!MIME_AUTORISES.has(mimeType)) {
    return NextResponse.json({ message: "Type de fichier non autorisé." }, { status: 415 });
  }

  const contenu = await response.arrayBuffer();
  const headers = new Headers();
  headers.set("Content-Type", mimeType);
  // Empêche le navigateur de réinterpréter le contenu contre le type
  // déclaré (attaque par confusion MIME) : sans cet en-tête, un fichier
  // reconnu "image/jpeg" mais contenant du HTML/SVG pourrait être exécuté
  // dans le contexte de l'application (XSS sur une origine de première
  // partie, cookie de session inclus).
  headers.set("X-Content-Type-Options", "nosniff");
  // Les images restent affichables en ligne (aperçu photo, §6.2/§6.4) ; tout
  // le reste (PDF) est forcé en téléchargement — surface d'exécution plus
  // large historiquement (actions JS embarquées) pour un bénéfice d'aperçu
  // marginal ici.
  const nomFichier = response.headers.get("content-disposition")?.match(/filename="([^"]*)"/)?.[1];
  const disposition = mimeType.startsWith("image/") ? "inline" : "attachment";
  headers.set("Content-Disposition", nomFichier ? `${disposition}; filename="${nomFichier}"` : disposition);

  return new NextResponse(contenu, { status: 200, headers });
}
