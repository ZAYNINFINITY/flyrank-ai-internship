import Link from "next/link";
import type { Direction } from "@/lib/navigation/museum-layout";
import { getDirectionLabel, getDirectionSymbol } from "@/lib/navigation/museum-layout";

export function SpaceDoor({
  href,
  label,
  description,
  variant = "path",
  direction,
}: {
  href: string;
  label: string;
  description?: string;
  variant?: "path" | "return";
  direction?: Direction;
}) {
  if (variant === "return") {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity duration-300"
      >
        <span aria-hidden="true">&larr;</span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block border border-[var(--color-text)]/15 rounded-none px-8 py-6 hover:border-[var(--color-text)]/40 transition-all duration-500"
    >
      {direction && (
        <p className="text-xs uppercase tracking-[0.25em] opacity-30 mb-2">
          {getDirectionSymbol(direction)} {getDirectionLabel(direction)}
        </p>
      )}
      <span className="block font-heading text-lg tracking-tight">{label}</span>
      {description && (
        <span className="block mt-2 text-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </span>
      )}
    </Link>
  );
}
