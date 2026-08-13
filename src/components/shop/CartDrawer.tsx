"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart/context";
import { useLockScroll } from "@/hooks/useLockScroll";
import { findVariant } from "@/lib/shop";
import { formatPrice } from "@/lib/format";
import { MAX_QTY } from "@/lib/cart/reducer";
import { DUR, EASE } from "@/lib/motion";

const FOCUSABLE_SELECTOR = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
const BACKGROUND_SELECTOR = 'header, main, footer, [data-chrome="marquee"]';

/**
 * Opened by `add()` (via quick-view or, later, a direct add) and by the
 * header's BAG button. Self-contained: reads isOpen from cart context
 * rather than taking props, so any future "add to bag" entry point gets
 * the drawer for free.
 */
export function CartDrawer() {
  const { lines, subtotalP, isOpen, closeCart, setQty, remove, lastAdded } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  // Tracks which line to flash. lastAdded itself never clears (it also
  // feeds the screen-reader announcement), so without a local copy that
  // times out, reopening the bag later would re-tint whatever was added
  // last time as if it were just added again.
  const [tinted, setTinted] = useState<typeof lastAdded>(null);
  // Sync `tinted` to `lastAdded` during render (React's "adjust state while
  // rendering" pattern) rather than in an effect: this is a plain mirror of
  // one value into another with no external system involved, so doing it
  // here resolves in the same render instead of costing an extra
  // effect-triggered pass. `add()` always creates a fresh lastAdded object,
  // so re-adding the same line still counts as a change here.
  const [tintedFor, setTintedFor] = useState<typeof lastAdded>(null);
  if (lastAdded !== tintedFor) {
    setTintedFor(lastAdded);
    setTinted(lastAdded);
  }

  useLockScroll(isOpen);

  // The timeout itself is a genuine external subscription (React docs:
  // "subscribe for updates from some external system, calling setState in a
  // callback"), so it stays in an effect — it just no longer also performs
  // the synchronous sync above.
  useEffect(() => {
    if (!tinted) return;
    const timer = setTimeout(() => setTinted(null), 2000);
    return () => clearTimeout(timer);
  }, [tinted]);

  useEffect(() => {
    if (!isOpen) return;

    // Quick-view's ADD TO BAG calls add() (which opens this drawer, isOpen
    // -> true) and then onClose() (which nulls QuickView's product) inside
    // the same event handler, so both changes land in one commit. That
    // commit runs every effect *cleanup* across the tree before it runs any
    // effect *setup* — so QuickView's cleanup (restoring focus to the quick
    // add button, un-inerting the background) is guaranteed to finish
    // before this effect's setup below steals focus into the drawer and
    // re-inerts the background. Without that ordering guarantee the two
    // overlays could race: this effect could grab focus/inert first, then
    // QuickView's cleanup would run after and hand focus back to the
    // trigger while leaving the drawer's own background un-inerted.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    // Hide the rest of the page from assistive tech while the panel is
    // open. The Tab trap below only intercepts literal Tab presses; a
    // screen-reader user navigating by swipe/rotor/virtual cursor could
    // otherwise still reach the header, main and footer behind the overlay.
    const backgroundEls = Array.from(document.querySelectorAll<HTMLElement>(BACKGROUND_SELECTOR));
    for (const el of backgroundEls) el.inert = true;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
        return;
      }

      if (e.key !== "Tab") return;

      const panelEl = panel.current;
      if (!panelEl) return;

      const focusable = Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        // Immediately after opening, document.activeElement is the panel
        // div itself. panel.contains(active) is true (a node contains
        // itself), so without this the wrap below never fires on the very
        // first keypress and focus escapes backwards to the trigger.
        if (active === panelEl) {
          e.preventDefault();
          last.focus();
          return;
        }

        if (active === first || !panelEl.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !panelEl.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      for (const el of backgroundEls) el.inert = false;
      // The drawer isn't only opened from the header's bag button — add()
      // (see CartProvider) also opens it from quick-view's ADD TO BAG
      // button. That button lives inside an AnimatePresence exit animation
      // that finishes and unmounts it well before most users get around to
      // closing the drawer again, so `previouslyFocused` is frequently a
      // detached node by the time this cleanup runs. .focus() on a
      // disconnected element is a silent no-op, which would otherwise drop
      // focus to <body> with no visible indicator. Fall back to the bag
      // toggle itself — the one opener guaranteed to still be mounted.
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      } else {
        document.getElementById("bag-toggle")?.focus();
      }
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-drawer"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.ui, ease: EASE.expo }}
        >
          <button
            type="button"
            aria-label="Close bag"
            onClick={closeCart}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />

          <motion.aside
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: DUR.panel, ease: EASE.expo }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-ink"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-sm font-extrabold tracking-[0.16em]">YOUR BAG</h2>
              <button
                type="button"
                onClick={closeCart}
                className="font-display text-[11px] tracking-[0.16em] text-muted transition-colors duration-[var(--duration-ui)] hover:text-paper"
              >
                CLOSE
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm text-muted">Your bag is empty</p>
                <Link
                  href="/collections/drop-04"
                  onClick={closeCart}
                  className="bg-accent px-5 py-3 font-display text-[11px] font-extrabold tracking-[0.16em] text-ink"
                >
                  SHOP DROP 04
                </Link>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-5">
                {lines.map((line) => {
                  const located = findVariant(line.sku);
                  if (!located) return null;
                  const { product } = located;
                  const isLatest = tinted?.title === product.title && tinted?.size === line.size;
                  // Shared with the "−" button's label at qty 1, where the click
                  // has the same effect as Remove.
                  const removeLabel = `Remove ${product.title}, size ${line.size}, from bag`;

                  return (
                    <li
                      key={line.sku}
                      className={`flex gap-4 border-b border-line py-4 transition-colors duration-[var(--duration-panel)] ${
                        isLatest ? "bg-accent/10" : "bg-transparent"
                      }`}
                    >
                      <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-surface">
                        <Image src={product.images[0]} alt="" fill sizes="80px" className="object-cover" />
                      </div>

                      <div className="flex flex-1 flex-col gap-1">
                        <span className="font-display text-[11px] tracking-[0.12em]">{product.title}</span>
                        <span className="text-xs text-muted">Size {line.size}</span>
                        <span className="font-display text-[12px]">{formatPrice(product.priceP * line.qty)}</span>

                        <div className="mt-1 flex items-center gap-3">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() => {
                                setQty(line.sku, line.qty - 1);
                                // At qty 1 this deletes the line, unmounting the
                                // button that just had focus. Recover it onto the
                                // panel before that happens.
                                if (line.qty === 1) panel.current?.focus();
                              }}
                              aria-label={
                                line.qty === 1
                                  ? removeLabel
                                  : `Decrease quantity of ${product.title}, size ${line.size}`
                              }
                              className="px-2 py-1 text-sm transition-colors duration-[var(--duration-ui)] hover:text-accent"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-xs">{line.qty}</span>
                            <button
                              type="button"
                              disabled={line.qty >= MAX_QTY}
                              onClick={() => setQty(line.sku, line.qty + 1)}
                              aria-label={`Increase quantity of ${product.title}, size ${line.size}`}
                              className="px-2 py-1 text-sm transition-colors duration-[var(--duration-ui)] hover:text-accent disabled:text-muted"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              remove(line.sku);
                              // Removing unmounts this button; recover focus onto
                              // the panel instead of leaving it on document.body.
                              panel.current?.focus();
                            }}
                            aria-label={removeLabel}
                            className="text-xs text-muted underline transition-colors duration-[var(--duration-ui)] hover:text-paper"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="border-t border-line px-5 py-5">
              <div className="flex items-center justify-between pb-4">
                <span className="font-display text-[11px] tracking-[0.16em] text-muted">SUBTOTAL</span>
                <span className="font-display text-sm font-bold">{formatPrice(subtotalP)}</span>
              </div>

              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed bg-line py-3 font-display text-[11px] font-extrabold tracking-[0.16em] text-muted"
              >
                CHECKOUT
              </button>
              <p className="pt-2 text-center text-xs text-muted">Demo store — checkout is disabled</p>

              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full border border-line py-3 font-display text-[11px] tracking-[0.16em] transition-colors duration-[var(--duration-ui)] hover:border-paper"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
