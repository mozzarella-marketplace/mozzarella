import * as React from "react";
import type { FC } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border border-transparent bg-clip-padding text-label font-medium whitespace-nowrap transition-colors duration-standard ease-standard outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-muted hover:text-foreground",
      },
      size: {
        default: "min-h-9 gap-control px-content py-control",
        lg: "min-h-12 gap-control px-content py-control text-title",
        "icon-sm": "size-8 p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button: FC<
  React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>
> = ({ className, variant = "default", size = "default", ...props }) => {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { Button };
