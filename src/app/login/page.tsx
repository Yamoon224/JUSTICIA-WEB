import { Suspense } from "react";

import { SealMark } from "@/components/seal-mark";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Connexion — JUSTICIA",
};

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_-10%,var(--seal-tint)_0%,transparent_55%)] opacity-70"
      />

      <div className="relative flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <SealMark className="h-12 w-12 text-seal" />
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-medium tracking-tight text-ink">JUSTICIA</h1>
            <p className="text-sm text-ink-soft">
              Système de gestion de la chaîne pénale — accès réservé aux agents habilités.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper-raised p-6 shadow-[var(--shadow-card)] sm:p-7">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-ink-faint">
          Toute connexion est journalisée et horodatée (§8 du cahier des charges).
        </p>
      </div>
    </div>
  );
}
