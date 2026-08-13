// Fails the build if the catalogue — or a component that hard-codes its own
// image path outside the catalogue (Hero.tsx, LookbookParallax.tsx) —
// references an image that is not on disk. A missing photo must never reach
// the live demo URL.
import { access, glob, readFile } from "node:fs/promises";
import { join } from "node:path";

// Requires a file extension (".webp", etc.) right before the closing quote so
// this only matches actual image paths, not route links like
// href="/collections/drop-04" — those share the /products|collections/
// prefix with real image paths but point at a page, not a file on disk.
const PATH_RE = /"(\/(?:products|collections)\/[^"]+\.\w+)"/g;

async function extractPaths(relPath) {
  const text = await readFile(join(process.cwd(), relPath), "utf8");
  return [...text.matchAll(PATH_RE)].map((m) => m[1]);
}

const found = new Map(); // path -> Set of files it was found in

const catalogueOnly = await extractPaths("src/data/products.ts");
for (const p of catalogueOnly) {
  if (!found.has(p)) found.set(p, new Set());
  found.get(p).add("src/data/products.ts");
}

for await (const file of glob("src/components/**/*.tsx", { cwd: process.cwd() })) {
  const relPath = file.replaceAll("\\", "/");
  for (const p of await extractPaths(relPath)) {
    if (!found.has(p)) found.set(p, new Set());
    found.get(p).add(relPath);
  }
}

const paths = [...found.keys()];

if (paths.length === 0) {
  console.error("check:assets — no image paths extracted from src/data/products.ts or src/components/**/*.tsx");
  console.error("This usually means the files moved or now build paths dynamically.");
  process.exit(1);
}

const missing = [];
for (const p of paths) {
  try {
    await access(join(process.cwd(), "public", p));
  } catch {
    missing.push(p);
  }
}

if (missing.length > 0) {
  console.error(`check:assets — ${missing.length} missing file(s):`);
  for (const m of missing) {
    const referencedBy = [...found.get(m)].join(", ");
    console.error(`  public${m}  (referenced by ${referencedBy})`);
  }
  process.exit(1);
}

console.log(`check:assets — ${paths.length} image paths OK`);
