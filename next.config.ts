import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every route is prerendered at build time (collections and products come
  // from generateStaticParams) and nothing needs a server, so export plain
  // files. Cloudflare Pages serves out/ as-is, and with no Next server running
  // there is no server-side attack surface to keep patched.
  output: "export",
  // Emit products/<handle>/index.html rather than products/<handle>.html next
  // to a products/<handle>/ folder of navigation data, so any static host
  // resolves each page without guessing between the file and the folder.
  trailingSlash: true,

  images: {
    // The 51 photos in public/ are already cut to the exact boxes the layout
    // uses (1200x1500 products, 1600x1000 tiles) and encoded as webp at q82,
    // so Next's optimizer would re-do work that is already done. A static
    // export has no image optimizer anyway.
    unoptimized: true,
  },
};

export default nextConfig;
