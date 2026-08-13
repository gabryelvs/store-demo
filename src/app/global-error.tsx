"use client"; // Error boundaries must be Client Components

// error.tsx only wraps loading/not-found/page/nested layouts — it cannot
// catch throws from layout.tsx itself, which is where this project's risky
// client code actually lives (CartProvider, Header, the marquee, the cart
// drawer, quick-view). global-error.tsx is the only boundary that sits above
// the root layout, so it's the one that catches those. It replaces the root
// layout entirely when active, so it can't rely on globals.css, the theme's
// Tailwind classes, or the fonts wired up in layout.tsx — it must render its
// own <html> and <body> and can't assume anything from the app it's
// replacing still applies. Inline styles here hard-code the same palette
// (`--color-ink` #0d0d0d, `--color-paper` #f5f5f5, `--color-accent` #d8ff00)
// so the failure state still reads as SECTOR—9 instead of Next's bare
// default error screen.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "0 1.5rem",
          textAlign: "center",
          backgroundColor: "#0d0d0d",
          color: "#f5f5f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 800,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          SOMETHING BROKE
        </h1>
        <p style={{ maxWidth: "24rem", fontSize: "0.875rem", color: "#8a8a8a", margin: 0 }}>
          A demo hiccup, not your fault. Try again — the bag is untouched.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            backgroundColor: "#d8ff00",
            color: "#0d0d0d",
            border: "none",
            padding: "0.75rem 1.5rem",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.16em",
            cursor: "pointer",
          }}
        >
          RETRY
        </button>
      </body>
    </html>
  );
}
