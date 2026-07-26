import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type GhostButtonProps = ComponentProps<"button">;

export function GhostButton({
  className,
  children,
  ...props
}: GhostButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-[44px] min-w-[44px] items-center justify-center",
        "rounded-[3px] border border-text/15 bg-transparent px-8 py-3",
        "font-body text-sm font-medium text-text",
        "transition-colors duration-200",
        "hover:border-text/30",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
