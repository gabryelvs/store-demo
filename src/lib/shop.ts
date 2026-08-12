import { COLLECTIONS, PRODUCTS, type Collection, type Product, type Variant } from "@/data/products";

/**
 * The only place the rest of the app learns about products. Swapping the mock
 * catalogue for a real backend later means rewriting this file and nothing else.
 */
export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getProduct(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle);
}

export function getCollections(): Collection[] {
  return COLLECTIONS;
}

export function getCollection(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}

export function getProductsInCollection(handle: string): Product[] {
  return PRODUCTS.filter((p) => p.collections.includes(handle));
}

type Located = { product: Product; variant: Variant };

const bySku = new Map<string, Located>(
  PRODUCTS.flatMap((product) => product.variants.map((variant) => [variant.sku, { product, variant }] as const)),
);

export function findVariant(sku: string): Located | undefined {
  return bySku.get(sku);
}

export function priceOfSku(sku: string): number | undefined {
  return bySku.get(sku)?.product.priceP;
}

export function isKnownSku(sku: string): boolean {
  return bySku.has(sku);
}
