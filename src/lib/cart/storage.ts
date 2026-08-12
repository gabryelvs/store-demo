import { MAX_QTY, type CartLine, type Size } from "./reducer";

export const CART_KEY = "sector9.cart.v1";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "OS"];

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const l = value as Record<string, unknown>;
  return (
    typeof l.handle === "string" &&
    typeof l.sku === "string" &&
    typeof l.size === "string" &&
    SIZES.includes(l.size as Size) &&
    typeof l.qty === "number" &&
    Number.isInteger(l.qty) &&
    l.qty > 0 &&
    l.qty <= MAX_QTY
  );
}

/**
 * Anything in localStorage was written by an older build, a different tab, or
 * a curious user with devtools. Treat it as untrusted input: validate shape,
 * drop products that no longer exist, and never throw on the way in.
 */
export function readCart(isKnownSku: (sku: string) => boolean): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine).filter((l) => isKnownSku(l.sku));
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    // Private mode or a full quota. A demo bag is not worth a crash.
  }
}
