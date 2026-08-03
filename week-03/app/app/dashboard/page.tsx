import Link from "next/link";

export default function DashboardPage() {
  return (
    <section className="flex min-h-[100dvh] items-center px-6 sm:px-8 md:px-12">
      <div className="mx-auto w-full max-w-[560px]">
        <p className="font-body text-[11px] uppercase tracking-[0.05em] text-text/30">
          Preview
        </p>
        <h1 className="mt-4 font-heading text-[28px] font-medium text-text md:text-[36px]">
          Dashboard
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-text/50 md:text-[17px]">
          Sign in to manage your exhibit, update your project descriptions, and
          track who&apos;s visited. This dashboard is a preview — authentication
          isn&apos;t wired up yet, but the exhibit pages are live.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] border border-text/15 bg-transparent px-8 py-3 font-body text-sm font-medium text-text transition-colors duration-200 hover:border-text/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
