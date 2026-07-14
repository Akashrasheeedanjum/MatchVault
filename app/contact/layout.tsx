import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Sportify Central store team about football content, partnerships, or site feedback.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
