"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

import { fieldBase } from "@/components/ui";

/** Champ mot de passe avec bascule d'affichage en clair (icône œil). */
export function PasswordInput({ className = "", id, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const identifiantGenere = useId();
  const identifiant = id ?? identifiantGenere;

  return (
    <div className="relative">
      <input {...props} id={identifiant} type={visible ? "text" : "password"} className={`${fieldBase} pr-10 ${className}`} />
      <button
        type="button"
        onClick={() => setVisible((valeur) => !valeur)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-faint transition-colors hover:text-ink-soft"
      >
        {visible ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
      </button>
    </div>
  );
}
