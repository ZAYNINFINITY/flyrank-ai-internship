"use client";

import { useState, type FormEvent } from "react";
import { S } from "@/components/ops/theme";

/*
 * ContactForm — Foyer's one working feature (General AI Fluency: "Make It
 * Do Something").
 *
 * A real, end-to-end contact form with no backend of our own: the browser
 * submits the form directly to Formspree's free tier (/f/mppzpalb), which
 * HTTPS-forwards it to the owner's inbox. That keeps deployment free-tier
 * and secret-free (no SMTP, no serverless keys), and a real submission
 * actually reaches the owner — not a pretend "we'll get back to you".
 *
 * State machine is tiny and explicit (idle → submitting → success / error),
 * matching the motion language of the rest of the site. Reduced-motion is
 * honoured by the global CSS collapse, so feedback stays but never animates.
 */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mppzpalb";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return; // ignore double-submits

    setStatus("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error"); // network / CORS failure
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: S.surface,
    border: `1px solid ${S.border}`,
    color: S.text,
    borderRadius: "3px",
    padding: "12px 14px",
    fontSize: "15px",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: S.muted,
    marginBottom: "8px",
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Contact ZAYNINFINITY"
      className="mx-auto w-full max-w-[560px]"
    >
      {/* Honeypot — hidden from humans and screen readers, catches bots. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" style={labelStyle}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            style={inputStyle}
            className="placeholder:text-muted"
          />
        </div>
        <div>
          <label htmlFor="contact-email" style={labelStyle}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            style={inputStyle}
            className="placeholder:text-muted"
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="contact-message" style={labelStyle}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="What would you like to talk about?"
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          className="placeholder:text-muted"
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[3px] px-8 py-3 font-body text-sm font-medium text-white transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-60"
          style={{ backgroundColor: S.accent }}
        >
          {status === "submitting"
            ? "Sending…"
            : status === "success"
              ? "Message sent ✓"
              : "Send message"}
        </button>

        <p
          role={status === "error" ? "alert" : undefined}
          aria-live="polite"
          className="text-[13px] leading-[1.6]"
          style={{
            color:
              status === "error" ? S.accent : status === "success" ? "rgba(46,40,33,0.6)" : S.muted,
          }}
        >
          {status === "error" && "Something went wrong — please try again."}
          {status === "success" &&
            "Thanks! Your message is on its way."}
          {status === "idle" &&
            "Sent securely via Formspree — straight to my inbox."}
        </p>
      </div>
    </form>
  );
}
