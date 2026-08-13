// Converts tmp-photos/*.jpg to the webp files the catalogue expects.
// Product shots are 4:5 at 1200x1500; collection tiles are 16:10 at 1600x1000.
import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SRC = "tmp-photos";

await mkdir("public/products", { recursive: true });
await mkdir("public/collections", { recursive: true });

for (const file of await readdir(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;

  const isCollection = file.startsWith("collection-");
  const base = file.replace(/^collection-/, "").replace(/\.(jpe?g|png)$/i, "");
  const out = isCollection
    ? join("public/collections", `${base}.webp`)
    : join("public/products", `${base}.webp`);

  await sharp(join(SRC, file))
    .resize(isCollection ? 1600 : 1200, isCollection ? 1000 : 1500, {
      fit: "cover",
      position: "attention",
    })
    .webp({ quality: 82 })
    .toFile(out);

  console.log(`${file} → ${out}`);
}
