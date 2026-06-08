import type { Metadata } from "next";
import { ThemeTransition } from "@/components/ThemeTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bunga's Digital Archive",
  description:
    "Warm retro portfolio for Bunga Citra Lestari Situmorang, an Informatics Engineering student.",
};

const themeInitScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("bunga-theme-mode");
    const mode =
      storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
        ? storedTheme
        : "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme = mode === "system" ? (prefersDark ? "dark" : "light") : mode;

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        <ThemeTransition />
        {children}
      </body>
    </html>
  );
}
