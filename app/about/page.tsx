import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/shared/Button";

export const metadata: Metadata = {
  title: "About Sportify Central store",
  description:
    "Learn about Sportify Central store — football match analysis, clips, and Google Drive downloads.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sportify Central store",
    description:
      "Football match analysis, tactical breakdowns, and downloadable clips.",
  },
};

export default function AboutPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        About Sportify Central store
      </h1>
      <div className="legal-prose mt-6 max-w-3xl">
        <p>
          Sportify Central store is a football content platform for fans who want
          more than a final score. We publish original match analysis, rare clips,
          and Google Drive downloads when files are ready.
        </p>
        <h2>Our mission</h2>
        <p>
          Our mission is to make high-quality football analysis accessible,
          readable, and useful — whether you are revisiting a derby or studying
          how a result was built phase by phase.
        </p>
        <h2>What we publish</h2>
        <ul>
          <li>Match write-ups and post-match analysis</li>
          <li>Image galleries and optional YouTube highlights</li>
          <li>Google Drive download links when available</li>
        </ul>
        <h2>How to browse</h2>
        <p>
          Start on the homepage for latest posts, or open{" "}
          <Link href="/matches">Articles</Link> for the full feed.
        </p>
        <h2>Advertising &amp; downloads</h2>
        <p>
          Sportify Central store publishes original articles first. When Google
          AdSense is enabled, ads are clearly labeled &quot;Advertisement&quot;,
          kept away from download buttons, and limited so content stays primary.
          Download sections never contain ads.
        </p>
        <p>
          See our{" "}
          <Link href="/privacy">Privacy Policy</Link>,{" "}
          <Link href="/terms">Terms</Link>, and{" "}
          <Link href="/cookie-policy">Cookie Policy</Link> for advertising and
          cookie details.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/matches" variant="primary">
            Browse articles
          </Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </Container>
  );
}
