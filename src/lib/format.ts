const whole = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const withPence = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

/** Pence in, display string out. The only place money becomes text. */
export function formatPrice(pence: number): string {
  const pounds = pence / 100;
  return pence % 100 === 0 ? whole.format(pounds) : withPence.format(pounds);
}
