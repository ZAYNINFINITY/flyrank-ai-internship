import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type FrameProps = ComponentProps<"div">;

export function Frame({ className, children, ...props }: FrameProps) {
  return (
    <div
      className={cn(
        "rounded-[3px] border border-text/10 p-6",
        "transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
