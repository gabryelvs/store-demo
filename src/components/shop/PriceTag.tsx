import { formatPrice } from "@/lib/format";

export function PriceTag({ priceP, compareAtP }: { priceP: number; compareAtP?: number }) {
  return (
    <span className="font-display text-[13px] font-bold tracking-[0.06em]">
      {formatPrice(priceP)}
      {compareAtP !== undefined && (
        <span className="ml-2 text-muted line-through">{formatPrice(compareAtP)}</span>
      )}
    </span>
  );
}
