"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart/context";
import { formatPrice } from "@/lib/format";
import { SizePicker } from "./SizePicker";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [sku, setSku] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const selected = product.variants.find((v) => v.sku === sku) ?? null;
  const soldOut = product.variants.every((v) => !v.inStock);

  return (
    <div className="grid gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          {product.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${product.title}, view ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              // opacity: 0 keeps the inactive frames in the layout for the
              // cross-fade, but it does not remove them from the
              // accessibility tree — without aria-hidden a screen reader
              // announces every view's alt text on each visit to this
              // section, not just the one actually visible.
              aria-hidden={i !== active}
              className={`object-cover transition-opacity duration-[var(--duration-xfade)] ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show view ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-[4/5] w-16 overflow-hidden border transition-colors duration-[var(--duration-ui)] ${
                i === active ? "border-accent" : "border-line hover:border-paper"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="md:sticky md:top-24 md:self-start">
        <h1 className="font-display text-3xl font-extrabold italic tracking-[-0.03em]">{product.title}</h1>

        <p className="pt-2 font-display text-lg">
          {formatPrice(product.priceP)}
          {product.compareAtP !== undefined && (
            <span className="ml-2 text-muted line-through">{formatPrice(product.compareAtP)}</span>
          )}
        </p>

        <p className="pt-5 text-sm leading-relaxed text-muted">{product.description}</p>

        <div className="pt-7">
          {!soldOut && (
            <p className="pb-2 font-display text-[10px] tracking-[0.18em] text-muted">SELECT SIZE</p>
          )}
          {soldOut && (
            <p className="pb-2 font-display text-[10px] tracking-[0.18em] text-muted">SIZES</p>
          )}
          <SizePicker variants={product.variants} selectedSku={sku} onSelect={setSku} />
        </div>

        {soldOut ? (
          <button
            type="button"
            disabled
            className="mt-6 w-full bg-accent py-4 font-display text-[11px] font-extrabold tracking-[0.16em] text-ink transition-colors duration-[var(--duration-ui)] ease-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            SOLD OUT
          </button>
        ) : (
          <button
            type="button"
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              add({ handle: product.handle, sku: selected.sku, size: selected.size, qty: 1 });
            }}
            className="mt-6 w-full bg-accent py-4 font-display text-[11px] font-extrabold tracking-[0.16em] text-ink transition-colors duration-[var(--duration-ui)] ease-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            ADD TO BAG
          </button>
        )}
        {soldOut && <p className="pt-2 text-xs text-muted">This piece has sold out.</p>}
        {!soldOut && !selected && <p className="pt-2 text-xs text-muted">Select a size</p>}

        <ul className="mt-8 border-t border-line pt-6 text-sm text-muted">
          {product.details.map((d) => (
            <li key={d} className="border-b border-line py-3">
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
