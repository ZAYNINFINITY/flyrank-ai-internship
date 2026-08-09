"use client";

import { useState } from "react";
import { GhostButton } from "@/components/primitives/ghost-button";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const emailValue = email.trim();
    if (!emailValue) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      next.email = "Enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setIsSubmitting(true);
    // Authentication isn't connected yet — this is a validated form only.
    setTimeout(() => setIsSubmitting(false), 800);
  };

  return (
    <section className="flex min-h-[100dvh] items-center px-6 sm:px-8 md:px-12">
      <div className="mx-auto w-full max-w-[400px]">
        <h1 className="font-heading text-[28px] font-medium text-text md:text-[36px]">
          Sign in
        </h1>
        <p className="mt-2 font-body text-[14px] text-text/40">
          This is a placeholder — authentication isn&apos;t connected yet.
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block font-body text-[13px] text-text/50"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-[3px] border border-text/15 bg-transparent px-4 py-3 font-body text-[15px] text-text placeholder:text-text/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-1.5 font-body text-[12px] text-red-600"
              >
                {errors.email}
              </p>
            )}
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
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="w-full rounded-[3px] border border-text/15 bg-transparent px-4 py-3 font-body text-[15px] text-text placeholder:text-text/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="mt-1.5 font-body text-[12px] text-red-600"
              >
                {errors.password}
              </p>
            )}
          </div>
          <div className="mt-2">
            <GhostButton type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </GhostButton>
          </div>
        </form>
      </div>
    </section>
  );
}
