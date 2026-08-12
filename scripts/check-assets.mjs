// Fails the build if the catalogue references an image that is not on disk.
// A missing photo must never reach the live demo URL.
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const src = await readFile(join(process.cwd(), "src/data/products.ts"), "utf8");
const paths = [...new Set([...src.matchAll(/"(\/(?:products|collections)\/[^"]+)"/g)].map((m) => m[1]))];

if (paths.length === 0) {
  console.error("check:assets — no image paths extracted from src/data/products.ts");
  console.error("This usually means the file moved or now builds paths dynamically.");
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
  for (const m of missing) console.error(`  public${m}`);
  process.exit(1);
}

console.log(`check:assets — ${paths.length} image paths OK`);
