import { GhostButton } from "@/components/primitives/ghost-button";

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
          <GhostButton>Sign in</GhostButton>
        </div>
      </div>
    </section>
  );
}
