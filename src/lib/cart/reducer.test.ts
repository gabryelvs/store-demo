import { describe, expect, it } from "vitest";
import { cartReducer, initialCart, type CartLine } from "./reducer";

const hoodieM: CartLine = { handle: "track-hoodie", sku: "TRK-HD-M", size: "M", qty: 1 };
const hoodieL: CartLine = { handle: "track-hoodie", sku: "TRK-HD-L", size: "L", qty: 1 };

describe("cartReducer", () => {
  it("adds a line with qty 1", () => {
    const state = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    expect(state.lines).toEqual([hoodieM]);
  });

  it("merges the same sku instead of duplicating it", () => {
    let state = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    state = cartReducer(state, { type: "ADD", line: hoodieM });
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].qty).toBe(2);
  });

  it("keeps different sizes of the same product as separate lines", () => {
    let state = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    state = cartReducer(state, { type: "ADD", line: hoodieL });
    expect(state.lines).toHaveLength(2);
  });

  it("clamps qty at 10 when adding", () => {
    let state = cartReducer(initialCart, { type: "ADD", line: { ...hoodieM, qty: 9 } });
    state = cartReducer(state, { type: "ADD", line: { ...hoodieM, qty: 5 } });
    expect(state.lines[0].qty).toBe(10);
  });

  it("clamps qty at 10 on SET_QTY", () => {
    const added = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    const state = cartReducer(added, { type: "SET_QTY", sku: "TRK-HD-M", qty: 99 });
    expect(state.lines[0].qty).toBe(10);
  });

  it("removes the line when SET_QTY is 0", () => {
    const added = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    const state = cartReducer(added, { type: "SET_QTY", sku: "TRK-HD-M", qty: 0 });
    expect(state.lines).toEqual([]);
  });

  it("removes a line by sku", () => {
    const added = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    const state = cartReducer(added, { type: "REMOVE", sku: "TRK-HD-M" });
    expect(state.lines).toEqual([]);
  });

  it("ignores removal of an unknown sku without throwing", () => {
    const added = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    const state = cartReducer(added, { type: "REMOVE", sku: "NOPE" });
    expect(state.lines).toEqual([hoodieM]);
  });

  it("ignores SET_QTY for an unknown sku", () => {
    const added = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    const state = cartReducer(added, { type: "SET_QTY", sku: "NOPE", qty: 4 });
    expect(state.lines).toEqual([hoodieM]);
  });

  it("replaces all lines on HYDRATE", () => {
    const added = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    const state = cartReducer(added, { type: "HYDRATE", lines: [hoodieL] });
    expect(state.lines).toEqual([hoodieL]);
  });

  it("empties the cart on CLEAR", () => {
    const added = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    expect(cartReducer(added, { type: "CLEAR" })).toEqual(initialCart);
  });

  it("never mutates the previous state", () => {
    const added = cartReducer(initialCart, { type: "ADD", line: hoodieM });
    cartReducer(added, { type: "ADD", line: hoodieM });
    expect(added.lines[0].qty).toBe(1);
  });
});
