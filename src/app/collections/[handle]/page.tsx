import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, getCollections, getProductsInCollection } from "@/lib/shop";
import { CollectionView } from "@/components/shop/CollectionView";

export function generateStaticParams() {
  return getCollections().map((c) => ({ handle: c.handle }));
}

export async function generateMetadata(props: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const collection = getCollection(handle);
  return { title: collection ? `${collection.title} — SECTOR—9` : "SECTOR—9" };
}

export default async function CollectionPage(props: PageProps<"/collections/[handle]">) {
  const { handle } = await props.params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  const products = getProductsInCollection(handle);

  return (
    <div className="px-4 py-14 md:px-8">
      <header className="pb-10">
        <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-black italic leading-[0.9] tracking-[-0.04em]">
          {collection.title}
        </h1>
        <p className="pt-2 text-sm text-muted">
          {collection.tagline} · {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      </header>

      <CollectionView products={products} />
    </div>
  );
}
