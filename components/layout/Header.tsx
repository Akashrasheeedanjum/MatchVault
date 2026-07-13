"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { LEAGUES } from "@/lib/leagues";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Matches" },
  { href: "/teams", label: "Teams" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [leaguesOpen, setLeaguesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--pitch-deep)]/95 text-white backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--gold)]">
            MatchVault
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-white/60 sm:inline">
            Football Analysis
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/80 transition hover:text-[var(--gold)]"
            >
              {link.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setLeaguesOpen(true)}
            onMouseLeave={() => setLeaguesOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 py-5 text-sm text-white/80 transition hover:text-[var(--gold)]"
              aria-expanded={leaguesOpen}
              aria-haspopup="true"
              onClick={() => setLeaguesOpen((value) => !value)}
            >
              Leagues
              <span aria-hidden="true" className="text-[10px]">
                ▾
              </span>
            </button>
            {leaguesOpen && (
              <div className="absolute right-0 top-full z-50 min-w-[220px] pt-0">
                <div className="rounded-md border border-[var(--line)] bg-[var(--surface)] py-2 shadow-lg">
                  {LEAGUES.map((league) => (
                    <Link
                      key={league.slug}
                      href={`/leagues/${league.slug}`}
                      className="block px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--mist)] hover:text-[var(--pitch)]"
                      onClick={() => setLeaguesOpen(false)}
                    >
                      {league.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
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
          <Container className="flex flex-col gap-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/85"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <p className="pt-2 text-xs uppercase tracking-wider text-[var(--gold)]">
              Leagues
            </p>
            {LEAGUES.map((league) => (
              <Link
                key={league.slug}
                href={`/leagues/${league.slug}`}
                className="text-sm text-white/75"
                onClick={() => setOpen(false)}
              >
                {league.name}
              </Link>
            ))}
            <Link
              href="/privacy"
              className="text-sm text-white/60"
              onClick={() => setOpen(false)}
            >
              Privacy
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
