import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/dmca", label: "DMCA" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--pitch-deep)] text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold)]">
            {SITE_NAME}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            {SITE_TAGLINE}. Match write-ups, galleries, and Google Drive
            downloads.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--gold)]">
            Explore
          </h2>
          <ul className="mt-4 space-y-2">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/75 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--gold)]">
            Legal
          </h2>
          <ul className="mt-4 space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/75 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-4 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p>
            <Link href="/sitemap.xml" className="hover:text-white">
              Sitemap
            </Link>
            {" · "}
            <Link href="/robots.txt" className="hover:text-white">
              robots.txt
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
