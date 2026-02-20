import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./providers"; // <--- IMPORT THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UmMart - Halal Marketplace",
  description: "Supported by 100% Usahawan Baru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* WRAP EVERYTHING INSIDE CART PROVIDER */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}