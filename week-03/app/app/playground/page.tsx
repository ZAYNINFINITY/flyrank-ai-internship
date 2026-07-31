"use client";

import { Modal } from "@/playground/modal";
import { Tabs } from "@/playground/tabs";
import { Disclosure } from "@/playground/disclosure";

export default function PlaygroundPage() {
  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "8px" }}>
        Accessible Component Playground
      </h1>
      <p style={{ fontSize: "0.875rem", opacity: 0.5, marginBottom: "40px" }}>
        FE-05: Modal, Tabs, Disclosure — built from scratch against ARIA Authoring
        Practices. Test with keyboard: Tab, Escape, arrows.
      </p>

      {/* ─── Modal ──────────────────────────────────────── */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
          Modal Dialog
        </h2>
        <Modal
          trigger={<button style={btnStyle}>Open Modal</button>}
          title="Confirm Action"
          description="This is a focus-trapping modal dialog."
        >
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Tab cycles through focusable elements inside the dialog.
            Escape closes and returns focus to the trigger.
          </p>
        </Modal>
      </section>

      {/* ─── Tabs ────────────────────────────────────────── */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
          Tabs
        </h2>
        <Tabs
          tabs={[
            {
              id: "modal",
              label: "Modal",
              content: <p>Focus-trapping dialog with Escape to close and focus return.</p>,
            },
            {
              id: "tabs",
              label: "Tabs",
              content: (
                <p>
                  Arrow keys navigate tabs. Home/End for first/last.
                  Tab moves into the active tab panel.
                </p>
              ),
            },
            {
              id: "disclosure",
              label: "Disclosure",
              content: <p>Expand/collapse with aria-expanded, animated via CSS transitions.</p>,
            },
          ]}
        />
      </section>

      {/* ─── Disclosure ──────────────────────────────────── */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
          Disclosure
        </h2>
        <Disclosure title="What ARIA patterns are used here?">
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li>Button with aria-expanded toggles visibility</li>
            <li>Content region linked via aria-labelledby</li>
            <li>Enter/Space toggles the disclosure</li>
            <li>CSS max-height transition for smooth open/close</li>
          </ul>
        </Disclosure>
        <div style={{ marginTop: "8px" }}>
          <Disclosure title="How does this compare to shadcn/ui?">
            <p style={{ margin: 0 }}>
              See <code>playground/NOTES.md</code> for the full comparison
              after installing shadcn dialog and tabs.
            </p>
          </Disclosure>
        </div>
      </section>
    </main>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  background: "transparent",
  cursor: "pointer",
  fontSize: "0.875rem",
};
