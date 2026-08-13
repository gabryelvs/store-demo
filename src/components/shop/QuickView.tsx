"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart/context";
import { useLockScroll } from "@/hooks/useLockScroll";
import { formatPrice } from "@/lib/format";
import { DUR, EASE } from "@/lib/motion";
import { SizePicker } from "./SizePicker";

const BACKGROUND_SELECTOR = 'header, main, footer, [data-chrome="marquee"]';

/**
 * Opened by QUICK ADD on the grid. Apparel needs a size, so adding to the bag
 * is a two-step: this panel is the second step, and it shows enough detail
 * (price, description) that choosing a size here is not a blind decision.
 */
export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add } = useCart();
  const [sku, setSku] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useLockScroll(product !== null);

  useEffect(() => setSku(null), [product?.handle]);

  useEffect(() => {
    if (!product) return;

    restoreFocus.current = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    // Hide the rest of the page from assistive tech while the panel is
    // open, the same way MobileNav does. The Tab trap below only
    // intercepts literal Tab presses; a screen-reader user navigating by
    // swipe/rotor/virtual cursor could otherwise still reach the header,
    // main and footer behind the overlay.
    const backgroundEls = Array.from(document.querySelectorAll<HTMLElement>(BACKGROUND_SELECTOR));
    for (const el of backgroundEls) el.inert = true;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      // Focus trap: Tab past the last control wraps to the first, and vice
      // versa, so keyboard users cannot get lost behind the overlay.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      for (const el of backgroundEls) el.inert = false;
      restoreFocus.current?.focus();
    };
  }, [product, onClose]);

  const selected = product?.variants.find((v) => v.sku === sku) ?? null;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          // Keyed by product so reopening on a different card during the exit
          // animation reads as a new instance, not a continuation of the old one.
          key={product.handle}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.ui, ease: EASE.expo }}
        >
          <button
            type="button"
            aria-label="Close quick view"
            onClick={onClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />

          <motion.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.title} quick view`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: DUR.panel, ease: EASE.expo }}
            className="relative z-10 grid w-full max-w-3xl gap-6 border border-line bg-ink p-4 md:grid-cols-2 md:p-6"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <Image
                src={product.images[0]}
                alt={`${product.title}, front view`}
                fill
                sizes="(max-width: 768px) 90vw, 400px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-display text-xl font-extrabold italic tracking-[-0.02em]">
                  {product.title}
                </h2>
                <p className="pt-1 font-display text-[13px] tracking-[0.06em]">
                  {formatPrice(product.priceP)}
                  {product.compareAtP !== undefined && (
                    <span className="ml-2 text-muted line-through">{formatPrice(product.compareAtP)}</span>
                  )}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-muted">{product.description}</p>

              <div>
                <p className="pb-2 font-display text-[10px] tracking-[0.18em] text-muted">SELECT SIZE</p>
                <SizePicker variants={product.variants} selectedSku={sku} onSelect={setSku} />
              </div>

              <div className="mt-auto">
                <button
                  type="button"
                  disabled={!selected}
                  onClick={() => {
                    if (!selected) return;
                    add({ handle: product.handle, sku: selected.sku, size: selected.size, qty: 1 });
                    onClose();
                  }}
                  className="w-full bg-accent py-3 font-display text-[11px] font-extrabold tracking-[0.16em] text-ink transition-colors duration-[var(--duration-ui)] ease-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
                >
                  ADD TO BAG
                </button>
                {!selected && <p className="pt-2 text-xs text-muted">Select a size</p>}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="self-start font-display text-[10px] tracking-[0.16em] text-muted transition-colors duration-[var(--duration-ui)] hover:text-paper"
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
