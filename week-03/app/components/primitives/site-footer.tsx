"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Global footer shown on non-home routes. The homepage (/ ) owns its whole
// page: the 2D operational room ships its own rich footer (credits + GitHub +
// Portfolio) and the 3D museum portals over everything. Rendering this generic
// footer there too would stack a second About link underneath — so suppress it
// on the homepage only. Other routes (About, Explore, Dashboard, ...) still get
// the shared navigation footer.
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="flex items-center gap-6 border-t border-text/10 px-6 py-6 sm:px-8 md:px-12">
      <Link
        href="/"
        className="font-body text-sm text-text/40 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Foyer
      </Link>
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
  );
}
