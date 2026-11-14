"use client";

import { useEffect, useRef, useState, type FC } from "react";
import { Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n/messages";
import {
  productTipDeliveryResponseSchema,
  type DeliveredProductTip,
} from "@/lib/product-tips/delivery-response";

type TipState =
  | { kind: "loading" }
  | { kind: "ready"; tip: DeliveredProductTip }
  | { kind: "empty" }
  | { kind: "error" };

const requestProductTip = async (): Promise<TipState> => {
  try {
    const response = await fetch("/api/product-tips/next", {
      method: "POST",
      cache: "no-store",
    });

    if (!response.ok) {
      return { kind: "error" };
    }

    const parsed = productTipDeliveryResponseSchema.safeParse(
      await response.json(),
    );

    if (!parsed.success) {
      return { kind: "error" };
    }

    return parsed.data.tip
      ? { kind: "ready", tip: parsed.data.tip }
      : { kind: "empty" };
  } catch {
    return { kind: "error" };
  }
};

// Delivers one tip per mount of the card, which happens only when a student actually opens a customer page. The
// request is kept per component instance, so Strict Mode's repeated effect and later rerenders reuse it instead of
// consuming another tip, and a response arriving after the student navigates away is ignored.
export const ProductTipCard: FC = () => {
  const messages = getMessages().productTip;
  const [state, setState] = useState<TipState>({ kind: "loading" });
  const requestRef = useRef<Promise<TipState> | null>(null);

  useEffect(() => {
    let isCurrent = true;

    requestRef.current ??= requestProductTip();
    void requestRef.current.then((result) => {
      if (isCurrent) {
        setState(result);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const retry = () => {
    setState({ kind: "loading" });
    const request = requestProductTip();
    requestRef.current = request;
    void request.then((result) => {
      if (requestRef.current === request) {
        setState(result);
      }
    });
  };

  return (
    <section
      aria-labelledby="product-tip-label"
      className="flex flex-col gap-control rounded-panel border border-primary/30 border-s-4 border-s-primary bg-secondary p-content"
    >
      <p
        id="product-tip-label"
        className="flex items-center gap-2 text-label font-bold text-secondary-foreground"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-tile bg-primary text-primary-foreground">
          <Lightbulb aria-hidden className="size-4" />
        </span>
        {messages.label}
      </p>
      <div
        aria-live="polite"
        aria-busy={state.kind === "loading"}
        className="flex flex-col gap-2"
      >
        {state.kind === "loading" && (
          <p className="text-muted">{messages.loading}</p>
        )}
        {state.kind === "ready" && (
          <>
            <h3 className="text-title font-bold">{state.tip.title}</h3>
            <p>{state.tip.body}</p>
            <p className="rounded-control bg-background p-control font-medium">
              <span className="font-bold text-secondary-foreground">
                {messages.actionLabel}
              </span>{" "}
              {state.tip.action}
            </p>
          </>
        )}
        {state.kind === "empty" && (
          <p className="text-muted">{messages.empty}</p>
        )}
        {state.kind === "error" && (
          <div className="flex flex-wrap items-center gap-control">
            <p className="text-destructive">{messages.error}</p>
            <Button type="button" onClick={retry}>
              <RotateCcw aria-hidden />
              {messages.retry}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
