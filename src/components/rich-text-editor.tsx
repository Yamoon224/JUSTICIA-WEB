"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

/**
 * Éditeur de texte enrichi (façon traitement de texte : gras, italique,
 * listes, alignement) pour les champs qui accueillent un texte de fond
 * (contenu de PV, description, obligations...). Le schéma Tiptap/ProseMirror
 * n'autorise que ce jeu restreint de balises — pas d'image, pas de lien, pas
 * de HTML brut collé — mais ce n'est qu'un confort d'édition : cette
 * restriction ne s'applique qu'à qui passe par cette interface. La sécurité
 * réelle du HTML réaffiché ailleurs (<RichText> dans ui.tsx, PDF du PV) vient
 * du nettoyage appliqué côté back-end à l'écriture (TexteEnrichiSanitizer),
 * pas de ce composant.
 *
 * Soumis via un champ texte synchronisé (sr-only, pas `type="hidden"` pour
 * que `required` reste vérifié par le navigateur) afin de fonctionner avec
 * les <form action={...}> (Server Actions) existants, sans rien changer à
 * leur mécanique de soumission.
 */
export function RichTextArea({
  id,
  name,
  placeholder,
  required = false,
  rows = 4,
}: {
  id?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  const [html, setHtml] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      TextAlign.configure({ types: ["paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    editorProps: {
      attributes: {
        class: "rich-text-content focus:outline-none",
        style: `min-height: ${rows * 1.6}rem`,
      },
    },
    onUpdate: ({ editor }) => {
      const vide = editor.getText().trim().length === 0;
      setHtml(vide ? "" : editor.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper-raised shadow-sm transition-colors focus-within:border-seal focus-within:ring-2 focus-within:ring-seal/15">
      <BarreOutils editor={editor} />
      <EditorContent editor={editor} className="px-3.5 py-2.5 text-[0.9rem] text-ink" />
      <input
        type="text"
        id={id}
        name={name}
        value={html}
        onChange={() => {
          // Champ synchronisé en lecture seule fonctionnellement : la seule
          // source de vérité est l'éditeur (onUpdate ci-dessus).
        }}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
    </div>
  );
}

function BoutonBarreOutils({
  actif = false,
  disabled = false,
  onClick,
  label,
  children,
}: {
  actif?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={actif}
      className={`flex h-7 w-7 items-center justify-center rounded transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        actif ? "bg-seal-tint text-seal-strong" : "text-ink-soft hover:bg-paper-raised hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function BarreOutils({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return <div className="h-[38px] border-b border-line bg-paper-sunken/60" aria-hidden="true" />;
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-paper-sunken/60 px-2 py-1.5">
      <BoutonBarreOutils label="Gras" actif={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon size={15} />
      </BoutonBarreOutils>
      <BoutonBarreOutils label="Italique" actif={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon size={15} />
      </BoutonBarreOutils>
      <BoutonBarreOutils
        label="Souligné"
        actif={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={15} />
      </BoutonBarreOutils>
      <BoutonBarreOutils label="Barré" actif={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={15} />
      </BoutonBarreOutils>

      <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />

      <BoutonBarreOutils
        label="Liste à puces"
        actif={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </BoutonBarreOutils>
      <BoutonBarreOutils
        label="Liste numérotée"
        actif={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </BoutonBarreOutils>

      <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />

      <BoutonBarreOutils
        label="Aligner à gauche"
        actif={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={15} />
      </BoutonBarreOutils>
      <BoutonBarreOutils
        label="Centrer"
        actif={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={15} />
      </BoutonBarreOutils>
      <BoutonBarreOutils
        label="Aligner à droite"
        actif={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={15} />
      </BoutonBarreOutils>

      <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />

      <BoutonBarreOutils label="Annuler" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={15} />
      </BoutonBarreOutils>
      <BoutonBarreOutils label="Rétablir" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={15} />
      </BoutonBarreOutils>
    </div>
  );
}
