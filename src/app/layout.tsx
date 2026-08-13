import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart/context";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display-src",
  weight: ["600", "800", "900"],
  style: ["normal", "italic"],
});

const body = Inter({ subsets: ["latin"], variable: "--font-body-src" });

export const metadata: Metadata = {
  title: "SECTOR—9",
  description: "Demo streetwear store.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
