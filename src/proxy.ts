import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Garde d'accès légère (§8 : authentification obligatoire) : vérifie la
 * seule présence du cookie de session avant de laisser passer une requête.
 * La validité réelle du jeton (actif, non expiré, habilitations) est
 * revérifiée côté serveur à chaque page via getCurrentAgent() — le proxy
 * n'est qu'un filtre de première ligne, jamais l'unique rempart.
 */
const SESSION_COOKIE = "justicia_session";
const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!hasSession && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
