import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How MatchVault uses essential, analytics, and advertising cookies, including Google AdSense.",
  alternates: { canonical: "/cookie-policy" },
  openGraph: {
    title: "Cookie Policy | MatchVault",
    description: "Cookie categories and how to manage them on MatchVault.",
  },
};

export default function CookiePolicyPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[{ name: "Home", href: "/" }, { name: "Cookie Policy" }]}
      />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Cookie Policy
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated: 14 July 2026</p>
      <div className="legal-prose mt-6 max-w-3xl">
        <p>
          This Cookie Policy explains how MatchVault uses cookies and similar
          technologies when you visit our pages.
        </p>
        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help sites function, remember preferences, and measure
          performance.
        </p>
        <h2>Cookies we may use</h2>
        <ul>
          <li>
            <strong>Essential cookies</strong> — required for basic site
            operation and security (including admin session cookies)
          </li>
          <li>
            <strong>Analytics cookies</strong> — help us understand traffic and
            popular content (for example Vercel Analytics / Google Analytics)
          </li>
          <li>
            <strong>Advertising cookies</strong> — used by partners such as
            Google AdSense to deliver and measure ads
          </li>
        </ul>
        <h2>Managing cookies</h2>
        <p>
          You can control cookies through your browser settings. Blocking some
          cookies may affect site functionality or personalised advertising.
        </p>
        <h2>Related policies</h2>
        <p>
          See our <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms &amp; Conditions</Link>, or contact{" "}
          <a href="mailto:privacy@matchvault.com">privacy@matchvault.com</a>.
        </p>
      </div>
    </Container>
  );
}
