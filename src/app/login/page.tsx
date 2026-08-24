import { Suspense } from "react";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Connexion — JUSTICIA",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">JUSTICIA</h1>
        <p className="text-sm text-zinc-500">
          Système de gestion de la chaîne pénale — accès réservé aux agents habilités.
        </p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
