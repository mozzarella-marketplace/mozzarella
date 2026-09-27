"use client";

import { useState } from "react";
import { getMessages } from "@/lib/i18n/messages";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type UserStoryWorkspaceProps = {
  sessionId: string;
};

export function UserStoryWorkspace({ sessionId }: UserStoryWorkspaceProps) {
  const messages = getMessages();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");

  const isSaveDisabled = content.trim().length === 0 || status === "saving";

  async function handleSave() {
    setStatus("saving");

    try {
      const response = await fetch(`/api/user-story/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      setStatus(response.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="flex flex-col gap-content">
      <label
        htmlFor="user-story-content"
        className="text-label font-medium text-foreground"
      >
        {messages.userStory.label}
      </label>
      <textarea
        id="user-story-content"
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          setStatus("idle");
        }}
        placeholder={messages.userStory.placeholder}
        rows={8}
        className="rounded-panel border border-border bg-background p-control text-body text-foreground outline-none transition-colors duration-standard focus-visible:border-primary"
      />
      <div className="flex items-center gap-control">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="rounded-control bg-primary px-content py-control font-medium text-primary-foreground transition-opacity duration-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
        >
          {messages.userStory.save}
        </button>
        {status === "saving" && (
          <span role="status" className="text-label text-muted">
            {messages.userStory.status.saving}
          </span>
        )}
        {status === "saved" && (
          <span role="status" className="text-label text-muted">
            {messages.userStory.status.saved}
          </span>
        )}
        {status === "error" && (
          <span role="alert" className="text-label text-destructive">
            {messages.userStory.status.error}
          </span>
        )}
      </div>
    </section>
  );
}
