import Link from "next/link";
import { getCollections } from "@/lib/shop";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface px-4 py-14 md:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-extrabold italic tracking-[-0.02em]">SECTOR—9</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            A demonstration storefront. Nothing here ships, and no payment is taken.
          </p>
        </div>

        <nav aria-label="Footer collections" className="flex flex-col gap-2">
          {getCollections().map((c) => (
            <Link
              key={c.handle}
              href={`/collections/${c.handle}`}
              className="font-display text-[11px] tracking-[0.16em] text-muted transition-colors duration-[var(--duration-ui)] hover:text-paper"
            >
              {c.title}
            </Link>
          ))}
        </nav>

        <p className="self-end font-display text-[11px] tracking-[0.16em] text-muted">
          BUILT BY GABRYEL VERISSIMO
        </p>
      </div>
    </footer>
  );
}
