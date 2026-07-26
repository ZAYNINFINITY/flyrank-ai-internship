import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SpotlightButtonProps = ComponentProps<"button">;

export function SpotlightButton({
  className,
  children,
  ...props
}: SpotlightButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-[44px] min-w-[44px] items-center justify-center",
        "rounded-[3px] bg-accent px-8 py-3",
        "font-body text-sm font-medium text-white",
        "transition-opacity duration-200",
        "hover:opacity-90",
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
