import { useState, useRef, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [selected, setSelected] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const tablistRef = useRef<HTMLDivElement>(null);

  if (tabs.length === 0) return null;

  function select(id: string) {
    setSelected(id);
    onChange?.(id);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const currentIndex = tabs.findIndex((t) => t.id === selected);
    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const next = tabs[nextIndex];
    select(next.id);

    const tab = tablistRef.current?.querySelector<HTMLElement>(
      `[role="tab"][data-id="${next.id}"]`
    );
    tab?.focus();
  }

  return (
    <div>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Tab navigation"
        onKeyDown={handleKeyDown}
        style={{ display: "flex", gap: "4px", borderBottom: "1px solid #ddd" }}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <button
              key={tab.id}
              data-id={tab.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => select(tab.id)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderBottom: isSelected ? "2px solid #333" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                fontWeight: isSelected ? 600 : 400,
                fontSize: "0.875rem",
                color: isSelected ? "#111" : "#666",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={undefined}
          hidden={tab.id !== selected}
          style={{ padding: "16px 0", fontSize: "0.875rem" }}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
