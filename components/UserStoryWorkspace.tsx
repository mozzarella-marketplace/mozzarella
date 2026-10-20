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
import { UserStoryEditor } from "@/components/UserStoryEditor";
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
  sessionId: string;
};

const programmingLanguages = Object.values(ProgrammingLanguage);

const specRowClassName = "rounded-panel bg-foreground-1 p-content";

export const UserStoryWorkspace: FC<UserStoryWorkspaceProps> = ({
  sessionId,
}) => {
  const messages = getMessages();
  const [content, setContent] = useState("");
  const [isContentEmpty, setIsContentEmpty] = useState(true);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [language, setLanguage] = useState<ProgrammingLanguage>();

  const isSaveDisabled = isContentEmpty || status === "saving";

  const handleSave = async () => {
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
  };

  return (
    <Card className="w-full max-w-2xl gap-content bg-background py-6 shadow-panel">
      <CardHeader className="px-6">
        <CardTitle className="flex items-center gap-2 text-heading font-bold">
          <ClipboardList aria-hidden className="size-6 text-primary-1" />
          {messages.userStory.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-control px-6">
        <div
          className={`${specRowClassName} flex flex-wrap items-center justify-between gap-2`}
        >
          <Label htmlFor="user-story-language" className="text-body text-muted">
            {messages.userStory.language}
          </Label>
          <Select
            value={language}
            onValueChange={(value) =>
              setLanguage(
                programmingLanguages.find(
                  (programmingLanguage) => programmingLanguage === value,
                ),
              )
            }
          >
            <SelectTrigger
              id="user-story-language"
              className="min-w-40 border-foreground-2 bg-background font-mono font-bold text-primary-1 focus-visible:border-primary-2 focus-visible:ring-primary-2/30"
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

        <div className={`${specRowClassName} flex flex-col gap-control`}>
          <Label id="user-story-content-label" className="text-body text-muted">
            {messages.userStory.label}
          </Label>
          <UserStoryEditor
            labelId="user-story-content-label"
            onChange={({ html, isEmpty }) => {
              setContent(html);
              setIsContentEmpty(isEmpty);
              setStatus("idle");
            }}
          />
        </div>

        <aside className="flex gap-control rounded-panel bg-accent/15 p-content">
          <Lightbulb aria-hidden className="size-5 shrink-0 text-accent-2" />
          <div className="flex flex-col gap-1">
            <p className="text-label font-bold">
              {messages.userStory.tip.title}
            </p>
            <p className="italic text-muted">{messages.userStory.tip.body}</p>
          </div>
        </aside>
      </CardContent>

      <CardFooter className="gap-control border-none bg-transparent px-6 pt-0">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="bg-btn-primary px-content py-5 font-bold text-primary-foreground hover:bg-btn-primary/90"
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
