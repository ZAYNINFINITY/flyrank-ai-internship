"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const primaryLinks = [
  { label: "Museum", href: "/entrance" },
  { label: "Explore", href: "/explore" },
  { label: "Shader", href: "/shader-hero" },
  { label: "About Dev", href: "/about" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/ZAYNINFINITY",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zain-ul-abideen-429735231/",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.77 13.02H3.56V9h3.55v11.45Z" />
      </svg>
    ),
  },
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

  const socialClassName =
    "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] text-text/50 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <>
      <header className="flex items-center justify-between px-6 py-5 sm:px-8 md:px-12">
        <Link
          href="/"
          className="font-heading text-sm font-medium text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Foyer
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-sm text-text/60 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-text/10" aria-hidden="true" />
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={socialClassName}
            >
              {link.icon}
            </a>
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
              Foyer
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
            {primaryLinks.map((link) => (
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
          <div className="mt-auto flex gap-4 border-t border-text/10 pt-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 font-body text-sm text-text/60 transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
