"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-display text-3xl font-extrabold italic tracking-[-0.02em]">SOMETHING BROKE</p>
      <p className="max-w-sm text-sm text-muted">
        A demo hiccup, not your fault. Try again — the bag is untouched.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-accent px-6 py-3 font-display text-[11px] font-extrabold tracking-[0.16em] text-ink"
      >
        RETRY
      </button>
    </div>
  );
}
