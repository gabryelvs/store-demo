# SECTOR—9

A demo streetwear storefront built to show a prospective client what a fast,
animated, accessible product catalogue can look like on their stack. It is a
sales demo, not a store: **checkout is deliberately disabled** (the cart
drawer shows "Demo store — checkout is disabled" instead of an order flow),
there is no payment processing, and nothing here moves real money.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm test              # 30 Vitest tests — cart reducer, selectors, persistence
npm run check:assets   # fails the build if the catalogue references a missing photo
```

`npm run build` runs `check:assets` automatically via `prebuild`, so a missing
product photo fails CI/build rather than shipping a broken image. `npm start`
serves the production build.

## Architecture

Pages are React Server Components under Next's App Router (`src/app`) —
the home page, `collections/[handle]`, and `products/[handle]` all read
directly from `src/lib/shop.ts`, which is the **only** place the rest of the
app is allowed to learn about products or collections; it wraps the mock
catalogue in `src/data/products.ts` (20 products, 5 collections) so a real
backend later means rewriting that one file. Cart state lives in
`src/lib/cart/`: a pure reducer (`reducer.ts`) and selectors (`selectors.ts`)
that are unit-tested in isolation, `storage.ts` for localStorage
persistence, and `context.tsx` exposing it all to client components. Scroll-driven
motion (reveals, parallax, the marquee) is built with GSAP and `@gsap/react`;
the two overlays — quick-view and the cart drawer — are animated with
framer-motion instead, since they're mount/unmount transitions rather than
scroll-position-driven ones.

## Re-skinning for a client

This is the point of keeping the demo around: turning it into a different
brand should be mechanical, not a rewrite.

1. **Colours and type** — edit the `@theme` block at the top of
   `src/app/globals.css` (`--color-ink`, `--color-surface`, `--color-line`,
   `--color-paper`, `--color-muted`, `--color-accent`, plus the two
   `--font-display` / `--font-body` variables). Everything in the UI is
   built from these tokens, so this alone re-themes the whole site.
2. **Catalogue** — replace `src/data/products.ts` with the client's
   products and collections. Nothing outside `src/lib/shop.ts` imports this
   file directly, so the shape just needs to match the existing `Product` /
   `Collection` / `Variant` types.
3. **Photos** — drop new webp files into `public/products/` and
   `public/collections/` using the `<handle>-<n>.webp` convention (e.g.
   `grid-tee-1.webp`, `grid-tee-2.webp` for the product with handle
   `grid-tee`), matching whatever `images` arrays you wrote into
   `products.ts`. Run `npm run check:assets` — it parses every
   `/products/...` and `/collections/...` path out of `products.ts` and
   fails loudly if any referenced file isn't on disk.
4. **Brand name** — the string `SECTOR—9` (with an em dash) appears in six
   places, not just the obvious layout ones:
   `src/app/layout.tsx` (root `<title>`), `src/components/layout/Header.tsx`,
   `src/components/layout/MobileNav.tsx`, `src/components/layout/Footer.tsx`,
   and the per-page `<title>` templates in
   `src/app/products/[handle]/page.tsx` and
   `src/app/collections/[handle]/page.tsx`. Search for the literal string to
   catch all of them — a couple of product titles in `products.ts` (e.g.
   "SECTOR CREW") also contain the word "SECTOR" but are unrelated product
   copy, not the brand string.

## Photo credits

See `public/products/CREDITS.md`. Ten of the photos used in the most recent
work on this project are individually credited there with photographer and
source URL. The remaining 41 photos were sourced from Unsplash and Pexels in
an earlier session whose per-file attribution records were lost before they
could be saved — both licences permit commercial use without attribution, so
this doesn't put the demo out of licence, but that batch has **no per-file
attribution** on record. Before reusing this project beyond an internal
demo, re-source those 41 images with attribution kept from the start.

## Not included

This is a front-end demo of a catalogue and cart UI, not a store:

- No payments or checkout — the buy flow stops at the cart drawer on
  purpose.
- No real inventory — stock is a static flag on each variant, not a live
  count.
- No accounts, authentication, or order history.
- No search.
- No CMS — the catalogue is a TypeScript file, not a content backend.
