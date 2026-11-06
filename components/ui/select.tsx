"use client";

import * as React from "react";
import type { FC } from "react";
import { cn } from "./cn";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

const Select: FC<React.ComponentProps<typeof SelectPrimitive.Root>> = (
  props,
) => <SelectPrimitive.Root data-slot="select" {...props} />;

const SelectValue: FC<React.ComponentProps<typeof SelectPrimitive.Value>> = (
  props,
) => <SelectPrimitive.Value data-slot="select-value" {...props} />;

const SelectTrigger: FC<
  React.ComponentProps<typeof SelectPrimitive.Trigger>
> = ({ className, children, ...props }) => (
  <SelectPrimitive.Trigger
    data-slot="select-trigger"
    className={cn(
      "flex h-9 w-fit items-center justify-between gap-control rounded-control border border-border bg-background px-content py-control text-label whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:outline-2 aria-invalid:outline-destructive data-[placeholder]:text-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectContent: FC<
  React.ComponentProps<typeof SelectPrimitive.Content>
> = ({ className, children, position = "popper", ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      data-slot="select-content"
      position={position}
      className={cn(
        "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-control border border-border bg-background shadow-floating data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem: FC<React.ComponentProps<typeof SelectPrimitive.Item>> = ({
  className,
  children,
  ...props
}) => (
  <SelectPrimitive.Item
    data-slot="select-item"
    className={cn(
      "relative flex w-full cursor-default items-center gap-control rounded-control py-1.5 ps-content pe-8 text-label outline-none select-none focus:bg-neutral-soft data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute end-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
