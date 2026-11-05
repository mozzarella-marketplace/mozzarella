import type { FC } from "react";
export const CustomerAvatar: FC<{ avatar: string }> = ({ avatar }) => {
  return (
    <span
      aria-hidden="true"
      className="flex size-14 shrink-0 items-center justify-center rounded-tile bg-secondary text-heading"
    >
      {avatar}
    </span>
  );
};
