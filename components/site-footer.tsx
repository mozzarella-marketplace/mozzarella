import type { FC } from "react";
import { getMessages } from "@/lib/i18n/messages";

export const SiteFooter: FC = () => {
  const { brand } = getMessages();

  return (
    <footer className="border-t border-border bg-surface">
      <p className="mx-auto max-w-content px-page-inline py-content text-caption text-muted">
        {brand.copyright}
      </p>
    </footer>
  );
};
