import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getProductsInCollection } from "@/lib/shop";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductRail } from "@/components/sections/ProductRail";

export function generateStaticParams() {
  return getProducts().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata(props: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const product = getProduct(handle);
  return { title: product ? `${product.title} — SECTOR—9` : "SECTOR—9" };
}

export default async function ProductPage(props: PageProps<"/products/[handle]">) {
  const { handle } = await props.params;
  const product = getProduct(handle);
  if (!product) notFound();

  const related = product.collections[0];
  // getProductsInCollection(related) includes this product itself, so the
  // "more than one" check has to be against the count once it's excluded —
  // otherwise a collection holding only this product would still pass the
  // raw length check and render an empty rail.
  const hasRelated = getProductsInCollection(related).filter((p) => p.handle !== handle).length > 0;

  return (
    <>
      <ProductDetail product={product} />
      {hasRelated && <ProductRail title="MORE FROM THIS COLLECTION" handle={related} exclude={handle} />}
    </>
  );
}
