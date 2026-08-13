"use client";

import { useState } from "react";

export function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <section className="border-y border-line px-4 py-16 md:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <h2 className="font-display text-2xl font-extrabold italic tracking-[-0.02em]">GET DROP 05 FIRST</h2>
        <p className="text-sm text-muted">Sign-up is disabled in this demo.</p>

        <form
          className="flex w-full max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@email.com"
            className="flex-1 border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors duration-[var(--duration-ui)] focus:border-accent"
          />
          <button
            type="submit"
            className="bg-accent px-5 py-3 font-display text-[11px] font-extrabold tracking-[0.16em] text-ink"
          >
            JOIN
          </button>
        </form>

        <p aria-live="polite" className="h-5 text-xs text-accent">
          {done ? "Demo only — nothing was sent." : ""}
        </p>
      </div>
    </section>
  );
}
