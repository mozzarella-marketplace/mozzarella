import type { FC } from "react";
import { Users } from "lucide-react";
import { getMessages } from "@/lib/i18n/messages";

export const CustomerEmptyState: FC = () => {
  const { marketplace } = getMessages();

  return (
    <div className="flex flex-col items-center gap-control rounded-panel border border-dashed border-border bg-surface px-content py-section text-center">
      <span className="flex size-14 items-center justify-center rounded-tile bg-secondary text-primary">
        <Users aria-hidden="true" className="size-7" />
      </span>
      <h2 className="text-title font-bold">{marketplace.emptyState.title}</h2>
      <p className="text-muted">{marketplace.emptyState.description}</p>
    </div>
  );
};
