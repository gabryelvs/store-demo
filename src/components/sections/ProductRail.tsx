"use client";

import Link from "next/link";
import { useRef } from "react";
import { getProductsInCollection } from "@/lib/shop";
import { ProductCard } from "@/components/shop/ProductCard";
import { useQuickAdd } from "@/components/shop/QuickAddProvider";

export function ProductRail({
  title,
  handle,
  exclude,
}: {
  title: string;
  handle: string;
  /** Handle to filter out of the rail — e.g. the product whose own page is rendering it. */
  exclude?: string;
}) {
  const products = getProductsInCollection(handle).filter((p) => p.handle !== exclude);
  const { openQuickAdd } = useQuickAdd();
  const track = useRef<HTMLDivElement>(null);

  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="py-14">
      <div className="flex items-end justify-between px-4 pb-6 md:px-8">
        <h2 className="font-display text-xl font-extrabold italic tracking-[-0.02em]">{title}</h2>

        <div className="flex items-center gap-4">
          <Link
            href={`/collections/${handle}`}
            className="group font-display text-[10px] tracking-[0.2em] text-muted transition-colors duration-[var(--duration-ui)] hover:text-paper"
          >
            VIEW ALL{" "}
            <span className="inline-block transition-transform duration-[var(--duration-ui)] ease-brand group-hover:translate-x-[5px]">
              →
            </span>
          </Link>

          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label={`Scroll ${title} left`}
              className="border border-line px-3 py-1 transition-colors duration-[var(--duration-ui)] hover:border-paper"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label={`Scroll ${title} right`}
              className="border border-line px-3 py-1 transition-colors duration-[var(--duration-ui)] hover:border-paper"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:px-8"
      >
        {products.map((product) => (
          <div key={product.handle} className="w-[62vw] shrink-0 snap-start md:w-[22vw]">
            {/* Rails sit below the fold on the home page, which already has
                a priority hero. Marking cards here priority would compete
                with the real LCP candidate for preload bandwidth. */}
            <ProductCard product={product} onQuickAdd={openQuickAdd} />
          </div>
        ))}
      </div>
    </section>
  );
}
