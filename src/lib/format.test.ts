import { expect, it } from "vitest";
import { formatPrice } from "./format";

it("drops the decimals on whole pounds", () => {
  expect(formatPrice(8500)).toBe("£85");
});

it("keeps two decimals when there are pence", () => {
  expect(formatPrice(1250)).toBe("£12.50");
});

it("formats zero as £0", () => {
  expect(formatPrice(0)).toBe("£0");
});

it("groups thousands", () => {
  expect(formatPrice(123400)).toBe("£1,234");
});
