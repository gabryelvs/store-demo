"use client";

import type { Product } from "@/data/products";
import { ProductGrid } from "./ProductGrid";
import { useQuickAdd } from "./QuickAddProvider";

export function CollectionView({ products }: { products: Product[] }) {
  const { openQuickAdd } = useQuickAdd();
  return <ProductGrid products={products} onQuickAdd={openQuickAdd} />;
}
