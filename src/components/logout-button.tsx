"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

/** Logique de déconnexion partagée entre LogoutButton et le menu du profil. */
export function useLogout(): { deconnecter: () => Promise<void>; enCours: boolean } {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function deconnecter(): Promise<void> {
    setEnCours(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  return { deconnecter, enCours };
}

export function LogoutButton({ reduit = false }: { reduit?: boolean }) {
  const { deconnecter, enCours } = useLogout();

  return (
    <button
      type="button"
      onClick={deconnecter}
      disabled={enCours}
      title={reduit ? "Se déconnecter" : undefined}
      className={`flex w-full items-center gap-3 rounded-lg text-sm font-medium text-ink-soft transition-colors hover:bg-rust-tint hover:text-rust disabled:opacity-50 ${
        reduit ? "justify-center p-2.5" : "px-3 py-2"
      }`}
    >
      <LogOut size={17} strokeWidth={1.75} className="shrink-0" />
      {!reduit && (enCours ? "Déconnexion..." : "Se déconnecter")}
    </button>
  );
}
