export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "OS";

export type CartLine = {
  handle: string;
  sku: string;
  size: Size;
  qty: number;
};

export type CartState = { lines: CartLine[] };

export type CartAction =
  | { type: "HYDRATE"; lines: CartLine[] }
  | { type: "ADD"; line: CartLine }
  | { type: "SET_QTY"; sku: string; qty: number }
  | { type: "REMOVE"; sku: string }
  | { type: "CLEAR" };

export const initialCart: CartState = { lines: [] };

/** A demo bag, not a warehouse. Ten of one size is already absurd. */
export const MAX_QTY = 10;

const clamp = (n: number) => Math.min(Math.max(n, 0), MAX_QTY);

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { lines: action.lines };

    case "ADD": {
      const existing = state.lines.find((l) => l.sku === action.line.sku);
      if (!existing) {
        return { lines: [...state.lines, { ...action.line, qty: clamp(action.line.qty) }] };
      }
      return {
        lines: state.lines.map((l) =>
          l.sku === action.line.sku ? { ...l, qty: clamp(l.qty + action.line.qty) } : l,
        ),
      };
    }

    case "SET_QTY": {
      const qty = clamp(action.qty);
      if (qty === 0) return { lines: state.lines.filter((l) => l.sku !== action.sku) };
      return {
        lines: state.lines.map((l) => (l.sku === action.sku ? { ...l, qty } : l)),
      };
    }

    case "REMOVE":
      return { lines: state.lines.filter((l) => l.sku !== action.sku) };

    case "CLEAR":
      return initialCart;
  }
}
