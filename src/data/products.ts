import type { Size } from "@/lib/cart/reducer";

export type Badge = "NEW" | "LAST PAIRS" | "MADE TO ORDER" | "ARCHIVE";

export type Variant = { size: Size; sku: string; inStock: boolean };

export type Product = {
  handle: string;
  title: string;
  /** Pence. Integer. Always. */
  priceP: number;
  /** Strikethrough price, in pence. */
  compareAtP?: number;
  /** [0] primary, [1] hover/on-body, rest are PDP gallery shots. */
  images: string[];
  collections: string[];
  badges: Badge[];
  variants: Variant[];
  description: string;
  details: string[];
};

export type Collection = {
  handle: string;
  title: string;
  tagline: string;
  tileImage: string;
};

export const COLLECTIONS: Collection[] = [
  { handle: "drop-04", title: "DROP 04", tagline: "The grid-ready capsule", tileImage: "/collections/drop-04.webp" },
  { handle: "core", title: "LN CORE", tagline: "Everyday weight", tileImage: "/collections/core.webp" },
  { handle: "outerwear", title: "OUTERWEAR", tagline: "Built for the paddock", tileImage: "/collections/outerwear.webp" },
  { handle: "accessories", title: "ACCESSORIES", tagline: "Finish the fit", tileImage: "/collections/accessories.webp" },
  { handle: "archive", title: "ARCHIVE", tagline: "Last of the run", tileImage: "/collections/archive.webp" },
];

const APPAREL: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

/** Builds the six apparel variants, marking the listed sizes sold out. */
function apparelVariants(skuBase: string, soldOut: Size[] = []): Variant[] {
  return APPAREL.map((size) => ({
    size,
    sku: `${skuBase}-${size}`,
    inStock: !soldOut.includes(size),
  }));
}

function oneSize(skuBase: string, inStock = true): Variant[] {
  return [{ size: "OS", sku: `${skuBase}-OS`, inStock }];
}

