"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getCollections } from "@/lib/shop";
import { useLockScroll } from "@/hooks/useLockScroll";

const FOCUSABLE_SELECTOR = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useLockScroll(open);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !panel.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      className={`fixed inset-0 z-50 bg-ink transition-[opacity,visibility] duration-[var(--duration-panel)] ease-expo md:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-display text-sm font-extrabold tracking-[0.18em]">SECTOR—9</span>
        <button type="button" onClick={onClose} className="font-display text-[11px] tracking-[0.16em]">
          CLOSE
        </button>
      </div>
      <nav className="flex flex-col gap-2 px-4 pt-8" aria-label="Collections">
        {getCollections().map((c) => (
          <Link
            key={c.handle}
            href={`/collections/${c.handle}`}
            onClick={onClose}
            className="font-display text-3xl font-extrabold italic tracking-[-0.02em]"
          >
            {c.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
