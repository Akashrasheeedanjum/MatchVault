"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-sm font-medium transition",
        active
          ? "bg-[var(--pitch)] text-white"
          : "bg-white text-[var(--ink)] hover:bg-[var(--mist)]",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // Avoid duplicates — we add Link + Underline below with custom options.
        link: false,
        underline: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[var(--pitch)] underline" },
      }),
      Placeholder.configure({
        placeholder: "Write your match analysis like in Word…",
      }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose-match min-h-[320px] px-4 py-3 outline-none focus:outline-none",
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[380px] rounded-md border border-[var(--line)] bg-white p-4 text-sm text-[var(--muted)]">
        Loading editor…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-[var(--line)] bg-white",
        className,
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-[var(--line)] bg-[var(--mist)] p-2">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          title="Strike"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        <span className="mx-1 w-px self-stretch bg-[var(--line)]" />
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolbarButton>
        <span className="mx-1 w-px self-stretch bg-[var(--line)]" />
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <span className="mx-1 w-px self-stretch bg-[var(--line)]" />
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          Left
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          Center
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          Right
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          Justify
        </ToolbarButton>
        <span className="mx-1 w-px self-stretch bg-[var(--line)]" />
        <ToolbarButton
          title="Add link"
          active={editor.isActive("link")}
          onClick={() => {
            const previous = editor.getAttributes("link").href as
              | string
              | undefined;
            const url = window.prompt("Link URL", previous || "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        >
          Link
        </ToolbarButton>
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
