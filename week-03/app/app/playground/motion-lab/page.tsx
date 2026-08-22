"use client";

import { useState } from "react";
import { MotionButton } from "@/components/primitives/motion-button";
import { motionTokens } from "@/lib/motion/tokens";

/**
 * Motion Lab — reviewers' window into Foyer's interaction language.
 *
 * This page imports the exact production <MotionButton> primitive. Nothing is
 * duplicated here: the demo only adds controls to force each lifecycle state
 * (idle / loading / success / error) on the same component production uses.
 * If production changes, this page reflects it automatically.
 */
export default function MotionLabPage() {
  const [forcedState, setForcedState] = useState<
    "idle" | "loading" | "success" | "error" | undefined
  >(undefined);

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "8px" }}>
        Motion Lab
      </h1>
      <p style={{ fontSize: "0.875rem", opacity: 0.5, marginBottom: "40px" }}>
        Foyer&apos;s interaction language — the same{" "}
        <code>MotionButton</code> used in production (Curator Send, home CTA).
        Every state is a choreographed transform/opacity transition, never a
        snap. Reduced-motion removes the movement but keeps the feedback.
      </p>

      {/* ─── Forced states ─────────────────────────────────── */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
          Controlled states (production component, forced lifecycle)
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {(["idle", "loading", "success", "error"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setForcedState(s)}
              style={{
                padding: "8px 14px",
                border: `1px solid ${forcedState === s ? "#444" : "#ccc"}`,
                borderRadius: "4px",
                background: forcedState === s ? "#eee" : "transparent",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Force {s}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setForcedState(undefined)}
            style={{
              padding: "8px 14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "transparent",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Back to auto
          </button>
        </div>

        <div style={{ marginTop: "24px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <MotionButton
            variant="solid"
            state={forcedState}
            label="Send message"
            loadingLabel="Sending…"
            successLabel="Sent"
            errorLabel="Retry"
          />
          <MotionButton
            variant="outline"
            state={forcedState}
            label="Save changes"
            loadingLabel="Saving…"
            successLabel="Saved"
            errorLabel="Try again"
          />
          <MotionButton
            variant="ghost"
            state={forcedState}
            label="Generate"
            loadingLabel="Generating…"
            successLabel="Generated"
            errorLabel="Failed"
          />
        </div>
      </section>

      {/* ─── Auto async cycle ─────────────────────────────── */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
          Async cycle (uncontrolled — simulated API call)
        </h2>
        <p style={{ fontSize: "0.875rem", opacity: 0.5, marginBottom: "16px" }}>
          Same production component, left to drive its own lifecycle against a
          fake async call with a 20% failure rate.
        </p>
        <MotionButton
          variant="solid"
          label="Deploy"
          loadingLabel="Deploying…"
          successLabel="Deployed"
          errorLabel="Retry"
          onAsyncClick={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            if (Math.random() < 0.2) {
              throw new Error("simulated failure");
            }
          }}
        />
      </section>

      {/* ─── Design note ───────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
          Duration & easing choices
        </h2>
        <ul style={{ fontSize: "0.875rem", lineHeight: 1.8, opacity: 0.7 }}>
          <li>
            <strong>Idle → loading:</strong> label crossfades out over{" "}
            {motionTokens.duration.base}; spinner spins on a linear 600ms loop
            so rotation never feels stuttery.
          </li>
          <li>
            <strong>Loading → success:</strong> checkmark pops in at 320ms with
            an enter easing —             a small overshoot that reads as &quot;done&quot;.
          </li>
          <li>
            <strong>Loading → error:</strong> button shakes once (500ms, sharp
            easing) while the red tint fades in — motion and color say
            &quot;stop&quot; together.
          </li>
          <li>
            <strong>Compositor-friendly:</strong> only <code>transform</code>{" "}
            and <code>opacity</code> animate. No width/height/color transitions,
            so nothing triggers layout thrash mid-state.
          </li>
          <li>
            <strong>Interruptible:</strong> every transition is CSS-driven and
            interruptible by the next click or hover; the async cycle clears its
            reset timer so spam-clicking never double-fires a state.
          </li>
          <li>
            <strong>Reduced motion:</strong> globals collapse animation
            durations to ~0, so the state still swaps instantly — feedback is
            preserved, movement is not.
          </li>
        </ul>
      </section>
    </main>
  );
}
