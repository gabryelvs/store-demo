import Image from "next/image";
import Link from "next/link";
import { SplitHeading } from "@/components/motion/SplitHeading";

export function Hero() {
  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <Image
        src="/collections/drop-04.webp"
        alt="Drop 04 campaign image"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

      <div className="absolute bottom-10 left-0 w-full px-4 md:px-8">
        <SplitHeading
          as="h1"
          className="font-display text-[clamp(3rem,11vw,9rem)] font-black italic leading-[0.86] tracking-[-0.04em]"
        >
          GRID READY
        </SplitHeading>

        <Link
          href="/collections/drop-04"
          className="group mt-6 inline-flex items-center gap-2 bg-accent px-6 py-3 font-display text-[11px] font-extrabold tracking-[0.16em] text-ink"
        >
          SHOP DROP 04
          <span className="transition-transform duration-[var(--duration-ui)] ease-brand group-hover:translate-x-[5px]">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
