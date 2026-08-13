"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "./Badge";
import { PriceTag } from "./PriceTag";

type Props = {
  product: Product;
  onQuickAdd: (product: Product) => void;
  /** Set on the first row only, so the LCP image is not lazy. */
  priority?: boolean;
};

/**
 * The card repeats around forty times across the demo, so its hover carries the
 * whole site's motion impression: both images scale together while the second
 * cross-fades over the first, and the quick-add bar rises over the photo.
 *
 * On touch, where :hover never fires, the bar is permanently visible.
 */
export function ProductCard({ product, onQuickAdd, priority = false }: Props) {
  const soldOut = product.variants.every((v) => !v.inStock);

  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {product.badges[0] && (
          <span className="absolute left-2 top-2 z-20">
            <Badge>{product.badges[0]}</Badge>
          </span>
        )}

        <Link href={`/products/${product.handle}`} aria-label={product.title}>
          <Image
            src={product.images[0]}
            alt={`${product.title}, front view`}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[var(--duration-zoom)] ease-expo group-hover:scale-[1.06]"
          />
          <Image
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-[opacity,transform] duration-[var(--duration-xfade),var(--duration-zoom)] ease-linear group-hover:scale-[1.06] group-hover:opacity-100"
          />
        </Link>

        {!soldOut && (
          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="absolute inset-x-2 bottom-2 z-20 translate-y-0 bg-accent py-2 font-display text-[10px] font-extrabold tracking-[0.16em] text-ink transition-transform duration-[var(--duration-panel)] ease-expo md:translate-y-[140%] md:group-hover:translate-y-0"
          >
            QUICK ADD +
          </button>
        )}
      </div>

      <div className="pt-3">
        <Link
          href={`/products/${product.handle}`}
          className="font-display text-[11px] tracking-[0.12em] text-paper/85 transition-colors duration-[var(--duration-ui)] hover:text-paper"
        >
          {product.title}
        </Link>
        <div className="pt-1">
          {soldOut ? (
            <span className="font-display text-[13px] tracking-[0.06em] text-muted">SOLD OUT</span>
          ) : (
            <PriceTag priceP={product.priceP} compareAtP={product.compareAtP} />
          )}
        </div>
      </div>
    </div>
  );
}
