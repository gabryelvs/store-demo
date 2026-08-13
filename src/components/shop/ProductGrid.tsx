"use client";

import type { Product } from "@/data/products";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  onQuickAdd,
}: {
  products: Product[];
  onQuickAdd: (product: Product) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
      {products.map((product, i) => (
        <Reveal key={product.handle} delay={(i % 4) * 0.06}>
          <ProductCard product={product} onQuickAdd={onQuickAdd} priority={i < 4} />
        </Reveal>
      ))}
    </div>
  );
}
