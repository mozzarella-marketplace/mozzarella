import { Pizza } from "lucide-react";
import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";

export function SiteHeader() {
  const { brand, navigation } = getMessages();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-section gap-y-control px-page-inline py-control">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex size-9 items-center justify-center rounded-tile bg-secondary text-primary">
            <Pizza aria-hidden="true" className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-title font-extrabold text-primary">
              {brand.name}
            </span>
            <span className="text-caption text-muted">{brand.tagline}</span>
          </span>
        </Link>
        <nav aria-label={navigation.label}>
          <ul className="flex flex-wrap items-center gap-1 text-label font-medium">
            <li>
              <Link
                href="/"
                className="block rounded-control bg-primary px-3 py-1.5 text-primary-foreground transition-colors duration-standard ease-standard hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
              >
                {navigation.marketplace}
              </Link>
            </li>
            {navigation.upcoming.map((label) => (
              <li key={label}>
                <span
                  aria-disabled="true"
                  className="block px-3 py-1.5 text-muted"
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
