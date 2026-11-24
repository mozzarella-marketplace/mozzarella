import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { getMessages } from "@/lib/i18n/messages";
import { LogoutButton } from "./logout-button";

const DEMO_BASIL_LEAF_BALANCE = 240;

export const SiteHeader: FC = () => {
  const { app, navigation, marketplace } = getMessages();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-section gap-y-control px-page-inline py-control">
        <Link
          href="/marketplace"
          className="w-48 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Image
            src="/logo-horizontal.svg"
            alt={app.title}
            width={984}
            height={244}
            sizes="192px"
            className="h-auto w-full"
          />
        </Link>
        <nav aria-label={navigation.label}>
          <ul className="flex flex-wrap items-center gap-1 text-label font-medium">
            <li>
              <Link
                href="/marketplace"
                className="block rounded-control bg-primary px-3 py-1.5 text-primary-foreground transition-colors duration-standard ease-standard hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
              >
                {navigation.marketplace}
              </Link>
            </li>
            <li>
              <span
                aria-disabled="true"
                className="block px-3 py-1.5 text-muted"
              >
                {navigation.factoryShop}
              </span>
            </li>
          </ul>
        </nav>
        <div className="ms-auto flex items-center gap-control">
          <span className="inline-flex items-center gap-1 rounded-pill bg-success-soft px-3 py-1 text-label font-bold text-success-foreground">
            <Leaf aria-hidden="true" className="size-4 shrink-0 fill-current" />
            {marketplace.basilLeaves(DEMO_BASIL_LEAF_BALANCE)}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};
