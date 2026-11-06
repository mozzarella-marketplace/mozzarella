import * as React from "react";
import type { FC } from "react";
import { cn } from "./cn";

const Card: FC<React.ComponentProps<"div">> = ({ className, ...props }) => (
  <div
    data-slot="card"
    className={cn(
      "flex flex-col gap-content rounded-panel border border-border bg-background p-content text-body text-foreground shadow-panel content:p-section",
      className,
    )}
    {...props}
  />
);

const CardHeader: FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    data-slot="card-header"
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
);

const CardTitle: FC<React.ComponentProps<"h2">> = ({ className, ...props }) => (
  <h2
    data-slot="card-title"
    className={cn("text-title leading-snug font-semibold", className)}
    {...props}
  />
);

const CardContent: FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    data-slot="card-content"
    className={cn("flex flex-col gap-control", className)}
    {...props}
  />
);

const CardFooter: FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    data-slot="card-footer"
    className={cn("flex flex-wrap items-center gap-control", className)}
    {...props}
  />
);

export { Card, CardHeader, CardFooter, CardTitle, CardContent };
