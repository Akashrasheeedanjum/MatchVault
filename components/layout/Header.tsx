"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { SITE_NAME } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--pitch-deep)]/95 text-white backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex min-w-0 items-baseline gap-2">
          <span className="truncate font-[family-name:var(--font-display)] text-xl tracking-wide text-[var(--gold)] sm:text-2xl">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-[var(--gold)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-[var(--pitch-deep)] md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2.5 text-sm text-white/85 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
