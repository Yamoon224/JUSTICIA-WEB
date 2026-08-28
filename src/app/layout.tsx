import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Public_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import { COOKIE_THEME, type ThemeExplicite } from "@/lib/theme-constants";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "JUSTICIA",
  description: "Système de gestion de la chaîne pénale",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Thème lu côté serveur (cookie posé par appliquerTheme(), voir lib/theme.ts)
  // et appliqué directement dans le HTML généré : pas de script d'initialisation
  // avant hydratation, donc pas de flash du mauvais thème ni de <script> rendu
  // par un composant (voir le commentaire dans lib/theme.ts).
  const valeurCookie = (await cookies()).get(COOKIE_THEME)?.value;
  const theme: ThemeExplicite | undefined = valeurCookie === "light" || valeurCookie === "dark" ? valeurCookie : undefined;

  return (
    <html
      lang="fr"
      data-theme={theme}
      className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
