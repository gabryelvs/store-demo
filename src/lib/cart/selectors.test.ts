import { describe, expect, it } from "vitest";
import { selectCount, selectSubtotalP } from "./selectors";
import type { CartState } from "./reducer";

const prices: Record<string, number> = { "TRK-HD-M": 8500, "CAP-OS": 3500 };
const priceOf = (sku: string) => prices[sku];

const state: CartState = {
  lines: [
    { handle: "track-hoodie", sku: "TRK-HD-M", size: "M", qty: 2 },
    { handle: "pit-cap", sku: "CAP-OS", size: "OS", qty: 1 },
  ],
};

describe("selectSubtotalP", () => {
  it("multiplies qty by the looked-up price", () => {
    expect(selectSubtotalP(state, priceOf)).toBe(2 * 8500 + 3500);
  });

  it("treats an unknown sku as zero rather than NaN", () => {
    const withGhost: CartState = {
      lines: [...state.lines, { handle: "gone", sku: "GHOST", size: "M", qty: 3 }],
    };
    expect(selectSubtotalP(withGhost, priceOf)).toBe(2 * 8500 + 3500);
  });

  it("is zero for an empty cart", () => {
    expect(selectSubtotalP({ lines: [] }, priceOf)).toBe(0);
  });
});

describe("selectCount", () => {
  it("sums quantities, not lines", () => {
    expect(selectCount(state)).toBe(3);
  });
});
