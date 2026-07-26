import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[100dvh] items-center px-6 sm:px-8 md:px-12">
      <div className="mx-auto w-full max-w-[560px]">
        <h1 className="font-heading text-[28px] font-medium text-text md:text-[36px]">
          No exhibit here yet.
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-text/50">
          This page doesn&apos;t exist — or it hasn&apos;t been built yet.
          Either way, there&apos;s nothing to see here.
        </p>
        <div className="mt-8">
          <Link
            href="/explore"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] border border-text/15 bg-transparent px-8 py-3 font-body text-sm font-medium text-text transition-colors duration-200 hover:border-text/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Explore exhibits
          </Link>
        </div>
      </div>
    </section>
  );
}
