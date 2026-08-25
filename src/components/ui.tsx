import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import Link from "next/link";

/**
 * Primitives partagées du système « registre & sceau » (voir globals.css).
 * Chaque enregistrement officiel (affaire, personne, PV, scellé, mesure)
 * utilise <RecordCard> — liseré de 3px couleur sceau — pour se distinguer
 * visuellement d'un simple bloc de contenu (<Card>).
 */

const fieldBase =
  "w-full rounded-lg border border-line bg-paper-raised px-3.5 py-2.5 text-[0.9rem] text-ink placeholder:text-ink-faint shadow-sm transition-colors focus:border-seal focus:outline-none focus:ring-2 focus:ring-seal/15 disabled:cursor-not-allowed disabled:bg-paper-sunken disabled:text-ink-faint";

export function Label({ children, htmlFor, hint }: { children: ReactNode; htmlFor: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-[0.8rem] font-medium tracking-wide text-ink-soft">
        {children}
      </label>
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} hint={hint}>
        {label}
      </Label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldBase} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldBase} resize-y ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${fieldBase} bg-[image:linear-gradient(45deg,transparent_50%,var(--ink-faint)_50%),linear-gradient(135deg,var(--ink-faint)_50%,transparent_50%)] bg-[position:calc(100%-1.15rem)_center,calc(100%-0.8rem)_center] bg-[size:5px_5px,5px_5px] bg-no-repeat pr-8 ${props.className ?? ""}`}
    />
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-seal text-white shadow-sm hover:bg-seal-strong active:bg-seal-strong",
  secondary: "border border-line-strong bg-paper-raised text-ink hover:border-seal/40 hover:text-seal",
  ghost: "text-ink-soft hover:bg-paper-sunken hover:text-ink",
  danger: "border border-rust/30 bg-rust-tint text-rust hover:border-rust/60",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex w-fit items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
    />
  );
}

export function SubmitButton({ children, variant = "primary" }: { children: ReactNode; variant?: ButtonVariant }) {
  return (
    <Button type="submit" variant={variant} className="self-start">
      {children}
    </Button>
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: ButtonVariant }) {
  return (
    <Link
      {...props}
      className={`inline-flex w-fit items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${buttonVariants[variant]} ${className}`}
    />
  );
}

/** Bloc de contenu neutre : sections d'une page, regroupements de formulaire. */
export function Card({ title, description, actions, children }: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-paper-raised p-5 shadow-[var(--shadow-card)] sm:p-6">
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            {title && <h2 className="font-display text-lg font-medium text-ink">{title}</h2>}
            {description && <p className="text-sm text-ink-soft">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Enregistrement officiel — liseré de 3px couleur sceau. Réservé aux
 * entités qui constituent une pièce du dossier pénal (affaire, PV, scellé,
 * mesure, fiche personne) : la couleur du sceau signale « ceci fait foi ».
 */
export function RecordCard({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-paper-raised p-5 pl-[calc(1.25rem-1px)] shadow-[var(--shadow-card)] [border-left:3px_solid_var(--seal)] sm:p-6 sm:pl-[calc(1.5rem-1px)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {eyebrow && (
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">{eyebrow}</span>
          )}
          <div className="font-display text-lg font-medium text-ink">{title}</div>
        </div>
        {actions}
      </div>
      {children}
    </article>
  );
}

type Tone = "neutral" | "seal" | "gold" | "forest" | "rust";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-paper-sunken text-ink-soft",
  seal: "bg-seal-tint text-seal-strong",
  gold: "bg-gold-tint text-gold",
  forest: "bg-forest-tint text-forest",
  rust: "bg-rust-tint text-rust",
};

/** Étiquette « tampon » : capitales espacées, fond teinté, jamais de bordure lourde. */
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.05em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-lg border border-rust/25 bg-rust-tint px-4 py-3 text-sm text-rust" role="alert">
      {message}
    </p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.1em] text-seal">{eyebrow}</span>}
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-paper-sunken/60 px-4 py-8 text-center text-sm text-ink-faint">
      {message}
    </div>
  );
}

export function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-[0.85em] tracking-tight ${className}`}>{children}</span>;
}
