import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketForge",
  description: "Multi-vendor marketplace platform for buyers, sellers, and platform operators."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
