import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";
import type { StudentData } from "@/types/student";

export const SiteHeader: FC<{ studentData: StudentData }> = ({
  studentData,
}) => {
  const { app, navigation, appShell } = getMessages();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-section gap-y-control px-page-inline py-control">
        <Link
          href="/marketplace"
          className="relative h-14 w-48 shrink-0 overflow-hidden rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Image
            src="/mozzarella-wordmark.jpg"
            alt={app.title}
            fill
            sizes="192px"
            className="object-cover"
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
        <p className="ms-auto text-label">
          {appShell.student} <bdi>{studentData.studentCode}</bdi> (
          {appShell.class} <bdi>{studentData.classCode}</bdi>)
        </p>
      </div>
    </header>
  );
};
