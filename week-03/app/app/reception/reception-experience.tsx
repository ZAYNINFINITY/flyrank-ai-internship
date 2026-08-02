import Link from "next/link";

export function ReceptionExperience() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] text-center px-6">
      <h1 className="font-heading text-3xl md:text-5xl tracking-tight">
        Welcome to Plinth
      </h1>
      <p className="mt-6 max-w-md text-sm md:text-base opacity-60 leading-relaxed">
        A digital museum of developer projects. Each room holds an exhibit —
        step through the corridor to begin the tour.
      </p>
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/gallery"
          className="inline-block border border-[var(--color-text)]/20 px-8 py-4 text-sm uppercase tracking-[0.2em] hover:border-[var(--color-text)]/50 transition-all duration-500"
        >
          Enter the Gallery
        </Link>
        <Link
          href="/collection"
          className="inline-block border border-[var(--color-text)]/10 px-8 py-4 text-sm uppercase tracking-[0.2em] opacity-50 hover:opacity-100 hover:border-[var(--color-text)]/30 transition-all duration-500"
        >
          Browse Collections
        </Link>
      </div>
    </div>
  );
}
