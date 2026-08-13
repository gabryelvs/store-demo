"use client";

import type { Variant } from "@/data/products";

export function SizePicker({
  variants,
  selectedSku,
  onSelect,
}: {
  variants: Variant[];
  selectedSku: string | null;
  onSelect: (sku: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => {
        const selected = v.sku === selectedSku;
        return (
          <button
            key={v.sku}
            type="button"
            disabled={!v.inStock}
            aria-pressed={selected}
            aria-label={v.inStock ? `Size ${v.size}` : `Size ${v.size} — sold out`}
            onClick={() => onSelect(v.sku)}
            className={`min-w-11 border px-3 py-2 font-display text-[11px] tracking-[0.1em] transition-colors duration-[var(--duration-ui)] ease-brand ${
              selected
                ? "border-accent bg-accent text-ink"
                : "border-line text-paper hover:border-paper"
            } disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:line-through disabled:hover:border-line`}
          >
            {v.size}
          </button>
        );
      })}
    </div>
  );
}
