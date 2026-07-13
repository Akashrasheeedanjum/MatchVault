"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/shared/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Contact
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Questions about MatchVault, partnerships, or content corrections? Send a
        message using the form below.
      </p>

      {submitted ? (
        <div className="mt-8 max-w-xl border border-[var(--pitch)] bg-[var(--mist)] p-6">
          <p className="font-medium text-[var(--pitch)]">Message received</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            This is a static demo form for Phase 1. Wire it to an email API or
            form service when you deploy.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 outline-none ring-[var(--gold)] focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 outline-none ring-[var(--gold)] focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 outline-none ring-[var(--gold)] focus:ring-2"
            />
          </div>
          <Button type="submit" variant="gold">
            Send message
          </Button>
        </form>
      )}

      <p className="mt-8 text-sm text-[var(--muted)]">
        Email:{" "}
        <a href="mailto:hello@matchvault.com" className="text-[var(--pitch)]">
          hello@matchvault.com
        </a>
      </p>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Related:{" "}
        <a href="/about" className="text-[var(--pitch)]">
          About
        </a>
        {" · "}
        <a href="/privacy" className="text-[var(--pitch)]">
          Privacy
        </a>
        {" · "}
        <a href="/terms" className="text-[var(--pitch)]">
          Terms
        </a>
        {" · "}
        <a href="/dmca" className="text-[var(--pitch)]">
          DMCA
        </a>
        {" · "}
        <a href="/cookie-policy" className="text-[var(--pitch)]">
          Cookies
        </a>
      </p>
    </Container>
  );
}
