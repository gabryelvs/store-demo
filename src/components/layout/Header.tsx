"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/lib/cart/context";
import { getCollections } from "@/lib/shop";
import { MobileNav } from "./MobileNav";

export function Header() {
  const { count, openCart } = useCart();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const collections = getCollections();

  // Stable reference: MobileNav's effect depends on this, and Header
  // re-renders on every scroll tick (setHidden/setSolid). An inline arrow
  // here would tear the focus trap down and rebuild it on each scroll event.
  const closeNav = useCallback(() => setNavOpen(false), []);

  // Hide on scroll down, return on scroll up. Retail headers earn their space
  // back only when the visitor looks like they want to navigate.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > last && y > 120);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-40 transition-[transform,background-color,border-color] duration-[var(--duration-ui)] ease-brand ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "border-b border-line bg-ink/85 backdrop-blur" : "border-b border-transparent"}`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="font-display text-sm font-extrabold tracking-[0.18em]">
            SECTOR—9
          </Link>

          <nav aria-label="Collections" className="hidden gap-7 md:flex">
            {collections.map((c) => (
              <Link
                key={c.handle}
                href={`/collections/${c.handle}`}
                className="relative font-display text-[11px] tracking-[0.16em] text-paper/80 transition-colors duration-[var(--duration-ui)] hover:text-paper after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-[var(--duration-ui)] after:ease-brand hover:after:scale-x-100"
              >
                {c.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              id="bag-toggle"
              onClick={openCart}
              className="font-display text-[11px] tracking-[0.16em] text-paper transition-colors duration-[var(--duration-ui)] hover:text-accent"
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              BAG ({count})
            </button>
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="font-display text-[11px] tracking-[0.16em] md:hidden"
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={navOpen} onClose={closeNav} />
    </>
  );
}
