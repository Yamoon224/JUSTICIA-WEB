"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton({ reduit = false }: { reduit?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout(): Promise<void> {
    setIsSubmitting(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      title={reduit ? "Se déconnecter" : undefined}
      className={`flex w-full items-center gap-3 rounded-lg text-sm font-medium text-ink-soft transition-colors hover:bg-rust-tint hover:text-rust disabled:opacity-50 ${
        reduit ? "justify-center p-2.5" : "px-3 py-2"
      }`}
    >
      <LogOut size={17} strokeWidth={1.75} className="shrink-0" />
      {!reduit && (isSubmitting ? "Déconnexion..." : "Se déconnecter")}
    </button>
  );
}
