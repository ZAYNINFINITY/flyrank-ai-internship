import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactElement,
  type ReactNode,
} from "react";

export interface ModalProps {
  trigger: ReactElement<{ onClick?: () => void }>;
  title: string;
  description?: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
}

export function Modal({ trigger, title, description, children }: ModalProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = "modal-title--" + title.replace(/\s+/g, "-").toLowerCase();

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.querySelector<HTMLElement>("button, a, [tabindex]")?.focus();
    });
  }, []);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const focusable = getFocusable(dialogRef.current);
    focusable[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  return (
    <>
      <span
        ref={triggerRef}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen(true); }}
      >
        {trigger}
      </span>

      {open && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            style={{
              background: "#fff", color: "#111",
              maxWidth: "480px", width: "90%",
              padding: "24px", borderRadius: "4px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              outline: "none",
            }}
          >
            <h2
              id={titleId}
              style={{ margin: "0 0 8px", fontSize: "1.25rem", fontWeight: 600 }}
            >
              {title}
            </h2>

            {description && (
              <p style={{ margin: "0 0 16px", fontSize: "0.875rem", opacity: 0.6 }}>
                {description}
              </p>
            )}

            <div>{children}</div>

            <button
              onClick={close}
              style={{
                marginTop: "16px", padding: "8px 16px",
                border: "1px solid #ccc", borderRadius: "4px",
                background: "transparent", cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
