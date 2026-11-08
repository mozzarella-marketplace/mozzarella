"use client";

import * as React from "react";
import type { FC } from "react";
import { cn } from "./cn";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

const ScrollArea: FC<React.ComponentProps<typeof ScrollAreaPrimitive.Root>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
};

const ScrollBar: FC<
  React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
> = ({ className, orientation = "vertical", ...props }) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex touch-none p-px select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-s data-vertical:border-s-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-pill bg-border"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
};

export { ScrollArea, ScrollBar };
