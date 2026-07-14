import type { Metadata } from "next";
import Link from "next/link";
import { getAllMatches } from "@/lib/posts";
import { Button } from "@/components/shared/Button";
import { DeleteMatchButton } from "@/components/admin/DeleteMatchButton";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const matches = await getAllMatches();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
            Articles
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Create and edit articles. On Vercel they save to Cloudinary; locally
            they save under{" "}
            <code className="text-[var(--pitch)]">content/matches</code>.
          </p>
        </div>
        <Button href="/admin/matches/new" variant="gold">
          New article
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--mist)] text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Download</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.slug} className="border-b border-[var(--line)]">
                <td className="px-4 py-3">
                  <p className="font-medium">{match.title}</p>
                  <p className="text-xs text-[var(--muted)]">/{match.slug}</p>
                </td>
                <td className="px-4 py-3">{formatDate(match.match_date)}</td>
                <td className="px-4 py-3">
                  {match.google_drive_url ? (
                    <span className="text-[var(--pitch)]">Ready</span>
                  ) : (
                    <span className="text-[var(--muted)]">Coming soon</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/matches/${match.slug}/edit`}
                      className="text-sm font-medium text-[var(--pitch)] hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/matches/${match.slug}`}
                      className="text-sm text-[var(--muted)] hover:underline"
                    >
                      View
                    </Link>
                    <DeleteMatchButton slug={match.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
