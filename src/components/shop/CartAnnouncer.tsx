"use client";

import { useCart } from "@/lib/cart/context";

/** Screen readers hear what the drawer animation shows everyone else. */
export function CartAnnouncer() {
  const { lastAdded } = useCart();
  return (
    <p aria-live="polite" className="sr-only">
      {lastAdded ? `${lastAdded.title}, size ${lastAdded.size}, added to bag` : ""}
    </p>
  );
}
