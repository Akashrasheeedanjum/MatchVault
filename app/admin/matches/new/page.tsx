import type { Metadata } from "next";
import { MatchForm } from "@/components/admin/MatchForm";

export const metadata: Metadata = {
  title: "New Article",
  robots: { index: false, follow: false },
};

export default function NewMatchPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
        New article
      </h1>
      <p className="mt-1 mb-8 text-sm text-[var(--muted)]">
        Use the toolbar for bold, italic, underline, headings, lists, and text
        alignment (including center).
      </p>
      <MatchForm mode="create" />
    </div>
  );
}
