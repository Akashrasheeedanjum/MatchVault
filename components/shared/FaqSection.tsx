"use client";

import { useState } from "react";

export function FaqSection({
  faqs,
  title = "Frequently asked questions",
}: {
  faqs: { question: string; answer: string }[];
  title?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
        {title}
      </h2>
      <div className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
              >
                <span className="font-medium text-[var(--ink)]">{faq.question}</span>
                <span className="text-[var(--pitch)]" aria-hidden="true">
                  {open ? "−" : "+"}
                </span>
              </button>
              {open && (
                <p className="pb-4 text-sm leading-relaxed text-[var(--muted)]">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
