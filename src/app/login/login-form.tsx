"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { ErrorBanner, Field, TextInput } from "@/components/ui";

/**
 * N'autorise que les chemins relatifs internes à l'application pour la
 * redirection post-connexion : un `?next=` forgé (URL absolue,
 * protocol-relative `//`, `/\`...) ne doit jamais pouvoir rediriger l'agent
 * hors du domaine JUSTICIA (open redirect).
 */
function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricule, password }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };
        setError(body.message ?? "Identifiants invalides.");
        return;
      }

      router.replace(safeNextPath(searchParams.get("next")));
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <Field label="Matricule" htmlFor="matricule">
        <TextInput
          id="matricule"
          name="matricule"
          type="text"
          autoComplete="username"
          required
          autoFocus
          value={matricule}
          onChange={(event) => setMatricule(event.target.value)}
        />
      </Field>

      <Field label="Mot de passe" htmlFor="password">
        <TextInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>

      <ErrorBanner message={error ?? undefined} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-seal px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-seal-strong disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
