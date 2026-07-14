"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onResize() {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-white/10 bg-[var(--pitch-deep)] text-white">
      <Container className="flex h-16 items-center gap-3">
        <Link
          href="/"
          className="min-w-0 flex-1 truncate font-[family-name:var(--font-display)] text-lg tracking-wide text-[var(--gold)] sm:text-xl md:text-2xl"
          onClick={() => setOpen(false)}
        >
          {SITE_NAME}
        </Link>

        <nav className="site-nav-desktop items-center gap-1" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-[var(--gold)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="site-nav-mobile-btn shrink-0 items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span
              className={`block h-0.5 w-4 bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-4 bg-current transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-4 bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </Container>

      {open ? (
        <div
          id="mobile-nav"
          className="site-nav-mobile-panel border-t border-white/10 bg-[var(--pitch-deep)]"
        >
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-base font-medium text-white hover:bg-white/10 hover:text-[var(--gold)]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
