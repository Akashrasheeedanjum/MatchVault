import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import { MatchForm } from "@/components/admin/MatchForm";
import { readMatchSource } from "@/lib/admin-matches";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Edit Article",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditMatchPage({ params }: PageProps) {
  const { slug } = await params;
  const source = readMatchSource(slug);
  if (!source) notFound();

  const { frontmatter, content } = source;
  const isHtml =
    frontmatter.content_format === "html" || content.trim().startsWith("<");
  const contentHtml = isHtml
    ? content
    : (await remark().use(html).process(content)).toString();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
        Edit article
      </h1>
      <p className="mt-1 mb-8 text-sm text-[var(--muted)]">{frontmatter.title}</p>
      <MatchForm
        mode="edit"
        initial={{
          ...frontmatter,
          contentHtml,
        }}
      />
    </div>
  );
}
