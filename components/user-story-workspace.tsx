"use client";

import { useState, type FC } from "react";
import { ClipboardList, Lightbulb, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserStoryEditor } from "@/components/user-story-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgrammingLanguage } from "@/lib/generated/prisma/enums";
import { getMessages } from "@/lib/i18n/messages";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type UserStoryWorkspaceProps = {
  customerId: string;
  customerName: string;
  savedContent: string | null;
  savedLanguage: ProgrammingLanguage | null;
};

const programmingLanguages = Object.values(ProgrammingLanguage);

const detailPanelClassName = "rounded-panel bg-neutral-soft p-content";

export const UserStoryWorkspace: FC<UserStoryWorkspaceProps> = ({
  customerId,
  customerName,
  savedContent,
  savedLanguage,
}) => {
  const messages = getMessages();
  const [content, setContent] = useState(savedContent ?? "");
  const [isContentEmpty, setIsContentEmpty] = useState(!savedContent);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [language, setLanguage] = useState<ProgrammingLanguage | undefined>(
    savedLanguage ?? undefined,
  );

  const isSaveDisabled = isContentEmpty || status === "saving";

  const handleSave = async () => {
    setStatus("saving");

    try {
      const response = await fetch(`/api/user-story/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, language: language ?? null }),
      });

      setStatus(response.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Card className="w-full min-w-0 max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-heading font-bold">
          <ClipboardList aria-hidden className="size-6 text-primary" />
          {messages.userStory.title(customerName)}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className={`${detailPanelClassName} flex flex-wrap items-center justify-between gap-2`}
        >
          <Label htmlFor="user-story-language" className="text-body text-muted">
            {messages.userStory.language}
          </Label>
          <Select
            value={language ?? ""}
            onValueChange={(value) => {
              setLanguage(
                programmingLanguages.find(
                  (programmingLanguage) => programmingLanguage === value,
                ),
              );
              setStatus("idle");
            }}
          >
            <SelectTrigger
              id="user-story-language"
              className="min-w-40 border-border bg-background font-mono font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <SelectValue
                placeholder={messages.userStory.languagePlaceholder}
              />
            </SelectTrigger>
            <SelectContent>
              {programmingLanguages.map((programmingLanguage) => (
                <SelectItem
                  key={programmingLanguage}
                  value={programmingLanguage}
                  className="font-mono"
                >
                  <bdi>
                    {messages.programmingLanguages[programmingLanguage]}
                  </bdi>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={`${detailPanelClassName} flex flex-col gap-control`}>
          <Label id="user-story-content-label" className="text-body text-muted">
            {messages.userStory.label}
          </Label>
          <UserStoryEditor
            labelId="user-story-content-label"
            initialContent={savedContent ?? ""}
            placeholder={messages.userStory.placeholder(customerName)}
            onChange={({ html, isEmpty }) => {
              setContent(html);
              setIsContentEmpty(isEmpty);
              setStatus("idle");
            }}
          />
        </div>

        <aside className="flex gap-control rounded-panel bg-accent/15 p-content">
          <Lightbulb
            aria-hidden
            className="size-5 shrink-0 text-accent-strong"
          />
          <div className="flex flex-col gap-1">
            <p className="text-label font-bold">
              {messages.userStory.tip.title}
            </p>
            <p className="italic text-muted">{messages.userStory.tip.body}</p>
          </div>
        </aside>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaveDisabled}
          size="lg"
          className="font-bold"
        >
          <Save aria-hidden />
          {messages.userStory.save}
        </Button>
        {status === "saving" && (
          <span role="status" className="text-label text-muted">
            {messages.userStory.status.saving}
          </span>
        )}
        {status === "saved" && (
          <span role="status" className="text-label text-success">
            {messages.userStory.status.saved}
          </span>
        )}
        {status === "error" && (
          <span role="alert" className="text-label text-destructive">
            {messages.userStory.status.error}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};
