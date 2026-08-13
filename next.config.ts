import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fly runs this as a container, so build the self-contained server bundle
  // rather than expecting `next start` with a full node_modules beside it.
  output: "standalone",

  images: {
    // The 51 photos in public/ are already cut to the exact boxes the layout
    // uses (1200x1500 products, 1600x1000 tiles) and encoded as webp at q82,
    // so Next's optimizer would re-do work that is already done. Turning it
    // off also keeps sharp — and its memory appetite — out of a small VM.
    unoptimized: true,
  },
};

export default nextConfig;
