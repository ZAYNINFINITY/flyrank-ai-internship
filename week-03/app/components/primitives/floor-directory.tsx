import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type FloorDirectoryItem = {
  number: string;
  label: string;
  href: string;
};

type FloorDirectoryProps = ComponentProps<"nav"> & {
  items: FloorDirectoryItem[];
};

export function FloorDirectory({
  items,
  className,
  ...props
}: FloorDirectoryProps) {
  return (
    <nav aria-label="Exhibit rooms" className={cn("font-body", className)} {...props}>
      {/* Mobile: horizontal scrollable strip */}
      <ol className="flex gap-6 overflow-x-auto pb-2 md:flex-col md:overflow-x-visible md:gap-3 md:pb-0">
        {items.map((item) => (
          <li key={item.number} className="flex-shrink-0">
            <a
              href={item.href}
              className={cn(
                "flex items-baseline gap-3 whitespace-nowrap text-sm text-text/60",
                "transition-colors duration-200",
                "hover:text-text",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              )}
            >
              <span className="font-body text-[11px] uppercase tracking-[0.05em] text-text/40">
                {item.number}
              </span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
