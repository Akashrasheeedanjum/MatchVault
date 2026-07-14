import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "DMCA Policy",
  description:
    "Sportify Central store DMCA copyright policy, notice requirements, and counter-notification process.",
  alternates: { canonical: "/dmca" },
  openGraph: {
    title: "DMCA Policy | Sportify Central store",
    description: "How to report copyright infringement on Sportify Central store.",
  },
};

export default function DmcaPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "DMCA" }]} />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        DMCA Policy
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated: 14 July 2026</p>
      <div className="legal-prose mt-6 max-w-3xl">
        <p>
          Sportify Central store respects intellectual property rights and complies with the
          Digital Millennium Copyright Act (DMCA).
        </p>
        <h2>Reporting copyright infringement</h2>
        <p>
          If you believe content on Sportify Central store infringes your copyright, send a
          DMCA notice including:
        </p>
        <ul>
          <li>Your contact information</li>
          <li>Description of the copyrighted work</li>
          <li>URL of the allegedly infringing material</li>
          <li>A statement of good-faith belief that use is not authorised</li>
          <li>A statement under penalty of perjury that the notice is accurate</li>
          <li>Your physical or electronic signature</li>
        </ul>
        <h2>Send notices to</h2>
        <p>
          <a href="mailto:dmca@sportifycentral.store">dmca@sportifycentral.store</a>
        </p>
        <h2>Counter-notification</h2>
        <p>
          If your content was removed and you believe it was a mistake, you may
          submit a counter-notification with the required legal statements and
          contact details.
        </p>
        <h2>Repeat infringers</h2>
        <p>
          Sportify Central store may terminate access for users who repeatedly infringe
          copyrights.
        </p>
        <h2>Related pages</h2>
        <p>
          <Link href="/terms">Terms &amp; Conditions</Link> ·{" "}
          <Link href="/privacy">Privacy Policy</Link> ·{" "}
          <Link href="/contact">Contact</Link>
        </p>
      </div>
    </Container>
  );
}
