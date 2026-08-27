"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const CLE_STOCKAGE = "justicia-theme";
// `storage` ne se déclenche que dans les autres onglets ; cet événement
// maison permet à l'onglet qui vient de basculer de se resynchroniser aussi.
const EVENEMENT_CHANGEMENT = "justicia-theme-changed";

function souscrire(notifier: () => void): () => void {
  window.addEventListener("storage", notifier);
  window.addEventListener(EVENEMENT_CHANGEMENT, notifier);
  return () => {
    window.removeEventListener("storage", notifier);
    window.removeEventListener(EVENEMENT_CHANGEMENT, notifier);
  };
}

function lireTheme(): Theme | null {
  try {
    const valeur = localStorage.getItem(CLE_STOCKAGE);
    return valeur === "light" || valeur === "dark" ? valeur : null;
  } catch {
    return null;
  }
}

function lireThemeServeur(): Theme | null {
  return null;
}

function systemeEstSombre(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Bouton de bascule clair/sombre. Sans préférence enregistrée, l'interface
 * suit le thème du système (voir globals.css) ; un clic ici fixe un choix
 * explicite, mémorisé pour les visites suivantes.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(souscrire, lireTheme, lireThemeServeur);
  const estSombre = theme === "dark" || (theme === null && systemeEstSombre());

  function basculer() {
    const suivant: Theme = estSombre ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", suivant);
    try {
      localStorage.setItem(CLE_STOCKAGE, suivant);
    } catch {
      // Stockage indisponible (navigation privée, quotas atteints) : le
      // choix reste appliqué pour la session en cours sans être mémorisé.
    }
    window.dispatchEvent(new Event(EVENEMENT_CHANGEMENT));
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
