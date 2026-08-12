import { beforeEach, describe, expect, it } from "vitest";
import { CART_KEY, readCart, writeCart } from "./storage";
import type { CartLine } from "./reducer";

const known = new Set(["TRK-HD-M", "CAP-OS"]);
const isKnownSku = (sku: string) => known.has(sku);

const line: CartLine = { handle: "track-hoodie", sku: "TRK-HD-M", size: "M", qty: 2 };

beforeEach(() => localStorage.clear());

describe("readCart", () => {
  it("returns an empty array when nothing is stored", () => {
    expect(readCart(isKnownSku)).toEqual([]);
  });

  it("restores a valid stored cart", () => {
    localStorage.setItem(CART_KEY, JSON.stringify([line]));
    expect(readCart(isKnownSku)).toEqual([line]);
  });

  it("drops lines whose sku is no longer in the catalogue", () => {
    const ghost: CartLine = { handle: "gone", sku: "GHOST", size: "M", qty: 1 };
    localStorage.setItem(CART_KEY, JSON.stringify([line, ghost]));
    expect(readCart(isKnownSku)).toEqual([line]);
  });

  it("returns an empty array for malformed JSON instead of throwing", () => {
    localStorage.setItem(CART_KEY, "{not json");
    expect(readCart(isKnownSku)).toEqual([]);
  });

  it("returns an empty array when the stored value is not an array", () => {
    localStorage.setItem(CART_KEY, JSON.stringify({ lines: [line] }));
    expect(readCart(isKnownSku)).toEqual([]);
  });

  it("drops entries with the wrong shape", () => {
    localStorage.setItem(CART_KEY, JSON.stringify([line, { sku: "CAP-OS" }, null, 7]));
    expect(readCart(isKnownSku)).toEqual([line]);
  });

  it("drops entries with a non-positive qty", () => {
    localStorage.setItem(CART_KEY, JSON.stringify([{ ...line, qty: 0 }]));
    expect(readCart(isKnownSku)).toEqual([]);
  });
});

describe("writeCart", () => {
  it("round-trips through readCart", () => {
    writeCart([line]);
    expect(readCart(isKnownSku)).toEqual([line]);
  });
});
