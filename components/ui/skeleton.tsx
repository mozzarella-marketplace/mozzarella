import { cn } from "cn";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-md bg-muted/25", className)}
    {...props}
  />
);

export { Skeleton };
