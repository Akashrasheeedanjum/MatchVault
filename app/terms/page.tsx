import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using Sportify Central store football analysis, media, and download features.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions | Sportify Central store",
    description: "Rules for using the Sportify Central store website and content.",
  },
};

export default function TermsPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[{ name: "Home", href: "/" }, { name: "Terms & Conditions" }]}
      />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated: 14 July 2026</p>
      <div className="legal-prose mt-6 max-w-3xl">
        <p>
          By accessing Sportify Central store, you agree to these Terms &amp; Conditions. If
          you do not agree, please do not use the site.
        </p>
        <h2>Service description</h2>
        <p>
          Sportify Central store publishes football match analysis, embedded
          videos, and optional downloadable files for personal informational use.
        </p>
        <h2>Use of content</h2>
        <p>
          Articles, analysis, branding, and site design are owned by Sportify Central store
          or used under licence. You may not copy, scrape, or republish content
          for commercial purposes without permission.
        </p>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not attempt to disrupt or misuse the website</li>
          <li>Do not submit unlawful, abusive, or spam content</li>
          <li>Do not use automated systems to overload our services</li>
          <li>Do not bypass download or security controls</li>
        </ul>
        <h2>Downloads</h2>
        <p>
          Where downloads are offered, they are provided for personal use only
          and may be subject to additional notices on the relevant match page.
          Download sections are kept free of advertising.
        </p>
        <h2>Third-party services</h2>
        <p>
          The site may embed YouTube videos, load Cloudinary media, and display
          ads via Google AdSense. Those services have their own terms and
          privacy policies.
        </p>
        <h2>Disclaimer</h2>
        <p>
          Match analysis is for informational and entertainment purposes.
          Sportify Central store does not guarantee completeness, accuracy of every detail,
          or uninterrupted access.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Sportify Central store is not liable for
          indirect or consequential losses arising from use of the site.
        </p>
        <h2>Related pages</h2>
        <p>
          <Link href="/privacy">Privacy Policy</Link> ·{" "}
          <Link href="/cookie-policy">Cookie Policy</Link> ·{" "}
          <Link href="/dmca">DMCA</Link> ·{" "}
          <Link href="/contact">Contact</Link>
        </p>
        <h2>Contact</h2>
        <p>
          Legal enquiries:{" "}
          <a href="mailto:legal@sportifycentral.store">legal@sportifycentral.store</a>
        </p>
      </div>
    </Container>
  );
}
