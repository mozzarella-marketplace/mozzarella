import * as React from "react";
import type { FC } from "react";
import { cn } from "./cn";

const Input: FC<React.ComponentProps<"input">> = ({
  className,
  type,
  ...props
}) => (
  <input
    type={type}
    data-slot="input"
    className={cn(
      "h-9 w-full min-w-0 rounded-control border border-border bg-background px-content py-control text-body outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:outline-2 aria-invalid:outline-destructive",
      className,
    )}
    {...props}
  />
);

export { Input };
