import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/lib/cart/context";
import { AnnouncementMarquee } from "@/components/layout/AnnouncementMarquee";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartAnnouncer } from "@/components/shop/CartAnnouncer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { QuickAddProvider } from "@/components/shop/QuickAddProvider";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display-src",
  weight: ["600", "800", "900"],
  style: ["normal", "italic"],
});

const body = Inter({ subsets: ["latin"], variable: "--font-body-src" });

export const metadata: Metadata = {
  // This demo is distributed by pasting its URL straight into a message, so
  // the unfurl (OG/Twitter card) is often a prospect's first impression of it.
  // Relative image paths below resolve against this origin, which is why it has
  // to be the deployed one — with localhost here the card renders blank for
  // everyone but you. Change it if the deployment moves to a custom domain.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://store-demo-ruddy.vercel.app",
  ),
  title: "SECTOR—9",
  description:
    "A fast, animated, accessible streetwear storefront demo — built to show what your catalogue could feel like on this stack.",
  openGraph: {
    title: "SECTOR—9",
    description:
      "A fast, animated, accessible streetwear storefront demo — built to show what your catalogue could feel like on this stack.",
    type: "website",
    images: [{ url: "/collections/drop-04.webp", width: 1600, height: 1000 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* GSAP animations are individually gated with gsap.matchMedia(motionOK),
            and the global @media (prefers-reduced-motion: reduce) block in
            globals.css strips CSS transitions/animations down to opacity and
            colour. Neither covers framer-motion, which drives the quick-view
            and cart-drawer overlays imperatively (not through CSS transitions)
            and otherwise ignores the OS setting entirely. reducedMotion="user"
            is framer-motion's own equivalent: values still update, but land in
            their final state instantly instead of animating. */}
        <MotionConfig reducedMotion="user">
          <CartProvider>
            <AnnouncementMarquee />
            <Header />
            <CartAnnouncer />
            <QuickAddProvider>
              <main id="main">
                {children}
              </main>
            </QuickAddProvider>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
