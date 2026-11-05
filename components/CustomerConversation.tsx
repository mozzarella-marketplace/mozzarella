"use client";

import { useEffect, useRef, useState, type FC, type FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationRole } from "@/lib/generated/prisma/enums";
import { getMessages } from "@/lib/i18n/messages";
import { z } from "zod";

type ConversationMessage = {
  id: string;
  role: ConversationRole;
  content: string;
};

type CustomerConversationProps = {
  customerId: string;
  initialMessages: ConversationMessage[];
};

const conversationResponseSchema = z.object({
  reply: z.string().optional(),
});

export const CustomerConversation: FC<CustomerConversationProps> = ({
  customerId,
  initialMessages,
}) => {
  const messages = getMessages().conversation;
  const [conversation, setConversation] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const conversationRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!isSending) {
      return;
    }

    const timeout = setTimeout(() => setIsTyping(true), 500);
    return () => clearTimeout(timeout);
  }, [isSending]);

  useEffect(() => {
    const conversationElement = conversationRef.current;
    if (conversationElement) {
      conversationElement.scrollTop = conversationElement.scrollHeight;
    }
  }, [conversation, isTyping]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();

    if (!message || isSending) {
      return;
    }

    const messageId = crypto.randomUUID();
    let receivedReply = false;

    setConversation((current) => [
      ...current,
      { id: messageId, role: ConversationRole.user, content: message },
    ]);
    setDraft("");
    setIsSending(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/conversations/${customerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const result = conversationResponseSchema.safeParse(
        await response.json(),
      );

      if (!response.ok || !result.success || !result.data.reply) {
        setErrorMessage(
          response.status === 429 ? messages.dailyLimit : messages.error,
        );
        return;
      }

      const reply = result.data.reply;

      setConversation((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: ConversationRole.assistant,
          content: reply,
        },
      ]);
      receivedReply = true;
    } catch {
      setErrorMessage(messages.error);
    } finally {
      if (!receivedReply) {
        setConversation((current) =>
          current.filter(({ id }) => id !== messageId),
        );
        setDraft(message);
      }
      setIsTyping(false);
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl gap-content bg-background py-6 shadow-panel">
      <CardHeader className="px-6">
        <CardTitle className="flex items-center gap-2 text-heading font-bold">
          <MessageCircle aria-hidden className="size-6 text-primary-1" />
          {messages.title}
        </CardTitle>
        <p className="text-label text-muted">{messages.notice}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-control px-6">
        <ol
          ref={conversationRef}
          aria-live="polite"
          className="flex max-h-96 min-h-24 flex-col gap-control overflow-y-auto"
        >
          {conversation.map((message) => (
            <li
              key={message.id}
              className={`max-w-[85%] whitespace-pre-wrap rounded-panel px-content py-control ${
                message.role === ConversationRole.assistant
                  ? "self-start bg-foreground-1"
                  : "self-end bg-primary-1 text-primary-foreground"
              }`}
            >
              {message.content}
            </li>
          ))}
          {conversation.length === 0 && (
            <li className="self-start rounded-panel bg-foreground-1 px-content py-control text-muted">
              {messages.empty}
            </li>
          )}
          {isTyping && (
            <li
              role="status"
              className="flex w-fit items-center gap-1 self-start rounded-panel bg-foreground-1 px-content py-control"
            >
              <span className="sr-only">{messages.waiting}</span>
              <span
                aria-hidden
                className="size-2 animate-bounce rounded-full bg-muted motion-reduce:animate-none"
              />
              <span
                aria-hidden
                className="size-2 animate-bounce rounded-full bg-muted [animation-delay:-0.2s] motion-reduce:animate-none"
              />
              <span
                aria-hidden
                className="size-2 animate-bounce rounded-full bg-muted [animation-delay:-0.4s] motion-reduce:animate-none"
              />
            </li>
          )}
        </ol>
        <form onSubmit={handleSubmit} className="flex flex-col gap-control">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={messages.placeholder}
            maxLength={1_500}
            rows={3}
            disabled={isSending}
            aria-label={messages.inputLabel}
            className="w-full resize-y rounded-control border border-border bg-background px-content py-control text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          />
          {errorMessage && (
            <p role="alert" className="text-label text-destructive">
              {errorMessage}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-control">
            <span className="text-label text-muted">{messages.privacy}</span>
            <Button
              type="submit"
              disabled={!draft.trim() || isSending}
              className="bg-btn-primary font-bold text-primary-foreground hover:bg-btn-primary/90"
            >
              <Send aria-hidden />
              {isSending ? messages.sending : messages.send}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
