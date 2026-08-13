"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { cartReducer, initialCart, type CartLine, type Size } from "./reducer";
import { readCart, writeCart } from "./storage";
import { selectCount, selectSubtotalP } from "./selectors";
import { findVariant, isKnownSku, priceOfSku } from "@/lib/shop";

type Announcement = { title: string; size: Size } | null;

type CartApi = {
  lines: CartLine[];
  count: number;
  subtotalP: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (line: CartLine) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  /** Feeds the aria-live region so screen readers hear what was added. */
  lastAdded: Announcement;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<Announcement>(null);
  const [hydrated, setHydrated] = useState(false);

  // The server renders an empty cart, so reading storage has to wait for mount.
  // Doing it during render would produce a hydration mismatch.
  useEffect(() => {
    dispatch({ type: "HYDRATE", lines: readCart(isKnownSku) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeCart(state.lines);
  }, [state.lines, hydrated]);

  const add = useCallback((line: CartLine) => {
    // Unknown skus would count in the badge but price at zero; skip them.
    if (!isKnownSku(line.sku)) return;

    dispatch({ type: "ADD", line });
    const located = findVariant(line.sku);
    if (located) setLastAdded({ title: located.product.title, size: line.size });
    setOpen(true);
  }, []);

  const setQty = useCallback((sku: string, qty: number) => dispatch({ type: "SET_QTY", sku, qty }), []);
  const remove = useCallback((sku: string) => dispatch({ type: "REMOVE", sku }), []);
  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const value = useMemo<CartApi>(
    () => ({
      lines: state.lines,
      count: selectCount(state),
      subtotalP: selectSubtotalP(state, priceOfSku),
      isOpen,
      openCart,
      closeCart,
      add,
      setQty,
      remove,
      lastAdded,
    }),
    [state, isOpen, openCart, closeCart, add, setQty, remove, lastAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
