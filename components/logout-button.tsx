"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { getMessages } from "@/lib/i18n/messages";
import { Button } from "./ui/button";

export const LogoutButton: FC = () => {
  const router = useRouter();
  const messages = getMessages().auth.logout;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasError, setHasError] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    setHasError(false);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (!response.ok) {
        setHasError(true);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setHasError(true);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={logout}
        disabled={isLoggingOut}
        aria-busy={isLoggingOut}
        aria-label={isLoggingOut ? messages.submitting : messages.submit}
        title={messages.submit}
      >
        <LogOut aria-hidden="true" />
      </Button>
      {hasError && (
        <p role="alert" className="text-caption text-destructive">
          {messages.unavailable}
        </p>
      )}
    </div>
  );
};
