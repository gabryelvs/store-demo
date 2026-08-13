"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { QuickView } from "./QuickView";

type QuickAddApi = { openQuickAdd: (product: Product) => void };

const QuickAddContext = createContext<QuickAddApi | null>(null);

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const openQuickAdd = useCallback((p: Product) => setProduct(p), []);
  const close = useCallback(() => setProduct(null), []);
  const value = useMemo(() => ({ openQuickAdd }), [openQuickAdd]);

  return (
    <QuickAddContext.Provider value={value}>
      {children}
      <QuickView product={product} onClose={close} />
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd(): QuickAddApi {
  const ctx = useContext(QuickAddContext);
  if (!ctx) throw new Error("useQuickAdd must be used inside <QuickAddProvider>");
  return ctx;
}
