"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

const navLinks = [
  { label: "Museum", href: "/entrance" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-5 sm:px-8 md:px-12">
        <Link
          href="/"
          className="font-heading text-sm font-medium text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Plinth
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-sm text-text/60 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu trigger — text only, no hamburger */}
        <button
          onClick={() => setIsOpen(true)}
          className="min-h-[44px] min-w-[44px] font-body text-sm text-text/60 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
        >
          Menu
        </button>
      </header>

      {/* Mobile full-screen overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-50 flex flex-col bg-background px-6 py-5 md:hidden"
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-heading text-sm font-medium text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={() => setIsOpen(false)}
            >
              Plinth
            </Link>
            <button
              ref={closeButtonRef}
              onClick={() => setIsOpen(false)}
              className="min-h-[44px] min-w-[44px] font-body text-sm text-text/60 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Close
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-heading text-[24px] text-text transition-colors duration-200 hover:text-text/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
