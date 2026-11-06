"use client";

import * as React from "react";
import type { FC } from "react";
import { cn } from "cn";
import { Label as LabelPrimitive } from "radix-ui";

const Label: FC<React.ComponentProps<typeof LabelPrimitive.Root>> = ({
  className,
  ...props
}) => (
  <LabelPrimitive.Root
    data-slot="label"
    className={cn(
      "flex items-center gap-control text-label leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

export { Label };
