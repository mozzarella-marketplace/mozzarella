"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import type { FC } from "react";
import { getMessages } from "@/lib/i18n/messages";

const messages = getMessages().app.error;

const ErrorPage: FC<{ reset: () => void }> = ({ reset }) => {
  const router = useRouter();

  const retry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-content p-page-inline text-center">
      <h1 className="text-heading font-semibold">{messages.title}</h1>
      <p role="alert">{messages.description}</p>
      <button
        type="button"
        onClick={retry}
        className="rounded-control bg-primary px-content py-control font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        {messages.retry}
      </button>
    </main>
  );
};

export default ErrorPage;
