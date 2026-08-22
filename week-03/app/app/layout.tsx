import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Link from "next/link";
import { Nav } from "@/components/primitives/nav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Foyer — Open digital museum for developers",
  description:
    "An open-source platform where developers exhibit their work as curated collections. Not a card grid — a gallery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:inset-x-0 focus:top-0 focus:z-[100] focus:bg-background focus:px-6 focus:py-3 focus:text-sm focus:font-medium focus:text-text focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="flex items-center gap-6 border-t border-text/10 px-6 py-6 sm:px-8 md:px-12">
          <Link
            href="/about"
            className="font-body text-sm text-text/40 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            About
          </Link>
          <Link
            href="/dashboard"
            className="font-body text-sm text-text/40 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Dashboard
          </Link>
        </footer>
      </body>
    </html>
  );
}
