"use client";

import { GhostButton } from "@/components/primitives/ghost-button";

export default function LoginPage() {
  return (
    <section className="flex min-h-[100dvh] items-center px-6 sm:px-8 md:px-12">
      <div className="mx-auto w-full max-w-[400px]">
        <h1 className="font-heading text-[28px] font-medium text-text md:text-[36px]">
          Sign in
        </h1>
        <p className="mt-2 font-body text-[14px] text-text/40">
          This is a placeholder — authentication isn&apos;t connected yet.
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block font-body text-[13px] text-text/50"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-[3px] border border-text/15 bg-transparent px-4 py-3 font-body text-[15px] text-text placeholder:text-text/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block font-body text-[13px] text-text/50"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-[3px] border border-text/15 bg-transparent px-4 py-3 font-body text-[15px] text-text placeholder:text-text/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </div>
          <div className="mt-2">
            <GhostButton type="submit" className="w-full">
              Sign in
            </GhostButton>
          </div>
        </form>
      </div>
    </section>
  );
}
