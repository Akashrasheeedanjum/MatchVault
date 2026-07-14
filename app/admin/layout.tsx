import Link from "next/link";
import { cookies } from "next/headers";
import { Container } from "@/components/shared/Container";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const loggedIn = await verifyAdminToken(token).catch(() => false);

  return (
    <div className="min-h-screen bg-[var(--mist)]">
      {loggedIn && (
        <div className="border-b border-[var(--line)] bg-[var(--pitch-deep)] text-white">
          <Container className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="font-[family-name:var(--font-display)] text-xl text-[var(--gold)]"
              >
                Sportify Central store Admin
              </Link>
              <Link
                href="/admin/matches/new"
                className="text-sm text-white/80 hover:text-white"
              >
                New article
              </Link>
              <Link href="/" className="text-sm text-white/80 hover:text-white">
                View site
              </Link>
            </div>
            <LogoutButton />
          </Container>
        </div>
      )}
      <Container className="py-8">{children}</Container>
    </div>
  );
}
