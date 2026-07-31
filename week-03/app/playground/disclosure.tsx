import { useState, useId, type ReactNode } from "react";

export interface DisclosureProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const buttonId = useId();
  const regionId = useId();

  return (
    <div>
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          background: "transparent",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 500,
          textAlign: "left",
          color: "#111",
        }}
      >
        <span
          style={{
            display: "inline-block",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            fontSize: "0.75rem",
          }}
        >
          &#9654;
        </span>
        {title}
      </button>

      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          overflow: "hidden",
          maxHeight: open ? "500px" : "0",
          opacity: open ? 1 : 0,
          transition: "max-height 0.3s ease, opacity 0.25s ease, margin 0.25s ease",
          marginTop: open ? "8px" : "0",
        }}
      >
        <div style={{ padding: "12px", fontSize: "0.875rem", lineHeight: 1.6, color: "#444" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
