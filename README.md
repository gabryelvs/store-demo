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
serves the exported site from `out/`.

## Deployment

Live at **https://demo.gabryelverissimo.dev**, served as plain files from
Cloudflare Pages (free plan, which allows commercial use).

Every route is prerendered at build time (collections and products come from
`generateStaticParams`) and nothing needs a server, so `next.config.ts` sets
`output: "export"` and `npm run build` writes the whole site to `out/`. With no
Next server running there is no server-side code to keep patched: the site
is HTML, JS and images on a CDN. `trailingSlash: true` gives each page its own
`index.html` (`products/<handle>/index.html`) so any static host resolves it.
`images.unoptimized` stays on because the 51 photos in `public/` are already
encoded at exactly the sizes the layout renders, and a static export has no
image optimizer anyway.

To redeploy after a change:

```bash
npm run build
npx wrangler pages deploy out --project-name store-demo-gv --branch master
```

`npm start` serves `out/` locally. If the site moves to another domain, update
`metadataBase` in `src/app/layout.tsx` (or set `NEXT_PUBLIC_SITE_ORIGIN` at
build time) or link previews will keep resolving their image against the old
origin.

It previously ran as a Next.js server on Fly.io (`output: "standalone"` and a
Dockerfile). It moved to a static export on 2026-09-23, when a Next.js
security patch was due and Fly deploys were blocked; see `docs/build-log.md`.

`check:assets` (`scripts/check-assets.mjs`) scans both `src/data/products.ts`
and every `.tsx` file under `src/components/**` for `/products/...` and
`/collections/...` string literals — the catalogue isn't the only place a
photo path can be hard-coded (see `Hero.tsx` and `LookbookParallax.tsx`
below), and a path hard-coded outside `products.ts` can go missing just as
easily as one inside it.

## Architecture

Pages are React Server Components under Next's App Router (`src/app`) —
the home page, `collections/[handle]`, and `products/[handle]` all read
directly from `src/lib/shop.ts`, which is the **only** place the rest of the
app is allowed to learn about products or collections; it wraps the mock
catalogue in `src/data/products.ts` (20 products, 5 collections). That
single-seam design keeps the *read* API consistent, but don't oversell what
it buys you: `shop.ts`'s functions are synchronous, in-memory lookups, and
five client components call them directly and unconditionally on every
render — `Header`, `MobileNav`, `ProductRail`, `CartDrawer`, and
`lib/cart/context`. Point `shop.ts` at a real backend and every one of those
becomes a component that needs to fetch, which means restructuring all five
(loading states, Suspense boundaries or async data-fetching, error handling
for a call that can now fail), not just editing one file. It also means the
entire catalogue currently ships in the client JS bundle, since these
components import `shop.ts` straight into client-rendered code — there's no
server/client split to lose today because there isn't one. Cart state lives in
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
   `products.ts`. **Every product needs at least two photos.**
   `ProductCard` renders `images[0]` and `images[1]` side by side (the
   second is the hover/cross-fade shot) and will throw at render time if
   `images[1]` is missing — a product with a single photo isn't a smaller
   version of the card, it's a crash. Run `npm run check:assets` — it
   parses every `/products/...` and `/collections/...` path out of
   `products.ts` and out of `src/components/**/*.tsx` (see "Running it"
   above) and fails loudly if any referenced file isn't on disk. Note that
   this only checks paths *exist*; it can't catch a product shipped with
   just one photo, since one valid path is still a valid path.
4. **The `drop-04` handle** — unlike other collection handles, `drop-04`
   isn't only data-driven. It's hard-coded outside the catalogue in
   `src/components/sections/Hero.tsx` (the hero's CTA link),
   `src/app/not-found.tsx` (the 404 page's CTA),
   `src/components/shop/CartDrawer.tsx` (the empty-bag CTA), and
   `src/app/page.tsx` (a `CollectionTiles` tile and a `ProductRail`
   handle). A client catalogue without a collection literally named
   `drop-04` will still build and deploy, but those four CTAs link to a
   collection page with zero products — search for the literal string
   `drop-04` and repoint each one at whatever collection you want
   featured.
5. **Brand name** — the string `SECTOR—9` (with an em dash) appears in six
   places, not just the obvious layout ones:
   `src/app/layout.tsx` (root `<title>`), `src/components/layout/Header.tsx`,
   `src/components/layout/MobileNav.tsx`, `src/components/layout/Footer.tsx`,
   and the per-page `<title>` templates in
   `src/app/products/[handle]/page.tsx` and
   `src/app/collections/[handle]/page.tsx`. Search for the literal string to
   catch all of them — a couple of product titles in `products.ts` (e.g.
   "SECTOR CREW") also contain the word "SECTOR" but are unrelated product
   copy, not the brand string.
6. **Other copy and identity strings** — the brand-name and `drop-04`
   sweeps above don't catch everything a fork needs to change. Also check:
   `src/components/layout/AnnouncementMarquee.tsx` (the ticker items —
   "DROP 04 LIVE NOW", shipping and production-run copy),
   `src/components/sections/Hero.tsx` ("GRID READY" headline),
   `src/components/sections/LookbookParallax.tsx` ("BUILT FOR THE
   PADDOCK..." line and the `outerwear.webp` image it's built around),
   `src/components/sections/Newsletter.tsx` ("GET DROP 05 FIRST"),
   `src/components/layout/Footer.tsx` (the tagline and the "BUILT BY..."
   credit line), the meta `description` (and OpenGraph copy) in
   `src/app/layout.tsx`, and the `sector9.cart.v1` localStorage key
   exported as `CART_KEY` from `src/lib/cart/storage.ts` — harmless to
   leave as-is, but a client whose site shares a parent domain with another
   `sector9`-keyed app could collide with it.

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
