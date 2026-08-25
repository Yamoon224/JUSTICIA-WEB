import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:bg-zinc-100";

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
    >
      {children}
    </button>
  );
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      {title && <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>}
      {children}
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>;
}

export function Badge({ tone = "zinc", children }: { tone?: "zinc" | "green" | "amber" | "red"; children: ReactNode }) {
  const tones: Record<string, string> = {
    zinc: "bg-zinc-100 text-zinc-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
