import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bunga's Digital Archive",
  description:
    "Warm retro portfolio for Bunga Citra Lestari Situmorang, an Informatics Engineering student.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
