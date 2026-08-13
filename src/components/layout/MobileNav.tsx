"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getCollections } from "@/lib/shop";
import { useLockScroll } from "@/hooks/useLockScroll";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useLockScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
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
