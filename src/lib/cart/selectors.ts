import type { CartState } from "./reducer";

export type PriceLookup = (sku: string) => number | undefined;

/**
 * Totals are derived, never stored. The cart holds skus and quantities; the
 * catalogue holds prices. A stale total is impossible if it is recomputed.
 */
export function selectSubtotalP(state: CartState, priceOf: PriceLookup): number {
  return state.lines.reduce((sum, line) => sum + (priceOf(line.sku) ?? 0) * line.qty, 0);
}

export function selectCount(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.qty, 0);
}
