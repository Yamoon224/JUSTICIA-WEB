import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Public_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

const SCRIPT_THEME_INITIAL = `(function(){try{var t=localStorage.getItem("justicia-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} h-full antialiased`}
      // Le script ci-dessous pose `data-theme` avant l'hydratation (pour éviter
      // un flash du mauvais thème) : cet attribut diffère donc volontairement
      // du HTML rendu côté serveur, qui ne connaît pas la préférence stockée.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        {/* Applique le thème choisi manuellement avant le premier rendu, pour éviter un flash du mauvais thème. */}
        <Script id="theme-initial" strategy="beforeInteractive">
          {SCRIPT_THEME_INITIAL}
        </Script>
        {children}
      </body>
    </html>
  );
}
