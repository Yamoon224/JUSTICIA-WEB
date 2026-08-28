"use client";

import { Moon, Sun } from "lucide-react";

import { appliquerTheme, useEstSombre } from "@/lib/theme";

/**
 * Bouton de bascule clair/sombre. Sans préférence enregistrée, l'interface
 * suit le thème du système (voir globals.css) ; un clic ici fixe un choix
 * explicite, mémorisé pour les visites suivantes. Réglage plus fin (dont le
 * retour au thème système) disponible dans Paramètres.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const estSombre = useEstSombre();

  function basculer() {
    appliquerTheme(estSombre ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={estSombre ? "Passer au thème clair" : "Passer au thème sombre"}
      title={estSombre ? "Thème clair" : "Thème sombre"}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-sunken hover:text-ink ${className}`}
    >
      {estSombre ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
    </button>
  );
}
