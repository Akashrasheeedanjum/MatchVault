import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Sportify Central store privacy policy explaining data collection, cookies, analytics, advertising, and GDPR rights.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Sportify Central store",
    description:
      "How Sportify Central store collects, uses, and protects personal information.",
  },
};

export default function PrivacyPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy" }]} />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated: 14 July 2026</p>
      <div className="legal-prose mt-6 max-w-3xl">
        <p>
          Sportify Central store (&quot;we&quot;, &quot;us&quot;) respects your privacy. This
          policy explains what information we collect, how we use it, and your
          rights under applicable data protection laws including the GDPR.
        </p>
        <h2>Who we are</h2>
        <p>
          Sportify Central store is a football analysis website publishing articles, match
          statistics, embedded videos, and optional downloadable media. Contact:{" "}
          <a href="mailto:privacy@sportifycentral.store">privacy@sportifycentral.store</a>.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>Information you submit via contact forms (name, email, message)</li>
          <li>Technical data such as IP address, browser type, and device information</li>
          <li>Usage data via analytics tools (for example Google Analytics / Vercel Analytics)</li>
          <li>
            Advertising-related data when Google AdSense or similar partners are
            active (see{" "}
            <Link href="/cookie-policy">Cookie Policy</Link>)
          </li>
        </ul>
        <h2>How we use information</h2>
        <ul>
          <li>To operate, secure, and improve Sportify Central store</li>
          <li>To respond to enquiries sent through Contact</li>
          <li>To measure traffic, indexing, and content performance</li>
          <li>To display relevant advertising where permitted</li>
        </ul>
        <h2>Legal bases (GDPR)</h2>
        <p>
          Where GDPR applies, we process personal data based on consent,
          legitimate interests (site security, analytics, and publishing), and/or
          contractual necessity when you contact us.
        </p>
        <h2>Sharing</h2>
        <p>
          We may share limited data with infrastructure and advertising partners
          such as hosting providers, analytics services, Cloudinary (media
          delivery), and Google (AdSense / Search Console / Analytics), only as
          needed to run the site.
        </p>
        <h2>Retention</h2>
        <p>
          We keep contact messages and logs only as long as needed for support,
          security, and legal obligations, then delete or anonymise them.
        </p>
        <h2>Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, restrict, or object to processing of your personal data, and to
          lodge a complaint with a supervisory authority.
        </p>
        <h2>Related policies</h2>
        <p>
          <Link href="/terms">Terms &amp; Conditions</Link> ·{" "}
          <Link href="/cookie-policy">Cookie Policy</Link> ·{" "}
          <Link href="/dmca">DMCA</Link> ·{" "}
          <Link href="/contact">Contact</Link>
        </p>
      </div>
    </Container>
  );
}
