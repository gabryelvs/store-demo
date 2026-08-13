import Image from "next/image";
import Link from "next/link";
import { getCollection } from "@/lib/shop";
import { Reveal } from "@/components/motion/Reveal";

export function CollectionTiles({ handles }: { handles: string[] }) {
  const collections = handles.map(getCollection).filter((c) => c !== undefined);

  return (
    <section className="grid gap-4 px-4 py-14 md:grid-cols-2 md:px-8">
      {collections.map((c, i) => (
        <Reveal key={c.handle} delay={i * 0.08}>
          <Link href={`/collections/${c.handle}`} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <Image
                src={c.tileImage}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[var(--duration-zoom)] ease-expo group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-ink/25" />
              <div className="absolute bottom-5 left-5">
                <h2 className="font-display text-2xl font-extrabold italic tracking-[-0.02em]">{c.title}</h2>
                <p className="pt-1 text-sm text-paper/75">{c.tagline}</p>
                <span className="relative mt-3 inline-block font-display text-[10px] tracking-[0.2em] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-[var(--duration-ui)] after:ease-brand group-hover:after:scale-x-100">
                  SHOP NOW
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
