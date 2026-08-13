import { Hero } from "@/components/sections/Hero";
import { CollectionTiles } from "@/components/sections/CollectionTiles";
import { ProductRail } from "@/components/sections/ProductRail";
import { LookbookParallax } from "@/components/sections/LookbookParallax";
import { Newsletter } from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CollectionTiles handles={["drop-04", "core"]} />
      <ProductRail title="DROP 04" handle="drop-04" />
      <CollectionTiles handles={["outerwear", "accessories"]} />
      <ProductRail title="LN CORE" handle="core" />
      <LookbookParallax />
      <ProductRail title="ARCHIVE" handle="archive" />
      <Newsletter />
    </>
  );
}