export const PRODUCTS: Product[] = [
  {
    handle: "track-hoodie",
    title: "TRACK HOODIE",
    priceP: 8500,
    images: [
      "/products/track-hoodie-1.webp",
      "/products/track-hoodie-2.webp",
      "/products/track-hoodie-3.webp",
    ],
    collections: ["drop-04", "core"],
    badges: ["NEW"],
    variants: apparelVariants("TRK-HD", ["XXL"]),
    description:
      "Heavyweight loopback fleece with a boxy body and ribbed cuffs. Cut to sit just below the belt.",
    details: ["480gsm cotton loopback", "Boxy fit — size down for a clean drape", "Wash cold, dry flat"],
  },
  {
    handle: "grid-tee",
    title: "GRID TEE",
    priceP: 4000,
    images: ["/products/grid-tee-1.webp", "/products/grid-tee-2.webp"],
    collections: ["drop-04", "core"],
    badges: ["NEW"],
    variants: apparelVariants("GRD-TE"),
    description: "Mid-weight jersey tee with a dropped shoulder and a printed sector graphic at the back.",
    details: ["220gsm combed cotton", "Regular fit", "Wash cold, inside out"],
  },
  {
    handle: "pit-crew-jacket",
    title: "PIT CREW JACKET",
    priceP: 19500,
    compareAtP: 22500,
    images: [
      "/products/pit-crew-jacket-1.webp",
      "/products/pit-crew-jacket-2.webp",
      "/products/pit-crew-jacket-3.webp",
      "/products/pit-crew-jacket-4.webp",
    ],
    collections: ["outerwear", "drop-04"],
    badges: ["MADE TO ORDER"],
    variants: apparelVariants("PIT-JK", ["XS", "XXL"]),
    description: "Panelled softshell with a storm flap, zip pockets and reflective piping down the sleeve.",
    details: ["Water-repellent softshell", "Relaxed fit", "Made to order — ships in 3 weeks"],
  },
  {
    handle: "pit-cap",
    title: "PIT STOP CAP",
    priceP: 3500,
    images: ["/products/pit-cap-1.webp", "/products/pit-cap-2.webp"],
    collections: ["accessories", "drop-04"],
    badges: [],
    variants: oneSize("CAP-PIT"),
    description: "Six-panel cotton twill cap with a curved brim and an embroidered sector mark.",
    details: ["100% cotton twill", "Adjustable strap", "One size"],
  },
  {
    handle: "sector-crew",
    title: "SECTOR CREW",
    priceP: 7500,
    images: ["/products/sector-crew-1.webp", "/products/sector-crew-2.webp"],
    collections: ["core", "drop-04"],
    badges: [],
    variants: apparelVariants("SEC-CR"),
    description: "Midweight fleece crewneck with a dropped shoulder and ribbed trims at the cuff and hem.",
    details: ["320gsm cotton fleece", "Regular fit", "Wash cold, tumble dry low"],
  },
  {
    handle: "paddock-pant",
    title: "PADDOCK PANT",
    priceP: 9500,
    images: ["/products/paddock-pant-1.webp", "/products/paddock-pant-2.webp"],
    collections: ["core", "drop-04"],
    badges: ["NEW"],
    variants: apparelVariants("PDK-PT", ["XS"]),
    description: "Straight-leg cotton twill trouser with an elasticated waistband and articulated knees.",
    details: ["280gsm cotton twill", "Straight fit", "Wash cold, hang dry"],
  },
  {
    handle: "apex-tee",
    title: "APEX TEE",
    priceP: 4000,
    compareAtP: 5000,
    images: ["/products/apex-tee-1.webp", "/products/apex-tee-2.webp"],
    collections: ["core", "archive"],
    badges: ["ARCHIVE"],
    variants: apparelVariants("APX-TE", ["XS", "S"]),
    description: "Lightweight jersey tee with a crew neck and a small chest print, from an earlier drop.",
    details: ["180gsm combed cotton", "Regular fit", "Wash cold, inside out"],
  },
  {
    handle: "box-logo-hoodie",
    title: "BOX LOGO HOODIE",
    priceP: 8500,
    images: ["/products/box-logo-hoodie-1.webp", "/products/box-logo-hoodie-2.webp"],
    collections: ["core"],
    badges: [],
    variants: apparelVariants("BOX-HD"),
    description: "Heavyweight fleece hoodie with a boxed logo print across the chest and a kangaroo pocket.",
    details: ["440gsm cotton fleece", "Regular fit", "Wash cold, dry flat"],
  },
  {
    handle: "thermal-longsleeve",
    title: "THERMAL LONGSLEEVE",
    priceP: 5500,
    images: ["/products/thermal-longsleeve-1.webp", "/products/thermal-longsleeve-2.webp"],
    collections: ["core", "drop-04"],
    badges: [],
    variants: apparelVariants("THM-LS", ["XXL"]),
    description: "Brushed-back thermal longsleeve with a ribbed crew neck and thumbhole cuffs.",
    details: ["240gsm brushed cotton", "Regular fit", "Wash cold, inside out"],
  },
  {
    handle: "race-gilet",
    title: "RACE GILET",
    priceP: 12500,
    images: [
      "/products/race-gilet-1.webp",
      "/products/race-gilet-2.webp",
      "/products/race-gilet-3.webp",
    ],
    collections: ["outerwear"],
    badges: ["MADE TO ORDER"],
    variants: apparelVariants("RCE-GL", ["XS", "XXL"]),
    description: "Quilted gilet with a full-zip front, stand collar and two zip hand pockets.",
    details: ["Quilted polyfill shell", "Relaxed fit", "Made to order — ships in 3 weeks"],
  },
  {
    handle: "paddock-shell",
    title: "PADDOCK SHELL",
    priceP: 22000,
    images: [
      "/products/paddock-shell-1.webp",
      "/products/paddock-shell-2.webp",
      "/products/paddock-shell-3.webp",
    ],
    collections: ["outerwear", "drop-04"],
    badges: ["NEW"],
    variants: apparelVariants("PDK-SH"),
    description: "Taped-seam waterproof shell with a stowable hood and underarm vents.",
    details: ["2-layer waterproof nylon", "Relaxed fit", "Wash cold, do not tumble dry"],
  },
  {
    handle: "garage-coach-jacket",
    title: "GARAGE COACH JACKET",
    priceP: 15500,
    compareAtP: 18000,
    images: [
      "/products/garage-coach-jacket-1.webp",
      "/products/garage-coach-jacket-2.webp",
      "/products/garage-coach-jacket-3.webp",
    ],
    collections: ["outerwear", "archive"],
    badges: ["ARCHIVE"],
    variants: apparelVariants("GRG-CJ", ["M", "L"]),
    description: "Snap-button coach jacket in a brushed twill with a contrast collar, from an earlier drop.",
    details: ["220gsm cotton twill", "Boxy fit", "Wash cold, hang dry"],
  },
  {
    handle: "sector-beanie",
    title: "SECTOR BEANIE",
    priceP: 3000,
    images: ["/products/sector-beanie-1.webp", "/products/sector-beanie-2.webp"],
    collections: ["accessories"],
    badges: [],
    variants: oneSize("SEC-BN"),
    description: "Ribbed knit beanie with a folded cuff and a woven sector tab.",
    details: ["100% acrylic rib knit", "One size", "Hand wash cold"],
  },
  {
    handle: "paddock-socks",
    title: "PADDOCK SOCKS",
    priceP: 1250,
    images: ["/products/paddock-socks-1.webp", "/products/paddock-socks-2.webp"],
    collections: ["accessories", "core"],
    badges: [],
    variants: oneSize("PDK-SK"),
    description: "Crew-length socks in a cushioned cotton blend with a reinforced heel and toe.",
    details: ["75% cotton, 20% nylon, 5% elastane", "One size", "Wash cold, tumble dry low"],
  },
  {
    handle: "tool-bag",
    title: "TOOL BAG",
    priceP: 6500,
    images: ["/products/tool-bag-1.webp", "/products/tool-bag-2.webp"],
    collections: ["accessories", "drop-04"],
    badges: ["LAST PAIRS"],
    variants: oneSize("TOL-BG"),
    description: "Canvas tool bag with a zip top, external pocket and webbing carry handles.",
    details: ["600D canvas", "One size", "Wipe clean"],
  },
  {
    handle: "pit-lanyard",
    title: "PIT LANYARD",
    priceP: 1500,
    images: ["/products/pit-lanyard-1.webp", "/products/pit-lanyard-2.webp"],
    collections: ["accessories"],
    badges: [],
    variants: oneSize("PIT-LY"),
    description: "Woven lanyard with a metal clip and a rubberised sector tag.",
    details: ["Woven polyester webbing", "One size", "Wipe clean"],
  },
  {
    handle: "grid-scarf",
    title: "GRID SCARF",
    priceP: 4500,
    images: ["/products/grid-scarf-1.webp", "/products/grid-scarf-2.webp"],
    collections: ["accessories", "archive"],
    badges: ["ARCHIVE"],
    variants: oneSize("GRD-SC", false),
    description: "Brushed wool-blend scarf with a woven grid pattern, from an earlier drop.",
    details: ["70% wool, 30% acrylic", "One size", "Dry clean only"],
  },
  {
    handle: "heritage-tee-01",
    title: "HERITAGE TEE 01",
    priceP: 3500,
    compareAtP: 4500,
    images: ["/products/heritage-tee-01-1.webp", "/products/heritage-tee-01-2.webp"],
    collections: ["archive"],
    badges: ["ARCHIVE"],
    variants: apparelVariants("HER-01", ["XS", "S", "M"]),
    description: "Garment-dyed tee with a worn-in hand feel and a faded chest print, from the first drop.",
    details: ["200gsm garment-dyed cotton", "Regular fit", "Wash cold, inside out"],
  },
  {
    handle: "heritage-crew-02",
    title: "HERITAGE CREW 02",
    priceP: 6000,
    compareAtP: 7500,
    images: ["/products/heritage-crew-02-1.webp", "/products/heritage-crew-02-2.webp"],
    collections: ["archive"],
    badges: ["ARCHIVE", "LAST PAIRS"],
    variants: apparelVariants("HER-02", ["XS", "XXL"]),
    description: "Crewneck sweatshirt in a heavier fleece with a small embroidered logo, from the second drop.",
    details: ["360gsm cotton fleece", "Regular fit", "Wash cold, dry flat"],
  },
  {
    handle: "night-cap",
    title: "NIGHT CAP",
    priceP: 3500,
    images: ["/products/night-cap-1.webp", "/products/night-cap-2.webp"],
    collections: ["accessories", "drop-04"],
    badges: ["NEW"],
    variants: oneSize("NGT-CP"),
    description: "Low-profile cap in a brushed twill with a curved brim and a tonal embroidered mark.",
    details: ["100% cotton twill", "Adjustable strap", "One size"],
  },
];
