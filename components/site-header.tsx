import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";
import type { StudentData } from "@/types/student";

export const SiteHeader: FC<{ studentData: StudentData }> = ({
  studentData,
}) => {
  const { app, brand, navigation, appShell } = getMessages();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-section gap-y-control px-page-inline py-control">
        <Link
          href="/marketplace"
          className="flex items-center gap-2 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex size-9 items-center justify-center rounded-tile bg-secondary text-primary">
            <Image
              src="/solve.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-cover object-left"
              unoptimized
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-title font-extrabold text-primary">
              {app.title}
            </span>
            <span className="text-caption text-muted">{brand.tagline}</span>
          </span>
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
