import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type MuseumTagLabelProps = ComponentProps<"span"> & {
  variant: "live" | "placeholder";
};

export function MuseumTagLabel({
  variant,
  className,
  children,
  ...props
}: MuseumTagLabelProps) {
  return (
    <span
      className={cn(
        "inline-block font-body text-[11px] uppercase tracking-[0.05em]",
        variant === "live" && "text-accent",
        variant === "placeholder" && "text-text/40",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
